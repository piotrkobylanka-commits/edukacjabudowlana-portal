# Raport B – audyt kalkulatorów: pompa, podloga, pv, jastrych (PRO) i jastrych (prosty)

Data: 31.10.2026. Metoda: odczyt kodu (`pro_*.js`, moduł `const JAS = (() => {` w index.html, wiersz ok. 3499), uruchomienie funkcji `calc` w Node z prawdziwym `PX` wyciętym z index.html (skrypty w `/tmp/claude-0/-home-claude/633b67a5-0659-5c95-9a98-78b30009c356/scratchpad/auditB_scripts/`), porównanie z normami, kartami producentów i źródłami prawnymi. Każdy fragment `stare` z `poprawki_B.json` występuje w index.html dokładnie 1 raz. Pliki po podmianie przechodzą `node --check`.

Podsumowanie: **13 poprawek** – KRYTYCZNY 1, ISTOTNY 5, DROBNY 7.

---

## 1. PRO `pompa` – dobór pompy ciepła, punkt biwalentny, SCOP, koszt

### Sprawdzone i poprawne
- Temperatury obliczeniowe stref I–V: −16/−18/−20/−22/−24 °C (PN-82/B-02403, przyjęte bez zmian w krajowym załączniku PN-EN 12831) – zgodne. Przypisanie miast do stref zgodne z mapą stref.
- Definicja punktu biwalentnego (najniższa temperatura, przy której moc pompy pokrywa 100% obciążenia) – zgodna z rozp. 813/2013 i PN-EN 14825. Wyszukiwanie bisekcją działa (test: −10,8 °C dla wartości domyślnych).
- Charakterystyki typowe (np. 7 kW: COP 4,8 / 3,8 / 2,9 / 2,3 w A7/A2/A−7/A−15 przy W35) mieszczą się w zakresie kart katalogowych (Termet Heat Gold, Stiebel HPA-O 8, Bosch CS7000i: COP A−7/W35 ok. 2,8–2,9).
- Ciepła woda: Q = n·V·Δt·1,163/1000 · 1,15 (straty) – poprawne. Pominięcie c.w.u. w linii zapotrzebowania przy wyznaczaniu punktu biwalentnego – poprawne (PN-EN 14825 liczy tylko ogrzewanie).
- Rozkład godzin temperatur (model normalny z miesięcznych średnich) daje 8 760 h i rozsądny rozkład (ok. 2 h/rok poniżej θe – zgodne z istotą temperatury obliczeniowej).
- Ceny domyślne 2026: prąd 1,10 zł/kWh (energia ok. 0,495 zł/MWh netto + dystrybucja + VAT), gaz 0,35 zł/kWh (paliwo ok. 0,24 zł/kWh brutto + dystrybucja), pellet 1 500 zł/t przy 4,9 kWh/kg – realne. Tekst każe wpisać ceny z rachunków – w porządku.

### Błędy
**P1. Linia zapotrzebowania od +20 °C zamiast +16 °C (ISTOTNY).** Kod: `load = phi·(20 − T)/(20 − te)`. PN-EN 14825 i rozp. 813/2013 (def. 23 i 27) liczą obciążenie częściowe Ph(Tj) = Pdesignh·(Tj − 16)/(Tdesignh − 16): obciążenie spada do zera przy +16 °C (zyski wewnętrzne i słoneczne). Skutek: roczne ciepło na ogrzewanie zawyżone o ok. 22% (Szczecin, 6 kW: 15 080 → 12 374 kWh; 2 513 → 2 062 h równoważnych, co zgadza się z HHE 2 066–2 465 h z rozp. 811/2013), koszt pompy i alternatyw zawyżony o 10–15%, punkt biwalentny nieco za wysoki (−10,8 → −11,1 °C; przy 9 kW −3,4 → −4,5 °C). Dodatkowo przy polu „Koniec ogrzewania powyżej” > 20 °C obciążenie wychodzi ujemne (test: load(21) = −0,17 kW). Opis w programie powołuje się na PN-EN 14825, więc wzór musi być zgodny z normą.
`stare`: `const load = T => T < tstop ? phi * (20 - T) / (20 - te) : 0;`
`nowe`: `const load = T => T < tstop ? phi * Math.max(0, 16 - T) / (16 - te) : 0; // PN-EN 14825: Ph(Tj) = Pdesignh·(Tj − 16)/(Tdesignh − 16)`

