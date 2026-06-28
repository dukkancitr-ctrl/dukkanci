// Generated for عصائر أورنج تركيا (Orange Turkey) — Istanbul. Source: app.trybany.com/ar/orange-turkey-166
// Prices are from the official menu (Turkish Lira). Product photos are the shop's own
// branded images; a few items without their own photo fall back to the store cover.
const orangeStore = {
 "id": 34,
 "name": "اورانج - تركيا",
 "category": "عصائر",
 "image": "/assets/photos/orange/cover.jpg",
 "coverImage": "/assets/photos/orange/cover.jpg",
 "logoImage": "/assets/photos/orange/logo.png",
 "logo": "أ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 30,
 "minOrder": 100,
 "time": "30 - 55 دقيقة",
 "distance": 12,
 "location": {
  "lat": 41.024084,
  "lng": 28.644626
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.024084,28.644626",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "عصائر أورنج تركيا: عصائر طبيعية طازجة باللتر وبالكأس، أفوكادو، كريب ووافل وبان كيك، ميلك شيك وكوكتيلات وموهيتو، سلطات فواكه ومشروبات ساخنة وباردة. كل المنتجات بأسعارها كما في القائمة الرسمية.",
 "address": "Piri Reis, Necip Fazıl Kısakürek Cd No:75, 34515 Esenyurt/İstanbul",
 "phone": "+90 555 553 52 53",
 "whatsapp": "+90 555 553 52 53",
 "email": "",
 "website": "https://app.trybany.com/ar/orange-turkey-166/",
 "sourceUrl": "https://app.trybany.com/ar/orange-turkey-166/",
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

const orangeProductCatalog = [];

const orangeProducts = orangeProductCatalog.map((product, index) => ({
  ...product,
  id: 40001 + index,
  storeId: orangeStore.id
}));

const orangeDeliverySettings = {
  [orangeStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 120 }
};
