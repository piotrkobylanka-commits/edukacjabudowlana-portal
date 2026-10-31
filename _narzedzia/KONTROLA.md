# Plik kontrolny: przenoszenie postów z Facebooka na portal EdukacjaBudowlana

Czytaj na początku KAŻDEGO przenoszenia. Aktualizuj na końcu (sekcje „Stan” i „Dziennik”).

## Zadanie
Każdy nowy post z fanpage’a EdukacjaBudowlana trafia na portal jako pełny artykuł, możliwie od razu po publikacji na FB.

## Adresy
- Fanpage: https://www.facebook.com/people/EdukacjaBudowlana/61586855296654/ (Piotr zalogowany jako administrator w przeglądarce wbudowanej aplikacji Claude na komputerze).
- Portal (tymczasowo): https://edukacjabudowlana.eu. Docelowo edukacjabudowlana.pl (na razie 404 na domena.pl, „.pl jest na .eu”).
- Hosting: Hostinger, plan Premium, strona typu PHP/HTML, katalog `public_html`, użytkownik u475962483, IP 217.65.157.30. Brak Git, SSH wyłączone. Menedżer plików otwiera się w okienku (srv2288-files.hstgr.io), które przeglądarka Claude blokuje.
- NIE publikować na bud24.eu (podłączony WordPress to bud24.eu, nie EB).

## Zasady (bezwzględne)
0. TEKST 1:1 Z FB. Treść posta przenosi się dokładnie tak, jak jest na FB: emoji, punktory, podział linii, wielkie litery, interpunkcja. Niczego nie „czyścić” ani nie przepisywać. (Odczyt: emoji na FB to obrazki z atrybutem alt; pobieraj tekst z alt, bo innerText je gubi.) Oczywistą literówkę zgłoś Piotrowi, nie poprawiaj sama.
0-bis. POPRAWKI TYLKO NA PORTALU (decyzja Piotra 26.10.2026, wariant 3): gdy weryfikacja wykaże błąd, oryginał zostaje w `posty/<ID>.txt` 1:1, a poprawkę zapisuje się w `meta.json` → `poprawki: [[stary_tekst, nowy_tekst], …]`; fb2portal.py stosuje je przy konwersji. FB zostaje bez zmian. Literówki poprawia się tak samo.
0a. OBRAZ = oryginalna grafika z posta (pełna rozdzielczość z FB), zapisana jako img/full/<ID>.webp. Każdy obraz pokazać Piotrowi do akceptacji przed publikacją.
0b. Merytorykę i prawa autorskie sprawdzić w wielu źródłach, ale w artykule NIC o sprawdzaniu ani o źródłach poza ustalonym formatem pola `sources`.
0c. Nie publikować udostępnionych cudzych postów (np. izb inżynierów), tylko własne posty EdukacjaBudowlana.
1. Sygnatura wyłącznie EdukacjaBudowlana / www.edukacjabudowlana.pl. Zero: bud24, INPEN, numerów telefonów, wzmianek o AI, Claude, Higgsfield. Wyjątek: stopka i kontakt portalu (biuro@edukacjabudowlana.pl) zostają, jak są.
2. Zero długich myślników „—”. W tytułach i zakresach „–”.
3. Styl wg skilla `naturalny-styl-pisania`: konkret, problem na start, bez formułek AI, bez sztucznych podsumowań.
4. Oryginalność wg skilla `oryginalne-tresci-prawa-autorskie`: post z FB to nasz materiał, ale artykuł opracowujemy na nowo i rozwijamy, nie kopiujemy cudzych tekstów.
5. Stan prawny: przed publikacją sprawdź aktualność przywołanych przepisów i norm (wyszukiwanie). Każdy obowiązek z podstawą prawną.
6. Przykłady fikcyjne i opisane jako fikcyjne.
7. Nie przenosić drugi raz posta, który już jest (sprawdzaj ID posta i tytuł).

