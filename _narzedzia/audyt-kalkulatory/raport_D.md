# Raport audytu D – kalkulatory: ława, strop, schody, mury, otulina, bloczki, ławy

Data: 31.10.2026. Zakres: PRO `lawa`, PRO `strop`, PRO `schody`, PRO `mury` oraz proste kalkulatory `otulina` (moduł ZBR), `bloczki` (moduł MUR), `lawy` (moduł LAW).
Metoda: kod obliczeń skopiowany z `pro_*.js` i z modułów w `index.html`, uruchomiony w Node na atrapie `PX`, 3–12 przypadków na kalkulator, porównanie z obliczeniem ręcznym. Wszystkie 40 poprawek zastosowano razem na kopii `index.html`: każdy fragment `stare` występuje dokładnie raz, wszystkie skrypty inline po podmianie przechodzą `node --check`, a funkcje calc/out wywołano ponownie i dają spodziewane wyniki.
Ograniczenie: wspólny limit wyszukiwań (200 na turę) wyczerpał się w trakcie pracy. Dwie strony (karta Ytong PP4/0,6 i karta Silka E-S) nie zostały pobrane, bo prośba o zgodę wygasła. Dlatego część danych katalogowych (palety, masy) oceniam jako „wątpliwe”, a nie jako błędy.

## Podsumowanie

| Kalkulator | KRYTYCZNY | ISTOTNY | DROBNY |
|---|---|---|---|
| lawa (PRO) | 0 | 1 (3 fragmenty) | 3 (6 fragmentów) |
| strop (PRO) | 2 (6 fragmentów) | 6 (11 fragmentów) | 2 (5 fragmentów) |
| schody (PRO) | 0 | 3 | 3 |
| mury (PRO) | 1 | 0 | 0 |
| otulina | 0 | 0 | 0 (2 wątpliwe) |
| bloczki | 0 | 0 | 1 |
| lawy | 0 | 0 | 1 (1 wątpliwe) |

---

## 1. PRO `lawa` – ława fundamentowa

### Sprawdzone i poprawne
- Kombinacja 1,35·G_k + 1,5·Q_k (PN-EN 1990, wzór 6.10). Przy domyślnych danych daje to wynik większy od pary 6.10a/6.10b z ξ = 0,85, którą preferuje załącznik krajowy, więc jest po bezpiecznej stronie.
- Zebranie obciążeń: ściana (γ·t·h + tynk 0,57 kN/m²), połowa rozpiętości stropu i dachu, ściana fundamentowa 24 kN/m³, ława 25 kN/m³. Obliczenie ręczne dla danych domyślnych: G_k = 44,03 kN/m, Q_k = 7,52 kN/m, V_d = 70,7 kN/m, σ = 118 kPa – zgodne z programem.
- σ = V_d/b porównane z obliczeniowym oporem gruntu, z jasnym opisem, że to wymiarowanie wstępne (PN-EN 1997-1). Grunt „nasyp” daje werdykt „decyzja geotechnika”.
- Strefy przemarzania 0,8 / 1,0 / 1,2 / 1,4 m (PN-81/B-03020, załącznik 1) i warunek D ≥ h_z.
- Szerokość minimalna b_min z odjęciem ciężaru ławy i gruntu; zaokrąglenie w górę do 5 cm.
- Masa stali: πd²/4·7850, strzemiona Ø6 0,222 kg/m. Zakłady 50Ø w opisie.
- b = 0: σ = ∞, werdykt „za wąska” – obsłużone.

### Błędy
1. **ISTOTNY – warunek wysokości ławy h ≥ 0,8·odsadzka jest za łagodny.** PN-EN 1992-1-1 p. 12.9.3 (ława bez zbrojenia poprzecznego, a program zbroi ją tylko podłużnie): 0,85·h_F/a ≥ √(3σ_gd/f_ctd), f_ctd = α_ct,pl·f_ctk,0,05/γ_C = 0,8·1,5/1,4 = 0,86 MPa dla C20/25; uproszczenie h_F/a ≥ 2. Wymagany stosunek h/a wynosi 0,76 przy 120 kPa, 0,98 przy 200 kPa, 1,10 przy 250 kPa i 1,21 przy 300 kPa. Program przyjmuje stałe 0,8, więc przy dużym naprężeniu dopuszcza ławę niższą o 30–50%. Poprawka [5]–[7] liczy współczynnik z rzeczywistego σ (ograniczony do 3). Przy małych naprężeniach dalej obowiązuje minimum 30 cm.
2. **DROBNY – grunt na odsadzkach.** Kod mnoży ciężar gruntu przez (hgr − h), a pole „Grunt nad ławą” opisuje wysokość zasypki nad ławą. Przy danych domyślnych (D = 1,20, h = 0,35) zasypka ma 0,85 m, a liczone jest 0,65 m: G_k zaniżone o ok. 3%, σ o ok. 2,5%. Przy b < grubości ściany fundamentowej ten człon był ujemny (b = 20 cm, ściana 24 cm). Poprawki [1]–[4]: hgr bez odejmowania h, max(0, b − sc), domyślnie hgr = 0,85 i objaśnienie pola.
3. **DROBNY – opisy stref.** „I (zachód, wybrzeże)” i „IV (Suwalszczyzna, góry)”. Według map normy strefa I to zachód i północny zachód, tereny podgórskie leżą w strefie III, a strefa IV to północno-wschodni narożnik. Gdańsk i wybrzeże wschodnie nie leżą w strefie I. Poprawka [0].
4. **DROBNY – podstawa normowa.** Uzupełnienie o p. 12.9.3 (poprawka [8]).

### Wątpliwe
- Orientacyjne opory gruntu (piasek średni 250 kPa, glina plastyczna 150 kPa itd.) to wartości poglądowe. Norma PN-EN 1997-1 nie podaje tabeli takich wartości (dawna PN-81/B-03020 miała q_f zależne od I_D/I_L, B i D). Program wyraźnie zaznacza, że to wartość orientacyjna, więc nie zgłaszam tego jako błędu.
- PN-81/B-03020 zaleca też posadowienie co najmniej 0,5 m pod terenem i pozwala posadowić płycej niż h_z na piaskach i żwirach przy głęboko położonym zwierciadle wody. Program wymaga h_z zawsze, co jest po bezpiecznej stronie.

---

## 2. PRO `strop` – obciążenia i sprawdzenie wstępne

### Sprawdzone i poprawne
- Kombinacja 1,35 G + 1,5 Q. Zastępcze obciążenie ścianek 0,5 / 0,8 / 1,2 kN/m² dla ścianek ≤ 1 / ≤ 2 / ≤ 3 kN/m (PN-EN 1991-1-1 p. 6.3.1.2(8)). Obciążenie użytkowe kategorii A 1,5–2,0 kN/m², opisane jako zakres.
- Zginanie płyty: μ = M/(b d² f_cd), ω = 1 − √(1 − 2μ), granica μ ≤ 0,372, f_cd = 25/1,4 (α_cc = 1,0 wg NA), f_yd = 435 MPa. A_s,min = max(0,26 f_ctm/f_yk; 0,0013)·b·d (PN-EN 1992-1-1 wz. 9.1N). Rozstaw maks. min(2h; 25 cm) (p. 9.3.1.1). Dla danych domyślnych ręcznie: M = 12,71·25/8 = 39,7 kNm/m, A_s = 5,60 cm²/m – zgodne.
- Smukłość l/d wg wzorów 7.16a/b, K = 1,0 / 1,3, mnożnik A_s,prov/A_s,req ≤ 1,5, limit 40.
- Belka drewniana: f_m,d = k_mod·f_m,k/γ_M = 0,8·24/1,3 (C24, klasa użytkowania 1, obciążenie średniotrwałe).

