// One-off: build the Ghasaq Market product list from the merchant's Shopify feed
// (gasakmarket.com/products.json, saved as shop.json) and resize images.
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const sharp = require('sharp');
const SRC = process.argv[2];
const OUT = path.join(__dirname, '..', 'assets', 'photos', 'ghasaq');
const shop = JSON.parse(fs.readFileSync(SRC, 'utf8'));

const clean = s => s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/\/{2,}/g, '/').replace(/عرض خاص/g, '').replace(/[\s\u00a0]+/g, ' ').replace(/^[\s/]+|[\s/]+$/g, '').trim();

const OVERRIDE = [
  [/^(فانيلا|خميرة)/, 'توابل وبهارات وعطارة'],
  [/^شوربة دجاج/, 'المعكرونة والاندومي'],
  [/^عيران/, 'الألبان والبيض'],
  [/قرفة|ملونات|مستكة/, 'توابل وبهارات وعطارة'],
  [/بابونج|زهورات|ميرمية|قهوة|(^|[\s/])بن[\s/]|متة|ميلون/, 'مشروبات ساخنة'],
  [/كب كيك/, 'مخبوزات'],
  [/تمر/, 'تمور ومكسرات'],
  [/عسل|دونات|شوكلا/, 'حلويات وعسل'],
  [/حليب مكثف/, 'الألبان والبيض'],
  [/كرمنتينا|شبت/, 'الخضار والفواكه'],
  [/مخلل|شطة/, 'معلبات وكونسروة'],
  [/سمنة/, 'سمنة وزيوت'],
  [/^لبن/, 'الألبان والبيض'],
  [/^ماء/, 'مشروبات ومياه'],
  [/فلافل حنيف/, 'معلبات وكونسروة'],
];
const COLMAP = {
  'المشروبات الساخنة': 'مشروبات ساخنة', 'البيض و مشتقات الحليب': 'الألبان والبيض',
  'توابل  بهارات و العطارة': 'توابل وبهارات وعطارة', 'الخبز/الصمون/الكعك/المعجنات': 'مخبوزات',
  'منظفات و مواد تنظيف': 'منظفات', 'الاندومي و المعكرونة': 'المعكرونة والاندومي',
  'الخضار و الفواكه': 'الخضار والفواكه', 'بقوليات و الأرز': 'بقوليات وأرز',
  'الخضار المجمدة و الفواكه': 'خضار وفواكه مجمدة', 'مشروبات غازية و طاقة': 'مشروبات ومياه',
  'دجاج': 'دجاج', 'معلبات و الكونسروة': 'معلبات وكونسروة',
};
function category(x) {
  for (const [re, c] of OVERRIDE) if (re.test(x.title)) return c;
  if (x.cols.length) return COLMAP[x.cols[0]] || x.cols[0];
  return 'منتجات أخرى';
}

let rows = shop.filter(x => x.avail && +x.price > 0 && x.imgs.length);
const byTitle = {};
rows.forEach(x => (byTitle[x.title] = byTitle[x.title] || []).push(x));
rows = rows.map(x => {
  let name = clean(x.title);
  const line = clean((x.body || '').split(/\n|  /)[0] || '');
  const grp = byTitle[x.title];
  if (grp.length > 1 && line) name = clean(name + ' ' + line);
  if (x.title === 'ليوس سمك تونا 160غرام') name += x.id === shop.filter(y => y.title === x.title)[0].id ? ' (علبة حمراء)' : ' (علبة صفراء)';
  const desc = line && !(grp.length > 1) ? line.slice(0, 160) : '';
  return { name, price: Math.round(+x.price * 100) / 100, oldPrice: x.cmp && +x.cmp > +x.price ? +x.cmp : null, category: category(x), description: desc, img: x.imgs[0], handle: x.handle };
});

(async () => {
  const seenPath = new Set(), out = [];
  let i = 0;
  for (const r of rows) {
    const buf = Buffer.from(await (await fetch(r.img.replace(/\?.*$/, '') + '?width=1000')).arrayBuffer());
    const md5 = crypto.createHash('md5').update(buf).digest('hex');
    i++;
    await sharp(buf).rotate().resize(800, 800, { fit: 'inside', withoutEnlargement: true }).flatten({ background: '#ffffff' }).jpeg({ quality: 82, mozjpeg: true }).toFile(path.join(OUT, `p${i}.jpg`));
    out.push({ ...r, file: `p${i}.jpg`, md5 });
    if (i % 40 === 0) console.log('done', i);
  }
  fs.writeFileSync(process.argv[3], JSON.stringify(out));
  console.log('total', out.length);
})().catch(e => { console.error(e); process.exit(1); });
