import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeader } from '@/components/PageHeader';
import { TopBar } from '@/components/TopBar';
import { DEMOS } from '@/lib/demos';

export const metadata: Metadata = {
  title: '데모',
  description: '포트폴리오에 적은 렌더링 최적화를 브라우저에서 직접 해볼 수 있는 데모',
};

export default function LabIndexPage() {
  return (
    <main className="page lab">
      <TopBar links={['resume', 'portfolio', 'career']} />
      <PageHeader
        title="데모"
        lead="포트폴리오에 적은 최적화를 고치기 전과 후로 바꿔 가며 직접 해볼 수 있습니다."
        links={['resume', 'portfolio']}
      />

      <section>
        <h2>직접 해보기</h2>
        <div className="cards">
          {DEMOS.map((demo) => (
            <Link key={demo.slug} className="card" href={`/lab/${demo.slug}`}>
              <span className="tag">{demo.caseTitle}</span>
              <strong className="card-title">{demo.title}</strong>
              <span className="card-metric">
                <b>{demo.metric.value}</b>
                {demo.metric.label}
              </span>
              <span className="card-stack">{demo.summary}</span>
            </Link>
          ))}
        </div>
        <p className="note lab-disclaimer">
          회사 제품의 코드는 쓰지 않았습니다. 문제와 해결 원리만 가져와 새로 구현했고, 지연을 일부러 넣지 않았습니다.
          화면에 나오는 숫자는 지금 이 기기에서 잰 값입니다.
        </p>
      </section>
    </main>
  );
}
