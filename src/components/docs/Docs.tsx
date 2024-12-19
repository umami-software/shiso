import { Grid, Box, Heading } from '@umami/react-zen';
import PageLinks from './PageLinks';
import SideNav from './SideNav';
import TopNav from './TopNav';
import { ContentArea } from './ContentArea';
import { ShisoConfig } from '../Shiso';

export interface contentsProps {
  config: ShisoConfig;
  content: any;
}

export function Docs({ content, config }: contentsProps) {
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

  console.log({ config, tabs, content });

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="240px 1fr 240px">
        <SideNav tabs={tabs} navigation={navigation} />
        <ContentArea
          title={content?.meta?.title}
          body={content?.body}
          group={content?.group}
          description={content?.meta?.description}
        />
        <PageLinks items={content?.anchors} offset={150} />
      </Grid>
    </Box>
  );
}
