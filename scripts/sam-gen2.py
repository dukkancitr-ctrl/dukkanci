# -*- coding: utf-8 -*-
import json, os, re

ROOT = r"C:\projects\New Dukkanci"
products = json.load(open(os.path.join(ROOT, "scripts", "sam_products.json"), encoding="utf-8"))

STORE = {
    "id": 18, "name": "مطعم أيام شامية", "category": "مطاعم",
    "image": "/assets/photos/sam/cover.jpg", "coverImage": "/assets/photos/sam/cover.jpg",
    "logoImage": "/assets/photos/sam/logo.png", "logo": "ش",
    "rating": 0, "reviews": 0, "newStore": True, "delivery": 35, "minOrder": 150,
    "time": "40 - 70 دقيقة", "distance": 22.0,
    "location": {"lat": 41.035936, "lng": 28.678008},
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=41.035935792509,28.678007796407",
    "open": True, "featured": True, "hasOffer": False,
    "description": "مطعم أيام شامية — نكهات شامية أصيلة: الشاورما، الفروج والمشاوي والوجبات الغربية، الأطباق الشرقية والمناسف، الكبة والأسماك والمعجنات، إضافة إلى الوافل والكريب وسلطات الفواكه والعصائر والكوكتيلات الطازجة.",
    "address": "إسنيورت، إسطنبول، تركيا", "phone": "+90 505 173 58 70", "whatsapp": "+90 505 173 58 70",
    "email": "", "website": "https://samgunleri.com/", "sourceUrl": "https://samgunleri.com/",
    "hours": "يومياً — يرجى التأكيد عبر الاتصال",
    "areas": ["إسنيورت", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام", "subscription": "احترافي", "orderCount": 0, "officialStore": True,
}

def slugify(s): return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "item"

catalog, used = [], set()
for idx, p in enumerate(products):
    fpath = os.path.join(ROOT, p["image"].lstrip("/").replace("/", os.sep))
    if not os.path.exists(fpath):
        continue
    sid = slugify(p["name"]); base = sid; n = 1
    while sid in used:
        n += 1; sid = f"{base}-{n}"
    used.add(sid)
    catalog.append({
        "sourceId": sid, "name": p["name"], "image": p["image"], "price": p["price"], "unit": "",
        "category": p["category"], "available": True, "featured": bool(p.get("featured")) or idx < 6,
        "description": f"{p['name']} من مطعم أيام شامية، يُحضَّر طازجاً.", "imageFit": "cover", "options": [],
    })

js = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
out = f"""// Generated for مطعم أيام شامية (Sam Gunleri) — Esenyurt, Istanbul. Full menu via API (image-bearing items only)
const samStore = {js(STORE)};

const samProductCatalog = {js(catalog)};

const samProducts = samProductCatalog.map((product, index) => ({{
  ...product,
  id: 18001 + index,
  storeId: samStore.id
}}));

const samDeliverySettings = {{
  [samStore.id]: {{ mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }}
}};
"""
open(os.path.join(ROOT, "sam-data.js"), "w", encoding="utf-8").write(out)
print("wrote sam-data.js:", len(catalog), "products")
