# Kalkulator „Ile bloczków na ściany” – weryfikacja danych (31.10.2026)

Raporty pięciu niezależnych badań (karty techniczne, DoP, cenniki producentów, normy, akty prawne, poradniki). Poprawki naniesione w `mur_v2.js` (patrz KONTROLA.md).


**Razem: 295 unikalnych adresów źródeł z 124 domen.** Według obszarów: Beton komórkowy 63, Silikaty 48, Ceramika 65, Bloczki betonowe, keramzytobeton i zaprawy 58, Otwory, nadproża, filarki 64.


---

## Beton komórkowy

# Raport: weryfikacja danych kalkulatora „Ile bloczków na ściany”, beton komórkowy (stan na 31.10.2026)

Najważniejsze wnioski:
- **Ytong 24 cm i 11,5 cm** zgadzają się z danymi producenta w wymiarach, szt./m², szt./paletę i kleju. Do poprawy jest tylko masa: 22,5 kg zamiast 22 kg oraz 10,8 kg zamiast 10,5 kg. Xella sprzedaje dziś te bloczki pod nazwą **Ytong Enduro**.
- **Solbet 599×240×249** wymaga największej zmiany. Ten format Solbet oferuje w linii pod normę niemiecką DIN, czyli dla rynków DE/SE. Polska oferta Solbetu ma format **590×240×240 (Optimal / Optimal Plus 600)**.
- **H+H (oba wpisy)** są zgodne. Warto wpisać na stałe szt./m² podawane przez producenta (7,06 i 6,4) i uzupełnić brakujące masy.

Nie zmieniałem żadnych plików. Strony xella.pl i hplush.com oraz pliki PDF Xelli są w tej sesji zablokowane lub ładują się puste, a sig.pl nie odpowiada. Dane Xelli biorę więc z poradnika Xella (2015), z artykułu kb.pl cytującego normy zużycia Xelli i z kart produktów w kilku sklepach.

## A) Tabela wyników

| Produkt | Pole | Kalkulator | Wg źródeł | Ocena | Propozycja |
|---|---|---|---|---|---|
| 1. Ytong PP4/0,6 24 | nazwa / oferta | Ytong PP4/0,6 24 cm | Obecna nazwa: „Ytong **Enduro** PP4/0,6 S+GT 24 cm” [15,16,23,55,56] | DO POPRAWY | „Ytong Enduro PP4/0,6 S+GT 24” |
| | L×T×H | 599×240×199 | 599×240×199 [14,15,21,55]; tolerancja L ±1,5, H ±1,0 [30,31] | ZGODNE | – |
| | jh / jv | 2 / 0 | Profil S+GT (pióro-wpust z uchwytem), więc jv=0. Spoina wg Xelli zwykle ok. 1 mm (zakres 0,5–3) [10] | ZGODNE (jh: NIEPEWNE) | jv 0; jh 1 dla Ytong do rozważenia |
| | szt./m² | 8,33 | 8,33 [9,14,21,23]; 8,5 [19] | ZGODNE | 8,33 |
| | szt./paleta | 48 | 48 [9,14,15,19,26,55] | ZGODNE | 48 |
| | masa | 22 kg | 22,5 [14]; 23 [15]; 17,2 to stan suchy przy 600 kg/m³ [17] | DO POPRAWY (drobna) | 22,5 kg (stan dostawy) |
| | klej | 3,2 kg/m² | 3,2 [10,14]; Xella: 13,3 kg/m³ × 0,24 m = 3,19 [11] | ZGODNE | 3,2 |
| 2. H+H Gold 2,5-500 PWU 24 | oferta | jest | Cennik H+H 16.02.2026: Gold 590×240×240 PW z uchwytem [1] | ZGODNE | – |
| | L×T×H | 590×240×240 | 590×240×240 [1,2,5,35,40] | ZGODNE | – |
| | szt./m² | z wymiarów, przy jh 2 wychodzi 7,00 | 7,06 [1,2,40]; „ok. 7” [42] | NIEPEWNE (różnica 0,9%) | wpisać na stałe 7,06 |
| | szt./paleta | 48 | 48 [1,35,38,40,42]. Cennik ma też drugą tabelę z 36 szt. (zakład nieprzypisany) [1] | ZGODNE | 48 |
| | masa | brak | 18,7 kg [2,5,35,40]; 21 kg [38] | DO POPRAWY (brak) | 18,7 kg |
| | klej | 2,4 kg/m² | 2,4 [3,4]; cennik: 10 kg/m³ PW × 0,24 m = 2,4 [1] | ZGODNE | 2,4 |
| 3. Solbet PP4-0,6 24 P+W | oferta | 599×240×249 | Format 599×249 występuje w linii DIN (PP4-0,6; 115–365 mm; profil 2N+F, G) [6,7,8]. Na rynku PL: **Optimal / Optimal Plus 600, 590×240×240 PWU** [43–47,50] | DO POPRAWY | „Solbet Optimal Plus 600 24 P+W+U”, 590×240×240 |
| | szt./m² | z wymiarów (6,65) | DIN: 6,7 [6]. PL Optimal: 7,06 [44,45]; „ok. 7” [46,51] | DO POPRAWY | 7,06 dla 590×240×240 |
| | szt./paleta | brak | DIN 240: 48 [6]. Optimal (Plus) 600: 48 [43,45,46] | DO POPRAWY (brak) | 48 |
| | masa | brak | Optimal 600: 24,4 kg [44,45]; 25 kg [43]. DIN 599×249: ok. 21,5 kg w stanie suchym (obliczenie [8]) | DO POPRAWY (brak) | 24,4 kg |
| | klej | 3,0 kg/m² | Solbet: 24 cm P+W = 3,0; bez profilu 4,3 [32]. Przy spoinie 3 mm: 4,5 [33] | ZGODNE | 3,0 |
| 4. Ytong PP4/0,6 11,5 | nazwa / profil | – | „Ytong Enduro PP4/0,6 **S** 11,5” [22,24,58]; eadamex podaje „S+GT” [25]; baubay „Plain” [9] | NIEPEWNE (profil) | nazwa „Ytong Enduro PP4/0,6 S 11,5” |
| | L×T×H | 599×115×199 | 599×115×199 [9,22,24,25,27,28] | ZGODNE | – |
| | szt./m² | 8,33 | 8,33 [9,28,57]; 8,3 [24] | ZGODNE | 8,33 |
| | szt./paleta | 104 | 104 [9,22,25,26,27,28,29] | ZGODNE | 104 |
| | masa | 10,5 kg | 10,77 [24]; 10,8 [25]; 11 [22] | DO POPRAWY (drobna) | 10,8 kg |
| | klej | 1,5 kg/m² | 1,5 [10]; 13,3 kg/m³ × 0,115 m = 1,53 [11]. Bloczek bez profilu: 2,0 [9] (17,7 × 0,115 = 2,04 [11]) | ZGODNE (dla profilu S) | 1,5 |
| 5. H+H Gold+ 4,0-500 11,5 | oferta | jest | Cennik 2026: Gold+ (Gorzkowice), klasa 4,0-500, 625×115×250 P+W [1]; sklepy [36,37,39] | ZGODNE | – |
| | L×T×H | 625×115×250 | 625×115×250 [1,36,37,39] | ZGODNE | – |
| | szt./m² | z wymiarów, przy jh 2 wychodzi 6,35 | 6,4 [1,37,39] | NIEPEWNE (różnica 0,8%) | wpisać na stałe 6,4 |
| | szt./paleta | 78 | 78 [1,36,37,39] (promotor podaje 11,25 m² na paletę, co odpowiada 72 szt. [39]) | ZGODNE | 78 |
| | masa | brak | ok. 9,0 kg [37]; 9 kg [36]; 18,8 kg dla grubości 240 przeskalowane do 115 daje 9,0 [5] | DO POPRAWY (brak) | 9,0 kg |
| | klej | 1,2 kg/m² | 1,2 [3,4]; 10 kg/m³ × 0,115 m = 1,15 [1] | ZGODNE | 1,2 |

**Zużycie kleju cienkowarstwowego na m³ muru wg producentów:**
- **H+H:** 10 kg/m³ dla bloczków PW, 14 kg/m³ dla gładkich, 6,5 kg/m³ dla Panelu Tempo [1].
- **Xella (Ytong):** 13,3 kg/m³ dla pióro-wpust, 17,7 kg/m³ dla gładkich [11].
- **Solbet:** z tabeli kg/m² wychodzi ok. 12,5 kg/m³ dla P+W (3,0 / 0,24) i ok. 18 kg/m³ dla bloczków bez profilu (4,3 / 0,24). To moje obliczenie [32].

**Skąd się biorą szt./m²:**
- **Ytong i Solbet (599 mm):** 599 to wymiar modularny 600 pomniejszony o ok. 1 mm spoiny. 8,33 = 1/(0,600×0,200), a 6,67 = 1/(0,600×0,250). Z gołych wymiarów wyszłoby 8,39 i 6,70.
- **H+H:** liczy z rzeczywistych wymiarów bez spoin. 7,06 = 1/(0,590×0,240), a 6,4 = 1/(0,625×0,250).
- **Kalkulator** z jh=2 i jv=0 daje 8,31 / 6,65 / 7,00 / 6,35. Różnica wobec producenta to maks. ok. 1%.
- **Zalecenie:** wpisać szt./m² producenta na stałe (pole m2), żeby wyniki były zgodne z kartami.

## B) Źródła

