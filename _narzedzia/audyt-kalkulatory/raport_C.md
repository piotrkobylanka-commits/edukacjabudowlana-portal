# Raport C – audyt kalkulatorów: PRO dach, wiatr, prosty dach, PRO rynny, PRO slonce (31.10.2026)

Metoda: odczyt kodu (pro_dach.js, pro_rynny.js, pro_slonce.js, moduły `WIA` i `DAK` z index.html), uruchomienie funkcji calc w Node z atrapą PX (pliki testowe w `audit/C/t1.js`–`t8.js`), porównanie z ręcznym obliczeniem wg normy, weryfikacja w źródłach. Wszystkie 25 fragmentów `stare` występuje w index.html dokładnie raz. Po podmianie wszystkie skrypty index.html przechodzą `node --check` (kopia: `audit/C/index_patched.html`), a poprawione moduły przeliczono ponownie (`audit/C/t8.js`). Poprawki maszynowo: `poprawki_C.json`.

Uwaga: limit wyszukiwań w tej turze się wyczerpał (200 na wszystkich agentów). Część ustaleń opiera się na jednym pobranym źródle plus obliczeniach albo na drugim źródle z wyników wyszukiwania. Zaznaczam to przy danym ustaleniu.

---

## 1. PRO `dach` (geometria, śnieg, wiatr, krokiew, zestawienie)

