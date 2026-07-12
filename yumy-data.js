// Generated for يمي يمي (Yumy Yumy) — باشاك شهير، أوليمبا مول (Olimpa AVM)، إسطنبول.
// Source: https://yumyyumy.com.tr (self-contained native-Arabic menu, inline `menuItems` array).
// 53 source rows → 43 products: the 10 large-pizza rows reuse the medium rows' photos, so each
// pizza is one product with a size option group (وسط/كبير) instead of a duplicate-image row.
// NOTE: yumyProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives
// in Supabase and is pushed via scripts/_scrape/push-store.cjs. Location is a PLACEHOLDER pending
// the owner's exact coordinates.
const yumyStore = {
 "id": 60,
 "name": "يمي يمي",
 "category": "مطاعم",
 "image": "/assets/photos/yumy/cover.jpg",
 "coverImage": "/assets/photos/yumy/cover.jpg",
 "logoImage": "/assets/photos/yumy/logo.png",
 "logo": "ي",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0917,
  "lng": 28.8003
 },
 "mapUrl": "",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "يمي يمي — الطعم الرائع للفطائر والبيتزا والكريب في باشاك شهير. فطائر مشكلة باللحوم والأجبان والباصطرما والجمبري، فطائر حلوة، كريب حلو ومالح، بيتزا إيطالية بحجمين، إضافة إلى البسبوسة وأرز باللبن والعصائر الطازجة. يُحضّر طازجاً ويصل إلى بابك.",
 "address": "باشاك شهير - أوليمبا مول (Olimpa AVM) - طابق المطاعم، إسطنبول، تركيا",
 "phone": "+90 531 327 70 50",
 "whatsapp": "+90 531 327 70 50",
 "email": "",
 "website": "",
 "sourceUrl": "https://yumyyumy.com.tr",
 "hours": "يومياً من 12:00 ظهراً حتى 10:00 مساءً",
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
const yumyFullCatalog = [
 {
  "name": "فطيرة اللحوم المشكلة مع الأجبان",
  "price": 400,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/1.jpg",
  "description": "فطيرة مصرية غنية باللحوم المشكلة مع ميكس أجبان وخضار، مطهية بالسمن البلدي.",
  "sourceId": "1"
 },
 {
  "name": "فطيرة اللحوم المشكلة والباصطرما والأجبان إكسترا",
  "price": 450,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/2.jpg",
  "description": "فطيرة دسمة باللحوم والباصطرما مع ميكس أجبان وخضار طازج بالسمن البلدي.",
  "sourceId": "2"
 },
 {
  "name": "فطيرة السجق بالجبن الكيري",
  "price": 380,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/3.jpg",
  "description": "فطيرة بالسجق الشرقي مع لمسة كيري كريمية وميكس أجبان وخضار.",
  "sourceId": "3"
 },
 {
  "name": "فطيرة الباصطرما والأجبان",
  "price": 450,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/4.jpg",
  "description": "فطيرة غنية بالباصطرما مع ميكس أجبان وخضار مطهية بالسمن البلدي.",
  "sourceId": "4"
 },
 {
  "name": "فطيرة الدجاج مع تشكيلة الأجبان",
  "price": 370,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/5.jpg",
  "description": "فطيرة بالدجاج المتبل مع تشكيلة أجبان وخضار بطعم مميز.",
  "sourceId": "5"
 },
 {
  "name": "فطيرة الأجبان المشكلة",
  "price": 380,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/6.jpg",
  "description": "فطيرة غنية بتشكيلة أجبان مع خضار ولمسة سمن بلدي.",
  "sourceId": "6"
 },
 {
  "name": "فطيرة ساندوتش تيربو نصف متر",
  "price": 360,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/7.jpg",
  "description": "فطيرة تيربو بحجم كبير محشوة ميكس لحوم وأجبان وخضار.",
  "sourceId": "7"
 },
 {
  "name": "رغيف الحواوشي الشهير",
  "price": 240,
  "category": "الفطائر المشكلة",
  "unit": "رغيف",
  "image": "/assets/photos/yumy/8.jpg",
  "description": "حواوشي مصري أصيل بلحم مفروم متبل ومطهو بالسمن البلدي.",
  "sourceId": "8"
 },
 {
  "name": "رغيف الحواوشي الاسكندراني",
  "price": 280,
  "category": "الفطائر المشكلة",
  "unit": "رغيف",
  "image": "/assets/photos/yumy/9.jpg",
  "description": "حواوشي إسكندراني بطعم حار مميز وخلطة بهارات خاصة.",
  "sourceId": "9"
 },
 {
  "name": "فطيرة الجمبري مع الأجبان",
  "price": 450,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/10.jpg",
  "description": "فطيرة بالجمبري مع تشكيلة أجبان وخضار بطعم بحري مميز.",
  "sourceId": "10"
 },
 {
  "name": "فطيرة التونة مع الأجبان",
  "price": 400,
  "category": "الفطائر المشكلة",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/11.jpg",
  "description": "فطيرة بالتونة مع أجبان وخضار بطعم خفيف ومميز.",
  "sourceId": "11"
 },
 {
  "name": "طاجن مكرونة بالباشاميل واللحم المفروم",
  "price": 320,
  "category": "الفطائر المشكلة",
  "unit": "طبق",
  "image": "/assets/photos/yumy/12.jpg",
  "description": "طاجن مكرونة بالباشاميل غني باللحم المفروم ومغطى بالجبن.",
  "sourceId": "12"
 },
 {
  "name": "طاجن مكرونة بالباشاميل والجمبري",
  "price": 370,
  "category": "الفطائر المشكلة",
  "unit": "طبق",
  "image": "/assets/photos/yumy/13.jpg",
  "description": "طاجن مكرونة بالباشاميل مع الجمبري بطعم فاخر.",
  "sourceId": "13"
 },
 {
  "name": "فطيرة المشلتت السادة",
  "price": 240,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/14.jpg",
  "description": "فطيرة مشلتت مصرية سادة محضرة بالسمن البلدي.",
  "sourceId": "14"
 },
 {
  "name": "فطيرة بحشوة الكاسترد",
  "price": 280,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/15.jpg",
  "description": "فطيرة حلوة محشوة بكاسترد كريمي.",
  "sourceId": "15"
 },
 {
  "name": "فطيرة بحشوة الشوكولاته",
  "price": 300,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/16.jpg",
  "description": "فطيرة حلوة غنية بالشوكولاتة.",
  "sourceId": "16"
 },
 {
  "name": "فطيرة الحليب والمكسرات",
  "price": 280,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/17.jpg",
  "description": "فطيرة بالحليب والمكسرات بطعم غني.",
  "sourceId": "17"
 },
 {
  "name": "فطيرة بحشوة اللوتس",
  "price": 300,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/18.jpg",
  "description": "فطيرة حلوة غنية بطعم اللوتس.",
  "sourceId": "18"
 },
 {
  "name": "فطيرة القشطة بالعسل",
  "price": 280,
  "category": "الفطائر الحلو",
  "unit": "فطيرة",
  "image": "/assets/photos/yumy/19.jpg",
  "description": "فطيرة بالقشطة والعسل بطعم شرقي أصيل.",
  "sourceId": "19"
 },
 {
  "name": "بسبوسة سادة (نصف كيلو)",
  "price": 200,
  "category": "الحلويات والعصائر",
  "unit": "علبة",
  "image": "/assets/photos/yumy/20.jpg",
  "description": "بسبوسة مصرية سادة طرية.",
  "sourceId": "20"
 },
 {
  "name": "أرز بلبن مع المانجو والمكسرات",
  "price": 140,
  "category": "الحلويات والعصائر",
  "unit": "كوب",
  "image": "/assets/photos/yumy/21.jpg",
  "description": "أرز بلبن مع مانجو ومكسرات بطعم رائع.",
  "sourceId": "21"
 },
 {
  "name": "أرز بلبن سادة",
  "price": 120,
  "category": "الحلويات والعصائر",
  "unit": "كوب",
  "image": "/assets/photos/yumy/22.jpg",
  "description": "أرز بلبن كريمي سادة.",
  "sourceId": "22"
 },
 {
  "name": "عصير مانجو طبيعي",
  "price": 140,
  "category": "الحلويات والعصائر",
  "unit": "كوب",
  "image": "/assets/photos/yumy/23.jpg",
  "description": "عصير مانجو طبيعي منعش.",
  "sourceId": "23"
 },
 {
  "name": "كريب الكريسبي الحار",
  "price": 270,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/24.jpg",
  "description": "كريب محشو بدجاج كريسبي مقرمش مع جبنة موزاريلا وصوص حار ولمسة فلفل ألوان.",
  "sourceId": "24"
 },
 {
  "name": "كريب الدجاج بصوص الماكسيكان",
  "price": 290,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/25.jpg",
  "description": "كريب محشو بقطع الدجاج المتبلة مع صوص ماكسيكان حار وميكس جبن.",
  "sourceId": "25"
 },
 {
  "name": "كريب ميكس يامي يامي",
  "price": 310,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/26.jpg",
  "description": "كريب ميكس غني باللحوم والدجاج مع جبن وصوص يامي الخاص.",
  "sourceId": "26"
 },
 {
  "name": "كريب البرجر مع الشيدر",
  "price": 290,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/27.jpg",
  "description": "كريب محشو ببرجر لحم مع جبنة شيدر وصوص برجر مميز.",
  "sourceId": "27"
 },
 {
  "name": "كريب الجمبري",
  "price": 350,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/28.jpg",
  "description": "كريب محشو بجمبري متشوح بالثوم والليمون مع جبنة وصوص كريمي.",
  "sourceId": "28"
 },
 {
  "name": "كريب تشكيلة الأجبان",
  "price": 290,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/29.jpg",
  "description": "كريب غني بتشكيلة أجبان مختلفة بطعم كريمي مميز.",
  "sourceId": "29"
 },
 {
  "name": "كريب البطاطس مع الأجبان",
  "price": 220,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/30.jpg",
  "description": "كريب محشو ببطاطس مقلية مع جبن وصوصات لذيذة.",
  "sourceId": "30"
 },
 {
  "name": "كريب السجق الشرقي بالخلطة",
  "price": 310,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/31.jpg",
  "description": "كريب بالسجق الشرقي المتبل مع بصل وفلفل وطماطم وجبنة.",
  "sourceId": "31"
 },
 {
  "name": "كريب بحشوة الشوكولاته والموز",
  "price": 240,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/32.jpg",
  "description": "كريب حلو محشو بنوتيلا وموز مع صوص شوكولاتة.",
  "sourceId": "32"
 },
 {
  "name": "كريب بحشوة اللوتس",
  "price": 280,
  "category": "الكريب",
  "unit": "قطعة",
  "image": "/assets/photos/yumy/33.jpg",
  "description": "كريب حلو غني بصوص اللوتس وبسكويت مقرمش.",
  "sourceId": "33"
 },
 {
  "name": "بيتزا سوبر ميكسات (لحوم)",
  "price": 370,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/34.jpg",
  "description": "بيتزا غنية بميكس اللحوم (لحم + سجق + باصطرما) مع جبن وصوص طماطم.",
  "sourceId": "34",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     80
    ]
   }
  ]
 },
 {
  "name": "بيتزا دجاج بصوص الباربيكيو",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/35.jpg",
  "description": "بيتزا بالدجاج المتبل بصوص الباربيكيو مع جبن وخضار.",
  "sourceId": "35",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا بيبروني",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/36.jpg",
  "description": "بيتزا بالبيبروني مع جبنة وصوص طماطم.",
  "sourceId": "36",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا مارجريتا",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/37.jpg",
  "description": "بيتزا مارجريتا بطعم خفيف ومميز.",
  "sourceId": "37",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا أربع مواسم",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/38.jpg",
  "description": "بيتزا متنوعة بأربع نكهات مختلفة.",
  "sourceId": "38",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا الهالوبينو الحار",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/39.jpg",
  "description": "بيتزا حارة مع شرائح هالوبينو.",
  "sourceId": "39",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا تشكيلة الأجبان الأربعة",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/40.jpg",
  "description": "بيتزا غنية بأربعة أنواع جبن.",
  "sourceId": "40",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا النقانق",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/41.jpg",
  "description": "بيتزا بالنقانق مع جبن وخضار.",
  "sourceId": "41",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 },
 {
  "name": "بيتزا الخضار",
  "price": 290,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/42.jpg",
  "description": "بيتزا نباتية بالخضار الطازج.",
  "sourceId": "42",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     110
    ]
   }
  ]
 },
 {
  "name": "بيتزا الفريديو الإيطالية (وايت صوص)",
  "price": 320,
  "category": "البيتزا",
  "unit": "بيتزا",
  "image": "/assets/photos/yumy/43.jpg",
  "description": "بيتزا بوايت صوص كريمي مع جبنة ودجاج.",
  "sourceId": "43",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     100
    ]
   }
  ]
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const yumyProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const yumyProducts = (yumyProductCatalog.length ? yumyProductCatalog : yumyFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1440001 + index,
  storeId: yumyStore.id
}));

const yumyDeliverySettings = {
  [yumyStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 20, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { yumyStore, yumyProducts, yumyDeliverySettings };
}
