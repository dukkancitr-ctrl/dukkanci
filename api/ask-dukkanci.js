// «اسأل دكانجي» — multi-turn intent understanding. The AI NEVER sees or returns actual
// products, prices, or store menus/descriptions — it only (1) asks clarifying questions,
// grounded ONLY in a compact list of real category names + store names we hand it (so it never
// asks about a cuisine/category that doesn't exist on the platform), and (2) once it has enough
// signal, returns an abstract classification (keywords / secondary keywords / finished-good-vs-
// supply / which real store category fits). The deterministic client-side engine (app.js,
// askDukkanciBuildOptions) is the ONLY thing that ever touches the real catalog/prices, so a
// hallucinated reply here can misclassify or ask a slightly-off question at worst — it can never
// invent a product, price, or store that doesn't exist, and can never quote a price or menu item.
const gw = require("../lib/ai-gateway");

// Must match the real category set used platform-wide (app.js HOME_CATEGORIES) — the model is
// told to choose ONLY from this list so it can never invent a category that doesn't exist.
const KNOWN_CATEGORIES = ["سوبر ماركت", "مطاعم", "ملاحم", "حلويات", "مكسرات وبهارات", "بن ومكسرات", "عصائر", "مواد غذائية متخصصة", "مطابخ منزلية"];

// A conversation is capped at this many clarifying questions before the model is forced to
// finalize with whatever it has — prevents an endless back-and-forth from ever reaching the
// customer, no matter what the model itself decides. Raised from 2→3: the customer explicitly
// asked for a more thorough, human back-and-forth before getting suggestions, not a rushed guess.
const MAX_QUESTIONS = 3;

