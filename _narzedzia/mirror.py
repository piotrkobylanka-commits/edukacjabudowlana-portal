#!/usr/bin/env python3
"""Kopia strony edukacjabudowlana.eu do repozytorium + pobranie grafik z FB.

Uruchamiane przez GitHub Actions (.github/workflows/mirror.yml).
1. Jeśli istnieje _narzedzia/trigger-mirror: pobiera index.html i wszystkie
   zasoby, do których się odwołuje (img/, css/, js/ itd.), do katalogu repo.
2. Dla każdej linii "<ID> <URL>" w _narzedzia/fb-obrazy.txt pobiera grafikę
   z FB i zapisuje jako img/full/<ID>.webp (bez przycinania, jakość 85).
Raport: _narzedzia/raport-mirror.txt
"""
import io, os, re, sys, time, urllib.request, urllib.error

BASE = "https://edukacjabudowlana.eu/"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPORT = []
UA = {"User-Agent": "Mozilla/5.0 (EdukacjaBudowlana mirror)"}


def get(url, tries=3):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            return e.code, "", b""
        except Exception as e:  # sieć
            if i == tries - 1:
                return 0, str(e), b""
            time.sleep(3)


def save(rel, data):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p) or ROOT, exist_ok=True)
    with open(p, "wb") as f:
        f.write(data)


ASSET = re.compile(
    r"""(?<![\w/.-])((?:img|images|assets|css|js|fonts|font|pdf|files|media|ikony|icons|static|dl|pliki)/[A-Za-z0-9_\-./%]+?\.(?:webp|png|jpe?g|gif|svg|avif|ico|css|js|mjs|json|pdf|woff2?|ttf|otf|mp4|webm|mp3|txt|xml|zip|webmanifest))"""
)
ROOTFILES = ["robots.txt", "sitemap.xml", "favicon.ico", "favicon.svg", "favicon.png",
             "apple-touch-icon.png", "manifest.webmanifest", "site.webmanifest", "llms.txt"]


def mirror():
    st, ct, html = get(BASE)
    if st != 200:
        REPORT.append(f"BŁĄD index.html: {st} {ct}")
        return
    save("index.html", html)
    REPORT.append(f"index.html: {len(html)} B")
    text = html.decode("utf-8", "ignore")
    found = sorted(set(m.group(1) for m in ASSET.finditer(text)))
    # zasoby z plików css/js też mogą mieć odwołania
    seen, queue, ok, missing = set(), list(found) + ROOTFILES, 0, []
    while queue:
        rel = queue.pop(0).split("#")[0].split("?")[0]
        if rel in seen or "${" in rel:
            continue
        seen.add(rel)
        st, ct, data = get(BASE + rel)
        if st == 200 and not (rel.endswith((".webp", ".png", ".jpg", ".jpeg")) and "text/html" in ct):
            save(rel, data)
            ok += 1
            if rel.endswith((".css", ".js", ".mjs")):
                for m in ASSET.finditer(data.decode("utf-8", "ignore")):
                    queue.append(m.group(1))
        else:
            missing.append(f"{rel} -> {st}")
    REPORT.append(f"zasoby pobrane: {ok}, brakujące: {len(missing)}")
    REPORT.extend("  BRAK " + m for m in missing)


def fb_images():
    path = os.path.join(ROOT, "_narzedzia", "fb-obrazy.txt")
    if not os.path.exists(path):
        return
    from PIL import Image
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        pid, url = line.split(None, 1)
        out = f"img/full/{pid}.webp"
        if os.path.exists(os.path.join(ROOT, out)):
            REPORT.append(f"FB {pid}: już jest")
            continue
        st, ct, data = get(url)
        if st != 200 or not data:
            REPORT.append(f"FB {pid}: BŁĄD {st} {ct}")
            continue
        im = Image.open(io.BytesIO(data)).convert("RGB")
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=85, method=6)
        save(out, buf.getvalue())
        REPORT.append(f"FB {pid}: {im.size[0]}x{im.size[1]} -> {out}")


if __name__ == "__main__":
    if os.path.exists(os.path.join(ROOT, "_narzedzia", "trigger-mirror")):
        mirror()
        os.remove(os.path.join(ROOT, "_narzedzia", "trigger-mirror"))
    fb_images()
    with open(os.path.join(ROOT, "_narzedzia", "raport-mirror.txt"), "w", encoding="utf-8") as f:
        f.write(time.strftime("%Y-%m-%d %H:%M UTC\n", time.gmtime()) + "\n".join(REPORT) + "\n")
    print("\n".join(REPORT))
