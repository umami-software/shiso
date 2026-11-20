import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DocContent } from '@/components/DocContent';
import { PanelProvider, usePanelContent } from '@/components/docs/panel-context';
import { Footer } from '@/components/Footer';
import { PageLinks } from '@/components/PageLinks';
import { SearchSlot } from '@/components/Search';
import { SideNav } from '@/components/SideNav';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { getReferencePage } from '@/lib/openapi';
import { docsHomeUrl, getScopeByPathname } from '@/lib/site-config';
import type {
  DocModule,
  NormalizedDocsPage,
  ReferencePage,
  SiteModel,
  TocEntry,
} from '@/lib/types';

/**
 * 404 view driven by the `errors.404` config key. The standard defaults to
 * redirecting home; that happens after hydration rather than during render,
 * because the prerendered 404.html must stay a static page for hosts that
 * serve it for every unknown path.
 */
function NotFound({ site }: { site: SiteModel }) {
  const navigate = useNavigate();
  const { redirect, title, description } = site.error404;

  useEffect(() => {
    if (redirect) {
      navigate(docsHomeUrl, { replace: true });
    }
  }, [redirect, navigate]);

  return (
    <div className="py-16 text-center">
      <h1>{title || site.labels.notFound}</h1>
      {description && <p>{renderInlineMarkdown(description)}</p>}
    </div>
  );
}

export interface DocsProps {
  page: NormalizedDocsPage | null;
  doc: DocModule | null;
  site: SiteModel;
}

export function Docs({ page, doc, site }: DocsProps) {
  if (!page || !doc) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="grow">
          <NotFound site={site} />
        </div>
        <Footer footer={site.footer} />
      </div>
    );
  }

  // API reference pages append their generated section anchors to the TOC.
  const reference = getReferencePage(doc.frontmatter, site.api.playground, site.labels);
  const toc = [
    ...(doc.toc || []),
    ...reference.sections.map(({ name, id }) => ({ name, id, size: 2 })),
  ];

  return (
    <PanelProvider>
      <DocsBody page={page} doc={doc} site={site} toc={toc} reference={reference} />
    </PanelProvider>
  );
}

function DocsBody({
  page,
  doc,
  site,
  toc,
  reference,
}: {
  page: NormalizedDocsPage;
  doc: DocModule;
  site: SiteModel;
  toc: TocEntry[] | undefined;
  reference: ReferencePage;
}) {
  const { pathname } = useLocation();
  // Navigation follows the scope (version/language) that owns the current page.
  const scopeDocs = getScopeByPathname(pathname).docs;
  const { tabs, navigation } = scopeDocs;
  // A <Panel> in the page replaces the table of contents in the right rail.
  const panel = usePanelContent();

  // Start each newly loaded page at the top. Hash links keep their native
  // section-scrolling behavior.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname]);

  return (
    <div className="flex min-h-full flex-col gap-6 lg:gap-0">
      <div className="flex items-start gap-12 pt-6 lg:min-h-[calc(100dvh-var(--header-height))]">
        <div className="hidden min-w-0 max-w-60 basis-60 flex-col gap-4 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:flex lg:h-[calc(100dvh-var(--header-height)-3rem)] lg:shrink-0">
          <SearchSlot site={site} position="sidebar" className="w-full" />
          <SideNav
            tabs={tabs}
            navigation={navigation}
            anchors={scopeDocs.anchors}
            activeTabId={page.tabId}
            isSticky
            drilldown={site.drilldown}
            navigationLabel={site.labels.documentationNavigation}
            expandLabel={site.labels.expand}
            collapseLabel={site.labels.collapse}
          />
        </div>
        <div className="flex min-w-0 grow self-stretch flex-col">
          <div className="flex grow items-start gap-12">
            <DocContent page={page} doc={doc} site={site} reference={reference} />
            <div className="hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:shrink-0">
              {panel ?? (
                <PageLinks
                  items={toc}
                  title={site.labels.tableOfContents}
                  navigationLabel={site.labels.tableOfContentsNavigation}
                />
              )}
            </div>
          </div>
          <Footer footer={site.footer} className="lg:mr-72" />
        </div>
      </div>
    </div>
  );
}
