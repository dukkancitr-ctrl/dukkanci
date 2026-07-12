// Generated for مطعم آدم شيف (Adem Şef) — Istanbul. Source: ademsef.com/shopping.php
// Prices are on request (the source menu publishes no prices). Product photos were
// quality-enhanced (upscale + denoise + sharpen + color); items without their own
// photo fall back to their category image.
const ademsefStore = {
 "id": 32,
 "name": "مطعم آدم شيف",
 "category": "مطاعم",
 "image": "/assets/photos/ademsef/cover.jpg",
 "coverImage": "/assets/photos/ademsef/cover.jpg",
 "logoImage": "/assets/photos/ademsef/logo.png",
 "logo": "آ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 16,
 "location": {
  "lat": 41.017618,
  "lng": 28.653228
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.017618,28.653228",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "priceOnRequest": true,
 "description": "مطعم آدم شيف في إسطنبول: قائمة واسعة تشمل الشوربات والسلطات والمقبلات الباردة والساخنة، الوجبات والسندويشات الغربية، الطبخ الشرقي والمشاوي والفخارات والبيتزا والمعجنات، إضافة إلى الفطور والتواصي والحلويات وتشكيلة كبيرة من المشروبات والعصائر. الأسعار عند الطلب — يرجى التواصل مع المطعم.",
 "address": "Cumhuriyet, 1979. Sk. No:16, 34515 Esenyurt/İstanbul",
 "phone": "+90 553 552 82 76",
 "whatsapp": "+90 553 552 82 76",
 "email": "",
 "website": "https://ademsef.com/shopping.php",
 "sourceUrl": "https://ademsef.com/shopping.php",
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

const ademsefProductCatalog = [];

const ademsefProducts = ademsefProductCatalog.map((product, index) => ({
  ...product,
  id: 38001 + index,
  storeId: ademsefStore.id
}));

const ademsefDeliverySettings = {
  [ademsefStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
