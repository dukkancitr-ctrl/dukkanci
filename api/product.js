// Server-rendered product page for /product/<slug>: full HTML with <h1>, the
// product description, a link to its store, and JSON-LD (Product + offer +
// seller) — so Google indexes each product with real content in the source.
// The SPA hydrates over this and renders the live product view.
const { STORE_SLUGS } = require("../store-slugs.js");
const { resolveStoreSlug } = require("../lib/store-slug.js");
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
      const s = await sbGet(`stores?id=eq.${product.store_id}&select=name,slug,address,description,category,hours,approval_status&limit=1`);
      store = s && s[0];
      // A product's own store might not be approved yet (pending review) — the
      // store page itself already noindexes in that case (api/store.js), so the
      // product page must match instead of leaking an unvetted listing to Google.
      if (store && store.approval_status && store.approval_status !== "approved") store = null;
    }
  }

  // Not found, inactive, or belongs to an unapproved store → 404 + noindex so Google drops it.
  if (!product || product.available === false || !store) {
    html = html.replace(/<\/head>/, `  <meta name="robots" content="noindex">\n</head>`);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(html);
  }

  // Dialect alternate-names (product_synonyms) — surfaced to Google so a search in
  // any Arabic dialect resolves to this product. Optional; empty until generated.
  let synonyms = [];
  try {
    const sy = await sbGet(`product_synonyms?product_id=eq.${product.id}&select=synonyms&limit=1`);
    if (sy && sy[0] && Array.isArray(sy[0].synonyms)) {
      synonyms = sy[0].synonyms.map(s => String(s == null ? "" : s).trim()).filter(Boolean).slice(0, 12);
    }
  } catch (e) { /* synonyms are optional */ }

  // Other products from the same store (same category first) — gives every
  // product page unique, crawlable content + internal links. Without it Google
  // saw ~250 chars of product text against a shared shell and folded 522 product
  // pages into unrelated "canonicals" (Search Console, 2026-09-24). Mirrors
  // productPageStoreBlock() in app.js so source and rendered DOM agree.
  let related = [];
  try {
    // Nearest neighbours by id (not "first 12"), so in a 1,000-product store
    // each page links a different set instead of all sharing one block.
    const pid = Number(product.id);
    const catF = product.category ? `&category=eq.${encodeURIComponent(product.category)}` : "";
    const base = `products?store_id=eq.${product.store_id}&available=eq.true&slug=not.is.null&select=id,name,slug,price,price_on_request,category`;
    const [after, before] = await Promise.all([
      sbGet(`${base}${catF}&id=gt.${pid}&order=id.asc&limit=12`),
      sbGet(`${base}${catF}&id=lt.${pid}&order=id.desc&limit=12`)
    ]);
    let pool = (after || []).concat(before || []);
    if (pool.length < 12 && catF) {
      const more = await sbGet(`${base}&id=neq.${pid}&order=id&limit=40`);
      const seen = new Set(pool.map(p => p.id));
      pool = pool.concat((more || []).filter(p => !seen.has(p.id)));
    }
    related = pool
      .map(p => ({ p, d: Math.abs(Number(p.id) - pid) + (p.category === product.category ? 0 : 1e9) }))
      .sort((a, b) => a.d - b.d).slice(0, 12).map(x => x.p);
  } catch (e) { /* related list is optional */ }

  const storeName = store && store.name ? store.name : "دكانجي";
  const storeSlug = resolveStoreSlug({ id: product.store_id, name: storeName, slug: store && store.slug }, STORE_SLUGS);
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
  if (synonyms.length) jsonLd.alternateName = synonyms;

  const T = esc(title), D = esc(desc), I = esc(img), C = esc(canonical);
  const priceLine = product.price_on_request || !priceVal ? "السعر عند الطلب" : `${priceVal} ل.ت`;
  const synLine = synonyms.length ? `<p class="ssr-synonyms">يُعرف أيضاً باسم: ${esc(synonyms.join("، "))}</p>` : "";

  // Visible SSR content inside the SPA mount point (Google reads this in source).
  const body = `<article class="ssr-product"><h1>${esc(product.name)}</h1>`
    + `<p>${esc(desc)}</p>`
    + `<p><strong>${esc(priceLine)}</strong></p>`
    + synLine
    + `<p><a href="/store/${esc(storeSlug)}">${esc(storeName)}</a></p></article>`
    + `<section class="ssr-product-store"><h2>عن ${esc(storeName)}</h2>`
    + (store.description ? `<p>${esc(store.description)}</p>` : "")
    + `<ul>`
    + (store.category ? `<li>القسم: ${esc(store.category)}</li>` : "")
    + (store.address ? `<li>العنوان: ${esc(store.address)}</li>` : "")
    + (store.hours ? `<li>أوقات العمل: ${esc(store.hours)}</li>` : "")
    + `</ul>`
    + (related.length
      ? `<h2>منتجات أخرى من ${esc(storeName)}</h2><ul>` + related.map(p => {
          const pv = Number(p.price) || 0;
          const pl = p.price_on_request || !pv ? "السعر عند الطلب" : `${pv} ل.ت`;
          return `<li><a href="/product/${esc(p.slug)}">${esc(p.name)}</a> — ${esc(pl)}</li>`;
        }).join("") + `</ul>`
      : "")
    + `</section>`;

  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "دكانجي", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: storeName, item: `${SITE}/store/${storeSlug}` },
      { "@type": "ListItem", position: 3, name: product.name, item: canonical }
    ]
  };

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(">)/, `$1${I}$2`)
    .replace(/(<meta\s+property="og:image:secure_url"\s+content=")[^"]*(">)/, `$1${I}$2`)
    .replace(/(<meta\s+property="og:type"\s+content=")[^"]*(">)/, `$1product$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(">)/, `$1${C}$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  <script type="application/ld+json">${JSON.stringify(crumbs)}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  res.status(200).send(html);
};
