import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { expandOpenApiNavigation } from '../packages/shiso/scripts/expand-openapi-navigation.mjs';
import {
  normalizeOperations,
  normalizeSchemas,
  operationAnchors,
  operationReference,
  operationToMarkdown,
  schemaAnchors,
  schemaSearchSections,
  schemaToMarkdown,
} from '../packages/shiso/scripts/lib/openapi.mjs';
import {
  apiSpecSources,
  isAmbiguousOperation,
  loadApiProject,
  lookupOperation,
  lookupSchema,
  specDirectorySlug,
} from '../packages/shiso/scripts/lib/openapi-project.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const FIXTURE = 'tests/fixtures/openapi.yaml';

const WEBHOOK_SPEC = {
  openapi: '3.1.0',
  info: { title: 'Events', version: '1' },
  paths: { '/ping': { get: { operationId: 'ping', responses: { 200: { description: 'ok' } } } } },
  webhooks: {
    userCreated: {
      post: {
        summary: 'User created',
        tags: ['Users'],
        requestBody: {
          content: {
            'application/json': {
              schema: { type: 'object', properties: { id: { type: 'string' } } },
            },
          },
        },
        responses: { 200: { description: 'Return 200 to acknowledge.' } },
      },
    },
    orderShipped: {
      post: { responses: { 200: { description: 'ok' } } },
    },
  },
  components: {
    schemas: {
      Event: {
        description: 'An event envelope.',
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'string', example: 'evt_1' }, type: { type: 'string' } },
      },
    },
  },
};

async function temporaryProject(specs) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'shiso-api-project-'));
  for (const [name, contents] of Object.entries(specs)) {
    await fs.writeFile(
      path.join(dir, name),
      typeof contents === 'string' ? contents : JSON.stringify(contents),
    );
  }
  return dir;
}

describe('webhooks', () => {
  it('normalizes webhooks as flagged operations without servers or samples', () => {
    const operations = normalizeOperations(WEBHOOK_SPEC);
    const hook = operations.find(item => item.key === 'WEBHOOK userCreated');

    expect(operations.map(item => item.key)).toEqual([
      'GET /ping',
      'WEBHOOK userCreated',
      'WEBHOOK orderShipped',
    ]);
    expect(hook).toMatchObject({
      id: 'webhook-user-created',
      webhook: true,
      method: 'POST',
      path: 'userCreated',
      samples: [],
      servers: [],
      security: [],
    });
    expect(hook.requestBody.schema.children[0].name).toBe('id');
    expect(operationAnchors(hook, { playground: true })).toEqual(['payload', 'responses']);
    expect(operationToMarkdown(hook)).toContain('## Webhook: userCreated');
    expect(operationToMarkdown(hook)).toContain('### Payload');
    expect(operationReference(hook)).toBe('webhook userCreated');
  });

  it('groups untagged webhooks under "Webhooks" and tagged ones with their tag', () => {
    const operations = normalizeOperations(WEBHOOK_SPEC).map(operation => ({
      ...operation,
      pageRef: `api/${operation.id}`,
    }));
    const expanded = expandOpenApiNavigation(
      { navigation: { pages: [{ openapi: true }] } },
      { operations, directory: 'api' },
    );

    expect(expanded.navigation.pages.map(group => group.group)).toEqual([
      'default',
      'Users',
      'Webhooks',
    ]);
    expect(expanded.navigation.pages[1].pages[0]).toEqual({
      page: 'api/webhook-user-created',
      title: 'User created',
      method: 'WEBHOOK',
    });
    expect(expanded.navigation.pages[2].pages[0]).toMatchObject({ title: 'orderShipped' });
  });
});

describe('schemas', () => {
  it('normalizes component schemas into pages with examples and anchors', () => {
    const [event] = normalizeSchemas(WEBHOOK_SPEC, { specId: 'events.json' });

    expect(event).toMatchObject({
      name: 'Event',
      key: 'Event',
      spec: 'events.json',
      description: 'An event envelope.',
    });
    expect(event.schema.children.map(node => node.name)).toEqual(['id', 'type']);
    expect(JSON.parse(event.example)).toEqual({ id: 'evt_1', type: 'string' });
    expect(schemaAnchors(event)).toEqual(['properties', 'example']);
    expect(schemaSearchSections(event).find(section => section.id === 'properties').text).toContain(
      'id',
    );

    const markdown = schemaToMarkdown(event);
    expect(markdown).toContain('## Event');
    expect(markdown).toContain('- `id` (string, required)');
    expect(markdown).toContain('### Example');
  });
});

describe('apiSpecSources', () => {
  it('accepts one spec or a list and rejects duplicates', () => {
    expect(apiSpecSources({ spec: 'a.yaml' })).toEqual(['a.yaml']);
    expect(apiSpecSources({ spec: ['a.yaml', ' https://x.dev/b.json '] })).toEqual([
      'a.yaml',
      'https://x.dev/b.json',
    ]);
    expect(apiSpecSources(undefined)).toEqual([]);
    expect(() => apiSpecSources({ spec: ['a.yaml', 'a.yaml'] })).toThrow('more than once');
  });

  it('derives folder names from file names and URLs', () => {
    expect(specDirectorySlug('specs/Users API.yaml')).toBe('users-api');
    expect(specDirectorySlug('https://example.com/v2/openapi.json')).toBe('openapi');
    expect(specDirectorySlug('https://api.example.com/')).toBe('api-example-com');
  });
});

