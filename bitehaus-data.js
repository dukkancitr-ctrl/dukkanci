// Generated for مطعم بايت هاوس (BiteHaus) — Esenyurt, Istanbul. Source: bitehaus.minidine.com (minidine)
const bitehausStore = {
 "id": 25,
 "name": "مطعم بايت هاوس",
 "category": "مطاعم",
 "image": "/assets/photos/bitehaus/cover.jpg",
 "coverImage": "/assets/photos/bitehaus/cover.jpg",
 "logoImage": "/assets/photos/bitehaus/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 17,
 "location": {
  "lat": 41.0103227,
  "lng": 28.6808228
 },
 "mapUrl": "https://maps.app.goo.gl/PSw2uBK3TxYLdsxQ9",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم بايت هاوس (BiteHaus) في إسنيورت بإسطنبول: الوجبات والساندويتش والبرجر والبيتزا والشاورما والراب والريزو وأطباق البيت الخاصة، مع الصوصات والإضافات والمشروبات. أسماء الأصناف والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "Near, Zafer, 175. Sk., 34513 Esenyurt/İstanbul، إسطنبول، تركيا",
 "phone": "+90 531 747 02 30",
 "whatsapp": "+90 531 747 02 30",
 "email": "",
 "website": "https://bitehaus.minidine.com/ar/categories/?branch=bitehaus",
 "sourceUrl": "https://bitehaus.minidine.com/ar/categories/?branch=bitehaus",
 "hours": "يومياً 12:30 ظهراً – 11:30 مساءً (الجمعة من 12:00 ظهراً)",
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

const bitehausProductCatalog = [];

const bitehausProducts = bitehausProductCatalog.map((product, index) => ({
  ...product,
  id: 36001 + index,
  storeId: bitehausStore.id
}));

const bitehausDeliverySettings = {
  [bitehausStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
