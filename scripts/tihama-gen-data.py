# -*- coding: utf-8 -*-
import json, os, re

ROOT = r"C:\projects\New Dukkanci"
products = json.load(open(os.path.join(ROOT, "scripts", "tihama_products.json"), encoding="utf-8"))
imap = json.load(open(os.path.join(ROOT, "scripts", "tihama_imagemap.json"), encoding="utf-8"))
FALLBACK = "/assets/photos/tihama/logo.png"

STORE = {
    "id": 16,
    "name": "مطعم تهامة اليمن",
    "category": "مطاعم",
    "image": "/assets/photos/tihama/cover.jpg",
    "coverImage": "/assets/photos/tihama/cover.jpg",
    "logoImage": "/assets/photos/tihama/logo.png",
    "logo": "ت",
    "rating": 0,
    "reviews": 0,
    "newStore": True,
    "delivery": 35,
    "minOrder": 150,
    "time": "45 - 75 دقيقة",
    "distance": 23.0,
    "location": {"lat": 41.0171359, "lng": 28.6387955},
    "mapUrl": "https://maps.app.goo.gl/QH4G7gAKGjiiNBzy8",
    "open": True,
    "featured": True,
    "hasOffer": True,
    "offer": "عروض اليوم على العصائر الطبيعية",
    "description": "مطعم تهامة اليمن — مطبخ يمني أصيل: مندي ومدفون اللحم والدجاج، قلايات ومشاوي، أطباق جانبية ومقبلات وسلطات، أسماك ومخبازة طازجة، وعصائر طبيعية. تشكيلة ذبائح وولائم للمناسبات.",
    "address": "إسنيورت، إسطنبول، تركيا",
    "phone": "+90 531 866 02 20",
    "whatsapp": "+90 531 866 02 20",
    "email": "",
    "website": "https://menux.app/tihama/",
    "sourceUrl": "https://menux.app/tihama/",
    "hours": "يومياً — يرجى التأكيد عبر الاتصال",
    "areas": ["إسنيورت", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام",
    "subscription": "احترافي",
    "orderCount": 0,
    "officialStore": True,
}

def slugify(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")

catalog, used = [], set()
for idx, p in enumerate(products):
    img = imap.get(p["image"], "") or FALLBACK
    fpath = os.path.join(ROOT, img.lstrip("/").replace("/", os.sep))
    if not os.path.exists(fpath):
        img = FALLBACK
    sid = slugify(p["name"]) or f"item-{idx}"
    base = sid; n = 1
    while sid in used:
        n += 1; sid = f"{base}-{n}"
    used.add(sid)
    item = {
        "sourceId": sid,
        "name": p["name"],
        "image": img,
        "price": p["price"],
        "unit": "",
        "category": p["category"],
        "available": True,
        "featured": idx < 8,
        "description": p.get("description") or f"{p['name']} من مطعم تهامة اليمن.",
        "imageFit": "cover",
        "options": [],
    }
    if p.get("oldPrice"):
        item["oldPrice"] = p["oldPrice"]
    catalog.append(item)

js = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
out = f"""// Generated for مطعم تهامة اليمن (Tihama) — Esenyurt, Istanbul. Source: menux.app/tihama
const tihamaStore = {js(STORE)};

const tihamaProductCatalog = {js(catalog)};

const tihamaProducts = tihamaProductCatalog.map((product, index) => ({{
  ...product,
  id: 16001 + index,
  storeId: tihamaStore.id
}}));

const tihamaDeliverySettings = {{
  [tihamaStore.id]: {{ mode: "distance", fixedFee: 35, ratePerKm: 15, prepMinutes: 35, maxRoundTripKm: 120 }}
}};
"""
open(os.path.join(ROOT, "tihama-data.js"), "w", encoding="utf-8").write(out)
print("wrote tihama-data.js with", len(catalog), "products,", len(set(p['category'] for p in products)), "categories")
