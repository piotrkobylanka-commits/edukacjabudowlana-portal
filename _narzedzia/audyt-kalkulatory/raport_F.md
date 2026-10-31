# Raport F – kalkulatory PRO `koszt` (Kosztorys budowy domu) i `harmonogram` (Harmonogram budowy domu)

Data: 31.10.2026. Źródła kodu: `pro_koszt.js`, `pro_harmonogram.js` (kopie bez base64 i testy w `F/`, `F/t/`).
Poprawki maszynowo: `poprawki_F.json` (16 podmian, każde `stare` występuje w index.html dokładnie raz). Kopia index.html po wszystkich podmianach (`F/index_F_patched.html`) parsuje się (`node --check` na zmienionym skrypcie), oba programy renderują się w Chromium bez błędów strony.

Metoda: obie funkcje `calc` uruchomione w Node z atrapą PX (pliki `F/t/h.js`, `t1.js`–`t8.js`). Eksport `kosztXlsx` zapisany do .xlsx, odczytany przez openpyxl i ponownie przez `PX.readXlsx` + `budFromSheets` w Chromium (pełna ścieżka „kosztorys → Excel → harmonogram”). Ręczne obliczenia przedmiaru dla domu domyślnego (130 m², poddasze, dach dwuspadowy 40°).

Liczby: koszt – 1 ISTOTNY, 6 DROBNYCH (7 błędów, 13 podmian); harmonogram – 1 ISTOTNY, 2 DROBNE (3 błędy, 3 podmiany). KRYTYCZNYCH: 0.

---

## 1. `koszt` – Kosztorys budowy domu

### Sprawdzone i poprawne

- **Arytmetyka przedmiaru (dom domyślny).** Az0 = 130/(0,80·1,62) = 100,31 m²; prostokąt 1:1,45 → a = 12,06 m, b = 8,32 m; obwód 2·(a+b)·1,06 = 43,20 m; ściany zewnętrzne brutto O·4,0 + 2 szczyty (b²/4·tg40° = 14,51 m² każdy) = 201,8 m², netto po odjęciu okien 20,8 m² i drzwi 2,4 m² = 178,6 m² (zgodne z programem). Rzut dachu z okapem 0,6 m (13,26·9,52 = 126,2 m²)/cos40° = 164,7 m² (zgodne). Rynny 2·(a+1,2) = 26,5 mb. Wykop pod ławy Lf·1,1 = 62,7 m³. Tynki 596 m², elewacja 188 m², 131 pkt elektr., 17 pkt wod-kan – wszystkie zgodne z ręcznym przeliczeniem wzorów.
- **VAT – podstawa prawna.** 8% dla budowy budynków objętych społecznym programem mieszkaniowym (art. 41 ust. 12 i 12a), limit 300 m² dla domu jednorodzinnego (ust. 12b pkt 1), proporcja 300/P dla nadwyżki (ust. 12c) – kod `pV = 300 / pu`, `v8 = .08·pV + .23·(1–pV)` jest zgodny z ust. 12c (Infor, ifirma, Rzeczpospolita). Przy pu = 300 m² stawka 8% (warunek „przekracza”, czyli `<=` poprawnie), przy 301 m² 8,05%. Roboty poza bryłą 23% (uchwała NSA I FPS 7/12 z 3.06.2013; prawo.pl, Inżynier Budownictwa), ogrodzenie 23% (art. 3 pkt 9 Prawa budowlanego, WSA Lublin I SA/Lu 990/12), przyłącza poza bryłą 23% (DKIS 0111-KDIB3-1.4012.237.2018.1.WN). Projekt, geodezja, kierownik budowy 23% – poprawnie. Odwołanie do art. 146ef (stawki 23/8% od 1.01.2024 powiązane z wydatkami na obronność) – potwierdza ifirma.
- **Fotowoltaika 8%** dla instalacji na dachu domu jednorodzinnego do 300 m² (podatki.biz 28.07.2026, gramwzielone.pl).
- **Waloryzacja.** Domyślne 6,5%/rok i opis w podpowiedzi zgadzają się z GUS: ceny robót przy budowie budynków +6,7% r/r we wrześniu 2026, ogółem +6,9% (GUS, ceo.com.pl, decodomi.pl). Wzór (1+i)^(środek etapu/12) – poprawny.
- **Ceny jednostkowe 2026** w widełkach źródeł: tynk gipsowy maszynowy 55 zł/m² (Murator 46–70, najczęściej 50–60), wylewka 65 zł/m² (Murator 50–70, KB 65–90), ETICS EPS 240 zł/m² (KB 250–350 z materiałem – dolna granica), punkt elektryczny 186 zł (KB 150–260), punkt wod-kan 713 zł (KB 700–1400), malowanie 22 zł/m² (KB 18–38), płyta fundamentowa 650 zł/m² (KB 622–788 z VAT 8%).
- **Rezerwa, marża GW, region**: liczone multiplikatywnie, marża i region nie obejmują etapów 1 i 10 – logicznie poprawne. Eksport Excela: sumy etapów, VAT, narastająco i stany zgodne co do złotówki z wynikiem programu (round-trip openpyxl).
- **Wycofany zamiar poprawki:** wiersz „Koszt budowy do harmonogramu” jest poprawnie odczytywany przez `budFromSheets` (reguła o najwyższym priorytecie), także po odczycie pliku w przeglądarce (`PX.readXlsx`).

