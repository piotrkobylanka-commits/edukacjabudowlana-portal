#!/usr/bin/env python3
"""Poprawki merytoryczne kalkulatorów (audyt 31.10.2026).

Użycie: python3 _narzedzia/popraw-kalkulatory.py index.html
Nanosi poprawki z _narzedzia/poprawki-kalkulatory.json. Każdy fragment „stare”
musi wystąpić w pliku dokładnie raz; jeśli „nowe” już jest w pliku, poprawka
jest pomijana (skrypt można uruchomić wielokrotnie). Po zmianach sprawdza
składnię wszystkich skryptów strony (node --check). Robi kopię *.bak-kalk.
"""
import json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def check_js(page):
    bad = []
    for i, m in enumerate(re.finditer(r'<script(?![^>]*type="application/json")(?![^>]*\bsrc=)[^>]*>(.*?)</script>', page, re.S)):
        code = m.group(1)
        if not code.strip():
            continue
        with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
            f.write(code)
            p = f.name
        r = subprocess.run(['node', '--check', p], capture_output=True, text=True)
        os.unlink(p)
        if r.returncode:
            bad.append((i, r.stderr.strip().splitlines()[:4]))
    return bad


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
    page = open(path, encoding='utf-8').read()
    before = check_js(page)
    fixes = json.load(open(os.path.join(HERE, 'poprawki-kalkulatory.json'), encoding='utf-8'))['poprawki']
    done = skip = 0
    for f in fixes:
        if f['nowe'] in page:
            skip += 1
            continue
        n = page.count(f['stare'])
        if n != 1:
            sys.exit(f"STOP: fragment występuje {n}x ({f['kalk']}): {f['opis'][:90]}")
        page = page.replace(f['stare'], f['nowe'])
        done += 1
    after = check_js(page)
    if len(after) > len(before):
        sys.exit(f'STOP: błąd składni po poprawkach: {after}')
    if done:
        open(path + '.bak-kalk', 'w', encoding='utf-8').write(open(path, encoding='utf-8').read())
        open(path, 'w', encoding='utf-8').write(page)
    print(f'Naniesiono {done} poprawek, pominięto {skip} (już były). Składnia skryptów OK.')


if __name__ == '__main__':
    main()
