import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';

export default defineConfig({
  // Custom domain serves from the site root.
  base: '/',
  plugins: [tailwindcss()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        docs: fileURLToPath(new URL('./docs/index.html', import.meta.url)),
      },
      output: {
        entryFileNames: 'assets/[name].js',
        // Both pages share one Alpine entry module; keep a stable URL.
        chunkFileNames: 'assets/site.js',
        assetFileNames(asset) {
          return asset.names.some((name) => name.endsWith('.css'))
            ? 'assets/site.css'
            : 'assets/[name][extname]';
        },
      },
    },
  },
});