### Błędy

**K1. Dom piętrowy z dachem spadzistym nie ma stropu nad piętrem** – ISTOTNY
Opcja nazywa się „Piętrowy (płaski strop pod dachem)”, program dolicza ocieplenie tego stropu (`ociep_strop`, 120 zł/m²), ale `Astrop = Az0` obejmuje tylko strop nad parterem. Skutek: dla 130 m² brak ok. 85 m² stropu Teriva – SSO zaniżony o ok. 31 tys. zł brutto (–12%), całość o ok. 2,8%. Podstawa: Murator („Jaki dom jest droższy – piętrowy czy z poddaszem”), KB.pl (strop międzykondygnacyjny jako główna różnica kosztów piętra). Przy dachu płaskim stropodach jest liczony osobno, więc warunek go pomija.
`stare`: `const Astrop = kond === 'parter' ? 0 : Az0;            // strop nad parterem`
`nowe`: `const Astrop = kond === 'parter' ? 0 : kond === 'pietro' && st.dach !== 'plaski' ? 2 * Az0 : Az0;   // strop nad parterem (+ strop nad piętrem pod dachem spadzistym)`

**K2. Tynk liczony na sufitach i skosach z płyt g-k** – DROBNY
`Atyn` zawiera `pu·1,0` sufitów, a jednocześnie liczone są „Sufit podwieszany g-k z wełną” (parter, Az0) i „Ocieplenie skosów… z zabudową g-k” (poddasze). Na g-k nie kładzie się tynku gipsowego. Skutek: tynk zawyżony o 130 m² (parter, +7,6 tys. zł netto, +33%) albo ok. 50 m² (poddasze, +2,9 tys. zł). Malowanie zostaje na pełnej powierzchni. Podstawa: Murator (22 kroki wykończenia, g-k jako alternatywa tynku), KB.pl (zabudowa poddasza). Trzy podmiany:
`stare`: `const Atyn = (O * (Hsc - .3) - Aokna) + 2 * Adz + 2 * Awn + pu * 1.0;`
`nowe`: `const Asgk = st.dach === 'plaski' ? 0 : kond === 'parter' ? pu : kond === 'podd' ? pu - Az0 * kU : 0;   // sufity i skosy z g-k (bez tynku)` + nowa linia `const Atyn = … + pu * 1.0 - Asgk;`
`stare`: `Atyn, Afloor, Aelew, pE, pW, Arz, szczyty};` → `nowe`: `Atyn, Asgk, Afloor, Aelew, pE, pW, Arz, szczyty};`
`stare`: `add(8, 'malowanie', g.Atyn);` → `nowe`: `add(8, 'malowanie', g.Atyn + g.Asgk);`

**K3. Taras na gruncie w etapie SSZ i z obniżonym VAT** – DROBNY
Pozycja „Taras na gruncie: podbudowa, płyta, płytki” jest w etapie 5 (SSZ), więc dostaje 8% (GW) lub średnią 15,5% (gospodarczy). Taras na gruncie, na własnej podbudowie poza bryłą, to 23% (Rzeczpospolita „Budowa tarasu z 8 proc. stawką VAT”, uchwała NSA I FPS 7/12). Skutek: VAT zaniżony o ok. 0,5–1 tys. zł, a koszt SSZ i transza SSZ zawyżone o ok. 7 tys. zł.
`stare`: `if (n('taras') > 0) add(5, 'taras', n('taras'));` → `nowe`: `if (n('taras') > 0) add(9, 'taras', n('taras'));`

