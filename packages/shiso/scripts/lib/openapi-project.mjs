/**
 * Loads every OpenAPI spec a project configures and indexes the result.
 *
 * `api.spec` accepts one path or URL, or a list of them. Each spec becomes a
 * set of operations (and webhooks) plus named schemas; with several specs the
 * endpoint pages of each land in their own subdirectory and frontmatter keys
 * may be qualified with the spec ("users.yaml GET /users") to disambiguate.
 * Remote specs are fetched on load and cached under .shiso so a build still
 * succeeds when the URL is unreachable.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';
import {
  DEFAULT_API_DIRECTORY,
  loadOpenApiSpec,
  normalizeOperations,
  normalizeSchemas,
  resolveApiDirectory,
} from './openapi.mjs';
import { slugify } from './slug.mjs';

const REMOTE = /^https?:\/\//i;
const remoteCache = new Map();

export function isRemoteSpec(source) {
  return REMOTE.test(String(source || ''));
}

/** Normalizes api.spec into an ordered list of spec sources. */
export function apiSpecSources(api) {
  const raw = api?.spec;
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  const sources = list.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean);
  if (new Set(sources).size !== sources.length) {
    throw new Error('api.spec lists the same spec more than once.');
  }
  return sources;
}

/** Folder name for one spec's endpoint pages on a multi-spec site. */
export function specDirectorySlug(source) {
  const base = isRemoteSpec(source)
    ? new URL(source).pathname.split('/').filter(Boolean).pop() || new URL(source).hostname
    : source.replace(/\\/g, '/').split('/').pop();
  return slugify(base.replace(/\.(json|ya?ml)$/i, '').replace(/\./g, '-'), 'api');
}

function validateSpecDocument(spec, label) {
  if (!spec || typeof spec !== 'object' || typeof spec.openapi !== 'string') {
    throw new Error(`"${label}" is not an OpenAPI document: missing the "openapi" version field.`);
  }
  if (!spec.openapi.startsWith('3.')) {
    throw new Error(
      `Unsupported OpenAPI version "${spec.openapi}" in "${label}": Shiso supports OpenAPI 3.0 and 3.1.`,
    );
  }
}

async function loadRemoteSpec({ root, url, fetchImpl = globalThis.fetch }) {
  const cacheDir = path.join(path.resolve(root), '.shiso', 'openapi-cache');
  const cachePath = path.join(cacheDir, `${slugify(url, 'spec')}.txt`);
  // One download per project and process: dev-server reloads reuse the copy.
  const memoryKey = `${cacheDir}|${url}`;

  if (remoteCache.has(memoryKey)) return { spec: remoteCache.get(memoryKey), specPath: cachePath };

  let source;
  let fetchError;
  try {
    if (typeof fetchImpl !== 'function') throw new Error('fetch is not available');
    const response = await fetchImpl(url, { headers: { Accept: 'application/json, text/yaml' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    source = await response.text();
    await fs.mkdir(cacheDir, { recursive: true });
    await fs.writeFile(cachePath, source);
  } catch (error) {
    fetchError = error;
    source = await fs.readFile(cachePath, 'utf8').catch(() => undefined);
    if (source === undefined) {
      throw new Error(`Could not download OpenAPI spec "${url}": ${error.message}`);
    }
    console.warn(
      `Could not download OpenAPI spec "${url}" (${error.message}); using the cached copy.`,
    );
  }

  let spec;
  try {
    spec = parseYaml(source);
  } catch (error) {
    throw new Error(`Could not parse OpenAPI spec "${url}": ${error.message}`);
  }
  validateSpecDocument(spec, url);
  if (!fetchError) remoteCache.set(memoryKey, spec);
  return { spec, specPath: cachePath };
}

/**
 * Loads and indexes every configured spec. Returns the specs, all operations
 * (each carrying `spec`, `directory`, and `pageRef`), all schemas, and lookup
 * maps keyed by both the bare key ("GET /users") and the spec-qualified key
 * ("users.yaml GET /users"). Bare keys shared by several specs are recorded
 * in `ambiguous` and resolve to nothing, so pages must qualify them.
 */
export async function loadApiProject({ root, api, fetchImpl } = {}) {
  const sources = apiSpecSources(api);
  const directory = resolveApiDirectory(api);
  const multi = sources.length > 1;
  const specs = [];
  const operations = [];
  const schemas = [];

  for (const source of sources) {
    const loaded = isRemoteSpec(source)
      ? await loadRemoteSpec({ root, url: source, fetchImpl })
      : await loadOpenApiSpec({ root, specPath: source });
    const specDirectory = multi ? `${directory}/${specDirectorySlug(source)}` : directory;
    const ownOperations = normalizeOperations(loaded.spec, { specId: source }).map(operation => ({
      ...operation,
      directory: specDirectory,
      pageRef: `${specDirectory}/${operation.id}`,
    }));
    specs.push({
      id: source,
      spec: loaded.spec,
      specPath: loaded.specPath,
      remote: isRemoteSpec(source),
      directory: specDirectory,
      title: loaded.spec.info?.title,
    });
    operations.push(...ownOperations);
    schemas.push(...normalizeSchemas(loaded.spec, { specId: source }));
  }

  const operationsByKey = new Map();
  const schemasByKey = new Map();
  const ambiguous = new Set();
  const index = (map, key, value) => {
    if (map.has(key)) {
      ambiguous.add(key);
      map.set(key, undefined);
    } else if (!ambiguous.has(key)) {
      map.set(key, value);
    }
  };

  for (const operation of operations) {
    index(operationsByKey, operation.key, operation);
    operationsByKey.set(`${operation.spec} ${operation.key}`, operation);
  }
  for (const schema of schemas) {
    index(schemasByKey, schema.key, schema);
    schemasByKey.set(`${schema.spec} ${schema.key}`, schema);
  }

  return {
    specs,
    directory,
    multi,
    operations,
    schemas,
    operationsByKey,
    schemasByKey,
    ambiguous,
    specPaths: specs.filter(spec => !spec.remote).map(spec => spec.specPath),
  };
}

export {
  isAmbiguousOperation,
  isAmbiguousSchema,
  lookupOperation,
  lookupSchema,
} from './reference-page.mjs';

export { DEFAULT_API_DIRECTORY };
