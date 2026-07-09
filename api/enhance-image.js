// POST /api/enhance-image  (merchant or admin only)
// Sends an existing product image to OpenAI image-edit API for professional enhancement.
// Body: { imageData?: string (base64 data-URL), imageUrl?: string, name?: string }
// Returns: { url: string } or { error: string }
//
// Auth: this calls a paid OpenAI endpoint, so it must not be reachable anonymously.
// Accepts any ONE of: a signed x-admin-token/x-merchant-token (same HMAC session
// scheme as api/notify-order.js — store-agnostic here since nothing is written),
// the raw x-admin-key === ADMIN_PASSWORD (cron/admin), or an x-sb-token that
// resolves to a real logged-in Supabase user (Google/email merchant session).
const crypto = require("crypto");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const env = k => (process.env[k] || "").trim();

function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }
function verifySignedSession(token) {
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
  const m = /exp=(\d+)/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}
async function hasSupabaseSession(req) {
  const token = String(req.headers["x-sb-token"] || "").trim();
  if (!token) return false;
  try {
    const r = await fetch(`${PUB_URL}/auth/v1/user`, {
      headers: { apikey: env("SUPABASE_ANON_KEY"), Authorization: `Bearer ${token}` }
    });
    if (!r.ok) return false;
    const user = await r.json().catch(() => null);
    return !!(user && user.id);
  } catch (e) { return false; }
}
async function sessionOk(req) {
  const tok = req.headers["x-admin-token"] || req.headers["x-merchant-token"] || "";
  if (tok && verifySignedSession(tok)) return true;
  const pw = env("ADMIN_PASSWORD");
  const rawKey = req.headers["x-admin-key"] || "";
  if (pw && rawKey) {
    const a = Buffer.from(String(rawKey));
    const b = Buffer.from(pw);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return true;
  }
  return hasSupabaseSession(req);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!(await sessionOk(req))) return res.status(401).json({ error: "unauthorized" });

  const key = process.env.OPENAI_API_KEY;
  if (!key) return res.status(503).json({ error: "OpenAI key not configured" });

  const { imageData, imageUrl, name } = req.body || {};
  if (!imageData && !imageUrl) return res.status(400).json({ error: "imageData or imageUrl required" });

  let imgBuffer, mimeType = "image/jpeg";

  try {
    if (imageData) {
      const match = imageData.match(/^data:([^;]+);base64,(.+)$/s);
      if (!match) return res.status(400).json({ error: "Invalid image data" });
      mimeType = match[1] || "image/jpeg";
      imgBuffer = Buffer.from(match[2], "base64");
    } else {
      const r = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) return res.status(400).json({ error: "Could not fetch image" });
      imgBuffer = Buffer.from(await r.arrayBuffer());
      mimeType = (r.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    }
  } catch (e) {
    return res.status(400).json({ error: "Failed to load image: " + e.message });
  }

  const prompt = `Professionally enhance this product photo for an e-commerce marketplace: remove the background and replace with a clean pure-white background, improve lighting, sharpen details, make it look crisp and commercial-grade.${name ? ` The product is: ${name}.` : ""} Do not add text, logos, or people.`;

  try {
    const form = new FormData();
    form.append("model", "gpt-image-1");
    form.append("prompt", prompt);
    form.append("n", "1");
    form.append("size", "1024x1024");
    form.append("image", new Blob([imgBuffer], { type: mimeType }), "product.png");

    const r = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}` },
      body: form,
      signal: AbortSignal.timeout(60000)
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) return res.status(502).json({ error: data?.error?.message || "OpenAI error" });

    const url = data.data?.[0]?.url;
    const b64 = data.data?.[0]?.b64_json;
    if (url) return res.status(200).json({ url });
    if (b64) return res.status(200).json({ url: `data:image/png;base64,${b64}` });
    return res.status(502).json({ error: "No image in OpenAI response" });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
