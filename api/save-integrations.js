// Saves integration settings (GA4, Meta Pixel, TikTok…) to Supabase using the
// service-role key so RLS doesn't block writes. Protected by ADMIN_PASSWORD.
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

// Same admin session-token scheme as api/notify-order.js (base64url("exp=<ms>") + "." + hmac).
function adminSecret() { return (process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "").trim(); }
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

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();

  // Admin gate: a signed session token (x-admin-token — what the dashboard holds
  // since the session-token migration) OR the raw password (x-admin-password,
  // kept for scripts). Before 2026-09-11 only the raw password was accepted, so
  // every save from the admin panel silently 401'd while the UI said "saved".
  const tok = (req.headers["x-admin-token"] || "").trim();
  const authHeader = (req.headers["x-admin-password"] || "").trim();
  const pwdOk = (() => {
    if (!adminPassword || !authHeader) return false;
    const a = Buffer.from(authHeader), b = Buffer.from(adminPassword);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  })();
  if (!(tok && verifyAdminToken(tok)) && !pwdOk) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (!serviceKey) return res.status(500).json({ error: "service key not configured" });

  const { rows } = req.body || {};
  if (!Array.isArray(rows) || !rows.length) return res.status(400).json({ error: "rows required" });

  const r = await fetch(`${supabaseUrl}/rest/v1/integration_settings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": serviceKey,
      "Authorization": `Bearer ${serviceKey}`,
      "Prefer": "resolution=merge-duplicates"
    },
    body: JSON.stringify(rows)
  });

  if (!r.ok) {
    const text = await r.text();
    return res.status(500).json({ error: text });
  }

  return res.status(200).json({ ok: true });
};
