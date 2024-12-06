import { Grid, Box } from '@umami/react-zen';
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
  const { tabs, navigation } = config?.docs || {};

  console.log({ config, tabs });

  return (
    <Box flexGrow="1">
      {tabs && <TopNav tabs={tabs} />}
      <Grid gap="6" columns="max-content 1fr max-content">
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
