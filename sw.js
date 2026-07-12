const CACHE = "dukkanci-v205";
const APP_SHELL = [
  "/",
  "/index.html",
  "/styles.css?v=170",
  "/store-slugs.js?v=237",
  "/category-slugs.js?v=83",
  "/dalil-regions.js?v=1",
  "/supabase-config.js?v=82",
  "/heelal-products.js?v=126",
  "/alsultan-data.js?v=126",
  "/zaitoune-data.js?v=126",
  "/ezzedine-data.js?v=126",
  "/salloura-data.js?v=126",
  "/nour-data.js?v=126",
  "/tihama-data.js?v=126",
  "/afgan-data.js?v=127",
  "/sam-data.js?v=126",
  "/kady-data.js?v=126",
  "/yemenchef-data.js?v=126",
  "/alwadi-data.js?v=126",
  "/kadiby-data.js?v=126",
  "/azal-data.js?v=126",
  "/abou-data.js?v=126",
  "/bitehaus-data.js?v=126",
  "/alagar-data.js?v=126",
  "/khawali-data.js?v=129",
  "/ademsef-data.js?v=126",
  "/babtoma-data.js?v=126",
  "/orange-data.js?v=126",
  "/anas-data.js?v=126",
  "/yemenmandy-data.js?v=126",
  "/alfursan-data.js?v=126",
  "/safa-data.js?v=127",
  "/feluka-data.js?v=1",
  "/app.js?v=287",
  "/manifest.json",
  "/assets/dukkanci-logo.png?v=81",
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
  "/assets/photos/yemenchef/cover.jpg",
  "/assets/photos/yemenchef/logo.png",
  "/assets/photos/alwadi/cover.jpg",
  "/assets/photos/alwadi/logo.png",
  "/assets/photos/kadiby/logo.png",
  "/assets/photos/azal/cover.jpg",
  "/assets/photos/azal/logo.jpg",
  "/assets/photos/abou/cover.jpg",
  "/assets/dukkanci-mark.png?v=86",
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

  // API calls must NEVER be served from cache (config, geocoding, quotes, etc.).
  // Let them bypass the service worker entirely so they always hit the network.
  const reqUrl = new URL(event.request.url);
  if (reqUrl.origin === self.location.origin && reqUrl.pathname.startsWith("/api/")) {
    return;
  }

  // Navigations: network-first, fall back to the cached shell when offline.
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

  // App code (JS/CSS): network-first so a new deploy is always picked up, even
  // if this service worker version lingers; fall back to cache only when offline.
  const url = new URL(event.request.url);
  if (url.origin === self.location.origin && /\.(js|css)$/.test(url.pathname)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request).then(c => c || caches.match("/index.html")))
    );
    return;
  }

  // Static assets (images, fonts, manifest): cache-first for speed.
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

// ───────────────────────── Web Push notifications ─────────────────────────
// The server (api/notify-order.js) sends an encrypted push with a JSON payload:
//   { title, body, url, tag, icon }
// We show it as a system notification; a tap focuses an existing tab on `url`
// (or opens a new one). Payload is optional — fall back to a generic message so a
// keep-alive/empty push never shows a blank notification.
self.addEventListener("push", event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) { data = {}; }
  const title = data.title || "دكانجي";
  const options = {
    body: data.body || "",
    icon: data.icon || "/assets/dukkanci-app-icon-192.png",
    badge: "/assets/dukkanci-mark.png?v=86",
    tag: data.tag || undefined,            // collapse repeats for the same order
    renotify: !!data.tag,
    dir: "rtl",
    lang: "ar",
    data: { url: data.url || "/" }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        // Focus an open tab on this origin and route it to the target.
        if ("focus" in client) {
          client.focus();
          if ("navigate" in client && target !== "/") { try { client.navigate(target); } catch (e) {} }
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

