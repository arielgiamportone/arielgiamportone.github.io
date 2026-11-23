// Genera los CV en PDF (A4) de cada perfil e idioma a partir de las páginas cv.html del sitio.
//
// Uso:
//   hugo --gc --minify -d /tmp/web && python3 -m http.server 8765 --directory /tmp/web &
//   node scripts/cv_pdf.cjs http://localhost:8765
//
// Escribe static/cv/Ariel_Giamportone_CV_<perfil>_<idioma>.pdf. Requiere Playwright con Chromium.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = (process.argv[2] || 'http://localhost:8765').replace(/\/$/, '');
const SALIDA = path.join(__dirname, '..', 'static', 'cv');
const PAGINAS = [
  ['ia', 'es', '/perfiles/ia/cv.html'],
  ['software', 'es', '/perfiles/software/cv.html'],
  ['sector-publico', 'es', '/perfiles/sector-publico/cv.html'],
  ['economia-azul', 'es', '/perfiles/economia-azul/cv.html'],
  ['ia', 'en', '/en/profiles/ai/cv.html'],
  ['software', 'en', '/en/profiles/software/cv.html'],
  ['sector-publico', 'en', '/en/profiles/public-sector/cv.html'],
  ['economia-azul', 'en', '/en/profiles/blue-economy/cv.html'],
];

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const navegador = await chromium.launch();
  const pagina = await navegador.newPage();
  for (const [perfil, idioma, url] of PAGINAS) {
    const r = await pagina.goto(BASE + url, { waitUntil: 'networkidle' });
    if (!r || !r.ok()) throw new Error(`No se pudo abrir ${url}`);
    const destino = path.join(SALIDA, `Ariel_Giamportone_CV_${perfil}_${idioma}.pdf`);
    await pagina.pdf({ path: destino, format: 'A4', preferCSSPageSize: true, printBackground: true, tagged: true });
    console.log(destino);
  }
  await navegador.close();
})();
