import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ApiPlayground, proxiedUrl } from '@/components/ApiPlayground';
import type { NormalizedOperation } from '@/lib/types';

const operation: NormalizedOperation = {
  id: 'list-orders',
  key: 'GET /orders',
  method: 'GET',
  path: '/orders',
  tags: ['Orders'],
  parameters: {
    query: [
      { name: 'status', type: 'enum<string>', enum: ['pending', 'shipped'], example: 'pending' },
      { name: 'limit', type: 'integer', required: true, example: '20' },
      { name: 'archived', type: 'boolean' },
    ],
    path: [],
    header: [],
    cookie: [{ name: 'session', type: 'string' }],
  },
  responses: [],
  security: [
    { name: 'basic', type: 'http', scheme: 'basic', label: 'basic (http basic)' },
    { name: 'key', type: 'apiKey', in: 'header', paramName: 'X-API-Key', label: 'key (apiKey)' },
  ],
  servers: [
    { url: 'https://api.demo.dev', description: 'Production' },
    { url: 'https://sandbox.demo.dev', description: 'Sandbox' },
  ],
  serverUrl: 'https://api.demo.dev',
  samples: [],
};

describe('ApiPlayground', () => {
  const html = renderToStaticMarkup(<ApiPlayground operation={operation} />);

  it('offers every server as a suggestion', () => {
    expect(html).toContain('<datalist');
    expect(html).toContain('value="https://sandbox.demo.dev"');
  });

  it('renders inputs for each security scheme', () => {
    expect(html).toContain('Username');
    expect(html).toContain('Password');
    expect(html).toContain('X-API-Key');
    expect((html.match(/type="password"/g) || []).length).toBe(2);
  });

  it('renders enum and boolean parameters as selects and marks required ones', () => {
    expect(html).toContain('<option value="pending"');
    expect(html).toContain('<option value="true"');
    expect(html).toContain('value="20"');
    expect(html).toContain('>required<');
    expect(html).toContain('Cookie parameters cannot be set');
  });

  it('omits the body for GET operations and previews the request', () => {
    expect(html).not.toContain('<textarea');
    // The cURL preview sits in a collapsed section; only its trigger is in the static markup.
    expect(html).toContain('>Request</button>');
    expect(html).toContain('Send a request to see the response.');
  });
});

describe('proxiedUrl', () => {
  it('substitutes or appends the encoded target', () => {
    expect(proxiedUrl('https://a.dev/x?y=1')).toBe('https://a.dev/x?y=1');
    expect(proxiedUrl('https://a.dev/x?y=1', 'https://p.dev/?url=$url')).toBe(
      'https://p.dev/?url=https%3A%2F%2Fa.dev%2Fx%3Fy%3D1',
    );
    expect(proxiedUrl('https://a.dev/x', 'https://p.dev/')).toBe(
      'https://p.dev/https%3A%2F%2Fa.dev%2Fx',
    );
  });
});
