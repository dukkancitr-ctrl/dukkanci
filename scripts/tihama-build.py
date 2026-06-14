# -*- coding: utf-8 -*-
import json, os, io, urllib.request, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw

ROOT = r"C:\projects\New Dukkanci"
OUTB = os.path.join(ROOT, "assets", "photos", "tihama")
PROD = os.path.join(OUTB, "products")
os.makedirs(PROD, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}
products = json.load(open(os.path.join(ROOT, "scripts", "tihama_products.json"), encoding="utf-8"))

def enc(url):
    p = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((p.scheme, p.netloc, urllib.parse.quote(p.path), p.query, ""))

# unique images -> slug
urls = {}
i = 0
for p in products:
    if p["image"] and p["image"] not in urls:
        i += 1
        urls[p["image"]] = f"item-{i:03d}"

def fetch(url):
    slug = urls[url]
    out = os.path.join(PROD, slug + ".webp")
    if os.path.exists(out):
        return True
    try:
        data = urllib.request.urlopen(urllib.request.Request(enc(url), headers=UA), timeout=25).read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        s = min(im.size)
        im = im.crop(((im.width-s)//2, (im.height-s)//2, (im.width-s)//2+s, (im.height-s)//2+s))
        if im.width > 600:
            im = im.resize((600, 600), Image.LANCZOS)
        im.save(out, "WEBP", quality=86)
        return True
    except Exception as e:
        return str(e)[:60]

res = list(ThreadPoolExecutor(max_workers=12).map(fetch, urls.keys()))
print("images ok:", sum(1 for r in res if r is True), "fail:", sum(1 for r in res if r is not True))

# logo
logo_url = "https://menux.app/wp-content/uploads/2025/03/67df7289a727c.png"
ld = urllib.request.urlopen(urllib.request.Request(logo_url, headers=UA), timeout=25).read()
logo = Image.open(io.BytesIO(ld)).convert("RGBA")
logo.save(os.path.join(OUTB, "logo.png"))
print("logo", logo.size)

imap = {url: f"/assets/photos/tihama/products/{slug}.webp" for url, slug in urls.items()}
json.dump(imap, open(os.path.join(ROOT, "scripts", "tihama_imagemap.json"), "w", encoding="utf-8"), ensure_ascii=False)

# cover 1600x600: warm gradient + 3 food discs + logo
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (46, 28, 10), (20, 12, 5)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    tt = y/CH
    dr.line([(0, y), (CW, y)], fill=tuple(int(top[i]*(1-tt)+bot[i]*tt) for i in range(3)))
picks = []
want = ["اللحوم", "الدجاج", "القلايات", "المخبازة", "الاسماك"]
for w in want:
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
    dr.ellipse([x-5, y-5, x+s+5, y+s+5], fill=(214, 158, 70))
    cover.paste(im, (x, y), m)
lw = 520; lh = int(lw*logo.height/logo.width)
if lh > 470: lh = 470; lw = int(lh*logo.width/logo.height)
lr = logo.resize((lw, lh), Image.LANCZOS)
cover.paste(lr, (CW-lw-130, (CH-lh)//2), lr)
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)
print("cover done; picks", len(picks))
