import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  expandOpenApiNavigation,
  hasOpenApiItems,
} from '../packages/shiso/scripts/expand-openapi-navigation.mjs';
import { DEFAULT_OPENAPI_THEME } from '../packages/shiso/scripts/generate-openapi.mjs';
import {
  buildRequest,
  exampleFromSchema,
  generateOpenApiStubs,
  hasPlayground,
  loadOpenApiSpec,
  normalizeOperationKey,
  normalizeOperations,
  operationAnchors,
  operationSearchSections,
  operationToMarkdown,
  resolveApiDirectory,
  schemaTree,
} from '../packages/shiso/scripts/lib/openapi.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE = 'tests/fixtures/openapi.yaml';

async function fixtureSpec() {
  const { spec } = await loadOpenApiSpec({ root, specPath: FIXTURE });
  return spec;
}

describe('loadOpenApiSpec', () => {
  it('rejects specs outside the project root', async () => {
    await expect(loadOpenApiSpec({ root, specPath: '../elsewhere.yaml' })).rejects.toThrow(
      'must live inside the project root',
    );
  });

  it('rejects missing files with a clear message', async () => {
    await expect(loadOpenApiSpec({ root, specPath: 'nope.yaml' })).rejects.toThrow('was not found');
  });

  it('rejects non-3.x documents', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-openapi-'));
    await fs.writeFile(path.join(dir, 'swagger.yaml'), 'swagger: "2.0"\n');
    await expect(loadOpenApiSpec({ root: dir, specPath: 'swagger.yaml' })).rejects.toThrow(
      'missing the "openapi" version field',
    );
    await fs.writeFile(path.join(dir, 'old.yaml'), 'openapi: 2.0.0\n');
    await expect(loadOpenApiSpec({ root: dir, specPath: 'old.yaml' })).rejects.toThrow(
      'supports OpenAPI 3.0 and 3.1',
    );
  });
});

