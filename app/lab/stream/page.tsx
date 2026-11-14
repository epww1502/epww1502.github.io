import type { Metadata } from 'next';
import { StreamDemo } from '@/components/lab/StreamDemo';
import { LabCode, LabPage } from '@/components/lab/LabPage';
import { STREAM_CODE } from '@/lib/demoCode';
import { demoBySlug } from '@/lib/demos';

const demo = demoBySlug('stream');

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
      <StreamDemo />
      <LabCode code={STREAM_CODE} file="components/lab/StreamDemo.tsx" />
    </LabPage>
  );
}
