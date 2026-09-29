import path from 'node:path';
import { loadDocsConfig } from './load-docs-config.mjs';
import { loadShisoConfig, SHISO_CONFIG_FILES } from './load-shiso-config.mjs';

export const VIRTUAL_DOCS_CONFIG_ID = 'virtual:shiso-docs-config';
export const VIRTUAL_SHISO_CONFIG_ID = 'virtual:shiso-config';
const RESOLVED_DOCS_CONFIG_ID = `\0${VIRTUAL_DOCS_CONFIG_ID}`;
const RESOLVED_SHISO_CONFIG_ID = `\0${VIRTUAL_SHISO_CONFIG_ID}`;

function renderConfigModule(config) {
  return `export default ${JSON.stringify(config)};`;
}

function renderShisoConfigModule(config) {
  // Compiler plugins are functions used by vite.config.ts and cannot be
  // serialized into the virtual module consumed by the browser runtime.
  const { mdx: _mdx, ...runtimeConfig } = config;
  return renderConfigModule(runtimeConfig);
}

/**
 * Creates the single config state shared by a Vite build and application
 * modules. Two virtual modules keep Node-only file loading out of the browser
 * bundle: `virtual:shiso-docs-config` carries docs.json (with `$ref`s
 * resolved) and `virtual:shiso-config` carries the resolved shiso.config.*
 * options with defaults already applied.
 */
export async function createDocsConfigModule({
  root = process.cwd(),
  configFile = 'docs.json',
} = {}) {
  const options = { root, configFile };
  let loaded = await loadDocsConfig(options);
  let loadedShiso = await loadShisoConfig({ root });
  // Candidate names are matched in handleHotUpdate (the dev watcher already
  // covers the project root), so creating shiso.config.ts is picked up live.
  // Only existing files may go through addWatchFile: Vite's dev import
  // analysis re-resolves watched files from a load hook and errors on paths
  // that do not exist.
  const shisoCandidatePaths = SHISO_CONFIG_FILES.map(name => path.resolve(root, name));

  return {
    getConfig: () => loaded.config,
    getShisoConfig: () => loadedShiso.config,
    getSpecPath: () => loaded.specPath,
    getSpecPaths: () => loaded.specPaths || [],
    getSourcePaths: () => [...loaded.sourcePaths, ...loadedShiso.sourcePaths],
    sourcePath: loaded.sourcePath,
    shisoSourcePath: loadedShiso.sourcePath,
    plugin: {
      name: 'shiso-docs-config',
      enforce: 'pre',
      resolveId(id) {
        if (id === VIRTUAL_DOCS_CONFIG_ID) {
          return RESOLVED_DOCS_CONFIG_ID;
        }

        if (id === VIRTUAL_SHISO_CONFIG_ID) {
          return RESOLVED_SHISO_CONFIG_ID;
        }

        return undefined;
      },
      load(id) {
        if (id === RESOLVED_DOCS_CONFIG_ID) {
          for (const sourcePath of loaded.sourcePaths) {
            this.addWatchFile(sourcePath);
          }
          return renderConfigModule(loaded.config);
        }

        if (id === RESOLVED_SHISO_CONFIG_ID) {
          for (const sourcePath of loadedShiso.sourcePaths) {
            this.addWatchFile(sourcePath);
          }
          return renderShisoConfigModule(loadedShiso.config);
        }

        return undefined;
      },
      async handleHotUpdate(context) {
        const changedPath = path.resolve(context.file);
        const isDocsSource =
          loaded.sourcePaths.includes(changedPath) || changedPath === loaded.specPath;
        const isShisoSource = shisoCandidatePaths.includes(changedPath);
        const contentRoot = path.resolve(root, loadedShiso.config.contentDir);
        const relativeContentPath = path.relative(contentRoot, changedPath);
        const isGlobContent =
          loaded.hasGlobs &&
          /\.(?:md|mdx)$/.test(changedPath) &&
          relativeContentPath !== '..' &&
          !relativeContentPath.startsWith(`..${path.sep}`) &&
          !path.isAbsolute(relativeContentPath);

        if (!isDocsSource && !isShisoSource && !isGlobContent) {
          return;
        }

        const resolvedId =
          isDocsSource || isGlobContent ? RESOLVED_DOCS_CONFIG_ID : RESOLVED_SHISO_CONFIG_ID;

        if (isDocsSource || isGlobContent) {
          loaded = await loadDocsConfig(options);
        } else {
          loadedShiso = await loadShisoConfig({ root });
          // contentDir may have changed, so glob expansion must use the new
          // location before the full reload.
          loaded = await loadDocsConfig(options);
        }

        const configModule = context.server.moduleGraph.getModuleById(resolvedId);

        if (configModule) {
          context.server.moduleGraph.invalidateModule(configModule);
        }

        context.server.ws.send({ type: 'full-reload' });
      },
    },
  };
}
