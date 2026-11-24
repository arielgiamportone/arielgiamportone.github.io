// Demo de multi-tenant-asset-register: los módulos clean-room del repositorio ejecutándose en Pyodide.
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

const raiz = document.querySelector('[data-demo="registro"]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const $ = (s) => raiz.querySelector(s);
  const campo = (n) => raiz.querySelector(`[name="${n}"]`);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const eur = (x) => Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' }) + ' €';
  const estado = $('[data-estado]');

  const T = en ? {
    cargando: 'Loading Pyodide…', modulos: 'Loading the repository modules…', listo: (s) => `Ready in ${s} s.`, error: 'Could not run the demo: ',
    rechazo: 'Refused', acumulada: 'Accumulated depreciation', dotacion: 'Depreciation for the year', neto: 'Net book value', noAmort: 'Not depreciated',
    memoria: 'Calculation memo', inicial: 'Starting point', una: 'First run', dos: 'Second run (same target year)', sinEstado: 'Second run without recording the last year applied',
    coste: 'Replacement cost', hasta: 'Revalued through', cuadra: 'Reconciled: every account matches to the cent.', cuenta: 'Account', metrica: 'Metric', nuestro: 'Migrated', legado: 'Legacy', delta: 'Delta', sospechosos: 'Assets to check',
    metricas: { cost: 'cost', accumulated: 'accumulated', net: 'net' }, inflado: (p) => `+${p} %, no warning`, igual: 'no change',
  } : {
    cargando: 'Cargando Pyodide…', modulos: 'Cargando los módulos del repositorio…', listo: (s) => `Listo en ${s} s.`, error: 'No se pudo ejecutar la demo: ',
    rechazo: 'Rechazada', acumulada: 'Amortización acumulada', dotacion: 'Dotación del ejercicio', neto: 'Valor neto contable', noAmort: 'No se amortiza',
    memoria: 'Memoria de cálculo', inicial: 'Punto de partida', una: 'Primera ejecución', dos: 'Segunda ejecución (mismo año objetivo)', sinEstado: 'Segunda ejecución sin guardar el último año aplicado',
    coste: 'Coste de reposición', hasta: 'Revalorizado hasta', cuadra: 'Cuadra: todas las cuentas coinciden al céntimo.', cuenta: 'Cuenta', metrica: 'Métrica', nuestro: 'Migrado', legado: 'Anterior', delta: 'Diferencia', sospechosos: 'Bienes a revisar',
    metricas: { cost: 'coste', accumulated: 'acumulada', net: 'neto' }, inflado: (p) => `+${p} %, sin aviso`, igual: 'sin cambios',
  };

  // Traducción de las claves y textos de la memoria que devuelve depreciation.py (en inglés en el código).
  const MEMO = en ? {
    base: 'Depreciable base', base_rule: 'Base rule', useful_life_years: 'Useful life (years)', useful_life_source: 'Source of the useful life',
    method: 'Method', balance_source: 'Source of the balance', rule: 'Rule',
  } : {
    base: 'Base amortizable', base_rule: 'Regla de la base', useful_life_years: 'Vida útil (años)', useful_life_source: 'Origen de la vida útil',
    method: 'Método', balance_source: 'Origen del saldo', rule: 'Regla',
    'cost minus land (land acts as residual)': 'coste menos suelo (el suelo hace de valor residual)',
    'cost minus residual value': 'coste menos valor residual', 'full cost, no residual': 'coste completo, sin residual',
    'asset record': 'ficha del bien', 'tenant table': 'tabla de la sede', 'default by category': 'valor por defecto de la categoría',
    'straight-line, monthly, inclusive start month': 'lineal, mensual, contando entero el mes de alta',
    'computed': 'calculado', 'loaded from approved closing': 'cargado de un cierre aprobado',
    'historical/artistic heritage is not depreciated': 'el patrimonio histórico-artístico no se amortiza',
    'land has an indefinite useful life': 'el suelo tiene vida útil indefinida',
    'asset is not owned by this entity': 'el bien no es propiedad de la entidad',
    'no cost recorded': 'no hay coste registrado', 'no in-service date': 'no hay fecha de puesta en servicio',
  };
  const tr = (s) => MEMO[s] ?? s;

  const EJ_SQL = [
    { t: en ? 'LIKE with a parameter' : 'LIKE con parámetro', sql: "SELECT id, nombre FROM bienes\nWHERE nombre LIKE '%plaza%' AND cuenta = ? AND id % 2 = 0", p: true },
    { t: en ? 'Same, without parameters' : 'Igual, sin parámetros', sql: "SELECT id, nombre FROM bienes\nWHERE nombre LIKE '%plaza%' AND id % 2 = 0", p: false },
    { t: 'INSERT OR IGNORE', sql: 'INSERT OR IGNORE INTO cuentas (codigo, nombre) VALUES (?, ?)', p: true },
    { t: en ? 'OR REPLACE without a key' : 'OR REPLACE sin clave', sql: 'INSERT OR REPLACE INTO cuentas (codigo, nombre, vida) VALUES (?, ?, ?)', p: true, claves: '' },
    { t: en ? 'OR REPLACE with a key' : 'OR REPLACE con clave', sql: 'INSERT OR REPLACE INTO cuentas (codigo, nombre, vida) VALUES (?, ?, ?)', p: true, claves: 'cuentas: codigo' },
    { t: en ? 'Dates' : 'Fechas', sql: "SELECT * FROM cambios\nWHERE creado >= date('now', '-30 days') AND texto <> 'date(''now'')'", p: false },
    { t: 'DDL', sql: 'CREATE TABLE fotos (id INTEGER PRIMARY KEY AUTOINCREMENT, bien_id INTEGER, imagen BLOB);\nALTER TABLE bienes ADD COLUMN vrm REAL', p: false },
  ];
  const EJ_SEDE = ['VN', ' San_Roque ', 'puerto_norte', 'otra_sede', "vn'; DROP SCHEMA public;--", '../../etc'];
  const EJ_AMORT = [
    { t: en ? 'Building with land' : 'Edificio con suelo', v: { categoria: 'building', coste: '250000', alta: '2015-03-31', a_fecha: '2025-12-31', suelo: '50000' } },
    { t: en ? 'Vehicle, 8-year life on record' : 'Vehículo con vida en la ficha', v: { categoria: 'vehicle', coste: '32450.50', alta: '2022-07-15', a_fecha: '2025-12-31', vida: '8' } },
    { t: en ? 'Furniture with residual value' : 'Mobiliario con residual', v: { categoria: 'furniture', coste: '1499.99', alta: '2025-01-31', a_fecha: '2025-12-31', residual: '99.99' } },
    { t: en ? 'Heritage with no date' : 'Patrimonio sin fecha', v: { categoria: 'heritage', coste: '18000', a_fecha: '2025-12-31' } },
    { t: en ? 'On loan, not owned' : 'Cedido, no propio', v: { categoria: 'equipment', coste: '5400', alta: '2021-05-01', a_fecha: '2025-12-31', propio: false } },
    { t: en ? 'Balance from a year-end close' : 'Saldo de un cierre', v: { categoria: 'building', coste: '410000', alta: '1998-06-01', a_fecha: '2025-12-31', saldo: '226120.37' } },
  ];
  const CONC_NUESTRAS = 'A-001;211;180000.00;43200.00\nA-002;211;95000.00;12666.67\nA-003;216;1499.99;140.00\nA-004;218;32450.50;12169.00';
  const CONC_LEGADO = 'A-001;211;180000.00;43200.00\nA-002;211;95000.00;12666.66\nA-003;216;1499.99;140.00\nA-004;218;32450.50;12169.00';

  let py = null;
  const llamar = (fn, datos) => JSON.parse(py.globals.get(fn)(JSON.stringify(datos)));

  async function cargar() {
    const t0 = performance.now();
    estado.textContent = T.cargando;
    const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs');
    py = await loadPyodide({ indexURL: PYODIDE });
    estado.textContent = T.modulos;
    py.FS.mkdirTree('/registro');
    let puente = '';
    for (const url of raiz.dataset.modulos.split(' ')) {
      const texto = await (await fetch(url)).text();
      const nombre = url.split('/').pop();
      py.FS.writeFile('/registro/' + nombre, texto);
      if (nombre === 'demo.py') puente = texto;
    }
    py.runPython("import sys; sys.path.insert(0, '/registro')\nfrom demo import traducir, sede, amortizar, revalorizar, conciliar");
    $('[data-codigo]').textContent = puente.trim();
    estado.textContent = T.listo(((performance.now() - t0) / 1000).toFixed(1));
    $('[data-cargar]').hidden = true;
    $('[data-resultado]').hidden = false;
    rellenarEjemplos();
    sql(); sedeR(); amort(); reval(); conc();
  }

  function botones(cual, lista, al) {
    const caja = $(`[data-ejemplos="${cual}"]`);
    caja.innerHTML = lista.map((e, i) => `<button type="button" class="boton boton--secundario boton--chico" data-i="${i}">${esc(e.t ?? e)}</button>`).join('');
    caja.addEventListener('click', (ev) => { const b = ev.target.closest('[data-i]'); if (b) al(lista[Number(b.dataset.i)]); });
  }

  function rellenarEjemplos() {
    const ponerSql = (e) => { campo('sql').value = e.sql; campo('parametros').checked = e.p; if (e.claves !== undefined) campo('claves').value = e.claves; sql(); };
    botones('sql', EJ_SQL, ponerSql);
    ponerSql(EJ_SQL[0]);
    botones('sede', EJ_SEDE.map(t => ({ t })), (e) => { campo('sede').value = e.t; sedeR(); });
    campo('sede').value = EJ_SEDE[0];
    const ponerAmort = (e) => {
      for (const n of ['coste', 'alta', 'a_fecha', 'suelo', 'residual', 'vida', 'saldo']) campo(n).value = e.v[n] ?? '';
      campo('categoria').value = e.v.categoria; campo('propio').checked = e.v.propio !== false; amort();
    };
    botones('amort', EJ_AMORT, ponerAmort);
    ponerAmort(EJ_AMORT[0]);
    campo('c_nuestras').value = CONC_NUESTRAS;
    campo('c_legado').value = CONC_LEGADO;
  }

  function sql() {
    const r = llamar('traducir', { sql: campo('sql').value, parametros: campo('parametros').checked, claves: campo('claves').value });
    const s = $('[data-salida="sql"]');
    s.classList.toggle('mal', !r.ok);
    s.textContent = r.ok ? r.sql : `${T.rechazo}: ${r.error}`;
  }

  function sedeR() {
    const r = llamar('sede', { sede: campo('sede').value });
    const s = $('[data-salida="sede"]');
    s.classList.toggle('mal', !r.ok);
    s.textContent = r.ok ? r.sql : `${T.rechazo}: ${r.error}`;
  }

  function amort() {
    const d = { categoria: campo('categoria').value, propio: campo('propio').checked };
    for (const n of ['coste', 'alta', 'a_fecha', 'suelo', 'residual', 'vida', 'saldo']) d[n] = campo(n).value.trim();
    const s = $('[data-salida="amort"]');
    try {
      const r = llamar('amortizar', d);
      const cifras = r.amortizable
        ? `<div><dt>${T.acumulada}</dt><dd>${eur(r.acumulada)}</dd></div><div><dt>${T.dotacion}</dt><dd>${eur(r.dotacion)}</dd></div><div class="destacado"><dt>${T.neto}</dt><dd>${eur(r.neto)}</dd></div>`
        : `<div class="destacado"><dt>${T.noAmort}</dt><dd>${esc(tr(r.memoria.rule))}</dd></div><div><dt>${T.neto}</dt><dd>${eur(r.neto)}</dd></div>`;
      const memo = Object.entries(r.memoria).map(([k, v]) => `<tr><th>${esc(tr(k))}</th><td>${k === 'base' ? eur(v) : esc(tr(String(v)))}</td></tr>`).join('');
      s.innerHTML = `<dl class="demo-cat__datos">${cifras}</dl><p class="demo-reg__etq">${T.memoria}</p><table class="demo-reg__memo">${memo}</table>`;
    } catch (e) {
      s.innerHTML = `<p class="mal">${esc(limpiar(e))}</p>`;
    }
  }

  function reval() {
    const coef = {};
    for (const l of campo('r_coef').value.split('\n')) { const m = l.split(':'); if (m.length === 2 && m[0].trim()) coef[m[0].trim()] = m[1].trim(); }
    const s = $('[data-salida="reval"]');
    try {
      const r = llamar('revalorizar', { coste: campo('r_coste').value, acumulada: campo('r_acumulada').value, vida: campo('r_vida').value, hasta: campo('r_hasta').value, coeficientes: coef, objetivo: campo('r_objetivo').value });
      const pct = ((Number(r.sin_estado.coste) / Number(r.una.coste) - 1) * 100).toLocaleString(en ? 'en-GB' : 'es-ES', { maximumFractionDigits: 1 });
      const fila = (t, x, nota, cls = '') => `<tr class="${cls}"><th>${t}</th><td>${eur(x.coste)}</td><td>${eur(x.acumulada)}</td><td>${eur(x.neto)}</td><td>${x.hasta}</td><td>${nota}</td></tr>`;
      s.innerHTML = `<div class="demo-reg__tabla"><table><tr><th></th><th>${T.coste}</th><th>${T.acumulada}</th><th>${T.neto}</th><th>${T.hasta}</th><th></th></tr>
        ${fila(T.inicial, r.inicial, '')}${fila(T.una, r.una, '')}${fila(T.dos, r.dos, `<span class="ok">✔ ${T.igual}</span>`)}${fila(T.sinEstado, r.sin_estado, `<span class="mal">✘ ${T.inflado(pct)}</span>`, 'fila-extra')}</table></div>`;
    } catch (e) {
      s.innerHTML = `<p class="mal">${esc(limpiar(e))}</p>`;
    }
  }

  function filas(texto) {
    return texto.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
      const [id, cuenta, coste, acumulada] = l.split(';').map(x => (x ?? '').trim());
      return { id, cuenta, coste, acumulada };
    });
  }

  function conc() {
    const s = $('[data-salida="conc"]');
    try {
      const r = llamar('conciliar', { nuestras: filas(campo('c_nuestras').value), legado: filas(campo('c_legado').value) });
      if (!r.length) { s.innerHTML = `<p class="ok">✔ ${T.cuadra}</p>`; return; }
      s.innerHTML = `<div class="demo-reg__tabla"><table><tr><th>${T.cuenta}</th><th>${T.metrica}</th><th>${T.nuestro}</th><th>${T.legado}</th><th>${T.delta}</th><th>${T.sospechosos}</th></tr>
        ${r.map(p => `<tr class="fila-extra"><td>${esc(p.cuenta)}</td><td>${esc(T.metricas[p.metrica] ?? p.metrica)}</td><td>${eur(p.nuestro)}</td><td>${eur(p.legado)}</td><td class="mal">${eur(p.delta)}</td><td>${esc(p.sospechosos.join(', '))}</td></tr>`).join('')}</table></div>`;
    } catch (e) {
      s.innerHTML = `<p class="mal">${esc(limpiar(e))}</p>`;
    }
  }

  // Los errores de Python llegan con toda la traza; nos quedamos con la última línea.
  function limpiar(e) { const l = String(e.message || e).trim().split('\n'); return l[l.length - 1]; }

  raiz.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    raiz.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    raiz.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
  }));

  const panel = (n) => raiz.querySelector(`[data-panel="${n}"]`);
  panel('sql').addEventListener('input', (ev) => { if (!py) return; if (ev.target.name === 'sede') sedeR(); else sql(); });
  panel('amort').addEventListener('input', () => py && amort());
  panel('reval').addEventListener('input', () => py && reval());
  panel('conc').addEventListener('input', () => py && conc());

  $('[data-cargar]').addEventListener('click', async (ev) => {
    ev.currentTarget.disabled = true;
    try { await cargar(); } catch (e) { estado.textContent = T.error + e.message; ev.currentTarget.disabled = false; }
  });
}
