type SwiperDemoOptions = {
  slidesPerView: number;
  spaceBetween: number;
  loop: boolean;
  speed: number;
  autoplay?: {delay: number; disableOnInteraction: boolean};
  pagination?: {el: string; clickable: boolean};
  navigation?: {nextEl: string; prevEl: string};
};

type AlpineComponent = {
  $nextTick: (callback: () => void) => void;
};

export function createSwiperDemo() {
  return {
    slidesPerView: 1.35,
    spaceBetween: 16,
    loop: true,
    autoplay: false,
    pagination: true,
    navigation: true,
    speed: 450,
    mounted: true,
    applying: false,
    message: 'Waiting for init…',
    slideCount: 5,
    applyTimer: undefined as ReturnType<typeof setTimeout> | undefined,

    get options(): SwiperDemoOptions {
      const options: SwiperDemoOptions = {
        slidesPerView: Number(this.slidesPerView),
        spaceBetween: Number(this.spaceBetween),
        loop: this.loop,
        speed: Number(this.speed),
      };

      if (this.autoplay) {
        options.autoplay = {delay: 2400, disableOnInteraction: false};
      }

      if (this.pagination) {
        options.pagination = {el: '.swiper-pagination', clickable: true};
      }

      if (this.navigation) {
        options.navigation = {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        };
      }

      return options;
    },

    apply() {
      if (this.applying) return;

      const self = this as typeof this & AlpineComponent;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fadeMs = reduceMotion ? 0 : 140;

      this.applying = true;
      this.message = 'Updating…';

      window.clearTimeout(this.applyTimer);
      this.applyTimer = window.setTimeout(() => {
        this.mounted = false;
        self.$nextTick(() => {
          this.mounted = true;
          self.$nextTick(() => {
            this.applying = false;
          });
        });
      }, fadeMs);
    },
  };
}

export function createCopyCode() {
  return {
    copied: false,
    async copy(text: string) {
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        window.setTimeout(() => {
          this.copied = false;
        }, 1600);
      } catch {
        this.copied = false;
      }
    },
  };
}
