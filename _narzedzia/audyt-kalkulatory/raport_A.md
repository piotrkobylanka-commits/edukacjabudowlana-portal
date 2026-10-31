# Raport audytu – agent A (31.10.2026)

Zakres: PRO `przegroda`, PRO `ozc`, PRO `went`, prosty kalkulator `rosa` (moduł `ROSA`).
Metoda: kod obliczeń wycięty z `index.html` i uruchomiony w Node (atrapa przeglądarki, prawdziwe `PX`, `PX.MAT`, `PX.CLIM`). Policzyłem przypadki domyślne, 8 wariantów ROSA, 3024 kombinacje przegród w Glaserze (3 miasta × 3 klasy wilgotności × 6 warstw wewnętrznych × 7 izolacji × 8 warstw zewnętrznych) i przypadki brzegowe (pusta lista, prędkość 0, pomieszczenie 6 °C). Wszystkie poprawki z `poprawki_A.json` nałożyłem na kopię `index.html`. Każdy fragment `stare` występuje w oryginale dokładnie raz. Po nałożeniu wszystkich poprawek główny skrypt przechodzi `node --check`, a wszystkie cztery kalkulatory liczą i renderują wynik (`out`).

Uwaga: `PX.CLIM` (strefy i temperatury miast) to dane wspólne. Poprawki O-1 i O-2 zmieniają też wyniki „Przegrody” (temperatura obliczeniowa dla Warszawy i Łodzi) oraz innych programów, które korzystają z `PX.CLIM`.

---

## 1. PRO `przegroda`

### Sprawdzone i poprawne
- Opór i U: R = d/λ, R_T = R_si + ΣR + R_se. Dla domyślnej ściany ręcznie wychodzi R_T = 6,901 i U = 0,1449, program daje to samo. Opory przejmowania 0,13 / 0,10 / 0,17 i R_se 0,04, a przy pomieszczeniu nieogrzewanym R_se = R_si (PN-EN ISO 6946, tabl. 7).
- Ocena pleśni: R_si = 0,25, φ_si,cr = 0,8, f_Rsi = 1 − R_si·U (PN-EN ISO 13788, pkt 5). Wymaganie f_Rsi ≥ 0,72 wynika z WT zał. 2 pkt 2.2.2. Przyjęcie max(0,72; f_Rsi,krytyczne z miesięcy) jest poprawne.
- Ciśnienie nasycenia (`PX.psat`) ma stałe 610,5 / 17,269 / 237,3 nad wodą i 21,875 / 265,5 nad lodem (PN-EN ISO 13788, zał. E). Program daje p_sat(20) = 2337 Pa, a dane tablicowe 2338 Pa.
- δ₀ = 2·10⁻¹⁰ kg/(m·s·Pa). Ciśnienie wewnątrz p_i = p_e + 1,1·Δp, gdzie Δp maleje liniowo do 0 przy 20 °C. Bilans zaczyna się od pierwszego miesiąca z kondensacją, a ujemna akumulacja jest zerowana (PN-EN ISO 13788, pkt 6).
- U_max: ściana 0,20, dach/stropodach 0,15, strop nad piwnicą 0,25, ściana do pomieszczenia nieogrzewanego 0,30 (WT zał. 2, tabl. 1, poz. 1a, 5a, 7a, 2c). Kondensacja międzywarstwowa jest dopuszczalna, gdy kondensat wysycha latem (WT pkt 2.2.5).
- Wzór na brakującą grubość izolacji (`need`) poprawnie uwzględnia ΔU.

### Błędy

**P-1. Kondensacja międzywarstwowa (bilans miesięczny) liczona tylko na granicach warstw – ISTOTNY**
- Opis: funkcja `state()` w `calc` (12 miesięcy, bilans roczny, wynik „Kondensacja: brak/wysycha/narasta”) bierze punkty styku tylko na granicach rzeczywistych warstw. PN-EN ISO 13788 (pkt 6) zaleca dzielić warstwy o oporze cieplnym większym niż 0,25 m²K/W na warstwy umowne o R ≤ 0,25. Wtedy krzywa nasycenia wewnątrz grubej izolacji jest próbkowana, a kondensacja w jej głębi zostaje wykryta. Widok „Przekrój” (`pzCalc`, K = 10) i kalkulator ROSA dzielą warstwy. Bilans roczny i KPI tego nie robią, więc wyniki na jednej stronie są ze sobą niespójne.
- Skutek: w 56 z 3024 sprawdzonych kombinacji (1,9%) program pokazuje „brak kondensacji”, choć przy podziale warstw kondensacja występuje (maks. 5–40 g/m²). Dotyczy głównie klasy wilgotności 4 i mroźnych miast (np. Suwałki: beton komórkowy 24 + EPS 20 + OSB: przed poprawką 0 g/m², po poprawce 24,8 g/m², „wysycha”). Werdykt roczny „narasta/wysycha” nie zmienił się w żadnym przypadku, ale użytkownik dostaje mylne „brak kondensacji” w KPI i komunikacie. Kalkulator jest przy tym niezgodny z PN-EN ISO 13788 i z własnym widokiem przekroju.
- Podstawa: PN-EN ISO 13788:2013, pkt 6 (podział na warstwy umowne R ≤ 0,25 m²K/W; tekst normy w źródle nr 15), DesignBuilder – Condensation Analysis (płaszczyzny kondensacji także wewnątrz warstwy izolacji: 100 mm i 108,3 mm, źródło nr 17).
- Poprawka (6 części, stosować razem). Podwarstwy `lsG` służą tylko do Glasera i wykresu. `ls` zostaje bez zmian dla U, tabeli i przekroju:

