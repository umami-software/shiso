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
import { usePathname } from 'next/navigation';
import { DocsConfig, ComponentProps } from '@/lib/types';
import { Menu } from '@/components/icons';
import { PageLinks } from '@/components/common/PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { DocContent } from './DocContent';
import { getNavigationDetails } from '@/lib/navigation';

export function Docs({ content, config }: ComponentProps<DocsConfig>) {
  const pathname = usePathname();

  if (!content) {
    return <Heading>Page not found</Heading>;
  }

  if (!config) {
    return null;
  }

  console.log({ content, config });

  const { code, meta, toc } = content;
  const { navigation } = config;
  const { top } = navigation;
  const { groupName, nextPage, prevPage } = getNavigationDetails(pathname, navigation);

  console.log({ groupName, nextPage, prevPage });

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
          section={groupName}
          title={meta?.title}
          description={meta?.description}
          code={code}
          nextPage={nextPage}
          prevPage={prevPage}
        />
        <PageLinks
          display={{
            xs: 'none',
            lg: 'flex',
          }}
          items={toc}
          style={{ top }}
        />
      </Row>
    </Column>
  );
}
