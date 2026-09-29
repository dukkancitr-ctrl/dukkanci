"use strict";

// Server-side delivery pricing — ONE implementation shared by /api/delivery-quote
// (storeId mode) and /api/notify-order (both order-save paths).
//
// Why this exists: a store's per-km rate / fixed fee / max distance used to live
// ONLY in the website's bundled <slug>-data.js files (+ each browser's
// localStorage). Nothing server-side and nothing in the mobile app could read
// them, so the Play app priced every delivery order at 0 and merely told the
// customer "the store will confirm the fee on WhatsApp" (real orders
// DK-0661634416 / DK-0662089943: deliveryFee null). The website now mirrors the
// effective settings of every store into site_settings.deliverySettings (the
// same key it already overlays on the bundled values), which makes the DATABASE
// the single source of truth for every client.
//
// Fee policy is identical to app.js estimateDeliveryQuote(): round-trip road
// km × ratePerKm, minimum 150, rounded UP to the next 50.

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

// Same defaults as DEFAULT_DELIVERY_SETTINGS in app.js — a store with no cloud
// entry is priced exactly as the website would price it with no bundled entry.
const DEFAULT_SETTINGS = { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 };

const env = k => (process.env[k] || "").trim();
function sbCfg() {
  return {
    url: (env("SUPABASE_URL") || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    key: env("SUPABASE_SERVICE_ROLE_KEY") || env("SUPABASE_ANON_KEY") || PUB_KEY
  };
}
async function sbGet(path) {
  const { url, key } = sbCfg();
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return null;
    const rows = await r.json().catch(() => null);
    return Array.isArray(rows) ? rows : null;
  } catch (e) { return null; }
}

function validPoint(point) {
  return Number.isFinite(Number(point?.lat))
    && Number.isFinite(Number(point?.lng))
    && !(Number(point.lat) === 0 && Number(point.lng) === 0)
    && Math.abs(Number(point.lat)) <= 90
    && Math.abs(Number(point.lng)) <= 180;
}

// Straight-line -> road distance for the LOCAL estimate (cart / store page). The server
// fallback in lib/delivery.js uses the same numbers, so keep the two in sync.
// A flat x1.28 under-quoted short city trips. Measured against 150 real Google Routes
// results between Dukkanci store locations (0.8-45 km straight-line, 2026-09-29): the
// road/straight ratio is ~1.5 up to ~12 km and falls to ~1.28 beyond ~28 km (long trips
// ride highways). With the flat 1.28 the estimate was 51 TL short on average and 42 of
// 150 were >=100 TL short of the checkout price; this blend brings the mean error to
// +2 TL and the >=100 TL short cases to 23. It also improves on the traffic-aware
// (fastest) routes used before, so it does not depend on the routing preference.
// One constant cannot remove the spread (Bosphorus crossings, one-way streets); only the
// real Google route can, which is what checkout uses.
const ROAD_FACTOR_NEAR = 1.48, ROAD_FACTOR_FAR = 1.28;
const ROAD_FACTOR_NEAR_KM = 12, ROAD_FACTOR_FAR_KM = 28;
function estimatedRoadKm(directKm) {
  const t = Math.min(1, Math.max(0, (directKm - ROAD_FACTOR_NEAR_KM) / (ROAD_FACTOR_FAR_KM - ROAD_FACTOR_NEAR_KM)));
  return Math.max(0.5, directKm * (ROAD_FACTOR_NEAR + (ROAD_FACTOR_FAR - ROAD_FACTOR_NEAR) * t));
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

// Delivery-fee policy: a 150 ل.ت minimum (nearest/shortest trip), and anything
// above is rounded UP to the next multiple of 50 (160 → 200). Keep in sync with
// normalizeDeliveryFee() in app.js.
//
// minFee = the store's own minimum (deliverySettings.minFee, 0..1000). null/""/NaN
// mean "unset" → 150. Never `Number(minFee)` blindly: Number(null) is 0 and would
// silently turn "unset" into "no minimum".
function resolveMinFee(minFee) {
  if (minFee == null || minFee === "" || !Number.isFinite(Number(minFee))) return 150;
  return Math.min(1000, Math.max(0, Number(minFee)));
}
function normalizeDeliveryFee(rawFee, minFee) {
  return Math.max(resolveMinFee(minFee), Math.ceil((rawFee || 0) / 50) * 50);
}

function finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, provider, minFee) {
  const roundTripKm = oneWayKm * 2;
  const rawFee = Math.round(roundTripKm * ratePerKm);
  return {
    oneWayKm,
    roundTripKm,
    routeMinutes,
    rawFee,
    fee: normalizeDeliveryFee(rawFee, minFee),
    minFee: resolveMinFee(minFee),
    provider,
    exceedsMaxDistance: roundTripKm > maxRoundTripKm
  };
}

function fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee) {
  const oneWayKm = estimatedRoadKm(haversineKm(origin, destination));
  const routeMinutes = Math.max(5, Math.ceil(oneWayKm / 28 * 60));
  return finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, "estimate", minFee);
}

async function googleRouteQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    // SHORTEST road route, not the fastest. The fee is per km, so the customer must
    // be charged for the shortest way, and the price must not move with the traffic
    // at the moment of the request: the old traffic-aware matrix call picked whatever
    // was fastest right now — the same address returned 8.21 km (350 ل.ت) at one
    // moment and 5.97 km (250 ل.ت) at another, while the true shortest route is
    // 5.57 km. computeRoutes returns up to 3 alternatives; we take the fewest km.
    // TRAFFIC_UNAWARE makes the candidate set independent of the time of day.
    const googleResponse = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration"
      },
      body: JSON.stringify({
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
        computeAlternativeRoutes: true
      })
    });
    if (!googleResponse.ok) throw new Error(`Google Routes returned ${googleResponse.status}`);
    const payload = await googleResponse.json();
    const candidates = (payload.routes || []).filter(item => Number(item.distanceMeters) > 0);
    if (!candidates.length) throw new Error("No route found");
    const route = candidates.reduce((best, item) => (item.distanceMeters < best.distanceMeters ? item : best));
    return finalizeQuote(
      route.distanceMeters / 1000,
      Math.max(1, Math.ceil(Number.parseFloat(route.duration) / 60)),
      ratePerKm,
      maxRoundTripKm,
      "google",
      minFee
    );
  } finally {
    clearTimeout(timeout);
  }
}

// Road quote with the estimate as a safety net (Google down / no key / no route).
async function roadQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee) {
  try { return await googleRouteQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee); }
  catch (e) { return fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee); }
}

// Same whitelist + ranges as the save-store-delivery endpoint, so a value that
// got into the row some other way can never produce an absurd fee.
function cleanSettings(raw) {
  const out = {};
  if (!raw || typeof raw !== "object") return out;
  if (raw.mode === "distance" || raw.mode === "fixed") out.mode = raw.mode;
  const num = (v, lo, hi) => { if (v == null || v === "") return null; const n = Number(v); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : null; };
  const fixedFee = num(raw.fixedFee, 0, 5000);            if (fixedFee != null) out.fixedFee = fixedFee;
  const ratePerKm = num(raw.ratePerKm, 10, 40);           if (ratePerKm != null) out.ratePerKm = ratePerKm;
  const prepMinutes = num(raw.prepMinutes, 5, 120);       if (prepMinutes != null) out.prepMinutes = prepMinutes;
  const maxRoundTripKm = num(raw.maxRoundTripKm, 5, 200); if (maxRoundTripKm != null) out.maxRoundTripKm = maxRoundTripKm;
  const minFee = num(raw.minFee, 0, 1000);                if (minFee != null) out.minFee = Math.round(minFee);
  return out;
}

// site_settings is one small read; cache it briefly so an order burst doesn't
// hit the database once per quote. 60s is well below how often merchants edit.
let cloudCache = null;
let cloudCacheAt = 0;
async function loadCloud() {
  if (cloudCache && Date.now() - cloudCacheAt < 60000) return cloudCache;
  const rows = await sbGet("site_settings?key=in.(deliverySettings,namedZones)&select=key,value");
  if (!rows) return cloudCache || { deliverySettings: {}, namedZones: {} };   // keep the stale copy on a read failure
  const map = { deliverySettings: {}, namedZones: {} };
  rows.forEach(r => { if (r && r.value && typeof r.value === "object") map[r.key] = r.value; });
  cloudCache = map;
  cloudCacheAt = Date.now();
  return map;
}

