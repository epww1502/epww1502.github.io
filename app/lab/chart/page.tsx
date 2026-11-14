import type { Metadata } from 'next';
import { ChartDemo } from '@/components/lab/ChartDemo';
import { LabCode, LabNotes, LabPage } from '@/components/lab/LabPage';
import { CHART_CODE } from '@/lib/demoCode';
import { demoBySlug } from '@/lib/demos';

const demo = demoBySlug('chart');

export const metadata: Metadata = { title: `${demo.title} 데모`, description: demo.summary };

export default function Page() {
  return (
    <LabPage
      title={demo.title}
      summary={demo.summary}
      caseSlug={demo.caseSlug}
      caseTitle={demo.caseTitle}
      problem={demo.problem}
      fix={demo.fix}
    >
      <ChartDemo />
      <LabCode code={CHART_CODE} file="components/lab/ChartDemo.tsx" />
      <LabNotes title="실제 제품과 다른 점">
        <li>
          <b>배율이 다릅니다.</b> 실제 제품에서는 100×100 차트가 10,000ms에서 100ms로 약 100배 빨라졌습니다. 이 데모에서는 기기에
          따라 다르지만 그보다 훨씬 작게 나옵니다(제가 잰 PC에서는 10배 안팎).
        </li>
        <li>
          <b>여기에는 컴포넌트만 있습니다.</b> 실제 제품은 차트 라이브러리(Victory) 위에서 데이터 포인트마다 컴포넌트와 함께
          모델도 만들었고, 그 모델이 서버로 보내는 메시지로 이어졌습니다. 데모는 그중 &ldquo;포인트마다 컴포넌트를 만든다&rdquo;는
          구조만 재현했기 때문에 고치기 전 방식이 실제보다 가볍습니다.
        </li>
        <li>
          <b>재는 범위가 다릅니다.</b> 데모는 차트를 처음 그리는 시간만 잽니다. 실제 개선에는 삽입, 선택, 크기 조절과 서버 메시지
          수 감소(데드락 해결)가 함께 들어 있습니다.
        </li>
        <li>
          <b>차트 종류가 하나입니다.</b> 실제로는 오차 막대, 데이터 레이블, 선택, 행/열 전환, 종류 변경까지 새 구조에 맞췄고,
          데모는 마커가 있는 꺾은선만 그립니다.
        </li>
        <li>
          <b>같은 것은 원리입니다.</b> 그리는 단위를 데이터 포인트에서 계열로 바꾸면 컴포넌트 수가 포인트 수가 아니라 계열 수에
          비례하고, 데이터가 많을수록 차이가 커집니다. 위에서 크기를 키워 보면 확인할 수 있습니다.
        </li>
      </LabNotes>
    </LabPage>
  );
}