_Glaser miesięczny: podział warstw o R > 0,25 m²K/W na podwarstwy (PN-EN ISO 13788) – część 1/6: tablica podwarstw lsG_

```js
// stare
if (!ls.length) throw new Error('dodaj co najmniej jedną warstwę');
// nowe
if (!ls.length) throw new Error('dodaj co najmniej jedną warstwę');
  const lsG = ls.flatMap(x => { const k = Math.max(1, Math.ceil(x.R / .25 - 1e-9)); return Array.from({length: k}, () => Object.assign({}, x, {d: x.d / k, R: x.R / k, sd: x.sd / k})); });
```

_Glaser – część 2/6: obliczenia miesięczne na podwarstwach_

```js
// stare
const S = state(ls, T, ti, te, pi, pe), tsimin
// nowe
const S = state(lsG, T, ti, te, pi, pe), tsimin
```

_Glaser – część 3/6: zwrócenie lsG z calc_

```js
// stare
need, start};
// nowe
need, start, lsG};
```

_Glaser – część 4/6: oś wykresu Glasera według podwarstw_

```js
// stare
const xs = [0]; r.ls.forEach(l => xs.push(xs[xs.length - 1] + l.d * 100));
// nowe
const xs = [0]; r.lsG.forEach(l => xs.push(xs[xs.length - 1] + l.d * 100));
```

_Glaser – część 5/6: pasy warstw na wykresie według podwarstw_

```js
// stare
const bands = r.ls.map((l, i) => ({x0: xs[i], x1: xs[i + 1], c: l.c, o: .35}));
// nowe
const bands = r.lsG.map((l, i) => ({x0: xs[i], x1: xs[i + 1], c: l.c, o: .35}));
```

_Glaser – część 6/6: przy podwarstwach płaszczyzna kondensacji może przesunąć się na sąsiednią granicę; sumuj kondensację w każdym miesiącu, w którym występuje_

```js
// stare
if (c) g = x.S.cond.reduce((s, c) => s + c.g, 0);
// nowe
if (c || x.S.cond.length) g = x.S.cond.reduce((s, c) => s + c.g, 0);
```

Sprawdzone: po poprawce wynik zgadza się z podziałem na 20 podwarstw (np. 24,6 wobec 24,7 g/m²). KPI dla ściany domyślnej się nie zmieniają, wykres Glasera renderuje się poprawnie.

**P-2. Opisy klas wilgotności niezgodne z PN-EN ISO 13788:2013 – DROBNY**
- Opis: lista `KLASY` opisuje klasy według wydania z 2001 r. („3 – mieszkania”, „4 – mieszkania z dużą liczbą osób”). Podpowiedź każe wybrać klasę 5 dla łazienki. W wydaniu z 2013 r. klasa 2 to biura i mieszkania o normalnym użytkowaniu, 3 – użytkowanie nieznane, 4 – kuchnie, stołówki i hale sportowe, 5 – budynki specjalne (pralnie, baseny). Łazienka w domu nie jest klasą 5 w żadnym wydaniu.
- Skutek: wynik jest po stronie bezpiecznej (zawyżona wilgotność), ale opis normy jest błędny i łazienka z klasą 5 daje fałszywe alarmy o kondensacji.
- Podstawa: PN-EN ISO 13788:2013, tabl. A.1 (źródło nr 15), betterbuilding.io – Internal Conditions (źródło nr 18), DesignBuilder (opis z 2001 r., źródło nr 17).

_Opisy klas wilgotności zgodne z PN-EN ISO 13788:2013 (tabl. A.1)_

```js
// stare
[[1, '1 – magazyny, pomieszczenia suche'], [2, '2 – biura, sklepy'], [3, '3 – mieszkania (typowo)'], [4, '4 – mieszkania z dużą liczbą osób, kuchnie'], [5, '5 – łazienki, pralnie, baseny']]
// nowe
[[1, '1 – budynki nieużytkowane, magazyny suche'], [2, '2 – biura, mieszkania o normalnym użytkowaniu'], [3, '3 – użytkowanie nieznane (bezpiecznie dla domu)'], [4, '4 – kuchnie, stołówki, hale sportowe'], [5, '5 – budynki specjalne: pralnie, baseny']]
```

_Podpowiedź klasy wilgotności – łazienka w domu nie jest klasą 5 normy_

```js
// stare
h: 'Klasa wilgotności wewnętrznej wg PN-EN ISO 13788. Dla domu jednorodzinnego zwykle 3, dla łazienki 5.'
// nowe
h: 'Klasa wilgotności wewnętrznej wg PN-EN ISO 13788. Dla domu jednorodzinnego bezpiecznie 3 (norma dla mieszkań o normalnym użytkowaniu podaje 2). Klasa 5 dotyczy budynków specjalnych, np. basenów i pralni.'
```

### Wątpliwe
- Przegroda typu „dach” obejmuje też strop pod nieogrzewanym poddaszem, a ma R_se = 0,04. PN-EN ISO 6946 dla przegrody do przestrzeni nieogrzewanej każe przyjąć R_si po obu stronach albo opór R_u poddasza. Różnica w U wynosi ok. 1% (po stronie niebezpiecznej, ale znikomo). Typ jest wspólny z importem U do OZC, więc nie zmieniam go.
- Komunikat „> 500 g/m² to dużo dla drewna” – PN-EN ISO 13788 podaje inne kryterium: przy akumulacji ponad 200 g/m² ryzyko spływu z materiałów nienasiąkliwych jest bardzo wysokie (źródło nr 15). Kryterium dla drewna zależy od materiału (wilgotność masowa), więc próg 500 g/m² trudno rozstrzygnąć. Warto dodać zdanie o 200 g/m² dla materiałów nienasiąkliwych.
- Δp klasy 5 = 1350 Pa – jedno źródło (Starakiewicz) podaje 12,0 hPa. Wartość programu jest bezpieczniejsza. Liczb z rys. A.2 normy nie udało się potwierdzić w dwóch źródłach.
- Dane klimatyczne miesięczne są orientacyjne (np. Szczecin średnio 9,3 °C rocznie). Nie są to dane z PN-EN ISO 13788, zał. krajowy, ani z typowych lat meteorologicznych MRiT.