### Błędy
1. **KRYTYCZNY – stropy gęstożebrowe bez sprawdzenia obciążenia.** Program porównuje tylko rozpiętość, a obciążenie „ponad ciężar własny” pokazuje jako informację. System Teriva dopuszcza charakterystycznie 4,0 kN/m² (4.0), 6,0 (6.0) i 8,0 (8.0). Dla danych domyślnych z Teriva 4.0 (jastrych z ogrzewaniem 1,75 + tynk 0,2 + ścianki 0,8 + 1,5) wychodzi 4,25 kN/m² (po poprawce ścianek 4,65 kN/m²), a werdykt brzmi „Strop przechodzi sprawdzenie wstępne”. Poprawki [10]–[14].
2. **KRYTYCZNY – dane typów Teriva.** Teriva 6.0 i 8.0 mają 34 cm wysokości i ciężar ok. 4,0 kN/m² (program: 24 i 30 cm, 3,4 i 3,9 kN/m²). Maksymalne rozpiętości 6.0 i 8.0 są zamienione: system podaje 7,8 m dla 6.0 i 7,2 m dla 8.0, a program 7,2 i 7,8 m, czyli dla 8.0 o 0,6 m za dużo. Poprawka [9] (rysunek [15]–[18]: wysokość, nadbeton 3/4 cm, rozstaw belek 60/45 cm).
3. **ISTOTNY – rozpiętość w świetle zamiast obliczeniowej.** Pole „Rozpiętość w świetle podpór” wchodzi wprost do M = w·l²/8. PN-EN 1992-1-1 p. 5.3.2.2: l_eff = l_n + a_1 + a_2, a_i = min(h/2; t/2). Dla płyty 20 cm na ścianach 24 cm i 5,0 m w świetle l_eff = 5,20 m: moment większy o 8,2%. Domyślna płyta przestaje wtedy spełniać l/d (30,6 > 26,4), a program mówi „przechodzi”. Poprawka [19]: pole „Rozpiętość obliczeniowa (w osiach podpór)” z objaśnieniem.
4. **ISTOTNY – dwa przęsła: brak niekorzystnego układu obciążenia.** M_przęsło = w·l²/14,2 odpowiada obciążeniu obu przęseł. Według p. 5.1.3 obciążenie zmienne układa się na jednym przęśle: M = (0,0703·1,35g + 0,0957·1,5q)·l² (rozwiązanie belki ciągłej: 9/128 i 49/512). Zaniżenie 6% przy q = 1,5 i do ok. 15% przy q = 5 kN/m². Poprawki [20]–[21].
5. **ISTOTNY – reakcja na ścianę środkową.** Przy dwóch przęsłach program podaje 1,25·w·l/2 = 0,625·w·l, czyli udział jednego przęsła. Ściana środkowa przenosi 1,25·w·l (2 × 0,625), skrajne 0,375·w·l. Wartość „do przeniesienia w programie Ława” zaniżona o 50%. Poprawki [22]–[24].
6. **ISTOTNY – rozstaw prętów niewykonalny.** Rozstaw zaokrąglany w dół co 2,5 cm może wyjść 2,5 cm albo 0, a płyta jest uznana za poprawną (np. l = 5,25 m, h = 18 cm, Ø8, dwa przęsła, q = 5 kN/m²: góra Ø8 co 2,5 cm; 236 takich kombinacji w siatce testowej). PN-EN 1992-1-1 p. 8.2(2): odstęp w świetle ≥ max(Ø; d_g + 5; 20 mm). Poprawki [25]–[26].
7. **ISTOTNY – ugięcie belki drewnianej bez pełzania.** Liczone u = 5(g+q)l⁴/384EI ≤ l/300. PN-EN 1995-1-1 p. 2.2.3 i 7.2: w_fin = w_G(1 + k_def) + w_Q(1 + ψ_2·k_def), k_def = 0,6 (drewno lite, klasa 1), ψ_2 = 0,3, zalecana granica w_net,fin l/250 – l/350. Dla danych domyślnych (g = 3,25, q = 1,5) w_fin/w_inst ≈ 1,47, a dopuszczalne większe o 20%, więc obecny warunek jest o ok. 20% za łagodny. Poprawki [27]–[28].
8. **ISTOTNY – ciężar ścianek działowych.** Ścianka z betonu komórkowego 12 cm z tynkiem waży ok. 3,0 kN/m (10,5 kg × 8,33 szt./m² + tynk, h = 2,65 m), a nie ≤ 2 kN/m (należy 1,2 kN/m², program 0,8). Ścianka ceramiczna 11,5 cm to ok. 3,3 kN/m, silikat 12 cm ok. 5,2 kN/m: według p. 6.3.1.2(8) przekraczają 3 kN/m i nie wolno ich zastąpić obciążeniem równomiernym. Poprawka [29] koryguje wartość i opis.
9. **DROBNY – brak mnożnika 7/l_eff** dla rozpiętości ponad 7 m ze ściankami działowymi (p. 7.4.2(2)). Poprawka [30].

### Wątpliwe
- Ciężar Teriva 4.0/1: 2,9 kN/m² w programie, 2,68 kN/m² w danych systemu. Program jest po bezpiecznej stronie, więc tego nie zmieniam.
- Strop drewniany: ciężar 5 kN/m³ + 0,35 kN/m² na deskowanie jest rozsądny. Brak sprawdzenia drgań, co zaznaczono w opisie.

---

## 3. PRO `schody`

### Sprawdzone i poprawne
- § 68 ust. 1 (budynek jednorodzinny): bieg ≥ 0,8 m, spocznik ≥ 0,8 m, stopień ≤ 0,19 m.
- § 69 ust. 4: 2h + s = 0,60–0,65 m.
- Liczba stopni N = ⌈H/0,19⌉ przy h_c > 0,19, s = krok − 2h. Dla H = 2,95 m, h_c = 17,5, krok 63: N = 17, h = 17,35 cm, s = 28,3 cm – zgodne z obliczeniem ręcznym.
- Limit 17 stopni w biegu słusznie nie jest sprawdzany: § 69 ust. 2 wyłącza z niego budynki jednorodzinne.
- Stopnie zabiegowe zrównoważone: szerokość na linii 40 cm od wewnętrznej krawędzi = s (konstrukcja geometrii).
- Wysokość przejścia 2,0 m opisana jako zasada projektowa (WT jej nie podają). Opis prawidłowy.
- Spocznik ≥ max(0,8; B) z oceną „na granicy” przy 0,8 ≤ spocznik < B. Wymóg ≥ B to dobra praktyka, nie przepis, więc ocena „ostrzeżenie” jest właściwa.

### Błędy
1. **ISTOTNY – stopnie zabiegowe: brak minimum 0,25 m.** § 69 ust. 6: szerokość stopnia co najmniej 0,25 m, mierzona nie dalej niż 0,4 m od wewnętrznej poręczy lub słupa. Program porównuje z s, a przy h = 19 cm i kroku 60–62 cm s = 22–24 cm, więc stopnie 22 cm przechodzą jako „spełnia”. Poprawka [31].
2. **ISTOTNY – schody kręcone: sprawdzenie zawsze zaliczone** (`true` na sztywno). Poprawka [32] (≥ 0,25 m).
3. **ISTOTNY – szerokość biegu schodów kręconych.** Przy B od 0,6 do 0,8 m ocena „na granicy”, a werdykt nie każe poprawiać. § 68 ust. 1 nie zawiera wyjątku dla schodów kręconych, więc w domu jednorodzinnym obowiązuje 0,8 m. Wyjątek z 0,8 m i h ≤ 0,20 m dotyczy tylko schodów do piwnic, pomieszczeń technicznych i poddaszy nieużytkowych, a i tam szerokość pozostaje 0,8 m. Poprawka [33].
4. **DROBNY – podstawa prawna bez 0,25 m** (poprawka [34]).
5. **DROBNY – H = 0** daje stopnie 0 cm ocenione jako zgodne (poprawka [35]).
6. **DROBNY – kolumna „Jest” w sprawdzeniu linii biegu** pokazuje głębokość stopnia (30,3 cm), a wymaganie dotyczy 2h + s (60–68 cm). Poprawka [36] pokazuje 2h + s.

