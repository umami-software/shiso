/**
 * OpenAPI 3.x spec loading and normalization.
 *
 * Parses a local JSON or YAML spec, resolves in-document $refs with a cycle
 * guard, and normalizes each operation into the serializable shape consumed by
 * the OpenApiOperation component, the search indexer, and the markdown export.
 * Only this module understands raw OpenAPI documents; everything downstream
 * works with NormalizedOperation objects.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import { buildCodeSamples } from './request-samples.mjs';
import { slugify } from './slug.mjs';

export { buildCodeSamples, buildRequest } from './request-samples.mjs';

const METHODS = ['get', 'post', 'put', 'patch', 'delete', 'head', 'options', 'trace'];
const MAX_DEPTH = 8;
const MAX_CHILDREN = 100;
const FALLBACK_SERVER = 'https://api.example.com';

export const DEFAULT_API_DIRECTORY = 'api-reference';

export async function loadOpenApiSpec({ root, specPath }) {
  const projectRoot = path.resolve(root);
  const resolvedPath = path.resolve(projectRoot, specPath);

  if (!resolvedPath.startsWith(projectRoot + path.sep)) {
    throw new Error(`OpenAPI spec "${specPath}" must live inside the project root.`);
  }

  let source;
  try {
    source = await fs.readFile(resolvedPath, 'utf8');
  } catch {
    throw new Error(
      `OpenAPI spec "${specPath}" was not found. The api.spec path resolves against the project root.`,
    );
  }

  let spec;
  try {
    // YAML is a superset of JSON, so one parser covers both formats.
    spec = parseYaml(source);
  } catch (error) {
    throw new Error(`Could not parse OpenAPI spec "${specPath}": ${error.message}`);
  }

  if (!spec || typeof spec !== 'object' || typeof spec.openapi !== 'string') {
    throw new Error(
      `"${specPath}" is not an OpenAPI document: missing the "openapi" version field.`,
    );
  }
  if (!spec.openapi.startsWith('3.')) {
    throw new Error(
      `Unsupported OpenAPI version "${spec.openapi}" in "${specPath}": Shiso supports OpenAPI 3.0 and 3.1.`,
    );
  }

  return { spec, specPath: resolvedPath };
}

function resolveRef(spec, ref) {
  if (typeof ref !== 'string' || !ref.startsWith('#/')) {
    throw new Error(`Only in-document $refs are supported, found "${ref}".`);
  }

  return ref
    .slice(2)
    .split('/')
    .reduce((node, segment) => {
      const key = segment.replace(/~1/g, '/').replace(/~0/g, '~');
      if (node == null || typeof node !== 'object' || !(key in node)) {
        throw new Error(`Unresolvable $ref "${ref}".`);
      }
      return node[key];
    }, spec);
}

function deref(spec, node) {
  return node?.$ref ? resolveRef(spec, node.$ref) : node;
}

function baseType(schema) {
  // OpenAPI 3.1 allows type arrays such as ["string", "null"].
  if (Array.isArray(schema.type)) {
    const types = schema.type.filter(value => value !== 'null');
    const label = types.join(' | ') || 'any';
    return schema.type.includes('null') ? `${label} | null` : label;
  }

  const label = schema.type || (schema.properties ? 'object' : 'any');
  return schema.nullable === true ? `${label} | null` : label;
}

function typeLabel(spec, schema) {
  if (schema.enum) {
    return `enum<${baseType(schema)}>`;
  }
  if (schema.oneOf || schema.anyOf) {
    return schema.oneOf ? 'oneOf' : 'anyOf';
  }
  if (schema.type === 'array' || (Array.isArray(schema.type) && schema.type.includes('array'))) {
    const items = schema.items ? deref(spec, schema.items) : undefined;
    const itemLabel = items
      ? schema.items.$ref
        ? schema.items.$ref.split('/').pop()
        : typeLabel(spec, items)
      : 'any';
    return `${itemLabel}[]`;
  }
  return baseType(schema);
}

function stringifyValue(value) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

/** Builds the recursive display tree for a schema, guarding against cycles. */
export function schemaTree(spec, schema, { name, required, seen = new Set(), depth = 0 } = {}) {
  if (!schema || typeof schema !== 'object') {
    return { name, type: 'any', required };
  }

  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop();
    if (seen.has(schema.$ref) || depth >= MAX_DEPTH) {
      return { name, type: `${refName} (circular)`, required };
    }
    return schemaTree(spec, resolveRef(spec, schema.$ref), {
      name,
      required,
      seen: new Set([...seen, schema.$ref]),
      depth,
    });
  }

  if (schema.allOf) {
    const merged = {};
    for (const member of schema.allOf) {
      Object.assign(merged, deref(spec, member));
    }
    merged.description = schema.description || merged.description;
    return schemaTree(spec, merged, { name, required, seen, depth });
  }

  const node = { name, type: typeLabel(spec, schema), required };

  if (schema.deprecated === true) node.deprecated = true;
  if (typeof schema.description === 'string') node.description = schema.description;
  if (schema.default !== undefined) node.default = stringifyValue(schema.default);
  if (schema.enum) node.enum = schema.enum.map(stringifyValue);

  const variants = schema.oneOf || schema.anyOf;
  if (variants) {
    node.children = variants.slice(0, MAX_CHILDREN).map((variant, index) =>
      schemaTree(spec, variant, {
        name: variant.$ref ? variant.$ref.split('/').pop() : `option ${index + 1}`,
        seen,
        depth: depth + 1,
      }),
    );
    // Plain scalar alternatives fit in the type cell; keep richer variants
    // expanded so descriptions, constraints, and nested properties remain visible.
    if (
      variants.length <= MAX_CHILDREN &&
      node.children.every(
        child =>
          /^(string|number|integer|boolean|null)$/.test(child.type) &&
          !child.description &&
          !child.enum &&
          child.default === undefined &&
          !child.deprecated &&
          !child.children?.length,
      )
    ) {
      node.type = [...new Set(node.children.map(child => child.type))].join(' | ');
      delete node.children;
    }
    return node;
  }

  const items = schema.type === 'array' ? schema.items : undefined;
  if (items && (seen.has(items.$ref) || depth >= MAX_DEPTH)) {
    return node;
  }
  const target = items ? deref(spec, items) : schema;

  if (target?.properties && depth < MAX_DEPTH) {
    const requiredKeys = new Set(Array.isArray(target.required) ? target.required : []);
    const nextSeen = items?.$ref ? new Set([...seen, items.$ref]) : seen;
    node.children = Object.entries(target.properties)
      .slice(0, MAX_CHILDREN)
      .map(([key, property]) =>
        schemaTree(spec, property, {
          name: key,
          required: requiredKeys.has(key) || undefined,
          seen: nextSeen,
          depth: depth + 1,
        }),
      );
  }

  return node;
}

