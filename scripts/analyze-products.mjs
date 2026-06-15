const U = 'https://tzcqnqzltrjemdnkzpzn.supabase.co/rest/v1';
const K = 'sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc';
const H = { apikey: K, Authorization: 'Bearer ' + K };

// fetch all products + stores
async function all(table, sel) {
  let out = [], from = 0;
  for (;;) {
    const r = await fetch(`${U}/${table}?select=${sel}&order=id&id=gt.-1&limit=1000&offset=${from}`, { headers: H });
    const d = await r.json();
    out = out.concat(d);
    if (d.length < 1000) break;
    from += 1000;
  }
  return out;
}

const stores = await all('stores', 'id,name');
const prods = await all('products', 'id,store_id,name,image,available');
const storeName = Object.fromEntries(stores.map(s => [s.id, s.name]));
console.log('TOTAL products:', prods.length, '| stores:', stores.length);

const isPlaceholder = img => !img || /placeholder|generic-cover/i.test(img);
// PER-STORE duplicate detection: an image reused by >=2 products WITHIN THE SAME store
// is a placeholder/fallback. The same product photo across brand branches is NOT a dup.
const imgCount = {};
for (const p of prods) { const k = (p.image || '').trim(); if (k) { const key = p.store_id + '|' + k; imgCount[key] = (imgCount[key] || 0) + 1; } }
const dupKey = p => p.store_id + '|' + (p.image || '').trim();

let nUnavail = 0, nNoImg = 0, nDup = 0, nAny = 0;
const perStore = {};
for (const p of prods) {
  const img = (p.image || '').trim();
  const unavail = p.available === false;
  const noImg = isPlaceholder(img);
  const dup = img && imgCount[dupKey(p)] >= 2;
  if (unavail) nUnavail++;
  if (noImg) nNoImg++;
  if (dup) nDup++;
  if (unavail || noImg || dup) {
    nAny++;
    const k = storeName[p.store_id] || ('store ' + p.store_id);
    perStore[k] = perStore[k] || { total: 0, unavail: 0, noImg: 0, dup: 0, drop: 0 };
  }
}
for (const p of prods) {
  const k = storeName[p.store_id] || ('store ' + p.store_id);
  perStore[k] = perStore[k] || { total: 0, unavail: 0, noImg: 0, dup: 0, drop: 0 };
  perStore[k].total++;
  const img = (p.image || '').trim();
  const unavail = p.available === false;
  const noImg = isPlaceholder(img);
  const dup = img && imgCount[dupKey(p)] >= 2;
  if (unavail) perStore[k].unavail++;
  if (noImg) perStore[k].noImg++;
  if (dup) perStore[k].dup++;
  if (unavail || noImg || dup) perStore[k].drop++;
}

console.log('\n=== GLOBAL ===');
console.log('unavailable:', nUnavail, '| no-image/placeholder:', nNoImg, '| duplicate-image:', nDup);
console.log('would DROP (any rule):', nAny, `(${(nAny/prods.length*100).toFixed(1)}%) -> keep ${prods.length - nAny}`);

console.log('\n=== PER STORE (only stores with drops) ===');
const rows = Object.entries(perStore).filter(([, v]) => v.drop > 0).sort((a, b) => b[1].drop - a[1].drop);
for (const [name, v] of rows) {
  console.log(`${v.drop.toString().padStart(4)}/${v.total.toString().padEnd(4)} drop  (unavail ${v.unavail}, noImg ${v.noImg}, dup ${v.dup})  ${name}`);
}

// sample duplicate images (top shared)
console.log('\n=== TOP shared images (count) ===');
Object.entries(imgCount).filter(([, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 12)
  .forEach(([img, c]) => console.log(c, img.slice(-55)));
