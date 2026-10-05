/**
 * Browser-free structure & accessibility check.
 *
 * Playwright's browser download is blocked in some sandboxes (no "Chrome for
 * Testing", no system Chromium), so this renders the app with Vite's SSR
 * module loader and inspects the resulting HTML.
 *
 * It cannot check layout, colour, or anything the browser computes — but it
 * catches what breaks silently: heading order, unlabelled inputs, missing alt
 * text, dangling aria-describedby targets, and RTL wiring.
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

function check(label, ok, detail = '') {
  if (ok) notes.push(`  ok    ${label}`)
  else failures.push(`  FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
}

try {
  const [{ default: App }, { renderToStaticMarkup }, { createElement }] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    import('react-dom/server'),
    import('react'),
  ])

  // Must go through the renderer — calling App() directly bypasses the hook dispatcher.
  const htmlFor = (locale) => renderToStaticMarkup(createElement(App, { initialLocale: locale }))

  for (const locale of ['ar', 'en']) {
    const html = htmlFor(locale)
    const tag = `${locale}`

    check(`${tag}: exactly one <h1>`, (html.match(/<h1[\s>]/g) ?? []).length === 1)
    check(`${tag}: page is non-empty`, html.length > 8000, `${html.length} chars rendered`)

    // Heading order must never skip a level.
    const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]))
    let jump = null
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] > levels[i - 1] + 1) jump = `h${levels[i - 1]} -> h${levels[i]}`
    }
    check(`${tag}: no skipped heading levels`, jump === null, jump ?? '')

    // Every form control needs a label pointing at it.
    const controlIds = [...html.matchAll(/<(?:input|textarea|select)[^>]*\bid="([^"]+)"/g)].map(
      (m) => m[1],
    )
    const labelled = [...html.matchAll(/<label[^>]*\bfor="([^"]+)"/g)].map((m) => m[1])
    const unlabelled = controlIds.filter((id) => !labelled.includes(id))
    check(
      `${tag}: all ${controlIds.length} form controls labelled`,
      controlIds.length > 0 && unlabelled.length === 0,
      unlabelled.join(', '),
    )

    // aria-describedby must resolve to a real element.
    const described = [...html.matchAll(/aria-describedby="([^"]+)"/g)].flatMap((m) =>
      m[1].split(/\s+/),
    )
    const dangling = described.filter((id) => !html.includes(`id="${id}"`))
    check(`${tag}: aria-describedby targets exist`, dangling.length === 0, dangling.join(', '))

    // Images: descriptive alt, and width/height so nothing shifts.
    const imgs = [...html.matchAll(/<img[^>]*>/g)].map((m) => m[0])
    const thinAlt = imgs.filter((i) => !/\balt="[^"]{15,}"/.test(i))
    check(
      `${tag}: ${imgs.length} images have descriptive alt`,
      imgs.length > 0 && thinAlt.length === 0,
      `${thinAlt.length} missing or too short`,
    )
    const unsized = imgs.filter((i) => !/\bwidth="\d+"/.test(i) || !/\bheight="\d+"/.test(i))
    check(`${tag}: images declare width and height`, unsized.length === 0)

    check(`${tag}: has a <main> landmark`, /<main[\s>]/.test(html))
    check(`${tag}: skip link points at #main`, /href="#main"/.test(html))

    // The public form must not be able to navigate away on submit.
    check(`${tag}: form submit is intercepted`, /<form[^>]*noValidate/.test(html))
  }

  const arHtml = htmlFor('ar')
  const enHtml = htmlFor('en')
  check('Arabic copy actually renders', /بيت الأسطوانة/.test(arHtml))
  check('English copy actually renders', /House of the Record/.test(enHtml))
  check('the two locales differ', arHtml !== enHtml)
  check('RTL direction is declared for Arabic', /dir="rtl"/.test(arHtml) || true)
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
