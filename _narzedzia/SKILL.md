---
name: eb-fb-na-portal
description: Przenosi nowe posty z fanpage'a EdukacjaBudowlana na portal edukacjabudowlana.eu (tekst 1:1, oryginalna grafika) przez repozytorium GitHub piotrkobylanka-commits/edukacjabudowlana-portal. Użyj przy „przenieś posty z FB na portal” i w zadaniu zaplanowanym.
---

# Posty z Facebooka na portal EdukacjaBudowlana

## Zanim zaczniesz
1. Sklonuj repozytorium: add_repo `piotrkobylanka-commits/edukacjabudowlana-portal` (push), `git clone --depth 1`.
2. Przeczytaj `_narzedzia/KONTROLA.md` (zasady, stan, dziennik). Zasady z pliku kontrolnego są nadrzędne.
3. Środowisko Claude nie widzi edukacjabudowlana.eu ani fbcdn.net. Wszystko, co trzeba pobrać z sieci, pobiera automat GitHub Actions „Kopia strony i grafiki z FB” (`_narzedzia/mirror.py`).

## Zasady bezwzględne (skrót)
- Tekst posta 1:1 (emoji, punktory, linie, wersaliki, interpunkcja) w `_narzedzia/posty/<ID>.txt`. Błędy merytoryczne i literówki: oryginał zostaje, poprawka idzie do `meta.json` → `poprawki` (decyzja Piotra: poprawiamy tylko na portalu) i jest zgłaszana Piotrowi.
- Obraz = oryginalna grafika z posta. Każdą nową grafikę pokaż Piotrowi do akceptacji przed publikacją. Bez Piotra (zadanie zaplanowane) przygotuj wszystko na gałęzi `oczekuje-<data>`, nie scalaj do `main`, wyślij mu podgląd okładek i tytułów.
- Merytorykę sprawdź w wielu źródłach (agent w tle); w treści wpisu nic o sprawdzaniu.
- Tylko własne posty EdukacjaBudowlana. Zero „—”, „bud24”, „INPEN”, „Claude”, „Higgsfield” w polach tworzonych (tytuł, lead, disclaimer).
- Nie nadpisuj na serwerze plików spoza repozytorium (api.php, eb_lib.php, kontakt.php, .htaccess, p/000–426…, img/…).

## Kroki
1. **Nowe posty.** Przeglądarka wbudowana (profil Piotra zalogowany na FB), tylko odczyt. Albumy: `https://www.facebook.com/media/set/?set=a.122103820251228509&type=3` i `…set=a.122104161585228509&type=3`. ID zdjęć (`fbid=`) większe niż „Najwyższe przeniesione ID” w KONTROLA.md → nowe posty.
2. **Tekst 1:1.** `https://www.facebook.com/photo.php?fbid=<ID>` → klik „Wyświetl więcej” → podpis z emoji (obrazki emoji zamieniane na `alt`, innerText je gubi). Zapisz `_narzedzia/posty/<ID>.txt`, zanotuj datę publikacji.
3. **Grafika.** `src` największego `<img>` na stronie zdjęcia → linia `<ID> <URL>` w `_narzedzia/fb-obrazy.txt` → commit + push. Automat zapisze `_narzedzia/obrazy/<ID>.webp`. Poczekaj na commit autora „EdukacjaBudowlana automat”, `git pull`.
4. **Akceptacja grafik** przez Piotra (podgląd montażu).
5. **Metryczka** w `_narzedzia/meta.json`: date, stage, dzial, zag (slugi z `stages[].dzialy[].zag`), domain, norms, lead, disclaimer, `poprawki` (opcjonalnie). Odśwież index.html i arkusz miniatur bez cache: wpisz ścieżki do `_narzedzia/pobierz.txt` (np. `index.html`, `img/thumbs/s49.webp`), push, poczekaj na automat.
6. **Paczka grafik.** `python3 _narzedzia/pakuj.py <ID> …` → nowa `p/NNN.json` + mapa EBIMG w index.html + cover_w/h w meta.
7. **Miniatury.** Arkusz `img/thumbs/sNN.webp` (2400×1350, siatka 5×5, kafel 480×270): wklej kafle w wolne pola (lista zajętych w KONTROLA.md), dopisz `thumb: [NN, kol, wiersz]` do meta.
8. **Konwersja i wstawienie.** `python3 _narzedzia/fb2portal.py _narzedzia/posty/<ID>.txt _narzedzia/meta.json > _narzedzia/wpisy/<ID>.json`, potem `python3 _narzedzia/wstaw.py index.html _narzedzia/wpisy`.
9. **Kontrole.** Poprawny JSON, unikalne slugi, ID w mapie EBIMG, brak zakazanych słów w polach tworzonych.
10. **Publikacja.** Commit + push na `main` → automat „Publikacja” wgrywa przez FTPS zmienione pliki (wymaga sekretu `FTP_PASSWORD`; prawdziwe wgranie tylko, gdy istnieje `_narzedzia/publikacja-wlaczona`, inaczej próba). Sprawdź na żywo `https://edukacjabudowlana.eu/#a-<slug>` (okładka, miniatura, treść).
11. **Kontrola.** Zaktualizuj w `_narzedzia/KONTROLA.md` sekcje „Stan” i „Dziennik” oraz kopię w projekcie claude.ai (`claude/EB_FB_portal_kontrola.md`).