---

## 2. PRO `ozc`

### Sprawdzone i poprawne
- Przenikanie: Φ = A·U·Δθ, strata wentylacyjna H_V = 0,34·V̇ (PN-EN 12831, wzory ogólne; źródła nr 1, 14).
- Podłoga na gruncie: f_g1 = 1,45, f_g2 = (θ_int − θ_m,e)/(θ_int − θ_e) liczone osobno dla każdego pomieszczenia (źródła nr 1, 13, 14).
- Infiltracja: V̇_inf = 2·V·n_50·e·ε. W programie 0,04·n_50·V, co odpowiada e = 0,02 i ε = 1 (średnie osłonięcie, budynek do 10 m; źródła nr 1, 13).
- Wentylacja grawitacyjna: V̇ = max(V̇_inf, V̇_min), n_min = 0,5 h⁻¹ dla pokoi i wywiew z PN-B-03430 (źródła nr 13, 14, 22).
- Mechaniczna z odzyskiem: nawiew ze strumieniem (1 − η) odpowiada temperaturze nawiewu θ_e + η(θ_i − θ_e). Pomieszczenia wywiewne dostają powietrze transferowe o 20 °C.
- b = 0,9 dla nieogrzewanego poddasza z nieizolowanym dachem (Purmo, tabl. 3.4: 1,0 / 0,9 / 0,7; źródło nr 1).
- ΔU_tb 0,05 / 0,10 / 0,15 – zakres zgodny z metodą uproszczoną (źródło nr 1, tabl. 3.1–3.3).
- Temperatury θ_int: pokoje 20 °C, łazienka 24 °C (źródło nr 1, tabl. 2.2).
- Temperatury stref −16 / −18 / −20 / −22 / −24 °C (źródła nr 1, 2, 12, 11).

### Błędy
**O-1. Warszawa i Łódź przypisane do II strefy (−18 °C) zamiast III (−20 °C) – ISTOTNY**
- Opis: w `PX.CLIM` Warszawa i Łódź mają `s:'II', te:-18`. Według PN-82/B-02403 (mapa powtórzona w załączniku krajowym PN-EN 12831) obie leżą w III strefie, −20 °C.
- Skutek: obciążenie cieplne domyślnego domu jest zaniżone o ok. 4,3–5,5% (Warszawa: 3005 W zamiast 3171 W z poprawkami), po stronie niebezpiecznej (za mała pompa ciepła). W „Przegrodzie” ocena pleśni i stan obliczeniowy są liczone przy zbyt ciepłej temperaturze. Dane są wspólne, więc błąd dotyczy też innych programów korzystających z `PX.CLIM`.
- Podstawa: IAQ PW, d2_s6_04 („Warszawa – III strefa (−20 °C)”, „Łódź – III strefa (−20 °C)”, źródło nr 10), Narowski, ZAE 2023 (Warszawa −20, Łódź −20, źródło nr 9), PoliczCiepło – strefa III („Mazowsze z Warszawą”, „województwo łódzkie (Łódź…)”, źródło nr 7), instalatorzpolecenia.pl (źródło nr 4).

_Warszawa leży w III strefie klimatycznej (−20 °C), nie w II (PN-82/B-02403). Dane wspólne PX.CLIM – dotyczy też „Przegrody” i innych programów_

```js
// stare
warszawa:{n:'Warszawa', s:'II', te:-18,
// nowe
warszawa:{n:'Warszawa', s:'III', te:-20,
```

_Łódź leży w III strefie klimatycznej (−20 °C), nie w II (PN-82/B-02403). Dane wspólne PX.CLIM_

```js
// stare
lodz:{n:'Łódź', s:'II', te:-18,
// nowe
lodz:{n:'Łódź', s:'III', te:-20,
```

**O-2. θ_m,e do f_g2 jako średnia ze stacji, a nie wartość strefy z załącznika krajowego – DROBNY**
- Opis: `tm` to średnia z 12 miesięcy `PX.CLIM` (np. Szczecin 9,27 °C, Warszawa 8,53 °C). Załącznik krajowy PN-EN 12831 podaje θ_m,e dla stref: 7,7 / 7,9 / 7,6 / 6,9 / 5,5 °C.
- Skutek: straty przez podłogę na gruncie są zaniżone o ok. 13–15% (Szczecin: 420 → 480 W), całe obciążenie o ok. 2%, po stronie niebezpiecznej.
- Podstawa: Purmo, tabl. 2.1 (źródło nr 1), PIIB „nowa norma”, tabl. 2.1 (źródło nr 2), pewnylokal – PN-EN 12831 (źródło nr 3).

_Podłoga na gruncie: θm,e ze strefy wg załącznika krajowego PN-EN 12831 (7,7/7,9/7,6/6,9/5,5 °C) zamiast średniej ze stacji – straty do gruntu były zaniżone o ok. 13–15%_

```js
// stare
tm = C.t.reduce((s, x) => s + x, 0) / 12
// nowe
tm = ({I: 7.7, II: 7.9, III: 7.6, IV: 6.9, V: 5.5})[C.s] || C.t.reduce((s, x) => s + x, 0) / 12
```

