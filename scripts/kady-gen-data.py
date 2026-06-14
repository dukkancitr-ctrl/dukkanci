# -*- coding: utf-8 -*-
import json, os, re

ROOT = r"C:\projects\New Dukkanci"
products = json.load(open(os.path.join(ROOT, "scripts", "kady_products.json"), encoding="utf-8"))
imap = json.load(open(os.path.join(ROOT, "scripts", "kady_imagemap.json"), encoding="utf-8"))

STORE = {
    "id": 19, "name": "قاضي ماركت باشاك شهير", "category": "سوبر ماركت",
    "image": "/assets/photos/kady/cover.jpg", "coverImage": "/assets/photos/kady/cover.jpg",
    "logoImage": "/assets/photos/kady/logo.png", "logo": "ق",
    "rating": 0, "reviews": 0, "newStore": True, "delivery": 30, "minOrder": 200,
    "time": "45 - 90 دقيقة", "distance": 18.0,
    "location": {"lat": 41.1010, "lng": 28.7930},
    "mapUrl": "https://www.google.com/maps/search/?api=1&query=Kadi+Market+Basaksehir+Kayasehir+Istanbul",
    "open": True, "featured": True, "hasOffer": True, "offer": "عروض قاضي ماركت المتجددة",
    "description": "قاضي ماركت باشاك شهير — سوبر ماركت متكامل: بقالة وتسالي ومشروبات، فطور وأجبان وألبان، بقوليات ومكرونة، سمن وزيوت، بهارات ومكسرات، خضار وفواكه ولحوم ومجمدات، إضافة إلى العناية الشخصية والمنظفات والأدوات المنزلية.",
    "address": "كاياشهير / باشاك شهير، إسطنبول، تركيا",
    "phone": "+90 552 780 99 99", "whatsapp": "+90 552 780 99 99",
    "email": "", "website": "https://kayasehir.kadimarket.net/", "sourceUrl": "https://kayasehir.kadimarket.net/ar/kady-markt-bashak-shhyr-18/",
    "hours": "يومياً — يرجى التأكيد عبر الاتصال",
    "areas": ["كاياشهير", "باشاك شهير", "إسطنبول", "مناطق التوصيل حسب المسافة"],
    "fulfillment": "توصيل واستلام", "subscription": "احترافي", "orderCount": 0, "officialStore": True,
}

def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s or "item"

catalog, used = [], set()
for p in products:
    local = imap.get(p.get("image", ""))
    if not local or not p.get("price"):
        continue
    fpath = os.path.join(ROOT, local.lstrip("/").replace("/", os.sep))
    if not os.path.exists(fpath):
        continue
    p = {**p, "image": local}
    sid = slugify(p["slug"]); base = sid; n = 1
    while sid in used:
        n += 1; sid = f"{base}-{n}"
    used.add(sid)
    item = {
        "sourceId": sid, "name": p["title"], "image": p["image"], "price": int(round(p["price"])),
        "unit": "", "category": p["category"], "available": True, "featured": False,
        "description": f"{p['title']} — من قاضي ماركت.", "imageFit": "cover", "options": [],
    }
    if p.get("oldPrice") and p["oldPrice"] > p["price"]:
        item["oldPrice"] = int(round(p["oldPrice"]))
    catalog.append(item)

# mark a few featured per first categories
for it in catalog[:8]:
    it["featured"] = True

js = lambda o: json.dumps(o, ensure_ascii=False, indent=1)
out = f"""// Generated for قاضي ماركت باشاك شهير (Kadi Market) — Basaksehir, Istanbul. Source: kadimarket.net (images via store CDN)
const kadyStore = {js(STORE)};

const kadyProductCatalog = {js(catalog)};

const kadyProducts = kadyProductCatalog.map((product, index) => ({{
  ...product,
  id: 19001 + index,
  storeId: kadyStore.id
}}));

const kadyDeliverySettings = {{
  [kadyStore.id]: {{ mode: "distance", fixedFee: 30, ratePerKm: 12, prepMinutes: 40, maxRoundTripKm: 140 }}
}};
"""
open(os.path.join(ROOT, "kady-data.js"), "w", encoding="utf-8").write(out)
print("wrote kady-data.js:", len(catalog), "products,", len(set(c['category'] for c in catalog)), "categories")