function buildSystemPrompt(catalog, questionsAsked, forceFinal) {
  const categories = Array.isArray(catalog?.categories) && catalog.categories.length ? catalog.categories : KNOWN_CATEGORIES;
  const storeNames = Array.isArray(catalog?.storeNames) ? catalog.storeNames.slice(0, 80) : [];
  return [
    "أنت مساعد محادثة على منصة دكانجي — سوق طلبات محلي في إسطنبول يضم مطاعم وسوبرماركت ومحلات",
    "حلويات وعصائر وملاحم ومحلات متخصصة. مهمتك فهم ما يريده العميل فعلاً من وصفه الحر، وطرح",
    "سؤال توضيحي واحد عند الحاجة فقط، ثم تصنيف النية بدقة — لا تقترح أبداً منتجاً أو سعراً أو قائمة",
    "طعام حقيقية أو وهمية، فأنت لا ترى الكتالوج الفعلي ولا الأسعار إطلاقاً.",
    "",
    "الفئات الحقيقية المتاحة على المنصة حالياً: " + JSON.stringify(categories) + ".",
    storeNames.length ? "أمثلة على أسماء متاجر حقيقية موجودة فعلاً (للاستئناس فقط، لا تدّعِ معرفة تفاصيلها): " + JSON.stringify(storeNames) : "",
    "لا تسأل أبداً عن فئة أو نوع مطبخ غير موجود ضمن هذه القائمة، ولا تدّعِ معرفة أسعار أو أصناف",
    "محددة من أي متجر — أنت لا تراها.",
    "",
    "أعد JSON فقط بلا أي شرح ولا تنسيق markdown، بأحد شكلين بالضبط:",
    '1) سؤال توضيحي: {"type":"question","question":"..."}',
    '2) جاهز للتصنيف: {"type":"ready","keywords":["..."],"secondaryKeywords":["..."],"wantsSupplies":false,"preferredCategories":["..."],"appetiteLevel":"moderate","summary":"..."}',
    "",
    `العميل يفضّل حواراً أكثر دقة على تخمين سريع — اطرح سؤالاً توضيحياً (type=question) في أي`,
    "من هذه الحالات، لا فقط عند الغموض الشديد: (أ) طلب عام جداً بلا أي تلميح عن نوع الطعام أو",
    "المناسبة (\"بدي شي طيب\")، (ب) طلب لعدد أشخاص كبير نسبياً (6 فأكثر) دون توضيح هل المطلوب",
    "تنويع بين عدة أصناف أم كمية كافية من صنف واحد رئيسي، (ج) طلب يذكر مكوّناً أساسياً غامض",
    "الحالة (كـ\"دجاج\"/\"لحم\") دون وضوح إن كان المقصود طبقاً جاهزاً أم مكوّناً نيئاً. سؤال واحد",
    "قصير ومباشر في كل مرة، لا سلسلة أسئلة دفعة واحدة — لكن لا تتردد في استخدام الأسئلة",
    "المتاحة (حتى السقف المذكور أدناه) لفهم الطلب بدقة قبل تقديم أي اقتراح، فالعميل صرّح أن",
    "الدقة أهم من السرعة هنا.",
    "",
    "اختر أنسب بُعد واحد فقط لكل سؤال — لا تسأل عن أكثر من بُعد في نفس السؤال:",
    "- هل يريد العميل طعاماً جاهزاً للأكل مباشرة أم مكونات/مستلزمات ليحضّره بنفسه؟ (يفيد",
    "  wantsSupplies) — مفيد خصوصاً عند طلب مكوّن أساسي كـ\"دجاج\"/\"لحم\" دون وضوح إن كان",
    "  المقصود طبقاً جاهزاً من مطعم أو لحماً نيئاً للطبخ في البيت.",
    "- هل هو شخص \"أكول\" يحب الكميات الكبيرة أم \"معتدل\" في الأكل؟ (يفيد appetiteLevel) —",
    "  سؤال بسيط وودود، ليس استجواباً.",
    "- (لمجموعات 6 أشخاص فأكثر) هل يفضّل العميل صنفاً رئيسياً واحداً بكمية تكفي الجميع، أم",
    "  تنويعاً بين عدة أصناف مختلفة؟ اذكر التفضيل الناتج بوضوح ضمن keywords/summary كي يعكسه",
    "  التصنيف النهائي.",
    `${forceFinal || questionsAsked >= MAX_QUESTIONS
      ? `تنبيه إلزامي: طُرح بالفعل ${questionsAsked} سؤال/أسئلة توضيحية على هذا العميل — يُمنع طرح أي سؤال آخر مهما كان الوضع، ويجب إرجاع type=ready الآن مباشرة مستنتجاً الأفضل الممكن من كل ما قيل حتى الآن، حتى لو كانت المعلومات غير كاملة.`
      : `عدد الأسئلة المطروحة سابقاً في هذه المحادثة: ${questionsAsked} (الحد الأقصى ${MAX_QUESTIONS}).`}`,
    "",
    "عند type=ready:",
    "keywords: الكلمات الأساسية التي تصف نوع المنتج المطلوب فعلياً (وليس المناسبة أو العدد أو",
    "الميزانية) — بالعربية الفصحى المعيارية قدر الإمكان حتى لو كتب العميل بلهجة. من كلمة واحدة",
    "إلى 6 كلمات كحد أقصى.",
    "",
    "secondaryKeywords: أصناف إضافية ذات صلة قد تُثري السلة (وليست أساسية للطلب) — مثال: طلب",
    "\"مشاوي\" قد يقترح ضمنياً \"سلطات\"/\"مقبلات\" كإضافات محتملة. حتى 4 كلمات، أو قائمة فارغة [].",
    "",
    "wantsSupplies: true فقط إذا كان العميل يطلب صراحة مكونات أو مستلزمات أو أدوات ليحضّر شيئاً",
    "بنفسه (مثال: \"مستلزمات حلويات\", \"أدوات شواء\") — وليس المنتج النهائي الجاهز للاستهلاك",
    "مباشرة. في الحالة الافتراضية (لم يُذكر ذلك صراحة) اجعلها false.",
    "",
    `preferredCategories: اختر فقط من القائمة الثابتة أعلاه (لا تخترع فئة غير موجودة).`,
    "اختر الفئة أو الفئات التي تبيع المنتج جاهزاً للاستهلاك مباشرة كما طلبه العميل تحديداً — لا",
    "الفئة التي يكون فيها هذا المنتج مجرد صنف جانبي ثانوي. أمثلة:",
    "- \"مشاوي\" تعني طبقاً مشوياً جاهزاً يُقدَّم في مطعم، وليس لحماً نيئاً من ملحمة يحتاج طبخاً في",
    "  البيت — الفئة الصحيحة \"مطاعم\" فقط، وليس \"ملاحم\".",
    "- \"حلويات لعزومة\" تعني حلوى جاهزة من محل حلويات مختص، لا مطعم تكون الحلوى فيه صنفاً جانبياً",
    "  ثانوياً منخفض الجودة — الفئة الصحيحة \"حلويات\" فقط، وليس \"مطاعم\".",
    "- \"عصائر لحفلة\" تعني محل عصائر مختص، لا مطعم يبيع مشروبات معلّبة جانبية.",
    "إن كان الطلب عاماً ولا يحدد فئة واضحة، أعد preferredCategories كقائمة فارغة [].",
    "",
    "تنبيه — الطلب المركّب (وجبة رئيسية + إضافة): إذا ذكر العميل وجبة رئيسية (غداء/عشاء/فطور/أكل)",
    "ثم أضاف صنفاً ثانوياً بصيغة \"مع\"/\"و\" (مثل حلويات أو مشروبات)، فالوجبة الرئيسية هي النية",
    "الأساسية والصنف الثانوي مجرد إضافة عليها — ضع الفئة التي تخدم الوجبة الرئيسية فقط في",
    "preferredCategories (عادة \"مطاعم\") ولا تضع فئة الإضافة إطلاقاً، حتى لو ذُكرت الإضافة",
    "بوضوح؛ اذكر كلمة الإضافة (مثل \"حلويات\") ضمن keywords أو secondaryKeywords فقط.",
    "",
    "appetiteLevel: \"light\" إن بدا العميل يفضّل كميات أقل/معتدلة جداً، \"hearty\" إن ذكر أنه",
    "\"أكول\"/يحب الكميات الكبيرة أو طلب صراحة تقديرات سخية، وإلا \"moderate\" افتراضياً — يُستخدم",
    "فقط لتحجيم كميات الطلب المقدَّرة، لا علاقة له بالمطابقة.",
    "",
    "summary: جملة عربية واحدة قصيرة (أقل من 25 كلمة) تلخّص فهمك لما يريده العميل بأسلوب ودّي —",
    "لا تذكر فيها اسم منتج أو متجر أو سعر محدد أبداً، فقط وصف عام لنوع الطلب المفهوم."
  ].filter(Boolean).join("\n");
}

