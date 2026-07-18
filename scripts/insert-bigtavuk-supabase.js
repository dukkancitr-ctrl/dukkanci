// One-time insert of store 101 (بيغ طاووق) + its 59 products into Supabase via
// the PostgREST REST API using the service-role key (anon-key writes are RLS-blocked
// on stores/products). Reads SUPABASE_SERVICE_ROLE_KEY from .env manually since
// dotenv isn't installed in this project.
const fs = require('fs');

function loadEnv() {
  const env = fs.readFileSync('.env', 'utf8');
  const map = {};
  env.split(/\r?\n/).forEach(l => {
    if (!l || l.startsWith('#')) return;
    const i = l.indexOf('=');
    if (i > 0) map[l.slice(0, i).trim()] = l.slice(i + 1).trim();
  });
  return map;
}

const { bigtavukStore, bigtavukProducts } = require('../bigtavuk-data.js');

const env = loadEnv();
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const BASE = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';

function toDbStore(s) {
  return {
    id: s.id, name: s.name, slug: null, category: s.category, image: s.image, cover_image: s.coverImage,
    logo_image: s.logoImage, logo: s.logo, rating: s.rating, reviews: s.reviews, new_store: !!s.newStore,
    delivery: s.delivery, min_order: s.minOrder, time: s.time, distance: s.distance,
    lat: s.location?.lat ?? null, lng: s.location?.lng ?? null, map_url: s.mapUrl, open: s.open !== false,
    featured: !!s.featured, has_offer: !!s.hasOffer, offer: s.offer ?? null, price_on_request: !!s.priceOnRequest,
    description: s.description ?? null, address: s.address ?? null, phone: s.phone ?? null, whatsapp: s.whatsapp ?? null,
    email: s.email ?? null, bank_details: null,
    payment_methods: { cash: true, card: true, bank: true },
    website: s.website ?? null, source_url: s.sourceUrl ?? null, hours: s.hours ?? null,
    areas: s.areas ?? [], fulfillment: s.fulfillment ?? null, subscription: s.subscription ?? null,
    order_count: s.orderCount ?? 0, official_store: !!s.officialStore, branch_group: null, brand_theme: null,
    approval_status: s.approvalStatus ?? 'pending',
    google_place_id: s.googlePlaceId ?? null,
    google_rating: s.googleRating ?? null,
    google_reviews_count: s.googleReviewsCount ?? null,
    google_maps_url: s.googleMapsUrl ?? null,
    google_rating_updated_at: new Date().toISOString()
  };
}

function toDbProduct(p) {
  return {
    id: p.id, store_id: p.storeId, source_id: null, name: p.name, image: p.image ?? null,
    price: p.price ?? 0, old_price: null, price_on_request: false,
    unit: p.unit ?? null, category: p.category ?? null, available: p.available !== false, featured: false,
    description: p.description || null, image_fit: null, options: [], addons: [],
    catalog_product_id: null, advance_hours: 0
  };
}

(async () => {
  const storeRow = toDbStore(bigtavukStore);
  const productRows = bigtavukProducts.map(toDbProduct);

  const r1 = await fetch(BASE + '/rest/v1/stores', {
    method: 'POST',
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify([storeRow])
  });
  const s1 = await r1.json();
  console.log('store insert status', r1.status, JSON.stringify(s1).slice(0, 400));
  if (!r1.ok) { process.exit(1); }

  const r2 = await fetch(BASE + '/rest/v1/products', {
    method: 'POST',
    headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify(productRows)
  });
  const s2 = await r2.json();
  console.log('products insert status', r2.status, 'count', Array.isArray(s2) ? s2.length : JSON.stringify(s2).slice(0,400));
  if (!r2.ok) { process.exit(1); }

  console.log('DONE');
})();
