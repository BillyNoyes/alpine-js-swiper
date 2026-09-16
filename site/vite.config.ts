import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'vite';

export default defineConfig({
  // GitHub project pages serve from /alpine-js-swiper/
  base: '/alpine-js-swiper/',
  plugins: [tailwindcss()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/site.js',
        chunkFileNames: 'assets/chunks/[name].js',
        assetFileNames(asset) {
          return asset.names.some((name) => name.endsWith('.css'))
            ? 'assets/site.css'
            : 'assets/[name][extname]';
        },
      },
    },
  },
});