**P2. Zbyt mocny spadek COP przy wyższej temperaturze zasilania (ISTOTNY).** Kod mnoży COP z karty W35 przez (1 − 0,025·(tz − 35)), czyli przy 55 °C ×0,50. Karty: Termet Heat Gold 9 kW A7: 4,5 → 2,8 (×0,62), Heat Gold 6: 4,7 → 2,7 (×0,57), Bosch CS5000AW A7: 3,9 → 2,7 (×0,69), A−7: 2,9 → 2,1 (×0,72). Skutek: dla grzejników (55 °C) SCOP zaniżony (3,23 zamiast ok. 3,40 przy samej tej zmianie), prąd i koszt pompy zawyżone o ok. 5–6%, co błędnie zniechęca do pompy przy grzejnikach. Poprawka: przeskalowanie według stosunku sprawności Carnota (wynik ×0,62 przy A7 i ×0,72 przy A−7 – trafia w karty).
`stare`: `const d = tf - 35; c *= d > 0 ? Math.max(.35, 1 - .025 * d) : Math.min(1.2, 1 - .02 * d);`
`nowe`: `const d = tf - 35, Tc = Math.min(T, 15); c *= d > 0 ? Math.max(.35, (tf + 273.15) / (tf - Tc) * (35 - Tc) / 308.15) : Math.min(1.2, 1 - .02 * d);`

**P3. COP c.w.u. zawsze dla 50 °C (DROBNY).** Pole „Temperatura c.w.u.” wpływa na ilość ciepła, ale nie na COP grzania wody. Przy 60 °C zużycie zaniżone.
`stare`: `cw / Math.max(1, cop(b.T, 50) * .95)` → `nowe`: `cw / Math.max(1, cop(b.T, Math.max(40, PX.num(st.tcwu))) * .95)`

**P4. Niespójny próg „dobrego” punktu biwalentnego (DROBNY).** Kafelek KPI: „ok” przy ≤ −7 °C, „warn” do −3 °C; werdykt pisze „Pompa sama ogrzeje dom…” (zielony) już przy ≤ −5 °C. Użytkownik widzi żółty kafelek i zielony werdykt.
`stare`: `const okB = r.bivFull || (r.biv != null && r.biv <= -5);` → `nowe`: `const okB = r.bivFull || (r.biv != null && r.biv <= -7);`

Łączny efekt P1–P4 (Szczecin, 6 kW, pompa 7 kW): prąd 4 836 → 4 217 kWh, koszt 5 320 → 4 639 zł, gaz 6 995 → 5 998 zł; przy 55 °C prąd 5 880 → 4 960 kWh.

### Wątpliwe
- Spadek mocy pompy 1%/K powyżej 35 °C – rząd wielkości zgodny z kartami (Termet 9 kW: 8,8 → 8,5 kW przy W55), zostawiam.
- Krzywa grzewcza zaczyna się od 25 °C przy +20 °C – po zmianie P1 można by ją kotwiczyć przy +16 °C, ale to wpływa tylko na COP przy łagodnej pogodzie; bez poprawki.
- Brak w modelu degradacji COP przez odszranianie i taktowanie (PN-EN 14825 – współczynnik Cdh 0,9). Wynik SCOP raczej optymistyczny o kilka procent.

---

## 2. PRO `podloga` – ogrzewanie podłogowe PN-EN 1264

