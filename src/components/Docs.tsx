'use client';
import {
  Grid,
  Box,
  Heading,
  Button,
  Icon,
  Icons,
  Row,
  Modal,
  DialogTrigger,
  Dialog,
  Text,
} from '@umami/react-zen';
import { useShiso } from './hooks/useShiso';
import { PageLinks } from './PageLinks';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { ContentArea } from './ContentArea';
import { ShisoContent } from '@/lib/types';
import Link from 'next/link';

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
    return <Heading>Page not found</Heading>;
  }

  const { tabs, navigation, code, meta, section, next, prev, anchors } = parseContent(
    content,
    config?.docs,
  );

  const { top } = config?.docs || {};

  const navDisplay = {
    default: 'none',
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'block',
    xl: 'block',
  };

  const linksDisplay = {
    default: 'none',
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'block',
    xl: 'block',
  };

  const menuDisplay = {
    lg: 'none',
    xl: 'none',
  };

  const MobileMenuButton = () => (
    <DialogTrigger>
      <Button>
        <Icon>
          <Icons.Menu />
        </Icon>
        <Text>Menu</Text>
      </Button>
      <Modal position="bottom" offset="40px">
        <Dialog variant="sheet">
          {({ close }) => {
            return (
              <>
                <Row justifyContent="flex-end">
                  <Button onPress={() => close()} variant="quiet">
                    <Icon size="sm">
                      <Icons.Close />
                    </Icon>
                  </Button>
                </Row>
                <Box height="100%" overflow="auto">
                  <SideNav tabs={tabs} navigation={navigation} />
                </Box>
              </>
            );
          }}
        </Dialog>
      </Modal>
    </DialogTrigger>
  );

  return (
    <Box flexGrow="1">
      <Row display={menuDisplay} justifyContent="flex-end">
        <MobileMenuButton />
      </Row>
      {tabs && <TopNav tabs={tabs} />}
      <Grid
        gap="6"
        columns={{ xs: '1fr', sm: '1fr', md: '1fr', lg: '240px 1fr 240px', xl: '240px 1fr 240px' }}
      >
        <SideNav
          display={navDisplay}
          tabs={tabs}
          navigation={navigation}
          style={{ top }}
          isSticky
          autoHeight
        />
        <ContentArea
          section={section}
          title={meta?.title}
          description={meta?.description}
          code={code}
          next={next}
          prev={prev}
        />
        <PageLinks display={linksDisplay} items={anchors} style={{ top }} />
      </Grid>
    </Box>
  );
}
