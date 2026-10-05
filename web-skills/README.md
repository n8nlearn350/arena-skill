# Web-building skills for an agent sandbox — tested, not just listed

Short version: **17 skills for building websites, vendored into `skills/`, with a
one-command installer — plus a real bilingual site built with them as proof.**

Everything below was tested by actually cloning, installing and running it in a
sandbox, not read off a README. Where something failed, it says so.

---

## The verdict table

Tested in a Debian/Node 22/Python 3.11 sandbox with a hard network allowlist.
"Works" means I ran it, not that it looks promising.

| Skill | Upstream | What it's for | Verdict |
| --- | --- | --- | --- |
| `frontend-design` | anthropics/skills | Forces distinctive design instead of the default AI look | ✅ best single skill here |
| `vercel-react-best-practices` | vercel-labs/agent-skills | 70 React/Next rules, impact-ordered | ✅ works |
| `composition-patterns` | vercel-labs/agent-skills | Component API design, compound components | ✅ works |
| `web-design-guidelines` | vercel-labs/agent-skills | UI/a11y review pass, `file:line` findings | ⚠️ needs network at run time |
| `tailwind-v4-shadcn` | secondsky/claude-skills | Tailwind v4 + shadcn wiring | ✅ works |
| `design-system-creation` | secondsky/claude-skills | Token sets and component systems | ✅ works |
| `responsive-web-design` | secondsky/claude-skills | Breakpoints, fluid layout | ✅ works |
| `mobile-first-design` | secondsky/claude-skills | Small-screen-first layout | ✅ works |
| `interaction-design` | secondsky/claude-skills | States, feedback, motion | ✅ works |
| `design-review` | secondsky/claude-skills | Critique pass over a built UI | ✅ works |
| `seo-optimizer` | secondsky/claude-skills | Meta, structure, crawlability | ✅ works |
| `brainstorming` | obra/superpowers | Stops you building before requirements exist | ✅ works |
| `writing-plans` | obra/superpowers | Breaks work into small verifiable steps | ✅ works |
| `systematic-debugging` | obra/superpowers | Root cause before fixes | ✅ works |
| `verification-before-completion` | obra/superpowers | Evidence before "done" | ✅ works |
| `brand-guidelines` | anthropics/skills | Applies a brand's palette and type rules | ✅ works |
| `web-artifacts-builder` | anthropics/skills | Bundling, single-file HTML output | ✅ works |

### Worth knowing about, not vendored

| Skill | Why it's not in `skills/` |
| --- | --- |
| `ui-ux-pro-max-skill` | 30 MB of reference images. Genuinely comprehensive — clone it directly if you want it. |
| `taste-skill` | 9 MB, 11 aesthetic variants. Framework-agnostic, works well with `frontend-design`. |
| `canvas-design` | 5.6 MB of assets. Great for PNG/PDF design output. |
| `webapp-testing`, `playwright-skill` | They drive a real browser — see the blocker below. Fine on a normal machine. |
| `deploy-to-vercel` | Needs a Vercel token. Works, but it's a deployment skill, not a build skill. |

---

## What I actually verified

**Works:**

- `npm install`, `pip install`, `git clone` from GitHub, `gh` (already authenticated)
- **Vite + React + TypeScript + Tailwind v4** — scaffolded and built clean in 283 ms
- Self-hosted webfonts via `@fontsource-variable` — no Google Fonts CDN dependency
- Image generation for real site assets
- `sudo` present; `apt` cannot reach its mirrors, so system packages fail
  (I route around it from PyPI — e.g. `imageio-ffmpeg`, `pypandoc-binary`)

**Blocked — plan around it:**

- **No browser.** No Chromium, Chrome or Firefox binary, and Playwright's browser
  download is refused (`Failed to download Chrome for Testing`). So *anything that
  drives a real browser cannot run here* — that's `webapp-testing`,
  `playwright-skill`, and screenshot-based design review.
- **The network is allowlisted.** `api.github.com`, PyPI and npm work;
  `fonts.googleapis.com`, `raw.githubusercontent.com`, `wikipedia`, `huggingface`
  and `api.anthropic.com` do not. This is why fonts are self-hosted and why
  `web-design-guidelines` is marked ⚠️ — it fetches its rules from
  `raw.githubusercontent.com` on every run.
- **This is a Claude Code skill collection.** Skills themselves are just
  `SKILL.md` plus scripts, so the knowledge applies anywhere — but the
  `/plugin marketplace` install path is Claude Code only.

**The workaround for the missing browser:** `demo-site/scripts/check-dom.mjs`
renders the app through Vite's SSR loader and inspects the HTML. It can't check
layout or colour, but it catches what breaks silently — heading order, unlabelled
inputs, thin `alt` text, dangling `aria-describedby`, missing `width`/`height`.
It found and I fixed one real bug with it.

---

## Install

```bash
cd web-skills
./install.sh              # into ./.claude/skills  (this project)
./install.sh --global     # into ~/.claude/skills  (every project)
./install.sh --refresh    # re-download everything from upstream first
```

17 skills, ~1.1 MB, no network needed. The installer **won't overwrite** a skill
you already have with the same name. Restart Claude Code afterwards.

---

## Proof: a real site built with the stack

`demo-site/` is a complete bilingual (Arabic-first / English) one-pager for a
fictional Beirut listening room and cassette archive. Not a screenshot — it runs.

```bash
cd web-skills/demo-site
npm install
npm run dev      # http://localhost:5173
npm run build    # production build
node scripts/check-dom.mjs   # structure & a11y check, no browser needed
```

What's in it and which skill each part came from:

| Part | Skill applied |
| --- | --- |
| Palette, type scale, layout, self-critique pass | `frontend-design` |
| Logical CSS properties so RTL mirrors correctly, no duplicated stylesheet | `responsive-web-design`, `interaction-design` |
| Arabic + Latin from one family (Alexandria), self-hosted | `design-system-creation` |
| Semantic landmarks, labelled controls, `aria-invalid`/`aria-describedby`, skip link, lazy images with explicit dimensions, `prefers-reduced-motion` | `web-design-guidelines` |
| Typed content module with a `Copy` interface — a missing translation is a compile error | `vercel-react-best-practices` |
| Meta description, title, `theme-color` | `seo-optimizer` |

The design deliberately avoids the five AI tells the `frontend-design` skill
enumerates — no warm-cream-and-terracotta palette, no `01 / 02 / 03` markers
except where the content genuinely is a sequence, no fade-up on every section,
one orchestrated reveal instead. Two AI-generated photographs, generated to a
brief with specific film stock, lighting and colour direction, and no text in
frame.

**Verified:** TypeScript clean (`tsc -b` exits 0), production build 283 ms, all
24 structure checks pass for both locales.

### Two honest caveats on the demo

- The booking form is **client-side only**. It validates and shows a success
  state; nothing is sent anywhere. It says so on the page.
- Copy and numbers (4,200 cassettes, 25,000 L.L.) are illustrative.

---

## Recommended stack, in order

1. **`frontend-design`** — the biggest single quality jump. Install this one even
   if you install nothing else.
2. `vercel-react-best-practices` + `composition-patterns` if you're writing React.
3. `tailwind-v4-shadcn` + `design-system-creation` for consistent components.
4. `web-design-guidelines` before you ship — on a machine that can reach GitHub.
5. `brainstorming` → `writing-plans` → `verification-before-completion` for
   anything bigger than a landing page.

Licences and upstream links for every skill are in [ATTRIBUTION.md](ATTRIBUTION.md).
The vendored skills are third-party work and are not covered by this repo's MIT
licence.
