'use client';
import { Grid, Box, Heading } from '@umami/react-zen';
import { useShiso } from './hooks/useShiso';
import { PageLinks } from './PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { ContentArea } from './ContentArea';

export function Docs() {
  const { content, config } = useShiso();

  if (!content) {
    return <Heading size="6">Page not found</Heading>;
  }

  const { tabs, navigation } = config?.docs || {};

  content.group = Object.keys(navigation).reduce((name, key) => {
    if (!name) {
      return navigation[key]?.find((section: { pages: any[] }) => {
        return section.pages.find(page => {
          return content.path.replace(/(\/index)?\.mdx$/, '').endsWith(page.url);
        });
      })?.group;
    }

    return name;
  }, null);

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="240px 1fr 240px">
        <SideNav tabs={tabs} navigation={navigation} />
        <ContentArea content={content} />
        <PageLinks items={content?.anchors} offset={150} />
      </Grid>
    </Box>
  );
}
