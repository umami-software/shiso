import { englishLabels } from '@/lib/labels';
/**
 * Runtime helpers for OpenAPI reference pages. Operation data is produced at
 * build time by scripts/generate-openapi.mjs and reaches the client through
 * the aliased openapi.generated module.
 */

import type { BadgeColor } from '@/components/docs/Badge';
import { OPENAPI_OPERATIONS, OPENAPI_SCHEMAS } from '@/lib/openapi.generated';
import { createSlugger } from '@/lib/slug';
import type {
  ApiPlaygroundDisplay,
  DocFrontmatter,
  NormalizedOperation,
  ResolvedApiPlayground,
  SchemaPage,
  SecurityScheme,
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

const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']);

/** Short sidebar badge text for a method. */
export function methodBadgeText(method: string): string {
  if (method === 'DELETE') return 'DEL';
  if (method === 'WEBHOOK') return 'HOOK';
  return method;
}

/**
 * Normalizes an `openapi:` frontmatter value into a lookup key. Mirrors
 * normalizeOperationKey in scripts/lib/openapi.mjs: the method (or "webhook")
 * is uppercased and an optional leading spec qualifier is kept verbatim.
 */
export function normalizeOperationKey(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const [first, ...rest] = value.trim().split(/\s+/);
  if (!rest.length) return undefined;
  const upper = first.toUpperCase();
  if (upper === 'WEBHOOK' || HTTP_METHODS.has(upper)) return `${upper} ${rest.join(' ')}`;
  const inner = normalizeOperationKey(rest.join(' '));
  return inner ? `${first} ${inner}` : undefined;
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

/**
 * Resolves the effective playground display for a page: the frontmatter
 * `playground` value wins over `api.playground.display`.
 */
export function resolvePlaygroundDisplay(
  playground: ResolvedApiPlayground,
  frontmatter?: DocFrontmatter,
): ApiPlaygroundDisplay {
  const override = frontmatter?.playground;
  if (override === 'interactive' || override === 'simple' || override === 'none') {
    return override;
  }
  return playground.display;
}

/** Looks up the operation bound by an `openapi:` frontmatter value. */
export function getOperation(key?: unknown): NormalizedOperation | undefined {
  const normalized = normalizeOperationKey(key);
  return normalized ? OPENAPI_OPERATIONS[normalized] : undefined;
}

/** Looks up the schema bound by an `openapi-schema:` frontmatter value. */
export function getSchema(key?: unknown): SchemaPage | undefined {
  if (typeof key !== 'string' || !key.trim()) return undefined;
  return OPENAPI_SCHEMAS[key.trim().split(/\s+/).join(' ')];
}

/**
 * Section headings for a schema page, in render order. Mirrors schemaAnchors
 * in scripts/lib/openapi.mjs.
 */
export function schemaSections(page: SchemaPage, labels: ThemeLabels = englishLabels): TocEntry[] {
  return [
    ...(page.schema.children?.length
      ? [{ name: labels.apiSchemaProperties, id: 'properties', size: 2 }]
      : []),
    ...(page.example ? [{ name: labels.apiExample, id: 'example', size: 2 }] : []),
  ];
}

/** Where a security scheme's credential travels: a header unless it is a query or cookie API key. */
export function securityLocation(scheme: SecurityScheme): 'header' | 'query' | 'cookie' {
  return scheme.type === 'apiKey' && scheme.in ? scheme.in : 'header';
}

/** Security schemes that are sent in the given parameter location. */
export function securityForLocation(
  operation: NormalizedOperation,
  location: 'header' | 'path' | 'query' | 'cookie',
): SecurityScheme[] {
  return operation.security.filter(scheme => securityLocation(scheme) === location);
}

/** Display name of the header, query, or cookie entry a scheme adds. */
export function securityFieldName(scheme: SecurityScheme): string {
  return scheme.type === 'apiKey' ? scheme.paramName || scheme.name : 'Authorization';
}

export function hasParameters(operation: NormalizedOperation): boolean {
  const { query, path, header, cookie } = operation.parameters;
  return (
    query.length + path.length + header.length + cookie.length > 0 || operation.security.length > 0
  );
}

/** Parameter groups shared by the renderer and table of contents. */
export function operationParameterSections(
  operation: NormalizedOperation,
  labels: ThemeLabels = englishLabels,
) {
  const groups = [
    { location: 'header', name: labels.apiHeaders },
    { location: 'path', name: labels.apiPathParameters },
    { location: 'query', name: labels.apiQueryParameters },
    { location: 'cookie', name: labels.apiCookieParameters },
  ] as const;

  return groups.filter(
    ({ location }) =>
      operation.parameters[location].length > 0 ||
      securityForLocation(operation, location).length > 0,
  );
}

/**
 * Section headings for an operation, in render order. The single source of
 * truth for section ids: the component, the table of contents, the content
 * checker, and the search indexer all derive their anchors from these labels.
 */
export function operationSections(
  operation: NormalizedOperation,
  labels: ThemeLabels = englishLabels,
  options: OperationSectionOptions = {},
): TocEntry[] {
  const slugger = createSlugger();
  const playground = options.playground && !operation.webhook;
  const names = [
    playground ? 'Try it' : undefined,
    ...operationParameterSections(operation).map(section => section.name),
    operation.requestBody ? (operation.webhook ? 'Payload' : 'Request body') : undefined,
    operation.responses.length ? 'Responses' : undefined,
    operation.samples.length ? 'Code samples' : undefined,
  ].filter((name): name is string => Boolean(name));

  const translated = [
    ...(playground ? [labels.apiPlayground] : []),
    ...operationParameterSections(operation, labels).map(section => section.name),
    ...(operation.requestBody
      ? [operation.webhook ? labels.apiPayload : labels.apiRequestBody]
      : []),
    ...(operation.responses.length ? [labels.apiResponses] : []),
    ...(operation.samples.length ? [labels.apiCodeSamples] : []),
  ];
  return names.map((name, index) => ({ name: translated[index], id: slugger.slug(name), size: 2 }));
}
