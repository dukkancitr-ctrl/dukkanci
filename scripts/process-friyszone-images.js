const sharp = require('sharp');
const path = require('path');

const SRC = 'C:/Users/Hp/Downloads';
const DEST = 'C:/projects/New Dukkanci/assets/photos/friyszone';

const products = [
  ['fz_01_jumbo_fries_zone_450g.jpg', 'p01'],
  ['fz_02_chicken_crispy_3pc.jpg', 'p02'],
  ['fz_03_fries_zone_extreme_300g.jpg', 'p03'],
  ['fz_32_chicken_crispy_5pc.jpg', 'p04'],
  ['fz_31_brosted_4pc.jpg', 'p05'],
  ['fz_28_sweet_crispy_chicken_rice.jpg', 'p06'],
  ['fz_29_piri_chicken_rice.jpg', 'p07'],
  ['fz_35_baget_tavuk_4pc.jpg', 'p08'],
  ['fz_38_chicken_wings_6pc.jpg', 'p09'],
  ['fz_04_fajita_chicken_sandwich.jpg', 'p10'],
  ['fz_05_double_korean_chicken_burger.jpg', 'p11'],
  ['fz_06_korean_chicken_burger.jpg', 'p12'],
  ['fz_22_buffalo_chicken_burger.jpg', 'p13'],
  ['fz_23_double_buffalo_chicken_burger.jpg', 'p14'],
  ['fz_24_mexican_chicken_sandwich.jpg', 'p15'],
  ['fz_25_double_original_chicken_burger.jpg', 'p16'],
  ['fz_26_original_chicken_burger.jpg', 'p17'],
  ['fz_27_chicken_crispy_sandwich.jpg', 'p18'],
  ['fz_30_crispy_roll.jpg', 'p19'],
  ['fz_07_french_fries.jpg', 'p20'],
  ['fz_08_potato_wedges.jpg', 'p21'],
  ['fz_09_potato_wedges_special.jpg', 'p22'],
  ['fz_18_onion_rings_10pc_.jpg', 'p23'],
  ['fz_19_onion_rings_6pc_.jpg', 'p24'],
  ['fz_20_chips_in_bag.jpg', 'p25'],
  ['fz_21_french_fries_special.jpg', 'p26'],
  ['fz_37_chips_sandwich.jpg', 'p27'],
  ['fz_36_coleslaw.jpg', 'p28'],
  ['fz_33_favorite_sauce.jpg', 'p29'],
  ['fz_10_mango_suyu.jpg', 'p30'],
  ['fz_11_cz_special.jpg', 'p31'],
  ['fz_34_koktail_suyu_.jpg', 'p32'],
  ['fz_16_offer_1.jpg', 'p33'],
  ['fz_13_offer_2.jpg', 'p34'],
  ['fz_14_offer_3.jpg', 'p35'],
  ['fz_15_offer_4.jpg', 'p36'],
  ['fz_12_offer_5.jpg', 'p37'],
  ['fz_17_offer_6.jpg', 'p38'],
];

(async () => {
  for (const [srcFile, outName] of products) {
    await sharp(path.join(SRC, srcFile))
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(DEST, `${outName}.jpg`));
    console.log('product', outName, 'done');
  }
  await sharp(path.join(SRC, 'fz_logo.jpg'))
    .resize(400, 400, { fit: 'inside' })
    .png()
    .toFile(path.join(DEST, 'logo.png'));
  console.log('logo done');
  await sharp(path.join(SRC, 'fz_03_fries_zone_extreme_300g.jpg'))
    .resize(1280, 720, { fit: 'inside' })
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(path.join(DEST, 'cover.jpg'));
  console.log('cover done');
})().catch(e => { console.error(e); process.exit(1); });
