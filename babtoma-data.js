// Generated for مطعم باب توما (Bab Touma) — Esenyurt, Istanbul. Source: tillymenu.com/85/babtoma
const babtomaStore = {
 "id": 33,
 "name": "مطعم باب توما",
 "category": "مطاعم",
 "image": "/assets/photos/babtoma/cover.jpg",
 "coverImage": "/assets/photos/babtoma/cover.jpg",
 "logoImage": "/assets/photos/babtoma/logo.jpg",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 18,
 "location": {
  "lat": 41.0201389,
  "lng": 28.6706606
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0201389,28.6706606",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم شامي شرق أوسطي يقدم الأطباق الشامية مثل المشاوي و المعجنات والصفائح و الوجبات الغربيةبالإضافة إلى الشاورما مع المقبلات الباردة والمقبلات الساخنة مع السلطات الطازجة",
 "address": "إسنيورت، إسطنبول، تركيا",
 "phone": "+90 555 170 60 00",
 "whatsapp": "+90 555 170 60 00",
 "email": "",
 "website": "https://tillymenu.com/85/babtoma",
 "sourceUrl": "https://tillymenu.com/85/babtoma",
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

const babtomaProductCatalog = [];

const babtomaProducts = babtomaProductCatalog.map((product, index) => ({
  ...product,
  id: 39001 + index,
  storeId: babtomaStore.id
}));

const babtomaDeliverySettings = {
  [babtomaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
