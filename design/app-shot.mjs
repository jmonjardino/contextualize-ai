import { chromium } from 'playwright';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const spec of process.argv.slice(2)) {
  const [path, name, w, h, full] = spec.split('|');
  const p = await b.newPage({ viewport: { width: +(w||1440), height: +(h||900) } });
  await p.goto(BASE + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.screenshot({ path: 'app-' + name + '.png', fullPage: full === 'full' });
  await p.close();
  console.log('shot', name, overflow ? 'OVERFLOW ' + overflow : '');
}
await b.close();
