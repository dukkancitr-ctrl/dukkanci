// Generated for مطعم سروجة (Saruja Restoran) — Newistalife, 1. Etap, Başakşehir, İstanbul.
// Source: saruja.macho.menu (lamaz backend), Arabic names/descriptions. Imageless items (drinks,
// by-the-kilo grills, most sandwiches/pides) were skipped per the no-real-image publishing rule.
// NOTE: sarujaProductCatalog is intentionally emptied in the repo (perf) — the full catalog lives
// in Supabase and is pushed via scripts/_scrape/push-store.cjs.
const sarujaStore = {
 "id": 55,
 "name": "مطعم سروجة",
 "category": "مطاعم",
 "image": "/assets/photos/saruja/cover.jpg",
 "coverImage": "/assets/photos/saruja/cover.jpg",
 "logoImage": "/assets/photos/saruja/logo.png",
 "logo": "س",
 "rating": 0,
 "reviews": 0,
 "newStore": true,
 "delivery": 35,
 "minOrder": 150,
 "time": "45 - 75 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.0320896,
  "lng": 28.8391168
 },
 "mapUrl": "https://maps.app.goo.gl/xUub6uPk3vvGysSu9",
 "open": true,
 "featured": true,
 "hasOffer": false,
 "offer": "",
 "description": "مطعم سروجة — مطبخ شامي دمشقي أصيل في باشاك شهير. حمص وفول وفتّة، مقبلات باردة وساخنة وسلطات، فطائر ومعجنات بالفرن، جرن الكبة والفخارات، مشاوي على الفحم وكفتة وكبة، بيتزا وأطباق يومية. طازج ويصل إلى بابك.",
 "address": "نيوإستا لايف (Newistalife)، شارع البروفيسور د. نجم الدين أربكان، حي الإتاب الأول (1. Etap)، باشاك شهير، إسطنبول، تركيا",
 "phone": "+90 561 610 11 65",
 "whatsapp": "+90 561 610 11 65",
 "email": "",
 "website": "",
 "sourceUrl": "https://maps.app.goo.gl/xUub6uPk3vvGysSu9",
 "hours": "",
 "areas": [
  "باشاك شهير",
  "إسطنبول",
  "مناطق التوصيل حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true
};

