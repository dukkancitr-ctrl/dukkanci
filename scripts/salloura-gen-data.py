# -*- coding: utf-8 -*-
import json

STORE = {
    "id": 14,
    "name": "حلويات سلورة",
    "category": "حلويات",
    "image": "/assets/photos/salloura/cover.jpg",
    "coverImage": "/assets/photos/salloura/cover.jpg",
    "logoImage": "/assets/photos/salloura/logo.png",
    "logo": "س",
    "rating": 0,
    "reviews": 0,
    "newStore": True,
    "delivery": 30,
    "minOrder": 0,
    "time": "40 - 60 دقيقة",
    "distance": 21.5,
    "location": {"lat": 41.0341, "lng": 28.6730},
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Salloura+1105.+Sk.+9B+Esenyurt+Istanbul",
    "open": True,
    "featured": True,
    "hasOffer": False,
    "priceOnRequest": True,
    "description": "حلويات سلورة (Salloura) — عراقة الحلويات الحلبية منذ 1875: بقلاوة وكول وشكور ومبرومة وأصابع بالفستق والكاجو، معمول وكرابيج وكعك، وتشكيلات وعلب فاخرة. الأسعار عند الطلب عبر واتساب.",
    "address": "1105. Sk. 9B، 34517 إسنيورت، إسطنبول، تركيا",
    "phone": "+90 545 654 53 77",
    "whatsapp": "+90 545 654 53 77",
    "email": "ismfaurjw@gmail.com",
    "website": "",
    "sourceUrl": "",
    "hours": "يرجى تأكيد أوقات العمل والأسعار عبر واتساب",
    "areas": ["إسنيورت", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام",
    "subscription": "احترافي",
    "orderCount": 0,
    "officialStore": True,
}

# slug, name, unit, category, featured
ITEMS = [
    ("mishkal_1200", "تشكيلة عربية مشكّلة 1200 غرام", "علبة", "علب وتشكيلات", True),
    ("mishkal_650", "حلويات عربية مشكّلة 650 غرام", "علبة", "علب وتشكيلات", True),
    ("mishkal_450", "حلويات عربية مشكّلة 450 غرام", "علبة", "علب وتشكيلات", False),
    ("mishkal_1000", "حلويات عربية مشكّلة 1000 غرام", "علبة", "علب وتشكيلات", True),
    ("kol_w_shkor", "كول وشكور", "كيلو", "بقلاوة بالفستق", True),
    ("joja_mikserat", "جوجة مكسرات", "كيلو", "بقلاوة", False),
    ("loqmet_sultan", "لقمة السلطان", "كيلو", "بقلاوة بالفستق", True),
    ("asabe_kaju", "أصابع كاجو", "كيلو", "بقلاوة بالكاجو", False),
    ("mabroumeh", "مبرومة", "كيلو", "بقلاوة بالفستق", True),
    ("harisa_loz", "هريسة لوز", "كيلو", "هريسة", False),
    ("harisa_fistik", "هريسة فستق", "كيلو", "هريسة", True),
    ("baklava_fistik", "بقلاوة فستق", "كيلو", "بقلاوة بالفستق", True),
    ("joz_kaju", "جوز كاجو", "كيلو", "بقلاوة بالكاجو", False),
    ("siwar_fistik", "سوار فستق", "كيلو", "بقلاوة بالفستق", False),
    ("ward_alsham", "ورد الشام", "كيلو", "بقلاوة بالفستق", True),
    ("birqa", "بيرقة", "كيلو", "بقلاوة", False),
    ("batoria", "بتورية", "كيلو", "بقلاوة بالفستق", False),
    ("dolma", "ضولما", "كيلو", "بقلاوة بالفستق", False),
    ("lsan_asfour", "لسان العصفور", "كيلو", "بقلاوة", False),
    ("asmaliyya", "عصملية", "كيلو", "بقلاوة", False),
    ("loqmet_box", "علبة لقمة السلطان 500 غرام", "علبة", "علب وتشكيلات", False),
    ("boqj_fistik", "بقج فستق", "كيلو", "بقلاوة بالفستق", False),
    ("maamoul_box", "معمول طرابلسي علبة 500 غرام", "علبة", "معمول", False),
    ("maamoul_mix", "معمول مشكّل", "كيلو", "معمول", True),
    ("moajjanat_box", "معجنات مشكّلة 500 غرام", "علبة", "معمول", False),
    ("siniora_box", "علبة سنيورة 500 غرام", "علبة", "معمول", False),
    ("kaak", "كعك", "كيلو", "معمول", False),
    ("barazek", "برازق", "كيلو", "معمول", False),
    ("maamoul_trabl", "معمول طرابلسي", "كيلو", "معمول", False),
    ("ajwa_box", "عجوة 500 غرام", "علبة", "معمول", False),
    ("siniora", "سنيورة", "كيلو", "معمول", False),
    ("karabij_box", "كرابيج فستق 500 غرام", "علبة", "معمول", False),
    ("kunafa_fistik", "كنافة بالفستق", "صحن", "أطباق وكنافة", True),
    ("halawet_jibn", "حلاوة الجبن بالفستق", "صحن", "أطباق وكنافة", False),
    ("asabe_fistik", "أصابع بالفستق", "كيلو", "بقلاوة بالفستق", False),
]

catalog = []
for slug, name, unit, cat, feat in ITEMS:
    catalog.append({
        "sourceId": slug,
        "name": name,
        "image": f"/assets/photos/salloura/products/{slug}.webp",
        "price": 0,
        "priceOnRequest": True,
        "unit": unit,
        "category": cat,
        "available": True,
        "featured": feat,
        "description": f"{name} من حلويات سلورة — حلويات حلبية فاخرة منذ 1875. السعر والتوفّر عبر واتساب.",
        "imageFit": "cover",
        "options": [],
    })

js = lambda o: json.dumps(o, ensure_ascii=False, indent=2)
out = f"""// Generated for حلويات سلورة (Salloura) — Esenyurt, Istanbul. Prices on request.
const sallouraStore = {js(STORE)};

const sallouraProductCatalog = {js(catalog)};

const sallouraProducts = sallouraProductCatalog.map((product, index) => ({{
  ...product,
  id: 14001 + index,
  storeId: sallouraStore.id
}}));

const sallouraDeliverySettings = {{
  [sallouraStore.id]: {{ mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 130 }}
}};
"""
with open(r"C:\projects\New Dukkanci\salloura-data.js", "w", encoding="utf-8") as f:
    f.write(out)
print("wrote salloura-data.js with", len(catalog), "products")
