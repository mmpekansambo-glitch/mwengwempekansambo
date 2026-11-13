import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowRight, Leaf, Moon, Sun } from 'lucide-react';
import {
  Link,
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const canonicalOrigin = 'https://mwengwempekansambo.com';
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/experience', label: 'Journey' },
  { href: '/interests', label: 'Interests' },
  { href: '/contact', label: 'Contact' },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mwengwe Mpekansambo — Finance, stories & possibility',
    description: 'Meet Mwengwe Mpekansambo, an MBA candidate at Berkeley Haas and former TMT investment banking associate.',
  },
  '/about': {
    title: 'About — Mwengwe Mpekansambo',
    description: 'Mwengwe’s background, outlook, and approach to finance and creativity.',
  },
  '/experience': {
    title: 'Journey — Mwengwe Mpekansambo',
    description: 'Education and professional milestones, from Stanford and Berkeley Haas to investment banking, corporate development, and company building.',
  },
  '/interests': {
    title: 'Interests — Mwengwe Mpekansambo',
    description: 'Interests beyond finance: financial education and STEM, Zambia and agriculture, literature, photography and plants, sewing and crochet.',
  },
  '/contact': {
    title: 'Contact — Mwengwe Mpekansambo',
    description: 'Get in touch with Mwengwe Mpekansambo via her approved public Stanford alumni email.',
  },
  '404': {
    title: 'Page not found — Mwengwe Mpekansambo',
    description: 'The page you are looking for could not be found.',
  },
};

function PageMeta({ route }: { route: string }) {
  useEffect(() => {
    const content = pageMeta[route] ?? pageMeta['404'];
    const canonicalUrl = new URL(window.location.pathname, canonicalOrigin).href;
    const socialImageUrl = new URL('/images/mwengwe-social-card.jpg', canonicalOrigin).href;
    document.title = content.title;
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (selector.includes('property=')) element.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] ?? '');
        else element.name = selector.match(/name="([^"]+)"/)?.[1] ?? '';
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    const setCanonical = (href: string) => {
      let element = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.rel = 'canonical';
        document.head.appendChild(element);
      }
      element.href = href;
    };
    setMeta('meta[name="description"]', 'content', content.description);
    setMeta('meta[property="og:title"]', 'content', content.title);
    setMeta('meta[property="og:description"]', 'content', content.description);
    setMeta('meta[property="og:type"]', 'content', 'website');
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setCanonical(canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', socialImageUrl);
    setMeta('meta[property="og:image:width"]', 'content', '1200');
    setMeta('meta[property="og:image:height"]', 'content', '630');
    setMeta('meta[property="og:image:alt"]', 'content', 'Mwengwe Mpekansambo smiling beneath vivid autumn leaves, with her name and the phrase Finance, stories and possibility.');
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', content.title);
    setMeta('meta[name="twitter:description"]', 'content', content.description);
    setMeta('meta[name="twitter:image"]', 'content', socialImageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'content', 'Mwengwe Mpekansambo smiling beneath vivid autumn leaves, with her name and the phrase Finance, stories and possibility.');
  }, [route]);
  return null;
}

function Header({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Mwengwe Mpekansambo, home" data-testid="link-home-brand">
        <span className="brand-mark" aria-hidden="true">MM</span>
        <span>Mwengwe Mpekansambo</span>
      </Link>
      <nav className="nav-cluster" aria-label="Main navigation">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nav-link"
            aria-current={location === item.href ? 'page' : undefined}
            data-testid={`link-nav-${item.label.toLowerCase()}`}
          >
            {item.label}
          </Link>
        ))}
        <button
          className="theme-button"
          type="button"
          aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
          title={`Switch to ${dark ? 'light' : 'dark'} theme`}
          onClick={onToggle}
          data-testid="button-toggle-theme"
        >
          {dark ? <Sun size={17} strokeWidth={1.7} /> : <Moon size={17} strokeWidth={1.7} />}
        </button>
      </nav>
    </header>
  );
}

function Footer({ isHome }: { isHome: boolean }) {
  return (
    <footer className="site-footer">
      <span className="footer-note"><Leaf size={14} strokeWidth={1.6} /> Rooted in Africa, growing everywhere.</span>
      <span>{isHome ? '© Mwengwe Mpekansambo' : `© ${new Date().getFullYear()} Mwengwe Mpekansambo`}</span>
    </footer>
  );
}

