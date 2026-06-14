const stores = [
  {
    id: 1,
    name: "سوق البركة",
    category: "سوبر ماركت",
    image: "/assets/photos/store-market.jpg",
    logo: "ب",
    rating: 4.9,
    reviews: 286,
    delivery: 25,
    minOrder: 150,
    time: "30 - 45 دقيقة",
    distance: 1.2,
    location: { lat: 41.0183, lng: 28.9495 },
    open: true,
    featured: true,
    hasOffer: true,
    offer: "خصم 15% على الخضار",
    description: "سوبر ماركت متكامل يوفر احتياجات البيت اليومية ومنتجات طازجة مختارة بعناية.",
    address: "شارع وطن، حي الفاتح، إسطنبول",
    phone: "+90 555 123 45 67",
    hours: "يومياً من 08:00 صباحاً حتى 11:00 مساءً",
    areas: ["الفاتح", "إسطنبول المركز", "أكسراي"],
    fulfillment: "توصيل واستلام"
  },
  {
    id: 2,
    name: "حلويات الشام",
    category: "حلويات",
    image: "/assets/photos/store-bakery.jpg",
    logo: "ش",
    rating: 4.8,
    reviews: 194,
    delivery: 20,
    minOrder: 120,
    time: "25 - 40 دقيقة",
    distance: 2.1,
    location: { lat: 41.0217, lng: 28.9378 },
    open: true,
    featured: true,
    hasOffer: true,
    offer: "توصيل مجاني فوق 500 ل.ت",
    description: "حلويات شرقية طازجة تُحضّر يومياً بمكونات أصيلة ووصفات شامية محبوبة.",
    address: "شارع فوزي باشا، حي الفاتح، إسطنبول",
    phone: "+90 555 234 56 78",
    hours: "يومياً من 09:00 صباحاً حتى 12:00 ليلاً",
    areas: ["الفاتح", "بلاط", "أكسراي"],
    fulfillment: "توصيل واستلام"
  },
  {
    id: 3,
    name: "ملحمة الأمانة",
    category: "ملاحم",
    image: "/assets/photos/store-butcher.jpg",
    logo: "أ",
    rating: 4.7,
    reviews: 152,
    delivery: 35,
    minOrder: 250,
    time: "40 - 55 دقيقة",
    distance: 2.8,
    location: { lat: 41.0258, lng: 28.9528 },
    open: true,
    featured: false,
    hasOffer: false,
    offer: "",
    description: "لحوم طازجة يومياً مع خيارات تقطيع وتجهيز حسب الطلب وتغليف صحي محكم.",
    address: "شارع هرقلي، حي الفاتح، إسطنبول",
    phone: "+90 555 345 67 89",
    hours: "السبت - الخميس من 08:00 صباحاً حتى 09:30 مساءً",
    areas: ["الفاتح", "أيوب", "زيتون بورنو"],
    fulfillment: "توصيل واستلام"
  },
  {
    id: 4,
    name: "بيت البهارات",
    category: "مكسرات وبهارات",
    image: "/assets/photos/store-spices.jpg",
    logo: "ب",
    rating: 4.6,
    reviews: 98,
    delivery: 15,
    minOrder: 100,
    time: "25 - 35 دقيقة",
    distance: 1.7,
    location: { lat: 41.0124, lng: 28.957 },
    open: false,
    featured: true,
    hasOffer: true,
    offer: "اشترِ كيلو واحصل على 250غ هدية",
    description: "تشكيلة واسعة من المكسرات الطازجة والبهارات المطحونة يومياً والقهوة المختصة.",
    address: "سوق مالطا، حي الفاتح، إسطنبول",
    phone: "+90 555 456 78 90",
    hours: "يومياً من 10:00 صباحاً حتى 08:00 مساءً",
    areas: ["الفاتح", "أكسراي"],
    fulfillment: "استلام وتوصيل"
  },
  {
    id: 5,
    name: "ملحمة الهلال",
    category: "ملحمة ومشاوي",
    image: "/assets/photos/heelal/cover.png",
    coverImage: "/assets/photos/heelal/cover.png",
    logoImage: "/assets/photos/heelal/logo-color.png",
    logo: "ه",
    rating: 0,
    reviews: 0,
    newStore: true,
    delivery: 40,
    minOrder: 250,
    time: "45 - 75 دقيقة",
    distance: 24,
    location: { lat: 41.041292, lng: 28.685044 },
    open: true,
    featured: true,
    hasOffer: false,
    offer: "",
    description: "ملحمة الهلال في إسنيورت تقدم لحوم الخاروف والعجل والدجاج الطازجة، إلى جانب المشاوي والتواصي والتجهيزات الجاهزة.",
    address: "سليمانية محلسي، طلعة جامع بلال الحبشي، جانب بازار الأربعاء المغطى، No 93 A، إسنيورت، إسطنبول",
    phone: "+90 538 864 97 55",
    email: "heelal00@gmail.com",
    website: "https://alheelal-meat.com",
    sourceUrl: "https://alheelal-meat.com/product",
    hours: "الطلب والتواصل متاحان عبر واتساب على مدار الساعة",
    areas: ["إسنيورت", "سليمانية محلسي", "مناطق إسطنبول حسب المسافة"],
    fulfillment: "توصيل واستلام وطلب مسبق",
    subscription: "احترافي",
    orderCount: 0
  }
];

stores.push(...alsultanBranches, zaitouneStore, ezzedineStore, sallouraStore, nourStore, tihamaStore, afganStore, samStore, kadyStore, yemenchefStore, alwadiStore, kadibyStore, azalStore);

const products = [
  {
    id: 101,
    storeId: 1,
    name: "طماطم بلدية طازجة",
    image: "/assets/photos/product-tomatoes.jpg",
    price: 38,
    oldPrice: 45,
    unit: "الكيلو",
    category: "خضار وفواكه",
    available: true,
    featured: true,
    description: "طماطم بلدية حمراء، منتقاة يومياً من السوق ومناسبة للسلطة والطبخ.",
    options: [{ name: "الوزن", values: ["كيلو", "نصف كيلو", "2 كيلو"], extra: [0, -19, 38] }]
  },
  {
    id: 102,
    storeId: 1,
    name: "سلة خضار الأسبوع",
    image: "/assets/photos/product-vegetable-basket.jpg",
    price: 279,
    oldPrice: 325,
    unit: "السلة",
    category: "عروض",
    available: true,
    featured: true,
    description: "سلة متنوعة تكفي عائلة صغيرة لأسبوع، تشمل 8 أصناف موسمية.",
    options: [{ name: "الحجم", values: ["صغيرة", "عائلية"], extra: [0, 160] }]
  },
  {
    id: 103,
    storeId: 1,
    name: "زيت زيتون بكر",
    image: "/assets/photos/product-olive-oil.jpg",
    price: 245,
    oldPrice: null,
    unit: "1 لتر",
    category: "زيوت",
    available: true,
    featured: false,
    description: "زيت زيتون بكر ممتاز بعصرة أولى ونكهة متوازنة.",
    options: []
  },
  {
    id: 201,
    storeId: 2,
    name: "بقلاوة فستق حلبي",
    image: "/assets/photos/product-baklava.jpg",
    price: 420,
    oldPrice: 480,
    unit: "الكيلو",
    category: "حلويات شرقية",
    available: true,
    featured: true,
    description: "بقلاوة هشة محشوة بالفستق الحلبي الفاخر ومحلاة باعتدال.",
    options: [
      { name: "الوزن", values: ["كيلو", "نصف كيلو"], extra: [0, -210] },
      { name: "التغليف", values: ["عادي", "علبة هدية"], extra: [0, 35] }
    ]
  },
  {
    id: 202,
    storeId: 2,
    name: "معمول مشكل فاخر",
    image: "/assets/photos/product-cookies.jpg",
    price: 260,
    oldPrice: null,
    unit: "الكيلو",
    category: "معمول",
    available: true,
    featured: false,
    description: "معمول هش بتشكيلة تمر وفستق وجوز، محضر بالسمن العربي.",
    options: [{ name: "الحشوة", values: ["مشكل", "تمر", "فستق"], extra: [0, -25, 45] }]
  },
  {
    id: 301,
    storeId: 3,
    name: "لحم غنم طازج",
    image: "/assets/photos/product-meat.jpg",
    price: 690,
    oldPrice: null,
    unit: "الكيلو",
    category: "لحوم حمراء",
    available: true,
    featured: true,
    description: "لحم غنم طازج مختار بعناية مع تجهيز مجاني حسب رغبتك.",
    options: [
      { name: "التقطيع", values: ["قطع وسط", "قطع صغيرة", "مفروم"], extra: [0, 0, 15] },
      { name: "الكمية", values: ["كيلو", "نصف كيلو"], extra: [0, -345] }
    ]
  },
  {
    id: 302,
    storeId: 3,
    name: "كفتة جاهزة للشواء",
    image: "/assets/photos/product-kofta.jpg",
    price: 460,
    oldPrice: 510,
    unit: "الكيلو",
    category: "تجهيزات",
    available: true,
    featured: false,
    description: "خلطة كفتة متبلة باعتدال وجاهزة للشواء مباشرة.",
    options: [{ name: "التتبيل", values: ["عادي", "حار", "بدون بصل"], extra: [0, 0, 0] }]
  },
  {
    id: 401,
    storeId: 4,
    name: "مكسرات مشكلة محمصة",
    image: "/assets/photos/product-nuts.jpg",
    price: 390,
    oldPrice: 450,
    unit: "الكيلو",
    category: "مكسرات",
    available: true,
    featured: true,
    description: "تشكيلة كاجو ولوز وفستق وبندق محمصة يومياً.",
    options: [
      { name: "الوزن", values: ["كيلو", "نصف كيلو"], extra: [0, -195] },
      { name: "التحميص", values: ["محمص مملح", "محمص بدون ملح", "ني"], extra: [0, 0, -20] }
    ]
  },
  {
    id: 402,
    storeId: 4,
    name: "بهارات مشكلة للطبخ",
    image: "/assets/photos/product-spices.jpg",
    price: 95,
    oldPrice: null,
    unit: "250 غ",
    category: "بهارات",
    available: false,
    featured: false,
    description: "خلطة متوازنة من سبع بهارات مطحونة حديثاً.",
    options: [{ name: "الطحن", values: ["ناعم", "خشن"], extra: [0, 0] }]
  }
];

products.push(...heelalProducts);
products.push(...alsultanProducts);
products.push(...zaitouneProducts);
products.push(...ezzedineProducts);
products.push(...sallouraProducts);
products.push(...nourProducts);
products.push(...tihamaProducts);
products.push(...afganProducts);
products.push(...samProducts);
products.push(...kadyProducts);
products.push(...yemenchefProducts);
products.push(...alwadiProducts);
products.push(...kadibyProducts);
products.push(...azalProducts);

// Keep the bundled fallback catalog in sync with the cloud: drop unavailable
// or image-less products. Filtering in place preserves the remaining ids.
for (let i = products.length - 1; i >= 0; i--) {
  const p = products[i];
  if (p.available === false || !p.image) products.splice(i, 1);
}

const initialOrders = [
  { id: "DK-1048", customer: "محمود درويش", storeId: 1, total: 486, status: "طلب جديد", time: "منذ 4 دقائق", items: 4 },
  { id: "DK-1047", customer: "سارة خليل", storeId: 2, total: 720, status: "قيد التجهيز", time: "منذ 18 دقيقة", items: 3 },
  { id: "DK-1046", customer: "عمر الحسن", storeId: 1, total: 324, status: "بانتظار الدفع", time: "منذ 31 دقيقة", items: 5 },
  { id: "DK-1045", customer: "ليلى أحمد", storeId: 3, total: 1065, status: "خرج للتوصيل", time: "منذ 48 دقيقة", items: 2 },
  { id: "DK-1044", customer: "يوسف علي", storeId: 1, total: 278, status: "مكتمل", time: "أمس، 08:40 م", items: 6 }
];

const customerOrders = [
  { id: "DK-1039", storeId: 1, date: "10 يونيو 2026", total: 486, status: "خرج للتوصيل", color: "blue", steps: 4, items: [{ productId: 101, quantity: 2 }, { productId: 103, quantity: 1 }] },
  { id: "DK-1022", storeId: 2, date: "28 مايو 2026", total: 720, status: "مكتمل", color: "green", steps: 5, items: [{ productId: 201, quantity: 1 }, { productId: 202, quantity: 1 }] },
  { id: "DK-0986", storeId: 3, date: "12 مايو 2026", total: 1065, status: "مكتمل", color: "green", steps: 5, items: [{ productId: 301, quantity: 1 }, { productId: 302, quantity: 1 }] }
];

const initialCustomerProfile = {
  name: "محمود درويش",
  phone: "+90 555 111 22 33",
  email: "mahmoud@example.com",
  notifications: true
};

const initialCustomerAddresses = [
  { id: 1, label: "المنزل", address: "شارع وطن، حي الفاتح، إسطنبول", details: "البناء 18، الطابق الثالث، شقة 7", lat: 41.0179, lng: 28.9477, isDefault: true },
  { id: 2, label: "العمل", address: "ميدان تقسيم، حي بيوغلو، إسطنبول", details: "مكتب 12، الطابق الثاني", lat: 41.0369, lng: 28.9851, isDefault: false }
];

const initialCustomerComplaints = [
  { id: "SH-143", subject: "تأخر وصول الطلب", orderId: "DK-1039", message: "تجاوز الطلب وقت التوصيل المتوقع وأرغب بمعرفة موقعه الحالي.", status: "قيد المتابعة", date: "11 يونيو 2026" }
];

const initialDeliverySettings = {
  1: { mode: "fixed", fixedFee: 25, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 60 },
  2: { mode: "distance", fixedFee: 20, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 80 },
  3: { mode: "fixed", fixedFee: 35, ratePerKm: 15, prepMinutes: 25, maxRoundTripKm: 60 },
  4: { mode: "fixed", fixedFee: 15, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 50 },
  5: { mode: "distance", fixedFee: 40, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 100 },
  ...alsultanDeliverySettings,
  ...zaitouneDeliverySettings,
  ...ezzedineDeliverySettings,
  ...sallouraDeliverySettings,
  ...nourDeliverySettings,
  ...tihamaDeliverySettings,
  ...afganDeliverySettings,
  ...samDeliverySettings,
  ...kadyDeliverySettings,
  ...yemenchefDeliverySettings,
  ...alwadiDeliverySettings,
  ...kadibyDeliverySettings,
  ...azalDeliverySettings
};

function loadCustomerAddresses() {
  const saved = JSON.parse(localStorage.getItem("dukkanci-addresses") || "null") || initialCustomerAddresses;
  return saved.map(address => {
    const fallback = initialCustomerAddresses.find(item => item.id === address.id);
    return { ...fallback, ...address };
  });
}

function loadDeliverySettings() {
  const saved = JSON.parse(localStorage.getItem("dukkanci-delivery-settings") || "{}");
  return Object.fromEntries(Object.entries(initialDeliverySettings).map(([storeId, settings]) => [
    storeId,
    { ...settings, ...(saved[storeId] || {}) }
  ]));
}

function loadStoreLocations() {
  const saved = JSON.parse(localStorage.getItem("dukkanci-store-locations") || "{}");
  return Object.fromEntries(stores.map(store => [
    store.id,
    { ...store.location, ...(saved[store.id] || {}) }
  ]));
}

const state = {
  route: "home",
  cart: JSON.parse(localStorage.getItem("dukkanci-cart") || "[]"),
  favorites: JSON.parse(localStorage.getItem("dukkanci-favorites") || "[]"),
  orders: JSON.parse(localStorage.getItem("dukkanci-orders") || "null") || initialOrders,
  storeFilter: "الكل",
  storeSort: "recommended",
  search: "",
  accountTab: "orders",
  customerProfile: JSON.parse(localStorage.getItem("dukkanci-profile") || "null") || initialCustomerProfile,
  customerAddresses: loadCustomerAddresses(),
  customerComplaints: JSON.parse(localStorage.getItem("dukkanci-complaints") || "null") || initialCustomerComplaints,
  deliverySettings: loadDeliverySettings(),
  storeLocations: loadStoreLocations(),
  storeProductFilter: "الكل",
  deliveryQuote: null,
  checkoutLocation: null,
  merchantTab: "overview",
  merchantStoreId: 1,
  merchantAuth: JSON.parse(localStorage.getItem("dukkanci-merchant-auth") || "null"),
  adminTab: "overview",
  deferredInstall: null
};

// Demo seller accounts (front-end only — for trying the merchant dashboard).
const MERCHANT_ACCOUNTS = [
  { username: "demo", password: "dukkanci2026", storeId: 1 },
  { username: "baraka", password: "baraka123", storeId: 1 }
];

const app = document.getElementById("app");
const cartDrawer = document.getElementById("cart-drawer");
const backdrop = document.getElementById("drawer-backdrop");
const modalRoot = document.getElementById("modal-root");

const iconPaths = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  pin: '<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  chevron: '<path d="m9 18 6-6-6-6"/>',
  logout: '<path d="M15 12H4m11 0-3-3m3 3-3 3"/><path d="M9 4h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9"/>',
  bag: '<path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
  whatsapp: '<path d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-4.5A8 8 0 1 1 20 11.5Z"/><path d="M8.5 8c.5 3 2.5 5 5.5 6l1.5-1.5"/>',
  facebook: '<path d="M14 8h4V3h-4c-3 0-5 2-5 5v3H6v5h3v6h5v-6h4l1-5h-5V8c0-.1 0 0 0 0Z"/>',
  download: '<path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/>',
  home: '<path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/>',
  store: '<path d="M4 10v11h16V10"/><path d="M3 10h18l-2-6H5l-2 6Z"/><path d="M8 21v-6h8v6M3 10c0 2 4 2 4 0 0 2 5 2 5 0 0 2 5 2 5 0 0 2 4 2 4 0"/>',
  receipt: '<path d="M6 3h12v19l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-5 4-7 8-7s7 2 8 7"/>',
  star: '<path d="m12 2 3 6 7 .9-5 4.8 1.3 6.8-6.3-3.3-6.3 3.3L7 13.7 2 8.9 9 8l3-6Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bike: '<circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="m6 17 4-7h4l4 7M9 7h3l2 3M5 10h5"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>',
  arrowLeft: '<path d="M19 12H5m0 0 6-6m-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7M10 11v6M14 11v6"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 11 6-4m-6 6 6 4"/>',
  map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2c-8.7-1-15.6-7.9-16.6-16.6A2 2 0 0 1 5.2 3h3a2 2 0 0 1 2 1.7c.1 1.1.4 2.1.7 3.1a2 2 0 0 1-.5 2.1L9.1 11a16 16 0 0 0 4 4l1.1-1.3a2 2 0 0 1 2.1-.5c1 .4 2 .6 3.1.7a2 2 0 0 1 1.6 2Z"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
  shield: '<path d="M12 2 4 5v6c0 5 3.4 9.6 8 11 4.6-1.4 8-6 8-11V5l-8-3Z"/><path d="m9 12 2 2 4-5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  box: '<path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="M4 7v10l8 4 8-4V7M12 11v10"/>',
  chart: '<path d="M4 20V10m6 10V4m6 16v-7m4 7H2"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2c0-2-1-3-3-4M16 3c2 .5 3 2 3 4s-1 3.5-3 4"/>',
  megaphone: '<path d="m3 11 15-6v14L3 13v-2Z"/><path d="M7 15v5h4v-4"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  wallet: '<path d="M4 6h14a2 2 0 0 1 2 2v11H4a2 2 0 0 1-2-2V6a3 3 0 0 1 3-3h12"/><path d="M15 11h7v5h-7a2.5 2.5 0 0 1 0-5Z"/>',
  upload: '<path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M4 20h16"/>',
  edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>'
};

