// «اسأل دكانجي» — intent parsing only. The AI NEVER sees or returns actual products, prices,
// or store names — it only classifies the customer's free-text description into abstract
// signals (keywords / finished-good-vs-supply / which real store category fits). The
// deterministic client-side engine (app.js, askDukkanciBuildOptions) is the ONLY thing that
// ever touches the real catalog, so a hallucinated reply here can misclassify at worst — it can
// never invent a product, price, or store that doesn't exist.
const gw = require("../lib/ai-gateway");

// Must match the real category set used platform-wide (app.js HOME_CATEGORIES) — the model is
// told to choose ONLY from this list so it can never invent a category that doesn't exist.
const KNOWN_CATEGORIES = ["سوبر ماركت", "مطاعم", "ملاحم", "حلويات", "مكسرات وبهارات", "بن ومكسرات", "عصائر", "مواد غذائية متخصصة", "مطابخ منزلية"];

const SYSTEM_PROMPT = [
  "أنت مصنّف نية طلب عميل مكتوب بالعربية (بلهجات مختلفة) على منصة دكانجي — سوق طلبات محلي في",
  "إسطنبول يضم مطاعم وسوبرماركت ومحلات حلويات وعصائر وملاحم ومحلات متخصصة.",
  "مهمتك تصنيف النية فقط — لا تقترح أي منتج أو سعر أو اسم متجر حقيقي أو وهمي مطلقاً، فأنت لا ترى الكتالوج.",
  "",
  "أعد JSON فقط بلا أي شرح ولا تنسيق markdown، بالشكل التالي بالضبط:",
  '{"keywords":["..."],"wantsSupplies":false,"preferredCategories":["..."]}',
  "",
  "keywords: الكلمات الأساسية التي تصف نوع المنتج المطلوب فعلياً (وليس المناسبة أو العدد أو",
  "الميزانية) — بالعربية الفصحى المعيارية قدر الإمكان حتى لو كتب العميل بلهجة، لتسهيل المطابقة",
  "النصية لاحقاً. من كلمة واحدة إلى 4 كلمات كحد أقصى.",
  "",
  "wantsSupplies: true فقط إذا كان العميل يطلب صراحة مكونات أو مستلزمات أو أدوات ليحضّر شيئاً",
  "بنفسه (مثال: \"مستلزمات حلويات\", \"أدوات شواء\") — وليس المنتج النهائي الجاهز للاستهلاك",
  "مباشرة. في الحالة الافتراضية (لم يُذكر ذلك صراحة) اجعلها false.",
  "",
  `preferredCategories: اختر فقط من هذه القائمة الثابتة (لا تخترع فئة غير موجودة): ${JSON.stringify(KNOWN_CATEGORIES)}.`,
  "اختر الفئة أو الفئات التي تبيع المنتج جاهزاً للاستهلاك مباشرة كما طلبه العميل تحديداً — لا",
  "الفئة التي يكون فيها هذا المنتج مجرد صنف جانبي ثانوي. أمثلة:",
  "- \"مشاوي\" تعني طبقاً مشوياً جاهزاً يُقدَّم في مطعم، وليس لحماً نيئاً من ملحمة يحتاج طبخاً في",
  "  البيت — الفئة الصحيحة \"مطاعم\" فقط، وليس \"ملاحم\".",
  "- \"حلويات لعزومة\" تعني حلوى جاهزة من محل حلويات مختص، لا مطعم تكون الحلوى فيه صنفاً جانبياً",
  "  ثانوياً منخفض الجودة — الفئة الصحيحة \"حلويات\" فقط، وليس \"مطاعم\".",
  "- \"عصائر لحفلة\" تعني محل عصائر مختص، لا مطعم يبيع مشروبات معلّبة جانبية.",
  "إن كان الطلب عاماً ولا يحدد فئة واضحة (كوجبة غداء عادية)، أعد preferredCategories كقائمة فارغة [].",
  "",
  "تنبيه مهم — الطلب المركّب (وجبة رئيسية + إضافة): إذا ذكر العميل وجبة رئيسية (غداء/عشاء/فطور/",
  "أكل) ثم أضاف صنفاً ثانوياً بصيغة \"مع\"/\"و\" (مثل حلويات أو مشروبات)، فالوجبة الرئيسية هي",
  "النية الأساسية والصنف الثانوي مجرد إضافة عليها — ضع الفئة التي تخدم الوجبة الرئيسية فقط في",
  "preferredCategories (عادة \"مطاعم\") ولا تضع فئة الإضافة إطلاقاً، حتى لو ذُكرت الإضافة",
  "بوضوح. اذكر كلمة الإضافة (مثل \"حلويات\") ضمن keywords فقط كي تبقى قابلة للمطابقة كصنف",
  "جانبي داخل نفس المتجر. مثال: \"غداء اقتصادي مع حلويات لـ10 أشخاص\" ← keywords تتضمن",
  "\"غداء\" و\"حلويات\"، لكن preferredCategories = [\"مطاعم\"] فقط — وليس [\"حلويات\"]، لأن هذا",
  "طلب غداء أولاً وليس طلب حلويات."
].join("\n");

function extractJson(raw) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
}

// Never trust the model's shape blindly — coerce to exactly what the client engine expects,
// dropping anything malformed instead of forwarding it.
function sanitizeIntent(parsed) {
  if (!parsed || typeof parsed !== "object") return null;
  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.map(k => String(k || "").trim()).filter(Boolean).slice(0, 6)
    : [];
  const preferredCategories = Array.isArray(parsed.preferredCategories)
    ? parsed.preferredCategories.filter(c => KNOWN_CATEGORIES.includes(c))
    : [];
  return { keywords, wantsSupplies: parsed.wantsSupplies === true, preferredCategories };
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const message = String((request.body && request.body.message) || "").trim().slice(0, 700);
  if (!message) return response.status(200).json({ ok: false, intent: null });

  const raw = await gw.complete("ask_dukkanci_parse", {
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: message }],
    maxTokens: 300,
    temperature: 0.2,
    timeoutMs: 10000
  });

  const intent = sanitizeIntent(extractJson(raw));
  if (!intent) return response.status(200).json({ ok: false, intent: null });
  return response.status(200).json({ ok: true, intent });
};
