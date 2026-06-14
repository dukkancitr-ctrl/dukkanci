# -*- coding: utf-8 -*-
import json, os, re

ROOT = r"C:\projects\New Dukkanci"
products = json.load(open(os.path.join(ROOT, "scripts", "afgan_products.json"), encoding="utf-8"))
imap = json.load(open(os.path.join(ROOT, "scripts", "afgan_imagemap.json"), encoding="utf-8"))
FALLBACK = "/assets/photos/afgan/logo.png"

CATMAP = {
    "Classics": "الأطباق الكلاسيكية",
    "Pilav Rice": "البرياني والأرز",
    "Barbecue": "المشاوي",
    "Platter": "الصحون",
    "Stew": "اليخنات",
    "Appetizer & Dessert": "المقبلات والحلويات",
    "Beverage": "المشروبات",
}

STORE = {
    "id": 17,
    "name": "مطعم أفغان كباب",
    "category": "مطاعم",
    "image": "/assets/photos/afgan/cover.jpg",
    "coverImage": "/assets/photos/afgan/cover.jpg",
    "logoImage": "/assets/photos/afgan/logo.png",
    "logo": "أ",
    "rating": 0,
    "reviews": 0,
    "newStore": True,
    "delivery": 35,
    "minOrder": 200,
    "time": "45 - 75 دقيقة",
    "distance": 24.0,
    "location": {"lat": 41.0040, "lng": 28.6300},
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Afgan+Kebap+Restaurant+Beylikduzu+Esenyurt+Istanbul",
    "open": True,
    "featured": True,
    "hasOffer": False,
    "description": "مطعم أفغان كباب — أول مطبخ أفغاني في إسنيورت/بيليك دوزو بإسطنبول: برياني (بيلاف) باللحم، كباب التكة الأفغاني، المومو (دامبلنغ)، المشاوي والصحون واليخنات والمقبلات. أسماء الأطباق كما في القائمة الرسمية للمطعم.",
    "address": "حي الجمهورية، شارع ناظم حكمت، 2066 Sk. 17/A، بيليك دوزو OSB / إسنيورت، إسطنبول",
    "phone": "+90 555 080 46 40",
    "whatsapp": "+90 555 080 46 40",
    "email": "",
    "website": "https://www.afgankebap.com/",
    "sourceUrl": "https://www.afgankebap.com/menu",
    "hours": "يومياً — يرجى التأكيد عبر الاتصال",
    "areas": ["إسنيورت", "بيليك دوزو", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام",
    "subscription": "احترافي",
    "orderCount": 0,
    "officialStore": True,
}

def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s or "item"

catalog, used = [], set()
for idx, p in enumerate(products):
    img = imap.get(p["image"], "") or FALLBACK
    fpath = os.path.join(ROOT, img.lstrip("/").replace("/", os.sep))
    if not os.path.exists(fpath):
        img = FALLBACK
    sid = slugify(p["name"]); base = sid; n = 1
    while sid in used:
        n += 1; sid = f"{base}-{n}"
    used.add(sid)
    catalog.append({
        "sourceId": sid,
        "name": p["name"],
        "image": img,
        "price": p["price"],
        "unit": "",
        "category": CATMAP.get(p["category"], p["category"]),
        "available": True,
        "featured": bool(p.get("featured")),
        "description": p.get("description") or f"{p['name']} من مطعم أفغان كباب.",
        "imageFit": "cover",
        "options": [],
    })

js = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
out = f"""// Generated for مطعم أفغان كباب (Afgan Kebap) — Esenyurt/Beylikduzu, Istanbul. Source: afgankebap.com
const afganStore = {js(STORE)};

const afganProductCatalog = {js(catalog)};

const afganProducts = afganProductCatalog.map((product, index) => ({{
  ...product,
  id: 17001 + index,
  storeId: afganStore.id
}}));

const afganDeliverySettings = {{
  [afganStore.id]: {{ mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }}
}};
"""
open(os.path.join(ROOT, "afgan-data.js"), "w", encoding="utf-8").write(out)
print("wrote afgan-data.js:", len(catalog), "products,", len(set(c['category'] for c in catalog)), "categories")
