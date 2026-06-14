import fs from "fs";
const t = fs.readFileSync("scripts/afgan_menu.html", "utf8");

// locate "sections":[ ... ] and bracket-match (string-aware)
const start = t.indexOf('"sections":[');
const arrStart = t.indexOf("[", start);
let depth = 0, inStr = false, esc = false, end = -1;
for (let i = arrStart; i < t.length; i++) {
  const c = t[i];
  if (inStr) {
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === '"') inStr = false;
  } else {
    if (c === '"') inStr = true;
    else if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
}
const sections = JSON.parse(t.slice(arrStart, end + 1));

const products = [];
const byCat = {};
for (const sec of sections) {
  const cat = (sec.name || "Menu").trim();
  for (const it of (sec.items || [])) {
    if (!it.name) continue;
    const price = Number((it.priceInfo && it.priceInfo.price) || 0);
    const img = it.image && it.image.url ? it.image.url : "";
    products.push({
      name: it.name.trim(),
      price: Math.round(price),
      image: img,
      description: (it.description || "").replace(/\s+/g, " ").trim(),
      category: cat,
      featured: !!it.featured,
    });
    byCat[cat] = (byCat[cat] || 0) + 1;
  }
}

fs.writeFileSync("scripts/afgan_products.json", JSON.stringify(products, null, 1));
console.log("sections:", sections.length, "| products:", products.length);
console.log("by category:", JSON.stringify(byCat));
console.log("no-image:", products.filter(p => !p.image).length, "| zero-price:", products.filter(p => !p.price).length);
console.log("sample:", JSON.stringify(products.slice(0, 3), null, 1));
