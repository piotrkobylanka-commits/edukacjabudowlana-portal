#!/usr/bin/env python3
"""Dodaje do Projektu rozdzielnicy zakładkę Połączenia i wybór układu sieci.
Użycie: python3 _narzedzia/planer/nanies.py index.html
Bezpieczne do powtórzenia: drugi raz niczego nie zmienia. Wymaga _narzedzia/planer/polaczenia.js."""
import json, os, re, sys

p = sys.argv[1]
s = open(p, encoding="utf-8").read()
if "function renderPol(D)" in s:
    # odświeżenie samego modułu przy kolejnym naniesieniu
    a = s.index("/* ---------- zakładka: schemat połączeń ---------- */")
    b = s.index("function update(){", a)
    s = s[:a] + open(os.path.join(os.path.dirname(__file__), "polaczenia.js"), encoding="utf-8").read() + s[b:]
    open(p, "w", encoding="utf-8").write(s)
    print("odświeżono moduł polaczenia.js")
    sys.exit(0)


def rep(a, b, n=1):
    global s
    c = s.count(a)
    if c < 1 or (n and c != n):
        raise SystemExit(f"nie pasuje ({c}×): {a[:70]}")
    s = s.replace(a, b)


# --- HTML i CSS modułu (zapisane jako łańcuchy JSON)
def jstr(name):
    m = re.search(r"const " + name + r' = ("(?:[^"\\]|\\.)*");', s)
    return m, json.loads(m.group(1))


m, h = jstr("PLANER_HTML")
a = '<label class="fld"><span>Ochrona różnicowoprądowa</span>'
assert a in h
h = h.replace(a, '<label class="fld"><span>Układ sieci na wejściu</span><select id="s-net"><option value="tnc">TN-C: PEN, podział w tej rozdzielnicy</option><option value="tns">TN-S: osobno N i PE</option></select></label>\n          ' + a)
a = "<li><b>Odczytaj wynik</b>elewacja, schemat, zestawienie materiałów</li>"
assert a in h
h = h.replace(a, "<li><b>Odczytaj wynik</b>elewacja, schemat, połączenia przewodów, zestawienie materiałów</li>")
a = "      <!-- 07 ZESTAWIENIE -->"
assert a in h
h = h.replace(a, '''      <!-- 07 POŁĄCZENIA -->
      <section class="panel" id="p-polaczenia" style="--c:#475569" hidden>
        <div class="tabhead"><div class="num">07</div><div><h2>Połączenia przewodów</h2><p>Schemat tworzy się sam z obwodów i rozdzielnicy: każda faza swoim kolorem, podział PEN, szyny N i PE, RCD, wyłączniki i lista wszystkich połączeń.</p></div></div>
        <div id="polacz"></div>
      </section>

      <!-- 08 ZESTAWIENIE -->''')
a = '<div class="tabhead"><div class="num">07</div><div><h2>Zestawienie materiałów</h2>'
assert a in h
h = h.replace(a, '<div class="tabhead"><div class="num">08</div><div><h2>Zestawienie materiałów</h2>')
a = '<button class="tab" role="tab" data-tab="zestawienie" style="--c:#E8912D"><span class="tn">07</span>Zestawienie</button>'
assert a in h
h = h.replace(a, '<button class="tab" role="tab" data-tab="polaczenia" style="--c:#475569"><span class="tn">07</span>Połączenia</button>\n      <button class="tab" role="tab" data-tab="zestawienie" style="--c:#E8912D"><span class="tn">08</span>Zestawienie</button>')
s = s[:m.start(1)] + json.dumps(h, ensure_ascii=False) + s[m.end(1):]

m, c = jstr("PLANER_CSS")
a = ".legend{display:flex"
assert a in c
c = c.replace(a, ".draw.fit svg{width:100%;height:auto}\ntd.wsec{background:var(--p-sky)!important;font-family:var(--p-f-disp);font-weight:700;text-transform:uppercase;letter-spacing:.04em}\n.stack .tip>span,.stack .note>span{min-width:0}\n" + a)
s = s[:m.start(1)] + json.dumps(c, ensure_ascii=False) + s[m.end(1):]

# --- JS modułu
rep('const TABS=["start","obwody","bilans","przewody","rozdzielnica","schemat","zestawienie"];',
    'const TABS=["start","obwody","bilans","przewody","rozdzielnica","schemat","polaczenia","zestawienie"];')
rep('return {name:"Dom jednorodzinny 140 m² (przykład fikcyjny)",supply:"3f",strategy:"rcd"',
    'return {name:"Dom jednorodzinny 140 m² (przykład fikcyjny)",supply:"3f",net:"tnc",strategy:"rcd"')
rep('if(!S||!Array.isArray(S.circ))S=sample();',
    'if(!S||!Array.isArray(S.circ))S=sample();\nif(!S.net)S.net="tnc";')
