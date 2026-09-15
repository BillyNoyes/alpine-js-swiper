export type AlpineSwiperPlugin = (Alpine: any) => void;
export type SwiperConstructor = new (...args: any[]) => any;

export function createPlugin(SwiperClass?: SwiperConstructor): AlpineSwiperPlugin;

declare const AlpineSwiper: AlpineSwiperPlugin;

export default AlpineSwiper;
