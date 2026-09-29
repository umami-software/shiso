import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OpenApiOperation } from '@/components/OpenApiOperation';
import { OpenApiSchema } from '@/components/OpenApiSchema';
import {
  methodBadgeText,
  methodColor,
  normalizeOperationKey,
  operationSections,
  schemaSections,
  statusColor,
} from '@/lib/openapi';
import type { NormalizedOperation, SchemaPage } from '@/lib/types';

const operation: NormalizedOperation = {
  id: 'create-user',
  key: 'POST /users',
  method: 'POST',
  path: '/users',
  summary: 'Create a user',
  tags: ['Users'],
  parameters: {
    query: [],
    path: [{ name: 'id', type: 'string', required: true, description: 'User identifier.' }],
    header: [],
    cookie: [],
  },
  requestBody: {
    required: true,
    contentType: 'application/json',
    schema: {
      type: 'object',
      children: [
        { name: 'name', type: 'string', required: true },
        {
          name: 'status',
          type: 'enum<string>',
          enum: ['active', 'disabled'],
        },
        {
          name: 'address',
          type: 'object',
          children: [{ name: 'city', type: 'string' }],
        },
      ],
    },
    example: '{\n  "name": "Ada"\n}',
  },
  responses: [
    { status: '201', description: 'Created.', example: '{\n  "id": "1"\n}' },
    { status: '404', description: 'Missing.' },
  ],
  security: [
    { name: 'bearerAuth', type: 'http', scheme: 'bearer', label: 'bearerAuth (http bearer)' },
  ],
  servers: [{ url: 'https://api.demo.dev' }],
  serverUrl: 'https://api.demo.dev',
  samples: [
    { language: 'bash', label: 'cURL', source: "curl -X POST 'https://api.demo.dev/users'" },
    { language: 'python', label: 'Python', source: 'import requests' },
  ],
};

describe('operationSections', () => {
  it('produces stable heading ids in render order', () => {
    expect(operationSections(operation)).toEqual([
      { name: 'Headers', id: 'headers', size: 2 },
      { name: 'Path parameters', id: 'path-parameters', size: 2 },
      { name: 'Request body', id: 'request-body', size: 2 },
      { name: 'Responses', id: 'responses', size: 2 },
      { name: 'Code samples', id: 'code-samples', size: 2 },
    ]);
  });

  it('prepends the playground section when enabled', () => {
    expect(operationSections(operation, undefined, { playground: true })[0]).toEqual({
      name: 'Try it',
      id: 'try-it',
      size: 2,
    });
  });

  it('omits sections without content', () => {
    const bare: NormalizedOperation = {
      ...operation,
      parameters: { query: [], path: [], header: [], cookie: [] },
      security: [],
      requestBody: undefined,
      samples: [],
    };
    expect(operationSections(bare).map(entry => entry.id)).toEqual(['responses']);
  });
});

describe('color maps', () => {
  it('maps methods and statuses to badge colors', () => {
    expect(methodColor('GET')).toBe('green');
    expect(methodColor('delete')).toBe('red');
    expect(methodColor('CUSTOM')).toBe('gray');
    expect(statusColor('201')).toBe('green');
    expect(statusColor('404')).toBe('red');
  });
});