### Wątpliwe
- Balustrady (§ 296–298): program ich nie sprawdza. Dla porządku: w budynku jednorodzinnym balustrada ≥ 0,9 m, bez limitu prześwitów, a schody do 1 m bez balustrady są dopuszczalne, jeśli są obustronnie szersze od drzwi o 0,5 m. Można dodać informację w opisie, ale to nie jest błąd obliczeń.
- Granica „60–68 cm” na linii biegu stopni zabiegowych nie wynika z WT (§ 69 ust. 4 mówi 60–65 cm dla schodów wewnętrznych). Przyjęto ją jako tolerancję dla stopni zabiegowych. Do decyzji właściciela, czy ma być 65 cm.

---

## 4. PRO `mury` – ściany, materiały

### Sprawdzone i poprawne
- Sztuki na m² = 1/((L + spoina pionowa)(H + spoina pozioma)). Ytong 59,9 × 19,9: 8,31 szt./m² (producent 8,33). Bloczek fundamentowy 38 × 12 na mur 24 cm: 19,7 szt./m² (poradnik ok. 22). Zaokrąglenie sztuk i palet w górę (Math.ceil).
- Zapas na docinki jako procent, odjęcie otworów, nadproże z oparciem po 12,5 cm (wymiar typowy dla belek L19; dla nadproży z betonu komórkowego producent wymaga 20–25 cm, co opisuje karta Ytong).
- Liczba belek nadprożowych = ⌈t/11,5⌉ – zgodne z belkami szerokości ok. 11,5 cm.

### Błędy
1. **KRYTYCZNY – cegła pełna, mur 25 cm.** Lico liczone jak 25 × 6,5 cm (51 szt./m²), czyli tak samo jak mur 12 cm. Mur jednej cegły ma dwie warstwy wozówek albo główki: 1/((0,12 + 0,01)(0,065 + 0,01)) = 103 szt./m². Masa i koszt liczone z objętości cegły 25 × 12 × 6,5 też wychodzą o połowę za małe. Liczba cegieł do zamówienia zaniżona o 50%. Poprawka [37]: długość w licu 12 cm (objętość pozostaje 25 × 6,5 × 12 → ten sam wzór daje 102,6 szt./m² i podwójną masę).

### Wątpliwe
- Zaprawa tradycyjna przeliczana na worki 15 l z 25 kg (np. weber ZM5 podaje ok. 14–15 l z worka) i 1,7 t/m³ – rząd wielkości prawidłowy.
- Liczby na paletach (Ytong 24: 40 szt. w PRO, 48 w module MUR) – nie udało się pobrać kart producenta, więc nie rozstrzygam. Oba miejsca opisują je jako typowe i do sprawdzenia w karcie.

---

## 5. `otulina` – zdeptane zbrojenie (moduł ZBR)

### Sprawdzone i poprawne
- M_Rd z prostokątnego bloku (λ = 0,8, η = 1, ε_cu = 3,5‰), równowaga sił metodą bisekcji, σ_s ze zgodności odkształceń (PN-EN 1992-1-1 p. 3.1.7, 6.1). Przypadek „wsp” (h = 160, c = 40, Ø10 co 100, C30/37): d = 115 mm, x = 19,9 mm, M_Rd = 785·435·(115 − 8)/10⁶ = 36,5 kNm/m – zgodne. Po Δ = 20 mm: 29,7 kNm/m, strata 18,7% (reguła Δd/d 17,4%), wykorzystanie 104,5%.
- Otulina c_min,dur dla S4: XC1 15, XC2/XC3 25, XC4 30 mm (tabl. 4.4N), Δc_dev = 10 mm, c_min,b = Ø.
- Ogień: a = 10 / 20 / 30 / 40 mm dla REI 30–120 i grubości 60 / 80 / 100 / 120 mm (PN-EN 1992-1-2 tabl. 5.8, płyty jednokierunkowe).
- Rysy wg 7.3.4 (k_t = 0,4, h_c,eff = min(2,5(h − d), (h − x)/3, h/2), s_r,max = 3,4c + 0,425·k1·k2·Ø/ρ), w_max 0,4 / 0,3 mm (tabl. 7.1N). Ugięcie z interpolacją ζ (wz. 7.18, β = 0,5).
- Przypadki graniczne: h ≤ c + Ø (d ≤ 0) obsłużone komunikatem, obniżenie ograniczone geometrią (dGeo), Δ ujemne → 0.

### Błędy
Brak.

### Wątpliwe
- A_s,min liczony z f_yk = 500 i f_ctm z klasy betonu – zgodny z wz. 9.1N. Prosty kalkulator (pola) przyjmuje stałe C30/37, XC4 i ut = 85% bez pokazania tego w polach. Jest to opisane w module, ale w prostej karcie nie widać założeń (sprawa opisu, nie wyniku).
- Moment quasi-stały 0,6·M_Ed jest przybliżeniem (dla G/Q typowych stropów 0,6–0,7). Opisane jako orientacyjne.

---

## 6. `bloczki` – ile bloczków (moduł MUR)

### Sprawdzone i poprawne
- Prosty kalkulator: A = L·H − otwory (≥ 0), szt./m² = 10⁶/((L + j_v)(H + j_h)), n = ⌈A·szt./m²·(1 + z)⌉. Ręcznie dla danych domyślnych: (40·2,7 − 12) = 96 m², 8,39 szt./m², 846 szt. – zgodne.
- Moduł: dane producenta (szt./m², zużycie kleju/zaprawy) mają pierwszeństwo przed geometrią. Porotherm 25 P+W 10,7 szt./m² (poradnik: 10,7), Silka E 15 szt./m², Ytong 8,33 szt./m². Dachy: pola szczytów, ścianki kolankowe, naczółki; sztuki i palety zaokrąglane w górę.

### Błędy
1. **DROBNY – bloczek betonowy 38 × 24 × 12:** wpisane 19 szt./m², z wymiarów i spoin 10 mm wychodzi 19,7 (poradniki: ok. 20–22). Poprawka [38]: liczyć z geometrii.

### Wątpliwe
- Leca BLOK fundamentowy 5 (38 × 24 × 24) na mur 24 cm: w module 11 szt./m², z geometrii 10,3, karta podaje „211 szt./m” (prawdopodobnie na m³ albo błąd wydruku). Nie rozstrzygam.

---

## 7. `lawy` – beton na ławy (moduł LAW)

### Sprawdzone i poprawne
- Prosty kalkulator: V = L·b·h, zamówienie ⌈V(1 + z)·2⌉/2, kursy ⌈O/w⌉. Ręcznie 50·0,6·0,4 = 12,0 m³ → 12,6 → 13,0 m³, 2 kursy – zgodne.
- Moduł: obwód w osiach × przekrój (dla prostokąta to dokładnie pole pierścienia), ławy wewnętrzne minus b/2 na każde połączenie, skrzyżowanie minus b_w. Dom 12 × 10: 44·0,24 + 9,4·0,5·0,35 = 12,205 m³ – zgodne. Przekroje schodkowy i ze skosem, płyta z pogrubieniem, chudy beton z odsadzką, strefy przemarzania jak w PN-81/B-03020.
- Stal: 0,00617·d² kg/m, +10% na zakłady, strzemiona z otuliną. Masa betonu 2,4 t/m³.

