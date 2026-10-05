# House of the Record — demo site

A bilingual (Arabic-first, RTL) one-pager for a fictional Beirut listening room
and cassette archive. Built to exercise the skills in `../skills/`, and to prove
the pipeline runs end to end in a sandbox.

```bash
npm install
npm run dev                  # http://localhost:5173
npm run build                # production build
node scripts/check-dom.mjs   # structure + accessibility check, no browser needed
```

## Files

```
src/content.ts      all copy, both locales, behind a typed Copy interface
src/sections.tsx    Header, Hero, How, Archive, Visit, Booking
src/App.tsx         locale state, <html lang>/<dir>, landmarks
src/index.css       design tokens, dark mode, one orchestrated reveal
scripts/check-dom.mjs   renders via Vite SSR and checks the HTML
```

## Things worth knowing

- **Arabic is the default.** The toggle switches locale *and* `dir`, using
  logical CSS properties (`ps-`, `me-`, `border-s-`) so there's a single
  stylesheet for both directions.
- **`content.ts` is typed.** Adding a key to the English copy without adding it
  to the Arabic copy is a compile error, not a bug you find in production.
- **The form is client-side only.** It validates and shows a success state;
  nothing is sent anywhere. The page says so.
- **`check-dom.mjs` exists because Playwright's browser download is blocked** in
  sandboxes without Chrome for Testing. It can't check layout or colour, only
  structure. On a normal machine, use the real `webapp-testing` skill instead.
- Copy and numbers are illustrative, not real.

See `../README.md` for the skill stack, and `../ATTRIBUTION.md` for licences.
