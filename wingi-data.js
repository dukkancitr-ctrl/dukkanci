// Generated from the official Wingi (وينجي) Fast Food menu — wingitr.com (Mini & More / minidine).
// Two İstanbul branches (Bahçeşehir/Akbatı & Kayaşehir) share one menu (37 items, native Arabic, prices ₺).
// The main branch (Bahçeşehir) menu is the superset; Kayaşehir is a subset of it.
// NOTE: wingiProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in wingiFullCatalog (bundled fallback) and Supabase; pushed via scripts/_scrape/push-store.cjs.

const wingiBranches = [
 {
  "id": 75,
  "name": "Wingi - بهشة شهير",
  "branchName": "بهشة شهير",
  "branchGroup": "wingi",
  "category": "مطاعم",
  "image": "/assets/photos/wingi/cover.jpg",
  "coverImage": "/assets/photos/wingi/cover.jpg",
  "logoImage": "/assets/photos/wingi/logo.png",
  "logo": "W",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 35,
  "minOrder": 150,
  "time": "30 - 55 دقيقة",
  "distance": 0,
  "location": {
   "lat": 41.06087402685292,
   "lng": 28.668364295314188
  },
  "mapUrl": "https://maps.app.goo.gl/Fo6SBddgb5ohYf3s5",
  "open": true,
  "featured": true,
  "hasOffer": false,
  "offer": "",
  "description": "Wingi (وينجي) — مطعم وجبات سريعة متخصص بأجنحة الدجاج (وينقز) المغطاة بصوص الديناميت، وبرغر الدجاج المقرمش، والراب والساندويتش، والبروست، مع البطاطا المقلية والصوصات والسلطات والحلويات والمشروبات المنعشة. نكهات مميزة وجودة عالية بين فرعي بهشة شهير وكايا شهير في إسطنبول.",
  "address": "Koza Mah. 1638. Sk. No: 1 C No: 13, Bahçeşehir, Başakşehir/İstanbul (قرب أكباتي مول)",
  "phone": "+905556334333",
  "whatsapp": "+905556334333",
  "email": "wingifastfood@gmail.com",
  "website": "https://wingitr.com",
  "sourceUrl": "https://wingitr.com/ar?branch=wingi-bahcesehir",
  "hours": "يومياً من 1:00 ظهراً حتى منتصف الليل",
  "areas": [
   "بهشة شهير",
   "باشاك شهير",
   "إسطنبول",
   "مناطق التوصيل حسب المسافة"
  ],
  "fulfillment": "توصيل واستلام من الفرع",
  "subscription": "احترافي",
  "orderCount": 0,
  "officialStore": true,
  "sourceBranded": true
 },
 {
  "id": 76,
  "name": "Wingi - كايا شهير",
  "branchName": "كايا شهير",
  "branchGroup": "wingi",
  "category": "مطاعم",
  "image": "/assets/photos/wingi/cover.jpg",
  "coverImage": "/assets/photos/wingi/cover.jpg",
  "logoImage": "/assets/photos/wingi/logo.png",
  "logo": "W",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 35,
  "minOrder": 150,
  "time": "35 - 65 دقيقة",
  "distance": 0,
  "location": {
   "lat": 41.11824933692418,
   "lng": 28.771533368329663
  },
  "mapUrl": "https://maps.app.goo.gl/4w1X4j1tt1cGpgnv7",
  "open": true,
  "featured": false,
  "hasOffer": false,
  "offer": "",
  "description": "Wingi (وينجي) — مطعم وجبات سريعة متخصص بأجنحة الدجاج (وينقز) المغطاة بصوص الديناميت، وبرغر الدجاج المقرمش، والراب والساندويتش، والبروست، مع البطاطا المقلية والصوصات والسلطات والحلويات والمشروبات المنعشة. نكهات مميزة وجودة عالية بين فرعي بهشة شهير وكايا شهير في إسطنبول.",
  "address": "Kayabaşı Mah. Park Mavera, Gazi Yaşargil Cd. A05 Blok No: 15 DF, 34494 Başakşehir/İstanbul",
  "phone": "+905387131770",
  "whatsapp": "+905387131770",
  "email": "wingikayasehir@gmail.com",
  "website": "https://wingitr.com",
  "sourceUrl": "https://wingitr.com/ar?branch=wingi-kayasehir",
  "hours": "يومياً من 1:00 ظهراً حتى منتصف الليل",
  "areas": [
   "كايا شهير",
   "باشاك شهير",
   "إسطنبول",
   "مناطق التوصيل حسب المسافة"
  ],
  "fulfillment": "توصيل واستلام من الفرع",
  "subscription": "احترافي",
  "orderCount": 0,
  "officialStore": true,
  "sourceBranded": true
 }
];