function icon(name, className = "") {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.box}</svg>`;
}

function brandLogo(extraClass = "") {
  return `<span class="brand brand-inline ${extraClass}"><span class="brand-mark"><img src="/assets/dukkanci-mark.png" alt=""></span><span class="brand-wordmark"><strong>دكانجي</strong><small>سوق الحي بين يديك</small></span></span>`;
}

function money(value) {
  return `${Number(value).toLocaleString("ar-EG")} ل.ت`;
}

function dashboardDate() {
  return new Intl.DateTimeFormat("ar-EG", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
}

function getStore(id) {
  return stores.find(store => store.id === Number(id));
}

function getMerchantStore() {
  return getStore(state.merchantStoreId) || stores[0];
}

function getProduct(id) {
  return products.find(product => product.id === Number(id));
}

function saveState() {
  localStorage.setItem("dukkanci-cart", JSON.stringify(state.cart));
  localStorage.setItem("dukkanci-favorites", JSON.stringify(state.favorites));
  localStorage.setItem("dukkanci-orders", JSON.stringify(state.orders));
  localStorage.setItem("dukkanci-profile", JSON.stringify(state.customerProfile));
  localStorage.setItem("dukkanci-addresses", JSON.stringify(state.customerAddresses));
  localStorage.setItem("dukkanci-complaints", JSON.stringify(state.customerComplaints));
  localStorage.setItem("dukkanci-delivery-settings", JSON.stringify(state.deliverySettings));
  localStorage.setItem("dukkanci-store-locations", JSON.stringify(state.storeLocations));
}

// ---- Local persistence for merchant catalog changes (no backend needed) ----
const PRODUCT_OVERRIDES_KEY = "dukkanci-product-overrides";
const CUSTOM_PRODUCTS_KEY = "dukkanci-custom-products";

function loadJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function saveProductOverride(id, fields) {
  const all = loadJSON(PRODUCT_OVERRIDES_KEY, {});
  all[id] = { ...(all[id] || {}), ...fields };
  localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(all));
}
function saveCustomProduct(product) {
  const all = loadJSON(CUSTOM_PRODUCTS_KEY, []);
  const idx = all.findIndex(p => p.id === product.id);
  if (idx >= 0) all[idx] = product; else all.push(product);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(all));
}
function deleteProductLocal(id) {
  const numId = Number(id);
  const custom = loadJSON(CUSTOM_PRODUCTS_KEY, []).filter(p => p.id !== numId);
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(custom));
  const overrides = loadJSON(PRODUCT_OVERRIDES_KEY, {});
  delete overrides[numId];
  delete overrides[String(id)];
  localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(overrides));
}
function applyProductPersistence() {
  for (const p of loadJSON(CUSTOM_PRODUCTS_KEY, [])) {
    if (!products.some(x => x.id === p.id)) products.push(p);
  }
  const overrides = loadJSON(PRODUCT_OVERRIDES_KEY, {});
  for (const id of Object.keys(overrides)) {
    const p = products.find(x => x.id === Number(id));
    if (p) Object.assign(p, overrides[id]);
  }
}

// ---- Supabase cloud catalog (read + write) ----
function mapDbStore(r) {
  return {
    id: r.id, name: r.name, category: r.category, image: r.image, coverImage: r.cover_image,
    logoImage: r.logo_image, logo: r.logo, rating: r.rating, reviews: r.reviews, newStore: r.new_store,
    delivery: r.delivery, minOrder: r.min_order, time: r.time, distance: r.distance,
    location: (r.lat != null && r.lng != null) ? { lat: r.lat, lng: r.lng } : undefined, mapUrl: r.map_url,
    open: r.open, featured: r.featured, hasOffer: r.has_offer, offer: r.offer, priceOnRequest: r.price_on_request,
    description: r.description, address: r.address, phone: r.phone, whatsapp: r.whatsapp, email: r.email,
    website: r.website, sourceUrl: r.source_url, hours: r.hours, areas: r.areas, fulfillment: r.fulfillment,
    subscription: r.subscription, orderCount: r.order_count, officialStore: r.official_store,
    branchGroup: r.branch_group, brandTheme: r.brand_theme
  };
}
function mapDbProduct(r) {
  return {
    id: r.id, storeId: r.store_id, sourceId: r.source_id, name: r.name, image: r.image,
    price: Number(r.price), oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
    priceOnRequest: r.price_on_request, unit: r.unit, category: r.category, available: r.available,
    featured: r.featured, description: r.description, imageFit: r.image_fit, options: r.options || []
  };
}
function toDbProduct(p) {
  return {
    id: p.id, store_id: p.storeId, source_id: p.sourceId ?? null, name: p.name, image: p.image ?? null,
    price: p.price ?? 0, old_price: p.oldPrice ?? null, price_on_request: !!p.priceOnRequest,
    unit: p.unit ?? null, category: p.category ?? null, available: p.available !== false, featured: !!p.featured,
    description: p.description ?? null, image_fit: p.imageFit ?? null, options: p.options ?? []
  };
}
async function loadCatalogFromSupabase() {
  const sb = window.supabaseClient;
  if (!sb) return false;
  try {
    const { data: st, error: e1 } = await sb.from("stores").select("*");
    if (e1 || !st || !st.length) return false;
    let all = [], from = 0;
    for (;;) {
      const { data, error } = await sb.from("products").select("*").order("id").range(from, from + 999);
      if (error) return false;
      all = all.concat(data);
      if (data.length < 1000) break;
      from += 1000;
    }
    if (!all.length) return false;
    stores.length = 0; st.forEach(r => stores.push(mapDbStore(r)));
    products.length = 0; all.forEach(r => products.push(mapDbProduct(r)));
    console.info(`Supabase: loaded ${stores.length} stores, ${products.length} products`);
    return true;
  } catch (e) { console.warn("Supabase load failed:", e.message); return false; }
}
function pushProductCloud(product) {
  const sb = window.supabaseClient;
  if (sb) sb.from("products").upsert(toDbProduct(product), { onConflict: "id" }).then(({ error }) => { if (error) console.warn("product cloud save:", error.message); });
}
function toDbStore(s) {
  return {
    id: s.id, name: s.name, category: s.category, image: s.image, cover_image: s.coverImage,
    logo_image: s.logoImage, logo: s.logo, rating: s.rating, reviews: s.reviews, new_store: !!s.newStore,
    delivery: s.delivery, min_order: s.minOrder, time: s.time, distance: s.distance,
    lat: s.location?.lat ?? null, lng: s.location?.lng ?? null, map_url: s.mapUrl, open: s.open !== false,
    featured: !!s.featured, has_offer: !!s.hasOffer, offer: s.offer ?? null, price_on_request: !!s.priceOnRequest,
    description: s.description ?? null, address: s.address ?? null, phone: s.phone ?? null, whatsapp: s.whatsapp ?? null,
    email: s.email ?? null, website: s.website ?? null, source_url: s.sourceUrl ?? null, hours: s.hours ?? null,
    areas: s.areas ?? [], fulfillment: s.fulfillment ?? null, subscription: s.subscription ?? null,
    order_count: s.orderCount ?? 0, official_store: !!s.officialStore, branch_group: s.branchGroup ?? null, brand_theme: s.brandTheme ?? null
  };
}
function pushStoreCloud(store) {
  const sb = window.supabaseClient;
  if (sb) sb.from("stores").upsert(toDbStore(store), { onConflict: "id" }).then(({ error }) => { if (error) console.warn("store cloud save:", error.message); });
}
function deleteProductCloud(id) {
  const sb = window.supabaseClient;
  if (sb) sb.from("products").delete().eq("id", Number(id)).then(({ error }) => { if (error) console.warn("product delete:", error.message); });
}
function pushOrderCloud(order) {
  const sb = window.supabaseClient;
  if (sb) sb.from("orders").upsert({ id: order.id, store_id: order.storeId, customer: order.customer, total: order.total, status: order.status, time: order.time, items: order.items, delivery_details: order.deliveryDetails ?? null }, { onConflict: "id" }).then(({ error }) => { if (error) console.warn("order cloud save:", error.message); });
}
async function initCatalog() {
  await window.__supabaseReady;
  const ok = await loadCatalogFromSupabase();
  if (ok) render();
  else { applyProductPersistence(); render(); }
}

function getDeliverySettings(storeId) {
  return state.deliverySettings[Number(storeId)] || initialDeliverySettings[Number(storeId)];
}

function getStoreLocation(storeId) {
  return state.storeLocations[Number(storeId)] || getStore(storeId)?.location;
}

function getCheckoutAddress(addressId) {
  if (String(addressId) === "current") return state.checkoutLocation;
  return state.customerAddresses.find(address => String(address.id) === String(addressId));
}

function getDefaultAddress() {
  return state.customerAddresses.find(address => address.isDefault) || state.customerAddresses[0];
}

function haversineKm(origin, destination) {
  const toRadians = value => value * Math.PI / 180;
  const earthRadius = 6371;
  const deltaLat = toRadians(destination.lat - origin.lat);
  const deltaLng = toRadians(destination.lng - origin.lng);
  const a = Math.sin(deltaLat / 2) ** 2
    + Math.cos(toRadians(origin.lat)) * Math.cos(toRadians(destination.lat)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateDeliveryQuote(store, address) {
  const settings = getDeliverySettings(store.id);
  if (settings.mode !== "distance") {
    return {
      storeId: store.id,
      addressId: address?.id,
      fee: settings.fixedFee,
      provider: "fixed",
      estimatedMinutes: settings.prepMinutes,
      exceedsMaxDistance: false
    };
  }
  const origin = getStoreLocation(store.id);
  if (!origin?.lat || !origin?.lng || !address?.lat || !address?.lng) return null;
  const oneWayKm = Math.max(0.5, haversineKm(origin, address) * 1.28);
  const roundTripKm = oneWayKm * 2;
  const routeMinutes = Math.max(5, Math.ceil(oneWayKm / 28 * 60));
  return {
    storeId: store.id,
    addressId: address.id,
    oneWayKm,
    roundTripKm,
    routeMinutes,
    estimatedMinutes: settings.prepMinutes + routeMinutes,
    fee: Math.round(roundTripKm * settings.ratePerKm),
    ratePerKm: settings.ratePerKm,
    provider: "estimate",
    exceedsMaxDistance: roundTripKm > settings.maxRoundTripKm
  };
}

function activeDeliveryQuote(store, address) {
  const quote = state.deliveryQuote;
  if (quote && quote.storeId === store.id && String(quote.addressId) === String(address?.id)) return quote;
  return estimateDeliveryQuote(store, address);
}

function deliveryPriceLabel(store) {
  const settings = getDeliverySettings(store.id);
  return settings.mode === "distance" ? `حسب المسافة · ${money(settings.ratePerKm)}/كم` : money(settings.fixedFee);
}

function deliverySortValue(store) {
  return activeDeliveryQuote(store, getDefaultAddress())?.fee ?? Number.POSITIVE_INFINITY;
}

function formatDistance(value) {
  return `${Number(value || 0).toLocaleString("ar-EG", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} كم`;
}

function cartTotals(addressId = null) {
  const subtotal = state.cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const store = state.cart.length ? getStore(state.cart[0].storeId) : null;
  if (!store) return { subtotal, delivery: 0, total: subtotal, quote: null };
  const address = getCheckoutAddress(addressId) || getDefaultAddress();
  const quote = activeDeliveryQuote(store, address);
  const delivery = quote && !quote.exceedsMaxDistance ? quote.fee : 0;
  return { subtotal, delivery, total: subtotal + delivery, quote };
}

function updateCartBadges() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("mobile-cart-count").textContent = count;
}

function hydrateIcons(root = document) {
  root.querySelectorAll(".icon-slot[data-icon]").forEach(slot => {
    slot.innerHTML = icon(slot.dataset.icon);
  });
}

function storeAvatar(store, extraClass = "") {
  return `<span class="store-avatar ${extraClass} ${store.logoImage ? "store-avatar--logo" : ""} ${store.sourceBranded || store.officialStore ? "store-avatar--source-branded" : ""} ${store.brandTheme ? `store-avatar--${store.brandTheme}` : ""}"><img src="${store.logoImage || store.image}" alt="${store.name}"></span>`;
}

function categoryCard(name, image, caption) {
  return `
    <button class="category-card" data-action="category" data-category="${name}">
      <span class="category-card__icon"><img src="${image}" alt=""></span>
      <span><strong>${name}</strong><small>${caption}</small></span>
      ${icon("arrowLeft", "arrow")}
    </button>
  `;
}

function storeCard(store) {
  const isFavorite = state.favorites.includes(`store-${store.id}`);
  return `
    <article class="store-card ${store.sourceBranded ? "source-branded-store-card" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}` : ""}">
      <button class="store-card__image" data-action="open-store" data-id="${store.id}">
        <img src="${store.coverImage || store.image}" alt="${store.name}" loading="lazy">
        <span class="status-badge ${store.open ? "open" : "closed"}">${store.open ? "مفتوح" : "مغلق الآن"}</span>
        ${store.branchGroup === "alsultan" ? `<span class="official-branch-badge">${icon("shield")} فرع رسمي</span>` : store.officialStore ? `<span class="official-branch-badge ${store.brandTheme || ""}">${icon("shield")} متجر رسمي</span>` : ""}
        ${store.hasOffer ? `<span class="offer-ribbon">${store.offer}</span>` : ""}
      </button>
      <button class="favorite-button ${isFavorite ? "active" : ""}" data-action="favorite" data-key="store-${store.id}" aria-label="إضافة للمفضلة">
        ${icon("heart")}
      </button>
      <div class="store-card__body">
        <button class="store-title-row" data-action="open-store" data-id="${store.id}">
          ${storeAvatar(store)}
          <span><strong>${store.name}</strong><small>${store.category}</small></span>
        </button>
        <div class="store-rating">
          ${store.newStore ? `${icon("store")} <strong>متجر جديد</strong><span>موثق البيانات</span>` : `${icon("star")} <strong>${store.rating}</strong><span>(${store.reviews} تقييم)</span>`}
        </div>
        <div class="store-meta">
          <span>${icon("clock")} ${store.time}</span>
          <span>${icon("bike")} ${deliveryPriceLabel(store)}</span>
        </div>
      </div>
    </article>
  `;
}

function waOrderLink(product) {
  const store = getStore(product.storeId);
  const num = (store.whatsapp || store.phone || "").replace(/\D/g, "");
  const text = encodeURIComponent(`مرحباً ${store.name}، أرغب بالاستفسار عن سعر وتوفّر: ${product.name}`);
  return `https://wa.me/${num}?text=${text}`;
}

