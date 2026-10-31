# Raport E – uziom, kanal, planer rozdzielnicy, dzialka (31.10.2026)

Metoda: kod obliczeń wycięty z `index.html` (pliki `pro_*.js` są z nim identyczne), uruchomiony w Node z atrapą `PX`. Uziomy dodatkowo sprawdzone niezależnym obliczeniem numerycznym (metoda elementów brzegowych, grunt jednorodny z odbiciem zwierciadlanym; 168 konfiguracji: budynki 8×8, 10×8, 12×10, 20×12 m, pręty 2–6 m, 1–30 szt.). Wszystkie poprawki zastosowano na kopii `E/index_fixed.html`; wszystkie 4 bloki `<script>` przechodzą `node --check`, a kalkulatory po poprawkach uruchomiono ponownie (wyniki niżej). Każdy fragment `stare` występuje w `index.html` dokładnie raz, także przy kolejnym stosowaniu poprawek.

Uwaga: limit wyszukiwań w sesji został wyczerpany w trakcie pracy. Część ustaleń (N SEP-E-002, strefy przemarzania PN-B-03020) nie ma dwóch niezależnych potwierdzeń i jest opisana w „Wątpliwe”.

## Podsumowanie

| Kalkulator | KRYTYCZNY | ISTOTNY | DROBNY |
|---|---|---|---|
| uziom | 0 | 1 | 1 |
| kanal | 0 | 2 | 1 |
| planer (Projekt rozdzielnicy) | 0 | 2 | 2 |
| dzialka | 0 | 2 | 2 |

Liczba poprawek w `poprawki_E.json`: 18. Jeden błąd bywa rozbity na kilka podmian.

---

## 1. PRO `uziom` – rezystancja uziemienia

### Sprawdzone i poprawne
- Wzory pojedynczych uziomów pokrywają się z tablicą 5.5.1 poradnika DEHN: otok R = 2ρ/(3D), D = 1,13√A; taśma R = 2ρ/L. Pręt ρ/(2πL)·ln(4L/d) to wzór Dwighta bez członu −1, więc wynik jest **zawyżony o ok. 10–16%**, czyli bezpieczny. Obliczenie numeryczne dla pręta 3 m dało 69 Ω, program 76 Ω.
- Fundamentowy 2ρ/(πD): numerycznie 10,3 Ω, program 11,6 Ω (bezpiecznie o 12%). Taśma 10 m: numerycznie 30 Ω, program 45 Ω (bezpiecznie).
- Cel 10 Ω dla LPS to wartość zalecana w PN-EN 62305-3 (Inżynier Budownictwa). Rezystywności z listy są równe albo wyższe od typowych (glina 100 wobec ok. 50, torf 50 wobec 20–30 Ω·m), więc wynik wychodzi bezpiecznie. Mnożnik sezonowy ×1,5 mieści się w podawanym zakresie 0,8–1,5. DEHN potwierdza wysychanie i przemarzanie warstwy przypowierzchniowej.
- Zalecenie odstępu prętów ≥ długości pręta jest zgodne z DEHN. Opis „decyduje pomiar” jest poprawny.

### Błędy
**U1. Łączenie kilku uziomów zaniża wynik (ISTOTNY).** Program liczy sumę równoległą ×1,15 i współczynnik η, który zależy tylko od a/L i n. Pręty rozmieszcza jednak na obwodzie otoku 1 m od budynku, więc przy wielu prętach rzeczywisty odstęp jest dużo mniejszy od wpisanego, a wszystkie elektrody leżą w jednym obrysie. Rezystancja takiego układu nie może spaść poniżej rezystancji płyty o tym obrysie, ρ/(4r) (wzór Laurenta, ten sam człon co w IEEE 80/Sverak). Według obliczeń numerycznych program zaniża wynik:
- fundament 12×10 m + 8 prętów 3 m, ρ = 300 Ω·m: program 9,4 Ω („spełnia 10 Ω”), numerycznie 10,9 Ω (**−13%**);
- 12 prętów: program 7,7 Ω, numerycznie 10,1 Ω (**−23%**);
- najgorszy przypadek (30 prętów 6 m): **−65%**;
- fundamentowy + otokowy przy ρ = 300: program 9,1 Ω, numerycznie 10,3 Ω.

Program podpowiada wtedy zbyt małą liczbę prętów albo uznaje, że otok wystarczy. DEHN wprost ostrzega, że rzeczywista rezystancja łączona jest wyższa od równoległej.
Poprawka: dolne ograniczenie ρ/(4r)/(1 + 0,2·(L+0,5)/r), gdzie r = √((A+2)(B+2)/π), oraz odstęp efektywny min(a, obwód otoku/n). Po poprawce, w tych samych 168 konfiguracjach, najgorszy błąd to −14%, wobec −65% wcześniej. Tylko 7 ze 168 przypadków jest zaniżonych o więcej niż 10%, wcześniej 82. Wyniki domyślne się nie zmieniają (11,6 Ω, propozycja 3 prętów, 9,8 Ω). Taśma promieniowa wychodzi poza obrys, więc pozostaje dołączana równolegle.

**U2. Brak kontroli danych (DROBNY).** Pręt o długości poniżej d/4 (np. 0,004 m) daje ujemną rezystancję i komunikat „spełnia cel”. Wymiar budynku 0 daje komunikat „Zaznacz co najmniej jeden rodzaj uziomu”. Poprawka wprowadza minimum A, B ≥ 1 m, L ≥ 0,5 m, d ≥ 10 mm.

### Poprawki (kod)

**Poprawka uziom-1 (ISTOTNY)** – Łączenie uziomów: suma równoległa ×1,15 i współczynnik η nie uwzględniają wzajemnego oddziaływania uziomów w tym samym obrysie (fundamentowy + otokowy + wiele prętów na obwodzie). Przy wielu prętach wynik jest zaniżony do 50–65% względem obliczenia numerycznego, a program może pokazać „spełnia 10 Ω”, gdy rzeczywista rezystancja jest wyższa. Dodano dolne ograniczenie rezystancją płyty o obrysie układu ρ/(4r) (wzór Laurenta) oraz rzeczywisty odstęp prętów na obwodzie otoku.

