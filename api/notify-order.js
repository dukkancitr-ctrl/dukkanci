// Sends WhatsApp order notifications through the PLATFORM number (Meta WhatsApp
// Cloud API). When a new order is placed it messages:
//   1) the STORE  — with the order details so they can prepare it, and
//   2) the CUSTOMER — confirming their order was received.
//
// Trigger options (both payload shapes are accepted):
//   - The web app POSTs the order here right after it is saved (default), or
//   - A Supabase "Database Webhook" on INSERT into public.orders ({ record }).
//
// Activation: set the WHATSAPP_* env vars (see WHATSAPP_SETUP.md). Until then
// the endpoint no-ops gracefully (200 skipped) so the site keeps working before
// the number is connected.
//
// Note: business-initiated WhatsApp messages outside the 24h customer-care
// window MUST use an approved template. Set WHATSAPP_TEMPLATE_* to send
// templates; otherwise it falls back to plain text (only delivered when the
// recipient has messaged the number in the last 24h — useful for testing).

const crypto = require("crypto");
const aiGateway = require("../lib/ai-gateway"); // unified AI provider layer

const GRAPH = "https://graph.facebook.com";
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

const env = k => (process.env[k] || "").trim();

// We disable Vercel's automatic body parser so we can read the EXACT raw bytes
// that Meta (and the Supabase Send-SMS hook) signed. The `config` export is set
// at the END of this file — AFTER module.exports is assigned the handler — so it
// is not overwritten. We parse JSON ourselves from the raw buffer.

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    if (typeof req.body === "string") return resolve(req.body);
    if (req.body && typeof req.body === "object") return resolve(JSON.stringify(req.body));
    // Collect raw Buffer chunks and concat ONCE. Concatenating into a JS string
    // (data += chunk) decodes each chunk independently and corrupts any multi-byte
    // UTF-8 character that straddles a chunk boundary (e.g. Arabic text) — which
    // then breaks HMAC signature verification. Buffer.concat keeps the exact bytes.
    const chunks = [];
    let len = 0;
    req.on("data", chunk => {
      chunks.push(chunk);
      len += chunk.length;
      if (len > 1_000_000) req.destroy(); // 1MB hard cap — webhooks are tiny
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

// The exact byte string Meta signed. Ideally this is the raw request body — but
// Vercel's runtime parses application/json into req.body BEFORE our handler runs
// (the `bodyParser:false` config is not honored for standalone functions), so the
// raw bytes are gone and `rawBody` is our own re-serialization. To recover, we
// rebuild every serialization Meta might have produced. Meta serializes with PHP's
// json_encode, which (unlike JSON.stringify) escapes "/" as "\/" and, by default,
// non-ASCII as \uXXXX. Key order + compactness already match. We try all 4 combos
// (and the genuine raw body when the parser was off) and accept if ANY matches.
function metaSigCandidates(req, rawBody) {
  const cands = [];
  const preParsed = !!(req.body && typeof req.body === "object");
  if (typeof rawBody === "string" && rawBody && !preParsed) cands.push(rawBody); // raw bytes (best case)
  if (preParsed) {
    const base = JSON.stringify(req.body);
    const slash = s => s.replace(/\//g, "\\/");
    const uni = s => s.replace(new RegExp("[" + String.fromCharCode(128) + "-" + String.fromCharCode(65535) + "]", "g"), c => String.fromCharCode(92) + "u" + c.charCodeAt(0).toString(16).padStart(4, "0"));
    cands.push(base, slash(base), uni(base), uni(slash(base)));
  }
  if (typeof rawBody === "string" && rawBody && !cands.includes(rawBody)) cands.push(rawBody);
  return cands;
}

// Constant-time check of the Meta webhook signature against the app secret over
// any of the candidate body serializations. Returns true ONLY when the secret is
// configured AND one candidate's HMAC matches. Secret unset → false (fail closed).
function verifyMetaSignature(candidates, signatureHeader) {
  const secret = env("META_APP_SECRET") || env("WHATSAPP_APP_SECRET");
  if (!secret) return false;
  const sig = String(signatureHeader || "");
  if (!sig.startsWith("sha256=")) return false;
  const a = Buffer.from(sig);
  for (const body of (Array.isArray(candidates) ? candidates : [candidates])) {
    const expected = "sha256=" + crypto.createHmac("sha256", secret).update(body, "utf8").digest("hex");
    const b = Buffer.from(expected);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return false;
}

// Verify a Supabase "Send SMS" Auth Hook signature (Standard Webhooks format).
// secret looks like "v1,whsec_<base64>"; signed content is "<id>.<ts>.<body>".
function verifySendSmsHook(rawBody, headers, secretRaw) {
  if (!secretRaw) return false;
  const secret = secretRaw.replace(/^v1,?/, "").replace(/^whsec_/, "");
  let key;
  try { key = Buffer.from(secret, "base64"); } catch (e) { return false; }
  const id = headers["webhook-id"], ts = headers["webhook-timestamp"], sigHeader = headers["webhook-signature"];
  if (!id || !ts || !sigHeader) return false;
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${rawBody}`).digest("base64");
  return String(sigHeader).split(" ").some(part => {
    const sig = part.split(",")[1] || part;
    const a = Buffer.from(sig), b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

// ───────────────────────── Whop subscriptions ─────────────────────────
// Whop signs webhooks with the Standard Webhooks (svix) scheme — the SAME format
// as the Supabase Send-SMS hook above. Accept both the "webhook-*" and "svix-*"
// header families. The secret is the "whsec_<base64>" value from the Whop
// dashboard, stored in WHOP_WEBHOOK_SECRET. Fails closed when the secret is unset
// so a forged body is never trusted.
function verifyStandardWebhook(rawBody, headers, secretRaw) {
  if (!secretRaw) return false;
  const secret = secretRaw.replace(/^v1,?/, "").replace(/^whsec_/, "");
  let key;
  try { key = Buffer.from(secret, "base64"); } catch (e) { return false; }
  const id = headers["webhook-id"] || headers["svix-id"];
  const ts = headers["webhook-timestamp"] || headers["svix-timestamp"];
  const sigHeader = headers["webhook-signature"] || headers["svix-signature"];
  if (!id || !ts || !sigHeader) return false;
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${rawBody}`).digest("base64");
  return String(sigHeader).split(" ").some(part => {
    const sig = part.split(",")[1] || part;           // "v1,<base64>"
    const a = Buffer.from(sig), b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

function whopCfg() {
  return {
    secret: env("WHOP_WEBHOOK_SECRET"),
    checkoutUrl: env("WHOP_CHECKOUT_URL") || "https://whop.com/dukkanci/dukkanci-store-subscription/",
    tplRenewal: env("WHATSAPP_TEMPLATE_RENEWAL") || "subscription_renewal"
  };
}

// Whop sends renewal dates as Unix seconds (sometimes ms). Normalize to ISO.
function unixToIso(v) {
  if (v == null || v === "") return null;
  if (typeof v === "string" && /\d{4}-\d{2}-\d{2}T/.test(v)) return v; // already ISO
  const n = Number(v);
  if (!isFinite(n) || n <= 0) return null;
  const d = new Date(n > 1e12 ? n : n * 1000);
  return isNaN(d.getTime()) ? null : d.toISOString();
}

// Extract the fields we care about from a Whop membership webhook. Handles the
// "{ action, data }" envelope and tolerates several field name variants across
// Whop API versions.
function parseWhopMembership(body) {
  const event = String(body.action || body.event || body.type || "").toLowerCase();
  const d = (body.data && typeof body.data === "object") ? body.data : (body || {});
  const u = (d.user && typeof d.user === "object") ? d.user : {};
  const emailRaw = d.email || u.email || u.email_address || d.user_email || null;
  const valid = (d.valid != null)
    ? !!d.valid
    : ["active", "trialing", "completed"].includes(String(d.status || "").toLowerCase());
  const planId = d.plan_id || (d.plan && (d.plan.id || d.plan)) || null;
  return {
    event,
    membershipId: d.id || d.membership_id || d.membership || null,
    planId: typeof planId === "object" ? (planId.id || null) : planId,
    productId: d.product_id || d.product || null,
    email: emailRaw ? String(emailRaw).trim() : null,
    status: d.status ? String(d.status).toLowerCase() : null,
    valid,
    periodEnd: unixToIso(d.renewal_period_end || d.expires_at || d.current_period_end || d.valid_until),
    trialEnd: unixToIso(d.trial_end || d.trial_ends_at || d.trial_period_end),
    metadata: (d.metadata && typeof d.metadata === "object") ? d.metadata : {},
    raw: d
  };
}

// Map a Whop membership to our subscription_status enum.
function mapWhopStatus(m) {
  if (!m.valid) {
    const s = m.status || "";
    if (s === "canceled" || s === "cancelled") return "canceled";
    if (s === "past_due") return "past_due";
    return "expired";
  }
  if (m.status === "trialing") return "trialing";
  if (m.trialEnd && Date.parse(m.trialEnd) > Date.now() && !m.status) return "trialing";
  return "active";
}

// Business-initiated WhatsApp message telling a store to renew. Outside the 24h
// service window this REQUIRES an approved template (WHATSAPP_TEMPLATE_RENEWAL,
// two body params: {{1}} store name, {{2}} renewal URL). Falls back to plain text.
async function sendRenewalWhatsapp(c, wc, store) {
  if (!c.token || !c.phoneId) return { skipped: true, reason: "whatsapp not configured" };
  const to = toE164(store.whatsapp || store.phone, c.cc);
  if (!to) return { skipped: true, reason: "store has no whatsapp/phone" };
  const name = store.name || "متجرك";
  const url = wc.checkoutUrl;
  const text = `🔔 دكانجي — تجديد الاشتراك\n\nمرحباً ${name}، انتهت صلاحية اشتراك متجرك وتوقّف استقبال الطلبات الجديدة مؤقتاً.\nجدّد اشتراكك الآن ليعود متجرك للعمل واستقبال الطلبات:\n${url}\n\nشكراً لكونك جزءاً من دكانجي 🛍️`;
  return sendWhatsapp(c, to, { template: wc.tplRenewal, params: [name, url], text });
}

// Safety-net sweep: close any store whose paid period elapsed without a Whop
// "invalid" webhook, and WhatsApp the renewal message once. Idempotent — runs
// daily from Vercel Cron and is also callable by an admin for a manual sweep.
async function runSubscriptionCron(c) {
  const wc = whopCfg();
  const nowIso = new Date().toISOString();
  const expired = await sbGet(
    `stores?subscription_active=eq.true&current_period_end=not.is.null&current_period_end=lt.${encodeURIComponent(nowIso)}&select=id,name,whatsapp,phone,renewal_notified_at&limit=200`
  ) || [];
  let closed = 0, notified = 0;
  for (const store of expired) {
    await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(store.id)}`,
      { subscription_active: false, subscription_status: "expired", subscription: "expired" }, "return=minimal");
    closed++;
    if (!store.renewal_notified_at) {
      try { const r = await sendRenewalWhatsapp(c, wc, store); if (r && r.ok) notified++; } catch (e) {}
      await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(store.id)}`,
        { renewal_notified_at: nowIso }, "return=minimal");
    }
  }
  return { ok: true, scanned: expired.length, closed, notified };
}

// Authorize the cron caller: Vercel Cron sends "Authorization: Bearer <CRON_SECRET>"
// automatically; we also accept the shared NOTIFY_SECRET (?secret=) or an admin.
function cronOk(req, q, c) {
  const cs = env("CRON_SECRET");
  if (cs && req.headers && req.headers.authorization === `Bearer ${cs}`) return true;
  if (secretOk(req, q, c)) return true;
  return adminOk({ headers: req.headers, query: q });
}

// Send a login OTP over WhatsApp using a Meta AUTHENTICATION template. The code
// goes in the body param AND the copy-code/URL button param (adjust to match the
// approved template named in WHATSAPP_TEMPLATE_OTP).
async function sendOtpWhatsapp(c, to, otp) {
  if (!c.token || !c.phoneId) return { ok: false, error: "whatsapp not configured" };
  const template = env("WHATSAPP_TEMPLATE_OTP") || "login_otp";
  const payload = {
    messaging_product: "whatsapp", to, type: "template",
    template: {
      name: template, language: { code: c.lang },
      components: [
        { type: "body", parameters: [{ type: "text", text: String(otp) }] },
        { type: "button", sub_type: "url", index: "0", parameters: [{ type: "text", text: String(otp) }] }
      ]
    }
  };
  let result;
  try {
    const r = await fetch(`${GRAPH}/${c.version}/${c.phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    result = { ok: r.ok, status: r.status, id: data?.messages?.[0]?.id, error: r.ok ? undefined : data };
  } catch (e) {
    result = { ok: false, error: e.message };
  }
  await logOtpSend(to, template, result);
  return result;
}

// Log every OTP send (never the code) to marketing_event_logs. A 200 from Meta
// only means "accepted": delivery can still fail later, and Meta reports that
// asynchronously to the webhook, which needs this row (keyed by wam_id) to land
// the failure reason on — OTP messages are not in whatsapp_messages.
async function logOtpSend(to, template, result) {
  try {
    const err = result.ok ? null : result.error;
    await sbWrite("POST", "marketing_event_logs", [{
      event_id: crypto.randomUUID(), event_name: "otp_send", destination: "whatsapp_otp",
      payload_json: { wam_id: result.id || null, phone_tail: String(to).slice(-4), template },
      response_json: result.ok ? { id: result.id || null } : (err && typeof err === "object" ? err : { error: String(err || "") }),
      status: result.ok ? "accepted" : "send_failed",
      error_message: result.ok ? null : JSON.stringify(err || "").slice(0, 500)
    }], "return=minimal");
  } catch (e) {}
}

// Meta delivers free-form text ONLY inside the 24h window that the recipient's own
// last message opens. Outside it the Cloud API still answers HTTP 200 and fails the
// delivery later (131047, reported only to the webhook) — so a "successful" send
// proves nothing and no fallback ever fires. Measured 2026-09-21: 0 of 13 recent
// orders had an open window at the store's number, i.e. every rich text alert
// since it shipped was accepted and silently dropped. This decides up front.
// Fails CLOSED (window "shut") on any error: the approved template always works.
async function serviceWindowOpen(to) {
  try {
    const since = new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString();
    const rows = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(to)}&direction=eq.in&created_at=gte.${encodeURIComponent(since)}&select=id&limit=1`);
    return Array.isArray(rows) && rows.length > 0;
  } catch (e) { return false; }
}

// Log every order-alert send (store / admin / customer) so the webhook can land
// Meta's later delivery verdict on it — same mechanism as logOtpSend. Before this
// the statuses of these messages were thrown away, so "sent" was the last thing
// anyone could ever know. No customer data goes in: order id, role, phone tail.
async function logOrderAlertSend(orderId, role, to, result) {
  try {
    const err = result.ok ? null : result.error;
    await sbWrite("POST", "marketing_event_logs", [{
      event_id: crypto.randomUUID(), event_name: "order_alert", destination: "whatsapp_order_alert",
      payload_json: { wam_id: result.id || null, order_id: String(orderId || ""), role, phone_tail: String(to).slice(-4), via: result.via || null, window_closed: !!result.windowClosed },
      response_json: result.ok ? { id: result.id || null } : (err && typeof err === "object" ? err : { error: String(err || "") }),
      status: result.ok ? "accepted" : "send_failed",
      error_message: result.ok ? null : JSON.stringify(err || "").slice(0, 500)
    }], "return=minimal");
  } catch (e) {}
}

// Hash an OTP bound to its phone with a server-side pepper, so a DB leak can't
// recover codes and a code can't be replayed for a different number.
function otpHash(phone, code) {
  const pepper = env("OTP_PEPPER") || env("NOTIFY_SECRET") || env("WHATSAPP_TOKEN") || "dukkanci-otp-pepper";
  return crypto.createHmac("sha256", pepper).update(`${phone}:${code}`).digest("hex");
}

function cfg() {
  return {
    token: env("WHATSAPP_TOKEN"),
    phoneId: env("WHATSAPP_PHONE_NUMBER_ID"),
    version: env("WHATSAPP_API_VERSION") || "v21.0",
    cc: env("WHATSAPP_DEFAULT_COUNTRY_CODE") || "90",
    lang: env("WHATSAPP_TEMPLATE_LANG") || "ar",
    tplStore: env("WHATSAPP_TEMPLATE_STORE"),
    // Richer 11-variable store alert (address + map link + payment + dashboard
    // login). Optional: when it is unset the store alert falls back to the old
    // 6-variable tplStore exactly as before, so nothing breaks before the new
    // template is approved in Meta. Body to create in WhatsApp Manager is
    // documented next to buildStoreOrderParams().
    tplStoreFull: env("WHATSAPP_TEMPLATE_STORE_FULL"),
    tplCustomer: env("WHATSAPP_TEMPLATE_CUSTOMER"),
    tplStatus: env("WHATSAPP_TEMPLATE_STATUS") || "order_status_update",
    // Admin recipients — get a copy of every new order regardless of whether the
    // store has a working number. NOT the platform's own sending number: WhatsApp
    // Cloud API cannot deliver a message from a number to itself, so this must be
    // a separate personal number. Comma-separated; override via env if they change.
    adminPhones: (env("WHATSAPP_ADMIN_PHONES") || "905533333362,905528000220").split(",").map(s => s.trim()).filter(Boolean),
    secret: env("NOTIFY_SECRET")
  };
}

// Normalize a messy local/international number to E.164 digits (no +).
// Tuned for Turkish numbers: "+90 505 ...", "0505 ...", "505 ..." all work.
function toE164(raw, cc) {
  let d = String(raw == null ? "" : raw).replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith(cc) && d.length >= cc.length + 9) return d; // already has country code
  if (d.startsWith("0")) d = d.slice(1);                       // strip national trunk 0
  if (d.length <= 11) d = cc + d;                              // local -> prepend country code
  return d;
}

// Canonical phone key for store-login matching: digits only, last 10 (the
// Turkish national number) so +90 / 0 / spacing variants all map to one key.
function phoneKey(raw) {
  const d = String(raw == null ? "" : raw).replace(/\D/g, "");
  return d.length > 10 ? d.slice(-10) : d;
}

// Generated store password: 8 chars from an unambiguous alphabet (no 0/O/1/l/I).
function genPassword(n = 8) {
  const A = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const buf = crypto.randomBytes(n);
  let s = "";
  for (let i = 0; i < n; i++) s += A[buf[i] % A.length];
  return s;
}

// H3: store-credential passwords are hashed at rest with scrypt (Node built-in,
// no dependency). Format: "scrypt$<saltHex>$<hashHex>". Legacy rows are plaintext
// and are upgraded lazily on the owner's next successful login (see store-login).
function isHashedPassword(v) { return typeof v === "string" && v.startsWith("scrypt$"); }
function hashPassword(plain) {
  const salt = crypto.randomBytes(16);
  const derived = crypto.scryptSync(String(plain), salt, 64);
  return "scrypt$" + salt.toString("hex") + "$" + derived.toString("hex");
}
function verifyPasswordHash(plain, stored) {
  const parts = String(stored || "").split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  try {
    const salt = Buffer.from(parts[1], "hex");
    const expected = Buffer.from(parts[2], "hex");
    if (!salt.length || !expected.length) return false;
    const derived = crypto.scryptSync(String(plain), salt, expected.length);
    return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
  } catch (e) { return false; }
}

function sb() {
  return {
    url: (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    key: env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || PUB_KEY
  };
}

// ---------------------------------------------------------------------------
// Inline-image offloading — the root fix for base64 blobs inside DB rows.
// Merchant/admin/join forms send images as data:image/...;base64 strings inside
// the row JSON (readImageFileResized in app.js). They used to be stored as-is,
// bloating every catalog/settings fetch for every visitor (a single store page
// once carried ~1.9MB of base64). Any data: image arriving in a write below is
// re-compressed to WebP (sharp), uploaded to the public campaign-images bucket,
// and the field is replaced with the hosted URL before the row hits the DB.
// Fail-open: on any upload error the original value is kept (= old behavior),
// so a storage hiccup can never block a merchant's save.
const INLINE_IMG_RE = /^data:image\/[a-z0-9.+-]+;base64,/i;
async function offloadInlineImage(dataUrl, label) {
  const input = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  if (!input.length || input.length > 8 * 1024 * 1024) throw new Error("bad image size");
  const sharp = require("sharp"); // lazy — only loaded when a base64 image actually arrives
  const out = await sharp(input)
    .resize(1280, 1280, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();
  const { url, key } = sb();
  const safe = String(label).toLowerCase().replace(/[^a-z0-9_-]+/g, "-").slice(0, 60) || "img";
  const name = `${safe}_${Date.now()}_${crypto.randomBytes(3).toString("hex")}.webp`;
  const r = await fetch(`${url}/storage/v1/object/campaign-images/${name}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "image/webp", "x-upsert": "true" },
    body: out
  });
  if (!r.ok) throw new Error(`storage upload ${r.status}`);
  return `https://www.dukkanci.com.tr/media/campaign-images/${name}`;
}
// Replace data: images in the named fields of a flat row object.
async function offloadRowImages(row, fields, label) {
  for (const f of fields) {
    if (typeof row[f] === "string" && INLINE_IMG_RE.test(row[f])) {
      try { row[f] = await offloadInlineImage(row[f], `${label}_${f}`); }
      catch (e) { console.warn("inline image offload failed:", f, e.message); }
    }
  }
}
// Recursively replace data: images anywhere inside a JSON value (site_settings
// content nests them at arbitrary depth, e.g. categories items[].image).
// budget caps uploads per request so a malformed payload can't spam storage.
async function offloadJsonImages(value, label, budget = { n: 20 }) {
  if (typeof value === "string") {
    if (INLINE_IMG_RE.test(value) && budget.n > 0) {
      budget.n--;
      try { return await offloadInlineImage(value, label); }
      catch (e) { console.warn("inline image offload failed:", label, e.message); }
    }
    return value;
  }
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) value[i] = await offloadJsonImages(value[i], label, budget);
    return value;
  }
  if (value && typeof value === "object") {
    for (const k of Object.keys(value)) value[k] = await offloadJsonImages(value[k], label, budget);
    return value;
  }
  return value;
}
async function sbGet(path) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return null;
    const rows = await r.json().catch(() => null);
    return Array.isArray(rows) ? rows : null;
  } catch (e) { return null; }
}

// Exact row count via the Content-Range header. Returns null (NOT 0) when the
// count fails, so callers can tell "unknown" from "genuinely empty".
// Same helper pattern already proven in api/campaign.js.
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

// Allow-list of real banner ids, used to reject forged banner-event writes.
// Cached in module scope (warm serverless instances reuse it) for 60s so a busy
// page doesn't re-read site_settings on every impression. Invalidated eagerly
// whenever the banners setting is saved.
const bannerIdCache = { ids: null, at: 0 };
async function knownBannerIds() {
  const now = Date.now();
  if (bannerIdCache.ids && now - bannerIdCache.at < 60000) return bannerIdCache.ids;
  const rows = await sbGet("site_settings?key=eq.banners&select=value");
  // null => the read itself failed; return null so the caller skips validation
  // rather than silently dropping every real event during a Supabase blip.
  if (!rows) return bannerIdCache.ids;
  const items = (rows[0] && rows[0].value && Array.isArray(rows[0].value.items)) ? rows[0].value.items : [];
  bannerIdCache.ids = new Set(items.map(b => b && b.id).filter(Boolean).map(String));
  bannerIdCache.at = now;
  return bannerIdCache.ids;
}

// Fetch EVERY row matching `path`, paging past PostgREST's db-max-rows cap with
// Range headers. That cap is 1000 on this project and it truncates EVERY
// response regardless of any `&limit=` in the query — verified directly against
// production (`products?limit=5000` returns exactly 1000 of 11,725 rows). So a
// plain sbGet() on a growing table silently drops rows with no error anywhere.
// `path` must not carry its own `limit=`. `max` is a hard safety stop.
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

// Write to Supabase (insert/upsert/patch). `prefer` tunes conflict handling;
// inbound messages upsert on wam_id so webhook retries don't duplicate rows.
async function sbWrite(method, path, body, prefer) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key, Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: prefer || "return=representation"
      },
      body: JSON.stringify(body)
    });
    const rows = await r.json().catch(() => null);
    return { ok: r.ok, status: r.status, rows };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ── M1: login brute-force throttle ──────────────────────────────────────────
// Backed by the login_attempts table (service-role only). FAILS OPEN on ANY
// error — a throttle must never be the reason a legitimate login is refused, and
// it must keep working before migrations/20260909_login_rate_limit.sql is applied
// (until then loginThrottleBlocked always returns false, i.e. no throttling).
const LOGIN_MAX_FAILS = 10;                  // failures allowed inside the window
const LOGIN_WINDOW_MS = 15 * 60 * 1000;      // rolling window
const LOGIN_LOCK_MS = 15 * 60 * 1000;        // lock duration once the cap is hit
const ORDERS_LOOKUP_MAX = 25;                // M4: phone-keyed order lookups per IP per window
function clientIp(req) {
  const xff = String((req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) || "");
  return xff.split(",")[0].trim() || "unknown";
}
async function loginThrottleBlocked(key) {
  try {
    const rows = await sbGet(`login_attempts?key=eq.${encodeURIComponent(key)}&select=locked_until&limit=1`);
    const row = Array.isArray(rows) && rows[0];
    return !!(row && row.locked_until && Date.parse(row.locked_until) > Date.now());
  } catch (e) { return false; }
}
async function recordLoginFailure(key, cap = LOGIN_MAX_FAILS) {
  try {
    const rows = await sbGet(`login_attempts?key=eq.${encodeURIComponent(key)}&select=fails,window_start&limit=1`);
    const row = Array.isArray(rows) && rows[0];
    const now = Date.now();
    let fails = 1, windowStart = new Date(now).toISOString(), lockedUntil = null;
    if (row && row.window_start && (now - Date.parse(row.window_start)) < LOGIN_WINDOW_MS) {
      fails = (row.fails || 0) + 1;
      windowStart = row.window_start;
    }
    if (fails >= cap) lockedUntil = new Date(now + LOGIN_LOCK_MS).toISOString();
    await sbWrite("POST", "login_attempts?on_conflict=key",
      { key, fails, window_start: windowStart, locked_until: lockedUntil, updated_at: new Date(now).toISOString() },
      "resolution=merge-duplicates,return=minimal");
  } catch (e) {}
}
async function clearLoginThrottle(key) {
  try {
    await sbWrite("PATCH", `login_attempts?key=eq.${encodeURIComponent(key)}`,
      { fails: 0, locked_until: null, updated_at: new Date().toISOString() }, "return=minimal");
  } catch (e) {}
}

// ── Audit log + merchant notifications (spec §17/§19) ───────────────────────
// Both are BEST-EFFORT: wrapped so a logging failure can never break the main
// write (same contract as the price-history hook). Service-role-only tables.
async function logAudit(storeId, actor, action, entityType, entityId, oldValue, newValue) {
  try {
    await sbWrite("POST", "audit_logs", {
      store_id: Number(storeId) || null, actor: actor || null, action,
      entity_type: entityType || null, entity_id: entityId != null ? String(entityId) : null,
      old_value: oldValue ?? null, new_value: newValue ?? null
    }, "return=minimal");
  } catch (e) { /* audit is best-effort */ }
}
async function notifyMerchant(storeId, type, title, message, entityType, entityId) {
  try {
    await sbWrite("POST", "merchant_notifications", {
      store_id: Number(storeId) || null, type, title: title || null, message: message || null,
      entity_type: entityType || null, entity_id: entityId != null ? String(entityId) : null
    }, "return=minimal");
  } catch (e) { /* notifications are best-effort */ }
}

