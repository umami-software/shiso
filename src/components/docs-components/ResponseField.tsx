import type { ReactNode } from 'react';
import styles from './docs-components.module.css';
import { decodeHtmlEntities } from './utils';

type FieldValue = string | number | boolean | null | undefined;

function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'primary' }) {
  return (
    <span className={`${styles.badge} ${tone === 'primary' ? styles.badgePrimary : ''}`}>
      {children}
    </span>
  );
}

export interface ResponseFieldProps {
  name: string;
  type?: FieldValue;
  required?: boolean;
  deprecated?: boolean;
  children?: ReactNode;
}

export function ResponseField({ name, type, required, deprecated, children }: ResponseFieldProps) {
  const normalizedType =
    typeof type === 'string'
      ? decodeHtmlEntities(type)
      : type === undefined || type === null
        ? undefined
        : String(type);

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <code className={styles.code}>{name}</code>
        {normalizedType ? <span className={styles.fieldType}>{normalizedType}</span> : null}
        {required ? <Badge tone="primary">required</Badge> : null}
        {deprecated ? <Badge>deprecated</Badge> : null}
      </div>
      {children ? <div className={styles.fieldBody}>{children}</div> : null}
    </div>
  );
}
