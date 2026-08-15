import type { ReactNode } from 'react';
import { useLocation } from 'react-router';
import { Banner } from '@/components/Banner';
import { Header } from '@/components/Header';
import { useHead } from '@/lib/head';
import type { SiteModel } from '@/lib/types';

export function Layout({ children, site }: { children: ReactNode; site: SiteModel }) {
  const { pathname } = useLocation();

  // Keep metadata, document language, and text direction synchronized after
  // client-side navigation. The prerendered values are retained on hydration.
  useHead(pathname);

  return (
    <div className="flex min-h-dvh flex-col">
      <Banner banner={site.banner} dismissLabel={site.labels.dismissBanner} />
      <Header site={site} />
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] grow flex-col px-5">
        <main className="min-h-0 grow">{children}</main>
      </div>
    </div>
  );
}
