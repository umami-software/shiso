import type { ReactNode } from 'react';
import { ChevronRight } from '@/components/icons';
import styles from './docs-components.module.css';

export interface RequestExampleProps {
  title?: ReactNode;
  children?: ReactNode;
}

export function RequestExample({ title = 'Request example', children }: RequestExampleProps) {
  return (
    <div className={styles.requestExample}>
      <div className={styles.requestExampleHeader}>
        <ChevronRight size={14} />
        {title}
      </div>
      <div className={styles.requestExampleBody}>{children}</div>
    </div>
  );
}