describe('normalizeOperations', () => {
  it.each([
    ['getPixelShares', 'get-pixel-shares'],
    ['GetPixelShares', 'get-pixel-shares'],
    ['getHTTPResponse', 'get-http-response'],
    ['get_pixel_shares', 'get-pixel-shares'],
    ['get-pixel-shares', 'get-pixel-shares'],
  ])('uses kebab-case URLs for %s', (operationId, expected) => {
    const operations = normalizeOperations({
      paths: { '/pixels/shares': { get: { operationId, responses: {} } } },
    });

    expect(operations[0].id).toBe(expected);
  });

  it('normalizes every operation with ids, keys, and tags', async () => {
    const operations = normalizeOperations(await fixtureSpec());

    expect(operations.map(operation => operation.key)).toEqual([
      'GET /users',
      'POST /users',
      'GET /users/{id}',
      'DELETE /users/{id}',
      'GET /orders',
    ]);
    expect(operations.map(operation => operation.id)).toEqual([
      'list-users',
      'create-user',
      'get-user',
      'delete-user',
      'list-orders',
    ]);
    expect(operations.find(operation => operation.key === 'GET /orders').tags).toEqual(['Orders']);
    expect(operations.find(operation => operation.key === 'DELETE /users/{id}').deprecated).toBe(
      true,
    );
  });

  it('merges path-level parameters and marks path params required', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const operation = operations.find(item => item.key === 'GET /users/{id}');

    expect(operation.parameters.path).toHaveLength(1);
    expect(operation.parameters.path[0]).toMatchObject({ name: 'id', required: true });
    expect(operation.parameters.header[0].name).toBe('X-Request-Id');
  });

  it('resolves security into structured schemes with labels', async () => {
    const operations = normalizeOperations(await fixtureSpec());

    expect(operations.find(item => item.key === 'POST /users').security).toEqual([
      { name: 'bearerAuth', type: 'http', scheme: 'bearer', label: 'bearerAuth (http bearer)' },
    ]);
    // listUsers opts out with security: [].
    expect(operations.find(item => item.key === 'GET /users').security).toEqual([]);
  });

  it('resolves API key, basic, and unknown schemes', () => {
    const [operation] = normalizeOperations({
      components: {
        securitySchemes: {
          apiKey: { type: 'apiKey', in: 'query', name: 'key' },
          basicAuth: { type: 'http', scheme: 'Basic' },
        },
      },
      paths: {
        '/x': {
          get: { security: [{ apiKey: [] }, { basicAuth: [] }, { ghost: [] }], responses: {} },
        },
      },
    });

    expect(operation.security).toEqual([
      { name: 'apiKey', type: 'apiKey', in: 'query', paramName: 'key', label: 'apiKey (apiKey)' },
      { name: 'basicAuth', type: 'http', scheme: 'basic', label: 'basicAuth (http basic)' },
      { name: 'ghost', type: 'unknown', label: 'ghost' },
    ]);
  });

  it('resolves servers from the operation, path, or document and expands variables', () => {
    const spec = {
      servers: [
        {
          url: 'https://{region}.example.com/{version}',
          variables: { region: { default: 'eu' }, version: { default: 'v2' } },
        },
      ],
      paths: {
        '/a': { get: { responses: {} } },
        '/b': {
          servers: [{ url: 'https://b.example.com', description: 'Path server' }],
          get: { responses: {} },
          post: { servers: [{ url: 'https://op.example.com' }], responses: {} },
        },
      },
    };
    const operations = normalizeOperations(spec);
    const byKey = key => operations.find(item => item.key === key);

    expect(byKey('GET /a').servers).toEqual([{ url: 'https://eu.example.com/v2' }]);
    expect(byKey('GET /a').serverUrl).toBe('https://eu.example.com/v2');
    expect(byKey('GET /b').servers).toEqual([
      { url: 'https://b.example.com', description: 'Path server' },
    ]);
    expect(byKey('POST /b').servers).toEqual([{ url: 'https://op.example.com' }]);
    expect(normalizeOperations({ paths: { '/c': { get: { responses: {} } } } })[0].servers).toEqual(
      [{ url: 'https://api.example.com' }],
    );
  });

  it('records parameter examples on schema nodes', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const limit = operations
      .find(item => item.key === 'GET /users')
      .parameters.query.find(node => node.name === 'limit');

    expect(limit.example).toBe('20');
  });

  it('guards against circular refs in schema trees', async () => {
    const spec = await fixtureSpec();
    const tree = schemaTree(spec, { $ref: '#/components/schemas/User' });
    const friends = tree.children.find(child => child.name === 'friends');

    expect(friends.type).toBe('User[]');
    expect(friends.children).toBeUndefined();
    expect(tree.children.find(child => child.name === 'email').type).toBe('string | null');
  });

  it('renders simple alternatives inline while retaining detailed alternatives', () => {
    for (const keyword of ['oneOf', 'anyOf']) {
      const simple = schemaTree({}, { [keyword]: [{ type: 'string' }, { type: 'number' }] });
      expect(simple.type).toBe('string | number');
      expect(simple.children).toBeUndefined();

      const detailed = schemaTree(
        {},
        {
          [keyword]: [
            { type: 'string', description: 'A reference.' },
            { type: 'object', properties: { id: { type: 'string' } } },
          ],
        },
      );
      expect(detailed.type).toBe(keyword);
      expect(detailed.children[0].description).toBe('A reference.');
      expect(detailed.children[1].children[0].name).toBe('id');
    }
  });

  it('labels enums and oneOf variants', async () => {
    const spec = await fixtureSpec();
    const tree = schemaTree(spec, { $ref: '#/components/schemas/Order' });
    const status = tree.children.find(child => child.name === 'status');
    const payment = tree.children.find(child => child.name === 'payment');

    expect(status.type).toBe('enum<string>');
    expect(status.enum).toEqual(['pending', 'shipped', 'delivered']);
    expect(payment.type).toBe('oneOf');
    expect(payment.children.map(child => child.name)).toEqual(['CardPayment', 'BankPayment']);
  });
});

