import type { MDXComponents } from 'mdx/types';
import { Also, Case, Fact, Facts, Flow, Gallery, Note, Step } from '@/components/CaseParts';
import { ChartRenderDiagram } from '@/components/ChartRenderDiagram';

/** Components available in every MDX case study without importing them. */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components, Also, Case, Fact, Facts, Flow, Gallery, Note, Step, ChartRenderDiagram };
}
