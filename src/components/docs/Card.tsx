import type { ReactNode } from 'react';
import { Link } from 'react-router';
import {
  Check as CheckIcon,
  ChevronRight,
  CircleAlert,
  InfoIcon,
  Lightbulb,
  TriangleAlert,
} from '@/components/icons';
import { CardContent, Card as CardPrimitive } from '@/components/ui/card';
import { styles } from './styles';
import { gridColsClass, resolveIcon } from './utils';

export interface CardProps {
  title?: ReactNode;
  href?: string;
  icon?: ReactNode | string;
  color?: string;
  img?: string;
  cta?: string;
  horizontal?: boolean;
  arrow?: boolean;
  type?: CardType;
  children?: ReactNode;
}

export type CardType = 'note' | 'info' | 'warning' | 'tip' | 'check' | 'danger';

const CARD_TYPE_ICONS: Record<CardType, ReactNode> = {
  note: <InfoIcon size={16} />,
  info: <InfoIcon size={16} />,
  warning: <TriangleAlert size={16} />,
  tip: <Lightbulb size={16} />,
  check: <CheckIcon size={16} />,
  danger: <CircleAlert size={16} />,
};

const CARD_TYPE_HOVER: Record<CardType, string> = {
  note: 'hover:border-border',
  info: 'hover:border-blue-300 dark:hover:border-blue-400/40',
  warning: 'hover:border-amber-300 dark:hover:border-amber-400/40',
  tip: 'hover:border-green-300 dark:hover:border-green-400/40',
  check: 'hover:border-emerald-300 dark:hover:border-emerald-400/40',
  danger: 'hover:border-destructive/40',
};

function DocsCardContent({
  title,
  icon,
  color,
  img,
  cta,
  arrow,
  type,
  children,
}: Omit<CardProps, 'href'>) {
  const resolvedIcon = resolveIcon(icon, 16) || (type ? CARD_TYPE_ICONS[type] : null);

  return (
    <CardContent className="p-0">
      {img ? <img src={img} alt="" className={styles.cardImage} /> : null}
      <div className={styles.cardInner} data-slot="card-inner">
        <div className={styles.cardMain} data-slot="card-main">
          <div className={styles.cardHeader}>
            {resolvedIcon ? (
              <span className={styles.cardIcon} style={color ? { color } : undefined}>
                {resolvedIcon}
              </span>
            ) : null}
            {title ? (
              <div className={styles.cardTitle} data-slot="card-title">
                {title}
              </div>
            ) : null}
          </div>
          {children ? (
            <div className={styles.cardBody} data-slot="card-body">
              {children}
            </div>
          ) : null}
        </div>
        {cta || arrow ? (
          <div className={styles.cardCta} data-slot="card-cta">
            {cta ? <span>{cta}</span> : null}
            {arrow ? (
              <ChevronRight size={14} className={styles.cardArrow} data-slot="card-arrow" />
            ) : null}
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
  color,
  img,
  cta,
  horizontal,
  arrow,
  type,
  children,
}: CardProps) {
  const external = typeof href === 'string' && /^https?:\/\//i.test(href);
  const showArrow = arrow ?? external;
  const className = `${styles.card} ${type ? `${styles.cardTyped} ${styles[type]} ${CARD_TYPE_HOVER[type]}` : ''} ${horizontal ? styles.cardHorizontal : ''}`;
  const content = (
    <CardPrimitive className={className}>
      <DocsCardContent
        title={title}
        icon={icon}
        color={color}
        img={img}
        cta={cta}
        arrow={showArrow}
        type={type}
      >
        {children}
      </DocsCardContent>
    </CardPrimitive>
  );

  if (!href) {
    return content;
  }

  const linkClassName = 'block h-full no-underline hover:no-underline active:no-underline';

  if (external) {
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
