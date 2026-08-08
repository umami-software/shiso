import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { TabsContent, TabsList, Tabs as TabsPrimitive, TabsTrigger } from '@/components/ui/tabs';
import { styles } from './styles';
import { findCodeLanguage, findCodeTitle, slugify, toElementArray } from './utils';

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
        findCodeTitle(child) ||
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
    <TabsPrimitive
      value={selected}
      onValueChange={setSelectedKey}
      className="my-4 gap-0 overflow-hidden rounded-lg bg-muted/50 [&_[data-slot=code-block]]:my-0 [&_[data-slot=code-block]]:rounded-none [&_[data-slot=code-block]]:border-0 [&_[data-slot=code-block]]:bg-transparent"
    >
      <TabsList
        variant="line"
        className="h-9 w-full justify-start gap-5 overflow-x-auto overflow-y-hidden rounded-none border-border border-b px-3 py-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Code snippets"
      >
        {blocks.map(block => (
          <TabsTrigger
            key={block.id}
            value={block.id}
            className="flex-none px-0 text-muted-foreground after:bg-primary data-active:text-foreground"
          >
            {block.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {blocks.map(block => (
        <TabsContent key={block.id} value={block.id}>
          {block.content}
        </TabsContent>
      ))}
    </TabsPrimitive>
  );
}
