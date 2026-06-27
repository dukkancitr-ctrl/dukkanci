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
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 1_000_000) req.destroy(); // 1MB hard cap — webhooks are tiny
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

// Constant-time comparison of the Meta webhook signature against the app secret.
// Returns true ONLY when META_APP_SECRET is configured AND the signature matches.
// If the secret is unset we return false (fail closed) so unsigned bodies are
// never trusted as genuine WhatsApp/Meta events.
function verifyMetaSignature(rawBody, signatureHeader) {
  const secret = env("META_APP_SECRET") || env("WHATSAPP_APP_SECRET");
  if (!secret) return false;
  const sig = String(signatureHeader || "");
  if (!sig.startsWith("sha256=")) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
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
    tplCustomer: env("WHATSAPP_TEMPLATE_CUSTOMER"),
    tplStatus: env("WHATSAPP_TEMPLATE_STATUS") || "order_status_update",
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

function sb() {
  return {
    url: (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    key: env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || PUB_KEY
  };
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
const REPLY_MERCHANT = `🤝 يسعدنا انضمامك كتاجر في دكانجي!\nأرسل لنا اسم متجرك ونوع نشاطه ومنطقته، وسيتواصل معك فريقنا لإتمام الإضافة وبدء استقبال الطلبات. 🚀`;
const REPLY_WELCOME = `أهلاً بك في دكانجي! 🛍️\nسوق الحي بين يديك — متاجر ومطاعم وبقالات حيّك في إسطنبول.\nكيف نساعدك؟ اكتب «/» لرؤية الخيارات السريعة، أو أخبرنا باستفسارك وسيردّ فريقنا. 🌟`;
const REPLY_AWAY = `شكراً لتواصلك مع دكانجي! 🌙\nفريقنا خارج أوقات العمل حالياً (نعمل يومياً ٩ صباحاً–١١ مساءً بتوقيت إسطنبول)، وسنردّ فور بدء الدوام.\nوللطلب في أي وقت، الموقع متاح على مدار الساعة: ${SITE_URL}`;

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
تساعد في: كيفية الطلب، التوصيل والاستلام ومناطقه ورسومه، تصفّح المتاجر والأقسام، العروض، وانضمام التجار، والأسئلة العامة عن المنصة.
إرشادات مهمة:
- للطلب وجّه العميل إلى الموقع https://www.dukkanci.com.tr ليختار المتجر والمنتجات ويكمل الطلب. رسوم التوصيل تُحسب حسب المسافة وتظهر بدقّة عند إتمام الطلب، والاستلام من المتجر مجاني.
- لا تعرف تفاصيل طلب معيّن أو حالته أو بيانات الحساب أو الدفع. إن سُئلت عن حالة طلب اطلب رقمه (مثل DK-1234567) وأخبر العميل أن الفريق سيتابع، أو وجّهه إلى «طلباتي» في الموقع.
- لا تختلق أسعاراً أو أرقاماً أو أوقاتاً أو وعوداً؛ إن لم تكن متأكداً قل ذلك ووجّه العميل للفريق.
- لا تطلب أبداً بيانات حساسة (أرقام بطاقات، كلمات مرور، رموز).
- للشكاوى أو الأمور المعقّدة التي تحتاج تدخّلاً بشرياً، اعتذر بلطف وأخبر العميل أن فريق دكانجي سيتواصل معه قريباً.
أجب مباشرةً بالرسالة النهائية فقط دون شرح طريقة تفكيرك.`;
async function aiReply(text, wa_id, timestamp) {
  const key = env("OPENAI_API_KEY");
  if (!key) return null;
  const model = env("OPENAI_MODEL") || "gpt-4o-mini";
  // OpenAI takes the system prompt as the first message. Add light conversation
  // context (prior messages, oldest→newest) when the DB is available.
  const messages = [{ role: "system", content: AI_SYSTEM }];
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
  messages.push({ role: "user", content: String(text == null ? "" : text).slice(0, 2000) });
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000); // keep the webhook within serverless limits
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model, max_tokens: 500, temperature: 0.4, messages }),
      signal: ctrl.signal
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return null;
    const msg = data.choices && data.choices[0] && data.choices[0].message;
    const out = msg && msg.content ? String(msg.content).trim() : "";
    return out || null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
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
        if (!dup && d.type === "text" && m.from) {
          const reply = autoReplyFor(d.body);
          if (reply) {
            try { await sendAutoReply(m.from, reply); } catch (e) {}     // command / ice breaker → static
          } else {
            let ai = null;
            try { ai = await aiReply(d.body, m.from, m.timestamp); } catch (e) {}  // free text → AI
            if (ai) { try { await sendAutoReply(m.from, ai); } catch (e) {} }
            else { try { await maybeGreetOrAway(m.from, m.timestamp); } catch (e) {} }  // fallback
          }
        }
      }
      // Delivery/read statuses for messages we sent.
      for (const s of (v.statuses || [])) {
        if (!s || !s.id) continue;
        await sbWrite("PATCH", `whatsapp_messages?wam_id=eq.${encodeURIComponent(s.id)}`,
          { status: s.status }, "return=minimal");
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
      payment: dd.payment || "", lineItems: Array.isArray(dd.lineItems) ? dd.lineItems : []
    };
  }
  const o = body || {};
  return {
    id: o.id, storeId: o.storeId, customer: o.customer || "",
    customerPhone: o.customerPhone || "", total: Number(o.total) || 0,
    fulfillment: o.fulfillment || "delivery", address: o.address || "",
    payment: o.payment || "", lineItems: Array.isArray(o.lineItems) ? o.lineItems : []
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
const itemsLine = items => (items || []).map(i => `${i.name} ×${i.qty || 1}`).join(" • ");

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

    // Admin inbox reads.
    if (q.action === "threads" || q.action === "thread") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });

      if (q.action === "threads") {
        const rows = await sbGet("whatsapp_messages?select=wa_id,contact_name,direction,body,msg_type,read_at,created_at&order=created_at.desc&limit=600") || [];
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
        return res.status(200).json({ threads });
      }

      // Single conversation: history ascending, then mark its inbound messages read.
      const wa = String(q.wa || "").replace(/\D/g, "");
      if (!wa) return res.status(400).json({ error: "wa required" });
      const msgs = await sbGet(`whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&select=id,direction,body,msg_type,status,created_at&order=created_at.asc&limit=500`) || [];
      const lastIn = [...msgs].reverse().find(m => m.direction === "in");
      const canFreeform = !!lastIn && (Date.now() - new Date(lastIn.created_at).getTime() < 24 * 60 * 60 * 1000);
      await sbWrite("PATCH", `whatsapp_messages?wa_id=eq.${encodeURIComponent(wa)}&direction=eq.in&read_at=is.null`,
        { read_at: new Date().toISOString() }, "return=minimal");
      return res.status(200).json({ wa_id: wa, messages: msgs, canFreeform });
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

    // Admin: all orders (service-role read, bypasses anon RLS)
    if (q.action === "orders") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const rows = await sbGet("orders?select=*&order=created_at.desc&limit=1000") || [];
      return res.status(200).json({ orders: rows });
    }

    // Merchant: their store's orders only (verified by phone+password credentials)
    if (q.action === "store-orders") {
      const storeId = Number(q.storeId);
      if (!storeId) return res.status(400).json({ error: "storeId required" });
      if (!merchantOk(req, storeId)) return res.status(403).json({ error: "unauthorized" });
      const rows = await sbGet(`orders?store_id=eq.${storeId}&select=*&order=created_at.desc&limit=500`) || [];
      return res.status(200).json({ orders: rows });
    }

    // Admin: list every store with its login credentials (phone=username +
    // generated password). Lazily generates+persists a password for any store
    // that has a phone but no credential row yet. Passwords live in
    // store_credentials (RLS denies anon) and are returned ONLY through this
    // admin-gated endpoint — never to the public anon client.
    if (q.action === "store-creds") {
      if (!adminOk({ headers: req.headers, query: q })) return res.status(403).json({ error: "unauthorized" });
      const storeRows = await sbGet("stores?select=id,name,phone,subscription_active&order=id") || [];
      const credRows = await sbGet("store_credentials?select=store_id,username,password") || [];
      const byId = new Map(credRows.map(c => [Number(c.store_id), c]));
      const toCreate = [];
      for (const s of storeRows) {
        const key = phoneKey(s.phone);
        if (key && !byId.has(Number(s.id))) {
          const row = { store_id: s.id, username: key, password: genPassword() };
          byId.set(Number(s.id), row);
          toCreate.push(row);
        }
      }
      let writeOk = true;
      if (toCreate.length) {
        const w = await sbWrite("POST", "store_credentials?on_conflict=store_id", toCreate, "resolution=merge-duplicates,return=minimal");
        writeOk = !!w.ok;
      }
      const list = storeRows.map(s => {
        const cr = byId.get(Number(s.id));
        return {
          store_id: s.id, name: s.name, phone: s.phone || "",
          username: cr ? cr.username : "", password: cr ? cr.password : "",
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

  // ── Store owner login (phone = username + admin-issued password) ────────────
  // Public. Succeeds ONLY when the password matches AND the store's subscription
  // is active. Verified server-side with the service-role key; passwords never
  // reach the client. If the phone maps to >1 store (branches), returns the list.
  if (pq.action === "store-login") {
    const key = phoneKey(body && body.username);
    const password = String((body && body.password) || "");
    if (!key || !password) return res.status(400).json({ ok: false, error: "missing-credentials" });
    const creds = await sbGet(`store_credentials?username=eq.${encodeURIComponent(key)}&select=store_id,password`) || [];
    const matched = creds.filter(cr => {
      const a = Buffer.from(String(cr.password)), b = Buffer.from(password);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    }).map(cr => Number(cr.store_id));
    if (!matched.length) return res.status(401).json({ ok: false, error: "bad-credentials" });
    const sList = await sbGet(`stores?id=in.(${matched.join(",")})&select=id,name,subscription_active`) || [];
    const active = sList.filter(s => s.subscription_active !== false);
    if (!active.length) return res.status(403).json({ ok: false, error: "subscription-inactive" });
    const activeIds = active.map(s => Number(s.id));
    const token = signMerchantToken(activeIds);
    if (active.length === 1) return res.status(200).json({ ok: true, store_id: active[0].id, name: active[0].name, token });
    return res.status(200).json({ ok: true, multi: true, stores: active.map(s => ({ id: s.id, name: s.name })), token });
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
      { store_id: storeId, username: key, password, updated_at: new Date().toISOString() },
      "resolution=merge-duplicates,return=minimal");
    if (!w.ok) return res.status(502).json({ error: "save failed" });
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
  // Fails SOFT (soft:true) when WhatsApp OTP delivery isn't operational yet (no
  // approved template), so the client can fall back and never block a real order.
  // Set ORDER_OTP_STRICT=1 (once the template is live) to instead block on send
  // failures (forces a reachable WhatsApp number).
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
      const strict = env("ORDER_OTP_STRICT") === "1" && c.token && c.phoneId;
      return res.status(200).json({ ok: false, soft: !strict, reason: strict ? "send_failed" : "delivery_unavailable" });
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
    const patch = { status: newStatus };
    if (body.items !== undefined) patch.items = body.items;
    const r = await sbWrite("PATCH", `orders?id=eq.${encodeURIComponent(orderId)}`, patch, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "update failed", detail: r.rows });
    return res.status(200).json({ ok: true });
  }

  // POST from Meta = delivery statuses / inbound messages. Store + ack.
  // SECURITY: only trust the body if its HMAC signature matches META_APP_SECRET.
  // This stops anyone from POSTing a fake "whatsapp_business_account" event to
  // inject messages into the inbox or trigger auto-replies.
  if (body && (body.object === "whatsapp_business_account" || Array.isArray(body.entry))) {
    if (!verifyMetaSignature(rawBody, req.headers["x-hub-signature-256"])) {
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
    // customer phone. Now requires admin or the internal shared secret. (Once
    // merchant Supabase Auth lands, also verify the caller owns this order's store.)
    if (!adminOk({ headers: req.headers, query: pq }) && !secretOk(req, pq, c)) {
      return res.status(403).json({ error: "unauthorized" });
    }
    if (!c.token || !c.phoneId) return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
    const id = String(body.id || "").trim();
    const status = String(body.status || "").trim();
    if (!id || !status) return res.status(400).json({ error: "id and status required" });
    const custTo = toE164(body.customerPhone || "", c.cc);
    if (!custTo) return res.status(200).json({ skipped: true, reason: "no customer phone" });
    const storeName = String(body.storeName || "المتجر").trim();
    const note = String(body.note || "").replace(/\s+/g, " ").trim();
    const line = note || statusMessage(status);
    const params = [id, storeName, status, line];
    const sent = await sendWhatsapp(c, custTo, { template: c.tplStatus, params, text: `تحديث طلبك ${id} من ${storeName}: ${status}. ${line}` });
    if (!sent.ok) return res.status(502).json({ error: "send failed", detail: sent.error });
    return res.status(200).json({ ok: true, id: sent.id });
  }

  // Admin: save editable site content (e.g. the subscription plan) into the
  // public site_settings table. Admin-gated; writes with the service-role key
  // (bypasses RLS — the table is public-read only, no public write).
  if (pq.action === "save-settings") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });
    const key = String(body.key || "").trim();
    if (!key) return res.status(400).json({ error: "key required" });
    const r = await sbWrite("POST", "site_settings?on_conflict=key", { key, value: body.value, updated_at: new Date().toISOString() }, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
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

  // Admin inbox writes (password-gated).
  if (pq.action === "login" || pq.action === "reply" || pq.action === "mark-read") {
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });

    if (pq.action === "login") return res.status(200).json({ ok: true, token: signAdminToken() });

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
    return res.status(200).json({ ok: true, id: sent.id });
  }

  // Otherwise this is an order-notification request.
  // Optional shared secret (used when the trigger is a Supabase DB webhook).
  if (c.secret) {
    const got = req.headers["x-notify-secret"] || (req.query && req.query.secret);
    if (got !== c.secret) return res.status(401).json({ error: "unauthorized" });
  }
  if (!c.token || !c.phoneId) {
    return res.status(200).json({ skipped: true, reason: "whatsapp not configured" });
  }
  const order = normalizeOrder(body);
  if (!order.id || !order.storeId) return res.status(400).json({ error: "order id/storeId required" });

  // Authoritative store contact + name from the DB — never trust the client for
  // WHERE messages go.
  const rows = await sbGet(`stores?id=eq.${encodeURIComponent(order.storeId)}&select=name,phone,whatsapp&limit=1`);
  const store = rows && rows[0];
  const storeName = (store && store.name) || "متجرك";
  const storeTo = toE164(store && (store.whatsapp || store.phone), c.cc);
  const custTo = toE164(order.customerPhone, c.cc);
  const fulfillmentAr = order.fulfillment === "pickup" ? "استلام من المتجر" : "توصيل";
  const results = {};

  // 1) Notify the STORE.
  if (storeTo) {
    const text = `🛒 طلب جديد على دكانجي\n\nرقم الطلب: ${order.id}\nالزبون: ${order.customer}\nهاتف الزبون: ${order.customerPhone}\nالإجمالي: ${money(order.total)}\nالاستلام: ${fulfillmentAr}`
      + (order.address ? `\nالعنوان: ${order.address}` : "")
      + (order.payment ? `\nالدفع: ${order.payment}` : "")
      + `\n\nالمنتجات:\n${itemsLine(order.lineItems) || "-"}\n\nافتح لوحة دكانجي لإدارة الطلب.`;
    const params = [String(order.id), order.customer, order.customerPhone, money(order.total), fulfillmentAr, itemsLine(order.lineItems) || "-"];
    results.store = await sendWhatsapp(c, storeTo, { template: c.tplStore, params, text });
  } else {
    results.store = { skipped: true, reason: "store has no whatsapp/phone" };
  }

  // 2) Acknowledge to the CUSTOMER.
  if (custTo) {
    const text = `✅ تم استلام طلبك على دكانجي\n\nرقم الطلب: ${order.id}\nالمتجر: ${storeName}\nالإجمالي: ${money(order.total)}\n\nسنعلمك فور تأكيد المتجر لطلبك. شكراً لاستخدامك دكانجي 🛍️`;
    const params = [String(order.id), storeName, money(order.total)];
    results.customer = await sendWhatsapp(c, custTo, { template: c.tplCustomer, params, text });
  } else {
    results.customer = { skipped: true, reason: "no customer phone" };
  }

  return res.status(200).json({ ok: true, order: order.id, results });
};

// Set AFTER the handler assignment above so it is not overwritten. Disables the
// automatic body parser so we can verify webhook/hook signatures on raw bytes.
module.exports.config = { api: { bodyParser: false } };
