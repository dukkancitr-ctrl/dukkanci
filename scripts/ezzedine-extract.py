# -*- coding: utf-8 -*-
import fitz, os, json

SRC = r"C:\Users\Hp\Downloads\مينيو عز الدين.pdf"
OUTDIR = r"C:\projects\New Dukkanci\scripts\ezzedine_pages"
os.makedirs(OUTDIR, exist_ok=True)

doc = fitz.open(SRC)
print("pages:", doc.page_count)

# 1) Render each page to a preview PNG (~110 dpi) so we can view layout
zoom = 110/72
mat = fitz.Matrix(zoom, zoom)
text_dump = {}
img_counts = {}
for i, page in enumerate(doc):
    pix = page.get_pixmap(matrix=mat)
    pix.save(os.path.join(OUTDIR, f"page-{i+1:02d}.png"))
    txt = page.get_text("text").strip()
    text_dump[i+1] = txt
    img_counts[i+1] = len(page.get_images(full=True))

with open(os.path.join(OUTDIR, "_text.json"), "w", encoding="utf-8") as f:
    json.dump(text_dump, f, ensure_ascii=False, indent=2)

print("image counts per page:", img_counts)
print("rendered to", OUTDIR)