describe('OpenApiOperation', () => {
  const html = renderToStaticMarkup(<OpenApiOperation operation={operation} />);

  it('renders all sections with anchor ids', () => {
    expect(html).toContain('id="headers"');
    expect(html).toContain('id="path-parameters"');
    expect(html).toContain('id="request-body"');
    expect(html).toContain('id="responses"');
    expect(html).toContain('id="code-samples"');
  });

  it('renders parameters including the auth header', () => {
    expect(html).toContain('Authorization');
    expect(html).toContain('Authentication credentials');
    expect(html).toContain('Bearer &lt;token&gt;');
    expect(html).toContain('User identifier.');
    expect(html).not.toContain('id="try-it"');
  });

  it('describes API keys where they are sent', () => {
    const keyed = renderToStaticMarkup(
      <OpenApiOperation
        operation={{
          ...operation,
          security: [
            { name: 'key', type: 'apiKey', in: 'query', paramName: 'api_key', label: 'key' },
          ],
        }}
      />,
    );
    const query = keyed
      .split('<section>')
      .find(section => section.includes('id="query-parameters"'));
    expect(query).toContain('api_key');
    expect(query).toContain('&lt;api-key&gt;');
    expect(keyed).not.toContain('id="headers"');
  });

  it('renders the playground form ahead of the reference when enabled', () => {
    const withPlayground = renderToStaticMarkup(
      <OpenApiOperation operation={operation} playground={{}} />,
    );
    expect(withPlayground.indexOf('id="try-it"')).toBeLessThan(
      withPlayground.indexOf('id="headers"'),
    );
    expect(withPlayground).toContain('data-slot="api-playground"');
    expect(withPlayground).toContain('value="https://api.demo.dev"');
    expect(withPlayground).toContain('Send request');
    expect(withPlayground).toContain('type="password"');
    expect(withPlayground).toContain('<textarea');
    expect(withPlayground).toContain('curl -X POST');
  });

  it('keeps parameter locations in separate tables and preserves field details', () => {
    const grouped = renderToStaticMarkup(
      <OpenApiOperation
        operation={{
          ...operation,
          parameters: {
            ...operation.parameters,
            query: [{ name: 'limit', type: 'integer', default: '20', description: 'Page size.' }],
            cookie: [{ name: 'session', type: 'string', deprecated: true }],
          },
        }}
      />,
    );
    const sections = grouped.split('<section>');
    const headers = sections.find(section => section.includes('id="headers"'));
    const path = sections.find(section => section.includes('id="path-parameters"'));
    const query = sections.find(section => section.includes('id="query-parameters"'));
    const cookie = sections.find(section => section.includes('id="cookie-parameters"'));
    for (const section of [headers, path, query, cookie]) {
      expect(section).toContain('<table');
      expect(section).toContain('>Name</th>');
      expect(section).toContain('>Type</th>');
      expect(section).toContain('>Description</th>');
    }
    expect(headers).toContain('Authorization');
    expect(headers).not.toContain('User identifier.');
    expect(path).toContain('User identifier.');
    expect(path).not.toContain('Page size.');
    expect(query).toContain('Page size.');
    expect(query).toContain('Default: 20');
    expect(cookie).toContain('deprecated');
  });

  it('renders response schemas as tables, including primitive responses', () => {
    const responseHtml = renderToStaticMarkup(
      <OpenApiOperation
        operation={{
          ...operation,
          responses: [
            {
              status: '200',
              schema: {
                type: 'object',
                children: [{ name: 'id', type: 'string', required: true, description: 'User ID.' }],
              },
            },
            { status: '202', schema: { type: 'string', description: 'Pending.' } },
          ],
        }}
      />,
    ).split('id="responses"')[1];
    expect(responseHtml.match(/<table /g)).toHaveLength(2);
    expect(responseHtml).toContain('User ID.');
    expect(responseHtml).toContain('Pending.');
    expect(responseHtml).toContain('required');
  });

  it('puts nested properties in a full-width row below their parent', () => {
    expect(html).toMatch(/<\/tr><tr><td colSpan="3"[^>]*>/);
    expect(html).not.toContain('min-w-[40rem]');
  });

  it('labels complex alternatives as allowed types, including root unions', () => {
    const unionHtml = renderToStaticMarkup(
      <OpenApiOperation
        operation={{
          ...operation,
          responses: [
            {
              status: '200',
              schema: {
                type: 'anyOf',
                children: [
                  { name: 'option 1', type: 'object', children: [{ name: 'id', type: 'string' }] },
                ],
              },
            },
          ],
        }}
      />,
    ).split('id="responses"')[1];
    expect(unionHtml).toContain('anyOf');
    expect(unionHtml).toContain('Allowed types');
    expect(unionHtml).toContain('colSpan="3"');
  });

  it('renders nested schema fields inside an expandable', () => {
    expect(html).toContain('name');
    expect(html).toContain('properties');
    expect(html).toContain('city');
    expect(html).toContain('<code>active</code>');
  });

  it('renders responses with status badges and examples', () => {
    expect(html).toContain('201');
    expect(html).toContain('Created.');
    expect(html).toContain('201 example');
  });

  it('renders unhighlighted sample fallbacks inside a code group', () => {
    expect(html).toContain('curl -X POST');
    expect(html).toContain('class="language-bash"');
  });

  it('labels sample tabs with their language names', () => {
    expect(html).toContain('>cURL</button>');
    expect(html).toContain('>Python</button>');
    // The tab list keeps its "Code snippets" aria-label; only the fallback
    // "snippet N" tab labels must never appear.
    expect(html).not.toContain('snippet 1');
  });
});

describe('webhooks and schema pages', () => {
  const webhook: NormalizedOperation = {
    ...operation,
    key: 'WEBHOOK userCreated',
    webhook: true,
    path: 'userCreated',
    parameters: { query: [], path: [], header: [], cookie: [] },
    security: [],
    servers: [],
    serverUrl: '',
    samples: [],
  };

  it('renders webhooks with a payload section and never a playground', () => {
    expect(operationSections(webhook, undefined, { playground: true }).map(entry => entry.id)).toEqual(
      ['payload', 'responses'],
    );
    const html = renderToStaticMarkup(<OpenApiOperation operation={webhook} playground={{}} />);
    expect(html).toContain('id="payload"');
    expect(html).toContain('>Payload<');
    expect(html).not.toContain('id="try-it"');
    expect(html).not.toContain('id="code-samples"');
  });

  it('normalizes frontmatter keys like the build scripts', () => {
    expect(normalizeOperationKey('get /users')).toBe('GET /users');
    expect(normalizeOperationKey('Webhook userCreated')).toBe('WEBHOOK userCreated');
    expect(normalizeOperationKey('users.yaml get /users')).toBe('users.yaml GET /users');
    expect(normalizeOperationKey('User')).toBeUndefined();
    expect(methodBadgeText('WEBHOOK')).toBe('HOOK');
    expect(methodColor('WEBHOOK')).toBe('yellow');
  });

  it('renders schema pages with properties and an example', () => {
    const page: SchemaPage = {
      name: 'User',
      key: 'User',
      description: 'A user.',
      schema: {
        type: 'object',
        children: [
          { name: 'id', type: 'string', required: true },
          { name: 'address', type: 'object', children: [{ name: 'city', type: 'string' }] },
        ],
      },
      example: '{\n  "id": "1"\n}',
    };
    expect(schemaSections(page).map(entry => entry.id)).toEqual(['properties', 'example']);
    const html = renderToStaticMarkup(<OpenApiSchema page={page} />);
    expect(html).toContain('id="properties"');
    expect(html).toContain('id="example"');
    expect(html).toContain('>id<');
    expect(html).toContain('&quot;id&quot;: &quot;1&quot;');
    expect(renderToStaticMarkup(<OpenApiSchema page={{ ...page, example: undefined }} />)).not.toContain(
      'id="example"',
    );
  });
});