### Błędy
1. **DROBNY – przy zerowej objętości** kafelek „Betonowóz” pokazuje „0 kursów, ostatni ok. 8,0 m³”. Poprawka [39].

### Wątpliwe
- Otulina zbrojenia ław domyślnie 5 cm. PN-EN 1992-1-1 p. 4.4.1.3(4) zaleca dla betonu układanego na przygotowanym podłożu (chudym betonie) c_nom ≥ 40 mm, a bezpośrednio na gruncie ≥ 75 mm. Przy wariancie „bez chudego betonu” (pole `ch.on` wyłączone, np. przykład „ogrodzenie”) 5 cm to za mało, ale wpływa to tylko na długość strzemion w zestawieniu, nie na objętość betonu. Warto dodać ostrzeżenie w tekście.

---

## Poprawki – dokładne fragmenty (to samo w `poprawki_D.json`)

**[0] lawa · DROBNY**: Opisy stref przemarzania: strefa I to zachód i północny zachód (nie całe wybrzeże), tereny podgórskie leżą w strefie III, a strefa IV to tylko północno-wschodni narożnik (Suwalszczyzna).

stare:
```js
const STREFA = {1: ['I (zachód, wybrzeże)', .8], 2: ['II (centrum)', 1.0], 3: ['III (wschód)', 1.2], 4: ['IV (Suwalszczyzna, góry)', 1.4]};
```
nowe:
```js
const STREFA = {1: ['I (zachód i północny zachód)', .8], 2: ['II (centrum i południowy zachód)', 1.0], 3: ['III (wschód, południowy wschód, tereny podgórskie)', 1.2], 4: ['IV (północno-wschodni narożnik, Suwalszczyzna)', 1.4]};
```

**[1] lawa · DROBNY**: Ciężar gruntu na odsadzkach liczony z wysokości (hgr − h) zamiast z wysokości gruntu nad ławą hgr (opis pola). Przy domyślnych danych grunt 0,65 m zamiast 0,85 m (D − h): G_k zaniżone o ok. 3%, naprężenie o ok. 2,5%; dodatkowo przy b < grubości ściany fundamentowej ciężar wychodził ujemny.

stare:
```js
self = b * h * 25 + (b - sc) * Math.max(0, n('hgr') - h) * 18;
```
nowe:
```js
self = b * h * 25 + Math.max(0, b - sc) * Math.max(0, n('hgr')) * 18;
```

**[2] lawa · DROBNY**: To samo w szerokości minimalnej bmin: wysokość gruntu nad ławą = hgr.

stare:
```js
Math.max(qf - 1.35 * (h * 25 + Math.max(0, n('hgr') - h) * 18), 1)
```
nowe:
```js
Math.max(qf - 1.35 * (h * 25 + Math.max(0, n('hgr')) * 18), 1)
```

**[3] lawa · DROBNY**: Domyślna wysokość gruntu nad ławą zgodna z geometrią domyślną (D − h = 1,20 − 0,35 = 0,85 m).

stare:
```js
D: 1.2, hgr: 1.0,
```
nowe:
```js
D: 1.2, hgr: .85,
```

**[4] lawa · DROBNY**: Objaśnienie pola „Grunt nad ławą”.

stare:
```js
{k: 'hgr', t: 'num', l: 'Grunt nad ławą', u: 'm', step: .05}
```
nowe:
```js
{k: 'hgr', t: 'num', l: 'Grunt nad ławą', u: 'm', step: .05, h: 'Wysokość zasypki nad wierzchem ławy, zwykle D − h; od strony wnętrza do spodu podłogi na gruncie.'}
```

**[5] lawa · ISTOTNY**: Warunek wysokości ławy h ≥ 0,8·odsadzka jest za łagodny. PN-EN 1992-1-1 p. 12.9.3 (ława z betonu niezbrojonego poprzecznie): 0,85·h/a ≥ √(3σ/f_ctd), f_ctd = 0,8·1,5/1,4 MPa dla C20/25 (uproszczenie h/a ≥ 2). Przy 250–300 kPa wymagane h ≈ 1,1–1,2·a, program dopuszcza 0,8·a (za niska ława o 30–50%).

stare:
```js
const D = n('D'), okD = D >= hz - 1e-9, wyst = (b - sc) / 2, okH = h >= Math.max(.3, wyst * .8);
```
nowe:
```js
const D = n('D'), okD = D >= hz - 1e-9, wyst = (b - sc) / 2, kH = Math.min(3, Math.sqrt(3 * Math.max(0, sig) / 1000 / (.8 * 1.5 / 1.4)) / .85), okH = h >= Math.max(.3, wyst * kH);
```

**[6] lawa · ISTOTNY**: Przekazanie współczynnika kH do wyniku.

stare:
```js
D, okD, wyst, okH, sc,
```
nowe:
```js
D, okD, wyst, okH, kH, sc,
```

**[7] lawa · ISTOTNY**: Komunikat o minimalnej wysokości ławy zgodny z nowym warunkiem (zaokrąglenie w górę do 5 cm).

stare:
```js
zwiększ do min. ${PX.fi(Math.max(30, r.wyst * 80))} cm
```
nowe:
```js
zwiększ do min. ${PX.fi(Math.ceil(Math.max(30, r.wyst * r.kH * 100) / 5) * 5)} cm
```

**[8] lawa · DROBNY**: Podstawa normowa: dopisanie warunku wysokości ławy.

stare:
```js
PN-EN 1992-1-1 (otulina, zbrojenie konstrukcyjne)
```
nowe:
```js
PN-EN 1992-1-1 (otulina, zbrojenie konstrukcyjne, p. 12.9.3: wysokość ławy z warunku zginania odsadzki)
```

**[9] strop · KRYTYCZNY**: Dane stropów gęstożebrowych niezgodne z danymi systemu Teriva: Teriva 6.0 i 8.0 mają 34 cm i ciężar ok. 4,0 kN/m² (program: 24/30 cm, 3,4/3,9 kN/m²), maksymalne rozpiętości 6.0 i 8.0 zamienione miejscami (systemowo 7,8 m dla 6.0 i 7,2 m dla 8.0; program 7,2 i 7,8 m, czyli dla 8.0 o 0,6 m za dużo). Dodano dopuszczalne obciążenie ponad ciężar własny (4,0 / 6,0 / 8,0 kN/m² charakterystycznie).

stare:
```js
t4: ['Strop gęstożebrowy typu Teriva 4.0 (24 cm)', 2.9, 6.0], t6: ['Strop gęstożebrowy typu Teriva 6.0 (24 cm)', 3.4, 7.2], t8: ['Strop gęstożebrowy typu Teriva 8.0 (30 cm)', 3.9, 7.8],
```
nowe:
```js
t4: ['Strop gęstożebrowy typu Teriva 4.0/1 (24 cm)', 2.9, 6.0, 4.0], t6: ['Strop gęstożebrowy typu Teriva 6.0 (34 cm)', 4.0, 7.8, 6.0], t8: ['Strop gęstożebrowy typu Teriva 8.0 (34 cm)', 4.0, 7.2, 8.0],
```

**[10] strop · KRYTYCZNY**: Brak sprawdzenia obciążenia ponad ciężar własny stropu gęstożebrowego. Domyślnie (jastrych z ogrzewaniem, ścianki, 1,5 kN/m²) wychodzi 4,25 kN/m² przy dopuszczalnych 4,0 kN/m² dla Teriva 4.0, a program pisze „przechodzi sprawdzenie”. Przy płytkach, ściankach ceramicznych i 2,0 kN/m² nadwyżka ok. 30%.

