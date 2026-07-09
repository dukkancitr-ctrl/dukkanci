// Saves integration settings (GA4, Meta Pixel, TikTok…) to Supabase using the
// service-role key so RLS doesn't block writes. Protected by ADMIN_PASSWORD.
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();

  // verify admin password header
  const authHeader = (req.headers["x-admin-password"] || "").trim();
  const a = Buffer.from(authHeader);
  const b = Buffer.from(adminPassword);
  if (!adminPassword || a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
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
