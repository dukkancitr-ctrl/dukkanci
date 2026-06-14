# -*- coding: utf-8 -*-
import fitz, os

SRC = r"C:\Users\Hp\Downloads\مينيو عز الدين.pdf"
OUTDIR = r"C:\projects\New Dukkanci\scripts\ezzedine_raw"
os.makedirs(OUTDIR, exist_ok=True)

doc = fitz.open(SRC)
for i, page in enumerate(doc):
    for img in page.get_images(full=True):
        xref = img[0]
        info = doc.extract_image(xref)
        ext = info["ext"]
        w, h = info["width"], info["height"]
        fn = os.path.join(OUTDIR, f"page-{i+1:02d}.{ext}")
        with open(fn, "wb") as f:
            f.write(info["image"])
        print(f"page {i+1}: {w}x{h} .{ext} ({len(info['image'])//1024} KB)")
