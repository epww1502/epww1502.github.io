import { Fragment, type ReactNode } from 'react';

/** Pieces used inside the MDX case studies. They are registered in mdx-components.tsx. */

/** Grey box of key facts under the summary: role, scale, stack, links. */
export function Facts({ children }: { children: ReactNode }) {
  return <div className="facts">{children}</div>;
}

export function Fact({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <b>{label}</b>
      {children}
    </div>
  );
}

type Shot = { src: string; caption: string; alt?: string; wide?: boolean; webOnly?: boolean };

/** Screenshot grid. `phones` lays out tall phone captures four across. */
export function Gallery({ shots, phones = false }: { shots: Shot[]; phones?: boolean }) {
  return (
    <div className={phones ? 'gallery phones' : 'gallery'}>
      {shots.map((shot) => (
        <figure key={shot.src} className={[shot.wide && 'wide', shot.webOnly && 'no-print'].filter(Boolean).join(' ') || undefined}>
          <img src={`/img/${shot.src}`} alt={shot.alt ?? shot.caption} loading="lazy" />
          <figcaption>{shot.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}

/** One problem and how it was handled, as a label/description list. */
export function Case({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="case">
      <h3>{title}</h3>
      <dl>{children}</dl>
    </section>
  );
}

export function Step({ label, result = false, children }: { label: string; result?: boolean; children: ReactNode }) {
  return (
    <Fragment>
      <dt>{label}</dt>
      <dd className={result ? 'result' : undefined}>{children}</dd>
    </Fragment>
  );
}

/** Short bulleted list of remaining work, under its own small heading. */
export function Also({ title = '그 외 맡은 일', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="also">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

/** Left-to-right steps with arrows between them. Wraps to rows on narrow screens. */
export function Flow({ steps, caption }: { steps: { title: string; detail?: string; accent?: boolean }[]; caption?: string }) {
  return (
    <figure className="diagram">
      <ol className="flow">
        {steps.map((step) => (
          <li key={step.title} className={step.accent ? 'accent' : undefined}>
            <strong>{step.title}</strong>
            {step.detail && <span>{step.detail}</span>}
          </li>
        ))}
      </ol>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Small note under a code sample or diagram. */
export function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>;
}
