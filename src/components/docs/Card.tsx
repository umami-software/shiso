import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ChevronRight } from '@/components/icons';
import { CardContent, Card as CardPrimitive } from '@/components/ui/card';
import { styles } from './styles';
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

function DocsCardContent({ title, icon, img, cta, arrow, children }: Omit<CardProps, 'href'>) {
  return (
    <CardContent className="p-0">
      {img ? <img src={img} alt="" className={styles.cardImage} /> : null}
      <div className={styles.cardInner}>
        <div className={styles.cardMain} data-slot="card-main">
          <div className={styles.cardHeader}>
            {resolveIcon(icon, 16)}
            {title ? <div className={styles.cardTitle}>{title}</div> : null}
          </div>
          {children ? (
            <div className={styles.cardBody} data-slot="card-body">
              {children}
            </div>
          ) : null}
        </div>
        {cta || arrow ? (
          <div className={styles.cardCta}>
            {cta ? <span>{cta}</span> : null}
            {arrow ? <ChevronRight size={14} className={styles.cardArrow} /> : null}
          </div>
        ) : null}
      </div>
    </CardContent>
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
    <CardPrimitive className={className}>
      <DocsCardContent title={title} icon={icon} img={img} cta={cta} arrow={arrow}>
        {children}
      </DocsCardContent>
    </CardPrimitive>
  );

  if (!href) {
    return content;
  }

  const linkClassName = 'block h-full no-underline hover:no-underline active:no-underline';

  if (/^https?:\/\//.test(href)) {
    return (
      <a href={href} className={linkClassName} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={linkClassName}>
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
