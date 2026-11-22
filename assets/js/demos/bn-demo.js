// Interfaz de la red bayesiana de fisheries-sustainability-mlops.
import { preparar, consultar } from './bn.js';

const raiz = document.querySelector('[data-demo="bn"]');
if (raiz) iniciar(raiz);

async function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const red = await (await fetch(raiz.dataset.red)).json();
  const modelo = preparar(red);
  const OBJ = 'Sustainable';
  const NOMBRES = {
    SST_C_disc: en ? 'Sea surface temperature' : 'Temperatura del mar',
    Chlorophyll_mg_m3_disc: en ? 'Chlorophyll' : 'Clorofila',
    Fishing_Effort_hours_disc: en ? 'Fishing effort' : 'Esfuerzo pesquero',
    CPUE_disc: en ? 'Catch per unit effort (CPUE)' : 'Captura por unidad de esfuerzo (CPUE)',
    Fleet_Size_disc: en ? 'Fleet size' : 'Tamaño de flota',
    Fuel_Consumption_L_disc: en ? 'Fuel consumption' : 'Consumo de combustible',
    Operating_Cost_USD_disc: en ? 'Operating cost' : 'Coste operativo',
    Fish_Price_USD_ton_disc: en ? 'Fish price' : 'Precio del pescado',
    Sustainable: en ? 'Sustainable operation' : 'Operación sostenible',
  };
  const COL = { SST_C_disc: 0, Chlorophyll_mg_m3_disc: 0, Fishing_Effort_hours_disc: 1, CPUE_disc: 1, Fleet_Size_disc: 1, Fuel_Consumption_L_disc: 2, Operating_Cost_USD_disc: 2, Fish_Price_USD_ton_disc: 2, Sustainable: 3 };
  const ESTADO = en ? { Bajo: 'Low', Medio: 'Medium', Alto: 'High', No: 'No', Si: 'Yes' } : { Bajo: 'Bajo', Medio: 'Medio', Alto: 'Alto', No: 'No', Si: 'Sí' };
  const T = en
    ? { libre: 'Not fixed', obs: 'Observing a value updates beliefs in both directions: causes and effects.', do: 'Intervening sets a value from outside: the variable stops depending on its causes, so only its effects change.', base: 'baseline', fijado: 'fixed' }
    : { libre: 'Sin fijar', obs: 'Observar un valor actualiza las creencias en los dos sentidos: causas y efectos.', do: 'Intervenir fija un valor desde fuera: la variable deja de depender de sus causas, así que solo cambian sus efectos.', base: 'referencia', fijado: 'fijado' };

  const fijados = {};
  let modo = 'obs';
  const tarjetas = {};
  const base = consultar(modelo, OBJ)[1];

  for (const n of red.nodos) {
    const t = document.createElement('div');
    t.className = 'nodo-bn' + (n.id === OBJ ? ' nodo-bn--objetivo' : '');
    t.dataset.id = n.id;
    const opciones = n.id === OBJ ? '' :
      `<select aria-label="${NOMBRES[n.id]}"><option value="">${T.libre}</option>${n.estados.map(s => `<option value="${s}">${ESTADO[s]}</option>`).join('')}</select>`;
    t.innerHTML = `<p class="nodo-bn__nombre">${NOMBRES[n.id]}</p>${opciones}<div class="nodo-bn__barras"></div>`;
    raiz.querySelector(`[data-col="${COL[n.id]}"]`).appendChild(t);
    tarjetas[n.id] = t;
    const sel = t.querySelector('select');
    if (sel) sel.addEventListener('change', () => {
      if (sel.value) fijados[n.id] = sel.value; else delete fijados[n.id];
      actualizar();
    });
  }

  raiz.querySelectorAll('[name="modo"]').forEach(r => r.addEventListener('change', () => { modo = r.value; actualizar(); }));
  raiz.querySelector('[data-reset]').addEventListener('click', () => {
    Object.keys(fijados).forEach(k => delete fijados[k]);
    raiz.querySelectorAll('select').forEach(s => { s.value = ''; });
    actualizar();
  });

  function actualizar() {
    raiz.querySelector('[data-explica-modo]').textContent = modo === 'obs' ? T.obs : T.do;
    const ev = modo === 'obs' ? fijados : {};
    const dox = modo === 'do' ? fijados : {};
    for (const n of red.nodos) {
      const t = tarjetas[n.id];
      const p = consultar(modelo, n.id, ev, dox);
      t.classList.toggle('nodo-bn--fijado', n.id in fijados);
      const barras = t.querySelector('.nodo-bn__barras');
      if (n.id === OBJ) {
        const ps = p[1];
        const dif = ps - base;
        barras.innerHTML = `<p class="nodo-bn__grande">${(ps * 100).toFixed(1)} %</p>
          <div class="barra"><span style="width:${(ps * 100).toFixed(1)}%"></span></div>
          <p class="nodo-bn__dif ${dif > 0.0005 ? 'sube' : dif < -0.0005 ? 'baja' : ''}">${dif >= 0 ? '+' : ''}${(dif * 100).toFixed(1)} pp · ${T.base} ${(base * 100).toFixed(1)} %</p>`;
      } else {
        barras.innerHTML = n.estados.map((s, i) =>
          `<div class="fila-bn"><span>${ESTADO[s]}</span><div class="barra"><span style="width:${(p[i] * 100).toFixed(1)}%"></span></div><span>${Math.round(p[i] * 100)}%</span></div>`).join('');
      }
    }
    dibujarAristas();
  }

  function dibujarAristas() {
    const svg = raiz.querySelector('.demo-bn__aristas');
    const marco = raiz.querySelector('.demo-bn__grafo').getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${marco.width} ${marco.height}`);
    let html = '<defs><marker id="bn-flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z"/></marker></defs>';
    for (const n of red.nodos) {
      for (const padre of n.padres) {
        const a = tarjetas[padre].getBoundingClientRect();
        const b = tarjetas[n.id].getBoundingClientRect();
        const cortada = modo === 'do' && n.id in fijados;
        const x1 = a.right - marco.left, y1 = a.top + a.height / 2 - marco.top;
        let x2 = b.left - marco.left, y2 = b.top + b.height / 2 - marco.top;
        if (COL[padre] === COL[n.id]) { // misma columna: de abajo arriba
          const xa = a.left + a.width / 2 - marco.left, ya = a.bottom - marco.top;
          html += `<path class="${cortada ? 'cortada' : ''}" d="M${xa},${ya} L${xa},${b.top - marco.top}" marker-end="url(#bn-flecha)"/>`;
          continue;
        }
        const cx = (x1 + x2) / 2;
        html += `<path class="${cortada ? 'cortada' : ''}" d="M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}" marker-end="url(#bn-flecha)"/>`;
      }
    }
    svg.innerHTML = html;
  }

  new ResizeObserver(dibujarAristas).observe(raiz.querySelector('.demo-bn__grafo'));
  actualizar();
}
