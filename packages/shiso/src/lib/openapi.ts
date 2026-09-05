/**
 * Runtime helpers for OpenAPI reference pages. Operation data is produced at
 * build time by scripts/generate-openapi.mjs and reaches the client through
 * the aliased openapi.generated module.
 */

import type { BadgeColor } from '@/components/docs/Badge';
import { OPENAPI_OPERATIONS } from '@/lib/openapi.generated';
import { createSlugger } from '@/lib/slug';
import type { NormalizedOperation, TocEntry } from '@/lib/types';

export const METHOD_COLORS: Record<string, BadgeColor> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
};

export function methodColor(method?: string): BadgeColor {
  return (method && METHOD_COLORS[method.toUpperCase()]) || 'gray';
}

export function statusColor(status: string): BadgeColor {
  if (status.startsWith('2')) return 'green';
  if (status.startsWith('3')) return 'blue';
  if (status.startsWith('4') || status.startsWith('5')) return 'red';
  return 'gray';
}

/** Looks up the operation bound by an `openapi:` frontmatter value. */
export function getOperation(key?: unknown): NormalizedOperation | undefined {
  if (typeof key !== 'string' || !key.trim()) {
    return undefined;
  }

  const [method, ...rest] = key.trim().split(/\s+/);
  return OPENAPI_OPERATIONS[`${method.toUpperCase()} ${rest.join(' ')}`];
}

export function hasParameters(operation: NormalizedOperation): boolean {
  const { query, path, header, cookie } = operation.parameters;
  return (
    query.length + path.length + header.length + cookie.length > 0 || operation.security.length > 0
  );
}

/** Parameter groups shared by the renderer and table of contents. */
export function operationParameterSections(operation: NormalizedOperation) {
  const groups = [
    { location: 'header', name: 'Headers' },
    { location: 'path', name: 'Path parameters' },
    { location: 'query', name: 'Query parameters' },
    { location: 'cookie', name: 'Cookie parameters' },
  ] as const;

  return groups.filter(
    ({ location }) =>
      operation.parameters[location].length > 0 ||
      (location === 'header' && operation.security.length > 0),
  );
}

/**
 * Section headings for an operation, in render order. The single source of
 * truth for section ids: the component, the table of contents, the content
 * checker, and the search indexer all derive their anchors from these labels.
 */
export function operationSections(operation: NormalizedOperation): TocEntry[] {
  const slugger = createSlugger();
  const names = [
    ...operationParameterSections(operation).map(section => section.name),
    operation.requestBody ? 'Request body' : undefined,
    operation.responses.length ? 'Responses' : undefined,
    operation.samples.length ? 'Code samples' : undefined,
  ].filter((name): name is string => Boolean(name));

  return names.map(name => ({ name, id: slugger.slug(name), size: 2 }));
}
