import { englishLabels } from '@/lib/labels';
/**
 * Runtime helpers for OpenAPI reference pages. Operation data is produced at
 * build time by scripts/generate-openapi.mjs and reaches the client through
 * the aliased openapi.generated module.
 */

import type { BadgeColor } from '@/components/docs/Badge';
import { OPENAPI_OPERATIONS, OPENAPI_SCHEMAS } from '@/lib/openapi.generated';
import {
  getOperationSections,
  getSchemaSections,
  interpretReferencePage,
  lookupOperation,
  lookupSchema,
} from '../../scripts/lib/reference-page.mjs';

export {
  getOperationSections,
  getSchemaSections,
  hasParameters,
  normalizeOperationKey,
  resolvePlaygroundDisplay,
  securityFieldName,
  securityForLocation,
  securityLocation,
} from '../../scripts/lib/reference-page.mjs';

import type {
  DocFrontmatter,
  NormalizedOperation,
  ResolvedApiPlayground,
  SchemaPage,
  ThemeLabels,
  TocEntry,
} from '@/lib/types';

export const METHOD_COLORS: Record<string, BadgeColor> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'orange',
  PATCH: 'purple',
  DELETE: 'red',
  WEBHOOK: 'yellow',
};

const referenceProject = {
  operationsByKey: OPENAPI_OPERATIONS,
  schemasByKey: OPENAPI_SCHEMAS,
};

/** Short sidebar badge text for a method. */
export function methodBadgeText(method: string): string {
  if (method === 'DELETE') return 'DEL';
  if (method === 'WEBHOOK') return 'HOOK';
  return method;
}

export function methodColor(method?: string): BadgeColor {
  return (method && METHOD_COLORS[method.toUpperCase()]) || 'gray';
}

export function statusColor(status: string): BadgeColor {
  if (status.startsWith('2')) return 'green';
  if (status.startsWith('3')) return 'blue';
  if (status.startsWith('4') || status.startsWith('5')) return 'red';
  return 'gray';
}

/** Options that change which generated sections an operation page renders. */
export interface OperationSectionOptions {
  /** Whether the "Try it" panel renders ahead of the reference sections. */
  playground?: boolean;
}

/** Reference-page interpretation using the generated browser lookup adapter. */
export function getReferencePage(
  frontmatter?: DocFrontmatter,
  playground?: ResolvedApiPlayground,
  labels: ThemeLabels = englishLabels,
) {
  return interpretReferencePage(frontmatter, referenceProject, { playground, labels });
}

/** Looks up the operation bound by an `openapi:` frontmatter value. */
export function getOperation(key?: unknown): NormalizedOperation | undefined {
  return lookupOperation(referenceProject, key);
}

/** Looks up the schema bound by an `openapi-schema:` frontmatter value. */
export function getSchema(key?: unknown): SchemaPage | undefined {
  return lookupSchema(referenceProject, key);
}

/**
 * Table-of-contents entries adapted from the shared schema section plan.
 */
export function schemaSections(page: SchemaPage, labels: ThemeLabels = englishLabels): TocEntry[] {
  return getSchemaSections(page, labels).map(({ name, id }) => ({ name, id, size: 2 }));
}

/** Parameter groups shared by the renderer and table of contents. */
export function operationParameterSections(
  operation: NormalizedOperation,
  labels: ThemeLabels = englishLabels,
) {
  return getOperationSections(operation, { labels })
    .filter(section => section.kind === 'parameters')
    .map(({ location, name }) => ({ location, name }));
}

/**
 * Table-of-contents entries adapted from the shared operation section plan.
 */
export function operationSections(
  operation: NormalizedOperation,
  labels: ThemeLabels = englishLabels,
  options: OperationSectionOptions = {},
): TocEntry[] {
  return getOperationSections(operation, { ...options, labels }).map(({ name, id }) => ({
    name,
    id,
    size: 2,
  }));
}
