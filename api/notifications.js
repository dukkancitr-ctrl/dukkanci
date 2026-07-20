// Notification system for Dukkanci — customer inbox + targeted promotional campaigns.
//
// ── Scope ────────────────────────────────────────────────────────────────────
// Two audiences share this endpoint:
//   • Customers/devices (public actions) — register a device, sync a cart
//     summary, read their inbox, mark read, set preferences.
//   • Admin (x-admin-token) — segments, campaign CRUD, build, send, stats.
//
// Requires migrations/20260720_notifications_system.sql to have been run.
// Every action degrades honestly when it hasn't: PGRST205 (missing table) is
// reported as `setup_required` rather than crashing or, worse, reporting a
// success that reached nobody.
//
// ── Channels ─────────────────────────────────────────────────────────────────
//   inapp    — a row in `notifications`. Always works. No external dependency.
//   webpush  — browser push via lib/webpush.js. Works today (VAPID is live).
//   fcm      — Android tray. Built, but INERT until a Firebase project exists;
//              recipients are marked skipped with reason `fcm_not_configured`
//              rather than silently dropped, so the gap stays visible.
//   whatsapp — does NOT re-implement Meta template sending. Build creates a
//              linked row in the existing, production-proven wa_campaigns and
//              the admin sends it through api/campaign.js. One WhatsApp sender,
//              not two.
//
// ── Two lessons from this codebase's fix log, applied deliberately ───────────
//   1. Counters are ALWAYS recounted from notification_recipients, never
//      incremented. The 2026-07-19 WhatsApp incident (a campaign reporting
//      sent_count=65 while 305 rows were actually sent, gaps landing on exact
//      multiples of BATCH_SIZE) was a read-modify-write race on an accumulated
//      counter. Deriving the number makes the operation idempotent and
//      self-healing.
//   2. PostgREST here runs with db-max-rows=1000 and truncates EVERY response
//      silently, whatever `limit=` says. This has caused three separate
//      production undercounts. So: counts come from `Content-Range` via
//      sbCount, and full reads page with Range headers via sbGetAll/sbRpcAll.
//      This matters immediately — the wa_contacts segment alone is 6,334 rows.
//
// ── Routing ──────────────────────────────────────────────────────────────────
// Actions are declared in one table with their required method and auth. This
// is deliberate: api/notify-order.js has separate GET and POST blocks where the
// GET block ends in a bodyless 403, so an action added to the POST half but
// called with GET fails with an unexplained 403 that locks the admin panel.
// A single declarative table makes that class of mistake impossible here.

const crypto = require("crypto");
const { vapidConfigured, sendOnePush } = require("../lib/webpush");
const { fcmConfigured, sendOneFcm } = require("../lib/fcm");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const env = k => (process.env[k] || "").trim();

const BATCH_SIZE = 25;          // recipients processed per send-batch call
const INSERT_CHUNK = 500;       // rows per bulk insert request
const INBOX_LIMIT = 50;
const MAX_ITEM_NAMES = 20;      // cart summary: cap the names we retain

// ─── Auth (identical scheme to api/campaign.js) ──────────────────────────────

function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }

function verifyAdminToken(token) {
  const secret = adminSecret();
  if (!secret) return false;
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return false;
  let payload;
  try { payload = Buffer.from(parts[0], "base64url").toString("utf8"); } catch (e) { return false; }
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(parts[1]);
  const b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const m = /^exp=(\d+)$/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}

function adminOk(req) {
  const tok = (req.headers && (req.headers["x-admin-token"] || req.headers["x-admin-key"])) || "";
  if (tok) return verifyAdminToken(tok);
  const pw = env("ADMIN_PASSWORD");
  if (!pw) return false;
  const rawKey = (req.headers && req.headers["x-admin-key"]) || "";
  const a = Buffer.from(rawKey);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// ─── Supabase helpers ────────────────────────────────────────────────────────

function sb() {
  const url = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || "";
  return { url, key };
}

// Distinguishes "the tables aren't there yet" from a real failure, so the admin
// panel can say «شغّل ملف SQL» instead of showing a broken screen or fake zeros.
function isMissingSchema(text) {
  return /PGRST205|PGRST202|does not exist|schema cache/i.test(String(text || ""));
}

async function sbGet(path) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      return { error: t, missing: isMissingSchema(t) };
    }
    return await r.json().catch(() => null);
  } catch (e) { return { error: e.message }; }
}

// Exact count via Content-Range. Returns null on failure so callers can tell
// "unknown" apart from a real zero — never coerce a failed count to 0.
async function sbCount(path) {
  const { url, key } = sb();
  const sep = path.includes("?") ? "&" : "?";
  try {
    const r = await fetch(`${url}/rest/v1/${path}${sep}select=*`, {
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        Prefer: "count=exact", "Range-Unit": "items", Range: "0-0"
      }
    });
    if (!r.ok) return null;
    const m = /\/(\d+)\s*$/.exec(r.headers.get("content-range") || "");
    return m ? Number(m[1]) : null;
  } catch (e) { return null; }
}

