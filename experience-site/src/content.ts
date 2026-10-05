export interface Moment {
  id: string
  index: string
  title: string
  stat: string
  caption: string
  image: string
  alt: string
}

export const site = {
  meta: {
    title: 'The Eighteen — a career told in five moments',
    description:
      'An interactive single-subject experience: five signature moments, told in scroll. Built as a front-end demo.',
  },
  loading: {
    label: 'Loading the experience',
    retry: 'Retry loading',
    failed: "The experience couldn't load.",
  },
  hero: {
    kicker: 'A career in five moments',
    name: 'The Eighteen',
    standfirst:
      'From a small town in the delta to the brightest light in the stadium. Every move carries intention, style, and a story the broadcast never shows you.',
    scrubHint: 'Scroll',
    scrollNote: 'The sequence is scrubbed by your scroll position.',
    imageAlt:
      'An anonymous athlete silhouetted in a dark concrete tunnel, walking toward blinding stadium light.',
  },
  momentsSection: {
    heading: 'Signature moments',
    hint: 'Drag the disc, or use the arrow keys',
  },
  moments: [
    {
      id: 'm01',
      index: '01',
      title: 'The Breakout',
      stat: '14 REC · 227 YDS · 4 TD',
      caption:
        'The night the league found out. Four scores before the third quarter ended, and a defence with no answer left.',
      image: '/moment-01.jpg',
      alt: 'An anonymous sprinter in mid-stride, blurred by speed under stadium floodlights.',
    },
    {
      id: 'm02',
      index: '02',
      title: 'The Record',
      stat: '88 REC · 1,400 YDS · 7 TD',
      caption:
        'A single-season mark that had stood for a decade, taken apart one catch at a time across seventeen games.',
      image: '/moment-02.jpg',
      alt: 'An anonymous player seated alone on a stadium bench at night, shoulders slumped, steam rising.',
    },
    {
      id: 'm03',
      index: '03',
      title: 'The Catch',
      stat: '4TH & 18 · 32-YARD GRAB',
      caption:
        'Fourth and eighteen, the season on the line, one hand and half a second of daylight. The kind of play that gets its own name.',
      image: '/moment-03.jpg',
      alt: 'An empty locker room locker in deep shadow, holding a single unmarked jersey.',
    },
    {
      id: 'm04',
      index: '04',
      title: 'The Season',
      stat: '128 REC · 1,809 YDS · 8 TD',
      caption:
        'Not one highlight — a whole year of them. The numbers stopped being statistics and started being an argument.',
      image: '/moment-01.jpg',
      alt: 'An anonymous sprinter in mid-stride, blurred by speed under stadium floodlights.',
    },
    {
      id: 'm05',
      index: '05',
      title: 'The Honours',
      stat: '4× SELECTION · 2020–2024',
      caption:
        'Four straight years of being named among the best at the position, and the work nobody films that made it possible.',
      image: '/moment-02.jpg',
      alt: 'An anonymous player seated alone on a stadium bench at night, shoulders slumped, steam rising.',
    },
  ] as Moment[],
  foundation: {
    heading: 'Building something that lasts',
    body: 'The work away from the field: camps, drives and a foundation that puts equipment in the hands of kids who would otherwise never hold it.',
    cta: 'Learn more',
  },
  partnerships: {
    heading: 'Partnerships',
    intro: 'Six houses, one athlete. What each of them is actually paying for.',
  },
  partners: [
    { name: 'Under Armour', note: 'The signature deal. Custom game-day footwear and a seat at the design table in Baltimore.' },
    { name: 'Gatorade', note: 'Hydration partner across campaigns, sideline visibility and a fixed slot in the game-day rotation.' },
    { name: 'Pepsi', note: 'National campaigns, co-starring slots, and the tailgate appearances that follow them.' },
    { name: 'General Mills', note: 'Cereal-box covers, two limited editions, and a signature mix carrying his name.' },
    { name: 'Oakley', note: 'Lifestyle and performance eyewear, from training visors to off-field shades.' },
    { name: 'Beats', note: 'Tunnel arrivals, Powerbeats campaigns, and the custom pairs nobody else gets.' },
  ],
  footer: {
    credit: 'A front-end demo. Not affiliated with any athlete, team or brand named or implied.',
    built: 'Built with the skills in this repository',
    colophon: [
      ['Front-end', 'React · TypeScript · Vite'],
      ['Motion', 'motion (scroll-scrubbed)'],
      ['Type', 'Anton · Archivo · JetBrains Mono'],
    ] as [string, string][],
  },
}

/**
 * Prefix a public asset with the deployment base path.
 *
 * Vite rewrites asset URLs it generates, but NOT string literals in your code —
 * so a hardcoded "/hero-tunnel.jpg" breaks the moment the site is served from a
 * subpath. Everything that points at `public/` goes through here.
 */
export const asset = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/+$/, '') + (path.startsWith('/') ? path : `/${path}`)