// Named zones (fixed price for listed residential complexes): the LONGEST
// matching keyword wins — same rule as estimateDeliveryQuote() in app.js.
function matchZone(zones, addressText) {
  if (!Array.isArray(zones) || !zones.length || !addressText) return null;
  const text = String(addressText).toLocaleLowerCase("tr");
  let best = null, bestLen = -1;
  for (const z of zones) {
    for (const k of (z && Array.isArray(z.match) ? z.match : [])) {
      const needle = String(k || "").toLocaleLowerCase("tr");
      if (needle && text.includes(needle) && needle.length > bestLen) { best = z; bestLen = needle.length; }
    }
  }
  return best;
}

// Effective delivery quote for ONE store, straight from the database.
//   { ok:true, fee, mode, provider, rawFee?, oneWayKm?, roundTripKm?, ratePerKm?,
//     maxRoundTripKm, estimatedMinutes, exceedsMaxDistance, zoneLabel? }
//   { ok:false, code } — code: store_not_found | no_destination
async function quoteForStore({ storeId, destination, addressText }) {
  const id = Number(storeId);
  if (!id) return { ok: false, code: "store_not_found" };
  const [rows, cloud] = await Promise.all([
    sbGet(`stores?id=eq.${id}&select=id,lat,lng,free_delivery_threshold&limit=1`),
    loadCloud()
  ]);
  const store = rows && rows[0];
  if (!store) return { ok: false, code: "store_not_found" };

  const cfg = { ...DEFAULT_SETTINGS, ...cleanSettings(cloud.deliverySettings && cloud.deliverySettings[String(id)]) };
  const origin = { lat: Number(store.lat), lng: Number(store.lng) };
  const hasOrigin = validPoint(origin);
  // Distance pricing needs the store's coordinates; without them the website
  // falls back to the fixed fee so a customer is never stuck — do the same.
  if (cfg.mode === "distance" && !hasOrigin) cfg.mode = "fixed";

  const zone = matchZone(cloud.namedZones && cloud.namedZones[String(id)], addressText);
  if (zone) {
    return { ok: true, storeId: id, mode: "zone", provider: "zone", fee: Number(zone.fee) || 0, zoneLabel: zone.label || "",
      maxRoundTripKm: cfg.maxRoundTripKm, estimatedMinutes: cfg.prepMinutes, exceedsMaxDistance: false,
      freeDeliveryThreshold: store.free_delivery_threshold != null ? Number(store.free_delivery_threshold) : null };
  }
  if (cfg.mode === "fixed") {
    return { ok: true, storeId: id, mode: "fixed", provider: "fixed", fee: cfg.fixedFee,
      maxRoundTripKm: cfg.maxRoundTripKm, estimatedMinutes: cfg.prepMinutes, exceedsMaxDistance: false,
      freeDeliveryThreshold: store.free_delivery_threshold != null ? Number(store.free_delivery_threshold) : null };
  }
  const dest = { lat: Number(destination && destination.lat), lng: Number(destination && destination.lng) };
  if (!validPoint(dest)) return { ok: false, code: "no_destination" };
  const q = await roadQuote(origin, dest, cfg.ratePerKm, cfg.maxRoundTripKm, cfg.minFee);
  return { ok: true, storeId: id, mode: "distance", ...q, ratePerKm: cfg.ratePerKm, maxRoundTripKm: cfg.maxRoundTripKm,
    estimatedMinutes: cfg.prepMinutes + q.routeMinutes,
    freeDeliveryThreshold: store.free_delivery_threshold != null ? Number(store.free_delivery_threshold) : null };
}

module.exports = {
  DEFAULT_SETTINGS, validPoint, haversineKm, resolveMinFee, normalizeDeliveryFee, finalizeQuote, fallbackQuote,
  googleRouteQuote, roadQuote, cleanSettings, matchZone, quoteForStore
};