**O-3. Ujemne straty przez podłogę dla pomieszczeń chłodniejszych niż θ_m,e – DROBNY**
- Opis: dla θ_int < θ_m,e (np. pomieszczenie gospodarcze 6 °C) f_g2 < 0 i program liczy ujemną stratę (−7 W), która pomniejsza sumę.
- Skutek: drobne zaniżenie, nielogiczny wynik w tabeli.
- Podstawa: definicja f_g2 (źródła nr 1, 14). Ujemny współczynnik redukcji nie ma sensu fizycznego dla strat do gruntu w stanie obliczeniowym.

_fg2 ujemne dla pomieszczeń chłodniejszych niż θm,e (np. 6 °C) – ujemne straty przez podłogę_

```js
// stare
const fg2 = r.dt > 0 ? (r.t - tm) / r.dt : 0;
// nowe
const fg2 = r.dt > 0 ? Math.max(0, r.t - tm) / r.dt : 0;
```

**O-4. Błędne oznaczenie normy: „PN-EN 12831-1:2017 z załącznikiem krajowym” – DROBNY**
- Opis: zastosowana metoda (f_g1, f_g2, e·ε, ΔU_tb, n_min, strefy) to PN-EN 12831:2006 z załącznikiem krajowym. Tę wersję przywołuje § 134 WT. PN-EN 12831-1:2017 ma inną strukturę i nie ma tego załącznika krajowego (autorzy podkreślają, że mapę stref powtarza załącznik do PN-EN 12831:2006).
- Skutek: mylny opis podstawy prawnej.
- Podstawa: WT, zał. 1 – wykaz norm (PN-EN 12831:2006, § 134 ust. 1, źródło nr 20), Narowski, ZAE 2023 (źródło nr 9).

_Podstawa normowa: zastosowana metoda (fg1 = 1,45, fg2, e·ε, ΔUtb, nmin) to PN-EN 12831:2006 z załącznikiem krajowym – tę wersję przywołują warunki techniczne_

```js
// stare
base: 'PN-EN 12831-1:2017 z załącznikiem krajowym (metoda uproszczona:
// nowe
base: 'PN-EN 12831:2006 z załącznikiem krajowym, wersja przywołana w warunkach technicznych (metoda uproszczona:
```

_Podpowiedź temperatury obliczeniowej – właściwe oznaczenie normy_

```js
// stare
np. wartość ze stacji meteorologicznej wg załącznika krajowego PN-EN 12831-1
// nowe
np. wartość ze stacji meteorologicznej zamiast strefy wg załącznika krajowego PN-EN 12831
```

**O-5. Błąd wykonania przy usunięciu wszystkich pomieszczeń – DROBNY**
- Opis: `out()` odwołuje się do `r.R.slice().sort(...)[0].n`, a przy pustej liście to `undefined.n`, więc program zgłasza wyjątek zamiast wyniku.
- Skutek: pusty lub zepsuty widok. Sprawdzone w Node: po poprawce `out` działa.

_Błąd wykonania przy pustej liście pomieszczeń (out → undefined.n)_

```js
// stare
Najwięcej ciepła potrzebuje <b>${esc(r.R.slice().sort((a, b) => b.Q - a.Q)[0].n)}</b>
// nowe
Najwięcej ciepła potrzebuje <b>${esc((r.R.slice().sort((a, b) => b.Q - a.Q)[0] || {n: '–'}).n)}</b>
```

### Wątpliwe
- e = 0,02 (jedna ściana z otworami) dla wszystkich pomieszczeń. Dla pomieszczeń narożnych norma podaje 0,03 (+50% infiltracji). Przy n_50 = 1,5 wpływ na wynik jest mały, a program nie zbiera liczby ścian z oknami.
- Korytarz i hol (`exh = 0`) dostają w trybie mechanicznym nawiew jak pokoje. W praktyce to strefa przepływu. Suma nawiewu się nie zmienia, zmienia się tylko jej podział między pomieszczenia.
- Zużycie roczne (stopniodni, baza 20 °C dla miesięcy < 13 °C, zyski 4 W/m²·0,9) – program opisuje je jako orientacyjne. Nie jest to metoda z rozporządzenia o charakterystyce energetycznej.
- Progi „< 45 W/m² dom energooszczędny, < 70 standard” to umowna klasyfikacja bez podstawy normowej.
- Lublin w strefie III: instalatorzpolecenia.pl podaje III, PoliczCiepło umieszcza województwo lubelskie w IV. Bez mapy normy nie da się tego rozstrzygnąć.

---

## 3. PRO `went`

### Sprawdzone i poprawne
- Minimalne strumienie wywiewu wg PN-83/B-03430/Az3: kuchnia elektryczna do 3 osób 30, powyżej 3 osób 50, gazowa 70, łazienka 50, WC 30, pomieszczenia pomocnicze 15 m³/h (źródła nr 22, 23). Norma jest przywołana w WT, § 147 i § 149 (źródło nr 20).
- Bilans: większa z sum wywiewu, nawiewu i n_min·V, proporcjonalne podniesienie strony mniejszej. Nawiew w pokojach to max(osoby × strumień na osobę; 0,3·V).
- Liczba rur: ceil(strumień / przepustowość) – zaokrąglenie w górę, po stronie bezpiecznej. Rura Ø75 ma średnicę wewnętrzną ok. 63 mm (FlexiVent: 63,3 mm, źródło nr 25), więc przy 2 m/s przenosi ok. 22,4 m³/h (Viessmann: DN63 do 25 m³/h, źródło nr 29; kb.pl: Ø75 przy 20–25 m³/h, źródło nr 24).
- Przewód główny przy 3,5 m/s – w granicy ≤ 4 m/s dla przewodów głównych (źródło nr 24).
- Odzysk ciepła: 0,34·Q·η·stopniogodziny – metoda orientacyjna, poprawna wymiarowo.

