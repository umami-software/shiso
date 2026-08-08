import type { ReactNode } from 'react';
import { styles } from './styles';

export interface ExpandableProps {
  title: ReactNode;
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function Expandable({ title, children, defaultOpen = false }: ExpandableProps) {
  return (
    <details className={styles.details} open={defaultOpen}>
      <summary className={styles.summary}>{title}</summary>
      <div className={styles.detailsBody}>{children}</div>
    </details>
  );
}
