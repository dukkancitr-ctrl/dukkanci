// Generated for بلودان - الفاتح (Bludan Restaurant, Fatih branch) — Hırka-i Şerif, Akşemsettin Cd. No:36, Fatih/İstanbul.
// Source: https://app.trybany.com/ar/mtaam-blodan-alfath-140/ (trybany/Bany API, entity 140). Prices in Turkish Lira,
// from the official menu. 78 products, each with a unique real photo. The شوربة عدس item is inactive in the
// source (skipped); the two portion sizes of شرائح شاورما share one photo, merged into one size-option product.
// Independent store id 62 (the كاياشهير branch is separate, id 61). Files/assets namespaced as bludan-fatih to avoid
// any collision with the كاياشهير branch (assets/photos/bludan/).
// NOTE: bludanFatihProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives in Supabase and
// is pushed via scripts/_scrape/push-store.cjs.
const bludanFatihStore = {
 "id": 62,
 "name": "بلودان - الفاتح",
 "category": "مطاعم",
 "image": "/assets/photos/bludan-fatih/cover.jpg",
 "coverImage": "/assets/photos/bludan-fatih/cover.jpg",
 "logoImage": "/assets/photos/bludan-fatih/logo.png",
 "logo": "ب",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0204624,
  "lng": 28.9415651
 },
 "mapUrl": "https://maps.app.goo.gl/tHugQW6d6rdv8xKZ9",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم بلودان في الفاتح بإسطنبول — شاورما عربي بأنواعها (سوبر، دبل، صمون) وسندويشات الشاورما، مقبلات ووجبات شرقية وغربية، سلطات، بروستد، سندويشات غربية ومشروبات. نكهات شامية أصيلة تصل إلى بابك بأسعار القائمة الرسمية.",
 "address": "خرقة شريف، شارع آق شمس الدين، رقم 36، 34080 الفاتح/إسطنبول",
 "phone": "+90 552 385 80 07",
 "whatsapp": "+90 552 385 80 07",
 "email": "",
 "website": "https://www.instagram.com/bludan_restaurant/",
 "sourceUrl": "https://app.trybany.com/ar/mtaam-blodan-alfath-140/",
 "hours": "يومياً — يرجى التأكيد عبر الاتصال",
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

