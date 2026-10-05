import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'

const files = process.argv.slice(2)
for (const file of files) {
  const html = readFileSync(file, 'utf8')
  const errors = []
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(win) {
      // Minimal polyfills for APIs jsdom lacks but the bundles touch.
      win.matchMedia ??= (q) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} })
      win.ResizeObserver ??= class { observe() {} unobserve() {} disconnect() {} }
      win.IntersectionObserver ??= class { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
      win.requestAnimationFrame ??= (cb) => setTimeout(() => cb(Date.now()), 16)
      win.cancelAnimationFrame ??= (id) => clearTimeout(id)
      win.scrollTo ??= () => {}
      win.onerror = (msg) => errors.push(String(msg))
    },
  })
  win_error: {
    dom.window.addEventListener('error', (e) => errors.push(e.message))
  }
  await new Promise((r) => setTimeout(r, 2500))

  const root = dom.window.document.getElementById('root')
  const text = root ? root.textContent.trim() : ''
  const imgs = dom.window.document.querySelectorAll('img').length
  const hasDataImgs = [...dom.window.document.querySelectorAll('img')].filter(i => i.src.startsWith('data:')).length

  console.log(`\n${file.split('/').pop()}`)
  console.log('  #root موجود        :', !!root)
  console.log('  محتوى مُصيَّر (حرف):', text.length)
  console.log('  <img> عناصر        :', imgs, `(${hasDataImgs} بـ data URI)`)
  console.log('  أول النص          :', JSON.stringify(text.slice(0, 90)))
  console.log('  أخطاء تشغيل       :', errors.length ? errors.slice(0, 3) : 'لا شيء ✓')
  console.log(text.length > 200 ? '  ✅ الصفحة تعمل' : '  ❌ الصفحة فارغة')
}
