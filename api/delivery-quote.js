const delivery = require("../lib/delivery");

// Two modes, one endpoint:
//
//  1. { storeId, destination:{lat,lng}, addressText? }  — AUTHORITATIVE.
//     The store's coordinates, per-km rate, fixed fee, max distance and named
//     zones are all read from the database, so a client that can't see the
//     website's bundled settings (the mobile app) gets the same price the
//     website charges. This is what the app's checkout uses.
//
//  2. { origin, destination, ratePerKm, maxRoundTripKm } — legacy contract used
//     by the website checkout (it already knows the store's settings). Unchanged.
module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const body = request.body || {};

  if (body.storeId != null) {
    try {
      const q = await delivery.quoteForStore({
        storeId: body.storeId,
        destination: body.destination,
        addressText: typeof body.addressText === "string" ? body.addressText.slice(0, 600) : ""
      });
      if (!q.ok) {
        const map = {
          store_not_found: [404, "المتجر غير موجود."],
          no_destination: [400, "يلزم إرسال موقع صحيح للعميل."]
        };
        const [status, error] = map[q.code] || [400, "تعذّر حساب التوصيل."];
        return response.status(status).json({ error, code: q.code });
      }
      return response.status(200).json(q);
    } catch (error) {
      console.error("delivery-quote (store mode) failed:", error.message);
      return response.status(502).json({ error: "تعذّر حساب رسوم التوصيل الآن.", code: "quote_failed" });
    }
  }

  if (!delivery.validPoint(body.origin) || !delivery.validPoint(body.destination)) {
    return response.status(400).json({ error: "يلزم إرسال موقع صحيح للمتجر والعميل." });
  }

  const origin = { lat: Number(body.origin.lat), lng: Number(body.origin.lng) };
  const destination = { lat: Number(body.destination.lat), lng: Number(body.destination.lng) };
  const ratePerKm = Math.min(40, Math.max(10, Number(body.ratePerKm) || 15));
  const maxRoundTripKm = Math.min(200, Math.max(5, Number(body.maxRoundTripKm) || 60));

  // Store-specific minimum (deliverySettings.minFee); absent/null/"" → platform default 150.
  const minFee = delivery.resolveMinFee(body.minFee);

  return response.status(200).json(await delivery.roadQuote(origin, destination, ratePerKm, maxRoundTripKm, minFee));
};
