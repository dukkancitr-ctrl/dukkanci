# -*- coding: utf-8 -*-
import json, os, io, re, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = r"C:\projects\New Dukkanci"
OUTP = os.path.join(ROOT, "assets", "photos", "nour", "products")
os.makedirs(OUTP, exist_ok=True)

products = json.load(open(os.path.join(ROOT, "scripts", "nour_products.json"), encoding="utf-8"))

def slug_for(url):
    base = url.split("/")[-1]
    base = re.sub(r"-\d+x\d+(?=\.)", "", base)        # drop -300x300
    base = re.sub(r"\.(jpg|jpeg|png|webp)$", "", base, flags=re.I)
    return re.sub(r"[^a-zA-Z0-9_-]", "", base).lower() or "img"

urls = {}
for p in products:
    urls.setdefault(p["image"], slug_for(p["image"]))

# ensure unique slugs
seen = {}
for url, s in list(urls.items()):
    n = s; i = 1
    while n in seen and seen[n] != url:
        i += 1; n = f"{s}-{i}"
    seen[n] = url; urls[url] = n

UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
def fetch(url):
    slug = urls[url]
    out = os.path.join(OUTP, slug + ".webp")
    if os.path.exists(out):
        return (url, slug, True)
    try:
        req = urllib.request.Request(url, headers=UA)
        data = urllib.request.urlopen(req, timeout=20).read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        if max(im.size) > 500:
            im.thumbnail((500, 500), Image.LANCZOS)
        im.save(out, "WEBP", quality=86)
        return (url, slug, True)
    except Exception as e:
        return (url, slug, str(e))

results = list(ThreadPoolExecutor(max_workers=16).map(fetch, urls.keys()))
ok = [r for r in results if r[2] is True]
fail = [r for r in results if r[2] is not True]
print("downloaded:", len(ok), "failed:", len(fail))
for r in fail[:10]:
    print("  FAIL", r[0].encode("ascii", "replace").decode(), str(r[2])[:80].encode("ascii", "replace").decode())

# url -> local path map
imap = {url: f"/assets/photos/nour/products/{slug}.webp" for url, slug in urls.items()}
json.dump(imap, open(os.path.join(ROOT, "scripts", "nour_imagemap.json"), "w", encoding="utf-8"), ensure_ascii=False)
print("image map written:", len(imap))
