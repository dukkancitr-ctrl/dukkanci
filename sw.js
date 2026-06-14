const CACHE = "dukkanci-v52";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=52",
  "/heelal-products.js?v=52",
  "/alsultan-data.js?v=52",
  "/zaitoune-data.js?v=52",
  "/ezzedine-data.js?v=52",
  "/salloura-data.js?v=52",
  "/nour-data.js?v=52",
  "/tihama-data.js?v=52",
  "/afgan-data.js?v=52",
  "/sam-data.js?v=52",
  "/kady-data.js?v=52",
  "/app.js?v=52",
  "/manifest.json",
  "/assets/dukkanci-logo.png?v=52",
  "/assets/photos/ezzedine/cover.jpg",
  "/assets/photos/ezzedine/logo.png",
  "/assets/photos/salloura/cover.jpg",
  "/assets/photos/salloura/logo.png",
  "/assets/photos/store-restaurant.jpg",
  "/assets/photos/nour/cover.jpg",
  "/assets/photos/nour/logo.png",
  "/assets/photos/tihama/cover.jpg",
  "/assets/photos/tihama/logo.png",
  "/assets/photos/afgan/cover.jpg",
  "/assets/photos/afgan/logo.png",
  "/assets/photos/sam/cover.jpg",
  "/assets/photos/sam/logo.png",
  "/assets/photos/kady/cover.jpg",
  "/assets/photos/kady/logo.png",
  "/assets/dukkanci-mark.png",
  "/assets/dukkanci-app-icon-192.png",
  "/assets/dukkanci-app-icon-512.png",
  "/assets/fonts/IBMPlexSansArabic-Regular.ttf",
  "/assets/fonts/IBMPlexSansArabic-Medium.ttf",
  "/assets/fonts/IBMPlexSansArabic-SemiBold.ttf",
  "/assets/fonts/IBMPlexSansArabic-Bold.ttf",
  "/assets/fonts/Tajawal-Bold.ttf",
  "/assets/fonts/Tajawal-ExtraBold.ttf",
  "/assets/photos/hero-market.jpg",
  "/assets/photos/store-market.jpg",
  "/assets/photos/store-bakery.jpg",
  "/assets/photos/store-butcher.jpg",
  "/assets/photos/store-spices.jpg",
  "/assets/photos/heelal/cover.png",
  "/assets/photos/heelal/logo-color.png",
  "/assets/photos/alsultan/logo.png",
  "/assets/photos/alsultan/logo-arabic.png",
  "/assets/photos/alsultan/brand-cover.png",
  "/assets/photos/alsultan/branches/branch-6.webp",
  "/assets/photos/alsultan/branches/branch-7.jpeg",
  "/assets/photos/alsultan/branches/branch-8.webp",
  "/assets/photos/alsultan/branches/branch-9.jpeg",
  "/assets/photos/alsultan/branches/branch-10.webp",
  "/assets/photos/alsultan/branches/branch-11.webp",
  "/assets/photos/zaitoune/logo.png",
  "/assets/photos/zaitoune/cover.jpg",
  "/assets/photos/product-tomatoes.jpg",
  "/assets/photos/product-vegetable-basket.jpg",
  "/assets/photos/product-olive-oil.jpg",
  "/assets/photos/product-baklava.jpg",
  "/assets/photos/product-cookies.jpg",
  "/assets/photos/product-meat.jpg",
  "/assets/photos/product-kofta.jpg",
  "/assets/photos/product-nuts.jpg",
  "/assets/photos/product-spices.jpg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put("/index.html", copy));
          return response;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});

