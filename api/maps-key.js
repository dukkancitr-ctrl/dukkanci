// Hands the browser the same GOOGLE_MAPS_API_KEY used server-side, so the
// customer-facing address map can load the real Google Maps JavaScript API
// instead of Leaflet/OSM tiles. The key is a browser key (no HTTP-referrer
// restriction) already used client-side by design — see google-cloud-maps
// memory. Never bake this into a committed file; it only ever comes from env.
module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  return response.status(200).json({ key: process.env.GOOGLE_MAPS_API_KEY || null });
};