// Fetch EVERY row, paging past db-max-rows. `path` must not carry its own limit=.
async function sbGetAll(path, max = 50000) {
  const { url, key } = sb();
  const PAGE = 1000;
  const out = [];
  for (let from = 0; from < max; from += PAGE) {
    let rows;
    try {
      const r = await fetch(`${url}/rest/v1/${path}`, {
        headers: {
          apikey: key, Authorization: `Bearer ${key}`,
          "Range-Unit": "items", Range: `${from}-${from + PAGE - 1}`
        }
      });
      if (!r.ok) break;
      rows = await r.json().catch(() => null);
    } catch (e) { break; }
    if (!Array.isArray(rows) || rows.length === 0) break;
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return out;
}

async function sbWrite(method, path, body, prefer = "return=representation") {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        "Content-Type": "application/json", Prefer: prefer
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await r.text().catch(() => "");
    if (!r.ok) return { ok: false, status: r.status, error: text, missing: isMissingSchema(text) };
    let json = null;
    try { json = text ? JSON.parse(text) : null; } catch (e) { json = null; }
    return { ok: true, status: r.status, data: json };
  } catch (e) { return { ok: false, status: 0, error: e.message }; }
}

// Call a set-returning Postgres function, paging with Range.
//
// ⚠ RPC responses are capped by db-max-rows exactly like table reads. Without
// this paging the wa_contacts segment would resolve to 1,000 of 6,334 numbers
// and look completely healthy while silently excluding 84% of the audience.
async function sbRpcAll(fn, args, max = 200000) {
  const { url, key } = sb();
  const PAGE = 1000;
  const out = [];
  for (let from = 0; from < max; from += PAGE) {
    let rows;
    try {
      const r = await fetch(`${url}/rest/v1/rpc/${fn}`, {
        method: "POST",
        headers: {
          apikey: key, Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          "Range-Unit": "items", Range: `${from}-${from + PAGE - 1}`
        },
        body: JSON.stringify(args || {})
      });
      if (!r.ok) {
        const t = await r.text().catch(() => "");
        if (from === 0) return { error: t, missing: isMissingSchema(t) };
        break;
      }
      rows = await r.json().catch(() => null);
    } catch (e) { break; }
    if (!Array.isArray(rows) || rows.length === 0) break;
    out.push(...rows);
    if (rows.length < PAGE) break;
  }
  return out;
}

// ─── Settings (zero-DDL: lives in the existing site_settings jsonb) ──────────

const DEFAULT_SETTINGS = {
  enabled: true,
  quietHours: { start: 22, end: 9 },   // local Istanbul time, wraps midnight
  maxPromoPerDay: 2,
  timezone: "Europe/Istanbul"
};

async function loadSettings() {
  const rows = await sbGet("site_settings?key=eq.notifications&select=value");
  const v = Array.isArray(rows) && rows[0] && rows[0].value;
  if (!v || typeof v !== "object") return { ...DEFAULT_SETTINGS };
  return {
    ...DEFAULT_SETTINGS, ...v,
    quietHours: { ...DEFAULT_SETTINGS.quietHours, ...(v.quietHours || {}) }
  };
}

// Current hour in the configured zone. The server runs UTC; Istanbul is UTC+3,
// so comparing raw UTC hours would shift every quiet-hours window by 3 hours —
// i.e. start blasting phones at 03:00 local.
function localHour(tz) {
  try {
    const s = new Intl.DateTimeFormat("en-US", { timeZone: tz || "Europe/Istanbul", hour: "numeric", hourCycle: "h23" }).format(new Date());
    return Number(s) % 24;
  } catch (e) { return new Date().getUTCHours(); }
}

function inQuietHours(hour, qh) {
  const start = Number(qh && qh.start), end = Number(qh && qh.end);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start === end) return false; // disabled
  return start < end ? (hour >= start && hour < end) : (hour >= start || hour < end);
}

// ─── Segment catalogue (drives the admin picker) ─────────────────────────────
// `needs` marks segments that are meaningless without a parameter, so the UI can
// require it instead of letting the admin build a campaign that targets nobody.

const SEGMENTS = [
  { key: "all_devices",            label: "كل الأجهزة المسجّلة",        desc: "كل من فتح الموقع أو التطبيق ويقبل الإشعارات — يشمل متصفحي الويب." },
  { key: "app_installs",           label: "كل من نزّل التطبيق",         desc: "كل من ثبّت التطبيق على جواله (أو ثبّت الموقع كتطبيق) — بصرف النظر عن طلباته. الشريحة المناسبة لـ«عرض جديد» أو «توصيل مجاني»." },
  { key: "app_installed_no_order", label: "نزّل التطبيق ولم يطلب",      desc: "ثبّت التطبيق أو الموقع كتطبيق ولم يُكمل أي طلب ناجح — هدف حملة «أول طلب»." },
  { key: "abandoned_cart",         label: "سلة متروكة",                desc: "لديه سلة فيها أصناف لم تتحوّل لطلب. افتراضياً: مرّت ساعة على آخر تعديل ولم تتجاوز ٧ أيام." },
  { key: "one_time_buyers",        label: "طلب مرة واحدة",             desc: "أتمّ طلباً ناجحاً واحداً فقط — هدف حملة «الطلب الثاني»." },
  { key: "repeat_buyers",          label: "عملاء متكررون",             desc: "طلبان ناجحان فأكثر." },
  { key: "dormant",                label: "عملاء خاملون",              desc: "طلب سابقاً ثم انقطع منذ مدة (افتراضياً ٣٠ يوماً) — حملة استرجاع." },
  { key: "all_customers",          label: "كل من طلب",                 desc: "أي عميل أتمّ طلباً ناجحاً واحداً على الأقل." },
  { key: "store_customers",        label: "عملاء متجر معيّن",          desc: "من طلب من متجر بعينه — للترويج لعروض ذلك المتجر.", needs: "store_id" },
  { key: "wa_contacts",            label: "جهات واتساب المرفوعة",      desc: "الأرقام المرفوعة في «إدارة الأرقام». قناة واتساب فقط (لا أجهزة مرتبطة)." }
];

