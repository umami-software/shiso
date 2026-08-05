/**
 * Validates docs.json against docs.schema.json.
 *
 * The schema is the source of truth for the config format. Runtime code
 * (src/lib/docs-config.ts) must accept everything the schema allows, and the
 * schema must describe everything the runtime supports. This check runs as
 * part of the build so drift between the two fails fast.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { Ajv } from 'ajv';

const root = path.resolve(import.meta.dirname, '..');

const [schema, config] = await Promise.all([
  fs.readFile(path.join(root, 'docs.schema.json'), 'utf8').then(JSON.parse),
  fs.readFile(path.join(root, 'docs.json'), 'utf8').then(JSON.parse),
]);

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const validate = ajv.compile(schema);

if (!validate(config)) {
  console.error('docs.json failed schema validation:\n');
  for (const error of validate.errors ?? []) {
    console.error(`  ${error.instancePath || '(root)'} ${error.message}`);
  }
  process.exit(1);
}

console.log('docs.json is valid.');
