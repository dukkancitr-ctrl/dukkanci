// One-time Supabase insert for Chiki Wiki (store 109, products 1910001-1910023).
// Uses SUPABASE_SERVICE_ROLE_KEY from local .env + PostgREST directly (session MCP connector
// is bound to an unrelated project — documented recurring limitation).
// Column mapping copied verbatim from the proven insert-turkwaz-supabase.js.
const fs = require("fs");
const path = require("path");

const env = fs.readFileSync(path.join(__dirname, "..", ".env"), "utf8");
const KEY = (env.match(/SUPABASE_SERVICE_ROLE_KEY=([^\r\n]+)/) || [])[1];
const BASE = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
if (!KEY) throw new Error("no service role key");

const { chikiwikiStore, chikiwikiProducts } = require("../chikiwiki-data.js");

const H = { apikey: KEY, Authorization: "Bearer " + KEY, "Content-Type": "application/json", Prefer: "return=representation" };
const get = async (q) => (await fetch(BASE + "/rest/v1/" + q, { headers: H })).json();

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
    approval_status: s.approvalStatus ?? "pending",
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
  // Final race check immediately before write
  const topStore = await get("stores?select=id&order=id.desc&limit=1");
  const clashStore = await get("stores?id=eq.109&select=id");
  const clashProd = await get("products?id=gte.1910001&id=lte.1910023&select=id&limit=1");
  console.log("max store id:", topStore[0]?.id, "| 109 taken:", clashStore.length > 0, "| product range taken:", clashProd.length > 0);
  if (clashStore.length || clashProd.length) throw new Error("ID COLLISION — re-pick ids");
  if (topStore[0]?.id !== 108) throw new Error("max store id moved (" + topStore[0]?.id + ") — re-verify before insert");

  const r1 = await fetch(BASE + "/rest/v1/stores", { method: "POST", headers: H, body: JSON.stringify([toDbStore(chikiwikiStore)]) });
  const s1 = await r1.json();
  console.log("store insert:", r1.status, JSON.stringify(s1).slice(0, 300));
  if (!r1.ok) process.exit(1);

  const r2 = await fetch(BASE + "/rest/v1/products", { method: "POST", headers: H, body: JSON.stringify(chikiwikiProducts.map(toDbProduct)) });
  const s2 = await r2.json();
  console.log("products insert:", r2.status, Array.isArray(s2) ? s2.length + " rows" : JSON.stringify(s2).slice(0, 300));
  if (!r2.ok) process.exit(1);
  console.log("DONE");
})();
