import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { Menu } from '@/components/icons';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { SideNav } from '@/components/SideNav';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { VersionSwitcher } from '@/components/VersionSwitcher';
import { getPageByPathname, getScopeByPathname, getStandalonePage } from '@/lib/site-config';
import type { SiteModel } from '@/lib/types';

/**
 * Hamburger trigger and sheet that stand in for the docs sidebar on small
 * screens. Rendered by the header, and only on docs pages: standalone pages
 * and 404s have no sidebar to collapse.
 */
export function MobileNav({ site }: { site: SiteModel }) {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const page = getStandalonePage(pathname) ? null : getPageByPathname(pathname);
  // Navigation follows the scope (version/language) that owns the current page.
  const scopeDocs = getScopeByPathname(pathname).docs;

  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (!page) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="-ml-2 text-foreground hover:bg-accent lg:hidden"
            aria-label={site.labels.menu}
          />
        }
      >
        <Menu className="size-4" />
      </SheetTrigger>
      <SheetContent
        side="left"
        // Same `data-[side=left]` variant as the sheet's default 3/4 width so
        // these replace it: 320px, or the full screen on narrower devices.
        className="gap-0 overflow-hidden bg-background p-4 data-[side=left]:w-80 data-[side=left]:max-w-full"
      >
        <SheetTitle className="sr-only">{site.labels.documentationNavigation}</SheetTitle>
        <div className="flex min-h-0 flex-1 flex-col pt-8">
          <div className="flex items-center gap-2 pb-4">
            <VersionSwitcher />
            <LanguageSwitcher />
          </div>
          <SideNav
            tabs={scopeDocs.tabs}
            navigation={scopeDocs.navigation}
            anchors={scopeDocs.anchors}
            activeTabId={page.tabId}
            isSticky
            drilldown={site.drilldown}
            navigationLabel={site.labels.documentationNavigation}
            expandLabel={site.labels.expand}
            collapseLabel={site.labels.collapse}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
