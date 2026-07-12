// Generated from the official Alfursan (مطعم الفرسان) Yemeksepeti menu — Şişli/Elmadağ, İstanbul.
// Source: Delivery Hero food-bff (vendor s9tp). 143 items with the restaurant's own photos;
// prices in Turkish Lira. Item/category names are as published on Yemeksepeti (Turkish).
const alfursanStore = {
 "id": 48,
 "name": "مطعم الفرسان",
 "category": "مطاعم",
 "image": "/assets/photos/alfursan/cover.jpg",
 "coverImage": "/assets/photos/alfursan/cover.jpg",
 "logoImage": "/assets/photos/alfursan/logo2.jpg",
 "logo": "ا",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "35 - 60 دقيقة",
 "distance": 5,
 "location": {
  "lat": 41.0420418,
  "lng": 28.9862006
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0420418,28.9862006",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم الفرسان: مطعم سوري وعربي في شيشلي (إلمَداغ) يقدّم المندي والكبسة والمدفون والمشاوي والكباب والدجاج والفطور العربي والسندويشات والبيتزا والأطباق الشرقية والسلطات والشوربات والحلويات. الأصناف والأسعار كما في القائمة الرسمية.",
 "address": "İnönü Mah. Elmadağ Cad. No:2, 34373 Şişli, İstanbul",
 "phone": "+905364478744",
 "whatsapp": "+905364478744",
 "email": "",
 "website": "https://www.yemeksepeti.com/restaurant/s9tp/alfursan-resturant",
 "sourceUrl": "https://www.yemeksepeti.com/restaurant/s9tp/alfursan-resturant",
 "hours": "الإثنين - السبت 11:30 ص - 11:30 م (الأحد مغلق)",
 "areas": [
  "شيشلي",
  "إلمَداغ",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

const alfursanProductCatalog = [];

const alfursanProducts = alfursanProductCatalog.map((product, index) => ({
  ...product,
  id: 1320001 + index,
  storeId: alfursanStore.id
}));

const alfursanDeliverySettings = {
  [alfursanStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};
