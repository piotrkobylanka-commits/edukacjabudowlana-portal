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


def get(url, tries=3, nocache=False):
    if nocache:  # omija pamięć podręczną CDN Hostingera
        url += ("&" if "?" in url else "?") + "nocache=" + str(int(time.time() * 1000))
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
    st, ct, html = get(BASE, nocache=True)
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
        st, ct, data = get(BASE + rel, nocache=True)
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


def pobierz_lista():
    """Pobiera świeże (bez cache) pliki wymienione w _narzedzia/pobierz.txt."""
    path = os.path.join(ROOT, "_narzedzia", "pobierz.txt")
    if not os.path.exists(path):
        return
    for rel in open(path, encoding="utf-8"):
        rel = rel.strip()
        if not rel or rel.startswith("#"):
            continue
        st, ct, data = get(BASE + rel, nocache=True)
        if st == 200 and data and not ("text/html" in ct and not rel.endswith(".html")):
            save(rel, data)
            REPORT.append(f"pobrano {rel}: {len(data)} B")
        else:
            REPORT.append(f"BŁĄD {rel}: {st} {ct}")
    os.remove(path)


FB_UA = [
    {"User-Agent": "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"},
    {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
     "Accept-Language": "pl-PL,pl;q=0.9"},
]


def fb_url_po_id(pid):
    """Adres pełnej grafiki z publicznej strony zdjęcia (linia w fb-obrazy.txt z samym ID)."""
    strony = [
        f"https://www.facebook.com/photo/?fbid={pid}&set=pb.61586855296654.-2207520000",
        f"https://www.facebook.com/photo.php?fbid={pid}",
        f"https://m.facebook.com/photo.php?fbid={pid}",
        f"https://mbasic.facebook.com/photo.php?fbid={pid}",
    ]
    for adres in strony:
        for h in FB_UA:
            try:
                req = urllib.request.Request(adres, headers=h)
                with urllib.request.urlopen(req, timeout=60) as r:
                    html = r.read().decode("utf-8", "replace")
            except Exception as e:
                REPORT.append(f"FB {pid}: {adres[:40]} {e}")
                continue
            kand = []
            for m in re.finditer(r'"image":\{"uri":"([^"]+)"[^}]*?"width":(\d+)', html):
                kand.append((int(m.group(2)), m.group(1)))
            if kand:
                kand.sort(reverse=True)
                return kand[0][1].replace("\\/", "/")
            m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
            if m:
                return m.group(1).replace("&amp;", "&")
    return None


def fb_images():
    path = os.path.join(ROOT, "_narzedzia", "fb-obrazy.txt")
    if not os.path.exists(path):
        return
    from PIL import Image
    for line in open(path, encoding="utf-8"):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split(None, 1)
        pid = parts[0]
        out = f"_narzedzia/obrazy/{pid}.webp"
        if os.path.exists(os.path.join(ROOT, out)):
            REPORT.append(f"FB {pid}: już jest")
            continue
        url = parts[1] if len(parts) > 1 else fb_url_po_id(pid)
        if not url:
            REPORT.append(f"FB {pid}: nie znaleziono adresu grafiki")
            continue
        st, ct, data = get(url)
        if st != 200 or not data:
            REPORT.append(f"FB {pid}: BŁĄD {st} {ct}")
            continue
        im = Image.open(io.BytesIO(data)).convert("RGB")
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=90, method=6)
        save(out, buf.getvalue())
        REPORT.append(f"FB {pid}: {im.size[0]}x{im.size[1]} -> {out}")


if __name__ == "__main__":
    if os.path.exists(os.path.join(ROOT, "_narzedzia", "trigger-mirror")):
        mirror()
        os.remove(os.path.join(ROOT, "_narzedzia", "trigger-mirror"))
    pobierz_lista()
    fb_images()
    with open(os.path.join(ROOT, "_narzedzia", "raport-mirror.txt"), "w", encoding="utf-8") as f:
        f.write(time.strftime("%Y-%m-%d %H:%M UTC\n", time.gmtime()) + "\n".join(REPORT) + "\n")
    print("\n".join(REPORT))
