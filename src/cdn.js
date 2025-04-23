import Swiper from 'swiper/bundle';
import AlpineSwiper from './index.js';

// For CDN builds, automatically load Alpine if available globally
function initializePlugin() {
  if (typeof window !== 'undefined') {
    // If Alpine is already initialized, register the plugin immediately
    if (window.Alpine) {
      window.Alpine.plugin(AlpineSwiper);
    }
    
    // If Alpine isn't available yet, wait for it
    document.addEventListener('alpine:init', () => {
      window.Alpine.plugin(AlpineSwiper);
    });
  }
}

// Execute initialization
initializePlugin();

// Export for module use
export { AlpineSwiper }; 