// Shared menu across both branches (used for the Supabase push + bundled fallback).
const wingiFullCatalog = [
 {
  "name": "براونيز",
  "price": 70,
  "category": "الحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5801770258305.jpg",
  "sourceId": "2ea64f20-b5bc-49c4-9f5e-71be33d79561"
 },
 {
  "name": "كوكيز",
  "price": 70,
  "category": "الحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/6551770258461.jpg",
  "sourceId": "50045c7a-83e0-4970-bf5e-8436a11320d2"
 },
 {
  "name": "بيسك برجر",
  "price": 369,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/8181777302573.jpg",
  "description": "صوص الكوكتيل، خس، جبنة الشيدر، بطاطا مقلية",
  "sourceId": "574e98c2-2091-42c4-845e-5aed5cb5cd46"
 },
 {
  "name": "ميبل سيراتشا برجر",
  "price": 389,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/8711777385640.jpg",
  "description": "دجاج مغطى بصوص الديناميت، كول سلو، ، جبنة الشيدر ، بطاطا مقلية",
  "sourceId": "8c564d16-8a6e-4531-a409-8e0ddc5f82c8"
 },
 {
  "name": "اينكردبل برجر",
  "price": 379,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/9021777302725.jpg",
  "description": "صوص الهني ماسترد، كول سلو ، جبنة الشيدر ، بطاطا مقلية",
  "sourceId": "6500dcd7-0018-4512-a0e3-421634b53759"
 },
 {
  "name": "وينقي برجر",
  "price": 389,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/2111777302755.jpg",
  "description": "صوص الديناميت، كول سلو، جبنة الشيدر، بطاطا مقلية",
  "sourceId": "7c0469f1-24a1-4a5c-952d-248037563ac4"
 },
 {
  "name": "كريسبي برجر",
  "price": 389,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/8881777310279.jpg",
  "description": "صوص الكوكتيل والديناميت، كولسلو، جبنة الشيدر ، بطاطا مقلية",
  "sourceId": "92bb3b6d-31be-4d44-8e85-b7c3d8227b5b"
 },
 {
  "name": "هيت ويف برجر",
  "price": 389,
  "category": "برجر الدجاج",
  "unit": "وجبة",
  "image": "/assets/photos/wingi/items/7341777303060.jpg",
  "description": "صوص هيت ويف ، خس ، مخلل حلو ، شيدر، بطاطا مقلية",
  "sourceId": "c3c91d8d-c5cd-4a63-bb2f-23d5c926b266"
 },
 {
  "name": "تشيكن فلات برجر",
  "price": 379,
  "category": "برجر الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4761777398759.jpg",
  "sourceId": "2fdb240d-02f3-4a2a-a970-579b0de76399"
 },
 {
  "name": "شرمب راب",
  "price": 299,
  "category": "ساندويتش",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4141778070389.jpg",
  "description": "شرمب ، صوص ديناميت، كول سلو، جبنة الشيدر",
  "options": [
   {
    "name": "خيارات",
    "values": [
     "عادي",
     "بدون جبن"
    ],
    "extra": [
     0,
     0
    ]
   }
  ],
  "sourceId": "ed3aca10-e369-464f-9a00-2841fd00741c"
 },
 {
  "name": "كلاسيك راب",
  "price": 249,
  "category": "ساندويتش",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/1031778070424.jpg",
  "sourceId": "338595d4-864a-48cc-9750-629b581e51da"
 },
 {
  "name": "وينقي راب",
  "price": 249,
  "category": "ساندويتش",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/8541778070453.jpg",
  "description": "دجاج استربس، صوص الديناميت، كول سلو، جبنة الشيدر",
  "options": [
   {
    "name": "خيارات",
    "values": [
     "عادي",
     "بدون جبن"
    ],
    "extra": [
     0,
     0
    ]
   }
  ],
  "sourceId": "4165a1b4-83d6-4863-9fc4-c963c0f29161"
 },
 {
  "name": "ديناميت تشيكن",
  "price": 299,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/3151777302880.jpg",
  "description": "قطع دجاج مغطا بصوص الديناميت، خس",
  "sourceId": "233dfa13-9906-4333-b14a-8841563026be"
 },
 {
  "name": "كريسبي ستربس",
  "price": 299,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4831777302837.jpg",
  "description": "4 قطع دجاج ستربس ، صوص الكوكتيل ،بطاطا مقلية",
  "sourceId": "d8a4c53a-8b13-4ca8-bb51-0e2b7f0779ff"
 },
 {
  "name": "ديناميت شرمب",
  "price": 379,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/9291760102713.jpg",
  "description": "شرمب مغطا بصوص الديناميت، خس",
  "sourceId": "16f2f33d-6155-474c-a4e4-2a7f32cc7e5e"
 },
 {
  "name": "بيسك وينقز",
  "price": 299,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/6161777302855.jpg",
  "sourceId": "50191b25-ce0f-4e97-93ac-cea15befc476"
 },
 {
  "name": "بروست دجاج عادي",
  "price": 379,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/7181777302942.jpg",
  "description": "قطعة رجل، قطعة فخذ، قطعة صدر، قطعة جناح، صوص الثوم ، بطاطا مقلية",
  "sourceId": "8c40a2b2-17b9-4d0b-a878-af5ccdde65ec"
 },
 {
  "name": "تشيكن فرايز",
  "price": 209,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/9011777303031.jpg",
  "description": "دجاج ستربس مع بطاطا مغطاة بصوص الديناميت، صوص كوكتيل، جبنة الشيدر",
  "options": [
   {
    "name": "خيارات",
    "values": [
     "عادي",
     "بدون جبن"
    ],
    "extra": [
     0,
     0
    ]
   }
  ],
  "sourceId": "12360bb2-6454-4011-b27a-c80e5afdf39d"
 },
 {
  "name": "ديناميت وينقز",
  "price": 299,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5661777302867.jpg",
  "description": "5 قطع اجنحة دجاج،مغطا بصوص الديناميت،خس",
  "sourceId": "8430971f-9b77-4b67-a7f5-f21481ebff7c"
 },
 {
  "name": "بروست دجاج سبايسي",
  "price": 379,
  "category": "المنيو العام",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/9201777302950.jpg",
  "description": "قطعة رجل، قطعة فخذ، قطعة صدر، قطعة جناح، صوص الثوم ، بطاطا مقلية",
  "sourceId": "c7400303-4d5a-4b3e-876c-abbc234e9b31"
 },
 {
  "name": "شدر صوص",
  "price": 20,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/3761736283239.jpg",
  "sourceId": "ce879ef2-7974-405a-9f7d-2ec87646fd9d"
 },
 {
  "name": "بطاطا مقلية",
  "price": 99,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/6291778084225.jpg",
  "sourceId": "5aafe264-b7ab-494a-a830-ac9a278bc2d1"
 },
 {
  "name": "سلطة الكول سلو",
  "price": 70,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5641733411362.jpg",
  "sourceId": "fff2a2f6-143a-4921-a3cb-9c6350c657dd"
 },
 {
  "name": "صوص الديناميت",
  "price": 20,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/7701736283131.jpg",
  "sourceId": "b81350b9-276d-4460-9b77-273de7d30b34"
 },
 {
  "name": "صوص الكوكتيل",
  "price": 20,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4681736283148.jpg",
  "sourceId": "04d7cb9d-8635-4901-87de-30781fde5eab"
 },
 {
  "name": "صوص الثوميه",
  "price": 20,
  "category": "الإضافات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5151736283198.jpg",
  "sourceId": "0feb2503-a96c-4325-bec6-17b9bc1f513d"
 },
 {
  "name": "لاكولا",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4401733411409.jpg",
  "available": false,
  "sourceId": "b82312f7-8112-49f0-a6ef-0e775409141c"
 },
 {
  "name": "فريزبي ليمون نعناع",
  "price": 50,
  "category": "المشروبات",
  "unit": "قنينة",
  "image": "/assets/photos/wingi/items/6711736198086.jpg",
  "available": false,
  "sourceId": "5f9d6c6e-67cc-411e-b867-a16f5f9f6a0e"
 },
 {
  "name": "فريزبي تفاح عنب",
  "price": 50,
  "category": "المشروبات",
  "unit": "قنينة",
  "image": "/assets/photos/wingi/items/1351736198045.jpg",
  "available": false,
  "sourceId": "f07ac865-7194-4d3b-a725-eda18ad68766"
 },
 {
  "name": "فريزبي توت ازرق",
  "price": 50,
  "category": "المشروبات",
  "unit": "قنينة",
  "image": "/assets/photos/wingi/items/8411736198012.jpg",
  "available": false,
  "sourceId": "4e2382fb-a54f-4b4e-b3ad-297e2defc804"
 },
 {
  "name": "كودرد",
  "price": 50,
  "category": "المشروبات",
  "unit": "كيس",
  "image": "/assets/photos/wingi/items/5441736198121.jpg",
  "sourceId": "17e03915-a836-4ec2-b123-376ff3994e0b"
 },
 {
  "name": "ايس تي مانجو",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5261733411509.jpg",
  "sourceId": "1230fb7f-35a7-4443-af05-7e8dcb082d99"
 },
 {
  "name": "ايس تي خوخ",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5701733411526.jpg",
  "sourceId": "1199ba30-d917-4dff-84e4-57ce6afeb3ff"
 },
 {
  "name": "ايس تي ليمون",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/2991733411515.jpg",
  "available": false,
  "sourceId": "526cd95d-cfcf-4f86-bc6b-cb3c4d59a404"
 },
 {
  "name": "ايس تي بطيخ",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/5531733411555.jpg",
  "sourceId": "f70c543a-f929-4912-9087-14371ff66cb7"
 },
 {
  "name": "عيران",
  "price": 50,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/4881733411404.jpg",
  "sourceId": "1039316a-e4cf-4e5b-97e9-3188015a9fa2"
 },
 {
  "name": "ماء",
  "price": 15,
  "category": "المشروبات",
  "unit": "قطعة",
  "image": "/assets/photos/wingi/items/7241734448664.jpg",
  "sourceId": "9256a258-4be2-4051-94b9-f212ea16d7ac"
 }
];

// Emptied in the committed repo; wingiProducts falls back to wingiFullCatalog.
const wingiProductCatalog = [];

const wingiProducts = wingiBranches.flatMap((store, branchIndex) =>
  (wingiProductCatalog.length ? wingiProductCatalog : wingiFullCatalog).map((product, productIndex) => ({
    ...product,
    id: 1590001 + (branchIndex * 1000) + productIndex,
    storeId: store.id
  })));

const wingiDeliverySettings = Object.fromEntries(wingiBranches.map(store => [store.id, {
  mode: "distance",
  fixedFee: store.delivery,
  ratePerKm: 15,
  prepMinutes: 30,
  maxRoundTripKm: 120
}]));

if (typeof module !== "undefined" && module.exports) {
  module.exports = { wingiBranches, wingiProducts, wingiDeliverySettings, wingiFullCatalog };
}
