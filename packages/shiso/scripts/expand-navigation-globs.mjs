/** Expands { glob } navigation entries into ordinary { page } entries. */
import fs from 'node:fs/promises';
import path from 'node:path';
import { parse as parseYaml } from 'yaml';

const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);
const GLOB_KEYS = new Set(['glob', 'exclude']);

async function listContentFiles(directory) {
  const files = [];
  let entries;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT') return files;
    throw error;
  }

  for (const entry of entries) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listContentFiles(item)));
    } else if (entry.isFile() && CONTENT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(item);
    }
  }

  return files;
}

function globPattern(value) {
  const pattern = String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/\/+$/, '');

  if (!pattern || pattern.startsWith('/') || pattern.split('/').includes('..')) {
    throw new Error(`Invalid navigation glob "${value}": use a relative path inside contentDir.`);
  }

  return pattern;
}

function globRegex(pattern) {
  let source = '^';

  for (let index = 0; index < pattern.length; index += 1) {
    const character = pattern[index];

    if (character === '*' && pattern[index + 1] === '*') {
      if (pattern[index + 2] === '/') {
        source += '(?:.*/)?';
        index += 2;
      } else {
        source += '.*';
        index += 1;
      }
    } else if (character === '*') {
      source += '[^/]*';
    } else if (character === '?') {
      source += '[^/]';
    } else {
      source += character.replace(/[|\\{}()[\]^$+?.]/g, '\\$&');
    }
  }

  return new RegExp(`${source}$`);
}

function navigationFrontmatter(source, sourcePath) {
  const block = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '';
  if (!block) return {};

  try {
    const values = parseYaml(block);
    return values && typeof values === 'object' && !Array.isArray(values) ? values : {};
  } catch (error) {
    throw new Error(`Could not parse frontmatter in "${sourcePath}": ${error.message}`);
  }
}

function isGlobItem(value) {
  return !!value && typeof value === 'object' && !Array.isArray(value) && 'glob' in value;
}

function assertGlobItem(item) {
  if (typeof item.glob !== 'string' || !item.glob.trim()) {
    throw new Error('Invalid navigation glob: "glob" must be a non-empty string.');
  }
  const unknown = Object.keys(item).filter(key => !GLOB_KEYS.has(key));
  if (unknown.length) {
    throw new Error(
      `Invalid navigation glob "${item.glob}": unknown ${unknown.length === 1 ? 'key' : 'keys'} ${unknown.map(key => `"${key}"`).join(', ')}.`,
    );
  }
  if (item.exclude !== undefined && !Array.isArray(item.exclude)) {
    throw new Error(`Invalid navigation glob "${item.glob}": "exclude" must be an array.`);
  }
  if (item.exclude?.some(pattern => typeof pattern !== 'string' || !pattern.trim())) {
    throw new Error(
      `Invalid navigation glob "${item.glob}": every "exclude" entry must be a non-empty string.`,
    );
  }
}

function pageCandidate(contentRoot, filePath) {
  const relativeFile = path.relative(contentRoot, filePath).replace(/\\/g, '/');
  const fileSlug = relativeFile.replace(/\.mdx?$/i, '');
  return { filePath, relativeFile, fileSlug };
}

function matches(candidate, pattern) {
  const target = /\.mdx?$/i.test(pattern) ? candidate.relativeFile : candidate.fileSlug;
  return globRegex(pattern).test(target);
}

async function expandGlob(item, candidates, projectRoot) {
  assertGlobItem(item);
  const pattern = globPattern(item.glob);
  const exclusions = (item.exclude || []).map(globPattern);
  const matched = candidates.filter(
    candidate =>
      matches(candidate, pattern) && !exclusions.some(exclusion => matches(candidate, exclusion)),
  );

  if (!matched.length) {
    throw new Error(`Navigation glob "${pattern}" matched no Markdown or MDX files.`);
  }

  const entries = await Promise.all(
    matched.map(async candidate => {
      const source = await fs.readFile(candidate.filePath, 'utf8');
      const sourcePath = path.relative(projectRoot, candidate.filePath).replace(/\\/g, '/');
      const frontmatter = navigationFrontmatter(source, sourcePath);
      const title =
        typeof frontmatter.sidebarTitle === 'string' && frontmatter.sidebarTitle
          ? frontmatter.sidebarTitle
          : typeof frontmatter.title === 'string' && frontmatter.title
            ? frontmatter.title
            : undefined;

      return {
        page: candidate.fileSlug,
        ...(title ? { title } : {}),
        ...(frontmatter.hidden === true ? { hidden: true } : {}),
        order: typeof frontmatter.order === 'number' ? frontmatter.order : Number.POSITIVE_INFINITY,
      };
    }),
  );

  entries.sort((left, right) => left.order - right.order || left.page.localeCompare(right.page));
  return entries.map(({ order: _order, ...entry }) => entry);
}

/** True when a navigation tree contains at least one { glob } page entry. */
export function hasNavigationGlobs(navigation) {
  if (Array.isArray(navigation)) return navigation.some(hasNavigationGlobs);
  if (!navigation || typeof navigation !== 'object') return false;
  if (isGlobItem(navigation)) return true;
  return Object.values(navigation).some(hasNavigationGlobs);
}

/** Returns a config copy whose navigation globs are ordinary page objects. */
export async function expandNavigationGlobs(config, { root, contentDir }) {
  if (!hasNavigationGlobs(config.navigation)) return config;

  const projectRoot = path.resolve(root);
  const contentRoot = path.resolve(projectRoot, contentDir);
  const files = await listContentFiles(contentRoot);
  const candidates = files.map(filePath => pageCandidate(contentRoot, filePath));
  const duplicateSlugs = candidates.filter(
    (candidate, index) =>
      candidates.findIndex(item => item.fileSlug === candidate.fileSlug) !== index,
  );

  if (duplicateSlugs.length) {
    throw new Error(
      `Navigation globs found both .md and .mdx for "${duplicateSlugs[0].fileSlug}" in ${contentDir}.`,
    );
  }

  async function expandObject(value) {
    if (Array.isArray(value)) return Promise.all(value.map(expandObject));
    if (!value || typeof value !== 'object') return value;

    const entries = await Promise.all(
      Object.entries(value).map(async ([key, child]) => {
        if (key === 'pages' && Array.isArray(child)) {
          const expanded = [];
          for (const item of child) {
            if (isGlobItem(item)) {
              expanded.push(...(await expandGlob(item, candidates, projectRoot)));
            } else {
              expanded.push(await expandObject(item));
            }
          }
          return [key, expanded];
        }
        return [key, await expandObject(child)];
      }),
    );
    return Object.fromEntries(entries);
  }

  return { ...config, navigation: await expandObject(config.navigation) };
}