## Budowa portalu
Jeden plik `index.html` (~13,7 MB) na Hostingerze. Dane w `<script id="data" type="application/json">` (zapis zwarty, „</” jako „<\/”), klucze: phases, stages (13), domains, series, articles, icons, thumbs, checklist, stops.
GRAFIKI: w danych okładka to `img/full/<ID>.webp`, ale pliku nie ma na serwerze (404 to norma). Skrypt `window.EBIMG` (w index.html) ma mapę `const M={"<ID>":<nr paczki>}` i ładuje `p/NNN.json` = {"<ID>": base64 WebP 960 px, q80}. Nowe grafiki → kolejna paczka (`pakuj.py`). Ostatnia paczka: p/427.json (26.10.2026).
Na serwerze są też pliki, których nie ma w repozytorium i których nie wolno nadpisać: api.php, eb_lib.php, kontakt.php, .htaccess, p/000–426.json, img/…, panel administratora w PHP (serwerowa wersja index.html różni się od artefaktu claude.ai).

Domeny: konstrukcje, fizyka, grunt, instalacje, wykonczenia, prawo, koszty.
Etapy: 1 Przygotowanie inwestycji i dokumentacja · 2 Roboty przygotowawcze i ziemne · 3 Fundamenty i stan zerowy · 4 SSO · 5 SSZ · 6 Instalacje wewnętrzne i prace przedtynkowe · 7 Tynki, izolacje, jastrychy i stan deweloperski · 8 Roboty wykończeniowe · 9 Przyłącza i zagospodarowanie działki · 10 Odbiory, dokumentacja i zakończenie budowy · 11 Wykonawcy i umowy · 12 Użytkowanie i gwarancje · 13 Remont, przebudowa, rozbudowa.

### Pola artykułu z FB (wzór z 25.10.2026)
- `slug`: z tytułu, bez polskich znaków, myślniki.
- `title`: problem czytelnika, format „Sytuacja – pytanie/rozwiązanie”.
- `lead`: 1–2 zdania, co czytelnik wyniesie.
- `stage` (1–13), `dzial` (slug działu etapu), `domain`, `zag` (slug zagadnienia, np. podjazd-i-chodniki).
- `norms`: lista, np. ["Warunki techniczne § 107", "PN-EN 1433"].
- `date`: RRRR-MM-DD publikacji na FB.
- `html`: treść, akapity `<p>`, śródtytuły `<h2 id="...">` zgodne z `toc`.
- `toc`: [{"id","t"}] dla każdego h2.
- `sources`: `<ul><li>Opracowanie autorskie EdukacjaBudowlana, pierwotnie opublikowane na profilu EdukacjaBudowlana na Facebooku.</li>` + po jednym `<li>` na przepis/normę `</ul>`.
- `disclaimer`: jedno zdanie dopasowane do dziedziny (prawo: „Artykuł ma charakter informacyjny i nie stanowi porady prawnej.”).
- `minutes`: czas czytania; `nr`: null; `seria`: null.
- `cover`: {"src":"img/full/<ID>.webp","w":960,"h":536,"alt":"<tytuł>"}; `thumb`: [indeks, x, y] z tablicy `thumbs`.

## Procedura
1. Przeczytaj ten plik.
2. Odczytaj aktualny portal i listę już przeniesionych ID (sekcja „Stan”).
3. Otwórz fanpage w przeglądarce wbudowanej (tylko odczyt, bez klikania „Promuj”, reakcji, komentarzy), zbierz posty nowsze niż ostatnie przeniesione ID: ID, data, pełny tekst, grafika.
4. Dla każdego posta: przenieś tekst 1:1 do pola `html` (nagłówki pisane wersalikami na FB → `<h2>` z tym samym tekstem i emoji; punkty → `<li class="fb-b">` z oryginalnym znakiem punktora), uzupełnij metadane (tytuł = pierwsza linia posta, lead, etap, dział, zagadnienie, normy), sprawdź merytorykę. Grafikę z posta zapisz jako webp i pokaż Piotrowi.
5. Kontrola automatyczna: 0 × „—”, „bud24”, „INPEN”, „Claude”, „Higgsfield”, „AI”; poprawny JSON; slug unikalny.
6. Wgraj nowy `index.html` i obrazy na Hostingera (kanał: patrz „Do ustalenia”), wyczyść cache.
7. Sprawdź na żywo, że artykuły się otwierają.
8. Zaktualizuj „Stan” i „Dziennik”.

