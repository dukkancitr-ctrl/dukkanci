// Generated for حلويات عز الدين (Izz Al-Din Tatlici) — Esenyurt, Istanbul.
const ezzedineStore = {
  "id": 13,
  "name": "حلويات عز الدين",
  "category": "حلويات",
  "image": "/assets/photos/ezzedine/cover.jpg",
  "coverImage": "/assets/photos/ezzedine/cover.jpg",
  "logoImage": "/assets/photos/ezzedine/logo.png",
  "logo": "ع",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 30,
  "minOrder": 250,
  "time": "40 - 60 دقيقة",
  "distance": 22.5,
  "location": {
    "lat": 41.0293,
    "lng": 28.676
  },
  "mapUrl": "https://maps.app.goo.gl/aYg1Qc3ZVrCxqboy7",
  "open": true,
  "featured": true,
  "hasOffer": false,
  "description": "حلويات عز الدين متخصّصة بالحلويات العربية الفاخرة: البقلاوة والوربات بالفستق والقشطة، المعمول والغريبة والبرازق، إضافة إلى الكاتو والتشكيلات العربية، بنكهة عربية أصيلة وجودة عالية.",
  "address": "إنجيرتبه، شارع باغلار تشيشمه رقم 1، إسنيورت، إسطنبول",
  "phone": "+90 555 097 77 93",
  "whatsapp": "+90 555 097 77 93",
  "email": "",
  "website": "",
  "sourceUrl": "https://maps.app.goo.gl/aYg1Qc3ZVrCxqboy7",
  "hours": "يرجى تأكيد أوقات العمل عبر واتساب",
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

const ezzedineProductCatalog = [];

const ezzedineProducts = ezzedineProductCatalog.map((product, index) => ({
  ...product,
  id: 13001 + index,
  storeId: ezzedineStore.id
}));

const ezzedineDeliverySettings = {
  [ezzedineStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 130 }
};
