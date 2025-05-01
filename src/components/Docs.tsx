'use client';
import {
  Box,
  Heading,
  Button,
  Icon,
  Icons,
  Row,
  Column,
  Modal,
  DialogTrigger,
  Dialog,
  Text,
} from '@umami/react-zen';
import { ShisoContent } from '@/lib/types';
import { PageLinks } from './PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { DocContent } from './DocContent';

function parseContent(content: ShisoContent, config: any = {}) {
  const { tabs, navigation } = config;
  const keys = Object.keys(navigation);

  let next, prev, section, found;

  keys.forEach(key => {
    if (!found) {
      const groups = navigation[key];

      found = groups?.find((group: { section: string; pages: any[] }, groupIndex) => {
        return group.pages.find((page, pageIndex) => {
          const match =
            page.url.endsWith(content.slug) ||
            (content.slug === 'index' && content.path.endsWith('index.mdx'));

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

export function Docs({ content, config }) {
  if (!content) {
    return <Heading>Page not found</Heading>;
  }

  const { tabs, navigation, code, meta, section, next, prev, anchors } = parseContent(
    content,
    config?.docs,
  );

  const { top } = config?.docs || {};

  const navDisplay = {
    xs: 'none',
    lg: 'block',
  };

  const linksDisplay = {
    xs: 'none',
    lg: 'block',
  };

  const menuDisplay = {
    lg: 'none',
  };

  const MobileMenuButton = () => (
    <DialogTrigger>
      <Button>
        <Icon>
          <Icons.Menu />
        </Icon>
        <Text>Menu</Text>
      </Button>
      <Modal position="left" offset="70px">
        <Dialog variant="sheet">
          {({ close }) => {
            return (
              <Box overflow="auto" padding="4" onClick={close}>
                <SideNav tabs={tabs} navigation={navigation} />
              </Box>
            );
          }}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );

  return (
    <Column gap="6">
      {tabs && <TopNav tabs={tabs} />}
      <Row display={menuDisplay} justifyContent="flex-end">
        <MobileMenuButton />
      </Row>
      <Row gap="6">
        <SideNav
          display={navDisplay}
          tabs={tabs}
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
        <PageLinks display={linksDisplay} items={anchors} style={{ top }} />
      </Row>
    </Column>
  );
}