stare:
```js
else { Object.assign(out, {lmax: T[2], okM: l <= T[2], okL: true}); }
```
nowe:
```js
else { const okQ = g - self + q <= T[3] + 1e-9; Object.assign(out, {lmax: T[2], qadm: T[3], okQ, okM: l <= T[2] && okQ, okL: true}); }
```

**[11] strop · KRYTYCZNY**: Wiersz wyników: obciążenie ponad ciężar własny porównane z dopuszczalnym.

stare:
```js
['Obciążenie dodatkowe do sprawdzenia w tabeli producenta', PX.fx(r.g - r.self + r.q, 2) + ' kN/m²']
```
nowe:
```js
['Obciążenie ponad ciężar własny / dopuszczalne (charakt.)', `${PX.fx(r.g - r.self + r.q, 2)} / ${PX.fx(r.qadm, 1)} kN/m² ${r.okQ ? PX.badge('ok', 'mieści się') : PX.badge('bad', 'za duże')}`]
```

**[12] strop · KRYTYCZNY**: Wiersz rozpiętości ocenia tylko rozpiętość (okM obejmuje teraz też obciążenie).

stare:
```js
${PX.fx(r.l, 2)} / ${PX.fx(r.lmax, 1)} m ${r.okM ?
```
nowe:
```js
${PX.fx(r.l, 2)} / ${PX.fx(r.lmax, 1)} m ${r.l <= r.lmax ?
```

**[13] strop · KRYTYCZNY**: Kafelek „Rozpiętość” ocenia tylko rozpiętość.

stare:
```js
st: r.okM ? 'ok' : 'bad', s: `maks. ok. ${PX.fx(r.lmax, 1)} m`}
```
nowe:
```js
st: r.l <= r.lmax ? 'ok' : 'bad', s: `maks. ok. ${PX.fx(r.lmax, 1)} m`}
```

**[14] strop · KRYTYCZNY**: Werdykt podaje właściwą przyczynę (rozpiętość albo obciążenie).

stare:
```js
'Rozpiętość przekracza orientacyjne maksimum dla tego stropu: wybierz wyższy typ lub dodaj podciąg.'
```
nowe:
```js
(r.l > r.lmax ? 'Rozpiętość przekracza orientacyjne maksimum dla tego stropu: wybierz wyższy typ lub dodaj podciąg.' : 'Obciążenie ponad ciężar własny przekracza dopuszczalne dla tego typu stropu: wybierz typ o większej nośności albo zmniejsz obciążenie.')
```

**[15] strop · DROBNY**: Rysunek: wysokość stropów Teriva 6.0 i 8.0 to 34 cm.

stare:
```js
st.typ === 't8' ? 30 : 24
```
nowe:
```js
st.typ === 't4' ? 24 : 34
```

**[16] strop · DROBNY**: Rysunek: nadbeton 3 cm w Teriva 4.0/1, 4 cm w pozostałych.

stare:
```js
(st.typ === 't8' ? 6 : 4)
```
nowe:
```js
(st.typ === 't4' ? 3 : 4)
```

**[17] strop · DROBNY**: Rysunek: rozstaw belek 60 cm (Teriva 4.0) i 45 cm (6.0, 8.0).

stare:
```js
const hp = hS - hn, R0 = 60,
```
nowe:
```js
const hp = hS - hn, R0 = st.typ === 't4' ? 60 : 45,
```

**[18] strop · DROBNY**: Opis rozstawu belek na rysunku zgodny z typem.

stare:
```js
'rozstaw osiowy belek 60 cm'
```
nowe:
```js
`rozstaw osiowy belek ${R0} cm`
```

**[19] strop · ISTOTNY**: Moment liczony z rozpiętości w świetle. PN-EN 1992-1-1 p. 5.3.2.2: l_eff = l_n + a1 + a2, a_i = min(h/2; t/2). Dla płyty 20 cm na ścianach 24 cm przy 5,0 m w świetle l_eff = 5,2 m: moment o 8% większy, a domyślna płyta nie spełnia już warunku l/d. Najprostsza poprawka: pole jako rozpiętość obliczeniowa (w uproszczeniu w osiach ścian).

stare:
```js
{k: 'l', t: 'num', l: 'Rozpiętość w świetle podpór', u: 'm', step: .05}
```
nowe:
```js
{k: 'l', t: 'num', l: 'Rozpiętość obliczeniowa (w osiach podpór)', u: 'm', step: .05, h: 'Rozpiętość w świetle powiększona z każdej strony o połowę grubości płyty, nie więcej niż o połowę grubości ściany (PN-EN 1992-1-1, 5.3.2.2). W uproszczeniu odległość osi ścian.'}
```

**[20] strop · ISTOTNY**: Strop dwuprzęsłowy: moment przęsłowy w l²/14,2 przy pełnym obciążeniu obu przęseł. PN-EN 1992-1-1 p. 5.1.3 wymaga niekorzystnego układu obciążenia zmiennego (jedno przęsło): M = (0,070·1,35g + 0,096·1,5q)·l². Zaniżenie 6% przy q = 1,5 i do 15% przy q = 5 kN/m².

stare:
```js
const Mp = w * l * l * S[1],
```
nowe:
```js
const Mp = st.sch === 'c2' ? (1.35 * g * .0703 + 1.5 * q * .0957) * l * l : w * l * l * S[1],
```

**[21] strop · ISTOTNY**: Ten sam układ obciążeń przy wyznaczaniu minimalnej grubości płyty.

stare:
```js
mu = ww * l * l * S[1] / 1000 / (dd * dd * fcd)
```
nowe:
```js
mu = (st.sch === 'c2' ? 1.35 * (hh * 25 + g - self) * .0703 + 1.5 * q * .0957 : ww * S[1]) * l * l / 1000 / (dd * dd * fcd)
```

**[22] strop · ISTOTNY**: Reakcja na ścianę w schemacie dwuprzęsłowym podana jako 0,625·w·l (udział jednego przęsła). Ściana środkowa przenosi 1,25·w·l (oba przęsła), skrajne 0,375·w·l. Wynik „do przeniesienia do programu Ława” zaniżony o 50% dla ściany środkowej.

stare:
```js
R = w * l / 2 * (st.sch === 'c2' ? 1.25 : 1), Rk = wk * l / 2 * (st.sch === 'c2' ? 1.25 : 1);
```
nowe:
```js
R = w * l / 2 * (st.sch === 'c2' ? 2.5 : 1), Rk = wk * l / 2 * (st.sch === 'c2' ? 2.5 : 1);
```

**[23] strop · ISTOTNY**: Opis reakcji przy schemacie dwuprzęsłowym.

stare:
```js
Reakcja na ścianę: ${PX.fx(r.R, 1)} kN/m (charakterystycznie
```
nowe:
```js
Reakcja na ścianę${r.S === SCH.c2 ? ' środkową (z obu przęseł; na ściany skrajne ok. 0,375·w·l)' : ''}: ${PX.fx(r.R, 1)} kN/m (charakterystycznie
```

**[24] strop · ISTOTNY**: Etykieta kafelka reakcji przy schemacie dwuprzęsłowym.

stare:
```js
{l: 'Reakcja na ścianę', v: PX.fx(r.R, 1), u: 'kN/m'}
```
nowe:
```js
{l: st.sch === 'c2' ? 'Reakcja na ścianę środkową' : 'Reakcja na ścianę', v: PX.fx(r.R, 1), u: 'kN/m'}
```

**[25] strop · ISTOTNY**: Rozstaw prętów wychodzi 2,5 cm (albo 0) i program uznaje płytę za poprawną (np. l = 5,25 m, h = 18 cm, Ø8, dwa przęsła, q = 5: góra Ø8 co 2,5 cm). PN-EN 1992-1-1 p. 8.2: odstęp w świetle ≥ max(Ø; d_g + 5 mm; 20 mm), czyli rozstaw osiowy ≥ Ø + 21 mm.

