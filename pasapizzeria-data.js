// Generated for باشا بيتزريا (Paşa Pizzeria) — Bağlarçeşme, Esenyurt, İstanbul.
// Source: pasapizzeria.com (Turkey branch) public menu. Italian & Turkish-style pizza, manakish,
// falafel, sandwiches & meals. Arabic names/descriptions are the brand's own (name_ar from source).
// NOTE: pasapizzeriaProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const pasapizzeriaStore = {
 "id": 56,
 "name": "باشا بيتزريا",
 "category": "مطاعم",
 "image": "/assets/photos/pasapizzeria/cover.jpg",
 "coverImage": "/assets/photos/pasapizzeria/cover.jpg",
 "logoImage": "/assets/photos/pasapizzeria/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0779648,
  "lng": 28.8882688
 },
 "mapUrl": "https://maps.app.goo.gl/V22e2F46PMaurqNX7",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "باشا بيتزريا — بيتزا إيطالية وعادية ومحشية الأطراف، مناقيش ولحم بعجين، فلافل ومعجنات، وصنادويش ووجبات الدجاج واللحم. نكهات طازجة تُحضَّر في الفرن وتصل إلى بابك.",
 "address": "باغلارتشيشمه، شارع 1106 رقم 4، إسنيورت، إسطنبول، تركيا",
 "phone": "+90 539 823 53 22",
 "whatsapp": "+90 539 823 53 22",
 "email": "",
 "website": "https://pasapizzeria.com",
 "sourceUrl": "https://pasapizzeria.com/#/turkey",
 "hours": "يومياً",
 "areas": [
  "إسنيورت",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo.
const pasapizzeriaFullCatalog = [
 {"name":"وجبة بالفرن (شخصين)","price":375,"category":"وجبات وصندويش الدجاج","unit":"صنف","image":"/assets/photos/pasapizzeria/p-b6adb296.jpg","description":"المكسيكانو أو السجق أو الدجاج يطبخ مع العجين في الفرن ويُقدَّم مع البطاطا المقلية.\n📍 نكهة مشبعة تكفي لشخصين!","options":[{"name":"الخيارات","values":["مكسيكانو","سجق","دجاج"],"extra":[0,0,0]}]},
 {"name":"دجاج بصوص الديناميت الحار","price":289,"category":"وجبات وصندويش الدجاج","unit":"صنف","image":"/assets/photos/pasapizzeria/p-d0fd7989.jpg","description":"🔥 قطع الدجاج بالديناميت الحار من Paşa Pizzeria… نكهة ما بتنوصف! 🔥\n📍 طعم مميز بيكسر التوقعات وبيرضي عشّاق النكهات الغير اعتيادية!","featured":true,"options":[{"name":"الخيارات","values":["صندويش","وجبة 3 قطع","وجبة 4 قطع"],"extra":[0,86,186]}]},
 {"name":"بيتزا مرغريتا ايطالية","price":390,"category":"البيتزا الايطالية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-7d6bb19e.jpg","description":"","options":[{"name":"الخيارات","values":["28 سم","33 سم","38 سم"],"extra":[0,85,159]}]},
 {"name":"بيتزا خضار ايطالية","price":389,"category":"البيتزا الايطالية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-64cb5b60.jpg","description":"","options":[{"name":"الخيارات","values":["28 سم","33 سم","38 سم"],"extra":[0,86,160]}]},
 {"name":"بيتزا بوفالينا الايطالية","price":419,"category":"البيتزا الايطالية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-c25fbf99.jpg","description":"","options":[{"name":"الخيارات","values":["28 سم","33 سم","38 سم"],"extra":[0,80,156]}]},
 {"name":"بيتزا بباروني ايطالية","price":419,"category":"البيتزا الايطالية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-f821b9b9.jpg","description":"","options":[{"name":"الخيارات","values":["28 سم","33 سم","38 سم"],"extra":[0,80,156]}]},
 {"name":"بيتزا خضار وفطر محشية الأطراف","price":419,"category":"البيتزا محشية الاطراف","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-c1ac9f33.jpg","description":"","options":[{"name":"الخيارات","values":["28 سم","33 سم","38 سم"],"extra":[0,80,180]}]},
 {"name":"شاورما لحم صندويش","price":300,"category":"جديد باشا بيتزريا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-da549007.jpg","description":"70 غ من شاورما اللحم، صوص خاص، وسلطة خاصة","featured":true},
 {"name":"وجبة ميغا كوفا","price":950,"category":"جديد باشا بيتزريا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-6a10a5fe.jpg","description":"وجبة لشخصين: 700 غ من قطع الدجاج المقلي بتوابل خاصة، بطاطا مقلية، صوصات، و2 كولا."},
 {"name":"وجبة شيش بالقشقوان","price":375,"category":"جديد باشا بيتزريا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-5c6a33ba.jpg","description":"صدر دجاج محضر في الفرن مع توابل خاصة ومغطى بجبنة القشقوان."},
 {"name":"بطاطا صندويش","price":100,"category":"البطاطا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-fd1636a8.jpg","description":"","options":[{"name":"الخيارات","values":["ميني","عادية","حشوة اكسترا","دبل خبز","حشوة اكسترا وخبز دبل"],"extra":[0,30,40,40,50]}]},
 {"name":"بطاطا صحن","price":65,"category":"البطاطا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-ab6d06b2.jpg","description":"","options":[{"name":"الخيارات","values":["صغير","وسط","كبير"],"extra":[0,84,234]}]},
 {"name":"بطاطا صندويش خبزة محمرة","price":140,"category":"البطاطا","unit":"صنف","image":"/assets/photos/pasapizzeria/p-bb5ca9f6.jpg","description":"","options":[{"name":"الخيارات","values":["خبزة محمرة","خبزة محمرة حشوة دبل","خبزة محمرة + خبزة عادية","خبزة محمرة حشوة دبل + خبزة عادية"],"extra":[0,10,10,20]}]},
 {"name":"كبة مقلية (قطعة)","price":130,"category":"مقبلات","unit":"صنف","image":"/assets/photos/pasapizzeria/p-194eeaec.jpg","description":"كبة مقلية مقرمشة من الخارج وطرية من الداخل (للقطعة)","featured":true},
 {"name":"مشروبات غازية","price":50,"category":"المشاريب","unit":"مشروب","image":"/assets/photos/pasapizzeria/p-b664a93d.jpg","description":"","options":[{"name":"الخيارات","values":["كولا  330 مل","برتقال  330 مل","فواكه  330 مل","كولا 1 ليتر","كولا 2.5 ليتر"],"extra":[0,0,0,25,70]}]},
 {"name":"عيران","price":30,"category":"المشاريب","unit":"مشروب","image":"/assets/photos/pasapizzeria/p-cb2845b9.jpg","description":"","options":[{"name":"الخيارات","values":["عيران مختوم 180 مل","عيران مختوم 285 مل.","عيران مفتوح 330 مل","عيران مفتوح 1 ليتز"],"extra":[0,15,15,95]}]},
 {"name":"بيتزا مرغريتا","price":249,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-b966d60f.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,76,150,230]}]},
 {"name":"بيتزا الدجاج","price":299,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-35f4a7ff.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,60,136,200]}]},
 {"name":"بيتزا السجق","price":299,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-98ee2bef.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,60,136,200]}]},
 {"name":"بيتزا الخضار","price":249,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-e57949f9.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,76,150,230]}]},
 {"name":"بيتزا الفطر","price":249,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-05ed49cc.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,76,150,230]}]},
 {"name":"بيتزا الخضار والفطر","price":249,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-8d520061.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,76,150,230]}]},
 {"name":"بيتزا مشكلة","price":299,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-1c9bf9fb.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,60,136,200]}]},
 {"name":"بيتزا بباروني","price":299,"category":"بيتزا عادية","unit":"بيتزا","image":"/assets/photos/pasapizzeria/p-4460eec5.jpg","description":"","options":[{"name":"الخيارات","values":["24 سم","28 سم","33 سم","38 سم"],"extra":[0,60,136,200]}]},
 {"name":"سلطة فلافل","price":195,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-e9e65532.jpg","description":"","options":[{"name":"الخيارات","values":["عادية","اكسترا"],"extra":[0,30]}]},
 {"name":"فلافل صندويش","price":100,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-7b512cb9.jpg","description":"","options":[{"name":"الخيارات","values":["ميني","عادية","حشوة اكسترا","دبل خبز","حشوة اكسترا وخبز دبل"],"extra":[0,30,40,40,50]}]},
 {"name":"فلافل صندويش خبزة محمرة","price":140,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-ea79ed57.jpg","description":"","options":[{"name":"الخيارات","values":["خبزة محمرة","خبزة محمرة حشوة دبل","خبزة محمرة + خبزة عادية","خبزة محمرة حشوة دبل + خبزة عادية"],"extra":[0,10,10,20]}]},
 {"name":"صحن فلافل","price":65,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-f523c934.jpg","description":"","options":[{"name":"الخيارات","values":["4 قطع","6 قطع","10 قطع"],"extra":[0,34,64]}]},
 {"name":"وجبة فلافل عربي","price":249,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-9006a33a.jpg","description":"","options":[{"name":"الخيارات","values":["عادي","محمرة"],"extra":[0,10]}]},
 {"name":"وجبة فلافل عربي صندويش مقطع","price":249,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-036e501e.jpg","description":"","options":[{"name":"الخيارات","values":["عادية","محمرة"],"extra":[0,10]}]},
 {"name":"فلافل (قطعة)","price":7.5,"category":"الفلافل","unit":"صنف","image":"/assets/photos/pasapizzeria/p-b452561c.jpg","description":""}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const pasapizzeriaProductCatalog = [];

const pasapizzeriaProducts = (pasapizzeriaProductCatalog.length ? pasapizzeriaProductCatalog : pasapizzeriaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1400001 + index,
  storeId: pasapizzeriaStore.id
}));

const pasapizzeriaDeliverySettings = {
  [pasapizzeriaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { pasapizzeriaStore, pasapizzeriaProducts, pasapizzeriaDeliverySettings };
}
