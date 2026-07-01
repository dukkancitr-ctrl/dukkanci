// Generated for الكنافة الفلسطينية - كايا شهير (Filistin Künefesi) — Kayabaşı, Kayaşehir, Başakşehir/İstanbul.
// Source: https://filistinkunefesi.com/menu-ar/ (WordPress + Food Menu Pro; Arabic menu).
// Palestinian/Nablus kunafa shop. 14 source items → 9 products: plate + kilo of the same
// kunafa merged into an «الحجم» (صحن/كيلو) option group, «قهوة» merged with «قهوة دبل»
// (مفرد/دبل), and «ماء» dropped (placeholder image reused from another dish, no real photo).
// Every surviving product has a unique real photo.
// NOTE: filistinkunefesiProductCatalog is intentionally emptied in the repo (perf) — the full
// catalog lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const filistinkunefesiStore = {
 "id": 66,
 "name": "الكنافة الفلسطينية - كايا شهير",
 "category": "حلويات",
 "image": "/assets/photos/filistinkunefesi/cover.jpg",
 "coverImage": "/assets/photos/filistinkunefesi/cover.jpg",
 "logoImage": "/assets/photos/filistinkunefesi/logo.png",
 "logo": "ك",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1191558,
  "lng": 28.7729525
 },
 "mapUrl": "https://maps.app.goo.gl/9N2yDFivK9g6QxZk8",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "الكنافة الفلسطينية — كنافة نابلسية أصيلة في كايا شهير بإسطنبول. كنافة نابلسية ناعمة وخشنة، مدلوقة، عصملية بالفستق، وصحون مشكّلة تُباع بالصحن أو بالكيلو، إلى جانب القهوة والشاي. تُحضّر طازجة يومياً وتصل ساخنة إلى بابك.",
 "address": "كايا باشي، كايا شهير، بشاق شهير، إسطنبول، تركيا",
 "phone": "+90 530 102 11 36",
 "whatsapp": "+90 530 102 11 36",
 "email": "",
 "website": "https://filistinkunefesi.com",
 "sourceUrl": "https://filistinkunefesi.com/menu-ar/",
 "hours": "يومياً من 09:00 صباحاً حتى 01:00 بعد منتصف الليل",
 "areas": [
  "كايا شهير",
  "بشاق شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push (also a small offline fallback); ProductCatalog
// is emptied below so it is NOT re-downloaded on every page load.
const filistinkunefesiFullCatalog = [
 {
  "name": "كنافة نابلسية",
  "price": 220,
  "category": "كنافة وحلويات",
  "unit": "",
  "image": "/assets/photos/filistinkunefesi/nabulsia.jpg",
  "sourceId": "nabulsia",
  "options": [{ "name": "الحجم", "values": ["صحن", "كيلو"], "extra": [0, 1260] }]
 },
 {
  "name": "مدلوقة",
  "price": 220,
  "category": "كنافة وحلويات",
  "unit": "",
  "image": "/assets/photos/filistinkunefesi/madlouqa.jpg",
  "sourceId": "madlouqa",
  "options": [{ "name": "الحجم", "values": ["صحن", "كيلو"], "extra": [0, 1260] }]
 },
 {
  "name": "كنافة خشنة",
  "price": 220,
  "category": "كنافة وحلويات",
  "unit": "",
  "image": "/assets/photos/filistinkunefesi/khishna.jpg",
  "sourceId": "khishna",
  "options": [{ "name": "الحجم", "values": ["صحن", "كيلو"], "extra": [0, 1260] }]
 },
 {
  "name": "عصملية",
  "price": 250,
  "category": "كنافة وحلويات",
  "unit": "صحن",
  "image": "/assets/photos/filistinkunefesi/osmaliya.jpg",
  "sourceId": "osmaliya"
 },
 {
  "name": "نابلسية وعصملية",
  "price": 240,
  "category": "كنافة وحلويات",
  "unit": "صحن",
  "image": "/assets/photos/filistinkunefesi/nabulsia-osmaliya.jpg",
  "sourceId": "nabulsia-osmaliya"
 },
 {
  "name": "نابلسية ومدلوقة",
  "price": 220,
  "category": "كنافة وحلويات",
  "unit": "صحن",
  "image": "/assets/photos/filistinkunefesi/nabulsia-madlouqa.jpg",
  "sourceId": "nabulsia-madlouqa"
 },
 {
  "name": "كيلو كنافة عربية",
  "price": 1480,
  "category": "كنافة وحلويات",
  "unit": "كيلو",
  "image": "/assets/photos/filistinkunefesi/kilo-arabiya.jpg",
  "sourceId": "kilo-arabiya"
 },
 {
  "name": "قهوة",
  "price": 80,
  "category": "مشروبات",
  "unit": "",
  "image": "/assets/photos/filistinkunefesi/coffee.jpg",
  "sourceId": "coffee",
  "options": [{ "name": "الحجم", "values": ["مفرد", "دبل"], "extra": [0, 30] }]
 },
 {
  "name": "شاي",
  "price": 40,
  "category": "مشروبات",
  "unit": "كوب",
  "image": "/assets/photos/filistinkunefesi/tea.jpg",
  "sourceId": "tea"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const filistinkunefesiProductCatalog = [];

const filistinkunefesiProducts = (filistinkunefesiProductCatalog.length ? filistinkunefesiProductCatalog : filistinkunefesiFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1500001 + index,
  storeId: filistinkunefesiStore.id
}));

const filistinkunefesiDeliverySettings = {
  [filistinkunefesiStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { filistinkunefesiStore, filistinkunefesiProducts, filistinkunefesiDeliverySettings };
}
