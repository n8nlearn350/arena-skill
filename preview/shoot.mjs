/**
 * Real browser screenshots, using the Chromium bundled inside the
 * @sparticuz/chromium npm package (no external browser download needed).
 */
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { mkdirSync } from 'node:fs'

const OUT = '/home/user/arena-skill/preview'
mkdirSync(OUT, { recursive: true })

const exe = await chromium.executablePath()
const browser = await puppeteer.launch({
  args: [...chromium.args, '--force-color-profile=srgb', '--hide-scrollbars'],
  executablePath: exe,
  headless: true,
})

const shot = async (page, name) => {
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log('  captured', name)
}

const newPage = async (w = 1440, h = 900) => {
  const p = await browser.newPage()
  await p.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  return p
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/* ---------------- The cinematic experience site ---------------- */
console.log('\nCinematic site (5174)')
{
  const page = await newPage()
  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 60000 })

  // Let the preloader run and hand off.
  await sleep(1200)
  await shot(page, '01-preloader')

  await sleep(3000)
  await shot(page, '02-hero')

  // Scroll in steps so the scroll-scrubbed transform actually settles.
  await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.9 }))
  await sleep(1200)
  await shot(page, '03-hero-scrubbed')

  const moments = await page.$('#moments')
  if (moments) {
    await page.evaluate((el) => el.scrollIntoView({ block: 'center' }), moments)
    await sleep(1400)
    await shot(page, '04-moments-disc')

    // Rotate the disc with the keyboard and capture the change.
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await sleep(1200)
    await shot(page, '05-disc-rotated')
  }

  // Partnerships accordion: open a different row.
  const partnerButtons = await page.$$('section button[aria-expanded]')
  if (partnerButtons.length > 3) {
    await page.evaluate((el) => el.scrollIntoView({ block: 'center' }), partnerButtons[3])
    await sleep(600)
    await partnerButtons[3].click()
    await sleep(900)
    await shot(page, '06-accordion')
  }

  // Mobile
  const mobile = await newPage(390, 844)
  await mobile.goto('http://localhost:5174/', { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(3400)
  await shot(mobile, '07-mobile-hero')

  // Console errors would mean a broken runtime.
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.reload({ waitUntil: 'networkidle2' })
  await sleep(3000)
  console.log('  runtime errors:', errors.length ? errors : 'none')
  await page.close()
  await mobile.close()
}

/* ---------------- The Arabic demo site ---------------- */
console.log('\nArabic demo site (5173)')
{
  const page = await newPage()
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(1500)
  await shot(page, '10-arabic-hero')

  // Full page, to show the whole thing in one image.
  await page.screenshot({ path: `${OUT}/11-arabic-full.png`, fullPage: true })
  console.log('  captured 11-arabic-full')

  // The English toggle, to prove the switch works.
  const toggle = await page.$('header button[type="button"]')
  if (toggle) {
    await toggle.click()
    await sleep(900)
    await shot(page, '12-english-toggle')
  }

  // Mobile
  const mobile = await newPage(390, 844)
  await mobile.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 60000 })
  await sleep(1200)
  await shot(mobile, '13-arabic-mobile')
  await mobile.close()
  await page.close()
}

await browser.close()
console.log('\nDone. Images in', OUT)
