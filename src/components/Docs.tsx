'use client';
import { Grid, Box, Heading } from '@umami/react-zen';
import PageLinks from './PageLinks';
import SideNav from './SideNav';
import TopNav from './TopNav';
import { ContentArea } from './ContentArea';
import { ShisoConfig } from './Shiso';

export interface DocsProps {
  config: ShisoConfig;
  content: any;
  components?: { [key: string]: any };
}

export function Docs({ content, config, components }: DocsProps) {
  if (!content) {
    return <Heading size="6">Page not found</Heading>;
  }

  const { tabs, navigation } = config?.docs || {};

  content.group = Object.keys(navigation).reduce((name, key) => {
    if (!name) {
      return navigation[key]?.find((section: { pages: any[] }) => {
        return section.pages.find(
          page =>
            page.url === `/docs/${content.id}` || (page.url === `/docs` && content.id === 'index'),
        );
      })?.group;
    }

    return name;
  }, null);

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="240px 1fr 240px">
        <SideNav tabs={tabs} navigation={navigation} />
        <ContentArea content={content} components={components} />
        <PageLinks items={content?.anchors} offset={150} />
      </Grid>
    </Box>
  );
}
