// Generated for مطعم كريبما (Krepma — Döner & Krep) — PARK MAVERA 1. ETAP, Kayabaşı,
// Başakşehir, Istanbul. Hand-made crepes and oven-fresh savoury & sweet fatayer.
// Source: the restaurant's own digital menu (krepma.vercel.app, Arabic locale — merchant-written
// Arabic names AND descriptions, real prices, studio product photos on Cloudinary),
// 2026-09-08 (merchant request): every shawarma item was removed — the whole "شاورما"
// category (8), plus كريب شاورما and فطيرة شاورما, whose filling is shawarma. 37 items
// across 2 categories remain, and a real 15% cut is live on ALL of them (oldPrice = the
// merchant's original price, price = floor(price*0.85)). Product ids are now written out
// explicitly instead of being derived from the array index: with a row deleted mid-array
// the old '1960001 + index' formula silently renumbered every later product and no longer
// matched its Supabase row.
// Google Maps match confirmed: "krepma" (place ChIJeUg5mtOvyhQRqpQ-w_AkWGU), 4.5★/40 reviews,
// exact address match; the WhatsApp number printed on the restaurant's own packaging in its
// brand poster (+90 536 933 36 66) matches the number supplied by the merchant.
// Hours: 13:00–02:00 daily, given directly by the Dukkanci operator — this supersedes the
// per-day table on the restaurant's own contact page (Mon–Thu 09:00-22:00 etc.), which does not
// match how the shop actually trades. Google has no hours on file for this listing at all.
// EXCLUDED on purpose (no real product photo — the merchant used its brand poster as the image):
//   - كريب كوردن بلو (375 TRY)
//   - كريب مكس جبن (300 TRY)
// Logo cropped from that same real brand poster; cover assembled from the merchant's own poster
// artwork + two of its real product photos — no AI-generated art.
const krepmaStore = {
 "id": 116,
 "name": "مطعم كريبما",
 "category": "مطاعم",
 "image": "/assets/photos/krepma/cover.jpg",
 "coverImage": "/assets/photos/krepma/cover.jpg",
 "logoImage": "/assets/photos/krepma/logo.png",
 "logo": "ك",
 "rating": 4.5,
 "reviews": 40,
 "newStore": true,
 "delivery": 20,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1175653,
  "lng": 28.7709268
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.1175653,28.7709268",
 "open": true,
 "featured": false,
 "hasOffer": true,
 "offer": "خصم ١٥٪ على كل المنتجات",
 "description": "كريبما — مطعم كريب وفطاير في باشاك شهير: كريبات محضّرة يدوياً عند الطلب، وفطاير طازجة من الفرن مالحة وحلوة.",
 "address": "PARK MAVERA 1. ETAP, Kayabaşı, Gazi Yaşargil Cd T08 BLOK NO: 15 AA, 34490 Başakşehir/İstanbul",
 "phone": "+90 536 933 36 66",
 "whatsapp": "+90 536 933 36 66",
 "email": "",
 "website": "https://krepma.vercel.app/ar",
 "sourceUrl": "https://krepma.vercel.app/tr/menu/crepes",
 "hours": "يومياً 1:00 م – 2:00 ص",
 "areas": [
  "باشاك شهير",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true,
 "approvalStatus": "approved",
 "googleRating": 4.5,
 "googleReviewsCount": 40,
 "googlePlaceId": "ChIJeUg5mtOvyhQRqpQ-w_AkWGU",
 "googleMapsUrl": "https://maps.google.com/?cid=7302627412267668650"
};

const krepmaFullCatalog = [
  // كريب
  { id: 1960001, name: "كريب بطاطس", description: "كاتشب, مايونيز, جبنة.", price: 212, oldPrice: 250, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p1.jpg" },
  { id: 1960002, name: "كريب كريبما", description: "صدور مشوية, فلفل, زيتون, كاتشب, مايونيز, مشروم, جبنة موزاريلا.", price: 272, oldPrice: 320, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p2.jpg" },
  { id: 1960003, name: "كريب جمبري", description: "طحينة, جبنة موزاريلا, فلفل, زيتون.", price: 318, oldPrice: 375, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p3.jpg" },
  { id: 1960004, name: "كريب كبدة", description: "طحينة, جبنة موزاريلا, زيتون, بصل, فلفل.", price: 297, oldPrice: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p4.jpg" },
  { id: 1960005, name: "كريب برجر لحم", description: "برجر لحم, جبنة موزاريلا, زيتون, بصل, فلفل, باربيكيو صوص, كاتشب, مايونيز.", price: 297, oldPrice: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p5.jpg" },
  { id: 1960006, name: "كريب مكس فرانش", description: "زينجر, سنيتشل, زنجر صوص, جبنة موزاريلا, فلفل, زيتون, بطاطس.", price: 314, oldPrice: 370, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p6.jpg" },
  { id: 1960007, name: "كريب برجر دجاج", description: "كاتشب, مايونيز, جبنة موزاريلا, فلفل, زيتون.", price: 238, oldPrice: 280, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p7.jpg" },
  { id: 1960008, name: "كريب شنيتسل", description: "شيدر صوص, جبنة موزاريلا, فلفل, زيتون, كاتشب, مايونيز, بطاطس.", price: 272, oldPrice: 320, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p8.jpg" },
  { id: 1960009, name: "كريب زنجر", description: "زينجر صوص, جبنة موزاريلا, فلفل, زيتون, كاتشب, مايونيز, بطاطس.", price: 272, oldPrice: 320, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p9.jpg" },
  { id: 1960011, name: "كريب مكس لحوم", description: "سجق لحم, برجر لحم, جبنة موزاريلا, زيتون, بصل, فلفل, باربيكيو صوص, كاتشب, مايونيز.", price: 318, oldPrice: 375, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p11.jpg" },
  { id: 1960012, name: "كريب شيش طاووق", description: "كاتشب, مايونيز, جبنة موزاريلا, فلفل, زيتون.", price: 255, oldPrice: 300, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p12.jpg" },
  { id: 1960013, name: "كريب سجق دجاج", description: "كاتشب, مايونيز, جبنة موزاريلا, فلفل, زيتون.", price: 238, oldPrice: 280, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p13.jpg" },
  { id: 1960014, name: "كريب سجق لحم", description: "برجر لحم, جبنة موزاريلا, زيتون, بصل, فلفل, باربيكيو صوص, كاتشب, مايونيز.", price: 297, oldPrice: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p14.jpg" },
  { id: 1960015, name: "كريب فاهيتا", description: "كاتشب, مايونيز, جبنة موزاريلا, افوكادو صوص, خضار, مشروم.", price: 255, oldPrice: 300, category: "كريب", unit: "قطعة", image: "/assets/photos/krepma/p15.jpg" },

  // فطير
  { id: 1960016, name: "فطيرة سجق لحم", description: "جبنة كيري, مكس جبن, فلفل, طماطم, زيتون.", price: 297, oldPrice: 350, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p16.jpg" },
  { id: 1960017, name: "فطيرة كاسترد", description: "فطيرة حلوة محشوة بالكاسترد الكريمي الناعم.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p17.jpg" },
  { id: 1960018, name: "فطيرة عسل وقشطة", description: "فطيرة حلوة مع القشطة الغنية والعسل.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p18.jpg" },
  { id: 1960019, name: "فطيرة حليب بالمكسرات", description: "فطيرة حلوة بالحليب وتشكيلة من المكسرات المقرمشة.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p19.jpg" },
  { id: 1960020, name: "فطيرة شوكولاتة", description: "فطيرة طازجة بنكهة الشوكولاتة الغنية.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p20.jpg" },
  { id: 1960021, name: "فطيرة لوتس", description: "فطيرة حلوة بنكهة اللوتس المميزة.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p21.jpg" },
  { id: 1960022, name: "فطيرة سادة مع عسل وقشطة", description: "فطيرة سادة كلاسيكية تُقدّم مع العسل والقشطة.", price: 238, oldPrice: 280, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p22.jpg" },
  { id: 1960023, name: "بسبوسة بالكيلو", description: "بسبوسة كلاسيكية تُباع بالكيلو، مثالية للمشاركة.", price: 382, oldPrice: 450, category: "فطير", unit: "كيلو", image: "/assets/photos/krepma/p23.jpg" },
  { id: 1960024, name: "فطيرة بغاشة بالسكر وجوز الهند", description: "فطيرة بغاشة حلوة مع السكر وجوز الهند.", price: 229, oldPrice: 270, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p24.jpg" },
  { id: 1960025, name: "طاجن أم علي", description: "حلوى مصرية تقليدية غنية بالنكهة تُقدّم ساخنة.", price: 170, oldPrice: 200, category: "فطير", unit: "طبق", image: "/assets/photos/krepma/p25.jpg" },
  { id: 1960026, name: "رز بلبن بالمانجا والمكسرات", description: "رز بلبن كريمي مع المانجا والمكسرات المقرمشة.", price: 127, oldPrice: 150, category: "فطير", unit: "طبق", image: "/assets/photos/krepma/p26.jpg" },
  { id: 1960027, name: "رز بلبن سادة", description: "رز بلبن كلاسيكي بقوام كريمي ونكهة خفيفة.", price: 85, oldPrice: 100, category: "فطير", unit: "طبق", image: "/assets/photos/krepma/p27.jpg" },
  { id: 1960028, name: "فطيرة جمبري", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 318, oldPrice: 375, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p28.jpg" },
  { id: 1960029, name: "فطيرة بسطرمة", description: "جبنة كيري, مكس جبن, فلفل, طماطم, زيتون.", price: 318, oldPrice: 375, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p29.jpg" },
  { id: 1960030, name: "فطيرة مشكل جبن", description: "4 انواع جبن, طماطم, فلفل, زيتون.", price: 276, oldPrice: 325, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p30.jpg" },
  { id: 1960031, name: "فطيرة دجاج", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 297, oldPrice: 350, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p31.jpg" },
  { id: 1960032, name: "فطيرة كريسبي", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 297, oldPrice: 350, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p32.jpg" },
  { id: 1960033, name: "فطيرة تونة", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 297, oldPrice: 350, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p33.jpg" },
  { id: 1960034, name: "فطيرة جمبري وتونة", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 318, oldPrice: 375, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p34.jpg" },
  { id: 1960035, name: "فطيرة هوت دوج", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p35.jpg" },
  { id: 1960036, name: "فطيرة مشكل لحوم", description: "سجق, لحم مفروم, بسطرمة, مكس جبن, فلفل, زيتون.", price: 323, oldPrice: 380, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p36.jpg" },
  { id: 1960037, name: "فطيرة حواوشي إسكندراني", description: "لحم مفروم, مكس جبن, فلفل, زيتون, طماطم.", price: 255, oldPrice: 300, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p37.jpg" },
  { id: 1960039, name: "فطيرة ببروني", description: "مكس جبن, طماطم, فلفل, زيتون.", price: 297, oldPrice: 350, category: "فطير", unit: "قطعة", image: "/assets/photos/krepma/p39.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const krepmaProductCatalog = [];

const krepmaProducts = (krepmaProductCatalog.length ? krepmaProductCatalog : krepmaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: product.id || (1960001 + index),
  storeId: krepmaStore.id
}));

const krepmaDeliverySettings = {
  [krepmaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { krepmaStore, krepmaProducts, krepmaDeliverySettings };
}
