import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetDir = path.join(rootDir, "assets", "photos", "alsultan");
const branchAssetDir = path.join(assetDir, "branches");
const productAssetDir = path.join(assetDir, "products");
const productApi = "https://alsultansweets.com/wp-json/wc/store/v1/products?per_page=100";

const branches = [
  {
    id: 6,
    branchName: "الفاتح",
    address: "Akşemsettin, Balipaşa Cd No:150, D:F, 34080 Fatih/İstanbul, تركيا",
    phone: "+90 552 322 31 02",
    location: { lat: 41.0205403, lng: 28.9420939 },
    distance: 0.6,
    mapUrl: "https://maps.app.goo.gl/QggF8qZNDHoLrwpT9",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2026/02/الفاتح.webp",
    coverFile: "branch-6.webp",
    featured: true
  },
  {
    id: 7,
    branchName: "باشاك شهير",
    address: "BULVARI CD B 7, 9001, 34494 Başakşehir/İstanbul, تركيا",
    phone: "+90 531 265 66 37",
    location: { lat: 41.1181509, lng: 28.7744114 },
    distance: 18.8,
    mapUrl: "https://maps.app.goo.gl/ekyosaNoyxo6snvZ7",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2025/06/1641555843.jpeg",
    coverFile: "branch-7.jpeg",
    featured: false
  },
  {
    id: 8,
    branchName: "يوسف باشا",
    address: "Topkapı, Turgut Özal Millet Cd. NO: 22a, Fatih/İstanbul, تركيا",
    phone: "+90 506 041 44 25",
    location: { lat: 41.0104561, lng: 28.9462547 },
    distance: 1,
    mapUrl: "https://maps.app.goo.gl/dw87tkY3h3c5Ziif9",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2026/02/يوسف-باشا.webp",
    coverFile: "branch-8.webp",
    featured: false
  },
  {
    id: 9,
    branchName: "بيليكدوزو",
    address: "Pınartepe, Nöbet Sk. No:34, 34500 Büyükçekmece/İstanbul, تركيا",
    phone: "+90 552 738 69 91",
    location: { lat: 41.0097042, lng: 28.6254008 },
    distance: 29,
    mapUrl: "https://maps.app.goo.gl/aSszHjd2qQuyeZcb6",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2025/06/1641557294.jpeg",
    coverFile: "branch-9.jpeg",
    featured: false
  },
  {
    id: 10,
    branchName: "بهشة شهير",
    address: "Koza, Hoşdere Yolu 3M59+8JW 25A, Esenyurt/İstanbul, تركيا",
    phone: "+90 501 108 51 00",
    location: { lat: 41.0583329, lng: 28.6691247 },
    distance: 25,
    mapUrl: "https://maps.app.goo.gl/pN5c3DbB1TQ8E6P46",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2026/02/اسنيورت.webp",
    coverFile: "branch-10.webp",
    featured: false
  },
  {
    id: 11,
    branchName: "سلطان غازي",
    address: "MAHMUTBEY CD.NO: 76 ŞANTİYE, Malkoçoğlu, İstanbul, تركيا",
    phone: "+90 552 322 31 05",
    location: { lat: 41.112023, lng: 28.8482417 },
    distance: 14,
    mapUrl: "https://maps.app.goo.gl/V9XUuyotzkidJDD78",
    coverRemote: "https://alsultansweets.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-13-at-16.53.04.webp",
    coverFile: "branch-11.webp",
    featured: false
  }
];

const brandAssets = [
  {
    remote: "https://alsultansweets.com/wp-content/uploads/2025/06/alsultan-logo-scaled-e1748780906436.png",
    file: "logo.png"
  },
  {
    remote: "https://alsultansweets.com/wp-content/uploads/2025/06/شعار-السلطان-عربي-عرضي-e1770099344746.png",
    file: "logo-arabic.png"
  },
  {
    remote: "https://alsultansweets.com/wp-content/uploads/2026/06/بنر-سلطان-عربي.png",
    file: "brand-cover.png"
  }
];

