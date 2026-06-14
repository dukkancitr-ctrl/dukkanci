# -*- coding: utf-8 -*-
import json, os, re

ROOT = r"C:\projects\New Dukkanci"
products = json.load(open(os.path.join(ROOT, "scripts", "nour_products.json"), encoding="utf-8"))
imap = json.load(open(os.path.join(ROOT, "scripts", "nour_imagemap.json"), encoding="utf-8"))
PRODDIR = os.path.join(ROOT, "assets", "photos", "nour", "products")

STORE = {
    "id": 15,
    "name": "مطعم نور الشام",
    "category": "مطاعم",
    "image": "/assets/photos/nour/cover.jpg",
    "coverImage": "/assets/photos/nour/cover.jpg",
    "logoImage": "/assets/photos/nour/logo.png",
    "logo": "ن",
    "rating": 0,
    "reviews": 0,
    "newStore": True,
    "delivery": 35,
    "minOrder": 150,
    "time": "45 - 75 دقيقة",
    "distance": 20.0,
    "location": {"lat": 41.0345, "lng": 28.6720},
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Nour+Alsham+Restaurant+Talatpasa+Esenyurt+Istanbul",
    "open": True,
    "featured": True,
    "hasOffer": False,
    "description": "مطعم نور الشام — مطبخ شامي وشرقي أصيل: شاورما ومشاوي دجاج ولحم، مندي وكبة وشاميات، معجنات وبيتزا وباستا وسمك، مقبلات وسلطات وعصائر. طازج ويصل إلى بابك.",
    "address": "طلعت باشا، إسنيورت، إسطنبول، تركيا",
    "phone": "+90 534 311 02 12",
    "whatsapp": "+90 534 311 02 12",
    "email": "nuralsamlokanta@gmail.com",
    "website": "https://nouralsham.com",
    "sourceUrl": "https://xr.nouralsham.com/ar/",
    "hours": "يومياً — يرجى التأكيد عبر الاتصال",
    "areas": ["إسنيورت", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام",
    "subscription": "احترافي",
    "orderCount": 0,
    "officialStore": True,
}

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

catalog = []
used_ids = set()
for idx, p in enumerate(products):
    img = imap.get(p["image"], "")
    fpath = os.path.join(ROOT, img.lstrip("/").replace("/", os.sep))
    if not img or not os.path.exists(fpath):
        img = "/assets/photos/nour/logo.png"  # fallback (rare)
    sid = slugify(p["name"]) or "item"
    base = sid; n = 1
    while sid in used_ids:
        n += 1; sid = f"{base}-{n}"
    used_ids.add(sid)
    item = {
        "sourceId": sid,
        "name": p["name"],
        "image": img,
        "price": p["price"],
        "unit": "",
        "category": p["category"],
        "available": True,
        "featured": idx < 8,
        "description": f"{p['name']} من مطعم نور الشام، يُحضَّر طازجاً بمكوّنات مختارة.",
        "imageFit": "cover",
        "options": [],
    }
    if not p["price"]:
        item["priceOnRequest"] = True
        item["price"] = 0
    catalog.append(item)

js = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
out = f"""// Generated for مطعم نور الشام (Nour Alsham) — Esenyurt, Istanbul. Source: nouralsham.com
const nourStore = {js(STORE)};

const nourProductCatalog = {js(catalog)};

const nourProducts = nourProductCatalog.map((product, index) => ({{
  ...product,
  id: 15001 + index,
  storeId: nourStore.id
}}));

const nourDeliverySettings = {{
  [nourStore.id]: {{ mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }}
}};
"""
open(os.path.join(ROOT, "nour-data.js"), "w", encoding="utf-8").write(out)
print("wrote nour-data.js with", len(catalog), "products,", len(set(p['category'] for p in products)), "categories")
