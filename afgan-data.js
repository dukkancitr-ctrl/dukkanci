// Generated for مطعم أفغان كباب (Afgan Kebap) — Esenyurt/Beylikduzu, Istanbul. Source: afgankebap.com
const afganStore = {
 "id": 17,
 "name": "مطعم أفغان كباب",
 "category": "مطاعم",
 "image": "/assets/photos/afgan/cover.jpg",
 "coverImage": "/assets/photos/afgan/cover.jpg",
 "logoImage": "/assets/photos/afgan/logo.png",
 "logo": "أ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 75 دقيقة",
 "distance": 24.0,
 "location": {
  "lat": 41.0192502,
  "lng": 28.6497621
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0192502,28.6497621",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم أفغان كباب — أول مطبخ أفغاني في إسنيورت/بيليك دوزو بإسطنبول: برياني (بيلاف) باللحم، كباب التكة الأفغاني، المومو (دامبلنغ)، المشاوي والصحون واليخنات والمقبلات. أسماء الأطباق كما في القائمة الرسمية للمطعم.",
 "address": "حي الجمهورية، شارع ناظم حكمت، 2066 Sk. 17/A، بيليك دوزو OSB / إسنيورت، إسطنبول",
 "phone": "+90 555 080 46 40",
 "whatsapp": "+90 555 080 46 40",
 "email": "",
 "website": "https://www.afgankebap.com/",
 "sourceUrl": "https://www.afgankebap.com/menu",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "إسنيورت",
  "بيليك دوزو",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const afganProductCatalog = [];

const afganProducts = afganProductCatalog.map((product, index) => ({
  ...product,
  id: 17001 + index,
  storeId: afganStore.id
}));

const afganDeliverySettings = {
  [afganStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
