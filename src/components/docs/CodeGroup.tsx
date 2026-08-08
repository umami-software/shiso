import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { TabsContent, TabsList, Tabs as TabsPrimitive, TabsTrigger } from '@/components/ui/tabs';
import { styles } from './styles';
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
  const selected = blocks.some(block => block.id === selectedKey) ? selectedKey : blocks[0]?.id;

  if (!blocks.length) {
    return null;
  }

  if (blocks.length === 1) {
    return <div className={styles.tabs}>{blocks[0].content}</div>;
  }

  return (
    <TabsPrimitive value={selected} onValueChange={setSelectedKey} className={styles.tabs}>
      <TabsList
        variant="line"
        className="w-full justify-start overflow-x-auto border-border border-b p-0"
        aria-label="Code snippets"
      >
        {blocks.map(block => (
          <TabsTrigger
            key={block.id}
            value={block.id}
            className="after:bg-primary data-active:text-primary"
          >
            {block.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {blocks.map(block => (
        <TabsContent key={block.id} value={block.id} className="pt-4">
          {block.content}
        </TabsContent>
      ))}
    </TabsPrimitive>
  );
}
