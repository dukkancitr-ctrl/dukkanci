const CACHE = "dukkanci-v18";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=18",
  "/heelal-products.js?v=18",
  "/app.js?v=18",
  "/manifest.json",
  "/assets/dukkanci-mark.png",
  "/assets/dukkanci-app-icon-192.png",
  "/assets/dukkanci-app-icon-512.png",
  "/assets/fonts/IBMPlexSansArabic-Regular.ttf",
  "/assets/fonts/IBMPlexSansArabic-Medium.ttf",
  "/assets/fonts/IBMPlexSansArabic-SemiBold.ttf",
  "/assets/fonts/IBMPlexSansArabic-Bold.ttf",
  "/assets/photos/hero-market.jpg",
  "/assets/photos/store-market.jpg",
  "/assets/photos/store-bakery.jpg",
  "/assets/photos/store-butcher.jpg",
  "/assets/photos/store-spices.jpg",
  "/assets/photos/heelal/cover.png",
  "/assets/photos/heelal/logo-color.png",
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