stare:
```js
R.r1 = rRod(rho, Lr, dr); R.pret = R.r1 / (nr * eta(nr, ar, Lr)); R.tasma = 2 * rho / Math.max(Lt, .5);
  const comb = [st.u_fund && R.fund, st.u_otok && R.otok, st.u_pret && R.pret, st.u_tasma && R.tasma].filter(Boolean);
  const Rtot = comb.length ? 1 / comb.reduce((s, x) => s + 1 / x, 0) * (comb.length > 1 ? 1.15 : 1) : Infinity;
  const other = [st.u_fund && R.fund, st.u_otok && R.otok, st.u_tasma && R.tasma].filter(Boolean), par = arr => arr.length ? 1 / arr.reduce((s, x) => s + 1 / x, 0) * (arr.length > 1 ? 1.15 : 1) : Infinity;
  let needN = null; if (par(other) <= target) needN = 0; else for (let k = 1; k <= 30; k++){ if (par([...other, R.r1 / (k * eta(k, ar, Lr))]) <= target){ needN = k; break; } }
  const otokOk = !st.u_otok && par([...other, R.otok]) <= target;
  const needL = (() => { for (let L = 1; L <= 60; L += .5) if (rRod(rho, L, dr) <= target) return L; return null; })();
  const curve = Array.from({length: 12}, (_, i) => [i + 1, R.r1 / ((i + 1) * eta(i + 1, ar, Lr))]), curve2 = other.length ? Array.from({length: 12}, (_, i) => [i + 1, par([...other, R.r1 / ((i + 1) * eta(i + 1, ar, Lr))])]) : null;
  const Rother = par(other); return {rho0, rho, target, A, B, P, D, R, Rtot, comb, needN, needL, curve, Lr, nr, ar, Lt, dr, Rother, otokOk, curve2, withN: k => par([...other, R.r1 / (k * eta(k, ar, Lr))])};
```
nowe:
```js
R.r1 = rRod(rho, Lr, dr); R.tasma = 2 * rho / Math.max(Lt, .5);
  // uziomy blisko siebie: układ nie może mieć mniejszej rezystancji niż płyta o obrysie uziomów, ρ/(4·r), r = √(pole/π) (wzór Laurenta); pręty rozstawione na obwodzie otoku
  const rE = Math.sqrt((A + 2) * (B + 2) / Math.PI), flR = rho / (4 * rE) / (1 + .2 * (Lr + .5) / rE), rodsR = k => k > 1 ? Math.max(R.r1 / (k * eta(k, Math.min(ar, 2 * (A + B + 4) / k), Lr)), flR) : R.r1;
  R.pret = rodsR(nr);
  const p0 = arr => arr.length ? 1 / arr.reduce((s, x) => s + 1 / x, 0) * (arr.length > 1 ? 1.15 : 1) : Infinity, fo = [st.u_fund && R.fund, st.u_otok && R.otok].filter(Boolean);
  const sys = (f, rr) => { const c = rr ? [...f, rr] : f; let x = p0(c); if (c.length > 1) x = Math.max(x, rr ? flR : rho / (4 * rE)); return st.u_tasma ? p0([x, R.tasma].filter(isFinite)) : x; };
  const comb = [st.u_fund && R.fund, st.u_otok && R.otok, st.u_pret && R.pret, st.u_tasma && R.tasma].filter(Boolean);
  const Rtot = comb.length ? sys(fo, st.u_pret && R.pret) : Infinity;
  const other = [st.u_fund && R.fund, st.u_otok && R.otok, st.u_tasma && R.tasma].filter(Boolean), withN = k => sys(fo, rodsR(k));
  let needN = null; if (sys(fo) <= target) needN = 0; else for (let k = 1; k <= 30; k++){ if (withN(k) <= target){ needN = k; break; } }
  const otokOk = !st.u_otok && sys([...fo, R.otok]) <= target;
  const needL = (() => { for (let L = 1; L <= 60; L += .5) if (rRod(rho, L, dr) <= target) return L; return null; })();
  const curve = Array.from({length: 12}, (_, i) => [i + 1, rodsR(i + 1)]), curve2 = other.length ? Array.from({length: 12}, (_, i) => [i + 1, withN(i + 1)]) : null;
  const Rother = sys(fo); return {rho0, rho, target, A, B, P, D, R, Rtot, comb, needN, needL, curve, Lr, nr, ar, Lt, dr, Rother, otokOk, curve2, withN};
```

**Poprawka uziom-2 (DROBNY)** – Brak kontroli danych: długość pręta mniejsza od d/4 (np. 0 lub 0,004 m) daje ujemną rezystancję i komunikat „spełnia cel”; wymiar budynku 0 daje komunikat „Zaznacz co najmniej jeden rodzaj uziomu”.

stare:
```js
const A = n('A'), B = n('B'), P = 2 * (A + B), D = Math.sqrt(4 * A * B / Math.PI), Lr = n('L'), dr = n('d') / 1000,
```
nowe:
```js
const A = Math.max(n('A'), 1), B = Math.max(n('B'), 1), P = 2 * (A + B), D = Math.sqrt(4 * A * B / Math.PI), Lr = Math.max(n('L'), .5), dr = Math.max(n('d'), 10) / 1000,
```

### Wątpliwe
- „Uziom fotowoltaiki / anteny ≤ 10 Ω”: PN-HD 60364-7-712 nie podaje takiej wartości. 10 Ω ma sens tylko wtedy, gdy instalacja PV łączy się z LPS.
- „TN-C-S ≤ 30 Ω” to typowy wymóg operatorów dla uziemienia PEN, nie wymóg normy. „TT z RCD 30 mA ≤ 100 Ω” jest bardzo ostrożne (warunek RA·IΔn ≤ 50 V daje 1667 Ω), ale działa na korzyść bezpieczeństwa.

