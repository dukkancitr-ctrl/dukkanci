// Dynamic sitemap.xml — lists real, indexable URLs (home, stores, offers, each store).
// Reads stores from Supabase via the public REST API (env vars set in Vercel).
module.exports = async (req, res) => {
  const BASE = "https://dukkanci.vercel.app";
  let url = (process.env.SUPABASE_URL || "").replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || "";
  const staticUrls = [`${BASE}/`, `${BASE}/stores`, `${BASE}/offers`];
  let storeUrls = [];
  try {
    if (url && key) {
      const r = await fetch(`${url}/rest/v1/stores?select=id&order=id`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (r.ok) {
        const rows = await r.json();
        storeUrls = rows.map(s => `${BASE}/store/${s.id}`);
      }
    }
  } catch (e) { /* fall back to static urls only */ }
  const all = [...staticUrls, ...storeUrls];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all.map(u => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(xml);
};
