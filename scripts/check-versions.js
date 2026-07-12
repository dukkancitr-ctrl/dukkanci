#!/usr/bin/env node
/**
 * check-versions.js
 *
 * يمنع أحد الأسباب الموثّقة لعودة الأخطاء "المُصلَحة" بعد النشر:
 * رقم الإصدار ?v=NNN لملفي app.js وstyles.css يجب أن يتطابق بين
 * index.html وsw.js (الثابت CACHE + مصفوفة APP_SHELL). نسيان تحديث
 * أحد هذه المواضع يجعل الـ Service Worker يستمر بتقديم نسخة قديمة.
 *
 * الاستخدام: npm run check:versions
 * يخرج بكود 1 (فشل) إن وُجد أي عدم تطابق، ليمنع النشر قبل التصحيح.
 */

const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexHtml = fs.readFileSync(path.join(root, "index.html"), "utf8");
const swJs = fs.readFileSync(path.join(root, "sw.js"), "utf8");

function extractVersion(content, filename) {
  const re = new RegExp(filename.replace(".", "\\.") + "\\?v=(\\d+)", "g");
  const versions = new Set();
  let m;
  while ((m = re.exec(content)) !== null) versions.add(m[1]);
  return [...versions];
}

const results = [];
let hasError = false;

for (const file of ["app.js", "styles.css"]) {
  const indexVersions = extractVersion(indexHtml, file);
  const swVersions = extractVersion(swJs, file);

  const indexSet = new Set(indexVersions);
  const swSet = new Set(swVersions);
  const allMatch =
    indexVersions.length > 0 &&
    swVersions.length > 0 &&
    indexVersions.every(v => swSet.has(v)) &&
    swVersions.every(v => indexSet.has(v));

  results.push({ file, indexVersions, swVersions, allMatch });
  if (!allMatch) hasError = true;
}

console.log("=== فحص تطابق رقم إصدار الكاش (check-versions) ===\n");
for (const r of results) {
  const status = r.allMatch ? "✅ متطابق" : "❌ غير متطابق";
  console.log(`${r.file}: ${status}`);
  console.log(`  index.html : ${r.indexVersions.join(", ") || "(لم يُعثر عليه)"}`);
  console.log(`  sw.js      : ${r.swVersions.join(", ") || "(لم يُعثر عليه)"}`);
}

if (hasError) {
  console.log(
    "\n❌ فشل الفحص: حدّث رقم الإصدار في index.html وsw.js (CACHE + APP_SHELL) ليتطابقا قبل النشر."
  );
  process.exit(1);
} else {
  console.log("\n✅ كل الإصدارات متطابقة. يمكن المتابعة بالنشر.");
  process.exit(0);
}
