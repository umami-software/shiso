import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createJiti } from 'jiti';

/**
 * Loads the optional project code config (shiso.config.ts/.mjs/.js).
 *
 * docs.json stays declarative data; this file holds engine settings that may
 * grow programmatic forms later (env logic, plugins). The user's file is
 * evaluated with jiti so TypeScript works without Node type stripping; this
 * loader itself stays plain JS per the scripts constraint.
 */

/** Candidate filenames in precedence order. Exactly one may exist. */
export const SHISO_CONFIG_FILES = ['shiso.config.ts', 'shiso.config.mjs', 'shiso.config.js'];

const KNOWN_KEYS = ['docsPrefix', 'contentDir', 'siteUrl', 'locale'];

let importGeneration = 0;

/** Error raised while locating, evaluating, or validating shiso.config. */
export class ShisoConfigLoadError extends Error {
  constructor(message, { cause, code, sourcePath } = {}) {
    super(message, { cause });
    this.name = 'ShisoConfigLoadError';
    this.code = code;
    this.sourcePath = sourcePath;
  }
}

function isPlainObject(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

/** Strips trailing slashes; "/" and "" both normalize to "". */
function normalizePrefix(value) {
  const trimmed = value.trim().replace(/\/+$/, '');

  if (!trimmed || trimmed === '/') {
    return '';
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}

function assertStringOption(raw, key, sourcePath) {
  if (raw[key] !== undefined && typeof raw[key] !== 'string') {
    throw new ShisoConfigLoadError(
      `Shiso config option "${key}" must be a string, received ${Array.isArray(raw[key]) ? 'array' : typeof raw[key]}.`,
      { code: 'INVALID_OPTION', sourcePath },
    );
  }
}

/**
 * Applies defaults and normalization. Single source of truth for resolved
 * values, so runtime and build-time consumers never re-implement defaulting.
 */
export function resolveShisoConfig(raw = {}, sourcePath = null) {
  for (const key of KNOWN_KEYS) {
    assertStringOption(raw, key, sourcePath);
  }

  return {
    docsPrefix: normalizePrefix(raw.docsPrefix ?? '/docs'),
    contentDir: (raw.contentDir ?? 'content/docs').trim().replace(/^\/+|\/+$/g, ''),
    siteUrl: raw.siteUrl?.trim().replace(/\/+$/, '') || undefined,
    locale: raw.locale?.trim() || 'en-US',
  };
}

async function findConfigFiles(projectRoot) {
  const found = [];

  for (const name of SHISO_CONFIG_FILES) {
    const candidate = path.resolve(projectRoot, name);

    try {
      const stats = await fs.stat(candidate);

      if (stats.isFile()) {
        found.push(candidate);
      }
    } catch {
      // Missing candidate; the config file is optional.
    }
  }

  return found;
}

/**
 * Loads and resolves the project shiso config.
 *
 * Absent file yields resolved defaults with a null sourcePath, keeping
 * zero-config projects zero-config.
 */
export async function loadShisoConfig({ root = process.cwd() } = {}) {
  const projectRoot = path.resolve(root);
  const found = await findConfigFiles(projectRoot);

  if (found.length > 1) {
    throw new ShisoConfigLoadError(
      `Multiple shiso config files found in "${projectRoot}": ${found.map(item => path.basename(item)).join(', ')}. Keep exactly one.`,
      { code: 'MULTIPLE_CONFIGS', sourcePath: found[0] },
    );
  }

  if (found.length === 0) {
    return { config: resolveShisoConfig(), raw: {}, projectRoot, sourcePath: null, sourcePaths: [] };
  }

  const sourcePath = found[0];
  let raw;

  try {
    if (!sourcePath.endsWith('.mjs')) {
      // .ts and .js go through jiti, which transpiles TypeScript and handles
      // ESM syntax in .js files regardless of the project's package type.
      // No module or filesystem cache: nothing is written into (possibly
      // missing) node_modules, and dev-server hot updates re-evaluate a fresh
      // copy of the transpiled file.
      const jiti = createJiti(import.meta.url, {
        interopDefault: true,
        moduleCache: false,
        fsCache: false,
      });
      raw = await jiti.import(pathToFileURL(sourcePath).href, { default: true });
    } else {
      // Plain .mjs goes through Node's own loader; the unique cache-busting
      // query defeats the permanent ESM module registry so edits are picked up.
      importGeneration += 1;
      raw = (await import(`${pathToFileURL(sourcePath).href}?v=${importGeneration}.${Date.now()}`))
        .default;
    }
  } catch (error) {
    throw new ShisoConfigLoadError(
      `Shiso config "${sourcePath}" failed to load: ${error.message}`,
      { cause: error, code: 'LOAD_FAILED', sourcePath },
    );
  }

  if (!isPlainObject(raw)) {
    throw new ShisoConfigLoadError(
      `Shiso config "${sourcePath}" must default-export a plain object.`,
      { code: 'INVALID_CONFIG', sourcePath },
    );
  }

  const unknownKeys = Object.keys(raw).filter(key => !KNOWN_KEYS.includes(key));

  if (unknownKeys.length > 0) {
    throw new ShisoConfigLoadError(
      `Shiso config "${sourcePath}" has unknown ${unknownKeys.length === 1 ? 'key' : 'keys'} ${unknownKeys.map(key => `"${key}"`).join(', ')}. Supported keys: ${KNOWN_KEYS.join(', ')}.`,
      { code: 'UNKNOWN_OPTION', sourcePath },
    );
  }

  return {
    config: resolveShisoConfig(raw, sourcePath),
    raw,
    projectRoot,
    sourcePath,
    sourcePaths: [sourcePath],
  };
}
