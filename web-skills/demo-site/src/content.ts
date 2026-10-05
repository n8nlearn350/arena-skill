export type Locale = 'ar' | 'en'

export interface Copy {
  dir: 'rtl' | 'ltr'
  meta: { title: string; description: string }
  langToggle: { label: string; to: string }
  skip: string
  brand: { name: string; sub: string; wordmark: string }
  nav: { archive: string; how: string; visit: string; book: string }
  hero: {
    kicker: string
    h1: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
    figureAlt: string
    figureCaption: string
  }
  how: { heading: string; intro: string; steps: { n: string; title: string; body: string }[] }
  archive: {
    heading: string
    body: string
    figureAlt: string
    figureCaption: string
    stats: { value: string; label: string }[]
  }
  visit: {
    heading: string
    addressLabel: string
    address: string
    hoursLabel: string
    hours: { day: string; time: string; closed?: boolean }[]
    priceLabel: string
    price: string
    note: string
  }
  book: {
    heading: string
    intro: string
    name: string
    email: string
    date: string
    request: string
    requestHint: string
    optional: string
    submit: string
    errors: { name: string; email: string; date: string }
    successTitle: string
    successBody: string
    again: string
    notWired: string
  }
  footer: { made: string; credit: string }
}

const en: Copy = {
  dir: 'ltr',
  meta: {
    title: 'House of the Record — listening room & cassette archive, Beirut',
    description:
      'A listening room and cassette archive in Mar Mikhael, Beirut. 4,200 cassettes, 1,100 records, one turntable, twenty-eight seats.',
  },
  langToggle: { label: 'العربية', to: 'Switch to Arabic' },
  skip: 'Skip to content',
  brand: { name: 'House of the Record', sub: 'Mar Mikhael, Beirut', wordmark: 'HOTR' },
  nav: { archive: 'The archive', how: 'Listening hour', visit: 'Visit', book: 'Book' },
  hero: {
    kicker: 'Listening room & cassette archive',
    h1: 'Sit down. We will put something on.',
    lead: 'Four thousand two hundred cassettes and eleven hundred records sit on open shelves in a single room in Mar Mikhael. Come with a name and we will find it. Come with nothing and we will choose for you.',
    ctaPrimary: 'Book a listening hour',
    ctaSecondary: 'What is on the shelves',
    figureAlt:
      'Floor-to-ceiling wooden shelves of records and cassettes, a worn leather armchair facing a turntable, late afternoon light through the shutters.',
    figureCaption:
      'The room, 4pm. Twenty-eight seats, one turntable, no screens, no wi-fi worth mentioning.',
  },
  how: {
    heading: 'How a listening hour works',
    intro: 'Ninety minutes, one room, one door that stays shut.',
    steps: [
      {
        n: '01',
        title: 'You name it',
        body: 'A singer, a year, a wedding, a city, a song you half remember from a taxi. Or say nothing at all and leave it to us.',
      },
      {
        n: '02',
        title: 'We pull it from the shelves',
        body: 'We set it up before you arrive. Anything that only exists on cassette, we digitise as you listen, and you leave with the files.',
      },
      {
        n: '03',
        title: 'You sit',
        body: 'No one interrupts. Tea comes in at the halfway mark and then the door closes again.',
      },
    ],
  },
  archive: {
    heading: 'What is on the shelves',
    body: 'Uncatalogued Lebanese, Egyptian, Armenian and Greek pressings from the 1950s onward, bought at estate sales, from shuttered shops and out of three apartments in Hamra. Nothing here is for sale. All of it is for listening.',
    figureAlt:
      'Overhead view of worn 1970s cassette J-cards and paper record sleeves arranged on grey cardboard.',
    figureCaption: 'A box from the Hamra apartment, sorted. About 200 of the 4,200.',
    stats: [
      { value: '4,200', label: 'cassettes' },
      { value: '1,100', label: 'records' },
      { value: '300', label: 'reel-to-reel tapes' },
      { value: '60', label: 'years, 1950s onward' },
    ],
  },
  visit: {
    heading: 'Visit',
    addressLabel: 'Where',
    address: 'Third floor, above the print shop, Armenia Street, Mar Mikhael, Beirut',
    hoursLabel: 'Hours',
    hours: [
      { day: 'Tuesday to Thursday', time: '12:00 — 21:00' },
      { day: 'Friday to Saturday', time: '12:00 — 23:00' },
      { day: 'Sunday', time: '14:00 — 20:00' },
      { day: 'Monday', time: 'Closed', closed: true },
    ],
    priceLabel: 'What it costs',
    price: 'Entry is free. A listening hour is 25,000 L.L. Digitising is by donation.',
    note: 'Ring the second bell. The lift has been broken since 2019 and we have stopped pretending otherwise.',
  },
  book: {
    heading: 'Book a listening hour',
    intro: 'Tell us the day and, if you like, what you want to hear.',
    name: 'Your name',
    email: 'Email',
    date: 'Day you want to come',
    request: 'What do you want to hear',
    requestHint: 'Optional. A singer, a year, a song, or leave it blank.',
    optional: 'optional',
    submit: 'Send the request',
    errors: {
      name: 'Please tell us your name.',
      email: 'That email does not look complete.',
      date: 'Please pick a day.',
    },
    successTitle: 'Request received',
    successBody:
      'We answer every request within a day. If the shelves have what you are after, we will tell you honestly, and if they do not, we will tell you who does.',
    again: 'Send another request',
    notWired: 'Demo form — nothing is sent anywhere.',
  },
  footer: {
    made: 'Run by three people and a cat named Fairuz.',
    credit: 'Demo site. Copy and numbers are illustrative.',
  },
}