function productCard(product) {
  const isFavorite = state.favorites.includes(`product-${product.id}`);
  return `
    <article class="product-card ${product.storeId === 5 || (product.sourceBranded && product.imageFit !== "cover") ? "source-branded" : ""} ${!product.available ? "unavailable" : ""}">
      <button class="product-card__image" data-action="open-product" data-id="${product.id}">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        ${product.oldPrice ? `<span class="discount-chip">وفر ${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ""}
        ${!product.available ? `<span class="soldout-overlay">غير متوفر</span>` : ""}
      </button>
      <button class="favorite-button product-favorite ${isFavorite ? "active" : ""}" data-action="favorite" data-key="product-${product.id}">
        ${icon("heart")}
      </button>
      <div class="product-card__body">
        <small>${product.category}</small>
        <button class="product-name" data-action="open-product" data-id="${product.id}">${product.name}</button>
        ${product.priceOnRequest ? `
        <div class="price-row price-row--request">
          <span class="price-request">السعر عند الطلب</span>
          <a class="quick-add quick-add--wa" href="${waOrderLink(product)}" target="_blank" rel="noopener" aria-label="اطلب عبر واتساب">${icon("whatsapp")}</a>
        </div>` : `
        <div class="price-row">
          <div><strong>${money(product.price)}</strong>${product.unit ? `<span>/ ${product.unit}</span>` : ""}${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
          <button class="quick-add" data-action="quick-add" data-id="${product.id}" ${!product.available ? "disabled" : ""}>${icon("plus")}</button>
        </div>`}
      </div>
    </article>
  `;
}

function renderHome() {
  const featuredStores = stores.filter(store => store.featured);
  const offerProducts = products.filter(product => product.oldPrice && product.available).slice(0, 4);
  return `
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__content">
          <span class="eyebrow"><span></span> كل ما تحتاجه من دكاكين حيك</span>
          <h1>سوق الحي<br><em>بين يديك</em></h1>
          <p>اطلب خضارك الطازجة، حلوياتك المفضلة واحتياجات البيت من متاجر تعرفها وتثق بها.</p>
          <div class="hero-search">
            ${icon("search")}
            <input id="hero-search" type="search" placeholder="ابحث عن منتج أو متجر..." value="${state.search}">
            <button data-action="run-search">ابحث</button>
          </div>
          <div class="hero-trust">
            <span>${icon("shield")} متاجر موثوقة</span>
            <span>${icon("clock")} توصيل سريع</span>
            <span>${icon("phone")} متابعة عبر واتساب</span>
          </div>
        </div>
        <div class="hero__visual">
          <div class="hero-blob"></div>
          <img src="/assets/photos/hero-market.jpg" alt="متجر حي مليء بالخضار والمنتجات الطازجة">
          <div class="floating-card floating-card--rating">
            <span class="floating-icon">${icon("star")}</span>
            <span><strong>4.9</strong><small>تقييم المتاجر</small></span>
          </div>
          <div class="floating-card floating-card--delivery">
            <span class="floating-icon">${icon("bike")}</span>
            <span><strong>وصل طلبك!</strong><small>بكل سرعة وأمان</small></span>
          </div>
        </div>
      </div>
      <div class="hero-pattern"></div>
    </section>

    <section class="section categories-section">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">تسوّق حسب رغبتك</span><h2>ماذا تحتاج اليوم؟</h2></div>
          <a href="#stores" data-route="stores">عرض كل المتاجر ${icon("arrowLeft")}</a>
        </div>
        <div class="category-grid">
          ${categoryCard("سوبر ماركت", "/assets/photos/store-market.jpg", "كل احتياجات البيت")}
          ${categoryCard("مطاعم", "/assets/photos/store-restaurant.jpg", "ألذ الأطباق إلى بابك")}
          ${categoryCard("ملاحم", "/assets/photos/store-butcher.jpg", "لحوم طازجة يومياً")}
          ${categoryCard("حلويات", "/assets/photos/store-bakery.jpg", "لأحلى المناسبات")}
          ${categoryCard("مكسرات وبهارات", "/assets/photos/store-spices.jpg", "نكهات من كل مكان")}
        </div>
      </div>
    </section>

    <section class="section featured-section">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">اختيارات يحبها الجيران</span><h2>متاجر مميزة بالقرب منك</h2></div>
          <a href="#stores" data-route="stores">استكشف الكل ${icon("arrowLeft")}</a>
        </div>
        <div class="store-grid">${featuredStores.map(storeCard).join("")}</div>
      </div>
    </section>

    <section class="section offers-section">
      <div class="container">
        <div class="offers-banner">
          <div class="offers-banner__copy">
            <span class="eyebrow light"><span></span> عروض لا تفوّت</span>
            <h2>وفّر أكثر على<br>طلباتك اليومية</h2>
            <p>خصومات مختارة من متاجر الحي، تتجدد باستمرار.</p>
            <a href="#offers" data-route="offers" class="light-button">شاهد كل العروض ${icon("arrowLeft")}</a>
          </div>
          <div class="offer-products">
            ${offerProducts.slice(0, 2).map(product => `
              <button class="mini-offer-card" data-action="open-product" data-id="${product.id}">
                <img src="${product.image}" alt="${product.name}">
                <span><small>عرض اليوم</small><strong>${product.name}</strong><b>${money(product.price)}</b></span>
              </button>
            `).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="section steps-section">
      <div class="container">
        <div class="section-heading centered">
          <div><span class="section-kicker">بسيطة وواضحة</span><h2>طلبك في ثلاث خطوات</h2></div>
        </div>
        <div class="steps-grid">
          <article><span class="step-number">١</span><div class="step-icon">${icon("store")}</div><h3>اختر متجرك</h3><p>تصفح المتاجر الموثوقة القريبة منك واختر ما يناسبك.</p></article>
          <article><span class="step-number">٢</span><div class="step-icon">${icon("bag")}</div><h3>جهّز سلتك</h3><p>أضف المنتجات وحدد الكميات وخيارات التجهيز بسهولة.</p></article>
          <article><span class="step-number">٣</span><div class="step-icon">${icon("bike")}</div><h3>استلم طلبك</h3><p>تابع حالة الطلب عبر واتساب حتى يصل إلى بابك.</p></article>
        </div>
      </div>
    </section>

    <section class="section merchant-cta-section">
      <div class="container">
        <div class="merchant-cta">
          <div class="merchant-cta__art">
            <div class="shop-mini">${icon("store")}</div>
            <span class="dot dot--one"></span><span class="dot dot--two"></span>
          </div>
          <div class="merchant-cta__copy">
            <span>لأصحاب المتاجر</span>
            <h2>كبّر دكانك ووصل لعملاء أكثر</h2>
            <p>انضم إلى دكانجي، اعرض منتجاتك واستقبل الطلبات وأدر متجرك من لوحة واحدة.</p>
          </div>
          <button class="primary-button dark" data-action="join-merchant">انضم كتاجر ${icon("arrowLeft")}</button>
        </div>
      </div>
    </section>
  `;
}

function normalizeAr(value) {
  return (value || "")
    .toString()
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ـ/g, "")
    .replace(/[ً-ْ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getMatchingProducts(query, limit = 60) {
  const q = normalizeAr(query);
  if (!q) return [];
  const terms = q.split(" ").filter(Boolean);
  const out = [];
  for (const product of products) {
    if (product.available === false) continue;
    const hay = normalizeAr(`${product.name} ${product.category} ${getStore(product.storeId)?.name || ""}`);
    if (terms.every(t => hay.includes(t))) {
      out.push(product);
      if (out.length >= limit) break;
    }
  }
  return out;
}

function getFilteredStores() {
  const q = normalizeAr(state.search);
  const terms = q.split(" ").filter(Boolean);
  let result = stores.filter(store => {
    const categoryMatch = state.storeFilter === "الكل"
      || store.category === state.storeFilter
      || (state.storeFilter === "ملاحم" && store.category.includes("ملحم"));
    const text = normalizeAr(`${store.name} ${store.category} ${store.description}`);
    return categoryMatch && terms.every(t => text.includes(t));
  });

  if (state.storeSort === "rating") result.sort((a, b) => b.rating - a.rating);
  if (state.storeSort === "delivery") result.sort((a, b) => deliverySortValue(a) - deliverySortValue(b));
  if (state.storeSort === "distance") result.sort((a, b) => a.distance - b.distance);
  if (state.storeSort === "open") result.sort((a, b) => Number(b.open) - Number(a.open));
  if (state.storeSort === "offers") result.sort((a, b) => Number(b.hasOffer) - Number(a.hasOffer));
  return result;
}

function renderStores() {
  const result = getFilteredStores();
  const categories = ["الكل", "مطاعم", "سوبر ماركت", "ملاحم", "حلويات", "مكسرات وبهارات"];
  return `
    <section class="page-hero compact">
      <div class="container">
        <span class="section-kicker">اكتشف محلات حيك</span>
        <h1>المتاجر القريبة منك</h1>
        <p>متاجر محلية موثوقة ومنتجات تعرفها، تصل إلى بابك.</p>
        <div class="listing-search">
          ${icon("search")}
          <input id="stores-search" type="search" placeholder="ابحث باسم متجر أو تصنيف..." value="${state.search}">
          <button data-action="run-store-search">بحث</button>
        </div>
      </div>
    </section>
    <section class="section listing-section">
      <div class="container">
        <div class="listing-toolbar">
          <div class="filter-pills">
            ${categories.map(category => `<button class="${state.storeFilter === category ? "active" : ""}" data-action="store-filter" data-category="${category}">${category}</button>`).join("")}
          </div>
          <label class="sort-select">
            ${icon("filter")}
            <select id="store-sort" aria-label="ترتيب المتاجر">
              <option value="recommended" ${state.storeSort === "recommended" ? "selected" : ""}>الأنسب لك</option>
              <option value="rating" ${state.storeSort === "rating" ? "selected" : ""}>الأعلى تقييماً</option>
              <option value="open" ${state.storeSort === "open" ? "selected" : ""}>المفتوح حالياً</option>
              <option value="offers" ${state.storeSort === "offers" ? "selected" : ""}>لديه عروض</option>
              <option value="delivery" ${state.storeSort === "delivery" ? "selected" : ""}>رسوم توصيل أقل</option>
              <option value="distance" ${state.storeSort === "distance" ? "selected" : ""}>الأقرب</option>
            </select>
          </label>
        </div>
        ${state.search ? (() => {
          const matched = getMatchingProducts(state.search);
          return `
        <div class="result-summary"><strong>${matched.length}${matched.length >= 60 ? "+" : ""} منتج</strong><span>نتائج البحث عن «${state.search}»</span></div>
        ${matched.length ? `<div class="product-grid">${matched.map(productCard).join("")}</div>` : renderEmpty("لا توجد منتجات مطابقة", "جرّب كلمة أخرى مثل اسم المنتج أو الصنف.")}
        <div class="result-summary" style="margin-top:32px"><strong>${result.length} متجر</strong><span>مطابق لبحثك</span></div>
        ${result.length ? `<div class="store-grid">${result.map(storeCard).join("")}</div>` : ""}`;
        })() : `
        <div class="result-summary"><strong>${result.length} متاجر</strong><span>ضمن منطقة التوصيل الحالية</span></div>
        ${result.length ? `<div class="store-grid">${result.map(storeCard).join("")}</div>` : renderEmpty("لا توجد متاجر مطابقة", "جرّب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً.")}`}
      </div>
    </section>
  `;
}

function renderOffers() {
  const offerProducts = products.filter(product => product.oldPrice && product.available);
  return `
    <section class="page-hero offers-page-hero">
      <div class="container offers-page-grid">
        <div><span class="eyebrow light"><span></span> وفر على كل طلب</span><h1>عروض دكانجي</h1><p>أفضل عروض متاجر الحي، مجموعة في مكان واحد وتتجدد باستمرار.</p></div>
        <div class="big-percent">%</div>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="section-heading"><div><span class="section-kicker">لفترة محدودة</span><h2>خصومات اليوم</h2></div><span class="count-chip">${offerProducts.length} عروض متاحة</span></div>
        <div class="product-grid">${offerProducts.map(productCard).join("")}</div>
        <div class="delivery-offer">
          <span class="delivery-offer__icon">${icon("bike")}</span>
          <div><span>عرض خاص</span><h3>توصيل مجاني من حلويات الشام</h3><p>للطلبات التي تزيد قيمتها عن 500 ليرة تركية.</p></div>
          <button class="primary-button" data-action="open-store" data-id="2">تسوق الآن ${icon("arrowLeft")}</button>
        </div>
      </div>
    </section>
  `;
}

function renderStorePage(id) {
  const store = getStore(id);
  if (!store) return renderNotFound();
  const siblingBranches = store.branchGroup
    ? stores.filter(branch => branch.branchGroup === store.branchGroup)
    : [];
  const allStoreProducts = products.filter(product => product.storeId === store.id);
  const productCategories = [...new Set(allStoreProducts.map(product => product.category))];
  const activeProductFilter = productCategories.includes(state.storeProductFilter) ? state.storeProductFilter : "الكل";
  const storeProducts = activeProductFilter === "الكل"
    ? allStoreProducts
    : allStoreProducts.filter(product => product.category === activeProductFilter);
  const deliverySettings = getDeliverySettings(store.id);
  const defaultQuote = activeDeliveryQuote(store, getDefaultAddress());
  return `
    <section class="store-page-head">
      <div class="container">
        <div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><a href="#stores" data-route="stores">المتاجر</a><span>/</span><strong>${store.name}</strong></div>
        <div class="store-cover ${store.sourceBranded ? "source-branded-store-cover" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}-cover` : ""}">
          <img src="${store.coverImage || store.image}" alt="${store.name}">
          <div class="store-cover__gradient"></div>
          <span class="status-badge large ${store.open ? "open" : "closed"}">${store.open ? "مفتوح ويستقبل الطلبات" : "مغلق حالياً"}</span>
          ${store.branchGroup === "alsultan" ? `<span class="official-branch-badge large">${icon("shield")} فرع رسمي موثق</span>` : store.officialStore ? `<span class="official-branch-badge large ${store.brandTheme || ""}">${icon("shield")} متجر رسمي موثق</span>` : ""}
        </div>
        <div class="store-profile">
          <div class="store-profile__main">
            ${storeAvatar(store, "large")}
            <div>
              <span class="store-category">${store.category}${store.branchName ? ` · فرع ${store.branchName}` : ""}</span>
              <h1>${store.name}</h1>
              <p>${store.description}</p>
              <div class="store-profile__meta">
                <span>${store.newStore ? `${icon("check")} <b>متجر جديد موثق</b>` : `${icon("star")} <b>${store.rating}</b> (${store.reviews} تقييم)`}</span>
                <span>${icon("clock")} ${store.time}</span>
                <span>${icon("bike")} توصيل ${deliveryPriceLabel(store)}</span>
                <span>${icon("pin")} ${store.distance} كم</span>
              </div>
            </div>
          </div>
          <div class="store-profile__actions">
            <button class="secondary-button" data-action="share-store" data-id="${store.id}">${icon("share")} مشاركة</button>
            <button class="secondary-button" data-action="favorite" data-key="store-${store.id}">${icon("heart")} حفظ</button>
          </div>
        </div>
      </div>
    </section>
    <section class="section store-content-section">
      <div class="container store-content-grid">
        <div>
          ${siblingBranches.length > 1 ? `
            <section class="branch-switcher">
              <div>
                <span class="section-kicker">اختر أقرب فرع</span>
                <h2>فروع ${store.name.split(" - ")[0]} في إسطنبول</h2>
              </div>
              <div class="branch-switcher__list">
                ${siblingBranches.map(branch => `
                  <button class="${branch.id === store.id ? "active" : ""}" data-action="open-store" data-id="${branch.id}">
                    <img src="${branch.coverImage || branch.image}" alt="">
                    <span><strong>${branch.branchName}</strong><small>${branch.phone}</small></span>
                    ${branch.id === store.id ? `<b>${icon("check")} الفرع الحالي</b>` : icon("arrowLeft")}
                  </button>
                `).join("")}
              </div>
            </section>
          ` : ""}
          ${deliverySettings.mode === "distance" ? `
            <div class="distance-delivery-banner">
              <span>${icon("map")}</span>
              <div>
                <strong>توصيل محسوب تلقائياً حسب موقعك</strong>
                <p>المسافة ذهاباً وإياباً × ${money(deliverySettings.ratePerKm)} لكل كيلومتر.</p>
              </div>
              ${defaultQuote ? `<b>${formatDistance(defaultQuote.roundTripKm)} · ${money(defaultQuote.fee)}</b>` : '<b>حدد موقعك لإظهار السعر</b>'}
            </div>
          ` : ""}
          ${store.hasOffer ? `<div class="store-offer-strip">${icon("megaphone")} <div><strong>${store.offer}</strong><span>العرض متاح لفترة محدودة</span></div><button data-action="scroll-products">تسوّق العرض</button></div>` : ""}
          <div class="section-heading small"><div><span class="section-kicker">من ${store.name}</span><h2 id="store-products">المنتجات</h2></div><span class="count-chip">${storeProducts.length} من ${allStoreProducts.length} منتجاً</span></div>
          ${productCategories.length > 1 ? `<div class="store-product-filters">${["الكل", ...productCategories].map(category => `<button class="${activeProductFilter === category ? "active" : ""}" data-action="product-category" data-category="${category}">${category}<span>${category === "الكل" ? allStoreProducts.length : allStoreProducts.filter(product => product.category === category).length}</span></button>`).join("")}</div>` : ""}
          <div class="product-grid store-products-grid">${storeProducts.map(productCard).join("")}</div>
          ${store.newStore ? `
          <section class="reviews-block new-store-review">
            <span>${icon("star")}</span>
            <div><span class="section-kicker">جديد على دكانجي</span><h2>كن أول من يقيّم ${store.name}</h2><p>تمت إضافة بيانات المتجر ومنتجاته من موقعه الرسمي، وستظهر تقييمات عملاء دكانجي بعد اكتمال الطلبات.</p></div>
          </section>
          ` : `<section class="reviews-block">
            <div class="section-heading small"><div><span class="section-kicker">تجارب العملاء</span><h2>التقييمات والتعليقات</h2></div></div>
            <div class="rating-summary">
              <div class="rating-big"><strong>${store.rating}</strong><span>${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span><small>من ${store.reviews} تقييم</small></div>
              <div class="rating-bars">
                ${[5, 4, 3, 2, 1].map((n, index) => `<div><span>${n}</span><span class="bar"><i style="width:${[82, 13, 4, 1, 0][index]}%"></i></span><small>${[82, 13, 4, 1, 0][index]}%</small></div>`).join("")}
              </div>
            </div>
            <div class="review-list">
              <article><div><span class="avatar-mini">س</span><strong>سارة خليل</strong><small>منذ 3 أيام</small></div><span class="review-stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span><p>الطلب وصل مرتب والمنتجات طازجة، والتواصل كان ممتازاً. سأكرر الطلب بالتأكيد.</p></article>
              <article><div><span class="avatar-mini">م</span><strong>محمد ياسين</strong><small>منذ أسبوع</small></div><span class="review-stars">${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span><p>أسعار واضحة وتغليف جيد جداً، ووصل الطلب ضمن الوقت المحدد.</p></article>
            </div>
          </section>`}
        </div>
        <aside class="store-info-card">
          <h3>معلومات المتجر</h3>
          <div class="info-row">${icon("pin")}<div><strong>العنوان</strong><span>${store.address}</span><button data-action="map">عرض على الخريطة</button></div></div>
          <div class="info-row">${icon("clock")}<div><strong>أوقات العمل</strong><span>${store.hours}</span></div></div>
          <div class="info-row">${icon("phone")}<div><strong>التواصل</strong><span dir="ltr">${store.phone}</span></div></div>
          ${store.email ? `<div class="info-row">${icon("user")}<div><strong>البريد الإلكتروني</strong><span dir="ltr">${store.email}</span></div></div>` : ""}
          <div class="info-row">${icon("bike")}<div><strong>مناطق الخدمة</strong><span>${store.areas.join("، ")}</span></div></div>
          <div class="info-row">${icon("bag")}<div><strong>طرق الاستلام</strong><span>${store.fulfillment}</span></div></div>
          ${store.website ? `<div class="official-source-note">${icon("shield")}<span><strong>بيانات موثقة</strong><small>الصور والأسعار مستوردة من الموقع الرسمي للمتجر.</small><a href="${store.sourceUrl || store.website}" target="_blank" rel="noopener">زيارة المصدر الرسمي</a></span></div>` : ""}
          <div class="store-minimum"><span>الحد الأدنى للطلب</span><strong>${money(store.minOrder)}</strong></div>
          <button class="whatsapp-button" data-action="whatsapp-store" data-id="${store.id}">${icon("whatsapp")} تواصل عبر واتساب</button>
        </aside>
      </div>
    </section>
  `;
}

function renderOrders() {
  const tabs = {
    orders: { title: "طلباتي", description: "تابع طلباتك الحالية وارجع إلى مشترياتك السابقة.", content: renderCustomerOrders },
    profile: { title: "بياناتي", description: "حدّث بيانات التواصل وإعدادات إشعارات حسابك.", content: renderCustomerProfile },
    addresses: { title: "عناويني", description: "أدر عناوين التوصيل واختر عنوانك الافتراضي.", content: renderCustomerAddresses },
    favorites: { title: "المفضلة", description: "ارجع بسرعة إلى المتاجر والمنتجات التي حفظتها.", content: renderCustomerFavorites },
    complaints: { title: "الشكاوى", description: "أرسل ملاحظة وتابع رد فريق الدعم عليها.", content: renderCustomerComplaints }
  };
  const current = tabs[state.accountTab] || tabs.orders;
  return `
    <section class="page-hero compact account-hero"><div class="container"><span class="section-kicker">أهلاً ${state.customerProfile.name.split(" ")[0]}</span><h1>${current.title}</h1><p>${current.description}</p></div></section>
    <section class="section">
      <div class="container account-layout">
        ${renderAccountMenu()}
        <div class="account-content">${current.content()}</div>
      </div>
    </section>
  `;
}

function renderAccountMenu() {
  const items = [
    ["orders", "receipt", "طلباتي"],
    ["profile", "user", "بياناتي"],
    ["addresses", "pin", "عناويني"],
    ["favorites", "heart", "المفضلة"],
    ["complaints", "megaphone", "الشكاوى"]
  ];
  return `<aside class="account-menu">${items.map(([key, iconName, label]) => `<button class="${state.accountTab === key ? "active" : ""}" data-action="account-tab" data-tab="${key}">${icon(iconName)} ${label}</button>`).join("")}</aside>`;
}

function renderCustomerOrders() {
  return `<div class="order-list">
    ${customerOrders.map(order => {
      const store = getStore(order.storeId);
      return `<article class="customer-order">
        <div class="customer-order__top">
          <div>${storeAvatar(store)}<span><strong>${store.name}</strong><small>طلب رقم ${order.id} · ${order.date}</small></span></div>
          <span class="status-pill ${order.color}">${order.status}</span>
        </div>
        ${order.steps < 5 ? `<div class="tracking-steps">
          ${["تم استلام الطلب", "تم التأكيد", "قيد التجهيز", "خرج للتوصيل", "تم التوصيل"].map((step, index) => `<div class="${index < order.steps ? "done" : ""}"><span>${index < order.steps ? icon("check") : ""}</span><small>${step}</small></div>`).join("")}
        </div>` : ""}
        <div class="customer-order__bottom"><strong>${money(order.total)}</strong><div><button class="text-button" data-action="customer-order-details" data-id="${order.id}">${icon("eye")} عرض التفاصيل</button><button class="secondary-button compact" data-action="reorder" data-id="${order.id}">${icon("bag")} إعادة الطلب</button></div></div>
      </article>`;
    }).join("")}
  </div>`;
}

function renderCustomerProfile() {
  const profile = state.customerProfile;
  return `
    <section class="account-card">
      <div class="account-card__heading"><span class="account-card__icon">${icon("user")}</span><div><h2>البيانات الشخصية</h2><p>تُستخدم هذه البيانات لتأكيد الطلبات والتواصل معك.</p></div></div>
      <form id="customer-profile-form" class="account-form">
        <label><span>الاسم الكامل</span><input name="name" value="${profile.name}" required></label>
        <label><span>رقم واتساب</span><input name="phone" value="${profile.phone}" dir="ltr" required></label>
        <label class="wide"><span>البريد الإلكتروني</span><input name="email" type="email" value="${profile.email}" dir="ltr" required></label>
        <label class="notification-setting wide"><input name="notifications" type="checkbox" ${profile.notifications ? "checked" : ""}><span></span><div><strong>إشعارات حالة الطلب</strong><small>استلام تحديثات الطلبات والعروض المهمة.</small></div></label>
        <div class="account-form__actions wide"><button type="reset" class="secondary-button">إلغاء التغييرات</button><button type="submit" class="primary-button">${icon("check")} حفظ البيانات</button></div>
      </form>
    </section>
  `;
}

function renderCustomerAddresses() {
  return `
    <div class="account-toolbar"><div><h2>عناوين التوصيل</h2><p>${state.customerAddresses.length} عناوين محفوظة</p></div><button class="primary-button compact" data-action="add-address">${icon("plus")} إضافة عنوان</button></div>
    <div class="address-grid">
      ${state.customerAddresses.map(address => `
        <article class="address-card ${address.isDefault ? "default" : ""}">
          <div class="address-card__top"><span class="address-icon">${icon(address.label === "العمل" ? "store" : "home")}</span><div><strong>${address.label}</strong>${address.isDefault ? '<small>العنوان الافتراضي</small>' : ""}</div></div>
          <p>${address.address}</p><small>${address.details}</small>
          <span class="address-location-status ${address.lat && address.lng ? "ready" : ""}">${icon("pin")} ${address.lat && address.lng ? "الموقع محدد لحساب التوصيل" : "يلزم تحديد الموقع لحساب المسافة"}</span>
          <div class="address-card__actions">
            ${address.isDefault ? "" : `<button class="text-button" data-action="default-address" data-id="${address.id}">${icon("check")} جعله افتراضيًا</button>`}
            <button class="table-action" data-action="edit-address" data-id="${address.id}" aria-label="تعديل">${icon("edit")}</button>
            <button class="table-action danger" data-action="delete-address" data-id="${address.id}" aria-label="حذف">${icon("trash")}</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderCustomerFavorites() {
  const favoriteStores = stores.filter(store => state.favorites.includes(`store-${store.id}`));
  const favoriteProducts = products.filter(product => state.favorites.includes(`product-${product.id}`));
  if (!favoriteStores.length && !favoriteProducts.length) {
    return `<div class="account-card">${renderEmpty("لا توجد عناصر مفضلة بعد", "احفظ المتاجر والمنتجات التي تحبها لتجدها هنا بسرعة.", "استكشف المتاجر", "stores")}</div>`;
  }
  return `
    ${favoriteStores.length ? `<section class="favorite-section"><div class="account-toolbar"><div><h2>المتاجر المحفوظة</h2><p>${favoriteStores.length} متاجر</p></div></div><div class="account-favorite-grid">${favoriteStores.map(store => `
      <article class="account-favorite-card"><img src="${store.logoImage || store.image}" alt="${store.name}"><div><small>${store.category}</small><strong>${store.name}</strong><span>${store.newStore ? `${icon("check")} متجر جديد موثق` : `${icon("star")} ${store.rating}`} · ${store.time}</span></div><button class="secondary-button compact" data-action="open-store" data-id="${store.id}">عرض المتجر</button><button class="remove-favorite" data-action="remove-account-favorite" data-key="store-${store.id}" aria-label="إزالة">${icon("trash")}</button></article>`).join("")}</div></section>` : ""}
    ${favoriteProducts.length ? `<section class="favorite-section"><div class="account-toolbar"><div><h2>المنتجات المحفوظة</h2><p>${favoriteProducts.length} منتجات</p></div></div><div class="account-favorite-grid">${favoriteProducts.map(product => `
      <article class="account-favorite-card"><img src="${product.image}" alt="${product.name}"><div><small>${getStore(product.storeId).name}</small><strong>${product.name}</strong><span>${money(product.price)} / ${product.unit}</span></div><button class="primary-button compact" data-action="quick-add" data-id="${product.id}">${icon("plus")} أضف للسلة</button><button class="remove-favorite" data-action="remove-account-favorite" data-key="product-${product.id}" aria-label="إزالة">${icon("trash")}</button></article>`).join("")}</div></section>` : ""}
  `;
}

function renderCustomerComplaints() {
  return `
    <section class="account-card complaint-compose">
      <div class="account-card__heading"><span class="account-card__icon">${icon("megaphone")}</span><div><h2>إرسال شكوى أو ملاحظة</h2><p>سنراجع رسالتك ونجيبك داخل هذا القسم.</p></div></div>
      <form id="customer-complaint-form" class="account-form">
        <label><span>الطلب المرتبط</span><select name="orderId"><option value="">شكوى عامة</option>${customerOrders.map(order => `<option value="${order.id}">${order.id} · ${getStore(order.storeId).name}</option>`).join("")}</select></label>
        <label><span>عنوان الشكوى</span><input name="subject" required placeholder="اكتب عنوانًا مختصرًا"></label>
        <label class="wide"><span>التفاصيل</span><textarea name="message" required placeholder="اشرح ما حدث وكيف يمكننا مساعدتك..."></textarea></label>
        <div class="account-form__actions wide"><button class="primary-button" type="submit">${icon("megaphone")} إرسال الشكوى</button></div>
      </form>
    </section>
    <section class="complaint-history"><div class="account-toolbar"><div><h2>الشكاوى السابقة</h2><p>${state.customerComplaints.length} رسائل</p></div></div>
      <div class="customer-complaint-list">${state.customerComplaints.map(complaint => `
        <article><span class="complaint-icon">${icon("megaphone")}</span><div><strong>${complaint.subject}</strong><small>${complaint.id} · ${complaint.orderId || "شكوى عامة"} · ${complaint.date}</small></div><span class="status-pill ${complaint.status === "تم الحل" ? "green" : "orange"}">${complaint.status}</span><div class="complaint-actions"><button class="secondary-button compact" data-action="complaint-details" data-id="${complaint.id}">عرض التفاصيل</button><button class="table-action danger" data-action="delete-complaint" data-id="${complaint.id}" aria-label="حذف">${icon("trash")}</button></div></article>
      `).join("")}</div>
    </section>
  `;
}

function dashboardSidebar(type, active) {
  const merchantStore = type === "merchant" ? getMerchantStore() : null;
  const merchantOrderCount = merchantStore
    ? state.orders.filter(order => order.storeId === merchantStore.id).length
    : 0;
  const merchantItems = [
    ["overview", "chart", "نظرة عامة"],
    ["orders", "receipt", "الطلبات"],
    ["products", "box", "المنتجات"],
    ["offers", "megaphone", "العروض"],
    ["store", "store", "بيانات المتجر"],
    ["integrations", "settings", "التكاملات"],
    ["subscription", "wallet", "الاشتراك"]
  ];
  const adminItems = [
    ["overview", "chart", "نظرة عامة"],
    ["stores", "store", "المتاجر"],
    ["customers", "users", "العملاء"],
    ["orders", "receipt", "الطلبات"],
    ["complaints", "megaphone", "الشكاوى"],
    ["content", "settings", "المحتوى"]
  ];
  const items = type === "merchant" ? merchantItems : adminItems;
  return `
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">${brandLogo("brand-on-dark")}<span>${type === "merchant" ? "لوحة المتجر" : "لوحة الإدارة"}</span></div>
      <nav>${items.map(([key, iconName, label]) => `<button class="${active === key ? "active" : ""}" data-action="${type}-tab" data-tab="${key}">${icon(iconName)}<span>${label}</span>${key === "orders" ? `<b class="nav-badge">${type === "merchant" ? merchantOrderCount : 3}</b>` : ""}</button>`).join("")}</nav>
      <div class="dashboard-user">
        <span class="avatar-mini dashboard-photo"><img src="${merchantStore ? merchantStore.logoImage || merchantStore.image : "/assets/dukkanci-mark.png"}" alt=""></span>
        <span><strong>${merchantStore ? merchantStore.name : "إدارة دكانجي"}</strong><small>${merchantStore ? `الخطة ${merchantStore.subscription || "الاحترافية"}` : "مدير النظام"}</small></span>
        ${icon("dots")}
      </div>
    </aside>
  `;
}

function statCard(iconName, label, value, trend, tone) {
  return `<article class="stat-card ${tone}"><span class="stat-icon ${tone}">${icon(iconName)}</span><div><small>${label}</small><strong>${value}</strong><span class="trend">${trend}</span></div></article>`;
}

function merchantOverview() {
  const store = getMerchantStore();
  const merchantOrders = state.orders.filter(order => order.storeId === store.id);
  const storeProducts = products.filter(product => product.storeId === store.id);
  const availableCount = storeProducts.filter(product => product.available !== false).length;
  const offersCount = storeProducts.filter(product => product.oldPrice).length;
  const revenue = merchantOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const openOrders = merchantOrders.filter(order => !["مكتمل", "ملغى", "مرفوضة"].includes(order.status)).length;
  const ratingLabel = store.newStore ? "جديد" : String(store.rating);
  const ratingTrend = store.newStore ? "بانتظار أول تقييم" : `من ${store.reviews} تقييماً`;
  return `
    <div class="stats-grid">
      ${statCard("receipt", "طلبات المتجر", merchantOrders.length.toLocaleString("ar"), openOrders ? `${openOrders.toLocaleString("ar")} طلب يحتاج متابعتك` : "لا طلبات قيد التنفيذ", "green")}
      ${statCard("wallet", "إجمالي قيمة الطلبات", `${revenue.toLocaleString("ar")} ل.ت`, merchantOrders.length ? `من ${merchantOrders.length.toLocaleString("ar")} طلب` : "لا توجد طلبات بعد", "orange")}
      ${statCard("box", "منتجات المتجر", storeProducts.length.toLocaleString("ar"), `${availableCount.toLocaleString("ar")} متوفر · ${offersCount.toLocaleString("ar")} عليه عرض`, "blue")}
      ${statCard("star", "متوسط التقييم", ratingLabel, ratingTrend, "yellow")}
    </div>
    <div class="dashboard-grid">
      <section class="dashboard-card chart-card">
        <div class="card-heading"><div><h3>أداء الطلبات</h3><p>آخر 7 أيام</p></div><button class="outline-select">هذا الأسبوع ${icon("chevron")}</button></div>
        <div class="chart-wrap">
          <div class="chart-y"><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div>
          <div class="bar-chart">${[11, 16, 13, 19, 15, 20, 17].map((height, index) => `<div><span style="height:${height * 7}px"></span><small>${["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][index]}</small></div>`).join("")}</div>
        </div>
      </section>
      <section class="dashboard-card subscription-card">
        <div class="card-heading"><div><h3>حالة الاشتراك</h3><p>الخطة الحالية</p></div><span class="status-pill green">نشط</span></div>
        <div class="plan-name"><span>${icon("star")}</span><div><strong>الخطة الاحترافية</strong><small>حتى 30 يوليو 2026</small></div></div>
        <div class="progress-line"><span style="width:62%"></span></div>
        <div class="days-left"><span>متبقي</span><strong>48 يوماً</strong></div>
        <button class="primary-button full" data-action="merchant-tab" data-tab="subscription">إدارة الاشتراك</button>
      </section>
    </div>
    <section class="dashboard-card orders-table-card">
      <div class="card-heading"><div><h3>أحدث الطلبات</h3><p>الطلبات التي تحتاج متابعتك</p></div><button class="text-button" data-action="merchant-tab" data-tab="orders">عرض كل الطلبات ${icon("arrowLeft")}</button></div>
      ${renderOrdersTable(merchantOrders.slice(0, 4), "merchant")}
    </section>
  `;
}

function renderOrdersTable(orders, context) {
  return `
    <div class="table-wrap">
      <table>
        <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>الوقت</th><th></th></tr></thead>
        <tbody>${orders.map(order => `
          <tr>
            <td><strong>${order.id}</strong></td><td>${order.customer}</td><td>${order.items} منتجات</td><td><strong>${money(order.total)}</strong></td>
            <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td><td>${order.time}</td>
            <td><button class="table-action" data-action="${context === "merchant" ? "manage-order" : "view-order"}" data-id="${order.id}">${icon("dots")}</button></td>
          </tr>`).join("")}</tbody>
      </table>
    </div>
  `;
}

function statusClass(status) {
  if (["مكتمل", "تم القبول", "جاهز للاستلام"].includes(status)) return "green";
  if (["طلب جديد", "بانتظار الدفع"].includes(status)) return "orange";
  if (["خرج للتوصيل", "قيد التجهيز"].includes(status)) return "blue";
  if (["ملغى", "مرفوضة"].includes(status)) return "red";
  return "gray";
}

function merchantOrders() {
  const storeOrders = state.orders.filter(order => order.storeId === getMerchantStore().id);
  const activeFilter = state.merchantOrderFilter || "الكل";
  const tabs = ["الكل", "طلب جديد", "بانتظار الدفع", "قيد التجهيز", "خرج للتوصيل", "مكتمل"];
  const filtered = activeFilter === "الكل" ? storeOrders : storeOrders.filter(order => order.status === activeFilter);
  return `
    <div class="dashboard-toolbar">
      <div class="dashboard-search">${icon("search")}<input id="merchant-order-search" placeholder="ابحث برقم الطلب أو اسم العميل" value="${escAttr(state.merchantOrderSearch || "")}"></div>
      <div class="toolbar-actions"><button class="secondary-button compact" data-action="export-csv" data-kind="orders">${icon("download")} تصدير</button></div>
    </div>
    <div class="order-status-tabs">${tabs.map(status => {
      const count = status === "الكل" ? storeOrders.length : storeOrders.filter(o => o.status === status).length;
      return `<button class="${status === activeFilter ? "active" : ""}" data-action="merchant-order-filter" data-status="${escAttr(status)}">${status}${count ? `<b>${count.toLocaleString("ar")}</b>` : ""}</button>`;
    }).join("")}</div>
    <section class="dashboard-card orders-table-card">${filtered.length ? renderOrdersTable(filtered, "merchant") : `<div class="empty-managed">${icon("receipt")}<p>لا طلبات ${activeFilter === "الكل" ? "بعد" : `بحالة "${activeFilter}"`}</p></div>`}</section>
  `;
}

function merchantProducts() {
  const allStoreProducts = products.filter(product => product.storeId === getMerchantStore().id);
  const query = (state.merchantProductSearch || "").trim();
  const normQuery = normalizeAr(query);
  const merchantProducts = normQuery
    ? allStoreProducts.filter(product => normalizeAr(`${product.name} ${product.category}`).includes(normQuery))
    : allStoreProducts;
  const rows = merchantProducts.map(product => `
        <article>
          <img src="${product.image}" alt="${escAttr(product.name)}" loading="lazy">
          <div class="managed-product-name"><strong>${product.name}</strong><small>${product.category} · ${product.unit}</small></div>
          <strong>${money(product.price)}${product.oldPrice ? ` <s class="managed-old-price">${money(product.oldPrice)}</s>` : ""}</strong>
          <label class="toggle"><input type="checkbox" ${product.available !== false ? "checked" : ""} data-action="toggle-product" data-id="${product.id}"><span></span><small>${product.available !== false ? "متوفر" : "غير متوفر"}</small></label>
          <span class="status-pill ${product.oldPrice ? "orange" : "gray"}">${product.oldPrice ? "عرض" : "عادي"}</span>
          <div class="managed-product-actions">
            <button class="table-action" data-action="edit-product" data-id="${product.id}" title="تعديل">${icon("edit")}</button>
            <button class="table-action danger" data-action="delete-product" data-id="${product.id}" title="حذف">${icon("trash")}</button>
          </div>
        </article>
      `).join("");
  return `
    <div class="dashboard-toolbar">
      <div class="dashboard-search">${icon("search")}<input id="merchant-product-search" placeholder="ابحث في منتجاتك" value="${escAttr(query)}"></div>
      <div class="toolbar-actions"><span class="toolbar-count">${merchantProducts.length.toLocaleString("ar")} منتج</span><button class="primary-button compact" data-action="add-product-form">${icon("plus")} منتج جديد</button></div>
    </div>
    <section class="dashboard-card product-management">
      ${rows || `<div class="empty-managed">${icon("box")}<p>${query ? "لا منتجات مطابقة لبحثك" : "لا توجد منتجات بعد. ابدأ بإضافة أول منتج."}</p></div>`}
    </section>
  `;
}

function merchantOffers() {
  const store = getMerchantStore();
  const discountedProducts = products.filter(product => product.storeId === store.id && product.oldPrice);
  return `
    <div class="empty-dashboard">
      <span class="empty-dashboard__icon">${icon("megaphone")}</span>
      <h3>${discountedProducts.length ? `عروض ${store.name}` : "أنشئ عرضاً جديداً لعملائك"}</h3>
      <p>حدد منتجاً وخصماً أو فعّل التوصيل المجاني فوق مبلغ معين.</p>
      <button class="primary-button" data-action="create-offer">${icon("plus")} إنشاء عرض</button>
    </div>
    ${discountedProducts.length ? `<div class="offer-management-grid">${discountedProducts.map(product => `
      <article class="dashboard-card"><span class="status-pill green">فعّال</span><h3>${product.name}</h3><p>السعر قبل الخصم ${money(product.oldPrice)} · الآن ${money(product.price)}</p><div><strong>${Math.round((1 - product.price / product.oldPrice) * 100)}%</strong><small>خصم</small></div><div class="offer-card-actions"><button class="secondary-button compact" data-action="edit-product" data-id="${product.id}">${icon("edit")} تعديل</button><button class="table-action danger" data-action="end-offer" data-id="${product.id}" title="إنهاء العرض">${icon("trash")}</button></div></article>
    `).join("")}</div>` : ""}
  `;
}

function merchantStore() {
  const store = getMerchantStore();
  const deliverySettings = getDeliverySettings(store.id);
  const storeLocation = getStoreLocation(store.id);
  return `
    <form class="dashboard-card form-card" id="merchant-store-form" data-store-id="${store.id}">
      <div class="card-heading"><div><h3>بيانات المتجر</h3><p>المعلومات الظاهرة للعملاء في صفحة متجرك</p></div>
        <label class="delivery-toggle"><input type="checkbox" name="storeOpen" ${store.open !== false ? "checked" : ""}><span></span><b>${store.open !== false ? "المتجر مفتوح" : "المتجر مغلق"}</b></label>
      </div>
      <div class="cover-uploader"><img src="${store.coverImage || store.image}" alt=""></div>
      <div class="form-grid">
        <label><span>اسم المتجر</span><input name="storeName" required value="${escAttr(store.name || "")}"></label>
        <label><span>التصنيف</span><select name="category">${[...new Set([store.category, ...stores.map(s => s.category)])].filter(Boolean).map(c => `<option ${c === store.category ? "selected" : ""}>${c}</option>`).join("")}</select></label>
        <label class="wide"><span>وصف قصير</span><textarea name="description">${escAttr(store.description || "")}</textarea></label>
        <label class="wide"><span>رابط صورة الواجهة</span><input name="coverImage" dir="ltr" placeholder="/assets/... أو https://..." value="${escAttr(store.coverImage || store.image || "")}"></label>
        <label class="wide"><span>العنوان</span><input name="address" value="${escAttr(store.address || "")}"></label>
        <label><span>رقم واتساب الطلبات</span><input name="phone" dir="ltr" value="${escAttr(store.phone || "")}"></label>
        <label><span>أوقات العمل</span><input name="hours" value="${escAttr(store.hours || "")}"></label>
        <label><span>رسوم التوصيل الثابتة</span><input name="fixedFee" type="number" min="0" value="${deliverySettings.fixedFee}"></label>
        <label><span>الحد الأدنى للطلب (ل.ت)</span><input name="minOrder" type="number" min="0" value="${Number(store.minOrder) || 0}"></label>
      </div>
      <section class="merchant-delivery-settings">
        <div class="merchant-delivery-settings__heading">
          <span class="merchant-delivery-settings__icon">${icon("map")}</span>
          <div><h3>التوصيل التلقائي حسب المسافة</h3><p>يُحسب سعر الطريق من المتجر إلى العميل ذهاباً وإياباً، بينما يظهر للعميل زمن الوصول في اتجاه واحد.</p></div>
          <label class="delivery-toggle"><input type="checkbox" name="distanceEnabled" ${deliverySettings.mode === "distance" ? "checked" : ""}><span></span><b>${deliverySettings.mode === "distance" ? "مفعّل" : "غير مفعّل"}</b></label>
        </div>
        <div class="distance-settings-fields ${deliverySettings.mode === "distance" ? "active" : ""}">
          <label><span>سعر الكيلومتر ذهاباً وإياباً</span><div class="input-with-unit"><input name="ratePerKm" type="number" min="10" max="20" step="1" value="${deliverySettings.ratePerKm}"><b>ل.ت / كم</b></div><small>القيمة المسموحة من 10 إلى 20 ليرة.</small></label>
          <label><span>مدة تجهيز الطلب</span><div class="input-with-unit"><input name="prepMinutes" type="number" min="5" max="120" step="5" value="${deliverySettings.prepMinutes}"><b>دقيقة</b></div></label>
          <label><span>أقصى مسافة ذهاباً وإياباً</span><div class="input-with-unit"><input name="maxRoundTripKm" type="number" min="5" max="200" value="${deliverySettings.maxRoundTripKm}"><b>كم</b></div></label>
          <div class="delivery-formula-preview"><small>مثال مباشر</small><strong><span id="delivery-example-distance">20</span> كم × <span id="delivery-example-rate">${deliverySettings.ratePerKm}</span> ل.ت = <b id="delivery-example-total">${20 * deliverySettings.ratePerKm} ل.ت</b></strong></div>
        </div>
        <div class="store-location-fields">
          <div><strong>${icon("pin")} موقع المتجر</strong><small>يُحفظ الموقع كنقطة بداية لجميع حسابات التوصيل.</small></div>
          <label><span>خط العرض</span><input name="storeLat" type="number" step="any" required value="${storeLocation.lat}"></label>
          <label><span>خط الطول</span><input name="storeLng" type="number" step="any" required value="${storeLocation.lng}"></label>
          <button type="button" class="secondary-button compact" data-action="capture-store-location">${icon("pin")} استخدام موقعي الحالي</button>
        </div>
        <p class="maps-integration-note">${icon("shield")} يتم إرسال الإحداثيات من الخادم إلى Google Routes API عند توفر مفتاح الخدمة، ولا يظهر المفتاح داخل الموقع.</p>
      </section>
      <div class="form-actions"><button class="primary-button" type="submit">${icon("check")} حفظ التغييرات</button></div>
    </form>
  `;
}

function merchantSubscription() {
  return `
    <div class="subscription-hero dashboard-card">
      <div><span class="status-pill green">اشتراك نشط</span><h2>الخطة الاحترافية</h2><p>كل الأدوات التي تحتاجها لتنمية متجرك واستقبال طلبات بلا حدود.</p></div>
      <div class="subscription-price"><strong>499</strong><span>ل.ت / شهرياً</span></div>
    </div>
    <div class="subscription-details">
      <section class="dashboard-card"><h3>تفاصيل الاشتراك</h3><div class="detail-list"><span><small>تاريخ البداية</small><strong>30 مايو 2026</strong></span><span><small>تاريخ الانتهاء</small><strong>30 يوليو 2026</strong></span><span><small>التجديد</small><strong>يدوي</strong></span><span><small>طريقة الدفع</small><strong>iyzico</strong></span></div><button class="primary-button full" data-action="toast" data-message="سيتم ربط الدفع عبر iyzico عند إضافة مفاتيح الحساب">تجديد الاشتراك</button></section>
      <section class="dashboard-card"><h3>مزايا خطتك</h3><ul class="feature-list"><li>${icon("check")} استقبال طلبات غير محدودة</li><li>${icon("check")} رفع المنتجات عبر CSV</li><li>${icon("check")} عروض وخصومات</li><li>${icon("check")} تقارير شهرية عبر واتساب</li><li>${icon("check")} ظهور مميز في نتائج البحث</li></ul></section>
    </div>
  `;
}

function merchantIntegrations() {
  const I = window.DUKKANCI_INTEGRATIONS;
  const s = (I && I.settings) || {};
  const get = k => (s[k] && s[k].setting_value) || "";
  const on = k => !!(s[k] && s[k].is_enabled);
  const field = (key, label, ph) => `
    <div class="integration-field">
      <label class="input-label"><span>${label}</span><input name="${key}" value="${escAttr(get(key))}" placeholder="${ph || ""}" dir="ltr"></label>
      <label class="form-check"><input type="checkbox" name="${key}__on" ${on(key) ? "checked" : ""}><span>تفعيل</span></label>
    </div>`;
  return `
    <form id="merchant-integrations-form">
      <section class="dashboard-card form-card">
        <h3>${icon("megaphone")} وسائل التواصل والإعلانات</h3>
        <div class="form-grid">
          ${field("meta_pixel_id", "Meta Pixel ID", "123456789012345")}
          ${field("meta_capi_token", "Meta CAPI Token", "EAAB...")}
          ${field("meta_test_event_code", "Meta Test Event Code", "TEST12345")}
          ${field("tiktok_pixel_id", "TikTok Pixel ID", "Cxxxxxxxxxxxx")}
          ${field("snapchat_pixel_id", "Snapchat Pixel ID", "")}
          ${field("pinterest_tag_id", "Pinterest Tag ID", "")}
        </div>
      </section>
      <section class="dashboard-card form-card">
        <h3>${icon("store")} منتجات جوجل والتحليلات</h3>
        <div class="form-grid">
          ${field("google_tag_manager_id", "Google Tag Manager ID", "GTM-XXXXXX")}
          ${field("ga4_measurement_id", "GA4 Measurement ID", "G-XXXXXXX")}
          ${field("google_ads_conversion_id", "Google Ads Conversion ID", "AW-XXXXXXX")}
          ${field("google_ads_conversion_label", "Google Ads Conversion Label", "")}
        </div>
        <div class="review-note">${icon("shield")} <span><strong>تُحقن السكربتات فقط عند التفعيل ووجود المعرّف</strong><small>تُحفظ في قاعدة البيانات وتُطبّق على كل الزوار. حدث PageView يُطلق تلقائيًا عند كل تنقّل في الموقع.</small></span></div>
        <button class="primary-button full" type="submit">${icon("check")} حفظ التكاملات</button>
      </section>
    </form>`;
}

function merchantLogin() {
  return `
    <div class="merchant-auth">
      <form class="merchant-auth__card" id="merchant-login-form">
        <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png" alt="دكانجي"></span></div>
        <h2>لوحة المتجر</h2>
        <p>سجّل دخولك لإدارة متجرك على دكانجي.</p>
        <label class="input-label"><span>اسم المستخدم</span><input name="username" autocomplete="username" required placeholder="demo" dir="ltr"></label>
        <label class="input-label"><span>كلمة المرور</span><input name="password" type="password" autocomplete="current-password" required placeholder="••••••••" dir="ltr"></label>
        <p class="merchant-auth__error" id="merchant-login-error" hidden>اسم المستخدم أو كلمة المرور غير صحيحة.</p>
        <button class="primary-button full large" type="submit">${icon("store")} دخول لوحة المتجر</button>
        <div class="merchant-auth__demo">
          <strong>بيانات تجريبية للتجربة</strong>
          <span>اسم المستخدم: <code>demo</code></span>
          <span>كلمة المرور: <code>dukkanci2026</code></span>
          <button type="button" class="text-button" data-action="fill-merchant-demo">تعبئة تلقائية</button>
        </div>
      </form>
    </div>
  `;
}

function renderMerchant(id) {
  if (!state.merchantAuth) return merchantLogin();
  state.merchantStoreId = Number(id) || state.merchantAuth.storeId || state.merchantStoreId || 1;
  const store = getMerchantStore();
  const content = {
    overview: merchantOverview,
    orders: merchantOrders,
    products: merchantProducts,
    offers: merchantOffers,
    store: merchantStore,
    integrations: merchantIntegrations,
    subscription: merchantSubscription
  }[state.merchantTab]();
  const titles = { overview: [`مرحباً، ${store.name}`, "إليك ملخص أداء فرعك اليوم"], orders: ["إدارة الطلبات", "تابع الطلبات وعدّل حالاتها"], products: ["إدارة المنتجات", "حدّث الأسعار والتوفر وأضف منتجاتك"], offers: ["العروض والخصومات", "اجذب عملاء أكثر بعروض مميزة"], store: ["بيانات المتجر", "حدّث معلومات متجرك ومناطق الخدمة"], integrations: ["التكاملات", "بكسلات التتبّع وأدوات جوجل للتحليلات والإعلانات"], subscription: ["اشتراك المتجر", "تابع خطتك وجدّد اشتراكك"] };
  const [title, subtitle] = titles[state.merchantTab];
  return `
    <div class="dashboard-shell">
      ${dashboardSidebar("merchant", state.merchantTab)}
      <main class="dashboard-main">
        <header class="dashboard-header">
          <div class="dashboard-heading">
            <span class="mobile-dashboard-label">لوحة المتجر</span>
            <div class="dashboard-title-row"><h1>${title}</h1><span class="dashboard-live"><i></i> المتجر يعمل</span></div>
            <p>${subtitle}</p>
          </div>
          <div class="dashboard-header__actions">
            <label class="store-switcher" title="اختر المتجر الذي تديره">${icon("store")}<select id="merchant-store-switch">${[...stores].sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s => `<option value="${s.id}" ${s.id === store.id ? "selected" : ""}>${s.name}</option>`).join("")}</select></label>
            <span class="dashboard-date">${icon("calendar")} ${dashboardDate()}</span>
            <button class="icon-button" aria-label="الإشعارات">${icon("bell")}<b></b></button>
            <button class="view-store" data-action="open-store" data-id="${store.id}">${icon("eye")} عرض المتجر</button>
            <button class="icon-button" data-action="merchant-logout" aria-label="تسجيل الخروج" title="تسجيل الخروج">${icon("logout")}</button>
          </div>
        </header>
        <div class="dashboard-content">${content}</div>
      </main>
    </div>
  `;
}

function adminOverview() {
  return `
    <div class="stats-grid admin-stats">
      ${statCard("store", "إجمالي المتاجر", "٨٤", "+ 6 هذا الشهر", "green")}
      ${statCard("users", "إجمالي العملاء", "٤,٢٨١", "+ 184 هذا الشهر", "blue")}
      ${statCard("receipt", "الطلبات هذا الشهر", "٢,٦٤٠", "+ 18% عن السابق", "orange")}
      ${statCard("wallet", "الاشتراكات النشطة", "٧٦", "8 تنتهي قريباً", "yellow")}
    </div>
    <div class="dashboard-grid admin-overview-grid">
      <section class="dashboard-card chart-card">
        <div class="card-heading"><div><h3>نمو الطلبات</h3><p>آخر 6 أشهر</p></div><span class="trend positive">+ 24.6%</span></div>
        <div class="line-chart">
          <svg viewBox="0 0 600 230" preserveAspectRatio="none"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e30613" stop-opacity=".24"/><stop offset="1" stop-color="#e30613" stop-opacity="0"/></linearGradient></defs><path d="M0 190 C70 165 86 170 130 135 S210 170 260 100 S355 125 395 70 S490 95 600 25 V230 H0Z" fill="url(#area)"/><path d="M0 190 C70 165 86 170 130 135 S210 170 260 100 S355 125 395 70 S490 95 600 25" fill="none" stroke="#e30613" stroke-width="5" stroke-linecap="round"/></svg>
          <div><span>يناير</span><span>فبراير</span><span>مارس</span><span>أبريل</span><span>مايو</span><span>يونيو</span></div>
        </div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>حالة الطلبات</h3><p>هذا الشهر</p></div></div>
        <div class="donut-wrap"><div class="donut"><span><strong>٢,٦٤٠</strong><small>طلب</small></span></div><div class="donut-legend"><span><i class="green"></i> مكتمل <b>68%</b></span><span><i class="orange"></i> قيد التنفيذ <b>21%</b></span><span><i class="red"></i> ملغى <b>11%</b></span></div></div>
      </section>
    </div>
    <div class="admin-panels">
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>طلبات انضمام جديدة</h3><p>تحتاج إلى المراجعة</p></div><button class="text-button" data-action="admin-tab" data-tab="stores">عرض الكل</button></div>
        <div class="join-requests">
          <article><span class="store-avatar"><img src="/assets/photos/store-market.jpg" alt=""></span><div><strong>روابي الشام</strong><small>سوبر ماركت · منذ ساعتين</small></div><button class="approve" data-action="approve-store">قبول</button><button class="reject" data-action="reject-store">رفض</button></article>
          <article><span class="store-avatar"><img src="/assets/photos/store-spices.jpg" alt=""></span><div><strong>قهوة البيت</strong><small>مكسرات وقهوة · منذ 5 ساعات</small></div><button class="approve" data-action="approve-store">قبول</button><button class="reject" data-action="reject-store">رفض</button></article>
        </div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>تنبيهات تحتاج انتباهك</h3><p>آخر تحديث الآن</p></div></div>
        <div class="alert-list"><article class="red">${icon("megaphone")}<div><strong>3 شكاوى جديدة</strong><small>شكويان بانتظار أكثر من 24 ساعة</small></div></article><article class="orange">${icon("wallet")}<div><strong>8 اشتراكات تنتهي قريباً</strong><small>خلال الأيام السبعة القادمة</small></div></article><article class="blue">${icon("store")}<div><strong>4 متاجر غير نشطة</strong><small>لم تستقبل طلبات منذ 30 يوماً</small></div></article></div>
      </section>
    </div>
  `;
}

function adminStores() {
  return `
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث باسم المتجر أو صاحبه"></div><div class="toolbar-actions"><button class="secondary-button compact">${icon("filter")} تصفية</button><button class="secondary-button compact" data-action="export-csv" data-kind="stores">${icon("download")} تصدير Excel</button></div></div>
    <section class="dashboard-card admin-store-list">
      ${stores.map(store => `<article>${storeAvatar(store)}<div><strong>${store.name}</strong><small>${store.category} · ${store.address.split("،")[1]}</small></div><span class="status-pill ${store.open ? "green" : "gray"}">${store.open ? "نشط" : "متوقف"}</span><span><small>الاشتراك</small><strong>${store.subscription || (store.id === 4 ? "منتهي" : "احترافي")}</strong></span><span><small>الطلبات</small><strong>${store.orderCount ?? [128, 94, 72, 35][store.id - 1] ?? 0}</strong></span><button class="table-action" data-action="open-store" data-id="${store.id}" aria-label="عرض المتجر">${icon("eye")}</button></article>`).join("")}
    </section>
  `;
}

function adminCustomers() {
  const customers = [["محمود درويش", "+90 555 111 22 33", "24", "12 يونيو 2026"], ["سارة خليل", "+90 555 222 33 44", "18", "11 يونيو 2026"], ["عمر الحسن", "+90 555 333 44 55", "31", "11 يونيو 2026"], ["ليلى أحمد", "+90 555 444 55 66", "12", "10 يونيو 2026"]];
  return `
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث بالاسم أو رقم الهاتف"></div><button class="secondary-button compact" data-action="export-csv" data-kind="customers">${icon("download")} تصدير العملاء</button></div>
    <section class="dashboard-card orders-table-card"><div class="table-wrap"><table><thead><tr><th>العميل</th><th>رقم الهاتف</th><th>عدد الطلبات</th><th>آخر طلب</th><th>الحالة</th><th></th></tr></thead><tbody>${customers.map((customer, index) => `<tr><td><div class="table-person"><span class="avatar-mini">${customer[0][0]}</span><strong>${customer[0]}</strong></div></td><td dir="ltr">${customer[1]}</td><td>${customer[2]}</td><td>${customer[3]}</td><td><span class="status-pill green">نشط</span></td><td><button class="table-action">${icon("dots")}</button></td></tr>`).join("")}</tbody></table></div></section>
  `;
}

function adminOrders() {
  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث في كل الطلبات"></div><div class="toolbar-actions"><button class="secondary-button compact">${icon("calendar")} التاريخ</button><button class="secondary-button compact" data-action="export-csv" data-kind="orders">${icon("download")} تصدير</button></div></div><section class="dashboard-card orders-table-card">${renderOrdersTable(state.orders, "admin")}</section>`;
}

function adminComplaints() {
  const complaints = [["SH-142", "تأخر وصول الطلب", "محمود درويش", "سوق البركة", "شكوى جديدة"], ["SH-141", "منتج غير مطابق", "ليلى أحمد", "ملحمة الأمانة", "قيد المراجعة"], ["SH-140", "طلب ناقص", "سارة خليل", "حلويات الشام", "تم الحل"]];
  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث في الشكاوى"></div><button class="secondary-button compact" data-action="export-csv" data-kind="complaints">${icon("download")} تصدير</button></div><section class="dashboard-card complaint-list">${complaints.map(item => `<article><span class="complaint-icon">${icon("megaphone")}</span><div><strong>${item[1]}</strong><small>${item[0]} · ${item[2]} ضد ${item[3]}</small></div><span class="status-pill ${statusClass(item[4])}">${item[4]}</span><button class="secondary-button compact" data-action="complaint-detail" data-id="${item[0]}" data-subject="${escAttr(item[1])}" data-customer="${escAttr(item[2])}" data-store="${escAttr(item[3])}" data-status="${escAttr(item[4])}">مراجعة</button></article>`).join("")}</section>`;
}

function adminContent() {
  return `<div class="content-management-grid">${[["megaphone", "بنرات الصفحة الرئيسية", "إدارة الصور الإعلانية وترتيب ظهورها"], ["filter", "التصنيفات", "ترتيب وإخفاء تصنيفات المتاجر"], ["star", "المتاجر المميزة", "اختيار المتاجر الظاهرة في الرئيسية"], ["wallet", "الخطط والأسعار", "إدارة أسعار الاشتراكات والبنرات"], ["edit", "النصوص الرئيسية", "تعديل نصوص صفحات المنصة"], ["users", "صفحة انضم كتاجر", "تعديل المحتوى ومتطلبات الانضمام"]].map(item => `<article class="dashboard-card"><span>${icon(item[0])}</span><h3>${item[1]}</h3><p>${item[2]}</p><button class="secondary-button compact" data-action="toast" data-message="تم فتح قسم ${item[1]}">إدارة القسم ${icon("arrowLeft")}</button></article>`).join("")}</div>`;
}

function renderAdmin() {
  const content = { overview: adminOverview, stores: adminStores, customers: adminCustomers, orders: adminOrders, complaints: adminComplaints, content: adminContent }[state.adminTab]();
  const titles = { overview: ["نظرة عامة", "مرحباً بك في مركز إدارة دكانجي"], stores: ["إدارة المتاجر", "راجع المتاجر والاشتراكات وحالات النشاط"], customers: ["إدارة العملاء", "بيانات العملاء وسجل طلباتهم"], orders: ["كل الطلبات", "تابع الطلبات وتدخل عند الحاجة"], complaints: ["إدارة الشكاوى", "تابع شكاوى العملاء حتى الحل"], content: ["إدارة المحتوى", "تحكم في الصفحة الرئيسية والعروض والخطط"] };
  const [title, subtitle] = titles[state.adminTab];
  return `<div class="dashboard-shell admin-shell">${dashboardSidebar("admin", state.adminTab)}<main class="dashboard-main"><header class="dashboard-header"><div class="dashboard-heading"><span class="mobile-dashboard-label">لوحة الإدارة</span><div class="dashboard-title-row"><h1>${title}</h1></div><p>${subtitle}</p></div><div class="dashboard-header__actions"><span class="dashboard-date">${icon("calendar")} ${dashboardDate()}</span><button class="icon-button" aria-label="الإشعارات">${icon("bell")}<b></b></button><button class="view-store" data-action="route-home">${icon("eye")} عرض الموقع</button></div></header><div class="dashboard-content">${content}</div></main></div>`;
}

function renderDeliveryQuoteDetails(store, quote, status = "") {
  const settings = getDeliverySettings(store.id);
  if (settings.mode !== "distance") return "";
  if (status === "loading") {
    return `<div class="delivery-calculator loading"><span class="delivery-loader"></span><div><strong>جارٍ حساب الطريق...</strong><p>نقارن موقع المتجر بعنوانك ونحدّث السعر والوقت.</p></div></div>`;
  }
  if (!quote) {
    return `<div class="delivery-calculator warning">${icon("pin")}<div><strong>حدد موقع العنوان أولاً</strong><p>أضف إحداثيات العنوان أو استخدم موقعك الحالي لنحسب المسافة والتكلفة.</p></div></div>`;
  }
  if (quote.exceedsMaxDistance) {
    return `<div class="delivery-calculator warning">${icon("map")}<div><strong>العنوان خارج نطاق التوصيل</strong><p>المسافة ذهاباً وإياباً ${formatDistance(quote.roundTripKm)}، والحد الأقصى لهذا المتجر ${formatDistance(settings.maxRoundTripKm)}.</p></div></div>`;
  }
  const source = quote.provider === "google" ? "مسار مباشر من خرائط Google" : "تقدير أولي يُحدّث عبر خرائط Google";
  return `
    <div class="delivery-calculator">
      <div class="delivery-calculator__head"><span>${icon("map")}</span><div><strong>حسبة التوصيل لهذا العنوان</strong><p>${source}</p></div><b>${money(quote.fee)}</b></div>
      <div class="delivery-metrics">
        <span><small>ذهاب فقط</small><strong>${formatDistance(quote.oneWayKm)}</strong></span>
        <span><small>ذهاب وإياب</small><strong>${formatDistance(quote.roundTripKm)}</strong></span>
        <span><small>سعر الكيلومتر</small><strong>${money(quote.ratePerKm)}</strong></span>
        <span><small>الوصول المتوقع</small><strong>${quote.estimatedMinutes} دقيقة</strong></span>
      </div>
      <div class="delivery-equation">${formatDistance(quote.roundTripKm)} × ${money(quote.ratePerKm)} = <strong>${money(quote.fee)}</strong></div>
    </div>
  `;
}

function renderCheckout() {
  if (!state.cart.length) return `<section class="section empty-page">${renderEmpty("سلتك فارغة", "أضف بعض المنتجات أولاً لتتمكن من إكمال الطلب.", "تصفح المتاجر", "stores")}</section>`;
  const store = getStore(state.cart[0].storeId);
  const defaultAddress = getDefaultAddress();
  const selectedAddressId = state.checkoutLocation ? "current" : defaultAddress?.id;
  const totals = cartTotals(selectedAddressId);
  const deliverySettings = getDeliverySettings(store.id);
  return `
    <section class="page-hero compact checkout-hero"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><strong>إتمام الطلب</strong></div><h1>إتمام طلبك</h1><p>راجع التفاصيل وحدد طريقة الاستلام والدفع.</p></div></section>
    <section class="section checkout-section">
      <form class="container checkout-grid" id="checkout-form">
        <div class="checkout-forms">
          <section class="checkout-card">
            <div class="checkout-card__title"><span>١</span><div><h2>طريقة الاستلام</h2><p>كيف تفضل استلام طلبك؟</p></div></div>
            <div class="choice-grid two">
              <label class="choice-card active"><input type="radio" name="fulfillment" value="delivery" checked><span>${icon("bike")}</span><div><strong>توصيل للعنوان</strong><small id="checkout-delivery-choice">${deliverySettings.mode === "distance" ? "السعر والوقت حسب موقعك" : `${store.time} · ${money(totals.delivery)}`}</small></div></label>
              <label class="choice-card"><input type="radio" name="fulfillment" value="pickup"><span>${icon("store")}</span><div><strong>استلام من المتجر</strong><small>بدون رسوم توصيل</small></div></label>
            </div>
          </section>
          <section class="checkout-card">
            <div class="checkout-card__title"><span>٢</span><div><h2>العنوان والموعد</h2><p>أين ومتى تريد استلام الطلب؟</p></div></div>
            <div class="form-grid">
              <label class="wide"><span>عنوان التوصيل</span><select name="address" id="checkout-address" required><option value="">اختر عنواناً محفوظاً</option>${state.customerAddresses.map(address => `<option value="${address.id}" ${String(address.id) === String(selectedAddressId) ? "selected" : ""}>${address.label} - ${address.address}</option>`).join("")}${state.checkoutLocation ? '<option value="current" selected>موقعي الحالي</option>' : ""}</select></label>
              <label><span>اليوم</span><select name="day"><option>اليوم، 12 يونيو</option><option>غداً، 13 يونيو</option></select></label>
              <label><span>الوقت</span><select name="time"><option>في أقرب وقت</option><option>14:00 - 15:00</option><option>17:00 - 18:00</option></select></label>
            </div>
            <button type="button" class="location-link" data-action="use-current-location">${icon("pin")} استخدام موقعي الحالي</button>
            <div id="delivery-calculator">${renderDeliveryQuoteDetails(store, totals.quote)}</div>
          </section>
          <section class="checkout-card">
            <div class="checkout-card__title"><span>٣</span><div><h2>سياسة البدائل</h2><p>ماذا يفعل المتجر إذا لم يتوفر منتج؟</p></div></div>
            <div class="radio-list">
              ${["اتصلوا بي قبل أي بديل", "أقبل ببديل مشابه", "احذفوا المنتج غير المتوفر", "لا أقبل أي تعديل دون موافقتي"].map((label, index) => `<label><input type="radio" name="substitution" value="${label}" ${index === 0 ? "checked" : ""}><span></span>${label}</label>`).join("")}
            </div>
          </section>
          <section class="checkout-card">
            <div class="checkout-card__title"><span>٤</span><div><h2>طريقة الدفع</h2><p>لن تُخصم البطاقة إلا بعد تأكيد المتجر.</p></div></div>
            <div class="choice-grid two">
              <label class="choice-card active"><input type="radio" name="payment" value="card" checked><span>${icon("wallet")}</span><div><strong>الدفع بالبطاقة</strong><small>بعد تأكيد الطلب النهائي</small></div></label>
              <label class="choice-card"><input type="radio" name="payment" value="cash"><span>${icon("receipt")}</span><div><strong>الدفع عند الاستلام</strong><small>نقداً للمتجر</small></div></label>
            </div>
          </section>
          <label class="terms-check"><input type="checkbox" name="terms" required><span></span><p>أوافق أن دكانجي منصة لتسهيل الطلبات بين العملاء والمتاجر، وأن المتجر هو البائع المباشر والمسؤول عن توفر المنتجات وجودتها وأسعارها وتجهيزها وتوصيلها، مع بقاء دكانجي جهة متابعة وتنظيم للطلب.</p></label>
        </div>
        <aside class="order-summary checkout-summary">
          <div class="summary-store">${storeAvatar(store)}<div><small>طلبك من</small><strong>${store.name}</strong></div></div>
          <div class="summary-items">${state.cart.map(item => { const product = getProduct(item.productId); return `<div><img src="${product.image}" alt=""><span><strong>${product.name}</strong><small>${item.quantity} × ${money(item.finalPrice)}</small></span><b>${money(item.quantity * item.finalPrice)}</b></div>`; }).join("")}</div>
          <div class="summary-prices"><span><small>المجموع الفرعي</small><strong>${money(totals.subtotal)}</strong></span><span><small>رسوم التوصيل</small><strong id="checkout-delivery-fee">${totals.quote?.exceedsMaxDistance ? "خارج النطاق" : money(totals.delivery)}</strong></span><span class="summary-total"><small>الإجمالي</small><strong id="checkout-final-total">${money(totals.total)}</strong></span></div>
          <button class="primary-button full large" type="submit">${icon("shield")} إرسال الطلب للمتجر</button>
          <p class="secure-note">${icon("shield")} بياناتك وطلبك محفوظان بأمان</p>
        </aside>
      </form>
    </section>
  `;
}

function renderEmpty(title, text, buttonText = "", route = "") {
  return `<div class="empty-state"><span>${icon("bag")}</span><h3>${title}</h3><p>${text}</p>${buttonText ? `<a href="#${route}" data-route="${route}" class="primary-button">${buttonText}</a>` : ""}</div>`;
}

function renderNotFound() {
  return `<section class="section empty-page">${renderEmpty("الصفحة غير موجودة", "تعذر العثور على الصفحة المطلوبة.", "العودة للرئيسية", "home")}</section>`;
}

function parseRoute() {
  const path = location.pathname.replace(/^\/+|\/+$/g, "");
  if (!path) return { route: "home", id: null };
  const [route, id] = path.split("/");
  return { route, id: id ? decodeURIComponent(id) : undefined };
}

// History API navigation (real URLs, no hash). Accepts "stores", "store/5", "home", "/stores".
function navigate(to) {
  const path = (!to || to === "home") ? "/" : (to.startsWith("/") ? to : "/" + to);
  if (location.pathname !== path) history.pushState({}, "", path);
  closeDrawers();
  render();
  window.dispatchEvent(new CustomEvent("dukkanci:navigate"));
}

function setMetaTag(selector, attr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(selector.startsWith("link") ? "link" : "meta");
    const m = selector.match(/\[(name|property|rel)="([^"]+)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

function updateHead(route, id) {
  const base = "https://dukkanci.vercel.app";
  const canonical = base + (location.pathname === "/" ? "/" : location.pathname);
  let title = "دكانجي | سوق الحي بين يديك";
  let desc = "اطلب من متاجر ومطاعم حيك في إسطنبول بسهولة — توصيل سريع من سوق الحي.";
  let image = base + "/assets/dukkanci-app-icon-512.png";
  if (route === "store" && id) {
    const s = getStore(id);
    if (s) {
      title = `${s.name} | دكانجي`;
      desc = s.description || desc;
      const img = s.coverImage || s.image;
      if (img) image = img.startsWith("http") ? img : base + img;
    }
  } else if (route === "stores") { title = "كل المتاجر والمطاعم | دكانجي"; desc = "تصفّح متاجر ومطاعم حيك في إسطنبول واطلب أونلاين."; }
  else if (route === "offers") { title = "العروض والخصومات | دكانجي"; desc = "أحدث عروض وخصومات متاجر ومطاعم الحي."; }
  document.title = title;
  setMetaTag('meta[name="description"]', "content", desc);
  setMetaTag('link[rel="canonical"]', "href", canonical);
  setMetaTag('meta[property="og:title"]', "content", title);
  setMetaTag('meta[property="og:description"]', "content", desc);
  setMetaTag('meta[property="og:image"]', "content", image);
  setMetaTag('meta[property="og:url"]', "content", canonical);
}

function render() {
  const { route, id } = parseRoute();
  state.route = route;
  updateHead(route, id);
  const routes = {
    home: renderHome,
    stores: renderStores,
    offers: renderOffers,
    store: () => renderStorePage(id),
    orders: renderOrders,
    merchant: () => renderMerchant(id),
    admin: renderAdmin,
    checkout: renderCheckout
  };
  app.innerHTML = (routes[route] || renderHome)();
  document.body.classList.toggle("dashboard-view", route === "merchant" || route === "admin");
  document.querySelectorAll("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === route));
  hydrateIcons(app);
  updateCartBadges();
  window.scrollTo({ top: 0, behavior: "instant" });
  if (route === "checkout" && state.cart.length) setTimeout(() => requestDeliveryQuote(), 0);
}

function renderCart() {
  const totals = cartTotals(getDefaultAddress()?.id);
  if (!state.cart.length) {
    cartDrawer.innerHTML = `<div class="drawer-head"><div><h2>سلة التسوق</h2><span>0 منتجات</span></div><button data-action="close-drawers">${icon("close")}</button></div>${renderEmpty("سلتك تنتظر اختياراتك", "تصفح متاجر الحي وأضف ما تحتاجه بسهولة.", "تصفح المتاجر", "stores")}`;
    return;
  }
  const store = getStore(state.cart[0].storeId);
  cartDrawer.innerHTML = `
    <div class="drawer-head"><div><h2>سلة التسوق</h2><span>${state.cart.reduce((sum, item) => sum + item.quantity, 0)} منتجات</span></div><button data-action="close-drawers">${icon("close")}</button></div>
    <div class="cart-store">${storeAvatar(store)}<div><small>طلبك من</small><strong>${store.name}</strong></div><button data-action="open-store" data-id="${store.id}">عرض المتجر</button></div>
    <div class="cart-items">${state.cart.map((item, index) => {
      const product = getProduct(item.productId);
      return `<article class="cart-item"><img src="${product.image}" alt="${product.name}"><div class="cart-item__info"><strong>${product.name}</strong><small>${item.optionsText || product.unit}</small><b>${money(item.finalPrice)}</b><div class="quantity-control"><button data-action="cart-minus" data-index="${index}">${item.quantity === 1 ? icon("trash") : icon("minus")}</button><span>${item.quantity}</span><button data-action="cart-plus" data-index="${index}">${icon("plus")}</button></div></div></article>`;
    }).join("")}</div>
    <div class="cart-note"><label for="cart-note">ملاحظات للمتجر</label><textarea id="cart-note" placeholder="مثال: يرجى اختيار حبات ناضجة..."></textarea></div>
    <div class="cart-footer">
      <div class="cart-price-line"><span>المجموع الفرعي</span><strong>${money(totals.subtotal)}</strong></div>
      <div class="cart-price-line"><span>التوصيل</span><strong>${getDeliverySettings(store.id).mode === "distance" ? `${money(totals.delivery)} تقديرياً` : money(totals.delivery)}</strong></div>
      ${getDeliverySettings(store.id).mode === "distance" ? `<p class="distance-cart-note">${icon("map")} يُثبت السعر حسب عنوانك ومسار الطريق عند إتمام الطلب.</p>` : ""}
      <div class="cart-total"><span>الإجمالي التقريبي</span><strong>${money(totals.total)}</strong></div>
      ${totals.subtotal < store.minOrder ? `<p class="minimum-alert">أضف ${money(store.minOrder - totals.subtotal)} للوصول إلى الحد الأدنى للطلب.</p>` : ""}
      <button class="primary-button full large" data-action="checkout" ${totals.subtotal < store.minOrder ? "disabled" : ""}>متابعة إتمام الطلب ${icon("arrowLeft")}</button>
    </div>`;
}

function openCart() {
  renderCart();
  cartDrawer.classList.add("open");
  backdrop.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeDrawers() {
  cartDrawer.classList.remove("open");
  backdrop.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function showModal(content, className = "") {
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div><div class="modal ${className}">${content}</div>`;
  modalRoot.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeModal() {
  modalRoot.classList.remove("open");
  modalRoot.innerHTML = "";
  document.body.classList.remove("no-scroll");
}

function openCustomerOrderDetails(orderId) {
  const order = customerOrders.find(item => item.id === orderId);
  if (!order) return;
  const store = getStore(order.storeId);
  const deliveryFee = order.deliveryDetails?.fee ?? getDeliverySettings(order.storeId).fixedFee;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="customer-order-modal__store">${storeAvatar(store)}<div><span class="section-kicker">${order.id}</span><h2>${store.name}</h2><small>${order.date}</small></div><span class="status-pill ${order.color}">${order.status}</span></div>
    <div class="customer-order-modal__items">${order.items.map(item => {
      const product = getProduct(item.productId);
      return `<article><img src="${product.image}" alt="${product.name}"><div><strong>${product.name}</strong><small>${product.unit}</small></div><span>${item.quantity} × ${money(product.price)}</span></article>`;
    }).join("")}</div>
    <div class="customer-order-modal__summary"><span><small>قيمة المنتجات</small><strong>${money(order.total - deliveryFee)}</strong></span><span><small>رسوم التوصيل</small><strong>${money(deliveryFee)}</strong></span><span class="total"><small>الإجمالي</small><strong>${money(order.total)}</strong></span></div>
    <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إغلاق</button><button class="primary-button" data-action="reorder" data-id="${order.id}">${icon("bag")} إعادة الطلب</button></div>
  `, "customer-order-modal");
}

function applyCustomerReorder(orderId) {
  const order = customerOrders.find(item => item.id === orderId);
  if (!order) return;
  state.cart = order.items.map((item, index) => {
    const product = getProduct(item.productId);
    return {
      key: `reorder-${order.id}-${product.id}-${index}`,
      productId: product.id,
      storeId: product.storeId,
      quantity: item.quantity,
      finalPrice: product.price,
      optionsText: product.unit,
      notes: ""
    };
  });
  saveState();
  updateCartBadges();
  closeModal();
  showToast("تمت إعادة منتجات الطلب إلى السلة", "success");
  openCart();
}

function reorderCustomerOrder(orderId) {
  if (!state.cart.length) {
    applyCustomerReorder(orderId);
    return;
  }
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="conflict-modal-icon">${icon("bag")}</div>
    <h2>استبدال محتويات السلة؟</h2>
    <p>تحتوي سلتك على منتجات حالية. لإعادة هذا الطلب سنستبدلها بمنتجات الطلب السابق.</p>
    <div class="modal-actions"><button class="secondary-button" data-action="close-modal">الاحتفاظ بالسلة</button><button class="danger-button" data-action="confirm-reorder" data-id="${orderId}">استبدال وإعادة الطلب</button></div>
  `, "confirm-modal");
}

function openAddressModal(addressId = null) {
  const address = state.customerAddresses.find(item => item.id === Number(addressId));
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${address ? "تعديل العنوان" : "عنوان جديد"}</span>
    <h2>${address ? address.label : "إضافة عنوان توصيل"}</h2>
    <form id="customer-address-form" class="modal-form" data-id="${address?.id || ""}">
      <label class="input-label"><span>اسم العنوان</span><select name="label"><option ${address?.label === "المنزل" ? "selected" : ""}>المنزل</option><option ${address?.label === "العمل" ? "selected" : ""}>العمل</option><option ${address?.label === "عنوان آخر" ? "selected" : ""}>عنوان آخر</option></select></label>
      <label class="input-label"><span>العنوان الكامل</span><input name="address" required value="${address?.address || ""}" placeholder="الشارع، الحي، المدينة"></label>
      <label class="input-label"><span>تفاصيل إضافية</span><textarea name="details" required placeholder="رقم البناء، الطابق، الشقة...">${address?.details || ""}</textarea></label>
      <div class="address-location-picker">
        <input type="hidden" name="lat" value="${address?.lat || ""}">
        <input type="hidden" name="lng" value="${address?.lng || ""}">
        <span class="address-location-picker__icon">${icon("pin")}</span>
        <div><strong>نقطة التوصيل على الخريطة</strong><small id="address-location-copy">${address?.lat && address?.lng ? `تم تحديد الموقع: ${address.lat.toFixed(5)}, ${address.lng.toFixed(5)}` : "مطلوبة لحساب المسافة ورسوم التوصيل تلقائياً."}</small></div>
        <button type="button" class="secondary-button compact" data-action="capture-address-location">تحديد موقعي</button>
      </div>
      <label class="notification-setting"><input name="isDefault" type="checkbox" ${address?.isDefault ? "checked" : ""}><span></span><div><strong>استخدامه كعنوان افتراضي</strong><small>سيظهر أولًا عند إتمام الطلب.</small></div></label>
      <button class="primary-button full" type="submit">${icon("check")} حفظ العنوان</button>
    </form>
  `, "address-modal");
}

function openComplaintDetails(complaintId) {
  const complaint = state.customerComplaints.find(item => item.id === complaintId);
  if (!complaint) return;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${complaint.id}</span><h2>${complaint.subject}</h2>
    <div class="complaint-detail-meta"><span><small>الطلب المرتبط</small><strong>${complaint.orderId || "شكوى عامة"}</strong></span><span><small>تاريخ الإرسال</small><strong>${complaint.date}</strong></span><span><small>الحالة</small><b class="status-pill ${complaint.status === "تم الحل" ? "green" : "orange"}">${complaint.status}</b></span></div>
    <div class="complaint-message"><strong>رسالتك</strong><p>${complaint.message}</p></div>
    <div class="review-note">${icon("clock")}<span><strong>فريق الدعم يتابع طلبك</strong><small>سنرسل الرد إلى رقم واتساب المسجل في حسابك.</small></span></div>
    <button class="secondary-button full" data-action="close-modal">إغلاق</button>
  `, "complaint-modal");
}

function openProductModal(id) {
  const product = getProduct(id);
  const store = getStore(product.storeId);
  window.DUKKANCI_INTEGRATIONS?.track("ViewContent", { ids: [product.id], value: product.price });
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="product-modal-grid">
      <div class="product-gallery"><img src="${product.image}" alt="${product.name}"><div><button class="active"><img src="${product.image}" alt=""></button><button><img src="${store.image}" alt=""></button></div></div>
      <form class="product-details" id="product-form" data-id="${product.id}">
        <span class="product-breadcrumb">${store.name} · ${product.category}</span>
        <h2>${product.name}</h2>
        <div class="product-status"><span class="${product.available ? "available" : "not-available"}">${product.available ? "متوفر" : "غير متوفر"}</span><span>${icon("star")} 4.8 (42 تقييماً)</span></div>
        <p>${product.description}</p>
        <div class="modal-price">${product.priceOnRequest ? `<strong>السعر عند الطلب</strong>` : `<strong>${money(product.price)}</strong>${product.unit ? `<span>/ ${product.unit}</span>` : ""}${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}`}</div>
        ${product.options.map((option, optionIndex) => `
          <fieldset class="option-group"><legend>${option.name}</legend><div>${option.values.map((value, valueIndex) => `<label><input type="radio" name="option-${optionIndex}" value="${valueIndex}" ${valueIndex === 0 ? "checked" : ""}><span>${value}${option.extra[valueIndex] ? `<small>${option.extra[valueIndex] > 0 ? "+" : ""}${money(option.extra[valueIndex])}</small>` : ""}</span></label>`).join("")}</div></fieldset>
        `).join("")}
        <label class="product-notes"><span>ملاحظات خاصة</span><textarea name="notes" placeholder="اكتب أي تفاصيل تهم المتجر..."></textarea></label>
        <div class="product-add-row">
          ${product.priceOnRequest ? `
          <a class="primary-button large wa-order-btn" href="${waOrderLink(product)}" target="_blank" rel="noopener">${icon("whatsapp")} اطلب عبر واتساب</a>` : `
          <div class="quantity-control large"><button type="button" data-action="modal-quantity-minus">${icon("minus")}</button><span id="modal-quantity">1</span><button type="button" data-action="modal-quantity-plus">${icon("plus")}</button></div>
          <button class="primary-button large" type="submit" ${!product.available ? "disabled" : ""}>${icon("bag")} أضف للسلة · <span id="modal-total">${money(product.price)}</span></button>`}
        </div>
      </form>
    </div>
  `, "product-modal");
  updateProductModalPrice();
}

function updateProductModalPrice() {
  const form = document.getElementById("product-form");
  if (!form) return;
  const product = getProduct(form.dataset.id);
  const quantityEl = document.getElementById("modal-quantity");
  const totalEl = document.getElementById("modal-total");
  if (!quantityEl || !totalEl) return;
  const quantity = Number(quantityEl.textContent);
  let price = product.price;
  product.options.forEach((option, index) => {
    const selected = form.querySelector(`input[name="option-${index}"]:checked`);
    price += option.extra[Number(selected?.value || 0)] || 0;
  });
  document.getElementById("modal-total").textContent = money(price * quantity);
}

function updateCheckoutPricing(status = "") {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const pickup = form.elements.fulfillment.value === "pickup";
  const address = form.elements.address;
  address.required = !pickup;
  const store = getStore(state.cart[0]?.storeId);
  const totals = cartTotals(address.value);
  const delivery = pickup ? 0 : totals.delivery;
  document.getElementById("checkout-delivery-fee").textContent = pickup ? "مجاناً" : money(delivery);
  document.getElementById("checkout-final-total").textContent = money(totals.subtotal + delivery);
  const calculator = document.getElementById("delivery-calculator");
  if (calculator) {
    calculator.hidden = pickup;
    calculator.innerHTML = renderDeliveryQuoteDetails(store, totals.quote, status);
  }
  const choiceCopy = document.getElementById("checkout-delivery-choice");
  if (choiceCopy && totals.quote?.estimatedMinutes) {
    choiceCopy.textContent = `حوالي ${totals.quote.estimatedMinutes} دقيقة · ${money(delivery)}`;
  }
  const submitButton = form.querySelector('button[type="submit"]');
  const dynamicDelivery = getDeliverySettings(store.id).mode === "distance";
  submitButton.disabled = !pickup && dynamicDelivery && (!totals.quote || totals.quote.exceedsMaxDistance);
}

async function requestDeliveryQuote() {
  const form = document.getElementById("checkout-form");
  if (!form || !state.cart.length || form.elements.fulfillment.value === "pickup") {
    updateCheckoutPricing();
    return;
  }
  const store = getStore(state.cart[0].storeId);
  const settings = getDeliverySettings(store.id);
  const address = getCheckoutAddress(form.elements.address.value);
  if (settings.mode !== "distance" || !address?.lat || !address?.lng) {
    state.deliveryQuote = settings.mode === "distance" ? null : estimateDeliveryQuote(store, address);
    updateCheckoutPricing();
    return;
  }
  const requestKey = `${store.id}:${address.id}:${address.lat}:${address.lng}`;
  state.deliveryQuoteRequestKey = requestKey;
  updateCheckoutPricing("loading");
  try {
    const response = await fetch("/api/delivery-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: getStoreLocation(store.id),
        destination: { lat: address.lat, lng: address.lng },
        ratePerKm: settings.ratePerKm,
        maxRoundTripKm: settings.maxRoundTripKm
      })
    });
    if (!response.ok) throw new Error("تعذر حساب المسار");
    const quote = await response.json();
    if (state.deliveryQuoteRequestKey !== requestKey) return;
    state.deliveryQuote = {
      ...quote,
      storeId: store.id,
      addressId: address.id,
      ratePerKm: settings.ratePerKm,
      estimatedMinutes: settings.prepMinutes + quote.routeMinutes
    };
    updateCheckoutPricing();
  } catch {
    if (state.deliveryQuoteRequestKey !== requestKey) return;
    state.deliveryQuote = estimateDeliveryQuote(store, address);
    updateCheckoutPricing();
  }
}

