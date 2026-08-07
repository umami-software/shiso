import type { ReactNode } from 'react';
import styles from './docs.module.css';
import { gridColsClass } from './utils';

export interface ColumnsProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function Columns({ children, cols = 2 }: ColumnsProps) {
  return <div className={`${styles.grid} ${styles[gridColsClass(cols)]}`}>{children}</div>;
}

export interface ColumnProps {
  children?: ReactNode;
}

export function Column({ children }: ColumnProps) {
  return <div className={styles.column}>{children}</div>;
}
