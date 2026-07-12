// مناطق «دليل دكانجي» (/dalil): تُشتق منطقة كل متجر من لاحقة اسمه
// ("الاسم - المنطقة") أولاً، ثم من عنوانه النصي عبر كلمات المطابقة أدناه.
// مشترك بين الواجهة (يُحمَّل كـ<script> في index.html فتصبح الثوابت globals)
// وبين SSR/sitemap (require) — نفس نمط category-slugs.js تماماً.
//
// ترتيب القائمة مهم: أول قاعدة تطابق تفوز، لذلك:
//  - الأحياء الأدق (كاياشهير، بهشة شهير) قبل قضائها الأوسع (باشاك شهير).
//  - إسنيورت قبل الفاتح: بعض عناوين إسنيورت تذكر "حي الفاتح" كاسم حي صغير
//    داخل إسنيورت (مثال متجر 79)، والعكس غير وارد في بيانات المتاجر الحالية.
// كلمات المطابقة تُقارن بعد toLocaleLowerCase("tr") (تصريف حروف İ/I التركية).
const DALIL_REGIONS = [
  { slug: "kayasehir", label: "كاياشهير", match: ["كاياشهير", "كايا شهير", "كاياباشي", "كايا باشي", "kayaşehir", "kayasehir", "kayabaşı", "kayabasi"] },
  { slug: "bahcesehir", label: "بهشة شهير", match: ["بهشة شهير", "بهجة شهير", "bahçeşehir", "bahcesehir"] },
  { slug: "sirinevler", label: "شيرين إيفلر / بهشة إيفلر", match: ["شيرين", "بهشة ايفلر", "بهشة إيفلر", "بهتشه إفلر", "بهتشة إفلر", "بهتشه ايفلر", "باهتشيلي إيفلر", "şirinevler", "sirinevler", "bahçelievler", "bahcelievler"] },
  { slug: "avcilar", label: "أفجلار", match: ["أفجلار", "افجلار", "avcılar", "avcilar"] },
  { slug: "bagcilar", label: "باغجلار", match: ["باغجلار", "bağcılar", "bagcilar"] },
  { slug: "sisli", label: "شيشلي", match: ["شيشلي", "şişli", "sisli"] },
  { slug: "taksim", label: "تقسيم / بيوغلو", match: ["تقسيم", "بيوغلو", "taksim", "beyoğlu", "beyoglu", "kuloğlu"] },
  { slug: "ortakoy", label: "أورتاكوي", match: ["أورتاكوي", "اورتاكوي", "ortaköy", "ortakoy", "beşiktaş", "besiktas", "بشيكتاش"] },
  { slug: "florya", label: "فلوريا", match: ["فلوريا", "florya"] },
  { slug: "esenyurt", label: "إسنيورت", match: ["إسنيورت", "اسنيورت", "أسنيورت", "esenyurt"] },
  { slug: "beylikduzu", label: "بيليك دوزو", match: ["بيليك دوزو", "بيليكدوزو", "beylikdüzü", "beylikduzu"] },
  { slug: "basaksehir", label: "باشاك شهير", match: ["باشاك شهير", "بشاق شهير", "باشاكشهير", "başakşehir", "basaksehir", "أونوركنت", "onurkent"] },
  { slug: "fatih", label: "الفاتح", match: ["الفاتح", "fatih", "أكسراي", "aksaray", "توبكابي", "topkapı", "topkapi", "فندق زاده", "fındıkzade", "findikzade"] }
];

// المتاجر التي لا يطابق عنوانها أي منطقة أعلاه (عنوان عام مثل "إسطنبول، تركيا").
const DALIL_REGION_FALLBACK = { slug: "other", label: "مناطق أخرى" };

// name: اسم المتجر (لاحقة " - المنطقة" لها الأولوية لأنها تصريح التاجر نفسه)،
// address: العنوان النصي. تُعيد دائماً كائن منطقة (قد يكون الاحتياطي العام).
function dalilRegionFor(name, address) {
  const branch = (typeof name === "string" && name.includes(" - "))
    ? name.split(" - ").pop().trim().toLocaleLowerCase("tr")
    : "";
  if (branch) {
    for (const region of DALIL_REGIONS) {
      if (region.match.some(token => branch.includes(token))) return region;
    }
  }
  const hay = `${name || ""} ${address || ""}`.toLocaleLowerCase("tr");
  for (const region of DALIL_REGIONS) {
    if (region.match.some(token => hay.includes(token))) return region;
  }
  return DALIL_REGION_FALLBACK;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { DALIL_REGIONS, DALIL_REGION_FALLBACK, dalilRegionFor };
}
