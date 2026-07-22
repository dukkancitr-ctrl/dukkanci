const stores = [
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
    location: { lat: 41.041726, lng: 28.683689 },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=41.041726,28.683689",
    open: true,
    featured: true,
    hasOffer: false,
    offer: "",
    description: "ملحمة الهلال في إسنيورت تقدم لحوم الخاروف والعجل والدجاج الطازجة، إلى جانب المشاوي والتواصي والتجهيزات الجاهزة.",
    address: "Yenikent, Hacı Bektaş Veli Cd No:34, 34510 Esenyurt/İstanbul",
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

stores.push(...alsultanBranches, zaitouneStore, ...zaitouneBranches, ezzedineStore, sallouraStore, nourStore, tihamaStore, afganStore, samStore, kadyStore, alwadiStore, kadibyStore, azalStore, abouStore, bitehausStore, ...alagarBranches, khawaliStore, ademsefStore, babtomaStore, orangeStore, ...anasBranches, yemenmandyStore, alfursanStore, safaStore, rodyStore, krepchefStore, beytStore, mandishebamStore, sarujaStore, pasapizzeriaStore, biryaniStore, bhaleebStore, yumyStore, bludanFatihStore, bludanStore, sajStore, albaraaStore, meatmootStore, barakaStore, hawamahallStore, mandialyemenStore, filistinkunefesiStore, ...wingiBranches, albarakaStore, istanbulchickenStore, reyhanStore, nahlStore, alahdabStore, rumanStore, goldenmixStore, babalyemenStore, beyazitStore, alnoorStore, felukaStore, beitbeyrutStore, wekalaStore, two2beesStore, charcochickenStore, fatihalkhairStore, qalaatalshamStore, friyszoneStore, zamzamStore, beythalepStore, alataetStore, omarmarketStore, bigtavukStore, abdulhamitStore, paradiceStore, turkwazStore, ibnalwazeerStore, friendstrStore, shamogluStore, chikiwikiStore, ayhamStore, salsabeelStore);

const products = [];

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
products.push(...alwadiProducts);
products.push(...kadibyProducts);
products.push(...azalProducts);
products.push(...abouProducts);
products.push(...bitehausProducts);
products.push(...alagarProducts);
products.push(...khawaliProducts);
products.push(...ademsefProducts);
products.push(...babtomaProducts);
products.push(...orangeProducts);
products.push(...anasProducts);
products.push(...yemenmandyProducts);
products.push(...alfursanProducts);
products.push(...safaProducts);
products.push(...rodyProducts);
products.push(...krepchefProducts);
products.push(...beytProducts);
products.push(...mandishebamProducts);
products.push(...sarujaProducts);
products.push(...pasapizzeriaProducts);
products.push(...biryaniProducts);
products.push(...bhaleebProducts);
products.push(...yumyProducts);
products.push(...bludanFatihProducts);
products.push(...bludanProducts);
products.push(...sajProducts);
products.push(...albaraaProducts);
products.push(...meatmootProducts);
products.push(...barakaProducts);
products.push(...hawamahallProducts);
products.push(...mandialyemenProducts);
products.push(...filistinkunefesiProducts);
products.push(...wingiProducts);
products.push(...albarakaProducts);
products.push(...istanbulchickenProducts);
products.push(...reyhanProducts);
products.push(...nahlProducts);
products.push(...alahdabProducts);
products.push(...rumanProducts);
products.push(...goldenmixProducts);
products.push(...babalyemenProducts);
products.push(...beyazitProducts);
products.push(...alnoorProducts);
products.push(...felukaProducts);
products.push(...beitbeyrutProducts);
products.push(...wekalaProducts);
products.push(...two2beesProducts);
products.push(...charcochickenProducts);
products.push(...fatihalkhairProducts);
products.push(...qalaatalshamProducts);
products.push(...friyszoneProducts);
products.push(...zamzamProducts);
products.push(...beythalepProducts);
products.push(...alataetProducts);
products.push(...omarmarketProducts);
products.push(...bigtavukProducts);
products.push(...abdulhamitProducts);
products.push(...paradiceProducts);
products.push(...turkwazProducts);
products.push(...ibnalwazeerProducts);
products.push(...friendstrProducts);
products.push(...shamogluProducts);
products.push(...chikiwikiProducts);
products.push(...ayhamProducts);
products.push(...salsabeelProducts);

// Publishing rules — enforced for BOTH the bundled fallback and the cloud catalog.
// Never publish a product that is (1) unavailable, (2) has no real image (empty or a
// known placeholder), or (3) reuses an image already used by another product in the
// SAME store (a duplicate = a fallback/placeholder, not the product's own photo).
// The same product photo reused across branches of one brand is NOT a duplicate, so
// duplicate detection is scoped per store.
function isPlaceholderImage(img) {
  return !img || /placeholder|generic-cover|coming-soon/i.test(String(img));
}
// Stores that opt in to showing menu items WITHOUT a photo (their source has no image for some
// items). For these stores, imageless products render as clean no-image cards instead of being
// hidden. Every other store keeps the default "real photo only" storefront rule. Per-store opt-in
// so this never affects stores (e.g. صفا الشام) whose owner wants photo-only storefronts.
const ALLOW_NO_IMAGE_STORES = new Set([58, 70, 74]); // برياني بالاس (58) + مطعم مندي اليمن (70) + مطعم البركة - باغجلار (74): some menu items lack a real dish photo (the merchant uploaded a placeholder/reused image), so they show as clean no-image cards instead of being hidden or duplicating a picture. Every other store stays photo-only.
function storeAllowsNoImage(storeId) { return ALLOW_NO_IMAGE_STORES.has(Number(storeId)); }
// Products the admin explicitly hid from the storefront (ids loaded from site_settings.hiddenProducts).
// The storefront shows a product only if it has a real image, is in stock, and isn't force-hidden;
// the management panels (merchant + admin) read `allProducts` instead, so they still see and manage
// EVERY product — including ones without an image (shown there as "بانتظار صورة / غير معروض").
let HIDDEN_PRODUCTS = new Set();
// Admin-curated picks for the homepage "الأكثر طلباً اليوم" section (ids loaded from
// site_settings.mostOrdered). We don't have real sales-ranking data yet, so this is a
// manual admin selection — see mostOrderedProducts() for the fallback when it's empty.
let MOST_ORDERED_PRODUCTS = new Set();
// True once a visitor has added an «اسأل دكانجي» bundle to the cart this session — read at
// checkout completion to fire ask_dukkanci_checkout_completed, then cleared.
let askDukkanciCartOrigin = false;
function isShownOnStore(p) {
  return p.available !== false && !HIDDEN_PRODUCTS.has(p.id) && (!isPlaceholderImage(p.image) || storeAllowsNoImage(p.storeId));
}
function applyPublishingRules(list) {
  const imageUses = new Map(); // `${storeId}|${image}` -> count, real images only
  for (const p of list) {
    if (isPlaceholderImage(p.image)) continue;
    const k = p.storeId + "|" + String(p.image).trim();
    imageUses.set(k, (imageUses.get(k) || 0) + 1);
  }
  return list.filter(p => {
    if (p.available === false) return false;          // rule 1: unavailable
    if (HIDDEN_PRODUCTS.has(p.id)) return false;       // admin force-hide
    if (isPlaceholderImage(p.image)) return storeAllowsNoImage(p.storeId); // rule 2: no real image -> hidden, unless the store opted in to show imageless items
    const k = p.storeId + "|" + String(p.image).trim();
    return imageUses.get(k) === 1;                      // rule 3: unique within its store
  });
}
// Full catalog (incl. items hidden from the storefront) — the management panels read this.
const allProducts = products.slice();
// Apply to the bundled fallback in place (preserve the array identity/reference).
{
  const kept = applyPublishingRules(products);
  products.length = 0;
  kept.forEach(p => products.push(p));
}

const initialOrders = [];

const initialCustomerProfile = {
  name: "",
  phone: "",
  email: "",
  notifications: true
};

const initialCustomerAddresses = [];

const initialCustomerComplaints = [];

const initialDeliverySettings = {
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
  ...alwadiDeliverySettings,
  ...kadibyDeliverySettings,
  ...azalDeliverySettings,
  ...abouDeliverySettings,
  ...bitehausDeliverySettings,
  ...alagarDeliverySettings,
  ...khawaliDeliverySettings,
  ...ademsefDeliverySettings,
  ...babtomaDeliverySettings,
  ...orangeDeliverySettings,
  ...anasDeliverySettings,
  ...yemenmandyDeliverySettings,
  ...alfursanDeliverySettings,
  ...safaDeliverySettings,
  ...rodyDeliverySettings,
  ...krepchefDeliverySettings,
  ...beytDeliverySettings,
  ...mandishebamDeliverySettings,
  ...sarujaDeliverySettings,
  ...pasapizzeriaDeliverySettings,
  ...biryaniDeliverySettings,
  ...bhaleebDeliverySettings,
  ...yumyDeliverySettings,
  ...bludanFatihDeliverySettings,
  ...bludanDeliverySettings,
  ...sajDeliverySettings,
  ...albaraaDeliverySettings,
  ...meatmootDeliverySettings,
  ...barakaDeliverySettings,
  ...hawamahallDeliverySettings,
  ...mandialyemenDeliverySettings,
  ...filistinkunefesiDeliverySettings,
  ...wingiDeliverySettings,
  ...albarakaDeliverySettings,
  ...istanbulchickenDeliverySettings,
  ...reyhanDeliverySettings,
  ...nahlDeliverySettings,
  ...alahdabDeliverySettings,
  ...rumanDeliverySettings,
  ...goldenmixDeliverySettings,
  ...babalyemenDeliverySettings,
  ...beyazitDeliverySettings,
  ...alnoorDeliverySettings,
  ...felukaDeliverySettings,
  ...beitbeyrutDeliverySettings,
  ...wekalaDeliverySettings,
  ...two2beesDeliverySettings,
  ...charcochickenDeliverySettings,
  ...fatihalkhairDeliverySettings,
  ...qalaatalshamDeliverySettings,
  ...friyszoneDeliverySettings,
  ...zamzamDeliverySettings,
  ...beythalepDeliverySettings,
  ...alataetDeliverySettings,
  ...omarmarketDeliverySettings,
  ...bigtavukDeliverySettings,
  ...abdulhamitDeliverySettings,
  ...paradiceDeliverySettings,
  ...turkwazDeliverySettings,
  ...ibnalwazeerDeliverySettings,
  ...friendstrDeliverySettings,
  ...shamogluDeliverySettings,
  ...chikiwikiDeliverySettings,
  ...ayhamDeliverySettings,
  ...salsabeelDeliverySettings,
  101: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

function loadCustomerAddresses() {
  const saved = JSON.parse(localStorage.getItem("dukkanci-addresses") || "null") || initialCustomerAddresses;
  return saved.map(address => {
    const fallback = initialCustomerAddresses.find(item => item.id === address.id);
    return { ...fallback, ...address };
  });
}

// One-time migration: an earlier build seeded khawali (store 31) at 15 ل.ت/كم, and
// saveState froze that snapshot into each browser's localStorage, which shadows the
// bundled value on load. Realign the stale saved rate to the updated value (40) once,
// so the new delivery pricing reaches returning users; later explicit edits still stick.
function runDeliveryMigrations() {
  try {
    const KEY = "dukkanci-delivery-migrations";
    const done = JSON.parse(localStorage.getItem(KEY) || "{}");
    const saved = JSON.parse(localStorage.getItem("dukkanci-delivery-settings") || "{}");
    let changed = false;
    if (!done.khawali40) {
      if (saved["31"] && saved["31"].ratePerKm !== 40) { saved["31"].ratePerKm = 40; changed = true; }
      done.khawali40 = true; changed = true;
    }
    // صفا الشام (store 50) named-zone fees were raised to 100 ل.ت (برستيج بارك + تيراس ميكس),
    // but saveState had frozen the old 50 ل.ت namedZones into each browser. Drop the stale
    // saved copy once so the bundled value reaches returning users; later edits still stick.
    if (!done.safaZones100) {
      if (saved["50"] && saved["50"].namedZones) { delete saved["50"].namedZones; changed = true; }
      done.safaZones100 = true; changed = true;
    }
    // كل متاجر «مطاعم» رُفع سعر التوصيل حسب المسافة من 15 إلى 20 ل.ت/كم (بما فيها
    // مطعم الخوالي الذي كان مخصَّصاً بـ40 — القرار: توحيد السعر الجديد على كل المطاعم).
    // نفس فئة خطأ khawali40 أعلاه: بلا هذا الإصلاح، أي متصفح زار الموقع سابقاً يحمل
    // نسخة مجمّدة من السعر القديم في localStorage تتغلّب على القيمة المجمَّعة الجديدة.
    if (!done.restaurantRate20) {
      const RESTAURANT_IDS = [15, 16, 17, 18, 20, 21, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 44, 45, 46, 47, 48, 51, 52, 53, 54, 55, 56, 58, 60, 61, 62, 63, 64, 65, 67, 69, 70, 71, 73, 74, 75, 76, 77, 86];
      RESTAURANT_IDS.forEach(id => {
        const key = String(id);
        if (saved[key] && saved[key].ratePerKm !== 20) { saved[key].ratePerKm = 20; changed = true; }
      });
      done.restaurantRate20 = true; changed = true;
    }
    if (changed) {
      localStorage.setItem("dukkanci-delivery-settings", JSON.stringify(saved));
      localStorage.setItem(KEY, JSON.stringify(done));
    }
  } catch (e) { /* localStorage unavailable — bundled value applies */ }
}

function loadDeliverySettings() {
  runDeliveryMigrations();
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

function loadUserLocation() {
  const saved = JSON.parse(localStorage.getItem("dukkanci-user-location") || "null");
  if (saved && Number.isFinite(saved.lat) && Number.isFinite(saved.lng)) return saved;
  return null;
}

function saveUserLocation() {
  if (state.userLocation) localStorage.setItem("dukkanci-user-location", JSON.stringify(state.userLocation));
  else localStorage.removeItem("dukkanci-user-location");
}

const state = {
  route: "home",
  cart: JSON.parse(localStorage.getItem("dukkanci-cart") || "[]"),
  favorites: JSON.parse(localStorage.getItem("dukkanci-favorites") || "[]"),
  orders: JSON.parse(localStorage.getItem("dukkanci-orders") || "null") || initialOrders,
  // The customer's OWN placed orders (kept separate from `orders`, which the
  // merchant/admin dashboards overwrite from the cloud).
  myOrders: JSON.parse(localStorage.getItem("dukkanci-my-orders") || "[]"),
  myOrdersFetched: false,
  // Customer notification inbox (api/notifications.js). Loaded lazily on boot;
  // null vs [] distinguishes "not fetched yet" from "fetched and empty".
  customerNotifications: null,
  customerNotifUnread: 0,
  reviewEligibility: {},  // storeId → { hasAnyOrder, hasReviewable, orderId } — checked lazily per store page visit
  storeFilter: "الكل",
  storeSort: "recommended",
  offersCategory: "الكل",
  search: "",
  coupon: null,            // Feature 2: applied coupon (validated via RPC), session-only
  referral: null,          // Feature 4: { code, balance } loaded for signed-in user
  useCredit: false,        // Feature 4: whether to spend wallet credit on this order
  accountTab: "orders",
  customerProfile: JSON.parse(localStorage.getItem("dukkanci-profile") || "null") || initialCustomerProfile,
  // A WhatsApp number the customer already verified (E.164 "+90…"); skips re-OTP on
  // later orders from the same number. Anti-fraud: a new number must verify once.
  verifiedPhone: localStorage.getItem("dukkanci-verified-phone") || null,
  customerAddresses: loadCustomerAddresses(),
  customerComplaints: JSON.parse(localStorage.getItem("dukkanci-complaints") || "null") || initialCustomerComplaints,
  deliverySettings: loadDeliverySettings(),
  storeLocations: loadStoreLocations(),
  userLocation: loadUserLocation(),
  locatingUser: false,
  storeProductFilter: "الكل",
  deliveryQuote: null,
  checkoutLocation: null,
  checkoutSelectedAddressId: null,
  merchantTab: "overview",
  merchantAnalytics: null, // per-store tracking report (null=unloaded, {loading}|{report}|{error})
  merchantAnalyticsFilter: { range: 30 },
  merchantStoreId: 5,
  merchantAuth: JSON.parse(localStorage.getItem("dukkanci-merchant-auth") || "null"),
  // Admin-issued phone+password merchant session (server-verified, subscription-gated).
  merchantPwAuth: JSON.parse(localStorage.getItem("dukkanci-merchant-session") || "null"),
  merchantLoginMode: "admin",
  merchantEmailMode: "signin",
  adminTab: "overview",
  adminAnalyticsRange: 30, // days for the overview analytics (0 = all time)
  adminAnalyticsMetric: "revenue", // "revenue" | "orders" — trend chart metric
  adminOrderStatus: "all", // orders tab status filter ("all" or a status label)
  adminOrderStore: "all",  // orders tab store filter ("all" or a storeId string)
  adminContentSection: null,
  adminMarketing: null, // tracking report (null=unloaded, {loading}|{report}|{error})
  adminMarketingFilter: { range: 30, store: "all" }, // marketing tab date-range + store filter
  siteSettings: {},
  adminKey: sessionStorage.getItem("dukkanci-admin-token") || null,
  adminCreds: null, // loaded store-login credentials list (null=unloaded, "error", or array)
  adminCredsWarn: null, // "service"|"write"|null — surfaced when credentials can't persist
  adminThreads: [],
  adminActiveWa: null,
  adminThread: null,
  adminThreadLoading: false,
  adminThreadFilter: null,   // null=all | "pinned" | a WA_LABELS key
  _waListSig: null,          // thread-list fingerprint (skip needless poll rebuilds)
  adminCampaigns: null,
  adminCampaignForm: null,   // null | "open" | "contacts"
  adminCampaignActive: null,
  adminContacts: null,       // { total, preview[], groups[] }
  adminCampaignErrors: null, // { id, rows[] }
  adminImages: null,         // null | { loading } | { list: [] }
  _campaignPollTimer: null,
  // Facebook Ads targeting tool — own isolated data (see api/fbads.js), no
  // relation to stores/products/customers.
  fbadsRegion: "esenyurt",
  fbadsRegions: null,        // null=unloaded, array once loaded
  fbadsCompounds: null,      // null=unloaded, array for the active region
  fbadsSettings: null,       // { rate_per_km }
  fbadsTargets: null,        // saved store analyses (list)
  fbadsActiveTargetId: null,
  fbadsActiveTarget: null,   // { target, distances } for the open panel
  fbadsMaxKm: 5,             // display-only classification threshold
  fbadsCompoundFormOpen: false,
  fbadsEditingCompoundId: null,
  fbadsRegionFormOpen: false,
  fbadsBusy: false,
  fbadsError: null,
  user: null,
  deferredInstall: null,
  // «اسأل دكانجي» — smart order-bundle assistant. Session-only (no persistence
  // needed across visits); result is null until the visitor submits the form.
  askDukkanci: {
    message: "",
    partySize: 6,
    budgetTry: 1000,
    includeDessert: true,
    includeDrinks: false,
    submitted: false,
    submitting: false,
    result: null,
    // Chat transcript: [{role:'user'|'assistant', text}], oldest first. The assistant only ever
    // asks clarifying questions here (grounded in the real category/store list) or signals it's
    // ready — it never proposes a product/store, so this stays purely conversational.
    messages: [],
    awaitingReply: false,
    lastIntent: null
  }
};

// Demo seller accounts (front-end only — for trying the merchant dashboard).
const MERCHANT_ACCOUNTS = [];

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
  tiktok: '<circle cx="9.5" cy="15.5" r="3.5"/><path d="M13 15.5V4.2c.6 2.3 2.5 3.9 5 4"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4.5"/><path d="m10.4 9.3 5.2 2.7-5.2 2.7V9.3Z"/>',
  headset: '<path d="M4 13v-1a8 8 0 0 1 16 0v1"/><rect x="2.5" y="13" width="4.2" height="6.5" rx="1.6"/><rect x="17.3" y="13" width="4.2" height="6.5" rx="1.6"/><path d="M19.4 19.5v.6a2.5 2.5 0 0 1-2.5 2.5H13"/>',
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
  dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  stars: '<path d="M12 2l1.5 4H18l-3.5 2.5 1.5 4L12 10l-4 2.5 1.5-4L6 6h4.5L12 2Z"/><path d="M5 17l.8 2H8l-1.8 1.3.7 2.2L5 21l-1.9 1.5.7-2.2L2 19h2.2L5 17Z"/><path d="M19 17l.8 2H22l-1.8 1.3.7 2.2L19 21l-1.9 1.5.7-2.2L16 19h2.2L19 17Z"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
  // Warning triangle. Added 2026-07-20 — there was no warning glyph at all, and
  // icon() falls back to `box` for an unknown name *silently*, so asking for a
  // missing icon renders a plausible-looking wrong shape with no console error.
  alert: '<path d="M12 4 2.5 20h19L12 4Z"/><path d="M12 10v4"/><path d="M12 17.2v.1"/>',
  percent: '<circle cx="7.5" cy="7.5" r="2.6"/><circle cx="16.5" cy="16.5" r="2.6"/><path d="M18 6 6 18"/>',
  clipboard: '<rect x="5" y="4" width="14" height="17" rx="2"/><rect x="9" y="2" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/>'
};

function icon(name, className = "") {
  return `<svg class="icon ${className}" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.box}</svg>`;
}

function brandLogo(extraClass = "") {
  return `<span class="brand brand-inline ${extraClass}"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt=""></span><span class="brand-wordmark"><strong>دكانجي</strong><small>سوق الحي بين يديك</small></span></span>`;
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

// Slug helpers: URLs use /store/<english-slug> (see store-slugs.js), but numeric
// /store/<id> still resolves for backward compatibility.
// Fixed canonical origin for anything that leaves the browser (share text,
// invite/QR links, feed URLs sent to third parties) — location.origin must NOT
// be used for these, or a *.vercel.app preview/deploy leaks into customer-facing
// links. Browser-redirect flows (OAuth, email confirm) still correctly use
// location.origin — they must return to whatever origin the user is actually on.
const SITE_ORIGIN = "https://www.dukkanci.com.tr";
const SLUG_MAP = (typeof STORE_SLUGS !== "undefined") ? STORE_SLUGS : {};
const SLUG_TO_ID = (typeof STORE_SLUG_TO_ID !== "undefined") ? STORE_SLUG_TO_ID : {};

// ASCII-only slugify: keeps Latin letters/digits, drops everything else (incl.
// Arabic — a mechanical transliteration reads worse than an id suffix). Callers
// append the store id so the result is always unique even when the name has no
// Latin characters at all (falls back to just "store-<id>").
function slugify(str) {
  const base = String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "store";
}
function autoStoreSlug(name, id) {
  return `${slugify(name)}-${id}`;
}

// The URL segment for a store: an admin-set DB slug, else the legacy static
// map (store-slugs.js), else an auto-generated slug — never a bare numeric id
// once the store has a name, so a new store never launches with an ugly /store/<id> URL.
function storeParam(store) {
  if (!store) return "";
  return store.slug || SLUG_MAP[store.id] || (store.name ? autoStoreSlug(store.name, store.id) : store.id) || "";
}

// Rule guard: every VISIBLE store MUST have a clean Latin slug in store-slugs.js — a
// missing one leaks an ugly /store/<number> URL. Warn loudly in dev so it's fixed
// before deploy. Hidden stores (pending/rejected) are skipped — they're never exposed.
function warnUnslugged() {
  try {
    const visible = store => typeof isStoreApproved !== "function" || isStoreApproved(store);
    const missing = stores.filter(store => store && store.id != null && !SLUG_MAP[store.id] && visible(store));
    if (missing.length) {
      console.warn(
        "[dukkanci] متاجر بلا رابط نظيف (أضِف slug في store-slugs.js):",
        missing.map(store => `${store.id} → ${store.name}`)
      );
    }
  } catch (e) { /* never block boot over a dev check */ }
}

function getStore(id) {
  if (typeof id === "string" && !/^\d+$/.test(id)) {
    const mapped = SLUG_TO_ID[id];
    if (mapped != null) return stores.find(store => store.id === mapped);
    // Not in the legacy static map — try an admin-set DB slug, then the same
    // auto-generated slug storeParam() would produce for this store.
    return stores.find(store => store.slug === id || (store.name && autoStoreSlug(store.name, store.id) === id));
  }
  return stores.find(store => store.id === Number(id));
}

function getMerchantStore() {
  return getStore(state.merchantStoreId) || stores[0];
}

function getProduct(id) {
  const numId = Number(id);
  return allProducts.find(product => product.id === numId) || products.find(product => product.id === numId);
}

function refreshPublishedProducts() {
  const published = applyPublishingRules(allProducts);
  products.length = 0;
  published.forEach(product => products.push(product));
}

function upsertCatalogProduct(product) {
  const numId = Number(product.id);
  const allIndex = allProducts.findIndex(item => item.id === numId);
  if (allIndex >= 0) allProducts[allIndex] = product;
  else allProducts.push(product);
  refreshPublishedProducts();
}

function saveState() {
  localStorage.setItem("dukkanci-cart", JSON.stringify(state.cart));
  localStorage.setItem("dukkanci-favorites", JSON.stringify(state.favorites));
  localStorage.setItem("dukkanci-orders", JSON.stringify(state.orders));
  localStorage.setItem("dukkanci-my-orders", JSON.stringify(state.myOrders));
  localStorage.setItem("dukkanci-profile", JSON.stringify(state.customerProfile));
  if (state.verifiedPhone) localStorage.setItem("dukkanci-verified-phone", state.verifiedPhone);
  localStorage.setItem("dukkanci-addresses", JSON.stringify(state.customerAddresses));
  localStorage.setItem("dukkanci-complaints", JSON.stringify(state.customerComplaints));
  localStorage.setItem("dukkanci-delivery-settings", JSON.stringify(state.deliverySettings));
  localStorage.setItem("dukkanci-store-locations", JSON.stringify(state.storeLocations));
  // Mirror a SUMMARY of the cart to the server so an abandoned cart is a thing
  // the platform can see. Debounced and content-deduped inside, so the many
  // saveState() calls that don't touch the cart cost nothing.
  if (typeof scheduleCartSync === "function") scheduleCartSync();
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
  // branch_name isn't a DB column; for branch groups the area is embedded in the
  // store name ("Brand - Area"), so derive branchName from it (else the branch
  // picker shows "undefined").
  const branchName = (r.branch_group && typeof r.name === "string" && r.name.includes(" - "))
    ? r.name.split(" - ").pop().trim()
    : undefined;
  return {
    id: r.id, name: r.name, slug: r.slug, category: r.category, image: r.image, coverImage: r.cover_image, branchName,
    logoImage: r.logo_image, logo: r.logo, rating: r.rating, reviews: r.reviews, newStore: r.new_store,
    delivery: r.delivery, minOrder: r.min_order, time: r.time, distance: r.distance,
    freeDeliveryThreshold: r.free_delivery_threshold,
    location: (r.lat != null && r.lng != null) ? { lat: r.lat, lng: r.lng } : undefined, mapUrl: r.map_url,
    // تقييمات Google الرسمية (قسم «دليل دكانجي» /dalil) — تُملأ من
    // scripts/update-google-ratings.js عبر Places API، وليست تقييمات المنصة.
    googlePlaceId: r.google_place_id || null,
    googleRating: r.google_rating != null ? Number(r.google_rating) : null,
    googleReviewsCount: r.google_reviews_count != null ? Number(r.google_reviews_count) : null,
    googleMapsUrl: r.google_maps_url || null,
    googleRatingUpdatedAt: r.google_rating_updated_at || null,
    open: r.open, featured: r.featured, hasOffer: r.has_offer, offer: r.offer, priceOnRequest: r.price_on_request,
    description: r.description, address: r.address, phone: r.phone, whatsapp: r.whatsapp, email: r.email,
    bankDetails: r.bank_details,
    // Which checkout payment methods this store accepts — defaults to all
    // three enabled when unset so existing stores keep today's behavior.
    paymentMethods: (r.payment_methods && typeof r.payment_methods === "object")
      ? { cash: r.payment_methods.cash !== false, card: r.payment_methods.card !== false, bank: r.payment_methods.bank !== false }
      : { cash: true, card: true, bank: true },
    website: r.website, sourceUrl: r.source_url, hours: r.hours, areas: r.areas, fulfillment: r.fulfillment,
    subscription: r.subscription, orderCount: r.order_count, officialStore: r.official_store,
    branchGroup: r.branch_group, brandTheme: r.brand_theme, approvalStatus: r.approval_status,
    subscriptionStatus: r.subscription_status, subscriptionActive: r.subscription_active !== false,
    trialEndsAt: r.trial_ends_at, currentPeriodEnd: r.current_period_end, whopMembershipId: r.whop_membership_id,
    // Phase 2 category-organizer overrides (admin+merchant) — read-only here on
    // purpose: written exclusively via action=save-store-categories (server-side
    // read-modify-write), never through the generic toDbStore()/save-store path,
    // so a stale client-side store save can never wipe these. See buildStoreCategoryPlan.
    categorySettings: (r.category_settings && typeof r.category_settings === "object") ? r.category_settings : {}
  };
}
function mapDbProduct(r) {
  return {
    id: r.id, storeId: r.store_id, sourceId: r.source_id, name: r.name, image: r.image, slug: r.slug,
    price: Number(r.price), oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
    priceOnRequest: r.price_on_request, unit: r.unit, category: r.category, available: r.available,
    featured: r.featured, description: r.description, imageFit: r.image_fit, options: r.options || [],
    addons: r.addons || [],
    // Traceability link back to the shared supermarket image bank ("مخزن الصور
    // المشترك") this product was imported from, if any — see catalog_products.
    catalogProductId: r.catalog_product_id ?? null,
    // Home-kitchen ("مطابخ منزلية") advance-order requirement in hours (0/24/48).
    advanceHours: Number(r.advance_hours) || 0
  };
}
function toDbProduct(p) {
  return {
    id: p.id, store_id: p.storeId, source_id: p.sourceId ?? null, name: p.name, image: p.image ?? null,
    price: p.price ?? 0, old_price: p.oldPrice ?? null, price_on_request: !!p.priceOnRequest,
    unit: p.unit ?? null, category: p.category ?? null, available: p.available !== false, featured: !!p.featured,
    description: p.description ?? null, image_fit: p.imageFit ?? null, options: p.options ?? [],
    addons: p.addons ?? [],
    catalog_product_id: p.catalogProductId ?? null,
    advance_hours: Number(p.advanceHours) || 0
  };
}
async function loadCatalogFromSupabase() {
  const sb = window.supabaseClient;
  if (!sb) return false;
  try {
    // Cloudflare edge-caches REST GET responses by URL and ignores the client's
    // Cache-Control/no-store, so a newly added store or product can stay missing until
    // the cached entry expires. A per-load, always-true id filter (ids are positive, so
    // id > -cb matches every row) varies the URL each load, forcing a fresh read.
    const cb = Date.now();
    const { data: st, error: e1 } = await sb.from("stores").select("*").order("id").gt("id", -cb);
    if (e1 || !st || !st.length) return false;
    let all = [], from = 0;
    for (;;) {
      const { data, error } = await sb.from("products").select("*").order("id").gt("id", -cb).range(from, from + 999);
      if (error) return false;
      all = all.concat(data);
      if (data.length < 1000) break;
      from += 1000;
    }
    if (!all.length) return false;
    stores.length = 0; st.forEach(r => stores.push(mapDbStore(r)));
    const mapped = all.map(mapDbProduct);
    allProducts.length = 0; mapped.forEach(p => allProducts.push(p));   // full catalog for panels
    const published = applyPublishingRules(mapped);
    products.length = 0; published.forEach(p => products.push(p));
    console.info(`Supabase: loaded ${stores.length} stores, ${published.length}/${mapped.length} products (publishing rules dropped ${mapped.length - published.length})`);
    warnUnslugged();   // flag any visible store still exposed by its numeric id
    return true;
  } catch (e) { console.warn("Supabase load failed:", e.message); return false; }
}

// A store added straight to Supabase (no bundled fallback entry in the `stores`
// array above) is otherwise invisible everywhere — home, category pages, search,
// not just its own deep-link — until the full ~7600-product catalog load above
// finishes. That load is deliberately deferred (see initCatalog), so such a store
// randomly seems to "appear and disappear" depending on how fast the visitor's
// connection is and whether they load the page again before it finishes. Fetch
// just the `stores` table (small, no products) right away and merge in any DB
// row not yet in the bundled list, so it's visible on first paint everywhere.
async function loadStoresOnly() {
  const sb = window.supabaseClient;
  if (!sb) return false;
  try {
    const cb = Date.now(); // vary the URL to dodge Cloudflare's edge cache
    const { data: st, error } = await sb.from("stores").select("*").order("id").gt("id", -cb);
    if (error || !st || !st.length) return false;
    let added = 0;
    st.forEach(r => { if (!stores.some(s => s.id === r.id)) { stores.push(mapDbStore(r)); added++; } });
    if (added) warnUnslugged();
    return added > 0;
  } catch (e) { console.warn("Supabase stores load failed:", e.message); return false; }
}

// Dialect synonyms for on-site search: product_id → normalized alt-name string.
// Loaded once after the catalog; getMatchingProducts folds it into the search
// haystack so a query in any dialect («رقي» / «karpuz» / «بطاطس») still finds the
// product («بطيخ» / «بطاطا»). Only generated (status=done) rows carry synonyms, so
// this stays tiny until the admin generates them.
const productSynonymIndex = new Map();
async function loadSynonymIndex() {
  const sb = window.supabaseClient;
  if (!sb) return;
  try {
    let from = 0;
    for (;;) {
      const { data, error } = await sb.from("product_synonyms").select("product_id,synonyms").eq("status", "done").range(from, from + 999);
      if (error || !data) break;
      for (const r of data) {
        if (Array.isArray(r.synonyms) && r.synonyms.length) productSynonymIndex.set(r.product_id, normalizeAr(r.synonyms.join(" ")));
      }
      if (data.length < 1000) break;
      from += 1000;
    }
  } catch (e) { /* on-site search still works without synonyms */ }
}

// On-demand catalog hydration. A /store/<id>, /product/<slug> or /offers deep-link
// must NOT wait for the full ~7600-product catalog (loadCatalogFromSupabase loads
// it all, paginated — several seconds). Instead fetch only the rows this route
// needs, merge them, and re-render. Deduped + guarded so it never double-fetches
// or fights the background full load (which later supersedes it with the complete set).
const _hydratedKeys = new Set();
function _mergeProducts(rows) {
  if (!rows || !rows.length) return false;
  let added = 0;
  rows.map(mapDbProduct).forEach(p => { if (!allProducts.some(x => x.id === p.id)) { allProducts.push(p); added++; } });
  if (!added) return false;
  const published = applyPublishingRules(allProducts);
  products.length = 0; published.forEach(p => products.push(p));
  return true;
}
async function hydratePageData() {
  const sb = window.supabaseClient;
  if (!sb) return;
  const { route, id } = parseRoute();
  const cb = Date.now();
  // A store added straight to Supabase (no bundled fallback entry in the `stores`
  // array below) is invisible to getStore() until the full ~7600-product catalog
  // load finishes, so its deep-link renders "not found" on every hard refresh in
  // the meantime. Fetch that one store row (+ its products) directly instead of
  // waiting on the full load.
  if (route === "store" && id != null && !getStore(id)) {
    const rowKey = "store-row:" + id;
    if (_hydratedKeys.has(rowKey)) return;
    _hydratedKeys.add(rowKey);
    try {
      const numId = /^\d+$/.test(String(id)) ? Number(id) : (SLUG_TO_ID[id] || null);
      const { data: rows } = numId != null
        ? await sb.from("stores").select("*").eq("id", numId).gt("id", -cb)
        : await sb.from("stores").select("*").eq("slug", id).gt("id", -cb);
      const row = rows && rows[0];
      if (row) {
        if (!stores.some(s => s.id === row.id)) stores.push(mapDbStore(row));
        const { data: prodRows } = await sb.from("products").select("*").eq("store_id", row.id).gt("id", -cb);
        _mergeProducts(prodRows);
      }
    } catch (e) { /* the background full load will fill this in */ }
    render();
    return;
  }
  let key, needed, run;
  if (route === "store" && id != null) {
    const sid = Number(id) || (getStore(id) || {}).id;
    if (sid == null) return;
    key = "store:" + sid; needed = !products.some(p => p.storeId === sid);
    run = () => sb.from("products").select("*").eq("store_id", sid).gt("id", -cb);
  } else if (route === "product" && id != null) {
    key = "product:" + id; needed = !getProductBySlug(id);
    const nid = Number(id);
    run = () => Number.isFinite(nid)
      ? sb.from("products").select("*").or(`slug.eq.${id},id.eq.${nid}`).gt("id", -cb)
      : sb.from("products").select("*").eq("slug", id).gt("id", -cb);
  } else if (route === "offers") {
    key = "offers"; needed = !products.some(p => p.oldPrice && p.available);
    run = () => sb.from("products").select("*").not("old_price", "is", null).gt("id", -cb);
  } else return;
  if (!needed || _hydratedKeys.has(key)) return;
  _hydratedKeys.add(key);
  try {
    const { data, error } = await run();
    if (!error && _mergeProducts(data)) render();
  } catch (e) { /* the background full load will fill this in */ }
}

// Fire-and-forget: ask the server to notify Google's Indexing API about a URL.
// No-ops on the server when credentials aren't configured.
function notifyGoogleIndex(path) {
  try {
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    const withAuth = headers["x-admin-token"] || headers["x-merchant-token"] || !window.supabaseClient
      ? Promise.resolve(headers)
      : window.supabaseClient.auth.getSession().then(({ data }) => {
          const tok = data && data.session && data.session.access_token;
          if (tok) headers["x-sb-token"] = tok;
          return headers;
        }).catch(() => headers);
    withAuth.then(headers => fetch("/api/notify-google", {
      method: "POST", headers,
      body: JSON.stringify({ url: SITE_ORIGIN + path })
    })).catch(() => {});
  } catch (e) { /* ignore */ }
}

async function pushProductCloud(product) {
  // Merchant/admin sessions have no Supabase Auth (auth.uid() = null), so RLS
  // blocks a direct upsert. Route through the backend API (service-role key).
  if (state.adminKey || (state.merchantPwAuth && state.merchantPwAuth.token)) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    try {
      const response = await fetch("/api/notify-order?action=save-product", {
        method: "POST",
        headers,
        body: JSON.stringify({ product: toDbProduct(product), storeId: product.storeId })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.ok !== false) {
        notifyGoogleIndex(`/product/${product.slug || product.id}`);
        return { ok: true };
      }
      return { ok: false, status: response.status, error: data.error || "save failed", detail: data.detail };
    } catch (error) {
      return { ok: false, error: error.message || "network failed" };
    }
  }
  const sb = window.supabaseClient;
  if (!sb) return { ok: false, error: "supabase unavailable" };
  const { error } = await sb.from("products").upsert(toDbProduct(product), { onConflict: "id" });
  if (error) {
    console.warn("product cloud save:", error.message);
    return { ok: false, error: error.message };
  }
  notifyGoogleIndex(`/product/${product.slug || product.id}`);
  return { ok: true };
}

function productSaveErrorMessage(result) {
  if (result && result.status === 403) return "انتهت جلسة المتجر. سجّل الدخول من جديد ثم أعد الحفظ.";
  if (result && result.status === 413) return "الصورة كبيرة جداً. جرّب صورة أصغر أو اضغط تحسين الصورة أولاً.";
  return "تعذّر حفظ المنتج على الخادم. لم يتم اعتماد التعديل.";
}

function toDbStore(s) {
  return {
    id: s.id, name: s.name, slug: s.slug || null, category: s.category, image: s.image, cover_image: s.coverImage,
    logo_image: s.logoImage, logo: s.logo, rating: s.rating, reviews: s.reviews, new_store: !!s.newStore,
    delivery: s.delivery, min_order: s.minOrder, time: s.time, distance: s.distance,
    lat: s.location?.lat ?? null, lng: s.location?.lng ?? null, map_url: s.mapUrl, open: s.open !== false,
    featured: !!s.featured, has_offer: !!s.hasOffer, offer: s.offer ?? null, price_on_request: !!s.priceOnRequest,
    description: s.description ?? null, address: s.address ?? null, phone: s.phone ?? null, whatsapp: s.whatsapp ?? null,
    email: s.email ?? null, bank_details: s.bankDetails ?? null,
    payment_methods: s.paymentMethods ?? { cash: true, card: true, bank: true },
    website: s.website ?? null, source_url: s.sourceUrl ?? null, hours: s.hours ?? null,
    areas: s.areas ?? [], fulfillment: s.fulfillment ?? null, subscription: s.subscription ?? null,
    order_count: s.orderCount ?? 0, official_store: !!s.officialStore, branch_group: s.branchGroup ?? null, brand_theme: s.brandTheme ?? null
  };
}
async function pushStoreCloud(store) {
  const headers = { "Content-Type": "application/json" };
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  if (!headers["x-admin-token"] && !headers["x-merchant-token"] && window.supabaseClient) {
    try {
      const { data } = await window.supabaseClient.auth.getSession();
      const tok = data && data.session && data.session.access_token;
      if (tok) headers["x-sb-token"] = tok;
    } catch (e) {}
  }
  try {
    const r = await fetch("/api/notify-order?action=save-store", {
      method: "POST", headers, body: JSON.stringify({ store: toDbStore(store) })
    });
    if (r.ok) { notifyGoogleIndex(`/store/${storeParam(store)}`); return { ok: true }; }
    const e = await r.json().catch(() => ({}));
    console.warn("store cloud save:", e.error || r.status);
    if ((r.status === 401 || r.status === 403) && headers["x-merchant-token"]) handleMerchantSessionExpired();
    return { ok: false, status: r.status, error: e.error };
  } catch (e) { console.warn("store cloud save:", e.message); return { ok: false, error: e.message }; }
}
// A merchant password-token session (state.merchantPwAuth.token) expires 12h
// after login server-side (signMerchantToken), but the client never checked
// for that — only for a token missing entirely — so a merchant who stayed
// logged in past 12h kept seeing every save silently fail (403) with a
// misleading "check your connection" message instead of being told to log
// back in. Call this on any 401/403 from a merchant-token request to clear
// the stale session and bounce to the login screen with an accurate reason.
function handleMerchantSessionExpired() {
  if (!state.merchantPwAuth) return;
  stopMerchantOrderWatch();
  state.merchantAuth = null;
  state.merchantStores = null;
  state.merchantPwAuth = null;
  state._merchantResolved = false;
  state._merchantOrdersFetched = false;
  localStorage.removeItem("dukkanci-merchant-session");
  state.merchantLoginMode = "admin";
  showToast("انتهت صلاحية الجلسة، الرجاء تسجيل الدخول من جديد", "");
  render();
}
// Right after a merchant self-registers, write the SAME password they just chose
// (Supabase Auth) into store_credentials too, so the admin-issued phone+password
// login mode — which checks store_credentials, not Supabase Auth — doesn't end up
// requiring a different, auto-generated password than the one the owner set.
async function syncOwnerCredentials(storeId, phone, password) {
  if (!phone || !password) return;
  try {
    const { data } = await window.supabaseClient.auth.getSession();
    const tok = data && data.session && data.session.access_token;
    if (!tok) return;
    await fetch(`/api/notify-order?action=sync-owner-credentials&storeId=${storeId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-sb-token": tok },
      body: JSON.stringify({ storeId, phone, password })
    });
  } catch (e) { console.warn("owner credentials sync:", e.message); }
}
function deleteProductCloud(id) {
  const numId = Number(id);
  // Merchant/admin sessions have no Supabase Auth (auth.uid() = null), so RLS
  // blocks a direct DELETE. Route through the backend API (service-role key)
  // for these sessions, exactly like update-order does.
  if (state.adminKey || (state.merchantPwAuth && state.merchantPwAuth.token)) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    const store = getMerchantStore();
    // Returns a Promise<boolean> so deleteProduct() can confirm the row is
    // actually gone server-side before removing it from the merchant's UI.
    return fetch("/api/notify-order?action=delete-product", {
      method: "POST",
      headers,
      body: JSON.stringify({ id: numId, storeId: store ? store.id : undefined })
    }).then(r => {
      if (!r.ok) { r.json().then(e => console.warn("product delete:", e.error)).catch(() => {}); return false; }
      return true;
    }).catch(e => { console.warn("product delete:", e.message); return false; });
  }
  const sb = window.supabaseClient;
  if (!sb) return Promise.resolve(true);
  return sb.from("products").delete().eq("id", numId).then(({ error }) => {
    if (error) { console.warn("product delete:", error.message); return false; }
    return true;
  });
}
// The orders table has fixed columns + a flexible delivery_details jsonb. We pack
// every field the merchant needs to FULFILL the order (phone, address, the actual
// line items, notes) into delivery_details so no schema migration is required.
function pushOrderCloud(order, opts = {}) {
  // Admin and phone+password merchant sessions have no Supabase Auth (auth.uid() is null),
  // so the RLS UPDATE policy blocks them. Route status updates through the backend API
  // (service-role key) for these sessions. New customer orders always use the anon client
  // (INSERT policy allows any anon for approved stores).
  if (state.adminKey || (state.merchantPwAuth && state.merchantPwAuth.token)) {
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    // Returns a Promise<boolean> (never rejects) so callers that need to confirm the
    // write actually landed (e.g. save-order-status) can await it; fire-and-forget
    // callers are unaffected since they don't consume the return value.
    return fetch("/api/notify-order?action=update-order", {
      method: "POST", headers,
      body: JSON.stringify({ id: order.id, storeId: order.storeId, status: order.status, items: order.items })
    }).then(r => { if (!r.ok) throw new Error("HTTP " + r.status); return true; })
      .catch(e => { console.warn("order cloud update:", e.message); return false; });
  }
  // Anon (customer placing new order) or Supabase-authenticated merchant
  const sb = window.supabaseClient;
  if (!sb) return;
  const payload = {
    id: order.id, store_id: order.storeId, customer: order.customer, total: order.total,
    status: order.status, time: order.time, items: order.items,
    delivery_details: {
      quote: order.deliveryDetails ?? null,
      phone: order.customerPhone || "",
      phoneKey: (order.customerPhone || "").replace(/\D/g, ""),
      fulfillment: order.fulfillment || "delivery",
      address: order.address || "",
      addressDetails: order.addressDetails || "",
      lineItems: order.lineItems || [],
      notes: order.notes || "",
      substitution: order.substitution || "",
      payment: order.payment || "",
      scheduleDay: order.scheduleDay || "",
      scheduleTime: order.scheduleTime || "",
      closedWhenOrdered: order.closedWhenOrdered || false,
      createdAt: order.createdAt || ""
    }
  };
  // Feature 1: link the order to the signed-in customer (per-customer features +
  // cross-device history). Only added when the flag is on AND the user is signed
  // in, so guest orders and the flag-off path keep the exact same payload.
  if (isFeatureOn("feature_customer_accounts") && state.user) {
    payload.customer_id = state.user.id;
    payload.customer_phone = order.customerPhone || "";
  }
  // Campaign attribution (first/last source + UTM + landing) — for "which ad drove this order".
  if (order.attribution) payload.attribution = order.attribution;
  // New-order creation races the browser closing/backgrounding right after checkout
  // (mobile customers routinely background the tab as soon as the success modal
  // shows) — that can abort an in-flight fetch before it reaches the server, so the
  // order silently never saves. keepalive keeps THIS request alive past that point.
  // Not applied to the shared supabase-js client globally: bulk writes elsewhere
  // (e.g. product catalog saves) can exceed the browser's ~64KB keepalive body quota
  // and would throw. A direct PostgREST call is safe here — the "guest insert" RLS
  // policy allows this INSERT with just the anon key regardless of session.
  // NOTE: this is now a best-effort SECONDARY save — notifyOrderWhatsapp's request
  // to /api/notify-order (same-origin, service-role) is the authoritative write, since
  // this cross-origin call has proven to silently vanish under the exact backgrounding
  // scenario above on some mobile browsers. Kept as a redundant fast-path when it works;
  // upsert on_conflict=id makes running both saves harmless.
  if (opts.keepalive && window.SUPABASE_URL && window.SUPABASE_ANON_KEY) {
    fetch(`${window.SUPABASE_URL}/rest/v1/orders?on_conflict=id`, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: window.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${window.SUPABASE_ANON_KEY}`,
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(payload)
    }).then(r => { if (!r.ok) console.warn("order cloud save: HTTP " + r.status); })
      .catch(e => console.warn("order cloud save:", e.message));
    return;
  }
  sb.from("orders").upsert(payload, { onConflict: "id" }).then(({ error }) => { if (error) console.warn("order cloud save:", error.message); });
}
// Fire-and-forget WhatsApp notification through the platform number: alerts the
// store of the new order and sends the customer a confirmation. The serverless
// endpoint no-ops until the WhatsApp number is configured (see api/notify-order.js),
// so this is safe to call always and never blocks the order flow.
// This same request is also the platform's AUTHORITATIVE save of the order into
// Supabase (see api/notify-order.js) — it's a same-origin, service-role write, far
// more reliable than pushOrderCloud's direct cross-origin insert, so every field
// the merchant needs to fulfill the order must be included here too, not just the
// fields needed for the WhatsApp message text.
function notifyOrderWhatsapp(order) {
  try {
    // keepalive: the browser can otherwise abort this request if the customer
    // backgrounds/closes the tab right after checkout (very common on mobile
    // right after the success modal appears) — killing every notification copy.
    fetch("/api/notify-order", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id, storeId: order.storeId, customer: order.customer,
        customerPhone: order.customerPhone, total: order.total,
        fulfillment: order.fulfillment, address: order.address,
        payment: order.payment, lineItems: order.lineItems,
        status: order.status, time: order.time, items: order.items,
        addressDetails: order.addressDetails, notes: order.notes,
        substitution: order.substitution, scheduleDay: order.scheduleDay,
        scheduleTime: order.scheduleTime, closedWhenOrdered: order.closedWhenOrdered,
        createdAt: order.createdAt, deliveryQuote: order.deliveryDetails,
        customerId: (isFeatureOn("feature_customer_accounts") && state.user) ? state.user.id : undefined,
        attribution: order.attribution
      })
    }).catch(() => {});
  } catch (e) { /* notifications must never break checkout */ }
}
// Notify the customer of an order STATUS change (confirmed, preparing, ready,
// out for delivery, completed, rejected) through the platform number. Sends the
// `order_status_update` template; fire-and-forget so a status save never blocks.
function notifyOrderStatusWhatsapp(order, note) {
  try {
    const store = getStore(order.storeId);
    // Send whatever auth the dashboard has so the server can authorize the call:
    // admins use the admin token; phone+password merchants use the merchant token.
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    fetch("/api/notify-order?action=status", {
      method: "POST",
      headers,
      body: JSON.stringify({
        id: order.id, storeId: order.storeId, customerPhone: order.customerPhone,
        storeName: store ? store.name : "المتجر", status: order.status, note: note || ""
      })
    }).catch(() => {});
  } catch (e) { /* notifications must never break the dashboard */ }
}
function mapDbOrder(r) {
  const dd = (r.delivery_details && typeof r.delivery_details === "object") ? r.delivery_details : {};
  // Legacy rows stored the raw delivery quote directly in delivery_details (no `quote` key).
  const quote = ("quote" in dd) ? dd.quote : ((dd.roundTripKm != null || dd.fee != null) ? dd : null);
  return {
    id: r.id, storeId: r.store_id, customer: r.customer, total: Number(r.total) || 0,
    status: r.status, time: r.time, items: r.items,
    customerPhone: dd.phone || "", fulfillment: dd.fulfillment || (quote ? "delivery" : "pickup"),
    address: dd.address || "", addressDetails: dd.addressDetails || "",
    lineItems: Array.isArray(dd.lineItems) ? dd.lineItems : [], notes: dd.notes || "",
    substitution: dd.substitution || "", payment: dd.payment || "",
    scheduleDay: dd.scheduleDay || "", scheduleTime: dd.scheduleTime || "",
    deliveryDetails: quote, createdAt: dd.createdAt || r.created_at || ""
  };
}
// Customer-facing: load THIS customer's orders (matched by phone) from the cloud,
// so "طلباتي" shows real orders and tracks them across devices.
async function loadCustomerOrdersFromSupabase(phoneKey) {
  const ids = (state.myOrders || []).map(o => o.id).filter(Boolean);
  if (!phoneKey && !ids.length) return false;
  try {
    const params = new URLSearchParams({ action: "customer-orders" });
    if (phoneKey) params.set("phone", phoneKey);
    if (ids.length) params.set("ids", ids.slice(0, 50).join(","));
    const r = await fetch(`/api/notify-order?${params}`);
    if (!r.ok) return false;
    const json = await r.json().catch(() => ({}));
    const rows = Array.isArray(json.orders) ? json.orders : [];
    if (!rows.length) return false;
    const mapped = rows.map(mapDbOrder);
    // Merge cloud orders (fresh status) over local ones; keep any local guest
    // orders not yet in the cloud, then re-sort newest-first.
    const localOnly = (state.myOrders || []).filter(o => !mapped.some(m => m.id === o.id));
    state.myOrders = [...mapped, ...localOnly]
      .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    return true;
  } catch (e) { console.warn("customer orders load failed:", e.message); return false; }
}

// Called when the customer opens "طلباتي": pull fresh order rows from the cloud so
// status updates the store made (already pushed to WhatsApp) actually show on the
// site. Without this the page only ever showed the status frozen in localStorage at
// checkout ("طلب جديد"). Fire-and-forget; re-renders only if still on the page.
async function refreshMyOrdersFromCloud() {
  const phoneKey = ((state.customerProfile && state.customerProfile.phone) || "").replace(/\D/g, "");
  const ok = await loadCustomerOrdersFromSupabase(phoneKey);
  if (ok) { saveState(); if (state.route === "orders") render(); }
}

// ─────────── Feature 1: customer account cloud-sync (feature_customer_accounts) ───────────
// Mirrors the customer's profile + saved addresses to Supabase so they follow a
// signed-in user across devices. Guests are completely unaffected (localStorage
// only). Everything is gated behind the flag; when it's off, nothing here runs.

// Replace this user's cloud address set with the current local set. Addresses are
// few and change rarely, so a delete+insert keeps add/edit/delete/default in sync
// without per-row id mapping; the full client object is stored verbatim in `data`.
async function syncAddressesToCloud() {
  if (!isFeatureOn("feature_customer_accounts")) return;
  const sb = window.supabaseClient;
  const uid = state.user && state.user.id;
  if (!sb || !uid) return;
  try {
    await sb.from("customer_addresses").delete().eq("customer_id", uid);
    const rows = (state.customerAddresses || []).map(a => ({
      customer_id: uid, client_id: Number(a.id) || null,
      label: a.label || null, is_default: !!a.isDefault, data: a
    }));
    if (rows.length) await sb.from("customer_addresses").insert(rows);
  } catch (e) { console.warn("address cloud sync:", e.message); }
}

// On sign-in: ensure a profiles row exists, then pull cloud addresses. Cloud is the
// source of truth for a signed-in user; if the cloud has none yet but this device
// does (added while a guest), push those up so the first login migrates them
// instead of losing them.
async function loadCustomerCloud() {
  if (!isFeatureOn("feature_customer_accounts")) return;
  const sb = window.supabaseClient;
  const uid = state.user && state.user.id;
  if (!sb || !uid) return;
  try {
    await sb.from("profiles").upsert({
      id: uid,
      full_name: state.customerProfile.name || null,
      phone: state.customerProfile.phone || null,
      updated_at: new Date().toISOString()
    }, { onConflict: "id" });
    const { data: addrs } = await sb.from("customer_addresses")
      .select("data").eq("customer_id", uid).order("id", { ascending: true });
    if (Array.isArray(addrs) && addrs.length) {
      state.customerAddresses = addrs.map(r => r.data).filter(Boolean);
      saveState();
      if (state.route === "account" || state.route === "checkout") render();
    } else if ((state.customerAddresses || []).length) {
      await syncAddressesToCloud();   // first login on a device that already had addresses
    }
  } catch (e) { console.warn("customer cloud load:", e.message); }
}

// ─────────── Store reviews: verified-purchase rating + comment ───────────
// Only a customer with a completed order at this exact store may review it
// (enforced again server-side by RLS — this client check is just for UI).
// "مكتمل"/"تم التوصيل" are the two successful terminal statuses (see orderProgress).
const REVIEW_ELIGIBLE_STATUSES = ["مكتمل", "تم التوصيل"];
async function ensureReviewEligibility(storeId) {
  if (!isFeatureOn("feature_customer_accounts") || !state.user) return;
  if (storeId in state.reviewEligibility) return; // already checked (or in flight) this session
  const sb = window.supabaseClient;
  if (!sb) return;
  state.reviewEligibility[storeId] = null; // in-flight guard
  try {
    // Cloudflare edge-caches PostgREST GET responses by URL (see loadCatalogFromSupabase);
    // vary the URL each call so a just-submitted review isn't masked by a stale cache hit.
    const cb = Date.now();
    const { data: myOrders } = await sb.from("orders").select("id")
      .eq("store_id", storeId).eq("customer_id", state.user.id)
      .in("status", REVIEW_ELIGIBLE_STATUSES).neq("id", "__cb" + cb)
      .order("created_at", { ascending: false });
    const orderIds = (myOrders || []).map(o => o.id);
    let reviewedIds = [];
    if (orderIds.length) {
      const { data: myReviews } = await sb.from("store_reviews").select("order_id").in("order_id", orderIds).gt("id", -cb);
      reviewedIds = (myReviews || []).map(r => r.order_id);
    }
    const orderId = orderIds.find(id => !reviewedIds.includes(id)) || null;
    state.reviewEligibility[storeId] = { hasAnyOrder: orderIds.length > 0, hasReviewable: !!orderId, orderId };
  } catch (e) {
    state.reviewEligibility[storeId] = { hasAnyOrder: false, hasReviewable: false, orderId: null };
  }
  const cur = parseRoute();
  if (cur.route === "store" && getStore(cur.id)?.id === storeId) render();
}
// Pull just this store's fresh rating/reviews count after the DB trigger recomputes them.
async function refreshStoreRatingFromCloud(storeId) {
  const sb = window.supabaseClient;
  if (!sb) return;
  try {
    const cb = Date.now(); // dodge Cloudflare's edge cache on this exact GET URL
    const { data } = await sb.from("stores").select("rating,reviews").eq("id", storeId).gt("id", -cb).single();
    const store = getStore(storeId);
    if (data && store) { store.rating = data.rating; store.reviews = data.reviews; }
  } catch (e) { /* aggregate refresh is best-effort */ }
}
async function submitStoreReview(storeId, orderId, rating, comment) {
  const sb = window.supabaseClient;
  if (!sb || !state.user || !orderId) return false;
  try {
    const { error } = await sb.from("store_reviews").insert({
      store_id: storeId, order_id: orderId, customer_id: state.user.id,
      customer_name: (state.customerProfile && state.customerProfile.name) || null,
      rating, comment: comment || null
    });
    if (error) throw error;
    delete state.reviewEligibility[storeId];
    await Promise.all([ensureReviewEligibility(storeId), refreshStoreRatingFromCloud(storeId)]);
    return true;
  } catch (e) { console.warn("submit review:", e.message); return false; }
}
// Fetches the individual review list for the "reviews details" modal (public read).
async function loadStoreReviews(storeId) {
  const sb = window.supabaseClient;
  if (!sb) return [];
  try {
    const cb = Date.now(); // dodge Cloudflare's edge cache so a fresh review shows immediately
    const { data } = await sb.from("store_reviews").select("rating,comment,customer_name,created_at")
      .eq("store_id", storeId).gt("id", -cb).order("created_at", { ascending: false }).limit(50);
    return data || [];
  } catch (e) { return []; }
}
// Map an order status to the 5-step tracking progress shown to the customer.
function orderProgress(status) {
  const map = {
    "طلب جديد": { steps: 1, color: "orange" },
    "بانتظار الدفع": { steps: 1, color: "orange" },
    "تم القبول": { steps: 2, color: "green" },
    "قيد التجهيز": { steps: 3, color: "blue" },
    "جاهز للاستلام": { steps: 4, color: "green" },
    "خرج للتوصيل": { steps: 4, color: "blue" },
    "مكتمل": { steps: 5, color: "green" },
    "تم التوصيل": { steps: 5, color: "green" },
    "مرفوضة": { steps: 0, color: "red" },
    "ملغى": { steps: 0, color: "red" }
  };
  return map[status] || { steps: 1, color: "gray" };
}
function formatOrderDate(iso) {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
  catch (e) { return ""; }
}
// Split date/time for the orders tables (merchant + admin): the "time" column used to
// show a static "الآن" snapshot frozen at order creation instead of the real timestamp.
function formatOrderDateOnly(iso) {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)); }
  catch (e) { return ""; }
}
function formatOrderTimeOnly(iso) {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
  catch (e) { return ""; }
}
// Merchants must see orders placed from ANY device, so the dashboard reads them
// back from the cloud (the previous version only pushed, never loaded).
// RLS on the orders table requires auth.uid(); admin and pw-auth merchant sessions
// have no Supabase session, so we route those reads through the backend API (service-role key).
async function loadOrdersFromSupabase(storeId) {
  const sb = window.supabaseClient;
  try {
    // Admin (no storeId): use the admin-gated API endpoint (service-role key bypasses RLS)
    if (!storeId && state.adminKey) {
      const r = await fetch("/api/notify-order?action=orders", {
        headers: { "x-admin-token": state.adminKey }
      });
      if (!r.ok) return false;
      const json = await r.json().catch(() => ({}));
      if (!Array.isArray(json.orders)) return false;
      state.orders = json.orders.map(mapDbOrder);
      return true;
    }
    // Merchant (phone+password session): use the merchant-gated API endpoint
    if (storeId && state.merchantPwAuth && state.merchantPwAuth.token) {
      const r = await fetch(`/api/notify-order?action=store-orders&storeId=${storeId}`, {
        headers: { "x-merchant-token": state.merchantPwAuth.token }
      });
      if (!r.ok) {
        if (r.status === 401 || r.status === 403) handleMerchantSessionExpired();
        return false;
      }
      const json = await r.json().catch(() => ({}));
      if (!Array.isArray(json.orders)) return false;
      const mapped = json.orders.map(mapDbOrder);
      const others = state.orders.filter(o => o.storeId !== Number(storeId));
      state.orders = [...mapped, ...others.filter(o => !mapped.some(m => m.id === o.id))];
      return true;
    }
    // Supabase Auth path (authenticated user with store_users link): direct client read
    if (!sb) return false;
    const cb = Date.now(); // vary the URL to dodge Cloudflare's edge cache
    let q = sb.from("orders").select("*").order("created_at", { ascending: false }).neq("id", "__cb" + cb);
    if (storeId) q = q.eq("store_id", storeId);
    const { data, error } = await q;
    if (error || !data) return false;
    const mapped = data.map(mapDbOrder);
    const others = state.orders.filter(o => storeId ? o.storeId !== Number(storeId) : false);
    state.orders = [...mapped, ...others.filter(o => !mapped.some(m => m.id === o.id))];
    return true;
  } catch (e) { console.warn("orders load failed:", e.message); return false; }
}
async function initCatalog() {
  await window.__supabaseReady;
  loadSiteSettings();
  // Reflect feature flags (integration_settings) on first paint once they finish
  // loading — integrations.js fetches them async, so re-render when they're ready.
  Promise.resolve(window.DUKKANCI_INTEGRATIONS && window.DUKKANCI_INTEGRATIONS.load()).then(() => render()).catch(() => {});
  // Merge any Supabase-only stores (added directly to the DB with no bundled
  // fallback entry) into the list right away — don't make them wait on the
  // deferred, heavy product load below just to become visible.
  loadStoresOnly().then(added => { if (added) render(); });
  // Defer the heavy full-catalog load (~7600 products) so /store, /product and
  // /offers deep-links hydrate just their own rows first (hydratePageData) and
  // render fast, instead of competing with the full load for bandwidth. Stores
  // come from bundled data (now topped up by loadStoresOnly above) meanwhile,
  // so home/stores stay populated.
  await new Promise(r => setTimeout(r, 1800));
  const ok = await loadCatalogFromSupabase();
  if (ok) render();
  else { applyProductPersistence(); render(); }
  // Fold dialect synonyms into on-site search once the catalog is in.
  loadSynonymIndex().then(() => { if (productSynonymIndex.size) render(); });
}

// Load editable site content (subscription plan, etc.) from the public
// `site_settings` table into state.siteSettings. Defensive + non-blocking: any
// failure (table missing, offline, RLS) leaves siteSettings empty so the UI
// falls back to its built-in defaults — it never breaks the catalog or page.
async function loadSiteSettings() {
  const sb = window.supabaseClient;
  if (!sb) return;
  try {
    // Same Cloudflare edge-cache-by-URL issue as loadCatalogFromSupabase: this query's
    // URL never changes, so a merchant's zone/setting edit can stay invisible to other
    // visitors until the cached response expires. Vary the URL every load to bust it.
    const cb = Date.now();
    const { data, error } = await sb.from("site_settings").select("key,value").neq("key", "__cb" + cb);
    if (error || !Array.isArray(data)) return;
    const map = {};
    data.forEach(r => { map[r.key] = r.value; });
    state.siteSettings = map;
    if (map.namedZones && typeof map.namedZones === "object") {
      Object.entries(map.namedZones).forEach(([sid, zones]) => {
        const id = Number(sid);
        state.deliverySettings[id] = { ...(state.deliverySettings[id] || initialDeliverySettings[id] || {}), namedZones: zones };
      });
    }
    // Admin force-hidden product ids -> re-derive the storefront list (panels use allProducts).
    HIDDEN_PRODUCTS = new Set((((map.hiddenProducts && map.hiddenProducts.ids) || [])).map(Number));
    MOST_ORDERED_PRODUCTS = new Set((((map.mostOrdered && map.mostOrdered.ids) || [])).map(Number));
    if (allProducts.length) { const kept = applyPublishingRules(allProducts); products.length = 0; kept.forEach(p => products.push(p)); }
    render();
  } catch (e) { /* keep defaults */ }
}

// ---- Google sign-in via Supabase Auth ----
// Synthetic emails minted for WhatsApp-OTP logins (wa<digits>@otp.dukkanci.app)
// are an internal identity handle, not a real address — never surface them.
const OTP_LOGIN_EMAIL_DOMAIN = "@otp.dukkanci.app";
function isSyntheticEmail(email) { return /@otp\.dukkanci\.app$/i.test(String(email || "")); }

function applyUserToProfile(user) {
  if (!user) return;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || (state.customerProfile.name || "");
  const realEmail = user.email && !isSyntheticEmail(user.email) ? user.email : "";
  // user.phone (GoTrue, no "+") or the metadata phone we stamped on WhatsApp login.
  const phone = meta.phone || (user.phone ? "+" + String(user.phone).replace(/\D/g, "") : "");
  state.customerProfile = {
    ...state.customerProfile,
    name: name || state.customerProfile.name,
    email: realEmail || state.customerProfile.email,
    phone: state.customerProfile.phone || phone,
    avatar: meta.avatar_url || meta.picture || state.customerProfile.avatar
  };
  saveState();
}

function updateAccountButton() {
  const btn = document.querySelector(".account-button");
  if (!btn) return;
  const u = state.user;
  const name = u ? (state.customerProfile.name || state.customerProfile.email || state.customerProfile.phone || "حسابي") : "حسابي";
  const initial = (name && name.trim()[0]) || "م";
  // Only show the saved avatar while signed in — otherwise a logged-out header
  // would keep the previous user's picture and look "still logged in".
  const avatar = u ? state.customerProfile.avatar : null;
  btn.innerHTML = `<span class="avatar-mini">${avatar ? `<img src="${escAttr(avatar)}" alt="">` : initial}</span><span class="account-copy"><small>${u ? "مرحباً" : "مرحباً بك"}</small><strong>${u ? name.split(" ")[0] : "حسابي"}</strong></span>`;
}

async function initAuth() {
  await window.__supabaseReady;
  const sb = window.supabaseClient;
  if (!sb || !sb.auth) return;
  try {
    const { data } = await sb.auth.getSession();
    if (data && data.session) {
      state.user = data.session.user; applyUserToProfile(state.user);
      loadCustomerCloud();
      loadReferralData();
      // Returning from an email-confirmation / Google redirect mid-signup → finish the store.
      if (hasPendingJoin()) setTimeout(finalizePendingJoin, 0);
    }
  } catch (e) { /* ignore */ }
  updateAccountButton();
  sb.auth.onAuthStateChange((event, session) => {
    state.user = session ? session.user : null;
    if (state.user) applyUserToProfile(state.user);
    else if (event === "SIGNED_OUT") clearUserIdentity();
    updateAccountButton();
    if (event === "SIGNED_IN") {
      state._merchantResolved = false; state._merchantResolving = false; closeModal();
      loadCustomerCloud();
      loadReferralData();
      // If the user authenticated mid-way through creating a store, finish it now.
      if (hasPendingJoin()) { finalizePendingJoin(); }
      else showToast(`مرحباً ${(state.customerProfile.name || "").split(" ")[0] || "بك"} 👋`, "success");
    }
    if (event === "SIGNED_OUT") { state.merchantAuth = null; state.merchantStores = null; state._merchantResolved = false; showToast("تم تسجيل الخروج", "success"); }
    if (state.route === "orders" || state.route === "merchant") render();
  });
}

// ---- Auth / verification feature flags ----------------------------------
// Phone-number login and OTP verification (WhatsApp / SMS) are turned OFF until
// the WhatsApp/OTP delivery service is operational. The whole phone-OTP code
// path is kept intact behind these flags — flip a flag to `true` to re-enable
// it instantly with no other change.
const AUTH_FLAGS = {
  phoneOtpLogin: true, // Supabase phone OTP login (customer + merchant)
  checkoutOtp: true    // WhatsApp OTP gate before placing an order
};

// Friendly Arabic message for a Supabase auth error.
function authErrorAr(error, fallback) {
  const m = (error && error.message) || "";
  if (/Email not confirmed/i.test(m)) return "لم تُفعّل بريدك بعد. افتح رسالة التفعيل في بريدك ثم سجّل الدخول.";
  if (/Invalid login credentials/i.test(m)) return "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
  if (/User already registered|already been registered/i.test(m)) return "هذا البريد مسجّل من قبل. سجّل الدخول بدل إنشاء حساب.";
  if (/Password should be at least|at least 6/i.test(m)) return "كلمة المرور قصيرة جداً (٦ أحرف على الأقل).";
  if (/rate limit|too many/i.test(m)) return "محاولات كثيرة، انتظر قليلاً ثم حاول مجدداً.";
  if (/provider is not enabled|not enabled|not configured/i.test(m)) return "خدمة الدخول غير مُفعّلة بعد في الإعدادات.";
  if (/network|fetch/i.test(m)) return "تعذّر الاتصال بالخادم. تحقّق من اتصالك ثم حاول مجدداً.";
  return fallback || (m || "تعذّر إتمام العملية، حاول مجدداً.");
}

// Basic email shape check (UI-side only; Supabase is the source of truth).
function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
}

// Sign in with email + password. On success, onAuthStateChange(SIGNED_IN)
// closes the modal and refreshes the UI. Returns true on success.
async function signInWithEmail(email, password, { errEl, btn } = {}) {
  const sb = window.supabaseClient;
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  if (errEl) errEl.hidden = true;
  if (!isValidEmail(email)) { showErr("أدخل بريداً إلكترونياً صحيحاً."); return false; }
  if (!password) { showErr("أدخل كلمة المرور."); return false; }
  if (!sb || !sb.auth) { showErr("الخدمة غير متاحة حالياً."); return false; }
  const restore = setBtnBusy(btn, "جارٍ الدخول…");
  const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) { restore(); showErr(authErrorAr(error, "تعذّر تسجيل الدخول.")); return false; }
  return true; // SIGNED_IN handler takes over
}

// Create an account with email + password. `meta` is stored on the user
// (e.g. full_name). Handles the email-confirmation case gracefully: if the
// Supabase project requires confirmation, no session is returned — we surface a
// "check your inbox" state instead of pretending the user is logged in.
async function signUpWithEmail(email, password, meta = {}, { errEl, btn, onConfirmNeeded } = {}) {
  const sb = window.supabaseClient;
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  if (errEl) errEl.hidden = true;
  if (!isValidEmail(email)) { showErr("أدخل بريداً إلكترونياً صحيحاً."); return false; }
  if (!password || password.length < 6) { showErr("اختر كلمة مرور من ٦ أحرف على الأقل."); return false; }
  if (!sb || !sb.auth) { showErr("الخدمة غير متاحة حالياً."); return false; }
  const restore = setBtnBusy(btn, "جارٍ إنشاء الحساب…");
  const { data, error } = await sb.auth.signUp({
    email: email.trim(), password,
    options: { data: meta, emailRedirectTo: location.origin + location.pathname }
  });
  if (error) { restore(); showErr(authErrorAr(error, "تعذّر إنشاء الحساب.")); return false; }
  // Session present → confirmation disabled → user is logged in immediately.
  if (data && data.session) return true; // SIGNED_IN handler takes over
  // No session → email confirmation required.
  restore();
  if (typeof onConfirmNeeded === "function") onConfirmNeeded(email.trim());
  return "confirm";
}

// Send a password-reset email. Best-effort; we always show the same neutral
// message so the form can't be used to probe which emails exist.
async function sendPasswordReset(email, { errEl, btn } = {}) {
  const sb = window.supabaseClient;
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  if (!isValidEmail(email)) { showErr("أدخل بريدك الإلكتروني أولاً ثم اضغط \"نسيت كلمة المرور\"."); return; }
  if (!sb || !sb.auth) { showErr("الخدمة غير متاحة حالياً."); return; }
  const restore = setBtnBusy(btn, "جارٍ الإرسال…");
  try { await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo: location.origin + location.pathname }); }
  catch (e) { /* ignore — neutral response below */ }
  restore();
  showToast("إن كان البريد مسجّلاً ستصلك رسالة لإعادة تعيين كلمة المرور.", "success");
}

// Toggle a submit button into a busy state and return a restore() callback.
function setBtnBusy(btn, label) {
  if (!btn) return () => {};
  btn.disabled = true;
  btn.dataset.label = btn.dataset.label || btn.innerHTML;
  btn.textContent = label;
  return () => { btn.disabled = false; btn.innerHTML = btn.dataset.label || btn.textContent; };
}

// Handle the shared email+password auth form (used by the customer login modal
// and the merchant login screen). data-mode = "signin" | "signup".
async function submitEmailAuth(form) {
  const f = new FormData(form);
  const email = (f.get("email") || "").toString().trim();
  const password = (f.get("password") || "").toString();
  const name = (f.get("name") || "").toString().trim();
  const errEl = form.querySelector(".auth-error") || document.getElementById("email-auth-error");
  const btn = form.querySelector('button[type="submit"]');
  if (form.dataset.mode === "signup") {
    await signUpWithEmail(email, password, name ? { full_name: name } : {}, {
      errEl, btn, onConfirmNeeded: openCheckEmailModal
    });
  } else {
    await signInWithEmail(email, password, { errEl, btn });
  }
}

// Shown after sign-up when the Supabase project requires email confirmation.
function openCheckEmailModal(email) {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>فعّل بريدك الإلكتروني</h2>
    <p>أرسلنا رابط تفعيل إلى <strong dir="ltr">${escAttr(email)}</strong>. افتح الرسالة واضغط الرابط، ثم عُد وسجّل الدخول.</p>
    <button class="primary-button full large" data-action="auth-switch-signin">${icon("check")} حسناً، سأسجّل الدخول</button>
    <p class="merchant-auth__note">${icon("shield")} لم تصلك الرسالة؟ تحقّق من مجلد البريد المزعج (Spam).</p>
  `, "auth-modal");
}

async function signInWithGoogle() {
  const sb = window.supabaseClient;
  if (!sb || !sb.auth) { showToast("الخدمة غير متاحة حالياً"); return; }
  const { error } = await sb.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: location.origin + location.pathname }
  });
  if (error) {
    showToast(/provider is not enabled|not enabled/i.test(error.message) ? "تسجيل Google غير مُفعّل بعد في إعدادات Supabase" : "تعذّر بدء تسجيل الدخول عبر Google");
  }
}

// Reset the signed-in identity (name/email/avatar) so nothing from the previous
// user lingers in the header, account page, or checkout prefill after logout.
function clearUserIdentity() {
  state.customerProfile = { ...initialCustomerProfile };
  state.referral = null; state.useCredit = false;   // Feature 4: drop wallet state on logout
  saveState();
}

async function signOutUser() {
  const sb = window.supabaseClient;
  if (sb && sb.auth) await sb.auth.signOut();
  state.user = null;
  clearUserIdentity();
  updateAccountButton();
  render();
}

// ---- WhatsApp OTP login via Supabase phone auth ----
function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("90")) d = d.slice(2);
  d = d.replace(/^0+/, "");
  return "+90" + d;
}

async function sendWhatsappOtp(form) {
  const sb = window.supabaseClient;
  const errEl = document.getElementById("login-error");
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  const phone = normalizePhone(form.phone.value);
  if (phone.length < 12) { showErr("يرجى إدخال رقم واتساب صحيح."); return; }
  if (!sb || !sb.auth) { showErr("الخدمة غير متاحة حالياً."); return; }
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = "جارٍ الإرسال..."; }
  // Deliver the code via OUR Meta WhatsApp number (the same proven sender as
  // checkout), NOT Supabase's phone provider. Login can't fail-open, so a soft
  // "delivery unavailable" is surfaced as an error rather than silently passed.
  const r = await sendOrderOtpRequest(phone);
  if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || "إرسال رمز التحقق"; }
  if (r && r.ok) { openOtpModal(phone); return; }
  if (r && r.reason === "too_soon") showErr(`انتظر ${r.retryInSec || 30} ثانية ثم أعد المحاولة.`);
  else if (r && r.reason === "rate_limited") showErr("تجاوزت عدد محاولات الإرسال، حاول لاحقاً.");
  else if (r && r.reason === "bad_phone") showErr("يرجى إدخال رقم واتساب صحيح.");
  else showErr("تعذّر إرسال الرمز عبر واتساب، تأكد من الرقم وحاول مجدداً.");
}

// The WhatsApp OTP forces customers to leave the browser tab to read the code,
// then struggle to switch back — WebOTP/SMS autofill can't help here because the
// code arrives via WhatsApp, not an SMS the OS can parse. This closes that gap
// with the Clipboard API instead: once the customer copies the code in WhatsApp
// (long-press → Copy) and returns to the tab, the code is picked up automatically.
// A visible "لصق الرمز" button covers browsers/cases where the passive read is
// blocked without a direct user gesture (mainly iOS Safari).
function setupOtpAutofill(input, form) {
  if (!input || !form) return;
  const expectedLen = input.maxLength > 0 ? input.maxLength : 6;
  const digitsFrom = txt => (String(txt || "").match(/\d/g) || []).join("");
  const tryFill = raw => {
    if (!input.isConnected || input.value) return false; // don't clobber what the customer is already typing
    const digits = digitsFrom(raw);
    if (digits.length < 4 || digits.length > expectedLen + 2) return false;
    input.value = digits.slice(0, expectedLen);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    if (input.value.length >= expectedLen && typeof form.requestSubmit === "function") form.requestSubmit();
    return true;
  };
  const onVisible = () => {
    if (!input.isConnected) { document.removeEventListener("visibilitychange", onVisible); window.removeEventListener("focus", onVisible); return; }
    if (document.visibilityState !== "visible" || !navigator.clipboard || !navigator.clipboard.readText) return;
    navigator.clipboard.readText().then(tryFill).catch(() => {}); // no permission yet — the paste button covers it
  };
  input.addEventListener("paste", e => {
    const txt = (e.clipboardData && e.clipboardData.getData("text")) || "";
    if (digitsFrom(txt).length >= 4) { e.preventDefault(); tryFill(txt); }
  });
  document.addEventListener("visibilitychange", onVisible);
  window.addEventListener("focus", onVisible);
  onVisible(); // covers the code already being on the clipboard when the modal opens
}

function openOtpModal(phone) {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>أدخل رمز التحقق</h2><p>أرسلنا رمزاً عبر واتساب إلى <strong dir="ltr">${escAttr(phone)}</strong></p>
    <form id="otp-form" data-phone="${escAttr(phone)}">
      <label class="input-label"><span>رمز التحقق</span><input name="token" inputmode="numeric" autocomplete="one-time-code" required placeholder="######" dir="ltr" maxlength="8"></label>
      <button class="secondary-button full otp-paste-button" type="button" data-action="paste-otp">${icon("clipboard")} لصق الرمز من واتساب</button>
      <p class="auth-error" id="otp-error" hidden></p>
      <button class="primary-button full large" type="submit">${icon("check")} تأكيد الدخول</button>
    </form>
    <button class="text-button" data-action="resend-otp" data-phone="${escAttr(phone)}">إعادة إرسال الرمز</button>
  `, "auth-modal");
  setupOtpAutofill(document.querySelector("#otp-form input[name='token']"), document.getElementById("otp-form"));
}

async function verifyWhatsappOtp(form) {
  const sb = window.supabaseClient;
  const errEl = document.getElementById("otp-error");
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  const phone = form.dataset.phone;
  const code = form.token.value.trim();
  if (!code) { showErr("يرجى إدخال الرمز."); return; }
  if (!sb || !sb.auth) { showErr("الخدمة غير متاحة حالياً."); return; }
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = "جارٍ التحقق…"; }
  // Verify the WhatsApp code on our server; on success it returns a single-use
  // magiclink token we exchange for a real Supabase session.
  let r;
  try {
    r = await fetch("/api/notify-order?action=verify-login-otp", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code })
    }).then(x => x.json());
  } catch (e) { r = { ok: false, reason: "network" }; }
  if (!r || !r.ok) {
    if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || "تأكيد الدخول"; }
    showErr(r && r.reason === "expired" ? "انتهت صلاحية الرمز، أعد الإرسال."
          : r && r.reason === "too_many" ? "محاولات كثيرة، اطلب رمزاً جديداً."
          : r && (r.reason === "mint_failed" || r.reason === "no_service_role") ? "تعذّر إتمام الدخول، حاول مجدداً لاحقاً."
          : "الرمز غير صحيح، حاول مجدداً.");
    return;
  }
  // Exchange the minted token for a session. token_hash is preferred; fall back
  // to the email OTP. onAuthStateChange(SIGNED_IN) then closes the modal + greets.
  const { error } = r.tokenHash
    ? await sb.auth.verifyOtp({ token_hash: r.tokenHash, type: "magiclink" })
    : await sb.auth.verifyOtp({ email: r.email, token: r.emailOtp, type: "magiclink" });
  if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || "تأكيد الدخول"; }
  if (error) showErr(authErrorAr(error, "تعذّر إتمام الدخول، حاول مجدداً."));
  // success -> onAuthStateChange (SIGNED_IN) closes the modal and updates the UI
}

// ---- Checkout WhatsApp OTP (anti-fraud: verify the phone before placing the order) ----
// Self-contained (custom /api/notify-order?action=send-order-otp / verify-order-otp),
// independent of Supabase phone-auth. `pendingOtpCommit` holds the "place the order"
// callback to run once the code is verified.
let pendingOtpCommit = null;

async function sendOrderOtpRequest(phone) {
  try {
    const r = await fetch("/api/notify-order?action=send-order-otp", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone })
    });
    return await r.json().catch(() => ({ ok: false, soft: true }));
  } catch (e) { return { ok: false, soft: true }; }
}

// Gate order placement behind a WhatsApp OTP. The server now hard-blocks
// (r.soft:false) whenever WhatsApp is configured — no confirmed number, no
// order — so this only falls through unverified when WhatsApp isn't set up at
// all server-side, the ORDER_OTP_ALLOW_SOFT kill switch is on, or this fetch
// itself fails (the customer's own network is down, which would also break the
// order write right after).
async function startCheckoutOtp(phone, displayPhone, onVerified) {
  // Set AUTH_FLAGS.checkoutOtp = false to bypass this gate and place orders directly
  // (e.g. if WhatsApp delivery needs to be disabled again).
  if (!AUTH_FLAGS.checkoutOtp) { onVerified(); return; }
  pendingOtpCommit = onVerified;
  showToast("جارٍ إرسال رمز التحقق إلى واتساب…");
  const r = await sendOrderOtpRequest(phone);
  if (r && r.ok) { openOrderOtpModal(phone, displayPhone); return; }
  if (!r || r.soft) { pendingOtpCommit = null; onVerified(); return; } // only when WhatsApp itself is unavailable
  pendingOtpCommit = null;
  if (r.reason === "too_soon") showToast(`انتظر ${r.retryInSec || 30} ثانية ثم أعد المحاولة`);
  else if (r.reason === "rate_limited") showToast("تجاوزت عدد محاولات الإرسال، حاول لاحقاً");
  else if (r.reason === "bad_phone") showToast("رقم واتساب غير صحيح");
  else showToast("تعذّر إرسال رمز التحقق، تأكد من رقم واتساب");
}

function openOrderOtpModal(phone, displayPhone) {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>تأكيد رقم الواتساب</h2>
    <p>لمنع الطلبات الوهمية، أرسلنا رمزاً من 6 أرقام عبر واتساب إلى <strong dir="ltr">${escAttr(displayPhone || phone)}</strong>. أدخله لتأكيد طلبك.</p>
    <form id="order-otp-form" data-phone="${escAttr(phone)}">
      <label class="input-label"><span>رمز التحقق</span><input name="code" inputmode="numeric" autocomplete="one-time-code" required placeholder="------" dir="ltr" maxlength="6"></label>
      <button class="secondary-button full otp-paste-button" type="button" data-action="paste-otp">${icon("clipboard")} لصق الرمز من واتساب</button>
      <p class="auth-error" id="order-otp-error" hidden></p>
      <button class="primary-button full large" type="submit">${icon("check")} تأكيد وإرسال الطلب</button>
    </form>
    <button class="text-button" data-action="resend-order-otp" data-phone="${escAttr(phone)}">إعادة إرسال الرمز</button>
  `, "auth-modal");
  setupOtpAutofill(document.querySelector("#order-otp-form input[name='code']"), document.getElementById("order-otp-form"));
}

async function verifyOrderOtp(form) {
  const errEl = document.getElementById("order-otp-error");
  const showErr = m => { if (errEl) { errEl.textContent = m; errEl.hidden = false; } };
  const phone = form.dataset.phone;
  const code = (form.code.value || "").trim();
  if (!code) { showErr("يرجى إدخال الرمز."); return; }
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; btn.dataset.label = btn.innerHTML; btn.textContent = "جارٍ التحقق…"; }
  let r;
  try {
    r = await fetch("/api/notify-order?action=verify-order-otp", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ phone, code })
    }).then(x => x.json());
  } catch (e) { r = { ok: false }; }
  if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || "تأكيد وإرسال الطلب"; }
  if (r && r.ok) {
    state.verifiedPhone = phone; saveState();
    // submit_phone (Meta Lead) — phone confirmed via WhatsApp OTP at checkout.
    window.DUKKANCI_TRACKING?.track("submit_phone", { phone: phone });
    closeModal();
    const cb = pendingOtpCommit; pendingOtpCommit = null;
    if (cb) cb();
    return;
  }
  showErr(r && r.reason === "expired" ? "انتهت صلاحية الرمز، أعد الإرسال."
        : r && r.reason === "too_many" ? "محاولات كثيرة، اطلب رمزاً جديداً."
        : "الرمز غير صحيح، حاول مجدداً.");
}

async function resendOrderOtp(phone) {
  const r = await sendOrderOtpRequest(phone);
  if (r && r.ok) showToast("تم إرسال رمز جديد عبر واتساب", "success");
  else if (r && r.reason === "too_soon") showToast(`انتظر ${r.retryInSec || 30} ثانية ثم أعد المحاولة`);
  else if (r && r.reason === "rate_limited") showToast("تجاوزت عدد المحاولات، حاول لاحقاً");
  else showToast("تعذّر إرسال الرمز");
}

// Fallback so a store that is in the cloud catalog but not yet in the bundled
// delivery config (e.g. a freshly pushed store whose frontend PR hasn't deployed)
// still renders with a sane delivery estimate instead of crashing the store page.
const DEFAULT_DELIVERY_SETTINGS = { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 };
function getDeliverySettings(storeId) {
  const settings = state.deliverySettings[Number(storeId)] || initialDeliverySettings[Number(storeId)] || DEFAULT_DELIVERY_SETTINGS;
  // Distance mode needs a store lat/lng to price anything. Stores added directly
  // (e.g. via a raw Supabase insert) can end up with no coordinates and no explicit
  // delivery settings, defaulting to DEFAULT_DELIVERY_SETTINGS's "distance" mode —
  // that leaves the quote permanently null, showing a ٠ fee and disabling checkout.
  // Fall back to a fixed fee so the customer is never stuck.
  if (settings.mode === "distance" && !getStoreLocation(storeId)?.lat) {
    return { ...settings, mode: "fixed", fixedFee: settings.fixedFee || DEFAULT_DELIVERY_SETTINGS.fixedFee };
  }
  return settings;
}

function getStoreLocation(storeId) {
  return state.storeLocations[Number(storeId)] || getStore(storeId)?.location;
}

// The auto-detected location acts as a virtual address ("موقعي الحالي") so
// delivery is priced from it by default, before the user saves any address.
function getUserLocationAddress() {
  const u = state.userLocation;
  if (!u || !Number.isFinite(u.lat) || !Number.isFinite(u.lng)) return null;
  return { id: "current", label: "موقعي الحالي", address: u.area || "موقعي الحالي", details: "", lat: u.lat, lng: u.lng, isCurrent: true };
}

function getCheckoutAddress(addressId) {
  if (String(addressId) === "current") return state.checkoutLocation || getUserLocationAddress();
  return state.customerAddresses.find(address => String(address.id) === String(addressId));
}

function getDefaultAddress() {
  return state.customerAddresses.find(address => address.isDefault) || state.customerAddresses[0] || getUserLocationAddress();
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

// --- Multi-branch helpers --------------------------------------------------
// A branch group = several stores (same brand, same products) in different areas.
// When a buyer enters we surface the branch NEAREST to them, so fulfillment and
// distance-based delivery pricing come from the closest shop.
function branchGroupStores(branchGroup) {
  return stores.filter(s => s.branchGroup === branchGroup);
}
function branchDistanceKm(store) {
  const u = state.userLocation;
  if (!u || u.lat == null || !store.location || store.location.lat == null) return null;
  return haversineKm(u, store.location);
}
function nearestBranchId(branchGroup, fallbackId) {
  const list = branchGroupStores(branchGroup).filter(s => s.location && s.location.lat != null);
  if (!list.length) return fallbackId;
  const u = state.userLocation;
  if (!u || u.lat == null) return fallbackId != null ? fallbackId : list[0].id;
  let best = list[0], bestKm = Infinity;
  for (const b of list) {
    const km = haversineKm(u, b.location);
    if (km < bestKm) { bestKm = km; best = b; }
  }
  return best.id;
}
// Collapse each branch group to a single representative card (its nearest branch)
// so the brand appears once in listings; opening it lands on the closest branch.
function collapseBranchGroups(list) {
  const seen = new Set();
  const out = [];
  for (const s of list) {
    if (s.branchGroup) {
      if (seen.has(s.branchGroup)) continue;
      seen.add(s.branchGroup);
      out.push(getStore(nearestBranchId(s.branchGroup, s.id)) || s);
    } else {
      out.push(s);
    }
  }
  return out;
}
// Order stores by the visitor's TRUE distance (from geolocation), nearest first.
// Stores we can't measure — no coordinates, or the visitor hasn't shared their
// location yet — fall back to the static distance hint and sort last.
function compareStoresByDistance(a, b) {
  const da = branchDistanceKm(a), db = branchDistanceKm(b);
  if (da != null && db != null) return da - db;
  if (da != null) return -1;
  if (db != null) return 1;
  return (a.distance || 0) - (b.distance || 0);
}

// Delivery-fee policy: a 150 ل.ت minimum (covers the nearest/shortest trip),
// and anything above is rounded UP to the next multiple of 50 (160 → 200).
function normalizeDeliveryFee(rawFee) {
  return Math.max(150, Math.ceil((rawFee || 0) / 50) * 50);
}

function estimateDeliveryQuote(store, address) {
  const settings = getDeliverySettings(store.id);
  if (settings.namedZones?.length && address) {
    // "tr" locale casing so Turkish İ/I fold correctly (plain toLowerCase() turns
    // "İ" into a dotted combining form that never matches a plain "i" keyword).
    const addrText = [address.label, address.address, address.details].join(" ").toLocaleLowerCase("tr");
    // Pick the LONGEST matching keyword across all zones (not the first configured
    // zone) so a more specific zone (e.g. "esenyurt merkez") always wins over a
    // broader one ("esenyurt") regardless of the admin's zone ordering.
    let bestZone = null, bestLen = -1;
    for (const z of settings.namedZones) {
      for (const k of z.match) {
        const needle = String(k || "").toLocaleLowerCase("tr");
        if (needle && addrText.includes(needle) && needle.length > bestLen) { bestZone = z; bestLen = needle.length; }
      }
    }
    if (bestZone) return { storeId: store.id, addressId: address.id, fee: bestZone.fee, provider: "zone", zoneLabel: bestZone.label, estimatedMinutes: settings.prepMinutes, exceedsMaxDistance: false };
  }
  if (settings.mode === "distance" && (!address || address.lat == null || address.lng == null)) return null;
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
  const exceedsMaxDistance = roundTripKm > settings.maxRoundTripKm;
  // A store may ship out-of-range orders nationwide by cargo courier instead of
  // refusing them outright — a flat fee replaces the per-km one and the "exceeds
  // range" gate never fires downstream (cartTotals/checkout submit both key off
  // exceedsMaxDistance alone), so this is the ONLY place nationwide shipping needs
  // wiring in. See hasNationwideShipping() for the store-card/page badge.
  if (exceedsMaxDistance && settings.nationwideFlatFee > 0) {
    return {
      storeId: store.id,
      addressId: address.id,
      oneWayKm,
      roundTripKm,
      routeMinutes,
      estimatedMinutes: settings.prepMinutes + routeMinutes,
      fee: settings.nationwideFlatFee,
      provider: "nationwide",
      exceedsMaxDistance: false
    };
  }
  const rawFee = Math.round(roundTripKm * settings.ratePerKm);
  return {
    storeId: store.id,
    addressId: address.id,
    oneWayKm,
    roundTripKm,
    routeMinutes,
    estimatedMinutes: settings.prepMinutes + routeMinutes,
    rawFee,
    fee: normalizeDeliveryFee(rawFee),
    ratePerKm: settings.ratePerKm,
    provider: "estimate",
    exceedsMaxDistance
  };
}

// Store ships out-of-local-range orders nationwide by cargo (flat fee), instead of
// refusing them — surfaced as a badge near the store name/card. Single source of
// truth is deliverySettings itself (no separate store-object flag to keep in sync).
function hasNationwideShipping(store) {
  return Number(getDeliverySettings(store.id)?.nationwideFlatFee) > 0;
}

function renderZoneRow(z, i) {
  return `<div class="named-zone-row" data-zone="${i}">
    <input name="zone-label-${i}" class="zone-label" placeholder="اسم المنطقة (مثال: برستيج بارك)" value="${escAttr(z.label || "")}">
    <input name="zone-match-${i}" class="zone-match" placeholder="كلمات مطابقة، مفصولة بفاصلة" value="${escAttr((z.match || []).join(", "))}">
    <div class="input-with-unit zone-fee-wrap"><input name="zone-fee-${i}" type="number" min="0" value="${z.fee || 0}"><b>ل.ت</b></div>
    <button type="button" class="icon-button named-zone-delete" data-action="remove-zone" data-zone="${i}" title="حذف">${icon("trash")}</button>
  </div>`;
}

function saveNamedZonesCloud(storeId, zones) {
  const all = (state.siteSettings.namedZones && typeof state.siteSettings.namedZones === "object") ? { ...state.siteSettings.namedZones } : {};
  if (zones.length) all[String(storeId)] = zones; else delete all[String(storeId)];
  state.siteSettings = { ...state.siteSettings, namedZones: all };
  state.deliverySettings[storeId] = { ...state.deliverySettings[storeId], namedZones: zones };
  saveState();
  // Persist through the merchant/admin-gated endpoint. Merchants have a merchant
  // token (not an admin token), so the admin-only "save-settings" action 403s for
  // them — route to "save-store-zones", which authorizes the store's own merchant
  // and merges server-side. Customers (no privileged session) save locally only.
  const headers = { "Content-Type": "application/json" };
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  if (!headers["x-admin-token"] && !headers["x-merchant-token"]) return;
  fetch("/api/notify-order?action=save-store-zones", {
    method: "POST", headers,
    body: JSON.stringify({ storeId, zones })
  }).then(r => {
    if (r.status === 403) { if (state.adminKey) lockAdmin(); throw new Error("unauthorized"); }
    if (!r.ok) throw new Error(`request failed (${r.status})`);
    return r.json().catch(() => ({}));
  }).then(data => {
    // Adopt the server's merged map so we don't keep a partial local view.
    if (data && data.value && typeof data.value === "object") {
      state.siteSettings = { ...state.siteSettings, namedZones: data.value };
      saveState();
    }
  }).catch(() => showToast("تعذّر الحفظ السحابي لمناطق التوصيل", ""));
}

function activeDeliveryQuote(store, address) {
  const quote = state.deliveryQuote;
  if (quote && quote.storeId === store.id && String(quote.addressId) === String(address?.id)) return quote;
  return estimateDeliveryQuote(store, address);
}

function deliveryPriceLabel(store) {
  const settings = getDeliverySettings(store.id);
  if (!settings) return "حسب المسافة";
  return settings.mode === "distance" ? `حسب المسافة · ${money(settings.ratePerKm)}/كم` : money(settings.fixedFee);
}

function deliverySortValue(store) {
  return activeDeliveryQuote(store, getDefaultAddress())?.fee ?? Number.POSITIVE_INFINITY;
}

function formatDistance(value) {
  return `${Number(value || 0).toLocaleString("ar-EG", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} كم`;
}

// ───────────────────────── Feature flags ─────────────────────────
// Flags live in the `integration_settings` table and are preloaded app-wide by
// integrations.js into DUKKANCI_INTEGRATIONS.settings. Default OFF when the row
// is absent or settings haven't loaded yet, so a half-ready feature never flashes.
// Flip is_enabled (admin "التكامل" panel / SQL) to toggle a feature instantly — no redeploy.
function isFeatureOn(key) {
  const s = window.DUKKANCI_INTEGRATIONS && window.DUKKANCI_INTEGRATIONS.settings[key];
  return !!(s && s.is_enabled);
}

// ───────────────── Feature 3: tighter delivery ETA (feature_eta_tightening) ─────────────────
// Tunable via site_settings.eta_config; falls back to these defaults when absent.
const ETA_DEFAULTS = { default_prep_min: 15, avg_speed_kmh: 18, buffer_min: 8 };
function etaConfig() {
  const c = (state.siteSettings && state.siteSettings.eta_config) || {};
  return {
    default_prep_min: Number(c.default_prep_min) || ETA_DEFAULTS.default_prep_min,
    avg_speed_kmh: Number(c.avg_speed_kmh) || ETA_DEFAULTS.avg_speed_kmh,
    buffer_min: Number(c.buffer_min) || ETA_DEFAULTS.buffer_min
  };
}
// Tight {low, high} minute window, or null when we can't measure store→customer
// distance (visitor hasn't shared location / store has no coords). Prep time reuses
// the per-store deliverySettings.prepMinutes already configured by each merchant.
function estimateEta(store) {
  const km = branchDistanceKm(store);
  if (km == null) return null;
  const cfg = etaConfig();
  const prep = Number(getDeliverySettings(store.id) && getDeliverySettings(store.id).prepMinutes) || cfg.default_prep_min;
  const travel = (km / cfg.avg_speed_kmh) * 60;
  const mid = prep + travel + cfg.buffer_min;
  return { low: Math.max(10, Math.round(mid - 5)), high: Math.round(mid + 5) };
}
// The clock/time chip. Shows the tight estimate only when the flag is ON and a
// distance is measurable; otherwise the existing static store.time. With
// withDistanceFallback, when the flag is off it shows distance-or-time exactly as
// the store card did before — so behaviour is byte-identical with the flag off.
function etaChip(store, { withDistanceFallback = false } = {}) {
  if (isFeatureOn("feature_eta_tightening")) {
    const eta = estimateEta(store);
    if (eta) return `<span>${icon("clock")} ${eta.low}–${eta.high} دقيقة</span>`;
  }
  if (withDistanceFallback) {
    const km = branchDistanceKm(store);
    if (km != null) return `<span>${icon("pin")} ${formatDistance(km)}</span>`;
  }
  return `<span>${icon("clock")} ${store.time}</span>`;
}

// ───────────────── Feature 5: voice search (feature_voice_search) ─────────────────
// Web Speech API, processed in the browser — no audio is stored or sent anywhere.
function voiceSearchSupported() {
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
// Mic button markup; renders ONLY when the feature is on AND the browser supports
// SpeechRecognition (progressive enhancement — no button, no breakage otherwise).
function voiceSearchButton(mode) {
  if (!isFeatureOn("feature_voice_search") || !voiceSearchSupported()) return "";
  return `<button type="button" class="voice-search-btn" data-action="voice-search" data-mode="${mode}" aria-label="ابحث بصوتك" title="ابحث بصوتك">${icon("mic")}</button>`;
}
let _voiceRecognition = null;
function startVoiceSearch(btn) {
  if (!voiceSearchSupported()) return;
  // Second tap while listening → stop.
  if (_voiceRecognition) { try { _voiceRecognition.stop(); } catch (e) {} _voiceRecognition = null; return; }
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Rec();
  rec.lang = "ar";              // التعرّف على الكلام بالعربية
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  _voiceRecognition = rec;
  if (btn) btn.classList.add("listening");
  const cleanup = () => { if (btn) btn.classList.remove("listening"); _voiceRecognition = null; };
  rec.onresult = e => {
    const transcript = ((e.results && e.results[0] && e.results[0][0] && e.results[0][0].transcript) || "").trim();
    cleanup();
    if (transcript) applyVoiceSearch((btn && btn.dataset.mode) || "hero", transcript);
  };
  rec.onerror = e => {
    cleanup();
    if (e && (e.error === "not-allowed" || e.error === "service-not-allowed"))
      showToast("للبحث الصوتي اسمح باستخدام الميكروفون من إعدادات المتصفّح", "");
  };
  rec.onend = cleanup;
  try { rec.start(); } catch (e) { cleanup(); }
}
// Route the spoken text into the SAME search path used by typing — no new search logic.
function applyVoiceSearch(mode, transcript) {
  if (mode === "store") { state.storeProductSearch = transcript; render(); return; }
  state.search = transcript;
  if (mode === "stores") { render(); return; }
  state.storeFilter = "الكل";
  if (state.route !== "stores") navigate("stores"); else render();
}

// Feature 2: the free-delivery threshold for a store — per-store override if set,
// else the global default from site_settings.delivery_config. null = no threshold.
function freeDeliveryThreshold(store) {
  const perStore = store && store.freeDeliveryThreshold;
  if (perStore != null && Number(perStore) > 0) return Number(perStore);
  const cfg = (state.siteSettings && state.siteSettings.delivery_config) || {};
  const g = cfg.free_delivery_threshold;
  return (g != null && Number(g) > 0) ? Number(g) : null;
}
// Conversion nudge for the cart: progress toward / celebration of free delivery.
function freeDeliveryNudge(store, totals) {
  if (!isFeatureOn("feature_conversion_drivers")) return "";
  const th = freeDeliveryThreshold(store);
  if (th == null) return "";
  if (totals.freeDelivery) return `<p class="free-delivery-hint reached">${icon("bike")} حصلت على توصيل مجاني!</p>`;
  const left = th - totals.subtotal;
  if (left > 0 && totals.subtotal >= store.minOrder) return `<p class="free-delivery-hint">${icon("bike")} أضف ${money(left)} لتحصل على توصيل مجاني.</p>`;
  return "";
}
// Feature 2: discount a validated coupon yields for the current subtotal. The
// coupon's rules were already checked server-side (validate_coupon); we recompute
// the amount client-side from the validated params so it tracks live cart edits.
function couponDiscountFor(coupon, subtotal) {
  if (!coupon) return { discount: 0, freeDelivery: false, belowMin: false };
  if (subtotal < (Number(coupon.min_subtotal) || 0)) return { discount: 0, freeDelivery: false, belowMin: true };
  if (coupon.discount_type === "free_delivery") return { discount: 0, freeDelivery: true, belowMin: false };
  let d = coupon.discount_type === "percent" ? subtotal * (Number(coupon.value) || 0) / 100 : (Number(coupon.value) || 0);
  if (coupon.max_discount != null) d = Math.min(d, Number(coupon.max_discount));
  d = Math.min(d, subtotal);
  return { discount: Math.round(d), freeDelivery: false, belowMin: false };
}

function cartTotals(addressId = null) {
  const subtotal = state.cart.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0);
  const store = state.cart.length ? getStore(state.cart[0].storeId) : null;
  if (!store) return { subtotal, delivery: 0, total: subtotal, quote: null, discount: 0, freeDelivery: false };
  const address = getCheckoutAddress(addressId) || getDefaultAddress();
  const quote = activeDeliveryQuote(store, address);
  let delivery = quote && !quote.exceedsMaxDistance ? quote.fee : 0;
  let freeDelivery = false;
  let discount = 0;
  if (isFeatureOn("feature_conversion_drivers")) {
    // Free-delivery threshold.
    const threshold = freeDeliveryThreshold(store);
    if (threshold != null && subtotal >= threshold) { delivery = 0; freeDelivery = true; }
    // Applied coupon.
    if (state.coupon) {
      const c = couponDiscountFor(state.coupon, subtotal);
      if (c.freeDelivery) { delivery = 0; freeDelivery = true; }
      discount = c.discount;
    }
  }
  // Feature 4: wallet credit spent on this order (capped at the remaining total).
  let creditApplied = 0;
  if (isFeatureOn("feature_community_retention") && state.useCredit && state.referral && Number(state.referral.balance) > 0) {
    creditApplied = Math.min(Number(state.referral.balance), Math.max(0, subtotal + delivery - discount));
  }
  const total = Math.max(0, subtotal + delivery - discount - creditApplied);
  return { subtotal, delivery, total, quote, discount, freeDelivery, creditApplied };
}

// Apply a coupon code: validates server-side (validate_coupon RPC), then stores the
// validated params so the discount tracks live cart edits. On failure shows an
// inline reason and does NOT re-render (so the message stays visible).
async function applyCouponCode(rawCode, btn) {
  const code = (rawCode || "").trim();
  const showErr = msg => { const el = document.getElementById("coupon-error"); if (el) { el.textContent = msg; el.hidden = false; } };
  if (!code) { showErr("أدخل كود الخصم."); return; }
  const sb = window.supabaseClient;
  const store = state.cart.length ? getStore(state.cart[0].storeId) : null;
  if (!sb || !store) { showErr("الخدمة غير متاحة حالياً."); return; }
  const subtotal = state.cart.reduce((s, i) => s + i.finalPrice * i.quantity, 0);
  const restore = setBtnBusy(btn, "جارٍ التحقق…");
  try {
    const { data, error } = await sb.rpc("validate_coupon", {
      p_code: code, p_store_id: store.id, p_subtotal: subtotal, p_phone: state.customerProfile.phone || ""
    });
    restore();
    if (error) { showErr("تعذّر التحقق من الكود، حاول مجدداً."); return; }
    if (!data || !data.valid) { state.coupon = null; showErr(couponReasonAr(data && data.reason, data)); return; }
    state.coupon = data;     // {code, discount_type, value, max_discount, min_subtotal, discount}
    showToast("تم تطبيق كود الخصم 🎉", "success");
    render(); renderCart();
  } catch (e) { restore(); showErr("تعذّر التحقق من الكود."); }
}
function removeCoupon() {
  state.coupon = null;
  render(); renderCart();
}
// Record a coupon redemption after the order is placed. redeem_coupon re-validates
// + enforces usage limits server-side and is idempotent per order; it requires the
// order row to exist, so we let pushOrderCloud's insert land first and retry briefly.
function recordCouponRedemption(orderId, storeId, subtotal, phone) {
  const sb = window.supabaseClient;
  const code = state.coupon && state.coupon.code;
  if (!sb || !code) return;
  const customerId = (isFeatureOn("feature_customer_accounts") && state.user) ? state.user.id : null;
  let tries = 0;
  const go = () => {
    tries++;
    sb.rpc("redeem_coupon", {
      p_code: code, p_order_id: orderId, p_store_id: storeId,
      p_subtotal: subtotal, p_phone: phone || "", p_customer_id: customerId
    }).then(({ data, error }) => {
      if (!error && data && data.reason === "no_order" && tries < 4) setTimeout(go, 1500);
    }).catch(() => {});
  };
  setTimeout(go, 900);
}

// ─────────── Feature 4: referrals + credit wallet (feature_community_retention) ───────────
// Loads the signed-in user's referral code + credit balance. Gated; no-ops for guests.
async function loadReferralData() {
  if (!isFeatureOn("feature_community_retention")) return;
  const sb = window.supabaseClient;
  if (!sb || !state.user || state._referralLoading) return;
  state._referralLoading = true;
  try {
    const [codeRes, balRes] = await Promise.all([
      sb.rpc("get_or_create_referral_code"),
      sb.rpc("credit_balance")
    ]);
    state.referral = { code: codeRes.data || null, balance: Number(balRes.data) || 0 };
    if (state.route === "orders" || state.route === "checkout") render();
  } catch (e) { /* ignore */ }
  finally { state._referralLoading = false; }
}
async function applyReferralCode(code, btn) {
  const showErr = m => { const el = document.getElementById("referral-error"); if (el) { el.textContent = m; el.hidden = false; } };
  const c = (code || "").trim();
  if (!c) { showErr("أدخل كود الدعوة."); return; }
  const sb = window.supabaseClient;
  if (!sb || !state.user) { showErr("سجّل الدخول أولاً."); return; }
  const restore = setBtnBusy(btn, "جارٍ…");
  try {
    const { data, error } = await sb.rpc("apply_referral_code", { p_code: c });
    restore();
    if (error || !data || !data.ok) { showErr(referralReasonAr(data && data.reason)); return; }
    showToast("تم تطبيق كود الدعوة 🎉 ستحصل أنت وصديقك على رصيد عند أول طلب", "success");
    render();
  } catch (e) { restore(); showErr("تعذّر تطبيق الكود."); }
}
function referralReasonAr(reason) {
  const m = {
    bad_code: "كود الدعوة غير صحيح.",
    self: "لا يمكنك استخدام كودك الخاص.",
    already_referred: "لقد استخدمت كود دعوة من قبل.",
    not_signed_in: "سجّل الدخول أولاً."
  };
  return m[reason] || "تعذّر تطبيق كود الدعوة.";
}
// After an order: qualify any pending referral (grants both parties credit) and
// spend the chosen credit. Both are server-validated, idempotent, and require the
// order row to exist — so we let pushOrderCloud's insert land first.
function settleReferralAndCredit(orderId, creditToSpend) {
  const sb = window.supabaseClient;
  if (!sb || !state.user) return;
  let tries = 0;
  const go = () => {
    tries++;
    sb.rpc("qualify_referral", { p_order_id: orderId }).then(({ data }) => {
      if (data && data.reason === "no_order" && tries < 4) { setTimeout(go, 1500); return; }
      if (creditToSpend > 0) sb.rpc("apply_credit", { p_order_id: orderId, p_amount: creditToSpend }).catch(() => {});
      loadReferralData();   // refresh balance after rewards/spend
    }).catch(() => {});
  };
  setTimeout(go, 900);
}
// Account "ادعُ أصدقاءك" tab: referral code, WhatsApp share, balance, enter-a-code.
function renderReferral() {
  if (!state.user) {
    return `<div class="account-empty">${icon("user")}<h3>سجّل الدخول لدعوة أصدقائك</h3><p>اجمع رصيداً عند دعوة أصدقائك للطلب من دكانجي.</p><button class="primary-button" data-action="login">تسجيل الدخول</button></div>`;
  }
  const data = state.referral;
  if (!data) { loadReferralData(); return `<div class="account-empty">${icon("megaphone")}<p>جارٍ التحميل…</p></div>`; }
  const code = data.code || "—";
  const shareText = `اطلب من متاجر حيّك عبر دكانجي واستخدم كود دعوتي ${code} لتحصل على رصيد! ${SITE_ORIGIN}`;
  return `
    <div class="referral-card">
      <div class="referral-balance"><small>رصيدك الحالي</small><strong>${money(data.balance || 0)}</strong></div>
      <div class="referral-code-box"><small>كود دعوتك</small><div class="referral-code"><b dir="ltr">${escAttr(code)}</b><button class="secondary-button compact" data-action="copy-referral" data-code="${escAttr(code)}">${icon("check")} نسخ</button></div></div>
      <a class="whatsapp-button" href="https://wa.me/?text=${encodeURIComponent(shareText)}" target="_blank" rel="noopener">${icon("whatsapp")} ادعُ أصدقاءك عبر واتساب</a>
      <div class="referral-enter">
        <label>هل دعاك صديق؟ أدخل كوده</label>
        <div class="coupon-row"><input id="referral-input" type="text" placeholder="كود الدعوة" dir="ltr" autocomplete="off" onkeydown="if(event.key==='Enter')event.preventDefault()"><button class="secondary-button compact" data-action="apply-referral">تطبيق</button></div>
        <p class="auth-error" id="referral-error" hidden></p>
      </div>
      <p class="referral-note">${icon("shield")} تحصل أنت وصديقك على رصيد عند أول طلب له.</p>
    </div>`;
}

// ─────────── Feature 4-c: group / building orders (feature_community_retention) ───────────
async function loadGroupOrder(token) {
  const sb = window.supabaseClient;
  if (!sb || state._groupLoading === token) return;
  state._groupLoading = token;
  try {
    const { data } = await sb.rpc("get_group_order", { p_token: token });
    state._groupCache = { token, data: data || { found: false } };
  } catch (e) { state._groupCache = { token, data: { found: false } }; }
  finally { state._groupLoading = null; if (state.route === "group") render(); }
}
function openCreateGroupModal(storeId) {
  if (!state.user) { showToast("سجّل الدخول لإنشاء طلب جماعي", ""); openLoginModal(); return; }
  const store = getStore(storeId);
  if (!store) return;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark">${icon("megaphone")}</span></div>
    <h2>اطلب جماعياً مع جيرانك</h2>
    <p>أنشئ طلباً جماعياً من <strong>${escAttr(store.name)}</strong> وشارك الرابط مع جيرانك لتبلغوا الحد الأدنى وتتقاسموا التوصيل.</p>
    <form id="group-create-form" data-store="${storeId}">
      <label class="input-label"><span>المبنى / المنطقة</span><input name="area" required placeholder="مثال: مبنى A — شارع الزهور"></label>
      <label class="input-label"><span>مدة التجميع (ساعات)</span><input name="hours" type="number" min="1" max="72" value="6"></label>
      <p class="auth-error" id="group-create-error" hidden></p>
      <button class="primary-button full large" type="submit">${icon("megaphone")} إنشاء ومشاركة</button>
    </form>
  `, "auth-modal");
}
async function submitCreateGroup(form) {
  const sb = window.supabaseClient;
  const storeId = Number(form.dataset.store);
  const f = new FormData(form);
  const area = (f.get("area") || "").toString().trim();
  const hours = Number(f.get("hours")) || 6;
  const showErr = m => { const el = document.getElementById("group-create-error"); if (el) { el.textContent = m; el.hidden = false; } };
  if (!area) { showErr("أدخل اسم المبنى أو المنطقة."); return; }
  if (!sb) { showErr("الخدمة غير متاحة حالياً."); return; }
  const btn = form.querySelector('button[type="submit"]');
  const restore = setBtnBusy(btn, "جارٍ الإنشاء…");
  try {
    const { data, error } = await sb.rpc("create_group_order", { p_store_id: storeId, p_area_label: area, p_window_hours: hours });
    restore();
    if (error || !data || !data.ok) { showErr(data && data.reason === "not_signed_in" ? "سجّل الدخول أولاً." : "تعذّر إنشاء الطلب الجماعي."); return; }
    closeModal();
    state._groupCache = null;
    navigate("group/" + data.token);
  } catch (e) { restore(); showErr("تعذّر إنشاء الطلب الجماعي."); }
}
async function submitJoinGroup(form) {
  const sb = window.supabaseClient;
  const token = form.dataset.token;
  const f = new FormData(form);
  const name = (f.get("name") || state.customerProfile.name || "").toString().trim();
  const subtotal = Number(f.get("subtotal")) || 0;
  if (!sb) return;
  const btn = form.querySelector('button[type="submit"]');
  const restore = setBtnBusy(btn, "جارٍ الانضمام…");
  try {
    const { data, error } = await sb.rpc("join_group_order", { p_token: token, p_name: name, p_subtotal: subtotal });
    restore();
    if (error || !data || !data.ok) { showToast(data && data.reason === "closed" ? "انتهى وقت هذا الطلب الجماعي" : "تعذّر الانضمام", ""); return; }
    showToast("انضممت إلى الطلب الجماعي 🎉", "success");
    state._groupCache = null;
    loadGroupOrder(token);
  } catch (e) { restore(); showToast("تعذّر الانضمام", ""); }
}
function renderGroupOrder(token) {
  if (!isFeatureOn("feature_community_retention")) return renderHome();
  const wrap = inner => `<section class="page-hero compact"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><strong>طلب جماعي</strong></div></div></section><section class="section"><div class="container">${inner}</div></section>`;
  if (!token) return wrap(renderEmpty("طلب جماعي", "افتح رابط طلب جماعي للانضمام إليه.", "تصفّح المتاجر", "stores"));
  const cache = state._groupCache;
  if (!cache || cache.token !== token) { loadGroupOrder(token); return wrap(`<div class="account-empty">${icon("megaphone")}<p>جارٍ التحميل…</p></div>`); }
  const g = cache.data;
  if (!g || !g.found) return wrap(renderEmpty("الطلب الجماعي غير موجود", "قد يكون الرابط منتهياً أو غير صحيح.", "العودة للرئيسية", "home"));
  const store = getStore(g.store_id);
  const target = Number(g.min_target) || (store ? store.minOrder : 0) || 0;
  const total = Number(g.total) || 0;
  const pct = target > 0 ? Math.min(100, Math.round(total / target * 100)) : 0;
  const closed = g.status !== "open";
  const reached = target > 0 && total >= target;
  const link = SITE_ORIGIN + "/group/" + token;
  const parts = Array.isArray(g.participants) ? g.participants : [];
  return wrap(`
    <div class="group-order-card">
      <div class="group-order-head">
        ${store ? storeAvatar(store) : ""}
        <div><small>طلب جماعي من</small><strong>${store ? esc(store.name) : "متجر"}</strong><span class="group-area">${icon("pin")} ${esc(g.area_label)}</span></div>
      </div>
      <div class="group-status ${closed ? "closed" : (reached ? "reached" : "open")}">
        ${closed ? `${icon("clock")} انتهى وقت التجميع` : (reached ? `${icon("check")} تم بلوغ الحد الأدنى!` : `${icon("clock")} ينتهي ${formatOrderDate(g.window_end)}`)}
      </div>
      ${target > 0 ? `<div class="group-progress"><div class="group-progress__bar"><span style="width:${pct}%"></span></div><div class="group-progress__labels"><b>${money(total)}</b><span>من ${money(target)} (${pct}%)</span></div></div>` : `<div class="group-progress__labels"><b>${money(total)}</b><span>مجموع المشاركين</span></div>`}
      <div class="group-participants"><small>المشاركون (${g.count || 0})</small>${parts.length ? `<ul>${parts.map(p => `<li><span>${esc(p.name || "مشارك")}</span><b>${money(Number(p.subtotal) || 0)}</b></li>`).join("")}</ul>` : `<p class="group-empty">كن أول المنضمّين!</p>`}</div>
      ${closed ? "" : `
      <form id="group-join-form" data-token="${escAttr(token)}" class="group-join">
        <label class="input-label"><span>اسمك</span><input name="name" value="${escAttr(state.customerProfile.name || "")}" placeholder="اسمك أو رقم شقتك"></label>
        <label class="input-label"><span>قيمة طلبك التقريبية (ل.ت)</span><input name="subtotal" type="number" min="0" placeholder="0"></label>
        <button class="primary-button full large" type="submit">${icon("check")} انضمّ إلى الطلب الجماعي</button>
      </form>`}
      <button class="secondary-button full" data-action="share-group" data-link="${escAttr(link)}">${icon("share")} انسخ رابط الدعوة</button>
      ${store ? `<a class="text-button" href="/store/${escAttr(storeParam(store))}" data-action="open-store" data-id="${store.id}">تصفّح منتجات ${esc(store.name)}</a>` : ""}
    </div>`);
}
function couponReasonAr(reason, data) {
  const map = {
    not_found: "كود الخصم غير صحيح.",
    not_started: "كود الخصم لم يبدأ بعد.",
    expired: "انتهت صلاحية كود الخصم.",
    wrong_store: "هذا الكود لا ينطبق على هذا المتجر.",
    below_min: `الحد الأدنى لاستخدام هذا الكود ${money((data && data.min_subtotal) || 0)}.`,
    usage_limit: "انتهت مرات استخدام هذا الكود.",
    per_customer_limit: "لقد استخدمت هذا الكود من قبل."
  };
  return map[reason] || "تعذّر تطبيق كود الخصم.";
}
// Coupon UI for the checkout summary: input row, or the applied-state chip.
// Enter is blocked so it can't accidentally submit the order form.
function couponCheckoutBlock() {
  if (state.coupon) {
    const label = state.coupon.discount_type === "free_delivery" ? "توصيل مجاني" : "خصم مطبّق";
    return `<div class="coupon-applied"><span>${icon("check")} <strong dir="ltr">${escAttr(state.coupon.code)}</strong> · ${label}</span><button type="button" class="text-button" data-action="remove-coupon">إزالة</button></div>`;
  }
  return `<div class="coupon-box">
      <div class="coupon-row">
        <input id="coupon-input" type="text" placeholder="لديك كود خصم؟" autocomplete="off" dir="ltr" onkeydown="if(event.key==='Enter')event.preventDefault()">
        <button type="button" class="secondary-button compact" data-action="apply-coupon">تطبيق</button>
      </div>
      <p class="auth-error" id="coupon-error" hidden></p>
    </div>`;
}
// Feature 4: "use my credit" toggle on checkout — only when the wallet has a balance.
function creditCheckoutBlock() {
  if (!isFeatureOn("feature_community_retention")) return "";
  const bal = state.referral && Number(state.referral.balance);
  if (!state.user || !bal || bal <= 0) return "";
  return `<label class="credit-toggle"><input type="checkbox" ${state.useCredit ? "checked" : ""} data-action="toggle-credit"><span></span><div><strong>استخدم رصيدك</strong><small>متاح: ${money(bal)}</small></div></label>`;
}

function updateCartBadges() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
  document.getElementById("mobile-cart-count").textContent = count;
}

// Honest count of currently live offers (never a fabricated/urgency number) —
// shown as a small badge on the mobile "العروض" tab so it doesn't rely on the
// user stumbling onto the offers page to know deals exist.
function updateOffersBadge() {
  const badge = document.getElementById("mobile-offers-count");
  if (!badge) return;
  const count = products.filter(product => product.oldPrice && product.available).length;
  badge.textContent = count > 9 ? "9+" : String(count);
  badge.hidden = count === 0;
}

function hydrateIcons(root = document) {
  root.querySelectorAll(".icon-slot[data-icon]").forEach(slot => {
    slot.innerHTML = icon(slot.dataset.icon);
  });
}

function storeAvatar(store, extraClass = "") {
  return `<span class="store-avatar ${extraClass} ${store.logoImage ? "store-avatar--logo" : ""} ${store.sourceBranded || store.officialStore ? "store-avatar--source-branded" : ""} ${store.brandTheme ? `store-avatar--${store.brandTheme}` : ""}"><img src="${escAttr(store.logoImage || store.image)}" alt="${escAttr(store.name)}"></span>`;
}

function categoryCard(name, image, caption) {
  return `
    <button class="category-card" data-action="category" data-category="${escAttr(name)}">
      <span class="category-card__icon"><img src="${escAttr(image)}" alt=""></span>
      <span><strong>${escAttr(name)}</strong><small>${escAttr(caption)}</small></span>
      ${icon("arrowLeft", "arrow")}
    </button>
  `;
}

// EXPERIMENT (mobile-buy-first-experiment branch): big tappable, photo-led
// category tile — mobile-only stand-in for the hero, styled after the
// reference app's home screen (image + bold name + one benefit line, no
// paragraph copy). Reuses the same category data/click action as
// categoryCard() above so behavior (filter + navigate to /stores) is
// identical; only the visual size/prominence differs.
function shopTile(name, image, caption, big) {
  return `
    <button class="shop-tile${big ? " shop-tile--big" : ""}" data-action="category" data-category="${escAttr(name)}" style="background-image:url('${escAttr(image)}')">
      <span class="shop-tile__scrim"></span>
      <span class="shop-tile__badge">${icon("bike")} توصيل سريع</span>
      <span class="shop-tile__text"><strong>${escAttr(name)}</strong><small>${escAttr(caption)}</small></span>
    </button>
  `;
}

// --- Automatic open/closed by working hours -------------------------------
// Stores carry a free-text `hours` string (e.g. "يومياً من 2:00 ظهراً حتى 1:00
// منتصف الليل"). We parse it and compare against the store's local time (Turkey
// and Syria are both UTC+3 year-round) so a visitor in any timezone sees the
// store's real status. Unparseable hours fail OPEN; a manual owner-close wins.
const STORE_TZ_OFFSET_MIN = 3 * 60; // UTC+3
const HOURS_DAY_NAMES = [
  ["الأحد", "الاحد"],
  ["الإثنين", "الاثنين"],
  ["الثلاثاء"],
  ["الأربعاء", "الاربعاء"],
  ["الخميس"],
  ["الجمعة"],
  ["السبت"],
];

function nowInStoreTz() {
  const now = new Date();
  return new Date(now.getTime() + now.getTimezoneOffset() * 60000 + STORE_TZ_OFFSET_MIN * 60000);
}

function hoursTimeToMinutes(hour, minute, marker) {
  const m = (marker || "").trim();
  // AM markers: ص / صباحاً / فجراً / منتصف الليل. Everything else (م / مساءً /
  // ظهراً / عصراً / ليلاً / بعد الظهر) is treated as PM.
  const isAM = !m || /^(منتصف|صباح|فجر|ص)/.test(m);
  let h = hour % 12;
  if (!isAM) h += 12;
  if (!m) h = hour % 24; // no marker → take the literal 24h value
  return ((h % 24) * 60 + minute) % 1440;
}

function parseHoursTimeRange(text) {
  const re = /(\d{1,2})(?::(\d{2}))?\s*(منتصف\s*الليل|بعد\s*الظهر|صباحاً|صباحا|مساءً|مساءاً|مساء|ظهراً|ظهرا|عصراً|عصرا|ليلاً|ليلا|فجراً|فجرا|ص|م)?/g;
  const times = [];
  let m;
  while ((m = re.exec(text)) && times.length < 2) {
    const h = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    if (h > 23 || min > 59) continue;
    times.push(hoursTimeToMinutes(h, min, m[3]));
  }
  if (times.length < 2) return null;
  return { open: times[0], close: times[1] };
}

// Returns "open" | "closed" | null (null = unknown → caller should fail open).
function storeHoursStatus(hoursText) {
  if (!hoursText) return null;
  const t = String(hoursText).replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
  if (/على\s*مدار\s*الساعة/.test(t)) return "open";
  const now = nowInStoreTz();
  const day = now.getDay();
  // Day-specific closures, e.g. "(الأحد مغلق)".
  for (const name of HOURS_DAY_NAMES[day]) {
    if (new RegExp(name + "\\s*مغلق").test(t)) return "closed";
  }
  const range = parseHoursTimeRange(t);
  if (!range) return null;
  if (range.open === range.close) return "open"; // full-day range
  const cur = now.getHours() * 60 + now.getMinutes();
  const within = range.open < range.close
    ? cur >= range.open && cur < range.close
    : cur >= range.open || cur < range.close; // overnight wrap
  return within ? "open" : "closed";
}

// Effective open state: a manual owner-close always wins; otherwise derive it
// from the working hours, defaulting to open when they can't be parsed.
function isStoreOpenNow(store) {
  if (!store || store.open === false) return false;
  return storeHoursStatus(store.hours) !== "closed";
}

function storeCard(store) {
  const isFavorite = state.favorites.includes(`store-${store.id}`);
  return `
    <article class="store-card ${store.sourceBranded ? "source-branded-store-card" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}` : ""}">
      <button class="store-card__image" data-action="open-store" data-id="${store.id}">
        <img src="${escAttr(store.coverImage || store.image)}" alt="${escAttr(store.name)}" loading="lazy">
        <span class="status-badge ${isStoreOpenNow(store) ? "open" : "closed"}">${isStoreOpenNow(store) ? "مفتوح" : "مغلق الآن"}</span>
        ${hasNationwideShipping(store) ? `<span class="nationwide-badge">${icon("box")} توصيل لكل الولايات</span>` : ""}
        ${store.branchGroup === "alsultan" ? `<span class="official-branch-badge">${icon("shield")} فرع رسمي</span>` : store.officialStore ? `<span class="official-branch-badge ${store.brandTheme || ""}">${icon("shield")} متجر رسمي</span>` : ""}
        ${store.hasOffer && store.offer ? `<span class="offer-ribbon">${esc(store.offer)}</span>` : ""}
      </button>
      <button class="favorite-button ${isFavorite ? "active" : ""}" data-action="favorite" data-key="store-${store.id}" aria-label="إضافة للمفضلة">
        ${icon("heart")}
      </button>
      <div class="store-card__body">
        <button class="store-title-row" data-action="open-store" data-id="${store.id}">
          ${storeAvatar(store)}
          <span><strong>${esc(store.name)}</strong><small>${esc(store.category)}</small></span>
        </button>
        <div class="store-rating">
          ${store.newStore ? `${icon("store")} <strong>متجر جديد</strong><span>موثق البيانات</span>` : `${icon("star")} <strong>${store.rating}</strong><span>(${store.reviews} تقييم)</span>`}
        </div>
        <div class="store-meta">
          ${etaChip(store, { withDistanceFallback: true })}
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

// Visual fallback for products shown without a photo (opt-in stores only, e.g. باشا بيتزريا).
function productNoImageMedia(product) {
  return `<span class="product-noimage"><span class="product-noimage__cat">${esc(product.category || "")}</span><span class="product-noimage__name">${esc(product.name)}</span></span>`;
}
function productCard(product) {
  const isFavorite = state.favorites.includes(`product-${product.id}`);
  const noImg = isPlaceholderImage(product.image);
  return `
    <article class="product-card ${product.storeId === 5 || (product.sourceBranded && product.imageFit !== "cover") ? "source-branded" : ""} ${!product.available ? "unavailable" : ""}" data-category="${escAttr(product.category || "")}">
      <button class="product-card__image ${noImg ? "no-image" : ""}" data-action="open-product" data-id="${product.id}">
        ${noImg ? productNoImageMedia(product) : `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`}
        ${product.oldPrice ? `<span class="discount-chip">وفر ${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>` : ""}
        ${!product.available ? `<span class="soldout-overlay">غير متوفر</span>` : ""}
      </button>
      <button class="favorite-button product-favorite ${isFavorite ? "active" : ""}" data-action="favorite" data-key="product-${product.id}">
        ${icon("heart")}
      </button>
      <div class="product-card__body">
        <small>${esc(product.category)}</small>
        <button class="product-name" data-action="open-product" data-id="${product.id}">${esc(product.name)}</button>
        ${product.priceOnRequest ? `
        <div class="price-row price-row--request">
          <span class="price-request">السعر عند الطلب</span>
          <a class="quick-add quick-add--wa" href="${waOrderLink(product)}" target="_blank" rel="noopener" data-id="${product.storeId}" aria-label="اطلب عبر واتساب">${icon("whatsapp")}</a>
        </div>` : `
        <div class="price-row">
          <div><strong>${money(product.price)}</strong>${product.unit ? `<span>/ ${product.unit}</span>` : ""}${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
          <button class="quick-add" data-action="quick-add" data-id="${product.id}" ${!product.available ? "disabled" : ""}>${icon("plus")}</button>
        </div>`}
      </div>
    </article>
  `;
}

// Homepage category tiles ("ماذا تحتاج اليوم؟"). Editable via the admin
// «التصنيفات» section (add/edit/delete/hide/reorder); the chosen list lives in
// site_settings.categories. Falls back to all six in default order.
const HOME_CATEGORIES = [
  ["سوبر ماركت", "/assets/photos/store-market.jpg", "كل احتياجات البيت"],
  ["مطاعم", "/assets/photos/store-restaurant.jpg", "ألذ الأطباق إلى بابك"],
  ["ملاحم", "/assets/photos/store-butcher.jpg", "لحوم طازجة يومياً"],
  ["حلويات", "/assets/photos/store-bakery.jpg", "لأحلى المناسبات"],
  ["مكسرات وبهارات", "/assets/photos/store-spices.jpg", "نكهات من كل مكان"],
  ["بن ومكسرات", "/assets/photos/store-coffee.jpg", "أجود أنواع البنّ والقهوة"],
  ["عصائر", "/assets/photos/store-juice.jpg", "عصائر طازجة ومشروبات"],
  ["مواد غذائية متخصصة", "/assets/photos/store-specialty-food.jpg", "عسل طبيعي ومنتجات النحل"],
  ["مطابخ منزلية", "/assets/photos/store-home-kitchen-placeholder.svg", "أدوات ومستلزمات المطبخ"]
];
// The editable homepage categories. From site_settings.categories.items when
// set (admin add/delete/edit), else built from the HOME_CATEGORIES defaults
// (honoring any older hidden/order config). Each item = {name, image, caption, hidden}.
function categoriesList() {
  const cfg = (state.siteSettings && state.siteSettings.categories) || {};
  if (Array.isArray(cfg.items) && cfg.items.length) return cfg.items.filter(c => c && c.name);
  const hidden = new Set(Array.isArray(cfg.hidden) ? cfg.hidden : []);
  const order = Array.isArray(cfg.order) ? cfg.order : [];
  const base = HOME_CATEGORIES.map(c => ({ name: c[0], image: c[1], caption: c[2], hidden: hidden.has(c[0]) }));
  if (order.length) base.sort((a, b) => {
    const ia = order.indexOf(a.name), ib = order.indexOf(b.name);
    return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
  });
  return base;
}
function homeCategoriesOrdered() {
  return categoriesList().filter(c => !c.hidden);
}
// Store category NAMES sourced from the same admin-managed list as the homepage
// tiles, so a category added in the admin «التصنيفات» section (e.g. «خضار
// وفواكه») shows up everywhere a store category is offered — the join form and
// the stores filter — not only on the homepage. Falls back to the
// HOME_CATEGORIES defaults. Hidden categories are excluded here too, so hiding
// a category also removes it from the store-filter chips and the merchant
// join form (existing stores keep whatever category they already have — see
// the store-edit dropdown, which always includes the store's current value).
function storeCategoryNames() {
  return categoriesList().filter(c => !c.hidden).map(c => c.name).filter(Boolean);
}
// Home-kitchen ("مطابخ منزلية") stores get an extra per-product prep-time
// field — these small home-based kitchens often need real advance notice
// (24-48h) to prepare an order, unlike a stocked supermarket/restaurant.
function isHomeKitchenStore(store) {
  return /مطابخ|منزلي/.test((store && store.category) || "");
}
// Strictest per-product advance-notice requirement across the cart, in hours
// (0 if none). Shared by renderCheckout (to gate the day/time picker) and the
// checkout submit handler (to re-validate the actual choice), so the two
// never drift apart on how the requirement is derived.
function cartRequiredLeadHours(cart) {
  return Math.max(0, ...cart.map(item => { const p = getProduct(item.productId); return (p && Number(p.advanceHours)) || 0; }));
}
// Baseline category taxonomy for every "سوبر ماركت" store, taken from قاضي
// ماركت باشاك شهير (store 19) — the platform's most established, most
// thoroughly categorized supermarket. New/imported supermarket stores get
// this full list available automatically instead of an empty category bar,
// so products (including ones imported from مخزن الصور المشترك) always have
// a consistent, ready-made set of categories to file into. Excludes
// "عروض قاضي ماركت" — that one's store-branded, not a generic category.
const SUPERMARKET_BASELINE_CATEGORIES = [
  "الفطور والأجبان والألبان وحبوب الفطور", "تسالي", "البهارات والتوابل",
  "الصلصات والشوربات والمخللات", "العناية بالمرأة", "المجمدات", "منظفات عامة",
  "المناديل", "العناية بالشعر", "منظفات غسيل الملابس", "مستلزمات الحلويات",
  "العناية بالطفل", "أدوات منزلية", "البقوليات والمكرونة", "المخبوزات والمعجنات",
  "العناية بالجسم", "العناية بالأسنان", "المياه والمشروبات الباردة والساخنة",
  "صابون + صابون سائل لليدين", "المكسرات النيئة", "منظفات الجلي",
  "مستلزمات الحيوانات", "العسل جميع الأنواع", "العناية بالرجال",
  "الخضار والفواكه", "أدوات تنظيف", "السمنة والزيوت", "الرحلات ومستلزمات الشوي",
  "غذائيات منوعة", "التمور والفواكه المجففة", "اللحوم والدجاج والسمك"
];
// All product categories for a given store, deduplicated + sorted, plus any
// extra categories the admin/owner added (persisted in site_settings), plus
// the shared supermarket baseline above for any "سوبر ماركت" store.
function storeProductCategories(storeId) {
  const fromProducts = [...new Set(allProducts.filter(p => p.storeId === storeId).map(p => p.category).filter(Boolean))];
  const extra = ((state.siteSettings.storeExtraCategories || {})[String(storeId)] || []);
  const baseline = isSupermarketStore(getStore(storeId)) ? SUPERMARKET_BASELINE_CATEGORIES : [];
  const all = [...new Set([...fromProducts, ...extra, ...baseline])];
  return all.sort((a, b) => a.localeCompare(b, "ar"));
}
function saveStoreExtraCategory(storeId, catName) {
  const map = { ...(state.siteSettings.storeExtraCategories || {}) };
  const existing = map[String(storeId)] || [];
  if (existing.includes(catName)) return;
  map[String(storeId)] = [...existing, catName];
  state.siteSettings = { ...state.siteSettings, storeExtraCategories: map };
  adminApi("save-settings", { method: "POST", body: { key: "storeExtraCategories", value: map } }).catch(() => showToast("تعذّر الحفظ سحابياً", ""));
}

// Homepage quick-search chips under the hero search box — each just runs the
// same search flow as typing + pressing "ابحث" (see action "quick-chip").
const QUICK_SEARCH_CHIPS = ["دجاج مشوي", "رز", "لحوم", "حلويات", "خضار", "ماركت عربي"];

// Paid-priority stores — طلب المستخدم 2026-07-18: متاجر دفعت (الخوالي، باشا
// بيتزريا، ملحمة الدوماني، صفا الشام) يجب أن تظهر في مقدمة قوائم المتاجر
// وأن تتصدر عروضها أي عروض أخرى على الموقع. الترتيب هنا هو ترتيب الظهور
// نفسه عند التساوي. لا يُطبَّق على /dalil (دليل التقييمات — ترتيب عضوي بحت
// حسب تصميمه أصلاً) ولا يتجاوز فرزاً صريحاً اختاره الزائر بنفسه (تقييم/سعر
// توصيل/الأقرب) في صفحة المتاجر.
const PAID_PRIORITY_STORE_IDS = [31, 56, 84, 50];
function paidPriorityRank(storeId) {
  const idx = PAID_PRIORITY_STORE_IDS.indexOf(storeId);
  return idx === -1 ? PAID_PRIORITY_STORE_IDS.length : idx;
}
// Stable sort: priority stores float to the front in PAID_PRIORITY_STORE_IDS
// order; everything else keeps its existing relative order.
function sortStoresByPaidPriority(list) {
  return list.slice().sort((a, b) => paidPriorityRank(a.id) - paidPriorityRank(b.id));
}
function sortProductsByPaidPriority(list) {
  return list.slice().sort((a, b) => paidPriorityRank(a.storeId) - paidPriorityRank(b.storeId));
}

// A sensible cross-store mix when there's no curated pick: one available,
// imaged product per approved BRAND (highest-rated stores first) — branches of
// the same brand are collapsed first so a multi-branch chain doesn't fill the
// rail with the same product repeated once per branch. Not a sales ranking —
// just a diverse spotlight.
function fallbackProductMix(count, excludeIds = []) {
  const excluded = new Set(excludeIds);
  const approvedStores = collapseBranchGroups(stores.filter(isStoreApproved))
    .sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
  const picks = [];
  for (const store of approvedStores) {
    if (picks.length >= count) break;
    const p = products.find(pr => pr.storeId === store.id && pr.available && !excluded.has(pr.id) && !isPlaceholderImage(pr.image));
    if (p) { picks.push(p); excluded.add(p.id); }
  }
  return picks;
}
// «الأكثر طلباً اليوم» — admin-curated pick (site_settings.mostOrdered.ids, managed from
// Products > toggle "الأكثر طلباً"). We don't have real sales-ranking data yet, so this
// is a manual selection; falls back to a cross-store mix when nothing is picked.
function mostOrderedProducts() {
  const picked = products.filter(p => MOST_ORDERED_PRODUCTS.has(p.id) && p.available);
  if (picked.length) return picked.slice(0, 10);
  return fallbackProductMix(8);
}
// «منتجات مقترحة لك» — a diverse mix from multiple stores, skipping whatever is
// already shown in "الأكثر طلباً اليوم" just above it.
function recommendedProducts(excludeIds = []) {
  return fallbackProductMix(10, excludeIds);
}

// Product card for the homepage "الأكثر طلباً/مقترحة" rails: adds the store name
// (the plain productCard omits it since it's normally shown within one store's
// page) and a labeled add-to-cart button per the conversion-page spec.
function homeProductCard(product, { badge = false } = {}) {
  const store = getStore(product.storeId);
  const isFavorite = state.favorites.includes(`product-${product.id}`);
  const noImg = isPlaceholderImage(product.image);
  return `
    <article class="product-card home-product-card ${!product.available ? "unavailable" : ""}">
      <button class="product-card__image ${noImg ? "no-image" : ""}" data-action="open-product" data-id="${product.id}">
        ${noImg ? productNoImageMedia(product) : `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`}
        ${badge ? `<span class="most-ordered-badge">${icon("star")} الأكثر طلباً</span>` : ""}
        ${!product.available ? `<span class="soldout-overlay">غير متوفر</span>` : ""}
      </button>
      <button class="favorite-button product-favorite ${isFavorite ? "active" : ""}" data-action="favorite" data-key="product-${product.id}">
        ${icon("heart")}
      </button>
      <div class="product-card__body">
        <button class="product-name" data-action="open-product" data-id="${product.id}">${esc(product.name)}</button>
        <small class="home-product-store">${store ? esc(store.name) : ""}</small>
        <div class="price-row">
          <div><strong>${money(product.price)}</strong>${product.unit ? `<span>/ ${product.unit}</span>` : ""}</div>
          <button class="quick-add quick-add--labeled" data-action="quick-add" data-id="${product.id}" ${!product.available ? "disabled" : ""}>${icon("plus")} أضف للسلة</button>
        </div>
      </div>
    </article>
  `;
}

// Offer card for the homepage "عروض اليوم" grid — real discounts only (products
// with an actual oldPrice set by the merchant); CTA opens the product instead
// of adding straight to cart so shoppers can see the deal detail first.
function homeOfferCard(product) {
  const store = getStore(product.storeId);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  return `
    <article class="home-offer-card">
      <button class="home-offer-card__image" data-action="open-product" data-id="${product.id}">
        <img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">
        ${discount ? `<span class="discount-chip">وفر ${discount}%</span>` : ""}
      </button>
      <div class="home-offer-card__body">
        <small>${store ? esc(store.name) : ""}</small>
        <strong>${esc(product.name)}</strong>
        <div class="price-row">
          <div><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
        </div>
        <button class="secondary-button compact" data-action="open-product" data-id="${product.id}">اطلب الآن ${icon("arrowLeft")}</button>
      </div>
    </article>
  `;
}

// Store card for the homepage "متاجر قريبة منك الآن" section: the standard
// storeCard() plus the minimum order, a cash-on-delivery note, and an explicit
// order CTA — the extra proof points the conversion-page spec calls for.
function nearbyStoreCard(store) {
  const isFavorite = state.favorites.includes(`store-${store.id}`);
  const open = isStoreOpenNow(store);
  return `
    <article class="store-card nearby-store-card ${store.sourceBranded ? "source-branded-store-card" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}` : ""}">
      <button class="store-card__image" data-action="open-store" data-id="${store.id}">
        <img src="${escAttr(store.coverImage || store.image)}" alt="${escAttr(store.name)}" loading="lazy">
        <span class="status-badge ${open ? "open" : "closed"}">${open ? "مفتوح" : "مغلق الآن"}</span>
        ${hasNationwideShipping(store) ? `<span class="nationwide-badge">${icon("box")} توصيل لكل الولايات</span>` : ""}
        ${store.branchGroup === "alsultan" ? `<span class="official-branch-badge">${icon("shield")} فرع رسمي</span>` : store.officialStore ? `<span class="official-branch-badge ${store.brandTheme || ""}">${icon("shield")} متجر رسمي</span>` : ""}
        ${store.hasOffer && store.offer ? `<span class="offer-ribbon">${esc(store.offer)}</span>` : ""}
      </button>
      <button class="favorite-button ${isFavorite ? "active" : ""}" data-action="favorite" data-key="store-${store.id}" aria-label="إضافة للمفضلة">
        ${icon("heart")}
      </button>
      <div class="store-card__body">
        <button class="store-title-row" data-action="open-store" data-id="${store.id}">
          ${storeAvatar(store)}
          <span><strong>${esc(store.name)}</strong><small>${esc(store.category)}</small></span>
        </button>
        <div class="store-rating">
          ${store.newStore ? `${icon("store")} <strong>متجر جديد</strong><span>موثق البيانات</span>` : `${icon("star")} <strong>${store.rating}</strong><span>(${store.reviews} تقييم)</span>`}
        </div>
        <div class="store-meta">
          ${etaChip(store, { withDistanceFallback: true })}
          <span>${icon("bike")} ${deliveryPriceLabel(store)}</span>
        </div>
        <div class="nearby-store-extra">
          <span>${icon("bag")} حد أدنى ${money(store.minOrder)}</span>
          <span>${icon("shield")} الدفع عند الاستلام</span>
        </div>
        <button class="primary-button full compact" data-action="open-store" data-id="${store.id}">اطلب الآن ${icon("arrowLeft")}</button>
      </div>
    </article>
  `;
}

function renderHome() {
  // For brands with several branches, surface the branch nearest the visitor's
  // location (from geolocation) instead of a fixed "main" branch — on desktop and
  // mobile alike (the store grid is shared/responsive). Falls back to the featured
  // branch until the browser location is known.
  let featuredStores = collapseBranchGroups(stores.filter(store => store.featured && isStoreApproved(store)));
  // When the visitor's location is known, show the nearest featured stores first
  // so "متاجر قريبة منك الآن" is literally true.
  if (state.userLocation) featuredStores = featuredStores.slice().sort(compareStoresByDistance);
  // Paid-priority stores float to the front regardless of distance — see
  // PAID_PRIORITY_STORE_IDS above.
  featuredStores = sortStoresByPaidPriority(featuredStores);
  const offerProducts = sortProductsByPaidPriority(products.filter(product => product.oldPrice && product.available)).slice(0, 8);
  const mostOrdered = mostOrderedProducts();
  const recommended = recommendedProducts(mostOrdered.map(p => p.id));
  // Real, not fabricated — a plain count of currently-open approved stores.
  // No fake order counts / "last order" strings: we don't have that data yet.
  const openStoresCount = stores.filter(s => isStoreApproved(s) && isStoreOpenNow(s)).length;
  const HT = (state.siteSettings && state.siteSettings.heroTexts) || {};
  const ht = {
    eyebrow: HT.eyebrow || "كل ما تحتاجه من دكاكين حيك",
    titleTop: HT.titleTop || "سوق الحي",
    titleEm: HT.titleEm || "بين يديك",
    subtitle: HT.subtitle || "اطلب خضارك الطازجة، حلوياتك المفضلة واحتياجات البيت من متاجر تعرفها وتثق بها."
  };
  const HB = (state.siteSettings && state.siteSettings.homeBanner) || {};
  const hb = {
    eyebrow: HB.eyebrow || "عروض لا تفوّت",
    title: HB.title || "وفّر أكثر على طلباتك اليومية",
    subtitle: HB.subtitle || "خصومات مختارة من متاجر الحي، تتجدد باستمرار.",
    button: HB.button || "شاهد كل العروض",
    link: HB.link || "",
    image: HB.image || ""
  };
  const bHref = hb.link || "#offers";
  const bAttrs = `href="${escAttr(bHref)}"${/^(https?:|tel:|mailto:|wa\.me)/i.test(bHref) ? ' target="_blank" rel="noopener"' : ""}`;
  // Paid hero placement — the four merchant-paid stores (PAID_PRIORITY_STORE_IDS)
  // surfaced by name/logo inside the hero itself. Real store rows only: a paid id
  // that's missing or unapproved simply doesn't render a chip.
  const paidHeroStores = PAID_PRIORITY_STORE_IDS.map(id => stores.find(s => s.id === id)).filter(s => s && isStoreApproved(s));
  const paidHeroStrip = paidHeroStores.length ? `
          <div class="h2-featured" aria-label="متاجر مميزة">
            <span class="h2-featured-label">${icon("star")} متاجر مميزة</span>
            ${paidHeroStores.map(s => `<a class="h2-featured-chip" href="/store/${escAttr(storeParam(s))}" data-action="open-store" data-id="${s.id}">${storeAvatar(s)}<span>${esc(s.name)}</span></a>`).join("")}
          </div>` : "";
  // Real average store rating (truthful — never fabricated) for the hero rating float.
  const ratedHeroStores = stores.filter(s => (Number(s.reviews) || 0) > 0);
  let heroRatingFloat = "";
  if (ratedHeroStores.length) {
    const totalRev = ratedHeroStores.reduce((a, s) => a + Number(s.reviews), 0);
    const avgRating = (ratedHeroStores.reduce((a, s) => a + (Number(s.rating) || 0) * Number(s.reviews), 0) / totalRev).toFixed(1);
    heroRatingFloat = `<div class="h2-rate-num"><strong>${avgRating}</strong><small>متوسط تقييم المتاجر</small></div>`;
  }
  // HERO V2 — fully scoped under .hero2 (class names prefixed h2-* so nothing leaks in/out).
  // Rotating headline (4 slides via setupHeroSlider) + real working search + phone mock + glass floats.
  return `
    <section class="hero2">
      <span class="h2-bgword" aria-hidden="true">DUKKANCI</span>
      <div class="container h2-grid">
        <div class="h2-copy">
          <span class="h2-eyebrow"><span class="h2-pulse"></span> ${escAttr(HT.eyebrow || "سوق الحي بين يديك — تجربة أوضح من واتساب")}</span>
          <div class="h2-slides" id="hero2-slides">
            <article class="h2-slide active">
              <h1>كل ما تحتاجه من <span class="h2-grad">متاجر منطقتك</span><br>اطلب الآن وادفع عند الاستلام</h1>
              <p class="h2-lead">مطاعم، ماركت، حلويات، لحوم، خضار — توصيل لباب بيتك في إسطنبول.</p>
            </article>
            <article class="h2-slide">
              <h1>أسعار واضحة<br><span class="h2-grad">بدون عمولة</span> على المنتجات</h1>
              <p class="h2-lead">دكانجي لا يضيف عمولة على أسعار منتجات المتاجر. ترى سعر المنتج، رسوم التوصيل، والإجمالي قبل تأكيد الطلب.</p>
            </article>
            <article class="h2-slide">
              <h1>متاجر مقيّمة<br>وتجربة <span class="h2-grad">قابلة للثقة</span></h1>
              <p class="h2-lead">كل تجربة طلب تساعد في تقييم المتجر: جودة التنفيذ، سرعة التجهيز، التغليف، ودقة الطلب. المتجر الجيد يظهر أقوى.</p>
            </article>
            <article class="h2-slide">
              <h1>بدل فوضى واتساب<br>اطلب بطريقة <span class="h2-grad">مرتبة</span></h1>
              <p class="h2-lead">لا تسأل كل محل عن الأسعار والتوفر. المنتجات والمتاجر والتفاصيل أمامك في مكان واحد قبل أن تقرر.</p>
            </article>
          </div>

          <div class="hero-search">
            ${icon("search")}
            <input id="hero-search" type="search" placeholder="ابحث عن شاورما، رز، لحمة، حلويات، سوبرماركت..." value="${escAttr(state.search)}">
            <button type="button" class="search-clear" data-action="clear-search" aria-label="مسح البحث" title="مسح">${icon("close")}</button>
            ${voiceSearchButton("hero")}
            <button data-action="run-search">ابحث</button>
          </div>

          <div class="search-chips" aria-label="بحث سريع">
            ${QUICK_SEARCH_CHIPS.map(term => `<button type="button" class="search-chip" data-action="quick-chip" data-term="${escAttr(term)}">${esc(term)}</button>`).join("")}
          </div>
${paidHeroStrip}
          <div class="h2-cta-row">
            <a class="h2-cta-main" href="/stores" data-route="stores">ابدأ التسوق الآن ←</a>
            <a class="h2-cta-second" href="#nearby-stores">تصفح المتاجر القريبة</a>
          </div>

          <div class="h2-dots" id="hero2-dots" aria-label="تبديل الرسائل">
            <button class="h2-dot active" data-index="0" aria-label="الرسالة 1"></button>
            <button class="h2-dot" data-index="1" aria-label="الرسالة 2"></button>
            <button class="h2-dot" data-index="2" aria-label="الرسالة 3"></button>
            <button class="h2-dot" data-index="3" aria-label="الرسالة 4"></button>
          </div>

          <div class="h2-trust">
            <div class="h2-trust-card zero"><span class="h2-trust-icon">${icon("percent")}</span><div><strong>0% عمولة منتجات</strong><span>المنصة لا تضيف عمولة على سعر المنتج.</span></div></div>
            <div class="h2-trust-card rated"><span class="h2-trust-icon">${icon("star")}</span><div><strong>متاجر يتم تقييمها</strong><span>التجربة تساعد في رفع جودة المتاجر.</span></div></div>
            <div class="h2-trust-card clear"><span class="h2-trust-icon">${icon("shield")}</span><div><strong>التكلفة قبل التأكيد</strong><span>السعر والتوصيل يظهران قبل إرسال الطلب.</span></div></div>
          </div>
        </div>

        <div class="h2-stage" aria-hidden="true">
          <span class="h2-orb one"></span><span class="h2-orb two"></span>

          <div class="h2-float delivery">
            <div class="h2-float-title"><i>📍</i> متاجر قريبة</div>
            <p>يبدأ الطلب من منطقتك، وليس من قائمة عامة عشوائية.</p>
          </div>

          <div class="h2-float price">
            <div class="h2-float-title"><i>₺</i> وضوح السعر</div>
            <p>عمولة دكانجي على المنتجات صفر، والتوصيل واضح قبل التأكيد.</p>
            <div class="h2-price-line"><span>عمولة دكانجي</span><strong class="h2-zero">0</strong></div>
          </div>

          <div class="h2-phone">
            <div class="h2-screen">
              <div class="h2-screen-top">
                <div class="h2-loc">📍 إسطنبول — المتاجر الأقرب لك</div>
                <div class="h2-screen-title">ماذا تريد أن تطلب اليوم؟</div>
                <div class="h2-pseudo-search">🔎 ابحث عن متجر أو منتج</div>
              </div>
              <div class="h2-cat-row">
                <div class="h2-cat"><b>🍽️</b>مطاعم</div>
                <div class="h2-cat"><b>🛒</b>ماركت</div>
                <div class="h2-cat"><b>🥩</b>ملاحم</div>
                <div class="h2-cat"><b>☕</b>قهوة</div>
              </div>
              <div class="h2-store-list">
                <div class="h2-store-card"><div class="h2-store-logo">🍗</div><div><h3>مطعم الخوالي</h3><p>وجبات ومشاوي — متاح للطلب</p><span class="h2-chip">★ تجربة قابلة للتقييم</span></div></div>
                <div class="h2-store-card"><div class="h2-store-logo">🧀</div><div><h3>صفا الشام ماركت</h3><p>مواد غذائية ومنتجات يومية</p><span class="h2-chip">₺ سعر واضح</span></div></div>
                <div class="h2-store-card"><div class="h2-store-logo">🍰</div><div><h3>حلويات الحي</h3><p>حلويات وقهوة وضيافة</p><span class="h2-chip">✓ قريب منك</span></div></div>
              </div>
              <div class="h2-checkout">
                <div class="h2-checkout-row"><span>سلة مختصرة</span><strong>الإجمالي يظهر قبل التأكيد</strong></div>
                <div class="h2-checkout-btn">راجع الطلب</div>
              </div>
            </div>
          </div>

          <div class="h2-float rating">
            <div class="h2-float-title"><i>⭐</i> تقييم المتاجر</div>
            <p>الترتيب يتبع الجودة والتجربة، لا الظهور العشوائي.</p>
            ${heroRatingFloat}
            <div class="h2-bars">
              <div class="h2-bar"><span style="width:82%"></span></div>
              <div class="h2-bar"><span style="width:68%"></span></div>
              <div class="h2-bar"><span style="width:76%"></span></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    ${bannerStripHTML("home_top")}

    <section class="section mobile-shop-tiles-section">
      <div class="container">
        <div class="shop-tiles-grid">
          ${homeCategoriesOrdered().map((c, i) => shopTile(c.name, c.image, c.caption, i === 0)).join("")}
        </div>
      </div>
    </section>

    <section class="section nearby-section" id="nearby-stores">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">اختيارات يحبها الجيران</span><h2>متاجر قريبة منك الآن</h2></div>
          <a href="/stores" data-route="stores">استكشف الكل ${icon("arrowLeft")}</a>
        </div>
        ${openStoresCount ? `<div class="live-activity-pill"><span class="live-dot"></span> متاجر مفتوحة الآن: ${openStoresCount.toLocaleString("ar")}</div>` : ""}
        <div class="store-grid">${featuredStores.map(nearbyStoreCard).join("")}</div>
      </div>
    </section>

    <section class="section ask-dukkanci-cta-section">
      <div class="container">
        <a class="ask-dukkanci-cta" href="/ask-dukkanci" data-route="ask-dukkanci">
          <span class="ask-dukkanci-cta__icon">${icon("stars")}</span>
          <span class="ask-dukkanci-cta__copy"><strong>مش عارف تطلب ايه؟ اسأل دكانجي</strong><span>قل لنا عدد الأشخاص وميزانيتك، ونرتب لك اقتراح طلب متكامل خلال ثوانٍ</span></span>
          <span class="ask-dukkanci-cta__go">${icon("arrowLeft")}</span>
        </a>
      </div>
    </section>

    ${mostOrdered.length ? `
    <section class="section most-ordered-section">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">تجربة مضمونة</span><h2>الأكثر طلباً اليوم</h2></div>
        </div>
        <div class="product-grid">${mostOrdered.map(p => homeProductCard(p, { badge: true })).join("")}</div>
      </div>
    </section>` : ""}

    <section class="section offers-section">
      <div class="container">
        <div class="offers-banner">
          <div class="offers-banner__copy">
            <span class="eyebrow light"><span></span> ${escAttr(hb.eyebrow)}</span>
            <h2>عروض اليوم</h2>
            <p>${escAttr(hb.subtitle)}</p>
            <a ${bAttrs} class="light-button">${escAttr(hb.button)} ${icon("arrowLeft")}</a>
          </div>
          <div class="offer-products">
            ${hb.image ? `<a ${bAttrs} class="offers-banner__image" style="display:block;width:100%;border-radius:18px;overflow:hidden"><img src="${escAttr(hb.image)}" alt="${escAttr(hb.title)}" style="width:100%;display:block;object-fit:cover"></a>` : offerProducts.slice(0, 2).map(product => `
              <button class="mini-offer-card" data-action="open-product" data-id="${product.id}">
                <img src="${escAttr(product.image)}" alt="${escAttr(product.name)}">
                <span><small>عرض اليوم</small><strong>${esc(product.name)}</strong><b>${money(product.price)}</b></span>
              </button>
            `).join("")}
          </div>
        </div>
        ${offerProducts.length ? `<div class="product-grid home-offer-grid">${offerProducts.map(homeOfferCard).join("")}</div>` : ""}
      </div>
    </section>

    ${bannerStripHTML("home_mid")}

    <section class="section categories-section">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">تسوّق حسب رغبتك</span><h2>ماذا تحتاج اليوم؟</h2></div>
          <a href="/stores" data-route="stores">عرض كل المتاجر ${icon("arrowLeft")}</a>
        </div>
        <div class="category-grid">
          ${homeCategoriesOrdered().map(c => categoryCard(c.name, c.image, c.caption)).join("")}
        </div>
      </div>
    </section>

    ${recommended.length ? `
    <section class="section recommended-section">
      <div class="container">
        <div class="section-heading">
          <div><span class="section-kicker">مختارات متنوعة</span><h2>منتجات مقترحة لك</h2></div>
        </div>
        <div class="product-grid">${recommended.map(p => homeProductCard(p)).join("")}</div>
      </div>
    </section>` : ""}

    <section class="section confidence-section">
      <div class="container">
        <div class="section-heading centered">
          <div><span class="section-kicker">ثقة من أول طلب</span><h2>اطلب بثقة</h2></div>
        </div>
        <div class="confidence-grid">
          <article>${icon("shield")}<h3>الدفع عند الاستلام</h3><p>لا حاجة لبطاقة أو دفع مسبق — تدفع عند وصول طلبك.</p></article>
          <article>${icon("whatsapp")}<h3>تأكيد الطلب عبر واتساب</h3><p>يصلك تأكيد فوري بتفاصيل طلبك فور إرساله.</p></article>
          <article>${icon("headset")}<h3>دعم مباشر عند الحاجة</h3><p>فريقنا جاهز لمساعدتك في أي استفسار حول طلبك.</p></article>
          <article>${icon("store")}<h3>متاجر محلية موثوقة</h3><p>كل متجر على المنصة من حيّك ويخضع للتقييم المستمر.</p></article>
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

    <section class="section whatsapp-assist-section">
      <div class="container">
        <div class="whatsapp-assist">
          <div class="whatsapp-assist__copy">
            <h2>تحتاج مساعدة؟ اطلب عبر واتساب</h2>
            <p>فريقنا يساعدك في اختيار المتجر المناسب وإتمام طلبك خلال دقائق.</p>
          </div>
          <a class="whatsapp-button" href="https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent("مرحباً، أحتاج مساعدة في طلب من دكانجي")}" target="_blank" rel="noopener">${icon("whatsapp")} تواصل معنا عبر واتساب</a>
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
    const syn = productSynonymIndex.get(product.id);   // already-normalized dialect alt-names
    const hay = normalizeAr(`${product.name} ${product.category} ${getStore(product.storeId)?.name || ""}`) + (syn ? " " + syn : "");
    if (terms.every(t => hay.includes(t))) {
      out.push(product);
      if (out.length >= limit) break;
    }
  }
  return out;
}

// "ملاحم" is the homepage/browse grouping label; individual stores may carry a
// more specific category text (e.g. "ملحمة ومشاوي") that still belongs under
// it. Shared by getFilteredStores() (the /stores filter pills) and
// renderCategoryPage() (/category/<slug>) so both pages agree on membership.
function storeMatchesCategory(store, catText) {
  return store.category === catText || (catText === "ملاحم" && store.category.includes("ملحم"));
}

function getFilteredStores() {
  const q = normalizeAr(state.search);
  const terms = q.split(" ").filter(Boolean);
  let result = stores.filter(store => {
    if (!isStoreApproved(store)) return false;
    const categoryMatch = state.storeFilter === "الكل" || storeMatchesCategory(store, state.storeFilter);
    const text = normalizeAr(`${store.name} ${store.category} ${store.description}`);
    return categoryMatch && terms.every(t => text.includes(t));
  });

  // Collapse branch groups to their nearest branch FIRST, then sort the
  // representative cards — so distance ordering reflects the actual closest shop.
  result = collapseBranchGroups(result);

  if (state.storeSort === "rating") result.sort((a, b) => b.rating - a.rating);
  else if (state.storeSort === "delivery") result.sort((a, b) => deliverySortValue(a) - deliverySortValue(b));
  else if (state.storeSort === "distance") result.sort(compareStoresByDistance);
  else if (state.storeSort === "open") result.sort((a, b) => Number(isStoreOpenNow(b)) - Number(isStoreOpenNow(a)));
  else if (state.storeSort === "offers") result.sort((a, b) => Number(b.hasOffer) - Number(a.hasOffer));
  else if (state.userLocation) {
    // Default "recommended" view: once we know where the visitor is, surface the
    // genuinely nearest stores (open ones first) instead of the bundled order.
    result.sort((a, b) => Number(isStoreOpenNow(b)) - Number(isStoreOpenNow(a)) || compareStoresByDistance(a, b));
  }
  // Paid-priority stores lead the default "recommended" view (no explicit
  // sort chosen by the visitor); an explicit sort choice (rating/delivery/
  // distance/open/offers) is respected as-is and not overridden.
  if (!state.storeSort || state.storeSort === "recommended") result = sortStoresByPaidPriority(result);
  return result;
}

function renderStores() {
  const result = getFilteredStores();
  const categories = ["الكل", ...storeCategoryNames()];
  return `
    <section class="page-hero compact">
      <div class="container">
        <span class="section-kicker">اكتشف محلات حيك</span>
        <h1>المتاجر القريبة منك</h1>
        <p>متاجر محلية موثوقة ومنتجات تعرفها، تصل إلى بابك.</p>
        <div class="listing-search">
          ${icon("search")}
          <input id="stores-search" type="search" placeholder="ابحث باسم متجر أو تصنيف..." value="${state.search}">
          <button type="button" class="search-clear" data-action="clear-search" aria-label="مسح البحث" title="مسح">${icon("close")}</button>
          ${voiceSearchButton("stores")}
          <button data-action="run-store-search">بحث</button>
        </div>
      </div>
    </section>
    <section class="section listing-section">
      <div class="container">
        <div class="listing-toolbar">
          <div class="filter-pills">
            ${categories.map(category => `<button class="${state.storeFilter === category ? "active" : ""}" data-action="store-filter" data-category="${escAttr(category)}">${esc(category)}</button>`).join("")}
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

// Seeded per-item pseudo-random key (mulberry32 mixed with the product id),
// NOT a Fisher-Yates shuffle — the sort order for a given (seed, id) pair is
// fixed regardless of the source array's order or length. That matters
// because the offers page paints from a near-empty bundled catalog first,
// then re-renders as the un-ordered Supabase hydration and the full
// id-ordered catalog load land a few seconds apart: a sequence-dependent
// shuffle (Fisher-Yates) would produce a different permutation each time and
// rearrange the whole grid under the visitor mid-visit. A per-item key sorts
// the same regardless of input order, so it only shows random order per
// visit while staying stable across those re-renders.
function seededRandomKey(seed, id) {
  let s = (seed ^ Math.imul(id, 0x9E3779B1)) >>> 0;
  s = (s + 0x6D2B79F5) >>> 0;
  let t = Math.imul(s ^ (s >>> 15), 1 | s);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return (t ^ (t >>> 14)) >>> 0;
}
function seededShuffle(list, seed) {
  return list.map(item => [seededRandomKey(seed, item.id), item]).sort((a, b) => a[0] - b[0]).map(pair => pair[1]);
}

// Store-level promo banners on /offers — distinct from the admin "عرض اليوم"
// dailyDeal hero above (bound to ONE product): each entry calls out a
// whole-category discount for one store. The claim is checked against real
// product data at render time (categoryContains matched against product.category,
// oldPrice/available required) — if the store or category no longer has ANY
// matching discounted product the banner silently stops rendering instead of
// showing a stale/false claim. 2026-07-18: طلب المستخدم بانر لباشا بيتزريا
// («خصم 10% على أطباق البيتزا لعملاء دكانجي») — طُبِّق خصم 10% حقيقي على كل
// الـ30 صنف بيتزا في المتجر (كان 13 منها فقط مخفَّضاً سابقاً) ليكون الادّعاء
// صحيحاً 100% قبل بناء هذا البانر، وليس مجرد نص تسويقي بلا سعر فعلي خلفه.
const OFFERS_PAGE_STORE_PROMOS = [
  { storeId: 56, categoryContains: "بيتزا", headline: "خصم 10% على أطباق البيتزا", sub: "لعملاء دكانجي — على كل أصناف البيتزا" }
];
function offersPageStorePromoBanners() {
  return OFFERS_PAGE_STORE_PROMOS.map(promo => {
    const store = getStore(promo.storeId);
    if (!store || !isStoreApproved(store)) return null;
    const matches = products.filter(p => p.storeId === promo.storeId && p.available && p.oldPrice && (p.category || "").includes(promo.categoryContains));
    if (!matches.length) return null;
    return { store, promo };
  }).filter(Boolean);
}

// ============================================================================
// نظام البانرات المُدار — 2026-07-19
// ============================================================================
// تعريفات البانرات تعيش في site_settings.banners (jsonb) وليس في جدول مستقل،
// عمداً: site_settings مقروء أصلاً في كل تحميل صفحة عبر loadSiteSettings()،
// والكتابة تمر بـ action=save-settings الذي يحوّل الصور المرفوعة تلقائياً إلى
// روابط مستضافة (offloadJsonImages) — فلا يدخل base64 ضخم في صفّ يُقرأ على كل
// زيارة. والأهم: صفر DDL، فالميزة تعمل فور النشر بلا انتظار ترحيل يدوي.
// (أحداث النقر/الظهور وحدها تحتاج جدولاً — راجع migrations/20260719_banners_and_banner_events.sql.)
//
// الشكل: { items: [ {...banner} ], limits: { "<placement>": عدد } }
// كل بانر: { id, title, placement, image, headline, sub, cta, linkType, linkValue,
//            startAt, endAt, active, sort, categoryKey }
//
// هذه طبقة جديدة مستقلة تماماً: لا تلمس ولا تستبدل شرائح الهيرو الأربع ولا
// homeBanner ولا dailyDeal ولا OFFERS_PAGE_STORE_PROMOS — كلها تبقى كما هي.
const BANNER_PLACEMENTS = [
  { key: "home_top", label: "الرئيسية — أعلى الصفحة", hint: "تحت الهيرو مباشرة، أول ما يراه الزائر", limit: 3 },
  { key: "home_mid", label: "الرئيسية — وسط الصفحة", hint: "قبل قسم «ماذا تحتاج اليوم؟»", limit: 3 },
  { key: "offers_top", label: "صفحة العروض — أعلى", hint: "أعلى /offers قبل خصومات اليوم", limit: 3 },
  { key: "category_top", label: "صفحة قسم — أعلى", hint: "داخل قسم محدد فقط (مطاعم، حلويات...)", limit: 2 },
  { key: "app_home", label: "تطبيق الجوال — الرئيسية", hint: "يظهر في تطبيق Flutter وليس على الموقع", limit: 5 }
];
const BANNER_LINK_TYPES = [
  { key: "store", label: "متجر" },
  { key: "product", label: "منتج" },
  { key: "category", label: "قسم" },
  { key: "url", label: "رابط خارجي" },
  { key: "none", label: "بلا رابط (عرض فقط)" }
];

function bannerSettings() {
  const raw = (state.siteSettings && state.siteSettings.banners) || {};
  return {
    items: Array.isArray(raw.items) ? raw.items : [],
    limits: (raw.limits && typeof raw.limits === "object") ? raw.limits : {}
  };
}

function bannerPlacementLimit(key) {
  const { limits } = bannerSettings();
  const custom = Number(limits[key]);
  if (Number.isFinite(custom) && custom > 0) return custom;
  const def = BANNER_PLACEMENTS.find(p => p.key === key);
  return def ? def.limit : 3;
}

// Parses a banner date field. Admin inputs are <input type="date"> (date-only,
// e.g. "2026-08-01"). Treating an end date as raw midnight would expire the
// banner at the START of the day the admin picked — so a date-only endAt is
// pushed to the end of that day, which is what "ينتهي في 1 أغسطس" actually means.
function bannerTime(value, endOfDay) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;
  const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(raw);
  const ms = Date.parse(dateOnly ? `${raw}T00:00:00` : raw);
  if (!Number.isFinite(ms)) return null;
  return (dateOnly && endOfDay) ? ms + 86399999 : ms;
}

// "paused" | "scheduled" | "expired" | "live"
function bannerScheduleState(banner, nowMs) {
  if (!banner || banner.active === false) return "paused";
  const now = Number.isFinite(nowMs) ? nowMs : Date.now();
  const start = bannerTime(banner.startAt, false);
  const end = bannerTime(banner.endAt, true);
  if (start && now < start) return "scheduled";
  if (end && now > end) return "expired";
  return "live";
}

// Resolves a banner's link to a real, currently-valid target. Returns null when
// the target went stale (store deleted/unapproved, product removed/unavailable,
// category renamed) — same render-time truth-validation rule the dailyDeal hero
// and offersPageStorePromoBanners() already follow: a banner whose destination
// no longer exists must disappear, never render as a dead click.
function bannerLinkTarget(banner) {
  const type = banner.linkType || "none";
  const value = String(banner.linkValue == null ? "" : banner.linkValue).trim();
  if (type === "none" || !value) return { kind: "none", attrs: "", tag: "div" };
  if (type === "store") {
    const store = getStore(Number(value));
    if (!store || !isStoreApproved(store)) return null;
    return { kind: "store", tag: "button", attrs: `data-action="open-store" data-id="${store.id}"` };
  }
  if (type === "product") {
    const product = products.find(p => p.id === Number(value));
    if (!product || product.available === false) return null;
    const store = getStore(product.storeId);
    if (!store || !isStoreApproved(store)) return null;
    return { kind: "product", tag: "button", attrs: `data-action="open-product" data-id="${product.id}"` };
  }
  if (type === "category") {
    if (!CATEGORY_MAP[value]) return null;
    return { kind: "category", tag: "a", attrs: `href="/category/${escAttr(value)}" data-route="category/${escAttr(value)}"` };
  }
  if (type === "url") {
    if (!/^(https?:|tel:|mailto:|\/)/i.test(value)) return null;
    const external = /^https?:/i.test(value);
    return { kind: "url", tag: "a", attrs: `href="${escAttr(value)}"${external ? ' target="_blank" rel="noopener"' : ""}` };
  }
  return null;
}

// The single source of truth for "which banners should be on screen right now".
// Used by every web surface AND mirrored by the Flutter app (see
// lib/features/banners/domain/banner.dart — keep both in sync).
function activeBanners(placement, opts = {}) {
  const now = Date.now();
  return bannerSettings().items
    .filter(b => b && b.id && b.placement === placement)
    .filter(b => bannerScheduleState(b, now) === "live")
    .filter(b => placement !== "category_top" || (b.categoryKey && b.categoryKey === opts.categoryKey))
    .filter(b => b.image || b.headline)
    .map(b => ({ banner: b, target: bannerLinkTarget(b) }))
    .filter(x => x.target)
    .sort((a, b) => (Number(a.banner.sort) || 0) - (Number(b.banner.sort) || 0))
    .slice(0, bannerPlacementLimit(placement));
}

function bannerCardHTML({ banner, target }, placement) {
  const clickable = target.kind !== "none";
  const tag = target.tag;
  const label = banner.headline || banner.title || "بانر";
  return `<${tag} class="managed-banner${clickable ? "" : " is-static"}${banner.image ? "" : " no-image"}" ${target.attrs} data-banner-id="${escAttr(banner.id)}" data-banner-placement="${escAttr(placement)}"${clickable ? ` aria-label="${escAttr(label)}"` : ""}>
      ${banner.image ? `<img src="${escAttr(banner.image)}" alt="${escAttr(label)}" loading="lazy">` : ""}
      <span class="managed-banner__gradient"></span>
      <span class="managed-banner__body">
        ${banner.headline ? `<strong>${esc(banner.headline)}</strong>` : ""}
        ${banner.sub ? `<small>${esc(banner.sub)}</small>` : ""}
        ${clickable && banner.cta ? `<span class="managed-banner__cta">${esc(banner.cta)} ${icon("arrowLeft")}</span>` : ""}
      </span>
    </${tag}>`;
}

// Multiple banners in one placement render as a manual-swipe horizontal strip.
// Deliberately NO auto-advance — auto-motion carousels are a standing product
// rejection on this project (mobile category strip, 2026-06; Flutter PromoHero,
// 2026-07-17). The visitor moves it, never the page.
function bannerStripHTML(placement, opts = {}) {
  const list = activeBanners(placement, opts);
  if (!list.length) return "";
  const multi = list.length > 1;
  return `
    <section class="section managed-banners-section">
      <div class="container">
        <div class="managed-banners${multi ? " managed-banners--strip" : ""}">
          ${list.map(item => bannerCardHTML(item, placement)).join("")}
        </div>
      </div>
    </section>`;
}

// ---- قياس كفاءة البانرات: إرسال حدث ظهور/نقر ----
// يُكتب في جدول banner_events المجهول تماماً (بلا أي معرّف زائر) عبر الخادم.
// الفشل صامت دائماً: العدّاد لا يجوز أن يعطّل تصفّح العميل بأي حال.
function trackBannerEvent(bannerId, placement, type) {
  if (!bannerId || !type) return;
  try {
    const body = JSON.stringify({ bannerId, placement: placement || "", type, source: "web" });
    const url = "/api/notify-order?action=banner-event";
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    } else {
      fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch (e) { /* never break the page for a counter */ }
}

// Impression = at least half the banner actually reached the visitor's screen,
// not merely "was somewhere in the page" — otherwise a banner far below the fold
// would inflate its own impressions and make CTR meaningless. Counted once per
// banner per browsing session, so bouncing between pages doesn't multiply views.
//
// Implemented with an explicit geometry check on a rAF-throttled passive scroll
// listener rather than IntersectionObserver. IO is the more idiomatic tool, but
// its callbacks are tied to the browser's rendering step and can be starved
// entirely in non-painting contexts (verified: a control IO on a fully visible
// element delivered zero callbacks in the automated browser used to test this).
// A silently-zero impression counter would poison every CTR number in the admin
// dashboard, so correctness wins over idiom here. The listener detaches itself
// as soon as every banner on the page has been counted, so the steady-state cost
// is zero.
function setupBannerImpressions() {
  const detach = () => {
    if (!state._bannerImpressionHandler) return;
    window.removeEventListener("scroll", state._bannerImpressionHandler);
    window.removeEventListener("resize", state._bannerImpressionHandler);
    state._bannerImpressionHandler = null;
  };
  detach(); // a re-render replaced the DOM — drop the previous page's listener

  const seen = state._bannerSeen || (state._bannerSeen = new Set());
  let pending = [...document.querySelectorAll("[data-banner-id]")]
    .filter(el => el.dataset.bannerId && !seen.has(el.dataset.bannerId));
  if (!pending.length) return;

  const check = () => {
    const viewportH = window.innerHeight || document.documentElement.clientHeight || 0;
    pending = pending.filter(el => {
      const id = el.dataset.bannerId;
      if (seen.has(id)) return false;
      const rect = el.getBoundingClientRect();
      if (!rect.height) return true; // not laid out yet — keep watching
      const visible = Math.max(0, Math.min(rect.bottom, viewportH) - Math.max(rect.top, 0));
      if (visible / rect.height < 0.5) return true;
      seen.add(id);
      let already = false;
      try { already = sessionStorage.getItem("dkbi:" + id) === "1"; } catch (e) { /* private mode */ }
      if (!already) {
        try { sessionStorage.setItem("dkbi:" + id, "1"); } catch (e) { /* ignore */ }
        trackBannerEvent(id, el.dataset.bannerPlacement, "impression");
      }
      return false;
    });
    if (!pending.length) detach();
  };

  // Time-based throttle rather than requestAnimationFrame: rAF is also tied to
  // the rendering loop and can be starved in the same contexts that starve IO,
  // whereas timers keep running. 150ms is well under the time it takes a person
  // to scroll a banner into view and read it.
  let queued = false;
  state._bannerImpressionHandler = () => {
    if (queued) return;
    queued = true;
    setTimeout(() => { queued = false; check(); }, 150);
  };
  window.addEventListener("scroll", state._bannerImpressionHandler, { passive: true });
  window.addEventListener("resize", state._bannerImpressionHandler, { passive: true });
  check(); // count whatever is already on screen at first paint
}

function renderOffers() {
  // render() writes state._lastNavKey ("offers/") only after this returns, so
  // "the visitor just navigated here" is exactly when it still holds another
  // route — that's the moment to draw a fresh shuffle seed.
  if (state._lastNavKey !== "offers/" || !state._offersSeed) state._offersSeed = Math.max(1, (Math.random() * 0x7fffffff) | 0);
  // Categories come from the UNshuffled list so the filter pills keep a
  // stable order across visits — only the product grid itself is shuffled.
  const baseOfferProducts = products.filter(product => product.oldPrice && product.available);
  const offerCategories = [...new Set(baseOfferProducts.map(product => (getStore(product.storeId) || {}).category).filter(Boolean))];
  // Paid-priority stores' offers lead the grid (in PAID_PRIORITY_STORE_IDS
  // order), before everything else — only the remainder is shuffled per visit.
  const priorityOfferProducts = sortProductsByPaidPriority(baseOfferProducts.filter(product => paidPriorityRank(product.storeId) < PAID_PRIORITY_STORE_IDS.length));
  const restOfferProducts = baseOfferProducts.filter(product => paidPriorityRank(product.storeId) >= PAID_PRIORITY_STORE_IDS.length);
  const allOfferProducts = [...priorityOfferProducts, ...seededShuffle(restOfferProducts, state._offersSeed)];
  const activeOffersCategory = offerCategories.includes(state.offersCategory) ? state.offersCategory : "الكل";
  const offerProducts = activeOffersCategory === "الكل"
    ? allOfferProducts
    : allOfferProducts.filter(product => (getStore(product.storeId) || {}).category === activeOffersCategory);
  // «عرض اليوم» — admin-managed hero (site_settings.dailyDeal = {image, storeId,
  // productId}): an uploaded banner image bound to one product; tapping it opens
  // that product. Rendered only while the bound product still exists and is
  // available, and its store is still approved — a removed/sold-out product
  // or a store demoted after the deal was bound silently falls back to the
  // default hero rather than leaving a dead (or still-orderable-from-a-
  // delisted-store) banner.
  const DD = (state.siteSettings && state.siteSettings.dailyDeal) || {};
  const ddProductRaw = DD.image && DD.productId ? products.find(p => p.id === Number(DD.productId) && p.available) : null;
  const ddStore = ddProductRaw ? getStore(ddProductRaw.storeId) : null;
  const ddProduct = ddStore && isStoreApproved(ddStore) ? ddProductRaw : null;
  const ddPct = ddProduct && ddProduct.oldPrice ? Math.round((1 - ddProduct.price / ddProduct.oldPrice) * 100) : 0;
  const storePromoBanners = offersPageStorePromoBanners();
  return `
    <section class="page-hero offers-page-hero${ddProduct ? " offers-page-hero--dd" : ""}">
      ${ddProduct ? `
      <div class="container">
        <button class="dd-hero" data-action="open-product" data-id="${ddProduct.id}" aria-label="عرض اليوم: ${escAttr(ddProduct.name)}">
          <img src="${escAttr(DD.image)}" alt="${escAttr(ddProduct.name)}">
          <span class="dd-hero__badge">${icon("percent")} عرض اليوم</span>
          <span class="dd-hero__info">
            <strong>${esc(ddProduct.name)}</strong>
            ${ddStore ? `<small>${esc(ddStore.name)}</small>` : ""}
            <span class="dd-hero__price"><b>${money(ddProduct.price)}</b>${ddProduct.oldPrice ? `<del>${money(ddProduct.oldPrice)}</del>` : ""}${ddPct > 0 ? `<i>وفر ${ddPct}%</i>` : ""}</span>
          </span>
        </button>
      </div>` : `
      <div class="container offers-page-grid">
        <div><span class="eyebrow light"><span></span> وفر على كل طلب</span><h1>عروض دكانجي</h1><p>أفضل عروض متاجر الحي، مجموعة في مكان واحد وتتجدد باستمرار.</p></div>
        <div class="big-percent">%</div>
      </div>`}
    </section>
    ${bannerStripHTML("offers_top")}
    ${storePromoBanners.length ? `
    <section class="section store-promo-banners-section">
      <div class="container">
        ${storePromoBanners.map(({ store, promo }) => `
          <button class="store-promo-banner" data-action="open-store" data-id="${store.id}" aria-label="${escAttr(promo.headline)} — ${escAttr(store.name)}">
            <img src="${escAttr(store.coverImage || store.image)}" alt="${escAttr(store.name)}">
            <span class="store-promo-banner__gradient"></span>
            <span class="store-promo-banner__body">
              <b class="store-promo-banner__badge">${icon("percent")} عرض خاص</b>
              <strong>${esc(promo.headline)}</strong>
              <small>${esc(promo.sub)} · ${esc(store.name)}</small>
            </span>
            <span class="store-promo-banner__go">${icon("arrowLeft")}</span>
          </button>
        `).join("")}
      </div>
    </section>` : ""}
    <section class="section">
      <div class="container">
        <div class="section-heading"><div><span class="section-kicker">لفترة محدودة</span><h2>خصومات اليوم</h2></div><span class="count-chip">${offerProducts.length} عروض متاحة</span></div>
        ${offerCategories.length > 1 ? `<div class="filter-pills" style="margin-bottom:18px">
          <button class="${activeOffersCategory === "الكل" ? "active" : ""}" data-action="offers-filter" data-category="الكل">الكل</button>
          ${offerCategories.map(category => `<button class="${activeOffersCategory === category ? "active" : ""}" data-action="offers-filter" data-category="${escAttr(category)}">${esc(category)}</button>`).join("")}
        </div>` : ""}
        ${offerProducts.length ? `<div class="product-grid">${offerProducts.map(productCard).join("")}</div>` : renderEmpty("لا توجد عروض في هذا التصنيف حالياً", "جرّب تصنيفاً آخر أو تصفّح كل العروض.")}
      </div>
    </section>
  `;
}

// ---- Store-page category organizer (display layer only — never mutates product.category
// or writes anything back to Supabase; see "تعليمة تنظيم تصنيفات المتاجر"). Groups a store's
// raw merchant-typed product.category strings into an ordered, deduped, non-empty set of
// display buckets: known synonyms of the same category collapse together, and tiny
// (<=2 product) one-off categories fold into a related bucket via a curated keyword list —
// or land in "تصنيفات أخرى" when no confident match exists. "العروض"/"الأكثر طلباً" are
// handled separately as dedicated sliders (storeOfferProducts/storePopularProducts below),
// not as pills, so they're intentionally excluded from these order lists.
const RESTAURANT_CATEGORY_ORDER = [
  "وجبات الإفطار", "الشوربات", "السلطات", "المقبلات الباردة", "المقبلات الساخنة", "المقبلات",
  "الأطباق الرئيسية", "المشاوي", "البرغر", "الشاورما", "السندويشات", "البيتزا",
  "المناقيش والمعجنات", "الأرز والمعكرونة", "الوجبات الفردية", "الوجبات العائلية", "وجبات الأطفال",
  "الأطباق الجانبية", "الإضافات والصوصات", "الحلويات", "المشروبات الساخنة", "العصائر والكوكتيلات",
  "المشروبات الباردة", "المشروبات الغازية والمياه"
];
const SUPERMARKET_CATEGORY_ORDER = [
  "وصل حديثاً", "الخضروات والفواكه", "اللحوم والدواجن", "الأسماك والمأكولات البحرية", "الألبان والأجبان",
  "البيض", "المخبوزات والخبز", "المواد الغذائية الأساسية", "الأرز والحبوب", "البقوليات",
  "المعكرونة والشعيرية", "الطحين ومستلزمات الخَبز", "الزيوت والسمن", "السكر والملح", "المعلبات",
  "الصلصات ومعجون الطماطم", "التوابل والبهارات", "المخللات والزيتون", "منتجات الإفطار", "العسل والمربى",
  "الشوكولاتة والحلويات", "البسكويت والكيك", "الشيبس والمقرمشات", "المكسرات والفواكه المجففة", "المجمدات",
  "الوجبات الجاهزة", "المياه", "المشروبات الغازية", "العصائر", "الشاي والقهوة", "مشروبات الطاقة",
  "حليب الأطفال وأغذية الأطفال", "العناية الشخصية", "العناية بالشعر والجسم", "المناديل والمنتجات الورقية",
  "المنظفات المنزلية", "مستلزمات المطبخ", "مستلزمات المنزل", "منتجات الحيوانات الأليفة", "تصنيفات موسمية"
];
// Loose match key: trims, drops Arabic diacritics/tatweel, and strips a leading "ال" from
// EACH word (not just the first) so "المشروبات"/"مشروبات" or "المقبلات الباردة"/"مقبلات باردة"
// collapse to the same key without needing an explicit alias for every "ال" variant.
function normalizeCategoryKey(raw) {
  return String(raw || "")
    .trim()
    .replace(/[ـً-ٟ]/g, "")
    .replace(/\s+/g, " ")
    .split(" ")
    .map(w => (w.length > 2 && w.startsWith("ال") ? w.slice(2) : w))
    .join(" ");
}
function buildCategoryAliasMap(orderList, extraSynonyms) {
  const map = {};
  orderList.forEach(name => { map[normalizeCategoryKey(name)] = name; });
  Object.keys(extraSynonyms).forEach(k => { map[normalizeCategoryKey(k)] = extraSynonyms[k]; });
  return map;
}
// Explicit synonym examples from the spec (section "رابعاً: منع التصنيفات المكررة") beyond
// what the "ال"-stripping above already unifies on its own.
const RESTAURANT_CATEGORY_ALIASES = buildCategoryAliasMap(RESTAURANT_CATEGORY_ORDER, {
  "مشروب": "المشروبات الباردة",
  "الحلو": "الحلويات",
  "قسم الحلويات": "الحلويات",
  "عصير طبيعي": "العصائر والكوكتيلات",
  "عصائر طازجة": "العصائر والكوكتيلات",
  "عصائر": "العصائر والكوكتيلات",
  "أنواع السلطات": "السلطات",
  "السلطة": "السلطات",
  "مقبلات متنوعة": "المقبلات"
});
const SUPERMARKET_CATEGORY_ALIASES = buildCategoryAliasMap(SUPERMARKET_CATEGORY_ORDER, {
  "صلصات": "الصلصات ومعجون الطماطم",
  "طحينة": "الصلصات ومعجون الطماطم"
});
// Small (<=2 product) categories that don't match an official name outright get one more
// chance via these keyword lists before falling into "تصنيفات أخرى" (spec section
// "رابعاً"/"سادساً"). Never applied to a category that already resolved to an official name —
// official categories are never auto-merged away just for being small.
const RESTAURANT_MERGE_TARGETS = [
  { target: "المقبلات الباردة", keywords: ["حمص", "متبل", "لبنة", "ورق عنب", "بابا غنوج"] },
  { target: "المقبلات الساخنة", keywords: ["كبة مقلية", "كبة", "سمبوسك", "أصابع جبن", "بطاطا مقلية", "بطاطا"] },
  { target: "الإضافات والصوصات", keywords: ["كاتشب", "مايونيز", "ثوم", "خبز إضافي", "صوص"] },
  { target: "الأطباق الجانبية", keywords: ["أرز جانبي", "خضار مشكل", "برغل"] },
  { target: "المشروبات الباردة", keywords: ["مياه", "عيران", "كولا", "مشروب غازي", "مشروبات غازية"] },
  { target: "المشروبات الساخنة", keywords: ["قهوة", "شاي", "نسكافيه"] },
  { target: "الحلويات", keywords: ["كنافة", "بقلاوة", "كيك", "مهلبية"] }
];
const SUPERMARKET_MERGE_TARGETS = [
  { target: "البقوليات", keywords: ["عدس", "حمص", "فاصولياء", "فاصوليا"] },
  { target: "الأرز والحبوب", keywords: ["أرز مصري", "أرز بسمتي", "برغل", "أرز"] },
  { target: "الزيوت والسمن", keywords: ["زيت دوار الشمس", "زيت زيتون", "سمن", "زيت"] },
  { target: "السكر والملح", keywords: ["سكر", "ملح"] },
  { target: "الصلصات ومعجون الطماطم", keywords: ["كاتشب", "مايونيز", "دبس رمان", "طحينة", "صلصة"] },
  { target: "العسل والمربى", keywords: ["مربى", "عسل", "دبس"] },
  { target: "العناية الشخصية", keywords: ["شامبو", "صابون", "مزيل عرق"] },
  { target: "المنظفات المنزلية", keywords: ["مسحوق غسيل", "سائل جلي", "منظف أرضيات", "منظف"] },
  { target: "المناديل والمنتجات الورقية", keywords: ["محارم", "ورق تواليت", "مناديل مطبخ", "مناديل"] }
];
// Returns an ordered array of { label, rawCategories:[...], products:[...] } — one entry per
// non-empty display category, built purely from `allStoreProducts` already passed to this
// render (which already went through applyPublishingRules upstream). Nothing here is
// persisted; it's recomputed fresh on every render.
// ---- Phase 2: manual admin/merchant overrides on top of the Phase 1 automatic
// plan above (migrations/20260719_store_category_settings.sql, action=save-store-categories
// in api/notify-order.js). store.categorySettings = { admin:{[raw]:override}, merchant:{...} }.
// Platform-admin's override for a raw category wins wholesale over the merchant's
// for that SAME raw category when both exist — not merged field-by-field, the
// whole record wins, matching the spec's plain "admin priority over merchant" rule.
function resolveCategoryOverride(store, raw) {
  const cs = store && store.categorySettings;
  if (!cs || typeof cs !== "object") return null;
  const admin = cs.admin && typeof cs.admin === "object" ? cs.admin[raw] : null;
  if (admin && typeof admin === "object") return admin;
  const merchant = cs.merchant && typeof cs.merchant === "object" ? cs.merchant[raw] : null;
  return (merchant && typeof merchant === "object") ? merchant : null;
}
// Products whose raw category was manually marked "hidden" never reach the
// storefront at all — same treatment as an unavailable product. Call this on
// allStoreProducts BEFORE anything else derives from it (offers slider, popular
// slider, counts), so a hidden category disappears consistently everywhere.
function filterHiddenCategoryProducts(store, list) {
  if (!store || !store.categorySettings) return list;
  const hiddenRaw = new Set();
  list.forEach(p => {
    const raw = String(p.category || "").trim();
    if (hiddenRaw.has(raw)) return;
    const ov = resolveCategoryOverride(store, raw);
    if (ov && ov.hidden) hiddenRaw.add(raw);
  });
  return hiddenRaw.size ? list.filter(p => !hiddenRaw.has(String(p.category || "").trim())) : list;
}
// Applies a manual sort-order override on top of an already-computed bucket
// list. Explicit numbers (lower = earlier) win outright; buckets nobody
// customized keep their existing relative order, placed after any numbered ones
// (so an admin only needs to pick numbers for the categories they actually want
// to reposition). "تصنيفات أخرى" always stays last — its members are by
// definition the ones nobody bothered to customize.
function applyManualCategoryOrder(store, buckets) {
  if (!store || !store.categorySettings) return buckets;
  const other = buckets.find(b => b.label === "تصنيفات أخرى");
  const rest = other ? buckets.filter(b => b !== other) : buckets;
  const keyed = rest.map((b, i) => {
    let best = null;
    b.rawCategories.forEach(raw => {
      const ov = resolveCategoryOverride(store, raw);
      if (ov && Number.isFinite(ov.sortOrder) && (best === null || ov.sortOrder < best)) best = ov.sortOrder;
    });
    return { bucket: b, key: best !== null ? best : 1000 + i };
  }).sort((a, b) => a.key - b.key).map(x => x.bucket);
  return other ? [...keyed, other] : keyed;
}

function buildStoreCategoryPlan(store, allStoreProducts) {
  const isRestaurant = store && store.category === "مطاعم";
  const isSupermarket = store && store.category === "سوبر ماركت";
  const orderList = isRestaurant ? RESTAURANT_CATEGORY_ORDER : isSupermarket ? SUPERMARKET_CATEGORY_ORDER : null;

  const rawGroups = new Map(); // trimmed raw category -> products[]
  allStoreProducts.forEach(product => {
    const raw = String(product.category || "").trim();
    if (!rawGroups.has(raw)) rawGroups.set(raw, []);
    rawGroups.get(raw).push(product);
  });

  if (!orderList) {
    // Store types outside "مطاعم"/"سوبر ماركت" (حلويات، ملاحم، عصائر...): no automatic
    // merge/reorder, but a manual mergeInto override still applies for any store
    // type — an admin/merchant can fold one raw category into another by hand.
    const merged = new Map(); // final label -> { rawCategories:Set, products:[] }
    rawGroups.forEach((prods, raw) => {
      const ov = resolveCategoryOverride(store, raw);
      const label = (ov && ov.mergeInto) || raw;
      if (!merged.has(label)) merged.set(label, { rawCategories: new Set(), products: [] });
      const bucket = merged.get(label);
      bucket.rawCategories.add(raw);
      bucket.products.push(...prods);
    });
    const plan = [...merged.entries()].map(([label, b]) => ({ label, rawCategories: [...b.rawCategories], products: b.products }));
    return applyManualCategoryOrder(store, plan);
  }
  const aliasMap = isRestaurant ? RESTAURANT_CATEGORY_ALIASES : SUPERMARKET_CATEGORY_ALIASES;
  const mergeTargets = isRestaurant ? RESTAURANT_MERGE_TARGETS : SUPERMARKET_MERGE_TARGETS;

  // Single map keyed by FINAL label — deliberately not two separate official/custom
  // maps (a manual mergeInto target can collide textually with another raw
  // category's own name; splitting into two maps let each land in a different
  // map under the same label text and render as two duplicate pills instead of
  // merging into one — isOfficial is a per-bucket flag instead).
  const buckets = new Map(); // label -> { rawCategories:Set, products:[], isOfficial:bool }
  const pinned = new Set();  // raw categories forced standalone (disableAutoMerge/forceVisible)
  rawGroups.forEach((prods, raw) => {
    const ov = resolveCategoryOverride(store, raw);
    const manualTarget = ov && ov.mergeInto;
    const aliasTarget = aliasMap[normalizeCategoryKey(raw)];
    const isOfficial = !!(manualTarget || aliasTarget);
    const label = manualTarget || aliasTarget || raw;
    if (!manualTarget && ov && (ov.disableAutoMerge || ov.forceVisible)) pinned.add(raw);
    if (!buckets.has(label)) buckets.set(label, { rawCategories: new Set(), products: [], isOfficial: false });
    const bucket = buckets.get(label);
    if (isOfficial) bucket.isOfficial = true;
    bucket.rawCategories.add(raw);
    bucket.products.push(...prods);
  });

  // Shrink pass: any bucket nobody officially claimed (no alias/manual match) and
  // with <=2 products, and not pinned standalone, tries an automatic keyword merge
  // target next, else falls into "تصنيفات أخرى". Official/manually-targeted
  // buckets are NEVER shrunk, however small.
  const otherBucket = { rawCategories: new Set(), products: [] };
  [...buckets.entries()].forEach(([label, bucket]) => {
    if (bucket.isOfficial) return;
    if (bucket.products.length > 2) return;
    if ([...bucket.rawCategories].some(r => pinned.has(r))) return;
    buckets.delete(label);
    const key = normalizeCategoryKey(label);
    const match = mergeTargets.find(rule => rule.keywords.some(kw => key.includes(normalizeCategoryKey(kw))));
    if (match) {
      if (!buckets.has(match.target)) buckets.set(match.target, { rawCategories: new Set(), products: [], isOfficial: true });
      const target = buckets.get(match.target);
      target.isOfficial = true;
      bucket.rawCategories.forEach(r => target.rawCategories.add(r));
      target.products.push(...bucket.products);
    } else {
      bucket.rawCategories.forEach(r => otherBucket.rawCategories.add(r));
      otherBucket.products.push(...bucket.products);
    }
  });

  const orderedOfficial = orderList
    .filter(label => buckets.has(label))
    .map(label => { const b = buckets.get(label); buckets.delete(label); return { label, rawCategories: [...b.rawCategories], products: b.products }; });
  // Whatever's left (custom categories, and manual mergeInto targets outside
  // orderList — e.g. a brand-new admin-chosen heading) stays in first-appearance order.
  const standaloneCustom = [...buckets.entries()].map(([label, b]) => ({ label, rawCategories: [...b.rawCategories], products: b.products }));

  const result = [...orderedOfficial, ...standaloneCustom];
  if (otherBucket.products.length) {
    result.push({ label: "تصنيفات أخرى", rawCategories: [...otherBucket.rawCategories], products: otherBucket.products });
  }
  return applyManualCategoryOrder(store, result);
}

// ---- Phase 2 admin/merchant editor UI (shared by adminStoreCategories and
// merchantStoreCategories) — "عاشراً: متطلبات واجهة الإدارة" in the spec.

// What a raw category would resolve to with ZERO overrides — shown as a hint
// next to the override inputs so the person editing sees what they're changing.
function autoCategoryLabelFor(store, raw, allStoreProducts) {
  const plan = buildStoreCategoryPlan({ ...store, categorySettings: {} }, allStoreProducts);
  const hit = plan.find(b => b.rawCategories.includes(raw));
  return hit ? hit.label : raw;
}

// One store's full override table + "معاينة"/"حفظ" actions. scope is "admin" or
// "merchant" — each reads/writes ONLY its own half of store.categorySettings
// (see resolveCategoryOverride: admin[raw] wins over merchant[raw] when both
// exist), and shows a transparency note when the OTHER role has also set
// something for the same raw category, so nobody edits blind to the other side.
function categorySettingsEditorHTML(store, scope) {
  const allStoreProducts = products.filter(p => p.storeId === store.id);
  const rawCounts = new Map();
  allStoreProducts.forEach(p => {
    const raw = String(p.category || "").trim();
    if (!raw) return;
    rawCounts.set(raw, (rawCounts.get(raw) || 0) + 1);
  });
  if (!rawCounts.size) return `<p class="zones-empty-hint">لا توجد منتجات/تصنيفات في هذا المتجر بعد.</p>`;
  const isTyped = store.category === "مطاعم" || store.category === "سوبر ماركت";
  const officialList = store.category === "مطاعم" ? RESTAURANT_CATEGORY_ORDER : store.category === "سوبر ماركت" ? SUPERMARKET_CATEGORY_ORDER : [];
  const cs = (store.categorySettings && typeof store.categorySettings === "object") ? store.categorySettings : {};
  const mine = (cs[scope] && typeof cs[scope] === "object") ? cs[scope] : {};
  const other = scope === "admin" ? (cs.merchant || {}) : (cs.admin || {});
  const otherLabel = scope === "admin" ? "التاجر" : "الإدارة";
  const rows = [...rawCounts.entries()].sort((a, b) => b[1] - a[1]);
  const listId = `cat-official-list-${store.id}-${scope}`;
  return `
    <div class="category-settings-block" id="category-settings-${store.id}-${scope}">
      <datalist id="${listId}">${officialList.map(c => `<option value="${escAttr(c)}">`).join("")}</datalist>
      <div class="table-wrap">
      <table class="admin-table category-settings-table">
        <thead><tr><th>التصنيف</th><th>العدد</th><th>تلقائياً</th><th>دمج مع</th><th>منع الدمج</th><th>إظهار دائماً</th><th>الترتيب</th><th>إخفاء</th></tr></thead>
        <tbody>
          ${rows.map(([raw, count]) => {
            const auto = autoCategoryLabelFor(store, raw, allStoreProducts);
            const current = (mine[raw] && typeof mine[raw] === "object") ? mine[raw] : {};
            const otherVal = (other[raw] && typeof other[raw] === "object") ? other[raw] : null;
            return `
            <tr class="category-override-row" data-raw="${escAttr(raw)}">
              <td><strong>${esc(raw)}</strong>${otherVal ? `<br><small class="muted-note">${otherLabel} ضبط تجاوزاً لهذا التصنيف أيضاً</small>` : ""}</td>
              <td>${count}</td>
              <td><small class="muted-note">${esc(auto)}</small></td>
              <td><input class="cat-merge-into" list="${listId}" value="${escAttr(current.mergeInto || "")}" placeholder="بلا دمج"></td>
              <td class="cat-check"><input type="checkbox" class="cat-disable-merge" ${current.disableAutoMerge ? "checked" : ""}></td>
              <td class="cat-check"><input type="checkbox" class="cat-force-visible" ${current.forceVisible ? "checked" : ""}></td>
              <td><input type="number" class="cat-sort-order" value="${current.sortOrder ?? ""}" placeholder="تلقائي"></td>
              <td class="cat-check"><input type="checkbox" class="cat-hidden" ${current.hidden ? "checked" : ""}></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      </div>
      ${!isTyped ? `<div class="named-zones-guide"><small>${icon("info")} هذا المتجر ليس من فئة «مطاعم»/«سوبر ماركت» — لا يوجد ترتيب/دمج تلقائي رسمي، لكن الدمج والإخفاء والترتيب اليدوي هنا يعملون كما هم.</small></div>` : ""}
      <div class="named-zones-guide"><small>${icon("info")} «الترتيب»: رقم أصغر = يظهر أولاً؛ التصنيفات بلا رقم تُرتَّب تلقائياً بعد كل الأرقام المخصَّصة. «دمج مع»: اكتب اسم تصنيف آخر (من القائمة التلقائية أو أي اسم تريده) ليضمّ هذا التصنيف. تجاوز الإدارة يفوز دائماً على تجاوز التاجر لنفس التصنيف.</small></div>
      <div class="zone-editor-actions">
        <button type="button" class="secondary-button compact" data-action="preview-category-settings" data-id="${store.id}" data-scope="${scope}">${icon("eye")} معاينة</button>
        <button type="button" class="primary-button compact" data-action="save-category-settings" data-id="${store.id}" data-scope="${scope}">${icon("check")} حفظ</button>
      </div>
      <div class="category-settings-preview"></div>
    </div>
  `;
}

// Reads the current (possibly-unsaved) form state for one store/scope back out
// of the DOM — shared by the "معاينة" preview and the "حفظ" save action so both
// see exactly the same values. Fully-default rows are omitted (nothing to store).
function readCategoryOverridesFromDOM(storeId, scope) {
  const root = document.getElementById(`category-settings-${storeId}-${scope}`);
  const settings = {};
  if (!root) return settings;
  root.querySelectorAll(".category-override-row").forEach(row => {
    const raw = row.dataset.raw;
    if (!raw) return;
    const mergeInto = (row.querySelector(".cat-merge-into")?.value || "").trim();
    const disableAutoMerge = !!row.querySelector(".cat-disable-merge")?.checked;
    const forceVisible = !!row.querySelector(".cat-force-visible")?.checked;
    const hidden = !!row.querySelector(".cat-hidden")?.checked;
    const sortRaw = row.querySelector(".cat-sort-order")?.value;
    const sortOrder = (sortRaw !== "" && sortRaw != null && Number.isFinite(Number(sortRaw))) ? Number(sortRaw) : null;
    if (mergeInto || disableAutoMerge || forceVisible || hidden || sortOrder != null) {
      settings[raw] = { mergeInto: mergeInto || null, disableAutoMerge, forceVisible, hidden, sortOrder };
    }
  });
  return settings;
}

function renderStorePage(id) {
  const store = getStore(id);
  if (!store) {
    // Still waiting on the targeted store-row fetch (see hydratePageData) — show a
    // brief loading state instead of flashing "not found" for a store that does
    // exist but isn't in the bundled fallback list yet.
    if (window.supabaseClient && !_hydratedKeys.has("store-row:" + id)) {
      return `<section class="section empty-page">${renderEmpty("جاري تحميل المتجر...", "لحظات ونعرض لك المتجر.")}</section>`;
    }
    return renderNotFound();
  }
  // متجر مرفوض = محذوف فعلياً: لا يجوز الوصول له حتى بالرابط المباشر.
  // صفّه في Supabase قد يبقى للأبد رغم "الحذف" لأن قيد المفتاح الأجنبي
  // (orders_store_id_fkey) يمنع حذف أي متجر له طلبات تاريخية — فبدون هذه
  // البوابة تبقى صفحته حيّة وتستقبل طلبات حقيقية (حدث فعلاً مع متجر 20).
  // ملاحظة: "pending" غير مشمول عمداً — الرابط المباشر هو وسيلة مراجعة
  // المتجر الجديد قبل اعتماده، وهو سلوك مقصود في هذا المشروع.
  if (store.approvalStatus === "rejected") return renderNotFound();
  // view_store — deduped per store so re-renders don't double-count.
  window.DUKKANCI_TRACKING?.trackView("store:" + store.id, "view_store", { store_id: store.id, store_slug: (typeof SLUG_MAP !== "undefined" && SLUG_MAP[store.id]) || undefined, store_name: store.name });
  if (!store.newStore) ensureReviewEligibility(store.id); // fire-and-forget; re-renders once resolved
  const siblingBranches = store.branchGroup
    ? stores.filter(branch => branch.branchGroup === store.branchGroup)
        .sort((a, b) => (branchDistanceKm(a) ?? Infinity) - (branchDistanceKm(b) ?? Infinity))
    : [];
  const nearestSiblingId = store.branchGroup ? nearestBranchId(store.branchGroup, store.id) : null;
  // filterHiddenCategoryProducts must run before anything else derives from
  // allStoreProducts — a manually "hidden" category (Phase 2 override) should
  // disappear from the offers/popular sliders and the "X من Y منتجاً" counts too.
  const allStoreProducts = filterHiddenCategoryProducts(store, products.filter(product => product.storeId === store.id));
  const storeOfferProducts = allStoreProducts.filter(product => product.oldPrice && product.available);
  const storePopularProducts = allStoreProducts.filter(product => MOST_ORDERED_PRODUCTS.has(product.id) && product.available);
  const categoryPlan = buildStoreCategoryPlan(store, allStoreProducts);
  const categoryRawMap = new Map(categoryPlan.map(bucket => [bucket.label, new Set(bucket.rawCategories)]));
  const categoryCountMap = new Map(categoryPlan.map(bucket => [bucket.label, bucket.products.length]));
  const productCategories = categoryPlan.map(bucket => bucket.label);
  const activeProductFilter = productCategories.includes(state.storeProductFilter) ? state.storeProductFilter : "الكل";
  const searchQuery = (state.storeProductSearch || "").trim().toLowerCase();
  const categoryFiltered = activeProductFilter === "الكل"
    ? allStoreProducts
    : allStoreProducts.filter(product => (categoryRawMap.get(activeProductFilter) || new Set()).has(String(product.category || "").trim()));
  const storeProducts = searchQuery
    ? categoryFiltered.filter(p =>
        (p.name || "").toLowerCase().includes(searchQuery) ||
        (p.description || "").toLowerCase().includes(searchQuery) ||
        (p.category || "").toLowerCase().includes(searchQuery)
      )
    : categoryFiltered;
  const deliverySettings = getDeliverySettings(store.id);
  const defaultQuote = activeDeliveryQuote(store, getDefaultAddress());
  return `
    <section class="store-page-head">
      <div class="container">
        <div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><a href="/stores" data-route="stores">المتاجر</a><span>/</span><strong>${esc(store.name)}</strong></div>
        <div class="store-cover ${store.sourceBranded ? "source-branded-store-cover" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}-cover` : ""}">
          <img src="${escAttr(store.coverImage || store.image)}" alt="${escAttr(store.name)}">
          <div class="store-cover__gradient"></div>
          <span class="status-badge large ${isStoreOpenNow(store) ? "open" : "closed"}">${isStoreOpenNow(store) ? "مفتوح ويستقبل الطلبات" : "مغلق الآن"}</span>
          ${hasNationwideShipping(store) ? `<span class="nationwide-badge large">${icon("box")} توصيل لكل الولايات التركية</span>` : ""}
          ${store.branchGroup === "alsultan" ? `<span class="official-branch-badge large">${icon("shield")} فرع رسمي موثق</span>` : store.officialStore ? `<span class="official-branch-badge large ${store.brandTheme || ""}">${icon("shield")} متجر رسمي موثق</span>` : ""}
        </div>
        ${store.subscriptionActive === false ? `<div class="store-closed-banner review-note" style="margin:12px 0">${icon("shield")} <span><strong>هذا المتجر لا يستقبل طلبات حالياً.</strong><small>اشتراك المتجر منتهٍ — يمكنك تصفّح المنتجات، وسيعود الطلب فور تجديد المتجر لاشتراكه.</small></span></div>` : ""}
        <div class="store-profile">
          <div class="store-profile__main">
            ${storeAvatar(store, "large")}
            <div>
              <span class="store-category">${esc(store.category)}${store.branchName ? ` · فرع ${esc(store.branchName)}` : ""}</span>
              <h1>${esc(store.name)}</h1>
              <p>${esc(store.description)}</p>
              <div class="store-profile__meta">
                <span>${store.newStore ? `${icon("check")} <b>متجر جديد موثق</b>` : `${icon("star")} <b>${store.rating}</b> (${store.reviews} تقييم)`}</span>
                ${etaChip(store)}
                <span>${icon("bike")} توصيل ${deliveryPriceLabel(store)}</span>
                ${branchDistanceKm(store) != null ? `<span>${icon("pin")} ${formatDistance(branchDistanceKm(store))}</span>` : `<span>${icon("pin")} حدّد موقعك لمعرفة المسافة</span>`}
              </div>
            </div>
          </div>
          <div class="store-profile__actions">
            <button class="secondary-button" data-action="share-store" data-id="${store.id}">${icon("share")} مشاركة</button>
            <button class="secondary-button" data-action="favorite" data-key="store-${store.id}">${icon("heart")} حفظ</button>
            ${isFeatureOn("feature_community_retention") ? `<button class="secondary-button" data-action="create-group" data-id="${store.id}">${icon("megaphone")} طلب جماعي</button>` : ""}
          </div>
        </div>
      </div>
    </section>
    <div class="store-toolbar">
      <div class="container">
        <div class="store-product-search">
          ${icon("search")}
          <input id="store-product-search" type="search" placeholder="ابحث في منتجات ${escAttr(store.name)}..." value="${escAttr(searchQuery)}" autocomplete="off" inputmode="search">
          ${voiceSearchButton("store")}
          ${searchQuery ? `<button class="store-search-clear" data-action="clear-store-search" aria-label="مسح البحث">${icon("close")}</button>` : ""}
        </div>
        ${productCategories.length > 1 ? `<div class="store-product-filters">${["الكل", ...productCategories].map(category => {
          const count = category === "الكل" ? allStoreProducts.length : (categoryCountMap.get(category) || 0);
          const rawAttr = category === "الكل" ? "" : ` data-raw-categories="${escAttr(JSON.stringify([...(categoryRawMap.get(category) || [])]))}"`;
          return `<button class="${activeProductFilter === category ? "active" : ""}" data-action="product-category" data-category="${escAttr(category)}"${rawAttr}>${esc(category)}<span>${count}</span></button>`;
        }).join("")}</div>` : ""}
      </div>
    </div>
    <section class="section store-content-section">
      <div class="container store-content-grid">
        <div>
          ${siblingBranches.length > 1 ? `
            <section class="branch-switcher">
              <div>
                <span class="section-kicker">اختر أقرب فرع</span>
                <h2>فروع ${store.name.split(" - ")[0]} في إسطنبول</h2>
                <p class="branch-switcher__hint">${state.userLocation ? `الفروع مرتّبة حسب الأقرب إلى موقعك (${escAttr(state.userLocation.area || "موقعك الحالي")}).` : "حدّد موقعك من الأعلى لترتيب الفروع حسب الأقرب إليك تلقائياً."}</p>
              </div>
              <div class="branch-switcher__list">
                ${siblingBranches.map(branch => {
                  const km = branchDistanceKm(branch);
                  const isNearest = branch.id === nearestSiblingId;
                  return `
                  <button class="${branch.id === store.id ? "active" : ""}" data-action="open-store" data-id="${branch.id}">
                    <img src="${branch.coverImage || branch.image}" alt="">
                    <span><strong>${branch.branchName}${isNearest ? ` <em class="branch-near-tag">${icon("pin")} الأقرب إليك</em>` : ""}</strong><small>${km != null ? `${formatDistance(km)} · ` : ""}<span dir="ltr">${branch.phone}</span></small></span>
                    ${branch.id === store.id ? `<b>${icon("check")} الفرع الحالي</b>` : icon("arrowLeft")}
                  </button>`;
                }).join("")}
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
          ${store.hasOffer && store.offer ? `<div class="store-offer-strip">${icon("megaphone")} <div><strong>${esc(store.offer)}</strong><span>العرض متاح لفترة محدودة</span></div><button data-action="scroll-products">تسوّق العرض</button></div>` : ""}
          ${storeOfferProducts.length ? `
          <section class="store-offers-slider">
            <div class="section-heading small"><div><span class="section-kicker">لفترة محدودة</span><h2>عروض ${esc(store.name)}</h2></div><span class="count-chip">${storeOfferProducts.length} عرض</span></div>
            <div class="store-offers-track">
              ${storeOfferProducts.map(product => {
                const noImg = isPlaceholderImage(product.image);
                const pct = Math.round((1 - product.price / product.oldPrice) * 100);
                return `
              <button class="store-offer-card" data-action="open-product" data-id="${product.id}">
                <span class="store-offer-card__image ${noImg ? "no-image" : ""}">
                  ${noImg ? productNoImageMedia(product) : `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`}
                  <span class="discount-chip">وفر ${pct}%</span>
                </span>
                <strong>${esc(product.name)}</strong>
                <span class="store-offer-card__price"><b>${money(product.price)}</b><del>${money(product.oldPrice)}</del></span>
              </button>`;
              }).join("")}
            </div>
          </section>
          ` : ""}
          ${storePopularProducts.length ? `
          <section class="store-offers-slider store-popular-slider">
            <div class="section-heading small"><div><span class="section-kicker">الأعلى طلباً</span><h2>الأكثر طلباً من ${esc(store.name)}</h2></div><span class="count-chip">${storePopularProducts.length} منتج</span></div>
            <div class="store-offers-track">
              ${storePopularProducts.map(product => {
                const noImg = isPlaceholderImage(product.image);
                return `
              <button class="store-offer-card" data-action="open-product" data-id="${product.id}">
                <span class="store-offer-card__image ${noImg ? "no-image" : ""}">
                  ${noImg ? productNoImageMedia(product) : `<img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">`}
                </span>
                <strong>${esc(product.name)}</strong>
                <span class="store-offer-card__price"><b>${money(product.price)}</b></span>
              </button>`;
              }).join("")}
            </div>
          </section>
          ` : ""}
          <div class="section-heading small"><div><span class="section-kicker">من ${store.name}</span><h2 id="store-products">المنتجات</h2></div><span class="count-chip" id="store-products-count">${storeProducts.length} من ${allStoreProducts.length} منتجاً</span></div>
          ${storeProducts.length === 0 && searchQuery ? `<div class="store-search-empty">${icon("search")}<p>لا توجد نتائج لـ "<strong>${esc(searchQuery)}</strong>"</p><button class="secondary-button" data-action="clear-store-search">مسح البحث</button></div>` : ""}
          <div class="product-grid store-products-grid" id="store-products-grid">${storeProducts.map(productCard).join("")}</div>
          ${store.newStore ? `
          <section class="reviews-block new-store-review">
            <span>${icon("star")}</span>
            <div><span class="section-kicker">جديد على دكانجي</span><h2>كن أول من يقيّم ${store.name}</h2><p>تمت إضافة بيانات المتجر ومنتجاته من موقعه الرسمي، وستظهر تقييمات عملاء دكانجي بعد اكتمال الطلبات.</p></div>
          </section>
          ` : (() => {
            const elig = state.reviewEligibility[store.id];
            const rateAction = elig && elig.hasReviewable
              ? `<button class="secondary-button" data-action="open-rate-store" data-id="${store.id}">${icon("star")} قيّم تجربتك</button>`
              : (state.user && elig && !elig.hasAnyOrder ? `<small class="muted-note">قيّم تجربتك بعد اكتمال أول طلب من هذا المتجر</small>` : "");
            return `<section class="reviews-block">
            <div class="section-heading small"><div><span class="section-kicker">تجارب العملاء</span><h2>التقييمات والتعليقات</h2></div>${rateAction}</div>
            ${Number(store.reviews) > 0 ? `
            <button type="button" class="rating-summary rating-summary--clickable" data-action="open-store-reviews" data-id="${store.id}">
              <div class="rating-big"><strong>${store.rating}</strong><span>${icon("star")}${icon("star")}${icon("star")}${icon("star")}${icon("star")}</span><small>من ${store.reviews} تقييم · اضغط للتفاصيل</small></div>
            </button>` : `<div class="review-list"><p class="muted-note">لا توجد تقييمات بعد — كن أول من يقيّم هذا المتجر بعد طلبك.</p></div>`}
          </section>`;
          })()}
        </div>
        <aside class="store-info-card">
          <h3>معلومات المتجر</h3>
          <div class="info-row">${icon("pin")}<div><strong>العنوان</strong><span>${esc(store.address)}</span><button data-action="map">عرض على الخريطة</button></div></div>
          <div class="info-row">${icon("clock")}<div><strong>أوقات العمل</strong><span>${store.hours}</span></div></div>
          <div class="info-row">${icon("phone")}<div><strong>التواصل</strong><span dir="ltr">${store.phone}</span></div></div>
          ${store.email ? `<div class="info-row">${icon("user")}<div><strong>البريد الإلكتروني</strong><span dir="ltr">${store.email}</span></div></div>` : ""}
          <div class="info-row">${icon("bike")}<div><strong>مناطق الخدمة</strong><span>${store.areas.join("، ")}</span></div></div>
          ${(() => { const ds = getDeliverySettings(store.id) || {}; const zones = ds.namedZones || []; if (!zones.length) return ""; return `<div class="info-row">${icon("pin")}<div><strong>أسعار توصيل خاصة</strong><ul class="zone-price-list">${zones.map(z => `<li><span>${escAttr(z.label)}</span><strong>${money(z.fee)}</strong></li>`).join("")}</ul></div></div>`; })()}
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
  if (isFeatureOn("feature_community_retention")) {
    tabs.invite = { title: "ادعُ أصدقاءك", description: "شارك كود دعوتك واجمع رصيداً مع أصدقائك.", content: renderReferral };
  }
  const current = tabs[state.accountTab] || tabs.orders;
  return `
    <section class="page-hero compact account-hero"><div class="container"><span class="section-kicker">أهلاً ${state.customerProfile.name ? state.customerProfile.name.split(" ")[0] : "بك"}</span><h1>${current.title}</h1><p>${current.description}</p></div></section>
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
  if (isFeatureOn("feature_community_retention")) items.push(["invite", "megaphone", "ادعُ أصدقاءك"]);
  const authBtn = state.user
    ? `<button class="account-logout" data-action="logout">${icon("logout")} تسجيل الخروج</button>`
    : `<button class="account-login-cta" data-action="login">${icon("user")} تسجيل الدخول</button>`;
  return `<aside class="account-menu">${items.map(([key, iconName, label]) => `<button class="${state.accountTab === key ? "active" : ""}" data-action="account-tab" data-tab="${key}">${icon(iconName)} ${label}</button>`).join("")}${authBtn}</aside>`;
}

function renderCustomerOrders() {
  const orders = state.myOrders || [];
  if (!orders.length) {
    return `<div class="order-list">${renderEmpty("لا طلبات بعد", "عندما تطلب من أحد المتاجر سيظهر طلبك هنا لتتبّعه حتى الاستلام.", "تصفح المتاجر", "stores")}</div>`;
  }
  return `<div class="order-list">
    ${orders.map(order => {
      const store = getStore(order.storeId);
      const prog = orderProgress(order.status);
      const isDelivery = order.fulfillment !== "pickup";
      const steps = isDelivery
        ? ["تم استلام الطلب", "تم التأكيد", "قيد التجهيز", "خرج للتوصيل", "تم التوصيل"]
        : ["تم استلام الطلب", "تم التأكيد", "قيد التجهيز", "جاهز للاستلام", "تم الاستلام"];
      const canConfirm = prog.steps >= 4 && prog.steps < 5;
      return `<article class="customer-order">
        <div class="customer-order__top">
          <div>${storeAvatar(store)}<span><strong>${store ? store.name : "متجر"}</strong><small>طلب رقم <span dir="ltr">${order.id}</span>${order.createdAt ? ` · ${formatOrderDate(order.createdAt)}` : ""}</small></span></div>
          <span class="status-pill ${prog.color}">${order.status}</span>
        </div>
        ${prog.steps > 0 && prog.steps < 5 ? `<div class="tracking-steps">
          ${steps.map((step, index) => `<div class="${index < prog.steps ? "done" : ""}"><span>${index < prog.steps ? icon("check") : ""}</span><small>${step}</small></div>`).join("")}
        </div>` : ""}
        <div class="customer-order__bottom"><strong>${money(order.total)}</strong><div>${canConfirm ? `<button class="primary-button compact" data-action="confirm-receipt" data-id="${order.id}">${icon("check")} تأكيد الاستلام</button>` : ""}<button class="text-button" data-action="customer-order-details" data-id="${order.id}">${icon("eye")} التفاصيل</button><button class="secondary-button compact" data-action="reorder" data-id="${order.id}">${icon("bag")} إعادة الطلب</button></div></div>
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
          ${address.contactPhone ? `<small class="address-card-phone" dir="ltr">${escAttr(address.contactPhone)}</small>` : ""}
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
      <article class="account-favorite-card"><img src="${escAttr(store.logoImage || store.image)}" alt="${escAttr(store.name)}"><div><small>${store.category}</small><strong>${esc(store.name)}</strong><span>${store.newStore ? `${icon("check")} متجر جديد موثق` : `${icon("star")} ${store.rating}`} · ${store.time}</span></div><button class="secondary-button compact" data-action="open-store" data-id="${store.id}">عرض المتجر</button><button class="remove-favorite" data-action="remove-account-favorite" data-key="store-${store.id}" aria-label="إزالة">${icon("trash")}</button></article>`).join("")}</div></section>` : ""}
    ${favoriteProducts.length ? `<section class="favorite-section"><div class="account-toolbar"><div><h2>المنتجات المحفوظة</h2><p>${favoriteProducts.length} منتجات</p></div></div><div class="account-favorite-grid">${favoriteProducts.map(product => `
      <article class="account-favorite-card"><img src="${escAttr(product.image)}" alt="${escAttr(product.name)}"><div><small>${getStore(product.storeId).name}</small><strong>${esc(product.name)}</strong><span>${money(product.price)} / ${product.unit}</span></div><button class="primary-button compact" data-action="quick-add" data-id="${product.id}">${icon("plus")} أضف للسلة</button><button class="remove-favorite" data-action="remove-account-favorite" data-key="product-${product.id}" aria-label="إزالة">${icon("trash")}</button></article>`).join("")}</div></section>` : ""}
  `;
}

function renderCustomerComplaints() {
  return `
    <section class="account-card complaint-compose">
      <div class="account-card__heading"><span class="account-card__icon">${icon("megaphone")}</span><div><h2>إرسال شكوى أو ملاحظة</h2><p>سنراجع رسالتك ونجيبك داخل هذا القسم.</p></div></div>
      <form id="customer-complaint-form" class="account-form">
        <label><span>الطلب المرتبط</span><select name="orderId"><option value="">شكوى عامة</option>${(state.myOrders || []).map(order => `<option value="${order.id}">${order.id} · ${getStore(order.storeId).name}</option>`).join("")}</select></label>
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

// ---- Merchant dashboard sections + feature-status layer (spec §2 / §3) ------
// Single source of truth for the merchant sidebar. Each entry is:
//   [key, iconName, label, status, description]
// status ∈ active | beta | planned | requires_setup | disabled. The sidebar shows
// an honest badge for anything that is not "active" (spec §24 «لا تكذب على التاجر»),
// and not-yet-built sections render merchantComingSoon() instead of a broken tab.
// Client-only for now (same for every store); a per-store merchant_feature_flags
// table can override merchantFeatureStatus() later without touching any caller.
// NOTE: keys overview/orders/products/offers/store/analytics/integrations/
// subscription are the EXISTING live tabs (kept verbatim so all current logic —
// analytics loader, deep-links, order watch — keeps working); only labels changed.
const MERCHANT_SECTIONS = [
  ["overview", "chart", "نظرة عامة", "active", ""],
  ["orders", "receipt", "الطلبات", "active", ""],
  ["products", "box", "المنتجات والمنيو", "active", ""],
  ["images", "stars", "الصور والتحسين", "beta", "حسّن صور منتجاتك بالذكاء الصناعي: إضاءة أفضل، خلفية نظيفة، ومقاس موحّد يناسب كروت المنتجات — مع الاحتفاظ بالصورة الأصلية دائماً وإمكانية اعتماد النسخة المحسّنة أو رفضها."],
  ["search", "search", "البحث والمرادفات", "beta", "أضف مرادفات ولهجات لكل منتج (مثلاً «كاربوز» و«دلّاع» ← بطيخ) ليظهر منتجك مهما اختلفت تسمية العميل، مع توليد اقتراحات بالذكاء الصناعي ومراجعتها قبل التفعيل."],
  ["customers", "users", "العملاء", "beta", "دليل عملائك الجدد والمتكررين: الاسم، الهاتف، عدد الطلبات، آخر تواصل، والمنطقة — مبنيّ من طلباتك ومحادثاتك، مع إمكانية تصدير القائمة."],
  ["offers", "megaphone", "كودات الخصم", "active", ""],
  ["campaigns", "megaphone", "الحملات التسويقية", "requires_setup", "أرسل عروضك لعملائك عبر قوالب واتساب المعتمدة ووفق سياسات ميتا (Opt-in / Opt-out). تتطلب هذه الميزة تفعيلاً وربطاً من إدارة دكانجي قبل التشغيل حفاظاً على حسابك."],
  ["catalog", "box", "كتالوجات ميتا", "beta", "جهّز منتجاتك (صورة، سعر، رابط، توفّر) لتكون جاهزة لكتالوجات وإعلانات ميتا على فيسبوك وإنستغرام، مع كشف أخطاء الصور والأسعار وإعادة المزامنة."],
  ["analytics", "chart", "التقارير والتحليلات", "active", ""],
  ["store", "store", "إعدادات المتجر", "active", ""],
  ["storeCategories", "filter", "تصنيفات المتجر", "active", ""],
  ["audit", "shield", "سجل التعديلات", "beta", "سجل واضح لكل تعديل: تغيير سعر، إضافة أو حذف منتج، إخفاء منتج، تغيير حالة طلب، وتعديل بيانات المتجر — لتعرف من فعل ماذا ومتى."],
  ["support", "phone", "الدعم الفني", "active", ""],
  ["share", "share", "رابط المتجر", "active", ""],
  ["integrations", "settings", "التكاملات", "active", ""],
  ["subscription", "wallet", "الاشتراك", "active", ""]
];
function merchantSection(key) { return MERCHANT_SECTIONS.find(s => s[0] === key); }
function merchantFeatureStatus(key) { const s = merchantSection(key); return (s && s[3]) || "active"; }
// [pillClass, label] per non-active status. active → no badge.
const FEATURE_BADGE = {
  beta: ["blue", "تجريبي"],
  planned: ["amber", "قيد التطوير"],
  requires_setup: ["gray", "يتطلب ربط"],
  disabled: ["gray", "غير متاحة"]
};
function featureBadge(key) {
  const b = FEATURE_BADGE[merchantFeatureStatus(key)];
  return b ? `<b class="feature-badge ${b[0]}">${b[1]}</b>` : "";
}

function dashboardSidebar(type, active) {
  const merchantStore = type === "merchant" ? getMerchantStore() : null;
  const merchantOrderCount = merchantStore
    ? state.orders.filter(order => order.storeId === merchantStore.id).length
    : 0;
  const merchantItems = MERCHANT_SECTIONS; // [key, icon, label, status, desc] — .map below ignores extras
  const adminItems = [
    ["overview", "chart", "نظرة عامة"],
    ["stores", "store", "المتاجر"],
    ["categories", "filter", "التصنيفات"],
    ["products", "box", "المنتجات"],
    ["customers", "users", "العملاء"],
    ["orders", "receipt", "الطلبات"],
    ["messages", "whatsapp", "المحادثات"],
    ["campaigns", "megaphone", "الحملات"],
    ["notifications", "bell", "الإشعارات"],
    ["media", "image", "مكتبة الصور"],
    ["catalog", "star", "مخزن الصور المشترك"],
    ["complaints", "megaphone", "الشكاوى"],
    ["coupons", "megaphone", "الكوبونات"],
    ["delivery", "bike", "التوصيل"],
    ["storeCategories", "filter", "تصنيفات المتاجر"],
    ["credentials", "shield", "حسابات المتاجر"],
    ["content", "settings", "المحتوى"],
    ["banners", "image", "البانرات"],
    ["integrations", "megaphone", "التكاملات"],
    ["marketing", "chart", "التتبع والتسويق"],
    ["fbads", "map", "استهداف فيسبوك"],
    ["ai", "stars", "الذكاء الاصطناعي"]
  ];
  const items = type === "merchant" ? merchantItems : adminItems;
  return `
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">${brandLogo("brand-on-dark")}<span>${type === "merchant" ? "لوحة المتجر" : "لوحة الإدارة"}</span></div>
      <nav>${items.map(([key, iconName, label]) => { const waUnread = (state.adminThreads || []).reduce((s, t) => s + (t.unread || 0), 0); return `<button class="${active === key ? "active" : ""}" data-action="${type}-tab" data-tab="${key}">${icon(iconName)}<span>${label}</span>${key === "orders" ? `<b class="nav-badge">${type === "merchant" ? merchantOrderCount : state.orders.length}</b>` : ""}${key === "messages" && waUnread ? `<b class="nav-badge">${waUnread}</b>` : ""}${type === "merchant" ? featureBadge(key) : ""}</button>`; }).join("")}</nav>
      <div class="dashboard-user">
        <span class="avatar-mini dashboard-photo"><img src="${merchantStore ? merchantStore.logoImage || merchantStore.image : "/assets/dukkanci-mark.png?v=86"}" alt=""></span>
        <span><strong>${merchantStore ? merchantStore.name : "إدارة دكانجي"}</strong><small>${merchantStore ? `الخطة ${merchantStore.subscription || "الاحترافية"}` : "مدير النظام"}</small></span>
        ${icon("dots")}
      </div>
    </aside>
  `;
}

function statCard(iconName, label, value, trend, tone) {
  return `<article class="stat-card ${tone}"><span class="stat-icon ${tone}">${icon(iconName)}</span><div><small>${label}</small><strong>${value}</strong><span class="trend">${trend}</span></div></article>`;
}

// Store link + QR + share (spec §15 «رابط المتجر والمشاركة»): one clean link the
// merchant copies, QR-prints, or pushes to WhatsApp/Facebook/native share. The
// link is the store's public slug URL (storeParam) on the current origin.
function merchantShare() {
  const store = getMerchantStore();
  const url = SITE_ORIGIN + "/store/" + storeParam(store);
  const msg = `تسوّق من ${store.name} على دكانجي واطلب أونلاين 👇\n${url}`;
  const waShare = "https://wa.me/?text=" + encodeURIComponent(msg);
  const fbShare = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(url);
  const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=" + encodeURIComponent(url);
  return `
    <div class="share-grid">
      <section class="dashboard-card share-link-card">
        <div class="card-heading"><div><h3>${icon("share")} رابط متجرك</h3><p>شاركه مع عملائك في كل مكان — يفتح صفحة متجرك مباشرة.</p></div></div>
        <div class="store-link-row">
          <input id="store-link-input" readonly dir="ltr" value="${escAttr(url)}" onfocus="this.select()">
          <button type="button" class="primary-button compact" data-action="copy-store-link" data-link="${escAttr(url)}">${icon("check")} نسخ الرابط</button>
        </div>
        <div class="share-buttons">
          <a class="share-btn wa" href="${escAttr(waShare)}" target="_blank" rel="noopener">${icon("whatsapp")} واتساب</a>
          <a class="share-btn fb" href="${escAttr(fbShare)}" target="_blank" rel="noopener">${icon("facebook")} فيسبوك</a>
          <button type="button" class="share-btn native" data-action="share-store-link" data-link="${escAttr(url)}" data-text="${escAttr(msg)}">${icon("share")} مشاركة…</button>
        </div>
        <label class="share-msg"><span>رسالة جاهزة للإرسال لعملائك</span><textarea rows="3" readonly onfocus="this.select()">${escAttr(msg)}</textarea></label>
      </section>
      <section class="dashboard-card share-qr-card">
        <div class="card-heading"><div><h3>${icon("box")} رمز QR</h3><p>اطبعه على واجهة متجرك أو الفواتير ليمسحه العملاء.</p></div></div>
        <div class="qr-holder"><img src="${escAttr(qrSrc)}" alt="رمز QR لمتجر ${escAttr(store.name)}" width="220" height="220" loading="lazy"></div>
        <button type="button" class="secondary-button compact" data-action="download-store-qr" data-qr="${escAttr(qrSrc)}">${icon("download")} تحميل الرمز</button>
      </section>
    </div>`;
}

// Honest placeholder for sections that aren't built yet (spec §24 «لا تكذب على
// التاجر»): show WHAT the section will do + its status badge, never fake data.
function merchantComingSoon(key) {
  const s = merchantSection(key) || [key, "box", "قسم", "planned", ""];
  const badge = FEATURE_BADGE[s[3]] || FEATURE_BADGE.planned;
  const setup = s[3] === "requires_setup";
  return `
    <div class="empty-dashboard coming-soon">
      <span class="empty-dashboard__icon">${icon(s[1])}</span>
      <span class="status-pill ${badge[0]}">${badge[1]}</span>
      <h3>${esc(s[2])}</h3>
      <p>${esc(s[4] || "هذه الميزة قيد التطوير وستكون متاحة قريباً في لوحة متجرك.")}</p>
      ${setup
        ? `<div class="review-note">${icon("shield")} <span><strong>تتطلب هذه الميزة ربطاً وتفعيلاً من إدارة دكانجي.</strong><small>سنفعّلها لمتجرك بعد ضبط القوالب والموافقات اللازمة حفاظاً على حسابك.</small></span></div>`
        : `<p class="coming-soon-hint">${icon("clock")} نعمل على إضافتها ضمن خطة تطوير لوحة المتجر — تابع التحديثات.</p>`}
      <button class="secondary-button compact" data-action="merchant-tab" data-tab="overview">${icon("arrowLeft")} العودة للوحة</button>
    </div>`;
}

// ── Merchant AI image enhancement (spec §8): dedicated before/after section ──

// Recompress a data-URL (e.g. an AI-enhanced 1024px PNG) to a compact JPEG so it
// doesn't bloat the product row / catalog load — mirrors the upload resize path.
function resizeDataUrl(dataUrl, maxDim = 720, quality = 0.82) {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        try { resolve(canvas.toDataURL("image/jpeg", quality)); } catch (e) { resolve(dataUrl); }
      };
      img.src = dataUrl;
    } catch (e) { resolve(dataUrl); }
  });
}

// The enhance API fetches the URL server-side, so a relative /assets path must be
// made absolute; data-URLs and http(s) URLs pass through unchanged.
function absoluteImageUrl(src) {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  if (src.startsWith("/")) return location.origin + src;
  return src;
}

function merchantImages() {
  const store = getMerchantStore();
  const list = allProducts.filter(p => p.storeId === store.id);
  const filter = state.merchantImageFilter || "all";
  const backups = state._merchantImageBackups; // Set of productIds with a revertible original (null = unloaded)
  // Lazy-load which products have a revertible backup, once per section open.
  if (backups == null && !state._merchantImageBackupsLoading) {
    state._merchantImageBackupsLoading = true;
    loadMerchantImageBackups(store.id).then(() => { state._merchantImageBackupsLoading = false; render(); });
  }
  const needsImage = p => isPlaceholderImage(p.image);
  let shown = list;
  if (filter === "needs") shown = list.filter(needsImage);
  else if (filter === "enhanced") shown = list.filter(p => backups && backups.has(Number(p.id)));
  const needsCount = list.filter(needsImage).length;
  const enhancedCount = backups ? list.filter(p => backups.has(Number(p.id))).length : 0;
  const chip = (key, label, count) => `<button type="button" class="cat-chip ${filter === key ? "active" : ""}" data-action="merchant-image-filter" data-filter="${key}">${label}${count != null ? ` <span>${count}</span>` : ""}</button>`;
  const cards = shown.map(p => {
    const noImg = isPlaceholderImage(p.image);
    const hasBackup = backups && backups.has(Number(p.id));
    return `
      <article class="image-card">
        <div class="image-card__thumb ${noImg ? "no-image" : ""}">${noImg ? icon("box") : `<img src="${escAttr(p.image)}" alt="${escAttr(p.name)}" loading="lazy">`}</div>
        <div class="image-card__body">
          <strong>${esc(p.name)}</strong><small>${esc(p.category || "")}</small>
          <div class="image-card__actions">
            <button class="secondary-button compact" data-action="enhance-image-product" data-id="${p.id}">${icon("stars")} تحسين</button>
            ${hasBackup ? `<button class="table-action" data-action="revert-image-product" data-id="${p.id}" title="استرجاع الصورة الأصلية">${icon("arrowLeft")}</button>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");
  return `
    <div class="review-note images-safety">${icon("shield")} <span><strong>التحسين لتجميل العرض فقط — لا يغيّر حقيقة منتجك.</strong><small>نحفظ صورتك الأصلية دائماً، ويمكنك استرجاعها بضغطة في أي وقت.</small></span></div>
    <div class="product-cat-filter">
      ${chip("all", "كل المنتجات", list.length)}
      ${chip("needs", "بحاجة إلى صورة", needsCount)}
      ${chip("enhanced", "تم تحسينها", enhancedCount)}
    </div>
    <section class="dashboard-card">
      ${shown.length ? `<div class="image-grid">${cards}</div>` : `<div class="empty-managed">${icon("stars")}<p>${filter === "needs" ? "كل منتجاتك لديها صور — رائع!" : (filter === "enhanced" ? "لم تُحسّن أي صورة بعد." : "لا توجد منتجات بعد.")}</p></div>`}
    </section>`;
}

async function loadMerchantImageBackups(storeId) {
  const headers = {};
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  try {
    const r = await fetch(`/api/notify-order?action=product-images&storeId=${storeId}`, { headers });
    const data = await r.json().catch(() => ({}));
    state._merchantImageBackups = new Set((data.enhancedProductIds || []).map(Number));
  } catch (e) { state._merchantImageBackups = new Set(); }
}

function showEnhanceError(msg) {
  const el = document.querySelector(".enhance-body");
  if (el) el.innerHTML = `<div class="empty-managed">${icon("shield")}<p>${esc(msg)}</p></div><div class="form-actions"><button class="secondary-button" data-action="close-modal">إغلاق</button></div>`;
}

// Enhance a product's image via the AI endpoint, then show a before/after modal.
async function openImageEnhance(id) {
  const p = getProduct(id);
  if (!p) { showToast("تعذّر العثور على المنتج"); return; }
  const before = p.image;
  showModal(`<button class="modal-close" data-action="close-modal">${icon("close")}</button><span class="section-kicker">${esc(p.name)}</span><h2>تحسين الصورة بالذكاء الاصطناعي</h2><div class="enhance-body"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحسين الصورة… قد يستغرق حتى دقيقة.</p></div></div>`, "enhance-modal");
  if (isPlaceholderImage(before)) {
    const el = document.querySelector(".enhance-body");
    if (el) el.innerHTML = `<div class="empty-managed">${icon("box")}<p>هذا المنتج بلا صورة. أضف صورة من قسم «المنتجات» أولاً ثم حسّنها هنا.</p></div>`;
    return;
  }
  const body = before.startsWith("data:") ? { imageData: before, name: p.name } : { imageUrl: absoluteImageUrl(before), name: p.name };
  try {
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    if (!headers["x-admin-token"] && !headers["x-merchant-token"] && window.supabaseClient) {
      try {
        const { data } = await window.supabaseClient.auth.getSession();
        const tok = data && data.session && data.session.access_token;
        if (tok) headers["x-sb-token"] = tok;
      } catch (e) {}
    }
    const r = await fetch("/api/enhance-image", { method: "POST", headers, body: JSON.stringify(body) });
    const data = await r.json().catch(() => ({}));
    if (r.status === 503) return showEnhanceError("خدمة التحسين غير مُفعّلة حالياً. تواصل مع إدارة دكانجي لتفعيلها.");
    if (!r.ok || !data.url) return showEnhanceError(data.error || "تعذّر تحسين الصورة. جرّب صورة أوضح.");
    state._enhancePending = { id: p.id, enhanced: data.url };
    const el = document.querySelector(".enhance-body");
    if (!el) return;
    el.innerHTML = `
      <div class="before-after">
        <figure><figcaption>قبل</figcaption><img src="${escAttr(before)}" alt="قبل"></figure>
        <figure><figcaption>بعد</figcaption><img src="${escAttr(data.url)}" alt="بعد"></figure>
      </div>
      <p class="field-hint">${icon("shield")} إن اعتمدت النسخة المحسّنة سنحفظ صورتك الأصلية ويمكنك استرجاعها لاحقاً.</p>
      <div class="form-actions">
        <button class="secondary-button" data-action="reenhance-image" data-id="${p.id}">${icon("stars")} إعادة التحسين</button>
        <button class="secondary-button" data-action="close-modal">الاحتفاظ بالأصل</button>
        <button class="primary-button" data-action="approve-enhanced-image">${icon("check")} اعتماد المحسّنة</button>
      </div>`;
  } catch (e) { showEnhanceError("خطأ في الاتصال بخدمة التحسين."); }
}

async function approveEnhancedImage() {
  const pending = state._enhancePending;
  if (!pending) { closeModal(); return; }
  const p = getProduct(pending.id);
  if (!p) { closeModal(); return; }
  const btn = document.querySelector('[data-action="approve-enhanced-image"]');
  if (btn) { btn.disabled = true; btn.innerHTML = "جارٍ الحفظ..."; }
  // Recompress the enhanced image so the product row / catalog stays lightweight.
  const compact = await resizeDataUrl(pending.enhanced, 720, 0.82);
  const store = getMerchantStore();
  const headers = { "Content-Type": "application/json" };
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  try {
    const r = await fetch("/api/notify-order?action=apply-enhanced-image", { method: "POST", headers, body: JSON.stringify({ productId: p.id, storeId: store.id, image: compact }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) {
      if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} اعتماد المحسّنة`; }
      showToast(data.error === "unauthorized" ? "انتهت جلسة المتجر. سجّل الدخول من جديد." : "تعذّر حفظ الصورة المحسّنة", "");
      return;
    }
    p.image = compact;
    upsertCatalogProduct(p);
    saveProductOverride(p.id, { image: compact });
    if (state._merchantImageBackups) state._merchantImageBackups.add(Number(p.id));
    state._enhancePending = null;
    closeModal();
    showToast("تم اعتماد الصورة المحسّنة ✓ (الأصل محفوظ)", "success");
    render();
  } catch (e) {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} اعتماد المحسّنة`; }
    showToast("خطأ في الاتصال", "");
  }
}

async function revertProductImage(id) {
  const p = getProduct(id);
  if (!p) return;
  const store = getMerchantStore();
  const headers = { "Content-Type": "application/json" };
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  try {
    const r = await fetch("/api/notify-order?action=revert-product-image", { method: "POST", headers, body: JSON.stringify({ productId: p.id, storeId: store.id }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data.image) { showToast(data.error === "no original to restore" ? "لا توجد صورة أصلية محفوظة." : "تعذّر استرجاع الصورة", ""); return; }
    p.image = data.image;
    upsertCatalogProduct(p);
    saveProductOverride(p.id, { image: data.image });
    if (state._merchantImageBackups) state._merchantImageBackups.delete(Number(p.id));
    showToast("تم استرجاع الصورة الأصلية", "success");
    render();
  } catch (e) { showToast("خطأ في الاتصال", ""); }
}

// ── Merchant search synonyms (spec §9): per-product search-term manager ──
// Reuses the shared AI gateway + product_synonyms via merchant-gated /api/ai actions.
function merchantHeaders(json) {
  const h = json ? { "Content-Type": "application/json" } : {};
  if (state.adminKey) h["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) h["x-merchant-token"] = state.merchantPwAuth.token;
  return h;
}

function merchantSearch() {
  const store = getMerchantStore();
  const list = allProducts.filter(p => p.storeId === store.id);
  const query = (state.merchantSynSearch || "").trim();
  const nq = normalizeAr(query);
  const shown = nq ? list.filter(p => normalizeAr(`${p.name} ${p.category}`).includes(nq)) : list;
  const rows = shown.map(p => `
    <article class="syn-row">
      <div class="syn-row__name"><strong>${esc(p.name)}</strong><small>${esc(p.category || "")}</small></div>
      <button class="secondary-button compact" data-action="manage-synonyms" data-id="${p.id}">${icon("search")} كلمات البحث</button>
    </article>`).join("");
  return `
    <div class="review-note">${icon("stars")} <span><strong>أضف الكلمات والمرادفات التي يبحث بها عملاؤك عن كل منتج.</strong><small>مثلاً «بطيخ» يعرفه بعض العملاء بـ«دلّاع» أو «حبحب» — أضِفها ليظهر منتجك مهما اختلفت التسمية أو اللهجة. يمكنك توليد اقتراحات بالذكاء الاصطناعي ثم مراجعتها.</small></span></div>
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="merchant-syn-search" placeholder="ابحث عن منتج" value="${escAttr(query)}"></div><div class="toolbar-actions"><span class="toolbar-count">${shown.length.toLocaleString("ar")} منتج</span></div></div>
    <section class="dashboard-card">
      ${shown.length ? `<div class="syn-list">${rows}</div>` : `<div class="empty-managed">${icon("search")}<p>${query ? "لا منتجات مطابقة لبحثك" : "لا توجد منتجات بعد."}</p></div>`}
    </section>`;
}

function openSynonymManager(id) {
  const p = getProduct(id);
  if (!p) { showToast("تعذّر العثور على المنتج"); return; }
  state._synMgr = { id: p.id, name: p.name, active: [], suggestions: [], generating: false, suggested: false };
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">كلمات البحث والمرادفات</span>
    <h2>${esc(p.name)}</h2>
    <p class="field-hint">الاسم الأساسي يظهر دائماً في البحث. أضِف المرادفات واللهجات ليجده العملاء بأي تسمية.</p>
    <div class="syn-block"><label class="syn-label">المرادفات الفعّالة</label><div id="syn-active" class="syn-chips"><span class="delivery-loader"></span></div></div>
    <div class="syn-add-row"><input id="syn-add-input" placeholder="أضف كلمة أو مرادفاً ثم اضغط Enter" autocomplete="off"><button type="button" class="secondary-button compact" data-action="syn-add">${icon("plus")} إضافة</button></div>
    <div class="syn-block"><div class="syn-gen-head"><label class="syn-label">اقتراحات الذكاء الاصطناعي</label><button type="button" class="secondary-button compact" data-action="syn-generate">${icon("stars")} توليد اقتراحات</button></div><div id="syn-suggest" class="syn-chips syn-suggest-chips"><small class="syn-empty">اضغط «توليد اقتراحات» للحصول على مرادفات مقترحة بالذكاء الاصطناعي.</small></div></div>
    <div class="form-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="primary-button" data-action="syn-save">${icon("check")} حفظ المرادفات</button></div>
  `, "syn-manager-modal");
  const store = getMerchantStore();
  fetch(`/api/ai?action=merchant-syn-get&productId=${p.id}&storeId=${store.id}`, { headers: merchantHeaders() })
    .then(r => r.json()).then(data => {
      if (!state._synMgr || state._synMgr.id !== p.id) return;
      state._synMgr.active = Array.isArray(data.synonyms) ? data.synonyms.slice() : [];
      refreshSynonymUI();
    }).catch(() => refreshSynonymUI());
}

function refreshSynonymUI() {
  const m = state._synMgr; if (!m) return;
  const activeEl = document.getElementById("syn-active");
  if (activeEl) activeEl.innerHTML = m.active.length
    ? m.active.map((s, i) => `<span class="syn-chip">${esc(s)}<button type="button" data-action="syn-remove" data-i="${i}" aria-label="حذف">${icon("close")}</button></span>`).join("")
    : `<small class="syn-empty">لا توجد مرادفات بعد — أضِف يدوياً أو ولّد اقتراحات.</small>`;
  const sugEl = document.getElementById("syn-suggest");
  if (sugEl) {
    const fresh = m.suggestions.filter(s => !m.active.some(a => normalizeAr(a) === normalizeAr(s)));
    if (m.generating) sugEl.innerHTML = `<span class="delivery-loader"></span> <small class="syn-empty">جارٍ توليد الاقتراحات…</small>`;
    else if (fresh.length) sugEl.innerHTML = fresh.map(s => `<button type="button" class="syn-chip suggest" data-action="syn-accept" data-term="${escAttr(s)}">${icon("plus")} ${esc(s)}</button>`).join("");
    else if (m.suggested) sugEl.innerHTML = `<small class="syn-empty">لا اقتراحات جديدة — كل المقترحات مضافة بالفعل.</small>`;
    else sugEl.innerHTML = `<small class="syn-empty">اضغط «توليد اقتراحات» للحصول على مرادفات مقترحة بالذكاء الاصطناعي.</small>`;
  }
}

function synAddTerm(term) {
  const m = state._synMgr; const v = String(term || "").trim();
  if (!m || !v) return;
  if (!m.active.some(a => normalizeAr(a) === normalizeAr(v)) && normalizeAr(v) !== normalizeAr(m.name)) m.active.push(v);
  refreshSynonymUI();
}

async function synGenerate() {
  const m = state._synMgr; if (!m) return;
  m.generating = true; refreshSynonymUI();
  const store = getMerchantStore();
  try {
    const r = await fetch("/api/ai?action=merchant-syn-generate", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ productId: m.id, storeId: store.id }) });
    const data = await r.json().catch(() => ({}));
    m.suggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
    m.suggested = true;
    if (data.ok === false) showToast("خدمة التوليد غير متاحة حالياً — أضِف المرادفات يدوياً", "");
  } catch (e) { showToast("خطأ في الاتصال بخدمة التوليد", ""); }
  m.generating = false; refreshSynonymUI();
}

async function synSave() {
  const m = state._synMgr; if (!m) return;
  const btn = document.querySelector('[data-action="syn-save"]');
  if (btn) { btn.disabled = true; btn.innerHTML = "جارٍ الحفظ..."; }
  const store = getMerchantStore();
  try {
    const r = await fetch("/api/ai?action=merchant-syn-save", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ productId: m.id, storeId: store.id, synonyms: m.active }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) {
      if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ المرادفات`; }
      showToast(data.error === "unauthorized" ? "انتهت جلسة المتجر. سجّل الدخول من جديد." : "تعذّر حفظ المرادفات", "");
      return;
    }
    state._synMgr = null;
    closeModal();
    showToast(`تم حفظ ${((data.synonyms || m.active).length).toLocaleString("ar")} مرادفاً — ستظهر في نتائج البحث`, "success");
  } catch (e) {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ المرادفات`; }
    showToast("خطأ في الاتصال", "");
  }
}

// ── Merchant audit log (§17) + notification bell (§19) ──────────────────────

// Arabic labels for audit actions; unknown actions fall back to the raw key.
const AUDIT_ACTION_LABELS = {
  product_add: ["إضافة منتج", "green"],
  product_update: ["تعديل منتج", "blue"],
  product_delete: ["حذف منتج", "red"],
  order_status: ["تغيير حالة طلب", "orange"],
  image_approve: ["اعتماد صورة محسّنة", "blue"],
  image_revert: ["استرجاع صورة أصلية", "gray"],
  synonyms_update: ["تحديث المرادفات", "blue"]
};

function auditRowDetail(l) {
  const o = l.old_value || {}, n = l.new_value || {};
  const parts = [];
  if (l.action === "order_status") parts.push(`${o.status || "—"} ← ${n.status || "—"}`);
  else {
    const name = n.name || o.name;
    if (name) parts.push(String(name));
    if (o.price != null && n.price != null && Number(o.price) !== Number(n.price)) parts.push(`السعر: ${money(o.price)} ← ${money(n.price)}`);
    else if (n.price != null && l.action === "product_add") parts.push(money(n.price));
    if (o.available != null && n.available != null && o.available !== n.available) parts.push(n.available ? "→ متوفر" : "→ غير متوفر");
    if (n.count != null) parts.push(`${Number(n.count).toLocaleString("ar")} مرادفاً`);
  }
  return parts.join(" · ");
}

function merchantAudit() {
  const store = getMerchantStore();
  const a = state._merchantAudit;
  if (a == null && !state._merchantAuditLoading) {
    state._merchantAuditLoading = true;
    fetch(`/api/notify-order?action=audit-logs&storeId=${store.id}`, { headers: merchantHeaders() })
      .then(r => r.json()).then(data => { state._merchantAudit = Array.isArray(data.logs) ? data.logs : []; })
      .catch(() => { state._merchantAudit = []; })
      .finally(() => { state._merchantAuditLoading = false; render(); });
  }
  if (a == null) return `<section class="dashboard-card"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل سجل التعديلات…</p></div></section>`;
  const fmt = iso => { try { return new Date(iso).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  const rows = a.map(l => {
    const [label, tone] = AUDIT_ACTION_LABELS[l.action] || [l.action, "gray"];
    return `<tr>
      <td><span class="status-pill ${tone}">${esc(label)}</span></td>
      <td>${esc(auditRowDetail(l) || (l.entity_id ? `#${l.entity_id}` : "—"))}</td>
      <td>${l.actor === "admin" ? "الإدارة" : "المتجر"}</td>
      <td>${fmt(l.created_at)}</td>
    </tr>`;
  }).join("");
  return `
    <div class="review-note">${icon("shield")} <span><strong>كل تعديل على متجرك يُسجَّل تلقائياً.</strong><small>تغيير سعر، إضافة/حذف منتج، حالة طلب، صور، ومرادفات — من فعل ماذا ومتى. يُسجَّل الجديد من الآن فصاعداً.</small></span></div>
    <section class="dashboard-card">
      ${a.length ? `<div class="table-wrap"><table class="admin-table"><thead><tr><th>الحدث</th><th>التفاصيل</th><th>بواسطة</th><th>الوقت</th></tr></thead><tbody>${rows}</tbody></table></div>`
        : `<div class="empty-managed">${icon("shield")}<p>لا توجد تعديلات مسجّلة بعد — سيظهر هنا كل تعديل تجريه من الآن فصاعداً.</p></div>`}
    </section>`;
}

// Notification bell: lazy-load once per dashboard session; badge shows unread.
function loadMerchantNotifications(force) {
  const store = getMerchantStore();
  if (!store) return;
  if (!force && (state._merchantNotifs != null || state._merchantNotifsLoading)) return;
  state._merchantNotifsLoading = true;
  fetch(`/api/notify-order?action=merchant-notifications&storeId=${store.id}`, { headers: merchantHeaders() })
    .then(r => r.json()).then(data => {
      state._merchantNotifs = Array.isArray(data.notifications) ? data.notifications : [];
      state._merchantNotifsUnread = Number(data.unread) || 0;
    })
    .catch(() => { state._merchantNotifs = state._merchantNotifs || []; })
    .finally(() => { state._merchantNotifsLoading = false; render(); });
}

const NOTIF_TYPE_ICON = { new_order: "receipt", image_enhanced: "stars" };

function openMerchantNotifications() {
  const list = state._merchantNotifs || [];
  const fmt = iso => { try { return new Date(iso).toLocaleString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); } catch (e) { return ""; } };
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">لوحة المتجر</span>
    <h2>${icon("bell")} الإشعارات</h2>
    ${list.length ? `<ul class="notif-list">${list.map(n => `
      <li class="${n.read_at ? "" : "unread"}">
        <span class="notif-icon">${icon(NOTIF_TYPE_ICON[n.type] || "bell")}</span>
        <div class="notif-body"><strong>${esc(n.title || "إشعار")}</strong><small>${esc(n.message || "")}</small><time>${fmt(n.created_at)}</time></div>
      </li>`).join("")}</ul>`
      : `<div class="empty-managed">${icon("bell")}<p>لا إشعارات بعد — ستصلك هنا إشعارات الطلبات الجديدة وتحديثات متجرك.</p></div>`}
  `, "notif-modal");
  // Opening the panel marks everything read (server + local badge).
  if ((state._merchantNotifsUnread || 0) > 0) {
    const store = getMerchantStore();
    state._merchantNotifsUnread = 0;
    (state._merchantNotifs || []).forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); });
    fetch("/api/notify-order?action=notifications-read", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ storeId: store.id }) }).catch(() => {});
    const badge = document.querySelector(".notif-bell b");
    if (badge) badge.remove();
  }
}

// ── Merchant customers directory (spec §10) — built from THIS store's orders ──
// Pure client-side: the merchant session already loads its own orders from the
// cloud (loadOrdersFromSupabase), so no new endpoint or table is needed.

// Customer lifecycle per spec §10: repeat (2+ orders) / inactive (30+ days quiet) / new.
function customerStatus(c) {
  const THIRTY_D = 30 * 86400000;
  if (c.lastAt && Date.now() - c.lastAt > THIRTY_D) return ["غير نشط", "gray"];
  if (c.count > 1) return ["عميل متكرر", "green"];
  return ["جديد", "blue"];
}

function merchantCustomers() {
  const store = getMerchantStore();
  const customers = aggregateCustomers(store.id);
  if (!customers.length) {
    return `<section class="dashboard-card"><div class="empty-managed">${icon("users")}<p>لا يوجد عملاء بعد — سيُبنى دليل عملائك تلقائياً (الاسم، الهاتف، الطلبات) بمجرد ورود أول طلب على متجرك.</p></div></section>`;
  }
  const repeat = customers.filter(c => c.count > 1).length;
  const inactive = customers.filter(c => c.lastAt && Date.now() - c.lastAt > 30 * 86400000).length;
  const totalRevenue = customers.reduce((s, c) => s + c.total, 0);
  const fmtDate = ms => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short" }).format(new Date(ms)); } catch (e) { return ""; } };
  const rows = customers.map(c => {
    const [stLabel, stTone] = customerStatus(c);
    return `<tr>
      <td><strong>${esc(c.name)}</strong>${c.address ? `<small class="cust-addr">${esc(c.address)}</small>` : ""}</td>
      <td>${c.phone ? `<code dir="ltr">${esc(c.phone)}</code>` : `<span class="creds-muted">—</span>`}</td>
      <td>${c.count.toLocaleString("ar")}</td>
      <td><strong>${money(c.total)}</strong></td>
      <td>${c.firstAt ? fmtDate(c.firstAt) : "—"}</td>
      <td>${c.lastAt ? fmtDate(c.lastAt) : esc(c.lastTime)}</td>
      <td><span class="status-pill ${stTone}">${stLabel}</span></td>
      <td class="creds-actions">
        ${c.phone ? `<a class="table-action" href="https://wa.me/${c.phone}" target="_blank" rel="noopener" title="مراسلة عبر واتساب">${icon("whatsapp")}</a>` : ""}
        <button class="table-action" data-action="merchant-customer" data-key="${escAttr(c.key)}" title="ملف العميل وطلباته">${icon("eye")}</button>
      </td>
    </tr>`;
  }).join("");
  return `
    <div class="stats-grid admin-stats">
      ${statCard("users", "عملاء متجرك", customers.length.toLocaleString("ar"), repeat ? `${repeat.toLocaleString("ar")} عميل متكرّر` : "من واقع طلبات متجرك", "blue")}
      ${statCard("star", "عملاء متكررون", repeat.toLocaleString("ar"), customers.length ? `${Math.round((repeat / customers.length) * 100).toLocaleString("ar")}% من عملائك` : "—", "green")}
      ${statCard("clock", "غير نشطين", inactive.toLocaleString("ar"), "لم يطلبوا منذ 30 يوماً — أرسل لهم عرضاً", "orange")}
      ${statCard("wallet", "إجمالي إنفاقهم", money(totalRevenue), `من ${customers.reduce((s, c) => s + c.count, 0).toLocaleString("ar")} طلب`, "yellow")}
    </div>
    <div class="dashboard-toolbar">
      <div class="dashboard-search">${icon("search")}<input id="merchant-customer-search" placeholder="ابحث بالاسم أو رقم الهاتف"></div>
      <div class="toolbar-actions"><button class="secondary-button compact" data-action="export-merchant-customers">${icon("download")} تصدير</button></div>
    </div>
    <section class="dashboard-card customers-table-card">
      <div class="table-wrap">
        <table class="admin-table merchant-customers-table">
          <thead><tr><th>العميل</th><th>الهاتف</th><th>الطلبات</th><th>الإنفاق</th><th>أول طلب</th><th>آخر طلب</th><th>الحالة</th><th></th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>
    <p class="managed-hint">${icon("shield")} بيانات عملائك من طلبات متجرك فقط. راعِ موافقتهم عند المراسلة — لا تُرسل رسائل جماعية عشوائية حفاظاً على رقمك.</p>`;
}

// Customer profile for the merchant: contact + THEIR orders at this store,
// rendered with the merchant order-table (manage-order actions the owner has).
function openMerchantCustomer(key) {
  const store = getMerchantStore();
  const c = aggregateCustomers(store.id).find(x => x.key === key);
  if (!c) return;
  const orders = state.orders
    .filter(o => o.storeId === store.id && customerKey(o) === key)
    .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
  const [stLabel, stTone] = customerStatus(c);
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">ملف العميل</span><h2>${esc(c.name)} <span class="status-pill ${stTone}">${stLabel}</span></h2>
    <div class="order-manager-summary">
      <span><small>الطلبات</small><strong>${c.count.toLocaleString("ar")}</strong></span>
      <span><small>إجمالي الإنفاق</small><strong>${money(c.total)}</strong></span>
      <span><small>متوسط الطلب</small><strong>${money(c.count ? Math.round(c.total / c.count) : 0)}</strong></span>
    </div>
    ${c.phone ? `<div class="order-contact"><div class="order-contact__row">${icon("phone")}<span dir="ltr">${esc(c.phone)}</span><a class="order-wa-btn" href="https://wa.me/${c.phone}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة العميل</a></div></div>` : ""}
    ${orders.length ? renderOrdersTable(orders.slice(0, 10), "merchant") : ""}
  `, "customer-detail-modal");
}

function exportMerchantCustomersCsv() {
  const store = getMerchantStore();
  const customers = aggregateCustomers(store.id);
  if (!customers.length) { showToast("لا يوجد عملاء للتصدير"); return; }
  const fmt = ms => { try { return new Date(ms).toISOString().slice(0, 10); } catch (e) { return ""; } };
  const rows = [["العميل", "الهاتف", "الطلبات", "إجمالي الإنفاق", "أول طلب", "آخر طلب", "الحالة", "العنوان"],
    ...customers.map(c => [c.name, c.phone || "", c.count, c.total, c.firstAt ? fmt(c.firstAt) : "", c.lastAt ? fmt(c.lastAt) : "", customerStatus(c)[0], c.address || ""])];
  const csv = "﻿" + rows.map(r => r.map(x => `"${String(x).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `dukkanci-${storeParam(store)}-customers.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("تم تجهيز ملف العملاء", "success");
}

// ── Merchant reports (spec §16): product reports + in-store search report ──

// Debounced first-party log of in-store product searches → search_logs (server
// validates + caps). Skips repeats so typing "شاورما" logs once, not 6 times.
let _searchLogTimer = null, _searchLogLast = "";
function logStoreSearch(storeId, query, resultsCount) {
  clearTimeout(_searchLogTimer);
  _searchLogTimer = setTimeout(() => {
    const q = String(query || "").trim();
    if (!storeId || q.length < 2 || q === _searchLogLast) return;
    _searchLogLast = q;
    fetch("/api/notify-order?action=log-search", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ storeId, query: q, resultsCount })
    }).catch(() => {});
  }, 1400);
}

// Client-side product reports from this store's loaded orders + catalog:
// best sellers / no movement / needs photo / needs description (spec §16).
function merchantProductReportData() {
  const store = getMerchantStore();
  const storeProducts = allProducts.filter(p => p.storeId === store.id);
  const qtyByProduct = new Map();
  state.orders.filter(o => o.storeId === store.id).forEach(o => (o.lineItems || []).forEach(li => {
    const k = li.name || "";
    if (k) qtyByProduct.set(k, (qtyByProduct.get(k) || 0) + (li.qty || 1));
  }));
  const top = [...qtyByProduct.entries()].map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value).slice(0, 8);
  const noMove = storeProducts.filter(p => !qtyByProduct.has(p.name));
  const needsImage = storeProducts.filter(p => isPlaceholderImage(p.image));
  const needsDesc = storeProducts.filter(p => !(p.description || "").trim() || (p.description || "").trim().length < 10);
  return { store, storeProducts, top, noMove, needsImage, needsDesc };
}

function merchantProductReports() {
  const d = merchantProductReportData();
  const nameList = (list) => list.length
    ? `<ul class="report-name-list">${list.slice(0, 8).map(p => `<li>${esc(p.name)}</li>`).join("")}${list.length > 8 ? `<li class="more">…و${(list.length - 8).toLocaleString("ar")} منتجاً آخر</li>` : ""}</ul>`
    : `<p class="report-ok">${icon("check")} لا شيء هنا — ممتاز!</p>`;
  return `
    <div class="dashboard-grid two-col">
      <section class="dashboard-card"><div class="card-heading"><div><h3>الأكثر طلباً</h3><p>حسب الكمية في آخر الطلبات المحمّلة</p></div></div>
        ${d.top.length ? analyticsHBars(d.top, v => `${v.toLocaleString("ar")}×`) : `<div class="empty-managed">${icon("chart")}<p>لا طلبات بعد.</p></div>`}
      </section>
      <section class="dashboard-card"><div class="card-heading"><div><h3>بلا حركة</h3><p>${d.noMove.length.toLocaleString("ar")} منتجاً لم يُطلب في آخر الطلبات — جرّب عرضاً أو صورة أفضل</p></div></div>
        ${nameList(d.noMove)}
      </section>
    </div>
    <div class="dashboard-grid two-col">
      <section class="dashboard-card"><div class="card-heading"><div><h3>تحتاج صورة</h3><p>${d.needsImage.length.toLocaleString("ar")} منتجاً بلا صورة — لا يظهر للعملاء</p></div>${d.needsImage.length ? `<button class="text-button" data-action="merchant-tab" data-tab="images">قسم الصور ${icon("arrowLeft")}</button>` : ""}</div>
        ${nameList(d.needsImage)}
      </section>
      <section class="dashboard-card"><div class="card-heading"><div><h3>تحتاج وصفاً أفضل</h3><p>${d.needsDesc.length.toLocaleString("ar")} منتجاً بلا وصف — الوصف يرفع الثقة والتحويل</p></div></div>
        ${nameList(d.needsDesc)}
      </section>
    </div>`;
}

// In-store search report card (top terms + zero-result terms) — lazy-loaded.
function merchantSearchReportCard() {
  const store = getMerchantStore();
  const sr = state._merchantSearchReport;
  if (sr == null && !state._merchantSearchReportLoading) {
    state._merchantSearchReportLoading = true;
    fetch(`/api/notify-order?action=store-search-terms&storeId=${store.id}`, { headers: merchantHeaders() })
      .then(r => r.json()).then(data => { state._merchantSearchReport = { total: Number(data.total) || 0, top: data.top || [], zero: data.zero || [] }; })
      .catch(() => { state._merchantSearchReport = { total: 0, top: [], zero: [] }; })
      .finally(() => { state._merchantSearchReportLoading = false; render(); });
  }
  const body = sr == null
    ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل تقرير البحث…</p></div>`
    : (!sr.total
      ? `<div class="empty-managed">${icon("search")}<p>لا عمليات بحث مسجّلة بعد — يُسجَّل من الآن ما يكتبه زوّارك في بحث صفحة متجرك.</p></div>`
      : `<div class="search-report-cols">
          <div><h4>أكثر كلمات البحث</h4>${analyticsHBars(sr.top.slice(0, 8).map(t => ({ label: t.query, value: t.count })), v => v.toLocaleString("ar"))}</div>
          <div><h4>بحثوا ولم يجدوا</h4>${sr.zero.length
            ? `<ul class="report-name-list">${sr.zero.slice(0, 8).map(t => `<li>${esc(t.query)} <small>(${t.count.toLocaleString("ar")}×)</small></li>`).join("")}</ul><p class="field-hint">${icon("stars")} أضِف هذه الكلمات كمرادفات لمنتجاتك من قسم «البحث والمرادفات».</p>`
            : `<p class="report-ok">${icon("check")} كل عمليات البحث وجدت نتائج.</p>`}</div>
        </div>`);
  return `
    <section class="dashboard-card"><div class="card-heading"><div><h3>تقرير البحث داخل متجرك</h3><p>ماذا يكتب زوّارك في مربع البحث — وما لم يجدوه</p></div>${sr && sr.total ? `<button class="text-button" data-action="merchant-tab" data-tab="search">قسم المرادفات ${icon("arrowLeft")}</button>` : ""}</div>${body}</section>`;
}

// Export the full product report as one CSV (spec §16 تصدير التقارير).
function exportMerchantReportCsv() {
  const d = merchantProductReportData();
  const qty = new Map(d.top.map(t => [t.label, t.value]));
  const rows = [["المنتج", "التصنيف", "السعر", "مرات الطلب", "لديه صورة", "لديه وصف"],
    ...d.storeProducts.map(p => [p.name, p.category || "", Number(p.price) || 0, qty.get(p.name) || 0,
      isPlaceholderImage(p.image) ? "لا" : "نعم", (p.description || "").trim().length >= 10 ? "نعم" : "لا"])];
  const csv = "﻿" + rows.map(r => r.map(x => `"${String(x).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `dukkanci-${storeParam(d.store)}-report.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("تم تجهيز ملف التقرير", "success");
}

// ── Meta catalog feed (spec §13): readiness report + public feed URL ──────────
// Meta ingests a scheduled feed URL (Commerce Manager → Data Sources), so the
// merchant's job is: fix the "needs review" items, then paste ONE link. The feed
// itself is served by the public meta-feed action (same rules as below).
function catalogReadiness(p) {
  const img = String(p.image || "");
  if (!img || isPlaceholderImage(img)) return "no_image";
  if (img.startsWith("data:")) return "embedded_image"; // needs a public URL, data-URLs can't go in a feed
  if (p.priceOnRequest || !(Number(p.price) > 0)) return "no_price";
  return "ready";
}

function merchantCatalog() {
  const store = getMerchantStore();
  const list = allProducts.filter(p => p.storeId === store.id);
  const groups = { ready: [], no_image: [], embedded_image: [], no_price: [] };
  list.forEach(p => groups[catalogReadiness(p)].push(p));
  const feedUrl = `${SITE_ORIGIN}/api/notify-order?action=meta-feed&storeId=${store.id}`;
  const nameList = (arr) => arr.length
    ? `<ul class="report-name-list">${arr.slice(0, 6).map(p => `<li>${esc(p.name)}</li>`).join("")}${arr.length > 6 ? `<li class="more">…و${(arr.length - 6).toLocaleString("ar")} منتجاً آخر</li>` : ""}</ul>`
    : "";
  const reviewBlocks = [
    ["بلا صورة", groups.no_image, "أضِف صورة من قسم «المنتجات» — منتج بلا صورة لا يدخل الكتالوج.", "images"],
    ["صورة مضمّنة (تحتاج رابطاً عاماً)", groups.embedded_image, "هذه الصور رُفعت كملفات مضمّنة ولا تقبلها ميتا في الـFeed — تواصل مع إدارة دكانجي لرفعها كروابط عامة.", null],
    ["بلا سعر صالح", groups.no_price, "منتجات «السعر عند الطلب» أو بسعر صفر لا تدخل الكتالوج — حدّد سعراً رقمياً.", "products"]
  ].filter(([, arr]) => arr.length);
  return `
    <div class="stats-grid admin-stats">
      ${statCard("check", "جاهز للكتالوج", groups.ready.length.toLocaleString("ar"), "يدخل الـFeed تلقائياً", "green")}
      ${statCard("stars", "يحتاج مراجعة", (list.length - groups.ready.length).toLocaleString("ar"), "صور أو أسعار ناقصة", "orange")}
      ${statCard("box", "إجمالي المنتجات", list.length.toLocaleString("ar"), `${store.name}`, "blue")}
    </div>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("share")} رابط الـFeed لكتالوج ميتا</h3><p>الصق هذا الرابط في Commerce Manager وستُحدَّث منتجاتك تلقائياً كل ساعة.</p></div></div>
      <div class="store-link-row">
        <input readonly dir="ltr" value="${escAttr(feedUrl)}" onfocus="this.select()">
        <button type="button" class="primary-button compact" data-action="copy-store-link" data-link="${escAttr(feedUrl)}">${icon("check")} نسخ الرابط</button>
        <a class="secondary-button compact" href="${escAttr(feedUrl)}" target="_blank" rel="noopener">${icon("download")} تحميل CSV</a>
      </div>
      <ol class="catalog-steps">
        <li>افتح <b dir="ltr">Meta Commerce Manager</b> ← <b>Catalog</b> ← <b>Data Sources</b>.</li>
        <li>اختر <b>Data Feed</b> ثم <b>Scheduled Feed</b> والصق الرابط أعلاه.</li>
        <li>اضبط الجلب على «كل ساعة» — أي تعديل تجريه هنا يصل الكتالوج تلقائياً.</li>
      </ol>
      <p class="field-hint">${icon("shield")} الرابط عام لأن ميتا تجلبه دون تسجيل دخول — ولا يعرض إلا بيانات منتجاتك الظاهرة أصلاً في متجرك.</p>
    </section>
    ${reviewBlocks.length ? `<div class="dashboard-grid ${reviewBlocks.length > 1 ? "two-col" : ""}">${reviewBlocks.map(([title, arr, hint, tab]) => `
      <section class="dashboard-card"><div class="card-heading"><div><h3>${esc(title)}</h3><p>${arr.length.toLocaleString("ar")} منتجاً — ${esc(hint)}</p></div>${tab ? `<button class="text-button" data-action="merchant-tab" data-tab="${tab}">${icon("arrowLeft")}</button>` : ""}</div>${nameList(arr)}</section>`).join("")}</div>`
      : `<section class="dashboard-card"><p class="report-ok">${icon("check")} كل منتجاتك جاهزة للكتالوج — ممتاز!</p></section>`}
    <div class="review-note">${icon("clock")} <span><strong>المزامنة المباشرة عبر Meta API (بدون Feed)</strong><small>تتطلب ربط كتالوج وحساب أعمال من إدارة دكانجي — ستُفعَّل لاحقاً؛ رابط الـFeed أعلاه يغنيك عنها الآن.</small></span></div>`;
}

// ── Merchant support (الدعم الفني): FAQ + direct WhatsApp to the Dukkanci team ──
// Dedicated Dukkanci merchant-support line; inbound messages land in the
// admin «المحادثات» inbox.
const SUPPORT_WA = "905528000220";
const MERCHANT_FAQ = [
  ["كيف أعدّل سعر منتج بسرعة؟", "من قسم «المنتجات والمنيو» عدّل الرقم في حقل السعر داخل الجدول واضغط Enter — يُحفظ فوراً ويُسجَّل في «سجل التعديلات». ولتعديل أسعار كثيرة دفعة واحدة استخدم «تصدير» ثم «تحديث بالجملة» بملف Excel/CSV."],
  ["لماذا لا يظهر منتجي للعملاء؟", "المنتج لا يظهر إذا كان بلا صورة حقيقية أو مُعلَّماً «غير متوفر». أضِف صورة من قسم «المنتجات» أو حسّنها من قسم «الصور والتحسين»، وتأكد أن مفتاح التوفر مفعّل."],
  ["كيف أحسّن صور منتجاتي بالذكاء الاصطناعي؟", "من قسم «الصور والتحسين» اضغط «تحسين» على أي منتج، قارن قبل/بعد، ثم اعتمد النسخة المحسّنة أو احتفظ بالأصل. صورتك الأصلية محفوظة دائماً ويمكن استرجاعها بضغطة."],
  ["كيف أنشئ كود خصم؟", "من قسم «كودات الخصم» اضغط «كود جديد»: اختر النوع (نسبة، مبلغ ثابت، أو توصيل مجاني)، وحدّد تاريخ الانتهاء وحدود الاستخدام. الكود يعمل فوراً في صفحة الدفع وتتابع أداءه من نفس القسم."],
  ["ما فائدة «البحث والمرادفات»؟", "عملاؤك يبحثون بتسميات ولهجات مختلفة («دلّاع» بدل «بطيخ»). أضِف المرادفات لكل منتج — يدوياً أو بتوليد اقتراحات بالذكاء الاصطناعي — ليظهر منتجك مهما اختلفت الكلمة. وراجع «بحثوا ولم يجدوا» في التقارير لتعرف ما ينقصك."],
  ["كيف أربط منتجاتي بإعلانات فيسبوك وإنستغرام؟", "من قسم «كتالوجات ميتا» انسخ رابط الـFeed والصقه في Meta Commerce Manager (Data Sources ← Scheduled Feed) — تُحدَّث منتجاتك في الكتالوج تلقائياً كل ساعة."],
  ["كيف أدير الطلبات وأُعلم العميل؟", "من قسم «الطلبات» غيّر حالة الطلب (قيد التجهيز، جاهز، مكتمل…) — يصل العميل إشعار واتساب تلقائياً مع كل تحديث، ويصلك جرس إشعار مع كل طلب جديد."],
  ["كيف أجدّد اشتراكي أو أستفسر عن الرسوم؟", "من قسم «الاشتراك» تجد حالة خطتك وزر التجديد. الرسوم شهرية حسب تصنيف متجرك، وللاستفسار راسلنا عبر زر واتساب أعلاه."]
];

function merchantSupport() {
  const store = getMerchantStore();
  const waText = encodeURIComponent(`مرحباً فريق دكانجي 👋\nأنا من متجر «${store.name}» (رقم ${store.id}) وأحتاج مساعدة بخصوص: `);
  return `
    <section class="dashboard-card support-contact">
      <div class="card-heading"><div><h3>${icon("whatsapp")} تواصل مباشر مع فريق دكانجي</h3><p>نرد عليك في أسرع وقت — رسالتك تصل لفريق الدعم مباشرة.</p></div></div>
      <div class="share-buttons">
        <a class="share-btn wa" href="https://wa.me/${SUPPORT_WA}?text=${waText}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة الدعم عبر واتساب</a>
        <a class="share-btn native" href="/contact" data-route="contact">${icon("phone")} كل وسائل التواصل</a>
      </div>
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("shield")} أسئلة شائعة</h3><p>أجوبة سريعة عن أكثر ما يسأل عنه أصحاب المتاجر</p></div></div>
      <div class="support-faq">
        ${MERCHANT_FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}
      </div>
    </section>`;
}

function merchantOverview() {
  const store = getMerchantStore();
  const merchantOrders = state.orders.filter(order => order.storeId === store.id);
  const storeProducts = allProducts.filter(product => product.storeId === store.id);
  const shownCount = storeProducts.filter(isShownOnStore).length;
  const offersCount = storeProducts.filter(product => product.oldPrice).length;
  const revenue = merchantOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  const openOrders = merchantOrders.filter(order => !["مكتمل", "ملغى", "مرفوضة"].includes(order.status)).length;
  const ratingLabel = store.newStore ? "جديد" : String(store.rating);
  const ratingTrend = store.newStore ? "بانتظار أول تقييم" : `من ${store.reviews} تقييماً`;
  // Subscription snapshot for the overview card (real values from the DB).
  const subStatus = store.subscriptionStatus || "none";
  const subMeta = SUBSCRIPTION_LABELS[subStatus] || SUBSCRIPTION_LABELS.none;
  const subActive = store.subscriptionActive !== false && subStatus !== "expired" && subStatus !== "canceled";
  const subEndIso = (subStatus === "trialing" && store.trialEndsAt) ? store.trialEndsAt : store.currentPeriodEnd;
  const subDaysLeft = subEndIso ? Math.max(0, Math.ceil((new Date(subEndIso).getTime() - Date.now()) / 86400000)) : null;
  const subPct = subDaysLeft != null ? Math.max(4, Math.min(100, Math.round((subDaysLeft / 30) * 100))) : 0;
  const subEndText = subEndIso ? `حتى ${formatSubDate(subEndIso)}` : (subActive ? "اشتراك فعّال" : "بحاجة للتجديد");
  // Real last-7-days order counts (spec §24 «لا أرقام وهمية»): bucket this store's
  // own orders by calendar day, oldest→newest, ending today. No hardcoded values.
  const DAY_MS = 86400000;
  const weekStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime() - 6 * DAY_MS; })();
  const week = Array.from({ length: 7 }, (_, i) => ({ t: weekStart + i * DAY_MS, count: 0 }));
  merchantOrders.forEach(order => {
    const ts = Date.parse(order.createdAt || "") || 0;
    if (!ts) return;
    const d = new Date(ts); d.setHours(0, 0, 0, 0);
    const idx = Math.round((d.getTime() - weekStart) / DAY_MS);
    if (idx >= 0 && idx < 7) week[idx].count++;
  });
  const weekTotal = week.reduce((s, x) => s + x.count, 0);
  const weekTop = Math.max(4, ...week.map(x => x.count));
  const weekDayFmt = new Intl.DateTimeFormat("ar-EG", { weekday: "short" });
  return `
    <div class="stats-grid">
      ${statCard("receipt", "طلبات المتجر", merchantOrders.length.toLocaleString("ar"), openOrders ? `${openOrders.toLocaleString("ar")} طلب يحتاج متابعتك` : "لا طلبات قيد التنفيذ", "green")}
      ${statCard("wallet", "إجمالي قيمة الطلبات", `${revenue.toLocaleString("ar")} ل.ت`, merchantOrders.length ? `من ${merchantOrders.length.toLocaleString("ar")} طلب` : "لا توجد طلبات بعد", "orange")}
      ${statCard("box", "منتجات المتجر", storeProducts.length.toLocaleString("ar"), `${shownCount.toLocaleString("ar")} معروض · ${(storeProducts.length - shownCount).toLocaleString("ar")} بانتظار صورة`, "blue")}
      ${statCard("star", "متوسط التقييم", ratingLabel, ratingTrend, "yellow")}
    </div>
    <div class="dashboard-grid">
      <section class="dashboard-card chart-card">
        <div class="card-heading"><div><h3>أداء الطلبات</h3><p>آخر 7 أيام</p></div></div>
        ${weekTotal ? `
        <div class="chart-wrap">
          <div class="chart-y">${[weekTop, Math.round(weekTop * 0.75), Math.round(weekTop * 0.5), Math.round(weekTop * 0.25), 0].map(v => `<span>${v.toLocaleString("ar")}</span>`).join("")}</div>
          <div class="bar-chart">${week.map(x => `<div title="${escAttr(weekDayFmt.format(new Date(x.t)) + " · " + x.count.toLocaleString("ar") + " طلب")}"><span style="height:${Math.round((x.count / weekTop) * 150)}px"></span><small>${weekDayFmt.format(new Date(x.t))}</small></div>`).join("")}</div>
        </div>` : `<div class="empty-managed">${icon("chart")}<p>${merchantOrders.length ? "لا توجد طلبات في آخر 7 أيام — سيظهر الرسم فور استقبال طلب جديد." : "لا توجد بيانات كافية بعد. سيظهر الرسم البياني بمجرد استقبال أول الطلبات."}</p></div>`}
      </section>
      <section class="dashboard-card subscription-card">
        <div class="card-heading"><div><h3>حالة الاشتراك</h3><p>الخطة الحالية</p></div><span class="status-pill ${subMeta.pill}">${subMeta.text}</span></div>
        <div class="plan-name"><span>${icon("star")}</span><div><strong>اشتراك متجر دكانجي</strong><small>${subEndText}</small></div></div>
        <div class="progress-line"><span style="width:${subPct}%"></span></div>
        <div class="days-left"><span>${subActive ? "متبقي" : "الحالة"}</span><strong>${subDaysLeft != null && subActive ? `${subDaysLeft.toLocaleString("ar")} يوماً` : subMeta.text}</strong></div>
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
        <thead><tr><th>رقم الطلب</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>تاريخ الطلب</th><th>ساعة الطلب</th><th></th></tr></thead>
        <tbody>${orders.map(order => `
          <tr>
            <td><strong dir="ltr">${order.id}</strong></td><td>${order.customer}</td><td>${order.items} منتجات</td><td><strong>${money(order.total)}</strong></td>
            <td><span class="status-pill ${statusClass(order.status)}">${order.status}</span></td>
            <td>${formatOrderDateOnly(order.createdAt) || "—"}</td>
            <td>${formatOrderTimeOnly(order.createdAt) || order.time || "—"}</td>
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
      <div class="toolbar-actions"><button class="secondary-button compact" data-action="refresh-orders">${icon("bell")} تحديث</button>${storeOrders.length ? `<button class="secondary-button compact" data-action="export-csv" data-kind="orders">${icon("download")} تصدير</button>` : ""}</div>
    </div>
    <div class="order-status-tabs">${tabs.map(status => {
      const count = status === "الكل" ? storeOrders.length : storeOrders.filter(o => o.status === status).length;
      return `<button class="${status === activeFilter ? "active" : ""}" data-action="merchant-order-filter" data-status="${escAttr(status)}">${status}${count ? `<b>${count.toLocaleString("ar")}</b>` : ""}</button>`;
    }).join("")}</div>
    <section class="dashboard-card orders-table-card">${filtered.length ? renderOrdersTable(filtered, "merchant") : `<div class="empty-managed">${icon("receipt")}<p>${activeFilter === "الكل" ? "لا طلبات بعد — ستظهر هنا فور أن يطلب أحد العملاء من متجرك." : `لا طلبات بحالة "${activeFilter}"`}</p>${activeFilter === "الكل" ? `<button class="secondary-button compact" data-action="merchant-tab" data-tab="products">${icon("box")} راجع منتجاتك</button>` : ""}</div>`}</section>
  `;
}

function merchantProducts() {
  const store = getMerchantStore();
  const allStoreProducts = allProducts.filter(product => product.storeId === store.id);
  const query = (state.merchantProductSearch || "").trim();
  const normQuery = normalizeAr(query);
  const activeCat = state.merchantProductCategory || null;
  const storeCats = storeProductCategories(store.id);
  let merchantProducts = activeCat ? allStoreProducts.filter(p => p.category === activeCat) : allStoreProducts;
  if (normQuery) merchantProducts = merchantProducts.filter(product => normalizeAr(`${product.name} ${product.category}`).includes(normQuery));
  const catBar = `<div class="product-cat-filter">
    <button type="button" class="cat-chip ${!activeCat ? "active" : ""}" data-action="merchant-cat-filter" data-cat="">الكل <span>${allStoreProducts.length}</span></button>
    ${storeCats.map(c => { const cnt = allStoreProducts.filter(p => p.category === c).length; return `<button type="button" class="cat-chip ${activeCat === c ? "active" : ""}" data-action="merchant-cat-filter" data-cat="${escAttr(c)}">${esc(c)} <span>${cnt}</span></button>`; }).join("")}
    <button type="button" class="cat-chip add-cat-chip" data-action="add-store-category" data-id="${store.id}">${icon("plus")} تصنيف جديد</button>
  </div>`;
  const rows = merchantProducts.map(product => `
        <article>
          <img src="${escAttr(product.image)}" alt="${escAttr(product.name)}" loading="lazy">
          <div class="managed-product-name"><strong>${esc(product.name)}</strong><small>${product.category} · ${product.unit}</small></div>
          <div class="inline-price">
            <input type="number" min="0" step="1" inputmode="numeric" id="price-inp-${product.id}" value="${Number(product.price) || 0}" data-action="inline-price" data-id="${product.id}" aria-label="سعر ${escAttr(product.name)}" title="عدّل السعر مباشرة ثم اضغط Enter">
            <b>ل.ت</b>
            ${product.oldPrice ? `<s class="managed-old-price">${money(product.oldPrice)}</s>` : ""}
          </div>
          <label class="toggle"><input type="checkbox" ${product.available !== false ? "checked" : ""} data-action="toggle-product" data-id="${product.id}"><span></span><small>${product.available !== false ? "متوفر" : "غير متوفر"}</small></label>
          <span class="status-pill ${isShownOnStore(product) ? "green" : (isPlaceholderImage(product.image) ? "gray" : "red")}" title="${isPlaceholderImage(product.image) ? "أضف صورة ليظهر المنتج في المتجر" : ""}">${isShownOnStore(product) ? "معروض" : (isPlaceholderImage(product.image) ? "بانتظار صورة" : "مخفي")}</span>
          <div class="managed-product-actions">
            <button class="table-action" data-action="preview-product" data-id="${product.id}" title="معاينة كما يظهر للعميل">${icon("eye")}</button>
            <button class="table-action" data-action="price-history" data-id="${product.id}" title="سجل الأسعار">${icon("chart")}</button>
            <button class="table-action" data-action="edit-product" data-id="${product.id}" title="تعديل">${icon("edit")}</button>
            <button class="table-action danger" data-action="delete-product" data-id="${product.id}" title="حذف">${icon("trash")}</button>
          </div>
        </article>
      `).join("");
  return `
    <div class="dashboard-toolbar">
      <div class="dashboard-search">${icon("search")}<input id="merchant-product-search" placeholder="ابحث في منتجاتك" value="${escAttr(query)}"></div>
      <div class="toolbar-actions">
        <span class="toolbar-count">${merchantProducts.length.toLocaleString("ar")} منتج</span>
        <button class="secondary-button compact" data-action="export-merchant-products" title="تصدير كل منتجاتك كملف Excel/CSV">${icon("download")} تصدير</button>
        <label class="secondary-button compact csv-import-btn" title="حدّث الأسعار والتوفر بالجملة من ملف CSV">${icon("upload")} تحديث بالجملة<input type="file" id="merchant-csv-input" accept=".csv,text/csv" hidden></label>
        ${isSupermarketStore(store) ? `<button class="secondary-button compact" data-action="open-catalog-import" title="اختر منتجات جاهزة الصور من مخزن الصور المشترك بين متاجر السوبر ماركت">${icon("stars")} استيراد من مخزن الصور</button>` : ""}
        <button class="primary-button compact" data-action="add-product-form">${icon("plus")} منتج جديد</button>
      </div>
    </div>
    ${catBar}
    <section class="dashboard-card product-management">
      ${rows || `<div class="empty-managed">${icon("box")}<p>${query ? "لا منتجات مطابقة لبحثك" : "لا توجد منتجات بعد. ابدأ بإضافة أول منتج."}</p></div>`}
    </section>
    ${allStoreProducts.length ? `<p class="managed-hint">${icon("edit")} عدّل السعر مباشرة من الحقل واضغط Enter، أو استخدم «تصدير» و«تحديث بالجملة» لتعديل أسعار كثيرة دفعة واحدة. يُسجَّل كل تغيير سعر في «سجل الأسعار».</p>` : ""}
  `;
}

// ── Shared supermarket image bank ("مخزن الصور المشترك") ──────────────────
// Arab-owned supermarkets opening on Dukkanci rarely arrive with their own
// product photos/database, yet products overlap ~90% between them. This lets
// a supermarket-category store browse a curated, admin-approved catalog of
// standardized photos (background removed, uniform size/zoom — see
// lib/catalog-image-pipeline.js) and pull products straight into their own
// catalog: the name stays editable, no price is required up front, and an
// optional sale price can be set right away. Every catalog_products row a
// store can even SEE is already filtered server-side (RLS: approved AND
// brand_free) — see migrations/20260704_shared_supermarket_catalog.sql.

function isSupermarketStore(store) {
  if (!store) return false;
  const supermarketLabel = (typeof CATEGORY_SLUGS !== "undefined" && CATEGORY_SLUGS.supermarket) || "سوبر ماركت";
  return store.category === supermarketLabel;
}

function mapDbCatalogProduct(r) {
  return {
    id: r.id, canonicalName: r.canonical_name, category: r.category, unit: r.unit,
    image: r.image, keywords: r.keywords || []
  };
}

// Loads the public, pre-approved shared catalog once and caches it on state.
// Safe to call repeatedly — only fetches while not already loading/loaded.
async function loadSharedCatalog() {
  if (state._sharedCatalog || state._sharedCatalogLoading) return state._sharedCatalog || [];
  const sb = window.supabaseClient;
  if (!sb) return [];
  state._sharedCatalogLoading = true;
  try {
    // Explicit column list — matches the anon/authenticated column-level GRANT
    // (see migrations/20260707_catalog_products_hide_source_store.sql). Never
    // request source_store_id/contributor_store_ids/source_image here: a
    // merchant importing from the bank must never learn which competitor
    // store's photo they're reusing.
    const { data, error } = await sb.from("catalog_products").select("id,canonical_name,category,subcategory,unit,image,keywords,usage_count").order("canonical_name");
    if (error) { console.warn("shared catalog load:", error.message); state._sharedCatalog = []; return []; }
    state._sharedCatalog = (data || []).map(mapDbCatalogProduct);
    return state._sharedCatalog;
  } finally {
    state._sharedCatalogLoading = false;
  }
}

function openCatalogImportModal() {
  const store = getMerchantStore();
  if (!isSupermarketStore(store)) return;
  const alreadyImported = new Set(
    allProducts.filter(p => p.storeId === store.id && p.catalogProductId).map(p => p.catalogProductId)
  );
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${store.name}</span>
    <h2>استيراد من مخزن الصور المشترك</h2>
    <p class="modal-note">منتجات جاهزة بصور نظيفة وموحّدة القياس، ساهمت بها متاجر سوبر ماركت أخرى على دكانجي وراجعتها الإدارة. عدّل الاسم إن أردت، وحدّد سعرك الخاص — أو اتركه بلا سعر الآن وحدّده لاحقاً.</p>
    <div class="dashboard-search">${icon("search")}<input id="catalog-import-search" placeholder="ابحث في مخزن الصور..."></div>
    <div id="catalog-import-grid" class="catalog-import-grid">${icon("box")} <span>جارٍ التحميل...</span></div>
  `, "catalog-import-modal");

  loadSharedCatalog().then(list => {
    const grid = document.getElementById("catalog-import-grid");
    if (!grid) return; // modal closed before load finished
    const available = list.filter(item => !alreadyImported.has(item.id));
    if (!available.length) {
      grid.innerHTML = `<div class="empty-managed">${icon("box")}<p>لا توجد منتجات جديدة في المخزن حالياً — إمّا استوردتها جميعاً، أو أن المخزن لا يزال قيد التجهيز من الإدارة.</p></div>`;
      return;
    }
    grid.innerHTML = available.map(item => {
      const searchBlob = normalizeAr([item.canonicalName, ...(item.keywords || []), item.category || ""].join(" "));
      return `
      <article class="catalog-import-card" data-catalog-id="${item.id}" data-search="${escAttr(searchBlob)}">
        <img src="${escAttr(item.image)}" alt="${escAttr(item.canonicalName)}" loading="lazy">
        <label class="input-label"><span>اسم المنتج</span><input class="ci-name" value="${escAttr(item.canonicalName)}"></label>
        <div class="ci-price-row">
          <label class="input-label"><span>السعر</span><input class="ci-price" type="number" min="0" step="1" inputmode="numeric" placeholder="بلا سعر الآن"></label>
          <label class="input-label"><span>سعر العرض</span><input class="ci-old-price" type="number" min="0" step="1" inputmode="numeric" placeholder="اختياري"></label>
        </div>
        <label class="input-label"><span>الوحدة</span><input class="ci-unit" value="${escAttr(item.unit || "")}"></label>
        <button type="button" class="primary-button compact full" data-action="import-catalog-item" data-catalog-id="${item.id}">${icon("plus")} إضافة لمتجري</button>
      </article>
    `;
    }).join("");
  });
}

// Builds one product from a catalog card's current inputs and saves it to
// THIS merchant's store through the exact same secure path as the normal
// "إضافة منتج" form (pushProductCloud → /api/notify-order?action=save-product).
async function importCatalogItem(catalogId, cardEl) {
  const store = getMerchantStore();
  const item = (state._sharedCatalog || []).find(x => x.id === Number(catalogId));
  if (!item) { showToast("تعذّر العثور على المنتج في المخزن"); return; }

  const nameInput = cardEl.querySelector(".ci-name");
  const priceInput = cardEl.querySelector(".ci-price");
  const oldPriceInput = cardEl.querySelector(".ci-old-price");
  const unitInput = cardEl.querySelector(".ci-unit");
  const btn = cardEl.querySelector('[data-action="import-catalog-item"]');

  const name = (nameInput?.value || item.canonicalName || "").trim();
  if (!name) { showToast("أدخل اسم المنتج"); return; }
  const priceVal = Math.max(0, Math.round(Number(priceInput?.value) || 0));
  const oldPriceVal = Math.max(0, Math.round(Number(oldPriceInput?.value) || 0));
  const hasPrice = priceVal > 0;

  if (btn) { btn.disabled = true; btn.innerHTML = "جارٍ الإضافة..."; }

  const newId = Math.max(0, ...allProducts.map(p => Number(p.id) || 0), ...products.map(p => Number(p.id) || 0)) + 1;
  const newProduct = {
    id: newId, storeId: store.id, sourceId: `catalog-${item.id}-${newId}`,
    name, category: item.category || "منتجات", unit: (unitInput?.value || item.unit || "").trim(),
    image: item.image, imageFit: "contain", // uniform framing set by the shared-bank pipeline
    price: hasPrice ? priceVal : 0, priceOnRequest: !hasPrice,
    oldPrice: hasPrice && oldPriceVal > 0 && oldPriceVal < priceVal ? oldPriceVal : null,
    available: true, featured: false, options: [], description: "",
    catalogProductId: item.id
  };

  const result = await pushProductCloud(newProduct);
  if (!result.ok) {
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("plus")} إضافة لمتجري`; }
    showToast(productSaveErrorMessage(result));
    return;
  }
  upsertCatalogProduct(newProduct);
  saveCustomProduct(newProduct);
  if (btn) { btn.disabled = true; btn.innerHTML = `${icon("check")} أُضيف`; }
  cardEl.classList.add("catalog-import-card--done");
  showToast(`تمت إضافة "${name}" إلى متجرك`, "success");
}

// ── Shared supermarket image bank — admin review queue ──────────────────
// Every row scripts/build-shared-catalog.js (or api/catalog-process-image.js)
// ingests starts life invisible to every store (approved=false). This is the
// human checkpoint: nothing here can be auto-approved — the reviewer looks at
// each processed photo and confirms it carries no store-specific trademark,
// logo, watermark, or price sticker before it can reach other merchants.
async function catalogReviewApi(action, { method = "GET", params = {}, body = null } = {}) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const opts = { method, headers: { "x-admin-token": state.adminKey || "" } };
  if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(`/api/catalog-review?${qs}`, opts);
  if (res.status === 403) { lockAdmin(); throw new Error("unauthorized"); }
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return res.json().catch(() => ({}));
}

function loadAdminCatalog(status) {
  state._adminCatalogLoading = true;
  const req = status === "pending" ? catalogReviewApi("pending") : catalogReviewApi("list", { params: { status } });
  req
    .then(data => { state._adminCatalog = Array.isArray(data.items) ? data.items : []; })
    .catch(() => { state._adminCatalog = []; })
    .finally(() => { state._adminCatalogLoading = false; render(); });
}

function adminCatalog() {
  const status = state._adminCatalogStatus || "pending";
  if (state._adminCatalog == null && !state._adminCatalogLoading) loadAdminCatalog(status);
  const list = state._adminCatalog;
  const selected = state._adminCatalogSelected || (state._adminCatalogSelected = new Set());
  const chip = (key, label) => `<button type="button" class="cat-chip ${status === key ? "active" : ""}" data-action="admin-catalog-status" data-status="${key}">${label}</button>`;
  const cards = (list || []).map(it => {
    const isSel = selected.has(it.id);
    const searchBlob = normalizeAr([it.canonical_name, it.category || "", ...(it.keywords || [])].join(" "));
    return `
      <article class="catalog-review-card ${isSel ? "is-selected" : ""}" data-catalog-id="${it.id}" data-search="${escAttr(searchBlob)}">
        <label class="catalog-review-check"><input type="checkbox" ${isSel ? "checked" : ""} data-action="admin-catalog-select" data-id="${it.id}"><span></span></label>
        <span class="status-pill ${it.enhanced ? "open" : "gray"} catalog-review-enhanced-badge">${it.enhanced ? "محسّنة بالذكاء الاصطناعي" : "صورة خام — غير محسّنة"}</span>
        <img src="${escAttr(it.image)}" alt="${escAttr(it.canonical_name)}" loading="lazy">
        <label class="input-label"><span>الاسم</span><input class="acr-name" value="${escAttr(it.canonical_name)}"></label>
        <small class="catalog-review-meta">${esc(it.category || "بلا تصنيف")} · ${(it.contributor_store_ids || []).length || 1} متجر ساهم بها${it.usage_count ? ` · تُستخدم في ${it.usage_count} متجر` : ""}</small>
        ${it.review_note ? `<p class="catalog-review-note">${icon("stars")} ${esc(it.review_note)}</p>` : ""}
        ${status === "pending"
          ? `<div class="catalog-review-actions">
              ${it.enhanced ? "" : `<button type="button" class="secondary-button compact full" data-action="admin-catalog-enhance" data-id="${it.id}">${icon("stars")} تحسين بالذكاء الاصطناعي</button>`}
              <div class="catalog-review-decision-row">
                <button type="button" class="primary-button compact" data-action="admin-catalog-approve" data-id="${it.id}">${icon("check")} اعتماد</button>
                <button type="button" class="secondary-button compact" data-action="admin-catalog-reject" data-id="${it.id}">${icon("close")} رفض</button>
              </div>
            </div>`
          : `<span class="status-pill ${it.approved ? "open" : "closed"}">${it.approved ? "معتمد" : "مرفوض"}</span>`}
      </article>`;
  }).join("");
  const selCount = selected.size;
  return `
    <div class="review-note images-safety">${icon("shield")} <span><strong>لا يظهر أي عنصر لبقية المتاجر إلا بعد اعتمادك هنا.</strong><small>الصور تُرفع خاماً بلا معالجة تلقائية — اضغط «تحسين بالذكاء الاصطناعي» فقط للعناصر التي تستحقها (تُزيل الخلفية وأي علامة متجر وتوحّد الزووم)، أو اعتمد الصورة كما هي إن كانت نظيفة أصلاً. تأكد دائماً أن الصورة خالية من أي علامة أو شعار أو ملصق سعر خاص بمتجر بعينه قبل الاعتماد.</small></span></div>
    <div class="dashboard-toolbar">
      <div class="dashboard-search">${icon("search")}<input id="admin-catalog-search" placeholder="ابحث في مخزن الصور"></div>
      <span class="toolbar-count">${(list || []).length.toLocaleString("ar")} عنصر</span>
      <button class="secondary-button compact" data-action="reload-admin-catalog">${icon("download")} تحديث</button>
    </div>
    <div class="product-cat-filter">
      ${chip("pending", "قيد المراجعة")}
      ${chip("approved", "معتمدة")}
      ${chip("rejected", "مرفوضة")}
      ${chip("all", "الكل")}
    </div>
    ${selCount ? `
    <div class="bulk-action-bar">
      <span>${selCount.toLocaleString("ar")} محدد</span>
      <button type="button" class="primary-button compact" data-action="admin-catalog-bulk-approve">${icon("check")} اعتماد المحدد</button>
      <button type="button" class="secondary-button compact" data-action="admin-catalog-bulk-reject">${icon("close")} رفض المحدد</button>
      <button type="button" class="table-action" data-action="admin-catalog-clear-selection">إلغاء التحديد</button>
    </div>` : ""}
    <section class="dashboard-card">
      ${list == null
        ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ التحميل…</p></div>`
        : (list.length ? `<div class="catalog-review-grid">${cards}</div>` : `<div class="empty-managed">${icon("box")}<p>${status === "pending" ? "لا توجد عناصر جديدة بانتظار المراجعة." : "لا توجد عناصر مطابقة."}</p></div>`)}
    </section>`;
}

// On-demand, per-item AI cleanup (background/marks removal + zoom
// standardization) — costs OpenAI credits, so it's only ever triggered
// explicitly by the reviewer clicking "تحسين بالذكاء الاصطناعي", never
// automatically. See api/catalog-review.js?action=enhance.
async function enhanceCatalogItem(id, cardEl) {
  const btn = cardEl && cardEl.querySelector('[data-action="admin-catalog-enhance"]');
  if (btn) { btn.disabled = true; btn.innerHTML = `${icon("stars")} جارٍ التحسين…`; }
  try {
    const data = await catalogReviewApi("enhance", { method: "POST", body: { id } });
    const item = (state._adminCatalog || []).find(it => it.id === id);
    if (item) { item.image = data.image; item.enhanced = true; if (data.brandCheckNote) item.review_note = data.brandCheckNote; }
    showToast("تم تحسين الصورة بالذكاء الاصطناعي", "success");
    render();
  } catch (e) {
    showToast("تعذّر تحسين الصورة: " + e.message, "error");
    if (btn) { btn.disabled = false; btn.innerHTML = `${icon("stars")} تحسين بالذكاء الاصطناعي`; }
  }
}

async function reviewCatalogItem(id, decision, cardEl) {
  const nameInput = cardEl && cardEl.querySelector(".acr-name");
  const canonicalName = nameInput ? nameInput.value.trim() : "";
  try {
    await catalogReviewApi("review", { method: "POST", body: { id, decision, canonicalName: canonicalName || undefined } });
    state._adminCatalog = (state._adminCatalog || []).filter(it => it.id !== id);
    if (state._adminCatalogSelected) state._adminCatalogSelected.delete(id);
    showToast(decision === "approve" ? "تم اعتماد العنصر — سيظهر الآن لمتاجر السوبر ماركت الأخرى" : "تم رفض العنصر", "success");
    render();
  } catch (e) { showToast("تعذّر تنفيذ العملية: " + e.message, "error"); }
}

async function bulkReviewCatalog(decision) {
  const ids = [...(state._adminCatalogSelected || [])];
  if (!ids.length) return;
  try {
    await catalogReviewApi("bulk-review", { method: "POST", body: { ids, decision } });
    state._adminCatalog = (state._adminCatalog || []).filter(it => !ids.includes(it.id));
    state._adminCatalogSelected = new Set();
    showToast(`${decision === "approve" ? "تم اعتماد" : "تم رفض"} ${ids.length.toLocaleString("ar")} عنصراً`, "success");
    render();
  } catch (e) { showToast("تعذّر تنفيذ العملية: " + e.message, "error"); }
}

// Arabic label for a coupon's type/value ("خصم 10%", "خصم 50 ل.ت", "توصيل مجاني").
function couponTypeLabel(c) {
  if (c.discount_type === "percent") return `خصم ${Number(c.value).toLocaleString("ar")}%${c.max_discount ? ` (حتى ${money(c.max_discount)})` : ""}`;
  if (c.discount_type === "free_delivery") return "توصيل مجاني";
  return `خصم ${money(c.value)}`;
}

function merchantOffers() {
  const store = getMerchantStore();
  const discountedProducts = products.filter(product => product.storeId === store.id && product.oldPrice);
  // ── Discount coupons (spec §11) — lazy-loaded once per section open ──
  const cs = state._merchantCoupons;
  if (cs == null && !state._merchantCouponsLoading) {
    state._merchantCouponsLoading = true;
    fetch(`/api/notify-order?action=merchant-coupons&storeId=${store.id}`, { headers: merchantHeaders() })
      .then(r => r.json()).then(data => { state._merchantCoupons = { list: Array.isArray(data.coupons) ? data.coupons : [], stats: data.stats || {} }; })
      .catch(() => { state._merchantCoupons = { list: [], stats: {} }; })
      .finally(() => { state._merchantCouponsLoading = false; render(); });
  }
  const fmtDate = iso => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)); } catch (e) { return ""; } };
  const couponCards = cs == null
    ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل كوداتك…</p></div>`
    : (cs.list.length ? `<div class="coupon-grid">${cs.list.map(c => {
        const st = cs.stats[c.id] || { uses: 0, discount: 0 };
        const expired = c.ends_at && Date.parse(c.ends_at) < Date.now();
        const exhausted = c.usage_limit && st.uses >= c.usage_limit;
        const [pill, pillLabel] = !c.active ? ["gray", "موقوف"] : expired ? ["red", "منتهي"] : exhausted ? ["orange", "استُنفد"] : ["green", "فعّال"];
        return `
        <article class="dashboard-card coupon-card">
          <div class="coupon-card__head"><code class="coupon-code" dir="ltr">${esc(c.code)}</code><span class="status-pill ${pill}">${pillLabel}</span></div>
          <strong class="coupon-type">${couponTypeLabel(c)}</strong>
          <div class="coupon-meta">
            ${c.min_subtotal ? `<span>حد أدنى ${money(c.min_subtotal)}</span>` : ""}
            ${c.ends_at ? `<span>${icon("calendar")} ينتهي ${fmtDate(c.ends_at)}</span>` : `<span>بلا تاريخ انتهاء</span>`}
            <span>${icon("receipt")} ${st.uses.toLocaleString("ar")}${c.usage_limit ? ` / ${c.usage_limit.toLocaleString("ar")}` : ""} استخدام</span>
            ${st.discount ? `<span>${icon("wallet")} خصومات مصروفة ${money(st.discount)}</span>` : ""}
          </div>
          <div class="offer-card-actions">
            <button class="secondary-button compact" data-action="edit-coupon" data-id="${c.id}">${icon("edit")} تعديل</button>
            <button class="secondary-button compact" data-action="toggle-coupon" data-id="${c.id}" data-active="${c.active ? "0" : "1"}">${c.active ? "إيقاف" : "تفعيل"}</button>
          </div>
        </article>`;
      }).join("")}</div>`
      : `<div class="empty-managed">${icon("megaphone")}<p>لا كودات خصم بعد — أنشئ كوداً لحملاتك أو عملائك (نسبة، مبلغ ثابت، أو توصيل مجاني).</p></div>`);
  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("megaphone")} كودات الخصم</h3><p>أنشئ أكواداً لحملاتك والمؤثرين وعملائك — تُطبَّق في صفحة الدفع وتُقاس نتائجها هنا.</p></div>
        <button class="primary-button compact" data-action="create-coupon">${icon("plus")} كود جديد</button></div>
      ${couponCards}
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("star")} عروض الأسعار</h3><p>خصم مباشر على سعر منتج يظهر لكل الزوار في صفحة متجرك.</p></div>
        <button class="secondary-button compact" data-action="create-offer">${icon("plus")} إنشاء عرض</button></div>
      ${discountedProducts.length ? `<div class="offer-management-grid">${discountedProducts.map(product => `
      <article class="dashboard-card"><span class="status-pill green">فعّال</span><h3>${product.name}</h3><p>السعر قبل الخصم ${money(product.oldPrice)} · الآن ${money(product.price)}</p><div><strong>${Math.round((1 - product.price / product.oldPrice) * 100)}%</strong><small>خصم</small></div><div class="offer-card-actions"><button class="secondary-button compact" data-action="edit-product" data-id="${product.id}">${icon("edit")} تعديل</button><button class="table-action danger" data-action="end-offer" data-id="${product.id}" title="إنهاء العرض">${icon("trash")}</button></div></article>
    `).join("")}</div>` : `<div class="empty-managed">${icon("star")}<p>لا عروض أسعار حالياً — اختر منتجاً وحدّد نسبة خصم ليظهر بشارة «وفر».</p></div>`}
    </section>
  `;
}

// Create/edit coupon modal (spec §11). Saving goes through the merchant-gated
// server action which forces store_id and enforces globally-unique codes.
function openCouponForm(id) {
  const cs = state._merchantCoupons || { list: [] };
  const editing = id ? cs.list.find(c => Number(c.id) === Number(id)) : null;
  const endsVal = editing && editing.ends_at ? new Date(editing.ends_at).toISOString().slice(0, 10) : "";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">كودات الخصم</span>
    <h2>${editing ? "تعديل كود الخصم" : "كود خصم جديد"}</h2>
    <form class="modal-form" id="merchant-coupon-form" data-id="${editing ? editing.id : ""}">
      <div class="form-grid">
        <label class="input-label"><span>الكود <i class="req">*</i></span><input name="code" required dir="ltr" placeholder="RAMADAN20" pattern="[A-Za-z0-9_-]{3,24}" value="${editing ? escAttr(editing.code) : ""}"><small class="field-hint">3-24 حرفاً لاتينياً/رقماً، بلا مسافات.</small></label>
        <label class="input-label"><span>نوع الخصم</span>
          <select name="discount_type">
            <option value="percent" ${!editing || editing.discount_type === "percent" ? "selected" : ""}>نسبة مئوية %</option>
            <option value="fixed" ${editing && editing.discount_type === "fixed" ? "selected" : ""}>مبلغ ثابت (ل.ت)</option>
            <option value="free_delivery" ${editing && editing.discount_type === "free_delivery" ? "selected" : ""}>توصيل مجاني</option>
          </select>
        </label>
        <label class="input-label"><span>قيمة الخصم</span><input name="value" type="number" min="0" step="1" inputmode="numeric" value="${editing ? Number(editing.value) || "" : ""}" placeholder="10"><small class="field-hint">للنسبة: 1-90. تُتجاهل مع «توصيل مجاني».</small></label>
        <label class="input-label"><span>أقصى خصم (للنسبة، اختياري)</span><input name="max_discount" type="number" min="0" step="1" value="${editing && editing.max_discount ? Number(editing.max_discount) : ""}" placeholder="100"></label>
        <label class="input-label"><span>الحد الأدنى للطلب (اختياري)</span><input name="min_subtotal" type="number" min="0" step="1" value="${editing && editing.min_subtotal ? Number(editing.min_subtotal) : ""}" placeholder="200"></label>
        <label class="input-label"><span>تاريخ الانتهاء (اختياري)</span><input name="ends_at" type="date" value="${endsVal}"></label>
        <label class="input-label"><span>حد الاستخدامات الكلي (اختياري)</span><input name="usage_limit" type="number" min="0" step="1" value="${editing && editing.usage_limit ? editing.usage_limit : ""}" placeholder="100"></label>
        <label class="input-label"><span>حد الاستخدام لكل عميل (اختياري)</span><input name="per_customer_limit" type="number" min="0" step="1" value="${editing && editing.per_customer_limit ? editing.per_customer_limit : ""}" placeholder="1"></label>
      </div>
      <button class="primary-button full" type="submit">${icon("check")} ${editing ? "حفظ التعديلات" : "إنشاء الكود"}</button>
    </form>
  `, "coupon-form-modal");
}

async function toggleCoupon(id, active) {
  const store = getMerchantStore();
  try {
    const r = await fetch("/api/notify-order?action=merchant-coupon-status", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ storeId: store.id, couponId: Number(id), active }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) { showToast("تعذّر تحديث حالة الكود", ""); return; }
    const c = (state._merchantCoupons?.list || []).find(x => Number(x.id) === Number(id));
    if (c) c.active = active;
    showToast(active ? "تم تفعيل الكود" : "تم إيقاف الكود", "success");
    render();
  } catch (e) { showToast("خطأ في الاتصال", ""); }
}

// ─────────── Admin: cross-store coupons (spec §11 admin view) ───────────
// Unlike the merchant coupon list (one store), this shows every coupon on the
// platform — including global/platform-wide coupons (store_id null, e.g. a
// launch code created directly in the DB, which no merchant session can see
// or edit) — via the admin-only "admin-coupons" server action.
function adminCoupons() {
  const cs = state._adminCoupons;
  if (cs == null && !state._adminCouponsLoading) {
    state._adminCouponsLoading = true;
    fetch("/api/notify-order?action=admin-coupons", { headers: merchantHeaders() })
      .then(r => r.json())
      .then(data => { state._adminCoupons = { list: Array.isArray(data.coupons) ? data.coupons : [], stats: data.stats || {}, storeNames: data.storeNames || {} }; })
      .catch(() => { state._adminCoupons = { list: [], stats: {}, storeNames: {} }; })
      .finally(() => { state._adminCouponsLoading = false; render(); });
  }
  const fmtDate = iso => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)); } catch (e) { return ""; } };
  const couponCards = cs == null
    ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل الكوبونات…</p></div>`
    : (cs.list.length ? `<div class="coupon-grid">${cs.list.map(c => {
        const st = cs.stats[c.id] || { uses: 0, discount: 0 };
        const expired = c.ends_at && Date.parse(c.ends_at) < Date.now();
        const exhausted = c.usage_limit && st.uses >= c.usage_limit;
        const [pill, pillLabel] = !c.active ? ["gray", "موقوف"] : expired ? ["red", "منتهي"] : exhausted ? ["orange", "استُنفد"] : ["green", "فعّال"];
        const scopeLabel = c.store_id ? (cs.storeNames[c.store_id] || `متجر #${c.store_id}`) : "عام — كل المتاجر";
        return `
        <article class="dashboard-card coupon-card">
          <div class="coupon-card__head"><code class="coupon-code" dir="ltr">${esc(c.code)}</code><span class="status-pill ${pill}">${pillLabel}</span></div>
          <strong class="coupon-type">${couponTypeLabel(c)}</strong>
          <div class="coupon-meta">
            <span>${icon("store")} ${esc(scopeLabel)}</span>
            ${c.min_subtotal ? `<span>حد أدنى ${money(c.min_subtotal)}</span>` : ""}
            ${c.ends_at ? `<span>${icon("calendar")} ينتهي ${fmtDate(c.ends_at)}</span>` : `<span>بلا تاريخ انتهاء</span>`}
            <span>${icon("receipt")} ${st.uses.toLocaleString("ar")}${c.usage_limit ? ` / ${c.usage_limit.toLocaleString("ar")}` : ""} استخدام</span>
            ${st.discount ? `<span>${icon("wallet")} خصومات مصروفة ${money(st.discount)}</span>` : ""}
          </div>
          <div class="offer-card-actions">
            <button class="secondary-button compact" data-action="edit-admin-coupon" data-id="${c.id}">${icon("edit")} تعديل</button>
            <button class="secondary-button compact" data-action="toggle-admin-coupon" data-id="${c.id}" data-active="${c.active ? "0" : "1"}">${c.active ? "إيقاف" : "تفعيل"}</button>
          </div>
        </article>`;
      }).join("")}</div>`
      : `<div class="empty-managed">${icon("megaphone")}<p>لا كوبونات بعد — أنشئ كوداً عاماً لكل المتاجر أو لمتجر واحد.</p></div>`);
  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("megaphone")} كل الكوبونات</h3><p>أكواد الخصم على مستوى المنصة أو لكل متجر — يديرها التاجر من لوحته أيضاً لكودات متجره.</p></div>
        <button class="primary-button compact" data-action="create-admin-coupon">${icon("plus")} كوبون جديد</button></div>
      ${couponCards}
    </section>`;
}

// Create/edit modal for the admin coupon view. Unlike the merchant version,
// this includes a store picker ("عام — كل المتاجر" or one specific store),
// since admin can create/edit a coupon for any scope.
function openAdminCouponForm(id) {
  const cs = state._adminCoupons || { list: [] };
  const editing = id ? cs.list.find(c => Number(c.id) === Number(id)) : null;
  const endsVal = editing && editing.ends_at ? new Date(editing.ends_at).toISOString().slice(0, 10) : "";
  const storeOptions = stores.slice().sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"))
    .map(s => `<option value="${s.id}" ${editing && Number(editing.store_id) === s.id ? "selected" : ""}>${escAttr(s.name)}</option>`).join("");
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">الكوبونات</span>
    <h2>${editing ? "تعديل كوبون" : "كوبون جديد"}</h2>
    <form class="modal-form" id="admin-coupon-form" data-id="${editing ? editing.id : ""}">
      <div class="form-grid">
        <label class="input-label"><span>الكود <i class="req">*</i></span><input name="code" required dir="ltr" placeholder="RAMADAN20" pattern="[A-Za-z0-9_-]{3,24}" value="${editing ? escAttr(editing.code) : ""}"><small class="field-hint">3-24 حرفاً لاتينياً/رقماً، بلا مسافات.</small></label>
        <label class="input-label"><span>النطاق</span>
          <select name="storeId">
            <option value="" ${!editing || !editing.store_id ? "selected" : ""}>عام — كل المتاجر</option>
            ${storeOptions}
          </select>
        </label>
        <label class="input-label"><span>نوع الخصم</span>
          <select name="discount_type">
            <option value="percent" ${!editing || editing.discount_type === "percent" ? "selected" : ""}>نسبة مئوية %</option>
            <option value="fixed" ${editing && editing.discount_type === "fixed" ? "selected" : ""}>مبلغ ثابت (ل.ت)</option>
            <option value="free_delivery" ${editing && editing.discount_type === "free_delivery" ? "selected" : ""}>توصيل مجاني</option>
          </select>
        </label>
        <label class="input-label"><span>قيمة الخصم</span><input name="value" type="number" min="0" step="1" inputmode="numeric" value="${editing ? Number(editing.value) || "" : ""}" placeholder="10"><small class="field-hint">للنسبة: 1-90. تُتجاهل مع «توصيل مجاني».</small></label>
        <label class="input-label"><span>أقصى خصم (للنسبة، اختياري)</span><input name="max_discount" type="number" min="0" step="1" value="${editing && editing.max_discount ? Number(editing.max_discount) : ""}" placeholder="100"></label>
        <label class="input-label"><span>الحد الأدنى للطلب (اختياري)</span><input name="min_subtotal" type="number" min="0" step="1" value="${editing && editing.min_subtotal ? Number(editing.min_subtotal) : ""}" placeholder="200"></label>
        <label class="input-label"><span>تاريخ الانتهاء (اختياري)</span><input name="ends_at" type="date" value="${endsVal}"></label>
        <label class="input-label"><span>حد الاستخدامات الكلي (اختياري)</span><input name="usage_limit" type="number" min="0" step="1" value="${editing && editing.usage_limit ? editing.usage_limit : ""}" placeholder="100"></label>
        <label class="input-label"><span>حد الاستخدام لكل عميل (اختياري)</span><input name="per_customer_limit" type="number" min="0" step="1" value="${editing && editing.per_customer_limit ? editing.per_customer_limit : ""}" placeholder="1"></label>
      </div>
      <button class="primary-button full" type="submit">${icon("check")} ${editing ? "حفظ التعديلات" : "إنشاء الكوبون"}</button>
    </form>
  `, "coupon-form-modal");
}

async function toggleAdminCoupon(id, active) {
  try {
    const r = await fetch("/api/notify-order?action=merchant-coupon-status", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ couponId: Number(id), active }) });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.ok === false) { showToast("تعذّر تحديث حالة الكوبون", ""); return; }
    const c = (state._adminCoupons?.list || []).find(x => Number(x.id) === Number(id));
    if (c) c.active = active;
    showToast(active ? "تم تفعيل الكوبون" : "تم إيقاف الكوبون", "success");
    render();
  } catch (e) { showToast("خطأ في الاتصال", ""); }
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
      <div class="cover-uploader" id="store-cover-preview"><img src="${escAttr(store.coverImage || store.image)}" alt=""></div>
      <input type="hidden" name="coverImage" value="${escAttr(store.coverImage || store.image || "")}">
      <div class="cover-uploader-actions">
        <label class="upload-tile compact">${icon("upload")}<span>رفع صورة من الجهاز</span><input type="file" id="store-cover-file" accept="image/jpeg,image/png,image/webp" hidden></label>
        <button type="button" class="secondary-button compact" data-action="clear-store-cover">${icon("close")} إزالة الصورة</button>
      </div>
      <div class="form-grid">
        <label><span>اسم المتجر</span><input name="storeName" required value="${escAttr(store.name || "")}"><small class="field-hint">يظهر في عنوان التبويب هكذا: «دكانجي - ${escAttr(store.name || "")}»</small></label>
        <label><span>رابط المتجر (slug)</span><input name="storeSlug" dir="ltr" placeholder="pasa-pizzeria" value="${escAttr(store.slug || "")}"><small class="field-hint">dukkanci.com.tr/store/${escAttr(storeParam(store))}${store.slug ? "" : " — رابط تلقائي؛ يمكنك تعيين رابط أوضح هنا"}</small></label>
        <label><span>التصنيف</span><select name="category">${[...new Set([store.category, ...storeCategoryNames(), ...stores.map(s => s.category)])].filter(Boolean).map(c => `<option ${c === store.category ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
        <label class="wide"><span>وصف قصير</span><textarea name="description">${escAttr(store.description || "")}</textarea></label>
        <label class="wide"><span>العنوان</span><input name="address" value="${escAttr(store.address || "")}"></label>
        <label><span>رقم واتساب الطلبات</span><input name="phone" dir="ltr" value="${escAttr(store.phone || "")}"></label>
        <label><span>أوقات العمل</span><input name="hours" value="${escAttr(store.hours || "")}"></label>
        <label><span>رسوم التوصيل الثابتة</span><input name="fixedFee" type="number" min="0" value="${deliverySettings.fixedFee}"></label>
        <label><span>الحد الأدنى للطلب (ل.ت)</span><input name="minOrder" type="number" min="0" value="${Number(store.minOrder) || 0}"></label>
        <label class="wide"><span>بيانات الحساب البنكي (للتحويل البنكي)</span><textarea name="bankDetails" placeholder="اسم صاحب الحساب&#10;اسم البنك&#10;IBAN: TR.. .. ..">${escAttr(store.bankDetails || "")}</textarea><small class="field-hint">تظهر هذه البيانات للعميل في صفحة الدفع عند اختياره «تحويل بنكي» لينسخها ويرسل الحوالة. اتركها فارغة إن كنت سترسل رقم الحساب يدوياً.</small></label>
        <div class="input-label wide">
          <span>طرق الدفع المقبولة في متجرك</span>
          <div class="form-check-group">
            <label class="form-check"><input type="checkbox" name="payCash" ${store.paymentMethods?.cash !== false ? "checked" : ""}><span>نقداً عند التسليم</span></label>
            <label class="form-check"><input type="checkbox" name="payCard" ${store.paymentMethods?.card !== false ? "checked" : ""}><span>بطاقة عند التسليم (POS مع المندوب)</span></label>
            <label class="form-check"><input type="checkbox" name="payBank" ${store.paymentMethods?.bank !== false ? "checked" : ""}><span>تحويل بنكي</span></label>
          </div>
          <small class="field-hint">اختر طريقة واحدة على الأقل. لن تظهر للعميل عند الدفع إلا الطرق المفعّلة هنا.</small>
        </div>
      </div>
      <section class="merchant-delivery-settings">
        <div class="merchant-delivery-settings__heading">
          <span class="merchant-delivery-settings__icon">${icon("map")}</span>
          <div><h3>التوصيل التلقائي حسب المسافة</h3><p>يُحسب سعر الطريق من المتجر إلى العميل ذهاباً وإياباً، بينما يظهر للعميل زمن الوصول في اتجاه واحد.</p></div>
          <label class="delivery-toggle"><input type="checkbox" name="distanceEnabled" ${deliverySettings.mode === "distance" ? "checked" : ""}><span></span><b>${deliverySettings.mode === "distance" ? "مفعّل" : "غير مفعّل"}</b></label>
        </div>
        <div class="distance-settings-fields ${deliverySettings.mode === "distance" ? "active" : ""}">
          <label><span>سعر الكيلومتر ذهاباً وإياباً</span><div class="input-with-unit"><input name="ratePerKm" type="number" min="10" max="40" step="1" value="${deliverySettings.ratePerKm}"><b>ل.ت / كم</b></div><small>القيمة المسموحة من 10 إلى 40 ليرة.</small></label>
          <label><span>مدة تجهيز الطلب</span><div class="input-with-unit"><input name="prepMinutes" type="number" min="5" max="120" step="5" value="${deliverySettings.prepMinutes}"><b>دقيقة</b></div></label>
          <label><span>أقصى مسافة ذهاباً وإياباً</span><div class="input-with-unit"><input name="maxRoundTripKm" type="number" min="5" max="200" value="${deliverySettings.maxRoundTripKm}"><b>كم</b></div></label>
          <div class="delivery-formula-preview"><small>مثال مباشر</small><strong><span id="delivery-example-distance">20</span> كم × <span id="delivery-example-rate">${deliverySettings.ratePerKm}</span> ل.ت = <b id="delivery-example-total">${20 * deliverySettings.ratePerKm} ل.ت</b></strong></div>
        </div>
        <div class="store-location-fields">
          <div><strong>${icon("pin")} موقع المتجر</strong><small>يُحفظ الموقع كنقطة بداية لجميع حسابات التوصيل.</small></div>
          <label><span>خط العرض</span><input name="storeLat" type="number" step="any" required value="${storeLocation?.lat ?? ""}"></label>
          <label><span>خط الطول</span><input name="storeLng" type="number" step="any" required value="${storeLocation?.lng ?? ""}"></label>
          <button type="button" class="secondary-button compact" data-action="capture-store-location">${icon("pin")} استخدام موقعي الحالي</button>
        </div>
        <p class="maps-integration-note">${icon("shield")} يتم إرسال الإحداثيات من الخادم إلى Google Routes API عند توفر مفتاح الخدمة، ولا يظهر المفتاح داخل الموقع.</p>
      </section>
      <section class="named-zones-section">
        <div class="card-heading">
          <div><h3>${icon("pin")} مناطق توصيل بسعر ثابت</h3><p>سعر ثابت لسكان مجمعات أو مناطق محددة — يُطبَّق تلقائياً عند ذكر اسم المنطقة في عنوان التوصيل.</p></div>
          <button type="button" class="secondary-button compact" data-action="add-zone">${icon("plus")} إضافة منطقة</button>
        </div>
        <div class="named-zones-list" id="named-zones-list">
          ${(deliverySettings.namedZones || []).map((z, i) => renderZoneRow(z, i)).join("")}
          ${!(deliverySettings.namedZones || []).length ? `<p class="zones-empty-hint">لا توجد مناطق خاصة بعد — اضغط «إضافة منطقة» لإضافة أول منطقة.</p>` : ""}
        </div>
        <div class="named-zones-guide"><small>${icon("info")} مثال: اسم المنطقة «برستيج بارك» — كلمات مطابقة: «برستيج بارك، prestige park» — السعر: 50 ل.ت</small></div>
      </section>
      <div class="form-actions"><button class="primary-button" type="submit">${icon("check")} حفظ التغييرات</button></div>
    </form>
  `;
}

// Phase 2 category-organizer manual overrides for the merchant's own store —
// same editor as adminStoreCategories, scope="merchant" (see categorySettingsEditorHTML).
function merchantStoreCategories() {
  const store = getMerchantStore();
  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>تصنيفات متجرك</h3><p>دكانجي يرتّب ويدمج تصنيفات منتجاتك تلقائياً في صفحة متجرك. يمكنك هنا تعديل ذلك يدوياً: دمج تصنيف صغير في آخر، منع دمجه تلقائياً، تثبيت ترتيب ظهوره، أو إخفاؤه عن الزوار مؤقتاً — دون حذف أو تعديل منتجاتك.</p></div></div>
      ${categorySettingsEditorHTML(store, "merchant")}
    </section>`;
}

// Arabic label + pill colour for each subscription status.
const SUBSCRIPTION_LABELS = {
  trialing: { text: "فترة تجريبية", pill: "green" },
  active:   { text: "اشتراك نشط",  pill: "green" },
  past_due: { text: "متأخر السداد", pill: "orange" },
  canceled: { text: "ملغى",        pill: "red" },
  expired:  { text: "منتهي",       pill: "red" },
  none:     { text: "غير مشترك",   pill: "gray" }
};

// Monthly store-subscription price (ل.ت) by store category. Matched loosely so
// variant/dynamic category names ("خضار وفواكه", "مطعم", "مكسرات وبهارات") still
// resolve. Each merchant only ever sees the price for THEIR category (rendered in
// merchantSubscription); the full table is admin-only (adminContentPlans).
const CATEGORY_SUBSCRIPTION = [
  [/سوبر|ماركت/, 4000],          // سوبر ماركت
  [/مطعم|مطاعم/, 4500],          // مطاعم
  [/حلوي/, 5000],                // حلويات
  [/خضار|فواكه/, 4000],          // خضار وفواكه
  [/ملحم|ملاحم|لحوم/, 4000],     // ملاحم
  [/عصير|عصائر/, 4500],          // عصائر
  [/مكسرات|بهارات|\bبن\b|قهوة/, 4500], // مكسرات وبهارات / بن
  [/مواد غذائية|متخصص|عسل/, 4500]      // مواد غذائية متخصصة
];
const DEFAULT_SUBSCRIPTION_PRICE = 4500;
function categorySubscriptionPrice(category) {
  const c = String(category || "");
  for (const [re, price] of CATEGORY_SUBSCRIPTION) if (re.test(c)) return price;
  return DEFAULT_SUBSCRIPTION_PRICE;
}
// Display rows for the admin-only category pricing table.
const CATEGORY_SUBSCRIPTION_ROWS = [
  ["سوبر ماركت", 4000], ["مطاعم", 4500], ["حلويات", 5000], ["خضار وفواكه", 4000],
  ["ملاحم", 4000], ["عصائر", 4500], ["مكسرات وبهارات / بن", 4500],
  ["مواد غذائية متخصصة", 4500]
];
// Per-category Whop checkout link — the renew/manage button on the merchant
// subscription page routes each store to the plan that matches its category.
const CATEGORY_WHOP = [
  [/سوبر|ماركت/, "https://whop.com/dukkanci/8c415d3c-5e54-4ccb-9940-7352d478a198"],
  [/مطعم|مطاعم/, "https://whop.com/dukkanci/060184ca-0461-45b4-8c1b-2f17ec45c15d"],
  [/حلوي/, "https://whop.com/dukkanci/8c1fef75-9735-4788-af41-df1e9778e795"],
  [/خضار|فواكه/, "https://whop.com/dukkanci/419a1dbf-dfd3-4391-a072-8a14889090b8"],
  [/ملحم|ملاحم|لحوم/, "https://whop.com/dukkanci/3dadae0f-34d6-4065-8d90-ac46f2c2264c"],
  [/عصير|عصائر/, "https://whop.com/dukkanci/ef5f6541-0986-45a2-ae55-8bf726a36908"],
  [/مكسرات|بهارات|\bبن\b|قهوة/, "https://whop.com/dukkanci/2b72111c-3a03-4dd8-b180-45fa11f632fd"]
];
function categoryWhopUrl(category) {
  const c = String(category || "");
  for (const [re, url] of CATEGORY_WHOP) if (re.test(c)) return url;
  return window.WHOP_CHECKOUT_URL || "https://whop.com/dukkanci/dukkanci-store-subscription/";
}
function formatSubDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  try { return d.toLocaleDateString("ar-EG-u-nu-latn", { year: "numeric", month: "long", day: "numeric" }); }
  catch (e) { return d.toISOString().slice(0, 10); }
}

function merchantSubscription() {
  const store = getMerchantStore() || {};
  const status = store.subscriptionStatus || "none";
  const meta = SUBSCRIPTION_LABELS[status] || SUBSCRIPTION_LABELS.none;
  const active = store.subscriptionActive !== false && status !== "expired" && status !== "canceled";
  const whopUrl = categoryWhopUrl(store.category); // per-category Whop checkout link

  const p = (state.siteSettings && state.siteSettings.plan) || {};
  const name = p.name || "اشتراك متجر دكانجي";
  const tagline = p.tagline || "كل الأدوات التي تحتاجها لتنمية متجرك واستقبال طلبات بلا حدود.";
  // Price is fixed per store category and billed MONTHLY only. Each merchant sees
  // only their own category's price — never the other categories' figures.
  const catLabel = store.category || "متجر";
  const price = categorySubscriptionPrice(store.category).toLocaleString("ar");
  const period = "ل.ت / شهرياً";
  const features = (Array.isArray(p.features) && p.features.length) ? p.features
    : ["تجربة مجانية ٧ أيام", "استقبال طلبات غير محدودة", "رفع المنتجات عبر CSV", "عروض وخصومات", "تقارير شهرية عبر واتساب", "ظهور مميز في نتائج البحث"];

  // Whichever date matters now: trial end while trialing, else the renewal date.
  const endIso = (status === "trialing" && store.trialEndsAt) ? store.trialEndsAt : store.currentPeriodEnd;
  const endLabel = status === "trialing" ? "تنتهي التجربة" : "تاريخ التجديد";

  const renewLabel = active ? "إدارة الاشتراك" : "تجديد الاشتراك الآن";
  const banner = active ? "" : `
    <div class="review-note" style="margin-bottom:16px">${icon("shield")} <span><strong>اشتراك متجرك غير مفعّل — لا يستقبل المتجر طلبات جديدة حالياً.</strong><small>جدّد اشتراكك عبر الزر أدناه ليعود متجرك للعمل فوراً.</small></span></div>`;

  return `
    ${banner}
    <div class="subscription-hero dashboard-card">
      <div><span class="status-pill ${meta.pill}">${meta.text}</span><h2>${escAttr(name)}</h2><p>${escAttr(tagline)}</p><span class="sub-cat-chip">${icon("store")} باقة ${esc(catLabel)}</span></div>
      <div class="subscription-price"><strong>${escAttr(String(price))}</strong><span>${escAttr(period)}</span></div>
    </div>
    <div class="subscription-details">
      <section class="dashboard-card"><h3>تفاصيل الاشتراك</h3>
        <div class="detail-list">
          <span><small>الحالة</small><strong>${meta.text}</strong></span>
          <span><small>الباقة</small><strong>${esc(catLabel)}</strong></span>
          <span><small>السعر الشهري</small><strong>${escAttr(String(price))} ل.ت / شهرياً</strong></span>
          <span><small>${endLabel}</small><strong>${formatSubDate(endIso)}</strong></span>
          <span><small>التجديد</small><strong>تلقائي عبر Whop</strong></span>
          <span><small>طريقة الدفع</small><strong>Whop (بطاقة)</strong></span>
        </div>
        <a class="primary-button full" href="${escAttr(whopUrl)}" target="_blank" rel="noopener">${renewLabel}</a>
      </section>
      <section class="dashboard-card"><h3>مزايا خطتك</h3><ul class="feature-list">${features.map(f => `<li>${icon("check")} ${escAttr(f)}</li>`).join("")}</ul></section>
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

// SECURE merchant login (item 2): authenticate the OWNER via Supabase Auth — a
// one-time code sent to the store's WhatsApp/SMS number, or Google. Knowing a
// store's public number is no longer enough; you must RECEIVE the code on it.
// Left-hand brand panel shown beside every /merchant auth-screen state (login,
// "checking your account…", "no store linked"). Before this, the route rendered
// nothing but the bare card on an empty page — .dashboard-view hides the site
// header/footer/nav on this route, so merchants landed on what looked like an
// unstyled form. The store count is real, live data read from the same `stores`
// array the rest of the site renders from — never a made-up number.
function merchantAuthAsideHTML() {
  const liveCount = stores.filter(isStoreApproved).length;
  const points = [
    { icon: "bell", title: "إشعار فوري بكل طلب", text: "صوت تنبيه وإشعار لحظي على موبايلك أو حاسوبك مع كل طلب جديد." },
    { icon: "store", title: "تحكّم كامل بمتجرك", text: "أضف منتجاتك وحدّث الأسعار والعروض في أي وقت تريد." },
    { icon: "bike", title: "توصيل بشروطك", text: "حدّد نطاق التوصيل وسعره لكل كيلومتر بما يناسب متجرك." },
    { icon: "whatsapp", title: "دعم مباشر عبر واتساب", text: "فريق دكانجي معك من أول خطوة حتى استقبال أول طلب." }
  ];
  return `
    <aside class="merchant-portal__aside">
      <span class="merchant-portal__blob merchant-portal__blob--1" aria-hidden="true"></span>
      <span class="merchant-portal__blob merchant-portal__blob--2" aria-hidden="true"></span>
      <div class="merchant-portal__aside-inner">
        <span class="brand-mark merchant-portal__mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span>
        <h1>دكانجي للتجار</h1>
        <p class="merchant-portal__lead">لوحة تحكّم واحدة لإدارة طلبات متجرك ومنتجاتك وتوصيلك، بلا تعقيد.</p>
        ${liveCount > 0 ? `<div class="merchant-portal__stat">${icon("store")}<span><strong>+${liveCount}</strong> متجر يبيع على دكانجي الآن</span></div>` : ""}
        <ul class="merchant-portal__points">
          ${points.map((p, i) => `<li style="--i:${i}"><span class="merchant-portal__point-icon">${icon(p.icon)}</span><div><strong>${p.title}</strong><span>${p.text}</span></div></li>`).join("")}
        </ul>
      </div>
    </aside>
  `;
}

function merchantAuthShell(cardMarkup) {
  return `<div class="merchant-portal">${merchantAuthAsideHTML()}${cardMarkup}</div>`;
}

function merchantLogin() {
  // Secondary, flag-gated path: WhatsApp-OTP login (kept for when the service is live).
  if (state.merchantLoginMode === "otp" && AUTH_FLAGS.phoneOtpLogin) {
    return merchantAuthShell(`
    <div class="merchant-auth">
      <form class="merchant-auth__card" id="login-form">
        <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
        <h2>دخول برمز واتساب</h2>
        <p>سجّل الدخول برقم واتساب متجرك. سنرسل رمز تحقّق إلى الرقم — معرفة الرقم وحدها لا تكفي للدخول.</p>
        <label class="input-label"><span>رقم واتساب المتجر</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+90 555 000 00 00" dir="ltr"></label>
        <p class="auth-error" id="login-error" hidden></p>
        <button class="primary-button full large" type="submit">${icon("whatsapp")} إرسال رمز التحقق</button>
        <div class="merchant-auth__divider"><span>أو</span></div>
        <button type="button" class="secondary-button full" data-action="merchant-email">${icon("store")} دخول بالبريد وكلمة المرور</button>
        <button type="button" class="secondary-button full" data-action="merchant-google">متابعة عبر Google</button>
      </form>
    </div>
  `);
  }
  // Secondary path: admin-issued credentials — username = store mobile number,
  // password generated by the admin and handed over after the subscription is paid.
  if (state.merchantLoginMode === "admin") {
    return merchantAuthShell(`
    <div class="merchant-auth">
      <form class="merchant-auth__card" id="merchant-pw-form">
        <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
        <h2>أهلاً بكم في شاشة التحكم بالمتاجر</h2>
        <p>سجّل الدخول برقم موبايل متجرك وكلمة المرور التي زوّدتك بها إدارة دكانجي.</p>
        <label class="input-label"><span>اسم المستخدم (رقم الموبايل أو البريد)</span><div class="field-icon"><input name="username" type="text" inputmode="email" autocomplete="username" required placeholder="05XX XXX XX XX أو you@example.com" dir="ltr"><span class="field-icon__box">${icon("phone")}</span></div></label>
        <label class="input-label"><span>كلمة المرور</span><div class="pw-input"><input name="password" type="password" autocomplete="current-password" required placeholder="••••••••" dir="ltr"><button type="button" class="pw-toggle" data-action="toggle-password" aria-label="إظهار كلمة المرور">${icon("eye")}</button></div></label>
        <p class="auth-error" id="merchant-pw-error" role="alert" hidden></p>
        <button class="primary-button full large" type="submit">${icon("shield")} دخول</button>
        <div class="merchant-auth__divider"><span>طرق دخول أخرى</span></div>
        <button type="button" class="secondary-button full" data-action="merchant-email">${icon("store")} دخول بحساب بريد إلكتروني (Google)</button>
        <button type="button" class="secondary-button full" data-action="join-merchant">${icon("plus")} ليس لديك متجر؟ أنشئ متجرك الآن</button>
        <div class="merchant-auth__note">${icon("whatsapp")}<div><strong>لم تستلم بياناتك أو تحتاج مساعدة؟</strong><a class="merchant-auth__wa-link" href="https://wa.me/905528000220" target="_blank" rel="noopener" dir="ltr">+90 552 800 02 20</a></div></div>
      </form>
    </div>
  `);
  }
  // Default: self-serve email + password (or Google). Sign in or create an account.
  const signup = state.merchantEmailMode === "signup";
  return merchantAuthShell(`
    <div class="merchant-auth">
      <form class="merchant-auth__card" id="email-auth-form" data-mode="${signup ? "signup" : "signin"}">
        <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
        <h2>لوحة المتجر</h2>
        <p>${signup ? "أنشئ حساب متجرك ببريدك الإلكتروني، ثم أكمل بيانات المتجر." : "سجّل الدخول بالبريد الإلكتروني وكلمة المرور، أو عبر Google."}</p>
        <button type="button" class="google-button" data-action="merchant-google"><b>G</b> المتابعة باستخدام Google</button>
        <div class="merchant-auth__divider"><span>أو بالبريد الإلكتروني</span></div>
        ${signup ? `<label class="input-label"><span>اسم صاحب المتجر</span><input name="name" autocomplete="name" placeholder="الاسم الكامل"></label>` : ""}
        <label class="input-label"><span>البريد الإلكتروني</span><input name="email" type="email" inputmode="email" autocomplete="email" required dir="ltr" placeholder="you@example.com"></label>
        <label class="input-label"><span>كلمة المرور</span><div class="pw-input"><input name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" required dir="ltr" placeholder="${signup ? "٦ أحرف على الأقل" : "••••••••"}"><button type="button" class="pw-toggle" data-action="toggle-password" aria-label="إظهار كلمة المرور">${icon("eye")}</button></div></label>
        <p class="auth-error" id="email-auth-error" role="alert" hidden></p>
        ${signup ? "" : `<button type="button" class="text-button auth-forgot" data-action="forgot-password">نسيت كلمة المرور؟</button>`}
        <button class="primary-button full large" type="submit">${signup ? "إنشاء الحساب" : "تسجيل الدخول"}</button>
        <p class="auth-switch">${signup ? `لديك حساب؟ <button type="button" class="text-button" data-action="merchant-email-signin">سجّل الدخول</button>` : `ليس لديك حساب؟ <button type="button" class="text-button" data-action="merchant-email-signup">أنشئ حساباً</button>`}</p>
        <div class="merchant-auth__divider"><span>ليس لديك متجر بعد؟</span></div>
        <button type="button" class="secondary-button full" data-action="join-merchant">${icon("plus")} أنشئ متجرك الآن</button>
        <button type="button" class="text-button" data-action="merchant-admin-login">${icon("shield")} دخول المتاجر المُفعّلة بكلمة مرور الإدارة</button>
      </form>
    </div>
  `);
}

// Server-verified merchant login with admin-issued phone+password. On success we
// store a local merchant session (the server already checked password +
// subscription) and drop the owner into their dashboard.
async function submitMerchantPwLogin(form) {
  const f = new FormData(form);
  const username = (f.get("username") || "").toString().trim();
  const password = (f.get("password") || "").toString();
  const errEl = document.getElementById("merchant-pw-error");
  const btn = form.querySelector('button[type="submit"]');
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  if (errEl) errEl.hidden = true;
  if (!username || !password) return showErr("أدخل اسم المستخدم وكلمة المرور");
  if (btn) { btn.disabled = true; btn._label = btn.textContent; btn.textContent = "جارٍ التحقق…"; }
  const restore = () => { if (btn) { btn.disabled = false; btn.textContent = btn._label || "دخول"; } };
  try {
    const res = await fetch("/api/notify-order?action=store-login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      const map = {
        "bad-credentials": "اسم المستخدم أو كلمة المرور غير صحيحة",
        "subscription-inactive": "اشتراك متجرك غير مفعّل حالياً. جدّد الاشتراك ثم حاول مجدداً.",
        "missing-credentials": "أدخل اسم المستخدم وكلمة المرور"
      };
      showErr(map[data.error] || "تعذّر تسجيل الدخول. حاول مجدداً.");
      return restore();
    }
    const ids = data.multi ? data.stores.map(s => Number(s.id)) : [Number(data.store_id)];
    state.merchantPwAuth = { storeIds: ids, username, token: data.token || null };
    localStorage.setItem("dukkanci-merchant-session", JSON.stringify(state.merchantPwAuth));
    state._merchantResolved = false; state._merchantOrdersFetched = false;
    state.merchantStoreId = ids[0]; state.merchantTab = "overview";
    // Auto-enable new-order push notifications now (login is a user gesture, so the
    // permission prompt is allowed). Quiet on failure.
    if (data.token) autoEnablePush({ role: "store", storeId: ids[0], token: data.token });
    // Login no longer blocks on subscription — warn (don't block) when the store
    // (or every matched branch) is not subscription-active. Order intake stays
    // gated by the subscription logic elsewhere; this just lets the owner in.
    const inactive = data.multi
      ? data.stores.every(s => s.subscription_active === false)
      : data.subscription_active === false;
    if (inactive) {
      showToast("تم الدخول. تنبيه: اشتراك متجرك غير مفعّل — لن تستقبل طلبات جديدة حتى تجديد الاشتراك.", "warning");
    } else {
      showToast("مرحباً بك في لوحة متجرك", "success");
    }
    navigate("merchant");
  } catch (e) {
    showErr("تعذّر الاتصال بالخادم. تحقّق من اتصالك ثم حاول مجدداً.");
    restore();
  }
}

// Resolve which store(s) the signed-in user may manage. Preferred source is the
// store_users ownership table (added in the security migration). Until a user is
// linked there, we fall back to matching the user's VERIFIED auth phone to a
// store's number — still secure, because the phone was proven via the OTP.
async function resolveMerchantStores() {
  const sb = window.supabaseClient;
  const user = state.user;
  if (!user) return [];
  const norm = s => (s || "").replace(/\D/g, "");
  let owned = [];
  if (sb) {
    try {
      const { data, error } = await sb.from("store_users").select("store_id").eq("user_id", user.id);
      if (!error && Array.isArray(data) && data.length) {
        const ids = data.map(r => Number(r.store_id));
        owned = stores.filter(s => ids.includes(Number(s.id)));
      }
    } catch (e) { /* store_users table not present yet (pre-migration) */ }
  }
  if (!owned.length && user.phone) {
    const p = norm(user.phone);
    const variants = new Set([p, p.replace(/^90/, ""), "90" + p.replace(/^90/, "")]);
    owned = stores.filter(s => variants.has(norm(s.phone)) || variants.has(norm(s.whatsapp)));
  }
  return owned;
}

function merchantResolving() {
  return merchantAuthShell(`<div class="merchant-auth"><div class="merchant-auth__card"><div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div><h2>جارٍ التحقق…</h2><p>نتحقّق من المتجر المرتبط بحسابك.</p><div class="merchant-auth__spinner" aria-hidden="true"></div></div></div>`);
}

function merchantNoStore() {
  return merchantAuthShell(`<div class="merchant-auth"><form class="merchant-auth__card">
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>لا يوجد متجر مرتبط بحسابك</h2>
    <p>لم نعثر على متجر مرتبط برقمك. أنشئ متجرك، أو تواصل مع الدعم لربط متجرك القائم بحسابك.</p>
    <button type="button" class="primary-button full large" data-action="join-merchant">${icon("plus")} أنشئ متجرك الآن</button>
    <button type="button" class="secondary-button full" data-action="merchant-logout">${icon("logout")} تسجيل الخروج</button>
    <div class="merchant-auth__note">${icon("whatsapp")}<div><strong>لربط متجر قائم بحسابك؟</strong><a class="merchant-auth__wa-link" href="https://wa.me/905528000220" target="_blank" rel="noopener" dir="ltr">+90 552 800 02 20</a></div></div>
  </form></div>`);
}

// Link the signed-in user as the owner of a store in store_users so RLS lets
// them manage it. Best-effort: the DB trigger also binds on insert, and the
// table may not exist before the security migration runs.
async function bindStoreToUser(storeId) {
  const sb = window.supabaseClient;
  if (!sb || !state.user) return;
  try { await sb.from("store_users").upsert({ user_id: state.user.id, store_id: storeId, role: "owner" }); }
  catch (e) { /* store_users not present yet, or already linked */ }
}

// True once this device has opened the dedicated merchant PWA (merchant-app.html
// sets this flag). Used to force the phone+password login screen there even when
// a leftover customer Supabase session exists on the same device/browser.
function isMerchantPwaContext() {
  try { if (localStorage.getItem("dk-merchant-app") === "1") return true; } catch (e) {}
  // Fallback for merchant apps installed before this flag existed: any installed
  // (standalone) window landing on /merchant behaves the same way — a real app
  // icon should never silently piggyback on a leftover customer session.
  try {
    var standalone = !!(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
    if (!standalone && window.navigator && window.navigator.standalone === true) standalone = true;
    return standalone;
  } catch (e) { return false; }
}
function hasMerchantGoogleIntent() {
  try { return localStorage.getItem("dukkanci-merchant-google-intent") === "1"; } catch (e) { return false; }
}

function renderMerchant(id) {
  // Admin-issued phone+password session: the server already verified the password
  // and active subscription, so resolve straight to the store(s) it logged into —
  // no Supabase session / store_users lookup needed.
  if (state.merchantPwAuth) {
    // If the stored session predates the token system (old localStorage entry), force re-login
    // so a fresh token is issued and order reads/writes work correctly.
    if (!state.merchantPwAuth.token) {
      state.merchantPwAuth = null;
      localStorage.removeItem("dukkanci-merchant-session");
      return merchantLogin();
    }
    if (!state._merchantResolved) {
      const ids = state.merchantPwAuth.storeIds || [];
      const owned = ids.map(getStore).filter(Boolean);
      if (!owned.length) return merchantResolving(); // stores not loaded yet
      state.merchantStores = owned;
      state.merchantStoreId = owned.some(s => s.id === state.merchantStoreId) ? state.merchantStoreId : owned[0].id;
      state.merchantAuth = { storeId: state.merchantStoreId, phone: state.merchantPwAuth.username };
      state._merchantResolved = true;
    }
  } else {
  // Must be authenticated (Supabase session) — no more public phone-number login.
  // Inside the dedicated merchant PWA, don't silently auto-resolve via a leftover
  // customer Supabase session on the same device — always show the phone+password
  // screen first unless the merchant explicitly chose Google/email this visit.
  const blockedByMerchantPwaGate = isMerchantPwaContext() && state.merchantLoginMode === "admin"
    && !hasMerchantGoogleIntent() && !state._merchantResolved;
  if (!state.user || blockedByMerchantPwaGate) return merchantLogin();
  if (!state._merchantResolved) {
    if (!state._merchantResolving) {
      state._merchantResolving = true;
      resolveMerchantStores().then(list => {
        state.merchantStores = list;
        state._merchantResolved = true;
        state._merchantResolving = false;
        if (list[0]) {
          state.merchantAuth = { storeId: list[0].id, phone: (state.user.phone || "").replace(/\D/g, ""), userId: state.user.id };
          state.merchantStoreId = list[0].id;
          // Auto-enable new-order push for Supabase-session merchants (Google/email/
          // OTP) — the server verifies store ownership via the access token. Runs once
          // per session (guarded by _merchantResolved). Silent re-subscribe if already
          // granted; prompts where the browser allows it.
          autoEnablePush({ role: "store", storeId: list[0].id, supabase: true });
        }
        render();
      });
    }
    return merchantResolving();
  }
  }
  if (!state.merchantStores || !state.merchantStores.length) return merchantNoStore();
  state.merchantStoreId = Number(id) || state.merchantStoreId || state.merchantAuth?.storeId || (state.merchantStores[0] && state.merchantStores[0].id);
  // Pull this store's orders from the cloud once per session so the merchant sees
  // orders placed from any device (not just this browser).
  if (!state._merchantOrdersFetched) {
    state._merchantOrdersFetched = true;
    loadOrdersFromSupabase(state.merchantStoreId).then(ok => { if (ok) render(); });
  }
  const store = getMerchantStore();
  // Live tabs → their real renderers; everything else (planned/requires_setup
  // sections) falls through to an honest merchantComingSoon() — so a new sidebar
  // key can never throw here (spec §3/§24).
  const content = ({
    overview: merchantOverview,
    orders: merchantOrders,
    products: merchantProducts,
    offers: merchantOffers,
    store: merchantStore,
    storeCategories: merchantStoreCategories,
    analytics: merchantAnalytics,
    integrations: merchantIntegrations,
    subscription: merchantSubscription,
    share: merchantShare,
    images: merchantImages,
    search: merchantSearch,
    audit: merchantAudit,
    customers: merchantCustomers,
    catalog: merchantCatalog,
    support: merchantSupport
  }[state.merchantTab] || (() => merchantComingSoon(state.merchantTab)))();
  const titles = { overview: [`مرحباً، ${store.name}`, "إليك ملخص أداء متجرك اليوم"], orders: ["إدارة الطلبات", "تابع الطلبات وعدّل حالاتها"], products: ["المنتجات والمنيو", "حدّث الأسعار والتوفر وأضف منتجاتك"], offers: ["كودات الخصم", "اجذب عملاء أكثر بعروض وكودات مميزة"], store: ["إعدادات المتجر", "حدّث معلومات متجرك ومناطق الخدمة"], storeCategories: ["تصنيفات متجرك", "دمج/ترتيب يدوي لتصنيفات منتجاتك فوق الترتيب التلقائي"], analytics: ["التقارير والتحليلات", "زوّار متجرك ومنتجاتك ومعدلات التحويل ومصادر الزيارات"], integrations: ["التكاملات", "بكسلات التتبّع وأدوات جوجل للتحليلات والإعلانات"], subscription: ["اشتراك المتجر", "تابع خطتك وجدّد اشتراكك"], share: ["رابط متجرك", "شارك متجرك في كل مكان بضغطة واحدة"], images: ["الصور والتحسين بالذكاء الصناعي", "حسّن صور منتجاتك — والأصل محفوظ ويمكن استرجاعه دائماً"], search: ["البحث والمرادفات", "اجعل منتجاتك تظهر مهما اختلفت تسمية العميل ولهجته"], audit: ["سجل التعديلات", "كل تعديل على متجرك — من فعل ماذا ومتى"], customers: ["عملاء متجرك", "اعرف عملاءك الجدد والمتكررين وتواصل معهم"], catalog: ["كتالوجات ميتا", "اربط منتجاتك بفيسبوك وإنستغرام عبر رابط Feed جاهز"], support: ["الدعم الفني", "أجوبة سريعة وتواصل مباشر مع فريق دكانجي"] };
  const _sec = merchantSection(state.merchantTab);
  const [title, subtitle] = titles[state.merchantTab] || [(_sec && _sec[2]) || "لوحة المتجر", "قيد التطوير — قريباً في لوحتك"];
  // Ring + nudge for new/pending orders while the dashboard stays open.
  startMerchantOrderWatch();
  // Load the notification feed once per session (badge in the header bell).
  loadMerchantNotifications();
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
            ${(() => {
              // A merchant only manages the store(s) linked to their account.
              const owned = (state.merchantStores && state.merchantStores.length) ? state.merchantStores : [store];
              const list = owned.length ? owned : [store];
              return list.length > 1
                ? `<label class="store-switcher" title="اختر فرعك">${icon("store")}<select id="merchant-store-switch">${list.sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s => `<option value="${s.id}" ${s.id === store.id ? "selected" : ""}>${s.name}</option>`).join("")}</select></label>`
                : `<span class="store-switcher store-switcher--single">${icon("store")} ${escAttr(store.name)}</span>`;
            })()}
            <span class="dashboard-date">${icon("calendar")} ${dashboardDate()}</span>
            <button class="icon-button notif-bell" data-action="merchant-notifications" aria-label="الإشعارات" title="الإشعارات">${icon("bell")}${(state._merchantNotifsUnread || 0) > 0 ? `<b class="notif-count">${state._merchantNotifsUnread > 9 ? "9+" : state._merchantNotifsUnread.toLocaleString("ar")}</b>` : ""}</button>
            <button class="icon-button" data-action="merchant-enable-push" aria-label="تفعيل إشعارات الطلبات الجديدة" title="تفعيل إشعارات الطلبات الجديدة">${icon("bell")}<b></b></button>
            <button class="view-store" data-action="open-store" data-id="${store.id}">${icon("eye")} عرض المتجر</button>
            <button class="icon-button" data-action="merchant-logout" aria-label="تسجيل الخروج" title="تسجيل الخروج">${icon("logout")}</button>
          </div>
        </header>
        ${merchantAlertBanner()}
        <div class="dashboard-content">${content}</div>
      </main>
    </div>
  `;
}

// ---- Admin overview analytics (dependency-free, dataset = state.orders) ----
// state.orders is the full platform order set (loaded once per admin session in
// renderAdmin). Charts are plain divs styled by styles.css — no chart library.

function analyticsRangeLabel() {
  const d = state.adminAnalyticsRange || 0;
  return d ? `آخر ${d.toLocaleString("ar")} يوماً` : "كل الفترات";
}

// Orders inside the selected window, each tagged with a parsed timestamp (_t).
function analyticsOrders() {
  const days = state.adminAnalyticsRange || 0;
  const cutoff = days ? Date.now() - days * 86400000 : 0;
  return state.orders
    .map(o => ({ ...o, _t: Date.parse(o.createdAt || "") || 0 }))
    .filter(o => !cutoff || (o._t && o._t >= cutoff));
}

// Split the window into ~12 equal time buckets → [{from,label,orders,revenue}].
function analyticsBuckets(orders) {
  const days = state.adminAnalyticsRange || 0;
  const now = Date.now();
  let start, span;
  if (days) { span = days * 86400000; start = now - span; }
  else {
    const earliest = orders.reduce((m, o) => (o._t && o._t < m ? o._t : m), now);
    start = earliest; span = Math.max(now - earliest, 86400000);
  }
  const bucketMs = Math.max(1, Math.ceil((span / 86400000) / 12)) * 86400000;
  const count = Math.max(1, Math.ceil(span / bucketMs));
  const buckets = Array.from({ length: count }, (_, i) => ({ from: start + i * bucketMs, orders: 0, revenue: 0 }));
  orders.forEach(o => {
    if (!o._t) return;
    let i = Math.floor((o._t - start) / bucketMs);
    if (i < 0) i = 0; if (i >= count) i = count - 1;
    buckets[i].orders += 1; buckets[i].revenue += o.total || 0;
  });
  const fmt = new Intl.DateTimeFormat("ar-EG", bucketMs >= 28 * 86400000 ? { month: "short" } : { day: "numeric", month: "short" });
  return buckets.map(b => ({ ...b, label: fmt.format(new Date(b.from)) }));
}

function niceCeil(n) {
  if (n <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  const f = n / mag;
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * mag;
}

function shortNum(n) {
  n = Math.round(n);
  if (n >= 1000000) return (n / 1000000).toLocaleString("ar", { maximumFractionDigits: 1 }) + "م";
  if (n >= 1000) return (n / 1000).toLocaleString("ar", { maximumFractionDigits: 1 }) + "ألف";
  return n.toLocaleString("ar");
}

// Vertical bar chart reusing the existing .chart-wrap / .chart-y / .bar-chart CSS.
function analyticsBarChart(buckets, metric) {
  const max = Math.max(1, ...buckets.map(b => (metric === "revenue" ? b.revenue : b.orders)));
  const top = niceCeil(max);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map(r => metric === "revenue" ? shortNum(top * r) : Math.round(top * r).toLocaleString("ar"));
  const bars = buckets.map(b => {
    const v = metric === "revenue" ? b.revenue : b.orders;
    const h = Math.round((v / top) * 150);
    const title = `${b.label}: ${b.orders.toLocaleString("ar")} طلب · ${b.revenue.toLocaleString("ar")} ل.ت`;
    return `<div title="${escAttr(title)}"><span style="height:${h}px"></span><small>${escAttr(b.label)}</small></div>`;
  }).join("");
  return `<div class="chart-wrap"><div class="chart-y">${yTicks.map(t => `<span>${t}</span>`).join("")}</div><div class="bar-chart">${bars}</div></div>`;
}

// Horizontal bar list (top stores / products). items = [{label, value}].
function analyticsHBars(items, fmt) {
  if (!items.length) return `<div class="empty-managed">${icon("chart")}<p>لا توجد بيانات بعد.</p></div>`;
  const max = Math.max(1, ...items.map(i => i.value));
  return `<ul class="hbar-list">${items.map(i => `<li><div class="hbar-row"><span class="hbar-label">${escAttr(i.label)}</span><b>${fmt(i.value)}</b></div><div class="hbar-track"><span style="width:${Math.max(3, Math.round((i.value / max) * 100))}%"></span></div></li>`).join("")}</ul>`;
}

function adminOverview() {
  const orders = analyticsOrders();
  const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const aov = orders.length ? Math.round(revenue / orders.length) : 0;
  const activeStores = new Set(orders.map(o => o.storeId)).size;
  const metric = state.adminAnalyticsMetric === "orders" ? "orders" : "revenue";
  const buckets = analyticsBuckets(orders);

  // Top stores by revenue.
  const byStore = {};
  orders.forEach(o => { const v = byStore[o.storeId] || (byStore[o.storeId] = { revenue: 0 }); v.revenue += o.total || 0; });
  const topStores = Object.entries(byStore)
    .map(([id, v]) => ({ label: (getStore(Number(id)) || {}).name || `متجر ${id}`, value: v.revenue }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  // Top products by quantity sold.
  const byProduct = {};
  orders.forEach(o => (o.lineItems || []).forEach(li => { const k = li.name || "—"; byProduct[k] = (byProduct[k] || 0) + (li.qty || 1); }));
  const topProducts = Object.entries(byProduct).map(([name, qty]) => ({ label: name, value: qty }))
    .sort((a, b) => b.value - a.value).slice(0, 6);

  // Order status distribution + fulfillment split.
  const byStatus = {};
  orders.forEach(o => { const k = o.status || "—"; byStatus[k] = (byStatus[k] || 0) + 1; });
  const statusRows = Object.entries(byStatus).sort((a, b) => b[1] - a[1]).map(([s, c]) => ({ label: s, value: c }));
  const deliveryCount = orders.filter(o => o.fulfillment === "delivery").length;
  const pickupCount = orders.length - deliveryCount;

  // Pending join requests (real data — this panel used to be hardcoded empty).
  const pending = stores.filter(s => (s.approvalStatus || "approved") === "pending");

  const recent = [...state.orders].sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0)).slice(0, 5);
  const rangeChips = [[7, "٧ أيام"], [30, "٣٠ يوماً"], [90, "٩٠ يوماً"], [0, "الكل"]]
    .map(([d, l]) => `<button class="range-chip ${state.adminAnalyticsRange === d ? "active" : ""}" data-action="admin-range" data-range="${d}">${l}</button>`).join("");

  return `
    <div class="analytics-toolbar"><span class="analytics-toolbar__label">${icon("calendar")} الفترة</span><div class="range-chips">${rangeChips}</div></div>
    <div class="stats-grid admin-stats">
      ${statCard("receipt", "الطلبات", orders.length.toLocaleString("ar"), analyticsRangeLabel(), "green")}
      ${statCard("wallet", "الإيرادات", `${revenue.toLocaleString("ar")} ل.ت`, orders.length ? "ضمن الفترة المحددة" : "لا طلبات", "orange")}
      ${statCard("chart", "متوسط قيمة الطلب", `${aov.toLocaleString("ar")} ل.ت`, orders.length ? `من ${orders.length.toLocaleString("ar")} طلب` : "—", "blue")}
      ${statCard("store", "متاجر نشطة", activeStores.toLocaleString("ar"), `من ${stores.length.toLocaleString("ar")} متجراً`, "yellow")}
    </div>
    <div class="dashboard-grid">
      <section class="dashboard-card chart-card">
        <div class="card-heading"><div><h3>اتجاه ${metric === "revenue" ? "الإيرادات" : "الطلبات"}</h3><p>${analyticsRangeLabel()}</p></div>
          <div class="metric-toggle"><button class="${metric === "revenue" ? "active" : ""}" data-action="admin-metric" data-metric="revenue">الإيرادات</button><button class="${metric === "orders" ? "active" : ""}" data-action="admin-metric" data-metric="orders">الطلبات</button></div></div>
        ${orders.length ? analyticsBarChart(buckets, metric) : `<div class="empty-managed">${icon("chart")}<p>لا توجد طلبات في هذه الفترة بعد.</p></div>`}
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>توزيع الحالات</h3><p>حالة الطلبات ونوع التسليم</p></div></div>
        ${orders.length ? `${analyticsHBars(statusRows, v => v.toLocaleString("ar"))}<div class="split-row"><span><small>توصيل</small><strong>${deliveryCount.toLocaleString("ar")}</strong></span><span><small>استلام</small><strong>${pickupCount.toLocaleString("ar")}</strong></span></div>` : `<div class="empty-managed">${icon("receipt")}<p>لا طلبات في هذه الفترة.</p></div>`}
      </section>
    </div>
    <div class="dashboard-grid two-col">
      <section class="dashboard-card"><div class="card-heading"><div><h3>أفضل المتاجر</h3><p>حسب الإيرادات · ${analyticsRangeLabel()}</p></div></div>${analyticsHBars(topStores, v => `${v.toLocaleString("ar")} ل.ت`)}</section>
      <section class="dashboard-card"><div class="card-heading"><div><h3>أفضل المنتجات</h3><p>حسب الكمية المباعة</p></div></div>${analyticsHBars(topProducts, v => `${v.toLocaleString("ar")}×`)}</section>
    </div>
    <div class="admin-panels">
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>طلبات انضمام جديدة</h3><p>تحتاج إلى المراجعة</p></div>${pending.length ? `<button class="text-button" data-action="admin-tab" data-tab="stores">عرض الكل ${icon("arrowLeft")}</button>` : ""}</div>
        ${pending.length ? `<div class="admin-store-list join-list">${pending.slice(0, 5).map(s => `<article>${storeAvatar(s)}<div><strong>${escAttr(s.name)}</strong><small>${escAttr(s.category)}</small></div><button class="table-action approve" data-action="store-approve" data-id="${s.id}" data-status="approved" title="قبول">${icon("check")}</button><button class="table-action danger" data-action="store-approve" data-id="${s.id}" data-status="rejected" title="رفض">${icon("close")}</button></article>`).join("")}</div>` : `<div class="empty-managed">${icon("store")}<p>لا توجد طلبات انضمام جديدة حالياً.</p></div>`}
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>أحدث الطلبات</h3><p>على مستوى المنصة</p></div><button class="text-button" data-action="admin-tab" data-tab="orders">عرض الكل ${icon("arrowLeft")}</button></div>
        ${recent.length ? renderOrdersTable(recent, "admin") : `<div class="empty-managed">${icon("receipt")}<p>لا طلبات بعد.</p></div>`}
      </section>
    </div>
  `;
}

// Customer-facing visibility: a store shows to customers only when approved.
// (Legacy stores with no status are treated as approved.) The server enforces
// this too via RLS once the lockdown migration is applied.
function isStoreApproved(store) {
  return !store.approvalStatus || store.approvalStatus === "approved";
}

function approvalPill(status) {
  const s = status || "approved";
  const map = {
    approved: ["green", "معتمد"],
    pending: ["amber", "بانتظار الموافقة"],
    rejected: ["red", "مرفوض"],
    suspended: ["gray", "معلّق"]
  };
  const [cls, label] = map[s] || map.approved;
  return `<span class="status-pill ${cls}">${label}</span>`;
}

function adminStores() {
  // Pending applications first so the admin sees them immediately.
  const order = { pending: 0, approved: 1, suspended: 2, rejected: 3 };
  const sorted = [...stores].sort((a, b) => (order[a.approvalStatus || "approved"] ?? 1) - (order[b.approvalStatus || "approved"] ?? 1));
  return `
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="admin-store-search" placeholder="ابحث باسم المتجر أو صاحبه"></div><div class="toolbar-actions"><button class="secondary-button compact" data-action="export-csv" data-kind="stores">${icon("download")} تصدير Excel</button></div></div>
    <section class="dashboard-card admin-store-list">
      ${sorted.map(store => {
        const st = store.approvalStatus || "approved";
        const actions = [
          st !== "approved" ? `<button class="table-action approve" data-action="store-approve" data-id="${store.id}" data-status="approved" title="قبول">${icon("check")}</button>` : "",
          st !== "suspended" && st === "approved" ? `<button class="table-action" data-action="store-approve" data-id="${store.id}" data-status="suspended" title="تعليق">${icon("clock")}</button>` : "",
          st !== "rejected" ? `<button class="table-action danger" data-action="store-approve" data-id="${store.id}" data-status="rejected" title="رفض">${icon("close")}</button>` : ""
        ].join("");
        return `<article>${storeAvatar(store)}<div><strong>${escAttr(store.name)}</strong><small>${escAttr(store.category)}${store.address && store.address.includes("،") ? " · " + escAttr(store.address.split("،").pop().trim()) : ""}</small></div>${approvalPill(st)}<span class="status-pill ${store.open ? "green" : "gray"}">${store.open ? "نشط" : "متوقف"}</span><span><small>الطلبات</small><strong>${(store.orderCount ?? 0).toLocaleString("ar")}</strong></span>${actions}<button class="table-action" data-action="open-store" data-id="${store.id}" aria-label="عرض المتجر">${icon("eye")}</button></article>`;
      }).join("")}
    </section>
  `;
}

// There's no separate customer-login table, so platform orders ARE the customer
// directory. Group every order under one customer key: the phone (canonicalized
// the same way checkout stores it, so "+90…"/"0090…"/"0…" variants of the same
// number merge) when present, otherwise the normalized name — so the same
// person's repeat orders collapse into a single row. Used by the tab, the detail
// modal, and CSV.
function customerPhoneDigits(o) {
  const digits = (o.customerPhone || "").replace(/\D/g, "");
  return digits ? normalizePhone(digits).replace(/\D/g, "") : ""; // → "90XXXXXXXXXX"
}
function customerKey(o) {
  const phone = customerPhoneDigits(o);
  if (phone) return phone;
  const name = (o.customer || "").trim();
  return name ? "n:" + normalizeAr(name) : "";
}

// Aggregate the order set into a customer directory. Optional storeId scopes it
// to one store's orders (merchant view §10); admin callers pass nothing (all).
function aggregateCustomers(storeId) {
  const map = new Map();
  (state.orders || []).forEach(o => {
    if (storeId != null && o.storeId !== storeId) return;
    const key = customerKey(o);
    if (!key) return; // order with neither name nor phone — can't attribute it
    const phone = customerPhoneDigits(o);
    const name = (o.customer || "").trim();
    let c = map.get(key);
    if (!c) { c = { key, name: name || "عميل بدون اسم", phone, total: 0, count: 0, stores: new Set(), firstAt: 0, lastAt: 0, lastTime: "", address: "" }; map.set(key, c); }
    c.count += 1;
    c.total += o.total || 0;
    if (o.storeId != null) c.stores.add(o.storeId);
    const t = Date.parse(o.createdAt || "") || 0;
    if (t && (!c.firstAt || t < c.firstAt)) c.firstAt = t;
    // Keep the most recent order's details (name/phone/address can change over time).
    if (t >= c.lastAt) {
      c.lastAt = t; c.lastTime = o.time || "";
      if (name) c.name = name;
      if (!c.phone && phone) c.phone = phone;
      if (o.address) c.address = o.address;
    }
  });
  return [...map.values()].sort((a, b) => b.lastAt - a.lastAt);
}

function adminCustomers() {
  if (state.adminCustomerDirectory === undefined) { state.adminCustomerDirectory = null; loadAdminCustomerDirectory(); }
  const customers = aggregateCustomers();
  const directory = Array.isArray(state.adminCustomerDirectory) ? state.adminCustomerDirectory : [];
  // Registered accounts (incl. Google-login sign-ups) that never placed an order —
  // match by phone against the order-derived rows so a registered customer who DID
  // order collapses into their existing row instead of appearing twice.
  const orderedPhones = new Set(customers.map(c => c.phone).filter(Boolean));
  const visitors = directory
    .filter(d => !d.orderCount && !(d.phone && orderedPhones.has(customerPhoneDigits({ customerPhone: d.phone }))))
    .map(d => ({
      key: "u:" + d.id, name: d.name || "بدون اسم", phone: customerPhoneDigits({ customerPhone: d.phone }) || d.phone || "",
      total: 0, count: 0, stores: new Set(), firstAt: Date.parse(d.createdAt) || 0, lastAt: Date.parse(d.lastActiveAt) || 0,
      lastTime: "", address: "", visitor: true, provider: d.provider === "google" ? "Google" : "بريد إلكتروني", email: d.email
    }));
  const all = [...customers, ...visitors].sort((a, b) => b.lastAt - a.lastAt);
  if (!all.length) {
    return `
      <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث بالاسم أو رقم الهاتف"></div></div>
      <section class="dashboard-card"><div class="empty-managed">${icon("users")}<p>لا يوجد عملاء بعد. ستظهر بيانات كل عميل (الاسم، الهاتف، طلباته وإنفاقه) تلقائياً بمجرد التسجيل أو ورود أول طلب.</p></div></section>`;
  }
  const totalOrders = customers.reduce((s, c) => s + c.count, 0);
  const totalRevenue = customers.reduce((s, c) => s + c.total, 0);
  const repeat = customers.filter(c => c.count > 1).length;
  const fmtDate = ms => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(ms)); } catch (e) { return ""; } };
  return `
    <div class="stats-grid admin-stats">
      ${statCard("users", "إجمالي العملاء", all.length.toLocaleString("ar"), repeat ? `${repeat.toLocaleString("ar")} عميل متكرّر` : "من واقع الطلبات والتسجيل", "blue")}
      ${statCard("receipt", "إجمالي الطلبات", totalOrders.toLocaleString("ar"), `بمعدل ${(totalOrders / customers.length).toLocaleString("ar", { maximumFractionDigits: 1 })} لكل عميل طلب`, "green")}
      ${statCard("wallet", "إجمالي الإنفاق", money(totalRevenue), "على مستوى المنصة", "orange")}
    </div>
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="admin-customer-search" placeholder="ابحث بالاسم أو رقم الهاتف"></div><div class="toolbar-actions"><button class="secondary-button compact" data-action="export-csv" data-kind="customers">${icon("download")} تصدير</button></div></div>
    <section class="dashboard-card customers-table-card">
      <div class="table-wrap">
        <table class="admin-table">
          <thead><tr><th>العميل</th><th>الهاتف</th><th>الحالة</th><th>الطلبات</th><th>إجمالي الإنفاق</th><th>المتاجر</th><th>آخر نشاط</th><th></th></tr></thead>
          <tbody>
            ${all.map(c => `
              <tr>
                <td><strong>${esc(c.name)}</strong>${c.email ? `<small class="cust-addr">${esc(c.email)}</small>` : (c.address ? `<small class="cust-addr">${esc(c.address)}</small>` : "")}</td>
                <td>${c.phone ? `<code dir="ltr">${esc(c.phone)}</code>` : `<span class="creds-muted">—</span>`}</td>
                <td>${c.visitor ? `<span class="status-pill gray">زائر مسجّل (${esc(c.provider)})</span>` : `<span class="status-pill green">عميل</span>`}</td>
                <td>${c.count.toLocaleString("ar")}</td>
                <td><strong>${money(c.total)}</strong></td>
                <td>${c.stores.size.toLocaleString("ar")}</td>
                <td>${c.lastAt ? fmtDate(c.lastAt) : esc(c.lastTime)}</td>
                <td class="creds-actions">
                  ${c.phone ? `<a class="table-action" href="https://wa.me/${c.phone}" target="_blank" rel="noopener" title="مراسلة عبر واتساب">${icon("whatsapp")}</a>` : ""}
                  ${c.visitor ? "" : `<button class="table-action" data-action="view-customer" data-key="${escAttr(c.key)}" title="عرض ملف العميل وطلباته">${icon("eye")}</button>`}
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </section>`;
}

// Customer profile modal: contact + their full order history (reuses the admin
// orders table so each row opens the order manager).
function openCustomerDetail(key) {
  const c = aggregateCustomers().find(x => x.key === key);
  if (!c) return;
  const orders = state.orders
    .filter(o => customerKey(o) === key)
    .sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));
  const storeNames = [...c.stores].map(id => (getStore(Number(id)) || {}).name || ("متجر " + id));
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">ملف العميل</span><h2>${esc(c.name)}</h2>
    <div class="order-manager-summary">
      <span><small>الطلبات</small><strong>${c.count.toLocaleString("ar")}</strong></span>
      <span><small>إجمالي الإنفاق</small><strong>${money(c.total)}</strong></span>
      <span><small>متوسط الطلب</small><strong>${money(c.count ? Math.round(c.total / c.count) : 0)}</strong></span>
    </div>
    <div class="order-contact">
      ${c.phone ? `<div class="order-contact__row">${icon("phone")}<span dir="ltr">${esc(c.phone)}</span><a class="order-wa-btn" href="https://wa.me/${c.phone}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة العميل</a></div>` : `<div class="order-contact__row order-contact__row--muted">${icon("phone")}<span>لا يوجد رقم تواصل</span></div>`}
      ${c.address ? `<div class="order-contact__row">${icon("pin")}<span>${esc(c.address)}</span></div>` : ""}
      ${storeNames.length ? `<div class="order-contact__row">${icon("store")}<span>طلب من: ${storeNames.map(esc).join("، ")}</span></div>` : ""}
    </div>
    <div class="order-items-block">
      <strong class="order-items-title">${icon("receipt")} سجل الطلبات (${orders.length.toLocaleString("ar")})</strong>
      ${orders.length ? renderOrdersTable(orders, "admin") : `<p class="order-items-empty">لا توجد طلبات.</p>`}
    </div>
  `, "order-modal");
}

function adminOrders() {
  const all = state.orders;
  const statusFilter = state.adminOrderStatus || "all";
  const storeFilter = state.adminOrderStore || "all";
  const statuses = [...new Set(all.map(o => o.status || "—"))];

  let filtered = all;
  if (statusFilter !== "all") filtered = filtered.filter(o => (o.status || "—") === statusFilter);
  if (storeFilter !== "all") filtered = filtered.filter(o => String(o.storeId) === storeFilter);
  filtered = [...filtered].sort((a, b) => (Date.parse(b.createdAt || "") || 0) - (Date.parse(a.createdAt || "") || 0));

  const chip = (v, label, count) => `<button class="range-chip ${statusFilter === v ? "active" : ""}" data-action="admin-order-status" data-status="${escAttr(v)}">${label} (${count.toLocaleString("ar")})</button>`;
  const statusChips = [chip("all", "الكل", all.length), ...statuses.map(s => chip(s, s, all.filter(o => (o.status || "—") === s).length))].join("");

  const storeIds = [...new Set(all.map(o => o.storeId))];
  const storeOptions = `<option value="all">كل المتاجر</option>` + storeIds
    .map(id => `<option value="${id}" ${storeFilter === String(id) ? "selected" : ""}>${escAttr((getStore(Number(id)) || {}).name || ("متجر " + id))}</option>`).join("");

  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="admin-order-search" placeholder="ابحث في الطلبات"></div><div class="toolbar-actions"><select class="filter-select" id="admin-order-store">${storeOptions}</select><button class="secondary-button compact" data-action="export-csv" data-kind="orders">${icon("download")} تصدير</button></div></div>
    <div class="range-chips order-status-chips">${statusChips}</div>
    <section class="dashboard-card orders-table-card">${filtered.length ? renderOrdersTable(filtered, "admin") : `<div class="empty-managed">${icon("receipt")}<p>لا توجد طلبات مطابقة للفلاتر.</p></div>`}</section>`;
}

// G4: complaints used to only exist in the submitting customer's own browser
// localStorage — this reads the real, shared record via complaints-list
// (service-role key), lazy-loaded once and cached in state._adminComplaints.
function adminComplaints() {
  const list = state._adminComplaints;
  if (list == null && !state._adminComplaintsLoading) {
    state._adminComplaintsLoading = true;
    adminApi("complaints-list")
      .then(data => { state._adminComplaints = Array.isArray(data.complaints) ? data.complaints : []; })
      .catch(() => { state._adminComplaints = []; })
      .finally(() => { state._adminComplaintsLoading = false; render(); });
  }
  const fmtDate = iso => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric" }).format(new Date(iso)); } catch (e) { return ""; } };
  const rows = list == null
    ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل الشكاوى…</p></div>`
    : (list.length ? list.map(c => `<article data-action="complaint-detail" data-id="${escAttr(c.id)}" role="button" tabindex="0"><span class="complaint-icon">${icon("megaphone")}</span><div><strong>${esc(c.subject || "")}</strong><small>${esc(c.id)} · ${esc(c.order_id || "شكوى عامة")}${c.customer ? " · " + esc(c.customer) : ""} · ${fmtDate(c.created_at)}</small></div><span class="status-pill ${statusClass(c.status)}">${esc(c.status || "")}</span></article>`).join("")
      : `<div class="empty-managed">${icon("megaphone")}<p>لا توجد شكاوى حالياً.</p></div>`);
  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="admin-complaint-search" placeholder="ابحث في الشكاوى"></div></div><section class="dashboard-card complaint-list">${rows}</section>`;
}

function adminDeliveryZones() {
  const sorted = [...stores].filter(s => (s.approvalStatus || "approved") === "approved").sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"));
  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>مناطق التوصيل بسعر ثابت</h3><p>حدّد مجمعات أو أحياء تحصل على سعر توصيل ثابت بصرف النظر عن المسافة. يُطبَّق عند ذكر اسم المنطقة في عنوان التوصيل.</p></div></div>
      <div class="admin-zones-list">
        ${sorted.map(store => {
          const zones = (getDeliverySettings(store.id) || {}).namedZones || [];
          return `<article class="admin-zone-store">
            <div class="admin-zone-store__head">
              ${storeAvatar(store)}
              <div><strong>${escAttr(store.name)}</strong><small>${zones.length ? zones.length + " منطقة مضافة" : "لا توجد مناطق خاصة"}</small></div>
              <button class="secondary-button compact" data-action="toggle-zone-editor" data-id="${store.id}">${icon("edit")} تعديل</button>
            </div>
            <div class="zone-editor" id="zone-editor-${store.id}" style="display:none">
              <div class="named-zones-list" id="named-zones-list-${store.id}">
                ${zones.map((z, i) => renderZoneRow(z, i)).join("")}
                ${!zones.length ? `<p class="zones-empty-hint">لا توجد مناطق — اضغط إضافة منطقة.</p>` : ""}
              </div>
              <div class="zone-editor-actions">
                <button type="button" class="secondary-button compact" data-action="add-zone-admin" data-id="${store.id}">${icon("plus")} إضافة منطقة</button>
                <button type="button" class="primary-button compact" data-action="save-zones-admin" data-id="${store.id}">${icon("check")} حفظ</button>
              </div>
              <div class="named-zones-guide"><small>${icon("info")} اسم المنطقة: ما يراه العميل · كلمات المطابقة: نص يبحث عنه في عنوانه (عربي أو لاتيني) · السعر: ل.ت</small></div>
            </div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

// Phase 2 category-organizer manual overrides — one editor per store, mirrors
// adminDeliveryZones()'s collapse-to-edit pattern. Applies on top of the
// automatic Phase 1 plan (buildStoreCategoryPlan); see categorySettingsEditorHTML.
function adminStoreCategories() {
  const sorted = [...stores].filter(s => (s.approvalStatus || "approved") === "approved").sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"));
  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>تصنيفات المتاجر (تجاوز يدوي)</h3><p>المرحلة الأولى ترتّب وتدمج تصنيفات كل متجر تلقائياً. هنا يمكنك تجاوز ذلك يدوياً لأي تصنيف: دمجه في تصنيف آخر، منع دمجه التلقائي، تثبيت ترتيب ظهوره، أو إخفاؤه عن الزوار. تجاوز الإدارة هنا يفوز دائماً على تجاوز التاجر لنفس التصنيف.</p></div></div>
      <div class="admin-zones-list">
        ${sorted.map(store => {
          const count = products.filter(p => p.storeId === store.id).length;
          return `<article class="admin-zone-store">
            <div class="admin-zone-store__head">
              ${storeAvatar(store)}
              <div><strong>${escAttr(store.name)}</strong><small>${count} منتجاً · ${esc(store.category)}</small></div>
              <button class="secondary-button compact" data-action="toggle-category-editor" data-id="${store.id}">${icon("edit")} تعديل</button>
            </div>
            <div class="zone-editor" id="category-editor-${store.id}" style="display:none">
              ${categorySettingsEditorHTML(store, "admin")}
            </div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
}

// Store login accounts: one row per store with username (phone) + generated
// password + live subscription status. Data comes ONLY from the admin-gated
// server endpoint (store_credentials is invisible to the anon client).
function adminCredentials() {
  if (!state.adminKey) return `<section class="dashboard-card"><div class="empty-managed">${icon("shield")}<p>سجّل دخول الإدارة لعرض حسابات المتاجر.</p></div></section>`;
  if (state.adminCreds === null) return `<section class="dashboard-card"><div class="empty-managed">${icon("shield")}<p>جارٍ تحميل حسابات المتاجر…</p></div></section>`;
  if (state.adminCreds === "error") return `<section class="dashboard-card"><div class="empty-managed">${icon("shield")}<p>تعذّر تحميل الحسابات.</p><button class="secondary-button compact" data-action="reload-creds">إعادة المحاولة</button></div></section>`;
  const rows = state.adminCreds;
  const active = rows.filter(r => r.subscription_active).length;
  // Duplicate phones (e.g. shared branch numbers) are ambiguous at login → flag them.
  const dupes = new Set();
  const seen = new Map();
  rows.forEach(r => { if (!r.username) return; if (seen.has(r.username)) dupes.add(r.username); else seen.set(r.username, 1); });
  const warn = state.adminCredsWarn === "service"
    ? "تحذير: مفتاح الخدمة (SUPABASE_SERVICE_ROLE_KEY) غير مهيأ — لن تُحفظ كلمات المرور ولن يعمل الدخول. راجع إعدادات Vercel."
    : state.adminCredsWarn === "write"
    ? "تحذير: تعذّر حفظ كلمات المرور في قاعدة البيانات — تأكد أن جدول store_credentials موجود (نفّذ schema.sql). كلمات المرور المعروضة لن تعمل حتى يُحفظ."
    : "";
  return `
    <section class="dashboard-card">
      <div class="card-heading">
        <div><h3>حسابات الدخول للمتاجر</h3><p>اسم المستخدم = رقم موبايل المتجر. سلّم المتجر بياناته بعد دفع الاشتراك — الدخول يعمل فقط عندما يكون الاشتراك فعّالاً.</p></div>
        <button class="secondary-button compact" data-action="reload-creds">تحديث</button>
      </div>
      ${warn ? `<div class="store-closed-banner review-note" style="margin:0 0 14px">${icon("shield")} <span><strong>${warn}</strong></span></div>` : ""}
      <p class="creds-summary">${rows.length.toLocaleString("ar")} متجراً · ${active.toLocaleString("ar")} اشتراك فعّال</p>
      <div class="table-wrap">
      <table class="admin-table creds-table">
        <thead><tr><th>المتجر</th><th>اسم المستخدم</th><th>كلمة المرور</th><th>الاشتراك</th><th></th></tr></thead>
        <tbody>
          ${rows.map(r => `
            <tr>
              <td>${esc(r.name)}</td>
              <td>${r.no_phone ? `<span class="creds-muted">— أضف رقماً —</span>` : `<code dir="ltr">${esc(r.username)}</code>${dupes.has(r.username) ? ` <span class="creds-dupe" title="رقم مكرر بين أكثر من متجر">مكرر</span>` : ""}`}</td>
              <td>${r.no_phone ? "—" : `<code dir="ltr">${esc(r.password)}</code>`}</td>
              <td>${r.subscription_active ? `<span class="status-pill open">فعّال</span>` : `<span class="status-pill closed">منتهٍ</span>`}</td>
              <td class="creds-actions">${r.no_phone ? "" : `
                <button class="secondary-button compact" data-action="copy-creds" data-username="${escAttr(r.username)}" data-password="${escAttr(r.password)}" data-name="${escAttr(r.name)}">نسخ</button>
                <button class="secondary-button compact" data-action="reset-creds" data-id="${r.store_id}" data-name="${escAttr(r.name)}">توليد جديد</button>`}</td>
            </tr>`).join("")}
        </tbody>
      </table>
      </div>
    </section>`;
}

async function loadAdminCreds() {
  try {
    const data = await adminApi("store-creds");
    state.adminCreds = Array.isArray(data.stores) ? data.stores : [];
    state.adminCredsWarn = data.serviceRole === false ? "service" : (data.writeOk === false ? "write" : null);
  } catch (e) {
    state.adminCreds = "error";
  }
  render();
}

function adminIntegrations() {
  return merchantIntegrations();
}

// Every registered account (incl. Google-login sign-ups that never ordered),
// loaded lazily once per admin session since it needs the service-role endpoint.
async function loadAdminCustomerDirectory() {
  try {
    const data = await adminApi("admin-customers");
    state.adminCustomerDirectory = Array.isArray(data.customers) ? data.customers : [];
  } catch (e) {
    state.adminCustomerDirectory = "error";
  }
  render();
}

// ───────────────── "استهداف فيسبوك" — Facebook ads geo-targeting ─────────────────
// Compares any store's location against the residential compounds of an
// Istanbul district (starting with Esenyurt) — distance, drive time, and an
// estimated delivery cost at an adjustable ₺/km rate. Talks only to
// /api/fbads (its own fbads_* tables — no relation to stores/products).
async function fbadsApi(action, { method = "GET", body = null, params = null } = {}) {
  const p = new URLSearchParams({ action });
  if (params) for (const k in params) { if (params[k] != null && params[k] !== "") p.set(k, params[k]); }
  const opts = { method, headers: { "x-admin-token": state.adminKey || "" } };
  if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(`/api/fbads?${p.toString()}`, opts);
  if (res.status === 403) { lockAdmin(); throw new Error("unauthorized"); }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `request failed (${res.status})`);
  return data;
}

const FBADS_LAST_TARGET_KEY = "dukkanci-fbads-last-target";

function loadFbAdsBootstrap() {
  state.fbadsRegions = null; state.fbadsCompounds = null; state.fbadsSettings = null; state.fbadsTargets = null;
  Promise.all([
    fbadsApi("regions").then(d => { state.fbadsRegions = d.items || []; }).catch(() => { state.fbadsRegions = []; }),
    fbadsApi("compounds", { params: { region: state.fbadsRegion } }).then(d => { state.fbadsCompounds = d.items || []; }).catch(() => { state.fbadsCompounds = []; }),
    fbadsApi("settings").then(d => { state.fbadsSettings = d.item; }).catch(() => { state.fbadsSettings = { rate_per_km: 20 }; }),
    fbadsApi("targets").then(d => { state.fbadsTargets = d.items || []; }).catch(() => { state.fbadsTargets = []; })
  ]).then(() => {
    render();
    // Reopen whichever map the admin was last looking at (or the most recent
    // one) so coming back to this tab never requires recomputing anything —
    // every distance/target is already saved in fbads_target*, this just
    // decides which saved panel to show by default.
    if (!state.fbadsActiveTargetId && state.fbadsTargets.length) {
      const savedId = localStorage.getItem(FBADS_LAST_TARGET_KEY);
      const restoreId = (savedId && state.fbadsTargets.some(t => String(t.id) === savedId)) ? savedId : state.fbadsTargets[0].id;
      loadFbAdsTargetDetail(restoreId);
    }
  });
}

function loadFbAdsCompounds() {
  state.fbadsCompounds = null;
  fbadsApi("compounds", { params: { region: state.fbadsRegion } })
    .then(d => { state.fbadsCompounds = d.items || []; })
    .catch(() => { state.fbadsCompounds = []; })
    .finally(render);
}

function loadFbAdsTargetDetail(id) {
  state.fbadsActiveTargetId = id;
  state.fbadsActiveTarget = null;
  fbadsApi("target", { params: { id } })
    .then(d => { state.fbadsActiveTarget = d; localStorage.setItem(FBADS_LAST_TARGET_KEY, String(id)); })
    .catch(() => { state.fbadsActiveTarget = "error"; })
    .finally(render);
}

function fbadsSwitchRegion(slug) {
  state.fbadsRegion = slug;
  state.fbadsActiveTargetId = null;
  state.fbadsActiveTarget = null;
  loadFbAdsCompounds();
}

async function fbadsAddRegion() {
  const nameEl = document.getElementById("fbads-region-name");
  const name = nameEl?.value.trim();
  if (!name) { showToast("اسم المنطقة مطلوب", "error"); return; }
  const slug = name.toLowerCase().replace(/[^a-z0-9أ-ي\s-]/gi, "").trim().replace(/\s+/g, "-") || `region-${Date.now()}`;
  try {
    await fbadsApi("region", { method: "POST", body: { slug, name } });
    state.fbadsRegionFormOpen = false;
    state.fbadsRegions = null;
    fbadsApi("regions").then(d => { state.fbadsRegions = d.items || []; render(); });
    showToast("تمت إضافة المنطقة", "success");
  } catch (e) { showToast(e.message || "تعذّرت الإضافة", "error"); }
}

async function fbadsSaveRate() {
  const rate = Number(document.getElementById("fbads-rate-input")?.value);
  if (!Number.isFinite(rate) || rate <= 0) { showToast("سعر غير صالح", "error"); return; }
  try {
    await fbadsApi("settings", { method: "POST", body: { ratePerKm: rate } });
    state.fbadsSettings = { ...(state.fbadsSettings || {}), rate_per_km: rate };
    showToast("تم حفظ سعر الكيلومتر", "success");
    render();
  } catch (e) { showToast(e.message || "تعذّر الحفظ", "error"); }
}

async function fbadsAddCompound() {
  const name = document.getElementById("fbads-c-name")?.value.trim();
  const area = document.getElementById("fbads-c-area")?.value.trim();
  const mapsUrl = document.getElementById("fbads-c-url")?.value.trim();
  const note = document.getElementById("fbads-c-note")?.value.trim();
  if (!name || !mapsUrl) { showToast("اسم المجمع ورابط خرائط Google مطلوبان", "error"); return; }
  try {
    await fbadsApi("compound", { method: "POST", body: { regionSlug: state.fbadsRegion, name, area, mapsUrl, note } });
    state.fbadsCompoundFormOpen = false;
    showToast("تمت إضافة المجمع", "success");
    loadFbAdsCompounds();
  } catch (e) { showToast(e.message || "تعذّرت الإضافة", "error"); }
}

async function fbadsSaveCompoundEdit(id) {
  const name = document.getElementById(`fbads-e-name-${id}`)?.value.trim();
  const area = document.getElementById(`fbads-e-area-${id}`)?.value.trim();
  const mapsUrl = document.getElementById(`fbads-e-url-${id}`)?.value.trim();
  const note = document.getElementById(`fbads-e-note-${id}`)?.value.trim();
  try {
    await fbadsApi("compound", { method: "PATCH", params: { id }, body: { name, area, mapsUrl, note } });
    state.fbadsEditingCompoundId = null;
    showToast("تم الحفظ", "success");
    loadFbAdsCompounds();
  } catch (e) { showToast(e.message || "تعذّر الحفظ", "error"); }
}

async function fbadsDeleteCompound(id) {
  if (!confirm("حذف هذا المجمع نهائياً؟")) return;
  try { await fbadsApi("compound", { method: "DELETE", params: { id } }); loadFbAdsCompounds(); }
  catch (e) { showToast(e.message || "تعذّر الحذف", "error"); }
}

async function fbadsComputeTarget() {
  const name = document.getElementById("fbads-t-name")?.value.trim();
  const input = document.getElementById("fbads-t-input")?.value.trim();
  if (!name || !input) { showToast("اسم المحل ورابط موقعه مطلوبان", "error"); return; }
  state.fbadsBusy = true; render();
  try {
    const data = await fbadsApi("compute-target", { method: "POST", body: { name, input, regionSlug: state.fbadsRegion } });
    state.fbadsBusy = false;
    fbadsApi("targets").then(d => { state.fbadsTargets = d.items || []; render(); });
    loadFbAdsTargetDetail(data.targetId);
    showToast("تم حساب المسافات", "success");
  } catch (e) {
    state.fbadsBusy = false; render();
    showToast(e.message || "تعذّر الحساب", "error");
  }
}

async function fbadsRecomputeActive() {
  const t = state.fbadsActiveTarget?.target;
  if (!t) return;
  state.fbadsBusy = true; render();
  try {
    const data = await fbadsApi("compute-target", { method: "POST", body: { name: t.name, input: t.input_url, regionSlug: state.fbadsRegion } });
    state.fbadsBusy = false;
    loadFbAdsTargetDetail(data.targetId);
    showToast("تمت إعادة الحساب", "success");
  } catch (e) { state.fbadsBusy = false; render(); showToast(e.message || "تعذّر الحساب", "error"); }
}

async function fbadsDeleteTarget(id) {
  if (!confirm("حذف هذا المحل من السجل نهائياً؟")) return;
  try {
    await fbadsApi("target", { method: "DELETE", params: { id } });
    if (String(state.fbadsActiveTargetId) === String(id)) {
      state.fbadsActiveTargetId = null; state.fbadsActiveTarget = null;
      if (localStorage.getItem(FBADS_LAST_TARGET_KEY) === String(id)) localStorage.removeItem(FBADS_LAST_TARGET_KEY);
    }
    fbadsApi("targets").then(d => { state.fbadsTargets = d.items || []; render(); });
  } catch (e) { showToast(e.message || "تعذّر الحذف", "error"); }
}

// Client-side classification only — changing the slider re-labels instantly
// without re-querying Google, since the raw distances are already cached.
function fbadsDecision(km, maxKm) {
  if (km == null) return { label: "غير محسوب", tone: "gray" };
  if (km > maxKm) return { label: "استبعاد بسبب البعد", tone: "red" };
  if (km <= 3) return { label: "استهداف قوي جدًا", tone: "green" };
  if (km <= 5) return { label: "استهداف جيد", tone: "teal" };
  return { label: "اختبار فقط", tone: "yellow" };
}

function fbadsExportCsv() {
  const data = state.fbadsActiveTarget;
  if (!data || data === "error") return;
  const rows = [...data.distances].sort((a, b) => (a.driving_km ?? a.direct_km ?? 0) - (b.driving_km ?? b.direct_km ?? 0));
  const header = ["اسم المجمع", "المنطقة", "مسافة مباشرة كم", "مسافة قيادة كم", "زمن القيادة (دقيقة)", "تقدير تكلفة التوصيل", "القرار", "رابط خرائط Google"];
  const lines = [header, ...rows.map(r => {
    const km = r.driving_km ?? r.direct_km;
    const decision = fbadsDecision(km, state.fbadsMaxKm).label;
    return [r.fbads_compounds?.name || "", r.fbads_compounds?.area || "", r.direct_km, r.driving_km, r.driving_minutes, r.estimated_cost, decision, r.fbads_compounds?.maps_url || ""];
  })];
  const csv = "﻿" + lines.map(line => line.map(cell => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `fbads-${(data.target.name || "target").replace(/[^\w-]+/g, "-")}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

function fbadsCompoundRow(c) {
  if (state.fbadsEditingCompoundId === c.id) {
    return `<tr class="fbads-editing-row">
      <td><input id="fbads-e-name-${c.id}" value="${escAttr(c.name)}"></td>
      <td><input id="fbads-e-area-${c.id}" value="${escAttr(c.area || "")}"></td>
      <td><input id="fbads-e-url-${c.id}" dir="ltr" value="${escAttr(c.maps_url)}"></td>
      <td><input id="fbads-e-note-${c.id}" value="${escAttr(c.note || "")}"></td>
      <td class="fbads-row-actions">
        <button class="secondary-button compact" data-action="fbads-save-compound" data-id="${c.id}">${icon("check")} حفظ</button>
        <button class="text-button" data-action="fbads-cancel-edit-compound">إلغاء</button>
      </td>
    </tr>`;
  }
  return `<tr>
    <td><strong>${esc(c.name)}</strong>${c.lat == null ? ` <small class="fbads-geostatus">لم تُحدَّد الإحداثيات بعد — تُحسب عند أول حساب مسافات</small>` : ""}</td>
    <td>${esc(c.area || "—")}</td>
    <td><a href="${escAttr(c.maps_url)}" target="_blank" rel="noopener" class="text-button compact">${icon("map")} فتح الموقع</a></td>
    <td>${esc(c.note || "—")}</td>
    <td class="fbads-row-actions">
      <button class="icon-button" data-action="fbads-edit-compound" data-id="${c.id}" aria-label="تعديل">${icon("edit")}</button>
      <button class="icon-button" data-action="fbads-delete-compound" data-id="${c.id}" aria-label="حذف">${icon("trash")}</button>
    </td>
  </tr>`;
}

function fbadsResultsPanel() {
  const data = state.fbadsActiveTarget;
  if (!data) return "";
  if (data === "error") return `<section class="dashboard-card"><div class="empty-managed">${icon("map")}<p>تعذّر تحميل بيانات هذا المحل.</p></div></section>`;
  const { target, distances } = data;
  const rows = [...distances].sort((a, b) => (a.driving_km ?? a.direct_km ?? 0) - (b.driving_km ?? b.direct_km ?? 0));
  const within = rows.filter(r => (r.driving_km ?? r.direct_km) <= state.fbadsMaxKm).length;
  return `
    <section class="dashboard-card fbads-results-card">
      <div class="card-heading">
        <div><h3>${icon("map")} ${esc(target.name)}</h3><p>${esc(target.resolved_address || "")}</p></div>
        <div class="fbads-results-actions">
          <button class="secondary-button compact" data-action="fbads-recompute" ${state.fbadsBusy ? "disabled" : ""}>${icon("map")} إعادة الحساب</button>
          <button class="secondary-button compact" data-action="fbads-export-csv">${icon("download")} تصدير CSV</button>
          <button class="icon-button" data-action="fbads-delete-target" data-id="${target.id}" aria-label="حذف">${icon("trash")}</button>
        </div>
      </div>
      <div class="fbads-summary-row">
        <label class="fbads-max-km">أقصى مسافة للاستهداف <input id="fbads-max-km-input" type="number" min="0.5" step="0.5" value="${state.fbadsMaxKm}"> كم</label>
        <span class="status-pill green">${within.toLocaleString("ar")} مناسب ضمن المسافة</span>
        <span class="status-pill red">${(rows.length - within).toLocaleString("ar")} مستبعد</span>
      </div>
      <div class="table-wrap">
        <table class="admin-table fbads-distance-table">
          <thead><tr><th>المجمع</th><th>المنطقة</th><th>مسافة مباشرة</th><th>مسافة قيادة</th><th>زمن القيادة</th><th>تكلفة تقديرية</th><th>القرار</th><th></th></tr></thead>
          <tbody>
            ${rows.map(r => {
              const km = r.driving_km ?? r.direct_km;
              const decision = fbadsDecision(km, state.fbadsMaxKm);
              const c = r.fbads_compounds || {};
              return `<tr>
                <td><strong>${esc(c.name || "")}</strong></td>
                <td>${esc(c.area || "—")}</td>
                <td>${r.direct_km != null ? formatDistance(r.direct_km) : "—"}</td>
                <td>${r.driving_km != null ? formatDistance(r.driving_km) : "—"}${r.provider === "estimate" ? ` <small class="fbads-geostatus">(تقدير)</small>` : ""}</td>
                <td>${r.driving_minutes ? r.driving_minutes.toLocaleString("ar") + " دقيقة" : "—"}</td>
                <td>${r.estimated_cost != null ? money(r.estimated_cost) : "—"}</td>
                <td><span class="status-pill ${decision.tone}">${decision.label}</span></td>
                <td>${c.maps_url ? `<a href="${escAttr(c.maps_url)}" target="_blank" rel="noopener" class="text-button compact">${icon("map")}</a>` : ""}</td>
              </tr>`;
            }).join("")}
          </tbody>
        </table>
      </div>
      <div class="fbads-map-wrap">
        <div id="fbads-map" style="height:420px;border-radius:16px"></div>
        <p class="fbads-map-legend"><span class="fbads-legend-dot green"></span> ≤3 كم &nbsp; <span class="fbads-legend-dot yellow"></span> ≤5 كم &nbsp; <span class="fbads-legend-dot red"></span> أبعد من أقصى مسافة</p>
      </div>
    </section>`;
}

function adminFbAds() {
  if (state.fbadsCompounds == null) { loadFbAdsBootstrap(); return `<section class="dashboard-card"><div class="empty-managed">${icon("map")}<p>جارٍ تحميل بيانات الاستهداف…</p></div></section>`; }
  const regions = state.fbadsRegions || [];
  const settings = state.fbadsSettings || { rate_per_km: 20 };
  const compounds = state.fbadsCompounds || [];
  const targets = state.fbadsTargets || [];
  return `
    <div class="fbads-shell">
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>${icon("shield")} قاعدة بيانات مستقلة</h3><p>هذا القسم له جداول خاصة به فقط (اسم المحل وموقعه على خرائط Google، وقائمة المجمعات لكل منطقة) — لا صلة له بجداول متاجر ومنتجات وعملاء الموقع.</p></div></div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading">
          <div><h3>المنطقة</h3><p>ابدأ بإسنيورت، وأضف مناطق إسطنبول الأخرى تباعاً.</p></div>
          <button class="secondary-button compact" data-action="fbads-toggle-region-form">${icon("plus")} منطقة جديدة</button>
        </div>
        <div class="fbads-region-tabs">
          ${regions.map(r => `<button class="fbads-region-tab ${r.slug === state.fbadsRegion ? "active" : ""}" data-action="fbads-region" data-slug="${escAttr(r.slug)}">${esc(r.name)}</button>`).join("")}
        </div>
        ${state.fbadsRegionFormOpen ? `
          <div class="fbads-inline-form">
            <input id="fbads-region-name" placeholder="اسم المنطقة، مثل: بيليكدوزو">
            <button class="primary-button compact" data-action="fbads-add-region">${icon("check")} إضافة</button>
          </div>` : ""}
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>سعر الكيلومتر الواحد</h3><p>يُستخدم لتقدير تكلفة التوصيل لكل مجمع — قيمة متغيرة تُعدَّل في أي وقت.</p></div></div>
        <div class="fbads-inline-form">
          <input id="fbads-rate-input" type="number" min="1" step="1" value="${settings.rate_per_km}" style="width:120px">
          <span>ل.ت / كم</span>
          <button class="primary-button compact" data-action="fbads-save-rate">${icon("check")} حفظ</button>
        </div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading">
          <div><h3>مجمعات ${esc(regions.find(r => r.slug === state.fbadsRegion)?.name || state.fbadsRegion)}</h3><p>${compounds.length.toLocaleString("ar")} مجمعاً مسجّلاً — أضف المزيد في أي وقت.</p></div>
          <button class="secondary-button compact" data-action="fbads-toggle-compound-form">${icon("plus")} مجمع جديد</button>
        </div>
        ${state.fbadsCompoundFormOpen ? `
          <div class="fbads-inline-form fbads-compound-form">
            <input id="fbads-c-name" placeholder="اسم المجمع">
            <input id="fbads-c-area" placeholder="المنطقة / الحي (اختياري)">
            <input id="fbads-c-url" dir="ltr" placeholder="رابط خرائط Google">
            <input id="fbads-c-note" placeholder="ملاحظة (اختياري)">
            <button class="primary-button compact" data-action="fbads-add-compound">${icon("check")} إضافة</button>
          </div>` : ""}
        <div class="table-wrap">
          <table class="admin-table">
            <thead><tr><th>الاسم</th><th>المنطقة</th><th>الموقع</th><th>ملاحظة</th><th></th></tr></thead>
            <tbody>${compounds.length ? compounds.map(fbadsCompoundRow).join("") : `<tr><td colspan="5" class="fbads-geostatus">لا توجد مجمعات في هذه المنطقة بعد.</td></tr>`}</tbody>
          </table>
        </div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>محل جديد للاستهداف</h3><p>ضع اسم المحل ورابط موقعه على خرائط Google (أو رابط متجره الإلكتروني)، وستحصل على لوحة تُبيّن البعد عن كل مجمع.</p></div></div>
        <div class="fbads-inline-form">
          <input id="fbads-t-name" placeholder="اسم المحل">
          <input id="fbads-t-input" dir="ltr" placeholder="رابط خرائط Google أو رابط الموقع أو العنوان">
          <button class="primary-button compact" data-action="fbads-compute-target" ${state.fbadsBusy ? "disabled" : ""}>${state.fbadsBusy ? "جارٍ الحساب…" : `${icon("map")} حساب المسافات`}</button>
        </div>
      </section>
      ${fbadsResultsPanel()}
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>سجل المحلات المحسوبة</h3><p>افتح أي محل سابق لمراجعة لوحته من جديد.</p></div></div>
        ${targets.length ? `<div class="fbads-targets-list">${targets.map(t => `
          <button class="fbads-target-item ${String(t.id) === String(state.fbadsActiveTargetId) ? "active" : ""}" data-action="fbads-open-target" data-id="${t.id}">
            <span><strong>${esc(t.name)}</strong><small>${esc(t.resolved_address || "")}</small></span>
            <small>${new Date(t.updated_at).toLocaleDateString("ar-EG")}</small>
          </button>`).join("")}</div>` : `<div class="empty-managed">${icon("map")}<p>لم يُحسَب أي محل بعد.</p></div>`}
      </section>
    </div>`;
}

// Google Maps JS visual panel: the target store + every compound, connected by
// straight lines colour-coded by distance so the geographic spread is obvious
// at a glance (an actual driving route per compound would mean one Directions
// API call each — the table above already gives the real driving distance).
let fbadsMap = null;
let fbadsMapEl = null;   // the DOM node fbadsMap is actually attached to
let fbadsMapOverlays = [];
function fbadsClearMapOverlays() {
  fbadsMapOverlays.forEach(o => { try { o.setMap(null); } catch {} });
  fbadsMapOverlays = [];
}
async function initFbAdsMap() {
  const mapEl = document.getElementById("fbads-map");
  const data = state.fbadsActiveTarget;
  if (!mapEl || !data || data === "error") return;
  // render() rebuilds app.innerHTML from scratch on every state change (e.g.
  // typing in the max-km field), so #fbads-map is a BRAND NEW node each time —
  // reusing fbadsMap without checking the node changed leaves the new,
  // visible div empty while the map silently keeps painting into the old,
  // detached one. Only skip work when it's truly the same live node.
  const sig = `${data.target.id}:${data.distances.length}:${state.fbadsMaxKm}`;
  if (state._fbadsMapSig === sig && fbadsMap && fbadsMapEl === mapEl) return;
  state._fbadsMapSig = sig;
  try { await ensureGoogleMaps(); } catch {
    mapEl.innerHTML = `<div class="addr2-map-fallback">تعذّر تحميل خرائط Google — تحقّق من مفتاح GOOGLE_MAPS_API_KEY</div>`;
    return;
  }
  if (!document.getElementById("fbads-map")) return;
  const { target, distances } = data;
  if (!fbadsMap || fbadsMapEl !== mapEl) {
    fbadsMap = new google.maps.Map(mapEl, { center: { lat: target.lat, lng: target.lng }, zoom: 13, gestureHandling: "greedy" });
    fbadsMapEl = mapEl;
  } else {
    fbadsClearMapOverlays();
  }
  fbadsMapOverlays.push(new google.maps.Marker({
    map: fbadsMap, position: { lat: target.lat, lng: target.lng }, title: target.name,
    icon: { path: google.maps.SymbolPath.CIRCLE, scale: 9, fillColor: "#e11d48", fillOpacity: 1, strokeColor: "#fff", strokeWeight: 2 }
  }));
  const bounds = new google.maps.LatLngBounds();
  bounds.extend({ lat: target.lat, lng: target.lng });
  distances.forEach(r => {
    const c = r.fbads_compounds;
    if (!c || c.lat == null) return;
    const km = r.driving_km ?? r.direct_km;
    const color = km > state.fbadsMaxKm ? "#dc2626" : km <= 3 ? "#16a34a" : "#d97706";
    const point = { lat: c.lat, lng: c.lng };
    bounds.extend(point);
    fbadsMapOverlays.push(new google.maps.Marker({
      map: fbadsMap, position: point, title: `${c.name} — ${formatDistance(km)}`,
      icon: { path: google.maps.SymbolPath.CIRCLE, scale: 6, fillColor: color, fillOpacity: 1, strokeColor: "#fff", strokeWeight: 1.5 }
    }));
    fbadsMapOverlays.push(new google.maps.Polyline({
      map: fbadsMap, path: [{ lat: target.lat, lng: target.lng }, point],
      strokeColor: color, strokeOpacity: 0.6, strokeWeight: 2
    }));
  });
  fbadsMap.fitBounds(bounds, 40);
}

// ─────────────────────────── AI Management tab ───────────────────────────
// Central admin section for the AI department (spec: "قسم الذكاء الصناعي").
// Talks to /api/ai which uses the service-role key + lib/ai-gateway. API keys
// are only ever shown masked (last 4). Everything is admin-token gated.
async function aiApi(action, { method = "GET", body = null, params = null } = {}) {
  const p = new URLSearchParams({ action });
  if (params) for (const k in params) { if (params[k] != null && params[k] !== "") p.set(k, params[k]); }
  const qs = p.toString();
  const opts = { method, headers: { "x-admin-token": state.adminKey || "" } };
  if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(`/api/ai?${qs}`, opts);
  if (res.status === 403) { lockAdmin(); throw new Error("unauthorized"); }
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return res.json().catch(() => ({}));
}

async function loadAdminAI() {
  try { state.adminAI = await aiApi("overview"); state._adminAIError = null; }
  catch (e) { state._adminAIError = true; state.adminAI = state.adminAI || { providers: [], features: [], usage: {} }; }
  render();
}

async function loadAdminKB() {
  try { state.adminKB = await aiApi("kb-list"); state._adminKBError = null; }
  catch (e) { state._adminKBError = true; state.adminKB = state.adminKB || { documents: [], totalDocuments: 0, totalChunks: 0 }; }
  render();
}

async function loadAdminSyn() {
  try { state.adminSyn = await aiApi("syn-overview", { params: state._synQ ? { q: state._synQ } : null }); state._adminSynError = null; }
  catch (e) { state._adminSynError = true; state.adminSyn = state.adminSyn || { stats: {}, rows: [], indexingConfigured: false }; }
  render();
}

// Batch-drives the AI generation endpoint until the whole pending queue is done
// (or the admin presses stop). Each request generates ~20 names server-side.
async function runSynGenerate() {
  if (state._synRunning) return;
  state._synRunning = "generate"; state._synStop = false; state._synLog = "يبدأ التوليد…"; render();
  let guard = 0;
  try {
    while (!state._synStop && guard < 2000) {
      guard++;
      let r;
      try { r = await aiApi("syn-generate", { method: "POST", body: { limit: 20 } }); }
      catch (e) { state._synLog = "تعذّر الاتصال بالخادم — تحقّق من تسجيل الدخول."; break; }
      if (!r || r.ok === false) { state._synLog = (r && r.note) || "تعذّر التوليد — تحقّق من ربط ميزة «توليد المترادفات» بمزوّد."; break; }
      if (r.stats) state.adminSyn = Object.assign({}, state.adminSyn, { stats: r.stats });
      const st = (r.stats) || {};
      state._synLog = `تم توليد ${st.done || 0} من ${st.total || 0}…`;
      render();
      if (r.done) { state._synLog = `اكتمل التوليد ✓ (${st.done || 0} منتج).`; break; }
    }
    if (state._synStop) state._synLog = "أُوقف التوليد.";
  } catch (e) { state._synLog = "توقّف بسبب خطأ."; }
  state._synRunning = null;
  await loadAdminSyn();
}

// Batch-drives the Google Indexing push for products whose synonyms are ready.
async function runSynIndex() {
  if (state._synRunning) return;
  state._synRunning = "index"; state._synStop = false; state._synLog = "يبدأ الدفع إلى Google…"; render();
  let guard = 0, pushed = 0;
  try {
    while (!state._synStop && guard < 500) {
      guard++;
      let r;
      try { r = await aiApi("syn-index", { method: "POST", body: { limit: 20 } }); }
      catch (e) { state._synLog = "تعذّر الاتصال بالخادم."; break; }
      if (!r || r.ok === false) { state._synLog = "تعذّر الدفع إلى Google."; break; }
      if (r.configured === false) { state._synLog = r.note || "خدمة الفهرسة غير مهيّأة."; break; }
      if (r.stats) state.adminSyn = Object.assign({}, state.adminSyn, { stats: r.stats });
      pushed += r.pushed || 0;
      state._synLog = `تم دفع ${pushed} رابطاً إلى Google…`;
      render();
      if (!r.pushed) { state._synLog = `اكتمل الدفع ✓ (${pushed} رابطاً).`; break; }
    }
    if (state._synStop) state._synLog = "أُوقف الدفع.";
  } catch (e) { state._synLog = "توقّف بسبب خطأ."; }
  state._synRunning = null;
  await loadAdminSyn();
}

// Knowledge-base (RAG training) section of the AI tab.
function adminKBSection() {
  if (!state.adminKB) {
    if (!state._adminKBLoading) { state._adminKBLoading = true; loadAdminKB().finally(() => { state._adminKBLoading = false; }); }
    return `<section class="dashboard-card"><p class="creds-summary">جارٍ تحميل قاعدة المعرفة…</p></section>`;
  }
  const kbd = state.adminKB;
  const docs = kbd.documents || [];
  const storeName = id => { const s = (typeof getStore === "function") && getStore(id); return s ? s.name : ("#" + id); };
  const storeOpts = (typeof stores !== "undefined" ? stores : []).slice()
    .sort((a, b) => String(a.name).localeCompare(String(b.name), "ar"))
    .map(s => `<option value="${escAttr(s.id)}">${esc(s.name)}</option>`).join("");
  const statusPill = st => st === "ready" ? `<span class="status-pill paid">جاهز</span>` : st === "failed" ? `<span class="status-pill">فشل</span>` : `<span class="status-pill">معالجة…</span>`;
  const scopeField = `<label class="input-label"><span>النطاق</span><select name="scope"><option value="platform">عامة للمنصّة</option><option value="store">خاصة بمتجر</option></select></label>
    <label class="input-label"><span>المتجر (عند اختيار «خاصة بمتجر»)</span><select name="store_id"><option value="">—</option>${storeOpts}</select></label>`;

  const docsTable = docs.length ? `
    <div class="table-wrap"><table class="admin-table">
      <thead><tr><th>المصدر</th><th>النطاق</th><th>الحالة</th><th>المقاطع</th><th></th></tr></thead>
      <tbody>${docs.map(doc => `<tr>
        <td><strong>${esc(doc.file_name || "—")}</strong><br><small>${doc.source_type === "file" ? "ملف" : "نص"}${doc.error ? ` · <span style="color:#c0392b">${esc(doc.error)}</span>` : ""}</small></td>
        <td>${doc.scope === "store" ? esc(storeName(doc.store_id)) : "عامة"}</td>
        <td>${statusPill(doc.status)}</td>
        <td>${doc.chunk_count || 0}</td>
        <td><button class="icon-button" data-action="kb-delete" data-id="${escAttr(doc.id)}" data-name="${escAttr(doc.file_name || "")}" title="حذف">${icon("trash")}</button></td>
      </tr>`).join("")}</tbody>
    </table></div>` : `<p class="creds-summary">لا توجد مستندات بعد. أضِف نصاً أو ارفع ملفاً بالأسفل.</p>`;

  const t = state._adminKBTest;
  const testResult = t ? `<div style="margin-top:10px">
    ${t.answer ? `<div class="delivery-calculator">${icon("stars")}<div><strong>الرد المولّد</strong><p>${esc(t.answer)}</p></div></div>` : `<div class="delivery-calculator warning">${icon("close")}<div><strong>لا يوجد رد</strong><p>لم تُسترجَع مقاطع كافية أو مزوّد embeddings غير مهيّأ.</p></div></div>`}
    ${(t.chunks && t.chunks.length) ? `<div class="table-wrap" style="margin-top:8px"><table class="admin-table"><thead><tr><th>المقطع المسترجَع</th><th>التشابه</th></tr></thead><tbody>${t.chunks.map(c => `<tr><td>${esc(c.content)}…</td><td>${c.similarity != null ? (c.similarity * 100).toFixed(0) + "%" : "—"}</td></tr>`).join("")}</tbody></table></div>` : ""}
  </div>` : "";

  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>قاعدة المعرفة</h3><p>الملفات والنصوص التي يستند إليها الذكاء الاصطناعي عند الرد (RAG). إجمالي: <strong>${kbd.totalDocuments || 0}</strong> مستند · <strong>${kbd.totalChunks || 0}</strong> مقطع مفهرَس.</p></div><button class="icon-button" data-action="kb-refresh" title="تحديث">${icon("download")}</button></div>
      ${state._adminKBError ? `<p class="creds-summary" style="color:#c0392b">تعذّر التحميل.</p>` : docsTable}
    </section>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>إضافة معرفة نصية</h3><p>الصق معلومة مباشرة (سياسات، أسئلة شائعة، تفاصيل) فتُقطَّع وتُفهرَس فوراً.</p></div></div>
      <form id="kb-text-form" class="form-grid">
        ${scopeField}
        <label class="input-label" style="grid-column:1/-1"><span>عنوان مختصر</span><input name="title" placeholder="مثال: سياسة الإرجاع"></label>
        <label class="input-label" style="grid-column:1/-1"><span>النص</span><textarea name="text" rows="5" placeholder="اكتب أو الصق المعرفة هنا…"></textarea></label>
        <button type="submit" class="primary-button" style="grid-column:1/-1">${icon("check")} إضافة وفهرسة</button>
      </form>
    </section>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>رفع ملف</h3><p>صيغ مدعومة: txt و docx (حد أقصى 3MB). تُستخرج النصوص وتُفهرَس.</p></div></div>
      <form id="kb-file-form" class="form-grid">
        ${scopeField}
        <label class="input-label" style="grid-column:1/-1"><span>الملف</span><input type="file" name="file" accept=".txt,.md,.docx"></label>
        <button type="submit" class="primary-button" style="grid-column:1/-1">${icon("upload")} رفع وفهرسة</button>
      </form>
    </section>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>اختبار الاسترجاع</h3><p>اكتب سؤالاً لترى أي المقاطع ستُسترجَع وكيف سيردّ الذكاء الاصطناعي قبل اعتماده.</p></div></div>
      <form id="kb-test-form" class="form-grid">
        <label class="input-label" style="grid-column:1/-1"><span>سؤال تجريبي</span><input name="query" placeholder="مثال: ما سياسة الإرجاع؟"></label>
        <button type="submit" class="secondary-button" style="grid-column:1/-1">${icon("search")} اختبار</button>
      </form>
      ${testResult}
    </section>`;
}

// Synonyms (dialect alternate-names) section of the AI tab.
function adminSynonymsSection() {
  if (!state.adminSyn) {
    if (!state._adminSynLoading) { state._adminSynLoading = true; loadAdminSyn().finally(() => { state._adminSynLoading = false; }); }
    return `<section class="dashboard-card"><p class="creds-summary">جارٍ تحميل المترادفات…</p></section>`;
  }
  const d = state.adminSyn;
  const st = d.stats || {};
  const total = Number(st.total || 0), done = Number(st.done || 0), failed = Number(st.failed || 0);
  const pending = Math.max(0, Number(st.pending || 0) - failed);
  const indexed = Number(st.indexed || 0), distinct = Number(st.distinct_names || 0);
  const pct = total ? Math.round((done / total) * 100) : 0;
  const running = state._synRunning;
  const rows = d.rows || [];

  const genBtn = running === "generate"
    ? `<button class="danger-button compact" data-action="syn-stop">${icon("close")} إيقاف التوليد</button>`
    : `<button class="primary-button compact" data-action="syn-generate" ${running ? "disabled" : ""}>${icon("stars")} توليد المترادفات</button>`;
  const idxBtn = running === "index"
    ? `<button class="danger-button compact" data-action="syn-stop">${icon("close")} إيقاف الدفع</button>`
    : `<button class="secondary-button compact" data-action="syn-index" ${running ? "disabled" : ""}>${icon("upload")} دفع إلى Google</button>`;
  const retryBtn = failed > 0 && !running ? `<button class="text-button" data-action="syn-retry">إعادة محاولة الفاشلة (${failed})</button>` : "";
  const logLine = state._synLog ? `<p class="creds-summary" style="margin-top:8px">${esc(state._synLog)}</p>` : "";

  const statusPill = s => s === "done" ? `<span class="status-pill paid">تم</span>` : s === "failed" ? `<span class="status-pill">فشل</span>` : `<span class="status-pill">بانتظار</span>`;
  const dialCell = dl => {
    const keys = (dl && typeof dl === "object" && !Array.isArray(dl)) ? Object.keys(dl).filter(k => (dl[k] || []).length) : [];
    if (!keys.length) return `<span style="color:#94a3b8">—</span>`;
    return keys.map(k => `<div style="margin:2px 0"><b style="color:#64748b">${esc(k)}:</b> ${esc((dl[k] || []).join("، "))}</div>`).join("");
  };
  const table = rows.length ? `
    <div class="table-wrap"><table class="admin-table">
      <thead><tr><th>الاسم</th><th>المرادفات حسب اللهجة</th><th>الحالة</th><th></th></tr></thead>
      <tbody>${rows.map(r => `<tr>
        <td><strong>${esc(r.name)}</strong><br><small style="color:#94a3b8">#${esc(r.product_id)}${r.indexed_at ? " · بجوجل ✓" : ""}</small></td>
        <td style="font-size:13px;line-height:1.6">${dialCell(r.dialects)}</td>
        <td>${statusPill(r.status)}</td>
        <td><button class="icon-button" data-action="syn-edit" data-name="${escAttr(r.name)}" title="تعديل">${icon("edit")}</button></td>
      </tr>`).join("")}</tbody>
    </table></div>` : `<p class="creds-summary">لا توجد نتائج. ${state._synQ ? "جرّب بحثاً آخر." : "اضغط «تحديث قائمة الأسماء» ثم «توليد المترادفات»."}</p>`;

  const notConfiguredWarn = !d.indexingConfigured ? `<div class="delivery-calculator warning">${icon("shield")}<div><strong>دفع Google غير مهيّأ (اختياري)</strong><p>المترادفات تظهر لجوجل تلقائياً داخل صفحات المنتجات وخريطة الموقع فور نشرها. زر «دفع إلى Google» يُسرّع إعادة الفهرسة فقط، ويحتاج ضبط <code>GOOGLE_INDEXING_CLIENT_EMAIL</code> و<code>GOOGLE_INDEXING_PRIVATE_KEY</code> في Vercel.</p></div></div>` : "";

  return `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>مترادفات المنتجات</h3><p>كلمات بحث بديلة بكل اللهجات العربية لكل منتج — تُولَّد بالذكاء الاصطناعي وتظهر لجوجل داخل صفحات المنتجات.</p></div><button class="icon-button" data-action="syn-refresh" title="تحديث">${icon("download")}</button></div>
      ${state._adminSynError ? `<p class="creds-summary" style="color:#c0392b">تعذّر التحميل — تحقّق من تسجيل دخول المشرف.</p>` : ""}
      <div class="creds-summary" style="display:flex;flex-wrap:wrap;gap:14px;margin-bottom:10px">
        <span>الإجمالي: <strong>${total}</strong></span>
        <span>أسماء مميّزة: <strong>${distinct}</strong></span>
        <span>مُولّدة: <strong style="color:#16a34a">${done}</strong></span>
        <span>بانتظار: <strong>${pending}</strong></span>
        ${failed ? `<span>فشل: <strong style="color:#c0392b">${failed}</strong></span>` : ""}
        <span>مُرسَلة لجوجل: <strong>${indexed}</strong></span>
      </div>
      <div style="height:10px;border-radius:6px;background:#eef2f7;overflow:hidden;margin-bottom:12px"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,#22c55e,#16a34a);transition:width .3s"></div></div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <button class="secondary-button compact" data-action="syn-sync" ${running ? "disabled" : ""}>${icon("download")} تحديث قائمة الأسماء</button>
        ${genBtn}
        ${idxBtn}
        ${retryBtn}
      </div>
      ${logLine}
      ${notConfiguredWarn}
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>معاينة وتحرير</h3><p>ابحث عن منتج لمراجعة مرادفاته أو تعديلها يدوياً.</p></div></div>
      <form id="syn-search-form" class="form-grid" style="margin-bottom:10px">
        <label class="input-label" style="grid-column:1/-1"><span>بحث بالاسم</span><input name="q" value="${escAttr(state._synQ || "")}" placeholder="مثال: بندورة"></label>
        <button type="submit" class="secondary-button compact" style="grid-column:1/-1;justify-self:start">${icon("search")} بحث</button>
      </form>
      ${table}
    </section>`;
}

const AI_FEATURE_LABELS = {
  whatsapp_autoreply: ["الرد الآلي على واتساب", "يردّ على رسائل العملاء عبر رقم المنصة"],
  image_enhancement: ["تحسين صور المنتجات", "يحسّن صور المنتجات عند رفعها"],
  synonym_generation: ["توليد المترادفات", "مرادفات أسماء المنتجات حسب اللهجات"],
  embeddings: ["المتجهات (قاعدة المعرفة)", "تحويل النصوص لمتجهات للبحث الدلالي / RAG"]
};
const AI_PROVIDER_NAMES = ["openai", "anthropic", "google", "replicate"];

function adminAI() {
  if (!state.adminAI) {
    if (!state._adminAILoading) { state._adminAILoading = true; loadAdminAI().finally(() => { state._adminAILoading = false; }); }
    return `<section class="dashboard-card"><p class="creds-summary">جارٍ تحميل إعدادات الذكاء الاصطناعي…</p></section>`;
  }
  const section = state._adminAISection || "providers";
  const toggle = `<div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap">
    <button class="${section === "providers" ? "primary-button" : "secondary-button"} compact" data-action="ai-section" data-section="providers">${icon("settings")} المزوّدون والميزات</button>
    <button class="${section === "knowledge" ? "primary-button" : "secondary-button"} compact" data-action="ai-section" data-section="knowledge">${icon("box")} قاعدة المعرفة (التدريب)</button>
    <button class="${section === "synonyms" ? "primary-button" : "secondary-button"} compact" data-action="ai-section" data-section="synonyms">${icon("stars")} المترادفات</button>
  </div>`;
  if (section === "knowledge") return toggle + adminKBSection();
  if (section === "synonyms") return toggle + adminSynonymsSection();
  const d = state.adminAI;
  const providers = d.providers || [];
  const features = d.features || [];
  const usage = d.usage || {};
  const editing = state._adminAIEdit ? providers.find(p => p.id === state._adminAIEdit) : null;
  const provById = id => providers.find(p => p.id === id);
  const providerOptions = (selected) => `<option value="">— بدون (يستخدم المفتاح الافتراضي) —</option>` +
    providers.map(p => `<option value="${escAttr(p.id)}" ${p.id === selected ? "selected" : ""}>${esc(p.label || p.provider_name)} (${esc(p.provider_name)})</option>`).join("");

  const warn = !d.hasEncryptionSecret
    ? `<div class="delivery-calculator warning">${icon("shield")}<div><strong>التشفير غير مهيّأ</strong><p>أضِف متغيّر البيئة <code>KEY_ENCRYPTION_SECRET</code> في Vercel قبل حفظ المفاتيح (وإلا لن تُخزَّن بأمان).</p></div></div>`
    : "";
  const errBox = state._adminAIError ? `<div class="delivery-calculator warning">${icon("close")}<div><strong>تعذّر تحميل البيانات</strong><p>تحقّق من تسجيل دخول المشرف ثم <button class="text-button" data-action="ai-refresh">أعد المحاولة</button>.</p></div></div>` : "";

  // Providers table + add/edit form
  const providersTable = providers.length ? `
    <div class="table-wrap"><table class="admin-table">
      <thead><tr><th>المزوّد</th><th>النوع</th><th>النموذج الافتراضي</th><th>المفتاح</th><th>الحالة</th><th></th></tr></thead>
      <tbody>${providers.map(p => `<tr>
        <td><strong>${esc(p.label || p.provider_name)}</strong><br><small>${esc(p.provider_name)}</small></td>
        <td>${esc(p.service_type)}</td>
        <td>${esc(p.default_model || "—")}</td>
        <td><code>••••${esc(p.key_hint || "")}</code></td>
        <td>${p.is_active ? `<span class="status-pill paid">مفعّل</span>` : `<span class="status-pill">معطّل</span>`}</td>
        <td style="white-space:nowrap">
          <button class="icon-button" data-action="ai-edit-provider" data-id="${escAttr(p.id)}" title="تعديل">${icon("edit")}</button>
          <button class="icon-button" data-action="ai-delete-provider" data-id="${escAttr(p.id)}" data-name="${escAttr(p.label || p.provider_name)}" title="حذف">${icon("trash")}</button>
        </td></tr>`).join("")}</tbody>
    </table></div>` : `<p class="creds-summary">لا يوجد مزوّدون بعد. أضِف أول مزوّد بالأسفل.</p>`;

  const ev = (k, d2 = "") => escAttr(editing && editing[k] != null ? String(editing[k]) : d2);
  const providerForm = `
    <form id="ai-provider-form" class="form-grid" data-id="${editing ? escAttr(editing.id) : ""}">
      <label class="input-label"><span>المزوّد</span>
        <select name="provider_name">${AI_PROVIDER_NAMES.map(n => `<option value="${n}" ${editing && editing.provider_name === n ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label class="input-label"><span>اسم وصفي (اختياري)</span><input name="label" value="${ev("label")}" placeholder="مثال: OpenAI الإنتاج"></label>
      <label class="input-label"><span>نوع الخدمة</span>
        <select name="service_type">${["text", "image", "embedding", "both"].map(t => `<option value="${t}" ${editing && editing.service_type === t ? "selected" : ""}>${t}</option>`).join("")}</select></label>
      <label class="input-label"><span>النموذج الافتراضي (اختياري)</span><input name="default_model" value="${ev("default_model")}" placeholder="gpt-4o-mini / claude-haiku-4-5-20251001 / gemini-1.5-flash"></label>
      <label class="input-label" style="grid-column:1/-1"><span>مفتاح API ${editing ? "(اتركه فارغاً للإبقاء على الحالي)" : ""}</span><input name="api_key" type="password" autocomplete="off" placeholder="${editing ? "••••" + escAttr(editing.key_hint || "") : "sk-..."}"></label>
      <label class="input-label" style="grid-column:1/-1;flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="is_active" ${!editing || editing.is_active ? "checked" : ""} style="width:auto"><span>مفعّل</span></label>
      <div style="grid-column:1/-1;display:flex;gap:8px">
        <button type="submit" class="primary-button">${icon("check")} ${editing ? "حفظ التعديلات" : "إضافة المزوّد"}</button>
        ${editing ? `<button type="button" class="secondary-button" data-action="ai-cancel-edit">إلغاء</button>` : ""}
      </div>
    </form>`;

  // Per-feature binding
  const featuresBlock = Object.keys(AI_FEATURE_LABELS).map(fn => {
    const cfg = features.find(f => f.feature_name === fn) || {};
    const [label, sub] = AI_FEATURE_LABELS[fn];
    const bound = provById(cfg.provider_id);
    const statusPill = cfg.is_enabled === false
      ? `<span class="status-pill">معطّلة</span>`
      : (bound ? `<span class="status-pill paid">${esc(bound.provider_name)}</span>` : `<span class="status-pill">المفتاح الافتراضي</span>`);
    return `<form id="ai-feature-form" data-feature="${escAttr(fn)}" class="dashboard-card form-card" style="margin-bottom:12px">
      <div class="card-heading"><div><h3>${esc(label)} ${statusPill}</h3><p>${esc(sub)}</p></div></div>
      <div class="form-grid">
        <label class="input-label"><span>المزوّد النشط</span><select name="provider_id">${providerOptions(cfg.provider_id)}</select></label>
        <label class="input-label"><span>تجاوز النموذج (اختياري)</span><input name="model_override" value="${escAttr(cfg.model_override || "")}" placeholder="اتركه فارغاً للافتراضي"></label>
        <label class="input-label" style="grid-column:1/-1;flex-direction:row;align-items:center;gap:8px"><input type="checkbox" name="is_enabled" ${cfg.is_enabled !== false ? "checked" : ""} style="width:auto"><span>الميزة مفعّلة</span></label>
        <button type="submit" class="secondary-button" style="grid-column:1/-1">${icon("check")} حفظ</button>
      </div>
    </form>`;
  }).join("");

  // Usage (last 30d)
  const usageKeys = Object.keys(usage);
  const usageBlock = usageKeys.length ? `
    <div class="table-wrap"><table class="admin-table">
      <thead><tr><th>الميزة</th><th>الاستدعاءات</th><th>الوحدات (tokens)</th><th>التكلفة التقديرية</th><th>الأخطاء</th></tr></thead>
      <tbody>${usageKeys.map(k => { const u = usage[k]; const lbl = (AI_FEATURE_LABELS[k] && AI_FEATURE_LABELS[k][0]) || k; return `<tr><td>${esc(lbl)}</td><td>${u.calls}</td><td>${(u.tokens || 0).toLocaleString("ar")}</td><td>$${(u.cost || 0).toFixed(4)}</td><td>${u.errors || 0}</td></tr>`; }).join("")}</tbody>
    </table></div>` : `<p class="creds-summary">لا يوجد استهلاك مسجّل بعد (آخر 30 يوماً).</p>`;

  // Test box
  const testReply = state._adminAITestReply;
  const testBlock = `
    <form id="ai-test-form" class="form-grid">
      <label class="input-label"><span>الميزة</span><select name="feature">${Object.keys(AI_FEATURE_LABELS).filter(f => f !== "embeddings" && f !== "image_enhancement").map(f => `<option value="${f}">${esc(AI_FEATURE_LABELS[f][0])}</option>`).join("")}</select></label>
      <label class="input-label" style="grid-column:1/-1"><span>رسالة تجريبية</span><input name="text" value="مرحبا، كيف أطلب من دكانجي؟"></label>
      <button type="submit" class="secondary-button" style="grid-column:1/-1">${icon("stars")} اختبار عبر البوابة</button>
    </form>
    ${testReply != null ? `<div class="delivery-calculator ${testReply ? "" : "warning"}" style="margin-top:10px">${icon(testReply ? "check" : "close")}<div><strong>${testReply ? "الرد" : "لا يوجد رد"}</strong><p>${testReply ? esc(testReply) : "المزوّد غير مهيّأ أو فشل الاتصال."}</p></div></div>` : ""}`;

  return toggle + `
    ${warn}${errBox}
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>المزوّدون ومفاتيح API</h3><p>تُخزَّن المفاتيح مشفّرة ولا تظهر كاملة. أضِف عدة مزوّدين واختر النشط لكل ميزة بالأسفل.</p></div><button class="icon-button" data-action="ai-refresh" title="تحديث">${icon("download")}</button></div>
      ${providersTable}
    </section>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>${editing ? "تعديل مزوّد" : "إضافة مزوّد"}</h3><p>OpenAI / Anthropic / Google / Replicate.</p></div></div>
      ${providerForm}
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>المزوّد النشط لكل ميزة</h3><p>كل ميزة تنادي البوابة الموحّدة؛ غيّر المزوّد بضغطة دون لمس الكود.</p></div></div>
      ${featuresBlock}
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>اختبار سريع</h3><p>جرّب الرد عبر المزوّد النشط للميزة المختارة.</p></div></div>
      ${testBlock}
    </section>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>الاستهلاك (آخر 30 يوماً)</h3><p>عدد الاستدعاءات والوحدات والتكلفة التقديرية لكل ميزة.</p></div></div>
      ${usageBlock}
    </section>`;
}

function adminContent() {
  if (state.adminContentSection === "featured") return adminContentFeatured();
  if (state.adminContentSection === "plans") return adminContentPlans();
  if (state.adminContentSection === "banners") return adminContentForm("banner");
  if (state.adminContentSection === "offers-hero") return adminContentDailyDeal();
  if (state.adminContentSection === "texts") return adminContentForm("hero");
  if (state.adminContentSection === "join") return adminContentForm("join");
  // [key, icon, title, subtitle, built]
  const cards = [
    ["banners", "megaphone", "بنرات الصفحة الرئيسية", "تعديل نصوص بنر العروض في الرئيسية", true],
    ["offers-hero", "percent", "عرض اليوم", "صورة هيرو صفحة العروض مربوطة بمنتج", true],
    ["featured", "star", "المتاجر المميزة", "اختيار المتاجر الظاهرة في الرئيسية", true],
    ["plans", "wallet", "الخطط والأسعار", "إدارة أسعار الاشتراكات والمزايا", true],
    ["texts", "edit", "النصوص الرئيسية", "تعديل نصوص الهيرو في الصفحة الرئيسية", true],
    ["join", "users", "صفحة انضم كتاجر", "تعديل نصوص نافذة الانضمام", true]
  ];
  return `<div class="content-management-grid">${cards.map(c => `<article class="dashboard-card"><span>${icon(c[1])}</span><h3>${c[2]}</h3><p>${c[3]}</p>${c[4] ? `<button class="secondary-button compact" data-action="content-section" data-section="${c[0]}">إدارة القسم ${icon("arrowLeft")}</button>` : `<button class="secondary-button compact" data-action="toast" data-message="قسم «${c[2]}» قيد الإنشاء — سيُفعَّل قريباً">قريباً</button>`}</article>`).join("")}</div>`;
}

// Content > Plans & pricing: edit the subscription plan shown to merchants on
// the "الاشتراك" page. Saved to site_settings.plan via the admin server
// endpoint (service-role write), then reflected for everyone.
function adminContentPlans() {
  const p = (state.siteSettings && state.siteSettings.plan) || {};
  const v = (k, d) => escAttr(p[k] != null && p[k] !== "" ? String(p[k]) : d);
  const features = (Array.isArray(p.features) && p.features.length) ? p.features
    : ["استقبال طلبات غير محدودة", "رفع المنتجات عبر CSV", "عروض وخصومات", "تقارير شهرية عبر واتساب", "ظهور مميز في نتائج البحث"];
  return `
    <button class="text-button" data-action="content-back">${icon("arrowLeft")} رجوع لإدارة المحتوى</button>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>أسعار الاشتراك حسب التصنيف</h3><p>سعر شهري ثابت لكل تصنيف. يرى كل تاجر سعر تصنيفه فقط في صفحة «الاشتراك» — لا يرى أسعار التصنيفات الأخرى.</p></div></div>
      <div class="table-wrap">
        <table class="admin-table">
          <thead><tr><th>التصنيف</th><th>السعر الشهري</th></tr></thead>
          <tbody>${CATEGORY_SUBSCRIPTION_ROWS.map(([cat, price]) => `<tr><td>${esc(cat)}</td><td><strong>${price.toLocaleString("ar")}</strong> ل.ت / شهرياً</td></tr>`).join("")}</tbody>
        </table>
      </div>
      <p class="creds-summary">التصنيفات غير المذكورة: ${DEFAULT_SUBSCRIPTION_PRICE.toLocaleString("ar")} ل.ت / شهرياً · لا يوجد اشتراك سنوي.</p>
    </section>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>محتوى الخطة (مشترك لكل التصنيفات)</h3><p>الاسم والوصف والمزايا تظهر للتجار في صفحة «الاشتراك». السعر يُحسب تلقائياً حسب تصنيف المتجر.</p></div></div>
      <form id="admin-plan-form" class="form-grid">
        <label class="input-label" style="grid-column:1/-1"><span>اسم الخطة</span><input name="name" value="${v("name", "اشتراك متجر دكانجي")}" required></label>
        <label class="input-label" style="grid-column:1/-1"><span>وصف مختصر</span><input name="tagline" value="${v("tagline", "كل الأدوات التي تحتاجها لتنمية متجرك واستقبال طلبات بلا حدود.")}"></label>
        <label class="input-label" style="grid-column:1/-1"><span>المزايا (ميزة واحدة في كل سطر)</span><textarea name="features" rows="6">${escAttr(features.join("\n"))}</textarea></label>
        <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ الخطة</button>
      </form>
    </section>`;
}

// Generic editor for text content sections (banner, hero, join). Each saves
// its fields to site_settings[key]; the matching render point reads
// state.siteSettings[key] with these `def` values as fallbacks, so the live
// site is unchanged until something is actually edited.
const CONTENT_SECTIONS = {
  hero: {
    // Only "eyebrow" is actually read by the Hero V2 markup (app.js's homePage(),
    // ~line 2739) — the rotating 4-slide redesign hardcodes each slide's own
    // headline/lead text per-slide, so a single titleTop/titleEm/subtitle no
    // longer maps onto anything. Those 3 fields used to save successfully while
    // silently doing nothing on the storefront; removed rather than leave a
    // false "it saved" toast with no visible effect. Making the hero headline
    // editable again would need per-slide fields wired into those 4 slides.
    title: "نصوص الصفحة الرئيسية (الهيرو)", key: "heroTexts",
    fields: [
      { name: "eyebrow", label: "النص العلوي الصغير", def: "كل ما تحتاجه من دكاكين حيك" }
    ]
  },
  banner: {
    title: "بنر العروض في الصفحة الرئيسية", key: "homeBanner",
    fields: [
      { name: "eyebrow", label: "النص العلوي الصغير", def: "عروض لا تفوّت" },
      { name: "title", label: "العنوان", def: "وفّر أكثر على طلباتك اليومية" },
      { name: "subtitle", label: "الوصف", def: "خصومات مختارة من متاجر الحي، تتجدد باستمرار.", area: true },
      { name: "button", label: "نص الزر", def: "شاهد كل العروض" },
      { name: "link", label: "رابط عند الضغط (اختياري) — مثل #stores أو /store/5 أو https://...", def: "", type: "url" },
      { name: "image", label: "صورة البنر (اختياري — تظهر بدل بطاقات العروض)", def: "", type: "image" }
    ]
  },
  join: {
    title: "نافذة «انضم كتاجر»", key: "joinPage",
    fields: [
      { name: "title", label: "العنوان", def: "انضم إلى دكانجي" },
      { name: "subtitle", label: "الوصف", def: "ابدأ باستقبال طلبات جديدة من عملاء منطقتك." },
      { name: "note", label: "ملاحظة بعد الإنشاء", def: "بعد الإنشاء تدخل لوحة التحكم لإكمال البيانات وإضافة منتجاتك، ثم يظهر متجرك للعملاء.", area: true }
    ]
  }
};
function adminContentForm(sectionKey) {
  const cfg = CONTENT_SECTIONS[sectionKey];
  const saved = (state.siteSettings && state.siteSettings[cfg.key]) || {};
  const v = f => escAttr(saved[f.name] != null && saved[f.name] !== "" ? String(saved[f.name]) : f.def);
  return `
    <button class="text-button" data-action="content-back">${icon("arrowLeft")} رجوع لإدارة المحتوى</button>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>${cfg.title}</h3><p>التعديل يُحفظ ويظهر لكل الزوّار فوراً.</p></div></div>
      <form id="content-edit-form" data-section="${sectionKey}" class="form-grid">
        ${cfg.fields.map(f => {
          if (f.type === "image") {
            const cur = saved[f.name] != null ? String(saved[f.name]) : "";
            return `<div class="input-label" style="grid-column:1/-1"><span>${f.label}</span>
              <input type="hidden" name="${f.name}" value="${escAttr(cur)}">
              <div class="image-preview" id="content-image-preview">${cur ? `<img src="${escAttr(cur)}" alt="">` : icon("box")}</div>
              <div style="display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap">
                <label class="upload-tile" style="flex:0 0 auto">${icon("upload")}<span>رفع صورة</span><input type="file" id="content-image-file" accept="image/*" hidden></label>
                <button type="button" class="secondary-button compact" data-action="content-image-remove">${icon("trash")} إزالة الصورة</button>
              </div></div>`;
          }
          return `<label class="input-label" style="grid-column:1/-1"><span>${f.label}</span>${f.area ? `<textarea name="${f.name}" rows="3">${v(f)}</textarea>` : `<input name="${f.name}" value="${v(f)}"${f.type === "url" ? ' dir="ltr"' : ""}>`}</label>`;
        }).join("")}
        <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ</button>
      </form>
    </section>`;
}
// Content > «عرض اليوم»: the offers-page hero — upload a banner image and bind
// it to one product (store select → product select); visitors who tap the hero
// land on that product. Saved to site_settings.dailyDeal; clearing the image
// restores the default offers hero. Reuses the content-image-file/-preview ids
// so the shared upload + remove handlers work here without extra JS.
function adminContentDailyDeal() {
  const saved = (state.siteSettings && state.siteSettings.dailyDeal) || {};
  const savedProduct = saved.productId ? products.find(p => p.id === Number(saved.productId)) : null;
  const savedStoreId = Number(saved.storeId) || (savedProduct ? savedProduct.storeId : "");
  const approvedStores = stores.filter(isStoreApproved).slice().sort((a, b) => a.name.localeCompare(b.name, "ar"));
  // Keep the saved product selectable even if it went unavailable since the
  // deal was bound — otherwise the select silently falls back to the
  // placeholder, the form looks unbound, and re-submitting (e.g. just to swap
  // the image) gets rejected by the image-without-product guard below.
  const storeProducts = savedStoreId ? products.filter(p => p.storeId === Number(savedStoreId) && (p.available || p.id === Number(saved.productId))) : [];
  const cur = saved.image || "";
  return `
    <button class="text-button" data-action="content-back">${icon("arrowLeft")} رجوع لإدارة المحتوى</button>
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>عرض اليوم — هيرو صفحة العروض</h3><p>ارفع صورة واربطها بمنتج من أحد المتاجر؛ تظهر أعلى صفحة العروض والضغط عليها يفتح المنتج. إزالة الصورة تعيد الهيرو الافتراضي.</p></div></div>
      <form id="daily-deal-form" class="form-grid">
        <div class="input-label" style="grid-column:1/-1"><span>صورة العرض</span>
          <input type="hidden" name="image" value="${escAttr(cur)}">
          <div class="image-preview" id="content-image-preview">${cur ? `<img src="${escAttr(cur)}" alt="">` : icon("box")}</div>
          <div style="display:flex;gap:.5rem;margin-top:.5rem;flex-wrap:wrap">
            <label class="upload-tile" style="flex:0 0 auto">${icon("upload")}<span>رفع صورة</span><input type="file" id="content-image-file" accept="image/*" hidden></label>
            <button type="button" class="secondary-button compact" data-action="content-image-remove">${icon("trash")} إزالة الصورة</button>
          </div></div>
        <label class="input-label"><span>المتجر</span>
          <select id="dd-store-select" name="storeId">
            <option value="">اختر المتجر…</option>
            ${approvedStores.map(s => `<option value="${s.id}" ${Number(savedStoreId) === s.id ? "selected" : ""}>${escAttr(s.name)}</option>`).join("")}
          </select></label>
        <label class="input-label"><span>المنتج المرتبط</span>
          <select id="dd-product-select" name="productId" ${storeProducts.length ? "" : "disabled"}>
            <option value="">${storeProducts.length ? "اختر المنتج…" : "اختر المتجر أولاً"}</option>
            ${storeProducts.map(p => `<option value="${p.id}" ${Number(saved.productId) === p.id ? "selected" : ""}>${escAttr(p.name)}${p.oldPrice ? " — عليه خصم" : ""}${p.available ? "" : " (غير متوفر حالياً)"}</option>`).join("")}
          </select></label>
        <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ</button>
      </form>
    </section>`;
}
// Admin > التصنيفات: dedicated top-level section to add/edit/delete/hide +
// reorder store categories. One list drives three places at once: the
// homepage tiles ("ماذا تحتاج اليوم؟"), the stores filter chips, and the
// merchant category picker (see categoriesList()/storeCategoryNames()).
// Persisted as one JSON blob at site_settings.categories.items.
function adminCategoriesSection() {
  const items = categoriesList();
  const visibleCount = items.filter(c => !c.hidden).length;
  return `
    <div class="dashboard-toolbar"><p class="creds-summary">${items.length} تصنيف — ${visibleCount} ظاهر، ${items.length - visibleCount} مخفي</p><div class="toolbar-actions"><button class="primary-button compact" data-action="cat-add">${icon("plus")} إضافة تصنيف</button></div></div>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>تصنيفات المتاجر</h3><p>أضِف أو احذف تصنيفاً، عدّل اسمه أو صورته، أظهِره/أخفِه، ورتّبه. إخفاء تصنيف يزيله من الرئيسية وفلتر المتاجر ونموذج انضمام التجار، دون أن يغيّر تصنيف أي متجر مسجَّل عليه أصلاً.</p></div></div>
      <div class="admin-store-list">${items.length ? items.map((c, i) => {
        const usage = stores.filter(s => s.category === c.name).length;
        return `<article>
        <span class="avatar-mini">${c.image ? `<img src="${escAttr(c.image)}" alt="">` : icon("box")}</span>
        <div style="flex:1 1 auto;min-width:0"><strong>${escAttr(c.name || "")}</strong><small>${escAttr(c.caption || "")}${c.caption ? " · " : ""}${usage ? `${usage} متجر` : "لا متاجر"}</small></div>
        <span style="display:flex;gap:.25rem;align-items:center;flex-wrap:wrap">
          <button class="table-action" data-action="cat-move" data-index="${i}" data-dir="up" ${i === 0 ? "disabled" : ""} aria-label="تحريك لأعلى">▲</button>
          <button class="table-action" data-action="cat-move" data-index="${i}" data-dir="down" ${i === items.length - 1 ? "disabled" : ""} aria-label="تحريك لأسفل">▼</button>
          <button class="table-action" data-action="cat-edit" data-index="${i}" aria-label="تعديل">${icon("edit")}</button>
          <button class="table-action danger" data-action="cat-delete" data-index="${i}" aria-label="حذف">${icon("trash")}</button>
          <label style="display:flex;align-items:center;gap:.3rem;cursor:pointer;white-space:nowrap"><input type="checkbox" data-action="toggle-category" data-index="${i}" ${c.hidden ? "" : "checked"}><b>${c.hidden ? "مخفي" : "ظاهر"}</b></label>
        </span>
      </article>`;
      }).join("") : `<div class="empty-managed">${icon("filter")}<p>لا توجد تصنيفات بعد. اضغط «إضافة تصنيف».</p></div>`}</div>
    </section>`;
}
// Add/edit a single homepage category (name, caption, image upload).
function openCategoryEditModal(index) {
  const items = categoriesList();
  const editing = (index != null && index >= 0 && items[index]) ? items[index] : null;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">التصنيفات</span><h2>${editing ? "تعديل تصنيف" : "إضافة تصنيف"}</h2>
    <form id="category-form" data-index="${index != null && index >= 0 ? index : ""}" class="form-grid">
      <label class="input-label" style="grid-column:1/-1"><span>اسم التصنيف</span><input name="name" value="${escAttr(editing ? editing.name : "")}" required placeholder="مثال: خضار وفواكه"></label>
      <label class="input-label" style="grid-column:1/-1"><span>وصف قصير</span><input name="caption" value="${escAttr(editing ? editing.caption : "")}" placeholder="مثال: طازج يومياً"></label>
      <input type="hidden" name="image" value="${escAttr(editing ? editing.image : "")}">
      <div class="input-label" style="grid-column:1/-1"><span>صورة التصنيف</span>
        <div class="image-preview" id="category-image-preview">${editing && editing.image ? `<img src="${escAttr(editing.image)}" alt="">` : icon("box")}</div>
        <label class="upload-tile">${icon("upload")}<span>رفع صورة من الجهاز</span><input type="file" id="category-image-file" accept="image/*" hidden></label>
      </div>
      <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ التصنيف</button>
    </form>
  `, "");
}
// ============================================================================
// لوحة الإدارة — البانرات
// ============================================================================
function bannerNewId() {
  return "bnr_" + Math.random().toString(36).slice(2, 10);
}

function saveBannerSettings(next) {
  saveContentSetting("banners", next);
}

// Loads aggregate stats for the banners tab. Kept separate from the banner
// definitions (which come from site_settings) because stats live in a table
// that may not exist yet — `enabled:false` means "migration not run", which the
// UI must show honestly rather than rendering zeros that look like real data.
// ══════════════════════ Admin: notifications & promo campaigns ══════════════
// Server: api/notifications.js. Schema: migrations/20260720_notifications_system.sql.

async function notifAdminApi(action, { method = "GET", id, body, params } = {}) {
  const qs = new URLSearchParams({ action });
  if (id) qs.set("id", id);
  // Params go through URLSearchParams as separate keys — never appended onto
  // the action string. Doing that encodes the '&' into the action value itself
  // and the server matches no branch at all (a real bug hit on the campaigns
  // tab and fixed on 2026-07-19).
  if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== "") qs.set(k, v); });
  try {
    const r = await fetch(`/api/notifications?${qs}`, {
      method,
      headers: { "Content-Type": "application/json", "x-admin-token": state.adminKey || "" },
      body: method === "POST" ? JSON.stringify(body || {}) : undefined
    });
    if (r.status === 403) { lockAdmin(); return null; }
    return await r.json().catch(() => null);
  } catch (e) { return null; }
}

async function loadAdminNotifications() {
  const [list, segs, settings] = await Promise.all([
    notifAdminApi("list"),
    notifAdminApi("segments", { params: state.notifSegmentStoreId ? { store_id: state.notifSegmentStoreId } : null }),
    notifAdminApi("settings")
  ]);
  state.adminNotifCampaigns = (list && list.campaigns) || [];
  state.adminNotifSegments = (segs && segs.segments) || [];
  // setup_required means the SQL file hasn't been run. Surfaced explicitly
  // rather than rendering zeros, which would read as "nobody to send to".
  state.adminNotifSetupRequired = !!((list && list.setup_required) || (segs && segs.setup_required));
  state.adminNotifVapid = !!(segs && segs.vapid);
  state.adminNotifFcm = !!(segs && segs.fcm);
  state.adminNotifSettings = (settings && settings.settings) || null;
  render();
}

function notifStatusLabel(s) {
  return { draft: "مسودة", scheduled: "مجدولة", building: "قيد البناء", ready: "جاهزة",
           sending: "جارٍ الإرسال", paused: "متوقفة", done: "منتهية", canceled: "ملغاة" }[s] || s;
}
function notifStatusClass(s) {
  return { done: "ok", sending: "warn", ready: "ok", paused: "warn", canceled: "bad", draft: "" }[s] || "";
}

const NOTIF_CHANNEL_LABEL = { inapp: "داخل التطبيق", webpush: "إشعار متصفح", fcm: "إشعار أندرويد", whatsapp: "واتساب" };

function adminNotifications() {
  const segs = state.adminNotifSegments || [];
  const campaigns = state.adminNotifCampaigns || [];
  const st = state.adminNotifSettings;
  const draft = state.notifDraft || {};

  if (state.adminNotifSetupRequired) {
    return `<section class="admin-section">
      <div class="setup-required-card">
        ${icon("alert")}
        <h3>نظام الإشعارات غير مُفعّل بعد</h3>
        <p>جداول الإشعارات غير موجودة في قاعدة البيانات. شغّل هذا الملف مرة واحدة في
           <strong>Supabase → SQL Editor</strong> ثم أعد تحميل الصفحة:</p>
        <code>migrations/20260720_notifications_system.sql</code>
        <p class="muted">الملف نفسه يُصلح أيضاً لوحة نقرات البانرات وحفظ تصنيفات المتاجر — كلاهما معطّل حالياً لنفس السبب.</p>
      </div>
    </section>`;
  }

  const segCards = segs.map(s => {
    const blocked = s.needs_param;
    const count = s.count;
    const reach = s.reachable || {};
    return `<button class="notif-seg-card ${draft.segment === s.key ? "active" : ""} ${blocked ? "blocked" : ""}"
              data-action="notif-pick-segment" data-key="${escAttr(s.key)}">
      <strong>${esc(s.label)}</strong>
      <span class="notif-seg-count">${blocked ? "يحتاج تحديد متجر" : (count === null ? "—" : arCount(count, "شخص واحد", "شخصان", "أشخاص", "شخصاً"))}</span>
      <small>${esc(s.desc)}</small>
      ${blocked || count === null ? "" : `<span class="notif-seg-reach">
        <i title="يمكن الوصول إليهم داخل التطبيق">تطبيق ${reach.inapp || 0}</i>
        <i title="يمكن الوصول إليهم بإشعار متصفح">متصفح ${reach.webpush || 0}</i>
        <i title="يمكن الوصول إليهم عبر واتساب">واتساب ${reach.whatsapp || 0}</i>
      </span>`}
    </button>`;
  }).join("");

  const selected = segs.find(s => s.key === draft.segment);
  const chan = Array.isArray(draft.channels) ? draft.channels : ["inapp"];
  // The honest reachability number for the chosen segment + channels. This is
  // the figure that stops an admin composing a campaign that reaches nobody.
  const reachTotal = selected && selected.reachable
    ? Math.max(...chan.map(c => selected.reachable[c] || 0), 0) : 0;

  return `<section class="admin-section notif-admin">

    <div class="notif-settings-bar">
      <div>
        <strong>${icon("settings")} إعدادات الإرسال</strong>
        <small>حواجز تمنع إزعاج العملاء — تُطبَّق على كل الحملات الترويجية تلقائياً.</small>
      </div>
      <label>ساعات الهدوء من
        <input type="number" min="0" max="23" id="notif-quiet-start" value="${st ? st.quietHours.start : 22}">
      </label>
      <label>إلى
        <input type="number" min="0" max="23" id="notif-quiet-end" value="${st ? st.quietHours.end : 9}">
      </label>
      <label>أقصى رسائل ترويجية للعميل يومياً
        <input type="number" min="0" max="20" id="notif-max-day" value="${st ? st.maxPromoPerDay : 2}">
      </label>
      <button class="secondary-button" data-action="notif-save-settings">حفظ</button>
    </div>
    ${state.adminNotifVapid ? "" : `<p class="notif-warn">${icon("alert")} إشعارات المتصفح غير مُفعّلة (مفاتيح VAPID غير مضبوطة) — ستُتخطّى هذه القناة عند الإرسال.</p>`}
    ${state.adminNotifFcm
      ? `<p class="notif-warn notif-warn--ok">${icon("check")} إشعارات الجوال (Firebase) مُفعّلة — تصل شريط إشعارات أندرويد حتى والتطبيق مغلق.</p>`
      : `<p class="notif-warn">${icon("alert")} إشعارات الجوال معطّلة: لم تُضبط مفاتيح Firebase على الخادم، فلن يصل الإشعار شريط الإشعارات — سيظهر فقط داخل التطبيق عند فتحه. القناة مبنية بالكامل وتُفعَّل بإضافة <code>FCM_SERVICE_ACCOUNT</code> و<code>google-services.json</code>.</p>`}

    <h3 class="notif-h">١. اختر الشريحة</h3>
    <div class="notif-seg-grid">${segCards}</div>
    ${selected && selected.needs
      ? `<div class="notif-param-row"><label>المتجر
           <select id="notif-store-param" data-action="notif-store-param">
             <option value="">— اختر متجراً —</option>
             ${stores.filter(isStoreApproved).map(s => `<option value="${escAttr(s.id)}" ${String(state.notifSegmentStoreId) === String(s.id) ? "selected" : ""}>${esc(s.name)}</option>`).join("")}
           </select></label></div>` : ""}

    <h3 class="notif-h">٢. اكتب الرسالة</h3>
    <div class="notif-compose">
      <label>عنوان الإشعار<input id="notif-title" maxlength="200" value="${escAttr(draft.title || "")}" placeholder="مثال: خصم ٢٠٪ اليوم فقط"></label>
      <label>نص الرسالة<textarea id="notif-body" maxlength="1000" rows="3" placeholder="تفاصيل مختصرة تشجّع العميل على الطلب">${esc(draft.body || "")}</textarea></label>
      <label>رابط الفتح عند النقر<input id="notif-link" maxlength="500" value="${escAttr(draft.deep_link || "")}" placeholder="/offers أو /store/pasa-pizzeria-restaurant"></label>
      <label>اسم الحملة (للإدارة فقط)<input id="notif-name" maxlength="200" value="${escAttr(draft.name || "")}" placeholder="حملة عروض الجمعة"></label>
      <div class="notif-channels">
        <span>قنوات الإرسال:</span>
        ${["inapp", "webpush", "fcm", "whatsapp"].map(c => `
          <label class="notif-chan"><input type="checkbox" data-action="notif-toggle-channel" data-chan="${c}" ${chan.includes(c) ? "checked" : ""}> ${NOTIF_CHANNEL_LABEL[c]}</label>`).join("")}
      </div>
      ${chan.includes("whatsapp") ? `
        <p class="notif-warn">${icon("alert")} واتساب لا يرسل نصاً حراً — يتطلب قالباً معتمداً من Meta. عند تجهيز المستلمين تُنشأ حملة واتساب مرتبطة تلقائياً، وتُرسَل من تبويب «الحملات» بنفس المحرك المُجرَّب.</p>
        <div class="notif-wa-row">
          <label>اسم قالب واتساب<input id="notif-wa-template" maxlength="200" dir="ltr" value="${escAttr(draft.wa_template_name || "")}" placeholder="مثال: dukkanci_promo"></label>
          <label>لغة القالب<input id="notif-wa-lang" maxlength="12" dir="ltr" value="${escAttr(draft.wa_template_lang || "ar")}"></label>
        </div>` : ""}
    </div>

    <div class="notif-audience-bar">
      ${selected
        ? (reachTotal > 0
            ? `<strong>${icon("users")} ستصل هذه الحملة إلى ${arCount(reachTotal, "شخص واحد", "شخصين", "أشخاص", "شخصاً")}</strong>`
            : `<strong class="bad">${icon("alert")} لن تصل هذه الحملة إلى أحد بالقنوات المختارة</strong>`)
        : `<span class="muted">اختر شريحة لعرض حجم الجمهور</span>`}
      <div class="notif-actions">
        <button class="secondary-button" data-action="notif-test-send" ${!draft.title ? "disabled" : ""}>${icon("bell")} جرّبها على جهازي</button>
        <button class="primary-button" data-action="notif-create" ${!draft.title || !draft.segment || reachTotal === 0 ? "disabled" : ""}>${icon("check")} أنشئ الحملة</button>
      </div>
    </div>

    <h3 class="notif-h">الحملات</h3>
    ${campaigns.length ? `<div class="campaigns-table-wrap"><table class="admin-table">
      <thead><tr><th>الحملة</th><th>الشريحة</th><th>القنوات</th><th>الحالة</th><th>أُرسلت</th><th>إجراءات</th></tr></thead>
      <tbody>${campaigns.map(c => {
        const total = Number(c.total_recipients) || 0;
        const sent = Number(c.sent_count) || 0;
        const pct = total ? Math.round((sent / total) * 100) : 0;
        const segLabel = (segs.find(s => s.key === c.segment) || {}).label || c.segment;
        return `<tr>
          <td><strong>${esc(c.name || "")}</strong><br><small>${esc(c.title || "")}</small></td>
          <td>${esc(segLabel)}</td>
          <td>${(Array.isArray(c.channels) ? c.channels : []).map(x => esc(NOTIF_CHANNEL_LABEL[x] || x)).join("، ")}</td>
          <td><span class="status-chip ${notifStatusClass(c.status)}">${esc(notifStatusLabel(c.status))}</span></td>
          <td>${sent} / ${total}${total ? ` <small>(${pct}%)</small>` : ""}</td>
          <td class="notif-row-actions">
            ${c.status === "draft" ? `<button class="mini-button" data-action="notif-build" data-id="${escAttr(c.id)}">جهّز المستلمين</button>` : ""}
            ${c.status === "ready" ? `<button class="mini-button ok" data-action="notif-start" data-id="${escAttr(c.id)}">ابدأ الإرسال</button>` : ""}
            ${c.status === "sending" ? `<button class="mini-button" data-action="notif-pause" data-id="${escAttr(c.id)}">إيقاف مؤقت</button>` : ""}
            ${c.status === "paused" ? `<button class="mini-button ok" data-action="notif-resume" data-id="${escAttr(c.id)}">استئناف</button>` : ""}
            ${["draft", "ready", "paused"].includes(c.status) ? `<button class="mini-button bad" data-action="notif-delete" data-id="${escAttr(c.id)}">حذف</button>` : ""}
          </td>
        </tr>`;
      }).join("")}</tbody></table></div>`
      : `<div class="empty-managed">${icon("megaphone")}<p>لا توجد حملات بعد — اختر شريحة واكتب رسالتك أعلاه.</p></div>`}
  </section>`;
}

// Reads the composer straight from the DOM so the live audience counter reflects
// what is on screen, without a round-trip or a re-render on every keystroke.
function notifReadDraft() {
  const g = id => (document.getElementById(id) || {}).value || "";
  const d = state.notifDraft || (state.notifDraft = {});
  d.title = g("notif-title");
  d.body = g("notif-body");
  d.deep_link = g("notif-link");
  d.name = g("notif-name") || d.title;
  if (document.getElementById("notif-wa-template")) {
    d.wa_template_name = g("notif-wa-template");
    d.wa_template_lang = g("notif-wa-lang") || "ar";
  }
  return d;
}

async function notifCreateCampaign() {
  const d = notifReadDraft();
  if (!d.title || !d.segment) return showToast("اكتب عنواناً واختر شريحة أولاً");
  const params = {};
  if (state.notifSegmentStoreId) params.store_id = Number(state.notifSegmentStoreId);
  const res = await notifAdminApi("create", {
    method: "POST",
    body: { ...d, segment_params: params, channels: d.channels || ["inapp"] }
  });
  if (!res || !res.ok) return showToast((res && res.error) || "تعذّر إنشاء الحملة");
  showToast("أُنشئت الحملة — جهّز المستلمين لبدء الإرسال");
  state.notifDraft = { channels: d.channels };
  loadAdminNotifications();
}

async function notifBuild(id) {
  showToast("جارٍ تجهيز قائمة المستلمين…");
  const res = await notifAdminApi("build", { method: "POST", id });
  if (!res || !res.ok) return showToast((res && res.error) === "setup_required" ? "شغّل ملف SQL أولاً" : "تعذّر التجهيز");
  if (!res.total) return showToast("لا يوجد مستلمون مطابقون لهذه الشريحة");

  // Report the WhatsApp bridge honestly. Silence here would let an admin assume
  // the WhatsApp half went out when it never got created.
  const wa = res.whatsapp;
  if (wa && wa.created) {
    showToast(`جاهزة: ${arCount(res.total, "مستلم واحد", "مستلمان", "مستلمين", "مستلماً")} — وأُنشئت حملة واتساب لـ${wa.phones} رقماً، أرسلها من تبويب «الحملات»`);
  } else if (wa && wa.reason === "no_template") {
    showToast("جُهّزت الإشعارات، لكن حملة واتساب لم تُنشأ: اكتب اسم قالب Meta المعتمد أولاً");
  } else if (wa && wa.reason === "no_phones") {
    showToast("جُهّزت الإشعارات، لكن لا أرقام هواتف في هذه الشريحة لإرسال واتساب");
  } else if (wa && !wa.created) {
    showToast("جُهّزت الإشعارات، لكن تعذّر إنشاء حملة واتساب المرتبطة");
  } else {
    showToast(`جاهزة: ${arCount(res.total, "مستلم واحد", "مستلمان", "مستلمين", "مستلماً")}`);
  }
  loadAdminNotifications();
}

// Drives send-batch one call at a time. A generation counter plus scheduling the
// next tick only AFTER the previous await resolves keeps exactly one batch in
// flight — the client half of the double-send defence (the server half is the
// status=eq.pending guard inside claimBatch).
let _notifPollGen = 0;
function startNotifPoll(id) {
  const gen = ++_notifPollGen;
  const tick = async () => {
    if (gen !== _notifPollGen) return;
    const res = await notifAdminApi("send-batch", { method: "POST", id });
    if (gen !== _notifPollGen) return;
    if (!res) { stopNotifPoll(); return; }
    if (res.paused === "quiet_hours") {
      showToast(`ساعات الهدوء (الساعة ${res.local_hour}) — سيُستأنف الإرسال الساعة ${res.resume_at}`);
      stopNotifPoll(); loadAdminNotifications(); return;
    }
    if (res.done) { showToast("انتهى إرسال الحملة"); stopNotifPoll(); loadAdminNotifications(); return; }
    loadAdminNotifications();
    setTimeout(tick, 2500);
  };
  tick();
}
function stopNotifPoll() { _notifPollGen++; }

async function notifTestSend() {
  const d = notifReadDraft();
  const uid = getDeviceUid();
  if (!uid) return showToast("تعذّر تحديد هذا الجهاز");
  await registerDevice();
  const res = await notifAdminApi("test-send", { method: "POST", body: { ...d, device_uid: uid } });
  if (!res || !res.ok) return showToast("تعذّر الإرسال التجريبي");
  showToast(res.push && res.push.ok ? "أُرسل إشعار تجريبي لهذا الجهاز" : "أُضيف للصندوق — فعّل إشعارات المتصفح لتصلك كإشعار منبثق");
  loadCustomerNotifications(true);
}

async function notifSaveSettings() {
  const g = id => Number((document.getElementById(id) || {}).value);
  const res = await notifAdminApi("save-settings", {
    method: "POST",
    body: { quietStart: g("notif-quiet-start"), quietEnd: g("notif-quiet-end"), maxPromoPerDay: g("notif-max-day") }
  });
  showToast(res && res.ok ? "حُفظت الإعدادات" : "تعذّر الحفظ");
  if (res && res.ok) state.adminNotifSettings = res.settings;
}

function loadAdminBannerStats(days) {
  const range = days || (state.adminBannerStats && state.adminBannerStats.days) || 30;
  state.adminBannerStats = { ...(state.adminBannerStats || {}), loading: true, days: range };
  render();
  // POST, not GET: api/notify-order.js handles GET actions in a separate earlier
  // block that ends in a bare 403 — every action added to the POST section (like
  // this one) must be called with POST or it silently falls through to that 403.
  adminApi("banner-stats", { method: "POST", params: { days: range } })
    .then(res => {
      const map = {};
      (res.rows || []).forEach(r => { map[r.banner_id] = r; });
      state.adminBannerStats = { loading: false, enabled: res.enabled !== false, days: range, map, error: null };
      render();
    })
    .catch(err => {
      state.adminBannerStats = { loading: false, enabled: false, days: range, map: {}, error: String(err && err.message || err) };
      render();
    });
}

const BANNER_STATE_BADGE = {
  live: ["نشط الآن", "ok"],
  scheduled: ["مجدول", "warn"],
  expired: ["منتهي", "muted"],
  paused: ["متوقف", "muted"]
};

function bannerScheduleLabel(banner) {
  const start = banner.startAt ? formatBannerDate(banner.startAt) : "";
  const end = banner.endAt ? formatBannerDate(banner.endAt) : "";
  if (start && end) return `${start} ← ${end}`;
  if (start) return `من ${start}`;
  if (end) return `حتى ${end}`;
  return "دائم (بلا تاريخ انتهاء)";
}

function formatBannerDate(value) {
  const ms = bannerTime(value, false);
  if (!ms) return String(value || "");
  try { return new Date(ms).toLocaleDateString("ar-EG", { day: "numeric", month: "short", year: "numeric" }); }
  catch (e) { return String(value); }
}

function bannerTargetLabel(banner) {
  const type = banner.linkType || "none";
  const value = String(banner.linkValue == null ? "" : banner.linkValue).trim();
  if (type === "none" || !value) return "بلا رابط";
  if (type === "store") { const s = getStore(Number(value)); return s ? `متجر: ${s.name}` : `⚠ متجر غير موجود (${value})`; }
  if (type === "product") { const p = products.find(x => x.id === Number(value)); return p ? `منتج: ${p.name}` : `⚠ منتج غير موجود (${value})`; }
  if (type === "category") return CATEGORY_MAP[value] ? `قسم: ${CATEGORY_MAP[value]}` : `⚠ قسم غير موجود (${value})`;
  return `رابط: ${value}`;
}

function adminBanners() {
  const { items, limits } = bannerSettings();
  const stats = state.adminBannerStats || {};
  const statMap = stats.map || {};
  const now = Date.now();
  const liveCount = items.filter(b => bannerScheduleState(b, now) === "live").length;

  const ranges = [[7, "٧ أيام"], [30, "٣٠ يوم"], [90, "٩٠ يوم"]];
  const activeRange = stats.days || 30;

  const totalImpressions = Object.values(statMap).reduce((s, r) => s + Number(r.impressions || 0), 0);
  const totalClicks = Object.values(statMap).reduce((s, r) => s + Number(r.clicks || 0), 0);
  const ctr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(1) + "%" : "—";
  const kpi = (val, label, ic) => `<div class="kpi-card"><span class="kpi-icon">${icon(ic)}</span><div class="kpi-body"><b>${val}</b><small>${label}</small></div></div>`;

  // Honest empty state: distinguishes "tracking isn't installed" from "zero clicks".
  const statsBody = stats.loading
    ? `<div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل الإحصاءات…</p></div>`
    : stats.enabled === false
      ? `<div class="empty-managed banner-stats-off">${icon("shield")}<p><strong>تتبّع البانرات غير مُفعّل بعد.</strong><br>
          البانرات نفسها تعمل وتظهر للزوار بشكل طبيعي — الناقص هو جدول تسجيل النقرات فقط.<br>
          لتفعيله: افتح <b>Supabase → SQL Editor</b> وشغّل الملف
          <code dir="ltr">migrations/20260719_banners_and_banner_events.sql</code> مرة واحدة، ثم اضغط «تحديث».<br>
          <small>حتى ذلك الحين لا تُعرض أرقام هنا عمداً، كي لا تبدو الأصفار كأنها «صفر نقرة» حقيقية.</small></p></div>`
      : !items.length
        ? `<div class="empty-managed">${icon("chart")}<p>أضِف بانراً أولاً لتبدأ القياس.</p></div>`
        : `<div class="kpi-grid">${kpi(totalImpressions.toLocaleString("ar"), `ظهور خلال ${activeRange} يوم`, "chart")}${kpi(totalClicks.toLocaleString("ar"), "نقرة", "star")}${kpi(ctr, "متوسط معدل النقر (CTR)", "percent")}</div>
          <div class="campaigns-table-wrap"><table class="admin-table">
            <thead><tr><th>البانر</th><th>المكان</th><th>ظهور</th><th>نقرات</th><th>CTR</th><th>موقع/تطبيق</th></tr></thead>
            <tbody>${[...items].sort((a, b) => Number((statMap[b.id] || {}).clicks || 0) - Number((statMap[a.id] || {}).clicks || 0)).map(b => {
              const r = statMap[b.id] || {};
              const imp = Number(r.impressions || 0), clk = Number(r.clicks || 0);
              const rowCtr = imp ? ((clk / imp) * 100).toFixed(1) + "%" : "—";
              const place = BANNER_PLACEMENTS.find(p => p.key === b.placement);
              return `<tr><td>${esc(b.title || b.headline || b.id)}</td><td><small>${esc(place ? place.label : b.placement)}</small></td><td>${imp.toLocaleString("ar")}</td><td><b>${clk.toLocaleString("ar")}</b></td><td>${rowCtr}</td><td><small>${Number(r.web_clicks || 0)} / ${Number(r.app_clicks || 0)}</small></td></tr>`;
            }).join("")}</tbody>
          </table></div>`;

  return `
    <div class="dashboard-toolbar">
      <p class="creds-summary">${items.length} بانر — ${liveCount} نشط الآن</p>
      <div class="toolbar-actions">
        ${ranges.map(([d, l]) => `<button class="${activeRange === d ? "primary-button" : "secondary-button"} compact" data-action="banner-range" data-days="${d}">${l}</button>`).join("")}
        <button class="secondary-button compact" data-action="banner-stats-refresh">${icon("filter")} تحديث</button>
        <button class="primary-button compact" data-action="banner-add">${icon("plus")} إضافة بانر</button>
      </div>
    </div>

    <section class="dashboard-card">
      <div class="card-heading"><div><h3>أداء البانرات</h3><p>الظهور يُحتسب مرة واحدة لكل زائر لكل بانر عند وصوله فعلاً لشاشته (وليس بمجرد وجوده في الصفحة)، فيكون معدل النقر واقعياً.</p></div></div>
      ${statsBody}
    </section>

    ${BANNER_PLACEMENTS.map(place => {
      const list = items.filter(b => b.placement === place.key).sort((a, b) => (Number(a.sort) || 0) - (Number(b.sort) || 0));
      const limit = bannerPlacementLimit(place.key);
      return `
      <section class="dashboard-card">
        <div class="card-heading">
          <div><h3>${esc(place.label)}</h3><p>${esc(place.hint)}</p></div>
          <label class="input-label banner-limit-field"><span>أقصى عدد معروض</span>
            <input type="number" min="1" max="12" value="${limit}" data-action="banner-limit" data-placement="${place.key}">
          </label>
        </div>
        ${list.length > limit ? `<p class="banner-limit-note">${icon("shield")} يوجد ${list.length} بانر هنا لكن الحد الأقصى ${limit} — الزائد لن يُعرض للزوار (الترتيب يحدد الأولوية).</p>` : ""}
        <div class="admin-store-list">${list.length ? list.map((b, i) => {
          const st = bannerScheduleState(b, now);
          const [badgeText, badgeTone] = BANNER_STATE_BADGE[st];
          const r = statMap[b.id] || {};
          const imp = Number(r.impressions || 0), clk = Number(r.clicks || 0);
          const overLimit = i >= limit;
          const targetLabel = bannerTargetLabel(b);
          const broken = targetLabel.startsWith("⚠");
          return `<article class="${overLimit ? "banner-row-over" : ""}">
            <span class="avatar-mini banner-thumb">${b.image ? `<img src="${escAttr(b.image)}" alt="">` : icon("image")}</span>
            <div style="flex:1 1 auto;min-width:0">
              <strong>${esc(b.title || b.headline || "(بلا اسم)")}</strong>
              <small>
                <b class="banner-badge ${badgeTone}">${badgeText}</b>
                · ${esc(bannerScheduleLabel(b))}
                · <span class="${broken ? "banner-target-broken" : ""}">${esc(targetLabel)}</span>
                ${stats.enabled !== false && (imp || clk) ? ` · ${clk.toLocaleString("ar")} نقرة / ${imp.toLocaleString("ar")} ظهور` : ""}
              </small>
            </div>
            <span style="display:flex;gap:.25rem;align-items:center;flex-wrap:wrap">
              <button class="table-action" data-action="banner-move" data-id="${escAttr(b.id)}" data-dir="up" ${i === 0 ? "disabled" : ""} aria-label="تحريك لأعلى">▲</button>
              <button class="table-action" data-action="banner-move" data-id="${escAttr(b.id)}" data-dir="down" ${i === list.length - 1 ? "disabled" : ""} aria-label="تحريك لأسفل">▼</button>
              <button class="table-action" data-action="banner-edit" data-id="${escAttr(b.id)}" aria-label="تعديل">${icon("edit")}</button>
              <button class="table-action danger" data-action="banner-delete" data-id="${escAttr(b.id)}" aria-label="حذف">${icon("trash")}</button>
              <label style="display:flex;align-items:center;gap:.3rem;cursor:pointer;white-space:nowrap"><input type="checkbox" data-action="banner-toggle" data-id="${escAttr(b.id)}" ${b.active === false ? "" : "checked"}><b>${b.active === false ? "متوقف" : "مفعّل"}</b></label>
            </span>
          </article>`;
        }).join("") : `<div class="empty-managed">${icon("image")}<p>لا بانرات في هذا المكان.</p></div>`}</div>
      </section>`;
    }).join("")}`;
}

function openBannerEditModal(id) {
  const { items } = bannerSettings();
  const editing = id ? items.find(b => b.id === id) : null;
  const b = editing || { placement: "home_top", linkType: "none", active: true, sort: (items.length + 1) * 10 };
  const catOptions = Object.keys(CATEGORY_MAP).map(slug => `<option value="${escAttr(slug)}" ${b.categoryKey === slug ? "selected" : ""}>${esc(CATEGORY_MAP[slug])}</option>`).join("");
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">البانرات</span><h2>${editing ? "تعديل بانر" : "إضافة بانر"}</h2>
    <form id="banner-form" data-id="${escAttr(editing ? editing.id : "")}" class="form-grid">
      <label class="input-label" style="grid-column:1/-1"><span>اسم داخلي (للإدارة فقط)</span><input name="title" value="${escAttr(b.title || "")}" required placeholder="مثال: حملة رمضان — باشا بيتزريا"></label>

      <label class="input-label"><span>مكان الظهور</span><select name="placement">${BANNER_PLACEMENTS.map(p => `<option value="${p.key}" ${b.placement === p.key ? "selected" : ""}>${esc(p.label)}</option>`).join("")}</select></label>
      <label class="input-label"><span>الترتيب (الأصغر أولاً)</span><input type="number" name="sort" value="${escAttr(String(b.sort == null ? 10 : b.sort))}"></label>

      <label class="input-label banner-category-field" style="grid-column:1/-1"><span>القسم (مطلوب فقط لمكان «صفحة قسم»)</span><select name="categoryKey"><option value="">— اختر القسم —</option>${catOptions}</select></label>

      <label class="input-label" style="grid-column:1/-1"><span>العنوان الظاهر للزائر</span><input name="headline" value="${escAttr(b.headline || "")}" placeholder="مثال: خصم ٢٠٪ هذا الأسبوع"></label>
      <label class="input-label" style="grid-column:1/-1"><span>سطر وصف قصير</span><input name="sub" value="${escAttr(b.sub || "")}" placeholder="مثال: على كل الطلبات فوق ٢٠٠ ل.ت"></label>
      <label class="input-label" style="grid-column:1/-1"><span>نص الزر</span><input name="cta" value="${escAttr(b.cta || "")}" placeholder="مثال: اطلب الآن"></label>

      <label class="input-label"><span>نوع الرابط</span><select name="linkType">${BANNER_LINK_TYPES.map(t => `<option value="${t.key}" ${(b.linkType || "none") === t.key ? "selected" : ""}>${esc(t.label)}</option>`).join("")}</select></label>
      <label class="input-label"><span>قيمة الرابط</span><input name="linkValue" value="${escAttr(String(b.linkValue == null ? "" : b.linkValue))}" placeholder="رقم المتجر / رقم المنتج / slug القسم / https://..."></label>

      <label class="input-label"><span>يبدأ الظهور</span><input type="date" name="startAt" value="${escAttr(String(b.startAt || "").slice(0, 10))}"></label>
      <label class="input-label"><span>ينتهي الظهور (شامل اليوم نفسه)</span><input type="date" name="endAt" value="${escAttr(String(b.endAt || "").slice(0, 10))}"></label>

      <input type="hidden" name="image" value="${escAttr(b.image || "")}">
      <div class="input-label" style="grid-column:1/-1"><span>صورة البانر (يُنصح بعرض ١٢٠٠ بكسل أو أكثر)</span>
        <div class="image-preview" id="banner-image-preview">${b.image ? `<img src="${escAttr(b.image)}" alt="">` : icon("image")}</div>
        <label class="upload-tile">${icon("upload")}<span>رفع صورة من الجهاز</span><input type="file" id="banner-image-file" accept="image/*" hidden></label>
      </div>

      <label class="input-label" style="grid-column:1/-1;flex-direction:row;align-items:center;gap:.5rem">
        <input type="checkbox" name="active" ${b.active === false ? "" : "checked"}><span>مفعّل</span>
      </label>

      <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ البانر</button>
    </form>
  `, "");
}

// Persist a content setting (optimistic local update + re-render, then save via
// the admin server endpoint). Used by the categories toggles/reorder.
function saveContentSetting(key, value) {
  state.siteSettings = { ...state.siteSettings, [key]: value };
  render();
  adminApi("save-settings", { method: "POST", body: { key, value } }).catch(() => showToast("تعذّر الحفظ سحابياً", ""));
}

// Content > Featured stores: pick which stores appear in the homepage "متاجر
// مميزة" section. Toggling sets store.featured and persists it to the cloud
// (pushStoreCloud), so every visitor sees the change — mirrors toggle-product.
function adminContentFeatured() {
  const list = stores.slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || String(a.name).localeCompare(String(b.name), "ar"));
  const count = stores.filter(s => s.featured).length;
  return `
    <button class="text-button" data-action="content-back">${icon("arrowLeft")} رجوع لإدارة المحتوى</button>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>المتاجر المميزة على الصفحة الرئيسية</h3><p>المتاجر المختارة تظهر في قسم «متاجر مميزة بالقرب منك». المختار حالياً: ${count.toLocaleString("ar")}</p></div></div>
      <div class="admin-store-list">${list.map(s => `<article>${storeAvatar(s)}<div style="flex:1 1 auto;min-width:0"><strong>${escAttr(s.name)}</strong><small>${escAttr(s.category || "")}</small></div><label style="display:flex;align-items:center;gap:.4rem;cursor:pointer;white-space:nowrap"><input type="checkbox" data-action="toggle-featured" data-id="${s.id}" ${s.featured ? "checked" : ""}><b>${s.featured ? "⭐ مميّز" : "عادي"}</b></label></article>`).join("")}</div>
    </section>`;
}

// ---------------------------------------------------------------------------
// Admin WhatsApp inbox (two-way customer chat over the Cloud API).
// All reads/writes go THROUGH the server (/api/notify-order) with the admin
// password as the x-admin-key header, so customer PII is never exposed to the
// public Supabase key.
// ---------------------------------------------------------------------------
async function adminApi(action, { method = "GET", params = {}, body = null } = {}) {
  // state.adminKey holds the SESSION TOKEN (never the password). The password is
  // never placed in the query string — only the action and non-secret params are.
  const qs = new URLSearchParams({ action, ...params }).toString();
  const opts = { method, headers: { "x-admin-token": state.adminKey || "" } };
  if (body) { opts.headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  const res = await fetch(`/api/notify-order?${qs}`, opts);
  if (res.status === 403) { lockAdmin(); throw new Error("unauthorized"); }
  if (!res.ok) throw new Error(`request failed (${res.status})`);
  return res.json().catch(() => ({}));
}

function lockAdmin() {
  state.adminKey = null;
  state.adminCreds = null;
  sessionStorage.removeItem("dukkanci-admin-token");
}

async function loadAdminThreads(silent) {
  try {
    const data = await adminApi("threads");
    state.adminThreads = data.threads || [];
    state._adminThreadsError = null;
    // If empty, fetch inbox status once to show a diagnostic
    if (!state.adminThreads.length && !state._inboxStatusFetched) {
      state._inboxStatusFetched = true;
      adminApi("inbox-status").then(s => { state._inboxStatus = s; if (!silent) render(); else updateThreadListDOM(); }).catch(() => {});
    }
    if (!silent) render();
    else updateThreadListDOM();
  } catch (e) {
    state._adminThreadsError = true;
    if (!silent) render();
  }
}

async function loadAdminThread(wa, silent) {
  if (!silent) {
    // Select IMMEDIATELY so the click sticks and any background poll targets this
    // thread (not the previously-open one). Clear the old conversation so we show a
    // loading state for the new one instead of flashing the previous chat — this is
    // what made clicks feel like they "snapped back" to the last-opened conversation.
    state.adminActiveWa = wa;
    state.adminThread = null;
    state.adminThreadLoading = true;
    const t0 = (state.adminThreads || []).find(x => x.wa_id === wa);
    if (t0) t0.unread = 0;
    render();
  }
  try {
    const data = await adminApi("thread", { params: { wa } });
    if (state.adminActiveWa !== wa) return;   // user opened another thread meanwhile — drop the stale response
    state.adminThread = data;
    const t = (state.adminThreads || []).find(x => x.wa_id === wa);
    if (t) t.unread = 0;
  } catch (e) {
    if (state.adminActiveWa === wa) state.adminThread = null;
  }
  if (state.adminActiveWa === wa) { state.adminThreadLoading = false; render(); }
}

async function sendAdminReply(text) {
  const wa = state.adminActiveWa;
  if (!wa || !text.trim()) return;
  // Optimistic echo.
  if (state.adminThread && Array.isArray(state.adminThread.messages)) {
    state.adminThread.messages.push({ id: "tmp" + Date.now(), direction: "out", body: text, msg_type: "text", status: "sending", created_at: new Date().toISOString() });
    renderAdminThreadOnly();
  }
  try {
    await adminApi("reply", { method: "POST", body: { to: wa, text } });
  } catch (e) {
    showToast("تعذّر إرسال الرسالة", "");
  }
  await loadAdminThread(wa, true);
}

function adminThreadName(t) {
  return (t.name && t.name.trim()) || `+${t.wa_id}`;
}

function chatTime(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" });
  } catch (e) { return ""; }
}

// Cheap fingerprint of everything the thread list renders, so background polling
// only rebuilds the DOM when something actually changed — otherwise a click can be
// swallowed mid-rebuild and the list scroll jumps back to the top every 7 seconds.
function threadsSignature() {
  return (state.adminThreads || [])
    .map(t => `${t.wa_id}:${t.last_at}:${t.unread || 0}:${t.pinned ? 1 : 0}:${t.label || ""}:${t.needs_human ? 1 : 0}:${t.wa_id === state.adminActiveWa ? 1 : 0}`)
    .join("|") + "#" + (state.adminThreadFilter || "");
}
// Pinned conversations first, then most-recent — mirrors the server order so an
// optimistic pin/unpin reorders the list instantly without waiting for a refetch.
function resortAdminThreads() {
  (state.adminThreads || []).sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return a.last_at < b.last_at ? 1 : -1;
  });
}
// Re-render just the thread list (used during silent polling so the reply box keeps
// focus and the typed draft isn't wiped). Skips the rebuild when nothing changed and
// preserves scroll position when it does — so clicking a conversation stays reliable.
function updateThreadListDOM() {
  const el = document.getElementById("wa-thread-list");
  if (!el) return;
  const sig = threadsSignature();
  if (sig === state._waListSig) return;
  state._waListSig = sig;
  const top = el.scrollTop;
  el.innerHTML = adminThreadListHTML();
  el.scrollTop = top;
}
function renderAdminThreadOnly() {
  const el = document.getElementById("wa-chat-pane");
  if (el) el.innerHTML = adminChatPaneHTML();
  scrollChatToBottom();
}
function scrollChatToBottom() {
  const sc = document.getElementById("wa-chat-scroll");
  if (sc) sc.scrollTop = sc.scrollHeight;
}

// Silent refresh of the open conversation — patches only the message area so a
// half-typed reply and input focus are preserved. Keeps the view pinned to the
// bottom only if the user was already there.
async function refreshActiveThreadSilent() {
  const wa = state.adminActiveWa;
  if (!wa) return;
  try {
    const data = await adminApi("thread", { params: { wa } });
    state.adminThread = data;
    const t = (state.adminThreads || []).find(x => x.wa_id === wa);
    if (t) t.unread = 0;
    const sc = document.getElementById("wa-chat-scroll");
    if (sc) {
      const atBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 60;
      sc.innerHTML = chatBubblesHTML(data.messages) || `<div class="wa-empty"><p>لا رسائل.</p></div>`;
      if (atBottom) sc.scrollTop = sc.scrollHeight;
    }
  } catch (e) {}
}

// Poll the inbox while the Messages tab is open (the webhook can't push to the
// browser). Threads list refreshes every tick; the open thread too.
let _waPollTimer = null;
function startInboxPolling() {
  if (_waPollTimer) return;
  _waPollTimer = setInterval(() => {
    const onInbox = state.adminKey && document.getElementById("wa-thread-list");
    if (!onInbox) { clearInterval(_waPollTimer); _waPollTimer = null; return; }
    loadAdminThreads(true);
    if (state.adminActiveWa) refreshActiveThreadSilent();
  }, 7000);
}

// Fixed set of conversation labels (one per thread). Keys are stored in
// whatsapp_threads.label and validated server-side; names/colors live here only.
const WA_LABELS = {
  store_lead: { name: "مهتم بإضافة متجر", color: "#15803d", bg: "#dcfce7" },
  follow_up:  { name: "متابعة لاحقاً",    color: "#b45309", bg: "#fef3c7" },
  important:  { name: "مهم",              color: "#dc2626", bg: "#fee2e2" },
  customer:   { name: "عميل",             color: "#2563eb", bg: "#dbeafe" }
};

// Filter chips above the thread list (الكل / المثبّتة / per-label). Sits OUTSIDE the
// scrolling list so polling never rebuilds or scrolls it away.
function adminThreadFilterBarHTML() {
  const threads = state.adminThreads || [];
  if (!threads.length) return "";
  const active = state.adminThreadFilter || "";
  const pinnedCount = threads.filter(t => t.pinned).length;
  let html = `<button class="wa-filter-chip ${active === "" ? "active" : ""}" data-action="wa-filter" data-filter="">الكل <b>${threads.length}</b></button>`;
  if (pinnedCount) html += `<button class="wa-filter-chip ${active === "pinned" ? "active" : ""}" data-action="wa-filter" data-filter="pinned">📌 المثبّتة <b>${pinnedCount}</b></button>`;
  for (const [k, v] of Object.entries(WA_LABELS)) {
    const c = threads.filter(t => t.label === k).length;
    if (c) html += `<button class="wa-filter-chip ${active === k ? "active" : ""}" data-action="wa-filter" data-filter="${k}" style="--c:${v.color};--bg:${v.bg}">${v.name} <b>${c}</b></button>`;
  }
  return `<div class="wa-filter-bar">${html}</div>`;
}

function adminThreadListHTML() {
  const all = state.adminThreads || [];
  if (!all.length) {
    if (state._adminThreadsError) {
      return `<div class="wa-empty wa-empty--error">${icon("shield")}<p>تعذّر تحميل المحادثات.<br><small>تحقق من إعدادات ADMIN_PASSWORD في Vercel وأعد تسجيل الدخول.</small></p><button class="secondary-button compact" data-action="wa-refresh">إعادة المحاولة</button></div>`;
    }
    const s = state._inboxStatus;
    if (s) {
      const issues = [];
      if (!s.hasServiceRole) issues.push("SUPABASE_SERVICE_ROLE_KEY غير مضبوط — لا يمكن قراءة الرسائل");
      if (!s.hasMetaSecret)  issues.push("META_APP_SECRET غير مضبوط — الرسائل الواردة مرفوضة");
      if (!s.hasWaToken)     issues.push("WHATSAPP_TOKEN غير مضبوط — الإرسال معطّل");
      if (issues.length) {
        return `<div class="wa-empty wa-empty--warn">${icon("shield")}<p><strong>إعداد ناقص</strong></p>${issues.map(i => `<p class="wa-issue"><small>⚠ ${i}</small></p>`).join("")}<p><small>أضف المتغيّرات الناقصة في لوحة Vercel → Settings → Environment Variables ثم أعد النشر.</small></p></div>`;
      }
    }
    return `<div class="wa-empty">${icon("whatsapp")}<p>لا توجد محادثات بعد.<br>ستظهر هنا فور أن يراسلك عميل على رقم واتساب.</p></div>`;
  }
  const filter = state.adminThreadFilter || null;
  let threads = all;
  if (filter === "pinned") threads = all.filter(t => t.pinned);
  else if (filter) threads = all.filter(t => t.label === filter);
  if (!threads.length) return `<div class="wa-empty">${icon("whatsapp")}<p>لا محادثات ضمن هذا التصنيف.</p></div>`;
  return threads.map(t => {
    const lbl = t.label && WA_LABELS[t.label];
    return `
    <button class="wa-thread ${t.wa_id === state.adminActiveWa ? "active" : ""} ${t.pinned ? "pinned" : ""}" data-action="wa-open" data-wa="${escAttr(t.wa_id)}">
      <span class="wa-thread__avatar">${icon("whatsapp")}${t.pinned ? `<span class="wa-pin-dot" title="مثبّتة">📌</span>` : ""}</span>
      <span class="wa-thread__body">
        <span class="wa-thread__top"><strong>${escAttr(adminThreadName(t))}</strong><time>${chatTime(t.last_at)}</time></span>
        <span class="wa-thread__preview">${t.needs_human ? `<b style="color:#e67e22">🙋 بحاجة لموظف · </b>` : ""}${t.last_dir === "out" ? "↩ " : ""}${escAttr((t.last_body || "").slice(0, 48))}</span>
        ${lbl ? `<span class="wa-label-chip" style="--c:${lbl.color};--bg:${lbl.bg}">${lbl.name}</span>` : ""}
      </span>
      ${t.unread ? `<b class="wa-unread">${t.unread}</b>` : ""}
    </button>`;
  }).join("");
}

function chatBubblesHTML(messages) {
  return (messages || []).map(m => {
    const out = m.direction === "out";
    const tick = out ? `<span class="wa-tick ${m.status === "failed" ? "failed" : ""}">${m.status === "failed" ? "✕ لم تُرسل" : m.status === "read" ? "✓✓" : m.status === "sending" ? "…" : "✓"}</span>` : "";
    return `<div class="wa-msg ${out ? "out" : "in"}"><div class="wa-bubble">${escAttr(m.body || "")}<span class="wa-meta">${chatTime(m.created_at)} ${tick}</span></div></div>`;
  }).join("");
}

function adminChatPaneHTML() {
  if (!state.adminActiveWa) return `<div class="wa-empty wa-chat-empty">${icon("whatsapp")}<p>اختر محادثة لعرض الرسائل والرد عليها.</p></div>`;
  if (state.adminThreadLoading && !state.adminThread) return `<div class="wa-empty wa-chat-empty"><p>جارٍ التحميل…</p></div>`;
  const data = state.adminThread || { messages: [], canFreeform: false, pinned: false, label: null };
  const t = (state.adminThreads || []).find(x => x.wa_id === state.adminActiveWa);
  const title = t ? adminThreadName(t) : `+${state.adminActiveWa}`;
  const bubbles = chatBubblesHTML(data.messages);
  const waEsc = escAttr(state.adminActiveWa);
  // Pin + label controls for the open conversation. Pin sorts it to the top; the
  // label tags it (e.g. "مهتم بإضافة متجر") so it can be filtered into its own list.
  const tools = `<div class="wa-chat-tools">
    <button class="wa-tool ${data.pinned ? "active" : ""}" data-action="wa-pin" data-wa="${waEsc}" data-pinned="${data.pinned ? 1 : 0}" title="${data.pinned ? "إلغاء التثبيت" : "تثبيت في الأعلى"}">📌 ${data.pinned ? "مثبّتة" : "تثبيت"}</button>
    <span class="wa-tool-sep">التصنيف:</span>
    ${Object.entries(WA_LABELS).map(([k, v]) => `<button class="wa-label-pick ${data.label === k ? "active" : ""}" data-action="wa-label" data-wa="${waEsc}" data-label="${k}" style="--c:${v.color};--bg:${v.bg}">${v.name}</button>`).join("")}
  </div>`;
  // The composer is ALWAYS shown so the team can always reply. Outside WhatsApp's
  // 24h customer-care window a free-text message may be rejected by Meta, so we show
  // a slim advisory above the box (instead of hiding the box) and still let the agent
  // try — Meta is the source of truth at send time and our cached window state can be
  // stale; a rejected message simply comes back marked "✕ لم تُرسل".
  const windowNote = data.canFreeform ? "" :
    `<div class="wa-window-note">${icon("bell")} مرّت أكثر من 24 ساعة على آخر رسالة من العميل؛ قد لا يصل النص الحر. يفضّل أن يبدأ العميل المحادثة أو إرسال قالب معتمد.</div>`;
  const composer = `<form id="wa-reply-form" class="wa-composer"><input id="wa-reply-input" autocomplete="off" placeholder="اكتب ردّك…"><button type="submit" class="wa-send" aria-label="إرسال">${icon("arrowLeft")}</button></form>`;
  const aiBanner = data.ai_paused
    ? `<div class="wa-window-closed" style="display:flex;align-items:center;justify-content:space-between;gap:8px;background:#fff5e6">
        <span>${data.needs_human ? "🙋 طلب العميل موظفاً — " : ""}الرد الآلي متوقّف لهذه المحادثة (تدخّل بشري).</span>
        <button class="secondary-button compact" data-action="wa-resume-ai" data-wa="${escAttr(state.adminActiveWa)}">${icon("stars")} استئناف الرد الآلي</button>
      </div>`
    : "";
  return `
    <header class="wa-chat-head"><span class="wa-thread__avatar">${icon("whatsapp")}</span><div><strong>${escAttr(title)}</strong><small dir="ltr">+${escAttr(state.adminActiveWa)}</small></div></header>
    ${tools}
    ${aiBanner}
    <div id="wa-chat-scroll" class="wa-chat-scroll">${bubbles || `<div class="wa-empty"><p>لا رسائل.</p></div>`}</div>
    ${windowNote}
    ${composer}`;
}

function adminMessages() {
  if (!state._adminThreadsFetched) {
    state._adminThreadsFetched = true;
    loadAdminThreads(false);
  }
  return `<div class="wa-inbox">
    <aside class="wa-list"><div class="wa-list-head"><strong>المحادثات</strong><button class="text-button compact" data-action="wa-refresh" aria-label="تحديث">⟳ تحديث</button></div>${adminThreadFilterBarHTML()}<div id="wa-thread-list" class="wa-thread-list">${adminThreadListHTML()}</div></aside>
    <section id="wa-chat-pane" class="wa-chat">${adminChatPaneHTML()}</section>
  </div>`;
}

function adminLoginScreen() {
  return `<div class="dashboard-shell admin-shell admin-locked"><main class="dashboard-main"><div class="admin-login-card">
    <span class="admin-login-logo">${brandLogo("")}</span>
    <h1>لوحة إدارة دكانجي</h1>
    <p>أدخل كلمة المرور للمتابعة.</p>
    <form id="admin-login-form" class="admin-login-form">
      <input id="admin-login-input" type="password" autocomplete="current-password" placeholder="كلمة المرور" required>
      <button type="submit" class="primary-button">دخول</button>
    </form>
    <a class="text-button" data-action="route-home">${icon("arrowLeft")} العودة للموقع</a>
  </div></main></div>`;
}

// Admin product management: pick any store, then show/hide or edit price/name of any product.
// Reads `allProducts` so it lists EVERY product (incl. ones without an image / hidden ones).
function adminProducts() {
  const storeId = Number(state.adminProductStoreId) || 50;
  const store = getStore(storeId) || stores[0];
  if (!store) return `<section class="dashboard-card"><div class="empty-managed">${icon("box")}<p>لا توجد متاجر</p></div></section>`;
  const q = (state.adminProductSearch || "").trim();
  const nq = normalizeAr(q);
  const activeCat = state.adminProductCategory || null;
  const storeCats = storeProductCategories(store.id);
  let list = allProducts.filter(p => p.storeId === store.id);
  if (activeCat) list = list.filter(p => p.category === activeCat);
  if (nq) list = list.filter(p => normalizeAr(`${p.name} ${p.category}`).includes(nq));
  const shownCount = list.filter(isShownOnStore).length;
  const catBar = `<div class="product-cat-filter">
    <button type="button" class="cat-chip ${!activeCat ? "active" : ""}" data-action="admin-cat-filter" data-cat="">الكل <span>${allProducts.filter(p=>p.storeId===store.id).length}</span></button>
    ${storeCats.map(c => { const cnt = allProducts.filter(p => p.storeId === store.id && p.category === c).length; return `<button type="button" class="cat-chip ${activeCat === c ? "active" : ""}" data-action="admin-cat-filter" data-cat="${escAttr(c)}">${esc(c)} <span>${cnt}</span></button>`; }).join("")}
    <button type="button" class="cat-chip add-cat-chip" data-action="add-store-category" data-id="${store.id}">${icon("plus")} تصنيف جديد</button>
  </div>`;
  const rows = list.slice(0, 400).map(p => {
    const forced = HIDDEN_PRODUCTS.has(p.id);
    const canShow = !isPlaceholderImage(p.image);
    const vis = isShownOnStore(p) ? ["green", "معروض"] : (canShow ? ["red", "مخفي"] : ["gray", "بانتظار صورة"]);
    return `<article>
        <img src="${esc(p.image)}" alt="${escAttr(p.name)}" loading="lazy">
        <div class="managed-product-name"><strong>${esc(p.name)}</strong><small>${esc(p.category || "")} · ${esc(p.unit || "")}</small></div>
        <strong>${money(p.price)}${p.oldPrice ? ` <s class="managed-old-price">${money(p.oldPrice)}</s>` : ""}</strong>
        <label class="toggle" title="${canShow ? "إظهار/إخفاء من المتجر" : "أضف صورة ليظهر المنتج"}"><input type="checkbox" ${(!forced && canShow) ? "checked" : ""} ${canShow ? "" : "disabled"} data-action="admin-toggle-hide" data-id="${p.id}"><span></span><small>${forced ? "مخفي" : "ظاهر"}</small></label>
        <span class="status-pill ${vis[0]}">${vis[1]}</span>
        <div class="managed-product-actions">
          <button class="table-action ${MOST_ORDERED_PRODUCTS.has(p.id) ? "active" : ""}" data-action="toggle-most-ordered" data-id="${p.id}" title="إظهار في «الأكثر طلباً اليوم» على الرئيسية">${icon("star")}</button>
          <button class="table-action" data-action="edit-product" data-id="${p.id}" title="تعديل الاسم والسعر">${icon("edit")}</button>
        </div>
      </article>`;
  }).join("");
  return `
    <div class="dashboard-toolbar">
      <label class="store-switcher" title="اختر المتجر">${icon("store")}<select id="admin-product-store">${stores.slice().sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s => `<option value="${s.id}" ${s.id === store.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>
      <div class="dashboard-search">${icon("search")}<input id="admin-product-search" placeholder="ابحث في منتجات المتجر" value="${escAttr(q)}"></div>
      <span class="toolbar-count">${list.length.toLocaleString("ar")} منتج · ${shownCount.toLocaleString("ar")} معروض</span>
    </div>
    ${catBar}
    <section class="dashboard-card product-management">
      ${rows || `<div class="empty-managed">${icon("box")}<p>لا منتجات مطابقة</p></div>`}
      ${list.length > 400 ? `<p style="text-align:center;padding:12px;color:#888">يُعرض أول 400 منتج — استخدم البحث لتضييق النتائج</p>` : ""}
    </section>`;
}

// ─── WhatsApp Campaign Management ────────────────────────────────────────────

async function campaignApi(action, { method = "GET", id = null, body = null, params = null } = {}) {
  // `params` carries extra query args (e.g. group=). Never append them to `action`
  // itself — URLSearchParams escapes the whole value, so "a&b=c" would arrive as
  // one literal action name.
  const qs = new URLSearchParams({ action, ...(id ? { id } : {}), ...(params || {}) }).toString();
  const opts = { method, headers: { "x-admin-token": state.adminKey || "", "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`/api/campaign?${qs}`, opts);
  if (res.status === 403) { lockAdmin(); throw new Error("unauthorized"); }
  return res.json().catch(() => ({}));
}

async function uploadCampaignImage(file) {
  const status = document.getElementById("img-upload-status");
  const setStatus = t => { if (status) status.textContent = t; };
  setStatus("جارٍ الرفع...");
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  try {
    const res = await fetch(`/api/campaign?action=image-upload&filename=${encodeURIComponent(filename)}`, {
      method: "POST",
      headers: { "x-admin-token": state.adminKey || "", "Content-Type": file.type || "image/jpeg" },
      body: file
    });
    const data = await res.json().catch(() => ({}));
    if (!data.ok) {
      const msg = data.error || "خطأ غير معروف";
      showToast(`فشل الرفع: ${msg}`, "error");
      setStatus(`❌ ${msg}`);
      return;
    }
    setStatus("");
    showToast("تم رفع الصورة بنجاح", "success");
    // Add immediately to state so render() shows it right away
    const newImg = { name: filename, url: data.url };
    if (!state.adminImages || !state.adminImages.list) state.adminImages = { list: [] };
    state.adminImages = { list: [newImg, ...state.adminImages.list] };
    render();
  } catch (e) { showToast(`خطأ: ${e.message}`, "error"); setStatus(""); }
}

async function loadAdminCampaigns() {
  try {
    const data = await campaignApi("list");
    state.adminCampaigns = data.campaigns || [];
    render();
    // Auto-restart poll if a campaign is still sending (e.g. after page refresh)
    const active = state.adminCampaigns.find(c => c.status === "sending");
    if (active && !_campaignPollTimer) startCampaignPoll(active.id);
  } catch (e) { state.adminCampaigns = []; render(); }
}

function campaignStatusLabel(status) {
  return { draft: "مسودة", ready: "جاهزة", sending: "جارٍ الإرسال", paused: "موقوفة", paused_daily_limit: "وصل الحد اليومي", done: "منتهية", canceled: "ملغاة" }[status] || status;
}
function campaignStatusClass(status) {
  return { draft: "gray", ready: "blue", sending: "green", paused: "yellow", paused_daily_limit: "yellow", done: "teal", canceled: "gray" }[status] || "gray";
}

function campaignProgress(c) {
  if (!c.total_recipients) return 0;
  return Math.min(100, Math.round(((c.sent_count || 0) + (c.failed_count || 0)) / c.total_recipients * 100));
}

function adminMedia() {
  const images = state.adminImages;
  if (!images) {
    state.adminImages = { loading: true };
    campaignApi("images-list").then(d => {
      const fromApi = d.images || [];
      const current = state.adminImages?.list || [];
      const apiNames = new Set(fromApi.map(i => i.name));
      state.adminImages = { list: [...fromApi, ...current.filter(i => !apiNames.has(i.name))] };
      render();
    }).catch(() => { state.adminImages = { list: [] }; render(); });
  }
  const list = images?.list || [];
  return `
    <div class="dashboard-card" style="padding:24px">
      <h3 style="margin:0 0 6px">📸 صور الحملات التسويقية</h3>
      <p style="color:var(--text-muted);margin:0 0 20px;font-size:14px">ارفع صورة واحصل على رابط مباشر لاستخدامه في الحملات أو أي مكان آخر</p>

      <div style="display:flex;align-items:center;gap:12px;padding:16px 0;border-bottom:1px solid var(--border);margin-bottom:20px;flex-wrap:wrap">
        <label class="primary-button" style="cursor:pointer;display:inline-flex;align-items:center;gap:6px">
          📤 رفع صورة جديدة
          <input type="file" id="img-file-input" accept="image/*" style="display:none">
        </label>
        <small style="color:var(--text-muted)">JPG · PNG · WebP — حتى 5 ميغابايت</small>
        <span id="img-upload-status" style="color:var(--accent);font-size:13px"></span>
      </div>

      ${!images || images.loading ? `<p style="color:var(--text-muted)">جارٍ التحميل...</p>` :
        list.length === 0 ? `<p style="color:var(--text-muted)">لا توجد صور مرفوعة بعد — ارفع أول صورة</p>` :
        `<div class="images-grid">
          ${list.map(img => `
            <div class="image-card">
              <img src="${esc(img.url)}" alt="${esc(img.name)}" loading="lazy">
              <div class="image-card-footer">
                <span class="image-name" title="${esc(img.name)}">${esc(img.name)}</span>
                <input class="url-readonly" value="${esc(img.url)}" readonly dir="ltr" onclick="this.select()" title="انقر لتحديد الرابط">
                <button class="primary-button compact" data-action="image-copy-url" data-url="${escAttr(img.url)}">نسخ الرابط</button>
                <button class="danger-button compact" data-action="image-delete" data-name="${escAttr(img.name)}">🗑 حذف</button>
              </div>
            </div>
          `).join("")}
        </div>`
      }
    </div>`;
}

function adminCampaigns() {
  if (!state.adminCampaigns) {
    loadAdminCampaigns();
    return `<div class="dashboard-card"><div class="empty-managed">${icon("megaphone")}<p>جارٍ تحميل الحملات...</p></div></div>`;
  }
  // Eager-load the uploaded-contacts summary once so the KPI strip + group count
  // are accurate even before the user opens the contacts panel.
  if (state.adminContacts == null && !state._campaignContactsRequested) {
    state._campaignContactsRequested = true;
    loadContacts();
  }

  const showForm     = state.adminCampaignForm === "open";
  const showContacts = state.adminCampaignForm === "contacts";
  const showOptouts  = state.adminCampaignForm === "optouts";
  const camps    = state.adminCampaigns;
  const contacts = state.adminContacts || null;
  const groups   = (contacts && contacts.groups) || [];
  const optouts  = state.adminOptouts || null;
  // The uploaded numbers themselves — fetched by loadContacts() and, until now,
  // never rendered anywhere, so the panel only ever showed group cards.
  const preview     = (contacts && contacts.preview) || [];
  const activeGroup = (contacts && contacts.group) || "";
  const scopeTotal  = contacts ? (contacts.scopeTotal || contacts.total || 0) : 0;

  const audienceLabel = (t, g) => {
    if (t === "wa_contacts") return g ? `مجموعة: ${g}` : "كل الأرقام المرفوعة";
    return { all_customers: "كل عملاء المنصة", no_order_30d: "غير نشطين 30 يوماً" }[t] || t;
  };

  const sendingCount = camps.filter(c => c.status === "sending").length;
  const totalSent    = camps.reduce((s, c) => s + (c.sent_count || 0), 0);
  const kpi = (val, label, ic, tone = "") => `
    <div class="kpi-card ${tone}">
      <span class="kpi-icon">${icon(ic)}</span>
      <div class="kpi-body"><b>${val}</b><small>${label}</small></div>
    </div>`;

  return `
    <div class="campaign-kpis">
      ${kpi(contacts ? contacts.total.toLocaleString("ar") : "—", "رقم مرفوع", "users", "blue")}
      ${kpi(contacts ? groups.length.toLocaleString("ar") : "—", "مجموعة", "users")}
      ${kpi(camps.length.toLocaleString("ar"), "حملة", "megaphone")}
      ${kpi(sendingCount.toLocaleString("ar"), "قيد الإرسال الآن", "whatsapp", sendingCount ? "green" : "")}
      ${kpi(totalSent.toLocaleString("ar"), "رسالة مُرسَلة", "whatsapp")}
    </div>

    <div class="dashboard-toolbar campaign-toolbar">
      <button class="primary-button compact" data-action="campaign-new">${icon("megaphone")} حملة جديدة</button>
      <button class="secondary-button compact ${showContacts ? "is-active" : ""}" data-action="contacts-panel">${icon("users")} إدارة الأرقام المرفوعة${contacts ? ` <b class="nav-badge" style="position:static;margin-right:4px">${contacts.total.toLocaleString("ar")}</b>` : ""}</button>
      <button class="secondary-button compact ${showOptouts ? "is-active" : ""}" data-action="optouts-panel">${icon("shield")} الأرقام المستبعدة${optouts ? ` <b class="nav-badge" style="position:static;margin-right:4px">${optouts.total.toLocaleString("ar")}</b>` : ""}</button>
    </div>

    ${showContacts ? `
    <section class="dashboard-card campaign-form-card">
      <div class="card-heading">
        <div><h3>${icon("users")} قائمة الأرقام المرفوعة</h3><p>عملاء سابقون أو جمهور خارجي — يمكن استهدافهم في أي حملة</p></div>
        ${contacts ? `<span class="count-chip">${contacts.total.toLocaleString("ar")} رقم</span>` : ""}
      </div>

      ${groups.length ? `
      <div class="contacts-groups-list">
        <p class="groups-heading">${icon("users")} المجموعات المحفوظة <span class="groups-count">${groups.length}</span></p>
        <div class="groups-grid">
          ${groups.map(g => `<article class="group-card is-clickable ${activeGroup === g.group_name ? "is-active" : ""}" data-action="contacts-view-group" data-group="${escAttr(g.group_name)}" title="عرض أرقام هذه المجموعة">
            <div class="group-card__top">
              <span class="group-card__icon">${icon("users")}</span>
              <button class="group-card__del" data-action="contacts-delete-group" data-group="${escAttr(g.group_name)}" title="حذف المجموعة" aria-label="حذف المجموعة">${icon("trash")}</button>
            </div>
            <strong class="group-card__name" title="${escAttr(g.group_name)}">${esc(g.group_name)}</strong>
            <span class="group-card__count"><b>${g.count.toLocaleString("ar")}</b> رقم</span>
          </article>`).join("")}
        </div>
      </div>` : contacts ? `<p class="muted-hint">لا مجموعات بعد — ارفع أرقامك الأولى أدناه.</p>` : ""}

      ${contacts ? `
      <div class="contacts-numbers-list">
        <p class="groups-heading">
          ${icon("users")} الأرقام المرفوعة
          ${activeGroup ? `<span class="groups-count">${esc(activeGroup)}</span>` : ""}
        </p>
        ${preview.length ? `
        <p class="muted-hint contacts-scope-hint">
          عرض أحدث <b>${preview.length.toLocaleString("ar")}</b> رقم من أصل <b>${scopeTotal.toLocaleString("ar")}</b>${activeGroup ? " في هذه المجموعة" : ""}
          ${activeGroup ? `<button class="inline-link" data-action="contacts-view-group" data-group="">عرض كل المجموعات</button>` : ""}
        </p>
        <div class="campaigns-table-wrap"><table class="admin-table campaigns-table">
          <thead><tr><th>الرقم</th><th>المجموعة</th><th>تاريخ الإضافة</th></tr></thead>
          <tbody>
            ${preview.map(c => `<tr>
              <td dir="ltr"><code>+${esc(c.phone)}</code></td>
              <td><small>${esc(c.group_name || "default")}</small></td>
              <td><small>${c.created_at ? new Date(c.created_at).toLocaleDateString("ar") : "—"}</small></td>
            </tr>`).join("")}
          </tbody>
        </table></div>` : `<p class="muted-hint">لا أرقام${activeGroup ? " في هذه المجموعة" : " مرفوعة بعد — ارفع أرقامك الأولى أدناه"}.</p>`}
      </div>` : ""}

      <div class="contacts-upload-area">
        <p class="upload-heading">${icon("users")} رفع مجموعة جديدة</p>
        <label>
          اسم المجموعة <small>(مثال: عملاء 2024، قاعدة صفا، متابعو انستغرام)</small>
          <input id="contacts-group-name" placeholder="اسم المجموعة" maxlength="60">
        </label>
        <label>
          الصق الأرقام هنا <small>(رقم لكل سطر أو مفصولة بفواصل — أي تنسيق يُقبَل)</small>
          <textarea id="contacts-textarea" rows="7" dir="ltr" placeholder="0501234567&#10;+90 532 111 22 33&#10;905001112233&#10;..."></textarea>
        </label>
        <div class="form-actions">
          <button class="primary-button" data-action="contacts-upload">${icon("users")} رفع وحفظ</button>
          ${contacts && contacts.total ? `<button class="danger-button" data-action="contacts-clear">حذف الكل</button>` : ""}
          <button class="secondary-button" data-action="contacts-panel-close">إغلاق</button>
        </div>
      </div>
    </section>
    ` : ""}

    ${showOptouts ? `
    <section class="dashboard-card campaign-form-card">
      <div class="card-heading">
        <div><h3>${icon("shield")} الأرقام المستبعدة من الإرسال</h3><p>أي رقم هنا يُستبعد تلقائياً من كل الحملات — بغض النظر عن مصدره (أرقام مرفوعة، عملاء المنصة، غير النشطين)</p></div>
        ${optouts ? `<span class="count-chip">${optouts.total.toLocaleString("ar")} رقم</span>` : ""}
      </div>

      ${optouts && optouts.optouts.length ? `
      <div class="contacts-groups-list">
        <p class="groups-heading">${icon("shield")} الأرقام المستبعدة حالياً</p>
        <div class="campaigns-table-wrap"><table class="admin-table campaigns-table">
          <thead><tr><th>الرقم</th><th>السبب</th><th>تاريخ الإضافة</th><th></th></tr></thead>
          <tbody>
            ${optouts.optouts.map(o => `<tr>
              <td dir="ltr"><code>${esc(o.phone)}</code></td>
              <td><small>${esc(o.reason || "—")}</small></td>
              <td><small>${new Date(o.created_at).toLocaleDateString("ar")}</small></td>
              <td><button class="danger-button compact" data-action="optout-remove" data-phone="${escAttr(o.phone)}" title="إلغاء الاستبعاد">${icon("trash")}</button></td>
            </tr>`).join("")}
          </tbody>
        </table></div>
      </div>` : optouts ? `<p class="muted-hint">لا أرقام مستبعدة بعد.</p>` : ""}

      <div class="contacts-upload-area">
        <p class="upload-heading">${icon("shield")} استبعاد أرقام جديدة</p>
        <label>
          الصق الأرقام هنا <small>(رقم لكل سطر أو مفصولة بفواصل — أي تنسيق يُقبَل)</small>
          <textarea id="optout-textarea" rows="5" dir="ltr" placeholder="0501234567&#10;+90 532 111 22 33&#10;905001112233&#10;..."></textarea>
        </label>
        <label>
          السبب <small>(اختياري — مثال: طلب العميل، شكوى، رقم غير صحيح)</small>
          <input id="optout-reason" placeholder="السبب" maxlength="120">
        </label>
        <div class="form-actions">
          <button class="primary-button" data-action="optout-add">${icon("shield")} استبعاد</button>
          ${optouts && optouts.total ? `<button class="danger-button" data-action="optout-clear">حذف الكل</button>` : ""}
          <button class="secondary-button" data-action="optouts-panel-close">إغلاق</button>
        </div>
      </div>
    </section>
    ` : ""}

    ${showForm ? `
    <section class="dashboard-card campaign-form-card">
      <div class="card-heading"><div><h3>إنشاء حملة ترويجية</h3><p>ترسَل عبر رقم واتساب المنصة +90 555 100 06 30</p></div></div>
      <div class="campaign-form">
        <label>اسم الحملة <small>(داخلي فقط)</small>
          <input id="cf-name" placeholder="مثال: عروض رمضان 2026" maxlength="80">
        </label>
        <label>اسم القالب <small>(approved في Meta — مثال: <code>platform_promo</code>)</small>
          <input id="cf-tpl" placeholder="template_name" dir="ltr" maxlength="60">
        </label>
        <label>لغة القالب
          <select id="cf-lang">
            <option value="ar" selected>عربي (ar)</option>
            <option value="tr">تركي (tr)</option>
            <option value="en_US">إنجليزي (en_US)</option>
          </select>
        </label>
        <label>معاملات جسم القالب {{1}}, {{2}} ... <small>(مفصولة بفاصلة — اتركها فارغة إن لم يكن للقالب متغيرات نصية)</small>
          <input id="cf-params" placeholder="" dir="ltr">
        </label>
        <label>لاحقة رابط الزر <small>(إذا كان الزر يحتوي <code dir="ltr">{{1}}</code> في رابطه — اتركها فارغة إن كان الرابط ثابتاً)</small>
          <input id="cf-button-url" placeholder="مثال: stores أو اتركه فارغاً" dir="ltr">
        </label>
        <label>رابط صورة الهيدر <small>(مطلوب إذا كان هيدر القالب صورة ديناميكية)</small>
          <input id="cf-header-image" placeholder="https://www.dukkanci.com.tr/assets/..." dir="ltr">
        </label>
        <label>الجمهور المستهدف
          <select id="cf-audience" data-action="cf-audience-change">
            <option value="wa_contacts">📋 الأرقام المرفوعة${contacts && contacts.total ? ` (${contacts.total.toLocaleString("ar")} رقم)` : ""}</option>
            <option value="all_customers">جميع عملاء المنصة</option>
            <option value="no_order_30d">العملاء غير النشطين منذ 30 يوماً</option>
          </select>
        </label>
        <label id="cf-group-label">
          المجموعة <small>(اتركها "الكل" لاستهداف جميع الأرقام المرفوعة)</small>
          <select id="cf-group">
            <option value="">الكل${contacts && contacts.total ? ` — ${contacts.total.toLocaleString("ar")} رقم` : ""}</option>
            ${groups.map(g => `<option value="${escAttr(g.group_name)}">${esc(g.group_name)} — ${g.count.toLocaleString("ar")} رقم</option>`).join("")}
          </select>
        </label>
        <label>ملاحظة <small>(اختياري)</small>
          <input id="cf-note" placeholder="ملاحظة داخلية">
        </label>
        <div class="form-notice">
          ${icon("megaphone")}
          <span>تأكد أن القالب <strong>معتمد (Approved)</strong> في Meta كـ <em>Marketing</em> قبل الإرسال. ${icon("arrowLeft")} <a href="https://business.facebook.com/wa/manage/message-templates/" target="_blank" rel="noopener">فتح مدير القوالب</a></span>
        </div>
        <div class="form-actions">
          <button class="primary-button" data-action="campaign-create">إنشاء الحملة</button>
          <button class="secondary-button" data-action="campaign-form-close">إلغاء</button>
        </div>
      </div>
    </section>
    ` : ""}

    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${icon("megaphone")} الحملات</h3><p>كل حملاتك الترويجية وحالتها الحالية</p></div></div>
      ${camps.length === 0 ? `<div class="empty-managed">${icon("megaphone")}<p>لا حملات بعد. أنشئ أولى حملاتك الترويجية!</p></div>` : `
      <div class="campaigns-table-wrap"><table class="admin-table campaigns-table">
        <thead><tr><th>الاسم</th><th>القالب</th><th>الجمهور</th><th>الحالة</th><th>التقدم</th><th>الإجراءات</th></tr></thead>
        <tbody>
          ${camps.map(c => {
            const pct = campaignProgress(c);
            const stat = campaignStatusClass(c.status);
            const canBuild  = ["draft"].includes(c.status);
            const canStart  = c.status === "ready";
            const canResume = ["paused", "paused_daily_limit"].includes(c.status);
            const canPause  = c.status === "sending";
            const canCancel = !["done", "canceled"].includes(c.status);
            return `<tr>
              <td><strong>${esc(c.name)}</strong><br><small style="color:#888">${new Date(c.created_at).toLocaleDateString("ar")}</small></td>
              <td><code style="font-size:11px">${esc(c.template_name)}</code><br><small>${esc(c.template_lang)}</small></td>
              <td><small>${audienceLabel(c.audience_type, c.contact_group)}</small></td>
              <td><span class="status-pill ${stat}">${campaignStatusLabel(c.status)}</span></td>
              <td>
                <div class="campaign-progress-wrap">
                  <div class="campaign-progress-bar"><div class="campaign-progress-fill" style="width:${pct}%"></div></div>
                  <small>
                    ${(c.sent_count || 0).toLocaleString("ar")} / ${(c.total_recipients || 0).toLocaleString("ar")} · ${pct}%
                    ${c.failed_count ? ` · <span style="color:#dc2626">${c.failed_count} فشل <button class="inline-link" data-action="campaign-show-errors" data-id="${c.id}">(عرض السبب)</button></span>` : ""}
                    ${c.total_recipients === 0 && c.status !== "draft" ? ` · <span style="color:#f59e0b">⚠ لا مستلمين — أعد بناء القائمة</span>` : ""}
                  </small>
                  ${c.status === "sending" ? `<small style="color:var(--accent);font-size:10px">● إرسال تلقائي نشط</small>` : ""}
                  ${state.adminCampaignErrors && state.adminCampaignErrors.id === c.id ? `
                  <div class="campaign-errors-box">
                    <strong style="font-size:12px;color:#dc2626">أخطاء الإرسال:</strong>
                    ${(state.adminCampaignErrors.rows || []).slice(0,5).map(r =>
                      `<div class="campaign-error-row"><code dir="ltr">${esc(r.phone)}</code> — <span>${esc(r.error || "خطأ غير معروف")}</span></div>`
                    ).join("")}
                  </div>` : ""}
                </div>
              </td>
              <td class="campaign-actions">
                ${canBuild  ? `<button class="secondary-button compact" data-action="campaign-build"   data-id="${c.id}">بناء القائمة</button>` : ""}
                ${c.status !== "draft" && c.status !== "ready" && c.status !== "done" && c.status !== "canceled"
                  ? `<button class="secondary-button compact" data-action="campaign-build" data-id="${c.id}" title="إعادة بناء قائمة المستلمين">↺ إعادة بناء</button>` : ""}
                ${canStart  ? `<button class="primary-button compact"   data-action="campaign-start"   data-id="${c.id}">ابدأ الإرسال</button>` : ""}
                ${canResume ? `<button class="primary-button compact"   data-action="campaign-resume"  data-id="${c.id}">استئناف</button>` : ""}
                ${canPause  ? `<button class="secondary-button compact" data-action="campaign-send-manual" data-id="${c.id}" title="أرسل دفعة واحدة الآن">إرسال دفعة ▶</button>` : ""}
                ${canPause  ? `<button class="secondary-button compact" data-action="campaign-pause"   data-id="${c.id}">إيقاف مؤقت</button>` : ""}
                ${(c.failed_count > 0 && c.status !== "sending") ? `<button class="primary-button compact" data-action="campaign-retry-failed" data-id="${c.id}">↺ إعادة إرسال الفاشلين</button>` : ""}
                <button class="secondary-button compact" data-action="campaign-edit-params" data-id="${c.id}"
                  data-params="${escAttr(JSON.stringify(c.template_params || []))}"
                  data-button-url="${escAttr(c.button_url_param ?? "")}"
                  data-header-image="${escAttr(c.header_image_url ?? "")}" title="تعديل معاملات القالب">تعديل المعاملات</button>
                ${canCancel ? `<button class="danger-button compact"    data-action="campaign-cancel"  data-id="${c.id}">إلغاء</button>` : ""}
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>
      `}
    </section>

    <section class="dashboard-card" style="margin-top:16px">
      <div class="card-heading"><div><h3>إرشادات الإرسال</h3><p>لضمان قبول الرسائل من Meta</p></div></div>
      <ul class="campaign-tips">
        <li>${icon("users")} ارفع أرقام العملاء السابقين أولاً عبر زر <strong>إدارة الأرقام المرفوعة</strong> ثم اختر "قائمة الأرقام المرفوعة" عند إنشاء الحملة.</li>
        <li>${icon("shield")} الحد اليومي <strong>2000 رسالة</strong> — الحملات الطويلة تُستأنف تلقائياً في اليوم التالي.</li>
        <li>${icon("megaphone")} القالب يجب أن يكون <strong>Approved – Marketing</strong> في Meta Business Manager.</li>
        <li>${icon("whatsapp")} إذا رفض Meta الرسالة تأكد من صحة اسم القالب واللغة وعدد المتغيرات {{1}} {{2}}.</li>
        <li>${icon("shield")} أضف أي رقم إلى <strong>الأرقام المستبعدة</strong> لتجاوزه تلقائياً في كل الحملات الحالية والقادمة.</li>
      </ul>
    </section>
  `;
}

async function loadContacts(group = "") {
  try {
    const [listData, groupsData] = await Promise.all([
      campaignApi("contacts-list", group ? { params: { group } } : {}),
      campaignApi("contacts-groups")
    ]);
    state.adminContacts = {
      total:      listData.total || 0,
      preview:    listData.contacts || [],
      group:      listData.group || "",
      scopeTotal: listData.scopeTotal || listData.total || 0,
      groups:     groupsData.groups || []
    };
    render();
  } catch (e) {
    state.adminContacts = { total: 0, preview: [], group: "", scopeTotal: 0, groups: [] };
    render();
  }
}

async function loadOptouts() {
  try {
    const data = await campaignApi("optout-list");
    state.adminOptouts = { total: data.total || 0, optouts: data.optouts || [] };
    render();
  } catch (e) { state.adminOptouts = { total: 0, optouts: [] }; render(); }
}

// Campaign send loop: fires send-batch, then schedules the NEXT batch ONLY AFTER
// the current one fully returns. (Previously this used setInterval(…, 3000): a batch
// of 8 sends takes ~5s — longer than the 3s tick — so two send-batch calls overlapped,
// grabbed the same pending rows, and sent every message twice. That inflated Meta's
// "messages sent" to ~2× and corrupted sent_count via lost updates.) A self-scheduling
// timeout guarantees strictly one batch in flight at a time. A generation counter makes
// any tick that was awaiting when the loop is stopped/restarted bail out harmlessly.
let _campaignPollTimer = null;
let _campaignPollGen = 0;
function startCampaignPoll(id) {
  stopCampaignPoll();
  const gen = ++_campaignPollGen;
  state.adminCampaignActive = id;
  const tick = async () => {
    if (gen !== _campaignPollGen) return; // superseded by a newer start, or stopped
    if (state.adminTab !== "campaigns" || !state.adminKey) { stopCampaignPoll(); return; }
    let result;
    try {
      result = await campaignApi("send-batch", { method: "POST", id });
      // Refresh campaign list to show updated progress
      const listData = await campaignApi("list");
      state.adminCampaigns = listData.campaigns || [];
      render();
    } catch (e) { stopCampaignPoll(); return; }
    if (gen !== _campaignPollGen) return; // stopped while we were awaiting
    if (result.done || result.paused || !result.ok) { stopCampaignPoll(); return; }
    _campaignPollTimer = setTimeout(tick, 3000); // only now queue the next batch
  };
  tick();
}
function stopCampaignPoll() {
  _campaignPollGen++; // invalidate any in-flight tick from the current loop
  if (_campaignPollTimer) { clearTimeout(_campaignPollTimer); _campaignPollTimer = null; }
  state.adminCampaignActive = null;
}

// ─── renderAdmin ──────────────────────────────────────────────────────────────

// ---- Admin: التتبع والبيانات التسويقية (Phase 2b reports over tracking_events) ----
async function loadMarketingReport() {
  const f = state.adminMarketingFilter || (state.adminMarketingFilter = { range: 30 });
  // pick up the store filter from the dropdown if it's on screen
  const sel = document.getElementById("marketing-store");
  if (sel) f.store = sel.value;
  state.adminMarketing = { loading: true };
  render();
  try {
    const to = new Date(Date.now() + 864e5).toISOString();
    const from = new Date(Date.now() - (f.range || 30) * 864e5).toISOString();
    const res = await fetch("/api/track-report", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-token": state.adminKey || "" },
      body: JSON.stringify({ from, to, store: f.store || "all" })
    });
    if (res.status === 403) { lockAdmin(); return; }
    const data = await res.json();
    state.adminMarketing = data && data.report ? { report: data.report } : { error: (data && data.error) || "تعذّر تحميل التقرير" };
  } catch (e) {
    state.adminMarketing = { error: e.message };
  }
  render();
}

function adminMarketing() {
  const m = state.adminMarketing;
  const f = state.adminMarketingFilter || { range: 30 };
  const ar = x => Number(x || 0).toLocaleString("ar");
  const ranges = [[7, "7 أيام"], [30, "30 يوم"], [90, "90 يوم"]];
  const storeOptions = `<option value="all">كل المتاجر</option>` +
    [...stores].sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s =>
      `<option value="${s.id}" ${String(f.store) === String(s.id) ? "selected" : ""}>${escAttr(s.name)}</option>`).join("");
  const toolbar = `
    <div class="dashboard-toolbar">
      <div class="toolbar-actions">${ranges.map(([d, l]) =>
        `<button class="${(f.range || 30) === d ? "primary-button" : "secondary-button"} compact" data-action="marketing-range" data-days="${d}">${l}</button>`).join("")}</div>
      <div class="toolbar-actions">
        <select class="filter-select" id="marketing-store">${storeOptions}</select>
        <button class="secondary-button compact" data-action="marketing-refresh">${icon("filter")} تحديث</button>
      </div>
    </div>`;

  if (!m || m.loading) return toolbar + `<section class="dashboard-card"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل التقارير…</p></div></section>`;
  if (m.error) return toolbar + `<section class="dashboard-card"><div class="empty-managed">${icon("shield")}<p>تعذّر تحميل التقرير.<br><small dir="ltr">${esc(m.error)}</small></p></div></section>`;

  const r = m.report || {}, t = r.totals || {};
  const kpi = (val, label, ic, tone = "") => `<div class="kpi-card ${tone}"><span class="kpi-icon">${icon(ic)}</span><div class="kpi-body"><b>${val}</b><small>${label}</small></div></div>`;
  const tableCard = (title, sub, head, rows) => `
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>${title}</h3><p>${sub}</p></div></div>
      ${rows ? `<div class="table-wrap"><table class="admin-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`
             : `<div class="empty-managed">${icon("chart")}<p>لا توجد بيانات في هذه الفترة بعد.</p></div>`}
    </section>`;

  const topStores = (r.top_stores || []).map(s =>
    `<tr><td>${esc(s.name)}</td><td>${ar(s.store_views)}</td><td>${ar(s.add_to_cart)}</td><td>${ar(s.purchases)}</td><td>${ar(s.whatsapp_clicks)}</td><td>${s.store_views > 0 ? ((s.purchases / s.store_views) * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
  const topProducts = (r.top_products || []).map(p =>
    `<tr><td>${esc(p.name)}</td><td>${ar(p.views)}</td><td>${ar(p.add_to_cart)}</td></tr>`).join("");
  const sources = (r.traffic_sources || []).map(s =>
    `<tr><td dir="ltr">${esc(s.source)}</td><td>${ar(s.visitors)}</td></tr>`).join("");
  const campaigns = (r.top_campaigns || []).map(c =>
    `<tr><td dir="ltr">${esc(c.campaign)}</td><td>${ar(c.visitors)}</td><td>${ar(c.purchases)}</td><td>${money(c.revenue)}</td></tr>`).join("");

  // نقرات واتساب لكل متجر — كل المتاجر التي لها نقرات، مرتّبة تنازلياً + تصدير CSV
  const waByStore = r.whatsapp_by_store || [];
  const waRows = waByStore.map((s, i) =>
    `<tr><td>${ar(i + 1)}</td><td>${esc(s.name)}</td><td><strong>${ar(s.whatsapp_clicks)}</strong></td><td>${ar(s.unique_visitors)}</td><td>${ar(s.store_views)}</td><td>${s.store_views > 0 ? ((s.whatsapp_clicks / s.store_views) * 100).toFixed(1) + "%" : "—"}</td></tr>`).join("");
  const waCard = `
    <section class="dashboard-card">
      <div class="card-heading">
        <div><h3>${icon("whatsapp")} نقرات واتساب لكل متجر</h3><p>كل المتاجر التي نُقر زر واتساب لديها · آخر ${f.range || 30} يوم</p></div>
        ${waByStore.length ? `<button class="secondary-button compact" data-action="export-csv" data-kind="whatsapp">${icon("download")} تصدير CSV</button>` : ""}
      </div>
      ${waByStore.length
        ? `<div class="table-wrap"><table class="admin-table"><thead><tr><th>#</th><th>المتجر</th><th>نقرات واتساب</th><th>زوّار فريدون</th><th>مشاهدات</th><th>معدل النقر</th></tr></thead><tbody>${waRows}</tbody></table></div>`
        : `<div class="empty-managed">${icon("whatsapp")}<p>لا توجد نقرات واتساب في هذه الفترة بعد.</p></div>`}
    </section>`;

  return `
    ${toolbar}
    <div class="stats-grid admin-stats">
      ${kpi(ar(t.visitors), "زائر فريد", "users")}
      ${kpi(ar(t.store_views), "مشاهدات المتاجر", "store")}
      ${kpi(ar(t.product_views), "مشاهدات المنتجات", "eye")}
      ${kpi(ar(t.add_to_cart), "إضافات للسلة", "bag")}
      ${kpi(ar(t.begin_checkout), "بدء الطلب", "receipt")}
      ${kpi(ar(t.purchases), "طلبات مكتملة", "check", "green")}
      ${kpi(money(t.revenue), "إجمالي المبيعات", "wallet")}
      ${kpi(ar(t.whatsapp_clicks), "نقرات واتساب", "whatsapp")}
      ${kpi(ar(t.leads), "أرقام مؤكَّدة (Lead)", "phone")}
      ${kpi((r.conversion_rate || 0) + "%", "معدل التحويل (زائر→طلب)", "chart")}
      ${kpi((r.cart_conversion || 0) + "%", "تحويل السلة→طلب", "chart")}
      ${kpi(ar(r.abandoned_carts), "سلات متروكة", "bag", "orange")}
    </div>
    ${tableCard("أكثر المتاجر مشاهدةً وتحويلاً", "مشاهدات وإضافات وطلبات لكل متجر",
      `<th>المتجر</th><th>مشاهدات</th><th>سلة</th><th>طلبات</th><th>واتساب</th><th>تحويل</th>`, topStores)}
    ${waCard}
    ${tableCard("أكثر المنتجات مشاهدةً", "أعلى المنتجات اهتماماً", `<th>المنتج</th><th>مشاهدات</th><th>إضافات للسلة</th>`, topProducts)}
    <div class="admin-two-col">
      ${tableCard("مصادر الزيارات", "من أين جاء الزوار", `<th>المصدر</th><th>زوّار</th>`, sources)}
      ${tableCard("أكثر الحملات جلباً للطلبات", "حسب utm_campaign", `<th>الحملة</th><th>زوّار</th><th>طلبات</th><th>مبيعات</th>`, campaigns)}
    </div>`;
}

// ---- Merchant: تحليلات المتجر (Phase 3 per-store dashboard, aggregate-only) ----
async function loadMerchantReport() {
  const sid = state.merchantStoreId || (getMerchantStore() || {}).id;
  if (sid == null) { state.merchantAnalytics = { error: "لا يوجد متجر محدّد" }; render(); return; }
  const f = state.merchantAnalyticsFilter || (state.merchantAnalyticsFilter = { range: 30 });
  state.merchantAnalytics = { loading: true };
  render();
  try {
    const to = new Date(Date.now() + 864e5).toISOString();
    const from = new Date(Date.now() - (f.range || 30) * 864e5).toISOString();
    const headers = { "Content-Type": "application/json" };
    if (state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    const res = await fetch("/api/track-report", { method: "POST", headers, body: JSON.stringify({ from, to, store: sid }) });
    const data = await res.json();
    state.merchantAnalytics = data && data.report ? { report: data.report } : { error: (data && data.error) || "تعذّر تحميل التقرير" };
  } catch (e) {
    state.merchantAnalytics = { error: e.message };
  }
  render();
}

function merchantAnalytics() {
  const m = state.merchantAnalytics;
  const f = state.merchantAnalyticsFilter || { range: 30 };
  const ar = x => Number(x || 0).toLocaleString("ar");
  const ranges = [[7, "7 أيام"], [30, "30 يوم"], [90, "90 يوم"]];
  const toolbar = `
    <div class="dashboard-toolbar">
      <div class="toolbar-actions">${ranges.map(([d, l]) =>
        `<button class="${(f.range || 30) === d ? "primary-button" : "secondary-button"} compact" data-action="merchant-range" data-days="${d}">${l}</button>`).join("")}</div>
      <div class="toolbar-actions"><button class="secondary-button compact" data-action="export-merchant-report">${icon("download")} تصدير التقرير</button><button class="secondary-button compact" data-action="merchant-report-refresh">${icon("filter")} تحديث</button></div>
    </div>`;
  if (!m || m.loading) return toolbar + `<section class="dashboard-card"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ تحميل تحليلات متجرك…</p></div></section>`;
  if (m.error) return toolbar + `<section class="dashboard-card"><div class="empty-managed">${icon("shield")}<p>تعذّر تحميل التحليلات.<br><small dir="ltr">${esc(m.error)}</small></p></div></section>`;

  const r = m.report || {}, t = r.totals || {};
  const kpi = (val, label, ic, tone = "") => `<div class="kpi-card ${tone}"><span class="kpi-icon">${icon(ic)}</span><div class="kpi-body"><b>${val}</b><small>${label}</small></div></div>`;
  const tableCard = (title, sub, head, rows) => `
    <section class="dashboard-card"><div class="card-heading"><div><h3>${title}</h3><p>${sub}</p></div></div>
      ${rows ? `<div class="table-wrap"><table class="admin-table"><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`
             : `<div class="empty-managed">${icon("chart")}<p>لا توجد بيانات في هذه الفترة بعد.</p></div>`}</section>`;
  const products = (r.top_products || []).map(p => `<tr><td>${esc(p.name)}</td><td>${ar(p.views)}</td><td>${ar(p.add_to_cart)}</td></tr>`).join("");
  const sources = (r.traffic_sources || []).map(s => `<tr><td dir="ltr">${esc(s.source)}</td><td>${ar(s.visitors)}</td></tr>`).join("");

  return `
    ${toolbar}
    <div class="stats-grid admin-stats">
      ${kpi(ar(t.visitors), "زائر فريد", "users")}
      ${kpi(ar(t.store_views), "مشاهدات متجرك", "store")}
      ${kpi(ar(t.product_views), "مشاهدات المنتجات", "eye")}
      ${kpi(ar(t.add_to_cart), "إضافات للسلة", "bag")}
      ${kpi(ar(t.begin_checkout), "بدء الطلب", "receipt")}
      ${kpi(ar(t.purchases), "طلبات مكتملة", "check", "green")}
      ${kpi(money(t.revenue), "إجمالي المبيعات", "wallet")}
      ${kpi(ar(t.whatsapp_clicks), "نقرات واتساب", "whatsapp")}
      ${kpi((r.conversion_rate || 0) + "%", "معدل التحويل (زائر→طلب)", "chart")}
      ${kpi((r.cart_conversion || 0) + "%", "تحويل السلة→طلب", "chart")}
      ${kpi(ar(r.abandoned_carts), "سلات متروكة", "bag", "orange")}
    </div>
    ${tableCard("أكثر منتجاتك مشاهدةً", "ما الذي يجذب اهتمام زوّارك", `<th>المنتج</th><th>مشاهدات</th><th>إضافات للسلة</th>`, products)}
    ${tableCard("مصادر زوّارك", "من أين يأتي زوّار متجرك", `<th>المصدر</th><th>زوّار</th>`, sources)}
    ${merchantProductReports()}
    ${merchantSearchReportCard()}`;
}

function renderAdmin() {
  // Gate the whole admin panel behind the password (set ADMIN_PASSWORD in Vercel).
  if (!state.adminKey) return adminLoginScreen();

  // Pull EVERY store's orders from the cloud once per session so the platform's
  // reports/totals reflect all activity (not just this browser's local orders).
  if (!state._adminOrdersFetched) {
    state._adminOrdersFetched = true;
    loadOrdersFromSupabase().then(ok => { if (ok) render(); });
  }
  const content = { overview: adminOverview, stores: adminStores, categories: adminCategoriesSection, products: adminProducts, customers: adminCustomers, orders: adminOrders, messages: adminMessages, campaigns: adminCampaigns, notifications: adminNotifications, media: adminMedia, catalog: adminCatalog, complaints: adminComplaints, coupons: adminCoupons, delivery: adminDeliveryZones, storeCategories: adminStoreCategories, credentials: adminCredentials, content: adminContent, banners: adminBanners, integrations: adminIntegrations, marketing: adminMarketing, fbads: adminFbAds, ai: adminAI }[state.adminTab]();
  const titles = { overview: ["نظرة عامة", "مرحباً بك في مركز إدارة دكانجي"], stores: ["إدارة المتاجر", "راجع المتاجر والاشتراكات وحالات النشاط"], categories: ["إدارة التصنيفات", "أضف أو عدّل أو احذف أو أخفِ تصنيفات المتاجر — تظهر في الرئيسية وفلتر المتاجر ونموذج انضمام التجار"], products: ["إدارة المنتجات", "أظهر أو أخفِ أي منتج وعدّل اسمه وسعره"], customers: ["إدارة العملاء", "بيانات العملاء وسجل طلباتهم"], orders: ["كل الطلبات", "تابع الطلبات وتدخل عند الحاجة"], messages: ["محادثات العملاء", "ردّ على رسائل واتساب من نفس رقم المنصة"], campaigns: ["حملات واتساب", "أرسل رسائل ترويجية للعملاء عبر رقم المنصة (2000 رسالة/يوم)"], notifications: ["الإشعارات والحملات المُستهدَفة", "أرسل إشعارات ترويجية لشريحة محددة من العملاء — من نزّل التطبيق ولم يطلب، من ترك سلته، العملاء الخاملون وغيرها"], media: ["مكتبة الصور", "ارفع صور الحملات واحصل على روابط مباشرة لاستخدامها في أي مكان"], catalog: ["مخزن الصور المشترك", "راجع واعتمد أو ارفض عناصر مخزن الصور قبل ظهورها لمتاجر السوبر ماركت الأخرى"], complaints: ["إدارة الشكاوى", "تابع شكاوى العملاء حتى الحل"], coupons: ["الكوبونات", "أنشئ وأدر أكواد الخصم — لمتجر واحد أو لكل المتاجر"], delivery: ["مناطق التوصيل", "أسعار توصيل ثابتة لمجمعات ومناطق محددة لكل متجر"], storeCategories: ["تصنيفات المتاجر", "تجاوز يدوي لترتيب/دمج تصنيفات منتجات أي متجر — فوق الترتيب التلقائي"], credentials: ["حسابات المتاجر", "اسم المستخدم (الهاتف) وكلمة المرور لكل متجر — تُسلَّم بعد دفع الاشتراك"], content: ["إدارة المحتوى", "تحكم في الصفحة الرئيسية والعروض والخطط"], banners: ["إدارة البانرات", "أضِف بانرات بصور وروابط، حدّد مكان وفترة ظهور كل بانر وعددها، وقِس نقراتها"], integrations: ["التكاملات", "GA4 وGoogle Ads وMeta Pixel وبقية بيكسلات التتبع والإعلان"], marketing: ["التتبع والبيانات التسويقية", "الزوّار والتحويلات ومصادر الزيارات والحملات لكل متجر"], fbads: ["استهداف فيسبوك", "قارن موقع أي محل بالمجمعات السكنية حسب المنطقة — مسافة، وقت، وتقدير تكلفة توصيل. قاعدة بيانات مستقلة تماماً عن متاجر الموقع"], ai: ["إدارة الذكاء الاصطناعي", "مفاتيح المزوّدين، المزوّد النشط لكل ميزة، والاستهلاك"] };
  const [title, subtitle] = titles[state.adminTab];
  return `<div class="dashboard-shell admin-shell">${dashboardSidebar("admin", state.adminTab)}<main class="dashboard-main"><header class="dashboard-header"><div class="dashboard-heading"><span class="mobile-dashboard-label">لوحة الإدارة</span><div class="dashboard-title-row"><h1>${title}</h1></div><p>${subtitle}</p></div><div class="dashboard-header__actions"><span class="dashboard-date">${icon("calendar")} ${dashboardDate()}</span><button class="icon-button" data-action="admin-enable-push" aria-label="تفعيل إشعارات الطلبات الجديدة" title="تفعيل إشعارات الطلبات الجديدة">${icon("bell")}<b></b></button><button class="view-store" data-action="route-home">${icon("eye")} عرض الموقع</button></div></header><div class="dashboard-content">${content}</div></main></div>`;
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
  if (quote.provider === "zone" || quote.provider === "fixed") {
    const note = quote.provider === "zone" ? `سعر توصيل ثابت لمنطقة ${escAttr(quote.zoneLabel || "")}` : "سعر توصيل ثابت لهذا المتجر";
    return `
      <div class="delivery-calculator">
        <div class="delivery-calculator__head"><span>${icon("map")}</span><div><strong>حسبة التوصيل لهذا العنوان</strong><p>${note}</p></div><b>${money(quote.fee)}</b></div>
      </div>
    `;
  }
  if (quote.exceedsMaxDistance) {
    return `<div class="delivery-calculator warning">${icon("map")}<div><strong>العنوان خارج نطاق التوصيل</strong><p>المسافة ذهاباً وإياباً ${formatDistance(quote.roundTripKm)}، والحد الأقصى لهذا المتجر ${formatDistance(settings.maxRoundTripKm)}.</p></div></div>`;
  }
  if (quote.provider === "nationwide") {
    return `
      <div class="delivery-calculator">
        <div class="delivery-calculator__head"><span>${icon("box")}</span><div><strong>شحن عبر شركة الشحن (كارجو)</strong><p>عنوانك خارج نطاق التوصيل المحلي، فيُشحن طلبك عبر شركة شحن لعموم الولايات التركية برسم ثابت.</p></div><b>${money(quote.fee)}</b></div>
      </div>
    `;
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
      <div class="delivery-equation">${(() => {
        const raw = quote.rawFee ?? quote.fee;
        return raw === quote.fee
          ? `${formatDistance(quote.roundTripKm)} × ${money(quote.ratePerKm)} = <strong>${money(quote.fee)}</strong>`
          : `${formatDistance(quote.roundTripKm)} × ${money(quote.ratePerKm)} = ${money(raw)} → <strong>${money(quote.fee)}</strong> <small>(الحد الأدنى 150 وتقريب لأعلى 50)</small>`;
      })()}</div>
    </div>
  `;
}

function renderCheckout() {
  // Feature flags (incl. the coupon field below) load async from Supabase and can
  // still be mid-flight the first time a fast/returning visitor reaches checkout
  // (persisted cart + slower mobile network). Re-render once they land instead of
  // leaving the coupon field permanently missing for that page load.
  if (window.DUKKANCI_INTEGRATIONS && !window.DUKKANCI_INTEGRATIONS.loaded) {
    window.DUKKANCI_INTEGRATIONS.load().then(() => { if (state.route === "checkout") render(); });
  }
  // The cart persists in localStorage independently of the live catalog — if a
  // product was deleted/hidden after being added, drop it here instead of
  // crashing the whole checkout page on the stale reference.
  const liveCart = state.cart.filter(item => getProduct(item.productId));
  if (liveCart.length !== state.cart.length) {
    state.cart = liveCart;
    saveState();
    updateCartBadges();
    showToast("تمت إزالة منتج لم يعد متوفراً من سلتك", "");
  }
  if (!state.cart.length) return `<section class="section empty-page">${renderEmpty("سلتك فارغة", "أضف بعض المنتجات أولاً لتتمكن من إكمال الطلب.", "تصفح المتاجر", "stores")}</section>`;
  const store = getStore(state.cart[0].storeId);
  const defaultAddress = getDefaultAddress();
  // Selection priority: what the customer explicitly picked (if it still exists) →
  // captured current location → default saved address.
  const savedSel = state.checkoutSelectedAddressId;
  const savedSelValid = savedSel === "current"
    ? !!(state.checkoutLocation || getUserLocationAddress())
    : state.customerAddresses.some(a => String(a.id) === String(savedSel));
  const selectedAddressId = (savedSel && savedSelValid) ? savedSel : (state.checkoutLocation ? "current" : defaultAddress?.id);
  const totals = cartTotals(selectedAddressId);
  const deliverySettings = getDeliverySettings(store.id);
  const profile = state.customerProfile || {};
  const dayFmt = new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long" });
  const today = new Date(), tomorrow = new Date(Date.now() + 86400000);
  // Home-kitchen products can require the order be placed a set number of
  // hours ahead (24/48h) — take the strictest requirement across the cart and
  // block same-day/too-soon scheduling for it. This day-level gate is only an
  // approximate pre-filter for the UI; the submit handler re-validates the
  // exact chosen day+time against the real elapsed hours (a "tomorrow" pick
  // made late in the day can still be less than 24h away).
  const cartLeadHours = cartRequiredLeadHours(state.cart);
  const minDayIndex = cartLeadHours >= 48 ? 2 : cartLeadHours >= 24 ? 1 : 0;
  const dayDates = [today, tomorrow, new Date(Date.now() + 2 * 86400000)];
  const dayLabels = ["اليوم", "غداً", "بعد غد"];
  const visibleDays = minDayIndex > 0 ? 3 : 2;
  const dayOptions = dayDates.slice(0, visibleDays).map((d, i) => {
    const label = `${dayLabels[i]} · ${dayFmt.format(d)}`;
    const disabled = i < minDayIndex;
    return `<option ${disabled ? "disabled" : ""} ${i === minDayIndex ? "selected" : ""}>${label}</option>`;
  }).join("");
  const timeOptions = (cartLeadHours > 0 ? [] : ["في أقرب وقت"]).concat(["14:00 - 15:00", "17:00 - 18:00"])
    .map(t => `<option>${t}</option>`).join("");
  return `
    <section class="page-hero compact checkout-hero"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><strong>إتمام الطلب</strong></div><h1>إتمام طلبك</h1><p>راجع التفاصيل وحدد طريقة الاستلام والدفع.</p></div></section>
    ${!isStoreOpenNow(store) ? `<div class="container"><div class="review-note order-closed-note" style="margin-top:16px">${icon("clock")} <span><strong>المتجر مغلق الآن.</strong><small>يمكنك إتمام طلبك الآن، وسيتم تنفيذه في اليوم التالي عند فتح المتجر.</small></span></div></div>` : ""}
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
            <div class="checkout-card__title"><span>٢</span><div><h2>بياناتك وعنوان التوصيل</h2><p>نحتاج اسمك ورقمك ليتواصل المتجر معك ويصلك التحديث.</p></div></div>
            <div class="form-grid">
              <label><span>الاسم <i class="req">*</i></span><input name="contactName" autocomplete="name" required value="${escAttr(profile.name || "")}" placeholder="اسمك الكامل"></label>
              <label><span>رقم واتساب <i class="req">*</i></span><input name="contactPhone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr" value="${escAttr(profile.phone || "")}" placeholder="+90 555 000 00 00"></label>
              <div class="wide addr-field"><span class="addr-field-label">عنوان التوصيل <i class="req">*</i></span>
                <input type="hidden" name="address" id="checkout-address" value="${selectedAddressId ?? ""}">
                <div id="checkout-address-box">${renderCheckoutAddressBox(selectedAddressId)}</div>
              </div>
              <label><span>اليوم</span><select name="day">${dayOptions}</select></label>
              <label><span>الوقت</span><select name="time">${timeOptions}</select></label>
            </div>
            ${cartLeadHours > 0 ? `<div class="review-note">${icon("clock")} <span><strong>بعض منتجات هذا الطلب تحتاج وقت تحضير مسبق (${cartLeadHours} ساعة على الأقل).</strong><small>لهذا تم تعطيل المواعيد الأقرب من ذلك.</small></span></div>` : ""}
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
            <div class="checkout-card__title"><span>٤</span><div><h2>طريقة الدفع</h2><p>اختر طريقة الدفع المناسبة — سيراها المتجر ويجهّزها مع طلبك.</p></div></div>
            <div class="choice-grid three">
              ${(() => {
                const allMethods = [
                  { key: "cash", value: "cash", icon: "receipt", title: "نقداً عند التسليم", desc: "ادفع نقداً عند استلام الطلب" },
                  { key: "card", value: "card", icon: "wallet", title: "بالبطاقة عند التسليم", desc: "جهاز نقاط بيع (POS) مع المندوب" },
                  { key: "bank", value: "bank", icon: "shield", title: "تحويل بنكي", desc: "حوّل المبلغ إلى حساب المتجر" }
                ];
                const enabled = allMethods.filter(m => (store.paymentMethods ? store.paymentMethods[m.key] !== false : true));
                // Safety net: a store row with all 3 methods explicitly disabled (only reachable
                // via a direct DB edit, never via the merchant form's own save-guard) must never
                // leave checkout with zero payment options — fall back to showing all of them.
                const visible = enabled.length ? enabled : allMethods;
                return visible.map((m, i) => `<label class="choice-card ${i === 0 ? "active" : ""}"><input type="radio" name="payment" value="${m.value}" ${i === 0 ? "checked" : ""}><span>${icon(m.icon)}</span><div><strong>${m.title}</strong><small>${m.desc}</small></div></label>`).join("");
              })()}
            </div>
            <div id="bank-transfer-panel" class="bank-transfer-panel" hidden>
              ${store.bankDetails && store.bankDetails.trim()
                ? `<div class="bank-details-box"><div class="bank-details-box__head"><strong>${icon("shield")} بيانات حساب المتجر للتحويل</strong><button type="button" class="secondary-button compact" data-action="copy-bank" data-details="${escAttr(store.bankDetails)}">${icon("check")} نسخ</button></div><pre class="bank-details-text" dir="auto">${escAttr(store.bankDetails)}</pre><small class="field-hint">حوّل قيمة الطلب إلى الحساب أعلاه، ثم أرسل صورة إشعار التحويل للمتجر عبر واتساب لتأكيد الطلب.</small></div>`
                : `<div class="review-note">${icon("info")} <span><strong>سيرسل لك المتجر رقم الحساب للتحويل.</strong><small>أكمل الطلب وسيتواصل معك المتجر عبر واتساب بتفاصيل الحساب البنكي لإتمام التحويل.</small></span></div>`}
            </div>
          </section>
          <label class="terms-check"><input type="checkbox" name="terms" required><span></span><p>أوافق أن دكانجي منصة لتسهيل الطلبات بين العملاء والمتاجر، وأن المتجر هو البائع المباشر والمسؤول عن توفر المنتجات وجودتها وأسعارها وتجهيزها وتوصيلها، مع بقاء دكانجي جهة متابعة وتنظيم للطلب.</p></label>
        </div>
        <aside class="order-summary checkout-summary">
          <div class="summary-store">${storeAvatar(store)}<div><small>طلبك من</small><strong>${esc(store.name)}</strong></div></div>
          <div class="summary-items">${state.cart.map(item => { const product = getProduct(item.productId); return `<div><img src="${escAttr(product.image)}" alt=""><span><strong>${esc(product.name)}</strong><small>${item.quantity} × ${money(item.finalPrice)}</small></span><b>${money(item.quantity * item.finalPrice)}</b></div>`; }).join("")}</div>
          ${isFeatureOn("feature_conversion_drivers") ? couponCheckoutBlock() : ""}
          ${creditCheckoutBlock()}
          <div class="summary-prices"><span><small>المجموع الفرعي</small><strong>${money(totals.subtotal)}</strong></span>${totals.discount > 0 ? `<span class="summary-discount"><small>خصم${state.coupon ? ` (${escAttr(state.coupon.code)})` : ""}</small><strong id="checkout-discount">−${money(totals.discount)}</strong></span>` : ""}${totals.creditApplied > 0 ? `<span class="summary-discount"><small>رصيدك</small><strong id="checkout-credit">−${money(totals.creditApplied)}</strong></span>` : ""}<span><small>رسوم التوصيل</small><strong id="checkout-delivery-fee">${totals.quote?.exceedsMaxDistance ? "خارج النطاق" : (totals.freeDelivery ? "مجاني 🎉" : money(totals.delivery))}</strong></span><span class="summary-total"><small>الإجمالي</small><strong id="checkout-final-total">${money(totals.total)}</strong></span></div>
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
  // Leaving the merchant dashboard → stop the order ring/watch immediately.
  if (!/^\/merchant\b/.test(path)) stopMerchantOrderWatch();
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
  const base = "https://www.dukkanci.com.tr";
  let canonical = base + (location.pathname === "/" ? "/" : location.pathname);
  let title = "دكانجي | سوق الحي بين يديك";
  let desc = "اطلب من متاجر ومطاعم حيك في إسطنبول بسهولة — توصيل سريع من سوق الحي.";
  let image = base + "/assets/dukkanci-app-icon-512.png";
  if (route === "store" && id) {
    const s = getStore(id);
    // متجر مرفوض تُعرض صفحته كـ"غير موجودة"، فيجب ألا يتسرّب اسمه/صورته
    // إلى عنوان التبويب أو وسوم المشاركة (og/twitter) — نُبقي العنوان العام.
    if (s && s.approvalStatus !== "rejected") {
      title = `دكانجي - ${s.name}`;
      desc = s.description || desc;
      const img = s.coverImage || s.image;
      if (img) image = img.startsWith("http") ? img : base + img;
    }
  } else if (route === "product" && id) {
    const p = getProductBySlug(id);
    if (p) {
      const st = getStore(p.storeId);
      title = `${p.name} — ${st ? st.name : "دكانجي"} | دكانجي`;
      desc = p.description || `${p.name}${st ? ` من ${st.name}` : ""} على دكانجي.`;
      if (p.image) image = p.image.startsWith("http") ? p.image : base + p.image;
    }
  } else if (route === "category" && id && CATEGORY_MAP[id]) {
    title = `${CATEGORY_MAP[id]} | دكانجي`;
    desc = `تصفّح ${CATEGORY_MAP[id]} في إسطنبول على دكانجي واطلب أونلاين بتوصيل سريع.`;
  }
  // العناوين أدناه **يجب** أن تطابق حرفياً عناوين القشور الخادمية المقابلة
  // (api/stores.js, api/offers.js, api/regions.js, api/contact.js): الزاحف يقرأ
  // عنوان القشرة في التمريرة الأولى ثم عنوان JS بعد التصيير، فاختلافهما إشارة
  // متضاربة تُضعف ترشيح الصفحة كرابط فرعي (sitelink).
  else if (route === "stores") { title = "اطلب من المتاجر — كل متاجر ومطاعم حيّك في إسطنبول | دكانجي"; desc = "تصفّح كل متاجر ومطاعم دكانجي في إسطنبول: مطاعم، سوبرماركت، ملاحم، حلويات، مكسرات وبهارات — واطلب أونلاين مع توصيل من متجر حيّك."; }
  else if (route === "offers") { title = "عروض دكانجي — خصومات متاجر ومطاعم حيّك في إسطنبول"; desc = "أحدث العروض والخصومات الحقيقية من متاجر ومطاعم دكانجي في إسطنبول — أسعار قبل وبعد الخصم، محدّثة من المتاجر مباشرة."; }
  else if (route === "regions") { title = "المتاجر حسب المنطقة — مطاعم ومتاجر حيّك في إسطنبول | دكانجي"; desc = "اختر منطقتك في إسطنبول — إسنيورت، باشاك شهير، بيليك دوزو، الفاتح، أفجلار وغيرها — وتصفّح المتاجر والمطاعم العربية القريبة منك على دكانجي."; }
  else if (route === "contact") { title = "تواصل معنا | دكانجي"; desc = "تواصل مع فريق دكانجي عبر واتساب أو البريد الإلكتروني — دعم العملاء، استفسارات المتاجر، والشراكات التجارية في إسطنبول."; }
  else if (route === "join") { title = "انضم كتاجر — أنشئ متجرك | دكانجي"; desc = "أنشئ متجرك على دكانجي وابدأ باستقبال طلبات عملاء حيك في إسطنبول."; }
  else if (route === "why-dukkanci") { title = "لماذا دكانجي؟ اطلب من المتاجر العربية القريبة منك بدون عمولة على المنتجات"; desc = "تعرف على دكانجي، المنصة التي تجمع المتاجر العربية القريبة منك في مكان واحد، مع أسعار واضحة، بدون عمولة إضافية على المنتجات، وتقييمات تساعدك على الطلب بثقة."; }
  else if (route === "ask-dukkanci") { title = "اسأل دكانجي — مساعد اختيار الطلب | دكانجي"; desc = "قل لنا عدد الأشخاص وميزانيتك، ودكانجي يرتب لك اقتراح طلب متكامل من متجر حقيقي بسعر وتوصيل حقيقيين."; }
  else if (route === "dalil") {
    if (id === "compare") {
      title = "مقارنة المتاجر | دليل دكانجي";
      desc = "قارن حتى 3 متاجر جنباً إلى جنب: تقييم Google وعدد التقييمات والتوصيل والحد الأدنى للطلب — ثم اطلب مباشرة عبر دكانجي.";
      // صفحة أداة، ليست محتوى للفهرسة — الرابط القياسي يعود للدليل نفسه.
      canonical = base + "/dalil";
    } else {
      dalilStateFromUrl();
      const d = state.dalil;
      const catLabel = d.category ? CATEGORY_MAP[d.category] : "";
      const region = DALIL_REGION_LIST.find(r => r.slug === d.region) || (d.region === DALIL_FALLBACK_REGION.slug ? DALIL_FALLBACK_REGION : null);
      const regLabel = region ? region.label : "";
      if (catLabel && regLabel) title = `دليل ${catLabel} في ${regLabel} | دكانجي`;
      else if (catLabel) title = `دليل ${catLabel} في إسطنبول — الأعلى تقييماً | دكانجي`;
      else if (regLabel) title = `دليل متاجر ومطاعم ${regLabel} | دكانجي`;
      else title = "دليل دكانجي — أفضل المطاعم والمتاجر العربية في إسطنبول بتقييمات Google";
      desc = `تصفّح ${catLabel || "المطاعم والمتاجر العربية"}${regLabel ? ` في ${regLabel}` : " في إسطنبول"} بتقييمات Google الحقيقية وعدد التقييمات: فلترة بالمنطقة والتصنيف، ترتيب بالأعلى تقييماً أو الأقرب، ومقارنة حتى 3 متاجر — واطلب مباشرة عبر دكانجي.`;
      // الرابط القياسي يحمل فلتري الفهرسة فقط (تصنيف/منطقة) — البحث والفرز
      // والمفاتيح مجرد حالات عرض لنفس الصفحة.
      const qs = [d.category ? `category=${d.category}` : "", d.region ? `region=${d.region}` : ""].filter(Boolean).join("&");
      canonical = base + "/dalil" + (qs ? `?${qs}` : "");
    }
  }
  document.title = title;
  setMetaTag('meta[name="description"]', "content", desc);
  setMetaTag('link[rel="canonical"]', "href", canonical);
  // Soft-404 guard: unknown paths fall back to renderHome (and #about/#contact/#faq/
  // #terms render home too), so only mark real content routes indexable — everything
  // else gets noindex so junk URLs aren't indexed as duplicate-home soft-404s.
  // /dalil/compare (وأي مسار فرعي مجهول تحت /dalil) يبقى noindex عمداً.
  const indexableRoute = ["home", "stores", "offers", "regions", "store", "product", "category", "about", "contact", "faq", "terms", "why-dukkanci", "ask-dukkanci", "dalil"].includes(route) && !(route === "dalil" && id);
  setMetaTag('meta[name="robots"]', "content", indexableRoute ? "index,follow" : "noindex,follow");
  setMetaTag('meta[property="og:title"]', "content", title);
  setMetaTag('meta[property="og:description"]', "content", desc);
  setMetaTag('meta[property="og:image"]', "content", image);
  setMetaTag('meta[property="og:url"]', "content", canonical);
  // «دليل دكانجي»: ItemList JSON-LD حي يعكس ترتيب الدليل، ويُزال خارج القسم
  // حتى لا يلوّث بقية الصفحات.
  if (route === "dalil" && !id) setDalilJsonLd(title);
  else { const ld = document.getElementById("dalil-jsonld"); if (ld) ld.remove(); }
}

function getProductBySlug(slugOrId) {
  if (slugOrId == null) return undefined;
  const s = String(slugOrId);
  return products.find(p => p.slug === s) || products.find(p => String(p.id) === s);
}

// Standalone product page for /product/<slug> (deep links + hydration over SSR).
function renderProductPage(slugOrId) {
  const product = getProductBySlug(slugOrId);
  if (!product) {
    return `<section class="section empty-page">${renderEmpty("المنتج غير موجود", "ربما حُذف المنتج أو تغيّر رابطه.", "تصفح المتاجر", "stores")}</section>`;
  }
  const store = getStore(product.storeId);
  const storeSeg = store ? storeParam(store) : product.storeId;
  const priceLine = product.priceOnRequest || !product.price ? "السعر عند الطلب" : money(product.price);
  return `
    <section class="page-hero compact"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span>${store ? `<a href="/store/${storeSeg}" data-action="open-store" data-id="${product.storeId}">${store.name}</a><span>/</span>` : ""}<strong>${esc(product.name)}</strong></div></div></section>
    <section class="section">
      <div class="container product-page-grid">
        <div class="product-page-media ${isPlaceholderImage(product.image) ? "no-image" : ""}">${isPlaceholderImage(product.image) ? productNoImageMedia(product) : `<img src="${esc(product.image)}" alt="${esc(product.name)}" style="${product.imageFit === "contain" ? "object-fit:contain" : "object-fit:cover"}">`}</div>
        <div class="product-page-info">
          <h1>${esc(product.name)}</h1>
          ${product.category ? `<span class="cat">${esc(product.category)}</span>` : ""}
          <p>${esc(product.description || "")}</p>
          <div class="product-page-price"><strong>${priceLine}</strong></div>
          ${store ? `<p class="product-page-store">${storeAvatar(store)} من متجر <a href="/store/${storeSeg}" data-action="open-store" data-id="${product.storeId}">${store.name}</a></p>` : ""}
          <button class="primary-button large" data-action="open-product" data-id="${product.id}">${icon("bag")} أضف إلى السلة</button>
        </div>
      </div>
    </section>
  `;
}

// ═══════════════════ «دليل دكانجي» — /dalil و /dalil/compare ═══════════════════
// دليل تقييمات مبني على تقييمات Google الرسمية (أعمدة google_* في جدول stores،
// تُحدَّث عبر scripts/update-google-ratings.js — لا scraping). الترتيب عضوي
// بالكامل: «مميز» (featured) علامة عرض فقط ولا يرفع ترتيب المتجر أبداً.
// المناطق من dalil-regions.js (مُحمَّل قبل هذا الملف في index.html).
const DALIL_REGION_LIST = (typeof DALIL_REGIONS !== "undefined") ? DALIL_REGIONS : [];
const DALIL_FALLBACK_REGION = (typeof DALIL_REGION_FALLBACK !== "undefined") ? DALIL_REGION_FALLBACK : { slug: "other", label: "مناطق أخرى" };
const DALIL_SORTS = ["top", "reviews", "near"];

function dalilRegionOf(store) {
  if (!store || typeof dalilRegionFor !== "function") return DALIL_FALLBACK_REGION;
  return dalilRegionFor(store.name, store.address);
}

function dalilDefaults() {
  return { q: "", category: "", region: "", openNow: false, delivery: false, sort: "top", compare: [] };
}

// رابط الصفحة هو مصدر الحقيقة لفلاتر الدليل: كل نقرة فلتر تكتب الحالة ثم
// تزامنها للرابط (dalilSyncUrl)، وكل render يقرأ الرابط — فتبقى الروابط
// المشارَكة/محرّكات البحث والحالة الداخلية متطابقة دائماً.
function dalilStateFromUrl() {
  const p = new URLSearchParams(location.search);
  const cat = p.get("category") || "";
  const reg = p.get("region") || "";
  const sort = p.get("sort") || "";
  const prev = state.dalil || dalilDefaults();
  state.dalil = {
    q: p.get("q") || "",
    category: (typeof CATEGORY_SLUGS !== "undefined" && CATEGORY_SLUGS[cat]) ? cat : "",
    region: (DALIL_REGION_LIST.some(r => r.slug === reg) || reg === DALIL_FALLBACK_REGION.slug) ? reg : "",
    openNow: p.get("open") === "1",
    delivery: p.get("delivery") === "1",
    sort: DALIL_SORTS.includes(sort) ? sort : "top",
    compare: prev.compare || []
  };
}

function dalilSyncUrl() {
  const d = state.dalil || dalilDefaults();
  const p = new URLSearchParams();
  if (d.category) p.set("category", d.category);
  if (d.region) p.set("region", d.region);
  if (d.q) p.set("q", d.q);
  if (d.openNow) p.set("open", "1");
  if (d.delivery) p.set("delivery", "1");
  if (d.sort && d.sort !== "top") p.set("sort", d.sort);
  const qs = p.toString();
  history.replaceState({}, "", "/dalil" + (qs ? `?${qs}` : ""));
}

// الحد الأدنى لعدد تقييمات Google المؤهِّل لتصدّر «الأعلى تقييماً» — من
// site_settings.dalil.minGoogleReviewsForTop (قابل للتغيير دون نشر)، واحتياطياً 50.
function dalilMinReviews() {
  const v = Number(state.siteSettings && state.siteSettings.dalil && state.siteSettings.dalil.minGoogleReviewsForTop);
  return Number.isFinite(v) && v > 0 ? v : 50;
}

function dalilHasDelivery(store) {
  return !store.fulfillment || String(store.fulfillment).includes("توصيل");
}

function dalilDirectionsUrl(store) {
  if (store.location && store.location.lat != null) {
    const dest = `${store.location.lat},${store.location.lng}`;
    const pid = store.googlePlaceId ? `&destination_place_id=${encodeURIComponent(store.googlePlaceId)}` : "";
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}${pid}`;
  }
  if (store.googleMapsUrl) return store.googleMapsUrl;
  if (store.mapUrl) return store.mapUrl;
  return store.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}` : "";
}

// ItemList JSON-LD حي لصفحة الدليل (يُدار من updateHead: يُحدَّث داخل القسم ويُزال خارجه).
function setDalilJsonLd(pageTitle) {
  const ranked = stores.filter(isStoreApproved)
    .slice()
    .sort((a, b) => (b.googleReviewsCount || 0) - (a.googleReviewsCount || 0))
    .slice(0, 25);
  let el = document.getElementById("dalil-jsonld");
  if (!ranked.length) { if (el) el.remove(); return; }
  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle || document.title,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: ranked.length,
    itemListElement: ranked.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `https://www.dukkanci.com.tr/store/${storeParam(s)}`
    }))
  };
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "dalil-jsonld";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

function dalilGoogleRow(store) {
  if (store.googleRating == null) {
    return `<div class="dalil-google dalil-google--none">لا توجد بيانات تقييم Google لهذا المتجر بعد</div>`;
  }
  const count = Number(store.googleReviewsCount || 0);
  return `
    <div class="dalil-google">
      <span class="dalil-google__score">${icon("star")} <strong>${Number(store.googleRating).toFixed(1)}</strong></span>
      <span class="dalil-google__count">${count.toLocaleString("ar-EG")} تقييم Google</span>
      ${store.googleRatingUpdatedAt ? `<span class="dalil-google__updated">${icon("calendar")} حُدِّث ${formatOrderDateOnly(store.googleRatingUpdatedAt)}</span>` : ""}
    </div>`;
}

function dalilStoreCard(store, productHitIds) {
  const d = state.dalil || dalilDefaults();
  const region = dalilRegionOf(store);
  const inCompare = (d.compare || []).includes(store.id);
  const open = isStoreOpenNow(store);
  const directions = dalilDirectionsUrl(store);
  const km = branchDistanceKm(store);
  return `
    <article class="dalil-card${store.featured ? " dalil-card--featured" : ""}">
      <div class="dalil-card__head">
        ${storeAvatar(store)}
        <div class="dalil-card__title">
          <strong>${esc(store.name)}</strong>
          <small>${esc(store.category || "")} · ${esc(region.label)}</small>
        </div>
        ${store.featured ? `<span class="dalil-featured-badge" title="متجر مميز على دكانجي — لا يؤثر على ترتيب الدليل">مميز</span>` : ""}
        <span class="status-badge ${open ? "open" : "closed"}">${open ? "مفتوح" : "مغلق"}</span>
      </div>
      ${dalilGoogleRow(store)}
      <div class="dalil-card__meta">
        ${km != null ? `<span>${icon("pin")} ${formatDistance(km)}</span>` : ""}
        ${store.time ? `<span>${icon("clock")} ${esc(store.time)}</span>` : ""}
        <span>${icon("bike")} ${dalilHasDelivery(store) ? "توصيل متاح" : "استلام فقط"}</span>
        ${productHitIds && productHitIds.has(store.id) ? `<span class="dalil-product-hit">${icon("check")} لديه منتج مطابق لبحثك</span>` : ""}
      </div>
      <div class="dalil-card__actions">
        <a class="primary-button compact" href="/store/${storeParam(store)}">اطلب من المتجر</a>
        ${directions ? `<a class="secondary-button compact" href="${escAttr(directions)}" target="_blank" rel="noopener">${icon("map")} الاتجاهات</a>` : ""}
        <button class="secondary-button compact dalil-compare-btn${inCompare ? " active" : ""}" data-action="dalil-compare" data-id="${store.id}">${inCompare ? `${icon("check")} في المقارنة` : "+ قارن"}</button>
      </div>
    </article>`;
}

// فلترة وترتيب الدليل. لا نطوي فروع العلامة الواحدة هنا (بعكس /stores) —
// لكل فرع مكان Google مستقل بتقييمه الخاص، والدليل يعرض الأماكن لا العلامات.
function dalilFilteredStores() {
  const d = state.dalil || dalilDefaults();
  const q = normalizeAr(d.q);
  const terms = q.split(" ").filter(Boolean);
  // البحث باسم المنتج: المتاجر التي تبيع منتجاً مطابقاً تُعرض حتى لو لم يطابق اسمها.
  const productHitIds = new Set(terms.length ? getMatchingProducts(d.q, 150).map(p => p.storeId) : []);

  const list = stores.filter(store => {
    if (!isStoreApproved(store)) return false;
    if (d.category) {
      const catText = CATEGORY_MAP[d.category];
      if (!catText || !storeMatchesCategory(store, catText)) return false;
    }
    if (d.region && dalilRegionOf(store).slug !== d.region) return false;
    if (d.openNow && !isStoreOpenNow(store)) return false;
    if (d.delivery && !dalilHasDelivery(store)) return false;
    if (terms.length) {
      const hay = normalizeAr(`${store.name} ${store.category} ${store.description || ""} ${store.address || ""} ${dalilRegionOf(store).label}`);
      if (!terms.every(t => hay.includes(t)) && !productHitIds.has(store.id)) return false;
    }
    return true;
  });

  // ترتيب عضوي فقط — «مميز» لا يدخل في أي معادلة ترتيب.
  const gRating = s => (s.googleRating != null ? Number(s.googleRating) : -1);
  const gCount = s => Number(s.googleReviewsCount || 0);
  if (d.sort === "reviews") {
    list.sort((a, b) => gCount(b) - gCount(a) || gRating(b) - gRating(a));
  } else if (d.sort === "near") {
    list.sort(compareStoresByDistance);
  } else {
    // «الأعلى تقييماً»: من بلغ حد التقييمات الأدنى (dalilMinReviews) يتقدّم دائماً
    // على من لم يبلغه — فلا يتصدّر متجر بتقييم 5.0 من 3 مراجعات فقط.
    const minRev = dalilMinReviews();
    list.sort((a, b) => {
      const qualA = gCount(a) >= minRev ? 1 : 0;
      const qualB = gCount(b) >= minRev ? 1 : 0;
      if (qualA !== qualB) return qualB - qualA;
      return gRating(b) - gRating(a) || gCount(b) - gCount(a);
    });
  }
  return { list, productHitIds };
}

function dalilCompareTray() {
  const d = state.dalil || dalilDefaults();
  const chosen = (d.compare || []).map(id => getStore(id)).filter(Boolean);
  if (!chosen.length) return "";
  return `
    <div class="dalil-tray" role="region" aria-label="متاجر المقارنة">
      <div class="dalil-tray__stores">
        ${chosen.map(s => `<span class="dalil-tray__chip">${esc(s.name)}<button data-action="dalil-compare" data-id="${s.id}" aria-label="إزالة ${escAttr(s.name)} من المقارنة">${icon("close")}</button></span>`).join("")}
      </div>
      <div class="dalil-tray__actions">
        <button class="primary-button compact" data-action="dalil-compare-go" ${chosen.length < 2 ? "disabled" : ""}>قارن الآن (${chosen.length})</button>
        <button class="secondary-button compact" data-action="dalil-compare-clear">مسح</button>
      </div>
    </div>`;
}

function renderDalilPage(sub) {
  if (sub === "compare") return renderDalilComparePage();
  // مسار فرعي مجهول (/dalil/xyz): طبّع الرابط للدليل الرئيسي واعرضه.
  if (sub) history.replaceState({}, "", "/dalil");
  if (!state.dalil) dalilStateFromUrl();
  const d = state.dalil;
  const approved = stores.filter(isStoreApproved);

  // عدّادات الفلاتر تُحسب على كامل الدليل (لا تتأثر ببقية الفلاتر النشطة).
  const regionCounts = {};
  approved.forEach(s => { const r = dalilRegionOf(s); regionCounts[r.slug] = (regionCounts[r.slug] || 0) + 1; });
  const regionChips = DALIL_REGION_LIST.filter(r => regionCounts[r.slug])
    .concat(regionCounts[DALIL_FALLBACK_REGION.slug] ? [DALIL_FALLBACK_REGION] : []);
  const categoryChips = Object.entries(CATEGORY_MAP)
    .map(([slug, text]) => ({ slug, text, count: approved.filter(s => storeMatchesCategory(s, text)).length }))
    .filter(c => c.count);

  const { list, productHitIds } = dalilFilteredStores();
  const minRev = dalilMinReviews();
  const ratedCount = approved.filter(s => s.googleRating != null).length;

  return `
    <section class="page-hero compact dalil-hero">
      <div class="container">
        <span class="section-kicker">تقييمات Google الحقيقية</span>
        <h1>دليل دكانجي</h1>
        <p>كل المطاعم والمتاجر العربية في إسطنبول بتقييماتها الفعلية على Google — قارن، اختر، واطلب مباشرة.</p>
        <div class="listing-search">
          ${icon("search")}
          <input id="dalil-search" type="search" placeholder="ابحث باسم مطعم، منتج، أو منطقة..." value="${escAttr(d.q)}">
          <button type="button" class="search-clear" data-action="dalil-clear-search" aria-label="مسح البحث" title="مسح">${icon("close")}</button>
          <button data-action="dalil-run-search">بحث</button>
        </div>
      </div>
    </section>
    <section class="section listing-section dalil-section">
      <div class="container">
        <div class="dalil-pills-row">
          <span class="dalil-pills-label">${icon("pin")} المنطقة</span>
          <div class="dalil-pills">
            <button class="${!d.region ? "active" : ""}" data-action="dalil-region" data-slug="">الكل</button>
            ${regionChips.map(r => `<button class="${d.region === r.slug ? "active" : ""}" data-action="dalil-region" data-slug="${r.slug}">${esc(r.label)} <i>${regionCounts[r.slug]}</i></button>`).join("")}
          </div>
        </div>
        <div class="dalil-pills-row">
          <span class="dalil-pills-label">${icon("filter")} التصنيف</span>
          <div class="dalil-pills">
            <button class="${!d.category ? "active" : ""}" data-action="dalil-category" data-slug="">الكل</button>
            ${categoryChips.map(c => `<button class="${d.category === c.slug ? "active" : ""}" data-action="dalil-category" data-slug="${c.slug}">${esc(c.text)} <i>${c.count}</i></button>`).join("")}
          </div>
        </div>
        <div class="dalil-toolbar">
          <div class="dalil-toggles">
            <button class="dalil-toggle ${d.openNow ? "active" : ""}" data-action="dalil-toggle" data-key="openNow">${icon("clock")} مفتوح الآن</button>
            <button class="dalil-toggle ${d.delivery ? "active" : ""}" data-action="dalil-toggle" data-key="delivery">${icon("bike")} التوصيل متاح</button>
          </div>
          <label class="sort-select">
            ${icon("filter")}
            <select id="dalil-sort" aria-label="ترتيب الدليل">
              <option value="top" ${d.sort === "top" ? "selected" : ""}>الأعلى تقييماً (Google)</option>
              <option value="reviews" ${d.sort === "reviews" ? "selected" : ""}>الأكثر تقييمات Google</option>
              <option value="near" ${d.sort === "near" ? "selected" : ""}>الأقرب إليّ</option>
            </select>
          </label>
        </div>
        ${d.sort === "top" ? `<p class="dalil-note">${icon("shield")} حتى لا يتصدّر متجرٌ بعدد تقييمات قليل جداً، يتقدّم في الترتيب من لديه ${minRev} تقييم Google فأكثر.</p>` : ""}
        ${d.sort === "near" && !state.userLocation ? `<div class="dalil-locate-banner">${icon("pin")} <span>للترتيب حسب الأقرب إليك فعلياً، حدّد موقعك أولاً.</span><button class="secondary-button compact" data-action="location">تحديد موقعي</button></div>` : ""}
        <div class="result-summary"><strong>${list.length}</strong><span>${list.length === 1 ? "نتيجة" : "نتيجة"} في الدليل${ratedCount ? ` · ${ratedCount} متجراً بتقييم Google موثّق` : ""}</span></div>
        ${list.length
          ? `<div class="dalil-grid">${list.map(s => dalilStoreCard(s, productHitIds)).join("")}</div>`
          : renderEmpty("لا توجد نتائج مطابقة", "جرّب كلمة أبسط، أو أزل بعض الفلاتر.", "عرض كل الدليل", "dalil")}
        <div class="dalil-foot-links">
          <a href="/stores">تصفّح كل المتاجر</a>
          <a href="/offers">أحدث العروض</a>
          <a href="/merchants">أضف متجرك إلى الدليل</a>
        </div>
      </div>
    </section>
    ${dalilCompareTray()}
  `;
}

function renderDalilComparePage() {
  const p = new URLSearchParams(location.search);
  const ids = (p.get("ids") || "").split(",").map(Number).filter(Boolean).slice(0, 3);
  const chosen = ids.map(id => getStore(id)).filter(s => s && isStoreApproved(s));
  // مزامنة عربة المقارنة مع الرابط (الرابط قابل للمشاركة مباشرة).
  if (!state.dalil) dalilStateFromUrl();
  state.dalil.compare = chosen.map(s => s.id);

  if (chosen.length < 2) {
    return `<section class="section empty-page">${renderEmpty("اختر متجرين على الأقل للمقارنة", "عد إلى الدليل واختر حتى 3 متاجر بزر «قارن».", "العودة إلى الدليل", "dalil")}</section>`;
  }

  const rows = [
    ["تقييم Google", s => s.googleRating != null ? `<strong class="dalil-cmp-score">${icon("star")} ${Number(s.googleRating).toFixed(1)}</strong>` : "—"],
    ["عدد تقييمات Google", s => s.googleReviewsCount != null ? `${Number(s.googleReviewsCount).toLocaleString("ar-EG")} تقييم` : "—"],
    ["آخر تحديث للتقييم", s => s.googleRatingUpdatedAt ? formatOrderDateOnly(s.googleRatingUpdatedAt) : "—"],
    ["التصنيف", s => esc(s.category || "—")],
    ["المنطقة", s => esc(dalilRegionOf(s).label)],
    ["الحالة الآن", s => isStoreOpenNow(s) ? `<span class="dalil-cmp-open">مفتوح</span>` : `<span class="dalil-cmp-closed">مغلق</span>`],
    ["التوصيل", s => dalilHasDelivery(s) ? "متاح ✅" : "استلام فقط"],
    ["رسوم التوصيل", s => deliveryPriceLabel(s)],
    ["أقل قيمة للطلب", s => s.minOrder ? money(s.minOrder) : "—"],
    ["زمن التجهيز والتوصيل", s => esc(s.time || "—")]
  ];
  if (state.userLocation) {
    rows.push(["المسافة عنك", s => { const km = branchDistanceKm(s); return km != null ? formatDistance(km) : "—"; }]);
  }
  rows.push(["ساعات العمل", s => esc(s.hours || "—")]);

  return `
    <section class="page-hero compact">
      <div class="container">
        <div class="breadcrumbs"><a href="/dalil">دليل دكانجي</a><span>/</span><strong>مقارنة المتاجر</strong></div>
        <h1>مقارنة ${chosen.length === 2 ? "متجرين" : `${chosen.length} متاجر`}</h1>
        <p>مقارنة جنباً إلى جنب حسب تقييمات Google والتوصيل — «مميز» علامة عرض ولا يؤثر على المقارنة.</p>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <div class="dalil-compare-wrap">
          <table class="dalil-compare-table">
            <thead>
              <tr>
                <th class="dalil-cmp-label" aria-hidden="true"></th>
                ${chosen.map(s => `
                  <th>
                    <div class="dalil-cmp-store">
                      ${storeAvatar(s)}
                      <strong>${esc(s.name)}</strong>
                      ${s.featured ? `<span class="dalil-featured-badge">مميز</span>` : ""}
                      <div class="dalil-cmp-store__actions">
                        <a class="primary-button compact" href="/store/${storeParam(s)}">اطلب الآن</a>
                        ${dalilDirectionsUrl(s) ? `<a class="secondary-button compact" href="${escAttr(dalilDirectionsUrl(s))}" target="_blank" rel="noopener">${icon("map")} الاتجاهات</a>` : ""}
                        <button class="secondary-button compact" data-action="dalil-compare-remove" data-id="${s.id}">${icon("close")} إزالة</button>
                      </div>
                    </div>
                  </th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${rows.map(([label, cell]) => `<tr><th class="dalil-cmp-label">${label}</th>${chosen.map(s => `<td>${cell(s)}</td>`).join("")}</tr>`).join("")}
            </tbody>
          </table>
        </div>
        <div class="dalil-foot-links">
          <a href="/dalil">${icon("arrowLeft")} العودة إلى الدليل</a>
        </div>
      </div>
    </section>
  `;
}

const CATEGORY_MAP = (typeof CATEGORY_SLUGS !== "undefined") ? CATEGORY_SLUGS : {};

// ═══════════════════ «المتاجر حسب المنطقة» — /regions ═══════════════════
// محور يربط صفحات المناطق (/dalil?region=<slug>). قبل هذه الصفحة كانت الثلاث
// عشرة صفحة منطقة **يتيمة**: مرشِّح المنطقة داخل «دليل دكانجي» قائمة منسدلة لا
// روابط، فلم يكن لأي منها رابط داخلي واحد في الموقع رغم إدراجها في sitemap منذ
// 2026-07-12 — وغوغل يعتمد على الروابط الداخلية لا على sitemap وحده.
// القشرة الخادمية المقابلة: api/regions.js — أي تعديل هنا يجب أن ينعكس هناك
// (تكافؤ محتوى).
function renderRegionsPage() {
  const visible = stores.filter(s => isStoreApproved(s) && s.open !== false);
  const counts = new Map();
  visible.forEach(s => {
    const slug = dalilRegionOf(s).slug;
    counts.set(slug, (counts.get(slug) || 0) + 1);
  });
  // منطقة بلا متجر لا تُعرض: بطاقة تقود لصفحة فارغة تجربة سيئة وإشارة جودة سيئة.
  const listed = DALIL_REGION_LIST
    .map(r => ({ ...r, count: counts.get(r.slug) || 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count);
  const otherCount = counts.get(DALIL_FALLBACK_REGION.slug) || 0;

  return `
    <section class="page-hero compact"><div class="container">
      <h1>المتاجر حسب المنطقة</h1>
      <p>اختر منطقتك في إسطنبول لتصفّح المتاجر والمطاعم القريبة منك.</p>
    </div></section>
    <section class="section"><div class="container">
      ${listed.length ? `<div class="regions-grid">
        ${listed.map(r => `
          <a class="region-card" href="/dalil?region=${escAttr(r.slug)}">
            <span class="region-card__icon">${icon("pin")}</span>
            <span class="region-card__body">
              <b>${esc(r.label)}</b>
              <small>${r.count} ${r.count === 1 ? "متجر" : "متجراً"}</small>
            </span>
          </a>`).join("")}
      </div>` : renderEmpty("لم تُحمَّل المناطق بعد", "جارٍ تحميل المتاجر — أعد المحاولة بعد لحظات.", "تصفّح كل المتاجر", "stores")}
      ${otherCount ? `<p class="dalil-note">${icon("shield")} بالإضافة إلى ${otherCount} متجراً في مناطق أخرى من إسطنبول — تجدها ضمن <a href="/stores">كل المتاجر</a>.</p>` : ""}
      <div class="dalil-foot-links">
        <a href="/stores">اطلب من المتاجر</a>
        <a href="/offers">عروض دكانجي</a>
        <a href="/dalil">دليل المطاعم والمتاجر</a>
      </div>
    </div></section>`;
}

function renderStaticPage(titleAr, icon1, lines) {
  return `
    <section class="page-hero compact"><div class="container"><h1>${titleAr}</h1></div></section>
    <section class="section"><div class="container" style="max-width:720px">
      ${lines.map(l => `<p style="margin-bottom:16px;line-height:1.8">${l}</p>`).join("")}
      <a href="/" data-action="route-home" class="secondary-button" style="display:inline-flex;margin-top:24px">${icon("arrowLeft")} العودة للرئيسية</a>
    </div></section>`;
}
function renderAboutPage() {
  return renderStaticPage("من نحن", "store", [
    "دكانجي منصة متخصصة في ربط سكان إسطنبول بالمتاجر المحلية في أحيائهم.",
    "نهدف إلى تسهيل طلب المنتجات اليومية من خضار ولحوم وحلويات وسوبرماركت مع توصيل سريع.",
    "نعمل على توفير تجربة تسوق موثوقة وشفافة تدعم الاقتصاد المحلي وتخدم المجتمع العربي في تركيا."
  ]);
}
function renderContactPage() {
  const sitePhone = (state.siteSettings && state.siteSettings.contactPhone) || "";
  const siteWa = (state.siteSettings && state.siteSettings.contactWa) || sitePhone;
  return renderStaticPage("تواصل معنا", "phone", [
    "للاستفسارات العامة أو الشراكات التجارية، تواصل معنا عبر واتساب.",
    siteWa ? `<a href="https://wa.me/${siteWa.replace(/\D/g,"")}" target="_blank" rel="noopener" class="primary-button" style="display:inline-flex;gap:8px">${icon("whatsapp")} تواصل عبر واتساب</a>` : "سيتوفر رقم التواصل قريباً.",
    "بريدنا الإلكتروني: <a href='mailto:info@dukkanci.com.tr'>info@dukkanci.com.tr</a>"
  ]);
}
function renderFaqPage() {
  const faqs = [
    ["كيف أطلب من متجر؟", "اختر المتجر، أضف المنتجات للسلة، وأكمل الطلب — سيتواصل معك المتجر عبر واتساب."],
    ["ما هي مناطق التوصيل؟", "تغطي المتاجر مناطق متعددة في إسطنبول. يظهر نطاق التوصيل في صفحة كل متجر."],
    ["هل يمكنني إلغاء الطلب؟", "تواصل مع المتجر مباشرة عبر واتساب بعد تقديم الطلب لطلب الإلغاء."],
    ["كيف أضيف متجري؟", "انقر على 'انضم كتاجر' في القائمة وأكمل نموذج التسجيل."]
  ];
  return `
    <section class="page-hero compact"><div class="container"><h1>الأسئلة الشائعة</h1></div></section>
    <section class="section"><div class="container" style="max-width:720px">
      ${faqs.map(([q, a]) => `<details style="border:1px solid var(--line);border-radius:12px;padding:16px 20px;margin-bottom:12px"><summary style="font-weight:700;cursor:pointer;list-style:none">${q}</summary><p style="margin-top:12px;line-height:1.8;color:var(--muted)">${a}</p></details>`).join("")}
      <a href="/" data-action="route-home" class="secondary-button" style="display:inline-flex;margin-top:24px">${icon("arrowLeft")} العودة للرئيسية</a>
    </div></section>`;
}
function renderTermsPage() {
  return renderStaticPage("الشروط والأحكام", "shield", [
    "باستخدام تطبيق دكانجي، توافق على الشروط والأحكام التالية.",
    "الطلبات: يُعدّ الطلب ملزماً بعد تأكيده من المتجر. يتحمل العميل رسوم التوصيل المحددة لكل متجر.",
    "المنتجات: الأسعار والتوفر مسؤولية المتجر الشريك. دكانجي وسيط تقني فقط.",
    "الخصوصية: نحمي بياناتك وفق سياسة الخصوصية المعتمدة. لا نشارك بياناتك مع أطراف ثالثة دون إذنك.",
    "للاستفسار عن أي بند، تواصل معنا عبر صفحة 'تواصل معنا'."
  ]);
}

// Customer-conversion landing page for /why-dukkanci — explains the value of
// ordering through Dukkanci (clear prices, no extra commission, store ratings,
// easy ordering). Inherits the site's fonts/colors/buttons; all styling is
// scoped under .why-page in styles.css (no external libs, no new fonts).
function renderWhyDukkanciPage() {
  const trust = [
    ["check", "بدون عمولة إضافية من دكانجي على أسعار المنتجات"],
    ["bike", "رسوم التوصيل تظهر قبل تأكيد الطلب"],
    ["star", "المتاجر يتم تقييمها حسب تجربة العملاء"]
  ];
  const problems = [
    ["phone", "تنتقل بين أكثر من محل تسأل عن سعر كل صنف."],
    ["box", "تتأكد إن كان المنتج متوفراً قبل أن تطلبه."],
    ["eye", "تطلب صور المنتجات لتعرف ما الذي ستستلمه فعلاً."],
    ["clock", "تنتظر رداً قد يتأخر، وتعيد السؤال من جديد."]
  ];
  const goodList = [
    "منتجات وأسعار ظاهرة أمامك، بلا عمولة إضافية على المنتجات",
    "أكثر من متجر وفئة في مكان واحد",
    "تقييمات تساعدك على الاختيار بثقة",
    "سلة واضحة، ومتابعة عند وجود مشكلة"
  ];
  const clarityPoints = [
    ["سعر المتجر هو ما تدفعه", "دكانجي لا يضيف أي عمولة على أسعار المنتجات؛ السعر الذي تراه هو سعر المتجر."],
    ["رسوم التوصيل ظاهرة مسبقاً", "تظهر رسوم التوصيل بوضوح قبل أن تؤكد طلبك، بلا مفاجآت."],
    ["لا رسوم بعد الإرسال", "ما تراه في السلة هو المجموع النهائي — لا رسوم مفاجئة بعد تأكيد الطلب."]
  ];
  const ratingPoints = [
    ["star", "تقييم حسب تجربة العملاء", "ترتيب المتاجر يتأثر بتجارب من طلبوا فعلاً، لا بشكل عشوائي."],
    ["heart", "جودة الخدمة", "حسن التعامل والاهتمام بالعميل من أساس التقييم."],
    ["check", "دقة الطلب", "وصول ما طلبته كما هو، بدون نقص أو خطأ."],
    ["clock", "سرعة التجهيز", "تجهيز الطلب وإرساله في وقت معقول."],
    ["box", "جودة التغليف", "تغليف يحافظ على المنتجات حتى تصل إليك."],
    ["shield", "ثقة وظهور أعلى", "المتاجر الأفضل تجربةً تحصل على ثقة العملاء وظهور أوضح."]
  ];
  const steps = [
    ["حدّد منطقتك", "اختر موقعك لتظهر لك المتاجر القريبة منك."],
    ["اختر المتجر المناسب", "تصفّح المتاجر وقارن بينها وأنت مطمئن."],
    ["أضف المنتجات إلى السلة", "اختر ما تحتاجه بالكميات التي تريدها."],
    ["راجع السعر والتوصيل قبل التأكيد", "يظهر لك إجمالي الطلب ورسوم التوصيل قبل الإرسال."],
    ["استلم الطلب وقيّم التجربة", "بعد الاستلام، شارك تقييمك ليستفيد غيرك."]
  ];
  // Direct-WhatsApp vs Dukkanci — honest, non-exaggerated comparison.
  const compareRows = [
    ["المنتجات والأسعار", "تسأل عن كل صنف وسعره على حدة", "منتجات وأسعار معروضة بوضوح أمامك"],
    ["عدد المتاجر", "محادثة منفصلة مع كل متجر", "أكثر من متجر وفئة في مكان واحد"],
    ["التقييمات", "لا تعرف تجارب العملاء السابقين", "تقييمات تساعدك على الاختيار بثقة"],
    ["تنظيم التجربة", "رسائل متفرقة يصعب متابعتها", "طلب منظّم بخطوات واضحة وسلة مرتّبة"],
    ["عند وجود مشكلة", "تتابع وحدك مع المتجر", "دكانجي يساعد في متابعة المشاكل الواضحة حسب الحالة"]
  ];
  const faqs = [
    ["هل دكانجي يزيد سعر المنتجات؟", "لا. دكانجي لا يضيف عمولة على أسعار المنتجات؛ السعر الذي تراه هو سعر المتجر. أما رسوم التوصيل فتظهر بوضوح قبل تأكيد الطلب."],
    ["هل المتاجر على دكانجي موثوقة؟", "المتاجر يتم تقييمها حسب تجربة العملاء، وتجارب الطلبات السابقة تساعدك على الاختيار. كما يساعد دكانجي في متابعة المشاكل الواضحة مع المتجر حسب الحالة."],
    ["ماذا يحدث إذا لم يتوفر منتج؟", "إذا تبيّن أن منتجاً غير متوفر، يتواصل معك المتجر عبر واتساب لإيجاد بديل مناسب أو تعديل الطلب قبل تجهيزه."],
    ["هل أستطيع الطلب من أكثر من فئة؟", "نعم، يجمع دكانجي مطاعم وسوبرماركت وملاحم وحلويات وقهوة ومكسرات ومتاجر يومية، فتتصفح الفئات التي تناسبك في مكان واحد."],
    ["لماذا أستخدم دكانجي بدل واتساب؟", "لأن دكانجي يعرض المنتجات والأسعار بوضوح، يجمع أكثر من متجر في مكان واحد، يضيف تقييمات تساعدك على الاختيار، وينظّم تجربة الطلب من السلة حتى الاستلام."]
  ];
  const cats = homeCategoriesOrdered();
  return `
    <div class="why-page">
      <!-- 1) Hero -->
      <section class="why-hero">
        <div class="container why-hero__grid">
          <div class="why-hero__content">
            <span class="eyebrow"><span></span> لماذا دكانجي؟</span>
            <h1>خُذ حاجتك من متجر حيّك، <em class="why-mark">بسعرٍ واضح</em> وبلا عمولة</h1>
            <p>دكانجي يجمع لك المطاعم، السوبرماركت، الملاحم، الحلويات، والمتاجر العربية في مكان واحد، لتطلب بسهولة، وتعرف السعر ورسوم التوصيل قبل أن تؤكد.</p>
            <div class="why-hero__actions">
              <a class="primary-button large" href="/stores" data-route="stores">${icon("bag")} ابدأ الطلب الآن</a>
              <a class="secondary-button large" href="/stores" data-route="stores">${icon("store")} شاهد المتاجر القريبة منك</a>
            </div>
            <ul class="why-trust">
              ${trust.map(([ic, t]) => `<li>${icon(ic)} <span>${t}</span></li>`).join("")}
            </ul>
          </div>
          <!-- Illustrative order-summary card (example numbers, clearly labeled): reinforces price clarity -->
          <div class="why-hero__visual">
            <div class="why-mock why-mock--receipt">
              <span class="why-mock__badge">${icon("check")} السعر الذي تراه = سعر المتجر</span>
              <div class="why-mock__head">
                <span class="why-mock__avatar">${icon("store")}</span>
                <div><strong>متجر حيّك</strong><small>مثال توضيحي لملخّص الطلب</small></div>
              </div>
              <div class="why-mock__rows">
                <div class="why-mock__row"><span>سعر المنتجات</span><b>248٫00 ₺</b></div>
                <div class="why-mock__row"><span>رسوم التوصيل <i>(ظاهرة مسبقاً)</i></span><b>15٫00 ₺</b></div>
                <div class="why-mock__row why-mock__row--zero"><span>${icon("check")} عمولة دكانجي على المنتجات</span><b>صِفر</b></div>
              </div>
              <div class="why-mock__total"><span>المجموع قبل التأكيد</span><strong>263٫00 ₺</strong></div>
              <p class="why-mock__foot">لا رسوم مفاجئة بعد الإرسال — تراجع السلة وتؤكّد وأنت مطمئن.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 2) Category strip (static — swipe/scroll only, no auto-motion) -->
      <nav class="why-catstrip" aria-label="فئات دكانجي">
        <div class="container why-catstrip__row">
          ${cats.map(c => `<button class="why-catstrip__pill" data-action="category" data-category="${escAttr(c.name)}">${esc(c.name)}</button>`).join("")}
        </div>
      </nav>

      <!-- 3) Problem vs Solution -->
      <section class="section why-block">
        <div class="container">
          <div class="section-heading centered"><div><span class="section-kicker">المشكلة</span><h2>تعبت من فوضى الطلب على واتساب؟</h2></div></div>
          <p class="why-lead">السؤال عن الأسعار، انتظار الردود، صور ناقصة، ولا سجلّ لطلبك. دكانجي يختصر الفوضى ويجمع متاجر حيّك في مكان واحد منظّم.</p>
          <div class="why-vs">
            <div class="why-vs__card why-vs__card--bad">
              <span class="why-vs__tag">الطريقة القديمة</span>
              <h3>على واتساب مباشرة</h3>
              <ul>${problems.map(([ic, d]) => `<li>${icon(ic)} <span>${d}</span></li>`).join("")}</ul>
            </div>
            <div class="why-vs__mid" aria-hidden="true">${icon("arrowLeft")}</div>
            <div class="why-vs__card why-vs__card--good">
              <span class="why-vs__tag">مع دكانجي</span>
              <h3>تجربة منظّمة</h3>
              <ul>${goodList.map(t => `<li>${icon("check")} <span>${t}</span></li>`).join("")}</ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 4) Pricing clarity -->
      <section class="section why-clarity">
        <div class="container why-clarity__grid">
          <div class="why-clarity__copy">
            <span class="eyebrow">وضوح الأسعار</span>
            <h2>الأسعار واضحة… <em class="why-mark">بلا عمولة</em> من دكانجي على المنتجات</h2>
            <div class="why-clarity__list">
              ${clarityPoints.map(([t, d], i) => `<div class="why-clarity__item"><span class="why-clarity__num">${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></div>`).join("")}
            </div>
          </div>
          <div class="why-zero" aria-hidden="true">
            <span class="why-zero__num">٠</span>
            <strong>عمولة دكانجي على أسعار المنتجات</strong>
            <p>السعر الذي تراه أمام المنتج هو سعر المتجر نفسه — بلا أي إضافة.</p>
          </div>
        </div>
      </section>

      <!-- 5) Store ratings -->
      <section class="section why-block why-block--soft">
        <div class="container">
          <div class="section-heading centered"><div><span class="section-kicker">ثقة بالمتاجر</span><h2>المتاجر لا تظهر عشوائياً… التجربة يتم تقييمها</h2></div></div>
          <div class="why-grid why-grid--3">
            ${ratingPoints.map(([ic, t, d]) => `<article class="why-card"><span class="why-card__icon">${icon(ic)}</span><strong>${t}</strong><p>${d}</p></article>`).join("")}
          </div>
        </div>
      </section>

      <!-- 6) How it works -->
      <section class="section why-block">
        <div class="container">
          <div class="section-heading centered"><div><span class="section-kicker">خطوة بخطوة</span><h2>كيف يعمل دكانجي؟</h2></div></div>
          <ol class="why-steps">
            ${steps.map(([t, d], i) => `<li class="why-step"><span class="why-step__num">${i + 1}</span><div><strong>${t}</strong><p>${d}</p></div></li>`).join("")}
          </ol>
        </div>
      </section>

      <!-- 7) First order without worry -->
      <section class="section why-block why-block--soft">
        <div class="container">
          <div class="why-firstorder">
            <span class="why-firstorder__icon">${icon("shield")}</span>
            <div>
              <h2>أول طلب؟ جرّب بدون قلق</h2>
              <p>قبل أن تؤكد، ترى المتجر، والسعر، وتفاصيل الطلب، ورسوم التوصيل بشكل واضح. وإذا حدثت مشكلة واضحة مع المتجر، يساعد دكانجي في متابعتها حسب الحالة — لتطلب أول مرة وأنت مطمئن.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 8) Dukkanci vs direct WhatsApp -->
      <section class="section why-block">
        <div class="container">
          <div class="section-heading centered"><div><span class="section-kicker">مقارنة</span><h2>لماذا أطلب عبر دكانجي بدل التواصل المباشر مع المتجر؟</h2></div></div>
          <div class="why-compare" role="table" aria-label="مقارنة بين الطلب المباشر عبر واتساب والطلب عبر دكانجي">
            <div class="why-compare__head" role="row">
              <span role="columnheader"></span>
              <span role="columnheader">${icon("whatsapp")} الطلب المباشر عبر واتساب</span>
              <span role="columnheader" class="is-dukkanci">${icon("bag")} الطلب عبر دكانجي</span>
            </div>
            ${compareRows.map(([label, wa, dk]) => `
              <div class="why-compare__row" role="row">
                <span class="why-compare__label" role="cell">${label}</span>
                <span class="why-compare__wa" role="cell">${wa}</span>
                <span class="why-compare__dk" role="cell">${icon("check")} ${dk}</span>
              </div>`).join("")}
          </div>
        </div>
      </section>

      <!-- 9) Categories (real, clickable) -->
      <section class="section why-block why-block--soft">
        <div class="container">
          <div class="section-heading centered"><div><span class="section-kicker">سوق متكامل</span><h2>كل ما يحتاجه حيّك في مكان واحد</h2></div></div>
          <div class="category-grid why-categories">
            ${cats.map(c => categoryCard(c.name, c.image, c.caption)).join("")}
          </div>
        </div>
      </section>

      <!-- 10) FAQ -->
      <section class="section why-block">
        <div class="container why-faq">
          <div class="section-heading centered"><div><span class="section-kicker">أسئلة شائعة</span><h2>أسئلة قبل أول طلب</h2></div></div>
          ${faqs.map(([q, a], i) => `<details class="why-faq__item"${i === 0 ? " open" : ""}><summary><span>${q}</span></summary><p>${a}</p></details>`).join("")}
        </div>
      </section>

      <!-- 11) Final CTA -->
      <section class="section why-cta">
        <div class="container">
          <h2>جرّب دكانجي اليوم… وخلّي طلباتك اليومية أسهل</h2>
          <p>المتاجر القريبة منك بانتظارك، بسعر واضح وتجربة منظّمة.</p>
          <div class="why-cta__actions">
            <a class="primary-button large" href="/stores" data-route="stores">${icon("bag")} ابدأ الطلب الآن</a>
            <a class="secondary-button large" href="/stores" data-route="stores">${icon("store")} استعرض المتاجر</a>
          </div>
          <a class="why-cta__wa" href="https://wa.me/${SUPPORT_WA}?text=${encodeURIComponent("مرحباً، عندي سؤال عن دكانجي")}" target="_blank" rel="noopener">${icon("whatsapp")} أو تواصل معنا مباشرة عبر واتساب</a>
        </div>
      </section>
    </div>
  `;
}

// ═══════════════════════ «اسأل دكانجي» — smart order-bundle assistant ═══════════════════════
// Route: /ask-dukkanci. Builds a ready-to-order bundle (main + optional dessert/drink) from
// عدد الأشخاص + الميزانية + وصف حر، using ONLY the real, already-loaded `products`/`stores`
// catalog (applyPublishingRules already dropped unavailable/hidden/duplicate items) — never
// invented products or prices. Every bundle stays inside a SINGLE store so "أضف إلى السلة"
// can call the real addToCart() as-is, honoring the platform's one-store-per-cart rule instead
// of working around it.

// Deliberately spans several catalog categories, not just restaurant meals — the engine
// searches product name/category across every store type (supermarkets, sweets shops,
// butchers...), so the prompts should make that obvious instead of implying "meals only".
const ASK_DUKKANCI_QUICK_PROMPTS = [
  "عندي عزومة 10 أشخاص وبدي غداء اقتصادي مع حلويات",
  "تسالي ومقرمشات للسهرة لـ 5 أشخاص",
  "حلويات لعزومة خطوبة لـ 50 شخص",
  "مشروبات وعصائر لحفلة لـ 20 شخص",
  "لحوم ومشاوي لـ 12 شخص",
  "خضار وفواكه طازجة للبيت"
];

const ASK_DUKKANCI_DESSERT_KEYWORDS = ["حلويات", "حلوى", "كنافة", "بقلاوة", "كيك", "قطايف", "مهلبية"];
const ASK_DUKKANCI_DRINK_KEYWORDS = ["مشروبات", "عصير", "مشروب", "كولا", "ماء", "شاي", "قهوة"];
// Explicit "I want a MEAL" words. When one of these appears in the raw message alongside a
// specialty word (e.g. "غداء اقتصادي مع حلويات"), the request is compound — a main dish PLUS an
// add-on — not a pure specialty ask. Checked directly against the message text (not the
// AI/local keyword bag) so this guard holds even if the AI misreads the compound request as
// pure-dessert, matching the deterministic "AI can only degrade quality, never correctness"
// contract the rest of this feature relies on.
const ASK_DUKKANCI_MEAL_KEYWORDS = ["غداء", "غدا", "عشاء", "عشا", "فطور", "وجبة", "وجبه", "اكل", "طعام", "اكله", "غدائي", "عشائي"];

// Every store this feature may recommend from: approved + open right now + accepting orders
// (subscription active) — the exact same gates the rest of the storefront already enforces.
function askDukkanciEligibleStore(store) {
  return !!store && isStoreApproved(store) && isStoreOpenNow(store) && store.subscriptionActive !== false;
}

// Filler words AND event/occasion nouns ("سهرة", "خطوبة", "حفلة"...) — the occasion describes
// *why* someone is ordering, not *what* to order, so treating them as product keywords only
// pulls in noise (a product merely named/categorized after the occasion word).
const ASK_DUKKANCI_STOPWORDS = new Set([
  "بدي", "بدنا", "اريد", "نريد", "اطلب", "اطلع", "حاب", "حابه", "حابين", "عندي", "عايز", "عايزه",
  "لـ", "ل", "من", "في", "على", "مع", "الي", "الى", "عن", "هو", "هي", "هذا", "هذه", "ذلك", "تلك",
  "شخص", "اشخاص", "ناس", "اناس", "ضيف", "ضيوف", "وجبه", "غداء", "عشاء", "فطور", "فطار",
  "طلب", "اقتراح", "اقترح", "افضل", "احسن", "ميزانيه", "معقوله", "اقتصادي", "اقتصاديه",
  "عزومه", "جماعي", "جماعيه", "عائلي", "عائليه", "كام", "كم", "بميزانيه", "ضمن", "حوالي", "تقريبا",
  "منتج", "منتجات", "موجود", "موجوده", "اطلاقا", "شي", "شيء", "حاجه", "ابغى", "ابي", "بس", "فقط", "او", "ايضا",
  "سهره", "حفله", "مناسبه", "خطوبه", "تجمع", "زواج", "فرح", "ميلاد", "مولود", "بيت", "منزل", "اسبوعيه", "شهريه",
  // Vague filler adjectives ("بدي شي طيب" = "I want something nice") carry zero product-specific
  // signal on their own, and being short (3 letters) they're prone to false-positive substring
  // matches inside unrelated product names (e.g. "طيب" inside "للترطيب" = "for moisturizing", a
  // shampoo). Real food-type words like "حلو"/"مالح" stay unfiltered — only the emptiest fillers.
  "طيب", "طيبه", "زاكي", "زاكيه",
  // "عزيمه" is a dialectal spelling variant of the already-stopworded "عزومه" (both = gathering/
  // invitation) — normalizeAr doesn't unify them. "ضعيف/ضعيفه" describes the BUDGET ("ميزانية
  // ضعيفة" = tight budget), not a food trait, so it must never itself become a match keyword.
  // "يكون"/"اكل" are pure filler ("الاكل يكون دجاج" = "the food should be chicken"). Most
  // dangerous: "خيار" here means "choice/option" ("افضل خيار" = best choice) — but it is ALSO
  // the literal word for "cucumber", a genuinely common product-name word, so leaving it
  // unfiltered pulled pickled-cucumber products into completely unrelated requests.
  "عزيمه", "ضعيف", "ضعيفه", "يكون", "اكل", "خيار",
  // The clarifying-question flow rolls EVERY user reply into request.message (see
  // submitAskDukkanciChatReply) so local matching reflects the full conversation, not just a
  // possibly-vague opener — but that means a reply ANSWERING one of the assistant's own meta
  // questions (ready-to-eat vs. prepare-yourself, appetite level, single dish vs. variety) gets
  // parsed for keywords too. None of this vocabulary describes a dish — left unfiltered, "تنويع
  // بين عدة أصناف" (variety across several dishes) contributed the keyword "اصناف", which matched
  // a completely unrelated store's generic "الأصناف" ("Items") category label.
  "تنويع", "بين", "عدة", "عده", "اصناف", "جاهز", "جاهزه", "مباشرة", "مباشره", "تحضير", "بنفسه", "بنفسي",
  // "انا" (I/me) is a bare personal pronoun that can show up in any free-text reply ("وأنا شخص
  // أكول" = "and I'm a big eater") — it never describes food, so it must never survive as a
  // match keyword regardless of which question it happens to answer.
  "انا"
]);

// Real words that happen to start with a letter that's ALSO a common proclitic (و/ل/ب/ك) but
// are NOT "proclitic + root" — "لحوم" (meats) is not "ل" (for/to) + "حوم" (not a real word).
// Stripping them produced meaningless fragments that could coincidentally collide with unrelated
// products elsewhere in the catalog. Checked before any proclitic stripping so these always
// survive whole.
const ASK_DUKKANCI_NEVER_STRIP = new Set(["لحوم", "لحمة", "لحم", "لبن", "كباب", "كبدة", "بيض", "بطاطا", "كفتة"]);

// Arabic proclitics (و=and, ل=for/to, ب=with/by, ك=as/like, ال=the) glue onto the next word with
// no space ("ومقبلات"، "لعزومة", "بميزانية", "الميزانية") — strip a leading one before the
// stopword/keyword check so e.g. "لعزومة"/"الميزانية" resolve to the already-stopworded
// "عزومة"/"ميزانية" instead of surviving as noise (the definite article alone let a whole class
// of stopworded nouns back in whenever the visitor phrased them with "ال").
function askDukkanciKeywords(message) {
  const words = normalizeAr(message)
    .split(" ")
    // Trailing/leading punctuation ("مباشرة،", "شخص.") survives the space split and then fails
    // every stopword Set.has() lookup verbatim, since nothing else in this pipeline strips it
    // before the comparison — strip it here so punctuation never masks a real stopword match.
    .map(w => w.replace(/^[،,.!؟?؛;:"'ـ]+|[،,.!؟?؛;:"'ـ]+$/g, ""))
    .filter(Boolean);
  const out = new Set();
  for (let w of words) {
    if (/^\d+$/.test(w) || w.length < 2) continue;
    // Proclitics stack ("والميزانية" = و + الميزانية = "and the budget") — strip the single-
    // letter one first, THEN check again for a now-exposed "ال", instead of only ever stripping
    // one or the other (an else-if here silently left "الميزانية" glued onto "و"). Skipped
    // entirely for ASK_DUKKANCI_NEVER_STRIP words (real words that only LOOK like proclitic+root).
    if (!ASK_DUKKANCI_NEVER_STRIP.has(w)) {
      // "لل" is لـ (for) + ال (the) merged in writing — the alif of "ال" drops when preceded by
      // ل, so "لـ + الأكل" ("for the food") is written "للأكل", not "لالأكل". The generic
      // single-letter strip below can't see this (it only removes one ل, leaving "لأكل" still
      // glued together), so this pair is special-cased and checked first.
      if (/^لل/.test(w) && w.length > 4 && !ASK_DUKKANCI_STOPWORDS.has(w)) {
        w = w.slice(2);
      } else {
        if (/^[ولبك]/.test(w) && w.length > 3 && !ASK_DUKKANCI_STOPWORDS.has(w)) w = w.slice(1);
        if (/^ال/.test(w) && w.length > 4 && !ASK_DUKKANCI_STOPWORDS.has(w)) w = w.slice(2);
      }
    }
    if (w.length >= 2 && !ASK_DUKKANCI_STOPWORDS.has(w)) out.add(w);
  }
  return [...out];
}

// A request for "حلويات"/"مشاوي"/etc. means the finished, ready-to-eat item by default — not
// the raw supplies/tools for MAKING or SERVING one (باقي فستق "مستلزمات الحلويات" = sugar/
// cream/flavoring, not an actual pastry; "أدوات شواء" = grill tongs, not a grilled dish). This
// is a general pattern, not dessert-specific, so it's checked generically for every request:
// a supply-category or "خاص بـ/خاصة بـ" ("dedicated FOR [making] X") product only surfaces when
// the visitor's OWN words explicitly ask for supplies/ingredients/tools.
const ASK_DUKKANCI_SUPPLY_MARKERS = ["مستلزمات", "مكونات", "خامات", "لوازم", "ادوات", "قوالب"];
function askDukkanciIsSupplyItem(normName, normCat) {
  if (ASK_DUKKANCI_SUPPLY_MARKERS.some(m => normCat.includes(m))) return true;
  return /خاص\s?ب|خاصه\s?ب/.test(normName);
}

// Same finished-good-vs-raw-ingredient trap, for meat specifically: a "ملحمة" (butcher) sells
// RAW cuts by weight for the customer to cook at home — not a dish ready to serve at a
// gathering. Nothing marks these as "مستلزمات" (they ARE the butcher's real, sellable product),
// so askDukkanciIsSupplyItem never catches them; without this, a request like "عزومة ... لحم"
// could surface raw "لحم غنم" from a butcher as if it were food ready to serve guests. A
// COOKED marker on the same product (e.g. "لحم مشوي", "وجبة مشاوي مشكل") means it's an actual
// prepared dish (typically a restaurant's grill), so that's never excluded. Deliberately NOT
// "مشاوي" alone — a butcher labels raw cuts "للمشاوي" ("for the grill", i.e. meant to be grilled
// at home) using that exact word, which would have wrongly counted as already-cooked; "مشوي"
// (grilled — past participle, actually describes the item's current state) stays.
const ASK_DUKKANCI_RAW_MEAT_MARKERS = ["لحم", "لحوم", "لحمة", "دواجن", "ذبائح", "ملحمة", "دجاج", "دجاجة"];
const ASK_DUKKANCI_COOKED_MARKERS = ["مشوي", "مطبوخ", "جاهز", "مقلي", "طبق", "وجبة", "مشكل", "مقدد", "مدخن"];
function askDukkanciIsRawMeat(normName, normCat) {
  const text = normName + " " + normCat;
  if (!ASK_DUKKANCI_RAW_MEAT_MARKERS.some(m => text.includes(m))) return false;
  return !ASK_DUKKANCI_COOKED_MARKERS.some(m => text.includes(m));
}

// Same finished-good-vs-raw-ingredient trap, one more time, for nuts specifically: a market
// category literally named "المكسرات النيئة" (raw nuts) sells UNROASTED nuts by weight meant for
// the customer to roast/bake with — not a ready-to-eat snack. In Arabic dialect "تسالي" (nibbles)
// commonly implies nuts/seeds, so without this a request for evening snacks surfaced raw baking
// almonds/cashews as if they were a snack mix. On this platform "نيء/نيئة" only ever appears on
// this exact raw-nuts category (verified against the live catalog), so no cooked-marker override
// is needed the way meat needs one — there's no "roasted" spelling that would collide.
const ASK_DUKKANCI_RAW_NUT_MARKERS = ["نيء", "نيئه", "نيئة", "خام"];
function askDukkanciIsRawNuts(normName, normCat) {
  const text = normName + " " + normCat;
  return ASK_DUKKANCI_RAW_NUT_MARKERS.some(m => text.includes(m));
}

// Short keywords (≤3 chars — very common in Arabic: "رز"=rice, "لحم"... ) are prone to
// false-positive substring matches inside a completely unrelated LONGER word — "رز" (rice)
// matched inside "كرز" (cherry), silently pulling cherry jam/candy into a chicken-and-rice
// request. A plain .includes() can't tell "رز" the standalone word from "رز" the tail of
// "كرز" — so short keywords require a real word boundary (start/end of string or a space)
// on both sides; longer keywords keep substring matching (often deliberately catches
// compounds, e.g. "مشاوي" inside "للمشاوي").
function askDukkanciTextHasKeyword(text, kw) {
  if (!kw) return false;
  if (kw.length > 3) return text.includes(kw);
  return new RegExp(`(^|\\s)${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\s|$)`).test(text);
}

// Scores one product against a keyword set: a NAME (or dialect-synonym) match is a much
// stronger relevance signal than a CATEGORY match; `weight` lets a secondary signal (the
// dessert/drink toggles) nudge results without overwhelming the primary description.
function askDukkanciScoreProduct(normName, normCat, syn, keywords, weight) {
  let score = 0;
  for (const kw of keywords) {
    if (askDukkanciTextHasKeyword(normName, kw) || (syn && askDukkanciTextHasKeyword(syn, kw))) score += 3 * weight;
    else if (askDukkanciTextHasKeyword(normCat, kw)) score += weight;
  }
  return score;
}

// Ranks the ENTIRE available catalog against the visitor's description in one pass — not scoped
// to restaurant meals; matches supermarket/butcher/sweets-shop products just as readily. This
// only looks at the PRODUCT's own name/category, never the store name — an earlier version
// reused getMatchingProducts (name+category+STORE NAME), which meant a plain coffee product
// matched a "حلويات" search purely because it's sold by a store literally named "حلويات
// السلطان", not because the product itself was a dessert.
//
// Tracks primaryScore (matches the visitor's own description) separately from totalScore
// (+ the low-weight dessert/drink toggle keywords). A pure dessert shop must never anchor a
// "بدي مشاوي" request just because its total happens to land near the budget — so store
// ELIGIBILITY is decided by primaryScore only (see askDukkanciBuildOptions), while totalScore
// is used to pick which of that store's own items fill out the basket, letting the toggles
// promote a matching dessert/drink item without being able to smuggle in an unrelated store.
// `intent` is the OPTIONAL result of a server-side AI parse (see submitAskDukkanci /
// api/ask-dukkanci.js) — a pure classification of the free-text description into keywords /
// wantsSupplies / preferredCategories. The AI never sees the catalog and never returns a
// product, price, or store, so a bad or missing intent only ever degrades matching QUALITY,
// never correctness: with no intent (AI unavailable/timed out) this falls back to exactly the
// same local keyword heuristic that ran before the AI integration existed.
function askDukkanciScoredCandidates(request, intent) {
  const localPrimary = askDukkanciKeywords(request.message || "");
  const aiKeywords = (intent && Array.isArray(intent.keywords)) ? intent.keywords.map(normalizeAr).filter(Boolean) : [];
  // Trust the AI's keywords EXCLUSIVELY when it produced any — no union with local extraction.
  // request.message is every USER reply in the conversation joined together (see
  // submitAskDukkanciChatReply), including short answers to the assistant's own meta-questions
  // ("تنويع بين عدة أنواع" / "جاهز مباشرة"), which describe a PREFERENCE, not a product. A union
  // meant any generic word from those replies ("أنواع", "أصناف", ...) could substring-match a
  // totally unrelated product/category — this surfaced actual incense and laundry detergent for
  // a snacks request purely because their names contain "أنواع". Patching each new generic word
  // into a stopword list is whack-a-mole (the assistant's question phrasing varies turn to turn);
  // the AI's own `keywords` field is already the full, clean understanding of the WHOLE
  // conversation (it sees the same history), so once it exists it should just win outright. Local
  // extraction stays as the fallback ONLY when the AI produced nothing at all (gateway down/timed
  // out) — the one case the "safety net" comment above originally meant.
  const primary = aiKeywords.length ? aiKeywords : localPrimary;
  const aiSecondaryKeywords = (intent && Array.isArray(intent.secondaryKeywords)) ? intent.secondaryKeywords.map(normalizeAr).filter(Boolean) : [];
  const secondary = [
    ...(request.includeDessert ? ASK_DUKKANCI_DESSERT_KEYWORDS : []),
    ...(request.includeDrinks ? ASK_DUKKANCI_DRINK_KEYWORDS : []),
    ...aiSecondaryKeywords
  ].map(normalizeAr);
  // The AI's explicit classification wins when present (it understands "مستلزمات حلويات" vs
  // "حلويات جاهزة" far better than a fixed keyword list); otherwise fall back to the local
  // heuristic — only skip supply/ingredient items when the visitor didn't ask for them directly.
  const wantsSupplies = (intent && typeof intent.wantsSupplies === "boolean")
    ? intent.wantsSupplies
    : primary.some(kw => ASK_DUKKANCI_SUPPLY_MARKERS.includes(kw));

  const pool = products.filter(p => p.available !== false && !p.priceOnRequest && Number(p.price) > 0);
  if (!primary.length && !secondary.length) return { hasPrimary: false, primary, wantsSupplies, items: pool.map(p => ({ product: p, primaryScore: 0, totalScore: 0 })) };

  const scored = [];
  for (const p of pool) {
    const normName = normalizeAr(p.name);
    const normCat = normalizeAr(p.category || "");
    if (!wantsSupplies && (askDukkanciIsSupplyItem(normName, normCat) || askDukkanciIsRawMeat(normName, normCat) || askDukkanciIsRawNuts(normName, normCat))) continue;
    const syn = productSynonymIndex.get(p.id) || "";
    const primaryScore = askDukkanciScoreProduct(normName, normCat, syn, primary, 1);
    const totalScore = primaryScore + askDukkanciScoreProduct(normName, normCat, syn, secondary, 0.3);
    if (totalScore > 0) scored.push({ product: p, primaryScore, totalScore });
  }
  scored.sort((a, b) => primary.length ? (b.primaryScore - a.primaryScore) || (b.totalScore - a.totalScore) : b.totalScore - a.totalScore);
  return { hasPrimary: primary.length > 0, primary, wantsSupplies, items: scored };
}

// How many distinct items to gather from the chosen store into one basket. A larger gathering
// reads as an assortment (a few kinds of سناكس/حلويات), not one dish repeated — capped modestly
// so totals stay legible and don't balloon into an unreadable list.
function askDukkanciBasketSize(partySize) {
  if (partySize <= 4) return 3;
  if (partySize <= 15) return 4;
  return 5;
}

function askDukkanciBasketMatchesAny(items, keywords) {
  const nk = keywords.map(normalizeAr);
  return items.some(it => {
    const n = normalizeAr(it.product.name), c = normalizeAr(it.product.category || "");
    return nk.some(kw => n.includes(kw) || c.includes(kw));
  });
}

// A product explicitly sold as one "- وجبة" (meal/portion) is bought ONE per person, full stop
// — not shared or tapered by basket size. Without this, a 350 ل.ت single-serving meal cleared
// the same "price ≥ 250 → sizable, divide by 10" threshold meant for family-size dishes, so 8
// people could get quantity=1 of a meal built for one.
function askDukkanciIsSinglePortionMeal(product) {
  const unit = normalizeAr(product.unit || "");
  const name = normalizeAr(product.name || "");
  return /^\s*وجبه\s*$/.test(unit) || /-\s*وجبه\s*$/.test(name) || /^\s*وجبه\s+/.test(name);
}

// No "serves N people" field exists on real products, so quantity is an estimate — and a basket
// now holds several items at once, so each one's SHARE of the party shrinks with basket size
// (a gentle sqrt taper, not a hard divide, so a 3-item basket doesn't crash to a third each).
// `appetiteMultiplier` (default 1) scales the human estimate up/down when the visitor described
// themselves as a big eater vs a light one. Always shown to the visitor as an estimate they can
// adjust from the store page — never presented as an exact fact.
//
// A merely-expensive item is NOT reliable evidence it already feeds a crowd: real menu prices in
// this catalog for a completely ordinary INDIVIDUAL plate (a single "شاورما عربي" plate, a single
// "دجاج مشوي مع رز") routinely land in the 250-700 ل.ت range — a "price ≥ 250 → one unit already
// covers ~10 people" rule (the previous behavior) let a single 280 ل.ت shawarma plate get ordered
// as the ENTIRE order for a 10-person party. Only an EXPLICITLY bulky name (صينية/مشكل/بوفيه/طبق
// كبير) or a genuinely extreme price (≥800 ل.ت — a name-only check missed real tray-format items
// like "آسيه" at 1260 ل.ت) is trusted as "one unit feeds many"; everything else defaults to the
// individual-serving estimate regardless of price, which is the safer failure mode (a few extra
// plates ordered beats a table of ten sharing one sandwich).
function askDukkanciQuantity(product, partySize, basketSize, appetiteMultiplier) {
  const people = Math.max(1, Number(partySize) || 1);
  const mult = Number(appetiteMultiplier) || 1;
  const unit = normalizeAr(product.unit || "");
  const name = normalizeAr(product.name || "");
  const price = Number(product.price) || 0;
  const looksBulky = /صينيه|مشكل|بوفيه|طبق كبير|صحن كبير/.test(unit + " " + name);

  if (askDukkanciIsSinglePortionMeal(product) && !looksBulky) return Math.max(1, Math.round(people * mult));

  const share = (people / Math.max(1, Math.sqrt(basketSize || 1))) * mult;
  if (looksBulky || price >= 800) return Math.max(1, Math.ceil(share / 10));                     // genuinely a shared tray/platter
  if (/كيلو|كغ|kg/i.test(unit)) return Math.max(1, Math.ceil(share * 0.15));                      // weighed, modest per-person share
  return Math.max(1, Math.ceil(share / 2));                                                       // individual dish/piece, regardless of price
}

// Strips serving-size/portion qualifiers ("نصف دجاج مشوي مع رز مندي" and "دجاج مشوي مع رز
// مندي" and "... - كيلو" are the SAME dish at different sizes) so near-duplicate size variants
// of one dish can be collapsed to a single representative pick — a restaurant menu routinely
// lists half/whole/kilo/meal-box versions of the exact same item as separate SKUs.
function askDukkanciDishBaseName(name) {
  // JS regex \b is defined for ASCII word chars only — it never matches a real boundary inside
  // Arabic text, so a \b-based pattern here would silently match nothing at all. Match "نصف"/
  // "ربع"/"كامل" via explicit space-or-string-edge boundaries instead.
  return normalizeAr(name)
    .replace(/-\s*(نصف\s*)?(نصف|ربع|كامل|كيلو|كغ|وجبه)\s*$/, "")
    .replace(/(^|\s)(نصف|ربع|كامل)(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Keeps only the first (best-scored, since storeCandidates arrives relevance-sorted) item per
// distinct base dish — otherwise a basket for "دجاج ورز" could fill every slot with half/whole/
// kilo variants of the literal same dish instead of representing the menu with real variety.
function askDukkanciDedupeVariants(candidates) {
  const seen = new Set();
  const out = [];
  for (const p of candidates) {
    const base = askDukkanciDishBaseName(p.name);
    if (seen.has(base)) continue;
    seen.add(base);
    out.push(p);
  }
  return out;
}

// Assemble one single-store basket from `storeCandidates` (already relevance-sorted for this
// store). Delivery fee is the REAL per-store quote (activeDeliveryQuote — same function the
// cart/checkout use) when the visitor has a resolvable address; otherwise it falls back to the
// store's labeled rate (deliveryPriceLabel) and is flagged as an estimate, never folded into the
// total as a fabricated number.
function askDukkanciBuildBasket(store, storeCandidates, request, opts) {
  const basketSize = askDukkanciBasketSize(request.partySize);
  let chosen = askDukkanciDedupeVariants(storeCandidates).slice(0, basketSize);

  // Compound request (e.g. "غداء اقتصادي مع حلويات"): storeCandidates only ever contains items
  // that matched a keyword, and generic meal words like "غداء" never match a specific product —
  // so a store can qualify (and fill its whole basket) purely on dessert/drink matches, silently
  // dropping the actual meal. When that happens, swap in one of the store's own real main items
  // (not a dessert/drink/supply) so the "غداء" the visitor asked for is actually represented.
  // A store with ZERO genuine main-dish item (e.g. a supermarket that only sells coffee cups and
  // dessert cream) can never actually fulfill "غداء" no matter how the basket is filled — flagged
  // below so askDukkanciBuildOptions drops it entirely instead of presenting an all-add-on basket
  // as if it were a real meal option.
  let noMealAvailable = false;
  if (opts && opts.hasMealIntent) {
    // Keywords like "قهوة"/"كنافة"/"بقلاوة" end in taa marbuta (ة), which normalizeAr folds to
    // ه on the PRODUCT text side — comparing against the raw (unnormalized) keyword list would
    // silently never match those specific words. Normalize the keyword lists too, once per call.
    const normDessertKw = ASK_DUKKANCI_DESSERT_KEYWORDS.map(normalizeAr);
    const normDrinkKw = ASK_DUKKANCI_DRINK_KEYWORDS.map(normalizeAr);
    const isAddOnItem = p => {
      const n = normalizeAr(p.name), c = normalizeAr(p.category || "");
      return normDessertKw.some(k => n.includes(k) || c.includes(k)) ||
        normDrinkKw.some(k => n.includes(k) || c.includes(k));
    };
    if (chosen.length && chosen.every(isAddOnItem)) {
      // Searching the store's WHOLE catalog for a substitute only makes sense for a restaurant,
      // where virtually everything on the menu genuinely is food — for a general store (a
      // supermarket selling toys/cosmetics/spices alongside groceries), "highest-priced item
      // that isn't a dessert/drink/supply/raw-meat" is not remotely guaranteed to be a meal (a
      // toy or a shampoo bottle passes those checks trivially). Don't guess there — just reject.
      const isRestaurant = normalizeAr(store.category || "") === normalizeAr("مطاعم");
      const mainItem = isRestaurant
        ? products
          .filter(p => p.storeId === store.id && p.available !== false && !p.priceOnRequest && Number(p.price) > 0)
          .filter(p => {
            const n = normalizeAr(p.name), c = normalizeAr(p.category || "");
            return !isAddOnItem(p) && !askDukkanciIsSupplyItem(n, c) &&
              (opts.wantsSupplies || (!askDukkanciIsRawMeat(n, c) && !askDukkanciIsRawNuts(n, c)));
          })
          .sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))[0]
        : null;
      if (mainItem) chosen = [mainItem, ...chosen].slice(0, basketSize);
      else noMealAvailable = true;
    }
  }

  const items = chosen.map(product => ({ product, quantity: askDukkanciQuantity(product, request.partySize, chosen.length, request.appetiteMultiplier) }));

  const missing = [];
  if (request.includeDessert && !askDukkanciBasketMatchesAny(items, ASK_DUKKANCI_DESSERT_KEYWORDS)) missing.push("لا تتوفر حلويات مطابقة في هذا المتجر حالياً");
  if (request.includeDrinks && !askDukkanciBasketMatchesAny(items, ASK_DUKKANCI_DRINK_KEYWORDS)) missing.push("لا تتوفر مشروبات مطابقة في هذا المتجر حالياً");

  const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
  const address = getDefaultAddress();
  const quote = activeDeliveryQuote(store, address);
  const deliveryFee = quote ? quote.fee : 0;
  const deliveryIsEstimate = !quote;
  const deliveryLabel = quote ? money(quote.fee) : `${deliveryPriceLabel(store)} (تقديري)`;
  const total = subtotal + deliveryFee;
  const prepMinutes = Math.round((getDeliverySettings(store.id).prepMinutes || 25) + (quote?.routeMinutes || 15));

  const overBudget = total > request.budgetTry;
  const budgetLine = overBudget
    ? `يتجاوز ميزانيتك بـ ${money(total - request.budgetTry)}`
    : `ضمن ميزانيتك بفارق ${money(request.budgetTry - total)}`;
  const reasons = [
    `الكمية محسوبة لتناسب ${request.partySize} ${request.partySize === 1 ? "شخص" : "أشخاص"} تقريباً — عدّلها من صفحة المتجر عند الحاجة`,
    budgetLine,
    ...missing
  ];

  return {
    storeId: store.id, store, items, subtotal,
    deliveryFee, deliveryIsEstimate, deliveryLabel, total,
    perPerson: Math.round(total / Math.max(1, request.partySize)),
    prepMinutes, reasons, overBudget, budgetLine,
    exceedsMaxDistance: !!quote?.exceedsMaxDistance,
    belowMinOrder: subtotal < (Number(store.minOrder) || 0),
    noMealAvailable
  };
}

// Builds up to 3 distinct-store options: أفضل قيمة (closest to budget overall, shown first/
// featured), الاقتصادي (cheapest among the REMAINING distinct stores), المميز (richest basket,
// still within a reasonable stretch of budget, among what's left). Never forces a 2nd or 3rd
// pick when only one store genuinely qualifies — an earlier version always tried to fill all 3
// slots with distinct stores, which surfaced an irrelevant, wildly-over-budget "option" just to
// pad the count. Fewer, honest tiers beats padding with a bad one.
const ASK_DUKKANCI_APPETITE_MULTIPLIERS = { light: 0.8, moderate: 1, hearty: 1.25 };

function askDukkanciBuildOptions(request, intent) {
  // "أكول" (big eater) vs "معتدل" (moderate) — a human detail the chat can ask about, scaling
  // every quantity estimate up/down instead of pretending everyone eats the same amount.
  request = { ...request, appetiteMultiplier: ASK_DUKKANCI_APPETITE_MULTIPLIERS[intent?.appetiteLevel] || 1 };
  const { hasPrimary, primary, wantsSupplies, items: scoredCandidates } = askDukkanciScoredCandidates(request, intent);
  const byStore = new Map(); // storeId -> { store, products, bestScore }, products relevance-sorted
  for (const { product: p, primaryScore } of scoredCandidates) {
    // When the visitor actually described what they want, a store must have at least one item
    // matching THAT description to qualify — a secondary-only hit (e.g. a pure dessert shop
    // surfaced only by the "include dessert" toggle) can fill out an already-qualified store's
    // basket, but must never anchor/qualify a store on its own.
    if (hasPrimary && primaryScore <= 0) continue;
    const store = getStore(p.storeId);
    if (!askDukkanciEligibleStore(store)) continue;
    let entry = byStore.get(store.id);
    if (!entry) { entry = { store, products: [], bestScore: primaryScore }; byStore.set(store.id, entry); }
    entry.products.push(p);
  }

  // A store whose own CATEGORY matches the request (e.g. a "حلويات" shop for a dessert ask, an
  // "عصائر" bar for a drinks ask) is a specialist — its sweets/juice is the actual business, not
  // a side item tacked onto a "مطاعم" menu. When the AI intent provides preferredCategories, its
  // semantic judgment is trusted directly (it already reasoned "مشاوي" → مطاعم not ملحمة, a raw-
  // meat butcher) — no substring re-check needed. Without it, fall back to a small hardcoded
  // whitelist of FINISHED, ready-to-consume categories with an exact (not substring) match, so
  // e.g. "ملحمة ومشاوي" never accidentally qualifies via a loose "مشاوي" containment — the same
  // finished-good-vs-supply trap as askDukkanciIsSupplyItem, one level up at the store-category.
  const aiCategories = (intent && Array.isArray(intent.preferredCategories) && intent.preferredCategories.length)
    ? new Set(intent.preferredCategories.map(normalizeAr))
    : null;
  const fallbackCategories = new Set(["حلويات", "عصائر", "بن ومكسرات"].map(normalizeAr));
  const rankedStores = [...byStore.values()].map(entry => {
    const cat = entry.store.category ? normalizeAr(entry.store.category) : "";
    const isSpecialist = !!(hasPrimary && cat && (aiCategories ? aiCategories.has(cat) : (fallbackCategories.has(cat) && primary.some(kw => cat.includes(kw)))));
    return { ...entry, isSpecialist, rankScore: entry.bestScore + (isSpecialist ? 5 : 0) };
  }).sort((a, b) => b.rankScore - a.rankScore);

  // A ranking bonus alone isn't enough — the tier selection below picks by price/budget-fit,
  // which can still let a restaurant's cheap side-dish beat a specialist shop's basket on price
  // alone. When at least one genuine specialist match exists (a "حلويات" shop for a dessert ask,
  // an "عصائر" bar for a drinks ask), restrict the pool to specialists only — a restaurant's
  // version of the same item is a side dish, not its actual business, so it shouldn't compete
  // on price with the shop that specializes in it. Falls back to the full pool when no
  // specialist exists at all (e.g. "مشاوي", which genuinely lives at restaurants).
  // Except when the message ALSO explicitly asks for a meal (e.g. "غداء اقتصادي مع حلويات") —
  // that's a compound request (main dish + add-on), not a pure specialty ask, and restricting to
  // specialists there would silently drop the meal the visitor actually asked for first. See
  // ASK_DUKKANCI_MEAL_KEYWORDS above.
  const hasMealIntent = ASK_DUKKANCI_MEAL_KEYWORDS.some(kw => normalizeAr(request.message || "").includes(kw));
  const specialists = rankedStores.filter(s => s.isSpecialist);
  // The AI's preferredCategories already resolves compound requests correctly on its own (its
  // system prompt teaches: "غداء اقتصادي مع حلويات" → preferredCategories=["مطاعم"], the MEAL's
  // own category, never the add-on's) — so once the AI has spoken, trust it as a hard category
  // restriction regardless of hasMealIntent. Without that trust, a supermarket whose products
  // happen to literally contain a matched keyword (a plain rice bag matching "رز") could still
  // outrank real restaurants on price alone. Only the local-only fallback (aiCategories===null, a
  // much cruder substring check against a small hardcoded whitelist) still needs the hasMealIntent
  // escape hatch, to avoid wrongly narrowing a compound request down to just the dessert shops.
  const rankedPool = !hasPrimary || !specialists.length ? rankedStores
    : aiCategories ? specialists
    : (hasMealIntent ? rankedStores : specialists);

  // With a real description, this ranking IS the relevance order (best match, specialist-
  // boosted, first) — keep a generous but bounded pool of the most on-topic stores before
  // ranking by price, so budget-fit never promotes an irrelevant cheap item over a pricier but
  // genuinely on-topic match. With no signal at all there's nothing to rank by, so every
  // eligible store stays.
  const hasSignal = hasPrimary || request.includeDessert || request.includeDrinks;
  // Widened from 15 → 30: the visitor asked for as many real options as possible, so keep more
  // of the on-topic, relevance-ranked pool alive before price-sorting/tier-picking below.
  const relevancePool = hasSignal ? rankedPool.slice(0, 30) : rankedPool;
  const rankScoreByStore = new Map(relevancePool.map(r => [r.store.id, r.rankScore]));

  const baskets = relevancePool
    .map(({ store, products: storeCandidates }) => askDukkanciBuildBasket(store, storeCandidates, request, { hasMealIntent, wantsSupplies }))
    .filter(b => !b.belowMinOrder && !b.exceedsMaxDistance && !b.noMealAvailable)
    .sort((a, b) => a.total - b.total);

  if (!baskets.length) return { tiers: [], matchedStoreCount: 0 };
  const byRelevance = (a, b) => (rankScoreByStore.get(b.storeId) || 0) - (rankScoreByStore.get(a.storeId) || 0);

  const byBudgetFit = [...baskets].sort((a, b) => Math.abs(a.total - request.budgetTry) - Math.abs(b.total - request.budgetTry));
  const used = new Set();
  const balanced = byBudgetFit[0];
  used.add(balanced.storeId);
  const tiers = [{ ...balanced, tier: "balanced", title: "أفضل قيمة", subtitle: "أقرب خيار لميزانيتك من بين الأقرب لطلبك" }];

  const economy = baskets.find(b => !used.has(b.storeId));
  if (economy) {
    used.add(economy.storeId);
    tiers.push({ ...economy, tier: "economy", title: "الخيار الاقتصادي", subtitle: "أقل تكلفة ممكنة ضمن ما هو متاح فعلياً" });
  }

  const remaining = () => baskets.filter(b => !used.has(b.storeId)).sort(byRelevance);
  const withinStretch = remaining().filter(b => b.total <= request.budgetTry * 1.4);
  const premium = (withinStretch.length ? withinStretch : remaining()).at(-1);
  if (premium) {
    used.add(premium.storeId);
    tiers.push({ ...premium, tier: "premium", title: "الخيار المميز", subtitle: "تنوع أكبر وخيار أغنى للضيوف" });
  }

  // Beyond the 3 curated tiers, surface as many other genuinely on-topic single-store options as
  // exist (capped at 6 more) — the visitor explicitly asked for the widest possible spread of
  // real restaurants/stores, not just one "best" pick per budget bracket.
  remaining().slice(0, 6).forEach((b, i) => {
    used.add(b.storeId);
    tiers.push({
      ...b, tier: `more-${i}`, title: b.store.name,
      subtitle: b.store.category ? `خيار آخر يطابق طلبك — ${b.store.category}` : "خيار آخر يطابق طلبك"
    });
  });

  return { tiers, matchedStoreCount: baskets.length };
}

// Compact, real grounding data sent to the AI so its clarifying questions never reference a
// cuisine/category that doesn't actually exist on the platform — the AI still never sees prices,
// menus, or product data, only category + store NAMES (no descriptions), and is explicitly told
// not to claim knowledge of a store's actual offering beyond its name existing.
function askDukkanciCatalogSummary() {
  const eligible = stores.filter(askDukkanciEligibleStore);
  const categories = [...new Set(eligible.map(s => s.category).filter(Boolean))];
  const storeNames = [...new Set(eligible.map(s => s.name).filter(Boolean))].slice(0, 80);
  return { categories, storeNames };
}

// Server-side AI conversation turn (api/ask-dukkanci.js) — the AI either asks ONE clarifying
// question (grounded in the real category/store list above, capped at 2 total per conversation)
// or returns a classification (keywords/secondaryKeywords/wantsSupplies/preferredCategories). It
// never sees the real catalog/prices and can never return a product, price, or store, so a slow/
// unavailable AI degrades match QUALITY, never correctness — on any failure (network error,
// timeout, malformed reply) this resolves to null and the caller falls back to local heuristics.
async function askDukkanciChatTurn(message, forceFinal) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 9000);
  try {
    const res = await fetch("/api/ask-dukkanci", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        history: state.askDukkanci.messages,
        catalog: askDukkanciCatalogSummary(),
        forceFinal: !!forceFinal
      }),
      signal: ctrl.signal
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data && data.ok && data.turn) ? data.turn : null;
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Runs one AI turn and either (a) shows a clarifying-question bubble + reply box, or (b) builds
// and shows the final results — from the CURRENT state.askDukkanci.messages, which the caller
// must have already appended the visitor's latest message to. A null/failed turn degrades
// straight to the pre-AI local heuristics (askDukkanciBuildOptions already handles intent=null).
async function askDukkanciAdvance(userText, forceFinal) {
  const turn = await askDukkanciChatTurn(userText, forceFinal);
  if (turn && turn.type === "question") {
    state.askDukkanci.messages = [...state.askDukkanci.messages, { role: "assistant", text: turn.question }];
    state.askDukkanci.awaitingReply = true;
    state.askDukkanci.submitting = false;
    render();
    setTimeout(() => document.getElementById("ask-dukkanci-chat")?.scrollIntoView({ behavior: "smooth", block: "end" }), 60);
    return;
  }
  const intent = turn && turn.type === "ready" ? turn : null;
  if (intent) state.askDukkanci.messages = [...state.askDukkanci.messages, { role: "assistant", text: intent.summary || "تمام، جهّزت لك أفضل الخيارات المتاحة الآن." }];
  state.askDukkanci.lastIntent = intent;
  state.askDukkanci.awaitingReply = false;
  // The visitor may have edited party size/budget while the AI call was in flight — rebuild the
  // request from current state, not stale local variables.
  const result = askDukkanciBuildOptions(state.askDukkanci, intent);
  state.askDukkanci.result = result;
  state.askDukkanci.submitting = false;
  render();
  setTimeout(() => document.getElementById("ask-dukkanci-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  if (result.tiers.length) window.DUKKANCI_TRACKING?.track("ask_dukkanci_result_viewed", { options_count: result.tiers.length, matched_store_count: result.matchedStoreCount, ai_intent_used: !!intent });
}

async function submitAskDukkanci(form) {
  const message = (form.querySelector("#ask-message")?.value || "").trim();
  const partySize = Math.min(100, Math.max(1, Number(form.querySelector("#ask-partysize")?.value) || 1));
  const budgetTry = Math.max(0, Number(form.querySelector("#ask-budget")?.value) || 0);
  state.askDukkanci = {
    ...state.askDukkanci, message, partySize, budgetTry,
    submitted: true, submitting: true, result: null,
    messages: message ? [{ role: "user", text: message }] : [],
    awaitingReply: false, lastIntent: null
  };
  window.DUKKANCI_TRACKING?.track("ask_dukkanci_submitted", { message_length: message.length, party_size: partySize, budget: budgetTry, include_dessert: state.askDukkanci.includeDessert, include_drinks: state.askDukkanci.includeDrinks });
  render();
  setTimeout(() => document.getElementById("ask-dukkanci-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
  await askDukkanciAdvance(message, false);
}

// Follow-up turn in the clarifying-question chat — appends the visitor's reply and continues the
// same conversation (askDukkanciChatTurn reads state.askDukkanci.messages for history).
async function submitAskDukkanciChatReply(form, forceFinal) {
  const input = form.querySelector("#ask-chat-reply");
  const reply = (input?.value || "").trim();
  if (!reply && !forceFinal) return;
  if (reply) {
    state.askDukkanci.messages = [...state.askDukkanci.messages, { role: "user", text: reply }];
    // The FIRST message that opened this chat is often the least informative one — that's
    // precisely why the AI asked a follow-up. request.message feeds the local keyword-matching
    // fallback (askDukkanciScoredCandidates), so leaving it frozen at that vague opener would
    // keep polluting every later turn's matching with stale, non-specific words. Roll forward to
    // the full conversation's user text instead, so local matching reflects what was ACTUALLY
    // asked, not just the opening line.
    state.askDukkanci.message = state.askDukkanci.messages.filter(m => m.role === "user").map(m => m.text).join(" ");
  }
  state.askDukkanci.awaitingReply = false;
  state.askDukkanci.submitting = true;
  render();
  await askDukkanciAdvance(reply || "(تخطّى العميل السؤال — تابع بأفضل تخمين ممكن)", forceFinal);
}

// A bundle is guaranteed single-store by construction, so this can call the real addToCart()
// directly for every line — no cross-store conflict is possible, and the single-store-cart
// rule is honored rather than worked around.
function askDukkanciAddBundleToCart(tier) {
  const result = state.askDukkanci.result;
  const bundle = result && result.tiers.find(t => t.tier === tier);
  if (!bundle) return;
  // addToCart() silently redirects to the profile-setup modal (name/phone/address) instead of
  // adding when the profile is incomplete — that modal only resumes a single pending product,
  // not a whole bundle. Surface that honestly up front instead of looping addToCart() (which
  // would just reopen the same modal once per item) and claiming success when nothing was added.
  if (!isProfileComplete()) {
    const first = bundle.items[0];
    openProfileSetupModal(first.product.id, first.quantity);
    showToast("أكمل بياناتك أولاً، ثم أعد الضغط على «أضف الباقة إلى السلة»");
    return;
  }
  bundle.items.forEach(it => addToCart(it.product.id, it.quantity));
  askDukkanciCartOrigin = true;
  window.DUKKANCI_TRACKING?.track("ask_dukkanci_bundle_added", { tier, store_id: bundle.storeId, value: bundle.total, items_count: bundle.items.length });
  showToast("تمت إضافة الباقة إلى السلة", "success");
  openCart();
}

function askDukkanciItemRow(it) {
  return `<div class="ask-item-row">
    <div class="ask-item-row__img"><img src="${it.product.image}" alt="${escAttr(it.product.name)}" loading="lazy"></div>
    <div class="ask-item-row__body"><strong>${esc(it.product.name)}</strong><small>${esc(it.product.storeName || "")}${it.product.storeName ? " · " : ""}الكمية ${it.quantity}${it.product.unit ? ` ${esc(it.product.unit)}` : ""}</small></div>
    <div class="ask-item-row__price">${money(it.product.price * it.quantity)}</div>
  </div>`;
}

function askDukkanciResultCard(bundle, featured = false) {
  return `<article class="ask-result-card ${featured ? "featured" : ""}">
    <div class="ask-result-card__head">
      <div>
        ${featured ? `<span class="ask-badge">اقتراح دكانجي</span>` : ""}
        <span class="ask-badge muted">${esc(bundle.store.name)}</span>
        <h3>${esc(bundle.title)}</h3>
        <p>${esc(bundle.subtitle)}</p>
      </div>
      <div class="ask-result-card__price"><strong>${money(bundle.total)}</strong><small>${money(bundle.perPerson)} للشخص</small></div>
    </div>
    <div class="ask-result-card__items">${bundle.items.map(it => askDukkanciItemRow({ ...it, product: { ...it.product, storeName: bundle.store.name } })).join("")}</div>
    <div class="ask-stat-grid">
      <div class="ask-stat">${icon("wallet")}<span>الميزانية</span><strong class="${bundle.overBudget ? "over" : "under"}">${esc(bundle.budgetLine)}</strong></div>
      <div class="ask-stat">${icon("clock")}<span>الوقت المتوقع</span><strong>${bundle.prepMinutes} دقيقة</strong></div>
      <div class="ask-stat">${icon("bike")}<span>التوصيل${bundle.deliveryIsEstimate ? " (تقديري)" : ""}</span><strong>${bundle.deliveryLabel}</strong></div>
    </div>
    <ul class="ask-reasons">${bundle.reasons.map(r => `<li>${icon("check")} <span>${esc(r)}</span></li>`).join("")}</ul>
    <div class="ask-result-card__actions">
      <button type="button" class="primary-button full" data-action="ask-dukkanci-add-bundle" data-tier="${bundle.tier}">${icon("bag")} أضف الباقة إلى السلة</button>
      <a class="secondary-button" href="/store/${storeParam(bundle.store)}" data-action="open-store" data-id="${bundle.store.id}">عرض المتجر</a>
    </div>
  </article>`;
}

// One chat bubble — assistant (AI question/summary) on the start side, visitor's own replies on
// the end side, matching the familiar chat-app convention.
function askDukkanciChatBubble(msg) {
  return `<div class="ask-chat-msg ask-chat-msg--${msg.role}">
    ${msg.role === "assistant" ? `<span class="ask-chat-msg__avatar">${icon("stars")}</span>` : ""}
    <div class="ask-chat-msg__bubble">${esc(msg.text)}</div>
  </div>`;
}

function renderAskDukkanciPage() {
  const a = state.askDukkanci;
  const address = getDefaultAddress();
  const result = a.result;
  const budgetPerPerson = Math.round((a.budgetTry || 0) / Math.max(1, a.partySize || 1));

  return `
    <section class="page-hero compact ask-hero">
      <div class="container">
        <div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><strong>اسأل دكانجي</strong></div>
        <span class="ask-hero__eyebrow">${icon("stars")} مساعدك الذكي لاختيار الطلب</span>
        <h1>اسأل دكانجي</h1>
        <p>احكِ لنا ماذا تريد — دكانجي قد يسألك سؤالاً أو اثنين ليفهم طلبك بدقة، ثم يرتّب لك أكبر عدد ممكن من الاقتراحات الحقيقية من مطاعم ومتاجر إسطنبول، بأسعار وتوصيل حقيقيين.</p>
      </div>
    </section>

    <section class="section ask-form-section">
      <div class="container">
        <form id="ask-dukkanci-form" class="ask-form-card">
          <div class="ask-form-grid">
            <div class="ask-form-col">
              <label class="input-label"><span>احكِ لنا ماذا تحتاج</span>
                <textarea id="ask-message" rows="4" maxlength="700" placeholder="مثال: عندي عزومة 10 أشخاص وأريد غداء اقتصادياً مع حلويات...">${escAttr(a.message)}</textarea>
              </label>
              <div class="ask-quick-prompts">
                ${ASK_DUKKANCI_QUICK_PROMPTS.map(p => `<button type="button" class="ask-quick-prompt" data-action="ask-dukkanci-quick-prompt" data-prompt="${escAttr(p)}">${esc(p)}</button>`).join("")}
              </div>
            </div>
            <div class="ask-form-col ask-form-col--side">
              <div class="ask-field-grid">
                <label class="input-label"><span>${icon("users")} عدد الأشخاص</span><input id="ask-partysize" type="number" min="1" max="100" value="${a.partySize}"></label>
                <label class="input-label"><span>${icon("wallet")} الميزانية (ل.ت)</span><input id="ask-budget" type="number" min="0" step="50" value="${a.budgetTry}"></label>
              </div>
              <p class="ask-budget-hint">ميزانيتك تعادل تقريباً <strong>${money(budgetPerPerson)}</strong> للشخص.</p>
              <div class="ask-toggle-row">
                <button type="button" class="cat-chip ${a.includeDessert ? "active" : ""}" data-action="ask-dukkanci-toggle-dessert">${icon("check")} أضف حلويات</button>
                <button type="button" class="cat-chip ${a.includeDrinks ? "active" : ""}" data-action="ask-dukkanci-toggle-drinks">${icon("check")} أضف مشروبات</button>
              </div>
              <button type="button" class="ask-location-hint" data-action="location">
                ${icon("pin")} ${address ? `التوصيل إلى: ${esc(address.label || address.address || "عنوانك")}` : "حدّد عنوانك ليكون سعر التوصيل حقيقياً"}
              </button>
              <button type="submit" class="primary-button full large" ${a.submitting ? "disabled" : ""}>
                ${a.submitting ? `<span class="ask-spinner"></span> دكانجي يفهم طلبك...` : `جهّز اقتراحي ${icon("arrowLeft")}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>

    ${a.messages.length ? `
    <section id="ask-dukkanci-chat" class="section ask-chat-section">
      <div class="container">
        <div class="ask-chat-thread">${a.messages.map(askDukkanciChatBubble).join("")}</div>
        ${a.awaitingReply ? `
          <form id="ask-dukkanci-chat-form" class="ask-chat-reply-form">
            <input id="ask-chat-reply" type="text" maxlength="300" placeholder="اكتب ردّك هنا..." autocomplete="off">
            <button type="submit" class="primary-button">${icon("arrowLeft")}</button>
            <button type="button" class="secondary-button" data-action="ask-dukkanci-skip-question">تخطَّ واعرض النتائج</button>
          </form>
        ` : (a.submitting && !result ? `<div class="ask-chat-msg ask-chat-msg--assistant"><span class="ask-chat-msg__avatar">${icon("stars")}</span><div class="ask-chat-msg__bubble"><span class="ask-spinner"></span> دكانجي يفكّر...</div></div>` : "")}
      </div>
    </section>` : ""}

    ${a.submitted ? `
    <section id="ask-dukkanci-results" class="section ask-results-section">
      <div class="container">
        ${a.submitting ? `
          <div class="ask-loading-card">
            <div class="ask-skeleton-line short"></div>
            <div class="ask-skeleton-block"></div>
            <div class="ask-skeleton-block"></div>
          </div>
        ` : (result && result.tiers.length ? `
          <div class="section-heading"><div><span class="section-kicker">النتيجة</span><h2>وجدنا لك ${result.tiers.length === 1 ? "خياراً مناسباً" : `${result.tiers.length} خيارات مناسبة`}</h2>${a.lastIntent && a.lastIntent.summary ? `<p class="ask-results-summary">${esc(a.lastIntent.summary)}</p>` : ""}</div></div>
          <div class="ask-results-grid">${result.tiers.map((t, i) => askDukkanciResultCard(t, i === 0)).join("")}</div>
        ` : renderEmpty("لم نجد اقتراحاً مطابقاً الآن", "جرّب توسيع الوصف، أو تقليل شرط الحلويات/المشروبات، أو رفع الميزانية قليلاً.", "تصفح المتاجر", "stores"))}
      </div>
    </section>` : ""}
  `;
}

// Per-category wording for the merchant-recruitment banner on /category/<slug>
// (see renderCategoryPage below) — "أعلن عن {noun} هنا" needs a real singular
// possessive noun, which can't be derived from the plural category label
// automatically. Falls back to a generic noun for any category not listed here.
const CATEGORY_MERCHANT_PITCH = {
  "مطاعم": "مطعمك",
  "حلويات": "محل حلوياتك",
  "سوبر ماركت": "سوبر ماركتك",
  "ملاحم": "ملحمتك",
  "عصائر": "محل عصائرك",
  "مكسرات وبهارات": "محلك للمكسرات والبهارات",
  "مطابخ منزلية": "مطبخك المنزلي"
};

// Main-category landing page for /category/<slug>: stores in the category + a
// sample of their products, all as links.
function renderCategoryPage(slug) {
  const catText = CATEGORY_MAP[slug];
  if (!catText) {
    return `<section class="section empty-page">${renderEmpty("الفئة غير موجودة", "تصفح كل المتاجر بدلاً من ذلك.", "تصفح المتاجر", "stores")}</section>`;
  }
  const catStores = sortStoresByPaidPriority(collapseBranchGroups(stores.filter(s => storeMatchesCategory(s, catText) && isStoreApproved(s))));
  const storeIds = new Set(catStores.map(s => s.id));
  const catProducts = products.filter(p => storeIds.has(p.storeId) && p.available !== false).slice(0, 40);
  const merchantNoun = CATEGORY_MERCHANT_PITCH[catText] || "متجرك";
  return `
    <section class="page-hero compact category-hero"><div class="container"><div class="breadcrumbs"><a href="/" data-action="route-home">الرئيسية</a><span>/</span><strong>${catText}</strong></div><h1>${catText}</h1><p>${catStores.length ? `${catStores.length} متجر في إسطنبول على دكانجي.` : "قريباً في منطقتك."}</p></div></section>
    ${bannerStripHTML("category_top", { categoryKey: slug })}
    <section class="section category-stores-section"><div class="container">
      <div class="merchant-cta category-merchant-banner">
        <div class="merchant-cta__art"><div class="shop-mini">${icon("store")}</div></div>
        <div class="merchant-cta__copy">
          <span>لأصحاب المتاجر</span>
          <h2>أعلن عن ${escAttr(merchantNoun)} هنا</h2>
          <p>وصل لعملاء أكثر في منطقتك عبر دكانجي.</p>
        </div>
        <button class="primary-button dark" data-action="join-merchant">انضم كتاجر ${icon("arrowLeft")}</button>
      </div>
      <div class="category-stores-block">
      ${catStores.length ? `
        <div class="section-heading small"><h2>${catText}</h2></div>
        <div class="store-grid">${catStores.map(storeCard).join("")}</div>
      ` : renderEmpty("لا توجد متاجر في هذا التصنيف حالياً", "نعمل على إضافة متاجر جديدة قريباً.", "تصفح كل المتاجر", "stores")}
      </div>
      ${catStores.length && catProducts.length ? `<div class="category-products-block"><div class="section-heading small" style="margin-top:24px"><h2>منتجات مختارة</h2></div><div class="product-grid">${catProducts.map(productCard).join("")}</div></div>` : ""}
    </div></section>
  `;
}

// HERO V2 slider — auto-advances the 4 headline slides and wires the dot controls.
// Idempotent per render: render() clears state._heroTimer first, so this never stacks
// timers. state._heroSlide persists the active slide so a data-refresh re-render resumes
// where it left off instead of snapping back to slide 1.
function setupHeroSlider() {
  const root = document.querySelector(".hero2");
  if (!root) return;
  const slides = [...root.querySelectorAll(".h2-slide")];
  const dots = [...root.querySelectorAll(".h2-dot")];
  if (slides.length < 2) return;
  let current = Math.min(Number(state._heroSlide) || 0, slides.length - 1);
  const apply = i => {
    current = i;
    state._heroSlide = i;
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  };
  const arm = () => { state._heroTimer = setInterval(() => apply((current + 1) % slides.length), 5200); };
  apply(current);
  dots.forEach(dot => dot.addEventListener("click", () => {
    if (state._heroTimer) clearInterval(state._heroTimer);
    apply(Number(dot.dataset.index));
    arm(); // restart the clock so a manual pick gets its full dwell time
  }));
  arm();
}

// HERO V2 search — "typing" placeholder that cycles through example product &
// store names (the موشن in the search box). Same idempotent contract as
// setupHeroSlider: render() clears state._heroPh first so timers never stack,
// and state._heroPhIdx persists the rotation across data-refresh re-renders.
// Pauses (shows the plain hint) whenever the user is focusing or has typed, so
// it never fights real input. Uses recursive setTimeout for per-phase speeds.
const HERO_SEARCH_HINTS = [
  "شاورما",
  "حليب نيدو",
  "ماركت صفا الشام",
  "ملحمة الهلال",
  "بيتزا مارغريتا",
  "برياني دجاج",
  "كريب نوتيلا",
  "مندي لحم",
  "كنافة نابلسية",
  "قهوة تركية",
  "وافل بلجيكي"
];
function setupHeroSearchTyper() {
  const input = document.getElementById("hero-search");
  if (!input) return;
  const DEFAULT_PH = "ابحث عن منتج أو متجر...";
  const PREFIX = "ابحث عن ";
  // Respect reduced-motion: keep the static hint, animate nothing.
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    input.placeholder = DEFAULT_PH;
    return;
  }
  let hintIdx = Number(state._heroPhIdx) || 0;
  let charIdx = 0;
  let phase = "type"; // type → hold → erase → gap → (next hint)
  let holdTicks = 0;
  let caretOn = true;
  // The user owns the box the moment they focus it or type anything.
  const busy = () => document.activeElement === input || (input.value || "").length > 0;
  // Trailing caret cell is always 1 char wide (| or space) so the blink can't
  // nudge the Arabic text sideways. In the RTL input the caret sits at the far
  // left, i.e. exactly where you'd be typing next.
  const paint = txt => { input.placeholder = txt + (caretOn ? "|" : " "); };
  const step = () => {
    if (busy()) { input.placeholder = DEFAULT_PH; state._heroPh = setTimeout(step, 600); return; }
    const word = HERO_SEARCH_HINTS[hintIdx % HERO_SEARCH_HINTS.length];
    if (phase === "type") {
      charIdx++;
      caretOn = true;
      paint(PREFIX + word.slice(0, charIdx));
      if (charIdx >= word.length) { phase = "hold"; holdTicks = 0; state._heroPh = setTimeout(step, 520); return; }
      state._heroPh = setTimeout(step, word[charIdx - 1] === " " ? 200 : 85);
    } else if (phase === "hold") {
      caretOn = !caretOn; // blink in place while the full word rests
      paint(PREFIX + word);
      if (++holdTicks >= 5) { phase = "erase"; caretOn = true; state._heroPh = setTimeout(step, 320); return; }
      state._heroPh = setTimeout(step, 450);
    } else if (phase === "erase") {
      charIdx--;
      caretOn = true;
      paint(PREFIX + word.slice(0, Math.max(0, charIdx)));
      if (charIdx <= 0) { phase = "gap"; state._heroPh = setTimeout(step, 240); return; }
      state._heroPh = setTimeout(step, 42);
    } else {
      hintIdx = (hintIdx + 1) % HERO_SEARCH_HINTS.length;
      state._heroPhIdx = hintIdx;
      charIdx = 0;
      phase = "type";
      state._heroPh = setTimeout(step, 60);
    }
  };
  step();
}

function render() {
  const { route } = parseRoute();
  let { id } = parseRoute();
  state.route = route;
  // Stop any running hero slider before re-rendering (the DOM it drove is about to be
  // replaced) — prevents stacked setInterval timers on every re-render. Re-armed below
  // by setupHeroSlider() when the home hero is present.
  if (state._heroTimer) { clearInterval(state._heroTimer); state._heroTimer = null; }
  if (state._heroPh) { clearTimeout(state._heroPh); state._heroPh = null; }
  // Canonicalize a numeric /store/<id> deep-link to its clean slug URL (address bar
  // only, no reload) so a shared/bookmarked /store/50 shows /store/safa-alsham-market.
  // Realigning `id` to the slug keeps the nav key stable so the post-load data-refresh
  // render doesn't see a changed key and jump-scroll to the top.
  if (route === "store" && id != null && /^\d+$/.test(String(id)) && SLUG_MAP[Number(id)]) {
    id = SLUG_MAP[Number(id)];
    history.replaceState({}, "", "/store/" + id);
  }
  updateHead(route, id);
  const routes = {
    home: renderHome,
    join: renderHome,
    stores: renderStores,
    offers: renderOffers,
    store: () => renderStorePage(id),
    product: () => renderProductPage(id),
    category: () => renderCategoryPage(id),
    orders: renderOrders,
    group: () => renderGroupOrder(id),
    merchant: () => renderMerchant(id),
    admin: renderAdmin,
    checkout: renderCheckout,
    about: renderAboutPage,
    regions: renderRegionsPage,
    contact: renderContactPage,
    faq: renderFaqPage,
    terms: renderTermsPage,
    "why-dukkanci": renderWhyDukkanciPage,
    "ask-dukkanci": renderAskDukkanciPage,
    dalil: () => renderDalilPage(id)
  };
  // Preserve an in-progress text field across this re-render. The async boot
  // data-refreshes (site-settings, integrations, and the ~7600-product catalog
  // load) each fire render() in the first seconds after load, rebuilding
  // app.innerHTML from scratch. A user's unsubmitted search text lives in the DOM
  // input, NOT in state (state.search updates only on Enter/submit) — so without
  // this, typing in the hero/stores search during those seconds gets wiped along
  // with the focus and caret. Restore is keyed by element id, so it's a natural
  // no-op on real navigation (the next page has a different input id).
  const _focused = document.activeElement;
  const _preserve = (_focused && _focused.id && app.contains(_focused)
      && (_focused.tagName === "INPUT" || _focused.tagName === "TEXTAREA"))
    ? { id: _focused.id, value: _focused.value, start: _focused.selectionStart, end: _focused.selectionEnd }
    : null;
  app.innerHTML = (routes[route] || renderHome)();
  if (_preserve) {
    const el = document.getElementById(_preserve.id);
    if (el) {
      if (el.value !== _preserve.value) el.value = _preserve.value;
      el.focus();
      // Some input types reject setSelectionRange — guard so it never throws.
      try { el.setSelectionRange(_preserve.start, _preserve.end); } catch (e) {}
    }
  }
  document.body.classList.toggle("dashboard-view", route === "merchant" || route === "admin");
  document.querySelectorAll("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === route));
  hydrateIcons(app);
  updateCartBadges();
  updateOffersBadge();
  // Home/join render the V2 hero with its rotating headline — arm its auto-advance slider.
  if (route === "home" || route === "join") { setupHeroSlider(); setupHeroSearchTyper(); }
  // Managed banners can appear on home/offers/category — arm their in-view
  // impression counter after every paint (it self-dedupes per session).
  setupBannerImpressions();
  // Only reset scroll on actual navigation (route/id change). Data-refresh
  // re-renders (catalog load, site settings, polling) must preserve the user's
  // scroll position — otherwise the page snaps to top a few seconds after load
  // when the async full-catalog fetch completes.
  const navKey = route + "/" + (id || "");
  if (navKey !== state._lastNavKey) {
    window.scrollTo({ top: 0, behavior: "instant" });
    state._lastNavKey = navKey;
    // Entering "طلباتي" → refresh order statuses from the cloud (once per visit, so
    // the re-render below doesn't loop since navKey stays the same).
    if (route === "orders") setTimeout(refreshMyOrdersFromCloud, 0);
    if (route === "ask-dukkanci") window.DUKKANCI_TRACKING?.track("ask_dukkanci_opened", {});
  }
  if (route === "checkout" && state.cart.length) setTimeout(() => requestDeliveryQuote(), 0);
  if (route === "join") setTimeout(openJoinModal, 0);
  if (route === "store" || route === "product" || route === "offers") hydratePageData();
  if (route === "admin" && state.adminTab === "messages" && state.adminKey) {
    setTimeout(() => { startInboxPolling(); scrollChatToBottom(); }, 0);
  }
  if (route === "admin" && state.adminTab === "credentials" && state.adminKey && state.adminCreds === null) {
    setTimeout(loadAdminCreds, 0);
  }
  if (route === "admin" && state.adminTab === "marketing" && state.adminKey && state.adminMarketing == null) {
    setTimeout(loadMarketingReport, 0);
  }
  if (route === "admin" && state.adminTab === "fbads" && state.adminKey && state.fbadsActiveTarget && state.fbadsActiveTarget !== "error") {
    setTimeout(initFbAdsMap, 0);
  }
  if (route === "merchant" && state.merchantTab === "analytics" && ((state.merchantPwAuth && state.merchantPwAuth.token) || state.adminKey) && state.merchantAnalytics == null) {
    setTimeout(loadMerchantReport, 0);
  }
}

function renderCart() {
  // Same stale-reference guard as renderCheckout: a product can be
  // deleted/hidden after being added, and the cart persists past that in
  // localStorage — drop it here instead of crashing the drawer.
  const liveCart = state.cart.filter(item => getProduct(item.productId));
  if (liveCart.length !== state.cart.length) { state.cart = liveCart; saveState(); updateCartBadges(); }
  const totals = cartTotals(getDefaultAddress()?.id);
  if (!state.cart.length) {
    cartDrawer.innerHTML = `<div class="drawer-head"><div><h2>سلة التسوق</h2><span>0 منتجات</span></div><button data-action="close-drawers">${icon("close")}</button></div>${renderEmpty("سلتك تنتظر اختياراتك", "تصفح متاجر الحي وأضف ما تحتاجه بسهولة.", "تصفح المتاجر", "stores")}`;
    return;
  }
  const store = getStore(state.cart[0].storeId);
  cartDrawer.innerHTML = `
    <div class="drawer-head"><div><h2>سلة التسوق</h2><span>${state.cart.reduce((sum, item) => sum + item.quantity, 0)} منتجات</span></div><button data-action="close-drawers">${icon("close")}</button></div>
    <div class="cart-store">${storeAvatar(store)}<div><small>طلبك من</small><strong>${esc(store.name)}</strong></div><button data-action="open-store" data-id="${store.id}">عرض المتجر</button></div>
    <div class="cart-items">${state.cart.map((item, index) => {
      const product = getProduct(item.productId);
      return `<article class="cart-item"><img src="${escAttr(product.image)}" alt="${escAttr(product.name)}"><div class="cart-item__info"><strong>${esc(product.name)}</strong><small>${item.optionsText || product.unit}</small><b>${money(item.finalPrice)}</b><div class="quantity-control"><button data-action="cart-minus" data-index="${index}">${item.quantity === 1 ? icon("trash") : icon("minus")}</button><span>${item.quantity}</span><button data-action="cart-plus" data-index="${index}">${icon("plus")}</button></div></div></article>`;
    }).join("")}</div>
    <div class="cart-note"><label for="cart-note">ملاحظات للمتجر</label><textarea id="cart-note" placeholder="مثال: يرجى اختيار حبات ناضجة...">${escAttr(state.cartNote || "")}</textarea></div>
    <div class="cart-footer">
      <div class="cart-price-line"><span>المجموع الفرعي</span><strong>${money(totals.subtotal)}</strong></div>
      ${totals.discount > 0 ? `<div class="cart-price-line cart-discount"><span>خصم${state.coupon ? ` (${escAttr(state.coupon.code)})` : ""}</span><strong>−${money(totals.discount)}</strong></div>` : ""}
      <div class="cart-price-line"><span>التوصيل</span><strong>${totals.freeDelivery ? "مجاني 🎉" : (getDeliverySettings(store.id).mode === "distance" ? `${money(totals.delivery)} تقديرياً` : money(totals.delivery))}</strong></div>
      ${getDeliverySettings(store.id).mode === "distance" ? `<p class="distance-cart-note">${icon("map")} يُثبت السعر حسب عنوانك ومسار الطريق عند إتمام الطلب.</p>` : ""}
      <div class="cart-total"><span>الإجمالي التقريبي</span><strong>${money(totals.total)}</strong></div>
      ${totals.subtotal < store.minOrder ? `<p class="minimum-alert">أضف ${money(store.minOrder - totals.subtotal)} للوصول إلى الحد الأدنى للطلب.</p>` : ""}
      ${freeDeliveryNudge(store, totals)}
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
  if (addr2Map) { try { google.maps.event.clearInstanceListeners(addr2Map); } catch {} addr2Map = null; }
  modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div><div class="modal ${className}">${content}</div>`;
  modalRoot.classList.add("open");
  document.body.classList.add("no-scroll");
}

function closeModal() {
  if (addr2Map) { try { google.maps.event.clearInstanceListeners(addr2Map); } catch {} addr2Map = null; }
  modalRoot.classList.remove("open");
  modalRoot.innerHTML = "";
  document.body.classList.remove("no-scroll");
}

function openCustomerOrderDetails(orderId) {
  const order = (state.myOrders || []).find(item => item.id === orderId);
  if (!order) return;
  const store = getStore(order.storeId);
  const prog = orderProgress(order.status);
  const isDelivery = order.fulfillment !== "pickup";
  const deliveryFee = isDelivery ? (order.deliveryDetails?.fee ?? 0) : 0;
  const items = Array.isArray(order.lineItems) ? order.lineItems : [];
  const waNum = (order.customerPhone || "").replace(/\D/g, "");
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="customer-order-modal__store">${storeAvatar(store)}<div><span class="section-kicker" dir="ltr">${order.id}</span><h2>${store ? store.name : "متجر"}</h2><small>${order.createdAt ? formatOrderDate(order.createdAt) : ""}</small></div><span class="status-pill ${prog.color}">${order.status}</span></div>
    <div class="order-contact">
      <div class="order-contact__row">${icon(isDelivery ? "bike" : "store")}<span>${isDelivery ? `توصيل إلى ${escAttr(order.address || "عنوانك")}${order.addressDetails ? ` — ${escAttr(order.addressDetails)}` : ""}` : "استلام من المتجر"}</span></div>
      ${order.scheduleDay ? `<div class="order-contact__row">${icon("clock")}<span>${escAttr(order.scheduleDay)} · ${escAttr(order.scheduleTime || "في أقرب وقت")}</span></div>` : ""}
      ${order.payment ? `<div class="order-contact__row">${icon("wallet")}<span>${escAttr(order.payment)}</span></div>` : ""}
      ${/تحويل بنكي/.test(order.payment || "") ? (store && store.bankDetails && store.bankDetails.trim()
        ? `<div class="bank-details-box" style="margin:6px 0"><div class="bank-details-box__head"><strong>${icon("shield")} حساب المتجر للتحويل</strong><button type="button" class="secondary-button compact" data-action="copy-bank" data-details="${escAttr(store.bankDetails)}">${icon("check")} نسخ</button></div><pre class="bank-details-text" dir="auto">${escAttr(store.bankDetails)}</pre></div>`
        : `<div class="order-contact__row order-contact__row--muted">${icon("info")}<span>سيرسل لك المتجر رقم الحساب للتحويل عبر واتساب.</span></div>`) : ""}
      ${store && (store.whatsapp || store.phone) ? `<div class="order-contact__row">${icon("whatsapp")}<a class="order-wa-btn" href="https://wa.me/${(store.whatsapp || store.phone).replace(/\D/g, "")}" target="_blank" rel="noopener" data-id="${store.id}">${icon("whatsapp")} مراسلة المتجر</a></div>` : ""}
    </div>
    <div class="customer-order-modal__items">${items.map(item => {
      const product = item.productId ? getProduct(item.productId) : null;
      return `<article>${product ? `<img src="${escAttr(product.image)}" alt="${escAttr(item.name)}">` : ""}<div><strong>${escAttr(item.name)}</strong>${item.options ? `<small>${escAttr(item.options)}</small>` : ""}</div><span>${(item.qty || 1).toLocaleString("ar")} × ${money(item.price)}</span></article>`;
    }).join("")}</div>
    <div class="customer-order-modal__summary"><span><small>قيمة المنتجات</small><strong>${money(order.total - deliveryFee)}</strong></span><span><small>${isDelivery ? "رسوم التوصيل" : "الاستلام"}</small><strong>${isDelivery ? money(deliveryFee) : "مجاناً"}</strong></span><span class="total"><small>الإجمالي</small><strong>${money(order.total)}</strong></span></div>
    <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إغلاق</button><button class="primary-button" data-action="reorder" data-id="${order.id}">${icon("bag")} إعادة الطلب</button></div>
  `, "customer-order-modal");
}

function applyCustomerReorder(orderId) {
  const order = (state.myOrders || []).find(item => item.id === orderId);
  if (!order) return;
  state.cart = [];
  let added = 0;
  (order.lineItems || []).forEach(item => {
    const product = item.productId ? getProduct(item.productId) : null;
    if (!product || product.available === false) return;
    addToCart(product.id, item.qty || 1, item.optionSelections || [], item.notes || "");
    added++;
  });
  closeModal();
  if (!added) { showToast("لم تعد منتجات هذا الطلب متوفرة حالياً"); return; }
  showToast("تمت إضافة منتجات الطلب إلى السلة", "success");
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

// ─────────── Address flow V2: picker (عناويني) + map-based details (تفاصيل العنوان) ───────────

// Home-style labels get a home icon, work-style ones a store icon.
function addressIconFor(label) {
  return icon(/عمل|دوام|شرك|مكتب/.test(label || "") ? "store" : "home");
}

const ADDR_PIN_SVG = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/></svg>`;

// The summary box shown inside checkout step ٢ — either the selected address or
// a dashed "choose/add" button. The actual value lives in the hidden
// input[name=address] so the submit handler keeps working unchanged.
function renderCheckoutAddressBox(selectedAddressId) {
  const a = selectedAddressId ? getCheckoutAddress(selectedAddressId) : null;
  if (!a) return `<button type="button" class="addr-choose-btn" data-action="open-address-picker"><span>+</span> اختر أو أضف عنوان التوصيل</button>`;
  const isCurrent = String(a.id) === "current" || a.isCurrent;
  return `
    <div class="addr-selected">
      <span class="addr-pick-icon">${isCurrent ? icon("pin") : addressIconFor(a.label)}</span>
      <div><strong>${escAttr(a.label)}</strong><small>${escAttr(a.address)}${a.details ? ` — ${escAttr(a.details)}` : ""}</small></div>
      <button type="button" class="text-button" data-action="open-address-picker">تغيير</button>
    </div>`;
}

// Applies a picked address to the open checkout form WITHOUT a full render()
// (a re-render would wipe whatever the customer already typed in name/phone).
function applyCheckoutAddressSelection(addressId) {
  state.checkoutSelectedAddressId = addressId;
  saveState();
  const form = document.getElementById("checkout-form");
  if (!form) return;
  form.elements.address.value = addressId;
  const box = document.getElementById("checkout-address-box");
  if (box) box.innerHTML = renderCheckoutAddressBox(addressId);
  // Prefill contact info from the address only where the form is still empty.
  const a = getCheckoutAddress(addressId);
  if (a?.contactName && !form.elements.contactName.value.trim()) form.elements.contactName.value = a.contactName;
  if (a?.contactPhone && form.elements.contactPhone.value.replace(/\D/g, "").length < 10) form.elements.contactPhone.value = a.contactPhone;
  state.deliveryQuote = null;
  requestDeliveryQuote();
}

// Screen A — «عناويني»: saved addresses as radio rows + current location + add new.
function openAddressPickerModal() {
  const current = state.checkoutLocation || getUserLocationAddress();
  const selectedId = document.getElementById("checkout-address")?.value || "";
  const rows = state.customerAddresses.map(a => `
    <button type="button" class="addr-pick-item ${String(selectedId) === String(a.id) ? "checked" : ""}" data-action="pick-checkout-address" data-id="${a.id}">
      <span class="addr-pick-icon">${addressIconFor(a.label)}</span>
      <span class="addr-pick-body"><strong>${escAttr(a.label)}</strong><small>${escAttr(a.address)}${a.details ? `<br>${escAttr(a.details)}` : ""}</small>${a.contactPhone ? `<em dir="ltr">${escAttr(a.contactPhone)}</em>` : ""}</span>
      <span class="addr-pick-radio"></span>
    </button>`).join("");
  const currentRow = current ? `
    <button type="button" class="addr-pick-item ${selectedId === "current" ? "checked" : ""}" data-action="pick-checkout-address" data-id="current">
      <span class="addr-pick-icon">${icon("pin")}</span>
      <span class="addr-pick-body"><strong>موقعي الحالي</strong><small>${escAttr(current.address)}</small></span>
      <span class="addr-pick-radio"></span>
    </button>` : "";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <h2 class="addr-pick-title">عناويني</h2>
    ${(rows || currentRow) ? `<div class="addr-pick-list">${rows}${currentRow}</div>` : `
      <div class="addr-pick-empty">
        <span class="addr-pick-empty-icon">${icon("pin")}</span>
        <strong>لا يوجد أي عنوان محفوظ بعد</strong>
        <small>أضف عنوانك الأول لتتمكن من إكمال طلبك</small>
      </div>`}
    <button type="button" class="addr-pick-new" data-action="add-address"><span>+</span> عنوان جديد</button>
  `, "address-picker-modal");
}

// Screen B — «تفاصيل العنوان»: search + OSM map with a fixed center pin that
// reverse-geocodes into the same structured Turkish fields the merchant receives.
function openAddressModal(addressId = null) {
  const address = state.customerAddresses.find(item => item.id === Number(addressId));
  const profile = state.customerProfile || {};
  const s = address?.structured || {};
  const resolvedText = address?.address
    ? `${s.sokak ? s.sokak + "، " : ""}${address.address}`
    : "حرّك الخريطة لتحديد موقع مدخل البناء بدقة";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${address ? "تعديل العنوان" : "عنوان جديد"}</span>
    <h2>تفاصيل العنوان</h2>
    <form id="customer-address-form" class="modal-form addr2" data-id="${address?.id || ""}">
      <div class="addr2-search">
        ${icon("search")}
        <input type="text" id="addr2-search-input" placeholder="ابحث عن حي، شارع أو معلم قريب" autocomplete="off">
        <div class="addr2-search-results" id="addr2-search-results" hidden></div>
      </div>
      <div class="addr2-map-wrap" id="addr2-map-wrap">
        <div id="addr2-map"></div>
        <div class="addr2-map-pin">${ADDR_PIN_SVG}</div>
        <button type="button" class="addr2-locate-btn" data-action="capture-address-location" title="استخدام موقعي الحالي" aria-label="استخدام موقعي الحالي">${icon("pin")}</button>
      </div>
      <div class="addr2-resolved">
        <span class="addr2-resolved-pin">${ADDR_PIN_SVG}</span>
        <span class="addr2-resolved-text" id="addr2-resolved-text">${escAttr(resolvedText)}</span>
        <button type="button" class="addr2-edit-pencil" data-action="addr2-toggle-manual" title="تعديل يدوي">${icon("edit")}</button>
      </div>
      <input type="hidden" name="lat" value="${address?.lat || ""}">
      <input type="hidden" name="lng" value="${address?.lng || ""}">
      <div id="addr2-manual" class="addr2-manual" hidden>
        <div class="addr2-row2">
          <input name="sf_il" placeholder="المدينة (İl)" value="${escAttr(s.il || "إسطنبول")}">
          <input name="sf_ilce" placeholder="المنطقة (İlçe)" value="${escAttr(s.ilce || "")}">
        </div>
        <div class="addr2-row2">
          <input name="sf_mahalle" placeholder="المحلة (Mahalle)" value="${escAttr(s.mahalle || "")}">
          <input name="sf_sokak" placeholder="الشارع (Cadde/Sokak)" value="${escAttr(s.sokak || "")}">
        </div>
      </div>
      ${(() => { const cartStoreId = state.cart.length ? state.cart[0].storeId : null; const safaZones = cartStoreId === 50 ? (getDeliverySettings(50)?.namedZones || []) : []; const currentZone = address?.namedZone || ""; return safaZones.length ? `<div class="named-zone-picker"><p class="zone-picker-label">${icon("pin")} هل عنوانك في أحد هذه المجمعات؟ <small>سعر توصيل ثابت</small></p><div class="zone-picker-options">${safaZones.map(z => `<label class="zone-option"><input type="radio" name="namedZone" value="${escAttr(z.match[0])}" ${currentZone === z.match[0] ? "checked" : ""}><span>${z.label}</span></label>`).join("")}<label class="zone-option"><input type="radio" name="namedZone" value="" ${!currentZone ? "checked" : ""}><span>لا، عنوان عادي</span></label></div></div>` : `<input type="hidden" name="namedZone" value="${escAttr(address?.namedZone || "")}">`; })()}
      <p class="addr2-section-label">تفاصيل العنوان</p>
      <div class="addr2-row3">
        <input name="sf_bina" placeholder="رقم المبنى *" value="${escAttr(s.bina || "")}" required>
        <input name="sf_kat" placeholder="الطابق" value="${escAttr(s.kat || "")}" inputmode="numeric">
        <input name="sf_daire" placeholder="رقم الشقة *" value="${escAttr(s.daire || "")}" required>
      </div>
      <input class="addr2-field-full" name="label" placeholder="اسم العنوان (مثال: المنزل، العمل) *" value="${escAttr(address?.label || "")}" required>
      <div class="addr2-optional">
        <input name="note" placeholder="وصف إضافي للعنوان" value="${escAttr(address?.note || "")}">
        <span>اختياري</span>
      </div>
      <p class="addr2-section-label">معلومات التواصل</p>
      <div class="addr2-row2">
        <input name="contactName" placeholder="الاسم" autocomplete="name" value="${escAttr(address?.contactName ?? profile.name ?? "")}">
        <input name="contactPhone" type="tel" inputmode="tel" dir="ltr" placeholder="+90 5__ ___ __ __" value="${escAttr(address?.contactPhone ?? profile.phone ?? "")}">
      </div>
      <label class="notification-setting"><input name="isDefault" type="checkbox" ${address?.isDefault ? "checked" : ""}><span></span><div><strong>استخدامه كعنوان افتراضي</strong><small>سيظهر أولًا عند إتمام الطلب.</small></div></label>
      <button class="primary-button full" type="submit">${icon("check")} حفظ العنوان</button>
    </form>
  `, "address-modal addr2-modal");
  initAddressMapModal(address);
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
  window.DUKKANCI_TRACKING?.track("ViewContent", { ids: [product.id], value: product.price, product_id: product.id, store_id: product.storeId, store_name: store?.name });
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="product-modal-grid">
      <div class="product-gallery ${isPlaceholderImage(product.image) ? "no-image" : ""}">${isPlaceholderImage(product.image) ? productNoImageMedia(product) : `<img src="${escAttr(product.image)}" alt="${escAttr(product.name)}"><div><button class="active"><img src="${escAttr(product.image)}" alt=""></button><button><img src="${escAttr(store.image)}" alt=""></button></div>`}</div>
      <form class="product-details" id="product-form" data-id="${product.id}">
        <span class="product-breadcrumb">${esc(store.name)} · ${esc(product.category)}</span>
        <h2>${esc(product.name)}</h2>
        <div class="product-status"><span class="${product.available ? "available" : "not-available"}">${product.available ? "متوفر" : "غير متوفر"}</span><span>${icon("star")} 4.8 (42 تقييماً)</span></div>
        <p>${esc(product.description)}</p>
        <div class="modal-price">${product.priceOnRequest ? `<strong>السعر عند الطلب</strong>` : `<strong id="modal-unit-price">${money(product.price)}</strong>${product.unit ? `<span>/ ${product.unit}</span>` : ""}${(!product.options.length && product.oldPrice) ? `<del>${money(product.oldPrice)}</del>` : ""}`}</div>
        ${product.options.map((option, optionIndex) => `
          <fieldset class="option-group"><legend>${option.name}</legend><div>${option.values.map((value, valueIndex) => `<label><input type="radio" name="option-${optionIndex}" value="${valueIndex}" ${valueIndex === 0 ? "checked" : ""}><span>${value}<small>${money(product.price + (option.extra[valueIndex] || 0))}</small></span></label>`).join("")}</div></fieldset>
        `).join("")}
        ${(product.addons || []).length ? `
        <fieldset class="option-group addon-group"><legend>إضافات (اختياري)</legend><div>${product.addons.map((addon, addonIndex) => `<label><input type="checkbox" name="addon-${addonIndex}"><span>${esc(addon.name)}${addon.price ? `<small>+${money(addon.price)}</small>` : ""}</span></label>`).join("")}</div></fieldset>
        ` : ""}
        <label class="product-notes"><span>ملاحظات خاصة</span><textarea name="notes" placeholder="اكتب أي تفاصيل تهم المتجر..."></textarea></label>
        <div class="product-add-row">
          ${product.priceOnRequest ? `
          <a class="primary-button large wa-order-btn" href="${waOrderLink(product)}" target="_blank" rel="noopener" data-id="${product.storeId}">${icon("whatsapp")} اطلب عبر واتساب</a>` : `
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
  (product.addons || []).forEach((addon, index) => {
    if (form.querySelector(`input[name="addon-${index}"]`)?.checked) price += Number(addon.price) || 0;
  });
  const unitPriceEl = document.getElementById("modal-unit-price");
  if (unitPriceEl) unitPriceEl.textContent = money(price);
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
  document.getElementById("checkout-delivery-fee").textContent = pickup ? "مجاناً" : (totals.quote?.exceedsMaxDistance ? "خارج النطاق" : (totals.freeDelivery ? "مجاني 🎉" : money(delivery)));
  document.getElementById("checkout-final-total").textContent = money(Math.max(0, totals.subtotal + delivery - (totals.discount || 0) - (totals.creditApplied || 0)));
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
  // Named zones always win over distance mode — same precedence estimateDeliveryQuote()
  // already applies for the price PREVIEW shown before checkout (store/cart page). Without
  // this check here too, a store with an active/leftover named zone would show one fee in
  // the preview and silently charge the distance-computed fee instead at actual checkout.
  const previewQuote = estimateDeliveryQuote(store, address);
  const usesZone = previewQuote && previewQuote.provider === "zone";
  if (settings.mode !== "distance" || usesZone || !address?.lat || !address?.lng) {
    state.deliveryQuote = previewQuote;
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

// ─────────── Google Maps JS API inside the address modal ───────────
// Loaded lazily from Google's CDN only when the modal opens, so the main
// bundle stays untouched. The key never touches the repo — the browser
// fetches it from /api/maps-key (same GOOGLE_MAPS_API_KEY the server routes
// use), then loads the Maps JS SDK with it.
let googleMapsLoadPromise = null;
function ensureGoogleMaps() {
  if (window.google?.maps) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;
  googleMapsLoadPromise = fetch("/api/maps-key", { headers: { Accept: "application/json" } })
    .then(res => res.json())
    .then(({ key }) => new Promise((resolve, reject) => {
      if (!key) { reject(new Error("no maps key")); return; }
      const callbackName = "__dukkanciGmapsReady";
      window[callbackName] = () => { delete window[callbackName]; resolve(); };
      const js = document.createElement("script");
      js.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&language=ar&region=TR&loading=async&callback=${callbackName}`;
      js.async = true;
      js.onerror = () => { googleMapsLoadPromise = null; reject(new Error("google maps load failed")); };
      document.head.appendChild(js);
    }))
    .catch(err => { googleMapsLoadPromise = null; throw err; });
  return googleMapsLoadPromise;
}

// Reverse: full structured Turkish fields for the pinned point, via Google's
// Geocoder. TR admin levels: administrative_area_level_1=İl,
// administrative_area_level_2/sublocality_level_1=İlçe, neighborhood=Mahalle.
function pickAddressComponent(components, types) {
  for (const wanted of types) {
    const hit = components.find(c => (c.types || []).includes(wanted));
    if (hit) return hit.long_name;
  }
  return "";
}
async function googleReverseFull(lat, lng) {
  try {
    await ensureGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    const { results } = await geocoder.geocode({ location: { lat, lng } });
    if (!results?.length) return null;
    const components = results[0].address_components || [];
    const il = pickAddressComponent(components, ["administrative_area_level_1"]) || "إسطنبول";
    const ilce = pickAddressComponent(components, ["administrative_area_level_2", "sublocality_level_1"]);
    const mahalle = pickAddressComponent(components, ["neighborhood", "sublocality_level_2", "sublocality"]);
    const sokak = pickAddressComponent(components, ["route"]);
    const display = [sokak, mahalle, ilce, il].filter(Boolean).join("، ");
    return { il, ilce, mahalle, sokak, display: display || results[0].formatted_address || "" };
  } catch { return null; }
}

async function googleSearchPlaces(query) {
  try {
    await ensureGoogleMaps();
    const geocoder = new google.maps.Geocoder();
    const { results } = await geocoder.geocode({ address: query, componentRestrictions: { country: "tr" } });
    return (results || []).slice(0, 5).map(r => ({
      label: r.formatted_address,
      lat: r.geometry.location.lat(),
      lng: r.geometry.location.lng()
    }));
  } catch { return []; }
}

let addr2Map = null;          // live google.maps.Map instance while the modal is open
let addr2CommitToken = 0;     // guards overlapping reverse-geocode responses

// Reads the map center as the delivery point: fills lat/lng + the structured
// Turkish fields and the human-readable resolved line.
async function commitAddressPin() {
  const form = document.getElementById("customer-address-form");
  if (!form || !addr2Map) return;
  const center = addr2Map.getCenter();
  const lat = center.lat(), lng = center.lng();
  form.elements.lat.value = lat.toFixed(6);
  form.elements.lng.value = lng.toFixed(6);
  const textEl = document.getElementById("addr2-resolved-text");
  if (textEl) textEl.textContent = "جارٍ تحديد العنوان…";
  const token = ++addr2CommitToken;
  const info = await googleReverseFull(lat, lng);
  if (token !== addr2CommitToken || !document.getElementById("customer-address-form")) return;
  if (!info) {
    if (textEl) textEl.textContent = "تعذر جلب اسم المنطقة تلقائياً — يمكنك إدخالها يدوياً بزر التعديل";
    return;
  }
  form.elements.sf_il.value = info.il || form.elements.sf_il.value || "إسطنبول";
  if (info.ilce) form.elements.sf_ilce.value = info.ilce;
  if (info.mahalle) form.elements.sf_mahalle.value = info.mahalle;
  if (info.sokak) form.elements.sf_sokak.value = info.sokak;
  if (textEl) textEl.textContent = info.display;
}

// Boots the Google Maps map inside the open address modal and wires the search box.
async function initAddressMapModal(address) {
  const mapEl = document.getElementById("addr2-map");
  if (!mapEl) return;
  try { await ensureGoogleMaps(); } catch {
    mapEl.innerHTML = `<div class="addr2-map-fallback">تعذر تحميل الخريطة — استخدم زر تحديد موقعي أو أدخل العنوان يدوياً</div>`;
    return;
  }
  if (!document.getElementById("addr2-map") || addr2Map) return; // modal closed or already booted
  const hasFix = !!(address?.lat && address?.lng) || !!(state.userLocation?.lat);
  const start = (address?.lat && address?.lng)
    ? { lat: address.lat, lng: address.lng }
    : (state.userLocation?.lat ? { lat: state.userLocation.lat, lng: state.userLocation.lng } : { lat: 41.0122, lng: 28.976 });
  addr2Map = new google.maps.Map(mapEl, {
    center: start,
    zoom: hasFix ? 17 : 11,
    disableDefaultUI: true,
    zoomControl: true,
    gestureHandling: "greedy"
  });
  const wrap = document.getElementById("addr2-map-wrap");
  // Google fires "idle" once right after the initial render too (unlike
  // Leaflet's moveend). With a real starting fix, resolve it right away (new
  // address from the user's detected location, or refresh of an address being
  // edited) — but without one, stay at city level and wait for the customer
  // to actually aim the pin, so skip just that first idle.
  let firstIdle = true;
  addr2Map.addListener("dragstart", () => wrap?.classList.add("moving"));
  addr2Map.addListener("idle", () => {
    wrap?.classList.remove("moving");
    if (firstIdle) { firstIdle = false; if (!hasFix) return; }
    commitAddressPin();
  });
  // Search box → Google place search (debounced), pick → fly the map there.
  const searchInput = document.getElementById("addr2-search-input");
  const resultsEl = document.getElementById("addr2-search-results");
  if (searchInput && resultsEl) {
    let debounceTimer = null;
    const runSearch = async () => {
      const q = searchInput.value.trim();
      if (q.length < 3) { resultsEl.hidden = true; return; }
      const places = await googleSearchPlaces(q);
      if (!document.getElementById("addr2-search-results")) return;
      resultsEl.innerHTML = places.length
        ? places.map(p => `<button type="button" data-lat="${p.lat}" data-lng="${p.lng}">${escAttr(p.label)}</button>`).join("")
        : `<button type="button" disabled>لا نتائج — جرّب اسم الحي أو الشارع</button>`;
      resultsEl.hidden = false;
    };
    searchInput.addEventListener("input", () => { clearTimeout(debounceTimer); debounceTimer = setTimeout(runSearch, 450); });
    searchInput.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); clearTimeout(debounceTimer); runSearch(); } });
    resultsEl.addEventListener("click", e => {
      const btn = e.target.closest("button[data-lat]");
      if (!btn || !addr2Map) return;
      resultsEl.hidden = true;
      searchInput.value = "";
      addr2Map.setCenter({ lat: Number(btn.dataset.lat), lng: Number(btn.dataset.lng) });
      addr2Map.setZoom(17); // idle → commit
    });
  }
}

// The locate button inside the address modal: fly the map to the GPS fix
// (idle then commits it); if the map failed to load, save raw coords.
function captureAddressLocation() {
  captureGeolocation(location => {
    if (window.google?.maps && addr2Map) {
      addr2Map.setCenter({ lat: location.lat, lng: location.lng });
      addr2Map.setZoom(17);
    } else {
      const form = document.getElementById("customer-address-form");
      if (form) { form.elements.lat.value = location.lat; form.elements.lng.value = location.lng; }
    }
    showToast("تم تحديد نقطة التوصيل", "success");
  });
}

function captureCheckoutLocation() {
  captureGeolocation(location => {
    state.checkoutLocation = { id: "current", label: "موقعي الحالي", address: "الموقع الحالي", details: "", ...location };
    applyCheckoutAddressSelection("current");
    showToast("تم استخدام موقعك الحالي للتوصيل", "success");
    // Resolve a readable area label in the background and refresh the box.
    reverseGeocodeArea(location.lat, location.lng).then(area => {
      if (!area || !state.checkoutLocation) return;
      state.checkoutLocation.address = area;
      const box = document.getElementById("checkout-address-box");
      if (box && document.getElementById("checkout-address")?.value === "current") box.innerHTML = renderCheckoutAddressBox("current");
    });
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

// --- Auto user location (header pill + default delivery destination) ---

async function reverseGeocodeArea(lat, lng) {
  try {
    const res = await fetch(`/api/reverse-geocode?lat=${lat}&lng=${lng}`, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.area || null;
  } catch {
    return null;
  }
}

// Renders the header location pill from state.userLocation. The pill lives in
// index.html (outside #app), so it persists across render() and is updated here.
function updateLocationPill() {
  const textEl = document.getElementById("location-pill-text");
  if (!textEl) return;
  if (state.locatingUser && !state.userLocation) {
    textEl.innerHTML = "جارٍ تحديد موقعك…";
  } else if (state.userLocation) {
    textEl.innerHTML = `التوصيل إلى <strong>${escAttr(state.userLocation.area || "موقعي الحالي")}</strong>`;
  } else {
    textEl.innerHTML = "<strong>حدّد موقعك</strong>";
  }
}

// Resolves a geolocation fix into state.userLocation + area label, then
// refreshes the header and any location-based prices on screen.
async function applyUserPosition(coords, { silent = false } = {}) {
  state.locatingUser = true;
  updateLocationPill();
  const area = await reverseGeocodeArea(coords.lat, coords.lng);
  state.userLocation = { lat: coords.lat, lng: coords.lng, area };
  state.locatingUser = false;
  saveUserLocation();
  // A freshly detected location replaces a stale "current location" quote.
  if (state.deliveryQuote?.addressId === "current") state.deliveryQuote = null;
  updateLocationPill();
  render();
  if (!silent) showToast(area ? `تم تحديد موقعك: ${area}` : "تم تحديد موقعك", "success");
}

// Called by the header pill. Always prompts (per product decision: auto on load
// and on tap); the browser remembers a prior denial and won't re-prompt.
function captureUserLocation() {
  if (!navigator.geolocation) {
    showToast("تحديد الموقع غير مدعوم في هذا المتصفح");
    return;
  }
  state.locatingUser = true;
  updateLocationPill();
  navigator.geolocation.getCurrentPosition(
    position => applyUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }),
    () => {
      state.locatingUser = false;
      updateLocationPill();
      showToast("تعذّر تحديد الموقع. فعّل إذن الموقع من المتصفح وحاول مجدداً.");
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
  );
}

// Detect the location silently — used when the browser has ALREADY granted the
// geolocation permission, so no native prompt appears.
function detectLocationSilently() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    position => applyUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }, { silent: true }),
    () => { state.locatingUser = false; updateLocationPill(); },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
  );
}

// Welcome + location-consent modal. Greets the visitor as "دكانجي"
// and asks for an explicit tap before triggering the browser's location prompt,
// so the native dialog arrives with context (instead of cold on page load).
function showWelcomeLocationModal() {
  try { localStorage.setItem("dukkanci-welcomed", "1"); } catch {}
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="welcome-modal">
      <div class="welcome-modal__icon">${icon("pin")}</div>
      <h2 class="welcome-modal__title">مرحباً بك في دكانجي</h2>
      <p class="welcome-modal__sub">منصّتك للطلب من متاجر ومطاعم حيّك بسهولة. اسمح لنا بتحديد موقعك لنعرض لك المتاجر الأقرب إليك ونحسب التوصيل تلقائياً.</p>
      <div class="welcome-modal__actions">
        <button class="primary-button full large" data-action="welcome-allow-location">${icon("pin")} اسمح بتحديد موقعي</button>
        <button class="text-button" data-action="welcome-later">تصفّح بدون تحديد الموقع</button>
      </div>
      <small class="welcome-modal__note">يمكنك تغيير موقعك في أي وقت من شريط العنوان بالأعلى.</small>
    </div>
  `, "welcome-location-modal");
}

// Mobile-only "install the app" nudge. Reuses the .welcome-modal look so no new
// CSS is needed. Shown once per device — never re-shown after the visitor taps
// either button — and skipped entirely if the site is already running installed
// (standalone / iOS home-screen) or over a sensitive deep-link.
function showInstallAppModal() {
  try { localStorage.setItem("dukkanci-install-prompted", "1"); } catch {}
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="welcome-modal">
      <div class="welcome-modal__icon">${icon("download")}</div>
      <h2 class="welcome-modal__title">ثبّت تطبيق دكانجي</h2>
      <p class="welcome-modal__sub">أضف دكانجي إلى شاشتك الرئيسية لتصفّح أسرع وطلب أسهل، بدون فتح المتصفح كل مرة.</p>
      <div class="welcome-modal__actions">
        <button class="primary-button full large" data-action="install-app">${icon("download")} تثبيت التطبيق الآن</button>
        <button class="text-button" data-action="close-modal">لاحقاً</button>
      </div>
    </div>
  `, "install-app-modal");
}

function isStandaloneDisplay() {
  let standalone = !!(window.matchMedia && window.matchMedia("(display-mode: standalone)").matches);
  if (!standalone && window.navigator && window.navigator.standalone === true) standalone = true;
  return standalone;
}

// Runs after initUserLocation() so the two modals never fight over the screen:
// if the location-consent modal is showing (or already handled this visit and
// left something else open), the install nudge just waits for the next visit.
function initInstallPrompt() {
  if (isStandaloneDisplay()) return;
  if (!window.matchMedia || !window.matchMedia("(max-width: 767px)").matches) return;
  const route = parseRoute().route;
  if (route === "admin" || route === "merchant" || route === "checkout") return;
  const alreadyPrompted = (() => { try { return localStorage.getItem("dukkanci-install-prompted"); } catch { return null; } })();
  if (alreadyPrompted) return;
  setTimeout(() => {
    if (modalRoot.classList.contains("open")) return; // don't interrupt an open modal (e.g. location welcome)
    showInstallAppModal();
  }, 3500);
}

// On every page open: if the location is already authorized, resolve it
// silently; otherwise greet the visitor once and ask for consent before
// prompting. Deep-links into admin/merchant/checkout are never interrupted.
function initUserLocation() {
  updateLocationPill();
  if (!navigator.geolocation) return;
  // We already know where the visitor is (saved from a previous visit) — just
  // refresh it quietly, no welcome needed.
  if (state.userLocation) { detectLocationSilently(); return; }

  const route = parseRoute().route;
  const intrusive = route === "admin" || route === "merchant" || route === "checkout";
  const alreadyWelcomed = (() => { try { return localStorage.getItem("dukkanci-welcomed"); } catch { return null; } })();

  const decide = permState => {
    if (permState === "granted") { detectLocationSilently(); return; }
    if (permState === "denied") return; // pill stays on "حدّد موقعك"
    // "prompt" (or unknown): show the welcome consent — but only once per device
    // and never over a sensitive deep-link.
    if (!alreadyWelcomed && !intrusive) showWelcomeLocationModal();
  };

  if (navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: "geolocation" })
      .then(status => decide(status.state))
      .catch(() => decide("prompt"));
  } else {
    decide("prompt");
  }
}

function isProfileComplete() {
  const p = state.customerProfile;
  if (!p || !p.name || !p.phone) return false;
  // must have at least one address with building + apt numbers (zone or full)
  // AND a resolved delivery point (named zone, or geocoded lat/lng) — an address
  // saved without coordinates can never produce a distance-based delivery quote,
  // so it doesn't count as "complete" and the customer is routed back to fix it.
  return state.customerAddresses.some(a => a.structured?.bina && a.structured?.daire && (a.namedZone || (a.lat != null && a.lng != null)));
}

function openProfileSetupModal(pendingProductId, qty, opts, notes, addons) {
  const p = state.customerProfile || {};
  const existingAddr = state.customerAddresses[0] || {};
  const sf = existingAddr.structured || {};
  const storeId = pendingProductId ? (getProduct(pendingProductId)?.storeId) : null;
  const safaZones = storeId === 50 ? (getDeliverySettings(50)?.namedZones || []) : [];
  const currentZone = existingAddr.namedZone || "";

  const isZone = safaZones.length && !!currentZone;

  const zoneBlock = safaZones.length ? `
    <div class="named-zone-picker">
      <p class="zone-picker-label">${icon("pin")} هل عنوانك في أحد هذه المجمعات؟ <small>سعر توصيل ثابت</small></p>
      <div class="zone-picker-options">
        ${safaZones.map(z => `<label class="zone-option"><input type="radio" name="namedZone" value="${escAttr(z.match[0])}" ${currentZone === z.match[0] ? "checked" : ""}><span>${z.label}</span></label>`).join("")}
        <label class="zone-option"><input type="radio" name="namedZone" value="" ${!currentZone ? "checked" : ""}><span>عنوان آخر</span></label>
      </div>
    </div>` : `<input type="hidden" name="namedZone" value="${escAttr(currentZone)}">`;

  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <span class="section-kicker">خطوة واحدة قبل الطلب</span>
    <h2>أكمل بياناتك</h2>
    <p class="modal-sub">نحتاج اسمك ورقمك وعنوانك لإيصال الطلب إليك.</p>
    <form id="profile-setup-form" class="modal-form" data-pid="${pendingProductId || ""}" data-qty="${qty || 1}" data-opts="${escAttr(JSON.stringify(opts || []))}" data-notes="${escAttr(notes || "")}" data-addons="${escAttr(JSON.stringify(addons || []))}">
      <div class="form-grid">
        <label><span>الاسم الكامل <i class="req">*</i></span><input name="name" required value="${escAttr(p.name || "")}" placeholder="الاسم الكامل"></label>
        <label><span>رقم الواتساب <i class="req">*</i></span><input name="phone" type="tel" inputmode="tel" required dir="ltr" value="${escAttr(p.phone || "")}" placeholder="+90 555 000 00 00"></label>
      </div>
      ${zoneBlock}
      <div id="zone-address-fields" class="addr2" ${isZone ? "" : 'style="display:none"'}>
        <p class="addr2-section-label">${icon("pin")} تفاصيل المجمع</p>
        <div class="addr2-row2">
          <input name="zf_bina" value="${escAttr(sf.bina || "")}" placeholder="Bina No *">
          <input name="zf_daire" value="${escAttr(sf.daire || "")}" placeholder="Daire No *">
        </div>
      </div>
      <div id="full-address-fields" class="addr2" ${isZone ? 'style="display:none"' : ""}>
        <p class="addr2-section-label">${icon("map")} العنوان التفصيلي</p>
        <div class="addr2-row2">
          <input name="sf_il" value="${escAttr(sf.il || "İstanbul")}" placeholder="İl (المدينة)">
          <input name="sf_ilce" value="${escAttr(sf.ilce || "")}" placeholder="İlçe (المنطقة)">
        </div>
        <div class="addr2-row2">
          <input name="sf_mahalle" value="${escAttr(sf.mahalle || "")}" placeholder="Mahalle">
          <input name="sf_sokak" value="${escAttr(sf.sokak || "")}" placeholder="Cadde / Sokak">
        </div>
        <div class="addr2-row3">
          <input name="sf_bina" value="${escAttr(sf.bina || "")}" placeholder="Bina No *">
          <input name="sf_kat" value="${escAttr(sf.kat || "")}" placeholder="Kat" inputmode="numeric">
          <input name="sf_daire" value="${escAttr(sf.daire || "")}" placeholder="Daire No *">
        </div>
      </div>
      <button class="primary-button full large" type="submit">${icon("check")} حفظ وإضافة للسلة</button>
    </form>
  `, "profile-setup-modal");
}

function addToCart(productId, quantity = 1, optionSelections = [], notes = "", addonSelections = []) {
  const product = getProduct(productId);
  if (!product.available) return;
  if (product.priceOnRequest) { showToast("هذا المنتج بسعر عند الطلب — تواصل عبر واتساب"); return; }
  // Gate: require complete profile + address before allowing cart
  if (!isProfileComplete()) { openProfileSetupModal(productId, quantity, optionSelections, notes, addonSelections); return; }
  // Subscription gate: a store whose subscription lapsed stays visible but cannot
  // take new orders (subscription_active=false set by the Whop webhook / cron).
  const productStore = getStore(product.storeId);
  if (productStore && productStore.subscriptionActive === false) {
    showToast("هذا المتجر لا يستقبل طلبات حالياً — الاشتراك منتهٍ");
    return;
  }
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
  const addonLabels = [];
  (product.addons || []).forEach((addon, index) => {
    if (!addonSelections.includes(index)) return;
    extra += Number(addon.price) || 0;
    addonLabels.push(`+${esc(addon.name)}`);
  });
  const sortedAddons = [...addonSelections].sort((a, b) => a - b);
  const key = `${product.id}-${optionSelections.join("-")}-${sortedAddons.join(",")}-${notes}`;
  const existing = state.cart.find(item => item.key === key);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ key, productId: product.id, storeId: product.storeId, quantity, finalPrice: product.price + extra, optionsText: [...optionLabels, ...addonLabels].join("، "), optionSelections: [...optionSelections], addonSelections: sortedAddons, notes });
  saveState();
  updateCartBadges();
  window.DUKKANCI_TRACKING?.track("AddToCart", { ids: [product.id], value: (product.price + extra) * quantity, product_id: product.id, store_id: product.storeId });
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

function openLoginModal(mode = "signin") {
  const signup = mode === "signup";
  // Secondary, flag-gated path: WhatsApp OTP login (kept for when the service is live).
  const phoneBlock = AUTH_FLAGS.phoneOtpLogin ? `
    <div class="or-line"><span>أو عبر واتساب</span></div>
    <form id="login-form"><label class="input-label"><span>رقم واتساب</span><div class="phone-input"><span dir="ltr">+90</span><input name="phone" type="tel" required placeholder="555 000 00 00" dir="ltr"></div></label><p class="auth-error" id="login-error" hidden></p><button class="secondary-button full" type="submit">${icon("whatsapp")} إرسال رمز التحقق</button></form>` : "";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>${signup ? "أنشئ حسابك في دكانجي" : "أهلاً بك في دكانجي"}</h2><p>${signup ? "أنشئ حساباً ببريدك الإلكتروني لمتابعة طلباتك وحفظ عناوينك." : "سجّل دخولك لمتابعة طلباتك وحفظ عناوينك ومفضلاتك."}</p>
    <button class="google-button" data-action="google-login"><b>G</b> المتابعة باستخدام Google</button>
    <div class="auth-email-section">
      <div class="or-line"><span>أو بالبريد الإلكتروني</span></div>
      <form id="email-auth-form" data-mode="${signup ? "signup" : "signin"}">
        ${signup ? `<label class="input-label"><span>الاسم</span><input name="name" autocomplete="name" placeholder="الاسم الكامل"></label>` : ""}
        <label class="input-label"><span>البريد الإلكتروني</span><input name="email" type="email" inputmode="email" autocomplete="email" required dir="ltr" placeholder="you@example.com"></label>
        <label class="input-label"><span>كلمة المرور</span><div class="pw-input"><input name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" required dir="ltr" placeholder="${signup ? "٦ أحرف على الأقل" : "••••••••"}"><button type="button" class="pw-toggle" data-action="toggle-password" aria-label="إظهار كلمة المرور">${icon("eye")}</button></div></label>
        <p class="auth-error" id="email-auth-error" role="alert" hidden></p>
        ${signup ? "" : `<button type="button" class="text-button auth-forgot" data-action="forgot-password">نسيت كلمة المرور؟</button>`}
        <button class="primary-button full large" type="submit">${signup ? "إنشاء الحساب" : "تسجيل الدخول"}</button>
      </form>
      <p class="auth-switch">${signup ? `لديك حساب بالفعل؟ <button type="button" class="text-button" data-action="auth-switch-signin">سجّل الدخول</button>` : `ليس لديك حساب؟ <button type="button" class="text-button" data-action="auth-switch-signup">أنشئ حساباً</button>`}</p>
    </div>
    ${phoneBlock}
    <small class="auth-terms">بالمتابعة أنت توافق على الشروط وسياسة الخصوصية.</small>
  `, "auth-modal");
}

function openJoinModal() {
  const jp = (state.siteSettings && state.siteSettings.joinPage) || {};
  const jTitle = jp.title || "انضم إلى دكانجي";
  const jSub = jp.subtitle || "ابدأ باستقبال طلبات جديدة من عملاء منطقتك.";
  const jNote = jp.note || "يُنشأ متجرك ويُراجَع من الإدارة قبل أن يظهر للعملاء. أثناء المراجعة تدخل لوحة التحكم لإكمال البيانات وإضافة منتجاتك.";
  const loggedIn = !!state.user;
  // When not signed in, we create an email+password account as part of the flow
  // (the store is bound to that account). Signed-in users skip this section.
  const googleG = `<svg class="google-g" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>`;
  const accountSection = loggedIn ? "" : `
      <div class="join-account">
        <p class="join-account__hint">${icon("shield")} لإنشاء متجرك ننشئ لك حساباً بالبريد الإلكتروني للدخول إلى لوحة التحكم.</p>
        <button type="button" class="google-button" data-action="join-google">${googleG} المتابعة باستخدام Google</button>
        <div class="or-line"><span>أو بالبريد الإلكتروني</span></div>
        <div class="form-grid">
          <label><span>البريد الإلكتروني <i class="req">*</i></span><input name="email" type="email" inputmode="email" autocomplete="email" dir="ltr" placeholder="you@example.com"></label>
          <label><span>كلمة المرور <i class="req">*</i></span><div class="pw-input"><input name="password" type="password" autocomplete="new-password" dir="ltr" placeholder="٦ أحرف على الأقل"><button type="button" class="pw-toggle" data-action="toggle-password" aria-label="إظهار كلمة المرور">${icon("eye")}</button></div></label>
        </div>
      </div>
      <p class="join-section-label">${icon("store")} بيانات المتجر</p>`;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="join-modal-head">
      <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
      <h2>${escAttr(jTitle)}</h2>
      <p>${escAttr(jSub)}</p>
    </div>
    <form id="join-form" class="join-form" novalidate>
      ${accountSection}
      <div class="form-grid">
        <label><span>اسم المتجر الحقيقي <i class="req">*</i></span><input name="storeName" required placeholder="مثال: مطعم البركة"></label>
        <label><span>تصنيف المتجر <i class="req">*</i></span><select name="category" required><option value="">اختر التصنيف</option>${storeCategoryNames().map(c => `<option>${esc(c)}</option>`).join("")}</select></label>
        <label class="wide phone-row">
          <div class="phone-row__top">
            <span>رقم واتساب للتواصل <i class="req">*</i></span>
            <input name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr" placeholder="+90 555 000 00 00">
          </div>
          <small class="field-hint">رقم تواصل المتجر، وعليه تصلك إشعارات الطلبات.</small>
        </label>
        <label><span>اسم صاحب المتجر</span><input name="ownerName" autocomplete="name" placeholder="الاسم الكامل"></label>
        <label><span>عنوان المتجر</span><input name="address" placeholder="الحي، الشارع، رقم البناء"></label>
        <label class="wide file-field">
          <span>شعار المتجر (اختياري)</span>
          <span class="file-upload">
            <input name="logo" type="file" accept="image/*" class="file-upload__input">
            <span class="file-upload__visual">${icon("upload")}<span class="file-upload__text">اختر صورة من جهازك</span></span>
          </span>
          <small class="field-hint">يساعد عملاءك على التعرّف على متجرك. يمكنك إضافته لاحقاً من اللوحة.</small>
        </label>
      </div>
      <p class="auth-error" id="join-error" role="alert" hidden></p>
      <div class="review-note">${icon("shield")} <span><strong>يُراجَع متجرك قبل الظهور</strong><small>${escAttr(jNote)}</small></span></div>
      <button class="primary-button full large" type="submit">${icon("store")} ${loggedIn ? "إنشاء المتجر والدخول" : "إنشاء الحساب والمتجر"}</button>
    </form>
  `, "join-modal");
}

// Validate a Turkish mobile number (with or without +90 / leading 0). Returns the
// normalized digits (without country code) or null if it doesn't look valid.
function normalizeTrMobile(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("0090")) d = d.slice(4);
  if (d.startsWith("90")) d = d.slice(2);
  d = d.replace(/^0+/, "");
  // Turkish mobiles are 10 digits starting with 5 (e.g. 5XX XXX XX XX).
  return /^5\d{9}$/.test(d) ? d : null;
}

// Read the store fields out of the join form, validating each. On error it shows
// a message in #join-error, focuses the offending field, and returns null.
function readJoinStoreFields(form) {
  const f = new FormData(form);
  const errEl = document.getElementById("join-error");
  const fail = (msg, name) => {
    if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
    const el = form.querySelector(`[name="${name}"]`); if (el) el.focus();
    return null;
  };
  const name = (f.get("storeName") || "").toString().trim();
  const category = (f.get("category") || "").toString().trim();
  const owner = (f.get("ownerName") || "").toString().trim();
  const phoneRaw = (f.get("phone") || "").toString().trim();
  const address = (f.get("address") || "").toString().trim();
  if (!name) return fail("أدخل اسم المتجر.", "storeName");
  if (!category) return fail("اختر تصنيف المتجر.", "category");
  const trMobile = normalizeTrMobile(phoneRaw);
  if (!trMobile) return fail("أدخل رقم موبايل تركي صحيح (يبدأ بـ 5 ويتكوّن من ١٠ أرقام).", "phone");
  if (errEl) errEl.hidden = true;
  return { name, category, owner, phoneRaw: "+90" + trMobile, phoneDigits: trMobile, address };
}

// Build + register a store from collected join data, bind ownership, and drop the
// owner into their dashboard. Shared by the immediate and the resumed-after-auth paths.
function createStoreFromJoinData(data) {
  const norm = s => (s || "").replace(/\D/g, "");
  const existing = stores.find(s => norm(s.phone) === data.phoneDigits || norm(s.whatsapp) === data.phoneDigits);
  if (existing) {
    closeModal(); state._merchantResolved = false; navigate("merchant");
    showToast("يوجد متجر بهذا الرقم — سجّل الدخول للوصول إليه", "");
    return;
  }
  const newId = Math.max(0, ...stores.map(s => Number(s.id) || 0)) + 1;
  const store = {
    id: newId, name: data.name, slug: autoStoreSlug(data.name, newId), category: data.category, ownerName: data.owner,
    logo: data.name.charAt(0) || "م", image: "/assets/photos/store-market.jpg", coverImage: "/assets/photos/store-market.jpg",
    logoImage: data.logoDataUrl || "", rating: 0, reviews: 0, newStore: true, delivery: 35, minOrder: 0,
    time: "", distance: 0, location: undefined, mapUrl: "", open: true, featured: false,
    hasOffer: false, offer: "", description: "", address: data.address, phone: data.phoneRaw, whatsapp: data.phoneRaw,
    email: (state.user && state.user.email) || "",
    website: "", sourceUrl: "", hours: "", areas: data.address ? [data.address] : [],
    fulfillment: "توصيل واستلام", subscription: "احترافي", orderCount: 0, officialStore: false,
    approvalStatus: "pending" // hidden from customers until the admin approves it
  };
  stores.push(store);
  pushStoreCloud(store);
  bindStoreToUser(newId); // link ownership so RLS lets this merchant manage it
  if (data.password) syncOwnerCredentials(newId, data.phoneRaw || data.phoneDigits, data.password);
  state.deliverySettings[newId] = { mode: "fixed", fixedFee: 35, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 60 };
  state.merchantStores = [...(state.merchantStores || []), store];
  state._merchantResolved = true;
  state.merchantAuth = { storeId: newId, phone: data.phoneDigits, userId: state.user && state.user.id };
  state.merchantStoreId = newId; state.merchantTab = "store"; state._merchantOrdersFetched = true;
  saveState(); closeModal(); navigate("merchant");
  openJoinSuccessModal(store);
}

// Persist the in-progress store data so it survives an email-confirmation redirect
// (a full page reload) and is created once the account is authenticated.
function stashPendingJoin(data) {
  state._pendingJoin = data;
  try { localStorage.setItem("dukkanci-pending-join", JSON.stringify(data)); } catch (e) {}
}

// True if a store-creation is waiting to be finalized (in memory or persisted).
function hasPendingJoin() {
  if (state._pendingJoin) return true;
  try { return !!localStorage.getItem("dukkanci-pending-join"); } catch (e) { return false; }
}

// Create the stashed store once the user is authenticated (called from SIGNED_IN
// and on session restore). No-op if there's nothing pending or no session yet.
function finalizePendingJoin() {
  let data = state._pendingJoin;
  if (!data) { try { data = JSON.parse(localStorage.getItem("dukkanci-pending-join") || "null"); } catch (e) { data = null; } }
  if (!data || !state.user) return;
  state._pendingJoin = null;
  try { localStorage.removeItem("dukkanci-pending-join"); } catch (e) {}
  createStoreFromJoinData(data);
}

// Post-creation onboarding: confirm success and give a clear next-steps checklist
// instead of a vanishing toast.
function openJoinSuccessModal(store) {
  showModal(`
    <div class="success-animation">${icon("check")}</div>
    <h2>تم إنشاء متجرك 🎉</h2>
    <p><strong>${escAttr(store.name)}</strong> قيد المراجعة من إدارة دكانجي وسيظهر للعملاء بعد الموافقة. أكمل هذه الخطوات الآن من لوحتك:</p>
    <ul class="onboarding-checklist">
      <li>${icon("store")} <span>أضف شعار وصورة المتجر</span></li>
      <li>${icon("box")} <span>أضف أول منتجاتك بالأسعار والصور</span></li>
      <li>${icon("bike")} <span>اضبط مناطق وأجور التوصيل</span></li>
      <li>${icon("shield")} <span>فعّل اشتراكك لاستقبال الطلبات</span></li>
    </ul>
    <div class="modal-actions"><button class="primary-button" data-action="close-modal">${icon("check")} ابدأ بإكمال متجري</button></div>
  `, "success-modal");
}

// Handle the join form submit. Validates store fields; if the user isn't signed in
// yet, creates an email+password account first and resumes store creation after
// authentication (no dead-end). Reads the optional logo file inline.
async function submitJoinForm(form) {
  const btn = form.querySelector('button[type="submit"]');
  // Disabled up front (setBtnBusy is nest-safe — signUpWithEmail() below also
  // calls it and shares the same restore label) so a rapid double-submit can't
  // race the async logo-resize step or fire createStoreFromJoinData() twice.
  const restore = setBtnBusy(btn, "جارٍ الإنشاء...");
  const fields = readJoinStoreFields(form);
  if (!fields) { restore(); return; } // validation already surfaced the error + focused the field
  const errEl = document.getElementById("join-error");
  // Optional logo → downscaled data URL (kept small for storage).
  const logoFile = form.querySelector('input[name="logo"]')?.files?.[0];
  if (logoFile) {
    try { fields.logoDataUrl = await readImageFileResized(logoFile, 400, 0.85); }
    catch (e) { /* ignore a bad image — the store can add it later */ }
  }
  // Already signed in → create immediately.
  if (state.user) { createStoreFromJoinData(fields); return; }
  // Not signed in → create the account, then resume via SIGNED_IN / session restore.
  const f = new FormData(form);
  const email = (f.get("email") || "").toString().trim();
  const password = (f.get("password") || "").toString();
  if (!isValidEmail(email)) { restore(); if (errEl) { errEl.textContent = "أدخل بريداً إلكترونياً صحيحاً لإنشاء حسابك."; errEl.hidden = false; } form.querySelector('[name="email"]')?.focus(); return; }
  if (!password || password.length < 6) { restore(); if (errEl) { errEl.textContent = "اختر كلمة مرور من ٦ أحرف على الأقل."; errEl.hidden = false; } form.querySelector('[name="password"]')?.focus(); return; }
  // Carried through to createStoreFromJoinData so the SAME password also lands in
  // store_credentials (see syncOwnerCredentials) — otherwise the admin-issued
  // phone+password login mode ends up checking a different, auto-generated one.
  fields.password = password;
  stashPendingJoin(fields);
  const result = await signUpWithEmail(email, password, fields.owner ? { full_name: fields.owner } : {}, {
    errEl, btn, onConfirmNeeded: openCheckEmailModal
  });
  // On immediate session, finalizePendingJoin runs from the SIGNED_IN handler.
  // On "confirm", the store is created after the user confirms + logs in.
  // On false (error), drop the stash so a later unrelated login doesn't create it.
  if (result === false) { state._pendingJoin = null; try { localStorage.removeItem("dukkanci-pending-join"); } catch (e) {} }
}

function openOrderManager(orderId) {
  const order = state.orders.find(item => item.id === orderId);
  if (!order) return;
  const statuses = ["طلب جديد", "تم القبول", "قيد التجهيز", "جاهز للاستلام", "خرج للتوصيل", "مكتمل", "مرفوضة"];
  if (order.status && !statuses.includes(order.status)) statuses.unshift(order.status);
  const waNum = (order.customerPhone || "").replace(/\D/g, "");
  const isDelivery = order.fulfillment !== "pickup";
  const items = Array.isArray(order.lineItems) ? order.lineItems : [];
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">الطلب <span dir="ltr">${order.id}</span></span><h2>إدارة الطلب</h2>
    <div class="order-manager-summary"><span><small>العميل</small><strong>${escAttr(order.customer)}</strong></span><span><small>الإجمالي</small><strong>${money(order.total)}</strong></span><span><small>النوع</small><strong>${isDelivery ? "توصيل" : "استلام"}</strong></span></div>
    <div class="order-contact">
      ${order.payment ? `<div class="order-contact__row order-contact__row--payment">${icon("wallet")}<span><strong>طريقة الدفع:</strong> ${escAttr(order.payment)}</span></div>${/تحويل بنكي/.test(order.payment) ? `<div class="order-contact__row order-contact__row--muted">${icon("info")}<span>أرسل رقم الحساب للعميل وأكّد استلام الحوالة قبل تجهيز الطلب.</span></div>` : ""}${/بطاقة/.test(order.payment) ? `<div class="order-contact__row order-contact__row--muted">${icon("info")}<span>جهّز جهاز نقاط البيع (POS) مع المندوب لتحصيل المبلغ عند التسليم.</span></div>` : ""}` : ""}
      ${order.customerPhone ? `<div class="order-contact__row">${icon("phone")}<span dir="ltr">${escAttr(order.customerPhone)}</span>${waNum ? `<a class="order-wa-btn" href="https://wa.me/${waNum}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة العميل</a>` : ""}</div>` : `<div class="order-contact__row order-contact__row--muted">${icon("phone")}<span>لا يوجد رقم تواصل للعميل</span></div>`}
      ${isDelivery ? `<div class="order-contact__row">${icon("pin")}<span>${order.address ? escAttr(order.address) : "لم يُحدَّد عنوان"}${order.addressDetails ? ` — ${escAttr(order.addressDetails)}` : ""}</span></div>${order.deliveryDetails?.roundTripKm != null ? `<div class="order-contact__row">${icon("bike")}<span>المسافة ذهاباً وإياباً ${formatDistance(order.deliveryDetails.roundTripKm)} · رسوم ${money(order.deliveryDetails.fee || 0)}</span></div>` : ""}` : `<div class="order-contact__row">${icon("store")}<span>استلام من المتجر</span></div>`}
    </div>
    <div class="order-items-block">
      <strong class="order-items-title">${icon("box")} تفاصيل الطلب (${items.reduce((s, i) => s + (i.qty || 1), 0) || order.items})</strong>
      ${items.length ? `<ul class="order-items-list">${items.map(i => `<li><span class="oi-qty">${(i.qty || 1).toLocaleString("ar")}×</span><span class="oi-name">${escAttr(i.name)}${i.options ? `<small>${escAttr(i.options)}</small>` : ""}${i.notes ? `<small class="oi-note">${icon("edit")} ${escAttr(i.notes)}</small>` : ""}</span><b>${money(i.price)}</b></li>`).join("")}</ul>` : `<p class="order-items-empty">تفاصيل الأصناف غير متوفرة لهذا الطلب.</p>`}
    </div>
    ${order.substitution ? `<div class="order-customer-note"><strong>${icon("info")} سياسة البدائل</strong><p>${escAttr(order.substitution)}</p></div>` : ""}
    ${order.notes ? `<div class="order-customer-note"><strong>${icon("edit")} ملاحظة العميل</strong><p>${escAttr(order.notes)}</p></div>` : ""}
    <label class="input-label"><span>تحديث حالة الطلب</span><select id="order-status-select">${statuses.map(status => `<option ${status === order.status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
    <label class="input-label"><span>ملاحظة للعميل (اختياري)</span><textarea id="order-status-note" placeholder="اكتب رسالة قصيرة تظهر للعميل..."></textarea></label>
    <button class="primary-button full" data-action="save-order-status" data-id="${order.id}">${icon("check")} حفظ التحديث</button>
  `, "order-modal");
}

// Complete HTML escape — safe for both text and attribute contexts. Use this on
// EVERY dynamic value (store/product/merchant/DB input) interpolated into HTML.
function escAttr(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
// Short alias used by the render helpers.
const esc = escAttr;

// Read an uploaded image, downscale it (so it stays light for storage), return a JPEG data URL.
function readImageFileResized(file, maxDim = 900, quality = 0.82) {
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
        try { resolve(canvas.toDataURL("image/jpeg", quality)); }
        catch (e) { resolve(reader.result); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function openProductForm(id, defaultCategory) {
  const editing = id ? getProduct(id) : null;
  // In admin panel use the store currently being viewed; in merchant panel use the logged-in store.
  const store = editing
    ? (getStore(editing.storeId) || getMerchantStore())
    : (state.route === "admin" && state.adminProductStoreId ? getStore(state.adminProductStoreId) : getMerchantStore());
  const cats = storeProductCategories(store.id);
  const presetCat = editing ? editing.category : (defaultCategory || state.merchantProductCategory || state.adminProductCategory || cats[0] || "");
  // Merchant-facing variant rows show the FULL price per weight/size (never a
  // price delta — that math confused store owners). Internally still stored as
  // {name, values[], extra[]} with extra = delta from the base price, so
  // existing products and the customer-facing render code don't change at all.
  const basePriceForVariants = editing ? Number(editing.price) || 0 : 0;
  const variantRows = (editing && editing.options && editing.options[0] && editing.options[0].values)
    ? editing.options[0].values.map((v, i) => ({ name: v, price: basePriceForVariants + (editing.options[0].extra?.[i] || 0) }))
    : [];
  const variantRowHtml = (row = { name: "", price: "" }) => `
    <div class="variant-row">
      <input name="variantName" placeholder="مثال: 1 كغ أو كبير" value="${escAttr(row.name)}">
      <input name="variantPrice" type="number" min="0" step="1" inputmode="numeric" placeholder="السعر الكامل (ل.ت)" value="${row.price === "" ? "" : row.price}">
      <button type="button" class="table-action danger" data-action="remove-variant-row" title="حذف هذا الوزن/الحجم">${icon("close")}</button>
    </div>`;
  // Add-ons are optional, multi-select extras (e.g. "extra cheese") — distinct
  // from variants above, which are a required single-choice group (size/weight).
  const addonRows = editing && Array.isArray(editing.addons) ? editing.addons : [];
  const addonRowHtml = (row = { name: "", price: "" }) => `
    <div class="variant-row">
      <input name="addonName" placeholder="مثال: جبنة إضافية" value="${escAttr(row.name)}">
      <input name="addonPrice" type="number" min="0" step="1" inputmode="numeric" placeholder="السعر الإضافي (ل.ت)" value="${row.price === "" ? "" : row.price}">
      <button type="button" class="table-action danger" data-action="remove-addon-row" title="حذف هذه الإضافة">${icon("close")}</button>
    </div>`;
  const hasImg = editing && editing.image && !isPlaceholderImage(editing.image);
  // An existing uploaded image is a huge base64 data URI — showing that raw
  // text in the URL field is unreadable noise, so keep it in the hidden
  // imageData carrier (already visible via the thumbnail above) and leave the
  // URL field for pasted links only.
  const editingImageIsData = hasImg && /^data:/.test(editing.image);
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${store.name}</span>
    <h2>${editing ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
    ${editing ? `<div class="product-edit-current">
      <div class="product-edit-current__img">${hasImg ? `<img src="${escAttr(editing.image)}" alt="">` : icon("box")}</div>
      <div class="product-edit-current__info">
        <strong>${esc(editing.name)}</strong>
        <span>${money(editing.price)}</span>
        <small>${esc(editing.category || "")}${editing.unit ? ` · ${esc(editing.unit)}` : ""}</small>
      </div>
    </div>` : ""}
    <form class="modal-form" id="merchant-product-form" data-id="${editing ? editing.id : ""}" data-store-id="${store.id}">
      <div class="form-grid">
        <label class="input-label wide"><span>اسم المنتج <i class="req">*</i></span><input name="name" required value="${editing ? escAttr(editing.name) : ""}"></label>
        <label class="input-label"><span>السعر (ل.ت) <i class="req">*</i></span><input name="price" type="number" min="0" step="1" inputmode="numeric" required value="${editing ? editing.price : ""}"></label>
        <label class="input-label"><span>الوحدة</span><input name="unit" placeholder="كيلو / قطعة / علبة" value="${editing ? escAttr(editing.unit || "") : ""}"></label>
        <label class="input-label"><span>التصنيف <i class="req">*</i></span>
          <select name="category" required>
            ${cats.map(c => `<option value="${escAttr(c)}" ${c === presetCat ? "selected" : ""}>${esc(c)}</option>`).join("")}
            <option value="__new__">＋ إضافة تصنيف جديد...</option>
          </select>
        </label>
        <div class="input-label wide">
          <span>الأوزان/الأحجام المختلفة (اختياري)</span>
          <div id="variant-rows" class="variant-rows">${variantRows.map(variantRowHtml).join("")}</div>
          <button type="button" class="secondary-button compact" data-action="add-variant-row">${icon("plus")} إضافة وزن/حجم آخر</button>
          <small class="field-hint">اتركه فارغاً إن كان للمنتج سعر واحد. لكل وزن/حجم أدخل اسمه والسعر الكامل الخاص به (وليس فرق السعر).</small>
        </div>
        <div class="input-label wide">
          <span>إضافات اختيارية (اختياري)</span>
          <div id="addon-rows" class="variant-rows">${addonRows.map(addonRowHtml).join("")}</div>
          <button type="button" class="secondary-button compact" data-action="add-addon-row">${icon("plus")} إضافة خيار جديد (مثل: صوص إضافي)</button>
          <small class="field-hint">إضافات يختارها العميل قبل إضافة المنتج للسلة (مثل صوص إضافي أو جبنة زيادة) — كل إضافة تُضاف لسعر المنتج عند اختيارها.</small>
        </div>
        <div class="input-label wide image-input-group">
          <span>صورة المنتج</span>
          <div class="image-upload-row">
            <div class="image-preview-wrap">
              <div class="image-preview" id="product-image-preview">${hasImg ? `<img src="${escAttr(editing.image)}" alt="">` : icon("box")}</div>
              ${hasImg ? `<button type="button" class="image-clear-btn" data-action="clear-product-image" title="حذف الصورة">${icon("close")}</button>` : ""}
            </div>
            <div class="image-upload-controls">
              <label class="upload-tile">${icon("upload")}<span>رفع صورة جديدة</span><input type="file" id="product-image-file" accept="image/*" hidden></label>
              <input name="image" placeholder="أو الصق رابط صورة (https://...)" value="${editing && !editingImageIsData ? escAttr(editing.image) : ""}" dir="ltr">
              <button type="button" class="ai-enhance-btn" data-action="ai-enhance-image">${icon("stars")} تحسين الصورة بالذكاء الاصطناعي</button>
            </div>
          </div>
          <input type="hidden" name="imageData" value="${editingImageIsData ? escAttr(editing.image) : ""}">
          <small class="field-hint ai-enhance-hint">ارفع الصورة أولاً ثم اضغط «تحسين» — يُزيل الخلفية ويُحسّن الجودة تلقائياً.</small>
        </div>
        <label class="input-label wide"><span>الوصف</span><textarea name="description" placeholder="وصف مختصر للمنتج">${editing ? escAttr(editing.description || "") : ""}</textarea></label>
        ${isHomeKitchenStore(store) ? `<label class="input-label wide">
          <span>وقت التحضير المطلوب</span>
          <select name="advanceHours">
            <option value="0" ${!editing || !editing.advanceHours ? "selected" : ""}>بدون — يُحضَّر فوراً</option>
            <option value="24" ${editing && Number(editing.advanceHours) === 24 ? "selected" : ""}>يتطلب الطلب قبل 24 ساعة على الأقل</option>
            <option value="48" ${editing && Number(editing.advanceHours) === 48 ? "selected" : ""}>يتطلب الطلب قبل 48 ساعة على الأقل</option>
          </select>
          <small class="field-hint">لمنتجات المطبخ المنزلي التي تحتاج تحضيراً مسبقاً — سيُمنع العميل من اختيار موعد تسليم أقرب من هذه المدة.</small>
        </label>` : ""}
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
  const product = getProduct(numId);
  if (!product) { closeModal(); return; }
  const name = product.name;
  const btn = document.querySelector('[data-action="confirm-delete-product"]');
  const btnLabel = btn ? btn.innerHTML : "";
  if (btn) { btn.disabled = true; btn.innerHTML = "جارٍ الحذف..."; }
  // Wait for the server-side delete to actually succeed before touching local
  // state/UI — otherwise a failed request would still make the product vanish
  // from the merchant's dashboard while it stays live and orderable for customers.
  Promise.resolve(deleteProductCloud(numId)).then(ok => {
    if (ok === false) {
      if (btn) { btn.disabled = false; btn.innerHTML = btnLabel; }
      showToast("تعذّر حذف المنتج من الخادم، تحقّق من الاتصال وحاول مجدداً");
      return;
    }
    const productIndex = products.findIndex(p => p.id === numId);
    if (productIndex >= 0) products.splice(productIndex, 1);
    const allIndex = allProducts.findIndex(p => p.id === numId);
    if (allIndex >= 0) allProducts.splice(allIndex, 1);
    refreshPublishedProducts();
    deleteProductLocal(numId);
    closeModal();
    render();
    showToast(`تم حذف "${name}"`, "success");
  });
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

// Admin complaint detail + status/reply editor (G4). Was previously a dead
// mockup whose "save" button just closed the modal with a canned toast and
// never wrote anywhere — now backed by complaint-update (service-role key).
function openComplaintDetail(id) {
  const c = (state._adminComplaints || []).find(x => x.id === id);
  if (!c) return;
  const fmtDate = iso => { try { return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso)); } catch (e) { return ""; } };
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">شكوى ${esc(c.id)}</span>
    <h2>${esc(c.subject || "")}</h2>
    <div class="order-manager-summary"><span><small>العميل</small><strong>${esc(c.customer || "—")}</strong></span><span><small>ضد متجر</small><strong>${esc(c.store || c.order_id || "شكوى عامة")}</strong></span><span><small>تاريخ الإرسال</small><strong>${fmtDate(c.created_at)}</strong></span></div>
    <div class="complaint-message"><strong>الرسالة</strong><p>${esc(c.body || "")}</p></div>
    <form class="modal-form" id="admin-complaint-form" data-id="${escAttr(c.id)}">
      <label class="input-label"><span>تحديث حالة الشكوى</span><select name="status">
        <option value="شكوى جديدة" ${c.status === "شكوى جديدة" ? "selected" : ""}>شكوى جديدة</option>
        <option value="قيد المراجعة" ${c.status === "قيد المراجعة" ? "selected" : ""}>قيد المراجعة</option>
        <option value="تم الحل" ${c.status === "تم الحل" ? "selected" : ""}>تم الحل</option>
      </select></label>
      <label class="input-label"><span>رد على العميل</span><textarea name="response" placeholder="اكتب رد الإدارة...">${esc(c.admin_response || "")}</textarea></label>
      <button class="primary-button full" type="submit">${icon("check")} حفظ</button>
    </form>
  `, "complaint-modal");
}

function exportCsv(kind) {
  let rows = [];
  if (kind === "stores") rows = [["المتجر", "التصنيف", "التقييم", "رسوم التوصيل"], ...stores.map(store => [store.name, store.category, store.rating, deliveryPriceLabel(store)])];
  else if (kind === "customers") rows = [["العميل", "الهاتف", "عدد الطلبات", "إجمالي الإنفاق", "عدد المتاجر", "العنوان"],
    ...aggregateCustomers().map(c => [c.name, c.phone, c.count, c.total, c.stores.size, c.address])];
  else if (kind === "complaints") rows = [["الرقم", "العنوان", "الحالة"], ...(state.customerComplaints || []).map(c => [c.id, c.subject, c.status])];
  else if (kind === "whatsapp") rows = [["المتجر", "معرّف المتجر", "نقرات واتساب", "زوّار فريدون", "مشاهدات المتجر", "معدل النقر %"],
    ...(((state.adminMarketing || {}).report || {}).whatsapp_by_store || []).map(s =>
      [s.name, s.store_id, s.whatsapp_clicks, s.unique_visitors, s.store_views, s.store_views > 0 ? ((s.whatsapp_clicks / s.store_views) * 100).toFixed(1) : "0"])];
  else rows = [["رقم الطلب", "العميل", "المتجر", "الإجمالي", "الحالة", "تاريخ الطلب", "ساعة الطلب"], ...state.orders.map(order => [order.id, order.customer, getStore(order.storeId)?.name || "-", order.total, order.status, formatOrderDateOnly(order.createdAt), formatOrderTimeOnly(order.createdAt)])];
  const csv = "\uFEFF" + rows.map(row => row.map(cell => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `dukkanci-${kind}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("تم تجهيز ملف التصدير", "success");
}

// ── Merchant products: CSV export/import + preview + price history (Increment 2) ──

// Export this merchant's products to a CSV they can edit in Excel and re-import.
// The «المعرّف» (id) column is the join key on import; header names are matched.
function exportMerchantProductsCsv() {
  const store = getMerchantStore();
  const list = allProducts.filter(p => p.storeId === store.id);
  if (!list.length) { showToast("لا توجد منتجات للتصدير"); return; }
  const header = ["المعرّف", "الاسم", "التصنيف", "الوحدة", "السعر", "السعر قبل الخصم", "متوفر"];
  const rows = [header, ...list.map(p => [
    p.id, p.name, p.category || "", p.unit || "",
    Number(p.price) || 0, p.oldPrice ? Number(p.oldPrice) : "",
    p.available !== false ? "نعم" : "لا"
  ])];
  const csv = "﻿" + rows.map(r => r.map(c => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  link.download = `dukkanci-${storeParam(store)}-products.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  showToast("تم تجهيز ملف المنتجات", "success");
}

// Minimal RFC-4180-ish CSV parser (quoted fields, escaped "", CRLF).
function parseCsv(text) {
  const rows = []; let row = [], field = "", inQ = false;
  text = String(text || "").replace(/^﻿/, "");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

// Parse an uploaded CSV, match rows to THIS store's products by id, and show a
// confirmation of the price/availability/discount changes BEFORE applying any.
async function handleMerchantCsvImport(file) {
  if (!file) return;
  const store = getMerchantStore();
  let text = "";
  try { text = await file.text(); } catch (e) { showToast("تعذّر قراءة الملف"); return; }
  const rows = parseCsv(text).filter(r => r.some(c => (c || "").trim() !== ""));
  if (rows.length < 2) { showToast("الملف فارغ أو غير صالح"); return; }
  const header = rows[0].map(h => (h || "").trim());
  const col = names => header.findIndex(h => names.includes(h));
  const iId = col(["المعرّف", "id", "ID"]);
  const iPrice = col(["السعر", "price"]);
  const iOld = col(["السعر قبل الخصم", "old_price"]);
  const iAvail = col(["متوفر", "available"]);
  if (iId < 0 || iPrice < 0) { showToast("العمودان «المعرّف» و«السعر» مطلوبان في الملف"); return; }
  const num = v => Math.round(Number(String(v == null ? "" : v).replace(/[^\d.]/g, "")) || 0);
  const changes = [];
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const id = Number((cells[iId] || "").trim());
    if (!id) continue;
    const p = getProduct(id);
    if (!p || p.storeId !== store.id) continue; // only this store's own products
    const ch = {};
    const newPrice = num(cells[iPrice]);
    if (newPrice > 0 && newPrice !== Number(p.price)) ch.price = newPrice;
    if (iOld >= 0) { const o = num(cells[iOld]); const cur = Number(p.oldPrice) || 0; if (o !== cur) ch.oldPrice = o > 0 ? o : null; }
    if (iAvail >= 0) { const av = /^(1|نعم|true|yes|متوفر|y)$/i.test((cells[iAvail] || "").trim()); if (av !== (p.available !== false)) ch.available = av; }
    if (Object.keys(ch).length) changes.push({ id, name: p.name, from: p, ch });
  }
  if (!changes.length) { showToast("لا توجد تغييرات في الملف — كل القيم مطابقة", ""); return; }
  state._csvImport = changes;
  const preview = changes.slice(0, 40).map(c => {
    const parts = [];
    if (c.ch.price != null) parts.push(`السعر: ${money(c.from.price)} ← ${money(c.ch.price)}`);
    if (c.ch.oldPrice !== undefined) parts.push(c.ch.oldPrice ? `سعر قبل الخصم: ${money(c.ch.oldPrice)}` : "إزالة سعر الخصم");
    if (c.ch.available != null) parts.push(c.ch.available ? "→ متوفر" : "→ غير متوفر");
    return `<li><strong>${esc(c.name)}</strong><span>${esc(parts.join(" · "))}</span></li>`;
  }).join("");
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <h2>${icon("upload")} مراجعة التحديث بالجملة</h2>
    <p>سيتم تحديث <strong>${changes.length.toLocaleString("ar")}</strong> منتجاً. راجع التغييرات ثم اعتمدها.</p>
    <ul class="csv-change-list">${preview}</ul>
    ${changes.length > 40 ? `<p class="field-hint">…و${(changes.length - 40).toLocaleString("ar")} منتجاً آخر.</p>` : ""}
    <div class="form-actions">
      <button class="secondary-button" data-action="close-modal">إلغاء</button>
      <button class="primary-button" data-action="apply-csv-import">${icon("check")} اعتماد التحديث</button>
    </div>
  `, "csv-import-modal");
}

// Apply the reviewed CSV changes sequentially through the SAME secure save path
// used by manual edits (pushProductCloud → save-product), so each price change is
// also server-logged to product_price_history.
async function applyCsvImport() {
  const changes = state._csvImport || [];
  if (!changes.length) { closeModal(); return; }
  const btn = document.querySelector('[data-action="apply-csv-import"]');
  if (btn) { btn.disabled = true; btn.innerHTML = "جارٍ التحديث..."; }
  let ok = 0, fail = 0;
  for (const c of changes) {
    const p = getProduct(c.id);
    if (!p) { fail++; continue; }
    const result = await pushProductCloud({ ...p, ...c.ch });
    if (result.ok) { Object.assign(p, c.ch); upsertCatalogProduct(p); saveProductOverride(p.id, c.ch); ok++; }
    else fail++;
    if (btn) btn.innerHTML = `جارٍ التحديث... (${(ok + fail).toLocaleString("ar")}/${changes.length.toLocaleString("ar")})`;
  }
  state._csvImport = null;
  closeModal();
  showToast(fail ? `تم تحديث ${ok.toLocaleString("ar")} منتجاً، وتعذّر ${fail.toLocaleString("ar")}` : `تم تحديث ${ok.toLocaleString("ar")} منتجاً بنجاح`, fail ? "" : "success");
  render();
}

// Preview a product exactly as a customer sees its card on the storefront.
function openProductPreview(id) {
  const p = getProduct(id);
  if (!p) { showToast("تعذّر العثور على المنتج"); return; }
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">معاينة كما يظهر للعميل</span>
    <h2>${esc(p.name)}</h2>
    <div class="product-preview-wrap">${productCard(p)}</div>
    <p class="field-hint">${isShownOnStore(p) ? "هذا المنتج معروض حالياً في متجرك." : (isPlaceholderImage(p.image) ? "المنتج مخفي لأنه بلا صورة — أضف صورة ليظهر للعملاء." : "هذا المنتج مخفي حالياً.")}</p>
  `, "product-preview-modal");
}

// ── Store reviews modals: submit (verified-purchase) + read individual reviews ──
function openRateStoreModal(storeId) {
  const store = getStore(storeId);
  const elig = state.reviewEligibility[storeId];
  if (!store || !elig || !elig.hasReviewable) return;
  state._rateStore = { storeId, orderId: elig.orderId, stars: 0, comment: "" };
  showModal(renderRateStoreModal(), "rate-store-modal");
}
function renderRateStoreModal() {
  const r = state._rateStore;
  const store = getStore(r.storeId);
  return `
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${esc(store.name)}</span>
    <h2>قيّم تجربتك</h2>
    <div class="star-picker">
      ${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star-picker__star ${n <= r.stars ? "active" : ""}" data-action="set-rate-star" data-value="${n}" aria-label="${n} نجوم">${icon("star")}</button>`).join("")}
    </div>
    <form id="store-review-form">
      <label class="input-label"><span>تعليقك (اختياري)</span><textarea name="comment" rows="4" placeholder="شاركنا تجربتك مع ${escAttr(store.name)}...">${esc(r.comment || "")}</textarea></label>
      <div class="form-actions">
        <button type="button" class="secondary-button" data-action="close-modal">إلغاء</button>
        <button type="submit" class="primary-button" ${r.stars ? "" : "disabled"}>${icon("check")} إرسال التقييم</button>
      </div>
    </form>
  `;
}
async function openStoreReviewsModal(storeId) {
  const store = getStore(storeId);
  if (!store) return;
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${esc(store.name)}</span>
    <h2>${store.rating} ${icon("star")} <small>من ${store.reviews} تقييم</small></h2>
    <div class="review-list" id="store-reviews-list"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ التحميل…</p></div></div>
  `, "store-reviews-modal");
  const rows = await loadStoreReviews(storeId);
  const el = document.getElementById("store-reviews-list");
  if (!el) return; // modal was closed before the fetch resolved
  el.innerHTML = rows.length ? rows.map(rv => `
    <div class="review-item">
      <div class="review-item__head">
        <span class="review-item__stars">${icon("star")} ${rv.rating}</span>
        <strong>${esc(rv.customer_name || "عميل دكانجي")}</strong>
        <small>${formatOrderDate(rv.created_at)}</small>
      </div>
      ${rv.comment ? `<p>${esc(rv.comment)}</p>` : ""}
    </div>
  `).join("") : `<p class="muted-note">لا توجد تقييمات بعد.</p>`;
}

// Fetch + show a product's recent price changes (server: product-price-history).
async function openPriceHistory(id) {
  const p = getProduct(id);
  if (!p) { showToast("تعذّر العثور على المنتج"); return; }
  showModal(`<button class="modal-close" data-action="close-modal">${icon("close")}</button><span class="section-kicker">سجل الأسعار</span><h2>${esc(p.name)}</h2><div class="price-history-body"><div class="empty-managed"><span class="delivery-loader"></span><p>جارٍ التحميل…</p></div></div>`, "price-history-modal");
  const store = getMerchantStore();
  const headers = {};
  if (state.adminKey) headers["x-admin-token"] = state.adminKey;
  if (state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
  let history = [];
  try {
    const r = await fetch(`/api/notify-order?action=product-price-history&productId=${p.id}&storeId=${store.id}`, { headers });
    const data = await r.json().catch(() => ({}));
    history = Array.isArray(data.history) ? data.history : [];
  } catch (e) { /* show empty state below */ }
  const body = document.querySelector(".price-history-body");
  if (!body) return;
  if (!history.length) {
    body.innerHTML = `<div class="empty-managed">${icon("chart")}<p>لا توجد تغييرات سعر مسجّلة بعد. سيظهر هنا كل تعديل للسعر من الآن فصاعداً.</p></div>`;
    return;
  }
  const fmt = iso => { try { return new Date(iso).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" }); } catch (e) { return ""; } };
  body.innerHTML = `<ul class="price-history-list">${history.map(h => {
    const up = Number(h.new_price) > Number(h.old_price);
    return `<li><span class="ph-date">${fmt(h.created_at)}</span><span class="ph-change ${up ? "up" : "down"}">${money(h.old_price)} ← ${money(h.new_price)}</span><span class="ph-src">${h.source === "admin" ? "الإدارة" : "المتجر"}</span></li>`;
  }).join("")}</ul>`;
}

// Internal-link navigation via History API (handles data-route nav + plain #/... anchors)
document.addEventListener("click", event => {
  const a = event.target.closest("a[href]");
  if (!a) return;
  const href = a.getAttribute("href");
  if (!href || a.target === "_blank" || /^(https?:|tel:|mailto:|wa\.me)/i.test(href)) return;
  if (href.startsWith("#")) {
    const routeName = href.replace(/^#/, "") || "home";
    const knownRoutes = new Set(["home", "join", "stores", "offers", "regions", "store", "product", "category", "orders", "merchant", "admin", "checkout", "about", "contact", "faq", "terms", "dalil"]);
    if (!knownRoutes.has(routeName)) return; // let browser handle unknown hashes (footer links, anchors)
    event.preventDefault(); navigate(routeName); return;
  }
  // Standalone static pages (served as their own HTML, not SPA routes) must do a
  // real navigation — don't let the client router swallow them into renderHome.
  if (/^\/(merchants|features|privacy|gizlilik)(\/|\?|$)/i.test(href)) return;
  if (href.startsWith("/") && !href.startsWith("//") && !/\.[a-z0-9]+(\?|$)/i.test(href)) { event.preventDefault(); navigate(href); }
});

// Managed-banner click counter — a listener of its own, deliberately NOT folded
// into the [data-action] dispatcher below. Banners linking to a category or an
// external URL render as plain <a href> with no data-action at all, so a hook
// inside that dispatcher would silently miss their clicks and under-report their
// CTR. This one fires for every banner variant (button, route link, external).
document.addEventListener("click", event => {
  const el = event.target.closest("[data-banner-id]");
  if (!el) return;
  trackBannerEvent(el.dataset.bannerId, el.dataset.bannerPlacement, "click");
}, true);

document.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "open-cart") openCart();
  // ── Customer notification centre ──
  if (action === "open-notifications") { loadCustomerNotifications(true); openNotificationsModal(); }
  if (action === "notif-mark-all") markAllNotificationsRead();
  if (action === "notif-open") openNotificationTarget(target.dataset.id, target.dataset.link);
  if (action === "ask-dukkanci-quick-prompt") { state.askDukkanci.message = target.dataset.prompt; render(); }
  if (action === "ask-dukkanci-toggle-dessert") { state.askDukkanci.includeDessert = !state.askDukkanci.includeDessert; render(); }
  if (action === "ask-dukkanci-toggle-drinks") { state.askDukkanci.includeDrinks = !state.askDukkanci.includeDrinks; render(); }
  if (action === "ask-dukkanci-add-bundle") askDukkanciAddBundleToCart(target.dataset.tier);
  if (action === "ask-dukkanci-skip-question") submitAskDukkanciChatReply(target.closest("form"), true);
  if (action === "close-drawers") closeDrawers();
  if (action === "close-modal") closeModal();
  if (action === "open-store") {
    state.storeProductFilter = "الكل";
    state.storeProductSearch = "";
    closeModal();
    closeDrawers();
    const s = getStore(target.dataset.id);
    navigate(`store/${s ? storeParam(s) : target.dataset.id}`);
  }
  if (action === "open-product") openProductModal(target.dataset.id);
  if (action === "quick-add") {
    const product = getProduct(target.dataset.id);
    (product.options.length || (product.addons || []).length) ? openProductModal(product.id) : addToCart(product.id);
  }
  if (action === "favorite") {
    const key = target.dataset.key;
    state.favorites = state.favorites.includes(key) ? state.favorites.filter(item => item !== key) : [...state.favorites, key];
    saveState();
    target.classList.toggle("active");
    showToast(target.classList.contains("active") ? "تمت الإضافة إلى المفضلة" : "تمت الإزالة من المفضلة", "success");
  }
  if (action === "category") {
    const catName = target.dataset.category;
    state.storeFilter = catName;
    state.search = "";
    const slug = (typeof CATEGORY_TEXT_TO_SLUG !== "undefined") && CATEGORY_TEXT_TO_SLUG[catName];
    navigate(slug ? `category/${slug}` : "stores");
  }
  if (action === "toggle-most-ordered") {
    const id = Number(target.dataset.id);
    const ids = new Set([...MOST_ORDERED_PRODUCTS]);
    if (ids.has(id)) ids.delete(id); else ids.add(id);
    MOST_ORDERED_PRODUCTS = ids;
    saveContentSetting("mostOrdered", { ids: [...ids] });
    showToast(ids.has(id) ? "أُضيف إلى «الأكثر طلباً اليوم»" : "أُزيل من «الأكثر طلباً اليوم»", "success");
  }
  if (action === "store-filter") { state.storeFilter = target.dataset.category; render(); }
  if (action === "offers-filter") { state.offersCategory = target.dataset.category; render(); }
  if (action === "admin-cat-filter") {
    state.adminProductCategory = target.dataset.cat || null;
    render();
  }
  if (action === "merchant-cat-filter") {
    state.merchantProductCategory = target.dataset.cat || null;
    render();
  }
  if (action === "product-category") {
    const category = target.dataset.category;
    // A pill can represent several merged raw product.category values at once (see
    // buildStoreCategoryPlan) — data-raw-categories carries that set as JSON so this
    // DOM-level filter still matches every card that belongs to the merged bucket.
    let rawCats = null;
    if (target.dataset.rawCategories) {
      try { rawCats = JSON.parse(target.dataset.rawCategories); } catch (_) { rawCats = null; }
    }
    state.storeProductFilter = category;
    state.storeProductSearch = "";
    // DOM-level filter — no re-render, no scroll-to-top
    document.querySelectorAll(".store-product-filters button").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });
    const searchInput = document.getElementById("store-product-search");
    if (searchInput) searchInput.value = "";
    document.querySelector(".store-search-clear")?.style && (document.querySelector(".store-search-clear").style.display = "none");
    const grid = document.getElementById("store-products-grid");
    const countEl = document.getElementById("store-products-count");
    if (grid) {
      let visible = 0;
      const total = grid.querySelectorAll("article.product-card").length;
      grid.querySelectorAll("article.product-card").forEach(card => {
        const show = category === "الكل" || (rawCats ? rawCats.includes(card.dataset.category) : card.dataset.category === category);
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (countEl) countEl.textContent = category === "الكل" ? `${total} منتجاً` : `${visible} من ${total} منتجاً`;
    }
  }
  if (action === "clear-store-search") {
    state.storeProductSearch = "";
    render();
  }
  if (action === "run-search") {
    state.search = document.getElementById("hero-search").value.trim();
    state.storeFilter = "الكل";
    if (state.search) window.DUKKANCI_TRACKING?.track("search", { search_term: state.search });
    navigate("stores");
  }
  if (action === "quick-chip") {
    state.search = target.dataset.term || target.textContent.trim();
    state.storeFilter = "الكل";
    if (state.search) window.DUKKANCI_TRACKING?.track("search", { search_term: state.search });
    navigate("stores");
  }
  if (action === "run-store-search") {
    state.search = document.getElementById("stores-search").value.trim();
    if (state.search) window.DUKKANCI_TRACKING?.track("search", { search_term: state.search });
    render();
  }
  if (action === "clear-search") {
    // × inside the hero/stores search box: wipe the current query and results.
    state.search = "";
    const input = target.closest(".hero-search, .listing-search")?.querySelector('input[type="search"]');
    if (input) input.value = "";
    render();
    setTimeout(() => (document.getElementById("stores-search") || document.getElementById("hero-search"))?.focus(), 0);
  }
  if (action === "voice-search") startVoiceSearch(target);
  // ─── «دليل دكانجي» (/dalil) ───
  if (action === "dalil-region") {
    if (!state.dalil) dalilStateFromUrl();
    const slug = target.dataset.slug || "";
    state.dalil.region = state.dalil.region === slug ? "" : slug;
    dalilSyncUrl(); render();
  }
  if (action === "dalil-category") {
    if (!state.dalil) dalilStateFromUrl();
    const slug = target.dataset.slug || "";
    state.dalil.category = state.dalil.category === slug ? "" : slug;
    dalilSyncUrl(); render();
  }
  if (action === "dalil-toggle") {
    if (!state.dalil) dalilStateFromUrl();
    const key = target.dataset.key;
    if (key === "openNow" || key === "delivery") { state.dalil[key] = !state.dalil[key]; dalilSyncUrl(); render(); }
  }
  if (action === "dalil-run-search") {
    if (!state.dalil) dalilStateFromUrl();
    state.dalil.q = (document.getElementById("dalil-search")?.value || "").trim();
    if (state.dalil.q) window.DUKKANCI_TRACKING?.track("search", { search_term: state.dalil.q, search_context: "dalil" });
    dalilSyncUrl(); render();
  }
  if (action === "dalil-clear-search") {
    if (!state.dalil) dalilStateFromUrl();
    state.dalil.q = "";
    const input = document.getElementById("dalil-search");
    if (input) input.value = "";
    dalilSyncUrl(); render();
    setTimeout(() => document.getElementById("dalil-search")?.focus(), 0);
  }
  if (action === "dalil-compare") {
    if (!state.dalil) dalilStateFromUrl();
    const id = Number(target.dataset.id);
    const chosen = state.dalil.compare || [];
    if (chosen.includes(id)) state.dalil.compare = chosen.filter(x => x !== id);
    else if (chosen.length >= 3) { showToast("يمكن مقارنة 3 متاجر كحد أقصى — أزل متجراً أولاً", "error"); return; }
    else state.dalil.compare = [...chosen, id];
    // على صفحة المقارنة نفسها تُحدَّث ids في الرابط؛ في الدليل يكفي إعادة الرسم.
    if (parseRoute().id === "compare") {
      if (state.dalil.compare.length >= 2) { history.replaceState({}, "", `/dalil/compare?ids=${state.dalil.compare.join(",")}`); render(); }
      else navigate("/dalil");
    } else render();
  }
  if (action === "dalil-compare-remove") {
    if (!state.dalil) dalilStateFromUrl();
    const id = Number(target.dataset.id);
    state.dalil.compare = (state.dalil.compare || []).filter(x => x !== id);
    if (state.dalil.compare.length >= 2) { history.replaceState({}, "", `/dalil/compare?ids=${state.dalil.compare.join(",")}`); render(); }
    else navigate("/dalil");
  }
  if (action === "dalil-compare-go") {
    const ids = ((state.dalil && state.dalil.compare) || []).slice(0, 3);
    if (ids.length >= 2) navigate(`/dalil/compare?ids=${ids.join(",")}`);
    else showToast("اختر متجرين على الأقل للمقارنة", "error");
  }
  if (action === "dalil-compare-clear") {
    if (state.dalil) state.dalil.compare = [];
    render();
  }
  if (action === "apply-coupon") applyCouponCode(document.getElementById("coupon-input")?.value, target);
  if (action === "remove-coupon") removeCoupon();
  if (action === "apply-referral") applyReferralCode(document.getElementById("referral-input")?.value, target);
  if (action === "copy-referral") {
    const code = target.dataset.code || "";
    if (navigator.clipboard && code) navigator.clipboard.writeText(code).then(() => showToast("تم نسخ الكود", "success")).catch(() => {});
  }
  if (action === "copy-bank") {
    const details = target.dataset.details || "";
    if (navigator.clipboard && details) navigator.clipboard.writeText(details).then(() => showToast("تم نسخ بيانات الحساب", "success")).catch(() => showToast("تعذّر النسخ"));
  }
  if (action === "toggle-credit") { state.useCredit = !state.useCredit; render(); }
  if (action === "create-group") openCreateGroupModal(Number(target.dataset.id));
  if (action === "share-group") {
    const link = target.dataset.link || "";
    if (navigator.share) { navigator.share({ title: "طلب جماعي على دكانجي", url: link }).catch(() => {}); }
    else if (navigator.clipboard && link) navigator.clipboard.writeText(link).then(() => showToast("تم نسخ رابط الدعوة", "success")).catch(() => {});
  }
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
    window.DUKKANCI_TRACKING?.track("InitiateCheckout", { ids: state.cart.map(i => i.productId), value: t.subtotal, count: state.cart.length });
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
  if (action === "login") { if (state.user) navigate("orders"); else openLoginModal(); }
  if (action === "confirm-receipt") {
    const order = (state.myOrders || state.orders || []).find(o => o.id === target.dataset.id);
    if (order) {
      order.status = "مكتمل";
      pushOrderCloud(order);
      saveState();
      render();
      showToast("شكراً! تم تأكيد استلام طلبك.", "success");
    }
  }
  if (action === "google-login") signInWithGoogle();
  if (action === "auth-switch-signup") openLoginModal("signup");
  if (action === "auth-switch-signin") openLoginModal("signin");
  if (action === "toggle-password") {
    const wrap = target.closest(".pw-input");
    const inp = wrap && wrap.querySelector("input");
    if (inp) { inp.type = inp.type === "password" ? "text" : "password"; target.classList.toggle("is-on", inp.type === "text"); }
  }
  if (action === "forgot-password") {
    const form = target.closest("form");
    const email = form && form.querySelector('input[name="email"]') ? form.querySelector('input[name="email"]').value : "";
    sendPasswordReset(email, { errEl: document.getElementById("email-auth-error"), btn: target });
  }
  if (action === "resend-otp") {
    // Login OTP now rides our Meta WhatsApp sender (same as checkout), not the
    // Supabase phone provider.
    sendOrderOtpRequest(target.dataset.phone).then(r =>
      showToast(r && r.ok ? "تم إرسال الرمز مجدداً" : "تعذّر إعادة الإرسال", r && r.ok ? "success" : ""));
  }
  if (action === "resend-order-otp") resendOrderOtp(target.dataset.phone);
  if (action === "paste-otp") {
    const form = target.closest("form");
    const input = form && form.querySelector("input[name='token'], input[name='code']");
    if (!input) { /* noop */ }
    else if (!navigator.clipboard || !navigator.clipboard.readText) {
      showToast("المتصفح لا يدعم اللصق التلقائي، أدخل الرمز يدوياً");
    } else {
      navigator.clipboard.readText().then(txt => {
        const digits = (String(txt || "").match(/\d/g) || []).join("");
        if (digits.length < 4) { showToast("لا يوجد رمز في الحافظة، انسخه من واتساب أولاً"); return; }
        const len = input.maxLength > 0 ? input.maxLength : 6;
        input.value = digits.slice(0, len);
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.focus();
        if (input.value.length >= len && typeof form.requestSubmit === "function") form.requestSubmit();
      }).catch(() => showToast("يرجى نسخ الرمز من واتساب أولاً ثم الضغط على الزر"));
    }
  }
  if (action === "logout") signOutUser();
  if (action === "join-merchant") openJoinModal();
  if (action === "join-google") {
    // Stash the store fields, then sign in with Google. After the redirect back,
    // SIGNED_IN → finalizePendingJoin creates the store.
    const form = document.getElementById("join-form");
    const fields = form ? readJoinStoreFields(form) : null;
    if (!fields) return;
    const logoFile = form && form.querySelector('input[name="logo"]')?.files?.[0];
    if (logoFile) {
      readImageFileResized(logoFile, 400, 0.85).then(
        d => { fields.logoDataUrl = d; stashPendingJoin(fields); signInWithGoogle(); },
        () => { stashPendingJoin(fields); signInWithGoogle(); }
      );
      return;
    }
    stashPendingJoin(fields);
    signInWithGoogle();
  }
  if (action === "account-tab") { state.accountTab = target.dataset.tab; render(); }
  if (action === "customer-order-details") openCustomerOrderDetails(target.dataset.id);
  if (action === "reorder") reorderCustomerOrder(target.dataset.id);
  if (action === "confirm-reorder") applyCustomerReorder(target.dataset.id);
  if (action === "add-address") openAddressModal();
  if (action === "edit-address") openAddressModal(target.dataset.id);
  if (action === "open-address-picker") openAddressPickerModal();
  if (action === "pick-checkout-address") { applyCheckoutAddressSelection(target.dataset.id); closeModal(); }
  if (action === "addr2-toggle-manual") { const m = document.getElementById("addr2-manual"); if (m) m.hidden = !m.hidden; }
  if (action === "capture-address-location") captureAddressLocation();
  if (action === "use-current-location") captureCheckoutLocation();
  if (action === "capture-store-location") captureStoreLocation();
  if (action === "clear-product-image") {
    const form = target.closest("form");
    const preview = document.getElementById("product-image-preview");
    if (form) { form.elements.image.value = ""; if (form.elements.imageData) form.elements.imageData.value = ""; }
    if (preview) preview.innerHTML = icon("box");
    target.remove();
  }
  if (action === "clear-store-cover") {
    const form = target.closest("form");
    const preview = document.getElementById("store-cover-preview");
    if (form && form.elements.coverImage) form.elements.coverImage.value = "";
    if (preview) preview.innerHTML = "";
  }
  if (action === "add-variant-row") {
    const rows = document.getElementById("variant-rows");
    if (rows) {
      rows.insertAdjacentHTML("beforeend", `
        <div class="variant-row">
          <input name="variantName" placeholder="مثال: 1 كغ أو كبير">
          <input name="variantPrice" type="number" min="0" step="1" inputmode="numeric" placeholder="السعر الكامل (ل.ت)">
          <button type="button" class="table-action danger" data-action="remove-variant-row" title="حذف هذا الوزن/الحجم">${icon("close")}</button>
        </div>`);
      rows.lastElementChild.querySelector('input[name="variantName"]').focus();
    }
  }
  if (action === "remove-variant-row") target.closest(".variant-row")?.remove();
  if (action === "add-addon-row") {
    const rows = document.getElementById("addon-rows");
    if (rows) {
      rows.insertAdjacentHTML("beforeend", `
        <div class="variant-row">
          <input name="addonName" placeholder="مثال: جبنة إضافية">
          <input name="addonPrice" type="number" min="0" step="1" inputmode="numeric" placeholder="السعر الإضافي (ل.ت)">
          <button type="button" class="table-action danger" data-action="remove-addon-row" title="حذف هذه الإضافة">${icon("close")}</button>
        </div>`);
      rows.lastElementChild.querySelector('input[name="addonName"]').focus();
    }
  }
  if (action === "remove-addon-row") target.closest(".variant-row")?.remove();
  if (action === "ai-enhance-image") {
    const form = target.closest("form");
    if (!form) return;
    const imageData = form.elements.imageData?.value || "";
    const imageUrl = (form.elements.image?.value || "").trim();
    if (!imageData && !imageUrl) { showToast("ارفع الصورة أولاً ثم اضغط تحسين", ""); return; }
    const productName = (form.elements.name?.value || "").trim();
    const preview = document.getElementById("product-image-preview");
    const imageInput = form.elements.image;
    target.disabled = true;
    target.innerHTML = `⏳ جارٍ التحسين...`;
    const body = imageData ? { imageData, name: productName } : { imageUrl, name: productName };
    const enhanceHeaders = { "Content-Type": "application/json" };
    if (state.adminKey) enhanceHeaders["x-admin-token"] = state.adminKey;
    if (state.merchantPwAuth && state.merchantPwAuth.token) enhanceHeaders["x-merchant-token"] = state.merchantPwAuth.token;
    const withEnhanceAuth = enhanceHeaders["x-admin-token"] || enhanceHeaders["x-merchant-token"] || !window.supabaseClient
      ? Promise.resolve(enhanceHeaders)
      : window.supabaseClient.auth.getSession().then(({ data }) => {
          const tok = data && data.session && data.session.access_token;
          if (tok) enhanceHeaders["x-sb-token"] = tok;
          return enhanceHeaders;
        }).catch(() => enhanceHeaders);
    withEnhanceAuth.then(headers => fetch("/api/enhance-image", {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }))
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          if (imageInput) imageInput.value = data.url;
          if (form.elements.imageData) form.elements.imageData.value = "";
          if (preview) preview.innerHTML = `<img src="${data.url}" alt="">`;
          showToast("تم تحسين الصورة بنجاح ✓", "success");
        } else {
          showToast(data.error || "تعذّر تحسين الصورة", "");
        }
      })
      .catch(() => showToast("خطأ في الاتصال بالذكاء الاصطناعي", ""))
      .finally(() => {
        target.disabled = false;
        target.innerHTML = `${icon("stars")} تحسين الصورة بالذكاء الاصطناعي`;
      });
  }
  if (action === "add-store-category") {
    const storeId = Number(target.dataset.id);
    const store = getStore(storeId);
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <span class="section-kicker">${store ? escAttr(store.name) : ""}</span>
      <h2>إضافة تصنيف جديد</h2>
      <form id="add-cat-form" data-store-id="${storeId}" class="form-grid">
        <label class="input-label" style="grid-column:1/-1"><span>اسم التصنيف <i class="req">*</i></span>
          <input name="catName" required placeholder="مثال: منتجات عضوية" list="existing-cats-list">
          <datalist id="existing-cats-list">${storeProductCategories(storeId).map(c => `<option value="${escAttr(c)}"></option>`).join("")}</datalist>
        </label>
        <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ التصنيف</button>
      </form>
    `, "");
  }
  if (action === "add-zone") {
    const list = document.getElementById("named-zones-list");
    if (list) {
      const idx = list.querySelectorAll(".named-zone-row").length;
      list.querySelector(".zones-empty-hint")?.remove();
      list.insertAdjacentHTML("beforeend", renderZoneRow({ label: "", match: [], fee: 0 }, idx));
    }
  }
  if (action === "remove-zone") {
    const row = target.closest(".named-zone-row");
    if (row) {
      row.remove();
      document.querySelectorAll(".named-zone-row").forEach((r, i) => {
        r.dataset.zone = i;
        r.querySelector(".zone-label").name = `zone-label-${i}`;
        r.querySelector(".zone-match").name = `zone-match-${i}`;
        r.querySelector("input[type=number]").name = `zone-fee-${i}`;
        r.querySelector("[data-action=remove-zone]").dataset.zone = i;
      });
    }
  }
  if (action === "toggle-zone-editor") {
    const id = target.dataset.id;
    const editor = document.getElementById(`zone-editor-${id}`);
    if (editor) editor.style.display = editor.style.display === "none" ? "" : "none";
  }
  if (action === "add-zone-admin") {
    const id = target.dataset.id;
    const list = document.getElementById(`named-zones-list-${id}`);
    if (list) {
      const idx = list.querySelectorAll(".named-zone-row").length;
      list.querySelector(".zones-empty-hint")?.remove();
      list.insertAdjacentHTML("beforeend", renderZoneRow({ label: "", match: [], fee: 0 }, idx));
    }
  }
  if (action === "save-zones-admin") {
    const storeId = Number(target.dataset.id);
    const list = document.getElementById(`named-zones-list-${storeId}`);
    if (!list) return;
    const zones = [];
    list.querySelectorAll(".named-zone-row").forEach((row, i) => {
      const label = (row.querySelector(".zone-label")?.value || "").trim();
      const match = (row.querySelector(".zone-match")?.value || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const fee = Math.max(0, Number(row.querySelector("input[type=number]")?.value) || 0);
      if (label && match.length) zones.push({ label, match, fee });
    });
    saveNamedZonesCloud(storeId, zones);
    showToast(`تم حفظ مناطق التوصيل لـ ${getStore(storeId)?.name || storeId}`, "success");
  }
  if (action === "toggle-category-editor") {
    const id = target.dataset.id;
    const editor = document.getElementById(`category-editor-${id}`);
    if (editor) editor.style.display = editor.style.display === "none" ? "" : "none";
  }
  if (action === "preview-category-settings") {
    const storeId = Number(target.dataset.id);
    const scope = target.dataset.scope;
    const store = getStore(storeId);
    const box = document.querySelector(`#category-settings-${storeId}-${scope} .category-settings-preview`);
    if (!store || !box) return;
    const settings = readCategoryOverridesFromDOM(storeId, scope);
    const existing = (store.categorySettings && typeof store.categorySettings === "object") ? store.categorySettings : {};
    const hypothetical = { ...store, categorySettings: { ...existing, [scope]: settings } };
    const allStoreProducts = filterHiddenCategoryProducts(hypothetical, products.filter(p => p.storeId === storeId));
    const plan = buildStoreCategoryPlan(hypothetical, allStoreProducts);
    box.innerHTML = plan.length
      ? `<strong>معاينة الترتيب (غير محفوظ بعد):</strong><div class="store-product-filters">${plan.map(b => `<button type="button" disabled>${esc(b.label)}<span>${b.products.length}</span></button>`).join("")}</div>`
      : `<p class="muted-note">لا توجد تصنيفات ظاهرة بهذه الإعدادات — كل المنتجات مخفية.</p>`;
  }
  if (action === "save-category-settings") {
    const storeId = Number(target.dataset.id);
    const scope = target.dataset.scope;
    const settings = readCategoryOverridesFromDOM(storeId, scope);
    const headers = { "Content-Type": "application/json" };
    if (scope === "admin" && state.adminKey) headers["x-admin-token"] = state.adminKey;
    if (scope === "merchant" && state.merchantPwAuth && state.merchantPwAuth.token) headers["x-merchant-token"] = state.merchantPwAuth.token;
    fetch("/api/notify-order?action=save-store-categories", {
      method: "POST", headers, body: JSON.stringify({ storeId, settings })
    }).then(async r => {
      if (r.status === 401 || r.status === 403) {
        if (scope === "merchant") handleMerchantSessionExpired(); else if (state.adminKey) lockAdmin();
        throw new Error("unauthorized");
      }
      if (!r.ok) throw new Error(`request failed (${r.status})`);
      return r.json().catch(() => ({}));
    }).then(data => {
      const store = getStore(storeId);
      if (store && data && data.categorySettings) store.categorySettings = data.categorySettings;
      showToast(`تم حفظ تصنيفات ${getStore(storeId)?.name || storeId}`, "success");
    }).catch(e => {
      if (e.message !== "unauthorized") showToast("تعذّر حفظ التصنيفات، تحقّق من الاتصال", "error");
    });
  }
  if (action === "default-address") {
    state.customerAddresses = state.customerAddresses.map(address => ({ ...address, isDefault: address.id === Number(target.dataset.id) }));
    saveState(); syncAddressesToCloud(); render(); showToast("تم تحديث العنوان الافتراضي", "success");
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
    saveState(); syncAddressesToCloud(); closeModal(); render(); showToast("تم حذف العنوان", "success");
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
  if (action === "export-merchant-products") exportMerchantProductsCsv();
  if (action === "preview-product") openProductPreview(target.dataset.id);
  if (action === "price-history") openPriceHistory(target.dataset.id);
  if (action === "open-rate-store") openRateStoreModal(Number(target.dataset.id));
  if (action === "open-store-reviews") openStoreReviewsModal(Number(target.dataset.id));
  if (action === "set-rate-star") {
    const ta = document.querySelector('#store-review-form textarea[name="comment"]');
    if (ta) state._rateStore.comment = ta.value;
    state._rateStore.stars = Number(target.dataset.value);
    showModal(renderRateStoreModal(), "rate-store-modal");
  }
  if (action === "apply-csv-import") applyCsvImport();
  if (action === "merchant-image-filter") { state.merchantImageFilter = target.dataset.filter; render(); }
  if (action === "enhance-image-product" || action === "reenhance-image") openImageEnhance(target.dataset.id);
  if (action === "approve-enhanced-image") approveEnhancedImage();
  if (action === "revert-image-product") revertProductImage(target.dataset.id);
  if (action === "manage-synonyms") openSynonymManager(target.dataset.id);
  if (action === "syn-add") { const inp = document.getElementById("syn-add-input"); if (inp) { synAddTerm(inp.value); inp.value = ""; inp.focus(); } }
  if (action === "syn-remove") { const i = Number(target.dataset.i); if (state._synMgr && i >= 0) { state._synMgr.active.splice(i, 1); refreshSynonymUI(); } }
  if (action === "syn-accept") synAddTerm(target.dataset.term);
  if (action === "syn-generate") synGenerate();
  if (action === "syn-save") synSave();
  if (action === "merchant-notifications") openMerchantNotifications();
  if (action === "merchant-customer") openMerchantCustomer(target.dataset.key);
  if (action === "export-merchant-customers") exportMerchantCustomersCsv();
  if (action === "create-coupon") openCouponForm();
  if (action === "export-merchant-report") exportMerchantReportCsv();
  if (action === "edit-coupon") openCouponForm(target.dataset.id);
  if (action === "toggle-coupon") toggleCoupon(target.dataset.id, target.dataset.active === "1");
  if (action === "create-admin-coupon") openAdminCouponForm();
  if (action === "edit-admin-coupon") openAdminCouponForm(target.dataset.id);
  if (action === "toggle-admin-coupon") toggleAdminCoupon(target.dataset.id, target.dataset.active === "1");
  if (action === "copy-store-link") {
    const link = target.dataset.link || "";
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(link).then(() => showToast("تم نسخ رابط المتجر", "success")).catch(() => showToast(link, ""));
    else showToast(link, "");
  }
  if (action === "share-store-link") {
    const link = target.dataset.link || "", text = target.dataset.text || "";
    if (navigator.share) navigator.share({ title: "رابط متجري على دكانجي", text, url: link }).catch(() => {});
    else if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text || link).then(() => showToast("تم نسخ الرابط", "success")).catch(() => showToast(link, ""));
    else showToast(link, "");
  }
  if (action === "download-store-qr") {
    const src = target.dataset.qr || "";
    if (!src) return;
    fetch(src).then(r => r.blob()).then(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "dukkanci-store-qr.png";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }).catch(() => window.open(src, "_blank"));
  }
  if (action === "admin-tab") {
    state.adminTab = target.dataset.tab;
    state.adminContentSection = null;
    if (target.dataset.tab !== "campaigns") stopCampaignPoll();
    if (target.dataset.tab === "campaigns" && !state.adminCampaigns) loadAdminCampaigns();
    if (target.dataset.tab === "ai" && !state.adminAI) loadAdminAI();
    if (target.dataset.tab === "fbads" && state.fbadsCompounds == null) loadFbAdsBootstrap();
    if (target.dataset.tab === "banners" && !state.adminBannerStats) loadAdminBannerStats(30);
    if (target.dataset.tab !== "notifications") stopNotifPoll();
    if (target.dataset.tab === "notifications" && !state.adminNotifCampaigns) loadAdminNotifications();
    if (target.dataset.tab !== "fbads") { fbadsMap = null; fbadsMapEl = null; state._fbadsMapSig = null; }
    render();
  }
  // ── Notification campaign actions ──
  if (action === "notif-pick-segment") {
    notifReadDraft();                       // keep what's typed before re-render
    state.notifDraft.segment = target.dataset.key;
    render();
  }
  if (action === "notif-toggle-channel") {
    notifReadDraft();
    const d = state.notifDraft;
    const set = new Set(Array.isArray(d.channels) ? d.channels : ["inapp"]);
    const c = target.dataset.chan;
    set.has(c) ? set.delete(c) : set.add(c);
    d.channels = [...set];
    render();
  }
  if (action === "notif-create") notifCreateCampaign();
  if (action === "notif-build") notifBuild(target.dataset.id);
  if (action === "notif-start") {
    notifAdminApi("start", { method: "POST", id: target.dataset.id })
      .then(() => { loadAdminNotifications(); startNotifPoll(target.dataset.id); });
  }
  if (action === "notif-pause") {
    stopNotifPoll();
    notifAdminApi("pause", { method: "POST", id: target.dataset.id }).then(loadAdminNotifications);
  }
  if (action === "notif-resume") {
    notifAdminApi("resume", { method: "POST", id: target.dataset.id })
      .then(() => { loadAdminNotifications(); startNotifPoll(target.dataset.id); });
  }
  if (action === "notif-delete") {
    if (confirm("حذف هذه الحملة نهائياً؟")) {
      notifAdminApi("delete", { method: "POST", id: target.dataset.id }).then(loadAdminNotifications);
    }
  }
  if (action === "notif-test-send") notifTestSend();
  if (action === "notif-save-settings") notifSaveSettings();

  // ── Facebook ads targeting actions ──
  if (action === "fbads-region") { fbadsSwitchRegion(target.dataset.slug); }
  if (action === "fbads-toggle-region-form") { state.fbadsRegionFormOpen = !state.fbadsRegionFormOpen; render(); }
  if (action === "fbads-add-region") fbadsAddRegion();
  if (action === "fbads-save-rate") fbadsSaveRate();
  if (action === "fbads-toggle-compound-form") { state.fbadsCompoundFormOpen = !state.fbadsCompoundFormOpen; render(); }
  if (action === "fbads-add-compound") fbadsAddCompound();
  if (action === "fbads-edit-compound") { state.fbadsEditingCompoundId = Number(target.dataset.id); render(); }
  if (action === "fbads-cancel-edit-compound") { state.fbadsEditingCompoundId = null; render(); }
  if (action === "fbads-save-compound") fbadsSaveCompoundEdit(Number(target.dataset.id));
  if (action === "fbads-delete-compound") fbadsDeleteCompound(Number(target.dataset.id));
  if (action === "fbads-compute-target") fbadsComputeTarget();
  if (action === "fbads-recompute") fbadsRecomputeActive();
  if (action === "fbads-open-target") loadFbAdsTargetDetail(Number(target.dataset.id));
  if (action === "fbads-delete-target") fbadsDeleteTarget(Number(target.dataset.id));
  if (action === "fbads-export-csv") fbadsExportCsv();
  if (action === "marketing-range") {
    state.adminMarketingFilter = state.adminMarketingFilter || { range: 30, store: "all" };
    state.adminMarketingFilter.range = Number(target.dataset.days) || 30;
    const sel = document.getElementById("marketing-store"); if (sel) state.adminMarketingFilter.store = sel.value;
    state.adminMarketing = null; loadMarketingReport();
  }
  if (action === "marketing-refresh") { state.adminMarketing = null; loadMarketingReport(); }
  if (action === "merchant-range") {
    state.merchantAnalyticsFilter = state.merchantAnalyticsFilter || { range: 30 };
    state.merchantAnalyticsFilter.range = Number(target.dataset.days) || 30;
    state.merchantAnalytics = null; loadMerchantReport();
  }
  if (action === "merchant-report-refresh") { state.merchantAnalytics = null; loadMerchantReport(); }
  if (action === "admin-range") { state.adminAnalyticsRange = Number(target.dataset.range) || 0; render(); }
  if (action === "admin-metric") { state.adminAnalyticsMetric = target.dataset.metric === "orders" ? "orders" : "revenue"; render(); }
  if (action === "admin-order-status") { state.adminOrderStatus = target.dataset.status || "all"; render(); }
  // ── Campaign actions ──
  if (action === "campaign-new") { state.adminCampaignForm = "open"; render(); }
  if (action === "campaign-form-close") { state.adminCampaignForm = null; render(); }
  if (action === "campaign-create") {
    const name      = document.getElementById("cf-name")?.value.trim();
    const tpl       = document.getElementById("cf-tpl")?.value.trim();
    const lang      = document.getElementById("cf-lang")?.value || "ar";
    const rawParams    = document.getElementById("cf-params")?.value || "";
    const buttonUrl    = document.getElementById("cf-button-url")?.value.trim();
    const headerImage  = document.getElementById("cf-header-image")?.value.trim();
    const audience     = document.getElementById("cf-audience")?.value || "all_customers";
    const group        = audience === "wa_contacts" ? (document.getElementById("cf-group")?.value || "") : "";
    const note         = document.getElementById("cf-note")?.value.trim() || null;
    if (!name || !tpl) { showToast("اسم الحملة واسم القالب مطلوبان", "error"); return; }
    const params = rawParams.trim() ? rawParams.split(",").map(s => s.trim()).filter(Boolean) : [];
    const body = { name, template_name: tpl, template_lang: lang, template_params: params, audience_type: audience, contact_group: group || null, note };
    if (buttonUrl) body.button_url_param = buttonUrl;
    if (headerImage) body.header_image_url = headerImage;
    campaignApi("create", { method: "POST", body })
      .then(data => {
        if (!data.ok) { showToast("تعذّر إنشاء الحملة", "error"); return; }
        state.adminCampaignForm = null;
        state.adminCampaigns = null;
        loadAdminCampaigns();
        showToast("تم إنشاء الحملة — ابنِ القائمة الآن", "success");
      }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "campaign-build") {
    const id = target.dataset.id;
    showToast("جارٍ بناء قائمة المستلمين...", "");
    campaignApi("build", { method: "POST", id })
      .then(data => {
        if (!data.ok) { showToast("تعذّر بناء القائمة — تحقق من وجود جدول wa_contacts في Supabase", "error"); return; }
        const total = data.total || 0;
        if (total === 0) {
          showToast("⚠ لا أرقام في القائمة — ارفع أرقام العملاء أولاً من قسم «إدارة الأرقام المرفوعة»", "error");
        } else {
          showToast(`تم — ${total.toLocaleString("ar")} مستلم جاهز للإرسال`, "success");
        }
        state.adminCampaigns = null; loadAdminCampaigns();
      }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "campaign-retry-failed") {
    const id = target.dataset.id;
    campaignApi("update-params", { method: "POST", id, body: { keep_params: true } })
      .then(data => {
        if (!data.ok) { showToast(`خطأ: ${data.error}`, "error"); return; }
        campaignApi("start", { method: "POST", id })
          .then(() => { startCampaignPoll(id); state.adminCampaigns = null; loadAdminCampaigns(); showToast("جارٍ إعادة إرسال الفاشلين...", "success"); })
          .catch(() => showToast("خطأ في بدء الإرسال", "error"));
      }).catch(() => showToast("خطأ في الاتصال", "error"));
    return;
  }
  if (action === "campaign-edit-params") {
    const id = target.dataset.id;
    const currentParams = JSON.parse(target.dataset.params || "[]");
    const currentBtn = target.dataset.buttonUrl || "";
    const currentHeaderImg = target.dataset.headerImage || "";
    const newVal = prompt(
      "معاملات جسم القالب (مفصولة بفاصلة — اتركها فارغة إن لم يكن للقالب متغيرات نصية):",
      currentParams.join(", ")
    );
    if (newVal === null) return;
    const newImg = prompt(
      "رابط صورة الهيدر الديناميكية (اتركه فارغاً إن لم يكن للقالب هيدر صورة ديناميكية):",
      currentHeaderImg
    );
    if (newImg === null) return;
    const newBtn = prompt(
      "لاحقة رابط الزر (اتركه فارغاً إن كان الزر ثابتاً):",
      currentBtn
    );
    if (newBtn === null) return;
    const parsed = newVal.trim() === "" ? [] : newVal.split(",").map(s => s.trim()).filter(Boolean);
    const bodyData = { template_params: parsed, button_url_param: newBtn.trim() || null, header_image_url: newImg.trim() || null };
    campaignApi("update-params", { method: "POST", id, body: bodyData })
      .then(data => {
        if (!data.ok) { showToast(`خطأ: ${data.error}`, "error"); return; }
        showToast("تم تحديث المعاملات وإعادة ضبط الحملة — يمكنك الآن ابدأ الإرسال من جديد", "success");
        state.adminCampaigns = null; loadAdminCampaigns();
      }).catch(() => showToast("خطأ في الاتصال", "error"));
    return;
  }
  if (action === "campaign-show-errors") {
    const id = target.dataset.id;
    if (state.adminCampaignErrors && state.adminCampaignErrors.id === id) {
      state.adminCampaignErrors = null; render(); return; // toggle off
    }
    campaignApi("errors", { id })
      .then(data => { state.adminCampaignErrors = { id, rows: data.errors || [] }; render(); })
      .catch(() => showToast("تعذّر جلب الأخطاء", "error"));
    return;
  }
  if (action === "campaign-send-manual") {
    const id = target.dataset.id;
    target.disabled = true;
    target.textContent = "جارٍ...";
    campaignApi("send-batch", { method: "POST", id })
      .then(data => {
        if (!data.ok) { showToast(`خطأ: ${data.error || "فشل الإرسال"}`, "error"); }
        else if (data.done) { showToast("اكتملت الحملة", "success"); }
        else { showToast(`أُرسلت ${(data.sent||0)} رسالة — ${data.failed||0} فشل`, data.failed ? "error" : "success"); }
        state.adminCampaigns = null; loadAdminCampaigns();
      }).catch(e => showToast("خطأ في الاتصال", "error"))
      .finally(() => { target.disabled = false; target.textContent = "إرسال دفعة ▶"; });
  }
  if (action === "campaign-start") {
    const id = target.dataset.id;
    if (!confirm("سيبدأ إرسال الرسائل فوراً. هل أنت متأكد؟")) return;
    campaignApi("start", { method: "POST", id })
      .then(data => {
        if (!data.ok) { showToast("تعذّر بدء الإرسال", "error"); return; }
        showToast("بدأ الإرسال — سيُحدَّث التقدم تلقائياً", "success");
        state.adminCampaigns = null; loadAdminCampaigns();
        startCampaignPoll(id);
      }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "campaign-pause") {
    const id = target.dataset.id;
    stopCampaignPoll();
    campaignApi("pause", { method: "POST", id })
      .then(() => { state.adminCampaigns = null; loadAdminCampaigns(); showToast("تم إيقاف الحملة مؤقتاً", ""); });
  }
  if (action === "campaign-resume") {
    const id = target.dataset.id;
    campaignApi("resume", { method: "POST", id })
      .then(data => {
        if (!data.ok) { showToast("تعذّر الاستئناف", "error"); return; }
        showToast("استُؤنف الإرسال", "success");
        state.adminCampaigns = null; loadAdminCampaigns();
        startCampaignPoll(id);
      }).catch(() => showToast("خطأ", "error"));
  }
  if (action === "campaign-cancel") {
    const id = target.dataset.id;
    if (!confirm("إلغاء الحملة نهائياً؟ لا يمكن التراجع.")) return;
    stopCampaignPoll();
    campaignApi("cancel", { method: "POST", id })
      .then(() => { state.adminCampaigns = null; loadAdminCampaigns(); showToast("تم إلغاء الحملة", ""); });
  }
  // ── Contacts panel ──
  if (action === "contacts-panel") {
    state.adminCampaignForm = "contacts";
    if (!state.adminContacts) loadContacts();
    render();
  }
  if (action === "contacts-panel-close") { state.adminCampaignForm = null; render(); }
  if (action === "images-panel") {
    state.adminCampaignForm = "images";
    if (!state.adminImages) {
      state.adminImages = { loading: true };
      campaignApi("images-list").then(d => {
        const fromApi = d.images || [];
        const current = state.adminImages?.list || [];
        // Keep locally-added images that may not yet be in the API response
        const apiNames = new Set(fromApi.map(i => i.name));
        const merged = [...fromApi, ...current.filter(i => !apiNames.has(i.name))];
        state.adminImages = { list: merged };
        render();
      }).catch(() => { if (!state.adminImages?.list) { state.adminImages = { list: [] }; render(); } });
    }
    render();
    // Wire file input after render
    setTimeout(() => {
      const inp = document.getElementById("img-file-input");
      if (inp) inp.onchange = () => { if (inp.files[0]) uploadCampaignImage(inp.files[0]); };
    }, 50);
    return;
  }
  if (action === "images-panel-close") { state.adminCampaignForm = null; render(); }
  if (action === "image-copy-url") {
    navigator.clipboard.writeText(target.dataset.url).then(() => showToast("تم نسخ الرابط", "success")).catch(() => showToast(target.dataset.url, ""));
  }
  if (action === "image-delete") {
    const name = target.dataset.name;
    if (!confirm(`حذف الصورة "${name}"؟`)) return;
    campaignApi("image-delete", { id: null, method: "GET" });
    // Call directly with filename param
    fetch(`/api/campaign?action=image-delete&filename=${encodeURIComponent(name)}`, {
      headers: { "x-admin-token": state.adminKey || "" }
    }).then(r => r.json()).then(d => {
      if (!d.ok) { showToast("فشل الحذف", "error"); return; }
      state.adminImages = { list: (state.adminImages?.list || []).filter(i => i.name !== name) };
      render();
      showToast("تم الحذف", "success");
    }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "image-use-in-form") {
    const url = target.dataset.url;
    state.adminCampaignForm = "open";
    render();
    setTimeout(() => {
      const inp = document.getElementById("cf-header-image");
      if (inp) { inp.value = url; inp.scrollIntoView({ behavior: "smooth", block: "center" }); }
    }, 80);
  }
  if (action === "contacts-upload") {
    const text      = document.getElementById("contacts-textarea")?.value || "";
    const groupName = document.getElementById("contacts-group-name")?.value.trim() || "default";
    if (!text.trim()) { showToast("الرجاء لصق أرقام الهاتف أولاً", "error"); return; }
    showToast("جارٍ رفع الأرقام...", "");
    campaignApi("upload-contacts", { method: "POST", body: { text, group_name: groupName } })
      .then(data => {
        if (!data.ok) { showToast("تعذّر رفع الأرقام", "error"); return; }
        state.adminContacts = null;
        loadContacts();
        showToast(`تم حفظ ${(data.added || 0).toLocaleString("ar")} رقم في مجموعة "${groupName}"`, "success");
        const ta = document.getElementById("contacts-textarea");
        const gn = document.getElementById("contacts-group-name");
        if (ta) ta.value = "";
        if (gn) gn.value = "";
      }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "contacts-view-group") {
    // Empty data-group = back to the newest numbers across all groups.
    loadContacts(target.dataset.group || "");
  }
  if (action === "contacts-delete-group") {
    const group = target.dataset.group;
    if (!confirm(`حذف مجموعة "${group}" نهائياً؟`)) return;
    campaignApi("contacts-clear-group", { method: "POST", body: { group_name: group } })
      .then(() => { state.adminContacts = null; loadContacts(); showToast(`تم حذف مجموعة "${group}"`, ""); });
  }
  if (action === "contacts-clear") {
    if (!confirm("حذف جميع الأرقام المرفوعة من كل المجموعات نهائياً؟")) return;
    campaignApi("contacts-clear", { method: "POST", body: {} })
      .then(() => { state.adminContacts = null; loadContacts(); showToast("تم حذف جميع الأرقام", ""); });
  }
  // ── Opt-out / exclusion panel ──
  if (action === "optouts-panel") {
    state.adminCampaignForm = "optouts";
    if (!state.adminOptouts) loadOptouts();
    render();
  }
  if (action === "optouts-panel-close") { state.adminCampaignForm = null; render(); }
  if (action === "optout-add") {
    const text   = document.getElementById("optout-textarea")?.value || "";
    const reason = document.getElementById("optout-reason")?.value.trim() || "";
    if (!text.trim()) { showToast("الرجاء لصق أرقام الهاتف أولاً", "error"); return; }
    showToast("جارٍ استبعاد الأرقام...", "");
    campaignApi("optout-add", { method: "POST", body: { text, reason } })
      .then(data => {
        if (!data.ok) { showToast("تعذّر استبعاد الأرقام", "error"); return; }
        state.adminOptouts = null;
        loadOptouts();
        showToast(`تم استبعاد ${(data.added || 0).toLocaleString("ar")} رقم`, "success");
        const ta = document.getElementById("optout-textarea");
        const rs = document.getElementById("optout-reason");
        if (ta) ta.value = "";
        if (rs) rs.value = "";
      }).catch(() => showToast("خطأ في الاتصال", "error"));
  }
  if (action === "optout-remove") {
    const phone = target.dataset.phone;
    if (!confirm(`إلغاء استبعاد الرقم "${phone}"؟`)) return;
    campaignApi("optout-remove", { method: "POST", body: { phone } })
      .then(() => { state.adminOptouts = null; loadOptouts(); showToast("تم إلغاء الاستبعاد", ""); });
  }
  if (action === "optout-clear") {
    if (!confirm("حذف جميع الأرقام المستبعدة نهائياً؟")) return;
    campaignApi("optout-clear", { method: "POST", body: {} })
      .then(() => { state.adminOptouts = null; loadOptouts(); showToast("تم حذف جميع الأرقام المستبعدة", ""); });
  }
  if (action === "reload-creds") { state.adminCreds = null; render(); loadAdminCreds(); }
  if (action === "copy-creds") {
    const u = target.dataset.username, p = target.dataset.password, n = target.dataset.name;
    const text = `متجر: ${n}\nاسم المستخدم: ${u}\nكلمة المرور: ${p}\nرابط الدخول: ${SITE_ORIGIN}/merchant`;
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => showToast("تم نسخ بيانات الدخول", "success")).catch(() => showToast("تعذّر النسخ", "error"));
    else showToast("النسخ غير مدعوم في هذا المتصفح", "error");
  }
  if (action === "reset-creds") {
    const id = Number(target.dataset.id);
    const name = target.dataset.name || "";
    if (!confirm(`توليد كلمة مرور جديدة لـ "${name}"؟ ستتوقف كلمة المرور الحالية عن العمل.`)) return;
    adminApi("store-creds-reset", { method: "POST", body: { storeId: id } })
      .then(data => {
        if (data && data.ok && Array.isArray(state.adminCreds)) {
          const row = state.adminCreds.find(r => Number(r.store_id) === id);
          if (row) { row.password = data.password; row.username = data.username; }
          render();
          showToast("تم توليد كلمة مرور جديدة", "success");
        } else { showToast("تعذّر التوليد", "error"); }
      })
      .catch(() => showToast("تعذّر التوليد", "error"));
  }
  if (action === "content-section") { state.adminContentSection = target.dataset.section; render(); }
  if (action === "content-back") { state.adminContentSection = null; render(); }
  // ── Shared supermarket image bank — admin review queue ──
  if (action === "admin-catalog-status") {
    state._adminCatalogStatus = target.dataset.status;
    state._adminCatalog = null;
    state._adminCatalogSelected = new Set();
    render();
  }
  if (action === "reload-admin-catalog") { state._adminCatalog = null; render(); }
  if (action === "admin-catalog-clear-selection") { state._adminCatalogSelected = new Set(); render(); }
  if (action === "admin-catalog-enhance") {
    enhanceCatalogItem(Number(target.dataset.id), target.closest(".catalog-review-card"));
  }
  if (action === "admin-catalog-approve" || action === "admin-catalog-reject") {
    const id = Number(target.dataset.id);
    reviewCatalogItem(id, action === "admin-catalog-approve" ? "approve" : "reject", target.closest(".catalog-review-card"));
  }
  if (action === "admin-catalog-bulk-approve") bulkReviewCatalog("approve");
  if (action === "admin-catalog-bulk-reject") bulkReviewCatalog("reject");
  // ── AI Management ──
  if (action === "ai-refresh") { state.adminAI = null; state._adminAITestReply = undefined; loadAdminAI(); }
  if (action === "ai-edit-provider") { state._adminAIEdit = target.dataset.id; render(); }
  if (action === "ai-cancel-edit") { state._adminAIEdit = null; render(); }
  if (action === "ai-delete-provider") {
    const id = target.dataset.id, name = target.dataset.name || "";
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("trash")}</div><h2>حذف المزوّد ${esc(name)}؟</h2>
      <p>سيُحذف المفتاح المشفّر. أي ميزة مربوطة به ستعود للمفتاح الافتراضي.</p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="ai-confirm-delete" data-id="${escAttr(id)}">حذف</button></div>
    `, "confirm-modal");
  }
  if (action === "ai-confirm-delete") {
    const id = target.dataset.id;
    closeModal();
    aiApi("delete-provider", { method: "POST", body: { id } })
      .then(() => { if (state._adminAIEdit === id) state._adminAIEdit = null; state.adminAI = null; showToast("تم حذف المزوّد", "success"); loadAdminAI(); })
      .catch(() => showToast("تعذّر الحذف", ""));
  }
  if (action === "ai-section") { state._adminAISection = target.dataset.section; render(); }
  if (action === "kb-refresh") { state.adminKB = null; state._adminKBTest = null; loadAdminKB(); }
  if (action === "syn-refresh") { state.adminSyn = null; state._synLog = null; loadAdminSyn(); }
  if (action === "syn-sync") {
    if (state._synRunning) return;
    showToast("جارٍ تحديث قائمة الأسماء من الكتالوج…", "");
    aiApi("syn-sync", { method: "POST" })
      .then(r => { state.adminSyn = state.adminSyn ? Object.assign({}, state.adminSyn, { stats: r.stats }) : null; showToast(`تم تحديث القائمة (${(r.stats && r.stats.total) || 0} منتج)`, "success"); loadAdminSyn(); })
      .catch(() => showToast("تعذّر التحديث", ""));
  }
  if (action === "syn-generate") { runSynGenerate(); }
  if (action === "syn-index") { runSynIndex(); }
  if (action === "syn-stop") { state._synStop = true; showToast("جارٍ الإيقاف…", ""); }
  if (action === "syn-retry") {
    aiApi("syn-retry-failed", { method: "POST" })
      .then(() => { showToast("أُعيدت الأسماء الفاشلة إلى الطابور", "success"); loadAdminSyn(); })
      .catch(() => showToast("تعذّرت العملية", ""));
  }
  if (action === "syn-edit") {
    const name = target.dataset.name || "";
    const row = (state.adminSyn && state.adminSyn.rows || []).find(r => r.name === name);
    const cur = row && Array.isArray(row.synonyms) ? row.synonyms.join("، ") : "";
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <h2>تعديل مرادفات «${esc(name)}»</h2>
      <p class="creds-summary">افصل بين الكلمات بفاصلة أو سطر جديد. سيُحفظ ما تكتبه بديلاً عن التوليد الآلي.</p>
      <form id="syn-edit-form" data-name="${escAttr(name)}" class="form-grid">
        <label class="input-label" style="grid-column:1/-1"><span>المرادفات</span><textarea name="synonyms" rows="5">${esc(cur)}</textarea></label>
        <div style="grid-column:1/-1;display:flex;gap:8px"><button type="submit" class="primary-button">${icon("check")} حفظ</button><button type="button" class="secondary-button" data-action="close-modal">إلغاء</button></div>
      </form>`, "");
  }
  if (action === "kb-delete") {
    const id = target.dataset.id, name = target.dataset.name || "";
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("trash")}</div><h2>حذف «${esc(name)}»؟</h2>
      <p>سيُحذف المستند وكل مقاطعه ومتجهاته نهائياً.</p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="kb-confirm-delete" data-id="${escAttr(id)}">حذف</button></div>
    `, "confirm-modal");
  }
  if (action === "kb-confirm-delete") {
    const id = target.dataset.id;
    closeModal();
    aiApi("kb-delete", { method: "POST", body: { id } })
      .then(() => { state.adminKB = null; showToast("تم حذف المستند", "success"); loadAdminKB(); })
      .catch(() => showToast("تعذّر الحذف", ""));
  }
  if (action === "cat-move") {
    const i = Number(target.dataset.index), dir = target.dataset.dir;
    const items = categoriesList().map(c => ({ ...c }));
    const j = dir === "up" ? i - 1 : i + 1;
    if (i >= 0 && j >= 0 && j < items.length) { const t = items[i]; items[i] = items[j]; items[j] = t; saveContentSetting("categories", { items }); }
  }
  // ── البانرات المُدارة ──
  if (action === "banner-add") openBannerEditModal(null);
  if (action === "banner-edit") openBannerEditModal(target.dataset.id);
  if (action === "banner-range") loadAdminBannerStats(Number(target.dataset.days) || 30);
  if (action === "banner-stats-refresh") loadAdminBannerStats();
  if (action === "banner-move") {
    const { items, limits } = bannerSettings();
    const banner = items.find(b => b.id === target.dataset.id);
    if (!banner) return;
    // Reorder within the banner's own placement group: neighbours in other
    // placements are irrelevant, so swap sort values with the adjacent sibling.
    const siblings = items.filter(b => b.placement === banner.placement).sort((a, b) => (Number(a.sort) || 0) - (Number(b.sort) || 0));
    const i = siblings.findIndex(b => b.id === banner.id);
    const j = target.dataset.dir === "up" ? i - 1 : i + 1;
    if (j < 0 || j >= siblings.length) return;
    const next = items.map(b => {
      if (b.id === siblings[i].id) return { ...b, sort: Number(siblings[j].sort) || 0 };
      if (b.id === siblings[j].id) return { ...b, sort: Number(siblings[i].sort) || 0 };
      return b;
    });
    saveBannerSettings({ items: next, limits });
  }
  if (action === "banner-delete") {
    const { items, limits } = bannerSettings();
    const banner = items.find(b => b.id === target.dataset.id);
    if (!banner) return;
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("trash")}</div><h2>حذف «${esc(banner.title || banner.headline || banner.id)}»؟</h2>
      <p>سيختفي البانر من الموقع فوراً. إحصاءات نقراته السابقة تبقى محفوظة في قاعدة البيانات لكنها لن تظهر في اللوحة بعد الحذف.<br><small>إن كنت تريد إيقافه مؤقتاً فقط، أغلق مفتاح «مفعّل» بدل الحذف.</small></p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="banner-confirm-delete" data-id="${escAttr(banner.id)}">حذف نهائياً</button></div>
    `, "");
  }
  if (action === "banner-confirm-delete") {
    const { items, limits } = bannerSettings();
    saveBannerSettings({ items: items.filter(b => b.id !== target.dataset.id), limits });
    closeModal();
    showToast("تم حذف البانر", "success");
  }
  if (action === "cat-add") openCategoryEditModal(null);
  if (action === "cat-edit") openCategoryEditModal(Number(target.dataset.index));
  if (action === "cat-delete") {
    const i = Number(target.dataset.index);
    const cat = categoriesList()[i];
    if (!cat) return;
    const usage = stores.filter(s => s.category === cat.name).length;
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <div class="conflict-modal-icon">${icon("trash")}</div><h2>حذف «${esc(cat.name)}»؟</h2>
      <p>${usage ? `${usage} متجر مسجَّل حالياً على هذا التصنيف — سيبقى تصنيف كل متجر كما هو، لكنه لن يظهر ضمن أي تصنيف في الفلاتر أو نموذج الانضمام بعد الحذف.` : "لا يوجد أي متجر مسجَّل على هذا التصنيف حالياً."}</p>
      <div class="modal-actions"><button class="secondary-button" data-action="close-modal">إلغاء</button><button class="danger-button" data-action="cat-confirm-delete" data-index="${i}">حذف نهائياً</button></div>
    `, "confirm-modal");
  }
  if (action === "cat-confirm-delete") {
    const i = Number(target.dataset.index);
    const items = categoriesList().map(c => ({ ...c }));
    if (items[i]) {
      const name = items[i].name;
      items.splice(i, 1);
      closeModal();
      saveContentSetting("categories", { items });
      showToast(`تم حذف تصنيف «${name}»`, "success");
    }
  }
  if (action === "content-image-remove") {
    const form = target.closest("form");
    const imgInput = form && form.querySelector('[name="image"]');
    if (imgInput) imgInput.value = "";
    const preview = document.getElementById("content-image-preview");
    if (preview) preview.innerHTML = icon("box");
  }
  if (action === "wa-open") loadAdminThread(target.dataset.wa, false);
  if (action === "wa-refresh") loadAdminThreads(false);
  if (action === "wa-filter") { state.adminThreadFilter = target.dataset.filter || null; state._waListSig = null; render(); }
  if (action === "wa-pin") {
    const wa = target.dataset.wa;
    const pinned = target.dataset.pinned !== "1";   // toggle current state
    if (state.adminThread && state.adminActiveWa === wa) state.adminThread.pinned = pinned;
    const t = (state.adminThreads || []).find(x => x.wa_id === wa);
    if (t) t.pinned = pinned;
    resortAdminThreads();
    state._waListSig = null;
    render();
    adminApi("set-pin", { method: "POST", body: { wa, pinned } })
      .then(() => loadAdminThreads(true))
      .catch(() => showToast("تعذّر تثبيت المحادثة", ""));
  }
  if (action === "wa-label") {
    const wa = target.dataset.wa;
    const key = target.dataset.label || null;
    const tt = (state.adminThreads || []).find(x => x.wa_id === wa);
    const cur = (state.adminThread && state.adminActiveWa === wa) ? state.adminThread.label : (tt ? tt.label : null);
    const next = (key && cur === key) ? null : key;   // click the active label again → clear it
    if (state.adminThread && state.adminActiveWa === wa) state.adminThread.label = next;
    if (tt) tt.label = next;
    state._waListSig = null;
    render();
    adminApi("set-label", { method: "POST", body: { wa, label: next } })
      .then(() => loadAdminThreads(true))
      .catch(() => showToast("تعذّر تصنيف المحادثة", ""));
  }
  if (action === "wa-resume-ai") {
    const wa = target.dataset.wa;
    adminApi("resume-ai", { method: "POST", body: { wa } })
      .then(() => { if (state.adminThread) { state.adminThread.ai_paused = false; state.adminThread.needs_human = false; } showToast("تم استئناف الرد الآلي", "success"); loadAdminThreads(true); render(); })
      .catch(() => showToast("تعذّر الاستئناف", ""));
  }
  if (action === "route-home") navigate("home");
  if (action === "ack-new-order") {
    stopNewOrderRing();
    state.merchantNewOrderAlert = null;
    state.merchantTab = "orders";
    render();
    openOrderManager(target.dataset.id);
  }
  if (action === "silence-ring") {
    stopNewOrderRing();
    state.merchantNewOrderAlert = null;
    render();
  }
  if (action === "manage-order") openOrderManager(target.dataset.id);
  if (action === "view-order") openOrderManager(target.dataset.id);
  if (action === "view-customer") openCustomerDetail(target.dataset.key);
  if (action === "save-order-status") {
    const order = state.orders.find(item => item.id === target.dataset.id);
    const prevStatus = order.status;
    const newStatus = document.getElementById("order-status-select").value;
    const note = (document.getElementById("order-status-note")?.value || "").trim();
    const btnLabel = target.innerHTML;
    target.disabled = true; target.innerHTML = "جارٍ الحفظ...";
    order.status = newStatus;
    Promise.resolve(pushOrderCloud(order)).then(ok => {
      if (ok === false) {
        order.status = prevStatus;
        target.disabled = false; target.innerHTML = btnLabel;
        showToast("تعذّر حفظ الحالة، تحقّق من الاتصال وحاول مجدداً");
        return;
      }
      // Tell the customer on real status changes (skip the initial states they were
      // already acked for at checkout).
      if (newStatus !== prevStatus && !["طلب جديد", "بانتظار الدفع"].includes(newStatus)) notifyOrderStatusWhatsapp(order, note);
      saveState(); closeModal(); render(); showToast("تم تحديث حالة الطلب وإشعار العميل", "success");
    });
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
    const shareUrl = SITE_ORIGIN + "/store/" + storeParam(store);
    const shareText = `${store.name} على دكانجي`;
    if (navigator.share) {
      navigator.share({ title: shareText, url: shareUrl }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(`${shareText} - ${shareUrl}`).then(
        () => showToast("تم نسخ رابط المتجر", "success"),
        () => showToast("تعذّر النسخ، انسخ الرابط يدوياً")
      );
      if (!navigator.clipboard) showToast("تم نسخ رابط المتجر", "success");
    }
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
    captureUserLocation();
  }
  if (action === "welcome-allow-location") {
    closeModal();
    captureUserLocation();
  }
  if (action === "welcome-later") {
    closeModal();
  }
  if (action === "install-app") {
    if (state.deferredInstall) {
      state.deferredInstall.prompt();
      state.deferredInstall.userChoice.then(() => { state.deferredInstall = null; });
    } else showToast("من قائمة المتصفح اختر «إضافة إلى الشاشة الرئيسية» لتثبيت دكانجي");
  }
  if (action === "add-product-form") openProductForm();
  if (action === "open-catalog-import") openCatalogImportModal();
  if (action === "import-catalog-item") importCatalogItem(target.dataset.catalogId, target.closest(".catalog-import-card"));
  if (action === "edit-product") openProductForm(target.dataset.id);
  if (action === "delete-product") openDeleteProductConfirm(target.dataset.id);
  if (action === "confirm-delete-product") deleteProduct(target.dataset.id);
  if (action === "merchant-logout") {
    stopMerchantOrderWatch();
    const wasPwSession = !!state.merchantPwAuth;
    state.merchantAuth = null;
    state.merchantStores = null;
    state.merchantPwAuth = null;
    state._merchantResolved = false;
    state._merchantResolving = false;
    state._merchantOrdersFetched = false;
    state.orders = [];
    localStorage.removeItem("dukkanci-merchant-auth");
    localStorage.removeItem("dukkanci-merchant-session");
    if (wasPwSession) {
      // No Supabase session to end — just reset to the login screen.
      state.merchantLoginMode = "admin";
      showToast("تم تسجيل الخروج", "success");
      render();
    } else {
      signOutUser(); // end the Supabase session (merchant identity == the session); re-renders
      showToast("تم تسجيل الخروج", "success");
    }
  }
  if (action === "merchant-enable-push") {
    const token = state.merchantPwAuth && state.merchantPwAuth.token;
    const storeId = state.merchantStoreId;
    if (!storeId) { showToast("سجّل الدخول بحساب المتجر لتفعيل الإشعارات"); return; }
    showToast("جارٍ تفعيل الإشعارات…");
    // Password-token merchants verify via the merchant token; Supabase-session
    // merchants (Google/email/OTP) verify store ownership via their access token.
    const meta = token ? { role: "store", storeId, token } : { role: "store", storeId, supabase: true };
    (token ? enablePush(meta) : autoEnablePush(meta))
      .then(ok => showToast(ok ? "تم تفعيل إشعارات الطلبات الجديدة 🔔" : "تعذّر تفعيل الإشعارات", ok ? "success" : undefined));
  }
  if (action === "admin-enable-push") {
    if (!state.adminKey) { showToast("سجّل دخول الإدارة أولاً"); return; }
    showToast("جارٍ تفعيل الإشعارات…");
    enablePush({ role: "admin", adminToken: state.adminKey })
      .then(ok => showToast(ok ? "تم تفعيل إشعارات كل الطلبات الجديدة 🔔" : "تعذّر تفعيل الإشعارات", ok ? "success" : undefined));
  }
  if (action === "merchant-otp") { state.merchantLoginMode = "otp"; render(); }
  if (action === "merchant-email") { state.merchantLoginMode = "email"; render(); }
  if (action === "merchant-admin-login") { state.merchantLoginMode = "admin"; render(); }
  if (action === "merchant-email-signup") { state.merchantEmailMode = "signup"; render(); }
  if (action === "merchant-email-signin") { state.merchantEmailMode = "signin"; render(); }
  if (action === "merchant-google") {
    try { localStorage.setItem("dukkanci-merchant-google-intent", "1"); } catch (e) {}
    signInWithGoogle();
  }
  if (action === "store-approve") {
    const id = Number(target.dataset.id);
    const status = target.dataset.status;
    const store = stores.find(s => s.id === id);
    if (!store) return;
    const prev = store.approvalStatus;
    store.approvalStatus = status; // optimistic
    render();
    adminApi("store-approval", { method: "POST", body: { id, status } })
      .then(() => {
        const labels = { approved: "تم قبول المتجر", rejected: "تم رفض المتجر", suspended: "تم تعليق المتجر", pending: "أُعيد للمراجعة" };
        showToast(labels[status] || "تم التحديث", "success");
      })
      .catch(() => { store.approvalStatus = prev; render(); showToast("تعذّر تحديث حالة المتجر", ""); });
  }
  if (action === "refresh-orders") {
    state._merchantOrdersFetched = true;
    showToast("جارٍ تحديث الطلبات...");
    loadOrdersFromSupabase(state.merchantStoreId).then(ok => { render(); if (ok) showToast("تم تحديث الطلبات", "success"); });
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
  if (action === "complaint-detail") openComplaintDetail(target.dataset.id);
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
  } else if (event.target.id === "dalil-search") {
    event.preventDefault();
    if (!state.dalil) dalilStateFromUrl();
    state.dalil.q = event.target.value.trim();
    if (state.dalil.q) window.DUKKANCI_TRACKING?.track("search", { search_term: state.dalil.q, search_context: "dalil" });
    dalilSyncUrl();
    render();
    setTimeout(() => document.getElementById("dalil-search")?.focus(), 0);
  } else if (event.target.id === "syn-add-input") {
    event.preventDefault();
    synAddTerm(event.target.value);
    event.target.value = "";
  }
});

document.addEventListener("change", event => {
  // Store picker for the store_customers segment — changing it re-resolves the
  // segment server-side so the live audience count reflects the chosen store.
  if (event.target.id === "notif-store-param") {
    notifReadDraft();
    state.notifSegmentStoreId = event.target.value || null;
    loadAdminNotifications();
    return;
  }
  if (event.target.id === "img-file-input") {
    const file = event.target.files && event.target.files[0];
    if (file) uploadCampaignImage(file);
    return;
  }
  if (event.target.classList.contains("file-upload__input")) {
    const wrap = event.target.closest(".file-upload");
    const label = wrap && wrap.querySelector(".file-upload__text");
    const file = event.target.files && event.target.files[0];
    if (wrap) wrap.classList.toggle("has-file", !!file);
    if (label) label.textContent = file ? file.name : "اختر صورة من جهازك";
    return;
  }
  if (event.target.id === "cf-audience") {
    const isContacts = event.target.value === "wa_contacts";
    const groupLabel = document.getElementById("cf-group-label");
    if (groupLabel) groupLabel.style.display = isContacts ? "" : "none";
  }
  if (event.target.id === "store-sort") { state.storeSort = event.target.value; render(); }
  if (event.target.id === "dalil-sort") {
    if (!state.dalil) dalilStateFromUrl();
    state.dalil.sort = event.target.value;
    dalilSyncUrl();
    render();
  }
  if (event.target.id === "admin-order-store") { state.adminOrderStore = event.target.value; render(); }
  if (event.target.id === "merchant-store-switch") {
    state.merchantStoreId = Number(event.target.value);
    state.merchantProductSearch = "";
    state._merchantOrdersFetched = false;
    saveState();
    render();
  }
  if (event.target.id === "checkout-address") {
    state.deliveryQuote = null;
    requestDeliveryQuote();
  }
  if (event.target.name === "namedZone" && document.getElementById("zone-address-fields")) {
    const isNamed = event.target.value !== "";
    document.getElementById("zone-address-fields").style.display = isNamed ? "" : "none";
    document.getElementById("full-address-fields").style.display = isNamed ? "none" : "";
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
    readImageFileResized(file, 720, 0.78).then(dataUrl => {
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
    if (event.target.name === "payment") {
      const panel = document.getElementById("bank-transfer-panel");
      if (panel) panel.hidden = event.target.value !== "bank";
    }
  }
  if (event.target.dataset.action === "toggle-product") {
    const product = getProduct(event.target.dataset.id);
    if (!product) { showToast("تعذّر العثور على المنتج"); return; }
    product.available = event.target.checked;
    upsertCatalogProduct(product);
    saveProductOverride(product.id, { available: product.available });
    pushProductCloud(product).then(result => {
      if (!result.ok) showToast(productSaveErrorMessage(result));
    });
    showToast(`أصبح المنتج ${product.available ? "متوفراً" : "غير متوفر"}`, "success");
    render();
  }
  if (event.target.dataset.action === "inline-price") {
    const product = getProduct(event.target.dataset.id);
    if (!product) { showToast("تعذّر العثور على المنتج"); return; }
    const newPrice = Math.max(0, Math.round(Number(event.target.value) || 0));
    // Empty/zero = likely a mistake (cleared field) → revert to the current price.
    if (!newPrice || newPrice === Number(product.price)) { event.target.value = Number(product.price) || 0; return; }
    const prevPrice = product.price;
    product.price = newPrice;
    upsertCatalogProduct(product);
    saveProductOverride(product.id, { price: newPrice });
    pushProductCloud(product).then(result => {
      if (!result.ok) { product.price = prevPrice; upsertCatalogProduct(product); showToast(productSaveErrorMessage(result)); render(); }
      else showToast(`تم تحديث سعر «${product.name}» إلى ${money(newPrice)}`, "success");
    });
    render();
  }
  if (event.target.id === "merchant-csv-input") {
    const file = event.target.files && event.target.files[0];
    event.target.value = ""; // allow re-selecting the same file later
    if (file) handleMerchantCsvImport(file);
  }
  if (event.target.dataset.action === "admin-toggle-hide") {
    const id = Number(event.target.dataset.id);
    const ids = new Set([...HIDDEN_PRODUCTS]);
    if (event.target.checked) ids.delete(id); else ids.add(id);   // checked = ظاهر, unchecked = مخفي
    HIDDEN_PRODUCTS = ids;
    const kept = applyPublishingRules(allProducts); products.length = 0; kept.forEach(p => products.push(p));
    saveContentSetting("hiddenProducts", { ids: [...ids] });   // persists (admin) + re-renders
    showToast(ids.has(id) ? "أُخفي المنتج من المتجر" : "أصبح المنتج معروضاً", "success");
  }
  if (event.target.dataset.action === "admin-catalog-select") {
    const id = Number(event.target.dataset.id);
    const sel = state._adminCatalogSelected || (state._adminCatalogSelected = new Set());
    if (event.target.checked) sel.add(id); else sel.delete(id);
    render();
  }
  if (event.target.id === "admin-product-store") {
    state.adminProductStoreId = Number(event.target.value);
    state.adminProductSearch = "";
    state.adminProductCategory = null;
    render();
  }
  if (event.target.dataset.action === "toggle-featured") {
    const store = getStore(event.target.dataset.id);
    if (store) {
      const checkbox = event.target;
      const prevVal = store.featured;
      const newVal = checkbox.checked;
      store.featured = newVal;
      checkbox.disabled = true;
      pushStoreCloud(store).then(result => {
        checkbox.disabled = false;
        if (!result.ok) {
          store.featured = prevVal;
          checkbox.checked = prevVal;
          showToast("تعذّر حفظ التغيير، تحقّق من الاتصال وحاول مجدداً");
          return;
        }
        showToast(`${store.name}: ${newVal ? "أصبح مميّزاً على الرئيسية" : "أُزيل من المميّزة"}`, "success");
        render();
      });
    }
  }
  if (event.target.dataset.action === "toggle-category") {
    const i = Number(event.target.dataset.index);
    const items = categoriesList().map(c => ({ ...c }));
    if (items[i]) { items[i].hidden = !event.target.checked; saveContentSetting("categories", { items }); }
  }
  if (event.target.dataset.action === "banner-toggle") {
    const { items, limits } = bannerSettings();
    const id = event.target.dataset.id;
    saveBannerSettings({ items: items.map(b => b.id === id ? { ...b, active: event.target.checked } : b), limits });
  }
  if (event.target.dataset.action === "banner-limit") {
    const { items, limits } = bannerSettings();
    const placement = event.target.dataset.placement;
    const n = Math.min(Math.max(Number(event.target.value) || 1, 1), 12);
    saveBannerSettings({ items, limits: { ...limits, [placement]: n } });
  }
  if (event.target.id === "banner-image-file") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const form = event.target.closest("form");
    const preview = document.getElementById("banner-image-preview");
    if (preview) preview.innerHTML = `<span class="image-loading">${icon("upload")}</span>`;
    // Banners render full-width edge-to-edge, so they keep more resolution than
    // the 900px content default. The server hosts the result (offloadJsonImages),
    // so nothing this large ever lands in the site_settings row itself.
    readImageFileResized(file, 1400, 0.82).then(dataUrl => {
      const imgInput = form.querySelector('[name="image"]'); if (imgInput) imgInput.value = dataUrl;
      if (preview) preview.innerHTML = `<img src="${dataUrl}" alt="">`;
      showToast(`تم اختيار "${file.name}"`, "success");
    }).catch(() => { if (preview) preview.innerHTML = icon("image"); showToast("تعذّر رفع الصورة، جرّب صورة أخرى", ""); });
  }
  if (event.target.id === "store-cover-file") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const form = event.target.closest("form");
    const preview = document.getElementById("store-cover-preview");
    if (preview) preview.innerHTML = `<span class="image-loading">${icon("upload")}</span>`;
    readImageFileResized(file, 1280, 0.82).then(dataUrl => {
      const input = form.querySelector('[name="coverImage"]'); if (input) input.value = dataUrl;
      if (preview) preview.innerHTML = `<img src="${dataUrl}" alt="">`;
      showToast(`تم اختيار "${file.name}"`, "success");
    }).catch(() => { if (preview) preview.innerHTML = ""; showToast("تعذّر رفع الصورة، جرّب صورة أخرى", ""); });
  }
  if (event.target.id === "category-image-file") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const form = event.target.closest("form");
    const preview = document.getElementById("category-image-preview");
    if (preview) preview.innerHTML = `<span class="image-loading">${icon("upload")}</span>`;
    readImageFileResized(file).then(dataUrl => {
      const imgInput = form.querySelector('[name="image"]'); if (imgInput) imgInput.value = dataUrl;
      if (preview) preview.innerHTML = `<img src="${dataUrl}" alt="">`;
      showToast(`تم اختيار "${file.name}"`, "success");
    }).catch(() => { if (preview) preview.innerHTML = icon("box"); showToast("تعذّر رفع الصورة، جرّب صورة أخرى", ""); });
  }
  if (event.target.id === "content-image-file") {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const form = event.target.closest("form");
    const preview = document.getElementById("content-image-preview");
    if (preview) preview.innerHTML = `<span class="image-loading">${icon("upload")}</span>`;
    readImageFileResized(file).then(dataUrl => {
      const imgInput = form.querySelector('[name="image"]'); if (imgInput) imgInput.value = dataUrl;
      if (preview) preview.innerHTML = `<img src="${dataUrl}" alt="">`;
      showToast(`تم اختيار "${file.name}"`, "success");
    }).catch(() => { if (preview) preview.innerHTML = icon("box"); showToast("تعذّر رفع الصورة، جرّب صورة أخرى", ""); });
  }
  // «عرض اليوم»: picking a store repopulates the linked-product select with
  // that store's available products (selection resets to the placeholder).
  if (event.target.id === "dd-store-select") {
    const sel = document.getElementById("dd-product-select");
    if (!sel) return;
    const sid = Number(event.target.value);
    const list = sid ? products.filter(p => p.storeId === sid && p.available) : [];
    sel.disabled = !list.length;
    sel.innerHTML = `<option value="">${list.length ? "اختر المنتج…" : "اختر المتجر أولاً"}</option>`
      + list.map(p => `<option value="${p.id}">${escAttr(p.name)}${p.oldPrice ? " — عليه خصم" : ""}</option>`).join("");
  }
});

document.addEventListener("input", event => {
  if (event.target.id === "cart-note") {
    state.cartNote = event.target.value;
    return;
  }
  if (event.target.id === "ask-message") { state.askDukkanci.message = event.target.value; return; }
  if (event.target.id === "ask-partysize") { state.askDukkanci.partySize = Number(event.target.value) || 1; return; }
  if (event.target.id === "ask-budget") { state.askDukkanci.budgetTry = Number(event.target.value) || 0; return; }
  if (event.target.id === "merchant-order-search") {
    state.merchantOrderSearch = event.target.value;
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".orders-table-card tbody tr").forEach(row => {
      const text = normalizeAr(row.textContent);
      row.style.display = !q || text.includes(q) ? "" : "none";
    });
  }
  if (event.target.id === "admin-order-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".orders-table-card tbody tr").forEach(row => {
      row.style.display = !q || normalizeAr(row.textContent).includes(q) ? "" : "none";
    });
  }
  if (event.target.id === "admin-store-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".admin-store-list article").forEach(card => {
      card.style.display = !q || normalizeAr(card.textContent).includes(q) ? "" : "none";
    });
  }
  if (event.target.id === "admin-complaint-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".complaint-list article").forEach(row => {
      row.style.display = !q || normalizeAr(row.textContent).includes(q) ? "" : "none";
    });
  }
  if (event.target.id === "fbads-max-km-input") {
    const v = Number(event.target.value);
    if (Number.isFinite(v) && v > 0) { state.fbadsMaxKm = v; render(); }
  }
  if (event.target.id === "admin-customer-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".customers-table-card tbody tr").forEach(row => {
      row.style.display = !q || normalizeAr(row.textContent).includes(q) ? "" : "none";
    });
  }
  if (event.target.name === "image" && event.target.closest("#merchant-product-form")) {
    const form = event.target.closest("form");
    form.imageData.value = "";
    const preview = document.getElementById("product-image-preview");
    const url = event.target.value.trim();
    if (preview) preview.innerHTML = url ? `<img src="${escAttr(url)}" alt="" onerror="this.parentNode.innerHTML='&#9888;'">` : icon("box");
  }
  if (event.target.name === "category" && event.target.closest("#merchant-product-form") && event.target.value === "__new__") {
    event.target.value = event.target.dataset.prev || "";
    const storeId = Number(event.target.closest("#merchant-product-form").dataset.storeId) || getMerchantStore().id;
    const storeName = (getStore(storeId) || getMerchantStore()).name;
    showModal(`
      <button class="modal-close" data-action="close-modal">${icon("close")}</button>
      <span class="section-kicker">${storeName}</span>
      <h2>إضافة تصنيف جديد</h2>
      <form id="add-cat-form" data-store-id="${storeId}" class="form-grid">
        <label class="input-label" style="grid-column:1/-1"><span>اسم التصنيف <i class="req">*</i></span><input name="catName" required placeholder="مثال: منتجات عضوية"></label>
        <button type="submit" class="primary-button full" style="grid-column:1/-1">${icon("check")} حفظ التصنيف</button>
      </form>
    `, "");
    return;
  }
  if (event.target.name === "category" && event.target.closest("#merchant-product-form")) {
    event.target.dataset.prev = event.target.value;
  }
  if (event.target.id === "store-product-search") {
    const q = event.target.value.trim().toLowerCase();
    state.storeProductSearch = q;
    // Live filter: update grid without full re-render
    const grid = document.getElementById("store-products-grid");
    const countEl = document.getElementById("store-products-count");
    if (grid) {
      let visible = 0;
      const cards = [...grid.querySelectorAll("article.product-card")];
      cards.forEach(card => {
        const name = (card.querySelector(".product-card__body") || card).textContent.toLowerCase();
        const show = !q || name.includes(q);
        card.style.display = show ? "" : "none";
        if (show) visible++;
      });
      if (countEl) countEl.textContent = q ? `${visible} نتيجة من ${cards.length}` : `${cards.length} منتجاً`;
      // First-party search log (spec §16): debounced, so a settled query logs once
      // with how many results it found — feeds the merchant «تقرير البحث».
      const { route: _r, id: _sid } = parseRoute();
      if (_r === "store" && q) {
        const sidNum = /^\d+$/.test(String(_sid)) ? Number(_sid) : ((stores.find(s => SLUG_MAP[s.id] === _sid) || {}).id);
        if (sidNum) logStoreSearch(sidNum, q, visible);
      }
    }
    // Show/hide clear button dynamically
    const clearBtn = document.querySelector(".store-search-clear");
    if (clearBtn) clearBtn.style.display = q ? "" : "none";
  }
  if (event.target.id === "merchant-customer-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".merchant-customers-table tbody tr").forEach(row => {
      row.style.display = (!q || normalizeAr(row.textContent).includes(q)) ? "" : "none";
    });
  }
  if (event.target.id === "merchant-syn-search") {
    state.merchantSynSearch = event.target.value;
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".syn-list .syn-row").forEach(row => {
      const nameEl = row.querySelector(".syn-row__name");
      row.style.display = (!q || normalizeAr(nameEl ? nameEl.textContent : "").includes(q)) ? "" : "none";
    });
  }
  if (event.target.id === "catalog-import-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".catalog-import-card").forEach(card => {
      const match = !q || (card.dataset.search || "").includes(q);
      card.style.display = match ? "" : "none";
    });
  }
  if (event.target.id === "admin-catalog-search") {
    const q = normalizeAr(event.target.value.trim());
    document.querySelectorAll(".catalog-review-card").forEach(card => {
      const match = !q || (card.dataset.search || "").includes(q);
      card.style.display = match ? "" : "none";
    });
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
  if (event.target.id === "admin-product-search") {
    state.adminProductSearch = event.target.value;
    const q = normalizeAr(event.target.value.trim());
    const section = document.querySelector(".product-management");
    if (section) section.querySelectorAll("article").forEach(article => {
      const nameEl = article.querySelector(".managed-product-name");
      article.style.display = (!q || normalizeAr(nameEl ? nameEl.textContent : "").includes(q)) ? "" : "none";
    });
  }
  if (event.target.name === "ratePerKm") {
    const rate = Math.min(40, Math.max(10, Number(event.target.value) || 10));
    const exampleRate = document.getElementById("delivery-example-rate");
    const exampleTotal = document.getElementById("delivery-example-total");
    if (exampleRate) exampleRate.textContent = rate;
    if (exampleTotal) exampleTotal.textContent = `${20 * rate} ل.ت`;
  }
});

// Footer «اشترك لتصلك آخر العروض»: validate a TR WhatsApp number and POST it to
// /api/subscribe (stores it in wa_contacts for the admin campaign sender).
async function submitFooterSubscribe(form) {
  const input = form.querySelector('input[name="phone"]');
  const btn = form.querySelector('button[type="submit"]');
  const statusEl = document.querySelector(".footer-subscribe__status");
  const setStatus = (msg, kind) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.hidden = false;
    statusEl.className = "footer-subscribe__status" + (kind ? " is-" + kind : "");
  };
  const digits = normalizePhone(input ? input.value : "").replace(/\D/g, ""); // → "90XXXXXXXXXX"
  if (digits.length !== 12 || !digits.startsWith("905")) {
    setStatus("يرجى إدخال رقم واتساب تركي صحيح (يبدأ بـ 5).", "error");
    if (input) input.focus();
    return;
  }
  if (btn) { btn.disabled = true; btn.dataset.label = btn.dataset.label || btn.textContent; btn.textContent = "جارٍ…"; }
  try {
    const r = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: digits })
    });
    const data = await r.json().catch(() => ({}));
    if (data && data.ok) {
      form.reset();
      setStatus("تمّ اشتراكك! ستصلك آخر العروض والأخبار على واتساب. 🎉", "success");
    } else {
      setStatus(data && data.error === "invalid_phone"
        ? "يرجى إدخال رقم واتساب تركي صحيح (يبدأ بـ 5)."
        : "تعذّر الاشتراك، حاول لاحقاً.", "error");
    }
  } catch (e) {
    setStatus("تعذّر الاتصال، تحقّق من الإنترنت وحاول مجدداً.", "error");
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label || "اشترك"; }
  }
}

document.addEventListener("submit", async event => {
  event.preventDefault();
  if (event.target.id === "footer-subscribe-form") { submitFooterSubscribe(event.target); return; }
  if (event.target.id === "ask-dukkanci-form") { submitAskDukkanci(event.target); return; }
  if (event.target.id === "ask-dukkanci-chat-form") { submitAskDukkanciChatReply(event.target, false); return; }
  if (event.target.id === "group-create-form") { submitCreateGroup(event.target); return; }
  if (event.target.id === "group-join-form") { submitJoinGroup(event.target); return; }
  if (event.target.id === "store-review-form") {
    const r = state._rateStore;
    if (!r || !r.stars) return;
    const btn = event.target.querySelector('button[type="submit"]');
    const comment = (event.target.querySelector('textarea[name="comment"]')?.value || "").trim();
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الإرسال…"; }
    submitStoreReview(r.storeId, r.orderId, r.stars, comment).then(ok => {
      if (ok) { state._rateStore = null; showToast("شكراً لتقييمك!", "success"); closeModal(); render(); }
      else {
        showToast("تعذّر إرسال التقييم، حاول لاحقاً", "");
        if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} إرسال التقييم`; }
      }
    });
    return;
  }
  if (event.target.id === "admin-login-form") {
    const input = document.getElementById("admin-login-input");
    const pwd = (input?.value || "").trim();
    if (!pwd) return;
    const btn = event.target.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ التحقق…"; }
    // Authenticate by sending the typed password ONCE via header (never in the
    // URL). The server returns a short-lived session token; we store only that.
    fetch("/api/notify-order?action=login", {
      method: "POST",
      headers: { "x-admin-key": pwd, "Content-Type": "application/json" },
      body: "{}"
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error("unauthorized"))))
      .then(data => {
        if (!data || !data.token) return Promise.reject(new Error("no token"));
        state.adminKey = data.token;
        sessionStorage.setItem("dukkanci-admin-token", data.token);
        autoEnablePush({ role: "admin", adminToken: data.token });
        render();
      })
      .catch(() => {
        if (btn) { btn.disabled = false; btn.textContent = "دخول"; }
        const card = event.target.closest(".admin-login-card");
        if (card && !card.querySelector(".admin-login-error")) {
          const p = document.createElement("p");
          p.className = "admin-login-error";
          p.textContent = "كلمة المرور غير صحيحة.";
          event.target.after(p);
        }
      });
    return;
  }
  if (event.target.id === "wa-reply-form") {
    const input = document.getElementById("wa-reply-input");
    const text = (input?.value || "").trim();
    if (!text) return;
    if (input) input.value = "";
    sendAdminReply(text);
    return;
  }
  if (event.target.id === "admin-plan-form") {
    const f = event.target;
    const val = n => (f.querySelector(`[name="${n}"]`)?.value || "");
    const value = {
      name: val("name").trim(),
      price: val("price").trim(),
      period: val("period").trim(),
      tagline: val("tagline").trim(),
      features: val("features").split("\n").map(s => s.trim()).filter(Boolean)
    };
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    adminApi("save-settings", { method: "POST", body: { key: "plan", value } })
      .then(() => { state.siteSettings = { ...state.siteSettings, plan: value }; showToast("تم حفظ الخطة بنجاح", "success"); render(); })
      .catch(() => { showToast("تعذّر حفظ الخطة", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ الخطة`; } });
    return;
  }
  if (event.target.id === "ai-provider-form") {
    const f = event.target;
    const val = n => (f.querySelector(`[name="${n}"]`)?.value || "").trim();
    const body = {
      id: f.dataset.id || undefined,
      provider_name: val("provider_name"),
      label: val("label"),
      service_type: val("service_type"),
      default_model: val("default_model"),
      api_key: val("api_key"),
      is_active: !!f.querySelector('[name="is_active"]')?.checked
    };
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    aiApi("save-provider", { method: "POST", body })
      .then(() => { state._adminAIEdit = null; state.adminAI = null; showToast("تم حفظ المزوّد", "success"); loadAdminAI(); })
      .catch(e => { showToast("تعذّر الحفظ — تحقّق من المفتاح", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ`; } });
    return;
  }
  if (event.target.id === "ai-feature-form") {
    const f = event.target;
    const body = {
      feature_name: f.dataset.feature,
      provider_id: (f.querySelector('[name="provider_id"]')?.value || "") || null,
      model_override: (f.querySelector('[name="model_override"]')?.value || "").trim(),
      is_enabled: !!f.querySelector('[name="is_enabled"]')?.checked
    };
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    aiApi("set-feature", { method: "POST", body })
      .then(() => { state.adminAI = null; showToast("تم حفظ إعداد الميزة", "success"); loadAdminAI(); })
      .catch(() => { showToast("تعذّر الحفظ", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ`; } });
    return;
  }
  if (event.target.id === "ai-test-form") {
    const f = event.target;
    const body = { feature: f.querySelector('[name="feature"]')?.value, text: (f.querySelector('[name="text"]')?.value || "").trim() };
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الاختبار…"; }
    aiApi("test", { method: "POST", body })
      .then(r => { state._adminAITestReply = r && r.ok ? r.reply : ""; render(); })
      .catch(() => { state._adminAITestReply = ""; showToast("تعذّر الاختبار", ""); render(); });
    return;
  }
  if (event.target.id === "kb-text-form") {
    const f = event.target;
    const v = n => (f.querySelector(`[name="${n}"]`)?.value || "").trim();
    const scope = v("scope");
    const body = { text: v("text"), title: v("title"), scope, store_id: scope === "store" ? v("store_id") : null };
    if (!body.text) { showToast("اكتب نصاً أولاً", ""); return; }
    if (scope === "store" && !body.store_id) { showToast("اختر المتجر", ""); return; }
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الفهرسة…"; }
    aiApi("kb-add-text", { method: "POST", body })
      .then(r => { state.adminKB = null; showToast(`تمت الفهرسة (${r.chunks} مقطع)`, "success"); loadAdminKB(); })
      .catch(() => { showToast("تعذّرت الفهرسة — تحقّق من مزوّد embeddings", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} إضافة وفهرسة`; } });
    return;
  }
  if (event.target.id === "kb-file-form") {
    const f = event.target;
    const scope = (f.querySelector('[name="scope"]')?.value || "platform");
    const store_id = scope === "store" ? (f.querySelector('[name="store_id"]')?.value || "") : null;
    const file = f.querySelector('[name="file"]')?.files?.[0];
    if (!file) { showToast("اختر ملفاً", ""); return; }
    if (scope === "store" && !store_id) { showToast("اختر المتجر", ""); return; }
    if (file.size > 3 * 1024 * 1024) { showToast("الملف أكبر من 3MB", ""); return; }
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الرفع…"; }
    const reader = new FileReader();
    reader.onload = () => {
      aiApi("kb-upload", { method: "POST", body: { file_name: file.name, mime: file.type, data_base64: String(reader.result), scope, store_id } })
        .then(r => { state.adminKB = null; showToast(`تمت الفهرسة (${r.chunks} مقطع)`, "success"); loadAdminKB(); })
        .catch(() => { showToast("تعذّر الرفع/الفهرسة", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("upload")} رفع وفهرسة`; } });
    };
    reader.onerror = () => { showToast("تعذّرت قراءة الملف", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("upload")} رفع وفهرسة`; } };
    reader.readAsDataURL(file);
    return;
  }
  if (event.target.id === "kb-test-form") {
    const f = event.target;
    const query = (f.querySelector('[name="query"]')?.value || "").trim();
    if (!query) return;
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ…"; }
    aiApi("kb-test", { method: "POST", body: { query } })
      .then(r => { state._adminKBTest = r && r.ok ? r : { chunks: [], answer: null }; render(); })
      .catch(() => { state._adminKBTest = { chunks: [], answer: null }; showToast("تعذّر الاختبار", ""); render(); });
    return;
  }
  if (event.target.id === "syn-search-form") {
    state._synQ = (event.target.querySelector('[name="q"]')?.value || "").trim();
    state.adminSyn = null;
    loadAdminSyn();
    return;
  }
  if (event.target.id === "syn-edit-form") {
    const f = event.target;
    const name = f.dataset.name || "";
    const rawv = (f.querySelector('[name="synonyms"]')?.value || "");
    const synonyms = rawv.split(/[،,\n]+/).map(s => s.trim()).filter(Boolean);
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    aiApi("syn-save", { method: "POST", body: { name, synonyms, dialects: synonyms.length ? { "مخصّص": synonyms } : {} } })
      .then(() => { closeModal(); showToast("تم حفظ المرادفات", "success"); loadAdminSyn(); })
      .catch(() => { showToast("تعذّر الحفظ", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ`; } });
    return;
  }
  if (event.target.id === "content-edit-form") {
    const f = event.target;
    const cfg = CONTENT_SECTIONS[f.dataset.section];
    if (!cfg) return;
    const value = {};
    cfg.fields.forEach(fld => { value[fld.name] = (f.querySelector(`[name="${fld.name}"]`)?.value || "").trim(); });
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    adminApi("save-settings", { method: "POST", body: { key: cfg.key, value } })
      .then(() => { state.siteSettings = { ...state.siteSettings, [cfg.key]: value }; showToast("تم الحفظ بنجاح", "success"); render(); })
      .catch(() => { showToast("تعذّر الحفظ", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ`; } });
    return;
  }
  if (event.target.id === "daily-deal-form") {
    const f = event.target;
    const image = (f.querySelector('[name="image"]')?.value || "").trim();
    const storeId = Number(f.querySelector('[name="storeId"]')?.value) || null;
    const productId = Number(f.querySelector('[name="productId"]')?.value) || null;
    // An image with no product would render a banner that leads nowhere.
    if (image && !productId) { showToast("اختر المنتج الذي تُربط به الصورة", ""); return; }
    const value = { image, storeId, productId };
    const btn = f.querySelector('button[type="submit"]');
    if (btn) { btn.disabled = true; btn.textContent = "جارٍ الحفظ…"; }
    adminApi("save-settings", { method: "POST", body: { key: "dailyDeal", value } })
      .then(() => { state.siteSettings = { ...state.siteSettings, dailyDeal: value }; showToast("تم حفظ عرض اليوم", "success"); render(); })
      .catch(() => { showToast("تعذّر الحفظ", ""); if (btn) { btn.disabled = false; btn.innerHTML = `${icon("check")} حفظ`; } });
    return;
  }
  if (event.target.id === "banner-form") {
    const f = event.target;
    const val = n => (f.querySelector(`[name="${n}"]`)?.value || "").trim();
    const title = val("title");
    if (!title) return;
    const placement = val("placement") || "home_top";
    const linkType = val("linkType") || "none";
    const linkValue = val("linkValue");
    const categoryKey = val("categoryKey");

    // Validate before saving rather than letting the banner silently never
    // render: activeBanners() drops anything whose target doesn't resolve, so a
    // typo'd store id would just look like "my banner disappeared".
    if (linkType !== "none" && !linkValue) { showToast("اكتب قيمة الرابط أو اختر «بلا رابط»", ""); return; }
    if (linkType === "store" && !getStore(Number(linkValue))) { showToast("لا يوجد متجر بهذا الرقم", ""); return; }
    if (linkType === "product" && !products.find(p => p.id === Number(linkValue))) { showToast("لا يوجد منتج بهذا الرقم", ""); return; }
    if (linkType === "category" && !CATEGORY_MAP[linkValue]) { showToast("slug القسم غير صحيح", ""); return; }
    if (linkType === "url" && !/^(https?:|tel:|mailto:|\/)/i.test(linkValue)) { showToast("الرابط يجب أن يبدأ بـ https:// أو / ", ""); return; }
    if (placement === "category_top" && !categoryKey) { showToast("اختر القسم الذي سيظهر فيه البانر", ""); return; }
    const startAt = val("startAt"), endAt = val("endAt");
    if (startAt && endAt && bannerTime(startAt, false) > bannerTime(endAt, true)) { showToast("تاريخ البداية بعد تاريخ الانتهاء", ""); return; }
    if (!val("headline") && !(f.querySelector('[name="image"]')?.value || "")) { showToast("أضِف صورة أو عنواناً على الأقل", ""); return; }

    const { items, limits } = bannerSettings();
    const editingId = f.dataset.id;
    const record = {
      id: editingId || bannerNewId(),
      title,
      placement,
      image: f.querySelector('[name="image"]')?.value || "",
      headline: val("headline"),
      sub: val("sub"),
      cta: val("cta"),
      linkType,
      linkValue,
      categoryKey: placement === "category_top" ? categoryKey : "",
      startAt,
      endAt,
      active: !!f.querySelector('[name="active"]')?.checked,
      sort: Number(val("sort")) || 0
    };
    const next = editingId && items.some(b => b.id === editingId)
      ? items.map(b => b.id === editingId ? { ...b, ...record } : b)
      : [...items, { ...record, createdAt: new Date().toISOString() }];
    closeModal();
    saveBannerSettings({ items: next, limits });
    showToast(editingId ? "تم تحديث البانر" : "تمت إضافة البانر", "success");
    return;
  }
  if (event.target.id === "category-form") {
    const f = event.target;
    const val = n => (f.querySelector(`[name="${n}"]`)?.value || "").trim();
    const name = val("name");
    if (!name) return;
    const image = (f.querySelector('[name="image"]')?.value || "");
    const items = categoriesList().map(c => ({ ...c }));
    const idxRaw = f.dataset.index;
    if (idxRaw !== "" && idxRaw != null && items[Number(idxRaw)]) {
      items[Number(idxRaw)] = { ...items[Number(idxRaw)], name, caption: val("caption"), image };
    } else {
      items.push({ name, caption: val("caption"), image, hidden: false });
    }
    closeModal();
    saveContentSetting("categories", { items });
    showToast("تم حفظ التصنيف", "success");
    return;
  }
  if (event.target.id === "add-cat-form") {
    const form = new FormData(event.target);
    const catName = (form.get("catName") || "").toString().trim();
    const storeId = Number(event.target.dataset.storeId);
    if (!catName) return;
    saveStoreExtraCategory(storeId, catName);
    closeModal();
    showToast(`تم إضافة تصنيف «${catName}»`, "success");
    render();
  }
  if (event.target.id === "product-form") {
    const product = getProduct(event.target.dataset.id);
    if (product.priceOnRequest) return;
    const selections = product.options.map((_, index) => Number(event.target.querySelector(`input[name="option-${index}"]:checked`)?.value || 0));
    const addonSelections = (product.addons || []).map((_, index) => index).filter(index => event.target.querySelector(`input[name="addon-${index}"]`)?.checked);
    const quantity = Number(document.getElementById("modal-quantity").textContent);
    const notes = event.target.elements.notes?.value || "";
    closeModal(); addToCart(product.id, quantity, selections, notes, addonSelections);
  }
  if (event.target.id === "merchant-product-form") {
    const f = event.target;
    if (f.category?.value === "__new__") { showToast("اختر تصنيفاً من القائمة أولاً", ""); return; }
    const submitBtn = f.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الحفظ..."; }
    const restoreSubmit = () => {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
    };
    // Variant rows show the FULL price per weight/size; stored internally as a
    // delta from the base price (unchanged storage shape — see openProductForm).
    const basePrice = Math.max(0, Math.round(Number(f.price.value) || 0));
    let options = [];
    const variantNames = Array.from(f.querySelectorAll('[name="variantName"]')).map(el => el.value.trim());
    const variantPrices = Array.from(f.querySelectorAll('[name="variantPrice"]')).map(el => el.value);
    if (variantNames.some(Boolean)) {
      const values = [], extra = [];
      variantNames.forEach((name, i) => {
        if (!name) return;
        const price = Math.max(0, Math.round(Number(variantPrices[i]) || 0));
        values.push(name); extra.push(price - basePrice);
      });
      if (values.length > 1) options = [{ name: "الحجم", values, extra }];
    }
    const addonNames = Array.from(f.querySelectorAll('[name="addonName"]')).map(el => el.value.trim());
    const addonPrices = Array.from(f.querySelectorAll('[name="addonPrice"]')).map(el => el.value);
    const addons = addonNames
      .map((name, i) => ({ name, price: Math.max(0, Math.round(Number(addonPrices[i]) || 0)) }))
      .filter(a => a.name);
    const data = {
      name: f.name.value.trim(),
      price: basePrice,
      unit: f.unit.value.trim(),
      category: f.category.value.trim() || "منتجات",
      image: (f.imageData.value || f.image.value.trim()) || "/assets/photos/store-market.jpg",
      description: f.description.value.trim(),
      available: f.available.checked,
      options,
      addons
    };
    // The advanceHours field only renders for home-kitchen stores — omit the key
    // entirely (rather than forcing 0) when it's absent, so editing a product from
    // a context where the field isn't shown (category changed since, admin view,
    // etc.) never silently wipes an existing prep-time requirement.
    if (f.advanceHours) data.advanceHours = Math.max(0, Number(f.advanceHours.value) || 0);
    if (!data.name) { restoreSubmit(); showToast("يرجى إدخال اسم المنتج"); return; }
    if (f.dataset.id) {
      const edited = getProduct(f.dataset.id);
      if (!edited) { restoreSubmit(); showToast("تعذّر العثور على المنتج لتعديله"); return; }
      const updatedProduct = { ...edited, ...data };
      const result = await pushProductCloud(updatedProduct);
      if (!result.ok) { restoreSubmit(); showToast(productSaveErrorMessage(result)); return; }
      Object.assign(edited, data);
      upsertCatalogProduct(edited);
      saveProductOverride(f.dataset.id, data);
      showToast("تم حفظ تعديلات المنتج", "success");
    } else {
      const formStoreId = Number(f.dataset.storeId) || getMerchantStore().id;
      const store = getStore(formStoreId) || getMerchantStore();
      const newId = Math.max(0, ...allProducts.map(p => Number(p.id) || 0), ...products.map(p => Number(p.id) || 0)) + 1;
      const newProduct = { id: newId, storeId: store.id, sourceId: `m-${newId}`, imageFit: "cover", options: [], featured: false, ...data };
      const result = await pushProductCloud(newProduct);
      if (!result.ok) { restoreSubmit(); showToast(productSaveErrorMessage(result)); return; }
      upsertCatalogProduct(newProduct);
      saveCustomProduct(newProduct);
      showToast("تمت إضافة المنتج بنجاح", "success");
    }
    state.merchantTab = "products";
    closeModal(); render();
  }
  if (event.target.id === "merchant-coupon-form") {
    const f = event.target;
    const store = getMerchantStore();
    const submitBtn = f.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الحفظ..."; }
    const restore = () => { if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; } };
    const coupon = {
      id: f.dataset.id ? Number(f.dataset.id) : null,
      code: f.code.value, discount_type: f.discount_type.value, value: f.value.value,
      max_discount: f.max_discount.value, min_subtotal: f.min_subtotal.value,
      ends_at: f.ends_at.value || null, usage_limit: f.usage_limit.value, per_customer_limit: f.per_customer_limit.value
    };
    if (coupon.discount_type !== "free_delivery" && !(Number(coupon.value) > 0)) { restore(); showToast("أدخل قيمة الخصم"); return; }
    try {
      const r = await fetch("/api/notify-order?action=merchant-coupon-save", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ storeId: store.id, coupon }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.ok === false) {
        restore();
        showToast(data.error === "duplicate_code" ? "هذا الكود مستخدم بالفعل — اختر كوداً آخر"
          : data.error === "bad_code" ? "صيغة الكود غير صالحة (3-24 حرفاً لاتينياً/رقماً)"
          : data.error === "bad_value" ? "قيمة الخصم غير صالحة (النسبة 1-90)"
          : data.error === "unauthorized" ? "انتهت جلسة المتجر. سجّل الدخول من جديد."
          : "تعذّر حفظ الكود", "");
        return;
      }
      state._merchantCoupons = null; // re-fetch the fresh list on next render
      closeModal();
      showToast(coupon.id ? "تم حفظ تعديلات الكود" : "تم إنشاء كود الخصم 🎉", "success");
      render();
    } catch (e) { restore(); showToast("خطأ في الاتصال", ""); }
    return;
  }
  if (event.target.id === "admin-coupon-form") {
    const f = event.target;
    const submitBtn = f.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الحفظ..."; }
    const restore = () => { if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; } };
    const coupon = {
      id: f.dataset.id ? Number(f.dataset.id) : null,
      code: f.code.value, discount_type: f.discount_type.value, value: f.value.value,
      max_discount: f.max_discount.value, min_subtotal: f.min_subtotal.value,
      ends_at: f.ends_at.value || null, usage_limit: f.usage_limit.value, per_customer_limit: f.per_customer_limit.value
    };
    if (coupon.discount_type !== "free_delivery" && !(Number(coupon.value) > 0)) { restore(); showToast("أدخل قيمة الخصم"); return; }
    const storeId = f.storeId.value ? Number(f.storeId.value) : null; // empty = عام (كل المتاجر)
    try {
      const r = await fetch("/api/notify-order?action=merchant-coupon-save", { method: "POST", headers: merchantHeaders(true), body: JSON.stringify({ storeId, coupon }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.ok === false) {
        restore();
        showToast(data.error === "duplicate_code" ? "هذا الكود مستخدم بالفعل — اختر كوداً آخر"
          : data.error === "bad_code" ? "صيغة الكود غير صالحة (3-24 حرفاً لاتينياً/رقماً)"
          : data.error === "bad_value" ? "قيمة الخصم غير صالحة (النسبة 1-90)"
          : "تعذّر حفظ الكوبون", "");
        return;
      }
      state._adminCoupons = null; // re-fetch the fresh list on next render
      closeModal();
      showToast(coupon.id ? "تم حفظ تعديلات الكوبون" : "تم إنشاء الكوبون 🎉", "success");
      render();
    } catch (e) { restore(); showToast("خطأ في الاتصال", ""); }
    return;
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
    if (!state.cart.length) return;
    const els = event.target.elements;
    const isPickup = els.fulfillment.value === "pickup";
    // Contact info is required so the merchant can actually reach the customer.
    const contactName = (els.contactName?.value || "").trim();
    const contactPhone = (els.contactPhone?.value || "").trim();
    if (!contactName) { showToast("يرجى إدخال اسمك للتواصل"); els.contactName?.focus(); return; }
    if (contactPhone.replace(/\D/g, "").length < 10) { showToast("يرجى إدخال رقم واتساب صحيح للتواصل"); els.contactPhone?.focus(); return; }
    if (!els.terms.checked) { showToast("يرجى الموافقة على سياسة الطلب أولاً"); return; }
    if (!isPickup && !els.address.value) { showToast("يرجى اختيار عنوان التوصيل"); return; }
    // Home-kitchen products can require a minimum advance-notice window. The
    // render-time day/time picker only approximates this at day granularity —
    // re-validate here against the ACTUAL elapsed hours between now and the
    // chosen day+time slot, since e.g. placing the order at 23:00 and picking
    // "غداً" + the earliest time slot is barely ~15h away, not the full 24h.
    // Also re-checks in case the <select> was tampered with (UI only disables
    // too-soon options rather than removing them).
    const cartLeadHours = cartRequiredLeadHours(state.cart);
    if (cartLeadHours > 0) {
      const dayLabels = ["اليوم", "غداً", "بعد غد"];
      const chosenDayIndex = dayLabels.findIndex(l => (els.day?.value || "").startsWith(l));
      const slotStartHour = { "14:00 - 15:00": 14, "17:00 - 18:00": 17 }[els.time?.value];
      const now = new Date();
      const chosenDay = chosenDayIndex === -1 ? null : new Date(now.getTime() + chosenDayIndex * 86400000);
      const targetTime = (chosenDay && slotStartHour != null)
        ? new Date(chosenDay.getFullYear(), chosenDay.getMonth(), chosenDay.getDate(), slotStartHour, 0, 0)
        : null;
      if (!targetTime || targetTime.getTime() < now.getTime() + cartLeadHours * 3600000) {
        showToast(`بعض منتجات طلبك تحتاج وقت تحضير مسبق (${cartLeadHours} ساعة على الأقل) — يرجى اختيار موعد لاحق`);
        return;
      }
    }
    const totals = cartTotals(els.address.value);
    const deliverySettings = getDeliverySettings(state.cart[0].storeId);
    if (!isPickup && deliverySettings.mode === "distance" && (!totals.quote || totals.quote.exceedsMaxDistance)) {
      showToast(totals.quote?.exceedsMaxDistance ? "العنوان خارج نطاق توصيل هذا المتجر" : "تعذر حساب التوصيل لهذا العنوان");
      return;
    }
    // Persist contact to the profile so it prefills next time and ties orders together.
    state.customerProfile = { ...state.customerProfile, name: contactName, phone: contactPhone };
    // Feature 2: apply the coupon discount to the charged total (free-delivery is
    // already reflected in totals.delivery). Floor at 0 so it can never go negative.
    const orderDiscount = totals.discount || 0;
    const orderCredit = totals.creditApplied || 0;   // Feature 4: wallet credit spent
    const finalTotal = Math.max(0, totals.subtotal + (isPickup ? 0 : totals.delivery) - orderDiscount - orderCredit);
    const storeId = state.cart[0].storeId;
    // If the store is outside its working hours, the order is still accepted but
    // will only be fulfilled the next working day — flag it and tell the customer.
    const storeClosedNow = !isStoreOpenNow(getStore(storeId));
    const addrObj = isPickup ? null : (getCheckoutAddress(els.address.value) || getDefaultAddress());
    // Snapshot exactly what was ordered (incl. productId so reorder can rebuild it).
    const lineItems = state.cart.map(it => {
      const p = getProduct(it.productId);
      return { productId: it.productId, name: p ? p.name : "منتج", qty: it.quantity, price: it.finalPrice, options: it.optionsText || "", optionSelections: it.optionSelections || [], notes: it.notes || "" };
    });
    const newOrder = {
      id: `DK-${Date.now().toString().slice(-9)}`,
      customer: contactName,
      customerPhone: contactPhone,
      storeId,
      total: finalTotal,
      status: "طلب جديد",
      time: "الآن",
      items: state.cart.length,
      fulfillment: isPickup ? "pickup" : "delivery",
      address: isPickup ? "" : (addrObj?.address || ""),
      addressDetails: isPickup ? "" : (addrObj?.details || ""),
      lineItems,
      notes: (state.cartNote || "").trim(),
      substitution: els.substitution?.value || "",
      payment: ({ cash: "نقداً عند التسليم", card: "بطاقة عند التسليم (POS مع المندوب)", bank: "تحويل بنكي" })[els.payment?.value] || "نقداً عند التسليم",
      scheduleDay: els.day?.value || "",
      scheduleTime: els.time?.value || "",
      closedWhenOrdered: storeClosedNow,
      deliveryDetails: isPickup ? null : totals.quote,
      discount: orderDiscount,
      couponCode: state.coupon ? state.coupon.code : "",
      creditUsed: orderCredit,
      createdAt: new Date().toISOString()
    };
    const itemCount = newOrder.lineItems.reduce((s, i) => s + (i.qty || 1), 0);
    const etaMin = (deliverySettings.prepMinutes || 20) + (isPickup ? 0 : 25);
    // The actual order placement — run now if the phone is already verified, else
    // only after the WhatsApp OTP is confirmed (anti-fraud gate below).
    const commitOrder = () => {
      // Campaign attribution: which source/campaign brought this real order.
      try { newOrder.attribution = window.DUKKANCI_TRACKING?.getAttribution() || null; } catch (e) {}
      state.myOrders.unshift(newOrder);
      state.orders.unshift(newOrder);
      pushOrderCloud(newOrder, { keepalive: true });
      notifyOrderWhatsapp(newOrder);
      // Feature 2: record the coupon redemption server-side (enforces usage limits).
      if (isFeatureOn("feature_conversion_drivers") && state.coupon) {
        recordCouponRedemption(newOrder.id, storeId, totals.subtotal, contactPhone);
      }
      // Feature 4: qualify any pending referral + spend the chosen credit (server-validated).
      if (isFeatureOn("feature_community_retention") && state.user) {
        settleReferralAndCredit(newOrder.id, orderCredit);
      }
      window.DUKKANCI_TRACKING?.track("Purchase", { ids: state.cart.map(i => i.productId), value: finalTotal, orderId: newOrder.id, count: state.cart.length, store_id: storeId, phone: contactPhone, customer_id: state.user?.id });
      if (askDukkanciCartOrigin) {
        window.DUKKANCI_TRACKING?.track("ask_dukkanci_checkout_completed", { order_id: newOrder.id, value: finalTotal, store_id: storeId });
        askDukkanciCartOrigin = false;
      }
      state.cart = [];
      state.cartNote = "";
      state.coupon = null;
      state.useCredit = false;
      state.deliveryQuote = null;
      state.checkoutLocation = null;
      state.checkoutSelectedAddressId = null;
      saveState(); updateCartBadges();
      // The cart became an order — retire the snapshot so this customer is never
      // sent a "you left something in your cart" reminder for what they just bought.
      markCartConverted();
      // The phone is now known for this device, which moves it out of the
      // "installed but never ordered" segment on the next campaign build.
      registerDevice();
      showModal(`<div class="success-animation">${icon("check")}</div><h2>تم إرسال طلبك بنجاح</h2>
        <p>طلبك رقم <strong dir="ltr">${newOrder.id}</strong> وصل إلى <strong>${getStore(storeId).name}</strong>.</p>
        <div class="order-success-summary">
          <span>${icon("box")}<small>المنتجات</small><b>${itemCount.toLocaleString("ar")}</b></span>
          <span>${icon("wallet")}<small>الإجمالي</small><b>${money(finalTotal)}</b></span>
          <span>${icon(isPickup ? "store" : "bike")}<small>${isPickup ? "الاستلام" : "التوصيل إلى"}</small><b>${isPickup ? "من المتجر" : (newOrder.address || "عنوانك")}</b></span>
          <span>${icon("clock")}<small>${storeClosedNow ? "موعد التنفيذ" : "الوقت المتوقع"}</small><b>${storeClosedNow ? "اليوم التالي" : `~${etaMin} دقيقة`}</b></span>
        </div>
        ${storeClosedNow ? `<p class="success-note order-closed-note">${icon("clock")} المتجر مغلق الآن — تم استلام طلبك وسيتم تنفيذه في اليوم التالي عند فتح المتجر.</p>` : ""}
        <p class="success-note">${icon("whatsapp")} سنخبرك عبر واتساب على <strong dir="ltr">${escAttr(contactPhone)}</strong> فور تأكيد المتجر.</p>
        <div class="modal-actions"><button class="secondary-button" data-action="close-modal">متابعة التسوق</button><button class="primary-button" data-action="go-orders">تتبّع الطلب</button></div>`, "success-modal");
    };
    // Anti-fraud: a number must be confirmed via a WhatsApp OTP once before its first
    // order goes through. Already-verified numbers skip straight to placing the order.
    const verifyPhone = normalizePhone(contactPhone);
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ إرسال الطلب..."; }
    if (state.verifiedPhone === verifyPhone) commitOrder();
    else await startCheckoutOtp(verifyPhone, contactPhone, commitOrder);
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
  }
  if (event.target.id === "email-auth-form") {
    submitEmailAuth(event.target);
  }
  if (event.target.id === "login-form") {
    sendWhatsappOtp(event.target);
  }
  if (event.target.id === "merchant-pw-form") {
    submitMerchantPwLogin(event.target);
  }
  if (event.target.id === "otp-form") {
    verifyWhatsappOtp(event.target);
  }
  if (event.target.id === "order-otp-form") {
    verifyOrderOtp(event.target);
  }
  if (event.target.id === "join-form") {
    submitJoinForm(event.target);
    return;
  }
  if (event.target.id === "customer-profile-form") {
    const form = new FormData(event.target);
    const wantNotif = form.get("notifications") === "on";
    state.customerProfile = {
      name: form.get("name").trim(),
      phone: form.get("phone").trim(),
      email: form.get("email").trim(),
      notifications: wantNotif
    };
    saveState(); render(); showToast("تم حفظ بيانات حسابك", "success");
    // Sync the browser push subscription with the toggle. Needs a phone to bind
    // order-status notifications to this customer.
    if (wantNotif && state.customerProfile.phone) {
      enablePush({ role: "customer", customerPhone: state.customerProfile.phone })
        .then(ok => { if (ok) showToast("تم تفعيل إشعارات حالة الطلب 🔔", "success"); });
    } else if (!wantNotif) {
      disablePush();
    }
  }
  if (event.target.id === "profile-setup-form") {
    const form = new FormData(event.target);
    // save profile
    state.customerProfile = { ...state.customerProfile, name: form.get("name").trim(), phone: form.get("phone").trim() };
    // save address — two modes: named zone (bina+daire only) vs full Turkish address
    const namedZone = (form.get("namedZone") || "").trim();
    let structured, addrParts, detailParts;
    if (namedZone) {
      // zone mode: only bina + daire needed
      const bina = (form.get("zf_bina") || "").trim();
      const daire = (form.get("zf_daire") || "").trim();
      structured = { bina, daire };
      addrParts = [namedZone];
      detailParts = [bina ? `Bina:${bina}` : "", daire ? `D:${daire}` : ""].filter(Boolean);
    } else {
      structured = { il: (form.get("sf_il")||"").trim(), ilce: (form.get("sf_ilce")||"").trim(), mahalle: (form.get("sf_mahalle")||"").trim(), sokak: (form.get("sf_sokak")||"").trim(), bina: (form.get("sf_bina")||"").trim(), kat: (form.get("sf_kat")||"").trim(), daire: (form.get("sf_daire")||"").trim() };
      addrParts = [structured.mahalle, structured.ilce, structured.il].filter(Boolean);
      detailParts = [structured.sokak, structured.bina ? `No:${structured.bina}` : "", structured.kat ? `Kat:${structured.kat}` : "", structured.daire ? `D:${structured.daire}` : ""].filter(Boolean);
    }
    // Named zones use a fixed fee (no coordinates needed); a full address needs
    // geocoded lat/lng or every distance-mode store will fail to quote delivery.
    let lat = null, lng = null;
    if (!namedZone && addrParts.length) {
      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "جارٍ تحديد الموقع..."; }
      const hits = await googleSearchPlaces(addrParts.join("، "));
      if (hits.length) { lat = hits[0].lat; lng = hits[0].lng; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalLabel; }
    }
    const addressData = { id: Date.now(), label: "المنزل", address: addrParts.join("، "), details: detailParts.join(" "), structured, namedZone, lat, lng, isDefault: true };
    state.customerAddresses = state.customerAddresses.map(a => ({ ...a, isDefault: false }));
    state.customerAddresses.unshift(addressData);
    saveState();
    syncAddressesToCloud();
    closeModal();
    // now actually add the pending product to cart
    const pid = Number(event.target.dataset.pid);
    const qty = Number(event.target.dataset.qty) || 1;
    const opts = JSON.parse(event.target.dataset.opts || "[]");
    const notes = event.target.dataset.notes || "";
    const addons = JSON.parse(event.target.dataset.addons || "[]");
    if (pid) addToCart(pid, qty, opts, notes, addons);
    return;
  }
  if (event.target.id === "customer-address-form") {
    const form = new FormData(event.target);
    const addressId = Number(event.target.dataset.id);
    const wasDefault = state.customerAddresses.find(address => address.id === addressId)?.isDefault;
    const makeDefault = form.get("isDefault") === "on" || !state.customerAddresses.length || Boolean(wasDefault);
    // build structured Turkish address fields (auto-filled from the map pin,
    // manually editable via the pencil toggle)
    const structured = { il: (form.get("sf_il")||"").trim() || "إسطنبول", ilce: (form.get("sf_ilce")||"").trim(), mahalle: (form.get("sf_mahalle")||"").trim(), sokak: (form.get("sf_sokak")||"").trim(), bina: (form.get("sf_bina")||"").trim(), kat: (form.get("sf_kat")||"").trim(), daire: (form.get("sf_daire")||"").trim() };
    let lat = Number(form.get("lat")) || null;
    let lng = Number(form.get("lng")) || null;
    // The delivery point must exist: either a map pin (fills everything) or a
    // manually-typed mahalle at minimum.
    if (!lat && !structured.mahalle) { showToast("حدّد موقعك على الخريطة أو أدخل الحي يدوياً بزر التعديل"); return; }
    // Manual pencil-edit path never sets lat/lng from the map — geocode the typed
    // address so distance-based delivery quotes still work for this address.
    if (!lat && structured.mahalle) {
      const submitBtn = event.target.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "جارٍ تحديد الموقع..."; }
      const hits = await googleSearchPlaces([structured.sokak, structured.mahalle, structured.ilce, structured.il].filter(Boolean).join("، "));
      if (hits.length) { lat = hits[0].lat; lng = hits[0].lng; }
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = originalLabel; }
    }
    // compose a readable address string from structured fields
    const note = (form.get("note") || "").trim();
    const addrParts = [structured.mahalle, structured.ilce, structured.il].filter(Boolean);
    const detailParts = [structured.sokak, structured.bina ? `No:${structured.bina}` : "", structured.kat ? `Kat:${structured.kat}` : "", structured.daire ? `D:${structured.daire}` : ""].filter(Boolean);
    const composedAddress = addrParts.join("، ");
    const composedDetails = [detailParts.join(" "), note].filter(Boolean).join(" — ");
    const namedZone = (form.get("namedZone") || "").trim();
    const addressData = {
      id: addressId || Date.now(),
      label: (form.get("label") || "").trim() || "المنزل",
      address: composedAddress,
      details: composedDetails,
      note,
      structured,
      namedZone,
      contactName: (form.get("contactName") || "").trim(),
      contactPhone: (form.get("contactPhone") || "").trim(),
      lat,
      lng,
      isDefault: makeDefault
    };
    if (makeDefault) state.customerAddresses = state.customerAddresses.map(address => ({ ...address, isDefault: false }));
    if (addressId) state.customerAddresses = state.customerAddresses.map(address => address.id === addressId ? addressData : address);
    else state.customerAddresses.push(addressData);
    saveState(); syncAddressesToCloud(); closeModal(); render(); showToast(addressId ? "تم تحديث العنوان" : "تمت إضافة العنوان", "success");
    // Saved from checkout (picker → new/edit): select it right away and re-quote.
    if (state.route === "checkout") applyCheckoutAddressSelection(String(addressData.id));
  }
  // (The old insecure phone-only merchant login was removed — merchants now
  //  authenticate via Supabase Auth: see merchantLogin()/resolveMerchantStores().)
  if (event.target.id === "merchant-store-form") {
    const form = new FormData(event.target);
    const storeId = Number(event.target.dataset.storeId);
    const store = getStore(storeId);
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الحفظ..."; }
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
      store.bankDetails = (form.get("bankDetails") || "").toString().trim();
      const paymentMethods = { cash: form.get("payCash") === "on", card: form.get("payCard") === "on", bank: form.get("payBank") === "on" };
      if (!paymentMethods.cash && !paymentMethods.card && !paymentMethods.bank) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
        showToast("يجب اختيار طريقة دفع واحدة على الأقل");
        return;
      }
      store.paymentMethods = paymentMethods;
      store.minOrder = Math.max(0, Number(form.get("minOrder")) || 0);
      store.open = form.get("storeOpen") === "on";
      store.coverImage = (form.get("coverImage") || "").toString().trim();
      const rawSlug = (form.get("storeSlug") || "").toString().trim();
      if (rawSlug) store.slug = slugify(rawSlug);
      // Distance-based delivery is priced from store.location for every customer, so the
      // pin edited here must reach it (and Supabase via pushStoreCloud) — previously it was
      // only written to the merchant's own localStorage-only state.storeLocations, so a
      // corrected pin never reached real customers' distance calculations.
      const storeLat = Number(form.get("storeLat"));
      const storeLng = Number(form.get("storeLng"));
      if (Number.isFinite(storeLat) && Number.isFinite(storeLng)) store.location = { lat: storeLat, lng: storeLng };
      const storeSaved = await pushStoreCloud(store);
      if (!storeSaved.ok) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
        // handleMerchantSessionExpired() (called from within pushStoreCloud) already
        // showed its own toast and bounced to the login screen for 401/403 — don't
        // pile a misleading "check your connection" toast on top of that.
        if (storeSaved.status !== 401 && storeSaved.status !== 403) showToast("تعذّر حفظ بيانات المتجر، تحقّق من الاتصال وحاول مجدداً");
        return;
      }
    }
    const ratePerKm = Math.min(40, Math.max(10, Number(form.get("ratePerKm")) || 15));
    const zones = [];
    for (let zi = 0; form.has(`zone-label-${zi}`); zi++) {
      const label = (form.get(`zone-label-${zi}`) || "").toString().trim();
      const match = (form.get(`zone-match-${zi}`) || "").toString().split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
      const fee = Math.max(0, Number(form.get(`zone-fee-${zi}`)) || 0);
      if (label && match.length) zones.push({ label, match, fee });
    }
    state.deliverySettings[storeId] = {
      mode: form.get("distanceEnabled") === "on" ? "distance" : "fixed",
      fixedFee: Math.max(0, Number(form.get("fixedFee")) || 0),
      ratePerKm,
      prepMinutes: Math.min(120, Math.max(5, Number(form.get("prepMinutes")) || 20)),
      maxRoundTripKm: Math.min(200, Math.max(5, Number(form.get("maxRoundTripKm")) || 60)),
      namedZones: zones
    };
    saveNamedZonesCloud(storeId, zones);
    state.deliveryQuote = null;
    saveState();
    render();
    if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
    showToast("تم حفظ بيانات المتجر وإعدادات التوصيل", "success");
  }
  if (event.target.id === "customer-complaint-form") {
    const form = event.target;
    const fd = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الإرسال..."; }
    const orderId = (fd.get("orderId") || "").toString();
    const order = orderId ? (state.myOrders || []).find(o => o.id === orderId) : null;
    const payload = {
      subject: (fd.get("subject") || "").toString().trim(),
      message: (fd.get("message") || "").toString().trim(),
      orderId: orderId || null,
      customer: (state.customerProfile && state.customerProfile.name) || null,
      store: order ? getStore(order.storeId).name : null
    };
    try {
      const r = await fetch("/api/notify-order?action=complaint-create", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.ok === false) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
        showToast("تعذّر إرسال الشكوى — حاول مرة أخرى", "");
        return;
      }
      const c = data.complaint || {};
      state.customerComplaints.unshift({
        id: c.id, subject: payload.subject, orderId: payload.orderId, message: payload.message,
        status: c.status || "شكوى جديدة",
        date: new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(new Date(c.created_at || Date.now()))
      });
      saveState(); render(); showToast("تم إرسال الشكوى إلى فريق الدعم", "success");
    } catch (e) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      showToast("خطأ في الاتصال", "");
    }
  }
  if (event.target.id === "admin-complaint-form") {
    const form = event.target;
    const id = form.dataset.id;
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : "";
    if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = "جارٍ الحفظ..."; }
    try {
      const data = await adminApi("complaint-update", {
        method: "POST",
        body: { id, status: form.status.value, response: form.response.value.trim() }
      });
      if (data.ok === false) {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
        showToast("تعذّر تحديث الشكوى", "");
        return;
      }
      const list = state._adminComplaints || [];
      const idx = list.findIndex(x => x.id === id);
      if (idx > -1 && data.complaint) list[idx] = data.complaint;
      closeModal();
      showToast("تم حفظ التحديث", "success");
      render();
    } catch (e) {
      if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = submitLabel; }
      showToast("تعذّر تحديث الشكوى", "");
    }
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

// ───────────────────────── Web Push subscriptions ─────────────────────────
// The browser subscribes to push, then we register that subscription with the
// backend (api/notify-order.js → push_subscriptions). The server later sends an
// encrypted push on new orders (store/admin) and status changes (customer).
function pushSupported() {
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
async function getVapidKey() {
  if (window.VAPID_PUBLIC_KEY) return window.VAPID_PUBLIC_KEY;
  try {
    const r = await fetch("/api/config", { headers: { Accept: "application/json" } });
    const j = await r.json();
    if (j && j.vapidPublicKey) { window.VAPID_PUBLIC_KEY = j.vapidPublicKey; return j.vapidPublicKey; }
  } catch (e) {}
  return null;
}
// Subscribe this browser and register it with the backend.
//   meta = { role:'customer', customerPhone }
//        | { role:'store', storeId, token }      (merchant token)
//        | { role:'admin', adminToken }
async function enablePush(meta) {
  const quiet = !!meta.quiet;
  if (!pushSupported()) { if (!quiet) showToast("متصفحك لا يدعم الإشعارات"); return false; }
  let perm = Notification.permission;
  if (perm === "default") perm = await Notification.requestPermission();
  if (perm !== "granted") { if (!quiet) showToast("لم يتم تفعيل الإشعارات (الإذن مرفوض)"); return false; }
  const key = await getVapidKey();
  if (!key) { if (!quiet) showToast("الإشعارات غير مُهيّأة على الخادم بعد"); return false; }
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(key) });
    const json = sub.toJSON();
    const headers = { "Content-Type": "application/json" };
    if (meta.token) headers["x-merchant-token"] = meta.token;
    if (meta.adminToken) headers["x-admin-token"] = meta.adminToken;
    if (meta.sbToken) headers["x-sb-token"] = meta.sbToken;
    const r = await fetch("/api/notify-order?action=push-subscribe", {
      method: "POST", headers,
      body: JSON.stringify({
        endpoint: json.endpoint, keys: json.keys,
        role: meta.role || "customer",
        customerPhone: meta.customerPhone || "",
        storeId: meta.storeId || null,
        userAgent: navigator.userAgent
      })
    });
    return r.ok;
  } catch (e) { console.warn("push subscribe failed:", e.message); return false; }
}
// Auto-subscribe to push at login time, for ANY login method. Quiet (no nagging
// toasts) and never re-prompts once the user has explicitly denied permission.
// For the Supabase-session path (meta.supabase) we attach the live access token so
// the server can verify store ownership without a merchant password token.
async function autoEnablePush(meta) {
  if (!pushSupported()) return false;
  if (Notification.permission === "denied") return false; // respect a prior "no"
  const m = Object.assign({ quiet: true }, meta);
  if (m.supabase) {
    try {
      const { data } = await window.supabaseClient.auth.getSession();
      const tok = data && data.session && data.session.access_token;
      if (!tok) return false;
      m.sbToken = tok;
    } catch (e) { return false; }
  }
  return enablePush(m);
}
// Unsubscribe this browser and remove the row.
async function disablePush() {
  if (!pushSupported()) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return;
    const endpoint = sub.endpoint;
    await sub.unsubscribe().catch(() => {});
    await fetch("/api/notify-order?action=push-unsubscribe", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint })
    }).catch(() => {});
  } catch (e) {}
}

// ══════════════════════ Notification system (customer side) ═════════════════
// Device registry + cart snapshots + the customer notification inbox.
// Server: api/notifications.js. Schema: migrations/20260720_notifications_system.sql.
//
// Why the device registry exists at all: before it, the platform had no record
// that anyone had ever installed anything. `orders.source` was 'web' on 13 of 13
// rows and `tracking_events.event_source` was 'web' on 7,661 of 7,661, so "who
// installed the app but never ordered" was not a hard question — it was an
// unanswerable one. Same for carts: they lived only in localStorage, so the
// server could not know a cart existed, let alone that it was abandoned.
//
// Everything here fails silently and never blocks the storefront. A customer
// must never see a checkout break because a notification endpoint was down.

const DEVICE_UID_KEY = "dukkanci-device-uid";

// Stable install id, generated once and kept forever. 128 bits of randomness
// because this value is the read key for the customer's own inbox — it must not
// be guessable by a third party. (Same reasoning as an order's public_token.)
function getDeviceUid() {
  let uid = "";
  try { uid = localStorage.getItem(DEVICE_UID_KEY) || ""; } catch (e) { return null; }
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(uid)) {
    const buf = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? window.crypto.getRandomValues(buf) : buf.forEach((_, i) => buf[i] = Math.floor(Math.random() * 256));
    uid = Array.from(buf).map(b => b.toString(16).padStart(2, "0")).join("");
    try { localStorage.setItem(DEVICE_UID_KEY, uid); } catch (e) { return null; }
  }
  return uid;
}

// 'pwa' matters: an installed PWA is an app install for targeting purposes even
// though it runs in a browser engine, so it belongs in the same segment as the
// native builds rather than with casual web traffic.
function detectPlatform() {
  try {
    if (window.Capacitor && window.Capacitor.getPlatform) {
      const p = window.Capacitor.getPlatform();
      if (p === "android" || p === "ios") return p;
    }
    const standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || window.navigator.standalone;
    return standalone ? "pwa" : "web";
  } catch (e) { return "web"; }
}

async function notifApi(action, body) {
  try {
    const r = await fetch(`/api/notifications?action=${encodeURIComponent(action)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });
    if (!r.ok) return null;
    return await r.json().catch(() => null);
  } catch (e) { return null; }
}

async function registerDevice() {
  const uid = getDeviceUid();
  if (!uid) return;
  const payload = {
    device_uid: uid,
    platform: detectPlatform(),
    locale: "ar",
    customer_phone: state.verifiedPhone || (state.customerProfile && state.customerProfile.phone) || null
  };
  // Link this device to its browser push subscription when one exists, so a
  // campaign can reach it without a second lookup path.
  try {
    if (pushSupported()) {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub && sub.endpoint) { payload.push_channel = "webpush"; payload.push_endpoint = sub.endpoint; }
    }
  } catch (e) {}
  await notifApi("register-device", payload);
}

// ── Cart snapshot ───────────────────────────────────────────────────────────
// Debounced hard: saveState() runs on every quantity tap, and a request per tap
// would be both wasteful and a worse signal (we want the settled cart, not each
// keystroke of it).
let _cartSyncTimer = null;
let _lastCartSig = "";

function scheduleCartSync() {
  if (_cartSyncTimer) clearTimeout(_cartSyncTimer);
  _cartSyncTimer = setTimeout(() => { _cartSyncTimer = null; syncCartSnapshot(); }, 4000);
}

async function syncCartSnapshot() {
  const uid = getDeviceUid();
  if (!uid) return;
  const cart = Array.isArray(state.cart) ? state.cart : [];

  // SUMMARY ONLY — deliberate privacy decision: store, count, subtotal and
  // product names. No options, no addons, no customer notes, no address. Enough
  // for «سلتك تنتظرك في {المتجر}» and an abandoned-value report, nothing more.
  const first = cart[0];
  const store = first ? getStore(first.storeId) : null;
  const sig = JSON.stringify(cart.map(i => [i.id, i.qty]));
  if (sig === _lastCartSig) return;           // nothing actually changed
  _lastCartSig = sig;

  await notifApi("cart-sync", {
    device_uid: uid,
    store_id: store ? store.id : null,
    store_name: store ? store.name : null,
    item_count: cart.reduce((n, i) => n + (Number(i.qty) || 1), 0),
    subtotal: cart.reduce((n, i) => n + (Number(i.price) || 0) * (Number(i.qty) || 1), 0),
    item_names: cart.map(i => i.name).filter(Boolean).slice(0, 20),
    customer_phone: state.verifiedPhone || (state.customerProfile && state.customerProfile.phone) || null
  });
}

// Called once an order is actually placed, so the cart stops qualifying as
// abandoned. Without this the customer gets a "you left something behind" push
// minutes after they bought it — the single most common way this feature
// embarrasses a marketplace.
async function markCartConverted() {
  const uid = getDeviceUid();
  if (!uid) return;
  // Cancel any pending sync and pre-seed the signature with the now-empty cart.
  // Without this the post-order saveState() schedules an "empty cart" sync that
  // lands seconds later and overwrites status='converted' with 'dismissed' —
  // harmless for targeting (both are excluded) but it would erase every
  // conversion from the abandoned-vs-converted report.
  if (_cartSyncTimer) { clearTimeout(_cartSyncTimer); _cartSyncTimer = null; }
  _lastCartSig = "[]";
  await notifApi("cart-converted", { device_uid: uid });
}

// ── Customer inbox ──────────────────────────────────────────────────────────

async function loadCustomerNotifications(silent) {
  const uid = getDeviceUid();
  if (!uid) return;
  const res = await notifApi("inbox", {
    device_uid: uid,
    customer_phone: state.verifiedPhone || (state.customerProfile && state.customerProfile.phone) || null
  });
  if (!res || !res.ok) return;
  state.customerNotifications = Array.isArray(res.items) ? res.items : [];
  state.customerNotifUnread = Number(res.unread) || 0;
  updateNotifBadge();
  if (!silent && state._notifModalOpen) openNotificationsModal();
}

function updateNotifBadge() {
  const n = Number(state.customerNotifUnread) || 0;
  document.querySelectorAll("[data-notif-badge]").forEach(el => {
    el.textContent = n > 99 ? "99+" : String(n);
    el.hidden = n === 0;
  });
}

// Arabic-Indic digits, matching the ar-EG date fallback at the end of
// notifRelativeTime — mixing ٥ and 5 inside one timestamp column looks broken.
const arDigits = n => String(n).replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);

// Arabic number agreement. Unlike English, the noun changes with the count:
// 1 = singular, 2 = dual (its own form), 3–10 = plural, 11+ = singular again.
// "قبل 5 دقيقة" is not a typo to a reader — it is visibly wrong grammar, and
// this string sits on every row of the inbox.
function arCount(n, one, two, few, many) {
  if (n === 1) return one;
  if (n === 2) return two;
  if (n >= 3 && n <= 10) return `${arDigits(n)} ${few}`;
  return `${arDigits(n)} ${many}`;
}

function notifRelativeTime(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const mins = Math.floor((Date.now() - t) / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `قبل ${arCount(mins, "دقيقة", "دقيقتين", "دقائق", "دقيقة")}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `قبل ${arCount(hours, "ساعة", "ساعتين", "ساعات", "ساعة")}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `قبل ${arCount(days, "يوم", "يومين", "أيام", "يوماً")}`;
  return new Date(t).toLocaleDateString("ar-EG", { day: "numeric", month: "long" });
}

const NOTIF_KIND_ICON = { order: "receipt", promo: "percent", system: "bell" };

function openNotificationsModal() {
  state._notifModalOpen = true;
  const items = Array.isArray(state.customerNotifications) ? state.customerNotifications : [];

  // Every field below is server-stored and admin-authored, so it is escaped on
  // the way into the template — the same discipline applied across app.js after
  // the stored-XSS fix of 2026-07-20.
  // Reuses the .notif-list / .notif-icon / .notif-body / .unread structure the
  // merchant notification modal already defines (app.js openMerchantNotifications),
  // so this inherits existing styling instead of introducing a parallel one.
  const body = items.length
    ? `<ul class="notif-list notif-list--customer">${items.map(n => `
        <li class="${n.read_at ? "" : "unread"}">
          <button class="notif-row" data-action="notif-open" data-id="${escAttr(n.id)}" data-link="${escAttr(n.deep_link || "")}">
            <span class="notif-icon">${icon(NOTIF_KIND_ICON[n.kind] || "bell")}</span>
            <div class="notif-body">
              <strong>${esc(n.title || "")}</strong>
              ${n.body ? `<small>${esc(n.body)}</small>` : ""}
              <time>${esc(notifRelativeTime(n.created_at))}</time>
            </div>
          </button>
        </li>`).join("")}</ul>`
    : `<div class="empty-managed">${icon("bell")}<p>لا توجد إشعارات بعد — ستصلك هنا تحديثات طلباتك وأحدث العروض.</p></div>`;

  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">حسابي</span>
    <h2>${icon("bell")} الإشعارات</h2>
    ${state.customerNotifUnread ? '<button class="link-button notif-mark-all" data-action="notif-mark-all">تعليم الكل كمقروء</button>' : ""}
    ${body}
  `, "notif-modal");
}

async function markAllNotificationsRead() {
  const uid = getDeviceUid();
  if (!uid) return;
  (state.customerNotifications || []).forEach(n => { if (!n.read_at) n.read_at = new Date().toISOString(); });
  state.customerNotifUnread = 0;
  updateNotifBadge();
  openNotificationsModal();
  await notifApi("mark-read", { device_uid: uid });
}

async function openNotificationTarget(id, link) {
  const uid = getDeviceUid();
  const n = (state.customerNotifications || []).find(x => String(x.id) === String(id));
  if (n && !n.read_at) {
    n.read_at = new Date().toISOString();
    state.customerNotifUnread = Math.max(0, (state.customerNotifUnread || 0) - 1);
    updateNotifBadge();
    if (uid) notifApi("mark-read", { device_uid: uid, ids: [Number(id)] });
  }
  // Only follow internal paths. A deep link is admin-authored, but treating it
  // as a trusted URL would turn the notification centre into an open redirect.
  if (link && /^\/[^/\\]/.test(link)) { closeModal(); navigate(link); }
  else openNotificationsModal();
}

function initNotifications() {
  registerDevice();
  loadCustomerNotifications(true);
  // Refresh when a backgrounded tab comes forward — the same staleness logic the
  // catalog already uses.
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) loadCustomerNotifications(true);
  });
}

// ─────────────────── Merchant order alert: ring + status nudge ───────────────
// The order webhook can't push into an already-open browser tab, so the open
// dashboard polls. On a NEW order we play a distinctive looping chime + show a
// banner until the merchant acknowledges it. When there's no new order we nudge
// the merchant about orders still awaiting a status update so customers keep
// seeing progress (قيد التجهيز / خرج للتوصيل / مكتمل…). Sounds are synthesized
// with the Web Audio API — no audio asset to bundle, works offline.
let _audioCtx = null;
function merchantAudioCtx() {
  if (_audioCtx) return _audioCtx;
  try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { _audioCtx = null; }
  return _audioCtx;
}
// Browsers block autoplay until a user gesture — resume the context on any click.
function unlockMerchantAudio() {
  const ctx = merchantAudioCtx();
  if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
}
["click", "keydown", "touchstart"].forEach(ev => document.addEventListener(ev, unlockMerchantAudio, { passive: true }));

// Play a sequence of notes. notes = [{ f:Hz, t:startSec, d:durSec }].
function playChime(notes, peak = 0.2) {
  const ctx = merchantAudioCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  const now = ctx.currentTime;
  notes.forEach(n => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = n.f;
    g.gain.setValueAtTime(0.0001, now + n.t);
    g.gain.exponentialRampToValueAtTime(peak, now + n.t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now + n.t + n.d);
    osc.connect(g); g.connect(ctx.destination);
    osc.start(now + n.t); osc.stop(now + n.t + n.d + 0.03);
  });
}
// Distinctive new-order ring: an ascending "ding-ding-dong" the merchant learns.
function newOrderChime() {
  playChime([{ f: 880, t: 0, d: 0.18 }, { f: 1175, t: 0.20, d: 0.18 }, { f: 1568, t: 0.40, d: 0.5 }], 0.24);
}
// Softer two-note nudge for orders awaiting a status update.
function reminderChime() {
  playChime([{ f: 660, t: 0, d: 0.14 }, { f: 880, t: 0.16, d: 0.22 }], 0.12);
}
let _ringTimer = null;
function startNewOrderRing() {
  if (_ringTimer) return;
  newOrderChime();
  _ringTimer = setInterval(newOrderChime, 2600); // loop until acknowledged
}
function stopNewOrderRing() {
  if (_ringTimer) { clearInterval(_ringTimer); _ringTimer = null; }
}

// Statuses that need no further merchant action (no reminder for these).
const TERMINAL_ORDER_STATUSES = ["مكتمل", "مرفوضة", "تم التوصيل", "ملغي", "بانتظار الدفع"];
let _merchantOrderWatch = null;
let _pendingReminderAt = 0;
const _baselinedStores = new Set(); // stores whose backlog we've already absorbed

function seenOrdersKey(storeId) { return "dukkanci-merchant-seen-" + storeId; }
function loadSeenOrders(storeId) {
  try { return new Set(JSON.parse(localStorage.getItem(seenOrdersKey(storeId)) || "[]")); }
  catch (e) { return new Set(); }
}
function saveSeenOrders(storeId, set) {
  try { localStorage.setItem(seenOrdersKey(storeId), JSON.stringify([...set].slice(-500))); } catch (e) {}
}
function pendingCountFor(storeId) {
  return state.orders.filter(o => o.storeId === storeId && !TERMINAL_ORDER_STATUSES.includes(o.status)).length;
}

// Begin watching the active merchant store for new orders. Idempotent. The first
// tick per store only establishes a baseline (absorbs the existing backlog) so we
// never ring for old orders — only orders that arrive afterwards trigger the ring.
function startMerchantOrderWatch() {
  if (_merchantOrderWatch) return;
  _merchantOrderWatch = setInterval(merchantOrderTick, 15000);
  merchantOrderTick(); // immediate baseline
}
function stopMerchantOrderWatch() {
  if (_merchantOrderWatch) { clearInterval(_merchantOrderWatch); _merchantOrderWatch = null; }
  stopNewOrderRing();
  state.merchantNewOrderAlert = null;
}

async function merchantOrderTick() {
  const storeId = state.merchantStoreId;
  if (!storeId || state.route !== "merchant") { stopMerchantOrderWatch(); return; }
  const ok = await loadOrdersFromSupabase(storeId);
  if (!ok) return;
  const mine = state.orders.filter(o => o.storeId === storeId);
  const seen = loadSeenOrders(storeId);
  // First time we watch this store this session → absorb the backlog, never ring.
  if (!_baselinedStores.has(storeId)) {
    _baselinedStores.add(storeId);
    mine.forEach(o => seen.add(o.id));
    saveSeenOrders(storeId, seen);
    state.merchantPendingCount = pendingCountFor(storeId);
    render();
    return;
  }
  const fresh = mine.filter(o => !seen.has(o.id));
  if (fresh.length) {
    fresh.forEach(o => seen.add(o.id));
    saveSeenOrders(storeId, seen);
    state.merchantNewOrderAlert = { count: fresh.length, latest: fresh[0].id };
    startNewOrderRing();
    render();
    return;
  }
  // No new orders → remind about orders still awaiting a status update.
  const prev = state.merchantPendingCount || 0;
  state.merchantPendingCount = pendingCountFor(storeId);
  if (state.merchantPendingCount && Date.now() - _pendingReminderAt > 240000) { // every ~4 min
    _pendingReminderAt = Date.now();
    reminderChime();
    render();
  } else if (state.merchantPendingCount !== prev) {
    render(); // keep the pending badge accurate
  }
}

// The banner shown atop the merchant dashboard for new orders / pending updates.
function merchantAlertBanner() {
  const a = state.merchantNewOrderAlert;
  if (a && a.count) {
    return `<div class="order-alert-banner ringing" role="alert">
      <span class="order-alert-ico">${icon("bell")}</span>
      <div class="order-alert-text"><strong>${a.count > 1 ? `${a.count.toLocaleString("ar")} طلبات جديدة وصلت!` : "طلب جديد وصل!"}</strong><small>اضغط للعرض وتحديث الحالة</small></div>
      <button class="primary-button compact" data-action="ack-new-order" data-id="${escAttr(a.latest)}">${icon("eye")} عرض الطلب</button>
      <button class="icon-button order-alert-x" data-action="silence-ring" title="إيقاف الرنين">${icon("close")}</button>
    </div>`;
  }
  const p = state.merchantPendingCount || 0;
  if (p) {
    return `<div class="order-alert-banner pending">
      <span class="order-alert-ico">${icon("clock")}</span>
      <div class="order-alert-text"><strong>لديك ${p.toLocaleString("ar")} ${p === 1 ? "طلب" : "طلبات"} بانتظار تحديث الحالة</strong><small>حدّث الحالة (قيد التجهيز · خرج للتوصيل · مكتمل) ليتابعها العميل</small></div>
      <button class="secondary-button compact" data-action="merchant-tab" data-tab="orders">${icon("receipt")} عرض الطلبات</button>
    </div>`;
  }
  return "";
}

// Backward-compat: convert old shared #routes (e.g. /#store/5) to real paths.
// Skip OAuth callback hashes (#access_token=...) so Supabase can read the session first.
if (location.hash && location.hash.length > 1 && !/(access_token|provider_token|error)=/.test(location.hash)) {
  const h = location.hash.replace(/^#/, "");
  history.replaceState({}, "", h === "home" ? "/" : "/" + h);
}
hydrateIcons();
render();
initCatalog();
initAuth();
initUserLocation();
initInstallPrompt();
initNotifications();

// Keep the storefront in sync with admin/store-owner edits without a full realtime
// subscription: re-pull the catalog whenever a backgrounded tab regains focus
// (its snapshot is likely stale) and on a slow background interval for long-lived
// tabs, so a hidden/edited store doesn't linger from an earlier page-load snapshot.
let lastCatalogRefreshAt = Date.now();
async function refreshCatalogIfStale() {
  if (Date.now() - lastCatalogRefreshAt < 60000) return;
  lastCatalogRefreshAt = Date.now();
  const ok = await loadCatalogFromSupabase();
  if (ok) render();
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") refreshCatalogIfStale();
});
setInterval(refreshCatalogIfStale, 5 * 60 * 1000);
