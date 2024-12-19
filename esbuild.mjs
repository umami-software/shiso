import esbuild from 'esbuild';
import pkg from './package.json' with { type: "json" };

const { dependencies } = pkg;

const config = {
  entryPoints: ['src/components/index.ts'],
  bundle: true,
  external: Object.keys(dependencies),
  jsx: 'automatic',
  platform: 'node',
};

esbuild
  .build({
    ...config,
    outfile: 'dist/index.js',
    format: 'cjs',
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
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
