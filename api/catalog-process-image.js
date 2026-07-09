// POST /api/catalog-process-image  (admin only)
//
// On-demand version of the shared "مخزن الصور المشترك" pipeline: cleans ONE
// product photo — background removed, any store name/logo/watermark
// stripped, resized onto the platform's fixed standard canvas/zoom (see
// lib/catalog-image-pipeline.js) — uploads the result to the "catalog-images"
// Supabase Storage bucket, and (optionally) upserts a row into
// public.catalog_products so it shows up in the admin review queue.
//
// This is the endpoint the admin panel's future "مخزن الصور" tab calls when
// staff manually add/re-process one item; scripts/build-shared-catalog.js
// covers the bulk one-time seeding from the 4 existing supermarket stores.
//
// Auth: same admin session model as api/campaign.js — send either the signed
// x-admin-token the admin panel already stores in state.adminKey, or the raw
// x-admin-key === ADMIN_PASSWORD (for scripts/cron).
//
// Body: {
//   imageData?: string        data:<mime>;base64,...
//   imageUrl?:  string
//   name?:      string        canonical product name (used in the AI prompt + saved row)
//   category?:  string
//   unit?:      string
//   sourceStoreId?: number     which store this photo came from (audit only)
//   save?: boolean            if true, also upserts catalog_products (normalized_key = normalize(name))
// }
// Returns: { ok, url, catalogProductId?, brandCheckNote? }

const crypto = require("crypto");
const { processCatalogImage } = require("../lib/catalog-image-pipeline");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const MEDIA_BASE = "https://www.dukkanci.com.tr/media";
const BUCKET = "catalog-images";

const env = k => (process.env[k] || "").trim();

// ── Auth (mirrors api/campaign.js's HMAC session token + raw-password fallback) ──
function adminSecret() { return env("ADMIN_SESSION_SECRET") || env("ADMIN_PASSWORD"); }
function verifyAdminToken(token) {
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
  const m = /^exp=(\d+)$/.exec(payload);
  return !!m && Date.now() < Number(m[1]);
}
function adminOk(req) {
  const tok = (req.headers["x-admin-token"] || req.headers["x-admin-key"] || "");
  if (tok && verifyAdminToken(tok)) return true;
  const pw = env("ADMIN_PASSWORD");
  if (!pw) return false;
  const got = req.headers["x-admin-key"] || "";
  const a = Buffer.from(got);
  const b = Buffer.from(pw);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sb() {
  const url = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || "";
  return { url, key };
}

// Same normalization the ingestion script uses, so a manually-added item and a
// bulk-ingested one for "the same product" collapse into one catalog row.
function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, "")       // strip Arabic diacritics
    .replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  const { imageData, imageUrl, name, category, unit, sourceStoreId, save } = req.body || {};
  if (!imageData && !imageUrl) return res.status(400).json({ error: "imageData or imageUrl required" });

  let buffer, mimeType = "image/jpeg";
  try {
    if (imageData) {
      const match = imageData.match(/^data:([^;]+);base64,(.+)$/s);
      if (!match) return res.status(400).json({ error: "Invalid image data" });
      mimeType = match[1] || "image/jpeg";
      buffer = Buffer.from(match[2], "base64");
    } else {
      const r = await fetch(imageUrl, { signal: AbortSignal.timeout(10000) });
      if (!r.ok) return res.status(400).json({ error: "Could not fetch image" });
      buffer = Buffer.from(await r.arrayBuffer());
      mimeType = (r.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
    }
  } catch (e) {
    return res.status(400).json({ error: "Failed to load image: " + e.message });
  }

  let processed;
  try {
    processed = await processCatalogImage({ buffer, mimeType, name });
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }

  const { url: baseUrl, key } = sb();
  if (!key) return res.status(500).json({ error: "service key not configured" });

  const filename = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}.jpg`;
  const up = await fetch(`${baseUrl}/storage/v1/object/${BUCKET}/${encodeURIComponent(filename)}`, {
    method: "POST",
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "image/jpeg", "x-upsert": "true" },
    body: processed.buffer
  });
  const upData = await up.json().catch(() => ({}));
  if (!up.ok) return res.status(up.status).json({ error: upData.message || upData.error || "storage upload failed" });
  const publicUrl = `${MEDIA_BASE}/${BUCKET}/${encodeURIComponent(filename)}`;

  let catalogProductId = null;
  if (save && name) {
    const row = {
      normalized_key: normalizeKey(name),
      canonical_name: name,
      category: category || null,
      unit: unit || null,
      image: publicUrl,
      source_store_id: sourceStoreId || null,
      brand_free: false,
      approved: false,
      review_note: processed.brandCheckNote || null
    };
    const ins = await fetch(`${baseUrl}/rest/v1/catalog_products?on_conflict=normalized_key`, {
      method: "POST",
      headers: {
        apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json",
        Prefer: "return=representation,resolution=merge-duplicates"
      },
      body: JSON.stringify(row)
    });
    const insData = await ins.json().catch(() => null);
    if (ins.ok && Array.isArray(insData) && insData[0]) catalogProductId = insData[0].id;
  }

  return res.status(200).json({ ok: true, url: publicUrl, catalogProductId, brandCheckNote: processed.brandCheckNote || null });
};
