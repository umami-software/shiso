import { Link } from 'react-router';
import { ContextualMenu } from '@/components/ContextualMenu';
import { ChevronRight } from '@/components/icons';
import { getLastModified } from '@/lib/content';
import { getScopeForPage } from '@/lib/docs-config';
import { resolveLocale } from '@/lib/locale';
import { docsSite } from '@/lib/site-config';
import { resolveContextualOptions } from '@/lib/site-model';
import type { DocModule, NormalizedDocsPage, SiteModel } from '@/lib/types';

export interface DocContentProps {
  page: NormalizedDocsPage;
  doc: DocModule;
  site: SiteModel;
}

export function DocContent({ page, doc, site }: DocContentProps) {
  // Prev/next paging never crosses a version or language boundary.
  const pagerPages = getScopeForPage(docsSite, page).docs.pages.filter(item => !item.hidden);
  const pageIndex = pagerPages.findIndex(item => item.slug === page.slug);
  const prev = pageIndex > 0 ? pagerPages[pageIndex - 1] : undefined;
  const next = pageIndex >= 0 ? pagerPages[pageIndex + 1] : undefined;
  const title = doc.frontmatter?.title || page.label;
  const description = doc.frontmatter?.description;
  const Content = doc.default;
  const shouldShowTimestamp =
    typeof doc.frontmatter?.timestamp === 'boolean'
      ? doc.frontmatter.timestamp
      : site.showTimestamp;
  const lastModified = shouldShowTimestamp ? getLastModified(page.filePath) : undefined;
  // `styling.eyebrows`: the section name alone, or the full navigation path.
  const eyebrow =
    site.styling.eyebrows === 'breadcrumbs'
      ? [...new Set([page.tabLabel, page.section])].filter(Boolean).join(' / ')
      : page.section;
  const contextualOptions = resolveContextualOptions(site.contextualOptions, page, site.labels);
  // Dates follow the page's language when it is a valid locale code.
  const dateFormat = new Intl.DateTimeFormat(resolveLocale(page.language, site.locale), {
    dateStyle: 'medium',
    timeZone: 'UTC',
  });

  return (
    <article className="min-w-0 grow">
      {eyebrow && <div className="text-sm font-bold text-primary">{eyebrow}</div>}
      <div className="flex items-start justify-between gap-4">
        {title && (
          <h1 className="mt-2 text-4xl text-foreground leading-[1.2] tracking-[-0.03em] [font-family:var(--font-heading)] [font-weight:var(--font-heading-weight,800)]">
            {title}
          </h1>
        )}
        <ContextualMenu options={contextualOptions} labels={site.labels} />
      </div>
      {description && <p className="mt-1 mb-6 text-base text-muted-foreground">{description}</p>}
      <div className="docs-markdown">
        <Content />
      </div>
      {lastModified && (
        <div className="mt-8 text-sm text-muted-foreground">
          {site.labels.lastUpdated}{' '}
          <time dateTime={lastModified}>{dateFormat.format(new Date(lastModified))}</time>
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
      className="group my-3 inline-flex items-center gap-3 text-base font-bold text-foreground"
    >
      {isPrev && (
        <ChevronRight
          size={14}
          className="rotate-180 text-muted-foreground transition-colors group-hover:text-foreground"
        />
      )}
      {label}
      {!isPrev && (
        <ChevronRight
          size={14}
          className="text-muted-foreground transition-colors group-hover:text-foreground"
        />
      )}
    </Link>
  );
};
