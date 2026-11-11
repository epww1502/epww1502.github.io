import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { TopBar } from '@/components/TopBar';
import { allCases, type Case } from '@/lib/cases';

export const metadata: Metadata = { title: '포트폴리오' };

function CaseCard({ item }: { item: Case }) {
  const { meta } = item;
  return (
    // The id keeps old links such as /portfolio.html#glab pointing at the right card.
    <Link className="card" id={item.slug} href={`/portfolio/${item.slug}`}>
      <span className="tag">{meta.tag}</span>
      <strong className="card-title">{meta.title}</strong>
      {meta.metric && (
        <span className="card-metric">
          <b>{meta.metric.value}</b>
          {meta.metric.label}
        </span>
      )}
      <span className="card-stack">{meta.stack}</span>
    </Link>
  );
}

export default async function PortfolioPage() {
  const cases = await allCases();
  const featured = cases.filter((item) => item.meta.featured);
  const others = cases.filter((item) => !item.meta.featured);

  return (
    <main className="page">
      <TopBar
        links={['resume', 'career']}
        downloads={[{ href: '/pdf/portfolio.pdf', filename: '이영주_포트폴리오.pdf', kind: 'pdf' }]}
      />
      <PageHeader
        title="포트폴리오"
        lead="이영주 · 대용량 렌더링 최적화와 앱 출시·운영 경험을 가진 5년차 프론트엔드 개발자"
        links={['resume', 'career']}
      />

      <section>
        <h2>대표 사례</h2>
        <div className="cards">
          {featured.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      <section>
        <h2>그 외 프로젝트</h2>
        <div className="cards">
          {others.map((item) => (
            <CaseCard key={item.slug} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}
