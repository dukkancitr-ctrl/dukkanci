import fs from "fs";
import crypto from "crypto";

const FILE = "sam-data.js";
const dir = "assets/photos/sam/products/";
const md5 = (p) => { try { return crypto.createHash("md5").update(fs.readFileSync(dir + p)).digest("hex"); } catch { return null; } };
const placeholder = md5("item-004.webp");

let t = fs.readFileSync(FILE, "utf8");
const key = "const samProductCatalog = ";
const i = t.indexOf(key) + key.length;
const bs = t.indexOf("[", i);
let depth = 0, instr = false, esc = false, end = -1;
for (let j = bs; j < t.length; j++) {
  const c = t[j];
  if (instr) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') instr = false; }
  else { if (c === '"') instr = true; else if (c === "[") depth++; else if (c === "]") { depth--; if (depth === 0) { end = j; break; } } }
}
const cat = JSON.parse(t.slice(bs, end + 1));
const isLogo = (p) => md5(p.image.split("/").pop()) === placeholder;
const removed = cat.filter(isLogo);
const kept = cat.filter((p) => !isLogo(p));
console.log("before:", cat.length, "| removed(logo):", removed.length, "| kept(real):", kept.length);
removed.forEach((p) => console.log("   -", p.name));
t = t.slice(0, bs) + JSON.stringify(kept, null, 1) + t.slice(end + 1);
fs.writeFileSync(FILE, t);
for (const im of [...new Set(removed.map((p) => p.image.split("/").pop()))]) {
  if (fs.existsSync(dir + im)) { fs.unlinkSync(dir + im); console.log("deleted", im); }
}
console.log("kept items:", kept.map((p) => p.name).join(" | "));
