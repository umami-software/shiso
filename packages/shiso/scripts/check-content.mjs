/**
 * Validates the content graph behind docs.json.
 *
 * Schema validation proves the configuration has the right shape; this pass
 * proves that its page references, routes, links, anchors, and local assets
 * describe a site that can actually be navigated.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { loadDocsNavigation } from './lib/docs-navigation.mjs';
import { headingText } from './lib/mdast.mjs';
import { loadApiProject } from './lib/openapi-project.mjs';
import { interpretReferencePage, readReferenceFrontmatter } from './lib/reference-page.mjs';
import { createSlugger } from './lib/slug.mjs';
import { loadDocsConfig } from './load-docs-config.mjs';
import { loadShisoConfig } from './load-shiso-config.mjs';

const MARKDOWN_EXTENSIONS = new Set(['.md', '.mdx']);
const parser = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkGfm);

function normalizeRoute(value) {
  const route = String(value || '/')
    .replace(/\\/g, '/')
    .replace(/\/{2,}/g, '/');
  const withoutIndex = route === '/index' ? '/' : route.replace(/\/index$/, '') || '/';
  return withoutIndex.length > 1 ? withoutIndex.replace(/\/+$/, '') : withoutIndex;
}

async function exists(filePath) {
  try {
    return (await fs.stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function listFiles(directory) {
  const files = [];
  let entries;

  try {
    entries = await fs.readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }

  for (const entry of entries) {
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listFiles(item)));
    } else if (entry.isFile()) {
      files.push(item);
    }
  }

  return files;
}

async function resolveFile(root, directory, slug, extensions) {
  for (const extension of extensions) {
    const candidate = path.resolve(root, directory, `${slug}${extension}`);
    if (await exists(candidate)) return candidate;
  }
  return null;
}

function walk(node, visitor) {
  visitor(node);
  for (const child of node.children || []) walk(child, visitor);
}

function literalAttribute(node, name) {
  const attribute = (node.attributes || []).find(item => item?.name === name);
  return typeof attribute?.value === 'string' ? attribute.value : null;
}

function inspectMarkdown(source, filePath) {
  const tree = parser.parse(source);
  const slugger = createSlugger();
  const anchors = new Set();
  const targets = [];

  walk(tree, node => {
    if (node.type === 'heading') anchors.add(slugger.slug(headingText(node)));

    if (node.type === 'link' && typeof node.url === 'string') {
      targets.push({ kind: 'link', value: node.url, line: node.position?.start.line || 1 });
    } else if (node.type === 'image' && typeof node.url === 'string') {
      targets.push({ kind: 'asset', value: node.url, line: node.position?.start.line || 1 });
    } else if (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') {
      const href = literalAttribute(node, 'href');
      const src = literalAttribute(node, 'src');
      if (href) targets.push({ kind: 'link', value: href, line: node.position?.start.line || 1 });
      if (src) targets.push({ kind: 'asset', value: src, line: node.position?.start.line || 1 });
    }
  });

  const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] || '';
  return {
    filePath,
    anchors,
    targets,
    title: /^title\s*:/m.test(frontmatter),
    description: /^description\s*:/m.test(frontmatter),
    frontmatter: readReferenceFrontmatter(source),
  };
}

function diagnostic(relativePath, line, message) {
  return `${relativePath.replace(/\\/g, '/')}:${line} ${message}`;
}

function splitTarget(raw) {
  const value = raw.trim();
  const hashIndex = value.indexOf('#');
  const beforeHash = hashIndex >= 0 ? value.slice(0, hashIndex) : value;
  return {
    pathname: beforeHash.split('?')[0],
    fragment: hashIndex >= 0 ? value.slice(hashIndex + 1) : '',
  };
}

function isExternal(value) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value);
}

function resolveLinkRoute(rawPath, currentRoute) {
  if (!rawPath) return currentRoute;
  const value = rawPath.replace(/\.mdx?$/i, '');
  if (value.startsWith('/')) return normalizeRoute(value);
  return normalizeRoute(new URL(value, `https://shiso.invalid${currentRoute}`).pathname);
}

/** Returns content errors and non-fatal authoring warnings for one project. */
export async function checkContent({ root = process.cwd(), config, shiso } = {}) {
  const projectRoot = path.resolve(root);
  const docsConfig = config ?? (await loadDocsConfig({ root: projectRoot })).config;
  const engine = shiso ?? (await loadShisoConfig({ root: projectRoot })).config;
  const errors = [];
  const warnings = [];
  const routes = new Map();
  const pages = [];
  const referencedFiles = new Set();

  let navigation;
  try {
    navigation = loadDocsNavigation({ root: projectRoot, config: docsConfig, shiso: engine });
  } catch (error) {
    return { valid: false, errors: [error.message], warnings };
  }

  for (const { fileSlug, filePath, url } of navigation.site.pages) {
    if (navigation.missingPages.has(fileSlug)) {
      errors.push(
        `docs.json references missing page "${fileSlug}" (expected ${engine.contentDir}/${fileSlug}.mdx or .md).`,
      );
      continue;
    }
    routes.set(url, filePath);
    referencedFiles.add(filePath);
    pages.push({ route: url, filePath });
  }

  for (const item of docsConfig.pages || []) {
    const route = normalizeRoute(item?.path);
    const slug =
      String(item?.page || 'index')
        .trim()
        .replace(/\\/g, '/')
        .replace(/^\/+|\/+$/g, '')
        .replace(/^pages\//, '')
        .replace(/\.(?:mdx?|tsx)$/i, '') || 'index';
    const filePath = await resolveFile(projectRoot, 'content/pages', slug, ['.tsx', '.mdx', '.md']);

    if (!filePath) {
      errors.push(
        `docs.json references missing standalone page "${slug}" (expected content/pages/${slug}.tsx, .mdx, or .md).`,
      );
      continue;
    }
    if (routes.has(route)) {
      errors.push(
        `Standalone route "${route}" collides with "${path.relative(projectRoot, routes.get(route))}".`,
      );
      continue;
    }
    routes.set(route, filePath);
    referencedFiles.add(filePath);
    if (MARKDOWN_EXTENSIONS.has(path.extname(filePath))) pages.push({ route, filePath });
  }

  // Generated OpenAPI sections render at runtime, so their anchors come from
  // the spec rather than from markdown headings.
  const project = docsConfig.api?.spec
    ? await loadApiProject({ root: projectRoot, api: docsConfig.api })
    : undefined;

  const documents = new Map();
  for (const page of pages) {
    const source = await fs.readFile(page.filePath, 'utf8');
    const document = inspectMarkdown(source, page.filePath);
    const relative = path.relative(projectRoot, page.filePath).replace(/\\/g, '/');
    const reference = interpretReferencePage(document.frontmatter, project, {
      playground: docsConfig.api?.playground,
    });
    for (const section of reference.sections) document.anchors.add(section.id);
    for (const { field, value, ambiguous } of reference.issues) {
      const binding = `${relative} binds "${field}: ${value}", which`;
      if (ambiguous) {
        errors.push(
          field === 'openapi'
            ? `${binding} several specs define; prefix it with the spec, e.g. "openapi: ${project.specs[0].id} ${value}".`
            : `${binding} several specs define; prefix it with the spec.`,
        );
      } else {
        const kind = field === 'openapi' ? 'operation' : 'schema';
        errors.push(
          `${binding} matches no ${kind} in ${project ? 'the API spec' : 'an API spec (docs.json has no api.spec)'}.`,
        );
      }
    }
    documents.set(page.filePath, document);
    if (!document.title) warnings.push(`${relative} has no frontmatter title.`);
    if (!document.description) warnings.push(`${relative} has no frontmatter description.`);
  }

  const publicRoot = path.resolve(projectRoot, 'public');
  for (const page of pages) {
    const document = documents.get(page.filePath);
    const relative = path.relative(projectRoot, page.filePath);

    for (const target of document.targets) {
      if (!target.value || isExternal(target.value)) continue;
      const { pathname, fragment } = splitTarget(target.value);

      if (target.kind === 'asset') {
        const assetPath = pathname.startsWith('/')
          ? path.resolve(publicRoot, pathname.replace(/^\/+/, ''))
          : path.resolve(path.dirname(page.filePath), pathname);
        if (!(await exists(assetPath))) {
          errors.push(
            diagnostic(relative, target.line, `references missing asset "${target.value}".`),
          );
        }
        continue;
      }

      const targetRoute = resolveLinkRoute(pathname, page.route);
      const targetFile = routes.get(targetRoute);

      if (!targetFile && pathname && /\.[a-z\d]+$/i.test(pathname) && !/\.mdx?$/i.test(pathname)) {
        const publicFile = pathname.startsWith('/')
          ? path.resolve(publicRoot, pathname.replace(/^\/+/, ''))
          : path.resolve(path.dirname(page.filePath), pathname);
        if (await exists(publicFile)) continue;
      }

      if (!targetFile) {
        errors.push(diagnostic(relative, target.line, `links to unknown route "${target.value}".`));
        continue;
      }

      if (fragment && MARKDOWN_EXTENSIONS.has(path.extname(targetFile))) {
        const targetDocument = documents.get(targetFile);
        let decoded = fragment;
        try {
          decoded = decodeURIComponent(fragment);
        } catch {
          // Report the original fragment below.
        }
        if (targetDocument && !targetDocument.anchors.has(decoded)) {
          errors.push(
            diagnostic(
              relative,
              target.line,
              `links to missing anchor "#${fragment}" on "${targetRoute}".`,
            ),
          );
        }
      }
    }
  }

  for (const redirect of docsConfig.redirects || []) {
    if (
      !isExternal(redirect.destination) &&
      !routes.has(normalizeRoute(splitTarget(redirect.destination).pathname))
    ) {
      errors.push(
        `Redirect "${redirect.source}" points to unknown route "${redirect.destination}".`,
      );
    }
  }

  const docsRoot = path.resolve(projectRoot, engine.contentDir);
  for (const filePath of await listFiles(docsRoot)) {
    if (MARKDOWN_EXTENSIONS.has(path.extname(filePath)) && !referencedFiles.has(filePath)) {
      warnings.push(
        `${path.relative(projectRoot, filePath).replace(/\\/g, '/')} is not referenced by navigation.`,
      );
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
