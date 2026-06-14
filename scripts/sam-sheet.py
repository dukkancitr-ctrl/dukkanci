# -*- coding: utf-8 -*-
import json, re, os
from PIL import Image, ImageDraw

ROOT = r"C:\projects\New Dukkanci"
t = open(os.path.join(ROOT, "sam-data.js"), encoding="utf-8").read()
cat = json.loads(re.search(r"ProductCatalog = (\[.*?\n\]);", t, re.S).group(1))
dir = os.path.join(ROOT, "assets", "photos", "sam", "products")

cols, cell = 6, 200
rows = (len(cat) + cols - 1) // cols
sheet = Image.new("RGB", (cols*cell, rows*cell), (245, 245, 245))
d = ImageDraw.Draw(sheet)
for i, p in enumerate(cat):
    f = os.path.join(dir, p["image"].split("/")[-1])
    r, c = divmod(i, cols)
    try:
        im = Image.open(f).convert("RGB").resize((cell-12, cell-30), Image.LANCZOS)
        sheet.paste(im, (c*cell+6, r*cell+6))
    except Exception:
        pass
    d.rectangle([c*cell+1, r*cell+1, c*cell+cell-1, r*cell+cell-1], outline=(180, 180, 180))
    d.text((c*cell+6, r*cell+cell-22), f"#{i}", fill=(200, 0, 0))
sheet.save(os.path.join(ROOT, "scripts", "sam_sheet.png"))
print("sheet built,", len(cat), "items")
