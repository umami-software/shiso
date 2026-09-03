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
    <div className={styles.paramField} data-slot="field-group-item">
      <div className={styles.fieldHeader}>
        <span className={styles.fieldName}>{label}</span>
        {location ? <Badge size="sm">{location}</Badge> : null}
        {type ? (
          <span className={styles.fieldType} data-slot="field-group-type">
            {decodeHtmlEntities(type)}
          </span>
        ) : null}
        {required ? (
          <Badge size="sm" tone="primary">
            required
          </Badge>
        ) : null}
      </div>
      {children ? (
        <div className={styles.fieldBody} data-slot="field-group-body">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function Param({ children }: { children?: ReactNode }) {
  return <code className={styles.code}>{children}</code>;
}
