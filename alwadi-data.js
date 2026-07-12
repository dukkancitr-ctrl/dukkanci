// Generated for مطعم الوادي (Al Wadi) — Istanbul. Source: alwadi.minidine.com (minidine)
const alwadiStore = {
 "id": 21,
 "name": "مطعم الوادي",
 "category": "مطاعم",
 "image": "/assets/photos/alwadi/cover.jpg",
 "coverImage": "/assets/photos/alwadi/cover.jpg",
 "logoImage": "/assets/photos/alwadi/logo.png",
 "logo": "و",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "35 - 65 دقيقة",
 "distance": 18,
 "location": {
  "lat": 41.063546,
  "lng": 28.667504
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.063546,28.667504",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم الوادي — شاورما ومشاوي وأطباق شعبية في إسطنبول: الشاورما بأنواعها وبوكسات الشاورما، قسم الشواية، الأطباق الشعبية، الإضافات والمشروبات. أسماء الأطباق كما في القائمة الرسمية للمطعم.",
 "address": "إسطنبول، تركيا",
 "phone": "+90 505 004 32 33",
 "whatsapp": "+90 505 004 32 33",
 "email": "",
 "website": "https://alwadi.minidine.com/",
 "sourceUrl": "https://alwadi.minidine.com/ar/?branch=alwadi",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const alwadiProductCatalog = [];

const alwadiProducts = alwadiProductCatalog.map((product, index) => ({
  ...product,
  id: 31001 + index,
  storeId: alwadiStore.id
}));

const alwadiDeliverySettings = {
  [alwadiStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};
