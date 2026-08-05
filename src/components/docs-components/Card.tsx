import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from '@/components/icons';
import styles from './docs-components.module.css';

export interface CardProps {
  title?: ReactNode;
  href?: string;
  icon?: ReactNode;
  arrow?: boolean;
  children?: ReactNode;
}

function CardContent({ title, icon, arrow, children }: Omit<CardProps, 'href'>) {
  return (
    <div className={styles.cardInner}>
      <div className={styles.cardMain}>
        <div className={styles.cardHeader}>
          {icon}
          {title ? <div className={styles.cardTitle}>{title}</div> : null}
        </div>
        {children ? <div className={styles.cardBody}>{children}</div> : null}
      </div>
      {arrow ? <ChevronRight size={14} className={styles.cardArrow} /> : null}
    </div>
  );
}

export function Card({ title, href, icon, arrow = !!href, children }: CardProps) {
  const content = (
    <CardContent title={title} icon={icon} arrow={arrow}>
      {children}
    </CardContent>
  );

  if (!href) {
    return <div className={styles.card}>{content}</div>;
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={styles.card} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={styles.card}>
      {content}
    </Link>
  );
}

export interface CardGroupProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

const COLS_CLASSES = {
  1: 'cardGroupCols1',
  2: 'cardGroupCols2',
  3: 'cardGroupCols3',
  4: 'cardGroupCols4',
} as const;

export function CardGroup({ children, cols = 2 }: CardGroupProps) {
  const columns = Math.min(Math.max(cols, 1), 4) as 1 | 2 | 3 | 4;

  return <div className={`${styles.cardGroup} ${styles[COLS_CLASSES[columns]]}`}>{children}</div>;
}
