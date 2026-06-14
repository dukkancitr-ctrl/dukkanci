import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = path.join(rootDir, "assets", "photos", "zaitoune");
const productAssetDir = path.join(assetDir, "products");
const projectId = "zaitoune-e7b47";
const firebaseApiKey = "AIzaSyA3Su7jv_D8RG760u-0CYGExfOGz3tMPXk";
const productsEndpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/Products?pageSize=300&key=${firebaseApiKey}`;

const officialArabicNames = {
  fistikli_baklava: "آسيه",
  cevizli_kurabiye: "معمول جوز",
  fistikli_baklava_ekstra: "مشكل بقلاوة بالفستق إكسترا",
  fistikli_dilber_dudagi: "كول وشكور",
  fistikli_kadayif: "مبرومة",
  fistikli_kare_kadayif: "بلورية",
  kurabiye_fistik_ceviz: "معمول جوز وفستق",
  fistikli_kurabiye: "معمول فستق",
  fistikli_kus_gozu: "عش البلبل",
  fistikli_sarma: "أصابع فستق",
  hurma_tatlisi: "تمرية",
  hurmali_kurabiye: "معمول تمر",
  incirli_kurabiye: "معمول تين",
  kahve: "قهوة",
  kajulu_sarma: "أصابع كاجو",
  baklava_fistik_kaju: "مشكل بقلاوة فستق وكاجو",
  fistikli_balli_zahfarli_baklava: "مشكل بقلاوة بالعسل والزعفران",
  fistikli_balli_baklava: "مشكل بقلاوة فستق بالعسل",
  kurabiye_sade_susam_hurma: "مشكل نواشف",
  kayisili_kurabiye: "معمول مشمش",
  kahve_ekstra: "قهوة إكسترا",
  lokum: "راحة الحلقوم",
  lozina_lokumu: "لوزينا",
  sade_kurabiye: "غريبة",
  susamli_kurabiye: "برازق",
  dubaichocolate: "شوكولا دبي",
  fistikli_lokum: "راحة ملكية بالفستق",
  karisik_fistikli_lokum: "مشكل نوغا بالفستق"
};

const categoryNames = {
  mix: "مشكل",
  fistik: "حلويات بالفستق",
  kurabiyeler: "نواشف ومعمول",
  cevizli: "حلويات بالجوز",
  kaju: "حلويات بالكاجو",
  lokumlar: "راحة الحلقوم",
  kahveler: "قهوة"
};

function decodeFirestoreValue(value) {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values || []).map(decodeFirestoreValue);
  if ("mapValue" in value) {
    return Object.fromEntries(
      Object.entries(value.mapValue.fields || {}).map(([key, nestedValue]) => [
        key,
        decodeFirestoreValue(nestedValue)
      ])
    );
  }
  return null;
}

function parseArabicProductNames(html) {
  const start = html.indexOf('\\"Products\\":{');
  const end = html.indexOf('},\\"PaymentSuccess\\"', start);
  if (start < 0 || end < 0) return {};

  const block = html.slice(start, end);
  const entries = {};
  for (const match of block.matchAll(/\\"([a-z0-9_]+)\\":\\"((?:\\.|[^"\\])*)\\"/gi)) {
    try {
      entries[match[1]] = JSON.parse(`"${match[2]}"`).trim();
    } catch {
      entries[match[1]] = match[2].trim();
    }
  }
  return entries;
}

function weightInGrams(weight) {
  const numeric = Number.parseInt(String(weight), 10);
  return Number.isFinite(numeric) ? numeric : 1000;
}

function weightLabel(weight) {
  return `${weightInGrams(weight)} غ`;
}

function productPrice(product, weight) {
  if (product.priceMapTRY && product.priceMapTRY[weight] !== undefined) {
    return Number(product.priceMapTRY[weight]);
  }
  return Number(product.priceTRY || 0) * weightInGrams(weight) / 1000;
}

function normalizeCategory(category = "") {
  return categoryNames[category.trim()] || "حلويات زيتونة";
}

function fallbackName(nameKey) {
  return nameKey.replaceAll("_", " ").replace(/\b\w/g, letter => letter.toUpperCase());
}

async function download(url, destination) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Download failed (${response.status}): ${url}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
}

async function runPool(tasks, concurrency = 8) {
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < tasks.length) {
      const taskIndex = nextIndex++;
      await tasks[taskIndex]();
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
}

await mkdir(productAssetDir, { recursive: true });

const [productsResponse, arabicPageResponse] = await Promise.all([
  fetch(productsEndpoint),
  fetch("https://www.zaitoune.co/ar/products")
]);
if (!productsResponse.ok) throw new Error(`Product database failed (${productsResponse.status})`);
if (!arabicPageResponse.ok) throw new Error(`Arabic product page failed (${arabicPageResponse.status})`);

const productsPayload = await productsResponse.json();
const arabicNames = {
  ...officialArabicNames,
  ...parseArabicProductNames(await arabicPageResponse.text())
};
const sourceProducts = (productsPayload.documents || []).map(document => ({
  sourceId: document.name.split("/").pop(),
  ...Object.fromEntries(
    Object.entries(document.fields || {}).map(([key, value]) => [key, decodeFirestoreValue(value)])
  )
}));

const activeProducts = sourceProducts
  .filter(product => product.showProduct?.turkey === true)
  .sort((first, second) => first.sourceId.localeCompare(second.sourceId));

const catalog = activeProducts.map((product, index) => {
  const countryWeights = product.weightsByCountry?.TR;
  const weights = countryWeights?.length ? countryWeights : (product.weights?.length ? product.weights : ["1000g"]);
  const regularPrices = weights.map(weight => productPrice(product, weight));
  const discount = Math.max(0, Number(product.discountTRY) || 0);
  const finalPrices = regularPrices.map(price => Math.round(price * (1 - discount / 100)));
  const basePrice = finalPrices[0];
  const name = arabicNames[product.nameKey] || product.nameKeyAR?.trim() || fallbackName(product.nameKey);

  return {
    sourceId: product.sourceId,
    name,
    image: `/assets/photos/zaitoune/products/${product.nameKey}.webp`,
    price: basePrice,
    oldPrice: discount > 0 ? regularPrices[0] : null,
    unit: weightLabel(weights[0]),
    category: normalizeCategory(product.category),
    available: true,
    featured: index < 8,
    description: `${name} من حلويات زيتونة، محضر بمكونات مختارة ومتوفر بأوزان متعددة.`,
    sourceUrl: "https://www.zaitoune.co/ar/products",
    sourceBranded: true,
    imageFit: "cover",
    options: weights.length > 1 ? [{
      name: "الوزن",
      values: weights.map(weightLabel),
      extra: finalPrices.map(price => price - basePrice)
    }] : []
  };
});

const downloads = [
  () => download("https://www.zaitoune.co/logo.png", path.join(assetDir, "logo.png")),
  () => download(
    "https://www.zaitoune.co/_next/image?url=%2FSlideImage1.png&w=1200&q=75",
    path.join(assetDir, "cover.jpg")
  ),
  ...catalog.map(product => () => download(
    `https://www.zaitoune.co/products/webp/${product.image.split("/").pop()}`,
    path.join(rootDir, product.image.replace(/^\//, "").replaceAll("/", path.sep))
  ))
];
await runPool(downloads);

