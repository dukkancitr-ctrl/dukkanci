# -*- coding: utf-8 -*-
import urllib.request, io, os, json
from PIL import Image, ImageDraw

ROOT = r"C:\projects\New Dukkanci"
OUTB = os.path.join(ROOT, "assets", "photos", "nour")
PROD = os.path.join(OUTB, "products")
os.makedirs(OUTB, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}

# logo
logo_url = "https://xr.nouralsham.com/php_content/uploads/2020/12/logo_new2-1.png"
data = urllib.request.urlopen(urllib.request.Request(logo_url, headers=UA), timeout=20).read()
logo = Image.open(io.BytesIO(data)).convert("RGBA")
logo.save(os.path.join(OUTB, "logo.png"))
print("logo", logo.size)

# cover 1600x600: dark warm gradient + 3 food discs + logo
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (60, 20, 8), (24, 8, 4)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    t = y/CH
    dr.line([(0, y), (CW, y)], fill=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)))

imap = json.load(open(os.path.join(ROOT, "scripts", "nour_imagemap.json"), encoding="utf-8"))
products = json.load(open(os.path.join(ROOT, "scripts", "nour_products.json"), encoding="utf-8"))
# pick 3 appetizing items from distinct categories
picks, cats = [], set()
want = ["شاورما", "مشاوي", "بيتزا", "دجاج"]
for w in want:
    for p in products:
        if w in p["category"] and p["category"] not in cats:
            path = imap.get(p["image"], "")
            f = os.path.join(ROOT, path.lstrip("/").replace("/", os.sep))
            if os.path.exists(f):
                picks.append(f); cats.add(p["category"]); break
    if len(picks) >= 3: break

positions = [(70, 150, 300), (310, 90, 235), (310, 330, 235)]
for f, (x, y, s) in zip(picks, positions):
    im = Image.open(f).convert("RGB")
    sq = min(im.size); im = im.crop(((im.width-sq)//2, (im.height-sq)//2, (im.width-sq)//2+sq, (im.height-sq)//2+sq)).resize((s, s), Image.LANCZOS)
    m = Image.new("L", (s, s), 0); ImageDraw.Draw(m).ellipse([0, 0, s, s], fill=255)
    dr.ellipse([x-5, y-5, x+s+5, y+s+5], fill=(230, 130, 30))
    cover.paste(im, (x, y), m)

# logo on right (white logo on dark bg)
lw = 560; lh = int(lw*logo.height/logo.width)
if lh > 480:
    lh = 480; lw = int(lh*logo.width/logo.height)
cover.paste(logo.resize((lw, lh), Image.LANCZOS), (CW-lw-120, (CH-lh)//2), logo.resize((lw, lh), Image.LANCZOS))
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)
print("cover done, picks:", len(picks))