### Sprawdzone i poprawne
- Krzywa charakterystyczna q = 8,92·(θF − θi)^1,1 i odwrócenie θF = θi + (q/8,92)^(1/1,1) – zgodne z PN-EN 1264-2 (potwierdzone w dwóch niezależnych źródłach).
- Graniczne temperatury podłogi 29 °C (strefa pobytu), 35 °C (strefa brzegowa) – zgodne z PN-EN 1264.
- Logarytmiczna różnica temperatur ΔθH = (tv − tr)/ln((tv − ti)/(tr − ti)) i odwrotne wyznaczenie tr bisekcją – poprawne (test: k·ΔθH = qreq dokładnie).
- Przepływ m = A·q·1,1/(1,163·σ), z dodatkiem 10% na straty w dół – rozsądne uproszczenie PN-EN 1264-3.
- Spadek ciśnienia (Darcy-Weisbach, Blasius dla turbulentnego, 64/Re dla laminarnego, +30% na kształtki) i próg prędkości 0,55 m/s – poprawne co do rzędu.
- Długość pętli L = A/s + 2·dojście, dzielenie na pętle `Math.ceil(L/Lmax)` – zaokrąglanie w górę, dobrze. Maksymalne długości 100–120 m dla rur 16–20 mm – w zakresie wytycznych producentów (Purmo: 100 m dla 16×2).
- Opory posadzek R (gres 0,01, panele 8 mm + podkład 0,07, deska 14 mm pływająca 0,12) – realne, granica 0,15 m²K/W zgodna z Purmo i Barlinkiem.

### Błędy
**F1. Zawyżona tabela współczynników K_H (KRYTYCZNY).** Program twierdzi, że K_H to wartości „uśrednione dla jastrychu ok. 45 mm nad rurą”, ale są one o 12–29% wyższe niż wynik wzoru PN-EN 1264-2 (B = 6,7; aB, aT^mT, aD^mD; su = 45 mm, λu = 1,2 W/mK, rura 16×2) i niż tabele producentów. Kontrola: Uponor Tacker 16×2, su = 45 mm: q/ΔθH = 97,7/15,2 = 6,43 (10 cm), 94,7/17,1 = 5,54 (15 cm), 90,6/18,9 = 4,79 (20 cm), 84,4/20,3 = 4,16 (25 cm) przy R = 0; program ma 7,2 / 6,4 / 5,6 / 4,9. Purmo X-net C12, R = 0,10, rozstaw 16,5 cm: 98,3/30,1 = 3,27; program ok. 4,2 (o 29% za dużo). Skutek: program dobiera za rzadki rozstaw (domyślny salon i sypialnie: 25 cm) i obiecuje moc, której podłoga nie odda – w domyślnym projekcie realnie 80–88% wymaganej mocy (salon 30 zamiast 38 W/m²). To wynik po niebezpiecznej stronie: niedogrzane pomieszczenia, wyższa temperatura zasilania, gorszy COP pompy. Nowa tabela pochodzi wprost z wzoru normy i zgadza się z Uponorem co do 0,05.
`stare`: `const KT = {0: [7.2, 6.4, 5.6, 4.9], .05: [5.7, 5.2, 4.6, 4.1], .10: [4.7, 4.3, 3.9, 3.5], .15: [4.0, 3.7, 3.4, 3.0]};`
`nowe`: `const KT = {0: [6.4, 5.5, 4.8, 4.2], .05: [4.7, 4.2, 3.7, 3.3], .10: [3.7, 3.4, 3.0, 2.8], .15: [3.1, 2.8, 2.6, 2.4]};`
Po poprawce domyślnie: salon 20 cm, sypialnia i pokój 15 cm, hol 25 cm, łazienka nadal z deficytem (sygnalizowane).

**F2. Graniczna temperatura w łazience na sztywno 33 °C (DROBNY).** PN-EN 1264 podaje dla łazienek θi + 9 K (33 °C przy 24 °C). Przy łazience z θi = 20 °C program dopuszcza 33 °C zamiast 29 °C.
`stare`: `tF = (TYP[x.typ] || TYP.pokoj)[1];` → `nowe`: `tF = x.typ === 'lazienka' ? Math.min(33, ti + 9) : (TYP[x.typ] || TYP.pokoj)[1];`

### Wątpliwe
- Strefa „brzegowa 35 °C” liczona jak całe pomieszczenie – to celowe uproszczenie (strefa brzegowa ma szerokość do 1 m); opis mógłby to mówić.
- Wysokość podnoszenia „Δp najdłuższej pętli + 10 kPa” – szacunek, zależy od rozdzielacza i źródła. Bez poprawki.
- Brak kontroli minimalnego oporu izolacji pod rurami (0,75 / 1,25 / 2,0 m²K/W wg PN-EN 1264-4) – program tego nie liczy, więc nie jest to błąd, tylko brak funkcji.

