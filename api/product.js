// Server-rendered product page for /product/<slug>: full HTML with <h1>, the
// product description, a link to its store, and JSON-LD (Product + offer +
// seller) — so Google indexes each product with real content in the source.
// The SPA hydrates over this and renders the live product view.
const { STORE_SLUGS } = require("../store-slugs.js");
// Origin for the static shell — same host as the request by default; override with SSR_SHELL_ORIGIN.
const SHELL_ENV = (process.env.SSR_SHELL_ORIGIN || "").replace(/\/+$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, ""); // public canonical
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
  const raw = req.query && req.query.slug != null ? String(req.query.slug) : "";
  let html = "";
  try {
    const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
    const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  let product = null, store = null;
  if (raw) {
    const filter = /^\d+$/.test(raw) ? `id=eq.${raw}` : `slug=eq.${encodeURIComponent(raw)}`;
    const rows = await sbGet(`products?${filter}&select=id,name,price,price_on_request,store_id,available,image,description,category,slug&limit=1`);
    product = rows && rows[0];
    if (product && product.store_id) {
      const s = await sbGet(`stores?id=eq.${product.store_id}&select=name,address&limit=1`);
      store = s && s[0];
    }
  }

  // Not found or inactive → 404 + noindex so Google drops it.
  if (!product || product.available === false) {
    html = html.replace(/<\/head>/, `  <meta name="robots" content="noindex">\n</head>`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(html);
  }

  const storeName = store && store.name ? store.name : "دكانجي";
  const storeSlug = STORE_SLUGS[product.store_id] || product.store_id;
  const title = `${product.name} — ${storeName} | دكانجي`;
  const desc = (product.description || `${product.name} من ${storeName} على دكانجي.`).slice(0, 200);
  let img = product.image || "/assets/dukkanci-app-icon-512.png";
  if (img && !/^https?:\/\//.test(img)) img = SITE + img;
  const canonical = `${SITE}/product/${product.slug || product.id}`;
  const priceVal = Number(product.price) || 0;
  const available = product.available !== false;

  // JSON-LD Product
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: [img],
    description: desc,
    category: product.category || undefined,
    offers: {
      "@type": "Offer",
      url: canonical,
      priceCurrency: "TRY",
      availability: available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: storeName }
    }
  };
  if (!product.price_on_request && priceVal > 0) jsonLd.offers.price = priceVal.toFixed(2);

  const T = esc(title), D = esc(desc), I = esc(img), C = esc(canonical);
  const priceLine = product.price_on_request || !priceVal ? "السعر عند الطلب" : `${priceVal} ل.ت`;

  // Visible SSR content inside the SPA mount point (Google reads this in source).
  const body = `<article class="ssr-product"><h1>${esc(product.name)}</h1>`
    + `<p>${esc(desc)}</p>`
    + `<p><strong>${esc(priceLine)}</strong></p>`
    + `<p><a href="/store/${esc(storeSlug)}">${esc(storeName)}</a></p></article>`;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(">)/, `$1${I}$2`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(">)/, `$1product$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <meta property="og:url" content="${C}">\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  res.status(200).send(html);
};