// ───────────────────────── GoTrue admin: phone-login session ───────────────
// WhatsApp OTP login is delivered through OUR Meta number (send-order-otp), NOT
// Supabase's phone provider — so the native signInWithOtp path is dead. Instead,
// once the WhatsApp code is verified we mint a real Supabase session here: we
// create/reuse an auth user keyed by a synthetic email derived from the phone,
// then ask GoTrue for a magiclink token and hand it back to the (already phone-
// verified) client to exchange for a session via supabase.auth.verifyOtp(). No
// SMS/WhatsApp provider needs to be enabled in Supabase Auth for this to work.
const OTP_LOGIN_EMAIL_DOMAIN = "otp.dukkanci.app";
function phoneLoginEmail(phoneDigits) { return `wa${phoneDigits}@${OTP_LOGIN_EMAIL_DOMAIN}`; }

async function goTrue(method, path, body) {
  const { url, key } = sb();
  try {
    const r = await fetch(`${url}/auth/v1/${path}`, {
      method,
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined
    });
    const json = await r.json().catch(() => null);
    return { ok: r.ok, status: r.status, json };
  } catch (e) { return { ok: false, status: 0, error: e.message }; }
}

// Idempotently ensure the auth user exists, then return a single-use magiclink
// token the client exchanges for a session. Requires SUPABASE_SERVICE_ROLE_KEY.
async function mintLoginSession(phoneDigits) {
  if (!env("SUPABASE_SERVICE_ROLE_KEY")) return { ok: false, reason: "no_service_role" };
  const email = phoneLoginEmail(phoneDigits);
  // Create the user (idempotent). Setting phone keeps user.phone populated for
  // merchant-by-phone detection; "already registered" just means it exists.
  await goTrue("POST", "admin/users", {
    email, email_confirm: true,
    phone: phoneDigits, phone_confirm: true,
    user_metadata: { phone: "+" + phoneDigits, login_via: "whatsapp" }
  });
  // generate_link does NOT send an email — it returns the token the email link
  // would have carried. We pass that straight to the verified client.
  const link = await goTrue("POST", "admin/generate_link", { type: "magiclink", email });
  const j = link && link.json;
  if (!link.ok || !j) return { ok: false, reason: "mint_failed" };
  const props = j.properties || j;
  const tokenHash = props.hashed_token || j.hashed_token;
  const emailOtp = props.email_otp || j.email_otp;
  if (!tokenHash && !emailOtp) return { ok: false, reason: "mint_failed" };
  return { ok: true, tokenHash, emailOtp, email };
}

// ───────────────────────── Web Push (browser notifications) ────────────────
// Self-contained Web Push sender — RFC 8291 ("aes128gcm" payload encryption) +
// RFC 8292 (VAPID auth) — built on Node's crypto so we add NO dependency (matches
// the rest of this file). Sends an encrypted JSON payload to a browser push
// subscription row in push_subscriptions. No-ops gracefully when VAPID is unset.

function b64uToBuf(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64");
}
function bufToB64u(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Node KeyObject for the VAPID private key, built from the raw base64url values
// (32-byte d; x/y come from the 65-byte uncompressed public point).
function vapidPrivateKey() {
  const pub = b64uToBuf(env("VAPID_PUBLIC_KEY"));
  const d = b64uToBuf(env("VAPID_PRIVATE_KEY"));
  if (pub.length !== 65 || !d.length) return null;
  const jwk = { kty: "EC", crv: "P-256", x: bufToB64u(pub.slice(1, 33)), y: bufToB64u(pub.slice(33, 65)), d: bufToB64u(d) };
  try { return crypto.createPrivateKey({ key: jwk, format: "jwk" }); } catch (e) { return null; }
}

// Signed VAPID JWT (ES256) bound to the push service origin (`aud`).
function vapidJwt(audience) {
  const key = vapidPrivateKey();
  if (!key) return null;
  const header = bufToB64u(Buffer.from(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const sub = env("VAPID_SUBJECT") || "mailto:newmarketconsult@gmail.com";
  const payload = bufToB64u(Buffer.from(JSON.stringify({ aud: audience, exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, sub })));
  const input = `${header}.${payload}`;
  // dsaEncoding 'ieee-p1363' → raw 64-byte R||S (JOSE format), not DER.
  const sig = crypto.sign("sha256", Buffer.from(input), { key, dsaEncoding: "ieee-p1363" });
  return `${input}.${bufToB64u(sig)}`;
}

// Encrypt `payload` (string) for a subscription per RFC 8291 (aes128gcm).
// Returns the request body Buffer: salt(16)|rs(4)|idlen(1)|keyid(as_public)|ciphertext.
function encryptPush(payload, p256dhB64, authB64) {
  const uaPublic = b64uToBuf(p256dhB64);      // 65 bytes
  const authSecret = b64uToBuf(authB64);      // 16 bytes
  const ec = crypto.createECDH("prime256v1");
  ec.generateKeys();
  const asPublic = ec.getPublicKey();         // 65 bytes
  const sharedSecret = ec.computeSecret(uaPublic);

  const salt = crypto.randomBytes(16);
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0", "utf8"), uaPublic, asPublic]);
  const ikm = Buffer.from(crypto.hkdfSync("sha256", sharedSecret, authSecret, keyInfo, 32));
  const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0", "utf8"), 16));
  const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0", "utf8"), 12));

  const plaintext = Buffer.concat([Buffer.from(payload, "utf8"), Buffer.from([0x02])]); // single-record delimiter
  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096, 0);
  const idlen = Buffer.from([asPublic.length]);
  return Buffer.concat([salt, rs, idlen, asPublic, ciphertext]);
}

// Deliver one push. gone=true (404/410) means the subscription is dead → prune it.
async function sendOnePush(sub, payloadStr) {
  let endpoint;
  try { endpoint = new URL(sub.endpoint); } catch (e) { return { ok: false, gone: true }; }
  const jwt = vapidJwt(`${endpoint.protocol}//${endpoint.host}`);
  if (!jwt) return { ok: false, reason: "vapid" };
  let body;
  try { body = encryptPush(payloadStr, sub.p256dh, sub.auth); } catch (e) { return { ok: false, reason: e.message }; }
  try {
    const r = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: "86400",
        Authorization: `vapid t=${jwt}, k=${env("VAPID_PUBLIC_KEY")}`
      },
      body
    });
    return { ok: r.ok, status: r.status, gone: r.status === 404 || r.status === 410 };
  } catch (e) { return { ok: false, reason: e.message }; }
}

// Push `payload` (object) to every subscription matching a PostgREST filter,
// pruning dead ones. No-ops when VAPID isn't configured.
async function pushToSubscriptions(filter, payload) {
  if (!env("VAPID_PUBLIC_KEY") || !env("VAPID_PRIVATE_KEY")) return { skipped: true, reason: "vapid not configured" };
  const subs = await sbGet(`push_subscriptions?${filter}&select=id,endpoint,p256dh,auth`);
  if (!Array.isArray(subs) || !subs.length) return { sent: 0 };
  const payloadStr = JSON.stringify(payload);
  let sent = 0; const dead = [];
  for (const sub of subs) {
    const r = await sendOnePush(sub, payloadStr);
    if (r.ok) sent++; else if (r.gone) dead.push(sub.id);
  }
  if (dead.length) await sbWrite("DELETE", `push_subscriptions?id=in.(${dead.join(",")})`, undefined, "return=minimal");
  return { sent, pruned: dead.length };
}

// New order → notify the store's subscribers + any admin subscribers (all stores).
async function pushNewOrder(order) {
  const payload = {
    title: "🛒 طلب جديد",
    body: `طلب ${order.id} • ${order.customer || ""} • ${money(order.total)}`.replace(/\s+•\s+•/g, " •").trim(),
    // "/" → the SW only focuses the already-open merchant/admin tab (no redirect
    // that could bounce an admin onto the merchant login or vice-versa).
    url: "/",
    tag: "order-" + order.id
  };
  return pushToSubscriptions(`or=(store_id.eq.${encodeURIComponent(order.storeId)},role.eq.admin)`, payload);
}

// Status change → notify the customer who placed the order (matched by phone key).
async function pushOrderStatus(orderId, custPhoneKey, storeName, status, line) {
  if (!custPhoneKey) return { skipped: true };
  const payload = {
    title: `تحديث طلبك ${orderId}`,
    body: `${storeName}: ${status}${line ? " — " + line : ""}`,
    url: "/orders",                                   // opens the customer's "طلباتي" page
    tag: "order-" + orderId
  };
  return pushToSubscriptions(`customer_phone=eq.${encodeURIComponent(custPhoneKey)}&role=eq.customer`, payload);
}

// Admin gate: the panel sends the password as `x-admin-key` (or ?key=). It must
// match ADMIN_PASSWORD. If ADMIN_PASSWORD is unset, the inbox endpoints are
// closed (403) rather than open — fail safe, never expose customer chats.
// Secret used to sign admin session tokens. Prefer a dedicated secret; fall back
// to ADMIN_PASSWORD so it works even if only the password is configured.
function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }

// Issue a short-lived signed session token (default 12h). The raw password is
// NEVER stored on the client — only this token is.
function signAdminToken(ttlMs = 12 * 60 * 60 * 1000) {
  const secret = adminSecret();
  if (!secret) return null;
  const payload = "exp=" + (Date.now() + ttlMs);
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + sig;
}

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

// Merchant session tokens: signed JWT-like token encoding the list of store ids
// the merchant owns. Uses the same ADMIN_PASSWORD / ADMIN_SESSION_SECRET pepper.
// Format: base64url(storeIds=1,2&exp=<ms>) + "." + hmac
function signMerchantToken(storeIds, ttlMs = 12 * 60 * 60 * 1000) {
  const secret = adminSecret();
  if (!secret || !storeIds || !storeIds.length) return null;
  const payload = `storeIds=${storeIds.join(",")}&exp=${Date.now() + ttlMs}`;
  const sig = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(payload).toString("base64url") + "." + sig;
}

// Returns the list of store ids the token grants access to, or null if invalid/expired.
function verifyMerchantToken(token) {
  const secret = adminSecret();
  if (!secret) return null;
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return null;
  let payload;
  try { payload = Buffer.from(parts[0], "base64url").toString("utf8"); } catch (e) { return null; }
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(parts[1]), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const pm = /storeIds=([^&]+)&exp=(\d+)/.exec(payload);
  if (!pm || Date.now() >= Number(pm[2])) return null;
  return pm[1].split(",").map(Number).filter(Boolean);
}

// Verify the typed admin password (used ONLY at login to mint a token).
function adminPasswordOk(req) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return false;
  const got = req.headers["x-admin-key"] || (req.query && req.query.key) || "";
  if (!got) return false;
  const a = Buffer.from(String(got));
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Admin gate for all protected actions. Accepts a valid session token
// (preferred) OR the password header/legacy ?key= (kept for the login call and
// backward compatibility). New clients send the token; the password never needs
// to travel in a URL again.
function adminOk(req) {
  if (verifyAdminToken(req.headers && req.headers["x-admin-token"])) return true;
  return adminPasswordOk(req);
}

// Merchant gate: verifies the signed merchant token (x-merchant-token header) and
// checks the requested storeId is in the token's allowed store list. Synchronous —
// no DB round-trip needed after login.
function merchantOk(req, storeId) {
  const token = String(req.headers["x-merchant-token"] || "").trim();
  if (!token || !storeId) return false;
  const ids = verifyMerchantToken(token);
  return Array.isArray(ids) && ids.includes(Number(storeId));
}

// Resolve the Supabase user behind an access token (x-sb-token). Returns the
// GoTrue user object or null. Uses the anon/publishable key as apikey; the user's
// JWT in the bearer is what identifies them.
async function goTrueUser(userToken) {
  if (!userToken) return null;
  const { url } = sb();
  const apikey = env("SUPABASE_ANON_KEY") || PUB_KEY;
  try {
    const r = await fetch(`${url}/auth/v1/user`, { headers: { apikey, Authorization: `Bearer ${userToken}` } });
    if (!r.ok) return null;
    return await r.json().catch(() => null);
  } catch (e) { return null; }
}

// Verify a Supabase-session merchant (Google/email/OTP login — no merchant
// password token) actually owns `storeId`. Mirrors the client's
// resolveMerchantStores: ownership via the store_users table, with a fallback to
// the user's VERIFIED auth phone matching the store's number.
async function verifySupabaseStoreOwner(req, storeId) {
  const token = String(req.headers["x-sb-token"] || "").trim();
  if (!token || !storeId) return false;
  const user = await goTrueUser(token);
  if (!user || !user.id) return false;
  const linked = await sbGet(`store_users?user_id=eq.${encodeURIComponent(user.id)}&store_id=eq.${encodeURIComponent(storeId)}&select=store_id&limit=1`);
  if (Array.isArray(linked) && linked.length) return true;
  const phone = String(user.phone || "").replace(/\D/g, "");
  if (phone) {
    const rows = await sbGet(`stores?id=eq.${encodeURIComponent(storeId)}&select=phone,whatsapp&limit=1`);
    const s = rows && rows[0];
    if (s) {
      const norm = v => String(v || "").replace(/\D/g, "");
      const bare = phone.replace(/^90/, "");
      const variants = new Set([phone, bare, "90" + bare]);
      if (variants.has(norm(s.phone)) || variants.has(norm(s.whatsapp))) return true;
    }
  }
  return false;
}

