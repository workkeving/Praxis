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

  // Hub → Urgencias → llegada → caso → opción → feedback → explicación
  await page.locator('button:has-text("Urgencias")').first().click();
  await page.waitForTimeout(500);
  await page.locator('button:has-text("Ver paciente")').click();
  await page.waitForTimeout(500);

  // Select first option (whatever it is)
  await page.locator('button.option-card').first().click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/feedback.png',
    fullPage: true,
  });

  await page.locator('button:has-text("Ver explicación")').click();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/explicacion.png',
    fullPage: true,
  });

  // Go back to hub and check expediente
  await page.locator('button:has-text("Volver al hub")').click();
  await page.waitForTimeout(500);
  await page.locator('button:has-text("Expediente")').click();
  await page.waitForTimeout(500);
  await page.screenshot({
    path: 'K:/01. Personal Projects/07. Praxis/tools/screenshots/expediente.png',
    fullPage: true,
  });

  await browser.close();
  console.log('Flow screenshots done.');
})().catch((e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
