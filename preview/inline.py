#!/usr/bin/env python3
"""
Bundle a built Vite site into ONE self-contained HTML file.

Everything — JS, CSS, fonts, images — is inlined as data URIs, so the result
opens by double-clicking, with no server and no network.

    python3 inline.py <dist-dir> <output.html>

Notes on why it works this way:

* The Vite bundle is emitted as `type="module"`. An inline module script still
  needs module semantics, and module scripts are refused in some `file://`
  contexts — which matters, because the whole point is double-clicking the file.
  So the bundle is checked for real module-only syntax; if it's plain classic
  code it is re-injected as a classic script at the end of <body>, where the DOM
  is guaranteed to exist (a classic inline script has no `defer`).
* Minified bundles reference public assets with backticks as often as quotes,
  so all three quote styles are tried.
"""
import base64
import mimetypes
import re
import sys
from pathlib import Path

FONT_EXT = {".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf"}
IMG_GLOBS = ("*.jpg", "*.jpeg", "*.png", "*.webp", "*.avif", "*.svg")


def data_uri(path: Path) -> str:
    if path.suffix in FONT_EXT:
        mime = FONT_EXT[path.suffix]
    else:
        mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    b64 = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{b64}"


def main() -> int:
    if len(sys.argv) != 3:
        print(__doc__)
        return 2

    dist = Path(sys.argv[1]).resolve()
    out = Path(sys.argv[2]).resolve()
    index = dist / "index.html"
    if not index.exists():
        print(f"error: no index.html in {dist} — run the build first")
        return 1

    html = index.read_text(encoding="utf-8")
    counts = {"js": 0, "css": 0, "img": 0, "font": 0}

    # ---------------------------------------------------------------- JS
    state = {"code": None, "classic": True}

    def capture_script(m: re.Match) -> str:
        f = dist / m.group("src").lstrip("/")
        if not f.exists():
            return m.group(0)
        code = f.read_text(encoding="utf-8")
        counts["js"] += 1
        if (
            "import.meta" in code
            or "import(" in code
            or re.search(r"^\s*import\s", code, re.M)
        ):
            state["classic"] = False
        # A bundle can contain </script> inside a string literal.
        state["code"] = code.replace("</script>", "<\\/script>")
        return ""

    html = re.sub(r'<script[^>]*\bsrc="(?P<src>[^"]+)"[^>]*></script>', capture_script, html)

    # --------------------------------------------------------------- CSS
    def repl_link(m: re.Match) -> str:
        f = dist / m.group("href").lstrip("/")
        if not f.exists():
            return m.group(0)
        counts["css"] += 1
        css = f.read_text(encoding="utf-8")

        def repl_url(u: re.Match) -> str:
            raw = u.group("u").strip("'\"")
            if raw.startswith("data:"):
                return u.group(0)
            font = dist / raw.lstrip("/")
            if font.exists() and font.suffix in FONT_EXT:
                counts["font"] += 1
                return f"url({data_uri(font)})"
            return u.group(0)

        return "<style>" + re.sub(r"url\((?P<u>[^)]+)\)", repl_url, css) + "</style>"

    html = re.sub(
        r'<link[^>]*\brel="stylesheet"[^>]*\bhref="(?P<href>[^"]+)"[^>]*>', repl_link, html
    )

    # ------------------------------------------------------------ images
    # Applied to the markup AND to the captured JS, since the assets are
    # referenced from both.
    js = state["code"] or ""
    for img in [p for g in IMG_GLOBS for p in sorted(dist.rglob(g))]:
        path = "/" + img.relative_to(dist).as_posix()
        uri = None
        for quote in ('"', "'", "`"):
            if f"{quote}{path}{quote}" in html or f"{quote}{path}{quote}" in js:
                uri = data_uri(img)
                html = html.replace(f"{quote}{path}{quote}", f"{quote}{uri}{quote}")
                js = js.replace(f"{quote}{path}{quote}", f"{quote}{uri}{quote}")
                counts["img"] += 1
                break
        if uri is None:
            for needle in (f"url({path})", f'="{path}"'):
                if needle in html or needle in js:
                    uri = data_uri(img)
                    html = html.replace(needle, needle.replace(path, uri))
                    js = js.replace(needle, needle.replace(path, uri))
                    counts["img"] += 1
                    break

    # ------------------------------------------------------- re-inject JS
    if js:
        if state["classic"]:
            tag = f"<script>{js}</script>"
        else:
            tag = f'<script type="module">{js}</script>'
            print('  note: bundle needs module semantics, kept type="module"')
        html = html.replace("</body>", f"{tag}\n</body>") if "</body>" in html else html + tag

    out.write_text(html, encoding="utf-8")
    size_mb = out.stat().st_size / 1024 / 1024
    print(
        f"  {out.name}: {size_mb:.2f} MB  "
        f"(js {counts['js']}, css {counts['css']}, fonts {counts['font']}, images {counts['img']})"
    )
    if counts["js"] == 0 or counts["css"] == 0:
        print("  ! nothing inlined — check the build output layout")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