1. [Cennik H+H ABK 16.02.2026](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/cennik-hhpl_abk_20260216.pdf) — H+H Polska — Gold 590×240×240: 7,06 szt./m², 48 szt./pal., 1,631 m³; Gold+ 625×115×250: 6,4 szt./m², 78 szt./pal., 12,19 m²; klej 10 kg/m³ (PW) i 14 kg/m³ (gładki).
2. [Karta techniczna H+H Gold 2,5-500](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/produkty---beton-komorkowy/karty-techniczne/karta-techniczna--hh-gold-bloczki-25500.pdf) — H+H — PWU 590×240×240: 7,06 szt./m², 18,7 kg, gęstość 500±50.
3. [Karta techniczna H+H cienkowarstwowa biała zaprawa klejąca](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/03-karty-techniczne-2/zaprawy/karta-techniczna---hh-cienkowarstwowa-biaa-zaprawa-klejaca.pdf) — H+H — 115 mm: 1,2 kg/m²; 240 mm: 2,4 kg/m²; 300 mm: 3,0 kg/m².
4. [Karta techniczna H+H zaprawa z ziarnem podporowym (06.2025)](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/system-tempo-pro-2025/karta-techniczna---hh-zaprawa-z-ziarnem-podporowym-20250630.pdf) — H+H — te same normy: 115 mm 1,2; 240 mm 2,4 kg/m².
5. [Zeszyt techniczny H+H nr 1 (aktualizacja 2023)](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/04-zeszyty-techniczne/zeszyty-techniczne-hh/zeszyt-techniczny-hh-nr-1_aktualizacja-2023.pdf) — H+H — spoina 0,5–3 mm, „z reguły 2 mm”; Gold 2,5-500 PWU 18,7 kg; Gold+ 4,0-500 240 mm 18,8 kg.
6. [Cellular concrete SOLBET PP4-060 (DIN V 4108-4)](https://www.byggbay.se/cellular-concrete-pp4-060-according-to-din-v-4108-4.html) — Byggbay — 599×240×249, profil 2N+F GT, 48 szt./pal.; 115 mm: 104 szt./pal.; 6,7 szt./m².
7. [SOLBET blocks](https://solbet.pl/?p=16512) — Solbet — PP4-0,6: 599×249, grubości 115/175/240/300/365; 240 mm z profilem 2N+F, G.
8. [Solbet – produkty (baubay)](https://www.baubay.de/solbet-en.html) — Baubay — PP4-060 599×249, 600 kg/m³, 5,2 N/mm².
9. [Cellular concrete Ytong PP4/0,60](https://www.baubay.de/cellular-concrete-ytong-pp4-0-60.html?sl=en) — Baubay — 115 mm: 104 szt./pal.; 240 mm: 48 szt./pal.; 8,33 szt./m²; kolumna kg/m²: 115 mm = 2,0 (bloczek bez profilu), 240 mm = 3,2.
10. [Poradnik murowanie Ytong 11.2015](https://budujemydom.pl/files/ewi/12688-Poradnik-murowanie-Ytong-11-2015.pdf) — Xella Polska — zaprawa: 115 mm 1,5; 240 mm 3,2; 365 mm 4,9 kg/m²; 8,33 szt./m²; spoina ok. 1 mm.
11. [Klej do Ytonga – rodzaje, ceny](https://kb.pl/materialy-budowlane/kleje/klej-do-ytonga-rodzaje-ceny-opinie-porady-praktyczne/) — KB.pl (2023) — Ytong-Silka: 13,3 kg/m³ (pióro-wpust) i 17,7 kg/m³ (gładkie).
12. [Jaka jest cena Ytong?](https://kb.pl/materialy-budowlane/cegly-bloczki-pustaki/jaka-jest-cena-ytong-sprawdzamy-ile-zaplacicie-za-bloczki-ytong/) — KB.pl — PP4/0,6 S+GT: 32–48 szt./pal.; „Ytong 24”: 48 szt./pal.
13. [Bloczki Ytong – cena i charakterystyka](https://www.oferteo.pl/artykuly/ytong-cena-i-charakterystyka-bloczkow-z-betonu-komorkowego) — Oferteo (2021) — 59,9×19,9 cm, ok. 8,3 szt./m²; PP4/0,6 24 cm 11,49 zł/szt.
14. [Bloczek Ytong PP4/0,6 S+GT 24cm](https://bat.pl/Ytong-PP4-06-S-GT-24-bloczek/10015954-xx) — BAT — 59,9×24×19,9; 48 szt./pal.; 8,33 szt./m²; **22,5 kg**; **klej 3,2 kg/m²**; 4 N/mm².
15. [Ytong Enduro PP4/0,6 S+GT gr. 24 cm (pełna paleta)](https://gazobeton.pl/ytong-pp4-0,6-S-GT-gr-24-cm-pelna-paleta) — Gazobeton.pl — 599×199×240; 48 szt./pal.; 23 kg.
16. [Bloczek YTONG 24 cm Enduro PP4/0,6 S+GT](https://sklep-lubar.pl/beton-komorkowy-bloczek-ytong-24-cm-pp4/0-6-s-gt,c71,p7,o1001,s1001,pl.html) — Lubar — potwierdza nazwę handlową „Enduro”.
17. [Bloczek YTONG 24 cm PP4/0.6 S+GT](https://www.artbud.pl/pl/p/Bloczek-YTONG-grubosc-24-cm-klasy-PP40.6-S-GT-beton-komorkowy-na-sciany-konstrukcyjne-i-nosne/37991) — Artbud — masa 17,20 kg (stan suchy), 4 MPa.
18. [Bloczek YTONG 24x20x60 PP4/0,6 S+GT](https://kim24.pl/bloczek-komorkowy-ytong-24x20x60) — Kim24 — produkt w ofercie, 14,99 zł.
19. [YTONG 24x60x20 PP4/0.6S+GT 48 szt./paleta](https://atexbud.pl/produkt/ytong-24-x60x20-pp4-06sgt-bloczek-48szt-paleta-zuzycie-85szt-m2) — Atexbud — 48 szt./pal.; 8,5 szt./m²; 600 kg/m³; 4 N/mm².
20. [Ytong 24 PP4/0,6 S+GT (Allegro)](https://allegro.pl/oferta/ytong-24-ytong-pp4-0-6-s-gt-bloczek-pustak-12542950665) — Allegro — 599×240×199; 8,33 szt./m²; gęstość 575±25 kg/m³.
21. [Beton komórkowy Ytong 2026](https://dobry-dom.com/beton-komorkowy-ytong-wlasciwosci-ceny-zastosowanie-2026/) — Dobry-Dom — linia Solid/Enduro PP4/600; 599×199; ok. 8,33 szt./m²; 24 cm 14–16,50 zł.
22. [Ytong Enduro PP4/0,6 S gr. 11,5 cm (pełna paleta)](https://gazobeton.pl/ytong-pp4-0,6-S-gr-11,5-cm-pelna-paleta) — Gazobeton.pl — 599×199×115; 104 szt./pal.; 11 kg.
23. [SIG: YTONG ENDURO PP4/0,6 S+GT 24 cm 599/240/199 (48 szt./pal.)](https://www.sig.pl/bloczek-beton-komorkowy-ytong-enduro-pp406-s-gt-24-cm-599240199-mm-48-sztpaleta,p885384) — SIG — tytuł z wyników wyszukiwania (strona się nie pobrała): 599/240/199, 48 szt.
24. [Beton komórkowy Ytong PP4/0,6 S 11,5 cm](https://www.bricoman.pl/produkty/beton-komorkowy-ytong-pp4-0-6-s-bloczek-11-5-cm-115x599x199-mm-600-kg-m3-8-3-szt-m2-106484.html) — Bricoman — 115×599×199; 8,3 szt./m²; masa 10,77 kg.
25. [Bloczek Ytong PP4/0,6 115x199x599 104 szt./pal.](https://eadamex.pl/bloczki-komorkowe/4938-bloczek-ytong-pp4-06-115x199x599-sgt-104szt-pal-4065181048759.html) — Eadamex — 104 szt./pal.; 10,8 kg.
26. [SIG: YTONG PP4/0,6 S 11,5 cm 599/115/199 (104 szt./pal.)](https://www.sig.pl/bloczek-beton-komorkowy-ytong-pp406-s-115-cm-599115199-mm-104-sztpaleta,p839722) — SIG — tytuł z wyników wyszukiwania: 104 szt./pal.
27. [Bloczek Ytong PP4/0,6 gr. 11,5 cm](https://www.abud.pl/product-pol-1056-Bloczek-betonu-komorkowego-Ytong-PP4-0-6-gr-11-5cm.html) — Abud — 104 szt.; 12,397 m² i 1,4256 m³ na paletę.
28. [Ytong bloczek PP4/0.6 11.5 cm](https://grupastorex.eu/beton-komorkowy/305-ytong-bloczek-pp406-115-cm.html) — Grupa Storex — 599×115×199; ok. 8,33 szt./m²; 104 szt./pal.; 4,0 N/mm².
29. [YTONG PP4/06 ENDURO S 11,5x20x60](https://handlobud.sklep.pl/beton-komorkowy/1948-ytong-pp406-enduro-s-115x20x60-cm.html) — Handlobud — 104 szt./pal.; 7,29 zł brutto.
30. [DoP 49000902 Ytong PP 4-0,55 599×150×249](https://app10.cobuilder.com/api/shared/products/46311/documents/2802210?culture=en) — Xella Deutschland — L 599±1,5; H 249±1,0; TLMB (produkt niemiecki, użyty dla tolerancji).
31. [DoP 49000902 (wersja NO/EN)](https://app10.cobuilder.com/api/shared/products/45503/documents/2781533?culture=en) — Xella — te same tolerancje, gęstość 500–550.
32. [Thin layer mortar](https://solbet.pl/?p=17476) — Solbet — zużycie na m² muru: 24 cm P+W **3,0**; bez profilu 4,3; 11,5 cm bez profilu 2,1; spoina 0,5–3 mm.
33. [Klej SOLBET 0.6 biały M10](https://realbud.com/en_US/p/Adhesive-for-Suporex-cellular-concrete-and-SOLBET-0.6-silicates-white-M10/8117) — Realbud — ok. 4,5 kg/m² dla ściany 24 cm przy spoinie do 3 mm; worek 25 kg, 48 worków/pal.
34. [Klej SOLBET 0.6 (PL)](https://realbud.com/Klej-do-sipor-i-silik-SOLBET-6-BIALA-10) — Realbud — worek 25 kg, 48 szt./pal.
35. [Beton komórkowy H+H Gold PWU 2,5-500 240x240x590](https://eadamex.pl/bloczki-komorkowe/9561-bloczek-komorkowy-hh-gold-25-500-240x240x590mm-pwu-48szt-pal.html) — Eadamex — 48 szt./pal.; 18,7 kg.
36. [H+H Gold+ 4,0-500 115x250x625 78 szt./pal.](https://eadamex.pl/bloczki-komorkowe/16536-bloczek-komorkowy-hh-gold-40-500-115x250x625mm-pw-78szt-pal.html) — Eadamex — 78 szt./pal.; 9 kg.
37. [Bloczek H+H Gold+ 115×250×625 kl.500/4MPa PW](https://metaltech.sklep.pl/beton-komorkowy-h-h-gold-115-250-625mm-kl-500-4mpa,id31290.html) — Metal Tech — 6,4 szt./m²; 78 szt./pal.; ok. 9,0 kg; TLMB ±1 mm.
38. [H+H Gold gr. 24 cm 500 kg/m³ (pełna paleta)](https://gazobeton.pl/H-H-Gold-gr-24-cm-500-kg-m3-pelna-paleta) — Gazobeton.pl — 590×240×240; 48 szt./pal.; 21 kg.
39. [Bloczek H+H Gold+ 625/115/250 PW](https://www.promotor.store/bloczek-betonowy-hh-goldplus-625-115-250-plaeta-76szt/) — Promotor — 6,4 szt./m²; 78 szt.; 55,66 szt./m³; gęstość 475±25.
40. [Bloczek H+H Gold 240×240×590 kl.500/2,5MPa PWU](https://metaltech.sklep.pl/bloczek-komorkowy-h-h-gold-240-240-590mm-kl-500-2-5mpa,id31854.html) — Metal Tech — 7,06 szt./m²; 48 szt./pal.; ok. 18,7 kg.
41. [Gold+ 240x250x625 PWU 4MPa kl. 500](https://sklep.sewera.pl/beton-komorkowy-gold-240x250x625mm-pwu-4mpa-klasa-500-hh-p11832) — Sewera — Gold+ 4 MPa / 500 w ofercie, 16,69 zł netto.
42. [Bloczek H+H Gold 2,5/500 PW 24cm 48 szt.](https://sklep.grupainwestor.com/pl/products/bloczek-h-h-gold-2-5-500-pw-24cm-240x240x590-48szt-12707.html) — Grupa Inwestor — ok. 7 szt./m²; 48 szt.; zakład Żelisławice.
43. [Solbet Optimal PLUS gr. 24 cm 600 (pełna paleta)](https://gazobeton.pl/solbet-optimal-plus-gr-24-cm-600-kg-m3-pelna-paleta) — Gazobeton.pl — 590×240×240 PWU; 48 szt./pal.; 25 kg.
44. [Solbet Optimal 600, bloczek 24 cm, 7,06 szt./m²](https://www.bricoman.pl/beton-komorkowy-solbet-optimal-600-bloczek-24-cm-240x590x240-mm-600-kg-m3-7-06-szt-m2-20697985.html) — Bricoman — 7,06 szt./m²; 24,4 kg.
45. [Bloczki Optimal 600 240x240x590 SOLBET](https://mrowka.com.pl/produkt/bloczki-optimal-600-240x240x590-mm-solbet-2255402328261.html) — Mrówka — 48 szt./pal.; 6,8 m²/pal.; 24,4 kg.
46. [Solbet 590x240x240 P+W odm. 600 Optimal Plus](https://realbud.com/pl/p/Beton-komorkowy-24-cm-SOLBET-590x240x240-P-W-odm.-600%2C-Optimal-Plus/9518) — Realbud — 7 szt./m²; 48 szt./pal.
47. [Solbet Optimal Plus](https://icmarket.pl/solbet-optimal-plus-cellular-concrete-blocks-en.html) — ICMarket — 240/590, PWU, klasy 400/500/600, wariant „Optimal Plus 4”.
48. [Koszt 1 m² muru – beton komórkowy](https://muratordom.pl/galeria/koszt-1-m2-muru-beton-komorkowy/gg-ZoVR-w2om-3EbZ/gp-KFLH-cDgL-VQ8k) — Murator — Solbet ok. 7; H+H 6,4; Ytong 8,33; Termalica 6,67 szt./m².
49. [Pustaki Solbet – opinie, ceny](https://kb.pl/materialy-budowlane/cegly-bloczki-pustaki/pustaki-solbet-opinie-ceny-zalety-wady-porady-przy-zastosowaniu-tego-betonu-komorkowego-na-budowie/) — KB.pl — Solbet Optimal w formacie 24×59 (ceny z 2018).
50. [Domy21 – karta systemu](https://domy21.pl/wp-content/uploads/2024/02/D21-1C.pdf) — Domy21 (2024) — Solbet Optimal Plus 24 cm, klasa 500, P+W z uchwytami.
51. [Ytong PP5/0,7 GT 24 cm](https://maldrew.com.pl/en/product/beton-komorkowy-ytong-pp5-0-7-gt-variety-700-gr-24cm) — Maldrew — 599×240×199; 8,33 szt./m²; 48 szt./pal.; 20 kg; tolerancje ±1,5 / ±1.
52. [Ytong 11,5 cm PP4/0,6](https://stanlux.istore.pl/en_US/p/YTONG-11%2C5-cm%2C-PP40%2C6%2C-lattbetong%2C-celular-concrete%2C-aerated-concrete%2C-suporex%2C-siporex%2C-airbrick%2C-brick%2C-hollow-brick%2C-hollow-tile%2C-Xella-1/21969713) — Stanlux — 8,33 szt./m².
53. [Ytong PP4/0.6 S+GT 24 cm, paleta 48 szt.](https://stanlux.istore.pl/en_US/p/YTONG-PP40.6-S-GT-24.0-CM-aerated-concrete%2C-block%2C-suporex%2C-siporex-by-Xella%2C-PALLET-48-pieces/21979702) — Stanlux — 48 szt./pal.
54. [Porenbeton-Planblock 24×19,9×59,9 (toom)](https://toom.de/p/porenbeton-planblock-24-x-199-x-599-cm/10450685) — toom / Xella DE — ten sam format 599×240×199; klasa 0,4: 15,89 kg.
55. [Karta techniczna Ytong Enduro PP4 (2.06.2025)](https://storefrontapi.commerce.xella.com/medias/xella-Ytong-Enduro-PP4-2.06.2025-KARTY-TECHNICZNE.pdf) — Xella Polska — z wyników wyszukiwania (PDF zablokowany): potwierdza nazwę „Ytong Enduro PP4/0,6” i kartę z 06.2025.
56. [DoP Milicz – Ytong PP4/0,6 S+GT 24 cm](https://storefrontapi.commerce.xella.com/occ/v2/pl/catalogs/plContentCatalog/versions/Online/xellamedia/DoP_Milicz_-_Ytong_PP4-0,6_S+GT_24_cm.pdf) — Xella Polska — z wyników wyszukiwania: DoP istnieje, zakład Milicz (treść niepobrana).
57. [Ytong PP4/0,6 (strona produktu)](https://www.xella.pl/pl_PL/ytong-enduro-pp4-06) — Xella — adres „ytong-enduro-pp4-06” (strona ładuje się pusta).
58. [YTONG PP4/0,6 S 11,5 cm](https://www.xella.pl/pl_PL/product/ytong-pp4-0,6-s-11,5-cm/20001157) — Xella — tytuł produktu „PP4/0,6 **S** 11,5 cm” (strona ładuje się pusta).
59. [Beton komórkowy – FAQ](https://www.leroymerlin.pl/porady/budowa/materialy-budowlane/beton-komorkowy-poznaj-odpowiedzi-na-najczesciej-zadawane-pytania.html) — Leroy Merlin — bloczki ważą 18–35 kg; ok. 7 szt./m² (dla formatu 24–25 cm).
60. [Katalog Termalica](https://budujemydom.pl/files/twv/8648-katalog.pdf) — Bruk-Bet — format 599×249 daje 6,7 szt./m²; spoina 1–3 mm.
61. [Ściany z betonu komórkowego](https://inzynierbudownictwa.pl/sciany-z-betonu-komorkowego/) — Inżynier Budownictwa — spoina cienka 2–3 mm; dom ok. 140 m² zużywa ok. 1 t kleju wobec ok. 10 t zaprawy tradycyjnej.
62. [Zaprawy do betonu komórkowego](https://globenergia.pl/zaprawy-do-betonu-komorkowego/) — Globenergia — spoina 1–3 mm, zalecane 2–3 mm.
63. [Jaki klej do pustaków Solbet](https://aikfarby.pl/jaki-klej-do-pustakow-solbet) — aikfarby (blog, słaba wiarygodność) — 24 cm P+W 4–5 kg/m²; uznaję za odstające od danych producenta.

## C) Podsumowanie źródeł

- **Wszystkich źródeł:** 63 unikalne adresy URL.
- **Pobranych z treścią:** 56. Pozostałe 7 (nr 23, 26, 55–58 oraz zablokowane PDF-y Xelli) potwierdzam tylko tytułem z wyników wyszukiwania.
- **Domeny:** 39 unikalnych, w tym:
  - **Producenci:** edge.sitecorecloud.io (H+H), solbet.pl, xella.pl, storefrontapi.commerce.xella.com, app10.cobuilder.com (DoP Xella).
  - **Składy i sklepy:** bat.pl, gazobeton.pl, sig.pl, bricoman.pl, eadamex.pl, metaltech.sklep.pl, mrowka.com.pl, realbud.com, sklep.sewera.pl i inne.
  - **Poradniki:** kb.pl, muratordom.pl, budujemydom.pl, inzynierbudownictwa.pl, leroymerlin.pl.

Liczby, które potwierdza tylko jedno źródło:
- **Masa Solbet DIN 599×249:** wyłącznie obliczenie z wymiarów i gęstości.
- **Liczba 36 szt./pal. dla H+H Gold 240:** tylko druga tabela cennika H+H, bez przypisanego zakładu.
- **Profil Ytong 11,5:** sklepy podają raz „S”, raz „S+GT”. Kartę producenta trzeba jeszcze sprawdzić ręcznie na xella.pl.

---

## Silikaty

Sprawdziłem wszystkie 5 pozycji. Dwie wymagają poprawy: **masy Silki E24S i E18S są za niskie o ok. 5 kg i 4,5 kg**, a litera „S” nie oznacza wersji z uchwytami. Silka E12, Silka E8 i H+H N18 15-1600 są zgodne z danymi producentów. Żadnych plików nie zmieniałem.

**Co oznacza „S”.** Silka E24S i E18S to bloki **pełne**, o klasie gęstości **1800 kg/m³** i klasie wytrzymałości **20 lub 25**, przeznaczone na ściany piwniczne i fundamentowe (folder Xella „Silka E-S”). Wersje bez „S” (E24, E18, E12, E8) to bloki drążone z uchwytami montażowymi i pióro-wpustem, o górnej granicy gęstości **1500 kg/m³**. Masy w kalkulatorze dla wersji „S” to w rzeczywistości masy zwykłych E24 i E18: 23,7 kg ≈ (1090 kg − paleta) / 45 oraz 17,1 kg ≈ (1050 kg − paleta) / 60.

**Kontekst.** Holcim zakończył przejęcie Xelli w 2026 r. W składach pojawia się nazwa „HOLCIM SILKA”. Silka E24 kl. 15 jest dziś sprzedawana jako „E24 Light”.

## A) Tabela wyników

| Produkt | Pole | Kalkulator | Wartość wg źródeł | Ocena | Propozycja |
|---|---|---|---|---|---|
| **Silka E24S** | L×T×H | 333×240×199 | 333×240×199 [7,24,25,48] | ZGODNE | bez zmian |
| | jh / jv | 2 / 0 | cienka spoina, pióro-wpust, spoina pionowa niewypełniana [5,7] | ZGODNE | bez zmian |
| | szt./m² | 15 | 15 [5,6,7,26] | ZGODNE | 15 |
| | szt./pal. | 45 | 45 [5,6,7,24,25] | ZGODNE | 45 |
| | masa | 23,7 kg | 28 kg [24]; paleta 1,31 t, czyli ok. 28,5 kg/szt. [25]; mur 454 kg/m², czyli ok. 30 kg/szt. [7]; gęstość 1800 [7,24,25]. Folder [7] podaje też paletę 1090 kg, co nie zgadza się z jego własnym ciężarem muru | **DO POPRAWY** | **ok. 28,5 kg** |
| | zaprawa | 3,6 kg/m² | 3,6 [5,6,7] | ZGODNE | 3,6 |
| | oferta | – | kl. 20 standard, kl. 25 na zamówienie [5,6]; oba w sklepie w 2026 [23]; SIG „HOLCIM SILKA E24S kl. 20” [47] | ZGODNE | dodać klasę 20/25 |
| **Silka E18S** | L×T×H | 333×180×199 | 333×180×199 [14,28,44] | ZGODNE | bez zmian |
| | szt./m² | 15 | 15 [7,14]; BIM 15,015 [10] | ZGODNE | 15 |
| | szt./pal. | 60 | 60 [7,10,14,28] | ZGODNE | 60 |
| | masa | 17,1 kg | BIM: paleta 1306 kg, czyli ok. 21,4 kg [10]; gęstość 1,86 t/m³, czyli ok. 22 kg [28]; mur 340 kg/m², czyli ok. 22,5 kg [7]; gęstość 1750, czyli ok. 21 kg [14] | **DO POPRAWY** | **ok. 21,5 kg** |
| | zaprawa | 2,7 kg/m² | 2,7 [5,6,7]; BIM 2,394 [10] | ZGODNE | 2,7 |
| | oferta | – | w ofercie tylko kl. 20 [10,28,44]; brak w cennikach z 2022 [5,6] | NIEPEWNE | sprawdzić aktualny cennik |
| **H+H N18 15-1600** | L×T×H | 250×180×220 | 250×180×220 [1,2,3,37] | ZGODNE | bez zmian |
| | szt./m² | 18 / 17,4 | 18 cienka spoina / 17,4 tradycyjna [1,2,3,39] | ZGODNE (uwaga niżej) | bez zmian |
| | szt./pal. | 80 | 80 [1,2,3,37,38] | ZGODNE | 80 |
| | masa | 14,5 kg | 14,5 (karta 2024.06) [2]; 14,2 (karta 2022.05) [1]; 14,3 [37,38]; paleta 1184 kg, czyli ok. 14,5 kg [3] | ZGODNE | 14,5 |
| | zaprawa | 1,8 kg/m² | 1,8 dla N18 (karta zaprawy H+H, 2025.06) [36]; 10–13 kg/m³, czyli 1,8–2,3 kg/m² [3] | ZGODNE | 1,8 |
| | oferta | – | kl. 15 „standard” w cenniku z 20.01.2025 [3]; deklaracje właściwości (DoP) z zakładów Jedlanka, Kruki, Przysieczyn, Reda na hplush.com [41] | ZGODNE | – |
| **Silka E12** | L×T×H | 333×120×199 | 333±2 × 120±2 × 199±1 [35,30] | ZGODNE | bez zmian |
| | szt./m² | 15 | 15 cienka spoina, 14,3 tradycyjna [35]; 15 [9,12] | ZGODNE | 15 |
| | szt./pal. | 90 | 90 [4,5,6,9,11,30,46] | ZGODNE | 90 |
| | masa | 11,5 kg | paleta 1060 kg, czyli ok. 11,5–11,8 kg [9,12]; BIM paleta 1057 kg [11]; ok. 11,6 kg [30]; 12 kg (przypisanie niepewne) [32] | ZGODNE | 11,5 |
| | zaprawa | 1,8 kg/m² | 1,8 [5,6,9,12]; BIM 1,596 [11] | ZGODNE | 1,8 |
| **Silka E8** | L×T×H | 333×80×199 | 333×80×199 [31,34] | ZGODNE | bez zmian |
| | szt./m² | 15 | 15 [5,9,12] | ZGODNE | 15 |
| | szt./pal. | 135 | 135 [4,5,6,9,31,34,46] | ZGODNE | 135 |
| | masa | 7,5 kg | paleta 1035 kg, czyli ok. 7,5 kg [9,12]; ok. 7,4 kg [31]; 7 kg [33]; bat.pl paleta 1,22 t, czyli ok. 9 kg (wartość odstająca) [34] | ZGODNE | 7,5 |
| | zaprawa | 1,2 kg/m² | 1,2 [5,6,9,12] | ZGODNE | 1,2 |
| | oferta | – | w cennikach [5,6] i w sklepie w 2026 [23]; bat.pl: „na zamówienie” [34] | ZGODNE | – |

**Uwagi do kalkulatora:**
- **H+H N18, spoina tradycyjna.** 17,4 szt./m² wychodzi tylko przy spoinie poziomej 10 mm i spoinie pionowej 0 (pióro-wpust): 1/(0,25×0,23). Przy jv = 10 mm wyszłoby 16,7 szt./m². Trzeba ustawić jv = 0.
- **H+H N18, gęstość.** Istnieje też wariant 15-1400 o masie 13,9 kg [39]. Nie należy mylić go z 15-1600.
- **Silka E24 Light.** Masa 23,7 kg, 45 szt./pal. i zaprawa 3,6 kg/m² pasują do zwykłej E24 / E24 Light: 24,24 kg, paleta ok. 1050 kg, gęstość do 1500 [20,21,22]. Jeśli chcecie w kalkulatorze wersję z uchwytami, to właściwa nazwa to „E24 (Light) kl. 15”, a nie „E24S”.

## B) Źródła

1. [11 karta techniczna H+H Silikat N18 15-1600](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/produkty-pdf/silikaty---produkty-podstawowe/11-karta-techniczna--hh-silikat-n18-15-1600.pdf) — H+H Polska — edycja 2022.05: 250×180×220, 14,2 kg, 17,4/18 szt./m², 80 szt./pal., paleta 1150 kg
2. [Karta techniczna H+H Silikat N18 15-1600](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/produkty-pdf/silikaty-/karta-techniczna--hh-silikat-n18-15-1600.pdf) — H+H Polska — edycja 2024.06: 14,5 kg, 17,4/18 szt./m², 80 szt./pal., paleta 1200 kg
3. [Cennik hhsil 20250120](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/cennik-hhsil_20250120.pdf) — H+H Polska — N18 kl. 15 „standard”, 80 szt., paleta 1184 kg, 17,4/18 szt./m², 7,00 zł netto/szt.; zaprawa cienkowarstwowa 10–13 kg/m³
4. [Cennik Silka – zobacz ceny bloczków](https://kb.pl/materialy-budowlane/cegly-bloczki-pustaki/cennik-silka-zobacz-ceny-bloczkow-pod-marka-silka/) — KB.pl — E24 45, E18 60, E12 90, E8 135 szt./pal.; 3/4/6/9 m²/pal.
5. [Cennik hurtowy Xella od 3.01.2022](https://storefrontapi.commerce.xella.com/medias/sys_master/root/hc1/hed/8875799379998/Cennik_glowny_0131/Cennik-glowny-0131.pdf) — Xella Polska — E24S kl. 20 i kl. 25 (na zamówienie), 45 szt., 3 m²; zaprawa FIX N211: 3,6 / 2,7 / 1,8 / 1,2 kg/m² dla grubości 240/180/120/80
6. [Cennik hurtowy Xella od 1.11.2022](https://storefrontapi.commerce.xella.com/medias/sys_master/root/h2c/ha2/9149692575774/Cennik%20glowny%202022-10/Cennik-glowny-2022-10.pdf) — Xella Polska — te same liczby sztuk i zużycia zaprawy; brak E18S
7. [Silka E-S (folder)](https://storefrontapi.commerce.xella.com/medias/sys_master/root/h14/h11/8835735617566/Silka_E_S/Silka-E-S.pdf) — Xella Polska — E18S/E24S to bloki pełne, gęstość ≤1800, klasy 20/25, 15 szt./m², 60/45 szt./pal., ciężar muru 340/454 kg/m², zaprawa 2,7/3,6 kg/m²
8. [Silka E (karta systemowa)](https://xella.bimproduction.eu/uploads/model/attachments/24/Silka_E.pdf) — Xella / BIM — E24/E18/E15: paleta 1090/1050/1220 kg, mur 353/265/225 kg/m², zaprawa 3,6/2,7/2,3, pióro-wpust z uchwytem, gęstość ≤1500
9. [Solidna i cicha ściana działowa – Silka E8/E12](https://xella.bimproduction.eu/uploads/model/Silka_E8_E12(2).pdf) — Xella / BIM — E8: 135 szt., paleta 1035 kg, 118 kg/m², 1,2 kg/m²; E12: 90 szt., paleta 1060 kg, 177 kg/m², 1,8 kg/m²
10. [Model BIM Silka E18S klasy 20](https://xella.bimproduction.eu/models/db1f86ca-61db-4b69-b05a-ac71b7ac1fb8?locale=pl) — Biblioteka BIM Xella — gęstość 1800, 60 szt., paleta 1306 kg, 15,015 szt./m², zaprawa 2,394 kg/m²
11. [Model BIM Silka E12 klasy 15](https://xella.bimproduction.eu/models/6736064b-ddfb-4cf0-97e9-7c98778d3a82?locale=pl) — Biblioteka BIM Xella — gęstość 1500, 90 szt., paleta 1057 kg, zaprawa 1,596 kg/m²
12. [Silka E – ściana działowa](https://storefrontapi.commerce.xella.com/medias/sys_master/root/h31/h0c/8850681561118/Silka_E_sciana_dzialowa/Silka-E-sciana-dzialowa.pdf) — Xella Polska — E8/E12: paleta 1035/1060 kg, zaprawa 1,2/1,8 kg/m², 15 szt./m²
13. [XELLA – Blok drążony SILKA E24](https://www.infoarchitekta.pl/firmy/x/91-xella-polska/produkty/12990-xella-blok-drazony-silka-e24.html) — infoArchitekta — E24: 21,8 kg, gęstość 1490, 45 szt., Rw 56 dB
14. [XELLA – Blok SILKA E18S](https://www.infoarchitekta.pl/firmy/x/91-xella-polska/produkty/12999-xella-blok-silka-e18s.html) — infoArchitekta — E18S pełny, 333×180×199, gęstość 1750, 60 szt., 15 szt./m²
15. [Silka E24 kl.15](https://grupastorex.eu/cegly-silikatowe/313-silka-e24-kl15.html) — Grupa Storex — 333×240×199, 45 szt., 15 szt./m², uchwyty montażowe, pióro-wpust
16. [Bloczek silikatowy SILKA E24 kl.15](https://mbdombud.pl/produkt/bloczek-silikatowy-silka-e24-kl-15-xella/) — DOMBUD — E24 drążony, kanały co 16,7 cm, otwory ⌀4 cm, uchwyty
17. [SILKA Bloczek E24 kl.15 333x199x240 45szt/pal.](https://sklep-kowalczyk.pl/silka-bloczek-e24-kl-15-333x199x240-45szt-pal-10004171.html) — E-Kowalczyk — 45 szt./pal., 8,95 zł
18. [SILKA bloczek gr.24 E24 klasa 15](https://www.maldrew.com.pl/product/silka-bloczek-silikatowy-gr-24-cm-e24-klasa-15) — Maldrew — 45 szt./pal.
19. [Cegła silikatowa Silka E24](https://moradocieplenia.pl/produkt/cegla-silikatowa-silka-e24-kl-15-333-240-199-mm-xella/) — Mora Docieplenia — ok. 22–23 kg, 15 szt./m², 45 szt., uchwyty
20. [Silka E24 kl. 15 240x199x333 – Sewera](https://sklep.sewera.pl/bloczek-silikatowy-silka-e24-240x199x333mm-klasa-15-xella-p19410) — Sewera — 24,24 kg, paleta ok. 1050 kg, 15 szt./m², 3,6 kg/m²
21. [Silka E24 Light kl. 15 – Sewera](https://sklep.sewera.pl/bloczek-silikatowy-silka-e24-light-240x199x333mm-klasa-15-xella-p22693) — Sewera — Light: 24,24 kg, paleta ok. 1050 kg, gęstość ≤1500, 3,6 kg/m², uchwyt
22. [Silka E24 klasy 15 Light](https://gazobeton.pl/silka-e24-klasy-15-pelna-paleta) — Gazobeton.pl — 24 kg, 45 szt., gęstość 1600
23. [Xella – bloczki SILKA (lista)](https://stanlux.istore.pl/silka) — Stanlux — w ofercie 2026: E24 Light kl. 15, E24S kl. 20 i kl. 25, E18 kl. 15/20, E12, E8; brak E18S
24. [Silka E24S klasy 20 (pełna paleta)](https://gazobeton.pl/silka-e24s-klasy-20-pelna-paleta) — Gazobeton.pl — E24S: **28 kg**, gęstość 1800, 45 szt., „blok pełny”
25. [SILKA E24S klasa 20 24cm](https://sklep.protektor-polska.pl/produkt/silka-e24s-klasa-20-24cm/) — Protektor-Polska — gęstość 1800, 45 szt., **paleta 1,31 t**
26. [SILKA E24S kl. 20 – Stanlux](https://stanlux.istore.pl/pl/p/SILKA-E24S-kl.-20-Cegla%2C-silikat%2C-pustak%2C-bloczek-fundamentowy-firmy-Xella/21979758) — Stanlux — 15 szt./m², 45 szt./pal., 8,35 zł
27. [Bloczek silikatowy Silka E 24 S kl.20 pełny](https://bat.pl/Bloczek-silikatowy-Silka-E-24-S-kl.20-pelny/10015818) — BAT — „pełny”, 13,60 zł/szt., w magazynie
28. [SILKA E18S klasy 20](https://www.marketpsb.pl/katalog/produkt/silka-e18s-klasy-20) — Market PSB — pełny, gęstość 1,86 t/m³, 60 szt., 3,956 m²/pal.
29. [Silka 18 – ile m² na palecie](https://www.majsterkowicza.pl/silka-18-ile-m2-na-palecie/) — Majsterkowicza.pl — E18 (drążony): 16–18 kg, paleta 1000–1100 kg, 60 szt., 4 m²
30. [SILKA E12 klasy 15](https://www.marketpsb.pl/katalog/produkt/silka-e12-klasy-15) — Market PSB — gęstość 1,47 t/m³, 90 szt., 5,93 m²/pal.
31. [SILKA E8 klasy 15](https://www.marketpsb.pl/katalog/produkt/silka-e8-klasy-15) — Market PSB — gęstość 1,4 t/m³, 135 szt., 8,90 m²/pal.
32. [Silka E12 klasy 15](https://gazobeton.pl/silka-e12-klasy-15) — Gazobeton.pl — 12 kg, 90 szt., 1500 kg/m³
33. [Silka E8 klasy 15](https://gazobeton.pl/silka-e8-klasy-15) — Gazobeton.pl — 7 kg, 135 szt.
34. [Bloczek silikatowy Silka E8 klasa 15](https://bat.pl/Bloczek-silikatowy-Silka-E8-klasa-15-8x33.3x19.9cm/10015873) — BAT — 333×80×199, 135 szt., paleta 1,22 t, na zamówienie
35. [Karta techniczna produktu – Silka E12 klasy 15](https://verto.realbud.pl/api_secure/article_attachments/118051) — Xella (przez Realbud) — 333±2 × 120±2 × 199±1, klasa gęstości 1400, 15 szt./m² (cienka spoina) / 14,3 (tradycyjna)
36. [Karta techniczna H+H Cienkowarstwowa, edycja 2025.06](https://sunbud.com.pl/wp-content/uploads/2026/01/Karta-techniczna-zaprawa-cienkowarstwowa-z-klejem-podporowym.pdf) — H+H (przez Sunbud) — zużycie: **N18 1,8 kg/m²**, N12 1,5, N8 1,0, N24 2,9
37. [H+H silikat N18 kl.15](https://grupastorex.eu/cegly-silikatowe/290-hh-silikat-n18-kl15.html) — Grupa Storex — 14,3 kg, 80 szt., paleta 1150 kg, klasa gęstości 1600, uchwyty, pióro-wpust
38. [H+H silikat N18 kl.20](https://grupastorex.eu/cegly-silikatowe/294-hh-silikat-n18-kl20.html) — Grupa Storex — 14,3 kg, 80 szt., paleta 1150 kg
39. [H+H Silikat N18 kl. 15 – Sewera](https://sklep.sewera.pl/silikat-n18-250x180x220mm-klasa-15-hh-p22473) — Sewera — wariant o gęstości 1,4: 13,9 kg, 17,4/18 szt./m², 80 szt.
40. [Bloczek Silikat H+H N18 kl. 15](https://www.abud.pl/product-pol-58027-Bloczek-Silikat-H-H-N18-250x180x220mm-kl-15.html) — Abud — 250×180×220, 5,40 zł brutto
41. [H+H Silikaty – produkty podstawowe](https://www.hplush.com/pl-pl/h-h-silikaty/h-h-silikaty-produkty-podstawowe) — H+H Polska — deklaracje właściwości (DoP) N18 15-1600 z 4 zakładów, czyli produkt w ofercie
42. [Holcim completes acquisition of Xella](https://chemxplore.com/news/holcim-completes-acquisition-xella) — ChemXplore — przejęcie zamknięte w 2026 (artykuł z 19.06.2026)
43. [SILKA 24 cm kl.15 drążony](https://sklep-lubar.pl/silikaty-bloczki-silikatowe/silka-24-cm-e24-kl.15-bloczek-silikatowy-drazony-xella) — Lubar — E24 kl. 15 opisany jako „drążony”
44. [Bloczek SILKA E18S Klasy 20 – Artbud](https://www.artbud.pl/pl/p/Bloczek-Wapienno-Piaskowy-SILKA-E18S-Klasy-20-na-sciany-piwniczne-i-fundamentowe%2C-wymiar-333x199x180-mm/12146) — Artbud — „blok konstrukcyjny pełny”, 333×199×180, na ściany piwniczne
45. [Bloki SILKA E18S i E24S](https://budujemydom.pl/irbj/stan-surowy-zamkniety/fundamenty-sciany-stropy/elementy-wapienno-piaskowe/silka/p/10714-bloki-silka-e18s-i-es24s) — Budujemy Dom — bloki pełne, piwnice i fundamenty, do 15 kondygnacji
46. [Silka bloczek gr. 12 cm E12 klasa 15](https://www.maldrew.com.pl/product/silka-bloczek-silikatowy-gr-12-cm-e12-klasa-15) / [gr. 8 cm E8](https://www.maldrew.com.pl/product/silka-bloczek-silikatowy-gr-8-cm-e8-klasa-15) — Maldrew — 90 i 135 szt./pal.
47. [Bloczek silikatowy HOLCIM SILKA E24S kl. 20 (45 szt./paleta)](https://www.sig.pl/bloczek-silikatowy-holcim-silka-e24s-kl-20-333240199-mm-45-sztpaleta,p844383) — SIG — tylko tytuł z wyników wyszukiwania (strona się nie otworzyła): marka Holcim, 333/240/199, 45 szt.

## C) Podsumowanie

- **Unikalne źródła:** 48 adresów URL w 47 pozycjach (pozycja 46 zawiera 2 adresy). Pozycja 47 to tylko tytuł z wyników wyszukiwania.
- **Unikalne domeny:** 26 — edge.sitecorecloud.io, storefrontapi.commerce.xella.com, xella.bimproduction.eu, kb.pl, infoarchitekta.pl, grupastorex.eu, mbdombud.pl, sklep-kowalczyk.pl, maldrew.com.pl, moradocieplenia.pl, sklep.sewera.pl, gazobeton.pl, stanlux.istore.pl, sklep.protektor-polska.pl, bat.pl, marketpsb.pl, majsterkowicza.pl, verto.realbud.pl, sunbud.com.pl, abud.pl, hplush.com, chemxplore.com, sklep-lubar.pl, artbud.pl, budujemydom.pl, sig.pl.

**Ograniczenia:**
- Strony xella.pl i aktualne cenniki Xella z 2025 i 2026 r. nie dały się pobrać (strona renderowana w JS albo za długi adres). Najnowsze oficjalne liczby Xelli pochodzą więc z cenników z 2022 r., folderów i biblioteki BIM. Uzupełniłem je sklepami z 2026 r.
- Producenci nie podają wprost masy jednej sztuki Silki E24S ani E18S. Proponowane 28,5 kg i 21,5 kg wynikają ze zgodnych mas palet, ciężarów muru i gęstości 1800, przy czym E24S ma 28 kg podane wprost w jednym sklepie (pozycja 24).
- Grupy Silikaty, Silikaty Białe Błota ani Prefasil nie sprawdzałem, bo żaden z 5 wpisów kalkulatora nie dotyczy ich produktów.

---

## Ceramika

# Raport: dane kalkulatora „Ile bloczków na ściany”, ceramika (stan na 31.10.2026)

Sprawdziłem wszystkie 8 wpisów. Większość danych zgadza się z kartami producentów. Trzeba poprawić dwie rzeczy:

- **Masa Porotherm 25 P+W:** w kalkulatorze jest 15 kg, a powinno być ok. 18 kg. Wartość 15 kg należy do innego pustaka, Porotherm 25 K P+W (pustak na słupy).
- **Röben Poroton 24:** prawdopodobnie nie ma go już w polskiej ofercie Röben.

Porotherm 25 P+W nadal sprzedaje się pod tą nazwą. Porotherm 25 Profi to osobny produkt: wysokość 249 mm, cienka spoina, ok. 19 kg, 1,7 l zaprawy na m².

Niektórych stron nie udało się odczytać: poradnik-e-book Wienerberger, oficjalna karta 11.5 P+W (PDF), część sklepów (budomiks, murygt, icmarket, marbet24, sig.pl, rolbud, dubletzaprawy, allegro). Dane z sig.pl i rolbud mam tylko z tytułów wyników wyszukiwania i tak je oznaczyłem.

## A) Tabela wyników

| # | Produkt | Pole | Kalkulator | Wg źródeł | Ocena | Proponowana wartość |
|---|---|---|---|---|---|---|
| 1 | Porotherm 25 P+W | L×T×H | 373×250×238 | 250/373/238 mm [1][13][31][35][40] | ZGODNE | 373×250×238 |
| 1 | | jh / jv | 12 / 0 | zaprawa tradycyjna, pióro-wpust [1][10] | ZGODNE | 12 / 0 |
| 1 | | szt./m² | 10,7 | 10,7 [1][13][58][59][35] | ZGODNE | 10,7 |
| 1 | | szt./pal. | 72 | 72 [1][31][35][38] | ZGODNE | 72 |
| 1 | | masa | **15 kg** | ok. 18 kg [13][58][40][31][38]; 17,8 kg [35][42]; 15 kg to masa 25 K P+W [2] | **DO POPRAWY** | **18 kg** |
| 1 | | zaprawa | 16 l/m² | 16 l/m² [1][13][58]; 0,016 m³/m² [57] | ZGODNE | 16 l/m² |
| 1 | | w ofercie / nazwa | – | jest w cenniku i katalogu jako „25 P+W”; Profi to inny produkt [1][10][14] | ZGODNE | bez zmian |
| 2 | Porotherm 30 P+W | L×T×H | 248×300×238 | 300/248/238 [9][3][32][36] | ZGODNE | bez zmian |
| 2 | | szt./m² | 16 | 16 [9][3][1][60] | ZGODNE | 16 |
| 2 | | szt./pal. | 80 | 80 [36][39]; „80/96” [1][32] | ZGODNE (NIEPEWNE, czy 96 dotyczy kl. 10) | 80 |
| 2 | | masa | brak | ok. 14 kg [9][32][39]; 14,2 kg [3][36][43] | DO UZUPEŁNIENIA | 14 kg |
| 2 | | zaprawa | 20 l/m² | 20 l/m² [9][1]; sklep abud podaje 16 l/m² [43] | ZGODNE | 20 l/m² |
| 3 | Porotherm 38 Dryfix | L×T×H | 248×380×249 | 380/248/249 [5][4][48] | ZGODNE | bez zmian |
| 3 | | jh | 1 | spoina ok. 1 mm [11][56] | ZGODNE | 1 |
| 3 | | szt./m² | 16 | 16 [5][4][1][60] | ZGODNE | 16 |
| 3 | | szt./pal. | 60 | 60 [49, tytuł]; „60/72” [1] | ZGODNE (NIEPEWNE) | 60 |
| 3 | | masa | brak w zadaniu | ok. 17 kg [5][56][48]; 17,1 kg [4] | DO UZUPEŁNIENIA | 17 kg |
| 3 | | Dryfix | 6 m²/puszkę | 6 m² [5][1]; puszka 810 ml (dawniej 750 ml) [63]; starsze źródła: 5 m² [56][48] | ZGODNE | 6 m²; nazwa producenta: „zaprawa Dryfix”, nie klej-pianka |
| 4 | Leier Thermopor 25 P+W | L×T×H | 375×250×238 | 250×375×238 [18][21][23][59] | ZGODNE | bez zmian |
| 4 | | jh / jv | (12 / 0) | spoina 12 mm, P+W [18][21] | ZGODNE | 12 / 0 |
| 4 | | szt./m² | 10,7 | 10,7 [18][21][23][45][59] | ZGODNE | 10,7 |
| 4 | | szt./pal. | brak | 72 [21][22]; tytuł rolbud „72 szt./paleta” [28] | DO UZUPEŁNIENIA | 72 |
| 4 | | masa | brak | leier.pl „ok. 15,0 i 17,0 kg” (dwa warianty) [18][23]; 17,0 kg [21]; paleta ok. 1250 kg, czyli ok. 17,4 kg/szt. [22] | DO UZUPEŁNIENIA | 17 kg (wariant cięższy, bezpieczny dla transportu) |
| 4 | | zaprawa | – | leier.pl nie podaje; austriacki odpowiednik Leiertherm 25 N+F: 17 l/m² przy spoinie 12 mm [20] | NIEPEWNE | 16–17 l/m² |
| 4 | | oferta | – | w ofercie [17][30][29] | ZGODNE | – |
| 5 | Leier Thermopor PLAN 25 P+W | L×T×H | 375×250×249 | 375×250×249 [16][24]; handlobud podaje 238, prawdopodobnie błąd [25] | ZGODNE | bez zmian |
| 5 | | jh | 1 | spoina nominalnie 1 mm [16][19] | ZGODNE | 1 |
| 5 | | szt./m² | 10,7 | 10,7 [16][24][25] | ZGODNE | 10,7 |
| 5 | | masa | 16,6 kg | ok. 16,6 kg [16] | ZGODNE (tylko 1 źródło) | 16,6 kg |
| 5 | | szt./pal. | – | 72 [24][26]; „ok. 60” [25] | DO UZUPEŁNIENIA | 72 |
| 5 | | zaprawa | cienkowarstwowa | zaprawa M10 w workach 25 kg, zużycie „zależne od grubości muru”, bez liczby [19]; Leier ma też pianoklej [17] | ZGODNE (rodzaj), ilość NIEPEWNA | odniesienie: Porotherm 25 Profi 1,7 l/m² [14] |
| 6 | Röben Poroton 24 | L×T×H | 308×240×238 | 308×240×238 [50][51][52] | ZGODNE | bez zmian |
| 6 | | szt./m² | 13 | 13 [50]; 12,7 [51]; „ok. 14” [52]; z geometrii przy spoinie 12 mm wychodzi 12,99 | ZGODNE | 13 |
| 6 | | paleta / masa | – | 72 szt., 15,0–15,7 kg [51][52] | (opcjonalnie) | 72 / 15,7 kg |
| 6 | | oferta | – | Röben Polska: obecnie dachówki i klinkier [53][54]; katalog pustaków z 2013 r. [52]; ogłoszenie wycofane z 2016 r. [51]; budchem „na zamówienie” [50] | **NIEPEWNE / prawdopodobnie wycofany** | oznaczyć jako archiwalny albo usunąć |
| 7 | Porotherm 11,5 P+W | L×T×H | 498×115×238 | 115/498/238 [6][33][41][44] | ZGODNE | bez zmian |
| 7 | | szt./m² | 8 | 8 [6][33][44][47] | ZGODNE | 8 |
| 7 | | szt./pal. | 100 | 100 [33][44][47]; „100/96” [1] | ZGODNE | 100 |
| 7 | | masa | 11 kg | ok. 11 kg [6][33][41] | ZGODNE | 11 kg |
| 7 | | zaprawa | 7 l/m² | 0,007 m³/m² [57]; cennik ok. 7 (odczyt słaby) [1] | ZGODNE | 7 l/m² |
| 8 | Porotherm 8 P+W | L×T×H | 498×80×238 | 80/498/238 [8][7][15][34] | ZGODNE | bez zmian |
| 8 | | szt./m² | 8 | 8 [8][7][34][46] | ZGODNE | 8 |
| 8 | | szt./pal. | 120 | 120 [1][34][37][46] | ZGODNE | 120 |
| 8 | | masa | brak | ok. 9 kg [8][15][34]; strona www i sewera podają 8,5 kg [7][37] | DO UZUPEŁNIENIA | 9 kg |
| 8 | | zaprawa | 5 l/m² | 5 l/m² [8][15][1] | ZGODNE | 5 l/m² |

## B) Źródła

1. [Cennik produktów Wienerberger](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/business-documents/Cennik-produktow-Wienerberger.pdf) — Wienerberger — 25 P+W: 373×250×238, 10,7 szt., 16 l, 72 szt./pal.; 30 P+W: 16 szt., 20 l, 80/96; 38 Dryfix: 16 szt., 1 puszka na 6 m², 60/72; 11.5 P+W: 100/96; 8 P+W: 120. Brak daty i mas.
2. [Porotherm 25 K P+W – ulotka](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/brochures/PL_MKT_DOC_POR_Porotherm_25_K_PW_ulotka.pdf) — Wienerberger — 25 K P+W 250/373/238, ok. 15 kg (stąd 15 kg w kalkulatorze).
3. [Porotherm 30 P+W – strona produktu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm/porotherm-30-p-w.html) — Wienerberger — 300×248×238, ok. 14,2 kg, 16 szt./m², kl. 10/15.
4. [Porotherm 38 Dryfix – strona produktu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm/porotherm-38-dryfix.html) — Wienerberger — 380×248×249, ok. 17,1 kg, 16 szt./m², kl. 10.
5. [Porotherm 38 Dryfix – karta techniczna](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/technical/technical-product-info-sheet/wall/PL_MKT_TEC_POR_Porotherm_38_Dryfix_karta_techniczna_porotherm.pdf) — Wienerberger — 380/248/249, ok. 17 kg, 16 szt./m², 1 puszka na 6 m², ok. 267 kg/m² muru.
6. [Porotherm 11.5 P+W – strona produktu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm/porotherm-11-5-p-w.html) — Wienerberger — 115×498×238, ok. 11 kg, 8 szt./m², kl. 10.
7. [Porotherm 8 P+W – strona produktu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm/porotherm-8-p-w.html) — Wienerberger — 80×498×238, ok. 8,5 kg, 8 szt./m².
8. [Porotherm 8 P+W – karta techniczna](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/technical/technical-product-info-sheet/wall/PL_MKT_TEC_POR_Porotherm_8%20_PplusW_karta_techniczna_porotherm.pdf) — Wienerberger — 80/498/238, ok. 9 kg, 8 szt./m², 5 l/m², ok. 78 kg/m².
9. [Porotherm 30 P+W – karta techniczna](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/technical/technical-product-info-sheet/wall/PL_MKT_TEC_POR_Porotherm_30_PplusW_karta_techniczna_porotherm.pdf) — Wienerberger — 300/248/238, ok. 14 kg, 16 szt./m², 20 l/m², ok. 265 kg/m².
10. [Katalog pustaków Porotherm](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm.html) — Wienerberger — 25 P+W, 11.5 P+W i 8 P+W w grupie STANDARD, czyli w ofercie.
11. [Porotherm Dryfix – rewolucja w murowaniu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/warto-wiedziec/porotherm-dryfix-rewolucja-w-murowaniu.html) — Wienerberger — spoina ok. 1 mm; 46 puszek (35 l) na dom ok. 120 m².
12. [Porotherm Dryfix – strona systemu](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/porotherm-dryfix.html) — Wienerberger — zaprawa w puszkach w cenie pustaków, szlif ±0,3 mm.
13. [Porotherm 25 P+W – karta techniczna (kopia)](https://www.woymar.pl/files/ml/files/331202plpl_mkt_tec_por_porotherm_25_pplusw_karta_techniczna_porotherm.pdf) — Wienerberger, hostowane na woymar.pl — 250/373/238, ok. 18 kg, 10,7 szt./m², 16 l/m², ok. 221 kg/m², kl. 10/15/20.
14. [Porotherm 25 Profi – karta techniczna (kopia)](https://www.woymar.pl/files/ml/files/412020plpl_mkt_tec_por_porotherm_25_profi_karta_techniczna_porotherm.pdf) — Wienerberger/woymar.pl — 250/373/249, ok. 19 kg, 10,7 szt./m², 1,7 l/m² (inny produkt niż P+W).
15. [Porotherm 8 P+W – karta techniczna (kopia)](https://www.woymar.pl/files/ml/files/031199plpl_mkt_tec_por_porotherm_8-_pplusw_karta_techniczna_porotherm.pdf) — Wienerberger/woymar.pl — ok. 9 kg, 8 szt./m², 5 l/m².
16. [THERMOPOR PLAN® 25 P+W](https://www.leier.pl/product/thermopor-plan-25-pw/) — Leier Polska — 375×250×249, ok. 16,6 kg, 10,7 szt./m², spoina 1 mm, 15 MPa.
17. [Pustaki ceramiczne THERMOPOR – kategoria](https://www.leier.pl/product-category/sciany/) — Leier Polska — w ofercie Thermopor 8/11,5/18,8/25/30/38 P+W, Plan 11,5/18,8/25/30, zaprawa M10, pianoklej.
18. [THERMOPOR® 25 P+W](https://www.leier.pl/produkty/thermopor-25-pw/) — Leier Polska — 250×375×238, ok. 15,0 i 17,0 kg, 10,7 szt./m², spoina 12 mm.
19. [Cienkowarstwowa zaprawa M10 do THERMOPOR PLAN](https://www.leier.pl/produkty/cienkowarstwowa-zaprawa-murarska-m10-do-pustakow-ceramicznych-thermopor-plan/) — Leier Polska — worek 25 kg, spoina ok. 1 mm, zużycie „zależne od grubości muru”.
20. [Leiertherm 25 N+F – karta (Hornbach AT)](https://media.hornbach.at/hb/technicaldatasheet/as.121563586.pdf) — Leier Baustoffe (AT) — 375×250×238, ok. 13,6 kg, 10,7 szt./m², 17 l/m² przy spoinie 12 mm.
21. [Thermopor 25 P+W Leier](https://hoffmanowska.pl/bez-kategorii/pustak-ceramiczny-thermopor-25-pw-leier/) — Cegielnia Hoffmanowska — 250×375×238, ok. 17,0 kg, 10,7 szt./m², 72 szt./pal., 4,35–4,65 zł.
22. [Pustaki ceramiczne Thermopor 25 P+W](https://hoffmanowska.pl/bez-kategorii/pustaki-ceramiczne-thermopor-25-pw/) — Cegielnia Hoffmanowska — 72 szt./pal., paleta ok. 1250 kg, 5,79–6,49 zł.
23. [Leier Thermopor 25 P+W](https://www.metallco.pl/produkt/leier-pustak-thermopor-25-p+w-(250-x-375-x-238mm)--2892) — Metallco — 250×375×238, ~15/~17 kg, 10,7 szt./m², 5,90 zł brutto.
24. [Thermopor Plan 25 P+W (szlifowany)](https://atexbud.pl/produkt/pustak-ceramiczny-25-pw-leier-thermopor-plan-szlifowany-kl15) — Atexbud — 375×250×249, 10,7 szt./m², 72 szt./pal., 7,13 zł brutto.
25. [Leier Thermopor Plan 25 P+W](https://handlobud.sklep.pl/materialy-budowlane-i-narzedzia-handlobud-sklep-online/3435-pustak-ceramiczny-leier-thermopor-plan-25-pw-kl-15-szlifowany-107-sztm.html) — Handlobud — 10,7 szt./m², „ok. 60 szt./pal.”, wysokość 238 (rozbieżna z innymi).
26. [Thermopor PLAN 25 P+W Sierakowice](https://sklep-lubar.pl/pustaki-ceramiczne/pustak-ceramiczny-szlifowany-thermopor-plan-25-pw-leier-sierakowice) — LUBAR — 72 szt./pal.
27. [Leier Thermopor 25 P+W kl. 15](https://sklep-lubar.pl/pustaki-ceramiczne/pustak-ceramiczny-25-pw-leier-thermopor-sierakowice-klasa-15) — LUBAR — klasa 15, produkt w ofercie.
28. [Leier Thermopor 25 P+W kl.15 (72 szt./paleta)](https://e-sklep.rolbud.info/pl/p/Leier-Thermopor-25-P-W-kl.15-72szt.paleta/4913) — Rolbud — 72 szt./pal. (tylko tytuł z wyszukiwarki, strona zablokowana).
29. [OLX – ściany i elewacje](https://www.olx.pl/budowa-i-remont/sciany-i-elewacje/mostki_32731/) — OLX — Leier Thermopor 25 P+W za 6 zł, ogłoszenie z 22.10.2026 (produkt nadal w obrocie).
30. [Pustak Thermopor 25 P+W LEIER](https://mrowka.com.pl/produkt/pustak-thermopor-25-p-w-leier-552684.html) — PSB Mrówka — 6,99 zł/szt., dostępny.
31. [Porotherm 25 P+W 250/373/238](https://centrobud.pl/ceramika-budowlana/12846-pustak-ceramiczny-porotherm-25-pw-250373238.html) — Centrobud — ok. 18 kg, 10,7 szt./m², 72 szt./pal.
32. [Porotherm 30 P+W 300/248/238](https://centrobud.pl/ceramika-budowlana/12845-pustak-ceramiczny-porotherm-30-pw-300248238.html) — Centrobud — ok. 14 kg, 16 szt./m², 80/96 szt./pal.
33. [Porotherm 11.5 P+W 115/498/238](https://centrobud.pl/ceramika-budowlana/12848-pustak-ceramiczny-wienerberger-porotherm-115-pw-115498238.html) — Centrobud — ok. 11 kg, 8 szt./m², 100 szt./pal.
34. [Porotherm 8 P+W 80/498/238](https://centrobud.pl/ceramika-budowlana/12849-pustak-ceramiczny-wienerberger-porotherm-8-pw-80498238.html) — Centrobud — ok. 9 kg, 8 szt./m², 120 szt./pal.
35. [Porotherm 25 P+W kl. 15](https://sklep.sewera.pl/pustak-ceramiczny-porotherm-25-pw-klasa-15-wienerberger-p16560) — Sewera — ok. 17,8 kg, 10,7 szt./m², 72 szt./pal., 7,58 zł brutto.
36. [Porotherm 30 P+W kl. 15](https://sklep.sewera.pl/pustak-ceramiczny-porotherm-30-pw-klasa-15-wienerberger-p16577) — Sewera — ok. 14,2 kg, 16 szt./m², 80 szt./pal.
37. [Porotherm 8 P+W kl. 10](https://sklep.sewera.pl/pustak-ceramiczny-porotherm-8-pw-klasa-10-wienerberger-p16550) — Sewera — ok. 8,5 kg (pole „waga”: 9,0), 8 szt./m², 120 szt./pal.
38. [Porotherm 25 P+W kl. 15 (pełna paleta)](https://gazobeton.pl/wienerberger-porotherm-25-p-w-klasa-15-pelna-paleta) — Gazobeton — 18 kg, 72 szt./pal. (błędnie podaje 16 szt./m²).
39. [Porotherm 30 P+W kl. 15 (pełna paleta)](https://gazobeton.pl/porotherm-30-p-w-15-pelna-paleta) — Gazobeton — 14 kg, 16 szt./m², 80 szt./pal.
40. [Porotherm 25 P+W KL.15](https://www.leroymerlin.pl/produkty/pustak-ceramiczny-porotherm-25-p-w-kl-15-37-3-x-25-x-23-8-cm-ol-wienerberger-45254671.html) — Leroy Merlin — 37,3×25×23,8 cm, 18 kg, 11,99 zł.
41. [Porotherm 11,5 P+W KL.100](https://www.leroymerlin.pl/produkty/pustak-ceramiczny-porotherm-11-5-p-w-kl-100-49-8-x-11-5-x-23-8-cm-le-wienerberger-41247976.html) — Leroy Merlin — 49,8×11,5×23,8 cm, 11 kg, 12,79 zł.
42. [Porotherm 25 P+W kl.20](https://askot.krakow.pl/pustak-porotherm-25-pw-kl20-250x373x238mm-wienerberger) — Askot — ok. 17,8 kg, 10,7 szt./m², 13,78 zł.
43. [Porotherm 30cm P+W kl. 15](https://www.abud.pl/product-pol-58034-Pustak-ceramiczny-Porotherm-30cm-P-W-kl-15.html) — Abud — ok. 14,2 kg, 16 szt./m², zaprawa 16 l/m² (niezgodne z kartą: 20).
44. [Porotherm 11,5 P+W 100 szt./pal.](https://www.maldrew.com.pl/product/pustak-porotherm-115-pw-kl100a100szt) — Maldrew — 115×498×238, 8 szt./m², 100 szt./pal.
45. [Leier Thermopor 25 P+W](https://www.maldrew.com.pl/product/pustak-ceramiczny-leier-thermopor-25-p-w) — Maldrew — 10,7 szt./m², Rw 53 dB, U 0,974.
46. [POROTHERM 8 P+W 120 szt./pal.](https://realbud.com/pl/p/Pustak-POROTHERM-8-P-W-kl.10-80x498x238,-8-szt.m2,-120-szt.pal./2296351) — Realbud — 80×498×238, 8 szt./m², 120 szt./pal.
47. [Porotherm 11,5 P+W 100 szt./pal.](https://realbud.com/pl/p/Pustak-Porotherm-11%2C5-P-W-kl.10-115x498x238%2C-8-szt.m2%2C-100-szt.pal./75056645) — Realbud — 8 szt./m², 100 szt./pal.
48. [Porotherm 38 DRYFIX](https://www.dachpro.pl/pl/p/Pustak-Porotherm-38-DRYFIX/16280) — DachPro — 380×248×249, ok. 17 kg, 16 szt./m², 1 puszka na ok. 5 m² (dane starsze).
49. [POROTHERM 38 DRYFIX (60 szt./paleta)](https://www.sig.pl/pustak-szlifowany-porotherm-38-dryfix-kl10--380248249-mm-60-sztpaleta,p845880) — SIG — 60 szt./pal. (tylko tytuł z wyszukiwarki, strona nie wczytała się).
50. [Pustak ceramiczny Poroton 24](https://www.budchem.com.pl/pustak-ceramiczny-poroton-24) — Budchem — 240×308×238, 13 szt./m², 72 szt. w pakiecie, „na zamówienie”.
51. [Röben Poroton T24 P+W](https://www.sieradzak.pl/oferta.html?id=413899) — Sieradzak.pl (ogłoszenie z 2016 r., wycofane) — 240×308×238, 12,7 szt./m², 15,7 kg, 72 szt./pal.
52. [THERMOZIEGEL – system pustaków (03/2013)](https://roben.pl/do-pobrania/katalogi/thermoziegel-system.pdf) — Röben — pustak 24: 308×240×238, ok. 15 kg, ok. 14 szt./m², 72 szt./pal., ok. 1100 kg/pal.
53. [Röben – folder Cegły 01/2024](https://ftp.roben.pl/do-pobrania/katalogi/roben-folder-pl-cegly-01-2024.pdf) — Röben — tylko cegły i płytki klinkierowe, bez pustaków.
54. [Röben – About the company](https://en.roben.pl/about-the-company) — Röben Polska — dachówki, klinkier, posadzki; nie wymienia pustaków ściennych.
55. [Dom z cegły 2014](https://roben.pl/do-pobrania/katalogi/dom_z_cegly_2014.pdf) — Röben — w 2014 r. był jeszcze rozdział „Pustak ceramiczny Thermoziegel”.
56. [Porotherm Dryfix – murowanie](https://budujemydom.pl/files/csr/15388-Porotherm_Dryfix_murowanie.pdf) — Wienerberger/budujemydom.pl (starszy) — puszka 750 ml: ok. 5 m² dla ścian 188–440 mm, ok. 10 m² dla 80–115 mm; 38 Dryfix ok. 17 kg.
57. [Kosztorys/nakłady Porotherm (dp06_06_043)](https://budujemydom.pl/files/bfp/dp06_06_043.pdf) — Budujemy Dom — 25 P+W: 10,7 szt. i 0,016 m³ zaprawy na m²; 11.5 P+W: 8 szt. i 0,007 m³.
58. [Porotherm 25 P+W – opis techniczny](https://platformazakupowa.pl/file/get_new/aebe6fed91a3f303741dc14f8f9672fd.pdf) — platformazakupowa.pl — 250/373/238, ok. 18 kg, 10,7 szt./m², 16 l/m², ok. 221 kg/m².
59. [Pustaki ceramiczne – koszt 1 m² ściany](https://muratordom.pl/galeria/kosz-wykonania-1-m2-sciany/gg-BTqN-rMH9-P4LT/gp-554g-dQeW-dx5R) — Murator — Porotherm 25 P+W 10,7 szt./m²; Thermopor 25 P+W 25×37,5×23,8 cm, 10,7; 25 Profi 25×37,3×24,9.
60. [Ile pustaków na m² ściany?](https://kb.pl/aktualnosci/budowa-domu/ile-pustakow-na-m2-sciany/) — KB.pl — 11,5 P+W 8; 30 P+W 16; 38 Dryfix 16; 25 Dryfix 10,7.
61. [Cennik Wienerberger](https://kb.pl/materialy-budowlane/cegly-bloczki-pustaki/cennik-wienerberger-zobacz-ceny-produktow-producenta-m-porothermu/) — KB.pl (12.2023) — 30 P+W 135,20 zł/m², 38 Dryfix 221,60 zł/m².
62. [Cennik pustaków ceramicznych 2026](https://kb.pl/materialy-budowlane/cegly-bloczki-pustaki/cennik-pustakow-ceramicznych-sprawdz-aktualne-ceny/) — KB.pl (07.01.2026) — ceny Leier 8–30 P+W; podaje błędne wymiary (np. 30 P+W 300×250×230), mało wiarygodne.
63. [Jedna dóza zdicí pěny vystačí na 6 m²](https://www.estav.cz/cz/12133.vice-obsahu-mene-odpadu-jedna-doza-zdici-peny-vystaci-na-6-m2-poradne-zdi) — eStav.cz (29.09.2023) — puszka Dryfix 810 ml (dawniej 750 ml), ok. 6 m² muru.
64. [Ile zaprawy na m² muru z Porothermu](https://esitolo.pl/ile-zaprawy-na-m2-muru-z-porothermu) — esitolo.pl — 25 P+W 5,5 kg/m²; wartości sprzeczne z kartami, nie stosować.
65. [Leier Polska S.A. – Archispace](https://www.archispace.com/en/producers/leier-polska-sa) — Archispace — marki THERMOPOR i THERMOPOR PLAN w ofercie.

## C) Podsumowanie liczbowe

- **Źródła:** 65 unikalnych URL. Dwa z nich (sig.pl, rolbud) znam tylko z tytułów wyników wyszukiwania. Bez nich zostaje 63 przeczytanych.
- **Domeny:** 33 różne. Są to: wienerberger.pl, woymar.pl, leier.pl, media.hornbach.at, hoffmanowska.pl, metallco.pl, atexbud.pl, handlobud.sklep.pl, sklep-lubar.pl, e-sklep.rolbud.info, olx.pl, mrowka.com.pl, centrobud.pl, sklep.sewera.pl, gazobeton.pl, leroymerlin.pl, askot.krakow.pl, abud.pl, maldrew.com.pl, realbud.com, dachpro.pl, sig.pl, budchem.com.pl, sieradzak.pl, roben.pl (w tym ftp. i en.), budujemydom.pl, platformazakupowa.pl, muratordom.pl, kb.pl, estav.cz, esitolo.pl, archispace.com.
- **Źródła producentów** (karty, DoP-pokrewne, strony produktowe): wienerberger.pl 12, kopie kart Wienerberger na woymar.pl 3, leier.pl 4, roben.pl 4.

**Najmniej pewne miejsca:**
- masa Thermopor 25 P+W (Leier podaje dwie wartości, 15 i 17 kg);
- zużycie zaprawy dla obu pustaków Leier (Leier nie podaje liczb);
- paleta 30 P+W (80 czy 96) i 38 Dryfix (60 czy 72);
- status Röben Poroton 24.

Te dane najlepiej potwierdzić bezpośrednio: Wienerberger 22 514 20 20, Leier tarnow@leier.pl.

---

## Bloczki betonowe, keramzytobeton i zaprawy

# Raport weryfikacji: bloczki betonowe, keramzytobeton i zaprawy (stan na 31.10.2026)

Żadnych plików nie zmieniałem. Większość wartości w kalkulatorze jest dobra. Trzeba poprawić trzy rzeczy:
- **Masa Leca BLOK fundamentowy 5:** zmienić 19,1 kg na 19,6 kg.
- **Klasa zaprawy do fundamentów:** M10–M15 jest za wysoka. Źródła zalecają zwykle M5–M10, cementową.
- **Klej cienkowarstwowy:** zmienić 1,5 kg/l na 1,6 kg/l. To drobna korekta.

Niepewne zostają: liczba bloczków 38×24×12 na palecie (zależy od producenta) i wydajność zaprawy ciepłochronnej, bo kalkulator jej nie podaje.

Zapis „211 szt./m” w karcie z betomex.koszalin.pl to nie są sztuki na m³. To „11 szt./m²” dla muru 24 cm: przy wyciąganiu tekstu z PDF indeks „2” skleił się z liczbą. Potwierdza to sklep Uciechowski, który podaje 11 szt./m² (mur 24 cm) i 16 szt./m² (mur 38 cm).

## A) Tabela wyników

| Pozycja | Pole | Kalkulator | Według źródeł | Ocena | Proponowana wartość |
|---|---|---|---|---|---|
| 1. Leca BLOK fund. 5 | Wymiary L×T×H | 380×240×240 mm | 240×380×240 (szer.×dł.×wys.), czyli to samo [1][2] | ZGODNE | bez zmian |
| 1 | Spoiny | 10 mm | karta Leca nie podaje; dla zapraw tradycyjnych typowo 10 mm, czasem 10–15 mm [9][17][51] | NIEPEWNE (dopuszczalne) | 10 mm |
| 1 | szt./m² | 11 | 11 szt./m² (mur 24 cm), 16 szt./m² (mur 38 cm) [1][2]; z samej geometrii wychodzi 10,26 | ZGODNE | 11 |
| 1 | szt./paletę | 50 | „ok. 50” [1], 50 [2]; paleta ok. 980 kg [1] | ZGODNE | 50 |
| 1 | kg/szt. | 19,1 | 19–20 kg [1][2]; 980 kg ÷ 50 = 19,6 | DO POPRAWY | 19,6 kg (lub „19–20”) |
| 1 | (informacyjnie) | – | 5 MPa, λ 0,30 W/(m·K), A1, REI 240 [1][2] | – | – |
| 2. Bloczek 38×24×12 B15 | szt./m² (ściana 24 cm, bloczek na płask) | ≈19,7 z wymiarów | 20 [10][12][13][14]. Murator podaje 22 dla muru 24 cm [9] (prawdopodobnie dwa rzędy na rąb). Szarman 16–17 [16] (niewiarygodne) | ZGODNE | 19,7 (ewentualnie zaokrąglać do 20) |
| 2 | kg/szt. | 25 | 25 [10][12][14]; 23 (Prefagbud) [5]; 20–25 [15][16] | ZGODNE | 25 |
| 2 | szt./paletę | 60 | 56 (RAK-BUD) [12][13], 63 (Certus) [10], 72 (Mal-drew) [11], 54–70 [16] | NIEPEWNE (zależy od producenta) | 60 jako średnia, z dopiskiem „56–72 zależnie od producenta” |
| 2 | Klasa | B15 | B15 (Tregor) [6]; najczęściej B20 [8][10]; C12/15–C16/20, ≥15 MPa [9] | ZGODNE | B15 (ewentualnie B15/B20) |
| 3. Zaprawa tradycyjna 25 kg | Litry gotowej zaprawy z worka | 14,5 l | 14,5 (weber ZM5, ZM10) [17][18]; 14 (Baumit MM 50, Atlas) [20][29]; 16 (Holcim Izolbet) [21–24]; ok. 14,7 z przeliczenia [28]; ok. 13 z przeliczenia [26][30] | ZGODNE (zakres 13–16 l) | 14,5 l |
| 4. Zaprawa ciepłochronna | λ tradycyjnej | „ok. 0,8” | 0,80 [20]; 0,82 [17][27][28][30][31][40]; cementowa M10: 1,11 [18] | ZGODNE (dla cementowo‑wapiennej M5) | „ok. 0,8 (cementowa M10 do ok. 1,1)” |
| 4 | λ ciepłochronnej („co najmniej 2× mniej”) | – | 0,16 (LM 21) [36][37]; 0,18 [34]; 0,19 [35]; 0,33 (Greinplast ZC) [32][33] | ZGODNE (2,4–5× mniej) | bez zmian |
| 4 | Wydajność z worka | (nie podana) | Baumit LM 21: 20 kg daje ok. 35 l [36]; Porotherm TM: ok. 40 l z worka ok. 20 kg [38][39]; Greinplast ZC 20 kg: ok. 22 l z przeliczenia [32] | NIEPEWNE | jeśli kalkulator liczy ciepłochronną: ok. 35–40 l z worka 20 kg (lekkie typu LM); dla perlitowych M5 ok. 22 l |
| 5. Klej/zaprawa cienkowarstwowa | kg suchej mieszanki na 1 l spoiny | 1,5 | 1,6 [40]; 1,56 (25 kg daje 16 l) [25]; ok. 1,67 z przeliczenia [41]; nasypowa 1,5 [41] | DO POPRAWY (drobne) | 1,6 kg/l |
| 5 | Typowe zużycie kg/m³ muru | – | 13,3–17,7 (Ytong) [45]; ok. 10 [46]; ok. 10 (H+H, 300 mm) [43]; ok. 17 [41][44] | – | podawać „ok. 10–20 kg/m³” |
| 6. Zaprawa do fundamentów | Klasa | M10–M15 | Holcim ZM‑cM5 (M5) przeznaczona wprost do ścian fundamentowych z bloczków betonowych [21]; weber ZM5 i EXPERT (≥5 MPa) do fundamentów [17][19]; Murator: M3, M5, M8 [52]; przy bloczkach klasy 15 zaprawa najwyżej 10 MPa, poniżej terenu cementowa [51]; ST Płock: marka 3 i 5 [55]; projekt w Suwałkach: M10 przy silikatach 20 MPa [54]; o klasie decyduje projekt [50][56] | DO POPRAWY | „cementowa, M5–M10 (wg projektu); M15 nie jest typowa i nie powinna przewyższać wytrzymałości bloczka” |

## B) Źródła (wszystkie otwarte przez WebFetch)

1. [Karta techniczna Leca BLOK fundamentowy 5](https://betomex.koszalin.pl/wp-content/uploads/2025/06/karta_techniczna_Leca_BLOK_fudamentowy_5.pdf) — Leca Polska (dystrybutor Betomex) — 240×380×240 mm; 19–20 kg; 11 szt./m² (mur 24 cm), 16 szt./m² (38 cm); ok. 50 szt./pal., ok. 980 kg; 5 MPa; λ 0,300.
2. [Bloczek Leca BLOK fundamentowy 5](https://www.uciechowski.com.pl/produkt/bloczek-leca-blok-fundamentowy-5-bloczek-keramzytobetonowy/) — Uciechowski (skład) — 19–20 kg; 11 szt./m² (24 cm), 16 szt./m² (38 cm); 50 szt./pal.; λ 0,30.
3. [Leca BLOK – produkty](https://www.lecadom.pl/leca-blok/produkty) — Leca Polska — produkt jest w ofercie; strona produktu nie dała się otworzyć.
4. [Bloczki fundamentowe z keramzytu](https://muratordom.pl/budowa/fundamenty/bloczki-fundamentowe-z-keramzytu-poznaj-ich-zalety-aa-f5vr-CpnS-2Zkp.html) — Murator — 38×24×24; 5–10 MPa; λ 0,3 (beton 1,5); zaprawa cementowa lub cementowo‑wapienna.
5. [Bloczek betonowy fundamentowy 38×24×12 Prefagbud](https://www.leroymerlin.pl/produkty/bloczek-betonowy-fundamentowy-38-x-24-x-12-cm-prefagbud-45527510.html) — Leroy Merlin — 23 kg; 6,99 zł.
6. [Bloczek betonowy Tregor B15 38×24×12](https://www.castorama.pl/bloczek-betonowy-tregor-klasa-b15-38-x-24-x-12-cm-fundamentowy/5902596213237_CAPL.prd) — Castorama — B15; 6,48 zł.
7. [Cennik bloczków fundamentowych](https://kb.pl/cenniki/produkty/bloczki-fundamentowe/) — KB.pl — 16 ofert 38×24×12 (12,5–15 MPa; M6, B15, B25); 4,88–6,98 zł.
8. [Betonowe bloczki fundamentowe – cena, wymiary, waga](https://kb.pl/budownictwo/fundamenty/betonowe-bloczki-fundamentowe-cena-wymiary-waga-i-inne-porady/) — KB.pl — najczęściej B20, są też B15/B25; waga zwykle do 30 kg.
9. [Bloczki fundamentowe – szybki sposób na fundamenty](https://muratordom.pl/budowa/fundamenty/bloczki-fundamentowe-wymiary-i-ceny-bloczkow-fundamentowych-aa-sRet-KC7N-RQED.html) — Murator — 38×24×12: ok. 11 szt./m² (mur 12 cm), 22 (24 cm), 35 (38 cm); C12/15–C16/20; ≥15 MPa; spoiny 1–1,5 cm.
10. [Bloczek fundamentowy Certus B20 38×24×12](https://gazobeton.pl/bloczek-fundamentowy-certus-pelna-paleta) — Gazobeton.pl — 25 kg; 63 szt./pal.; 1575 kg; 20 szt./m²; B20.
11. [Bloczek fundamentowy 38×24×12, paleta 72 szt.](https://www.maldrew.com.pl/product/bloczek-betonowy-fundamentowy-38x24x12-cm) — Mal-drew — 72 szt./pal.
12. [Bloczki fundamentowe 38×24×12, 25 kg](https://rakbud.com.pl/wyroby-betonowe/bloczki-fundamentowe/) — RAK-BUD (producent) — 25 kg; 56 szt./pal.; 1400 kg; 20 szt./m².
13. [Ile zmieścimy bloczków fundamentowych na palecie?](https://rakbud.com.pl/ile-zmiescimy-bloczkow-fundamentowych-na-palecie/) — RAK-BUD — 38×24×12: 56 szt./pal., 25 kg, 20 szt./m²; 38×24×13: 48 szt./pal., 29 kg.
14. [Jaka jest waga bloczka betonowego?](https://rakbud.com.pl/jaka-jest-waga-bloczka-betonowego/) — RAK-BUD — 25 kg; 56 szt./pal.; 20 szt./m².
15. [Bloczek betonowy waga 38×24×12](https://konkret-beton.pl/bloczek-betonowy-waga) — Konkret-Beton (blog) — 20–25 kg; liczby sztuk na palecie wewnętrznie sprzeczne.
16. [Ile waży bloczek betonowy?](https://szarman.pl/blog/ile-wazy-bloczek-betonowy-kompleksowy-przewodnik-po-masie-i-zastosowaniach/) — Szarman (blog) — 20–25 kg; 54–70 szt./pal. (720–1050 kg); 16–17 szt./m² (wątpliwe).
17. [weber ZM5 – karta](https://www.pl.weber/files/pl/2025-06/printable_sheet_weber_ZM5.pdf) — Saint‑Gobain Weber — 14,5 l z 25 kg; 3,0–3,5 l wody; λ 0,82; M5; wymienia ściany fundamentowe.
18. [weber ZM10 – karta](https://www.pl.weber/files/pl/2025-06/printable_sheet_weber_ZM10.pdf) — Saint‑Gobain Weber — 14,5 l z 25 kg; M10; λ 1,11.
19. [weber EXPERT zaprawa murarska](https://www.pl.weber/files/pl/2025-07/weber_EXPERT_ZAPRAWA_MURARSKA.pdf) — Weber — ≥5 MPa; do ścian fundamentowych.
20. [Baumit MM 50 – karta](https://baumit.pl/files/pl/pdf_files/pds_mm_50__mauermrtel_50_bpl_pl_13282.pdf) — Baumit — ok. 14 l z 25 kg; M5; λ 0,800.
21. [Izolbet ZM‑cM5](https://www.holcim.pl/sites/poland2/files/docs/karta-techniczna-izolbet-zm-cm5.pdf) — Holcim — 16 l z 25 kg; M5; do ścian fundamentowych z bloczków betonowych.
22. [Izolbet ZM‑cwM5](https://www.holcim.pl/sites/poland2/files/docs/karta-techniczna-izolbet-zm-cwm5.pdf) — Holcim — 16 l z 25 kg; M5; nie wymienia fundamentów.
23. [Izolbet ZM‑cwM10](https://www.holcim.pl/sites/poland2/files/docs/karta-techniczna-izolbet-zm-cwm10.pdf) — Holcim — 16 l z 25 kg; M10; elementy podziemne „zgodnie z projektem”.
24. [Izolbet ZMK‑cM15 szara](https://www.holcim.pl/sites/poland2/files/docs/karta-techniczna-izolbet-zmk-cm15-szara_0.pdf) — Holcim — 16 l z 25 kg; M15; zaprawa do klinkieru, nie do fundamentów.
25. [Izolbet ZMC cM10 (cienkowarstwowa)](https://www.holcim.pl/sites/poland2/files/docs/karta-techniczna-izolbet-zmc-cm10.pdf) — Holcim — 16 l z 25 kg (1,56 kg/l); 1,6 kg/m² na 1 mm.
26. [Zaprawa murarska Górażdże – karta](https://www.heidelbergmaterials.pl/sites/default/files/assets/document/kartatechnicznazaprawamurarska.pdf) — Heidelberg Materials — 1,9 kg suchej mieszanki na 1 dm³, czyli ok. 13 l z worka; ≥5 MPa.
27. [Greinplast ZM (2022)](https://www.greinplast.pl/pliki/do_pobrania/produkty/55/zm-kt_06122022.pdf) — Greinplast — M5; λ ≤0,82; nie do fundamentów poniżej poziomu przemakania.
28. [Greinplast ZM (2018)](https://www.greinplast.pl/pliki/do_pobrania/produkty/23/zm-kt_112018.pdf) — Greinplast — 17 kg/m² na 10 mm, czyli ok. 14,7 l z 25 kg; λ ≤0,82.
29. [Zaprawa murarska do klinkieru ATLAS](https://www.atlas.com.pl/wp-content/uploads/2026/08/3a82ceebf1c3f1926e8848c62c17068517972a4f_pl_9050_20251118_095656.pdf) — Atlas — ok. 14 l z 25 kg; M5.
30. [ZK – zaprawa do klinkieru, karta](https://hipper.pl/api/attachment/get/C3095A86-0FCB-46FF-A52A-63855FB53DDB/FileIdent/F0E5B011-8FF1-4261-AF9B-1A26848621F9/Karta_techniczna.pdf) — Hipper (producent nieznany) — 1,92 kg/dm³, czyli ok. 13 l; λ 0,82.
31. [quick‑mix VM 01 T](https://askot.krakow.pl/pl/p/file/5cb30db0a5ec0c77c401346ca879e1e0/karta-techniczna.pdf) — Sievert/quick‑mix (dystrybutor Askot) — M10; λ 0,82 / 0,89.
32. [Greinplast ZC ciepłochronna (2021)](https://www.greinplast.pl/pliki/do_pobrania/produkty/40/zc-kt_022021.pdf) — Greinplast — worek 20 kg; 11–12 l wody; 1,4 kg/dm³ (ok. 22 l z przeliczenia); λ ≤0,33; M5, typ L.
33. [Greinplast ZC (2022)](https://www.greinplast.pl/pliki/do_pobrania/produkty/55/zc-kt_06122022.pdf) — Greinplast — te same wartości (λ 0,33/0,36).
34. [Zaprawy murarskie ciepłochronne](https://muratordom.pl/budowa/sciany-murowane/zaprawy-murarskie-cieplochronne-czyli-murowanie-na-cieplo-aa-gR9p-56UW-znf9.html) — Murator — tradycyjna ok. 0,8; ciepłochronna co najmniej 2× mniej, nawet 0,18.
35. [Dopasowanie zaprawy do pustaków i bloczków](https://muratordom.pl/budowa/sciany-murowane/dopasowanie-zaprawy-murarskiej-do-rodzaju-pustakow-i-bloczkow-aa-oVUq-7tnr-Y26y.html) — Murator — perlitowa λ 0,19, spoina 1,2 cm; pod pierwszą warstwę mocniejsza zaprawa cementowa.
36. [Baumit LeichtMauermörtel LM 21](https://baustoffshop.de/media/pdf/baumit/PDBL_LeichtMauermoertel_LM_21.pdf) — Baumit DE — 20 kg daje ok. 35 l; λ ≤0,16; M5; ≤0,7 kg/dm³.
37. [Sakret LM 21 – DoP](https://techdocs.sakret.de/documents/le-sakret-pai-leichtmauermoertel-lm-21-de-2022-07-21.pdf) — Sakret — λ ≤0,16 / 0,17; M5.
38. [Porotherm TM 40 l](https://masterhaus.bg/en/product/7269-mortar-solution-porotherm-tm-40l) — Masterhaus (BG) — 40 l z ok. 20 kg; ok. 650 kg/m³.
39. [Nowe opakowanie zaprawy Porotherm TM](https://www.tzb-info.cz/104499-nove-baleni-malty-porotherm-tm-usnadni-manipulaci) — TZB‑info (CZ) — 40 l świeżej zaprawy; spoina do 12 mm.
40. [Tytan MUR 2‑10 – karta](https://tytan-cdn.tytan.com/uploads/sites/53/2025/10/TYTAN20PROFESSIONAL20Cienkowarstwowa20Zaprawa20Murarska20MUR202-10_15-09-2025_TDS_pl-4.pdf) — Selena/Tytan — 1,6 kg/m² na 1 mm (1,6 kg/dm³); M10; λ 0,82 (biała) / 0,61 (szara).
41. [Atlas Silmur – karta](https://new.bricomarche.pl/products/files/26/264323/kt-silmur-m-kt.pdf) — Atlas (przez Bricomarché) — ściana 24 cm: 4 kg/m² przy spoinie 2 mm (ok. 1,67 kg/dm³, ok. 17 kg/m³); nasypowa 1,5 kg/dm³.
42. [Atlas Silmur – atlas.com.pl](https://www.atlas.com.pl/wp-content/uploads/2026/08/603d74ddbd23645425c6f71193f361398cc841c6_pl_1934_20250805_104954.pdf) — Atlas — M5–M15; 2–6 kg/m²; spoina 2–10 mm.
43. [H+H cienkowarstwowa zaprawa klejąca](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/03-karty-techniczne-2/zaprawy/karta-techniczna---hh-cienkowarstwowa-biaa-zaprawa-klejaca.pdf) — H+H Polska — 3,0 kg/m² dla muru 300 mm (ok. 10 kg/m³); λ ≤0,47.
44. [BOLIX M10 szara](https://bolix.pl/wp-content/uploads/2022/10/BOLIX-M10-Szara.pdf) — Bolix — 4 kg/m² dla muru 24 cm, spoina 3 mm; λ ≤0,83.
45. [Klej do Ytonga](https://kb.pl/porady/klej-do-ytonga-rodzaje-ceny-opinie-porady-praktyczne) — KB.pl — Ytong‑Silka: 13,3–17,7 kg/m³ muru.
46. [Zaprawa tradycyjna czy cienkowarstwowa](https://muratordom.pl/budowa/sciany-murowane/zaprawa-tradycyjna-czy-cienkowarstwowa-jak-murowac-z-betonu-komorkowego-aa-4eKK-GzxX-rwnG.html) — Murator — cienkowarstwowa 2,4 kg/m² (24 cm, ok. 10 kg/m³); tradycyjna 24 dm³/m².
47. [Murowanie na cienkie spoiny](https://muratordom.pl/budowa/sciany-murowane/murowanie-na-cienkie-spoiny-bez-tajemnic-dowiedz-sie-jak-szybko-i-dobrze-murowac-aa-Z1ED-XiAt-LE4R.html) — Murator — spoiny cienkie 1–3 mm, tradycyjne 1–1,5 cm.
48. [Zaprawa murarska – rodzaje, wydajność](https://kb.pl/porady/zaprawa-murarska-rodzaje-ceny-opinie-wydajnosc-popularne-marki/) — KB.pl — DIALL ok. 13 dm³ z 25 kg; do fundamentów wskazuje M2/M7 (słabe źródło).
49. [Kreisel MURLEP‑B 128 M10 (karta charakterystyki)](https://media.adeo.com/media/5759747/media.pdf) — Kreisel/Adeo — zaprawa cienkowarstwowa M10; brak danych o wydajności.
50. [Na co zwracać uwagę przy zakupie zaprawy murarskiej](https://www.gov.pl/web/gunb/na-co-zwracac-uwage-przy-zakupie-zaprawy-murarskiej) — GUNB — klasy M2,5/M5/M10; parametry określa projekt; zbyt mocna zaprawa szkodzi.
51. [Fundamenty murowane](https://muratordom.pl/budowa/fundamenty/fundamenty-murowane-z-czego-zrobic-sciany-fundamentowe-murowane-aa-Hp8c-y5wz-PR6p.html) — Murator — pod ziemią zaprawa cementowa; przy bloczkach klasy 15 zaprawa najwyżej 10 MPa.
52. [Jaka gotowa zaprawa do fundamentów](https://muratordom.pl/budowa/sciany-murowane/jaka-zaprawa-gotowa-do-fundamentow-jaka-do-scian-nosnych-poradnik-aa-JJ5r-ks8e-5sbv.html) — Murator — do fundamentów M3, M5, M8; nie mocniejsza od elementu murowego.
53. [Ściany fundamentowe i ściany piwnic](https://muratordom.pl/budowa/fundamenty/sciany-fundamentowe-i-sciany-piwnic-aa-dMoh-NfTJ-9J2R.html) — Murator — klasy nie podaje; cokół min. 15 cm nad terenem.
54. [Projekt konstrukcji (BIP Suwałki)](https://bip.um.suwalki.pl/resource/126814/53753/konstrukcja.pdf) — UM Suwałki — ściany fundamentowe z silikatów ≥20 MPa na zaprawie cementowej M10.
55. [ST 1.5 Roboty murowe (BIP Płock)](https://nowybip.plock.eu/zp/5180/Specyfikacje/branża%20arch.-bud/ST.1.5.Roboty_murowe%20ok.pdf) — UM Płock — dla fundamentów zaprawy marki 3 i 5.
56. [ST Roboty murarskie (BIP Słupno)](https://ugslupno.bip.org.pl/pliki/ugslupno/roboty_murarskie.pdf) — UG Słupno — markę zaprawy określa projekt; ściany piwnic z bloczków M6.
57. [Baumit MM 100 (karta charakterystyki)](https://baumit.pl/files/pl/pdf_files/pdbl_mm_100.pdf) — Baumit — zaprawa cementowo‑wapienna; gęstość suchej 1,55–1,75 g/cm³; brak danych o wydajności.
58. [Z czego zrobione są bloczki fundamentowe](https://www.zbudujsamdom.pl/z-czego-zrobione-sa-bloczki-fundamentowe-i-ich-wlasciwosci-budowa-domu-2025/) — Zbuduj Sam Dom — wytrzymałość do 15 MPa; brak wag.

Wartości z dopiskiem „z przeliczenia” liczyłem sam z gęstości lub zużycia podanego w karcie, producent ich wprost nie podaje.

Tych stron nie udało się otworzyć: strona produktu na lecadom.pl, betard.pl, poradnik Wienerberger (PDF), budujemydom.pl, kilka ofert Porotherm TM w polskich sklepach (dom.money.pl, betterial.pl, budownictwob2b.pl), olx.pl. Waga polskiego worka Porotherm TM (22 kg) pojawia się tylko w tytułach wyników wyszukiwania i nie jest potwierdzona.

## C) Podsumowanie liczbowe

- **58 unikalnych źródeł**, wszystkie otwarte przez WebFetch.
- **34 unikalne domeny:** betomex.koszalin.pl, uciechowski.com.pl, lecadom.pl, muratordom.pl, leroymerlin.pl, castorama.pl, kb.pl, gazobeton.pl, maldrew.com.pl, rakbud.com.pl, konkret-beton.pl, szarman.pl, pl.weber, baumit.pl, holcim.pl, heidelbergmaterials.pl, greinplast.pl, atlas.com.pl, hipper.pl, askot.krakow.pl, baustoffshop.de, techdocs.sakret.de, masterhaus.bg, tzb-info.cz, tytan-cdn.tytan.com, new.bricomarche.pl, edge.sitecorecloud.io (H+H), bolix.pl, media.adeo.com, gov.pl, bip.um.suwalki.pl, nowybip.plock.eu, ugslupno.bip.org.pl, zbudujsamdom.pl.

---

## Otwory, nadproża, filarki

# Raport: otwory okienne i drzwiowe w kalkulatorze „Ile bloczków na ściany”

**Najważniejsze w skrócie:**
- **Oparcie 12,5 cm** jest poprawną wartością domyślną tylko dla części nadproży: ceramicznych Porotherm przy otworze do 1,5 m, krótkich L19 i belek H+H Gold+. Nadproża z betonu komórkowego (Ytong YN/YF, Termalica TNN, H+H Tempo) wymagają 20–25 cm.
- **Wysokość 12 cm** pasuje tylko do płaskich belek z betonu komórkowego (12,4–12,5 cm). Powinna zależeć od wybranego typu nadproża.
- **Warunki techniczne:** rozporządzenie z 2002 r. utraciło moc 20.09.2026, a nowego nie ogłoszono (stan na 27.10.2026). Dawne przepisy wolno stosować przez 18 miesięcy na podstawie Dz.U. 2026 poz. 1161.

Zebrałem 65 źródeł z 37 domen. Limit wyszukiwań się wyczerpał, więc trzech rzeczy nie udało się potwierdzić: kart nadproży Leier, Solbet i Silka oraz poradnikowej wartości „min. 0,6 m” dla filarka. Jeśli chcesz, mogę dosprawdzić je w kolejnej wiadomości. Niczego nie zmieniałem w plikach.

---

## A) Ustalenia

### 1. Oparcie i wysokość nadproży

Dwie dane z polecenia są błędne:
- **„Porotherm 23,8 = 7,1 cm”.** Porotherm 23,8 to belka 7 × 23,8 cm, stawiana na sztorc. Wysokość 7,1 cm ma Porotherm 11,5 (przekrój 11,5 × 7,1 cm) [2][1][4].
- **„Ytong NZ”.** Nie znalazłem takiego oznaczenia. Wysokość 12,4 cm mają belki płaskie Ytong YF/PSF [63], a YN mają 24,9 cm [64].

| Typ nadproża | Wysokość | Minimalne oparcie z każdej strony | Pewność |
|---|---|---|---|
| Porotherm 23,8 (7 × 23,8 cm, dł. 100–325 cm) | 23,8 cm | 12,5 cm przy otworze do 1,5 m; 20 cm przy 1,5–1,85 m; 25 cm powyżej 1,85 m | wysoka [2][1] |
| Porotherm 11,5 (11,5 × 7,1 cm, dł. 75–300 cm), wymaga nadmurowania strefy ściskanej | 7,1 cm | 12 cm (karta czeska KP 11,5). W Chorwacji długość belki minus otwór to stałe 25 cm, czyli 12,5 cm na stronę | średnia [4][5][16] |
| Ytong YN (samonośne, otwory do 175 cm) | 24,9 cm | 20 lub 25 cm | wysoka [6][7][64] |
| Ytong YF (zespolone, otwory do 250 cm) | 12,4 cm | 20 lub 25 cm | wysoka [6][7][63] |
| Ytong YD (tylko ścianki działowe 7,5–10 cm, otwór do 102 cm) | – | 11,5 cm | wysoka [7] |
| H+H Gold+ belka (szer. 11,5 lub 17,5 cm) | 12,5 cm | ≥ 11,5 cm (otwór 1,02–2,77 m) | wysoka [8] |
| H+H Tempo PRO N (szer. 7,5 lub 10 cm) | 25 cm | ≥ 20 cm (otwór do 1,10 m) | wysoka [9] |
| Termalica TNN | 24,9 cm | 20 cm przy belce 120–140 cm; 25 cm przy belce 170–230 cm | wysoka [11] |
| L19 (H 190 mm, stopka 90 mm, dł. 90–330 cm) | 19 cm | Ginter: 10 / 12 / 14 cm (belki 0,9–1,5 / 1,8–2,4 / 2,7–3,0 m). Stropex: 11 / 13 cm. Drogbud: min. 10 cm. Podpora montażowa przy rozpiętości > 1,8 m, wypełnienie betonem ≥ C20/25 | wysoka [12][13][14][15] |
| Kształtki U / nadproże wylewane | 24 cm (bk) lub wg projektu | 25 cm | średnia [21][19][7] |
| Silka | – | Nie znalazłem prefabrykowanych nadproży silikatowych w Polsce. W ścianach z Silki stosuje się kształtki U i nadproża monolityczne | niska [7][10] |
| Solbet | – | brak danych | – |

Dodatkowe ustalenia:
- **Eurokod 6.** Wymaga oparcia nadproży zespolonych ≥ 100 mm. Wartość 90 mm dotyczy oparcia pod obciążenie skupione [23]. Wielka Brytania (NHBC) dla porównania: 100 mm przy rozpiętości do 1,2 m, 150 mm powyżej [25].
- **Wartość „ok. 9 cm” z Muratora** [18][29] przeczy kartom producentów. Nie należy jej używać.
- **Gniazdo z cegły ≥ 15 cm** z każdej strony robi się, gdy poziom nadproża nie wypada na wielokrotności wysokości warstwy [31].
- **Wysokość:** jedna domyślna wysokość „12 cm” nie ma sensu, bo realne wartości to 7,1 / 12,4–12,5 / 19 / 23,8 / 24,9–25 cm.

### 2. Filarek międzyokienny i odległość otworu od naroża

Żadna norma ani producent nie podaje jednej minimalnej szerokości filarka ani minimalnej odległości od naroża (pewność średnia–wysoka, bo przeszukałem karty Wienerbergera, Xelli, H+H i Solbetu). Z norm wynikają natomiast twarde ograniczenia:

- **Minimalne pole przekroju ściany nośnej: 0,04 m² netto** [23]. Szerokość filarka musi więc być co najmniej 0,04/t:
  - 16 cm przy t = 25 cm,
  - 13,3 cm przy t = 30 cm,
  - 11 cm przy t = 36,5 cm,
  - 9 cm przy t = 44 cm.
- **Przy polu < 0,1 m²** wytrzymałość mnoży się przez (0,7 + 3A) [23]. Polski załącznik krajowy zamiast tego stosuje współczynnik Rd aż do 0,3 m²: Rd = 2,00 przy 0,04 m², 1,37 przy 0,1 m², 1,25 przy 0,2 m², 1,00 przy 0,3 m² [24].
- **Bruzdy w PN-EN 1996-1-1:** bruzda pionowa ≥ 225 mm od otworu, bruzda pozioma ≥ 0,5 m od otworu [22][23].
- **Warunki praktyczne:**
  - Filarek musi pomieścić oparcia obu sąsiednich nadproży (np. 12,5 + 12,5 cm lub 20 + 20 cm).
  - Element przy krawędzi otworu lub w narożu musi mieć ≥ 11,5 cm długości (Ytong) [7].
  - Przesunięcie spoin pionowych: ≥ 8 cm (Ytong) [7], ≥ 10 cm (Porotherm Dryfix) [28].
- **PN-B-03002** jest wycofana. Nie znalazłem z niej wartości liczbowej.
- **Wartości poradnikowe „0,6 m” i „1 element”:** nie potwierdziłem ich w żadnym źródle (pewność niska).

### 3. Typowe otwory i parapety

**Luz montażowy okna:** otwór jest szerszy od okna o 3–6 cm i wyższy o 6–9 cm [36][38]. Przykład: otwór 151 cm na ościeżnicę 146–147 cm [37].

**Okna.** Typowe rozmiary to 120×150, 150×150 i 180×150 cm [37]. Katalogowe okna mają 865 / 1165 / 1465 mm szerokości i 1135 / 1435 mm wysokości [38].

**Drzwi balkonowe** [38][39]:
- jednoskrzydłowe: ok. 865–870 × 2095–2310 mm,
- dwuskrzydłowe: 1465–1765 × 2095–2295 mm,
- przesuwne HST: 2000–6000 × 2000–2500 mm.

**Drzwi zewnętrzne:**
- Prawo: światło ościeżnicy ≥ 0,9 × 2,0 m, próg ≤ 2 cm (§ 62) [44][48].
- Skrzydło 90 cm wymaga otworu ok. 103 × 213 cm [34]. Luz to ok. 3 cm po bokach i 5 cm na wysokość [35]. Typowe skrzydła mają 90–100 cm [61].

**Drzwi wewnętrzne.** Pokoje i kuchnia wymagają światła ≥ 0,8 × 2,0 m (§ 75) [47]. Otwór wg Porty, z wysokością liczoną od **wykończonej posadzki** [33]:

| Drzwi | Ościeżnica regulowana | Ościeżnica kątowa (mała/duża) |
|---|---|---|
| 60 | 70 × 207 | 67,5 × 205,5 |
| 70 | 80 × 207 | 75–77,5 × 205,5 |
| 80 | 90 × 207 | 85–87,5 × 205,5 |
| 90 | 100 × 207 | 95–97,5 × 205,5 |
| 100 | 110 × 207 | 105–107,5 × 205,5 |

Classen dla drzwi 90 podaje 98 × 206 cm (regulowana) i 101 × 207,5 cm (stała) [34]. Pewność wysoka.

**Bramy garażowe:**
- Najpopularniejsze: 200–250 × 212,5–225 cm. Przykłady Hörmann: 2250×2125, 2375×1875; garaże dwustanowiskowe 5000×2125 i 5000×2250 [41].
- Wiśniowski Nobla 2500×2125 [43]. Wymiar zamówieniowy to otwór (So × Ho). Wymagane nadproże nad bramą ≥ 200 mm, miejsce z boku ≥ 110 mm [42].

**Parapety:**
- Sypialnie: 85 cm. Pokoje dzienne: 30–60 cm [37].
- Kuchnia: 105–125 cm nad zlewem [36], co najmniej 85 cm nad szafkami [40].
- Prawo (§ 301): podokiennik ≥ 0,85 m na kondygnacjach poniżej 25 m, ≥ 1,1 m powyżej. Parter jest zwolniony. Wymóg można obniżyć przy balustradzie albo przy nieotwieranej części okna z bezpiecznym szkłem [46].
- Balustrady (§ 298): 0,9 m w domach jednorodzinnych, 1,1 m w pozostałych budynkach [45].
- Oświetlenie dzienne: okna ≥ 1:8 powierzchni podłogi (§ 57) [44].

**Stan prawny w październiku 2026** (pewność wysoka):
- Rozporządzenie WT z 2002 r. (t.j. Dz.U. 2022 poz. 1225) utraciło moc z dniem 20.09.2026 [56][55].
- Nowe WT (projekt z 6.08.2026, w notyfikacji TRIS) nie zostały ogłoszone. Potwierdzają to źródła z 4.10, 23.10 i 27.10.2026 [53][52][55].
- Ustawa z 31.07.2026 (Dz.U. 2026 poz. 1161, rozdział 10a „Przepisy epizodyczne”, art. 102a–102c Prawa budowlanego) obowiązuje od 2.09.2026 [49][51].
- Dawne przepisy można stosować przez 18 miesięcy od 20.09.2026, czyli do ok. 20.03.2028, po złożeniu oświadczenia inwestora [49][52].

### 4. Moduł elementów murowych
- **Ceramika:** moduł wysokości 25 cm, szerokości 12,5 cm [29]. Długości Porotherm to 248 / 373 / 498 mm, wysokość 249 mm (Dryfix/Profi) lub 238 mm (P+W) [2][27].
- **Elementy uzupełniające Porotherm:** połówki ½ (np. 124 mm długości dla 30/38/44) i ¾ (R) do naroży i ościeży [28][26]. Porotherm 25 3×1/3 rozbija się na trzy części do ościeży i pod parapet [26][27]. Producent zaleca nie zostawiać w ościeżu powierzchni po cięciu [26].
- **Silikaty H+H:** moduł długości 250 mm, połówki 1/2 [30]. Przy docinaniu trzeba odjąć grubość spoiny [30].
- **Ytong:** bloczki 599 × 199 mm, Silka 333 × 199 mm [7]. Nadproża mają długości co 25 cm [6]. Gdy rozstaw między narożami nie jest wielokrotnością długości bloczka, wstawia się docięty element [7].
- **Porotherm:** długości nadproży też co 25 cm [2].

### 5. Kosztorys (tylko informacyjnie)
- **KNR 2-02:**
  - od powierzchni ścian odejmuje się otwory okienne i drzwiowe większe niż 0,5 m² [57][58],
  - nadproży prefabrykowanych się nie odlicza (liczy się je w metrach długości),
  - elementy żelbetowe zajmujące ponad połowę grubości ściany się odlicza,
  - filarki do 2½ cegły liczy się w metrach wysokości [57].
- **KNR K-30 (Wienerberger):** odlicza się otwory i wnęki > 0,025 m³ [59].
- **KNR K-50 (Silka Tempo):** odlicza się otwory i wnęki ≥ 0,05 m³ [60].
- Przy liczeniu zużycia bloczków należy odejmować każdy otwór. Reguły KNR dotyczą wyceny robocizny.

### Propozycja dla kalkulatora

**Gotowe ustawienia nadproży** (typ → wysokość / oparcie):

| Typ | Wysokość | Oparcie |
|---|---|---|
| Porotherm 23,8 | 23,8 cm | 12,5 cm; 20 cm przy otworze > 150 cm; 25 cm przy > 185 cm |
| Porotherm 11,5 | 7,1 cm (+ strefa nadmurowania) | 12,5 cm |
| L19 | 19 cm | 10 cm; 12 cm przy otworze > 150 cm; 14 cm przy > 240 cm |
| H+H Gold+ | 12,5 cm | 11,5 cm |
| Ytong YF | 12,4 cm | 20 cm; 25 cm przy otworze > 150 cm |
| Ytong YN / Termalica TNN / H+H Tempo | 24,9–25 cm | 20 cm; 25 cm przy otworze > 120–150 cm |
| Kształtka U / wylewane | 1 warstwa elementu | 25 cm |

Progi 150 cm przy Ytongu i 120–150 cm przy YN/TNN są moim uproszczeniem: karty podają 20 lub 25 cm zależnie od rozpiętości, a TNN przechodzi na 25 cm przy belce 1,7 m (otwór 1,2 m). Jeśli kalkulator ma zostać przy jednej wartości domyślnej, proponuję oparcie 12,5 cm z ostrzeżeniem dla betonu komórkowego. Wysokość domyślną lepiej uzależnić od typu, np. 19 cm (L19), zamiast 12 cm.

**Ostrzeżenia:**

| Poziom | Warunek | Komunikat / uwagi |
|---|---|---|
| Błąd | oparcie < 10 cm | – |
| Ostrzeżenie | oparcie < wartość producenta | – |
| Błąd | filarek < suma oparć sąsiednich nadproży | nadproża się nakładają |
| Błąd | odległość od naroża < oparcie | nadproże nie ma na czym się oprzeć |
| Błąd | filarek < 0,04/t | poniżej minimum EC6 |
| Ostrzeżenie | filarek < 0,1/t | ok. 40 cm przy t = 25 cm; „nośność obniżona, sprawdzenie przez konstruktora” |
| Informacja | filarek < 0,3/t | polski współczynnik Rd |
| Ostrzeżenie | odległość od naroża < oparcie + 11,5 cm | moja propozycja; bez potwierdzenia w źródle |
| Ostrzeżenie | parapet < 85 cm na piętrze bez balustrady | „parter zwolniony” |
| Informacja | parapet < 85 cm na parterze | – |
| Informacja | wymiar nie jest wielokrotnością modułu | 12,5 cm ceramika / 25 cm silikat; połówka bloczka Ytong; „wymaga docinania” |
| Ostrzeżenie | nadproże bramy < 20 cm | – |

**Domyślny parapet:** 85 cm. Wysokości drzwi z tabel są liczone od wykończonej posadzki. W murze trzeba doliczyć grubość warstw posadzki, której nie znalazłem w źródłach.

---

## B) Źródła
1. [Ceramiczne nadproże w ścianie jednowarstwowej](https://muratordom.pl/budowa/sciany-murowane/ceramiczne-nadproze-w-scianie-jednowarstwowej-solidne-i-bez-mostkow-termicznych-aa-gsNb-UCKH-JqXt.html) — Murator — belka 23,8: 7×23,8 cm, dł. 75–325 cm; oparcie 12,5 / 20 / 25 cm (do 1,5 m / 1,5–1,85 m / >1,85 m)
2. [Porotherm 2018 – wytyczne projekt wykonawczy](https://budujemydom.pl/files/amt/15393-Porotherm_2018_wytyczne_projekt_wykonawcze.pdf) — Wienerberger — 23,8: 70×238 mm, 1000–3250 co 250 mm; 11,5: 115×71 mm, 750–3000 mm; oparcie 125/200/250 mm; elementy 248/373/498 × 249/238 mm
3. ~~(pominięte)~~ – brak; numeracja ciągła poniżej
4. [Porotherm KP 11,5 – technický list](https://www.izomat.cz/out/media/TL_PTH_KP_115-145-ppn14_5b0e83e642f17.pdf) — Wienerberger CZ — wys. 71 mm; oparcie ≥ 120 mm; zaprawa ≥ 2,5 MPa, beton ≥ C12/15
5. [Porotherm nadvoji – tehnički listovi](https://www.wienerberger.hr/content/dam/wienerberger/croatia/marketing/documents-magazines/technical/tehnicki-listovi/HR_MKT_TEC_WAL_POR_Nadvoji_Tehnički%20listovi.pdf) — Wienerberger HR — długość belki minus otwór = 25 cm (np. 200 → 175 cm)
6. [Ulotka Nadproża YTONG 03/2012](https://budujemydom.pl/files/dkr/12700-Ulotka_Nadproza_YTONG-03-2012.pdf) — Xella — YN do 175 cm, YF do 250 cm; oparcie 20 lub 25 cm
7. [Poradnik murowanie Ytong 11/2015](https://budujemydom.pl/files/ewi/12688-Poradnik-murowanie-Ytong-11-2015.pdf) — Xella — YD oparcie 11,5 cm, otwór ≤ 102 cm; element przy krawędzi ≥ 11,5 cm; przesunięcie spoin ≥ 8 cm; U-kształtki w ścianach z Silki
8. [Karta techniczna H+H Gold+ belka nadprożowa](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/produkty-pdf/beton---belki-nadprozowe/karta-techniczna--hh-gold-belka-nadprozowa.pdf) — H+H — wys. 125 mm, szer. 115/175 mm; oparcie ≥ 115 mm; otwór 1,02–2,77 m
9. [Karta techniczna H+H Tempo PRO N](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/system-tempo-pro-2025/karta-techniczna--hh-gold-nadproze-tempo-pro-n.pdf) — H+H — 1500×75/100×250 mm; oparcie ≥ 200 mm; otwór ≤ 1,10 m
10. [Karta techniczna H+H Silikat U](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/produkty-pdf/silikaty---produkty-uzupelniajace/12-karta-techniczna--hh-silikat-u.pdf) — H+H — kształtka U 220×240/250×220–250 mm, szalunek tracony
11. [DWU 66/BKTA/2019 belka Termalica TNN](https://termalica.pl/wp-content/uploads/2019/dwu-pl/dwu-nr-66-bkta-2019-belka-nadprozowa-termalica-tnn.pdf) — Termalica — wys. 249 mm; oparcie 200 mm (belka 1,2–1,4 m) / 250 mm (1,7–2,3 m); światło 0,8–1,8 m
12. [Instrukcja montażu belek Ginter L19](https://ginter.pl/wp-content/uploads/2019/08/103_instrukcja_montazu_nadprozy_l19.pdf) — Ginter — oparcie 10 / 12 / 14 cm; podpora przy > 1,80 m; beton ≥ C20/25
13. [Belki nadprożowe L-19](https://drogbud.pl/produkty/elementy-budowlane-scienne-i-szamba/belki-nadprozowe-l-19/) — Drogbud — oparcie ≥ 10 cm; dł. 120–300 cm; stopka 90 mm
14. [Belki nadprożowe L19](https://stropex.com.pl/belki-nadprozowe-l19/) — Stropex — oparcie 11 cm (do 2,4 m) / 13 cm (2,7–3,0 m)
15. [Nadproża L19](https://www.betonbest.pl/belki-nadprozowe-25) — Betonbest — H = 190 mm, A = 90 mm; dł. 1200–3300 mm
16. [Nadproża – rodzaje, ceny](https://kb.pl/aktualnosci/budowa-domu/nadproza-rodzaje-ceny-opinie-_z/) — KB.pl — Porotherm 11,5: wys. 7,1 cm; Ytong YN oparcie 20 cm; L19 dł. 0,9–9,5 m
17. [Nadproża betonowe – rodzaje i ceny](https://kb.pl/aktualnosci/budowa-domu/nadproza-beronowe-rodzaje-i-ceny-_z/) — KB.pl — długości L19 120–300 cm, H+H 125–300 cm (bez danych o oparciu)
18. [Wieńce i nadproża…](https://muratordom.pl/budowa/sciany-murowane/wience-i-nadproza-betonowe-gotowe-prefabrykowane-jakie-wybrac-i-jak-je-murowac-aa-Qdja-67ND-JrnR.html) — Murator — oparcie „≥ 9 cm” (sprzeczne z kartami); otwory > 2,7 m tylko monolit
19. [Nadproża ceramiczne i z betonu komórkowego](https://muratordom.pl/budowa/sciany-murowane/nadproza-ceramiczne-i-z-betonu-komorkowego-wady-i-zalety-aa-7pTS-cYYZ-1SQk.html) — Murator — belki bk 12×24 / 18×24 cm; U-kształtki 24–42 × 24 cm, dł. 50 cm
20. [Nadproże żelbetowe – monolityczne i prefabrykowane](https://muratordom.pl/budowa/sciany-murowane/nadproza-zelbetowe-nadproza-monolityczne-i-nadproza-prefabrykowane-aa-wt3t-f6ot-5A7f.html) — Murator — L-19 dł. 90–330 cm
21. [Na co zwrócić uwagę przy wyborze nadproży](https://inzynierbudownictwa.pl/technika,materialy_i_technologie,artykul,na_co_zwrocic_uwage_przy_wyborze_nadprozy,5147) — Inżynier Budownictwa — oparcie U 25 cm; SBN 72/120 × 115 mm
22. [Wykonywanie bruzd i wnęk…](https://inzynierbudownictwa.pl/?p=9815) — Inżynier Budownictwa — PN-EN 1996-1-1: bruzda ≥ 225 mm od otworu; pozioma ≥ 0,5 m; suma bruzd ≤ 0,13 długości ściany
23. [EN 1996-1-1 overview (Pluijm)](https://eurocodes.jrc.ec.europa.eu/sites/default/files/2022-06/2_6_Pluijm.pdf) — JRC Komisja Europejska — min. pole ściany nośnej 0,04 m²; (0,7 + 3A) przy A < 0,1 m²; oparcie nadproży zespolonych ≥ 100 mm; oparcie pod siłą skupioną ≥ 90 mm
24. [Stosowanie metod uproszczonych wg EC6](https://ph.pollub.pl/index.php/bia/article/download/1982/1639/5930) — Politechnika Lubelska — Rd 2,00 / 1,37 / 1,25 / 1,00 dla 0,04 / 0,1 / 0,2 / 0,3 m²; warunki PN-EN 1996-3
25. [NHBC 6.1.12 Lintels](https://nhbc-standards.co.uk/6-superstructure-excluding-roofs/6-1-external-masonry-walls/6-1-12-lintels/) — NHBC (UK) — oparcie 100 mm (≤ 1,2 m) / 150 mm
26. [Systemowe pustaki Porotherm do zadań specjalnych](https://www.wienerberger.pl/o-nas/biuro-prasowe/systemowe-pustaki-porotherm-do-zada-specjalnych.html) — Wienerberger — połówki ½, ¾ R, 3×1/3 do ościeży i parapetów
27. [Porotherm 25 P+W](https://www.wienerberger.pl/produkty/pustaki-ceramiczne-i-akcesoria-porotherm/pustaki-ceramiczne-porotherm/porotherm-25-p-w.html) — Wienerberger — 250×373×238 mm; 10,7 szt./m²
28. [Porotherm Dryfix – murowanie](https://budujemydom.pl/files/csr/15388-Porotherm_Dryfix_murowanie.pdf) — Wienerberger — połówki 124 mm; przewiązanie ≥ 10 cm
29. [Jak murować z poryzowanych pustaków](https://muratordom.pl/budowa/sciany-murowane/jak-murowac-sciany-z-poryzowanych-pustakow-ceramicznych-poznaj-zasady-murowania-aa-hdqA-j7b9-a2sE.html) — Murator — moduł 25 cm (wysokość) / 12,5 cm (szerokość); spoina ≤ 12 mm
30. [Jak uniknąć docięć… silikaty](https://inzynierbudownictwa.pl/jak-uniknac-dociec-przy-wznoszeniu-przegrod-murowych-z-silikatow) — Inżynier Budownictwa / H+H — moduł 250 mm; połówki 90–120 × 180–250 × 220 mm
31. [Stan surowy – ściany](https://budujemydom.pl/files/iks/sciany_dp.pdf) — Budujemy Dom — gniazdo pod nadproże ≥ 15 cm z każdej strony
32. [Filarek międzyokienny](https://zawodowe.edu.pl/wiki/bud-12/filarek-miedzyokienny/) — zawodowe.edu.pl — 1 / 1,5 / 2 / 2,5 cegły = ok. 25 / 38 / 51 / 64 cm
33. [Katalog Porta 2015 – otwory montażowe](https://www2.porta.com.pl/data/download//Katalog_2015-1_POL_190-196.pdf) — Porta — drzwi 60–100: otwór 700–1100 × 2070 (regulowana); 675–1075 × 2055 (kątowa)
34. [Jaki powinien być otwór pod drzwi 90](https://classen.pl/en/blog/jaki-powinien-byc-otwor-pod-drzwi-90/) — Classen — 101×207,5 (stała); 98×206 (regulowana); zewnętrzne 103×213 cm
35. [Drzwi zewnętrzne – wymiary](https://muratordom.pl/budowa/drzwi/drzwi-zewnetrzne-wymiary-co-oznaczaja-liczby-opisujace-drzwi-wejsciowe-do-domu-jaki-powinien-byc-otwor-pod-drzwi-zewnetrzne-aa-phoe-W6MP-xHUn.html) — Murator — światło ≥ 90×200 cm; luz ok. 3 cm po bokach, 5 cm w pionie
36. [Otwory na okna i drzwi](https://muratordom.pl/budowa/okna/otwory-na-okna-i-drzwi-aa-rHTY-KZwU-jLDF.html) — Murator — otwór +4–6 cm szerzej, +7–9 cm wyżej; parapet w kuchni 105–125 cm
37. [Budujemy Dom 6/2009 – okna](https://budujemydom.pl/files/hvy/bd6_09_048_058.pdf) — Budujemy Dom — okna 120/150/180 × 150; otwór 151 cm przy ościeżnicy 146–147 cm; parapet 85 cm, w salonie 30–60 cm
38. [Wymiary okien – standardy](https://muratordom.pl/budowa/okna/wymiary-okien-jakie-sa-standardowe-wymiary-okien-aa-1ypq-vNqw-WNT2.html) — Murator — 1165×1135, 1465×1435, 865×2095; okno węższe o 3 cm, niższe o 6–8 cm
39. [Wymiary okien i drzwi balkonowych](https://kb.pl/okna-i-drzwi/okna/wymiary-okien-i-drzwi-balkonowych-sprawdzamy-standardy/) — KB.pl — drzwi balkonowe 1465–1765 × 2095–2295; HST do 6000×2500
40. [Okno w kuchni](https://muratordom.pl/wnetrza/kuchnia/okno-w-kuchni-aa-t7h5-6mox-u3NU.html) — Murator — parapet nad szafkami ≥ 85 cm
41. [Standardowe wymiary bram garażowych](https://kb.pl/wyposazenie/bramy-garazowe/standardowe-wymiary-bram-garazowych-sprawdzamy-krok-po-kroku/) — KB.pl — najczęściej 200–250 × 212,5–225 cm; Hörmann 2250×2125; 5000×2125/2250
42. [Karta techniczna Nobla SSp](https://www.bricoman.pl/media/catalog/product/e/6/3/e/brama_garazowa_dwustanowiskowa_nobla_x_biala_20972392_techsheet.pdf) — Wiśniowski — nadproże ≥ 200 mm; miejsce z boku ≥ 110 mm
43. [Brama Nobla 2500×2125](https://www.castorama.pl/brama-garazowa-nobla-2500-x-2125-mm-z-napedem-antracyt/5904501383806_CAPL.prd) — Castorama — rozmiar handlowy 2500×2125 mm
44. [WT – t.j. Dz.U. 2022 poz. 1225](https://api.sejm.gov.pl/eli/acts/DU/2022/1225/text.html) — Sejm RP (ISAP) — § 62: drzwi wejściowe 0,9×2,0 m; § 57: 1:8; § 43: brama 2,4 m
45. [WT § 298 – balustrady](https://arslege.pl/wymogi-dotyczace-balustrad/k218/a23447/) — Arslege — 0,9 m (domy jednorodzinne), 1,1 m (pozostałe); akt uchylony 20.09.2026
46. [WT § 301 – podokiennik](https://arslege.pl/odleglosc-miedzy-gorna-krawedzia-podokiennika-a-podloga/k218/a23450/) — Arslege — ≥ 0,85 m (< 25 m), ≥ 1,1 m (> 25 m); parter zwolniony
47. [WT § 75 – drzwi wewnętrzne](https://arslege.pl/drzwi-wewnetrzne/k218/a23222/) — Arslege — pokoje i kuchnia ≥ 0,8×2,0 m; użyteczność publiczna 0,9 m
48. [Wymagania WT dla drzwi](https://zpe.gov.pl/a/D1Go3MlTK) — ZPE (MEN) — § 62: 0,9×2 m, próg ≤ 0,02 m
49. [Dz.U. 2026 poz. 1161](https://eli.gov.pl/eli/DU/2026/1161/ogl/pol/pdf) — ELI / RCL — art. 102a–102c: 18 miesięcy od 20.09.2026; ogłoszona 1.09.2026
50. [Nowe WT od 20 września 2026](https://budujemydom.pl/budowlane-abc/poradnik-prawny/a/121633-nowe-warunki-techniczne-od-20-wrzesnia-2026-r-kto-nadal-bedzie-mogl-budowac-wedlug-starych-wt) — Budujemy Dom — projekt z 6.08.2026; okres przejściowy 18 miesięcy
51. [Stare i nowe WT](https://oprawiebudowlanym.pl/2026/07/stare-i-nowe-warunki-techniczne-dla-budynkow.html) — oprawiebudowlanym.pl — rozdział 10a obowiązuje od 2.09.2026
52. [Co dalej z WT 2026](https://forumbranzowe.com/co-dalej-z-warunkami-technicznymi-2026/) — Forum Branżowe (23.10.2026) — nowe WT niewydane; okres przejściowy do 20.03.2028
53. [Termin minął, przepisów nie ma](https://www.money.pl/gospodarka/miala-byc-rewolucja-w-budowie-domow-termin-minal-przepisow-nie-ma-7336366827530560a.html) — Money.pl (4.10.2026) — nowe WT nadal są projektem
54. [Nowe WT spóźnione](https://muratordom.pl/prawo/formalnosci-budowlane/nowe-warunki-techniczne-spoznione-ratunek-w-prowizorce-stare-przepisy-jeszcze-przez-18-miesiecy-aa-xhtt-Q8pc-pTxz.html) — Murator (28.09.2026) — rozporządzenie niepodpisane i nieogłoszone
55. [WT budynków 2026](https://www.kontrole.com.pl/nowe-warunki-techniczne-budynkow-2026/) — kontrole.com.pl (aktualizacja 27.10.2026) — stare WT formalnie utraciły moc; nowe w toku legislacji
56. [Archilegis – wydanie specjalne WT](https://www.izbaarchitektow.pl/pliki/warunki_techniczne_popr_3_8b809971da5b8cc3192bbd0092b2275b.pdf) — Izba Architektów RP (stan na 28.09.2026) — utrata mocy poprzedniego aktu
57. [Przedmiar i kosztorys robót murowych](https://bzg.pl/poradnik/artykul/sporzadzanie-przedmiaru-i-kosztorysu-robot-murowych/id/59896) — BZG — KNR 2-02: odlicza się otwory > 0,5 m²; nadproży prefabrykowanych nie; filarki do 2½ cegły w metrach
58. [Zasady przedmiarowania – BUD.12](https://zawodowe.edu.pl/technik-budownictwa/BUD.12/zgodnie-z-zasadami-przedmiarowania-robot-murarskic-73d9e4ad/) — zawodowe.edu.pl — odlicza się otwory > 0,5 m²
59. [KNR K-30](https://www.wienerberger.pl/content/dam/wienerberger/poland/marketing/documents-magazines/brochures/PL_MKT_DOC_POR_knr_k_30_wyd_2.pdf) — Wienerberger — odlicza się otwory > 0,025 m³; nadproża w metrach
60. [KNR K-50 Silka Tempo](https://storefrontapi.commerce.xella.com/medias/sys_master/root/h32/h63/8833983250462/KNR_K-50_-_Roboty_murowe_w_technologii_Silka_Tempo/KNR-K-50-Roboty-murowe-w-technologii-Silka-Tempo.pdf) — Xella — odlicza się ≥ 0,05 m³; uzupełnienia 0,08 m²/m²
61. [Najczęstsze błędy: okna, drzwi, bramy](https://www.mgprojekt.com.pl/blog/wp-content/uploads/2014/09/Jakie-sa-najczesciej-popelniane-na-budowie-bl%C4%99dy-okna-drzwi-i-bramy-garazowe.pdf) — MG Projekt — drzwi wejściowe 90–100 cm; okna ≥ 1/8 podłogi
62. [ST 1.5 Roboty murowe](https://nowybip.plock.eu/zp/5180/Specyfikacje/branża arch.-bud/ST.1.5.Roboty_murowe ok.pdf) — UM Płock — tolerancje otworów: ≤ 100 cm szer. +6/−3 mm; > 100 cm +10/−5 mm
63. [Ytong Flachsturz PSF](https://toom.de/p/flachsturz-psf-porenbeton-125-x-124-x-115-cm/3450151) — toom/Ytong — belka płaska 125 × 12,4 × 11,5 cm
64. [YTONG YN 1300×300×249](https://realbud.com/en_US/p/YTONG-YN-13030-lintel-1300x300x249/8819) — Realbud — wys. 249 mm; oparcie 20/25 cm; otwór ≤ 175 cm
65. [Nośność filarków międzyokiennych wg EC-6](https://www.materialybudowlane.info.pl/pl/mb-09-2012/5106-problemy-obliczania-nosnosci-filarkow-miedzyokiennych-podstawowa-metoda-uproszczona-wg-ec-6.html) — Materiały Budowlane — do modelu obliczeniowego przyjmuje się szerokość filarka (bez wartości minimalnej)
66. [Projektowanie konstrukcyjne – zeszyt 22](https://edge.sitecorecloud.io/hnhinternational-2bb7370b/media/sites/hplushpl/do-pobrania-pdf/04-zeszyty-techniczne/zeszyty-techniczne---stowarzyszenie-producentow-betonow/projektowanie-konstrukcyjne-22.pdf) — SPB / H+H — warunek metody uproszczonej PN-EN 1996-3: N_Ed ≤ 0,5·f_d·l·t

Pozycja 3 jest pusta przez pomyłkę w numeracji. Odwołania [n] w części A odpowiadają numerom z tej listy.

## C) Liczby
- **65 unikalnych źródeł** (pozycje 1–66 bez pustej 3), wszystkie otwarte przez WebFetch.
- **37 domen**: muratordom.pl, budujemydom.pl, izomat.cz, wienerberger.hr, wienerberger.pl, edge.sitecorecloud.io (H+H), termalica.pl, ginter.pl, drogbud.pl, stropex.com.pl, betonbest.pl, kb.pl, inzynierbudownictwa.pl, eurocodes.jrc.ec.europa.eu, ph.pollub.pl, nhbc-standards.co.uk, zawodowe.edu.pl, www2.porta.com.pl, classen.pl, bricoman.pl, castorama.pl, api.sejm.gov.pl, arslege.pl, zpe.gov.pl, eli.gov.pl, oprawiebudowlanym.pl, forumbranzowe.com, money.pl, kontrole.com.pl, izbaarchitektow.pl, bzg.pl, storefrontapi.commerce.xella.com, mgprojekt.com.pl, nowybip.plock.eu, toom.de, realbud.com, materialybudowlane.info.pl.