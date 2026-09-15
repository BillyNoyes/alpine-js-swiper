# Alpine.js Swiper

A lightweight Alpine.js plugin that integrates [Swiper](https://swiperjs.com/) through Alpine directives, magic properties, and a shared reactive store.

## Features

- `x-swiper` initializes a Swiper instance from an Alpine expression.
- `x-swiper-event:*` evaluates Alpine expressions when Swiper events fire.
- `$swiper` exposes the nearest Swiper instance and reactive state.
- `$store.swipers` provides named access to every mounted instance.
- Swiper's full bundle, including all modules, is included.
- ESM, CommonJS, browser, CSS, and TypeScript declaration entry points are provided.

## Installation

### npm

```bash
npm install alpine-js-swiper
```

Import the plugin and its required stylesheet before starting Alpine:

```js
import Alpine from 'alpinejs';
import AlpineSwiper from 'alpine-js-swiper';
import 'alpine-js-swiper/style.css';

Alpine.plugin(AlpineSwiper);
Alpine.start();
```

### CDN

The browser bundle includes Swiper and registers itself when Alpine initializes. The stylesheet is a separate required asset.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/BillyNoyes/alpine-js-swiper@main/dist/style.css"
>
<script
  defer
  src="https://cdn.jsdelivr.net/gh/BillyNoyes/alpine-js-swiper@main/dist/alpine-js-swiper.min.js"
></script>
<script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
```

The `@main` URLs always follow the latest repository build. For production, replace `@main` with a release tag such as `@v1.1.0` after that release is available.

## Usage

### Basic slider

```html
<div x-data>
  <div x-swiper class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
  </div>
</div>
```

### Options and controls

Pass any [Swiper parameters](https://swiperjs.com/swiper-api#parameters) through the directive expression. Controls inside the Swiper element can use `$swiper` directly.

```html
<div
  x-data="{ options: { loop: true, autoplay: { delay: 3000 } } }"
  x-swiper="options"
  class="swiper"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>

  <button type="button" @click="$swiper.slidePrev()">Previous</button>
  <button type="button" @click="$swiper.slideNext()">Next</button>
  <p>
    Slide <span x-text="$swiper.realIndex + 1"></span>
    of <span x-text="$swiper.slides"></span>
  </p>
</div>
```

`realIndex` is usually the desired index when loop mode is enabled. `activeIndex` remains available when the internal Swiper index is needed.

### Events

Event names use kebab case. Event expressions receive the first Swiper event argument as `$event` and all arguments as `$swiperEvent`.

```html
<div
  x-data="{ message: '' }"
  x-swiper
  x-swiper-event:init="message = 'Ready'"
  x-swiper-event:slide-change="message = `Slide ${$swiper.realIndex + 1}`"
  x-swiper-event:reach-end="message = 'Reached the end'"
  class="swiper"
>
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
  </div>
  <p x-text="message"></p>
</div>
```

Listeners are removed automatically when Alpine cleans up the element.

### Named instances

Set `data-swiper-id` to retrieve an instance from controls outside its DOM subtree:

```html
<div x-data>
  <div data-swiper-id="product-gallery" x-swiper class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Front</div>
      <div class="swiper-slide">Back</div>
    </div>
  </div>

  <button
    type="button"
    @click="$store.swipers.getSwiper('product-gallery')?.slideTo(0)"
  >
    Back to first image
  </button>
</div>
```

If no ID is supplied, the plugin creates one. Duplicate IDs receive a generated fallback so one instance cannot overwrite another.

## API

### `x-swiper="options"`

Creates one Swiper instance on the element. Options are evaluated when the directive initializes. Set `init: false` to initialize it manually later with `$swiper.init()`.

### `x-swiper-event:event-name="expression"`

Runs an Alpine expression for a Swiper event. Kebab-case names are converted to Swiper's camelCase names, for example `slide-change` becomes `slideChange`.

### `$swiper`

Available on the Swiper element and its descendants. It exposes Swiper methods and properties plus these synchronized values:

- `activeIndex`
- `realIndex`
- `isBeginning`
- `isEnd`
- `slides` (count)
- `progress`

Outside the Swiper subtree, use a named instance through `$store.swipers`.

### `$store.swipers`

- `getSwiper(id)` returns the raw Swiper instance.
- `getSwiperState(id)` returns its reactive state.
- `instances` contains the registered state records.

Instances and event listeners are removed automatically during Alpine cleanup.

## Development

```bash
npm ci
npx playwright install chromium
npm test
npm pack --dry-run
```

`npm test` builds every distribution format, runs lifecycle unit tests, verifies package entry points, and exercises the generated CDN bundle in Chromium.

## Releasing

Publishing a GitHub Release whose tag matches the package version (for example, `v1.1.0`) triggers the npm trusted-publishing workflow. Stable releases publish to `latest`; GitHub prereleases publish to `next`.

Before the first automated release, configure:

1. An npm trusted publisher for `BillyNoyes/alpine-js-swiper`, workflow `publish.yml`, and environment `npm`.
2. A GitHub `npm` environment, preferably restricted to protected release tags.

The workflow uses GitHub OIDC and does not require an `NPM_TOKEN`.

## Browser support

The plugin targets modern browsers supported by Alpine.js 3 and Swiper 12.

## License

[MIT](LICENSE)
