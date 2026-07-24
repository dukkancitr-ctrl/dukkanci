// Generated for بلودان ماركت (Bludan Market) — Hırka-i Şerif, Fatih/İstanbul.
// Large Arabic/Turkish supermarket. Source: trybany.com catalog (app.trybany.com/ar/bludan-market-1lk),
// 2556 products across 40 fine-grained categories, full-res images. Coords/rating/hours from Google Maps
// (Place ID ChIJk5jkql-7yhQRoqra3gH0kqc, 4.0/119 reviews). NOT the unrelated "بلودان" shawarma restaurant
// chain (ids 61/62) — same popular Syrian town name, entirely different business.
const bludanmarketStore = {
 "id": 114,
 "name": "بلودان ماركت",
 "category": "سوبر ماركت",
 "image": "/assets/photos/bludanmarket/cover.jpg",
 "coverImage": "/assets/photos/bludanmarket/cover.jpg",
 "logoImage": "/assets/photos/bludanmarket/logo.png",
 "logo": "ب",
 "rating": 4,
 "reviews": 119,
 "newStore": true,
 "delivery": 20,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0208871,
  "lng": 28.9423576
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0208871,28.9423576",
 "open": true,
 "featured": false,
 "hasOffer": false,
 "offer": "",
 "description": "بلودان ماركت — سوبر ماركت عربي شامل في الفاتح يقدّم آلاف المنتجات: مواد غذائية وبقوليات ومعلبات وصوصات، أجبان وألبان، مخبوزات ومعجنات، مفرزات، شاي وقهوة ومتة، تمور، عسل، موالح ومكسرات، شيبس وحلويات وشوكولا، مشروبات وعصائر، منظفات ومستلزمات منزلية وعناية شخصية. توصيل لمناطق إسطنبول.",
 "address": "Hırka-i Şerif, Akşemsettin Cd. No:16, 34080 Fatih/İstanbul",
 "phone": "+90 552 284 18 15",
 "whatsapp": "+90 552 284 18 15",
 "email": "",
 "website": "",
 "sourceUrl": "https://app.trybany.com/ar/bludan-market-1lk/",
 "hours": "يومياً من الساعة 9:00 صباحاً حتى 1:00 صباحاً",
 "areas": [
  "الفاتح",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true,
 "googlePlaceId": "ChIJk5jkql-7yhQRoqra3gH0kqc",
 "googleRating": 4,
 "googleReviewsCount": 119,
 "googleMapsUrl": "https://www.google.com/maps/place/?q=place_id:ChIJk5jkql-7yhQRoqra3gH0kqc"
};

// Repo-bundled catalog stays empty (2,556 products) — same pattern as صفا الشام (1317 products):
// too large for a fast-loading first paint. All products load live from Supabase.
const bludanmarketProductCatalog = [];

const bludanmarketProducts = bludanmarketProductCatalog.map((product) => ({
  ...product,
  storeId: bludanmarketStore.id
}));

const bludanmarketDeliverySettings = {
  [bludanmarketStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { bludanmarketStore, bludanmarketProducts, bludanmarketDeliverySettings };
}
