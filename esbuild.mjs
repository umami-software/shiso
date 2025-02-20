import esbuild from 'esbuild';
import cssModules from '@umami/esbuild-plugin-css-modules';
import pkg from './package.json' with { type: 'json' };

const { dependencies } = pkg;

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  external: Object.keys(dependencies),
  jsx: 'automatic',
  platform: 'node',
  plugins: [cssModules()],
};

esbuild
  .build({
    ...config,
    outfile: 'dist/index.js',
    format: 'cjs',
    loader: { '.css': 'css' },
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });

esbuild
  .build({
    ...config,
    outfile: 'dist/index.mjs',
    format: 'esm',
    loader: { '.css': 'css' },
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
