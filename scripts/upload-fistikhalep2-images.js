const fs = require('fs');
const path = require('path');

(function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] = m[2].trim();
  }
})();

const SUPABASE_URL = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!KEY) { console.error('missing SUPABASE_SERVICE_ROLE_KEY'); process.exit(1); }

const DIR = path.join(__dirname, '..', 'assets', 'photos', 'fistikhalep2');
const STORE_ID = process.argv[2];
if (!STORE_ID) { console.error('usage: node upload-fistikhalep2-images.js <storeId>'); process.exit(1); }

async function upload(localPath, remoteName) {
  const buf = fs.readFileSync(localPath);
  const url = `${SUPABASE_URL}/storage/v1/object/campaign-images/${remoteName}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KEY}`,
      apikey: KEY,
      'Content-Type': 'image/jpeg',
      'x-upsert': 'true',
    },
    body: buf,
  });
  if (!resp.ok) {
    const t = await resp.text();
    throw new Error(`upload failed ${remoteName}: ${resp.status} ${t}`);
  }
  return `${SUPABASE_URL}/storage/v1/object/public/campaign-images/${remoteName}`;
}

async function main() {
  const map = {};
  // logo + cover
  map.logo = await upload(path.join(DIR, 'logo.jpg'), `store${STORE_ID}_logo.jpg`);
  console.log('logo:', map.logo);
  map.cover = await upload(path.join(DIR, 'cover.jpg'), `store${STORE_ID}_cover.jpg`);
  console.log('cover:', map.cover);

  const files = fs.readdirSync(DIR).filter(f => /^p\d+_/.test(f));
  files.sort();
  const products = {};
  for (const f of files) {
    const pnum = f.match(/^p(\d+)_/)[1];
    const remoteName = `store${STORE_ID}_fh2p${pnum}.jpg`;
    const url = await upload(path.join(DIR, f), remoteName);
    products[f] = url;
    console.log(f, '->', url);
  }
  fs.writeFileSync(path.join(DIR, 'upload-map.json'), JSON.stringify({ logo: map.logo, cover: map.cover, products }, null, 2));
  console.log('done, total products:', files.length);
}

main().catch(e => { console.error(e); process.exit(1); });
