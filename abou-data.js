// Generated for مطعم أبو الزلف (Abou El Zelouf) — Istanbul. Source: abou-elzelouf.com (images downloaded locally)
const abouStore = {
 "id": 24,
 "name": "مطعم أبو الزلف",
 "category": "مطاعم",
 "image": "/assets/photos/abou/cover.jpg",
 "coverImage": "/assets/photos/abou/cover.jpg",
 "logoImage": "/assets/photos/abou/cover.jpg",
 "logo": "أ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 18,
 "location": {
  "lat": 41.0258,
  "lng": 28.6772
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Abou+El+Zelouf+Restaurant+Istanbul",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "description": "مطعم أبو الزلف — مطبخ شرقي وغربي في إسطنبول: الفطور والشوربات والمقبلات الباردة والساخنة، المشاوي والمأكولات على الفحم، الشاورما والسندويشات، الأطباق الشرقية والغربية، الحلويات والعصائر والمشروبات. الأسماء والأسعار كما في القائمة الرسمية للمطعم.",
 "address": "إسطنبول، تركيا",
 "phone": "+90 552 252 35 23",
 "whatsapp": "+90 552 252 35 23",
 "email": "",
 "website": "https://www.abou-elzelouf.com/",
 "sourceUrl": "https://www.abou-elzelouf.com/en",
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

const abouProductCatalog = [];

const abouProducts = abouProductCatalog
  .map((product, index) => ({
    ...product,
    id: 35001 + index,
    storeId: abouStore.id
  }))
  // الأراكيل category removed by request; filter after id-map so remaining ids stay aligned with the cloud
  .filter(product => product.category !== "الأراكيل");

const abouDeliverySettings = {
  [abouStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};