/** Derives an example value when the spec provides none. */
export function exampleFromSchema(spec, schema, seen = new Set(), depth = 0) {
  if (!schema || typeof schema !== 'object' || depth >= MAX_DEPTH) return null;

  if (schema.$ref) {
    if (seen.has(schema.$ref)) return null;
    return exampleFromSchema(
      spec,
      resolveRef(spec, schema.$ref),
      new Set([...seen, schema.$ref]),
      depth,
    );
  }
  if (schema.example !== undefined) return schema.example;
  if (Array.isArray(schema.examples) && schema.examples.length) return schema.examples[0];
  if (schema.default !== undefined) return schema.default;
  if (schema.enum?.length) return schema.enum[0];
  if (schema.allOf) {
    const merged = {};
    for (const member of schema.allOf) {
      Object.assign(merged, exampleFromSchema(spec, member, seen, depth) || {});
    }
    return merged;
  }
  if (schema.oneOf || schema.anyOf) {
    return exampleFromSchema(spec, (schema.oneOf || schema.anyOf)[0], seen, depth);
  }

  const type = Array.isArray(schema.type)
    ? schema.type.find(value => value !== 'null')
    : schema.type;

  switch (type) {
    case 'string':
      if (schema.format === 'date-time') return '2024-01-15T09:30:00Z';
      if (schema.format === 'date') return '2024-01-15';
      if (schema.format === 'email') return 'user@example.com';
      if (schema.format === 'uuid') return '123e4567-e89b-12d3-a456-426614174000';
      if (schema.format === 'uri') return 'https://example.com';
      return 'string';
    case 'integer':
    case 'number':
      return schema.minimum ?? 0;
    case 'boolean':
      return true;
    case 'array': {
      const item = exampleFromSchema(spec, schema.items, seen, depth + 1);
      return item === null ? [] : [item];
    }
    default: {
      if (!schema.properties) return type ? null : {};
      const value = {};
      for (const [key, property] of Object.entries(schema.properties).slice(0, MAX_CHILDREN)) {
        value[key] = exampleFromSchema(spec, property, seen, depth + 1);
      }
      return value;
    }
  }
}