// Shared-secret gate for system/internal callers (Supabase DB webhook, cron).
// Returns true only when NOTIFY_SECRET is configured AND the caller presents it.
function secretOk(req, q, c) {
  if (!c.secret) return false;
  const got = req.headers["x-notify-secret"] || (q && q.secret) || "";
  if (!got) return false;
  const a = Buffer.from(String(got));
  const b = Buffer.from(c.secret);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Map a WhatsApp inbound message to a short text + type label (we store text;
// media becomes a labelled placeholder so the thread stays readable).
function describeMessage(m) {
  const t = m.type || "text";
  if (t === "text") return { type: "text", body: (m.text && m.text.body) || "" };
  if (t === "image") return { type: "image", body: (m.image && m.image.caption) || "[صورة]" };
  if (t === "audio") return { type: "audio", body: "[رسالة صوتية]" };
  if (t === "video") return { type: "video", body: (m.video && m.video.caption) || "[فيديو]" };
  if (t === "document") return { type: "document", body: (m.document && (m.document.filename || m.document.caption)) || "[ملف]" };
  if (t === "location") return { type: "location", body: "[موقع]" };
  if (t === "sticker") return { type: "sticker", body: "[ملصق]" };
  if (t === "button" || t === "interactive") return { type: t, body: (m.button && m.button.text) || "[رد تفاعلي]" };
  return { type: t, body: `[${t}]` };
}

// Canned auto-replies for the WhatsApp Manager commands + ice breakers. The
// customer taps a command (e.g. "/delivery") or an ice breaker, it arrives here
// as an inbound message, and we reply instantly with the matching info. Sent as
// free-form text — allowed because the customer just messaged (24h service
// window). Unrecognized messages get no auto-reply (the team answers from the inbox).
const SITE_URL = "https://www.dukkanci.com.tr";
const REPLY_ORDER = `🛒 لطلب من دكانجي:\n1) افتح الموقع: ${SITE_URL}\n2) اختر متجرك والمنتجات وأضِفها إلى السلة.\n3) أكمل الطلب واختر التوصيل أو الاستلام من المتجر.\nستصلك رسالة تأكيد فور إرسال الطلب، وتحديثات حالته أولاً بأول. 🌟`;
const REPLY_TRACK = `📦 لتتبّع طلبك:\n• افتح «طلباتي» في الموقع لمتابعة الحالة لحظياً.\n• أو أرسل لنا رقم طلبك (مثل DK-1234567) وسنوافيك بحالته.\nوتصلك تحديثات الحالة تلقائياً عبر واتساب عند كل مرحلة. 🚚`;
const REPLY_DELIVERY = `🚚 التوصيل في دكانجي:\n• يُحسب حسب المسافة بين المتجر وعنوانك، وتظهر الرسوم والوقت المتوقّع بدقّة عند إتمام الطلب.\n• نخدم أحياء إسطنبول، ويختلف النطاق حسب كل متجر.\n• يمكنك أيضاً الاستلام من المتجر مجاناً. 🏪`;
const REPLY_OFFERS = `🎁 لمشاهدة أحدث العروض والخصومات، افتح قسم «العروض» في الموقع:\n${SITE_URL}\nتتجدّد العروض باستمرار فتابعنا! ✨`;
const REPLY_STORES = `🏪 لتصفّح المتاجر والأقسام المتوفرة قرب عنوانك، افتح:\n${SITE_URL}\nمطاعم وبقالات ومتاجر متنوّعة بين يديك. 🛍️`;
const REPLY_SUPPORT = `💬 نحن هنا لمساعدتك! اكتب استفسارك في رسالة وسيردّ عليك فريق دعم دكانجي في أقرب وقت.\nويمكنك تصفّح الأسئلة الشائعة على: ${SITE_URL}`;
// Was: "أرسل لنا اسم متجرك ونوع نشاطه ومنطقته" — the bot then just sat on
// whatever the merchant typed back in free text; nobody ever read those
// replies as a lead (2026-09 WhatsApp audit: 11 real merchant messages, zero
// follow-up, one merchant explicitly asked "ممكن تفاصيل" and got refused).
// Hand off straight to a human number instead of collecting details the bot
// can't act on — paired with notifyMerchantLead() below, which pings that
// same number immediately with the merchant's own WhatsApp number so it's an
// actionable lead, not a dead-end transcript.
const REPLY_MERCHANT = `🤝 يسعدنا انضمامك كتاجر في دكانجي!\nللمتابعة المباشرة وإتمام إضافة متجرك (أو أي استفسار عن لوحة تحكم متجرك)، تواصل مع فريق التجار على واتساب:\n+90 552 800 02 20 📞`;
// Catches free text like "بدي اضيف متجري"/"كيف أضيف محلي"/"عندي مطعم بدي انضم"
// — not just the exact icebreaker button text or the /merchant command, both
// of which already map to REPLY_MERCHANT via ICEBREAKER_REPLIES/COMMAND_REPLIES
// below. Deliberately narrow (requires an explicit join/add-store verb near a
// store-ish noun) to avoid false-firing on customers just asking about a store.
const MERCHANT_INTEREST_RE = /(انضم(?:ام|ي)?|اضاف[ةه]\s*متجر|أ?ضيف\s*متجر[يى]?|أضم\s*متجري|تسجيل\s*متجر|بدي\s*(?:اضيف|انضم)|عندي\s*(?:محل|متجر|مطعم).{0,20}(?:بدي|أريد|كيف)|كيف\s*أ?ضيف\s*(?:متجري|محلي)|صاحب\s*متجر|شراكة\s*(?:مع|معكم))/i;
const REPLY_WELCOME = `أهلاً بك في دكانجي! 🛍️\nسوق الحي بين يديك — متاجر ومطاعم وبقالات حيّك في إسطنبول.\nكيف نساعدك؟ اكتب «/» لرؤية الخيارات السريعة، أو أخبرنا باستفسارك وسيردّ فريقنا. 🌟`;
const REPLY_AWAY = `شكراً لتواصلك مع دكانجي! 🌙\nفريقنا خارج أوقات العمل حالياً (نعمل يومياً ٩ صباحاً–١١ مساءً بتوقيت إسطنبول)، وسنردّ فور بدء الدوام.\nوللطلب في أي وقت، الموقع متاح على مدار الساعة: ${SITE_URL}`;
// Voice notes got zero reply at all (not even a bad one) — describeMessage()
// only labels them "[رسالة صوتية]" and the old flow never branched on that
// type, so it silently fell through (2026-09 audit: "2+ merchants sent voice
// notes, got no coherent reply"). No transcription pipeline exists yet, so
// this is an honest fallback — ask them to type — rather than pretending to
// have understood audio we never touched.
const REPLY_VOICE = `🎙️ استلمنا رسالتك الصوتية، لكن لا أستطيع الاستماع إليها حالياً.\nيرجى كتابة استفسارك نصاً وسأجيبك فوراً، أو انتظر قليلاً وسيتواصل معك أحد فريقنا. 🙏`;
// iOS has no native app (Google Play/Android only) but the site installs as a
// full PWA on iPhone — 3 separate iOS complaints in the 2026-09 audit got no
// guidance at all toward that option.
const REPLY_IOS = `📱 تطبيق دكانجي للآيفون:\nحالياً تطبيقنا الرسمي متاح فقط على Google Play (أندرويد)، لكن يمكنك تثبيت الموقع كتطبيق كامل على آيفون مباشرة:\n1) افتح ${SITE_URL} من متصفح Safari.\n2) اضغط زر المشاركة (مربع بسهم لأعلى) ثم «إضافة إلى الشاشة الرئيسية».\nستحصل على أيقونة وتجربة استخدام كاملة بلا الحاجة لمتجر التطبيقات. 🍏`;
const IOS_INTEREST_RE = /(اي\s*فون|آيفون|ايفون|iphone|ios\b|أبل|apple).{0,25}(تطبيق|تحميل|تنزيل|تثبيت|app)|(تطبيق|تحميل|تنزيل|تثبيت|app).{0,25}(اي\s*فون|آيفون|ايفون|iphone|ios\b)/i;

const COMMAND_REPLIES = {
  "/order": REPLY_ORDER, "/track": REPLY_TRACK, "/delivery": REPLY_DELIVERY,
  "/offers": REPLY_OFFERS, "/stores": REPLY_STORES, "/support": REPLY_SUPPORT, "/merchant": REPLY_MERCHANT
};
const ICEBREAKER_REPLIES = {
  "كيف أطلب من دكانجي؟": REPLY_ORDER,
  "ما هي مناطق التوصيل والرسوم؟": REPLY_DELIVERY,
  "أين وصل طلبي؟": REPLY_TRACK,
  "أريد إضافة متجري إلى دكانجي": REPLY_MERCHANT
};
function autoReplyFor(raw) {
  const text = String(raw == null ? "" : raw).trim();
  if (!text) return null;
  const first = text.split(/\s+/)[0].toLowerCase();          // "/delivery" from "/delivery من فضلك"
  if (first.charAt(0) === "/" && COMMAND_REPLIES[first]) return COMMAND_REPLIES[first];
  return ICEBREAKER_REPLIES[text.replace(/\s+/g, " ")] || null;
}
// Send a free-form auto-reply to the customer and log it to the inbox thread.
async function sendAutoReply(to, text) {
  const c = cfg();
  if (!c.token || !c.phoneId) return;
  const sent = await sendWhatsapp(c, to, { text });
  await sbWrite("POST", "whatsapp_messages", {
    wa_id: to, direction: "out", body: text, msg_type: "text",
    wam_id: sent.id || null, status: sent.ok ? "sent" : "failed",
    error: sent.ok ? null : JSON.stringify(sent.error || "").slice(0, 500)
  }, "return=minimal");
}

// ───────────────────────── Human escalation (spec §2) ──────────────────────
// When a customer asks for a human — or a human agent takes over — the AI steps
// aside. Per-conversation state lives in whatsapp_threads (service-role only).
const HUMAN_REQUEST_RE = /(موظّ?ف|[إا]نسان|بشر(?:ي)?|خدمة\s*(?:العملاء|الزبائن)|الدعم|ممثّ?ل|مندوب|(?:شخص|حدا?)\s*حقيقي|human|agent|representative|operator|real\s*person|customer\s*service|live\s*chat|talk\s*to\s*(?:someone|a\s*person|human))/i;
// The site's «دعم» (support) form deep-links straight into WhatsApp with a
// pre-filled "لدي مشكلة: <category>" message — an unambiguous, already-structured
// signal that a human is needed, regardless of category.
const STRUCTURED_COMPLAINT_RE = /^\s*لدي\s*مشكلة\s*:/i;
// AI_SYSTEM below explicitly tells the model it can never cancel an order or
// delete an account — so letting it try first before escalating only burns the
// customer's patience. Measured live (2026-09 WhatsApp audit): one customer
// repeated "لدي مشكلة: إلغاء طلب" 5× before stumbling onto phrasing that finally
// escalated; two customers churned after a cancel request went unanswered.
// (?<!ب) excludes the unrelated بالغ/بالغة/بالغي root ("severe"/"adult"/"reach")
// which would otherwise substring-match — Arabic has no \w-aware \b to lean on.
// Split into two reasons (was one "cancel" bucket): account deletion is a real,
// destructive, irreversible action — it must never be automated from an
// unauthenticated chat message (see project safety policy), so it gets its own
// reason + a distinct acknowledgment (below) that sets the right expectation
// ("a person will handle this") instead of implying either action happens on
// its own.
const CANCEL_ONLY_RE = /(?<!ب)[إا]ل(?:ا)?غ(?:اء|ي|و)|cancel(?:led|ling|ing)?\b/i;
const DELETE_ACCOUNT_RE = /حذف\s*(?:ال)?حساب|delete\s*(?:my\s*)?account/i;
// A delay/stuck complaint only counts paired with something order-shaped — bare
// "متأخر"/"تأخر"/"متوقف" alone is too broad (e.g. "الموقع متوقف") to safely
// auto-escalate on its own. "متوقف" covers the real churned-customer phrasing
// "الطلب متوقف" that "متأخر" alone missed (2026-09 WhatsApp audit).
const DELAY_COMPLAINT_RE = /(طلب.{0,15}(متأخ?ر|تأخ[رّ]|متوقف)|(متأخ?ر|تأخ[رّ]|متوقف).{0,15}طلب)/i;
// Returns the matched escalation REASON
// ("human"/"complaint"/"cancel"/"delete_account"/"delay"), or null when
// nothing matches — a reason string (not a boolean) so callers can tell
// admins *why* a thread escalated, while `if (wantsHuman(text))` still works
// unchanged (non-empty string is truthy, null is falsy).
function wantsHuman(text) {
  const t = String(text || "").trim();
  if (!t) return null;
  if (HUMAN_REQUEST_RE.test(t)) return "human";
  if (STRUCTURED_COMPLAINT_RE.test(t)) return "complaint";
  if (DELETE_ACCOUNT_RE.test(t)) return "delete_account";
  if (CANCEL_ONLY_RE.test(t)) return "cancel";
  if (DELAY_COMPLAINT_RE.test(t)) return "delay";
  return null;
}
async function getThreadFlags(wa_id) {
  try {
    const rows = await sbGet(`whatsapp_threads?wa_id=eq.${encodeURIComponent(wa_id)}&select=ai_paused,needs_human,pinned,label`);
    return (rows && rows[0]) || { ai_paused: false, needs_human: false, pinned: false, label: null };
  } catch (e) { return { ai_paused: false, needs_human: false, pinned: false, label: null }; }
}
async function setThreadFlags(wa_id, patch) {
  try {
    await sbWrite("POST", "whatsapp_threads?on_conflict=wa_id",
      { wa_id: String(wa_id), ...patch, updated_at: new Date().toISOString() },
      "resolution=merge-duplicates,return=minimal");
  } catch (e) { /* escalation state is best-effort */ }
}
const ESCALATION_REASON_LABEL = {
  human: "طلب التحدث مع موظف",
  complaint: "شكوى عبر نموذج الدعم",
  cancel: "طلب إلغاء طلب",
  delete_account: "طلب حذف حساب",
  delay: "شكوى تأخّر طلب"
};
// Reason-specific acknowledgment sent to the CUSTOMER right after escalating
// (was one generic "تمام 🙌 بحوّلك لموظف..." for every reason). Account
// deletion especially needs its own wording: it must never read as "done" or
// "will be done automatically" — deletion stays a human-only action (project
// safety policy), this message only sets that expectation honestly.
const ESCALATION_ACK_REPLY = {
  delete_account: "تلقّينا طلبك بحذف الحساب 🗑️\nهذا الإجراء يحتاج تنفيذاً يدوياً من فريقنا لضمان سلامة بياناتك، وسيتواصل معك أحد الموظفين قريباً لإتمامه. ابقَ معنا.",
  cancel: "تمام 🙌 استلمنا طلب الإلغاء وحوّلناه لموظف من فريق دكانجي ليتابع معك فوراً. ابقَ معنا وسيردّ عليك قريباً.",
  default: "تمام 🙌 بحوّلك لموظف من فريق دكانجي يتابع معك. ابقَ معنا وسيردّ عليك قريباً."
};
async function notifyAdminsEscalation(wa_id, name, reason) {
  const reasonLabel = ESCALATION_REASON_LABEL[reason] || "طلب التحدث مع موظف";
  try {
    await pushToSubscriptions("role=eq.admin", {
      title: "💬 عميل يطلب موظفاً",
      body: `${name || wa_id} بحاجة لرد بشري على واتساب (${reasonLabel})`,
      url: "/", tag: "wa-escalate-" + wa_id
    });
  } catch (e) { /* push is best-effort */ }
  // Web push needs an admin device with notifications granted and the tab (or
  // OS) actually delivering it — unproven in practice: the 2026-09 WhatsApp
  // audit found escalated threads sitting unanswered for hours, sometimes
  // never. WhatsApp is the channel admins are demonstrably watching, so mirror
  // the alert there too via the same zero-dependency send used for order-notify
  // failures (rawAdminAlert never depends on template/service-window state).
  try {
    await rawAdminAlert(cfg(), `🙋 عميل واتساب بحاجة لموظف — ${reasonLabel}\n${name ? name + " · " : ""}+${wa_id}`);
  } catch (e) {}
  // No audit_logs entry here: that table's store_id is NOT NULL (store-scoped by
  // design) and a WhatsApp thread has no store — tried it, PostgREST 23502'd and
  // was swallowed by the try/catch (best-effort logging failed silently). The
  // reason still reaches admins live via the push body + WhatsApp alert above;
  // persisting it durably would need a new column on whatsapp_threads (DDL), out
  // of scope here.
}

// Dukkanci WhatsApp support hours (Istanbul = UTC+3, no DST): open 09:00–23:00.
function isOutsideHours() {
  const h = (new Date().getUTCHours() + 3) % 24;
  return h < 9 || h >= 23;
}
// For unrecognized messages (those needing a human), greet a new conversation or
// send an out-of-hours notice — once per new conversation (first message, or the
// first after a 12h gap) so we never spam. Needs DB access to detect "new"; if it
// is unavailable we skip rather than send blindly.
async function maybeGreetOrAway(wa_id, timestamp) {
  const ts = timestamp ? new Date(Number(timestamp) * 1000).toISOString() : new Date().toISOString();
  const recent = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa_id)}&direction=eq.in&created_at=lt.${encodeURIComponent(ts)}&select=created_at&order=created_at.desc&limit=1`);
  if (!Array.isArray(recent)) return;
  const previous = recent[0];
  const NEW_SESSION_MS = 12 * 60 * 60 * 1000;
  const isNew = !previous || (Date.now() - new Date(previous.created_at).getTime() > NEW_SESSION_MS);
  if (!isNew) return;
  await sendAutoReply(wa_id, isOutsideHours() ? REPLY_AWAY : REPLY_WELCOME);
}

// AI auto-reply (OpenAI / ChatGPT). Answers free-text customer questions about
// Dukkanci. Single Chat Completions call over raw fetch (no SDK dep — matches the
// rest of this file). Model defaults to gpt-4o-mini (cheap + fast, well-suited to
// a customer-service bot), overridable via OPENAI_MODEL. Returns the reply text,
// or null when the key is unset / the call fails — callers fall back to the
// static welcome/away message.
const AI_SYSTEM = `أنت «مساعد دكانجي»، مساعد خدمة عملاء لمنصّة دكانجي — سوق الحي الإلكتروني في إسطنبول يجمع متاجر ومطاعم وبقالات الحيّ للطلب مع التوصيل أو الاستلام.
أسلوبك: ردّ بإيجاز ووضوح وودّ (جملتان إلى ثلاث كحد أقصى)، وبنفس لغة العميل (عربية غالباً، وقد تكون تركية أو إنجليزية).
تساعد في: كيفية الطلب، التوصيل والاستلام ومناطقه ورسومه، تصفّح المتاجر والمنتجات والأقسام، العروض، وانضمام التجار، والأسئلة العامة عن المنصة.
إرشادات مهمة:
- للطلب وجّه العميل إلى الموقع https://www.dukkanci.com.tr ليختار المتجر والمنتجات ويكمل الطلب. رسوم التوصيل تُحسب حسب المسافة وتظهر بدقّة عند إتمام الطلب، والاستلام من المتجر مجاني.
- لا تعرف تفاصيل طلب معيّن أو حالته أو بيانات الحساب أو الدفع. إن سُئلت عن حالة طلب اطلب رقمه (مثل DK-1234567) وأخبر العميل أن الفريق سيتابع، أو وجّهه إلى «طلباتي» في الموقع.
- عند سؤال العميل عن منتج (توفره/سعره/أي متجر يبيعه): إن وصلتك «نتائج بحث حقيقية بالمنتجات» أسفل هذه التعليمات فاعتمد عليها حرفياً (الاسم والسعر والمتجر ورابطه) وشارك رابط المتجر مباشرة بثقة — هو معلومة عامة منشورة على الموقع، لا داعي للتردد أو الرفض. إن وصلتك رسالة أن البحث لم يجد نتيجة، فقلها للعميل بصدق فوراً واقترح تصفّح الموقع أو إعادة صياغة اسم المنتج. لا تقل أبداً «سأبحث الآن» أو أي وعد بالبحث لاحقاً — البحث الفعلي يتم قبل ردّك دائماً، فردّك الأول هو نتيجته.
- عند سؤال العميل عن متجر بالاسم (رابطه، عنوانه، ساعاته، هل هو موجود): إن وصلتك «نتائج بحث حقيقية بالمتاجر» فاعتمد عليها حرفياً وشارك الرابط والعنوان مباشرة بثقة — اسم المتجر ورابطه وعنوانه وساعاته وعدد متاجر المنصة **كلها معلومات عامة منشورة على الموقع بلا استثناء**، فلا ترفض مشاركتها أو تتردد فيها أبداً مهما بدت شخصية الطلب. كذلك أرقام واتساب الدعم والبريد الإلكتروني أسفل «حقائق عامة حيّة» — شاركها كما وردت حرفياً، ولا تخترع رقماً من عندك أبداً إن لم يصلك في هذا القسم.
- **مصدر الحقيقة الوحيد لأي رابط أو منتج أو متجر هو ما يصلك حرفياً تحت «نتائج بحث حقيقية» في هذه الرسالة — لا معرفتك العامة عن العالم الخارجي أو عن دكانجي إطلاقاً.** إن لم يصلك اسم متجر أو رابطه هنا فهذا يعني أنه غير موجود على المنصة أو أن البحث لم يجده الآن — لا تُنشئ رابط dukkanci.com.tr ولا أي رابط آخر من عندك أبداً مهما بدا الاسم منطقياً أو مألوفاً لك، ولا تستخدم أي معلومة تعرفها عن مطعم/متجر حقيقي من مصادر خارج دكانجي (كخرائط جوجل مثلاً) حتى لو صادف أنها صحيحة واقعياً — العميل يثق أن كل رابط تعطيه هو رابط دكانجي حقيقي.
- لا تختلق أسعاراً أو أرقاماً أو أوقاتاً أو وعوداً؛ إن لم تكن متأكداً قل ذلك ووجّه العميل للفريق.
- لا تطلب أبداً بيانات حساسة (أرقام بطاقات، كلمات مرور، رموز) — هذا مختلف تماماً عن أرقام تواصل دكانجي العامة نفسها، وهي آمنة للمشاركة دائماً.
- للشكاوى أو الأمور المعقّدة التي تحتاج تدخّلاً بشرياً، اعتذر بلطف وأخبر العميل أن فريق دكانجي سيتواصل معه قريباً.
أجب مباشرةً بالرسالة النهائية فقط دون شرح طريقة تفكيرك.`;
// RAG retrieval: embed the customer's question and pull the most relevant chunks
// from the knowledge base (platform scope on the platform WhatsApp number). Best-
// effort with a short budget — on any failure we return "" and the reply proceeds
// on the base prompt alone. Keeps the webhook within its serverless time budget.
async function retrieveKnowledge(query) {
  try {
    const vec = await aiGateway.embed("embeddings", query, { timeoutMs: 5000 });
    if (!vec) return "";
    const r = await sbWrite("POST", "rpc/match_knowledge",
      { query_embedding: "[" + vec.join(",") + "]", match_count: 4, p_store_id: null }, "return=representation");
    const chunks = (r.ok && Array.isArray(r.rows)) ? r.rows : [];
    const good = chunks.filter(c => c.similarity == null || c.similarity > 0.2);
    if (!good.length) return "";
    return good.map((c, i) => `[${i + 1}] ${String(c.content).slice(0, 700)}`).join("\n\n");
  } catch (e) { return ""; }
}

// ───────────────────────── Real product search for the AI ──────────────────
// Before this, the WhatsApp AI would announce "سأبحث لك الآن…" and then always
// fail — it had no product-search capability at all (confirmed live, 2026-09
// WhatsApp audit: every "search" attempt in the transcript came back empty even
// for products that genuinely exist in the catalog, e.g. "خبز مصري" at صفا
// الشام). This is a server-side port of the Flutter app's
// core/utils/arabic.dart + StoreRepository.searchProducts — itself a port of
// the website's app.js normalizeAr()/getMatchingProducts — so all three
// surfaces agree on what "matches". See [[flutter-product-search]].
const AR_AMBIGUOUS_AFTER_NORMALIZE = new Set(["ا", "ه", "ي", "و"]);
const AR_LETTER_OR_DIGIT_RE = /[\p{L}\p{N}]/u;
function normalizeArabic(input) {
  return String(input == null ? "" : input)
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/[ً-ْ]/g, "") // harakat/diacritics
    .replace(/\s+/g, " ")
    .trim();
}
// Filler words that carry no product identity, stripped before search so "اريد
// خبز مصري" searches "خبز مصري" — not all four words AND-ed together, which
// would almost never match a real product's name/category. Written in natural
// spelling and normalized once at load, so this doesn't need to track every
// hamza/ta-marbuta fold by hand.
const SEARCH_STOPWORDS = new Set([
  "اريد", "أريد", "نريد", "ابحث", "ابحثي", "دور", "دوري", "فتش", "بحث", "انت", "أنت",
  "بدي", "بدك", "بدنا", "حابب", "حاب", "حابة", "ممكن", "لو", "سمحت", "سمحتوا", "هل",
  "من", "في", "على", "عن", "الى", "إلى", "مع", "هذا", "هذه", "ذلك", "تلك", "انا", "أنا",
  "لدي", "عندي", "عندك", "عندكم", "كيف", "متى", "وين", "فين", "كم", "اي", "أي", "ما",
  "ماهو", "ماهي", "هو", "هي", "يوجد", "متوفر", "متوفرة", "توجد", "شراء", "اشتري",
  "اشتريت", "نشتري", "مرحبا", "مرحباً", "السلام", "عليكم", "وعليكم", "طيب", "يعني",
  "او", "أو", "ايضا", "أيضاً", "كمان", "بس", "فقط", "لي", "لك", "له", "لها", "قدر",
  "تقدر", "تقدرو", "ياريت", "عايز", "عايزة", "محتاج", "محتاجة", "الرجاء", "رجاء",
  "يتوفر", "تتوفر", "وما", "سعر", "سعره", "بسعر", "اسعار", "الاسعار", "بكام", "كام",
  "شقد", "قديش", "وزن",
  // Request-phrasing words for store lookups specifically ("اعطيني رابط متجر
  // X" — confirmed live: without these, the AND-set becomes ["اعطيني","رابط",
  // "متجر","مندي"], none of which is in the store's real name/category, so the
  // search comes back empty for a store that clearly exists).
  "اعطيني", "اعطني", "اعطي", "عطيني", "رابط", "متجر", "محل", "اسم", "موقع", "عنوان", "اين",
  // Generic category words — confirmed live these can otherwise poison a store
  // search two ways: required in the strict AND-set (a supermarket like "صفا
  // الشام" doesn't literally have "مطعم" in its name/category, so "وين موقع
  // مطعم صفا الشام" matched nothing), AND, worse, as the sole survivor of the
  // loosen-to-first-term fallback (a bare "مطعم" alone matches dozens of
  // unrelated restaurants and drowns out the real, more specific name terms —
  // confirmed live it returned 5 random restaurants instead of "صفا الشام").
  "مطعم", "مطاعم", "سوبرماركت", "سوبر", "ماركت", "بقالة"
].map(normalizeArabic));
// Arabic attaches possessive pronouns as SUFFIXES with no space ("اسمه"="اسم"+
// "he/it", "سعرها"="سعر"+"her/its") — same shape of bug as the "ال"/"و" prefix
// handling above, confirmed live: "هل عندكم متجر اسمه فستق حلب" missed a real,
// confirmed store because "اسمه" (with the pronoun) isn't the bare "اسم" this
// file already lists as a stopword. Longest suffix first so a real match on a
// short suffix isn't shadowed by a longer one it also happens to end with.
const POSSESSIVE_SUFFIXES = ["ها", "هم", "كم", "نا", "ه", "ك", "ي"];
function stripPossessiveSuffix(t) {
  for (const suf of POSSESSIVE_SUFFIXES) {
    if (t.length > suf.length + 1 && t.endsWith(suf)) return t.slice(0, -suf.length);
  }
  return t;
}
// Free-text WhatsApp messages carry sentence punctuation ("؟"/"!"/"،" etc.)
// stuck directly onto the last word with no space ("الملوك؟") — normalizeArabic
// only strips harakat, not general punctuation, so matchesAllTerms would then
// miss an otherwise-exact product because the stored name has no "؟". A
// dedicated search-box query (what this algorithm was designed for) never has
// this problem; a conversational sentence pulled from chat history always might.
function productSearchTerms(query) {
  const stripped = normalizeArabic(query)
    .replace(/[؟!,.،؛:"'`()[\]{}«»…\-–—]/g, " ")
    .replace(/\s+/g, " ").trim();
  return stripped.split(" ").filter(t => {
    if (t.length < 2) return false;
    // Check the definite-article-stripped form too ("السعر"→"سعر") so the
    // stopword list doesn't need every "ال"-prefixed variant written out by
    // hand — but keep the ORIGINAL term (with "ال") for the actual search, in
    // case it's a real content word like "الملوك" in "شاي الملوك".
    const bareAl = t.length > 2 && t.startsWith("ال") ? t.slice(2) : t;
    // Same idea for the "و" ("and") conjunction, which informal Arabic writes
    // glued straight onto the next word with no space ("وبكام" = و + بكام) —
    // confirmed live: this exact miss made a real "شاي الملوك" search return
    // zero (the AND-set included the unstripped "وبكام", which matches no
    // product). Only used to decide whether to DROP the term entirely (when
    // its bare form is a stopword); a real content word starting with "و"
    // ("ورق عنب") is never stripped for the actual search, since its bare form
    // ("رق") isn't itself a recognized stopword.
    const bareWaw = t.length > 1 && t.startsWith("و") ? t.slice(1) : t;
    const barePossessive = stripPossessiveSuffix(t);
    return !SEARCH_STOPWORDS.has(t) && !SEARCH_STOPWORDS.has(bareAl) && !SEARCH_STOPWORDS.has(bareWaw)
      && !SEARCH_STOPWORDS.has(barePossessive);
  });
}
function matchesAllTerms(haystack, terms) {
  if (!terms.length) return false;
  const hay = normalizeArabic(haystack);
  return terms.every(t => hay.includes(t));
}
// Builds a deliberate SUPERSET ilike pattern for one normalized term: every
// letter that normalization folds (ا/ه/ي/و) becomes `_` (matches exactly one
// stored char, whatever it was spelled as — ه must still match a stored ة),
// and every character is `*`-joined (absorbs stripped tatweel/harakat — "حمص"
// must still reach a stored "حـمـص"). Non-letter/digit input also becomes `_`,
// which both handles punctuation and keeps user text safe inside PostgREST's
// comma/paren-delimited `or=(...)` syntax.
function arabicIlikePattern(term) {
  let out = "*";
  for (const ch of term) {
    const safe = AR_AMBIGUOUS_AFTER_NORMALIZE.has(ch) || !AR_LETTER_OR_DIGIT_RE.test(ch) ? "_" : ch;
    out += safe + "*";
  }
  return out;
}
// Candidate rows for `terms` — every term required (repeated PostgREST `or=`
// params AND together), matched against name OR category. Deliberately a
// superset; caller re-checks exactly via matchesAllTerms against the real
// (un-normalized) stored text.
async function fetchProductCandidates(terms, limit) {
  if (!terms.length) return [];
  const params = ["select=id,store_id,name,category,price,old_price,unit,price_on_request,available", "available=eq.true", `limit=${limit}`];
  for (const term of terms) {
    const pattern = encodeURIComponent(arabicIlikePattern(term));
    params.push(`or=(name.ilike.${pattern},category.ilike.${pattern})`);
  }
  const rows = await sbGet(`products?${params.join("&")}`);
  return Array.isArray(rows) ? rows : [];
}
// Real product search for the WhatsApp AI. Tries every remaining content word
// first (most precise); if that's too strict and returns nothing, loosens to
// just the first word — Arabic noun phrases put the head noun first ("خبز
// مصري" = bread, then the adjective), so it's the more useful single term to
// fall back to. Returns up to `limit` real rows from real, approved stores, or
// [] — never invents a result. Store-visibility gate mirrors the predicate
// already used elsewhere in this file (line ~1846/2274): approval_status null
// or "approved" only.
async function searchProductsForAi(query, limit = 5) {
  try {
    const allTerms = productSearchTerms(query).slice(0, 4); // cap — a long sentence shouldn't AND forever
    if (!allTerms.length) return [];
    let candidates = await fetchProductCandidates(allTerms, 200);
    let exact = candidates.filter(p => matchesAllTerms(`${p.name} ${p.category || ""}`, allTerms));
    if (!exact.length && allTerms.length > 1) {
      const loose = [allTerms[0]];
      candidates = await fetchProductCandidates(loose, 200);
      exact = candidates.filter(p => matchesAllTerms(`${p.name} ${p.category || ""}`, loose));
    }
    if (!exact.length) return [];
    const storeIds = [...new Set(exact.map(p => p.store_id).filter(Boolean))];
    if (!storeIds.length) return [];
    const storeRows = await sbGet(`stores?id=in.(${storeIds.join(",")})&select=id,name,slug,approval_status`);
    const storeById = new Map((Array.isArray(storeRows) ? storeRows : []).map(s => [s.id, s]));
    const visible = exact.filter(p => {
      const s = storeById.get(p.store_id);
      return s && (!s.approval_status || s.approval_status === "approved");
    });
    return visible.slice(0, limit).map(p => {
      const s = storeById.get(p.store_id);
      return {
        name: p.name, category: p.category || null,
        price: p.price_on_request ? null : Number(p.price) || null, unit: p.unit || null,
        store: s.name, storeUrl: `${SITE_URL}/store/${s.slug || s.id}`
      };
    });
  } catch (e) { return []; }
}
function formatProductResults(products) {
  return products.map(p => {
    const priceStr = p.price != null ? `${money(p.price)}${p.unit ? "/" + p.unit : ""}` : "السعر عند الطلب";
    return `- ${p.name}${p.category ? " (" + p.category + ")" : ""} — ${priceStr} — متجر ${p.store} — ${p.storeUrl}`;
  }).join("\n");
}

// ───────────────────────── Real store lookup for the AI ────────────────────
// The 2026-09 WhatsApp audit found the AI inconsistent about store info it
// already knows is public: it freely gave متجر الخوالي's exact link+address in
// one conversation, then flatly refused a link for مندي اليمن — a store it had
// JUST recommended by name — in another. Same fix shape as product search:
// ground it in a real lookup instead of leaving "should I answer this?" to the
// model's mood. Stores are few enough (~100 live, same threshold the Flutter
// app's searchStores() documents) to fetch whole and match in memory — no need
// for the ilike-candidate-narrowing dance searchProductsForAi needs at 14k+ rows.
async function searchStoresForAi(query, limit = 5) {
  try {
    const allTerms = productSearchTerms(query);
    if (!allTerms.length) return [];
    const rows = await sbGet("stores?select=id,name,slug,category,address,hours,approval_status&order=name.asc");
    if (!Array.isArray(rows)) return [];
    // Same visibility predicate as isStoreApproved() in app.js: null or
    // "approved" only — "pending"/"rejected" stores never surface here.
    const approved = rows.filter(s => !s.approval_status || s.approval_status === "approved");
    let matched = approved.filter(s => matchesAllTerms(`${s.name} ${s.category || ""}`, allTerms));
    // Same loosen-to-first-term fallback as searchProductsForAi, for the same
    // reason: a full sentence's remaining terms can still be one word too many.
    if (!matched.length && allTerms.length > 1) {
      matched = approved.filter(s => matchesAllTerms(`${s.name} ${s.category || ""}`, [allTerms[0]]));
    }
    return matched.slice(0, limit).map(s => ({
      name: s.name, category: s.category || null, address: s.address || null, hours: s.hours || null,
      url: `${SITE_URL}/store/${s.slug || s.id}`
    }));
  } catch (e) { return []; }
}
function formatStoreResults(stores) {
  return stores.map(s => {
    const bits = [s.category, s.address, s.hours].filter(Boolean);
    return `- ${s.name}${bits.length ? " (" + bits.join(" — ") + ")" : ""} — ${s.url}`;
  }).join("\n");
}
// Live counters + contact numbers the AI kept getting inconsistently right —
// fetched fresh every reply (both queries are cheap and indexed) instead of
// hardcoded, so an admin changing the support number in «site_settings» or the
// live store count moving never leaves the bot repeating a stale fact. The
// wrong number IS a real, confirmed bug this replaces: the audit transcript
// shows the AI once inventing "905551000530" as a "direct call" number —
// off by one digit from the real customer-service line "905551000630" shown
// in the site footer — because nothing grounded it and the model filled the
// gap itself. customerWa mirrors api/contact.js's exact resolution
// (site_settings.contactWa → contactPhone → hardcoded fallback).
const MERCHANT_SUPPORT_WA = "905528000220";
const FALLBACK_CUSTOMER_WA = "905551000630";
const SUPPORT_EMAIL = "info@dukkanci.com.tr";
async function getLiveFacts() {
  try {
    const [settingsRows, storeCount] = await Promise.all([
      sbGet("site_settings?select=key,value&key=in.(contactWa,contactPhone)"),
      sbCount("stores?or=(approval_status.is.null,approval_status.eq.approved)")
    ]);
    const settings = {};
    (Array.isArray(settingsRows) ? settingsRows : []).forEach(r => { settings[r.key] = r.value; });
    const customerWaDigits = String(settings.contactWa || settings.contactPhone || "").replace(/\D/g, "") || FALLBACK_CUSTOMER_WA;
    return { customerWa: customerWaDigits, merchantWa: MERCHANT_SUPPORT_WA, email: SUPPORT_EMAIL, storeCount: storeCount };
  } catch (e) {
    return { customerWa: FALLBACK_CUSTOMER_WA, merchantWa: MERCHANT_SUPPORT_WA, email: SUPPORT_EMAIL, storeCount: null };
  }
}
function formatLiveFacts(facts) {
  const lines = [
    `- عدد المتاجر الحية على دكانجي الآن: ${facts.storeCount != null ? facts.storeCount.toLocaleString("ar") : "غير معروف حالياً"}${facts.storeCount != null ? "" : " (لا تخترع رقماً)"}`,
    `- واتساب خدمة العملاء (استفسارات الطلبات والزبائن): +${facts.customerWa}`,
    `- واتساب خدمة أصحاب المتاجر (الانضمام كتاجر أو استفسارات لوحة المتجر): +${facts.merchantWa}`,
    `- البريد الإلكتروني: ${facts.email}`
  ];
  return lines.join("\n");
}
// Ordered candidate query strings to try, cheapest/most-specific first — the
// caller (aiReply) searches each in turn and stops at the first with results,
// so a self-sufficient message never pays for the extra ones:
//  1. the current message, if it has real search content of its own.
//  2. the current message combined with the customer's last message that had
//     search content — covers a short follow-up that only makes sense with
//     what it's a follow-up TO (live example, 2026-09 audit: "عندكم زيت زيتون
//     اصلي" → "شقد السعر التنكة" — "التنكة" alone matches nothing, combined it
//     correctly widens to the same olive-oil results).
//  3. that prior message alone — covers "ابحث انت"/"دور عليه" replies that
//     carry no product name at all (live example: "اريد خبز مصري" → "ابحث انت").
function searchQueryCandidates(currentText, priorMessages) {
  const out = [];
  const ownContent = productSearchTerms(currentText).length > 0;
  if (ownContent) out.push(currentText);
  let lastWithContent = null;
  for (let i = priorMessages.length - 1; i >= 0; i--) {
    const m = priorMessages[i];
    if (m.role === "user" && productSearchTerms(m.content).length) { lastWithContent = m.content; break; }
  }
  if (lastWithContent) {
    if (ownContent) out.push(`${lastWithContent} ${currentText}`);
    out.push(lastWithContent);
  }
  return out;
}

// ── Phase 1 order-creation helpers (see CLAUDE.md fix log, 2026-07-16) ──────

