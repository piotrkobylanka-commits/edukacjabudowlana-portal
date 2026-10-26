#!/usr/bin/env python3
"""Pakuje grafiki nowych wpisów do paczki p/NNN.json i dopisuje je do mapy EBIMG.

Tak portal przechowuje grafiki (ładowanie przy otwarciu artykułu):
- index.html → <script> window.EBIMG … const M={"<ID>":<nr paczki>,…}
- p/NNN.json = {"<ID>": "<base64 WebP>"}; okładka w danych: "img/full/<ID>.webp"
Wejście: _narzedzia/obrazy/<ID>.webp (oryginały pobrane z FB).
Użycie: pakuj.py ID [ID …]   → tworzy kolejną paczkę, aktualizuje meta.json (cover_w/h)
"""
import base64, io, json, os, sys
from PIL import Image

ids = sys.argv[1:]
if not ids:
    sys.exit("Podaj ID zdjęć do spakowania")
h = open("index.html", encoding="utf-8").read()
i = h.find("window.EBIMG")
ms = h.find("const M=", i) + len("const M=")
me = h.find("}", ms) + 1
M = json.loads(h[ms:me])
ids = [x for x in ids if x not in M]
if not ids:
    print("Wszystkie już są w paczkach.")
    sys.exit(0)
n = max(M.values()) + 1
pack, dims = {}, {}
for pid in ids:
    im = Image.open(f"_narzedzia/obrazy/{pid}.webp").convert("RGB")
    if im.width > 960:
        im = im.resize((960, round(im.height * 960 / im.width)), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, "WEBP", quality=80, method=6)
    pack[pid] = base64.b64encode(b.getvalue()).decode()
    dims[pid] = im.size
    M[pid] = n
os.makedirs("p", exist_ok=True)
json.dump(pack, open(f"p/{n:03d}.json", "w"), separators=(",", ":"))
h = h[:ms] + json.dumps(M, separators=(",", ":")) + h[me:]
open("index.html", "w", encoding="utf-8").write(h)
meta = json.load(open("_narzedzia/meta.json", encoding="utf-8"))
for pid, (w, hh) in dims.items():
    if pid in meta:
        meta[pid]["cover_w"], meta[pid]["cover_h"] = w, hh
json.dump(meta, open("_narzedzia/meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"p/{n:03d}.json: {len(pack)} grafik")
