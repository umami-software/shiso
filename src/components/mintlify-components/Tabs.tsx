import {
  Box,
  Tab as ZenTab,
  TabList as ZenTabList,
  TabPanel as ZenTabPanel,
  Tabs as ZenTabs,
} from '@umami/react-zen';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { slugify, toElementArray } from './utils';

interface MintlifyTabChildProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Tab({ children }: MintlifyTabChildProps) {
  return <>{children}</>;
}

export interface TabsProps {
  children?: ReactNode;
  group?: string;
}

export function Tabs({ children, group }: TabsProps) {
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();

    return toElementArray<MintlifyTabChildProps>(children).map((child, index) => {
      const title = child.props.title || `Tab ${index + 1}`;
      const keyBase = slugify(title, `tab-${index + 1}`);
      const count = counts.get(keyBase) || 0;
      counts.set(keyBase, count + 1);

      return {
        id: count ? `${keyBase}-${count + 1}` : keyBase,
        title,
        content: child.props.children,
      };
    });
  }, [children]);

  const defaultTab = tabs[0]?.id;
  const [selectedKey, setSelectedKey] = useState<string | undefined>(defaultTab);

  useEffect(() => {
    if (!group || typeof window === 'undefined') {
      return;
    }

    const storedKey = window.localStorage.getItem(`shiso-tabs:${group}`);
    if (storedKey && tabs.some(tab => tab.id === storedKey)) {
      setSelectedKey(storedKey);
      return;
    }

    if (defaultTab) {
      setSelectedKey(defaultTab);
    }
  }, [defaultTab, group, tabs]);

  useEffect(() => {
    if (group && selectedKey && typeof window !== 'undefined') {
      window.localStorage.setItem(`shiso-tabs:${group}`, selectedKey);
    }
  }, [group, selectedKey]);

  useEffect(() => {
    if (!tabs.length) {
      setSelectedKey(undefined);
      return;
    }

    if (!selectedKey || !tabs.some(tab => tab.id === selectedKey)) {
      setSelectedKey(tabs[0].id);
    }
  }, [selectedKey, tabs]);

  if (!tabs.length) {
    return null;
  }

  if (tabs.length === 1) {
    return <Box marginY="4">{tabs[0].content}</Box>;
  }

  return (
    <Box marginY="4">
      <ZenTabs selectedKey={selectedKey} onSelectionChange={key => setSelectedKey(String(key))}>
        <ZenTabList aria-label="Content tabs" items={tabs}>
          {item => {
            return <ZenTab id={item.id}>{item.title}</ZenTab>;
          }}
        </ZenTabList>
        {tabs.map(tab => {
          return (
            <ZenTabPanel id={tab.id} key={tab.id}>
              <Box paddingTop="4">{tab.content}</Box>
            </ZenTabPanel>
          );
        })}
      </ZenTabs>
    </Box>
  );
}
