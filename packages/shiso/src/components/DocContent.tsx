import { Link } from 'react-router';
import { ContextualMenu } from '@/components/ContextualMenu';
import { Badge } from '@/components/docs/Badge';
import { ArrowLeft, ArrowRight, FileText } from '@/components/icons';
import { OpenApiOperation } from '@/components/OpenApiOperation';
import { OpenApiSchema } from '@/components/OpenApiSchema';
import { PageActions } from '@/components/PageActions';
import { getLastModified } from '@/lib/content';
import { getScopeForPage } from '@/lib/docs-config';
import { resolveLocale } from '@/lib/locale';
import { getReferencePage, methodColor } from '@/lib/openapi';
import { docsSite, getPageByPathname } from '@/lib/site-config';
import { resolveContextualOptions } from '@/lib/site-model';
import type {
  DocModule,
  NormalizedDocsPage,
  ReferencePage,
  RelatedEntry,
  SiteModel,
} from '@/lib/types';
import { cn } from '@/lib/utils';

interface RelatedLink {
  href: string;
  title: string;
  external: boolean;
}

/**
 * Related-topics entries from frontmatter. Bare paths resolve their title from
 * the docs registry; unknown internal paths without an explicit title are
 * skipped so dead links never render.
 */
function resolveRelated(entries: unknown): RelatedLink[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  const links: RelatedLink[] = [];

  for (const entry of entries as RelatedEntry[]) {
    const href = typeof entry === 'string' ? entry : entry?.href;

    if (!href || typeof href !== 'string') {
      continue;
    }

    const external = !href.startsWith('/');
    const explicitTitle = typeof entry === 'object' ? entry.title : undefined;
    const title = explicitTitle || (external ? href : getPageByPathname(href)?.label);

    if (!title) {
      if (import.meta.env.DEV) {
        console.warn(
          `[shiso] Related topic "${href}" does not match a page and has no title — skipped.`,
        );
      }
      continue;
    }

    links.push({ href, title, external });
  }

  return links;
}

export interface DocContentProps {
  page: NormalizedDocsPage;
  doc: DocModule;
  site: SiteModel;
  reference?: ReferencePage;
}

export function DocContent({ page, doc, site, reference: preparedReference }: DocContentProps) {
  const scope = getScopeForPage(docsSite, page);
  // Prev/next paging never crosses a version or language boundary.
  const pagerPages = scope.docs.pages.filter(item => !item.hidden);
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
  const related = resolveRelated(doc.frontmatter?.related);
  const reference =
    preparedReference ?? getReferencePage(doc.frontmatter, site.api.playground, site.labels);
  const { operation, schema, playground } = reference;
  // Dates follow the page's language when it is a valid locale code.
  const dateFormat = new Intl.DateTimeFormat(resolveLocale(page.language, site.locale), {
    dateStyle: 'medium',
    timeZone: 'UTC',
  });

  // Pagefind indexing markers on the prerendered HTML. Inert unless the site
  // uses the pagefind provider. Hidden pages/scopes mirror the local index's
  // search visibility rules; the scope filter matches the id Search.tsx sends.
  const pagefindAttrs =
    page.hidden || scope.hidden
      ? {}
      : {
          'data-pagefind-body': '',
          ...(page.scopeId !== 'default'
            ? { 'data-pagefind-filter': 'scope[data-scope]', 'data-scope': page.scopeId }
            : {}),
        };

  return (
    <article className="min-w-0 grow" {...pagefindAttrs}>
      {eyebrow && <div className="text-sm font-medium text-primary">{eyebrow}</div>}
      <div className="flex items-start justify-between gap-4">
        {title && (
          <h1 className="mt-2 text-4xl text-foreground leading-[1.2] tracking-[-0.03em] [font-family:var(--font-heading)] [font-weight:var(--font-heading-weight,700)]">
            {title}
          </h1>
        )}
        <ContextualMenu options={contextualOptions} labels={site.labels} />
      </div>
      {operation && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge
            color={methodColor(operation.webhook ? 'WEBHOOK' : operation.method)}
            size="sm"
            className="font-mono"
          >
            {operation.webhook ? 'WEBHOOK' : operation.method}
          </Badge>
          <code className="font-mono text-muted-foreground text-sm">{operation.path}</code>
          {operation.deprecated && (
            <Badge color="red" size="sm" stroke>
              deprecated
            </Badge>
          )}
        </div>
      )}
      {description && (
        <p className="mt-3 mb-8 text-lg text-muted-foreground leading-relaxed">{description}</p>
      )}
      <div className="docs-markdown">
        <Content />
      </div>
      {operation && (
        <OpenApiOperation
          operation={operation}
          playground={playground}
          sections={reference.sections}
        />
      )}
      {schema && <OpenApiSchema page={schema} sections={reference.sections} />}
      <PageActions
        key={page.url}
        page={page}
        frontmatter={doc.frontmatter}
        site={site}
        lastUpdated={
          lastModified ? (
            <>
              {site.labels.lastUpdated}{' '}
              <time dateTime={lastModified}>{dateFormat.format(new Date(lastModified))}</time>
            </>
          ) : undefined
        }
      />
      {related.length > 0 && (
        <nav className="mt-8" aria-label={site.labels.relatedTopics} data-pagefind-ignore>
          <div className="text-sm text-muted-foreground">{site.labels.relatedTopics}</div>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            {related.map(({ href, title, external }) => (
              <li key={href} className="flex items-center gap-2">
                <FileText size={14} className="shrink-0 text-muted-foreground" />
                {external ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-foreground hover:text-primary"
                  >
                    {title}
                  </a>
                ) : (
                  <Link to={href} className="text-foreground hover:text-primary">
                    {title}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
      <div className="mt-8 flex items-end justify-between" data-pagefind-ignore>
        <NavigationButton {...prev} eyebrow={site.labels.previousPage} isPrev />
        <NavigationButton {...next} eyebrow={site.labels.nextPage} />
      </div>
    </article>
  );
}

const NavigationButton = ({
  label,
  url,
  eyebrow,
  isPrev,
}: {
  label?: string;
  url?: string;
  /** Direction caption ("Previous" / "Next") shown above the page title. */
  eyebrow: string;
  isPrev?: boolean;
}) => {
  if (!url || !label) {
    return <div className="flex-1" />;
  }

  return (
    <Link
      to={url}
      // The link stretches across its half of the row so the whole box is
      // clickable, not just the text. Vertical margin became padding for the
      // same reason.
      className={cn('group flex flex-1 items-end gap-3 py-3 text-base text-foreground', {
        'justify-end text-right': !isPrev,
      })}
      rel={isPrev ? 'prev' : 'next'}
    >
      {isPrev && (
        <ArrowLeft
          size={14}
          className="mb-[0.3rem] text-muted-foreground transition-colors group-hover:text-foreground"
        />
      )}
      <span className="flex flex-col">
        <span className="text-xs font-bold text-muted-foreground">{eyebrow}</span>
        <span className="font-medium transition-colors group-hover:text-primary">{label}</span>
      </span>
      {!isPrev && (
        <ArrowRight
          size={14}
          className="mb-[0.3rem] text-muted-foreground transition-colors group-hover:text-foreground"
        />
      )}
    </Link>
  );
};
