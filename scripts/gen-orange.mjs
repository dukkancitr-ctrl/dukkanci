import fs from 'fs';

const d = JSON.parse(fs.readFileSync('orange-raw.json', 'utf8'));
const STORE_NAME = 'عصائر أورنج تركيا';
const FALLBACK = '/assets/photos/orange/cover.jpg';

const store = {
  id: 34,
  name: STORE_NAME,
  category: 'عصائر',
  image: '/assets/photos/orange/cover.jpg',
  coverImage: '/assets/photos/orange/cover.jpg',
  logoImage: '/assets/photos/orange/logo.png',
  logo: 'أ',
  rating: 0,
  reviews: 0,
  newStore: true,
  delivery: 30,
  minOrder: 100,
  time: '30 - 55 دقيقة',
  distance: 12,
  location: { lat: 41.0082, lng: 28.9784 },
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Orange+Turkey+juice+Istanbul',
  open: true,
  featured: true,
  hasOffer: false,
  description: 'عصائر أورنج تركيا: عصائر طبيعية طازجة باللتر وبالكأس، أفوكادو، كريب ووافل وبان كيك، ميلك شيك وكوكتيلات وموهيتو، سلطات فواكه ومشروبات ساخنة وباردة. كل المنتجات بأسعارها كما في القائمة الرسمية.',
  address: 'إسطنبول، تركيا',
  phone: '+90 555 553 52 53',
  whatsapp: '+90 555 553 52 53',
  email: '',
  website: 'https://app.trybany.com/ar/orange-turkey-166/',
  sourceUrl: 'https://app.trybany.com/ar/orange-turkey-166/',
  hours: 'يومياً — يرجى التأكيد عبر الاتصال',
  areas: ['إسطنبول', 'مناطق التوصيل حسب المسافة'],
  fulfillment: 'توصيل واستلام',
  subscription: 'احترافي',
  orderCount: 0,
  officialStore: true,
};

const catalog = d.products.map(p => ({
  sourceId: p.sourceId,
  name: p.name,
  image: p.localImage || FALLBACK,
  price: p.price,
  unit: '',
  category: p.category,
  available: p.available !== false,
  featured: false,
  description: p.description && p.description.length > 0 ? p.description : `${p.name} من عصائر أورنج تركيا.`,
  imageFit: 'cover',
  options: [],
}));

const j = (o) => JSON.stringify(o, null, 1);

const file = `// Generated for ${STORE_NAME} (Orange Turkey) — Istanbul. Source: app.trybany.com/ar/orange-turkey-166
// Prices are from the official menu (Turkish Lira). Product photos are the shop's own
// branded images; a few items without their own photo fall back to the store cover.
const orangeStore = ${j(store)};

const orangeProductCatalog = ${j(catalog)};

const orangeProducts = orangeProductCatalog.map((product, index) => ({
  ...product,
  id: 40001 + index,
  storeId: orangeStore.id
}));

const orangeDeliverySettings = {
  [orangeStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 120 }
};
`;

fs.writeFileSync('orange-data.js', file);
console.log('Wrote orange-data.js:', catalog.length, 'products, store id', store.id);
