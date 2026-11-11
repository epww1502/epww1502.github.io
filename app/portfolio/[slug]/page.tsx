import type { Metadata } from 'next';
import Link from 'next/link';
import { CaseArticle } from '@/components/CaseArticle';
import { TopBar } from '@/components/TopBar';
import { allCases, caseSlugs, loadCase } from '@/lib/cases';

type Props = { params: Promise<{ slug: string }> };

// Only the MDX files in content/cases become pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return caseSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await loadCase(slug);
  return { title: meta.title, description: meta.summary };
}

export default async function CasePage({ params }: Props) {
  const { slug } = await params;
  const cases = await allCases();
  const index = cases.findIndex((item) => item.slug === slug);
  const previous = cases[index - 1];
  const next = cases[index + 1];

  return (
    <main className="page">
      <TopBar
        links={['back', 'resume', 'career']}
        downloads={[{ href: '/pdf/portfolio.pdf', filename: '이영주_포트폴리오.pdf', kind: 'pdf' }]}
      />
      <CaseArticle item={cases[index]} />
      <nav className="case-nav no-print" aria-label="다른 사례">
        {previous ? <Link href={`/portfolio/${previous.slug}`}>← {previous.meta.title}</Link> : <span />}
        {next ? <Link href={`/portfolio/${next.slug}`}>{next.meta.title} →</Link> : <span />}
      </nav>
    </main>
  );
}
