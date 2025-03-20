import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function (Alpine) {
  // Create an Alpine store to track Swiper instances and their state
  Alpine.store('swipers', {
    instances: {},
    
    registerSwiper(id, swiper) {
      this.instances[id] = {
        instance: swiper,
        activeIndex: swiper.activeIndex,
        isBeginning: swiper.isBeginning,
        isEnd: swiper.isEnd,
        slides: swiper.slides.length,
        progress: swiper.progress
      };
    },
    
    updateState(id, key, value) {
      if (this.instances[id]) {
        this.instances[id][key] = value;
      }
    },
    
    getSwiper(id) {
      return this.instances[id]?.instance;
    },
    
    getSwiperState(id) {
      return this.instances[id] || {};
    }
  });

  // Swiper directive: Initializes Swiper and stores the instance on the element
  Alpine.directive('swiper', (el, { expression }, { evaluate, cleanup }) => {
    let swiper;
    let swiperOptions = {
      modules: [Navigation, Pagination, Autoplay]
    };

    // Generate a unique ID for this Swiper instance
    const swiperId = `swiper-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    el.dataset.swiperId = swiperId;

    if (expression) {
      swiperOptions = {
        ...(evaluate(expression) || {}),
        ...swiperOptions
      };
    }

    // Create Swiper instance
    swiper = new Swiper(el, swiperOptions);

    // Register with Alpine store
    Alpine.store('swipers').registerSwiper(swiperId, swiper);

    // Set up event listeners to update reactive state
    swiper.on('slideChange', () => {
      Alpine.store('swipers').updateState(swiperId, 'activeIndex', swiper.activeIndex);
      Alpine.store('swipers').updateState(swiperId, 'isBeginning', swiper.isBeginning);
      Alpine.store('swipers').updateState(swiperId, 'isEnd', swiper.isEnd);
      Alpine.store('swipers').updateState(swiperId, 'progress', swiper.progress);
    });

    // Store instance on element for direct access
    el._swiper = swiper;
    el._swiperId = swiperId;

    cleanup(() => {
      swiper?.destroy();
      // Clean up the store entry
      delete Alpine.store('swipers').instances[swiperId];
    });
  });

  // Swiper event directive: Binds Swiper events
  Alpine.directive('swiper-event', (el, { value, expression }, { evaluateLater, effect }) => {
    // Convert kebab-case event name to camelCase
    let camelCaseEvent = value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    let getHandler = evaluateLater(expression);

    effect(() => {
      // Find the closest Swiper element
      let swiperEl = el._swiper ? el : el.closest('[data-swiper-id]');
      let swiper = swiperEl?._swiper;
      
      if (!swiper) {
        console.warn('swiper-event: No Swiper instance found.');
        return;
      }

      swiper.on(camelCaseEvent, () => {
        getHandler((callback) => {
          if (typeof callback === 'function') callback();
        });
      });
    });
  });

  // Alpine magic: $swiper - Access Swiper instance and state reactively
  Alpine.magic('swiper', (el) => {
    // Find the closest Swiper element
    let swiperEl = el._swiper ? el : el.closest('[data-swiper-id]');
    
    if (!swiperEl) {
      console.warn('$swiper: No Swiper element found.');
      return {};
    }
    
    const swiperId = swiperEl._swiperId || swiperEl.dataset.swiperId;
    
    if (!swiperId) {
      console.warn('$swiper: No Swiper ID found.');
      return {};
    }
    
    // Create a proxy that merges the instance methods with the reactive state
    return new Proxy({}, {
      get(target, prop) {
        const store = Alpine.store('swipers');
        const state = store.getSwiperState(swiperId);
        const instance = state.instance;
        
        // First check if the property exists in the state
        if (state.hasOwnProperty(prop)) {
          return state[prop];
        }
        
        // Then check if it's a method or property of the Swiper instance
        if (instance && prop in instance) {
          // If it's a function, bind it to the instance
          if (typeof instance[prop] === 'function') {
            return instance[prop].bind(instance);
          }
          return instance[prop];
        }
        
        return undefined;
      }
    });
  });
}