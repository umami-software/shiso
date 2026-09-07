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
  exampleFromSchema,
  generateOpenApiStubs,
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
      'listusers',
      'createuser',
      'getuser',
      'deleteuser',
      'listorders',
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

  it('resolves security into readable summaries', async () => {
    const operations = normalizeOperations(await fixtureSpec());

    expect(operations.find(item => item.key === 'POST /users').security).toEqual([
      'bearerAuth (http bearer)',
    ]);
    // listUsers opts out with security: [].
    expect(operations.find(item => item.key === 'GET /users').security).toEqual([]);
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

    const stubPath = path.join(dir, 'content/docs/api-reference/getuser.mdx');
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
      page: 'api-reference/listusers',
      title: 'List users',
      method: 'GET',
    });
  });

  it('expands a tag filter into flat entries and rejects unknown tags', async () => {
    const operations = normalizeOperations(await fixtureSpec());
    const config = { navigation: { pages: [{ openapi: 'Orders' }] } };
    const expanded = expandOpenApiNavigation(config, { operations, directory: 'api' });

    expect(expanded.navigation.pages).toEqual([
      { page: 'api/listorders', title: 'List orders', method: 'GET' },
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
