'use client';
import {
  Box,
  Heading,
  Button,
  Icon,
  Row,
  Column,
  Modal,
  DialogTrigger,
  Dialog,
  Text,
} from '@umami/react-zen';
import { Content, DocsConfig, ComponentProps } from '@/lib/types';
import { Menu } from '@/components/icons';
import { PageLinks } from '@/components/common/PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { DocContent } from './DocContent';

export function Docs({ content, config }: ComponentProps<DocsConfig>) {
  if (!content) {
    return <Heading>Page not found</Heading>;
  }

  if (!config) {
    return null;
  }

  console.log({ content, config });

  const { code, meta, anchors } = content;
  const { navigation } = config;
  const { top } = navigation;
  const { section, next, prev } = parseContent(content, config);

  const MobileMenuButton = () => (
    <DialogTrigger>
      <Button>
        <Icon>
          <Menu />
        </Icon>
        <Text>Menu</Text>
      </Button>
      <Modal placement="left" offset="70px">
        <Dialog variant="sheet">
          {({ close }) => {
            return (
              <Box overflow="auto" padding="4" onClick={close}>
                <SideNav navigation={navigation} />
              </Box>
            );
          }}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );

  return (
    <Column gap="6">
      {navigation.tabs && <TopNav tabs={navigation.tabs} />}
      <Row display={{ lg: 'none' }} justifyContent="flex-end">
        <MobileMenuButton />
      </Row>
      <Row gap="6">
        <SideNav
          display={{
            xs: 'none',
            lg: 'flex',
          }}
          navigation={navigation}
          style={{ top }}
          isSticky
          autoHeight
        />
        <DocContent
          section={section}
          title={meta?.title}
          description={meta?.description}
          code={code}
          next={next}
          prev={prev}
        />
        <PageLinks
          display={{
            xs: 'none',
            lg: 'flex',
          }}
          items={anchors}
          style={{ top }}
        />
      </Row>
    </Column>
  );
}

function parseContent(content: Content, config?: DocsConfig) {
  const { navigation } = config || {};

  let next, prev, section, found;

  return { navigation, section, next, prev };
}
