// Generated for Charco Chicken (تشاركو تشيكن) — Fatih branch, Akşemsettin Cd. No:49/A, İstanbul.
// Grilled/charcoal chicken fast-food chain. Source: tr.charcochicken.com.tr (branch landing page,
// menu.jpg photo menu) + linktr.ee/Charcochicken (branch links) + Google Maps (coords/rating).
// 15 products across 4 categories, cropped individually from the single composite menu photo.
const charcochickenStore = {
 "id": 92,
 "name": "تشاركو تشيكن",
 "category": "مطاعم",
 "image": "/assets/photos/charcochicken/cover.jpg",
 "coverImage": "/assets/photos/charcochicken/cover.jpg",
 "logoImage": "/assets/photos/charcochicken/logo.png",
 "logo": "C",
 "rating": 4.6,
 "reviews": 1703,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0199967,
  "lng": 28.9411767
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0199967,28.9411767",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "تشاركو تشيكن — دجاج مشوي على الفحم بنكهات عالمية (تانجي، فولكانو، بي بي، مدخن، تشاركو الأصلي)، يقدَّم مع أرز مدخن وخبز بيتا وصوصات خاصة وأطباق حمص وسلطات. فرع فاتح، إسطنبول.",
 "address": "Akşemsettin, Akşemsettin Cd. No:49/A, 34080 Fatih/İstanbul",
 "phone": "+90 501 262 22 23",
 "whatsapp": "+90 501 262 22 23",
 "email": "",
 "website": "https://www.charcochicken.com.tr",
 "sourceUrl": "https://tr.charcochicken.com.tr/",
 "hours": "يومياً من 12:30 ظهراً حتى 11:00 مساءً",
 "areas": [
  "فاتح",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const charcochickenFullCatalog = [
  // الأطباق الرئيسية
  { name: "دجاج تانجي كامل مع الأرز والخبز", price: 950, category: "الأطباق الرئيسية", unit: "طبق", image: "/assets/photos/charcochicken/p01_tangy.jpg" },
  { name: "دجاج فولكانو الحار كامل", price: 950, category: "الأطباق الرئيسية", unit: "طبق", image: "/assets/photos/charcochicken/p02_volcano.jpg" },
  { name: "دجاج بي بي كامل", price: 950, category: "الأطباق الرئيسية", unit: "طبق", image: "/assets/photos/charcochicken/p03_beebee.jpg" },
  { name: "دجاج مدخن كامل (بدون صوص)", price: 950, category: "الأطباق الرئيسية", unit: "طبق", image: "/assets/photos/charcochicken/p04_smoked.jpg" },
  { name: "دجاج تشاركو الأصلي كامل", price: 950, category: "الأطباق الرئيسية", unit: "طبق", image: "/assets/photos/charcochicken/p05_charco.jpg" },
  // الأطباق الجانبية
  { name: "أرز مدخن", price: 200, category: "الأطباق الجانبية", unit: "طبق", image: "/assets/photos/charcochicken/p06_pilav.jpg" },
  { name: "خبز بيتا (3 قطع)", price: 55, category: "الأطباق الجانبية", unit: "طلب", image: "/assets/photos/charcochicken/p07_pide.jpg" },
  // الصوصات الخاصة
  { name: "صوص خاص رقم 1250", price: 55, category: "الصوصات الخاصة", unit: "كوب", image: "/assets/photos/charcochicken/p08_sos1250.jpg" },
  { name: "صوص خاص رقم 613", price: 55, category: "الصوصات الخاصة", unit: "كوب", image: "/assets/photos/charcochicken/p09_sos613.jpg" },
  { name: "صوص خاص رقم 1505", price: 55, category: "الصوصات الخاصة", unit: "كوب", image: "/assets/photos/charcochicken/p10_sos1505.jpg" },
  // الحمص والسلطات
  { name: "حمص تانجي", price: 200, category: "الحمص والسلطات", unit: "طبق", image: "/assets/photos/charcochicken/p11_humus_tangy.jpg" },
  { name: "حمص فولكانو الحار", price: 200, category: "الحمص والسلطات", unit: "طبق", image: "/assets/photos/charcochicken/p12_humus_volcano.jpg" },
  { name: "سلطة تشاركو", price: 200, category: "الحمص والسلطات", unit: "طبق", image: "/assets/photos/charcochicken/p13_charco_salata.jpg" },
  { name: "حمص تشاركو الأخضر", price: 200, category: "الحمص والسلطات", unit: "طبق", image: "/assets/photos/charcochicken/p14_charco_humus.jpg" },
  { name: "علبة حمص مكس (3 أنواع)", price: 275, category: "الحمص والسلطات", unit: "علبة", image: "/assets/photos/charcochicken/p15_humus_mix.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const charcochickenProductCatalog = [];

const charcochickenProducts = (charcochickenProductCatalog.length ? charcochickenProductCatalog : charcochickenFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1740001 + index,
  storeId: charcochickenStore.id
}));

const charcochickenDeliverySettings = {
  [charcochickenStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { charcochickenStore, charcochickenProducts, charcochickenDeliverySettings };
}