function pickContent(content) {
  if (!content || typeof content !== 'object') return undefined;
  const contentType = 'application/json' in content ? 'application/json' : Object.keys(content)[0];
  return contentType ? { contentType, media: content[contentType] } : undefined;
}

function mediaExample(spec, media) {
  if (!media) return undefined;
  if (media.example !== undefined) return media.example;
  const named = media.examples && Object.values(media.examples)[0];
  if (named) {
    const resolved = deref(spec, named);
    if (resolved?.value !== undefined) return resolved.value;
  }
  if (media.schema) {
    return exampleFromSchema(spec, media.schema) ?? undefined;
  }
  return undefined;
}

function formatExample(value) {
  return value === undefined ? undefined : JSON.stringify(value, null, 2);
}

const SECURITY_TYPES = new Set(['http', 'apiKey', 'oauth2', 'openIdConnect']);

/** Human-readable label for a security scheme, e.g. "bearerAuth (http bearer)". */
export function securityLabel(scheme) {
  const detail = [scheme.type !== 'unknown' ? scheme.type : undefined, scheme.scheme]
    .filter(Boolean)
    .join(' ');
  return detail ? `${scheme.name} (${detail})` : scheme.name;
}

/**
 * Resolves the security schemes an operation accepts. Every scheme named by
 * any requirement alternative is listed once, in declaration order, so the
 * playground can offer an input for each and samples show how it is sent.
 */
function securitySchemes(spec, operation) {
  const requirements = operation.security ?? spec.security ?? [];
  const definitions = spec.components?.securitySchemes || {};
  const schemes = new Map();

  for (const requirement of requirements) {
    for (const name of Object.keys(requirement || {})) {
      if (schemes.has(name)) continue;
      const definition = deref(spec, definitions[name]);
      const type = SECURITY_TYPES.has(definition?.type) ? definition.type : 'unknown';
      const scheme = { name, type };
      if (type === 'http' && typeof definition.scheme === 'string') {
        scheme.scheme = definition.scheme.toLowerCase();
      }
      if (type === 'apiKey') {
        scheme.in = ['query', 'cookie'].includes(definition.in) ? definition.in : 'header';
        scheme.paramName = definition.name || name;
      }
      if (typeof definition?.description === 'string') scheme.description = definition.description;
      scheme.label = securityLabel(scheme);
      schemes.set(name, scheme);
    }
  }

  return [...schemes.values()];
}

/** Fills server URL variables with their default values. */
function expandServerUrl(server) {
  return String(server.url || '').replace(/\{([^}]+)\}/g, (match, name) => {
    const variable = server.variables?.[name];
    return variable?.default !== undefined ? String(variable.default) : match;
  });
}

/** Servers for an operation: operation-level, then path-level, then global. */
function resolveServers(spec, pathItem, operation) {
  const list = [operation.servers, pathItem.servers, spec.servers].find(
    candidate => Array.isArray(candidate) && candidate.length > 0,
  );
  const servers = (list || [])
    .filter(server => server && typeof server === 'object' && typeof server.url === 'string')
    .map(server => ({
      url: expandServerUrl(server),
      ...(server.description ? { description: server.description } : {}),
    }));
  return servers.length ? servers : [{ url: FALLBACK_SERVER }];
}