function updateCheckoutFulfillment() {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  if (form.elements.fulfillment.value === "delivery") requestDeliveryQuote();
  else updateCheckoutPricing();
}

function captureGeolocation(onSuccess) {
  if (!navigator.geolocation) {
    showToast("تحديد الموقع غير مدعوم في هذا المتصفح");
    return;
  }
  showToast("جارٍ تحديد موقعك...");
  navigator.geolocation.getCurrentPosition(
    position => onSuccess({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    }),
    () => showToast("تعذر تحديد الموقع. تحقق من إذن الموقع وحاول مجدداً."),
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
  );
}

function captureAddressLocation() {
  const form = document.getElementById("customer-address-form");
  if (!form) return;
  captureGeolocation(location => {
    form.elements.lat.value = location.lat;
    form.elements.lng.value = location.lng;
    document.getElementById("address-location-copy").textContent = `تم تحديد الموقع: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}`;
    showToast("تم تحديد نقطة التوصيل", "success");
  });
}

function captureCheckoutLocation() {
  captureGeolocation(location => {
    state.checkoutLocation = { id: "current", label: "موقعي الحالي", address: "الموقع الحالي", details: "", ...location };
    state.deliveryQuote = null;
    const select = document.getElementById("checkout-address");
    let option = select.querySelector('option[value="current"]');
    if (!option) {
      option = new Option("موقعي الحالي", "current");
      select.add(option);
    }
    select.value = "current";
    requestDeliveryQuote();
    showToast("تم استخدام موقعك الحالي للتوصيل", "success");
  });
}

