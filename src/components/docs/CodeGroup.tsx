import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import styles from './docs.module.css';
import { TabStrip } from './TabStrip';
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
    <TabStrip
      items={blocks}
      selectedKey={selected}
      onSelect={setSelectedKey}
      ariaLabel="Code snippets"
    />
  );
}
