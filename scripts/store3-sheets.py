# -*- coding: utf-8 -*-
import fitz, os
from PIL import Image, ImageDraw

SRC = r"C:\Users\Hp\Downloads\IMG-20230310-WA0004.pdf"
RAW = r"C:\projects\New Dukkanci\scripts\store3_raw"
SH = r"C:\projects\New Dukkanci\scripts\store3_sheets"
os.makedirs(RAW, exist_ok=True)
os.makedirs(SH, exist_ok=True)

doc = fitz.open(SRC)
n = doc.page_count
# 1) extract raw embedded images
paths = []
for i in range(n):
    page = doc[i]
    imgs = page.get_images(full=True)
    if not imgs:
        paths.append(None); continue
    info = doc.extract_image(imgs[0][0])
    p = os.path.join(RAW, f"p-{i+1:03d}.{info['ext']}")
    with open(p, "wb") as f:
        f.write(info["image"])
    paths.append(p)

# 2) contact sheets, 16 per sheet (4 cols x 4 rows), labeled with page number
cell = 300
cols, rows = 4, 4
per = cols * rows
thumbs = cell - 36
sheet_idx = 0
for start in range(0, n, per):
    sheet = Image.new("RGB", (cols*cell, rows*cell), (255,255,255))
    d = ImageDraw.Draw(sheet)
    for k in range(per):
        idx = start + k
        if idx >= n: break
        p = paths[idx]
        if not p: continue
        im = Image.open(p).convert("RGB")
        im.thumbnail((thumbs, thumbs), Image.LANCZOS)
        r, c = divmod(k, cols)
        x = c*cell + (cell - im.width)//2
        y = r*cell + 30 + (thumbs - im.height)//2
        sheet.paste(im, (x, y))
        d.rectangle([c*cell+2, r*cell+2, c*cell+cell-2, r*cell+cell-2], outline=(200,200,200))
        d.text((c*cell+8, r*cell+8), f"P{idx+1}", fill=(200,0,0))
    sheet_idx += 1
    sheet.save(os.path.join(SH, f"sheet-{sheet_idx:02d}.png"))
print(f"{n} pages, {sheet_idx} sheets")
