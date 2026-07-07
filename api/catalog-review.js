// Admin curation queue for the shared supermarket image bank ("مخزن الصور
// المشترك"). Every item pulled in by scripts/build-shared-catalog.js (or
// api/catalog-process-image.js with save:true) starts life with
// approved = false / brand_free = false — nothing becomes visible to other
// merchants until a human confirms the photo/name carries no store-specific
// trademark, logo, watermark, or private-label branding.
//
//   GET  ?action=pending                        → rows awaiting review (approved = false)
//   GET  ?action=list&status=approved|rejected|all
//   POST ?action=review     { id, decision: "approve"|"reject", canonicalName?, category?, unit?, note? }
//   POST ?action=bulk-review { ids: number[], decision: "approve"|"reject" }
//   POST ?action=enhance     { id }   → run THIS ONE item through the paid AI
//     cleanup pipeline (background/marks removal + zoom standardization) on
//     demand. scripts/build-shared-catalog.js deliberately uploads raw,
//     un-enhanced photos (enhanced = false) so nothing is auto-processed —
//     a reviewer decides per item whether it's worth spending OpenAI credits
//     on before approving (a raw photo can also be approved as-is if it's
//     already clean).
//
// "reject" does NOT delete the row (keeps the audit trail / avoids
// re-ingesting the same rejected item next run) — it just leaves
// approved/brand_free at false with the reviewer's note attached.
//
// Auth: same admin session model as api/campaign.js (x-admin-token signed
// session, or x-admin-key === ADMIN_PASSWORD for scripts/cron).

const crypto = require("crypto");
const { processCatalogImage } = require("../lib/catalog-image-pipeline");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const env = k => (process.env[k] || "").trim();

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
  return !!pw && (req.headers["x-admin-key"] || "") === pw;
}

function sb() {
  const url = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") || "";
  return { url, key };
}
async function sbFetch(path, opts = {}) {
  const { url, key } = sb();
  return fetch(`${url}/rest/v1/${path}`, {
    ...opts,
    headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(opts.headers || {}) }
  });
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!adminOk(req)) return res.status(403).json({ error: "unauthorized" });

  const q = new URL(req.url, "http://internal").searchParams;
  const action = q.get("action");

  if (req.method === "GET") {
    if (action === "pending") {
      const r = await sbFetch(`catalog_products?approved=eq.false&select=*&order=created_at.desc&limit=200`);
      const data = await r.json().catch(() => []);
      return res.status(r.ok ? 200 : r.status).json({ ok: r.ok, items: data });
    }
    if (action === "list") {
      const status = q.get("status") || "all";
      const filter = status === "approved" ? "&approved=eq.true"
        : status === "rejected" ? "&approved=eq.false&review_note=not.is.null"
        : "";
      const r = await sbFetch(`catalog_products?select=*${filter}&order=updated_at.desc&limit=500`);
      const data = await r.json().catch(() => []);
      return res.status(r.ok ? 200 : r.status).json({ ok: r.ok, items: data });
    }
    return res.status(400).json({ error: "unknown action" });
  }

  if (req.method === "POST" && action === "review") {
    const { id, decision, canonicalName, category, unit, note } = req.body || {};
    if (!id || !["approve", "reject"].includes(decision)) return res.status(400).json({ error: "id and decision required" });
    const patch = {
      approved: decision === "approve",
      brand_free: decision === "approve",
      updated_at: new Date().toISOString()
    };
    if (canonicalName) patch.canonical_name = canonicalName;
    if (category) patch.category = category;
    if (unit) patch.unit = unit;
    if (note) patch.review_note = note;
    const r = await sbFetch(`catalog_products?id=eq.${Number(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    return res.status(200).json({ ok: true });
  }

  if (req.method === "POST" && action === "enhance") {
    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "id required" });
    const getR = await sbFetch(`catalog_products?id=eq.${Number(id)}&select=*`);
    const rows = await getR.json().catch(() => []);
    const row = Array.isArray(rows) && rows[0];
    if (!row) return res.status(404).json({ error: "not found" });

    let processed;
    try {
      const imgRes = await fetch(row.image, { signal: AbortSignal.timeout(15000) });
      if (!imgRes.ok) throw new Error(`could not download current image (${imgRes.status})`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const mimeType = (imgRes.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
      processed = await processCatalogImage({ buffer, mimeType, name: row.canonical_name });
    } catch (e) {
      return res.status(502).json({ error: String(e.message || e) });
    }

    const { url: baseUrl, key } = sb();
    const filename = `${Date.now()}_${crypto.randomBytes(4).toString("hex")}.jpg`;
    const up = await fetch(`${baseUrl}/storage/v1/object/catalog-images/${encodeURIComponent(filename)}`, {
      method: "POST",
      headers: { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "image/jpeg", "x-upsert": "true" },
      body: processed.buffer
    });
    if (!up.ok) return res.status(up.status).json({ error: await up.text() });
    const publicUrl = `https://www.dukkanci.com.tr/media/catalog-images/${encodeURIComponent(filename)}`;

    const patch = { image: publicUrl, enhanced: true, updated_at: new Date().toISOString() };
    if (processed.brandCheckNote) patch.review_note = processed.brandCheckNote;
    const patchR = await sbFetch(`catalog_products?id=eq.${Number(id)}`, { method: "PATCH", body: JSON.stringify(patch) });
    if (!patchR.ok) return res.status(patchR.status).json({ error: await patchR.text() });
    return res.status(200).json({ ok: true, image: publicUrl, brandCheckNote: processed.brandCheckNote || null });
  }

  if (req.method === "POST" && action === "bulk-review") {
    const { ids, decision } = req.body || {};
    if (!Array.isArray(ids) || !ids.length || !["approve", "reject"].includes(decision)) {
      return res.status(400).json({ error: "ids and decision required" });
    }
    const patch = { approved: decision === "approve", brand_free: decision === "approve", updated_at: new Date().toISOString() };
    const r = await sbFetch(`catalog_products?id=in.(${ids.map(Number).join(",")})`, { method: "PATCH", body: JSON.stringify(patch) });
    if (!r.ok) return res.status(r.status).json({ error: await r.text() });
    return res.status(200).json({ ok: true, count: ids.length });
  }

  return res.status(400).json({ error: "unknown action" });
};
