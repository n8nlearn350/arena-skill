import { useId, useState, type FormEvent } from 'react'
import type { Copy, Locale } from './content'

/* ------------------------------------------------------------------ */
/* Small pieces                                                       */
/* ------------------------------------------------------------------ */

export function Rule() {
  return <hr className="border-[var(--rule)]" />
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[0.72rem] font-semibold tracking-[0.14em] text-[var(--text-muted)] uppercase">
      <span aria-hidden="true" className="inline-block h-px w-8 bg-[var(--accent)]" />
      {children}
    </p>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 border-s-2 border-[var(--accent)] ps-3 text-[0.8rem] text-[var(--text-muted)]">
      {children}
    </figcaption>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

export function Header({
  t,
  locale,
  onToggleLocale,
}: {
  t: Copy
  locale: Locale
  onToggleLocale: () => void
}) {
  const links = [
    ['#how', t.nav.how],
    ['#archive', t.nav.archive],
    ['#visit', t.nav.visit],
  ] as const

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--rule)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[76rem] items-center gap-3 px-5 py-3 sm:px-8">
        <a href="#top" className="flex items-baseline gap-3 no-underline">
          <span className="display text-[1.15rem] text-[var(--text)]">{t.brand.name}</span>
          <span className="hidden text-xs text-[var(--text-muted)] sm:inline">{t.brand.sub}</span>
        </a>

        <nav aria-label="Primary" className="ms-auto hidden items-center gap-6 md:flex">
          {links.map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-[var(--text-muted)] no-underline hover:text-[var(--text)] hover:underline hover:underline-offset-4"
            >
              {label}
            </a>
          ))}
        </nav>

        <a
          href="#book"
          className="ms-auto border border-[var(--rule-strong)] px-3 py-1.5 text-sm font-semibold text-[var(--text)] no-underline hover:bg-[var(--text)] hover:text-[var(--surface)] md:ms-6"
        >
          {t.nav.book}
        </a>

        <button
          type="button"
          lang={locale === 'ar' ? 'en' : 'ar'}
          onClick={onToggleLocale}
          title={t.langToggle.to}
          className="cursor-pointer border border-transparent bg-transparent px-2 py-1.5 text-sm font-semibold text-[var(--link)] underline underline-offset-4"
        >
          {t.langToggle.label}
        </button>
      </div>
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */

export function Hero({ t }: { t: Copy }) {
  return (
    <section id="top" className="mx-auto max-w-[76rem] px-5 pt-10 pb-14 sm:px-8 sm:pt-16">
      <div className="grid items-end gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <Kicker>{t.hero.kicker}</Kicker>
          <h1 className="display reveal mt-5 max-w-[20ch] text-[clamp(2.4rem,6.5vw,4.6rem)] text-[var(--text)]">
            {t.hero.h1}
          </h1>
          <p className="reveal reveal-2 mt-6 max-w-[52ch] text-[1.06rem] text-[var(--text-muted)]">
            {t.hero.lead}
          </p>
          <div className="reveal reveal-3 mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#book"
              className="bg-[var(--text)] px-5 py-3 text-sm font-semibold text-[var(--surface)] no-underline hover:bg-[var(--link)]"
            >
              {t.hero.ctaPrimary}
            </a>
            <a
              href="#archive"
              className="border border-[var(--rule-strong)] px-5 py-3 text-sm font-semibold text-[var(--text)] no-underline hover:bg-[var(--text)] hover:text-[var(--surface)]"
            >
              {t.hero.ctaSecondary}
            </a>
          </div>
        </div>

        <figure className="reveal reveal-2 lg:col-span-5">
          <img
            src="/listening-room.jpg"
            alt={t.hero.figureAlt}
            width={1408}
            height={768}
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover lg:aspect-[5/6]"
          />
          <Caption>{t.hero.figureCaption}</Caption>
        </figure>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* How it works — numbered because it really is a sequence             */
/* ------------------------------------------------------------------ */

export function How({ t }: { t: Copy }) {
  return (
    <section id="how" className="border-b border-[var(--rule)] bg-[var(--surface-lift)]">
      <div className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Kicker>{t.nav.how}</Kicker>
            <h2 className="display mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] text-[var(--text)]">
              {t.how.heading}
            </h2>
            <p className="mt-4 max-w-[34ch] text-[var(--text-muted)]">{t.how.intro}</p>
          </div>

          <ol className="grid gap-px bg-[var(--rule)] p-0 lg:col-span-8 lg:grid-cols-3">
            {t.how.steps.map((s) => (
              <li key={s.n} className="bg-[var(--surface-lift)] p-6">
                <span className="block text-sm font-semibold text-[var(--accent)] tabular-nums">
                  {s.n}
                </span>
                <h3 className="display mt-3 text-[1.2rem] text-[var(--text)]">{s.title}</h3>
                <p className="mt-2 text-[0.95rem] text-[var(--text-muted)]">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Archive                                                            */
/* ------------------------------------------------------------------ */

export function Archive({ t }: { t: Copy }) {
  return (
    <section id="archive" className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <figure className="lg:order-2 lg:col-span-6">
          <img
            src="/archive-detail.jpg"
            alt={t.archive.figureAlt}
            width={1408}
            height={768}
            loading="lazy"
            className="aspect-[4/3] w-full object-cover"
          />
          <Caption>{t.archive.figureCaption}</Caption>
        </figure>

        <div className="lg:order-1 lg:col-span-6">
          <Kicker>{t.nav.archive}</Kicker>
          <h2 className="display mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] text-[var(--text)]">
            {t.archive.heading}
          </h2>
          <p className="mt-4 max-w-[54ch] text-[var(--text-muted)]">{t.archive.body}</p>

          <dl className="mt-8 grid grid-cols-2 gap-px bg-[var(--rule)] sm:grid-cols-4">
            {t.archive.stats.map((s) => (
              <div key={s.label} className="bg-[var(--surface)] py-4 pe-3">
                <dt className="text-[0.75rem] tracking-wide text-[var(--text-muted)] uppercase">
                  {s.label}
                </dt>
                <dd className="display mt-1 text-[1.7rem] text-[var(--text)] tabular-nums">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Visit                                                              */
/* ------------------------------------------------------------------ */

export function Visit({ t }: { t: Copy }) {
  return (
    <section id="visit" className="border-y border-[var(--rule)] bg-[var(--surface-lift)]">
      <div className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
        <Kicker>{t.nav.visit}</Kicker>
        <h2 className="display mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] text-[var(--text)]">
          {t.visit.heading}
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              {t.visit.addressLabel}
            </h3>
            <p className="mt-3 text-[var(--text)]">{t.visit.address}</p>
            <p className="mt-4 max-w-[38ch] text-[0.9rem] text-[var(--text-muted)]">{t.visit.note}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              {t.visit.hoursLabel}
            </h3>
            <dl className="mt-3 space-y-2">
              {t.visit.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between gap-4 border-b border-[var(--rule)] pb-2"
                >
                  <dt className={h.closed ? 'text-[var(--text-muted)]' : 'text-[var(--text)]'}>
                    {h.day}
                  </dt>
                  <dd className="text-[var(--text-muted)] tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              {t.visit.priceLabel}
            </h3>
            <p className="mt-3 max-w-[36ch] text-[var(--text)]">{t.visit.price}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Booking — client-side only; this demo has no backend               */
/* ------------------------------------------------------------------ */

type Errors = Partial<Record<'name' | 'email' | 'date', string>>

const FIELD =
  'w-full border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-2.5 text-[var(--text)] placeholder:text-[var(--text-muted)]/70'

export function Booking({ t }: { t: Copy }) {
  const uid = useId()
  const [values, setValues] = useState({ name: '', email: '', date: '', request: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const id = (field: string) => `${uid}-${field}`

  function validate(): Errors {
    const next: Errors = {}
    if (!values.name.trim()) next.name = t.book.errors.name
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) next.email = t.book.errors.email
    if (!values.date) next.date = t.book.errors.date
    return next
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length === 0) setSent(true)
  }

  function FieldError({ field }: { field: keyof Errors }) {
    if (!errors[field]) return null
    return (
      <p id={id(`${field}-error`)} className="mt-1.5 text-sm text-[var(--accent)]">
        {errors[field]}
      </p>
    )
  }

  if (sent) {
    return (
      <section id="book" className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
        <div className="max-w-[60ch] border-s-4 border-[var(--link)] ps-6">
          <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)] text-[var(--text)]">
            {t.book.successTitle}
          </h2>
          <p className="mt-4 text-[var(--text-muted)]">{t.book.successBody}</p>
          <p className="mt-4 text-sm text-[var(--text-muted)] italic">{t.book.notWired}</p>
          <button
            type="button"
            onClick={() => {
              setSent(false)
              setValues({ name: '', email: '', date: '', request: '' })
            }}
            className="mt-6 cursor-pointer border border-[var(--rule-strong)] px-4 py-2 text-sm font-semibold text-[var(--text)] hover:bg-[var(--text)] hover:text-[var(--surface)]"
          >
            {t.book.again}
          </button>
        </div>
      </section>
    )
  }

  return (
    <section id="book" className="mx-auto max-w-[76rem] px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Kicker>{t.nav.book}</Kicker>
          <h2 className="display mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] text-[var(--text)]">
            {t.book.heading}
          </h2>
          <p className="mt-4 max-w-[36ch] text-[var(--text-muted)]">{t.book.intro}</p>
          <p className="mt-6 text-sm text-[var(--text-muted)] italic">{t.book.notWired}</p>
        </div>

        <form onSubmit={onSubmit} noValidate className="lg:col-span-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor={id('name')} className="block text-sm font-semibold text-[var(--text)]">
                {t.book.name}
              </label>
              <input
                id={id('name')}
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? id('name-error') : undefined}
                className={`mt-2 ${FIELD}`}
              />
              <FieldError field="name" />
            </div>

            <div>
              <label htmlFor={id('email')} className="block text-sm font-semibold text-[var(--text)]">
                {t.book.email}
              </label>
              <input
                id={id('email')}
                name="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? id('email-error') : undefined}
                className={`mt-2 ${FIELD}`}
              />
              <FieldError field="email" />
            </div>

            <div>
              <label htmlFor={id('date')} className="block text-sm font-semibold text-[var(--text)]">
                {t.book.date}
              </label>
              <input
                id={id('date')}
                name="date"
                type="date"
                value={values.date}
                onChange={(e) => setValues({ ...values, date: e.target.value })}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? id('date-error') : undefined}
                className={`mt-2 tabular-nums ${FIELD}`}
              />
              <FieldError field="date" />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor={id('request')}
                className="block text-sm font-semibold text-[var(--text)]"
              >
                {t.book.request}
                <span className="ms-2 text-xs font-normal text-[var(--text-muted)]">
                  ({t.book.optional})
                </span>
              </label>
              <textarea
                id={id('request')}
                name="request"
                rows={3}
                value={values.request}
                onChange={(e) => setValues({ ...values, request: e.target.value })}
                aria-describedby={id('request-hint')}
                className={`mt-2 ${FIELD}`}
              />
              <p id={id('request-hint')} className="mt-1.5 text-sm text-[var(--text-muted)]">
                {t.book.requestHint}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 cursor-pointer bg-[var(--text)] px-6 py-3 text-sm font-semibold text-[var(--surface)] hover:bg-[var(--link)]"
          >
            {t.book.submit}
          </button>
        </form>
      </div>
    </section>
  )
}
