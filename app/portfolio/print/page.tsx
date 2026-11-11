import type { Metadata } from 'next';
import { CaseArticle } from '@/components/CaseArticle';
import { PageHeader } from '@/components/PageHeader';
import { allCases } from '@/lib/cases';

export const metadata: Metadata = { title: '포트폴리오 (인쇄용)', robots: { index: false } };

/** Every case study on one page. scripts/build-pdf.sh prints this into the portfolio PDF. */
export default async function PortfolioPrintPage() {
  const cases = await allCases();
  return (
    <main className="page">
      <PageHeader
        title="포트폴리오"
        lead="이영주 · 대용량 렌더링 최적화와 앱 출시·운영 경험을 가진 5년차 프론트엔드 개발자"
        links={['resume', 'career']}
      >
        <div className="highlights">
          {cases
            .filter((item) => item.meta.featured && item.meta.metric)
            .map((item) => (
              <a key={item.slug} href={`#${item.slug}`}>
                <strong>{item.meta.metric?.value}</strong>
                <span>{item.meta.metric?.label}</span>
              </a>
            ))}
        </div>
      </PageHeader>
      {cases.map((item) => (
        <CaseArticle key={item.slug} item={item} heading="h2" />
      ))}
    </main>
  );
}