function haversineKm(origin, destination) {
  const toRadians = value => value * Math.PI / 180;
  const earthRadius = 6371;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(origin.lat)) * Math.cos(toRadians(destination.lat)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function normalizeDeliveryFee(rawFee) {
  return Math.max(150, Math.ceil((rawFee || 0) / 50) * 50);
}

async function nextOrderId() {
  for (let i = 0; i < 5; i++) {
    const candidate = "DK-" + String(crypto.randomInt(100000000, 999999999));
    const clash = await sbGet(`orders?id=eq.${candidate}&select=id&limit=1`);
    if (!Array.isArray(clash) || !clash.length) return candidate;
  }
  return "DK-" + Date.now().toString().slice(-9);
}

function publicOrderView(row) {
  const dd = (row.delivery_details && typeof row.delivery_details === "object") ? row.delivery_details : {};
  return {
    id: row.id, storeId: row.store_id, total: Number(row.total) || 0, items: row.items,
    fulfillment: dd.fulfillment || "delivery", address: dd.address || "",
    etaMin: 20 + (dd.fulfillment === "pickup" ? 0 : 25), closedWhenOrdered: !!dd.closedWhenOrdered
  };
}

// Best-effort, zero-dependency admin ping: a single plain-text WhatsApp send
// with NO template/window logic — used only as the very last resort when the
// normal alert pipeline itself throws, so the admin still hears about it even
// if the bug is inside sendAlert/sendOrderWhatsapp. Never throws.
async function rawAdminAlert(c, text) {
  const tos = (c.adminPhones || []).map(p => toE164(p, c.cc)).filter(Boolean);
  for (const to of tos) {
    try { await sendWhatsapp(c, to, { text }); } catch (e) {}
  }
}

// Fires the moment a merchant-interest message is detected (icebreaker,
// /merchant command, or free text matching MERCHANT_INTEREST_RE) — the old
// flow just replied with static text and left the merchant's own message
// sitting in the inbox as the only "lead record" (2026-09 audit: 11 real
// merchants messaged in, zero got followed up). Self-contained (calls cfg()
// itself, same as sendAutoReply) and sends ONLY to MERCHANT_SUPPORT_WA — not
// the full adminPhones list — per the user's explicit spec. Never throws.
async function notifyMerchantLead(waId, name) {
  const c = cfg();
  if (!c.token || !c.phoneId) return;
  const to = toE164(MERCHANT_SUPPORT_WA, c.cc);
  if (!to) return;
  const label = name ? `${name} (+${waId})` : `+${waId}`;
  const text = `🆕 تاجر جديد يرغب بالانضمام إلى دكانجي\nرقم واتساب التاجر: ${label}\nيرجى التواصل معه للمتابعة. 🤝`;
  try { await sendWhatsapp(c, to, { text }); } catch (e) {}
}

async function sendOrderWhatsapp(c, order, store, priceFlag) {
  const storeName = (store && store.name) || "متجرك";
  const storeTo = toE164(store && (store.whatsapp || store.phone), c.cc);
  const adminTos = c.adminPhones.map(p => toE164(p, c.cc)).filter(Boolean);
  const custTo = toE164(order.customerPhone, c.cc);
  const fulfillmentAr = order.fulfillment === "pickup" ? "استلام من المتجر" : "توصيل";
  const scheduleAr = [order.scheduleDay, order.scheduleTime].filter(Boolean).join(" · ");
  const fulfillmentFull = scheduleAr ? `${fulfillmentAr} - ${scheduleAr}` : `${fulfillmentAr} - في أقرب وقت`;
  const results = {};

  try {

  // Dashboard login goes to the STORE's own number only — admins receive a copy
  // of every store's orders, so putting credentials in the shared body would
  // WhatsApp every merchant's password to the admin phones on every order.
  const creds = await loadStoreCreds(order.storeId);

  // Legacy 6-variable parameters, kept byte-identical to what the approved
  // `order_store_alert` template expects — it stays the guaranteed-delivery
  // fallback until the richer template exists.
  const legacyParams = [String(order.id), order.customer, order.customerPhone, money(order.total), fulfillmentFull, itemsLine(order.lineItems) || "-"];

  // Meta only allows free-form text inside a 24h customer-service window (opened
  // by the recipient writing to us first), so it can't be the only path: try the
  // full formatted message, and on any failure fall back to the approved
  // template so the merchant is still alerted exactly as before.
  async function sendAlert(to, { text, params, legacy }, role) {
    let out;
    if (c.tplStoreFull) {
      const rich = await sendWhatsapp(c, to, { template: c.tplStoreFull, params });
      // A renamed, rejected or wrong-arity template would otherwise silence every
      // merchant alert on the platform — always keep the proven one as a net.
      if (rich.ok || !c.tplStore) out = { ...rich, via: "full-template" };
      else out = { ...(await sendWhatsapp(c, to, { template: c.tplStore, params: legacy })), via: "template", fellBackFrom: "full-template", fullTemplateError: rich.error };
    } else if (await serviceWindowOpen(to)) {
      // The recipient wrote to us in the last 23h, so free-form text is deliverable.
      const free = await sendWhatsapp(c, to, { text });
      if (free.ok || !c.tplStore) out = { ...free, via: "text" };
      else out = { ...(await sendWhatsapp(c, to, { template: c.tplStore, params: legacy })), via: "template", fellBackFrom: "free-form" };
    } else if (c.tplStore) {
      // Window shut (the normal case for merchants): only the approved template is
      // delivered. NEVER try text first here — Meta accepts it with a 200 and drops
      // it afterwards, so the template fallback would never run.
      out = { ...(await sendWhatsapp(c, to, { template: c.tplStore, params: legacy })), via: "template", windowClosed: true };
    } else {
      out = { ...(await sendWhatsapp(c, to, { text })), via: "text", windowClosed: true };
    }
    await logOrderAlertSend(order.id, role, to, out);
    return out;
  }

  if (storeTo) {
    results.store = await sendAlert(storeTo, {
      text: buildStoreOrderText(order, { creds }),
      params: buildStoreOrderParams(order, { creds }),
      legacy: legacyParams
    }, "store");
  } else {
    results.store = { skipped: true, reason: "store has no whatsapp/phone" };
  }

  // Customer confirmation is sent BEFORE the admin copy below on purpose: the
  // admin message needs to know whether the store and/or the customer actually
  // got notified, so it can flag it — and admins get a copy of every order
  // regardless, making that the one channel almost guaranteed to reach someone.
  if (custTo) {
    const text = `✅ تم استلام طلبك على دكانجي\n\nرقم الطلب: ${order.id}\nالمتجر: ${storeName}\nالإجمالي: ${money(order.total)}\n\nسنعلمك فور تأكيد المتجر لطلبك. شكراً لاستخدامك دكانجي 🛍️`;
    const params = [String(order.id), storeName, money(order.total)];
    results.customer = await sendWhatsapp(c, custTo, { template: c.tplCustomer, params, text });
    await logOrderAlertSend(order.id, "customer", custTo, { ...results.customer, via: c.tplCustomer ? "template" : "text" });
  } else {
    results.customer = { skipped: true, reason: "no customer phone" };
  }

  // A real (non-skipped) channel that had a number to send to but still didn't
  // succeed. Skipped channels (no phone on file) are a data gap, not a delivery
  // failure, so they're excluded — otherwise every guest/pickup order with no
  // store WhatsApp on file would falsely alarm as "notification failed".
  const storeFailed = !!storeTo && !(results.store && results.store.ok);
  const customerFailed = !!custTo && !(results.customer && results.customer.ok);

  if (adminTos.length) {
    const failNote = [
      storeFailed ? "🚨 تنبيه: لم يصل إشعار هذا الطلب للمتجر — تواصلوا معه يدوياً فوراً." : "",
      customerFailed ? "🚨 تنبيه: لم يصل تأكيد الطلب للزبون." : ""
    ].filter(Boolean).join("\n");
    const flagNote = priceFlag
      ? `⚠️ تنبيه سعر مشبوه: الإجمالي المُرسَل (${money(priceFlag.total)}) أقل بكثير من السعر الفعلي للمنتجات (${money(priceFlag.expectedSubtotal)}). تحقّق قبل تجهيز الطلب.\n\n`
      : "";
    // No `creds` here — see the comment above. The store name rides in the
    // customer slot because the approved template has no store placeholder and
    // admins need to tell one store's orders from another's. The failure banner
    // rides in the SAME slot (prefix) so it surfaces even in template mode,
    // where only the fixed params — not free text — actually get delivered.
    const adminLabel = (storeFailed || customerFailed ? "🚨 فشل إشعار — " : (priceFlag ? "⚠️ سعر مشبوه — " : "")) + `${storeName} — ${order.customer}`;
    const adminText = (failNote ? failNote + "\n\n" : "") + flagNote + buildStoreOrderText(order, { storeName });
    const adminParams = buildStoreOrderParams(order, { customerLabel: adminLabel, credsReplacement: `نسخة إدارة — ${storeName}` });
    const adminLegacy = [...legacyParams];
    adminLegacy[1] = adminLabel;
    results.admin = [];
    for (const to of adminTos) {
      results.admin.push({ to, ...(await sendAlert(to, { text: adminText, params: adminParams, legacy: adminLegacy }, "admin")) });
    }
  } else {
    results.admin = { skipped: true, reason: "no admin phones configured" };
  }

  try {
    const adminOkAll = Array.isArray(results.admin) ? results.admin.every(r => r.ok) : !!(results.admin && results.admin.ok);
    await logAudit(order.storeId, "system", "order_notify", "order", order.id, null, {
      store: !!(results.store && results.store.ok), admin: adminOkAll, customer: !!(results.customer && results.customer.ok),
      storeFailed, customerFailed
    });
  } catch (e) {}

  // If NOBODY got notified at all (store had a number and failed, and admin also
  // failed for every number), the templated admin copy above didn't get through
  // either — fire the zero-dependency plain-text fallback as a last resort.
  const adminOkAny = Array.isArray(results.admin) ? results.admin.some(r => r.ok) : !!(results.admin && results.admin.ok);
  if (storeFailed && !adminOkAny) {
    await rawAdminAlert(c, `🚨 دكانجي: فشل إشعار الطلب ${order.id} تماماً (المتجر والإدارة). تحقّقوا يدوياً من الطلب في لوحة التحكم.`);
  }

  return results;

  } catch (e) {
    // The alert pipeline itself crashed (a bug, not a delivery failure) — never
    // let that propagate and break order creation for the customer. Best-effort
    // raw ping so this doesn't fail completely silently, then return whatever
    // partial results we already have (order creation always continues).
    try { await rawAdminAlert(c, `🚨 دكانجي: تعطّل نظام إشعارات الطلب ${order && order.id} — ${String((e && e.message) || e).slice(0, 200)}`); } catch (e2) {}
    results.store = results.store || { ok: false, error: "notify pipeline crashed" };
    results.admin = results.admin || { ok: false, error: "notify pipeline crashed" };
    results.customer = results.customer || { ok: false, error: "notify pipeline crashed" };
    return results;
  }
}

// Re-prices an order's line items from the real `products` table (never the
// client-submitted per-item price) and flags it when the submitted total is
// far below what those real prices add up to. Returns null when nothing looks
// wrong or when it can't tell (missing products, empty cart) — always fails
// closed toward "not suspicious" so this can never hold up a real order.
// Re-price an order's line items from the real, current products table using
// each product's BASE price (variant/addon surcharges aren't modeled from the
// legacy lineItems, which carry options as text not indexes — so this is a
// safe LOWER bound on the true product value). Returns 0 when it can't tell
// (missing products, empty cart), so callers always fail toward "don't touch".
async function computeExpectedSubtotal(order) {
  try {
    const items = Array.isArray(order.lineItems) ? order.lineItems : [];
    const ids = [...new Set(items.map(i => Number(i.productId)).filter(Boolean))];
    if (!ids.length) return 0;
    const rows = await sbGet(`products?id=in.(${ids.join(",")})&select=id,price`);
    if (!Array.isArray(rows) || !rows.length) return 0;
    const priceById = new Map(rows.map(r => [Number(r.id), Number(r.price) || 0]));
    let expectedSubtotal = 0;
    for (const it of items) {
      const real = priceById.get(Number(it.productId));
      if (real == null) continue; // product not found/mismatched — skip rather than guess
      expectedSubtotal += real * (Number(it.qty) || 1);
    }
    return expectedSubtotal > 0 ? expectedSubtotal : 0;
  } catch (e) { return 0; }
}

async function checkOrderPriceSanity(order) {
  const expectedSubtotal = await computeExpectedSubtotal(order);
  if (expectedSubtotal <= 0) return null;
  const total = Number(order.total) || 0;
  // Delivery only ever ADDS to total, so ignoring it keeps this a safe floor
  // check; 30% leaves generous room for any real coupon/credit stacking.
  if (total < expectedSubtotal * 0.3) return { expectedSubtotal, total };
  return null;
}

// Throttle the paid AI path per WhatsApp sender: more than 20 inbound messages
// from the same number in the last hour skips the embedding+completion calls
// (the quiet greet/away fallback still applies). Fails open on any DB error —
// a rate-limiter must never be the reason a real customer's message is dropped.
async function aiReplyThrottled(wa_id) {
  try {
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const rows = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa_id)}&direction=eq.in&created_at=gte.${encodeURIComponent(since)}&select=id&limit=50`);
    return Array.isArray(rows) && rows.length > 20;
  } catch (e) { return false; }
}

async function aiReply(text, wa_id, timestamp) {
  // Routed through the AI Gateway: the active provider/model for the
  // whatsapp_autoreply feature is read from ai_feature_config. If no provider is
  // configured yet, the gateway falls back to OPENAI_API_KEY so behaviour is
  // unchanged. Build conversation context (prior messages, oldest→newest) here;
  // the system prompt is passed separately so every adapter places it correctly.
  const messages = [];
  try {
    const ts = timestamp ? new Date(Number(timestamp) * 1000).toISOString() : new Date().toISOString();
    const rows = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa_id)}&created_at=lt.${encodeURIComponent(ts)}&select=direction,body&order=created_at.desc&limit=8`);
    if (Array.isArray(rows)) {
      rows.reverse().forEach(r => {
        const content = String(r.body || "").slice(0, 1000);
        if (content) messages.push({ role: r.direction === "in" ? "user" : "assistant", content });
      });
    }
  } catch (e) { /* no history → stateless reply */ }
  const cleanText = String(text == null ? "" : text).slice(0, 2000);
  // Real product search (see "Real product search for the AI" above) BEFORE
  // pushing this turn, so the candidates can look at prior turns cleanly.
  const searchCandidates = searchQueryCandidates(cleanText, messages);
  messages.push({ role: "user", content: cleanText });
  // Ground the answer in the knowledge base (RAG) when relevant chunks exist.
  let system = AI_SYSTEM;
  const ctx = await retrieveKnowledge(cleanText);
  if (ctx) {
    system = AI_SYSTEM + `\n\nمعلومات من قاعدة معرفة دكانجي — اعتمد عليها أولاً للإجابة، وإن لم تجد الجواب فيها فاعتذر بلطف أو صعّد لموظف، ولا تختلق:\n${ctx}`;
  }
  if (searchCandidates.length) {
    let products = [];
    let stores = [];
    for (const q of searchCandidates) {
      products = await searchProductsForAi(q);
      if (products.length) break;
    }
    for (const q of searchCandidates) {
      stores = await searchStoresForAi(q);
      if (stores.length) break;
    }
    system += products.length
      ? `\n\nنتائج بحث حقيقية بالمنتجات من كتالوج دكانجي الحالي — اعتمد عليها حرفياً، لا تُضف عليها ولا تُغيّرها:\n${formatProductResults(products)}`
      : `\n\nبحثتَ فعلياً في كتالوج المنتجات ولم تجد أي منتج مطابق. أخبر العميل بصدق أنك لم تجد نتيجة مطابقة حالياً واقترح تصفّح الموقع أو إعادة صياغة اسم المنتج. لا تستخدم أي معلومة عن منتج من معرفتك العامة — إن لم تصلك هنا فهي غير موجودة على دكانجي.`;
    // Always report the store-search outcome too, even empty — this is the
    // fix for a real bug the loosening/stopword work above uncovered live:
    // when this branch was silent on zero results, the model filled the gap
    // from its own general knowledge instead (confirmed twice: it once
    // returned a random Google Maps link for a real store instead of the real
    // dukkanci.com.tr one, and once outright INVENTED a plausible-looking
    // dukkanci.com.tr URL for a store name that does not exist at all).
    system += stores.length
      ? `\n\nنتائج بحث حقيقية بالمتاجر — اعتمد عليها حرفياً وشارك الرابط بثقة (معلومة عامة منشورة على الموقع):\n${formatStoreResults(stores)}`
      : `\n\nبحثتَ فعلياً بالمتاجر ولم تجد متجراً مطابقاً بهذا الاسم على دكانجي. أخبر العميل بصدق أنك لم تجده حالياً على المنصة واقترح تصفّح الموقع أو التأكد من الاسم. لا تختلق رابطاً أو عنواناً أبداً، ولا تستخدم أي معلومة عن متجر من معرفتك العامة خارج دكانجي — إن لم تصلك هنا فهو غير موجود على المنصة.`;
  }
  // Facts that must never be "sometimes I know this, sometimes I don't" — see
  // "Live counters + contact numbers" above. Always included: cheap, and this
  // is exactly the class of info the audit found the AI inconsistent about.
  const facts = await getLiveFacts();
  system += `\n\nحقائق عامة حيّة عن دكانجي — اعتمد عليها دائماً بثقة عند سؤالك عنها، فهي معلومات عامة منشورة على الموقع:\n${formatLiveFacts(facts)}`;
  try {
    return await aiGateway.complete("whatsapp_autoreply", {
      system, messages, maxTokens: 500, temperature: 0.4, timeoutMs: 8000
    });
  } catch (e) {
    return null;
  }
}

// Persist inbound messages + delivery-status updates from a Meta webhook event.
async function ingestWebhook(body) {
  const entries = Array.isArray(body.entry) ? body.entry : [];
  for (const entry of entries) {
    const changes = Array.isArray(entry.changes) ? entry.changes : [];
    for (const ch of changes) {
      const v = (ch && ch.value) || {};
      const nameByWa = {};
      for (const c of (v.contacts || [])) if (c && c.wa_id) nameByWa[c.wa_id] = c.profile && c.profile.name;
      // Inbound customer messages.
      for (const m of (v.messages || [])) {
        const d = describeMessage(m);
        const ins = await sbWrite("POST", "whatsapp_messages?on_conflict=wam_id", {
          wa_id: m.from,
          contact_name: nameByWa[m.from] || null,
          direction: "in",
          body: d.body,
          msg_type: d.type,
          wam_id: m.id,
          created_at: m.timestamp ? new Date(Number(m.timestamp) * 1000).toISOString() : undefined
        }, "resolution=ignore-duplicates,return=representation");
        // Auto-reply to recognized commands / ice breakers. Skip only when the
        // insert succeeded but stored nothing (a duplicate webhook retry) so we
        // never reply twice; if storage is unavailable we still reply.
        const dup = ins && ins.ok && Array.isArray(ins.rows) && ins.rows.length === 0;
        // Voice notes got zero reply at all before (describeMessage() only ever
        // labeled them "[رسالة صوتية]" in the stored log; nothing branched on
        // that type) — 2026-09 audit found 2+ merchants sending voice notes and
        // getting silence. No transcription pipeline exists, so this is an
        // honest static fallback, parallel to the text branch below.
        if (!dup && d.type === "audio" && m.from) {
          const flags = await getThreadFlags(m.from);
          if (!flags.ai_paused) {
            try { await sendAutoReply(m.from, REPLY_VOICE); } catch (e) {}
          }
        }
        if (!dup && d.type === "text" && m.from) {
          const flags = await getThreadFlags(m.from);
          // Human escalation: explicit request, a structured «لدي مشكلة:» support
          // ticket, a cancel/delete-account ask, or a delay complaint — the AI
          // can't act on any of these (see AI_SYSTEM), so hand off immediately
          // instead of making the customer repeat themselves into escalating.
          const escalationReason = wantsHuman(d.body);
          if (escalationReason) {
            if (!flags.needs_human) {
              await setThreadFlags(m.from, { ai_paused: true, needs_human: true, last_escalated_at: new Date().toISOString() });
              await notifyAdminsEscalation(m.from, nameByWa[m.from], escalationReason);
              const ack = ESCALATION_ACK_REPLY[escalationReason] || ESCALATION_ACK_REPLY.default;
              try { await sendAutoReply(m.from, ack); } catch (e) {}
            }
            continue; // already-escalated repeats → stay silent (human will reply)
          }
          // A human is handling this thread → the AI stays quiet.
          if (flags.ai_paused) continue;
          const reply = autoReplyFor(d.body);
          // Merchant-interest lead: redirect the merchant to a human number AND
          // ping that same number with the merchant's own WhatsApp number so
          // it's an actionable lead, not just a reply the merchant reads and a
          // dead-end transcript admins never see (2026-09 audit: 11 real
          // merchant messages, zero follow-up). Covers both the exact
          // icebreaker/"/merchant" command (already resolves to REPLY_MERCHANT
          // via autoReplyFor above) and free-text interest.
          if (reply === REPLY_MERCHANT || MERCHANT_INTEREST_RE.test(d.body)) {
            try { await sendAutoReply(m.from, REPLY_MERCHANT); } catch (e) {}
            try { await notifyMerchantLead(m.from, nameByWa[m.from]); } catch (e) {}
            continue;
          }
          if (IOS_INTEREST_RE.test(d.body)) {
            try { await sendAutoReply(m.from, REPLY_IOS); } catch (e) {}
            continue;
          }
          if (reply) {
            try { await sendAutoReply(m.from, reply); } catch (e) {}     // command / ice breaker → static
          } else {
            // The static ice-breaker path above is free; only the branch below hits a
            // paid OpenAI call per message, so throttle just this one — otherwise a
            // single WhatsApp number (or a handful of burner SIMs) can rack up an
            // unbounded embedding+completion bill with a message flood.
            let ai = null;
            const throttled = await aiReplyThrottled(m.from);
            if (!throttled) {
              try { ai = await aiReply(d.body, m.from, m.timestamp); } catch (e) {}  // free text → AI
            }
            if (ai) { try { await sendAutoReply(m.from, ai); } catch (e) {} }
            else { try { await maybeGreetOrAway(m.from, m.timestamp); } catch (e) {} }  // fallback (also covers throttled case — quiet, not alarming)
          }
        }
      }
      // Delivery/read statuses for messages we sent.
      for (const s of (v.statuses || [])) {
        if (!s || !s.id) continue;
        // Meta puts the reason for a "failed" status in s.errors — keep it.
        const err = Array.isArray(s.errors) && s.errors.length ? JSON.stringify(s.errors).slice(0, 500) : null;
        await sbWrite("PATCH", `whatsapp_messages?wam_id=eq.${encodeURIComponent(s.id)}`,
          err ? { status: s.status, error: err } : { status: s.status }, "return=minimal");
        // OTP and order-alert sends live in marketing_event_logs (logOtpSend /
        // logOrderAlertSend), not whatsapp_messages — this is where a "failed" lands.
        await sbWrite("PATCH", `marketing_event_logs?destination=in.(whatsapp_otp,whatsapp_order_alert)&payload_json->>wam_id=eq.${encodeURIComponent(s.id)}`,
          { status: s.status, error_message: err, response_json: { status: s.status, timestamp: s.timestamp || null, errors: s.errors || null, pricing: s.pricing || null } },
          "return=minimal");
      }
    }
  }
}

// Accept both the web-app payload (flat order) and a Supabase webhook ({ record }).
function normalizeOrder(body) {
  const rec = body && body.record ? body.record : null;
  if (rec) {
    const dd = (rec.delivery_details && typeof rec.delivery_details === "object") ? rec.delivery_details : {};
    return {
      id: rec.id, storeId: rec.store_id, customer: rec.customer || "",
      customerPhone: dd.phone || "", total: Number(rec.total) || 0,
      fulfillment: dd.fulfillment || "delivery", address: dd.address || "",
      payment: dd.payment || "", lineItems: Array.isArray(dd.lineItems) ? dd.lineItems : [],
      scheduleDay: dd.scheduleDay || "", scheduleTime: dd.scheduleTime || "",
      // Street/building/apartment detail + map pin + customer notes: carried so
      // the merchant alert can show a full, deliverable address. All optional —
      // older clients that omit them simply produce a shorter message.
      deliveryFee: dd.deliveryFee ?? (dd.quote && dd.quote.fee != null ? Number(dd.quote.fee) : null),
      subtotal: dd.subtotal ?? null, discount: Number(dd.discount) || 0, creditUsed: Number(dd.creditUsed) || 0,
      addressDetails: dd.addressDetails || "", fullAddressTr: dd.fullAddressTr || "",
      structuredAddress: dd.structuredAddress || null,
      addressLat: dd.addressLat ?? null, addressLng: dd.addressLng ?? null,
      notes: dd.notes || "", substitution: dd.substitution || ""
    };
  }
  const o = body || {};
  return {
    id: o.id, storeId: o.storeId, customer: o.customer || "",
    customerPhone: o.customerPhone || "", total: Number(o.total) || 0,
    fulfillment: o.fulfillment || "delivery", address: o.address || "",
    payment: o.payment || "", lineItems: Array.isArray(o.lineItems) ? o.lineItems : [],
    scheduleDay: o.scheduleDay || "", scheduleTime: o.scheduleTime || "",
    deliveryFee: (o.deliveryQuote && o.deliveryQuote.fee != null) ? Number(o.deliveryQuote.fee) : null,
    subtotal: null, discount: 0, creditUsed: 0,
    addressDetails: o.addressDetails || "", fullAddressTr: o.fullAddressTr || "",
    structuredAddress: o.structuredAddress || null,
    addressLat: o.addressLat ?? null, addressLng: o.addressLng ?? null,
    notes: o.notes || "", substitution: o.substitution || ""
  };
}

