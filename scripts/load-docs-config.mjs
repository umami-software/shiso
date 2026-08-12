import fs from 'node:fs/promises';
import path from 'node:path';

/** Error raised while locating, reading, or parsing a Shiso configuration file. */
export class DocsConfigLoadError extends Error {
  constructor(message, { cause, code, sourcePath }) {
    super(message, { cause });
    this.name = 'DocsConfigLoadError';
    this.code = code;
    this.sourcePath = sourcePath;
  }
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

/**
 * Loads the project docs configuration.
 *
 * Returning its resolved source path now gives the later `$ref` resolver a
 * stable place from which to resolve relative references without changing
 * every build-time consumer again.
 */
export async function loadDocsConfig({ root = process.cwd(), configFile = 'docs.json' } = {}) {
  const projectRoot = path.resolve(root);
  const sourcePath = path.resolve(projectRoot, configFile);
  const config = await loadJsonDocument(sourcePath, 'Docs config');

  return { config, projectRoot, sourcePath };
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
