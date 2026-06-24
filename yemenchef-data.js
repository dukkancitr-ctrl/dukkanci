// Generated for مطعم يمن شيف (Yemen Chef) — Istanbul. Source: yemenchef.minidine.com (minidine)
const yemenchefStore = {
 "id": 20,
 "name": "مطعم يمن شيف",
 "category": "مطاعم",
 "image": "/assets/photos/yemenchef/cover.jpg",
 "coverImage": "/assets/photos/yemenchef/cover.jpg",
 "logoImage": "/assets/photos/yemenchef/logo.png",
 "logo": "ي",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "40 - 70 دقيقة",
 "distance": 20,
 "location": {
  "lat": 41.007737,
  "lng": 28.681519
 },
 "mapUrl": "https://maps.app.goo.gl/nnu6pz4w4Drj62R2A",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم يمن شيف — المطبخ اليمني الأصيل في إسطنبول: المندي والمظبي والحنيذ، وجبات اللحوم والدجاج، الأطباق البحرية، الماكولات بالرز، السلطات والمقبلات والمعجنات والحلويات والعصائر. أسماء الأطباق كما في القائمة الرسمية للمطعم.",
 "address": "إسطنبول، تركيا",
 "phone": "+90 530 665 04 61",
 "whatsapp": "+90 530 665 04 61",
 "email": "",
 "website": "https://yemenchef.minidine.com/",
 "sourceUrl": "https://yemenchef.minidine.com/ar/categories/?branch=yemen-chef",
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

const yemenchefProductCatalog = [];

const yemenchefProducts = yemenchefProductCatalog.map((product, index) => ({
  ...product,
  id: 30001 + index,
  storeId: yemenchefStore.id
}));

const yemenchefDeliverySettings = {
  [yemenchefStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};
