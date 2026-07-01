// Export every product name in Dukkanci to files, for the AI-synonyms workflow.
// Reads the live catalog from Supabase (public catalog, anon key) and writes:
//   exports/dukkanci-products-full.csv   — id, store, category, name, unit, price, available, slug
//   exports/dukkanci-product-names.txt   — distinct product names, one per line
//   exports/dukkanci-product-names.json  — [{ name, count, stores, categories }]  (grouped, ready for synonym generation)
// Run: node scripts/export-product-names.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'exports');
const URL = 'https://tzcqnqzltrjemdnkzpzn.supabase.co';
const KEY = 'sb_publishable_pqIMANpqqnXLYeR7Pvdvcw_a3cLK1Uc';

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };

async function fetchAll(table, select) {
  const rows = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const to = from + PAGE - 1;
    const res = await fetch(`${URL}/rest/v1/${table}?select=${select}&order=id.asc`, {
      headers: { ...headers, Range: `${from}-${to}`, 'Range-Unit': 'items' }
    });
    if (!res.ok) throw new Error(`${table} ${res.status}: ${await res.text()}`);
    const batch = await res.json();
    rows.push(...batch);
    if (batch.length < PAGE) break;
  }
  return rows;
}

const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

(async () => {
  console.log('Fetching stores…');
  const stores = await fetchAll('stores', 'id,name');
  const storeName = new Map(stores.map(s => [s.id, s.name]));

  console.log('Fetching products…');
  const products = await fetchAll('products', 'id,store_id,name,unit,price,category,available,slug');
  console.log(`  ${products.length} products from ${stores.length} stores`);

  fs.mkdirSync(OUT, { recursive: true });

  // 1) Full CSV (BOM so Excel opens Arabic correctly)
  const head = ['id', 'store_id', 'store_name', 'category', 'name', 'unit', 'price', 'available', 'slug'];
  const lines = [head.join(',')];
  for (const p of products) {
    lines.push([
      p.id, p.store_id, storeName.get(p.store_id) || '', p.category || '',
      p.name || '', p.unit || '', p.price ?? '', p.available === false ? '0' : '1', p.slug || ''
    ].map(csvCell).join(','));
  }
  fs.writeFileSync(path.join(OUT, 'dukkanci-products-full.csv'), '﻿' + lines.join('\r\n'), 'utf8');

  // 2) Distinct names grouped (by exact trimmed name)
  const groups = new Map();
  for (const p of products) {
    const name = (p.name || '').trim();
    if (!name) continue;
    if (!groups.has(name)) groups.set(name, { name, count: 0, stores: new Set(), categories: new Set() });
    const g = groups.get(name);
    g.count++;
    g.stores.add(storeName.get(p.store_id) || p.store_id);
    if (p.category) g.categories.add(p.category);
  }
  const grouped = [...groups.values()]
    .map(g => ({ name: g.name, count: g.count, stores: [...g.stores], categories: [...g.categories] }))
    .sort((a, b) => a.name.localeCompare(b.name, 'ar'));

  // 3) Plain distinct names, one per line (best input for a synonym generator)
  fs.writeFileSync(path.join(OUT, 'dukkanci-product-names.txt'),
    '﻿' + grouped.map(g => g.name).join('\r\n'), 'utf8');
  fs.writeFileSync(path.join(OUT, 'dukkanci-product-names.json'),
    JSON.stringify(grouped, null, 2), 'utf8');

  console.log(`\nDone → exports/`);
  console.log(`  dukkanci-products-full.csv      ${products.length} rows`);
  console.log(`  dukkanci-product-names.txt      ${grouped.length} distinct names`);
  console.log(`  dukkanci-product-names.json     ${grouped.length} grouped entries`);
})().catch(e => { console.error(e); process.exit(1); });