stare:
```js
okM: Ap != null && (Ms ? Asu != null : true)
```
nowe:
```js
okM: Ap != null && sp >= (fi + 21) / 10 && (Ms ? Asu != null && spS >= (fi + 21) / 10 : true)
```

**[26] strop · ISTOTNY**: Werdykt przy zbyt gęstym zbrojeniu: zwiększyć średnicę prętów (a nie grubość).

stare:
```js
r.typ === 'plyta' ? `Płyta ${PX.fi(r.h * 100)} cm jest za cienka: zwiększ do ok. ${PX.fi(Math.round(r.hmin * 100))} cm albo dodaj podporę.` : r.typ === 'drewno'
```
nowe:
```js
r.typ === 'plyta' ? (r.Ap != null && (!r.Ms || r.Asu != null) && r.okL ? `Rozstaw prętów Ø${r.fi} wychodzi za mały do wykonania: przyjmij większą średnicę prętów.` : `Płyta ${PX.fi(r.h * 100)} cm jest za cienka: zwiększ do ok. ${PX.fi(Math.round(r.hmin * 100))} cm albo dodaj podporę.`) : r.typ === 'drewno'
```

**[27] strop · ISTOTNY**: Belka drewniana: ugięcie chwilowe od g + q porównane z l/300, bez pełzania. PN-EN 1995-1-1 p. 2.2.3 i 7.2: w_fin = w_G(1 + k_def) + w_Q(1 + ψ2·k_def), k_def = 0,6 (drewno lite, klasa użytkowania 1), ψ2 = 0,3 (kat. A), granica l/250. Obecny warunek jest o ok. 20% łagodniejszy.

stare:
```js
u = 5 * wk * a * l ** 4 / (384 * 11e6 * I) * 1000, ulim = l * 1000 / 300
```
nowe:
```js
u = 5 * (g * 1.6 + q * 1.18) * a * l ** 4 / (384 * 11e6 * I) * 1000, ulim = l * 1000 / 250
```

**[28] strop · ISTOTNY**: Opis założeń ugięcia belki drewnianej.

stare:
```js
Drewno C24, k<sub>mod</sub> 0,8, γ<sub>M</sub> 1,3, ugięcie l/300.
```
nowe:
```js
Drewno C24, k<sub>mod</sub> 0,8, γ<sub>M</sub> 1,3, ugięcie końcowe z pełzaniem (k<sub>def</sub> 0,6, ψ<sub>2</sub> 0,3) ≤ l/250.
```

**[29] strop · ISTOTNY**: Ścianki działowe: ścianka z betonu komórkowego 12 cm z tynkiem waży ok. 3 kN/m (nie ≤ 2), ceramiczna 11,5 cm ok. 3,4 kN/m, silikatowa 12 cm ok. 5,4 kN/m (z kart producentów: masa elementów × szt./m² + tynk, wys. 2,65 m). PN-EN 1991-1-1 p. 6.3.1.2(8): zastępcze 1,2 kN/m² tylko do 3 kN/m, cięższe ścianki liczy się jako obciążenie liniowe.

stare:
```js
bk: ['Ścianki z betonu komórkowego 12 cm (≤ 2 kN/m)', .8], cer: ['Ścianki ceramiczne / silikat 12 cm (≤ 3 kN/m)', 1.2]
```
nowe:
```js
bk: ['Ścianki z betonu komórkowego 12 cm z tynkiem (ok. 3 kN/m)', 1.2], cer: ['Ścianki ceramiczne / silikat 12 cm (ponad 3 kN/m: wymagają obliczenia jako obciążenie liniowe, tu orientacyjnie)', 1.2]
```

**[30] strop · DROBNY**: Smukłość graniczna l/d bez mnożnika 7/l_eff dla rozpiętości ponad 7 m ze ściankami działowymi (PN-EN 1992-1-1 p. 7.4.2(2)).

stare:
```js
return Math.min(K * b * Math.min(1.5, Math.max(1, f || 1)), 40); };
```
nowe:
```js
return Math.min(K * b * Math.min(1.5, Math.max(1, f || 1)) * (l > 7 && st.dz !== 'brak' ? 7 / l : 1), 40); };
```

**[31] schody · ISTOTNY**: Stopnie zabiegowe: § 69 ust. 6 wymaga szerokości stopnia co najmniej 0,25 m w odległości nie większej niż 0,4 m od wewnętrznej poręczy. Program porównuje z s, więc przy s < 25 cm (np. h = 19 cm, krok 60–62 cm → s = 22–24 cm) uznaje stopnie za zgodne.

stare:
```js
add('Stopnie zabiegowe: szerokość 40 cm od wewnętrznej krawędzi', `≥ s = ${PX.fx(s * 100, 1)} cm (§ 69 ust. 6)`, PX.fx(P.wInfo.inTread * 100, 1) + ' cm', P.wInfo.inTread >= s - .005);
```
nowe:
```js
add('Stopnie zabiegowe: szerokość 40 cm od wewnętrznej krawędzi', `≥ 25 cm (§ 69 ust. 6) i ≥ s = ${PX.fx(s * 100, 1)} cm`, PX.fx(P.wInfo.inTread * 100, 1) + ' cm', P.wInfo.inTread >= Math.max(.25, s) - .005);
```

**[32] schody · ISTOTNY**: Schody kręcone: sprawdzenie zawsze „spełnia”. Wymagane co najmniej 0,25 m w odległości 0,4 m od słupa (§ 69 ust. 6).

stare:
```js
add('Kręcone: szerokość 40 cm od słupa', `= s ${PX.fx(s * 100, 1)} cm`, PX.fx(P.kInfo.at40 * 100, 1) + ' cm', true);
```
nowe:
```js
add('Kręcone: szerokość 40 cm od słupa', '≥ 25 cm (§ 69 ust. 6)', PX.fx(P.kInfo.at40 * 100, 1) + ' cm', P.kInfo.at40 >= .25 - .005);
```

**[33] schody · ISTOTNY**: Szerokość biegu schodów kręconych 60–80 cm oznaczona „na granicy”, a werdykt nie każe jej poprawić. § 68 ust. 1 nie przewiduje wyjątku dla schodów kręconych: w budynku jednorodzinnym bieg ≥ 0,8 m.

stare:
```js
P.B >= .8 - 1e-9, kind === 'K' && P.B >= .6);
```
nowe:
```js
P.B >= .8 - 1e-9);
```

**[34] schody · DROBNY**: Podstawa prawna: dopisanie wymaganej szerokości 0,25 m.

stare:
```js
§ 69 ust. 6 (stopnie zabiegowe i kręcone: szerokość stopnia zapewniona nie dalej niż 0,4 m od poręczy lub słupa)
```
nowe:
```js
§ 69 ust. 6 (stopnie zabiegowe i kręcone: szerokość stopnia co najmniej 0,25 m zapewniona nie dalej niż 0,4 m od poręczy lub słupa)
```

**[35] schody · DROBNY**: Wysokość kondygnacji 0 albo pusta daje stopnie 0 cm uznane za zgodne.

stare:
```js
add('Wysokość stopnia h', '≤ 19 cm', PX.fx(h * 100, 1) + ' cm', h <= .19 + 1e-9);
```
nowe:
```js
add('Wysokość stopnia h', '≤ 19 cm', PX.fx(h * 100, 1) + ' cm', h > 0 && h <= .19 + 1e-9);
```

