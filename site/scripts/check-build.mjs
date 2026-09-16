import {access, readFile, readdir} from 'node:fs/promises';

await Promise.all([
  access(new URL('../dist/index.html', import.meta.url)),
  access(new URL('../dist/docs/index.html', import.meta.url)),
  access(new URL('../dist/alpine-js-swiper.svg', import.meta.url)),
  access(new URL('../dist/robots.txt', import.meta.url)),
  access(new URL('../dist/sitemap.xml', import.meta.url)),
  access(new URL('../dist/llms.txt', import.meta.url)),
  access(new URL('../dist/CNAME', import.meta.url)),
]);

const index = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const docs = await readFile(new URL('../dist/docs/index.html', import.meta.url), 'utf8');
const cname = await readFile(new URL('../dist/CNAME', import.meta.url), 'utf8');
const assets = await readdir(new URL('../dist/assets', import.meta.url));

if (!index.includes('alpine/swiper')) {
  throw new Error('Built landing page is missing the site identity');
}

if (!docs.includes('Documentation')) {
  throw new Error('Built docs page is missing the documentation heading');
}

if (index.includes('/src/main.ts') || docs.includes('/src/main.ts')) {
  throw new Error('Built pages still reference source TypeScript');
}

if (!cname.trim().includes('alpine-js-swiper.billynoyes.co.uk')) {
  throw new Error('Built page is missing the custom domain CNAME');
}

if (!index.includes('href="/docs/"')) {
  throw new Error('Landing page must link to /docs/');
}

if (!index.includes('href="/assets/site.css"') || !docs.includes('href="/assets/site.css"')) {
  throw new Error('Built pages are missing the stable CSS asset');
}

if (!index.includes('src="/assets/site.js"') || !docs.includes('src="/assets/site.js"')) {
  throw new Error('Built pages are missing the shared JavaScript asset');
}

if (!assets.includes('site.css') || !assets.includes('site.js')) {
  throw new Error('Built page is missing stable CSS or JavaScript assets');
}
