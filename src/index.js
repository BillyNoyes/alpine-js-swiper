import Swiper from 'swiper';
import 'swiper/css';

export default function (Alpine) {
  // Swiper directive: Initializes Swiper and stores the instance on the element
  Alpine.directive('swiper', (el, { expression }, { evaluate, cleanup }) => {
    let swiper;
    let swiperOptions = {};

    if (expression) {
      swiperOptions = evaluate(expression) || {};
    }

    swiper = new Swiper(el, swiperOptions);

    // Store instance
    el._swiper = swiper;

    cleanup(() => {
      swiper?.destroy();
    });
  });

  // Swiper event directive: Binds Swiper events
  Alpine.directive('swiper-event', (el, { value, expression }, { evaluateLater, effect }) => {
    // Convert kebab-case event name to camelCase
    let camelCaseEvent = value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

    let getHandler = evaluateLater(expression);

    effect(() => {
      // Find the closest Swiper element
      let swiper = el._swiper || el.closest('.swiper')?._swiper;

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

  // Alpine magic: $swiper - Access Swiper instance safely
  Alpine.magic('swiper', (el) => {
    // Find the closest Swiper element and return the instance directly
    let swiper = el._swiper || el.closest('.swiper')?._swiper;

    if (!swiper) {
      console.warn('$swiper: No Swiper instance found.');
      return null;
    }

    return swiper;
  });
}