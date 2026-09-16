import Alpine from 'alpinejs';
import AlpineSwiper from 'alpine-js-swiper';
import {createCopyCode, createDocsNavigation, createSwiperDemo} from './components';
import './style.css';

Alpine.plugin(AlpineSwiper);
Alpine.data('swiperDemo', createSwiperDemo);
Alpine.data('docsNavigation', createDocsNavigation);
Alpine.data('copyCode', createCopyCode);
Alpine.start();
