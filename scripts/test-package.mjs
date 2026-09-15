import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile, readdir } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const esm = await import('alpine-js-swiper');
const cjs = require('alpine-js-swiper');
const files = await readdir(new URL('../dist', import.meta.url));
const css = await readFile(new URL('../dist/style.css', import.meta.url), 'utf8');
const cdn = await readFile(new URL('../dist/alpine-js-swiper.min.js', import.meta.url), 'utf8');

assert.equal(typeof esm.default, 'function');
assert.equal(typeof esm.createPlugin, 'function');
assert.equal(typeof cjs.default, 'function');
assert.equal(typeof cjs.createPlugin, 'function');
assert.ok(css.includes('.swiper'));
assert.ok(cdn.includes(`Alpine.js Swiper v${packageJson.version}`));
assert.deepEqual(files.sort(), [
  'alpine-js-swiper.js',
  'alpine-js-swiper.min.js',
  'index.cjs',
  'index.js',
  'style.css',
]);

console.log('ESM, CommonJS, CDN, and CSS package artifacts are valid');
