// Web Push sender — RFC 8291 (aes128gcm payload encryption) + RFC 8292 (VAPID).
// Built on Node's crypto only, so it adds NO dependency (matching the rest of the
// serverless layer).
//
// ── Why this file exists ─────────────────────────────────────────────────────
// This logic already lives inside api/notify-order.js (functions b64uToBuf …
// pushToSubscriptions, ~line 550). It is duplicated here **on purpose** rather
// than imported from there:
//
//   notify-order.js is the order-critical path. It carries the documented
//   silent-order-loss history (CLAUDE.md, 2026-07-19: six orphan notifications,
//   three real customer orders lost) and is edited concurrently by other
//   sessions. Refactoring it — even a pure function move — inside a change whose
//   real subject is a new feature risks that path for no feature benefit.
//
// So: new code uses this module; notify-order.js keeps its own copy untouched.
// Collapsing the two is a worthwhile follow-up, but it belongs in its own
// isolated commit where a regression can only mean one thing.
//
// The duplication is low-risk in practice: this is frozen, standardised crypto
// (two RFCs), not business logic that drifts.

const crypto = require("crypto");

const env = k => (process.env[k] || "").trim();

function b64uToBuf(s) {
  s = String(s || "").replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64");
}

function bufToB64u(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Node KeyObject for the VAPID private key, built from the raw base64url values
// (32-byte d; x/y come from the 65-byte uncompressed public point).
function vapidPrivateKey() {
  const pub = b64uToBuf(env("VAPID_PUBLIC_KEY"));
  const d = b64uToBuf(env("VAPID_PRIVATE_KEY"));
  if (pub.length !== 65 || !d.length) return null;
  const jwk = {
    kty: "EC", crv: "P-256",
    x: bufToB64u(pub.slice(1, 33)),
    y: bufToB64u(pub.slice(33, 65)),
    d: bufToB64u(d)
  };
  try { return crypto.createPrivateKey({ key: jwk, format: "jwk" }); } catch (e) { return null; }
}

// Signed VAPID JWT (ES256) bound to the push service origin (`aud`).
function vapidJwt(audience) {
  const key = vapidPrivateKey();
  if (!key) return null;
  const header = bufToB64u(Buffer.from(JSON.stringify({ typ: "JWT", alg: "ES256" })));
  const sub = env("VAPID_SUBJECT") || "mailto:newmarketconsult@gmail.com";
  const payload = bufToB64u(Buffer.from(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60,
    sub
  })));
  const input = `${header}.${payload}`;
  // dsaEncoding 'ieee-p1363' → raw 64-byte R||S (JOSE format), not DER.
  const sig = crypto.sign("sha256", Buffer.from(input), { key, dsaEncoding: "ieee-p1363" });
  return `${input}.${bufToB64u(sig)}`;
}

// Encrypt `payload` (string) for a subscription per RFC 8291 (aes128gcm).
// Returns the request body Buffer: salt(16)|rs(4)|idlen(1)|keyid(as_public)|ciphertext.
function encryptPush(payload, p256dhB64, authB64) {
  const uaPublic = b64uToBuf(p256dhB64);      // 65 bytes
  const authSecret = b64uToBuf(authB64);      // 16 bytes
  const ec = crypto.createECDH("prime256v1");
  ec.generateKeys();
  const asPublic = ec.getPublicKey();         // 65 bytes
  const sharedSecret = ec.computeSecret(uaPublic);

  const salt = crypto.randomBytes(16);
  const keyInfo = Buffer.concat([Buffer.from("WebPush: info\0", "utf8"), uaPublic, asPublic]);
  const ikm = Buffer.from(crypto.hkdfSync("sha256", sharedSecret, authSecret, keyInfo, 32));
  const cek = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: aes128gcm\0", "utf8"), 16));
  const nonce = Buffer.from(crypto.hkdfSync("sha256", ikm, salt, Buffer.from("Content-Encoding: nonce\0", "utf8"), 12));

  const plaintext = Buffer.concat([Buffer.from(payload, "utf8"), Buffer.from([0x02])]); // single-record delimiter
  const cipher = crypto.createCipheriv("aes-128-gcm", cek, nonce);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final(), cipher.getAuthTag()]);

  const rs = Buffer.alloc(4); rs.writeUInt32BE(4096, 0);
  const idlen = Buffer.from([asPublic.length]);
  return Buffer.concat([salt, rs, idlen, asPublic, ciphertext]);
}

// Is Web Push usable at all right now? Callers use this to degrade honestly
// instead of reporting a send that silently went nowhere.
function vapidConfigured() {
  return !!(env("VAPID_PUBLIC_KEY") && env("VAPID_PRIVATE_KEY"));
}

// Deliver one push.
// Returns { ok, status, gone, reason }. gone=true (404/410) means the browser
// subscription is permanently dead and the caller should prune the row.
async function sendOnePush(sub, payloadStr) {
  let endpoint;
  try { endpoint = new URL(sub.endpoint); } catch (e) { return { ok: false, gone: true, reason: "bad endpoint" }; }
  const jwt = vapidJwt(`${endpoint.protocol}//${endpoint.host}`);
  if (!jwt) return { ok: false, reason: "vapid not configured" };
  let body;
  try { body = encryptPush(payloadStr, sub.p256dh, sub.auth); } catch (e) { return { ok: false, reason: e.message }; }
  try {
    const r = await fetch(sub.endpoint, {
      method: "POST",
      headers: {
        "Content-Encoding": "aes128gcm",
        "Content-Type": "application/octet-stream",
        TTL: "86400",
        Authorization: `vapid t=${jwt}, k=${env("VAPID_PUBLIC_KEY")}`
      },
      body
    });
    return { ok: r.ok, status: r.status, gone: r.status === 404 || r.status === 410 };
  } catch (e) { return { ok: false, reason: e.message }; }
}

module.exports = { vapidConfigured, sendOnePush, encryptPush, vapidJwt, b64uToBuf, bufToB64u };
