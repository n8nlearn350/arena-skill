import { useEffect, useState } from 'react'
import { motion, useTransform, type MotionValue } from 'motion/react'
import { site, asset } from './content'

/* ------------------------------------------------------------------ */
/* Preloader                                                          */
/* ------------------------------------------------------------------ */

/**
 * Runs a real loading sequence: it waits for the hero image to decode, runs a
 * counter to 100, then hands off with a curtain wipe. If the image fails it
 * shows the retry state instead of a stuck spinner.
 */
export function Preloader({
  onDone,
  forceError = false,
}: {
  onDone: () => void
  /** Renders the failure state. Exists so the branch is reachable in tests. */
  forceError?: boolean
}) {
  const [progress, setProgress] = useState(0)
  const [failed, setFailed] = useState(forceError)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (forceError) return
    let raf = 0
    let cancelled = false
    let loaded = false

    const img = new Image()
    img.src = asset('/hero-tunnel.jpg')
    img.decode?.().then(() => (loaded = true)).catch(() => setFailed(true))
    img.onerror = () => setFailed(true)

    const started = performance.now()
    const MIN_MS = 1400 // long enough to read, short enough not to annoy

    const tick = (now: number) => {
      if (cancelled) return
      const t = Math.min(1, (now - started) / MIN_MS)
      // Ease out, but never claim 100% until the image is actually decoded.
      const shown = Math.round(Math.min(t, loaded ? 1 : 0.94) * 100)
      setProgress(shown)

      if (t >= 1 && loaded) {
        setLeaving(true)
        window.setTimeout(() => !cancelled && onDone(), 620)
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [onDone, forceError])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col justify-between bg-[var(--bg)] px-6 py-6"
      initial={false}
      animate={leaving ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      aria-live="polite"
      aria-label={site.loading.label}
    >
      <span className="mono text-[0.68rem] text-[var(--muted)] uppercase">
        {site.hero.kicker}
      </span>

      <div className="flex flex-col items-start gap-4">
        {failed ? (
          <>
            <p className="display text-[clamp(1.6rem,5vw,3rem)] text-[var(--ink)]">
              {site.loading.failed}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mono cursor-pointer border border-[var(--hairline)] px-4 py-2 text-xs uppercase hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {site.loading.retry}
            </button>
          </>
        ) : (
          <span className="display text-[clamp(4rem,18vw,13rem)] leading-none text-[var(--ink)] tabular-nums">
            {progress}%
          </span>
        )}
      </div>

      <div className="h-px w-full bg-[var(--hairline)]">
        <div
          className="h-px bg-[var(--accent)] transition-[width] duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* Hero — the sequence is scrubbed by scroll position, not by time     */
/* ------------------------------------------------------------------ */

export function Hero({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // 0 -> pinned full frame, 1 -> pushed back and dimmed so the copy can breathe.
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.82])
  const opacity = useTransform(scrollYProgress, [0, 0.45], [1, 0.15])
  const blur = useTransform(scrollYProgress, [0, 0.5], ['blur(0px)', 'blur(6px)'])
  const copyY = useTransform(scrollYProgress, [0, 0.5], ['0%', '-18%'])
  const copyOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0])

  return (
    <section className="relative h-[190svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <motion.img
          src={asset('/hero-tunnel.jpg')}
          alt={site.hero.imageAlt}
          width={1408}
          height={768}
          style={{ scale, opacity, filter: blur }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Vignette so the type stays legible over the light source */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 45%, transparent 20%, rgba(5,7,10,0.55) 70%, rgba(5,7,10,0.92) 100%)',
          }}
        />

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="relative z-10 w-full max-w-[86rem] px-6 text-center"
        >
          <p className="mono text-[0.68rem] text-[var(--bone)]/70 uppercase">{site.hero.kicker}</p>
          <h1 className="display mt-4 text-[clamp(2.8rem,13vw,11rem)] text-[var(--bone)]">
            {site.hero.name}
          </h1>
          <p className="mx-auto mt-6 max-w-[46ch] text-[0.98rem] text-[var(--bone)]/75">
            {site.hero.standfirst}
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: copyOpacity }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        >
          <span className="mono text-[0.6rem] text-[var(--bone)]/50 uppercase">
            {site.hero.scrubHint}
          </span>
          <motion.span
            aria-hidden="true"
            className="block h-10 w-px bg-[var(--bone)]/40"
            animate={{ scaleY: [0.25, 1, 0.25], originY: [0, 0, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Signature moments — rotating disc, driven by drag or arrow keys     */
/* ------------------------------------------------------------------ */

export function MomentsDisc() {
  const [angle, setAngle] = useState(0)
  const count = site.moments.length
  const step = 360 / count

  // Which moment is nearest the front of the disc.
  const activeIndex = ((Math.round(-angle / step) % count) + count) % count
  const active = site.moments[activeIndex]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setAngle((a) => a - step)
      if (e.key === 'ArrowLeft') setAngle((a) => a + step)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step])

  const radius = 260

  return (
    <section id="moments" className="relative hairline-t py-20 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-6">
        <h2 className="display text-[clamp(1.9rem,5vw,3.6rem)] text-[var(--ink)]">
          {site.momentsSection.heading}
        </h2>

        {/* The disc: absolutely-positioned cards on a circle, rotated as one. */}
        <div
          className="relative mx-auto mt-14 h-[360px] w-full max-w-[640px] touch-pan-y select-none"
          role="group"
          aria-label={site.momentsSection.hint}
        >
          <motion.div
            className="absolute inset-0"
            style={{ perspective: 1200 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            onDragEnd={(_, info) => {
              const flick = info.offset.x + info.velocity.x * 0.12
              if (Math.abs(flick) < 40) return
              setAngle((a) => a + (flick > 0 ? step : -step))
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ rotateY: -angle }}
              transition={{ type: 'spring', stiffness: 60, damping: 18 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {site.moments.map((m, i) => {
                const theta = i * step
                return (
                  <div
                    key={m.id}
                    className="absolute top-1/2 left-1/2 h-[320px] w-[210px] -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
                    }}
                  >
                    <img
                      src={asset(m.image)}
                      alt={m.alt}
                      width={1408}
                      height={768}
                      loading="lazy"
                      className="h-full w-full border border-[var(--hairline)] object-cover"
                      style={{
                        opacity: activeIndex === i ? 1 : 0.35,
                        transition: 'opacity 400ms ease',
                      }}
                    />
                  </div>
                )
              })}
            </motion.div>
          </motion.div>

          {/* Read-out for whichever card is at the front */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 text-center">
            <span className="mono text-[0.68rem] text-[var(--accent)]">{active.index}</span>
            <span className="display text-[1.3rem] text-[var(--ink)]">{active.title}</span>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAngle((a) => a + step)}
            aria-label="Previous moment"
            className="mono cursor-pointer border border-[var(--hairline)] px-4 py-2 text-xs uppercase hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            ←
          </button>
          <span className="mono text-[0.62rem] text-[var(--muted)] uppercase">
            {activeIndex + 1} / {count}
          </span>
          <button
            type="button"
            onClick={() => setAngle((a) => a - step)}
            aria-label="Next moment"
            className="mono cursor-pointer border border-[var(--hairline)] px-4 py-2 text-xs uppercase hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            →
          </button>
        </div>

        <p className="mx-auto mt-8 max-w-[54ch] text-center text-[0.95rem] text-[var(--muted)]">
          {active.caption}
        </p>
        <p className="mono mt-3 text-center text-[0.68rem] text-[var(--ink)] uppercase">
          {active.stat}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Foundation + Partnerships                                          */
/* ------------------------------------------------------------------ */

export function Foundation() {
  return (
    <section className="hairline-t py-20 sm:py-28">
      <div className="mx-auto grid max-w-[86rem] gap-10 px-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="display text-[clamp(1.9rem,5vw,3.6rem)] text-[var(--ink)]">
            {site.foundation.heading}
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-[52ch] text-[1.02rem] text-[var(--muted)]">{site.foundation.body}</p>
          <a
            href="#moments"
            className="mono mt-8 inline-block border-b border-[var(--accent)] pb-1 text-xs text-[var(--accent)] uppercase no-underline"
          >
            {site.foundation.cta}
          </a>
        </div>
      </div>
    </section>
  )
}

export function Partnerships() {
  const [open, setOpen] = useState(0)

  return (
    <section className="hairline-t py-20 sm:py-28">
      <div className="mx-auto max-w-[86rem] px-6">
        <h2 className="display text-[clamp(1.9rem,5vw,3.6rem)] text-[var(--ink)]">
          {site.partnerships.heading}
        </h2>
        <p className="mt-4 max-w-[46ch] text-[var(--muted)]">{site.partnerships.intro}</p>

        <ul className="mt-12 list-none p-0">
          {site.partners.map((p, i) => {
            const isOpen = open === i
            return (
              <li key={p.name} className="hairline-t">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 bg-transparent py-5 text-left"
                  >
                    <span className="display text-[clamp(1.4rem,3.6vw,2.4rem)] text-[var(--ink)]">
                      {p.name}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mono text-lg text-[var(--muted)] transition-transform duration-300"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'none' }}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] pb-6 text-[0.98rem] text-[var(--muted)]">{p.note}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                             */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="hairline-t py-12">
      <div className="mx-auto max-w-[86rem] px-6">
        <dl className="grid gap-6 sm:grid-cols-3">
          {site.footer.colophon.map(([k, v]) => (
            <div key={k}>
              <dt className="mono text-[0.6rem] text-[var(--muted)] uppercase">{k}</dt>
              <dd className="mt-1 text-sm text-[var(--ink)]">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mono mt-10 max-w-[70ch] text-[0.65rem] leading-relaxed text-[var(--muted)] uppercase">
          {site.footer.credit}
        </p>
      </div>
    </footer>
  )
}