---

## 3. PRO `pv` – fotowoltaika, autokonsumpcja, magazyn, net-billing

### Sprawdzone i poprawne
- Uzysk 1 000–1 070 kWh/kWp (S, 35°) – zgodny z rzędem PVGIS i danymi branżowymi (ok. 1 000 kWh/kWp; różnica północ–południe 10–15%).
- Rozkład miesięczny PSH (czerwiec–lipiec ok. 12,8–13,1%, grudzień ok. 2%) – zgodny z danymi pomiarowymi (enerad: 12,7% maj/czerwiec, 2,7% styczeń).
- Współczynniki kierunku i nachylenia (E/W 0,83, pion 0,70) – realne.
- Bilans godzinowy z magazynem: zachowanie energii sprawdzone (produkcja = zużycie bezpośrednie + ładowanie + eksport; zużycie = bezpośrednie + rozładowanie + sieć, błąd 0,0 kWh), sprawności 95%/95%, 90% pojemności użytkowej – typowe.
- Autokonsumpcja bez magazynu 31%, z magazynem 10 kWh 61% – w przedziałach podawanych w branży.
- Zasady net-billingu w opisie: RCE godzinowa dla przyłączeń od 1.07.2024, współczynnik 1,23, depozyt 12 miesięcy – zgodne z ustawą o OZE (stan 2026, ministerstwo nie planuje zmian systemu).

### Błędy
**V1. Cały eksport liczony jako oszczędność (ISTOTNY).** Kod: `save = self·buy + exp·sell`. W net-billingu depozyt pokrywa tylko energię czynną kupowaną od sprzedawcy, nie opłaty dystrybucyjne; nadwyżkę niewykorzystaną przez 12 miesięcy zwraca się najwyżej w 30% (RCE) lub 20% (RCEm) wartości. Skutek: przy instalacji przewymiarowanej względem zużycia oszczędność zawyżona (test: 2 500 kWh zużycia, 20 modułów: 3 598 zamiast 2 755 zł/rok, zwrot 9,9 zamiast 12,7 roku; zużycie 0: zysk 140 zamiast 42 zł). Dla wartości domyślnych wynik bez zmian. Poprawka ogranicza wykorzystanie depozytu do składnika energii w poborze z sieci (ok. 55% ceny brutto: 0,495 zł/kWh netto · 1,23 z 1,10 zł) i dolicza zwrot max 30% reszty.
`stare`: `const save = self * buy + exp * sell, cost`
`nowe`: `const dep = exp * sell, use = Math.min(dep, S('grid') * buy * .55), save = self * buy + use + Math.min(dep - use, .3 * dep), cost`

**V2. Podpowiedź do ceny energii oddanej (DROBNY).** Nie mówi o 1,23, braku pokrycia dystrybucji i limicie zwrotu. Poprawiony tekst w JSON (bez długiej pauzy).

**V3. Przycisk „Dodaj zużycie pompy ciepła” (DROBNY).** Zmienia profil na „Dom z pompą ciepła” także wtedy, gdy program „Pompa ciepła” nie był liczony (zużycie się nie zmienia, a profil tak).
`stare`: `acts: {pobierz(st){ const o = PX.shared('pompaE'); if (o) st.zuz = Math.round(PX.num(st.zuz) + o); st.prof = 'pc'; }},`
`nowe`: `acts: {pobierz(st){ const o = PX.shared('pompaE'); if (o){ st.zuz = Math.round(PX.num(st.zuz) + o); st.prof = 'pc'; } }},`

### Wątpliwe
- Ponowne kliknięcie tego przycisku dodaje zużycie pompy drugi raz (podwójne liczenie). Poprawka wymagałaby zapamiętania stanu – nie proponuję fragmentu.
- W przepływie 25 lat brak kosztu wymiany falownika (martwy kod `(y === 13 && bat > 0 ? 0 : 0)`) i degradacji magazynu. Zwrot optymistyczny o ok. 0,5–1 roku. Decyzja właściciela.
- Strefa 30 cm od krawędzi połaci „ze względu na wiatr” – praktyka montażowa, szerokość stref krawędziowych zależy od PN-EN 1991-1-4 i instrukcji systemu.
- Domyślna wartość energii oddanej 0,30 zł/kWh – zgodna z RCEm 2024–2025 (255–505 zł/MWh) po 1,23, ale RCE w godzinach szczytu PV bywa niższa. Pole edytowalne.

