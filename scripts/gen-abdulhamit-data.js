const fs = require('fs');

// Raw items extracted from https://amenu.net/restaurant363 (DOM order), with Arabic name
// picked from the source's own bilingual "Turkish اسم عربي" label, and Arabic descriptions
// translated faithfully from the Turkish source description (or kept as-is where the source
// description was already Arabic).
const items = [
  { cat: "الوجبات", name: "بروستد", desc: "نصف دجاجة مقرمشة بالبقسماط بطريقة خاصة، تُقدَّم مع البطاطا المقلية وسلطة كول سلو ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5635/conversions/6281178dd9997_B3AE9A52-FED1-4E02-B446-C3A0560236A1-first.webp" },
  { cat: "الوجبات", name: "فروج مشوي كامل", desc: "", price: 500, srcImg: "https://amenu.net/storage/Item/image/17334/conversions/69628062e4a75_2%D9%81%D8%B1%D9%88%D8%AC-%D9%85%D8%B4%D9%88%D9%8A-first.webp" },
  { cat: "الوجبات", name: "جناحات", desc: "6 قطع أجنحة دجاج مقرمشة بالبقسماط، تُقدَّم مع البطاطا المقلية وسلطة كول سلو ومايونيز بالثوم", price: 430, srcImg: "https://amenu.net/storage/Item/image/5656/conversions/634577ee5e694_C615EFB0-296B-44FA-B6CC-E106292E1371-first.webp" },
  { cat: "الوجبات", name: "كرانشي", desc: "أربع قطع دجاج طرية مقرمشة بالبقسماط مغطاة بجبنة موزاريلا ذائبة، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5639/conversions/61992dfabaa44_%D9%83%D8%B1%D8%A7%D9%86%D8%B4%D9%8A-first.webp" },
  { cat: "الوجبات", name: "شيش طاووق", desc: "قطع صدر دجاج متبلة ومشوية على الشواية، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5641/conversions/626fb19f0051b_23368BD6-B1EC-4B73-8357-C8BF79EE6DC2-first.webp" },
  { cat: "الوجبات", name: "وجبة مشوي (نصف دجاجة)", desc: "دجاج مشوي على الشواية، الوجبة نصف دجاجة (الغاز)", price: 270, srcImg: "https://amenu.net/storage/Item/image/5650/conversions/626fb4a2431cf_053EC81A-10F9-42D1-87B9-ACD005345648-first.webp" },
  { cat: "الوجبات", name: "فاهيتا", desc: "قطع صدر دجاج مشوية على الشواية مع فلفل أخضر وأحمر وفطر وصوص الصويا الياباني والبصل وجبنة الموزاريلا", price: 400, srcImg: "https://amenu.net/storage/Item/image/5642/conversions/626fb1f675ae0_482538AE-1CD6-4BD9-8027-13A2272DAAE5-first.webp" },
  { cat: "السلطات", name: "سلطة ذرة", desc: "", price: 150, srcImg: "https://amenu.net/storage/Item/image/5672/conversions/6371386023dae_%D8%B3%D9%84%D8%B7%D8%A9-%D8%B0%D8%B1%D8%A9-2-first.webp" },
  { cat: "السلطات", name: "سلطة خضراء", desc: "", price: 150, srcImg: "https://amenu.net/storage/Item/image/13424/conversions/649d8e953a301_%D8%B3%D9%84%D8%B7%D8%A9-%D8%AE%D8%B6%D8%B1%D8%A7-first.webp" },
  { cat: "المشروبات", name: "آيس كوفي", desc: "", price: 40, srcImg: "https://amenu.net/storage/Item/image/16969/conversions/672661db7b1f8_coffee-2-first.webp" },
  { cat: "السندويش", name: "سندويش دجاج إيطالي", desc: "ساندويش باغيت بقطع دجاج مشوية على الشواية مع ذرة وفطر وصوص الصويا وبهارات إيطالية وجبنة موزاريلا", price: 210, srcImg: "https://amenu.net/storage/Item/image/5668/conversions/6281571c376cd_B17167F5-3645-4B31-A7FA-A5F57359B3A5-first.webp" },
  { cat: "الوجبات", name: "وجبة فخذ وورك", desc: "قطعتا فخذ وقطعتا وِرك دجاج مقرمشة بالبقسماط، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 420, srcImg: "https://amenu.net/storage/Item/image/5653/conversions/628152782d409_76E97EBE-A333-4735-AE79-7FCEBFF710E4-first.webp" },
  { cat: "السندويش", name: "سندويش شيش طاووق", desc: "ساندويش باغيت بقطع صدر دجاج متبلة ومشوية على الشواية، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 200, srcImg: "https://amenu.net/storage/Item/image/5662/conversions/637138a4d8cd8_%D8%B4%D9%8A%D8%B4-%D8%B1%D9%88%D8%B2%D9%8A%D9%81-first.webp" },
  { cat: "السندويش", name: "سندويش فرانشيسكو", desc: "ساندويش باغيت بقطع دجاج مشوية مع ذرة وفطر وصوص الصويا وجبنة موزاريلا ومايونيز", price: 210, srcImg: "https://amenu.net/storage/Item/image/5667/conversions/628156fb24810_379D4276-AFFF-472A-AD65-F535D4204814-first.webp" },
  { cat: "السندويش", name: "سندويشة كرسبي", desc: "ساندويش باغيت بقطعتي دجاج طرية مقرمشة بالبقسماط، مع سلطة كول سلو وبطاطا مقلية ومايونيز بالثوم", price: 200, srcImg: "https://amenu.net/storage/Item/image/5657/conversions/6281538078efb_D3C4862C-6477-4EED-B943-346F84A36BE7-first.webp" },
  { cat: "السندويش", name: "سندويشة زنجر", desc: "ساندويش باغيت بقطعتي دجاج طرية مقرمشة بالبقسماط مع شرائح سلامي، وكول سلو وبطاطا مقلية ومايونيز بالثوم وجبنة موزاريلا", price: 210, srcImg: "https://amenu.net/storage/Item/image/5658/conversions/628154101019f_40E411FC-3581-4227-ADC8-724C3D61C512-first.webp" },
  { cat: "السندويش", name: "سندويش فاهيتا", desc: "ساندويش باغيت بقطع صدر دجاج مشوية مع فلفل أخضر وأحمر وفطر وصوص الصويا الياباني والبصل وجبنة الموزاريلا", price: 210, srcImg: "https://amenu.net/storage/Item/image/5665/conversions/6281569553974_AA221981-45CB-4585-BDD5-D525775476FF-first.webp" },
  { cat: "الوجبات", name: "دجاج بالفرن (مسحب)", desc: "دجاج مشوي بالفرن مع البطاطا والصوص", price: 340, srcImg: "https://amenu.net/storage/Item/image/5651/conversions/626fb4d1ebcf0_4D32AC7E-4E4F-4AD5-921B-853A6C36F985-first.webp" },
  { cat: "الوجبات", name: "مكسيكي", desc: "قطع صدر دجاج طرية مشوية بصوص الفلفل الأحمر الحار، مع فلفل أخضر وأحمر حلو وفطر وبصل وكول سلو، تُقدَّم مع بطاطا مقلية ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5643/conversions/62814778e5c2e_FB3123C4-6F77-4A8B-B9D4-C36964087C00-first.webp" },
  { cat: "الوجبات", name: "سوبريم", desc: "رول دجاج مقلي", price: 385, srcImg: "https://amenu.net/storage/Item/image/5640/conversions/628146026a290_2C02C708-BAC1-4F47-9FB6-397B46A9D092-first.webp" },
  { cat: "الوجبات", name: "وجبة دجاج باربكيو", desc: "قطع دجاج مشوية بصوص الباربكيو مع فلفل أحمر وأخضر وبصل وفطر، تُقدَّم مع بطاطا مقلية", price: 400, srcImg: "https://amenu.net/storage/Item/image/16831/conversions/66ddaecc9f8ea_barbkio-first.webp" },
  { cat: "الوجبات", name: "فرانشيسكو", desc: "قطع دجاج مشوية مع ذرة وفطر وصوص الصويا وجبنة موزاريلا، تُقدَّم مع بطاطا مقلية", price: 400, srcImg: "https://amenu.net/storage/Item/image/5646/conversions/62814f6e207ca_213EA074-A82A-4E75-8992-51C480918263-first.webp" },
  { cat: "المقبلات", name: "صحن حمص", desc: "", price: 100, srcImg: "https://amenu.net/storage/Item/image/14371/conversions/653294183cba2_%D9%85%D8%B3%D8%A8%D8%AD%D8%A9-first.webp" },
  { cat: "السلطات", name: "سلطة كول سلو", desc: "", price: 125, srcImg: "https://amenu.net/storage/Item/image/5670/conversions/6371381a5d65e_%D9%83%D9%88%D9%84-%D8%B3%D9%84%D9%88-first.webp" },
  { cat: "المشروبات", name: "كولا 330", desc: "", price: 50, srcImg: "https://amenu.net/storage/Item/image/16832/conversions/66ddbd667e87e_turka-330-first.webp" },
  { cat: "السندويش", name: "سندويش ماغنوم", desc: "ساندويش باغيت بقطع دجاج مشوية مع فلفل أحمر وأخضر وفطر وذرة وبصل وشرائح سلامي وكول سلو ومايونيز بالثوم وجبنة موزاريلا", price: 210, srcImg: "https://amenu.net/storage/Item/image/5666/conversions/628156c6ccaa5_5072D8E8-EE0C-4891-A3EC-EC5332CC1268-first.webp" },
  { cat: "السندويش", name: "سندويشة كرانشي", desc: "ساندويش باغيت بقطعتي دجاج طرية مقرمشة بالبقسماط، مع كول سلو وبطاطا مقلية ومايونيز بالثوم وجبنة موزاريلا", price: 210, srcImg: "https://amenu.net/storage/Item/image/5660/conversions/628154bee8e75_8F92852F-A7C2-45C8-B99A-1FF79F0729CD-first.webp" },
  { cat: "الوجبات", name: "كرسبي", desc: "أربع قطع دجاج طرية مقرمشة بالبقسماط، تُقدَّم مع بطاطا مقلية وكول سلو ومايونيز بالثوم وساندويش باغيت", price: 390, srcImg: "https://amenu.net/storage/Item/image/5636/conversions/6281174b9f083_5C2844DA-A93F-453B-9A35-0A867363140D-first.webp" },
  { cat: "الوجبات", name: "سكالوب", desc: "أربع قطع صدر دجاج طرية متبلة ومقرمشة بالبقسماط الناعم، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 390, srcImg: "https://amenu.net/storage/Item/image/5637/conversions/628117b1a9874_99482449-4D40-4587-89F5-578DD72B8224-first.webp" },
  { cat: "الوجبات", name: "كوردون بلو", desc: "صدر الدجاج المقلي المحشي بقطع الفطر والجبن والسلام مع صوص البشاميل", price: 420, srcImg: "https://amenu.net/storage/Item/image/5654/conversions/628158e6f15ee_B9FC9416-4A09-4C84-95D8-1E0EA5BF4FAB-first.webp" },
  { cat: "الوجبات", name: "ماغنوم", desc: "قطع دجاج مشوية مع فلفل أحمر وأخضر وفطر وذرة وبصل وشرائح سلامي وجبنة موزاريلا وكول سلو، تُقدَّم مع بطاطا مقلية ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5648/conversions/6354289886fd5_74A4C7BA-F68F-42AA-AC1C-64CD451BF0CD-first.webp" },
  { cat: "الوجبات", name: "دجاج إيطالي", desc: "قطع دجاج مشوية مع ذرة وفطر وصوص الصويا وبهارات إيطالية وجبنة موزاريلا، تُقدَّم مع بطاطا مقلية", price: 400, srcImg: "https://amenu.net/storage/Item/image/5645/conversions/6354222704ef8_4E6A5511-C810-4166-843D-043A9E07004C-first.webp" },
  { cat: "السندويش", name: "سندويشة سنتافيا", desc: "ساندويش باغيت بشريحتي دجاج مغطاتين بالبقسماط، مع كول سلو وبطاطا مقلية ومايونيز وجبنة موزاريلا ومايونيز بالثوم", price: 210, srcImg: "https://amenu.net/storage/Item/image/5661/conversions/62815569a85f3_E798B169-8C37-473B-9720-17B84DD04800-first.webp" },
  { cat: "السلطات", name: "سلطة سيزر", desc: "", price: 200, srcImg: "https://amenu.net/storage/Item/image/5671/conversions/619aa2714466c_%D8%B3%D9%84%D8%B7%D8%A9---%D8%B3%D9%8A%D8%B2%D8%B1-first.webp" },
  { cat: "المقبلات", name: "صحن متبل", desc: "", price: 100, srcImg: "https://amenu.net/storage/Item/image/5674/conversions/637137f09c360_%D9%85%D8%AA%D8%A8%D9%84-first.webp" },
  { cat: "المشروبات", name: "فانتا تنك 330", desc: "", price: 50, srcImg: "https://amenu.net/storage/Item/image/16838/conversions/66ddc6c35dbf4_camlica-330-first.webp" },
  { cat: "السندويش", name: "سندويش دجاج باربكيو", desc: "ساندويش باغيت بقطع دجاج مشوية بصوص الباربكيو مع فلفل أحمر وأخضر وبصل وفطر ومايونيز", price: 210, srcImg: "https://amenu.net/storage/Item/image/5669/conversions/6281587aa4ac5_40CBD315-0433-4949-9689-8439C5A6CCE9-first.webp" },
  { cat: "المقبلات", name: "علبة صوص حار", desc: "", price: 20, srcImg: "https://amenu.net/storage/Item/image/5678/conversions/62a9c827518f8_6C60F06D-C8B2-4714-A072-7A0476B562ED-first.webp" },
  { cat: "الوجبات", name: "سنتافيا", desc: "أربع قطع صدر دجاج طرية متبلة ومقرمشة بالبقسماط الناعم مغطاة بجبنة موزاريلا ذائبة، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 400, srcImg: "https://amenu.net/storage/Item/image/5644/conversions/62814c37c9402_4E88CF6C-A237-4CD4-BE59-84270D8A358D-first.webp" },
  { cat: "الوجبات", name: "زنجر", desc: "أربع قطع دجاج طرية مقرمشة بالبقسماط بصوص الفلفل الأحمر الحار، مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 390, srcImg: "https://amenu.net/storage/Item/image/5638/conversions/626f12063b974_074FF495-88CF-4016-B986-1505F5191AF3-first.webp" },
  { cat: "الوجبات", name: "شرحات مطفايية", desc: "شرحات الدجاج مشوية على الغريل مع الثوم والليمون", price: 420, srcImg: "https://amenu.net/storage/Item/image/5647/conversions/62814fba04ebc_AB528418-DE3C-4199-9E08-1D41A31670EC-first.webp" },
  { cat: "الوجبات", name: "وجبة دبوس", desc: "4 قطع فخذ دجاج مقرمشة بالبقسماط، تُقدَّم مع بطاطا مقلية وكول سلو ومايونيز بالثوم", price: 420, srcImg: "https://amenu.net/storage/Item/image/5649/conversions/6367e9ff90c12_9F563584-B25D-4703-89A1-D5415F9BC1D8-first.webp" },
  { cat: "المقبلات", name: "صحن بطاطا", desc: "", price: 130, srcImg: "https://amenu.net/storage/Item/image/5675/conversions/619a7f1a93faa_%D8%B5%D8%AD%D9%86-%D8%A8%D8%B7%D8%A7%D8%B7%D8%A7-%D8%AE%D8%B4%D8%A8-first.webp" },
  { cat: "المقبلات", name: "بطاطا شرحات", desc: "", price: 140, srcImg: "https://amenu.net/storage/Item/image/14370/conversions/6532920411656_%D8%A8%D8%B7%D8%A7%D8%B7%D8%A7-%D8%B4%D8%B1%D8%AD%D8%A7%D8%AA-first.webp" },
  { cat: "المشروبات", name: "غازوز سادة 330", desc: "", price: 50, srcImg: "https://amenu.net/storage/Item/image/16839/conversions/66ddc8e1f2751_gazoz-first.webp" },
  { cat: "السندويش", name: "سندويشة مكسيكي", desc: "ساندويش باغيت بقطع صدر دجاج طرية مشوية بصوص الفلفل الأحمر الحار، مع فلفل أخضر وأحمر حلو وفطر وبصل ومايونيز", price: 210, srcImg: "https://amenu.net/storage/Item/image/5664/conversions/6281566172859_AE74860A-54A0-4665-ACAA-87A127410C18-first.webp" },
  { cat: "المشروبات", name: "عيران 300", desc: "", price: 30, srcImg: "https://amenu.net/storage/Item/image/5685/conversions/62a34da3a6fbe_C8B90DBD-BFF9-4E65-AF55-3952A6AEECA3-first.webp" },
  { cat: "المشروبات", name: "صودا", desc: "", price: 25, srcImg: "https://amenu.net/storage/Item/image/5684/conversions/62a34dc7e843b_55310568-C043-4F62-B81C-2A95F857C2AB-first.webp" },
  { cat: "المقبلات", name: "علبة كريم ثوم", desc: "", price: 20, srcImg: "https://amenu.net/storage/Item/image/5676/conversions/62a9c74f90adf_14AB8441-08D0-4B14-A185-6FDC373A5A0B-first.webp" },
  { cat: "السندويش", name: "سندويش سوبريم", desc: "رول الدجاج المحمر محشي بالجبن والسلام", price: 200, srcImg: "https://amenu.net/storage/Item/image/5663/conversions/6281559652dd7_73E5437C-2AF9-412B-9F6A-47C76F262904-first.webp" },
  { cat: "المقبلات", name: "علبة كول سلو صغيرة", desc: "", price: 20, srcImg: "https://amenu.net/storage/Item/image/5677/conversions/62a9c80781c5b_829132ED-1C64-471E-B8AB-1EE1EB21C7BC-first.webp" },
  { cat: "السندويش", name: "سندويش سكالوب", desc: "ساندويش باغيت بقطعتي دجاج طرية مغطاة بالبقسماط، مع كول سلو وبطاطا مقلية ومايونيز بالثوم", price: 200, srcImg: "https://amenu.net/storage/Item/image/5659/conversions/6371314b6f55e_C97A0D1B-17AD-453B-AE03-6100D5124ABB-first.webp" }
];

if (items.length !== 52) throw new Error('Expected 52 items, got ' + items.length);

// File naming is always index+1 in original DOM-extraction order (matches the download script).
items.forEach((it, i) => { it._file = 'p' + (i + 1); });

function unitFor(cat) {
  if (cat === "السندويش") return "سندويش";
  if (cat === "المقبلات") return "طبق";
  if (cat === "الوجبات") return "وجبة";
  if (cat === "السلطات") return "طبق";
  return "قطعة";
}

function esc(s) {
  return String(s).split('\\').join('\\\\').split('"').join('\\"');
}

const order = ["الوجبات", "السندويش", "السلطات", "المقبلات", "المشروبات"];
let lines = [];
lines.push('// Generated for مطعم بروستد عبد الحميد (Abdulhamit Tavuk) — Başakşehir, Istanbul.');
lines.push('// Fried/grilled chicken meals, sandwiches, salads, sides, beverages.');
lines.push('// Source: amenu.net digital menu (https://amenu.net/restaurant363, static HTML, all 52 items');
lines.push('// captured directly from DOM — no pagination/API) + Google Maps ("بروستد عبد الحميد Abdulhamit tavuk",');
lines.push('// exact phone match, rating/reviews/place_id confirmed).');
lines.push('const abdulhamitStore = {');
lines.push(' "id": 103,');
lines.push(' "name": "بروستد عبد الحميد",');
lines.push(' "category": "مطاعم",');
lines.push(' "image": "/assets/photos/abdulhamit/cover.jpg",');
lines.push(' "coverImage": "/assets/photos/abdulhamit/cover.jpg",');
lines.push(' "logoImage": "/assets/photos/abdulhamit/logo.jpg",');
lines.push(' "logo": "ع",');
lines.push(' "rating": 4.5,');
lines.push(' "reviews": 818,');
lines.push(' "newStore": true,');
lines.push(' "delivery": 35,');
lines.push(' "minOrder": 100,');
lines.push(' "time": "30 - 60 دقيقة",');
lines.push(' "distance": 0,');
lines.push(' "location": {');
lines.push('  "lat": 41.1079051,');
lines.push('  "lng": 28.7895524');
lines.push(' },');
lines.push(' "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.1079051,28.7895524",');
lines.push(' "open": true,');
lines.push(' "featured": false,');
lines.push(' "hasOffer": false,');
lines.push(' "offer": "",');
lines.push(' "description": "بروستد عبد الحميد — مطعم دجاج مقرمش ومشوي: بروستد وجناحات وشيش طاووق وسندويشات وسلطات، حي باشاك شهير، إسطنبول.",');
lines.push(' "address": "Mehmet Akif Ersoy, Mavera Sitesi Cd. C Blok No:18 B/1, 34480 Başakşehir/İstanbul",');
lines.push(' "phone": "+90 531 361 12 88",');
lines.push(' "whatsapp": "+90 531 361 12 88",');
lines.push(' "email": "",');
lines.push(' "website": "https://amenu.net/restaurant363",');
lines.push(' "sourceUrl": "https://amenu.net/restaurant363",');
lines.push(' "hours": "يومياً 00:00 – 23:00",');
lines.push(' "areas": [');
lines.push('  "باشاك شهير",');
lines.push('  "مناطق إسطنبول حسب المسافة"');
lines.push(' ],');
lines.push(' "fulfillment": "توصيل واستلام",');
lines.push(' "subscription": "احترافي",');
lines.push(' "orderCount": 0,');
lines.push(' "officialStore": true,');
lines.push(' "approvalStatus": "pending",');
lines.push(' "googleRating": 4.5,');
lines.push(' "googleReviewsCount": 818,');
lines.push(' "googlePlaceId": "ChIJY7qOKRavyhQR3cW90ghx7K4",');
lines.push(' "googleMapsUrl": "https://maps.google.com/?cid=12604573739812505053"');
lines.push('};');
lines.push('');
lines.push('const abdulhamitFullCatalog = [');
order.forEach((cat, ci) => {
  lines.push('  // ' + cat);
  items.filter(p => p.cat === cat).forEach((p, i) => {
    const unit = unitFor(p.cat);
    lines.push('  { name: "' + esc(p.name) + '", description: "' + esc(p.desc) + '", price: ' + p.price + ', category: "' + esc(p.cat) + '", unit: "' + esc(unit) + '", image: "/assets/photos/abdulhamit/' + p._file + '.jpg" },');
  });
  if (ci < order.length - 1) lines.push('');
});
lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
lines.push('];');
lines.push('');
lines.push('// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.');
lines.push('const abdulhamitProductCatalog = [];');
lines.push('');
lines.push('const abdulhamitProducts = (abdulhamitProductCatalog.length ? abdulhamitProductCatalog : abdulhamitFullCatalog).map((product, index) => ({');
lines.push('  ...product,');
lines.push('  available: true,');
lines.push('  id: 1850001 + index,');
lines.push('  storeId: abdulhamitStore.id');
lines.push('}));');
lines.push('');
lines.push('const abdulhamitDeliverySettings = {');
lines.push('  [abdulhamitStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }');
lines.push('};');
lines.push('');
lines.push('if (typeof module !== "undefined" && module.exports) {');
lines.push('  module.exports = { abdulhamitStore, abdulhamitProducts, abdulhamitDeliverySettings };');
lines.push('}');
lines.push('');

module.exports = { items, writeFile: () => fs.writeFileSync('abdulhamit-data.js', lines.join('\n'), 'utf8') };

if (require.main === module) {
  fs.writeFileSync('abdulhamit-data.js', lines.join('\n'), 'utf8');
  console.log('Wrote abdulhamit-data.js, products:', items.length);
}
