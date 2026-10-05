/**
 * Structure & accessibility check for the experience site.
 *
 * Renders through Vite's SSR loader. It cannot check layout or motion — only
 * structure, and the copy that actually reaches the DOM.
 *
 *   node scripts/check-dom.mjs
 */
import { createServer } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const server = await createServer({
  root,
  logLevel: 'error',
  server: { middlewareMode: true },
  appType: 'custom',
})

const failures = []
const notes = []
const check = (label, ok, detail = '') =>
  ok ? notes.push(`  ok    ${label}`) : failures.push(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)

try {
  const [{ default: App }, { renderToStaticMarkup }, { createElement }] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    import('react-dom/server'),
    import('react'),
  ])

  const html = renderToStaticMarkup(createElement(App, { skipPreloader: true }))
  const loadingHtml = renderToStaticMarkup(createElement(App, {}))
  const errorHtml = renderToStaticMarkup(createElement(App, { simulateLoadError: true }))

  check('renders content', html.length > 4000, `${html.length} chars`)
  check('exactly one <h1>', (html.match(/<h1[\s>]/g) ?? []).length === 1)

  // Heading order must not skip a level.
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
  let jump = null
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) jump = `h${levels[i - 1]} -> h${levels[i]}`
  }
  check('no skipped heading levels', jump === null, jump ?? '')

  // Landmarks.
  check('has <main>', /<main[\s>]/.test(html))
  check('has <nav> with a label', /<nav[^>]*aria-label=/.test(html))
  check('has <footer>', /<footer[\s>]/.test(html))
  check('skip link present', /Skip to content/.test(html))

  // Interactive controls must be real buttons with accessible names.
  const buttons = [...html.matchAll(/<button[^>]*>[\s\S]*?<\/button>/g)].map((m) => m[0])
  const unnamed = buttons.filter((b) => !/aria-label=/.test(b) && !/>[^<\s]/.test(b))
  check(`${buttons.length} buttons all named`, buttons.length >= 5 && unnamed.length === 0)

  // The accordion must expose state, not just look open.
  const expanded = (html.match(/aria-expanded=/g) ?? []).length
  check('accordion exposes aria-expanded', expanded >= 6, `${expanded} found`)

  // Carousel needs a group label and a "which of how many" read-out.
  check('disc group is labelled', /role="group"[^>]*aria-label=/.test(html))
  check('disc shows position read-out', /\d\s*\/\s*\d/.test(html))

  // Images: descriptive alt + explicit dimensions.
  const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
  const thinAlt = imgs.filter((i) => !/\balt="[^"]{20,}"/.test(i))
  check(`${imgs.length} images have descriptive alt`, imgs.length >= 5 && thinAlt.length === 0,
    `${thinAlt.length} missing or too short`)
  const unsized = imgs.filter((i) => !/\bwidth="\d+"/.test(i) || !/\bheight="\d+"/.test(i))
  check('images declare width and height', unsized.length === 0)

  // The preloader must render its own failure state, not a stuck spinner.
  // Driven through the test seam, since a network failure can't happen in SSR.
  check('preloader has a retry path', /Retry loading/.test(errorHtml))
  check('preloader announces success state too', !/Retry loading/.test(loadingHtml))
  check('preloader announces progress', /aria-live="polite"/.test(loadingHtml))
  check('preloader shows a percentage', /\d+%/.test(loadingHtml))

  // Nothing may claim to be affiliated with a real person or brand.
  check('disclaimer present', /Not affiliated/.test(html))

  // Copy checks: the demo must not ship real protected marks as its own.
  check('uses an invented subject', /The Eighteen/.test(html))
  const realNames = ['Justin Jefferson', 'Vikings', 'NFL', 'JJets']
  const leaked = realNames.filter((n) => html.includes(n))
  check('no real athlete/team marks in the build', leaked.length === 0, leaked.join(', '))
} finally {
  await server.close()
}

console.log('\nStructure & accessibility check\n')
console.log(notes.join('\n'))
if (failures.length) {
  console.log('\n' + failures.join('\n'))
  console.log(`\n${failures.length} failed\n`)
  process.exit(1)
}
console.log('\nAll checks passed.\n')
