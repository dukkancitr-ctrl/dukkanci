# -*- coding: utf-8 -*-
import os
from PIL import Image, ImageDraw

RAW = r"C:\projects\New Dukkanci\scripts\store3_raw"
SH = r"C:\projects\New Dukkanci\scripts\store3_sheets"

def sheet(pages, name):
    cell = 600
    cols = 2
    rows = (len(pages)+cols-1)//cols
    img = Image.new("RGB", (cols*cell, rows*cell), (255,255,255))
    d = ImageDraw.Draw(img)
    for k, pg in enumerate(pages):
        # find file
        f = None
        for ext in ("jpeg","jpg","png"):
            p = os.path.join(RAW, f"p-{pg:03d}.{ext}")
            if os.path.exists(p): f = p; break
        if not f: continue
        im = Image.open(f).convert("RGB")
        im.thumbnail((cell-50, cell-50), Image.LANCZOS)
        r, c = divmod(k, cols)
        x = c*cell + (cell-im.width)//2
        y = r*cell + 40 + (cell-50-im.height)//2
        img.paste(im, (x, y))
        d.text((c*cell+10, r*cell+8), f"P{pg}", fill=(220,0,0))
    img.save(os.path.join(SH, name))

sheet([33,34,35,36], "z-33.png")
sheet([37,38,39,40], "z-37.png")
sheet([41,42,43,44], "z-41.png")
sheet([45,46,47,48], "z-45.png")
print("done")
