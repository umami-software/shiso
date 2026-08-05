import type { ReactNode } from 'react';
import styles from './docs-components.module.css';

export interface TooltipProps {
  tip?: string;
  children?: ReactNode;
}

export function Tooltip({ tip, children }: TooltipProps) {
  return (
    <span className={styles.tooltip} title={tip}>
      {children}
    </span>
  );
}