---

## 2. PRO `kanal` – przyłącze kanalizacyjne

### Sprawdzone i poprawne
- Jednostki odpływu DU, system I, są zgodne z PN-EN 12056-2: umywalka 0,5, bidet 0,5, prysznic bez korka 0,6, wanna 0,8, zlew 0,8, zmywarka 0,8, pralka do 6 kg 0,8, wpust DN50 0,8, WC 6 l 2,0. K = 0,5 dla mieszkań, Qww = K·√ΣDU. Przy przepływie mniejszym od największego przyboru program przyjmuje ten przybór (WC 2,0 l/s), zgodnie z normą. Potwierdzają to sbz-monteur (DIN EN 12056-2) i Polypipe (BS EN 12056-2).
- Minimalny spadek 1:DN (DN110 1%, DN160 0,7%, DN200 0,5%), napełnienie 0,7 dla przewodów zewnętrznych i prędkość min. 0,7 m/s są zgodne z Jade HS i sbz-monteur. Zalecane DN160 ≥ 1,5% pokrywa się z wytycznymi gminy Budzów (DN150 min. 1,5%, zalecane 2%).
- Geometria przekroju częściowo wypełnionego, rzędne dna, przykrycie liczone do wierzchu rury i profil podłużny są liczone poprawnie (sprawdzone ręcznie dla danych domyślnych: spadek 2,42%, dno na końcu 98,10 m).

### Błędy
**K1. Przepustowość i prędkość zawyżone o ok. 20% (ISTOTNY).** Manning z n = 0,010 odpowiada rurze gładszej niż w tablicach PN-EN 12056-2, które liczy się wzorem Colebrooka-White'a z kb = 1,0 mm. Przeliczenie: dla kb = 1 mm wychodzi równoważne n ≈ 0,012. Kontrola z tablicami (sbz-monteur): DN100 przy 1% i napełnieniu 0,5 to 2,9 l/s i 0,8 m/s. Program dla DN110 (di 103,6) daje 3,69 l/s i 0,88 m/s. Po poprawce wychodzi 3,07 l/s i 0,73 m/s.
Skutek: plakietka „samooczyszczanie” (v ≥ 0,7) pojawia się za wcześnie. DN160 przy 0,5% daje w programie 0,79 m/s, po poprawce 0,66 m/s, czyli poniżej 0,7. Przy ujemnym spadku wynik był NaN. Poprawka zmienia n na 0,012 i dodaje `Math.max(i, 0)`.

**K2. Wlot wyżej niż wyjście z budynku: komunikat „spływ grawitacyjny” (ISTOTNY).** W trybie „Dopasuj do wlotu” program wylicza ujemny spadek, np. −0,91% dla wlotu 99,20 m. Ponieważ rura „trafia” w wlot, pisze „Spływ grawitacyjny: spadek dobrany tak, że rura trafia dokładnie w wlot”. Status jest wprawdzie czerwony (spadek poza zakresem), ale pierwsze zdanie mówi coś przeciwnego. Po poprawce program pisze: „Ścieki nie spłyną grawitacyjnie: wlot (99,20 m) leży wyżej niż dno rury na wyjściu z budynku (98,90 m)…”.

**K3. Opis podstaw niezgodny z kodem (DROBNY).** Opis podaje n = 0,010 i „minimum ok. 1%” dla DN160, a kod przyjmuje 0,7%.

### Poprawki (kod)

**Poprawka kanal-1 (ISTOTNY)** – Przepustowość i prędkość liczone wzorem Manninga z n = 0,010 są zawyżone o ok. 20% względem tablic PN-EN 12056-2 (Colebrook-White, kb = 1,0 mm, co odpowiada n ≈ 0,012). Skutek: plakietka „samooczyszczanie” (v ≥ 0,7 m/s) pojawia się przy spadkach, przy których według normy prędkość jest za mała (np. DN160 przy 0,5%: program 0,79 m/s, norma ok. 0,66 m/s). Przy ujemnym spadku wynik był NaN.

stare:
```js
Rh = d / 4, n = .010; return A * Math.pow(Rh, 2 / 3) * Math.sqrt(i) / n * 1000; }
function qPart(D, i, f){ const th = 2 * Math.acos(1 - 2 * f), d = D / 1000, A = d * d / 8 * (th - Math.sin(th)), P = d * th / 2; return A * Math.pow(A / P, 2 / 3) * Math.sqrt(i) / .010 * 1000; }
```
nowe:
```js
Rh = d / 4, n = .012; return A * Math.pow(Rh, 2 / 3) * Math.sqrt(Math.max(i, 0)) / n * 1000; }
function qPart(D, i, f){ const th = 2 * Math.acos(1 - 2 * f), d = D / 1000, A = d * d / 8 * (th - Math.sin(th)), P = d * th / 2; return A * Math.pow(A / P, 2 / 3) * Math.sqrt(Math.max(i, 0)) / .012 * 1000; }
```

**Poprawka kanal-2 (DROBNY)** – Opis podstaw niezgodny z obliczeniem: podaje n = 0,010 i „minimum ok. 1%” dla DN160, a program przyjmuje minimum 0,7% (1:DN, PN-EN 12056-2 / PN-EN 752 dla przewodów zewnętrznych).

stare:
```js
przepustowość wzorem Manninga (n = 0,010, PVC-U). Spadki zalecane: DN110 ≥ 2%, DN160 ≥ 1,5% (minimum ok. 1%), DN200 ≥ 1%.
```
nowe:
```js
przepustowość wzorem Manninga (n = 0,012, odpowiada chropowatości kb = 1 mm z tablic PN-EN 12056-2). Spadki zalecane: DN110 ≥ 2%, DN160 ≥ 1,5%, DN200 ≥ 1%; minimum 1:DN (DN110 1%, DN160 ok. 0,7%, DN200 0,5%).
```

