import type { ReactNode } from 'react';
import { Badge } from './Badge';
import { styles } from './styles';
import { decodeHtmlEntities } from './utils';

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
        <span className={styles.fieldName}>{label}</span>
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