describe('exampleFromSchema', () => {
  it('derives examples from formats, enums, and defaults', async () => {
    const spec = await fixtureSpec();

    expect(exampleFromSchema(spec, { type: 'string', format: 'email' })).toBe('user@example.com');
    expect(exampleFromSchema(spec, { type: 'string', enum: ['a', 'b'] })).toBe('a');
    expect(exampleFromSchema(spec, { type: 'integer', default: 20 })).toBe(20);
    const user = exampleFromSchema(spec, { $ref: '#/components/schemas/User' });
    expect(user.name).toBe('string');
    expect(user.friends).toEqual([]);
  });
});

describe('buildCodeSamples', () => {
  it('produces curl, JavaScript, and Python samples', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const operation = operations.find(item => item.key === 'POST /users');
    const [curl, javascript, python] = operation.samples;

    expect(curl.source).toContain("curl -X POST 'https://api.demo.dev/v1/users'");
    expect(curl.source).toContain("-H 'Authorization: Bearer <token>'");
    expect(curl.source).toContain('"name": "Ada Lovelace"');
    expect(javascript.source).toContain("method: 'POST'");
    expect(javascript.source).toContain('body: JSON.stringify(');
    expect(python.source).toContain('requests.post(');
    expect(python.source).toContain("'name': 'Ada Lovelace'");
  });

  it('appends required query parameters with example values', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const operation = operations.find(item => item.key === 'GET /users');

    expect(operation.samples[0].source).toContain('/users?limit=20');
    // Path placeholders stay recognizable in the static samples.
    expect(operations.find(item => item.key === 'GET /users/{id}').samples[0].source).toContain(
      '/users/{id}',
    );
  });

  it('renders each security scheme the way it is sent', () => {
    const spec = {
      components: {
        securitySchemes: {
          keyHeader: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
          keyQuery: { type: 'apiKey', in: 'query', name: 'api_key' },
          keyCookie: { type: 'apiKey', in: 'cookie', name: 'session' },
          basic: { type: 'http', scheme: 'basic' },
          oauth: { type: 'oauth2', flows: {} },
        },
      },
      paths: {
        '/a': { get: { security: [{ keyHeader: [] }], responses: {} } },
        '/b': { get: { security: [{ keyQuery: [] }], responses: {} } },
        '/c': { get: { security: [{ keyCookie: [] }], responses: {} } },
        '/d': { get: { security: [{ basic: [] }], responses: {} } },
        '/e': { get: { security: [{ oauth: [] }], responses: {} } },
      },
    };
    const curl = key =>
      normalizeOperations(spec)
        .find(item => item.key === key)
        .samples.find(sample => sample.language === 'bash').source;

    expect(curl('GET /a')).toContain("-H 'X-API-Key: <api-key>'");
    expect(curl('GET /b')).toContain("'https://api.example.com/b?api_key=<api-key>'");
    expect(curl('GET /c')).toContain("-H 'Cookie: session=<api-key>'");
    expect(curl('GET /d')).toContain("-H 'Authorization: Basic <credentials>'");
    expect(curl('GET /e')).toContain("-H 'Authorization: Bearer <access-token>'");
    expect(curl('GET /a')).not.toContain('Bearer');
  });

  it('renders form, multipart, and raw bodies with matching content types', () => {
    const spec = {
      paths: {
        '/form': {
          post: {
            requestBody: {
              content: {
                'application/x-www-form-urlencoded': {
                  schema: {
                    type: 'object',
                    properties: {
                      name: { type: 'string', example: 'Ada' },
                      age: { type: 'integer', example: 36 },
                    },
                  },
                },
              },
            },
            responses: {},
          },
        },
        '/upload': {
          post: {
            requestBody: {
              content: {
                'multipart/form-data': {
                  schema: {
                    type: 'object',
                    properties: { title: { type: 'string', example: 'Report' } },
                  },
                },
              },
            },
            responses: {},
          },
        },
        '/raw': {
          post: {
            requestBody: {
              content: { 'text/plain': { schema: { type: 'string', example: 'hello' } } },
            },
            responses: {},
          },
        },
      },
    };
    const samples = key =>
      Object.fromEntries(
        normalizeOperations(spec)
          .find(item => item.key === key)
          .samples.map(sample => [sample.language, sample.source]),
      );

    const form = samples('POST /form');
    expect(form.bash).toContain("--data-urlencode 'name=Ada'");
    expect(form.bash).toContain("--data-urlencode 'age=36'");
    expect(form.bash).not.toContain('application/json');
    expect(form.javascript).toContain('new URLSearchParams({');
    expect(form.python).toContain("data={'name': 'Ada', 'age': '36'}");

    const upload = samples('POST /upload');
    expect(upload.bash).toContain("-F 'title=Report'");
    expect(upload.javascript).toContain('new FormData()');
    expect(upload.javascript).toContain("body.append('title', 'Report')");
    expect(upload.python).toContain("files={'title': (None, 'Report')}");

    const raw = samples('POST /raw');
    expect(raw.bash).toContain("-H 'Content-Type: text/plain'");
    expect(raw.bash).toContain(`-d '"hello"'`);
    expect(raw.python).toContain("'Content-Type': 'text/plain'");
  });

  it('builds live requests from playground values', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const operation = operations.find(item => item.key === 'GET /users/{id}');
    const request = buildRequest(operation, {
      live: true,
      server: 'http://localhost:3000/',
      path: { id: 'a b' },
      header: { 'X-Request-Id': 'req-1' },
      auth: { bearerAuth: 'secret' },
    });

    expect(request.url).toBe('http://localhost:3000/users/a%20b');
    expect(request.headers).toEqual({ Authorization: 'Bearer secret', 'X-Request-Id': 'req-1' });
    expect(request.bodyKind).toBe('none');

    const basic = buildRequest(
      normalizeOperations({
        components: { securitySchemes: { basic: { type: 'http', scheme: 'basic' } } },
        paths: { '/x': { get: { security: [{ basic: [] }], responses: {} } } },
      })[0],
      { live: true, auth: { basic: { username: 'ada', password: 'pw' } } },
    );
    expect(basic.headers.Authorization).toBe(`Basic ${Buffer.from('ada:pw').toString('base64')}`);
  });
});

