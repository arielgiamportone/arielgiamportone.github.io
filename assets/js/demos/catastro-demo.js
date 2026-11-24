// Demo de catastro-enrichment-es: pestañas de resultados y simulador del router por código INE.
const raiz = document.querySelector('[data-demo="catastro"]');
if (raiz) {
  const en = document.documentElement.lang.startsWith('en');
  const pestanas = [...raiz.querySelectorAll('[role="tab"]')];
  pestanas.forEach((t, i) => {
    t.addEventListener('click', () => activar(i));
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + pestanas.length) % pestanas.length;
        activar(j); pestanas[j].focus();
      }
    });
  });
  function activar(i) {
    pestanas.forEach((t, k) => {
      t.setAttribute('aria-selected', String(k === i));
      t.tabIndex = k === i ? 0 : -1;
      raiz.querySelector('#' + t.getAttribute('aria-controls')).hidden = k !== i;
    });
  }
  activar(0);

  // Mismo criterio que resolve_cadastre_driver: la provincia del código INE decide.
  const FORALES = {
    '01': en ? 'Álava foral cadastre (ArcGIS WFS, FES XML filter)' : 'Catastro foral de Álava (WFS de ArcGIS, filtro FES XML)',
    '20': en ? 'Gipuzkoa foral cadastre (INSPIRE WFS 2.0, stored query)' : 'Catastro foral de Gipuzkoa (WFS INSPIRE 2.0, consulta almacenada)',
    '31': en ? 'Navarre cadastre (INSPIRE WFS 2.0, cql_filter)' : 'Catastro de Navarra (WFS INSPIRE 2.0, cql_filter)',
    '48': en ? 'Bizkaia foral cadastre (ArcGIS WFS, reference split in three)' : 'Catastro foral de Bizkaia (WFS de ArcGIS, referencia partida en tres)',
  };
  const DGC = en ? 'Directorate General for Cadastre, DGC (OVC XML + INSPIRE WFS)' : 'Dirección General del Catastro, DGC (OVC XML + WFS INSPIRE)';
  const entrada = raiz.querySelector('[name="ine"]');
  const ruta = raiz.querySelector('[data-ruta]');
  function rutear() {
    const v = entrada.value.trim();
    if (!/^\d{5}$/.test(v)) { ruta.textContent = en ? 'Type a 5-digit code.' : 'Escribe un código de 5 dígitos.'; return; }
    const prov = v.slice(0, 2);
    if (Number(prov) < 1 || Number(prov) > 52) { ruta.textContent = en ? 'No province has that code (01-52).' : 'Ese código de provincia no existe (01-52).'; return; }
    const destino = FORALES[prov] || DGC;
    ruta.innerHTML = `${en ? 'Province' : 'Provincia'} <code>${prov}</code> → <strong>${destino}</strong>`;
  }
  entrada.addEventListener('input', rutear);
  rutear();
}
