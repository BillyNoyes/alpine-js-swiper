import { expect, test } from '@playwright/test';

const fixtureUrl = new URL('./fixture.html', import.meta.url).href;

test('the built CDN bundle initializes Alpine, Swiper, styles, and events', async ({ page }) => {
  await page.goto(fixtureUrl);
  await page.waitForFunction(() => document.querySelector('.swiper')?._swiper?.initialized);

  const result = await page.evaluate(() => {
    const element = document.querySelector('.swiper');
    const before = getComputedStyle(element).overflow;
    element._swiper.slideNext(0);
    return {
      before,
      activeIndex: element._swiper.activeIndex,
      registered: window.__alpineJsSwiperRegistered,
      globalType: typeof window.AlpineSwiper,
    };
  });

  await expect(page.locator('[data-changes]')).toHaveText('1');
  expect(result).toEqual({
    before: 'hidden',
    activeIndex: 1,
    registered: true,
    globalType: 'function',
  });
});
