// Server-rendered <title> + Open Graph tags for /store/:id so the real store name
// appears in the served HTML — link previews/unfurls, search engines, and the browser
// tab all show "دكانجي - {store name}" instead of the generic site title. The SPA's
// client-side JS still runs and keeps everything in sync during in-app navigation.
const { STORE_SLUGS, STORE_SLUG_TO_ID } = require("../store-slugs.js");
const BASE = "https://dukkanci.vercel.app";
const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

module.exports = async (req, res) => {
  // The :id segment may be a numeric id (legacy) or an English slug.
  const raw = req.query && req.query.id != null ? String(req.query.id) : "";
  const id = /^\d+$/.test(raw) ? Number(raw) : (STORE_SLUG_TO_ID[raw] || 0);
  // Always start from the real static shell (served directly, bypassing the SPA rewrite).
  let html = "";
  try {
    const shell = await fetch(`${BASE}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  let store = null;
  if (id) {
    try {
      const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
      const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;
      const r = await fetch(`${url}/rest/v1/stores?id=eq.${id}&select=name,description,image,cover_image&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (r.ok) { const rows = await r.json(); store = rows && rows[0]; }
    } catch (e) { /* fall back to the generic shell */ }
  }

  if (store && store.name) {
    const title = `دكانجي - ${store.name}`;
    const desc = (store.description || "اطلب من متاجر ومطاعم حيك في إسطنبول بسهولة — توصيل سريع من سوق الحي.").slice(0, 200);
    let img = store.cover_image || store.image || "/assets/dukkanci-app-icon-512.png";
    if (img && !/^https?:\/\//.test(img)) img = BASE + img;
    const canonical = `${BASE}/store/${STORE_SLUGS[id] || id}`;
    const T = esc(title), D = esc(desc), I = esc(img), C = esc(canonical);

    html = html
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
      .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
      .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
      .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
      .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(">)/, `$1${I}$2`)
      .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <meta property="og:url" content="${C}">\n    <link rel="canonical" href="${C}">`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // Short edge cache; client JS keeps the live tab title in sync regardless.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=300, must-revalidate");
  res.status(200).send(html);
};
