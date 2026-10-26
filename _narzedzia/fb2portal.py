#!/usr/bin/env python3
"""Zamienia tekst posta z FB (1:1) na wpis portalu EdukacjaBudowlana.

Użycie: fb2portal.py posty/<ID>.txt meta.json > wpis.json
meta.json: {"<ID>": {"date","stage","dzial","zag","domain","norms","lead","disclaimer","cover_w","cover_h"}}
Treść posta przenoszona jest bez zmian (emoji, punktory, wielkie litery,
interpunkcja). Pomijana jest tylko linia hashtagów.
"""
import html, json, re, sys, unicodedata

BULLETS = ("▪️", "▪", "•", "🔸", "🔹 ", "▫️", "✅", "❌", "➡️", "👉")
HEAD_EMOJI = re.compile(r"^(?:[\U0001F300-\U0001FAFF☀-➿⬀-⯿]️?)+\s")


def slugify(s):
    s = s.replace("ł", "l").replace("Ł", "L")
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode()
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s).strip("-").lower()
    return s


def strip_emoji(s):
    return HEAD_EMOJI.sub("", s).strip()


def make_title(first):
    t = strip_emoji(first)
    m = re.match(r"^(.+?)\.\s+(.+)$", t)
    if m:
        rest = m.group(2)
        t = m.group(1) + " – " + rest[0].lower() + rest[1:]
    return t.rstrip(".")


def is_heading(line):
    if line.startswith(BULLETS) and not HEAD_EMOJI.match(line):
        return False
    if not HEAD_EMOJI.match(line):
        return False
    body = strip_emoji(line)
    if len(body) > 90:
        return False
    # nagłówek: wersaliki albo krótka linia bez kropki na końcu
    return body.upper() == body or not body.endswith(".")


def is_bullet(line):
    return line.startswith(("▪️", "▪", "•", "▫️", "❌", "✅"))


def convert(text):
    lines = [l.rstrip() for l in text.strip("\n").split("\n")]
    lines = [l for l in lines if not re.fullmatch(r"(#\S+\s*)+", l.strip())]
    first = lines[0]
    out, toc, ul = [], [], False
    used = set()
    out.append(f"<p>{html.escape(first, quote=False)}</p>")
    for l in lines[1:]:
        if not l.strip():
            continue
        heading = is_heading(l)
        if not heading and (is_bullet(l) or l.startswith("🔹")):
            if not ul:
                out.append("<ul>")
                ul = True
            out.append(f'<li class="fb-b">{html.escape(l, quote=False)}</li>')
            continue
        if ul:
            out.append("</ul>")
            ul = False
        if heading:
            hid = slugify(strip_emoji(l)) or "sekcja"
            base, n = hid, 2
            while hid in used:
                hid, n = f"{base}-{n}", n + 1
            used.add(hid)
            toc.append({"id": hid, "t": l})
            out.append(f'<h2 id="{hid}">{html.escape(l, quote=False)}</h2>')
        else:
            out.append(f"<p>{html.escape(l, quote=False)}</p>")
    if ul:
        out.append("</ul>")
    words = len(re.findall(r"\w+", text))
    return first, "\n".join(out), toc, max(2, round(words / 180))


def main():
    path, metap = sys.argv[1], sys.argv[2]
    pid = re.search(r"(\d{12,})", path).group(1)
    meta = json.load(open(metap, encoding="utf-8"))[pid]
    text = open(path, encoding="utf-8").read()
    first, body, toc, minutes = convert(text)
    title = meta.get("title") or make_title(first)
    norms = meta["norms"]
    src = ["<ul>", "<li>Opracowanie autorskie EdukacjaBudowlana, pierwotnie opublikowane na profilu EdukacjaBudowlana na Facebooku.</li>"]
    src += [f"<li>{html.escape(n, quote=False)}</li>" for n in norms]
    src.append("</ul>")
    art = {
        "slug": meta.get("slug") or slugify(title),
        "title": title,
        "lead": meta["lead"],
        "stage": meta["stage"],
        "dzial": meta["dzial"],
        "domain": meta["domain"],
        "norms": norms,
        "date": meta["date"],
        "html": body,
        "toc": toc,
        "sources": "\n".join(src),
        "disclaimer": meta["disclaimer"],
        "minutes": minutes,
        "nr": None,
        "seria": None,
        "zag": meta["zag"],
        "cover": {"src": f"img/full/{pid}.webp", "w": meta["cover_w"], "h": meta["cover_h"], "alt": title},
    }
    json.dump(art, sys.stdout, ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
