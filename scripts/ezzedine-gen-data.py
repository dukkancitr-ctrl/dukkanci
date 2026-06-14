# -*- coding: utf-8 -*-
import json

STORE = {
    "id": 13,
    "name": "حلويات عز الدين",
    "category": "حلويات",
    "image": "/assets/photos/ezzedine/cover.jpg",
    "coverImage": "/assets/photos/ezzedine/cover.jpg",
    "logoImage": "/assets/photos/ezzedine/logo.png",
    "logo": "ع",
    "rating": 0,
    "reviews": 0,
    "newStore": True,
    "delivery": 30,
    "minOrder": 250,
    "time": "40 - 60 دقيقة",
    "distance": 22.5,
    "location": {"lat": 41.0293, "lng": 28.6760},
    "mapUrl": "https://maps.app.goo.gl/aYg1Qc3ZVrCxqboy7",
    "open": True,
    "featured": True,
    "hasOffer": False,
    "description": "حلويات عز الدين متخصّصة بالحلويات العربية الفاخرة: البقلاوة والوربات بالفستق والقشطة، المعمول والغريبة والبرازق، إضافة إلى الكاتو والتشكيلات العربية، بنكهة عربية أصيلة وجودة عالية.",
    "address": "إنجيرتبه، شارع باغلار تشيشمه رقم 1، إسنيورت، إسطنبول",
    "phone": "+90 555 097 77 93",
    "whatsapp": "+90 555 097 77 93",
    "email": "",
    "website": "",
    "sourceUrl": "https://maps.app.goo.gl/aYg1Qc3ZVrCxqboy7",
    "hours": "يرجى تأكيد أوقات العمل عبر واتساب",
    "areas": ["إسنيورت", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام",
    "subscription": "احترافي",
    "orderCount": 0,
    "officialStore": True,
}

# slug, name, price, unit, category, featured
ITEMS = [
    ("harisa_mikserat", "هريسة مكسرات", 650, "كيلو", "طلبيات يومية", True),
    ("harisa_fistik", "هريسة فستق", 700, "كيلو", "طلبيات يومية", True),
    ("ajamiyya", "عجمية", 540, "كيلو", "طلبيات يومية", False),
    ("namoura", "نمورة بالقشطة والفستق", 540, "كيلو", "طلبيات يومية", True),
    ("warbat_kashta", "وربات قشطة", 540, "كيلو", "طلبيات يومية", False),
    ("taj_almalik", "تاج الملك", 90, "قطعة", "طلبيات يومية", False),
    ("halawa_fishta", "حلاوة فشطة", 500, "كيلو", "حلويات بالقشطة", False),
    ("halawa_fishta_fistik", "حلاوة فشطة وفستق", 550, "كيلو", "حلويات بالقشطة", True),
    ("warbat_halabi", "وربات حلبي", 380, "كيلو", "حلويات بالقشطة", False),
    ("halawa_halabi", "حلاوة حلبي", 285, "كيلو", "حلويات بالقشطة", False),
    ("faysaliyya_fistik", "فيصلية بالفستق", 1300, "كيلو", "حلويات بالفستق", True),
    ("warbat_fistik", "وربات فستق", 1300, "كيلو", "حلويات بالفستق", True),
    ("ghuraybe_kashta", "غريبة بالقشطة", 540, "كيلو", "حلويات بالقشطة", False),
    ("madlouka_kashta", "مدلوقة بالقشطة", 540, "كيلو", "حلويات بالقشطة", False),
    ("crepe_piece", "قطعة كريب", 115, "قطعة", "قطع وأطباق", False),
    ("warbat_piece", "قطعة وربات فستق", 125, "قطعة", "قطع وأطباق", False),
    ("sahn_layali", "صحن ليالي لبنان", 250, "صحن", "قطع وأطباق", False),
    ("piece_kbir", "قطعة كبير", 60, "قطعة", "قطع وأطباق", False),
    ("zabadiyya", "زبدية محلبية", 100, "قطعة", "قطع وأطباق", False),
    ("ghuraybe_shamiyya", "غريبة شامية", 800, "كيلو", "حلويات عربية", True),
    ("barazek", "برازق", 800, "كيلو", "حلويات عربية", False),
    ("maamoul_joz", "معمول جوز", 1300, "كيلو", "معمول", True),
    ("maamoul_ajwa", "معمول عجوة", 800, "كيلو", "معمول", False),
    ("petit_four", "بيتيفور", 800, "كيلو", "حلويات عربية", False),
    ("maamoul_fistik", "معمول فستق", 1800, "كيلو", "معمول", True),
    ("akl_arabi_awwal", "تشكيلة عربية أولى", 1900, "كيلو", "تشكيلات", True),
    ("akl_arabi_extra", "تشكيلة عربية إكسترا", 2000, "كيلو", "تشكيلات", True),
    ("akl_arabi_kaju", "تشكيلة عربية كاجو", 1750, "كيلو", "تشكيلات", False),
]

catalog = []
for slug, name, price, unit, cat, feat in ITEMS:
    catalog.append({
        "sourceId": slug,
        "name": name,
        "image": f"/assets/photos/ezzedine/products/{slug}.webp",
        "price": price,
        "unit": unit,
        "category": cat,
        "available": True,
        "featured": feat,
        "description": f"{name} من حلويات عز الدين، تُحضَّر طازجة بمكوّنات مختارة وبنكهة عربية أصيلة.",
        "imageFit": "cover",
        "options": [],
    })

def js(obj):
    return json.dumps(obj, ensure_ascii=False, indent=2)

out = f"""// Generated for حلويات عز الدين (Izz Al-Din Tatlici) — Esenyurt, Istanbul.
const ezzedineStore = {js(STORE)};

const ezzedineProductCatalog = {js(catalog)};

const ezzedineProducts = ezzedineProductCatalog.map((product, index) => ({{
  ...product,
  id: 13001 + index,
  storeId: ezzedineStore.id
}}));

const ezzedineDeliverySettings = {{
  [ezzedineStore.id]: {{ mode: "distance", fixedFee: 30, ratePerKm: 15, prepMinutes: 30, maxRoundTripKm: 130 }}
}};
"""

with open(r"C:\projects\New Dukkanci\ezzedine-data.js", "w", encoding="utf-8") as f:
    f.write(out)
print("wrote ezzedine-data.js with", len(catalog), "products")
