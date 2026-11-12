#!/usr/bin/env python3
"""Naprawa wpisów od 2026-11-01: punkty „❌ …” wstawione jako <h2> zamienia na listę <ul> i usuwa je ze spisu treści.
Użycie: napraw-listy-bledow.py [index.html]  (można uruchamiać wielokrotnie)"""
import json, re, sys
idx = sys.argv[1] if len(sys.argv) > 1 else "index.html"
h = open(idx, encoding="utf-8").read()
m = re.search(r'<script id="data" type="application/json">', h)
s = m.end(); e = h.index("</script>", s); raw = h[s:e]
data = json.loads(raw)
H2 = re.compile(r'<h2 id="([^"]*)">(❌[^<]*)</h2>')
def zly(t):
    return not re.search(r"\d+\s+b[łl][ęe]d|BŁĘD|błędów", t)
zmiany = 0
for a in data["articles"]:
    if a.get("date", "") < "2026-11-01" or not H2.search(a["html"]):
        continue
    lines = a["html"].split("\n"); out = []; ids = set(); ul = False
    for l in lines:
        mm = H2.fullmatch(l)
        if mm and zly(mm.group(2)):
            if not ul:
                out.append("<ul>"); ul = True
            out.append(f'<li class="fb-b">{mm.group(2)}</li>'); ids.add(mm.group(1)); continue
        if ul:
            out.append("</ul>"); ul = False
        out.append(l)
    if ul: out.append("</ul>")
    if ids:
        old = a["html"]; new = "\n".join(out)
        a["toc"] = [t for t in a["toc"] if t["id"] not in ids]
        # podmiana tekstowa, żeby nie przepisywać całego JSON-a
        o1 = json.dumps(old, ensure_ascii=False); n1 = json.dumps(new, ensure_ascii=False)
        if "<\\/" in raw:
            o1 = o1.replace("</", "<\\/"); n1 = n1.replace("</", "<\\/")
        assert raw.count(o1) == 1, a["slug"]
        raw = raw.replace(o1, n1)
        zmiany += 1; print(a["date"], len(ids), a["slug"][:60])
# spisy treści: przebuduj przez ponowne dopasowanie
data2 = json.loads(raw)
bys = {a["slug"]: a for a in data["articles"]}
for a in data2["articles"]:
    b = bys[a["slug"]]
    if a["toc"] != b["toc"]:
        o = json.dumps(a["toc"], ensure_ascii=False, separators=(",", ":")); n = json.dumps(b["toc"], ensure_ascii=False, separators=(",", ":"))
        assert raw.count(o) == 1, ("toc", a["slug"])
        raw = raw.replace(o, n)
json.loads(raw)
open(idx, "w", encoding="utf-8").write(h[:s] + raw + h[e:])
print("naprawiono:", zmiany)