function parameterNode(spec, parameter) {
  const resolved = deref(spec, parameter);
  const node = schemaTree(spec, resolved.schema || {}, {
    name: resolved.name,
    required: resolved.required === true || resolved.in === 'path' || undefined,
  });
  if (resolved.description && !node.description) node.description = resolved.description;
  if (resolved.deprecated === true) node.deprecated = true;
  const example =
    resolved.example !== undefined
      ? resolved.example
      : exampleFromSchema(spec, resolved.schema || {});
  if (example !== null && example !== undefined) node.example = stringifyValue(example);
  return { location: resolved.in, node };
}

const HTTP_METHODS = new Set(METHODS.map(method => method.toUpperCase()));

/**
 * Normalizes every operation in the spec into a serializable shape. OpenAPI
 * 3.1 `webhooks` (and the `x-webhooks` extension) become operations flagged
 * `webhook: true`, keyed `WEBHOOK <name>`: they describe payloads the API
 * sends, so they carry no servers, samples, or playground.
 */
export function normalizeOperations(spec, { specId } = {}) {
  const operations = [];
  const sources = [
    ...Object.entries(spec.paths || {}).map(([name, item]) => [name, item, false]),
    ...Object.entries(spec.webhooks || spec['x-webhooks'] || {}).map(([name, item]) => [
      name,
      item,
      true,
    ]),
  ];

  for (const [pathName, pathItem, webhook] of sources) {
    const resolvedPath = deref(spec, pathItem);
    if (!resolvedPath || typeof resolvedPath !== 'object') continue;

    for (const method of METHODS) {
      const operation = resolvedPath[method];
      if (!operation || typeof operation !== 'object') continue;
      // A webhook name maps to one page; a second method on the same
      // webhook would collide with it, so only the first is documented.
      if (webhook && operations.some(item => item.webhook && item.path === pathName)) break;

      const upper = method.toUpperCase();
      const parameters = { query: [], path: [], header: [], cookie: [] };
      const merged = [...(resolvedPath.parameters || []), ...(operation.parameters || [])];
      const seenParams = new Set();

      // Operation-level parameters override path-level ones with the same
      // name and location, so walk the merged list from the end.
      for (const parameter of merged.reverse()) {
        const { location, node } = parameterNode(spec, parameter);
        const dedupeKey = `${location}:${node.name}`;
        if (!parameters[location] || seenParams.has(dedupeKey)) continue;
        seenParams.add(dedupeKey);
        parameters[location].unshift(node);
      }

      const bodySource = deref(spec, operation.requestBody);
      const bodyContent = pickContent(bodySource?.content);
      const requestBody = bodyContent?.media?.schema
        ? {
            required: bodySource.required === true || undefined,
            contentType: bodyContent.contentType,
            schema: schemaTree(spec, bodyContent.media.schema),
            example: formatExample(mediaExample(spec, bodyContent.media)),
          }
        : undefined;

      const responses = Object.entries(operation.responses || {})
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([status, response]) => {
          const resolved = deref(spec, response);
          const content = pickContent(resolved?.content);
          return {
            status,
            description: resolved?.description || undefined,
            contentType: content?.contentType,
            schema: content?.media?.schema ? schemaTree(spec, content.media.schema) : undefined,
            example: formatExample(mediaExample(spec, content?.media)),
          };
        });

      const servers = webhook ? [] : resolveServers(spec, resolvedPath, operation);
      const kebab = value =>
        value
          .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
          .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
          .replace(/[_\s.]+/g, '-');
      const idSource = operation.operationId
        ? kebab(operation.operationId)
        : webhook
          ? `webhook-${kebab(pathName)}`
          : `${method}-${pathName}`;
      const normalized = {
        id: slugify(idSource, `${webhook ? 'webhook' : method}-${slugify(pathName, 'root')}`),
        key: webhook ? `WEBHOOK ${pathName}` : `${upper} ${pathName}`,
        ...(specId ? { spec: specId } : {}),
        ...(webhook ? { webhook: true } : {}),
        method: upper,
        path: pathName,
        summary: operation.summary || undefined,
        description: operation.description || undefined,
        tags: operation.tags?.length ? operation.tags : ['default'],
        deprecated: operation.deprecated === true || undefined,
        parameters,
        requestBody,
        responses,
        security: webhook ? [] : securitySchemes(spec, operation),
        servers,
        serverUrl: servers[0]?.url || '',
        samples: [],
      };

      if (!webhook) normalized.samples = buildCodeSamples(normalized);
      operations.push(normalized);
    }
  }

  const ids = new Set();
  for (const operation of operations) {
    let candidate = operation.id;
    let counter = 2;
    while (ids.has(candidate)) {
      candidate = `${operation.id}-${counter}`;
      counter += 1;
    }
    operation.id = candidate;
    ids.add(candidate);
  }

  return operations;
}

