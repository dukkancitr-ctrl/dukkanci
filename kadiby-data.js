// Generated for القاضي ماركت - اسنيورت (Kadi Market Beylikduzu) — Istanbul. Source: trybany API (LD images downloaded locally; CDN is hotlink-protected)
const kadibyStore = {
 "id": 22,
 "name": "القاضي ماركت - اسنيورت",
 "category": "سوبر ماركت",
 "image": "/assets/photos/kadiby/logo.png",
 "coverImage": "/assets/photos/kadiby/logo.png",
 "logoImage": "/assets/photos/kadiby/logo.png",
 "logo": "ق",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 30,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 16,
 "location": {
  "lat": 41.0058,
  "lng": 28.6386
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=KADI+MARKET+Beylikduzu+Esenyurt+Istanbul",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "القاضي ماركت - فرع اسنيورت/بيليك دوزو: سوبر ماركت يضم آلاف المنتجات — فطور وحليب، شيبس وبسكويت، مياه ومشروبات، شاي وقهوة، أرز وبقوليات، بهارات، معلبات، منظفات، مكسرات، تمر، منتجات مصرية والمزيد. الأسماء والأسعار كما في المتجر الرسمي.",
 "address": "اسنيورت / بيليك دوزو، إسطنبول",
 "phone": "+90 537 394 95 00",
 "whatsapp": "+90 537 394 95 00",
 "email": "",
 "website": "https://app.trybany.com/ar/kadi-market-beylikduzu-1d9/",
 "sourceUrl": "https://app.trybany.com/ar/kadi-market-beylikduzu-1d9/",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "اسنيورت",
  "بيليك دوزو",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const kadibyProductCatalog = [];

const kadibyProducts = kadibyProductCatalog.map((product, index) => ({
  ...product,
  id: 32001 + index,
  storeId: kadibyStore.id
}));

const kadibyDeliverySettings = {
  [kadibyStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 12, prepMinutes: 40, maxRoundTripKm: 140 }
};
