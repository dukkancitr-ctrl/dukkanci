# -*- coding: utf-8 -*-
"""Final build of Ezz Al-Din assets from detected geometry."""
from PIL import Image, ImageDraw, ImageFilter
import os

RAW = r"C:\projects\New Dukkanci\scripts\ezzedine_raw"
OUTP = r"C:\projects\New Dukkanci\assets\photos\ezzedine\products"
OUTB = r"C:\projects\New Dukkanci\assets\photos\ezzedine"
SHEET = r"C:\projects\New Dukkanci\scripts\ezzedine_contact.png"
os.makedirs(OUTP, exist_ok=True)

CREAM = (250, 244, 237)
SIZE = 640
pages = {p: Image.open(os.path.join(RAW, f"page-{p:02d}.jpeg")).convert("RGB") for p in [1,3,4,5,7,8,9]}

def circle_px(page, cx, cy, r):
    im = pages[page]
    pad = 4
    half = r + pad
    crop = im.crop((cx-half, cy-half, cx+half, cy+half)).resize((SIZE, SIZE), Image.LANCZOS)
    out = Image.new("RGB", (SIZE, SIZE), CREAM)
    mask = Image.new("L", (SIZE, SIZE), 0)
    inset = int(SIZE * pad / (2*half)) + 2
    ImageDraw.Draw(mask).ellipse([inset, inset, SIZE-inset, SIZE-inset], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(1.4))
    out.paste(crop, (0, 0), mask)
    return out