---

## 4. PRO `jastrych` – wygrzewanie jastrychu (PN-EN 1264-4)

### Sprawdzone i poprawne
- Start wygrzewania funkcyjnego: cementowy po 21 dniach, anhydrytowy po 7 dniach; 3 dni 25 °C, potem 4 dni temperatura maksymalna projektowa – zgodne z PN-EN 1264-4 (protokoły KAN-therm, Sabiana).
- Progi CM dla jastrychów ogrzewanych: CT 1,8% (drewno, elastyczne), 2,0% (płytki), CA 0,3% – zgodne z tabelą KAN-therm (Belegreifheizen), TKB/BEB, Baumit, Barlinek.
- Naturalne schnięcie CT: do 4 cm tydzień na cm, potem +2 tygodnie na cm – zgodne z wytycznymi Heidelberg Materials (4 tyg. dla 4 cm + co najmniej 2 tyg. na każdy dalszy cm).
- Limity temperatury osuszania 55 °C (CT) i 50 °C (CA) – nie wyżej niż 55 °C z protokołów (konserwatywnie dla CA).

### Błędy
**J1. Za krótkie wygrzewanie osuszające (ISTOTNY).** Dla jastrychu do ok. 7 cm program planuje osuszanie (wzrost, utrzymanie, obniżanie) na ok. 10 dni, a protokoły producentów (KAN-therm, Heidelberg) wymagają co najmniej 14 dni dla grubości do 70 mm. Skutek: termin pomiaru CM i „posadzka najwcześniej” za wcześnie o ok. 4 dni (domyślnie dzień 38 → 42), ryzyko nieudanego pomiaru albo ułożenia posadzki na mokrym jastrychu.
`stare`: `const hold = Math.max(3, Math.ceil(acc - (day - 0) - Math.ceil((tmax - 25) / 10)));`
`nowe`: `const hold = Math.max(3, 14 - (day - start - 7) - Math.ceil((tmax - 25) / 10), Math.ceil(acc - (day - 0) - Math.ceil((tmax - 25) / 10)));`

**J2. Opis przypisuje normie schemat osuszania (DROBNY).** PN-EN 1264-4 opisuje wygrzewanie funkcyjne; osuszanie (do gotowości pod posadzkę) wynika z wytycznych producentów. Poprawiony tekst w JSON.

**J3. tmax < temperatura projektowa (DROBNY).** Gdy maks. temperatura osuszania jest niższa od projektowej, program „utrzymuje” temperaturę niższą niż w wygrzewaniu funkcyjnym, a linia maks. leży pod projektową (test: tp 45, tmax 40).
`stare`: `tp = n('tproj'), tmax = Math.min(n('tmax'), R[2] === 'CA' ? 50 : 55)`
`nowe`: `tp = n('tproj'), tmax = Math.max(tp, Math.min(n('tmax'), R[2] === 'CA' ? 50 : 55))`

### Wątpliwe
- Jastrych szybkoschnący: start 7 dni i schnięcie 3 dni/cm – zależy od produktu; tekst każe sprawdzić kartę.
- Anhydryt: czas naturalny 7 dni/cm – źródła podają od ok. 1 tygodnia na cm do 7–14 dni łącznie; zgodne co do rzędu.
- Przyspieszenie o 40% przy osuszaniu (`acc = nat·0,6`) – szacunek bez źródła normowego; i tak decyduje pomiar CM.

---

## 5. Prosty kalkulator `jastrych` (moduł `JAS` w index.html)

Uwaga: funkcja `calc` z `tools_defs.js` nie jest używana (kalkulator ma `custom` i `wire`); liczy moduł `JAS`.

