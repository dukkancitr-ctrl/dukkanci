import fs from 'fs';
import path from 'path';

const d = JSON.parse(fs.readFileSync('orange-raw.json', 'utf8'));
const DIR = 'assets/photos/orange';
const ITEMS = path.join(DIR, 'items');
fs.mkdirSync(ITEMS, { recursive: true });

const HEADERS = { 'User-Agent': 'Mozilla/5.0' };
async function dl(url, dest) {
  const r = await fetch(url, { headers: HEADERS });
  if (!r.ok) return false;
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 500) return false;
  fs.writeFileSync(dest, buf);
  return true;
}

// logo
const logo = d.entity.media?.logo;
if (logo && !logo.includes('placeholder')) {
  const ext = logo.split('?')[0].split('.').pop();
  await dl(logo, path.join(DIR, 'logo.' + ext));
  console.log('logo:', logo.split('/').pop());
}

let ok = 0, ph = 0;
for (const p of d.products) {
  const url = p.cover || '';
  if (!url || url.includes('placeholder')) { p.localImage = null; ph++; continue; }
  const clean = url.split('?')[0];
  const ext = clean.split('.').pop().toLowerCase();
  const fname = `${p.sourceId}.${ext}`;
  const got = await dl(clean, path.join(ITEMS, fname));
  if (got) { p.localImage = `/assets/photos/orange/items/${fname}`; ok++; }
  else { p.localImage = null; ph++; }
}
fs.writeFileSync('orange-raw.json', JSON.stringify(d, null, 1));
console.log('downloaded:', ok, '| placeholder/failed:', ph);
