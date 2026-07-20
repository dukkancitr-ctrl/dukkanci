// قشرة SSR لصفحة «اطلب من المتاجر» (/stores).
//
// قبل هذا الملف كان /stores يسقط في catch-all بـvercel.json إلى index.html، أي أن
// الزاحف يستلم عنوان ووصف الصفحة الرئيسية حرفياً فلا يميّز الصفحتين في التمريرة
// الأولى — وهذا أحد سببَي غيابها عن روابط غوغل الفرعية (sitelinks). السبب الثاني
// أن التنقل كان يربطها بـ"#stores" (جزء من الصفحة الرئيسية لا رابط مستقل)، فلم
// تكن تتلقى أي رابط داخلي حقيقي إطلاقاً.
//
// الجسم أدناه يعكس ما تعرضه renderStoresPage() في app.js (تكافؤ محتوى)، ويبني
// أيضاً رسم زحف حقيقياً: كل متجر معتمد يحصل على رابط /store/<slug>.
const { STORE_SLUGS } = require("../store-slugs.js");
const { resolveStoreSlug } = require("../lib/store-slug.js");
const { CATEGORY_SLUGS } = require("../category-slugs.js");
const { SITE, esc, fetchShell, applyMeta, send, shellFallback, sbGet, breadcrumbLd } = require("../lib/ssr-shell.js");

const TITLE = "اطلب من المتاجر — كل متاجر ومطاعم حيّك في إسطنبول | دكانجي";
const DESC = "تصفّح كل متاجر ومطاعم دكانجي في إسطنبول: مطاعم، سوبرماركت، ملاحم، حلويات، مكسرات وبهارات — واطلب أونلاين مع توصيل من متجر حيّك.";

// نفس تجميع storeMatchesCategory() في app.js: «ملاحم» مظلّة للتسميات الأدق.
function matchesCategory(storeCategory, catText) {
  return storeCategory === catText || (catText === "ملاحم" && String(storeCategory || "").includes("ملحم"));
}

module.exports = async (req, res) => {
  let html = "";
  try {
    html = await fetchShell(req);
  } catch (e) {
    return shellFallback(res);
  }

  const rows = (await sbGet(
    "stores?select=id,name,slug,category,address,google_rating,google_reviews_count&open=eq.true&or=(approval_status.is.null,approval_status.eq.approved)&order=id&limit=500"
  )) || [];

  const href = s => `/store/${esc(resolveStoreSlug(s, STORE_SLUGS))}`;
  const storeLi = s => {
    const rating = s.google_rating
      ? ` — تقييم ${esc(s.google_rating)}${s.google_reviews_count ? ` (${esc(s.google_reviews_count)} تقييم)` : ""}`
      : "";
    return `<li><a href="${href(s)}">${esc(s.name)}</a>${rating}</li>`;
  };

  // مجموعات حسب التصنيف بنفس ترتيب category-slugs.js، ثم البقية تحت «متاجر أخرى».
  const used = new Set();
  const groups = [];
  for (const [slug, catText] of Object.entries(CATEGORY_SLUGS)) {
    const list = rows.filter(s => !used.has(s.id) && matchesCategory(s.category, catText));
    list.forEach(s => used.add(s.id));
    if (list.length) groups.push([catText, `/category/${slug}`, list]);
  }
  const rest = rows.filter(s => !used.has(s.id));
  if (rest.length) groups.push(["متاجر أخرى", "", rest]);

  const catNav = Object.entries(CATEGORY_SLUGS)
    .map(([slug, text]) => `<li><a href="/category/${esc(slug)}">${esc(text)}</a></li>`).join("");

  const body = `<article class="ssr-stores container">
    <h1>اطلب من المتاجر</h1>
    <p>كل متاجر ومطاعم دكانجي القريبة منك في إسطنبول في مكان واحد — ${esc(rows.length)} متجراً ومطعماً. اختر التصنيف الذي يناسبك، أو تصفّح القائمة الكاملة أدناه واطلب مباشرة.</p>
    <p><a href="/offers">عروض دكانجي وخصوماتها</a> · <a href="/regions">المتاجر حسب المنطقة</a> · <a href="/dalil">دليل المطاعم والمتاجر بتقييمات Google</a></p>

    <h2>تصفّح حسب التصنيف</h2>
    <ul>${catNav}</ul>

    <h2>كل المتاجر والمطاعم</h2>
    ${groups.map(([catText, catHref, list]) => `
    <section>
      <h3>${catHref ? `<a href="${esc(catHref)}">${esc(catText)}</a>` : esc(catText)} <small>(${esc(list.length)})</small></h3>
      <ul>${list.map(storeLi).join("")}</ul>
    </section>`).join("")}

    <h2>كيف أطلب؟</h2>
    <ol>
      <li>حدّد منطقتك أو ابحث عن المتجر مباشرة.</li>
      <li>افتح صفحة المتجر واختر المنتجات.</li>
      <li>راجع السعر ورسوم التوصيل قبل التأكيد.</li>
      <li>أكّد الطلب — ويتواصل معك المتجر عبر واتساب.</li>
    </ol>
    <p><a href="/why-dukkanci">لماذا دكانجي؟</a> · <a href="/merchants">انضم إلى دكانجي كتاجر</a> · <a href="/contact">تواصل معنا</a></p>
  </article>`;

  const canonical = `${SITE}/stores`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "متاجر ومطاعم دكانجي",
    numberOfItems: rows.length,
    itemListElement: rows.slice(0, 100).map((s, i) => ({
      "@type": "ListItem", position: i + 1, name: s.name,
      url: `${SITE}/store/${resolveStoreSlug(s, STORE_SLUGS)}`
    }))
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE, url: canonical, description: DESC, inLanguage: "ar"
  };

  send(res, applyMeta(html, {
    title: TITLE, description: DESC, canonical, body,
    jsonLd: [pageLd, itemListLd, breadcrumbLd([["دكانجي", "/"], ["اطلب من المتاجر", "/stores"]])]
  }));
};
