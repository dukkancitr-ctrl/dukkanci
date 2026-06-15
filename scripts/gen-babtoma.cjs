// One-shot generator for مطعم باب توما (Bab Touma) — source: tillymenu.com/85/babtoma
// Downloads item images locally and emits babtoma-data.js. Run: node scripts/gen-babtoma.cjs
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const RAW = path.join(ROOT, 'babtoma-ar.json');
const ITEMS_DIR = path.join(ROOT, 'assets', 'photos', 'babtoma', 'items');
fs.mkdirSync(ITEMS_DIR, { recursive: true });

const data = JSON.parse(fs.readFileSync(RAW, 'utf8')).data;

function dl(url, out) {
  return new Promise((res, rej) => {
    https.get(encodeURI(url), { headers: { 'User-Agent': 'Mozilla/5.0' } }, r => {
      if (r.statusCode !== 200) { r.resume(); return rej(new Error('HTTP ' + r.statusCode + ' ' + url)); }
      const f = fs.createWriteStream(out);
      r.pipe(f);
      f.on('finish', () => f.close(() => res(out)));
    }).on('error', rej);
  });
}

function extOf(url) {
  const m = (url.split('?')[0].match(/\.([a-zA-Z0-9]{2,5})$/) || [])[1];
  let e = (m || 'jpg').toLowerCase();
  if (e === 'jfif') e = 'jpg'; // jfif is plain JPEG; .jpg renders everywhere
  return e;
}

const STORE_DESC = data.menu.description ||
  'مطعم باب توما (Bab Touma): مطعم شامي شرق أوسطي يقدّم الشاميات والمعجنات والصفائح والمشاوي والشاورما والبيتزا والوجبات الغربية والمقبلات الباردة والساخنة والسلطات والمشروبات. الأصناف والأسعار كما في القائمة الرسمية للمطعم.';

(async () => {
  const catalog = [];
  let n = 0;
  for (const cat of data.categories) {
    for (const it of (cat.items || [])) {
      n++;
      const idx = String(n).padStart(3, '0');
      const srcUrl = it.item_image && it.item_image[0] && it.item_image[0].url;
      let image = '/assets/photos/babtoma/cover.jpg';
      if (srcUrl) {
        const ext = extOf(srcUrl);
        const fname = `item-${idx}.${ext}`;
        try {
          await dl(srcUrl, path.join(ITEMS_DIR, fname));
          image = `/assets/photos/babtoma/items/${fname}`;
        } catch (e) {
          console.error('IMG FAIL', it.name, e.message);
        }
      }

      // Size / weight options (e.g. وسط/كبير, كيلو/نصف كيلو) → app option group
      let price = Number(it.price) || 0;
      let options = [];
      const opts = (it.options || []).filter(o => o && o.unit_value && o.unit_value.name);
      if (opts.length > 1) {
        const u = opts[0].unit && opts[0].unit.name;
        const groupName = (u && (typeof u === 'object' ? u.ar : u)) || 'الخيار';
        const sorted = opts
          .map(o => ({ label: o.unit_value.name, price: Number(o.price) || 0 }))
          .sort((a, b) => a.price - b.price);
        const base = sorted[0].price;
        price = base;
        options = [{
          name: groupName,
          values: sorted.map(s => s.label),
          extra: sorted.map(s => s.price - base),
        }];
      }

      catalog.push({
        sourceId: String(it.id),
        name: it.name,
        image,
        price,
        unit: '',
        category: cat.name,
        available: String(it.status) === '1' && it.is_visible !== 0,
        featured: false,
        description: (it.description && it.description.trim()) || `${it.name} من مطعم باب توما.`,
        imageFit: 'cover',
        options,
      });
    }
  }

  const out =
`// Generated for مطعم باب توما (Bab Touma) — Esenyurt, Istanbul. Source: tillymenu.com/85/babtoma
const babtomaStore = ${JSON.stringify({
    id: 33,
    name: 'مطعم باب توما',
    category: 'مطاعم',
    image: '/assets/photos/babtoma/cover.jpg',
    coverImage: '/assets/photos/babtoma/cover.jpg',
    logoImage: '/assets/photos/babtoma/logo.jpg',
    logo: 'ب',
    rating: 0,
    reviews: 0,
    newStore: true,
    delivery: 35,
    minOrder: 150,
    time: '40 - 70 دقيقة',
    distance: 18,
    location: { lat: 41.0201389, lng: 28.6706606 },
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=41.0201389,28.6706606',
    open: true,
    featured: true,
    hasOffer: true,
    description: STORE_DESC,
    address: 'إسنيورت، إسطنبول، تركيا',
    phone: '+90 555 170 60 00',
    whatsapp: '+90 555 170 60 00',
    email: '',
    website: 'https://tillymenu.com/85/babtoma',
    sourceUrl: 'https://tillymenu.com/85/babtoma',
    hours: 'يومياً',
    areas: ['إسنيورت', 'إسطنبول', 'مناطق التوصيل حسب المسافة'],
    fulfillment: 'توصيل واستلام',
    subscription: 'احترافي',
    orderCount: 0,
    officialStore: true,
  }, null, 1)};

const babtomaProductCatalog = ${JSON.stringify(catalog, null, 1)};

const babtomaProducts = babtomaProductCatalog.map((product, index) => ({
  ...product,
  id: 39001 + index,
  storeId: babtomaStore.id
}));

const babtomaDeliverySettings = {
  [babtomaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};
`;

  // Inject the description constant (kept out of JSON.stringify to preserve Arabic literal cleanly)
  const finalOut = out.replace('description: STORE_DESC,', 'description: ' + JSON.stringify(STORE_DESC) + ',');
  fs.writeFileSync(path.join(ROOT, 'babtoma-data.js'), finalOut, 'utf8');
  console.log('WROTE babtoma-data.js with', catalog.length, 'products;', catalog.filter(p => p.options.length).length, 'with options.');
})();
