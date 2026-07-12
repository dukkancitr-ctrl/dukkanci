// Generated for مطعم أيام شامية (Sam Gunleri) — Esenyurt, Istanbul. Full menu via API (image-bearing items only)
const samStore = {
 "id": 18,
 "name": "مطعم أيام شامية",
 "category": "مطاعم",
 "image": "/assets/photos/sam/cover.jpg",
 "coverImage": "/assets/photos/sam/cover.jpg",
 "logoImage": "/assets/photos/sam/logo.png",
 "logo": "ش",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 22.0,
 "location": {
  "lat": 41.035936,
  "lng": 28.678008
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.035935792509,28.678007796407",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم أيام شامية — نكهات شامية أصيلة: الشاورما، الفروج والمشاوي والوجبات الغربية، الأطباق الشرقية والمناسف، الكبة والأسماك والمعجنات، إضافة إلى الوافل والكريب وسلطات الفواكه والعصائر والكوكتيلات الطازجة.",
 "address": "إسنيورت، إسطنبول، تركيا",
 "phone": "+90 505 173 58 70",
 "whatsapp": "+90 505 173 58 70",
 "email": "",
 "website": "https://samgunleri.com/",
 "sourceUrl": "https://samgunleri.com/",
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

const samProductCatalog = [];

const samProducts = samProductCatalog.map((product, index) => ({
  ...product,
  id: 18001 + index,
  storeId: samStore.id
}));

const samDeliverySettings = {
  [samStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
