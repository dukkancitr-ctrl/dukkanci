# -*- coding: utf-8 -*-
from PIL import Image
import os

SRC = r"C:\Users\Hp\Downloads\ChatGPT Image Jun 14, 2026, 04_01_29 AM.png"
OUT = r"C:\projects\New Dukkanci\assets"

img = Image.open(SRC).convert("RGB")
W, H = img.size
px = img.load()

# detect the red cart-D mark in the TOP ~56% (excludes the Arabic/English text below)
top_h = int(H * 0.56)
minx, miny, maxx, maxy = W, H, 0, 0
for y in range(0, top_h, 2):
    for x in range(0, W, 2):
        r, g, b = px[x, y]
        if r > 150 and g < 120 and b < 120:  # mark red
            if x < minx: minx = x
            if x > maxx: maxx = x
            if y < miny: miny = y
            if y > maxy: maxy = y
print("mark bbox:", minx, miny, maxx, maxy)

mark = img.crop((minx, miny, maxx + 1, maxy + 1))

def icon(size, pad_ratio, bg):
    canvas = Image.new("RGBA", (size, size), bg)
    inner = int(size * (1 - 2 * pad_ratio))
    m = mark.copy()
    m.thumbnail((inner, inner), Image.LANCZOS)
    canvas.paste(m, ((size - m.width) // 2, (size - m.height) // 2))
    return canvas

WHITE = (255, 255, 255, 255)
# PWA icons (overwrite existing, referenced by manifest)
icon(192, 0.12, WHITE).convert("RGB").save(os.path.join(OUT, "dukkanci-app-icon-192.png"))
icon(512, 0.18, WHITE).convert("RGB").save(os.path.join(OUT, "dukkanci-app-icon-512.png"))  # maskable-safe padding
# favicons
icon(32, 0.06, (255, 255, 255, 0)).save(os.path.join(OUT, "favicon-32.png"))
icon(180, 0.12, WHITE).convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"))
# multi-size .ico
ico = icon(64, 0.06, (255, 255, 255, 0))
ico.save(os.path.join(OUT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])
print("favicons written")