rep('function cableName(s,m,ph){const cores=ph===3?5:3;const t=m==="D1"?"YKY":m==="E"?"YDY":(s<=4?"YDYp":"YDY");return t+" "+cores+"×"+fS(s);}',
    'function cableName(s,m,ph,cores){cores=cores||(ph===3?5:3);const t=m==="D1"?"YKY":m==="E"?"YDY":(s<=4?"YDYp":"YDY");return t+" "+cores+"×"+fS(s);}\n'
    'function wlzName(D){const f3=S.supply==="3f";return cableName(D.wlz.S,S.wlzM,f3?3:1,S.net==="tnc"?(f3?4:2):(f3?5:3));}')
rep('for(const s of SECT.filter(v=>v>=6)){const Iz=IZ[loadedW]', 'for(const s of SECT.filter(v=>v>=(S.net==="tnc"?10:6))){const Iz=IZ[loadedW]')
rep('return {rows,groups,load,Pi,Pz,cosAvg,IBw,Ipl,Pprz,wlz,FR,ktW,used,need,W,lay,nRows,total,free,frMod,spdMod};',
    'return {rows,groups,blocks,load,Pi,Pz,cosAvg,IBw,Ipl,Pprz,wlz,FR,ktW,used,need,W,lay,nRows,total,free,frMod,spdMod};')
rep('$("#s-name").value=S.name;$("#s-supply").value=S.supply;', '$("#s-name").value=S.name;$("#s-supply").value=S.supply;$("#s-net").value=S.net;')
rep('const startMap={"s-name":["name","t"],"s-supply":["supply","t"],', 'const startMap={"s-name":["name","t"],"s-supply":["supply","t"],"s-net":["net","t"],')
rep('WLZ: ${cableName(D.wlz.S,S.wlzM,S.supply==="3f"?3:1)}, L =', 'WLZ: ${wlzName(D)}, L =')
rep('${S.supply==="3f"?"3/N/PE ~ 400/230 V":"1/N/PE ~ 230 V"}',
    '${(S.supply==="3f"?"3":"1")+(S.net==="tnc"?"/PEN":"/N/PE")+(S.supply==="3f"?" ~ 400/230 V":" ~ 230 V")}')
rep('WLZ ${cableName(D.wlz.S,S.wlzM,S.supply==="3f"?3:1)}</text>', 'WLZ ${wlzName(D)}</text>')
rep('add("Aparaty","Ogranicznik przepięć SPD",`typ 1+2, ${f3?"3P+N":"1P+N"}, układ TN-S`,D.spdMod,1);',
    'add("Aparaty","Ogranicznik przepięć SPD",`typ 1+2, ${f3?"3P+N":"1P+N"}, układ TN-S${S.net==="tnc"?" (za podziałem PEN)":""}`,D.spdMod,1);')
rep('add("Osprzęt","Listwa zaciskowa N",`min. ${D.rows.length+3} zacisków`,"",1);',
    'add("Osprzęt","Listwa zaciskowa N0 (przed RCD)",`min. ${D.groups.length+3} zacisków`,"",1);\n'
    ' D.groups.filter(g=>g.kind==="rcd").forEach(g=>add("Osprzęt","Listwa zaciskowa N za RCD",`min. ${g.items.length+1} zacisków`,"",1));')
rep('cab[cableName(D.wlz.S,S.wlzM,f3?3:1)+" (WLZ)"]=(cab[cableName(D.wlz.S,S.wlzM,f3?3:1)+" (WLZ)"]||0)+S.wlzL;',
    'cab[wlzName(D)+" (WLZ)"]=(cab[wlzName(D)+" (WLZ)"]||0)+S.wlzL;')
rep("short:'Bilans mocy, dobór przewodów i zabezpieczeń, spadek napięcia, elewacja rozdzielnicy, schemat i zestawienie materiałów.'",
    "short:'Bilans mocy, dobór przewodów i zabezpieczeń, spadek napięcia, elewacja rozdzielnicy, schemat, połączenia przewodów i zestawienie materiałów.'")
rep("a na końcu elewacja rozdzielnicy, schemat jednokreskowy i zestawienie materiałów.", "a na końcu elewacja rozdzielnicy, schemat jednokreskowy, schemat połączeń przewodów i zestawienie materiałów.")
mod = open(os.path.join(os.path.dirname(__file__), "polaczenia.js"), encoding="utf-8").read()
rep("function update(){\n const D=compute();", mod + "function update(){\n const D=compute();")
rep("renderElev(D);renderSchem(D);renderBom(D);", "renderElev(D);renderSchem(D);renderPol(D);renderBom(D);")
open(p, "w", encoding="utf-8").write(s)
print("naniesiono, rozmiar", len(s.encode("utf-8")))
