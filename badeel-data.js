// Generated for بديل للحلويات الصحية (Badeel Treats) — Başakşehir, İstanbul.
// Source: https://badeeltreats.com (Shopify). Healthy, sugar-free & gluten-free sweets.
// 16 source products → the 2 shared-image GF/regular tart pairs merged into one product each
// (النوع/الخيار option), giving 14 products, every one with a unique real photo.
// NOTE: badeelProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const badeelStore = {
 "id": 57,
 "name": "بديل تريتس",
 "category": "حلويات",
 "image": "/assets/photos/badeel/cover.jpg",
 "coverImage": "/assets/photos/badeel/cover.jpg",
 "logoImage": "/assets/photos/badeel/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.120688,
  "lng": 28.765812
 },
 "mapUrl": "https://www.google.com/maps?q=4QC8%2B78+Ba%C5%9Fak%C5%9Fehir+%C4%B0stanbul",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "بديل — حلويات صحية خالية من السكر والغلوتين: كوكيز، تارت، بسكويت ومقرمشات، وسناكات طبيعية محلّاة بالتمر والعسل. مكونات نظيفة 100% ونكهات لذيذة بدون شعور بالذنب.",
 "address": "باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 534 434 44 60",
 "whatsapp": "+90 534 434 44 60",
 "email": "",
 "website": "https://badeeltreats.com",
 "sourceUrl": "https://badeeltreats.com/collections/all-products",
 "hours": "يومياً من 10 صباحاً حتى 9 مساءً",
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

