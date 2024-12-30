'use client';
import { Grid, Box, Heading, Row } from '@umami/react-zen';
import { useShiso } from './hooks/useShiso';
import { PageLinks } from './PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { ContentArea } from './ContentArea';

function parseContent(content: { [key: string]: any }, config: any = {}) {
  const { tabs, navigation } = config;

  let next,
    prev,
    group,
    prevKey,
    found = false;

  for (const key in navigation) {
    if (!group) {
      group = navigation[key]?.find((section: { group: string; pages: any[] }, sectionIndex) => {
        return section.pages.find((page, pageIndex) => {
          const found = content.path.replace(/(\/index)?\.mdx$/, '').endsWith(page.url);

          if (found) {
            prev = section.pages[pageIndex - 1] || section[prevKey]?.pages?.[sectionIndex - 1];
            next = section.pages[pageIndex + 1];
          }

          return found;
        });
      })?.group;
      prevKey = key;
    }
  }

  return { ...content, tabs, navigation, group, next, prev };
}

export function Docs() {
  const { content, config } = useShiso();

  if (!content) {
    return <Heading size="6">Page not found</Heading>;
  }

  const { tabs, navigation, group, next, prev } = parseContent(content, config?.docs);

  console.log({ content, next, prev, group });

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="240px 1fr 240px">
        <SideNav tabs={tabs} navigation={navigation} />
        <ContentArea
          group={group}
          title={content.meta?.title}
          description={content.meta?.description}
          code={content.code}
          next={next}
          prev={prev}
        />
        <PageLinks items={content?.anchors} offset={150} />
      </Grid>
    </Box>
  );
}
