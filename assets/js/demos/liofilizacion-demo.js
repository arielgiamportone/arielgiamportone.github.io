// Cinética de liofilización del ruibarbo (PID PP9884): modelo de Page MR(t) = exp(-k·t^n).
// Parámetros de resultados_clave.md (QA3DS/PID-Liofilizados, generado el 2026-03-16).
const MODELOS = [
  { id: 'fresco', es: 'Fresco', en: 'Fresh', k: 0.2564, n: 0.6074, r2: 0.7639, rmse: 0.07283, color: '#dc2626' },
  { id: 'congelado', es: 'Congelado', en: 'Frozen', k: 0.0869, n: 0.8780, r2: 0.9108, rmse: 0.06326, color: '#2563eb' },
  { id: 'ultra', es: 'Ultracongelado', en: 'Deep-frozen', k: 0.1067, n: 0.8323, r2: 0.9243, rmse: 0.05310, color: '#059669' },
];
export const mr = (m, t) => Math.exp(-m.k * Math.pow(t, m.n));
export const tiempoPara = (m, objetivo) => Math.pow(-Math.log(objetivo) / m.k, 1 / m.n);

const raiz = document.querySelector('[data-demo="liofilizacion"]');
if (raiz) {
  const en = raiz.dataset.lang === 'en';
  const fmt = (x, d) => Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { minimumFractionDigits: d, maximumFractionDigits: d });
  const T = en
    ? { pre: 'Pre-treatment', mr: 'Water still to remove', t5: 'Hours to 10 %', ajuste: 'Fit (R² · RMSE)', eje: 'hours', ejeY: 'MR', meseta: 'observed plateau ≈ 6-10 %' }
    : { pre: 'Pretratamiento', mr: 'Agua por eliminar', t5: 'Horas hasta el 10 %', ajuste: 'Ajuste (R² · RMSE)', eje: 'horas', ejeY: 'MR', meseta: 'meseta observada ≈ 6-10 %' };
  const W = 640, H = 300, M = { l: 44, r: 14, t: 12, b: 34 };
  const x = (t) => M.l + (t / 96) * (W - M.l - M.r);
  const y = (v) => M.t + (1 - v) * (H - M.t - M.b);

  function pintar() {
    const t = Number(raiz.querySelector('[name="t"]').value);
    raiz.querySelector('[data-v="t"]').textContent = `${t} h`;
    let ejes = `<rect x="${M.l}" y="${y(0.1)}" width="${W - M.l - M.r}" height="${y(0.06) - y(0.1)}" class="meseta"/><text x="${W - M.r - 4}" y="${y(0.1) - 4}" text-anchor="end" class="meseta-t">${T.meseta}</text>`;
    for (let h = 0; h <= 96; h += 12) ejes += `<line x1="${x(h)}" x2="${x(h)}" y1="${M.t}" y2="${H - M.b}" class="rej"/><text x="${x(h)}" y="${H - M.b + 16}" text-anchor="middle">${h}</text>`;
    for (let v = 0; v <= 1.001; v += 0.25) ejes += `<line x1="${M.l}" x2="${W - M.r}" y1="${y(v)}" y2="${y(v)}" class="rej"/><text x="${M.l - 6}" y="${y(v) + 4}" text-anchor="end">${fmt(v, 2)}</text>`;
    const curvas = MODELOS.map(m => {
      let d = '';
      for (let h = 0; h <= 96; h += 0.5) d += `${h ? 'L' : 'M'}${x(h).toFixed(1)},${y(mr(m, h)).toFixed(1)}`;
      return `<path d="${d}" fill="none" stroke="${m.color}" stroke-width="2.5"/><circle cx="${x(t)}" cy="${y(mr(m, t))}" r="5" fill="${m.color}"/>`;
    }).join('');
    raiz.querySelector('[data-grafico]').innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="MR(t)">${ejes}<line x1="${x(t)}" x2="${x(t)}" y1="${M.t}" y2="${H - M.b}" class="cursor"/>${curvas}<text x="${W - M.r}" y="${H - 4}" text-anchor="end">${T.eje}</text></svg>`;
    raiz.querySelector('[data-tabla]').innerHTML = `<div class="demo-reg__tabla"><table><tr><th>${T.pre}</th><th>${T.mr} (${t} h)</th><th>${T.t5}</th><th>${T.ajuste}</th></tr>${MODELOS.map(m =>
      `<tr><th><span class="demo-lio__punto" data-c="${m.id}"></span>${en ? m.en : m.es}</th><td>${fmt(mr(m, t) * 100, 1)} %</td><td>${fmt(tiempoPara(m, 0.10), 0)} h</td><td>${fmt(m.r2, 3)} · ${fmt(m.rmse, 3)}</td></tr>`).join('')}</table></div>`;
  }
  raiz.addEventListener('input', pintar);
  raiz.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    raiz.querySelectorAll('[data-tab]').forEach(o => o.setAttribute('aria-selected', String(o === b)));
    raiz.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    const f = raiz.querySelector(`[data-panel="${b.dataset.tab}"] iframe[data-src]`);
    if (f && !f.src) f.src = f.dataset.src;
  }));
  pintar();
}
