// Poprawka programu PRO „Beton: dojrzewanie i rozszalowanie” (edukacjabudowlana.eu, #narzedzia/pro-beton)
//
// Użycie (w folderze ze stroną):
//   node popraw-pro-beton.js index.html
// Skrypt robi kopię index.html.bak-probeton, podmienia 5 fragmentów funkcji calc()
// i przerywa bez zmian, jeśli któregoś fragmentu nie znajdzie dokładnie raz.

const fs = require('fs');
const file = process.argv[2] || 'index.html';
let src = fs.readFileSync(file, 'utf8');

const fixes = [
  {
    opis: '1. Poniżej 0 °C beton nie przyrasta (wcześniej przy −5 °C „osiągał” 5 MPa po 5 dniach)',
    stare: 'te += Math.exp(-(4000 / (273 + t) - 13.65)) * 1;',
    nowe: 'te += t > 0 ? Math.exp(-(4000 / (273 + t) - 13.65)) * 1 : 0;',
  },
  {
    opis: '2. fck(t) = fck dopiero po 28 dniach wieku skorygowanego temperaturą (wcześniej skok do fck w 28. dniu kalendarzowym, nawet w mrozie)',
    stare: 'p[0] >= 28 ? Math.max(fck, p[1] - 8)',
    nowe: '(eq[p[0] - 1] || 0) >= 27.5 ? Math.max(fck, p[1] - 8)',
  },
  {
    opis: '3. Wskaźnik r = fcm,2 / fcm,28 przy 20 °C z wartości średnich (wcześniej z charakterystycznych i przy realnej temperaturze – temperatura liczona podwójnie)',
    stare: 'r2 = fAt(2) / Math.max(fAt(28), 1);',
    nowe: 'r2 = Math.exp(s * (1 - Math.sqrt(14)));',
  },
  {
    opis: '4. Pielęgnacja – przyrost szybki wg PN-EN 13670, zał. F, klasa 2',
    stare: '{szybki: [1, 1.5, 2, 3],',
    nowe: '{szybki: [1, 1, 1.5, 2],',
  },
  {
    opis: '5. Pielęgnacja – przyrost wolny, 5–10 °C: 11 dni wg PN-EN 13670, zał. F, klasa 2',
    stare: 'wolny: [2.5, 5, 8, 10],',
    nowe: 'wolny: [2.5, 5, 8, 11],',
  },
];

for (const f of fixes) {
  const n = src.split(f.stare).length - 1;
  if (n !== 1) {
    console.error(`STOP – fragment znaleziony ${n} razy (oczekiwano 1): ${f.opis}`);
    process.exit(1);
  }
}

fs.writeFileSync(file + '.bak-probeton', src, 'utf8');
for (const f of fixes) {
  src = src.replace(f.stare, f.nowe);
  console.log('OK  ' + f.opis);
}
fs.writeFileSync(file, src, 'utf8');
console.log(`\nZapisano ${file} (kopia: ${file}.bak-probeton). Wgraj plik na serwer.`);