### Sprawdzone i poprawne
- Progi CM: CT 2,0% / z ogrzewaniem 1,8% (płytki 2,0%), CA 0,5% / 0,3% – zgodne z TKB, Baumit, KAN-therm.
- Czas bazowy CT 4 tyg. dla 4 cm i wzrost z potęgą 1,75 (6 cm: 8,1 tyg., 8 cm: 13,5 tyg.) – mieści się między wytycznymi Heidelberg (8 i 12 tyg.) a tabelą „realistyczną” (8 i 16 tyg.).
- Start wygrzewania 21 / 7 dni i schemat 3 + 4 dni – zgodne z PN-EN 1264-4.
- Minimalna grubość nad rurami CT 4,5 cm – zgodna z Purmo (45 mm dla CT F4).
- Ostrzeżenie o temperaturze poniżej +5 °C i wilgotności ≥ 90% (stan „nie schnie”) – rozsądne.

### Błędy
**S1. Grubość nad rurami traktowana jak cała grubość (ISTOTNY).** Przy ogrzewaniu podłogowym etykieta mówi „tak (grubość nad rurami)”, a czas schnięcia liczony jest tylko z grubości nad rurami. Schnie cała warstwa razem ze strefą rur (rura 16–17 mm), więc czas gotowości wychodzi za krótki o ok. 30–45% (CT 4,5 cm nad rurami z wygrzewaniem: 33 zamiast ok. 48 dni; anhydryt 3,5 cm: 17 zamiast 28 dni). Wynik po niebezpiecznej stronie (zbyt wczesny pomiar i posadzka).
`stare`: `const tRef = R.base * Math.pow(d / R.d0, 1.75);`
`nowe`: `const tRef = R.base * Math.pow((heat ? d + 1.7 : d) / R.d0, 1.75); // z ogrzewaniem d to grubość nad rurami, schnie też strefa rur (ok. 1,7 cm)`

### Wątpliwe
- Anhydryt: baza 3 tygodnie dla 4 cm – źródła rozbieżne (od 7–14 dni do ok. tygodnia na cm). Bez poprawki.
- Minimalna grubość CA 3,5 cm nad rurami – Purmo podaje 40 mm dla CA F4, część producentów jastrychów płynnych dopuszcza 35 mm. Ostrzeżenie odsyła do karty – zostawiam.
- Nieużywana funkcja `calc` w `tools_defs.js` (inny wzór, próg CA 0,5% „pod drewno”) – martwy kod; nie wpływa na wynik, ale może wprowadzić w błąd przy przyszłych zmianach.

---

