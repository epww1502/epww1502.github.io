import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BackIcon, CareerIcon, DownloadIcon, LabIcon, PortfolioIcon, ResumeIcon, WordIcon } from './icons';

const PAGES = {
  resume: { href: '/', label: '이력서', en: 'Resume', icon: <ResumeIcon /> },
  portfolio: { href: '/portfolio', label: '포트폴리오', en: 'Portfolio', icon: <PortfolioIcon /> },
  career: { href: '/career', label: '경력기술서', en: 'Career', icon: <CareerIcon /> },
  back: { href: '/portfolio', label: '목록', en: 'List', icon: <BackIcon /> },
  lab: { href: '/lab', label: '데모', en: 'Demos', icon: <LabIcon /> },
} satisfies Record<string, { href: string; label: string; en: string; icon: ReactNode }>;

type Download = { href: string; filename: string; kind: 'pdf' | 'word' };

/** Buttons at the top of every page: links to the other pages, theme toggle, downloads. Labels hide on phones. */
export function TopBar({
  links,
  downloads = [],
  lang = 'ko',
  switchTo,
}: {
  links: (keyof typeof PAGES)[];
  downloads?: Download[];
  lang?: 'ko' | 'en';
  /** The same page in the other language, if there is one. */
  switchTo?: { href: string; label: string; name: string };
}) {
  return (
    <div className="bar no-print">
      {links.map((key) => {
        const page = PAGES[key];
        const label = lang === 'en' ? page.en : page.label;
        return (
          <Link key={key} className="btn text-btn" href={page.href} aria-label={label}>
            {page.icon}
            <span>{label}</span>
          </Link>
        );
      })}
      {switchTo && (
        <Link className="btn lang-btn" href={switchTo.href} aria-label={switchTo.name} hrefLang={switchTo.label === 'EN' ? 'en' : 'ko'}>
          {switchTo.label}
        </Link>
      )}
      <ThemeToggle />
      {downloads.map((file) => {
        const label = `${file.kind === 'word' ? 'Word' : 'PDF'} ${lang === 'en' ? 'download' : '다운로드'}`;
        return (
          <a
            key={file.href}
            className={file.kind === 'pdf' ? 'btn text-btn primary' : 'btn text-btn'}
            href={file.href}
            download={file.filename}
            aria-label={label}
          >
            {file.kind === 'word' ? <WordIcon /> : <DownloadIcon />}
            <span>{file.kind === 'word' ? 'Word' : 'PDF'}</span>
          </a>
        );
      })}
    </div>
  );
}
