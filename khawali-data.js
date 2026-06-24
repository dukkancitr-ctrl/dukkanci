// Generated for مطعم الخوالي (Al Khawali) — Fatih, Istanbul. Source: tillymenu.com/75/alkhawali
const khawaliStore = {
 "id": 31,
 "name": "مطعم الخوالي",
 "category": "مطاعم",
 "image": "/assets/photos/khawali/cover.jpg",
 "coverImage": "/assets/photos/khawali/cover.jpg",
 "logoImage": "/assets/photos/khawali/logo.jpg",
 "logo": "خ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 14,
 "location": {
  "lat": 41.024171,
  "lng": 28.659568
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.024171,28.659568",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم الخوالي في إسنيورت بإسطنبول: متخصّص بالشاورما العربية على أنواعها وساندويتشاتها ووجباتها، مع الدجاج المشوي والساندويتشات الغربية والمقبلات والشاميات والمشروبات. أسماء الأصناف والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "Yeşilkent Mah. 1880. Sk. No:50 A, 34515 Esenyurt/İstanbul",
 "phone": "+90 538 744 81 94",
 "whatsapp": "+90 538 744 81 94",
 "email": "",
 "website": "https://tillymenu.com/75/alkhawali",
 "sourceUrl": "https://tillymenu.com/75/alkhawali",
 "hours": "يومياً على مدار الساعة",
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

const khawaliProductCatalog = [];

const khawaliProducts = khawaliProductCatalog.map((product, index) => ({
  ...product,
  id: 37001 + index,
  storeId: khawaliStore.id
}));

const khawaliDeliverySettings = {
  [khawaliStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};
