import { usePathname } from 'next/navigation';
import { Box, Tabs, TabList, Tab } from '@umami/react-zen';
import type { DocsTab } from '@/lib/types';
import Link from 'next/link';

export function TopNav({ tabs }: { tabs: DocsTab[] }) {
  const pathname = usePathname();

  const tab = [...(tabs || [])]
    .sort((a, b) => b.url.length - a.url.length)
    .find(({ url }) => pathname === url || pathname.startsWith(`${url}/`));
  const selected = tab?.id || tabs?.[0]?.id;

  return (
    <Box maxWidth="100vw" overflowX="auto" overflowY="hidden">
      <Tabs selectedKey={selected}>
        <TabList items={tabs}>
          {({ id, label, url }) => {
            return (
              <Tab id={id}>
                <Link href={url}>{label}</Link>
              </Tab>
            );
          }}
        </TabList>
      </Tabs>
    </Box>
  );
}
