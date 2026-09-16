import {access, readFile, readdir} from 'node:fs/promises';

await Promise.all([
  access(new URL('../dist/index.html', import.meta.url)),
  access(new URL('../dist/alpine-js-swiper.svg', import.meta.url)),
  access(new URL('../dist/robots.txt', import.meta.url)),
  access(new URL('../dist/sitemap.xml', import.meta.url)),
  access(new URL('../dist/llms.txt', import.meta.url)),
  access(new URL('../dist/CNAME', import.meta.url)),
]);

const index = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const cname = await readFile(new URL('../dist/CNAME', import.meta.url), 'utf8');
const assets = await readdir(new URL('../dist/assets', import.meta.url));

if (!index.includes('alpine/swiper')) {
  throw new Error('Built page is missing the site identity');
}

if (index.includes('/src/main.ts')) {
  throw new Error('Built page still references source TypeScript');
}

if (!cname.trim().includes('alpine-js-swiper.billynoyes.co.uk')) {
  throw new Error('Built page is missing the custom domain CNAME');
}

if (!index.includes('src="/assets/site.js"')) {
  throw new Error('Built page is missing the stable JavaScript asset');
}

if (!index.includes('href="/assets/site.css"')) {
  throw new Error('Built page is missing the stable CSS asset');
}

if (!assets.includes('site.css') || !assets.includes('site.js')) {
  throw new Error('Built page is missing stable CSS or JavaScript assets');
}
