import type { ReactNode } from 'react';
import styles from './docs-components.module.css';
import { decodeHtmlEntities } from './utils';

function Badge({ children, tone = 'muted' }: { children: ReactNode; tone?: 'muted' | 'primary' }) {
  return (
    <span className={`${styles.badge} ${tone === 'primary' ? styles.badgePrimary : ''}`}>
      {children}
    </span>
  );
}

export interface ParamFieldProps {
  name?: string;
  query?: string;
  path?: string;
  header?: string;
  body?: string;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}

export function ParamField({
  name,
  query,
  path,
  header,
  body,
  type,
  required,
  children,
}: ParamFieldProps) {
  const label = name || query || path || header || body || 'parameter';
  const location = query ? 'query' : path ? 'path' : header ? 'header' : body ? 'body' : undefined;

  return (
    <div className={styles.field}>
      <div className={styles.fieldHeader}>
        <code className={styles.code}>{label}</code>
        {location ? <Badge>{location}</Badge> : null}
        {type ? <span className={styles.fieldType}>{decodeHtmlEntities(type)}</span> : null}
        {required ? <Badge tone="primary">required</Badge> : null}
      </div>
      {children ? <div className={styles.fieldBody}>{children}</div> : null}
    </div>
  );
}

export function Param({ children }: { children?: ReactNode }) {
  return <code className={styles.code}>{children}</code>;
}
