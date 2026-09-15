import assert from 'node:assert/strict';
import test from 'node:test';

import { createPlugin } from '../src/index.js';

class FakeElement extends EventTarget {
  constructor({ parent = null, swiperDirective = false, id } = {}) {
    super();
    this.parent = parent;
    this.swiperDirective = swiperDirective;
    this.dataset = {};
    if (id) this.dataset.swiperId = id;
  }

  closest(selector) {
    const matches =
      (selector.includes('[data-swiper-id]') && this.dataset.swiperId) ||
      (selector.includes('[x-swiper]') && this.swiperDirective);
    return matches ? this : this.parent?.closest(selector) ?? null;
  }
}

class FakeSwiper {
  constructor(element, options) {
    this.element = element;
    this.options = options;
    this.events = new Map();
    this.activeIndex = 0;
    this.realIndex = 0;
    this.isBeginning = true;
    this.isEnd = false;
    this.slides = [{}, {}];
    this.progress = 0;
    this.destroyed = false;
    this.initialized = false;
  }

  on(name, handler) {
    const handlers = this.events.get(name) ?? new Set();
    handlers.add(handler);
    this.events.set(name, handlers);
  }

  off(name, handler) {
    this.events.get(name)?.delete(handler);
  }

  emit(name, ...args) {
    for (const handler of this.events.get(name) ?? []) handler(...args);
  }

  init() {
    this.initialized = true;
    this.emit('init', this);
  }

  slideNext() {
    this.activeIndex += 1;
    this.realIndex += 1;
    this.progress = 1;
    this.isBeginning = false;
    this.isEnd = true;
    this.emit('slideChange', this);
  }

  destroy() {
    this.destroyed = true;
    this.events.clear();
  }
}

function createAlpine() {
  const stores = new Map();
  const directives = new Map();
  const magics = new Map();

  return {
    directives,
    magics,
    store(name, value) {
      if (arguments.length === 2) stores.set(name, value);
      return stores.get(name);
    },
    directive(name, callback) {
      directives.set(name, callback);
      return { before() {} };
    },
    magic(name, callback) {
      magics.set(name, callback);
    },
  };
}

function utilities(evaluate = () => ({})) {
  const cleanups = [];
  return {
    cleanups,
    value: {
      evaluate,
      cleanup(callback) {
        cleanups.push(callback);
      },
    },
  };
}

test('initializes, synchronizes, and destroys a named Swiper', async () => {
  const Alpine = createAlpine();
  const plugin = createPlugin(FakeSwiper);
  plugin(Alpine);
  plugin(Alpine);

  assert.equal(Alpine.directives.size, 2, 'plugin registration is idempotent');

  const element = new FakeElement({ swiperDirective: true, id: 'hero' });
  const directiveUtilities = utilities(() => ({ speed: 250 }));
  Alpine.directives.get('swiper')(
    element,
    { expression: 'options' },
    directiveUtilities.value,
  );
  await Promise.resolve();

  const swiper = Alpine.store('swipers').getSwiper('hero');
  assert.equal(swiper.initialized, true);
  assert.deepEqual(swiper.options, { speed: 250, init: false });

  swiper.slideNext();
  assert.deepEqual(
    { ...Alpine.store('swipers').getSwiperState('hero'), instance: undefined },
    {
      instance: undefined,
      activeIndex: 1,
      realIndex: 1,
      isBeginning: false,
      isEnd: true,
      slides: 2,
      progress: 1,
    },
  );

  const magic = Alpine.magics.get('swiper')(element);
  assert.equal(magic.activeIndex, 1);
  assert.equal(typeof magic.slideNext, 'function');

  directiveUtilities.cleanups.forEach((cleanup) => cleanup());
  assert.equal(swiper.destroyed, true);
  assert.equal(Alpine.store('swipers').getSwiper('hero'), undefined);
  assert.equal(element.dataset.swiperId, 'hero', 'caller-provided IDs are preserved');
});

test('binds events before initialization and removes handlers on cleanup', async () => {
  const Alpine = createAlpine();
  createPlugin(FakeSwiper)(Alpine);

  const element = new FakeElement({ swiperDirective: true });
  const evaluations = [];
  const eventUtilities = utilities((expression, extras) => {
    evaluations.push({ expression, extras });
  });

  Alpine.directives.get('swiper-event')(
    element,
    { value: 'slide-change', expression: 'changes++' },
    eventUtilities.value,
  );

  const swiperUtilities = utilities();
  Alpine.directives.get('swiper')(
    element,
    { expression: '' },
    swiperUtilities.value,
  );
  await Promise.resolve();

  const swiper = element._swiper;
  swiper.slideNext();
  assert.equal(evaluations.length, 1);
  assert.equal(evaluations[0].expression, 'changes++');
  assert.equal(evaluations[0].extras.scope.$event, swiper);

  eventUtilities.cleanups.forEach((cleanup) => cleanup());
  swiper.slideNext();
  assert.equal(evaluations.length, 1);

  swiperUtilities.cleanups.forEach((cleanup) => cleanup());
});

test('never overwrites an instance when explicit and generated IDs collide', () => {
  const Alpine = createAlpine();
  createPlugin(FakeSwiper)(Alpine);
  const first = new FakeElement({ swiperDirective: true, id: 'swiper-1' });
  const second = new FakeElement({ swiperDirective: true, id: 'swiper-1' });
  const firstUtilities = utilities();
  const secondUtilities = utilities();

  Alpine.directives.get('swiper')(first, { expression: '' }, firstUtilities.value);
  Alpine.directives.get('swiper')(second, { expression: '' }, secondUtilities.value);

  assert.equal(first._swiperId, 'swiper-1');
  assert.equal(second._swiperId, 'swiper-2');
  assert.equal(Object.keys(Alpine.store('swipers').instances).length, 2);

  firstUtilities.cleanups.forEach((cleanup) => cleanup());
  secondUtilities.cleanups.forEach((cleanup) => cleanup());
});

test('does not automatically initialize when init is false', async () => {
  const Alpine = createAlpine();
  createPlugin(FakeSwiper)(Alpine);
  const element = new FakeElement({ swiperDirective: true });
  const directiveUtilities = utilities(() => ({ init: false }));

  Alpine.directives.get('swiper')(
    element,
    { expression: 'options' },
    directiveUtilities.value,
  );
  await Promise.resolve();

  assert.equal(element._swiper.initialized, false);
  directiveUtilities.cleanups.forEach((cleanup) => cleanup());
});
