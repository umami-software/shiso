import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { TabsContent, TabsList, Tabs as TabsPrimitive, TabsTrigger } from '@/components/ui/tabs';
import { slugify, toElementArray } from './utils';

interface TabChildProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function Tab({ children }: TabChildProps) {
  return <>{children}</>;
}

export interface TabsProps {
  children?: ReactNode;
  group?: string;
}

export function Tabs({ children, group }: TabsProps) {
  const tabs = useMemo(() => {
    const counts = new Map<string, number>();

    return toElementArray<TabChildProps>(children).map((child, index) => {
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
    if (!tabs.length) {
      setSelectedKey(undefined);
      return;
    }

    if (!selectedKey || !tabs.some(tab => tab.id === selectedKey)) {
      setSelectedKey(tabs[0].id);
    }
  }, [selectedKey, tabs]);

  const handleSelect = (id: string) => {
    setSelectedKey(id);

    if (group && typeof window !== 'undefined') {
      window.localStorage.setItem(`shiso-tabs:${group}`, id);
    }
  };

  if (!tabs.length) {
    return null;
  }

  if (tabs.length === 1) {
    return <div className="my-4">{tabs[0].content}</div>;
  }

  return (
    <TabsPrimitive
      value={selectedKey}
      onValueChange={value => {
        if (typeof value === 'string') {
          handleSelect(value);
        }
      }}
    >
      <TabsList aria-label="Content tabs">
        {tabs.map(tab => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map(tab => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </TabsPrimitive>
  );
}
