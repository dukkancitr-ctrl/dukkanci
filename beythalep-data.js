// Generated for بيت حلب (Beit Halab), Aksaray/Yusufpaşa, Fatih, Istanbul.
// Levantine/Syrian restaurant — burgers, shawarma, weekly Eastern specials, grills, mezze,
// juices/cocktails/milkshakes, crepe and waffle desserts. Source: beythalep.com (own menu site,
// 17 tabs fully rendered in DOM — no per-tab-click extraction needed) + phone/name confirmed
// against Google Maps (place_id ChIJucM8W4W7yhQRAsa-MSE3XDA, 3.9★/1883 reviews, exact phone
// match). 162 products across 16 categories (dropped: 8 items across 3 categories that shared
// the site's generic placeholder image instead of a real photo — ice cream category emptied
// entirely, 2 of 4 «الامبراطور» items, 1 of 9 «الكوكتيلات» items).
// NOTE: beythalepProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via the Supabase MCP execute_sql (anon-key writes to
// stores/products are RLS-blocked — see memory [[adding-a-restaurant]]).
const beythalepStore = {
 "id": 97,
 "name": "بيت حلب",
 "category": "مطاعم",
 "image": "/assets/photos/beythalep/cover.jpg",
 "coverImage": "/assets/photos/beythalep/cover.jpg",
 "logoImage": "/assets/photos/beythalep/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0100636,
  "lng": 28.9479836
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0100636,28.9479836",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "بيت حلب — مطعم شامي في اكسراي/يوسف باشا، فاتح، إسطنبول. برغر وشاورما ودجاج مشوي، أطباق شرقية (مندي، كبسة، برياني، منسف، مقلوبة)، طبق يومي أسبوعي مختلف كل يوم، مشاوي حلبية، مقبلات باردة وساخنة، عصائر طازجة وكوكتيلات وميلك شيك، وكريب ووافل.",
 "address": "حي يوسف باشا، مولا كوراني، اكسراي، فاتح، إسطنبول، تركيا",
 "phone": "+90 552 800 80 08",
 "whatsapp": "+90 552 800 80 08",
 "email": "info@beythalep.com",
 "website": "https://beythalep.com",
 "sourceUrl": "https://beythalep.com",
 "hours": "يومياً 10:00 ص – 2:00 ص",
 "areas": [
  "اكسراي",
  "فاتح",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const beythalepFullCatalog = [
  // برغر
  { name: "ساندويتش برغر لحمة", price: 325, category: "برغر", unit: "سندويش", image: "/assets/photos/beythalep/p001.jpg" },
  { name: "ساندويتش برغر دجاج", price: 275, category: "برغر", unit: "سندويش", image: "/assets/photos/beythalep/p002.jpg" },
  { name: "ساندويتش برغر زنجر", price: 275, category: "برغر", unit: "سندويش", image: "/assets/photos/beythalep/p003.jpg" },
  { name: "وجبة برغر لحمة", price: 500, category: "برغر", unit: "وجبة", image: "/assets/photos/beythalep/p004.jpg" },
  { name: "وجبة برغر دجاج", price: 425, category: "برغر", unit: "وجبة", image: "/assets/photos/beythalep/p005.jpg" },
  { name: "وجبة برغر زنجر", price: 425, category: "برغر", unit: "وجبة", image: "/assets/photos/beythalep/p006.jpg" },
  // الأطباق الشرقية الأسبوعية
  { name: "الجمعة: سندوانات", price: 800, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p007.jpg" },
  { name: "السبت: يبرق", price: 1000, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p008.jpg" },
  { name: "الاحد: شيخ المحشي", price: 850, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p009.jpg" },
  { name: "الاثنين: لحمة بكرز", price: 1000, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p010.jpg" },
  { name: "الثلاثاء: كبة سماقية", price: 900, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p011.jpg" },
  { name: "الاربعاء: محاشي مشكلة", price: 750, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p012.jpg" },
  { name: "الخميس: كبة سفرجلية", price: 900, category: "الأطباق الشرقية الأسبوعية", unit: "طبق", image: "/assets/photos/beythalep/p013.jpg" },
  // شاورما وفروج
  { name: "ساندويتش شاورما", price: 130, category: "شاورما وفروج", unit: "سندويش", image: "/assets/photos/beythalep/p014.jpg" },
  { name: "ساندويتش شاورما دبل", description: "دبل حشوة", price: 175, category: "شاورما وفروج", unit: "سندويش", image: "/assets/photos/beythalep/p015.jpg" },
  { name: "ساندويتش شاورما اكسترا", description: "مع جبنة", price: 225, category: "شاورما وفروج", unit: "سندويش", image: "/assets/photos/beythalep/p016.jpg" },
  { name: "شاورما عربي عادي", description: "مع بطاطا وثوم ومخلل", price: 250, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p017.jpg" },
  { name: "شاورما عربي دبل", description: "ساندويتشين مع بطاطا وثوم ومخلل", price: 380, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p018.jpg" },
  { name: "شاورما اكسترا", description: "مع بطاطا وثوم ومخلل", price: 450, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p019.jpg" },
  { name: "شاورما 200غ فرط", description: "مع بطاطا وثوم ومخلل", price: 450, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p020.jpg" },
  { name: "شاورما بانييه", description: "مع بطاطا وثوم ومخلل", price: 450, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p021.jpg" },
  { name: "شاورما مع رز", price: 450, category: "شاورما وفروج", unit: "طبق", image: "/assets/photos/beythalep/p022.jpg" },
  { name: "كيلو شاورما سفري", price: 1000, category: "شاورما وفروج", unit: "كيلو", image: "/assets/photos/beythalep/p023.jpg" },
  { name: "نصف كيلو شاورما سفري", price: 500, category: "شاورما وفروج", unit: "كيلو", image: "/assets/photos/beythalep/p024.jpg" },
  { name: "وجبة نصف دجاج مشوي", description: "نص فروج مع بطاطا وثوم ومخلل", price: 450, category: "شاورما وفروج", unit: "وجبة", image: "/assets/photos/beythalep/p025.jpg" },
  // الأطباق الغربية
  { name: "وجبة بروستد", description: "اربع قطع مع بطاطا و ثوم ومخلل و سلطة روسية", price: 450, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p026.jpg" },
  { name: "وجبة كرسبي", description: "اربع قطع مع بطاطا و ثوم ومخلل و سلطة روسية", price: 450, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p027.jpg" },
  { name: "وجبة سبايسي", description: "اربع قطع حار مع بطاطا و ثوم ومخلل و سلطة روسية", price: 450, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p028.jpg" },
  { name: "وجبة زنجر", description: "اربع قطع حار مع صوص شيدر مع بطاطا و ثوم ومخلل و سلطة روسية", price: 480, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p029.jpg" },
  { name: "وجبة سوبريم", description: "قطعتين مع بطاطا و ثوم ومخلل و سلطة روسية", price: 480, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p030.jpg" },
  { name: "وجبة اسكالوب", description: "اربع قطع مع بطاطا و ثوم ومخلل و سلطة روسية", price: 450, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p031.jpg" },
  { name: "وجبة فاهيتا", description: "مع بطاطا و ثوم ومخلل و سلطة روسية", price: 480, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p032.jpg" },
  { name: "وجبة فرانشيسكو", description: "مع بطاطا و ثوم ومخلل و سلطة روسية", price: 480, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p033.jpg" },
  { name: "وجبة سودة دجاج", description: "مع بطاطا و ثوم ومخلل و سلطة روسية", price: 400, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p034.jpg" },
  { name: "وجبة مكسيكانو", description: "مع بطاطا او رز و ثوم ومخلل و سلطة روسية", price: 450, category: "الأطباق الغربية", unit: "وجبة", image: "/assets/photos/beythalep/p035.jpg" },
  // ساندويتش غربي
  { name: "ساندويتش كرسبي", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p036.jpg" },
  { name: "ساندويتش مكسيكانو", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p037.jpg" },
  { name: "ساندويتش فاهيتا", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p038.jpg" },
  { name: "ساندويتش فرانشيسكو", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p039.jpg" },
  { name: "ساندويتش زنجر", description: "مع حار وشيدر", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p040.jpg" },
  { name: "ساندويتش سكالوب", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p041.jpg" },
  { name: "ساندويتش سوبريم", price: 250, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p042.jpg" },
  { name: "ساندويتش سبايسي", description: "مع حار", price: 230, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p043.jpg" },
  { name: "ساندويتش سودة دجاج", price: 200, category: "ساندويتش غربي", unit: "سندويش", image: "/assets/photos/beythalep/p044.jpg" },
  // الأطباق الشرقية
  { name: "مندي لحم", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p045.jpg" },
  { name: "مندي دجاج", price: 450, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p046.jpg" },
  { name: "كبسة لحم", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p047.jpg" },
  { name: "كبسة دجاج", price: 450, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p048.jpg" },
  { name: "برياني لحم", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p049.jpg" },
  { name: "برياني دجاج", price: 450, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p050.jpg" },
  { name: "كباب هندي لحم غنم", price: 650, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p051.jpg" },
  { name: "منسف الاردني شخص واحد", price: 900, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p052.jpg" },
  { name: "اوزي", price: 600, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p053.jpg" },
  { name: "مقلوبة باذنجان لحم قطع", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p054.jpg" },
  { name: "بامية مع رز لحم قطع", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p055.jpg" },
  { name: "فاصوليا مع رز", price: 425, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p056.jpg" },
  { name: "ملوخية مع رز", price: 600, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p057.jpg" },
  { name: "كبة لبنية", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p058.jpg" },
  { name: "شاكرية", price: 850, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p059.jpg" },
  { name: "وجبة فريكة مع رز و لحم", price: 850, category: "الأطباق الشرقية", unit: "وجبة", image: "/assets/photos/beythalep/p060.jpg" },
  { name: "معكرونة بالبشاميل", price: 500, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p061.jpg" },
  { name: "كنياريك باذنجان", price: 600, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p062.jpg" },
  { name: "لحمة بالفرن كواج", price: 600, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p063.jpg" },
  { name: "سمك بالفرن مع رز", price: 750, category: "الأطباق الشرقية", unit: "طبق", image: "/assets/photos/beythalep/p064.jpg" },
  // المشاوي
  { name: "وجبة كباب حلبي", description: "سيخين كباب مع بطاطا وحمص و بواز", price: 650, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p065.jpg" },
  { name: "وجبة كباب خشخاش", description: "سيخين كباب مع بطاطا وحمص و بواز", price: 650, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p066.jpg" },
  { name: "وجبة كباب باذنجان", description: "سيخ مع بطاطا وحمص و بواز", price: 700, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p067.jpg" },
  { name: "وجبة شقف غنم", price: 750, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p068.jpg" },
  { name: "وجبة مشاوي مشكلة", price: 950, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p069.jpg" },
  { name: "وجبة شيش طاووق", price: 450, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p070.jpg" },
  { name: "وجبة سمك مشوي", price: 750, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p071.jpg" },
  { name: "وجبة جوانح مشوية", price: 500, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p072.jpg" },
  { name: "وجبة ماريا", description: "رغيف ماريا مع بطاطا وحمص و بواز", price: 675, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p073.jpg" },
  { name: "وجبة طوشكا", description: "رغيف طوشكا مع بطاطا وحمص و بواز", price: 700, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p074.jpg" },
  { name: "وجبة عرايس لحمة", description: "رغيف عرايس لحمة مع بطاطا وحمص و بواز", price: 675, category: "المشاوي", unit: "وجبة", image: "/assets/photos/beythalep/p075.jpg" },
  { name: "1كغ مشاوي مشكلة", description: "مع بطاطا وحمص و بواز", price: 2200, category: "المشاوي", unit: "كيلو", image: "/assets/photos/beythalep/p076.jpg" },
  { name: "1كغ كباب حلبي", description: "مع بطاطا وحمص و بواز", price: 2400, category: "المشاوي", unit: "كيلو", image: "/assets/photos/beythalep/p077.jpg" },
  { name: "1كغ شقف غنم", description: "مع بطاطا وحمص و بواز", price: 2700, category: "المشاوي", unit: "كيلو", image: "/assets/photos/beythalep/p078.jpg" },
  { name: "1كغ شيش طاووق", description: "مع بطاطا وحمص و بواز", price: 1200, category: "المشاوي", unit: "كيلو", image: "/assets/photos/beythalep/p079.jpg" },
  // المقبلات الباردة
  { name: "سلطة جرجير", price: 250, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p080.jpg" },
  { name: "سلطة شرقية", price: 225, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p081.jpg" },
  { name: "فتوش", price: 250, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p082.jpg" },
  { name: "تبولة", price: 250, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p083.jpg" },
  { name: "حمص", price: 225, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p084.jpg" },
  { name: "متبل", price: 225, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p085.jpg" },
  { name: "بابا غنوج", price: 225, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p086.jpg" },
  { name: "محمرة حلبية", price: 225, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p087.jpg" },
  { name: "يلنجي", description: "6 قطع", price: 250, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p088.jpg" },
  { name: "مقبلات مشكلة", price: 450, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p089.jpg" },
  { name: "خيار بلبن", price: 150, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p090.jpg" },
  { name: "سلطة روسية", price: 150, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p091.jpg" },
  { name: "كريم ثوم", price: 125, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p092.jpg" },
  { name: "صحن مخلل", price: 125, category: "المقبلات الباردة", unit: "طبق", image: "/assets/photos/beythalep/p093.jpg" },
  // المقبلات الساخنة
  { name: "كبة مقلية", price: 125, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p094.jpg" },
  { name: "كبة مشوية", price: 150, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p095.jpg" },
  { name: "كبة صاجية", price: 250, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p096.jpg" },
  { name: "برك جبنة قطعة", price: 60, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p097.jpg" },
  { name: "شوربة عدس", price: 150, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p098.jpg" },
  { name: "حمص بالحمة", price: 550, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p099.jpg" },
  { name: "حمص بالشاورما", price: 400, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p100.jpg" },
  { name: "صحن بطاطا", price: 225, category: "المقبلات الساخنة", unit: "طبق", image: "/assets/photos/beythalep/p101.jpg" },
  // العصائر
  { name: "برتقال", price: 175, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p102.jpg" },
  { name: "رمان", price: 250, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p103.jpg" },
  { name: "ليموناضة", price: 190, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p104.jpg" },
  { name: "ليمون و نعنع", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p105.jpg" },
  { name: "جزر", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p106.jpg" },
  { name: "تفاح", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p107.jpg" },
  { name: "اناناس", price: 225, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p108.jpg" },
  { name: "مانجو", price: 250, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p109.jpg" },
  { name: "فريز", price: 225, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p110.jpg" },
  { name: "كيوي", price: 225, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p111.jpg" },
  { name: "دراق", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p112.jpg" },
  { name: "جزر و برتقال", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p113.jpg" },
  { name: "بطيخ", price: 200, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p114.jpg" },
  { name: "شمام", price: 225, category: "العصائر", unit: "كوب", image: "/assets/photos/beythalep/p115.jpg" },
  // الامبراطور
  { name: "امبراطور", price: 350, category: "الامبراطور", unit: "طبق", image: "/assets/photos/beythalep/p116.jpg" },
  { name: "اظان", price: 550, category: "الامبراطور", unit: "طبق", image: "/assets/photos/beythalep/p117.jpg" },
  // الكوكتيلات
  { name: "فواكه مشكلة", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p118.jpg" },
  { name: "موز و حليب", price: 225, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p119.jpg" },
  { name: "موز و حليب و فريز", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p120.jpg" },
  { name: "موز و حليب و شوكولا", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p121.jpg" },
  { name: "افوكادو", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p122.jpg" },
  { name: "افوكادو مع قشطة و عسل", price: 290, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p123.jpg" },
  { name: "موز و برتقال", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p124.jpg" },
  { name: "مانجو و حليب", price: 250, category: "الكوكتيلات", unit: "كوب", image: "/assets/photos/beythalep/p125.jpg" },
  // سلطات فواكه
  { name: "فخفخينا", price: 350, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p126.jpg" },
  { name: "نوتيلا", price: 350, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p127.jpg" },
  { name: "تويكس", price: 380, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p128.jpg" },
  { name: "سنيكرز", price: 380, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p129.jpg" },
  { name: "كرانش", price: 380, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p130.jpg" },
  { name: "كيندر", price: 380, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p131.jpg" },
  { name: "باوينتي", price: 380, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p132.jpg" },
  { name: "سلطة بيت حلب", price: 450, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p133.jpg" },
  { name: "قشطة و عسل و مكسرات", price: 350, category: "سلطات فواكه", unit: "كوب", image: "/assets/photos/beythalep/p134.jpg" },
  // ميلك شيك
  { name: "فانيليا", price: 220, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p135.jpg" },
  { name: "شوكولا", price: 220, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p136.jpg" },
  { name: "فريز", price: 220, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p137.jpg" },
  { name: "اوريو", price: 250, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p138.jpg" },
  { name: "كراميل", price: 220, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p139.jpg" },
  { name: "نسكافيه", price: 220, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p140.jpg" },
  { name: "كت كات", price: 250, category: "ميلك شيك", unit: "كوب", image: "/assets/photos/beythalep/p141.jpg" },
  // كريب
  { name: "كريب لوتس", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p142.jpg" },
  { name: "كريب شوكولا", price: 300, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p143.jpg" },
  { name: "كريب فواكه", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p144.jpg" },
  { name: "كريب ألاموند", price: 375, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p145.jpg" },
  { name: "كريب رول", price: 375, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p146.jpg" },
  { name: "كريب بيت حلب", price: 400, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p147.jpg" },
  { name: "كريب بستاشيو", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p148.jpg" },
  { name: "كريب شوكولا بيضاء", price: 300, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p149.jpg" },
  { name: "كريب أوريو", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p150.jpg" },
  { name: "كريب كندر", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p151.jpg" },
  { name: "كريب كتكات", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p152.jpg" },
  { name: "كريب فوتوشيني", price: 350, category: "كريب", unit: "قطعة", image: "/assets/photos/beythalep/p153.jpg" },
  // الوافل
  { name: "وافل لوتس", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p154.jpg" },
  { name: "وافل شوكولا", price: 300, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p155.jpg" },
  { name: "وافل بستاشيو", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p156.jpg" },
  { name: "وافل فواكه", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p157.jpg" },
  { name: "وافل ألاموند", price: 375, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p158.jpg" },
  { name: "وافل شوكولا بيضاء", price: 300, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p159.jpg" },
  { name: "وافل أوريو", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p160.jpg" },
  { name: "وافل كندر", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p161.jpg" },
  { name: "وافل كتكات", price: 350, category: "الوافل", unit: "قطعة", image: "/assets/photos/beythalep/p162.jpg" },
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const beythalepProductCatalog = [];

// Build full product objects from whichever catalog is populated (full when pushing, [] in repo).
const beythalepProducts = (beythalepProductCatalog.length ? beythalepProductCatalog : beythalepFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1790001 + index,
  storeId: beythalepStore.id
}));

const beythalepDeliverySettings = {
  [beythalepStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { beythalepStore, beythalepProducts, beythalepDeliverySettings };
}