## Źródła
1. [Rozp. 813/2013, zał. I, cz. 3 – definicje](https://legislation.gov.uk/eur/2013/813/annex/I/division/3/adopted) – UE / legislation.gov.uk – pl(Tj) = (Tj − 16)/(Tdesignh − 16), Ph(Tj), definicja Tbiv
2. [Rozp. 813/2013 – załączniki](https://legislation.gov.uk/eur/2013/813/annexes/adopted/data.pdf) – UE – def. 23 i 27, Tdesignh −10 °C, Tbiv
3. [Rozp. 811/2013, zał. VII](https://www.legislation.gov.uk/eur/2013/811/annex/VII/adopted/data.pdf) – UE – HHE 2 066 / 2 465 h, godziny przedziałów
4. [EPB Center – ErP and EPBD test data on heat pumps](https://epb.center/media/filer_public/a9/5b/a95b7820-aa69-49eb-91cb-45acbe8c1b48/ebp_center_coordinating_erp_and_epbd_test_data_on_heat_pumps_2021-02-06.pdf) – EPB Center – punkt biwalentny = 100% obciążenia
5. [Punkt biwalentny – co oznacza](https://globenergia.pl/punkt-biwalentny-co-oznacza-i-jak-wplywa-na-ogrzewanie-pompa-ciepla/) – GLOBEnergia – definicja punktu biwalentnego, PN-EN 14825
6. [Bosch Compress 5000 AW – karta](https://www.bosch-homecomfort.com/pl/media/country_pool/dokumenty/dlaprofesjonalistow/bosch_karta_katalogowa_compress_5000_aw_08.2021.pdf) – Bosch – COP W35/W55 (spadek ×0,69–0,72)
7. [Bosch Compress 7000i AW – karta](https://www.bosch-homecomfort.com/pl/media/country_pool/dokumenty/dlaprofesjonalistow/bosch_karta_katalogowa_compress_7000i_aw_awm_awms_06.2022.pdf) – Bosch – COP A−7/W35 2,79
8. [Stiebel Eltron HPA-O 8 CS Plus – dane](https://www.stiebel-eltron.pl/pl/produkty-rozwiazania/energia_odnawialna/pompy_ciepla/pompy_ciepla_powietrzewoda/hpa-o-3-8-plus/hpa-o-8-cs-plus/dane-techniczne.product.pdf) – Stiebel Eltron – COP A7/A2/A−7 przy W35
9. [Termet – ulotka pomp ciepła](https://www.termet.com.pl/upload/upload/pliki_produktow/ULOTKA_POMPY_CIEPLA_TERMET_05.06.2023.pdf) – Termet – COP A7/W35 i A7/W55 (×0,57–0,62), moc W55
10. [Ceny gazu grzewczego 2026](https://muratordom.pl/instalacje/ogrzewanie-gazowe/ile-zaplacisz-za-gaz-do-ogrzewania-ceny-gazu-grzewczego-w-marcu-2026-aa-BsrN-51sH-Np9V.html) – Murator – paliwo 197 zł/MWh netto, dystrybucja
11. [Rachunki za prąd w 2026 r.](https://www.gazetaprawna.pl/biznes/energetyka/artykuly/11241958,rachunki-za-prad-taryfy-energia-elektryczna-30-kwietnia.html) – Gazeta Prawna – energia 495,16 zł/MWh, dystrybucja +9,36%
12. [Narowski – temperatury obliczeniowe](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-988bcc40-51cf-49f0-8a8e-e878b45cdb39/c/Narowski.pdf) – BazTech – strefy I–V: −16…−24 °C, ciągłość w PN-EN 12831
13. [Wodne ogrzewanie podłogowe](https://inzynierbudownictwa.pl/?p=1154) – Inżynier Budownictwa – 29/33/35 °C, 45 mm nad rurą, q ≤ 100 W/m²
14. [Danfoss – Planning underfloor heating](https://manualmachine.com/danfoss/planningunderfloorheat/18787300-compendium) – Danfoss – 29 °C, 35 °C, łazienka θi + 9 K, izolacja 0,75/1,25/2,0
15. [Underfloor heating calculator](https://rechneronline.de/heating/underfloor-heating.php) – Rechneronline – q = 8,92·(θF − θi)^1,1
16. [Autarc – maximum output of underfloor heating](https://hilfe.autarc.energy/en/articles/10978154-determining-the-maximum-output-of-underfloor-heating-and-bathroom-radiator) – Autarc – 8,92·Δθ^1,1, 29/33 °C
17. [Purmo – poradnik techniczny](https://www.purmo.com/docs/Purmo-Poradnik-techniczny-systemy-ogrzewania-i-chlodzenia-plaszczyznowego-05-2016_PL.pdf) – Purmo – 45 mm CT, 40 mm CA, R ≤ 0,15, pętla 100 m
18. [Purmo X-net – dane techniczne](https://budujemydom.pl/files/fop/12152-Dane%20techniczne%20x-net%202016.pdf) – Purmo – tabele q/ΔθH dla R 0–0,15 (kontrola K_H)
19. [Uponor Tacker – technical information](https://brandportal.uponor.com/m/6a76ac997a6232e0/original/TI-Tacker-UFH-C-EN-1140931-v2.pdf) – Uponor – q/ΔθH dla 16×2, su 45 mm (K_H 6,43/5,54/4,79/4,16)
20. [Wpływ izolacji na wydajność podłogówki](https://yadda.icm.edu.pl/baztech/element/bwmeta1.element.baztech-5d9f0cfb-6994-42a3-a63d-9c9f619ad98e/c/werner-juszczuk_wplyw_4.2_2017.pdf) – BazTech – min. opory izolacji wg PN-EN 1264-4
21. [KAN-therm – protokół nagrzewania jastrychu](https://kan-therm.com/media/2024/10/KAN-therm-protokol-nagrzewania-jastrychu-PL-22-01-04.pdf) – KAN-therm – 21/7 dni, 3 dni 25 °C, 4 dni maks.
22. [Sabiana – protokół EN 1264](https://www.sabiana.it/sites/default/files/downloads-legacy/products/285/6058a0f68a13a_x-light-x-net-prot-riscaldamento-funz-en1264pdf.pdf) – Sabiana – 21/7 dni, 20–25 °C 3 dni, maks. 55 °C 4 dni
23. [KAN-therm – Protokoll Belegreifheizen](https://de.kan-therm.com/resfile/open/1070/Protokoll%20zum%20Belegreifheizen%20des%20Estrichs.pdf) – KAN-therm – osuszanie min. 14 dni do 70 mm, CM 1,8/2,0/0,3
24. [TKB – Hinweisblatt 05 CM](https://www.klebstoffe.com/wp-content/uploads/2024/11/Technisches-Hinweisblatt-05-KRL-Messmethode-Ermittlung-und-Beurteilung-der-Belegreife-hinsichtlich-der-Trockenheit-des-Untergrundes.pdf) – IVK/TKB – CM CT 2,0/1,8, CA 0,5/0,3
25. [Baumit – Belegreife Estrich](https://ch.baumit.com/files/de/technical_documents/Belegreife_Estrich_010410.pdf) – Baumit – CM CT 2,0/1,8, CA 0,5/0,3
26. [Barlinek – podłogi na ogrzewaniu podłogowym](https://www.barlinek.com.pl/wp-content/uploads/2025/02/podlogi-barlinka-na-systemach-ogrzewania-i-chlodzenia-podlogowego.pdf) – Barlinek – CT 1,8% CM, CA 0,3%, R ≤ 0,15, 29 °C
27. [Heidelberg Materials – Trocknungsmerkblatt](https://heidelbergmaterials.de/sites/default/files/2024-10/Trocknungsmerkblatt%20Flie%C3%9Festrich.pdf) – Heidelberg Materials – 4 tyg./4 cm + 2 tyg./cm, osuszanie min. 14 dni
28. [Estrich Trockenzeit – tabela](https://www.clean-invoice.com/wissen/allgemein/estrich-trockenzeit-tabelle) – clean-invoice – 6 cm ok. 8 tyg., 8 cm ok. 16 tyg.
29. [Viega – dodatek do jastrychu](https://web-catalog.viega.com/pl_PL/html/Montaz/Ogrzewanie-powierzchniowe/Fonterra/d0dd38ed4108bd3fac114094018d9117_3_pl_PL/pdf/ga_dodatek-do-jastrychu_3_pl_pl.pdf) – Viega – pomiar CM przed posadzką
30. [bau.de – CM-Messung Grenzwerte](https://bau.de/forum/ausbauarbeiten/11127.php) – bau.de – CM CT/CA (źródło pomocnicze)
31. [Net-billing – jak działa](https://globenergia.pl/net-billing-jak-dziala-system-rozliczen-prosumentow/) – GLOBEnergia – RCE/RCEm, 1,23, zwrot 20/30%
32. [PGE – faktura net-billing](https://www.gkpge.pl/content/download/93da15fab2fd876af4c9095652e70998/file/ulotka_a3_faktura_net_billing_12_03_2025.pdf) – PGE – depozyt na zakup energii, zwrot 20/30%
33. [Ministerstwo o net-billingu](https://www.gramwzielone.pl/?p=20378973) – Gramwzielone – depozyt tylko na energię czynną, nie na dystrybucję; brak planów zmian
34. [Spadła wartość energii od prosumentów](https://www.gramwzielone.pl/energia-sloneczna/20306661/spadla-wartosc-energii-od-prosumentow-objetych-net-billingiem) – Gramwzielone – RCEm 2024–2025
35. [RCEm za czerwiec](https://globenergia.pl/rcem-za-czerwiec-wraca-do-poziomow-z-lutego/) – GLOBEnergia – RCEm 255–437 zł/MWh
36. [Wydajność fotowoltaiki w ciągu roku](https://enerad.pl/wydajnosc-fotowoltaiki-w-ciagu-roku-jak-wyglada/) – Enerad – ok. 1 000 kWh/kWp, rozkład miesięczny
37. [Różnice w wydajności PV w Polsce](https://www.chip.pl/2024/11/polska-najlepsze-miejsce-panele-sloneczne) – Chip – różnica północ–południe 10–15%
