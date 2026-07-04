#!/usr/bin/env node
// One-time / periodic ingestion job that seeds the shared supermarket image
// bank ("مخزن الصور المشترك") from the products already photographed by
// Dukkanci's existing supermarket stores (~90% overlap between Arab grocery
// stores in Turkey, per the product brief this implements).
//
// What it does:
//   1. Reads every store whose category is the supermarket category
//      (SUPERMARKET_CATEGORY, default "سوبر ماركت").
//   2. Reads all of their products.
//   3. Groups products across stores by a normalized name key (dialect/
//      spacing/diacritics-insensitive) — ~90% overlap means most clusters
//      will have photos from more than one store.
//   4. For each NEW cluster (skips ones already ingested — safe to re-run),
//      picks one representative photo, runs it through
//      lib/catalog-image-pipeline.js (background + store-marks removed,
//      resized onto the platform's fixed standard canvas/zoom), uploads the
//      result to the "catalog-images" Storage bucket, and inserts a row into
//      public.catalog_products with approved = false — PENDING human review.
//   5. Nothing here ever sets approved/brand_free = true. Use
//      api/catalog-review.js (or a future admin-panel tab) to actually
//      publish items to other stores.
//
// Usage:
//   OPENAI_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/build-shared-catalog.js
//
// Useful env vars:
//   SUPABASE_URL                 (defaults to the project's URL, same as other api/*.js files)
//   SUPABASE_SERVICE_ROLE_KEY    required — service role, bypasses RLS
//   OPENAI_API_KEY               required — background/marks removal
//   SUPERMARKET_CATEGORY         default "سوبر ماركت"
//   SUPERMARKET_STORE_IDS        optional comma-separated override, e.g. "3,5,12,19"
//   DRY_RUN=true                 only prints the clusters it WOULD ingest — no
//                                 OpenAI calls, no uploads, no DB writes. Run this
//                                 first to sanity-check the grouping/dedup.
//   LIMIT=20                     process at most N new clusters this run (cost control)
//   ENABLE_AI_BRAND_PRESCREEN=true  ask a vision model for a brand-risk hint per item
//                                    (assistive only — see lib/catalog-image-pipeline.js)

const { processCatalogImage } = require("../lib/catalog-image-pipeline");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const env = k => (process.env[k] || "").trim();
const SUPABASE_URL = (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const SERVICE_KEY = env("SUPABASE_SERVICE_ROLE_KEY");
const SUPERMARKET_CATEGORY = env("SUPERMARKET_CATEGORY") || "سوبر ماركت";
const DRY_RUN = env("DRY_RUN") === "true";
const LIMIT = Number(env("LIMIT") || 0) || Infinity;

if (!SERVICE_KEY) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required.");
  process.exit(1);
}

async function sbGet(path) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
  });
  if (!r.ok) throw new Error(`GET ${path} -> ${r.status}: ${await r.text()}`);
  return r.json();
}
async function sbUpsertCatalogProduct(row) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/catalog_products?on_conflict=normalized_key`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "application/json",
      Prefer: "return=representation,resolution=merge-duplicates"
    },
    body: JSON.stringify(row)
  });
  if (!r.ok) throw new Error(`upsert catalog_products -> ${r.status}: ${await r.text()}`);
  const data = await r.json().catch(() => []);
  return data[0] || null;
}
async function sbUploadImage(buffer, filename) {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/catalog-images/${encodeURIComponent(filename)}`, {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": "image/jpeg", "x-upsert": "true" },
    body: buffer
  });
  if (!r.ok) throw new Error(`storage upload -> ${r.status}: ${await r.text()}`);
  return `https://www.dukkanci.com.tr/media/catalog-images/${encodeURIComponent(filename)}`;
}

// Same normalization used by api/catalog-process-image.js — keep both in sync.
function normalizeKey(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[ً-ْ]/g, "")
    .replace(/[إأآا]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
    .replace(/\s+/g, " ");
}

const PLACEHOLDER_RE = /\/assets\/(product|store)-[a-z-]+\.(svg|jpg|png)$/i;
function isUsableImage(url) {
  return !!url && /^https?:\/\//i.test(url) && !PLACEHOLDER_RE.test(url);
}

