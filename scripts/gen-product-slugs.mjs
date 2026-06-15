// Populate products.slug with readable, unique English slugs.
// Prerequisite: run supabase/migrations/20260616_add_product_slug.sql first.
// Usage: node scripts/gen-product-slugs.mjs   (writes to Supabase via REST upsert)
//
// Slug = slugify(productName) scoped by the store's English slug, so the same
// product name in two stores stays unique and stable (no random id suffix).
// On a genuine in-store name clash we append -2, -3, …
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { STORE_SLUGS } = require("../store-slugs.js");

const SB_URL = (process.env.SUPABASE_URL || "https://tzcqnqzltrjemdnkzpzn.supabase.co")
  .replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const SB_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };

// Arabic letter -> Latin. Diacritics/tatweel are stripped; "ال" handled by the
// letter map (ا+ل) which is fine for slugs.
const AR = {
  "ا":"a","أ":"a","إ":"a","آ":"a","ٱ":"a","ب":"b","ت":"t","ث":"th","ج":"j","ح":"h","خ":"kh",
  "د":"d","ذ":"dh","ر":"r","ز":"z","س":"s","ش":"sh","ص":"s","ض":"d","ط":"t","ظ":"z","ع":"a",
  "غ":"gh","ف":"f","ق":"q","ك":"k","ل":"l","م":"m","ن":"n","ه":"h","و":"w","ي":"y","ى":"a",
  "ة":"a","ء":"","ؤ":"w","ئ":"y","پ":"p","چ":"ch","ژ":"zh","گ":"g"
};
const TR = { "ç":"c","ğ":"g","ı":"i","İ":"i","ö":"o","ş":"s","ü":"u","Ç":"c","Ğ":"g","Ö":"o","Ş":"s","Ü":"u" };

function slugify(name) {
  let s = String(name || "").trim();
  s = s.replace(/[ً-ْـ]/g, "");            // strip Arabic diacritics + tatweel
  s = s.replace(/[çğıİöşüÇĞÖŞÜ]/g, c => TR[c] || c);       // fold Turkish
  s = s.replace(/[؀-ۿ]/g, c => (c in AR ? AR[c] : ""));  // transliterate Arabic
  s = s.normalize("NFKD").replace(/[̀-ͯ]/g, ""); // strip remaining accents
  s = s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return s || "item";
}

async function fetchAllProducts() {
  let all = [], from = 0;
  for (;;) {
    const r = await fetch(`${SB_URL}/rest/v1/products?select=id,store_id,name&order=id&limit=1000&offset=${from}`, { headers: HEADERS });
    if (!r.ok) throw new Error(`fetch products ${r.status}: ${await r.text()}`);
    const rows = await r.json();
    all = all.concat(rows);
    if (rows.length < 1000) break;
    from += 1000;
  }
  return all;
}

async function upsertChunk(rows) {
  const r = await fetch(`${SB_URL}/rest/v1/products`, {
    method: "POST",
    headers: { ...HEADERS, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows)
  });
  if (!r.ok) throw new Error(`upsert ${r.status}: ${await r.text()}`);
}

(async () => {
  const products = await fetchAllProducts();
  console.log(`Fetched ${products.length} products.`);
  const used = new Set();
  const updates = products.map(p => {
    const storePart = STORE_SLUGS[p.store_id] || `store-${p.store_id}`;
    let base = `${slugify(p.name)}-${storePart}`;
    let slug = base, n = 1;
    while (used.has(slug)) { n += 1; slug = `${base}-${n}`; }
    used.add(slug);
    // Include name: upsert validates NOT NULL columns on the insert-shape even
    // when only the conflict-update path runs, so we resend the (unchanged) name.
    return { id: p.id, name: p.name, slug };
  });
  console.log(`Generated ${updates.length} unique slugs. Sample:`, updates.slice(0, 3));

  const CHUNK = 500;
  for (let i = 0; i < updates.length; i += CHUNK) {
    await upsertChunk(updates.slice(i, i + CHUNK));
    console.log(`  upserted ${Math.min(i + CHUNK, updates.length)}/${updates.length}`);
  }
  console.log("Done.");
})().catch(e => { console.error(e); process.exit(1); });
