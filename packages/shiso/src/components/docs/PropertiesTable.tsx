import type { ReactNode } from 'react';
import { useLabels } from '@/lib/label-context';
import { Badge } from './Badge';
import { decodeHtmlEntities, toElementArray } from './utils';

type FieldValue = string | number | boolean | null | undefined;

export interface PropertiesTableRowProps {
  name: string;
  type?: FieldValue;
  default?: FieldValue;
  required?: boolean;
  deprecated?: boolean;
  details?: ReactNode;
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
  const labels = useLabels();
  const rows = toElementArray<PropertiesTableRowProps>(children);

  if (!rows.length) {
    return null;
  }

  // Rendered as a plain table so the .docs-markdown table rules in global.css
  // style it exactly like a GFM table; only column widths are set here.
  return (
    <div data-slot="properties-table" className="my-4 overflow-x-auto">
      <table className="m-0 table-fixed [overflow-wrap:anywhere]">
        <thead>
          <tr>
            <th className="w-[30%]">{labels.fieldName}</th>
            <th className="w-[15%]">{labels.fieldType}</th>
            <th>{labels.fieldDescription}</th>
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
  details,
}: PropertiesTableRowProps) {
  const labels = useLabels();
  const defaultValue = displayValue(value);

  return (
    <>
      <tr>
        <td>
          <span className="inline-flex flex-wrap items-center gap-2">
            {name}
            {required ? (
              <Badge size="sm" tone="primary">
                {labels.fieldRequired}
              </Badge>
            ) : null}
            {deprecated ? <Badge size="sm">{labels.fieldDeprecated}</Badge> : null}
          </span>
        </td>
        <td>{displayValue(type)}</td>
        <td className="[&_p]:m-0">
          {children}
          {defaultValue ? (
            <span className="mt-1 block text-muted-foreground">
              {labels.fieldDefault} {defaultValue}
            </span>
          ) : null}
        </td>
      </tr>
      {details && (
        <tr>
          <td
            colSpan={3}
            className="[&>[data-slot=collapsible]]:my-0 [&_[data-slot=collapsible-trigger]]:py-1 [&_[data-slot=properties-table]]:my-2"
          >
            {details}
          </td>
        </tr>
      )}
    </>
  );
}

PropertiesTable.Row = PropertiesTableRow;
