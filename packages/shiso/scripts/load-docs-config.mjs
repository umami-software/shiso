import fs from 'node:fs/promises';
import path from 'node:path';
import { expandNavigationGlobs, hasNavigationGlobs } from './expand-navigation-globs.mjs';
import { expandOpenApiNavigation, hasOpenApiItems } from './expand-openapi-navigation.mjs';
import { generateOpenApiStubs } from './lib/openapi.mjs';
import { loadApiProject } from './lib/openapi-project.mjs';
import { loadShisoConfig } from './load-shiso-config.mjs';

/** Error raised while locating, reading, or parsing a Shiso configuration file. */
export class DocsConfigLoadError extends Error {
  constructor(message, { cause, code, sourcePath }) {
    super(message, { cause });
    this.name = 'DocsConfigLoadError';
    this.code = code;
    this.sourcePath = sourcePath;
  }
}

function isObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function isInsideRoot(projectRoot, candidate) {
  const relative = path.relative(projectRoot, candidate);
  return (
    relative === '' ||
    (!path.isAbsolute(relative) && !relative.startsWith(`..${path.sep}`) && relative !== '..')
  );
}

function parseLocation(source, error) {
  const reported = error.message.match(/line\s+(\d+)(?:\s+column\s+(\d+))?/i);

  if (reported) {
    return ` at line ${reported[1]}${reported[2] ? `, column ${reported[2]}` : ''}`;
  }

  const position = error.message.match(/position\s+(\d+)/i)?.[1];
  const unexpectedToken = error.message.match(/Unexpected token '([^']+)'/i)?.[1];
  const parsedOffset = position === undefined ? -1 : Number(position);
  const offset = parsedOffset >= 0 ? parsedOffset : source.indexOf(unexpectedToken || '');

  if (offset < 0 || (!position && !unexpectedToken)) {
    return '';
  }

  const before = source.slice(0, offset);
  const line = before.split('\n').length;
  const lastNewline = before.lastIndexOf('\n');
  const column = offset - lastNewline;

  return ` at line ${line}, column ${column}`;
}

/** Reads a JSON document while preserving its source path in every error. */
export async function loadJsonDocument(sourcePath, label = 'JSON document') {
  const resolvedPath = path.resolve(sourcePath);
  let source;

  try {
    source = await fs.readFile(resolvedPath, 'utf8');
  } catch (error) {
    const reason =
      error.code === 'ENOENT' ? 'does not exist' : `could not be read: ${error.message}`;

    throw new DocsConfigLoadError(`${label} "${resolvedPath}" ${reason}.`, {
      cause: error,
      code: error.code === 'ENOENT' ? 'NOT_FOUND' : 'READ_FAILED',
      sourcePath: resolvedPath,
    });
  }

  try {
    return JSON.parse(source);
  } catch (error) {
    throw new DocsConfigLoadError(
      `${label} "${resolvedPath}" contains invalid JSON${parseLocation(source, error)}: ${error.message}`,
      {
        cause: error,
        code: 'INVALID_JSON',
        sourcePath: resolvedPath,
      },
    );
  }
}

function referenceError(message, { code, sourcePath }) {
  return new DocsConfigLoadError(message, { code, sourcePath });
}

