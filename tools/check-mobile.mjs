import { chromium } from 'playwright-core';
import { existsSync } from 'node:fs';

const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const exe = candidates.find(existsSync);

(async () => {
  const browser = await chromium.launch({ executablePath: exe, headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5173/');
  await page.waitForLoadState('networkidle');

  const overflow = await page.evaluate(() => ({
    docWidth: document.documentElement.scrollWidth,
    docHeight: document.documentElement.scrollHeight,
    viewWidth: window.innerWidth,
    viewHeight: window.innerHeight,
  }));
  console.log('Overflow check:', JSON.stringify(overflow));

  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/hub-mobile.png',
    fullPage: false,
  });
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/hub-mobile-full.png',
    fullPage: true,
  });
  console.log('Screenshots saved.');

  // click on Urgencias sala
  await page.locator('button:has-text("Urgencias")').first().click({ timeout: 5000 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/llegada.png',
  });

  await page.locator('button:has-text("Ver paciente")').click();
  await page.waitForTimeout(800);
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/caso.png',
    fullPage: true,
  });

  await browser.close();
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
