#!/usr/bin/env python3
"""Kalkulator „Ile bloczków na ściany” – wersja 2 (31.10.2026).

Użycie: python3 _narzedzia/popraw-bloczki-otwory.py index.html

Podmienia moduł MUR w index.html na _narzedzia/bloczki/mur_v2.js:
- ustawianie otworów na rysunku ściany (przeciąganie, uchwyty rozmiaru,
  klawiatura, wybór ściany obwodu, parapet, przyciąganie do modułu, gotowe
  rozmiary), kontrola kolizji, naroży, filarków i nadproży, lista nadproży;
- poprawka wieńca (tylko ściany nośne, tyle wieńców, ile kondygnacji);
- poprawione dane produktów (karty producentów, październik 2026).
Obrazki przykładów (MUIMG) i rodzajów dachu (ROOFIMG) przenosi z bieżącej
strony. Style dodaje jako <style id="mu-v2-css"> (podmienia, jeśli już jest).
Skrypt można uruchamiać wielokrotnie. Robi kopię *.bak-bloczki i sprawdza
składnię wszystkich skryptów strony (node --check).
"""
import os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from importlib import util
spec = util.spec_from_file_location('pk', os.path.join(HERE, 'popraw-kalkulatory.py'))
pk = util.module_from_spec(spec); spec.loader.exec_module(pk)

START = 'const MUR = (() => {'
NEXT = '\n/* ---------- '


def images(mod, name):
    i = mod.index(f'const {name} = {{')
    j = mod.index('};', i)
    return dict(re.findall(r"(\w+):'(data:image/[^']+)'", mod[i:j]))


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
    page = open(path, encoding='utf-8').read()
    if page.count(START) != 1:
        sys.exit(f'STOP: początek modułu MUR występuje {page.count(START)}x')
    s = page.index(START)
    e = page.index(NEXT, s + 100)
    old = page[s:e]
    new = open(os.path.join(HERE, 'bloczki', 'mur_v2.js'), encoding='utf-8').read().rstrip('\n')
    for name in ('MUIMG', 'ROOFIMG'):
        img = images(old, name)
        i = new.index(f'const {name} = {{')
        j = new.index('};', i)
        blk = new[i:j]
        keys = re.findall(r"(\w+):'DATAURI'", blk)
        miss = [k for k in keys if k not in img]
        if miss:
            sys.exit(f'STOP: brak obrazków {name}: {miss}')
        for k in keys:
            blk = blk.replace(f"{k}:'DATAURI'", f"{k}:'{img[k]}'")
        new = new[:i] + blk + new[j:]
    if 'DATAURI' in new:
        sys.exit('STOP: zostały puste obrazki')
    before = pk.check_js(page)
    page = page[:s] + new + page[e:]
    css = open(os.path.join(HERE, 'bloczki', 'mu-v2.css'), encoding='utf-8').read().strip()
    tag = f'<style id="mu-v2-css">\n{css}\n</style>'
    m = re.search(r'<style id="mu-v2-css">.*?</style>', page, re.S)
    if m:
        page = page[:m.start()] + tag + page[m.end():]
    else:
        k = page.index('/* Kalkulator: ile bloczków */')
        k = page.index('</style>', k) + len('</style>')
        page = page[:k] + '\n' + tag + page[k:]
    after = pk.check_js(page)
    if len(after) > len(before):
        sys.exit(f'STOP: błąd składni po zmianie: {after}')
    open(path + '.bak-bloczki', 'w', encoding='utf-8').write(open(path, encoding='utf-8').read())
    open(path, 'w', encoding='utf-8').write(page)
    print(f'Kalkulator bloczków v2 naniesiony ({len(old)} → {len(new)} znaków modułu). Składnia skryptów OK.')


if __name__ == '__main__':
    main()
