import os
from PIL import Image

src = "assets/photos/bitehaus/items/item-001.jpeg"
im = Image.open(src).convert("RGB")
w, h = im.size

# Trim the ornate border and the bottom text banner ("Sweet Chili Tender meal (3)").
bx = int(w * 0.022)
top = int(h * 0.03)
bottom = int(h * 0.79)
crop = im.crop((bx, top, w - bx, bottom))

dst = "assets/photos/bitehaus/cover.jpg"
crop.save(dst, format="JPEG", quality=86, optimize=True, progressive=True)
print("saved", dst, crop.size, f"{os.path.getsize(dst)/1024:.0f} KB")

# remove the old logo-style png cover and any preview
for p in ("assets/photos/bitehaus/cover.png", "assets/photos/bitehaus/_cover_preview.png"):
    if os.path.exists(p):
        os.remove(p)
        print("removed", p)
