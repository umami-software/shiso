import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DocContent } from '@/components/DocContent';
import { Footer } from '@/components/Footer';
import { Menu } from '@/components/icons';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { PageLinks } from '@/components/PageLinks';
import { SideNav } from '@/components/SideNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { VersionSwitcher } from '@/components/VersionSwitcher';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { docsHomeUrl, getScopeByPathname } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage, SiteModel } from '@/lib/types';

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
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  // Navigation follows the scope (version/language) that owns the current page.
  const scopeDocs = getScopeByPathname(pathname).docs;
  const { tabs, navigation } = scopeDocs;

  // Close the mobile menu and start each newly loaded page at the top. Hash
  // links keep their native section-scrolling behavior.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setMenuOpen(false);
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname]);

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

  return (
    <div className="flex min-h-full flex-col gap-6 lg:gap-0">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <div className="flex justify-end lg:hidden">
          <SheetTrigger render={<Button variant="outline" className="bg-card" />}>
            <Menu className="size-3.5" />
            {site.labels.menu}
          </SheetTrigger>
        </div>
        <SheetContent
          side="right"
          className="w-[min(320px,85vw)] gap-0 overflow-y-auto bg-background p-4 sm:max-w-80"
        >
          <SheetTitle className="sr-only">{site.labels.documentationNavigation}</SheetTitle>
          <div className="pt-8">
            <div className="flex items-center gap-2 pb-4 lg:hidden">
              <VersionSwitcher />
              <LanguageSwitcher />
            </div>
            <SideNav
              tabs={tabs}
              navigation={navigation}
              anchors={scopeDocs.anchors}
              drilldown={site.drilldown}
              navigationLabel={site.labels.documentationNavigation}
              expandLabel={site.labels.expand}
              collapseLabel={site.labels.collapse}
            />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-start gap-12 lg:min-h-[calc(100dvh-var(--header-height))] lg:pt-6">
        <div className="hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:h-[calc(100dvh-var(--header-height)-3rem)] lg:shrink-0">
          <SideNav
            tabs={tabs}
            navigation={navigation}
            anchors={scopeDocs.anchors}
            isSticky
            drilldown={site.drilldown}
            navigationLabel={site.labels.documentationNavigation}
            expandLabel={site.labels.expand}
            collapseLabel={site.labels.collapse}
          />
        </div>
        <div className="flex min-w-0 grow self-stretch flex-col">
          <div className="flex grow items-start gap-12">
            <DocContent page={page} doc={doc} site={site} />
            <div className="hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:shrink-0">
              <PageLinks
                items={doc.toc}
                title={site.labels.tableOfContents}
                navigationLabel={site.labels.tableOfContentsNavigation}
              />
            </div>
          </div>
          <Footer footer={site.footer} className="lg:mr-72" />
        </div>
      </div>
    </div>
  );
}
