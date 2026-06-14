# -*- coding: utf-8 -*-
from PIL import Image, ImageDraw

S = 480
img = Image.new("RGB", (S, S))
d = ImageDraw.Draw(img)
# warm gradient background
top, bot = (244, 169, 60), (224, 122, 38)
for y in range(S):
    t = y / S
    d.line([(0, y), (S, y)], fill=tuple(int(top[i]*(1-t)+bot[i]*t) for i in range(3)))

W = (255, 252, 246)  # warm white
cx, cy = S//2, S//2 + 8

# plate: two concentric circles
d.ellipse([cx-120, cy-120, cx+120, cy+120], outline=W, width=14)
d.ellipse([cx-78, cy-78, cx+78, cy+78], outline=W, width=8)

# fork (left of plate)
fx = cx - 168
d.rounded_rectangle([fx-7, cy-150, fx+7, cy+150], radius=7, fill=W)      # handle
for dx in (-22, -7, 8, 23):                                              # tines
    d.rounded_rectangle([fx+dx-5, cy-150, fx+dx+5, cy-92], radius=5, fill=W)
d.rounded_rectangle([fx-26, cy-104, fx+27, cy-86], radius=9, fill=W)     # tine base

# knife (right of plate)
kx = cx + 168
d.rounded_rectangle([kx-8, cy-30, kx+8, cy+150], radius=8, fill=W)       # handle
d.polygon([(kx-4, cy-150), (kx+14, cy-150), (kx+8, cy-25), (kx-8, cy-25)], fill=W)  # blade

img.save(r"C:\projects\New Dukkanci\assets\photos\store-restaurant.jpg", "JPEG", quality=90)
print("saved store-restaurant.jpg")
