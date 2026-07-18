// Downloads + resizes all images for مطعم بروستد عبد الحميد (store 103) from amenu.net
// into assets/photos/abdulhamit/, then regenerates abdulhamit-data.js with final file names.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const { items } = require('./gen-abdulhamit-data.js');

const OUT_DIR = path.join(__dirname, '..', 'assets', 'photos', 'abdulhamit');
fs.mkdirSync(OUT_DIR, { recursive: true });

const LOGO_URL = 'https://amenu.net/storage/Store/logo/12396/6432a62de81a9_%D9%84%D9%88%D8%BA%D9%88-%D8%B5%D9%88%D8%B1%D8%A9.jpeg';
// Cover: reuse the "فروج مشوي كامل" (whole grilled chicken) hero photo — a clean, high-quality
// product shot; amenu.net has no dedicated marketing banner for this store (only the generic
// site-wide bannerbackground.webp), same pattern as prior sessions with no vendor banner.
const COVER_URL = items[1].srcImg;

async function fetchBuf(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error('fetch failed ' + r.status + ' ' + url);
  return Buffer.from(await r.arrayBuffer());
}

(async () => {
  // Logo
  const logoBuf = await fetchBuf(LOGO_URL);
  await sharp(logoBuf).resize(400, 400, { fit: 'cover' }).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(OUT_DIR, 'logo.jpg'));
  console.log('logo done');

  // Cover
  const coverBuf = await fetchBuf(COVER_URL);
  await sharp(coverBuf).resize(1280, null, { withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(OUT_DIR, 'cover.jpg'));
  console.log('cover done');

  // Products
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const file = 'p' + (i + 1);
    it._file = file;
    const buf = await fetchBuf(it.srcImg);
    await sharp(buf).resize(800, 800, { fit: 'cover' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT_DIR, file + '.jpg'));
    console.log(i + 1, '/', items.length, file, it.name);
  }

  // Regenerate abdulhamit-data.js now that _file is set on each item
  require('./gen-abdulhamit-data.js').writeFile();
  console.log('abdulhamit-data.js written');
})().catch(e => { console.error(e); process.exit(1); });
