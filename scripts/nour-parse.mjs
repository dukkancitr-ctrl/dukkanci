import fs from "fs";

const full = fs.readFileSync("scripts/nour_menu.html", "utf8");
const t = full.slice(full.indexOf("<body"));

// category sections: id="wro-menu-1-<urlencoded-arabic>" class="wc-restaurant-menu-section"
const catPos = [...t.matchAll(/id="wro-menu-\d+-([^"]+)"\s+class="wc-restaurant-menu-section"/g)].map(m => {
  let name = m[1];
  try { name = decodeURIComponent(name); } catch {}
  return { pos: m.index, name: name.replace(/-/g, " ").trim() };
});
catPos.sort((a, b) => a.pos - b.pos);
const catFor = (pos) => {
  let c = "أطباق";
  for (const cp of catPos) { if (cp.pos <= pos) c = cp.name; else break; }
  return c;
};

// collect images and prices with indices
const images = [...t.matchAll(/background-image:url\('([^']+)'\)/g)].map(m => ({ i: m.index, url: m[1] }));
const prices = [...t.matchAll(/woocommerce-Price-amount amount">\s*<bdi>([0-9.,]+)/g)].map(m => ({ i: m.index, v: m[1] }));
const names = [...t.matchAll(/<div class="name">([^<]+)<\/div>/g)].map(m => ({ i: m.index, name: m[1].trim() }));

const lastBefore = (arr, pos, max) => { let r = null; for (const a of arr) { if (a.i < pos && pos - a.i < max) r = a; if (a.i >= pos) break; } return r; };
const firstAfter = (arr, pos, max) => { for (const a of arr) { if (a.i > pos && a.i - pos < max) return a; } return null; };

const seen = new Set();
const products = [];
for (const n of names) {
  const img = lastBefore(images, n.i, 1200);
  const pr = firstAfter(prices, n.i, 1200);
  if (!img || !pr) continue;
  const key = n.name + "|" + img.url;
  if (seen.has(key)) continue;
  seen.add(key);
  products.push({ name: n.name, price: Number(pr.v.replace(/[.,]/g, "")), image: img.url, category: catFor(n.i) });
}

fs.writeFileSync("scripts/nour_products.json", JSON.stringify(products, null, 1));
const byCat = {};
products.forEach(p => { byCat[p.category] = (byCat[p.category] || 0) + 1; });
console.log("total products:", products.length);
console.log("by category:", JSON.stringify(byCat, null, 0));
console.log("sample:", JSON.stringify(products.slice(0, 5), null, 1));
console.log("price range:", Math.min(...products.map(p=>p.price)), "-", Math.max(...products.map(p=>p.price)));
