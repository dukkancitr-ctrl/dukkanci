// Generated for حلويات سلورة (Salloura) — Esenyurt, Istanbul. Prices on request.
const sallouraStore = {
  "id": 14,
  "name": "حلويات سلورة",
  "category": "حلويات",
  "image": "/assets/photos/salloura/cover.jpg",
  "coverImage": "/assets/photos/salloura/cover.jpg",
  "logoImage": "/assets/photos/salloura/logo.png",
  "logo": "س",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 30,
  "minOrder": 0,
  "time": "40 - 60 دقيقة",
  "distance": 21.5,
  "location": {
    "lat": 41.0341,
    "lng": 28.673
  },
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=Salloura+1105.+Sk.+9B+Esenyurt+Istanbul",
  "open": true,
  "featured": true,
  "hasOffer": false,
  "priceOnRequest": true,
  "description": "حلويات سلورة (Salloura) — عراقة الحلويات الحلبية منذ 1875: بقلاوة وكول وشكور ومبرومة وأصابع بالفستق والكاجو، معمول وكرابيج وكعك، وتشكيلات وعلب فاخرة. الأسعار عند الطلب عبر واتساب.",
  "address": "1105. Sk. 9B، 34517 إسنيورت، إسطنبول، تركيا",
  "phone": "+90 545 654 53 77",
  "whatsapp": "+90 545 654 53 77",
  "email": "ismfaurjw@gmail.com",
  "website": "",
  "sourceUrl": "",
  "hours": "يرجى تأكيد أوقات العمل والأسعار عبر واتساب",
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

const sallouraProductCatalog = [];

const sallouraProducts = sallouraProductCatalog.map((product, index) => ({
  ...product,
  id: 14001 + index,
  storeId: sallouraStore.id
}));

const sallouraDeliverySettings = {
  [sallouraStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 130 }
};
