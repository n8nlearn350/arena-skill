import { useEffect, useState } from 'react'
import { copy, type Locale } from './content'
import { Archive, Booking, Header, Hero, How, Rule, Visit } from './sections'

export default function App({ initialLocale = 'ar' }: { initialLocale?: Locale } = {}) {
  // A Beirut listening room: Arabic is the default, English is the toggle.
  // initialLocale exists so the structure check in scripts/ can render both.
  const [locale, setLocale] = useState<Locale>(initialLocale)
  const t = copy[locale]

  useEffect(() => {
    const root = document.documentElement
    root.lang = locale
    root.dir = t.dir
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [locale, t])

  const toggle = () => setLocale((l) => (l === 'ar' ? 'en' : 'ar'))

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:bg-[var(--text)] focus:px-4 focus:py-2 focus:text-[var(--surface)]"
      >
        {t.skip}
      </a>

      <Header t={t} locale={locale} onToggleLocale={toggle} />

      <main id="main">
        <Hero t={t} />
        <Rule />
        <How t={t} />
        <Archive t={t} />
        <Visit t={t} />
        <Booking t={t} />
      </main>

      <footer className="border-t border-[var(--rule)]">
        <div className="mx-auto flex max-w-[76rem] flex-col gap-2 px-5 py-8 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>{t.footer.made}</p>
          <p>{t.footer.credit}</p>
        </div>
      </footer>
    </>
  )
}
