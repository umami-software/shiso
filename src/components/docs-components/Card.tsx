import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from '@/components/icons';
import styles from './docs-components.module.css';
import { gridColsClass, resolveIcon } from './utils';

export interface CardProps {
  title?: ReactNode;
  href?: string;
  icon?: ReactNode | string;
  img?: string;
  cta?: string;
  horizontal?: boolean;
  arrow?: boolean;
  children?: ReactNode;
}

function CardContent({ title, icon, img, cta, arrow, children }: Omit<CardProps, 'href'>) {
  return (
    <>
      {img ? <img src={img} alt="" className={styles.cardImage} /> : null}
      <div className={styles.cardInner}>
        <div className={styles.cardMain}>
          <div className={styles.cardHeader}>
            {resolveIcon(icon, 16)}
            {title ? <div className={styles.cardTitle}>{title}</div> : null}
          </div>
          {children ? <div className={styles.cardBody}>{children}</div> : null}
        </div>
        {cta || arrow ? (
          <div className={styles.cardCta}>
            {cta ? <span>{cta}</span> : null}
            {arrow ? <ChevronRight size={14} className={styles.cardArrow} /> : null}
          </div>
        ) : null}
      </div>
    </>
  );
}

export function Card({
  title,
  href,
  icon,
  img,
  cta,
  horizontal,
  arrow = !!href,
  children,
}: CardProps) {
  const className = `${styles.card} ${horizontal ? styles.cardHorizontal : ''}`;
  const content = (
    <CardContent title={title} icon={icon} img={img} cta={cta} arrow={arrow}>
      {children}
    </CardContent>
  );

  if (!href) {
    return <div className={className}>{content}</div>;
  }

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {content}
    </Link>
  );
}

export interface CardGroupProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

export function CardGroup({ children, cols = 2 }: CardGroupProps) {
  return <div className={`${styles.grid} ${styles[gridColsClass(cols)]}`}>{children}</div>;
}