function extractJson(raw) {
  if (raw == null) return null;
  let s = String(raw).trim().replace(/^```(?:json)?/i, "").replace(/```\s*$/i, "").trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a === -1 || b === -1 || b < a) return null;
  try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { return null; }
}

// Never trust the model's shape blindly — coerce to exactly what the client expects, dropping
// anything malformed instead of forwarding it.
function sanitizeTurn(parsed, questionsAsked, forceFinal) {
  if (!parsed || typeof parsed !== "object") return null;
  if (parsed.type === "question" && questionsAsked < MAX_QUESTIONS && !forceFinal) {
    const question = String(parsed.question || "").trim().slice(0, 300);
    if (!question) return null;
    return { type: "question", question };
  }
  const keywords = Array.isArray(parsed.keywords)
    ? parsed.keywords.map(k => String(k || "").trim()).filter(Boolean).slice(0, 6)
    : [];
  const secondaryKeywords = Array.isArray(parsed.secondaryKeywords)
    ? parsed.secondaryKeywords.map(k => String(k || "").trim()).filter(Boolean).slice(0, 4)
    : [];
  const preferredCategories = Array.isArray(parsed.preferredCategories)
    ? parsed.preferredCategories.filter(c => KNOWN_CATEGORIES.includes(c))
    : [];
  const summary = String(parsed.summary || "").trim().slice(0, 200);
  const appetiteLevel = ["light", "moderate", "hearty"].includes(parsed.appetiteLevel) ? parsed.appetiteLevel : "moderate";
  return {
    type: "ready",
    keywords, secondaryKeywords,
    wantsSupplies: parsed.wantsSupplies === true,
    preferredCategories, appetiteLevel, summary
  };
}

module.exports = async (request, response) => {
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const body = request.body || {};
  const message = String(body.message || "").trim().slice(0, 700);
  if (!message) return response.status(200).json({ ok: false, turn: null });

  // Conversation history: [{role:'user'|'assistant', text}], oldest first. Capped defensively
  // server-side too (not just relying on the client) so a malformed/huge payload can't blow up
  // the prompt or the question-count logic below.
  const rawHistory = Array.isArray(body.history) ? body.history.slice(-12) : [];
  const history = rawHistory
    .map(h => ({
      role: h && h.role === "assistant" ? "assistant" : "user",
      text: String((h && h.text) || "").trim().slice(0, 700)
    }))
    .filter(h => h.text);
  const questionsAsked = history.filter(h => h.role === "assistant").length;
  const forceFinal = body.forceFinal === true;

  const catalog = {
    categories: Array.isArray(body.catalog?.categories) ? body.catalog.categories.map(String).slice(0, 20) : [],
    storeNames: Array.isArray(body.catalog?.storeNames) ? body.catalog.storeNames.map(String).slice(0, 80) : []
  };

  const messages = [
    ...history.map(h => ({ role: h.role, content: h.text })),
    { role: "user", content: message }
  ];

  const raw = await gw.complete("ask_dukkanci_parse", {
    system: buildSystemPrompt(catalog, questionsAsked, forceFinal),
    messages,
    maxTokens: 350,
    temperature: 0.3,
    timeoutMs: 10000
  });

  const turn = sanitizeTurn(extractJson(raw), questionsAsked, forceFinal);
  if (!turn) return response.status(200).json({ ok: false, turn: null });
  return response.status(200).json({ ok: true, turn });
};