### Błędy
**W-1. Zużycie prądu przez wentylatory zaniżone 3,3 raza – ISTOTNY**
- Opis: `fan = Q * .3 * 8760 / 1000 * sfp`. Pole `sfp` jest w Wh/m³, czyli jest to jednostkowy pobór mocy SPI [W/(m³/h)] z rozporządzenia UE 1253/2014. Moc = SPI·Q. Mnożnik 0,3 nie ma uzasadnienia, a odzysk ciepła ten sam program liczy dla pełnego Q przez cały rok.
- Skutek: domyślnie 213 kWh/rok zamiast 710 kWh/rok (SPI 0,45 × 180 m³/h = 81 W). Bilans opłacalności rekuperacji wychodzi zbyt korzystny.
- Podstawa: rozp. 1253/2014, zał. I pkt 1(13) – definicja SPI w W/(m³/h) (źródło nr 30), karta ErP Wanas 415H: SPI 0,399 W/(m³/h) (źródło nr 31), kb.pl: typowo 300–500 kWh/rok (źródło nr 32; wartość domyślna SPI 0,45 jest raczej górną granicą).

_Roczne zużycie prądu wentylatorów zaniżone 3,3 raza: zbędny mnożnik 0,3 przy jednostkowym poborze SPI [Wh/m³] i stałym strumieniu Q_

```js
// stare
fan = Q * .3 * 8760 / 1000 * n('sfp')
// nowe
fan = Q * 8760 / 1000 * n('sfp')
```

_Opis pola poboru wentylatorów (SPI z karty ErP)_

```js
// stare
{k: 'sfp', t: 'num', l: 'Pobór wentylatorów', u: 'Wh/m³', step: .05}
// nowe
{k: 'sfp', t: 'num', l: 'Pobór wentylatorów', u: 'Wh/m³', step: .05, h: 'Jednostkowy pobór mocy SPI z karty ErP centrali (oba wentylatory), zwykle 0,25–0,45 Wh/m³.'}
```

**W-2. Przewód owalny 132×52: przyjęto 58 mm średnicy „wewnętrznej” – ISTOTNY**
- Opis: przepustowość liczona jest z π·d²/4 przy d = 58 mm (26,4 cm²). Kanał 132×52 ma wnętrze ok. 122×44 mm, czyli ok. 49,5 cm² (średnica równoważna pola ok. 79 mm). Wartość 58 mm to średnica hydrauliczna (4A/P), która nie służy do liczenia przepływu z prędkości.
- Skutek: przepustowość jednego przewodu przy 2 m/s wynosi 19 m³/h zamiast ok. 35 m³/h. Program podaje 23 przewody owalne zamiast 13, więc zawyża koszt i liczbę króćców rozdzielacza prawie dwukrotnie.
- Podstawa: karta Hybalans+ 132×52: wnętrze 122×44 mm, maks. 55 m³/h (źródło nr 26), Zehnder ComfoTube flat 51: przekrój 47,5 cm², średnica hydrauliczna 58,3 mm, zalecane 40–47 m³/h (źródła nr 27, 28).

_Przewód owalny 132×52: przekrój wewnętrzny ok. 122×44 mm ≈ 49,5 cm² (średnica równoważna pola ≈ 79 mm), a nie 58 mm (to średnica hydrauliczna) – liczba przewodów owalnych zawyżona prawie 2 razy_

```js
// stare
o63: ['Przewód owalny 132×52', 58]
// nowe
o63: ['Przewód owalny 132×52', 79]
```

**W-3. Prędkość 0 lub puste pole daje nieskończoną liczbę rur – DROBNY**
- Skutek: w KPI pojawia się „Infinity” przewodów.

_Prędkość 0 lub puste pole daje nieskończoną liczbę rur_

```js
// stare
vmax = n('vr')
// nowe
vmax = Math.max(n('vr'), .5)
```

**W-4. Opis KPI „praca ok. 60–70% wydajności” niezgodny z doborem – DROBNY**
- Opis: centrala jest dobierana tak, żeby Q ≤ 0,7·wydajność, więc obciążenie wynosi od kilkunastu do 70%. Przykład: domyślnie 180/350 = 51%.

_Opis KPI centrali niezgodny z doborem (dobór: obciążenie do 70%, nie 60–70%)_

```js
// stare
s: 'praca ok. 60–70% wydajności'
// nowe
s: 'praca do ok. 70% wydajności'
```

### Wątpliwe
- „Aneks kuchenny w salonie” ma 50 m³/h, co odpowiada kuchence elektrycznej. Przy kuchence gazowej norma wymaga 70 m³/h, a typ nie rozróżnia rodzaju kuchenki.
- Maks. 2 m/s w przewodach do pomieszczeń – w poradnikach dla sypialni pojawia się 1,0–1,5 m/s (kb.pl, źródło nr 24), a producenci podają przepływ przy 2,5–3 m/s. Wartość 2 m/s jest rozsądna, ale nie normowa.
- Średnica wewnętrzna Ø90 = 76 mm – nie znalazłem karty z tą wartością (zwykle 76–78 mm). Mała zmiana byłaby po stronie bezpiecznej.
- Strumień na osobę 20–30 m³/h i 0,3 wymiany – wartości projektowe z PN-EN 16798-1 i praktyki. Treści normy nie weryfikowałem w dwóch źródłach.

