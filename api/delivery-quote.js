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

// Delivery-fee policy: a 150 ل.ت minimum (nearest/shortest trip), and anything
// above is rounded UP to the next multiple of 50 (160 → 200). Keep in sync with
// normalizeDeliveryFee() in app.js.
function normalizeDeliveryFee(rawFee) {
  return Math.max(150, Math.ceil((rawFee || 0) / 50) * 50);
}

function finalizeQuote(oneWayKm, routeMinutes, ratePerKm, maxRoundTripKm, provider) {
  const roundTripKm = oneWayKm * 2;
  const rawFee = Math.round(roundTripKm * ratePerKm);
  return {
    oneWayKm,
    roundTripKm,
    routeMinutes,
    rawFee,
    fee: normalizeDeliveryFee(rawFee),
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
    return finalizeQuote(
      route.distanceMeters / 1000,
      Math.max(1, Math.ceil(Number.parseFloat(route.duration) / 60)),
      ratePerKm,
      maxRoundTripKm,
      "google"
    );
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const body = request.body || {};
  if (!validPoint(body.origin) || !validPoint(body.destination)) {
    return response.status(400).json({ error: "يلزم إرسال موقع صحيح للمتجر والعميل." });
  }

  const origin = { lat: Number(body.origin.lat), lng: Number(body.origin.lng) };
  const destination = { lat: Number(body.destination.lat), lng: Number(body.destination.lng) };
  const ratePerKm = Math.min(20, Math.max(10, Number(body.ratePerKm) || 15));
  const maxRoundTripKm = Math.min(200, Math.max(5, Number(body.maxRoundTripKm) || 60));

  try {
    return response.status(200).json(
      await googleRouteQuote(origin, destination, ratePerKm, maxRoundTripKm)
    );
  } catch (error) {
    console.error("Google Routes fallback:", error.message);
    return response.status(200).json(
      fallbackQuote(origin, destination, ratePerKm, maxRoundTripKm)
    );
  }
};
