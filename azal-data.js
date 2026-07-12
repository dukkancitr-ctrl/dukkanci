// Generated for مطعم آزال (AZAL) — Esenyurt, Istanbul. Source: menu.akillikurye.com (akillikurye)
const azalStore = {
 "id": 23,
 "name": "مطعم آزال",
 "category": "مطاعم",
 "image": "/assets/photos/azal/cover.jpg",
 "coverImage": "/assets/photos/azal/cover.jpg",
 "logoImage": "/assets/photos/azal/logo.jpg",
 "logo": "آ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 17,
 "location": {
  "lat": 41.014951,
  "lng": 28.650778
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.014951,28.650778",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم آزال — مطبخ شرقي في إسنيورت بإسطنبول: المقبلات والأسماك واللحوم والدجاج والقلايات والمخبوزات والعصائر والمشروبات. أسماء الأطباق والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "Mevlana, Yıldırım Beyazıt Cd. No:2, إسنيورت، إسطنبول",
 "phone": "+90 535 450 63 71",
 "whatsapp": "+90 535 450 63 71",
 "email": "",
 "website": "https://menu.akillikurye.com/mtaam-AZAL",
 "sourceUrl": "https://menu.akillikurye.com/mtaam-AZAL",
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

const azalProductCatalog = [];

const azalProducts = azalProductCatalog.map((product, index) => ({
  ...product,
  id: 34001 + index,
  storeId: azalStore.id
}));

const azalDeliverySettings = {
  [azalStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
