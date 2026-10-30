// Druga poprawka programu PRO „Beton: dojrzewanie i rozszalowanie” (#narzedzia/pro-beton).
// Nakładać PO popraw-pro-beton.js (wymaga jego zmian w funkcji calc()).
//
// Użycie (w folderze ze stroną):
//   node popraw-pro-beton-2.js index.html
// Robi kopię index.html.bak-probeton2, podmienia fragmenty i przerywa bez zmian,
// jeśli któregoś fragmentu nie znajdzie dokładnie raz. Drugie uruchomienie nic nie zmienia.

const fs = require('fs');
const file = process.argv[2] || 'index.html';
let src = fs.readFileSync(file, 'utf8');

const fixes = [
  {
    opis: '1. Klasy ekspozycji: wartości z krajowego uzupełnienia PN-B-06265 (wcześniej zalecenia załącznika F PN-EN 206, przez co np. ława C20/25 w XC2 była błędnie oznaczana jako niezgodna)',
    stare: "const EXP = {XC1: ['XC1 – wewnątrz, sucho', 'C20/25', .65], XC2: ['XC2 – mokro, rzadko sucho (fundamenty)', 'C25/30', .60], XC3: ['XC3 – umiarkowana wilgotność', 'C30/37', .55], XC4: ['XC4 – cykliczne zawilgocenie (na zewnątrz)', 'C30/37', .50], XF1: ['XF1 – mróz, umiarkowane nasycenie wodą', 'C30/37', .55], XF3: ['XF3 – mróz, duże nasycenie (bez soli)', 'C30/37', .50]};",
    nowe: "const EXP = {XC1: ['XC1 – wewnątrz, sucho', 'C16/20', .70], XC2: ['XC2 – mokro, rzadko sucho (fundamenty)', 'C16/20', .65], XC3: ['XC3 – umiarkowana wilgotność', 'C20/25', .60], XC4: ['XC4 – cykliczne zawilgocenie (na zewnątrz)', 'C25/30', .55], XF1: ['XF1 – mróz, umiarkowane nasycenie wodą', 'C30/37', .55], XF3: ['XF3 – mróz, duże nasycenie (bez soli)', 'C30/37', .50, 'min. 4% (zależnie od uziarnienia: 4,0–5,5%)'], XF4: ['XF4 – mróz i sole odladzające (podjazd, schody zewnętrzne)', 'C30/37', .45, 'min. 4% (zależnie od uziarnienia: 4,0–5,5%)']};",
  },
  {
    opis: '2. Tempo przyrostu do pielęgnacji wg rodzaju cementu (PN-EN 13670, zał. F): CEM N to przyrost średni, CEM III wolny. Wzór z PN-EN 1992-1-1 dawał dla obu klasę o stopień szybszą, przez co pielęgnacja wychodziła za krótka',
    stare: "dev = r2 >= .5 ? 'szybki' : r2 >= .3 ? 'średni' : r2 >= .15 ? 'wolny' : 'bardzo wolny';",
    nowe: "dev = {R: 'szybki', N: 'średni', S: 'wolny'}[st.cem] || 'średni';",
  },
  {
    opis: '3. Poniżej +5 °C czas pielęgnacji wydłuża się o czas, w którym temperatura jest niższa niż 5 °C (PN-EN 13670, zał. F)',
    stare: 'cure = curTab[dev][ci];',
    nowe: 'cure0 = curTab[dev][ci]; let cure = 0, cacc = 0; while (cacc < cure0 && cure < days) { if (tempAt(Math.floor(cure)) >= 5) cacc += .5; cure += .5; } if (cacc < cure0) cure = null;',
  },
  {
    opis: '3b. Zmienna cure jest teraz liczona w pętli (deklaracja przeniesiona)',
    stare: 'const ci = tAvg >= 25 ? 0 : tAvg >= 15 ? 1 : tAvg >= 10 ? 2 : 3, cure0',
    nowe: 'const ci = tAvg >= 25 ? 0 : tAvg >= 15 ? 1 : tAvg >= 10 ? 2 : 3, cure0',
    pomin: true,
  },
  {
    opis: '4. Opis cementu wolnego: CEM II/B-S 42,5N ma przyrost średni, wolny ma CEM III',
    stare: "S: ['CEM III 32,5N, CEM II/B-S (wolny)', .38]",
    nowe: "S: ['CEM III/A 32,5N lub 42,5N (wolny)', .38]",
  },
  {
    opis: '5. Liczba betonowozów liczona z zapasem 4% (wcześniej bez zapasu, choć tabela zaleca +3–5%)',
    stare: "mix = Math.ceil(V / Math.max(n('gruszka'), 1))",
    nowe: "mix = Math.ceil(V * 1.04 / Math.max(n('gruszka'), 1) - 1e-9)",
  },
  {
    opis: '6. Zamówienie: napowietrzenie dla XF3/XF4 i poprawna podstawa (PN-B-06265)',
    stare: "['Maks. w/c', PX.fx(r.X[2], 2)],",
    nowe: "['Maks. w/c', PX.fx(r.X[2], 2)], ...(r.X[3] ? [['Napowietrzenie', r.X[3]]] : []),",
  },
  {
    opis: '7. Podpis tabeli zamówienia: źródło wartości granicznych',
    stare: 'Minimalne klasy betonu i w/c dla ekspozycji wg PN-EN 206 (załącznik krajowy F).',
    nowe: 'Minimalne klasy betonu i w/c dla ekspozycji wg PN-EN 206 z krajowym uzupełnieniem PN-B-06265.',
  },
  {
    opis: '8. Opis podstaw programu: krajowe uzupełnienie',
    stare: 'PN-EN 206 (klasy ekspozycji). Progi rozszalowania',
    nowe: 'PN-EN 206 z krajowym uzupełnieniem PN-B-06265 (klasy ekspozycji). Progi rozszalowania',
  },
  {
    opis: '9. Element zewnętrzny: domyślnie XF4 (podjazdy i schody zewnętrzne są zwykle posypywane solą)',
    stare: "['Pełne obciążenie', 1, 'fck']], 'XF1', 'C30'],",
    nowe: "['Pełne obciążenie', 1, 'fck']], 'XF4', 'C30'],",
  },
];