**K4. System gospodarczy: VAT od pozycji kupowanych z montażem** – DROBNY
Okna, drzwi zewnętrzne, okna dachowe, brama, kocioł, rekuperacja i PV kupuje się zwykle jako dostawę z montażem od jednego wykonawcy – to jedna usługa budowlana z 8% (Rzeczpospolita „Stawka 8 proc. VAT na montaż drzwi i okien”, NSA o bramach garażowych – podatki.biz, PV – podatki.biz 2026). Program liczy dla nich średnią 8% robocizny / 23% materiału (np. okna 20,75%). Skutek: VAT zawyżony o ok. 7–15 tys. zł (0,8–1,6% brutto). Pompy ciepła pominięte celowo (jednostka zewnętrzna na gruncie – patrz „Wątpliwe”).
`stare`: `    x.vatR = fixed23 ? .23 : gw ? v8 : x.lab * v8 + (1 - x.lab) * .23;`
`nowe`: `    x.vatR = fixed23 ? .23 : gw || /^(okna_|drzwi_zew$|brama$|kociol_gaz$|rekuperacja$|pv$)/.test(x.key) ? v8 : x.lab * v8 + (1 - x.lab) * .23;`
Dopasowanie opisów (2 podmiany): przypis „¹ W systemie gospodarczym VAT jest średnią ważoną…” oraz zdanie w `META.vat` („…8% od robocizny i 23% od materiałów. Prace poza bryłą budynku (przyłącza, szambo, ogrodzenie, podjazd)” → dopisane pozycje z montażem 8% i „taras na gruncie”) – pełne fragmenty w JSON.

**K5. Kwota przekazywana do harmonogramu zawiera rezerwę od etapu 1** – DROBNY
`PX.shared('koszt', tot – E[0].b)` i `harm = tot – E[0].b`: etap 1 jest odejmowany bez rezerwy, a `rez = gross·rez%` liczono od całości z etapem 1. Opis mówi „bez etapu 1”. Skutek: budżet w harmonogramie zawyżony o rez%·E1 (2,7 tys. zł przy domyślnych danych). Dwie podmiany:
`stare`: `PX.shared('koszt', Math.round(tot - E[0].b));` → `nowe`: `PX.shared('koszt', Math.round((gross - E[0].b) * (1 + PX.num(st.rez) / 100)));`
`stare`: `harm = R0(r.tot - r.E[0].b);` → `nowe`: `harm = R0((r.gross - r.E[0].b) * (1 + PX.num(st.rez) / 100));`

**K6. Stropodach i strop monolityczny mają wspólny klucz `str_mono`** – DROBNY
Przy domu piętrowym z dachem płaskim i stropem monolitycznym obie pozycje mają `data-cq="str_mono"`: wpisanie ilości lub ceny jednej zmienia obie (test: cq.str_mono = 10 → obie po 10 m², stropodach znika). Dwie podmiany (nowy klucz `stropodach` w `P` i w `add`):
`stare`: `"str_drew": ["Strop drewniany belkowy z poszyciem", "m²", 280, 0.45, []],` → `nowe`: ten sam wpis + `"stropodach": ["Stropodach żelbetowy (płyta nad ostatnią kondygnacją)", "m²", 580, 0.45, [8]],`
`stare`: `add(4, 'str_mono', g.Az0 * 1.05, {name: 'Stropodach żelbetowy (płyta nad ostatnią kondygnacją)'});` → `nowe`: `add(4, 'stropodach', g.Az0 * 1.05);`

**K7. Ujemny garaż** – DROBNY
`gar = n('gar')` bez ograniczenia: −40 m² zmniejsza Az o 40 m² i cały przedmiar (koszt −47%, 10 967 zł/m² dewel.). Pole ma opis „0 = bez garażu”.
`stare`: `pu = Math.max(30, n('pu')), gar = n('gar'),` → `nowe`: `pu = Math.max(30, n('pu')), gar = Math.max(0, n('gar')),`

### Wątpliwe (bez poprawki)

