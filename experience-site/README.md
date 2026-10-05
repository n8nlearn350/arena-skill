# The Eighteen — a cinematic single-subject experience site

An original site that reproduces the **techniques** behind high-end athlete /
artist experience sites (the jjettas.com genre): a real loading sequence,
scroll-scrubbed cinematic hero, a 3D rotating "signature moments" disc, an
accordion of partnerships, and a film-grain finish.

It is **not** a copy of jjettas.com, and deliberately so — see
[What this is and isn't](#what-this-is-and-isnt).

```bash
npm install
npm run dev                  # http://localhost:5174
npm run build                # production build
node scripts/check-dom.mjs   # structure & a11y check, no browser needed
```

## The techniques, and where they live

| Technique | Where | How |
| --- | --- | --- |
| Loading sequence with a counter and curtain wipe | `Preloader` in `src/sections.tsx` | Counts to 100 while `img.decode()` resolves, never claims 100% before the image is decoded, then translates out. Separate failure state with a retry button. |
| Scroll-scrubbed hero | `Hero` | `useScroll` + `useTransform`. Scale, opacity, blur and copy offset are all functions of scroll position, so the user drives the sequence frame by frame instead of watching a timer. |
| Pinned frame | `Hero` | `h-[190svh]` section with a `sticky top-0 h-svh` child — the frame stays put while the scroll distance is consumed. |
| 3D rotating disc | `MomentsDisc` | Five cards placed with `rotateY(θ) translateZ(r)` inside a `preserve-3d` wrapper, rotated as one. Driven by drag and arrow keys, with a live "which of how many" read-out. |
| Accordion | `Partnerships` | `grid-template-rows: 0fr → 1fr`, which animates height without measuring the DOM. Real `aria-expanded` state. |
| Film grain | `.grain::after` in `src/index.css` | One inline SVG turbulence filter, animated in 3 steps. No image file, no dependency. |
| Single-accent discipline | all of it | One acid accent used a handful of times, on near-black. No gradient washes, no card kit. |

## Verified

- `tsc -b` clean
- production build **381 ms** (365 kB JS / 116 kB gzipped, 25 kB CSS)
- **20/20** structure and accessibility checks pass
- all three photographs load (131–181 kB each)

## The four images

`public/` holds four AI-generated photographs, written to a specific brief —
film stock, lighting direction, colour grade, and "no logos, no numbers, no
text". Identity is deliberately absent: the subject is always a silhouette, back
turned, motion-blurred, or off-frame entirely. That is what makes them usable
without borrowing anyone's likeness.

## Accessibility

Reduced motion is handled properly, not just partially: `prefers-reduced-motion`
skips the preloader entirely, disables smooth scrolling, and turns off the grain
animation. Buttons are labelled, the accordion exposes `aria-expanded`, images
carry descriptive `alt` and explicit dimensions, and there is a skip link.

## What this is and isn't

**Is:** an original build, with an invented subject ("The Eighteen"), invented
copy, and invented numbers. It reproduces the *mechanics* that make this genre of
site feel expensive.

**Isn't:** a replica of jjettas.com. Specifically not reproduced:

- **The person.** No real athlete's name, likeness, photography or biography.
  The demo subject is fictional and the build is checked to confirm no real
  athlete or team marks leak into it.
- **The photographs.** Theirs are professional shoots, licensed. These are
  generated, and framed so no real identity is involved.
- **The brand logos.** Their partnerships strip carries twenty-plus real
  trademarks. This demo lists six *invented* partner notes, no logos.
- **Their fonts and proprietary design assets.**

If you want a site in this genre for a real person or brand, you need the things
that actually make it good — the subject's own photography, their real story,
their marks — and permission to use each. The code here is the easy part.

## Stack

React 19 · TypeScript · Vite 8 · Tailwind v4 · `motion` (scroll + spring) ·
Anton / Archivo / JetBrains Mono, self-hosted via `@fontsource` — no CDN calls.

The design work applies the `frontend-design` skill in
`../.claude/skills/frontend-design/`: it deliberately avoids all five of the
generated-page tells the skill enumerates, and spends its boldness in one place
(the hero) while keeping everything else quiet.
