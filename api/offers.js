// قشرة SSR لصفحة «عروض دكانجي» (/offers).
//
// نفس علّة /stores بالضبط: كان الرابط يسقط في catch-all فيستلم الزاحف عنوان
// الصفحة الرئيسية حرفياً، والتنقل كان يربطه بـ"#offers" أي جزء من الصفحة
// الرئيسية لا رابط مستقل. الجسم أدناه يعكس ما تعرضه renderOffers() في app.js.
//
// ⚠️ PostgREST لا يقارن عمودين ببعضهما، فلا يمكن ترشيح `old_price > price` في
// الاستعلام؛ نجلب كل صف له `old_price` ثم نرشّح من طرف الخادم — نفس ما يفعله
// الموقع وتطبيق Flutter (انظر سطر «عروض التطبيق» في سجل الإصلاحات).
const { STORE_SLUGS } = require("../store-slugs.js");
const { resolveStoreSlug } = require("../lib/store-slug.js");
const { SITE, esc, fetchShell, applyMeta, send, shellFallback, sbGet, breadcrumbLd } = require("../lib/ssr-shell.js");

const TITLE = "عروض دكانجي — خصومات متاجر ومطاعم حيّك في إسطنبول";
const DESC = "أحدث العروض والخصومات الحقيقية من متاجر ومطاعم دكانجي في إسطنبول — أسعار قبل وبعد الخصم، محدّثة من المتاجر مباشرة.";

const pct = (oldP, newP) => Math.round(((oldP - newP) / oldP) * 100);

module.exports = async (req, res) => {
  let html = "";
  try {
    html = await fetchShell(req);
  } catch (e) {
    return shellFallback(res);
  }

  const stores = (await sbGet(
    "stores?select=id,name,slug&open=eq.true&or=(approval_status.is.null,approval_status.eq.approved)&order=id&limit=500"
  )) || [];
  const storeById = new Map(stores.map(s => [s.id, s]));

  const raw = (await sbGet(
    "products?select=id,name,slug,price,old_price,store_id&old_price=not.is.null&available=eq.true&order=id&limit=1000"
  )) || [];

  // خصم حقيقي فقط، ومن متجر مرئي فعلاً (نفس بوابة الاعتماد التي تطبّقها الواجهة).
  const deals = raw
    .filter(p => Number(p.old_price) > Number(p.price) && storeById.has(p.store_id))
    .sort((a, b) => pct(b.old_price, b.price) - pct(a.old_price, a.price));

  // مجموعات حسب المتجر — يبني رسم زحف نحو صفحات المتاجر والمنتجات معاً.
  const byStore = new Map();
  for (const p of deals) {
    if (!byStore.has(p.store_id)) byStore.set(p.store_id, []);
    byStore.get(p.store_id).push(p);
  }

  const dealLi = p => {
    const label = `${esc(p.name)} — ${esc(p.price)} ل.ت بدل ${esc(p.old_price)} ل.ت (خصم ${esc(pct(p.old_price, p.price))}%)`;
    return `<li>${p.slug ? `<a href="/product/${esc(p.slug)}">${label}</a>` : label}</li>`;
  };

  const sections = [...byStore.entries()].map(([storeId, list]) => {
    const s = storeById.get(storeId);
    return `<section>
      <h3><a href="/store/${esc(resolveStoreSlug(s, STORE_SLUGS))}">${esc(s.name)}</a> <small>(${esc(list.length)} عرض)</small></h3>
      <ul>${list.map(dealLi).join("")}</ul>
    </section>`;
  }).join("");

  const body = `<article class="ssr-offers container">
    <h1>عروض دكانجي</h1>
    <p>${deals.length
      ? `${esc(deals.length)} عرضاً وخصماً فعلياً من ${esc(byStore.size)} متجراً ومطعماً على دكانجي — كل سعر هنا سعر المتجر نفسه، ودكانجي لا يضيف عمولة على أسعار المنتجات.`
      : "لا توجد عروض فعّالة في هذه اللحظة. تصفّح المتاجر وتابعنا — تُحدَّث العروض من المتاجر مباشرة."}</p>
    <p><a href="/stores">اطلب من المتاجر</a> · <a href="/regions">المتاجر حسب المنطقة</a> · <a href="/dalil">دليل المطاعم والمتاجر</a></p>

    ${deals.length ? `<h2>العروض حسب المتجر</h2>${sections}` : ""}

    <h2>كيف تعمل العروض على دكانجي؟</h2>
    <ul>
      <li>الخصم يضعه المتجر نفسه على منتجه، ويظهر السعر قبل وبعد الخصم.</li>
      <li>دكانجي لا يضيف عمولة على أسعار المنتجات.</li>
      <li>رسوم التوصيل تظهر بوضوح قبل تأكيد الطلب.</li>
      <li>تنتهي العروض حين يزيلها المتجر، والقائمة أعلاه محدّثة لحظياً.</li>
    </ul>
    <p><a href="/why-dukkanci">لماذا دكانجي؟</a> · <a href="/contact">تواصل معنا</a></p>
  </article>`;

  const canonical = `${SITE}/offers`;
  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "عروض وخصومات دكانجي",
    numberOfItems: deals.length,
    itemListElement: deals.slice(0, 100).map((p, i) => ({
      "@type": "ListItem", position: i + 1, name: p.name,
      ...(p.slug ? { url: `${SITE}/product/${p.slug}` } : {})
    }))
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: TITLE, url: canonical, description: DESC, inLanguage: "ar"
  };

  send(res, applyMeta(html, {
    title: TITLE, description: DESC, canonical, body,
    jsonLd: [pageLd, itemListLd, breadcrumbLd([["دكانجي", "/"], ["عروض دكانجي", "/offers"]])]
  }));
};
