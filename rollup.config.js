import typescript from '@rollup/plugin-typescript'
import copy from 'rollup-plugin-copy'
import terser from '@rollup/plugin-terser'

// ---cut-start---
/** @type {import('rollup').RollupOptions} */
// ---cut-end---
export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
    sourcemap: (process.env.BUILD || 'development') === 'development',
  },
  plugins: [
    typescript(),
    copy({
      targets: [
        {
          src: 'public/*',
          dest: 'dist',
        },
      ],
    }),
    (process.env.BUILD || 'development') === 'production' && terser(),
  ].filter(Boolean),
}
