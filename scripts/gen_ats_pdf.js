// Genera los PDFs ATS estáticos desde cv_ats.html (una variante por ?v, idioma por ?lang).
// Texto real seleccionable, fuentes embebidas, A4, ATS-friendly. NO usa el diálogo de impresión.
//
// Uso:
//   python3 -m http.server 8731 --bind 0.0.0.0   # servir el repo (Playwright bloquea file://)
//   node scripts/gen_ats_pdf.js                  # genera ATS <Variante> <IDIOMA>.pdf en el root
//
// Para agregar una variante: sumarla a VARIANTS (debe coincidir con la clave en cv_ats.html).
// Overrides por entorno: PW_CHROME (binario chromium), ATS_URL (base), ATS_OUT (carpeta salida).

const path = require('path');
const { chromium } = require('/var/www/educativa/followupper/frontend/node_modules/playwright');

const EXEC = process.env.PW_CHROME || '/var/www/educativa/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome';
const BASE = process.env.ATS_URL || 'http://localhost:8731/cv_ats.html';
const OUT = process.env.ATS_OUT || path.resolve(__dirname, '..');

const ALL = [['marketing', 'Marketing'], ['project', 'Project'], ['moonpay', 'MoonPay'], ['alma', 'Alma']];
// ATS_ONLY=alma,project → sólo esas variantes
const VARIANTS = process.env.ATS_ONLY ? ALL.filter(v => process.env.ATS_ONLY.split(',').includes(v[0])) : ALL;
const LANGS = [['es', 'ES'], ['en', 'EN']];

(async () => {
  const browser = await chromium.launch({ executablePath: EXEC });
  const page = await (await browser.newContext()).newPage();
  for (const [v, vName] of VARIANTS) {
    for (const [lang, lName] of LANGS) {
      await page.goto(`${BASE}?v=${v}&lang=${lang}`, { waitUntil: 'networkidle' });
      await page.emulateMedia({ media: 'print' });
      const name = `ATS ${vName} ${lName}.pdf`;
      await page.pdf({ path: path.join(OUT, name), preferCSSPageSize: true, printBackground: true });
      console.log('wrote', name);
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
