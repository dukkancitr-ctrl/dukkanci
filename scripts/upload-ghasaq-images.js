// Uploads Ghasaq Market images to Supabase Storage (campaign-images bucket) and repoints DB rows,
// so the store shows images live without waiting for a code deploy.
const fs = require('fs'), path = require('path');
const env = {}; fs.readFileSync('.env', 'utf8').split(/\r?\n/).forEach(l => { const i = l.indexOf('='); if (i > 0 && !l.startsWith('#')) env[l.slice(0, i).trim()] = l.slice(i + 1).trim(); });
const KEY = env.SUPABASE_SERVICE_ROLE_KEY, BASE = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const DIR = path.join(__dirname, '..', 'assets', 'photos', 'ghasaq');
const pub = f => `${BASE}/storage/v1/object/public/campaign-images/ghasaq/${f}`;
const H = { apikey: KEY, Authorization: 'Bearer ' + KEY };
async function up(f) {
  const r = await fetch(`${BASE}/storage/v1/object/campaign-images/ghasaq/${f}`, { method: 'POST', headers: { ...H, 'Content-Type': 'image/jpeg', 'x-upsert': 'true' }, body: fs.readFileSync(path.join(DIR, f)) });
  if (!r.ok) throw new Error(f + ' ' + r.status + ' ' + (await r.text()).slice(0, 200));
}
(async () => {
  const files = fs.readdirSync(DIR).filter(f => f.endsWith('.jpg'));
  for (let i = 0; i < files.length; i += 8) await Promise.all(files.slice(i, i + 8).map(up));
  console.log('uploaded', files.length);
  const patch = (q, body) => fetch(`${BASE}/rest/v1/${q}`, { method: 'PATCH', headers: { ...H, 'Content-Type': 'application/json', Prefer: 'return=minimal' }, body: JSON.stringify(body) });
  let r = await patch('stores?id=eq.119', { image: pub('cover.jpg'), cover_image: pub('cover.jpg'), logo_image: pub('logo.jpg') });
  console.log('store', r.status);
  const ps = files.filter(f => /^p\d+\.jpg$/.test(f));
  for (let i = 0; i < ps.length; i += 10) await Promise.all(ps.slice(i, i + 10).map(async f => {
    const n = parseInt(f.slice(1)); const rr = await patch(`products?id=eq.${1990000 + n}`, { image: pub(f) }); if (!rr.ok) throw new Error(f + rr.status);
  }));
  console.log('products repointed', ps.length);
})().catch(e => { console.error(e); process.exit(1); });