async function main() {
  console.log(`Fetching stores in category "${SUPERMARKET_CATEGORY}"...`);
  let storeIds;
  const override = env("SUPERMARKET_STORE_IDS");
  if (override) {
    storeIds = override.split(",").map(s => Number(s.trim())).filter(Boolean);
  } else {
    const stores = await sbGet(`stores?category=eq.${encodeURIComponent(SUPERMARKET_CATEGORY)}&select=id,name`);
    storeIds = stores.map(s => s.id);
    console.log(`Found ${stores.length} supermarket store(s): ${stores.map(s => `${s.name}(#${s.id})`).join(", ")}`);
  }
  if (!storeIds.length) { console.log("No supermarket stores found — nothing to do."); return; }

  const idsFilter = storeIds.join(",");
  const products = await sbGet(`products?store_id=in.(${idsFilter})&select=id,store_id,name,image,category,unit,price&limit=10000`);
  console.log(`Fetched ${products.length} products across ${storeIds.length} store(s).`);

  // Group by normalized name.
  const clusters = new Map(); // normalizedKey -> { names:Set, category:Map, unit:Map, image, sourceStoreId, storeIds:Set }
  for (const p of products) {
    if (!p.name) continue;
    const key = normalizeKey(p.name);
    if (!key) continue;
    let c = clusters.get(key);
    if (!c) {
      c = { names: new Set(), categoryVotes: new Map(), unitVotes: new Map(), image: null, sourceStoreId: null, storeIds: new Set() };
      clusters.set(key, c);
    }
    c.names.add(p.name);
    c.storeIds.add(p.store_id);
    if (p.category) c.categoryVotes.set(p.category, (c.categoryVotes.get(p.category) || 0) + 1);
    if (p.unit) c.unitVotes.set(p.unit, (c.unitVotes.get(p.unit) || 0) + 1);
    if (!c.image && isUsableImage(p.image)) { c.image = p.image; c.sourceStoreId = p.store_id; }
  }
  console.log(`Grouped into ${clusters.size} distinct product cluster(s).`);

  // Skip clusters already ingested (idempotent re-runs).
  const existing = await sbGet(`catalog_products?select=normalized_key`);
  const existingKeys = new Set(existing.map(r => r.normalized_key));

  const top = (votes) => [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  let processed = 0, skippedExisting = 0, skippedNoImage = 0, failed = 0;
  for (const [key, c] of clusters) {
    if (existingKeys.has(key)) { skippedExisting++; continue; }
    if (!c.image) { skippedNoImage++; continue; }
    if (processed >= LIMIT) break;

    const canonicalName = top(new Map([...c.names].map(n => [n, 1]))) || [...c.names][0];
    const category = top(c.categoryVotes);
    const unit = top(c.unitVotes);
    const keywords = [...c.names];

    console.log(`\n[${processed + 1}] "${canonicalName}" — from ${c.storeIds.size} store(s), category="${category || "-"}"`);
    if (DRY_RUN) { processed++; continue; }

    try {
      const imgRes = await fetch(c.image, { signal: AbortSignal.timeout(15000) });
      if (!imgRes.ok) throw new Error(`could not download source image (${imgRes.status})`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const mimeType = (imgRes.headers.get("content-type") || "image/jpeg").split(";")[0].trim();

      const result = await processCatalogImage({ buffer, mimeType, name: canonicalName });
      const filename = `${Date.now()}_${key.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.jpg`;
      const publicUrl = await sbUploadImage(result.buffer, filename);

      const row = await sbUpsertCatalogProduct({
        normalized_key: key,
        canonical_name: canonicalName,
        category: category || null,
        unit: unit || null,
        image: publicUrl,
        source_image: c.image,
        keywords,
        source_store_id: c.sourceStoreId,
        contributor_store_ids: [...c.storeIds],
        brand_free: false,
        approved: false,
        review_note: result.brandCheckNote || null
      });
      console.log(`  ✓ saved catalog_products #${row?.id} — pending review`);
      processed++;
    } catch (e) {
      console.warn(`  ✗ failed: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone. processed=${processed} skipped_existing=${skippedExisting} skipped_no_image=${skippedNoImage} failed=${failed}`);
  if (!DRY_RUN && processed) {
    console.log(`Review the new items before they reach other stores: GET /api/catalog-review.js?action=pending`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
