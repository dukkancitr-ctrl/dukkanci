// Generated for بيت بيروت (Beit Beyrut) — Kayabaşı, Başakşehir/İstanbul.
// Lebanese manakish/foul-hummus restaurant. Source: qrlist.app/en/beitbeyrutgn
// (Nuxt SPA over a Laravel backend; store row via __NUXT_DATA__, full menu via the
// public /api/material?store_id=93&category_id=<id> endpoint — 66 products across
// 7 real categories, every item has its own unique source photo).
// NOTE: beitbeyrutProductCatalog is intentionally emptied in the repo (perf) — the full
// catalog lives in Supabase and is pushed via the Supabase MCP execute_sql (anon-key
// writes to stores/products are RLS-blocked — see memory [[adding-a-restaurant]]).
const beitbeyrutStore = {
 "id": 89,
 "name": "بيت بيروت",
 "category": "مطاعم",
 "image": "/assets/photos/beitbeyrut/cover.jpg",
 "coverImage": "/assets/photos/beitbeyrut/cover.jpg",
 "logoImage": "/assets/photos/beitbeyrut/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.119112,
  "lng": 28.7714102
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.119112,28.7714102",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "بيت بيروت — مطعم لبناني في حي كايا شهير، باشاك شهير، إسطنبول. مناقيش ومعجنات صباحية (جبنة، زعتر، بيتزا، سبانخ)، أطباق فول وحمص ومسبحة وفتة، فلافل، مقبلات ساخنة كالبطاطا الحارة والشكشوكة، ومشروبات وعصائر طازجة.",
 "address": "حي كايا باشي، بلوار عدنان مندريس، بارك مافيرا 1 - بلوك A04 رقم 10، باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 533 130 17 31",
 "whatsapp": "+90 533 130 17 31",
 "email": "",
 "website": "",
 "sourceUrl": "https://qrlist.app/en/beitbeyrutgn",
 "hours": "يومياً 9:00 ص – 9:00 م",
 "areas": [
  "باشاك شهير",
  "كايا شهير",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const beitbeyrutFullCatalog = [
  // مناقيش
  { name: "مناقيش بيت بيروت الخاصة", price: 350, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7915.jpg" },
  { name: "مناقيش زعتر بالخضار", price: 240, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-10328.jpg" },
  { name: "مناقيش سبانخ", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-10329.jpg" },
  { name: "موسمية بالجبنة", price: 295, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-16959.jpg" },
  { name: "موسمية بالزعتر", price: 295, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-16960.jpg" },
  { name: "مناقيش بيتزا", price: 260, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19756.jpg" },
  { name: "مناقيش بيتزا بالسجق", price: 320, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19757.jpg" },
  { name: "مناقيش محمرة بيت بيروت", price: 350, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19761.jpg" },
  { name: "مناقيش جبنة", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7677.jpg" },
  { name: "مناقيش جبنة بالخضار", price: 240, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7683.jpg" },
  { name: "مناقيش جبنة بالسجق", price: 290, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7684.jpg" },
  { name: "مناقيش جبنة بالقاورما", price: 290, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7685.jpg" },
  { name: "كعك بالجبنة", price: 230, category: "مناقيش", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7917.jpg" },
  { name: "مناقيش جبنة وزعتر", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7679.jpg" },
  { name: "مناقيش زعتر", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7678.jpg" },
  { name: "مناقيش تركية حارة", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7914.jpg" },
  { name: "مناقيش محمرة بالجبنة", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7681.jpg" },
  { name: "مناقيش محمرة", price: 210, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7680.jpg" },
  { name: "مناقيش كشك", price: 230, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7682.jpg" },
  { name: "مناقيش لبنة بالخضار", price: 240, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7687.jpg" },
  { name: "لحم بعجين", price: 250, category: "مناقيش", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7918.jpg" },
  // معجنات
  { name: "فطيرة زعتر", price: 25, category: "معجنات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7689.jpg" },
  { name: "فطيرة جبنة كيري", price: 25, category: "معجنات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7699.jpg" },
  { name: "فطيرة بيتزا", price: 25, category: "معجنات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7693.jpg" },
  { name: "فطيرة سبانخ", price: 25, category: "معجنات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7698.jpg" },
  { name: "صفيحة بعلبكية", price: 30, category: "معجنات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7696.jpg" },
  // فول وحمص
  { name: "فول", price: 280, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7700.jpg" },
  { name: "فول بالخضار", price: 300, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7701.jpg" },
  { name: "فول بالطحينة", price: 300, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7702.jpg" },
  { name: "مسبحة", price: 300, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7703.jpg" },
  { name: "حمص بالطحينة", price: 280, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7704.jpg" },
  { name: "حمص باللحمة", price: 365, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7705.jpg" },
  { name: "حمص بالقاورما", price: 365, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7706.jpg" },
  { name: "بليلة", price: 280, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7707.jpg" },
  { name: "طبق بيت بيروت", price: 435, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7708.jpg" },
  { name: "فتة بالطحينة", price: 340, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7709.jpg" },
  { name: "فتة", price: 340, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7710.jpg" },
  { name: "فتة باللحمة", price: 440, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7711.jpg" },
  { name: "فول بالطحينة والخضار", price: 305, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-10326.jpg" },
  { name: "مسبحة بالخضار", price: 305, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-10327.jpg" },
  { name: "متبل", price: 305, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19754.jpg" },
  { name: "بليلة بالخضار", price: 300, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19758.jpg" },
  { name: "قدسية", price: 305, category: "فول وحمص", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19760.jpg" },
  // فلافل
  { name: "ساندويش فلافل", price: 145, category: "فلافل", unit: "سندويش", image: "/assets/photos/beitbeyrut/m-7712.jpg" },
  { name: "صحن فلافل 12 قطعة", price: 240, category: "فلافل", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7713.jpg" },
  { name: "صحن فلافل 6 قطع", price: 170, category: "فلافل", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7714.jpg" },
  { name: "بطاطا مقلية", price: 165, category: "فلافل", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7715.jpg" },
  { name: "ساندويش بطاطا مقلية", price: 145, category: "فلافل", unit: "سندويش", image: "/assets/photos/beitbeyrut/m-7716.jpg" },
  // مقبلات
  { name: "بيض بالسجق", price: 315, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7718.jpg" },
  { name: "بيض بالقاورما", price: 315, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7719.jpg" },
  { name: "شكشوكة", price: 255, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7720.jpg" },
  { name: "بطاطا حارة", price: 255, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-7934.jpg" },
  { name: "كبدة دجاج", price: 285, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-15502.jpg" },
  { name: "جبنة حلوم", price: 285, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19751.jpg" },
  { name: "نخاع غنم", price: 370, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19752.jpg" },
  { name: "خصى غنم", price: 345, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19753.jpg" },
  { name: "أومليت", price: 185, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-19759.jpg" },
  { name: "شكشوكة بالحلوم", price: 280, category: "مقبلات", unit: "صحن", image: "/assets/photos/beitbeyrut/m-20031.jpg" },
  // مشروبات
  { name: "عيران", price: 60, category: "مشروبات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-7725.jpg" },
  { name: "مياه", price: 35, category: "مشروبات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-19746.jpg" },
  { name: "تشاملجا برتقال", price: 70, category: "مشروبات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-19747.jpg" },
  { name: "تورك كولا", price: 70, category: "مشروبات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-19748.jpg" },
  { name: "تشاملجا", price: 70, category: "مشروبات", unit: "قطعة", image: "/assets/photos/beitbeyrut/m-19749.jpg" },
  { name: "شاي", price: 50, category: "مشروبات", unit: "كوب", image: "/assets/photos/beitbeyrut/m-19750.jpg" },
  // عصائر طازجة
  { name: "عصير برتقال", price: 190, category: "عصائر طازجة", unit: "كوب", image: "/assets/photos/beitbeyrut/m-7727.jpg" },
  { name: "عصير جزر", price: 190, category: "عصائر طازجة", unit: "كوب", image: "/assets/photos/beitbeyrut/m-7728.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const beitbeyrutProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const beitbeyrutProducts = (beitbeyrutProductCatalog.length ? beitbeyrutProductCatalog : beitbeyrutFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1710001 + index,
  storeId: beitbeyrutStore.id
}));

const beitbeyrutDeliverySettings = {
  [beitbeyrutStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { beitbeyrutStore, beitbeyrutProducts, beitbeyrutDeliverySettings };
}