// ─── Input hygiene ───────────────────────────────────────────────────────────

// device_uid is the read key for a customer's inbox, so it must be unguessable.
// The client generates 128 bits of randomness; we only enforce shape and length
// here (the value never has to be secret from its own owner).
const DEVICE_UID_RE = /^[A-Za-z0-9_-]{16,128}$/;
const okUid = v => DEVICE_UID_RE.test(String(v || ""));

const str = (v, max = 500) => (v === null || v === undefined) ? null : String(v).slice(0, max);
const num = v => { const n = Number(v); return Number.isFinite(n) ? n : 0; };
const phoneKey = v => { const d = String(v || "").replace(/\D/g, ""); return d.length >= 8 ? d : null; };

function readBody(req) {
  const b = req.body;
  if (!b) return {};
  if (typeof b === "string") { try { return JSON.parse(b); } catch (e) { return {}; } }
  return b;
}

// ═══════════════════════════════════════════════════════════════════════════
// PUBLIC ACTIONS (customer devices)
// ═══════════════════════════════════════════════════════════════════════════

async function registerDevice(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const platform = ["web", "pwa", "android", "ios"].includes(body.platform) ? body.platform : "web";
  const channel = ["webpush", "fcm"].includes(body.push_channel) ? body.push_channel : null;

  const row = {
    device_uid: body.device_uid,
    platform,
    push_channel: channel,
    push_token: channel === "fcm" ? str(body.push_token, 4000) : null,
    push_endpoint: channel === "webpush" ? str(body.push_endpoint, 2000) : null,
    customer_phone: phoneKey(body.customer_phone),
    customer_id: str(body.customer_id, 64) || null,
    app_version: str(body.app_version, 40),
    locale: str(body.locale, 12) || "ar",
    last_seen_at: new Date().toISOString()
  };
  if (typeof body.notifications_enabled === "boolean") row.notifications_enabled = body.notifications_enabled;

  // Never overwrite a known phone with null: a device that identified once stays
  // identified even if a later ping (an anonymous tab, a logged-out session)
  // carries no phone. Losing it would silently drop that person out of every
  // phone-based segment and out of the WhatsApp channel entirely.
  if (!row.customer_phone) delete row.customer_phone;
  if (!row.customer_id) delete row.customer_id;

  const r = await sbWrite("POST", "app_devices?on_conflict=device_uid", [row], "return=minimal,resolution=merge-duplicates");
  if (!r.ok) return { status: r.missing ? 200 : 502, json: { ok: false, setup_required: !!r.missing, error: r.missing ? "schema" : r.error } };
  return { status: 200, json: { ok: true } };
}

async function cartSync(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const itemCount = Math.max(0, Math.round(num(body.item_count)));

  // Emptied cart: mark dismissed rather than deleting, so it stops qualifying
  // for the abandoned-cart segment without erasing that it ever existed.
  if (itemCount === 0) {
    await sbWrite("PATCH", `cart_snapshots?device_uid=eq.${encodeURIComponent(body.device_uid)}`,
      { status: "dismissed", item_count: 0, updated_at: new Date().toISOString() }, "return=minimal");
    return { status: 200, json: { ok: true, cleared: true } };
  }

  // SUMMARY ONLY — deliberate privacy decision (user-selected, 2026-07-20):
  // store, count, subtotal and product names. No options, no addons, no notes,
  // no address. Enough for «سلتك تنتظرك في {المتجر}» and for an abandoned-value
  // report, and nothing beyond that.
  const names = Array.isArray(body.item_names)
    ? body.item_names.slice(0, MAX_ITEM_NAMES).map(n => str(n, 120)).filter(Boolean)
    : [];

  const row = {
    device_uid: body.device_uid,
    store_id: body.store_id ? Math.round(num(body.store_id)) : null,
    store_name: str(body.store_name, 200),
    item_count: itemCount,
    subtotal: num(body.subtotal),
    item_names: names,
    customer_phone: phoneKey(body.customer_phone),
    status: "active",
    updated_at: new Date().toISOString()
  };
  if (!row.customer_phone) delete row.customer_phone;

  const r = await sbWrite("POST", "cart_snapshots?on_conflict=device_uid", [row], "return=minimal,resolution=merge-duplicates");
  if (!r.ok) return { status: r.missing ? 200 : 502, json: { ok: false, setup_required: !!r.missing } };
  return { status: 200, json: { ok: true } };
}

async function cartConverted(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  await sbWrite("PATCH", `cart_snapshots?device_uid=eq.${encodeURIComponent(body.device_uid)}`,
    { status: "converted", converted_at: new Date().toISOString() }, "return=minimal");
  return { status: 200, json: { ok: true } };
}

// Inbox reads are POST so the device_uid travels in the body, not in a URL that
// would land in access logs and Referer headers.
async function inbox(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const phone = phoneKey(body.customer_phone);
  const limit = Math.min(Math.max(1, Math.round(num(body.limit) || INBOX_LIMIT)), 100);

  // A customer sees notifications addressed to this device OR to their phone —
  // so an order update raised on their laptop still shows up on their phone.
  const uidF = `device_uid.eq.${encodeURIComponent(body.device_uid)}`;
  const filter = phone ? `or=(${uidF},customer_phone.eq.${encodeURIComponent(phone)})` : `${uidF}`;

  const rows = await sbGet(`notifications?${filter}&select=id,title,body,image_url,deep_link,kind,read_at,created_at&order=created_at.desc&limit=${limit}`);
  if (!Array.isArray(rows)) {
    const missing = rows && rows.missing;
    return { status: 200, json: { ok: true, items: [], unread: 0, setup_required: !!missing } };
  }
  const unread = rows.filter(r => !r.read_at).length;
  return { status: 200, json: { ok: true, items: rows, unread } };
}

