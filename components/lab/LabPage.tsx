import Link from 'next/link';
import type { ReactNode } from 'react';
import { TopBar } from '@/components/TopBar';

/**
 * Frame shared by the demo pages: top bar, title, what the demo reproduces, then the demo itself.
 * `caseSlug` links back to the portfolio case study the demo comes from.
 */
export function LabPage({
  title,
  summary,
  caseSlug,
  caseTitle,
  problem,
  fix,
  children,
}: {
  title: string;
  summary: string;
  caseSlug: string;
  caseTitle: string;
  problem: string;
  fix: string;
  children: ReactNode;
}) {
  return (
    <main className="page lab">
      <TopBar links={['lab', 'resume', 'portfolio']} />
      <article className="project">
        <p className="tag">직접 해보는 데모</p>
        <h1 className="project-title">{title}</h1>
        <p className="summary">{summary}</p>
        <div className="facts">
          <div>
            <b>원래 문제</b>
            {problem}
          </div>
          <div>
            <b>고친 방법</b>
            {fix}
          </div>
          <div>
            <b>관련 사례</b>
            <Link href={`/portfolio/${caseSlug}`}>{caseTitle} →</Link>
          </div>
        </div>
        {children}
        <p className="note lab-disclaimer">
          실제 제품 코드가 아니라 같은 원리를 새로 구현한 데모입니다. 지연을 일부러 넣지 않았고, 두 방식의 차이는 그리는
          방법뿐입니다. 숫자는 지금 이 기기에서 잰 값이라 기기마다 다릅니다.
        </p>
      </article>
    </main>
  );
}

/** Two or three choices in a row; the chosen one is filled. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  disabled = false,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={option.value === value ? 'on' : undefined}
          aria-pressed={option.value === value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** One number with its label, used in the row of readouts above each demo. */
export function Stat({ label, value, accent = false }: { label: string; value: ReactNode; accent?: boolean }) {
  return (
    <div className={accent ? 'stat accent' : 'stat'}>
      <b>{value}</b>
      <span>{label}</span>
    </div>
  );
}

const SOURCE = 'https://github.com/epww1502/epww1502.github.io/blob/main/';

/** The few lines that make the difference, with a link to the full source of the demo. */
export function LabCode({ code, file }: { code: string; file: string }) {
  return (
    <section className="lab-section">
      <h2>핵심 코드</h2>
      <pre>
        <code>{code}</code>
      </pre>
      <p className="note">
        데모 소스에서 줄인 것입니다. 전체 코드는 <a href={SOURCE + file}>{file}</a>에 있습니다.
      </p>
    </section>
  );
}

/** A titled list, for what the demo leaves out compared with the real product. */
export function LabNotes({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="lab-section">
      <h2>{title}</h2>
      <ul className="lab-notes">{children}</ul>
    </section>
  );
}
