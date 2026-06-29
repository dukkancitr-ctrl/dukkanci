// Generated for كريب شيف (Krep Chef) — Cumhuriyet Mah., Barbaros Hayrettin Paşa, Esenyurt/Beylikdüzü, İstanbul.
// Source: krepchef.com WooCommerce Store API (translated to Arabic). Drinks (imageless) and the
// seasonal İftar combo were skipped; the acılı/acısız Zinger pairs were merged into a spice option.
// NOTE: krepchefProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives
// in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const krepchefStore = {
 "id": 52,
 "name": "كريب شيف",
 "category": "مطاعم",
 "image": "/assets/photos/krepchef/cover.jpg",
 "coverImage": "/assets/photos/krepchef/cover.jpg",
 "logoImage": "/assets/photos/krepchef/logo.png",
 "logo": "ك",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "40 - 70 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0163,
  "lng": 28.6423
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.0163,28.6423",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "كريب شيف — وجهتك للكريب والوافل والبان كيك في إسطنبول. كريب مالح بالدجاج واللحم والمأكولات البحرية وكريب بيتزا، وتشكيلة حلويات من الكريب الحلو والوافل والبان كيك والتشوروس. طازج ويصل إلى بابك.",
 "address": "حي الجمهورية (Cumhuriyet)، شارع بربروس خير الدين باشا، شارع 1995 رقم 1، إسنيورت/بيليكدوزو، إسطنبول، تركيا",
 "phone": "+90 507 777 00 76",
 "whatsapp": "+90 507 777 00 76",
 "email": "",
 "website": "https://www.krepchef.com",
 "sourceUrl": "https://www.krepchef.com",
 "hours": "",
 "areas": [
  "إسنيورت",
  "بيليكدوزو",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const krepchefFullCatalog = [
 {
  "name": "كريب دونر دجاج",
  "price": 299,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/tavuklu-doner-krep.jpg",
  "description": "دونر دجاج طازج ملفوف داخل كريب مقرمش."
 },
 {
  "name": "كومبو كريب دونر",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/doner-krep-kombo.jpg",
  "description": "كريب دونر دجاج + بطاطس مقلية + مشروب."
 },
 {
  "name": "فاهيتا",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/fajita.jpg",
  "description": "دجاج جوليان، فلفل أخضر، بصل، مشروم، زيتون أسود، جبنة قشقوان، مايونيز، كاتشب وصوص الصويا."
 },
 {
  "name": "باربكيو",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/barbeque.jpg",
  "description": "دجاج جوليان، فلفل أخضر، بصل، مشروم، ذرة، جبنة قشقوان وصوص الباربكيو."
 },
 {
  "name": "مكسيكانو",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/mexicano.jpg",
  "description": "دجاج جوليان، فلفل أخضر، بصل، مشروم، ذرة، جبنة قشقوان، صوص حار وصوص حلو حامض."
 },
 {
  "name": "بيستو",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/pesto.jpg",
  "description": "دجاج جوليان، جبنة قشقوان، مشروم، بصل وصوص البيستو."
 },
 {
  "name": "فرانسيسكو",
  "price": 399,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/francisco.jpg",
  "description": "دجاج جوليان، بصل، مشروم، ذرة، جبنة قشقوان، كريمة وصوص الرانش."
 },
 {
  "name": "زنجر",
  "price": 290,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/zinger.jpg",
  "description": "دجاج مقرمش، فلفل أخضر، جبنة قشقوان ومايونيز.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     109
    ]
   },
   {
    "name": "الدرجة",
    "values": [
     "غير حار",
     "حار"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "زنجر سوبريم",
  "price": 329,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/zinger-supreme.jpg",
  "description": "دجاج مقرمش، فلفل أخضر، جبنة قشقوان، ديك رومي مدخّن ومايونيز.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     90
    ]
   },
   {
    "name": "الدرجة",
    "values": [
     "غير حار",
     "حار"
    ],
    "extra": [
     0,
     0
    ]
   }
  ]
 },
 {
  "name": "كوردون بلو",
  "price": 269,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/cordon-bleu.jpg",
  "description": "كوردون بلو، جبنة قشقوان، فلفل أخضر، كاتشب ومايونيز.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     80
    ]
   }
  ]
 },
 {
  "name": "إسكالوب",
  "price": 290,
  "category": "كريب الدجاج",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/escalope.jpg",
  "description": "إسكالوب دجاج، فلفل أخضر، جبنة قشقوان، مايونيز وكاتشب.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     109
    ]
   }
  ]
 },
 {
  "name": "كفتة",
  "price": 559,
  "category": "كريب اللحم",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/kofte.jpg",
  "description": "كفتة، سلطة (بصل وسمّاق وبقدونس)، جبنة قشقوان، كاتشب ومايونيز."
 },
 {
  "name": "سوسيس",
  "price": 239,
  "category": "كريب اللحم",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/sosis.jpg",
  "description": "سوسيس، فلفل أخضر، جبنة قشقوان، مايونيز وكاتشب.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     110
    ]
   }
  ]
 },
 {
  "name": "سُجُق",
  "price": 419,
  "category": "كريب اللحم",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/sucuk.jpg",
  "description": "سُجُق بلدي، بصل، فلفل أخضر، جبنة قشقوان ومايونيز."
 },
 {
  "name": "كبدة عجل",
  "price": 589,
  "category": "كريب اللحم",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/dana-ciger.jpg",
  "description": "كبدة عجل على طريقة الإسكندر، جبنة قشقوان، فلفل أخضر وطحينة."
 },
 {
  "name": "تونة",
  "price": 469,
  "category": "كريب بحري",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/tuna.jpg",
  "description": "تونة، جبنة قشقوان، زيتون، فلفل وبصل."
 },
 {
  "name": "روبيان",
  "price": 599,
  "category": "كريب بحري",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/karides.jpg",
  "description": "روبيان، جبنة قشقوان، فلفل، بصل، صوص صويا وصوص كريب شيف."
 },
 {
  "name": "خضار",
  "price": 299,
  "category": "كريب الخضار",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/sebzeli.jpg",
  "description": "مشروم، فلفل أخضر، بصل، زيتون أسود، جبنة قشقوان، كاتشب ومايونيز."
 },
 {
  "name": "ميكس أجبان",
  "price": 299,
  "category": "كريب الخضار",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/mix-cheese.jpg",
  "description": "جبنة قشقوان، قشقوان معتّق، شيدر، فلفل أخضر وزيتون أسود.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     150
    ]
   }
  ]
 },
 {
  "name": "باتسو",
  "price": 259,
  "category": "كريب الخضار",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/patso.jpg",
  "description": "بطاطس مقلية، فلفل أخضر، زيتون أسود، جبنة قشقوان، كاتشب ومايونيز.",
  "options": [
   {
    "name": "الحجم",
    "values": [
     "وسط",
     "كبير"
    ],
    "extra": [
     0,
     70
    ]
   }
  ]
 },
 {
  "name": "ميكس دجاج",
  "price": 439,
  "category": "كريب ميكس",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/mix-tavuk.jpg",
  "description": "دجاج جوليان، دجاج مقرمش، جبنة قشقوان، فلفل أخضر، بصل، زيتون أسود، مشروم، كاتشب ومايونيز."
 },
 {
  "name": "سوبر كرانشي",
  "price": 399,
  "category": "كريب ميكس",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/super-crunchy.jpg",
  "description": "دجاج مقرمش، سوسيس، فلفل أخضر، جبنة قشقوان، مايونيز وكاتشب."
 },
 {
  "name": "ماجيكو",
  "price": 559,
  "category": "كريب ميكس",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/majiko.jpg",
  "description": "سُجُق بلدي، دجاج جوليان، فلفل أخضر، بصل، مشروم، جبنة قشقوان، مايونيز وكاتشب."
 },
 {
  "name": "بيتزا ميكس أجبان",
  "price": 569,
  "category": "كريب بيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/pizza-mix-cheese.jpg",
  "description": "جبنة قشقوان، قشقوان معتّق، شيدر، فلفل، زيتون أسود وصوص البيتزا."
 },
 {
  "name": "بيتزا زنجر",
  "price": 569,
  "category": "كريب بيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/pizza-zinger.jpg",
  "description": "جبنة قشقوان، زنجر، فلفل، زيتون أسود وصوص البيتزا."
 },
 {
  "name": "بيتزا تونة",
  "price": 569,
  "category": "كريب بيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/pizza-tuna.jpg",
  "description": "جبنة قشقوان، تونة، فلفل، بصل، زيتون أسود وصوص البيتزا."
 },
 {
  "name": "بيتزا سوسيس",
  "price": 569,
  "category": "كريب بيتزا",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/pizza-sosis.jpg",
  "description": "جبنة قشقوان، سوسيس، فلفل، زيتون أسود وصوص البيتزا."
 },
 {
  "name": "كومبو سناك",
  "price": 115,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/combo.jpg",
  "description": "بطاطس مقلية + مشروب."
 },
 {
  "name": "ساندويتش وافل",
  "price": 199,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/waffle-sandwich.jpg",
  "description": "جبنة قشقوان، شيدر وديك رومي مدخّن."
 },
 {
  "name": "أصابع الجبن",
  "price": 339,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/peynir-parmak.jpg",
  "description": "٤ أصابع جبن مقلية."
 },
 {
  "name": "بوكس ميكس مقرمش",
  "price": 349,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/citir-mix-box.jpg",
  "description": "دجاج مقرمش، بطاطس مقلية وأصابع جبن."
 },
 {
  "name": "بطاطس مقلية",
  "price": 99,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/patates-kizartmasi.jpg",
  "description": "بطاطس مقلية ذهبية."
 },
 {
  "name": "سلطة كول سلو",
  "price": 49,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/coleslaw-salata.jpg",
  "description": "سلطة الملفوف."
 },
 {
  "name": "مخلل مشكّل",
  "price": 35,
  "category": "مقبلات وسناك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/karisik-tursu.jpg",
  "description": "تشكيلة مخللات."
 },
 {
  "name": "كريب نوتيلا",
  "price": 219,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/nutella-krep.jpg",
  "description": "كريب، نوتيلا وصوص الشوكولاتة."
 },
 {
  "name": "كريب آيس شوكو",
  "price": 249,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/ice-choco-krep.jpg",
  "description": "كريب بحشوة الشوكولاتة الباردة."
 },
 {
  "name": "كريب نوتيلا شيبس",
  "price": 259,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/nutella-cips.jpg",
  "description": "كريب ونوتيلا مع رقائق مقرمشة."
 },
 {
  "name": "كريب قشطة وعسل",
  "price": 289,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/kaymakli-bal-krep.jpg",
  "description": "كريب، قشطة وعسل."
 },
 {
  "name": "كريب سينابون",
  "price": 349,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/sinabon-krep.jpg",
  "description": "كريب، كريمة حلوة، قرفة، صوص كريب شيف وكراميل."
 },
 {
  "name": "كريب تيراميسو",
  "price": 369,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/tiramisu-krep.jpg",
  "description": "كريب، بسكويت، جبنة كريمية، كاكاو، شوكولاتة بلجيكية بالحليب وبيضاء."
 },
 {
  "name": "كريب شوكولاتة بلجيكية",
  "price": 399,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/belcika-cikolata-krep.jpg",
  "description": "كريب، شوكولاتة بلجيكية بالحليب وشوكولاتة بيضاء."
 },
 {
  "name": "كريب سوشي موز",
  "price": 399,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/susi-muz-krep.jpg",
  "description": "كريب، نوتيلا، كريمة، موز، شوكولاتة بلجيكية بالحليب وبيضاء."
 },
 {
  "name": "كريب لوتس سبيشال",
  "price": 449,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/special-lotus-krep.jpg",
  "description": "كريب، كريمة لوتس وبسكويت لوتس."
 },
 {
  "name": "كريب براوني سبيشال",
  "price": 492,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/special-browni-krep.jpg",
  "description": "كريب، نوتيلا، كريمة، براوني، فراولة، شوكولاتة بلجيكية بالحليب وبيضاء."
 },
 {
  "name": "كريب فواكه بلجيكي",
  "price": 499,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/belcika-meyveli-krep.jpg",
  "description": "كريب، شوكولاتة بلجيكية بالحليب وبيضاء وفواكه موسمية."
 },
 {
  "name": "كريب بندق",
  "price": 529,
  "category": "كريب حلو",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/findikli-krep.jpg",
  "description": "كريب، نوتيلا وبندق."
 },
 {
  "name": "كريب دبي",
  "price": 389,
  "category": "كريب مميز",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/dubai-krep.jpg",
  "description": "كريب دبي بالفستق والكنافة والشوكولاتة."
 },
 {
  "name": "كريب كنافة لوتس",
  "price": 349,
  "category": "كريب مميز",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/lotus-kunefe-krep.jpg",
  "description": "كريب كنافة بكريمة اللوتس."
 },
 {
  "name": "كريب كنافة توفي",
  "price": 269,
  "category": "كريب مميز",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/tofie-kunefe-krep.jpg",
  "description": "كريب كنافة بصوص التوفي."
 },
 {
  "name": "كريب سوزان",
  "price": 349,
  "category": "كريب مميز",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/souzan-krep.jpg",
  "description": "كريب سوزان المميز من كريب شيف."
 },
 {
  "name": "كريب سمبوسة التمر",
  "price": 249,
  "category": "كريب مميز",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/hurma-sambossa-krep.jpg",
  "description": "كريب محشو بحشوة سمبوسة التمر."
 },
 {
  "name": "وافل نوتيلا",
  "price": 249,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/nutella-waffle.jpg",
  "description": "وافل، نوتيلا وصوص الشوكولاتة."
 },
 {
  "name": "وافل كريم بروليه",
  "price": 259,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/krem-brule-waffle.jpg",
  "description": "وافل، كريمة الباتيسيري وسكر."
 },
 {
  "name": "وافل أوريو",
  "price": 319,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/oreo-waffle.jpg",
  "description": "وافل، نوتيلا وبودرة بسكويت أوريو."
 },
 {
  "name": "وافل كريب شيف",
  "price": 319,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/krep-chef-waffle.jpg",
  "description": "وافل، صوص توفي، قرفة، موز، بسكويت، صوص كريب شيف وكراميل."
 },
 {
  "name": "وافل تشيز كيك",
  "price": 339,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/cheesecake-waffle.jpg",
  "description": "وافل، جبنة كريمية، نوتيلا، بسكويت وفراولة."
 },
 {
  "name": "وافل شوكولاتة بلجيكية",
  "price": 399,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/belcika-cikolata-waffle.jpg",
  "description": "وافل، شوكولاتة بلجيكية بالحليب وبيضاء."
 },
 {
  "name": "وافل تشيكو لوتس",
  "price": 429,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/cikolotus-waffle.jpg",
  "description": "وافل، نوتيلا، شوكولاتة بلجيكية بالحليب وبيضاء، كريمة وبسكويت لوتس."
 },
 {
  "name": "وافل لوتس سبيشال",
  "price": 429,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/special-lotus-waffle.jpg",
  "description": "وافل، كريمة لوتس وبسكويت لوتس."
 },
 {
  "name": "وافل فواكه بلجيكي",
  "price": 499,
  "category": "وافل",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/belcika-meyevli-waffle.jpg",
  "description": "وافل، شوكولاتة بلجيكية بالحليب وبيضاء وفواكه موسمية."
 },
 {
  "name": "بان كيك عسل وقشطة",
  "price": 269,
  "category": "بان كيك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/balli-kaymak-pankek.jpg",
  "description": "بان كيك، عسل وقشطة."
 },
 {
  "name": "بان كيك الفصول الأربعة",
  "price": 349,
  "category": "بان كيك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/four-seasons-pankek.jpg",
  "description": "بان كيك، فواكه موسمية، نوتيلا، شوكولاتة بلجيكية، كريمة وبسكويت لوتس."
 },
 {
  "name": "برجر شوكولاتة",
  "price": 375,
  "category": "بان كيك",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/cikolata-burger.jpg",
  "description": "بان كيك، كريمة، فواكه موسمية، نوتيلا وصوص الشوكولاتة."
 },
 {
  "name": "تشوروس أصلي",
  "price": 189,
  "category": "تشوروس",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/churros-original.jpg",
  "description": "٤ أصابع تشوروس سادة."
 },
 {
  "name": "تشوروس شوكولاتة بلجيكية",
  "price": 299,
  "category": "تشوروس",
  "unit": "قطعة",
  "image": "/assets/photos/krepchef/churros-belcika-cikolata.jpg",
  "description": "٤ أصابع تشوروس مع شوكولاتة بلجيكية بالحليب وبيضاء."
 }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const krepchefProductCatalog = [];

const krepchefProducts = (krepchefProductCatalog.length ? krepchefProductCatalog : krepchefFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1360001 + index,
  storeId: krepchefStore.id
}));

const krepchefDeliverySettings = {
  [krepchefStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { krepchefStore, krepchefProducts, krepchefDeliverySettings };
}