const store = {
  id: 12,
  name: "حلويات زيتونة",
  category: "حلويات",
  image: "/assets/photos/zaitoune/cover.jpg",
  coverImage: "/assets/photos/zaitoune/cover.jpg",
  logoImage: "/assets/photos/zaitoune/logo.png",
  logo: "ز",
  rating: 0,
  reviews: 0,
  newStore: true,
  delivery: 30,
  minOrder: 250,
  time: "35 - 55 دقيقة",
  distance: 7.8,
  location: { lat: 41.0030495, lng: 28.8657701 },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Zaitoune+Sweets+Bahcelievler+Istanbul",
  open: true,
  featured: true,
  hasOffer: catalog.some(product => product.oldPrice),
  offer: "خصم 10% على المنتجات المختارة",
  description: "حلويات زيتونة متخصصة في البقلاوة التركية والحلويات التقليدية، مع الفستق الفاخر وخيارات متنوعة من النواشف والحلقوم والقهوة.",
  address: "بهجة ليفلر، إسطنبول، تركيا",
  phone: "+90 505 567 90 00",
  email: "info@baklava.com",
  website: "https://www.zaitoune.co/ar",
  sourceUrl: "https://www.zaitoune.co/ar/products",
  hours: "يرجى تأكيد أوقات العمل مباشرة عبر واتساب",
  areas: ["بهجة ليفلر", "إسطنبول", "مناطق التوصيل حسب المسافة"],
  fulfillment: "توصيل واستلام",
  subscription: "احترافي",
  orderCount: 0,
  officialStore: true,
  brandTheme: "zaitoune"
};

const dataFile = `// Generated from the official Zaitoune store on ${new Date().toISOString().slice(0, 10)}.\n`
  + `const zaitouneStore = ${JSON.stringify(store, null, 2)};\n\n`
  + `const zaitouneProductCatalog = ${JSON.stringify(catalog, null, 2)};\n\n`
  + `const zaitouneProducts = zaitouneProductCatalog.map((product, index) => ({\n`
  + `  ...product,\n`
  + `  id: 12001 + index,\n`
  + `  storeId: zaitouneStore.id\n`
  + `}));\n\n`
  + `const zaitouneDeliverySettings = {\n`
  + `  [zaitouneStore.id]: { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 100 }\n`
  + `};\n`;

await writeFile(path.join(rootDir, "zaitoune-data.js"), dataFile, "utf8");
console.log(`Synced Zaitoune with ${catalog.length} active products.`);