function markdownSchemaLines(node, depth = 0) {
  if (!node) return [];
  const indent = '  '.repeat(depth);
  const suffix = node.required ? ', required' : '';
  const lines = [`${indent}- \`${node.name || 'body'}\` (${node.type}${suffix})`];
  if (node.description) lines[0] += ` — ${node.description.split('\n')[0]}`;
  for (const child of node.children || []) {
    lines.push(...markdownSchemaLines(child, depth + 1));
  }
  return lines;
}

/** Renders an operation as markdown for the .md export and llms-full.txt. */
export function operationToMarkdown(operation) {
  const lines = [
    operation.webhook
      ? `## Webhook: ${operation.path}`
      : `## ${operation.method} ${operation.path}`,
    '',
  ];

  if (operation.summary) lines.push(operation.summary, '');
  if (operation.description) lines.push(operation.description, '');
  if (operation.security.length) {
    lines.push(`Authentication: ${operation.security.map(scheme => scheme.label).join(', ')}`, '');
  }

  const allParameters = ['path', 'query', 'header', 'cookie'].flatMap(location =>
    operation.parameters[location].map(parameter => ({ location, parameter })),
  );
  if (allParameters.length) {
    lines.push('### Parameters', '');
    for (const { location, parameter } of allParameters) {
      const detail = [location, parameter.type, parameter.required ? 'required' : '']
        .filter(Boolean)
        .join(', ');
      const description = parameter.description ? ` — ${parameter.description.split('\n')[0]}` : '';
      lines.push(`- \`${parameter.name}\` (${detail})${description}`);
    }
    lines.push('');
  }

  if (operation.requestBody) {
    lines.push(
      operation.webhook ? '### Payload' : '### Request body',
      '',
      ...markdownSchemaLines(operation.requestBody.schema),
      '',
    );
    if (operation.requestBody.example) {
      lines.push('```json', operation.requestBody.example, '```', '');
    }
  }

  if (operation.responses.length) {
    lines.push('### Responses', '');
    for (const response of operation.responses) {
      const description = response.description ? ` — ${response.description}` : '';
      lines.push(`#### ${response.status}${description}`, '');
      if (response.example) {
        lines.push('```json', response.example, '```', '');
      }
    }
  }

  if (operation.samples.length) {
    lines.push('### Code samples', '');
    for (const sample of operation.samples) {
      lines.push(`**${sample.label}**`, '', `\`\`\`${sample.language}`, sample.source, '```', '');
    }
  }

  return lines.join('\n').trim();
}

/**
 * Normalizes every named schema under components.schemas into a page-ready
 * shape, keyed by its name (and `<spec> <name>` on multi-spec sites).
 */
export function normalizeSchemas(spec, { specId } = {}) {
  const schemas = [];

  for (const [name, schema] of Object.entries(spec.components?.schemas || {})) {
    if (!schema || typeof schema !== 'object') continue;
    const resolved = deref(spec, schema);
    const example = exampleFromSchema(spec, schema);
    schemas.push({
      name,
      key: name,
      ...(specId ? { spec: specId } : {}),
      title: typeof resolved?.title === 'string' ? resolved.title : undefined,
      description: typeof resolved?.description === 'string' ? resolved.description : undefined,
      schema: schemaTree(spec, schema),
      example: formatExample(example === null ? undefined : example),
    });
  }

  return schemas;
}

