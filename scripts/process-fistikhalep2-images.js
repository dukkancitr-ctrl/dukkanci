const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:/Users/Hp/AppData/Local/Temp/claude/C--projects-New-Dukkanci/20659994-19d1-4a92-922b-31f54b977e24/scratchpad/fistikhalep2';
const DEST = path.join(__dirname, '..', 'assets', 'photos', 'fistikhalep2');

async function main() {
  fs.mkdirSync(DEST, { recursive: true });

  await sharp(path.join(SRC, 'logo.jpg'))
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DEST, 'logo.jpg'));
  console.log('logo done');

  const coverSrc = path.join(SRC, 'p19_ish-bulbul-fistik.jpg');
  const meta = await sharp(coverSrc).metadata();
  const targetRatio = 1600 / 679;
  let cropW = meta.width;
  let cropH = Math.round(meta.width / targetRatio);
  if (cropH > meta.height) { cropH = meta.height; cropW = Math.round(meta.height * targetRatio); }
  const left = Math.round((meta.width - cropW) / 2);
  const top = Math.max(0, Math.round((meta.height - cropH) / 3));
  await sharp(coverSrc)
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1600, 679)
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DEST, 'cover.jpg'));
  console.log('cover done', { cropW, cropH, left, top });

  const files = fs.readdirSync(SRC).filter(f => /^p\d+_/.test(f));
  for (const f of files) {
    const outName = f.replace(/\.jpe?g$/i, '.jpg');
    await sharp(path.join(SRC, f))
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(DEST, outName));
  }
  console.log('products done:', files.length);
}

main().catch(e => { console.error(e); process.exit(1); });