**[36] schody · DROBNY**: Sprawdzenie stopni zabiegowych na linii biegu: wymaganie dotyczy 2h + s, a w kolumnie „Jest” pokazana sama głębokość stopnia (np. 30,3 cm przy wymaganiu 60–68 cm).

stare:
```js
'2h + s w granicach 60–68 cm', PX.fx(P.wInfo.walkTread * 100, 1) + ' cm'
```
nowe:
```js
'2h + s w granicach 60–68 cm', PX.fx((2 * h + P.wInfo.walkTread) * 100, 1) + ' cm'
```

**[37] mury · KRYTYCZNY**: Cegła pełna, mur 25 cm (jedna cegła): liczba sztuk liczona z lica 25 × 6,5 cm, tj. 51 szt./m², tak jak dla muru 12 cm. Mur 25 cm ma dwie warstwy wozówek albo główki: ok. 103 szt./m². Wynik zaniżony o połowę. Poprawka: długość w licu 12 cm (główka), objętość cegły bez zmian.

stare:
```js
cg25: ['Cegła pełna 25×12×6,5, mur 25 cm', 25, 6.5, 25,
```
nowe:
```js
cg25: ['Cegła pełna 25×12×6,5, mur 25 cm', 12, 6.5, 25,
```

**[38] bloczki · DROBNY**: Bloczek betonowy 38×24×12 (mur 24 cm): 19 szt./m² wpisane na sztywno, a z wymiarów i spoin 10 mm wychodzi 19,7 szt./m² (poradniki: ok. 20–22 szt./m²). Wynik zaniżony o ok. 4%. Poprawka: liczyć z geometrii.

stare:
```js
nm: 'Bloczek betonowy 38×24×12 B15', L: 380, T: 240, H: 120, jh: 10, jv: 10, m2: 19,
```
nowe:
```js
nm: 'Bloczek betonowy 38×24×12 B15', L: 380, T: 240, H: 120, jh: 10, jv: 10, m2: null,
```

**[39] lawy · DROBNY**: Przy zerowej objętości (np. długość 0) kafelek pokazuje „0 kursów, ostatni ok. 8,0 m³”.

stare:
```js
last: order - (trucks - 1) * S.cap}
```
nowe:
```js
last: trucks ? order - (trucks - 1) * S.cap : 0}
```

---

## Źródła

