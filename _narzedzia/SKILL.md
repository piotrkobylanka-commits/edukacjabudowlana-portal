---
name: eb-fb-na-portal
description: Przenosi nowe posty z fanpage'a EdukacjaBudowlana na portal edukacjabudowlana.eu (1:1, z oryginalną grafiką) i publikuje przez repozytorium GitHub. Użyj przy „przenieś posty z FB na portal” i w zadaniu zaplanowanym.
---

# Posty z Facebooka na portal EdukacjaBudowlana

## Zanim zaczniesz
1. Przeczytaj plik kontrolny: w repozytorium `piotrkobylanka-commits/edukacjabudowlana-portal` plik `_narzedzia/KONTROLA.md` (kopia w projekcie claude.ai „Z FB NA PORTAL”: `claude/EB_FB_portal_kontrola.md`). Zawiera zasady, stan (ostatnie przeniesione ID) i dziennik. Zasady z pliku kontrolnego są nadrzędne.
2. Sklonuj repozytorium (add_repo z dostępem push, potem `git clone --depth 1`).

## Zasady bezwzględne (skrót, pełne w KONTROLA.md)
- Tekst posta 1:1: emoji, punktory, podział linii, wielkie litery, interpunkcja. Nie poprawiaj, nie skracaj, nie „czyść”. Literówki zgłoś Piotrowi.
- Obraz = oryginalna grafika z posta w pełnej rozdzielczości, `img/full/<ID zdjęcia>.webp`.
- Każdy nowy obraz pokaż Piotrowi przed publikacją. Gdy pracujesz bez niego (zadanie zaplanowane), przygotuj wszystko na gałęzi `oczekuje-<data>` i NIE scalaj do `main`, dopóki Piotr nie zaakceptuje (wyślij mu podgląd okładek i listę tytułów).
- Merytorykę sprawdź w wielu źródłach (przepisy, normy, karty producentów). Błędy i wątpliwości zgłoś Piotrowi, w treści wpisu nic o sprawdzaniu nie pisz.
- Tylko własne posty EdukacjaBudowlana, nie udostępnienia cudzych.
- Zero „—”, „bud24”, „INPEN”, „Claude”, „Higgsfield” w polach, które tworzysz (tytuł, lead, disclaimer). W treści 1:1 ich nie dodawaj.

## Kroki
1. **Nowe posty.** W przeglądarce wbudowanej (zalogowany profil Piotra) otwórz album zdjęć fanpage'a: `https://www.facebook.com/media/set/?set=a.122103820251228509&type=3` oraz `...set=a.122104161585228509&type=3`. Zbierz ID zdjęć (`fbid=`) większe niż „Najwyższe przeniesione ID” z KONTROLA.md. Tylko odczyt: nie klikaj reakcji, komentarzy, „Promuj”.
2. **Tekst 1:1.** Dla każdego ID otwórz `https://www.facebook.com/photo.php?fbid=<ID>`, kliknij „Wyświetl więcej” i pobierz podpis, zamieniając obrazki emoji na ich `alt` (innerText gubi emoji). Zapisz do `_narzedzia/posty/<ID>.txt`. Zanotuj czas publikacji (data).
3. **Grafika.** Pobierz `src` największego obrazka na stronie zdjęcia, zapisz jako `img/full/<ID>.webp` (bez przycinania, jakość ~85).
4. **Metryczka.** Dopisz do `_narzedzia/meta.json` dla każdego ID: date, stage (1–13), dzial, zag (slugi z `stages[].dzialy[].zag` w danych portalu), domain, norms, lead (1 zdanie: co czytelnik wyniesie), disclaimer (wzory w KONTROLA.md), cover_w, cover_h.
5. **Konwersja.** `python3 _narzedzia/fb2portal.py _narzedzia/posty/<ID>.txt _narzedzia/meta.json > _narzedzia/wpisy/<ID>.json`
6. **Wstawienie.** `python3 _narzedzia/wstaw.py` dopisuje wpisy do `<script id="data">` w `index.html` (na początek listy `articles`), pomija slugi i ID już obecne, waliduje JSON.
7. **Kontrole.** Poprawny JSON, unikalne slugi, każdy `cover.src` istnieje w repo, brak zakazanych słów w polach tworzonych.
8. **Weryfikacja merytoryczna** (agent w tle): raport POPRAWNE/NIEPEWNE/BŁĘDNE dla twierdzeń prawnych i technicznych. Błędy zgłoś Piotrowi przed publikacją.
9. **Publikacja.** Po akceptacji Piotra: commit na `main` i push. Hostinger wdraża automatycznie z GitHuba. Sprawdź na żywo `https://edukacjabudowlana.eu/#a-<slug>` i okładkę.
10. **Kontrola.** Zaktualizuj w KONTROLA.md sekcje „Stan” i „Dziennik” (oraz kopię w projekcie claude.ai).