function captureStoreLocation() {
  const form = document.getElementById("merchant-store-form");
  if (!form) return;
  captureGeolocation(location => {
    form.elements.storeLat.value = location.lat;
    form.elements.storeLng.value = location.lng;
    showToast("تم تحديد موقع المتجر", "success");
  });
}

function addToCart(productId, quantity = 1, optionSelections = [], notes = "") {
  const product = getProduct(productId);
  if (!product.available) return;
  if (product.priceOnRequest) { showToast("هذا المنتج بسعر عند الطلب — تواصل عبر واتساب"); return; }
  const currentStoreId = state.cart[0]?.storeId;
  if (currentStoreId && currentStoreId !== product.storeId) {
    const currentStore = getStore(currentStoreId);
    const nextStore = getStore(product.storeId);
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("bag")}</div>
      <h2>السلة من متجر واحد فقط</h2>
      <p>يجب إفراغ السلة أو إكمال الطلب الحالي أولاً. تحتوي سلتك على منتجات من <strong>${currentStore.name}</strong>، وهذا المنتج من <strong>${nextStore.name}</strong>.</p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">العودة للسلة</button><button class="danger-button" data-action="replace-cart" data-id="${product.id}">إفراغ السلة وإضافة المنتج</button></div>
    `, "confirm-modal");
    return;
  }

  let extra = 0;
  const optionLabels = [];
  product.options.forEach((option, index) => {
    const selectedIndex = Number(optionSelections[index] || 0);
    extra += option.extra[selectedIndex] || 0;
    optionLabels.push(option.values[selectedIndex]);
  });
  const key = `${product.id}-${optionSelections.join("-")}-${notes}`;
  const existing = state.cart.find(item => item.key === key);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ key, productId: product.id, storeId: product.storeId, quantity, finalPrice: product.price + extra, optionsText: optionLabels.join("، "), notes });
  saveState();
  updateCartBadges();
  window.DUKKANCI_INTEGRATIONS?.track("AddToCart", { ids: [product.id], value: (product.price + extra) * quantity });
  showToast(`تمت إضافة ${product.name} إلى السلة`, "success");
}

function showToast(message, type = "") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === "success" ? icon("check") : icon("bell")}</span><p>${message}</p><button>${icon("close")}</button>`;
  toast.querySelector("button").addEventListener("click", () => toast.remove());
  document.getElementById("toast-stack").appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 20);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 250); }, 3500);
}

