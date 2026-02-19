import {
  Box,
  Tab as ZenTab,
  TabList as ZenTabList,
  TabPanel as ZenTabPanel,
  Tabs as ZenTabs,
} from '@umami/react-zen';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { findCodeLanguage, slugify, toElementArray } from './utils';

export interface CodeGroupProps {
  children?: ReactNode;
}

export function CodeGroup({ children }: CodeGroupProps) {
  const blocks = useMemo(() => {
    const counts = new Map<string, number>();

    return toElementArray<{ title?: string }>(children).map((child, index) => {
      const explicitTitle = child.props?.title;
      const titleValue =
        (typeof explicitTitle === 'string' && explicitTitle.trim()) ||
        findCodeLanguage(child) ||
        `snippet ${index + 1}`;
      const keyBase = slugify(titleValue, `snippet-${index + 1}`);
      const count = counts.get(keyBase) || 0;
      counts.set(keyBase, count + 1);

      return {
        id: count ? `${keyBase}-${count + 1}` : keyBase,
        title: count ? `${titleValue} ${count + 1}` : titleValue,
        content: child,
      };
    });
  }, [children]);

  const [selectedKey, setSelectedKey] = useState<string | undefined>(blocks[0]?.id);

  useEffect(() => {
    if (!blocks.length) {
      setSelectedKey(undefined);
      return;
    }

    if (!selectedKey || !blocks.some(block => block.id === selectedKey)) {
      setSelectedKey(blocks[0].id);
    }
  }, [blocks, selectedKey]);

  if (!blocks.length) {
    return null;
  }

  if (blocks.length === 1) {
    return <Box marginY="4">{blocks[0].content}</Box>;
  }

  return (
    <Box marginY="4">
      <ZenTabs selectedKey={selectedKey} onSelectionChange={key => setSelectedKey(String(key))}>
        <ZenTabList aria-label="Code snippets" items={blocks}>
          {item => {
            return <ZenTab id={item.id}>{item.title}</ZenTab>;
          }}
        </ZenTabList>
        {blocks.map(block => {
          return (
            <ZenTabPanel id={block.id} key={block.id}>
              <Box paddingTop="4">{block.content}</Box>
            </ZenTabPanel>
          );
        })}
      </ZenTabs>
    </Box>
  );
}
