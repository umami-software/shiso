import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { styles } from './styles';
import { gridColsClass } from './utils';

export interface TileProps {
  /** URL to navigate to when the tile is clicked. */
  href: string;
  title?: ReactNode;
  description?: ReactNode;
  /** Preview content, typically light/dark image variants. */
  children: ReactNode;
  target?: '_self' | '_blank';
}

export function Tile({ href, title, description, children, target }: TileProps) {
  const external = /^https?:\/\//i.test(href);
  const resolvedTarget = target ?? (external ? '_blank' : undefined);

  const content = (
    <>
      <div className={styles.tilePreview} data-slot="tile-preview">
        {children}
      </div>
      {title || description ? (
        <div className={styles.tileBody} data-slot="tile-body">
          {title ? <div className={styles.tileTitle}>{title}</div> : null}
          {description ? <div className={styles.tileDescription}>{description}</div> : null}
        </div>
      ) : null}
    </>
  );

  const className = `${styles.tile} no-underline hover:no-underline active:no-underline`;

  if (external) {
    return (
      <a href={href} className={className} target={resolvedTarget} rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link to={href} className={className} target={resolvedTarget}>
      {content}
    </Link>
  );
}

export interface TilesProps {
  children?: ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

/** Grid wrapper for <Tile> when <Columns> is not used directly. */
export function Tiles({ children, cols = 2 }: TilesProps) {
  return <div className={`${styles.grid} ${styles[gridColsClass(cols)]}`}>{children}</div>;
}
