// قشرة SSR لصفحة «المتاجر حسب المنطقة» (/regions) — صفحة جديدة.
//
// صفحات المناطق (/dalil?region=<slug>) كانت موجودة ومُدرَجة في sitemap منذ
// 2026-07-12، لكن لا شيء في الموقع كان يربطها: مرشِّح المنطقة في «دليل دكانجي»
// قائمة منسدلة لا روابط، فكانت الثلاث عشرة صفحة يتيمة (sitemap فقط). هذه
// الصفحة هي المحور الذي يربطها جميعاً، وهي أيضاً المرشَّح الذي يستطيع غوغل أن
// يعرضه كرابط فرعي باسم «المتاجر حسب المنطقة».
const { DALIL_REGIONS, DALIL_REGION_FALLBACK, dalilRegionFor } = require("../dalil-regions.js");
const { SITE, esc, fetchShell, applyMeta, send, shellFallback, sbGet, breadcrumbLd } = require("../lib/ssr-shell.js");

const TITLE = "المتاجر حسب المنطقة — مطاعم ومتاجر حيّك في إسطنبول | دكانجي";
const DESC = "اختر منطقتك في إسطنبول — إسنيورت، باشاك شهير، بيليك دوزو، الفاتح، أفجلار وغيرها — وتصفّح المتاجر والمطاعم العربية القريبة منك على دكانجي.";

module.exports = async (req, res) => {
  let html = "";
  try {
    html = await fetchShell(req);
  } catch (e) {
    return shellFallback(res);
  }

  const rows = (await sbGet(
    "stores?select=id,name,address&open=eq.true&or=(approval_status.is.null,approval_status.eq.approved)&order=id&limit=500"
  )) || [];

  // نفس اشتقاق المنطقة الذي يستخدمه /dalil حرفياً — فالعدّاد هنا يطابق ما يراه
  // الزائر فعلاً عند فتح صفحة المنطقة.
  const counts = new Map();
  for (const s of rows) {
    const slug = dalilRegionFor(s.name, s.address).slug;
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }

  // المناطق التي لا متجر فيها اليوم تُحذف: رابط لصفحة فارغة إشارة جودة سيئة.
  const listed = DALIL_REGIONS
    .map(r => ({ ...r, count: counts.get(r.slug) || 0 }))
    .filter(r => r.count > 0)
    .sort((a, b) => b.count - a.count);

  const otherCount = counts.get(DALIL_REGION_FALLBACK.slug) || 0;

  const regionLi = r =>
    `<li><a href="/dalil?region=${esc(r.slug)}">متاجر ومطاعم ${esc(r.label)}</a> — ${esc(r.count)} متجراً</li>`;

  const body = `<article class="ssr-regions container">
    <h1>المتاجر حسب المنطقة</h1>
    <p>دكانجي يجمع المتاجر والمطاعم العربية في أحياء إسطنبول. اختر منطقتك لتصفّح المتاجر القريبة منك وتقييماتها، ثم اطلب مباشرة.</p>
    <p><a href="/stores">اطلب من المتاجر</a> · <a href="/offers">عروض دكانجي</a> · <a href="/dalil">دليل المطاعم والمتاجر</a></p>

    <h2>اختر منطقتك</h2>
    <ul>${listed.map(regionLi).join("")}</ul>
    ${otherCount ? `<p>بالإضافة إلى ${esc(otherCount)} متجراً في <a href="/stores">مناطق أخرى من إسطنبول</a>.</p>` : ""}

    <h2>لماذا الطلب من متجر منطقتك؟</h2>
    <ul>
      <li>توصيل أسرع — المسافة أقصر ورسوم التوصيل أقل.</li>
      <li>رسوم التوصيل تُحسب بالكيلومتر وتظهر قبل تأكيد الطلب.</li>
      <li>متاجر حيّك تعرف منتجاتك المعتادة وتتواصل معك عبر واتساب.</li>
    </ul>
    <p><a href="/why-dukkanci">لماذا دكانجي؟</a> · <a href="/merchants">انضم إلى دكانجي كتاجر</a> · <a href="/contact">تواصل معنا</a></p>
  </article>`;

  const canonical = `${SITE}/regions`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "مناطق دكانجي في إسطنبول",
    numberOfItems: listed.length,
    itemListElement: listed.map((r, i) => ({
      "@type": "ListItem", position: i + 1, name: r.label,
      url: `${SITE}/dalil?region=${r.slug}`
    }))
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE, url: canonical, description: DESC, inLanguage: "ar"
  };

  send(res, applyMeta(html, {
    title: TITLE, description: DESC, canonical, body,
    jsonLd: [pageLd, itemListLd, breadcrumbLd([["دكانجي", "/"], ["المتاجر حسب المنطقة", "/regions"]])]
  }));
};
