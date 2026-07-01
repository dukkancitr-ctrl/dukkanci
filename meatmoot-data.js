// Generated for ميت موت - أورتاكوي (Meat Moot Bosphorus — Ortaköy, Beşiktaş, İstanbul).
// Source: the brand's official Bosphorus branch menu at meatmoot.com.tr/menu/bosphorus-menu/
// (WordPress narep food-menu). 7 smoked-meat cuts, each priced per kilo (4.999 ₺ / kg) and
// served as a full course with homemade sauces, fresh salads and Meat Moot rice (serves 3–4).
// NOTE: meatmootProductCatalog is intentionally emptied in the repo (perf) — the full
// catalog lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const meatmootStore = {
 "id": 71,
 "name": "ميت موت - أورتاكوي",
 "category": "مطاعم",
 "image": "/assets/photos/meatmoot/cover.jpg",
 "coverImage": "/assets/photos/meatmoot/cover.jpg",
 "logoImage": "/assets/photos/meatmoot/logo.png",
 "logo": "م",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0483569,
  "lng": 29.0279678
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Meat%20Moot%20Bosphorus%20-%20Ortak%C3%B6y&query_place_id=ChIJk7jzgT-3yhQRSqTpCVBySbc",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "ميت موت — وجهة اللحوم المدخنة الشهيرة على ضفاف البوسفور في أورتاكوي. لحوم مدخنة ببطء على الطريقة التكساسية: كتف الغنم وموزة الغنم ورقبة الغنم وأضلاع الغنم، وأضلاع العجل وبريسكت العجل وموزة العجل — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. السعر للكيلو، والطبق يكفي 3 إلى 4 أشخاص.",
 "address": "Ortaköy Mah. Yalı Çıkmazı, Beşiktaş, İstanbul",
 "phone": "+90 534 519 57 45",
 "whatsapp": "+90 534 519 57 45",
 "email": "",
 "website": "https://meatmoot.com.tr/",
 "sourceUrl": "https://meatmoot.com.tr/menu/bosphorus-menu/",
 "hours": "يومياً — يرجى تأكيد أوقات العمل",
 "areas": [
  "أورتاكوي",
  "بشكتاش",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const meatmootFullCatalog = [
 // لحم الغنم المدخن
 { name: "موزة غنم مدخنة", price: 4999, category: "لحم الغنم المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/lamb-shank.jpg", description: "موزة غنم (Lamb Shank) مدخنة ببطء حتى تذوب — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. تكفي 3 إلى 4 أشخاص." },
 { name: "رقبة غنم مدخنة", price: 4999, category: "لحم الغنم المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/lamb-neck.jpg", description: "رقبة غنم (Lamb Neck) مدخنة ببطء — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. تكفي 3 إلى 4 أشخاص." },
 { name: "كتف غنم مدخن", price: 4999, category: "لحم الغنم المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/lamb-shoulder.jpg", description: "كتف غنم (Lamb Shoulder) مدخن ببطء على الطريقة التكساسية — يُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. يكفي 3 إلى 4 أشخاص." },
 { name: "أضلاع غنم مدخنة", price: 4999, category: "لحم الغنم المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/lamb-ribs.jpg", description: "أضلاع (ريش) غنم (Lamb Ribs) مدخنة ببطء — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. تكفي 3 إلى 4 أشخاص." },
 // لحم العجل المدخن
 { name: "أضلاع عجل مدخنة", price: 4999, category: "لحم العجل المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/beef-ribs.jpg", description: "أضلاع عجل (Beef Short Ribs) مدخنة ببطء — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. تكفي 3 إلى 4 أشخاص." },
 { name: "بريسكت عجل مدخن", price: 4999, category: "لحم العجل المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/beef-brisket.jpg", description: "صدر عجل بريسكت (Beef Brisket) مدخن ببطء على الطريقة التكساسية — يُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. يكفي 3 إلى 4 أشخاص." },
 { name: "موزة عجل مدخنة", price: 4999, category: "لحم العجل المدخن", unit: "كيلو", image: "/assets/photos/meatmoot/items/beef-shank.jpg", description: "موزة عجل (Beef Shank) مدخنة ببطء — تُقدَّم وجبة متكاملة مع الصلصات المنزلية والسلطات الطازجة وأرز ميت موت الخاص. تكفي 3 إلى 4 أشخاص." }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const meatmootProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const meatmootProducts = (meatmootProductCatalog.length ? meatmootProductCatalog : meatmootFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1550001 + index,
  storeId: meatmootStore.id
}));

const meatmootDeliverySettings = {
  [meatmootStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { meatmootStore, meatmootProducts, meatmootDeliverySettings };
}
