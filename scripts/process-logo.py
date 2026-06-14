from PIL import Image

SRC = r"C:\Users\Hp\Downloads\ChatGPT Image Jun 14, 2026, 04_01_29 AM.png"
OUT = r"C:\projects\New Dukkanci\assets\dukkanci-logo.png"

img = Image.open(SRC).convert("RGBA")
px = img.load()
w, h = img.size

# Key out near-white background to transparency, with a smooth alpha ramp
# so anti-aliased red/gray edges stay clean (no white halo).
LOW, HIGH = 238, 252  # min(r,g,b) below LOW = fully opaque; above HIGH = fully transparent
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        m = min(r, g, b)
        if m >= HIGH:
            px[x, y] = (r, g, b, 0)
        elif m > LOW:
            alpha = int(255 * (HIGH - m) / (HIGH - LOW))
            px[x, y] = (r, g, b, 255 - alpha)
        # else: leave fully opaque

# Trim to the bounding box of visible (non-transparent) pixels
bbox = img.getbbox()
if bbox:
    img = img.crop(bbox)

img.save(OUT, "PNG", optimize=True)
print("Saved", OUT, "size", img.size)
