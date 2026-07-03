// Generated for Beyazit Peynir (بيازيد — Özgün peynir) — Atakent, Küçükçekmece / İstanbul.
// Source: https://beyazitpeynir.odoo.com/shop (Odoo 19 e-commerce; native Arabic names, TRY).
// Specialty foods shop (cheeses, cold cuts, olives, honey, dates, bakery...). Category
// «مواد غذائية متخصصة». 88 source products -> 82 products: 6 size/flavor sibling groups that
// shared one source photo were merged into option-group products (dates, molasses, juices,
// ghee, protina x2); the 3-bottle juice lineup was cropped into per-flavor mango/strawberry
// photos. Every product has a unique real photo. Store id 83, product block 1670001.
// NOTE: beyazitProductCatalog is intentionally emptied in the repo (perf) — the full catalog
// lives in Supabase and is pushed via a guarded-insert script.
const beyazitStore = {
 "id": 83,
 "name": "أجبان بيازيد",
 "category": "مواد غذائية متخصصة",
 "image": "/assets/photos/beyazit/cover.jpg",
 "coverImage": "/assets/photos/beyazit/cover.jpg",
 "logoImage": "/assets/photos/beyazit/logo.png",
 "logo": "أ",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 200,
 "time": "45 - 90 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0451968,
  "lng": 28.7899648
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=Beyazit%20Peynir&query_place_id=ChIJKdek5ntftRQR6NGV4B_vpVg",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "أجبان بيازيد (Beyazit Peynir) — متجر متخصص بالأجبان والمواد الغذائية الطبيعية في أتاكنت، كوتشوك تشكمجة بإسطنبول، قائم منذ 2015. تشكيلة واسعة من الأجبان التركية والعربية (رومي، قشقوان، شيدر، اسطنبولي، براميلي، موزاريلا، لبنة، جبن كريمي) واللحوم الباردة، الزيتون والمخللات، السمن والزبدة البلدية، التمور والحلاوة والطحينة، العسل الطبيعي والعسل الأسود، إضافة إلى المخبوزات والفطائر الطازجة والعصائر الطبيعية. منتجات طبيعية مختارة تصل إلى بابك.",
 "address": "أتاكنت، كوتشوك تشكمجة، إسطنبول 34307، تركيا",
 "phone": "+90 506 548 50 85",
 "whatsapp": "+90 506 548 50 85",
 "email": "",
 "website": "https://beyazitpeynir.com",
 "sourceUrl": "https://beyazitpeynir.odoo.com/shop",
 "hours": "يومياً من 09:00 صباحاً حتى 09:00 مساءً",
 "areas": [
  "أتاكنت",
  "كوتشوك تشكمجة",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push (also a small offline fallback); ProductCatalog
// is emptied below so it is NOT re-downloaded on every page load.
const beyazitFullCatalog = [
 {
  "name": "لبنة",
  "price": 138,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/555.jpg",
  "sourceId": "555"
 },
 {
  "name": "جبنة رومي بيازيد",
  "price": 768,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/499.jpg",
  "sourceId": "499"
 },
 {
  "name": "فلمنك",
  "price": 1160,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/550.jpg",
  "sourceId": "550"
 },
 {
  "name": "جبنة شيدر طعوم",
  "price": 820,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/500.jpg",
  "sourceId": "500"
 },
 {
  "name": "جبنة كريمي بيازيد",
  "price": 520,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/672.jpg",
  "sourceId": "672"
 },
 {
  "name": "كريمي رومي",
  "price": 640,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/667.jpg",
  "sourceId": "667"
 },
 {
  "name": "جبنة اسطنبولي",
  "price": 807,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/493.jpg",
  "sourceId": "493"
 },
 {
  "name": "ريكفورد",
  "price": 140,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/513.jpg",
  "sourceId": "513"
 },
 {
  "name": "جبنة شيدر قديم سادة",
  "price": 880,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/501.jpg",
  "sourceId": "501"
 },
 {
  "name": "بيازيد كريمي ريكفورد",
  "price": 680,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/670.jpg",
  "sourceId": "670"
 },
 {
  "name": "سلطة مش وجبن حارة",
  "price": 540,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/531.jpg",
  "sourceId": "531"
 },
 {
  "name": "جبنة دوبل كريم",
  "price": 460,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/498.jpg",
  "sourceId": "498"
 },
 {
  "name": "بيازيد كريمي بسطرمة",
  "price": 680,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/668.jpg",
  "sourceId": "668"
 },
 {
  "name": "مكس جبن",
  "price": 580,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/610.jpg",
  "sourceId": "610"
 },
 {
  "name": "جبنة موتزريلاا",
  "price": 480,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/505.jpg",
  "sourceId": "505"
 },
 {
  "name": "جبنة براميلي",
  "price": 480,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/495.jpg",
  "sourceId": "495"
 },
 {
  "name": "جبنة بيضاء ملح خفيف",
  "price": 382,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/497.jpg",
  "sourceId": "497"
 },
 {
  "name": "جبنة بالقشطة",
  "price": 159,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/494.jpg",
  "sourceId": "494"
 },
 {
  "name": "بروتينا",
  "price": 82,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/712.jpg",
  "sourceId": "712",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250 جم",
     "500 جم"
    ],
    "extra": [
     0,
     67
    ]
   }
  ]
 },
 {
  "name": "بروتينا هالوبينو",
  "price": 82,
  "category": "أجبان",
  "unit": "",
  "image": "/assets/photos/beyazit/714.jpg",
  "sourceId": "714",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250 جم",
     "500 جم"
    ],
    "extra": [
     0,
     67
    ]
   }
  ]
 },
 {
  "name": "لانشون حلواني فريش فارم",
  "price": 740,
  "category": "لحوم باردة",
  "unit": "",
  "image": "/assets/photos/beyazit/553.jpg",
  "sourceId": "553"
 },
 {
  "name": "بسطرمة بالثوم",
  "price": 1136,
  "category": "لحوم باردة",
  "unit": "",
  "image": "/assets/photos/beyazit/674.jpg",
  "sourceId": "674"
 },
 {
  "name": "بسطرمة مخلية",
  "price": 1186,
  "category": "لحوم باردة",
  "unit": "",
  "image": "/assets/photos/beyazit/489.jpg",
  "sourceId": "489"
 },
 {
  "name": "رومي مدخن",
  "price": 820,
  "category": "لحوم باردة",
  "unit": "",
  "image": "/assets/photos/beyazit/512.jpg",
  "sourceId": "512"
 },
 {
  "name": "لانشون فراخ",
  "price": 440,
  "category": "لحوم باردة",
  "unit": "",
  "image": "/assets/photos/beyazit/560.jpg",
  "sourceId": "560"
 },
 {
  "name": "سمنة جاموسي",
  "price": 910,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/534.jpg",
  "sourceId": "534"
 },
 {
  "name": "سمنة بقري",
  "price": 860,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/533.jpg",
  "sourceId": "533"
 },
 {
  "name": "مورتة فلاحي",
  "price": 420,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/559.jpg",
  "sourceId": "559"
 },
 {
  "name": "زبدة جاموسي",
  "price": 680,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/519.jpg",
  "sourceId": "519"
 },
 {
  "name": "زبدة بقري",
  "price": 640,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/514.jpg",
  "sourceId": "514"
 },
 {
  "name": "سمنة غنم",
  "price": 408,
  "category": "زبدة و سمنة",
  "unit": "",
  "image": "/assets/photos/beyazit/647.jpg",
  "sourceId": "647",
  "options": [
   {
    "name": "الوزن",
    "values": [
     "250 جرام",
     "580 جرام"
    ],
    "extra": [
     0,
     428.5
    ]
   }
  ]
 },
 {
  "name": "زيتون اسمر كبير",
  "price": 480,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/529.jpg",
  "sourceId": "529"
 },
 {
  "name": "زيتون اخضر بالليمون",
  "price": 420,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/525.jpg",
  "sourceId": "525"
 },
 {
  "name": "زيتون اخضر مشوي",
  "price": 399,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/527.jpg",
  "sourceId": "527"
 },
 {
  "name": "زيتون شرائح فلفل وجزر",
  "price": 280,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/530.jpg",
  "sourceId": "530"
 },
 {
  "name": "زيتون اخضر بالفلفل والجزر",
  "price": 280,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/526.jpg",
  "sourceId": "526"
 },
 {
  "name": "زيتون اخضر",
  "price": 314,
  "category": "زيتون",
  "unit": "",
  "image": "/assets/photos/beyazit/524.jpg",
  "sourceId": "524"
 },
 {
  "name": "مخلل مصري",
  "price": 199,
  "category": "مخلل مصرى",
  "unit": "",
  "image": "/assets/photos/beyazit/557.jpg",
  "sourceId": "557"
 },
 {
  "name": "بوكس فطائر مشكل",
  "price": 620,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/588.jpg",
  "sourceId": "588"
 },
 {
  "name": "بوكس فطائر بالجبنة الرومي",
  "price": 613,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/573.jpg",
  "sourceId": "573"
 },
 {
  "name": "بوكس فطائر مشكله بالدقيق الأسمر",
  "price": 633,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/585.jpg",
  "sourceId": "585"
 },
 {
  "name": "بوكس ميني بيتزا",
  "price": 573,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/581.jpg",
  "sourceId": "581"
 },
 {
  "name": "بوكس فطائر بالجبنة الاسطنبولي",
  "price": 627,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/574.jpg",
  "sourceId": "574"
 },
 {
  "name": "بوكس فطائر بالجبنة الاسطنبولي(بالدقيق الأسمر)",
  "price": 640,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/570.jpg",
  "sourceId": "570"
 },
 {
  "name": "بوكس ميني بيتزا (بالدقيق الأسمر)",
  "price": 587,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/577.jpg",
  "sourceId": "577"
 },
 {
  "name": "بوكس فطائر بالجبنة الرومي (بالدقيق الأسمر)",
  "price": 627,
  "category": "مخبوزات بيازيد",
  "unit": "",
  "image": "/assets/photos/beyazit/569.jpg",
  "sourceId": "569"
 },
 {
  "name": "سمبوسه",
  "price": 130,
  "category": "سمبوسة",
  "unit": "",
  "image": "/assets/photos/beyazit/532.jpg",
  "sourceId": "532"
 },
 {
  "name": "عيش مصري",
  "price": 28,
  "category": "خبز",
  "unit": "",
  "image": "/assets/photos/beyazit/548.jpg",
  "sourceId": "548"
 },
 {
  "name": "فراولة مجمدة",
  "price": 179,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/549.jpg",
  "sourceId": "549"
 },
 {
  "name": "ملوخية مجمدة",
  "price": 77,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/558.jpg",
  "sourceId": "558"
 },
 {
  "name": "قلقاس",
  "price": 82,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/552.jpg",
  "sourceId": "552"
 },
 {
  "name": "بسلة مجمدة",
  "price": 75.03,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/490.jpg",
  "sourceId": "490"
 },
 {
  "name": "باميه زيرو",
  "price": 110,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/488.jpg",
  "sourceId": "488"
 },
 {
  "name": "مانجو",
  "price": 198.94,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/556.jpg",
  "sourceId": "556"
 },
 {
  "name": "جوافة مجمده",
  "price": 168.91,
  "category": "مجمدات",
  "unit": "",
  "image": "/assets/photos/beyazit/506.jpg",
  "sourceId": "506"
 },
 {
  "name": "تمر سكري مفتل القصيم",
  "price": 900,
  "category": "تمر",
  "unit": "",
  "image": "/assets/photos/beyazit/662.jpg",
  "sourceId": "662"
 },
 {
  "name": "عجوة المدينة ١ كيلو",
  "price": 450,
  "category": "تمر",
  "unit": "",
  "image": "/assets/photos/beyazit/663.jpg",
  "sourceId": "663"
 },
 {
  "name": "تمر خلاص القصيم عجوة",
  "price": 160,
  "category": "تمر",
  "unit": "",
  "image": "/assets/photos/beyazit/664.jpg",
  "sourceId": "664"
 },
 {
  "name": "تمر مجدول بريميوم لارج",
  "price": 540,
  "category": "تمر",
  "unit": "",
  "image": "/assets/photos/beyazit/608.jpg",
  "sourceId": "608"
 },
 {
  "name": "تمر رطب سكري",
  "price": 240,
  "category": "تمر",
  "unit": "",
  "image": "/assets/photos/beyazit/492.jpg",
  "sourceId": "492",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "1 كيلو",
     "حبة كبيرة"
    ],
    "extra": [
     0,
     440
    ]
   }
  ]
 },
 {
  "name": "حلاوة طحينية سادة",
  "price": 275,
  "category": "حلاوة",
  "unit": "",
  "image": "/assets/photos/beyazit/508.jpg",
  "sourceId": "508"
 },
 {
  "name": "حلاوة طيحينة فالفسدق",
  "price": 500,
  "category": "حلاوة",
  "unit": "",
  "image": "/assets/photos/beyazit/509.jpg",
  "sourceId": "509"
 },
 {
  "name": "حلاوة طحينية بالشيكولاته",
  "price": 285,
  "category": "حلاوة",
  "unit": "",
  "image": "/assets/photos/beyazit/507.jpg",
  "sourceId": "507"
 },
 {
  "name": "طحينة سمسم",
  "price": 240,
  "category": "طحينة",
  "unit": "",
  "image": "/assets/photos/beyazit/703.jpg",
  "sourceId": "703"
 },
 {
  "name": "رنجة",
  "price": 500,
  "category": "رنجة",
  "unit": "",
  "image": "/assets/photos/beyazit/511.jpg",
  "sourceId": "511"
 },
 {
  "name": "شاي الكابوس 200 جم",
  "price": 135,
  "category": "شاي",
  "unit": "",
  "image": "/assets/photos/beyazit/536.jpg",
  "sourceId": "536"
 },
 {
  "name": "شاي العروسة 250 جم",
  "price": 120,
  "category": "شاي",
  "unit": "",
  "image": "/assets/photos/beyazit/535.jpg",
  "sourceId": "535"
 },
 {
  "name": "شاي العروسة 100جم",
  "price": 50,
  "category": "شاي",
  "unit": "",
  "image": "/assets/photos/beyazit/732.jpg",
  "sourceId": "732"
 },
 {
  "name": "عصير مانجا",
  "price": 82,
  "category": "عصير طبيعي",
  "unit": "250 مل",
  "image": "/assets/photos/beyazit/564.jpg",
  "sourceId": "564"
 },
 {
  "name": "عصير فراولة",
  "price": 82,
  "category": "عصير طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/566.jpg",
  "sourceId": "566",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "250 مل",
     "1 لتر"
    ],
    "extra": [
     0,
     188
    ]
   }
  ]
 },
 {
  "name": "عسل حمضيات",
  "price": 385,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/544.jpg",
  "sourceId": "544"
 },
 {
  "name": "عسل حبة البركة 500 جرام",
  "price": 585,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/543.jpg",
  "sourceId": "543"
 },
 {
  "name": "عسل لافندر",
  "price": 428,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/547.jpg",
  "sourceId": "547"
 },
 {
  "name": "عسل سدر",
  "price": 440,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/545.jpg",
  "sourceId": "545"
 },
 {
  "name": "شمع عسل جبلي",
  "price": 500,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/537.jpg",
  "sourceId": "537"
 },
 {
  "name": "شمع عسل كاراكوفان",
  "price": 560,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/538.jpg",
  "sourceId": "538"
 },
 {
  "name": "عسل حبة البركة",
  "price": 1437,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/691.jpg",
  "sourceId": "691"
 },
 {
  "name": "عسل يانسون",
  "price": 1340,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/692.jpg",
  "sourceId": "692"
 },
 {
  "name": "عسل جبلي",
  "price": 1290,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/693.jpg",
  "sourceId": "693"
 },
 {
  "name": "عسل شوكيات",
  "price": 1290,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/694.jpg",
  "sourceId": "694"
 },
 {
  "name": "عسل جيجان",
  "price": 1390,
  "category": "عسل نحل طبيعي",
  "unit": "",
  "image": "/assets/photos/beyazit/695.jpg",
  "sourceId": "695"
 },
 {
  "name": "عسل أسود البوادي",
  "price": 110,
  "category": "عسل أسود",
  "unit": "",
  "image": "/assets/photos/beyazit/540.jpg",
  "sourceId": "540",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "صغير",
     "كبير"
    ],
    "extra": [
     0,
     95
    ]
   }
  ]
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const beyazitProductCatalog = [];

const beyazitProducts = (beyazitProductCatalog.length ? beyazitProductCatalog : beyazitFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1670001 + index,
  storeId: beyazitStore.id
}));

const beyazitDeliverySettings = {
  [beyazitStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 40, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { beyazitStore, beyazitProducts, beyazitDeliverySettings };
}
