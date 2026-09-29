// Generated for مياه غلاطة الطبيعية - مياه ينابيع (Galata Natural Spring Water) — Esenyurt, Istanbul.
// First store under the new "المياه المعدنية" (Mineral Water) category: bottled/jug water delivery.
// Source: brand assets + product photos supplied directly by the merchant via WhatsApp
// (+90 553 999 99 63); location resolved from the merchant's Google Plus Code
// "2M6P+H8H Esenyurt, İstanbul" via Geocoding API (no Google Business listing found —
// this is a small home-delivery water distributor, not a walk-in shop).
// Delivery: standard platform distance pricing (20 TRY/km round-trip), like every store.
const galatawaterStore = {
  "id": 115,
  "name": "روا لتوزيع المياه",
  "category": "المياه المعدنية",
  "image": "/assets/photos/galatawater/cover.jpg",
  "coverImage": "/assets/photos/galatawater/cover.jpg",
  "logoImage": "/assets/photos/galatawater/logo.png",
  "logo": "ر",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 35,
  "minOrder": 0,
  "time": "60 - 120 دقيقة",
  "distance": 0,
  "location": { "lat": 41.0114375, "lng": 28.6858594 },
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0114375,28.6858594",
  "open": true,
  "featured": false,
  "hasOffer": false,
  "offer": "",
  "description": "روا لتوزيع المياه — مياه نقية من ينابيع الطبيعة، جالونات مياه كبيرة وكراتين أكواب مياه معدنية، توصيل لباب البيت في إسنيورت والمناطق المجاورة.",
  "address": "2M6P+H8H Esenyurt/İstanbul, Türkiye",
  "phone": "+90 553 999 99 63",
  "whatsapp": "+90 553 999 99 63",
  "email": "",
  "website": "",
  "sourceUrl": "",
  "hours": "يومياً 9:00 ص – 10:00 م",
  "areas": ["إسنيورت", "مناطق إسطنبول حسب المسافة"],
  "fulfillment": "توصيل",
  "subscription": "احترافي",
  "orderCount": 0,
  "officialStore": true,
  "approvalStatus": "pending"
};

const galatawaterFullCatalog = [
  { name: "مياه مايا داغ دمجانة 19 لتر", description: "دمجانة مياه مايا داغ الطبيعية، سعة 19 لتر، توصيل لباب المنزل.", price: 150, category: "دمجانات المياه", unit: "دمجانة", image: "/assets/photos/galatawater/p1.jpg" },
  { name: "مياه ابانت كاسات 180 مل عدد 60", description: "كرتون مياه ابانت المعدنية، يحتوي 60 كأس سعة 180 مل للكأس، توصيل لباب المنزل.", price: 190, category: "أكواب المياه", unit: "كرتون", image: "/assets/photos/galatawater/p2.jpg" },
  { name: "مضخة يدوية لسحب مياه الدمجانة", description: "مضخة يدوية بسيطة التركيب لسحب المياه من دمجانة 19 لتر، توصيل لباب المنزل.", price: 150, category: "إكسسوارات المياه", unit: "قطعة", image: "/assets/photos/galatawater/p3.jpg" },
  { name: "دمجانة مياه ليلا الطبيعية 19 لتر", description: "دمجانة مياه ينابيع طبيعية ليلا، سعة 19 لتر، توصيل لباب المنزل أو المكتب.", price: 160, category: "دمجانات المياه", unit: "دمجانة", image: "/assets/photos/galatawater/p4.jpg" },
  { name: "مياه كاردلين 200 مل عدد 72", description: "صندوق مياه معدنية كاردلين، يحتوي 72 عبوة سعة 200 مل للعبوة، توصيل لباب المنزل.", price: 225, category: "زجاجات المياه", unit: "صندوق", image: "/assets/photos/galatawater/p5.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const galatawaterProductCatalog = [];

const galatawaterProducts = (galatawaterProductCatalog.length ? galatawaterProductCatalog : galatawaterFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1950001 + index,
  storeId: galatawaterStore.id
}));

// Standard platform delivery (same as every other store) — the old delivery-inclusive
// named complexes and the 150 TRY floor exemption were removed 2026-09-29 at the
// user's request.
const galatawaterDeliverySettings = {
  [galatawaterStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { galatawaterStore, galatawaterProducts, galatawaterDeliverySettings };
}
