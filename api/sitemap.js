// Combined sitemap endpoint — one serverless function serves the sitemap index
// AND all sub-sitemaps, dispatched by ?type=. Merged from four separate
// functions to stay under the platform's serverless-function limit. Public .xml
// URLs are preserved via vercel.json rewrites:
//   /sitemap.xml            -> /api/sitemap                 (index)
//   /sitemap-stores.xml     -> /api/sitemap?type=stores
//   /sitemap-products.xml   -> /api/sitemap?type=products   (&page=N forwarded)
//   /sitemap-categories.xml -> /api/sitemap?type=categories
// Domain comes from NEXT_PUBLIC_SITE_URL (never hardcoded).
const { STORE_SLUGS } = require("../store-slugs.js");
const { CATEGORY_SLUGS } = require("../category-slugs.js");

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";
const PAGE_SIZE = 45000;
const esc = s => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function db() {
  const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;
  return { url, key };
}

function sendXml(res, body) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600, s-maxage=3600");
  res.status(200).send(body);
}

const urlset = urls => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

// Sitemap INDEX: links the stores + categories sitemaps and one or more product
// sitemap pages (chunked at 45000 each).
async function sitemapIndex(res) {
  const { url, key } = db();
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
  const entries = [`${SITE}/sitemap-pages.xml`, `${SITE}/sitemap-stores.xml`, `${SITE}/sitemap-categories.xml`];
  for (let p = 0; p < pages; p++) entries.push(`${SITE}/sitemap-products.xml?page=${p}`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(loc => `  <sitemap><loc>${loc}</loc><lastmod>${today}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;
  sendXml(res, xml);
}

// Every active store: /store/<slug>.
async function sitemapStores(res) {
  const { url, key } = db();
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
  sendXml(res, urlset(urls));
}

// Available products: /product/<slug>. Paginated 45000 per page via ?page=N.
async function sitemapProducts(req, res) {
  const page = Math.max(0, parseInt(req.query && req.query.page, 10) || 0);
  const { url, key } = db();
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
  sendXml(res, urlset(urls));
}

// Main category pages: /category/<slug>.
function sitemapCategories(res) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = Object.keys(CATEGORY_SLUGS).map(slug =>
    `  <url><loc>${esc(SITE)}/category/${esc(slug)}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`
  );
  sendXml(res, urlset(urls));
}

// Static content/landing pages (home + indexable info pages).
function sitemapPages(res) {
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    ["/", "1.0", "daily"],
    ["/why-dukkanci", "0.9", "monthly"],
    ["/stores", "0.9", "daily"],
    ["/offers", "0.8", "daily"],
    ["/about", "0.5", "monthly"],
    ["/faq", "0.5", "monthly"],
    ["/terms", "0.3", "yearly"]
  ];
  const urls = pages.map(([path, priority, freq]) =>
    `  <url><loc>${esc(SITE)}${path}</loc><lastmod>${today}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`
  );
  sendXml(res, urlset(urls));
}

module.exports = async (req, res) => {
  const type = (req.query && req.query.type) || "";
  if (type === "stores") return sitemapStores(res);
  if (type === "products") return sitemapProducts(req, res);
  if (type === "categories") return sitemapCategories(res);
  if (type === "pages") return sitemapPages(res);
  return sitemapIndex(res);
};
