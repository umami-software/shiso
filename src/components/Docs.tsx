'use client';
import { Grid, Box, Heading, Row } from '@umami/react-zen';
import { useShiso } from './hooks/useShiso';
import { PageLinks } from './PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { ContentArea } from './ContentArea';
import { ShisoContent } from '@/lib/types';

function parseContent(content: ShisoContent, config: any = {}) {
  const { tabs, navigation } = config;
  const keys = Object.keys(navigation);

  let next, prev, section, found;

  keys.forEach(key => {
    if (!found) {
      const groups = navigation[key];

      found = groups?.find((group: { section: string; pages: any[] }, groupIndex) => {
        return group.pages.find((page, pageIndex) => {
          const match = content.path.replace(/(\/index)?\.mdx$/, '').endsWith(page.url);

          if (match) {
            const prevGroup = groups[groupIndex - 1];
            const nextGroup = groups[groupIndex + 1];

            prev = group.pages[pageIndex - 1] || prevGroup?.pages?.at(-1);
            next = group.pages[pageIndex + 1] || nextGroup?.pages?.[0];
            section = group.section;
          }

          return match;
        });
      });
    }
  });

  return { ...content, tabs, navigation, section, next, prev };
}

export function Docs() {
  const { content, config } = useShiso();

  if (!content) {
    return <Heading size="6">Page not found</Heading>;
  }

  const { tabs, navigation, code, meta, section, next, prev, anchors } = parseContent(
    content,
    config?.docs,
  );

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="240px 1fr 240px">
        <SideNav tabs={tabs} navigation={navigation} />
        <ContentArea
          section={section}
          title={meta?.title}
          description={meta?.description}
          code={code}
          next={next}
          prev={prev}
        />
        <PageLinks items={anchors} offset={150} />
      </Grid>
    </Box>
  );
}
