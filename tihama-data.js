// Generated for مطعم تهامة اليمن (Tihama) — Esenyurt, Istanbul. Source: menux.app/tihama
const tihamaStore = {
 "id": 16,
 "name": "مطعم تهامة اليمن",
 "category": "مطاعم",
 "image": "/assets/photos/tihama/cover.jpg",
 "coverImage": "/assets/photos/tihama/cover.jpg",
 "logoImage": "/assets/photos/tihama/logo.png",
 "logo": "ت",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 23.0,
 "location": {
  "lat": 41.0171359,
  "lng": 28.6387955
 },
 "mapUrl": "https://maps.app.goo.gl/QH4G7gAKGjiiNBzy8",
 "open": true,
 "featured": true,
 "hasOffer": true,
 "offer": "عروض اليوم على العصائر الطبيعية",
 "description": "مطعم تهامة اليمن — مطبخ يمني أصيل: مندي ومدفون اللحم والدجاج، قلايات ومشاوي، أطباق جانبية ومقبلات وسلطات، أسماك ومخبازة طازجة، وعصائر طبيعية. تشكيلة ذبائح وولائم للمناسبات.",
 "address": "إسنيورت، إسطنبول، تركيا",
 "phone": "+90 531 866 02 20",
 "whatsapp": "+90 531 866 02 20",
 "email": "",
 "website": "https://menux.app/tihama/",
 "sourceUrl": "https://menux.app/tihama/",
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

const tihamaProductCatalog = [];

const tihamaProducts = tihamaProductCatalog.map((product, index) => ({
  ...product,
  id: 16001 + index,
  storeId: tihamaStore.id
}));

const tihamaDeliverySettings = {
  [tihamaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};
