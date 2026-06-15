import os
from PIL import Image

src = "assets/photos/khawali/items/item-014.jpeg"  # Al Khawali Shawarma Meal platter
im = Image.open(src).convert("RGB")
w, h = im.size

# Trim the dark top band to a wide banner focused on the dish.
top = int(h * 0.17)
bottom = int(h * 0.95)
crop = im.crop((0, top, w, bottom))

dst = "assets/photos/khawali/cover.jpg"
crop.save(dst, format="JPEG", quality=86, optimize=True, progressive=True)
print("saved", dst, crop.size, f"{os.path.getsize(dst)/1024:.0f} KB")
