// Sitemap INDEX at /sitemap.xml — links the static page, the stores sitemap,
// and one or more product sitemap pages (chunked at 45000 each). Domain comes
// from NEXT_PUBLIC_SITE_URL (never hardcoded).
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const PAGE_SIZE = 45000;

module.exports = async (req, res) => {
  const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;

  // How many available, slugged products? -> number of product sitemap pages.
  let productCount = 0;
  try {
    const r = await fetch(`${url}/rest/v1/products?select=id&slug=not.is.null&available=eq.true`, {
      headers: { apikey: key, Authorization: `Bearer ${key}`, Range: "0-0", "Range-Unit": "items", Prefer: "count=exact" }
    });
    const cr = r.headers.get("content-range") || "";       // e.g. "0-0/5592"
    productCount = parseInt(cr.split("/")[1], 10) || 0;
  } catch (e) { /* default to a single page */ }

  const pages = Math.max(1, Math.ceil(productCount / PAGE_SIZE));
  const today = new Date().toISOString().slice(0, 10);
  const entries = [`${SITE}/sitemap-stores.xml`, `${SITE}/sitemap-categories.xml`];
  for (let p = 0; p < pages; p++) entries.push(`${SITE}/sitemap-products.xml?page=${p}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(loc => `  <sitemap><loc>${loc}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(xml);
};
