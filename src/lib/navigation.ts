import { Tab, Group, Page, Navigation, Content } from '@/lib/types';

export function getNavigationMenu(
  pathname: string,
  navigation: Navigation,
): Group[] | Page[] | undefined {
  const { tabs, groups, pages } = navigation;

  if (tabs) {
    const tab = getActiveTab(pathname, tabs);

    return tab?.groups || tab?.pages;
  }

  return groups || pages;
}

export function getActiveTab(pathname: string, tabs: Tab[]) {
  return tabs.find(tab => {
    return tab.groups
      ? tab.groups?.find(({ pages }) => pages.find(page => pathname === `/${page}`))
      : tab.pages?.find(page => {
            return pathname === `/${page}`;
          })
        ? tab.pages
        : null;
  });
}

export function getNavigationDetails(pathname: string, navigation: Navigation) {
  const { tabs, groups, pages } = navigation;
  let prevGroup, nextGroup, prevPage, nextPage, groupName;

  const parseGroups = (groups: Group[] = []) => {
    let found = false;
    groups.forEach((group, groupIndex) => {
      if (!found) {
        group.pages.forEach((page, pageIndex) => {
          if (page === pathname.slice(1)) {
            prevGroup = groups[groupIndex - 1];
            nextGroup = groups[groupIndex + 1];

            prevPage = group.pages[pageIndex - 1] || prevGroup?.pages?.at(-1);
            nextPage = group.pages[pageIndex + 1] || nextGroup?.pages?.[0];
            groupName = group.group;

            found = true;
          }
        });
      }
    });
  };

  const parsePages = (pages: Page[] = []) => {
    let found = false;

    pages.forEach((page, pageIndex) => {
      if (!found) {
        if (page === pathname.slice(1)) {
          const prevPage = pages[pageIndex - 1];
          const nextPage = pages[pageIndex + 1];

          found = true;
        }
      }
    });
  };

  if (tabs) {
    const tab = getActiveTab(pathname, tabs);

    if (tab?.groups) {
      parseGroups(tab?.groups);
    }

    parsePages(tab?.pages);
  }

  if (groups) {
    parseGroups(groups);
  }

  if (pages) {
    parsePages(pages);
  }

  return { prevGroup, nextGroup, prevPage, nextPage, groupName };
}
