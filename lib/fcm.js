// FCM sender (Firebase Cloud Messaging HTTP v1) — Android/iOS tray notifications.
//
// Built on Node's crypto only, no dependency, matching lib/webpush.js and the
// rest of the serverless layer. Firebase's own Admin SDK would pull in a large
// dependency tree for what is, underneath, a signed JWT and one POST.
//
// ── Why HTTP v1 and not the legacy endpoint ──────────────────────────────────
// The legacy `fcm.googleapis.com/fcm/send` server-key API is shut down. v1
// requires a real OAuth2 access token minted from a service account, which is
// why this needs credentials rather than a single key string.
//
// ── Configuration (all optional — absent means this module cleanly no-ops) ───
// Either:
//   FCM_SERVICE_ACCOUNT   the whole service-account JSON, as one env value
// or the three fields separately:
//   FCM_PROJECT_ID, FCM_CLIENT_EMAIL, FCM_PRIVATE_KEY
//
// Get them from: Firebase Console → Project settings → Service accounts →
// "Generate new private key". That downloads a JSON file; paste its contents
// into FCM_SERVICE_ACCOUNT, or copy the three fields out of it.
//
// ⚠ FCM_PRIVATE_KEY contains literal "\n" sequences when pasted into a shell or
// a Vercel env field. They are converted back to real newlines below — without
// that, the key fails to parse and every send dies with an opaque error.

const crypto = require("crypto");

const env = k => (process.env[k] || "").trim();

// Cached access token. FCM tokens last an hour; we refresh at 55 minutes so a
// long batch can never straddle an expiry mid-send.
let _token = null;
let _tokenExp = 0;

function credentials() {
  const raw = env("FCM_SERVICE_ACCOUNT");
  if (raw) {
    try {
      const j = JSON.parse(raw);
      if (j.project_id && j.client_email && j.private_key) {
        return { projectId: j.project_id, clientEmail: j.client_email, privateKey: j.private_key };
      }
    } catch (e) { /* fall through to the split form */ }
  }
  const projectId = env("FCM_PROJECT_ID");
  const clientEmail = env("FCM_CLIENT_EMAIL");
  const privateKey = env("FCM_PRIVATE_KEY");
  if (projectId && clientEmail && privateKey) return { projectId, clientEmail, privateKey };
  return null;
}

// Is FCM usable right now? Callers use this to report the channel as
// unconfigured rather than silently reporting a send that reached nobody.
function fcmConfigured() { return !!credentials(); }

function b64u(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Service-account JWT → OAuth2 access token.
async function accessToken() {
  if (_token && Date.now() < _tokenExp) return _token;
  const c = credentials();
  if (!c) return null;

  // Vercel/shell env values carry "\n" as two characters, not a newline.
  const pem = c.privateKey.replace(/\\n/g, "\n");
  const now = Math.floor(Date.now() / 1000);
  const header = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64u(JSON.stringify({
    iss: c.clientEmail,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  let sig;
  try {
    sig = b64u(crypto.sign("RSA-SHA256", Buffer.from(`${header}.${claim}`), pem));
  } catch (e) { return null; }

  try {
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: `${header}.${claim}.${sig}`
      })
    });
    if (!r.ok) return null;
    const j = await r.json().catch(() => null);
    if (!j || !j.access_token) return null;
    _token = j.access_token;
    _tokenExp = Date.now() + 55 * 60 * 1000;
    return _token;
  } catch (e) { return null; }
}

// Deliver one notification to one device token.
//
// Returns { ok, gone, reason }. gone=true means the token is permanently dead
// (app uninstalled, token rotated) and the caller should clear it — the same
// contract as sendOnePush in lib/webpush.js, so both channels prune alike.
async function sendOneFcm(token, { title, body, imageUrl, deepLink, tag }) {
  const c = credentials();
  if (!c) return { ok: false, reason: "fcm not configured" };
  const at = await accessToken();
  if (!at) return { ok: false, reason: "fcm auth failed" };

  const message = {
    token,
    // `notification` makes Android render it in the tray while the app is in
    // the background; `data` carries the deep link for the tap handler.
    notification: { title: title || "دكانجي", body: body || "", ...(imageUrl ? { image: imageUrl } : {}) },
    data: { deep_link: deepLink || "/", ...(tag ? { tag } : {}) },
    android: {
      priority: "high",
      notification: {
        // Collapses repeat notifications about the same order instead of
        // stacking one per status change.
        ...(tag ? { tag } : {}),
        channel_id: "dukkanci_orders"
      }
    },
    apns: { payload: { aps: { sound: "default" } } }
  };

  try {
    const r = await fetch(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(c.projectId)}/messages:send`, {
      method: "POST",
      headers: { Authorization: `Bearer ${at}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });
    if (r.ok) return { ok: true };
    const text = await r.text().catch(() => "");
    // UNREGISTERED / INVALID_ARGUMENT on the token field = dead token.
    const gone = /UNREGISTERED|NOT_FOUND|INVALID_ARGUMENT/i.test(text) || r.status === 404;
    // A 401 usually means the cached token went stale early; drop it so the
    // next call re-mints rather than failing the whole rest of the batch.
    if (r.status === 401) { _token = null; _tokenExp = 0; }
    return { ok: false, gone, status: r.status, reason: text.slice(0, 300) };
  } catch (e) { return { ok: false, reason: e.message }; }
}

module.exports = { fcmConfigured, sendOneFcm, accessToken };
