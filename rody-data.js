// Generated for مطعم رودي (RODY) — Park Mavera, Kayabaşı, Başakşehir, Istanbul.
// Source: owner-provided menu PDF + business card. Tagline: نكهات غربية بلمسة فلسطينية / Filistin dokunuşlu Batı lezzetleri.
// NOTE: rodyProductCatalog is intentionally emptied in the repo (perf) — the full
// catalog lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const rodyStore = {
 "id": 51,
 "name": "مطعم رودي",
 "category": "مطاعم",
 "image": "/assets/photos/rody/cover.jpg",
 "coverImage": "/assets/photos/rody/cover.jpg",
 "logoImage": "/assets/photos/rody/logo.png",
 "logo": "ر",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1178,
  "lng": 28.7724
 },
 "mapUrl": "https://maps.app.goo.gl/UwLWJfp5ZNtG4LYR9",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم رودي — نكهات غربية بلمسة فلسطينية. ساندويشات شاورما دجاج ولحم، كباب وشيش طاووك وعروسة وكبدة، برجر لحم ودجاج، ودجاج مقرمش (زنجر، كريسبي، سنيتشل، كرانشي)، إضافة إلى وجبات المشاوي وصحون الشاورما. طازج ويصل إلى بابك.",
 "address": "بارك مافيرا، كايا باشي، باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 534 485 43 57",
 "whatsapp": "+90 534 485 43 57",
 "email": "",
 "website": "",
 "sourceUrl": "https://maps.app.goo.gl/UwLWJfp5ZNtG4LYR9",
 "hours": "يومياً من 2:00 ظهراً حتى 1:00 منتصف الليل",
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
const rodyFullCatalog = [
 // ساندويشات
 { name: "رودي طابون", price: 200, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/rody-taboon.jpg", description: "دجاج محشي بالجبنة والزعتر مع صوص رودي." },
 { name: "كبدة دجاج", price: 200, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/kabda-dajaj.jpg", description: "كبدة دجاج مع فلفل ملوّن وصوص خاص." },
 { name: "شيش طاووك", price: 200, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/shish-tawook.jpg", description: "شيش طاووك دجاج مع الصوص والمخللات." },
 { name: "كباب لحم", price: 250, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/kabab-lahm.jpg", description: "كباب لحم مشوي مع الصوص والمخللات." },
 { name: "عروسة", price: 250, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/arousa.jpg", description: "لحم مشوي مع الصلصة والسلطة التركية." },
 { name: "شاورما دجاج", price: 180, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/shawarma-dajaj.jpg", description: "شرائح شاورما دجاج طازجة.", options: [{ name: "الحجم", values: ["عادي", "دبل"], extra: [0, 40] }] },
 { name: "شاورما لحم", price: 260, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/shawarma-lahm.jpg", description: "شرائح شاورما لحم طازجة.", options: [{ name: "الحجم", values: ["عادي", "دبل"], extra: [0, 130] }] },
 { name: "تشكن بيتزا", price: 270, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/chicken-pizza.jpg", description: "شرائح دجاج مع الصوص والمشروم والجبنة والفلفل الملوّن." },
 { name: "زنجر", price: 240, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/zinger-sand.jpg", description: "دجاج مقرمش مع الصوص والكول سلو." },
 { name: "كريسبي", price: 220, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/crispy-sand.jpg", description: "دجاج مقرمش مع الصوص والكول سلو." },
 { name: "سنيتشل", price: 220, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/snitchel-sand.jpg", description: "شرائح دجاج سنيتشل مقرمشة." },
 { name: "كرانشي", price: 280, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/cranchy-sand.jpg", description: "دجاج مقرمش مع الصوص والكول سلو." },
 { name: "برجر لحم", price: 300, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/burger-lahm.jpg", description: "برجر لحم ١٢٠غ مع جبنة شيدر ومخلل وطماطم وخس." },
 { name: "برجر دجاج", price: 250, category: "ساندويشات", unit: "ساندويش", image: "/assets/photos/rody/burger-dajaj.jpg", description: "برجر دجاج ١٥٠غ مع جبنة شيدر وخس وطماطم." },
 // وجبات مشاوي
 { name: "وجبة كباب لحم", price: 700, category: "وجبات مشاوي", unit: "وجبة", image: "/assets/photos/rody/wajba-kabab.jpg", description: "٣٠٠غ كباب لحم مع البطاطس والمخللات — تكفي حتى ٤ أشخاص." },
 { name: "وجبة شيش طاووك", price: 450, category: "وجبات مشاوي", unit: "وجبة", image: "/assets/photos/rody/wajba-shish.jpg", description: "شيش طاووك مشوي مع البطاطس والمخللات." },
 // صحون شاورما
 { name: "شرحات شاورما دجاج", price: 350, category: "صحون شاورما", unit: "صحن", image: "/assets/photos/rody/shr7at-shawarma.jpg", description: "شرحات شاورما دجاج مع البطاطس.", options: [{ name: "الحجم", values: ["٣٠٠ غرام", "نص كيلو", "كيلو"], extra: [0, 200, 650] }] },
 { name: "شاورما عربي لحم", price: 300, category: "صحون شاورما", unit: "صحن", image: "/assets/photos/rody/shawarma-lahm-sahn.jpg", description: "شاورما لحم مع المخللات والبطاطس.", options: [{ name: "الحجم", values: ["عادي", "دبل"], extra: [0, 90] }] },
 // وجبات دجاج مقلي
 { name: "وجبة زنجر", price: 450, category: "وجبات دجاج مقلي", unit: "وجبة", image: "/assets/photos/rody/wajba-zinger.jpg", description: "٤ قطع دجاج زنجر مع البطاطس والصوص." },
 { name: "وجبة كريسبي", price: 450, category: "وجبات دجاج مقلي", unit: "وجبة", image: "/assets/photos/rody/wajba-crispy.jpg", description: "٤ قطع دجاج كريسبي مع البطاطس والصوص." },
 { name: "وجبة سنيتشل", price: 450, category: "وجبات دجاج مقلي", unit: "وجبة", image: "/assets/photos/rody/wajba-snitchel.jpg", description: "شرائح دجاج سنيتشل مع البطاطس والصوص." },
 { name: "وجبة كرانشي", price: 490, category: "وجبات دجاج مقلي", unit: "وجبة", image: "/assets/photos/rody/wajba-cranchy.jpg", description: "٤ قطع دجاج كرانشي مع البطاطس والصوص." }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const rodyProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const rodyProducts = (rodyProductCatalog.length ? rodyProductCatalog : rodyFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1350001 + index,
  storeId: rodyStore.id
}));

const rodyDeliverySettings = {
  [rodyStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { rodyStore, rodyProducts, rodyDeliverySettings };
}
