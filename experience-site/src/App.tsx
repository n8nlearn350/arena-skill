import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'motion/react'
import { site } from './content'
import { Footer, Foundation, Hero, MomentsDisc, Partnerships, Preloader } from './sections'

export default function App({
  skipPreloader = false,
  simulateLoadError = false,
}: {
  skipPreloader?: boolean
  /** Test seam: renders the preloader in its failure state. */
  simulateLoadError?: boolean
} = {}) {
  const [loading, setLoading] = useState(!skipPreloader)
  const heroRef = useRef<HTMLDivElement>(null)

  // 0 at the top of the page, 1 once the hero has been scrolled past.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  useEffect(() => {
    document.documentElement.lang = 'en'
    document.title = site.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.meta.description)
  }, [])

  useEffect(() => {
    document.body.dataset.loading = String(loading)
  }, [loading])

  // Respect reduced motion: skip the sequence entirely, don't just speed it up.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setLoading(false)
  }, [])

  return (
    <div className="grain">
      {loading && (
        <Preloader onDone={() => setLoading(false)} forceError={simulateLoadError} />
      )}

      <a
        href="#moments"
        className="mono sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[70] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-xs focus:text-[var(--color-void)] focus:uppercase"
      >
        Skip to content
      </a>

      <header className="fixed top-0 z-40 w-full">
        <div className="mx-auto flex max-w-[86rem] items-center justify-between px-6 py-5">
          <span className="mono text-[0.68rem] text-[var(--ink)] uppercase">The Eighteen</span>
          <nav className="hidden gap-6 sm:flex" aria-label="Sections">
            {(
              [
                ['#moments', 'Moments'],
                ['#foundation', 'Foundation'],
                ['#partnerships', 'Partnerships'],
              ] as const
            ).map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="mono text-[0.68rem] text-[var(--muted)] uppercase no-underline hover:text-[var(--ink)]"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <div ref={heroRef}>
          <Hero scrollYProgress={scrollYProgress} />
        </div>
        <p className="mono sr-only">{site.hero.scrollNote}</p>
        <div id="foundation">
          <Foundation />
        </div>
        <MomentsDisc />
        <div id="partnerships">
          <Partnerships />
        </div>
      </main>

      <Footer />
    </div>
  )
}