**Poprawka kanal-3 (ISTOTNY)** – Tryb „Dopasuj do wlotu”: gdy wlot kanału lub szamba leży wyżej niż dno rury na wyjściu z budynku, program wylicza ujemny spadek i jednocześnie pisze „Spływ grawitacyjny: spadek dobrany tak, że rura trafia dokładnie w wlot”. Komunikat jest sprzeczny z rzeczywistością (ścieki nie spłyną).

stare:
```js
okG = r.gap >= -.005;
```
nowe:
```js
okG = r.gap >= -.005 && (!r.auto || r.iUse > 0);
```

**Poprawka kanal-4 (ISTOTNY)** – (cd. poprzedniej poprawki) właściwy komunikat dla wlotu położonego wyżej niż wyjście z budynku.

stare:
```js
!okG ? `Ścieki nie spłyną grawitacyjnie: dno rury na końcu (${PX.fx(r.endZ, 2)} m) jest niżej niż wlot (${PX.fx(r.zt, 2)} m). Potrzebna przepompownia albo płytsze wyjście z budynku.` :
```
nowe:
```js
!okG ? (r.auto && r.iUse <= 0 ? `Ścieki nie spłyną grawitacyjnie: wlot (${PX.fx(r.zt, 2)} m) leży wyżej niż dno rury na wyjściu z budynku (${PX.fx(r.z0, 2)} m). Potrzebna przepompownia albo płytsze wyjście z budynku.` : `Ścieki nie spłyną grawitacyjnie: dno rury na końcu (${PX.fx(r.endZ, 2)} m) jest niżej niż wlot (${PX.fx(r.zt, 2)} m). Potrzebna przepompownia albo płytsze wyjście z budynku.`) :
```

### Wątpliwe
- Program nie porównuje Qww z przepustowością. Dla domu ma to znikome znaczenie, bo Qww ≈ 2 l/s, a DN160 mieści ponad 8 l/s.
- Strefy przemarzania 0,8/1,0/1,2/1,4 m są zgodne z powszechnie cytowaną PN-B-03020, ale nie potwierdziłem ich w źródle. Wielu operatorów wymaga przykrycia ≥ 1,2 m (Budzów, PEWiK Gdynia). Warto dodać zdanie „sprawdź warunki operatora”.
- Maks. spadek 15%: Budzów dopuszcza 25% dla DN150. Limit w programie jest ostrożniejszy, nie błędny.
- Studzienka „co ok. 30 m”: PEWiK podaje co najwyżej 50 m dla kanałów. Dla przyłączy wartości zależą od operatora.

---

## 3. Planer „Projekt rozdzielnicy” (`mountPlaner` w index.html)

### Sprawdzone i poprawne
- Obciążalność Iz (PVC 70 °C, Cu) dla metod A1, A2, B1, B2, C, D1 i E, 2 i 3 żyły obciążone, 1,5–50 mm², jest zgodna z PN-HD 60364-5-52, tabl. B.52.2–B.52.5 i B.52.10–11 (porównane z electrical-installation.org i katalogiem LAPP).
- Współczynniki temperatury powietrza 1,22…0,71 są zgodne z LAPP T12. Grupowanie w wiązce (1, 0,80 … 0,50), jednej warstwy na ścianie (C: 0,85 … 0,70) i korytka perforowanego (E: 0,88 … 0,72) jest zgodne z B.52.17 i LAPP.
- IB = P/(U0·cos φ) i P/(√3·U·cos φ). Warunek In ≤ Iz′ wystarcza dla MCB (I2 = 1,45 In). Dla WLZ z wkładką gG program stosuje Iz ≥ 1,103·In, co wynika z I2 = 1,6 In: poprawnie.
- Spadek napięcia b·IB·L·(ρ/S·cos φ + λ·sin φ) z ρ = 0,0225 i λ = 0,08 mΩ/m jest zgodny z zał. G PN-HD 60364-5-52. Ia = 5·In (B) i 10·In (C) to górne granice wyzwalania elektromagnetycznego, więc poprawnie.
- RCD 30 mA dla gniazd do 32 A i oświetlenia w mieszkaniach jest zgodne z 411.3.3 i 411.3.4 (iTeh, HD 60364-4-41:2017). Oświetlenie rozdzielane na różne RCD to dobra praktyka. Dla ładowarki EV program przyjmuje RCD typu B albo A z detekcją DC 6 mA (722.531.3.101), poprawnie. SPD T1+T2 przy wprowadzeniu zasilania i przewody łączące do 0,5 m są zgodne z VIOX i IEC 60364-5-534.
- Na przykładowym domu sprawdziłem: bilans (Pi 45,6 kW, Pz 32,8 kW), rozkład faz (11,0/10,9/10,9 kW), dobór przekrojów, Zs i moduły.

### Błędy
**P1. Spadek napięcia w obwodach liczony bez WLZ (ISTOTNY).** Każdy obwód porównywany jest z pełnym limitem 3%, a spadek w WLZ (do 0,5%) liczony jest osobno. Narzędzie samo cytuje N SEP-E-002: „od licznika do odbiornika do 3%”. Zał. G PN-HD 60364-5-52 też liczy spadek od początku instalacji. Skutek: dopuszczalny jest spadek łączny 3,5%, czyli o ok. 17% za dużo, a L_max jest zawyżone. Po poprawce limit dla obwodu wynosi 3% − 0,5% = 2,5%. Przykładowy dom nadal spełnia warunki (najwyższy spadek 2,18%, a łącznie z WLZ 2,63%).

