# -*- coding: utf-8 -*-
"""Build Salloura store assets from the curated catalog pages."""
import os
from PIL import Image, ImageDraw

RAW = r"C:\projects\New Dukkanci\scripts\store3_raw"
OUTP = r"C:\projects\New Dukkanci\assets\photos\salloura\products"
OUTB = r"C:\projects\New Dukkanci\assets\photos\salloura"
SHEET = r"C:\projects\New Dukkanci\scripts\salloura_contact.png"
os.makedirs(OUTP, exist_ok=True)
CREAM = (250, 246, 239)
SIZE = 640

def load(pg):
    for ext in ("jpeg", "jpg", "png"):
        p = os.path.join(RAW, f"p-{pg:03d}.{ext}")
        if os.path.exists(p):
            return Image.open(p).convert("RGB")
    raise FileNotFoundError(pg)

def square(pg):
    im = load(pg); w, h = im.size
    if abs(w - h) / max(w, h) < 0.12:
        s = min(w, h)
        im = im.crop(((w-s)//2, (h-s)//2, (w-s)//2+s, (h-s)//2+s)).resize((SIZE, SIZE), Image.LANCZOS)
        return im
    out = Image.new("RGB", (SIZE, SIZE), CREAM)
    scale = min(SIZE/w, SIZE/h); nw, nh = int(w*scale), int(h*scale)
    out.paste(im.resize((nw, nh), Image.LANCZOS), ((SIZE-nw)//2, (SIZE-nh)//2))
    return out

# slug, page, name, unit, category, featured
ITEMS = [
    ("mishkal_1200", 1, "تشكيلة عربية مشكّلة 1200 غرام", "علبة", "علب وتشكيلات", True),
    ("mishkal_650",  2, "حلويات عربية مشكّلة 650 غرام", "علبة", "علب وتشكيلات", True),
    ("mishkal_450",  3, "حلويات عربية مشكّلة 450 غرام", "علبة", "علب وتشكيلات", False),
    ("mishkal_1000", 4, "حلويات عربية مشكّلة 1000 غرام", "علبة", "علب وتشكيلات", True),
    ("kol_w_shkor",  7, "كول وشكور", "كيلو", "بقلاوة بالفستق", True),
    ("joja_mikserat",8, "جوجة مكسرات", "كيلو", "بقلاوة", False),
    ("loqmet_sultan",9, "لقمة السلطان", "كيلو", "بقلاوة بالفستق", True),
    ("asabe_kaju",   10, "أصابع كاجو", "كيلو", "بقلاوة بالكاجو", False),
    ("mabroumeh",    11, "مبرومة", "كيلو", "بقلاوة بالفستق", True),
    ("harisa_loz",   12, "هريسة لوز", "كيلو", "هريسة", False),
    ("harisa_fistik",13, "هريسة فستق", "كيلو", "هريسة", True),
    ("baklava_fistik",14,"بقلاوة فستق", "كيلو", "بقلاوة بالفستق", True),
    ("joz_kaju",     15, "جوز كاجو", "كيلو", "بقلاوة بالكاجو", False),
    ("siwar_fistik", 16, "سوار فستق", "كيلو", "بقلاوة بالفستق", False),
    ("ward_alsham",  17, "ورد الشام", "كيلو", "بقلاوة بالفستق", True),
    ("birqa",        18, "بيرقة", "كيلو", "بقلاوة", False),
    ("batoria",      19, "بتورية", "كيلو", "بقلاوة بالفستق", False),
    ("dolma",        20, "ضولما", "كيلو", "بقلاوة بالفستق", False),
    ("lsan_asfour",  21, "لسان العصفور", "كيلو", "بقلاوة", False),
    ("asmaliyya",    22, "عصملية", "كيلو", "بقلاوة", False),
    ("loqmet_box",   23, "علبة لقمة السلطان 500 غرام", "علبة", "علب وتشكيلات", False),
    ("boqj_fistik",  24, "بقج فستق", "كيلو", "بقلاوة بالفستق", False),
    ("maamoul_box",  25, "معمول طرابلسي علبة 500 غرام", "علبة", "معمول", False),
    ("maamoul_mix",  26, "معمول مشكّل", "كيلو", "معمول", True),
    ("moajjanat_box",27, "معجنات مشكّلة 500 غرام", "علبة", "معمول", False),
    ("siniora_box",  28, "علبة سنيورة 500 غرام", "علبة", "معمول", False),
    ("kaak",         29, "كعك", "كيلو", "معمول", False),
    ("barazek",      30, "برازق", "كيلو", "معمول", False),
    ("maamoul_trabl",31, "معمول طرابلسي", "كيلو", "معمول", False),
    ("ajwa_box",     32, "عجوة 500 غرام", "علبة", "معمول", False),
    ("siniora",      33, "سنيورة", "كيلو", "معمول", False),
    ("karabij_box",  35, "كرابيج فستق 500 غرام", "علبة", "معمول", False),
    ("kunafa_fistik",41, "كنافة بالفستق", "صحن", "أطباق وكنافة", True),
    ("halawet_jibn", 42, "حلاوة الجبن بالفستق", "صحن", "أطباق وكنافة", False),
    ("asabe_fistik", 44, "أصابع بالفستق", "كيلو", "بقلاوة بالفستق", False),
]

built = []
for slug, pg, name, unit, cat, feat in ITEMS:
    img = square(pg)
    img.save(os.path.join(OUTP, f"{slug}.webp"), "WEBP", quality=88)
    built.append((slug, img, name))

# ---- Logo: crop the "سلورة Salloura oglu 1875" watermark from a clean photo ----
src = load(30); W, H = src.size
logo = src.crop((int(0.735*W), int(0.035*H), int(0.995*W), int(0.205*H)))
logo = logo.resize((logo.width*2, logo.height*2), Image.LANCZOS)
logo.save(os.path.join(OUTB, "logo.png"), "PNG")

# ---- Cover 1600x600: soft gradient + product discs + logo ----
CW, CH = 1600, 600
cover = Image.new("RGB", (CW, CH))
top, bot = (243, 236, 224), (214, 199, 173)
dr = ImageDraw.Draw(cover)
for y in range(CH):
    t = y/CH
    dr.line([(0, y), (CW, y)], fill=(int(top[0]*(1-t)+bot[0]*t), int(top[1]*(1-t)+bot[1]*t), int(top[2]*(1-t)+bot[2]*t)))
def disc(pg, size):
    im = square(pg).resize((size, size), Image.LANCZOS)
    m = Image.new("L", (size, size), 0); ImageDraw.Draw(m).ellipse([0, 0, size, size], fill=255)
    return im, m
for (pg, pos, s) in [(1,(70,150),300),(14,(310,90),235),(11,(310,330),235)]:
    im, m = disc(pg, s)
    dr.ellipse([pos[0]-5, pos[1]-5, pos[0]+s+5, pos[1]+s+5], fill=(176, 142, 74))
    cover.paste(im, pos, m)
# logo on right
lw = 560; lh = int(lw*logo.height/logo.width)
cover.paste(logo.resize((lw, lh), Image.LANCZOS), (CW-lw-120, (CH-lh)//2))
cover.save(os.path.join(OUTB, "cover.jpg"), "JPEG", quality=90)

# contact sheet
cols=6; rows=(len(built)+cols-1)//cols; cell=200
sh=Image.new("RGB",(cols*cell,rows*cell),(245,240,235)); sd=ImageDraw.Draw(sh)
for i,(slug,img,name) in enumerate(built):
    r,c=divmod(i,cols); sh.paste(img.resize((cell-16,cell-40),Image.LANCZOS),(c*cell+8,r*cell+8))
    sd.text((c*cell+8,r*cell+cell-30),f"{i+1}.{slug[:15]}",fill=(0,0,0))
sh.save(SHEET)
print(f"built {len(built)} products + logo + cover")
