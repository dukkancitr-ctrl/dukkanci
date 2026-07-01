// Generated for كنافة البراء (ALBARAA KÜNEFESİ / Al Baraa Sweets) — Adnan Menderes Blv. 2B,
// 34494 Başakşehir/İstanbul. Kunafa & oriental-sweets shop. Source: qrlist.app/tr/albaraa-kunafesi
// (Nuxt digital menu; native Arabic names via /api/material?app_locale=ar). 4 products across
// 3 kunafa categories, each with a unique real photo. The source publishes NO prices (display
// menu, orders via WhatsApp) → every product is priceOnRequest ("السعر عند الطلب").
// NOTE: albaraaProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives
// in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const albaraaStore = {
 "id": 68,
 "name": "كنافة البراء",
 "category": "حلويات",
 "image": "/assets/photos/albaraa/cover.jpg",
 "coverImage": "/assets/photos/albaraa/cover.jpg",
 "logoImage": "/assets/photos/albaraa/logo.png",
 "logo": "ك",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 0,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1235659,
  "lng": 28.7720729
 },
 "mapUrl": "https://maps.google.com/?q=41.1235659,28.7720729",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "priceOnRequest": true,
 "description": "كنافة البراء — كنافة طازجة تُحضَّر أمامك في باشاك شهير بإسطنبول. كنافة نابلسية ناعمة، وكنافة اسطنبولية خشنة، وكنافة مبرومة بالجبنة والقشطة، إلى جانب تشكيلة من الحلويات الشرقية. مذاق أصيل يصل إلى بابك.",
 "address": "شارع أدنان مندريس 2B، 34494 باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 531 351 71 12",
 "whatsapp": "+90 531 351 71 12",
 "email": "",
 "website": "",
 "sourceUrl": "https://qrlist.app/tr/albaraa-kunafesi",
 "hours": "",
 "areas": [
  "باشاك شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
// Prices are 0 + priceOnRequest:true — the source is a display menu with no published prices.
const albaraaFullCatalog = [
 {"name":"كنافة نابلسية","price":0,"priceOnRequest":true,"category":"كنافة نابلسية","image":"/assets/photos/albaraa/m-18575.jpg","sourceId":"18575","description":"كيلو كنافة نابلسية طعم مميز ونكهة لا تُنسى"},
 {"name":"مبرومة بالجبنة","price":0,"priceOnRequest":true,"category":"كنافة مبرومة","image":"/assets/photos/albaraa/m-18576.jpg","sourceId":"18576","description":"كنافة مبرومة بالجبنة"},
 {"name":"مبرومة قشطة","price":0,"priceOnRequest":true,"category":"كنافة مبرومة","image":"/assets/photos/albaraa/m-18578.jpg","sourceId":"18578","description":"مبرومة الكنافة بالقشطة"},
 {"name":"كنافة اسطنبولية خشنة","price":0,"priceOnRequest":true,"category":"كنافة اسطنبولية","image":"/assets/photos/albaraa/m-18577.jpg","sourceId":"18577","description":"كنافة اسطنبولية - خشنة"}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const albaraaProductCatalog = [];

const albaraaProducts = (albaraaProductCatalog.length ? albaraaProductCatalog : albaraaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1520001 + index,
  storeId: albaraaStore.id
}));

const albaraaDeliverySettings = {
  [albaraaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { albaraaStore, albaraaProducts, albaraaDeliverySettings };
}
