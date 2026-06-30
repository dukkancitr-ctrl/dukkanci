// Internal first-party tracking sink + Meta Conversions API forwarder.
//
// Phase 1: stores visitor/event/consent rows in Supabase via the service-role key
// (tracking_* tables are RLS deny-all). Consent-aware — "necessary" events always
// stored; analytics-only events stored only with analytics consent.
//
// Phase 2: when the visitor granted MARKETING consent, forwards key events to the
// Meta Conversions API (server-side) using the SAME event_id the browser pixel used,
// so Meta deduplicates the two. Adds fbp/fbc + hashed advanced-matching (phone,
// external_id). Every dispatch is logged to marketing_event_logs.
//
// Secrets: Meta config is read from env first (META_PIXEL_ID / META_CONVERSIONS_API_TOKEN
// / META_API_VERSION / META_TEST_EVENT_CODE), falling back to integration_settings in
// the DB so it keeps working before the env migration. Tokens NEVER reach the browser.
// No raw PII is stored: IP is one-way hashed locally; phone/external_id are hashed
// before they leave for Meta; nothing personal is persisted in our tables.
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

function clientIp(req) {
  const xff = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xff || (req.socket && req.socket.remoteAddress) || "";
}
function sha256(v) { return crypto.createHash("sha256").update(v).digest("hex"); }
function ipHash(ip) { return ip ? sha256(ip + (process.env.IP_HASH_SALT || "dukkanci-tracking")) : null; }
function s(v, max) { return v == null ? null : String(v).slice(0, max || 300); }
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// event_id stores in a uuid column; coerce anything non-uuid to a fresh one so a
// malformed id can never silently drop the row.
function safeEventId(v) { return (typeof v === "string" && UUID_RE.test(v)) ? v : crypto.randomUUID(); }

// Hash for Meta advanced matching: normalize (trim+lowercase), then SHA-256.
function hashNorm(v) { if (!v) return null; return sha256(String(v).trim().toLowerCase()); }
// Turkish phone → 90XXXXXXXXXX (no +, no leading local 0), then hash.
function hashPhone(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("90")) { /* ok */ }
  else if (d.startsWith("0")) d = "90" + d.slice(1);
  else if (d.length === 10) d = "90" + d;
  if (d.length < 11) return null;
  return sha256(d);
}

async function sb(method, path, body, serviceKey, supabaseUrl, prefer) {
  const headers = { "Content-Type": "application/json", "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` };
  if (prefer) headers["Prefer"] = prefer;
  return fetch(`${supabaseUrl}/rest/v1/${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
}

// ga4 event_name → Meta event name (only events worth sending to Meta)
const META_EVENT = {
  purchase: "Purchase",
  begin_checkout: "InitiateCheckout",
  add_to_cart: "AddToCart",
  view_item: "ViewContent",
  view_store: "ViewContent",
  submit_phone: "Lead",
  whatsapp_click: "Contact"
};

// Resolve Meta config from env, falling back to integration_settings in the DB.
let _metaCfgCache = null;
async function metaConfig(serviceKey, supabaseUrl) {
  let pixel = (process.env.META_PIXEL_ID || "").trim();
  let token = (process.env.META_CONVERSIONS_API_TOKEN || "").trim();
  let test = (process.env.META_TEST_EVENT_CODE || "").trim();
  const ver = (process.env.META_API_VERSION || "v21.0").trim();
  if ((!pixel || !token) && serviceKey) {
    if (!_metaCfgCache) {
      try {
        const r = await sb("GET", "integration_settings?select=setting_key,setting_value,is_enabled&setting_key=in.(meta_pixel_id,meta_capi_token,meta_test_event_code)", null, serviceKey, supabaseUrl);
        if (r.ok) {
          const rows = await r.json(); const m = {};
          rows.forEach(x => { m[x.setting_key] = x.is_enabled ? (x.setting_value || "") : ""; });
          _metaCfgCache = m;
        } else { _metaCfgCache = {}; }
      } catch (e) { _metaCfgCache = {}; }
    }
    pixel = pixel || _metaCfgCache.meta_pixel_id || "";
    token = token || _metaCfgCache.meta_capi_token || "";
    test = test || _metaCfgCache.meta_test_event_code || "";
  }
  return { pixel, token, test, ver };
}

async function sendMetaCapi(body, ga4Name, rawIp, ua, serviceKey, supabaseUrl) {
  const metaName = META_EVENT[ga4Name];
  if (!metaName) return;
  const cfg = await metaConfig(serviceKey, supabaseUrl);
  if (!cfg.pixel || !cfg.token) return; // not configured → skip silently

  const userData = {};
  if (rawIp) userData.client_ip_address = rawIp;
  if (ua) userData.client_user_agent = ua;
  if (body.fbp) userData.fbp = s(body.fbp, 200);
  if (body.fbc) userData.fbc = s(body.fbc, 400);
  const ph = hashPhone(body.phone); if (ph) userData.ph = [ph];
  const ext = body.customer_id ? hashNorm(body.customer_id) : null; if (ext) userData.external_id = [ext];

  const contentIds = Array.isArray(body.content_ids) ? body.content_ids.map(x => String(x)).slice(0, 100) : undefined;
  const customData = { currency: s(body.currency, 8) || "TRY" };
  if (body.value != null) customData.value = num(body.value);
  if (contentIds) { customData.content_ids = contentIds; customData.content_type = "product"; }
  if (body.num_items != null) customData.num_items = num(body.num_items);

  const evt = {
    event_name: metaName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: s(body.event_id, 100),                 // ← same id the browser pixel used → dedup
    action_source: "website",
    event_source_url: s(body.page_url, 500) || undefined,
    user_data: userData,
    custom_data: customData
  };
  const payload = { data: [evt] };
  if (cfg.test) payload.test_event_code = cfg.test;

  let status = "error", responseText = "";
  try {
    const r = await fetch(`https://graph.facebook.com/${cfg.ver}/${cfg.pixel}/events?access_token=${encodeURIComponent(cfg.token)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
    });
    responseText = await r.text();
    status = r.ok ? "sent" : "failed";
  } catch (e) { responseText = String(e && e.message || e); }

  // log the dispatch (redact the access_token from the stored payload)
  try {
    let parsed = null; try { parsed = JSON.parse(responseText); } catch (e) {}
    await sb("POST", "marketing_event_logs", [{
      event_id: s(body.event_id, 100), event_name: metaName, destination: "meta_capi_server",
      payload_json: payload, response_json: parsed || { raw: responseText.slice(0, 800) },
      status, error_message: status === "sent" ? null : responseText.slice(0, 500)
    }], serviceKey, supabaseUrl);
  } catch (e) {}
}

