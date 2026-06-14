import fs from "fs";
import crypto from "crypto";

const FILE = "tihama-data.js";
const dir = "assets/photos/tihama/products/";
const md5 = (p) => { try { return crypto.createHash("md5").update(fs.readFileSync(dir + p)).digest("hex"); } catch { return null; } };
const placeholder = md5("item-014.webp");

let t = fs.readFileSync(FILE, "utf8");
const key = "const tihamaProductCatalog = ";
const i = t.indexOf(key) + key.length;
const bs = t.indexOf("[", i);
let depth = 0, instr = false, esc = false, end = -1;
for (let j = bs; j < t.length; j++) {
  const c = t[j];
  if (instr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') instr = false; }
  else { if (c === '"') instr = true; else if (c === "[") depth++; else if (c === "]") { depth--; if (depth === 0) { end = j; break; } } }
}
const cat = JSON.parse(t.slice(bs, end + 1));
const isPlaceholder = (p) => md5(p.image.split("/").pop()) === placeholder;
const removed = cat.filter(isPlaceholder);
const kept = cat.filter((p) => !isPlaceholder(p));
console.log("before:", cat.length, "| removed:", removed.length, "| after:", kept.length);
removed.forEach((p) => console.log("   -", p.name));
t = t.slice(0, bs) + JSON.stringify(kept, null, 1) + t.slice(end + 1);
fs.writeFileSync(FILE, t);
for (const im of [...new Set(removed.map((p) => p.image.split("/").pop()))]) {
  if (fs.existsSync(dir + im)) { fs.unlinkSync(dir + im); console.log("deleted", dir + im); }
}
console.log("done");