---

## 4. Kalkulator `rosa` (moduł ROSA)

### Sprawdzone i poprawne
- Punkt rosy jest odwrotnością tego samego wzoru Magnusa co `ps` (nad wodą 17,269/237,3, nad lodem 21,875/265,5). Dla 20 °C i 50% wychodzi T_d = 9,27 °C (wartość tablicowa 9,3 °C). Stałe Magnusa: źródła nr 33, 34. W PX.dew (17,62/243,12, Sonntag) różnica wynosi poniżej 0,05 K.
- U: w wariancie w1 ręcznie i w programie wychodzi 0,172 W/(m²K), f_Rsi = 0,958. R_si 0,13/0,10, R_se 0,04, przy szczelinie wentylowanej R_se = R_si i warstwy za szczeliną pominięte (PN-EN ISO 6946; źródło nr 21).
- Ocena pleśni przy R_si = 0,25 i 80%, f_Rsi ≥ 0,72 (źródła nr 15, 19). U_max 0,20 / 0,15 / 0,15 (źródło nr 19).
- Glaser z podziałem na podwarstwy (do 24 na warstwę) i dolną otoczką wypukłą („naciągnięta nić”) jest zgodny z PN-EN ISO 13788. Ilość kondensatu to strumień dopływający minus odpływający (źródło nr 15).
- Wyniki wariantów są fizycznie spójne: w9 (wełna od wewnątrz bez folii) daje 88 g/(m²·doba), w10 z folią PE 0. d3 (dach bez paroizolacji) daje 32, d1 z PE 0. Opory dyfuzyjne folii: PE s_d = 100 m, papa 200 m, membrana 0,02 m – zgodne z opisami w bazie.

### Błędy
**R-1. Błędne przykłady miast przy strefach klimatycznych – ISTOTNY**
- Opis: lista `STREFY` podaje „I strefa: −16 °C (m.in. Szczecin, Wrocław)”, „II strefa: −18 °C (m.in. Gdańsk, Poznań, Łódź)”. Wrocław leży w II strefie (−18 °C), Gdańsk w I (−16 °C), Łódź w III (−20 °C). Opis jest też sprzeczny z `PX.CLIM` (Gdańsk I, Wrocław II).
- Skutek: użytkownik z Wrocławia wybierze −16 °C zamiast −18 °C, a z Łodzi −18 °C zamiast −20 °C. Ocena pleśni i kondensacji jest wtedy liczona przy zbyt ciepłym mrozie, po stronie niebezpiecznej.
- Podstawa: PoliczCiepło – strefa II („Wrocław · Poznań”, źródło nr 6), instalatorzpolecenia.pl (Szczecin i Gdańsk w I, Wrocław w II, Łódź w III, źródło nr 4), IAQ PW i Narowski (Łódź III, źródła nr 9, 10).

_Opisy stref klimatycznych: Wrocław leży w II strefie, Gdańsk w I, Łódź w III (PN-82/B-02403)_

```js
// stare
['-16', 'I strefa: −16 °C (m.in. Szczecin, Wrocław)'], ['-18', 'II strefa: −18 °C (m.in. Gdańsk, Poznań, Łódź)'], ['-20', 'III strefa: −20 °C (m.in. Warszawa, Kraków)']
// nowe
['-16', 'I strefa: −16 °C (m.in. Szczecin, Gdańsk)'], ['-18', 'II strefa: −18 °C (m.in. Poznań, Wrocław)'], ['-20', 'III strefa: −20 °C (m.in. Warszawa, Kraków, Łódź)']
```

**R-2. Opis metody pomija R_se = 0,10 dla stropu pod poddaszem – DROBNY**
- Opis: `TYP.strop` ma R_se = 0,10, a w „Założeniach” jest napisane, że R_se = 0,04. Wynik jest poprawny (PN-EN ISO 6946 dla przestrzeni nieogrzewanej), niezgodny jest tylko tekst.

_Opis metody: dla stropu pod nieogrzewanym poddaszem program stosuje Rse = 0,10 (PN-EN ISO 6946), a opis podaje tylko 0,04_

```js
// stare
R<sub>se</sub> = 0,04 m²K/W. Przy szczelinie
// nowe
R<sub>se</sub> = 0,04 m²K/W (strop pod nieogrzewanym poddaszem: 0,10 m²K/W). Przy szczelinie
```

### Wątpliwe
- Sprawdzenie „przy −2 °C i 90%” jest nazwane średnią temperaturą zimy. Dla Polski to rozsądne przybliżenie (średnia styczniowa od −4 do +0,3 °C), ale nie zależy od wybranej strefy.
- Wilgotność zewnętrzna domyślnie 85% przy −20 °C – wartość ostrożna. PN-EN ISO 13788 przy ocenie stanu ustalonego nie narzuca tej wartości.

---

## Podsumowanie
| Kalkulator | KRYTYCZNY | ISTOTNY | DROBNY |
|---|---|---|---|
| przegroda | 0 | 1 | 1 |
| ozc | 0 | 1 | 4 |
| went | 0 | 2 | 2 |
| rosa | 0 | 1 | 1 |

Liczba wpisów w `poprawki_A.json`: 22. Poprawki P-1 (6 wpisów), O-1 (2), O-4 (2) i W-1 (2 – obliczenie i podpowiedź) należy stosować w całości.