// ga4 event_name → TikTok event name. Mirrors what the browser ttq.track sends
// (integrations.js) so TikTok deduplicates browser+server by event_id.
const TIKTOK_EVENT = {
  purchase: "CompletePayment",
  begin_checkout: "InitiateCheckout",
  add_to_cart: "AddToCart",
  view_item: "ViewContent",
  view_store: "ViewContent",
  submit_phone: "Lead",
  whatsapp_click: "Contact"
};

let _ttCfgCache = null;
async function tiktokConfig(serviceKey, supabaseUrl) {
  let pixel = (process.env.TIKTOK_PIXEL_ID || "").trim();
  let token = (process.env.TIKTOK_EVENTS_API_TOKEN || "").trim();
  let test = (process.env.TIKTOK_TEST_EVENT_CODE || "").trim();
  if ((!pixel || !token) && serviceKey) {
    if (!_ttCfgCache) {
      try {
        const r = await sb("GET", "integration_settings?select=setting_key,setting_value,is_enabled&setting_key=in.(tiktok_pixel_id,tiktok_events_token,tiktok_test_event_code)", null, serviceKey, supabaseUrl);
        if (r.ok) { const rows = await r.json(); const m = {}; rows.forEach(x => { m[x.setting_key] = x.is_enabled ? (x.setting_value || "") : ""; }); _ttCfgCache = m; }
        else { _ttCfgCache = {}; }
      } catch (e) { _ttCfgCache = {}; }
    }
    pixel = pixel || _ttCfgCache.tiktok_pixel_id || "";
    token = token || _ttCfgCache.tiktok_events_token || "";
    test = test || _ttCfgCache.tiktok_test_event_code || "";
  }
  return { pixel, token, test };
}

