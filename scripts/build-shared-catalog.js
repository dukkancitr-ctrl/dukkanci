#!/usr/bin/env node
// One-time / periodic ingestion job that seeds the shared supermarket image
// bank ("مخزن الصور المشترك") from the products already photographed by
// Dukkanci's existing supermarket stores.
//
// What it does:
//   1. Reads every store whose category is the supermarket category
//      (SUPERMARKET_CATEGORY, default "سوبر ماركت").
//   2. Reads all of their products.
//   3. Groups products across stores by a normalized name key (dialect/
//      spacing/diacritics-insensitive).
//   4. For each NEW cluster (skips ones already ingested — safe to re-run),
//      uploads the RAW representative photo AS-IS to the "catalog-images"
//      Storage bucket (no OpenAI call — see note below) and inserts a row
//      into public.catalog_products with approved = false, enhanced = false
//      — PENDING human review.
//   5. Nothing here ever sets approved/brand_free = true, and nothing here
//      spends OpenAI credits. Use the admin "مخزن الصور المشترك" tab (or
//      POST /api/catalog-review?action=enhance) to run a SPECIFIC item
//      through lib/catalog-image-pipeline.js (background/marks removal +
//      zoom standardization) once a reviewer decides it's actually worth the
//      cost — most clusters turn out to be single-store items, so running
//      every one through paid AI cleanup automatically wasted money on
//      photos nobody had looked at yet. The reviewer may also approve a raw
//      photo as-is without ever enhancing it, if it's already clean.
//
// Usage:
//   SUPABASE_SERVICE_ROLE_KEY=... node scripts/build-shared-catalog.js
//
// Useful env vars:
//   SUPABASE_URL                 (defaults to the project's URL, same as other api/*.js files)
//   SUPABASE_SERVICE_ROLE_KEY    required — service role, bypasses RLS
//   SUPERMARKET_CATEGORY         default "سوبر ماركت"
//   SUPERMARKET_STORE_IDS        optional comma-separated override, e.g. "3,5,12,19"
//   DRY_RUN=true                 only prints the clusters it WOULD ingest — no
//                                 uploads, no DB writes. Run this first to
//                                 sanity-check the grouping/dedup.
//   LIMIT=20                     process at most N new clusters this run

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
// PostgREST silently caps any single response at the project's "max rows"
// setting (commonly 1000) regardless of a `limit=` in the query string, so a
// plain sbGet() on a table bigger than that only ever returns the first page.
// Page through with limit/offset until a page comes back short.
async function sbGetAll(path, pageSize = 1000) {
  let all = [];
  let offset = 0;
  for (;;) {
    const sep = path.includes("?") ? "&" : "?";
    const page = await sbGet(`${path}${sep}limit=${pageSize}&offset=${offset}`);
    all = all.concat(page);
    if (page.length < pageSize) break;
    offset += pageSize;
  }
  return all;
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
async function sbUploadImage(buffer, filename, contentType = "image/jpeg") {
  const r = await fetch(`${SUPABASE_URL}/storage/v1/object/catalog-images/${encodeURIComponent(filename)}`, {
    method: "POST",
    headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}`, "Content-Type": contentType, "x-upsert": "true" },
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

// Product images across the platform's own bundled stores are almost always
// SITE-RELATIVE paths (e.g. "/assets/photos/kady/products/x.webp"), served
// from the same Vercel deployment as app.js — not absolute URLs. Resolve
// those against the site's own origin so they can actually be downloaded.
const SITE_ORIGIN = "https://www.dukkanci.com.tr";
function resolveImageUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return SITE_ORIGIN + url;
  return null;
}
// Same placeholder check app.js's isPlaceholderImage() uses — keep in sync so
// a "no photo yet" stand-in (coming-soon.svg, generic-cover, etc.) never gets
// ingested into the shared bank as if it were a real product photo.
const PLACEHOLDER_RE = /placeholder|generic-cover|coming-soon/i;
function isUsableImage(url) {
  const resolved = resolveImageUrl(url);
  return !!resolved && !PLACEHOLDER_RE.test(resolved);
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
  const products = await sbGetAll(`products?store_id=in.(${idsFilter})&select=id,store_id,name,image,category,unit,price`);
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
    if (!c.image && isUsableImage(p.image)) { c.image = resolveImageUrl(p.image); c.sourceStoreId = p.store_id; }
  }
  console.log(`Grouped into ${clusters.size} distinct product cluster(s).`);

  // Skip clusters already ingested (idempotent re-runs).
  const existing = await sbGetAll(`catalog_products?select=normalized_key`);
  const existingKeys = new Set(existing.map(r => r.normalized_key));

  const top = (votes) => [...votes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // A systemic failure (billing limit hit, bad key, network outage) fails EVERY
  // remaining item the same way — without a circuit breaker the loop burns
  // through the entire candidate list (thousands of doomed HTTP calls) chasing
  // a success count it will never reach. Stop after a run of consecutive
  // failures instead; override via MAX_CONSECUTIVE_FAILURES if needed.
  const MAX_CONSECUTIVE_FAILURES = Number(env("MAX_CONSECUTIVE_FAILURES") || 8);
  let consecutiveFailures = 0;
  let processed = 0, skippedExisting = 0, skippedNoImage = 0, failed = 0;
  for (const [key, c] of clusters) {
    if (existingKeys.has(key)) { skippedExisting++; continue; }
    if (!c.image) { skippedNoImage++; continue; }
    if (processed >= LIMIT) break;
    if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      console.error(`\nAborting: ${consecutiveFailures} consecutive failures — likely a systemic issue (billing limit, bad key, network). Check the last error above before retrying.`);
      break;
    }

    const canonicalName = top(new Map([...c.names].map(n => [n, 1]))) || [...c.names][0];
    const category = top(c.categoryVotes);
    const unit = top(c.unitVotes);
    const keywords = [...c.names];

    console.log(`\n[${processed + 1}] "${canonicalName}" — from ${c.storeIds.size} store(s), category="${category || "-"}"`);
    if (DRY_RUN) { processed++; continue; }

    try {
      // Upload the RAW source photo as-is — no OpenAI call here. Cleanup/zoom
      // standardization is a separate, manual, per-item decision made later
      // in the admin review tab (POST /api/catalog-review?action=enhance),
      // so money is only spent on photos a reviewer actually judged worth it.
      const imgRes = await fetch(c.image, { signal: AbortSignal.timeout(15000) });
      if (!imgRes.ok) throw new Error(`could not download source image (${imgRes.status})`);
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const contentType = (imgRes.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
      const ext = (contentType.split("/")[1] || "jpg").replace("jpeg", "jpg");
      const filename = `${Date.now()}_${key.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}.${ext}`;
      const publicUrl = await sbUploadImage(buffer, filename, contentType);

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
        enhanced: false
      });
      console.log(`  ✓ saved catalog_products #${row?.id} — raw upload, pending review`);
      processed++;
      consecutiveFailures = 0;
    } catch (e) {
      console.warn(`  ✗ failed: ${e.message}`);
      failed++;
      consecutiveFailures++;
    }
  }

  console.log(`\nDone. processed=${processed} skipped_existing=${skippedExisting} skipped_no_image=${skippedNoImage} failed=${failed}`);
  if (!DRY_RUN && processed) {
    console.log(`Review + selectively enhance the new items before they reach other stores: GET /api/catalog-review.js?action=pending`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
