import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tabs, TabList, Tab } from '@umami/react-zen';

export function TopNav({ tabs }) {
  const pathname = usePathname();

  const tab = tabs?.find(({ id, url }) => (id !== 'docs' ? pathname.startsWith(url) : false));
  const selected = tab?.id || 'docs';

  return (
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
  );
}
