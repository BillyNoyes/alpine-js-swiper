import * as esbuild from 'esbuild';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function build(entryPoint, opts) {
  const name = `alpine-js-swiper${opts.suffix}.js`;
  console.log(`Building ${name}`);

  return esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: resolve(__dirname, 'dist', name),
    format: opts.format || 'esm',
    minify: opts.minify ?? true,
    target: ['es2019'],
    external: ['alpinejs'],
    globalName: opts.format === 'iife' ? 'AlpineSwiper' : undefined,
    banner: opts.format === 'iife' ? {
      js: '/* Alpine Swiper v1.0.0 | MIT License */',
    } : undefined,
    define: {
      'process.env.NODE_ENV': '"production"'
    }
  });
}

// Ensure the dist directory exists and build all formats
await esbuild.build({
  entryPoints: [],
  outdir: 'dist',
  write: false,
}).then(() => {
  return Promise.all([
    // ESM build
    build('src/index.js', {
      format: 'esm',
      suffix: '.esm',
      minify: true
    }),
    
    // CJS build
    build('src/index.js', {
      format: 'cjs',
      suffix: '.cjs',
      minify: false
    }),
    
    // IIFE/Browser build (minified)
    build('src/cdn.js', {
      format: 'iife',
      suffix: '.min',
      minify: true
    }),
    
    // IIFE/Browser build (unminified, for development)
    build('src/cdn.js', {
      format: 'iife',
      suffix: '',
      minify: false
    })
  ]);
}).catch(e => {
  console.error(e);
  process.exit(1);
}); 