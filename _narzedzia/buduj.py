#!/usr/bin/env python3
"""Buduje wpisy portalu z postów FB: posty/<ID>.txt + meta.json -> wpisy/<ID>.json.

Robi to samo co fb2portal.py, a przed konwersją (tylko na portalu, oryginał zostaje):
- stosuje "poprawki" z meta.json,
- usuwa resztki z wklejania (same nazwy domen, "+7", "calibrate" itp.),
- listy bez znacznika (sąsiednie krótkie linie) dostają punktor „●” albo „❌” w sekcji błędów,
- długi myślnik „—” zamienia na półpauzę.
Użycie: buduj.py ID [ID …]
"""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import fb2portal as F

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RESZTKI = re.compile(r"^(?:[a-z0-9.-]+\.(?:pl|com|eu|org|gov\.pl)|[a-z0-9-]{3,20}|\+\d{1,2}|Wpis na blogu)$")
MARK = ("●", "❌", "✅", "▪", "•", "▫", "🔹", "🔸", "➡", "👉")


def oczysc(text):
    out = []
    for l in text.split("\n"):
        s = l.strip()
        if s and RESZTKI.match(s) and not s.startswith("#"):
            continue  # np. "adeo", "leroymerlin", "eli.gov.pl", "+8"
        out.append(l.rstrip())
    return "\n".join(out).replace("—", "–")


def listy(text, heads=()):
    bloki = re.split(r"\n\s*\n", text)
    wynik = []
    sekcja_bledow = False
    for b in bloki:
        lines = b.split("\n")
        first = lines[0].strip()
        if len(lines) == 1 and (F.is_heading(first) or F.is_caps_heading(first) or first in heads):
            sekcja_bledow = "błęd" in first.lower()
            wynik.append(b)
            continue
        if len(lines) >= 2:
            start = 1 if lines[0].rstrip().endswith(":") else 0
            items = [l for l in lines[start:] if l.strip()]
            plain = [l for l in items if not l.lstrip().startswith(MARK) and not re.match(r"^\d{1,2}\.\s", l)]
            if len(items) >= 2 and len(plain) == len(items) and all(len(l) < 260 for l in items):
                znak = "❌ " if sekcja_bledow else "● "
                lines = lines[:start] + [znak + l.strip() for l in items]
        wynik.append("\n".join(lines))
    return "\n\n".join(wynik)


def numeracja(text):
    """Listy numerowane z FB bywają zepsute (1., 1., 2., 3.) – numerujemy od nowa w każdym bloku."""
    def fix(blok):
        lines = blok.split("\n")
        nums = [i for i, l in enumerate(lines) if re.match(r"^\d{1,2}\.\s", l)]
        if len(nums) >= 2:
            for k, i in enumerate(nums, 1):
                lines[i] = re.sub(r"^\d{1,2}\.", f"{k}.", lines[i])
        return "\n".join(lines)
    return "\n\n".join(fix(b) for b in re.split(r"\n\s*\n", text))


def buduj(pid, meta):
    text = open(os.path.join(ROOT, "_narzedzia/posty", pid + ".txt"), encoding="utf-8").read()
    for old, new in meta.get("poprawki", []):
        if text.count(old) != 1:
            sys.exit(f"Poprawka nie pasuje dokładnie raz ({text.count(old)}x) w {pid}: {old[:60]}")
        text = text.replace(old, new)
    text = numeracja(listy(oczysc(text), meta.get("naglowki", ())))
    tmp = os.path.join(ROOT, "_narzedzia", f".tmp_{pid}.txt")
    open(tmp, "w", encoding="utf-8").write(text)
    m2 = dict(meta); m2.pop("poprawki", None)
    mp = os.path.join(ROOT, "_narzedzia", f".tmp_{pid}.json")
    json.dump({pid: m2}, open(mp, "w", encoding="utf-8"), ensure_ascii=False)
    import io, contextlib
    buf = io.StringIO()
    sys.argv = ["fb2portal.py", tmp, mp]
    with contextlib.redirect_stdout(buf):
        F.main()
    os.remove(tmp); os.remove(mp)
    art = json.loads(buf.getvalue())
    os.makedirs(os.path.join(ROOT, "_narzedzia/wpisy"), exist_ok=True)
    json.dump(art, open(os.path.join(ROOT, "_narzedzia/wpisy", pid + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return art


if __name__ == "__main__":
    meta = json.load(open(os.path.join(ROOT, "_narzedzia/meta.json"), encoding="utf-8"))
    for pid in sys.argv[1:]:
        a = buduj(pid, meta[pid])
        print(pid, a["slug"], len(a["toc"]), "sekcji", a["minutes"], "min")
