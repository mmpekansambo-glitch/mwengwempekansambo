// Edit everything on the Journey page (/experience) here.
// Entries are listed in the order written (newest first).
// marginNote: optional handwritten note shown beside the entry (below it on mobile). Leave '' to hide.

export type JourneyEntry = {
  organization: string;
  role: string;
  date?: string;
  dateTime?: string;
  bullets: string[];
  marginNote?: string;
};

export type BeyondCard = {
  headline: string;
  line: string;
};

export const experience: JourneyEntry[] = [
  {
    organization: 'Gen Digital',
    role: 'Associate Intern, Corporate Development & Strategic Partnerships',
    date: 'August 2026',
    dateTime: '2026-08',
    bullets: ['Analyzed fintech acquisitions', 'Explored agentic AI'],
    marginNote: '',
  },
  {
    organization: 'Jefferies LLC',
    role: 'TMT Investment Banking Associate',
    date: 'June 2025',
    dateTime: '2025-06',
    bullets: ['Closed 10 M&A, debt, and equity transactions totaling $60B+'],
    marginNote: '',
  },
  {
    organization: 'Jefferies LLC',
    role: 'TMT Investment Banking Analyst',
    date: 'May 2024',
    dateTime: '2024-05',
    bullets: ['Supported financial advisory, recruitment, and inclusion initiatives'],
    marginNote: '',
  },
  {
    organization: 'Hotchkis & Wiley',
    role: 'Asset Management Intern',
    date: 'August 2021',
    dateTime: '2021-08',
    bullets: ['Researched industry risks', 'Presented an investment pitch on Ingredion'],
    marginNote: '',
  },
  {
    organization: 'Mwedi Innovations Limited',
    role: 'Director & Co-founder',
    bullets: ['Agriculture company in Zambia focused on local sourcing and ethical produce management'],
    marginNote: '',
  },
];

export const education: JourneyEntry[] = [
  {
    organization: 'UC Berkeley Haas',
    role: 'MBA candidate',
    date: 'Expected May 2027',
    dateTime: '2027-05',
    bullets: [],
    marginNote: '',
  },
  {
    organization: 'Stanford University',
    role: 'B.A. in Economics, minor in Creative Writing',
    date: 'June 2022',
    dateTime: '2022-06',
    bullets: [],
    marginNote: '',
  },
];

export const beyondCards: BeyondCard[] = [
  { headline: '175', line: 'novels read in 2024, and around 120 in 2025' },
  { headline: 'Birkin 35', line: 'my own crocheted take on the bag' },
  { headline: 'Zambia', line: 'co-founded an ethical agriculture company' },
];

export const linkedInUrl = 'https://www.linkedin.com/in/mmpekansambo';
