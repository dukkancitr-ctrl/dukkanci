# -*- coding: utf-8 -*-
import fitz, os

SRC = r"C:\Users\Hp\Downloads\IMG-20230310-WA0004.pdf"
OUT = r"C:\projects\New Dukkanci\scripts\store3_probe"
os.makedirs(OUT, exist_ok=True)

doc = fitz.open(SRC)
print("pages:", doc.page_count)
zoom = 90/72
mat = fitz.Matrix(zoom, zoom)
# render a sample: first 12 + a few spread across
sample = list(range(0, 12)) + [20, 40, 60, 80, 100, 120, 128]
sizes = {}
for i in sample:
    if i >= doc.page_count: continue
    page = doc[i]
    pix = page.get_pixmap(matrix=mat)
    pix.save(os.path.join(OUT, f"p-{i+1:03d}.png"))
    imgs = page.get_images(full=True)
    dims = []
    for im in imgs:
        info = doc.extract_image(im[0])
        dims.append(f"{info['width']}x{info['height']}")
    sizes[i+1] = (len(imgs), dims[:3], len(page.get_text().strip()))
for k, v in sizes.items():
    print(f"page {k}: imgs={v[0]} {v[1]} textlen={v[2]}")
