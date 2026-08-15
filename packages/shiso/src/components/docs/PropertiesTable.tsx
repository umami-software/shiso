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

  return (
    <div className="my-4 overflow-x-auto rounded-lg border border-border px-6 py-2">
      <table className="m-0 min-w-[40rem] table-fixed border-collapse">
        <thead>
          <tr>
            <th className="w-1/3 border-x-0 border-t-0 border-b border-border bg-transparent px-0 py-2 pr-6 text-left text-sm font-semibold text-foreground">
              Name
            </th>
            <th className="w-1/3 border-x-0 border-t-0 border-b border-border bg-transparent px-0 py-2 pr-6 text-left text-sm font-semibold text-foreground">
              Type
            </th>
            <th className="w-1/3 border-x-0 border-t-0 border-b border-border bg-transparent px-0 py-2 text-left text-sm font-semibold text-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const { name, type, required, deprecated, children: description } = row.props;
            const defaultValue = displayValue(row.props.default);
            const borderClass = index === rows.length - 1 ? 'border-b-0' : 'border-b';

            return (
              <tr key={row.key ?? name}>
                <td
                  className={`${borderClass} border-x-0 border-t-0 border-border px-0 py-2 pr-6 align-top text-sm text-foreground`}
                >
                  <span className="inline-flex flex-wrap items-center gap-2">
                    {name}
                    {required ? (
                      <Badge size="xs" tone="primary">
                        required
                      </Badge>
                    ) : null}
                    {deprecated ? <Badge size="xs">deprecated</Badge> : null}
                  </span>
                </td>
                <td
                  className={`${borderClass} border-x-0 border-t-0 border-border px-0 py-2 pr-6 align-top text-sm text-foreground`}
                >
                  {displayValue(type)}
                </td>
                <td
                  className={`${borderClass} border-x-0 border-t-0 border-border px-0 py-2 align-top text-sm leading-6 text-foreground [&_p]:m-0`}
                >
                  {description}
                  {defaultValue ? (
                    <span className="mt-1 block text-sm text-muted-foreground">
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
