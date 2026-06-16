// Notifies Google's Indexing API that a URL was updated. POST { url, type? }.
// Auth: a service account (GOOGLE_INDEXING_CLIENT_EMAIL / GOOGLE_INDEXING_PRIVATE_KEY)
// signed into a short-lived JWT with Node's built-in crypto — no dependencies.
// No-ops gracefully (200 skipped) when credentials aren't configured.
// NOTE: Google officially honours the Indexing API for JobPosting/BroadcastEvent
// pages; for general pages, the sitemaps are the primary signal. Daily quota ~200.
const crypto = require("crypto");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");

const b64url = buf => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Vercel env values for PEM keys are a footgun: they may be wrapped in quotes,
// single-escaped (\n) or double-escaped (\\n). Normalize all of these to a real
// PEM with newlines.
function normalizePrivateKey(raw) {
  let k = (raw || "").trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  return k.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
}

async function getAccessToken(clientEmail, privateKey) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: clientEmail,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(privateKey).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const assertion = `${header}.${claim}.${signature}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  if (!r.ok) throw new Error(`token ${r.status}: ${await r.text()}`);
  return (await r.json()).access_token;
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  // Temporary, secret-safe diagnostic: reports only PRESENCE/shape of env vars
  // (never their values) to debug configuration. Remove after verification.
  if (req.method === "GET" && req.query && req.query.debug) {
    const k = process.env.GOOGLE_INDEXING_PRIVATE_KEY || "";
    let keyParseable = false, keyParseError = null;
    try { crypto.createPrivateKey(normalizePrivateKey(k)); keyParseable = true; }
    catch (e) { keyParseError = e.message; }
    return res.status(200).json({
      hasEmail: !!process.env.GOOGLE_INDEXING_CLIENT_EMAIL,
      hasKey: !!k,
      keyLength: k.length,
      keyHasHeader: k.includes("BEGIN PRIVATE KEY"),
      keyHasEscapedNewlines: k.includes("\\n"),
      keyParseable,
      keyParseError,
      hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
      // Non-secret Vercel system info: which project/commit is actually live here.
      vercelEnv: process.env.VERCEL_ENV || null,
      gitRepo: process.env.VERCEL_GIT_REPO_SLUG || null,
      gitOwner: process.env.VERCEL_GIT_REPO_OWNER || null,
      commit: (process.env.VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || null
    });
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
  let url = body.url;
  const type = body.type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";
  // Only allow URLs on our own site.
  if (!url || typeof url !== "string" || !url.startsWith(SITE + "/")) {
    return res.status(400).json({ error: "يلزم إرسال رابط صحيح ضمن الموقع." });
  }

  const clientEmail = process.env.GOOGLE_INDEXING_CLIENT_EMAIL;
  const privateKey = normalizePrivateKey(process.env.GOOGLE_INDEXING_PRIVATE_KEY);
  if (!clientEmail || !privateKey) {
    return res.status(200).json({ skipped: true, reason: "indexing credentials not configured" });
  }

  try {
    const token = await getAccessToken(clientEmail, privateKey);
    const r = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, type })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return res.status(r.status).json({ error: "indexing publish failed", detail: data });
    return res.status(200).json({ ok: true, url, type, result: data });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
