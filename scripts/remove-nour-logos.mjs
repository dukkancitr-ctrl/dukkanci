import fs from "fs";
const FILE = "nour-data.js";
let t = fs.readFileSync(FILE, "utf8");
const key = "const nourProductCatalog = ";
const i = t.indexOf(key) + key.length;
const bs = t.indexOf("[", i);
let depth = 0, instr = false, esc = false, end = -1;
for (let j = bs; j < t.length; j++) {
  const c = t[j];
  if (instr) {
    if (esc) esc = false;
    else if (c === "\\") esc = true;
    else if (c === '"') instr = false;
  } else {
    if (c === '"') instr = true;
    else if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = j; break; } }
  }
}
const cat = JSON.parse(t.slice(bs, end + 1));
const isLogo = (p) => /logo|placeholder|no-?image|default/i.test(p.image);
const removed = cat.filter(isLogo);
const kept = cat.filter((p) => !isLogo(p));
console.log("before:", cat.length, "| removed:", removed.length, "| after:", kept.length);
removed.forEach((p) => console.log("   -", p.name));
t = t.slice(0, bs) + JSON.stringify(kept, null, 1) + t.slice(end + 1);
fs.writeFileSync(FILE, t);
// delete orphaned logo files
const imgs = [...new Set(removed.map((p) => p.image))];
for (const im of imgs) {
  const f = "assets/photos/nour/products/" + im.split("/").pop();
  if (fs.existsSync(f)) { fs.unlinkSync(f); console.log("deleted", f); }
}
console.log("done");
