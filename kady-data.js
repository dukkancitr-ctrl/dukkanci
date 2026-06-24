// Generated for قاضي ماركت باشاك شهير (Kadi Market) — Basaksehir, Istanbul. Source: kadimarket.net (images via store CDN)
const kadyStore = {
 "id": 19,
 "name": "قاضي ماركت باشاك شهير",
 "category": "سوبر ماركت",
 "image": "/assets/photos/kady/cover.jpg",
 "coverImage": "/assets/photos/kady/cover.jpg",
 "logoImage": "/assets/photos/kady/logo.png",
 "logo": "ق",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 30,
 "minOrder": 200,
 "time": "45 - 90 دقيقة",
 "distance": 18.0,
 "location": {
  "lat": 41.101,
  "lng": 28.793
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kadi+Market+Basaksehir+Kayasehir+Istanbul",
 "open": true,
 "featured": true,
 "hasOffer": true,
 "offer": "عروض قاضي ماركت المتجددة",
 "description": "قاضي ماركت باشاك شهير — سوبر ماركت متكامل: بقالة وتسالي ومشروبات، فطور وأجبان وألبان، بقوليات ومكرونة، سمن وزيوت، بهارات ومكسرات، خضار وفواكه ولحوم ومجمدات، إضافة إلى العناية الشخصية والمنظفات والأدوات المنزلية.",
 "address": "كاياشهير / باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 552 780 99 99",
 "whatsapp": "+90 552 780 99 99",
 "email": "",
 "website": "https://kayasehir.kadimarket.net/",
 "sourceUrl": "https://kayasehir.kadimarket.net/ar/kady-markt-bashak-shhyr-18/",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "كاياشهير",
  "باشاك شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const kadyProductCatalog = [];

const kadyProducts = kadyProductCatalog.map((product, index) => ({
  ...product,
  id: 19001 + index,
  storeId: kadyStore.id
}));

const kadyDeliverySettings = {
  [kadyStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 12, prepMinutes: 40, maxRoundTripKm: 140 }
};
