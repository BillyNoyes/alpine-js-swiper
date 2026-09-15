import Swiper from 'swiper/bundle';

const STATE_EVENTS = [
  'init',
  'slideChange',
  'progress',
  'reachBeginning',
  'reachEnd',
  'fromEdge',
  'update',
  'resize',
  'slidesLengthChange',
  'snapGridLengthChange',
  'breakpoint',
  'observerUpdate',
];

const READY_EVENT = 'alpine-swiper:ready';

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function findSwiperElement(element) {
  if (element._swiper) return element;
  return element.closest?.('[data-swiper-id], [x-swiper]') ?? null;
}

export function createPlugin(SwiperClass = Swiper) {
  const registeredAlpines = new WeakSet();
  let generatedId = 0;

  return function AlpineSwiper(Alpine) {
    if (registeredAlpines.has(Alpine)) return;
    registeredAlpines.add(Alpine);

    Alpine.store('swipers', {
      instances: {},

      register(id, swiper) {
        this.instances[id] = {
          instance: swiper,
          activeIndex: swiper.activeIndex,
          realIndex: swiper.realIndex,
          isBeginning: swiper.isBeginning,
          isEnd: swiper.isEnd,
          slides: swiper.slides?.length ?? 0,
          progress: swiper.progress,
        };
      },

      sync(id) {
        const state = this.instances[id];
        if (!state) return;

        const { instance } = state;
        state.activeIndex = instance.activeIndex;
        state.realIndex = instance.realIndex;
        state.isBeginning = instance.isBeginning;
        state.isEnd = instance.isEnd;
        state.slides = instance.slides?.length ?? 0;
        state.progress = instance.progress;
      },

      unregister(id) {
        delete this.instances[id];
      },

      getSwiper(id) {
        return this.instances[id]?.instance;
      },

      getSwiperState(id) {
        return this.instances[id] ?? {};
      },
    });

    Alpine.directive('swiper', (element, { expression }, { evaluate, cleanup }) => {
      const store = Alpine.store('swipers');
      const requestedId = element.dataset.swiperId;
      let swiperId = requestedId;

      if (requestedId && store.instances[requestedId]) {
        console.warn(`x-swiper: The ID "${requestedId}" is already in use; a generated ID will be used.`);
        swiperId = undefined;
      }

      while (!swiperId || store.instances[swiperId]) {
        swiperId = `swiper-${++generatedId}`;
      }

      const evaluatedOptions = expression ? evaluate(expression) : {};
      const options = evaluatedOptions && typeof evaluatedOptions === 'object' ? evaluatedOptions : {};
      const shouldInitialize = options.init !== false;
      let cleanedUp = false;

      element.dataset.swiperId = swiperId;

      const swiper = new SwiperClass(element, { ...options, init: false });
      const syncState = () => store.sync(swiperId);

      element._swiper = swiper;
      element._swiperId = swiperId;
      store.register(swiperId, swiper);
      STATE_EVENTS.forEach((eventName) => swiper.on(eventName, syncState));
      element.dispatchEvent(new Event(READY_EVENT));

      if (shouldInitialize) {
        queueMicrotask(() => {
          if (!cleanedUp && !swiper.destroyed) swiper.init();
        });
      }

      cleanup(() => {
        cleanedUp = true;
        STATE_EVENTS.forEach((eventName) => swiper.off(eventName, syncState));
        swiper.destroy(true, true);
        store.unregister(swiperId);
        delete element._swiper;
        delete element._swiperId;

        if (!requestedId) delete element.dataset.swiperId;
      });
    });

    Alpine.directive(
      'swiper-event',
      (element, { value, expression }, { evaluate, cleanup }) => {
        if (!value || !expression) {
          console.warn('x-swiper-event requires an event name and an expression.');
          return;
        }

        const eventName = toCamelCase(value);
        let swiper;
        let eventHandler;
        let readyElement;

        const bind = () => {
          const swiperElement = findSwiperElement(element);
          if (!swiperElement?._swiper || swiper === swiperElement._swiper) return;

          if (swiper && !swiper.destroyed && eventHandler) swiper.off(eventName, eventHandler);

          swiper = swiperElement._swiper;
          eventHandler = (...args) => {
            evaluate(expression, {
              scope: {
                $event: args[0],
                $swiperEvent: args,
              },
            });
          };
          swiper.on(eventName, eventHandler);
        };

        readyElement = findSwiperElement(element);
        bind();

        if (!swiper && readyElement) {
          readyElement.addEventListener(READY_EVENT, bind, { once: true });
        }

        cleanup(() => {
          readyElement?.removeEventListener(READY_EVENT, bind);
          if (swiper && !swiper.destroyed && eventHandler) swiper.off(eventName, eventHandler);
        });
      },
    );

    Alpine.magic('swiper', (element) => {
      const swiperElement = findSwiperElement(element);
      const swiperId = swiperElement?._swiperId ?? swiperElement?.dataset.swiperId;

      if (!swiperId) return undefined;

      return new Proxy(
        {},
        {
          get(_target, property) {
            const state = Alpine.store('swipers').getSwiperState(swiperId);
            const instance = state.instance;

            if (Object.prototype.hasOwnProperty.call(state, property)) return state[property];
            if (!instance || !(property in instance)) return undefined;

            const value = instance[property];
            return typeof value === 'function' ? value.bind(instance) : value;
          },
        },
      );
    });
  };
}

const AlpineSwiper = createPlugin();

export default AlpineSwiper;
