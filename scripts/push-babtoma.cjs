// Push مطعم باب توما (store 33) + products to the production Supabase, mirroring
// toDbStore/toDbProduct in app.js. Run: node scripts/push-babtoma.cjs
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const URL = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const KEY = 'sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc';

// Load the bundled data file in a sandbox to get the JS objects.
const ctx = {};
vm.createContext(ctx);
vm.runInContext(
  fs.readFileSync(path.join(ROOT, 'babtoma-data.js'), 'utf8') +
  '\nthis.__store=babtomaStore;this.__products=babtomaProducts;',
  ctx
);
const store = ctx.__store;
const products = ctx.__products;

function toDbStore(s) {
  return {
    id: s.id, name: s.name, category: s.category, image: s.image, cover_image: s.coverImage,
    logo_image: s.logoImage, logo: s.logo, rating: s.rating, reviews: s.reviews, new_store: !!s.newStore,
    delivery: s.delivery, min_order: s.minOrder, time: s.time, distance: s.distance,
    lat: s.location?.lat ?? null, lng: s.location?.lng ?? null, map_url: s.mapUrl, open: s.open !== false,
    featured: !!s.featured, has_offer: !!s.hasOffer, offer: s.offer ?? null, price_on_request: !!s.priceOnRequest,
    description: s.description ?? null, address: s.address ?? null, phone: s.phone ?? null, whatsapp: s.whatsapp ?? null,
    email: s.email ?? null, website: s.website ?? null, source_url: s.sourceUrl ?? null, hours: s.hours ?? null,
    areas: s.areas ?? [], fulfillment: s.fulfillment ?? null, subscription: s.subscription ?? null,
    order_count: s.orderCount ?? 0, official_store: !!s.officialStore, branch_group: s.branchGroup ?? null, brand_theme: s.brandTheme ?? null
  };
}
function toDbProduct(p) {
  return {
    id: p.id, store_id: p.storeId, source_id: p.sourceId ?? null, name: p.name, image: p.image ?? null,
    price: p.price ?? 0, old_price: p.oldPrice ?? null, price_on_request: !!p.priceOnRequest,
    unit: p.unit ?? null, category: p.category ?? null, available: p.available !== false, featured: !!p.featured,
    description: p.description ?? null, image_fit: p.imageFit ?? null, options: p.options ?? []
  };
}

async function upsert(table, rows) {
  const res = await fetch(`${URL}/rest/v1/${table}?on_conflict=id`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${await res.text()}`);
}

(async () => {
  await upsert('stores', [toDbStore(store)]);
  console.log('store 33 upserted');
  const dbProducts = products.map(toDbProduct);
  for (let i = 0; i < dbProducts.length; i += 50) {
    const chunk = dbProducts.slice(i, i + 50);
    await upsert('products', chunk);
    console.log(`products ${i + 1}-${i + chunk.length} upserted`);
  }
  console.log('DONE');
})().catch(e => { console.error(e.message); process.exit(1); });
