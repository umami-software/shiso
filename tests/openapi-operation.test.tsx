import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { OpenApiOperation } from '@/components/OpenApiOperation';
import { methodColor, operationSections, statusColor } from '@/lib/openapi';
import type { NormalizedOperation } from '@/lib/types';

const operation: NormalizedOperation = {
  id: 'createuser',
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
  security: ['bearerAuth (http bearer)'],
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
    expect(html).toContain('User identifier.');
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