async function sendTiktokEvents(body, ga4Name, rawIp, ua, serviceKey, supabaseUrl) {
  const ttName = TIKTOK_EVENT[ga4Name];
  if (!ttName) return;
  const cfg = await tiktokConfig(serviceKey, supabaseUrl);
  if (!cfg.pixel || !cfg.token) return;

  const user = {};
  const ph = hashPhone(body.phone); if (ph) user.phone = [ph];
  const ext = body.customer_id ? hashNorm(body.customer_id) : null; if (ext) user.external_id = [ext];
  if (body.ttclid) user.ttclid = s(body.ttclid, 400);
  if (rawIp) user.ip = rawIp;
  if (ua) user.user_agent = ua;

  const contents = Array.isArray(body.content_ids)
    ? body.content_ids.map(x => ({ content_id: String(x), content_type: "product" })).slice(0, 100) : undefined;
  const properties = { currency: s(body.currency, 8) || "TRY" };
  if (body.value != null) properties.value = num(body.value);
  if (contents) { properties.contents = contents; properties.content_type = "product"; }

  const payload = {
    event_source: "web",
    event_source_id: cfg.pixel,
    data: [{
      event: ttName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: s(body.event_id, 100),              // ← same id as the TikTok pixel → dedup
      user,
      page: { url: s(body.page_url, 500) || undefined },
      properties
    }]
  };
  if (cfg.test) payload.test_event_code = cfg.test;

  let status = "error", responseText = "";
  try {
    const r = await fetch("https://business-api.tiktok.com/open_api/v1.3/event/track/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Access-Token": cfg.token },
      body: JSON.stringify(payload)
    });
    responseText = await r.text();
    let parsed = null; try { parsed = JSON.parse(responseText); } catch (e) {}
    status = (parsed && parsed.code === 0) ? "sent" : "failed";
  } catch (e) { responseText = String(e && e.message || e); }

  try {
    let parsed = null; try { parsed = JSON.parse(responseText); } catch (e) {}
    await sb("POST", "marketing_event_logs", [{
      event_id: s(body.event_id, 100), event_name: ttName, destination: "tiktok_events_api",
      payload_json: payload, response_json: parsed || { raw: responseText.slice(0, 800) },
      status, error_message: status === "sent" ? null : responseText.slice(0, 500)
    }], serviceKey, supabaseUrl);
  } catch (e) {}
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();
  if (!serviceKey) return res.status(200).json({ ok: false, reason: "not_configured" }); // fail-open

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad body" });

  const ua = s(req.headers["user-agent"], 400);
  const rawIp = clientIp(req);
  const iph = ipHash(rawIp);

  try {
    // ---- consent log ----
    if (body.type === "consent") {
      if (!body.dukkanci_uid) return res.status(400).json({ error: "uid required" });
      await sb("POST", "tracking_consents", [{
        dukkanci_uid: s(body.dukkanci_uid, 100),
        consent_version: s(body.consent_version, 20) || "unknown",
        necessary: true, functional: !!body.functional, analytics: !!body.analytics, marketing: !!body.marketing,
        source: s(body.source, 40), user_agent: ua, ip_hash: iph
      }], serviceKey, supabaseUrl);
      return res.status(200).json({ ok: true });
    }

    // ---- event ----
    if (!body.event_name || !body.dukkanci_uid) return res.status(400).json({ error: "event_name & uid required" });
    const consent = body.consent || {};
    const store = !!body.necessary || !!consent.analytics;
    if (!store && !consent.marketing) return res.status(200).json({ ok: true, skipped: "no_consent" });

    const uid = s(body.dukkanci_uid, 100);
    const traffic = body.traffic || {};
    const now = new Date().toISOString();

    if (store) {
      // visitor: insert-if-new (preserves first_*), then patch last_*.
      await sb("POST", "tracking_visitors", [{
        dukkanci_uid: uid, first_seen_at: now, last_seen_at: now,
        first_source: s(traffic.first_source, 120), last_source: s(traffic.last_source, 120),
        first_landing_page: s(body.page_url, 300), last_landing_page: s(body.page_url, 300),
        city: s(body.city, 80), language: s(body.language, 8), device_type: s(body.device_type, 20)
      }], serviceKey, supabaseUrl, "resolution=ignore-duplicates");

      await sb("PATCH", `tracking_visitors?dukkanci_uid=eq.${encodeURIComponent(uid)}`, {
        last_seen_at: now, last_source: s(traffic.last_source, 120), last_landing_page: s(body.page_url, 300),
        language: s(body.language, 8), device_type: s(body.device_type, 20), updated_at: now
      }, serviceKey, supabaseUrl);

      const evRes = await sb("POST", "tracking_events", [{
        event_id: safeEventId(body.event_id),
        dukkanci_uid: uid, customer_id: body.customer_id || null,
        event_name: s(body.event_name, 60), event_source: "web",
        store_id: num(body.store_id), product_id: num(body.product_id),
        cart_id: s(body.cart_id, 60), order_id: s(body.order_id, 60),
        value: num(body.value), currency: s(body.currency, 8) || "TRY",
        utm_source: s(traffic.utm_source, 120), utm_medium: s(traffic.utm_medium, 120),
        utm_campaign: s(traffic.utm_campaign, 160), utm_content: s(traffic.utm_content, 160),
        page_url: s(body.page_url, 500), referrer: s(body.referrer, 300),
        user_agent: ua, ip_hash: iph,
        consent_marketing: !!consent.marketing, consent_analytics: !!consent.analytics
      }], serviceKey, supabaseUrl);
      if (!evRes.ok) {
        const txt = await evRes.text().catch(() => "");
        try { console.warn("[track] event insert failed:", evRes.status, txt.slice(0, 300)); } catch (e) {}
      }
    }

    // ---- Ad-platform server-side events (marketing consent only) ----
    if (consent.marketing) {
      const evName = s(body.event_name, 60);
      await Promise.all([
        sendMetaCapi(body, evName, rawIp, ua, serviceKey, supabaseUrl),
        sendTiktokEvents(body, evName, rawIp, ua, serviceKey, supabaseUrl)
      ]);
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message || e) }); // fail-open
  }
};
