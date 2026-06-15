import os
from PIL import Image, ImageFilter, ImageEnhance

# Cover built from the "وجبة سوبريم" platter photo, enhanced and cropped to a banner.
src = "scripts/ademsef-tmp/raw/6E2F2A4A-868C-440A-AF2C-67F6258B786B.jpg"
im = Image.open(src).convert("RGB")
w, h = im.size
scale = 1600 / max(w, h)
im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
im = im.filter(ImageFilter.UnsharpMask(radius=2.0, percent=130, threshold=2))
im = ImageEnhance.Color(im).enhance(1.16)
im = ImageEnhance.Contrast(im).enhance(1.08)
im = ImageEnhance.Sharpness(im).enhance(1.12)

w, h = im.size
# banner crop: keep the dish, trim top/bottom to ~1.6:1
top = int(h * 0.12)
bottom = int(h * 0.90)
crop = im.crop((0, top, w, bottom))
crop.save("assets/photos/ademsef/cover.jpg", format="JPEG", quality=88, optimize=True, progressive=True)
print("cover:", crop.size, round(os.path.getsize("assets/photos/ademsef/cover.jpg") / 1024, 1), "KB")
