import fs from "fs";
import { parseProducts } from "./kady-parse.mjs";

const BASE = "https://kayasehir.kadimarket.net";
const UA = { "User-Agent": "Mozilla/5.0" };
const PER_CAT = 40;
const cats = JSON.parse(fs.readFileSync("scripts/kady_tax.json", "utf8"))
  .filter(c => /\/products/.test("x")); // placeholder

// top categories = those referenced as categories/<slug>/products in home
const home = fs.readFileSync("scripts/kady.html", "utf8");
const topSlugs = [...new Set([...home.matchAll(/categories\/([a-z0-9-]+)\/products/g)].map(m => m[1]))];
const tax = JSON.parse(fs.readFileSync("scripts/kady_tax.json", "utf8"));
const nameBySlug = Object.fromEntries(tax.map(t => [t.slug, t.title.trim().replace(/^و/, "")]));

const fetchText = async (url) => { try { return await (await fetch(url, { headers: UA })).text(); } catch { return ""; } };

const all = [];
for (const slug of topSlugs) {
  const catName = nameBySlug[slug] || slug;
  const topUrl = `${BASE}/ar/kady-markt-bashak-shhyr-18/categories/${slug}/products/`;
  const topHtml = await fetchText(topUrl);
  // find leaf sub-category product URLs
  let leaves = [...new Set([...topHtml.matchAll(new RegExp(`categories/${slug}/sub-categories/[a-z0-9-]+/products/?`, "g"))].map(m => m[0]))];
  let prods = parseProducts(topHtml); // sometimes top page has products
  let li = 0;
  while (prods.length < PER_CAT && li < leaves.length) {
    const lh = await fetchText(BASE + "/ar/kady-markt-bashak-shhyr-18/" + leaves[li].replace(/^\//, ""));
    prods = prods.concat(parseProducts(lh));
    li++;
  }
  // dedupe by slug, take PER_CAT
  const seen = new Set(), picked = [];
  for (const p of prods) {
    if (p.image && p.price > 0 && !seen.has(p.slug)) { seen.add(p.slug); picked.push({ ...p, category: catName }); }
    if (picked.length >= PER_CAT) break;
  }
  all.push(...picked);
  console.log(slug, "->", catName, ":", picked.length, "(leaves:", leaves.length + ")");
}

fs.writeFileSync("scripts/kady_products.json", JSON.stringify(all, null, 1));
const byCat = {};
all.forEach(p => byCat[p.category] = (byCat[p.category] || 0) + 1);
console.log("TOTAL products:", all.length, "| categories:", Object.keys(byCat).length);
