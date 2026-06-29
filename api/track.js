// Internal first-party tracking sink (Phase 1).
// Stores visitor/event/consent rows in Supabase using the service-role key (the
// tracking_* tables are RLS deny-all, so only the server can write). Consent-aware:
//  • events flagged "necessary" (purchase/cart/checkout/lead) are always stored
//    because they're part of running the platform;
//  • analytics-only events are stored ONLY when the visitor granted analytics.
// Marketing dispatch (Meta CAPI / TikTok Events API) is Phase 2 — not done here.
// No raw PII is ever stored: IP is one-way hashed; no phone/email/name.
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

function clientIp(req) {
  const xff = (req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return xff || req.socket?.remoteAddress || "";
}
function ipHash(ip) {
  if (!ip) return null;
  const salt = process.env.IP_HASH_SALT || "dukkanci-tracking";
  return crypto.createHash("sha256").update(ip + salt).digest("hex");
}
function s(v, max) { return v == null ? null : String(v).slice(0, max || 300); }
function num(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }

async function sb(method, path, body, serviceKey, supabaseUrl, prefer) {
  const headers = {
    "Content-Type": "application/json",
    "apikey": serviceKey,
    "Authorization": `Bearer ${serviceKey}`
  };
  if (prefer) headers["Prefer"] = prefer;
  return fetch(`${supabaseUrl}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();
  if (!serviceKey) return res.status(200).json({ ok: false, reason: "not_configured" }); // fail-open: never break the page

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== "object") return res.status(400).json({ error: "bad body" });

  const ua = s(req.headers["user-agent"], 400);
  const iph = ipHash(clientIp(req));

  try {
    // ---- consent log ----
    if (body.type === "consent") {
      if (!body.dukkanci_uid) return res.status(400).json({ error: "uid required" });
      await sb("POST", "tracking_consents", [{
        dukkanci_uid: s(body.dukkanci_uid, 100),
        consent_version: s(body.consent_version, 20) || "unknown",
        necessary: true,
        functional: !!body.functional,
        analytics: !!body.analytics,
        marketing: !!body.marketing,
        source: s(body.source, 40),
        user_agent: ua,
        ip_hash: iph
      }], serviceKey, supabaseUrl);
      return res.status(200).json({ ok: true });
    }

    // ---- event ----
    if (!body.event_name || !body.dukkanci_uid) return res.status(400).json({ error: "event_name & uid required" });
    const consent = body.consent || {};
    const store = !!body.necessary || !!consent.analytics;
    if (!store) return res.status(200).json({ ok: true, skipped: "no_analytics_consent" });

    const uid = s(body.dukkanci_uid, 100);
    const traffic = body.traffic || {};
    const now = new Date().toISOString();

    // visitor: insert-if-new (preserves first_*), then patch last_*.
    await sb("POST", "tracking_visitors", [{
      dukkanci_uid: uid,
      first_seen_at: now, last_seen_at: now,
      first_source: s(traffic.first_source, 120), last_source: s(traffic.last_source, 120),
      first_landing_page: s(body.page_url, 300), last_landing_page: s(body.page_url, 300),
      city: s(body.city, 80), language: s(body.language, 8), device_type: s(body.device_type, 20)
    }], serviceKey, supabaseUrl, "resolution=ignore-duplicates");

    await sb("PATCH", `tracking_visitors?dukkanci_uid=eq.${encodeURIComponent(uid)}`, {
      last_seen_at: now,
      last_source: s(traffic.last_source, 120),
      last_landing_page: s(body.page_url, 300),
      language: s(body.language, 8), device_type: s(body.device_type, 20),
      updated_at: now
    }, serviceKey, supabaseUrl);

    // event row
    const r = await sb("POST", "tracking_events", [{
      event_id: s(body.event_id, 60) || crypto.randomUUID(),
      dukkanci_uid: uid,
      customer_id: body.customer_id || null,
      event_name: s(body.event_name, 60),
      event_source: "web",
      store_id: num(body.store_id),
      product_id: num(body.product_id),
      cart_id: s(body.cart_id, 60),
      order_id: s(body.order_id, 60),
      value: num(body.value),
      currency: s(body.currency, 8) || "TRY",
      utm_source: s(traffic.utm_source, 120), utm_medium: s(traffic.utm_medium, 120),
      utm_campaign: s(traffic.utm_campaign, 160), utm_content: s(traffic.utm_content, 160),
      page_url: s(body.page_url, 500), referrer: s(body.referrer, 300),
      user_agent: ua, ip_hash: iph,
      consent_marketing: !!consent.marketing, consent_analytics: !!consent.analytics
    }], serviceKey, supabaseUrl);

    if (!r.ok) {
      const text = await r.text();
      return res.status(200).json({ ok: false, error: text }); // fail-open
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e && e.message || e) });
  }
};
