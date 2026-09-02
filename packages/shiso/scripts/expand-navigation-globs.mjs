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

function normalizePageReference(value) {
  return String(value || '')
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/^docs\//, '')
    .replace(/\.mdx?$/i, '')
    .replace(/\/+$/, '');
}

/** Collects manual page references without crossing a version/language scope boundary. */
function collectExplicitPages(value, pages = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) {
      if (typeof item === 'string') {
        pages.add(normalizePageReference(item));
      } else {
        collectExplicitPages(item, pages);
      }
    }
    return pages;
  }

  if (!value || typeof value !== 'object' || isGlobItem(value)) return pages;

  if (typeof value.page === 'string') pages.add(normalizePageReference(value.page));
  if (typeof value.root === 'string') pages.add(normalizePageReference(value.root));

  for (const key of ['pages', 'groups', 'tabs', 'dropdowns']) {
    if (Array.isArray(value[key])) collectExplicitPages(value[key], pages);
  }

  return pages;
}

function matches(candidate, pattern) {
  const target = /\.mdx?$/i.test(pattern) ? candidate.relativeFile : candidate.fileSlug;
  return globRegex(pattern).test(target);
}

async function expandGlob(item, candidates, projectRoot, explicitPages) {
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

  // Manual entries own their page's placement and presentation, regardless of
  // whether they appear before or after the glob that would otherwise include it.
  const discovered = matched.filter(candidate => !explicitPages.has(candidate.fileSlug));

  const entries = await Promise.all(
    discovered.map(async candidate => {
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

  async function expandObject(value, explicitPages) {
    if (Array.isArray(value)) {
      return Promise.all(value.map(item => expandObject(item, explicitPages)));
    }
    if (!value || typeof value !== 'object') return value;

    const entries = await Promise.all(
      Object.entries(value).map(async ([key, child]) => {
        if (key === 'pages' && Array.isArray(child)) {
          const expanded = [];
          for (const item of child) {
            if (isGlobItem(item)) {
              expanded.push(...(await expandGlob(item, candidates, projectRoot, explicitPages)));
            } else {
              expanded.push(await expandObject(item, explicitPages));
            }
          }
          return [key, expanded];
        }
        return [key, await expandObject(child, explicitPages)];
      }),
    );
    return Object.fromEntries(entries);
  }

  async function expandScope(scope) {
    return expandObject(scope, collectExplicitPages(scope));
  }

  async function expandNavigation(navigation) {
    if (Array.isArray(navigation.languages)) {
      const languages = await Promise.all(
        navigation.languages.map(async language => {
          if (!Array.isArray(language.versions)) return expandScope(language);
          return {
            ...language,
            versions: await Promise.all(language.versions.map(expandScope)),
          };
        }),
      );
      return { ...navigation, languages };
    }

    if (Array.isArray(navigation.versions)) {
      return {
        ...navigation,
        versions: await Promise.all(navigation.versions.map(expandScope)),
      };
    }

    return expandScope(navigation);
  }

  return { ...config, navigation: await expandNavigation(config.navigation) };
}
