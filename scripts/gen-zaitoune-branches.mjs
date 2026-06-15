import fs from 'fs';
import vm from 'vm';

// Load existing zaitoune data (store + catalog) without losing any product field.
const ctx = {};
vm.runInNewContext(fs.readFileSync('zaitoune-data.js', 'utf8') + ';this.S=zaitouneStore;this.C=zaitouneProductCatalog;', ctx);
const base = ctx.S;
const catalog = ctx.C;

const coords = JSON.parse(fs.readFileSync('zaitoune-branches.json', 'utf8'));
// area label per branch in link order (matches zaitoune-branches.json). #8 kept as the
// distinct name the owner gave ("زيتونة أوغلو") since its area (بهجة ليفلر) collides with branch 12.
const areaLabels = ["بيليك دوزو","باشاك شهير","كاياشهير","أفجلار","فندق زاده","فلوريا","الفاتح","زيتونة أوغلو"];

const BRAND = "حلويات زيتونة";
// Existing store 12 becomes the Bahçelievler branch of the group.
const home = { ...base, name: `${BRAND} - بهجة ليفلر`, branchName: "بهجة ليفلر", branchGroup: "zaitoune" };

const branches = coords.map((c, i) => {
  const area = areaLabels[i];
  return {
    id: 35 + i,
    name: `${BRAND} - ${area}`,
    branchName: area,
    branchGroup: "zaitoune",
    category: base.category,
    image: base.image,
    coverImage: base.coverImage,
    logoImage: base.logoImage,
    logo: base.logo,
    rating: 0, reviews: 0,
    newStore: true,
    delivery: base.delivery,
    minOrder: base.minOrder,
    time: base.time,
    distance: base.distance,
    location: { lat: c.lat, lng: c.lng },
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`,
    open: true,
    featured: false,
    hasOffer: base.hasOffer,
    offer: base.offer,
    description: base.description,
    address: `${area}، إسطنبول، تركيا`,
    phone: base.phone,
    whatsapp: base.whatsapp,
    email: base.email || "",
    website: base.website,
    sourceUrl: base.sourceUrl,
    hours: base.hours,
    areas: [area, "إسطنبول", "مناطق التوصيل حسب المسافة"],
    fulfillment: base.fulfillment,
    subscription: base.subscription,
    orderCount: 0,
    officialStore: true,
  };
});

const j = o => JSON.stringify(o, null, 2);
const file = `// حلويات زيتونة — 9 فروع في إسطنبول تشترك في نفس المنتجات. الفرع الأساسي (بهجة ليفلر)
// هو المتجر 12؛ الفروع الجديدة (35..42) تشترك في نفس \`zaitouneProductCatalog\`.
// branchGroup = "zaitoune" يربط الفروع؛ اسم المنطقة بعد " - " في الاسم يُشتق منه branchName.
const zaitouneStore = ${j(home)};

const zaitouneBranches = ${j(branches)};

const zaitouneProductCatalog = ${j(catalog)};

// نفس المنتجات لكل الفروع: المتجر 12 يحتفظ بكتلته (12001+)، والفروع الجديدة كتلة 1200001+.
const zaitouneProducts = [
  ...zaitouneProductCatalog.map((product, index) => ({ ...product, id: 12001 + index, storeId: zaitouneStore.id })),
  ...zaitouneBranches.flatMap((branch, branchIndex) =>
    zaitouneProductCatalog.map((product, productIndex) => ({
      ...product,
      id: 1200001 + branchIndex * 1000 + productIndex,
      storeId: branch.id,
    }))
  ),
];

const zaitouneDeliverySettings = Object.fromEntries(
  [zaitouneStore, ...zaitouneBranches].map(s => [s.id, { mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 100 }])
);
`;

fs.writeFileSync('zaitoune-data.js', file);
console.log('Wrote zaitoune-data.js: 1 home branch (12) +', branches.length, 'new branches (35..42),', catalog.length, 'products each =', catalog.length * (branches.length + 1), 'total product rows');
