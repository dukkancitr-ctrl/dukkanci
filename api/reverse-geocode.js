// Reverse-geocodes a {lat,lng} into a short Arabic area label ("الحي، المدينة")
// for the header location pill. Uses the same GOOGLE_MAPS_API_KEY as the
// delivery-quote route. Google-only by design (no third-party fallback) — if
// the key is missing or Google fails, the pill just shows no area label.
// The key never leaves the server.

function pickComponent(components, types) {
  for (const wanted of types) {
    const hit = components.find(c => (c.types || []).includes(wanted));
    if (hit) return hit.long_name;
  }
  return null;
}

async function googleReverse(lat, lng) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ar&key=${apiKey}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`Google geocode ${res.status}`);
    const data = await res.json();
    if (data.status !== "OK" || !data.results?.length) throw new Error(data.status || "no results");
    const components = data.results[0].address_components || [];
    const district = pickComponent(components, [
      "administrative_area_level_2", "sublocality_level_1", "sublocality", "neighborhood", "locality"
    ]);
    const city = pickComponent(components, ["administrative_area_level_1", "locality"]);
    const area = [district, city].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join("، ");
    return area || null;
  } finally {
    clearTimeout(timeout);
  }
}

module.exports = async (request, response) => {
  // Area labels are stable enough to cache briefly at the edge.
  response.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");

  const lat = Number(request.query?.lat);
  const lng = Number(request.query?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return response.status(400).json({ error: "إحداثيات غير صالحة" });
  }

  try {
    const area = await googleReverse(lat, lng);
    return response.status(200).json({ area: area || null, lat, lng });
  } catch (error) {
    console.error("reverse-geocode:", error.message);
    return response.status(200).json({ area: null, lat, lng });
  }
};