function LeafIllustration({ className }: { className: string }) {
  return (
    <svg className={`art-leaf ${className}`} viewBox="0 0 120 150" fill="none" aria-hidden="true">
      <path d="M59 141C58 98 62 59 80 17" stroke="currentColor" strokeWidth="1.5" />
      <path d="M62 105C29 103 13 82 14 54C41 55 62 70 62 105Z" fill="currentColor" fillOpacity=".65" stroke="currentColor" strokeWidth="1.2" />
      <path d="M62 105L20 61M66 81C92 77 105 57 104 33C81 35 66 53 66 81Z" fill="currentColor" fillOpacity=".35" stroke="currentColor" strokeWidth="1.2" />
      <path d="M66 81L99 40M59 126C36 127 23 117 18 99C39 95 55 106 59 126Z" fill="currentColor" fillOpacity=".5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function HomePage() {
  return (
    <>
      <PageMeta route="/" />
      <main className="page-content" id="page-content">
        <section className="home-hero" aria-labelledby="home-title">
          <div className="reveal">
            <div className="eyebrow">A little about what moves me</div>
            <h1 className="hero-title" id="home-title">From numbers<br />to narrative<br />to <em>nexus</em></h1>
            <p className="hero-copy">
              I’m Mwengwe. I’m drawn to the places where capital, creativity, and people’s everyday lives meet, and to what becomes possible when they work together. I’ve followed that curiosity from Stanford to supporting the advisement of technology and media companies, and working alongside an agricultural business in Zambia, and now an MBA at Berkeley Haas.
            </p>
            <div className="hero-actions">
              <Link href="/about" className="button-primary" data-testid="link-hero-about">A bit about me <ArrowRight size={16} /></Link>
              <Link href="/experience" className="text-link" data-testid="link-hero-experience">Explore my journey</Link>
            </div>
          </div>
          <div className="hero-art reveal reveal-delay">
            <LeafIllustration className="left" />
            <LeafIllustration className="right" />
            <figure className="portrait-paper">
              <img
                className="portrait-photo"
                src={`${import.meta.env.BASE_URL}images/mwengwe-smiling.jpg`}
                alt="Mwengwe smiling on a wooden bench beneath orange autumn leaves."
                width={1200}
                height={800}
                fetchPriority="high"
                decoding="async"
              />
              <figcaption className="paper-caption">curiosity, always <ArrowDownRight size={15} aria-hidden="true" /></figcaption>
            </figure>
            <div className="portrait-companion">
              <img
                src={`${import.meta.env.BASE_URL}images/mwengwe-autumn.jpg`}
                alt="Mwengwe sitting on the bench, smiling to the side among autumn leaves."
                width={700}
                height={467}
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="home-note" aria-labelledby="home-note-title">
          <div>
            <div className="section-label">The through line</div>
            <h2 id="home-note-title">Good questions<br />make room.</h2>
          </div>
          <p>
            Every chapter has started with the same question: who gets access, and what changes when they do? I’ve asked it of companies raising capital, of farmers bringing goods to market, and of women in Zambia building something of their own.
          </p>
        </section>

        <section className="quick-facts" aria-labelledby="quick-facts-title">
          <div className="quick-facts-top">
            <div>
              <div className="section-label">A few chapters</div>
              <h2 id="quick-facts-title" className="content-heading">Where I’m coming from</h2>
            </div>
            <p>Doors that questions have opened</p>
          </div>
          <div className="fact-strip">
            <article className="fact-card">
              <div className="fact-kicker">Now · Berkeley</div>
              <h3>Questioning the Status Quo</h3>
              <p>MBA candidate at UC Berkeley Haas.</p>
            </article>
            <article className="fact-card">
              <div className="fact-kicker">Before · Stanford</div>
              <h3>Numbers &amp; narrative</h3>
              <p>BA in Economics with a minor in Creative Writing.</p>
            </article>
            <article className="fact-card">
              <div className="fact-kicker">Always · Zambia</div>
              <h3>Grounded in place</h3>
              <p>Part of the team behind an agriculture company focused on local sourcing and ethical management.</p>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <PageMeta route="/about" />
      <main className="page-content" id="page-content">
        <section className="page-intro">
          <div className="eyebrow">A life in more than one register</div>
          <h1 className="content-heading">About me</h1>
          <p>I’m interested in how people build a life, a livelihood, and a future—and in the ideas and institutions that can help them do it.</p>
        </section>
          <section className="content-section">
            <div className="section-label">A little context</div>
            <h2>Markets, meaning, and making things.</h2>
            <p className="body-copy">
              I bring analytical, critical, and creative thinking to my work: I like understanding how systems work, and I care about how we tell the stories inside them.
            </p>
            <p className="body-copy">
              I worked in TMT investment banking at Jefferies, advising on financial transactions and capital-raising. My interests also reach beyond finance: I’m passionate about women’s financial education, particularly in Zambia, women’s participation in STEM, and ethical agriculture.
            </p>
          </section>
          <p><Link href="/experience" className="text-link">Explore my journey</Link></p>
      </main>
    </>
  );
}

const interestTiles = [
  { id: 'financial-stem', title: 'Financial education & STEM', image: 'financial-stem.jpg', alt: 'Two women reviewing a notebook and budget charts at a sunlit wooden table beside a laptop and plants', items: ['Women and girls’ financial education', 'Women in STEM'], note: 'Opportunity starts with access to knowledge.' },
  { id: 'zambia-agriculture', title: 'Zambia, agriculture & politics', image: 'zambia-agriculture.jpg', alt: 'A farmer walking between rows of vegetables under a wide sky with low hills in the distance', items: ['Agriculture', 'African politics', 'Home country Zambia'], note: 'Home, and the systems that feed and govern it.' },
  { id: 'stories', title: 'Literature & stories', image: 'stories.jpg', alt: 'Open books, a notebook with a fountain pen, and a mug on a wooden windowsill in soft light', items: ['Reading fiction', 'Writing and editing'], note: 'More than 175 novels in 2024, and around 120 in 2025.' },
  { id: 'photography-plants', title: 'Photography & plants', image: 'photography-plants.jpg', alt: 'A vintage film camera on a potting bench among ferns, terracotta pots, and a green watering can', items: ['Photography', 'Plants'], note: 'Paying attention, one leaf and frame at a time.' },
  { id: 'textile-crafts', title: 'Sewing & crochet', image: 'textile-crafts.jpg', alt: 'A cream crochet square with a wooden hook, thread spools, and balls of wool on linen', items: ['Sewing', 'Crochet'], note: 'Including a crocheted take on a Birkin 35.' },
];

function InterestsPage() {
  const base = import.meta.env.BASE_URL;
  return (
    <>
      <PageMeta route="/interests" />
      <main className="page-content" id="page-content">
        <section className="page-intro">
          <div className="eyebrow">Outside the spreadsheet</div>
          <h1 className="content-heading">Interests</h1>
          <p>Some are causes, some are crafts, and some are simply ways of paying attention. Here are the places my curiosity keeps returning to.</p>
        </section>
        <section className="interest-gallery" aria-label="Interest categories">
          {interestTiles.map((tile, index) => (
            <article className="interest-tile" key={tile.id} data-testid={`card-interest-${tile.id}`} style={{ animationDelay: `${index * 70}ms` }}>
              <div className="interest-media">
                <img src={`${base}images/interests/${tile.image}`} alt={tile.alt} loading={index < 3 ? 'eager' : 'lazy'} width={1024} height={1024} />
              </div>
              <div className="interest-body">
                <h2>{tile.title}</h2>
                <ul className="interest-tags">
                  {tile.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                <p>{tile.note}</p>
              </div>
            </article>
          ))}
        </section>
        <p className="image-note">Images are AI-generated representations, not personal photographs.</p>
      </main>
    </>
  );
}

const journeyEntries: Array<{
  organization: string;
  description: string;
  endDate?: string;
  endDateTime?: string;
  endDateQualifier?: string;
}> = [
  { organization: 'UC Berkeley Haas', description: 'MBA candidate.', endDate: 'May 2027', endDateTime: '2027-05', endDateQualifier: 'Expected' },
  { organization: 'Gen Digital', description: 'Associate Intern, Corporate Development & Strategic Partnerships, analyzing fintech acquisitions and exploring agentic AI.', endDate: 'August 2026', endDateTime: '2026-08' },
  { organization: 'Jefferies LLC', description: 'TMT Investment Banking Associate, closing 10 M&A, debt, and equity transactions totaling $60B+.', endDate: 'June 2025', endDateTime: '2025-06' },
  { organization: 'Jefferies LLC', description: 'TMT Investment Banking Analyst, supporting financial advisory, recruitment, and inclusion initiatives.', endDate: 'May 2024', endDateTime: '2024-05' },
  { organization: 'Stanford University', description: 'B.A. in Economics with a minor in Creative Writing.', endDate: 'June 2022', endDateTime: '2022-06' },
  { organization: 'Hotchkis & Wiley', description: 'Asset Management Intern, researching industry risks and presenting an investment pitch on Ingredion.', endDate: 'August 2021', endDateTime: '2021-08' },
  { organization: 'Mwedi Innovations Limited', description: 'Director and co-founder of an agriculture company in Zambia focused on local sourcing and ethical produce management.' },
];

function JourneyPage() {
  return (
    <>
      <PageMeta route="/experience" />
      <main className="page-content" id="page-content">
        <section className="page-intro">
          <div className="eyebrow">Learning and work, in chapters</div>
          <h1 className="content-heading">Journey</h1>
          <p>Education, investing, advisory, and company building—a few milestones along the way.</p>
        </section>
        <ol className="journey-list" aria-label="Education and professional experience" role="list">
          {journeyEntries.map(({ organization, description, endDate, endDateTime, endDateQualifier }, index) => (
            <li
              className={`journey-entry ${endDate ? 'journey-entry--dated' : 'journey-entry--undated'}`}
              key={`${organization}-${index}`}
            >
              <p><strong>{organization}</strong> — {description}</p>
              {endDate && endDateTime && (
                <div className="journey-date-group">
                  <time className="journey-end-date" dateTime={endDateTime}>{endDate}</time>
                  {endDateQualifier && <span className="journey-date-qualifier">{endDateQualifier}</span>}
                </div>
              )}
            </li>
          ))}
        </ol>
        <p className="journey-note">Dated milestones are listed newest first; arrows point toward more recent chapters. Mwedi Innovations has no date listed.</p>
      </main>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageMeta route="/contact" />
      <main className="page-content" id="page-content">
        <section className="page-intro">
          <div className="eyebrow">A note is always welcome</div>
          <h1 className="content-heading">Let’s talk.</h1>
          <p>For thoughtful conversations about finance, technology, women’s opportunity, agriculture, or a particularly good book.</p>
        </section>
        <section className="contact-panel" aria-labelledby="contact-heading">
          <div className="section-label">Connect on LinkedIn</div>
          <h2 id="contact-heading">The best conversations start somewhere.</h2>
          <p>Send me a message directly through LinkedIn.</p>
          <a className="contact-link" href="https://www.linkedin.com/in/mmpekansambo" target="_blank" rel="noopener noreferrer" data-testid="link-contact-linkedin">
            Message me on LinkedIn <ArrowRight size={16} />
          </a>
        </section>
      </main>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <PageMeta route="404" />
      <main className="page-content not-found" id="page-content">
        <div>
          <div className="eyebrow" style={{ justifyContent: 'center' }}>A small wrong turn</div>
          <h1>Not this page.</h1>
          <p>The page you’re looking for isn’t here.</p>
          <Link href="/" className="button-primary" data-testid="link-not-found-home">Back to the beginning <ArrowRight size={16} /></Link>
        </div>
      </main>
    </>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  return (
    <div className="portfolio-shell">
      <a className="skip-link" href="#page-content">Skip to main content</a>
      <Header dark={dark} onToggle={onToggle} />
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/experience" component={JourneyPage} />
          <Route path="/interests" component={InterestsPage} />
          <Route path="/contact" component={ContactPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </RoutedErrorBoundary>
      <Footer isHome={location === '/'} />
    </div>
  );
}

function App() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('mwen-theme') === 'dark'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('mwen-theme', dark ? 'dark' : 'light'); } catch { /* Storage can be unavailable in private contexts. */ }
  }, [dark]);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router dark={dark} onToggle={() => setDark((current) => !current)} />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
