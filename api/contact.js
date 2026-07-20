// قشرة SSR لصفحة «تواصل معنا» (/contact).
//
// الصفحة موجودة كمسار SPA منذ زمن ومربوطة من الفوتر برابط حقيقي، لكنها كانت
// تسقط في catch-all فتستلم عنوان الصفحة الرئيسية — فلا يميّزها غوغل عن "/".
// الجسم أدناه يعكس renderContactPage() في app.js + بطاقتَي التواصل في الفوتر.
const { SITE, esc, fetchShell, applyMeta, send, shellFallback, sbGet, breadcrumbLd } = require("../lib/ssr-shell.js");

const TITLE = "تواصل معنا | دكانجي";
const DESC = "تواصل مع فريق دكانجي عبر واتساب أو البريد الإلكتروني — دعم العملاء، استفسارات المتاجر، والشراكات التجارية في إسطنبول.";

// أرقام التواصل الحقيقية المعروضة في فوتر الموقع على كل صفحة. تُستخدم كقيمة
// احتياطية إن لم يضبط الإدارة `contactWa` في site_settings (أو تعذّر جلبه).
const FALLBACK_CUSTOMER_WA = "905551000630";
const FALLBACK_MERCHANT_WA = "905528000220";
const EMAIL = "info@dukkanci.com.tr";

const digits = s => String(s || "").replace(/\D/g, "");
const pretty = wa => {
  const d = digits(wa);
  return d ? `+${d}` : "";
};

module.exports = async (req, res) => {
  let html = "";
  try {
    html = await fetchShell(req);
  } catch (e) {
    return shellFallback(res);
  }

  // نفس مصدر الواجهة: site_settings جدول key/value، وrenderContactPage تقرأ
  // contactWa ثم تسقط إلى contactPhone.
  const rows = (await sbGet("site_settings?select=key,value&key=in.(contactWa,contactPhone)")) || [];
  const settings = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  const customerWa = digits(settings.contactWa || settings.contactPhone) || FALLBACK_CUSTOMER_WA;

  const body = `<article class="ssr-contact container">
    <h1>تواصل معنا</h1>
    <p>للاستفسارات العامة أو الشراكات التجارية، تواصل مع فريق دكانجي عبر واتساب أو البريد الإلكتروني — نردّ خلال ساعات العمل.</p>

    <h2>خدمة العملاء</h2>
    <p>لأي سؤال عن طلبك أو عن متجر على المنصة:
      <a href="https://wa.me/${esc(customerWa)}" rel="noopener">واتساب <span dir="ltr">${esc(pretty(customerWa))}</span></a>
    </p>

    <h2>خدمة أصحاب المتاجر</h2>
    <p>إن كنت صاحب متجر أو مطعم وتريد الانضمام أو لديك سؤال عن لوحة المتجر:
      <a href="https://wa.me/${esc(FALLBACK_MERCHANT_WA)}" rel="noopener">واتساب <span dir="ltr">${esc(pretty(FALLBACK_MERCHANT_WA))}</span></a>
      · <a href="/merchants">انضم إلى دكانجي كتاجر</a>
    </p>

    <h2>البريد الإلكتروني</h2>
    <p><a href="mailto:${esc(EMAIL)}">${esc(EMAIL)}</a></p>

    <h2>روابط قد تفيدك</h2>
    <ul>
      <li><a href="/faq">الأسئلة الشائعة</a></li>
      <li><a href="/stores">اطلب من المتاجر</a></li>
      <li><a href="/regions">المتاجر حسب المنطقة</a></li>
      <li><a href="/about">من نحن</a></li>
      <li><a href="/terms">الشروط والأحكام</a></li>
    </ul>
  </article>`;

  const canonical = `${SITE}/contact`;
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: TITLE, url: canonical, description: DESC, inLanguage: "ar",
    mainEntity: {
      "@type": "Organization",
      name: "دكانجي",
      url: SITE,
      email: EMAIL,
      contactPoint: [
        { "@type": "ContactPoint", telephone: pretty(customerWa), contactType: "customer support", areaServed: "TR", availableLanguage: ["ar", "tr"] },
        { "@type": "ContactPoint", telephone: pretty(FALLBACK_MERCHANT_WA), contactType: "sales", areaServed: "TR", availableLanguage: ["ar", "tr"] }
      ]
    }
  };

  send(res, applyMeta(html, {
    title: TITLE, description: DESC, canonical, body,
    jsonLd: [pageLd, breadcrumbLd([["دكانجي", "/"], ["تواصل معنا", "/contact"]])]
  }));
};
