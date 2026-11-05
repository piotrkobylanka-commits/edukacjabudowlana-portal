#!/usr/bin/env python3
"""Usuwa z artykułów pozostałości interfejsu Facebooka.

Użycie: python3 _narzedzia/usun-resztki-fb.py index.html

Usuwa napis „Wyświetl mniej” na końcu akapitu lub punktu listy oraz samotny
akapit „1” na samym końcu treści artykułu. Skrypt można uruchamiać wielokrotnie.
Reszta pliku zostaje bez zmian.
"""
import json
import re
import sys

TAG = '<script id="data" type="application/json">'
sciezka = sys.argv[1]
strona = open(sciezka, encoding="utf-8", newline="").read()
start = strona.index(TAG) + len(TAG)
koniec = strona.index("</script>", start)
surowe = strona[start:koniec]
przed = json.loads(surowe)

nowe, napisy = re.subn(r"[ \t]*Wyświetl mniej(?=<\\/(?:p|li)>)", "", surowe)
nowe, jedynki = re.subn(r'\\n<p>1<\\/p>(?=","(?:toc|sources)")', "", nowe)
po = json.loads(nowe)

assert len(przed["articles"]) == len(po["articles"])
for a, b in zip(przed["articles"], po["articles"]):
    assert (a["slug"], a["title"]) == (b["slug"], b["title"])
    assert {k: v for k, v in a.items() if k != "html"} == {k: v for k, v in b.items() if k != "html"}
assert "Wyświetl mniej" not in nowe

zmienione = sum(a != b for a, b in zip(przed["articles"], po["articles"]))
open(sciezka, "w", encoding="utf-8", newline="").write(strona[:start] + nowe + strona[koniec:])
print(f"napisy: {napisy}, samotne „1”: {jedynki}, zmienione artykuły: {zmienione}")
