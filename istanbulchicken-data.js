// Generated for إسطنبول تشكن (Istanbul Chicken) — شيرين إفلر، بهتشه إفلر، إسطنبول.
// Source: https://istanbul-chicken.pizzanar.com.tr/28/home (pizzanar/vecmenu API, restaurant 29 / branch 28,
// native Arabic). 67 products across 9 categories.
// The source's only per-item "option" is a payment-method surcharge (كاش/كرت) — excluded (Dukkanci has its own
// checkout payment flow). Dropped item 370 (exact duplicate of 317) and item 329 (no image at source).
// NOTE: istanbulchickenProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives in
// Supabase (pushed via scripts/_scrape/push-store.cjs). istanbulchickenFullCatalog stays populated as a small fallback.
const istanbulchickenStore = {
 "id": 63,
 "name": "إسطنبول تشكن",
 "category": "مطاعم",
 "image": "/assets/photos/istanbul-chicken/cover.jpg",
 "coverImage": "/assets/photos/istanbul-chicken/cover.jpg",
 "logoImage": "/assets/photos/istanbul-chicken/logo.png",
 "logo": "إ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 300,
 "time": "35 - 65 دقيقة",
 "distance": 0,
 "location": {
  "lat": 40.9949,
  "lng": 28.8458
 },
 "mapUrl": "https://www.google.com/maps?q=%C5%9Eirinevler%2C%20Fetih%205.%20Sk.%208B%2C%2034188%20Bah%C3%A7elievler%2F%C4%B0stanbul",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "في إسطنبول تشكن، الطعم غير! شاورما على أصولها، بروستد مقرمش، ومشويات بتتبيلة سرّها في الطعم. جرّبنا اليوم وخلّي لذّتك تحكي — الجودة والسرعة والرضا هذا وعدنا. مشاوي بالكيلو ودجاج بروستد وشاورما ومناسف وبرغر ومقبلات ومشروبات، تُحضّر طازجة وتصل إلى بابك.",
 "address": "شيرين إفلر - Fetih 5. Sk. No:8B - بهتشه إفلر، إسطنبول، تركيا",
 "phone": "+90 555 108 80 26",
 "whatsapp": "+90 555 108 80 26",
 "email": "istanbulkelesi@gmail.com",
 "website": "",
 "sourceUrl": "https://istanbul-chicken.pizzanar.com.tr/28/home",
 "hours": "يومياً - كافة أيام الأسبوع",
 "areas": [
  "شيرين إفلر",
  "بهتشه إفلر",
  "باغجلار",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push + as a small bundled fallback; ProductCatalog stays [] for fast paint.
const istanbulchickenFullCatalog = [
 {
  "name": "نصف كيلو شيش طاووق",
  "price": 320,
  "category": "مشاوي بالكيلو",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/381.jpg",
  "description": "شيش طاووق مع السلطه والخبز والثوم",
  "sourceId": "381"
 },
 {
  "name": "كباب غنم نصف كيلو",
  "price": 800,
  "category": "مشاوي بالكيلو",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/318.jpg",
  "description": "لحم غنم مفروم مشوي مع صوص ثوم وخبز محمره وسلطه",
  "sourceId": "318"
 },
 {
  "name": "كباب دجاج نصف كيلو",
  "price": 300,
  "category": "مشاوي بالكيلو",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/319.jpg",
  "description": "نصف كيلو كباب دجاج مع سلطه وثوم وخبز وبصل وطماطم مشويه",
  "sourceId": "319"
 },
 {
  "name": "نصف كيلو مشكل دجاج",
  "price": 320,
  "category": "مشاوي بالكيلو",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/380.jpg",
  "description": "كباب دجاج وشيش طاووق مع السلطه وثوم وخبز وبصل وبندوره مشويه",
  "sourceId": "380"
 },
 {
  "name": "بروستد كامل الحار",
  "price": 700,
  "category": "دجاج البروستد",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/317.jpg",
  "description": "بروستد كامل بالتبله الحاره مع بطاطا مقليه وتوم مخلل",
  "sourceId": "317"
 },
 {
  "name": "وجبه نصف بروستد 5قطع",
  "price": 360,
  "category": "دجاج البروستد",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/378.jpg",
  "description": "نصف دجاج مقلي مع البطاطا وصوصات ومخلل وصوص الجبنه",
  "sourceId": "378"
 },
 {
  "name": "بروستد كامل 10 قطع",
  "price": 700,
  "category": "دجاج البروستد",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/379.jpg",
  "description": "دجاج كامل مقلي مع البطاطا مقليه وصوصات وصوص الشيدر ومخلل ورغيفين خبز",
  "sourceId": "379"
 },
 {
  "name": "سندويش شاورما دبل حشوة",
  "price": 170,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/307.jpg",
  "description": "سندويش شاورما مع المخلل والتوم داخل السندويشه",
  "sourceId": "307"
 },
 {
  "name": "وجبه عربي دبل",
  "price": 400,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/308.jpg",
  "description": "قطع ساندويتش شاورما مع البطاطا المقليه والصوصات والمخلل",
  "sourceId": "308"
 },
 {
  "name": "ساندويتش شاورما عادي",
  "price": 140,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/325.jpg",
  "description": "ساندويتش شاورما مع الثوم والمخلل داخل السندويتش",
  "sourceId": "325"
 },
 {
  "name": "وجبه شاورما عربي عادي",
  "price": 280,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/326.jpg",
  "description": "وجبه شاورما قطع مع البطاطا والصوصات والخضار الجانبيه",
  "sourceId": "326"
 },
 {
  "name": "نصف كيلو شاورما",
  "price": 450,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/327.jpg",
  "description": "شاورما شرايح مع بطاطا مقليه مع ثلاث علب توم وعلبه مخلل وعلبه خضار  مشكله وخبزتين محمره ورغيف صاج",
  "sourceId": "327"
 },
 {
  "name": "وجبه شاورما شرائح",
  "price": 350,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/328.jpg",
  "description": "شرائح شاورما مع البطاطا المقليه والثوم الابيض والثوم الحار والمخلل والخبز المحمر",
  "sourceId": "328"
 },
 {
  "name": "وجبه شاورما وربات",
  "price": 450,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/330.jpg",
  "description": "شاورما مع الجبن والفطر والفستق الحلبي مع البطاطا المقليه والصوصات الثوم",
  "sourceId": "330"
 },
 {
  "name": "شاورما مع رز",
  "price": 350,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/331.jpg",
  "description": "شاورما مع رز وسلطه وتوم ومخلل",
  "sourceId": "331"
 },
 {
  "name": "دونر شاورما بخبز الصمون",
  "price": 150,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/332.jpg",
  "description": "",
  "sourceId": "332"
 },
 {
  "name": "وجبه شاورما اصابع",
  "price": 350,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/333.jpg",
  "description": "5 اصابيع شاورما مع البطاطا المقليه والصوصات المتنوعه",
  "sourceId": "333"
 },
 {
  "name": "وجبه شاورما اكسترا",
  "price": 410,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/334.jpg",
  "description": "صرة شاورما بالجبنه والفطر مع البطاطا المقليه مع صوص الثوم",
  "sourceId": "334"
 },
 {
  "name": "وجبه شاورما بانيه",
  "price": 380,
  "category": "الشاورما",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/335.jpg",
  "description": "شاورما محضره ومقليه بالكورن فلكس مع بطاطا وصوصات",
  "sourceId": "335"
 },
 {
  "name": "نصف دجاج عالفحم مع رز كبسه",
  "price": 320,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/309.jpg",
  "description": "نصف دجاج عالفحم مع رز كبسه مع السلطه وصوص التوم وصوص الدقوس الاحمر والمخلل",
  "sourceId": "309"
 },
 {
  "name": "منسف دجاج مشوي عالفحم",
  "price": 1700,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/310.jpg",
  "description": "4 أصناف دجاج مشوي عالفحم \nارز كبسه ومندي\nيقدم مع صحنين سلطه وتوم وصوص الدقوس",
  "sourceId": "310"
 },
 {
  "name": "نصف دجاج عالفحم مع بطاطا",
  "price": 320,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/336.jpg",
  "description": "نصف مشوي عالفحم مع توم وصوص وسلطه",
  "sourceId": "336"
 },
 {
  "name": "وجبه كباب دجاج مع البطاطا",
  "price": 280,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/337.jpg",
  "description": "كباب دجاج مع بطاطا وثوم وسلطه وخبز محمر وبصل وبندوره مشويه يمكن استبدال البطاطا مع الرز حسب الطلب",
  "sourceId": "337"
 },
 {
  "name": "وجبه شيش طاووق",
  "price": 290,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/338.jpg",
  "description": "200غ من صدور الدجاج المشويه (سيخين) مع البطاطا المقليه والخبز المحمر والبصل والبندورة المشويه وصوص الثوم",
  "sourceId": "338"
 },
 {
  "name": "وجبه مندي نصف دجاج عالفحم",
  "price": 320,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/339.jpg",
  "description": "نصف دجاج مع الارز وصوص الثوم والمخلل",
  "sourceId": "339"
 },
 {
  "name": "وجبه مكس شاورما (جديدنا*)",
  "price": 380,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/354.jpg",
  "description": "سيخ كباب غنم مع كباب دجاج وشيش طاووق يقدم مع رز وسلطه والثوم",
  "sourceId": "354"
 },
 {
  "name": "منسف لحم(غنم)",
  "price": 3700,
  "category": "المشاوي والمناسف",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/362.jpg",
  "description": "6قطع لحم غنم مع ارز كبسه ومندي يقدم مع صحنين سلطه وصوص الدقوس",
  "sourceId": "362"
 },
 {
  "name": "وجبه نصف بروستد (5قطع)",
  "price": 360,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/311.jpg",
  "description": "نصف دجاج مقلي مع بطاطا وصوصات ومخلل وصوص جبنه",
  "sourceId": "311"
 },
 {
  "name": "وجبه برغر اسطنبول تشكن",
  "price": 270,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/312.jpg",
  "description": "قطع الدجاج المقلي مع الخلطه الخاصه مع البطاطا",
  "sourceId": "312"
 },
 {
  "name": "وجبه زنجر",
  "price": 350,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/363.jpg",
  "description": "4قطع من صدور الدجاج المقليه الحاره مع بطاطا مقليه وصوصات متنوعه",
  "sourceId": "363"
 },
 {
  "name": "بروستد كامل 10قطع",
  "price": 650,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/364.jpg",
  "description": "دجاج كامل مقلي مع بطاطا مقليه وشيدر ومخلل ورغيفين خبز",
  "sourceId": "364"
 },
 {
  "name": "وجبه كرانشي سبايسي",
  "price": 380,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/365.jpg",
  "description": "4قطع دجاج مقلي حار مع الجبن وشرائح الحبش مع البطاطا المقليه والصوصات",
  "sourceId": "365"
 },
 {
  "name": "وجبه كريسبي",
  "price": 350,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/366.jpg",
  "description": "٤ قطع دجاج مقلي",
  "sourceId": "366"
 },
 {
  "name": "وجبه السكالوب",
  "price": 360,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/367.jpg",
  "description": "دجاج بانيه مع بطاطا وصوصات المتنوعه",
  "sourceId": "367"
 },
 {
  "name": "وجبه سوبريم",
  "price": 380,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/368.jpg",
  "description": "رول من لحم الدجاج المقلي المقرمش محشي بالجبنه والفستق الحلبي مع البطاطا والصوصات المتنوعه",
  "sourceId": "368"
 },
 {
  "name": "وجبه مكسيكانو مع الرز",
  "price": 350,
  "category": "وجبات الغربي",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/369.jpg",
  "description": "قطع دجاج مع الفطر والفلفل بالتبله الحاره مع الرز او البطاطا المقليه حسب الطلب",
  "sourceId": "369"
 },
 {
  "name": "سناندوش فايهتا",
  "price": 190,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/313.jpg",
  "description": "قطع دجاج متبل مع الفلفل والفطر والذره مع الجبن",
  "sourceId": "313"
 },
 {
  "name": "ساندويتش زنجر",
  "price": 170,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/314.jpg",
  "description": "ساندويتش زنجر حار",
  "sourceId": "314"
 },
 {
  "name": "ساندويتش مكسيكانو",
  "price": 180,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/371.jpg",
  "description": "دجاج مع الفطر والفلفل مع الصوصات الحاره",
  "sourceId": "371"
 },
 {
  "name": "ساندويش كريسبي",
  "price": 170,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/372.jpg",
  "description": "ساندويتش دجاج مقلي مقرمش  مع البهارات الخاصه",
  "sourceId": "372"
 },
 {
  "name": "ساندوتش اسكالوب",
  "price": 180,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/374.jpg",
  "description": "قطع من الدجاج المقلي البانيه بالكورن فليكس",
  "sourceId": "374"
 },
 {
  "name": "ساندويتش كريسبي عالفحم",
  "price": 180,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/375.jpg",
  "description": "قطع كريسبي مشويه على الفحم معصوص الطحينيه والبقدونس والبندوره",
  "sourceId": "375"
 },
 {
  "name": "برغر زنجر بالجبنه حار",
  "price": 210,
  "category": "سندويش الغربي",
  "unit": "سندويش",
  "image": "/assets/photos/istanbul-chicken/376.jpg",
  "description": "قطع الزنجر الحار بالبرغر  مع الجبن",
  "sourceId": "376"
 },
 {
  "name": "برغر زنجر بالجبنه",
  "price": 210,
  "category": "البرغر",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/315.jpg",
  "description": "قطع الزنجر الحاره بالبرغر مع الجبن",
  "sourceId": "315"
 },
 {
  "name": "برغر كرانشي سبايسي",
  "price": 220,
  "category": "البرغر",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/316.jpg",
  "description": "سندويش من قطع الدجاج الحار المقلي مع الجبن وشرأيح الحبش",
  "sourceId": "316"
 },
 {
  "name": "وجبه برغر اسطنبول تشيكن",
  "price": 270,
  "category": "البرغر",
  "unit": "وجبة",
  "image": "/assets/photos/istanbul-chicken/377.jpg",
  "description": "قطع الدجاج المقلي مع الخلطه الخاصه مع البطاطا وصوصات المتنوعه",
  "sourceId": "377"
 },
 {
  "name": "قطعه كبه مشويه",
  "price": 100,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/320.jpg",
  "description": "كبه مشويه بلحم الدجاج وشحم الغنم",
  "sourceId": "320"
 },
 {
  "name": "طبق يالنجي ١٠ قطع",
  "price": 180,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/321.jpg",
  "description": "ورق عنب بارد يقدم كمقبلات",
  "sourceId": "321"
 },
 {
  "name": "طبق بطاطا كبير",
  "price": 150,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/383.jpg",
  "description": "",
  "sourceId": "383"
 },
 {
  "name": "طبق بطاطا صغير",
  "price": 90,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/384.jpg",
  "description": "",
  "sourceId": "384"
 },
 {
  "name": "طبق فتوش",
  "price": 150,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/385.jpg",
  "description": "سلطه خضار موسميه مع خبز المحمص",
  "sourceId": "385"
 },
 {
  "name": "طبق رز كبير",
  "price": 150,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/386.jpg",
  "description": "رز كبسه او مندي ساده",
  "sourceId": "386"
 },
 {
  "name": "طبق رز ساده (كبسه) صغير",
  "price": 80,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/387.jpg",
  "description": "",
  "sourceId": "387"
 },
 {
  "name": "طبق متبل",
  "price": 150,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/388.jpg",
  "description": "",
  "sourceId": "388"
 },
 {
  "name": "طبق تبوله",
  "price": 150,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/389.jpg",
  "description": "",
  "sourceId": "389"
 },
 {
  "name": "طبق حمص",
  "price": 180,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/390.jpg",
  "description": "",
  "sourceId": "390"
 },
 {
  "name": "شطه غلوريا صغير",
  "price": 50,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/397.jpg",
  "description": "",
  "sourceId": "397"
 },
 {
  "name": "علبة ثوم 250 غرام",
  "price": 70,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/398.jpg",
  "description": "",
  "sourceId": "398"
 },
 {
  "name": "صوص شيدر",
  "price": 35,
  "category": "مقبلات",
  "unit": "طبق",
  "image": "/assets/photos/istanbul-chicken/399.jpg",
  "description": "",
  "sourceId": "399"
 },
 {
  "name": "عيران",
  "price": 35,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/322.jpg",
  "description": "",
  "sourceId": "322"
 },
 {
  "name": "عصير تفاح",
  "price": 60,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/324.jpg",
  "description": "",
  "sourceId": "324"
 },
 {
  "name": "كولا تركية 330مل",
  "price": 60,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/391.jpg",
  "description": "",
  "sourceId": "391"
 },
 {
  "name": "كولا تركية 2.5 لتر",
  "price": 100,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/392.jpg",
  "description": "",
  "sourceId": "392"
 },
 {
  "name": "كولا تركية 1 لتر",
  "price": 75,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/393.jpg",
  "description": "",
  "sourceId": "393"
 },
 {
  "name": "عيران 1 لتر",
  "price": 75,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/394.jpg",
  "description": "",
  "sourceId": "394"
 },
 {
  "name": "ڤينتو",
  "price": 60,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/395.jpg",
  "description": "",
  "sourceId": "395"
 },
 {
  "name": "بورتاكال (برتقال) 330مل",
  "price": 60,
  "category": "مشروبات",
  "unit": "مشروب",
  "image": "/assets/photos/istanbul-chicken/396.jpg",
  "description": "",
  "sourceId": "396"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const istanbulchickenProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const istanbulchickenProducts = (istanbulchickenProductCatalog.length ? istanbulchickenProductCatalog : istanbulchickenFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1470001 + index,
  storeId: istanbulchickenStore.id
}));

const istanbulchickenDeliverySettings = {
  [istanbulchickenStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { istanbulchickenStore, istanbulchickenProducts, istanbulchickenDeliverySettings };
}
