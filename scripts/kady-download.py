# -*- coding: utf-8 -*-
import json, os, io, re, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = r"C:\projects\New Dukkanci"
PROD = os.path.join(ROOT, "assets", "photos", "kady", "products")
os.makedirs(PROD, exist_ok=True)
products = json.load(open(os.path.join(ROOT, "scripts", "kady_products.json"), encoding="utf-8"))
# NOTE: no Referer header (CDN 403s on our referer, 200 on none)
UA = {"User-Agent": "Mozilla/5.0"}

def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s or "item"

# unique image url -> slug
urls = {}
used = set()
for p in products:
    if not p.get("image"):
        continue
    if p["image"] in urls:
        continue
    sid = slugify(p["slug"]); base = sid; n = 1
    while sid in used:
        n += 1; sid = f"{base}-{n}"
    used.add(sid); urls[p["image"]] = sid

def fetch(url):
    out = os.path.join(PROD, urls[url] + ".webp")
    if os.path.exists(out):
        return True
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if max(im.size) > 500:
            im.thumbnail((500, 500), Image.LANCZOS)
        im.save(out, "WEBP", quality=84)
        return True
    except Exception as e:
        return str(e)[:50]

res = list(ThreadPoolExecutor(max_workers=20).map(fetch, urls.keys()))
ok = sum(1 for r in res if r is True)
print("downloaded:", ok, "of", len(urls), "| failed:", len(urls) - ok)
imap = {url: f"/assets/photos/kady/products/{slug}.webp" for url, slug in urls.items()}
json.dump(imap, open(os.path.join(ROOT, "scripts", "kady_imagemap.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("imagemap:", len(imap))
