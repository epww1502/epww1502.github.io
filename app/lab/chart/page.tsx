import type { Metadata } from 'next';
import { ChartDemo } from '@/components/lab/ChartDemo';
import { LabPage } from '@/components/lab/LabPage';
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
    </LabPage>
  );
}
