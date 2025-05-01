import { usePathname } from 'next/navigation';
import { Box, Tabs, TabList, Tab } from '@umami/react-zen';
import Link from 'next/link';

export function TopNav({ tabs }) {
  const pathname = usePathname();

  const tab = tabs?.find(({ id, url }) => (id !== 'docs' ? pathname.startsWith(url) : false));
  const selected = tab?.id || 'docs';

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
