const http = require("http");
const fs = require("fs");
const path = require("path");

const port = Number(process.env.PORT) || 4173;
const host = process.env.HOST || "0.0.0.0";
const root = __dirname;
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon"
};

function sendJson(response, status, data) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify(data));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => {
      body += chunk;
      if (body.length > 20_000) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    request.on("error", reject);
  });
}

function validPoint(point) {
  return Number.isFinite(Number(point?.lat))
    && Number.isFinite(Number(point?.lng))
    && Math.abs(Number(point.lat)) <= 90
    && Math.abs(Number(point.lng)) <= 180;
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

function finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, provider) {
  const roundTripKm = oneWayKm * 2;
  return {
    oneWayKm,
    roundTripKm,
    routeMinutes,
    fee: Math.round(roundTripKm * ratePerKm),
    provider,
    exceedsMaxDistance: roundTripKm > maxRoundTripKm
  };
}

function fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm) {
  const oneWayKm = Math.max(0.5, haversineKm(origin, destination) * 1.28);
  const routeMinutes = Math.max(5, Math.ceil(oneWayKm / 28 * 60));
  return finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, "estimate");
}

async function googleRouteQuote(origin, destination, ratePerKm, maxRoundTripKm) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const googleResponse = await fetch("https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "originIndex,destinationIndex,duration,distanceMeters,status,condition"
      },
      body: JSON.stringify({
        origins: [{ waypoint: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } } }],
        destinations: [{ waypoint: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } } }],
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE"
      })
    });
    if (!googleResponse.ok) throw new Error(`Google Routes returned ${googleResponse.status}`);
    const routes = await googleResponse.json();
    const route = routes.find(item => item.condition === "ROUTE_EXISTS" && item.distanceMeters);
    if (!route) throw new Error("No route found");
    const oneWayKm = route.distanceMeters / 1000;
    const routeMinutes = Math.max(1, Math.ceil(Number.parseFloat(route.duration) / 60));
    return finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, "google");
  } finally {
    clearTimeout(timeout);
  }
}

async function handleDeliveryQuote(request, response) {
  try {
    const body = await readJson(request);
    if (!validPoint(body.origin) || !validPoint(body.destination)) {
      sendJson(response, 400, { error: "يلزم إرسال موقع صحيح للمتجر والعميل." });
      return;
    }
    const origin = { lat: Number(body.origin.lat), lng: Number(body.origin.lng) };
    const destination = { lat: Number(body.destination.lat), lng: Number(body.destination.lng) };
    const ratePerKm = Math.min(20, Math.max(10, Number(body.ratePerKm) || 15));
    const maxRoundTripKm = Math.min(200, Math.max(5, Number(body.maxRoundTripKm) || 60));
    let quote;
    try {
      quote = await googleRouteQuote(origin, destination, ratePerKm, maxRoundTripKm);
    } catch (error) {
      console.error("Google Routes fallback:", error.message);
      quote = fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm);
    }
    sendJson(response, 200, quote);
  } catch {
    sendJson(response, 400, { error: "تعذر قراءة طلب حساب التوصيل." });
  }
}

http.createServer(async (request, response) => {
  const requestPath = decodeURIComponent(request.url.split("?")[0]);
  if (requestPath === "/api/delivery-quote" && request.method === "POST") {
    await handleDeliveryQuote(request, response);
    return;
  }
  const relativePath = requestPath === "/" ? "index.html" : requestPath.replace(/^\/+/, "");
  const filePath = path.resolve(root, relativePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.stat(filePath, (statError, stat) => {
    const target = !statError && stat.isFile() ? filePath : path.join(root, "index.html");
    fs.readFile(target, (readError, data) => {
      if (readError) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": types[path.extname(target)] || "application/octet-stream",
        "Cache-Control": /^(sw\.js|index\.html)$/.test(path.basename(target)) ? "no-cache" : "public, max-age=300"
      });
      response.end(data);
    });
  });
}).listen(port, host, () => {
  console.log(`Dukkanci is running at http://${host}:${port}`);
});
