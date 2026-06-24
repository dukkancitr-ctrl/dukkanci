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

stores.push(...alsultanBranches, zaitouneStore, ...zaitouneBranches, ezzedineStore, sallouraStore, nourStore, tihamaStore, afganStore, samStore, kadyStore, yemenchefStore, alwadiStore, kadibyStore, azalStore, abouStore, bitehausStore, ...alagarBranches, khawaliStore, ademsefStore, babtomaStore, orangeStore, ...anasBranches, yemenmandyStore, alfursanStore, hallabStore, safaStore);

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
products.push(...yemenchefProducts);
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
products.push(...hallabProducts);
products.push(...safaProducts);

// Publishing rules — enforced for BOTH the bundled fallback and the cloud catalog.
// Never publish a product that is (1) unavailable, (2) has no real image (empty or a
// known placeholder), or (3) reuses an image already used by another product in the
// SAME store (a duplicate = a fallback/placeholder, not the product's own photo).
// The same product photo reused across branches of one brand is NOT a duplicate, so
// duplicate detection is scoped per store.
function isPlaceholderImage(img) {
  return !img || /placeholder|generic-cover|coming-soon/i.test(String(img));
}
// Products the admin explicitly hid from the storefront (ids loaded from site_settings.hiddenProducts).
// The storefront shows a product only if it has a real image, is in stock, and isn't force-hidden;
// the management panels (merchant + admin) read `allProducts` instead, so they still see and manage
// EVERY product — including ones without an image (shown there as "بانتظار صورة / غير معروض").
let HIDDEN_PRODUCTS = new Set();
function isShownOnStore(p) {
  return p.available !== false && !HIDDEN_PRODUCTS.has(p.id) && !isPlaceholderImage(p.image);
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
    if (isPlaceholderImage(p.image)) return false;     // rule 2: no real image -> hidden from storefront
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

const customerOrders = [];

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
  ...yemenchefDeliverySettings,
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
  ...hallabDeliverySettings,
  ...safaDeliverySettings
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
  storeFilter: "الكل",
  storeSort: "recommended",
  search: "",
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
  merchantTab: "overview",
  merchantStoreId: 5,
  merchantAuth: JSON.parse(localStorage.getItem("dukkanci-merchant-auth") || "null"),
  adminTab: "overview",
  adminContentSection: null,
  siteSettings: {},
  adminKey: sessionStorage.getItem("dukkanci-admin-token") || null,
  adminThreads: [],
  adminActiveWa: null,
  adminThread: null,
  adminThreadLoading: false,
  user: null,
  deferredInstall: null
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
const SLUG_MAP = (typeof STORE_SLUGS !== "undefined") ? STORE_SLUGS : {};
const SLUG_TO_ID = (typeof STORE_SLUG_TO_ID !== "undefined") ? STORE_SLUG_TO_ID : {};

// The URL segment for a store: its English slug if defined, else the numeric id.
function storeParam(store) {
  return (store && SLUG_MAP[store.id]) || (store && store.id) || "";
}

function getStore(id) {
  if (typeof id === "string" && !/^\d+$/.test(id)) {
    const mapped = SLUG_TO_ID[id];
    return mapped != null ? stores.find(store => store.id === mapped) : undefined;
  }
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
  localStorage.setItem("dukkanci-my-orders", JSON.stringify(state.myOrders));
  localStorage.setItem("dukkanci-profile", JSON.stringify(state.customerProfile));
  if (state.verifiedPhone) localStorage.setItem("dukkanci-verified-phone", state.verifiedPhone);
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
  // branch_name isn't a DB column; for branch groups the area is embedded in the
  // store name ("Brand - Area"), so derive branchName from it (else the branch
  // picker shows "undefined").
  const branchName = (r.branch_group && typeof r.name === "string" && r.name.includes(" - "))
    ? r.name.split(" - ").pop().trim()
    : undefined;
  return {
    id: r.id, name: r.name, category: r.category, image: r.image, coverImage: r.cover_image, branchName,
    logoImage: r.logo_image, logo: r.logo, rating: r.rating, reviews: r.reviews, newStore: r.new_store,
    delivery: r.delivery, minOrder: r.min_order, time: r.time, distance: r.distance,
    location: (r.lat != null && r.lng != null) ? { lat: r.lat, lng: r.lng } : undefined, mapUrl: r.map_url,
    open: r.open, featured: r.featured, hasOffer: r.has_offer, offer: r.offer, priceOnRequest: r.price_on_request,
    description: r.description, address: r.address, phone: r.phone, whatsapp: r.whatsapp, email: r.email,
    website: r.website, sourceUrl: r.source_url, hours: r.hours, areas: r.areas, fulfillment: r.fulfillment,
    subscription: r.subscription, orderCount: r.order_count, officialStore: r.official_store,
    branchGroup: r.branch_group, brandTheme: r.brand_theme, approvalStatus: r.approval_status,
    subscriptionStatus: r.subscription_status, subscriptionActive: r.subscription_active !== false,
    trialEndsAt: r.trial_ends_at, currentPeriodEnd: r.current_period_end, whopMembershipId: r.whop_membership_id
  };
}
function mapDbProduct(r) {
  return {
    id: r.id, storeId: r.store_id, sourceId: r.source_id, name: r.name, image: r.image, slug: r.slug,
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
    return true;
  } catch (e) { console.warn("Supabase load failed:", e.message); return false; }
}
// Fire-and-forget: ask the server to notify Google's Indexing API about a URL.
// No-ops on the server when credentials aren't configured.
function notifyGoogleIndex(path) {
  try {
    fetch("/api/notify-google", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: location.origin + path })
    }).catch(() => {});
  } catch (e) { /* ignore */ }
}

