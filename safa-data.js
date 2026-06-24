// Generated for صفا الشام (Safa Al-Sham) — supermarket, Istanbul. Source: owner inventory export.
// Prices = المستهلك (consumer/selling price). Images matched from the existing market catalog (kady/kadiby)
// where the product name aligns; the rest use a branded placeholder for the owner to replace later.
const safaStore = {
 "id": 50,
 "name": "صفا الشام",
 "category": "سوبر ماركت",
 "image": "/assets/photos/safa/cover.jpg",
 "coverImage": "/assets/photos/safa/cover.jpg",
 "logoImage": "/assets/photos/safa/logo.jpg",
 "logo": "ص",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 30,
 "minOrder": 150,
 "time": "45 - 90 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.012437,
  "lng": 28.685187
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.012437,28.685187",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "صفا الشام — سوبر ماركت متكامل في إسطنبول: بقالة ومونة، أجبان وألبان، مكسرات وتسالي وحلويات، مشروبات وعصائر، بهارات وتوابل، زيوت وسمن، معلبات ومخللات، خضار وفواكه ولحوم ومجمدات، إضافة إلى مستلزمات التنظيف والعناية الشخصية والأدوات المنزلية.",
 "address": "إسنيورت، إسطنبول، تركيا",
 "phone": "+90 552 502 40 58",
 "whatsapp": "+90 552 502 40 58",
 "email": "",
 "website": "",
 "sourceUrl": "",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
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

const safaProductCatalog = [];

const safaProducts = safaProductCatalog.map((product) => ({
  ...product,
  storeId: safaStore.id
}));

const safaDeliverySettings = {
  [safaStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 12, prepMinutes: 40, maxRoundTripKm: 140,
    namedZones: [
      { match: ["برستيج بارك", "prestige park"], fee: 50, label: "مجمع برستيج بارك" },
      { match: ["تيراس ميكس", "terrace mix"], fee: 50, label: "تيراس ميكس" }
    ]
  }
};
