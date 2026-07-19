// One-time image processing for Chiki Wiki (store 109) — Beylikdüzü, İstanbul.
// Source: WhatsApp Business catalog (wa.me/c/905527866000), raw files staged in the session scratchpad.
// 23 published products (5 catalog items excluded: merchant-uploaded pure-black images).
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAW = "C:/Users/Hp/AppData/Local/Temp/claude/C--projects-New-Dukkanci/af46184b-0927-48a1-b1f1-1349413902bb/scratchpad/chikiwiki/raw";
const OUT = path.join(__dirname, "..", "assets", "photos", "chikiwiki");

// raw file -> published product file (order matches chikiwiki-data.js)
const MAP = [
  ["cw_cat01_1.jpg", "p1.jpg"],  // BURGER KIDS
  ["cw_cat01_2.jpg", "p2.jpg"],  // WRAP KIDS
  ["cw_cat01_3.jpg", "p3.jpg"],  // MIX KIDS
  ["cw_cat02_1.jpg", "p4.jpg"],  // SLAW SRIRACHA BURGER
  ["cw_cat02_2.jpg", "p5.jpg"],  // XTREME BURGER
  ["cw_cat02_3.jpg", "p6.jpg"],  // MUSHROOM BURGER
  ["cw_cat03_1.jpg", "p7.jpg"],  // XTREME WRAP
  ["cw_cat03_2.jpg", "p8.jpg"],  // MEXICAN WRAP
  ["cw_cat03_3.jpg", "p9.jpg"],  // CHIKI WRAP
  ["cw_cat04_1.jpg", "p10.jpg"], // BROSTED
  ["cw_cat05_1.jpg", "p11.jpg"], // CRESPY x3
  ["cw_cat05_2.jpg", "p12.jpg"], // TENDER CHEESE x3
  ["cw_cat05_3.jpg", "p13.jpg"], // CHIKI NUGGETS x5
  ["cw_cat06_1.jpg", "p14.jpg"], // CRUNCHY MENU
  ["cw_cat06_2.jpg", "p15.jpg"], // DINNER BOX
  ["cw_cat06_3.jpg", "p16.jpg"], // MEGA MENU (merchant reuses CRUNCHY photo)
  ["cw_cat08_1.jpg", "p17.jpg"], // COLESLAW SALATA
  ["cw_cat08_2.jpg", "p18.jpg"], // SEZAR SALATA
  ["cw_cat08_3.jpg", "p19.jpg"], // COBAN SALATA (source only 227x170 — kept as-is, real image)
  ["cw_cat09_2.jpg", "p20.jpg"], // MOZZARELLA STICK x6
  ["cw_cat10_1.jpg", "p21.jpg"], // CHIKI TAHITI
  ["cw_cat10_2.jpg", "p22.jpg"], // CHIKI BARBEQUE
  ["cw_cat10_3.jpg", "p23.jpg"], // CHIKI ALPESTO
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [src, dst] of MAP) {
    await sharp(path.join(RAW, src))
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(OUT, dst));
  }
  await sharp(path.join(RAW, "chikiwiki_logo.jpg"))
    .resize(400, 400, { fit: "cover" })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(OUT, "logo.jpg"));
  await sharp(path.join(RAW, "chikiwiki_cover.jpg"))
    .resize(1280, 542, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(OUT, "cover.jpg"));
  const files = fs.readdirSync(OUT);
  let total = 0;
  for (const f of files) total += fs.statSync(path.join(OUT, f)).size;
  console.log("files:", files.length, "total KB:", Math.round(total / 1024));
})();
