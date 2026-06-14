import fs from "fs";

// Parse trybany product objects from a page's RSC payload (escaped JSON inside HTML).
export function parseProducts(html) {
  // unescape the RSC string-encoded JSON
  const s = html.replace(/\\"/g, '"').replace(/\\\\/g, "\\").replace(/\\u0026/g, "&").replace(/\\u002F/g, "/");
  const out = [];
  const re = /"slug":"([^"]+)","title":"([^"]+)","description":"[^"]*","media":\{[^}]*?"cover":(null|"[^"]*")[^}]*?\}[\s\S]*?"categoryId":"([^"]*)"[\s\S]*?"price":\{"raw":(null|[0-9.]+),"formatted":(null|"[^"]*")\},"oldPrice":\{"raw":(null|[0-9.]+)/g;
  let m;
  while ((m = re.exec(s))) {
    const cover = m[3] === "null" ? "" : m[3].replace(/^"|"$/g, "");
    out.push({
      slug: m[1],
      title: m[2],
      image: cover,
      categoryId: m[4],
      price: m[5] === "null" ? 0 : Number(m[5]),
      oldPrice: m[7] === "null" ? 0 : Number(m[7]),
    });
  }
  return out;
}

if (process.argv[2]) {
  const html = fs.readFileSync(process.argv[2], "utf8");
  const p = parseProducts(html);
  // dedupe by slug
  const seen = new Set(), uniq = [];
  for (const x of p) { if (!seen.has(x.slug)) { seen.add(x.slug); uniq.push(x); } }
  console.log("products parsed:", p.length, "| unique:", uniq.length);
  const cats = {};
  uniq.forEach(x => cats[x.categoryId] = (cats[x.categoryId] || 0) + 1);
  console.log("distinct categoryIds:", Object.keys(cats).length);
  console.log("withImage:", uniq.filter(x => x.image).length, "| noImage:", uniq.filter(x => !x.image).length);
  console.log("sample:", JSON.stringify(uniq.slice(0, 3), null, 1));
}
