import type { ReactNode } from 'react';
import styles from './docs.module.css';

export interface FrameProps {
  caption?: ReactNode;
  children?: ReactNode;
}

export function Frame({ caption, children }: FrameProps) {
  return (
    <figure className={styles.frame}>
      <div>{children}</div>
      {caption ? <figcaption className={styles.frameCaption}>{caption}</figcaption> : null}
    </figure>
  );
}
