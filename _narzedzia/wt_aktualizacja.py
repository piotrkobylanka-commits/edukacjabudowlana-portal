#!/usr/bin/env python3
"""Aktualizacja odwołań do warunków technicznych (stan prawny 30.10.2026).

Użycie: python3 _narzedzia/wt_aktualizacja.py WEJŚCIE.html WYJŚCIE.html [raport.json]

Działa na dowolnej wersji index.html portalu (artefakt, serwer, repozytorium):
1. Oznacza artykuły powołujące się na rozporządzenie WT z 2002 r. (pole law: "wt")
   i na rozporządzenie o warunkach technicznych użytkowania budynków mieszkalnych
   z 1999 r. (pole law: "wtu").
2. Dopisuje do źródeł tych artykułów pozycję o stanie prawnym.
3. Nanosi poprawki zdań z _narzedzia/poprawki-wt.json (każda musi pasować dokładnie raz).
4. Podmienia funkcję wtNote (ramka „Stan prawny” nad treścią artykułu).
Skrypt jest idempotentny: drugi przebieg niczego nie zmienia.
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
DATA_RX = re.compile(r'(<script id="data" type="application/json">)(.*?)(</script>)', re.S)

# --- wykrywanie ---------------------------------------------------------------
NOT_WT = r'(?!\s*(?:wykonania|Wykonania|budowli|dla budowli|użytkowania|przyłącz|dostaw|zabudowy|sieci|odbioru))'
NORM_WT = re.compile(r'^(?:Warunki [Tt]echniczne' + NOT_WT + r'|Rozporządzenie w sprawie warunków technicznych(?!.*(?:użytkowania|WT 2026))'
                     r'|Rozporządzenie Ministra Infrastruktury z 12 kwietnia 2002|WT\b(?!A)|Załącznik nr 2 do WT)')
NORM_WTU = re.compile(r'użytkowania budynków mieszkalnych')
HTML_WT = re.compile(
    r'WT ?20(?:02|21)\b|WT2021|\bWT\b(?![A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż])'
    r'|Warunk\w* Techniczn\w*(?!\w)' + NOT_WT +
    r'|warunk\w* techniczn\w*,? jakim powinny'
    r'|warunk\w* techniczn\w* z (?:12 kwietnia )?2002'
    r'|warunki techniczne wymagają|wymagają warunki techniczne|z warunkami technicznymi|warunkami technicznymi \(WT'
    r'|Dz\.\s?U\.\s?(?:z\s)?2022\s?r?\.?\s?poz\.\s?1225')
SRC_WT = re.compile(r'Warunki [Tt]echniczne' + NOT_WT + r'|warunków technicznych, jakim powinny|poz\.\s?1225|Załącznik nr 2 do WT|\bWT\b(?!A)')
PROJECT_ONLY = re.compile(r'WT 2026|nowych warunków technicznych|projekt\w* (?:nowych )?(?:warunków|rozporządzenia)', re.I)

MARK = 'Stan prawny na 30.10.2026'
SRC_LI_WT = ('<li>' + MARK + ': rozporządzenie Ministra Infrastruktury z 12 kwietnia 2002 r. w sprawie warunków technicznych, '
             'jakim powinny odpowiadać budynki i ich usytuowanie (t.j. Dz.U. 2022 poz. 1225 ze zm.) zostało uznane za uchylone '
             'we wrześniu 2026 r. (art. 66 ustawy z 19 lipca 2019 r. o zapewnianiu dostępności osobom ze szczególnymi potrzebami); '
             'stosowanie przejściowe do 20.03.2028 r.: art. 102a–102b Prawa budowlanego (ustawa z 31 lipca 2026 r., Dz.U. 2026 poz. 1161).</li>')
SRC_LI_WTU = ('<li>' + MARK + ': rozporządzenie Ministra Spraw Wewnętrznych i Administracji z 16 sierpnia 1999 r. w sprawie '
              'warunków technicznych użytkowania budynków mieszkalnych (Dz.U. 1999 nr 74 poz. 836 ze zm.) zostało uznane za uchylone '
              'we wrześniu 2026 r.; stosowanie przejściowe do 20.03.2028 r.: art. 102c Prawa budowlanego (Dz.U. 2026 poz. 1161).</li>')

WTNOTE_JS = r"""function wtNote(a){
  const law = a.law || [];
  if (!law.length) return '';
  const p = [];
  if (law.includes('wt')) p.push('Rozporządzenie z 12 kwietnia 2002 r. w sprawie warunków technicznych, jakim powinny odpowiadać budynki i ich usytuowanie (WT, z wymaganiami energetycznymi nazywanymi „WT 2021”), przestało obowiązywać we wrześniu 2026 r., a nowe nie zostało jeszcze ogłoszone. Do 20 marca 2028 r. projekt do pozwolenia na budowę lub zgłoszenia budowy można przygotować według dotychczasowych WT, jeśli inwestor złoży w urzędzie oświadczenie (art. 102a Prawa budowlanego). Roboty, które nie wymagają pozwolenia ani zgłoszenia, wykonuje się według nich bez oświadczenia (art. 102b). Pozwolenie lub zgłoszenie sprzed 20 września 2026 r. zachowuje ważność, a budowę prowadzi się zgodnie z zatwierdzonym projektem. Przy innych robotach na zgłoszenie (art. 29 ust. 3) przepisy przejściowe nie są jednoznaczne, więc podejście warto ustalić z projektantem i urzędem.');
  if (law.includes('wtu')) p.push('Rozporządzenie z 16 sierpnia 1999 r. w sprawie warunków technicznych użytkowania budynków mieszkalnych' + (law.includes('wt') ? ' również' : '') + ' przestało obowiązywać. Do 20 marca 2028 r. utrzymanie i użytkowanie budynków mieszkalnych może się opierać na dotychczasowych przepisach (art. 102c Prawa budowlanego), a obowiązkowe kontrole z art. 62 Prawa budowlanego się nie zmieniły.');
  if (law.includes('wt')) p.push('Paragrafy i wartości z WT podane w artykule pochodzą z dotychczasowego rozporządzenia.');
  return `<aside class="law-note" role="note"><b>⚖️ Stan prawny na 30 października 2026 r.</b><span>${p.join(' ')}</span></aside>`;
}"""


def law_flags(a):
    f = []
    norms = a.get('norms') or []
    src = a.get('sources') or ''
    html = a.get('html') or ''
    wt = any(NORM_WT.search(n) for n in norms) or bool(SRC_WT.search(src)) or bool(HTML_WT.search(html))
    if wt and not any(NORM_WT.search(n) for n in norms) and not SRC_WT.search(src):
        # tylko w treści: pomiń artykuły mówiące wyłącznie o projekcie nowych WT
        hits = [m.group(0) for m in HTML_WT.finditer(html)]
        if hits and all(PROJECT_ONLY.search(h) for h in hits):
            wt = False
    if wt:
        f.append('wt')
    if any(NORM_WTU.search(n) for n in norms) or NORM_WTU.search(src) or NORM_WTU.search(html):
        f.append('wtu')
    return f


def add_sources(a):
    src = a.get('sources') or ''
    if MARK in src:
        return False
    lis = ''
    if 'wt' in a['law']:
        lis += SRC_LI_WT
    if 'wtu' in a['law']:
        lis += SRC_LI_WTU
    if not lis:
        return False
    i = src.rfind('</ul>')
    a['sources'] = src[:i] + lis + src[i:] if i >= 0 else src + '<ul>' + lis + '</ul>'
    return True


def apply_fixes(by_slug, fixes, report):
    for fx in fixes:
        a = by_slug.get(fx['slug'])
        if not a:
            report['brak_artykulu'].append(fx['slug']); continue
        pole = fx.get('pole', 'html')
        if pole == 'norms':
            if fx['nowy'] in a['norms']:
                continue
            if fx['stary'] not in a['norms']:
                sys.exit(f"Norma nie znaleziona w {fx['slug']}: {fx['stary']}")
            a['norms'] = [fx['nowy'] if n == fx['stary'] else n for n in a['norms']]
        else:
            txt = a.get(pole) or ''
            if fx['nowy'] in txt and fx['stary'] not in txt:
                continue  # już naniesione
            n = txt.count(fx['stary'])
            if n != 1:
                sys.exit(f"Poprawka pasuje {n}x w {fx['slug']}/{pole}: {fx['stary'][:80]}")
            a[pole] = txt.replace(fx['stary'], fx['nowy'])
        report['poprawki'].append(fx['slug'])


def patch_js(page):
    i = page.find('function wtNote(a){')
    if i < 0:
        # brak funkcji: dodaj ją i wywołanie przed treścią artykułu
        anchor = 'function viewArticle(slug){'
        j = page.find(anchor)
        if j < 0:
            sys.exit('Nie znaleziono viewArticle')
        page = page[:j] + WTNOTE_JS + '\n' + page[j:]
        page = page.replace('<article><div class="prose">${a.html}</div>', '<article>${wtNote(a)}<div class="prose">${a.html}</div>', 1)
        if '${wtNote(a)}' not in page:
            sys.exit('Nie udało się wstawić wywołania wtNote')
    else:
        j = page.find('\nfunction ', i + 10)
        page = page[:i] + WTNOTE_JS + page[j:]
    if '.law-note{' not in page:
        css = ('.law-note{display:grid;gap:4px;margin:0 0 26px;padding:14px 16px;border:1px solid var(--orange);'
               'border-left:4px solid var(--orange);border-radius:10px;background:var(--orange-soft);color:var(--ink);'
               'font-size:14.5px;line-height:1.55;max-width:46em}.law-note b{font-weight:700}\n')
        page = page.replace('</style>', css + '</style>', 1)
    return page


def main():
    src, dst = sys.argv[1], sys.argv[2]
    rep_path = sys.argv[3] if len(sys.argv) > 3 else None
    page = open(src, encoding='utf-8').read()
    m = DATA_RX.search(page)
    raw = m.group(2)
    d = json.loads(raw.replace('<\\/', '</'))
    if json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') != raw:
        sys.exit('Zapis danych w pliku różni się od oczekiwanego formatu – przerwano')
    fixes = json.load(open(os.path.join(HERE, 'poprawki-wt.json'), encoding='utf-8'))['poprawki']
    by_slug = {a['slug']: a for a in d['articles']}
    report = {'poprawki': [], 'brak_artykulu': [], 'wt': [], 'wtu': [], 'zrodla': 0}
    apply_fixes(by_slug, fixes, report)
    for a in d['articles']:
        a['law'] = law_flags(a)
        if 'wt' in a['law']: report['wt'].append(a['slug'])
        if 'wtu' in a['law']: report['wtu'].append(a['slug'])
        if add_sources(a): report['zrodla'] += 1
    out = json.dumps(d, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    page = page[:m.start(2)] + out + page[m.end(2):]
    page = patch_js(page)
    open(dst, 'w', encoding='utf-8').write(page)
    print(f"artykuły z WT 2002: {len(report['wt'])}, z WT użytkowania 1999: {len(report['wtu'])}, "
          f"dopisane źródła: {report['zrodla']}, poprawki: {len(report['poprawki'])} w {len(set(report['poprawki']))} art., "
          f"brak artykułu: {sorted(set(report['brak_artykulu']))}")
    if rep_path:
        json.dump(report, open(rep_path, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