def rect_px(page, x0, y0, x1, y1):
    crop = pages[page].crop((x0, y0, x1, y1))
    out = Image.new("RGB", (SIZE, SIZE), CREAM)
    cw, ch = crop.size
    scale = min(SIZE/cw, SIZE/ch)
    nw, nh = int(cw*scale), int(ch*scale)
    crop = crop.resize((nw, nh), Image.LANCZOS)
    out.paste(crop, ((SIZE-nw)//2, (SIZE-nh)//2))
    return out

# slug, builder, name, price, unit, category, featured
C = "circle"; R = "rect"
ITEMS = [
    # page 3
    ("harisa_mikserat", (3,238,350,142),  "هريسة مكسرات", 650, "كيلو", "طلبيات يومية", True),
    ("harisa_fistik",   (3,646,388,141),  "هريسة فستق", 700, "كيلو", "طلبيات يومية", True),
    ("ajamiyya",        (3,0.10,0.42,0.46,0.585), "عجمية", 540, "كيلو", "طلبيات يومية", False),
    ("namoura",         (3,646,812,144),  "نمورة بالقشطة والفستق", 540, "كيلو", "طلبيات يومية", True),
    ("warbat_kashta",   (3,240,1268,139), "وربات قشطة", 540, "كيلو", "طلبيات يومية", False),
    ("taj_almalik",     (3,648,1270,140), "تاج الملك", 90, "قطعة", "طلبيات يومية", False),
    # page 4
    ("halawa_fishta",        (4,238,770,144),  "حلاوة فشطة", 500, "كيلو", "حلويات بالقشطة", False),
    ("halawa_fishta_fistik", (4,646,770,144),  "حلاوة فشطة وفستق", 550, "كيلو", "حلويات بالقشطة", True),
    ("warbat_halabi",        (4,238,1266,142), "وربات حلبي", 380, "كيلو", "حلويات بالقشطة", False),
    ("halawa_halabi",        (4,646,1230,142), "حلاوة حلبي", 285, "كيلو", "حلويات بالقشطة", False),
    # page 5
    ("faysaliyya_fistik", (5,238,236,141), "فيصلية بالفستق", 1300, "كيلو", "حلويات بالفستق", True),
    ("warbat_fistik",     (5,646,234,141), "وربات فستق", 1300, "كيلو", "حلويات بالفستق", True),
    ("ghuraybe_kashta",   (5,238,734,143), "غريبة بالقشطة", 540, "كيلو", "حلويات بالقشطة", False),
    ("madlouka_kashta",   (5,646,736,141), "مدلوقة بالقشطة", 540, "كيلو", "حلويات بالقشطة", False),
    # page 7
    ("crepe_piece",  (7,0.27,0.015,0.80,0.215), "قطعة كريب", 115, "قطعة", "قطع وأطباق", False),
    ("warbat_piece", (7,250,732,142),  "قطعة وربات فستق", 125, "قطعة", "قطع وأطباق", False),
    ("sahn_layali",  (7,670,730,140),  "صحن ليالي", 250, "صحن", "قطع وأطباق", False),
    ("piece_kbir",   (7,252,1240,142), "قطعة كبير", 60, "قطعة", "قطع وأطباق", False),
    ("zabadiyya",    (7,672,1240,142), "زبدية محلبية", 100, "قطعة", "قطع وأطباق", False),
    # page 8
    ("ghuraybe_shamiyya", (8,238,444,141),  "غريبة شامية", 800, "كيلو", "حلويات عربية", True),
    ("barazek",           (8,646,442,144),  "برازق", 800, "كيلو", "حلويات عربية", False),
    ("maamoul_joz",       (8,236,826,141),  "معمول جوز", 1300, "كيلو", "معمول", True),
    ("maamoul_ajwa",      (8,646,828,144),  "معمول عجوة", 800, "كيلو", "معمول", False),
    ("petit_four",        (8,238,1312,142), "بيتيفور", 800, "كيلو", "حلويات عربية", False),
    ("maamoul_fistik",    (8,646,1312,142), "معمول فستق", 1800, "كيلو", "معمول", True),
    # page 9
    ("akl_arabi_awwal", (9,0.152,0.025,0.855,0.279), "تشكيلة عربية أولى", 1900, "كيلو", "تشكيلات", True),
    ("akl_arabi_extra", (9,0.159,0.361,0.855,0.600), "تشكيلة عربية إكسترا", 2000, "كيلو", "تشكيلات", True),
    ("akl_arabi_kaju",  (9,0.160,0.696,0.855,0.905), "تشكيلة عربية كاجو", 1750, "كيلو", "تشكيلات", False),
]

def build(params):
    if len(params) == 4:
        return circle_px(*params)
    page = params[0]; W, H = pages[page].size
    x0, y0, x1, y1 = params[1:]
    return rect_px(page, int(x0*W), int(y0*H), int(x1*W), int(y1*H))

built = []
for slug, params, name, price, unit, cat, feat in ITEMS:
    img = build(params)
    img.save(os.path.join(OUTP, f"{slug}.webp"), "WEBP", quality=89)
    built.append((slug, img, name, price))

# featured nabulsi photo (used for cover only)
nabulsi = rect_px(4, int(0.18*886), int(0.075*1600), int(0.80*886), int(0.32*1600))

# ---- Logo ----
p1 = pages[1]; W1, H1 = p1.size
logo = p1.crop((int(0.30*W1), int(0.035*H1), int(0.67*W1), int(0.305*H1)))
logo.save(os.path.join(OUTB, "logo.png"), "PNG")
badge = p1.crop((int(0.34*W1), int(0.035*H1), int(0.63*W1), int(0.178*H1)))
badge.save(os.path.join(OUTB, "logo-badge.png"), "PNG")

# ---- Cover 1600x600 ----
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (78, 16, 36), (38, 7, 19)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    t = y/CH
    dr.line([(0,y),(CW,y)], fill=(int(top[0]*(1-t)+bot[0]*t), int(top[1]*(1-t)+bot[1]*t), int(top[2]*(1-t)+bot[2]*t)))
# collage left: 3 clean circular product photos
def disc(page, cx, cy, r, size):
    im = pages[page]; half = r+4
    c = im.crop((cx-half, cy-half, cx+half, cy+half)).resize((size, size), Image.LANCZOS)
    m = Image.new("L", (size, size), 0); ImageDraw.Draw(m).ellipse([0,0,size,size], fill=255)
    return c, m
discs = [ (disc(8,646,1312,142,300), (60,150)),
          (disc(5,646,234,141,235),  (300,80)),
          (disc(3,646,812,144,235),  (300,330)) ]
for (im, m), pos in discs:
    s = im.size[0]
    dr.ellipse([pos[0]-5, pos[1]-5, pos[0]+s+5, pos[1]+s+5], fill=(201,162,74))
    cover.paste(im, pos, m)
# logo right
ratio = logo.height/logo.width
lh = 470; lw = int(lh/ratio)
cover.paste(logo.resize((lw, lh), Image.LANCZOS), (CW-lw-110, (CH-lh)//2))
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)

# ---- contact sheet ----
cols=6; rows=(len(built)+cols-1)//cols; cell=210
sheet=Image.new("RGB",(cols*cell, rows*cell), (245,240,235))
sd=ImageDraw.Draw(sheet)
for i,(slug,img,name,price) in enumerate(built):
    r,c=divmod(i,cols)
    sheet.paste(img.resize((cell-16,cell-40),Image.LANCZOS),(c*cell+8,r*cell+8))
    sd.text((c*cell+8,r*cell+cell-30),f"{i+1}.{slug[:14]} {price}",fill=(0,0,0))
sheet.save(SHEET)
print(f"Built {len(built)} products + logo + cover")
