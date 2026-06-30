// Server-rendered SEO shell for /why-dukkanci (customer-conversion landing page).
// The page itself is a client-rendered SPA route (renderWhyDukkanciPage in app.js);
// crawlers/first-pass indexers get the page-specific <title>/description/OG/canonical
// + a text-equivalent crawlable <body> + FAQPage JSON-LD here, then app.js hydrates
// over <main> for real users. The body text MUST mirror renderWhyDukkanciPage() in
// app.js (content parity — avoids cloaking). Wired via vercel.json:
//   { "source": "/why-dukkanci", "destination": "/api/why-dukkanci" }  (before catch-all)
const { CATEGORY_SLUGS } = require("../category-slugs.js");

const SHELL_ENV = (process.env.SSR_SHELL_ORIGIN || "").replace(/\/+$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.dukkanci.com.tr").replace(/\/+$/, "");

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const TITLE = "لماذا دكانجي؟ اطلب من المتاجر العربية القريبة منك بدون عمولة على المنتجات";
const DESC = "تعرف على دكانجي، المنصة التي تجمع المتاجر العربية القريبة منك في مكان واحد، مع أسعار واضحة، بدون عمولة إضافية على المنتجات، وتقييمات تساعدك على الطلب بثقة.";

// Mirrors the FAQ in renderWhyDukkanciPage() — also emitted as FAQPage JSON-LD.
const FAQS = [
  ["هل دكانجي يزيد سعر المنتجات؟", "لا. دكانجي لا يضيف عمولة على أسعار المنتجات؛ السعر الذي تراه هو سعر المتجر. أما رسوم التوصيل فتظهر بوضوح قبل تأكيد الطلب."],
  ["هل المتاجر على دكانجي موثوقة؟", "المتاجر يتم تقييمها حسب تجربة العملاء، وتجارب الطلبات السابقة تساعدك على الاختيار. كما يساعد دكانجي في متابعة المشاكل الواضحة مع المتجر حسب الحالة."],
  ["ماذا يحدث إذا لم يتوفر منتج؟", "إذا تبيّن أن منتجاً غير متوفر، يتواصل معك المتجر عبر واتساب لإيجاد بديل مناسب أو تعديل الطلب قبل تجهيزه."],
  ["هل أستطيع الطلب من أكثر من فئة؟", "نعم، يجمع دكانجي مطاعم وسوبرماركت وملاحم وحلويات وقهوة ومكسرات ومتاجر يومية، فتتصفح الفئات التي تناسبك في مكان واحد."],
  ["لماذا أستخدم دكانجي بدل واتساب؟", "لأن دكانجي يعرض المنتجات والأسعار بوضوح، يجمع أكثر من متجر في مكان واحد، يضيف تقييمات تساعدك على الاختيار، وينظّم تجربة الطلب من السلة حتى الاستلام."]
];

function bodyHtml() {
  const li = arr => `<ul>${arr.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
  const catLinks = Object.entries(CATEGORY_SLUGS)
    .map(([slug, text]) => `<li><a href="/category/${esc(slug)}">${esc(text)}</a></li>`).join("");
  return `<article class="ssr-why container">
    <h1>اطلب من المتاجر العربية القريبة منك بثقة</h1>
    <p>دكانجي يجمع لك المطاعم، السوبرماركت، الملاحم، الحلويات، والمتاجر العربية في مكان واحد، لتطلب بسهولة، بسعر واضح، وبدون عمولة إضافية من دكانجي على أسعار المنتجات.</p>
    <p><a href="/stores">ابدأ الطلب الآن</a> · <a href="/stores">شاهد المتاجر القريبة منك</a></p>

    <h2>تعبت من البحث بين المحلات والطلبات على واتساب؟</h2>
    <p>دكانجي يختصر عليك فوضى السؤال عن الأسعار والتوفر والصور وانتظار الردود، ويجمع المتاجر القريبة منك بمكان واحد منظّم.</p>

    <h2>الأسعار واضحة… بدون عمولة إضافية من دكانجي على المنتجات</h2>
    ${li([
      "دكانجي لا يضيف عمولة على أسعار المنتجات؛ السعر الذي تراه هو سعر المتجر.",
      "رسوم التوصيل تظهر بوضوح قبل أن تؤكد طلبك.",
      "لا توجد رسوم مفاجئة بعد إرسال الطلب."
    ])}

    <h2>المتاجر لا تظهر عشوائياً… التجربة يتم تقييمها</h2>
    ${li([
      "تقييم حسب تجربة العملاء.",
      "جودة الخدمة.",
      "دقة الطلب.",
      "سرعة التجهيز.",
      "جودة التغليف.",
      "المتاجر الأفضل تجربةً تحصل على ثقة العملاء وظهور أوضح."
    ])}

    <h2>كيف يعمل دكانجي؟</h2>
    <ol>
      <li>حدّد منطقتك.</li>
      <li>اختر المتجر المناسب.</li>
      <li>أضف المنتجات إلى السلة.</li>
      <li>راجع السعر والتوصيل قبل التأكيد.</li>
      <li>استلم الطلب وقيّم التجربة.</li>
    </ol>

    <h2>أول طلب؟ جرّب بدون قلق</h2>
    <p>قبل أن تؤكد، ترى المتجر، والسعر، وتفاصيل الطلب، ورسوم التوصيل بشكل واضح. وإذا حدثت مشكلة واضحة مع المتجر، يساعد دكانجي في متابعتها حسب الحالة — لتطلب أول مرة وأنت مطمئن.</p>

    <h2>لماذا أطلب عبر دكانجي بدل التواصل المباشر مع المتجر؟</h2>
    ${li([
      "منتجات وأسعار أوضح.",
      "أكثر من متجر وفئة في مكان واحد.",
      "تقييمات تساعدك على الاختيار بثقة.",
      "تجربة منظّمة بخطوات واضحة.",
      "متابعة أفضل عند وجود مشكلة واضحة حسب الحالة."
    ])}

    <h2>كل ما يحتاجه حيّك في مكان واحد</h2>
    <ul>${catLinks}<li><a href="/stores">كل المتاجر القريبة منك</a></li></ul>

    <h2>قبل أن تؤكد طلبك… كل شيء واضح</h2>
    ${li([
      "السعر ظاهر أمامك قبل الطلب.",
      "المتجر الذي تطلب منه واضح ومعروف.",
      "المنتجات وتفاصيلها واضحة.",
      "رسوم التوصيل تظهر قبل التأكيد.",
      "يمكنك مراجعة السلة قبل الإرسال.",
      "يمكنك تقييم التجربة بعد الاستلام."
    ])}

    <h2>أسئلة قبل أول طلب</h2>
    ${FAQS.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}

    <h2>جرّب دكانجي اليوم… وخلّي طلباتك اليومية أسهل</h2>
    <p><a href="/stores">ابدأ الطلب الآن</a> · <a href="/stores">استعرض المتاجر</a></p>
  </article>`;
}

module.exports = async (req, res) => {
  let html = "";
  try {
    const shellOrigin = SHELL_ENV || `https://${req.headers.host || ""}`;
    const shell = await fetch(`${shellOrigin}/index.html`, { headers: { "User-Agent": "dukkanci-ssr" } });
    html = await shell.text();
  } catch (e) {
    res.setHeader("Location", "/index.html");
    return res.status(302).end();
  }

  const canonical = `${SITE}/why-dukkanci`;
  const T = esc(TITLE), D = esc(DESC), C = esc(canonical);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(([q, a]) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: TITLE, url: canonical, description: DESC, inLanguage: "ar"
  };

  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${T}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(">)/, `$1${T}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(">)/, `$1${D}$2`)
    .replace(/(<meta\s+name="twitter:card"\s+content="[^"]*">)/, `$1\n    <meta property="og:url" content="${C}">\n    <link rel="canonical" href="${C}">`)
    .replace(/<\/head>/, `  <meta name="robots" content="index,follow">\n  <script type="application/ld+json">${JSON.stringify(faqLd)}</script>\n  <script type="application/ld+json">${JSON.stringify(pageLd)}</script>\n</head>`)
    .replace('<main id="app" tabindex="-1"></main>', `<main id="app" tabindex="-1">${bodyHtml()}</main>`);

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=86400, must-revalidate");
  res.status(200).send(html);
};
