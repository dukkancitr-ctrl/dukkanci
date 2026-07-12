// Generated for هوا محل (Hawa Mahal) — Indian restaurant, Kuzey Yakası / Kayaşehir, Başakşehir/İstanbul.
// Source: https://hawamahall.com/ar/menu/5 (Toriom Laravel+Vue menu; branch 5 "كايا شهير").
// 77 products across 10 categories, every one with a unique real photo (md5-verified).
// Spice-level ("درجة الحرارة" 🌶️) modeled as a zero-price option group where the source offers a choice.
// NOTE: hawamahallProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const hawamahallStore = {
 "id": 77,
 "name": "هوا محل",
 "category": "مطاعم",
 "image": "/assets/photos/hawamahall/cover.jpg",
 "coverImage": "/assets/photos/hawamahall/cover.jpg",
 "logoImage": "/assets/photos/hawamahall/logo.png",
 "logo": "ه",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.1193943,
  "lng": 28.7749292
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=%D8%A7%D9%84%D9%85%D8%B7%D8%B9%D9%85%20%D8%A7%D9%84%D9%87%D9%86%D8%AF%D9%8A%20%D8%A7%D9%84%D9%81%D8%A7%D8%AE%D8%B1%20%D9%87%D9%88%D8%A7%20%D9%85%D8%AD%D9%84&query_place_id=ChIJYQHgicOvyhQRpZ8xbahRByc",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "هوا محل — مطعم هندي فاخر في كايا شهير بإسطنبول. نقدّم البرياني الأصيل (دجاج، لحم، جمبري، سمك، خضار وكاجو)، أطباق اللحم والدجاج بالصلصات الهندية (كورما، ماسالا، فيندالو، جالفريزي)، وجبات التنور والمشاوي (تكا، تندوري، سيخ كباب)، مأكولات بحرية، أطباق نباتية، خبز النان الطازج، شوربات ومقبلات، وحلويات ومشروبات هندية كالماسالا تشاي واللاسي. نكهات الهند الأصيلة تصل إلى بابك.",
 "address": "مشروع الواجهة الشمالية (Kuzey Yakası)، حي كايا باشي، شارع عدنان مندريس، بلوك A2 رقم 69، 34494 كايا شهير، باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 552 796 66 66",
 "whatsapp": "+90 552 796 66 66",
 "email": "",
 "website": "https://hawamahall.com",
 "sourceUrl": "https://hawamahall.com/ar/menu/5",
 "hours": "يومياً من 12:00 ظهراً حتى 12:00 منتصف الليل",
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

