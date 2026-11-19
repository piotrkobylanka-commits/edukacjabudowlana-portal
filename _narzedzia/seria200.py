#!/usr/bin/env python3
"""Seria „200 cudów inżynierii świata” w index.html (bezpieczne do powtórzenia).

- dopisuje serię do tablicy "series" (jeśli jej nie ma) i uzupełnia listę slugów,
- ustawia "seria" i "nr" w artykułach, które mają je w meta.json.
Użycie: python3 _narzedzia/seria200.py index.html
"""
import json, re, sys

KEY = "200-cudow-inzynierii"
path = sys.argv[1]
h = open(path, encoding="utf-8").read()
meta = json.load(open("_narzedzia/meta.json", encoding="utf-8"))
m = re.search(r'<script id="data" type="application/json">', h)
s = m.end(); e = h.index("</script>", s)
raw = h[s:e]
data = json.loads(raw)
arts = {a["slug"]: a for a in data["articles"]}

odc = []  # (nr, slug)
for pid, mt in meta.items():
    if mt.get("seria") != KEY:
        continue
    wp = json.load(open(f"_narzedzia/wpisy/{pid}.json", encoding="utf-8"))
    slug = wp["slug"]
    if slug not in arts:
        continue
    odc.append((mt["nr"], slug))
    old = f'"slug":{json.dumps(slug, ensure_ascii=False)}'
    i = raw.index(old)
    j = raw.index('"nr":', i)
    seg_end = raw.index('"cover"', j)
    seg = raw[j:seg_end]
    new_seg = re.sub(r'"nr":(null|\d+),"seria":(null|"[^"]*")', f'"nr":{mt["nr"]},"seria":"{KEY}"', seg, count=1)
    raw = raw[:j] + new_seg + raw[seg_end:]
odc.sort()
slugs = [s for _, s in odc]

ser = {
    "key": KEY,
    "name": "200 cudów inżynierii świata",
    "desc": "200 konstrukcji z całego świata i inżynieria, która za nimi stoi: fundamenty, podpory, materiały, technologie budowy i to, co z tych projektów zmieniło współczesne budownictwo.",
    "planned": 200,
    "slugs": slugs,
}
if f'"key":"{KEY}"' not in raw:
    raw = raw.replace('"series":[', '"series":[' + json.dumps(ser, ensure_ascii=False, separators=(",", ":")) + ",", 1)
else:
    i = raw.index(f'"key":"{KEY}"')
    a = raw.index('"slugs":[', i) + len('"slugs":')
    b = raw.index("]", a) + 1
    raw = raw[:a] + json.dumps(slugs, ensure_ascii=False, separators=(",", ":")) + raw[b:]
raw = raw.replace("</", "<\\/")
json.loads(raw)
open(path, "w", encoding="utf-8").write(h[:s] + raw + h[e:])
print("seria:", len(slugs), "odcinków", slugs)