// Full catalog used ONLY for the Supabase push; emptied in the committed repo (see note above).
const sarujaFullCatalog = [
 {"name":"فول مدمس بالحمض والثوم","price":245,"category":"الحمصاني","unit":"طبق","image":"/assets/photos/saruja/8.jpg","description":"فول حب مدمس ( متبل ) بالحمض و الثوم وزيت الزيتون والطاطم والبقدونس"},
 {"name":"فول مدمس بالطحينة","price":245,"category":"الحمصاني","unit":"طبق","image":"/assets/photos/saruja/9.jpg","description":"فول حب مدمس ( متبل ) بالطرطور والطماطم والبقدونس وزيت الزيتون"},
 {"name":"حمص حب بالحمض والثوم","price":245,"category":"الحمصاني","unit":"طبق","image":"/assets/photos/saruja/10.jpg","description":"حمص حب مدمس ( متبل ) بالحمض و الثوم وزيت الزيتون والطاطم والبقدونس"},
 {"name":"حمص حب بالطحينة","price":245,"category":"الحمصاني","unit":"طبق","image":"/assets/photos/saruja/11.jpg","description":"حمص حب مدمس ( متبل ) بالطرطور والطماطم والبقدونس وزيت الزيتون"},
 {"name":"فتة بزيت الزيتون","price":275,"category":"الفتات","unit":"طبق","image":"/assets/photos/saruja/30.jpg","description":"حمص حب متبل بالطرطور و الخبز المحمص مغطى بزيت الزيتون والرمان"},
 {"name":"فتة باللحمة","price":325,"category":"الفتات","unit":"طبق","image":"/assets/photos/saruja/32.jpg","description":"حمص حب متبل بالطرطور والخبز المحمص مغطى بلحم الغنم المفروم والرمان والصنوبر"},
 {"name":"فتة دجاج","price":295,"category":"الفتات","unit":"طبق","image":"/assets/photos/saruja/33.jpg","description":"الخبز المحمص مع صدر الدجاج المتبل بالطرطور والمغطاة بالسمنة والرمان"},
 {"name":"سلطة خضرا","price":225,"category":"السلطات","unit":"طبق","image":"/assets/photos/saruja/34.jpg","description":"بندورة، خيار، بصل أحمر، خس، فليفلة خضرا، ليمون، زيت الزيتون"},
 {"name":"تبولة","price":265,"category":"السلطات","unit":"طبق","image":"/assets/photos/saruja/35.jpg","description":"بندورة، بقدونس، بصل، برغل ناعم، ليمون، زيت الزيتون"},
 {"name":"فتوش","price":265,"category":"السلطات","unit":"طبق","image":"/assets/photos/saruja/36.jpg","description":"بندورة، خيار، بصل، فجل، خس، بقلة، خبز محمص، سمّاق، خل أحمر، زيت الزيتون، دبس الرمان"},
 {"name":"جرجير","price":290,"category":"السلطات","unit":"طبق","image":"/assets/photos/saruja/37.jpg","description":"أوراق الجرجير، بندورة، جوز، رمان، بصل أحمر، زيت الزيتون، دبس الرمان"},
 {"name":"سلطة شمندر","price":315,"category":"السلطات","unit":"طبق","image":"/assets/photos/saruja/38.jpg","description":"شمندر ، جوز ، بقدونس، خل أحمر ، زيت زيتون"},
 {"name":"حمص بالطحينة","price":185,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/39.jpg","description":"الحمص المطحون المتبل بالطحينة"},
 {"name":"حمص بيروتي","price":245,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/41.jpg","description":"الحمص المطحون المتبل بالبقدونس والطحينة والمغطى بحبات الفول"},
 {"name":"متبل باذنجان","price":245,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/43.jpg","description":"الباذنجان المشوي المتبل باللبن والطحينة"},
 {"name":"باباغنوج","price":245,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/46.jpg","description":"باذنجان مشوي، ثوم، بصل، بندورة، بقدونس، زيت الزيتون، فليفلة مشكلة"},
 {"name":"يلنجي ورق عنب","price":275,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/47.jpg","description":"ورق عنب محشو بالرز والبندورة والبقدونس، زيت الزيتون"},
 {"name":"حراق اصبعو","price":325,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/48.jpg","description":"عدس مطبوخ مع العجين متبل بدبس الرمان والتمر الهندي، بصل مقلي، كزبرة"},
 {"name":"سبانخ بالزيت","price":275,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/49.jpg","description":"سبانخ، رمان، ثوم، جوز، بصل مقلي"},
 {"name":"شوربة عدس","price":165,"category":"الشوربات","unit":"طبق","image":"/assets/photos/saruja/53.jpg","description":"-"},
 {"name":"شوربة كريمة الذرة","price":215,"category":"الشوربات","unit":"طبق","image":"/assets/photos/saruja/54.jpg","description":"-"},
 {"name":"شوربة كريمة الفطر","price":215,"category":"الشوربات","unit":"طبق","image":"/assets/photos/saruja/55.jpg","description":"-"},
 {"name":"شوربة كريمة الدجاج","price":215,"category":"الشوربات","unit":"طبق","image":"/assets/photos/saruja/56.jpg","description":"-"},
 {"name":"فطيرة جبنة شامية ( قطعة )","price":75,"category":"فطائر","unit":"قطعة","image":"/assets/photos/saruja/57.jpg","description":"جبنة عكاوي، بقدونس، حبة البركة"},
 {"name":"فطيرة سجق وقشقوان ( قطعة )","price":165,"category":"فطائر","unit":"قطعة","image":"/assets/photos/saruja/58.jpg","description":"سجق مع جبنة الموزريلا"},
 {"name":"فطيرة سبانخ ( قطعة )","price":65,"category":"فطائر","unit":"قطعة","image":"/assets/photos/saruja/59.jpg","description":"السبانخ الطازجة المتبلة بدبس الرمان مع البصل و الرمان والجوز"},
 {"name":"بطاطا حارّة","price":265,"category":"المقبلات الساخنة","unit":"طبق","image":"/assets/photos/saruja/96.jpg","description":"مكعبات البطاطا المقلية مع الكزبرة والثوم"},
 {"name":"برك بالجبنة ( قطعة )","price":69,"category":"المقبلات الساخنة","unit":"قطعة","image":"/assets/photos/saruja/98.jpg","description":"عجينة البرك المحشوة بالجبنة والبقدونس"},
 {"name":"باذنجان مقلي","price":265,"category":"المقبلات الساخنة","unit":"طبق","image":"/assets/photos/saruja/100.jpg","description":"باذنجان مقلي يقدم مع الثوم والبقدونس"},
 {"name":"حمص باللحمة","price":385,"category":"المقبلات الساخنة","unit":"طبق","image":"/assets/photos/saruja/102.jpg","description":"حمص مغطى بالقاورما والسمنة"},
 {"name":"كبة مقلية ( قطعة )","price":155,"category":"جرن الكبة","unit":"قطعة","image":"/assets/photos/saruja/104.jpg","description":"الكبة المقلية المحشوة بلحم الغنم المفروم والصنوبر"},
 {"name":"كبة مشوية ( قطعة )","price":195,"category":"جرن الكبة","unit":"قطعة","image":"/assets/photos/saruja/105.jpg","description":"الكبة المشوية على الفحم المحسوة بدهن ولحم الغنم المفروم والرمان والجوز"},
 {"name":"كبة نية","price":430,"category":"جرن الكبة","unit":"طبق","image":"/assets/photos/saruja/108.jpg","description":"لحم الغنم الطازج الني والبرغل الناعم والجوز وزيت الزيتون"},
 {"name":"هبرة نية","price":430,"category":"جرن الكبة","unit":"طبق","image":"/assets/photos/saruja/109.jpg","description":"لحم الغنم الطازج الني"},
 {"name":"شرحات على العجين","price":465,"category":"الفرن","unit":"طبق","image":"/assets/photos/saruja/110.jpg","description":"شرحات لحم الغنم مخبوزة برغيف"},
 {"name":"فخارة شرحات دجاج","price":545,"category":"الفخارات","unit":"طبق","image":"/assets/photos/saruja/116.jpg","description":"شرحات صدر الدجاج المتبلة بالصلصة الخاصة والفطر والحمض والثوم"},
 {"name":"فخارة لحمة بالصينية  ( بالبندورة )","price":770,"category":"الفخارات","unit":"طبق","image":"/assets/photos/saruja/117.jpg","description":"لحم الغنم المفروم المتبل بالبهارات والمغطى بشرائح البندورة"},
 {"name":"فخارة كباب هندي","price":680,"category":"الفخارات","unit":"طبق","image":"/assets/photos/saruja/119.jpg","description":"لحم الغنم المفروم، بندورة، بصل، فليفة حمرا، يقدم مع الرز الرز بالشعيرية"},
 {"name":"فخارة طاووق بالبشاميل","price":590,"category":"الفخارات","unit":"طبق","image":"/assets/photos/saruja/120.jpg","description":"قطع الطاووق المشوي مع الفطر مغطاة بجبنة الموزيريلا وصوص البشاميل ، تقدم مع الرز بالشعيرية"},
 {"name":"كستليتا","price":825,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/123.jpg","description":"شرحات لحم الغنم المتبلة بالتوابل الدمشقية والمشوية على الفحم تقدم مع البرغل بالبندورة والخضار المشوية والطرطور"},
 {"name":"كباب باذنجان","price":728,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/125.jpg","description":"كباب لحم الغنم وقطع الباذنجان المتبل بالبهارات و المشوي على الفحم يقدم مع البرغل بالبندورة والخضار المشوية والطرطور"},
 {"name":"كباب ازمرلي","price":728,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/126.jpg","description":"كباب لحم الغنم المتبل بالجبنة والفستق الحلبي والبصل والبقدونس والبهارات و المشوي على الفحم يقدم مع البرغل بالبندورة والخضار المشوية والطرطور"},
 {"name":"كبة على السيخ","price":630,"category":"جرن الكبة","unit":"طبق","image":"/assets/photos/saruja/128.jpg","description":"أسياخ من عجينة الكبة ولحم الغنم المفروم والجوز مشوية على الفحم تقدم مع البطاطا المقلية"},
 {"name":"ماريا / توشكا","price":770,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/129.jpg","description":"لحم الغنم المتبل بالبصل والنعنع والطاطم ودبس الفليفلة داخل رغيف و المشوي على الفحم يقدم مع البطاطا المقلية و كريم الثوم"},
 {"name":"شيش طاووق","price":595,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/131.jpg","description":"قطع من صدر الدجاح المتبل بالفليفلة الحمرا والمشوية على الفحم تقدم مع البطاطا المقلية و كريم الثوم"},
 {"name":"فروج مشوي","price":465,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/132.jpg","description":"نصف فروج متبل بالفليفلة الحمرا مشوي على الفحم يقدم مع البطاطا المقلية و كريم الثوم"},
 {"name":"كبة لبنية","price":735,"category":"الشاميات","unit":"طبق","image":"/assets/photos/saruja/144.jpg","description":"كبة محشوة بلحم الغنم المفروم والجوز، مطبوخة مع اللبن ومغطاة بالطرخون أو الثوم مع الكزبرة، تقدم مع الرز بالشعيرية"},
 {"name":"شيشبرك","price":735,"category":"الشاميات","unit":"طبق","image":"/assets/photos/saruja/145.jpg","description":"أقراص الشيشبرك المطبوخة باللبن والمغطاة بالثوم والكزبرة، تقدم مع الرز بالشعيرية"},
 {"name":"شاكرية","price":825,"category":"الشاميات","unit":"طبق","image":"/assets/photos/saruja/146.jpg","description":"قطع لحم الغنم المختارة بعناية والمطبوخة باللبن، تقدم مع الرز بالشعيرية"},
 {"name":"كبة مشمشية","price":825,"category":"الشاميات","unit":"طبق","image":"/assets/photos/saruja/147.jpg","description":"قطع لحم الغنم والسلق وأقراص الكبة المطبوخة باللبن، تقدم مع الرز بالشعيرية"},
 {"name":"ملوخية ورز ( بالدجاج أو اللحم )","price":690,"category":"الطبق اليومي ( حتى نفاذ الكمية )","unit":"طبق","image":"/assets/photos/saruja/150.jpg","description":"ملوخية شامية : أوراق الملوخية المطبوخه بعناية المغطاة بشرحات الدجاج. تقدم مع الرز بالشعيرية"},
 {"name":"يبرق","price":725,"category":"الطبق اليومي ( حتى نفاذ الكمية )","unit":"طبق","image":"/assets/photos/saruja/153.jpg","description":"ورق العنب الملفوف والمحشو بالرز ولحم الغنم المفروم والمغطى بشرحات لحم الغنم ويقدم مع اللبن"},
 {"name":"مظبي الدجاج","price":490,"category":"الطبق اليومي ( حتى نفاذ الكمية )","unit":"طبق","image":"/assets/photos/saruja/154.jpg","description":"أرز البسمتي المطبوخ مع البهارات الخاصة مع فخذ الدجاج المشوي على الفحم"},
 {"name":"مقلوبة الباذنجان","price":690,"category":"الطبق اليومي ( حتى نفاذ الكمية )","unit":"طبق","image":"/assets/photos/saruja/155.jpg","description":"قطع الباذنجان المختارة بعناية المطبوخة مع الرز والمغطاة بلحم الغنم المفروم والباذنجان المقلي والصنوبر تقدم مع اللبن بالخيار."},
 {"name":"فريكة بلحم الموزات","price":690,"category":"الطبق اليومي ( حتى نفاذ الكمية )","unit":"طبق","image":"/assets/photos/saruja/156.jpg","description":"الفريكة الطازجة المحمصة والمطبوخة بمرقة اللحم والمغطاة بموزات لحم الغنم  ، مزينة بالمكسرات، تقدم مع اللبن بالخيار"},
 {"name":"كوردون بلو","price":530,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/158.jpg","description":"قطعتان من صدر الدجاج المقلي المحشو بالجبن والمغطى بالبشاميل، يقدم مع البطاطا المقلية"},
 {"name":"اسكلوبيني","price":480,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/159.jpg","description":"قطعتان من صدر الدجاج المقلي المتبل بالبهارات، يقدم مع البطاطا المقلية"},
 {"name":"فاهيتا","price":480,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/160.jpg","description":"قطع صدر الدجاج المشوي مع الفليفلة والفطر والمغطى بجبنة التشيدر، يقدم مع البطاطا المقلية"},
 {"name":"دجاج آلاكيف","price":530,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/161.jpg","description":"صدر الدجاج المقلي المحشو بالجبنة والمغطى بخلطة البشاميل مع الخردل، يقدم مع البطاطا المقلية"},
 {"name":"دجاج بالصوص الحار","price":480,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/162.jpg","description":"قطع صدر الدجاج المتبل بالبهارات الحارّة والفليفلة والفطر"},
 {"name":"كريسبي الدجاج","price":445,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/163.jpg","description":"قطع صدر الدجاج المقرمش المتبل بالبهارات , تقدم مع البطاطا المقلية"},
 {"name":"زنجر الدجاج الحار","price":445,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/164.jpg","description":"قطع صدر الدجاج المقرمش الحار المتبل بالبهارات , تقدم مع البطاطا المقلية"},
 {"name":"بيتزا الخضار","price":315,"category":"البيتزا","unit":"طبق","image":"/assets/photos/saruja/167.jpg","description":"صلصة البيتزا , موزريلا , طماطم , فلفل أخضر , زيتون"},
 {"name":"بيتزا الدجاج","price":425,"category":"البيتزا","unit":"طبق","image":"/assets/photos/saruja/168.jpg","description":"صلصة البيتزا ,قطع صدر الدجاج , موزريلا"},
 {"name":"بيتزا السجق","price":445,"category":"البيتزا","unit":"طبق","image":"/assets/photos/saruja/169.jpg","description":"صلصة البيتزا , موزريلا , سجق , طماطم"},
 {"name":"مرغريتا","price":295,"category":"البيتزا","unit":"طبق","image":"/assets/photos/saruja/170.jpg","description":"صلصة البيتزا , موزريلا"},
 {"name":"بيتزا الفطر","price":315,"category":"البيتزا","unit":"طبق","image":"/assets/photos/saruja/171.jpg","description":"صلصة البيتزا , موزريلا , فطر"},
 {"name":"تورك كولا","price":75,"category":"المشروبات الباردة","unit":"قطعة","image":"/assets/photos/saruja/172.jpg","description":"-"},
 {"name":"لبن عيران","price":90,"category":"المشروبات الباردة","unit":"كأس","image":"/assets/photos/saruja/182.jpg","description":"-"},
 {"name":"اسكلوبيني ميلانو","price":520,"category":"اختيارنا","unit":"طبق","image":"/assets/photos/saruja/210.jpg","description":"قطعتان من صدر الدجاج المقلي المغطى بالكريمة ، المتبل بالبهارات ، يقدم مع البطاطا المقلية"},
 {"name":"بطاطا بالكزبرة و الثوم","price":265,"category":"المقبلات الساخنة","unit":"طبق","image":"/assets/photos/saruja/211.jpg","description":"مكعبات البطاطا المقلية مع الكزبرة والثوم والزيت الحار ودبس الفليفلة"},
 {"name":"فتة بالسمنة و الصنوبر","price":275,"category":"الفتات","unit":"طبق","image":"/assets/photos/saruja/213.jpg","description":"حمص حب متبل بالطرطور و الخبز المحمص مغطى بالسمنة والرمان"},
 {"name":"متبل شمندر","price":245,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/220.jpg","description":"شمندر - طحينة"},
 {"name":"صفيحة بدبس الرمان ( قطعة )","price":75,"category":"الفرن","unit":"قطعة","image":"/assets/photos/saruja/236.jpg","description":"Kuzu Kıyması Nar ekşisi ile"},
 {"name":"صفيحة بالبندورة ( قطعة )","price":75,"category":"الفرن","unit":"قطعة","image":"/assets/photos/saruja/240.jpg","description":"Kuzu Kıyması Domates ile"},
 {"name":"فطيرة  زعتر ( قطعة )","price":65,"category":"فطائر","unit":"قطعة","image":"/assets/photos/saruja/269.jpg","description":""},
 {"name":"مشويات مشكلة","price":875,"category":"المشويات","unit":"طبق","image":"/assets/photos/saruja/272.jpg","description":"لحم مشوي، شيش طاووق ، كباب ، ريش تقدم مع البطاطا المقلية والخضار المشوية و كريم الثوم"},
 {"name":"محمرة","price":185,"category":"المقبلات الباردة","unit":"طبق","image":"/assets/photos/saruja/280.jpg","description":"فليفلة حمرا حارّة ، جوز، زيت الزيتون"},
 {"name":"كولا دايت","price":75,"category":"المشروبات الباردة","unit":"قطعة","image":"/assets/photos/saruja/281.jpg","description":"-"},
 {"name":"فخارة لحمة بالصينية  ( بالطحينة )","price":770,"category":"الفخارات","unit":"طبق","image":"/assets/photos/saruja/282.jpg","description":"لحم الغنم المفروم المتبل بالبهارات والمغطى بشرائح البندورة"},
 {"name":"فطيرة محمرة ( قطعة )","price":65,"category":"فطائر","unit":"قطعة","image":"/assets/photos/saruja/283.jpg","description":"صلصة المحمرة"},
 {"name":"سجقات 1 كغ","price":2200,"category":"القشة","unit":"كيلو","image":"/assets/photos/saruja/284.jpg","description":""},
 {"name":"فتة سجقات","price":425,"category":"القشة","unit":"طبق","image":"/assets/photos/saruja/285.jpg","description":""},
 {"name":"مقادم ( قطعة )","price":125,"category":"القشة","unit":"قطعة","image":"/assets/photos/saruja/286.jpg","description":""},
 {"name":"فتة مقادم","price":425,"category":"القشة","unit":"طبق","image":"/assets/photos/saruja/287.jpg","description":""}
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const sarujaProductCatalog = [];

const sarujaProducts = (sarujaProductCatalog.length ? sarujaProductCatalog : sarujaFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1390001 + index,
  storeId: sarujaStore.id
}));

const sarujaDeliverySettings = {
  [sarujaStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { sarujaStore, sarujaProducts, sarujaDeliverySettings };
}
