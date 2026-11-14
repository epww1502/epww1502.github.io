import type { Metadata } from 'next';
import { GridDemo } from '@/components/lab/GridDemo';
import { LabCode, LabPage } from '@/components/lab/LabPage';
import { GRID_CODE } from '@/lib/demoCode';
import { demoBySlug } from '@/lib/demos';

const demo = demoBySlug('grid');

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
      <GridDemo />
      <LabCode code={GRID_CODE} file="components/lab/GridDemo.tsx" />
    </LabPage>
  );
}