**P2. Pompa ciepła trójfazowa na wspólnym RCD typu A (ISTOTNY).** PN-HD 60364-5-53, pkt 531.3.3, wymaga RCD typu B dla urządzeń z falownikiem zasilanych trójfazowo bez separacji, o ile producent nie stanowi inaczej (Electrical Contracting News, Voltimum/Doepke). Prąd stały upływu może dodatkowo osłabić działanie wspólnego RCD typu A dla pozostałych obwodów. Poprawka oznacza pompę ciepła jako obwód wydzielony (`ded`): dostaje osobny RCD typu B, tak jak ładowarka EV. Do tego dochodzi zdanie z podstawą normową. Po poprawce przykładowy projekt ma RCD 1–3 typu A oraz RCD 4 (pompa) i 5 (EV) typu B.

**P3. Opis czasu wyłączenia 0,4 s (DROBNY).** PN-HD 60364-4-41:2017, pkt 411.3.2.2: tablica 41.1 dotyczy obwodów do 63 A z gniazdami i do 32 A tylko z odbiornikami stałymi, a nie „do 32 A”.

**P4. Numer normy SPD (DROBNY).** Ograniczniki przepięć reguluje PN-HD 60364-5-534 (Inżynier Budownictwa, VIOX), nie „PN-HD 60364-5-53”.

### Poprawki (kod)

**Poprawka planer-1 (ISTOTNY)** – Pompa ciepła (obwód 3-fazowy z falownikiem) trafia do wspólnego RCD typu A z innymi obwodami. PN-HD 60364-5-53 (531.3.3) wymaga dla odbiorników z falownikiem trójfazowym bez separacji RCD typu B; prąd stały upływu może też „zaślepić” wspólny RCD typu A i odebrać ochronę pozostałym obwodom. Oznaczenie jako obwód wydzielony daje osobny RCD typu B (tak jak dla ładowarki EV).

stare:
```js
pc:{label:"Pompa ciepła",P:6.0,cos:0.9,ph:3,kz:1,ch:"C",In:16,S:2.5},
```
nowe:
```js
pc:{label:"Pompa ciepła",P:6.0,cos:0.9,ph:3,kz:1,ch:"C",In:16,S:2.5,ded:true},
```

**Poprawka planer-2 (ISTOTNY)** – (cd.) opis pod elewacją wyjaśnia RCD typu B także dla pompy ciepła.

stare:
```js
jeśli nie zapewnia jej ładowarka</div>':""}
```
nowe:
```js
jeśli nie zapewnia jej ładowarka. PN-HD 60364-5-53, pkt 531.3.3 · pompa ciepła z falownikiem trójfazowym: osobny RCD typu B, chyba że producent dopuszcza inny typ</div>':""}
```

**Poprawka planer-3 (DROBNY)** – Nieaktualny opis normy: według PN-HD 60364-4-41:2017 (411.3.2.2) czasy z tablicy 41.1 (0,4 s w TN 230 V) dotyczą obwodów odbiorczych do 63 A z gniazdami i do 32 A zasilających tylko odbiorniki stałe (nie „do 32 A”).

stare:
```js
0,4 s dla obwodów odbiorczych do 32 A;
```
nowe:
```js
0,4 s dla obwodów odbiorczych do 63 A z gniazdami i do 32 A tylko z odbiornikami stałymi;
```

**Poprawka planer-4 (DROBNY)** – Zły numer normy: dobór i montaż ograniczników przepięć to PN-HD 60364-5-534 (od 2016 r. osobna część), nie PN-HD 60364-5-53.

stare:
```js
PN-HD 60364-5-53 · ogranicznik przepięć
```
nowe:
```js
PN-HD 60364-5-534 · ogranicznik przepięć
```

**Poprawka planer-5 (ISTOTNY)** – Spadek napięcia w obwodzie jest porównywany z pełnym limitem (domyślnie 3%), bez spadku w WLZ. Opis normy w tym samym narzędziu mówi „od licznika do odbiornika do 3%” (N SEP-E-002), a załącznik G PN-HD 60364-5-52 liczy spadek od początku instalacji. Skutek: dopuszczany jest spadek łączny do 3,5% (o ok. 17% za dużo), a L_max jest zawyżone. Poprawka odejmuje dopuszczalny spadek WLZ od limitu dla obwodów.

stare:
```js
const LmaxDU=IB>0?S.dumax*U/100/(b*IB*k):Infinity;
```
nowe:
```js
const LmaxDU=IB>0?Math.max(0,S.dumax-S.wlzDu)*U/100/(b*IB*k):Infinity;
```

**Poprawka planer-6 (ISTOTNY)** – (cd.) warunek spadku w obwodzie.

stare:
```js
okDU:dUp<=S.dumax+1e-9
```
nowe:
```js
okDU:dUp<=S.dumax-S.wlzDu+1e-9
```

**Poprawka planer-7 (ISTOTNY)** – (cd.) komunikat o przekroczeniu.

stare:
```js
issues.push("spadek > "+fmt(S.dumax,1)+"%")
```
nowe:
```js
issues.push("spadek > "+fmt(S.dumax-S.wlzDu,1)+"% (razem z WLZ "+fmt(S.dumax,1)+"%)")
```

**Poprawka planer-8 (ISTOTNY)** – (cd.) etykieta pola zgodna ze znaczeniem limitu.

stare:
```js
Dop. spadek w obwodach [%]
```
nowe:
```js
Dop. spadek od licznika do odbiornika [%]
```

### Wątpliwe
- Zs liczone z ρ = 0,0225 (temperatura pracy). Część metod, np. CENELEC TR 50480, liczy przewody w stanie zwarcia z ok. 1,5·ρ20 ≈ 0,027, co daje kilka do kilkunastu procent wyższe Zs. Przy domyślnych danych zapas jest duży (Zs 0,6–1,4 Ω przy limicie 1,44–4,6 Ω). Nie zmieniałem.
- Minimalny przekrój WLZ: program zaczyna od 6 mm². Wiele źródeł przypisuje N SEP-E-002 minimum 10 mm² Cu, ale nie potwierdziłem tego w dwóch źródłach, bo limit wyszukiwań się wyczerpał.
- Współczynniki grupowania KG.D1 (kable w ziemi) nie zostały porównane z tabl. B.52.19 i B.52.18.

