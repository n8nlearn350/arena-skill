#!/usr/bin/env python3
"""
Compose static preview images of the two sites.

This sandbox has no browser of any kind (no Chromium/Chrome/Firefox binary, every
browser CDN blocked, and the one binary obtainable from npm needs three NSS
libraries that cannot be installed). So the pixels here are composed directly
with Pillow from the sites' own assets and design tokens — the real photographs,
the real fonts, the real colours.

It is a faithful recreation of the layout, not a screenshot. Where it differs:
anything the browser computes at runtime (the scroll transform mid-scrub, the
3D rotation of the disc) is approximated at its resting state.

    python3 preview/compose.py
"""
import math
import unicodedata
from functools import lru_cache
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
FONTS = Path("/tmp/f")
OUT = Path(__file__).resolve().parent / "shots"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1600, 900

# --- design tokens, copied from the sites' index.css -----------------------
VOID = (5, 7, 10)
BONE = (232, 230, 225)
STEEL = (107, 116, 128)
FLARE = (200, 255, 61)
PAPER = (230, 224, 209)
INK = (16, 31, 29)
FADE = (95, 109, 103)


def font(name: str, size: int, weight: int | None = None) -> ImageFont.FreeTypeFont:
    f = ImageFont.truetype(str(FONTS / name), size)
    if weight is not None:
        try:
            f.set_variation_by_axes([weight])
        except Exception:
            pass
    return f


def cover(img: Image.Image, w: int, h: int) -> Image.Image:
    """Scale to fill w×h, keeping the centre — CSS object-fit: cover."""
    scale = max(w / img.width, h / img.height)
    resized = img.resize((math.ceil(img.width * scale), math.ceil(img.height * scale)), Image.LANCZOS)
    left = (resized.width - w) // 2
    top = (resized.height - h) // 2
    return resized.crop((left, top, left + w, top + h))


def vignette(w: int, h: int, strength: float = 0.92, inner: float = 0.20) -> Image.Image:
    """Radial dark overlay: transparent in the middle, opaque at the edges.
    Built small and scaled up — much faster than per-pixel work at full size."""
    sw, sh = 200, 120
    mask = Image.new("L", (sw, sh))
    px = mask.load()
    for y in range(sh):
        for x in range(sw):
            dx = (x / (sw - 1) - 0.5) * 2
            dy = (y / (sh - 1) - 0.5) * 2
            d = min(1.0, math.hypot(dx * 0.85, dy))
            t = 0.0 if d <= inner else (d - inner) / (1 - inner)
            px[x, y] = int(255 * strength * (t ** 1.5))
    mask = mask.resize((w, h), Image.BICUBIC)
    layer = Image.new("RGBA", (w, h), VOID + (255,))
    layer.putalpha(mask)
    return layer


@lru_cache(maxsize=None)
def _cmap(font_path: str) -> frozenset:
    """Codepoints the font actually has. Cached — parsing a TTF is not cheap."""
    from fontTools.ttLib import TTFont

    return frozenset(TTFont(font_path, lazy=True).getBestCmap().keys())


def ar(text: str, f: ImageFont.FreeTypeFont) -> str:
    """
    Shape and order Arabic for Pillow.

    Pillow here has no Raqm, so there is no complex-text shaping and no bidi:
    both are done in Python. Alexandria is also missing ten *isolated*
    presentation forms (alef, reh, teh marbuta, ain, waw, alef-hamza,
    alef-madda, feh, lam, heh) — every one of them a letter that does not join
    to what follows it, so its isolated glyph is identical to the base letter.
    Substituting the base codepoint is therefore visually lossless, and beats
    shipping boxes.
    """
    import arabic_reshaper
    from bidi.algorithm import get_display

    shaped = get_display(arabic_reshaper.reshape(text))
    cmap = _cmap(getattr(f, "path", ""))
    out = []
    for ch in shaped:
        if ord(ch) in cmap:
            out.append(ch)
            continue
        dec = unicodedata.decomposition(ch)
        if dec and dec.startswith("<"):
            base = int(dec.split()[-1], 16)
            if base in cmap:
                out.append(chr(base))
                continue
        out.append(ch)
    return "".join(out)


