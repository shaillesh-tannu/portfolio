const { test, expect } = require('@playwright/test');

const NAV_IDS = [
  'about',
  'how-i-work',
  'wins',
  'experience',
  'leadership',
  'skills',
  'documents',
  'contact',
];

const VIEWPORTS = [
  { width: 375, height: 800, label: 'mobile' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1440, height: 900, label: 'desktop' },
];

test.describe('Responsive layout', () => {
  for (const vp of VIEWPORTS) {
    test(`no horizontal scroll at ${vp.width}px (${vp.label})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        overflow.scrollWidth,
        `documentElement.scrollWidth (${overflow.scrollWidth}) should not exceed clientWidth (${overflow.clientWidth})`
      ).toBeLessThanOrEqual(overflow.clientWidth);
    });
  }
});

test.describe('Navigation', () => {
  test('every nav link points to an element that exists', async ({ page }) => {
    await page.goto('/');
    for (const id of NAV_IDS) {
      const link = page.locator(`nav a[href="#${id}"]`);
      await expect(link, `nav link for #${id}`).toHaveCount(1);
      const target = page.locator(`#${id}`);
      await expect(target, `target element #${id}`).toHaveCount(1);
    }
  });
});

test.describe('Meta tags', () => {
  const metaChecks = [
    { selector: 'meta[property="og:title"]', attr: 'content' },
    { selector: 'meta[property="og:description"]', attr: 'content' },
    { selector: 'meta[property="og:image"]', attr: 'content' },
    { selector: 'meta[name="twitter:card"]', attr: 'content' },
    { selector: 'link[rel="canonical"]', attr: 'href' },
    { selector: 'meta[name="google-site-verification"]', attr: 'content' },
  ];

  for (const { selector, attr } of metaChecks) {
    test(`${selector} exists with non-empty ${attr}`, async ({ page }) => {
      await page.goto('/');
      const el = page.locator(selector);
      await expect(el).toHaveCount(1);
      const value = await el.first().getAttribute(attr);
      expect(value, `${selector} ${attr}`).toBeTruthy();
      expect(value.trim().length).toBeGreaterThan(0);
    });
  }
});

test.describe('External links', () => {
  test('http(s) external links use _blank with noopener and noreferrer', async ({ page }) => {
    await page.goto('/');
    const links = page.locator('a[href^="http"]');
    const count = await links.count();
    expect(count, 'should have at least one external http link').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      const href = await link.getAttribute('href');
      const target = await link.getAttribute('target');
      const rel = (await link.getAttribute('rel')) || '';
      expect(target, `target on ${href}`).toBe('_blank');
      expect(rel, `rel on ${href}`).toMatch(/\bnoopener\b/);
      expect(rel, `rel on ${href}`).toMatch(/\bnoreferrer\b/);
    }
  });

  test('expected external destinations are present', async ({ page }) => {
    await page.goto('/');
    // Résumé is now request-only (mailto); no public PDF embed or Drive links remain.
    await expect(page.locator('object[type="application/pdf"]')).toHaveCount(0);
    await expect(page.locator('a[href$=".pdf"]')).toHaveCount(0);
    await expect(page.locator('a[href*="drive.google.com"]')).toHaveCount(0);
    await expect(page.locator('a[href*="export=download"]')).toHaveCount(0);
    await expect(page.locator('#documents a[href^="mailto:"]')).toHaveCount(2);
    await expect(page.locator('a[href*="linkedin.com/in/shailleshtannu"]').first()).toBeVisible();
    await expect(page.locator('a[href*="twitter.com/shailleshtannu"]').first()).toBeVisible();
  });

  test('mailto links use a valid mailto: href', async ({ page }) => {
    await page.goto('/');
    const mailtos = page.locator('a[href^="mailto:"]');
    const count = await mailtos.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const href = await mailtos.nth(i).getAttribute('href');
      expect(href).toMatch(/^mailto:[^@\s]+@[^@\s]+/);
    }
  });
});

test.describe('Accessibility basics', () => {
  test('html element declares lang="en"', async ({ page }) => {
    await page.goto('/');
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBe('en');
  });

  test('every section has a heading', async ({ page }) => {
    await page.goto('/');
    const sections = page.locator('section');
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const section = sections.nth(i);
      const headingCount = await section.locator('h1, h2, h3, h4, h5, h6').count();
      const id = await section.getAttribute('id');
      expect(headingCount, `section "${id || `(index ${i})`}" should have a heading`).toBeGreaterThan(0);
    }
  });

  test('no images missing alt attribute', async ({ page }) => {
    await page.goto('/');
    const missing = await page.locator('img:not([alt])').count();
    expect(missing).toBe(0);
  });

  test('hamburger button has aria-label', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('button.nav-mobile');
    await expect(btn).toHaveCount(1);
    const label = await btn.getAttribute('aria-label');
    expect(label, 'nav-mobile aria-label').toBeTruthy();
    expect(label.trim().length).toBeGreaterThan(0);
  });
});

test.describe('Google Analytics', () => {
  test('GA loader or gtag script is present', async ({ page }) => {
    await page.goto('/');
    const html = await page.content();
    expect(html).toMatch(/googletagmanager\.com\/gtag\/js|gtag\(/);
  });
});

test.describe('Favicon', () => {
  test('favicon.ico link exists in the head', async ({ page }) => {
    await page.goto('/');
    const fav = page.locator('link[rel="icon"][href*="favicon.ico"]');
    await expect(fav).toHaveCount(1);
  });
});

test.describe('404 page', () => {
  test('serves 404.html for an unknown path', async ({ page }) => {
    const response = await page.goto('/nonexistent-page');
    expect(response, 'response should not be null').not.toBeNull();
    expect(response.status()).toBe(404);
    await expect(page.locator('body')).toContainText('404');
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink).toHaveCount(1);
  });
});

