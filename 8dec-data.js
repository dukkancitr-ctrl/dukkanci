// Generated for 8 DEC COFFEE (8 December / قهوة 8 ديسمبر) — Fatih/İstanbul.
// Source: https://8dec.com.tr/ar/shop (Laravel storefront, embedded allCategories JSON). Prices in Turkish Lira,
// from the official Arabic menu. 12 specialty-coffee blends (Brazilian / Colombian / Arabica / 8-Dec special),
// each sold in 200g & 500g — modeled as one card per blend with a «الوزن» option (200غ base, 500غ +delta),
// mirroring the weight-variant pattern used by reyhan-data.js.
// NOTE: dec8ProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives in
// Supabase and is pushed via the session's push script.
const dec8Store = {
 "id": 82,
 "name": "8 DEC COFFEE",
 "category": "مكسرات وبهارات",
 "image": "/assets/photos/8dec/cover.jpg",
 "coverImage": "/assets/photos/8dec/cover.jpg",
 "logoImage": "/assets/photos/8dec/logo.png",
 "logo": "8",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 30,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0184663,
  "lng": 28.9440365
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=8%20DEC%20COFFEE&query_place_id=ChIJTYsZUyi7yhQRZyWuDoqCAdQ",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "متجر 8 DEC COFFEE للبُنّ المختصّ في الفاتح، إسطنبول — قهوة عربية محمّصة طازجة: برازيلية، كولومبية، أرابيكا، وخلطة «8 ديسمبر» الخاصة، سادة أو بالهيل الأخضر (وسط/إكسترا)، متوفّرة بأوزان 200غ و500غ. تصل طازجة إلى بابك.",
 "address": "حي آق شمس الدين، شارع بالي باشا 130/A، الفاتح، إسطنبول",
 "phone": "+90 535 887 60 04",
 "whatsapp": "+90 535 887 60 04",
 "email": "8deccoffee@gmail.com",
 "website": "https://8dec.com.tr/ar/shop",
 "sourceUrl": "https://8dec.com.tr/ar/shop",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "الفاتح",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo.
const dec8FullCatalog = [
 {
  "name": "قهوة برازيلية سادة",
  "price": 136,
  "category": "قهوة برازيلية",
  "unit": "",
  "image": "/assets/photos/8dec/170.jpg",
  "sourceId": "170",
  "description": "قهوة برازيلية فاخرة",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     204
    ]
   }
  ]
 },
 {
  "name": "قهوة برازيلية هيل وسط",
  "price": 148,
  "category": "قهوة برازيلية",
  "unit": "",
  "image": "/assets/photos/8dec/209.jpg",
  "sourceId": "209",
  "description": "قهوة برازيلية فاخرة 92% هيل أخضر 8%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     222
    ]
   }
  ]
 },
 {
  "name": "قهوة برازيلية هيل إكسترا",
  "price": 160,
  "category": "قهوة برازيلية",
  "unit": "",
  "image": "/assets/photos/8dec/206.jpg",
  "sourceId": "206",
  "description": "قهوة برازيلية فاخرة 82% هيل أخضر 18%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     240
    ]
   }
  ]
 },
 {
  "name": "قهوة كولومبية سادة",
  "price": 180,
  "category": "قهوة كولومبية",
  "unit": "",
  "image": "/assets/photos/8dec/210.jpg",
  "sourceId": "210",
  "description": "قهوة كولومبية فاخرة",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     270
    ]
   }
  ]
 },
 {
  "name": "قهوة كولومبية هيل وسط",
  "price": 184,
  "category": "قهوة كولومبية",
  "unit": "",
  "image": "/assets/photos/8dec/212.jpg",
  "sourceId": "212",
  "description": "قهوة كولومبية فاخرة 92% هيل أخضر 8%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     276
    ]
   }
  ]
 },
 {
  "name": "قهوة كولومبية هيل إكسترا",
  "price": 216,
  "category": "قهوة كولومبية",
  "unit": "",
  "image": "/assets/photos/8dec/173.jpg",
  "sourceId": "173",
  "description": "قهوة كولومبية فاخرة 82% هيل أخضر 18%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     324
    ]
   }
  ]
 },
 {
  "name": "قهوة أرابيكا سادة",
  "price": 184,
  "category": "قهوة أرابيكا",
  "unit": "",
  "image": "/assets/photos/8dec/216.jpg",
  "sourceId": "216",
  "description": "قهوة أربيكا بلانتشن",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     276
    ]
   }
  ]
 },
 {
  "name": "قهوة أرابيكا هيل وسط",
  "price": 216,
  "category": "قهوة أرابيكا",
  "unit": "",
  "image": "/assets/photos/8dec/214.jpg",
  "sourceId": "214",
  "description": "قهوة أربيكا بلانتشن 92% هيل أخضر 8%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     324
    ]
   }
  ]
 },
 {
  "name": "قهوة أرابيكا هيل إكسترا",
  "price": 220,
  "category": "قهوة أرابيكا",
  "unit": "",
  "image": "/assets/photos/8dec/176.jpg",
  "sourceId": "176",
  "description": "قهوة أربيكا بلانتشن 82% هيل أخضر 18%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     330
    ]
   }
  ]
 },
 {
  "name": "قهوة 8 ديسمبر الخاصة – سادة",
  "price": 176,
  "category": "خلطة 8 ديسمبر الخاصة",
  "unit": "",
  "image": "/assets/photos/8dec/218.jpg",
  "sourceId": "218",
  "description": "خليط انواع فاخرة من البن",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     264
    ]
   }
  ]
 },
 {
  "name": "قهوة 8 ديسمبر الخاصة – هيل وسط",
  "price": 188,
  "category": "خلطة 8 ديسمبر الخاصة",
  "unit": "",
  "image": "/assets/photos/8dec/171.jpg",
  "sourceId": "171",
  "description": "خليط انواع فاخرة من البن 92% هيل أخضر 8%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     282
    ]
   }
  ]
 },
 {
  "name": "قهوة 8 ديسمبر الخاصة – هيل إكسترا",
  "price": 200,
  "category": "خلطة 8 ديسمبر الخاصة",
  "unit": "",
  "image": "/assets/photos/8dec/175.jpg",
  "sourceId": "175",
  "description": "خليط انواع فاخرة من البن 82% هيل أخضر 18%",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "200غ",
     "500غ"
    ],
    "extra": [
     0,
     300
    ]
   }
  ]
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const dec8ProductCatalog = [];

const dec8Products = (dec8ProductCatalog.length ? dec8ProductCatalog : dec8FullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1660001 + index,
  storeId: dec8Store.id
}));

const dec8DeliverySettings = {
  [dec8Store.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { dec8Store, dec8Products, dec8DeliverySettings };
}
