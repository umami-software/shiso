/**
 * Validates docs.json against docs.schema.json.
 *
 * The schema is the source of truth for the config format, and it declares
 * every key of the docs.json standard in one of three tiers:
 *
 *   supported  implemented, strictly validated
 *   reserved   part of the standard, accepted and ignored (loosely validated)
 *   unknown    not in the schema at all, rejected
 *
 * The point of the middle tier is forward compatibility: a config written for
 * the full standard must build here, using the subset Shiso implements, rather
 * than failing on the first feature we have not written yet.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Ajv } from 'ajv';

const root = path.resolve(import.meta.dirname, '..');

/** Collects `key -> "supported" | "reserved"` from a schema's properties. */
export function getKeyTiers(schema) {
  return Object.fromEntries(
    Object.entries(schema.properties || {}).map(([key, value]) => [
      key,
      value['x-shiso'] === 'reserved' ? 'reserved' : 'supported',
    ]),
  );
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

  // The tier annotation is metadata for this script, not a validation rule.
  // Registering it keeps Ajv's strict mode from rejecting the schema.
  ajv.addKeyword({ keyword: 'x-shiso', schemaType: 'string' });

  const validate = ajv.compile(schema);
  const tiers = getKeyTiers(schema);
  const knownKeys = Object.keys(tiers);

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

    return { valid: false, errors, notices: [] };
  }

  const notices = Object.keys(config)
    .filter(key => tiers[key] === 'reserved')
    .map(
      key =>
        `"${key}" is part of the docs.json standard but is not implemented yet — it will be ignored.`,
    );

  return { valid: true, errors: [], notices };
}

// CLI entry point. Skipped when imported by tests.
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const [schema, config] = await Promise.all([
    fs.readFile(path.join(root, 'docs.schema.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(root, 'docs.json'), 'utf8').then(JSON.parse),
  ]);

  const { valid, errors, notices } = validateConfig(config, schema);

  if (!valid) {
    console.error('docs.json failed schema validation:\n');
    for (const error of errors) {
      console.error(`  ${error}`);
    }
    process.exit(1);
  }

  for (const notice of notices) {
    console.warn(`  notice: ${notice}`);
  }

  console.log('docs.json is valid.');
}
