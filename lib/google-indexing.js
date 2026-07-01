// Shared Google Indexing API helper — the SAME mechanism api/notify-google.js uses,
// factored into a library so the synonyms tab (api/ai.js) can push many product URLs
// in a batch without re-minting a JWT per URL. No dependencies (Node crypto only).
//
// Auth: a Google service account with the Indexing API enabled, provided via env:
//   GOOGLE_INDEXING_CLIENT_EMAIL  — the service-account email
//   GOOGLE_INDEXING_PRIVATE_KEY   — its PEM private key (any newline escaping)
// When those aren't set, isConfigured() is false and publishUrl() no-ops.
//
// NOTE: Google officially honours the Indexing API for JobPosting/BroadcastEvent
// pages; for general pages the sitemap is the primary signal and this is a nudge.
// Daily quota is ~200 URLs — callers must batch accordingly.
const crypto = require("crypto");

const b64url = buf => Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Vercel env values for PEM keys may be quoted, single-escaped (\n) or double-escaped
// (\\n). Normalize all of these to a real PEM with newlines.
function normalizePrivateKey(raw) {
  let k = (raw || "").trim();
  if ((k.startsWith('"') && k.endsWith('"')) || (k.startsWith("'") && k.endsWith("'"))) k = k.slice(1, -1);
  return k.replace(/\\\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r\n/g, "\n").trim();
}

function clientEmail() { return (process.env.GOOGLE_INDEXING_CLIENT_EMAIL || "").trim(); }
function privateKey() { return normalizePrivateKey(process.env.GOOGLE_INDEXING_PRIVATE_KEY); }
function isConfigured() { return !!(clientEmail() && privateKey()); }

// Cache the OAuth token across calls within a warm invocation (batch pushes).
let _token = null;
let _tokenExp = 0;

async function getAccessToken() {
  if (_token && Date.now() < _tokenExp - 60000) return _token;
  const email = clientEmail(), key = privateKey();
  if (!email || !key) throw new Error("indexing credentials not configured");
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${claim}`);
  const signature = signer.sign(key).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const assertion = `${header}.${claim}.${signature}`;

  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion })
  });
  if (!r.ok) throw new Error(`token ${r.status}: ${await r.text()}`);
  const data = await r.json();
  _token = data.access_token;
  _tokenExp = now * 1000 + 3600 * 1000;
  return _token;
}

// Publish a single URL update/deletion to Google's Indexing API.
// Returns { ok } on success, { skipped } when unconfigured, { error } on failure.
async function publishUrl(url, type = "URL_UPDATED") {
  if (!isConfigured()) return { skipped: true, reason: "not configured" };
  const t = type === "URL_DELETED" ? "URL_DELETED" : "URL_UPDATED";
  try {
    const token = await getAccessToken();
    const r = await fetch("https://indexing.googleapis.com/v3/urlNotifications:publish", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, type: t })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, error: data };
    return { ok: true, result: data };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { isConfigured, publishUrl, getAccessToken, normalizePrivateKey };