/** Resolves every `$ref` in one project configuration tree. */
async function resolveConfigReferences(entryPath, projectRoot) {
  const lexicalRoot = path.resolve(projectRoot);
  const canonicalRoot = await fs.realpath(projectRoot);
  const sourcePaths = new Set();
  const cache = new Map();

  async function canonicalDocumentPath(sourcePath, referringPath) {
    const resolvedPath = path.resolve(sourcePath);

    if (!isInsideRoot(lexicalRoot, resolvedPath) && !isInsideRoot(canonicalRoot, resolvedPath)) {
      throw referenceError(
        `Config reference "${resolvedPath}" from "${referringPath}" leaves the project root "${canonicalRoot}".`,
        { code: 'REF_OUTSIDE_ROOT', sourcePath: resolvedPath },
      );
    }

    let canonicalPath;

    try {
      canonicalPath = await fs.realpath(resolvedPath);
    } catch (error) {
      const reason =
        error.code === 'ENOENT' ? 'does not exist' : `could not be resolved: ${error.message}`;

      throw new DocsConfigLoadError(`Referenced config "${resolvedPath}" ${reason}.`, {
        cause: error,
        code: error.code === 'ENOENT' ? 'NOT_FOUND' : 'READ_FAILED',
        sourcePath: resolvedPath,
      });
    }

    if (!isInsideRoot(canonicalRoot, canonicalPath)) {
      throw referenceError(
        `Config reference "${resolvedPath}" from "${referringPath}" resolves outside the project root.`,
        { code: 'REF_OUTSIDE_ROOT', sourcePath: resolvedPath },
      );
    }

    return canonicalPath;
  }

  async function resolveDocument(sourcePath, stack = []) {
    const referringPath = stack.at(-1) || entryPath;
    const canonicalPath = await canonicalDocumentPath(sourcePath, referringPath);

    if (stack.includes(canonicalPath)) {
      const cycle = [...stack.slice(stack.indexOf(canonicalPath)), canonicalPath]
        .map(item => path.relative(projectRoot, item) || path.basename(item))
        .join(' -> ');

      throw referenceError(`Circular config reference detected: ${cycle}.`, {
        code: 'CIRCULAR_REF',
        sourcePath: canonicalPath,
      });
    }

    if (cache.has(canonicalPath)) {
      return cache.get(canonicalPath);
    }

    sourcePaths.add(canonicalPath);
    const document = await loadJsonDocument(canonicalPath, 'Referenced config');
    const resolved = await resolveValue(document, canonicalPath, [...stack, canonicalPath]);
    cache.set(canonicalPath, resolved);
    return resolved;
  }

  async function resolveReference(reference, sourcePath, stack) {
    if (typeof reference !== 'string' || !reference.trim()) {
      throw referenceError(`Config $ref in "${sourcePath}" must be a non-empty string.`, {
        code: 'INVALID_REF',
        sourcePath,
      });
    }

    if (path.isAbsolute(reference) || /^[a-z][a-z0-9+.-]*:/i.test(reference)) {
      throw referenceError(
        `Config $ref "${reference}" in "${sourcePath}" must be a relative JSON file path.`,
        { code: 'INVALID_REF', sourcePath },
      );
    }

    if (path.extname(reference).toLowerCase() !== '.json') {
      throw referenceError(`Config $ref "${reference}" in "${sourcePath}" must end in .json.`, {
        code: 'INVALID_REF',
        sourcePath,
      });
    }

    return resolveDocument(path.resolve(path.dirname(sourcePath), reference), stack);
  }

  async function resolveValue(value, sourcePath, stack) {
    if (Array.isArray(value)) {
      return Promise.all(value.map(item => resolveValue(item, sourcePath, stack)));
    }

    if (!isObject(value)) {
      return value;
    }

    if ('$ref' in value) {
      const referenced = await resolveReference(value.$ref, sourcePath, stack);

      // Object targets receive shallow sibling overrides. For arrays and
      // primitives, the reference replaces the whole object and siblings are
      // intentionally ignored.
      if (!isObject(referenced)) {
        return referenced;
      }

      const siblings = Object.fromEntries(Object.entries(value).filter(([key]) => key !== '$ref'));
      const resolvedSiblings = await resolveValue(siblings, sourcePath, stack);
      return { ...referenced, ...resolvedSiblings };
    }

    const entries = await Promise.all(
      Object.entries(value).map(async ([key, item]) => [
        key,
        await resolveValue(item, sourcePath, stack),
      ]),
    );
    return Object.fromEntries(entries);
  }

  const config = await resolveDocument(entryPath);
  return { config, projectRoot: canonicalRoot, sourcePaths: [...sourcePaths] };
}

/**
 * Loads the project docs configuration.
 *
 * Returning its resolved source path now gives the later `$ref` resolver a
 * stable place from which to resolve relative references without changing
 * every build-time consumer again.
 */
export async function loadDocsConfig({
  root = process.cwd(),
  configFile = 'docs.json',
  expandGlobs = true,
  shiso,
} = {}) {
  const requestedRoot = path.resolve(root);
  const requestedSourcePath = path.resolve(requestedRoot, configFile);
  const {
    config: sourceConfig,
    projectRoot,
    sourcePaths,
  } = await resolveConfigReferences(requestedSourcePath, requestedRoot);
  const sourcePath = sourcePaths[0] || requestedSourcePath;
  const hasGlobs = hasNavigationGlobs(sourceConfig.navigation);
  const shisoConfig = expandGlobs
    ? (shiso ?? (await loadShisoConfig({ root: projectRoot })).config)
    : undefined;
  let working = sourceConfig;
  let apiProject;

  // OpenAPI expansion runs before glob expansion so generated stub pages are
  // visible to navigation globs and every downstream consumer.
  if (expandGlobs && working.api?.spec) {
    const project = await loadApiProject({ root: projectRoot, api: working.api });
    apiProject = project;

    await generateOpenApiStubs({
      root: projectRoot,
      contentDir: shisoConfig.contentDir,
      directory: project.directory,
      operations: project.operations,
      prefixSpec: project.multi,
    });
    working = expandOpenApiNavigation(working, {
      operations: project.operations,
      directory: project.directory,
      specs: project.specs,
    });
  } else if (expandGlobs && hasOpenApiItems(working.navigation)) {
    throw new Error(
      'Navigation contains an { "openapi" } entry but docs.json has no "api.spec" setting.',
    );
  }

  const config = expandGlobs
    ? await expandNavigationGlobs(working, {
        root: projectRoot,
        contentDir: shisoConfig.contentDir,
      })
    : working;
  const specPaths = apiProject?.specPaths || [];

  return {
    config,
    projectRoot,
    sourcePath,
    sourcePaths,
    hasGlobs,
    apiProject,
    specPaths,
    /** @deprecated use specPaths */
    specPath: specPaths[0],
  };
}

export async function loadDocsSchema({
  root = process.cwd(),
  schemaFile = 'docs.schema.json',
} = {}) {
  const projectRoot = path.resolve(root);
  const sourcePath = path.resolve(projectRoot, schemaFile);
  const schema = await loadJsonDocument(sourcePath, 'Docs schema');

  return { projectRoot, schema, sourcePath };
}
