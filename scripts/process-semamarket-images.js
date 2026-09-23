// One-time: converts the WhatsApp-catalog dump (data.json + imgNNN.bin) into
// assets/photos/semamarket/** and generates semamarket-data.js.
const fs = require('fs'), path = require('path'), sharp = require('sharp');
const SRC = process.argv[2], OUT = 'assets/photos/semamarket';
const STORE_ID = 118, PID0 = 1980001;
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const meta = JSON.parse(fs.readFileSync(path.join(SRC, 'data.json'), 'utf8'));
  const items = [];
  for (const m of meta) {
    const t = m.text.replace(/\s+/g, ' ').trim();
    const mm = t.match(/^(.*?)\s*TRY\s*([\d.,]+)$/);
    if (!mm || !m.file) { console.log('SKIP (no price/image):', t); continue; }
    items.push({ name: mm[1].trim(), price: parseFloat(mm[2].replace(/,/g, '')), category: m.cat, file: m.file });
  }
  let i = 0;
  for (const it of items) {
    i++; const fn = 'p' + i + '.jpg';
    await sharp(path.join(SRC, it.file)).rotate().resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .flatten({ background: '#fff' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, fn));
    it.image = '/assets/photos/semamarket/' + fn;
  }
  await sharp(path.join(SRC, 'brand/sama-logo.jpg')).resize(400, 400).jpeg({ quality: 88 }).toFile(path.join(OUT, 'logo.jpg'));
  await sharp(path.join(SRC, 'brand/cover.bin')).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(OUT, 'cover.jpg'));
  const lines = items.map(x => '  ' + JSON.stringify({ name: x.name, price: x.price, category: x.category, image: x.image }) + ',');
  const js = `// Generated for سما ماركت (Sema Market) — Mehterçeşme, Esenyurt/İstanbul.
// Source: WhatsApp Business catalog (wa.me/c/905375742375), ${items.length} products across 10 categories.
// Google Places match: place_id ChIJa4fzTiBftRQRYyfuHUyoe4A (phone matches exactly).
// Products with no price in the catalog were excluded.
const semamarketStore = {
 "id": ${STORE_ID},
 "name": "سما ماركت",
 "category": "سوبر ماركت",
 "image": "/assets/photos/semamarket/cover.jpg",
 "coverImage": "/assets/photos/semamarket/cover.jpg",
 "logoImage": "/assets/photos/semamarket/logo.jpg",
 "logo": "س",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": { "lat": 41.0207688, "lng": 28.6642762 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0207688,28.6642762",
 "open": true,
 "featured": false,
 "hasOffer": false,
 "offer": "",
 "description": "سما ماركت (بيم العرب) — سوبر ماركت في حي مهتر تشيشمة بإسنيورت: قهوة وشاي ومتة، أرز ومواد غذائية، ألبان وأجبان، مخبوزات، معلبات، مشروبات، شيبس، سمنة وزيوت، بسكويت وشوكولا. توصيل حسب المسافة.",
 "address": "Mehterçeşme, 1869 Sk. No:26A, 34515 Esenyurt/İstanbul",
 "phone": "+90 537 574 23 75",
 "whatsapp": "+90 537 574 23 75",
 "email": "",
 "website": "",
 "sourceUrl": "https://wa.me/c/905375742375",
 "hours": "يومياً 10:00 ص – 10:00 م",
 "areas": ["إسنيورت", "مناطق إسطنبول حسب المسافة"],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true,
 "approvalStatus": "pending",
 "googlePlaceId": "ChIJa4fzTiBftRQRYyfuHUyoe4A",
 "googleMapsUrl": "https://maps.google.com/?cid=9258178503863314275"
};

const semamarketFullCatalog = [
${lines.join('\n')}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const semamarketProductCatalog = [];

const semamarketProducts = (semamarketProductCatalog.length ? semamarketProductCatalog : semamarketFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: ${PID0} + index,
  storeId: semamarketStore.id
}));

const semamarketDeliverySettings = {
  [semamarketStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { semamarketStore, semamarketProducts, semamarketDeliverySettings };
}
`;
  fs.writeFileSync('semamarket-data.js', js);
  console.log('items', items.length);
})();
