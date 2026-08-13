/**
 * Validates docs.json against docs.schema.json.
 *
 * The schema is the source of truth for the public config format. Documented
 * settings are strictly validated and every other key is rejected.
 */
import path from 'node:path';
import process from 'node:process';
import { Ajv } from 'ajv';
import { loadDocsConfig, loadDocsSchema } from './load-docs-config.mjs';

const packageRoot = path.resolve(import.meta.dirname, '..');

/** Returns the top-level keys declared by the public config schema. */
export function getSchemaKeys(schema) {
  return Object.keys(schema.properties || {});
}

function levenshtein(a, b) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);

  for (let j = 1; j <= b.length; j++) {
    rows[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
    }
  }

  return rows[a.length][b.length];
}

/** Nearest known key, when it is close enough that a typo is the likely cause. */
export function suggestKey(unknownKey, knownKeys) {
  let best = null;
  let bestDistance = Infinity;

  for (const key of knownKeys) {
    const distance = levenshtein(unknownKey.toLowerCase(), key.toLowerCase());

    if (distance < bestDistance) {
      best = key;
      bestDistance = distance;
    }
  }

  const threshold = Math.max(2, Math.floor(unknownKey.length / 3));

  return bestDistance <= threshold ? best : null;
}

export function validateConfig(config, schema) {
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });

  const validate = ajv.compile(schema);
  const knownKeys = getSchemaKeys(schema);

  if (!validate(config)) {
    const errors = (validate.errors ?? []).map(error => {
      const location = error.instancePath || '(root)';
      const extra = error.params?.additionalProperty;

      if (extra) {
        const suggestion = !error.instancePath && suggestKey(extra, knownKeys);

        return `${location} has unknown key "${extra}"${suggestion ? ` — did you mean "${suggestion}"?` : ''}`;
      }

      return `${location} ${error.message}`;
    });

    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

/** Validates one consuming project against the schema bundled with this Shiso version. */
export async function validateProject({ root = process.cwd() } = {}) {
  const [{ schema }, { config }] = await Promise.all([
    loadDocsSchema({ root: packageRoot }),
    loadDocsConfig({ root }),
  ]);

  return validateConfig(config, schema);
}

// CLI entry point. Skipped when imported by tests.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const { valid, errors } = await validateProject();

  if (!valid) {
    console.error('docs.json failed schema validation:\n');
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    process.exit(1);
  }

  console.log('docs.json is valid.');
}
