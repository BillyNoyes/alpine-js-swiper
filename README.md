# Alpine Swiper

A seamless integration of [Swiper](https://swiperjs.com/) with [Alpine.js](https://alpinejs.dev/), providing reactive slider functionality through Alpine's directive and magic property system.

## Features

- **`x-swiper`** directive: Initialize and configure Swiper instances with Alpine.js reactivity
- **`x-swiper-event`** directive: Bind Swiper events directly to Alpine methods
- **`$swiper`** magic property: Access Swiper instance methods and state from anywhere in your Alpine components
- **Alpine store**: Track and manage all Swiper instances with reactive state updates

## Installation

```bash
npm install alpine-swiper
```

Then import and register the plugin:

```js
import Alpine from 'alpinejs';
import AlpineSwiper from 'alpine-swiper';

Alpine.plugin(AlpineSwiper);
Alpine.start();
```

## Usage

### Basic Example

```html
<div x-data>
  <div x-swiper class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
    
    <!-- Navigation buttons -->
    <div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    
    <!-- Pagination -->
    <div class="swiper-pagination"></div>
  </div>
</div>
```

### With Custom Options

```html
<div x-data="{ options: { loop: true, autoplay: { delay: 3000 }, pagination: { clickable: true } } }">
  <div x-swiper="options" class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
    
    <div class="swiper-pagination"></div>
  </div>
</div>
```

### Using Swiper Methods and Properties

```html
<div x-data>
  <div x-swiper class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
  </div>
  
  <!-- Control buttons using $swiper magic -->
  <div class="controls">
    <button @click="$swiper.slidePrev()">Previous</button>
    <button @click="$swiper.slideNext()">Next</button>
    <button @click="$swiper.slideTo(0)">Go to first slide</button>
    
    <!-- Accessing reactive state -->
    <p>Current slide: <span x-text="$swiper.activeIndex + 1"></span> / <span x-text="$swiper.slides"></span></p>
    <p x-show="$swiper.isBeginning">You're at the beginning!</p>
    <p x-show="$swiper.isEnd">You've reached the end!</p>
  </div>
</div>
```

### Working with Events

```html
<div x-data="{ message: '' }">
  <div 
    x-swiper 
    x-swiper-event:slide-change="message = 'Slide changed to ' + ($swiper.activeIndex + 1)"
    x-swiper-event:reach-end="message = 'Reached the end!'"
    class="swiper"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
  </div>
  
  <p x-text="message"></p>
</div>
```

## API Reference

### `x-swiper` Directive

Initializes a new Swiper instance on the element.

```html
<div x-swiper="options"></div>
```

The `options` parameter is optional and can include any valid [Swiper configuration options](https://swiperjs.com/swiper-api#parameters).

### `x-swiper-event` Directive

Binds Swiper events to Alpine expressions.

```html
<div x-swiper-event:event-name="expression"></div>
```

Event names should be in kebab-case (e.g., `slide-change` instead of `slideChange`).

Common events:
- `slide-change`
- `reach-beginning`
- `reach-end`
- `progress`
- `resize`
- `init`

### `$swiper` Magic Property

Provides access to the Swiper instance methods and reactive state.

```html
<button @click="$swiper.slideTo(2)">Go to slide 3</button>
<p x-text="$swiper.activeIndex"></p>
```

Available reactive properties:
- `activeIndex`: Current active slide index
- `isBeginning`: Whether the slider is at the beginning
- `isEnd`: Whether the slider is at the end
- `slides`: Total number of slides
- `progress`: Current progress value (0-1)

You can also access any native Swiper methods and properties through the `$swiper` magic.

### Alpine Store: `$store.swipers`

The plugin creates an Alpine store to track all Swiper instances:

```html
<div x-data>
  <!-- Access a specific swiper by ID -->
  <button @click="$store.swipers.getSwiper('my-swiper-id')?.slideTo(0)">
    Reset all sliders
  </button>
</div>
```

## Browser Support

Alpine Swiper supports all browsers that are compatible with Alpine.js and Swiper.

## License

MIT