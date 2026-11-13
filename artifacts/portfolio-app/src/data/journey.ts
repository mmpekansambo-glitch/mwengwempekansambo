// Edit everything on the Journey page (/experience) here.
// Entries are listed in the order written (newest first).
// marginNote: optional handwritten note shown beside the entry (below it on mobile). Leave '' to hide.

export type JourneyRole = {
  role: string;
  date?: string;
  dateTime?: string;
  startDateTime?: string;
  bullets: string[];
};

export type JourneyEntry = JourneyRole & {
  organization: string;
  location: string;
  subRoles?: JourneyRole[];
  marginNote?: string;
};

export type BeyondCard = {
  headline: string;
  line: string;
};

export const experience: JourneyEntry[] = [
  {
    organization: 'Gen Digital',
    location: 'San Francisco, CA',
    role: 'Associate Intern, Corporate Development & Strategic Partnerships',
    date: 'Jun – Aug 2026',
    startDateTime: '2026-06',
    dateTime: '2026-08',
    bullets: [
      'Conducted merger analyses of key fintech targets, including accretion/dilution and sum-of-the-parts modelling',
      "Led introductory calls with outreach targets, conducting due diligence and conveying the company's inorganic growth strategy and segment focus",
      'Presented a capstone on agentic AI in chat messaging aggregation to the CEO and other executives, highlighting layered cyber safety in chats and product cross-sell insights',
    ],
    marginNote: '',
  },
  {
    organization: 'Jefferies LLC',
    location: 'San Francisco, CA',
    role: 'TMT Investment Banking',
    date: 'Jul 2022 – Jun 2025',
    startDateTime: '2022-07',
    dateTime: '2025-06',
    bullets: [],
    subRoles: [
      {
        role: 'Associate',
        date: 'Jun 2024 – Jun 2025',
        startDateTime: '2024-06',
        dateTime: '2025-06',
        bullets: [
          'Closed 10 transactions across M&A, debt and public equity with 5+ international office partnerships, totaling $60B+ in deal value',
          'Worked closely with executive management at a French semiconductor company on positioning, financial modelling and buyer relations in their sell-side process',
          'Researched and drafted the Food Tech and Mobility database to provide industry perspectives for early-stage and follow-up client conversations',
          'Analyzed market data and research to publish the monthly semiconductor newsletter on notable M&A and venture raises',
          'Led the Women in Finance initiative, hosting 25+ lunches with women executives across finance and technology to support mentorship',
          'Served as Summer Analyst Staffer for the 2024 cohort of 10 interns, reporting weekly to senior group leadership',
        ],
      },
      {
        role: 'Analyst',
        date: 'Jul 2022 – May 2024',
        startDateTime: '2022-07',
        dateTime: '2024-05',
        bullets: [
          'Coordinated the San Francisco DEI Virtual Symposium 2023, introducing 25 sophomores to the firm',
          'Led the 2024 San Francisco summer analyst recruitment process and university trek, onboarding 8 interns',
        ],
      },
    ],
    marginNote: '',
  },
  {
    organization: 'Hotchkis & Wiley',
    location: 'Los Angeles, CA',
    role: 'Asset Management Intern',
    date: 'Jun – Aug 2021',
    startDateTime: '2021-06',
    dateTime: '2021-08',
    bullets: [
      'Presented a 45-minute pitch on Ingredion to portfolio managers, analyzing the corn wet milling industry using research reports, sell-side analyst calls and GLG expert calls',
      "Assessed industry risks and profit potential with industry experts using Porter's Five Forces",
    ],
    marginNote: '',
  },
  {
    organization: 'Mwedi Innovations Limited',
    location: 'Zambia',
    role: 'Director & Co-founder',
    bullets: ['Co-founded an agriculture company focused on local sourcing and ethical management of plant and animal produce'],
    marginNote: '',
  },
];

export const education: JourneyEntry[] = [
  {
    organization: 'University of California, Berkeley, Haas School of Business',
    location: 'Berkeley, CA',
    role: 'Master of Business Administration',
    date: 'Expected May 2027',
    dateTime: '2027-05',
    bullets: [
      'VP of Finance, Full-time MBA Association and Haas Africa Business Club',
      'Graduate Student Instructor: Financial Accounting, Mergers & Acquisitions, and Leadership & Personal Development (undergraduate course)',
    ],
    marginNote: '',
  },
  {
    organization: 'Stanford University',
    location: 'Stanford, CA',
    role: 'B.A. in Economics, Minor in Creative Writing',
    date: 'June 2022',
    dateTime: '2022-06',
    bullets: [],
    marginNote: '',
  },
];

export const beyondCards: BeyondCard[] = [
  { headline: '175+', line: 'novels read in 2024, and around 120 in 2025' },
  { headline: 'Birkin 35', line: 'a crocheted mock Birkin, currently on my hook' },
  { headline: '25+', line: 'Women in Finance lunches with executives in finance and tech' },
  { headline: 'Zambia', line: 'co-founded an ethical agriculture company' },
];

export const linkedInUrl = 'https://www.linkedin.com/in/mmpekansambo';
