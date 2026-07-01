// Generated for مطعم شام غريل (Sham Grill) — شاورما سورية، كاياباشي، باشاك شهير، إسطنبول.
// Source: tillymenu.com/210/shamgril (menu) + shamgrill.restaurant (brand assets, coords, socials).
// NOTE: shamgrillProductCatalog is intentionally emptied in the repo (perf) — the full
// catalog lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const shamgrillStore = {
  "id": 73,
  "name": "مطعم شام غريل",
  "category": "مطاعم",
  "image": "/assets/photos/shamgrill/cover.jpg",
  "coverImage": "/assets/photos/shamgrill/cover.jpg",
  "logoImage": "/assets/photos/shamgrill/logo.png",
  "logo": "ش",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 35,
  "minOrder": 150,
  "time": "40 - 70 دقيقة",
  "distance": 0,
  "location": {
   "lat": 41.1190768,
   "lng": 28.7719718
  },
  "mapUrl": "https://maps.app.goo.gl/ehzosV9FpFWmvC9EA",
  "open": true,
  "featured": true,
  "hasOffer": false,
  "offer": "",
  "description": "مطعم شام غريل — شاورما سورية أصيلة في إسطنبول. شاورما دجاج ولحم (لف، صمون، عربي، صواريخ)، وجبات عائلية ومشاوٍ، أطباق شرقية (مندي، منسف، برياني، شيش برك، شاكرية)، بروستد ودجاج مقرمش (زنجر، كريسبي)، ومقبلات ساخنة وباردة. طازج ويصل إلى بابك.",
  "address": "كاياباشي محلة، باشاك شهير، إسطنبول، تركيا",
  "phone": "+90 552 784 47 41",
  "whatsapp": "+90 552 784 47 41",
  "email": "",
  "website": "https://shamgrill.restaurant",
  "sourceUrl": "https://tillymenu.com/210/shamgril",
  "hours": "",
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
const shamgrillFullCatalog = [
  // شاورما الدجاج
  { name: "اصبع دجاج", price: 120, category: "شاورما الدجاج", unit: "قطعة", image: "/assets/photos/shamgrill/p-66630.jpg", description: "", options: [{ name: "الحجم", values: ["افرادي","دبل"], extra: [0,30] }] },
  { name: "شاورما لف دجاج", price: 175, category: "شاورما الدجاج", unit: "سندويش", image: "/assets/photos/shamgrill/p-66632.jpg", description: "", options: [{ name: "الحجم", values: ["لف","دبل"], extra: [0,45] }] },
  { name: "شاورما صمون دجاج", price: 230, category: "شاورما الدجاج", unit: "سندويش", image: "/assets/photos/shamgrill/p-66634.jpg", description: "" },
  { name: "صاروخ شاورما", price: 235, category: "شاورما الدجاج", unit: "سندويش", image: "/assets/photos/shamgrill/p-66635.jpg", description: "" },
  { name: "عربي دجاج", price: 280, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66636.jpg", description: "" },
  { name: "عربي دجاج سوبر", price: 370, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66637.jpg", description: "" },
  { name: "عربي دجاج دبل", price: 410, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66638.jpg", description: "" },
  { name: "عربي صمون", price: 370, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66639.jpg", description: "" },
  { name: "200 غرام شرحات دجاج", price: 360, category: "شاورما الدجاج", unit: "علبة", image: "/assets/photos/shamgrill/p-66640.jpg", description: "" },
  { name: "شاورما دجاج بالوزن", price: 600, category: "شاورما الدجاج", unit: "علبة", image: "/assets/photos/shamgrill/p-66641.jpg", description: "للطلبات الخارجية فقط", options: [{ name: "الوزن", values: ["نص كيلو","كيلو"], extra: [0,600] }] },
  { name: "شام غريل", price: 435, category: "شاورما الدجاج", unit: "قطعة", image: "/assets/photos/shamgrill/p-66643.jpg", description: "" },
  { name: "عربي عائلي دجاج", price: 1400, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66644.jpg", description: "" },
  { name: "عربي ميكس", price: 660, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66645.jpg", description: "" },
  { name: "قالب شاورما دجاج", price: 1750, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66646.jpg", description: "" },
  { name: "بوكس عائلي", price: 1450, category: "شاورما الدجاج", unit: "وجبة", image: "/assets/photos/shamgrill/p-66647.jpg", description: "" },
  // شاورما اللحم
  { name: "اصبع لحم", price: 160, category: "شاورما اللحم", unit: "قطعة", image: "/assets/photos/shamgrill/p-66648.jpg", description: "", options: [{ name: "الحجم", values: ["افرادي","دبل"], extra: [0,100] }] },
  { name: "شاورما لحم", price: 280, category: "شاورما اللحم", unit: "سندويش", image: "/assets/photos/shamgrill/p-66650.jpg", description: "", options: [{ name: "الحجم", values: ["لف","دبل"], extra: [0,100] }] },
  { name: "صاروخ شاورما لحم", price: 385, category: "شاورما اللحم", unit: "سندويش", image: "/assets/photos/shamgrill/p-66652.jpg", description: "" },
  { name: "شاورما لحم صمون", price: 340, category: "شاورما اللحم", unit: "سندويش", image: "/assets/photos/shamgrill/p-66653.jpg", description: "" },
  { name: "وجبة عربي لحم", price: 395, category: "شاورما اللحم", unit: "وجبة", image: "/assets/photos/shamgrill/p-66654.jpg", description: "", options: [{ name: "الحجم", values: ["عربي","سوبر","دبل"], extra: [0,155,285] }] },
  { name: "وجبة عربي لحم صمون", price: 535, category: "شاورما اللحم", unit: "وجبة", image: "/assets/photos/shamgrill/p-66657.jpg", description: "" },
  { name: "شرحات لحم", price: 720, category: "شاورما اللحم", unit: "علبة", image: "/assets/photos/shamgrill/p-66658.jpg", description: "", options: [{ name: "الوزن", values: ["200 غرام","250 غرام","نص كيلو","كيلو"], extra: [0,170,880,2480] }] },
  { name: "وجبة لحم عائلي", price: 1990, category: "شاورما اللحم", unit: "وجبة", image: "/assets/photos/shamgrill/p-66662.jpg", description: "" },
  // الشرقي
  { name: "مندي دجاج", price: 370, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66594.jpg", description: "" },
  { name: "مندي لحم", price: 749, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66595.jpg", description: "" },
  { name: "منسف اردني", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66596.jpg", description: "" },
  { name: "يبرق", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66597.jpg", description: "" },
  { name: "شيش برك", price: 700, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66598.jpg", description: "" },
  { name: "برياني لحم", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66599.jpg", description: "" },
  { name: "برياني دجاج", price: 450, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66600.jpg", description: "" },
  { name: "شاكرية", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66602.jpg", description: "" },
  { name: "كوسا باللبن", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66603.jpg", description: "" },
  { name: "لبنية", price: 750, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66604.jpg", description: "" },
  { name: "حراق اصبعو", price: 250, category: "الشرقي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66605.jpg", description: "" },
  // مقبلات ساخنة
  { name: "كبة مقلية", price: 100, category: "مقبلات ساخنة", unit: "صحن", image: "/assets/photos/shamgrill/p-66606.jpg", description: "" },
  { name: "كبة مشوية", price: 120, category: "مقبلات ساخنة", unit: "صحن", image: "/assets/photos/shamgrill/p-66607.jpg", description: "" },
  { name: "رول مسخن", price: 50, category: "مقبلات ساخنة", unit: "صحن", image: "/assets/photos/shamgrill/p-66614.jpg", description: "" },
  { name: "برك جبنة", price: 50, category: "مقبلات ساخنة", unit: "صحن", image: "/assets/photos/shamgrill/p-66617.jpg", description: "" },
  { name: "برك لحمة", price: 64, category: "مقبلات ساخنة", unit: "صحن", image: "/assets/photos/shamgrill/p-66618.jpg", description: "" },
  // مقبلات باردة
  { name: "صحن يالنجي", price: 200, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66619.jpg", description: "" },
  { name: "مسبحة", price: 230, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66621.jpg", description: "" },
  { name: "متبل", price: 250, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66622.jpg", description: "" },
  { name: "فتوش", price: 220, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66623.jpg", description: "" },
  { name: "تبولة", price: 210, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66624.jpg", description: "" },
  { name: "بابا غنوج", price: 250, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66625.jpg", description: "" },
  { name: "جرجير", price: 200, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66626.jpg", description: "" },
  { name: "سلطة شرقية", price: 200, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66627.jpg", description: "" },
  { name: "سيزر", price: 300, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66628.jpg", description: "" },
  { name: "طبق مشكل بارد", price: 300, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/shamgrill/p-66629.jpg", description: "" },
  // غربي
  { name: "سندويش بطاطا", price: 165, category: "غربي", unit: "صحن", image: "/assets/photos/shamgrill/p-66663.jpg", description: "" },
  { name: "سندويش زنجر", price: 250, category: "غربي", unit: "سندويش", image: "/assets/photos/shamgrill/p-66664.jpg", description: "" },
  { name: "سندويش كريسبي", price: 240, category: "غربي", unit: "سندويش", image: "/assets/photos/shamgrill/p-66665.jpg", description: "" },
  { name: "وجبة زنجر", price: 435, category: "غربي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66666.jpg", description: "" },
  { name: "وجبة كريسبي", price: 435, category: "غربي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66667.jpg", description: "" },
  { name: "ميني برغر", price: 360, category: "غربي", unit: "سندويش", image: "/assets/photos/shamgrill/p-66668.jpg", description: "" },
  { name: "بطاطا بروستد", price: 225, category: "غربي", unit: "صحن", image: "/assets/photos/shamgrill/p-66679.jpg", description: "" },
  { name: "صحن بطاطا", price: 200, category: "غربي", unit: "صحن", image: "/assets/photos/shamgrill/p-66683.jpg", description: "" },
  // بروستد
  { name: "وجبة بروستد", price: 435, category: "بروستد", unit: "وجبة", image: "/assets/photos/shamgrill/p-66669.jpg", description: "", options: [{ name: "النوع", values: ["عادي","سبايسي"], extra: [0,0] }] },
  // مشوي
  { name: "فروج مشوي", price: 550, category: "مشوي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66672.jpg", description: "" },
  { name: "وجبة مشوي مع رز", price: 360, category: "مشوي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66673.jpg", description: "" },
  { name: "وجبة مشوي مع بطاطا", price: 275, category: "مشوي", unit: "وجبة", image: "/assets/photos/shamgrill/p-66674.jpg", description: "" },
  // مشروبات
  { name: "بيبسي", price: 50, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66686.jpg", description: "", options: [{ name: "النوع", values: ["عادي","زيرو"], extra: [0,0] }] },
  { name: "سبرايت", price: 50, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66687.jpg", description: "" },
  { name: "فانتا", price: 50, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66688.jpg", description: "" },
  { name: "بيبسي كبير", price: 70, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66689.jpg", description: "" },
  { name: "عيران", price: 35, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66690.jpg", description: "" },
  { name: "ماء", price: 20, category: "مشروبات", unit: "علبة", image: "/assets/photos/shamgrill/p-66691.jpg", description: "" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const shamgrillProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const shamgrillProducts = (shamgrillProductCatalog.length ? shamgrillProductCatalog : shamgrillFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1570001 + index,
  storeId: shamgrillStore.id
}));

const shamgrillDeliverySettings = {
  [shamgrillStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { shamgrillStore, shamgrillProducts, shamgrillDeliverySettings };
}
