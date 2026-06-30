// Admin-only marketing/tracking report. Reads the RLS-protected tracking_* tables
// via the service-role key and the tracking_report() SQL function. Gated by the same
// signed admin session token the rest of the admin panel uses (x-admin-token), with
// the typed password (x-admin-key) accepted as a fallback for the login session.
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";

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
function adminPasswordOk(req) {
  const expected = (process.env.ADMIN_PASSWORD || "").trim();
  if (!expected) return false;
  const got = String(req.headers["x-admin-key"] || "");
  if (!got) return false;
  const a = Buffer.from(got), b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function adminOk(req) { return verifyAdminToken(req.headers["x-admin-token"]) || adminPasswordOk(req); }

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const supabaseUrl = (process.env.SUPABASE_URL || PUB_URL).trim();
  if (!serviceKey) return res.status(500).json({ error: "service key not configured" });

  const q = req.query || {};
  const body = (req.method === "POST" && req.body && typeof req.body === "object") ? req.body : {};
  const from = body.from || q.from;
  const to = body.to || q.to;
  const store = body.store || q.store;

  // default: last 30 days
  const now = Date.now();
  const p_from = from ? new Date(from).toISOString() : new Date(now - 30 * 864e5).toISOString();
  const p_to = to ? new Date(to).toISOString() : new Date(now + 864e5).toISOString();
  const p_store = (store === undefined || store === null || store === "" || store === "all") ? null : Number(store);

  try {
    const r = await fetch(`${supabaseUrl}/rest/v1/rpc/tracking_report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": serviceKey, "Authorization": `Bearer ${serviceKey}` },
      body: JSON.stringify({ p_from, p_to, p_store: Number.isFinite(p_store) ? p_store : null })
    });
    if (!r.ok) { const t = await r.text(); return res.status(500).json({ error: t }); }
    const report = await r.json();
    return res.status(200).json({ ok: true, report });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
