// Generated for مياه غلاطة الطبيعية - مياه ينابيع (Galata Natural Spring Water) — Esenyurt, Istanbul.
// First store under the new "المياه المعدنية" (Mineral Water) category: bottled/jug water delivery.
// Source: brand assets + product photos supplied directly by the merchant via WhatsApp
// (+90 553 999 99 63); location resolved from the merchant's Google Plus Code
// "2M6P+H8H Esenyurt, İstanbul" via Geocoding API (no Google Business listing found —
// this is a small home-delivery water distributor, not a walk-in shop).
// Delivery: flat price already includes delivery for 8 named residential complexes near
// the store (namedZones, fee 0 each); any other address falls back to distance pricing at
// 20 TRY/km round-trip (per the merchant's explicit instruction).
const galatawaterStore = {
  "id": 115,
  "name": "روا لتوزيع المياه",
  "category": "المياه المعدنية",
  "image": "/assets/photos/galatawater/cover.jpg",
  "coverImage": "/assets/photos/galatawater/cover.jpg",
  "logoImage": "/assets/photos/galatawater/logo.png",
  "logo": "ر",
  "rating": 0,
  "reviews": 0,
  "newStore": true,
  "delivery": 0,
  "minOrder": 0,
  "time": "60 - 120 دقيقة",
  "distance": 0,
  "location": { "lat": 41.0114375, "lng": 28.6858594 },
  "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0114375,28.6858594",
  "open": true,
  "featured": false,
  "hasOffer": false,
  "offer": "",
  "description": "روا لتوزيع المياه — مياه نقية من ينابيع الطبيعة، جالونات مياه كبيرة وكراتين أكواب مياه معدنية، توصيل لباب البيت في إسنيورت والمناطق المجاورة، السعر شامل التوصيل ضمن مجمعاتنا المعتمدة.",
  "address": "2M6P+H8H Esenyurt/İstanbul, Türkiye",
  "phone": "+90 553 999 99 63",
  "whatsapp": "+90 553 999 99 63",
  "email": "",
  "website": "",
  "sourceUrl": "",
  "hours": "يومياً 9:00 ص – 10:00 م",
  "areas": ["إسنيورت", "مناطق إسطنبول حسب المسافة"],
  "fulfillment": "توصيل",
  "subscription": "احترافي",
  "orderCount": 0,
  "officialStore": true,
  "approvalStatus": "pending"
};

const galatawaterFullCatalog = [
  { name: "مياه مايا داغ دمجانة 19 لتر", description: "دمجانة مياه مايا داغ الطبيعية، سعة 19 لتر، توصيل لباب المنزل ضمن مجمعاتنا المعتمدة بسعر 150 ل.ت فقط.", price: 150, category: "دمجانات المياه", unit: "دمجانة", image: "/assets/photos/galatawater/p1.jpg" },
  { name: "مياه ابانت كاسات 180 مل عدد 60", description: "كرتون مياه ابانت المعدنية، يحتوي 60 كأس سعة 180 مل للكأس، توصيل لباب المنزل ضمن مجمعاتنا المعتمدة بسعر 190 ل.ت فقط.", price: 190, category: "أكواب المياه", unit: "كرتون", image: "/assets/photos/galatawater/p2.jpg" },
  { name: "مضخة يدوية لسحب مياه الدمجانة", description: "مضخة يدوية بسيطة التركيب لسحب المياه من دمجانة 19 لتر، توصيل لباب المنزل ضمن مجمعاتنا المعتمدة بسعر 150 ل.ت فقط.", price: 150, category: "إكسسوارات المياه", unit: "قطعة", image: "/assets/photos/galatawater/p3.jpg" },
  { name: "دمجانة مياه ليلا الطبيعية 19 لتر", description: "دمجانة مياه ينابيع طبيعية ليلا، سعة 19 لتر، توصيل لباب المنزل أو المكتب ضمن مجمعاتنا المعتمدة بسعر 160 ل.ت فقط.", price: 160, category: "دمجانات المياه", unit: "دمجانة", image: "/assets/photos/galatawater/p4.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const galatawaterProductCatalog = [];

const galatawaterProducts = (galatawaterProductCatalog.length ? galatawaterProductCatalog : galatawaterFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1950001 + index,
  storeId: galatawaterStore.id
}));

// Named residential complexes where the 170/180 price already includes delivery
// (fee 0). Any address that doesn't match one of these falls back to "distance"
// mode below (20 TRY/km round-trip), per the merchant's explicit instruction.
const galatawaterDeliverySettings = {
  [galatawaterStore.id]: {
    mode: "distance",
    fixedFee: 0,
    ratePerKm: 20,
    prepMinutes: 60,
    maxRoundTripKm: 200,
    // This store's prices are already delivery-inclusive for the named zones below
    // (fee 0 each). Every other store on the platform floors its computed distance
    // fee at 150 TRY (see normalizeDeliveryFee() in app.js) — the merchant explicitly
    // asked for that floor removed here, so nearby addresses outside the named zones
    // pay the real 20 TRY/km instead of a minimum 150.
    noFeeFloor: true,
    namedZones: [
      { match: ["Hayat Park 4", "Hayat Park"], fee: 0, label: "Hayat Park 4" },
      { match: ["Sembol İstanbul Residence", "Sembol Istanbul Residence", "Sembol"], fee: 0, label: "Sembol İstanbul Residence" },
      { match: ["Self İstanbul", "Self Istanbul"], fee: 0, label: "Self İstanbul" },
      { match: ["İstanbul Prestij Park", "Istanbul Prestij Park", "Prestij Park"], fee: 0, label: "İstanbul Prestij Park" },
      { match: ["HEP İstanbul", "HEP Istanbul"], fee: 0, label: "HEP İstanbul" },
      { match: ["Babacan Premium"], fee: 0, label: "Babacan Premium" },
      { match: ["Almina Tower"], fee: 0, label: "Almina Tower" },
      { match: ["Radius Residence"], fee: 0, label: "Radius Residence" }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { galatawaterStore, galatawaterProducts, galatawaterDeliverySettings };
}