// Full catalog used ONLY for the Supabase push; emptied in the committed repo.
const bludanFatihFullCatalog = [
 {"name":"شاورما عربي","price":280,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0q.jpg","sourceId":"j0q","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,30]}]},
 {"name":"شاورما عربي سوبر","price":370,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0r.jpg","sourceId":"j0r","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,50]}]},
 {"name":"شاورما عربي دبل","price":410,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0s.jpg","sourceId":"j0s","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,60]}]},
 {"name":"سندويش شاورما","price":175,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0u.jpg","sourceId":"j0u","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,30]}]},
 {"name":"سندويش شاورما دبل حشوة","price":220,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0v.jpg","sourceId":"j0v","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,30]}]},
 {"name":"شاورما عربي صمون","price":350,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0t.jpg","sourceId":"j0t","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,30]}]},
 {"name":"سندويش شاورما صمون","price":230,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0w.jpg","sourceId":"j0w","options":[{"name":"إضافات","values":["لاشيء","قشقوان وفطر"],"extra":[0,30]}]},
 {"name":"شاورما ماريا مع جبنة وفطر","price":440,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0x.jpg","sourceId":"j0x"},
 {"name":"وجبة شرائح شاورما","price":350,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j0y.jpg","sourceId":"j0y","options":[{"name":"الوزن","values":["200غ","250غ"],"extra":[0,50]}]},
 {"name":"نصف كيلو شاورما سفري مع بطاطا وسرفيس","price":600,"category":"شاورما","unit":"","image":"/assets/photos/bludan-fatih/j10.jpg","sourceId":"j10"},
 {"name":"مندي شاورما","price":360,"category":"الوجبات الشرقية","unit":"","image":"/assets/photos/bludan-fatih/j13.jpg","sourceId":"j13"},
 {"name":"مندي دجاج","price":360,"category":"الوجبات الشرقية","unit":"","image":"/assets/photos/bludan-fatih/j12.jpg","sourceId":"j12"},
 {"name":"برك جبنة","price":50,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j1c.jpg","sourceId":"j1c"},
 {"name":"حمص ناعم بشرائح الشاورما","price":250,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j1d.jpg","sourceId":"j1d"},
 {"name":"صحن بطاطا","price":180,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j1b.jpg","sourceId":"j1b"},
 {"name":"ميكس مقبلات","price":300,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j17.jpg","sourceId":"j17"},
 {"name":"يالنجي","price":190,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j18.jpg","sourceId":"j18"},
 {"name":"حمص ناعم","price":190,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j16.jpg","sourceId":"j16"},
 {"name":"متبل","price":190,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j14.jpg","sourceId":"j14"},
 {"name":"بابا غنوج","price":190,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j15.jpg","sourceId":"j15"},
 {"name":"كبة مقلية","price":150,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j19.jpg","sourceId":"j19"},
 {"name":"كبة مشوية","price":150,"category":"المقبلات","unit":"","image":"/assets/photos/bludan-fatih/j1a.jpg","sourceId":"j1a"},
 {"name":"سلطة سويسرية","price":100,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1k.jpg","sourceId":"j1k"},
 {"name":"فتوش","price":200,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1f.jpg","sourceId":"j1f"},
 {"name":"تبولة","price":200,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1g.jpg","sourceId":"j1g"},
 {"name":"جرجير","price":200,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1i.jpg","sourceId":"j1i"},
 {"name":"سلطة شرقية","price":200,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1h.jpg","sourceId":"j1h"},
 {"name":"سلطة سيزر","price":260,"category":"السلطات","unit":"","image":"/assets/photos/bludan-fatih/j1j.jpg","sourceId":"j1j"},
 {"name":"شرحات دجاج مطفاية بالحمض والثوم","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j2a.jpg","sourceId":"j2a"},
 {"name":"برغر دجاج","price":350,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1v.jpg","sourceId":"j1v"},
 {"name":"برغرلحم","price":500,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1w.jpg","sourceId":"j1w"},
 {"name":"فيلادلفيا لحم","price":700,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/1057.jpg","sourceId":"1057"},
 {"name":"شرحات لحم بصوص الديمغلاس","price":700,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j27.jpg","sourceId":"j27"},
 {"name":"شرحات لحم بالحمض و الثوم","price":700,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j28.jpg","sourceId":"j28"},
 {"name":"كريسبي","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1l.jpg","sourceId":"j1l"},
 {"name":"مكسيكي","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1s.jpg","sourceId":"j1s"},
 {"name":"اسكالوب دجاج","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1m.jpg","sourceId":"j1m"},
 {"name":"شيش طاووق","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1n.jpg","sourceId":"j1n"},
 {"name":"فاهيتا","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1r.jpg","sourceId":"j1r"},
 {"name":"كرانشي","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1y.jpg","sourceId":"j1y"},
 {"name":"شرحات دجاج بالبشاميل","price":410,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j29.jpg","sourceId":"j29"},
 {"name":"تشكن ألاكيف","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j22.jpg","sourceId":"j22"},
 {"name":"نابولي","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1u.jpg","sourceId":"j1u"},
 {"name":"فرانشيسكو","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1t.jpg","sourceId":"j1t"},
 {"name":"سوبريم","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1q.jpg","sourceId":"j1q"},
 {"name":"اسكالوب بالشاميل","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j24.jpg","sourceId":"j24"},
 {"name":"زنجر","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1p.jpg","sourceId":"j1p"},
 {"name":"أصابع دجاج","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1o.jpg","sourceId":"j1o"},
 {"name":"كوردون بلو دجاج","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j20.jpg","sourceId":"j20"},
 {"name":"شرحات سمك مطفاية بالصوص","price":460,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j26.jpg","sourceId":"j26"},
 {"name":"وجبة بلودان","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1z.jpg","sourceId":"j1z"},
 {"name":"اسكالوب ميلانيز","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j25.jpg","sourceId":"j25"},
 {"name":"شيش بالفخارة","price":430,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j23.jpg","sourceId":"j23"},
 {"name":"سمك فيليه مقلي","price":460,"category":"الوجبات الغربية","unit":"","image":"/assets/photos/bludan-fatih/j1x.jpg","sourceId":"j1x"},
 {"name":"وجبة بروستد","price":430,"category":"البروستد","unit":"","image":"/assets/photos/bludan-fatih/j2b.jpg","sourceId":"j2b"},
 {"name":"كريسبي","price":240,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2c.jpg","sourceId":"j2c"},
 {"name":"فيلادلفيا لحم","price":350,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/10jn.jpg","sourceId":"10jn"},
 {"name":"اسكالوب دجاج","price":240,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2d.jpg","sourceId":"j2d"},
 {"name":"شيش طاووق","price":240,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2e.jpg","sourceId":"j2e"},
 {"name":"زنجر","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2g.jpg","sourceId":"j2g"},
 {"name":"أصابع دجاج","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2f.jpg","sourceId":"j2f"},
 {"name":"سوبريم","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2h.jpg","sourceId":"j2h"},
 {"name":"فاهيتا","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2i.jpg","sourceId":"j2i"},
 {"name":"مكسيكي","price":240,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2j.jpg","sourceId":"j2j"},
 {"name":"فرانشيسكو","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2k.jpg","sourceId":"j2k"},
 {"name":"نابولي","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2l.jpg","sourceId":"j2l"},
 {"name":"برغر دجاج","price":200,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2m.jpg","sourceId":"j2m"},
 {"name":"برغرلحم","price":300,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2n.jpg","sourceId":"j2n"},
 {"name":"سمك فيليه مقلي","price":280,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2o.jpg","sourceId":"j2o"},
 {"name":"كرانشي","price":250,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2p.jpg","sourceId":"j2p"},
 {"name":"سندويش بطاطا","price":160,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2q.jpg","sourceId":"j2q"},
 {"name":"سندويش بطاطا مع قشقوان","price":200,"category":"السندويش الغربي","unit":"","image":"/assets/photos/bludan-fatih/j2r.jpg","sourceId":"j2r"},
 {"name":"ماء","price":20,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/yh0.jpg","sourceId":"yh0"},
 {"name":"عيران","price":40,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/zgr.jpg","sourceId":"zgr"},
 {"name":"سفن اب","price":50,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/ygy.jpg","sourceId":"ygy"},
 {"name":"فانتا","price":50,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/ygx.jpg","sourceId":"ygx"},
 {"name":"بيبسي زيرو","price":50,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/ygw.jpg","sourceId":"ygw"},
 {"name":"كولا 330مل","price":50,"category":"المشروبات","unit":"","image":"/assets/photos/bludan-fatih/ygv.jpg","sourceId":"ygv"}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const bludanFatihProductCatalog = [];

const bludanFatihProducts = (bludanFatihProductCatalog.length ? bludanFatihProductCatalog : bludanFatihFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1460001 + index,
  storeId: bludanFatihStore.id
}));

const bludanFatihDeliverySettings = {
  [bludanFatihStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { bludanFatihStore, bludanFatihProducts, bludanFatihDeliverySettings };
}
