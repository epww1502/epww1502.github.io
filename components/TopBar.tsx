import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BackIcon, CareerIcon, DownloadIcon, PortfolioIcon, ResumeIcon, WordIcon } from './icons';

const PAGES = {
  resume: { href: '/', label: '이력서', icon: <ResumeIcon /> },
  portfolio: { href: '/portfolio', label: '포트폴리오', icon: <PortfolioIcon /> },
  career: { href: '/career', label: '경력기술서', icon: <CareerIcon /> },
  back: { href: '/portfolio', label: '목록', icon: <BackIcon /> },
} satisfies Record<string, { href: string; label: string; icon: ReactNode }>;

type Download = { href: string; filename: string; kind: 'pdf' | 'word' };

/** Buttons at the top of every page: links to the other pages, theme toggle, downloads. Labels hide on phones. */
export function TopBar({ links, downloads = [] }: { links: (keyof typeof PAGES)[]; downloads?: Download[] }) {
  return (
    <div className="bar no-print">
      {links.map((key) => {
        const page = PAGES[key];
        return (
          <Link key={key} className="btn text-btn" href={page.href} aria-label={page.label}>
            {page.icon}
            <span>{page.label}</span>
          </Link>
        );
      })}
      <ThemeToggle />
      {downloads.map((file) => {
        const label = file.kind === 'word' ? 'Word 다운로드' : 'PDF 다운로드';
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
