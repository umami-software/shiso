import { Tab, Group, Page, Navigation } from '@/lib/types';

export function getNavigationMenu(
  pathname: string,
  navigation: Navigation,
): Group[] | Page[] | undefined {
  const { tabs, groups, pages } = navigation;

  if (tabs) {
    const tab = getActiveTab(pathname, tabs);

    console.log('activeTab', { tab });

    return tab?.groups || tab?.pages;
  }

  return groups || pages;
}

export function getActiveTab(pathname: string, tabs: Tab[]) {
  return tabs.find(tab => {
    const found = tab.groups
      ? tab.groups?.find(({ pages }) => pages.find(page => pathname === `/${page}`))
      : tab.pages?.find(page => {
            console.log(pathname, '===', `/${page}`);
            return pathname === `/${page}`;
          })
        ? tab.pages
        : null;

    console.log({ tab, found, pathname });

    return found;
  });
}
