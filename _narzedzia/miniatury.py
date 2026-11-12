#!/usr/bin/env python3
"""Dokłada miniatury (480x270) do arkusza img/thumbs/sNN.webp (2400x1350, siatka 5x5).

Użycie: miniatury.py NN ID [ID …]
- arkusz NN: jeśli pliku nie ma w repozytorium, powstaje nowy (puste pola w kolorze tła);
  istniejących arkuszy z serwera NIE nadpisujemy, więc nowe miniatury idą do nowego arkusza,
- kolejne wolne pola liczone z danych index.html (pole "thumb" artykułów i meta.json),
- dopisuje ścieżkę arkusza do tablicy "thumbs" w index.html (jeśli jej brak),
- zapisuje "thumb": [NN, kolumna, wiersz] w meta.json.
Kadr: grafika skalowana do szerokości 480 px, wycinek od góry (tam jest tytuł grafiki).
"""
import json, os, re, sys
from PIL import Image

nn = int(sys.argv[1]); ids = sys.argv[2:]
sprite = f"img/thumbs/s{nn:02d}.webp"
h = open("index.html", encoding="utf-8").read()
m = re.search(r'<script id="data" type="application/json">', h)
s = m.end(); e = h.index("</script>", s); raw = h[s:e]
data = json.loads(raw)
meta = json.load(open("_narzedzia/meta.json", encoding="utf-8"))
if sprite not in data["thumbs"]:
    if len(data["thumbs"]) != nn:
        sys.exit(f"Tablica thumbs ma {len(data['thumbs'])} pozycji, a arkusz ma numer {nn}")
    old = json.dumps(data["thumbs"][-1])
    i = raw.index('"thumbs"'); j = raw.index(old, i) + len(old)
    raw = raw[:j] + "," + json.dumps(sprite) + raw[j:]
    assert json.loads(raw)["thumbs"][-1] == sprite
    h = h[:s] + raw + h[e:]
    open("index.html", "w", encoding="utf-8").write(h)
zajete = {tuple(a["thumb"][1:]) for a in data["articles"] if a.get("thumb") and a["thumb"][0] == nn}
zajete |= {tuple(v["thumb"][1:]) for v in meta.values() if v.get("thumb") and v["thumb"][0] == nn}
wolne = [(c, r) for r in range(5) for c in range(5) if (c, r) not in zajete]
if os.path.exists(sprite):
    sh = Image.open(sprite).convert("RGB")
else:
    sh = Image.new("RGB", (2400, 1350), (236, 238, 241))
for pid in ids:
    if meta[pid].get("thumb"):
        print(pid, "ma już", meta[pid]["thumb"]); continue
    c, r = wolne.pop(0)
    im = Image.open(f"_narzedzia/obrazy/{pid}.webp").convert("RGB")
    k = max(480 / im.width, 270 / im.height)
    im = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    x = (im.width - 480) // 2
    im = im.crop((x, 0, x + 480, 270))
    sh.paste(im, (c * 480, r * 270))
    meta[pid]["thumb"] = [nn, c, r]
    print(pid, "->", meta[pid]["thumb"])
os.makedirs("img/thumbs", exist_ok=True)
sh.save(sprite, "WEBP", quality=82, method=6)
json.dump(meta, open("_narzedzia/meta.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