function openLoginModal() {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png" alt="دكانجي"></span></div>
    <h2>أهلاً بك في دكانجي</h2><p>سجّل دخولك لمتابعة طلباتك وحفظ عناوينك ومفضلاتك.</p>
    <button class="google-button" data-action="toast" data-message="سيتم ربط تسجيل Google عند إعداد مفاتيح المشروع"><b>G</b> المتابعة باستخدام Google</button>
    <div class="or-line"><span>أو</span></div>
    <form id="login-form"><label class="input-label"><span>رقم واتساب</span><div class="phone-input"><span dir="ltr">+90</span><input type="tel" required placeholder="555 000 00 00" dir="ltr"></div></label><button class="primary-button full large" type="submit">إرسال رمز التحقق</button></form>
    <small class="auth-terms">بالمتابعة أنت توافق على الشروط وسياسة الخصوصية.</small>
  `, "auth-modal");
}

function openJoinModal() {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="join-modal-head"><span>${icon("store")}</span><div><h2>انضم إلى دكانجي</h2><p>ابدأ باستقبال طلبات جديدة من عملاء منطقتك.</p></div></div>
    <form id="join-form" class="join-form">
      <div class="form-grid">
        <label><span>اسم المتجر الحقيقي</span><input required placeholder="مثال: سوق البركة"></label>
        <label><span>تصنيف المتجر</span><select required><option value="">اختر التصنيف</option><option>مطاعم</option><option>سوبر ماركت</option><option>ملاحم</option><option>حلويات</option><option>مكسرات وبهارات</option></select></label>
        <label><span>اسم صاحب المتجر</span><input required placeholder="الاسم الكامل"></label>
        <label><span>رقم واتساب</span><input required dir="ltr" placeholder="+90 555 000 00 00"></label>
        <label class="wide"><span>عنوان المتجر</span><input required placeholder="الحي، الشارع، رقم البناء"></label>
      </div>
      <div class="review-note">${icon("shield")} <span><strong>طلبك يخضع للمراجعة</strong><small>سيتواصل فريق دكانجي معك للتحقق من البيانات وتفعيل المتجر.</small></span></div>
      <button class="primary-button full large" type="submit">إرسال طلب الانضمام ${icon("arrowLeft")}</button>
    </form>
  `, "join-modal");
}

