from PIL import Image

# Neutral branded placeholder for items without their own photo (replaces the
# repeated category images so the same food photo no longer appears on many dishes).
W = H = 800
bg = Image.new("RGB", (W, H), (244, 240, 233))  # warm light cream

logo = Image.open("assets/photos/ademsef/logo.png").convert("RGBA")
lw, lh = logo.size
scale = (W * 0.62) / max(lw, lh)
logo = logo.resize((round(lw * scale), round(lh * scale)), Image.LANCZOS)
x = (W - logo.width) // 2
y = (H - logo.height) // 2
bg.paste(logo, (x, y), logo)

bg.save("assets/photos/ademsef/placeholder.jpg", format="JPEG", quality=88, optimize=True)
import os
print("placeholder:", bg.size, round(os.path.getsize("assets/photos/ademsef/placeholder.jpg") / 1024, 1), "KB")
