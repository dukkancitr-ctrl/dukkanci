// Sitemap of every active store: /store/<slug>.
const { STORE_SLUGS } = require("../store-slugs.js");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

module.exports = async (req, res) => {
  const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;
  let rows = [];
  try {
    const r = await fetch(`${url}/rest/v1/stores?select=id,created_at&open=eq.true&order=id`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (r.ok) rows = await r.json();
  } catch (e) { /* empty sitemap on failure */ }

  const urls = rows.map(s => {
    const slug = STORE_SLUGS[s.id] || s.id;
    const lastmod = (s.created_at || "").slice(0, 10) || undefined;
    return `  <url><loc>${esc(SITE)}/store/${esc(slug)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.8</priority></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
};
