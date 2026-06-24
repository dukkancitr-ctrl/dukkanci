// Generated from the official Mandy Meydan Restaurant (مطعم مندي ميدان) digital menu —
// Başakşehir, İstanbul. Source API: api.qualitycashier.com/v1 (mandymeydan.qualitycashier.net).
// 77 items with the shop's own photos; prices in Turkish Lira from the live menu.
const yemenmandyStore = {
 "id": 47,
 "name": "مطعم مندي ميدان",
 "category": "مطاعم",
 "image": "/assets/photos/yemenmandy/cover.webp",
 "coverImage": "/assets/photos/yemenmandy/cover.webp",
 "logoImage": "/assets/photos/yemenmandy/logo.webp",
 "logo": "م",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 15,
 "location": {
  "lat": 41.119478,
  "lng": 28.7737252
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.119478,28.7737252",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم مندي ميدان (Mandy Meydan): مطعم يمني في باشاك شهير متخصّص بالمندي والحنيذ والمضغوط والمدفون والبرياني والأطباق اليمنية الأصيلة من اللحم والدجاج والسمك، إضافة إلى السلطات والمقبلات والعصائر الطازجة والحلويات. الأصناف والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "Adnan Menderes Blv. No:10, 34494 Başakşehir, İstanbul",
 "phone": "+905364368673",
 "whatsapp": "+905364368673",
 "email": "mandymeydanrestoran@gmail.com",
 "website": "https://mandymeydan.qualitycashier.net/",
 "sourceUrl": "https://mandymeydan.qualitycashier.net/menu/",
 "hours": "يومياً 11:00 ص - 11:00 م",
 "areas": [
  "باشاك شهير",
  "كايا شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const yemenmandyProductCatalog = [];

const yemenmandyProducts = yemenmandyProductCatalog.map((product, index) => ({
  ...product,
  id: 1310001 + index,
  storeId: yemenmandyStore.id
}));

const yemenmandyDeliverySettings = {
  [yemenmandyStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};