- **Garaż w bryle a limit 300 m².** Program porównuje z limitem samą `pu`. Interpretacje z 2011 r. (IS Katowice, cyt. w Rzeczpospolitej) wliczają garaż w bryle domu do powierzchni użytkowej wg PKOB; KIS uznaje garaż w bryle za „nierozerwalną część domu” (podatki.biz), ale część organów pomija garaże przy lokalach. Przy pu + garaż > 300 m² VAT może być zaniżony (np. 280 + 36 m²: ok. 5% budowy z 23%). Zalecenie: zdanie w opisie VAT „Do limitu 300 m² organy zwykle wliczają garaż w bryle” – zostawiam decyzję autorowi.
- **Pompa ciepła powietrze-woda.** 8% dotyczy montażu w bryle; jednostka zewnętrzna na gruncie bywa uznawana za poza bryłą (KIS 2019 cyt. w poradnikprzedsiebiorcy.pl). Obecna średnia 20% w systemie gospodarczym jest kompromisem.
- **Meble kuchenne 23%.** Trwała zabudowa na wymiar z montażem może mieć 8% (uchwała NSA I FPS 2/13), ale meble wolnostojące/modułowe 23%. Zostawione.
- **Udział SSZ w benchmarkach.** Widełki portali (Murator, Ongeo) są wyraźnie wyższe niż szczegółowy kosztorys KB.pl (531 tys. zł netto dla 125 m²) – program to opisuje, więc nie jest to błąd.
- **Harmonogram w kosztorysie (zakładka „Harmonogram i wydatki”)** jest niezależny od programu `harmonogram` (stałe miesiące `MIES`, przerwa zimowa +2 mies. po SSZ). Daty i transze w obu programach będą się różnić (np. 16 mies. z formalnościami vs 10,5 mies. budowy). Nie jest to błąd obliczeń; warto dopisać zdanie, że dokładny harmonogram liczy osobny program.

---

## 2. `harmonogram` – Harmonogram budowy domu

### Sprawdzone i poprawne

- **Kalendarz.** Algorytm Wielkanocy (Meeus/Butcher) – daty 2025–2031 zgodne (20.04.2025, 5.04.2026, 28.03.2027, 16.04.2028…). Święta: 1.01, 6.01, Wielkanoc i Poniedziałek Wielkanocny (E+1), Zielone Świątki (niedziela – bez wpływu), Boże Ciało (E+60), 1.05, 3.05, 15.08, 1.11, 11.11, 24.12, 25.12, 26.12. Wigilia wolna od 2025 r. – ustawa z 6.12.2024 (Dz.U. poz. 1965), potwierdzają poradnikprzedsiebiorcy.pl, KPMG, Infor.
- **Przerwy technologiczne.** Strop 14 dni do murowania ścian poddasza i komentarz „podpory ok. 28 dni” – Murator (ścianki na stropie po 28 dniach, rozszalowanie po 28 dniach; na podciągu 14), KB.pl (pełna wytrzymałość ok. 28 dni). Jastrych: wygrzewanie najwcześniej po 21 dniach (cementowy) – KAN-therm, Weber; 28 dni przerwy po wylewkach (z wygrzewaniem 3+4 dni) – zgodne z kartą Weber (posadzki po 2–3 tyg. w +20 °C) i Muratorem (6 tygodni przed podłogami – przerwa 28 dni + 4 dni etapu to dolna granica). Tynki → wylewki 14 dni – zgodne z praktyką (Murator: płytki po kilkunastu dniach).
- **ETICS** +5…+25 °C (Weber – instrukcja wykonawcza, Termo Organika – wytyczne). Przerwa zimowa obejmuje tylko prace mokre; opcja „budynek ogrzewany po SSZ” zwalnia mokre wewnętrzne – logiczne.
- **Rozkład kosztów** – suma miesięcy = budżet (850 000 zł co do złotówki), kamienie milowe narastająco poprawnie; ostrzeżenie, gdy udziały ≠ 100%.
- **`budFromSheets` / `PX.readXlsx`** – plik z kosztorysu: wczytuje komórkę E24 „Koszt budowy do harmonogramu” (test w Chromium); własny .xlsx z wierszem „RAZEM” – wczytuje brutto (największa liczba w wierszu); CSV „Razem brutto;1.350.000,00” – 1 350 000; „1 250 000 zł” – 1 250 000.

### Błędy

