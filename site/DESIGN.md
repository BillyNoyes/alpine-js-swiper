# alpine-js-swiper site design

The design authority for this site is [Vercel's design guidance](https://vercel.com/design.md), adapted to the alpine-js-swiper identity and informed by the typography and shell of the [Easel](https://github.com/BillyNoyes/Easel/tree/main/site) and [alpine-mcp](https://github.com/BillyNoyes/alpine-mcp/tree/main/site) sites.

## Implementation rules

- Use Tailwind utility classes directly in semantic HTML for layout, typography, color, responsive behavior, focus states, and dark mode.
- Do not load Vercel's brand stylesheet or use `vbg-*` classes. This is an independent alpine-js-swiper site, not an official Vercel property.
- Keep the palette monochrome and let hierarchy, alignment, and spacing carry the design.
- Use self-hosted Inter for interface text and the system Geist Mono fallback stack only for commands, paths, and identifiers.
- Treat the interactive Swiper demo as the primary visual evidence. Do not add stock media, fake screenshots, decorative gradients, glows, or ornamental motion.
- On desktop, keep the page within the viewport without scrolling; allow vertical scroll on smaller screens.
- Preserve one continuous light or dark canvas based on the visitor's system preference.
- Keep every interaction keyboard accessible, visibly focused, and complete without required animation.
