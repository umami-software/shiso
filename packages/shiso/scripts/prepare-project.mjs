import path from 'node:path';
import { generateOpenApiModule } from './generate-openapi.mjs';
import { generateSearchIndex } from './generate-search-index.mjs';
import { loadDocsConfig } from './load-docs-config.mjs';
import { loadShisoConfig, SHISO_CONFIG_FILES } from './load-shiso-config.mjs';

function isContentFile(file, contentRoot) {
  const relative = path.relative(contentRoot, file);
  return (
    /\.(?:md|mdx)$/.test(file) &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  );
}

/**
 * Owns the prepared configuration and its OpenAPI/search outputs. The config
 * loader creates stubs before expanding navigation and globs; both generators
 * then consume that same OpenAPI project. Callers only request preparation or
 * report a changed source, rather than coordinating stages and dependencies.
 */
export async function createProjectPreparation({
  root = process.cwd(),
  configFile = 'docs.json',
  outputDir = path.join(root, '.shiso'),
} = {}) {
  async function loadSnapshot() {
    const shiso = await loadShisoConfig({ root });
    const docs = await loadDocsConfig({ root, configFile, shiso: shiso.config });
    return { docs, shiso };
  }

  let snapshot = await loadSnapshot();
  let pending = Promise.resolve();
  const shisoCandidatePaths = SHISO_CONFIG_FILES.map(name =>
    path.resolve(snapshot.docs.projectRoot, name),
  );

  // Build and refresh requests share one queue. A failed source edit must not
  // prevent the next corrected edit from preparing successfully.
  function enqueue(action) {
    const result = pending.then(action);
    pending = result.catch(() => {});
    return result;
  }

  async function generate(current, { references = true } = {}) {
    const { docs, shiso } = current;
    if (references) {
      await generateOpenApiModule({
        root: docs.projectRoot,
        config: docs.config,
        project: docs.apiProject,
        output: path.join(outputDir, 'openapi.generated.ts'),
      });
    }
    await generateSearchIndex({
      root: docs.projectRoot,
      config: docs.config,
      shiso: shiso.config,
      project: docs.apiProject,
      output: path.join(outputDir, 'search-index.generated.ts'),
    });
  }

  return {
    getSnapshot: () => snapshot,
    prepare: () => enqueue(() => generate(snapshot)),
    refresh: file =>
      enqueue(async () => {
        const changedPath = path.resolve(file);
        const { docs, shiso } = snapshot;
        const isSource =
          docs.sourcePaths.includes(changedPath) ||
          docs.specPaths.includes(changedPath) ||
          shiso.sourcePaths.includes(changedPath) ||
          shisoCandidatePaths.includes(changedPath);
        const isContent = isContentFile(
          changedPath,
          path.resolve(docs.projectRoot, shiso.config.contentDir),
        );

        if (!isSource && !isContent) return undefined;

        const configChanged = isSource || (isContent && docs.hasGlobs);
        const next = configChanged ? await loadSnapshot() : snapshot;
        await generate(next, { references: configChanged });
        // Publish the new configuration only once all derived outputs exist.
        snapshot = next;
        return { configChanged };
      }),
  };
}