**H1. Domyślne etapy: udziały kosztów, kolejność g-k względem prac mokrych, przerwa przed więźbą** – ISTOTNY (jedna podmiana całej tablicy `DEF`)
1. Udziały kosztów etapów (pole „Udział kosztu [%]”) nie odpowiadają kosztorysowi z tego samego portalu. Kosztorys domyślny podzielony na etapy harmonogramu daje: SSO ok. 36%, instalacje 16–18%, teren i przyłącza 8–11% (a17), wykończenie 13%. Domyślne: SSO 46%, instalacje 10%, teren 3%. Skutek: transza „stan surowy otwarty” zawyżona o ok. 9 pkt proc. (391 tys. zamiast ok. 315 tys. zł przy 850 tys.), późniejsze wydatki przesunięte – mylny plan finansowania. Udział SSO ok. 35–40% potwierdza też struktura kosztorysu KB.pl 2026. Nowe udziały (suma 100): 1, 5, 3, 2, 6, 8, 2, 4, 6, 6, 16, 6, 4, 6, 2, 13, 9, 1.
2. „Sucha zabudowa i ocieplenie poddasza” (wełna, paroizolacja, g-k) jest przed tynkami i wylewkami. Wełna i płyty g-k chłoną wilgoć z prac mokrych; Murator („Kolejność prac wykończeniowych od SSZ – 14 etapów”) umieszcza wykończenie skosów i zabudowę g-k po tynkach i podkładach podłogowych. Poprawka: a12 po a15 (zależność od a15), kamień „stan deweloperski” na końcu a12, wykończenie zależne od a12. Wydłuża budowę o ok. 1 tydzień (tak jest realnie).
3. Wieniec ścianki kolankowej → więźba: przerwa 7 dni. Murator („Przerwy technologiczne na budowie”): więźbę najwcześniej po 14 dniach od zabetonowania wieńców. Poprawka: przerwa 14 dni i opis.
4. Etap „Zagospodarowanie terenu…” bez przyłączy (w kosztorysie ok. 3–4% kosztu) – dopisane do nazwy; elewacja równoległa z tynkami – dopisane ostrzeżenie (Weber: ETICS w nowym budynku po zakończeniu tynków i podkładów; Termo Organika: prace mokre „z odpowiednim wyprzedzeniem”).
`stare`: cała tablica `const DEF = [ … ];` (18 wierszy `E('a1'…'a18')`), `nowe`: ta sama tablica z powyższymi zmianami – pełny tekst w `poprawki_F.json` (kalk „harmonogram”, waga „ISTOTNY”). Identyfikatory etapów bez zmian, więc zapisane projekty użytkowników działają.

**H2. Zapas na opóźnienia dodaje dzień przez błąd zmiennoprzecinkowy** – DROBNY
`Math.ceil(d·(1+res))`: 50·1,1 = 55,000000000000014 → 56 dni (powinno 55). Dotyczy np. 50, 90, 100, 110, 170–230 dni przy 10% oraz 180, 340, 360 przy 35%.
`stare`: `D = Math.max(0, Math.ceil(PX.num(r.d) * (1 + res)))`
`nowe`: `D = Math.max(0, Math.ceil(Math.round(PX.num(r.d) * (1 + res) * 1e6) / 1e6))`

**H3. CSV/tekst z kropką jako separatorem tysięcy** – DROBNY
`budFromSheets.num("800.000")` → 800, `"1.250.000"` → 1,25 (kropka traktowana jak przecinek dziesiętny). Wartości < 1000 są odrzucane, więc plik z takim zapisem kończy się błędem „nie znaleziono kwoty”, albo wybierana jest inna kolumna. Popularny zapis w polskich kosztorysach.
`stare`: `    else if (s.includes(',')) s = /,\d{3}$/.test(s)` (początek linii)
`nowe`: wstawiona przed nią linia `    else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, '');`
Test po poprawce: „800.000” → 800 000, „1.250.000” → 1 250 000, „1250000.50” → 1 250 000,5, „12.5” → odrzucone (< 1000).

### Wątpliwe (bez poprawki)

- **Domyślne daty przerwy zimowej 15.12–1.03** – rozsądne dla Polski, przerwa jest opcjonalna i domyślnie wyłączona; komunikat o środkach zimowych poniżej +5 °C poprawny.
- **Zagospodarowanie terenu jako prace „suche”** – podbudowa i zagęszczanie na zamarzniętym gruncie są niewskazane (KB.pl „Kostka brukowa po zimie”), ale zmiana na „mokre na zewnątrz” wydłuża domyślny harmonogram z przerwą zimową o 1–5 tygodni i przesuwa koniec etapu za „zakończenie budowy”. Zostawione do decyzji autora (można dopisać to w opisie etapu).
- **Kamienie milowe „SSZ”** zależą od kolejności etapów: kod oznacza `ssz` przy pierwszym etapie z kamieniem `ssz/dew/odb`. Przy nietypowej kolejności użytkownika opcja „ogrzewany po SSZ” może się włączyć wcześniej – zachowanie zgodne z opisem, nie zmieniam.