async function markRead(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const uid = encodeURIComponent(body.device_uid);
  const ids = Array.isArray(body.ids) ? body.ids.map(n => Math.round(num(n))).filter(Boolean) : null;
  const scope = ids && ids.length
    ? `notifications?device_uid=eq.${uid}&id=in.(${ids.join(",")})`
    : `notifications?device_uid=eq.${uid}&read_at=is.null`;
  await sbWrite("PATCH", scope, { read_at: new Date().toISOString() }, "return=minimal");
  return { status: 200, json: { ok: true } };
}

async function setPrefs(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const patch = {};
  if (typeof body.notifications_enabled === "boolean") patch.notifications_enabled = body.notifications_enabled;
  if (typeof body.promo_opt_out === "boolean") patch.promo_opt_out = body.promo_opt_out;
  if (!Object.keys(patch).length) return { status: 400, json: { error: "nothing to update" } };
  await sbWrite("PATCH", `app_devices?device_uid=eq.${encodeURIComponent(body.device_uid)}`, patch, "return=minimal");
  return { status: 200, json: { ok: true } };
}

// ═══════════════════════════════════════════════════════════════════════════
// ADMIN ACTIONS
// ═══════════════════════════════════════════════════════════════════════════

// Live audience size per segment, for the composer. Counted by resolving the
// segment and counting DISTINCT people (a customer with three devices is one
// person), because that is the number an admin is actually deciding against.
async function segmentCounts(query) {
  const params = {};
  if (query.store_id) params.store_id = Math.round(num(query.store_id));

  const out = [];
  let setupRequired = false;
  for (const s of SEGMENTS) {
    if (s.needs && !params[s.needs]) { out.push({ ...s, count: null, needs_param: true }); continue; }
    const rows = await sbRpcAll("notification_segment_devices", { p_segment: s.key, p_params: params });
    if (!Array.isArray(rows)) { setupRequired = setupRequired || !!(rows && rows.missing); out.push({ ...s, count: null }); continue; }
    const people = new Set(rows.map(r => r.customer_phone || `d:${r.device_uid}`));
    const reachable = {
      inapp: new Set(rows.filter(r => r.device_uid).map(r => r.device_uid)).size,
      webpush: new Set(rows.filter(r => r.push_channel === "webpush" && r.push_endpoint).map(r => r.device_uid)).size,
      fcm: new Set(rows.filter(r => r.push_channel === "fcm" && r.push_token).map(r => r.device_uid)).size,
      whatsapp: new Set(rows.filter(r => r.customer_phone).map(r => r.customer_phone)).size
    };
    out.push({ ...s, count: people.size, reachable });
  }
  return { status: 200, json: { ok: true, segments: out, setup_required: setupRequired, vapid: vapidConfigured(), fcm: fcmConfigured() } };
}

async function listCampaigns() {
  const rows = await sbGet("notification_campaigns?select=*&order=created_at.desc&limit=100");
  if (!Array.isArray(rows)) return { status: 200, json: { ok: true, campaigns: [], setup_required: !!(rows && rows.missing) } };
  return { status: 200, json: { ok: true, campaigns: rows } };
}

async function campaignStatus(query) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };
  const rows = await sbGet(`notification_campaigns?id=eq.${encodeURIComponent(id)}&select=*`);
  if (!Array.isArray(rows) || !rows[0]) return { status: 404, json: { error: "not found" } };
  const stats = await sbGet(`rpc/notification_campaign_stats?p_campaign_id=${encodeURIComponent(id)}`);
  return { status: 200, json: { ok: true, campaign: rows[0], stats: Array.isArray(stats) ? stats[0] : null } };
}

function sanitizeCampaign(body) {
  const channels = Array.isArray(body.channels)
    ? body.channels.filter(c => ["inapp", "webpush", "fcm", "whatsapp"].includes(c))
    : ["inapp"];
  return {
    name: str(body.name, 200) || "حملة بلا اسم",
    title: str(body.title, 200),
    body: str(body.body, 1000),
    image_url: str(body.image_url, 2000),
    deep_link: str(body.deep_link, 500),
    segment: SEGMENTS.some(s => s.key === body.segment) ? body.segment : null,
    segment_params: (body.segment_params && typeof body.segment_params === "object") ? body.segment_params : {},
    channels: channels.length ? channels : ["inapp"],
    scheduled_at: body.scheduled_at ? str(body.scheduled_at, 40) : null,
    wa_template_name: str(body.wa_template_name, 200),
    wa_template_lang: str(body.wa_template_lang, 12) || "ar",
    note: str(body.note, 1000)
  };
}

async function createCampaign(body) {
  const row = sanitizeCampaign(body);
  if (!row.title) return { status: 400, json: { error: "العنوان مطلوب" } };
  if (!row.segment) return { status: 400, json: { error: "الشريحة مطلوبة" } };
  const r = await sbWrite("POST", "notification_campaigns", [row]);
  if (!r.ok) return { status: r.missing ? 503 : 502, json: { error: r.missing ? "setup_required" : r.error } };
  return { status: 200, json: { ok: true, campaign: r.data && r.data[0] } };
}

