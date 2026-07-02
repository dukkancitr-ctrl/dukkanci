// Generated for جولدن مكس (Golden Mix — بن ومكسرات / coffee & copperware, Fatih, İstanbul).
// Source: the brand's WooCommerce store at goldenmix.com.tr (Store API wc/store/v1).
// 88 products across coffee blends, copper coffee pots (ركوات), mate tools & hospitality items.
// Size/weight variants that shared one photo are merged into a single product with an
// «السعة»/«الحجم» option group; coffee blend-ratio options come from WooCommerce variations.
// Out-of-stock source items are kept (available:false) so the merchant can manage them; the
// storefront hides them via applyPublishingRules until restocked.
// NOTE: goldenmixProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed at deploy time.
const goldenmixStore = {
 "id": 80,
 "name": "جولدن مكس",
 "category": "بن ومكسرات",
 "image": "/assets/photos/goldenmix/cover.jpg",
 "coverImage": "/assets/photos/goldenmix/cover.jpg",
 "logoImage": "/assets/photos/goldenmix/logo.png",
 "logo": "ج",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.020313,
  "lng": 28.941562
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.020313,28.941562",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "جولدن مكس متجر متخصّص بالبنّ والقهوة في الفاتح بإسطنبول — خلطات قهوة فاخرة (برازيلي، كولومبي، إسبريسو) وقهوة عربية بالهيل والمستكة والنعناع، مع تشكيلة من الرَّكوات والدلال النحاسية وأدوات المتة ومستلزمات الضيافة. اختر درجة التحميص والوزن المناسب واطلبه طازجاً إلى باب بيتك.",
 "address": "الفاتح، إسطنبول",
 "phone": "+90 505 079 99 97",
 "whatsapp": "+90 505 079 99 97",
 "email": "",
 "website": "https://goldenmix.com.tr/",
 "sourceUrl": "https://goldenmix.com.tr/",
 "hours": "يومياً — يرجى تأكيد أوقات العمل",
 "areas": [
  "الفاتح",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used for the Supabase push + first-paint fallback.
const goldenmixFullCatalog = [
  // خلطات جولدن مكس
  { name: "الخلطة الذهبية", price: 1079, category: "خلطات جولدن مكس", image: "/assets/photos/goldenmix/item-001.jpg", description: "الخلطة الذهبية من Goldenmix خليط من البرازيلي والكولومبي الفاخر", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,511]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  { name: "الخلطة الذهبية سادة", price: 944, category: "خلطات جولدن مكس", image: "/assets/photos/goldenmix/item-002.jpg", description: "الخلطة الذهبية سادة من goldenmix خليط من البن البرازيلي والكولومبي الفاخر", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,435]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  // برازيلي
  { name: "قهوة برازيلي اورجينال سادة", price: 864, category: "برازيلي", image: "/assets/photos/goldenmix/item-003.jpg", description: "خليط البن البرازيلي الفاخر بدون هال من goldenmix", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,340]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  { name: "قهوة برازيلي اورجينال هال وسط", price: 944, category: "برازيلي", image: "/assets/photos/goldenmix/item-004.jpg", description: "خليط البن البرازيلي الفاخر هال وسط من goldenmix", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,435]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  // كولومبي
  { name: "قهوة كولومبية اورجينال سادة", price: 1034, category: "كولومبي", image: "/assets/photos/goldenmix/item-005.jpg", description: "بن كولومبي فاخر سادة من goldenmix", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,525]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  { name: "كولومبي اورجينال هال اكسترا", price: 1204, category: "كولومبي", image: "/assets/photos/goldenmix/item-006.jpg", description: "بن كولومبي فاخر هال اكسترا من goldenmix", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,465]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  { name: "كولومبي اورجينال هال وسط", price: 1119, category: "كولومبي", image: "/assets/photos/goldenmix/item-007.jpg", description: "بن كولومبي فاخر هال وسط من goldenmix", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,455]},{"name":"نسبة الخليط","values":["40% أشقر 60% غامق","50% أشقر 50% غامق","60% أشقر 40% غامق"],"extra":[0,0,0]}] },
  // قهوة
  { name: "اسبرسو", price: 904, category: "قهوة", image: "/assets/photos/goldenmix/item-008.jpg", description: "خليط من حبات البن الاراببكا و الروبوستا الفاخرة", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,385]}] },
  { name: "خلطة السلطان", price: 1204, category: "قهوة", image: "/assets/photos/goldenmix/item-009.jpg", description: "مزيج من افضل انواع البن البرازيلي والكولومبي الفاخرة مع كمية مضاعفة من الهال", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,470]}] },
  { name: "قهوة الخليجية 250g عدد 4", price: 999, category: "قهوة", image: "/assets/photos/goldenmix/item-010.jpg", description: "قهوة منتقاة من أفضل أنواع بن الأرابيكا مع حبات الهال الفاخرة والتوابل من جولدن ميكس" },
  { name: "قهوة المستكة", price: 1034, category: "قهوة", image: "/assets/photos/goldenmix/item-011.jpg", description: "قهوة فاخرة بنكهة المستكة", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,450]}] },
  { name: "قهوة النعناع", price: 859, category: "قهوة", image: "/assets/photos/goldenmix/item-012.jpg", description: "قهوة فاخرة بنكهة النعناع", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,345]}] },
  { name: "قهوة فلتر", price: 904, category: "قهوة", image: "/assets/photos/goldenmix/item-013.jpg", description: "خليط من حبات البن الاراببكا و الروبوستا الفاخرة", options: [{"name":"الحجم","values":["250g عدد 4","500g عدد 3"],"extra":[0,40]}] },
  { name: "قهوة الشوكولا", price: 1204, category: "قهوة", image: "/assets/photos/goldenmix/item-014.jpg", description: "قهوة فاخرة بنكهة الشوكولا", available: false, options: [{"name":"الحجم","values":["500g عدد 3","250g عدد 4"],"extra":[0,85]}] },
  // المشروبات الساخنة
  { name: "كابتشينو 250g عدد 4", price: 625, category: "المشروبات الساخنة", image: "/assets/photos/goldenmix/item-015.jpg", description: "تلذذ بنكهة الكابتشينو الرائعة" },
  { name: "نسكافيه بلاك 125g عدد 4", price: 562, category: "المشروبات الساخنة", image: "/assets/photos/goldenmix/item-016.jpg", description: "تمتّع بلذة المذاق" },
  { name: "نسكافيه غولد 125g عدد 4", price: 625, category: "المشروبات الساخنة", image: "/assets/photos/goldenmix/item-017.jpg", description: "تمتّع بلذة المذاق" },
  { name: "هوت شوكلت 250g عدد 4", price: 625, category: "المشروبات الساخنة", image: "/assets/photos/goldenmix/item-018.jpg", description: "مشروب بنكهة الشوكولا اللّذيذة" },
  // شاي
  { name: "شاي سيلاني 350g عدد 3", price: 812, category: "شاي", image: "/assets/photos/goldenmix/item-019.jpg", description: "شاي سيلاني من أجود أوراق الشاي الفاخرة الفاخرة" },
  // هال
  { name: "هال جامبو 500g", price: 1380, category: "هال", image: "/assets/photos/goldenmix/item-020.jpg", description: "هال جامبو 100g", available: false },
  // ركوات
  { name: "ركوة نحاسية ذهبية ١", price: 399, category: "ركوات", image: "/assets/photos/goldenmix/item-021.jpg", description: "ركوة نحاسية ذهبية سعة 5 فنجان", options: [{"name":"السعة","values":["3 فنجان","4 فنجان","5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٣", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-022.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٤", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-023.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٥", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-024.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٦", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-025.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٧", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-026.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٨", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-027.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٩", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-028.jpg", description: "ركوة نحاسية نقش سعة 2 فنجان", options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ١", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-029.jpg", description: "ركوة نحاس نقش ملوّن أحمر سعة 4-5 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ٢", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-030.jpg", description: "ركوة نحاس نقش ملوّن أبيض سعة 4-5 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ٣", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-031.jpg", description: "ركوة نحاس نقش ملوّن أزرق سعة 4-5 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ٤", price: 449, category: "ركوات", image: "/assets/photos/goldenmix/item-032.jpg", description: "ركوة نحاس نقش ملوّن أسود سعة 4-5 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4-5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ثقيل ١", price: 499, category: "ركوات", image: "/assets/photos/goldenmix/item-033.jpg", description: "ركوة نحاس نقش ثقيل ملوّن أسود سعة 5-6 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2-3 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ثقيل ٢", price: 499, category: "ركوات", image: "/assets/photos/goldenmix/item-034.jpg", description: "ركوة نحاس نقش ثقيل ملوّن أزرق سعة 5-6 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2-3 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ثقيل ٣", price: 499, category: "ركوات", image: "/assets/photos/goldenmix/item-035.jpg", description: "ركوة نحاس نقش ثقيل ملوّن أحمر سعة 5-6 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2-3 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ثقيل ٤", price: 499, category: "ركوات", image: "/assets/photos/goldenmix/item-036.jpg", description: "ركوة نحاس نقش ثقيل ملوّن أبيض سعة 5-6 فنجان قهوة", available: false, options: [{"name":"السعة","values":["2-3 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية ذهبية ٢", price: 699, category: "ركوات", image: "/assets/photos/goldenmix/item-037.jpg", description: "ركوة نحاسية ذهبية سعة 5 فنجان", available: false, options: [{"name":"السعة","values":["3 فنجان","4 فنجان","5 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية طويلة ١", price: 599, category: "ركوات", image: "/assets/photos/goldenmix/item-038.jpg", description: "ركوة نحاسية حفر طويلة لون فضي سعة 6 فنجان", available: false, options: [{"name":"السعة","values":["3 فنجان","4 فنجان","6 فنجان"],"extra":[0,100,200]}] },
  { name: "ركوة نحاسية طويلة ٢", price: 599, category: "ركوات", image: "/assets/photos/goldenmix/item-039.jpg", description: "ركوة نحاسية حفر طويلة لون برونز سعة 3 فنجان", available: false, options: [{"name":"السعة","values":["3 فنجان","4 فنجان","6 فنجان"],"extra":[0,100,200]}] },
  { name: "ركوة نحاسية طويلة ٣", price: 599, category: "ركوات", image: "/assets/photos/goldenmix/item-040.jpg", description: "ركوة نحاسية حفر طويلة لون برونز سعة 5-6", available: false, options: [{"name":"السعة","values":["2 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,100,200]}] },
  { name: "ركوة نحاسية طويلة ٤", price: 599, category: "ركوات", image: "/assets/photos/goldenmix/item-041.jpg", description: "ركوة نحاسية حفر طويلة لون فضي سعة 2 فنجان", available: false, options: [{"name":"السعة","values":["2 فنجان","3-4 فنجان","5-6 فنجان"],"extra":[0,100,200]}] },
  { name: "ركوة نحاسية نقش ١", price: 399, category: "ركوات", image: "/assets/photos/goldenmix/item-042.jpg", description: "ركوة نحاسية نقش سعة 4 فنجان", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4 فنجان"],"extra":[0,50,100]}] },
  { name: "ركوة نحاسية نقش ٢", price: 399, category: "ركوات", image: "/assets/photos/goldenmix/item-043.jpg", description: "ركوة نحاسية نقش سعة 4 فنجان", available: false, options: [{"name":"السعة","values":["2 فنجان","3 فنجان","4 فنجان"],"extra":[0,50,100]}] },
  // مصاصات المتة
  { name: "مصاصة متة نحاس أزرق أحمر أخضر عدد 10 ١", price: 375, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-044.jpg", description: "مصاصة متة زرقاء فضية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس أزرق أحمر أخضر عدد 10 ٢", price: 375, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-045.jpg", description: "مصاصة متة نحاس لون أحمر ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 10 ١", price: 499, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-046.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 10 ٢", price: 599, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-047.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 10 ٣", price: 599, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-048.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 10 ٤", price: 599, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-049.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 10 ٥", price: 649, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-050.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية عدد 5", price: 399, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-051.jpg", description: "مصاصة متة نحاس برونزية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس برونزية قابلة للفك عدد 10", price: 599, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-052.jpg", description: "مصاصة متة نحاس برونزية قابلة للفك و التنظيف", available: false },
  { name: "مصاصة متة نحاس ذهبية عدد 10 ١", price: 499, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-053.jpg", description: "مصاصة متة نحاس ذهبية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس ذهبية عدد 10 ٢", price: 499, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-054.jpg", description: "مصاصة متة نحاس ذهبية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس ذهبية عدد 5 ١", price: 399, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-055.jpg", description: "مصاصة متة نحاس ذهبية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس ذهبية عدد 5 ٢", price: 449, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-056.jpg", description: "مصاصة متة نحاس ذهبية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس ذهبية عدد 5 ٣", price: 399, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-057.jpg", description: "مصاصة متة نحاس ذهبية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس ذهبية قابلة للفك عدد 10", price: 599, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-058.jpg", description: "مصاصة متة نحاس ذهبية قابلة للفك و التنظيف", available: false },
  { name: "مصاصة متة نحاس فضية عدد 10", price: 699, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-059.jpg", description: "مصاصة متة نحاس فضية ضد الصدأ", available: false },
  { name: "مصاصة متة نحاس فضية عدد 5", price: 499, category: "مصاصات المتة", image: "/assets/photos/goldenmix/item-060.jpg", description: "مصاصة متة نحاس فضية ضد الصدأ", available: false },
  // أدوات المته
  { name: "جوزة بورسلان ملوّن منوع عدد 5", price: 549, category: "أدوات المته", image: "/assets/photos/goldenmix/item-061.jpg", description: "جوزة بورسلان" },
  { name: "جوزة فخار صغير عدد 5", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-062.jpg", description: "جوزة فخار صغير حفر سادة" },
  { name: "جوزة فخار كبير رسم ملون عدد 5", price: 749, category: "أدوات المته", image: "/assets/photos/goldenmix/item-063.jpg", description: "جوزة فخار كبير رسم ملون" },
  { name: "جوزة فخار كبير عدد 5", price: 749, category: "أدوات المته", image: "/assets/photos/goldenmix/item-064.jpg", description: "جوزة فخار كبير رسم سادة" },
  { name: "جوزة متة بورسلان طويلة ملوّن منوعة عدد 5", price: 599, category: "أدوات المته", image: "/assets/photos/goldenmix/item-065.jpg", description: "جوزة متة بورسلان طويلة" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ١", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-066.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٢", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-067.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٣", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-068.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٤", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-069.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٥", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-070.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٦", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-071.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٧", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-072.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة بورسلان مرخم عدد 5 ٨", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-073.jpg", description: "جوزة متة بورسلان مرخم" },
  { name: "جوزة متة خشب كبير من الداخل المينيوم منوّع عدد 5", price: 999, category: "أدوات المته", image: "/assets/photos/goldenmix/item-074.jpg", description: "جوزة متة خشب قاعدة المينيوم" },
  { name: "جوزة متة خشب كبيرة قاعدة المينيوم منوّع عدد 5", price: 999, category: "أدوات المته", image: "/assets/photos/goldenmix/item-075.jpg", description: "جوزة متة خشب قاعدة المينيوم" },
  { name: "جوزة متة خشب من الداخل المينيوم عدد 5", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-076.jpg", description: "جوزة متة خشب من الداخل المينيوم" },
  { name: "جوزة متة خشب من الداخل المينيوم مضلع عدد 5", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-077.jpg", description: "جوزة متة خشب من الداخل المينيوم مضلع" },
  { name: "جوزة متة زجاج شفاف رسم يدوي عدد 5 ١", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-078.jpg", description: "جوزة متة زجاج شفاف رسم يدوي" },
  { name: "جوزة متة زجاج شفاف رسم يدوي عدد 5 ٢", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-079.jpg", description: "جوزة متة زجاج شفاف رسم يدوي" },
  { name: "جوزة متة زجاج شفاف رسم يدوي عدد 5 ٣", price: 499, category: "أدوات المته", image: "/assets/photos/goldenmix/item-080.jpg", description: "جوزة متة زجاج شفاف رسم يدوي" },
  { name: "جوزة متة المينيوم عدد 5", price: 799, category: "أدوات المته", image: "/assets/photos/goldenmix/item-081.jpg", description: "جوزة متة المينيوم", available: false },
  { name: "جوزة متة بورسلان ملمس جلد عدد 5 ١", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-082.jpg", description: "جوزة متة بورسلان ملمس جلد", available: false },
  { name: "جوزة متة بورسلان ملمس جلد عدد 5 ٢", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-083.jpg", description: "جوزة متة بورسلان ملمس جلد", available: false },
  { name: "جوزة متة بورسلان ملمس جلد عدد 5 ٣", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-084.jpg", description: "جوزة متة بورسلان ملمس جلد", available: false },
  { name: "جوزة متة بورسلان ملمس جلد عدد 5 ٤", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-085.jpg", description: "جوزة متة بورسلان ملمس جلد", available: false },
  { name: "جوزة متة خشب صغيرة عدد 5 ١", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-086.jpg", description: "جوزة متة خشب صغيرة", available: false },
  { name: "جوزة متة خشب صغيرة عدد 5 ٢", price: 699, category: "أدوات المته", image: "/assets/photos/goldenmix/item-087.jpg", description: "جوزة متة خشب صغيرة", available: false },
  // نحاسيات
  { name: "سبيرتاية نحاسية لتحضير القهوة", price: 649, category: "نحاسيات", image: "/assets/photos/goldenmix/item-088.jpg", description: "سبيرتاية نحاسية لتحضير القهوة", available: false }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const goldenmixProductCatalog = [];

const goldenmixProducts = (goldenmixProductCatalog.length ? goldenmixProductCatalog : goldenmixFullCatalog).map((product, index) => ({
  ...product,
  available: product.available !== false,
  id: 1640001 + index,
  storeId: goldenmixStore.id
}));

const goldenmixDeliverySettings = {
  [goldenmixStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 20, maxRoundTripKm: 130 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { goldenmixStore, goldenmixProducts, goldenmixDeliverySettings };
}
