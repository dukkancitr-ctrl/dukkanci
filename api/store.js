// Server-rendered store page for /store/:id (numeric id or English slug):
// real <title>/OG + JSON-LD (Store/LocalBusiness) + an in-source list of
// product links so Google discovers and crawls each product. The SPA hydrates
// over this and keeps the live tab in sync during in-app navigation.
const { STORE_SLUGS, STORE_SLUG_TO_ID } = require("../store-slugs.js");
// Origin to fetch the static shell from. Defaults to the SAME host serving this
// request (no dependency on any fixed/old domain); override with SSR_SHELL_ORIGIN.
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
  // The :id segment may be a numeric id (legacy) or an English slug.
  const raw = req.query && req.query.id != null ? String(req.query.id) : "";
  const id = /^\d+$/.test(raw) ? Number(raw) : (STORE_SLUG_TO_ID[raw] || 0);
  let html = "";
  try {
    const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
    const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  let store = null, products = [];
  if (id) {
    const rows = await sbGet(`stores?id=eq.${id}&select=name,description,image,cover_image,address,phone,lat,lng,category&limit=1`);
    store = rows && rows[0];
    if (store) {
      const p = await sbGet(`products?store_id=eq.${id}&select=name,slug&available=eq.true&slug=not.is.null&order=id&limit=300`);
      products = p || [];
    }
  }

  if (store && store.name) {
    const slug = STORE_SLUGS[id] || id;
    const title = `دكانجي - ${store.name}`;
    const desc = (store.description || "اطلب من متاجر ومطاعم حيك في إسطنبول بسهولة — توصيل سريع من سوق الحي.").slice(0, 200);
    let img = store.cover_image || store.image || "/assets/dukkanci-app-icon-512.png";
    if (img && !/^https?:\/\//.test(img)) img = SITE + img;
    const canonical = `${SITE}/store/${slug}`;
    const T = esc(title), D = esc(desc), I = esc(img), C = esc(canonical);

    // JSON-LD: a local business / store with address, phone, geo when available.
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Store",
      name: store.name,
      image: img,
      description: desc,
      url: canonical
    };
    if (store.address) jsonLd.address = { "@type": "PostalAddress", streetAddress: store.address, addressCountry: "TR" };
    if (store.phone) jsonLd.telephone = store.phone;
    if (store.lat != null && store.lng != null) jsonLd.geo = { "@type": "GeoCoordinates", latitude: store.lat, longitude: store.lng };

    // In-source product links (crawl graph). The SPA replaces this on hydration.
    const links = products.map(p => `<li><a href="/product/${esc(p.slug)}">${esc(p.name)}</a></li>`).join("");
    const body = `<section class="ssr-store"><h1>${esc(store.name)}</h1><p>${esc(desc)}</p>`
      + (links ? `<h2>المنتجات</h2><ul>${links}</ul>` : "") + `</section>`;

    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
      .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(">)/, `$1${I}$2`)
      .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <meta property="og:url" content="${C}">\n    <link rel="canonical" href="${C}">`)
      .replace(/<\/head>/, `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n</head>`)
      .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  res.status(200).send(html);
};
