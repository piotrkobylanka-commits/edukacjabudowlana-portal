// Poprawki merytoryczne kalkulatorów (audyt 31.10.2026) – wersja dla Node.
// Użycie (w folderze ze stroną, obok pliku poprawki-kalkulatory.json):
//   node popraw-kalkulatory.js index.html
// Każdy fragment „stare” musi wystąpić dokładnie raz; jeśli „nowe” już jest w pliku,
// poprawka jest pomijana. Robi kopię index.html.bak-kalk.
const fs = require('fs'), path = require('path');
const file = process.argv[2] || 'index.html';
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'poprawki-kalkulatory.json'), 'utf8'));
let src = fs.readFileSync(file, 'utf8'), done = 0, skip = 0;
for (const f of data.poprawki) {
  if (src.includes(f.nowe)) { skip++; continue; }
  const n = src.split(f.stare).length - 1;
  if (n !== 1) { console.error(`STOP – fragment występuje ${n} razy (${f.kalk}): ${f.opis.slice(0, 90)}`); process.exit(1); }
}
fs.writeFileSync(file + '.bak-kalk', src, 'utf8');
for (const f of data.poprawki) {
  if (src.includes(f.nowe)) continue;
  src = src.replace(f.stare, () => f.nowe); done++;
}
fs.writeFileSync(file, src, 'utf8');
console.log(`Naniesiono ${done} poprawek, pominięto ${skip}. Kopia: ${file}.bak-kalk`);
