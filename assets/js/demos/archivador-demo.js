// Demo de inspection-photo-archiver: los módulos clean-room del repositorio en Pyodide,
// sobre el sistema de ficheros en memoria del propio Pyodide.
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const BASE = '/demo';

const raiz = document.querySelector('[data-demo="archivador"]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const $ = (s) => raiz.querySelector(s);
  const campo = (n) => raiz.querySelector(`[name="${n}"]`);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const T = en ? {
    cargando: 'Loading Pyodide…', modulos: 'Loading the repository modules…', listo: (s) => `Ready in ${s} s.`, error: 'Could not run the demo: ',
    casos: { nuevo: 'No ledger yet', normal: 'Normal ledger', antiguo: 'Ledger with the old tool\'s header', desconocido: 'Unknown format, with data', bloqueado: 'Open in a spreadsheet app', nube: 'Cloud placeholder not downloaded' },
    acciones: { new: 'new', loaded: 'loaded', migrated: 'migrated', reset: 'reset (after a backup)' },
    resultado: 'safe_ledger (repository)', original: 'Original code', carpeta: (a) => `Folder ${a}`, antes: 'before', despues: 'after',
    filas: (n) => (n < 0 ? 'unreadable' : `${n} rows`), intentos: (n) => `read attempts: ${n}`, aborta: 'Run aborted: nothing written, alert sent',
    perdidas: (n) => `ledger saved with only the 2 new photos: ${n} rows lost, no error`, origBien: 'same result',
    ejDestino: ['Same month', 'Write-up a month later', 'Two visits, months apart', 'Write-up not done yet'],
    resolutor: 'Resolver (repository)', ingenuo: 'Only the photo\'s month', motivos: { same_month: 'its own month', later_month: 'earliest later month', errors: 'error folder: the write-up does not exist yet' },
    indice: 'Index built in one scan', local: 'Site', meses: 'Months with a folder', erroresFalsos: 'photo lost in the error folder',
    pasos: { inicial: '1. Archive as created', mover: '2. Move the whole tree', reorganizar: '3. Someone reorganises one site by hand', duplicado: '4. …and leaves a copy elsewhere', desmontado: '5. Archive not synced' },
    absoluto: 'Absolute link', relativo: 'Relative link', resuelve: (a, b) => `${a} of ${b} resolve to a file`,
    reparacion: 'Repair', reparados: 'repaired', noEnc: 'not found', ambiguos: 'ambiguous: found twice, left for a person', nada: 'nothing to repair',
  } : {
    cargando: 'Cargando Pyodide…', modulos: 'Cargando los módulos del repositorio…', listo: (s) => `Listo en ${s} s.`, error: 'No se pudo ejecutar la demo: ',
    casos: { nuevo: 'Todavía no hay registro', normal: 'Registro normal', antiguo: 'Registro con la cabecera de la herramienta anterior', desconocido: 'Formato desconocido, con datos', bloqueado: 'Abierto en una hoja de cálculo', nube: 'Fichero en la nube sin descargar' },
    acciones: { new: 'nuevo', loaded: 'cargado', migrated: 'migrado', reset: 'reiniciado (tras una copia)' },
    resultado: 'safe_ledger (repositorio)', original: 'Código original', carpeta: (a) => `Carpeta ${a}`, antes: 'antes', despues: 'después',
    filas: (n) => (n < 0 ? 'ilegible' : `${n} filas`), intentos: (n) => `intentos de lectura: ${n}`, aborta: 'Proceso abortado: no se escribe nada y se envía una alerta',
    perdidas: (n) => `guarda el registro solo con las 2 fotos nuevas: ${n} filas perdidas, sin ningún error`, origBien: 'mismo resultado',
    ejDestino: ['Mismo mes', 'Parte redactado un mes después', 'Dos visitas separadas por meses', 'Parte aún sin redactar'],
    resolutor: 'Resolutor (repositorio)', ingenuo: 'Solo el mes de la foto', motivos: { same_month: 'su propio mes', later_month: 'el primer mes posterior', errors: 'carpeta de errores: el parte todavía no existe' },
    indice: 'Índice construido en una sola pasada', local: 'Local', meses: 'Meses con carpeta', erroresFalsos: 'foto perdida en la carpeta de errores',
    pasos: { inicial: '1. Archivo recién creado', mover: '2. Mover el árbol entero', reorganizar: '3. Alguien reorganiza un local a mano', duplicado: '4. …y deja una copia en otra carpeta', desmontado: '5. Archivo sin sincronizar' },
    absoluto: 'Enlace absoluto', relativo: 'Enlace relativo', resuelve: (a, b) => `${a} de ${b} llegan a un fichero`,
    reparacion: 'Reparación', reparados: 'reparados', noEnc: 'no encontrados', ambiguos: 'ambiguos: aparece dos veces, se deja a una persona', nada: 'nada que reparar',
  };

  let py = null;
  const llamar = (fn, datos) => JSON.parse(py.globals.get(fn)(JSON.stringify({ base: BASE, ...datos })));
  const tarjeta = (titulo, cuerpo, bien) => `<div class="demo-ins__tarjeta ${bien ? 'bien' : ''}"><p class="demo-reg__etq">${titulo}</p>${cuerpo}</div>`;

  // ------------------------------------------------------------------ registro
  const CASOS = Object.keys(T.casos);
  function registro(caso) {
    const r = llamar('registro', { caso });
    const ficheros = (lista) => lista.length ? `<ul class="demo-arc__fich">${lista.map(f => `<li><code>${esc(f.nombre)}</code> · ${T.filas(f.filas)}</li>`).join('')}</ul>` : '<p class="tenue pequeno">—</p>';
    const real = r.ok
      ? `<p class="ok">✔ ${esc(T.acciones[r.accion] ?? r.accion)}</p>${r.copia ? `<p class="pequeno">↳ <code>${esc(r.copia)}</code></p>` : ''}${r.avisos.map(a => `<p class="pequeno tenue">${esc(a)}</p>`).join('')}`
      : `<p class="aviso">⏸ ${T.aborta}</p><p class="pequeno tenue">${esc(r.error)}</p>`;
    // Lo que habría hecho el código original: leer mal o no reconocer la cabecera = registro vacío.
    const habia = r.antes.find(f => f.nombre === 'ledger.csv')?.filas ?? 0;
    const pierde = ['antiguo', 'desconocido', 'bloqueado', 'nube'].includes(caso) ? habia : 0;
    const orig = pierde ? `<p class="mal">✘ ${T.perdidas(pierde)}</p>` : `<p class="tenue">${T.origBien}</p>`;
    $('[data-salida="registro"]').innerHTML = `<div class="demo-ins__comparar">
      ${tarjeta(T.resultado, `${real}<p class="pequeno tenue">${r.intentos ? T.intentos(r.intentos) : ''}</p>`, true)}
      ${tarjeta(T.original, orig, false)}
      ${tarjeta(T.carpeta(T.antes), ficheros(r.antes), true)}
      ${tarjeta(T.carpeta(T.despues), ficheros(r.despues), true)}</div>`;
    raiz.querySelectorAll('[data-ejemplos="registro"] [data-i]').forEach(b => b.classList.toggle('activo', CASOS[Number(b.dataset.i)] === caso));
  }

  // ------------------------------------------------------------------ destino
  const EJ_DESTINO = [['L12', '2026-08-20'], ['L12', '2026-10-03'], ['L07', '2026-10-15'], ['L21', '2026-12-01']];
  function destino() {
    const r = llamar('destino', { local: campo('local').value, fecha: campo('fecha').value });
    const malIngenuo = r.ingenuo !== r.carpeta;
    const filas = Object.entries(r.indice).map(([k, v]) => `<tr${k === campo('local').value ? ' class="fila-extra"' : ''}><th>${esc(k)}</th><td>${v.map(esc).join(' · ')}</td></tr>`).join('');
    $('[data-salida="destino"]').innerHTML = `<div class="demo-ins__comparar">
      ${tarjeta(T.resolutor, `<p class="demo-arc__ruta"><code>${esc(r.carpeta)}</code></p><p class="pequeno ${r.motivo === 'errors' ? 'tenue' : 'ok'}">${esc(T.motivos[r.motivo])}</p>`, true)}
      ${tarjeta(T.ingenuo, `<p class="demo-arc__ruta"><code>${esc(r.ingenuo)}</code></p>${malIngenuo ? `<p class="pequeno mal">✘ ${T.erroresFalsos}</p>` : `<p class="pequeno tenue">${T.origBien}</p>`}`, !malIngenuo)}
      </div><p class="demo-reg__etq">${T.indice}</p><div class="demo-reg__tabla"><table class="demo-reg__memo"><tr><th>${T.local}</th><th>${T.meses}</th></tr>${filas}</table></div>`;
  }

  // ------------------------------------------------------------------ enlaces
  const PASOS = Object.keys(T.pasos);
  function enlaces(paso) {
    const r = llamar('enlaces', { paso });
    const ok = (l) => l.filter(x => x.ok).length;
    const lista = (l, rep) => `<ul class="demo-arc__enl">${l.map((x, i) => {
      const nuevo = rep && rep.enlaces && rep.enlaces[i] !== x.enlace ? ` → <code>${esc(rep.enlaces[i])}</code>` : '';
      const marca = rep?.ambiguos?.includes(i) ? '<span class="mal">?</span>' : (x.ok ? '<span class="ok">✔</span>' : (nuevo ? '<span class="ok">↺</span>' : '<span class="mal">✘</span>'));
      return `<li>${marca} <code>${esc(x.enlace)}</code>${nuevo}</li>`;
    }).join('')}</ul>`;
    let rep = '';
    if (r.reparacion) {
      const p = r.reparacion;
      rep = p.error
        ? `<p class="aviso pequeno">⏸ ${esc(p.error)}</p>`
        : `<p class="pequeno ${p.reparados.length || p.ambiguos.length ? '' : 'tenue'}">${p.reparados.length || p.ambiguos.length || p.no_encontrados.length
          ? `${T.reparados}: ${p.reparados.length} · ${T.noEnc}: ${p.no_encontrados.length} · ${T.ambiguos}: ${p.ambiguos.length}` : T.nada}</p>`;
    }
    $('[data-salida="enlaces"]').innerHTML = `<p class="pequeno">📁 <code>${esc(r.carpeta)}/</code></p>
      <div class="demo-ins__comparar">
        ${tarjeta(`${T.absoluto} · ${T.resuelve(ok(r.absolutos), r.absolutos.length)}`, lista(r.absolutos), ok(r.absolutos) === r.absolutos.length)}
        ${tarjeta(`${T.relativo} · ${T.resuelve(ok(r.relativos), r.relativos.length)}`, lista(r.relativos, r.reparacion) + (rep ? `<p class="demo-reg__etq">${T.reparacion}</p>${rep}` : ''), true)}
      </div>`;
    raiz.querySelectorAll('[data-ejemplos="enlaces"] [data-i]').forEach(b => b.classList.toggle('activo', PASOS[Number(b.dataset.i)] === paso));
  }

  function botones(cual, textos, al) {
    const caja = $(`[data-ejemplos="${cual}"]`);
    caja.innerHTML = textos.map((t, i) => `<button type="button" class="boton boton--secundario boton--chico" data-i="${i}">${esc(t)}</button>`).join('');
    caja.addEventListener('click', (ev) => { const b = ev.target.closest('[data-i]'); if (b) al(Number(b.dataset.i)); });
  }

  async function cargar() {
    const t0 = performance.now();
    const estado = $('[data-estado]');
    estado.textContent = T.cargando;
    const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs');
    py = await loadPyodide({ indexURL: PYODIDE });
    estado.textContent = T.modulos;
    py.FS.mkdirTree('/archivador');
    py.FS.mkdirTree(BASE);
    for (const url of raiz.dataset.modulos.split(' ')) {
      const texto = await (await fetch(url)).text();
      const nombre = url.split('/').pop();
      py.FS.writeFile('/archivador/' + nombre, texto);
      if (nombre === 'demo.py') $('[data-codigo]').textContent = texto.trim();
    }
    py.runPython("import sys; sys.path.insert(0, '/archivador')\nfrom demo import registro, destino, enlaces");
    estado.textContent = T.listo(((performance.now() - t0) / 1000).toFixed(1));
    $('[data-cargar]').hidden = true;
    $('[data-resultado]').hidden = false;
    botones('registro', CASOS.map(k => T.casos[k]), (i) => registro(CASOS[i]));
    botones('destino', T.ejDestino, (i) => { campo('local').value = EJ_DESTINO[i][0]; campo('fecha').value = EJ_DESTINO[i][1]; destino(); });
    botones('enlaces', PASOS.map(k => T.pasos[k]), (i) => enlaces(PASOS[i]));
    registro('bloqueado'); destino(); enlaces('inicial');
  }

  raiz.querySelector('[data-panel="destino"]').addEventListener('input', () => py && destino());
  raiz.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    raiz.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    raiz.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
  }));
  $('[data-cargar]').addEventListener('click', async (ev) => {
    ev.currentTarget.disabled = true;
    try { await cargar(); } catch (e) { $('[data-estado]').textContent = T.error + e.message; ev.currentTarget.disabled = false; }
  });
}
