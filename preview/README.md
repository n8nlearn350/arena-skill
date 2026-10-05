# preview — getting a real look at what was built

Two things live here:

1. **`inline.py`** — bundles a built Vite site into **one self-contained HTML
   file**. Open it by double-clicking: no server, no network, nothing to install.
2. **`smoke.mjs`** — loads that file into jsdom and checks the app actually
   executes and renders, instead of just assuming it does.

```bash
# build, then bundle
cd ../experience-site && npm run build && cd ..
python3 preview/inline.py experience-site/dist preview/out/the-eighteen.html

# prove it renders (needs jsdom)
cd preview && npm i jsdom
node smoke.mjs out/the-eighteen.html out/house-of-the-record.html
```

`out/` is gitignored — it's generated, and both files rebuild in seconds.

---

## It can't take screenshots here, and here's exactly why

A screenshot needs a browser. This sandbox has **no Chromium, Chrome or
Firefox binary**, and every route to one is closed:

| Route | Result |
| --- | --- |
| `apt-get install chromium` | ❌ `deb.debian.org` and `security.debian.org` unreachable |
| `playwright install chromium` | ❌ `Failed to download Chrome for Testing` |
| `puppeteer` / `npx playwright install` | ❌ blocked, same CDN |
| `npx @puppeteer/browsers install` | ❌ `cdn.playwright.dev`, `storage.googleapis.com` unreachable |
| `@sparticuz/chromium` (npm) | ⚠️ **works** — it ships the binary inside the package, extracted to `/tmp/chromium` |
| …but running it | ❌ needs `libnspr4.so`, `libnss3.so`, `libnssutil3.so`, which aren't installed |
| PySide6-Addons (175 MB wheel) | ❌ checked — bundles QtWebEngine but not those three libs |

So `shoot.mjs` is included as a **working screenshot script for a normal
machine** (or this one after `apt install libnss3`):

```bash
cd preview && npm i puppeteer-core @sparticuz/chromium
node shoot.mjs          # needs ports 5173/5174 running
```

That's the honest limit: the sandbox can build, bundle, and verify structure and
runtime — it cannot see pixels.

## What `smoke.mjs` gives you instead

It runs the real bundle in a real DOM (jsdom) with minimal polyfills for the
browser APIs jsdom lacks, then reports what actually rendered:

```
house-of-the-record.html
  #root موجود        : true
  محتوى مُصيَّر (حرف): 1670
  <img> عناصر        : 2 (2 بـ data URI)
  أخطاء تشغيل       : لا شيء ✓
  ✅ الصفحة تعمل
```

That check earned its keep immediately: the cinematic site reports its preloader
sitting at **94%** — which is the intended behaviour, because the counter is
written never to claim 100% until `img.decode()` resolves. In jsdom it never
does. The counter is honest, and the test proved it.

---

## `compose.py` — what the sites look like

No browser means no screenshots, so the preview images are **composed directly
with Pillow** from the sites' own assets and design tokens: the real
photographs, the real fonts (Anton, Archivo, JetBrains Mono, Alexandria, pulled
from google/fonts), and the real colour values from `index.css`.

```bash
pip install Pillow arabic-reshaper python-bidi fonttools
python3 preview/compose.py     # writes preview/shots/
```

`shots/00-all-sites.png` is the one to look at: hero, disc, Arabic hero and both
mobile layouts on a single sheet.

It is a faithful recreation of the layout at rest, not a screenshot. Anything
the browser computes at runtime — the scroll transform mid-scrub, the disc's 3D
rotation — is drawn at its resting state.

**Arabic needed two fixes** that are worth knowing about, since this bites any
server-side Arabic rendering:

1. **No Raqm.** Pillow here has no complex-text shaping and no bidi, so
   `arabic-reshaper` + `python-bidi` do both by hand.
2. **Ten missing isolated forms.** Alexandria has no glyph for the isolated
   presentation forms of alef, reh, teh marbuta, ain, waw, alef-hamza,
   alef-madda, feh, lam and heh — so they rendered as empty boxes. Every one of
   those letters is non-joining, so its isolated glyph is identical to the base
   letter; `ar()` substitutes the base codepoint, checked against the font's
   cmap, and the substitution is visually lossless.
