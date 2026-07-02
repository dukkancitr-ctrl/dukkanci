// Generated for عسل بطون النحل (Bütün Nahl Honey) — Fatih Mah., 934. Sk. No:2, Esenyurt/İstanbul.
// Source: https://butunalnahlhoney.com (WordPress + WooCommerce Store API; native Arabic, TRY).
// Honey specialist. NEW store-level category «مواد غذائية متخصصة». 34 source products →
// 18 products: each honey varietal's 3 weights merged into an «الوزن» (250غ/480غ/970غ) option;
// out-of-stock «شمع العسل» and the promotional «عرض اطلاق الموقع» flyer dropped. Every product
// has a unique real photo. Store id 79, product block 1630001.
// NOTE: nahlProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives
// in Supabase and is pushed via a guarded-insert script.
const nahlStore = {
 "id": 79,
 "name": "عسل بطون النحل",
 "category": "مواد غذائية متخصصة",
 "image": "/assets/photos/nahl/cover.jpg",
 "coverImage": "/assets/photos/nahl/cover.jpg",
 "logoImage": "/assets/photos/nahl/logo.png",
 "logo": "ع",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 90 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0313706,
  "lng": 28.6766351
 },
 "mapUrl": "https://www.google.com/maps?q=41.0313706,28.6766351",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "عسل بطون النحل — متجر متخصص بالعسل الطبيعي 100% ومنتجات النحل في أسنيورت بإسطنبول. تشكيلة واسعة من أنواع العسل التركي الأصيل (السدر، الكستناء، الجبلي، حبة البركة، الزهور البرية، الحمضيات، اليانسون، وعسل بشهده) بأوزان مختلفة، إضافة إلى حبوب اللقاح والعكبر، زيت الزيتون والسمن البلدي، والمكمّلات الطبيعية. منتجات طبيعية مختارة تصل إلى بابك.",
 "address": "حي الفاتح، شارع 934 رقم 2، أسنيورت، إسطنبول 34513، تركيا",
 "phone": "+90 537 210 94 11",
 "whatsapp": "+90 537 210 94 11",
 "email": "",
 "website": "https://butunalnahlhoney.com",
 "sourceUrl": "https://butunalnahlhoney.com",
 "hours": "يومياً من 09:00 صباحاً حتى 09:00 مساءً",
 "areas": [
  "أسنيورت",
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
const nahlFullCatalog = [
 {
  "name": "عسل السدر",
  "price": 747,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/4975.jpg",
  "sourceId": "4975",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "480غ",
     "970غ"
    ],
    "extra": [
     0,
     747,
     2241
    ]
   }
  ]
 },
 {
  "name": "عسل الكستناء",
  "price": 992,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/4985.jpg",
  "sourceId": "4985",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "480غ",
     "975غ"
    ],
    "extra": [
     0,
     992,
     2976
    ]
   }
  ]
 },
 {
  "name": "عسل جبلي تركي",
  "price": 601,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/4971.jpg",
  "sourceId": "4971",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "480غ",
     "970غ"
    ],
    "extra": [
     0,
     601,
     1803
    ]
   }
  ]
 },
 {
  "name": "عسل حبة البركة",
  "price": 455,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/79.jpg",
  "sourceId": "79",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "475غ",
     "975غ"
    ],
    "extra": [
     0,
     455,
     1366
    ]
   }
  ]
 },
 {
  "name": "عسل الزهور البرية",
  "price": 366,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/22.jpg",
  "sourceId": "22",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "475غ",
     "975غ"
    ],
    "extra": [
     0,
     369,
     1105
    ]
   }
  ]
 },
 {
  "name": "عسل الحمضيات",
  "price": 163,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/4977.jpg",
  "sourceId": "4977",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "480غ",
     "975غ"
    ],
    "extra": [
     0,
     164,
     771
    ]
   }
  ]
 },
 {
  "name": "عسل اليانسون",
  "price": 233,
  "category": "أنواع العسل الطبيعي",
  "unit": "",
  "image": "/assets/photos/nahl/4982.jpg",
  "sourceId": "4982",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250غ",
     "480غ",
     "975غ"
    ],
    "extra": [
     0,
     234,
     701
    ]
   }
  ]
 },
 {
  "name": "عسل بشهده طبيعي",
  "price": 1074,
  "category": "أنواع العسل الطبيعي",
  "unit": "علبة",
  "image": "/assets/photos/nahl/126.jpg",
  "sourceId": "126",
  "oldPrice": 1132
 },
 {
  "name": "حبوب اللقاح 440غ",
  "price": 934,
  "category": "منتجات النحل",
  "unit": "علبة",
  "image": "/assets/photos/nahl/93.jpg",
  "sourceId": "93"
 },
 {
  "name": "بودرة عكبر العسل",
  "price": 23,
  "category": "منتجات النحل",
  "unit": "علبة",
  "image": "/assets/photos/nahl/4737.jpg",
  "sourceId": "4737"
 },
 {
  "name": "زيت عكبر العسل",
  "price": 354,
  "category": "منتجات النحل",
  "unit": "عبوة",
  "image": "/assets/photos/nahl/99.jpg",
  "sourceId": "99"
 },
 {
  "name": "سمن عربي بقري أصلي",
  "price": 707,
  "category": "زيوت وسمن بلدي",
  "unit": "عبوة",
  "image": "/assets/photos/nahl/73.jpg",
  "sourceId": "73"
 },
 {
  "name": "زيت زيتون 1 لتر",
  "price": 495,
  "category": "زيوت وسمن بلدي",
  "unit": "",
  "image": "/assets/photos/nahl/67.jpg",
  "sourceId": "67",
  "oldPrice": 514
 },
 {
  "name": "زيت زيتون 5 لتر",
  "price": 2288,
  "category": "زيوت وسمن بلدي",
  "unit": "",
  "image": "/assets/photos/nahl/60.jpg",
  "sourceId": "60",
  "oldPrice": 2474
 },
 {
  "name": "زيت زيتون تنكة",
  "price": 7236,
  "category": "زيوت وسمن بلدي",
  "unit": "",
  "image": "/assets/photos/nahl/53.jpg",
  "sourceId": "53",
  "oldPrice": 7470
 },
 {
  "name": "سمن غنم",
  "price": 1144,
  "category": "زيوت وسمن بلدي",
  "unit": "عبوة",
  "image": "/assets/photos/nahl/47.jpg",
  "sourceId": "47",
  "oldPrice": 1273
 },
 {
  "name": "بودرة طلع النخيل",
  "price": 22,
  "category": "مكمّلات وأعشاب",
  "unit": "علبة",
  "image": "/assets/photos/nahl/4736.jpg",
  "sourceId": "4736"
 },
 {
  "name": "بودرة جنسينغ كوري",
  "price": 24,
  "category": "مكمّلات وأعشاب",
  "unit": "علبة",
  "image": "/assets/photos/nahl/4735.jpg",
  "sourceId": "4735"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const nahlProductCatalog = [];

const nahlProducts = (nahlProductCatalog.length ? nahlProductCatalog : nahlFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1630001 + index,
  storeId: nahlStore.id
}));

const nahlDeliverySettings = {
  [nahlStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 40, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { nahlStore, nahlProducts, nahlDeliverySettings };
}
