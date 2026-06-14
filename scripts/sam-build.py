# -*- coding: utf-8 -*-
import json, os, io, urllib.request
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw

ROOT = r"C:\projects\New Dukkanci"
OUTB = os.path.join(ROOT, "assets", "photos", "sam")
PROD = os.path.join(OUTB, "products")
os.makedirs(PROD, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}
products = json.load(open(os.path.join(ROOT, "scripts", "sam_products.json"), encoding="utf-8"))

urls = {}
i = 0
for p in products:
    if p["image"] and p["image"] not in urls:
        i += 1
        urls[p["image"]] = f"item-{i:03d}"

def fetch(url):
    out = os.path.join(PROD, urls[url] + ".webp")
    if os.path.exists(out):
        return True
    try:
        data = urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        s = min(im.size)
        im = im.crop(((im.width-s)//2, (im.height-s)//2, (im.width-s)//2+s, (im.height-s)//2+s))
        if im.width > 640:
            im = im.resize((640, 640), Image.LANCZOS)
        im.save(out, "WEBP", quality=86)
        return True
    except Exception as ex:
        return str(ex)[:70]

res = list(ThreadPoolExecutor(max_workers=12).map(fetch, urls.keys()))
print("images ok:", sum(1 for r in res if r is True), "fail:", [r for r in res if r is not True][:5])

# logo
logo_url = "https://e-store.biz/storage/uploads/stores/ff65ef33757ab4ed569d8e53fd164dfe.png"
ld = urllib.request.urlopen(urllib.request.Request(logo_url, headers=UA), timeout=30).read()
logo = Image.open(io.BytesIO(ld)).convert("RGBA")
logo.save(os.path.join(OUTB, "logo.png"))
print("logo", logo.size)

imap = {url: f"/assets/photos/sam/products/{slug}.webp" for url, slug in urls.items()}
json.dump(imap, open(os.path.join(ROOT, "scripts", "sam_imagemap.json"), "w", encoding="utf-8"), ensure_ascii=False)

# cover
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (38, 28, 16), (16, 11, 6)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    tt = y / CH
    dr.line([(0, y), (CW, y)], fill=tuple(int(top[k]*(1-tt)+bot[k]*tt) for k in range(3)))
picks = []
for w in ["شاورما", "أطباق شرقية", "حلويات وكاسات", "عصائر ومشروبات"]:
    for p in products:
        if p["category"] == w and p["image"]:
            f = os.path.join(PROD, urls[p["image"]] + ".webp")
            if os.path.exists(f):
                picks.append(f); break
    if len(picks) >= 3:
        break
for f, (x, y, s) in zip(picks, [(70, 150, 300), (310, 90, 235), (310, 330, 235)]):
    im = Image.open(f).convert("RGB").resize((s, s), Image.LANCZOS)
    m = Image.new("L", (s, s), 0); ImageDraw.Draw(m).ellipse([0, 0, s, s], fill=255)
    dr.ellipse([x-5, y-5, x+s+5, y+s+5], fill=(210, 156, 70))
    cover.paste(im, (x, y), m)
lw = 470; lh = int(lw*logo.height/logo.width)
if lh > 470: lh = 470; lw = int(lh*logo.width/logo.height)
lr = logo.resize((lw, lh), Image.LANCZOS)
cover.paste(lr, (CW-lw-160, (CH-lh)//2), lr)
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)
print("cover done; picks", len(picks))
