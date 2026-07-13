// Generated for تو بيز (Two2Bees) — Yenişehir/Mersin. Natural honey, hydrosols, herbal
// oils and extracts. Source: shopier.com/two2bees (Shopier storefront, public
// search_product API discovered per category tab; 102 unique products across 9 real
// category tabs after de-duplicating items shown under more than one tab).
//
// IMPORTANT — this store is intentionally SHOWCASE-ONLY, no in-platform checkout:
// the merchant ships nationwide via local post from Mersin, which does not fit
// Dukkanci's live per-km delivery model (checkout-enforced max round-trip capped at
// 200km in app.js). Every product below has priceOnRequest=true, which makes
// addToCart() bail out immediately (app.js) and instead shows a real "اطلب عبر واتساب"
// button (waOrderLink()) straight to the merchant's own WhatsApp — no cart, no
// delivery-fee calculation ever runs for this store. See CLAUDE.md fix log 2026-07-13.
//
// NOTE: two2beesProductCatalog is intentionally emptied in the repo (perf, same pattern
// as beitbeyrut-data.js) — the full catalog lives in Supabase and is pushed via the
// Supabase MCP execute_sql (anon-key writes to stores/products are RLS-blocked).
const two2beesStore = {
 "id": 91,
 "name": "تو بيز - عسل طبيعي ومنتجات عشبية",
 "category": "مواد غذائية متخصصة",
 "image": "/assets/photos/two2bees/cover.jpg",
 "coverImage": "/assets/photos/two2bees/cover.jpg",
 "logoImage": "/assets/photos/two2bees/logo.jpg",
 "logo": "ت",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 0,
 "time": "السعر والتوصيل عند الطلب",
 "distance": 0,
 "location": {
  "lat": 36.7798888,
  "lng": 34.5800086
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=36.7798888,34.5800086",
 "open": true,
 "featured": false,
 "hasOffer": false,
 "offer": "",
 "priceOnRequest": true,
 "description": "تو بيز — عسل طبيعي ومنتجات عشبية من مرسين. عسل جبلي وحبة بركة وسدر وحمضيات وكستنا، مقطرات مائية عشبية، خلطات تقوية وعناية طبيعية، وتشكيلة واسعة من الزيوت العشبية النقية (30 و50 و250 مل فأكثر). المتجر لعرض المنتجات فقط — السعر والطلب عبر واتساب مباشرة مع المتجر، والشحن بريدي لعموم تركيا.",
 "address": "حي تتارلار (أيدنلي أوغلر)، شارع 2042، مبنى رقم 10، 33160 ينی شهير، مرسين، تركيا",
 "phone": "+90 501 120 01 00",
 "whatsapp": "+90 501 120 01 00",
 "email": "",
 "website": "https://linktr.ee/two2bees",
 "sourceUrl": "https://www.shopier.com/two2bees",
 "hours": "يُرجى التواصل عبر واتساب لتأكيد ساعات العمل",
 "areas": [
  "مرسين",
  "شحن بريدي لعموم تركيا"
 ],
 "fulfillment": "شحن بريدي (بلا توصيل مباشر عبر دكانجي)",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const two2beesFullCatalog = [
  // عسل طبيعي
  { name: "عسل أزهار الشوكيات 425 غرام", price: 750, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-43660362.jpg" },
  { name: "عسل أزهار الشوكيات 850 غرام", price: 1500, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-43660319.jpg" },
  { name: "عسل الجبلي 425 غ", price: 850, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20691020.jpg" },
  { name: "عسل الجبلي 850 غ", price: 1700, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20689877.jpg" },
  { name: "عسل الحمضيات 425", price: 400, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20690772.jpg" },
  { name: "عسل الحمضيات 850 غ", price: 800, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20690040.jpg" },
  { name: "عسل السدر 425 غ", price: 1250, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20690153.jpg" },
  { name: "عسل السدر 850 غ", price: 2500, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20228012.jpg" },
  { name: "عسل بالشهد الطبيعي 1 كيلو", price: 2500, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20691910.jpg" },
  { name: "عسل حبة البركة 425 غ", price: 1000, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20690221.jpg" },
  { name: "عسل حبة البركة 850 غ", price: 2000, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-20245542.jpg" },
  { name: "عسل كستنا 425 غرام", price: 1500, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-29644271.jpg" },
  { name: "عسل كستنا 850 غرام", price: 3000, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-29644235.jpg" },
  { name: "قرص عسل الزهور الجبلية بالمكسرات 1600 غرام", price: 2350, category: "عسل طبيعي", image: "/assets/photos/two2bees/products/p-37344612.jpg" },
  // المقطرات المائية
  { name: "مقطر ارضي شوكي 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322379.jpg" },
  { name: "مقطر اكليل الجبل 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322296.jpg" },
  { name: "مقطر الزعتر 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322335.jpg" },
  { name: "مقطر النعناع 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322360.jpg" },
  { name: "مقطر اوكاليبتوس 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322440.jpg" },
  { name: "مقطر ذيل الفرس 750 مل", price: 350, category: "المقطرات المائية", image: "/assets/photos/two2bees/products/p-41322407.jpg" },
  // زيوت 250 مل وأكثر
  { name: "تنكة زيت زيتون بكر16 كيلو", price: 6500, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-32458151.jpg" },
  { name: "زيت السمسم 250 مل", price: 450, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-26679266.jpg" },
  { name: "زيت القرع 250 مل", price: 700, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-26679279.jpg" },
  { name: "زيت بذر الكتان 250 مل", price: 400, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-26679234.jpg" },
  { name: "زيت جوز الهند 250 غرام", price: 450, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-26679158.jpg" },
  { name: "زيت حبة البركة 250 مل", price: 450, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-26679198.jpg" },
  { name: "زيت زيتون بكر 5 لتر (عرض التوفير)", price: 2200, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-37109560.jpg" },
  { name: "زيت زيتون بكر 750 مل", price: 450, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-29644493.jpg" },
  { name: "زيت زيتون عصر على البارد 750 مل", price: 750, category: "زيوت 250 مل وأكثر", image: "/assets/photos/two2bees/products/p-29644457.jpg" },
  // زيوت 50 مل
  { name: "زيت الاملج 50 مل", price: 250, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153812.jpg" },
  { name: "زيت البطم 50 مل", price: 220, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153791.jpg" },
  { name: "زيت الثوم 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153847.jpg" },
  { name: "زيت الجوز 50 مل", price: 100, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153824.jpg" },
  { name: "زيت الحرمل 50 مل", price: 175, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153870.jpg" },
  { name: "زيت الحلبة 50 مل", price: 250, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154675.jpg" },
  { name: "زيت الحنظل 50 مل", price: 250, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153886.jpg" },
  { name: "زيت الخردل 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153984.jpg" },
  { name: "زيت الخروع 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37153926.jpg" },
  { name: "زيت الزنجبيل 50 مل", price: 200, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154051.jpg" },
  { name: "زيت السذاب 50 مل", price: 140, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154001.jpg" },
  { name: "زيت السمسم 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154267.jpg" },
  { name: "زيت الطرفة 50 مل", price: 140, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154185.jpg" },
  { name: "زيت الغليسيرين 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154310.jpg" },
  { name: "زيت القديس 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154294.jpg" },
  { name: "زيت القرطم 50 مل", price: 125, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154379.jpg" },
  { name: "زيت القريص 50 مل", price: 425, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154329.jpg" },
  { name: "زيت الكتان 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154430.jpg" },
  { name: "زيت الهوا جوا 50 مل", price: 160, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154570.jpg" },
  { name: "زيت بذر القرع 50 مل", price: 300, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154603.jpg" },
  { name: "زيت بذر شوك الجمل 50 مل", price: 150, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154546.jpg" },
  { name: "زيت ثمر الغار 50 مل", price: 350, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154647.jpg" },
  { name: "زيت حبة البركة 50 مل", price: 175, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-37154626.jpg" },
  { name: "قطرة زيت اكليل الجبل سعة 50 مل", price: 300, category: "زيوت 50 مل", image: "/assets/photos/two2bees/products/p-31029524.jpg" },
  // زيوت 30 مل
  { name: "زيت الاراغان 30 مل", price: 520, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155007.jpg" },
  { name: "زيت الافندر 30 مل", price: 200, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155020.jpg" },
  { name: "زيت البابونج 30 مل", price: 150, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155164.jpg" },
  { name: "زيت الجرجير 30 مل", price: 425, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155193.jpg" },
  { name: "زيت الزعتر 30 مل", price: 225, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155381.jpg" },
  { name: "زيت السعد 30 مل", price: 300, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155409.jpg" },
  { name: "زيت العرعر 30 مل", price: 175, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155481.jpg" },
  { name: "زيت القرفة 30 مل", price: 200, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155552.jpg" },
  { name: "زيت القرنفل 30 مل", price: 175, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155532.jpg" },
  { name: "زيت القسط الهندي 30 مل", price: 450, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155662.jpg" },
  { name: "زيت اللوز الحلو 30 مل", price: 200, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155572.jpg" },
  { name: "زيت اللوز المر 30 مل", price: 240, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155702.jpg" },
  { name: "زيت المر مكي 30 مل", price: 200, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155689.jpg" },
  { name: "زيت النعناع 30 مل", price: 250, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155746.jpg" },
  { name: "زيت الورد 30 مل", price: 300, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155735.jpg" },
  { name: "زيت بذر العنب 30 مل", price: 300, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155762.jpg" },
  { name: "زيت زهرة الربيع 30 مل", price: 180, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155807.jpg" },
  { name: "زيت ورق الاس 30 مل", price: 200, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155856.jpg" },
  { name: "زيت ورق الغار 30 مل", price: 170, category: "زيوت 30 مل", image: "/assets/photos/two2bees/products/p-37155840.jpg" },
  // غذائية
  { name: "خل التفاح 750 مل", price: 650, category: "غذائية", image: "/assets/photos/two2bees/products/p-29644414.jpg" },
  { name: "دبس الرمان 1 كيلو (بيتوتي خام )", price: 750, category: "غذائية", image: "/assets/photos/two2bees/products/p-29852853.jpg" },
  { name: "زعفران 1 غرام", price: 180, category: "غذائية", image: "/assets/photos/two2bees/products/p-20743215.jpg" },
  { name: "سمنة بقر 500 غرام", price: 650, category: "غذائية", image: "/assets/photos/two2bees/products/p-20743061.jpg" },
  { name: "سمنة غنم 500 غرام", price: 850, category: "غذائية", image: "/assets/photos/two2bees/products/p-20743099.jpg" },
  // سيرومات ومستخلصات
  { name: "سيروم عرق السوس 30 مل", price: 300, category: "سيرومات ومستخلصات", image: "/assets/photos/two2bees/products/p-35778629.jpg" },
  { name: "سيروم لبان الذكر 30 مل", price: 350, category: "سيرومات ومستخلصات", image: "/assets/photos/two2bees/products/p-35778507.jpg" },
  { name: "شيلاجيت سائل 30 مل", price: 300, category: "سيرومات ومستخلصات", image: "/assets/photos/two2bees/products/p-37101989.jpg" },
  { name: "مستخلص العكبر 30 مل (زيتي)", price: 400, category: "سيرومات ومستخلصات", image: "/assets/photos/two2bees/products/p-25294306.jpg" },
  { name: "مستخلص العكبر 30 مل (كحولي)", price: 300, category: "سيرومات ومستخلصات", image: "/assets/photos/two2bees/products/p-29644505.jpg" },
  // خلطات
  { name: "الخلطة المقوية 470 غرام + غذاء ملكات", price: 1600, category: "خلطات", image: "/assets/photos/two2bees/products/p-37656936.jpg" },
  { name: "الخلطة المقوية 470 غرام", price: 900, category: "خلطات", image: "/assets/photos/two2bees/products/p-28835005.jpg" },
  { name: "ثنائي القوة +18 (خلطة ملكية)", price: 1699, category: "خلطات", image: "/assets/photos/two2bees/products/p-37103360.jpg" },
  { name: "خلطة الطاقة اليومية", price: 700, category: "خلطات", image: "/assets/photos/two2bees/products/p-24132429.jpg" },
  { name: "خلطة الطاقة اليومية 470 غرام + غذاء الملكات", price: 1400, category: "خلطات", image: "/assets/photos/two2bees/products/p-37656974.jpg" },
  { name: "عرض التقوية العامة ( اقتصادي )", price: 1400, category: "خلطات", image: "/assets/photos/two2bees/products/p-28835229.jpg" },
  { name: "عرض الخلطات الملكية المقوية + غذاء ملكات", price: 2699, category: "خلطات", image: "/assets/photos/two2bees/products/p-37656474.jpg" },
  // منتجات توبيز الخاصة
  { name: "بوكس الفيتامينات ( 4 منتجات في بوكس واحد )", price: 1750, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-36501055.jpg" },
  { name: "حبوب اللقاح 250 غرام", price: 500, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-24132767.jpg" },
  { name: "خبز النحل 50 غرام", price: 300, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-28835076.jpg" },
  { name: "زبدة الشيا الافريقية 150 غرام (خام)", price: 650, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37106191.jpg" },
  { name: "زبدة الشيا الافريقية 50 غرام (خام)", price: 350, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37297201.jpg" },
  { name: "شامبو اكليل الجبل الطبيعي 400 مل (لكل مشاكل الشعر)", price: 400, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37297433.jpg" },
  { name: "طحينة النحلتين الفاخرة 600 غرام", price: 300, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-38061874.jpg" },
  { name: "عسل الزهور الجبلية بالمكسرات الاكسترا +700 غرام", price: 1000, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-25294244.jpg" },
  { name: "كريم اكليل الجبل المغذي للشعر 200 مل", price: 400, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37297490.jpg" },
  { name: "ماء مقطر اكليل الجبل 400 مل", price: 300, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-31030171.jpg" },
  { name: "مجموعة اكليل الجبل الطبيعية للشعر", price: 1200, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37239718.jpg" },
  { name: "مجموعة العناية بالبشرة المتكاملة", price: 1150, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-37930189.jpg" },
  { name: "مرطبان دبس خروب 800 غرام", price: 500, category: "منتجات توبيز الخاصة", image: "/assets/photos/two2bees/products/p-32696549.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const two2beesProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
// priceOnRequest=true on every product — see header note; this is what actually
// suppresses "أضف للسلة" and shows the WhatsApp order button instead.
const two2beesProducts = (two2beesProductCatalog.length ? two2beesProductCatalog : two2beesFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  priceOnRequest: true,
  id: 1730001 + index,
  storeId: two2beesStore.id
}));

const two2beesDeliverySettings = {
  [two2beesStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { two2beesStore, two2beesProducts, two2beesDeliverySettings };
}