async function updateCampaign(query, body) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };
  const cur = await sbGet(`notification_campaigns?id=eq.${encodeURIComponent(id)}&select=status`);
  const st = Array.isArray(cur) && cur[0] && cur[0].status;
  // Editing a campaign mid-flight would change the message some people already
  // received — the audience would no longer be a single campaign.
  if (["sending", "done"].includes(st)) return { status: 409, json: { error: "لا يمكن تعديل حملة قيد الإرسال أو منتهية" } };
  const r = await sbWrite("PATCH", `notification_campaigns?id=eq.${encodeURIComponent(id)}`, sanitizeCampaign(body));
  if (!r.ok) return { status: 502, json: { error: r.error } };
  return { status: 200, json: { ok: true } };
}

async function deleteCampaign(query) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };
  await sbWrite("DELETE", `notification_campaigns?id=eq.${encodeURIComponent(id)}`, undefined, "return=minimal");
  return { status: 200, json: { ok: true } };
}

// Expand a resolved segment into concrete (recipient × channel) rows.
//
// Pure on purpose — this holds the rules that decide who gets messaged how many
// times, which is the part most worth testing directly and hardest to notice
// when wrong. Two rules carry real weight:
//
//   • WhatsApp is keyed on the PHONE with a null device. A customer with a
//     laptop and a phone is two device rows but one WhatsApp number; keying on
//     the device would message that person twice, on a paid channel.
//   • A channel is only assigned when the device can actually receive it (a
//     webpush row needs an endpoint, an fcm row needs a token). Assigning
//     blindly would inflate `total_recipients` with people who were never
//     reachable, making a half-delivered campaign look fully delivered.
function fanOutRecipients(people, channels, campaignId) {
  const seen = new Set();
  const out = [];
  const add = (channel, device_uid, customer_phone) => {
    const k = `${channel}|${device_uid || ""}|${customer_phone || ""}`;
    if (seen.has(k)) return;
    seen.add(k);
    out.push({ campaign_id: campaignId, channel, device_uid: device_uid || null, customer_phone: customer_phone || null, status: "pending" });
  };
  for (const p of (people || [])) {
    if (channels.includes("inapp") && p.device_uid) add("inapp", p.device_uid, p.customer_phone || null);
    if (channels.includes("webpush") && p.device_uid && p.push_channel === "webpush" && p.push_endpoint) add("webpush", p.device_uid, null);
    if (channels.includes("fcm") && p.device_uid && p.push_channel === "fcm" && p.push_token) add("fcm", p.device_uid, null);
    if (channels.includes("whatsapp") && p.customer_phone) add("whatsapp", null, p.customer_phone);
  }
  return out;
}

// Build a PostgREST `in.(...)` list. Values are percent-encoded inside the
// quotes: push endpoints are full URLs, and an unencoded `&` or `?` in one would
// terminate the query string early and silently change which rows match.
function inList(values) {
  return [...new Set(values)].map(v => `"${encodeURIComponent(v)}"`).join(",");
}