### Sprawdzone i poprawne
- **s_k dla stref 1–5 (NA do PN-EN 1991-1-3):** 1: 0,007A − 1,4 ≥ 0,7; 2: 0,9; 3: 0,006A − 0,6 ≥ 1,2; 4: 1,6; 5: 0,93·exp(0,00134A) ≥ 2,0. Zgodne z [PWr przykłady], [designforms PN], [PL Lublin projekt]. Test: strefa 3, A = 500 m daje 2,40 kN/m² (ręcznie 0,006·500 − 0,6 = 2,4).
- **μ1 dla dachu dwuspadowego:** 0,8 do 30°, 0,8(60 − α)/30 dla 30–60°, 0 od 60° (tablica 5.2). Test: 40° daje 0,533; 45° daje 0,40. Zgodne z [PWr przykłady], [structuralbasics].
- **Wiatr:** v_b,0 = 22/26/22 m/s, dla A > 300 m w strefach 1 i 3 22[1 + 0,0006(A − 300)], strefa 2 bez korekty. q_b = ½·1,25·v_b². c_e(z) wg tablicy NA.3: 0 – 3,0(z/10)^0,17; I – 2,8(z/10)^0,19; II – 2,3(z/10)^0,24; III – 1,9(z/10)^0,26; IV – 1,5(z/10)^0,29; z_min 1/1/2/5/10 m. Test: III, z = 7,6 m daje c_e = max(z, 5) → 1,730, q_p = 0,523 kN/m². Zgodne z [e-oze PN-EN 1991-1-4], [PW wykład 4], [designforms PN wind], [PL Lublin projekt]. Uwaga: e-oze podaje dla kategorii 0 wykładnik 0,11, ale to wartość c_r. Wykład PW i kod podają dla c_e 0,17. Kod jest poprawny.
- **C24/C30/C18:** f_m,k 24/30/18 MPa, E_0,mean 11 000/12 000/9 000 MPa. k_mod 0,9 (obciążenie krótkotrwałe, klasa użytkowania 1–2), γ_M 1,3. Zgodne z [Galway EC5 vol. 2] (C24 i tablica k_mod) oraz [Pollub BiA] (k_mod 0,9 dla kombinacji ze śniegiem i wiatrem). Wartości C18 i C30 potwierdza tylko EN 338 z pamięci. Wyszukiwanie tablic się nie powiodło.
- **Granica ugięcia l/200** dla elementów belkowych więźb (NA.3 do PN-EN 1995-1-1): [Dietrich's SGU], [Pollub BiA].
- **Geometria:** wysokość kalenicy B/2·tgα, krokiew (B/2 + okap)/cosα, połać 2·L·krokiew. Sprawdzono ręcznie dla B = 9, α = 40°.

### Błędy
1. **Brak C_e i reguły μ1 ≥ 0,8 przy płotkach śniegowych lub attyce** – ISTOTNY.
   Program liczy zawsze s = μ1·s_k. Norma wymaga C_e = 1,2 dla terenu osłoniętego (drzewa, wyższe budynki), a przy płotkach śniegowych, attyce albo przeszkodzie na okapie μ1 nie może spaść poniżej 0,8.
   Skutek: na dachu 45° z płotkami śnieg jest zaniżony o 50% (0,28 zamiast 0,56 kN/m²). W terenie osłoniętym zaniżenie wynosi 17%, bo wynik stanowi 1/1,2 właściwej wartości.
   Źródła: [PWr przykłady] (C_e 0,8/1,0/1,2; „< 0,8 → μ1 = 0,8” przy zabezpieczeniu przed zsuwaniem), [inzynierbudownictwa cz. I] (C_e), [inzynierbudownictwa cz. II] (μ ≥ 0,8 przy płotkach i attyce).
   Poprawka (3 części):
   - `mu = deg <= 30 ? .8 : deg < 60 ? .8 * (60 - deg) / 30 : 0, s = mu * sk;` → `mu = st.plot ? .8 : deg <= 30 ? .8 : deg < 60 ? .8 * (60 - deg) / 30 : 0, s = mu * (PX.num(st.ce) || 1) * sk;`
   - pola `ce` i `plot` w grupie „Lokalizacja” oraz wartości domyślne `ce: '1', plot: false` (pełny tekst w JSON).
2. **Kombinacja tylko ze śniegiem wiodącym** – ISTOTNY.
   Program przyjmuje 1,35G + 1,5S + 0,9W. Przy dachach stromych (μ1 → 0) miarodajny jest wiatr wiodący: 1,35G + 1,5·0,5·S + 1,5W (ψ0 śniegu 0,5, wiatru 0,6).
   Skutek: przy 60° moment jest zaniżony o 21% (3,26 zamiast 4,13 kNm).
   Źródła: [core.ac.uk EN 1990 ψ] (ψ0 śnieg 0,5, wiatr 0,6), [Pollub BiA].
   Poprawka: `const qd = 1.35 * g * a * Math.cos(al) + 1.5 * s * a * Math.cos(al) * Math.cos(al) + 1.5 * .6 * qp * .7 * a,` → `const qS = …, qW = …, qd = 1.35·g… + Math.max(1.5·qS + 0,9·qW, 0,75·qS + 1,5·qW),` (dokładny tekst w JSON), razem z poprawką opisu w vLoad.
3. **Ugięcie chwilowe porównane z granicą ugięcia końcowego** – ISTOTNY.
   NA ustala l/200 dla w_net,fin, czyli ugięcia z pełzaniem: w_fin = w_G(1 + k_def) + w_S(1 + ψ2·k_def). Dla klasy użytkowania 2 (poddasze, więźba) k_def = 0,8, a ψ2 śniegu = 0. Program pomija pełzanie.
   Skutek: ugięcie zaniżone o 35–45% (domyślnie 4,1 zamiast 6,6 mm; przy 60° 11,0 zamiast 19,8 mm). „Najmniejszy wystarczający przekrój” wychodzi o klasę za mały (6×16 zamiast 8×18 przy 60°).
   Źródła: [Galway EC5 vol. 2] (k_def 0,6/0,8/2,0), [masterseries] (k_def), [Pollub BiA] (ψ2·k_def śniegu, l/200), [core.ac.uk] (ψ2 śniegu 0).
   Poprawka: `qk = g * a * Math.cos(al) + s * …;` → `qk = g * a * Math.cos(al) * 1.8 + s * …;` oraz etykieta „Ugięcie końcowe (z pełzaniem)” i opis podstawy.
4. **Liczba krokwi zaokrąglana w dół** – DROBNY.
   floor(L/a) + 1 daje rozstaw większy od wpisanego, np. 12,8 m co 90 cm daje 15 szt. na połać, czyli faktycznie co 91,4 cm. Obliczenia wytrzymałościowe zakładają 90 cm.
   Skutek: zestawienie o 1 krokiew na połać za mało.
   Poprawka: `nK = 2 * (Math.floor(Ltot / a) + 1)` → `nK = 2 * (Math.ceil(Ltot / a - 1e-9) + 1)`.
5. **Rozstaw 0 (puste pole)** – DROBNY. Ciężar od krokwi zawiera dzielenie /a, więc wyniki to NaN i Infinity.
   Poprawka: `a = n('roz') / 100` → `a = Math.max(10, n('roz')) / 100`.

### Wątpliwe (bez poprawki)
- Wiatr w obliczeniu krokwi to stała 0,7·q_p (parcie) w kierunku prostopadłym. Według tablicy 7.4a przy 15–30° parcie wynosi 0,2–0,7, a ssanie może odciążać. Jak na sprawdzenie wstępne przyjęcie jest ostrożne, więc zostawiłem.
- Brak przypadków niesymetrycznego śniegu (0,5μ1 na jednej połaci). Dla krokwi swobodnie podpartej to bez znaczenia, dla układu jętkowego ma znaczenie. Program wprost odsyła do projektanta.
- Wsp. 0,62 rozpiętości dla układu krokwiowo-jętkowego to uproszczenie bez podstawy normowej. Opisano je jako sprawdzenie wstępne.
- k_h (efekt wysokości przekroju < 150 mm) pominięty. To pominięcie po bezpiecznej stronie.

---

## 2. Prosty kalkulator `wiatr` (moduł `WIA`)

### Sprawdzone i poprawne
- **v_b,0, korekta wysokościowa, ρ = 1,25, c_dir = c_season = 1, c_e(z) z NA.3:** jak wyżej. Test „typ”: III, h = 8 m daje c_e = 1,793 i q_p = 0,542 kN/m², ręcznie 1,9·0,8^0,26 = 1,793, 1,793·0,3025 = 0,542. To samo wyliczenie dla h = 8 m jest w [PL Lublin projekt] (1,793).
- **e = min(b; 2h)** z b prostopadłym do wiatru, pasy e/4, e/10, e/2: [PW wykład 4], [PWr wykład 15].
- **Tablice 7.4a/7.4b (dwuspadowy).** Wartości c_pe,10 i c_pe,1 dla 5–75° sprawdzono z wartościami EN 1991-1-4 z pamięci. Interpolacja do 25° zgadza się z przykładem [PWr wiatr przykłady]: H −0,233, J −0,667, F (θ = 90°) −1,167 przy kodzie −0,233, −0,667, −1,167. Interpolacja log A dla 1–10 m² wg rys. 7.2 jest poprawna.
- **c_pi +0,2 / −0,3:** [Soldis].
- **Wsp. 1,5·w − 0,9·g dla siły wyrywającej:** zgodne z EN 1990 (γ_Q 1,5, γ_G,inf 0,9).
- Opis stref (1 – większość kraju, 2 – pas nadmorski, 3 – góry): [ongeo warunki klimatyczne].

### Błędy
1. **Zawieszenie przeglądarki przy rozstawie krokwi 0 oraz wyjątek przy długości lub szerokości 0** – KRYTYCZNY.
   `for (let t = S.s / 2; t < len; t += S.s)` przy S.s = 0 nigdy się nie kończy. Sprawdzone: proces Node zabity po 5 s. Pole jest typu number i wartość „0” pojawia się w trakcie wpisywania „0,6”, więc karta zawiesza się przy zwykłej edycji. Przy L = 0 lub B = 0 `worst1` ma wartość null i run() rzuca wyjątek, a wyniki przestają się odświeżać.
   Poprawka: `const S = {...S0};` → `const S = {...S0}; S.s = Math.max(.3, +S.s || 0); S.L = Math.max(1, +S.L || 0); S.B = Math.max(1, +S.B || 0);`. Po poprawce wszystkie trzy przypadki liczą się poprawnie (t8.js).

### Wątpliwe
- Wysokość odniesienia z = h (kalenica) dla dachu. Norma dopuszcza z_e = h, więc to przyjęcie ostrożne.
- Dla dachu na rzucie L i czterospadowego zastosowano przybliżenia. Program je opisuje.
- Dach płaski: przy h_p/h > 0,1 program trzyma wartości z 0,1. Zgodne z tablicą 7.2.

---

## 3. Prosty kalkulator `dach` (kąt i spadek, poddasze, śnieg; moduł `DAK`)

### Sprawdzone i poprawne
- i = tgα·100%, 1:n = 1/tgα, α = arctg(i/100). Test: 35° daje 70% i 1:1,43; 3% daje 1,72°.
- s_k i μ1 jak w PRO dach, C_e = C_t = 1 opisane.
- **Progi 2,20 / 1,40 m (100% / 50% / 0%):** wartości poprawne wg [rozporządzenie o projekcie budowlanym § 20 – arslege] i [ustawa o podatkach i opłatach lokalnych art. 4 ust. 2 – Nowy Sącz]. Krawędzie: `h >= 2.2 - 1e-9` i `h >= 1.4 - 1e-9` dają ≥ 2,20 → 100% i ≥ 1,40 → 50%. Zgodne z „równej lub większej” w § 20.
- **§ 72 WT:** pokój na poddaszu domu jednorodzinnego 2,2 m, przy stropach pochyłych średnia z największej i najmniejszej, nie mniej niż 1,9 m, przestrzeni poniżej 1,9 m się nie zalicza. Zgodne z [arslege § 72], [inzynierbudownictwa wysokość pomieszczeń]. Wzmianka o stosowaniu przejściowym jest zgodna z briefem.
- Minimalne kąty pokryć to dane producentów: Rheinzink od 3° z taśmą ([Rheinzink brochure 2026]: 3–25°), dachówki ceramiczne od 10° z dodatkowymi zabezpieczeniami ([muratordom kąt dachu]). Pozostałe modele bez sprzeczności w znalezionych źródłach.

### Błędy
1. **Błędne źródło zasady 2,20 / 1,40 m** – DROBNY.
   Tekst przypisuje ją PN-ISO 9836:1997. Ta norma nie redukuje powierzchni ze względu na wysokość. Redukcję wprowadza § 20 rozporządzenia o projekcie budowlanym i ustawa podatkowa, a historycznie PN-70/B-02365. Ten sam portal pisze to w artykule o powierzchni użytkowej („te redukcje nie pochodzą z normy”).
   Źródła: [inzynierbudownictwa – obliczanie powierzchni użytkowej], [inzynierbudownictwa – wskaźniki PN-ISO 9836], [pewnylokal PN-ISO 9836], [arslege § 20].
   Poprawka: `(zasada z PN-ISO 9836:1997 i z ustawy … art. 4 ust. 2)` → odwołanie do § 20 rozporządzenia i ustawy (pełny tekst w JSON).
2. **Opis śniegu bez reguły μ1 ≥ 0,8 przy płotkach i bez C_e = 1,2** – DROBNY (kalkulator jest poglądowy).
   Skutek: na dachu 45° z płotkami użytkownik odczyta obciążenie o połowę za małe. Poprawka dopisuje zdanie do opisu metody.

### Wątpliwe
- Okap kopertowego dodany „dookoła”, a połać = rzut z okapami / cosα. To poprawne tylko przy równych kątach, co program opisuje.
- PN-ISO 9836:2015/2022 wprowadza próg 1,90 m (wg [pewnylokal]). To inna konwencja niż rozporządzenie. Kalkulator słusznie stosuje rozporządzenie, ale po poprawce 1 warto o tym wspomnieć.

---

## 4. PRO `rynny` (PN-EN 12056-3, deszczówka)

### Sprawdzone i poprawne
- Q_N = 2,78·10⁻⁵·A_E^1,25 (rynna półokrągła, A_E w mm²) i Q_L = 0,9·Q_N: [journals.pcz.pl PN-EN 12056-3], [HR Wallingford SR620] (Q_C = F_L·Q_N·0,9). Test: Ø125 daje A_E = 6136 mm², Q_N = 1,51 l/s, Q_L = 1,36 l/s.
- F_L = 1 dla L/W ≤ 50, W = głębokość rynny (dla rynny okapowej W = Z): [HR Wallingford]. Wartość F_L = 0,96 dla L/W = 77 z [Myczka] zgadza się z interpolacją tablicy w kodzie (0,964). Pozostałe węzły tablicy 6 potwierdza tylko ta interpolacja.
- Powierzchnia efektywna A_H + ½A_V, czyli L(b + h/2): [HR Wallingford]. Kod jest poprawny.
- Rura spustowa wg Wyly-Eatona, k_b = 0,25 mm, f = 0,33: [HR Wallingford], [journals.pcz.pl] (f 0,2–0,33). Test Ø90: 8,09 l/s.
- Zbiornik: 6% mniejszej z wartości (roczny zbiór, roczne zużycie), około 3 tygodnie: [Aidenbach Merkblatt DIN 1989-1].

### Błędy
1. **Tryb „Na końcach okapu”: model liczby spustów niezgodny z rozmieszczeniem** – ISTOTNY.
   calc() przyjmuje n odcinków po L/n z jednym kierunkiem przepływu. Rozmieszczenie (`ryDefPos`) stawia spusty na obu końcach i równo pomiędzy, a woda spływa do każdego z obu stron, więc odcinków jest 2(n − 1) po L/(2(n − 1)).
   Skutek: liczba spustów i elementów zawyżona (okap 20,8 m, PVC 100: 6 zamiast 4 spustów, o 50% więcej lejów, rur i kolan). Przepływ na rurę środkową zaniżony: Q/n zamiast Q/(n − 1), np. 0,75 zamiast 1,51 l/s. Wykres „potrzebne przy tym rozstawie” też jest błędny.
   Poprawka (3 części, w JSON): nowa funkcja `kR` liczby odcinków, `qOut` jako przepływ do rury środkowej, `qRun` do wykresu. Po poprawce wyniki zgadzają się z widokiem interaktywnym (t8.js).
2. **0,03 l/(s·m²) nazwane „normą”** – DROBNY.
   PN-EN 12056-3 nie podaje tej wartości. 300 l/(s·ha) pochodzi z wycofanej PN-92/B-01707, a norma zaleca dane lokalne. Badania (atlas PANDa, deszcz 5-minutowy) wskazują, że to częste zaniżenie.
   Źródła: [inzynierbudownictwa – odwadnianie dachów], [journals.pcz.pl – dobór natężeń deszczu].
   Poprawka: zmiana etykiety i opisu podstawy.

### Wątpliwe
- Rozkład miesięczny opadu (PP) opisano jako orientacyjny. Współczynnik 0,9 (filtr) jest typowy wg DIN 1989.
- Liczba złączek `ceil(L/odcinek) − 1` nie uwzględnia lejów wstawianych w rynnę. Zależy od systemu.

---

## 5. PRO `slonce` (§ 60 i § 13 dotychczasowych WT)

### Sprawdzone i poprawne
- **Treść § 60:** pokoje mieszkalne co najmniej 3 h w dniach równonocy w godz. 7–17 (8–16 dla placówek dla dzieci), w mieszkaniu wielopokojowym wystarczy jeden pokój, w zabudowie śródmiejskiej 1,5 h. Zgodne z [arslege § 60], [architekturaibiznes § 60], [muratordom zacienianie], [inzynierbudownictwa nasłonecznienie]. Opis stosowania przejściowego jest zgodny z briefem.
- **Treść § 13:** kąt 60° w poziomie, wierzchołek w osi okna na wewnętrznym licu ściany, odległość ≥ wysokość przesłaniania, mierzona od dolnej krawędzi okna. W zabudowie śródmiejskiej odległość mniejsza najwyżej o połowę. Zgodne z [muratordom zacienianie], [inzynierbudownictwa nasłonecznienie], [kalkulatorpro]. Test in60: przesunięcie przeszkody liczone poprawnie (|po| − w/2 < d·tg30°).
- Algorytm NOAA (deklinacja, równanie czasu) i czas urzędowy CET/CEST z przełączeniem w ostatnią niedzielę marca i października. Sprawdzone porównaniem wysokości słońca w południe 21.03 w Szczecinie (≈ 36,6°, czyli 90° − 53,43° + 0°).

### Błędy
1. **Sprawdzany jest tylko 21 marca** – ISTOTNY.
   § 60 mówi o „dniach równonocy”. Opinie izby architektów (MPOIA, ZR 63) i narzędzia branżowe wymagają obu dni. W jesiennym dniu równonocy obowiązuje czas letni, więc przedział 7–17 CEST to 6–16 CET. Okna zachodnie i południowo-zachodnie dostają we wrześniu mniej słońca w przedziale (Szczecin, okno W bez przeszkód: 4,50 h w marcu, 3,75 h we wrześniu).
   Skutek: na siatce testowej 11 przypadków „spełnia” w marcu (≥ 3 h) daje < 3 h we wrześniu, np. okno W, budynek 7 m w odległości 10 m: 3,00 h w marcu, 2,92 h we wrześniu. Legenda „21 marca / 23 września” sugeruje identyczny wynik.
   Źródła: [architekturaibiznes opinia ZR 63], [architekturaibiznes § 60], [kalkulatorpro] (obie daty, czas letni 21.09), [MPOIA linijka słońca] (czas letni we wrześniu).
   Poprawka (4 części, w JSON): dodatkowy `day(st, 9, 23)`, wynik = min z obu dni, kafel pokazuje oba dni, werdykt wskazuje dzień miarodajny, poprawiona legenda.
2. **Pomijana próbka 7:00 (błąd zmiennoprzecinkowy)** – DROBNY.
   Pętla `t += 1/12` daje t = 6,99999… dla 7:00, więc warunek t ≥ 7 jest fałszywy. Wynik zaniżony o 5 min (9,92 zamiast 10,0 h; okno wschodnie 4,83 zamiast 4,92 h).
   Poprawka: pętla po indeksie całkowitym (i = 36…155 to 7:00–16:55).
3. **§ 13 bez limitu 35 m** – DROBNY.
   Dla obiektu wyższego niż 35 m wymagana odległość wynosi 35 m, a program żąda pełnej wysokości (budynek 50 m: „za blisko” już przy 40 m).
   Źródła: [muratordom zacienianie], [kalkulatorpro], [inzynierbudownictwa nasłonecznienie].
   Poprawka: `need: st.srodm ? n('ph') / 2 : n('ph')` → `need: Math.min(n('ph'), 35) / (st.srodm ? 2 : 1)` oraz uzupełnienie opisu podstawy.

### Wątpliwe
- **Czas urzędowy czy słoneczny dla 7–17.** Przepis tego nie rozstrzyga. Część praktyki (linijka słońca) liczy w czasie słonecznym miejscowym, kalkulatorpro i ten program w urzędowym. Zostawiłem czas urzędowy, ale warto dopisać zdanie, że przyjęto czas urzędowy.
- **Pole widzenia okna ±85° i próg wysokości słońca 1°** to przyjęcia autorskie, bez podstawy w przepisie (źródła wskazują brak jednej metody). Rozsądne, ale nienormowe.
- **Drzewo jako przeszkoda w § 60:** źródła wskazują rozbieżności, czy zieleń wysoką się uwzględnia (Gachowski 2021). Program to opcjonalnie dopuszcza, i dobrze.
- Data 21.03 zamiast faktycznej równonocy (20.03) zmienia wynik w granicach dokładności.

---

## Źródła
1. [Obciążenie śniegiem – przykłady (PWr)](https://wbliw.pwr.edu.pl/download/3cVRVFdUA2LFJaEEhXCQdUbDtXUH1uXlxAXUoBPgZ4RX9QDkthUQd2AloTSmFdVAhWCX1TamZEVl5YcUg-AwlaeVU,UCE0gAOAEAKVMsTActCgYIAFEBFz07CR9bSmNFHkJOGSgQUw88AEstQCFVTT4SWhZAFVZKaHU/obciazenie_sniegiem_przyklady_5.pdf) — Politechnika Wrocławska — wzory s_k stref 1–5, C_e 0,8/1,0/1,2, μ1, μ1 ≥ 0,8 przy zabezpieczeniu przed zsuwaniem, przypadki 0,5μ1
2. [Snow PN (designforms)](https://designforms.net/WebUser/Pub/Resources/Load/Snow/PN.htm) — designforms.net — s_k stref 1–5 i minima wg NA
3. [Projekt – obciążenia (Pollub)](https://wbia.pollub.pl/fcp/8PREgARcJNScXKxEMUA9DBXljWXdFEjNQZ18Qc21Xcgpmc2oRPBIWBHJ-QQQUSg8/_global/public/wbia/files/81/attachment/3548os-1projekt.pdf) — Politechnika Lubelska — c_e = 1,9(z/10)^0,26 (III), c_e(8 m) = 1,793, v_b,0 = 22, s_k strefy 3 z minimum 1,2
4. [Wpływ kształtu dachu na obciążenie śniegiem cz. I](https://inzynierbudownictwa.pl/?p=7715) — Inżynier Budownictwa — C_e 0,8/1,0/1,2, C_t
5. [Wpływ kształtu dachu na obciążenie śniegiem cz. II](https://inzynierbudownictwa.pl/?p=7805) — Inżynier Budownictwa — μ ≥ 0,8 przy płotkach śniegowych i attyce
6. [Snow load of pitched roofs](https://structuralbasics.com/how-to-calculate-the-snow-load-of-a-pitched-roof/) — structuralbasics — μ1 = 0,8(60 − α)/30, s = μ·C_e·C_t·s_k
7. [Obciążenie śniegiem wg Eurokodu 1](https://inzynierbudownictwa.pl/obciazenie-sniegiem-wg-eurokodu-1-norma-pn-en-1991-1-3/) — Inżynier Budownictwa — wartości stref, wzór ogólny
8. [PN-EN 1991-1-4:2008 (e-oze wiki)](https://e-oze.pl/wiki/index.php/PN-EN_1991-1-4:2008) — e-oze — tablice NA.1 i NA.3, z_min
9. [Wykład 4 – aerodynamika (PW)](https://meil.pw.edu.pl/daas/content/download/61569/322567/file/Wyk%C5%82ad_4_Aero_S_U.pdf) — Politechnika Warszawska — c_r i c_e dla kategorii 0–IV, v_b,0, q_b,0
10. [Wind PN (designforms)](https://designforms.net/WebUser/Pub/Resources/Load/Wind/PN.htm) — designforms.net — v_b,0 i korekta 0,0006(A − 300), ρ, c_dir
11. [Wykład 15 – wiatr (PWr)](https://wbliw.pwr.edu.pl/download/1fUhJCckcxK1VdF09QDgBTazxQV3ppWVtHWk0GOQF_WmNfDEx4bF8tPzVJU2tZ,9QbTZ-Rn9-Vy1SMnlTdHh2fi9_aUNFd2ElMxQwbiFqYUB5PHNRaCVGPU53bFwvPmA7cys0/wyklad_15_7.pdf) — Politechnika Wrocławska — e = min(b; 2h), pasy e/4, e/10, e/2
12. [Obciążenie wiatrem – przykłady (PWr)](https://wbliw.pwr.edu.pl/download/ESE1MDMwZwahQcVg4RT0ESKn0RFjsoGBoGGwxHeEA-AzkWSA0nF0EwRBxRCy8KB0IYfRQXJCMQFxUbKigSXhEIPQ,tbE0gAOAEAKVMsTActCgYIAFEBFz07CR9bSmNFHkJOGSgQUw88AEstQCFVTT4SWhZAFVZKaHU/obciazenie_wiatrem_przyklady_5.pdf) — Politechnika Wrocławska — c_pe dla 25° (zgodne z interpolacją kodu), v_b,0 strefy 3
13. [Oddziaływanie wiatru (Soldis)](https://soldis-school.pl/docs/soldis-2d/hala-portalowa-zelbetowa/hala-zelbetowa-wiatr/oddzialywanie-od-wiatru-wedlug-normy-pn-en-1991-1-4-20-05/) — Soldis — c_pi +0,2/−0,3, z_min kategorii III, korekta wysokościowa
14. [Warunki klimatyczne](https://blog.ongeo.pl/warunki-klimatyczne) — Ongeo — opis stref wiatrowych i śniegowych
15. [Design of timber structures vol. 2](https://www.universityofgalway.ie/media/timberengineeringresearchgroup/Design-of-timber-structures_Volume2_Rules-and-formulas-according-to-Eurocode-5.pdf) — Swedish Wood / University of Galway — k_mod, γ_M 1,3, C24 (24 / 11 000 / 7 400), k_def 0,6/0,8/2,0
16. [Timber deflections to EC5](https://help.masterseries.com/knowledge/article/2149) — MasterSeries — k_def drewna litego
17. [SGU wg EC5 – dopuszczalne ugięcia](https://docs.dietrichs.com/dietrichs-intelligent-documentation/docs-pol/informacje-ogolne/wissenssammlungen_dodatkowe-informacje/sgu-wg-ec5-dopuszczalne-ugiecia) — Dietrich's — l/200 dla elementów więźb wg NA.3
18. [Analiza porównawcza PN-B i PN-EN – drewno (Pollub BiA)](https://ph.pollub.pl/index.php/bia/article/download/2256/1913/7308) — Politechnika Lubelska — k_mod 0,9 przy śniegu i wietrze, ψ2·k_def śniegu, l/200
19. [Comparison of EN 1990 ψ factors](https://core.ac.uk/download/153416452.pdf) — CORE — ψ0 śnieg 0,5, wiatr 0,6, ψ2 = 0
20. [§ 60 nasłonecznienie](https://arslege.pl/naslonecznienie-pomieszczen/k218/a23207/) — arslege — treść § 60 (3 h, 7–17, 1,5 h, jeden pokój)
21. [Oświetlenie i nasłonecznienie – WT](https://www.architekturaibiznes.pl/prawo/warunki-techniczne/dzial-III/rozdzial-2/2-oswietlenie-i-naslonecznienie.html) — Architektura & Biznes — § 60 i komentarz: obie równonoce
22. [Opinia ZR 63: nasłonecznienie](https://www.architekturaibiznes.pl/opinia/opinia-nr-zr-63-naslonecznienie-109.html) — Architektura & Biznes (MPOIA) — „dniach”, czyli obie równonoce
23. [Zacienianie i przesłanianie budynków](https://muratordom.pl/prawo/formalnosci-budowlane/zacienianie-i-przeslanianie-budynkow-co-musisz-wiedziec-planujac-budowe-lub-nasadzenia-aa-sFEb-eodK-nq23.html) — Murator — § 13 (60°, 35 m, połowa w śródmieściu), § 60
24. [Nasłonecznienie budynków](https://inzynierbudownictwa.pl/?p=23861) — Inżynier Budownictwa — § 60 i § 13, 1,5 h
25. [Kalkulator nasłonecznienia (WT § 60) i przesłaniania (§ 13)](https://kalkulatorpro.pl/architektura/kalkulator-naslonecznienia/) — kalkulatorpro — obie równonoce, czas letni we wrześniu, 35 m
26. [Linijka słońca](https://www.mpoia.pl/images/2szkolenia/2016-02-linijka-slonca/2016-02-linijka-slonca.compressed.pdf) — MPOIA — czas urzędowy a słoneczny w dniach równonocy
27. [Gachowski: wymóg nasłonecznienia](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-0d1b9ef0-edbd-4592-bb08-adc20118d9fd/c/Gachowski_M_Wymog_11_2021.pdf) — BazTech — zieleń wysoka a § 60 (wątpliwość)
28. [§ 72 wysokość pomieszczeń](https://arslege.pl/wysokosc-pomieszczen-przeznaczonych-na-pobyt-ludzi/k218/a23219) — arslege — 2,2 m na poddaszu, średnia, 1,9 m
29. [Wysokość pomieszczeń w budynku](https://inzynierbudownictwa.pl/wysokosc-pomieszczen-w-budynku/) — Inżynier Budownictwa — § 72, 1,9 m
30. [§ 20 rozporządzenia o projekcie budowlanym](https://arslege.pl/czesc-opisowa-projektu-architektoniczno-budowlanego/k1875/a130411/) — arslege — 2,20 m 100%, 1,40 m 50%, < 1,40 m pomija się
31. [Art. 4 ustawy o podatkach i opłatach lokalnych](https://www.nowysacz.pl/content/resources/miasto/gospodarka/przedsiebiorczosc/obowiazujace_podatki/art_4_ustawa_oplaty.pdf) — Urząd Miasta Nowy Sącz — 1,40–2,20 m 50%
32. [Obliczanie powierzchni użytkowej](https://inzynierbudownictwa.pl/obliczanie-powierzchni-uzytkowej/) — Inżynier Budownictwa — redukcja 2,20/1,40 z PN-B-02365, nie z PN-ISO 9836
33. [Wskaźniki powierzchniowe wg PN-ISO 9836](https://inzynierbudownictwa.pl/wskazniki-powierzchniowe-wedlug-pn-iso-9836/) — Inżynier Budownictwa — PN-ISO 9836 nie podaje redukcji, robi to rozporządzenie § 20
34. [PN-ISO 9836:1997](https://pewnylokal.pl/porady/pn-iso-98361997) — pewnylokal — 2,20/1,40 z PN-70/B-02365, 1,90 m w PN-ISO 9836:2015
35. [Application of PN-EN 12056-3 for eaves gutters](https://journals.pcz.pl/instal/en/article/download/32/31/60) — Instal / Politechnika Częstochowska — Q_N, Q_L = 0,9Q_N, f 0,2–0,33
36. [Manual for the design of roof drainage systems SR620](https://eprints.hrwallingford.com/495/1/Manual-roof-drainage-system-HRWallingford-SR620.pdf) — HR Wallingford — A_H + ½A_V, Q_N, 0,9·F_L, W = Z, Wyly-Eaton (k_b 0,25, f 0,33)
37. [Myczka: przepustowość rynien](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-article-BTB2-0061-0094/c/Myczka_Przepustowosc_4_2010.pdf) — BazTech — F_L = 0,96 dla L/W = 77, W = głębokość
38. [Prawidłowe obliczenia odwadniania dachów](https://inzynierbudownictwa.pl/prawidlowe-wykonywanie-obliczen-do-projektow-systemow-odwadniania-dachow/) — Inżynier Budownictwa — 0,030 l/(s·m²) z wycofanej PN-92/B-01707
39. [Calculation of roof drainage in Poland – rainfall intensities](https://journals.pcz.pl/instal/article/view/283) — Instal — deszcz 5-minutowy z danych lokalnych (PANDa), krytyka zaniżania
40. [Hinweise Regenwassernutzung](https://archiv-202101.aidenbach.de/fileadmin/user_upload/dateien/merkblaetter/hinweiseregenwassernutzung.pdf) — Gmina Aidenbach — zbiornik 6% mniejszej z wartości zbioru i zapotrzebowania (DIN 1989-1)
41. [Kąt dachu a dobór pokrycia](https://muratordom.pl/budowa/dach/kat-dachu-jaki-ma-wplyw-na-dobor-pokrycia-dachowego-aa-rxUK-nHmb-cWoR.html) — Murator — minimalne kąty pokryć
42. [RHEINZINK roofing brochure 05/2026](https://www.rheinzink.com/fileadmin/redaktion/RHEINZINK_GLOBAL/Downloads/Brochure-Productinformation/brochure-roofing-05-2026.pdf) — RHEINZINK — podwójny rąbek 3–25°

Pozycje do zapamiętania przez sesję główną: brak (nic nowego o użytkowniku).
