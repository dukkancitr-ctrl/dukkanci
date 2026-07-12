// Generated for مطعم أسماك فلوكا (Feluka Seafood Restaurant) — Çağlayan, Şişli/İstanbul.
// Seafood restaurant. Source: feluka.minidine.com/ar/categories/?branch=feluka-seafood-restaurant
// (minidine/miniandmore backend — token exchange at auth0.miniandmore.co/clients/token with
// customer_name=feluka_seafood_restaurant, then GET {url}/categories, /menu/items, /contact_info
// with Bearer token + X-Data-Lang: ar; images at {storage_url}/feluka_seafood_restaurant/items/<file>).
// 79 products across 19 categories, native Arabic names, prices in TL, every item has its own
// unique source photo (no shared-image collisions). Store logo is the brand's own published logo
// (ship-wheel + fish mark). Coordinates from contact_info's embedded Google Maps iframe, matching
// the user-supplied Plus Code (3X9P+523 Şişli, İstanbul).
// NOTE: felukaProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via the Supabase MCP execute_sql (anon-key writes to
// stores/products are RLS-blocked — see memory [[adding-a-restaurant]]).
const felukaStore = {
 "id": 87,
 "name": "مطعم أسماك فلوكا",
 "category": "مطاعم",
 "image": "/assets/photos/feluka/cover.jpg",
 "coverImage": "/assets/photos/feluka/cover.jpg",
 "logoImage": "/assets/photos/feluka/logo.png",
 "logo": "ف",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.067719911170165,
  "lng": 28.985088271163935
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.067719911170165,28.985088271163935",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم أسماك فلوكا — مطعم مأكولات بحرية في حي چاغلايان بمنطقة شيشلي، إسطنبول. شوربات وسلطات ومقبلات، جمبري وكاليماري وجندوفلي، استاكوزا وكابوريا، أسماك طازجة (قاروص، دنيس، بوري، سالمون، فيليه، باربون، بساريا، سمك موسى) مشوية أو مقلية أو بالفرن، طواجن بحرية، مكرونة وأرز سي فود، وصواني وأكياس فلوكا المميزة للولائم والمناسبات.",
 "address": "İzzet Paşa, Çağlayan Kavşağı Altgeçidi No:158, 34387 Şişli/İstanbul, تركيا",
 "phone": "+90 537 047 71 10",
 "whatsapp": "+90 537 047 71 10",
 "email": "",
 "website": "",
 "sourceUrl": "https://feluka.minidine.com/ar/categories/?branch=feluka-seafood-restaurant",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
 "areas": [
  "شيشلي",
  "چاغلايان",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const felukaFullCatalog = [
  // الشوربة
  { name: "شوربة سي فود كريمة - إكسترا Duble", price: 300, category: "الشوربة", unit: "قطعة", image: "/assets/photos/feluka/items/8791766868808.jpg" },
  { name: "شوربة جمبري حمراء - إكسترا", price: 350, category: "الشوربة", unit: "قطعة", image: "/assets/photos/feluka/items/8451766857057.jpg" },
  { name: "شوربة جمبري كريمة - إكسترا", price: 300, category: "الشوربة", unit: "قطعة", image: "/assets/photos/feluka/items/3521767819902.jpg" },
  // السلطات
  { name: "تبولة", price: 175, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/701767818869.jpg" },
  { name: "سلطة شرقية", price: 175, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/4521767728607.jpg" },
  { name: "سلطة جرجير", price: 175, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/1231767818932.jpg" },
  { name: "فتوش", price: 175, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/5791767786616.jpg" },
  { name: "سلطة خضراء", price: 165, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/3181767728626.jpg" },
  { name: "سلطة جوز", price: 250, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/6411767876171.jpg" },
  { name: "سلطة تونة", price: 260, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/4881767786566.jpg" },
  { name: "سلطة سي فود", price: 260, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/3711767728591.jpg" },
  { name: "سلطة بلدي", price: 175, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/651767728640.jpg" },
  { name: "سلطة طحينة", price: 215, category: "السلطات", unit: "قطعة", image: "/assets/photos/feluka/items/5111767728654.jpg" },
  // المقبلات
  { name: "رنجة بالمستردة", price: 450, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/5901767786839.jpg" },
  { name: "فسيخ", price: 425, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/931767818679.jpg" },
  { name: "حمص / طحينة", price: 125, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/281767728732.jpg" },
  { name: "رنجة طحينة", price: 495, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/3931767728670.jpg" },
  { name: "خضار مقلي", price: 225, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/2201767786748.jpg" },
  { name: "بطاطس مقلية", price: 160, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/5961767786801.jpg" },
  { name: "رنجة سادة", price: 425, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/8731767728683.jpg" },
  { name: "بابا غنوج", price: 125, category: "المقبلات", unit: "قطعة", image: "/assets/photos/feluka/items/4901767728719.jpg" },
  // الجمبري
  { name: "جمبري مشوي كبير", price: 850, category: "الجمبري", unit: "قطعة", image: "/assets/photos/feluka/items/7421766855728.jpg" },
  { name: "جمبري ديناميت (فلوكا أتوم)", price: 470, category: "الجمبري", unit: "قطعة", image: "/assets/photos/feluka/items/8621767438765.jpg" },
  { name: "جمبري مقلي كبير", price: 870, category: "الجمبري", unit: "قطعة", image: "/assets/photos/feluka/items/461767876132.jpg" },
  { name: "جمبري بالزبدة كبير", price: 870, category: "الجمبري", unit: "قطعة", image: "/assets/photos/feluka/items/4781767819010.jpg" },
  { name: "جمبري بترفلاي", price: 880, category: "الجمبري", unit: "قطعة", image: "/assets/photos/feluka/items/8911767438739.jpg" },
  // كاليماري - جندوفلي
  { name: "كاليماري فاهيتا", price: 470, category: "كاليماري - جندوفلي", unit: "قطعة", image: "/assets/photos/feluka/items/4891766869223.jpg" },
  { name: "جندوفلي ليمون وثوم", price: 390, category: "كاليماري - جندوفلي", unit: "قطعة", image: "/assets/photos/feluka/items/6301766869288.jpg" },
  { name: "كاليماري مقلي", price: 470, category: "كاليماري - جندوفلي", unit: "قطعة", image: "/assets/photos/feluka/items/1091766856410.jpg" },
  { name: "جندوفلي اسكندراني", price: 390, category: "كاليماري - جندوفلي", unit: "قطعة", image: "/assets/photos/feluka/items/861766869340.jpg" },
  // استاكوزا - كابوريا
  { name: "كابوريا مشوي", price: 470, category: "استاكوزا - كابوريا", unit: "قطعة", image: "/assets/photos/feluka/items/161767819423.jpg" },
  { name: "إستاكوزا كينج", price: 3800, category: "استاكوزا - كابوريا", unit: "قطعة", image: "/assets/photos/feluka/items/4431767786882.jpg" },
  { name: "إستاكوزا جبنة وبشاميل", price: 3350, category: "استاكوزا - كابوريا", unit: "قطعة", image: "/assets/photos/feluka/items/8311767621235.jpg" },
  // قاروص
  { name: "قاروص كاورما", price: 570, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/911767728790.jpg" },
  { name: "قاروص مقلي صغير", price: 450, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/4291767733996.jpg" },
  { name: "قاروص جبنة وبطاطس", price: 750, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/4621766869569.jpg" },
  { name: "قاروص زيت وليمون صغير", price: 450, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/6421767734132.jpg" },
  { name: "قاروص مشوي صغير", price: 450, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/301766869431.jpg" },
  { name: "قاروص سنجاري صغير", price: 450, category: "قاروص", unit: "قطعة", image: "/assets/photos/feluka/items/8071767735318.jpg" },
  // دنيس
  { name: "دنيس مقلي/زيت وليمون/ردة صغير", price: 450, category: "دنيس", unit: "قطعة", image: "/assets/photos/feluka/items/6691767728814.jpg" },
  { name: "دنيس زيت وليمون صغير", price: 450, category: "دنيس", unit: "قطعة", image: "/assets/photos/feluka/items/3261767735384.jpg" },
  { name: "دنيس ردة صغير", price: 450, category: "دنيس", unit: "قطعة", image: "/assets/photos/feluka/items/3731767734451.jpg" },
  { name: "دنيس جبنة وبطاطس", price: 750, category: "دنيس", unit: "قطعة", image: "/assets/photos/feluka/items/4181767728832.jpg" },
  // بوري
  { name: "مشوي ردة", price: 420, category: "بوري", unit: "قطعة", image: "/assets/photos/feluka/items/2891766869910.jpg" },
  { name: "بوري سنجاري", price: 420, category: "بوري", unit: "قطعة", image: "/assets/photos/feluka/items/7841767818725.jpg" },
  { name: "بوري جبنة وبطاطس", price: 670, category: "بوري", unit: "قطعة", image: "/assets/photos/feluka/items/8171766869936.jpg" },
  { name: "بوري زيت وليمون", price: 420, category: "بوري", unit: "قطعة", image: "/assets/photos/feluka/items/6321767818712.jpg" },
  // سالمون
  { name: "سالمون طاجن", price: 740, category: "سالمون", unit: "قطعة", image: "/assets/photos/feluka/items/471767819491.jpg" },
  { name: "سالمون مشوي", price: 660, category: "سالمون", unit: "قطعة", image: "/assets/photos/feluka/items/9311766870022.jpg" },
  // فيليه
  { name: "فيليه مشوي", price: 470, category: "فيليه", unit: "قطعة", image: "/assets/photos/feluka/items/6131767820018.jpg" },
  { name: "فيليه مقلي", price: 470, category: "فيليه", unit: "قطعة", image: "/assets/photos/feluka/items/8691767787206.jpg" },
  { name: "فيليه شيش", price: 560, category: "فيليه", unit: "قطعة", image: "/assets/photos/feluka/items/1001767735456.jpg" },
  // باربون
  { name: "باربون مشوي", price: 590, category: "باربون", unit: "قطعة", image: "/assets/photos/feluka/items/6081767818502.jpg" },
  { name: "باربون مقلي", price: 590, category: "باربون", unit: "قطعة", image: "/assets/photos/feluka/items/5311767787373.jpg" },
  // بساريا
  { name: "بساريا مشوي", price: 420, category: "بساريا", unit: "قطعة", image: "/assets/photos/feluka/items/5981766857615.jpg" },
  { name: "بساريا مقلي", price: 420, category: "بساريا", unit: "قطعة", image: "/assets/photos/feluka/items/1861767787484.jpg" },
  // سمك موسى
  { name: "سمك موسى مشوي", price: 550, category: "سمك موسى", unit: "قطعة", image: "/assets/photos/feluka/items/3001767819540.jpg" },
  { name: "سمك موسى مقلي", price: 550, category: "سمك موسى", unit: "قطعة", image: "/assets/photos/feluka/items/8761767787607.jpg" },
  // الطواجن
  { name: "ورق عنب بالجمبري", price: 515, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/5491766855777.jpg" },
  { name: "ملوخية سادة", price: 195, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/8621767820211.jpg" },
  { name: "جمبري طماطم", price: 470, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/1301767785920.jpg" },
  { name: "ورق عنب سادة", price: 280, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/671767819871.jpg" },
  { name: "طاجن مشكل طماطم", price: 470, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/3811767819808.jpg" },
  { name: "طاجن كاليماري طماطم", price: 450, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/2901767733634.jpg" },
  { name: "ملوخية بالجمبري", price: 280, category: "الطواجن", unit: "قطعة", image: "/assets/photos/feluka/items/6441766855167.jpg" },
  // المكرونة والأرز
  { name: "مكرونة سي فود كريمة وموزاريلا", price: 515, category: "المكرونة والأرز", unit: "قطعة", image: "/assets/photos/feluka/items/2251767819683.jpg" },
  { name: "أرز أبيض", price: 110, category: "المكرونة والأرز", unit: "قطعة", image: "/assets/photos/feluka/items/6631766857424.jpg" },
  { name: "مكرونة كريمة وموزاريلا", price: 280, category: "المكرونة والأرز", unit: "قطعة", image: "/assets/photos/feluka/items/3121767728955.jpg" },
  { name: "أرز سي فود", price: 280, category: "المكرونة والأرز", unit: "قطعة", image: "/assets/photos/feluka/items/7041766855362.jpg" },
  { name: "أرز صيادية", price: 110, category: "المكرونة والأرز", unit: "قطعة", image: "/assets/photos/feluka/items/7601766857408.jpg" },
  // صواني الدلع
  { name: "سي فود (مشوي) فردين", price: 2350, category: "صواني الدلع", unit: "قطعة", image: "/assets/photos/feluka/items/7551767777737.jpg" },
  { name: "ورق عنب (مقلي) فردين", price: 2550, category: "صواني الدلع", unit: "قطعة", image: "/assets/photos/feluka/items/6111767777694.jpg" },
  { name: "سي فود (مقلي) فردين", price: 2400, category: "صواني الدلع", unit: "قطعة", image: "/assets/photos/feluka/items/6441767777644.jpg" },
  { name: "ورق عنب (مشوي) فردين", price: 2600, category: "صواني الدلع", unit: "قطعة", image: "/assets/photos/feluka/items/8821767777761.jpg" },
  // أكياس فلوكا
  { name: "كيس فلوكا مكس طماطم أو كريمة (+ قطعة كابوريا) فرد", price: 890, category: "أكياس فلوكا", unit: "قطعة", image: "/assets/photos/feluka/items/5451767786426.jpg" },
  { name: "كيس فلوكا السوبر", price: 2350, category: "أكياس فلوكا", unit: "قطعة", image: "/assets/photos/feluka/items/3881766856978.jpg" },
  { name: "كيس فلوكا جمبري طماطم أو كريمة فرد", price: 790, category: "أكياس فلوكا", unit: "قطعة", image: "/assets/photos/feluka/items/7471766856910.jpg" },
  // صواني سي فود
  { name: "نصف صينية سي فود", price: 700, category: "صواني سي فود", unit: "قطعة", image: "/assets/photos/feluka/items/2881767787670.jpg" },
  { name: "صينية سي فود كاملة", price: 1200, category: "صواني سي فود", unit: "قطعة", image: "/assets/photos/feluka/items/5701766857168.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const felukaProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const felukaProducts = (felukaProductCatalog.length ? felukaProductCatalog : felukaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1690001 + index,
  storeId: felukaStore.id
}));

const felukaDeliverySettings = {
  [felukaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { felukaStore, felukaProducts, felukaDeliverySettings };
}
