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
  $watch: (property: string, callback: (value: unknown) => void) => void;
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
    ready: false,
    message: 'Waiting for init…',
    slideCount: 5,
    applyTimer: undefined as ReturnType<typeof setTimeout> | undefined,
    debounceTimer: undefined as ReturnType<typeof setTimeout> | undefined,

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

    init() {
      const self = this as typeof this & AlpineComponent;

      for (const key of ['loop', 'autoplay', 'pagination', 'navigation'] as const) {
        self.$watch(key, () => {
          if (!this.ready) return;
          this.scheduleApply(0);
        });
      }

      for (const key of ['slidesPerView', 'spaceBetween', 'speed'] as const) {
        self.$watch(key, () => {
          if (!this.ready) return;
          this.scheduleApply(280);
        });
      }

      self.$nextTick(() => {
        this.ready = true;
      });
    },

    scheduleApply(delayMs: number) {
      window.clearTimeout(this.debounceTimer);
      this.debounceTimer = window.setTimeout(() => {
        this.apply();
      }, delayMs);
    },

    apply() {
      const self = this as typeof this & AlpineComponent;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const fadeMs = reduceMotion ? 0 : 140;

      window.clearTimeout(this.applyTimer);
      this.applying = true;
      this.message = 'Updating…';

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

export function createDocsNavigation(root: HTMLElement) {
  let frame: number | undefined;
  let cleanup = () => {};

  return {
    activeSection: '',
    init() {
      const sections = [...root.querySelectorAll<HTMLElement>('main section[id]')];
      const targets = [...root.querySelectorAll<HTMLElement>('main [id]')];
      const menu = root.querySelector<HTMLDetailsElement>('details');
      const sidebar = root.querySelector('aside');
      const desktop = window.matchMedia('(min-width: 1024px)');
      const update = () => {
        frame = undefined;
        const pageHeight = document.documentElement.scrollHeight;
        const atBottom =
          pageHeight > window.innerHeight &&
          window.scrollY + window.innerHeight >= pageHeight - 1;
        const section = atBottom
          ? sections.at(-1)
          : sections
              .filter((item) => item.getBoundingClientRect().top <= window.innerHeight * 0.3)
              .at(-1);
        this.activeSection = (section ?? sections[0])?.id ?? '';
      };
      const schedule = () => {
        if (frame === undefined) frame = requestAnimationFrame(update);
      };
      const syncHash = () => {
        const target = targets.find((item) => `#${item.id}` === window.location.hash);
        const section = target?.closest('section[id]');
        if (section) this.activeSection = section.id;
        else update();
      };
      const resize = () => {
        if (desktop.matches && menu?.contains(document.activeElement)) {
          menu.open = false;
          sections.find((item) => item.id === this.activeSection)?.focus();
        } else if (!desktop.matches && sidebar?.contains(document.activeElement)) {
          menu?.querySelector('summary')?.focus();
        }
        schedule();
      };

      syncHash();
      window.addEventListener('scroll', schedule, {passive: true});
      window.addEventListener('hashchange', syncHash);
      window.addEventListener('resize', resize);
      cleanup = () => {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('hashchange', syncHash);
        window.removeEventListener('resize', resize);
        if (frame !== undefined) cancelAnimationFrame(frame);
      };
    },
    closeMenu() {
      const menu = root.querySelector<HTMLDetailsElement>('details');
      if (!menu?.open) return;
      menu.open = false;
      menu.querySelector('summary')?.focus();
    },
    navigate(event: MouseEvent) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.currentTarget as HTMLAnchorElement;
      const target = root.querySelector<HTMLElement>(link.hash);
      if (!target) return;
      const menu = root.querySelector<HTMLDetailsElement>('details');
      if (menu) menu.open = false;
      this.activeSection = target.closest('section[id]')?.id ?? target.id;
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = undefined;
        target.focus({preventScroll: true});
        target.scrollIntoView({behavior: 'auto', block: 'start'});
      });
    },
    destroy() {
      cleanup();
    },
  };
}

export function createCopyCode(root: HTMLElement) {
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let destroyed = false;

  return {
    label: root.querySelector('[data-code-label]')?.textContent?.trim() ?? 'code',
    pending: false,
    status: '',
    async copy() {
      if (this.pending || destroyed) return;
      clearTimeout(resetTimer);
      this.status = '';
      const code = root.querySelector('pre code')?.textContent;
      if (!navigator.clipboard?.writeText || code === undefined || code === null) {
        this.status = 'Copy unavailable. Select the code to copy it.';
        return;
      }

      this.pending = true;
      try {
        await navigator.clipboard.writeText(code);
        if (destroyed) return;
        this.status = 'Copied to clipboard.';
        resetTimer = setTimeout(() => {
          this.status = '';
        }, 3000);
      } catch {
        if (!destroyed) this.status = 'Could not copy. Select the code to copy it.';
      } finally {
        if (!destroyed) this.pending = false;
      }
    },
    destroy() {
      destroyed = true;
      clearTimeout(resetTimer);
    },
  };
}
