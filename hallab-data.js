// Generated from the official Hallab 1881 (Al Hallab) FineDine menu — Nişantaşı/Şişli, İstanbul.
// Source API: api.finedinemenu.com (al-hallab-fisekhane). 237 items with the restaurant's
// own photos and Arabic names; prices in Turkish Lira. Alcohol sections were excluded (97 items).
const hallabStore = {
 "id": 49,
 "name": "حلاب 1881",
 "category": "مطاعم",
 "image": "/assets/photos/hallab/cover2.jpg",
 "coverImage": "/assets/photos/hallab/cover2.jpg",
 "logoImage": "/assets/photos/hallab/logo.svg",
 "logo": "ح",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 40,
 "minOrder": 200,
 "time": "40 - 70 دقيقة",
 "distance": 6,
 "location": {
  "lat": 41.049979,
  "lng": 28.991473
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.049979,28.991473",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "حلاب 1881 (Al Hallab): مطعم لبناني عريق في نيشانتاشي (شيشلي) يقدّم الفطور اللبناني والمقبلات الباردة والساخنة والمشاوي والفتّة واللحم والمعجنات والسلطات والحلويات اللبنانية الشهيرة والعصائر الطازجة. الأصناف والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "Harbiye Mah., Abdi İpekçi Cad. No:16, 34250 Şişli, İstanbul",
 "phone": "+902122241882",
 "whatsapp": "+905336881819",
 "email": "",
 "website": "https://hallabtr.com/",
 "sourceUrl": "https://qr.finedinemenu.com/al-hallab-fisekhane",
 "hours": "يومياً من الساعة 12:00 ظهراً",
 "areas": [
  "شيشلي",
  "نيشانتاشي",
  "هاربيه",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const hallabProductCatalog = [];

const hallabProducts = hallabProductCatalog.map((product, index) => ({
  ...product,
  id: 1330001 + index,
  storeId: hallabStore.id
}));

const hallabDeliverySettings = {
  [hallabStore.id]: { mode: "distance", fixedFee: 40, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};