const ar: Copy = {
  dir: 'rtl',
  meta: {
    title: 'بيت الأسطوانة — غرفة استماع وأرشيف أشرطة في بيروت',
    description:
      'غرفة استماع وأرشيف أشرطة في مار مخايل، بيروت. 4,200 شريط و1,100 أسطوانة، مسجّل واحد، وثمانية وعشرون مقعدًا.',
  },
  langToggle: { label: 'English', to: 'التبديل إلى الإنكليزية' },
  skip: 'تخطَّ إلى المحتوى',
  brand: { name: 'بيت الأسطوانة', sub: 'مار مخايل، بيروت', wordmark: 'بيت' },
  nav: { archive: 'الأرشيف', how: 'ساعة الاستماع', visit: 'الزيارة', book: 'احجز' },
  hero: {
    kicker: 'غرفة استماع وأرشيف أشرطة',
    h1: 'اجلس. سنضع لك شيئًا على المسجّل.',
    lead: 'أربعة آلاف ومئتا شريط وألف ومئة أسطوانة على رفوف مفتوحة في غرفة واحدة في مار مخايل. تعال باسم، نجده لك. أو تعال بلا شيء، ونحن نختار.',
    ctaPrimary: 'احجز ساعة استماع',
    ctaSecondary: 'ما على الرفوف',
    figureAlt:
      'رفوف خشبية من الأرض إلى السقف مملوءة بالأسطوانات والأشرطة، وكرسي جلد قديم أمام مسجّل، وضوء العصر يدخل من الشيش.',
    figureCaption:
      'الغرفة، الرابعة بعد الظهر. ثمانية وعشرون مقعدًا، مسجّل واحد، لا شاشات، ولا واي فاي يستحق الذكر.',
  },
  how: {
    heading: 'كيف تسير ساعة الاستماع',
    intro: 'تسعون دقيقة، غرفة واحدة، وباب يبقى مغلقًا.',
    steps: [
      {
        n: '٠١',
        title: 'تقول لنا ما تريد',
        body: 'مغنٍّ، سنة، عرس، مدينة، أغنية تذكرها نصف ذكرى من سيارة أجرة. أو لا تقل شيئًا واترك الأمر لنا.',
      },
      {
        n: '٠٢',
        title: 'ننتقيه من الرفوف',
        body: 'نجهّزه قبل وصولك. وكل ما هو موجود على شريط فقط، نرقمنه أثناء استماعك، فتخرج ومعك الملفات.',
      },
      {
        n: '٠٣',
        title: 'تجلس أنت',
        body: 'لا أحد يقاطعك. يصل الشاي في منتصف الوقت، ثم يُغلق الباب مرة أخرى.',
      },
    ],
  },
  archive: {
    heading: 'ما على الرفوف',
    body: 'طبعات لبنانية ومصرية وأرمنية ويونانية غير مفهرسة، من الخمسينيات حتى اليوم، جُمعت من بيوع تركات ودكاكين مقفلة ومن ثلاث شقق في الحمرا. لا شيء هنا للبيع. كل شيء هنا للاستماع.',
    figureAlt: 'منظر من الأعلى لأغلفة أشرطة وكراتين أسطوانات قديمة مرصوصة على كرتون رمادي.',
    figureCaption: 'صندوق من شقة الحمرا، مرتّب. نحو ٢٠٠ من أصل ٤,٢٠٠.',
    stats: [
      { value: '4,200', label: 'شريط كاسيت' },
      { value: '1,100', label: 'أسطوانة' },
      { value: '300', label: 'بكرة تسجيل' },
      { value: '60', label: 'سنة، من الخمسينيات' },
    ],
  },
  visit: {
    heading: 'الزيارة',
    addressLabel: 'المكان',
    address: 'الطابق الثالث، فوق المطبعة، شارع أرمينيا، مار مخايل، بيروت',
    hoursLabel: 'أوقات العمل',
    hours: [
      { day: 'الثلاثاء إلى الخميس', time: '١٢:٠٠ — ٢١:٠٠' },
      { day: 'الجمعة والسبت', time: '١٢:٠٠ — ٢٣:٠٠' },
      { day: 'الأحد', time: '١٤:٠٠ — ٢٠:٠٠' },
      { day: 'الاثنين', time: 'مغلق', closed: true },
    ],
    priceLabel: 'الكلفة',
    price: 'الدخول مجاني. ساعة الاستماع ٢٥,٠٠٠ ل.ل. والترقيم تبرّع.',
    note: 'دقّ الجرس الثاني. المصعد معطّل منذ ٢٠١٩ وتوقّفنا عن ادّعاء غير ذلك.',
  },
  book: {
    heading: 'احجز ساعة استماع',
    intro: 'قل لنا اليوم، وإن أردت، ما تريد سماعه.',
    name: 'اسمك',
    email: 'البريد الإلكتروني',
    date: 'اليوم الذي تريد القدوم فيه',
    request: 'ماذا تريد أن تسمع',
    requestHint: 'اختياري. مغنٍّ، سنة، أغنية، أو اتركه فارغًا.',
    optional: 'اختياري',
    submit: 'أرسل الطلب',
    errors: {
      name: 'قل لنا اسمك من فضلك.',
      email: 'يبدو البريد الإلكتروني ناقصًا.',
      date: 'اختر يومًا من فضلك.',
    },
    successTitle: 'وصل الطلب',
    successBody:
      'نجيب على كل طلب خلال يوم. إن كان ما تبحث عنه على الرفوف قلنا لك بصراحة، وإن لم يكن، قلنا لك عند مَن هو.',
    again: 'أرسل طلبًا آخر',
    notWired: 'نموذج تجريبي — لا يُرسل إلى أي جهة.',
  },
  footer: {
    made: 'يدير المكان ثلاثة أشخاص وقطة اسمها فيروز.',
    credit: 'موقع تجريبي. النصوص والأرقام للعرض فقط.',
  },
}

export const copy: Record<Locale, Copy> = { ar, en }

/**
 * Prefix a public asset with the deployment base path.
 *
 * Vite rewrites asset URLs it generates, but NOT string literals in your code —
 * so a hardcoded "/listening-room.jpg" breaks the moment the site is served
 * from a subpath. Everything that points at `public/` goes through here.
 */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/+$/, '') + (path.startsWith('/') ? path : `/${path}`)