function openOrderManager(orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order) return;
  const statuses = ["تم القبول", "بانتظار الدفع", "قيد التجهيز", "جاهز للاستلام", "خرج للتوصيل", "مكتمل"];
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">الطلب ${order.id}</span><h2>إدارة الطلب</h2>
    <div class="order-manager-summary"><span><small>العميل</small><strong>${order.customer}</strong></span><span><small>الإجمالي</small><strong>${money(order.total)}</strong></span><span><small>المنتجات</small><strong>${order.items}</strong></span></div>
    <label class="input-label"><span>تحديث حالة الطلب</span><select id="order-status-select">${statuses.map(status => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
    <label class="input-label"><span>ملاحظة للعميل</span><textarea id="order-status-note" placeholder="اكتب رسالة قصيرة تظهر للعميل..."></textarea></label>
    <div class="review-note">${icon("whatsapp")} <span><strong>إشعار واتساب</strong><small>سيصل تحديث الحالة إلى العميل تلقائياً عند ربط WhatsApp API.</small></span></div>
    <button class="primary-button full" data-action="save-order-status" data-id="${order.id}">حفظ وإرسال التحديث</button>
  `, "order-modal");
}

function escAttr(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// Read an uploaded image, downscale it (so it stays light for storage), return a JPEG data URL.
function readImageFileResized(file, maxDim = 900) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) { reject(new Error("ليس ملف صورة")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("تعذّر قراءة الصورة"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL("image/jpeg", 0.85)); }
        catch (e) { resolve(reader.result); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function openProductForm(id) {
  const editing = id ? getProduct(id) : null;
  const store = getMerchantStore();
  const cats = [...new Set(products.filter(p => p.storeId === store.id).map(p => p.category))];
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${store.name}</span>
    <h2>${editing ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
    <form class="modal-form" id="merchant-product-form" data-id="${editing ? editing.id : ""}">
      <div class="form-grid">
        <label class="input-label wide"><span>اسم المنتج</span><input name="name" required value="${editing ? escAttr(editing.name) : ""}"></label>
        <label class="input-label"><span>السعر (ل.ت)</span><input name="price" type="number" min="0" step="1" required value="${editing ? editing.price : ""}"></label>
        <label class="input-label"><span>الوحدة</span><input name="unit" placeholder="كيلو / قطعة / علبة" value="${editing ? escAttr(editing.unit || "") : ""}"></label>
        <label class="input-label"><span>التصنيف</span><input name="category" list="merchant-cat-list" required value="${editing ? escAttr(editing.category) : (cats[0] || "")}"><datalist id="merchant-cat-list">${cats.map(c => `<option value="${escAttr(c)}"></option>`).join("")}</datalist></label>
        <div class="input-label wide image-input-group">
          <span>صورة المنتج</span>
          <div class="image-upload-row">
            <div class="image-preview" id="product-image-preview">${(editing && editing.image) ? `<img src="${escAttr(editing.image)}" alt="">` : icon("box")}</div>
            <div class="image-upload-controls">
              <label class="upload-tile">${icon("upload")}<span>رفع صورة من الجهاز</span><input type="file" id="product-image-file" accept="image/*" hidden></label>
              <input name="image" placeholder="أو الصق رابط صورة (https://...)" value="${editing ? escAttr(editing.image) : ""}" dir="ltr">
            </div>
          </div>
          <input type="hidden" name="imageData">
        </div>
        <label class="input-label wide"><span>الوصف</span><textarea name="description" placeholder="وصف مختصر للمنتج">${editing ? escAttr(editing.description || "") : ""}</textarea></label>
      </div>
      <label class="form-check"><input type="checkbox" name="available" ${!editing || editing.available !== false ? "checked" : ""}><span>متوفر للبيع الآن</span></label>
      <button class="primary-button full" type="submit">${icon(editing ? "check" : "plus")} ${editing ? "حفظ التعديلات" : "إضافة المنتج"}</button>
    </form>
  `, "product-form-modal");
}

function openDeleteProductConfirm(id) {
  const product = getProduct(id);
  if (!product) return;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="conflict-modal-icon">${icon("trash")}</div>
    <h2>حذف "${product.name}"؟</h2>
    <p class="modal-note">سيُزال المنتج نهائياً من متجرك ومن واجهة العملاء. لا يمكن التراجع عن هذا الإجراء.</p>
    <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="confirm-delete-product" data-id="${product.id}">نعم، احذف المنتج</button></div>
  `, "confirm-modal");
}

function deleteProduct(id) {
  const numId = Number(id);
  const index = products.findIndex(p => p.id === numId);
  if (index === -1) { closeModal(); return; }
  const name = products[index].name;
  products.splice(index, 1);
  deleteProductLocal(numId);
  deleteProductCloud(numId);
  closeModal();
  render();
  showToast(`تم حذف "${name}"`, "success");
}

function openOfferForm() {
  const store = getMerchantStore();
  const list = products.filter(p => p.storeId === store.id && !p.priceOnRequest && p.price > 0);
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${store.name}</span>
    <h2>إنشاء عرض / خصم</h2>
    <form class="modal-form" id="merchant-offer-form">
      <label class="input-label"><span>اختر المنتج</span><select name="product" required>${list.map(p => `<option value="${p.id}">${escAttr(p.name)} — ${money(p.price)}</option>`).join("")}</select></label>
      <label class="input-label"><span>نسبة الخصم %</span><input name="discount" type="number" min="5" max="80" step="5" value="15" required></label>
      <div class="review-note">${icon("megaphone")} <span><strong>سيظهر العرض</strong><small>سيُحسب السعر الجديد تلقائياً ويظهر مع شارة الخصم في المتجر.</small></span></div>
      <button class="primary-button full" type="submit">${icon("megaphone")} تفعيل العرض</button>
    </form>
  `, "offer-modal");
}

function openComplaintDetail(data) {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">شكوى ${data.id}</span>
    <h2>${data.subject}</h2>
    <div class="order-manager-summary"><span><small>العميل</small><strong>${data.customer}</strong></span><span><small>ضد متجر</small><strong>${data.store}</strong></span><span><small>الحالة</small><strong>${data.status}</strong></span></div>
    <label class="input-label"><span>تحديث حالة الشكوى</span><select id="complaint-status-select"><option ${data.status === "شكوى جديدة" ? "selected" : ""}>شكوى جديدة</option><option ${data.status === "قيد المراجعة" ? "selected" : ""}>قيد المراجعة</option><option ${data.status === "تم الحل" ? "selected" : ""}>تم الحل</option></select></label>
    <label class="input-label"><span>رد على العميل</span><textarea placeholder="اكتب رد الإدارة..."></textarea></label>
    <button class="primary-button full" data-action="close-modal-toast" data-message="تم حفظ الرد وإشعار العميل">حفظ الرد</button>
  `, "complaint-modal");
}

function exportCsv(kind) {
  let rows = [];
  if (kind === "stores") rows = [["المتجر", "التصنيف", "التقييم", "رسوم التوصيل"], ...stores.map(store => [store.name, store.category, store.rating, deliveryPriceLabel(store)])];
  else if (kind === "customers") rows = [["العميل", "الهاتف", "الطلبات"], ["محمود درويش", "+90 555 111 22 33", 24], ["سارة خليل", "+90 555 222 33 44", 18]];
  else if (kind === "complaints") rows = [["الرقم", "العنوان", "الحالة"], ["SH-142", "تأخر وصول الطلب", "جديدة"], ["SH-141", "منتج غير مطابق", "قيد المراجعة"]];
  else rows = [["رقم الطلب", "العميل", "المتجر", "الإجمالي", "الحالة"], ...state.orders.map(order => [order.id, order.customer, getStore(order.storeId).name, order.total, order.status])];
  const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `dukkanci-${kind}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("تم تجهيز ملف التصدير", "success");
}