function imageExtension(url) {
  const extension = path.extname(new URL(url).pathname).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(extension) ? extension : ".webp";
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

function plainText(html = "") {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8211;|&#8212;/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

function productUnit(product, category) {
  if (/وجبة|مندي|كبسة|فريكة|بازلاء|أوزي|شوربة/.test(product.name) || category.startsWith("وجبات")) {
    return "الوجبة";
  }
  if (/حبة|حبات|قطعتين|قطع/.test(product.name)) return "العلبة";
  if (/غرام|كغ|غ\b/.test(product.name)) return "العبوة";
  return "الحصة";
}

function primaryCategory(product) {
  const categories = product.categories.map(category => category.name);
  return categories.find(category => category !== "وجبات رمضان") || categories[0] || "منتجات السلطان";
}

await mkdir(branchAssetDir, { recursive: true });
await mkdir(productAssetDir, { recursive: true });

const response = await fetch(productApi);
if (!response.ok) throw new Error(`Product API failed (${response.status})`);
const remoteProducts = await response.json();

const productCatalog = remoteProducts.map((product, index) => {
  const imageUrl = product.images[0]?.thumbnail || product.images[0]?.src;
  const extension = imageExtension(imageUrl);
  const price = Number(product.prices.price) / (10 ** product.prices.currency_minor_unit);
  const regularPrice = Number(product.prices.regular_price) / (10 ** product.prices.currency_minor_unit);
  const category = primaryCategory(product);
  const description = plainText(product.short_description || product.description)
    || `منتج أصلي من حلويات السلطان العالمية ضمن قسم ${category}.`;

  return {
    sourceId: product.id,
    name: product.name,
    image: `/assets/photos/alsultan/products/${product.id}${extension}`,
    imageRemote: imageUrl,
    price,
    oldPrice: regularPrice > price ? regularPrice : null,
    unit: productUnit(product, category),
    category,
    available: product.is_in_stock,
    featured: index < 12,
    description,
    sourceUrl: product.permalink,
    sourceBranded: true,
    options: []
  };
});

const downloadTasks = [
  ...brandAssets.map(asset => () => download(asset.remote, path.join(assetDir, asset.file))),
  ...branches.map(branch => () => download(branch.coverRemote, path.join(branchAssetDir, branch.coverFile))),
  ...productCatalog.map(product => () => download(
    product.imageRemote,
    path.join(rootDir, product.image.replace(/^\//, "").replaceAll("/", path.sep))
  ))
];

await runPool(downloadTasks);

const publicBranches = branches.map(branch => ({
  id: branch.id,
  name: `حلويات السلطان العالمية - ${branch.branchName}`,
  branchName: branch.branchName,
  branchGroup: "alsultan",
  category: "حلويات",
  image: `/assets/photos/alsultan/branches/${branch.coverFile}`,
  coverImage: `/assets/photos/alsultan/branches/${branch.coverFile}`,
  logoImage: "/assets/photos/alsultan/logo-arabic.png",
  logo: "س",
  rating: 0,
  reviews: 0,
  newStore: true,
  delivery: 30,
  minOrder: 150,
  time: branch.distance > 20 ? "60 - 90 دقيقة" : branch.distance > 10 ? "45 - 70 دقيقة" : "30 - 50 دقيقة",
  distance: branch.distance,
  location: branch.location,
  mapUrl: branch.mapUrl,
  open: true,
  featured: branch.featured,
  hasOffer: false,
  offer: "",
  description: `فرع ${branch.branchName} من حلويات السلطان العالمية، يقدم الحلويات الشرقية والتركية والنواشف والهدايا والقهوة ومنتجات السلطان الأصلية.`,
  address: branch.address,
  phone: branch.phone,
  website: "https://alsultansweets.com",
  sourceUrl: "https://alsultansweets.com/shop/",
  hours: "يرجى تأكيد أوقات العمل مباشرة عبر واتساب الفرع",
  areas: [branch.branchName, "إسطنبول", "مناطق التوصيل حسب المسافة"],
  fulfillment: "توصيل واستلام من الفرع",
  subscription: "احترافي",
  orderCount: 0,
  sourceBranded: true
}));

const cleanCatalog = productCatalog.map(({ imageRemote, ...product }) => product);
const dataFile = `// Generated from the official Al Sultan Sweets store on ${new Date().toISOString().slice(0, 10)}.\n`
  + `const alsultanBranches = ${JSON.stringify(publicBranches, null, 2)};\n\n`
  + `const alsultanProductCatalog = ${JSON.stringify(cleanCatalog, null, 2)};\n\n`
  + `const alsultanProducts = alsultanBranches.flatMap((store, branchIndex) => alsultanProductCatalog.map((product, productIndex) => ({\n`
  + `  ...product,\n`
  + `  id: 600001 + (branchIndex * 1000) + productIndex,\n`
  + `  storeId: store.id\n`
  + `})));\n\n`
  + `const alsultanDeliverySettings = Object.fromEntries(alsultanBranches.map(store => [store.id, {\n`
  + `  mode: "distance",\n`
  + `  fixedFee: store.delivery,\n`
  + `  ratePerKm: 15,\n`
  + `  prepMinutes: 25,\n`
  + `  maxRoundTripKm: 120\n`
  + `}]));\n`;

await writeFile(path.join(rootDir, "alsultan-data.js"), dataFile, "utf8");
console.log(`Synced ${branches.length} branches and ${productCatalog.length} products.`);
