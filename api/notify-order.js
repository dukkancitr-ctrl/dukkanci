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

// ───────────────────────── Human escalation (spec §2) ──────────────────────
// When a customer asks for a human — or a human agent takes over — the AI steps
// aside. Per-conversation state lives in whatsapp_threads (service-role only).
const HUMAN_REQUEST_RE = /(موظّ?ف|[إا]نسان|بشر(?:ي)?|خدمة\s*(?:العملاء|الزبائن)|الدعم|ممثّ?ل|مندوب|(?:شخص|حدا?)\s*حقيقي|human|agent|representative|operator|real\s*person|customer\s*service|live\s*chat|talk\s*to\s*(?:someone|a\s*person|human))/i;
function wantsHuman(text) {
  const t = String(text || "");
  return !!t.trim() && HUMAN_REQUEST_RE.test(t);
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
async function notifyAdminsEscalation(wa_id, name) {
  try {
    await pushToSubscriptions("role=eq.admin", {
      title: "💬 عميل يطلب موظفاً",
      body: `${name || wa_id} بحاجة لرد بشري على واتساب`,
      url: "/", tag: "wa-escalate-" + wa_id
    });
  } catch (e) { /* push is best-effort */ }
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

// Re-prices an order's line items from the real `products` table (never the
// client-submitted per-item price) and flags it when the submitted total is
// far below what those real prices add up to. Returns null when nothing looks
// wrong or when it can't tell (missing products, empty cart) — always fails
// closed toward "not suspicious" so this can never hold up a real order.
async function checkOrderPriceSanity(order) {
  try {
    const items = Array.isArray(order.lineItems) ? order.lineItems : [];
    const ids = [...new Set(items.map(i => Number(i.productId)).filter(Boolean))];
    if (!ids.length) return null;
    const rows = await sbGet(`products?id=in.(${ids.join(",")})&select=id,price`);
    if (!Array.isArray(rows) || !rows.length) return null;
    const priceById = new Map(rows.map(r => [Number(r.id), Number(r.price) || 0]));
    let expectedSubtotal = 0;
    for (const it of items) {
      const real = priceById.get(Number(it.productId));
      if (real == null) continue; // product not found/mismatched — skip rather than guess
      expectedSubtotal += real * (Number(it.qty) || 1);
    }
    if (expectedSubtotal <= 0) return null;
    const total = Number(order.total) || 0;
    // Delivery only ever ADDS to total, so ignoring it keeps this a safe floor
    // check; 30% leaves generous room for any real coupon/credit stacking.
    if (total < expectedSubtotal * 0.3) return { expectedSubtotal, total };
    return null;
  } catch (e) { return null; }
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
  messages.push({ role: "user", content: cleanText });
  // Ground the answer in the knowledge base (RAG) when relevant chunks exist.
  let system = AI_SYSTEM;
  const ctx = await retrieveKnowledge(cleanText);
  if (ctx) {
    system = AI_SYSTEM + `\n\nمعلومات من قاعدة معرفة دكانجي — اعتمد عليها أولاً للإجابة، وإن لم تجد الجواب فيها فاعتذر بلطف أو صعّد لموظف، ولا تختلق:\n${ctx}`;
  }
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
        if (!dup && d.type === "text" && m.from) {
          const flags = await getThreadFlags(m.from);
          // Human escalation: customer explicitly asks for a person.
          if (wantsHuman(d.body)) {
            if (!flags.needs_human) {
              await setThreadFlags(m.from, { ai_paused: true, needs_human: true, last_escalated_at: new Date().toISOString() });
              await notifyAdminsEscalation(m.from, nameByWa[m.from]);
              try { await sendAutoReply(m.from, "تمام 🙌 بحوّلك لموظف من فريق دكانجي يتابع معك. ابقَ معنا وسيردّ عليك قريباً."); } catch (e) {}
            }
            continue; // already-escalated repeats → stay silent (human will reply)
          }
          // A human is handling this thread → the AI stays quiet.
          if (flags.ai_paused) continue;
          const reply = autoReplyFor(d.body);
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
      const credRows = await sbGet("store_credentials?select=store_id,username,password") || [];
      const byId = new Map(credRows.map(c => [Number(c.store_id), c]));
      const toCreate = [];
      for (const s of storeRows) {
        if (byId.has(Number(s.id))) continue;
        // Every store gets a credential so admin keys are effective store-wide.
        // username = phone (primary login) when present, else email, else a
        // store-id placeholder. Phone-less stores still log in via the email path.
        const key = phoneKey(s.phone) || String(s.email || "").toLowerCase().trim() || `store-${s.id}`;
        const row = { store_id: s.id, username: key, password: genPassword() };
        byId.set(Number(s.id), row);
        toCreate.push(row);
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

    // Resolve candidate credential rows. Primary key is the store phone (the
    // username column). When the username is an email, look up the store(s) that
    // carry that email and verify the password against their credential rows.
    let creds;
    if (rawUser.includes("@")) {
      const enc = encodeURIComponent(rawUser.toLowerCase());
      let srows = await sbGet(`stores?email=eq.${enc}&select=id`) || [];
      if (!srows.length) srows = await sbGet(`stores?subscription_email=eq.${enc}&select=id`) || [];
      const ids = srows.map(s => Number(s.id)).filter(Boolean);
      if (!ids.length) return res.status(401).json({ ok: false, error: "bad-credentials" });
      creds = await sbGet(`store_credentials?store_id=in.(${ids.join(",")})&select=store_id,password`) || [];
    } else {
      const key = phoneKey(rawUser);
      if (!key) return res.status(400).json({ ok: false, error: "missing-credentials" });
      creds = await sbGet(`store_credentials?username=eq.${encodeURIComponent(key)}&select=store_id,password`) || [];
    }

    const matched = creds.filter(cr => {
      const a = Buffer.from(String(cr.password)), b = Buffer.from(password);
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    }).map(cr => Number(cr.store_id));
    if (!matched.length) return res.status(401).json({ ok: false, error: "bad-credentials" });
    const sList = await sbGet(`stores?id=in.(${matched.join(",")})&select=id,name,subscription_active`) || [];
    if (!sList.length) return res.status(401).json({ ok: false, error: "bad-credentials" });
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
    return res.status(200).json({ ok: true, id, push, whatsapp });
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
    const w = await sbWrite("POST", "store_credentials?on_conflict=store_id", [{ store_id: storeId, username, password }], "resolution=merge-duplicates,return=minimal");
    return res.status(200).json({ ok: !!w.ok });
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
    let authed = adminOk({ headers: req.headers, query: pq });
    if (!authed) authed = merchantOk(req, storeId);
    if (!authed) authed = await verifySupabaseStoreOwner(req, storeId);
    if (!authed) {
      const existing = await sbGet(`stores?id=eq.${storeId}&select=id&limit=1`);
      if (!existing || !existing.length) {
        const token = String(req.headers["x-sb-token"] || "").trim();
        if (token) { const u = await goTrueUser(token); authed = !!(u && u.id); }
      }
    }
    if (!authed) return res.status(403).json({ error: "unauthorized" });
    const r = await sbWrite("POST", "stores?on_conflict=id", row, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
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
    if (!adminOk({ headers: req.headers, query: pq })) return res.status(403).json({ error: "unauthorized" });

    if (pq.action === "login") return res.status(200).json({ ok: true, token: signAdminToken() });

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

  // Fraud/mispricing detection (alert-only, never blocks): order totals are
  // fully client-computed (checkout writes straight to Supabase with the anon
  // key), so a tampered client could submit any total. Re-price the order's
  // line items from the real, current products table server-side and flag the
  // admin copy below if the submitted total looks implausibly low — an admin
  // can then hold/cancel the order before it's prepared. This uses each real
  // product's base price as a floor (variant/addon surcharges aren't modeled,
  // so it only ever under-flags, never false-flags a legitimately priced order).
  const priceFlag = await checkOrderPriceSanity(order);

  // Authoritative store contact + name from the DB — never trust the client for
  // WHERE messages go.
  const rows = await sbGet(`stores?id=eq.${encodeURIComponent(order.storeId)}&select=name,phone,whatsapp&limit=1`);
  const store = rows && rows[0];
  const storeName = (store && store.name) || "متجرك";

  // Browser push to the store + admins — independent of WhatsApp, so it works
  // even while the WhatsApp number is down. Fire before the WhatsApp gate below.
  let push = { skipped: true };
  try { push = await pushNewOrder(order); } catch (e) {}

  // In-dashboard notification bell (spec §19) — independent of push/WhatsApp.
  await notifyMerchant(order.storeId, "new_order", "طلب جديد 🛒",
    `طلب ${order.id} من ${order.customer || "عميل"} بقيمة ${money(order.total)}.`, "order", order.id);

  if (!c.token || !c.phoneId) {
    return res.status(200).json({ ok: true, order: order.id, push, whatsapp: { skipped: true, reason: "whatsapp not configured" } });
  }
  const storeTo = toE164(store && (store.whatsapp || store.phone), c.cc);
  const adminTos = c.adminPhones.map(p => toE164(p, c.cc)).filter(Boolean);
  const custTo = toE164(order.customerPhone, c.cc);
  const fulfillmentAr = order.fulfillment === "pickup" ? "استلام من المتجر" : "توصيل";
  const results = {};

  const storeAlertText = `🛒 طلب جديد على دكانجي\n\nرقم الطلب: ${order.id}\nالزبون: ${order.customer}\nهاتف الزبون: ${order.customerPhone}\nالإجمالي: ${money(order.total)}\nالاستلام: ${fulfillmentAr}`
    + (order.address ? `\nالعنوان: ${order.address}` : "")
    + (order.payment ? `\nالدفع: ${order.payment}` : "")
    + `\n\nالمنتجات:\n${itemsLine(order.lineItems) || "-"}\n\nافتح لوحة دكانجي لإدارة الطلب.`;
  const storeAlertParams = [String(order.id), order.customer, order.customerPhone, money(order.total), fulfillmentAr, itemsLine(order.lineItems) || "-"];

  // 1) Notify the STORE.
  if (storeTo) {
    results.store = await sendWhatsapp(c, storeTo, { template: c.tplStore, params: storeAlertParams, text: storeAlertText });
  } else {
    results.store = { skipped: true, reason: "store has no whatsapp/phone" };
  }

  // 2) Notify the PLATFORM ADMINS — always, independent of the store's own
  // number/delivery so an admin copy never depends on that store's contact
  // info being correct. Same approved template (no store-name placeholder
  // exists in it), so the store name is folded into the customer-name slot —
  // admins get every store's orders on their number and need to tell them apart.
  // Sent to each configured admin number in turn (never the platform's own
  // sending number — WhatsApp Cloud API can't deliver a message to itself).
  if (adminTos.length) {
    const flagNote = priceFlag
      ? `⚠️ تنبيه سعر مشبوه: الإجمالي المُرسَل (${money(priceFlag.total)}) أقل بكثير من السعر الفعلي للمنتجات (${money(priceFlag.expectedSubtotal)}). تحقّق قبل تجهيز الطلب.\n\n`
      : "";
    const adminText = flagNote + `🛒 [${storeName}] ` + storeAlertText;
    const adminParams = [...storeAlertParams];
    adminParams[1] = (priceFlag ? "⚠️ سعر مشبوه — " : "") + `${storeName} — ${order.customer}`;
    results.admin = [];
    for (const to of adminTos) {
      results.admin.push({ to, ...(await sendWhatsapp(c, to, { template: c.tplStore, params: adminParams, text: adminText })) });
    }
  } else {
    results.admin = { skipped: true, reason: "no admin phones configured" };
  }

  // 3) Acknowledge to the CUSTOMER.
  if (custTo) {
    const text = `✅ تم استلام طلبك على دكانجي\n\nرقم الطلب: ${order.id}\nالمتجر: ${storeName}\nالإجمالي: ${money(order.total)}\n\nسنعلمك فور تأكيد المتجر لطلبك. شكراً لاستخدامك دكانجي 🛍️`;
    const params = [String(order.id), storeName, money(order.total)];
    results.customer = await sendWhatsapp(c, custTo, { template: c.tplCustomer, params, text });
  } else {
    results.customer = { skipped: true, reason: "no customer phone" };
  }

  // Record which recipients actually got a copy — otherwise a silent send
  // failure (bad number, Meta rate-limit, template rejected) leaves no trace
  // anywhere and looks identical to "it worked".
  try {
    const adminOk = Array.isArray(results.admin) ? results.admin.every(r => r.ok) : !!(results.admin && results.admin.ok);
    await logAudit(order.storeId, "system", "order_notify", "order", order.id, null, {
      store: !!(results.store && results.store.ok), admin: adminOk, customer: !!(results.customer && results.customer.ok)
    });
  } catch (e) {}

  return res.status(200).json({ ok: true, order: order.id, results, push });
};

// Set AFTER the handler assignment above so it is not overwritten. Disables the
// automatic body parser so we can verify webhook/hook signatures on raw bytes.
module.exports.config = { api: { bodyParser: false } };
