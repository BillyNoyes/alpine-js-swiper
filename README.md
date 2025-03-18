# Alpine.js Swiper Integration

This project provides an Alpine.js plugin that allows you to easily integrate **Swiper** (a popular mobile-friendly slider library) into your Alpine.js components. It exposes the Swiper instance through a magic property (`$swiper`) and offers an easy way to initialize and interact with Swiper via Alpine directives.

## Features

- **`x-swiper`**: Initializes a Swiper instance with custom options.
- **`x-swiper-event`**: Binds Swiper events like `slideChange` and `resize` directly to Alpine's reactivity system.
- **`$swiper`**: Access the Swiper instance directly using Alpine's magic property. This allows you to call Swiper methods like `slideTo()` and access properties like `activeIndex` seamlessly.

## Usage
1. Initialize Swiper with x-swiper
You can initialize Swiper with options using the x-swiper directive. Here’s an example:

```html
<div x-data="{ swiperOptions: { loop: true, initialSlide: 2 } }">
  <div
    x-swiper="swiperOptions"
    class="swiper"
  >
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>
  </div>
</div>
```

2. Bind Swiper Events with x-swiper-event
You can bind events like slideChange and resize to Alpine's reactive system with the x-swiper-event directive:

```html
<div
  x-swiper-event:slide-change="console.log('Slide changed!')"
  x-swiper-event:resize="console.log('Swiper resized!')"
  class="swiper"
>
  <!-- Swiper content here -->
</div>
```

3. Access the Swiper Instance with $swiper
You can access the Swiper instance anywhere in your Alpine component using the magic property $swiper. This allows you to call Swiper methods like slideTo().

```html
<div x-data="{ swiperOptions: { loop: true, initialSlide: 2 } }">
  <div x-swiper="swiperOptions" class="swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide">Slide 1</div>
      <div class="swiper-slide">Slide 2</div>
      <div class="swiper-slide">Slide 3</div>
    </div>


    <!-- Calling a method using $swiper -->
    <button @click="$swiper.slideTo(2)">Go to Slide 3</button>
  </div>
</div>
```

## API
`$swiper`
The $swiper magic property returns the Swiper instance attached to the element. You can use it to call any Swiper method (e.g., slideTo(), slideNext(), etc.) and access its properties (e.g., activeIndex).

x-swiper
The x-swiper directive initializes a Swiper instance with the provided options.

Example:
```html
<div x-swiper="swiperOptions" class="swiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">Slide 1</div>
    <div class="swiper-slide">Slide 2</div>
    <div class="swiper-slide">Slide 3</div>
  </div>
</div>
```

`x-swiper-event`
The `x-swiper-event` directive binds events from the Swiper instance to Alpine's reactivity system.

### Example:
```html
<div x-swiper-event:slide-change="console.log('Slide changed!')" class="swiper">
  <!-- Swiper content here -->
</div>
```

### Example Swiper Options
```js
{
  loop: true,
  initialSlide: 0,
  speed: 500,
  slidesPerView: 1,
  spaceBetween: 10,
}
```
You can pass any valid Swiper configuration options as part of the `x-swiper` directive.

## Troubleshooting
Swiper instance not found
Make sure the `x-swiper` directive is properly applied to the element, and the `swiperOptions` are correctly defined.

Calling `$swiper()` in the wrong scope
Ensure that `$swiper()` is being called from within the correct Alpine scope, such as within a component that has a x-swiper directive.

## License
MIT License