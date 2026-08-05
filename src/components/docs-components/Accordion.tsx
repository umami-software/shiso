import { cloneElement, type ReactNode } from 'react';
import styles from './docs-components.module.css';
import { toElementArray } from './utils';

export interface AccordionProps {
  title?: ReactNode;
  defaultOpen?: boolean;
  children?: ReactNode;
}

export function Accordion({ title, defaultOpen, children }: AccordionProps) {
  return (
    <details className={styles.details} open={defaultOpen}>
      <summary className={styles.summary}>{title}</summary>
      <div className={styles.detailsBody}>{children}</div>
    </details>
  );
}

export interface AccordionGroupProps {
  children?: ReactNode;
  defaultOpen?: boolean;
}

export function AccordionGroup({ children, defaultOpen = false }: AccordionGroupProps) {
  const items = toElementArray<AccordionProps>(children);

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.accordionGroup}>
      {items.map((child, index) =>
        cloneElement(child, {
          key: child.key ?? `accordion-${index + 1}`,
          defaultOpen: child.props.defaultOpen ?? (defaultOpen && index === 0),
        }),
      )}
    </div>
  );
}
