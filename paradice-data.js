// Generated for مطعم وكافيه بردايس (Paradice Restaurant and Cafe) — Molla Gürani, Fatih, Istanbul.
// Turkish-Arabic full-service restaurant/cafe: breakfast, cold/hot appetizers, salads, soups,
// grills, Levantine + Western mains, pizza, manakish, pasta, seafood, desserts, juices, cocktails.
// Source: paradice.miniandmore.co (minidine/miniandmore platform) — full menu API scrape
// (auth0.miniandmore.co token → minidine.miniandmore.co/customers/{categories,menu/items,contact_info}).
// Google Maps: "مطعم وكافيه بردايس" exact name+coords match, rating/reviews/place_id confirmed.
// Shisha (اراكيل) and a few drink categories (سموذي/موهيتو/كريب) had zero merchant photos in the
// source catalog and are auto-excluded by applyPublishingRules (imageless products never publish).
const paradiceStore = {
 "id": 104,
 "name": "مطعم وكافيه بردايس",
 "category": "مطاعم",
 "image": "/assets/photos/paradice/cover.jpg",
 "coverImage": "/assets/photos/paradice/cover.jpg",
 "logoImage": "/assets/photos/paradice/logo.png",
 "logo": "ب",
 "rating": 4.5,
 "reviews": 1391,
 "newStore": true,
 "delivery": 35,
 "minOrder": 100,
 "time": "30 - 60 دقيقة",
 "distance": 0,
 "location": {
  "lat": 41.010292,
  "lng": 28.9469686
 },
 "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.010292,28.9469686",
 "open": true,
 "featured": false,
 "hasOffer": false,
 "offer": "",
 "description": "بردايس — مطعم وكافيه شامل: فطور ومقبلات ومشاوي ووجبات شرقية وغربية وبيتزا ومناقيش ومأكولات بحرية وحلويات وعصائر وكوكتيلات، حي مولا كوراني، الفاتح، إسطنبول.",
 "address": "Molla Gürani, Turgut Özal Millet Cd. No:16 A, 34093 Fatih/İstanbul",
 "phone": "+90 555 110 13 26",
 "whatsapp": "+90 555 110 13 26",
 "email": "",
 "website": "https://paradice.miniandmore.co",
 "sourceUrl": "https://paradice.miniandmore.co/ar/categories/?branch=paradice",
 "hours": "يومياً 6:00 ص – 2:30 ص",
 "areas": [
  "الفاتح",
  "مناطق إسطنبول حسب المسافة"
 ],
 "fulfillment": "توصيل واستلام",
 "subscription": "احترافي",
 "orderCount": 0,
 "officialStore": true,
 "approvalStatus": "pending",
 "googleRating": 4.5,
 "googleReviewsCount": 1391,
 "googlePlaceId": "ChIJFS0_oTy7yhQRBRyLAc8AXC8",
 "googleMapsUrl": "https://maps.google.com/?cid=3412603506724117509"
};