def tracked(draw: ImageDraw.ImageDraw, xy, text, f, fill, tracking=0.0, center=False, rtl=False):
    """Draw text with letter-spacing — Pillow has no tracking of its own."""
    if rtl:
        text = ar(text, f)
    widths = [draw.textlength(ch, font=f) for ch in text]
    total = sum(widths) + tracking * max(0, len(text) - 1)
    x, y = xy
    if center:
        x -= total / 2
    for ch, w in zip(text, widths):
        draw.text((x, y), ch, font=f, fill=fill, anchor="la")
        x += w + tracking
    return total


def ar_text(draw: ImageDraw.ImageDraw, xy, text, f, fill, anchor="ra"):
    """Right-anchored Arabic text, shaped. xy is the right edge for anchor='ra'."""
    draw.text(xy, ar(text, f), font=f, fill=fill, anchor=anchor)


def ar_width(draw: ImageDraw.ImageDraw, text, f) -> float:
    return draw.textlength(ar(text, f), font=f)


# ===========================================================================
# 1. Cinematic hero — the state the page rests in before you scroll
# ===========================================================================
def cinematic_hero() -> Path:
    img = Image.new("RGB", (W, H), VOID)
    img.paste(cover(Image.open(ROOT / "experience-site/public/hero-tunnel.jpg").convert("RGB"), W, H), (0, 0))

    # darken, then vignette, so the type has something to sit on
    img = Image.blend(img, Image.new("RGB", (W, H), VOID), 0.30)
    img = Image.alpha_composite(img.convert("RGBA"), vignette(W, H)).convert("RGB")
    img = Image.alpha_composite(
        img.convert("RGBA"),
        vignette(W, H, strength=0.85, inner=-0.35),  # linear-ish bottom falloff
    ).convert("RGB")

    d = ImageDraw.Draw(img)
    pad = 84

    # --- header
    tracked(d, (pad, 34), "THE EIGHTEEN", font("JetBrainsMono.ttf", 15, 500), BONE, tracking=1.6)
    nav = [("MOMENTS", 0), ("FOUNDATION", 1), ("PARTNERSHIPS", 2)]
    x = W - pad
    for label, _ in reversed(nav):
        f = font("JetBrainsMono.ttf", 15, 400)
        w = d.textlength(label, font=f) + 1.6 * (len(label) - 1)
        x -= w
        tracked(d, (x, 34), label, f, STEEL, tracking=1.6)
        x -= 44

    # --- kicker with its little rule
    kf = font("JetBrainsMono.ttf", 15, 500)
    kicker = "A CAREER IN FIVE MOMENTS"
    kw = d.textlength(kicker, font=kf) + 1.8 * (len(kicker) - 1)
    cy = 372
    d.line([(W / 2 - kw / 2 - 52, cy + 9), (W / 2 - kw / 2 - 16, cy + 9)], fill=STEEL, width=1)
    tracked(d, (W / 2 - kw / 2, cy), kicker, kf, BONE, tracking=1.8, center=False)

    # --- headline
    hf = font("Anton.ttf", 168)
    headline = "THE EIGHTEEN"
    hw = d.textlength(headline, font=hf)
    d.text((W / 2 - hw / 2, 404), headline, font=hf, fill=BONE)

    # --- standfirst, wrapped to a readable measure
    body = font("Archivo.ttf", 23, 380)
    standfirst = (
        "From a small town in the delta to the brightest light in the stadium. "
        "Every move carries intention, style, and a story the broadcast never "
        "shows you."
    )
    words, lines, line = standfirst.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if d.textlength(trial, font=body) <= 760:
            line = trial
        else:
            lines.append(line)
            line = word
    lines.append(line)
    y = 604
    for ln in lines:
        w = d.textlength(ln, font=body)
        d.text((W / 2 - w / 2, y), ln, font=body, fill=(196, 195, 190))
        y += 36

    # --- scroll cue
    sf = font("JetBrainsMono.ttf", 13, 400)
    sw = d.textlength("SCROLL", font=sf) + 1.6 * 5
    tracked(d, (W / 2 - sw / 2, H - 104), "SCROLL", sf, (150, 152, 150), tracking=1.6)
    d.line([(W / 2, H - 76), (W / 2, H - 34)], fill=(110, 114, 114), width=1)
    d.line([(W / 2, H - 92), (W / 2, H - 62)], fill=FLARE, width=2)

    out = OUT / "01-cinematic-hero.png"
    img.save(out)
    return out