---

## 3. Zgodność danych kosztorys → harmonogram

- Klucz `eb-pro-shared.koszt` i wiersz Excela „Koszt budowy do harmonogramu (bez etapu 1)” – te same wartości (1 006 371 zł domyślnie; po samej poprawce K5: (939 426 – 26 999) × 1,10 = 1 003 670 zł; po wszystkich poprawkach: 992 626 zł). `budFromSheets` wybiera ten wiersz przed „RAZEM brutto z rezerwą” – poprawnie (test xlsx w Chromium).
- Kwota jest **brutto z rezerwą** – harmonogram nie dolicza VAT ani rezerwy drugi raz (zapas w harmonogramie dotyczy czasu, nie kosztu) – poprawnie.
- Rozbieżność: udziały kosztów etapów w harmonogramie nie odpowiadały strukturze kosztorysu (H1.1) – poprawione.
- Rozbieżność: kosztorys ma własny, uproszczony harmonogram (Wątpliwe w części 1).

---

## Źródła

1. [Stawka VAT 8% w budownictwie mieszkaniowym a powierzchnia użytkowa](https://ksiegowosc.infor.pl/podatki/vat/stawki-vat/5599477,stawka-vat-8-w-budownictwie-mieszkaniowym-a-powierzchnia-uzytkowa.html) — Infor — treść art. 41 ust. 12, 12a, 12b, 12c, przykład proporcji.
2. [Stawki VAT dla budownictwa mieszkaniowego w wyjaśnieniach MF](https://www.ifirma.pl/blog/stawki-vat-dla-budownictwa-mieszkaniowego-w-wyjasnieniach-mf.html) — ifirma — limity 300/150 m² i proporcja (z wyników wyszukiwania).
3. [Jak wyliczyć limit metrażu dla piwnicy i garażu](https://www.domiporta.pl/informacje/a/jak-wyliczyc-limit-metrazu-powierzchni-uprawniajacy-do-stawki-8-dla-piwnicy-i-garazu-4593) — Domiporta — brak definicji pow. użytkowej w VAT, PKOB stosowane przez organy.
4. [Jak ustalić powierzchnię użytkową dla celów VAT](https://pro.rp.pl/podatki/art14464401-jak-ustalic-powierzchnie-uzytkowa-dla-celow-vat) — Rzeczpospolita — PKOB, garaż w bryle domu wliczany (IS Katowice 2011).
5. [Powierzchnia użytkowa dla celów VAT](https://poradnikprzedsiebiorcy.pl/-powierzchnia-uzytkowa-dla-celow-vat) — Poradnik Przedsiębiorcy — metody pomiaru, KIS 0111-KDIB3-1.4012.132.2022.2.AB.
6. [WSA. Stawki VAT: Garaż garażowi nierówny](https://www.podatki.biz/artykuly/wsa-stawki-vat-garaz-garazowi-nierowny_4_39552.htm) — podatki.biz — garaż w bryle nierozerwalną częścią domu.
7. [Roboty budowlane poza budynkiem opodatkowane podstawową stawką VAT](https://www.prawo.pl/podatki/roboty-budowlane-poza-budynkiem-opodatkowane-sa-podstawowa-stawka-vat,11410.html) — Prawo.pl — uchwała NSA I FPS 7/12: poza bryłą 23%.
8. [Stawki VAT dla infrastruktury towarzyszącej budownictwu mieszkaniowemu](https://inzynierbudownictwa.pl/stawki-vat-dla-infrastruktury-towarzyszacej-budownictwu-mieszkaniowemu/) — Inżynier Budownictwa — I FPS 7/12 z 3.06.2013, przyłącza.
9. [Usługa budowy przyłącza do kanalizacji – jaka stawka?](https://akademialtca.pl/blog/usluga-budowy-przylacza-do-kanalizacji-jaka-stawka) — Akademia LTCA — DKIS 2018: poza bryłą 23%.
10. [Jaka stawka VAT na montaż ogrodzenia wokół budynku mieszkalnego?](https://poradnikprzedsiebiorcy.pl/-jaka-stawka-vat-na-montaz-ogrodzenia-wokol-budynku-mieszkalnego) — Poradnik Przedsiębiorcy — ogrodzenie 23%, WSA Lublin I SA/Lu 990/12.
11. [Budowa tarasu z 8 proc. stawką VAT](https://pro.rp.pl/podatki/art3108981-budowa-tarasu-z-8-proc-stawka-vat) — Rzeczpospolita — taras na własnych ławach poza bryłą 23%.
12. [Stawka 8 proc. VAT na montaż drzwi i okien](https://pro.rp.pl/podatki/art9269941-stawka-8-proc-vat-na-montaz-drzwi-i-okien) — Rzeczpospolita — dostawa z montażem okien/drzwi 8%.
13. [NSA: Montaż i wymiana bram garażowych ze stawką 8%](https://www.podatki.biz/artykuly/nsa-montaz-i-wymiana-bram-garazowych-ze-stawka-8_4_36821.htm) — podatki.biz — brama z montażem jako jedna usługa 8%.
14. [Stawka VAT dla instalacji fotowoltaicznych gospodarstw domowych](https://www.podatki.biz/artykuly/stawka-vat-dla-instalacji-fotowoltaicznych-gospodarstw-domowych-dach-ma-znaczenie_4_63039.htm) — podatki.biz (28.07.2026) — PV na dachu domu 8%.
15. [Montaż pompy ciepła – jaka stawka podatku VAT?](https://poradnikprzedsiebiorcy.pl/-montaz-pompy-ciepla-jaka-stawka-podatku-vat) — Poradnik Przedsiębiorcy — 8% w bryle, na gruncie 23% (KIS 2019).
16. [Niższa stawka VAT na montaż zabudowy meblowej – uchwała NSA](https://muratordom.pl/prawo/finanse/nizsza-stawka-vat-na-montaz-zabudowy-meblowej-aa-9izS-sN5W-uruB.html) — Murator — I FPS 2/13: trwała zabudowa 8%.
17. [Zmiany 2024 – VAT zależny od wydatków na obronność](https://www.ifirma.pl/blog/zmiany-2024-vat-zalezny-od-wydatkow-na-obronnosc/) — ifirma — art. 146ef: stawki 23/8% od 1.01.2024.
18. [Ustawa z 22.11.2018 o zmianie ustawy o VAT](https://eli.gov.pl/api/acts/DU/2018/2392/text.html) — ISAP/ELI — wcześniejszy mechanizm art. 146aa (kontekst 146ef).
19. [Ceny usług budowlanych we wrześniu 2026 – wzrost o 6,9%](https://ceo.com.pl/ceny-produkcji-budowlano-montazowej-wrzesien-2026-gus-64139) — CEO.com.pl — GUS: ogółem +6,9%, budowa budynków +6,7% r/r.
20. [Price indices of construction and assembly production in September 2026](https://publikacje.new.stat.gov.pl/en/publications-portal/price-indices-construction-and-assembly-production-september-2026) — GUS — te same wskaźniki (źródło pierwotne).
21. [Ceny usług budowlanych wrzesień 2026: +6,9% według GUS](https://decodomi.pl/gus-ceny-uslug-budowlanych-wrzesien-2026) — decodomi.pl — potwierdzenie +6,7% budowa budynków.
22. [Cennik usług budowlanych 2026](https://kb.pl/cenniki/uslugi/cennik-uslug-budowlanych/) — KB.pl — ceny ETICS, punkty elektr. i wod-kan, malowanie, tynk, wylewka.
23. [Tynki wewnętrzne i wylewki cementowe 2026 – cennik](https://muratordom.pl/cenniki-budowlane/tynki-wewnetrzne-i-wylewki-cementowe-2026-aktualny-cennik-z-robocizna-i-materialem-aa-vXme-fR3P-VUmt.html) — Murator — tynk gipsowy 46–70, wylewka 40–80 zł/m².
24. [Płyta fundamentowa – cennik](https://kb.pl/cenniki/plyta-fundamentowa/) — KB.pl — 622–788 zł/m² (z VAT 8%).
25. [Koszty budowy domu 2026 (kosztorys 140 m²)](https://kb.pl/aktualnosci/budowa-domu/koszty-budowy-domu-2026/) — KB.pl — struktura kosztów netto (SSZ, instalacje, wykończenie).
26. [Jaki dom jest droższy – piętrowy czy z poddaszem?](https://muratordom.pl/przed-budowa/wybor-projektu/jaki-dom-jest-drozszy-pietrowy-czy-z-poddaszem-aa-gyfN-sux1-3pm7.html) — Murator — dom piętrowy: stropy, większe ściany.
27. [Poddasze użytkowe czy pełne piętro?](https://kb.pl/aktualnosci/budowa-domu/poddasze-uzytkowe-czy-pelne-pietro/) — KB.pl — różnica kosztu głównie w stropie międzykondygnacyjnym.
28. [Przerwy technologiczne na budowie](https://muratordom.pl/przed-budowa/organizacja-budowy/przerwy-technologiczne-na-budowie-czyli-ile-trzeba-czekac-z-poszczegolnymi-pracami-aa-CujB-zdxo-jDn7.html) — Murator — więźba po 14 dniach od wieńca, ścianki na stropie po 28 dniach, rozszalowanie 28 dni, wylewka 6 tygodni.
29. [Pośpiech przy budowie domu – strop](https://kb.pl/aktualnosci/listy-i-historie/pospiech-przy-budowie-domu/) — KB.pl — pełna wytrzymałość betonu ok. 28 dni.
30. [Jak poprawnie szalować wieniec](https://www.zbudujsamdom.pl/?p=61642) — zbudujsamdom.pl — rozszalowanie wieńca 7–14 dni.
31. [Protokół nagrzewania jastrychu](https://kan-therm.com/media/2024/10/KAN-therm-protokol-nagrzewania-jastrychu-PL-22-01-04.pdf) — KAN-therm — wygrzewanie po 21 dniach (cementowy), 3 dni 25 °C + 4 dni maks.
32. [Karta techniczna weber.floor 1000](https://www.pl.weber/files/pl/2025-06/printable_sheet_weber_floor_1000.pdf) — Weber — ogrzewanie po 21 dniach, posadzki po 2–3 tyg.
33. [Instrukcja wykonawcza – systemy ociepleniowe ETICS](https://www.pl.weber/files/pl/2021-05/Instrukcja-wykonawcza-Systemy-ociepleniowe-ETICS-2021-04.pdf) — Weber — +5…+25 °C; w nowym budynku ETICS po tynkach i podkładach (3–6 mies.).
34. [Wytyczne wykonawstwa systemów ociepleń](https://budujemydom.pl/files/doy/13471-Wytyczne%20wykonawstwa%20systemw%20ocieple_Termo%20Organika.pdf) — Termo Organika — min. +5 °C, prace mokre z wyprzedzeniem.
35. [Kolejność prac wykończeniowych od SSZ – 14 etapów](https://muratordom.pl/przed-budowa/organizacja-budowy/kolejnosc-prac-wykonczeniowych-od-stanu-surowego-zamknietego-14-najwazniejszych-etapow-aa-yAZ4-q5RR-PVpa.html) — Murator — skosy i g-k po tynkach i podkładach.
36. [Wykończenie domu: 22 kroki](https://muratordom.pl/wnetrza/prace-wykonczeniowe/wykonczenie-domu-22-kroki-do-wykonczenia-domu-aa-iC6r-QGeR-DYLw.html) — Murator — kolejność tynki → wylewki, 6 tygodni do posadzek, g-k zamiast tynku.
37. [Wigilia dniem wolnym od pracy od 2025 roku](https://poradnikprzedsiebiorcy.pl/-wigilia-dniem-wolnym-od-pracy-od-2025-roku) — Poradnik Przedsiębiorcy — Dz.U. 2024 poz. 1965, lista dni wolnych.
38. [Od 2025 roku Wigilia będzie dniem wolnym od pracy](https://kpmg.com/pl/pl/wiedza/prawo/od-2025-roku-wigilia-bdzie-dniem-wolnym-od-pracy.html) — KPMG — potwierdzenie (z wyników wyszukiwania).
39. [Kostka brukowa po zimie](https://kb.pl/aktualnosci/ogrod/kostka-brukowa-po-zimie/) — KB.pl — niska temperatura utrudnia zagęszczenie podbudowy.

Uwaga: limit wyszukiwań dla tej tury został wyczerpany (wspólny dla agentów), więc kilka ustaleń (art. 146ef, garaż a limit 300 m², czas przed więźbą) ma po dwa źródła, ale bez dalszego pogłębienia; strona GUS i jeden PDF Norgips nie zostały pobrane (blokada robots / brak zgody na URL).