---

## 4. PRO `dzialka` – usytuowanie domu na działce

### Sprawdzone i poprawne
Treść WT 2002 według obwieszczenia Dz.U. 2022 poz. 1225 (Sejm ELI), stosowanych przejściowo:
- § 12 ust. 1: 4 m od ściany z oknami lub drzwiami, 3 m od ściany bez nich. Ust. 2: 1,5 m albo w granicy, gdy pozwala MPZP. Program to sprawdza (Murator, Sejm).
- § 31 ust. 1: studnia 5 m od granicy, 15 m od szczelnego zbiornika na nieczystości, 30 m od przewodu rozsączającego po oczyszczaniu biologicznym (lexlege, Sejm, Murator). Okręgi na planie są poprawne.
- § 36 ust. 2 (zbiorniki do 10 m³, zabudowa jednorodzinna): 2 m od granicy i drogi oraz 5 m od okien i drzwi (arslege, Sejm, Murator).
- Powierzchnia zabudowy i powierzchnia biologicznie czynna są liczone poprawnie. Linia zabudowy wg MPZP/WZ jest liczona od granicy działki z drogą (wartowiedziec).
- § 23 (odpady) nie dotyczy zabudowy jednorodzinnej (Murator, § 23 ust. 3), więc jego brak jest poprawny.

### Błędy
**D1. Szambo powyżej 10 m³ oceniane według odległości dla małych zbiorników (ISTOTNY).** § 36 ust. 3: zbiorniki powyżej 10 do 50 m³ wymagają 30 m od okien i drzwi, 7,5 m od granicy działki sąsiedniej i 10 m od drogi (arslege, Sejm, Murator, kb.pl). Program nie pyta o pojemność i dla szamba 12 m³ w odległości 2 m od granicy i 5 m od okien pokazuje „spełnia”. Minimalna poprawka bez zmiany wyglądu: etykieta „do 10 m³” i podpowiedź z warunkami dla większych zbiorników. Pełne rozwiązanie wymaga pola „pojemność”, co zmienia interfejs, więc zostawiam to właścicielowi.

**D2. § 12 ust. 4 pkt 1 stosowany zbyt wąsko (ISTOTNY).** Przepis mówi: na działce „o szerokości 16 m lub mniejszej” ściana bez okien i drzwi może stać w granicy albo w odległości mniejszej niż 3 m, „lecz nie mniejszej niż 1,5 m” (Sejm, Murator). Program akceptował tylko dokładnie 1,5 m albo 0 m. Ściana 2 m od granicy na działce 14 m wychodziła jako „nie spełnia”, a działka o szerokości dokładnie 16 m była wykluczona (W < 16). Po poprawce: W ≤ 16 m i odległość 1,5–3 m daje „warunkowo” z opisem. Przy szerszej działce dopuszczalne jest tylko 1,5 m lub granica, i tylko z MPZP.

**D3. Studnia bliżej niż 5 m od granicy (DROBNY).** § 31 ust. 2 dopuszcza ją, także jako wspólną na granicy, jeśli na obu działkach zachowane są odległości z ust. 1 pkt 2–5. Program pokazywał to jako bezwzględne „nie spełnia”. Po poprawce: „warunkowo” z wyjaśnieniem.

**D4. Brak informacji o niesprawdzanych odległościach (DROBNY).** Program nie sprawdza odległości od jezdni (art. 43 ustawy o drogach publicznych: droga gminna 6 m w terenie zabudowy i 15 m poza nim, mniej tylko za zgodą zarządcy) ani od lasu (§ 271 ust. 8: 12 m, wyjątki dla domów jednorodzinnych w ust. 8a). Dopisałem to do opisu podstaw.

### Poprawki (kod)

**Poprawka dzialka-1 (ISTOTNY)** – Odległości szamba 2 m i 5 m (§ 36 ust. 2) dotyczą tylko zbiorników do 10 m³. Popularne szamba 10–12 m³ i większe (do 50 m³) wymagają 30 m od okien i drzwi, 7,5 m od granicy działki sąsiedniej i 10 m od drogi (§ 36 ust. 3). Program nie pyta o pojemność i dla takiego zbiornika pokazuje „spełnia”. Minimalna poprawka: oznaczenie zakresu i podpowiedź.

stare:
```js
{k: 's_on', t: 'chk', l: 'Szambo (zbiornik bezodpływowy)'}
```
nowe:
```js
{k: 's_on', t: 'chk', l: 'Szambo (zbiornik bezodpływowy do 10 m³)', h: 'Odległości 2 m od granicy i drogi oraz 5 m od okien i drzwi dotyczą zbiorników do 10 m³ w zabudowie jednorodzinnej (§ 36 ust. 2). Zbiornik większy, do 50 m³: co najmniej 30 m od okien i drzwi, 7,5 m od granicy działki sąsiedniej i 10 m od drogi lub ciągu pieszego (§ 36 ust. 3).'}
```

**Poprawka dzialka-2 (ISTOTNY)** – § 12 ust. 4 pkt 1: na działce o szerokości 16 m lub mniejszej ścianę bez okien i drzwi można postawić w granicy albo w dowolnej odległości od 1,5 m do 3 m. Program akceptował tylko dokładnie 1,5 m albo 0 m (np. 2 m na działce 14 m oznaczał jako „nie spełnia”), a warunek W < 16 wykluczał działkę o szerokości dokładnie 16 m.

