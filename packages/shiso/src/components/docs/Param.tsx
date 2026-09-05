import type { ReactNode } from 'react';
import { styles } from './styles';

export function Param({ children }: { children?: ReactNode }) {
  return <code className={styles.code}>{children}</code>;
}
