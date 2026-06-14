import fs from "fs";
const t = fs.readFileSync("scripts/sam.html", "utf8");
const tag = 'id="__NUXT_DATA__">';
const s = t.indexOf(tag) + tag.length;
const e = t.indexOf("</script>", s);
const A = JSON.parse(t.slice(s, e));
const lit = (i) => A[i];

function categorize(name) {
  const n = name;
  if (/شاورما/.test(n)) return "شاورما";
  if (/فروج|دجاج|بروست/.test(n)) return "فروج ودجاج";
  if (/بيتزا/.test(n)) return "بيتزا";
  if (/برغر|برجر|همبرغر|غربي|ناغتس|اصابع|بطاطا/.test(n)) return "وجبات غربية";
  if (/عصير|كوكتيل|ميلك|شيك|مشروب|موهيتو|سموذي/.test(n)) return "عصائر ومشروبات";
  if (/مدفون|منسف|مندي|كبسة|شرقي|مظبي|قشاط|امبراطور|عربي|سختورة|سيخ/.test(n)) return "أطباق شرقية";
  if (/وافل|كريب|بان كيك|بانكيك|نوتيلا|حلى|حلو|كاسة|كاسات|أفوكادو|أفكادو|بوظة|براوني|توتي|شوكلامو|دبي|بوكس/.test(n)) return "حلويات وكاسات";
  if (/سلطة|سلطات|مقبلات|حمص|متبل|فتوش|تبولة/.test(n)) return "مقبلات وسلطات";
  return "أطباق متنوعة";
}

const seen = new Set();
const products = [];
for (let i = 0; i < A.length; i++) {
  const v = A[i];
  if (v && typeof v === "object" && !Array.isArray(v) && "name" in v && "price" in v && "view_number" in v && "image" in v) {
    const name = lit(v.name);
    const price = Number(lit(v.price));
    const image = lit(v.image);
    if (!name || !image || !/MaterialImages/.test(String(image))) continue; // only real product images
    const key = name + "|" + image;
    if (seen.has(key)) continue;
    seen.add(key);
    products.push({
      name: String(name).replace(/\s+/g, " ").trim(),
      price: Math.round(price),
      image: String(image),
      category: categorize(String(name)),
      featured: lit(v.is_featured) === true || lit(v.is_featured) === 1,
    });
  }
}

fs.writeFileSync("scripts/sam_products.json", JSON.stringify(products, null, 1));
const byCat = {};
products.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
console.log("products with images:", products.length);
console.log("by category:", JSON.stringify(byCat, null, 0));
console.log("zero-price:", products.filter(p => !p.price).length);
console.log("sample:", JSON.stringify(products.slice(0, 5), null, 1));
