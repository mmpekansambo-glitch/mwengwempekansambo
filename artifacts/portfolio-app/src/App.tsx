import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowLeft, ArrowRight, Moon, Sun } from 'lucide-react';
import blogPosts from 'virtual:blog-posts';
import { BlogArticleView, BlogIndexView, BlogPostCards } from '@/components/blog';
import interestTiles from '@/data/interests.json';
import {
  Link,
  Redirect,
  Route,
  Switch,
  useLocation,
  useRoute,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

const canonicalOrigin = 'https://mwengwempekansambo.com';
const navItems = [
  { href: '/', label: 'Home' },
  { href: '/experience', label: 'Journey' },
  { href: '/interests', label: 'Interests' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

const pageMeta: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'Mwengwe Mpekansambo — Finance, stories & possibility',
    description: 'Meet Mwengwe Mpekansambo, an MBA candidate at Berkeley Haas and former TMT investment banking associate.',
  },
  '/experience': {
    title: 'Journey — Mwengwe Mpekansambo',
    description: 'Education and professional milestones, from Stanford and Berkeley Haas to investment banking, corporate development, and company building.',
  },
  '/interests': {
    title: 'Interests — Mwengwe Mpekansambo',
    description: 'Interests beyond finance: financial education and STEM, Zambia and agriculture, literature, photography and plants, sewing and crochet.',
  },
  '/blog': {
    title: 'Blog — Mwengwe Mpekansambo',
    description: 'Writing and reflections from Mwengwe Mpekansambo.',
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

function PageMeta({
  route,
  override,
  ogType = 'website',
}: {
  route: string;
  override?: { title: string; description: string; image?: string };
  ogType?: 'website' | 'article';
}) {
  useEffect(() => {
    const content = override ?? pageMeta[route] ?? pageMeta['404'];
    const canonicalUrl = new URL(window.location.pathname, canonicalOrigin).href;
    const socialImageUrl = new URL(override?.image ?? '/images/mwengwe-social-card.jpg', canonicalOrigin).href;
    const imageAlt = override?.image
      ? `${content.title} cover image`
      : 'Mwengwe Mpekansambo smiling beneath vivid autumn leaves, with her name and the phrase Finance, stories and possibility.';
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
    setMeta('meta[property="og:type"]', 'content', ogType);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setCanonical(canonicalUrl);
    setMeta('meta[property="og:image"]', 'content', socialImageUrl);
    setMeta('meta[property="og:image:width"]', 'content', '1200');
    setMeta('meta[property="og:image:height"]', 'content', '630');
    setMeta('meta[property="og:image:alt"]', 'content', imageAlt);
    setMeta('meta[name="twitter:card"]', 'content', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'content', content.title);
    setMeta('meta[name="twitter:description"]', 'content', content.description);
    setMeta('meta[name="twitter:image"]', 'content', socialImageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'content', imageAlt);
  }, [route, override, ogType]);
  return null;
}

function Header({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [location] = useLocation();
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Mwengwe Mpekansambo, home" data-testid="link-home-brand">
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
      <span>{isHome ? '© Mwengwe Mpekansambo' : `© ${new Date().getFullYear()} Mwengwe Mpekansambo`}</span>
    </footer>
  );
}

function HomePage() {
  return (
    <>
      <PageMeta route="/" />
      <main className="page-content" id="page-content">
        <section className="home-hero" aria-labelledby="home-title">
          <div>
            <h1 className="hero-title" id="home-title">From numbers<br />to narrative<br />to <em>nexus</em></h1>
            <p className="hero-copy">
              I’m Mwengwe. I’m drawn to the places where capital, creativity, and people’s everyday lives meet, and to what becomes possible when they work together. I’ve followed that curiosity from Stanford to supporting the advisement of technology and media companies, and working alongside an agricultural business in Zambia, and now an MBA at Berkeley Haas.
            </p>
            <div className="hero-actions">
              <Link href="/experience" className="button-primary" data-testid="link-hero-journey">Explore my journey <ArrowRight size={16} /></Link>
              <Link href="/interests" className="text-link" data-testid="link-hero-interests">What I'm curious about</Link>
            </div>
          </div>
          <div className="hero-art">
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
            </figure>
          </div>
        </section>

        <section className="home-note" aria-labelledby="home-note-title">
          <div>
            <h2 id="home-note-title">Good questions<br />make room.</h2>
          </div>
          <div className="home-note-copy">
            <p>
              Every chapter has started with the same question: who gets access, and what changes when they do? I’ve asked it of companies raising capital, of farmers bringing goods to market, and of women in Zambia building something of their own.
            </p>
            <p>
              I bring analytical, critical, and creative thinking to my work: I like understanding how systems work, and I care about how we tell the stories inside them.
            </p>
          </div>
        </section>

        <section className="quick-facts" aria-labelledby="quick-facts-title">
          <div className="quick-facts-top">
            <div>
              <h2 id="quick-facts-title" className="content-heading">Where I’m coming from</h2>
            </div>
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

function InterestsPage() {
  const base = import.meta.env.BASE_URL;
  return (
    <>
      <PageMeta route="/interests" />
      <main className="page-content" id="page-content">
        <section className="page-intro">
          <h1 className="content-heading">Interests</h1>
          <p>Some are causes, some are crafts, and some are simply ways of paying attention. Here are the places my curiosity keeps returning to.</p>
        </section>
        <section className="interest-gallery" aria-label="Interest categories">
          {interestTiles.map((tile, index) => (
            <Link
              className="interest-tile"
              href={`/interests/${tile.id}`}
              key={tile.id}
              aria-label={`Explore ${tile.title}`}
              data-testid={`link-interest-${tile.id}`}
            >
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
            </Link>
          ))}
        </section>
        <p className="image-note">Images are AI-generated representations, not personal photographs.</p>
      </main>
    </>
  );
}

function InterestDetailRoute() {
  const [match, params] = useRoute('/interests/:interestId');
  const tile = match && params
    ? interestTiles.find((item) => item.id === params.interestId)
    : undefined;

  if (!tile) return <NotFoundPage />;

  const posts = blogPosts
    .filter((post) => !post.draft && post.interests?.includes(tile.id))
    .sort((a, b) => b.date.localeCompare(a.date));
  const intro = 'Writing and reflections related to this interest.';
  const description = `Explore published writing about ${tile.title}.`;
  const imagePath = `/images/interests/${tile.image}`;

  return (
    <>
      <PageMeta
        route={`/interests/${tile.id}`}
        override={{
          title: `${tile.title} — Interests — Mwengwe Mpekansambo`,
          description,
          image: imagePath,
        }}
      />
      <main className="page-content interest-detail" id="page-content">
        <Link href="/interests" className="blog-back" data-testid="link-back-interests">
          <ArrowLeft size={16} strokeWidth={1.7} aria-hidden="true" />
          <span>Back to Interests</span>
        </Link>
        <section className="interest-detail-head">
          <figure className="interest-detail-image">
            <img src={`${import.meta.env.BASE_URL}${imagePath.slice(1)}`} alt={tile.alt} />
          </figure>
          <div className="interest-detail-copy">
            <h1 className="content-heading">{tile.title}</h1>
            <ul className="interest-tags">
              {tile.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <p className="interest-detail-note">{tile.note}</p>
            <p className="interest-detail-intro">{intro}</p>
          </div>
        </section>
        <section className="interest-detail-posts" aria-labelledby="interest-posts-title">
          <h2 id="interest-posts-title">Writing on {tile.title}</h2>
          {posts.length > 0 ? (
            <BlogPostCards posts={posts} />
          ) : (
            <div className="blog-empty interest-detail-empty" aria-live="polite">
              <p>No posts on this yet — check back soon.</p>
              <Link href="/blog" className="text-link">Explore the full blog</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function BlogIndexPage() {
  const posts = blogPosts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageMeta route="/blog" />
      <BlogIndexView posts={posts} />
    </>
  );
}

function BlogPostRoute() {
  const [match, params] = useRoute('/blog/:slug');
  const post = match && params
    ? blogPosts.find((item) => item.slug === params.slug)
    : undefined;

  if (!post || (post.draft && import.meta.env.PROD)) {
    return <NotFoundPage />;
  }

  return (
    <>
      <PageMeta
        route={`/blog/${post.slug}`}
        override={{
          title: `${post.title} — Mwengwe Mpekansambo`,
          description: post.summary,
          image: post.coverImage,
        }}
        ogType="article"
      />
      <BlogArticleView post={post} interestTiles={interestTiles} />
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
        <section className="page-intro journey-intro">
          <h1 className="content-heading">Journey</h1>
          <p>I'm interested in how people build a life, a livelihood, and a future—and in the ideas and institutions that can help them do it.</p>
          <p>I worked in TMT investment banking at Jefferies, advising on financial transactions and capital-raising. My interests also reach beyond finance: I'm passionate about women's financial education, particularly in Zambia, women's participation in STEM, and ethical agriculture.</p>
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
        <p className="journey-note">Listed newest first.</p>
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
          <h1 className="content-heading">Let’s talk.</h1>
          <p>For thoughtful conversations about finance, technology, women’s opportunity, agriculture, or a particularly good book.</p>
        </section>
        <section className="contact-panel" aria-labelledby="contact-heading">
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
          <Route path="/about"><Redirect to="/" replace /></Route>
          <Route path="/experience" component={JourneyPage} />
          <Route path="/interests/:interestId" component={InterestDetailRoute} />
          <Route path="/interests" component={InterestsPage} />
          <Route path="/blog" component={BlogIndexPage} />
          <Route path="/blog/:slug" component={BlogPostRoute} />
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
