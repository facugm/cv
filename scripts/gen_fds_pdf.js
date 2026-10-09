// Genera <NAME>.pdf y <NAME>.txt (versión ATS en orden de lectura, desde el innerText de los `.page` del DOM)
// a partir de <NAME>.html en el root. Nació para el CV Fuera de Serie (eliminado en oct 2026); hoy lo usa
// ATS_Canonical_Junior_Project_Manager_EN.html.
// Uso: python3 -m http.server 8731 --bind 127.0.0.1  (en el root del repo) && node scripts/gen_fds_pdf.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('/var/www/educativa/followupper/frontend/node_modules/playwright');

const EXEC = process.env.PW_CHROME || '/var/www/educativa/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
// FDS_NAME=<nombre sin extensión> para otra versión.
const NAME = process.env.FDS_NAME || 'ATS_Canonical_Junior_Project_Manager_EN';
const URL = process.env.FDS_URL || `http://localhost:8731/${NAME}.html`;
const OUT = path.resolve(__dirname, '..', NAME);

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await browser.newPage();
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });
  // innerText respeta el orden del documento; pdftotext mezcla columnas.
  const txt = await page.evaluate(() => [...document.querySelectorAll('.page')]
    .map(p => p.innerText.replace(/\n{3,}/g, '\n\n').trim()).join('\n\n'));
  fs.writeFileSync(OUT + '.txt', txt + '\n');
  await page.pdf({ path: OUT + '.pdf', preferCSSPageSize: true, printBackground: true });
  await browser.close();
  console.log('wrote', NAME + '.pdf', NAME + '.txt');
})().catch(e => { console.error(e); process.exit(1); });
