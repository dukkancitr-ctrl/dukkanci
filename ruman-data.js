// Generated for مطعم رُمّان (RUMAN Restaurant) — Şirinevler, Oktay Sk. No:7, Bahçelievler/İstanbul.
// Source: https://ruman.pizzanar.com.tr/31/categories/111 (pizzanar.com.tr / vecmenu — restaurant 34 / branch 31, native Arabic).
// 52 products, every one with a real photo. وسط/كبير & عادي/دبل size pairs merged into a size option;
// 7 logo-placeholder items (drinks/عجة/مكس مصرية/بطاطا+باذنجان) omitted per the photo-only rule.
// NOTE: rumanProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives in
// Supabase and is pushed via scripts/_scrape/push-store.cjs.
const rumanStore = {
 "id": 65,
 "name": "مطعم رُمّان",
 "category": "مطاعم",
 "image": "/assets/photos/ruman/cover.jpg",
 "coverImage": "/assets/photos/ruman/cover.jpg",
 "logoImage": "/assets/photos/ruman/logo.png",
 "logo": "ر",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 50,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 40.9938,
  "lng": 28.8467
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Ruman+Restaurant+%C5%9Eirinevler+Oktay+Sk",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم رُمّان — مأكولات شعبية شامية أصيلة في شيرين إفلر بإسطنبول. حمص، فول (سوري ومصري وفلسطيني)، مسبّحة، فتّة، فلافل، بالإضافة إلى سندويشات بخبز التنور والصمون، أطباق ومقبلات، وبيتزا متنوعة. نكهات بيتية طازجة تصل إلى بابك.",
 "address": "شيرين إفلر، شارع أوكتاي رقم 7، بهتشة إفلر، إسطنبول، تركيا",
 "phone": "+90 505 015 82 22",
 "whatsapp": "+90 505 015 82 22",
 "email": "",
 "website": "",
 "sourceUrl": "https://ruman.pizzanar.com.tr/31/categories/111",
 "hours": "يومياً من 12:00 ظهراً حتى 10:30 مساءً",
 "areas": [
  "شيرين إفلر",
  "بهتشة إفلر",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push + first-paint fallback.
const rumanFullCatalog = [
 {
  "name": "بيتزا خضار",
  "price": 300,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/537.jpg",
  "sourceId": "537",
  "description": "صلصة طماطم - جبنة موزاريلا - فلفل ألوان، طماطم، بصل، زيتون أسود",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا مارغريتا",
  "price": 300,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/533.jpg",
  "sourceId": "533",
  "description": "صلصة طماطم - جبنة موزاريلا - جبنة شيدر",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا ببروني",
  "price": 300,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/535.jpg",
  "sourceId": "535",
  "description": "صلصة طماطم - جبنة موزاريلا - شرائح ببروني",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا دجاج باربيكيو",
  "price": 330,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/539.jpg",
  "sourceId": "539",
  "description": "صلصة طماطم - جبنة موزاريلا - قطع دجاج مشوي - فلفل ألوان وبصل - فطر",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,100]}]
 },
 {
  "name": "بيتزا فصول الأربعة",
  "price": 350,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/541.jpg",
  "sourceId": "541",
  "description": "ربع خضار: فلفل ألوان، طماطم، بصل، زيتون - ربع لحم/ببروني: شرائح ببروني أو لحم مدخن، جبنة موزاريلا - ربع دجاج: قطع دجاج مشوي، فلفل ألوان، جبنة موزاريلا - ربع جبن/فطر: جبنة موزاريلا، فطر طازج",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,75]}]
 },
 {
  "name": "بيتزا حبش مدخن",
  "price": 350,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/543.jpg",
  "sourceId": "543",
  "description": "صلصة طماطم - جبنة موزاريلا - فطر 🍄 - حبش مدخن - فلفل ألوان",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,75]}]
 },
 {
  "name": "بيتزا مكسيكي",
  "price": 330,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/545.jpg",
  "sourceId": "545",
  "description": "صلصة طماطم + جبنة موزاريلا + صدر دجاج + فلفل حار + فلفل ألوان + دجاج حار",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا مديبول",
  "price": 400,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/547.jpg",
  "sourceId": "547",
  "description": "صلصة طماطم + جبنة موزاريلا + كرات لحم + بصل + فطر + فلفل ألوان",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,150]}]
 },
 {
  "name": "بيتزا تاكو",
  "price": 350,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/549.jpg",
  "sourceId": "549",
  "description": "صلصة طماطم + جبنة موزاريلا + جبنة شيدر + دوريتوس حار + فلفل حار",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا جمبري",
  "price": 550,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/551.jpg",
  "sourceId": "551",
  "description": "بصل أحمر + فلفل ملوّن + جبنة موزاريلا + صلصة طماطم + جمبري",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,100]}]
 },
 {
  "name": "بيتزا كرسبي",
  "price": 330,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/554.jpg",
  "sourceId": "554",
  "description": "صلصة بيتزا جبنة موزاريلا جبنة شيدر قطع كرسبي صوص",
  "options": [{"name":"الحجم","values":["وسط","كبير"],"extra":[0,50]}]
 },
 {
  "name": "بيتزا فولكان",
  "price": 550,
  "category": "البيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/ruman/553.jpg",
  "sourceId": "553",
  "description": "صلصة بيتزا جبنة موزاريلا جبنة شيدر فطر فلفل ملون صوص شيدر"
 },
 {
  "name": "فلافل",
  "price": 100,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/472.jpg",
  "sourceId": "472",
  "description": "4 قطع فلافل، حمص، خس، طماطم، خيار، مخلل، صوص طحينة",
  "options": [{"name":"الحجم","values":["عادي","دبل"],"extra":[0,25]}]
 },
 {
  "name": "ساندويشة فول",
  "price": 100,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/475.jpg",
  "sourceId": "475",
  "description": "فول، حمص، خس، طماطم، خيار، مخلل خيار، صوص طحينة"
 },
 {
  "name": "بطاطا",
  "price": 130,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/476.jpg",
  "sourceId": "476",
  "description": "بطاطا مقلية، دبس فليفلة، مايونيز، كاتشب",
  "options": [{"name":"الحجم","values":["عادي","دبل"],"extra":[0,20]}]
 },
 {
  "name": "كبدة دجاج",
  "price": 130,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/479.jpg",
  "sourceId": "479",
  "description": "كبدة دجاج، بطاطا، دبس فليفلة، مايونيز",
  "options": [{"name":"الحجم","values":["عادي","دبل"],"extra":[0,20]}]
 },
 {
  "name": "مكسيكانو",
  "price": 160,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/481.jpg",
  "sourceId": "481",
  "description": "دجاج، كاتشب، مايونيز، دبس فليفلة، مخلل",
  "options": [{"name":"الحجم","values":["عادي","دبل"],"extra":[0,10]}]
 },
 {
  "name": "فلافل + بطاطا + باذنجان",
  "price": 150,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/486.jpg",
  "sourceId": "486",
  "description": "4 قطع فلافل مع البطاطا والباذنجان، الحمص، الخضار وصوص الطحينة"
 },
 {
  "name": "فلافل + باذنجان",
  "price": 125,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/487.jpg",
  "sourceId": "487",
  "description": "4 قطع فلافل مع الباذنجان المقلي، الحمص، الخضار وصوص الطحينة"
 },
 {
  "name": "فلافل + بطاطا",
  "price": 125,
  "category": "السندويشات",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/488.jpg",
  "sourceId": "488",
  "description": "4 قطع فلافل مع البطاطا المقلية، الحمص، الخضار وصوص الطحينة"
 },
 {
  "name": "طبق فول بالطحينة",
  "price": 200,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/489.jpg",
  "sourceId": "489",
  "description": "باقلاء، طحينة، كمون، ثوم، فلفل، طماطم، بقدونس، زيت زيتون"
 },
 {
  "name": "طبق فول بالزيت",
  "price": 200,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/490.jpg",
  "sourceId": "490",
  "description": "باقلاء، ليمون، ثوم، كمون، فلفل، طماطم، بقدونس، زيت زيتون"
 },
 {
  "name": "طبق فتة بالزيت",
  "price": 200,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/491.jpg",
  "sourceId": "491",
  "description": "حمص، خبز مقلي، كمون، ثوم، فلفل، طماطم، بقدونس، زيت زيتون"
 },
 {
  "name": "طبق فتة بالسمنة",
  "price": 200,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/492.jpg",
  "sourceId": "492",
  "description": "حمص، خبز مقلي، كمون، ثوم، فلفل، طماطم، بقدونس، سمنة (زبدة)"
 },
 {
  "name": "طبق فتة باللحمة",
  "price": 350,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/493.jpg",
  "sourceId": "493",
  "description": "حمص، لحم بقر، خبز مقلي، كمون، ثوم، فلفل، طماطم، بقدونس، سمنة"
 },
 {
  "name": "وجبة فلافل عربي سندويش",
  "price": 200,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/495.jpg",
  "sourceId": "495",
  "description": "حمص، خس، طماطم، خيار، مخلل، صوص طحينة"
 },
 {
  "name": "وجبة فلافل عربي مثلثات",
  "price": 250,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/496.jpg",
  "sourceId": "496",
  "description": "حمص، خس، طماطم، خيار، مخلل، صوص طحينة"
 },
 {
  "name": "طبق فلافل أقراص",
  "price": 100,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/497.jpg",
  "sourceId": "497",
  "description": "خس، طماطم، خيار، مخلل، صوص طحينة",
  "options": [{"name":"الخيارات","values":["5 أقراص","8 أقراص","12 قرصاً","16 قرصاً"],"extra":[0,50,100,150]}]
 },
 {
  "name": "وجبة عجة",
  "price": 270,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/498.jpg",
  "sourceId": "498",
  "description": "6 قطع، بطاطس، ليمون، مايونيز، معجون فلفل، مخلل، بقدونس"
 },
 {
  "name": "طبق بطاطس",
  "price": 90,
  "category": "الأطباق",
  "unit": "طبق",
  "image": "/assets/photos/ruman/499.jpg",
  "sourceId": "499",
  "description": "كاتشب، مايونيز، معجون فلفل، بهارات، مخلل",
  "options": [{"name":"الحجم","values":["صغير","كبير"],"extra":[0,60]}]
 },
 {
  "name": "وجبة بطاطس وباذنجان",
  "price": 200,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/500.jpg",
  "sourceId": "500",
  "description": "كاتشب، مايونيز، معجون فلفل، بهارات، مخلل"
 },
 {
  "name": "وجبة مكسيكانو",
  "price": 320,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/501.jpg",
  "sourceId": "501",
  "description": "دجاج، كاتشب، مايونيز، معجون فلفل، مخلل"
 },
 {
  "name": "وجبة قلوبات (كبدة)",
  "price": 270,
  "category": "الأطباق",
  "unit": "وجبة",
  "image": "/assets/photos/ruman/502.jpg",
  "sourceId": "502",
  "description": "كبدة دجاج، مايونيز، ليمون، معجون فلفل، مخلل"
 },
 {
  "name": "فلافل خبز تنور",
  "price": 140,
  "category": "سندويش بخبز التنور",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/503.jpg",
  "sourceId": "503",
  "description": "حمص، خس، طماطم، خيار، مخلل، صوص طحينة، 4 قطع فلافل."
 },
 {
  "name": "بطاطا خبز تنور",
  "price": 165,
  "category": "سندويش بخبز التنور",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/504.jpg",
  "sourceId": "504",
  "description": "بطاطس اكسترا ، مايونيز، كاتشب. دبس فليفلة"
 },
 {
  "name": "فلافل + بطاطا + باذنجان تنور",
  "price": 165,
  "category": "سندويش بخبز التنور",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/505.jpg",
  "sourceId": "505",
  "description": "بطاطس، باذنجان، حمص، خس، طماطم، خيار، مخلل، صوص طحينة، 4 قطع فلافل."
 },
 {
  "name": "كبدة دجاج خبز تنور",
  "price": 150,
  "category": "سندويش بخبز التنور",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/506.jpg",
  "sourceId": "506",
  "description": "إضافات خاصة، كبدة دجاج، بطاطس، معجون فلفل، مايونيز."
 },
 {
  "name": "مكسيكانو خبز تنور",
  "price": 200,
  "category": "سندويش بخبز التنور",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/507.jpg",
  "sourceId": "507",
  "description": "دجاج، كاتشب، مايونيز، معجون فلفل، مخلل."
 },
 {
  "name": "فلافل صمون",
  "price": 130,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/508.jpg",
  "sourceId": "508",
  "description": "حمص، خس، طماطم، خيار، مخلل، صوص طحينة، 4 قطع فلافل."
 },
 {
  "name": "بطاطا صمون",
  "price": 150,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/509.jpg",
  "sourceId": "509",
  "description": "بطاطس، معجون فلفل، مايونيز، كاتشب."
 },
 {
  "name": "بطاطا وقشقوان صمون",
  "price": 160,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/510.jpg",
  "sourceId": "510",
  "description": "بطاطس، جبن قشقوان، معجون فلفل، مايونيز، كاتشب."
 },
 {
  "name": "بطاطا + باذنجان صمون",
  "price": 160,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/511.jpg",
  "sourceId": "511",
  "description": "بطاطس، باذنجان، معجون فلفل، مايونيز."
 },
 {
  "name": "كبدة صمون",
  "price": 150,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/512.jpg",
  "sourceId": "512",
  "description": "كبدة دجاج، بطاطس، معجون فلفل، مايونيز."
 },
 {
  "name": "مكسيكانو صمون",
  "price": 160,
  "category": "سندويش الصمون",
  "unit": "ساندويش",
  "image": "/assets/photos/ruman/513.jpg",
  "sourceId": "513",
  "description": "دجاج، كاتشب، مايونيز، معجون فلفل، مخلل."
 },
 {
  "name": "كولا 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "عبوة",
  "image": "/assets/photos/ruman/514.jpg",
  "sourceId": "514"
 },
 {
  "name": "كولا لتر",
  "price": 75,
  "category": "المشروبات",
  "unit": "عبوة",
  "image": "/assets/photos/ruman/515.jpg",
  "sourceId": "515"
 },
 {
  "name": "طبق حمص باللحمة",
  "price": 280,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/ruman/522.jpg",
  "sourceId": "522",
  "description": "حمص بالطحينة يعلوه لحم مفروم وتوابل."
 },
 {
  "name": "طبق حمص",
  "price": 180,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/ruman/523.jpg",
  "sourceId": "523",
  "description": "حمص مهروس مع طحينة، زيت زيتون، وحبوب الحمص."
 },
 {
  "name": "فتوش",
  "price": 150,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/ruman/524.jpg",
  "sourceId": "524",
  "description": "سلطة خضار متنوعة مع قطع الخبز المقرمشة ودبس الرمان."
 },
 {
  "name": "طبق تبولة",
  "price": 150,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/ruman/525.jpg",
  "sourceId": "525",
  "description": "بقدونس مفروم، برغل، طماطم، بصل، زيت زيتون وليمون."
 },
 {
  "name": "طبق متبل",
  "price": 180,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/ruman/526.jpg",
  "sourceId": "526",
  "description": "باذنجان مشوي مهروس مع الزبادي والطحينة."
 },
 {
  "name": "ربطة خبز",
  "price": 30,
  "category": "المقبلات",
  "unit": "ربطة",
  "image": "/assets/photos/ruman/556.jpg",
  "sourceId": "556"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const rumanProductCatalog = [];

const rumanProducts = (rumanProductCatalog.length ? rumanProductCatalog : rumanFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1490001 + index,
  storeId: rumanStore.id
}));

const rumanDeliverySettings = {
  [rumanStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { rumanStore, rumanProducts, rumanDeliverySettings };
}
