import AlpineSwiper from './index.js';

const REGISTRATION_KEY = '__alpineJsSwiperRegistered';

function register() {
  if (!window.Alpine || window[REGISTRATION_KEY]) return;

  window[REGISTRATION_KEY] = true;
  window.Alpine.plugin(AlpineSwiper);
}

if (typeof window !== 'undefined') {
  window.AlpineSwiper = AlpineSwiper;

  if (window.Alpine) {
    register();
  } else {
    document.addEventListener('alpine:init', register, { once: true });
  }
}
