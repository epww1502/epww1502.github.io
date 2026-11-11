import fs from 'node:fs';
import path from 'node:path';
import type { MDXContent } from 'mdx/types';

/**
 * Portfolio case studies. Each one is an MDX file in content/cases that exports `meta`.
 * To add a case, add a file there; the list page, its own page and the PDF pick it up.
 */
export type CaseMeta = {
  title: string;
  /** Company or "개인 프로젝트", plus the period. */
  tag: string;
  summary: string;
  /** Position in the list, lowest first. */
  order: number;
  /** Featured cases are listed first on the portfolio page. */
  featured?: boolean;
  /** One headline number for the list card. */
  metric?: { value: string; label: string };
  stack: string;
};

export type Case = { slug: string; meta: CaseMeta; Content: MDXContent };

const CASES_DIR = path.join(process.cwd(), 'content', 'cases');

export function caseSlugs(): string[] {
  return fs
    .readdirSync(CASES_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

export async function loadCase(slug: string): Promise<Case> {
  const mod = (await import(`@/content/cases/${slug}.mdx`)) as { default: MDXContent; meta: CaseMeta };
  return { slug, meta: mod.meta, Content: mod.default };
}

export async function allCases(): Promise<Case[]> {
  const cases = await Promise.all(caseSlugs().map(loadCase));
  return cases.sort((a, b) => a.meta.order - b.meta.order);
}
