import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { Ajv } from 'ajv';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import { getSchemaKeys, validateConfig } from '../packages/shiso/scripts/validate-config.mjs';
import { headingText, walkTree } from '../packages/shiso/src/lib/mdast.ts';
import { createSlugger } from '../packages/shiso/src/lib/slug.ts';

const root = path.resolve(import.meta.dirname, '..');
const contentRoot = path.join(root, 'content/docs');
const schema = JSON.parse(
  await readFile(path.join(root, 'packages/shiso/docs.schema.json'), 'utf8'),
);
const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter);

const FIELD_DOCUMENTATION = {
  $ref: 'configuration-references.mdx',
  $schema: 'project-settings.mdx',
  $shiso: 'project-settings.mdx',
  appearance: 'customization.mdx',
  background: 'customization.mdx',
  banner: 'navbar-and-footer.mdx',
  colors: 'customization.mdx',
  contextual: 'search-and-ai.mdx',
  description: 'site-details.mdx',
  errors: 'seo.mdx',
  favicon: 'site-details.mdx',
  fonts: 'customization.mdx',
  footer: 'navbar-and-footer.mdx',
  interaction: 'navigation.mdx',
  logo: 'site-details.mdx',
  metadata: 'seo.mdx',
  name: 'site-details.mdx',
  navbar: 'navbar-and-footer.mdx',
  navigation: 'navigation.mdx',
  redirects: 'seo.mdx',
  search: 'search-and-ai.mdx',
  seo: 'seo.mdx',
  styling: 'customization.mdx',
  theme: 'site-details.mdx',
};

const CONFIG_EXAMPLE_FILES = new Set([
  ...Object.values(FIELD_DOCUMENTATION),
  'configuration.mdx',
  'guides/migrating.mdx',
]);

async function documentationFiles(directory = contentRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? documentationFiles(target) : [target];
    }),
  );

  return files.flat().filter(file => file.endsWith('.mdx'));
}

function documentationRoute(file) {
  const relative = path
    .relative(contentRoot, file)
    .replace(/\\/g, '/')
    .replace(/\.mdx$/, '');
  const slug = relative.replace(/(^|\/)index$/, '').replace(/\/$/, '');
  return slug ? `/docs/${slug}` : '/docs';
}

function compileSubschema(valueSchema) {
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
  return ajv.compile({ ...valueSchema, definitions: schema.definitions });
}

function validateExample(value) {
  if (typeof value === 'string') {
    return compileSubschema(schema.definitions.pageItem)(value);
  }

  if (typeof value === 'number') {
    return compileSubschema(schema.definitions.numberValue)(value);
  }

  if (typeof value === 'boolean') {
    return compileSubschema(schema.definitions.booleanValue)(value);
  }

  if (Array.isArray(value)) {
    return compileSubschema(schema.definitions.pageItemList)(value);
  }

  if (!value || typeof value !== 'object') {
    return false;
  }

  const keys = Object.keys(value);
  const topLevelKeys = new Set(getSchemaKeys(schema));

  if (keys.some(key => topLevelKeys.has(key))) {
    const config =
      'navigation' in value || '$ref' in value
        ? value
        : { ...value, navigation: { pages: ['index'] } };
    return validateConfig(config, schema).valid;
  }

  for (const definition of ['pageObject', 'linkItem', 'group']) {
    if (compileSubschema(schema.definitions[definition])(value)) {
      return true;
    }
  }

  if (
    keys.some(key =>
      ['tabs', 'dropdowns', 'anchors', 'versions', 'languages', 'groups', 'pages'].includes(key),
    )
  ) {
    return compileSubschema(schema.properties.navigation)(value);
  }

  return false;
}

describe('public configuration documentation', () => {
  it('documents every top-level schema setting on its assigned page', async () => {
    expect(Object.keys(FIELD_DOCUMENTATION).sort()).toEqual(getSchemaKeys(schema).sort());

    for (const [field, relativeFile] of Object.entries(FIELD_DOCUMENTATION)) {
      const content = await readFile(path.join(contentRoot, relativeFile), 'utf8');
      expect(content, `${field} is not documented in ${relativeFile}`).toMatch(
        new RegExp(`[\\x60"]${field.replace('$', '\\$')}[\\x60"]`),
      );
    }
  });

  it('keeps every JSON configuration example valid', async () => {
    const failures = [];

    for (const relativeFile of CONFIG_EXAMPLE_FILES) {
      const source = await readFile(path.join(contentRoot, relativeFile), 'utf8');
      const tree = parser.parse(source);
      let example = 0;

      walkTree(tree, node => {
        if (node.type !== 'code' || node.lang !== 'json') {
          return;
        }

        example += 1;
        try {
          const value = JSON.parse(node.value);
          if (!validateExample(value)) {
            failures.push(
              `${relativeFile} JSON example ${example} does not match docs.schema.json`,
            );
          }
        } catch (error) {
          failures.push(`${relativeFile} JSON example ${example}: ${error.message}`);
        }
      });
    }

    expect(failures).toEqual([]);
  });
});

describe('documentation links', () => {
  it('resolves every internal docs route and heading anchor', async () => {
    const files = await documentationFiles();
    const pages = new Map();

    for (const file of files) {
      const tree = parser.parse(await readFile(file, 'utf8'));
      const slugger = createSlugger();
      const anchors = new Set();

      walkTree(tree, node => {
        if (node.type === 'heading') {
          anchors.add(slugger.slug(headingText(node)));
        }
      });
      pages.set(documentationRoute(file), anchors);
    }

    const failures = [];
    for (const file of files) {
      const source = await readFile(file, 'utf8');
      const links = [
        ...source.matchAll(/\]\((\/docs(?:\/[^)#\s]+)?)(?:#([^)\s]+))?\)/g),
        ...source.matchAll(/href=["'](\/docs(?:\/[^#"']+)?)(?:#([^"']+))?["']/g),
      ];

      for (const link of links) {
        const route = link[1].replace(/\/$/, '') || '/docs';
        const anchor = link[2];
        const anchors = pages.get(route);

        if (!anchors) {
          failures.push(`${path.relative(root, file)} links to missing page ${route}`);
        } else if (anchor && !anchors.has(anchor)) {
          failures.push(`${path.relative(root, file)} links to missing anchor ${route}#${anchor}`);
        }
      }
    }

    expect(failures).toEqual([]);
  });
});
