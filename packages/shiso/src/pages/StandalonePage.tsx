import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { Docs } from '@/components/Docs';
import { Footer } from '@/components/Footer';
import { getDocModule } from '@/lib/content';
import type { SiteModel, StandalonePage } from '@/lib/types';

/**
 * A standalone (non-docs) page: site chrome from Layout (banner, header),
 * the MDX content at full container width — no sidebar, TOC, or pager — and
 * the footer. MDX components come from the app-level MDXProvider.
 */
export function StandalonePageView({ page, site }: { page: StandalonePage; site: SiteModel }) {
  const { pathname } = useLocation();
  const doc = getDocModule(page.filePath);

  // Start each newly loaded page at the top, like Docs does for docs routes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [pathname]);

  // Normalization guarantees the file exists; this is a build-drift safety net.
  if (!doc) {
    return <Docs page={null} doc={null} site={site} />;
  }

  const Content = doc.default;

  return (
    <div className="flex min-h-full flex-col">
      <article className="grow py-8">
        <div className="docs-markdown">
          <Content />
        </div>
      </article>
      <Footer footer={site.footer} />
    </div>
  );
}
