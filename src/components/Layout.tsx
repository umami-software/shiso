import type { ReactNode } from 'react';
import { Banner } from '@/components/Banner';
import { Header } from '@/components/Header';
import type { SiteModel } from '@/lib/types';

export function Layout({ children, site }: { children: ReactNode; site: SiteModel }) {
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
