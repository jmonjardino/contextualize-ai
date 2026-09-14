import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const routes = ['/', '/signin', '/ask', '/library', '/library/cost-of-a-chunk', '/graph', '/foundations', '/xyz'];
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const width of [390, 768, 1440]) {
  const issues = [];
  for (const r of routes) {
    const p = await b.newPage({ viewport: { width, height: 900 } });
    const errors = [];
    p.on('pageerror', (e) => errors.push(String(e).slice(0, 90)));
    p.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 90)));
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.waitForTimeout(400);
    const o = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (o > 0 || errors.length) issues.push(`${r} overflow=${o} ${errors.join(' | ')}`);
    await p.close();
  }
  console.log(`[${width}px]`, issues.length ? issues.join('\n   ') : 'clean');
}
await b.close();