## Stan (aktualizuj po każdym przeniesieniu)
- Portal sprawdzony: 26.10.2026, plik z 26.10.2026 01:05.
- Artykułów ogółem: 1290, z FB: 1140 (1108 z ID posta w okładce).
- Ostatnia data na portalu: 2026-10-25.
- Najwyższe przeniesione ID zdjęcia FB: 122142769719228509 („Wprowadziłeś się. Pierwsza zima w nowym domu…”, 26.10.2026). Uwaga: od 26.10 kluczem jest ID ZDJĘCIA (fbid z albumu), wcześniejsze wpisy używały ID posta; nowe ID są zawsze większe od 122142661947228509.
- Ostatnie przeniesione (25.10.2026): 122142661947228509 brama-garazowa…, 122142630387228509 zbiornik-na-deszczowke…, 122142446595228509 dach-przecieka-tylko-przy-deszczu-z-wiatrem…, 122142444633228509 chce-wyburzyc-tylko-kawalek-sciany….
- 26.10.2026 dodano 9 wpisów (w repozytorium, czekają na publikację FTP): 122142724155, …726459, …728661, …732153, …747843, …751101, …767925, …768747, …769719 (końcówka 228509). Artykułów ogółem: 1299.

## Repozytorium i automaty
- GitHub: `piotrkobylanka-commits/edukacjabudowlana-portal` (prywatne). Gałąź `main` = strona 1:1 z `public_html` + katalog `_narzedzia/` (niepubliczny, .htaccess „Require all denied”, wykluczony z wgrywania).
- `_narzedzia/`: KONTROLA.md (kopia tego pliku), SKILL.md (procedura), fb2portal.py (post → wpis), wstaw.py (wpisy → index.html), meta.json (metryczki), posty/*.txt (teksty 1:1), wpisy/*.json, fb-obrazy.txt (ID + URL grafik z FB), mirror.py.
- Automat „Kopia strony i grafiki z FB” (.github/workflows/mirror.yml): uruchamia się po zmianie `_narzedzia/trigger-mirror` (kopia całej strony z edukacjabudowlana.eu) albo `_narzedzia/fb-obrazy.txt` (pobranie grafik z FB do img/full/<ID>.webp). Powód: środowisko Claude nie widzi edukacjabudowlana.eu ani fbcdn.net, a GitHub Actions tak.
- Automat „Publikacja” (.github/workflows/publikacja.yml): po każdym pushu do `main` (poza _narzedzia i .github) wgrywa zmienione pliki przez FTPS do `public_html` (217.65.157.30, użytkownik u475962483). Nic nie usuwa na serwerze. Wymaga sekretu repozytorium `FTP_PASSWORD` ustawionego przez Piotra. Hasła Claude nie zna i nie wpisuje.

## Uwagi techniczne
- CDN Hostingera potrafi oddać starą wersję pliku graficznego. Pliki zmieniane (arkusz miniatur, index.html) zawsze pobieraj z `?nocache=<czas>` (mirror.py robi to sam; lista w `_narzedzia/pobierz.txt`).
- Repozytorium NIE jest pełną kopią serwera: trzyma tylko pliki zarządzane (index.html, nowe p/NNN.json, zmieniane arkusze img/thumbs). Wgrywanie FTP niczego nie usuwa.
- Miniatury: sprite `img/thumbs/sNN.webp` 2400×1350, siatka 5×5 kafli 480×270, pole `thumb` = [NN, kolumna, wiersz]. W s49 zajęte: wiersz 0 (5), wiersz 1 (5; kol. 0–3 wpisy z 25.10), wiersz 2 (5), wiersz 3 kol. 0–2 (wpisy z 26.10). Następne wolne: (3,3), (4,3), wiersz 4; potem nowy sprite s50.
- (Sprostowanie 26.10: okładki i miniatury wpisów z 25.10 są na serwerze; wcześniejsza uwaga o brakach wynikała z kopii z pamięci podręcznej CDN.)

## Dziennik
- 26.10.2026: utworzono plik kontrolny; ustalono budowę portalu i stan na 25.10.2026.
- 26.10.2026: automat GitHuba skopiował index.html (13,7 MB, zgodny z serwerem). Grafiki 9 wpisów spakowane do p/427.json; arkusz s49 odświeżony z serwera bez cache i uzupełniony o 9 miniatur. Weryfikacja merytoryczna 9 postów: poprawki tylko na portalu (PB-16a nowy wzór, zaświadczenie PINB „może”, załączniki przy projektach od 19.09.2020, WZ od 1.01.2027 tylko z prawem do dysponowania, progi f-gazów, literówki). Wpisy wstawione do index.html, miniatury w s49.
- 26.10.2026: założono repozytorium GitHub i automaty; przygotowano 9 wpisów z 26.10 (zdjęcia FB 122142724155, …726459, …728661, …732153, …747843, …751101, …767925, …768747, …769719). Piotr zaakceptował okładki; myślnik „—” na grafice „Ściany pomalowane” i literówki („gwarancyjn9ą”, „Farbę wysycha się”) zostają jak w oryginale.
- 30.10.2026: przebudowano dział „Indeks norm i przepisów” (#normy): 831 surowych etykiet z pola `norms` grupowane automatycznie w 295 pozycji (funkcje nxIndex/nxParse, reguły NX_RULES w index.html) w 10 kategoriach; wyszukiwarka, filtry kategorii, sortowanie, karty z artykułami i filtrem po artykułach/paragrafach/częściach norm, link do pozycji (#normy/<slug>). Liczniki norm na stronie głównej, w menu i „O portalu” liczą teraz pozycje indeksu (295 zamiast 831). Nowe wpisy z FB trafiają do indeksu same; nową ustawę warto dopisać do NX_RULES (nazwa + pełny tytuł). Czeka na publikację FTP.
- 31.10.2026: poprawiono silnik programu PRO „Beton: dojrzewanie i rozszalowanie” (#narzedzia/pro-beton, funkcja calc): brak przyrostu wytrzymałości poniżej 0 °C, fck(t)=fck dopiero przy wieku skorygowanym ≥ 28 dni (wcześniej skok w 28. dniu kalendarzowym nawet w mrozie), wskaźnik r = fcm2/fcm28 przy 20 °C, tabela pielęgnacji wg PN-EN 13670 zał. F klasa 2. Skrypt: _narzedzia/popraw-pro-beton.js. Czeka na publikację FTP (brak sekretu FTP_PASSWORD).
- 31.10.2026 (12:20): WGRANO NA SERWER index.html = commit 8c96bed (13 751 300 B, SHA-256 4450e912…cefa8): wersja z serwera z 30.10 22:10 (moduły normy/stan-prawny/usługi/słowniczek/kontrast, SEO, sklep) + poprawki kalkulatorów: popraw-pro-beton.js, popraw-pro-beton-2.js, popraw-kalkulatory.js (134 poprawki z audytu, raporty w _narzedzia/audyt-kalkulatory). Kopia poprzedniej wersji na serwerze: public_html/index_backup_20261031.html. Wgrane przez menedżer plików hPanel (automat FTP nie łączy się: certyfikat FTPS nie obejmuje IP 217.65.157.30, a nazwa edukacjabudowlana.eu prowadzi do CDN; publikacja-wlaczona usunięta, automat w trybie próby). UWAGA dla kolejnych zmian: każdą nową wersję budować od tego index.html (git pull), nie od starszej kopii z serwera, inaczej poprawki kalkulatorów zostaną nadpisane. Na serwerze nadal brak 9 wpisów z FB z 26.10 (są w commicie ef5b075 i p/427.json).
