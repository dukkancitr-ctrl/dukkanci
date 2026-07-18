const fs = require('fs');

const products = [
  // سندويش (Sandwiches)
  { n: 1, name: "زنجر حاره", price: 200, cat: "سندويش" },
  { n: 2, name: "كرانشي", price: 215, cat: "سندويش" },
  { n: 3, name: "فرانشيسكو", price: 200, cat: "سندويش" },
  { n: 10, name: "سندويشه شاورما سياحي", desc: "شاورما على جريل", price: 150, cat: "سندويش" },
  { n: 12, name: "برغر باربكيو", price: 215, cat: "سندويش" },
  { n: 13, name: "سندويش شيش دبل حشوه", price: 185, cat: "سندويش" },
  { n: 14, name: "شيش عربي دبل سندويش", price: 365, cat: "سندويش" },
  { n: 21, name: "شاورما عربي دبل سندويش", price: 365, cat: "سندويش" },
  { n: 22, name: "شاورما صمون", price: 185, cat: "سندويش" },
  { n: 23, name: "شاورما عربي", price: 240, cat: "سندويش" },
  { n: 24, name: "شاورما دبل حشوه", price: 185, cat: "سندويش" },
  { n: 25, name: "شيش خبز سياحي", price: 150, cat: "سندويش" },
  { n: 26, name: "شيش عربي", price: 245, cat: "سندويش" },
  { n: 27, name: "تشيكن ساب", price: 200, cat: "سندويش" },
  { n: 41, name: "مكسيكي", price: 185, cat: "سندويش" },
  { n: 42, name: "برغر دجاج حار", price: 215, cat: "سندويش" },
  { n: 43, name: "اسكالوب", price: 185, cat: "سندويش" },
  { n: 44, name: "سوبر بيك طاووق", price: 215, cat: "سندويش" },
  { n: 45, name: "شرحات دجاج مطفايه بالحمض والثوم", price: 185, cat: "سندويش" },
  { n: 48, name: "شيش صمون", price: 185, cat: "سندويش" },
  { n: 50, name: "فاهيتا", price: 200, cat: "سندويش" },
  { n: 52, name: "برغر دجاج شيدر", price: 215, cat: "سندويش" },
  { n: 53, name: "كريسبي", price: 185, cat: "سندويش" },
  { n: 54, name: "سكلنص", price: 215, cat: "سندويش" },
  { n: 55, name: "ميغا", price: 215, cat: "سندويش" },
  { n: 56, name: "نيجيره هلبينو", price: 215, cat: "سندويش" },
  { n: 57, name: "سبنش", price: 215, cat: "سندويش" },
  { n: 58, name: "برغر روكا", price: 215, cat: "سندويش" },
  { n: 59, name: "برغر شيلي", price: 215, cat: "سندويش" },

  // صحون البطاطا (Potato dishes)
  { n: 4, name: "صحن بطاطا دجاج باربكيو", price: 215, cat: "صحون البطاطا" },
  { n: 5, name: "صحن بطاطا كبير", price: 160, cat: "صحون البطاطا" },
  { n: 6, name: "صحن بطاطا دجاج حار", price: 215, cat: "صحون البطاطا" },
  { n: 11, name: "صحن بطاطا دجاج الشدر", price: 215, cat: "صحون البطاطا" },
  { n: 20, name: "صحن دجاج شيلي", price: 215, cat: "صحون البطاطا" },
  { n: 39, name: "صحن بطاطا صغير", price: 115, cat: "صحون البطاطا" },
  { n: 40, name: "صحن بطاطا وسط", price: 125, cat: "صحون البطاطا" },
  { n: 46, name: "بطاطا ماكس", price: 185, cat: "صحون البطاطا" },
  { n: 47, name: "بطاطا صمون", price: 125, cat: "صحون البطاطا" },
  { n: 49, name: "بطاطا خبز سياحي", price: 115, cat: "صحون البطاطا" },
  { n: 51, name: "بطاطا مع قشقوان", price: 155, cat: "صحون البطاطا" },

  // وجبات (Meal boxes)
  { n: 7, name: "وجبة مكسيكانو", price: 380, cat: "وجبات" },
  { n: 8, name: "وجبة شيش", price: 380, cat: "وجبات" },
  { n: 9, name: "وجبة زنجر حاره", price: 400, cat: "وجبات" },
  { n: 30, name: "وجبه مشكله زنجر + فاهيتا", price: 420, cat: "وجبات" },
  { n: 31, name: "وجبة كريسبي مع جبنه شيدر", price: 420, cat: "وجبات" },
  { n: 32, name: "وجبة فاهيتا", price: 400, cat: "وجبات" },
  { n: 33, name: "وجبه سوبر بيك طوق", price: 420, cat: "وجبات" },
  { n: 34, name: "وجبه شرحات دجاج مطفايه بالحمض والثوم", price: 380, cat: "وجبات" },
  { n: 35, name: "وجبه كرانشي", price: 420, cat: "وجبات" },
  { n: 36, name: "وجبه فرانشيسكو", price: 400, cat: "وجبات" },
  { n: 37, name: "وجبه اسكالوب", price: 380, cat: "وجبات" },
  { n: 38, name: "وجبه كريسبي", price: 380, cat: "وجبات" },

  // مشروبات (Beverages)
  { n: 15, name: "ماء", price: 15, cat: "مشروبات" },
  { n: 16, name: "مندرين زيرو سكر", price: 50, cat: "مشروبات" },
  { n: 17, name: "مندرين", price: 50, cat: "مشروبات" },
  { n: 18, name: "ترك كولا تنك", price: 50, cat: "مشروبات" },
  { n: 19, name: "عيران كبير", price: 40, cat: "مشروبات" },
  { n: 28, name: "كول لتر", price: 70, cat: "مشروبات" },
  { n: 29, name: "صودا", price: 35, cat: "مشروبات" }
];

