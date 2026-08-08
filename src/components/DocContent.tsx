import { Link } from 'react-router';
import { ContextualMenu } from '@/components/ContextualMenu';
import { ChevronRight } from '@/components/icons';
import { getLastModified } from '@/lib/content';
import { getPrevNext, getStyling, showTimestamp } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';

export interface DocContentProps {
  page: NormalizedDocsPage;
  doc: DocModule;
}

/** Fixed locale and UTC keep the prerendered markup identical to hydration. */
const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeZone: 'UTC' });

export function DocContent({ page, doc }: DocContentProps) {
  const { prev, next } = getPrevNext(page.slug);
  const title = doc.frontmatter?.title || page.label;
  const description = doc.frontmatter?.description;
  const Content = doc.default;
  const lastModified = showTimestamp(doc.frontmatter?.timestamp)
    ? getLastModified(page.filePath)
    : undefined;
  // `styling.eyebrows`: the section name alone, or the full navigation path.
  const eyebrow =
    getStyling().eyebrows === 'breadcrumbs'
      ? [...new Set([page.tabLabel, page.section])].filter(Boolean).join(' / ')
      : page.section;

  return (
    <article className="min-w-0 grow">
      {eyebrow && <div className="font-bold text-[var(--color-primary)]">{eyebrow}</div>}
      <div className="flex items-start justify-between gap-4">
        {title && (
          <h1 className="my-3 text-4xl text-[var(--color-text-strong)] leading-[1.2] tracking-[-0.03em] [font-family:var(--font-heading)] [font-weight:var(--font-heading-weight,800)]">
            {title}
          </h1>
        )}
        <ContextualMenu page={page} />
      </div>
      {description && (
        <p className="mb-6 text-[1.1rem] text-[var(--color-text-muted)]">{description}</p>
      )}
      <div className="docs-markdown">
        <Content />
      </div>
      {lastModified && (
        <div className="mt-8 text-sm text-[var(--color-text-muted)]">
          Last updated on{' '}
          <time dateTime={lastModified}>{DATE_FORMAT.format(new Date(lastModified))}</time>
        </div>
      )}
      <div className="mt-8 flex items-center justify-between">
        <NavigationButton {...prev} isPrev />
        <NavigationButton {...next} />
      </div>
    </article>
  );
}

const NavigationButton = ({
  label,
  url,
  isPrev,
}: {
  label?: string;
  url?: string;
  isPrev?: boolean;
}) => {
  if (!url || !label) {
    return <div />;
  }

  return (
    <Link
      to={url}
      className="my-3 inline-flex items-center gap-3 text-[1.1rem] font-bold text-[var(--color-text-strong)]"
    >
      {isPrev && <ChevronRight size={14} className="rotate-180" />}
      {label}
      {!isPrev && <ChevronRight size={14} />}
    </Link>
  );
};
