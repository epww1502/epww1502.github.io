import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { BackIcon, CareerIcon, DownloadIcon, PortfolioIcon, ResumeIcon, WordIcon } from './icons';

const PAGES = {
  resume: { href: '/', label: '이력서 보기', icon: <ResumeIcon /> },
  portfolio: { href: '/portfolio', label: '포트폴리오 보기', icon: <PortfolioIcon /> },
  career: { href: '/career', label: '경력기술서 보기', icon: <CareerIcon /> },
  back: { href: '/portfolio', label: '포트폴리오 목록', icon: <BackIcon /> },
} satisfies Record<string, { href: string; label: string; icon: ReactNode }>;

type Download = { href: string; filename: string; kind: 'pdf' | 'word' };

/** Icon buttons at the top of every page: links to the other pages, theme toggle, downloads. */
export function TopBar({ links, downloads = [] }: { links: (keyof typeof PAGES)[]; downloads?: Download[] }) {
  return (
    <div className="bar no-print">
      {links.map((key) => {
        const page = PAGES[key];
        return (
          <Link key={key} className="btn icon-btn" href={page.href} data-tip={page.label} aria-label={page.label}>
            {page.icon}
          </Link>
        );
      })}
      <ThemeToggle />
      {downloads.map((file) => {
        const label = file.kind === 'word' ? 'Word 다운로드' : 'PDF 다운로드';
        return (
          <a
            key={file.href}
            className={file.kind === 'pdf' ? 'btn icon-btn primary' : 'btn icon-btn'}
            href={file.href}
            download={file.filename}
            data-tip={label}
            aria-label={label}
          >
            {file.kind === 'word' ? <WordIcon /> : <DownloadIcon />}
          </a>
        );
      })}
    </div>
  );
}
