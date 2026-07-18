const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SRC = 'C:\\Users\\Hp\\AppData\\Local\\Temp\\claude\\C--projects-New-Dukkanci\\b160aa5b-2d2b-4a3d-b354-7a26972c6315\\scratchpad\\shamoglu';
const DEST = path.join(__dirname, '..', 'assets', 'photos', 'shamoglu');

if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

// [name, price, category, srcFile]
const products = [
  ['فتة دجاج', 346, 'فتة و فول', 'fatteh_0.jpg'],
  ['فتة ب لحم الغنم', 265, 'فتة و فول', 'fatteh_1.jpg'],
  ['فتة بالسمنة', 204, 'فتة و فول', 'fatteh_2.jpg'],
  ['فتة بالسمنة و الصنوبر', 246, 'فتة و فول', 'fatteh_3.jpg'],
  ['تسقية بالسمنة والمكسرات', 245, 'فتة و فول', 'fatteh_4.jpg'],
  ['فول مقلي', 400, 'فتة و فول', 'fatteh_5.jpg'],
  ['فتة بزيت الزيتون', 204, 'فتة و فول', 'fatteh_6.jpg'],
  ['كبة مقلية عدد4', 650, 'الكبة', 'kibbeh_0.jpg'],
  ['كبة عالسيخ', 650, 'الكبة', 'kibbeh_1.jpg'],
  ['كبة نية', 450, 'الكبة', 'kibbeh_2.jpg'],
  ['بطاطا حارّة', 275, 'المقبلات الساخنة', 'hotapp_0.jpg'],
  ['صحن برغل بالبندورة', 150, 'المقبلات الساخنة', 'hotapp_1.jpg'],
  ['صحن فلافل (10 أقراص)', 100, 'المقبلات الساخنة', 'hotapp_2.jpg'],
  ['برك جبنة عدد4', 280, 'المقبلات الساخنة', 'hotapp_3.jpg'],
  ['برك سبانخ عدد4', 350, 'المقبلات الساخنة', 'hotapp_4.jpg'],
  ['بطاطا مقلية', 225, 'المقبلات الساخنة', 'hotapp_5.jpg'],
  ['برك لحمة عدد4', 470, 'المقبلات الساخنة', 'hotapp_6.jpg'],
  ['بطاطا بالكزبرة والثوم', 285, 'المقبلات الساخنة', 'hotapp_8.jpg'],
  ['صحن حمص بالطحينة', 210, 'المقبلات الباردة', 'coldapp_0.jpg'],
  ['متبل بيتنجان', 265, 'المقبلات الباردة', 'coldapp_1.jpg'],
  ['حمص بدبس الرمان', 265, 'المقبلات الباردة', 'coldapp_2.jpg'],
  ['حمص بالجوز', 265, 'المقبلات الباردة', 'coldapp_3.jpg'],
  ['مكدوس', 199, 'المقبلات الباردة', 'coldapp_4.jpg'],
  ['صحن بابا غنوج', 265, 'المقبلات الباردة', 'coldapp_5.jpg'],
  ['حراق أصبعو', 350, 'المقبلات الباردة', 'coldapp_7.jpg'],
  ['بابا غنوج', 265, 'المقبلات الباردة', 'coldapp_8.jpg'],
  ['سلطة خضار', 199, 'السلطات', 'salad_0.jpg'],
  ['تبولة', 182, 'السلطات', 'salad_1.jpg'],
  ['سلطة سيزر', 240, 'السلطات', 'salad_2.jpg'],
  ['فتوش', 182, 'السلطات', 'salad_3.jpg'],
  ['جرجير', 208, 'السلطات', 'salad_4.jpg'],
  ['سلطة الشمندر', 210, 'السلطات', 'salad_5.jpg'],
  ['متبل الشمندر', 265, 'السلطات', 'newitem_متبلالشمندر.jpg'],
  ['سبانخ بالزيت', 475, 'السلطات', 'newitem_سبانخبالزيت.jpg'],
  ['شوربة عدس', 106, 'الشوربات', 'soup_0.jpg'],
  ['شوربة كريمة الفطر', 157, 'الشوربات', 'soup_1.jpg'],
  ['شوربة كريمة الذرة', 157, 'الشوربات', 'soup_2.jpg'],
  ['شوربة كريمة الدجاج', 157, 'الشوربات', 'soup_3.jpg'],
  ['ريش كستاليتا', 612, 'المشاوي', 'grill_0.jpg'],
  ['كباب خشخاش (غنم)', 535, 'المشاوي', 'grill_1.jpg'],
  ['شقف غنم (تكا لحم)', 612, 'المشاوي', 'grill_2.jpg'],
  ['وجبة مشاوي مشكلة 300غ', 615, 'المشاوي', 'grill_3.jpg'],
  ['شيش طاووق (تكا دجاج)', 415, 'المشاوي', 'grill_4.jpg'],
  ['دجاج مشوي على الفحم', 415, 'المشاوي', 'grill_5.jpg'],
  ['كباب غنم', 525, 'المشاوي', 'grill_6.jpg'],
  ['كباب غنم بالفستق الحلبي', 535, 'المشاوي', 'grill_7.jpg'],
  ['فاهيتا', 395, 'الوجبات الغربية', 'western_0.jpg'],
  ['مكسيكانو', 395, 'الوجبات الغربية', 'western_1.jpg'],
  ['كوردون بلو', 442, 'الوجبات الغربية', 'western_2.jpg'],
  ['زينجر', 369, 'الوجبات الغربية', 'western_4.jpg'],
  ['كريسبي', 395, 'الوجبات الغربية', 'western_5.jpg'],
  ['تشكن الاكيف', 442, 'الوجبات الغربية', 'western_6.jpg'],
  ['اسكالوب ميلانيز', 395, 'الوجبات الغربية', 'western_7.jpg'],
  ['سندويش شيش طاووق', 175, 'الصندويش', 'sandwich_0.jpg'],
  ['سندويش سكالوب', 175, 'الصندويش', 'sandwich_1.jpg'],
  ['سندويش كباب غنم', 195, 'الصندويش', 'sandwich_2.jpg'],
  ['فخارة شرحات غنم مطفاية', 500, 'الفخارات', 'claypot_0.jpg'],
  ['كباب هندي', 501, 'الفخارات', 'claypot_1.jpg'],
  ['كباب بالصينية', 500, 'الفخارات', 'claypot_2.jpg'],
  ['فخارة شرحات دجاج', 416, 'الفخارات', 'claypot_3.jpg'],
  ['فخارة شيش طاووق بالبشاميل', 416, 'الفخارات', 'claypot_6.jpg'],
  ['بيتزا مرغريتا', 263, 'بيتزا', 'pizza_0.jpg'],
  ['بيتزا سجق', 314, 'بيتزا', 'pizza_1.jpg'],
  ['بيتزا دجاج', 284, 'بيتزا', 'pizza_2.jpg'],
  ['بيتزا فطر', 285, 'بيتزا', 'pizza_3.jpg'],
  ['بيتزا خضار', 272, 'بيتزا', 'pizza_4.jpg'],
  ['فطيرة شيش و قشقوان', 55, 'فطائر', 'fatayer_v2_0.jpg'],
  ['فطيرة بيتزا', 48, 'فطائر', 'fatayer_v2_1.jpg'],
  ['فطيرة جبنة قشقوان', 55, 'فطائر', 'fatayer_v2_2.jpg'],
  ['فطيرة لبنة', 47, 'فطائر', 'fatayer_v2_3.jpg'],
  ['فطيرة زعتر', 38, 'فطائر', 'fatayer_v2_4.jpg'],
  ['فطيرة محمرة', 47, 'فطائر', 'fatayer_v2_5.jpg'],
  ['فطيرة سبانخ', 55, 'فطائر', 'fatayer_v2_6.jpg'],
  ['فطيرة سجق', 80, 'فطائر', 'fatayer_v2_7.jpg'],
  ['فطيرة محمرة و قشقوان', 55, 'فطائر', 'fatayer_v2_8.jpg'],
  ['فطيرة جبنة شامية', 55, 'فطائر', 'fatayer_v2_9.jpg'],
  ['فطيرة زعتر و قشقوان', 47, 'فطائر', 'fatayer_v2_10.jpg'],
  ['منقوشة محمرة مع قشقوان', 135, 'مناقيش', 'manakish_0.jpg'],
  ['منقوشة لبنة وخضار', 135, 'مناقيش', 'manakish_1.jpg'],
  ['منقوشة شاورما', 145, 'مناقيش', 'manakish_2.jpg'],
  ['منقوشة سجق مع قشقوان وجرجير', 154, 'مناقيش', 'manakish_3.jpg'],
  ['منقوشة قشقوان', 157, 'مناقيش', 'manakish_4.jpg'],
  ['منقوشة زعتر وسلطة', 135, 'مناقيش', 'manakish_5.jpg'],
  ['مشروب غازي 1 ليتر', 65, 'المشروبات', 'drinks2_0.jpg'],
  ['عصير برتقال', 175, 'المشروبات', 'drinks2_1.jpg'],
  ['فريز', 175, 'المشروبات', 'drinks2_2.jpg'],
  ['ليمون ونعناع', 175, 'المشروبات', 'drinks2_3.jpg'],
];

console.log('Total products:', products.length);

async function run() {
  for (let i = 0; i < products.length; i++) {
    const [name, price, cat, srcFile] = products[i];
    const srcPath = path.join(SRC, srcFile);
    const outPath = path.join(DEST, `p${i + 1}.jpg`);
    if (!fs.existsSync(srcPath)) {
      console.error('MISSING SOURCE:', srcFile);
      continue;
    }
    await sharp(srcPath)
      .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(outPath);
  }
  console.log('Products processed.');

  await sharp(path.join(SRC, 'store_logo2.jpg'))
    .resize(400, 400, { fit: 'cover' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DEST, 'logo.jpg'));
  console.log('Logo processed.');

  await sharp(path.join(SRC, 'store_cover2.jpg'))
    .resize(1280, 542, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DEST, 'cover.jpg'));
  console.log('Cover processed.');

  const files = fs.readdirSync(DEST);
  console.log('Total files in dest:', files.length);

  fs.writeFileSync(path.join(__dirname, 'shamoglu-products.json'), JSON.stringify(products, null, 2));
}

run().catch(e => { console.error(e); process.exit(1); });