// Resolve the segment into concrete (recipient × channel) rows.
async function buildCampaign(query) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };
  const rows = await sbGet(`notification_campaigns?id=eq.${encodeURIComponent(id)}&select=*`);
  const c = Array.isArray(rows) && rows[0];
  if (!c) return { status: 404, json: { error: "not found" } };
  if (c.status === "sending") return { status: 409, json: { error: "الحملة قيد الإرسال" } };

  const people = await sbRpcAll("notification_segment_devices", { p_segment: c.segment, p_params: c.segment_params || {} });
  if (!Array.isArray(people)) return { status: 503, json: { error: "setup_required" } };

  // Rebuild from scratch, and reset the stored counters with it. Leaving stale
  // counts on a rebuilt campaign is exactly the WhatsApp bug from 2026-07-19,
  // where `build` wiped the recipients but left sent_count untouched.
  await sbWrite("DELETE", `notification_recipients?campaign_id=eq.${encodeURIComponent(id)}`, undefined, "return=minimal");

  const out = fanOutRecipients(people, Array.isArray(c.channels) ? c.channels : ["inapp"], id);

  for (let i = 0; i < out.length; i += INSERT_CHUNK) {
    const r = await sbWrite("POST", "notification_recipients", out.slice(i, i + INSERT_CHUNK), "return=minimal");
    if (!r.ok) return { status: 502, json: { error: r.error } };
  }

  const total = await sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}`);
  const patch = { total_recipients: total === null ? out.length : total, sent_count: 0, failed_count: 0, status: "ready" };

  // ── WhatsApp bridge ───────────────────────────────────────────────────────
  // Deliberately does NOT re-implement Meta template sending. It creates a row
  // in the existing, production-proven wa_campaigns and lets api/campaign.js do
  // the delivery — that code already handles the daily cap, the atomic batch
  // claim, opt-out re-checks at send time, and template parameters. Two senders
  // for one channel would mean two places to get the daily cap wrong.
  let waResult = null;
  if (Array.isArray(c.channels) && c.channels.includes("whatsapp")) {
    const phones = [...new Set(out.filter(r => r.channel === "whatsapp" && r.customer_phone).map(r => r.customer_phone))];
    if (!phones.length) {
      waResult = { created: false, reason: "no_phones" };
    } else if (!c.wa_template_name) {
      // Fail loudly rather than creating a campaign that can never send.
      waResult = { created: false, reason: "no_template" };
    } else {
      const wa = await sbWrite("POST", "wa_campaigns", [{
        name: `${c.name} — إشعارات`,
        template_name: c.wa_template_name,
        template_lang: c.wa_template_lang || "ar",
        audience_type: "wa_contacts",
        status: "ready",
        total_recipients: phones.length,
        sent_count: 0,
        failed_count: 0,
        note: `أُنشئت تلقائياً من حملة الإشعارات «${c.name}» (شريحة: ${c.segment})`
      }]);
      const waId = wa.ok && wa.data && wa.data[0] && wa.data[0].id;
      if (!waId) {
        waResult = { created: false, reason: "insert_failed" };
      } else {
        for (let i = 0; i < phones.length; i += INSERT_CHUNK) {
          await sbWrite("POST", "wa_campaign_recipients",
            phones.slice(i, i + INSERT_CHUNK).map(p => ({ campaign_id: waId, phone: p, status: "pending" })),
            "return=minimal");
        }
        patch.wa_campaign_id = waId;
        waResult = { created: true, id: waId, phones: phones.length };
      }
    }
  }

  await sbWrite("PATCH", `notification_campaigns?id=eq.${encodeURIComponent(id)}`, patch, "return=minimal");

  const byChannel = {};
  for (const r of out) byChannel[r.channel] = (byChannel[r.channel] || 0) + 1;

  return { status: 200, json: { ok: true, total: patch.total_recipients, by_channel: byChannel, people: people.length, whatsapp: waResult } };
}

async function setStatus(query, status) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };
  const patch = { status };
  if (status === "sending") patch.started_at = new Date().toISOString();
  if (status === "canceled") patch.finished_at = new Date().toISOString();
  const r = await sbWrite("PATCH", `notification_campaigns?id=eq.${encodeURIComponent(id)}`, patch, "return=minimal");
  if (!r.ok) return { status: 502, json: { error: r.error } };
  return { status: 200, json: { ok: true, status } };
}

// Atomically claim the next batch.
//
// Two steps, and the second is the one that matters: the PATCH carries
// `status=eq.pending` in its WHERE clause, so a row another concurrent batch
// already flipped will not match and will not come back. Same guarantee as
// claimPendingBatch in api/campaign.js.
async function claimBatch(campaignId, limit) {
  const ids = await sbGet(`notification_recipients?campaign_id=eq.${encodeURIComponent(campaignId)}&status=eq.pending&select=id&order=created_at.asc,id.asc&limit=${limit}`);
  if (!Array.isArray(ids) || !ids.length) return [];
  const list = inList(ids.map(r => r.id));
  const r = await sbWrite("PATCH",
    `notification_recipients?id=in.(${list})&status=eq.pending`,
    { status: "sending" }, "return=representation");
  return (r.ok && Array.isArray(r.data)) ? r.data : [];
}

async function sendBatch(query) {
  const id = str(query.id, 64);
  if (!id) return { status: 400, json: { error: "missing id" } };

  const rows = await sbGet(`notification_campaigns?id=eq.${encodeURIComponent(id)}&select=*`);
  const c = Array.isArray(rows) && rows[0];
  if (!c) return { status: 404, json: { error: "not found" } };
  if (c.status !== "sending") return { status: 200, json: { ok: true, done: true, reason: `status=${c.status}` } };

  const settings = await loadSettings();
  if (!settings.enabled) return { status: 200, json: { ok: true, paused: "disabled" } };

  // Quiet hours DELAY, they do not cancel: return without claiming anything so
  // the same recipients go out later. Marking them skipped would silently drop
  // an entire campaign for being scheduled at the wrong hour.
  const hour = localHour(settings.timezone);
  if (inQuietHours(hour, settings.quietHours)) {
    return { status: 200, json: { ok: true, paused: "quiet_hours", local_hour: hour, resume_at: settings.quietHours.end } };
  }

  const batch = await claimBatch(id, BATCH_SIZE);
  if (!batch.length) {
    const remaining = await sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}&status=in.(pending,sending)`);
    // Only finish on a definite zero. A failed count returns null, and treating
    // null as "done" would end a campaign that still had recipients waiting.
    if (remaining === 0) {
      await sbWrite("PATCH", `notification_campaigns?id=eq.${encodeURIComponent(id)}`,
        { status: "done", finished_at: new Date().toISOString() }, "return=minimal");
      return { status: 200, json: { ok: true, done: true } };
    }
    return { status: 200, json: { ok: true, inflight: true, remaining } };
  }

  // ── Pre-flight lookups, batched (one query each, not one per recipient) ────
  const uids = [...new Set(batch.map(r => r.device_uid).filter(Boolean))];
  const devices = {};
  if (uids.length) {
    const list = inList(uids);
    const ds = await sbGetAll(`app_devices?device_uid=in.(${list})&select=device_uid,push_channel,push_endpoint,push_token,promo_opt_out,notifications_enabled,customer_phone`);
    for (const d of (Array.isArray(ds) ? ds : [])) devices[d.device_uid] = d;
  }

  // Daily frequency cap — how many promos has each device already had today?
  const capCounts = {};
  if (settings.maxPromoPerDay > 0 && uids.length) {
    const since = new Date(); since.setUTCHours(0, 0, 0, 0);
    const list = inList(uids);
    const sent = await sbGetAll(`notifications?device_uid=in.(${list})&kind=eq.promo&created_at=gte.${since.toISOString()}&select=device_uid`);
    for (const n of (Array.isArray(sent) ? sent : [])) capCounts[n.device_uid] = (capCounts[n.device_uid] || 0) + 1;
  }

  const pushSubs = {};
  const endpoints = batch.filter(r => r.channel === "webpush" && devices[r.device_uid] && devices[r.device_uid].push_endpoint)
                         .map(r => devices[r.device_uid].push_endpoint);
  if (endpoints.length) {
    const subs = await sbGetAll(`push_subscriptions?endpoint=in.(${inList(endpoints)})&select=id,endpoint,p256dh,auth`);
    for (const s of (Array.isArray(subs) ? subs : [])) pushSubs[s.endpoint] = s;
  }

  const payload = { title: c.title, body: c.body || "", url: c.deep_link || "/", tag: `campaign-${id}`, icon: c.image_url || undefined };
  const payloadStr = JSON.stringify(payload);
  const nowIso = new Date().toISOString();
  const results = [];
  const inappRows = [];

  for (const r of batch) {
    const d = r.device_uid ? devices[r.device_uid] : null;

    // Promotional opt-out. Transactional order notifications never route through
    // campaigns, so this can be honoured unconditionally here.
    if (d && (d.promo_opt_out || d.notifications_enabled === false)) {
      results.push({ id: r.id, status: "skipped", skip_reason: "opt_out" }); continue;
    }
    if (settings.maxPromoPerDay > 0 && r.device_uid && (capCounts[r.device_uid] || 0) >= settings.maxPromoPerDay) {
      results.push({ id: r.id, status: "skipped", skip_reason: "daily_cap" }); continue;
    }

    if (r.channel === "inapp") {
      inappRows.push({
        device_uid: r.device_uid, customer_phone: r.customer_phone || (d && d.customer_phone) || null,
        kind: "promo", title: c.title, body: c.body, image_url: c.image_url,
        deep_link: c.deep_link, campaign_id: id
      });
      capCounts[r.device_uid] = (capCounts[r.device_uid] || 0) + 1;
      results.push({ id: r.id, status: "sent" });

    } else if (r.channel === "webpush") {
      const sub = d && d.push_endpoint ? pushSubs[d.push_endpoint] : null;
      if (!vapidConfigured()) { results.push({ id: r.id, status: "skipped", skip_reason: "vapid_not_configured" }); continue; }
      if (!sub) { results.push({ id: r.id, status: "skipped", skip_reason: "no_subscription" }); continue; }
      const res = await sendOnePush(sub, payloadStr);
      if (res.ok) results.push({ id: r.id, status: "sent" });
      else {
        if (res.gone) await sbWrite("DELETE", `push_subscriptions?id=eq.${sub.id}`, undefined, "return=minimal");
        results.push({ id: r.id, status: "failed", error: res.reason || `http ${res.status}` });
      }

    } else if (r.channel === "fcm") {
      // Skipped-not-failed while Firebase is absent, and visible in the report
      // as its own reason — a missing channel must never read as a delivered send.
      if (!fcmConfigured()) { results.push({ id: r.id, status: "skipped", skip_reason: "fcm_not_configured" }); continue; }
      if (!d || !d.push_token) { results.push({ id: r.id, status: "skipped", skip_reason: "no_device_token" }); continue; }
      const res = await sendOneFcm(d.push_token, {
        title: c.title, body: c.body, imageUrl: c.image_url, deepLink: c.deep_link, tag: `campaign-${id}`
      });
      if (res.ok) results.push({ id: r.id, status: "sent" });
      else {
        // Dead token (app uninstalled / token rotated) — clear it so this device
        // stops being counted as FCM-reachable in every future segment count.
        if (res.gone) {
          await sbWrite("PATCH", `app_devices?device_uid=eq.${encodeURIComponent(r.device_uid)}`,
            { push_token: null, push_channel: null }, "return=minimal");
        }
        results.push({ id: r.id, status: "failed", error: res.reason || `http ${res.status}` });
      }

    } else if (r.channel === "whatsapp") {
      // Sent by api/campaign.js through the linked wa_campaign. Marked skipped
      // here so this campaign can complete; the WhatsApp numbers live in the
      // linked campaign's own report.
      results.push({ id: r.id, status: "skipped", skip_reason: "handled_by_whatsapp_campaign" });

    } else {
      results.push({ id: r.id, status: "skipped", skip_reason: "unknown_channel" });
    }
  }

  if (inappRows.length) await sbWrite("POST", "notifications", inappRows, "return=minimal");

  for (const res of results) {
    await sbWrite("PATCH", `notification_recipients?id=eq.${encodeURIComponent(res.id)}`,
      { status: res.status, skip_reason: res.skip_reason || null, error: res.error || null, sent_at: res.status === "sent" ? nowIso : null },
      "return=minimal");
  }

  // ── Counters: RECOUNTED, never incremented ───────────────────────────────
  const [sent, failed, remaining, total] = await Promise.all([
    sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}&status=eq.sent`),
    sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}&status=eq.failed`),
    sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}&status=in.(pending,sending)`),
    sbCount(`notification_recipients?campaign_id=eq.${encodeURIComponent(id)}`)
  ]);
  const patch = {};
  // Fall back to the stored value on a failed count rather than writing a zero
  // over a good number.
  if (sent !== null) patch.sent_count = sent;
  if (failed !== null) patch.failed_count = failed;
  if (total !== null) patch.total_recipients = total;
  const allDone = remaining === 0;
  if (allDone) { patch.status = "done"; patch.finished_at = nowIso; }
  if (Object.keys(patch).length) {
    await sbWrite("PATCH", `notification_campaigns?id=eq.${encodeURIComponent(id)}`, patch, "return=minimal");
  }

  return { status: 200, json: { ok: true, processed: results.length, sent, failed, remaining, done: allDone } };
}

// Send one notification to a single device — the admin previewing on their own
// phone before committing to an audience.
async function testSend(body) {
  if (!okUid(body.device_uid)) return { status: 400, json: { error: "invalid device_uid" } };
  const title = str(body.title, 200);
  if (!title) return { status: 400, json: { error: "العنوان مطلوب" } };

  const r = await sbWrite("POST", "notifications", [{
    device_uid: body.device_uid, kind: "system", title,
    body: str(body.body, 1000), image_url: str(body.image_url, 2000), deep_link: str(body.deep_link, 500)
  }], "return=minimal");
  if (!r.ok) return { status: r.missing ? 503 : 502, json: { error: r.missing ? "setup_required" : r.error } };

  let push = { attempted: false };
  const ds = await sbGet(`app_devices?device_uid=eq.${encodeURIComponent(body.device_uid)}&select=push_channel,push_endpoint`);
  const d = Array.isArray(ds) && ds[0];
  if (d && d.push_channel === "webpush" && d.push_endpoint && vapidConfigured()) {
    const subs = await sbGet(`push_subscriptions?endpoint=eq.${encodeURIComponent(d.push_endpoint)}&select=id,endpoint,p256dh,auth`);
    const sub = Array.isArray(subs) && subs[0];
    if (sub) {
      const res = await sendOnePush(sub, JSON.stringify({ title, body: str(body.body, 1000) || "", url: str(body.deep_link, 500) || "/", tag: "test" }));
      push = { attempted: true, ok: !!res.ok, reason: res.reason };
    }
  }
  return { status: 200, json: { ok: true, inapp: true, push } };
}

async function getSettings() {
  return { status: 200, json: { ok: true, settings: await loadSettings(), vapid: vapidConfigured() } };
}

async function saveSettings(body) {
  const cur = await loadSettings();
  const next = {
    enabled: typeof body.enabled === "boolean" ? body.enabled : cur.enabled,
    quietHours: {
      start: Number.isFinite(Number(body.quietStart)) ? Math.min(23, Math.max(0, Math.round(Number(body.quietStart)))) : cur.quietHours.start,
      end: Number.isFinite(Number(body.quietEnd)) ? Math.min(23, Math.max(0, Math.round(Number(body.quietEnd)))) : cur.quietHours.end
    },
    maxPromoPerDay: Number.isFinite(Number(body.maxPromoPerDay)) ? Math.min(20, Math.max(0, Math.round(Number(body.maxPromoPerDay)))) : cur.maxPromoPerDay,
    timezone: str(body.timezone, 60) || cur.timezone
  };
  const r = await sbWrite("POST", "site_settings?on_conflict=key",
    [{ key: "notifications", value: next, updated_at: new Date().toISOString() }],
    "return=minimal,resolution=merge-duplicates");
  if (!r.ok) return { status: 502, json: { error: r.error } };
  return { status: 200, json: { ok: true, settings: next } };
}

// ─── Action table: method + auth declared once, per action ───────────────────

const ACTIONS = {
  // public
  "register-device": { method: "POST", admin: false, run: (q, b) => registerDevice(b) },
  "cart-sync":       { method: "POST", admin: false, run: (q, b) => cartSync(b) },
  "cart-converted":  { method: "POST", admin: false, run: (q, b) => cartConverted(b) },
  "inbox":           { method: "POST", admin: false, run: (q, b) => inbox(b) },
  "mark-read":       { method: "POST", admin: false, run: (q, b) => markRead(b) },
  "set-prefs":       { method: "POST", admin: false, run: (q, b) => setPrefs(b) },
  // admin
  "segments":        { method: "GET",  admin: true,  run: q => segmentCounts(q) },
  "list":            { method: "GET",  admin: true,  run: () => listCampaigns() },
  "status":          { method: "GET",  admin: true,  run: q => campaignStatus(q) },
  "settings":        { method: "GET",  admin: true,  run: () => getSettings() },
  "save-settings":   { method: "POST", admin: true,  run: (q, b) => saveSettings(b) },
  "create":          { method: "POST", admin: true,  run: (q, b) => createCampaign(b) },
  "update":          { method: "POST", admin: true,  run: (q, b) => updateCampaign(q, b) },
  "delete":          { method: "POST", admin: true,  run: q => deleteCampaign(q) },
  "build":           { method: "POST", admin: true,  run: q => buildCampaign(q) },
  "start":           { method: "POST", admin: true,  run: q => setStatus(q, "sending") },
  "pause":           { method: "POST", admin: true,  run: q => setStatus(q, "paused") },
  "resume":          { method: "POST", admin: true,  run: q => setStatus(q, "sending") },
  "cancel":          { method: "POST", admin: true,  run: q => setStatus(q, "canceled") },
  "send-batch":      { method: "POST", admin: true,  run: q => sendBatch(q) },
  "test-send":       { method: "POST", admin: true,  run: (q, b) => testSend(b) }
};

module.exports = async (req, res) => {
  const query = (req.query && typeof req.query === "object") ? req.query : {};
  const action = String(query.action || "");
  const spec = ACTIONS[action];

  if (!spec) return res.status(400).json({ error: "unknown action", actions: Object.keys(ACTIONS) });
  if (req.method !== spec.method) {
    // Explicit, not a bare 403 — the failure mode this replaces was a silent
    // 403 with no body that made the admin panel look broken for no reason.
    return res.status(405).json({ error: `action '${action}' requires ${spec.method}`, got: req.method });
  }
  if (spec.admin && !adminOk(req)) return res.status(403).json({ error: "forbidden" });

  try {
    const out = await spec.run(query, readBody(req));
    return res.status(out.status).json(out.json);
  } catch (e) {
    return res.status(500).json({ error: e && e.message ? e.message : "internal error" });
  }
};

// Pure decision logic, exported for the test harness. These are the rules that
// fail silently rather than loudly when wrong — who gets a message, how many
// times, and at what hour — so they are tested directly rather than inferred
// from an end-to-end run.
module.exports.__test = { fanOutRecipients, inQuietHours, localHour, inList, sanitizeCampaign, okUid, phoneKey, SEGMENTS };
