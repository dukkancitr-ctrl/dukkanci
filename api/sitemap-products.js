// Sitemap of available products: /product/<slug>. Paginated 45000 per page
// (Google's limit is 50000) via ?page=N — the sitemap index links each page.
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const PAGE_SIZE = 45000;
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

module.exports = async (req, res) => {
  const page = Math.max(0, parseInt(req.query && req.query.page, 10) || 0);
  const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  // Supabase caps each REST response at ~1000 rows, so fetch the page in 1000-row
  // batches until we have the full 45000-slot page (or run out of products).
  let rows = [];
  try {
    for (let offset = start; offset < end; offset += 1000) {
      const r = await fetch(
        `${url}/rest/v1/products?select=slug,created_at&slug=not.is.null&available=eq.true&order=id&limit=1000&offset=${offset}`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` } }
      );
      if (!r.ok) break;
      const batch = await r.json();
      rows = rows.concat(batch);
      if (batch.length < 1000) break;
    }
  } catch (e) { /* partial/empty sitemap on failure */ }

  const urls = rows.map(p => {
    const lastmod = (p.created_at || "").slice(0, 10) || undefined;
    return `  <url><loc>${esc(SITE)}/product/${esc(p.slug)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}<changefreq>weekly</changefreq><priority>0.6</priority></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
};
