import type { ReactNode } from 'react';
import { Badge } from './Badge';
import { decodeHtmlEntities, toElementArray } from './utils';

type FieldValue = string | number | boolean | null | undefined;

export interface PropertiesTableRowProps {
  name: string;
  type?: FieldValue;
  default?: FieldValue;
  required?: boolean;
  deprecated?: boolean;
  children?: ReactNode;
}

export interface PropertiesTableProps {
  children?: ReactNode;
}

function displayValue(value: PropertiesTableRowProps['type']): string | undefined {
  if (typeof value === 'string') {
    return decodeHtmlEntities(value);
  }

  return value === undefined || value === null ? undefined : String(value);
}

export function PropertiesTable({ children }: PropertiesTableProps) {
  const rows = toElementArray<PropertiesTableRowProps>(children);

  if (!rows.length) {
    return null;
  }

  // Rendered as a plain table so the .docs-markdown table rules in global.css
  // style it exactly like a GFM table; only column widths are set here.
  return (
    <div className="my-4 overflow-x-auto">
      <table className="m-0 min-w-[40rem] table-fixed">
        <thead>
          <tr>
            <th className="w-[30%]">Name</th>
            <th className="w-[15%]">Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

function PropertiesTableRow({
  name,
  type,
  required,
  deprecated,
  default: value,
  children,
}: PropertiesTableRowProps) {
  const defaultValue = displayValue(value);

  return (
    <tr>
      <td>
        <span className="inline-flex flex-wrap items-center gap-2">
          {name}
          {required ? (
            <Badge size="sm" tone="primary">
              required
            </Badge>
          ) : null}
          {deprecated ? <Badge size="sm">deprecated</Badge> : null}
        </span>
      </td>
      <td>{displayValue(type)}</td>
      <td className="[&_p]:m-0">
        {children}
        {defaultValue ? (
          <span className="mt-1 block text-muted-foreground">Default: {defaultValue}</span>
        ) : null}
      </td>
    </tr>
  );
}

PropertiesTable.Row = PropertiesTableRow;
