// Server-rendered category page for /category/<slug> (main store categories).
// Lists the stores in the category + a sample of their products as crawlable
// links, with CollectionPage JSON-LD. Heavy product enumeration stays in the
// product sitemap; this page is the categorical entry point.
const { STORE_SLUGS } = require("../store-slugs.js");
const { CATEGORY_SLUGS } = require("../category-slugs.js");
const SHELL = "https://dukkanci.vercel.app";
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function sb() {
  return {
    url: (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, ""),
    key: process.env.SUPABASE_ANON_KEY || PUB_KEY
  };
}
async function sbGet(path) {
  const { url, key } = sb();
  const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
  if (!r.ok) return null;
  const rows = await r.json();
  return Array.isArray(rows) ? rows : null;
}

module.exports = async (req, res) => {
  const slug = req.query && req.query.slug != null ? String(req.query.slug) : "";
  const catText = CATEGORY_SLUGS[slug];
  let html = "";
  try {
    const shell = await fetch(`${SHELL}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  if (!catText) {
    html = html.replace(/<\/head>/, `  <meta name="robots" content="noindex">\n</head>`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(html);
  }

  const stores = (await sbGet(`stores?category=eq.${encodeURIComponent(catText)}&select=id,name&open=eq.true&order=id`)) || [];
  let products = [];
  if (stores.length) {
    const ids = stores.map(s => s.id).join(",");
    products = (await sbGet(`products?store_id=in.(${ids})&select=name,slug&available=eq.true&slug=not.is.null&order=id&limit=60`)) || [];
  }

  const title = `${catText} | دكانجي`;
  const desc = `تصفّح ${catText} في إسطنبول على دكانجي: ${stores.length} متجراً، اطلب أونلاين بتوصيل سريع.`.slice(0, 200);
  const canonical = `${SITE}/category/${slug}`;
  const T = esc(title), D = esc(desc), C = esc(canonical);

  const storeLinks = stores.map(s => `<li><a href="/store/${esc(STORE_SLUGS[s.id] || s.id)}">${esc(s.name)}</a></li>`).join("");
  const productLinks = products.map(p => `<li><a href="/product/${esc(p.slug)}">${esc(p.name)}</a></li>`).join("");
  const body = `<section class="ssr-category"><h1>${esc(catText)}</h1><p>${esc(desc)}</p>`
    + (storeLinks ? `<h2>المتاجر</h2><ul>${storeLinks}</ul>` : "")
    + (productLinks ? `<h2>منتجات مختارة</h2><ul>${productLinks}</ul>` : "")
    + `</section>`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    url: canonical,
    description: desc
  };

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <meta property="og:url" content="${C}">\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  res.status(200).send(html);
};
