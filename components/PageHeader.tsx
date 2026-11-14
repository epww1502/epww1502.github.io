import Link from 'next/link';
import type { ReactNode } from 'react';

const OTHER_PAGES = {
  resume: { href: '/', label: '이력서 →' },
  portfolio: { href: '/portfolio', label: '포트폴리오 →' },
  career: { href: '/career', label: '경력기술서 →' },
  lab: { href: '/lab', label: '데모 →' },
};

export function PageHeader({
  title,
  lead,
  links,
  children,
}: {
  title: string;
  lead: string;
  links: (keyof typeof OTHER_PAGES)[];
  children?: ReactNode;
}) {
  return (
    <header className="head">
      <h1>{title}</h1>
      <p className="lead">{lead}</p>
      <div className="contact">
        {/* Filled in by private.js when printing a private copy, so React must leave its text alone. */}
        <span className="print-only" data-phone suppressHydrationWarning />
        <a href="mailto:epww1502@gmail.com">epww1502@gmail.com</a>
        <a href="https://github.com/epww1502">github.com/epww1502</a>
        {links.map((key) => (
          <Link key={key} href={OTHER_PAGES[key].href}>
            {OTHER_PAGES[key].label}
          </Link>
        ))}
      </div>
      {children}
    </header>
  );
}