stare:
```js
else if (!w && (Math.abs(dist - 1.5) < .05 || Math.abs(dist) < .05)) add(`Dom – granica ${name}`, '1,5 m lub w granicy: tylko przy działce węższej niż 16 m albo gdy pozwala MPZP', dist, false, W < 16, 'WT § 12 ust. 2–4', W < 16 ? 'działka węższa niż 16 m: dopuszczalne' : 'wymaga zapisu w MPZP');
```
nowe:
```js
else if (!w && (Math.abs(dist) < .05 || (W <= 16 + 1e-9 ? dist >= 1.45 : Math.abs(dist - 1.5) < .05))) add(`Dom – granica ${name}`, W <= 16 + 1e-9 ? 'w granicy lub 1,5–3 m: działka o szerokości do 16 m' : '1,5 m lub w granicy: tylko gdy pozwala MPZP', dist, false, W <= 16 + 1e-9, 'WT § 12 ust. 2 i 4', W <= 16 + 1e-9 ? 'działka o szerokości do 16 m: dopuszczalne' : 'wymaga zapisu w MPZP');
```

**Poprawka dzialka-3 (DROBNY)** – § 31 ust. 2 dopuszcza studnię bliżej niż 5 m od granicy (także wspólną na granicy), jeśli na obu działkach zachowane są odległości z ust. 1 pkt 2–5. Program oznaczał to jako bezwzględne „nie spełnia”; poprawnie: „warunkowo”.

stare:
```js
add('Studnia – granica działki', '≥ 5 m', bnd(x, y), bnd(x, y) >= 5, false, 'WT § 31 ust. 1');
```
nowe:
```js
add('Studnia – granica działki', '≥ 5 m', bnd(x, y), bnd(x, y) >= 5, true, 'WT § 31 ust. 1–2', 'bliżej niż 5 m: tylko gdy na działce sąsiedniej zachowane są odległości od szamba, drenażu i rowu');
```

**Poprawka dzialka-4 (DROBNY)** – Opis podstaw nie mówi, że program nie sprawdza odległości od jezdni (art. 43 ustawy o drogach publicznych) ani od lasu (§ 271 ust. 8 i 8a). Użytkownik może uznać wynik „spełnia” za pełną kontrolę usytuowania.

stare:
```js
Przepisy przewidują wyjątki (np. § 36 ust. 5): ostateczną ocenę robi projektant.',
```
nowe:
```js
Przepisy przewidują wyjątki (np. § 36 ust. 5): ostateczną ocenę robi projektant. Program nie sprawdza odległości od zewnętrznej krawędzi jezdni (art. 43 ustawy o drogach publicznych: droga gminna 6 m w terenie zabudowy, 15 m poza nim, mniej tylko za zgodą zarządcy drogi) ani od granicy lasu (§ 271 ust. 8: 12 m, dla domu jednorodzinnego wyjątki z ust. 8a).',
```

### Wątpliwe
- „Drenaż oczyszczalni – okna domu ≥ 5 m, wytyczne producentów”: nie znalazłem tego w przepisach. Wartość ma status zalecenia i program prawidłowo pokazuje ją jako „warunkowo”.
- Odległości szamba mierzy się od pokryw i wylotów wentylacji (§ 36), a program od punktu na planie. Przy dużym zbiorniku różnica może sięgać ok. 1 m.
- § 19 (miejsca postojowe) i § 271 (las) nie są obliczane. To decyzja zakresu, opisana w D4.

---

