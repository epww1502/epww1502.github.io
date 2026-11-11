import type { Case } from '@/lib/cases';

/** One case study: tag, title, summary, then the MDX body. Used by the case page and the print page. */
export function CaseArticle({ item, heading = 'h1' }: { item: Case; heading?: 'h1' | 'h2' }) {
  const { meta, Content } = item;
  const Title = heading;
  return (
    <article className="project" id={item.slug}>
      <p className="tag">{meta.tag}</p>
      <Title className="project-title">{meta.title}</Title>
      <p className="summary">{meta.summary}</p>
      <Content />
    </article>
  );
}