1. [§ 68 – szerokość użytkowa schodów (WT 2002)](https://arslege.pl/szerokosc-uzytkowa-schodow/k218/a23215/) — arslege.pl — tabela § 68 ust. 1: dom jednorodzinny bieg 0,8 / spocznik 0,8 / stopień 0,19 m; schody do piwnic i pomieszczeń technicznych 0,8 / 0,8 / 0,2 m; ust. 4 sposób pomiaru
2. [§ 68 WT – lexlege](https://lexlege.pl/tech-war-budynkow/paragraf-68/) — lexlege.pl — ta sama tabela § 68 (drugie niezależne potwierdzenie)
3. [§ 69 WT – liczba stopni](https://arslege.pl/liczba-stopni/k218/a23216/) — arslege.pl — § 69 ust. 1–2 (17 stopni, wyłączenie domów jednorodzinnych), ust. 4 (2h + s = 0,60–0,65 m), ust. 6 (0,25 m mierzone ≤ 0,4 m od poręczy lub słupa); akt uchylony 20.09.2026
4. [Rozdział 4 WT – schody i pochylnie](https://arslege.pl/rozporzadzenie-ministra-infrastruktury-w-sprawie-warunkow-technicznych-jakim-powinny-odpowiadac-budynki-i-ich-usytuowanie/k218/s3055/) — arslege.pl — § 68–71, potwierdzenie § 69 ust. 6
5. [Schody, pochylnie i balustrady – wymagania techniczne](https://inzynierbudownictwa.pl/?p=12001) — Inżynier Budownictwa — § 69 ust. 6: stopnie zabiegowe min. 0,25 m, 0,4 m to miejsce pomiaru; § 296
6. [Wymiary podestu](https://inzynierbudownictwa.pl/wymiary-podestu/) — Inżynier Budownictwa — minimalna szerokość spocznika 0,80 m w domu jednorodzinnym, brak wymogu głębokości
7. [Wymiary schodów](https://inzynierbudownictwa.pl/wymiary-schodow/) — Inżynier Budownictwa — § 69 ust. 4, sposób stosowania § 68
8. [§ 298 WT – balustrady](https://lexlege.pl/tech-war-budynkow/paragraf-298) — lexlege.pl — balustrada 0,9 m w budynku jednorodzinnym, bez limitu prześwitów
9. [§ 296 WT](https://lexlege.pl/tech-war-budynkow/paragraf-296/) — lexlege.pl — schody ponad 0,5 m z balustradą, wyjątek dla domów do 1 m
10. [Schody norma – wymagania](https://pewnylokal.pl/porady/schody-norma) — pewnylokal.pl — stopnie zabiegowe ≥ 25 cm, bieg ≥ 80 cm, 2h + s 60–65 cm
11. [Przemarzanie gruntu a projektowanie fundamentów](https://inzynierbudownictwa.pl/przemarzanie-gruntu-a-projektowanie-fundamentow/) — Inżynier Budownictwa — mapa PN-81/B-03020: strefy 0,8 / 1,0 / 1,2 m i od 1974 r. 1,4 m na północnym wschodzie; PN-EN 1997-1 bez metody oceny przemarzania
12. [Głębokość posadowień fundamentów – wymagania a rzeczywistość (PDF)](https://nauka.inzynierbudownictwa.pl/wp-content/uploads/2026/01/T_Glebokosc-posadowien-fundamentow-wymagania-a-rzeczywistosc_IB_4_2025_compressed1.pdf) — Inżynier Budownictwa 4/2025 — strefy I–IV 0,8 / 1,0 / 1,2 / 1,4 m (zał. 1 do PN-B-03020:1981), zalecane minimum 0,5 m
13. [Ewolucja mapy przemarzania (Acta Sci. Pol. Architectura 16(3))](https://www.architectura.actapol.net/tom16/zeszyt3/16_3_59.pdf) — Acta Scientiarum Polonorum — strefa 1,4 m: pas na wschód od Kętrzyna, przez Ełk do granicy między Sokółką a Dąbrową Białostocką
14. [Strefy przemarzania gruntu w Polsce](https://kb.pl/aktualnosci/budowa-domu/strefy-przemarzania-gruntu-w-polsce-_z/) — kb.pl — strefa I zachód i północny zachód, II centrum i południowy zachód, III północny wschód i południowy wschód, IV narożnik północno-wschodni
15. [Zbrojenie fundamentu pod ogrodzenie – błędy](https://kb.pl/aktualnosci/ogrod/zbrojenie-fundamentu-pod-ogrodzenie-bledy/) — kb.pl — strefa III: północny wschód i tereny górskie; strefa IV: Suwalszczyzna
16. [Na jaką głębokość kopać fundamenty](https://kb.pl/aktualnosci/architektura-i-budownictwo/glebokosc-fundamentow/) — kb.pl — strefa I Szczecin, Zielona Góra; II Warszawa, Łódź, Poznań; III Lublin, Białystok; IV Suwalszczyzna
17. [Strefa śniegowa, wiatrowa, przemarzanie](https://blog.ongeo.pl/strefa-sniegowa-wiatrowa-przemarzanie-gruntu-projekt-domu) — ONGEO — zakres 0,8 m na zachodzie do 1,4 m na północnym wschodzie
18. [Głębokość przemarzania gruntu](https://muratordom.pl/budowa/fundamenty/glebokosc-przemarzania-gruntu-jaka-powinna-byc-minimalna-glebokosc-fundamentow-czy-instalacji-mapa-aa-hm1u-1qbz-ZfQB.html) — Murator — strefy I–IV, płytsze posadowienie na gruntach niewysadzinowych
19. [EN 1992-1-1 (wersja dwujęzyczna DSTU-N B EN 1992-1-1)](https://dnaop.com/html/62806_10.html) — dnaop.com — p. 12.9.3 ławy z betonu niezbrojonego, uproszczenie h_F/a ≥ 2
20. [Strip foundation design](https://structuralbasics.substack.com/p/strip-foundation-design-5d2) — Structural Basics — ława niezbrojona: wysięg odsadzki mniejszy od połowy wysokości (h/a ≥ 2)
21. [Stropy Teriva – dane techniczne (PDF)](https://budujemydom.pl/files/fhw/11210-stropyteriva.pdf) — Budujemy Dom / producent — Teriva 4.0/1 24 cm 2,68 kN/m² ≤ 7,2 m (ciągły) 4,0 kN/m²; 6.0 34 cm 4,0 kN/m² ≤ 7,8 m 6,0 kN/m²; 8.0 34 cm 4,0 kN/m² ≤ 7,2 m 8,0 kN/m²
22. [Stropy w budownictwie mieszkaniowym](https://inzynierbudownictwa.pl/stropy-w-budownictwie-mieszkaniowym/) — Inżynier Budownictwa — ta sama tabela Teriva, rozstaw belek 60 cm (4.0) i 45 cm (6.0, 8.0), nadbeton 3 / 4 cm
23. [Instrukcja Teriva 4,0/1 (PDF)](https://betomex.koszalin.pl/wp-content/uploads/2025/06/Betomex-Instrukcja-Teriva.pdf) — Betomex — 24 cm, nadbeton 30 mm, 6,0 m jednoprzęsłowy / 7,2 m ciągły, 4,0 kN/m² charakt. (4,9 obl.)
24. [Strop Teriva – Murator](https://muratordom.pl/budowa/stropy-balkony-schody/strop-teriva-poznaj-najpopularniejszy-strop-gestozebrowy-aa-JiSN-45Qk-pmEb.html) — Murator — Teriva 4.0/1 24 cm, 4.0/3 34 cm
25. [Obciążenia – wykład 7 (PWr)](https://wbliw.pwr.edu.pl/download/drE1MDMwZwahQcVg4RT0ESKn0RFjsoGBoGGwxHeEA-GyIeTQ05LRgGEG1WBig,3KfSZuVm9uRz1CImlDZGhmbj9veVNVZ3E1IwQgfjF6cVBpLGNBeDVWLV5nfEw_LnArYzsk/wyklad_7_1.pdf) — Politechnika Wrocławska — kat. A 1,5–2,0 kN/m²; ścianki 0,5 / 0,8 / 1,2 kN/m²
26. [Konstrukcje budowlane – obciążenia (PDF)](https://zsp3.piotrkow.pl/content/files/27.03.2020konstrucje-budowlane-1585344500.pdf) — ZSP nr 3 Piotrków — ścianki 0,50 / 0,80 / 1,20 kN/m² dla ≤ 1 / 2 / 3 kN/m
27. [Obciążenia (PDF, Politechnika Lubelska)](https://wbia.pollub.pl/fcp/8PREgARcJNScXKxEMUA9DBXljWXdFEjNQZ18Qc21Xcgpmc2oRPBIWBHJ-QQQUSg8/_global/public/wbia/files/81/attachment/354503.pdf) — Politechnika Lubelska — kat. A 1,5–2,0 kN/m²; zastępcze tylko dla ścianek do 3 kN/m
28. [Kombinacje obciążeń – wykład 11 (PWr)](https://wbliw.pwr.edu.pl/download/lpGVkJOQx6YB4WXAQbRUsYIHcbHDEiEhAMEQZNcko0ESgURwczJxRidHACGCAS,XEGEMLMwoLIlgnRwwmAQ0DC1oKHDYwAhRQRmFFG1QfFDUMSQYkHVAzSDsCGSlaSxVOBl5B/wyklad_11_9.pdf) — Politechnika Wrocławska — NA do PN-EN 1990: preferowane 6.10a/6.10b, ξ = 0,85, ψ0 = 0,7; 6.10 daje wynik większy (bezpieczny)
29. [SGU wg EC5 – dopuszczalne ugięcia](https://docs.dietrichs.com/dietrichs-intelligent-documentation/docs-pol/informacje-ogolne/wissenssammlungen_dodatkowe-informacje/sgu-wg-ec5-dopuszczalne-ugiecia) — Dietrich's — belki stropowe w_net,fin i w_fin L/250 (wrażliwe L/300)
30. [Ugięcia drewna – baza wiedzy](https://www.dlubal.com/pl/pomoc-techniczna-szkolenia/pomoc-techniczna/baza-informacji/001819) — Dlubal — sprawdzenie w_fin wg EN 1995-1-1 tabl. 7.2, przykład L/250
31. [Ile pustaków na m² ściany](https://kb.pl/aktualnosci/budowa-domu/ile-pustakow-na-m2-sciany/) — kb.pl — bloczek 38 × 24 × 12: 11 szt./m² (mur 12) i 22 szt./m² (mur 24); Porotherm 25: 10,7 szt./m²
32. [Bloczki fundamentowe](https://muratordom.pl/budowa/fundamenty/bloczki-fundamentowe-wymiary-i-ceny-bloczkow-fundamentowych-aa-sRet-KC7N-RQED.html) — Murator — mur 24 cm: ok. 22 szt./m², spoiny 1–1,5 cm
33. [Karta techniczna Leca BLOK fundamentowy 5 (PDF)](https://betomex.koszalin.pl/wp-content/uploads/2025/06/karta_techniczna_Leca_BLOK_fudamentowy_5.pdf) — Betomex / Leca — 240 × 380 × 240 mm, 19–20 kg, ok. 50 szt. na palecie
34. [Kalkulator cegieł](https://www.omnicalculator.com/pl/budownictwo/cegla) — Omni Calculator — ok. 52 cegły 250 × 65 na m² lica (mur pół cegły), co potwierdza, że mur 25 cm wymaga dwa razy więcej
35. [Cegła pełna – kb.pl](https://kb.pl/porady/cegla-pelna-opis-zastosowanie-cena-opinie-porady) — kb.pl — ok. 53 szt./m² (mur pół cegły)
36. [Przygotowanie do murowania – ilość materiałów](https://muratordom.pl/budowa/sciany-murowane/przygotowanie-do-murowania-scian-jak-obliczyc-ilosc-potrzebnych-materialow-aa-tTE2-kwb8-1993.html) — Murator — zużycie zaprawy: grube spoiny ok. 17,5 kg/m², cienkie 2,4 kg/m², pianka 0,15 l/m²
37. [Nadproża Ytong – ulotka (PDF)](https://budujemydom.pl/files/dkr/12700-Ulotka_Nadproza_YTONG-03-2012.pdf) — Xella / Budujemy Dom — oparcie nadproży z betonu komórkowego 20–25 cm, liczba nadproży w zależności od grubości muru

Nie pobrano (prośba o zgodę wygasła): karta Ytong PP4/0,6 (xella.bimproduction.eu) i karta Silka E-S (storefrontapi.commerce.xella.com). Wyczerpał się też wspólny limit wyszukiwań, więc nie potwierdziłem w drugim źródle danych palet. Norm PN-EN 1992-1-1 (p. 5.3.2.2, 5.1.3, 8.2, 7.4.2) i PN-EN 1995-1-1 (2.2.3, kdef) nie udało się pobrać w pełnym brzmieniu. Wartości z tych punktów podaję z treści norm (wzory standardowe), a rozwiązanie belki dwuprzęsłowej (9/128, 49/512) sprawdziłem obliczeniem.