describe('loadApiProject', () => {
  it('loads a single spec into the default directory with bare keys', async () => {
    const project = await loadApiProject({ root, api: { spec: FIXTURE } });

    expect(project.multi).toBe(false);
    expect(project.specs[0]).toMatchObject({ id: FIXTURE, remote: false, title: 'Demo API' });
    expect(project.operations[0].pageRef).toBe('api-reference/list-users');
    expect(lookupOperation(project, 'get /users').key).toBe('GET /users');
    expect(lookupOperation(project, `${FIXTURE} GET /users`).key).toBe('GET /users');
    expect(lookupSchema(project, 'User').name).toBe('User');
    expect(project.specPaths).toEqual([path.resolve(root, FIXTURE)]);
  });

  it('separates several specs into subdirectories and flags shared keys', async () => {
    const dir = await temporaryProject({
      'users.json': {
        openapi: '3.0.0',
        paths: { '/users': { get: { operationId: 'listUsers', responses: {} } } },
        components: { schemas: { User: { type: 'object' } } },
      },
      'billing.json': {
        openapi: '3.0.0',
        paths: {
          '/users': { get: { operationId: 'listUsers', responses: {} } },
          '/invoices': { get: { operationId: 'listInvoices', responses: {} } },
        },
        components: { schemas: { Invoice: { type: 'object' } } },
      },
    });
    const project = await loadApiProject({
      root: dir,
      api: { spec: ['users.json', 'billing.json'], directory: 'api' },
    });

    expect(project.multi).toBe(true);
    expect(project.operations.map(operation => operation.pageRef)).toEqual([
      'api/users/list-users',
      'api/billing/list-users',
      'api/billing/list-invoices',
    ]);
    expect(lookupOperation(project, 'GET /users')).toBeUndefined();
    expect(isAmbiguousOperation(project, 'GET /users')).toBe(true);
    expect(lookupOperation(project, 'billing.json GET /users').pageRef).toBe(
      'api/billing/list-users',
    );
    expect(lookupOperation(project, 'GET /invoices').spec).toBe('billing.json');
    expect(lookupSchema(project, 'Invoice').spec).toBe('billing.json');
    expect(lookupSchema(project, 'users.json User').name).toBe('User');
    expect(operationReference(project.operations[1], true)).toBe('billing.json GET /users');

    // A spec path in navigation expands into that spec's operations only.
    const expanded = expandOpenApiNavigation(
      { navigation: { pages: [{ openapi: 'billing.json' }] } },
      { operations: project.operations, directory: 'api', specs: project.specs },
    );
    expect(expanded.navigation.pages).toHaveLength(1);
    expect(expanded.navigation.pages[0].pages.map(page => page.page)).toEqual([
      'api/billing/list-invoices',
      'api/billing/list-users',
    ]);
  });

  it('fetches remote specs, caches them, and falls back to the cache offline', async () => {
    const dir = await temporaryProject({});
    const url = 'https://example.com/openapi.json';
    const calls = [];
    const online = async (target, init) => {
      calls.push([target, init]);
      return { ok: true, text: async () => JSON.stringify(WEBHOOK_SPEC) };
    };

    const first = await loadApiProject({ root: dir, api: { spec: url }, fetchImpl: online });
    expect(calls).toHaveLength(1);
    expect(first.specs[0]).toMatchObject({ remote: true, directory: 'api-reference' });
    expect(first.specPaths).toEqual([]);
    expect(lookupOperation(first, 'webhook userCreated').webhook).toBe(true);

    const cached = await fs.readdir(path.join(dir, '.shiso', 'openapi-cache'));
    expect(cached).toHaveLength(1);

    // A second project root with the same cache directory layout but no
    // network uses the cached copy; without one the failure is reported.
    const offline = async () => {
      throw new Error('ENOTFOUND');
    };
    const other = await temporaryProject({});
    await expect(
      loadApiProject({
        root: other,
        api: { spec: 'https://example.com/missing.json' },
        fetchImpl: offline,
      }),
    ).rejects.toThrow('Could not download OpenAPI spec');
    await fs.mkdir(path.join(other, '.shiso', 'openapi-cache'), { recursive: true });
    await fs.copyFile(
      path.join(dir, '.shiso', 'openapi-cache', cached[0]),
      path.join(other, '.shiso', 'openapi-cache', cached[0]),
    );
    const fallback = await loadApiProject({ root: other, api: { spec: url }, fetchImpl: offline });
    expect(fallback.operations.map(operation => operation.key)).toContain('GET /ping');
  });

  it('rejects remote documents that are not OpenAPI 3', async () => {
    const dir = await temporaryProject({});
    await expect(
      loadApiProject({
        root: dir,
        api: { spec: 'https://example.com/swagger.json' },
        fetchImpl: async () => ({ ok: true, text: async () => '{"swagger":"2.0"}' }),
      }),
    ).rejects.toThrow('missing the "openapi" version field');
  });
});
