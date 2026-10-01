/**
 * Interprets normalized reference data for both the browser and build scripts.
 * Binding precedence, playground rules, and section identities live here;
 * output adapters never reconstruct them. This module has no Node imports.
 */
import englishLabels from '../../src/lib/translations/en.json' with { type: 'json' };

/** @typedef {import('../../src/lib/types.ts').NormalizedOperation} NormalizedOperation */
/** @typedef {import('../../src/lib/types.ts').SchemaPage} SchemaPage */
/** @typedef {import('../../src/lib/types.ts').ReferencePage} ReferencePage */
/** @typedef {import('../../src/lib/types.ts').ReferenceSection} ReferenceSection */
/** @typedef {import('../../src/lib/types.ts').ThemeLabels} ThemeLabels */
/**
 * @typedef {object} ReferenceLookup
 * @property {Map<string, NormalizedOperation> | Record<string, NormalizedOperation>} operationsByKey
 * @property {Map<string, SchemaPage> | Record<string, SchemaPage>} schemasByKey
 * @property {Set<string>} [ambiguous]
 */

const HTTP_METHODS = new Set(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS', 'TRACE']);
const PARAMETER_SECTIONS = [
  { location: 'header', heading: 'Headers', id: 'headers', label: 'apiHeaders' },
  {
    location: 'path',
    heading: 'Path parameters',
    id: 'path-parameters',
    label: 'apiPathParameters',
  },
  {
    location: 'query',
    heading: 'Query parameters',
    id: 'query-parameters',
    label: 'apiQueryParameters',
  },
  {
    location: 'cookie',
    heading: 'Cookie parameters',
    id: 'cookie-parameters',
    label: 'apiCookieParameters',
  },
];

/** @param {unknown} value @returns {string | undefined} */
export function normalizeOperationKey(value) {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  const [first, ...rest] = value.trim().split(/\s+/);
  if (!rest.length) return undefined;
  const upper = first.toUpperCase();
  if (upper === 'WEBHOOK' || HTTP_METHODS.has(upper)) return `${upper} ${rest.join(' ')}`;
  const inner = normalizeOperationKey(rest.join(' '));
  return inner ? `${first} ${inner}` : undefined;
}

/** @param {unknown} value */
export function normalizeSchemaKey(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim().split(/\s+/).join(' ')
    : undefined;
}

function lookup(index, key) {
  if (!index || !key) return undefined;
  return index instanceof Map ? index.get(key) : Object.hasOwn(index, key) ? index[key] : undefined;
}

/**
 * @param {ReferenceLookup | undefined} project
 * @param {unknown} value
 * @returns {NormalizedOperation | undefined}
 */
export function lookupOperation(project, value) {
  return lookup(project?.operationsByKey, normalizeOperationKey(value));
}

/**
 * @param {ReferenceLookup | undefined} project
 * @param {unknown} value
 * @returns {SchemaPage | undefined}
 */
export function lookupSchema(project, value) {
  return lookup(project?.schemasByKey, normalizeSchemaKey(value));
}

export function isAmbiguousOperation(project, value) {
  const key = normalizeOperationKey(value);
  return !!key && !!project?.ambiguous?.has(key);
}

export function isAmbiguousSchema(project, value) {
  const key = normalizeSchemaKey(value);
  return !!key && !!project?.ambiguous?.has(key);
}

/** @param {import('../../src/lib/types.ts').SecurityScheme} scheme */
export function securityLocation(scheme) {
  return scheme.type === 'apiKey' && scheme.in ? scheme.in : 'header';
}

/** @param {NormalizedOperation} operation */
export function securityForLocation(operation, location) {
  return operation.security.filter(scheme => securityLocation(scheme) === location);
}

/** @param {import('../../src/lib/types.ts').SecurityScheme} scheme */
export function securityFieldName(scheme) {
  return scheme.type === 'apiKey' ? scheme.paramName || scheme.name : 'Authorization';
}

/** @param {NormalizedOperation} operation */
export function hasParameters(operation) {
  return getOperationSections(operation).some(section => section.kind === 'parameters');
}

/** @returns {'interactive' | 'simple' | 'none'} */
export function resolvePlaygroundDisplay(playground, frontmatter) {
  const override = frontmatter?.playground;
  const display = typeof override === 'string' ? override.trim() : undefined;
  if (display === 'interactive' || display === 'simple' || display === 'none') return display;
  return playground?.display === 'simple' || playground?.display === 'none'
    ? playground.display
    : 'interactive';
}

/**
 * @param {NormalizedOperation} operation
 * @param {{ playground?: boolean, labels?: ThemeLabels }} [options]
 * @returns {ReferenceSection[]}
 */
export function getOperationSections(
  operation,
  { playground = false, labels = englishLabels } = {},
) {
  const sections = [];
  if (playground && !operation.webhook) {
    sections.push({
      kind: 'playground',
      id: 'try-it',
      heading: 'Try it',
      name: labels.apiPlayground,
    });
  }
  for (const { location, heading, id, label } of PARAMETER_SECTIONS) {
    if (operation.parameters[location].length || securityForLocation(operation, location).length) {
      sections.push({ kind: 'parameters', location, id, heading, name: labels[label] });
    }
  }
  if (operation.requestBody) {
    sections.push({
      kind: 'request-body',
      id: operation.webhook ? 'payload' : 'request-body',
      heading: operation.webhook ? 'Payload' : 'Request body',
      name: operation.webhook ? labels.apiPayload : labels.apiRequestBody,
    });
  }
  if (operation.responses.length) {
    sections.push({
      kind: 'responses',
      id: 'responses',
      heading: 'Responses',
      name: labels.apiResponses,
    });
  }
  if (operation.samples.length) {
    sections.push({
      kind: 'code-samples',
      id: 'code-samples',
      heading: 'Code samples',
      name: labels.apiCodeSamples,
    });
  }
  return sections;
}

/**
 * @param {SchemaPage} page
 * @param {ThemeLabels} [labels]
 * @returns {ReferenceSection[]}
 */
export function getSchemaSections(page, labels = englishLabels) {
  return [
    ...(page.schema.children?.length
      ? [
          {
            kind: 'properties',
            id: 'properties',
            heading: 'Properties',
            name: labels.apiSchemaProperties,
          },
        ]
      : []),
    ...(page.example
      ? [{ kind: 'example', id: 'example', heading: 'Example', name: labels.apiExample }]
      : []),
  ];
}

/**
 * Both map-backed build data and record-backed generated data satisfy the
 * lookup seam. Invalid authored bindings remain diagnosable even when the
 * other binding resolves. A valid operation takes precedence over a schema.
 * @param {import('../../src/lib/types.ts').DocFrontmatter | undefined} frontmatter
 * @param {ReferenceLookup | undefined} project
 * @param {{ playground?: import('../../src/lib/types.ts').ResolvedApiPlayground, labels?: ThemeLabels }} [options]
 * @returns {ReferencePage}
 */
export function interpretReferencePage(
  frontmatter,
  project,
  { playground, labels = englishLabels } = {},
) {
  const operation = lookupOperation(project, frontmatter?.openapi);
  const boundSchema = lookupSchema(project, frontmatter?.['openapi-schema']);
  const schema = operation ? undefined : boundSchema;
  const display =
    !!operation &&
    !operation.webhook &&
    resolvePlaygroundDisplay(playground, frontmatter) === 'interactive';
  const issues = [];
  if (frontmatter?.openapi && !operation) {
    issues.push({
      field: 'openapi',
      value: frontmatter.openapi,
      ambiguous: isAmbiguousOperation(project, frontmatter.openapi),
    });
  }
  if (frontmatter?.['openapi-schema'] && !boundSchema) {
    issues.push({
      field: 'openapi-schema',
      value: frontmatter['openapi-schema'],
      ambiguous: isAmbiguousSchema(project, frontmatter['openapi-schema']),
    });
  }
  return {
    operation,
    schema,
    playground: display ? { proxy: playground?.proxy } : false,
    sections: operation
      ? getOperationSections(operation, { playground: display, labels })
      : schema
        ? getSchemaSections(schema, labels)
        : [],
    issues,
  };
}

/** Reads the reference bindings from the single-line frontmatter used by build scripts. */
export function readReferenceFrontmatter(source) {
  const yaml = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '';
  const field = name =>
    yaml
      .match(new RegExp(`^${name}:[ \\t]*([^\\r\\n]+)$`, 'm'))?.[1]
      ?.trim()
      .replace(/^["']|["']$/g, '');
  return {
    openapi: field('openapi'),
    'openapi-schema': field('openapi-schema'),
    playground: field('playground'),
  };
}

/** @param {ReferencePage} reference */
export function referenceToMarkdown(reference) {
  return reference.operation
    ? operationToMarkdown(reference.operation, reference.sections)
    : reference.schema
      ? schemaToMarkdown(reference.schema, reference.sections)
      : '';
}

/** @param {ReferencePage} reference */
export function referenceSearchSections(reference) {
  return reference.operation
    ? operationSearchSections(reference.operation, reference.sections)
    : reference.schema
      ? schemaSearchSections(reference.schema, reference.sections)
      : [];
}

function markdownSchemaLines(node, depth = 0) {
  if (!node) return [];
  const indent = '  '.repeat(depth);
  const suffix = node.required ? ', required' : '';
  const lines = [`${indent}- \`${node.name || 'body'}\` (${node.type}${suffix})`];
  if (node.description) lines[0] += ` — ${node.description.split('\n')[0]}`;
  for (const child of node.children || []) lines.push(...markdownSchemaLines(child, depth + 1));
  return lines;
}

/**
 * Static exports omit the interactive playground; all content sections use
 * the same identities and ordering as the rendered reference.
 * @param {NormalizedOperation} operation
 * @param {ReferenceSection[]} [sections]
 */
export function operationToMarkdown(operation, sections = getOperationSections(operation)) {
  const lines = [
    operation.webhook
      ? `## Webhook: ${operation.path}`
      : `## ${operation.method} ${operation.path}`,
    '',
  ];
  if (operation.summary) lines.push(operation.summary, '');
  if (operation.description) lines.push(operation.description, '');
  if (operation.security.length)
    lines.push(`Authentication: ${operation.security.map(scheme => scheme.label).join(', ')}`, '');
  for (const section of sections) {
    if (section.kind === 'playground') continue;
    lines.push(`### ${section.heading}`, '');
    if (section.kind === 'parameters') {
      for (const scheme of securityForLocation(operation, section.location)) {
        lines.push(
          `- \`${securityFieldName(scheme)}\` (authentication, required) — ${scheme.description || scheme.label}`,
        );
      }
      for (const parameter of operation.parameters[section.location]) {
        const detail = [section.location, parameter.type, parameter.required ? 'required' : '']
          .filter(Boolean)
          .join(', ');
        const description = parameter.description
          ? ` — ${parameter.description.split('\n')[0]}`
          : '';
        lines.push(`- \`${parameter.name}\` (${detail})${description}`);
      }
      lines.push('');
    } else if (section.kind === 'request-body') {
      lines.push(...markdownSchemaLines(operation.requestBody.schema), '');
      if (operation.requestBody.example)
        lines.push('```json', operation.requestBody.example, '```', '');
    } else if (section.kind === 'responses') {
      for (const response of operation.responses) {
        lines.push(
          `#### ${response.status}${response.description ? ` — ${response.description}` : ''}`,
          '',
        );
        if (response.example) lines.push('```json', response.example, '```', '');
      }
    } else if (section.kind === 'code-samples') {
      for (const sample of operation.samples) {
        lines.push(`**${sample.label}**`, '', `\`\`\`${sample.language}`, sample.source, '```', '');
      }
    }
  }
  return lines.join('\n').trim();
}

/** @param {SchemaPage} page @param {ReferenceSection[]} [sections] */
export function schemaToMarkdown(page, sections = getSchemaSections(page)) {
  const lines = [`## ${page.name}`, ''];
  if (page.description) lines.push(page.description, '');
  for (const section of sections) {
    lines.push(`### ${section.heading}`, '');
    if (section.kind === 'properties') {
      lines.push(
        ...markdownSchemaLines(page.schema)
          .slice(1)
          .map(line => line.slice(2)),
        '',
      );
    } else if (section.kind === 'example') {
      lines.push('```json', page.example, '```', '');
    }
  }
  return lines.join('\n').trim();
}

function schemaText(node) {
  if (!node) return '';
  return [node.name, node.description, ...(node.children || []).map(schemaText)]
    .filter(Boolean)
    .join(' ');
}

/** @param {NormalizedOperation} operation @param {ReferenceSection[]} [sections] */
export function operationSearchSections(operation, sections = getOperationSections(operation)) {
  const records = [
    {
      heading: undefined,
      id: undefined,
      text: [operation.method, operation.path, operation.summary, operation.description]
        .filter(Boolean)
        .join(' '),
    },
  ];
  for (const section of sections) {
    let text;
    if (section.kind === 'parameters') {
      text = [
        ...operation.parameters[section.location].map(schemaText),
        ...securityForLocation(operation, section.location).flatMap(scheme => [
          securityFieldName(scheme),
          'Authentication credentials',
          scheme.label,
        ]),
      ].join(' ');
    } else if (section.kind === 'request-body') {
      text = schemaText(operation.requestBody?.schema);
    } else if (section.kind === 'responses') {
      text = operation.responses
        .map(response => [response.status, response.description].filter(Boolean).join(' '))
        .join(' ');
    }
    if (text) records.push({ heading: section.heading, id: section.id, text });
  }
  return records.filter(section => section.text.replace(/\s+/g, ' ').trim());
}

/** @param {SchemaPage} page @param {ReferenceSection[]} [sections] */
export function schemaSearchSections(page, sections = getSchemaSections(page)) {
  return [
    {
      heading: undefined,
      id: undefined,
      text: [page.name, page.description].filter(Boolean).join(' '),
    },
    ...sections
      .filter(section => section.kind === 'properties')
      .map(section => ({
        heading: section.heading,
        id: section.id,
        text: schemaText(page.schema),
      })),
  ].filter(section => section.text.replace(/\s+/g, ' ').trim());
}