// Full catalog used ONLY for the Supabase push + first-paint fallback.
const hawamahallFullCatalog = [
 {
  "name": "برياني الدجاج",
  "price": 700,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/18.jpg",
  "sourceId": "18",
  "description": "الدجاج المتبل بالخلطة الهندية مع أرز بسمتي بالزعفران والأعشاب والبهارات.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني اللحم",
  "price": 1050,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/17.jpg",
  "sourceId": "17",
  "description": "لحم ضأني بالأرز البسمتي مع البهارات والأعشاب المميزة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني الجمبري",
  "price": 895,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/15.jpg",
  "sourceId": "15",
  "description": "جمبري مطبوخ بصوص الكاري الهندي مع أرز بسمتي بالخلطة المميزة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني السمك",
  "price": 895,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/16.jpg",
  "sourceId": "16",
  "description": "قطع من فيليه السمك المتبل بالخلطة الهندية مع أرز البسمتي المميز.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني الخضار",
  "price": 550,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/19.jpg",
  "sourceId": "19",
  "description": "تشكيلة من الخضار مع الأرز البسمتي بالتوابل المميزة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني بالكاجو",
  "price": 550,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/20.jpg",
  "sourceId": "20",
  "description": "أرز بسمتي بالطريقة الكشميرية مع الكاجو و قطع الزبيب المجفف بالتوابل المميزة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "برياني سادة",
  "price": 250,
  "category": "البرياني",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/21.jpg",
  "sourceId": "21",
  "description": "أرز بسمتي مطبوخ بالتوابل على الطريقة الهندية.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "لامب كورما",
  "price": 1050,
  "category": "اللحم بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/58.jpg",
  "sourceId": "58",
  "description": "قطع من لحم الغنم مطبوخة بصلصة البصل و الزبادي مع خلطة من التوابل الهندية المميزة + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "بونا غوشت ماسالا",
  "price": 1050,
  "category": "اللحم بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/60.jpg",
  "sourceId": "60",
  "description": "لحم الضأن المطبوخ مع الفلفل الأخضر والزنجبيل والثوم والبصل يرش الكزبرة الطازجة على الوجه.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "رارا جوشت",
  "price": 1050,
  "category": "اللحم بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/61.jpg",
  "sourceId": "61",
  "description": "مكعبات بدون عظم ولحم مفروم مطبوخ مع البهارات.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "أكبري جوشت",
  "price": 1050,
  "category": "اللحم بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/59.jpg",
  "sourceId": "59",
  "description": "لحم ضأني مخلي من العظام بصوص الجوشت الكريمي المميز + أرز برياني."
 },
 {
  "name": "دجاج بالزبدة",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/62.jpg",
  "sourceId": "62",
  "description": "قطع دجاج مطبوخة مع صلصة الطماطم الهندية المميزة وكريمة الزبدة + أرز برياني."
 },
 {
  "name": "شاهي مورگ",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/63.jpg",
  "sourceId": "63",
  "description": "دجاج بدون عظم بداخل الصوص الأبيض الخاص مع تشكيلة من البهارات الهندية المميزة + أرز برياني."
 },
 {
  "name": "تشيكن كورما",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/64.jpg",
  "sourceId": "64",
  "description": "قطع دجاج بدون عظم مع البهارات الهندية المميزة وصلصة الكورما + أرز برياني."
 },
 {
  "name": "تشيكن تكا ماسالا",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/66.jpg",
  "sourceId": "66",
  "description": "قطع صدر دجاج مشوية بالتندور ومطبوخة بصوص الماسلا الشهير + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "دجاج جالفريزي",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/67.jpg",
  "sourceId": "67",
  "description": "دجاج مسحب مطبوخ بالصلصة الصفراء مع الفلفل الأحمر والأخضر الحلو.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "دجاج 65",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/68.jpg",
  "sourceId": "68",
  "description": "يشتهر باسمه بالدجاج الحار اللذيذ المطبوخ في البهارات النادرة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "تشيلي تشيكن",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/69.jpg",
  "sourceId": "69",
  "description": "دجاج متبل مقلي مع فلفل اخضر و صوص فلفل احمر.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "تشيكن فيندالو الحار",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/70.jpg",
  "sourceId": "70",
  "description": "طبق من الدجاج مع صلصة الفيندالو الحارة المميزة وقطع من البطاطا + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "كاداي تشيكن",
  "price": 700,
  "category": "الدجاج بالصوص",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/65.jpg",
  "sourceId": "65",
  "description": "طبق لذيذ محضر من الدجاج والبصل والطماطم والزنجبيل والثوم والتوابل المطحونة الطازجة + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "ليسوني تيكا",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/54.jpg",
  "sourceId": "54",
  "description": "قطع صدر دجاج متبلة بالثوم والأعشاب المشوية علي الفحم بالتندور."
 },
 {
  "name": "تندوري ران",
  "price": 1100,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/47.jpg",
  "sourceId": "47",
  "description": "فخذ غنم على الطريقة المهرانية مطبوخ بالتوابل الهندية لساعات طويلة بقوامه الرائع وطعمه الشهي.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "ريشمي كباب",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/55.jpg",
  "sourceId": "55",
  "description": "كباب دجاج مع المكسرات والجبنة مشوي بالتنور."
 },
 {
  "name": "دجاج بالتنور ( بالعظم )",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/51.jpg",
  "sourceId": "51",
  "description": "أفخاذ الدجاج مع العظام متبلة في مزيج من الزبادي والزنجبيل ومعجون الثوم وغرام ماسالا ومطبوخة في التندور."
 },
 {
  "name": "مورج مالاي تيكا",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/52.jpg",
  "sourceId": "52",
  "description": "قطع فخذ دجاج بدون عظم متبلة بالكريمة والجبنة المشوية بالتنور."
 },
 {
  "name": "دجاج تكا",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/50.jpg",
  "sourceId": "50",
  "description": "قطع صدر دجاج المتبلة على الطريقة الهندية والمشوية بالتنور."
 },
 {
  "name": "سيخ كباب هندي",
  "price": 1050,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/49.jpg",
  "sourceId": "49",
  "description": "لفائف طرية من لحم الغنم المفروم ممزوجة بالزنجبيل الطازج والأعشاب والبهارات مشوية على الفحم.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "كالي ميراشي تيكا",
  "price": 700,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/53.jpg",
  "sourceId": "53",
  "description": "مكعبات من أفخاذ الدجاج منزوعة العظم متبلة بالزبادي الكريمي والفلفل الأسود المسحوق ومشوية على الفحم."
 },
 {
  "name": "بيشاوري تيكا",
  "price": 1050,
  "category": "وجبات التنور",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/48.jpg",
  "sourceId": "48",
  "description": "مكعبات لحم بدون عظم متبلة بالزبادي والبهارات مطبوخة في التندور.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "جمبري جامبو كاداي",
  "price": 1000,
  "category": "المأكولات البحرية",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/41.jpg",
  "sourceId": "41",
  "description": "جمبري جامبو مشوي مع الصوص الأحمر المميز بالتنور."
 },
 {
  "name": "سمك بالتنور",
  "price": 950,
  "category": "المأكولات البحرية",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/42.jpg",
  "sourceId": "42",
  "description": "سمك مشوي"
 },
 {
  "name": "سمك ماسالا",
  "price": 950,
  "category": "المأكولات البحرية",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/56.jpg",
  "sourceId": "56",
  "description": "قطع من سمك الفيليه بصوص الماسلا الهندي المميز + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "جمبري ماسالا",
  "price": 950,
  "category": "المأكولات البحرية",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/57.jpg",
  "sourceId": "57",
  "description": "جمبري بصوص الماسالا الرائع + أرز برياني.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "خضار كورما ميكس",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/11.jpg",
  "sourceId": "11",
  "description": "مجموعة من الخضار المحضر بالطريقة الهندية مع بصوص الكورما المميز.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "سبانخ بالجبنة",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/8.jpg",
  "sourceId": "8",
  "description": "جبنة مشوية بالتندور مع صوص السبانخ بالطريقة الهندية الرائعة."
 },
 {
  "name": "كوم ماكاي بالك",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/9.jpg",
  "sourceId": "9",
  "description": "سبانخ بالفطر والذرة والبهارات والأعشاب الهندية المميزة."
 },
 {
  "name": "الو جوبي",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/12.jpg",
  "sourceId": "12",
  "description": "قرنبيط بالبطاطس و صوص الطماطم المطبوخة مع الزنجبيل والتوابل الهندية.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️",
     "🌶️🌶️🌶️"
    ],
    "extra": [
     0,
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "باذنجان بالصوص",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/13.jpg",
  "sourceId": "13",
  "description": "باذنجان مطبوخ مع نكهة المرق الأصفر مع الحلبة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "دال ماكني",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/14.jpg",
  "sourceId": "14",
  "description": "عدس اسود مطبوخ مع التوابل الهندية المميزة مع الزبدة والكريما الفاخرة لمدة 24 ساعة."
 },
 {
  "name": "بامية بالبصل",
  "price": 550,
  "category": "النباتي",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/10.jpg",
  "sourceId": "10",
  "description": "البامية المعروفة أيضًا بإصبع السيدة المطبوخة مع البصل والفلفل الأخضر مع رش أوراق الكزبرة الطازجة.",
  "options": [
   {
    "name": "درجة الحرارة",
    "values": [
     "🌶️",
     "🌶️🌶️"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "تيكا نان",
  "price": 200,
  "category": "المقبلات",
  "unit": "رغيف",
  "image": "/assets/photos/hawamahall/23.jpg",
  "sourceId": "23",
  "description": "خبزة دجاج النان الهندية الشهيرة بخلطة الشواء المميزة."
 },
 {
  "name": "تشييز نان",
  "price": 200,
  "category": "المقبلات",
  "unit": "رغيف",
  "image": "/assets/photos/hawamahall/24.jpg",
  "sourceId": "24",
  "description": "خبزة النان الشهيرة المحشية بالجبنة المعدة بفرن التنور."
 },
 {
  "name": "نان بالثوم",
  "price": 135,
  "category": "المقبلات",
  "unit": "رغيف",
  "image": "/assets/photos/hawamahall/25.jpg",
  "sourceId": "25",
  "description": "خبزة النان الهندية الشهيرة بنكهة الثوم المميزة المعدة بفرن التنور."
 },
 {
  "name": "بلاين نان",
  "price": 100,
  "category": "المقبلات",
  "unit": "رغيف",
  "image": "/assets/photos/hawamahall/26.jpg",
  "sourceId": "26",
  "description": "خبز النان السادة الهندي الشهير المعد بالتنور."
 },
 {
  "name": "سمبوسة الدجاج",
  "price": 195,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/33.jpg",
  "sourceId": "33",
  "description": "سمبوسة الدجاج المقرمشة اللذيذة أربع قطع"
 },
 {
  "name": "سمبوسة اللحم",
  "price": 295,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/34.jpg",
  "sourceId": "34",
  "description": "سمبوسة اللحم المقرمشة اللذيذة أربع قطع"
 },
 {
  "name": "سمبوسة الخضار",
  "price": 195,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/32.jpg",
  "sourceId": "32",
  "description": "سمبوسة الخضار المقرمشة اللذيذة أربع قطع"
 },
 {
  "name": "تشيكن باكورا",
  "price": 295,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/35.jpg",
  "sourceId": "35",
  "description": "شرائح دجاج متبلة و مقلية تقدم مع صلصة التمر الهندي."
 },
 {
  "name": "كرك رول",
  "price": 295,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/36.jpg",
  "sourceId": "36",
  "description": "لفائف الدجاج المقرمشة محشوة بالجبن."
 },
 {
  "name": "كرات البصل الذهبية",
  "price": 225,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/37.jpg",
  "sourceId": "37",
  "description": "كرات البصل المقلية الذهبية."
 },
 {
  "name": "بانيير تيكا",
  "price": 650,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/43.jpg",
  "sourceId": "43",
  "description": "قطع من الجبنة المشوية بالتنور بخلطة الشواء والزبادي والأعشاب الهندية."
 },
 {
  "name": "سلطة الرايتا المميزة",
  "price": 200,
  "category": "المقبلات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/22.jpg",
  "sourceId": "22",
  "description": "سلطة الرايتا المميزة"
 },
 {
  "name": "شوربة الدجاج",
  "price": 195,
  "category": "الشوربة",
  "unit": "وعاء",
  "image": "/assets/photos/hawamahall/38.jpg",
  "sourceId": "38",
  "description": "شوربة الدجاج."
 },
 {
  "name": "شوربة الفطر",
  "price": 190,
  "category": "الشوربة",
  "unit": "وعاء",
  "image": "/assets/photos/hawamahall/39.jpg",
  "sourceId": "39",
  "description": "شوربة الفطر"
 },
 {
  "name": "شوربة الطماطم",
  "price": 190,
  "category": "الشوربة",
  "unit": "وعاء",
  "image": "/assets/photos/hawamahall/40.jpg",
  "sourceId": "40",
  "description": "شوربة الطماطم"
 },
 {
  "name": "حلوى الجزر",
  "price": 200,
  "category": "الحلويات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/27.jpg",
  "sourceId": "27",
  "description": "حلوى الجزر الهندية المشهورة بالمكسرات."
 },
 {
  "name": "جولاب جامون",
  "price": 200,
  "category": "الحلويات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/28.jpg",
  "sourceId": "28",
  "description": "حلوى كرات الجامون اللذيذة و الشهيرة المصنعة من العجين والحليب والتوابل مع قطر السكر."
 },
 {
  "name": "آيس كريم جوز الهند",
  "price": 225,
  "category": "الحلويات",
  "unit": "طبق",
  "image": "/assets/photos/hawamahall/29.jpg",
  "sourceId": "29",
  "description": "آيس كريم جوز الهند اللذيذ بالطريقة الهندية المميزة."
 },
 {
  "name": "مانجو لاسي",
  "price": 225,
  "category": "المشروبات",
  "unit": "كوب",
  "image": "/assets/photos/hawamahall/30.jpg",
  "sourceId": "30",
  "description": "خليط من المانجو الطبيعي مع الزبادي و العسل."
 },
 {
  "name": "شاي ماسالا",
  "price": 100,
  "category": "المشروبات",
  "unit": "كوب",
  "image": "/assets/photos/hawamahall/31.jpg",
  "sourceId": "31",
  "description": "شاي بالتوابل الهندية اللذيذة و الحليب."
 },
 {
  "name": "كولا توركا 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/89.jpg",
  "sourceId": "89",
  "description": "كولا توركا 330 مل"
 },
 {
  "name": "لاسي مالح",
  "price": 180,
  "category": "المشروبات",
  "unit": "كوب",
  "image": "/assets/photos/hawamahall/77.jpg",
  "sourceId": "77",
  "description": "عيران طبيعي مالح"
 },
 {
  "name": "جو أب برتقال 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/90.jpg",
  "sourceId": "90",
  "description": "جو أب برتقال 330 مل"
 },
 {
  "name": "جو أب تفاح أخضر 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/107.jpg",
  "sourceId": "107",
  "description": "جو أب تفاح أخضر 330 مل"
 },
 {
  "name": "لاسي حلو",
  "price": 180,
  "category": "المشروبات",
  "unit": "كوب",
  "image": "/assets/photos/hawamahall/76.jpg",
  "sourceId": "76",
  "description": "عيران حلو"
 },
 {
  "name": "جو أب ليمون 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/91.jpg",
  "sourceId": "91",
  "description": "جو أب ليمون 330 مل"
 },
 {
  "name": "ساريير صودا بالكرمنتينا 330 مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/104.jpg",
  "sourceId": "104",
  "description": "ساريير صودا بالكرمنتينا 330 مل"
 },
 {
  "name": "صودا التوت الشامي و الكشمش 200مل",
  "price": 40,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/99.jpg",
  "sourceId": "99",
  "description": "صودا التوت الشامي و الكشمش 200مل"
 },
 {
  "name": "صودا الليمون 200مل",
  "price": 40,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/100.jpg",
  "sourceId": "100",
  "description": "صودا الليمون 200مل"
 },
 {
  "name": "صودا المانجو و الأناناس 200مل",
  "price": 40,
  "category": "المشروبات",
  "unit": "رغيف",
  "image": "/assets/photos/hawamahall/101.jpg",
  "sourceId": "101",
  "description": "صودا المانجو و الأناناس 200مل"
 },
 {
  "name": "صودا التفاح 200مل",
  "price": 40,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/102.jpg",
  "sourceId": "102",
  "description": "صودا التفاح 200مل"
 },
 {
  "name": "صودا الكلمنتينة 200مل",
  "price": 40,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/103.jpg",
  "sourceId": "103",
  "description": "صودا الكلمنتينة 200مل"
 },
 {
  "name": "عصير برتقال 250مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/105.jpg",
  "sourceId": "105"
 },
 {
  "name": "عصير مانجا 250مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/106.jpg",
  "sourceId": "106"
 },
 {
  "name": "آيس تي بالدراق 250مل",
  "price": 60,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/92.jpg",
  "sourceId": "92",
  "description": "آيس تي بالدراق 250مل"
 },
 {
  "name": "مياه معدنية 500 مل",
  "price": 30,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/72.jpg",
  "sourceId": "72",
  "description": "مياه معدنية 500 مل"
 },
 {
  "name": "عيران 270ml",
  "price": 50,
  "category": "المشروبات",
  "unit": "علبة",
  "image": "/assets/photos/hawamahall/71.jpg",
  "sourceId": "71",
  "description": "عيران 270ml"
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const hawamahallProductCatalog = [];

const hawamahallProducts = (hawamahallProductCatalog.length ? hawamahallProductCatalog : hawamahallFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1610001 + index,
  storeId: hawamahallStore.id
}));

const hawamahallDeliverySettings = {
  [hawamahallStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { hawamahallStore, hawamahallProducts, hawamahallDeliverySettings };
}