/** Anchor ids for a schema page's generated sections; mirrors src/lib/openapi.ts. */
export function schemaAnchors(page) {
  return [
    ...(page.schema?.children?.length ? ['properties'] : []),
    ...(page.example ? ['example'] : []),
  ];
}

/** Search-index sections for a schema page, matching schemaAnchors ids. */
export function schemaSearchSections(page) {
  return [
    {
      heading: undefined,
      id: undefined,
      text: [page.name, page.description].filter(Boolean).join(' '),
    },
    { heading: 'Properties', id: 'properties', text: schemaText(page.schema) },
  ].filter(section => section.text.replace(/\s+/g, ' ').trim());
}

/** Renders a schema page as markdown for the .md export and llms-full.txt. */
export function schemaToMarkdown(page) {
  const lines = [`## ${page.name}`, ''];
  if (page.description) lines.push(page.description, '');
  if (page.schema?.children?.length) {
    lines.push(
      '### Properties',
      '',
      ...markdownSchemaLines(page.schema)
        .slice(1)
        .map(line => line.slice(2)),
      '',
    );
  }
  if (page.example) lines.push('### Example', '', '```json', page.example, '```', '');
  return lines.join('\n').trim();
}

function yamlString(value) {
  return JSON.stringify(String(value).split('\n')[0]);
}

/** The frontmatter value that binds a page to an operation. */
export function operationReference(operation, prefixSpec = false) {
  const key = operation.webhook ? `webhook ${operation.path}` : operation.key;
  return prefixSpec && operation.spec ? `${operation.spec} ${key}` : key;
}

/**
 * Writes one stub .mdx page per operation, skipping files that already exist
 * so authors can customize titles or add prose above the generated reference.
 */
export async function generateOpenApiStubs({
  root,
  contentDir,
  directory,
  operations,
  prefixSpec = false,
}) {
  const created = [];

  for (const operation of operations) {
    const target = path.join(
      path.resolve(root),
      contentDir,
      operation.directory || directory || DEFAULT_API_DIRECTORY,
    );
    await fs.mkdir(target, { recursive: true });
    const filePath = path.join(target, `${operation.id}.mdx`);

    try {
      await fs.access(filePath);
      continue;
    } catch {
      // Missing: generate it.
    }

    const frontmatter = [
      '---',
      `title: ${yamlString(operation.summary || `${operation.method} ${operation.path}`)}`,
      ...(operation.description ? [`description: ${yamlString(operation.description)}`] : []),
      `openapi: ${operationReference(operation, prefixSpec)}`,
      '---',
      '',
    ].join('\n');

    await fs.writeFile(filePath, frontmatter);
    created.push(operation.pageRef || `${directory}/${operation.id}`);
  }

  return created;
}

/** Sanitizes the api.directory setting into a relative path inside contentDir. */
export function resolveApiDirectory(api) {
  const raw =
    typeof api?.directory === 'string' && api.directory.trim()
      ? api.directory
      : DEFAULT_API_DIRECTORY;
  const directory = raw
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+|\/+$/g, '');

  if (!directory || directory.split('/').includes('..')) {
    throw new Error(
      `Invalid api.directory "${raw}": use a relative path inside the content directory.`,
    );
  }

  return directory;
}

/** Where a scheme's credential travels; mirrors securityLocation in src/lib/openapi.ts. */
export function securityLocation(scheme) {
  return scheme.type === 'apiKey' && scheme.in ? scheme.in : 'header';
}

function securityForLocation(operation, location) {
  return operation.security.filter(scheme => securityLocation(scheme) === location);
}

/** True when the operation renders a Parameters section (incl. auth). */
export function hasOperationParameters(operation) {
  const { query, path: pathParams, header, cookie } = operation.parameters;
  return (
    query.length + pathParams.length + header.length + cookie.length > 0 ||
    operation.security.length > 0
  );
}

