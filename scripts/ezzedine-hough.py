# -*- coding: utf-8 -*-
import cv2, numpy as np, os, json

RAW = r"C:\projects\New Dukkanci\scripts\ezzedine_raw"
OUT = r"C:\projects\New Dukkanci\scripts\ezzedine_detect"
os.makedirs(OUT, exist_ok=True)

result = {}
for page in [3, 4, 5, 7, 8]:
    img = cv2.imread(os.path.join(RAW, f"page-{page:02d}.jpeg"))
    H, W = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    gray = cv2.medianBlur(gray, 5)
    raw = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, dp=1, minDist=170,
                           param1=110, param2=30, minRadius=120, maxRadius=165)
    vis = img.copy()
    out = []
    circles = []
    if raw is not None:
        cand = np.round(raw[0]).astype(int)
        # keep only circles whose centre falls in a known column band
        for cx, cy, r in cand:
            if (180 <= cx <= 300 or 590 <= cx <= 720) and 0.05*H < cy < 0.95*H:
                circles.append((cx, cy, r))
        # dedupe: merge circles whose centres are within 90px (same photo)
        merged = []
        for c in circles:
            if not any(abs(c[0]-m[0]) < 90 and abs(c[1]-m[1]) < 90 for m in merged):
                merged.append(c)
        circles = sorted(merged, key=lambda c: (round(c[1] / 120), c[0]))
        for i, (cx, cy, r) in enumerate(circles):
            cv2.circle(vis, (cx, cy), r, (0, 255, 0), 4)
            cv2.putText(vis, str(i), (cx - 10, cy), cv2.FONT_HERSHEY_SIMPLEX, 1.3, (0, 255, 255), 3)
            out.append({"i": i, "cx": int(cx), "cy": int(cy), "r": int(r),
                        "fcx": round(cx / W, 4), "fcy": round(cy / H, 4), "fr": round(r / W, 4)})
    cv2.imwrite(os.path.join(OUT, f"hough-{page:02d}.png"), vis)
    result[page] = out
    print(f"page {page}: {len(out)} circles")

with open(os.path.join(OUT, "circles.json"), "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