# ===========================================================================
# 2. Cinematic moments — the disc at rest, centre card forward
# ===========================================================================
def cinematic_moments() -> Path:
    img = Image.new("RGB", (W, H), VOID)
    d = ImageDraw.Draw(img)
    pad = 84

    tracked(d, (pad, 34), "THE EIGHTEEN", font("JetBrainsMono.ttf", 15, 500), BONE, tracking=1.6)

    d.text((pad, 108), "SIGNATURE", font=font("Anton.ttf", 86), fill=BONE)
    d.text((pad, 190), "MOMENTS", font=font("Anton.ttf", 86), fill=BONE)
    d.line([(pad, 300), (W - pad, 300)], fill=(38, 42, 48), width=1)

    # The disc. Cards sit on a circle in 3D; seen from the front that reads as
    # a row of cards, huddled toward the centre with the front one largest.
    cx, cy = W / 2, 520
    order = [(2, 0), (1, -1), (3, 1), (0, -2), (4, 2)]  # (index, depth) centre outward
    cw, ch = 236, 340
    for idx, depth in order:
        step = ROOT / "experience-site/public"
        images = ["moment-01.jpg", "moment-02.jpg", "moment-03.jpg", "moment-01.jpg", "moment-02.jpg"]
        card = cover(Image.open(step / images[idx]).convert("RGB"), cw, ch)
        scale = 1.0 - abs(depth) * 0.17
        opacity = 1.0 if depth == 0 else max(0.30, 0.78 - abs(depth) * 0.26)
        cwid, chgt = int(cw * scale), int(ch * scale)
        card = card.resize((cwid, chgt), Image.LANCZOS)
        x = int(cx + depth * 232 - cwid / 2)
        y = int(cy - chgt / 2)
        card = card.convert("RGBA")
        if opacity < 1.0:
            dark = Image.new("RGBA", card.size, VOID + (int(255 * (1 - opacity)),))
            card = Image.alpha_composite(card, dark)
        img.paste(card.convert("RGB"), (x, y))
        d.rectangle([x, y, x + cwid - 1, y + chgt - 1], outline=(46, 50, 56), width=1)

    # read-out under the front card
    rf = font("JetBrainsMono.ttf", 15, 500)
    label = "03"
    w = d.textlength(label, font=rf) + 1.6
    tracked(d, (W / 2 - w / 2, 716), label, rf, FLARE, tracking=1.6)
    t = "THE CATCH"
    tf = font("Anton.ttf", 30)
    tw = d.textlength(t, font=tf)
    d.text((W / 2 - tw / 2, 744), t, font=tf, fill=BONE)

    # steal + caption
    cap = "Fourth and eighteen, the season on the line, one hand and half a second of daylight."
    cf = font("Archivo.ttf", 19, 380)
    cwid = d.textlength(cap, font=cf)
    d.text((W / 2 - cwid / 2, 792), cap, font=cf, fill=STEEL)

    out = OUT / "02-cinematic-moments.png"
    img.save(out)
    return out


