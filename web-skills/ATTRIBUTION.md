# Attribution

The skills under `skills/` are **not** mine and are **not** covered by this
repository's MIT licence. They are vendored copies of third-party work so the
stack can be installed without network access. Each keeps its upstream
`SKILL.md` unchanged.

| Skill folder | Upstream repository | Licence |
| --- | --- | --- |
| `frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 (`LICENSE.txt` kept) |
| `brand-guidelines` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 (`LICENSE.txt` kept) |
| `web-artifacts-builder` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 (`LICENSE.txt` kept) |
| `vercel-react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT (declared in `SKILL.md`) |
| `web-design-guidelines` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT (declared in `SKILL.md`) |
| `composition-patterns` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | MIT (declared in `SKILL.md`) |
| `brainstorming` | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| `writing-plans` | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| `systematic-debugging` | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| `verification-before-completion` | [obra/superpowers](https://github.com/obra/superpowers) | MIT |
| `tailwind-v4-shadcn` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `design-review` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `design-system-creation` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `responsive-web-design` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `mobile-first-design` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `seo-optimizer` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |
| `interaction-design` | [secondsky/claude-skills](https://github.com/secondsky/claude-skills) | MIT |

Skills that were **deliberately not vendored** and why:

- `canvas-design`, `ui-ux-pro-max-skill`, `taste-skill` — 5–30 MB each, mostly
  reference images. Clone them directly if you want them.
- `webapp-testing`, `playwright-skill` — they drive a real browser, which is
  blocked in this sandbox (see the README). They work fine on a normal machine.

## Other projects named in the report

- [obra/superpowers](https://github.com/obra/superpowers) — MIT
- [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) — MIT
- [secondsky/claude-skills](https://github.com/secondsky/claude-skills) — MIT
- [anthropics/skills](https://github.com/anthropics/skills) — Apache-2.0
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills) — curated list
- Fonts: [Alexandria](https://github.com/alif-type/alexandria) and
  [Bricolage Grotesque](https://github.com/ateliertriay/bricolage), via
  `@fontsource-variable`, both SIL Open Font License 1.1.
- The two photographs in `demo-site/public/` are AI-generated for this demo.

`--refresh` in `install.sh` re-downloads everything from these upstreams.