describe('operationToMarkdown', () => {
  it('renders sections with parameters, examples, and samples', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const markdown = operationToMarkdown(operations.find(item => item.key === 'POST /users'));

    expect(markdown).toContain('## POST /users');
    expect(markdown).toContain('### Request body');
    expect(markdown).toContain('- `name` (string, required)');
    expect(markdown).toContain('#### 201 — The created user.');
    expect(markdown).toContain('```bash');
  });
});

describe('operationAnchors and search sections', () => {
  it('mirrors the runtime section ids', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const create = operations.find(item => item.key === 'POST /users');
    const remove = operations.find(item => item.key === 'DELETE /users/{id}');

    expect(operationAnchors(create)).toEqual([
      'headers',
      'request-body',
      'responses',
      'code-samples',
    ]);
    expect(operationAnchors(create, { playground: true })[0]).toBe('try-it');
    // DELETE has a path parameter (from the path item) plus auth, no body.
    expect(operationAnchors(remove)).toEqual([
      'headers',
      'path-parameters',
      'responses',
      'code-samples',
    ]);

    const sections = operationSearchSections(create);
    expect(sections[0].text).toContain('POST /users Create a user');
    expect(sections.find(section => section.id === 'request-body').text).toContain('name');
  });

  it('places query and cookie API keys in their own sections', () => {
    const [operation] = normalizeOperations({
      components: { securitySchemes: { key: { type: 'apiKey', in: 'query', name: 'api_key' } } },
      paths: { '/x': { get: { security: [{ key: [] }], responses: {} } } },
    });

    expect(operationAnchors(operation)).toEqual(['query-parameters', 'code-samples']);
    expect(
      operationSearchSections(operation).find(section => section.id === 'query-parameters').text,
    ).toContain('api_key');
  });

  it('resolves playground display from config and frontmatter', () => {
    expect(hasPlayground(undefined, undefined)).toBe(true);
    expect(hasPlayground({ playground: { display: 'none' } }, undefined)).toBe(false);
    expect(hasPlayground({ playground: { display: 'simple' } }, 'interactive')).toBe(true);
    expect(hasPlayground({}, 'none')).toBe(false);
  });

  it('normalizes frontmatter keys case-insensitively', () => {
    expect(normalizeOperationKey('get /users/{id}')).toBe('GET /users/{id}');
    expect(normalizeOperationKey('  POST   /users ')).toBe('POST /users');
    expect(normalizeOperationKey('')).toBeUndefined();
  });
});

