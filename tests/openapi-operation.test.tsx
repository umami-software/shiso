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
      { name: 'Parameters', id: 'parameters', size: 2 },
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
    expect(html).toContain('id="parameters"');
    expect(html).toContain('id="request-body"');
    expect(html).toContain('id="responses"');
    expect(html).toContain('id="code-samples"');
  });

  it('renders parameters including the auth header', () => {
    expect(html).toContain('Authorization');
    expect(html).toContain('bearerAuth (http bearer)');
    expect(html).toContain('User identifier.');
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