async function sendWhatsapp(c, to, { template, params, text }) {
  let payload;
  if (template) {
    const components = (params && params.length)
      ? [{ type: "body", parameters: params.map(t => ({ type: "text", text: String(t == null ? "" : t).slice(0, 1024) })) }]
      : [];
    payload = {
      messaging_product: "whatsapp", to, type: "template",
      template: { name: template, language: { code: c.lang }, ...(components.length ? { components } : {}) }
    };
  } else {
    payload = { messaging_product: "whatsapp", to, type: "text", text: { body: text, preview_url: false } };
  }
  try {
    const r = await fetch(`${GRAPH}/${c.version}/${c.phoneId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, id: data?.messages?.[0]?.id, error: r.ok ? undefined : data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

const money = n => `${Number(n || 0).toLocaleString("ar")} ل.ت`;
// Single line — WhatsApp template parameters reject newlines, tabs, and 4+ spaces.
// Includes each item's price so the store can see the full breakdown without
// opening the dashboard (name × qty (unit price)).
// Caps around 900 chars (well under the 1024 WhatsApp param limit that
// sendWhatsapp enforces with a blunt slice) and summarizes the remainder
// instead of letting that slice cut an item off mid-name/mid-price.
const itemsLine = items => {
  const parts = (items || []).map(i => `${i.name} ×${i.qty || 1}${i.price != null ? ` (${money(i.price)})` : ""}`);
  let out = "", shown = 0;
  for (const part of parts) {
    const next = out ? `${out} • ${part}` : part;
    if (next.length > 900 && shown > 0) break;
    out = next; shown++;
  }
  if (shown < parts.length) out += ` • و${parts.length - shown} منتج آخر`;
  return out;
};

// ───────────────── Store order alert: one builder, every channel ────────────
// The merchant alert used to be assembled inline in three different places and
// carried only id/customer/phone/total/fulfillment/items — no street address, no
// map link, no way into the dashboard. Everything below builds that message ONCE
// so the WhatsApp copy, the dashboard bell and any future channel can never
// drift apart again (the "fix one, forget the other" trap in CLAUDE.md §7).

const MERCHANT_PANEL_URL = `${SITE_URL}/merchant`;

// One WhatsApp-template-safe value. Meta rejects any parameter containing a
// newline, a tab, or 4+ consecutive spaces, so multi-line content is folded onto
// one line with " · " separators; the template BODY supplies the line breaks.
// Also caps length so sendWhatsapp's blunt 1024-char slice never cuts mid-word.
function flatParam(value, max = 700) {
  const s = String(value == null ? "" : value)
    .replace(/[\r\n\t]+/g, " · ").replace(/ {2,}/g, " ")
    .replace(/(\s*·\s*)+/g, " · ").replace(/^\s*·\s*|\s*·\s*$/g, "").trim();
  if (!s) return "—";
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

// A number we actually recorded, or NaN. Guards the null/0 conflation above:
// a missing fee must never render as "free" and a missing subtotal must never
// render as 0 ل.ت.
function knownNumber(v) { return (v === null || v === undefined || v === "") ? NaN : Number(v); }

// Google Maps link to the customer's door. Prefers the exact pin dropped when
// the address was saved (the address form refuses to save without one), and
// falls back to a text search on the written address so older orders — and the
// published mobile app, which doesn't send coordinates — still get a tappable
// map instead of nothing.
function customerMapsLink(order) {
  const lat = Number(order && order.addressLat);
  const lng = Number(order && order.addressLng);
  if (Number.isFinite(lat) && Number.isFinite(lng) && (lat !== 0 || lng !== 0)) {
    return `https://www.google.com/maps?q=${lat.toFixed(6)},${lng.toFixed(6)}`;
  }
  const text = [order && order.fullAddressTr, order && order.address, order && order.addressDetails]
    .filter(Boolean).join(", ").replace(/\s+/g, " ").trim();
  return text ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(text.slice(0, 200))}` : "";
}

// The delivery address, one fact per line, exactly as the customer entered it.
// `fullAddressTr` is the composed Turkish address (neighbourhood + street /
// building + block / door + floor / district + postcode) — it is what a courier
// actually reads, so it wins over the shorter `address` summary when present.
function addressLines(order) {
  if (!order || order.fulfillment === "pickup") return [];
  const out = [];
  const full = String(order.fullAddressTr || "").trim();
  if (full) {
    full.split("\n").map(l => l.replace(/,\s*$/, "").trim()).filter(Boolean).forEach(l => out.push(l));
  } else if (order.address) {
    out.push(String(order.address).trim());
  }
  // `addressDetails` is normally just lines 2..n of `fullAddressTr` re-joined by
  // the client, so printing both repeats the building and door twice. Compare on
  // letters/digits only (separators differ: ", " vs " — ") and keep it only when
  // it genuinely adds something the composed lines don't already say.
  const extra = String(order.addressDetails || "").trim();
  const bare = t => String(t).replace(/[^\p{L}\p{N}]+/gu, "").toLowerCase();
  if (extra && !bare(out.join(" ")).includes(bare(extra))) out.push(extra);
  // Free-text directions ("بجانب الصيدلية") — never part of the composed Turkish
  // address, and often the one line that actually gets the courier to the door.
  const note = order.structuredAddress && String(order.structuredAddress.addressNote || "").trim();
  if (note) out.push(`📝 ${note}`);
  return out;
}

// One line per product, with its options/notes indented underneath — the store
// has to read this while packing, so it never gets collapsed onto one line the
// way the template parameter does.
function itemsBlock(items) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return "-";
  return list.map((i, n) => {
    const qty = i.qty || 1;
    const price = i.price != null ? ` — ${money(Number(i.price) * qty)}` : "";
    const head = `${n + 1}. ${i.name || "منتج"} ×${qty}${price}`;
    const sub = [];
    if (i.options) sub.push(`   ↳ ${String(i.options).replace(/\s*\n\s*/g, " · ")}`);
    if (i.notes) sub.push(`   ↳ ملاحظة: ${i.notes}`);
    return [head, ...sub].join("\n");
  }).join("\n");
}

// Money breakdown lines: subtotal, delivery fee, coupon discount and wallet
// credit, then the total the customer actually pays. Anything we don't actually
// know is left out rather than printed as zero — a merchant reading "رسوم
// التوصيل: ٠ ل.ت" on an old order would reasonably think delivery was free.
function moneyLines(order) {
  const out = [];
  // `Number(null)` is 0, so null MUST be excluded before the isFinite check —
  // otherwise an order with no recorded fee prints "مجاني" and tells the
  // merchant delivery was free when we simply don't know.
  const fee = knownNumber(order.deliveryFee);
  const sub = knownNumber(order.subtotal);
  const discount = Number(order.discount) || 0;
  const credit = Number(order.creditUsed) || 0;
  const hasFee = order.fulfillment !== "pickup" && Number.isFinite(fee);
  // Only worth splitting out when there is something to split: with no fee,
  // discount or credit the subtotal and the total are the same number twice.
  const splits = (hasFee && fee > 0) || discount > 0 || credit > 0;
  if (Number.isFinite(sub) && sub > 0 && splits) out.push(`🧮 مجموع المنتجات: ${money(sub)}`);
  if (hasFee) out.push(`🚚 رسوم التوصيل: ${fee > 0 ? money(fee) : "مجاني"}`);
  if (discount > 0) out.push(`🏷️ خصم الكوبون: -${money(discount)}`);
  if (credit > 0) out.push(`👛 رصيد مستخدم: -${money(credit)}`);
  out.push(`💰 الإجمالي المطلوب من الزبون: ${money(order.total)}`);
  return out;
}

// Login details for the store's own dashboard. Passwords are hashed at rest
// (H3), so the plaintext only exists for rows written before that change — for
// an already-hashed row we say where to get a new one instead of inventing or
// resetting anything (a silent reset would lock out a merchant who knows theirs).
// Returned to the STORE only; the admin copy of the alert never carries it.
async function loadStoreCreds(storeId) {
  try {
    const rows = await sbGet(`store_credentials?store_id=eq.${encodeURIComponent(storeId)}&select=username,password&limit=1`);
    const row = Array.isArray(rows) && rows[0];
    if (!row || !row.username) return null;
    return { username: row.username, password: isHashedPassword(row.password) ? "" : (row.password || "") };
  } catch (e) { return null; }
}

// Full merchant-facing order message. Free-form WhatsApp text (and the dashboard
// bell) can render it as-is; `buildStoreOrderParams` below flattens the same facts
// for the approved-template path, which cannot carry newlines.
function buildStoreOrderText(order, opts) {
  const o = opts || {};
  const isPickup = order.fulfillment === "pickup";
  const schedule = [order.scheduleDay, order.scheduleTime].filter(Boolean).join(" · ");
  const L = [];

  L.push("🛒 *طلب جديد على دكانجي*");
  if (o.storeName) L.push(`🏪 المتجر: ${o.storeName}`);
  L.push("");
  L.push(`📦 رقم الطلب: ${order.id}`);
  L.push("");
  L.push("*بيانات الزبون*");
  L.push(`👤 الاسم: ${order.customer || "—"}`);
  L.push(`📞 الهاتف: ${order.customerPhone || "—"}`);
  L.push("");
  L.push(isPickup ? "*الاستلام*" : "*التوصيل*");
  L.push(isPickup
    ? `🏬 استلام من المتجر${schedule ? ` — ${schedule}` : " — في أقرب وقت"}`
    : `🚚 توصيل${schedule ? ` — ${schedule}` : " — في أقرب وقت"}`);
  if (!isPickup) {
    const lines = addressLines(order);
    if (lines.length) {
      L.push("📍 العنوان:");
      lines.forEach(l => L.push(`   ${l}`));
    } else {
      L.push("📍 العنوان: لم يُحدَّد — يرجى التواصل مع الزبون");
    }
    const map = customerMapsLink(order);
    if (map) { L.push("🗺️ الموقع على الخريطة:"); L.push(map); }
  }
  L.push("");
  L.push("*تفاصيل الطلب*");
  L.push(itemsBlock(order.lineItems));
  L.push("");
  // Money breakdown. Every line except the total is conditional: an order placed
  // before the fee was recorded, or a pickup order, simply shows fewer lines
  // rather than a made-up "0 ل.ت" the merchant would have to second-guess.
  moneyLines(order).forEach(l => L.push(l));
  if (order.payment) L.push(`💳 الدفع: ${order.payment}`);
  if (order.notes) L.push(`📝 ملاحظات الزبون: ${order.notes}`);
  if (order.substitution) L.push(`🔄 عند نفاد صنف: ${order.substitution}`);

  if (o.creds) {
    L.push("");
    L.push("*لوحة متجرك*");
    L.push(`🔗 ${MERCHANT_PANEL_URL}`);
    L.push(`👤 اسم المستخدم: ${o.creds.username}`);
    L.push(o.creds.password
      ? `🔑 كلمة المرور: ${o.creds.password}`
      : "🔑 كلمة المرور: هي التي استلمتها عند تفعيل متجرك — لإصدار كلمة مرور جديدة تواصل مع إدارة دكانجي.");
    L.push("من اللوحة يمكنك متابعة الطلب وتغيير حالته وتعديل أسعار منتجاتك.");
  }
  return L.join("\n");
}

// Same facts, flattened for a WhatsApp template. The 13 values below map 1:1 to
// {{1}}..{{13}} of the template named in WHATSAPP_TEMPLATE_STORE_FULL — create it
// in WhatsApp Manager (category Utility, language Arabic) with EXACTLY this body,
// then set the env var to its name:
//
//   🛒 طلب جديد على دكانجي
//
//   📦 رقم الطلب: {{1}}
//   👤 الزبون: {{2}}
//   📞 هاتف الزبون: {{3}}
//
//   🚚 الاستلام: {{4}}
//   📍 العنوان: {{5}}
//   🗺️ الخريطة: {{6}}
//
//   🧾 المنتجات: {{7}}
//   🧮 مجموع المنتجات: {{8}}
//   🚚 رسوم التوصيل: {{9}}
//   💰 الإجمالي المطلوب من الزبون: {{10}}
//   💳 الدفع: {{11}}
//   📝 ملاحظات: {{12}}
//
//   🔐 لوحة متجرك: https://www.dukkanci.com.tr/merchant
//   {{13}}
//
//   نرجو تجهيز الطلب والتواصل مع الزبون في أقرب وقت. شكراً لك.
//
// Keep the order of the variables — they are positional, and a mismatch would
// silently put the phone number under "الإجمالي".
function buildStoreOrderParams(order, opts) {
  const o = opts || {};
  const isPickup = order.fulfillment === "pickup";
  const schedule = [order.scheduleDay, order.scheduleTime].filter(Boolean).join(" · ");
  const fulfillment = (isPickup ? "استلام من المتجر" : "توصيل") + (schedule ? ` - ${schedule}` : " - في أقرب وقت");
  const extras = [order.notes ? `ملاحظات الزبون: ${order.notes}` : "",
                  order.substitution ? `عند نفاد صنف: ${order.substitution}` : "",
                  Number(order.discount) > 0 ? `خصم كوبون: -${money(order.discount)}` : "",
                  Number(order.creditUsed) > 0 ? `رصيد مستخدم: -${money(order.creditUsed)}` : ""].filter(Boolean).join(" · ");
  const creds = o.creds
    ? `اسم المستخدم: ${o.creds.username} · كلمة المرور: ${o.creds.password || "التي استلمتها عند تفعيل متجرك (للاستعادة تواصل مع إدارة دكانجي)"}`
    : (o.credsReplacement || "—");
  return [
    flatParam(order.id, 60),
    flatParam(o.customerLabel || order.customer, 120),
    flatParam(order.customerPhone, 40),
    flatParam(fulfillment, 120),
    flatParam(isPickup ? "استلام من المتجر" : (addressLines(order).join(" · ") || "لم يُحدَّد — تواصل مع الزبون"), 500),
    flatParam(isPickup ? "—" : (customerMapsLink(order) || "—"), 300),
    flatParam(itemsLine(order.lineItems), 700),
    // Subtotal / delivery fee: "—" when this order simply has no record of them
    // (pickup, or placed before the fee was persisted) rather than a false zero.
    flatParam(knownNumber(order.subtotal) > 0 ? money(order.subtotal) : "—", 40),
    flatParam(isPickup || !Number.isFinite(knownNumber(order.deliveryFee)) ? "—"
      : (knownNumber(order.deliveryFee) > 0 ? money(order.deliveryFee) : "مجاني"), 40),
    flatParam(money(order.total), 40),
    flatParam(order.payment || "—", 80),
    flatParam(extras || "لا توجد", 300),
    flatParam(creds, 200)
  ];
}

// Default customer-facing line for each order status, used when the merchant
// leaves the note blank. Mirrors the statuses in app.js's order manager.
function statusMessage(status) {
  const m = {
    "تم القبول": "تم قبول طلبك وسيبدأ تجهيزه قريباً.",
    "قيد التجهيز": "يجري تجهيز طلبك الآن.",
    "جاهز للاستلام": "طلبك جاهز للاستلام من المتجر.",
    "خرج للتوصيل": "طلبك في الطريق إليك الآن.",
    "مكتمل": "تم إكمال طلبك. شكراً لاستخدامك دكانجي!",
    "تم التوصيل": "تم توصيل طلبك. شكراً لاستخدامك دكانجي!",
    "تم الاستلام": "تم تسليم طلبك. شكراً لاستخدامك دكانجي!",
    "مرفوضة": "نعتذر، تعذّر على المتجر قبول طلبك حالياً. للاستفسار تواصل معنا.",
    "ملغى": "تم إلغاء طلبك. لأي استفسار تواصل معنا."
  };
  return m[status] || ("حالة طلبك الآن: " + status + ".");
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const c = cfg();

  // This endpoint doubles as the Meta WhatsApp webhook AND the admin inbox API
  // (Hobby plan caps us at 12 serverless functions, so they share one file).
  // GET = Meta verification handshake, OR an admin read action (?action=...).
  // Parse the query from req.url with Node's querystring (keeps dotted
  // "hub.mode" keys flat — req.query may nest them).
  if (req.method === "GET") {
    let q = {};
    try { q = require("url").parse(req.url || "", true).query || {}; } catch (e) { q = req.query || {}; }

    // Subscription expiry sweep — Vercel Cron invokes this over GET (see vercel.json).
    if (q.action === "subscription-cron") {
      if (!cronOk(req, q, c)) return res.status(403).json({ error: "unauthorized" });
      return res.status(200).json(await runSubscriptionCron(c));
    }

    // PUBLIC: Meta Commerce product feed for one store (spec §13). Meta fetches
    // this URL on a schedule with no auth, so it must be public — it exposes only
    // data already public on the storefront (name/price/image/link). Approved
    // stores only. CSV per Meta's feed spec; excluded rows are the merchant's
    // "needs review" list (data-URL/placeholder images, on-request/zero prices).
    if (q.action === "meta-feed") {
      const storeId = Number(q.storeId);
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const sRows = await sbGet(`stores?id=eq.${storeId}&select=name,approval_status&limit=1`);
      const store = sRows && sRows[0];
      if (!store || (store.approval_status && store.approval_status !== "approved")) {
        return res.status(404).json({ error: "store not available" });
      }
      const prods = await sbGet(`products?store_id=eq.${storeId}&select=id,name,description,price,price_on_request,available,image,category,slug&order=id&limit=2000`) || [];
      const csvCell = v => `"${String(v == null ? "" : v).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`;
      const rows = [["id", "title", "description", "availability", "condition", "price", "link", "image_link", "brand", "product_type"]];
      for (const p of prods) {
        const img = String(p.image || "");
        const isRealImg = img && !img.startsWith("data:") && !/store-market\.jpg|placeholder/i.test(img);
        const priceNum = Number(p.price) || 0;
        if (!p.name || !isRealImg || p.price_on_request || priceNum <= 0) continue; // needs review → not in feed
        const imageLink = /^https?:\/\//i.test(img) ? img : SITE_URL + (img.startsWith("/") ? img : "/" + img);
        rows.push([
          `dk-${p.id}`, p.name, (p.description || p.name).slice(0, 500),
          p.available === false ? "out of stock" : "in stock", "new",
          `${priceNum.toFixed(2)} TRY`,
          `${SITE_URL}/product/${p.slug || p.id}`,
          imageLink, store.name, p.category || ""
        ]);
      }
      const csv = "﻿" + rows.map(r => r.map(csvCell).join(",")).join("\n");
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", `attachment; filename="dukkanci-store-${storeId}-meta-feed.csv"`);
      res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600");
      return res.status(200).send(csv);
    }

    // Admin inbox reads.
    if (q.action === "threads" || q.action === "thread") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });

      if (q.action === "threads") {
        const rows = await sbGet("whatsapp_messages?select=wa_id,contact_name,direction,body,msg_type,read_at,created_at&order=created_at.desc&limit=2000") || [];
        const byWa = new Map();
        for (const m of rows) {
          let t = byWa.get(m.wa_id);
          if (!t) { t = { wa_id: m.wa_id, name: null, last_body: m.body, last_dir: m.direction, last_at: m.created_at, unread: 0, last_in_at: null }; byWa.set(m.wa_id, t); }
          if (!t.name && m.contact_name) t.name = m.contact_name;
          if (m.direction === "in") {
            if (!t.last_in_at) t.last_in_at = m.created_at; // rows are desc → first is latest inbound
            if (!m.read_at) t.unread += 1;
          }
        }
        const threads = [...byWa.values()].sort((a, b) => (a.last_at < b.last_at ? 1 : -1));
        // Merge per-conversation state (escalation flags + pin + label) onto each
        // thread. whatsapp_threads only holds rows that have had a flag/pin/label set,
        // so it stays small — fetch them all, then sort pinned conversations to the top.
        const flagRows = await sbGet("whatsapp_threads?select=wa_id,ai_paused,needs_human,pinned,label");
        if (Array.isArray(flagRows) && flagRows.length) {
          const byId = new Map(flagRows.map(f => [String(f.wa_id), f]));
          for (const t of threads) {
            const f = byId.get(String(t.wa_id));
            if (f) { t.needs_human = !!f.needs_human; t.ai_paused = !!f.ai_paused; t.pinned = !!f.pinned; t.label = f.label || null; }
          }
        }
        threads.sort((a, b) => {
          if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;   // pinned first
          return a.last_at < b.last_at ? 1 : -1;                     // then most-recent
        });
        return res.status(200).json({ threads });
      }

      // Single conversation: load the most-recent messages (newest 1000), returned
      // ascending for display. Fetching DESC-then-reverse (instead of ASC+limit)
      // guarantees a very long thread never drops its LATEST messages — an asc+limit
      // would have shown the oldest 500 and hidden anything sent after them.
      const wa = String(q.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      const recent = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&select=id,direction,body,msg_type,status,created_at&order=created_at.desc&limit=1000`) || [];
      const msgs = recent.reverse();
      const lastIn = [...msgs].reverse().find(m => m.direction === "in");
      const canFreeform = !!lastIn && (Date.now() - new Date(lastIn.created_at).getTime() < 24 * 60 * 60 * 1000);
      await sbWrite("PATCH", `whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&direction=eq.in&read_at=is.null`,
        { read_at: new Date().toISOString() }, "return=minimal");
      const flags = await getThreadFlags(wa);
      return res.status(200).json({ wa_id: wa, messages: msgs, canFreeform, ai_paused: !!flags.ai_paused, needs_human: !!flags.needs_human, pinned: !!flags.pinned, label: flags.label || null });
    }

    // Admin: inbox diagnostics — tells the panel whether the inbox is fully configured.
    // Returns a JSON object the conversations tab uses to show a helpful empty-state.
    if (q.action === "inbox-status") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const hasServiceRole = !!env("SUPABASE_SERVICE_ROLE_KEY");
      const hasMetaSecret  = !!(env("META_APP_SECRET") || env("WHATSAPP_APP_SECRET"));
      const hasWaToken     = !!env("WHATSAPP_TOKEN");
      // Count messages only when we have service-role (otherwise the count would be 0 anyway).
      let msgCount = null;
      if (hasServiceRole) {
        const rows = await sbGet("whatsapp_messages?select=id&limit=1");
        msgCount = Array.isArray(rows) ? (rows.length > 0 ? "1+" : "0") : null;
      }
      return res.status(200).json({ hasServiceRole, hasMetaSecret, hasWaToken, msgCount });
    }

    // Admin: all orders (service-role read, bypasses anon RLS).
    // Paged, NOT `limit=1000`: the admin panel replaces state.orders wholesale
    // with whatever this returns and builds every report/total from it, so a
    // truncated read here silently under-counts the platform's revenue rather
    // than failing loudly. `id.desc` breaks created_at ties so paging can't skip
    // or duplicate a row across a page boundary.
    // `total` is counted independently from the rows so truncation can never be
    // silent again — the caller can always compare the two.
    if (q.action === "orders") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const rows = await sbGetAll("orders?select=*&order=created_at.desc,id.desc");
      const total = await sbCount("orders");
      return res.status(200).json({
        orders: rows,
        total: total == null ? rows.length : total,
        truncated: total != null && rows.length < total
      });
    }

    // Merchant: their store's orders only (verified by phone+password credentials).
    // Paged for the same reason as the admin read above — a busy store passing
    // the old limit=500 would have quietly lost its oldest orders.
    if (q.action === "store-orders") {
      const storeId = Number(q.storeId);
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      if (!merchantOk(req, storeId)) return res.status(403).json({ error: "unauthorized" });
      const rows = await sbGetAll(`orders?store_id=eq.${storeId}&select=*&order=created_at.desc,id.desc`);
      const total = await sbCount(`orders?store_id=eq.${storeId}`);
      return res.status(200).json({
        orders: rows,
        total: total == null ? rows.length : total,
        truncated: total != null && rows.length < total
      });
    }

    // Guest/customer: "طلباتي" cross-device order history, keyed by phone (no
    // Supabase Auth session for guest checkout, so RLS can't scope this by
    // auth.uid()). Requires an explicit phone or id list — never an unscoped
    // table read — same exposure guest checkout has always had (whoever has
    // the phone number can see those orders), but no longer lets anyone dump
    // every order in the table the way the old open RLS policy did.
    if (q.action === "customer-orders") {
      // NOT the phoneKey() helper (which slices to the last 10 digits) — the
      // client stores/searches the full digit string here (see delivery_details
      // .phoneKey in pushOrderCloud), so matching must use the same normalization.
      const phone = String(q.phone || "").replace(/\D/g, "");
      const ids = String(q.ids || "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 50);
      if (!phone && !ids.length) return res.status(400).json({ error: "phone or ids required" });
      // M4: throttle phone-keyed lookups by IP — guest order history is keyed by
      // phone (no session), so an unlimited endpoint lets an attacker enumerate
      // phone numbers to harvest customers' orders/addresses. The id-only path is
      // not throttled (order ids are unguessable). Fails open if login_attempts
      // is absent (see M1). 429 on the phone path can never block an id lookup.
      if (phone) {
        const ipKey = "orders:" + clientIp(req);
        if (await loginThrottleBlocked(ipKey)) return res.status(429).json({ error: "too-many-requests" });
        recordLoginFailure(ipKey, ORDERS_LOOKUP_MAX).catch(() => {});
      }
      const rows = [];
      if (phone) {
        const r = await sbGet(`orders?delivery_details->>phoneKey=eq.${encodeURIComponent(phone)}&select=*&order=created_at.desc&limit=200`);
        if (Array.isArray(r)) rows.push(...r);
      }
      const missing = ids.filter(id => !rows.some(r => r.id === id));
      if (missing.length) {
        const r = await sbGet(`orders?id=in.(${missing.map(encodeURIComponent).join(",")})&select=*`);
        if (Array.isArray(r)) rows.push(...r);
      }
      return res.status(200).json({ orders: rows });
    }

    // Admin: every customer complaint (G4 — was previously localStorage-only on
    // the submitting customer's own browser, invisible to admin and to anyone
    // else; see complaint-create below).
    if (q.action === "complaints-list") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const complaints = await sbGet("complaints?select=*&order=created_at.desc&limit=500") || [];
      return res.status(200).json({ complaints });
    }

    // Merchant/Admin: a product's recent price-change history (spec §7).
    if (q.action === "product-price-history") {
      const productId = Number(q.productId);
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!productId) return res.status(400).json({ error: "productId required" });
      const rows = await sbGet(`product_price_history?product_id=eq.${productId}&select=old_price,new_price,source,created_at&order=created_at.desc&limit=20`) || [];
      return res.status(200).json({ history: rows });
    }

    // Merchant/Admin: which products in this store have a revertible AI-image backup (spec §8).
    if (q.action === "product-images") {
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const rows = await sbGet(`product_images?store_id=eq.${storeId}&status=eq.enhanced&select=product_id&order=created_at.desc&limit=2000`) || [];
      const ids = [...new Set(rows.map(r => Number(r.product_id)))];
      return res.status(200).json({ enhancedProductIds: ids });
    }

    // Merchant/Admin: this store's audit trail (spec §17 «سجل التعديلات»).
    if (q.action === "audit-logs") {
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const rows = await sbGet(`audit_logs?store_id=eq.${storeId}&select=actor,action,entity_type,entity_id,old_value,new_value,created_at&order=created_at.desc&limit=100`) || [];
      return res.status(200).json({ logs: rows });
    }

    // Merchant/Admin: this store's discount coupons + per-coupon performance (spec §11).
    if (q.action === "merchant-coupons") {
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const coupons = await sbGet(`coupons?store_id=eq.${storeId}&select=id,code,discount_type,value,min_subtotal,max_discount,starts_at,ends_at,usage_limit,per_customer_limit,active,created_at&order=created_at.desc&limit=100`) || [];
      // Redemption stats (count + total discount) per coupon — one query for all.
      const stats = {};
      if (coupons.length) {
        const ids = coupons.map(c => c.id).join(",");
        const reds = await sbGet(`coupon_redemptions?coupon_id=in.(${ids})&select=coupon_id,amount&limit=5000`) || [];
        for (const r of reds) {
          const k = Number(r.coupon_id);
          if (!stats[k]) stats[k] = { uses: 0, discount: 0 };
          stats[k].uses += 1;
          stats[k].discount += Number(r.amount) || 0;
        }
      }
      return res.status(200).json({ coupons, stats });
    }

    // Admin: every coupon across every store, including global/platform-wide
    // coupons (store_id null — e.g. a launch code created directly in the DB).
    // The merchant-coupons action above requires a single storeId and can't
    // see these; this is the cross-store view for the admin panel.
    if (q.action === "admin-coupons") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const coupons = await sbGet(`coupons?select=id,code,discount_type,value,store_id,min_subtotal,max_discount,starts_at,ends_at,usage_limit,per_customer_limit,active,created_at&order=created_at.desc&limit=500`) || [];
      const stats = {};
      if (coupons.length) {
        const ids = coupons.map(c => c.id).join(",");
        const reds = await sbGet(`coupon_redemptions?coupon_id=in.(${ids})&select=coupon_id,amount&limit=5000`) || [];
        for (const r of reds) {
          const k = Number(r.coupon_id);
          if (!stats[k]) stats[k] = { uses: 0, discount: 0 };
          stats[k].uses += 1;
          stats[k].discount += Number(r.amount) || 0;
        }
      }
      const storeIds = [...new Set(coupons.map(c => c.store_id).filter(Boolean))];
      let storeNames = {};
      if (storeIds.length) {
        const rows = await sbGet(`stores?id=in.(${storeIds.join(",")})&select=id,name`) || [];
        storeNames = Object.fromEntries(rows.map(s => [s.id, s.name]));
      }
      return res.status(200).json({ coupons, stats, storeNames });
    }

    // Merchant/Admin: this store's search-term report (spec §16 «تقرير البحث»):
    // top queries + zero-result queries, aggregated from the last 1000 searches.
    if (q.action === "store-search-terms") {
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const rows = await sbGet(`search_logs?store_id=eq.${storeId}&select=query,normalized_query,results_count,created_at&order=created_at.desc&limit=1000`) || [];
      const agg = new Map();
      for (const r of rows) {
        const k = r.normalized_query || String(r.query || "").toLowerCase();
        if (!k) continue;
        let a = agg.get(k);
        if (!a) { a = { query: r.query, count: 0, zero: 0 }; agg.set(k, a); }
        a.count += 1;
        if (Number(r.results_count) === 0) a.zero += 1;
      }
      const all = [...agg.values()].sort((a, b) => b.count - a.count);
      const top = all.slice(0, 20);
      // "Zero-result" terms = searches that mostly found nothing → synonym/product gaps.
      const zero = all.filter(t => t.zero > 0 && t.zero >= t.count / 2).slice(0, 20);
      return res.status(200).json({ total: rows.length, top, zero });
    }

    // Merchant/Admin: this store's notification feed + unread count (spec §19).
    if (q.action === "merchant-notifications") {
      const storeId = Number(q.storeId);
      const isAdmin = adminOk({ headers: req.headers, query: q });
      if (!isAdmin && !(storeId && merchantOk(req, storeId))) return res.status(403).json({ error: "unauthorized" });
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      const rows = await sbGet(`merchant_notifications?store_id=eq.${storeId}&select=id,type,title,message,entity_type,entity_id,read_at,created_at&order=created_at.desc&limit=50`) || [];
      const unread = rows.filter(r => !r.read_at).length;
      return res.status(200).json({ notifications: rows, unread });
    }

    // Admin: list every store with its login credentials (phone=username +
    // generated password). Lazily generates+persists a password for any store
    // that has a phone but no credential row yet. Passwords live in
    // store_credentials (RLS denies anon) and are returned ONLY through this
    // admin-gated endpoint — never to the public anon client.
    if (q.action === "admin-customers") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      // Every registered account, even ones that never ordered — profiles has
      // self-only RLS so the admin browser session can't read it directly; this
      // service-role endpoint is the only place that directory can be assembled.
      const { url, key } = sb();
      let authUsers = [];
      try {
        const r = await fetch(`${url}/auth/v1/admin/users?per_page=1000`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
        if (r.ok) { const j = await r.json().catch(() => null); authUsers = (j && j.users) || []; }
      } catch (e) { /* GoTrue admin API unreachable — return profiles-only below */ }
      const profileRows = await sbGet("profiles?select=id,full_name,phone,created_at") || [];
      const profileById = new Map(profileRows.map(p => [p.id, p]));
      const orderRows = await sbGet("orders?select=customer_id,total&customer_id=not.is.null") || [];
      const orderStats = new Map();
      orderRows.forEach(o => {
        if (!o.customer_id) return;
        const s = orderStats.get(o.customer_id) || { count: 0, total: 0 };
        s.count += 1; s.total += Number(o.total) || 0;
        orderStats.set(o.customer_id, s);
      });
      const list = authUsers.map(u => {
        const p = profileById.get(u.id);
        const stats = orderStats.get(u.id) || { count: 0, total: 0 };
        return {
          id: u.id,
          name: (p && p.full_name) || (u.user_metadata && u.user_metadata.full_name) || "",
          email: u.email || "",
          phone: (p && p.phone) || u.phone || "",
          provider: (u.app_metadata && u.app_metadata.provider) || "email",
          createdAt: u.created_at || "",
          lastActiveAt: u.last_sign_in_at || u.created_at || "",
          orderCount: stats.count,
          totalSpent: stats.total
        };
      });
      return res.status(200).json({ customers: list, serviceRole: !!env("SUPABASE_SERVICE_ROLE_KEY") });
    }

    if (q.action === "store-creds") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const storeRows = await sbGet("stores?select=id,name,phone,email,subscription_active&order=id") || [];
      // H3: passwords are hashed at rest, so we no longer fetch/return them here.
      const credRows = await sbGet("store_credentials?select=store_id,username") || [];
      const byId = new Map(credRows.map(c => [Number(c.store_id), c]));
      const freshPlain = new Map(); // store_id -> plaintext for rows CREATED this call (show-once)
      const toCreate = [];
      for (const s of storeRows) {
        if (byId.has(Number(s.id))) continue;
        // Every store gets a credential so admin keys are effective store-wide.
        // username = phone (primary login) when present, else email, else a
        // store-id placeholder. Phone-less stores still log in via the email path.
        const key = phoneKey(s.phone) || String(s.email || "").toLowerCase().trim() || `store-${s.id}`;
        const plain = genPassword();
        freshPlain.set(Number(s.id), plain);
        byId.set(Number(s.id), { store_id: s.id, username: key });
        toCreate.push({ store_id: s.id, username: key, password: hashPassword(plain) });
      }
      let writeOk = true;
      if (toCreate.length) {
        const w = await sbWrite("POST", "store_credentials?on_conflict=store_id", toCreate, "resolution=merge-duplicates,return=minimal");
        writeOk = !!w.ok;
      }
      const list = storeRows.map(s => {
        const cr = byId.get(Number(s.id));
        const fresh = freshPlain.get(Number(s.id));
        return {
          store_id: s.id, name: s.name, phone: s.phone || "",
          username: cr ? cr.username : "",
          // Hashed at rest → only a just-issued password is visible; existing ones
          // are masked ("" + has_credential), admin issues a new one via reset.
          password: fresh || "", has_credential: !!cr,
          subscription_active: s.subscription_active !== false,
          no_phone: !phoneKey(s.phone)
        };
      });
      // serviceRole/writeOk let the admin UI warn if credentials can't actually persist.
      return res.status(200).json({ stores: list, serviceRole: !!env("SUPABASE_SERVICE_ROLE_KEY"), writeOk, generated: toCreate.length });
    }

    const expected = (process.env.WHATSAPP_VERIFY_TOKEN || "").trim();
    if (q["hub.mode"] === "subscribe" && expected && q["hub.verify_token"] === expected) {
      res.setHeader("Content-Type", "text/plain");
      return res.status(200).send(String(q["hub.challenge"] == null ? "" : q["hub.challenge"]));
    }
    return res.status(403).end();
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await readRawBody(req);
  let body;
  try { body = rawBody ? JSON.parse(rawBody) : {}; } catch (e) { body = {}; }
  let pq = {};
  try { pq = require("url").parse(req.url || "", true).query || {}; } catch (e) { pq = req.query || {}; }

  // ── Authoritative order creation (Phase 1 of the order-system reliability
  // audit — CLAUDE.md fix log, 2026-07-16). This is now the ONLY path that
  // should insert a new orders row; the checkout page awaits this instead of
  // writing straight to Supabase with the anon key. Only productId/qty/
  // optionSelections/storeId and similar identifiers are trusted from the
  // client — price/subtotal/delivery/total sent by the browser are ALWAYS
  // ignored and re-derived here. Creation and notification delivery are
  // deliberately split: the client gets its 200 response the instant the order
  // row is durably saved, and WhatsApp/push/dashboard notifications run
  // afterwards in the same invocation (Vercel keeps a Node function alive until
  // the async handler actually returns, not just until res.json() is called),
  // so a slow or down WhatsApp API can never delay or fail the order itself.
  if (pq.action === "create-order") {
    const idempotencyKey = String(body.idempotencyKey || "").trim().slice(0, 120);
    if (!idempotencyKey) return res.status(400).json({ error: "idempotencyKey required" });
    const storeId = Number(body.storeId);
    if (!storeId) return res.status(400).json({ error: "storeId required" });
    const lineItemsIn = Array.isArray(body.lineItems) ? body.lineItems : [];
    if (!lineItemsIn.length) return res.status(400).json({ error: "cart is empty" });
    const customer = String(body.customer || "").trim().slice(0, 120);
    const customerPhone = String(body.customerPhone || "").trim().slice(0, 40);
    if (!customer) return res.status(400).json({ error: "customer name required" });
    if (customerPhone.replace(/\D/g, "").length < 10) return res.status(400).json({ error: "valid customer phone required" });
    const fulfillment = body.fulfillment === "pickup" ? "pickup" : "delivery";

    try {
      const existing = await sbGet(`orders?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=*&limit=1`);
      if (Array.isArray(existing) && existing[0]) {
        return res.status(200).json({ ok: true, alreadyExists: true, order: publicOrderView(existing[0]) });
      }

      const storeRows = await sbGet(`stores?id=eq.${storeId}&select=id,name,phone,whatsapp,lat,lng,min_order,free_delivery_threshold,open,approval_status,subscription_active&limit=1`);
      const store = storeRows && storeRows[0];
      if (!store) return res.status(404).json({ error: "store not found", code: "store_not_found" });
      if (store.approval_status && store.approval_status !== "approved") {
        return res.status(403).json({ error: "store not approved", code: "store_not_approved" });
      }
      if (store.open === false) return res.status(409).json({ error: "المتجر مغلق حالياً ولا يستقبل طلبات", code: "store_closed" });
      if (store.subscription_active === false) {
        return res.status(409).json({ error: "هذا المتجر لا يستقبل طلبات حالياً — الاشتراك منتهٍ", code: "subscription_inactive" });
      }

      const productIds = [...new Set(lineItemsIn.map(i => Number(i.productId)).filter(Boolean))];
      if (!productIds.length) return res.status(400).json({ error: "no valid line items" });
      const productRows = await sbGet(`products?id=in.(${productIds.join(",")})&select=id,store_id,name,price,price_on_request,available,options,addons`);
      const productById = new Map((productRows || []).map(p => [Number(p.id), p]));

      let subtotal = 0;
      let totalQty = 0;
      const lineItems = [];
      for (const raw of lineItemsIn) {
        const p = productById.get(Number(raw.productId));
        if (!p) return res.status(409).json({ error: "أحد المنتجات لم يعد متوفراً — يرجى مراجعة السلة", code: "product_unavailable", productId: raw.productId });
        if (Number(p.store_id) !== storeId) return res.status(409).json({ error: "منتج لا ينتمي لهذا المتجر", code: "product_unavailable", productId: p.id });
        if (p.available === false) return res.status(409).json({ error: `${p.name} غير متوفر حالياً وتمت إزالته من السلة`, code: "product_unavailable", productId: p.id });
        if (p.price_on_request) return res.status(409).json({ error: `${p.name} بسعر عند الطلب — تواصل عبر واتساب`, code: "price_on_request", productId: p.id });
        const qty = Math.max(1, Math.min(50, Number(raw.qty) || 1));
        let extra = 0;
        const optionLabels = [];
        const optionSelections = Array.isArray(raw.optionSelections) ? raw.optionSelections : [];
        (Array.isArray(p.options) ? p.options : []).forEach((option, index) => {
          const selectedIndex = Number(optionSelections[index] || 0);
          extra += Number(option && option.extra && option.extra[selectedIndex]) || 0;
          if (option && option.values && option.values[selectedIndex]) optionLabels.push(option.values[selectedIndex]);
        });
        const addonSelections = Array.isArray(raw.addonSelections) ? raw.addonSelections : [];
        const addonLabels = [];
        (Array.isArray(p.addons) ? p.addons : []).forEach((addon, index) => {
          if (!addonSelections.includes(index)) return;
          extra += Number(addon && addon.price) || 0;
          if (addon && addon.name) addonLabels.push(`+${addon.name}`);
        });
        const unitPrice = (Number(p.price) || 0) + extra;
        subtotal += unitPrice * qty;
        totalQty += qty;
        lineItems.push({
          productId: p.id, name: p.name, qty, price: unitPrice,
          options: [...optionLabels, ...addonLabels].join("، "),
          optionSelections, notes: String(raw.notes || "").slice(0, 300)
        });
      }
      if (subtotal <= 0) return res.status(400).json({ error: "invalid order total" });

      if (store.min_order && subtotal < Number(store.min_order)) {
        return res.status(409).json({ error: `الحد الأدنى للطلب ${store.min_order} ل.ت`, code: "below_min_order", minOrder: Number(store.min_order) });
      }

      let delivery = 0;
      let deliveryMeta = null;
      if (fulfillment !== "pickup") {
        const ds = body.deliverySettings || {};
        const dest = body.destination || {};
        // Delivery pricing lives client-side by design (named-zone / nationwide /
        // distance logic + localStorage shadow — see delivery-settings-localstorage).
        // When the checkout sends its computed fee, record it as-is (clamped 0..500);
        // only fall back to the server fixed/distance estimate for callers that omit
        // it. Product PRICES are always repriced from the DB above, so this keeps the
        // core anti-tamper guarantee while not regressing any store's delivery rules.
        if (body.clientDeliveryFee != null) {
          delivery = Math.min(500, Math.max(0, Number(body.clientDeliveryFee) || 0));
        } else if (ds.mode === "fixed") {
          delivery = Math.min(500, Math.max(0, Number(ds.fixedFee) || 0));
        } else if (Number.isFinite(Number(store.lat)) && Number.isFinite(Number(store.lng))
          && Number.isFinite(Number(dest.lat)) && Number.isFinite(Number(dest.lng))) {
          const ratePerKm = Math.min(40, Math.max(10, Number(ds.ratePerKm) || 15));
          const maxRoundTripKm = Math.min(200, Math.max(5, Number(ds.maxRoundTripKm) || 60));
          const oneWayKm = Math.max(0.5, haversineKm(
            { lat: Number(store.lat), lng: Number(store.lng) },
            { lat: Number(dest.lat), lng: Number(dest.lng) }
          ) * 1.28);
          const roundTripKm = oneWayKm * 2;
          if (roundTripKm > maxRoundTripKm) {
            return res.status(409).json({ error: "العنوان خارج نطاق توصيل هذا المتجر", code: "out_of_range" });
          }
          delivery = normalizeDeliveryFee(Math.round(roundTripKm * ratePerKm));
          deliveryMeta = { oneWayKm, roundTripKm };
        } else {
          delivery = Math.min(500, Math.max(0, Number(ds.clientFee) || 0));
        }
        if (store.free_delivery_threshold != null && subtotal >= Number(store.free_delivery_threshold)) delivery = 0;
      }

      let discount = 0;
      let couponCode = "";
      const rawCoupon = String(body.couponCode || "").trim();
      if (rawCoupon) {
        const rpc = await sbWrite("POST", "rpc/validate_coupon", {
          p_code: rawCoupon, p_store_id: storeId, p_subtotal: subtotal, p_phone: customerPhone
        }, "return=representation");
        const data = rpc.ok ? rpc.rows : null;
        if (data && data.valid) {
          discount = Number(data.discount) || 0;
          if (data.freeDelivery) delivery = 0;
          couponCode = rawCoupon;
        }
      }

      // Wallet credit: the client may request spending store credit, but NEVER
      // trust the amount — cap it to the customer's real remaining balance read
      // from the ledger server-side (0 when there is no signed-in customer or no
      // credit). Keeps the order total honest even if the client inflates it.
      let creditApplied = 0;
      const reqCredit = Math.max(0, Number(body.creditApplied) || 0);
      if (reqCredit > 0 && body.customerId) {
        try {
          const ledger = await sbGet(`customer_credits?customer_id=eq.${encodeURIComponent(body.customerId)}&select=amount`);
          const bal = Array.isArray(ledger) ? ledger.reduce((s, r) => s + (Number(r.amount) || 0), 0) : 0;
          creditApplied = Math.min(reqCredit, Math.max(0, bal), Math.max(0, subtotal + delivery - discount));
        } catch (e) { creditApplied = 0; }
      }

      const total = Math.max(0, subtotal + delivery - discount - creditApplied);

      const orderId = await nextOrderId();
      const nowIso = new Date().toISOString();
      const orderRow = {
        id: orderId, store_id: storeId, customer, total, status: "طلب جديد", time: "الآن",
        items: totalQty,
        delivery_details: {
          // `quote` used to carry distance only, so a create-order row had no
          // record of what delivery actually cost — the merchant alert and the
          // dashboard both read the fee from here now.
          quote: fulfillment === "pickup" ? null : { ...(deliveryMeta || {}), fee: delivery },
          subtotal, deliveryFee: delivery,
          phone: customerPhone, phoneKey: customerPhone.replace(/\D/g, ""),
          fulfillment, address: String(body.address || "").slice(0, 300), addressDetails: String(body.addressDetails || "").slice(0, 300),
          structuredAddress: body.structuredAddress || null, fullAddressTr: String(body.fullAddressTr || "").slice(0, 600),
          // Map pin of the customer's door (see customerMapsLink) — kept as a
          // number or null so a malformed client value can't poison the row.
          addressLat: Number.isFinite(Number(body.addressLat)) ? Number(body.addressLat) : null,
          addressLng: Number.isFinite(Number(body.addressLng)) ? Number(body.addressLng) : null,
          lineItems, notes: String(body.notes || "").slice(0, 500), substitution: String(body.substitution || "").slice(0, 200),
          payment: String(body.payment || "نقداً عند التسليم").slice(0, 60),
          scheduleDay: String(body.scheduleDay || "").slice(0, 40), scheduleTime: String(body.scheduleTime || "").slice(0, 40),
          closedWhenOrdered: !!body.closedWhenOrdered, createdAt: nowIso, couponCode, discount, creditUsed: creditApplied
        },
        idempotency_key: idempotencyKey,
        notification_status: "pending",
        source: String(body.source || "web").slice(0, 40),
        is_test_order: !!body.isTestOrder
      };
      if (body.customerId) { orderRow.customer_id = body.customerId; orderRow.customer_phone = customerPhone; }
      if (body.attribution) orderRow.attribution = body.attribution;

      const ins = await sbWrite("POST", "orders?on_conflict=idempotency_key", orderRow, "resolution=ignore-duplicates,return=representation");
      let savedRow = Array.isArray(ins.rows) && ins.rows[0];
      if (!savedRow) {
        const after = await sbGet(`orders?idempotency_key=eq.${encodeURIComponent(idempotencyKey)}&select=*&limit=1`);
        savedRow = Array.isArray(after) && after[0];
      }
      if (!savedRow) {
        console.warn("[create-order] insert failed for " + orderId + ": " + ins.status + " " + JSON.stringify(ins.rows || ins.error));
        return res.status(500).json({ error: "تعذّر حفظ الطلب، حاول مجدداً" });
      }

      await sbWrite("POST", "order_status_history", {
        order_id: savedRow.id, status: "طلب جديد", note: null, changed_by: "system"
      }, "return=minimal");

      // Notify BEFORE responding: Vercel can freeze the function as soon as the
      // response is sent, so work after it may never run. Responding first here
      // silently skipped every merchant notification (WhatsApp/panel/push) —
      // found 2026-09-11 on DK-426788084: notification_attempts stayed 0.
      try {
        const dd = orderRow.delivery_details;
        const orderForNotify = {
          id: savedRow.id, storeId, customer, customerPhone, total, fulfillment,
          address: dd.address, payment: dd.payment,
          lineItems, scheduleDay: dd.scheduleDay, scheduleTime: dd.scheduleTime,
          // Everything the merchant needs to actually deliver: full street
          // address, the map pin, and what the customer asked for.
          deliveryFee: dd.deliveryFee, subtotal: dd.subtotal, discount: dd.discount, creditUsed: dd.creditUsed,
          addressDetails: dd.addressDetails, fullAddressTr: dd.fullAddressTr,
          structuredAddress: dd.structuredAddress,
          addressLat: dd.addressLat, addressLng: dd.addressLng,
          notes: dd.notes, substitution: dd.substitution
        };
        let push = { skipped: true };
        try { push = await pushNewOrder(orderForNotify); } catch (e) {}
        // Full order (address, map link, items, payment) in the bell itself —
        // this channel has no template/length limits and no Meta dependency, so
        // the merchant always has the complete order somewhere they can read it.
        await notifyMerchant(storeId, "new_order", "طلب جديد 🛒",
          buildStoreOrderText(orderForNotify, {}), "order", orderForNotify.id);
        let notifyResult = { skipped: true, reason: "whatsapp not configured" };
        if (c.token && c.phoneId) notifyResult = await sendOrderWhatsapp(c, orderForNotify, store, null);
        const anyOk = !!(notifyResult && (
          (notifyResult.store && notifyResult.store.ok) ||
          (notifyResult.customer && notifyResult.customer.ok) ||
          (Array.isArray(notifyResult.admin) && notifyResult.admin.some(r => r.ok))
        ));
        await sbWrite("PATCH", `orders?id=eq.${encodeURIComponent(savedRow.id)}`, {
          notification_status: notifyResult.skipped ? "pending" : (anyOk ? "sent" : "failed"),
          notification_attempts: 1, notification_last_attempt_at: new Date().toISOString(),
          notification_last_error: notifyResult.skipped ? (notifyResult.reason || null) : (anyOk ? null : "no channel succeeded")
        }, "return=minimal");
      } catch (e) {
        try {
          await sbWrite("PATCH", `orders?id=eq.${encodeURIComponent(savedRow.id)}`, {
            notification_status: "failed", notification_attempts: 1,
            notification_last_attempt_at: new Date().toISOString(),
            notification_last_error: String((e && e.message) || e).slice(0, 500)
          }, "return=minimal");
        } catch (_) {}
      }
      return res.status(200).json({ ok: true, order: publicOrderView(savedRow) });
    } catch (e) {
      console.warn("[create-order] unexpected error: " + (e && e.stack || e));
      return res.status(500).json({ error: "تعذّر إنشاء الطلب، حاول مجدداً" });
    }
  }

  // Supabase "Send SMS" Auth Hook → deliver the login OTP over WhatsApp (Meta).

  // Configured in Supabase as an HTTPS hook pointing to
  //   /api/notify-order?action=auth-sms   with secret SEND_SMS_HOOK_SECRET.
  if (pq.action === "auth-sms") {
    if (!verifySendSmsHook(rawBody, req.headers, env("SEND_SMS_HOOK_SECRET"))) {
      return res.status(401).json({ error: "invalid signature" });
    }
    const phone = String(body && body.user && body.user.phone || "").replace(/\D/g, "");
    const otp = body && body.sms && body.sms.otp;
    if (!phone || !otp) return res.status(400).json({ error: "missing phone or otp" });
    const sent = await sendOtpWhatsapp(c, phone, otp);
    if (!sent.ok) return res.status(502).json({ error: { http_code: 502, message: "otp send failed" } });
    return res.status(200).json({});
  }

  // ── Store owner login (username = store mobile OR email + admin-issued password)
  // Public. Succeeds when the password matches — verified server-side with the
  // service-role key; passwords never reach the client. Subscription status no
  // longer BLOCKS login (it is returned so the client can warn); order intake
  // stays gated by the subscription logic elsewhere. If the username maps to >1
  // store (branches), returns the list.
  if (pq.action === "store-login") {
    const rawUser = String((body && body.username) || "").trim();
    const password = String((body && body.password) || "");
    if (!rawUser || !password) return res.status(400).json({ ok: false, error: "missing-credentials" });

    // M1: brute-force throttle, keyed by the login identifier.
    const throttleKey = "store:" + (phoneKey(rawUser) || rawUser.toLowerCase());
    if (await loginThrottleBlocked(throttleKey)) {
      return res.status(429).json({ ok: false, error: "too-many-attempts" });
    }

    // Resolve candidate credential rows. Primary key is the store phone (the
    // username column). When the username is an email, look up the store(s) that
    // carry that email and verify the password against their credential rows.
    let creds;
    if (rawUser.includes("@")) {
      const enc = encodeURIComponent(rawUser.toLowerCase());
      let srows = await sbGet(`stores?email=eq.${enc}&select=id`) || [];
      if (!srows.length) srows = await sbGet(`stores?subscription_email=eq.${enc}&select=id`) || [];
      const ids = srows.map(s => Number(s.id)).filter(Boolean);
      if (!ids.length) { await recordLoginFailure(throttleKey); return res.status(401).json({ ok: false, error: "bad-credentials" }); }
      creds = await sbGet(`store_credentials?store_id=in.(${ids.join(",")})&select=store_id,password`) || [];
    } else {
      const key = phoneKey(rawUser);
      if (!key) return res.status(400).json({ ok: false, error: "missing-credentials" });
      creds = await sbGet(`store_credentials?username=eq.${encodeURIComponent(key)}&select=store_id,password`) || [];
    }

    // H3: verify against the scrypt hash; legacy plaintext rows compare directly
    // and are transparently re-hashed on this successful login (lazy migration —
    // no bulk rewrite, and we never need to know a password we didn't just verify).
    const legacyUpgrades = [];
    const matched = creds.filter(cr => {
      if (isHashedPassword(cr.password)) return verifyPasswordHash(password, cr.password);
      const a = Buffer.from(String(cr.password)), b = Buffer.from(password);
      const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
      if (ok) legacyUpgrades.push(Number(cr.store_id));
      return ok;
    }).map(cr => Number(cr.store_id));
    for (const sid of legacyUpgrades) {
      sbWrite("PATCH", `store_credentials?store_id=eq.${sid}`, { password: hashPassword(password) }, "return=minimal").catch(() => {});
    }
    if (!matched.length) { await recordLoginFailure(throttleKey); return res.status(401).json({ ok: false, error: "bad-credentials" }); }
    const sList = await sbGet(`stores?id=in.(${matched.join(",")})&select=id,name,subscription_active`) || [];
    if (!sList.length) { await recordLoginFailure(throttleKey); return res.status(401).json({ ok: false, error: "bad-credentials" }); }
    clearLoginThrottle(throttleKey).catch(() => {});
    const token = signMerchantToken(sList.map(s => Number(s.id)));
    const withStatus = sList.map(s => ({ id: s.id, name: s.name, subscription_active: s.subscription_active !== false }));
    if (sList.length === 1) {
      return res.status(200).json({ ok: true, store_id: sList[0].id, name: sList[0].name, subscription_active: withStatus[0].subscription_active, token });
    }
    return res.status(200).json({ ok: true, multi: true, stores: withStatus, token });
  }

  // Admin: regenerate one store's login password.
  if (pq.action === "store-creds-reset") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const storeId = Number(body && body.storeId);
    if (!storeId) return res.status(400).json({ error: "storeId required" });
    const rows = await sbGet(`stores?id=eq.${storeId}&select=id,name,phone`) || [];
    const s = rows[0];
    if (!s) return res.status(404).json({ error: "store not found" });
    const key = phoneKey(s.phone);
    if (!key) return res.status(400).json({ error: "no-phone" });
    const password = genPassword();
    const w = await sbWrite("POST", "store_credentials?on_conflict=store_id",
      { store_id: storeId, username: key, password: hashPassword(password), updated_at: new Date().toISOString() },
      "resolution=merge-duplicates,return=minimal");
    if (!w.ok) return res.status(502).json({ error: "save failed" });
    // Return the plaintext ONCE so the admin can hand it to the merchant; only the
    // hash is stored, so this is the only moment it is ever visible.
    return res.status(200).json({ ok: true, store_id: storeId, username: key, password });
  }

  // ── Whop subscription webhook ──────────────────────────────────────────────
  // Configured in the Whop dashboard → Developer → Webhooks, pointing to
  //   https://<site>/api/notify-order?action=whop   with secret WHOP_WEBHOOK_SECRET.
  // Drives the store on/off switch from Whop's LIVE membership status:
  //   membership went valid   → activate the store (trial start or payment), and
  //   membership went invalid → stop new orders + WhatsApp a renewal message.
  if (pq.action === "whop") {
    const wc = whopCfg();
    if (!verifyStandardWebhook(rawBody, req.headers, wc.secret)) {
      return res.status(401).json({ error: "invalid signature" });
    }
    const m = parseWhopMembership(body);
    if (!m.membershipId) return res.status(200).json({ skipped: true, reason: "no membership id" });

    const status = mapWhopStatus(m);
    // current_period_end = when the store auto-stops. Prefer Whop's real renewal
    // date; if absent, fall back to 37 days (7-day trial + 30-day month).
    const periodEnd = m.periodEnd || new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString();

    // 1) Upsert the authoritative membership log (survives even if no store yet).
    await sbWrite("POST", "whop_subscriptions?on_conflict=membership_id", {
      membership_id: m.membershipId, user_email: m.email, plan_id: m.planId, product_id: m.productId,
      status, valid: m.valid, trial_ends_at: m.trialEnd, period_end: m.valid ? periodEnd : null,
      last_event: m.event, raw: m.raw, updated_at: new Date().toISOString()
    }, "resolution=merge-duplicates,return=minimal");

    // 2) Resolve the store: checkout metadata.store_id wins, then a prior link by
    //    membership id, then a match on the email used at checkout.
    let store = null;
    const metaStoreId = m.metadata && (m.metadata.store_id || m.metadata.storeId);
    const sel = "select=id,name,whatsapp,phone,renewal_notified_at&limit=1";
    if (metaStoreId) {
      const rows = await sbGet(`stores?id=eq.${encodeURIComponent(metaStoreId)}&${sel}`);
      store = rows && rows[0];
    }
    if (!store) {
      const rows = await sbGet(`stores?whop_membership_id=eq.${encodeURIComponent(m.membershipId)}&${sel}`);
      store = rows && rows[0];
    }
    if (!store && m.email) {
      const enc = encodeURIComponent(m.email);
      let rows = await sbGet(`stores?subscription_email=eq.${enc}&${sel}`);
      if (!rows || !rows.length) rows = await sbGet(`stores?email=eq.${enc}&${sel}`);
      store = rows && rows[0];
    }

    if (store) {
      const patch = {
        whop_membership_id: m.membershipId, whop_plan_id: m.planId,
        subscription_status: status, subscription_active: m.valid,
        trial_ends_at: m.trialEnd, subscription: status
      };
      if (m.email) patch.subscription_email = m.email;
      if (m.valid) patch.current_period_end = periodEnd;
      await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(store.id)}`, patch, "return=minimal");
      await sbWrite("PATCH", `whop_subscriptions?membership_id=eq.${encodeURIComponent(m.membershipId)}`,
        { store_id: store.id, updated_at: new Date().toISOString() }, "return=minimal");

      if (!m.valid && !store.renewal_notified_at) {
        try { await sendRenewalWhatsapp(c, wc, store); } catch (e) {}
        await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(store.id)}`,
          { renewal_notified_at: new Date().toISOString() }, "return=minimal");
      } else if (m.valid && store.renewal_notified_at) {
        // Re-activated → reset so the NEXT expiry notifies again.
        await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(store.id)}`,
          { renewal_notified_at: null }, "return=minimal");
      }
    }
    return res.status(200).json({ ok: true, membership: m.membershipId, event: m.event, status, linked: !!store });
  }

  // ── Subscription expiry cron (safety net) ──────────────────────────────────
  // A daily Vercel Cron (see vercel.json) hits
  //   /api/notify-order?action=subscription-cron   with ?secret=<NOTIFY_SECRET>.
  // Catches any store whose paid period elapsed without a Whop "invalid" webhook:
  // closes it to new orders and WhatsApps the renewal message once.
  if (pq.action === "subscription-cron") {
    if (!cronOk(req, pq, c)) return res.status(403).json({ error: "unauthorized" });
    return res.status(200).json(await runSubscriptionCron(c));
  }

  // Checkout phone verification — STEP 1: generate a 6-digit code and WhatsApp it
  // to the customer. Public endpoint, rate-limited per phone (>=60s apart, <=5/hr).
  // HARD BLOCKS on send failure by default (soft:false) — no confirmed WhatsApp
  // number, no order, so fake/junk orders can never get through. Set
  // ORDER_OTP_ALLOW_SOFT=1 as a kill switch if WhatsApp delivery ever breaks
  // again (falls back to letting the order through unverified rather than taking
  // checkout down entirely).
  if (pq.action === "send-order-otp") {
    const phone = toE164(body && body.phone || "", c.cc);
    if (!phone || phone.length < 11) return res.status(400).json({ ok: false, reason: "bad_phone" });
    const now = Date.now();
    const rows = await sbGet(`order_otps?phone=eq.${encodeURIComponent(phone)}&select=*`);
    const row = rows && rows[0];
    let sends = 1, windowStart = new Date(now).toISOString();
    if (row) {
      if (row.last_sent_at && now - Date.parse(row.last_sent_at) < 60_000) {
        return res.status(429).json({ ok: false, reason: "too_soon", retryInSec: Math.ceil((60_000 - (now - Date.parse(row.last_sent_at))) / 1000) });
      }
      if (row.window_start && now - Date.parse(row.window_start) < 3_600_000) {
        if ((row.sends || 0) >= 5) return res.status(429).json({ ok: false, reason: "rate_limited" });
        sends = (row.sends || 0) + 1; windowStart = row.window_start;
      }
    }
    const code = String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
    await sbWrite("POST", "order_otps?on_conflict=phone", {
      phone, code_hash: otpHash(phone, code), expires_at: new Date(now + 5 * 60_000).toISOString(),
      attempts: 0, sends, window_start: windowStart, last_sent_at: new Date(now).toISOString(),
      verified_at: null, updated_at: new Date(now).toISOString()
    }, "resolution=merge-duplicates,return=minimal");
    const sent = await sendOtpWhatsapp(c, phone, code);
    if (!sent.ok) {
      // Soft (never blocks) only when WhatsApp isn't configured at all, or the
      // ORDER_OTP_ALLOW_SOFT kill switch is set. Otherwise a send failure now
      // hard-blocks the order — see the comment above this action.
      const soft = !c.token || !c.phoneId || env("ORDER_OTP_ALLOW_SOFT") === "1";
      return res.status(200).json({ ok: false, soft, reason: soft ? "delivery_unavailable" : "send_failed" });
    }
    return res.status(200).json({ ok: true });
  }

  // Checkout phone verification — STEP 2: check the entered code (timing-safe),
  // one-time use, <=5 attempts, 5-min expiry.
  if (pq.action === "verify-order-otp") {
    const phone = toE164(body && body.phone || "", c.cc);
    const code = String(body && body.code || "").replace(/\D/g, "");
    if (!phone || !code) return res.status(400).json({ ok: false, reason: "missing" });
    const rows = await sbGet(`order_otps?phone=eq.${encodeURIComponent(phone)}&select=*`);
    const row = rows && rows[0];
    if (!row || !row.code_hash || !row.expires_at || Date.parse(row.expires_at) < Date.now()) {
      return res.status(200).json({ ok: false, reason: "expired" });
    }
    if ((row.attempts || 0) >= 5) {
      await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { code_hash: null, updated_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: false, reason: "too_many" });
    }
    const got = Buffer.from(otpHash(phone, code)), want = Buffer.from(row.code_hash);
    const match = got.length === want.length && crypto.timingSafeEqual(got, want);
    if (!match) {
      await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { attempts: (row.attempts || 0) + 1, updated_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: false, reason: "invalid" });
    }
    await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { code_hash: null, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }, "return=minimal");
    return res.status(200).json({ ok: true });
  }

  // WhatsApp OTP LOGIN — verify the code (same store/rules as verify-order-otp),
  // then mint a Supabase session token the client exchanges for a real login.
  // Replaces the dead Supabase phone-provider path. The code is sent via the
  // shared send-order-otp action (our Meta number).
  if (pq.action === "verify-login-otp") {
    const phone = toE164(body && body.phone || "", c.cc);
    const code = String(body && body.code || "").replace(/\D/g, "");
    if (!phone || !code) return res.status(200).json({ ok: false, reason: "missing" });
    const rows = await sbGet(`order_otps?phone=eq.${encodeURIComponent(phone)}&select=*`);
    const row = rows && rows[0];
    if (!row || !row.code_hash || !row.expires_at || Date.parse(row.expires_at) < Date.now()) {
      return res.status(200).json({ ok: false, reason: "expired" });
    }
    if ((row.attempts || 0) >= 5) {
      await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { code_hash: null, updated_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: false, reason: "too_many" });
    }
    const got = Buffer.from(otpHash(phone, code)), want = Buffer.from(row.code_hash);
    const match = got.length === want.length && crypto.timingSafeEqual(got, want);
    if (!match) {
      await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { attempts: (row.attempts || 0) + 1, updated_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: false, reason: "invalid" });
    }
    // Code is valid — mint the session BEFORE burning the code, so a transient
    // GoTrue hiccup lets the user retry instead of forcing a fresh code.
    const session = await mintLoginSession(phone);
    if (!session.ok) return res.status(200).json({ ok: false, reason: session.reason || "mint_failed" });
    await sbWrite("PATCH", `order_otps?phone=eq.${encodeURIComponent(phone)}`, { code_hash: null, verified_at: new Date().toISOString(), updated_at: new Date().toISOString() }, "return=minimal");
    return res.status(200).json({ ok: true, tokenHash: session.tokenHash, emailOtp: session.emailOtp, email: session.email });
  }

  // ── Web Push: register this browser's subscription ─────────────────────────
  //   role=customer → open; binds to the customer's phone (order-status push).
  //   role=store    → requires a valid merchant token for THAT store.
  //   role=admin    → requires the admin token (receives every store's orders).
  // Upserts on endpoint so re-subscribing the same browser updates in place.
  if (pq.action === "push-subscribe") {
    const endpoint = String(body && body.endpoint || "").trim();
    const keys = (body && body.keys) || {};
    if (!endpoint || !keys.p256dh || !keys.auth) return res.status(400).json({ error: "endpoint and keys required" });
    const role = ["customer", "store", "admin"].includes(body.role) ? body.role : "customer";
    const row = {
      endpoint, p256dh: keys.p256dh, auth: keys.auth, role,
      customer_phone: null, store_id: null,
      user_agent: String(body.userAgent || "").slice(0, 300),
      updated_at: new Date().toISOString()
    };
    if (role === "store") {
      const storeId = Number(body.storeId);
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      // Merchant password token (default login) OR a Supabase session that owns
      // the store (Google/email/OTP login) — both are accepted so notifications
      // can auto-enable regardless of how the merchant signed in.
      let ok = merchantOk(req, storeId);
      if (!ok) ok = await verifySupabaseStoreOwner(req, storeId);
      if (!ok) return res.status(403).json({ error: "unauthorized" });
      row.store_id = storeId;
    } else if (role === "admin") {
      if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    } else {
      const key = phoneKey(body.customerPhone);
      if (!key) return res.status(400).json({ error: "customerPhone required" });
      row.customer_phone = key;
    }
    const w = await sbWrite("POST", "push_subscriptions?on_conflict=endpoint", row, "resolution=merge-duplicates,return=minimal");
    if (!w.ok) return res.status(502).json({ error: "save failed", detail: w.rows || w.error });
    return res.status(200).json({ ok: true });
  }

  // Web Push: remove this browser's subscription (open — deleting your own
  // endpoint is harmless and lets a toggle-off / unsubscribe clean up the row).
  if (pq.action === "push-unsubscribe") {
    const endpoint = String(body && body.endpoint || "").trim();
    if (!endpoint) return res.status(400).json({ error: "endpoint required" });
    await sbWrite("DELETE", `push_subscriptions?endpoint=eq.${encodeURIComponent(endpoint)}`, undefined, "return=minimal");
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: upsert a product using the service-role key.
  // Required because the anon client cannot UPDATE/INSERT products (RLS blocks non-auth users).
  if (pq.action === "save-product") {
    const storeId = Number(body.storeId || (body.product && body.product.store_id));
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    const product = body.product;
    if (product && storeId && !product.store_id) product.store_id = storeId;
    if (!product || !product.id || !product.store_id) {
      return res.status(400).json({
        error: "product with id and store_id required",
        detail: {
          hasProduct: !!product,
          productId: product && product.id,
          storeId,
          productStoreId: product && product.store_id
        }
      });
    }
    // Root fix for the base64-in-DB bug class: a merchant-uploaded product photo
    // arrives as a data: URL — host it and store the short URL instead.
    await offloadRowImages(product, ["image"], `store${product.store_id}_p${product.id}`);
    // Read the current row BEFORE the upsert: price for the price-history log
    // (spec §7) and name/available for the audit entry (spec §17).
    let prevPrice = null, prevRow = null;
    try {
      const existing = await sbGet(`products?id=eq.${Number(product.id)}&select=price,name,available&limit=1`);
      prevRow = (existing && existing[0]) || null;
      if (prevRow && prevRow.price != null) prevPrice = Number(prevRow.price);
    } catch (e) { /* best-effort */ }
    const r = await sbWrite("POST", "products?on_conflict=id", product, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) {
      console.warn("save-product failed", { status: r.status, detail: r.rows });
      return res.status(502).json({ error: "save failed", detail: r.rows });
    }
    // Log price changes to product_price_history — best-effort, never blocks the save.
    try {
      const newPrice = Number(product.price);
      if (prevPrice != null && !Number.isNaN(newPrice) && prevPrice !== newPrice) {
        await sbWrite("POST", "product_price_history", {
          product_id: Number(product.id), store_id: Number(product.store_id),
          old_price: prevPrice, new_price: newPrice,
          source: isAdmin ? "admin" : "merchant", changed_by: isAdmin ? "admin" : "merchant"
        }, "return=minimal");
      }
    } catch (e) { /* logging is best-effort */ }
    // Audit entry (spec §17): who saved what — add vs update, with a compact old/new snapshot.
    await logAudit(product.store_id, isAdmin ? "admin" : "merchant",
      prevRow ? "product_update" : "product_add", "product", product.id,
      prevRow ? { name: prevRow.name, price: prevRow.price, available: prevRow.available } : null,
      { name: product.name, price: product.price, available: product.available });
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: delete a product using the service-role key.
  // Required because the anon client cannot DELETE products (RLS blocks non-auth users).
  if (pq.action === "delete-product") {
    const productId = Number(body.id);
    if (!productId) return res.status(400).json({ error: "id required" });
    const storeId = Number(body.storeId);
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    // Capture the name before it's gone, for a readable audit entry (best-effort).
    let delName = null;
    try { const ex = await sbGet(`products?id=eq.${productId}&select=name&limit=1`); delName = ex && ex[0] && ex[0].name; } catch (e) {}
    const r = await sbWrite("DELETE", `products?id=eq.${productId}`, undefined, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "delete failed", detail: r.rows });
    await logAudit(storeId, isAdmin ? "admin" : "merchant", "product_delete", "product", productId, delName ? { name: delName } : null, null);
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: apply an AI-enhanced image. Backs up the CURRENT image to
  // product_images BEFORE overwriting (spec §8 «الأصل لا يُحذف»), then updates the
  // product image. The original stays recoverable via revert-product-image.
  if (pq.action === "apply-enhanced-image") {
    const productId = Number(body.productId);
    const storeId = Number(body.storeId);
    const image = typeof body.image === "string" ? body.image : "";
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    if (!productId || !image) return res.status(400).json({ error: "productId and image required" });
    // Back up the current image (best-effort) so the merchant can always revert.
    try {
      const existing = await sbGet(`products?id=eq.${productId}&select=image,store_id&limit=1`);
      const cur = existing && existing[0];
      if (cur) {
        await sbWrite("POST", "product_images", {
          product_id: productId, store_id: storeId || cur.store_id || null,
          original_image: cur.image || null, status: "enhanced", provider: "openai"
        }, "return=minimal");
      }
    } catch (e) { /* backup is best-effort */ }
    const r = await sbWrite("PATCH", `products?id=eq.${productId}`, { image }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows });
    await logAudit(storeId, isAdmin ? "admin" : "merchant", "image_approve", "product", productId, null, null);
    await notifyMerchant(storeId, "image_enhanced", "تم اعتماد صورة محسّنة", "اعتُمدت نسخة محسّنة بالذكاء الاصطناعي لأحد منتجاتك — الأصل محفوظ ويمكن استرجاعه.", "product", productId);
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: revert a product image to the most recent backed-up original.
  if (pq.action === "revert-product-image") {
    const productId = Number(body.productId);
    const storeId = Number(body.storeId);
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    if (!productId) return res.status(400).json({ error: "productId required" });
    const rows = await sbGet(`product_images?product_id=eq.${productId}&status=eq.enhanced&order=created_at.desc&limit=1&select=id,original_image`);
    const backup = rows && rows[0];
    if (!backup || backup.original_image == null) return res.status(404).json({ error: "no original to restore" });
    const r = await sbWrite("PATCH", `products?id=eq.${productId}`, { image: backup.original_image }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "revert failed", detail: r.rows });
    // Mark this backup consumed so the button hides and it isn't reverted twice.
    try { await sbWrite("PATCH", `product_images?id=eq.${backup.id}`, { status: "reverted" }, "return=minimal"); } catch (e) {}
    await logAudit(storeId, isAdmin ? "admin" : "merchant", "image_revert", "product", productId, null, null);
    return res.status(200).json({ ok: true, image: backup.original_image });
  }

  // Merchant/Admin: create or update a discount coupon (spec §11). A merchant's
  // store_id is always forced to their own authed store — they can never create
  // a global/other-store coupon. Admin may additionally omit storeId entirely to
  // create/edit a global, platform-wide coupon (store_id null — e.g. DUKKAN10).
  // Codes are globally unique (case-insensitive) so validate_coupon can never
  // resolve one code to two different coupons.
  if (pq.action === "merchant-coupon-save") {
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    const rawStoreId = body.storeId;
    const storeId = (rawStoreId === null || rawStoreId === undefined || rawStoreId === "") ? null : Number(rawStoreId);
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    if (!storeId && !isAdmin) return res.status(400).json({ error: "storeId required" });
    const c = (body.coupon && typeof body.coupon === "object") ? body.coupon : {};
    const code = String(c.code || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!/^[A-Z0-9_-]{3,24}$/.test(code)) return res.status(400).json({ error: "bad_code" });
    const type = String(c.discount_type || "");
    if (!["percent", "fixed", "free_delivery"].includes(type)) return res.status(400).json({ error: "bad_type" });
    let value = Math.round(Number(c.value) || 0);
    if (type === "percent" && (value < 1 || value > 90)) return res.status(400).json({ error: "bad_value" });
    if (type === "fixed" && value < 1) return res.status(400).json({ error: "bad_value" });
    if (type === "free_delivery") value = 0;
    const couponId = Number(c.id) || null;
    // Uniqueness: no OTHER coupon may carry this code (spec §23 acceptance).
    const dup = await sbGet(`coupons?code=ilike.${encodeURIComponent(code)}&select=id&limit=2`) || [];
    if (dup.some(d => Number(d.id) !== couponId)) return res.status(409).json({ error: "duplicate_code" });
    const row = {
      code, discount_type: type, value, store_id: storeId,
      min_subtotal: Math.max(0, Math.round(Number(c.min_subtotal) || 0)) || null,
      max_discount: type === "percent" && Number(c.max_discount) > 0 ? Math.round(Number(c.max_discount)) : null,
      ends_at: c.ends_at ? new Date(c.ends_at).toISOString() : null,
      usage_limit: Number(c.usage_limit) > 0 ? Math.round(Number(c.usage_limit)) : null,
      per_customer_limit: Number(c.per_customer_limit) > 0 ? Math.round(Number(c.per_customer_limit)) : null,
      active: c.active !== false
    };
    let r;
    if (couponId) {
      // Update: a merchant may only touch their own store's coupon (never a
      // global one, never another store's); admin may edit any coupon.
      const own = await sbGet(`coupons?id=eq.${couponId}&select=store_id&limit=1`);
      if (!own || !own[0]) return res.status(404).json({ error: "not_found" });
      const ownerStoreId = own[0].store_id == null ? null : Number(own[0].store_id);
      if (!isAdmin && ownerStoreId !== storeId) return res.status(403).json({ error: "forbidden" });
      r = await sbWrite("PATCH", `coupons?id=eq.${couponId}`, row, "return=representation");
    } else {
      r = await sbWrite("POST", "coupons", row, "return=representation");
    }
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows });
    const saved = Array.isArray(r.rows) ? r.rows[0] : null;
    await logAudit(storeId, isAdmin ? "admin" : "merchant", couponId ? "coupon_update" : "coupon_create", "coupon", (saved && saved.id) || couponId, null, { code, type, value });
    return res.status(200).json({ ok: true, coupon: saved });
  }

  // Merchant/Admin: enable/disable a coupon (spec §11). Admin may toggle any
  // coupon, including a global one (store_id null); a merchant only their own.
  if (pq.action === "merchant-coupon-status") {
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    const rawStoreId = body.storeId;
    const storeId = (rawStoreId === null || rawStoreId === undefined || rawStoreId === "") ? null : Number(rawStoreId);
    const couponId = Number(body.couponId);
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    if (!couponId) return res.status(400).json({ error: "couponId required" });
    if (!storeId && !isAdmin) return res.status(400).json({ error: "storeId required" });
    const own = await sbGet(`coupons?id=eq.${couponId}&select=store_id,code&limit=1`);
    if (!own || !own[0]) return res.status(404).json({ error: "not_found" });
    const ownerStoreId = own[0].store_id == null ? null : Number(own[0].store_id);
    if (!isAdmin && ownerStoreId !== storeId) return res.status(403).json({ error: "forbidden" });
    const active = body.active !== false;
    const r = await sbWrite("PATCH", `coupons?id=eq.${couponId}`, { active }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows });
    await logAudit(storeId, isAdmin ? "admin" : "merchant", "coupon_status", "coupon", couponId, null, { code: own[0].code, active });
    return res.status(200).json({ ok: true });
  }

  // PUBLIC: log an in-store product search (spec §16 «تقرير البحث»). Customers
  // aren't authenticated, so this is open — but strictly validated and size-capped
  // (same trust model as the order-notification endpoint). Fire-and-forget client-side.
  if (pq.action === "log-search") {
    const storeId = Number(body.storeId);
    const query = String(body.query || "").replace(/\s+/g, " ").trim().slice(0, 60);
    const resultsCount = Math.max(0, Math.min(9999, Math.round(Number(body.resultsCount) || 0)));
    if (!storeId || query.length < 2) return res.status(400).json({ error: "storeId and query (2+ chars) required" });
    const normalized = query.toLowerCase()
      .replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").replace(/[ًٌٍَُِّْ]/g, "");
    await sbWrite("POST", "search_logs", { store_id: storeId, query, normalized_query: normalized, results_count: resultsCount }, "return=minimal");
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: mark this store's notifications as read (spec §19).
  if (pq.action === "notifications-read") {
    const storeId = Number(body.storeId);
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed && storeId) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    if (!storeId) return res.status(400).json({ error: "storeId required" });
    const r = await sbWrite("PATCH", `merchant_notifications?store_id=eq.${storeId}&read_at=is.null`, { read_at: new Date().toISOString() }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows });
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: manually re-send an order's WhatsApp/push notifications
  // (Phase 1 order-system audit, spec §8/§16 — "إعادة إرسال الإشعار يدوياً").
  // Re-reads the order + store from the DB (never re-derives price — the order
  // is already saved) and re-runs the exact same send path create-order uses.
  if (pq.action === "retry-order-notification") {
    const orderId = String(body.id || pq.id || "").trim();
    if (!orderId) return res.status(400).json({ error: "id required" });
    const rows = await sbGet(`orders?id=eq.${encodeURIComponent(orderId)}&select=*&limit=1`);
    const row = rows && rows[0];
    if (!row) return res.status(404).json({ error: "order not found" });
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    if (!isAdmin && !merchantOk(req, Number(row.store_id))) return res.status(403).json({ error: "unauthorized" });
    const storeRows = await sbGet(`stores?id=eq.${row.store_id}&select=id,name,phone,whatsapp&limit=1`);
    const store = storeRows && storeRows[0];
    const dd = (row.delivery_details && typeof row.delivery_details === "object") ? row.delivery_details : {};
    const orderForNotify = {
      id: row.id, storeId: row.store_id, customer: row.customer, customerPhone: dd.phone || row.customer_phone || "",
      total: row.total, fulfillment: dd.fulfillment || "delivery", address: dd.address || "", payment: dd.payment || "",
      lineItems: dd.lineItems || [], scheduleDay: dd.scheduleDay || "", scheduleTime: dd.scheduleTime || "",
      deliveryFee: dd.deliveryFee ?? (dd.quote && dd.quote.fee != null ? Number(dd.quote.fee) : null),
      subtotal: dd.subtotal ?? null, discount: Number(dd.discount) || 0, creditUsed: Number(dd.creditUsed) || 0,
      addressDetails: dd.addressDetails || "", fullAddressTr: dd.fullAddressTr || "",
      structuredAddress: dd.structuredAddress || null,
      addressLat: dd.addressLat ?? null, addressLng: dd.addressLng ?? null,
      notes: dd.notes || "", substitution: dd.substitution || ""
    };
    let notifyResult = { skipped: true, reason: "whatsapp not configured" };
    if (c.token && c.phoneId) notifyResult = await sendOrderWhatsapp(c, orderForNotify, store, null);
    const anyOk = !!(notifyResult && (
      (notifyResult.store && notifyResult.store.ok) ||
      (notifyResult.customer && notifyResult.customer.ok) ||
      (Array.isArray(notifyResult.admin) && notifyResult.admin.some(r2 => r2.ok))
    ));
    const patch = await sbWrite("PATCH", `orders?id=eq.${encodeURIComponent(orderId)}`, {
      notification_status: notifyResult.skipped ? row.notification_status : (anyOk ? "sent" : "failed"),
      notification_attempts: (Number(row.notification_attempts) || 0) + 1,
      notification_last_attempt_at: new Date().toISOString(),
      notification_last_error: notifyResult.skipped ? (notifyResult.reason || null) : (anyOk ? null : "no channel succeeded")
    }, "return=minimal");
    return res.status(200).json({ ok: true, sent: anyOk, results: notifyResult, saved: !!patch.ok });
  }

  // Merchant/Admin: update an order's status using the service-role key.

  // Required because the anon client cannot UPDATE orders (RLS blocks non-auth users).
  if (pq.action === "update-order") {
    const orderId = String(body.id || "").trim();
    const newStatus = String(body.status || "").trim();
    if (!orderId || !newStatus) return res.status(400).json({ error: "id and status required" });
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed) {
      const storeId = Number(body.storeId);
      if (storeId) authed = merchantOk(req, storeId);
    }
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    // Old status for the audit trail (best-effort read; never blocks the update).
    let prevStatus = null, orderStoreId = Number(body.storeId) || null;
    try {
      const ex = await sbGet(`orders?id=eq.${encodeURIComponent(orderId)}&select=status,store_id&limit=1`);
      if (ex && ex[0]) { prevStatus = ex[0].status || null; orderStoreId = Number(ex[0].store_id) || orderStoreId; }
    } catch (e) {}
    const patch = { status: newStatus };
    if (body.items !== undefined) patch.items = body.items;
    const r = await sbWrite("PATCH", `orders?id=eq.${encodeURIComponent(orderId)}`, patch, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows });
    await logAudit(orderStoreId, isAdmin ? "admin" : "merchant", "order_status", "order", orderId,
      prevStatus ? { status: prevStatus } : null, { status: newStatus });
    return res.status(200).json({ ok: true });
  }

  // POST from Meta = delivery statuses / inbound messages. Store + ack.
  // SECURITY: only trust the body if its HMAC signature matches META_APP_SECRET.
  // This stops anyone from POSTing a fake "whatsapp_business_account" event to
  // inject messages into the inbox or trigger auto-replies.
  if (body && (body.object === "whatsapp_business_account" || Array.isArray(body.entry))) {
    const sigCandidates = metaSigCandidates(req, rawBody);
    if (!verifyMetaSignature(sigCandidates, req.headers["x-hub-signature-256"])) {
      // Diagnostic (no secrets leaked): if this still fires, hasSecret=false means
      // META_APP_SECRET is unset; hasSecret=true with no candidate match means the
      // configured secret value is wrong (Meta's bytes are now reconstructed). The
      // signature tags below are public (Meta sends them in the clear).
      try {
        const secret = env("META_APP_SECRET") || env("WHATSAPP_APP_SECRET");
        const hdr = String(req.headers["x-hub-signature-256"] || "");
        const expSigs = secret ? sigCandidates.map(b => "sha256=" + crypto.createHmac("sha256", secret).update(b, "utf8").digest("hex").slice(0, 12)) : [];
        console.warn("[wa-sig] reject " + JSON.stringify({
          preParsed: !!(req.body && typeof req.body === "object"),
          hasSecret: !!secret,
          candidates: sigCandidates.length,
          gotSig: hdr.slice(0, 19),
          expSigs
        }));
      } catch (e) { /* diagnostic must never break the response */ }
      return res.status(401).json({ error: "invalid signature" });
    }
    try { await ingestWebhook(body); } catch (e) { try { console.error("[whatsapp-webhook] ingest", e.message); } catch (_) {} }
    return res.status(200).json({ received: true });
  }

  // Customer order-status notification: the merchant advanced the order, so tell
  // the customer the new status. Business-initiated → uses the approved
  // `order_status_update` template. The merchant client sends the order id,
  // customer phone, store name, the new status, and an optional note.
  if (pq.action === "status") {
    // SECURITY: previously OPEN — anyone could send a WhatsApp message to any
    // customer phone. Now requires admin, the internal shared secret, OR a valid
    // merchant token for the order's own store (so a merchant can notify their
    // own customers when they advance the order).
    {
      const storeId = Number(body.storeId);
      const authed = adminOk({ headers: req.headers, query: pq })
        || secretOk(req, pq, c)
        || (storeId && merchantOk(req, storeId));
      if (!authed) return res.status(403).json({ error: "unauthorized" });
    }
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    if (!id || !status) return res.status(400).json({ error: "id and status required" });
    const storeName = String(body.storeName || "المتجر").trim();
    const note = String(body.note || "").replace(/\s+/g, " ").trim();
    const line = note || statusMessage(status);

    // 1) Browser push to the customer — works even when WhatsApp isn't configured.
    let push = { skipped: true };
    try { push = await pushOrderStatus(id, phoneKey(body.customerPhone), storeName, status, line); } catch (e) {}

    // 1b) Customer notification inbox (kind='order') — the in-app bell on the
    // website and in the Flutter app. Added 2026-07-20 with the notification
    // system: a browser push reaches only a visitor who granted permission on
    // that one browser, so without this row a customer opening the app sees an
    // empty inbox and no record that «قيد التجهيز / خرج للتوصيل / تم التسليم»
    // ever happened.
    //
    // Deliberately additive and fail-open: wrapped so a missing table (before
    // migrations/20260720_notifications_system.sql is run) or any write error
    // can never block the status update itself. Order delivery outranks its own
    // notification — see the silent-order-loss incident in CLAUDE.md.
    let inbox = { skipped: true };
    try {
      const custKey = phoneKey(body.customerPhone);
      if (custKey) {
        const r = await sbWrite("POST", "notifications", [{
          customer_phone: custKey,
          kind: "order",
          title: `تحديث طلبك ${id}`,
          body: `${storeName}: ${status}${line ? " — " + line : ""}`,
          deep_link: "/orders",
          order_id: id
        }], "return=minimal");
        inbox = r && r.ok ? { ok: true } : { ok: false, reason: "write failed" };
      } else {
        inbox = { skipped: true, reason: "no customer phone" };
      }
    } catch (e) { inbox = { ok: false, reason: e.message }; }

    // 1c) FCM to the customer's mobile devices — this is what actually lights up
    // the Android/iOS notification tray for «قيد التجهيز / خرج للتوصيل / تم
    // التسليم». The browser push above only reaches a browser that granted
    // permission; the inbox row above is only seen once the app is opened.
    //
    // No-ops cleanly until FCM_* credentials exist (see lib/fcm.js). Fail-open
    // for the same reason as the inbox write: never block a status update.
    let fcm = { skipped: true };
    try {
      const custKey = phoneKey(body.customerPhone);
      const { fcmConfigured, sendOneFcm } = require("../lib/fcm");
      if (!custKey) fcm = { skipped: true, reason: "no customer phone" };
      else if (!fcmConfigured()) fcm = { skipped: true, reason: "fcm not configured" };
      else {
        const devices = await sbGet(`app_devices?customer_phone=eq.${encodeURIComponent(custKey)}&push_channel=eq.fcm&notifications_enabled=is.true&select=device_uid,push_token`);
        const list = Array.isArray(devices) ? devices.filter(d => d.push_token) : [];
        let sent = 0, dead = 0;
        for (const d of list) {
          const r = await sendOneFcm(d.push_token, {
            title: `تحديث طلبك ${id}`,
            body: `${storeName}: ${status}${line ? " — " + line : ""}`,
            deepLink: "/orders",
            tag: `order-${id}`
          });
          if (r.ok) sent++;
          else if (r.gone) {
            dead++;
            await sbWrite("PATCH", `app_devices?device_uid=eq.${encodeURIComponent(d.device_uid)}`,
              { push_token: null, push_channel: null }, "return=minimal");
          }
        }
        fcm = { sent, devices: list.length, pruned: dead };
      }
    } catch (e) { fcm = { ok: false, reason: e.message }; }

    // 2) WhatsApp (only when the platform number is configured AND we have a phone).
    let whatsapp = { skipped: true, reason: "whatsapp not configured" };
    const custTo = toE164(body.customerPhone || "", c.cc);
    if (c.token && c.phoneId) {
      if (!custTo) whatsapp = { skipped: true, reason: "no customer phone" };
      else {
        const params = [id, storeName, status, line];
        whatsapp = await sendWhatsapp(c, custTo, { template: c.tplStatus, params, text: `تحديث طلبك ${id} من ${storeName}: ${status}. ${line}` });
      }
    }
    return res.status(200).json({ ok: true, id, push, whatsapp, inbox, fcm });
  }

  // Called once, right after a merchant self-registers via the public "join"
  // form: writes the SAME password they just chose (Supabase Auth) into
  // store_credentials, so the admin-issued phone+password login mode (which
  // checks store_credentials, not Supabase Auth) works with that same password
  // instead of silently diverging into a separate auto-generated one.
  if (pq.action === "sync-owner-credentials") {
    const storeId = Number(body.storeId);
    if (!storeId || !(await verifySupabaseStoreOwner(req, storeId))) return res.status(403).json({ error: "unauthorized" });
    const phone = String(body.phone || "").trim();
    const password = String(body.password || "").trim();
    if (!phone || !password || password.length < 6) return res.status(400).json({ error: "invalid" });
    const username = phoneKey(phone) || phone;
    const w = await sbWrite("POST", "store_credentials?on_conflict=store_id", [{ store_id: storeId, username, password: hashPassword(password) }], "resolution=merge-duplicates,return=minimal");
    return res.status(200).json({ ok: !!w.ok });
  }

  // Admin: save editable site content (e.g. the subscription plan) into the
  // public site_settings table. Admin-gated; writes with the service-role key
  // (bypasses RLS — the table is public-read only, no public write).
  if (pq.action === "save-settings") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const key = String(body.key || "").trim();
    if (!key) return res.status(400).json({ error: "key required" });
    // Root fix for the base64-in-DB bug class: admin content images (categories,
    // banners, daily deal...) can nest data: URLs anywhere in the value JSON —
    // site_settings is fetched on EVERY page load, so host them instead.
    const value = await offloadJsonImages(body.value, `setting_${key}`);
    const r = await sbWrite("POST", "site_settings?on_conflict=key", { key, value, updated_at: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    if (key === "banners") bannerIdCache.ids = null; // force a refresh of the event-validation allow-list
    return res.status(200).json({ ok: true });
  }

  // ---- البانرات المُدارة: عدّاد الظهور/النقر ----
  // نقطة عامة بلا مصادقة عمداً: الزائر المجهول هو من يُطلقها، ولا تُرجع أي بيانات.
  // الصف المكتوب مجهول تماماً (بلا معرّف زائر/IP) — راجع تعليق الجدول في
  // migrations/20260719_banners_and_banner_events.sql.
  // حماية من التلاعب: يُقبل فقط معرّف بانر موجود فعلاً في site_settings.banners،
  // فلا يستطيع أحد حشو الجدول بمعرّفات مخترعة. القائمة مخزَّنة مؤقتاً 60 ثانية
  // كي لا نقرأ الإعدادات مع كل ظهور.
  if (pq.action === "banner-event") {
    const type = String(body.type || "").trim();
    const bannerId = String(body.bannerId || "").trim();
    const source = body.source === "app" ? "app" : "web";
    const placement = String(body.placement || "").trim().slice(0, 40);
    // Fail-open on every rejection: a counter must never surface an error to a
    // shopper, and a 4xx here would just add noise to the browser console.
    if (!bannerId || bannerId.length > 64 || (type !== "impression" && type !== "click")) {
      return res.status(200).json({ ok: true, skipped: "invalid" });
    }
    const known = await knownBannerIds();
    if (known && !known.has(bannerId)) return res.status(200).json({ ok: true, skipped: "unknown_banner" });
    const w = await sbWrite("POST", "banner_events", { banner_id: bannerId, placement, event_type: type, source }, "return=minimal");
    // A missing table (migration not run yet) lands here — still a silent 200.
    return res.status(200).json({ ok: true, recorded: !!w.ok });
  }

  // ---- البانرات المُدارة: قراءة الإحصاءات للوحة الإدارة ----
  // التجميع يتم داخل Postgres عبر دالة banner_stats() وليس بجلب كل الصفوف وعدّها هنا.
  // إن لم يكن الترحيل قد شُغّل بعد، نُرجع enabled:false كي تعرض اللوحة رسالة صريحة
  // «التتبع غير مفعّل» بدل أصفار كاذبة تبدو كأنها «صفر نقرة».
  if (pq.action === "banner-stats") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const days = Math.min(Math.max(Number(pq.days) || 30, 1), 365);
    const { url, key } = sb();
    try {
      const r = await fetch(`${url}/rest/v1/rpc/banner_stats`, {
        method: "POST",
        headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ days })
      });
      if (r.status === 404) return res.status(200).json({ ok: true, enabled: false, days, rows: [] });
      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        // PGRST202 = function not found, 42P01 = relation does not exist.
        if (/PGRST202|42P01|does not exist/i.test(detail)) return res.status(200).json({ ok: true, enabled: false, days, rows: [] });
        return res.status(502).json({ error: "stats failed", detail: detail.slice(0, 300) });
      }
      const rows = await r.json().catch(() => []);
      return res.status(200).json({ ok: true, enabled: true, days, rows: Array.isArray(rows) ? rows : [] });
    } catch (e) {
      return res.status(502).json({ error: "stats failed", detail: String(e && e.message || e) });
    }
  }

  // Merchant/Admin: save the fixed-price delivery zones for ONE store into the
  // shared `namedZones` site-setting. A merchant editing their own dashboard has
  // a merchant token (not an admin token), so the admin-only `save-settings`
  // above 403s for them — that's the "تعذّر الحفظ السحابي لمناطق التوصيل" error.
  // We merge server-side (read-modify-write) so a merchant with only a partial
  // view of the map can never wipe other stores' zones.
  if (pq.action === "save-store-zones") {
    const storeId = Number(body.storeId);
    if (!storeId) return res.status(400).json({ error: "storeId required" });
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed) authed = merchantOk(req, storeId);
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    const zones = Array.isArray(body.zones) ? body.zones : [];
    const rows = await sbGet("site_settings?key=eq.namedZones&select=value");
    const current = (rows && rows[0] && rows[0].value && typeof rows[0].value === "object") ? rows[0].value : {};
    if (zones.length) current[String(storeId)] = zones; else delete current[String(storeId)];
    const r = await sbWrite("POST", "site_settings?on_conflict=key", { key: "namedZones", value: current, updated_at: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true, value: current });
  }

  // Merchant/Admin: save manual category-organizer overrides for ONE store
  // (Phase 2 of the store-page category engine — see buildStoreCategoryPlan in
  // app.js). Stored in stores.category_settings as { admin: {...}, merchant: {...} },
  // one bucket per role so a merchant save can never clobber an admin override
  // and vice versa (client-side priority: admin[raw] wins over merchant[raw]).
  // Read-modify-write like save-store-zones above, for the same reason: a caller
  // only ever sends the full override set for THEIR role, never the other's.
  if (pq.action === "save-store-categories") {
    const storeId = Number(body.storeId);
    if (!storeId) return res.status(400).json({ error: "storeId required" });
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    const scope = isAdmin ? "admin" : (merchantOk(req, storeId) ? "merchant" : null);
    if (!scope) return res.status(403).json({ error: "unauthorized" });
    const rawSettings = (body.settings && typeof body.settings === "object") ? body.settings : {};
    const clean = {};
    for (const key of Object.keys(rawSettings)) {
      const raw = String(key || "").trim();
      if (!raw) continue;
      const v = rawSettings[key] || {};
      const mergeInto = typeof v.mergeInto === "string" ? v.mergeInto.trim() : "";
      const sortOrderNum = Number(v.sortOrder);
      const entry = {
        mergeInto: mergeInto || null,
        disableAutoMerge: !!v.disableAutoMerge,
        forceVisible: !!v.forceVisible,
        hidden: !!v.hidden,
        sortOrder: Number.isFinite(sortOrderNum) ? sortOrderNum : null
      };
      // Skip fully-default rows — keeps the stored JSON limited to actual overrides.
      if (entry.mergeInto || entry.disableAutoMerge || entry.forceVisible || entry.hidden || entry.sortOrder != null) {
        clean[raw] = entry;
      }
    }
    const rows = await sbGet(`stores?id=eq.${storeId}&select=category_settings`);
    const current = (rows && rows[0] && rows[0].category_settings && typeof rows[0].category_settings === "object") ? rows[0].category_settings : {};
    const next = { ...current, [scope]: clean };
    const r = await sbWrite("PATCH", `stores?id=eq.${storeId}`, { category_settings: next }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true, categorySettings: next });
  }

  // Admin: approve / reject / suspend a store (item 9 moderation). Admin-gated and
  // written with the service-role key, so it keeps working after RLS is locked
  // down (the admin panel has no Supabase Auth session of its own).
  if (pq.action === "store-approval") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    const allowed = ["pending", "approved", "rejected", "suspended"];
    if (!id || !allowed.includes(status)) return res.status(400).json({ error: "id and valid status required" });
    const r = await sbWrite("PATCH", `stores?id=eq.${encodeURIComponent(id)}`, { approval_status: status }, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // Merchant/Admin: upsert a store using the service-role key. Required so the
  // anon client no longer needs write access to `stores` (was previously an
  // unconditional direct upsert with no auth check at all). Accepts the admin
  // token, a merchant password token that owns storeId, or a Supabase session
  // that owns storeId (Google/email/OTP login). For a brand-new store (the
  // join-flow signup path, before store_users links ownership) any signed-in
  // Supabase user may create their own not-yet-existing row.
  if (pq.action === "save-store") {
    const row = body.store || {};
    const storeId = Number(row.id);
    if (!storeId) return res.status(400).json({ error: "id required" });
    const isAdmin = adminOk({ headers: req.headers, query: pq });
    let authed = isAdmin;
    if (!authed) authed = merchantOk(req, storeId);
    if (!authed) authed = await verifySupabaseStoreOwner(req, storeId);
    let newOwnerUserId = null; // set only for the "brand-new self-join store" path below
    if (!authed) {
      const existing = await sbGet(`stores?id=eq.${storeId}&select=id&limit=1`);
      if (!existing || !existing.length) {
        const token = String(req.headers["x-sb-token"] || "").trim();
        if (token) {
          const u = await goTrueUser(token);
          if (u && u.id) { authed = true; newOwnerUserId = u.id; }
        }
      }
    }
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    // H1 (mass-assignment) fix: only platform admins may write platform-controlled
    // columns. A merchant editing their own store (merchant token / Supabase owner /
    // brand-new self-join) must not be able to set these via a crafted payload —
    // e.g. re-enable an expired subscription, self-approve, or feature themselves.
    // Stripped fields keep their current DB value on update, or the column default
    // on a new insert (approval_status defaults to 'pending', so a self-join store
    // still lands pending). Admins are unaffected.
    if (!isAdmin) {
      const PROTECTED = ["subscription_active", "subscription", "subscription_status",
        "subscription_email", "current_period_end", "trial_ends_at", "approval_status",
        "featured", "official_store", "rating", "reviews", "order_count",
        "google_rating", "google_reviews_count", "google_place_id", "google_maps_url",
        "google_rating_updated_at"];
      for (const k of PROTECTED) delete row[k];
    }
    // Root fix for the base64-in-DB bug class: join-form logos and dashboard
    // cover/logo uploads arrive as data: URLs — host them before the row lands.
    await offloadRowImages(row, ["image", "cover_image", "logo_image"], `store${storeId}`);
    const r = await sbWrite("POST", "stores?on_conflict=id", row, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    // A newly self-joined merchant has no store_users row yet, and RLS has no
    // policy letting the client insert its own link (only "self read" + an
    // admin-only manage policy) — the client's own bindStoreToUser() call right
    // after this was silently RLS-rejected, leaving the merchant unable to write
    // to their own new store. Link it here with the service-role key instead
    // (storeId is confirmed brand-new above, so there's no existing link to race).
    if (newOwnerUserId) {
      const link = await sbWrite("POST", "store_users", { user_id: newOwnerUserId, store_id: storeId, role: "owner" }, "return=minimal");
      if (!link.ok) console.warn("store_users auto-link:", link.rows || link.error);
    }
    return res.status(200).json({ ok: true });
  }

  // Public: submit a customer complaint. No auth required (matches order
  // creation — a guest can complain about an order same as they can place
  // one). G4: this used to be the ENTIRE implementation client-side
  // (state.customerComplaints + localStorage only) — invisible to admin and
  // lost on a browser clear. Now persisted with the service-role key.
  if (pq.action === "complaint-create") {
    const subject = String(body.subject || "").trim().slice(0, 200);
    const message = String(body.message || "").trim().slice(0, 4000);
    if (!subject || !message) return res.status(400).json({ error: "subject and message required" });
    const orderId = body.orderId ? String(body.orderId).trim() : null;
    const row = {
      id: "SH-" + Date.now().toString(36).toUpperCase(),
      subject, body: message, order_id: orderId || null,
      customer: body.customer ? String(body.customer).trim().slice(0, 200) : null,
      store: body.store ? String(body.store).trim().slice(0, 200) : null,
      status: "شكوى جديدة"
    };
    const r = await sbWrite("POST", "complaints", row, "return=representation");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    const saved = Array.isArray(r.rows) ? r.rows[0] : row;
    return res.status(200).json({ ok: true, complaint: saved });
  }

  // Admin: update a complaint's status and/or write a reply (G4). Resolves
  // resolved_at automatically when the status moves to "تم الحل".
  if (pq.action === "complaint-update") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const id = String(body.id || "").trim();
    if (!id) return res.status(400).json({ error: "id required" });
    const allowedStatuses = ["شكوى جديدة", "قيد المراجعة", "تم الحل"];
    const patch = {};
    if (body.status != null) {
      if (!allowedStatuses.includes(body.status)) return res.status(400).json({ error: "bad_status" });
      patch.status = body.status;
      patch.resolved_at = body.status === "تم الحل" ? new Date().toISOString() : null;
    }
    if (body.response != null) patch.admin_response = String(body.response).trim().slice(0, 4000) || null;
    if (!Object.keys(patch).length) return res.status(400).json({ error: "nothing to update" });
    const r = await sbWrite("PATCH", `complaints?id=eq.${encodeURIComponent(id)}`, patch, "return=representation");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows || r.error });
    const saved = Array.isArray(r.rows) ? r.rows[0] : null;
    return res.status(200).json({ ok: true, complaint: saved });
  }

  // Admin inbox writes (password-gated).
  if (pq.action === "login" || pq.action === "reply" || pq.action === "mark-read" || pq.action === "resume-ai" || pq.action === "set-pin" || pq.action === "set-label") {
    // M1: throttle the admin password login by client IP (the mint endpoint is the
    // only brute-forceable one; the other actions already require a valid session).
    const adminThrottleKey = pq.action === "login" ? "admin:" + clientIp(req) : null;
    if (adminThrottleKey && await loginThrottleBlocked(adminThrottleKey)) {
      return res.status(429).json({ error: "too-many-attempts" });
    }
    if (!adminOk({ headers: req.headers, query: pq })) {
      if (adminThrottleKey) await recordLoginFailure(adminThrottleKey);
      return res.status(403).json({ error: "unauthorized" });
    }

    if (pq.action === "login") { clearLoginThrottle(adminThrottleKey).catch(() => {}); return res.status(200).json({ ok: true, token: signAdminToken() }); }

    // Pin / unpin a conversation (pinned threads sort to the top of the inbox).
    if (pq.action === "set-pin") {
      const wa = String(body.wa || pq.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      await setThreadFlags(wa, { pinned: !!body.pinned });
      return res.status(200).json({ ok: true, pinned: !!body.pinned });
    }

    // Tag a conversation with one of a fixed set of labels (or clear it with null).
    if (pq.action === "set-label") {
      const wa = String(body.wa || pq.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      const ALLOWED = ["store_lead", "follow_up", "important", "customer"];
      let label = body.label == null || body.label === "" ? null : String(body.label);
      if (label !== null && !ALLOWED.includes(label)) return res.status(400).json({ error: "invalid label" });
      await setThreadFlags(wa, { label });
      return res.status(200).json({ ok: true, label });
    }

    // Resume AI auto-reply for a thread (clears the escalation flags).
    if (pq.action === "resume-ai") {
      const wa = String(body.wa || pq.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      await setThreadFlags(wa, { ai_paused: false, needs_human: false });
      return res.status(200).json({ ok: true });
    }

    if (pq.action === "mark-read") {
      const wa = String(body.wa || pq.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      await sbWrite("PATCH", `whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&direction=eq.in&read_at=is.null`,
        { read_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ ok: true });
    }

    // Reply: free-form text to a customer (only delivered inside the 24h window).
    if (!c.token || !c.phoneId) return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
    const to = toE164(body.to || "", c.cc);
    const text = String(body.text || "").trim();
    if (!to || !text) return res.status(400).json({ error: "to and text required" });
    const sent = await sendWhatsapp(c, to, { text });
    await sbWrite("POST", "whatsapp_messages", {
      wa_id: to, direction: "out", body: text, msg_type: "text",
      wam_id: sent.id || null, status: sent.ok ? "sent" : "failed",
      error: sent.ok ? null : JSON.stringify(sent.error || "").slice(0, 500)
    }, "return=minimal");
    if (!sent.ok) return res.status(502).json({ error: "send failed", detail: sent.error });
    // A human just replied → pause the AI for this thread (clear the needs-human
    // flag) so the bot doesn't talk over the agent. Resume via ?action=resume-ai.
    try { await setThreadFlags(to, { ai_paused: true, needs_human: false }); } catch (e) {}
    return res.status(200).json({ ok: true, id: sent.id });
  }

  // Otherwise this is an order-notification request.
  // Optional shared secret (used when the trigger is a Supabase DB webhook).
  if (c.secret) {
    const got = req.headers["x-notify-secret"] || (req.query && req.query.secret);
    if (got !== c.secret) return res.status(401).json({ error: "unauthorized" });
  }
  const order = normalizeOrder(body);
  if (!order.id || !order.storeId) return res.status(400).json({ error: "order id/storeId required" });

  // Authoritative order write. The checkout page ALSO writes the order straight to
  // Supabase from the browser (pushOrderCloud) with the anon key — but that request
  // races the customer backgrounding/closing the tab right after the success screen
  // appears, and its keepalive path silently swallows any non-network failure. This
  // request (the WhatsApp/notification call) has proven far more reliable in the
  // wild, so we upsert the full order row here too, service-role, same-origin, no
  // RLS involved. on_conflict=id + merge-duplicates makes this idempotent with
  // whatever pushOrderCloud already saved (or will save) for the same order id.
  // Option B (C2): these hold the server-side repricing outcome, computed inside
  // the try below and reused for the admin flag after it.
  let expectedSubtotal = 0;
  const submittedTotal = Number(order.total) || 0;
  let priceCorrected = null;
  try {
    const b = body || {};
    const ddPhone = order.customerPhone || "";
    // Reprice from the products table and CORRECT a grossly under-reported total.
    // Delivery only adds and coupon/credit are dormant, so any submitted total
    // below HALF the real product subtotal is tampering (the create-order path
    // already reprices new clients; this protects the legacy path old released
    // apps + stale web tabs still use, without breaking them — the order still
    // saves, just at the honest product-value floor).
    expectedSubtotal = await computeExpectedSubtotal(order);
    let effectiveTotal = submittedTotal;
    if (expectedSubtotal > 0 && submittedTotal < expectedSubtotal * 0.5) {
      priceCorrected = { from: submittedTotal, to: expectedSubtotal };
      effectiveTotal = expectedSubtotal;
    }
    const orderRow = {
      id: order.id, store_id: Number(order.storeId), customer: order.customer || "",
      total: effectiveTotal, status: b.status || "طلب جديد", time: b.time || "الآن",
      items: Number(b.items) || (Array.isArray(order.lineItems) ? order.lineItems.length : 0),
      delivery_details: {
        quote: b.deliveryQuote ?? null,
        // Same field name as the create-order path so every reader (merchant
        // alert, dashboard, reports) finds the delivery fee in one place.
        // NOT `subtotal`: the only product figure this path has is the repriced
        // floor (addons/variants aren't modelled), so recording it under that
        // name would hand a later reader a number that isn't what was charged.
        deliveryFee: (b.deliveryQuote && b.deliveryQuote.fee != null) ? Number(b.deliveryQuote.fee) : null,
        phone: ddPhone,
        phoneKey: ddPhone.replace(/\D/g, ""),
        fulfillment: order.fulfillment || "delivery",
        address: order.address || "",
        addressDetails: b.addressDetails || "",
        // Additive Turkish-address snapshot — see app.js pushOrderCloud comment.
        // Passthrough only, never required: legacy clients omitting these fields
        // still save exactly as before.
        structuredAddress: b.structuredAddress || null,
        fullAddressTr: b.fullAddressTr || "",
        // Map pin of the customer's door, so the merchant alert (and a later
        // re-send from the dashboard) can link straight to Google Maps.
        addressLat: b.addressLat ?? null,
        addressLng: b.addressLng ?? null,
        lineItems: order.lineItems || [],
        notes: b.notes || "",
        substitution: b.substitution || "",
        payment: order.payment || "",
        scheduleDay: b.scheduleDay || "",
        scheduleTime: b.scheduleTime || "",
        closedWhenOrdered: !!b.closedWhenOrdered,
        createdAt: b.createdAt || "",
        priceCorrected: priceCorrected  // audit trail when a tampered total was corrected server-side
      }
    };
    if (b.customerId) { orderRow.customer_id = b.customerId; orderRow.customer_phone = ddPhone; }
    if (b.attribution) orderRow.attribution = b.attribution;
    const saved = await sbWrite("POST", "orders?on_conflict=id", orderRow, "resolution=merge-duplicates,return=minimal");
    if (!saved.ok) console.warn("[order-save] failed for " + order.id + ": " + saved.status + " " + JSON.stringify(saved.rows || saved.error));
  } catch (e) { try { console.warn("[order-save] error for " + order.id + ": " + e.message); } catch (_) {} }

  // Fraud/mispricing detection (alert-only, never blocks): order totals are
  // fully client-computed (checkout writes straight to Supabase with the anon
  // key), so a tampered client could submit any total. Re-price the order's
  // line items from the real, current products table server-side and flag the
  // admin copy below if the submitted total looks implausibly low — an admin
  // can then hold/cancel the order before it's prepared. This uses each real
  // product's base price as a floor (variant/addon surcharges aren't modeled,
  // so it only ever under-flags, never false-flags a legitimately priced order).
  // Reuse the repricing computed during the save (no second DB round-trip): a
  // corrected order is always flagged for the admin; otherwise flag the softer
  // "suspicious but not corrected" band (below 30% of real product value).
  const priceFlag = priceCorrected
    ? { expectedSubtotal, total: priceCorrected.from }
    : (expectedSubtotal > 0 && submittedTotal < expectedSubtotal * 0.3 ? { expectedSubtotal, total: submittedTotal } : null);

  // Authoritative store contact + name from the DB — never trust the client for
  // WHERE messages go.
  const rows = await sbGet(`stores?id=eq.${encodeURIComponent(order.storeId)}&select=name,phone,whatsapp&limit=1`);
  const store = rows && rows[0];

  // Browser push to the store + admins — independent of WhatsApp, so it works
  // even while the WhatsApp number is down. Fire before the WhatsApp gate below.
  let push = { skipped: true };
  try { push = await pushNewOrder(order); } catch (e) {}

  // In-dashboard notification bell (spec §19) — independent of push/WhatsApp.
  await notifyMerchant(order.storeId, "new_order", "طلب جديد 🛒",
    buildStoreOrderText(order, {}), "order", order.id);

  if (!c.token || !c.phoneId) {
    return res.status(200).json({ ok: true, order: order.id, push, whatsapp: { skipped: true, reason: "whatsapp not configured" } });
  }
  // Same sender as the create-order path — one builder, one format, so the two
  // entry points (this legacy endpoint the published mobile app still uses, and
  // create-order used by the website) can never drift apart again. It notifies
  // the store, every admin number and the customer, and writes the audit row.
  const results = await sendOrderWhatsapp(c, order, store, priceFlag);

  return res.status(200).json({ ok: true, order: order.id, results, push });
};

// Set AFTER the handler assignment above so it is not overwritten. Disables the
// automatic body parser so we can verify webhook/hook signatures on raw bytes.
module.exports.config = { api: { bodyParser: false } };