# ===========================================================================
# 3. Arabic hero — the light, RTL site
# ===========================================================================
def arabic_hero() -> Path:
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)

    # figure on the left; RTL puts the text column on the right
    fig_w, fig_h = 560, 672
    fig = cover(Image.open(ROOT / "web-skills/demo-site/public/listening-room.jpg").convert("RGB"), fig_w, fig_h)
    img.paste(fig, (84, 168))
    d.rectangle([84, 168, 84 + fig_w - 1, 168 + fig_h - 1], outline=(206, 200, 186), width=1)

    # --- header: brand at the right edge, nav to its left
    brand = font("Alexandria.ttf", 24, 600)
    ar_text(d, (W - 84, 46), "بيت الأسطوانة", brand, INK)

    nav = ["الزيارة", "الأرشيف", "ساعة الاستماع"]  # RTL: first item sits rightmost
    x = 84
    for n in nav:
        nf = font("Alexandria.ttf", 17, 450)
        d.text((x, 56), ar(n, nf), font=nf, fill=FADE)
        x += ar_width(d, n, nf) + 34
    d.line([(84, 116), (W - 84, 116)], fill=(206, 200, 186), width=1)

    tx = W - 84  # right edge of the text column

    # --- kicker, with its accent rule trailing to the right
    kf = font("Alexandria.ttf", 16, 550)
    kicker = "غرفة استماع وأرشيف أشرطة"
    kw = ar_width(d, kicker, kf)
    ar_text(d, (tx, 204), kicker, kf, FADE)
    d.line([(tx + 14, 218), (tx + 44, 218)], fill=(168, 69, 31), width=2)

    # --- headline
    hf = font("Alexandria.ttf", 62, 650)
    for i, ln in enumerate(["اجلس. سنضع لك", "شيئًا على المسجّل."]):
        ar_text(d, (tx, 246 + i * 92), ln, hf, INK)

    # --- standfirst, wrapped
    bf = font("Alexandria.ttf", 20, 420)
    text = (
        "أربعة آلاف ومئتا شريط وألف ومئة أسطوانة على رفوف مفتوحة في غرفة واحدة في مار مخايل. "
        "تعال باسم، نجده لك. أو تعال بلا شيء، ونحن نختار."
    )
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = f"{line} {word}".strip()
        if ar_width(d, trial, bf) <= 660:
            line = trial
        else:
            lines.append(line)
            line = word
    lines.append(line)
    y = 470
    for ln in lines:
        ar_text(d, (tx, y), ln, bf, FADE)
        y += 42

    # --- buttons: in RTL the primary sits rightmost
    y = 606
    pf = font("Alexandria.ttf", 18, 600)
    primary = "احجز ساعة استماع"
    pw = ar_width(d, primary, pf)
    d.rectangle([tx - pw - 44, y, tx, y + 58], fill=INK)
    ar_text(d, (tx - 22, y + 15), primary, pf, PAPER)

    secondary = "ما على الرفوف"
    sw = ar_width(d, secondary, pf)
    x2 = tx - pw - 44 - 20 - sw - 44
    d.rectangle([x2, y, x2 + sw + 44, y + 58], outline=(16, 31, 29), width=1)
    ar_text(d, (x2 + sw + 22, y + 15), secondary, pf, INK)

    # --- caption under the photograph
    cf = font("Alexandria.ttf", 15, 400)
    cap = "الغرفة، الرابعة بعد الظهر. ثمانية وعشرون مقعدًا، مسجّل واحد."
    ar_text(d, (84 + fig_w, 858), cap, cf, FADE)
    # the rule sits to the start (right) of the caption, clear of the glyphs
    d.line([(84 + fig_w + 16, 866), (84 + fig_w + 46, 866)], fill=(168, 69, 31), width=2)

    out = OUT / "03-arabic-hero.png"
    img.save(out)
    return out


# ===========================================================================
# 4 & 5. Mobile — proves the layouts collapse rather than squashing
# ===========================================================================
MW, MH = 390, 844


def mobile_cinematic() -> Path:
    img = Image.new("RGB", (MW, MH), VOID)
    img.paste(cover(Image.open(ROOT / "experience-site/public/hero-tunnel.jpg").convert("RGB"), MW, MH), (0, 0))
    img = Image.blend(img, Image.new("RGB", (MW, MH), VOID), 0.34)
    img = Image.alpha_composite(img.convert("RGBA"), vignette(MW, MH, 0.9, 0.05)).convert("RGB")
    d = ImageDraw.Draw(img)

    tracked(d, (24, 26), "THE EIGHTEEN", font("JetBrainsMono.ttf", 11, 500), BONE, tracking=1.2)
    kf = font("JetBrainsMono.ttf", 11, 500)
    k = "A CAREER IN FIVE MOMENTS"
    kw = d.textlength(k, font=kf)
    tracked(d, (MW / 2 - kw / 2, 330), k, kf, BONE, tracking=1.4)

    hf = font("Anton.ttf", 62)
    for i, ln in enumerate(["THE", "EIGHTEEN"]):
        w = d.textlength(ln, font=hf)
        d.text((MW / 2 - w / 2, 366 + i * 62), ln, font=hf, fill=BONE)

    body = font("Archivo.ttf", 14, 380)
    words = "From a small town in the delta to the brightest light in the stadium.".split()
    lines, line = [], ""
    for w_ in words:
        t = f"{line} {w_}".strip()
        if d.textlength(t, font=body) <= 300:
            line = t
        else:
            lines.append(line); line = w_
    lines.append(line)
    y = 528
    for ln in lines:
        w = d.textlength(ln, font=body)
        d.text((MW / 2 - w / 2, y), ln, font=body, fill=(190, 189, 185))
        y += 22
    d.line([(MW / 2, MH - 70), (MW / 2, MH - 34)], fill=(110, 114, 114), width=1)

    out = OUT / "04-mobile-cinematic.png"
    img.save(out)
    return out


