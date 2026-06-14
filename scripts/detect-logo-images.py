# -*- coding: utf-8 -*-
"""Detect product entries whose image is just the store logo (no real product photo)."""
import json, os, re
from PIL import Image

ROOT = r"C:\projects\New Dukkanci"

STORES = [
    ("nour-data.js",     "nourProductCatalog",     "/assets/photos/nour/logo.png"),
    ("tihama-data.js",   "tihamaProductCatalog",   "/assets/photos/tihama/logo.png"),
    ("afgan-data.js",    "afganProductCatalog",    "/assets/photos/afgan/logo.png"),
    ("sam-data.js",      "samProductCatalog",      "/assets/photos/sam/logo.png"),
    ("salloura-data.js", "sallouraProductCatalog", "/assets/photos/salloura/logo.png"),
    ("ezzedine-data.js", "ezzedineProductCatalog", "/assets/photos/ezzedine/logo.png"),
]

def load_gray8(path):
    im = Image.open(path)
    if im.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", im.size, (255, 255, 255))
        im = im.convert("RGBA"); bg.paste(im, mask=im.split()[-1]); im = bg
    else:
        im = im.convert("RGB")
    return im

def ahash(path):
    im = load_gray8(path).convert("L").resize((8, 8), Image.LANCZOS)
    px = list(im.getdata()); avg = sum(px) / 64
    return [1 if p > avg else 0 for p in px]

def dhash(path):
    im = load_gray8(path).convert("L").resize((9, 8), Image.LANCZOS)
    px = list(im.getdata()); bits = []
    for r in range(8):
        for c in range(8):
            bits.append(1 if px[r*9+c] > px[r*9+c+1] else 0)
    return bits

def ham(a, b):
    return sum(1 for x, y in zip(a, b) if x != y)

def fpath(img):
    return os.path.join(ROOT, img.lstrip("/").replace("/", os.sep))

for fname, var, logo in STORES:
    fp = os.path.join(ROOT, fname)
    if not os.path.exists(fp):
        continue
    txt = open(fp, encoding="utf-8").read()
    key = f"const {var} = "
    i = txt.find(key)
    if i < 0:
        print(fname, "catalog not found"); continue
    bstart = txt.index("[", i)
    depth = 0; instr = False; esc = False; end = -1
    for j in range(bstart, len(txt)):
        c = txt[j]
        if instr:
            if esc: esc = False
            elif c == "\\": esc = True
            elif c == '"': instr = False
        else:
            if c == '"': instr = True
            elif c == "[": depth += 1
            elif c == "]":
                depth -= 1
                if depth == 0: end = j; break
    catalog = json.loads(txt[bstart:end+1])
    logo_fp = fpath(logo)
    if not os.path.exists(logo_fp):
        print(fname, "logo missing", logo); continue
    la, ld = ahash(logo_fp), dhash(logo_fp)
    flagged = []
    for p in catalog:
        img = p.get("image", "")
        if re.search(r"/logo\.png$", img):
            flagged.append((p["name"], "path=logo")); continue
        f = fpath(img)
        if not os.path.exists(f):
            flagged.append((p["name"], "missing-file")); continue
        try:
            da = ham(ahash(f), la); dd = ham(dhash(f), ld)
        except Exception:
            continue
        if da <= 6 and dd <= 8:
            flagged.append((p["name"], f"~logo a{da} d{dd}"))
    print(f"\n=== {fname}: {len(catalog)} products, {len(flagged)} look like logo-only ===")
    for n, why in flagged:
        print("   -", n, "(", why, ")")
