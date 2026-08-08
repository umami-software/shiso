import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { DocContent } from '@/components/DocContent';
import { Footer } from '@/components/Footer';
import { Menu } from '@/components/icons';
import { PageLinks } from '@/components/PageLinks';
import { SideNav } from '@/components/SideNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { renderInlineMarkdown } from '@/lib/inline-markdown';
import { DOCS_PREFIX } from '@/lib/paths';
import { docsConfig, getError404 } from '@/lib/site-config';
import type { DocModule, NormalizedDocsPage } from '@/lib/types';

/**
 * 404 view driven by the `errors.404` config key. The standard defaults to
 * redirecting home; that happens after hydration rather than during render,
 * because the prerendered 404.html must stay a static page for hosts that
 * serve it for every unknown path.
 */
function NotFound() {
  const navigate = useNavigate();
  const { redirect, title, description } = getError404();

  useEffect(() => {
    if (redirect) {
      navigate(DOCS_PREFIX || '/', { replace: true });
    }
  }, [redirect, navigate]);

  return (
    <div className="py-16 text-center">
      <h1>{title || 'Page not found'}</h1>
      {description && <p>{renderInlineMarkdown(description)}</p>}
    </div>
  );
}

export interface DocsProps {
  page: NormalizedDocsPage | null;
  doc: DocModule | null;
}

export function Docs({ page, doc }: DocsProps) {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { tabs, navigation } = docsConfig;

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  if (!page || !doc) {
    return (
      <div className="flex min-h-full flex-col">
        <div className="grow">
          <NotFound />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col gap-6 lg:gap-0">
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <div className="flex justify-end lg:hidden">
          <SheetTrigger render={<Button variant="outline" className="bg-card" />}>
            <Menu size={14} />
            Menu
          </SheetTrigger>
        </div>
        <SheetContent
          side="right"
          className="w-[min(320px,85vw)] gap-0 overflow-y-auto bg-background p-4 sm:max-w-80"
        >
          <SheetTitle className="sr-only">Documentation navigation</SheetTitle>
          <div className="pt-8">
            <SideNav tabs={tabs} navigation={navigation} />
          </div>
        </SheetContent>
      </Sheet>
      <div className="flex items-start gap-12 lg:min-h-[calc(100dvh-var(--header-height))] lg:pt-6">
        <div className="hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:h-[calc(100dvh-var(--header-height)-3rem)] lg:shrink-0">
          <SideNav tabs={tabs} navigation={navigation} isSticky />
        </div>
        <div className="flex min-w-0 grow self-stretch flex-col">
          <div className="flex grow items-start gap-12">
            <DocContent page={page} doc={doc} />
            <div className="hidden min-w-0 max-w-60 basis-60 self-start lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block lg:shrink-0">
              <PageLinks items={doc.toc} />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
