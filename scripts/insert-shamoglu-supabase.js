const fs = require('fs');
const path = require('path');

const envText = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
const env = {};
envText.split(/\r?\n/).forEach((line) => {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2];
});

const SUPABASE_URL = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;

const { shamogluStore, shamogluProducts } = require('../shamoglu-data.js');

function toDbStore(s) {
  return {
    id: s.id,
    name: s.name,
    category: s.category,
    image: s.image,
    cover_image: s.coverImage,
    logo_image: s.logoImage,
    logo: s.logo,
    rating: s.rating,
    reviews: s.reviews,
    delivery: s.delivery,
    min_order: s.minOrder,
    time: s.time,
    lat: s.location.lat,
    lng: s.location.lng,
    map_url: s.mapUrl,
    open: s.open,
    featured: s.featured,
    description: s.description,
    address: s.address,
    phone: s.phone,
    whatsapp: s.whatsapp,
    hours: s.hours,
    fulfillment: s.fulfillment,
    approval_status: s.approvalStatus,
    google_rating: s.googleRating,
    google_reviews_count: s.googleReviewsCount,
    google_place_id: s.googlePlaceId,
    google_maps_url: s.googleMapsUrl,
    google_rating_updated_at: new Date().toISOString(),
    slug: 'shamoglu-restaurant-basaksehir'
  };
}

function toDbProduct(p) {
  return {
    id: p.id,
    store_id: p.storeId,
    name: p.name,
    description: p.description || '',
    price: p.price,
    category: p.category,
    unit: p.unit,
    image: p.image,
    available: p.available
  };
}

async function main() {
  const storeRow = toDbStore(shamogluStore);
  const r1 = await fetch(`${SUPABASE_URL}/rest/v1/stores`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(storeRow)
  });
  const storeResult = await r1.json();
  if (!r1.ok) {
    console.error('STORE INSERT FAILED', r1.status, JSON.stringify(storeResult));
    process.exit(1);
  }
  console.log('Store inserted:', JSON.stringify(storeResult));

  const productRows = shamogluProducts.map(toDbProduct);
  const r2 = await fetch(`${SUPABASE_URL}/rest/v1/products`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(productRows)
  });
  const productResult = await r2.json();
  if (!r2.ok) {
    console.error('PRODUCTS INSERT FAILED', r2.status, JSON.stringify(productResult));
    process.exit(1);
  }
  console.log('Products inserted count:', productResult.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