test.describe('Structured data', () => {
  test('JSON-LD with @type Person exists', async ({ page }) => {
    await page.goto('/');
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThan(0);

    let foundPerson = false;
    for (let i = 0; i < count; i++) {
      const raw = await scripts.nth(i).textContent();
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        continue;
      }
      const nodes = Array.isArray(data) ? data : [data];
      if (nodes.some((n) => n && n['@type'] === 'Person')) {
        foundPerson = true;
        break;
      }
    }
    expect(foundPerson, 'JSON-LD with @type "Person"').toBe(true);
  });
});

test.describe('Content integrity', () => {
  test('hero h1 contains "I build financial systems"', async ({ page }) => {
    await page.goto('/');
    const h1 = page.locator('.hero h1').first();
    await expect(h1).toContainText('I build financial systems');
  });

  test('proof strip has exactly 8 metric cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.proof-strip .proof-cell')).toHaveCount(8);
  });

  test('Signature Wins has exactly 9 items', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#wins .win-card')).toHaveCount(9);
  });
});

/* ───────────────────────────────────────────────────────────────────────────
   Responsive viewport coverage — Mobile / Tablet / Desktop.
   Each group sets its viewport via page.setViewportSize() (beforeEach) and
   checks the core above-the-fold structure renders without horizontal scroll.
   ─────────────────────────────────────────────────────────────────────────── */

const RESPONSIVE_VIEWPORTS = [
  { name: 'Mobile (375x812)', width: 375, height: 812 },
  { name: 'Tablet (768x1024)', width: 768, height: 1024 },
  { name: 'Desktop (1440x900)', width: 1440, height: 900 },
];

for (const vp of RESPONSIVE_VIEWPORTS) {
  test.describe(vp.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
    });

    test('page loads with status 200', async ({ page }) => {
      const res = await page.goto('/');
      expect(res, 'navigation response should exist').not.toBeNull();
      expect(res.status()).toBe(200);
    });

    test('hero h1 is visible and states the value prop', async ({ page }) => {
      await page.goto('/');
      const h1 = page.locator('.hero h1').first();
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('I build financial systems');
    });

    test('nav logo "Shaillesh Tannu" is visible', async ({ page }) => {
      await page.goto('/');
      const brand = page.locator('.nav-brand');
      await expect(brand).toBeVisible();
      await expect(brand).toHaveText('Shaillesh Tannu');
    });

    test('hero section is visible', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('section.hero')).toBeVisible();
    });

    test('at least one proof-strip stat cell is visible', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.proof-strip .proof-cell').first()).toBeVisible();
    });

    test('footer and contact section exist', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#contact')).toHaveCount(1);
      await expect(page.locator('footer')).toHaveCount(1);
    });

    test('no horizontal scroll', async ({ page }) => {
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(
        scrollWidth,
        `body.scrollWidth (${scrollWidth}) should not exceed viewport width (${vp.width})`
      ).toBeLessThanOrEqual(vp.width);
    });

    test('chat bubble button is visible on load', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('#hmChatBtn')).toBeVisible();
    });
  });
}

/* ───────────────────────────────────────────────────────────────────────────
   Chat widget UI behaviour. UI only — the worker API call is never exercised.
   ─────────────────────────────────────────────────────────────────────────── */

test.describe('Chat widget', () => {
  test('clicking the bubble opens the panel with the opening message', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('#hmChatPanel');
    await expect(panel).toBeHidden();
    await page.locator('#hmChatBtn').click();
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Hi! I can answer questions');
  });

  test('panel input has the expected placeholder', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hmChatBtn').click();
    const input = page.locator('#hmChatInput');
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('placeholder', 'Ask a question...');
  });

  test('close button (×) closes the panel', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('#hmChatPanel');
    await page.locator('#hmChatBtn').click();
    await expect(panel).toBeVisible();
    await page.locator('#hmChatClose').click();
    await expect(panel).toBeHidden();
  });

  test('input is visible and focusable after the panel opens', async ({ page }) => {
    await page.goto('/');
    await page.locator('#hmChatBtn').click();
    const input = page.locator('#hmChatInput');
    await expect(input).toBeVisible();
    await input.focus();
    await expect(input).toBeFocused();
  });

  test('on mobile (375x812) the panel spans >= 90% of viewport width', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.locator('#hmChatBtn').click();
    const panel = page.locator('#hmChatPanel');
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    expect(box, 'panel bounding box should exist').not.toBeNull();
    expect(
      box.width,
      `panel width (${box && box.width}) should be >= 90% of 375`
    ).toBeGreaterThanOrEqual(375 * 0.9);
  });
});

/* ───────────────────────────────────────────────────────────────────────────
   Chat widget accessibility spot checks — across all three viewports.
   ─────────────────────────────────────────────────────────────────────────── */

test.describe('Chat widget accessibility', () => {
  for (const vp of RESPONSIVE_VIEWPORTS) {
    test(`button/panel/input aria — ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');

      const btn = page.locator('#hmChatBtn');
      await expect(btn).toHaveAttribute('aria-label', /.+/);
      await expect(page.locator('#hmChatInput')).toHaveAttribute('aria-label', /.+/);

      await btn.click();
      const panel = page.locator('#hmChatPanel');
      await expect(panel).toBeVisible();
      await expect(panel).toHaveAttribute('role', 'dialog');
    });
  }
});
