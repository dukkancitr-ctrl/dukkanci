// Generated for مطعم البركة الفلسطيني (Baraka Palestinian Restaurant) — Kaya Şehir, Başakşehir/İstanbul.
// Source: https://baraka-restoran.com (minidine / miniandmore qrmenu platform, branch baraka-restoran).
// Native Arabic menu; 103 products, each with a unique real photo.
// NOTE: barakaProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const barakaStore = {
 "id": 69,
 "name": "مطعم البركة الفلسطيني",
 "category": "مطاعم",
 "image": "/assets/photos/baraka/cover.jpg",
 "coverImage": "/assets/photos/baraka/cover.jpg",
 "logoImage": "/assets/photos/baraka/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1207594,
  "lng": 28.7743353
 },
 "mapUrl": "https://maps.app.goo.gl/bQ8ZnS71xgabxvfCA",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم البركة الفلسطيني في كايا شهير (باشاك شهير) بإسطنبول — نكهات فلسطينية أصيلة: المسخّن والمقلوبة والمنسف والمندي والقدرة والملوخية والمفتول والفتّة، مشاوٍ على الفحم وريش وشقف لحم، صواني وفخّارات، سلطات ومقبلات وشوربات، وفطور فلسطيني كامل. أطباق بيتية بمكوّنات طازجة تصل إلى بابك.",
 "address": "كايا شهير، باشاك شهير، إسطنبول 34494، تركيا",
 "phone": "+90 533 691 79 88",
 "whatsapp": "+90 533 691 79 88",
 "email": "",
 "website": "https://baraka-restoran.com",
 "sourceUrl": "https://baraka-restoran.com/ar/?branch=baraka-restoran",
 "hours": "يومياً من 12:30 ظهراً حتى 11:30 مساءً",
 "areas": [
  "كايا شهير",
  "باشاك شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo.
const barakaFullCatalog = [
 {
  "name": "قدرة نصف دجاجة",
  "price": 390,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3761758808418.jpg",
  "sourceId": "0de19b3b"
 },
 {
  "name": "رز سادة قدرة",
  "price": 190,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1331758808745.jpg",
  "sourceId": "90d45c13"
 },
 {
  "name": "بامية مع رز",
  "price": 340,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3121758808705.jpg",
  "sourceId": "32e394a9"
 },
 {
  "name": "ملوخية",
  "price": 240,
  "category": "المطبخ الشرقي",
  "unit": "طبق",
  "image": "/assets/photos/baraka/9121758809929.jpg",
  "sourceId": "b6634ced",
  "description": "ملوخية على الطريقة الفلسطينية — اختر النوع.",
  "options": [
   {
    "name": "النوع",
    "values": [
     "سادة (سفري)",
     "مع رز",
     "مع نصف دجاجة",
     "مع لحم"
    ],
    "extra": [
     0,
     100,
     250,
     550
    ]
   }
  ]
 },
 {
  "name": "فتة نصف دجاجة",
  "price": 450,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5301758808347.jpg",
  "sourceId": "28a0e28f"
 },
 {
  "name": "منسف نصف دجاجة",
  "price": 490,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/671759749912.jpg",
  "sourceId": "bdfe989b"
 },
 {
  "name": "رز سادة أوزي",
  "price": 190,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4421768569355.jpg",
  "sourceId": null
 },
 {
  "name": "رز  سادة ابيض",
  "price": 190,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8051758808727.jpg",
  "sourceId": "6d297482"
 },
 {
  "name": "أوزي نصف دجاجة",
  "price": 390,
  "category": "المطبخ الشرقي",
  "unit": "صحن",
  "image": "/assets/photos/baraka/2051761829519.jpg",
  "sourceId": null
 },
 {
  "name": "رز سادة منسف",
  "price": 190,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1641758808784.jpg",
  "sourceId": "d5f3d8ac"
 },
 {
  "name": "مسخن نصف دجاجة",
  "price": 520,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3191758808504.jpg",
  "sourceId": "d27d4204",
  "options": [
   {
    "name": "خبز مسخن إضافي",
    "values": [
     "بدون",
     "مع"
    ],
    "extra": [
     0,
     210
    ]
   }
  ]
 },
 {
  "name": "مفتول نص دجاجة",
  "price": 490,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5741758809769.jpg",
  "sourceId": "b5527fec",
  "description": "متوفر يوم السبت من كل اسبوع"
 },
 {
  "name": "مندي نصف دجاجة",
  "price": 390,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1731758808633.jpg",
  "sourceId": "dbf6a1ea"
 },
 {
  "name": "مفتول مع يخني",
  "price": 290,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/7401758810247.jpg",
  "sourceId": "d49a47a0",
  "description": "متوفر يوم السبت من كل اسبوع"
 },
 {
  "name": "أوزي لحم",
  "price": 690,
  "category": "المطبخ الشرقي",
  "unit": "صحن",
  "image": "/assets/photos/baraka/7461761829568.jpg",
  "sourceId": null
 },
 {
  "name": "رز سادة مندي",
  "price": 190,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3471758808763.jpg",
  "sourceId": "491d628c"
 },
 {
  "name": "مقلوبة نصف دجاجة",
  "price": 490,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2381758809809.jpg",
  "sourceId": "3e7902b7",
  "description": "متوفرة كل أيام الجمعه . السبت . الاحد"
 },
 {
  "name": "منسف لحم",
  "price": 790,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9091758808224.jpg",
  "sourceId": "ac29a0a4"
 },
 {
  "name": "مندي لحم",
  "price": 690,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6841758808208.jpg",
  "sourceId": "6b04149a"
 },
 {
  "name": "قدرة لحم",
  "price": 690,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4611758807933.jpg",
  "sourceId": "66c25ccb"
 },
 {
  "name": "فتة لحم",
  "price": 760,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6371758807906.jpg",
  "sourceId": "c25f346d"
 },
 {
  "name": "مفتول لحم",
  "price": 790,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4911758810008.jpg",
  "sourceId": "5ffcac65",
  "description": "متوفر يوم السبت من كل اسبوع"
 },
 {
  "name": "مقلوبة لحم",
  "price": 790,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8421758808034.jpg",
  "sourceId": "55aef9b1",
  "description": "متوفرة ايام الجمعه . السبت . الاحد"
 },
 {
  "name": "بامية لحم",
  "price": 790,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/451758808092.jpg",
  "sourceId": "a21dcda2"
 },
 {
  "name": "فخارة قدرة لحم",
  "price": 840,
  "category": "المطبخ الشرقي",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2971758810099.jpg",
  "sourceId": "8fd95c02",
  "description": "ملاحظة : يتم الطلب قبل 3 ساعات على الأقل و أصغر فخاره تكفي 6 أشخاص- وحصة الشخص 840 ليرة",
  "options": [
   {
    "name": "قطعة لحم إضافية",
    "values": [
     "بدون",
     "مع"
    ],
    "extra": [
     0,
     450
    ]
   }
  ]
 },
 {
  "name": "فخارة البركة قدرة",
  "price": 840,
  "category": "المطبخ الشرقي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/2601758810172.jpg",
  "sourceId": null,
  "description": "ملاحظة : يتم الطلب قبل 3 ساعات على الأقل و أصغر فخاره تكفي 6 أشخاص- حصة الشخص 840 ليرة"
 },
 {
  "name": "عرايس كفتة البركة",
  "price": 490,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/5701758811213.jpg",
  "sourceId": "4a3763a4"
 },
 {
  "name": "وجبة كباب فلسطيني",
  "price": 680,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/1041758811303.jpg",
  "sourceId": "8e288470",
  "description": "لحم عجل وخروف بالتوابل الفلسطينية"
 },
 {
  "name": "وجبة شقف لحم مشوي",
  "price": 870,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/5991758811268.jpg",
  "sourceId": "437a910e"
 },
 {
  "name": "وجبة ريش خروف مشوية",
  "price": 870,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/5411758811241.jpg",
  "sourceId": "2f65010c"
 },
 {
  "name": "وجبة شيش طاووق",
  "price": 430,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/5661758811435.jpg",
  "sourceId": "e6b714e8"
 },
 {
  "name": "وجبة كباب دجاج",
  "price": 430,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/3161758811462.jpg",
  "sourceId": "4f6b90dd"
 },
 {
  "name": "وجبة دجاج مشوي عالفحم",
  "price": 430,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/7011758811411.jpg",
  "sourceId": "70fd3435"
 },
 {
  "name": "وجبة مشاوي مشكل لحم ودجاج",
  "price": 680,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/8871759749801.jpg",
  "sourceId": "1d09144a"
 },
 {
  "name": "وجبة مشاوي البركة VIP",
  "price": 830,
  "category": "المشاوي",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/4401758811559.jpg",
  "sourceId": "972e0a61"
 },
 {
  "name": "وجبة محاشي (الجمعة-السبت)",
  "price": 490,
  "category": "صواني وفخارات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/4621782482667.jpg",
  "sourceId": null
 },
 {
  "name": "وجبة كفتة لحم بالطحينة",
  "price": 690,
  "category": "صواني وفخارات",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/3331758810638.jpg",
  "sourceId": "a4ea277b"
 },
 {
  "name": "وجبة كفتة لحم بالبندورة",
  "price": 690,
  "category": "صواني وفخارات",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/151758810669.jpg",
  "sourceId": "a3064559"
 },
 {
  "name": "فخارة ورق عنب بلحم الخروف",
  "price": 790,
  "category": "صواني وفخارات",
  "unit": "وجبة",
  "image": "/assets/photos/baraka/8681758810701.jpg",
  "sourceId": "81e17bea"
 },
 {
  "name": "صحن مخلالات",
  "price": 120,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/6501758808942.jpg",
  "sourceId": null,
  "description": "مخلل زيتون اخضر"
 },
 {
  "name": "سلطة البركة المشكل",
  "price": 460,
  "category": "السلطات والمقبلات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8181759837301.jpg",
  "sourceId": null
 },
 {
  "name": "سلطة جرجير",
  "price": 230,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/6841758893284.jpg",
  "sourceId": null
 },
 {
  "name": "سلطة خضار",
  "price": 210,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/9081759090629.jpg",
  "sourceId": "f67afc01"
 },
 {
  "name": "سلطة فتوش",
  "price": 230,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/3541758810403.jpg",
  "sourceId": "46181ded"
 },
 {
  "name": "سلطة تبولة",
  "price": 240,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/1391758810475.jpg",
  "sourceId": "f9e68c15"
 },
 {
  "name": "صحن حمص",
  "price": 190,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/2421758808923.jpg",
  "sourceId": "c86384d5"
 },
 {
  "name": "صحن متبل باذنجان",
  "price": 190,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/881758809027.jpg",
  "sourceId": "136835f7"
 },
 {
  "name": "صحن سلطة غزاوية حراقة",
  "price": 230,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/3501758810364.jpg",
  "sourceId": "c71bbd8b"
 },
 {
  "name": "سلطة طحينية",
  "price": 240,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/3521759091462.jpg",
  "sourceId": "0064733a"
 },
 {
  "name": "كبة مقلية ( قطعه واحدة)",
  "price": 160,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/6961758809122.jpg",
  "sourceId": "682ebb14",
  "description": "الحبه الواحدة"
 },
 {
  "name": "كبة مشوية ( قطعه واحدة)",
  "price": 210,
  "category": "السلطات والمقبلات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3201758809097.jpg",
  "sourceId": "f5752914"
 },
 {
  "name": "بطاطس مقلية",
  "price": 210,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/2971759750832.jpg",
  "sourceId": "ec72f51d"
 },
 {
  "name": "صحن ورق عنب مقبلات",
  "price": 230,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/5131758809065.jpg",
  "sourceId": "cf8a836f",
  "description": "ورق عنب"
 },
 {
  "name": "صحن كريم ثوم",
  "price": 70,
  "category": "السلطات والمقبلات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/441767010193.jpg",
  "sourceId": "bf2f07a5"
 },
 {
  "name": "لبن زبادي",
  "price": 130,
  "category": "السلطات والمقبلات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6371758809146.jpg",
  "sourceId": "11395aad"
 },
 {
  "name": "لبن وخيار",
  "price": 190,
  "category": "السلطات والمقبلات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5251759065203.jpg",
  "sourceId": "6f237256"
 },
 {
  "name": "جميد",
  "price": 150,
  "category": "الشوربات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8461759066166.jpg",
  "sourceId": null
 },
 {
  "name": "شوربة عدس",
  "price": 130,
  "category": "الشوربات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/2321758809454.jpg",
  "sourceId": "e6195a0b"
 },
 {
  "name": "شوربة فريكة",
  "price": 150,
  "category": "الشوربات",
  "unit": "صحن",
  "image": "/assets/photos/baraka/4751758809493.jpg",
  "sourceId": "971aa3fd"
 },
 {
  "name": "ليمون فريش - توت",
  "price": 90,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/531770477428.jpg",
  "sourceId": null
 },
 {
  "name": "ليمون فريش - نعنع",
  "price": 90,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2501770477475.jpg",
  "sourceId": null
 },
 {
  "name": "عصير فراولة طبيعي",
  "price": 180,
  "category": "المشروبات والحلويات",
  "unit": "كوب",
  "image": "/assets/photos/baraka/2831767010012.jpg",
  "sourceId": null
 },
 {
  "name": "شاي عادي",
  "price": 50,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6521767009801.jpg",
  "sourceId": "3efc83fe"
 },
 {
  "name": "عصير برتقال طبيعي (موسمي)",
  "price": 180,
  "category": "المشروبات والحلويات",
  "unit": "كوب",
  "image": "/assets/photos/baraka/6881767009984.jpg",
  "sourceId": null
 },
 {
  "name": "حلوى عيش السرايا",
  "price": 220,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2461770476534.jpg",
  "sourceId": null
 },
 {
  "name": "كولا توركا",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/231770477110.jpg",
  "sourceId": null
 },
 {
  "name": "عصير الفواكه",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2531770477322.jpg",
  "sourceId": null
 },
 {
  "name": "عصير ليمون مع نعناع طبيعي",
  "price": 180,
  "category": "المشروبات والحلويات",
  "unit": "كوب",
  "image": "/assets/photos/baraka/3801767010040.jpg",
  "sourceId": null
 },
 {
  "name": "كولا كازوز",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9511770477665.jpg",
  "sourceId": null
 },
 {
  "name": "ماندرين برتقال",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5401770477542.jpg",
  "sourceId": null
 },
 {
  "name": "براد شاي (6 أشخاص)",
  "price": 190,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4751769424335.jpg",
  "sourceId": null
 },
 {
  "name": "صحن كعك فلسطيني 4 حبات",
  "price": 150,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/7541767009906.jpg",
  "sourceId": null
 },
 {
  "name": "حلوى كريم كراميل",
  "price": 170,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9611763114840.jpg",
  "sourceId": null
 },
 {
  "name": "كولا زيرو",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1761770477221.jpg",
  "sourceId": null
 },
 {
  "name": "عصير مانجا طبيعي",
  "price": 180,
  "category": "المشروبات والحلويات",
  "unit": "كوب",
  "image": "/assets/photos/baraka/8191767010069.jpg",
  "sourceId": null
 },
 {
  "name": "حلوى تاراميسيو",
  "price": 220,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4271770476765.jpg",
  "sourceId": null
 },
 {
  "name": "ليمون فريش - مانجو",
  "price": 90,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8261770477451.jpg",
  "sourceId": null
 },
 {
  "name": "علبة كعك فلسطيني",
  "price": 480,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2151769424405.jpg",
  "sourceId": null
 },
 {
  "name": "عيران",
  "price": 70,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1921759837448.jpg",
  "sourceId": "c916ec73"
 },
 {
  "name": "صودا مشكل",
  "price": 60,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/1631656083822.jpg",
  "sourceId": "19bcf6e7"
 },
 {
  "name": "ماء (صغير)",
  "price": 40,
  "category": "المشروبات والحلويات",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2771759063954.jpg",
  "sourceId": "63a5663c"
 },
 {
  "name": "بيض مقلي اومليت",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3271768218212.jpg",
  "sourceId": "9917bf09"
 },
 {
  "name": "صحن سيرفيس خضار",
  "price": 90,
  "category": "الافطار الفلسطيني",
  "unit": "صحن",
  "image": "/assets/photos/baraka/4931766055207.jpg",
  "sourceId": null
 },
 {
  "name": "حمص باللحمة والمكسرات",
  "price": 530,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6311767009331.jpg",
  "sourceId": "cebaa46b"
 },
 {
  "name": "مسبحة (فول + حمص )",
  "price": 210,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5101762254783.jpg",
  "sourceId": "a8a6d08e"
 },
 {
  "name": "منقوشة جبنة مع زعتر",
  "price": 230,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/7551768218074.jpg",
  "sourceId": "45e60d09"
 },
 {
  "name": "فطور تركي لشخصين",
  "price": 1520,
  "category": "الافطار الفلسطيني",
  "unit": "صحن",
  "image": "/assets/photos/baraka/3471778617711.jpg",
  "sourceId": null
 },
 {
  "name": "صحن فلافل",
  "price": 170,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9771762254965.jpg",
  "sourceId": "0c4b77f7"
 },
 {
  "name": "منقوشة دقة غزاويه",
  "price": 150,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2741767009024.jpg",
  "sourceId": "f859b4bd"
 },
 {
  "name": "منقوشة لحمة",
  "price": 350,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/5071770477721.jpg",
  "sourceId": null
 },
 {
  "name": "بيض مقلي عيون",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9451762255019.jpg",
  "sourceId": "9c0a1992"
 },
 {
  "name": "قدسية حمص",
  "price": 210,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/3671762255282.jpg",
  "sourceId": "76e27fbf"
 },
 {
  "name": "فول بالطحينيه",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/691762336620.jpg",
  "sourceId": "ba438b3d"
 },
 {
  "name": "منقوشة جبنة مع زيتون",
  "price": 250,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/2421767009052.jpg",
  "sourceId": "a82c96e7"
 },
 {
  "name": "منقوشة جبنة عكاوي",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/4031767009082.jpg",
  "sourceId": "b26a9393"
 },
 {
  "name": "مفركه ( بطاطا + بيض )",
  "price": 210,
  "category": "الافطار الفلسطيني",
  "unit": "صحن",
  "image": "/assets/photos/baraka/5731762255176.jpg",
  "sourceId": null
 },
 {
  "name": "شكشوكه",
  "price": 260,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/8441768218241.jpg",
  "sourceId": "b2dff9f1"
 },
 {
  "name": "قلاية بندورة",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6471762255088.jpg",
  "sourceId": "3214e56a"
 },
 {
  "name": "حمص بالطحينيه",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/7581762265721.jpg",
  "sourceId": "bbe17929"
 },
 {
  "name": "فول غزاوي",
  "price": 190,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6091762254839.jpg",
  "sourceId": "3d7eebbb"
 },
 {
  "name": "منقوشة البركة الخاصة",
  "price": 270,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/9751768218004.jpg",
  "sourceId": "8164c9a8"
 },
 {
  "name": "فطور تركي لشخص واحد",
  "price": 890,
  "category": "الافطار الفلسطيني",
  "unit": "صحن",
  "image": "/assets/photos/baraka/7531778617556.jpg",
  "sourceId": null
 },
 {
  "name": "منقوشة زعتر",
  "price": 150,
  "category": "الافطار الفلسطيني",
  "unit": "قطعة",
  "image": "/assets/photos/baraka/6561767009284.jpg",
  "sourceId": "1197db3f"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const barakaProductCatalog = [];

const barakaProducts = (barakaProductCatalog.length ? barakaProductCatalog : barakaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1530001 + index,
  storeId: barakaStore.id
}));

const barakaDeliverySettings = {
  [barakaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { barakaStore, barakaProducts, barakaDeliverySettings };
}