## Lista źródeł
1. [Obwieszczenie – WT, tekst jednolity Dz.U. 2022 poz. 1225](https://api.sejm.gov.pl/eli/acts/DU/2022/1225/text.html) — Sejm RP, ELI — dosłowne § 12 ust. 1–4, § 19, § 23, § 31, § 36
2. [§ 31 – usytuowanie studni](https://lexlege.pl/tech-war-budynkow/paragraf-31/) — LexLege — 5/7,5/15/30/70 m, ust. 2
3. [WT – rozdział o zbiornikach bezodpływowych](https://arslege.pl/rozporzadzenie-ministra-infrastruktury-w-sprawie-warunkow-technicznych-jakim-powinny-odpowiadac-budynki-i-ich-usytuowanie/k218/s3048/) — ArsLege — § 36 ust. 1–3, pomiar od pokryw i wylotów, uchylenie 20.09.2026
4. [Usytuowanie budynku – odległość od granicy](https://muratordom.pl/przed-budowa/dzialka/warunki-techniczne-usytuowanie-budynku-granica-dzialki-aa-cQoW-RJiK-STv5.html) — Murator — § 12, działka do 16 m bez MPZP
5. [Zagospodarowanie działki – odległości](https://muratordom.pl/prawo/formalnosci-budowlane/zagospodarowanie-dzialki-budowlanej-budowle-i-urzadzenia-aa-XUCi-9gYL-Pb1F.html) — Murator — § 31, § 36 ust. 2–3, odpady nie dotyczą jednorodzinnej
6. [Odległość budynku od lasu](https://muratordom.pl/prawo/porady-prawne/odleglosc-budynku-od-lasu-w-jakiej-odleglosci-od-granicy-lasu-mozna-zbudowac-dom-aa-8fCB-ZMnr-vqnf.html) — Murator — § 271 ust. 8 i 8a
7. [Szambo powyżej 10 m³ – odległości](https://kb.pl/aktualnosci/prawo-i-przepisy/odleglosc-od-granicy-dzialki-szambo/) — KB.pl — 7,5 m od granicy i 30 m od okien
8. [Art. 43 ustawy o drogach publicznych](https://arslege.pl/zasady-usytuowania-obiektow-budowlanych-przy-drogach/k95/a15820/) — ArsLege — tabela odległości od jezdni, zgoda zarządcy
9. [Obiekty budowlane przy drogach gminnych](https://wartowiedziec.pl/komunikacja-i-transport/48830-obiekty-budowlane-przy-drogach-gminnych) — Warto Wiedzieć — linia zabudowy a art. 43
10. [DEHN Lightning Protection Guide, s. 124 (tabl. 5.5.1)](https://resources.ipd.com.au/Flipbook/35_DS702_E_2014_Lightning_Protection_Guide/files/basic-html/page124.html) — DEHN — wzory otoku, taśmy, pręta; łączony układ ma wyższą rezystancję niż równoległa
11. [DEHN LPG, s. 126](https://resources.ipd.com.au/Flipbook/35_DS702_E_2014_Lightning_Protection_Guide/files/basic-html/page126.html) — DEHN — odstęp prętów ≥ głębokość, współczynnik redukcji
12. [DEHN LPG, s. 123](https://resources.ipd.com.au/Flipbook/35_DS702_E_2014_Lightning_Protection_Guide/files/basic-html/page123.html) — DEHN — sezonowe wysychanie i przemarzanie
13. [Instalacje uziemiające – zalecenia norm, cz. I](https://inzynierbudownictwa.pl/instalacje-uziemiajace-zalecenia-norm-cz-i/) — Inżynier Budownictwa — 10 Ω wg PN-EN 62305-3
14. [Uziom fundamentowy – projektowanie i budowa](https://inzynierbudownictwa.pl/uziom-fundamentowy-projektowanie-i-budowa-zgodnie-z-polskimi-normami/) — Inżynier Budownictwa — PN-HD 60364-5-54 zał. C, PN-EN 62305-3, łączenie zbrojenia
15. [Symulator rezystancji uziemienia](https://cenauslug.pl/kalkulatory/symulator-rezystancji-uziemienia-oblicz-spodziewane-omy-dla-uziomu) — cenauslug.pl — rezystywności gruntów, mnożnik 0,8–1,5, progi 10/30 Ω
16. [Earthing grid resistance](https://quickfield.com/advanced/earthing_grid_resistance.htm) — QuickField — wzór IEEE 80 (człon ρ/√(20A)) potwierdzony obliczeniem MES
17. [LAPP T12 – obciążalność prądowa](https://t3.lappcdn.com/fileadmin/DAM/Lapp_Polska/Polska/LAPP_T12_obci%C4%85%C5%BCalno%C5%9B%C4%87_pr%C4%85dowa_przewod%C3%B3w.pdf) — LAPP — współczynniki temperatury i grupowania
18. [Recommended simplified approach for cable sizing](https://www.electrical-installation.org/enwiki/Recommended_simplified_approach_for_cable_sizing) — Schneider Electric — Iz wg IEC 60364-5-52
19. [A1 2/3 PVC – korekta kolumn](https://www.electrical-installation.org/enwiki/Topic:Wnzkx82tyran930c) — Schneider Electric — kolumny A1 (14,5 A dla 2 żył)
20. [Bemessung von Schmutzwasserleitungen](https://www.sbz-monteur.de/sites/default/files/wp-content/uploads/2008/09/Download-Bemessung-von-Schmutzwasserleitungen.pdf) — SBZ Monteur — DU, K, 1:DN, h/d 0,7, tablice przepustowości
21. [BS EN 12056-2 discharge units](https://www.polypipe.com/node/100950) — Polypipe — DU i K, reguła największego przyboru
22. [Gebäudeentwässerung – Auslegung](https://www.jade-hs.de/fileadmin/fb_architektur/downloads/Organisation/Mitarbeiter/Mayer/Sanitaer/Kapitel_04-Gebaeudeentwaesserung-Auslegungen_von_Abwasseranlagen-ohne_VDI.pdf) — Jade Hochschule — 1:DN, 0,7–2,5 m/s, Prandtl-Colebrook
23. [Ogólne zasady – przyłącza kanalizacyjne](https://budzow.pl/wp-content/uploads/2021/03/Ogolne-zasady-PRZYLACZA-KANALIZACYJNE-2.pdf) — Gmina Budzów — DN150 min. 1,5%, maks. 25%, przykrycie 1,2 m
24. [Ogólne warunki techniczne](https://pewik.gdynia.pl/zalaczniki/2025/01/Ogolne-warunki-techniczne-i-zasady.pdf) — PEWiK Gdynia — przykrycie 1,2 m, studzienki co ≤ 50 m
25. [SIST HD 60364-4-41:2017 (próbka)](https://cdn.standards.iteh.ai/samples/60900/a918c00f3a904c6c97fee89ce52498e7/SIST-HD-60364-4-41-2017.pdf) — iTeh/CENELEC — 411.3.2.2 (63 A/32 A), 411.3.3, 411.3.4
26. [IEC 60364 disconnection time](https://industrialmonitordirect.com/blogs/knowledgebase/iec-60364-disconnection-time-04s-vs-5s-for-32a-threshold) — Industrial Monitor Direct — 0,4 s / 5 s (pomocniczo)
27. [Heat pumps – Type F or Type B RCDs?](https://electricalcontractingnews.com/news/heat-pumps-type-f-or-type-b-rcds/) — Electrical Contracting News — 531.3.3, typ B dla falownika trójfazowego
28. [Heat pump installation – RCDs](https://www.voltimum.co.uk/news/doepke/heat-pump-installation-18th-edition-rcds) — Voltimum/Doepke — typ B, brak typu F/B za typem A
29. [Ochrona ograniczników przepięć – zmiany normowe](https://inzynierbudownictwa.pl/ochrona-ogranicznikow-przepiec-zmiany-normowe/) — Inżynier Budownictwa — PN-HD 60364-5-534:2016
30. [Błędy instalacji SPD](https://viox.com/pl/spd-installation-mistakes-fix-guide/) — VIOX — a + b ≤ 0,5 m wg IEC 60364-5-534
31. [Table G.52.1 – Voltage drop](https://sites.google.com/view/etoolsbox/electrical/voltage-drop-iec) — eToolsBox — 3% oświetlenie / 5% inne, od zasilania z sieci publicznej

Pliki robocze: `E/` (testy `t_*.js`, obliczenia numeryczne `bem*.py`, `grid4.json`, kopia z poprawkami `index_fixed.html`).
