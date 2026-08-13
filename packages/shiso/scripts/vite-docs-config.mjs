import path from 'node:path';
import { loadDocsConfig } from './load-docs-config.mjs';

export const VIRTUAL_DOCS_CONFIG_ID = 'virtual:shiso-docs-config';
const RESOLVED_DOCS_CONFIG_ID = `\0${VIRTUAL_DOCS_CONFIG_ID}`;

function renderConfigModule(config) {
  return `export default ${JSON.stringify(config)};`;
}

/**
 * Creates the single docs-config state shared by a Vite build and application
 * modules. The virtual module keeps Node-only file loading out of the browser
 * bundle and gives the later `$ref` resolver one integration point.
 */
export async function createDocsConfigModule({
  root = process.cwd(),
  configFile = 'docs.json',
} = {}) {
  const options = { root, configFile };
  let loaded = await loadDocsConfig(options);

  return {
    getConfig: () => loaded.config,
    getSourcePaths: () => loaded.sourcePaths,
    sourcePath: loaded.sourcePath,
    plugin: {
      name: 'shiso-docs-config',
      enforce: 'pre',
      resolveId(id) {
        return id === VIRTUAL_DOCS_CONFIG_ID ? RESOLVED_DOCS_CONFIG_ID : undefined;
      },
      load(id) {
        if (id !== RESOLVED_DOCS_CONFIG_ID) {
          return undefined;
        }

        for (const sourcePath of loaded.sourcePaths) {
          this.addWatchFile(sourcePath);
        }
        return renderConfigModule(loaded.config);
      },
      async handleHotUpdate(context) {
        if (!loaded.sourcePaths.includes(path.resolve(context.file))) {
          return;
        }

        loaded = await loadDocsConfig(options);

        const configModule = context.server.moduleGraph.getModuleById(RESOLVED_DOCS_CONFIG_ID);

        if (configModule) {
          context.server.moduleGraph.invalidateModule(configModule);
        }

        context.server.ws.send({ type: 'full-reload' });
      },
    },
  };
}