function pushProductCloud(product) {
  const sb = window.supabaseClient;
  if (sb) sb.from("products").upsert(toDbProduct(product), { onConflict: "id" }).then(({ error }) => {
    if (error) console.warn("product cloud save:", error.message);
    else notifyGoogleIndex(`/product/${product.slug || product.id}`);
  });
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
  if (sb) sb.from("stores").upsert(toDbStore(store), { onConflict: "id" }).then(({ error }) => {
    if (error) console.warn("store cloud save:", error.message);
    else notifyGoogleIndex(`/store/${storeParam(store)}`);
  });
}
function deleteProductCloud(id) {
  const sb = window.supabaseClient;
  if (sb) sb.from("products").delete().eq("id", Number(id)).then(({ error }) => { if (error) console.warn("product delete:", error.message); });
}
// The orders table has fixed columns + a flexible delivery_details jsonb. We pack
// every field the merchant needs to FULFILL the order (phone, address, the actual
// line items, notes) into delivery_details so no schema migration is required.
function pushOrderCloud(order) {
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
      createdAt: order.createdAt || ""
    }
  };
  sb.from("orders").upsert(payload, { onConflict: "id" }).then(({ error }) => { if (error) console.warn("order cloud save:", error.message); });
}
// Fire-and-forget WhatsApp notification through the platform number: alerts the
// store of the new order and sends the customer a confirmation. The serverless
// endpoint no-ops until the WhatsApp number is configured (see api/notify-order.js),
// so this is safe to call always and never blocks the order flow.
function notifyOrderWhatsapp(order) {
  try {
    fetch("/api/notify-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id, storeId: order.storeId, customer: order.customer,
        customerPhone: order.customerPhone, total: order.total,
        fulfillment: order.fulfillment, address: order.address,
        payment: order.payment, lineItems: order.lineItems
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
    fetch("/api/notify-order?action=status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: order.id, customerPhone: order.customerPhone,
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
  const sb = window.supabaseClient;
  if (!sb || !phoneKey) return false;
  try {
    const cb = Date.now();
    const { data, error } = await sb.from("orders").select("*")
      .eq("delivery_details->>phoneKey", phoneKey)
      .order("created_at", { ascending: false }).neq("id", "__cb" + cb);
    if (error || !data) return false;
    const mapped = data.map(mapDbOrder);
    // Merge cloud orders with any local guest orders not yet synced.
    const localOnly = state.myOrders.filter(o => !mapped.some(m => m.id === o.id));
    state.myOrders = [...mapped, ...localOnly];
    return true;
  } catch (e) { console.warn("customer orders load failed:", e.message); return false; }
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
// Merchants must see orders placed from ANY device, so the dashboard reads them
// back from the cloud (the previous version only pushed, never loaded).
async function loadOrdersFromSupabase(storeId) {
  const sb = window.supabaseClient;
  if (!sb) return false;
  try {
    const cb = Date.now(); // vary the URL to dodge Cloudflare's edge cache (see loadCatalogFromSupabase)
    let q = sb.from("orders").select("*").order("created_at", { ascending: false }).neq("id", "__cb" + cb);
    if (storeId) q = q.eq("store_id", storeId);
    const { data, error } = await q;
    if (error || !data) return false;
    const mapped = data.map(mapDbOrder);
    // Replace this store's orders with the cloud truth; keep any unrelated local orders.
    const others = state.orders.filter(o => storeId ? o.storeId !== Number(storeId) : false);
    state.orders = [...mapped, ...others.filter(o => !mapped.some(m => m.id === o.id))];
    return true;
  } catch (e) { console.warn("orders load failed:", e.message); return false; }
}
async function initCatalog() {
  await window.__supabaseReady;
  loadSiteSettings();
  const ok = await loadCatalogFromSupabase();
  if (ok) render();
  else { applyProductPersistence(); render(); }
}

// Load editable site content (subscription plan, etc.) from the public
// `site_settings` table into state.siteSettings. Defensive + non-blocking: any
// failure (table missing, offline, RLS) leaves siteSettings empty so the UI
// falls back to its built-in defaults — it never breaks the catalog or page.
async function loadSiteSettings() {
  const sb = window.supabaseClient;
  if (!sb) return;
  try {
    const { data, error } = await sb.from("site_settings").select("key,value");
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
    if (allProducts.length) { const kept = applyPublishingRules(allProducts); products.length = 0; kept.forEach(p => products.push(p)); }
    render();
  } catch (e) { /* keep defaults */ }
}

// ---- Google sign-in via Supabase Auth ----
function applyUserToProfile(user) {
  if (!user) return;
  const meta = user.user_metadata || {};
  const name = meta.full_name || meta.name || (state.customerProfile.name || "");
  state.customerProfile = {
    ...state.customerProfile,
    name: name || state.customerProfile.name,
    email: user.email || state.customerProfile.email,
    avatar: meta.avatar_url || meta.picture || state.customerProfile.avatar
  };
  saveState();
}

function updateAccountButton() {
  const btn = document.querySelector(".account-button");
  if (!btn) return;
  const u = state.user;
  const name = u ? (state.customerProfile.name || u.email || "حسابي") : "حسابي";
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
    if (data && data.session) { state.user = data.session.user; applyUserToProfile(state.user); }
  } catch (e) { /* ignore */ }
  updateAccountButton();
  sb.auth.onAuthStateChange((event, session) => {
    state.user = session ? session.user : null;
    if (state.user) applyUserToProfile(state.user);
    else if (event === "SIGNED_OUT") clearUserIdentity();
    updateAccountButton();
    if (event === "SIGNED_IN") { state._merchantResolved = false; state._merchantResolving = false; closeModal(); showToast(`مرحباً ${(state.customerProfile.name || "").split(" ")[0] || "بك"} 👋`, "success"); }
    if (event === "SIGNED_OUT") { state.merchantAuth = null; state.merchantStores = null; state._merchantResolved = false; showToast("تم تسجيل الخروج", "success"); }
    if (state.route === "orders" || state.route === "merchant") render();
  });
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
  const { error } = await sb.auth.signInWithOtp({ phone, options: { channel: "whatsapp" } });
  if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.label || "إرسال رمز التحقق"; }
  if (error) {
    showErr(/provider|not enabled|not configured|sms/i.test(error.message)
      ? "خدمة إرسال الرمز غير مُفعّلة بعد في إعدادات Supabase."
      : (error.message || "تعذّر إرسال الرمز، حاول مجدداً."));
    return;
  }
  openOtpModal(phone);
}

function openOtpModal(phone) {
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>أدخل رمز التحقق</h2><p>أرسلنا رمزاً عبر واتساب إلى <strong dir="ltr">${escAttr(phone)}</strong></p>
    <form id="otp-form" data-phone="${escAttr(phone)}">
      <label class="input-label"><span>رمز التحقق</span><input name="token" inputmode="numeric" autocomplete="one-time-code" required placeholder="######" dir="ltr" maxlength="8"></label>
      <p class="auth-error" id="otp-error" hidden></p>
      <button class="primary-button full large" type="submit">${icon("check")} تأكيد الدخول</button>
    </form>
    <button class="text-button" data-action="resend-otp" data-phone="${escAttr(phone)}">إعادة إرسال الرمز</button>
  `, "auth-modal");
}

async function verifyWhatsappOtp(form) {
  const sb = window.supabaseClient;
  const errEl = document.getElementById("otp-error");
  const showErr = msg => { if (errEl) { errEl.textContent = msg; errEl.hidden = false; } };
  const phone = form.dataset.phone;
  const token = form.token.value.trim();
  if (!token) { showErr("يرجى إدخال الرمز."); return; }
  const btn = form.querySelector('button[type="submit"]');
  if (btn) { btn.disabled = true; }
  const { error } = await sb.auth.verifyOtp({ phone, token, type: "sms" });
  if (btn) { btn.disabled = false; }
  if (error) showErr(/expired|invalid|token/i.test(error.message) ? "الرمز غير صحيح أو منتهي الصلاحية." : (error.message || "تعذّر التحقق."));
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

// Gate order placement behind a WhatsApp OTP. If delivery isn't operational yet
// (soft fail) or the network is down, fall through and place the order so a real
// customer is never blocked; once the OTP template is live it enforces automatically.
async function startCheckoutOtp(phone, displayPhone, onVerified) {
  pendingOtpCommit = onVerified;
  showToast("جارٍ إرسال رمز التحقق إلى واتساب…");
  const r = await sendOrderOtpRequest(phone);
  if (r && r.ok) { openOrderOtpModal(phone, displayPhone); return; }
  if (!r || r.soft) { pendingOtpCommit = null; onVerified(); return; } // fail-open → never block a real order
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
      <p class="auth-error" id="order-otp-error" hidden></p>
      <button class="primary-button full large" type="submit">${icon("check")} تأكيد وإرسال الطلب</button>
    </form>
    <button class="text-button" data-action="resend-order-otp" data-phone="${escAttr(phone)}">إعادة إرسال الرمز</button>
  `, "auth-modal");
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

function getDeliverySettings(storeId) {
  return state.deliverySettings[Number(storeId)] || initialDeliverySettings[Number(storeId)];
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
    const addrText = [address.label, address.address, address.details].join(" ").toLowerCase();
    const zone = settings.namedZones.find(z => z.match.some(k => addrText.includes(k.toLowerCase())));
    if (zone) return { storeId: store.id, addressId: address.id, fee: zone.fee, provider: "zone", zoneLabel: zone.label, estimatedMinutes: settings.prepMinutes, exceedsMaxDistance: false };
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
    exceedsMaxDistance: roundTripKm > settings.maxRoundTripKm
  };
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
  adminApi("save-settings", { method: "POST", body: { key: "namedZones", value: all } }).catch(() => showToast("تعذّر الحفظ السحابي لمناطق التوصيل", ""));
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
    <article class="store-card ${store.sourceBranded ? "source-branded-store-card" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}` : ""} ${hasBannerCover(store) ? "store-card--banner" : ""}">
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
          <span><strong>${esc(store.name)}</strong><small>${esc(store.category)}</small></span>
        </button>
        <div class="store-rating">
          ${store.newStore ? `${icon("store")} <strong>متجر جديد</strong><span>موثق البيانات</span>` : `${icon("star")} <strong>${store.rating}</strong><span>(${store.reviews} تقييم)</span>`}
        </div>
        <div class="store-meta">
          ${branchDistanceKm(store) != null ? `<span>${icon("pin")} ${formatDistance(branchDistanceKm(store))}</span>` : `<span>${icon("clock")} ${store.time}</span>`}
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
        <img src="${esc(product.image)}" alt="${esc(product.name)}" loading="lazy">
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

// Homepage category tiles ("ماذا تحتاج اليوم؟"). Editable via Content >
// التصنيفات (show/hide + reorder); the chosen order/hidden set lives in
// site_settings.categories. Falls back to all six in default order.
const HOME_CATEGORIES = [
  ["سوبر ماركت", "/assets/photos/store-market.jpg", "كل احتياجات البيت"],
  ["مطاعم", "/assets/photos/store-restaurant.jpg", "ألذ الأطباق إلى بابك"],
  ["ملاحم", "/assets/photos/store-butcher.jpg", "لحوم طازجة يومياً"],
  ["حلويات", "/assets/photos/store-bakery.jpg", "لأحلى المناسبات"],
  ["مكسرات وبهارات", "/assets/photos/store-spices.jpg", "نكهات من كل مكان"],
  ["عصائر", "/assets/photos/store-juice.jpg", "عصائر طازجة ومشروبات"]
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
// tiles, so a category added in Content > التصنيفات (e.g. «خضار وفواكه») shows up
// everywhere a store category is offered — the join form and the stores filter —
// not only on the homepage. Falls back to the HOME_CATEGORIES defaults.
function storeCategoryNames() {
  return categoriesList().map(c => c.name).filter(Boolean);
}

function renderHome() {
  // For brands with several branches, surface the branch nearest the visitor's
  // location (from geolocation) instead of a fixed "main" branch — on desktop and
  // mobile alike (the store grid is shared/responsive). Falls back to the featured
  // branch until the browser location is known.
  let featuredStores = collapseBranchGroups(stores.filter(store => store.featured && isStoreApproved(store)));
  // When the visitor's location is known, show the nearest featured stores first
  // so "متاجر مميزة بالقرب منك" is literally true.
  if (state.userLocation) featuredStores = featuredStores.slice().sort(compareStoresByDistance);
  const offerProducts = products.filter(product => product.oldPrice && product.available).slice(0, 4);
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
  return `
    <section class="hero">
      <div class="container hero__grid">
        <div class="hero__content">
          <span class="eyebrow"><span></span> ${escAttr(ht.eyebrow)}</span>
          <h1>${escAttr(ht.titleTop)}<br><em>${escAttr(ht.titleEm)}</em></h1>
          <p>${escAttr(ht.subtitle)}</p>
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
          ${homeCategoriesOrdered().map(c => categoryCard(c.name, c.image, c.caption)).join("")}
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
            <span class="eyebrow light"><span></span> ${escAttr(hb.eyebrow)}</span>
            <h2>${escAttr(hb.title)}</h2>
            <p>${escAttr(hb.subtitle)}</p>
            <a ${bAttrs} class="light-button">${escAttr(hb.button)} ${icon("arrowLeft")}</a>
          </div>
          <div class="offer-products">
            ${hb.image ? `<a ${bAttrs} class="offers-banner__image" style="display:block;width:100%;border-radius:18px;overflow:hidden"><img src="${escAttr(hb.image)}" alt="${escAttr(hb.title)}" style="width:100%;display:block;object-fit:cover"></a>` : offerProducts.slice(0, 2).map(product => `
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
    if (!isStoreApproved(store)) return false;
    const categoryMatch = state.storeFilter === "الكل"
      || store.category === state.storeFilter
      || (state.storeFilter === "ملاحم" && store.category.includes("ملحم"));
    const text = normalizeAr(`${store.name} ${store.category} ${store.description}`);
    return categoryMatch && terms.every(t => text.includes(t));
  });

  // Collapse branch groups to their nearest branch FIRST, then sort the
  // representative cards — so distance ordering reflects the actual closest shop.
  result = collapseBranchGroups(result);

  if (state.storeSort === "rating") result.sort((a, b) => b.rating - a.rating);
  else if (state.storeSort === "delivery") result.sort((a, b) => deliverySortValue(a) - deliverySortValue(b));
  else if (state.storeSort === "distance") result.sort(compareStoresByDistance);
  else if (state.storeSort === "open") result.sort((a, b) => Number(b.open) - Number(a.open));
  else if (state.storeSort === "offers") result.sort((a, b) => Number(b.hasOffer) - Number(a.hasOffer));
  else if (state.userLocation) {
    // Default "recommended" view: once we know where the visitor is, surface the
    // genuinely nearest stores (open ones first) instead of the bundled order.
    result.sort((a, b) => Number(b.open) - Number(a.open) || compareStoresByDistance(a, b));
  }
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
      </div>
    </section>
  `;
}

// These stores use a wide 1600×600 promo banner (logo + product montage on a solid
// background) as their cover. With object-fit:cover the short mobile box crops the logo
// and products off the side edges, so we show the full banner instead (see styles.css:
// .store-cover--banner). Matched by image path so it works for bundled and Supabase data.
const BANNER_COVER_SLUGS = ["kady", "tihama", "afgan", "nour", "salloura", "ezzedine", "sam"];
function hasBannerCover(store) {
  const src = store.coverImage || store.image || "";
  return BANNER_COVER_SLUGS.some(slug => src.includes(`/photos/${slug}/`));
}

function renderStorePage(id) {
  const store = getStore(id);
  if (!store) return renderNotFound();
  const siblingBranches = store.branchGroup
    ? stores.filter(branch => branch.branchGroup === store.branchGroup)
        .sort((a, b) => (branchDistanceKm(a) ?? Infinity) - (branchDistanceKm(b) ?? Infinity))
    : [];
  const nearestSiblingId = store.branchGroup ? nearestBranchId(store.branchGroup, store.id) : null;
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
        <div class="store-cover ${store.sourceBranded ? "source-branded-store-cover" : ""} ${store.brandTheme ? `store-theme-${store.brandTheme}-cover` : ""} ${hasBannerCover(store) ? "store-cover--banner" : ""}">
          <img src="${store.coverImage || store.image}" alt="${store.name}">
          <div class="store-cover__gradient"></div>
          <span class="status-badge large ${store.open ? "open" : "closed"}">${store.open ? "مفتوح ويستقبل الطلبات" : "مغلق حالياً"}</span>
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
                <p class="branch-switcher__hint">${state.userLocation ? `الفروع مرتّبة حسب الأقرب إلى موقعك (${escAttr(state.userLocation.area || "موقعك الحالي")}).` : "حدّد موقعك من الأعلى لترتيب الفروع حسب الأقرب إليك تلقائياً."}</p>
              </div>
              <div class="branch-switcher__list">
                ${siblingBranches.map(branch => {
                  const km = branchDistanceKm(branch);
                  const isNearest = branch.id === nearestSiblingId;
                  return `
                  <button class="${branch.id === store.id ? "active" : ""}" data-action="open-store" data-id="${branch.id}">
                    <img src="${branch.coverImage || branch.image}" alt="">
                    <span><strong>${branch.branchName}${isNearest ? ` <em class="branch-near-tag">${icon("pin")} الأقرب إليك</em>` : ""}</strong><small>${km != null ? `${formatDistance(km)} · ` : ""}${branch.phone}</small></span>
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
            <div class="review-list"><p class="muted-note">لا توجد تقييمات بعد — كن أول من يقيّم هذا المتجر بعد طلبك.</p></div>
          </section>`}
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
    ["products", "box", "المنتجات"],
    ["customers", "users", "العملاء"],
    ["orders", "receipt", "الطلبات"],
    ["messages", "whatsapp", "المحادثات"],
    ["complaints", "megaphone", "الشكاوى"],
    ["delivery", "bike", "التوصيل"],
    ["content", "settings", "المحتوى"]
  ];
  const items = type === "merchant" ? merchantItems : adminItems;
  return `
    <aside class="dashboard-sidebar">
      <div class="dashboard-brand">${brandLogo("brand-on-dark")}<span>${type === "merchant" ? "لوحة المتجر" : "لوحة الإدارة"}</span></div>
      <nav>${items.map(([key, iconName, label]) => { const waUnread = (state.adminThreads || []).reduce((s, t) => s + (t.unread || 0), 0); return `<button class="${active === key ? "active" : ""}" data-action="${type}-tab" data-tab="${key}">${icon(iconName)}<span>${label}</span>${key === "orders" ? `<b class="nav-badge">${type === "merchant" ? merchantOrderCount : state.orders.length}</b>` : ""}${key === "messages" && waUnread ? `<b class="nav-badge">${waUnread}</b>` : ""}</button>`; }).join("")}</nav>
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
        ${merchantOrders.length ? `
        <div class="chart-wrap">
          <div class="chart-y"><span>20</span><span>15</span><span>10</span><span>5</span><span>0</span></div>
          <div class="bar-chart">${[11, 16, 13, 19, 15, 20, 17].map((height, index) => `<div><span style="height:${height * 7}px"></span><small>${["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"][index]}</small></div>`).join("")}</div>
        </div>` : `<div class="empty-managed">${icon("chart")}<p>لا توجد بيانات كافية بعد. سيظهر الرسم البياني بمجرد استقبال أول الطلبات.</p></div>`}
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
  const allStoreProducts = allProducts.filter(product => product.storeId === getMerchantStore().id);
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
          <span class="status-pill ${isShownOnStore(product) ? "green" : (isPlaceholderImage(product.image) ? "gray" : "red")}" title="${isPlaceholderImage(product.image) ? "أضف صورة ليظهر المنتج في المتجر" : ""}">${isShownOnStore(product) ? "معروض" : (isPlaceholderImage(product.image) ? "بانتظار صورة" : "مخفي")}</span>
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
        <label><span>اسم المتجر</span><input name="storeName" required value="${escAttr(store.name || "")}"><small class="field-hint">يظهر في عنوان التبويب هكذا: «دكانجي - ${escAttr(store.name || "")}»</small></label>
        <label><span>التصنيف</span><select name="category">${[...new Set([store.category, ...storeCategoryNames(), ...stores.map(s => s.category)])].filter(Boolean).map(c => `<option ${c === store.category ? "selected" : ""}>${esc(c)}</option>`).join("")}</select></label>
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

// Arabic label + pill colour for each subscription status.
const SUBSCRIPTION_LABELS = {
  trialing: { text: "فترة تجريبية", pill: "green" },
  active:   { text: "اشتراك نشط",  pill: "green" },
  past_due: { text: "متأخر السداد", pill: "orange" },
  canceled: { text: "ملغى",        pill: "red" },
  expired:  { text: "منتهي",       pill: "red" },
  none:     { text: "غير مشترك",   pill: "gray" }
};
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
  const whopUrl = window.WHOP_CHECKOUT_URL || "https://whop.com/dukkanci/dukkanci-store-subscription/";

  const p = (state.siteSettings && state.siteSettings.plan) || {};
  const name = p.name || "اشتراك متجر دكانجي";
  const tagline = p.tagline || "كل الأدوات التي تحتاجها لتنمية متجرك واستقبال طلبات بلا حدود.";
  const price = (p.price != null && p.price !== "") ? p.price : "2,499";
  const period = p.period || "ل.ت / شهرياً";
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
      <div><span class="status-pill ${meta.pill}">${meta.text}</span><h2>${escAttr(name)}</h2><p>${escAttr(tagline)}</p></div>
      <div class="subscription-price"><strong>${escAttr(String(price))}</strong><span>${escAttr(period)}</span></div>
    </div>
    <div class="subscription-details">
      <section class="dashboard-card"><h3>تفاصيل الاشتراك</h3>
        <div class="detail-list">
          <span><small>الحالة</small><strong>${meta.text}</strong></span>
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
function merchantLogin() {
  return `
    <div class="merchant-auth">
      <form class="merchant-auth__card" id="login-form">
        <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
        <h2>لوحة المتجر</h2>
        <p>سجّل الدخول برقم واتساب متجرك. سنرسل رمز تحقّق إلى الرقم — معرفة الرقم وحدها لا تكفي للدخول.</p>
        <label class="input-label"><span>رقم واتساب المتجر</span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+90 555 000 00 00" dir="ltr"></label>
        <p class="auth-error" id="login-error" hidden></p>
        <button class="primary-button full large" type="submit">${icon("whatsapp")} إرسال رمز التحقق</button>
        <div class="merchant-auth__divider"><span>أو</span></div>
        <button type="button" class="secondary-button full" data-action="merchant-google">متابعة عبر Google</button>
        <div class="merchant-auth__divider"><span>ليس لديك متجر بعد؟</span></div>
        <button type="button" class="secondary-button full" data-action="join-merchant">${icon("plus")} أنشئ متجرك الآن</button>
        <p class="merchant-auth__note">${icon("shield")} دخول آمن عبر رمز تحقّق. للمساعدة تواصل مع دكانجي عبر <a href="https://wa.me/905551706000" target="_blank" rel="noopener">واتساب</a>.</p>
      </form>
    </div>
  `;
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
  return `<div class="merchant-auth"><div class="merchant-auth__card"><div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div><h2>جارٍ التحقق…</h2><p>نتحقّق من المتجر المرتبط بحسابك.</p></div></div>`;
}

function merchantNoStore() {
  return `<div class="merchant-auth"><form class="merchant-auth__card">
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>لا يوجد متجر مرتبط بحسابك</h2>
    <p>لم نعثر على متجر مرتبط برقمك. أنشئ متجرك، أو تواصل مع الدعم لربط متجرك القائم بحسابك.</p>
    <button type="button" class="primary-button full large" data-action="join-merchant">${icon("plus")} أنشئ متجرك الآن</button>
    <button type="button" class="secondary-button full" data-action="merchant-logout">${icon("logout")} تسجيل الخروج</button>
    <p class="merchant-auth__note">${icon("shield")} لربط متجر قائم بحسابك تواصل مع دكانجي عبر <a href="https://wa.me/905551706000" target="_blank" rel="noopener">واتساب</a>.</p>
  </form></div>`;
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

function renderMerchant(id) {
  // Must be authenticated (Supabase session) — no more public phone-number login.
  if (!state.user) return merchantLogin();
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
        }
        render();
      });
    }
    return merchantResolving();
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
            ${(() => {
              // A merchant only manages the store(s) linked to their account.
              const owned = (state.merchantStores && state.merchantStores.length) ? state.merchantStores : [store];
              const list = owned.length ? owned : [store];
              return list.length > 1
                ? `<label class="store-switcher" title="اختر فرعك">${icon("store")}<select id="merchant-store-switch">${list.sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s => `<option value="${s.id}" ${s.id === store.id ? "selected" : ""}>${s.name}</option>`).join("")}</select></label>`
                : `<span class="store-switcher store-switcher--single">${icon("store")} ${escAttr(store.name)}</span>`;
            })()}
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
  const orderCount = state.orders.length;
  const revenue = state.orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const catCount = new Set(stores.map(s => s.category)).size;
  const openComplaints = state.customerComplaints.filter(c => c.status !== "تم الحل").length;
  return `
    <div class="stats-grid admin-stats">
      ${statCard("store", "إجمالي المتاجر", stores.length.toLocaleString("ar"), `${catCount.toLocaleString("ar")} تصنيفاً`, "green")}
      ${statCard("box", "إجمالي المنتجات", products.length.toLocaleString("ar"), "منشورة على المنصة", "blue")}
      ${statCard("receipt", "الطلبات", orderCount.toLocaleString("ar"), orderCount ? `${revenue.toLocaleString("ar")} ل.ت` : "لا طلبات بعد", "orange")}
      ${statCard("megaphone", "الشكاوى المفتوحة", openComplaints.toLocaleString("ar"), openComplaints ? "تحتاج متابعة" : "لا شكاوى", "yellow")}
    </div>
    <div class="admin-panels">
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>طلبات انضمام جديدة</h3><p>تحتاج إلى المراجعة</p></div></div>
        <div class="empty-managed">${icon("store")}<p>لا توجد طلبات انضمام جديدة حالياً.</p></div>
      </section>
      <section class="dashboard-card">
        <div class="card-heading"><div><h3>أحدث الطلبات</h3><p>على مستوى المنصة</p></div><button class="text-button" data-action="admin-tab" data-tab="orders">عرض الكل ${icon("arrowLeft")}</button></div>
        ${orderCount ? renderOrdersTable(state.orders.slice(0, 5), "admin") : `<div class="empty-managed">${icon("receipt")}<p>لا طلبات بعد.</p></div>`}
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

function adminCustomers() {
  return `
    <div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث بالاسم أو رقم الهاتف"></div></div>
    <section class="dashboard-card"><div class="empty-managed">${icon("users")}<p>لا يوجد عملاء مسجّلون بعد. ستظهر بيانات العملاء هنا بعد ربط نظام تسجيل الدخول.</p></div></section>
  `;
}

function adminOrders() {
  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input id="admin-order-search" placeholder="ابحث في كل الطلبات"></div><div class="toolbar-actions"><button class="secondary-button compact" data-action="export-csv" data-kind="orders">${icon("download")} تصدير</button></div></div><section class="dashboard-card orders-table-card">${renderOrdersTable(state.orders, "admin")}</section>`;
}