// Internal-link navigation via History API (handles data-route nav + plain #/... anchors)
document.addEventListener("click", event => {
  const a = event.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || a.target === "_blank" || /^(https?:|tel:|mailto:|wa\.me)/i.test(href)) return;
  if (href.startsWith("#")) { event.preventDefault(); navigate(href.replace(/^#/, "") || "home"); return; }
  if (href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+(\?|$)/i.test(href)) { event.preventDefault(); navigate(href); }
});

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "open-cart") openCart();
  if (action === "close-drawers") closeDrawers();
  if (action === "close-modal") closeModal();
  if (action === "open-store") {
    state.storeProductFilter = "الكل";
    closeModal();
    closeDrawers();
    navigate(`store/${target.dataset.id}`);
  }
  if (action === "open-product") openProductModal(target.dataset.id);
  if (action === "quick-add") {
    const product = getProduct(target.dataset.id);
    product.options.length ? openProductModal(product.id) : addToCart(product.id);
  }
  if (action === "favorite") {
    const key = target.dataset.key;
    state.favorites = state.favorites.includes(key) ? state.favorites.filter(item => item !== key) : [...state.favorites, key];
    saveState();
    target.classList.toggle("active");
    showToast(target.classList.contains("active") ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة", "success");
  }
  if (action === "category") {
    state.storeFilter = target.dataset.category;
    state.search = "";
    navigate("stores");
  }
  if (action === "store-filter") { state.storeFilter = target.dataset.category; render(); }
  if (action === "product-category") {
    state.storeProductFilter = target.dataset.category;
    render();
    setTimeout(() => document.getElementById("store-products")?.scrollIntoView({ behavior: "auto", block: "start" }), 0);
  }
  if (action === "run-search") {
    state.search = document.getElementById("hero-search").value.trim();
    state.storeFilter = "الكل";
    navigate("stores");
  }
  if (action === "run-store-search") { state.search = document.getElementById("stores-search").value.trim(); render(); }
  if (action === "focus-search") {
    if (state.route !== "home") navigate("home");
    setTimeout(() => document.getElementById("hero-search")?.focus(), 100);
  }
  if (action === "cart-plus" || action === "cart-minus") {
    const index = Number(target.dataset.index);
    if (action === "cart-plus") state.cart[index].quantity += 1;
    else if (state.cart[index].quantity > 1) state.cart[index].quantity -= 1;
    else state.cart.splice(index, 1);
    saveState(); updateCartBadges(); renderCart();
  }
  if (action === "checkout") {
    closeDrawers();
    const t = cartTotals();
    window.DUKKANCI_INTEGRATIONS?.track("InitiateCheckout", { ids: state.cart.map(i => i.productId), value: t.subtotal, count: state.cart.length });
    navigate("checkout");
  }
  if (action === "modal-quantity-plus" || action === "modal-quantity-minus") {
    const el = document.getElementById("modal-quantity");
    const next = Math.max(1, Number(el.textContent) + (action.endsWith("plus") ? 1 : -1));
    el.textContent = next; updateProductModalPrice();
  }
  if (action === "replace-cart") {
    state.cart = []; saveState(); closeModal(); addToCart(target.dataset.id); updateCartBadges();
  }
  if (action === "login") openLoginModal();
  if (action === "join-merchant") openJoinModal();
  if (action === "account-tab") { state.accountTab = target.dataset.tab; render(); }
  if (action === "customer-order-details") openCustomerOrderDetails(target.dataset.id);
  if (action === "reorder") reorderCustomerOrder(target.dataset.id);
  if (action === "confirm-reorder") applyCustomerReorder(target.dataset.id);
  if (action === "add-address") openAddressModal();
  if (action === "edit-address") openAddressModal(target.dataset.id);
  if (action === "capture-address-location") captureAddressLocation();
  if (action === "use-current-location") captureCheckoutLocation();
  if (action === "capture-store-location") captureStoreLocation();
  if (action === "default-address") {
    state.customerAddresses = state.customerAddresses.map(address => ({ ...address, isDefault: address.id === Number(target.dataset.id) }));
    saveState(); render(); showToast("تم تحديث العنوان الافتراضي", "success");
  }
  if (action === "delete-address") {
    const address = state.customerAddresses.find(item => item.id === Number(target.dataset.id));
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("trash")}</div><h2>حذف عنوان ${address.label}؟</h2>
      <p>سيتم حذف هذا العنوان من حسابك ولن يظهر عند إتمام الطلب.</p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="confirm-delete-address" data-id="${address.id}">حذف العنوان</button></div>
    `, "confirm-modal");
  }
  if (action === "confirm-delete-address") {
    const removedId = Number(target.dataset.id);
    const removedWasDefault = state.customerAddresses.find(address => address.id === removedId)?.isDefault;
    state.customerAddresses = state.customerAddresses.filter(address => address.id !== removedId);
    if (removedWasDefault && state.customerAddresses.length) state.customerAddresses[0].isDefault = true;
    saveState(); closeModal(); render(); showToast("تم حذف العنوان", "success");
  }
  if (action === "remove-account-favorite") {
    state.favorites = state.favorites.filter(item => item !== target.dataset.key);
    saveState(); render(); showToast("تمت الإزالة من المفضلة", "success");
  }
  if (action === "complaint-details") openComplaintDetails(target.dataset.id);
  if (action === "delete-complaint") {
    state.customerComplaints = state.customerComplaints.filter(complaint => complaint.id !== target.dataset.id);
    saveState(); render(); showToast("تم حذف الشكوى", "success");
  }
  if (action === "merchant-tab") { state.merchantTab = target.dataset.tab; render(); }
  if (action === "admin-tab") { state.adminTab = target.dataset.tab; render(); }
  if (action === "route-home") navigate("home");
  if (action === "manage-order") openOrderManager(target.dataset.id);
  if (action === "view-order") showToast(`تم فتح الطلب ${target.dataset.id}`);
  if (action === "save-order-status") {
    const order = state.orders.find(item => item.id === target.dataset.id);
    order.status = document.getElementById("order-status-select").value;
    pushOrderCloud(order);
    saveState(); closeModal(); render(); showToast("تم تحديث حالة الطلب وإعداد إشعار العميل", "success");
  }
  if (action === "approve-store" || action === "reject-store") {
    target.closest("article").remove();
    showToast(action === "approve-store" ? "تم قبول المتجر وإرسال رسالة التفعيل" : "تم رفض الطلب", action === "approve-store" ? "success" : "");
  }
  if (action === "export-csv") exportCsv(target.dataset.kind);
  if (action === "toast") showToast(target.dataset.message);
  if (action === "scroll-products") document.getElementById("store-products")?.scrollIntoView({ behavior: "smooth" });
  if (action === "share-store") {
    const store = getStore(target.dataset.id);
    navigator.clipboard?.writeText(`${store.name} على دكانجي - ${location.href}`);
    showToast("تم نسخ رابط المتجر", "success");
  }
  if (action === "whatsapp-store") {
    const store = getStore(target.dataset.id);
    const phone = store?.phone.replace(/\D/g, "");
    if (phone) window.open(`https://wa.me/${phone}`, "_blank", "noopener");
  }
  if (action === "map") {
    const store = getStore(parseRoute().id);
    const location = store && getStoreLocation(store.id);
    if (store?.mapUrl) window.open(store.mapUrl, "_blank", "noopener");
    else if (location) window.open(`https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`, "_blank", "noopener");
  }
  if (action === "location") {
    state.accountTab = "addresses";
    navigate("orders");
  }
  if (action === "install-app") {
    if (state.deferredInstall) {
      state.deferredInstall.prompt();
      state.deferredInstall.userChoice.then(() => { state.deferredInstall = null; });
    } else showToast("من قائمة المتصفح اختر «إضافة إلى الشاشة الرئيسية» لتثبيت دكانجي");
  }
  if (action === "add-product-form") openProductForm();
  if (action === "edit-product") openProductForm(target.dataset.id);
  if (action === "delete-product") openDeleteProductConfirm(target.dataset.id);
  if (action === "confirm-delete-product") deleteProduct(target.dataset.id);
  if (action === "fill-merchant-demo") {
    const f = document.getElementById("merchant-login-form");
    if (f) { f.username.value = "demo"; f.password.value = "dukkanci2026"; }
  }
  if (action === "merchant-logout") {
    state.merchantAuth = null;
    localStorage.removeItem("dukkanci-merchant-auth");
    showToast("تم تسجيل الخروج", "success");
    render();
  }
  if (action === "merchant-order-filter") { state.merchantOrderFilter = target.dataset.status; render(); }
  if (action === "create-offer") openOfferForm();
  if (action === "end-offer") {
    const product = getProduct(target.dataset.id);
    if (product && product.oldPrice) {
      product.price = product.oldPrice;
      delete product.oldPrice;
      saveProductOverride(product.id, { price: product.price, oldPrice: null });
      pushProductCloud(product);
      render();
      showToast(`تم إنهاء العرض على "${product.name}"`, "success");
    }
  }
  if (action === "complaint-detail") openComplaintDetail(target.dataset);
  if (action === "close-modal-toast") { closeModal(); showToast(target.dataset.message || "تم الحفظ", "success"); }
});

document.addEventListener("keydown", event => {
  if (event.key !== "Enter") return;
  if (event.target.id === "hero-search") {
    event.preventDefault();
    state.search = event.target.value.trim();
    state.storeFilter = "الكل";
    navigate("stores");
  } else if (event.target.id === "stores-search") {
    event.preventDefault();
    state.search = event.target.value.trim();
    render();
    setTimeout(() => document.getElementById("stores-search")?.focus(), 0);
  }
});

document.addEventListener("change", event => {
  if (event.target.id === "store-sort") { state.storeSort = event.target.value; render(); }
  if (event.target.id === "merchant-store-switch") {
    state.merchantStoreId = Number(event.target.value);
    state.merchantProductSearch = "";
    saveState();
    render();
  }
  if (event.target.id === "checkout-address") {
    state.deliveryQuote = null;
    requestDeliveryQuote();
  }
  if (event.target.name === "storeOpen") {
    const label = event.target.closest(".delivery-toggle").querySelector("b");
    if (label) label.textContent = event.target.checked ? "المتجر مفتوح" : "المتجر مغلق";
  }
  if (event.target.name === "distanceEnabled") {
    const fields = event.target.closest(".merchant-delivery-settings").querySelector(".distance-settings-fields");
    fields.classList.toggle("active", event.target.checked);
    event.target.closest(".delivery-toggle").querySelector("b").textContent = event.target.checked ? "مفعّل" : "غير مفعّل";
  }
  if (event.target.id === "product-image-file") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const form = event.target.closest("form");
    const preview = document.getElementById("product-image-preview");
    if (preview) preview.innerHTML = `<span class="image-loading">${icon("upload")}</span>`;
    readImageFileResized(file).then(dataUrl => {
      form.imageData.value = dataUrl;
      form.image.value = "";
      if (preview) preview.innerHTML = `<img src="${dataUrl}" alt="">`;
      showToast(`تم اختيار "${file.name}"`, "success");
    }).catch(() => {
      if (preview) preview.innerHTML = icon("box");
      showToast("تعذّر رفع الصورة، جرّب صورة أخرى");
    });
  }
  if (event.target.closest("#product-form")) updateProductModalPrice();
  if (event.target.matches('.choice-card input')) {
    event.target.closest(".choice-grid").querySelectorAll(".choice-card").forEach(card => card.classList.remove("active"));
    event.target.closest(".choice-card").classList.add("active");
    if (event.target.name === "fulfillment") updateCheckoutFulfillment();
  }
  if (event.target.dataset.action === "toggle-product") {
    const product = getProduct(event.target.dataset.id);
    product.available = event.target.checked;
    saveProductOverride(product.id, { available: product.available });
    pushProductCloud(product);
    showToast(`أصبح المنتج ${product.available ? "متوفراً" : "غير متوفر"}`, "success");
    render();
  }
});

document.addEventListener("input", event => {
  if (event.target.id === "merchant-order-search") {
    state.merchantOrderSearch = event.target.value;
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".orders-table-card tbody tr").forEach(row => {
      const text = normalizeAr(row.textContent);
      row.style.display = !q || text.includes(q) ? "" : "none";
    });
  }
  if (event.target.name === "image" && event.target.closest("#merchant-product-form")) {
    const form = event.target.closest("form");
    form.imageData.value = "";
    const preview = document.getElementById("product-image-preview");
    const url = event.target.value.trim();
    if (preview) preview.innerHTML = url ? `<img src="${escAttr(url)}" alt="" onerror="this.parentNode.innerHTML='&#9888;'">` : icon("box");
  }
  if (event.target.id === "merchant-product-search") {
    state.merchantProductSearch = event.target.value;
    const q = normalizeAr(event.target.value.trim());
    const section = document.querySelector(".product-management");
    if (section) {
      let visible = 0;
      section.querySelectorAll("article").forEach(article => {
        const nameEl = article.querySelector(".managed-product-name");
        const match = !q || normalizeAr(nameEl ? nameEl.textContent : "").includes(q);
        article.style.display = match ? "" : "none";
        if (match) visible++;
      });
      const countEl = document.querySelector(".toolbar-count");
      if (countEl) countEl.textContent = `${visible.toLocaleString("ar")} منتج`;
    }
  }
  if (event.target.name === "ratePerKm") {
    const rate = Math.min(20, Math.max(10, Number(event.target.value) || 10));
    const exampleRate = document.getElementById("delivery-example-rate");
    const exampleTotal = document.getElementById("delivery-example-total");
    if (exampleRate) exampleRate.textContent = rate;
    if (exampleTotal) exampleTotal.textContent = `${20 * rate} ل.ت`;
  }
});

document.addEventListener("submit", event => {
  event.preventDefault();
  if (event.target.id === "product-form") {
    const product = getProduct(event.target.dataset.id);
    if (product.priceOnRequest) return;
    const selections = product.options.map((_, index) => Number(event.target.querySelector(`input[name="option-${index}"]:checked`)?.value || 0));
    const quantity = Number(document.getElementById("modal-quantity").textContent);
    const notes = event.target.elements.notes?.value || "";
    closeModal(); addToCart(product.id, quantity, selections, notes);
  }
  if (event.target.id === "merchant-product-form") {
    const f = event.target;
    const data = {
      name: f.name.value.trim(),
      price: Math.max(0, Math.round(Number(f.price.value) || 0)),
      unit: f.unit.value.trim(),
      category: f.category.value.trim() || "منتجات",
      image: (f.imageData.value || f.image.value.trim()) || "/assets/photos/store-market.jpg",
      description: f.description.value.trim(),
      available: f.available.checked
    };
    if (!data.name) { showToast("يرجى إدخال اسم المنتج"); return; }
    if (f.dataset.id) {
      const edited = getProduct(f.dataset.id);
      Object.assign(edited, data);
      saveProductOverride(f.dataset.id, data);
      pushProductCloud(edited);
      showToast("تم حفظ تعديلات المنتج", "success");
    } else {
      const store = getMerchantStore();
      const newId = Math.max(0, ...products.map(p => p.id)) + 1;
      const newProduct = { id: newId, storeId: store.id, sourceId: `m-${newId}`, imageFit: "cover", options: [], featured: false, ...data };
      products.push(newProduct);
      saveCustomProduct(newProduct);
      pushProductCloud(newProduct);
      showToast("تمت إضافة المنتج بنجاح", "success");
    }
    state.merchantTab = "products";
    closeModal(); render();
  }
  if (event.target.id === "merchant-integrations-form") {
    const f = event.target;
    const map = {};
    (window.DUKKANCI_INTEGRATIONS?.SETTING_KEYS || []).forEach(k => {
      if (f.elements[k]) map[k] = { setting_value: f.elements[k].value.trim(), is_enabled: !!(f.elements[k + "__on"] && f.elements[k + "__on"].checked) };
    });
    window.DUKKANCI_INTEGRATIONS?.save(map);
    showToast("تم حفظ إعدادات التكاملات وتطبيقها", "success");
    render();
    return;
  }
  if (event.target.id === "merchant-offer-form") {
    const product = getProduct(event.target.product.value);
    const discount = Math.min(80, Math.max(5, Number(event.target.discount.value) || 0));
    if (product) {
      const base = product.oldPrice && product.oldPrice > product.price ? product.oldPrice : product.price;
      product.oldPrice = base;
      product.price = Math.max(1, Math.round(base * (1 - discount / 100)));
      saveProductOverride(product.id, { price: product.price, oldPrice: product.oldPrice });
      pushProductCloud(product);
    }
    state.merchantTab = "offers";
    closeModal(); render(); showToast("تم تفعيل العرض ويظهر الآن في المتجر", "success");
  }
  if (event.target.id === "checkout-form") {
    if (!event.target.elements.terms.checked) { showToast("يرجى الموافقة على سياسة الطلب أولاً"); return; }
    if (!event.target.elements.address.value && event.target.elements.fulfillment.value === "delivery") { showToast("يرجى اختيار عنوان التوصيل"); return; }
    const totals = cartTotals(event.target.elements.address.value);
    const deliverySettings = getDeliverySettings(state.cart[0].storeId);
    if (event.target.elements.fulfillment.value === "delivery" && deliverySettings.mode === "distance" && (!totals.quote || totals.quote.exceedsMaxDistance)) {
      showToast(totals.quote?.exceedsMaxDistance ? "العنوان خارج نطاق توصيل هذا المتجر" : "تعذر حساب التوصيل لهذا العنوان");
      return;
    }
    const finalTotal = totals.subtotal + (event.target.elements.fulfillment.value === "pickup" ? 0 : totals.delivery);
    const storeId = state.cart[0].storeId;
    const newOrder = {
      id: `DK-${1050 + state.orders.length}`,
      customer: "محمود درويش",
      storeId,
      total: finalTotal,
      status: "بانتظار تأكيد المتجر",
      time: "الآن",
      items: state.cart.length,
      deliveryDetails: event.target.elements.fulfillment.value === "delivery" ? totals.quote : null
    };
    state.orders.unshift(newOrder);
    pushOrderCloud(newOrder);
    window.DUKKANCI_INTEGRATIONS?.track("Purchase", { ids: state.cart.map(i => i.productId), value: finalTotal, orderId: newOrder.id, count: state.cart.length });
    state.cart = [];
    state.deliveryQuote = null;
    state.checkoutLocation = null;
    saveState(); updateCartBadges();
    showModal(`<div class="success-animation">${icon("check")}</div><h2>تم إرسال طلبك بنجاح</h2><p>طلبك رقم <strong>${newOrder.id}</strong> وصل إلى ${getStore(storeId).name}. سنخبرك عبر واتساب فور تأكيده.</p><div class="modal-actions"><button class="secondary-button" data-action="close-modal">متابعة التسوق</button><button class="primary-button" data-action="go-orders">متابعة الطلب</button></div>`, "success-modal");
  }
  if (event.target.id === "login-form") {
    closeModal(); showToast("تم إرسال رمز تحقق تجريبي عبر واتساب", "success");
  }
  if (event.target.id === "join-form") {
    closeModal(); showToast("وصل طلب انضمامك وسيتواصل معك فريق دكانجي", "success");
  }
  if (event.target.id === "customer-profile-form") {
    const form = new FormData(event.target);
    state.customerProfile = {
      name: form.get("name").trim(),
      phone: form.get("phone").trim(),
      email: form.get("email").trim(),
      notifications: form.get("notifications") === "on"
    };
    saveState(); render(); showToast("تم حفظ بيانات حسابك", "success");
  }
  if (event.target.id === "customer-address-form") {
    const form = new FormData(event.target);
    const addressId = Number(event.target.dataset.id);
    const wasDefault = state.customerAddresses.find(address => address.id === addressId)?.isDefault;
    const makeDefault = form.get("isDefault") === "on" || !state.customerAddresses.length || Boolean(wasDefault);
    const addressData = {
      id: addressId || Date.now(),
      label: form.get("label"),
      address: form.get("address").trim(),
      details: form.get("details").trim(),
      lat: Number(form.get("lat")) || null,
      lng: Number(form.get("lng")) || null,
      isDefault: makeDefault
    };
    if (makeDefault) state.customerAddresses = state.customerAddresses.map(address => ({ ...address, isDefault: false }));
    if (addressId) state.customerAddresses = state.customerAddresses.map(address => address.id === addressId ? addressData : address);
    else state.customerAddresses.push(addressData);
    saveState(); closeModal(); render(); showToast(addressId ? "تم تحديث العنوان" : "تمت إضافة العنوان", "success");
  }
  if (event.target.id === "merchant-login-form") {
    const f = event.target;
    const username = f.username.value.trim().toLowerCase();
    const password = f.password.value;
    const account = MERCHANT_ACCOUNTS.find(a => a.username === username && a.password === password);
    if (!account) {
      const err = document.getElementById("merchant-login-error");
      if (err) err.hidden = false;
      return;
    }
    state.merchantAuth = { username: account.username, storeId: account.storeId };
    localStorage.setItem("dukkanci-merchant-auth", JSON.stringify(state.merchantAuth));
    state.merchantStoreId = account.storeId;
    state.merchantTab = "overview";
    render();
    showToast("مرحباً بك في لوحة متجرك", "success");
    return;
  }
  if (event.target.id === "merchant-store-form") {
    const form = new FormData(event.target);
    const storeId = Number(event.target.dataset.storeId);
    const store = getStore(storeId);
    if (store) {
      const newName = (form.get("storeName") || "").toString().trim();
      if (!newName) { showToast("يرجى إدخال اسم المتجر"); return; }
      store.name = newName;
      store.category = (form.get("category") || store.category).toString().trim();
      store.description = (form.get("description") || "").toString().trim();
      store.address = (form.get("address") || "").toString().trim();
      store.phone = (form.get("phone") || "").toString().trim();
      store.whatsapp = store.phone;
      store.hours = (form.get("hours") || "").toString().trim();
      store.minOrder = Math.max(0, Number(form.get("minOrder")) || 0);
      store.open = form.get("storeOpen") === "on";
      const cover = (form.get("coverImage") || "").toString().trim();
      if (cover) store.coverImage = cover;
      pushStoreCloud(store);
    }
    const ratePerKm = Math.min(20, Math.max(10, Number(form.get("ratePerKm")) || 15));
    state.deliverySettings[storeId] = {
      mode: form.get("distanceEnabled") === "on" ? "distance" : "fixed",
      fixedFee: Math.max(0, Number(form.get("fixedFee")) || 0),
      ratePerKm,
      prepMinutes: Math.min(120, Math.max(5, Number(form.get("prepMinutes")) || 20)),
      maxRoundTripKm: Math.min(200, Math.max(5, Number(form.get("maxRoundTripKm")) || 60))
    };
    state.storeLocations[storeId] = {
      lat: Number(form.get("storeLat")),
      lng: Number(form.get("storeLng"))
    };
    state.deliveryQuote = null;
    saveState();
    render();
    showToast("تم حفظ بيانات المتجر وإعدادات التوصيل", "success");
  }
  if (event.target.id === "customer-complaint-form") {
    const form = new FormData(event.target);
    const nextNumber = Math.max(143, ...state.customerComplaints.map(complaint => Number(complaint.id.replace("SH-", "")) || 0)) + 1;
    state.customerComplaints.unshift({
      id: `SH-${nextNumber}`,
      subject: form.get("subject").trim(),
      orderId: form.get("orderId"),
      message: form.get("message").trim(),
      status: "قيد المتابعة",
      date: new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(new Date())
    });
    saveState(); render(); showToast("تم إرسال الشكوى إلى فريق الدعم", "success");
  }
});

document.addEventListener("click", event => {
  if (event.target.closest('[data-action="go-orders"]')) { closeModal(); navigate("orders"); }
});

window.addEventListener("popstate", () => { render(); window.dispatchEvent(new CustomEvent("dukkanci:navigate")); });
window.addEventListener("beforeinstallprompt", event => {
  event.preventDefault();
  state.deferredInstall = event;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));
}

// Backward-compat: convert old shared #routes (e.g. /#store/5) to real paths
if (location.hash && location.hash.length > 1) {
  const h = location.hash.replace(/^#/, "");
  history.replaceState({}, "", h === "home" ? "/" : "/" + h);
}
hydrateIcons();
render();
initCatalog();
