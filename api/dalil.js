// Server-rendered shell for /dalil («دليل دكانجي») and /dalil/compare:
// real <title>/meta/canonical + ItemList JSON-LD + an in-source list of store
// links (with their Google ratings) so the directory and its category/region
// variants are crawlable. The SPA hydrates over this (renderDalilPage in app.js).
// Same shell-fetch/meta-replace pattern as api/store.js.
const { STORE_SLUGS } = require("../store-slugs.js");
const { resolveStoreSlug } = require("../lib/store-slug.js");
const { CATEGORY_SLUGS } = require("../category-slugs.js");
const { DALIL_REGIONS, dalilRegionFor } = require("../dalil-regions.js");

const SHELL_ENV = (process.env.SSR_SHELL_ORIGIN || "").replace(/\/+$/, "");
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

// Mirrors storeMatchesCategory() in app.js: "ملاحم" is the browse grouping for
// the more specific per-store labels ("ملحمة ومشاوي" etc.).
function matchesCategory(storeCategory, catText) {
  return storeCategory === catText || (catText === "ملاحم" && String(storeCategory || "").includes("ملحم"));
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const isCompare = q.view === "compare";
  // Only whitelisted filter values get an indexable page; unknown values fall
  // back to the plain directory content but are marked noindex (junk-URL guard).
  const catSlug = CATEGORY_SLUGS[String(q.category || "")] ? String(q.category) : "";
  const regionDef = DALIL_REGIONS.find(r => r.slug === String(q.region || ""));
  const unknownFilter = (!!q.category && !catSlug) || (!!q.region && !regionDef);

  let html = "";
  try {
    const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
    const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  let rows = [];
  try {
    rows = (await sbGet("stores?select=id,name,slug,category,address,google_rating,google_reviews_count&or=(approval_status.is.null,approval_status.eq.approved)&order=id&limit=500")) || [];
  } catch (e) { rows = []; }

  const catText = catSlug ? CATEGORY_SLUGS[catSlug] : "";
  let list = rows;
  if (catText) list = list.filter(s => matchesCategory(s.category, catText));
  if (regionDef) list = list.filter(s => dalilRegionFor(s.name, s.address).slug === regionDef.slug);
  // Organic ranking only (Google review count) — featured/paid never boosts it.
  const ranked = list.slice().sort((a, b) => (b.google_reviews_count || 0) - (a.google_reviews_count || 0));

  const regLabel = regionDef ? regionDef.label : "";
  let title, desc;
  if (isCompare) {
    title = "مقارنة المتاجر | دليل دكانجي";
    desc = "قارن حتى 3 متاجر جنباً إلى جنب: تقييم Google وعدد التقييمات والتوصيل والحد الأدنى للطلب — ثم اطلب مباشرة عبر دكانجي.";
  } else if (catText && regLabel) {
    title = `دليل ${catText} في ${regLabel} | دكانجي`;
    desc = `${ranked.length} من ${catText} في ${regLabel} بتقييمات Google الحقيقية وعدد التقييمات — قارن واطلب مباشرة عبر دكانجي.`;
  } else if (catText) {
    title = `دليل ${catText} في إسطنبول — الأعلى تقييماً | دكانجي`;
    desc = `${ranked.length} من ${catText} في إسطنبول مرتبة بتقييمات Google الحقيقية — فلترة بالمنطقة، مقارنة حتى 3 متاجر، وطلب مباشر عبر دكانجي.`;
  } else if (regLabel) {
    title = `دليل متاجر ومطاعم ${regLabel} | دكانجي`;
    desc = `${ranked.length} متجراً ومطعماً عربياً في ${regLabel} بتقييمات Google وعدد التقييمات — قارن واطلب مباشرة عبر دكانجي.`;
  } else {
    title = "دليل دكانجي — أفضل المطاعم والمتاجر العربية في إسطنبول بتقييمات Google";
    desc = `دليل شامل لـ${ranked.length} مطعماً ومتجراً عربياً في إسطنبول: تقييمات Google الحقيقية وعدد التقييمات، فلترة بالمنطقة والتصنيف، مقارنة حتى 3 متاجر، وطلب مباشر عبر دكانجي.`;
  }

  const canonicalQs = [catSlug ? `category=${catSlug}` : "", regionDef ? `region=${regionDef.slug}` : ""].filter(Boolean).join("&");
  const canonical = isCompare ? `${SITE}/dalil` : `${SITE}/dalil${canonicalQs ? `?${canonicalQs}` : ""}`;
  const T = esc(title), D = esc(desc.slice(0, 300)), C = esc(canonical);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    description: desc,
    url: canonical,
    numberOfItems: Math.min(ranked.length, 30),
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: ranked.slice(0, 30).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE}/store/${resolveStoreSlug(s, STORE_SLUGS)}`
    }))
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "الرئيسية", item: `${SITE}/` },
      { "@type": "ListItem", position: 2, name: "دليل دكانجي", item: `${SITE}/dalil` },
      ...(catText || regLabel ? [{ "@type": "ListItem", position: 3, name: [catText, regLabel].filter(Boolean).join(" — "), item: canonical }] : [])
    ]
  };

  // In-source crawl graph: every listed store links to its /store/<slug> page,
  // plus the category/region directory variants. The SPA replaces this on hydration.
  const storeLinks = ranked.map(s => {
    const region = dalilRegionFor(s.name, s.address);
    const rating = s.google_rating != null
      ? ` — ${esc(Number(s.google_rating).toFixed(1))}★ (${esc(s.google_reviews_count || 0)} تقييم Google)`
      : "";
    return `<li><a href="/store/${esc(resolveStoreSlug(s, STORE_SLUGS))}">${esc(s.name)}</a> — ${esc(s.category || "")} · ${esc(region.label)}${rating}</li>`;
  }).join("");
  const catLinks = Object.entries(CATEGORY_SLUGS)
    .map(([slug, text]) => `<li><a href="/dalil?category=${esc(slug)}">دليل ${esc(text)} في إسطنبول</a></li>`).join("");
  const regionLinks = DALIL_REGIONS
    .map(r => `<li><a href="/dalil?region=${esc(r.slug)}">متاجر ومطاعم ${esc(r.label)}</a></li>`).join("");
  const body = `<section class="ssr-store"><h1>${T}</h1><p>${D}</p>`
    + (storeLinks ? `<ul>${storeLinks}</ul>` : "")
    + `<h2>الدليل حسب التصنيف</h2><ul>${catLinks}</ul>`
    + `<h2>الدليل حسب المنطقة</h2><ul>${regionLinks}</ul></section>`;

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(">)/, `$1${C}$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>\n  <script type="application/ld+json">${JSON.stringify(breadcrumb)}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);

  // Compare view and junk filter values must never be indexed.
  if (isCompare || unknownFilter) {
    html = html.replace(/<\/head>/, `  <meta name="robots" content="noindex">\n</head>`);
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=600, must-revalidate");
  res.status(200).send(html);
};
