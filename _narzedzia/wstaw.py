#!/usr/bin/env python3
"""Dopisuje wpisy z _narzedzia/wpisy/*.json do danych portalu w index.html.

Wstawia tekstowo na początek listy "articles" (minimalny diff), pomija wpisy,
których slug albo okładka już są w danych, i sprawdza, czy po zmianie dane
nadal są poprawnym JSON-em.
Użycie: wstaw.py [index.html] [katalog_wpisow]
"""
import glob, json, os, re, sys

index = sys.argv[1] if len(sys.argv) > 1 else "index.html"
wdir = sys.argv[2] if len(sys.argv) > 2 else "_narzedzia/wpisy"

h = open(index, encoding="utf-8").read()
m = re.search(r'<script id="data" type="application/json">', h)
if not m:
    sys.exit("Brak <script id=\"data\"> w " + index)
s = m.end()
e = h.index("</script>", s)
raw = h[s:e]
data = json.loads(raw)
escaped = "<\\/" in raw  # czy oryginał zapisuje "</" jako "<\/"
sep = (",", ":") if '","' in raw[:2000] else (", ", ": ")

have_slug = {a["slug"] for a in data["articles"]}
have_cover = {(a.get("cover") or {}).get("src") for a in data["articles"] if isinstance(a.get("cover"), dict)}

new = []
for f in sorted(glob.glob(os.path.join(wdir, "*.json")), reverse=True):
    a = json.load(open(f, encoding="utf-8"))
    if a["slug"] in have_slug or a["cover"]["src"] in have_cover:
        print("pomijam (już jest):", a["slug"])
        continue
    if not os.path.exists(os.path.join(os.path.dirname(index) or ".", a["cover"]["src"])):
        sys.exit("Brak pliku okładki: " + a["cover"]["src"])
    new.append(a)

if not new:
    print("Nic nowego.")
    sys.exit(0)

new.sort(key=lambda a: a["date"], reverse=True)
chunk = sep[0].join(json.dumps(a, ensure_ascii=False, separators=sep) for a in new)
if escaped:
    chunk = chunk.replace("</", "<\\/")
k = raw.index('"articles"')
k = raw.index("[", k) + 1
raw2 = raw[:k] + chunk + (sep[0] if raw[k:].lstrip()[0] != "]" else "") + raw[k:]
d2 = json.loads(raw2)
assert len(d2["articles"]) == len(data["articles"]) + len(new)
slugs = [a["slug"] for a in d2["articles"]]
assert len(slugs) == len(set(slugs)), "zdublowany slug"
open(index, "w", encoding="utf-8").write(h[:s] + raw2 + h[e:])
print("Dodano:", len(new))
for a in new:
    print(" ", a["date"], a["slug"])
