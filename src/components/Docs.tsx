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
} from '@umami/react-zen';
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

  const { top } = config?.docs || {};
  const navDisplay = {
    default: 'none',
    xs: 'none',
    sm: 'none',
    md: 'none',
    lg: 'block',
    xl: 'block',
  };
  const menuDisplay = {
    default: 'flex',
    lg: 'none',
    xl: 'none',
  };

  const MobileMenu = () => {
    const handlePress = () => {};
    return (
      <Row justifyContent="flex-end" display={menuDisplay}>
        <DialogTrigger>
          <Button onPress={handlePress} variant="quiet">
            <Icon>
              <Icons.Menu />
            </Icon>
          </Button>
          <Modal>
            <Dialog>
              {({ close }) => {
                return (
                  <Box minWidth="calc(100vw - 60px)" minHeight="calc(100vh - 60px)">
                    <Row justifyContent="flex-end">
                      <Button onPress={() => close()} variant="quiet">
                        <Icon>
                          <Icons.Close />
                        </Icon>
                      </Button>
                    </Row>
                    <SideNav tabs={tabs} navigation={navigation} />
                  </Box>
                );
              }}
            </Dialog>
          </Modal>
        </DialogTrigger>
      </Row>
    );
  };

  return (
    <Box flexGrow="1">
      <MobileMenu />
      {tabs && <TopNav tabs={tabs} />}
      <Grid
        gap="6"
        columns={{ xs: '1fr', sm: '1fr', md: '1fr', lg: '240px 1fr 240px', xl: '240px 1fr 240px' }}
      >
        <SideNav display={navDisplay} tabs={tabs} navigation={navigation} isSticky />
        <ContentArea
          section={section}
          title={meta?.title}
          description={meta?.description}
          code={code}
          next={next}
          prev={prev}
        />
        <PageLinks display={navDisplay} items={anchors} style={{ top }} />
      </Grid>
    </Box>
  );
}
