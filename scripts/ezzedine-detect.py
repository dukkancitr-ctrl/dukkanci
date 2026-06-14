# -*- coding: utf-8 -*-
import cv2, numpy as np, os, json

RAW = r"C:\projects\New Dukkanci\scripts\ezzedine_raw"
OUT = r"C:\projects\New Dukkanci\scripts\ezzedine_detect"
os.makedirs(OUT, exist_ok=True)

result = {}
for page in [3, 4, 5, 7, 8, 9]:
    img = cv2.imread(os.path.join(RAW, f"page-{page:02d}.jpeg"))
    H, W = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, th = cv2.threshold(gray, 78, 255, cv2.THRESH_BINARY)
    k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))
    th = cv2.morphologyEx(th, cv2.MORPH_OPEN, k)
    th = cv2.morphologyEx(th, cv2.MORPH_CLOSE, k)
    cnts, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = []
    for c in cnts:
        x, y, w, h = cv2.boundingRect(c)
        if w * h > 0.02 * W * H and w > 0.18 * W and h > 0.07 * H:
            boxes.append([x, y, w, h])
    # sort top-to-bottom, then left-to-right
    boxes.sort(key=lambda b: (round(b[1] / 60), b[0]))
    vis = img.copy()
    for i, (x, y, w, h) in enumerate(boxes):
        cv2.rectangle(vis, (x, y), (x + w, y + h), (0, 255, 0), 4)
        cv2.putText(vis, str(i), (x + 8, y + 40), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
    cv2.imwrite(os.path.join(OUT, f"det-{page:02d}.png"), vis)
    result[page] = [{"i": i, "x": x, "y": y, "w": w, "h": h,
                     "fx": round(x / W, 3), "fy": round(y / H, 3),
                     "fw": round(w / W, 3), "fh": round(h / H, 3)}
                    for i, (x, y, w, h) in enumerate(boxes)]
    print(f"page {page}: {len(boxes)} boxes")

with open(os.path.join(OUT, "boxes.json"), "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=1)
