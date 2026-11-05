#!/usr/bin/env python3
"""Nowe Zestawienie z eksportem .xls. Użycie: python3 _narzedzia/planer/nanies-zestawienie.py index.html (można powtarzać)."""
import json, os, re, sys
p = sys.argv[1]
s = open(p, encoding="utf-8").read()
mod = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "zestawienie.js"), encoding="utf-8").read()
kon = "/* ---------- zakładka: schemat połączeń ---------- */"
a = s.find("/* ---------- zestawienie materiałów ---------- */")
if a < 0:
    a = s.index("function renderBom(D){")
b = s.index(kon, a)
s = s[:a] + mod + s[b:]
m = re.search(r'const PLANER_CSS = ("(?:[^"\\]|\\.)*");', s)
c = json.loads(m.group(1))
c = re.sub(r"/\* zestawienie \*/.*?/\* koniec zestawienia \*/\n", "", c, flags=re.S)
css = """/* zestawienie */
.bbar{margin:0 0 16px}
.bsec{background:var(--p-surface);border:1px solid var(--p-line);border-radius:var(--r,14px);overflow:hidden;margin-bottom:12px}
.bsec header{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:baseline;gap:4px 14px;background:var(--p-navy);color:#fff;padding:9px 16px}
.bsec header h3{margin:0;color:#fff;font-size:18px}
.bsec header span{font-family:var(--p-f-mono);font-size:12px;color:#D9D5CB}
.bit{display:grid;grid-template-columns:40px minmax(0,1fr) 64px 76px;gap:12px;align-items:center;padding:9px 16px;border-top:1px solid var(--p-line)}
.bit:first-child{border-top:0}
.bit:nth-child(even){background:var(--p-mist)}
.bic{display:grid;place-items:center;width:40px;height:40px;background:#F3F1EC;border-radius:8px}
.bnm{display:grid;gap:1px;min-width:0}
.bnm b{font-weight:600;font-size:15px;line-height:1.25}
.bnm small{font-family:var(--p-f-mono);font-size:12px;color:var(--p-muted);overflow-wrap:anywhere}
.bmo{font-family:var(--p-f-mono);font-size:12px;color:var(--p-muted);text-align:right}
.bqt{font-family:var(--p-f-disp);font-size:24px;font-weight:700;text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}
.bqt small{font-family:var(--p-f-body);font-size:12px;font-weight:500;color:var(--p-muted);margin-left:3px}
@media (max-width:560px){.bit{grid-template-columns:40px minmax(0,1fr) auto;gap:8px 10px;padding:9px 12px}.bmo{display:none}}
/* koniec zestawienia */
"""
c = c.rstrip("\n") + "\n" + css
s = s[:m.start(1)] + json.dumps(c, ensure_ascii=False) + s[m.end(1):]
open(p, "w", encoding="utf-8").write(s)
print("naniesiono", len(s.encode("utf-8")))
