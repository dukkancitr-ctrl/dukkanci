// AI Management admin API — provider/key registry + per-feature config + test.
// Powers the "الذكاء الاصطناعي" admin tab. Admin-gated (same session token as the
// rest of the panel). All DB access uses the service-role key inside the gateway
// library, so the anon client can never read API keys. API keys are returned to
// the UI MASKED (last 4 chars only) and never in full.
const crypto = require("crypto");
const gw = require("../lib/ai-gateway");

const env = k => (process.env[k] || "").trim();

// ── Admin auth (mirrors api/notify-order.js so the same login token works) ──
function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }
function verifyAdminToken(token) {
  const secret = adminSecret();
  if (!secret) return false;
  const parts = String(token || "").split(".");
  if (parts.length !== 2) return false;
  let payload;
  try { payload = Buffer.from(parts[0], "base64url").toString("utf8"); } catch (e) { return false; }
  const expect = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(parts[1]), b = Buffer.from(expect);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;
  const m = /^exp=(\d+)$/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}
function adminPasswordOk(req) {
  const expected = env("ADMIN_PASSWORD");
  if (!expected) return false;
  const got = (req.headers && req.headers["x-admin-key"]) || "";
  if (!got) return false;
  const a = Buffer.from(String(got)), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function adminOk(req) {
  return verifyAdminToken(req.headers && req.headers["x-admin-token"]) || adminPasswordOk(req);
}

const FEATURES = ["whatsapp_autoreply", "image_enhancement", "synonym_generation", "embeddings"];

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  let q = {};
  try { q = require("url").parse(req.url || "", true).query || {}; } catch (e) { q = req.query || {}; }
  const action = q.action || "";

  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  // ── Reads (GET) ──────────────────────────────────────────────────────────
  if (req.method === "GET") {
    if (action === "overview") {
      const providers = (await gw.sbGet("ai_providers?select=id,provider_name,label,service_type,key_hint,default_model,is_active,created_at&order=created_at.asc")) || [];
      const features = (await gw.sbGet("ai_feature_config?select=feature_name,provider_id,model_override,is_enabled,settings")) || [];
      // Usage totals for the last 30 days, grouped per feature.
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const usageRows = (await gw.sbGet(`ai_usage_log?created_at=gte.${encodeURIComponent(since)}&select=feature,units,est_cost,ok&limit=10000`)) || [];
      const usage = {};
      for (const u of usageRows) {
        const f = u.feature || "?";
        if (!usage[f]) usage[f] = { calls: 0, tokens: 0, cost: 0, errors: 0 };
        usage[f].calls += 1;
        usage[f].tokens += Number(u.units || 0);
        usage[f].cost += Number(u.est_cost || 0);
        if (u.ok === false) usage[f].errors += 1;
      }
      const hasEnc = !!(env("KEY_ENCRYPTION_SECRET") || env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"));
      return res.status(200).json({ providers, features, usage, hasEncryptionSecret: hasEnc });
    }
    return res.status(400).json({ error: "unknown action" });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = (req.body && typeof req.body === "object") ? req.body : {};

  // ── Save / update a provider (encrypts the key) ────────────────────────────
  if (action === "save-provider") {
    const provider_name = String(body.provider_name || "").trim().toLowerCase();
    if (!["openai", "anthropic", "google", "replicate"].includes(provider_name)) {
      return res.status(400).json({ error: "invalid provider_name" });
    }
    const row = {
      provider_name,
      label: (body.label || "").trim() || null,
      service_type: ["text", "image", "embedding", "both"].includes(body.service_type) ? body.service_type : "text",
      default_model: (body.default_model || "").trim() || null,
      is_active: body.is_active !== false,
      updated_at: new Date().toISOString()
    };
    // Encrypt the key only when a new one is supplied (editing without re-typing
    // the key keeps the stored one).
    const rawKey = String(body.api_key || "").trim();
    if (rawKey) {
      try { row.api_key_encrypted = gw.encryptKey(rawKey); }
      catch (e) { return res.status(503).json({ error: "encryption unavailable: " + e.message }); }
      row.key_hint = gw.maskKey(rawKey);
    }

    if (body.id) {
      if (!row.api_key_encrypted) { delete row.api_key_encrypted; delete row.key_hint; }
      const r = await gw.sbWrite("PATCH", `ai_providers?id=eq.${encodeURIComponent(body.id)}`, row, "return=minimal");
      if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
      return res.status(200).json({ ok: true });
    }
    if (!row.api_key_encrypted) return res.status(400).json({ error: "api_key required" });
    const r = await gw.sbWrite("POST", "ai_providers", row, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Delete a provider ──────────────────────────────────────────────────────
  if (action === "delete-provider") {
    if (!body.id) return res.status(400).json({ error: "id required" });
    const r = await gw.sbWrite("DELETE", `ai_providers?id=eq.${encodeURIComponent(body.id)}`, {}, "return=minimal");
    if (!r.ok) return res.status(502).json({ error: "delete failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Bind a feature to a provider / model, toggle on-off ────────────────────
  if (action === "set-feature") {
    const feature_name = String(body.feature_name || "").trim();
    if (!FEATURES.includes(feature_name)) return res.status(400).json({ error: "invalid feature_name" });
    const row = {
      feature_name,
      provider_id: body.provider_id || null,
      model_override: (body.model_override || "").trim() || null,
      is_enabled: body.is_enabled !== false,
      updated_at: new Date().toISOString()
    };
    const r = await gw.sbWrite("POST", "ai_feature_config?on_conflict=feature_name", row, "resolution=merge-duplicates,return=minimal");
    if (!r.ok) return res.status(502).json({ error: "save failed", detail: r.rows || r.error });
    return res.status(200).json({ ok: true });
  }

  // ── Test a feature end-to-end through the gateway ──────────────────────────
  if (action === "test") {
    const feature = String(body.feature || "whatsapp_autoreply");
    const text = String(body.text || "مرحبا").slice(0, 500);
    const reply = await gw.complete(feature, {
      system: "أنت مساعد اختبار. ردّ بإيجاز بنفس لغة الرسالة.",
      messages: [{ role: "user", content: text }],
      maxTokens: 300,
      timeoutMs: 15000
    });
    if (reply == null) return res.status(200).json({ ok: false, reply: null, note: "no reply — provider not configured or call failed" });
    return res.status(200).json({ ok: true, reply });
  }

  return res.status(400).json({ error: "unknown action" });
};
