// أدوات مشتركة لقشور SSR (server-rendered SEO shells).
//
// القشرة تعمل هكذا: نجلب `index.html` كما هو، نستبدل وسوم <head> العامة بقيم
// خاصة بالصفحة، ونحقن نصاً زاحفاً داخل <main> — ثم يُميّه app.js فوقه للمستخدم
// الحقيقي. النص المحقون **يجب** أن يعكس ما تعرضه دالة التصيير في app.js
// (تكافؤ محتوى — تفادياً للـcloaking).
//
// ملاحظة مقصودة: القشور الأقدم (api/store.js, api/product.js, api/category.js,
// api/dalil.js, api/why-dukkanci.js) لا تزال تكرّر هذا النمط داخلها سطراً بسطر.
// لم تُعدَّل عمداً (كلها حيّة ومُختبَرة، وإعادة توصيلها خارج نطاق هذه المهمة)؛
// هذا الملف موجود كي لا تكرّره القشور الجديدة (/stores, /offers, /regions,
// /contact) للمرة السادسة والسابعة.

const SHELL_ENV = (process.env.SSR_SHELL_ORIGIN || "").replace(/\/+$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");

const PUB_URL = "https://tzcqnqzltrjemdnkzpzn.supabase.co";
const PUB_KEY = "sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc";

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function fetchShell(req) {
  const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
  const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
  return shell.text();
}

// نفس سلسلة الاستبدال المستخدَمة في api/why-dukkanci.js حرفياً.
function applyMeta(html, { title, description, canonical, body, jsonLd = [], robots = "index,follow" }) {
  const T = esc(title), D = esc(description), C = esc(canonical);
  const ld = jsonLd
    .map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`)
    .join("\n  ");
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(">)/, `$1${C}$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <meta name="robots" content="${esc(robots)}">\n  ${ld}\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${body}</main>`);
}

function send(res, html) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, must-revalidate");
  res.status(200).send(html);
}

// عند تعذّر جلب القشرة: توجيه لـ/index.html بدل صفحة بيضاء (نمط القشور القائمة).
function shellFallback(res) {
  res.setHeader("Location", "/index.html");
  return res.status(302).end();
}

// قارئ Supabase REST بنفس المفتاح العام الذي تستخدمه الواجهة. يبتلع الأخطاء
// ويُعيد null — القشرة يجب أن تُصيَّر دائماً حتى لو تعذّرت البيانات.
async function sbGet(path) {
  const url = (process.env.SUPABASE_URL || PUB_URL).replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
  const key = process.env.SUPABASE_ANON_KEY || PUB_KEY;
  try {
    const r = await fetch(`${url}/rest/v1/${path}`, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!r.ok) return null;
    const rows = await r.json();
    return Array.isArray(rows) ? rows : null;
  } catch (e) { return null; }
}

// «فتات الخبز» — نفس الشكل المستخدَم في api/dalil.js.
function breadcrumbLd(trail) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, path], i) => ({
      "@type": "ListItem", position: i + 1, name, item: `${SITE}${path}`
    }))
  };
}

module.exports = { SITE, esc, fetchShell, applyMeta, send, shellFallback, sbGet, breadcrumbLd };
