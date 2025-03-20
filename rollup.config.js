import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import filesize from 'rollup-plugin-filesize';
import pkg from './package.json';

export default [
  // Browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: 'AlpineSwiper',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'alpinejs': 'Alpine',
        'swiper': 'Swiper'
      }
    },
    external: ['alpinejs', 'swiper'],
    plugins: [
      resolve(),
      commonjs(),
      terser(),
      filesize()
    ]
  },
  // CommonJS (for Node) and ES module (for bundlers) build
  {
    input: 'src/index.js',
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    external: ['alpinejs', 'swiper'],
    plugins: [
      resolve(),
      filesize()
    ]
  }
]; 