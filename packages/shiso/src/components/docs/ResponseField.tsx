import type { ReactNode } from 'react';
import { Badge } from './Badge';
import { styles } from './styles';
import { decodeHtmlEntities } from './utils';

type FieldValue = string | number | boolean | null | undefined;

export interface ResponseFieldProps {
  name: string;
  type?: FieldValue;
  default?: FieldValue;
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
    <div className={styles.field} data-slot="field-group-item">
      <div className={styles.fieldHeader}>
        <span className={styles.fieldName}>{name}</span>
        {normalizedType ? (
          <span className={styles.fieldType} data-slot="field-group-type">
            {normalizedType}
          </span>
        ) : null}
        {required ? (
          <Badge size="sm" tone="primary">
            required
          </Badge>
        ) : null}
        {deprecated ? <Badge size="sm">deprecated</Badge> : null}
      </div>
      {children ? (
        <div className={styles.fieldBody} data-slot="field-group-body">
          {children}
        </div>
      ) : null}
    </div>
  );
}