def mobile_arabic() -> Path:
    img = Image.new("RGB", (MW, MH), PAPER)
    d = ImageDraw.Draw(img)

    d.text((16, 22), ar("بيت الأسطوانة", font("Alexandria.ttf", 18, 600)),
           font=font("Alexandria.ttf", 18, 600), fill=INK)
    d.line([(16, 62), (MW - 16, 62)], fill=(206, 200, 186), width=1)

    fig = cover(Image.open(ROOT / "web-skills/demo-site/public/listening-room.jpg").convert("RGB"),
                MW - 32, 260)
    img.paste(fig, (16, 88))

    tx = MW - 16
    kf = font("Alexandria.ttf", 11, 550)
    ar_text(d, (tx, 368), "غرفة استماع وأرشيف أشرطة", kf, FADE)

    hf = font("Alexandria.ttf", 30, 650)
    for i, ln in enumerate(["اجلس. سنضع", "لك شيئًا على", "المسجّل."]):
        ar_text(d, (tx, 396 + i * 44), ln, hf, INK)

    bf = font("Alexandria.ttf", 13, 420)
    text = "أربعة آلاف ومئتا شريط على رفوف مفتوحة في مار مخايل."
    words, lines, line = text.split(), [], ""
    for w_ in words:
        t = f"{line} {w_}".strip()
        if ar_width(d, t, bf) <= 340:
            line = t
        else:
            lines.append(line); line = w_
    lines.append(line)
    y = 546
    for ln in lines:
        ar_text(d, (tx, y), ln, bf, FADE)
        y += 26

    y = 636
    pf = font("Alexandria.ttf", 13, 600)
    label = "احجز ساعة استماع"
    lw = ar_width(d, label, pf)
    d.rectangle([tx - lw - 32, y, tx, y + 44], fill=INK)
    ar_text(d, (tx - 16, y + 12), label, pf, PAPER)

    out = OUT / "05-mobile-arabic.png"
    img.save(out)
    return out


# ===========================================================================
# 6. One sheet with everything on it
# ===========================================================================
def contact_sheet() -> Path:
    desk = [OUT / "01-cinematic-hero.png", OUT / "02-cinematic-moments.png", OUT / "03-arabic-hero.png"]
    mobs = [OUT / "04-mobile-cinematic.png", OUT / "05-mobile-arabic.png"]
    labels = [
        "01  Cinematic — hero, resting state",
        "02  Cinematic — the rotating moments disc",
        "03  Arabic RTL — hero (Arabic loads first, right-to-left)",
    ]

    sheet_w = 1240
    margin = 40
    inner_w = sheet_w - margin * 2
    imgs = [Image.open(p).convert("RGB") for p in desk]
    scaled = [im.resize((inner_w, int(im.height * inner_w / im.width)), Image.LANCZOS) for im in imgs]

    lab_h, gap = 34, 26
    mob_h = 430
    total_h = margin + sum(im.height + lab_h + gap for im in scaled) + mob_h + lab_h + margin + 20

    sheet = Image.new("RGB", (sheet_w, total_h), (12, 13, 15))
    d = ImageDraw.Draw(sheet)
    lf = font("Archivo.ttf", 17, 500)

    y = margin
    for im, lab in zip(scaled, labels):
        d.text((margin, y), lab, font=lf, fill=(232, 230, 225))
        y += lab_h
        sheet.paste(im, (margin, y))
        y += im.height + gap

    d.text((margin, y), "04  Same two sites at 390 × 844", font=lf, fill=(232, 230, 225))
    y += lab_h
    x = margin
    for mp in mobs:
        m = Image.open(mp).convert("RGB")
        h = mob_h
        w = int(m.width * h / m.height)
        sheet.paste(m.resize((w, h), Image.LANCZOS), (x, y))
        x += w + 24

    out = OUT / "00-all-sites.png"
    sheet.save(out)
    return out


if __name__ == "__main__":
    for fn in (cinematic_hero, cinematic_moments, arabic_hero, mobile_cinematic, mobile_arabic, contact_sheet):
        p = fn()
        print(f"  {p.name}: {p.stat().st_size // 1024} KB")
