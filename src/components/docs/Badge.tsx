import type { ReactNode } from 'react';
import { styles } from './styles';

export interface BadgeProps {
  tone?: 'muted' | 'primary';
  children?: ReactNode;
}

export function Badge({ tone = 'muted', children }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${tone === 'primary' ? styles.badgePrimary : ''}`}>
      {children}
    </span>
  );
}
