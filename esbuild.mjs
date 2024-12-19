import esbuild from 'esbuild';
import cssModulesPlugin from 'esbuild-plugin-css-modules';
import pkg from './package.json' with { type: 'json' };

const { dependencies } = pkg;

const config = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  external: Object.keys(dependencies),
  jsx: 'automatic',
  platform: 'node',
  plugins: [
    cssModulesPlugin({
      localIdentName: '[name]_[local]_[hash:6]',
    }),
  ],
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