## Źródła
1. [Poradnik Purmo – nowa metoda obliczania wg PN-EN 12831](https://www.purmo.com/docs/Poradnik-Purmo-nowa-metoda-obliczania_12831_01_2012.pdf) — Purmo — strefy −16…−24 °C i θ_m,e 7,7/7,9/7,6/6,9/5,5; f_g1 = 1,45, f_g2, G_w; infiltracja 2·V·n_50·e·ε; b_u 1,0/0,9/0,7; ΔU_tb 0,05–0,15; θ_int (łazienka 24 °C)
2. [Nowa norma – projektowe obciążenie cieplne](https://pdl.piib.org.pl/wp-content/uploads/2024/09/nowa_norma.pdf) — Podlaska OIIB — tabela stref i θ_m,e, podział stref „odpowiada dokładnie” PN-82/B-02403
3. [Jak audytor oblicza obciążenie cieplne – PN-EN 12831](https://pewnylokal.pl/jak-audytor-oblicza-obciazenie-cieplne-budynku-norma-pn-en-12831) — pewnylokal.pl — tabela stref i θ_m,e; V̇ = max(V̇_inf, V̇_min)
4. [Strefy klimatyczne Polski a dobór pompy ciepła](https://instalatorzpolecenia.pl/aktualnosci/strefy-klimatyczne-polski-a-dobor-pompy-ciepla-czemu-ta-sama-pompa-nie-wystarczy-w-suwalkach-i-w-szczecinie) — Instalator z Polecenia — Szczecin i Gdańsk w I; Poznań i Wrocław w II; Warszawa, Łódź, Kraków w III; Białystok, Olsztyn w IV; Suwałki, Zakopane w V
5. [Strefy klimatyczne w Polsce – PN-82/B-02403](https://ozc.pl/wiedza/strefy-klimatyczne) — ozc.pl — Zakopane w V, Szczecin w I (regionalnie), strefy −16…−24 °C
6. [Strefa klimatyczna II](https://policzcieplo.pl/strefa-klimatyczna/2) — PoliczCiepło — Wrocław i Poznań w II strefie
7. [Strefa klimatyczna III](https://policzcieplo.pl/strefa-klimatyczna/3) — PoliczCiepło — Mazowsze z Warszawą i województwo łódzkie w III
8. [Atlas klimatyczny](https://policzcieplo.pl/atlas-klimatyczny) — PoliczCiepło — I strefa „Pomorze · Zachód”, II „Wielkopolska · Dolny Śląsk”
9. [P. Narowski – Nowe dane do obliczeń energetycznych budynków](https://zae.org.pl/wp-content/uploads/2023/10/2.-Piotr-Narowski-Nowe-dane-meteorologiczne.pdf) — ZAE — Warszawa −20, Łódź −20, Suwałki i Zakopane −24; załącznik do PN-EN 12831:2006 powtarza mapę PN-82
10. [Obliczenia projektowe – dane 1971–2000](https://iaq.is.pw.edu.pl/wp-content/uploads/d2_s6_04.pdf) — Politechnika Warszawska — „Warszawa – III strefa (−20 °C)”, „Łódź – III strefa (−20 °C)”
11. [Temperatury obliczeniowe – NE 2-3/2020](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-933534d7-a3ee-4f6b-91fd-9c85641a47ac/c/NE_2-3_2020_11-13.pdf) — BazTech — Poznań −18 °C (II strefa), tabela PN-82/B-02403
12. [P. Narowski – Fizyka Budowli w Teorii i Praktyce, t. VI](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-988bcc40-51cf-49f0-8a8e-e878b45cdb39/c/Narowski.pdf) — BazTech — pięć stref PN-82, −16…−24 °C
13. [Straty ciepła – wykład](https://wis.pwr.edu.pl/download/b0VxdHd0I0KVVYEkpVCwVWbjlVUn9sXF5CX0gDPAR6X0ACOlttRAppHFgBT29KXQJuXg5Rfng,UZClEZIRgZMEo1VR40Ex8RGUgYDiQiEAZCX3NaERwLEDAPWQcgH1ciS3VPF3hUXA1DClI/w_3_straty_ciepla_8.pdf) — Politechnika Wrocławska — H_T,ig = f_g1·f_g2·ΣA·U_equiv·G_w; ε = 1 do 10 m; n_min = 0,5 h⁻¹
14. [M. Strzeszewski – Nowa metoda obliczania strat ciepła, cz. 2](https://strzeszewski.is.pw.edu.pl/articles/mi_straty2.pdf) — PW — f_g1 = 1,45, f_g2, V̇_min = n_min·V, H_V = 0,34·V̇
15. [PN-EN ISO 13788:2013-05 (tekst)](https://static.pewnylokal.pl/norma-budowlana-pn-en-iso-13788-2013-05-za-darmo-23518.pdf) — pewnylokal.pl / PKN — R_si 0,25; φ_si,cr 0,8; f_Rsi = 1 − R_si·U; δ₀ = 2·10⁻¹⁰; podział warstw R > 0,25; start bilansu; tabl. A.1 klas; 200 g/m²
16. [Starakiewicz – ocena ryzyka kondensacji](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-2367cdfd-d484-45d0-a93e-4739964e4cfe/c/Starakiewicz.pdf) — BazTech — p_i = p_e + 1,1·Δp; φ_si = 0,8; klasy Δp
17. [Condensation Analysis](https://designbuilder.co.uk/helpv7.0/Content/CondensationAnalysis.htm) — DesignBuilder — opis klas wg ISO 13788 (wydanie 2001), płaszczyzny kondensacji wewnątrz warstwy
18. [Internal Conditions](https://docs.betterbuilding.io/user-guide/workflows/dew-point/internal-conditions.md) — betterbuilding.io — opis klas 1–5 wg ISO 13788:2012
19. [Warunki techniczne – zał. 2](https://cdn.architekturaibiznes.pl/upload/filemanager/AiB/PRAWO/2_WARUNKI_TECHNICZNE/ZALACZNIKI/ZALACZNIK_2/ZALACZNIK_2_WYMAGANIA-IZOLACYJNOSCI-CIEPLNEJ-I-INNE_D20221225-2.pdf) — Architektura i Biznes (tekst rozporządzenia) — U_max 0,20/0,15/0,25/0,30; okna 0,9; f_Rsi 0,72 (pkt 2.2.2); pkt 2.2.5
20. [Warunki techniczne – zał. 1, wykaz norm](https://cdn.architekturaibiznes.pl/upload/filemanager/AiB/PRAWO/2_WARUNKI_TECHNICZNE/ZALACZNIKI/ZALACZNIK_1/ZALACZNIK_1_WYKAZ-POLSKICH-NORM_D20221225.pdf) — Architektura i Biznes — PN-EN 12831:2006 (§ 134), PN-B-03430/Az3 (§ 147, 149), PN-EN ISO 13788:2013, 6946, 13370, 10211
21. [Opory przejmowania ciepła – PN-EN ISO 6946](https://www.proakademia.eu/gfx/baza_wiedzy/142/adrian7.pdf) — ProAkademia — R_si 0,10/0,13/0,17, R_se 0,04; warstwy wentylowane; przestrzeń nieogrzewana
22. [Wentylacja mechaniczna nawiewno-wywiewna krok po kroku](https://kb.pl/ogrzewanie/rekuperacja/wentylacja-mechaniczna-nawiewno-wywiewna-krok-po-kroku/) — KB.pl — wywiew 30/50/70, łazienka 50, WC 30, pom. pomocnicze 15 m³/h
23. [Odbiór wentylacji – PN-83/B-03430/Az3](https://pewnylokal.pl/odbior-wentylacji-w-budynku-norma-pn-b-03430-az3) — pewnylokal.pl — kuchnia gazowa 70, łazienka 50 m³/h
24. [Źle dobrana średnica kanałów wentylacyjnych](https://kb.pl/aktualnosci/dom/zle-dobrana-srednica-kanalow-wentylacyjnych/) — KB.pl — przewody główne ≤ 4 m/s, odgałęzienia ≤ 3 m/s; Ø75 przy 20–25 m³/h
25. [Katalog FlexiVent 75](https://sklep180271.shoparena.pl/upload/pliki/do_pobrania/wentylacja/katalog_flexivent_75_202503.pdf) — FlexiVent — Ø75: średnica wewnętrzna 63,3 mm, 34 m³/h przy 3 m/s
26. [Hybalans+ Ducting flex 132×52](https://burgerhout.com/uk/en/wp-content/uploads/2021/12/Hybalans-Ducting-flex-132x52-L20M-Red.pdf) — Burgerhout — wnętrze 122×44 mm, maks. 55 m³/h
27. [Zehnder ComfoTube Flat 51](https://cdn.shopify.com/s/files/1/0061/1945/6856/files/Zehnder_ComfoTube_Flat_51.pdf) — Zehnder — przekrój 47,5 cm², średnica hydrauliczna 58,3 mm, 47 m³/h
28. [Zehnder ComfoTube flat 51 – dane techniczne](https://www.heizungsdiscount24.de/pdf/Zehnder-ComfoTube-Flat-51-Technisches-Datenblatt.pdf) — Zehnder — wnętrze 127×39 mm, 40,1 m³/h przy 2,5 m/s
29. [Wentylacja z tworzywa](https://www.viessmann.poznan.pl/images/design/pdf/wentylacja_z_tworzywa.pdf) — Viessmann Poznań — DN63 (wewn. 54 mm) do 25 m³/h
30. [Rozporządzenie (UE) 1253/2014 – załączniki](https://www.legislation.gov.uk/eur/2014/1253/annexes/data.xht) — legislation.gov.uk — definicja SPI w W/(m³/h)
31. [Wanas 415H Basic – karta produktu](https://enerad.pl/wp-content/uploads/web-directory/karty-produktow/rekuperatory/Wanas-415H-Basic-karta-produktu.pdf) — Enerad — SPI 0,399 W/(m³/h)
32. [Ile prądu zużywa rekuperacja przez rok](https://kb.pl/aktualnosci/dom/ile-pradu-zuzywa-rekuperacja-przez-rok/) — KB.pl — typowo 300–500 kWh/rok
33. [Dew point](https://ipfs.ssi.eecc.de/ipns/en.wikipedia-on-ipfs.org/wiki/Dew_point) — Wikipedia (kopia IPFS) — stałe Magnusa 17,62/243,12 (Sonntag), 17,27/237,7
34. [Kalkulator ciśnienia pary wodnej](https://www.omnicalculator.com/pl/chemia/kalkulator-cisnienia-pary-wodnej) — Omni Calculator — Tetens 17,27/237,3; p_sat(20 °C) = 2,3388 kPa (tablica Lide)
35. [Strefy klimatyczne Polski i temperatury obliczeniowe](https://www.hvacr.pl/strefy-klimatyczne-polski-i-temperatury-obliczeniowe-322) — hvacr.pl — podział stref w załączniku krajowym PN-EN 12831
36. [Strefy klimatyczne – e-oze wiki](https://e-oze.pl/wiki/index.php/Strefy_klimatyczne) — e-oze — od −16 °C (tereny nadmorskie) do −24 °C (Suwalszczyzna, góry)

Budżet wyszukiwań się wyczerpał, zanim udało się znaleźć drugie źródło dla liczb z rys. A.2 PN-EN ISO 13788 (Δp klasy 5) i dla średnicy wewnętrznej Ø90. Obie sprawy są w „Wątpliwych”.
