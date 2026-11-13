import resumeAvailable from 'virtual:resume-available';
import { beyondCards, education, experience, linkedInUrl, type JourneyEntry, type JourneyRole } from '@/data/journey';
import './journey-resume.css';

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function DatePill({ role }: { role: JourneyRole }) {
  if (!role.date) return null;
  return role.dateTime && !role.startDateTime
    ? <time className="jr-date" dateTime={role.dateTime}>{role.date}</time>
    : <span className="jr-date">{role.date}</span>;
}

function Bullets({ bullets }: { bullets: string[] }) {
  if (bullets.length === 0) return null;
  return (
    <ul className="jr-bullets">
      {bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
    </ul>
  );
}

function Entry({ entry, id }: { entry: JourneyEntry; id: string }) {
  const note = entry.marginNote?.trim();
  return (
    <li className={`jr-entry${note ? ' jr-entry--noted' : ''}`} data-testid={`entry-${id}`}>
      <div className="jr-entry-main">
        <div className="jr-entry-head">
          <div className="jr-entry-titles">
            <h3 className="jr-org">{entry.organization}</h3>
            <p className="jr-location">{entry.location}</p>
            <p className="jr-role">{entry.role}</p>
          </div>
          <DatePill role={entry} />
        </div>
        <Bullets bullets={entry.bullets} />
        {entry.subRoles && (
          <ol className="jr-subroles" aria-label={`${entry.organization} roles`} role="list">
            {entry.subRoles.map((subRole) => (
              <li key={subRole.role}>
                <div className="jr-entry-head">
                  <h4 className="jr-role">{subRole.role}</h4>
                  <DatePill role={subRole} />
                </div>
                <Bullets bullets={subRole.bullets} />
              </li>
            ))}
          </ol>
        )}
      </div>
      {note && <p className="jr-margin-note">{note}</p>}
    </li>
  );
}

function Section({ title, id, entries }: { title: string; id: string; entries: JourneyEntry[] }) {
  return (
    <section className="jr-section" aria-labelledby={`jr-${id}`}>
      <h2 className="jr-heading" id={`jr-${id}`}>{title}</h2>
      <ol className="jr-list" role="list">
        {entries.map((entry, index) => (
          <Entry key={`${entry.organization}-${index}`} entry={entry} id={`${id}-${slug(entry.organization)}-${index}`} />
        ))}
      </ol>
    </section>
  );
}

export function JourneyActions() {
  return (
    <div className="jr-actions">
      {resumeAvailable && (
        <a className="jr-pill jr-pill--solid" href={`${import.meta.env.BASE_URL}resume.pdf`} download data-testid="link-download-resume">
          Download my résumé ↓
        </a>
      )}
      <a className="jr-pill jr-pill--outline" href={linkedInUrl} target="_blank" rel="noopener noreferrer" data-testid="link-journey-linkedin">
        Connect on LinkedIn
      </a>
    </div>
  );
}

export function JourneyResume() {
  return (
    <div className="jr">
      <Section title="Experience" id="experience" entries={experience} />
      <Section title="Education" id="education" entries={education} />
      <section className="jr-section jr-beyond" aria-labelledby="jr-beyond">
        <h2 className="jr-heading" id="jr-beyond">Beyond the résumé</h2>
        <p className="jr-subtitle">the unique chapters</p>
        <ul className="jr-cards" role="list">
          {beyondCards.map((card, index) => (
            <li key={card.headline} className={`jr-card ${index % 2 ? 'jr-card--sage' : 'jr-card--rose'}`} data-testid={`card-beyond-${index}`}>
              <p className="jr-card-headline">{card.headline}</p>
              <p className="jr-card-line">{card.line}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
