import fs from 'fs';

const ENTITY = '166';
const BASE = `https://trybany.com/api/v1/entities/${ENTITY}`;
const HEADERS = { 'Accept': 'application/json', 'Accept-Language': 'ar', 'User-Agent': 'Mozilla/5.0' };

const ent = await (await fetch(BASE, { headers: HEADERS })).json();
const cats = ent.categories;
console.log('categories:', cats.length);

const out = [];
for (const c of cats) {
  const url = `${BASE}/categories/${c.idString}/products`;
  const j = await (await fetch(url, { headers: HEADERS })).json();
  const prods = j.products || [];
  console.log(c.title.trim(), '->', prods.length, '(expected', c.productsCount + ')');
  for (const p of prods) {
    out.push({
      sourceId: p.idString,
      name: p.title.trim(),
      category: c.title.trim(),
      price: p.price?.raw ?? 0,
      oldPrice: p.oldPrice?.raw ?? null,
      description: (p.description || '').trim(),
      available: p.isActive && !p.isOutOfStockTemporarily && !p.isNotAvailableSeasonally,
      cover: p.media?.cover || null,
      coverSmall: p.media?.coverSmall || null,
    });
  }
}

fs.writeFileSync('orange-raw.json', JSON.stringify({ entity: ent.entity, categories: cats.map(c => ({ idString: c.idString, title: c.title.trim(), count: c.productsCount })), products: out }, null, 1));
console.log('TOTAL products:', out.length);
console.log('with image:', out.filter(p => p.cover).length, '| with price:', out.filter(p => p.price > 0).length);
