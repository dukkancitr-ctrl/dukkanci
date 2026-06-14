import fs from "fs";
import { parseProducts } from "./kady-parse.mjs";

const BASE = "https://kayasehir.kadimarket.net/ar/kady-markt-bashak-shhyr-18";
const UA = { "User-Agent": "Mozilla/5.0" };
const fetchText = async (u) => { for (let i=0;i<3;i++){ try { const r = await fetch(u, { headers: UA }); if (r.ok) return await r.text(); } catch {} } return ""; };

async function pool(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx], idx); }
  }));
  return out;
}

// 1) home -> top categories
const home = await fetchText(BASE + "/");
const homeU = home.replace(/\\u002F/g, "/").replace(/\\"/g, '"');
const topSlugs = [...new Set([...home.matchAll(/categories\/([a-z0-9-]+)\/products/g)].map(m => m[1]))];
const tax = {};
for (const m of homeU.matchAll(/"slug":"([^"]+)","title":"([^"]+)"/g)) tax[m[1]] = m[2].trim().replace(/^و/, "");
console.error("top categories:", topSlugs.length);

// 2) for each top cat: fetch top page -> products + leaf urls
const allProducts = [];
const seen = new Set();
function add(prods, catName) {
  for (const p of prods) {
    if (!p.slug || seen.has(p.slug)) continue;
    if (!p.image || !p.price) continue;
    seen.add(p.slug);
    allProducts.push({ ...p, category: catName });
  }
}

for (const slug of topSlugs) {
  const catName = tax[slug] || slug;
  const topHtml = await fetchText(`${BASE}/categories/${slug}/products/`);
  add(parseProducts(topHtml), catName);
  // leaf sub-category urls
  const leaves = [...new Set([...topHtml.matchAll(new RegExp(`categories/${slug}/sub-categories/[a-z0-9-]+/products/?`, "g"))].map(m => m[0]))];
  const leafHtmls = await pool(leaves, 8, (lf) => fetchText(`${BASE}/${lf.replace(/^\//, "")}`));
  for (const lh of leafHtmls) add(parseProducts(lh), catName);
  console.error(slug, "->", catName, "| running total:", allProducts.length, "| leaves:", leaves.length);
}

fs.writeFileSync("scripts/kady_products.json", JSON.stringify(allProducts, null, 1));
const byCat = {};
allProducts.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
console.error("TOTAL:", allProducts.length, "categories:", Object.keys(byCat).length);
console.log(JSON.stringify(byCat));
