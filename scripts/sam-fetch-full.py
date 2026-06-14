# -*- coding: utf-8 -*-
import json, os, io, re, urllib.request, hashlib, glob
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = r"C:\projects\New Dukkanci"
PROD = os.path.join(ROOT, "assets", "photos", "sam", "products")
API = "https://e-store.biz/api/material?page={}"
STORAGE = "https://e-store.biz/storage/"
HDR = {"User-Agent": "Mozilla/5.0", "Accept": "application/json", "domain": "samgunleri.com"}

def get(url):
    return json.loads(urllib.request.urlopen(urllib.request.Request(url, headers=HDR), timeout=30).read())

# 1) paginate all materials
p1 = get(API.format(1))["data"]
last = p1["last_page"]
mats = list(p1["data"])
for pg in range(2, last + 1):
    mats += get(API.format(pg))["data"]["data"]
print("fetched materials:", len(mats), "pages:", last)

def img_url(m):
    imgs = m.get("images") or []
    if imgs:
        im = imgs[0]
        path = im if isinstance(im, str) else (im.get("image") or im.get("url") or "")
        if path:
            return path if path.startswith("http") else STORAGE + path.lstrip("/")
    return ""

# 2) download all images
os.makedirs(PROD, exist_ok=True)
for f in glob.glob(os.path.join(PROD, "*.webp")):
    os.remove(f)

items = []
for i, m in enumerate(mats):
    u = img_url(m)
    if not u:
        continue
    items.append({"name": (m.get("name") or "").strip(), "price": int(float(m.get("price") or 0)),
                  "url": u, "featured": bool(m.get("is_featured")), "slug": f"m{i:03d}"})

def dl(it):
    out = os.path.join(PROD, it["slug"] + ".webp")
    try:
        data = urllib.request.urlopen(urllib.request.Request(it["url"], headers=HDR), timeout=30).read()
        im = Image.open(io.BytesIO(data)).convert("RGB")
        s = min(im.size); im = im.crop(((im.width-s)//2, (im.height-s)//2, (im.width-s)//2+s, (im.height-s)//2+s))
        if im.width > 640: im = im.resize((640, 640), Image.LANCZOS)
        im.save(out, "WEBP", quality=86)
        it["md5"] = hashlib.md5(open(out, "rb").read()).hexdigest()
        return True
    except Exception as e:
        it["md5"] = None
        return False

list(ThreadPoolExecutor(max_workers=16).map(dl, items))
items = [it for it in items if it.get("md5")]

# 3) detect logo placeholder: perceptual-match to store logo OR very large dup group (>=8)
from collections import Counter
def ahash(p):
    im = Image.open(p).convert("L").resize((8, 8), Image.LANCZOS); d = list(im.getdata()); a = sum(d)/64
    return [1 if x > a else 0 for x in d]
def ham(a, b): return sum(1 for x, y in zip(a, b) if x != y)
logo_file = os.path.join(ROOT, "assets", "photos", "sam", "logo.png")
la = ahash(logo_file) if os.path.exists(logo_file) else None
cnt = Counter(it["md5"] for it in items)
rep = {}  # md5 -> a representative file path
for it in items:
    rep.setdefault(it["md5"], os.path.join(PROD, it["slug"]+".webp"))
logo_hashes = set()
for h, c in cnt.items():
    is_logo = c >= 8
    if not is_logo and la:
        try:
            if ham(ahash(rep[h]), la) <= 6: is_logo = True
        except Exception: pass
    if is_logo: logo_hashes.add(h)
print("logo groups:", [(h[:8], cnt[h]) for h in logo_hashes])
removed_files = 0
final = []
for it in items:
    if it["md5"] in logo_hashes:
        f = os.path.join(PROD, it["slug"]+".webp")
        if os.path.exists(f): os.remove(f); removed_files += 1
        continue
    final.append(it)
print("after logo removal:", len(final), "| removed logo files:", removed_files)

# 4) categorize
def cat(n):
    if re.search(r"شاورما", n): return "شاورما"
    if re.search(r"بروست|فروج|دجاج|كنتاكي|كرسبي", n): return "فروج ودجاج"
    if re.search(r"كباب|تكة|تكه|شيش|مشوي|مشاوي|ريش|كفتة", n): return "مشاوي"
    if re.search(r"برغر|برجر|همبرغر|غربي|ناجت|ناغت|اصابع|بطاطا|سو سيس|نقانق", n): return "وجبات غربية"
    if re.search(r"وافل|كريب|بان ?كيك|بانكيك|بنكيك", n): return "وافل وكريب"
    if re.search(r"سلطة فواكه|سلطه فواكه|فواكه", n): return "سلطات فواكه"
    if re.search(r"كاسة|كاسات|بوظة|بوظه|براوني|لوتس|نوتيلا|شوكلامو|توتي|آيس|ايس كريم|حلى|كنافة|بسبوسة|بقلاوة|دبي", n): return "حلويات وكاسات"
    if re.search(r"عصير", n): return "عصائر طبيعية"
    if re.search(r"كوكتيل|ميلك ?شيك|سموذي|سموثي|موهيتو|فراب", n): return "كوكتيلات وميلك شيك"
    if re.search(r"كولا|بيبسي|سفن|مياه|ماء|مشروب|عائلي|ينسون|شاي|قهوة|نسكافيه|ماونتن|فيمتو", n): return "مشروبات"
    if re.search(r"مدفون|منسف|مندي|كبسة|مظبي|سختورة|مناسف|قشة|قشاط|امبراطور|عربي|مسبحة|فتة", n): return "أطباق شرقية"
    if re.search(r"مقبلات|سلطة|سلطات|فول|حمص|متبل|فتوش|تبولة|محمرة|طراطور|لبنة|كبيس", n): return "مقبلات وسلطات"
    if re.search(r"سمك|سمكة|فيليه|جمبري|روبيان", n): return "أسماك"
    if re.search(r"كبة|كبه", n): return "كبة"
    if re.search(r"معجنات|فطيرة|فطاير|بيتزا|مناقيش|صفيحة|سمبوسة|سمبوسك", n): return "معجنات وبيتزا"
    return "أطباق متنوعة"

for it in final:
    it["category"] = cat(it["name"])

# 5) write products json for the gen step
out = [{"name": it["name"], "price": it["price"], "image": f"/assets/photos/sam/products/{it['slug']}.webp",
        "category": it["category"], "featured": it["featured"]} for it in final if it["name"]]
json.dump(out, open(os.path.join(ROOT, "scripts", "sam_products.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
byc = Counter(o["category"] for o in out)
print("FINAL products:", len(out))
print("categories:", json.dumps(dict(byc), ensure_ascii=True))
