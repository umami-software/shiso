/**
 * Identity helper that gives shiso.config.ts typing today and room for future
 * config forms (functions, plugins) without another migration. Ships as plain
 * JS so it resolves under Node and jiti with no build step or dependencies.
 */
export function defineConfig(config) {
  return config;
}
