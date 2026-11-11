import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

/** Building blocks shared by the resume and the career statement. */

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function Company({
  name,
  when,
  summary,
  children,
}: {
  name: string;
  when: string;
  summary?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="company">
      <div className="company-head">
        <h3>{name}</h3>
        <span className="when">{when}</span>
      </div>
      {summary && <p className="ctx">{summary}</p>}
      {children}
    </div>
  );
}

export function Project({
  title,
  period,
  summary,
  stack,
  detail,
  links,
  children,
}: {
  title: string;
  period: string;
  summary?: ReactNode;
  /** Technologies, shown as one muted line under the bullets. */
  stack?: string;
  /** Slug of the portfolio case study this project links to. */
  detail?: string;
  links?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="proj">
      <div className="proj-head">
        <h4>{title}</h4>
        <span>{period}</span>
      </div>
      {summary && <p className="ctx">{summary}</p>}
      {children}
      {(stack || detail || links) && (
        <p className="stack">
          {stack}
          {detail && (
            <Link className="more" href={`/portfolio/${detail}`}>
              자세히 →
            </Link>
          )}
          {links?.map((link) => (
            <a key={link.href} className="more" href={link.href}>
              {link.label} →
            </a>
          ))}
        </p>
      )}
    </div>
  );
}

/** Two-column label/value list. `meta` is the compact variant used inside a project. */
export function Fields({ rows, variant = 'skills' }: { rows: [string, ReactNode][]; variant?: 'skills' | 'meta' }) {
  return (
    <dl className={variant}>
      {rows.map(([label, value]) => (
        <Fragment key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="label">{children}</p>;
}
