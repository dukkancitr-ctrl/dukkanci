// Generated for مطعم نور الشام (Nour Alsham) — Esenyurt, Istanbul. Source: nouralsham.com
const nourStore = {
 "id": 15,
 "name": "مطعم نور الشام",
 "category": "مطاعم",
 "image": "/assets/photos/nour/cover.jpg",
 "coverImage": "/assets/photos/nour/cover.jpg",
 "logoImage": "/assets/photos/nour/logo.png",
 "logo": "ن",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 20.0,
 "location": {
  "lat": 41.0345,
  "lng": 28.672
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Nour+Alsham+Restaurant+Talatpasa+Esenyurt+Istanbul",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم نور الشام — مطبخ شامي وشرقي أصيل: شاورما ومشاوي دجاج ولحم، مندي وكبة وشاميات، معجنات وبيتزا وباستا وسمك، مقبلات وسلطات وعصائر. طازج ويصل إلى بابك.",
 "address": "طلعت باشا، إسنيورت، إسطنبول، تركيا",
 "phone": "+90 534 311 02 12",
 "whatsapp": "+90 534 311 02 12",
 "email": "nuralsamlokanta@gmail.com",
 "website": "https://nouralsham.com",
 "sourceUrl": "https://xr.nouralsham.com/ar/",
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

const nourProductCatalog = [];

const nourProducts = nourProductCatalog.map((product, index) => ({
  ...product,
  id: 15001 + index,
  storeId: nourStore.id
}));

const nourDeliverySettings = {
  [nourStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};