// Full catalog used ONLY for the Supabase push; emptied in the committed repo.
const badeelFullCatalog = [
 {
  "name": "عيدان البسكويت الخالية من الغلوتين",
  "price": 330,
  "category": "بسكويت ومقرمشات",
  "unit": "150 جرام",
  "image": "/assets/photos/badeel/gluten-free-biscuit-sticks.jpg",
  "description": "استمتع بقرمشة البسكويت ونكهة الشوكولاتة الغنية مع عيدان البسكويت من بديل. خالية من الغلوتين وخالية من السكر. رائعة كتحلية خفيفة وصحية المكونات: دقيق الشوفان, دقيق الارز, نشا الذرة, زبدة, ماتيتول, شوكولاتة خالية من السكر"
 },
 {
  "name": "كرات البندق",
  "price": 950,
  "category": "سناكات صحية",
  "unit": "20 قطعة",
  "image": "/assets/photos/badeel/hazelnut-chocolate-balls.jpg",
  "description": "سناك لذيذ خالي من السكر والغلوتين يحتوي على اكثر من 50% بندق مُحلّى بالتمر ومغطى بالشوكولاتة البلجيكية الفاخرة مكونات: بندق, شوكولاتة خالية من السكر, تمر",
  "featured": true
 },
 {
  "name": "تارت الجوز و البيكان",
  "price": 810,
  "category": "تارت",
  "unit": "علبة",
  "image": "/assets/photos/badeel/pecan-walnut-bars.jpg",
  "description": "تارت الجوز و البيكان الصحي مزيج مثالي من الجوز و البيكان فوق طبقة غنية بالزبدة الطبيعية، كل قطعة تقدم لك طعم رائع مع مكونات صحية ومغذية. مكونات: بيكان, جوز, دقيق, زبدة, مالتيتول, شراب التمر, نشا الذرة",
  "options": [
   {
    "name": "الخيار",
    "values": [
     "عادي - 12 قطعة",
     "عادي - 24 قطعة",
     "خالي من الغلوتين - 12 قطعة",
     "خالي من الغلوتين - 24 قطعة"
    ],
    "extra": [
     0,
     790,
     10,
     810
    ]
   }
  ]
 },
 {
  "name": "تارت اللوز بالكراميل",
  "price": 550,
  "category": "تارت",
  "unit": "12 قطعة",
  "image": "/assets/photos/badeel/caramel-almond-tart.jpg",
  "description": "استمتع بروعة المذاق الغني مع تارت اللوز بالكراميل. مزيج مثالي من اللوز المحمص المغطى بطبقة لامعة من الكراميل الشهي. مُحلى بالعسل ليوفر لك تجربة فريدة ولذيذة بدون شعور بالذنب. مكونات",
  "options": [
   {
    "name": "النوع",
    "values": [
     "عادي",
     "خالي من الغلوتين"
    ],
    "extra": [
     0,
     10
    ]
   }
  ]
 },
 {
  "name": "كوكيز الطحينة الصحية",
  "price": 600,
  "category": "كوكيز",
  "unit": "علبة",
  "image": "/assets/photos/badeel/healthy-tahini-cookies.jpg",
  "description": "كوكيز خالي من السكر والغلوتين. محضر من دقيق اللوز ومحلّى بالمالتيتول . كل لقمة توفر لك الاستمتاع بالمكونات الصحية بدون شعور بالذنب. المكونات: دقيق اللوز, طحينة, مالتيتول",
  "options": [
   {
    "name": "الكمية",
    "values": [
     "10 كوكيز",
     "20 كوكيز"
    ],
    "extra": [
     0,
     560
    ]
   }
  ]
 },
 {
  "name": "مقرمشات الزعتر",
  "price": 210,
  "category": "بسكويت ومقرمشات",
  "unit": "200 جرام",
  "image": "/assets/photos/badeel/zaatar-crackers.jpg",
  "description": "استمتع بالطعم اللذيذ لرقائق الزعتر الصحية من بديل. مصنوع من القمح الكامل وزيت الزيتون الصافي. خالي من الزيوت المهدرجة المكونات: دقيق القمح الكامل, زيت الزيتون, زعتر, سمسم, سماق, ملح"
 },
 {
  "name": "بوكس التذوق",
  "price": 1200,
  "category": "باكجات وهدايا",
  "unit": "علبة",
  "image": "/assets/photos/badeel/tasting-box.jpg",
  "description": "استمتع بتجربة نكهات بديل في بوكس التذوق المصمم خصيصًا ليمنحك مزيجًا مثاليًا من المذاق الصحي واللذيذ. مكونات طبيعية 100%، بدون سكر مكرر أو زيوت مهدرجة، تمنحك طاقة تدوم طوال اليوم! محتويات البوكس: 3 تارت بيكان مقرمشة وغنية بالنكهة 3 تارت لوز…",
  "featured": true
 },
 {
  "name": "تمرية بالمكسرات",
  "price": 520,
  "category": "سناكات صحية",
  "unit": "350 جرام",
  "image": "/assets/photos/badeel/date-nut-bites.jpg",
  "description": "سناك صحي محضر من التمور الفاخرة والطحينة والمكسرات المحمصة. خالية من الغلوتين ولذيذة، تُمدك بالطاقة الطبيعية والعناصر الغذائية. 350 جرامًا المكونات: تمر, لوز, جوز, فستق حلبي, كاجو, سمسم, طحينة, هيل"
 },
 {
  "name": "جرانولا صحية خالية من الغلوتين",
  "price": 290,
  "category": "سناكات صحية",
  "unit": "200 جرام",
  "image": "/assets/photos/badeel/healthy-granola.jpg",
  "description": "200 جرام من الجرانولا االمحلاة بالعسل والمليئة بالمكسرات والبذور، خالية من الغلوتين وتحتوي على نسبة عالية من الألياف والبروتين - مثالية لوجبة خفيفة متوازنة ومغذية. المكونات: شوفان, كاجو, جوز, بذور قرع, بذور شيا, عسل, زبدة"
 },
 {
  "name": "باكج الإهداء 2",
  "price": 1820,
  "category": "باكجات وهدايا",
  "unit": "علبة",
  "image": "/assets/photos/badeel/gift-package-2.jpg",
  "description": "قدم لأحبائك تشكيلة فاخرة من منتجات بديل الصحية واللذيذة علبة تارت البيكان واللوز 12 قطعة علبة مكعبات سمسم بالعسل 20 قطعة علبة تارت اللوز 12 قطعة"
 },
 {
  "name": "بسكويت الينسون",
  "price": 200,
  "category": "بسكويت ومقرمشات",
  "unit": "علبة",
  "image": "/assets/photos/badeel/anise-biscuits.jpg",
  "description": "تذوق بسكويت اليانسون الخالي من السكر. استمتع بالدفء والرائحة العطرية لبذور اليانسون، الممزوجة بعناية لتقديم بسكويت مقرمش ومليئ بالنكهة. كل لقمة هي توازن متناغم بين الأصالة والتجديد. المكونات: دقيق, زبدة, زيت الزيتون, مالتيتول, يانسون",
  "options": [
   {
    "name": "الكمية",
    "values": [
     "200 غرام",
     "500 غرام"
    ],
    "extra": [
     0,
     300
    ]
   }
  ]
 },
 {
  "name": "كوكيز البراوني",
  "price": 880,
  "category": "كوكيز",
  "unit": "علبة",
  "image": "/assets/photos/badeel/healthy-brownie-cookies.jpg",
  "description": "استمتع مع كوكيز البراوني الخالية من السكر, غنية بالكاكاو وحبيبات الشوكولاتة. استمتع بفرحة الكاكاو الغني وقطع الشوكولاتة. التوازن المثالي بين الحلاوة ونكهة الشوكولاتة الفاخرة، حيث تتحول كل لقمة إلى احتفال بلذة الكاكاو النقي. مكونات: دقيق,…",
  "options": [
   {
    "name": "الكمية",
    "values": [
     "10 كوكيز",
     "20 كوكيز"
    ],
    "extra": [
     0,
     840
    ]
   }
  ]
 },
 {
  "name": "مكعبات السمسم بالعسل",
  "price": 500,
  "category": "سناكات صحية",
  "unit": "علبة",
  "image": "/assets/photos/badeel/healthy-sesame-bites.jpg",
  "description": "سناك صحي يحضر من مكونات صحية وطبيعية. كل قطعة هي جرعة صحة وطاقة بفضل دمج أفضل المكونات الصحية في منتج واحد. مكونات: بذور السمسم, بذور دوار الشمس, بذور الشيا, حبيبات الرز المنفوخ, عسل, زبدة الفول السوداني, حلاوة خالية من السكر",
  "options": [
   {
    "name": "الكمية",
    "values": [
     "20 قطعة",
     "40 قطعة"
    ],
    "extra": [
     0,
     470
    ]
   }
  ]
 },
 {
  "name": "كوكيز الشوفان",
  "price": 600,
  "category": "كوكيز",
  "unit": "علبة",
  "image": "/assets/photos/badeel/healthy-oat-cookies.jpg",
  "description": "كوكيز الشوفان اللذيذة بنكهة القرفة خالي من السكر المكرر والزيوت المهدرجة محلّى بسكر التمر المكونات: شوفان, دقيق, زبدة, مالتيتول, سكر التمر, بيض, قرفة",
  "options": [
   {
    "name": "الكمية",
    "values": [
     "10 كوكيز",
     "20 كوكيز"
    ],
    "extra": [
     0,
     560
    ]
   }
  ]
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const badeelProductCatalog = [];

const badeelProducts = (badeelProductCatalog.length ? badeelProductCatalog : badeelFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1410001 + index,
  storeId: badeelStore.id
}));

const badeelDeliverySettings = {
  [badeelStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { badeelStore, badeelProducts, badeelDeliverySettings };
}
