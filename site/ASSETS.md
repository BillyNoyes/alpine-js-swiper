# Site assets

The visual direction combines the restrained typography and full-width shell of the [Easel site](https://github.com/BillyNoyes/Easel/tree/main/site) with the information hierarchy and evidence-led composition in [Vercel's design guidance](https://vercel.com/design.md).

All component and page styling is expressed with Tailwind utility classes in `index.html`. The site does not load Vercel's stylesheet and does not use or recreate its `vbg-*` CSS classes. `src/style.css` contains only Tailwind's import, the alpine-js-swiper stylesheet, local font faces, theme tokens, and Alpine's pre-initialization visibility rule.

## Fonts

The regular and bold Inter faces in `public/fonts/` mirror the self-hosted setup used by Easel and alpine-mcp. Their SIL Open Font License is included as `Inter-LICENSE.txt`. Code and paths use a system-first Geist Mono fallback stack, so the site makes no third-party font requests.

## Visual assets

`public/alpine-js-swiper.svg` is the original alpine-js-swiper mark used in the header and as the favicon. Its rounded dark tile and overlapping slide frames follow the visual language of Easel's and alpine-mcp's marks.

The site intentionally uses the working Swiper demo as its primary visual evidence. It does not use stock imagery, decorative illustrations, fake application screenshots, or third-party runtime assets beyond Alpine.js and the local alpine-js-swiper package.
