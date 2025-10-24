import { usePathname } from 'next/navigation';
import { Box, Tabs, TabList, Tab } from '@umami/react-zen';
import Link from 'next/link';
import { getActiveTab } from '@/lib/navigation';

export function TopNav({ tabs }) {
  const pathname = usePathname();

  const activeTab = getActiveTab(pathname, tabs);

  return (
    <Box maxWidth="100vw" overflowX="auto" overflowY="hidden">
      <Tabs selectedKey={activeTab?.toString()}>
        <TabList>
          {tabs.map(({ tab, href, groups, pages }) => {
            const url = href || groups?.[0]?.pages?.[0] || pages?.[0];

            return (
              <Tab key={tab} id={tab}>
                <Link href={`/${url}`}>{tab}</Link>
              </Tab>
            );
          })}
        </TabList>
      </Tabs>
    </Box>
  );
}
