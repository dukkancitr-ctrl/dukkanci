import fs from "fs";
const t = fs.readFileSync("scripts/tihama.html", "utf8");

// categories by position
const cats = [...t.matchAll(/class="category-title">\s*([^<]+?)\s*</g)].map(m => ({ pos: m.index, name: m[1].replace(/\s+/g, " ").trim() }));
const catFor = (pos) => { let c = "أطباق"; for (const x of cats) { if (x.pos <= pos) c = x.name; else break; } return c; };

// split into product-item blocks
const parts = t.split('class="product-item');
const products = [];
const seen = new Set();
let cursor = 0;
for (let k = 1; k < parts.length; k++) {
  const blockStart = t.indexOf('class="product-item', cursor + 1);
  cursor = blockStart;
  const block = parts[k].slice(0, 2500);
  const name = (block.match(/<h3>\s*([^<]+?)\s*<\/h3>/) || [])[1];
  const price = (block.match(/data-basePrice="([0-9.]+)"/) || [])[1];
  const img = (block.match(/data-img="([^"]+)"/) || [])[1];
  if (!name || price === undefined) continue;
  const before = (block.match(/class="before-price">\s*([0-9.]+)/) || [])[1];
  const desc = (block.match(/class="descrip">\s*([^<]+?)\s*</) || [])[1] || "";
  const p = Math.round(Number(price));
  const old = before ? Math.round(Number(before)) : 0;
  const key = name + "|" + (img || "");
  if (seen.has(key)) continue;
  seen.add(key);
  products.push({
    name: name.replace(/\s+/g, " ").trim(),
    price: p,
    oldPrice: old > p ? old : 0,
    image: img || "",
    description: desc.replace(/\s+/g, " ").trim(),
    category: catFor(blockStart),
  });
}

fs.writeFileSync("scripts/tihama_products.json", JSON.stringify(products, null, 1));
const byCat = {};
products.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
console.log("products:", products.length);
console.log("categories:", JSON.stringify(byCat, null, 0));
console.log("no-image:", products.filter(p => !p.image).length, "| zero-price:", products.filter(p => !p.price).length);
console.log("sample:", JSON.stringify(products.slice(0, 4), null, 1));
