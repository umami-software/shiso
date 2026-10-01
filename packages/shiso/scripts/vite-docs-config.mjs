import { createProjectPreparation } from './prepare-project.mjs';

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
 * options with defaults already applied. Project preparation owns source
 * changes and generates reference/search data before this adapter reloads Vite.
 *
 * @param {{ root?: string, configFile?: string, outputDir?: string }} [options]
 */
export async function createDocsConfigModule({
  root = process.cwd(),
  configFile = 'docs.json',
  outputDir,
} = {}) {
  const preparation = await createProjectPreparation({ root, configFile, outputDir });
  const getSnapshot = preparation.getSnapshot;
  const getSourcePaths = () => {
    const { docs, shiso } = getSnapshot();
    return [...docs.sourcePaths, ...shiso.sourcePaths, ...docs.specPaths];
  };

  return {
    getConfig: () => getSnapshot().docs.config,
    getShisoConfig: () => getSnapshot().shiso.config,
    getSpecPath: () => getSnapshot().docs.specPath,
    getSpecPaths: () => getSnapshot().docs.specPaths,
    getSourcePaths,
    get sourcePath() {
      return getSnapshot().docs.sourcePath;
    },
    get shisoSourcePath() {
      return getSnapshot().shiso.sourcePath;
    },
    plugin: {
      name: 'shiso-docs-config',
      enforce: 'pre',
      async buildStart() {
        // Only existing files may be watched; absent shiso.config candidates
        // are recognized by project preparation when the user creates them.
        for (const sourcePath of getSourcePaths()) {
          this.addWatchFile(sourcePath);
        }
        await preparation.prepare();
      },
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
        const { docs, shiso } = getSnapshot();
        if (id === RESOLVED_DOCS_CONFIG_ID) {
          for (const sourcePath of [...docs.sourcePaths, ...docs.specPaths]) {
            this.addWatchFile(sourcePath);
          }
          return renderConfigModule(docs.config);
        }

        if (id === RESOLVED_SHISO_CONFIG_ID) {
          for (const sourcePath of shiso.sourcePaths) {
            this.addWatchFile(sourcePath);
          }
          return renderShisoConfigModule(shiso.config);
        }

        return undefined;
      },
      async handleHotUpdate(context) {
        const result = await preparation.refresh(context.file);
        if (!result?.configChanged) return;

        // The two virtual modules describe the same prepared project; either
        // config can affect both, for example by changing contentDir.
        for (const resolvedId of [RESOLVED_DOCS_CONFIG_ID, RESOLVED_SHISO_CONFIG_ID]) {
          const configModule = context.server.moduleGraph.getModuleById(resolvedId);
          if (configModule) {
            context.server.moduleGraph.invalidateModule(configModule);
          }
        }

        context.server.ws.send({ type: 'full-reload' });
      },
    },
  };
}
