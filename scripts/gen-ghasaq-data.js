// Generates ghasaq-data.js from the processed product list (final.json).
const fs = require('fs');
const d = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const tidy = s => s.replace(/\s*\/\s*([^/()]+?)\s*\/?$/, ' ($1)').replace(/\s+/g, ' ').trim();
const items = d.map(x => {
  const o = { name: tidy(x.name), price: x.price, category: x.category, image: `/assets/photos/ghasaq/${x.file}` };
  if (x.oldPrice) o.oldPrice = x.oldPrice;
  if (x.description) o.description = x.description;
  return o;
});
const cats = [...new Set(items.map(i => i.category))];
const out = `// Generated for غسق ماركت (Ghasaq Market) — Sultaniye/Yenikent, Esenyurt/İstanbul.
// Source: the merchant's own Shopify storefront gasakmarket.com (linked from its WhatsApp Business profile,
// wa.me/c/905358441989). The WhatsApp catalog itself lists only ~46 items, almost none priced, so it was
// used for cross-checking only. ${items.length} products across ${cats.length} categories; unavailable and zero-price items excluded.
// Google Places match by phone: place_id ChIJc-QO6UKhyhQR7k4w0vM1TeE. oldPrice = merchant's own compare-at price.
const ghasaqStore = {
 "id": 119,
 "name": "غسق ماركت",
 "category": "سوبر ماركت",
 "image": "/assets/photos/ghasaq/cover.jpg",
 "coverImage": "/assets/photos/ghasaq/cover.jpg",
 "logoImage": "/assets/photos/ghasaq/logo.jpg",
 "logo": "غ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 0,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": { "lat": 41.0340256, "lng": 28.6861564 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0340256,28.6861564",
 "open": true,
 "featured": false,
 "hasOffer": false,
 "offer": "",
 "description": "غسق ماركت — سوبر ماركت في إسنيورت: خضار وفواكه طازجة، دجاج، ألبان وبيض، توابل وبهارات وعطارة، مشروبات ساخنة وقهوة وشاي، بقوليات وأرز، معلبات، مخبوزات ومجمدات. توصيل حسب المسافة.",
 "address": "Sultaniye (Yenikent), 614. Sk. No:4, 34510 Esenyurt/İstanbul",
 "phone": "+90 535 844 19 89",
 "whatsapp": "+90 535 844 19 89",
 "email": "",
 "website": "https://gasakmarket.com",
 "sourceUrl": "https://wa.me/c/905358441989",
 "hours": "يومياً 10:00 ص – 10:00 م",
 "areas": ["إسنيورت", "مناطق إسطنبول حسب المسافة"],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true,
 "approvalStatus": "pending",
 "googlePlaceId": "ChIJc-QO6UKhyhQR7k4w0vM1TeE",
 "googleRating": 3.7,
 "googleReviewsCount": 409,
 "googleMapsUrl": "https://maps.google.com/?cid=16234691553060212462"
};

const ghasaqFullCatalog = [
${items.map(i => '  ' + JSON.stringify(i) + ',').join('\n')}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const ghasaqProductCatalog = [];

const ghasaqProducts = (ghasaqProductCatalog.length ? ghasaqProductCatalog : ghasaqFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1990001 + index,
  storeId: ghasaqStore.id
}));

const ghasaqDeliverySettings = {
  [ghasaqStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { ghasaqStore, ghasaqProducts, ghasaqDeliverySettings };
}
`;
fs.writeFileSync(process.argv[3], out);
console.log(items.length, cats.length);
