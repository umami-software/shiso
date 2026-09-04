import type { ReactNode } from 'react';
import { Badge } from './Badge';
import type { ResponseFieldProps } from './ResponseField';
import { decodeHtmlEntities, toElementArray } from './utils';

export interface PropertiesTableProps {
  children?: ReactNode;
}

function displayValue(value: ResponseFieldProps['type']): string | undefined {
  if (typeof value === 'string') {
    return decodeHtmlEntities(value);
  }

  return value === undefined || value === null ? undefined : String(value);
}

export function PropertiesTable({ children }: PropertiesTableProps) {
  const rows = toElementArray<ResponseFieldProps>(children);

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
            <th className="w-1/5">Name</th>
            <th className="w-1/4">Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const { name, type, required, deprecated, children: description } = row.props;
            const defaultValue = displayValue(row.props.default);

            return (
              <tr key={row.key ?? name}>
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
                  {description}
                  {defaultValue ? (
                    <span className="mt-1 block text-muted-foreground">
                      Default: {defaultValue}
                    </span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
