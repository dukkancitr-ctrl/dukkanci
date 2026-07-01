// Generated for بـ حَليب (B.Haleeb) — Molla Gürani, Turgut Özal Millet Cd. 32/A, Fatih/İstanbul.
// Dessert/ice-cream shop. Source: bhaleeb.macho.menu (lamaz backend), native Arabic names, prices in TL.
// 64 products, every one with a unique real photo (the duplicate «سالانكاتيه» mirror of «كشري» was
// dropped per the per-store unique-image rule + the "no imageless products" instruction).
// NOTE: bhaleebProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives in
// Supabase and is pushed via scripts/_scrape/push-store.cjs.
const bhaleebStore = {
 "id": 59,
 "name": "بـ حَليب",
 "category": "حلويات",
 "image": "/assets/photos/bhaleeb/cover.jpg",
 "coverImage": "/assets/photos/bhaleeb/cover.jpg",
 "logoImage": "/assets/photos/bhaleeb/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0102231,
  "lng": 28.9465032
 },
 "mapUrl": "https://maps.app.goo.gl/8aRHpVENuGFPfKbm9",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "بـ حَليب — وجهتك للحلويات والمثلجات في قلب الفاتح بإسطنبول. آيس كريم وبوظة بنكهات متنوعة، كشري وقشطوطة بالكنافة والقشطة، عصائر سلاش وعصائر فريش طازجة، ميلك شيك، وكريب ووافل. حلا طازج ولذيذ يصل إلى بابك.",
 "address": "حي مُلا كوراني، شارع تورغوت أوزال ميللت رقم 32/A، الفاتح، إسطنبول، تركيا",
 "phone": "+90 555 401 90 33",
 "whatsapp": "+90 555 401 90 33",
 "email": "",
 "website": "https://linktr.ee/bhaleeb",
 "sourceUrl": "https://bhaleeb.macho.menu/ar/38qpe-06xsv-foypq",
 "hours": "",
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

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const bhaleebFullCatalog = [
 {"name":"بوظة أناناس","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/1.jpg","sourceId":"1"},
 {"name":"بوظة اوريو","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/2.jpg","sourceId":"2"},
 {"name":"بوظة جوز الهند","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/3.jpg","sourceId":"3"},
 {"name":"بوظة عربي","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/4.jpg","sourceId":"4"},
 {"name":"بوظة فريز وبلو بيري","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/5.jpg","sourceId":"5"},
 {"name":"بوظة فريز ومانجو","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/6.jpg","sourceId":"6"},
 {"name":"بوظة فواكه","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/7.jpg","sourceId":"7"},
 {"name":"بوظة كيوي","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/8.jpg","sourceId":"8"},
 {"name":"بوظة لوتس","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/9.jpg","sourceId":"9"},
 {"name":"بوظة باللوز","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/10.jpg","sourceId":"10"},
 {"name":"بوظة ليمون","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/11.jpg","sourceId":"11"},
 {"name":"بوظة مانجو","price":50,"category":"آيس كريم","unit":"قطعة","image":"/assets/photos/bhaleeb/70.jpg","sourceId":"70"},
 {"name":"فراوليتا","price":225,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/14.jpg","sourceId":"14","description":"قطع فريز - بستاشيو - صوص شوكولا"},
 {"name":"بمبوظة","price":300,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/12.jpg","sourceId":"12","description":"قطع كيوي - قطع تفاح - قطع فريز - قطع مانجو - عصير مانجو - كريما"},
 {"name":"تشيز بومب","price":300,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/13.jpg","sourceId":"13","description":"كنافة مع بستاشيو بالإضافة إلى القشطة والكريمة بالداخل"},
 {"name":"كيكة احمد الزامل","price":350,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/15.jpg","sourceId":"15","description":"كيكة براوني مع كريما، بالإضافة إلى حبات الكورن فليكس"},
 {"name":"كيكة الهبة","price":400,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/16.jpg","sourceId":"16","description":"كيكة برواني - كريما - بستاشيو - قطع فريز"},
 {"name":"كيكة هبة الرياض","price":400,"category":"أصناف بـِ حَليب","unit":"قطعة","image":"/assets/photos/bhaleeb/17.jpg","sourceId":"17","description":"كيكة ريد فيلفيت - كريمة - قطع فريز - بستاشيو - صوص شوكولا"},
 {"name":"ليمون ونعناع (بولو)","price":100,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/29.jpg","sourceId":"29"},
 {"name":"عصير فريز","price":125,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/22.jpg","sourceId":"22"},
 {"name":"عصير ليمون","price":125,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/28.jpg","sourceId":"28"},
 {"name":"أناناس مع برتقال","price":130,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/18.jpg","sourceId":"18"},
 {"name":"بطيخ أحمر مع فريز وبلو بيري","price":130,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/19.jpg","sourceId":"19"},
 {"name":"كوكتيل فواكه","price":130,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/24.jpg","sourceId":"24"},
 {"name":"كيوي مع مانجو وبطيخ","price":135,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/27.jpg","sourceId":"27"},
 {"name":"شراب جوز الهند","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/20.jpg","sourceId":"20"},
 {"name":"شراب اللوز","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/21.jpg","sourceId":"21"},
 {"name":"فريز مع بلو بيري وكرز","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/23.jpg","sourceId":"23"},
 {"name":"كوكتيل موز وحليب وفريز","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/25.jpg","sourceId":"25"},
 {"name":"كيوي مع مانجو","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/26.jpg","sourceId":"26"},
 {"name":"عصير مانجو","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/30.jpg","sourceId":"30"},
 {"name":"مانجو وفريز (باشون فروت)","price":150,"category":"العصائر (سلاش)","unit":"قطعة","image":"/assets/photos/bhaleeb/31.jpg","sourceId":"31"},
 {"name":"سناك ميكس صوصات مع فواكه","price":250,"category":"الكريب والوافل","unit":"طبق","image":"/assets/photos/bhaleeb/32.jpg","sourceId":"32"},
 {"name":"ميني بان كيك ميكس صوصات مع فواكه","price":250,"category":"الكريب والوافل","unit":"طبق","image":"/assets/photos/bhaleeb/33.jpg","sourceId":"33"},
 {"name":"كريب دبي","price":250,"category":"الكريب والوافل","unit":"طبق","image":"/assets/photos/bhaleeb/34.jpg","sourceId":"34"},
 {"name":"وافل ميكس صوصات مع فواكه","price":250,"category":"الكريب والوافل","unit":"طبق","image":"/assets/photos/bhaleeb/35.jpg","sourceId":"35"},
 {"name":"عصير برتقال","price":110,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/44.jpg","sourceId":"44"},
 {"name":"عصير برتقال وجزر","price":110,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/45.jpg","sourceId":"45"},
 {"name":"عصير جزر","price":110,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/46.jpg","sourceId":"46"},
 {"name":"عصير كيوي","price":110,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/47.jpg","sourceId":"47"},
 {"name":"كوكتيل موز وحليب","price":125,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/48.jpg","sourceId":"48"},
 {"name":"عصير أفوكادو","price":150,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/42.jpg","sourceId":"42"},
 {"name":"أفوكادو بالعسل والمكسرات مع قشطة","price":200,"category":"عصير فريش","unit":"مشروب","image":"/assets/photos/bhaleeb/43.jpg","sourceId":"43"},
 {"name":"قشطوطة سادة","price":200,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/51.jpg","sourceId":"51"},
 {"name":"قشطوطة فواكه","price":300,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/52.jpg","sourceId":"52"},
 {"name":"قشطوطة مانجو","price":300,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/54.jpg","sourceId":"54"},
 {"name":"قشطوطة ميكس صوصات","price":300,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/56.jpg","sourceId":"56"},
 {"name":"قشطوطة نوتيلا","price":300,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/57.jpg","sourceId":"57"},
 {"name":"قشطوطة براوني","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/49.jpg","sourceId":"49"},
 {"name":"قشطوطة بستاشيو","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/50.jpg","sourceId":"50"},
 {"name":"قشطوطة لوتس","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/53.jpg","sourceId":"53"},
 {"name":"قشطوطة أفوكادو بالعسل والمكسرات","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/55.jpg","sourceId":"55"},
 {"name":"قشطوطة دبي","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/58.jpg","sourceId":"58"},
 {"name":"قشطوطة بالعسل والمكسرات","price":350,"category":"قشطوطة","unit":"قطعة","image":"/assets/photos/bhaleeb/69.jpg","sourceId":"69"},
 {"name":"كشري نوتيلا","price":330,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/64.jpg","sourceId":"64"},
 {"name":"كشري بستاشيو","price":350,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/59.jpg","sourceId":"59"},
 {"name":"كشري فواكه","price":350,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/60.jpg","sourceId":"60"},
 {"name":"كشري لوتس","price":350,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/61.jpg","sourceId":"61"},
 {"name":"كشري مانجو","price":350,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/62.jpg","sourceId":"62"},
 {"name":"كشري ميكس صوصات","price":350,"category":"كشري","unit":"قطعة","image":"/assets/photos/bhaleeb/63.jpg","sourceId":"63"},
 {"name":"ميلك شيك اوريو","price":195,"category":"ميلك شيك","unit":"مشروب","image":"/assets/photos/bhaleeb/65.jpg","sourceId":"65"},
 {"name":"ميلك شيك بوظة عربي","price":195,"category":"ميلك شيك","unit":"مشروب","image":"/assets/photos/bhaleeb/66.jpg","sourceId":"66"},
 {"name":"ميلك شيك فريز","price":195,"category":"ميلك شيك","unit":"مشروب","image":"/assets/photos/bhaleeb/67.jpg","sourceId":"67"},
 {"name":"ميلك شيك لوتس","price":195,"category":"ميلك شيك","unit":"مشروب","image":"/assets/photos/bhaleeb/68.jpg","sourceId":"68"}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const bhaleebProductCatalog = [];

const bhaleebProducts = (bhaleebProductCatalog.length ? bhaleebProductCatalog : bhaleebFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1430001 + index,
  storeId: bhaleebStore.id
}));

const bhaleebDeliverySettings = {
  [bhaleebStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { bhaleebStore, bhaleebProducts, bhaleebDeliverySettings };
}
