# -*- coding: utf-8 -*-
import json, os, io, urllib.request
from PIL import Image, ImageDraw

ROOT = r"C:\projects\New Dukkanci"
OUTB = os.path.join(ROOT, "assets", "photos", "kady")
os.makedirs(OUTB, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0"}
def dl(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read()

# logo
LOGO = "https://assets.trybany.com/uploads/entities/11614/resized/zQ3AQRy6AwUw8PTVcbo9C38cAgoQuT-metaTE9HT19LQURJX0ZBQ0VCT09LLTEgU21hbGwuanBlZw==--512.png"
logo = Image.open(io.BytesIO(dl(LOGO))).convert("RGBA")
logo.save(os.path.join(OUTB, "logo.png"))
print("logo", logo.size)

# cover: fresh green gradient + 3 product discs + logo
products = json.load(open(os.path.join(ROOT, "scripts", "kady_products.json"), encoding="utf-8"))
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (26, 122, 58), (10, 64, 33)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    tt = y / CH
    dr.line([(0, y), (CW, y)], fill=tuple(int(top[k]*(1-tt)+bot[k]*tt) for k in range(3)))
# pick 3 product images from varied categories
picks, cats = [], set()
for p in products:
    if p["category"] not in cats and p.get("image"):
        try:
            im = Image.open(io.BytesIO(dl(p["image"]))).convert("RGB")
            picks.append(im); cats.add(p["category"])
        except Exception:
            continue
    if len(picks) >= 3:
        break
for im, (x, y, s) in zip(picks, [(70, 150, 300), (310, 90, 235), (310, 330, 235)]):
    sq = min(im.size); im = im.crop(((im.width-sq)//2, (im.height-sq)//2, (im.width-sq)//2+sq, (im.height-sq)//2+sq)).resize((s, s), Image.LANCZOS)
    m = Image.new("L", (s, s), 0); ImageDraw.Draw(m).ellipse([0, 0, s, s], fill=255)
    dr.ellipse([x-6, y-6, x+s+6, y+s+6], fill=(255, 255, 255))
    cover.paste(im, (x, y), m)
# logo on a white rounded card (logo may have transparency)
lw = 430; lh = int(lw*logo.height/logo.width)
if lh > 430: lh = 430; lw = int(lh*logo.width/logo.height)
card = Image.new("RGB", (lw+70, lh+70), (255, 255, 255))
lr = logo.resize((lw, lh), Image.LANCZOS)
card.paste(lr, (35, 35), lr)
cover.paste(card, (CW - card.width - 130, (CH - card.height)//2))
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)
print("cover done; picks", len(picks))