// zmiany zależne od wyniku pielęgnacji (cure może być null = > 56 dni)
const fixesOut = [
  {
    opis: '10. KPI pielęgnacji przy cure = null',
    stare: "{l: 'Pielęgnacja', v: PX.fx(r.cure, 1), u: 'dni min.', s: `orientacyjnie, przyrost ${r.dev}`}",
    nowe: "{l: 'Pielęgnacja', v: r.cure == null ? '> 56' : PX.fx(r.cure, 1), u: 'dni min.', s: r.cure == null ? 'temperatura stale < +5 °C: ogrzewanie i osłona' : r.cure > r.cure0 ? `w tym ${PX.fx(r.cure - r.cure0, 1)} dn. poniżej +5 °C` : `orientacyjnie, przyrost ${r.dev}`, st: r.cure == null ? 'bad' : ''}",
  },
  {
    opis: '11. Zwracana wartość cure0',
    stare: 'return {fck, fcm, s, curve, ck, mile, frost, r2, dev, cure, T,',
    nowe: 'return {fck, fcm, s, curve, ck, mile, frost, r2, dev, cure, cure0, T,',
  },
];

const all = fixes.filter(f => !f.pomin).concat(fixesOut);
let done = 0;
for (const f of all) {
  const nOld = src.split(f.stare).length - 1, nNew = src.split(f.nowe).length - 1;
  if (nNew >= 1) { f.juz = true; continue; }
  if (nOld !== 1) { console.error(`STOP – fragment znaleziony ${nOld} razy (oczekiwano 1): ${f.opis}`); process.exit(1); }
}
fs.writeFileSync(file + '.bak-probeton2', src, 'utf8');
for (const f of all) {
  if (f.juz) { console.log('JUŻ ' + f.opis); continue; }
  src = src.replace(f.stare, f.nowe); done++;
  console.log('OK  ' + f.opis);
}
fs.writeFileSync(file, src, 'utf8');
console.log(`\nZmieniono ${done} fragmentów w ${file} (kopia: ${file}.bak-probeton2).`);