function adminComplaints() {
  const complaints = state.customerComplaints || [];
  return `<div class="dashboard-toolbar"><div class="dashboard-search">${icon("search")}<input placeholder="ابحث في الشكاوى"></div></div><section class="dashboard-card complaint-list">${complaints.length ? complaints.map(c => `<article><span class="complaint-icon">${icon("megaphone")}</span><div><strong>${c.subject}</strong><small>${c.id} · ${c.orderId || "شكوى عامة"} · ${c.date}</small></div><span class="status-pill ${statusClass(c.status)}">${c.status}</span></article>`).join("") : `<div class="empty-managed">${icon("megaphone")}<p>لا توجد شكاوى حالياً.</p></div>`}</section>`;
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

function adminContent() {
  if (state.adminContentSection === "featured") return adminContentFeatured();
  if (state.adminContentSection === "plans") return adminContentPlans();
  if (state.adminContentSection === "categories") return adminContentCategories();
  if (state.adminContentSection === "banners") return adminContentForm("banner");
  if (state.adminContentSection === "texts") return adminContentForm("hero");
  if (state.adminContentSection === "join") return adminContentForm("join");
  // [key, icon, title, subtitle, built]
  const cards = [
    ["banners", "megaphone", "بنرات الصفحة الرئيسية", "تعديل نصوص بنر العروض في الرئيسية", true],
    ["categories", "filter", "التصنيفات", "ترتيب وإخفاء تصنيفات الرئيسية", true],
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
    <section class="dashboard-card form-card">
      <div class="card-heading"><div><h3>خطة الاشتراك والسعر</h3><p>تظهر للتجار في صفحة «الاشتراك». أي تعديل يُحفظ ويظهر للجميع فوراً.</p></div></div>
      <form id="admin-plan-form" class="form-grid">
        <label class="input-label"><span>اسم الخطة</span><input name="name" value="${v("name", "الخطة الاحترافية")}" required></label>
        <label class="input-label"><span>السعر</span><input name="price" value="${v("price", "499")}" inputmode="numeric"></label>
        <label class="input-label"><span>وحدة السعر</span><input name="period" value="${v("period", "ل.ت / شهرياً")}"></label>
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
    title: "نصوص الصفحة الرئيسية (الهيرو)", key: "heroTexts",
    fields: [
      { name: "eyebrow", label: "النص العلوي الصغير", def: "كل ما تحتاجه من دكاكين حيك" },
      { name: "titleTop", label: "العنوان — السطر الأول", def: "سوق الحي" },
      { name: "titleEm", label: "العنوان — الكلمة المميّزة", def: "بين يديك" },
      { name: "subtitle", label: "الوصف", def: "اطلب خضارك الطازجة، حلوياتك المفضلة واحتياجات البيت من متاجر تعرفها وتثق بها.", area: true }
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
// Content > التصنيفات: show/hide + reorder the homepage category tiles.
function adminContentCategories() {
  const items = categoriesList();
  return `
    <button class="text-button" data-action="content-back">${icon("arrowLeft")} رجوع لإدارة المحتوى</button>
    <section class="dashboard-card">
      <div class="card-heading"><div><h3>تصنيفات الصفحة الرئيسية</h3><p>أضِف أو احذف تصنيفاً، عدّل اسمه أو صورته، أظهِره/أخفِه، ورتّبه — كما يظهر في «ماذا تحتاج اليوم؟».</p></div>
        <button class="primary-button compact" data-action="cat-add">${icon("plus")} إضافة تصنيف</button></div>
      <div class="admin-store-list">${items.length ? items.map((c, i) => `<article>
        <span class="avatar-mini">${c.image ? `<img src="${escAttr(c.image)}" alt="">` : icon("box")}</span>
        <div style="flex:1 1 auto;min-width:0"><strong>${escAttr(c.name || "")}</strong><small>${escAttr(c.caption || "")}</small></div>
        <span style="display:flex;gap:.25rem;align-items:center;flex-wrap:wrap">
          <button class="table-action" data-action="cat-move" data-index="${i}" data-dir="up" ${i === 0 ? "disabled" : ""} aria-label="تحريك لأعلى">▲</button>
          <button class="table-action" data-action="cat-move" data-index="${i}" data-dir="down" ${i === items.length - 1 ? "disabled" : ""} aria-label="تحريك لأسفل">▼</button>
          <button class="table-action" data-action="cat-edit" data-index="${i}" aria-label="تعديل">${icon("edit")}</button>
          <button class="table-action danger" data-action="cat-delete" data-index="${i}" aria-label="حذف">${icon("trash")}</button>
          <label style="display:flex;align-items:center;gap:.3rem;cursor:pointer;white-space:nowrap"><input type="checkbox" data-action="toggle-category" data-index="${i}" ${c.hidden ? "" : "checked"}><b>${c.hidden ? "مخفي" : "ظاهر"}</b></label>
        </span>
      </article>`).join("") : `<div class="empty-managed">${icon("filter")}<p>لا توجد تصنيفات بعد. اضغط «إضافة تصنيف».</p></div>`}</div>
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
  sessionStorage.removeItem("dukkanci-admin-token");
}

async function loadAdminThreads(silent) {
  try {
    const data = await adminApi("threads");
    state.adminThreads = data.threads || [];
    if (!silent) render();
    else updateThreadListDOM();
  } catch (e) { if (!silent) render(); }
}

async function loadAdminThread(wa, silent) {
  if (!silent) { state.adminThreadLoading = true; render(); }
  try {
    const data = await adminApi("thread", { params: { wa } });
    state.adminActiveWa = wa;
    state.adminThread = data;
    // The open conversation's unread is now cleared server-side; reflect locally.
    const t = state.adminThreads.find(x => x.wa_id === wa);
    if (t) t.unread = 0;
  } catch (e) { state.adminThread = null; }
  state.adminThreadLoading = false;
  render();
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

// Re-render just the thread list (used during silent polling so the reply box
// keeps focus and the typed draft isn't wiped).
function updateThreadListDOM() {
  const el = document.getElementById("wa-thread-list");
  if (el) el.innerHTML = adminThreadListHTML();
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

function adminThreadListHTML() {
  const threads = state.adminThreads || [];
  if (!threads.length) return `<div class="wa-empty">${icon("whatsapp")}<p>لا توجد محادثات بعد.<br>ستظهر هنا فور أن يراسلك عميل على رقم واتساب.</p></div>`;
  return threads.map(t => `
    <button class="wa-thread ${t.wa_id === state.adminActiveWa ? "active" : ""}" data-action="wa-open" data-wa="${escAttr(t.wa_id)}">
      <span class="wa-thread__avatar">${icon("whatsapp")}</span>
      <span class="wa-thread__body">
        <span class="wa-thread__top"><strong>${escAttr(adminThreadName(t))}</strong><time>${chatTime(t.last_at)}</time></span>
        <span class="wa-thread__preview">${t.last_dir === "out" ? "↩ " : ""}${escAttr((t.last_body || "").slice(0, 48))}</span>
      </span>
      ${t.unread ? `<b class="wa-unread">${t.unread}</b>` : ""}
    </button>`).join("");
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
  const data = state.adminThread || { messages: [], canFreeform: false };
  const t = (state.adminThreads || []).find(x => x.wa_id === state.adminActiveWa);
  const title = t ? adminThreadName(t) : `+${state.adminActiveWa}`;
  const bubbles = chatBubblesHTML(data.messages);
  const composer = data.canFreeform
    ? `<form id="wa-reply-form" class="wa-composer"><input id="wa-reply-input" autocomplete="off" placeholder="اكتب ردّك…"><button type="submit" class="wa-send" aria-label="إرسال">${icon("arrowLeft")}</button></form>`
    : `<div class="wa-window-closed">${icon("bell")} مرّت أكثر من 24 ساعة على آخر رسالة من العميل، فلا يمكن إرسال نص حر الآن. يحتاج العميل أن يراسلك أولاً، أو يلزم إرسال قالب معتمد.</div>`;
  return `
    <header class="wa-chat-head"><span class="wa-thread__avatar">${icon("whatsapp")}</span><div><strong>${escAttr(title)}</strong><small dir="ltr">+${escAttr(state.adminActiveWa)}</small></div></header>
    <div id="wa-chat-scroll" class="wa-chat-scroll">${bubbles || `<div class="wa-empty"><p>لا رسائل.</p></div>`}</div>
    ${composer}`;
}

function adminMessages() {
  if (!state._adminThreadsFetched) {
    state._adminThreadsFetched = true;
    loadAdminThreads(false);
  }
  return `<div class="wa-inbox">
    <aside class="wa-list"><div class="wa-list-head"><strong>المحادثات</strong><button class="text-button compact" data-action="wa-refresh" aria-label="تحديث">⟳ تحديث</button></div><div id="wa-thread-list" class="wa-thread-list">${adminThreadListHTML()}</div></aside>
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
  let list = allProducts.filter(p => p.storeId === store.id);
  if (nq) list = list.filter(p => normalizeAr(`${p.name} ${p.category}`).includes(nq));
  const shownCount = list.filter(isShownOnStore).length;
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
        <div class="managed-product-actions"><button class="table-action" data-action="edit-product" data-id="${p.id}" title="تعديل الاسم والسعر">${icon("edit")}</button></div>
      </article>`;
  }).join("");
  return `
    <div class="dashboard-toolbar">
      <label class="store-switcher" title="اختر المتجر">${icon("store")}<select id="admin-product-store">${stores.slice().sort((a, b) => a.name.localeCompare(b.name, "ar")).map(s => `<option value="${s.id}" ${s.id === store.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>
      <div class="dashboard-search">${icon("search")}<input id="admin-product-search" placeholder="ابحث في منتجات المتجر" value="${escAttr(q)}"></div>
      <span class="toolbar-count">${list.length.toLocaleString("ar")} منتج · ${shownCount.toLocaleString("ar")} معروض</span>
    </div>
    <section class="dashboard-card product-management">
      ${rows || `<div class="empty-managed">${icon("box")}<p>لا منتجات مطابقة</p></div>`}
      ${list.length > 400 ? `<p style="text-align:center;padding:12px;color:#888">يُعرض أول 400 منتج — استخدم البحث لتضييق النتائج</p>` : ""}
    </section>`;
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
  const content = { overview: adminOverview, stores: adminStores, products: adminProducts, customers: adminCustomers, orders: adminOrders, messages: adminMessages, complaints: adminComplaints, delivery: adminDeliveryZones, content: adminContent }[state.adminTab]();
  const titles = { overview: ["نظرة عامة", "مرحباً بك في مركز إدارة دكانجي"], stores: ["إدارة المتاجر", "راجع المتاجر والاشتراكات وحالات النشاط"], products: ["إدارة المنتجات", "أظهر أو أخفِ أي منتج وعدّل اسمه وسعره"], customers: ["إدارة العملاء", "بيانات العملاء وسجل طلباتهم"], orders: ["كل الطلبات", "تابع الطلبات وتدخل عند الحاجة"], messages: ["محادثات العملاء", "ردّ على رسائل واتساب من نفس رقم المنصة"], complaints: ["إدارة الشكاوى", "تابع شكاوى العملاء حتى الحل"], delivery: ["مناطق التوصيل", "أسعار توصيل ثابتة لمجمعات ومناطق محددة لكل متجر"], content: ["إدارة المحتوى", "تحكم في الصفحة الرئيسية والعروض والخطط"] };
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
  if (!state.cart.length) return `<section class="section empty-page">${renderEmpty("سلتك فارغة", "أضف بعض المنتجات أولاً لتتمكن من إكمال الطلب.", "تصفح المتاجر", "stores")}</section>`;
  const store = getStore(state.cart[0].storeId);
  const defaultAddress = getDefaultAddress();
  const selectedAddressId = state.checkoutLocation ? "current" : defaultAddress?.id;
  const totals = cartTotals(selectedAddressId);
  const deliverySettings = getDeliverySettings(store.id);
  const profile = state.customerProfile || {};
  const dayFmt = new Intl.DateTimeFormat("ar-EG", { weekday: "long", day: "numeric", month: "long" });
  const today = new Date(), tomorrow = new Date(Date.now() + 86400000);
  const dayOptions = `<option>اليوم · ${dayFmt.format(today)}</option><option>غداً · ${dayFmt.format(tomorrow)}</option>`;
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
            <div class="checkout-card__title"><span>٢</span><div><h2>بياناتك وعنوان التوصيل</h2><p>نحتاج اسمك ورقمك ليتواصل المتجر معك ويصلك التحديث.</p></div></div>
            <div class="form-grid">
              <label><span>الاسم <i class="req">*</i></span><input name="contactName" autocomplete="name" required value="${escAttr(profile.name || "")}" placeholder="اسمك الكامل"></label>
              <label><span>رقم واتساب <i class="req">*</i></span><input name="contactPhone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr" value="${escAttr(profile.phone || "")}" placeholder="+90 555 000 00 00"></label>
              <label class="wide"><span>عنوان التوصيل</span><select name="address" id="checkout-address" required><option value="">اختر عنواناً محفوظاً</option>${state.customerAddresses.map(address => `<option value="${address.id}" ${String(address.id) === String(selectedAddressId) ? "selected" : ""}>${address.label} - ${address.address}</option>`).join("")}${(state.checkoutLocation || getUserLocationAddress()) ? `<option value="current" ${selectedAddressId === "current" ? "selected" : ""}>📍 ${escAttr((state.checkoutLocation || getUserLocationAddress()).address)}</option>` : ""}</select></label>
              <label><span>اليوم</span><select name="day">${dayOptions}</select></label>
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
  const base = "https://www.dukkanci.com.tr";
  const canonical = base + (location.pathname === "/" ? "/" : location.pathname);
  let title = "دكانجي | سوق الحي بين يديك";
  let desc = "اطلب من متاجر ومطاعم حيك في إسطنبول بسهولة — توصيل سريع من سوق الحي.";
  let image = base + "/assets/dukkanci-app-icon-512.png";
  if (route === "store" && id) {
    const s = getStore(id);
    if (s) {
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
    <section class="page-hero compact"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span>${store ? `<a href="/store/${storeSeg}" data-action="open-store" data-id="${product.storeId}">${store.name}</a><span>/</span>` : ""}<strong>${product.name}</strong></div></div></section>
    <section class="section">
      <div class="container product-page-grid">
        <div class="product-page-media"><img src="${esc(product.image)}" alt="${esc(product.name)}" style="${product.imageFit === "contain" ? "object-fit:contain" : "object-fit:cover"}"></div>
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

const CATEGORY_MAP = (typeof CATEGORY_SLUGS !== "undefined") ? CATEGORY_SLUGS : {};

// Main-category landing page for /category/<slug>: stores in the category + a
// sample of their products, all as links.
function renderCategoryPage(slug) {
  const catText = CATEGORY_MAP[slug];
  if (!catText) {
    return `<section class="section empty-page">${renderEmpty("الفئة غير موجودة", "تصفح كل المتاجر بدلاً من ذلك.", "تصفح المتاجر", "stores")}</section>`;
  }
  const catStores = stores.filter(s => s.category === catText && isStoreApproved(s));
  const storeIds = new Set(catStores.map(s => s.id));
  const catProducts = products.filter(p => storeIds.has(p.storeId) && p.available !== false).slice(0, 40);
  return `
    <section class="page-hero compact"><div class="container"><div class="breadcrumbs"><a href="#home" data-route="home">الرئيسية</a><span>/</span><strong>${catText}</strong></div><h1>${catText}</h1><p>${catStores.length} متجراً في إسطنبول على دكانجي.</p></div></section>
    <section class="section"><div class="container">
      <div class="section-heading small"><h2>المتاجر</h2></div>
      <div class="store-grid">${catStores.map(storeCard).join("")}</div>
      ${catProducts.length ? `<div class="section-heading small" style="margin-top:24px"><h2>منتجات مختارة</h2></div><div class="product-grid">${catProducts.map(productCard).join("")}</div>` : ""}
    </div></section>
  `;
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
    product: () => renderProductPage(id),
    category: () => renderCategoryPage(id),
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
  if (route === "admin" && state.adminTab === "messages" && state.adminKey) {
    setTimeout(() => { startInboxPolling(); scrollChatToBottom(); }, 0);
  }
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
      ${store && (store.whatsapp || store.phone) ? `<div class="order-contact__row">${icon("whatsapp")}<a class="order-wa-btn" href="https://wa.me/${(store.whatsapp || store.phone).replace(/\D/g, "")}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة المتجر</a></div>` : ""}
    </div>
    <div class="customer-order-modal__items">${items.map(item => {
      const product = item.productId ? getProduct(item.productId) : null;
      return `<article>${product ? `<img src="${product.image}" alt="${escAttr(item.name)}">` : ""}<div><strong>${escAttr(item.name)}</strong>${item.options ? `<small>${escAttr(item.options)}</small>` : ""}</div><span>${(item.qty || 1).toLocaleString("ar")} × ${money(item.price)}</span></article>`;
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
        <span class="product-breadcrumb">${esc(store.name)} · ${esc(product.category)}</span>
        <h2>${esc(product.name)}</h2>
        <div class="product-status"><span class="${product.available ? "available" : "not-available"}">${product.available ? "متوفر" : "غير متوفر"}</span><span>${icon("star")} 4.8 (42 تقييماً)</span></div>
        <p>${esc(product.description)}</p>
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

// On every page open we attempt to detect the location automatically. If the
// permission is already granted this resolves silently; if denied/unavailable
// the pill falls back to "حدّد موقعك" (or the last saved location).
function initUserLocation() {
  updateLocationPill();
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    position => applyUserPosition({ lat: position.coords.latitude, lng: position.coords.longitude }, { silent: true }),
    () => { state.locatingUser = false; updateLocationPill(); },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
  );
}

function addToCart(productId, quantity = 1, optionSelections = [], notes = "") {
  const product = getProduct(productId);
  if (!product.available) return;
  if (product.priceOnRequest) { showToast("هذا المنتج بسعر عند الطلب — تواصل عبر واتساب"); return; }
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
  const key = `${product.id}-${optionSelections.join("-")}-${notes}`;
  const existing = state.cart.find(item => item.key === key);
  if (existing) existing.quantity += quantity;
  else state.cart.push({ key, productId: product.id, storeId: product.storeId, quantity, finalPrice: product.price + extra, optionsText: optionLabels.join("، "), optionSelections: [...optionSelections], notes });
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
    <div class="auth-logo"><span class="brand-mark"><img src="/assets/dukkanci-mark.png?v=86" alt="دكانجي"></span></div>
    <h2>أهلاً بك في دكانجي</h2><p>سجّل دخولك لمتابعة طلباتك وحفظ عناوينك ومفضلاتك.</p>
    <button class="google-button" data-action="google-login"><b>G</b> المتابعة باستخدام Google</button>
    <div class="or-line"><span>أو</span></div>
    <form id="login-form"><label class="input-label"><span>رقم واتساب</span><div class="phone-input"><span dir="ltr">+90</span><input name="phone" type="tel" required placeholder="555 000 00 00" dir="ltr"></div></label><p class="auth-error" id="login-error" hidden></p><button class="primary-button full large" type="submit">${icon("whatsapp")} إرسال رمز التحقق</button></form>
    <small class="auth-terms">بالمتابعة أنت توافق على الشروط وسياسة الخصوصية.</small>
  `, "auth-modal");
}

function openJoinModal() {
  const jp = (state.siteSettings && state.siteSettings.joinPage) || {};
  const jTitle = jp.title || "انضم إلى دكانجي";
  const jSub = jp.subtitle || "ابدأ باستقبال طلبات جديدة من عملاء منطقتك.";
  const jNote = jp.note || "بعد الإنشاء تدخل لوحة التحكم لإكمال البيانات وإضافة منتجاتك، ثم يظهر متجرك للعملاء.";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <div class="join-modal-head"><span>${icon("store")}</span><div><h2>${escAttr(jTitle)}</h2><p>${escAttr(jSub)}</p></div></div>
    <form id="join-form" class="join-form">
      <div class="form-grid">
        <label><span>اسم المتجر الحقيقي <i class="req">*</i></span><input name="storeName" required placeholder="مثال: متجر الحي"></label>
        <label><span>تصنيف المتجر <i class="req">*</i></span><select name="category" required><option value="">اختر التصنيف</option>${storeCategoryNames().map(c => `<option>${esc(c)}</option>`).join("")}</select></label>
        <label><span>اسم صاحب المتجر</span><input name="ownerName" autocomplete="name" placeholder="الاسم الكامل"></label>
        <label><span>رقم واتساب <i class="req">*</i></span><input name="phone" type="tel" inputmode="tel" autocomplete="tel" required dir="ltr" placeholder="+90 555 000 00 00"><small class="field-hint">سيكون رقم دخولك للوحة، وعليه تصلك الطلبات.</small></label>
        <label class="wide"><span>عنوان المتجر</span><input name="address" placeholder="الحي، الشارع، رقم البناء"></label>
      </div>
      <div class="review-note">${icon("store")} <span><strong>متجرك يُنشأ فوراً</strong><small>${escAttr(jNote)}</small></span></div>
      <button class="primary-button full large" type="submit">${icon("store")} إنشاء المتجر والدخول</button>
    </form>
  `, "join-modal");
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
    <span class="section-kicker">الطلب ${order.id}</span><h2>إدارة الطلب</h2>
    <div class="order-manager-summary"><span><small>العميل</small><strong>${escAttr(order.customer)}</strong></span><span><small>الإجمالي</small><strong>${money(order.total)}</strong></span><span><small>النوع</small><strong>${isDelivery ? "توصيل" : "استلام"}</strong></span></div>
    <div class="order-contact">
      ${order.customerPhone ? `<div class="order-contact__row">${icon("phone")}<span dir="ltr">${escAttr(order.customerPhone)}</span>${waNum ? `<a class="order-wa-btn" href="https://wa.me/${waNum}" target="_blank" rel="noopener">${icon("whatsapp")} مراسلة العميل</a>` : ""}</div>` : `<div class="order-contact__row order-contact__row--muted">${icon("phone")}<span>لا يوجد رقم تواصل للعميل</span></div>`}
      ${isDelivery ? `<div class="order-contact__row">${icon("pin")}<span>${order.address ? escAttr(order.address) : "لم يُحدَّد عنوان"}${order.addressDetails ? ` — ${escAttr(order.addressDetails)}` : ""}</span></div>${order.deliveryDetails?.roundTripKm != null ? `<div class="order-contact__row">${icon("bike")}<span>المسافة ذهاباً وإياباً ${formatDistance(order.deliveryDetails.roundTripKm)} · رسوم ${money(order.deliveryDetails.fee || 0)}</span></div>` : ""}` : `<div class="order-contact__row">${icon("store")}<span>استلام من المتجر</span></div>`}
    </div>
    <div class="order-items-block">
      <strong class="order-items-title">${icon("box")} تفاصيل الطلب (${items.reduce((s, i) => s + (i.qty || 1), 0) || order.items})</strong>
      ${items.length ? `<ul class="order-items-list">${items.map(i => `<li><span class="oi-qty">${(i.qty || 1).toLocaleString("ar")}×</span><span class="oi-name">${escAttr(i.name)}${i.options ? `<small>${escAttr(i.options)}</small>` : ""}${i.notes ? `<small class="oi-note">${icon("edit")} ${escAttr(i.notes)}</small>` : ""}</span><b>${money(i.price)}</b></li>`).join("")}</ul>` : `<p class="order-items-empty">تفاصيل الأصناف غير متوفرة لهذا الطلب.</p>`}
    </div>
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
  const optText = (editing && editing.options && editing.options[0] && editing.options[0].values)
    ? editing.options[0].values.map((v, i) => `${v} | ${editing.options[0].extra?.[i] || 0}`).join("\n")
    : "";
  showModal(`
    <button class="modal-close" data-action="close-modal">${icon("close")}</button>
    <span class="section-kicker">${store.name}</span>
    <h2>${editing ? "تعديل منتج" : "إضافة منتج جديد"}</h2>
    <form class="modal-form" id="merchant-product-form" data-id="${editing ? editing.id : ""}">
      <div class="form-grid">
        <label class="input-label wide"><span>اسم المنتج <i class="req">*</i></span><input name="name" required value="${editing ? escAttr(editing.name) : ""}"></label>
        <label class="input-label"><span>السعر (ل.ت) <i class="req">*</i></span><input name="price" type="number" min="0" step="1" inputmode="numeric" required value="${editing ? editing.price : ""}"></label>
        <label class="input-label"><span>الوحدة</span><input name="unit" placeholder="كيلو / قطعة / علبة" value="${editing ? escAttr(editing.unit || "") : ""}"></label>
        <label class="input-label"><span>التصنيف <i class="req">*</i></span><input name="category" list="merchant-cat-list" required value="${editing ? escAttr(editing.category) : (cats[0] || "")}"><datalist id="merchant-cat-list">${cats.map(c => `<option value="${escAttr(c)}"></option>`).join("")}</datalist></label>
        <label class="input-label wide"><span>الأحجام والخيارات (اختياري)</span><textarea name="optionLines" rows="3" placeholder="سطر لكل خيار بالصيغة: الاسم | فرق السعر&#10;مثال:&#10;وسط | 0&#10;كبير | 70">${escAttr(optText)}</textarea><small class="field-hint">اتركه فارغاً إن لم يكن للمنتج أحجام. السعر أعلاه هو سعر الخيار الأول.</small></label>
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
  else if (kind === "customers") rows = [["العميل", "الهاتف", "الطلبات"]];
  else if (kind === "complaints") rows = [["الرقم", "العنوان", "الحالة"], ...(state.customerComplaints || []).map(c => [c.id, c.subject, c.status])];
  else rows = [["رقم الطلب", "العميل", "المتجر", "الإجمالي", "الحالة"], ...state.orders.map(order => [order.id, order.customer, getStore(order.storeId)?.name || "-", order.total, order.status])];
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
    const s = getStore(target.dataset.id);
    navigate(`store/${s ? storeParam(s) : target.dataset.id}`);
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
  if (action === "login") { if (state.user) navigate("orders"); else openLoginModal(); }
  if (action === "google-login") signInWithGoogle();
  if (action === "resend-otp") {
    const sb = window.supabaseClient;
    if (sb && sb.auth) sb.auth.signInWithOtp({ phone: target.dataset.phone, options: { channel: "whatsapp" } }).then(({ error }) => showToast(error ? "تعذّر إعادة الإرسال" : "تم إرسال الرمز مجدداً", error ? "" : "success"));
  }
  if (action === "resend-order-otp") resendOrderOtp(target.dataset.phone);
  if (action === "logout") signOutUser();
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
  if (action === "admin-tab") { state.adminTab = target.dataset.tab; state.adminContentSection = null; render(); }
  if (action === "content-section") { state.adminContentSection = target.dataset.section; render(); }
  if (action === "content-back") { state.adminContentSection = null; render(); }
  if (action === "cat-move") {
    const i = Number(target.dataset.index), dir = target.dataset.dir;
    const items = categoriesList().map(c => ({ ...c }));
    const j = dir === "up" ? i - 1 : i + 1;
    if (i >= 0 && j >= 0 && j < items.length) { const t = items[i]; items[i] = items[j]; items[j] = t; saveContentSetting("categories", { items }); }
  }
  if (action === "cat-add") openCategoryEditModal(null);
  if (action === "cat-edit") openCategoryEditModal(Number(target.dataset.index));
  if (action === "cat-delete") {
    const i = Number(target.dataset.index);
    const items = categoriesList().map(c => ({ ...c }));
    if (items[i] && confirm(`حذف التصنيف "${items[i].name}"؟`)) { items.splice(i, 1); saveContentSetting("categories", { items }); showToast("تم حذف التصنيف", "success"); }
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
  if (action === "route-home") navigate("home");
  if (action === "manage-order") openOrderManager(target.dataset.id);
  if (action === "view-order") openOrderManager(target.dataset.id);
  if (action === "save-order-status") {
    const order = state.orders.find(item => item.id === target.dataset.id);
    const prevStatus = order.status;
    const newStatus = document.getElementById("order-status-select").value;
    const note = (document.getElementById("order-status-note")?.value || "").trim();
    order.status = newStatus;
    pushOrderCloud(order);
    // Tell the customer on real status changes (skip the initial states they were
    // already acked for at checkout).
    if (newStatus !== prevStatus && !["طلب جديد", "بانتظار الدفع"].includes(newStatus)) notifyOrderStatusWhatsapp(order, note);
    saveState(); closeModal(); render(); showToast("تم تحديث حالة الطلب وإشعار العميل", "success");
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
    captureUserLocation();
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
  if (action === "merchant-logout") {
    state.merchantAuth = null;
    state.merchantStores = null;
    state._merchantResolved = false;
    state._merchantResolving = false;
    state._merchantOrdersFetched = false;
    state.orders = [];
    localStorage.removeItem("dukkanci-merchant-auth");
    signOutUser(); // end the Supabase session (merchant identity == the session); re-renders
    showToast("تم تسجيل الخروج", "success");
  }
  if (action === "merchant-google") signInWithGoogle();
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
    state._merchantOrdersFetched = false;
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
  if (event.target.dataset.action === "admin-toggle-hide") {
    const id = Number(event.target.dataset.id);
    const ids = new Set([...HIDDEN_PRODUCTS]);
    if (event.target.checked) ids.delete(id); else ids.add(id);   // checked = ظاهر, unchecked = مخفي
    HIDDEN_PRODUCTS = ids;
    const kept = applyPublishingRules(allProducts); products.length = 0; kept.forEach(p => products.push(p));
    saveContentSetting("hiddenProducts", { ids: [...ids] });   // persists (admin) + re-renders
    showToast(ids.has(id) ? "أُخفي المنتج من المتجر" : "أصبح المنتج معروضاً", "success");
  }
  if (event.target.id === "admin-product-store") {
    state.adminProductStoreId = Number(event.target.value);
    state.adminProductSearch = "";
    render();
  }
  if (event.target.dataset.action === "toggle-featured") {
    const store = getStore(event.target.dataset.id);
    if (store) {
      store.featured = event.target.checked;
      pushStoreCloud(store);
      showToast(`${store.name}: ${store.featured ? "أصبح مميّزاً على الرئيسية" : "أُزيل من المميّزة"}`, "success");
      render();
    }
  }
  if (event.target.dataset.action === "toggle-category") {
    const i = Number(event.target.dataset.index);
    const items = categoriesList().map(c => ({ ...c }));
    if (items[i]) { items[i].hidden = !event.target.checked; saveContentSetting("categories", { items }); }
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
    const rate = Math.min(20, Math.max(10, Number(event.target.value) || 10));
    const exampleRate = document.getElementById("delivery-example-rate");
    const exampleTotal = document.getElementById("delivery-example-total");
    if (exampleRate) exampleRate.textContent = rate;
    if (exampleTotal) exampleTotal.textContent = `${20 * rate} ل.ت`;
  }
});

document.addEventListener("submit", event => {
  event.preventDefault();
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
    // Parse optional size/option lines ("الاسم | فرق السعر") into one option group.
    let options = [];
    const optLines = (f.optionLines?.value || "").trim();
    if (optLines) {
      const values = [], extra = [];
      optLines.split("\n").map(l => l.trim()).filter(Boolean).forEach(line => {
        const [label, p] = line.split("|").map(x => (x || "").trim());
        if (label) { values.push(label); extra.push(Math.max(0, Math.round(Number(p) || 0))); }
      });
      if (values.length > 1) options = [{ name: "الحجم", values, extra }];
    }
    const data = {
      name: f.name.value.trim(),
      price: Math.max(0, Math.round(Number(f.price.value) || 0)),
      unit: f.unit.value.trim(),
      category: f.category.value.trim() || "منتجات",
      image: (f.imageData.value || f.image.value.trim()) || "/assets/photos/store-market.jpg",
      description: f.description.value.trim(),
      available: f.available.checked,
      options
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
    const els = event.target.elements;
    const isPickup = els.fulfillment.value === "pickup";
    // Contact info is required so the merchant can actually reach the customer.
    const contactName = (els.contactName?.value || "").trim();
    const contactPhone = (els.contactPhone?.value || "").trim();
    if (!contactName) { showToast("يرجى إدخال اسمك للتواصل"); els.contactName?.focus(); return; }
    if (contactPhone.replace(/\D/g, "").length < 10) { showToast("يرجى إدخال رقم واتساب صحيح للتواصل"); els.contactPhone?.focus(); return; }
    if (!els.terms.checked) { showToast("يرجى الموافقة على سياسة الطلب أولاً"); return; }
    if (!isPickup && !els.address.value) { showToast("يرجى اختيار عنوان التوصيل"); return; }
    const totals = cartTotals(els.address.value);
    const deliverySettings = getDeliverySettings(state.cart[0].storeId);
    if (!isPickup && deliverySettings.mode === "distance" && (!totals.quote || totals.quote.exceedsMaxDistance)) {
      showToast(totals.quote?.exceedsMaxDistance ? "العنوان خارج نطاق توصيل هذا المتجر" : "تعذر حساب التوصيل لهذا العنوان");
      return;
    }
    // Persist contact to the profile so it prefills next time and ties orders together.
    state.customerProfile = { ...state.customerProfile, name: contactName, phone: contactPhone };
    const finalTotal = totals.subtotal + (isPickup ? 0 : totals.delivery);
    const storeId = state.cart[0].storeId;
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
      notes: "",
      substitution: els.substitution?.value || "",
      payment: els.payment?.value === "cash" ? "الدفع عند الاستلام" : "الدفع بالبطاقة",
      scheduleDay: els.day?.value || "",
      scheduleTime: els.time?.value || "",
      deliveryDetails: isPickup ? null : totals.quote,
      createdAt: new Date().toISOString()
    };
    const itemCount = newOrder.lineItems.reduce((s, i) => s + (i.qty || 1), 0);
    const etaMin = (deliverySettings.prepMinutes || 20) + (isPickup ? 0 : 25);
    // The actual order placement — run now if the phone is already verified, else
    // only after the WhatsApp OTP is confirmed (anti-fraud gate below).
    const commitOrder = () => {
      state.myOrders.unshift(newOrder);
      state.orders.unshift(newOrder);
      pushOrderCloud(newOrder);
      notifyOrderWhatsapp(newOrder);
      window.DUKKANCI_INTEGRATIONS?.track("Purchase", { ids: state.cart.map(i => i.productId), value: finalTotal, orderId: newOrder.id, count: state.cart.length });
      state.cart = [];
      state.deliveryQuote = null;
      state.checkoutLocation = null;
      saveState(); updateCartBadges();
      showModal(`<div class="success-animation">${icon("check")}</div><h2>تم إرسال طلبك بنجاح</h2>
        <p>طلبك رقم <strong dir="ltr">${newOrder.id}</strong> وصل إلى <strong>${getStore(storeId).name}</strong>.</p>
        <div class="order-success-summary">
          <span>${icon("box")}<small>المنتجات</small><b>${itemCount.toLocaleString("ar")}</b></span>
          <span>${icon("wallet")}<small>الإجمالي</small><b>${money(finalTotal)}</b></span>
          <span>${icon(isPickup ? "store" : "bike")}<small>${isPickup ? "الاستلام" : "التوصيل إلى"}</small><b>${isPickup ? "من المتجر" : (newOrder.address || "عنوانك")}</b></span>
          <span>${icon("clock")}<small>الوقت المتوقع</small><b>~${etaMin} دقيقة</b></span>
        </div>
        <p class="success-note">${icon("whatsapp")} سنخبرك عبر واتساب على <strong dir="ltr">${escAttr(contactPhone)}</strong> فور تأكيد المتجر.</p>
        <div class="modal-actions"><button class="secondary-button" data-action="close-modal">متابعة التسوق</button><button class="primary-button" data-action="go-orders">تتبّع الطلب</button></div>`, "success-modal");
    };
    // Anti-fraud: a number must be confirmed via a WhatsApp OTP once before its first
    // order goes through. Already-verified numbers skip straight to placing the order.
    const verifyPhone = normalizePhone(contactPhone);
    if (state.verifiedPhone === verifyPhone) commitOrder();
    else startCheckoutOtp(verifyPhone, contactPhone, commitOrder);
  }
  if (event.target.id === "login-form") {
    sendWhatsappOtp(event.target);
  }
  if (event.target.id === "otp-form") {
    verifyWhatsappOtp(event.target);
  }
  if (event.target.id === "order-otp-form") {
    verifyOrderOtp(event.target);
  }
  if (event.target.id === "join-form") {
    // Must be authenticated before creating a store (so we can bind ownership).
    if (!state.user) { showToast("سجّل الدخول أولاً عبر رمز واتساب لإنشاء متجرك"); closeModal(); navigate("merchant"); return; }
    const f = new FormData(event.target);
    const name = (f.get("storeName") || "").toString().trim();
    const category = (f.get("category") || "").toString().trim();
    const owner = (f.get("ownerName") || "").toString().trim();
    const phoneRaw = (f.get("phone") || "").toString().trim();
    const address = (f.get("address") || "").toString().trim();
    const norm = s => (s || "").replace(/\D/g, "");
    const phone = norm(phoneRaw);
    if (!name || !category || !phone) { showToast("يرجى إكمال الحقول المطلوبة (الاسم، التصنيف، رقم واتساب)"); return; }
    // A store already exists for this number → don't duplicate; send them to log in.
    const existing = stores.find(s => norm(s.phone) === phone || norm(s.whatsapp) === phone);
    if (existing) {
      closeModal(); state._merchantResolved = false; navigate("merchant");
      showToast("يوجد متجر بهذا الرقم — سجّل الدخول للوصول إليه", "");
      return;
    }
    const newId = Math.max(0, ...stores.map(s => Number(s.id) || 0)) + 1;
    const store = {
      id: newId, name, category, ownerName: owner,
      logo: name.charAt(0) || "م", image: "/assets/photos/store-market.jpg", coverImage: "/assets/photos/store-market.jpg",
      logoImage: "", rating: 0, reviews: 0, newStore: true, delivery: 35, minOrder: 0,
      time: "", distance: 0, location: undefined, mapUrl: "", open: true, featured: false,
      hasOffer: false, offer: "", description: "", address, phone: phoneRaw, whatsapp: phoneRaw, email: "",
      website: "", sourceUrl: "", hours: "", areas: address ? [address] : [],
      fulfillment: "توصيل واستلام", subscription: "احترافي", orderCount: 0, officialStore: false,
      approvalStatus: "pending" // item 9: hidden from customers until the admin approves it
    };
    stores.push(store);
    pushStoreCloud(store);
    bindStoreToUser(newId); // link ownership so RLS lets this merchant manage it
    state.deliverySettings[newId] = { mode: "fixed", fixedFee: 35, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 60 };
    state.merchantStores = [...(state.merchantStores || []), store];
    state._merchantResolved = true;
    state.merchantAuth = { storeId: newId, phone, userId: state.user.id };
    state.merchantStoreId = newId; state.merchantTab = "store"; state._merchantOrdersFetched = true;
    saveState(); closeModal(); navigate("merchant");
    showToast("تم استلام طلب إنشاء متجرك! سيظهر للعملاء بعد موافقة الإدارة.", "success");
    return;
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
  // (The old insecure phone-only merchant login was removed — merchants now
  //  authenticate via Supabase Auth: see merchantLogin()/resolveMerchantStores().)
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