const paradiceFullCatalog = [
  // فطور
  { name: "فول", description: "", price: 225, category: "فطور", unit: "قطعة", image: "/assets/photos/paradice/p1.jpg" },
  { name: "فتة بسمنة", description: "", price: 280, category: "فطور", unit: "قطعة", image: "/assets/photos/paradice/p2.jpg" },
  { name: "بيض مقلي", description: "", price: 200, category: "فطور", unit: "قطعة", image: "/assets/photos/paradice/p3.jpg" },
  { name: "صحن قشطة مع العسل", description: "", price: 420, category: "فطور", unit: "قطعة", image: "/assets/photos/paradice/p4.jpg" },
  { name: "شكشوكة", description: "", price: 280, category: "فطور", unit: "قطعة", image: "/assets/photos/paradice/p5.jpg" },
  // مقبلات باردة
  { name: "بابا غنوج", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p6.jpg" },
  { name: "محمرة", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p7.jpg" },
  { name: "كول سلو", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p8.jpg" },
  { name: "حمص", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p9.jpg" },
  { name: "يالنجي", description: "", price: 350, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p10.jpg" },
  { name: "سلطة زيتون", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p11.jpg" },
  { name: "حمص بيروتي", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p12.jpg" },
  { name: "متبل", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p13.jpg" },
  { name: "ميكس مقبلات", description: "", price: 900, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p14.jpg" },
  { name: "كريم ثوم", description: "", price: 255, category: "مقبلات باردة", unit: "قطعة", image: "/assets/photos/paradice/p15.jpg" },
  { name: "كبة نية", description: "", price: 255, category: "مقبلات باردة", unit: "صحن", image: "/assets/photos/paradice/p16.jpg" },
  // مقبلات ساخنة
  { name: "برك جبنة", description: "", price: 65, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p17.jpg" },
  { name: "توشكا", description: "", price: 725, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p18.jpg" },
  { name: "كبة مشوية", description: "", price: 160, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p19.jpg" },
  { name: "ماريا", description: "", price: 725, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p20.jpg" },
  { name: "بطاطا مقلية", description: "", price: 255, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p21.jpg" },
  { name: "كبة مقلية", description: "", price: 160, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p22.jpg" },
  { name: "جبنة مسقسقة", description: "", price: 308, category: "مقبلات ساخنة", unit: "قطعة", image: "/assets/photos/paradice/p23.jpg" },
  // السلطات
  { name: "فتوش", description: "", price: 285, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p24.jpg" },
  { name: "سلطة جرجير", description: "", price: 285, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p25.jpg" },
  { name: "سلطة سيزر", description: "", price: 390, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p26.jpg" },
  { name: "ميكس سلطة", description: "", price: 900, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p27.jpg" },
  { name: "تبولة", description: "", price: 285, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p28.jpg" },
  { name: "سلطة شرقية", description: "", price: 285, category: "السلطات", unit: "قطعة", image: "/assets/photos/paradice/p29.jpg" },
  // الشوربات
  { name: "شوربة فطر", description: "", price: 275, category: "الشوربات", unit: "قطعة", image: "/assets/photos/paradice/p30.jpg" },
  { name: "شوربة ذرة", description: "", price: 275, category: "الشوربات", unit: "قطعة", image: "/assets/photos/paradice/p31.jpg" },
  { name: "شوربة عدس", description: "", price: 160, category: "الشوربات", unit: "قطعة", image: "/assets/photos/paradice/p32.jpg" },
  { name: "شوربة دجاج", description: "", price: 275, category: "الشوربات", unit: "قطعة", image: "/assets/photos/paradice/p33.jpg" },
  // سلطات الفواكه
  { name: "كيت كات", description: "", price: 380, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p34.jpg" },
  { name: "تويكس", description: "", price: 390, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p35.jpg" },
  { name: "سلطة سنيكرز", description: "", price: 390, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p36.jpg" },
  { name: "سلطة نيوتيلا", description: "", price: 355, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p37.jpg" },
  { name: "سلطة فواكه برادايس", description: "", price: 750, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p38.jpg" },
  { name: "جاط فواكه شخص", description: "", price: 440, category: "سلطات الفواكه", unit: "قطعة", image: "/assets/photos/paradice/p39.jpg" },
  // مشاوي
  { name: "كباب حلبي", description: "", price: 675, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p40.jpg" },
  { name: "كباب تركي", description: "", price: 675, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p41.jpg" },
  { name: "كباب خشخاش", description: "", price: 700, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p42.jpg" },
  { name: "كباب اورفلي", description: "", price: 675, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p43.jpg" },
  { name: "كباب مكسرات", description: "", price: 828, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p44.jpg" },
  { name: "كباب باذنجان", description: "", price: 725, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p45.jpg" },
  { name: "شقف", description: "", price: 750, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p46.jpg" },
  { name: "كبة قصابية", description: "", price: 675, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p47.jpg" },
  { name: "كستليتا", description: "", price: 1000, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p48.jpg" },
  { name: "معجوقة", description: "", price: 950, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p49.jpg" },
  { name: "شيش طاووق", description: "", price: 460, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p50.jpg" },
  { name: "فروج عالفحم", description: "", price: 500, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p51.jpg" },
  { name: "مشكل شخص", description: "", price: 800, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p52.jpg" },
  { name: "ميكس برادايس 500 غ", description: "", price: 1500, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p53.jpg" },
  { name: "كباب متري بارادايس", description: "", price: 2400, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p54.jpg" },
  { name: "مشاوي مشكلة 1 كغ", description: "", price: 2300, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p55.jpg" },
  { name: "كيلو كباب", description: "", price: 2600, category: "مشاوي", unit: "قطعة", image: "/assets/photos/paradice/p56.jpg" },
  { name: "وجبة لحم بعجين", description: "", price: 650, category: "مشاوي", unit: "كغ", image: "/assets/photos/paradice/p57.jpg" },
  // وجبات شرقية / طبخ
  { name: "كبسة دجاج", description: "", price: 550, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p58.jpg" },
  { name: "مندي لحم", description: "", price: 910, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p59.jpg" },
  { name: "بامية مع رز", description: "", price: 850, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p60.jpg" },
  { name: "ملوخية مع رز", description: "", price: 650, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p61.jpg" },
  { name: "محاشي مشكلة", description: "", price: 750, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p62.jpg" },
  { name: "يبرق بالشرحات", description: "", price: 995, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p63.jpg" },
  { name: "كباب هندي", description: "", price: 750, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p64.jpg" },
  { name: "اظرطما مع رز", description: "", price: 1000, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p65.jpg" },
  { name: "شاكرية باللبن", description: "", price: 910, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p66.jpg" },
  { name: "فريكة لحم", description: "", price: 910, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p67.jpg" },
  { name: "لحمة بالصينية", description: "", price: 850, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p68.jpg" },
  { name: "منسف لحم فريكة ورز", description: "", price: 910, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p69.jpg" },
  { name: "سندوانات", description: "", price: 730, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p70.jpg" },
  { name: "سفرجلية", description: "", price: 1000, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p71.jpg" },
  { name: "كبة لبنية", description: "", price: 900, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p72.jpg" },
  { name: "وجبة لحمة بكرز", description: "", price: 1100, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p73.jpg" },
  { name: "شيخ المحشي", description: "", price: 900, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p74.jpg" },
  { name: "لحم بعجين اقراص", description: "", price: 650, category: "وجبات شرقية / طبخ", unit: "قطعة", image: "/assets/photos/paradice/p75.jpg" },
  // وجبات غربية
  { name: "كوردون بلو", description: "", price: 625, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p76.jpg" },
  { name: "تشيكن الاكيف", description: "", price: 625, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p77.jpg" },
  { name: "تشيكن موتارد", description: "", price: 635, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p78.jpg" },
  { name: "فاهيتا", description: "", price: 575, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p79.jpg" },
  { name: "دجاج مكسيكي", description: "", price: 550, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p80.jpg" },
  { name: "استراغنوف دجاج", description: "", price: 625, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p81.jpg" },
  { name: "اسكالوب ميلانيز", description: "", price: 545, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p82.jpg" },
  { name: "اسكالوب بانيه", description: "", price: 510, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p83.jpg" },
  { name: "سبايسي", description: "", price: 510, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p84.jpg" },
  { name: "كريسبي", description: "", price: 510, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p85.jpg" },
  { name: "تشيكن ناغيت", description: "", price: 510, category: "وجبات غربية", unit: "قطعة", image: "/assets/photos/paradice/p86.jpg" },
  // السندويش الغربي
  { name: "شاورما عربي دبل", description: "", price: 450, category: "السندويش الغربي", unit: "قطعة", image: "/assets/photos/paradice/p87.jpg" },
  // بيتزا
  { name: "مارغريتا", description: "", price: 360, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p88.jpg" },
  { name: "الفصول الأربعة", description: "", price: 380, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p89.jpg" },
  { name: "سجق", description: "", price: 390, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p90.jpg" },
  { name: "بيتزا فطر", description: "", price: 380, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p91.jpg" },
  { name: "كابري", description: "", price: 390, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p92.jpg" },
  { name: "خضار", description: "", price: 380, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p93.jpg" },
  { name: "بيتزا برادايس/ ذرة وفطر", description: "", price: 490, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p94.jpg" },
  { name: "محشية الأطراف", description: "", price: 590, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p95.jpg" },
  { name: "بيتزا تونا", description: "", price: 635, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p96.jpg" },
  { name: "بيتزا دجاج", description: "", price: 490, category: "بيتزا", unit: "قطعة", image: "/assets/photos/paradice/p97.jpg" },
  // مناقيش
  { name: "جبنة كردية", description: "", price: 280, category: "مناقيش", unit: "قطعة", image: "/assets/photos/paradice/p98.jpg" },
  { name: "زعتر", description: "", price: 175, category: "مناقيش", unit: "قطعة", image: "/assets/photos/paradice/p99.jpg" },
  { name: "قشقوان", description: "", price: 185, category: "مناقيش", unit: "قطعة", image: "/assets/photos/paradice/p100.jpg" },
  { name: "محمرة", description: "", price: 185, category: "مناقيش", unit: "قطعة", image: "/assets/photos/paradice/p101.jpg" },
  { name: "محمرة وجبنة", description: "", price: 185, category: "مناقيش", unit: "قطعة", image: "/assets/photos/paradice/p102.jpg" },
  // ماكولات بحرية
  { name: "ميكس وجبات بحرية بردايس", description: "", price: 1400, category: "ماكولات بحرية", unit: "صحن", image: "/assets/photos/paradice/p103.jpg" },
  // امبراطور
  { name: "امبراطور موز وحليب", description: "", price: 750, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p104.jpg" },
  { name: "امبراطور نوتيلا", description: "", price: 750, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p105.jpg" },
  { name: "امبراطور افوكادو", description: "", price: 775, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p106.jpg" },
  { name: "امبراطور فواكه", description: "", price: 750, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p107.jpg" },
  { name: "اسطورة برادايس", description: "", price: 1100, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p108.jpg" },
  { name: "قاظان", description: "", price: 950, category: "امبراطور", unit: "قطعة", image: "/assets/photos/paradice/p109.jpg" },
  // وافل
  { name: "وافل مكسرات بالقشطة", description: "", price: 450, category: "وافل", unit: "قطعة", image: "/assets/photos/paradice/p110.jpg" },
  { name: "وافل شوكولا", description: "", price: 375, category: "وافل", unit: "قطعة", image: "/assets/photos/paradice/p111.jpg" },
  { name: "وافل فواكه", description: "", price: 395, category: "وافل", unit: "قطعة", image: "/assets/photos/paradice/p112.jpg" },
  // حلويات
  { name: "حلو عربي", description: "", price: 750, category: "حلويات", unit: "صحن", image: "/assets/photos/paradice/p113.jpg" },
  { name: "كاتمر", description: "", price: 420, category: "حلويات", unit: "قطعة", image: "/assets/photos/paradice/p114.jpg" },
  { name: "كنافة بالجبنة", description: "", price: 420, category: "حلويات", unit: "قطعة", image: "/assets/photos/paradice/p115.jpg" },
  // بوظة
  { name: "بوظة مشكلة", description: "", price: 400, category: "بوظة", unit: "صحن", image: "/assets/photos/paradice/p116.jpg" },
  { name: "شوكولامو", description: "", price: 385, category: "بوظة", unit: "قطعة", image: "/assets/photos/paradice/p117.jpg" },
  { name: "توتي فروتي", description: "", price: 355, category: "بوظة", unit: "صحن", image: "/assets/photos/paradice/p118.jpg" },
  { name: "بوظة عربي دق", description: "", price: 715, category: "بوظة", unit: "صحن", image: "/assets/photos/paradice/p119.jpg" },
  { name: "كاتو كلاس", description: "", price: 450, category: "بوظة", unit: "صحن", image: "/assets/photos/paradice/p120.jpg" },
  // المشروبات
  { name: "شاي", description: "", price: 60, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p121.jpg" },
  { name: "شاي أخضر", description: "", price: 150, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p122.jpg" },
  { name: "كمون وليمون", description: "", price: 190, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p123.jpg" },
  { name: "زنجبيل بالليمون", description: "", price: 205, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p124.jpg" },
  { name: "بيبسي", description: "", price: 125, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p125.jpg" },
  { name: "عيران", description: "", price: 90, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p126.jpg" },
  { name: "صودا", description: "", price: 175, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p127.jpg" },
  { name: "ريد بول", description: "", price: 225, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p128.jpg" },
  { name: "ريدبول مكسيكي", description: "", price: 285, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p129.jpg" },
  { name: "زهورات بالعسل", description: "", price: 175, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p130.jpg" },
  { name: "قهوة سورية", description: "", price: 160, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p131.jpg" },
  { name: "اسبريسو", description: "", price: 170, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p132.jpg" },
  { name: "كابوتشينو", description: "", price: 200, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p133.jpg" },
  { name: "هوت شوكليت", description: "", price: 200, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p134.jpg" },
  { name: "نسكافيه بلاك", description: "", price: 190, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p135.jpg" },
  { name: "نسكافيه بالحليب", description: "", price: 200, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p136.jpg" },
  { name: "كافي لاتيه", description: "", price: 275, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p137.jpg" },
  { name: "موكا لاتيه", description: "", price: 275, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p138.jpg" },
  { name: "سنيكرز لاتيه", description: "", price: 275, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p139.jpg" },
  { name: "كراميل ميكاتو", description: "", price: 275, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p140.jpg" },
  { name: "باونتي لاتيه", description: "", price: 245, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p141.jpg" },
  { name: "سحلب", description: "", price: 175, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p142.jpg" },
  { name: "اميركان كوفي", description: "", price: 210, category: "المشروبات", unit: "قطعة", image: "/assets/photos/paradice/p143.jpg" },
  // العصائر
  { name: "عصير برتقال", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p144.jpg" },
  { name: "فراولة / فريز", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p145.jpg" },
  { name: "تفاح", description: "", price: 325, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p146.jpg" },
  { name: "جمايكا", description: "", price: 360, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p147.jpg" },
  { name: "اناناس وكيوي", description: "", price: 305, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p148.jpg" },
  { name: "عصير بردايس سبيشل", description: "", price: 670, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p149.jpg" },
  { name: "مانجو", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p150.jpg" },
  { name: "كيوي", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p151.jpg" },
  { name: "جزر", description: "", price: 325, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p152.jpg" },
  { name: "أناناس سبيشال", description: "", price: 670, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p153.jpg" },
  { name: "فريز ومانغو", description: "", price: 295, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p154.jpg" },
  { name: "ليمونادا", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p155.jpg" },
  { name: "اناناس", description: "", price: 275, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p156.jpg" },
  { name: "رمان", description: "", price: 325, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p157.jpg" },
  { name: "بولو", description: "", price: 360, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p158.jpg" },
  { name: "ميكس باور", description: "", price: 325, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p159.jpg" },
  { name: "برتقال وليمون", description: "", price: 295, category: "العصائر", unit: "قطعة", image: "/assets/photos/paradice/p160.jpg" },
  // كوكتيلات
  { name: "افوكادو", description: "", price: 450, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p161.jpg" },
  { name: "كيكي", description: "", price: 210, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p162.jpg" },
  { name: "كوكتيل فواكه", description: "", price: 310, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p163.jpg" },
  { name: "كوكتيل موز حليب", description: "", price: 750, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p164.jpg" },
  { name: "قشاطي كوكتيل", description: "", price: 750, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p165.jpg" },
  { name: "تروبيكال", description: "", price: 325, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p166.jpg" },
  { name: "فيرموزا", description: "", price: 310, category: "كوكتيلات", unit: "قطعة", image: "/assets/photos/paradice/p167.jpg" },
  // ميلك شيك
  { name: "ميلك شيك شوكولا", description: "", price: 360, category: "ميلك شيك", unit: "قطعة", image: "/assets/photos/paradice/p168.jpg" },
  { name: "ميلك شيك اوريو", description: "", price: 360, category: "ميلك شيك", unit: "قطعة", image: "/assets/photos/paradice/p169.jpg" },
  { name: "ميلك شيك فانيل", description: "", price: 360, category: "ميلك شيك", unit: "قطعة", image: "/assets/photos/paradice/p170.jpg" },
  { name: "ميلك شيك فريز", description: "", price: 360, category: "ميلك شيك", unit: "قطعة", image: "/assets/photos/paradice/p171.jpg" }
];

// Repo-bundled catalog is emptied for fast first paint; products load from Supabase.
const paradiceProductCatalog = [];

const paradiceProducts = (paradiceProductCatalog.length ? paradiceProductCatalog : paradiceFullCatalog).map((product, index) => ({
  ...product,
  available: true,
  id: 1860001 + index,
  storeId: paradiceStore.id
}));

const paradiceDeliverySettings = {
  [paradiceStore.id]: { mode: "distance", fixedFee: 35, ratePerKm: 20, prepMinutes: 30, maxRoundTripKm: 120 }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { paradiceStore, paradiceProducts, paradiceDeliverySettings };
}
