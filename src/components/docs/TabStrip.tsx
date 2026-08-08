import classNames from 'classnames';
import type { ReactNode } from 'react';
import { styles } from './styles';

export interface TabStripItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
}

export interface TabStripProps {
  items: TabStripItem[];
  selectedKey?: string;
  onSelect: (id: string) => void;
  ariaLabel?: string;
}

/** Internal tab UI shared by <Tabs> and <CodeGroup>. */
export function TabStrip({ items, selectedKey, onSelect, ariaLabel }: TabStripProps) {
  const selected = items.find(item => item.id === selectedKey) || items[0];

  return (
    <div className={styles.tabs}>
      <div className={styles.tabList} role="tablist" aria-label={ariaLabel}>
        {items.map(item => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === selected?.id}
            className={classNames(styles.tabButton, {
              [styles.tabSelected]: item.id === selected?.id,
            })}
            onClick={() => onSelect(item.id)}
          >
            {item.title}
          </button>
        ))}
      </div>
      <div className={styles.tabPanel} role="tabpanel">
        {selected?.content}
      </div>
    </div>
  );
}