if (products.length !== 59) throw new Error('Expected 59 products, got ' + products.length);
const ids = new Set(products.map(p => p.n));
if (ids.size !== 59) throw new Error('Duplicate n values!');
for (let i = 1; i <= 59; i++) if (!ids.has(i)) throw new Error('Missing n=' + i);

function unitFor(cat) {
  if (cat === "سندويش") return "سندويش";
  if (cat === "صحون البطاطا") return "طبق";
  if (cat === "وجبات") return "وجبة";
  return "قطعة";
}

function esc(s) {
  return String(s).split('\\').join('\\\\').split('"').join('\\"');
}

const order = ["سندويش", "صحون البطاطا", "وجبات", "مشروبات"];
let lines = [];
lines.push('// Generated for مطعم بيغ طاووق (Bigtavuk / BIG TAVUKمطعم بيك طاووق) — Hırka-i Şerif, Fatih, Istanbul.');
lines.push('// Arab-style fried chicken sandwiches/burgers, potato dishes, meal boxes, beverages.');
lines.push('// Source: WhatsApp Business catalog (wa.me/c/905342304301, 59 unique items via "All items" full list,');
lines.push('// cross-checked against the 3 named category previews) + Google Maps ("BIG TAVUKمطعم بيك طاووق",');
lines.push('// exact phone+address match, rating/reviews/place_id confirmed).');
lines.push('const bigtavukStore = {');
lines.push(' "id": 101,');
lines.push(' "name": "بيغ طاووق",');
lines.push(' "category": "مطاعم",');
lines.push(' "image": "/assets/photos/bigtavuk/cover.jpg",');
lines.push(' "coverImage": "/assets/photos/bigtavuk/cover.jpg",');
lines.push(' "logoImage": "/assets/photos/bigtavuk/logo.jpg",');
lines.push(' "logo": "ب",');
lines.push(' "rating": 4.6,');
lines.push(' "reviews": 55,');
lines.push(' "newStore": true,');
lines.push(' "delivery": 35,');
lines.push(' "minOrder": 100,');
lines.push(' "time": "30 - 60 دقيقة",');
lines.push(' "distance": 0,');
lines.push(' "location": {');
lines.push('  "lat": 41.0209276,');
lines.push('  "lng": 28.9416831');
lines.push(' },');
lines.push(' "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0209276,28.9416831",');
lines.push(' "open": true,');
lines.push(' "featured": false,');
lines.push(' "hasOffer": false,');
lines.push(' "offer": "",');
lines.push(' "description": "بيغ طاووق — مطعم ماكولات عربية: سندويشات دجاج مقرمش وشاورما وبرغر، صحون بطاطا، ووجبات كاملة، حي خرقة شريف، الفاتح، إسطنبول.",');
lines.push(' "address": "Hırka-i Şerif, Bâlipaşa Cd No:158 A, 34091 Fatih/İstanbul",');
lines.push(' "phone": "+90 534 230 43 01",');
lines.push(' "whatsapp": "+90 534 230 43 01",');
lines.push(' "email": "bigtavuk24@gmail.com",');
lines.push(' "website": "",');
lines.push(' "sourceUrl": "https://wa.me/c/905342304301",');
lines.push(' "hours": "يومياً 00:00 – 23:00",');
lines.push(' "areas": [');
lines.push('  "الفاتح",');
lines.push('  "مناطق إسطنبول حسب المسافة"');
lines.push(' ],');
lines.push(' "fulfillment": "توصيل واستلام",');
lines.push(' "subscription": "احترافي",');
lines.push(' "orderCount": 0,');
lines.push(' "officialStore": true,');
lines.push(' "approvalStatus": "pending",');
lines.push(' "googleRating": 4.6,');
lines.push(' "googleReviewsCount": 55,');
lines.push(' "googlePlaceId": "ChIJfbzw6Gi7yhQR5yvgff2n9wg",');
lines.push(' "googleMapsUrl": "https://maps.google.com/?cid=646169778731363303"');
lines.push('};');
lines.push('');
lines.push('const bigtavukFullCatalog = [');
order.forEach((cat, ci) => {
  lines.push('  // ' + cat);
  products.filter(p => p.cat === cat).forEach(p => {
    const unit = unitFor(p.cat);
    const desc = p.desc || "";
    lines.push('  { name: "' + esc(p.name) + '", description: "' + esc(desc) + '", price: ' + p.price + ', category: "' + esc(p.cat) + '", unit: "' + esc(unit) + '", image: "/assets/photos/bigtavuk/p' + p.n + '.jpg" },');
  });
  if (ci < order.length - 1) lines.push('');
});
lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
lines.push('];');
lines.push('');
lines.push('// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.');
lines.push('const bigtavukProductCatalog = [];');
lines.push('');
lines.push('const bigtavukProducts = (bigtavukProductCatalog.length ? bigtavukProductCatalog : bigtavukFullCatalog).map((product, index) => ({');
lines.push('  ...product,');
lines.push('  available: true,');
lines.push('  id: 1830001 + index,');
lines.push('  storeId: bigtavukStore.id');
lines.push('}));');
lines.push('');
lines.push('const bigtavukDeliverySettings = {');
lines.push('  [bigtavukStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }');
lines.push('};');
lines.push('');
lines.push('if (typeof module !== "undefined" && module.exports) {');
lines.push('  module.exports = { bigtavukStore, bigtavukProducts, bigtavukDeliverySettings };');
lines.push('}');
lines.push('');

fs.writeFileSync('bigtavuk-data.js', lines.join('\n'), 'utf8');
console.log('Wrote bigtavuk-data.js, products:', products.length);