describe('generateOpenApiStubs', () => {
  it('writes stubs and skips existing files', async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-stubs-'));
    const operations = normalizeOperations(await fixtureSpec());

    const created = await generateOpenApiStubs({
      root: dir,
      contentDir: 'content/docs',
      directory: 'api-reference',
      operations,
    });
    expect(created).toHaveLength(operations.length);

    const stubPath = path.join(dir, 'content/docs/api-reference/get-user.mdx');
    const stub = await fs.readFile(stubPath, 'utf8');
    expect(stub).toContain('title: "Get a user"');
    expect(stub).toContain('openapi: GET /users/{id}');

    await fs.writeFile(stubPath, '---\ntitle: Customized\nopenapi: GET /users/{id}\n---\n');
    const again = await generateOpenApiStubs({
      root: dir,
      contentDir: 'content/docs',
      directory: 'api-reference',
      operations,
    });
    expect(again).toHaveLength(0);
    expect(await fs.readFile(stubPath, 'utf8')).toContain('Customized');
  });
});

describe('expandOpenApiNavigation', () => {
  it('expands { openapi: true } into tag groups', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const config = {
      navigation: { groups: [{ group: 'API', pages: ['intro', { openapi: true }] }] },
    };
    const expanded = expandOpenApiNavigation(config, { operations, directory: 'api-reference' });
    const pages = expanded.navigation.groups[0].pages;

    expect(pages[0]).toBe('intro');
    expect(pages[1].group).toBe('Users');
    expect(pages[2].group).toBe('Orders');
    expect(pages[1].pages[0]).toMatchObject({
      page: 'api-reference/list-users',
      title: 'List users',
      method: 'GET',
    });
  });

  it('expands a tag filter into flat entries and rejects unknown tags', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const config = { navigation: { pages: [{ openapi: 'Orders' }] } };
    const expanded = expandOpenApiNavigation(config, { operations, directory: 'api' });

    expect(expanded.navigation.pages).toEqual([
      { page: 'api/list-orders', title: 'List orders', method: 'GET' },
    ]);
    expect(hasOpenApiItems(config.navigation)).toBe(true);
    expect(() =>
      expandOpenApiNavigation(
        { navigation: { pages: [{ openapi: 'Nope' }] } },
        { operations, directory: 'api' },
      ),
    ).toThrow('matched no operations');
  });
});

describe('config helpers', () => {
  it('sanitizes api.directory and applies the default', () => {
    expect(resolveApiDirectory(undefined)).toBe('api-reference');
    expect(resolveApiDirectory({ directory: './api/' })).toBe('api');
    expect(() => resolveApiDirectory({ directory: '../up' })).toThrow('Invalid api.directory');
  });

  it('keeps the generator theme in sync with the code block default', async () => {
    const { DEFAULT_CODE_THEME } = await import('../packages/shiso/src/lib/code-blocks.ts');
    expect(DEFAULT_OPENAPI_THEME).toEqual(DEFAULT_CODE_THEME);
  });
});