function operationParameterSections(operation) {
  return [
    { location: 'header', heading: 'Headers', id: 'headers' },
    { location: 'path', heading: 'Path parameters', id: 'path-parameters' },
    { location: 'query', heading: 'Query parameters', id: 'query-parameters' },
    { location: 'cookie', heading: 'Cookie parameters', id: 'cookie-parameters' },
  ].filter(
    ({ location }) =>
      operation.parameters[location].length > 0 ||
      securityForLocation(operation, location).length > 0,
  );
}

/**
 * Anchor ids for the generated sections, in render order. Mirrors
 * operationSections in src/lib/openapi.ts (asserted by tests/openapi.test.mjs).
 */
export function operationAnchors(operation, { playground = false } = {}) {
  return [
    ...(playground && !operation.webhook ? ['try-it'] : []),
    ...operationParameterSections(operation).map(section => section.id),
    ...(operation.requestBody ? [operation.webhook ? 'payload' : 'request-body'] : []),
    ...(operation.responses.length ? ['responses'] : []),
    ...(operation.samples.length ? ['code-samples'] : []),
  ];
}

function schemaText(node) {
  if (!node) return '';
  return [node.name, node.description, ...(node.children || []).map(schemaText)]
    .filter(Boolean)
    .join(' ');
}

/**
 * Whether an endpoint page renders the "Try it" panel. Mirrors
 * resolvePlaygroundDisplay in src/lib/openapi.ts: the page's `playground`
 * frontmatter wins over `api.playground.display`, and only "interactive"
 * (the default) renders the panel.
 */
export function hasPlayground(api, frontmatterValue) {
  const override = String(frontmatterValue ?? '').trim();
  if (['interactive', 'simple', 'none'].includes(override)) return override === 'interactive';
  const display = api?.playground?.display;
  return display !== 'simple' && display !== 'none';
}

/**
 * Normalizes an openapi frontmatter value into the operation lookup key:
 * "get /users" -> "GET /users", "webhook userCreated" -> "WEBHOOK userCreated",
 * and "users.yaml GET /users" -> "users.yaml GET /users" (a spec-qualified key
 * for multi-spec sites). Returns undefined for blank values.
 */
export function normalizeOperationKey(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const [first, ...rest] = value.trim().split(/\s+/);
  if (!rest.length) return undefined;
  const upper = first.toUpperCase();
  if (upper === 'WEBHOOK' || HTTP_METHODS.has(upper)) {
    return `${upper} ${rest.join(' ')}`;
  }
  const inner = normalizeOperationKey(rest.join(' '));
  return inner ? `${first} ${inner}` : undefined;
}

/** Normalizes an openapi-schema frontmatter value: "User" or "users.yaml User". */
export function normalizeSchemaKey(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return value.trim().split(/\s+/).join(' ');
}

/** Search-index sections for an operation, matching operationAnchors ids. */
export function operationSearchSections(operation) {
  return [
    {
      heading: undefined,
      id: undefined,
      text: [operation.method, operation.path, operation.summary, operation.description]
        .filter(Boolean)
        .join(' '),
    },
    ...operationParameterSections(operation).map(({ location, heading, id }) => ({
      heading,
      id,
      text: [
        ...operation.parameters[location].map(schemaText),
        ...securityForLocation(operation, location).flatMap(scheme => [
          scheme.type === 'apiKey' ? scheme.paramName || scheme.name : 'Authorization',
          'Authentication credentials',
          scheme.label,
        ]),
      ].join(' '),
    })),
    {
      heading: operation.webhook ? 'Payload' : 'Request body',
      id: operation.webhook ? 'payload' : 'request-body',
      text: schemaText(operation.requestBody?.schema),
    },
    {
      heading: 'Responses',
      id: 'responses',
      text: operation.responses
        .map(response => [response.status, response.description].filter(Boolean).join(' '))
        .join(' '),
    },
  ].filter(section => section.text.replace(/\s+/g, ' ').trim());
}
