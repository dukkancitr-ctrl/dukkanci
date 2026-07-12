// Generated for فلافل النور (Al Noor Falafel) — Mehterçeşme, Esenyurt/İstanbul.
// Levantine falafel/humus/fatteh restaurant. Source: menu.akillikurye.com/AlNoor-Restaurant
// (backend.akillikurye.com REST API, native Arabic names, prices in TL, one flat menu — no
// size/addon options in the source). 65 products across 5 categories, every item has its own
// unique source photo (no shared-image collisions).
// NOTE: alnoorProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via the Supabase MCP execute_sql (anon-key writes to
// stores/products are RLS-blocked — see memory [[adding-a-restaurant]]).
const alnoorStore = {
 "id": 86,
 "name": "فلافل النور",
 "category": "مطاعم",
 "image": "/assets/photos/alnoor/cover.jpg",
 "coverImage": "/assets/photos/alnoor/cover.jpg",
 "logoImage": "/assets/photos/alnoor/logo.jpg",
 "logo": "ف",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0213625,
  "lng": 28.6648594
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0213625,28.6648594",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "فلافل النور — مطعم فلافل وحمص وفول ومسبحة في حي مهترچشمة بإسنيورت، إسطنبول. صحون فول وحمص وفتة ومسبحة ومتبل، فلافل ومشاوي (سودة، شيش طاووق)، سندويشات فلافل وبطاطا ومشاوي، إضافة إلى كيلوات جاهزة (فول، حمص، متبل، مخلل) ومشروبات باردة.",
 "address": "حي مهترچشمة، شارع حاجي بيرام ولي 87B، إسنيورت، إسطنبول، تركيا",
 "phone": "+90 537 048 34 92",
 "whatsapp": "+90 537 048 34 92",
 "email": "",
 "website": "",
 "sourceUrl": "https://menu.akillikurye.com/AlNoor-Restaurant",
 "hours": "يومياً من 9:00 صباحاً حتى 10:00 مساءً",
 "areas": [
  "إسنيورت",
  "مهترچشمة",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const alnoorFullCatalog = [
  // الأطباق
  { name: "صحن فول بزيت", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1509.jpg" },
  { name: "صحن مسبحة بلحمة", price: 260, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1517.jpg" },
  { name: "صحن حمص بزيت أو طحينة", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1523.jpeg" },
  { name: "صحن شيش طاووق", price: 285, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1522.jpg" },
  { name: "صحن سودة", price: 285, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1521.jpg" },
  { name: "فلافل النور عربي", price: 200, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1520.jpg" },
  { name: "صحن فلافل", price: 110, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1519.jpeg" },
  { name: "صحن بطاطا", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1518.jpeg" },
  { name: "صحن فتة بلحمة", price: 275, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1516.jpeg" },
  { name: "صحن فتة فقسه", price: 170, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1515.jpg" },
  { name: "صحن فتة بكاجو", price: 210, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1514.jpeg" },
  { name: "صحن فتة بسمنة", price: 170, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1513.jpg" },
  { name: "صحن بيض", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1512.jpeg" },
  { name: "صحن متبل", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1511.jpeg" },
  { name: "صحن مسبحة", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1510.jpg" },
  { name: "صحن فول بطحينة", price: 150, category: "الأطباق", unit: "صحن", image: "/assets/photos/alnoor/item-1508.jpg" },
  // الأصناف
  { name: "كيلو حمص بطحينة", price: 240, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1526.jpeg" },
  { name: "كيلو فول بزيت", price: 240, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1525.jpeg" },
  { name: "كيلو فول بطحينة", price: 240, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1524.jpeg" },
  { name: "كيلو حمص بزيت", price: 240, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1527.jpeg" },
  { name: "كيلو فول سادة", price: 180, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1528.jpg" },
  { name: "كيلو حمص حب سادة", price: 180, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1529.jpeg" },
  { name: "كيلو تتبيلة فلافل", price: 150, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1530.jpeg" },
  { name: "كيلو مسبحة ناعمة", price: 200, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1531.jpeg" },
  { name: "كيلو متبل", price: 200, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1532.jpeg" },
  { name: "كيلو مخلل نمرة 1", price: 150, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1533.jpg" },
  { name: "كيلو فليفلة حلوة", price: 200, category: "الأصناف", unit: "كيلو", image: "/assets/photos/alnoor/item-1534.jpg" },
  // السندويشات
  { name: "فلافل عادي", price: 100, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1535.jpeg" },
  { name: "بطاطا دبل", price: 120, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1538.jpeg" },
  { name: "فلافل صمون", price: 110, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1539.jpeg" },
  { name: "فلافل صاج", price: 100, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1540.jpeg" },
  { name: "سودة", price: 145, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1541.jpeg" },
  { name: "سودة دبل", price: 160, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1542.jpeg" },
  { name: "شيش طاووق", price: 145, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1543.jpeg" },
  { name: "شيش طاووق دبل", price: 160, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1544.jpeg" },
  { name: "مقالي", price: 135, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1545.jpeg" },
  { name: "فلافل دبل", price: 110, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1536.jpeg" },
  { name: "بطاطا عادية", price: 110, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1537.jpeg" },
  { name: "مقالي دبل", price: 145, category: "السندويشات", unit: "سندويش", image: "/assets/photos/alnoor/item-1546.jpeg" },
  // الأطباق الخارجية
  { name: "صحن فتة بكاجو", price: 210, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1560.jpeg" },
  { name: "صحن فول بطحينة وسط", price: 140, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1547.jpg" },
  { name: "صحن فول كبير", price: 220, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1548.jpg" },
  { name: "صحن فتة وسط", price: 170, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1549.jpg" },
  { name: "صحن فتة كبير", price: 225, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1550.jpg" },
  { name: "وجبة سودة كاملة", price: 285, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1551.jpg" },
  { name: "وجية شيش كاملة", price: 285, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1552.jpg" },
  { name: "صحن مقالي", price: 225, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1553.jpg" },
  { name: "صحن مسبحة وسط", price: 150, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1554.jpeg" },
  { name: "صحن مسبحة صغير", price: 100, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1555.jpeg" },
  { name: "صحن مسبحة بلحمة", price: 260, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1556.jpeg" },
  { name: "فلافل النور عربي", price: 200, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1557.jpg" },
  { name: "صحن متبل وسط", price: 150, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1558.jpeg" },
  { name: "صحن متبل صغير", price: 100, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1559.jpeg" },
  { name: "صحن فتة بلحمة", price: 275, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1561.jpeg" },
  { name: "صحن بطاطا", price: 150, category: "الأطباق الخارجية", unit: "صحن", image: "/assets/photos/alnoor/item-1562.jpeg" },
  // المشروبات
  { name: "ببسي بلور", price: 35, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1563.jpeg" },
  { name: "فانتا بلور", price: 35, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1564.jpeg" },
  { name: "ببسي تنك", price: 45, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1565.jpeg" },
  { name: "فانتا تنك", price: 45, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1566.jpeg" },
  { name: "سفن آب", price: 45, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1567.jpeg" },
  { name: "عيران كبير", price: 30, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1568.jpeg" },
  { name: "كولا لتر", price: 65, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1569.jpeg" },
  { name: "كولا كبيرة", price: 80, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1570.jpeg" },
  { name: "مي صغيرة", price: 15, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1571.jpeg" },
  { name: "فانتا لتر", price: 65, category: "المشروبات", unit: "مشروب", image: "/assets/photos/alnoor/item-1572.jpeg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const alnoorProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const alnoorProducts = (alnoorProductCatalog.length ? alnoorProductCatalog : alnoorFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1680001 + index,
  storeId: alnoorStore.id
}));

const alnoorDeliverySettings = {
  [alnoorStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { alnoorStore, alnoorProducts, alnoorDeliverySettings };
}
