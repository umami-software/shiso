import fs from 'node:fs/promises';
import path from 'node:path';
import type { MintlifyDocsConfig, ShisoConfig } from '@/lib/types';

const DEFAULT_DOCS_CONFIG_PATH = 'docs.json';

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value);
}

function assertMintlifyDocsConfig(
  value: unknown,
  filePath: string,
): asserts value is MintlifyDocsConfig {
  if (!isRecord(value)) {
    throw new Error(`Invalid docs config at "${filePath}": expected a JSON object.`);
  }

  // Common mistake: using the Mintlify JSON schema document itself, not a project docs.json config.
  if ('anyOf' in value && 'definitions' in value && !('navigation' in value)) {
    throw new Error(
      `Invalid docs config at "${filePath}": this looks like the Mintlify schema, not a project docs.json file.`,
    );
  }

  if (!isRecord(value.navigation)) {
    throw new Error(`Invalid docs config at "${filePath}": missing "navigation" object.`);
  }
}

export async function loadDocsConfig(config: ShisoConfig): Promise<MintlifyDocsConfig> {
  const configPath = path.resolve(config.docsConfigPath || DEFAULT_DOCS_CONFIG_PATH);
  const raw = await fs.readFile(configPath, 'utf8');

  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(
      `Invalid docs config at "${configPath}": failed to parse JSON. ${
        error instanceof Error ? error.message : ''
      }`.trim(),
    );
  }

  assertMintlifyDocsConfig(parsed, configPath);

  return parsed;
}

