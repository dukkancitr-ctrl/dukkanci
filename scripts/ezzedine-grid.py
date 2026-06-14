# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw
import os

RAW = r"C:\projects\New Dukkanci\scripts\ezzedine_raw"
OUT = r"C:\projects\New Dukkanci\scripts\ezzedine_grid"
os.makedirs(OUT, exist_ok=True)

for page in [1, 3, 4, 5, 7, 8, 9]:
    p = os.path.join(RAW, f"page-{page:02d}.jpeg")
    img = Image.open(p).convert("RGB")
    w, h = img.size
    d = ImageDraw.Draw(img)
    # vertical lines every 10%
    for i in range(1, 10):
        x = int(w * i / 10)
        d.line([(x, 0), (x, h)], fill=(0, 255, 0), width=2)
        d.text((x + 2, 4), str(i * 10), fill=(0, 255, 0))
        d.text((x + 2, h - 18), str(i * 10), fill=(0, 255, 0))
    # horizontal lines every 5%
    for i in range(1, 20):
        y = int(h * i / 20)
        d.line([(0, y), (w, y)], fill=(255, 255, 0), width=1)
        d.text((4, y + 1), str(i * 5), fill=(255, 255, 0))
    img.save(os.path.join(OUT, f"grid-{page:02d}.png"))
    print("grid", page, w, h)
