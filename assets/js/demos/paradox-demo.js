// Demo de paradox-db-py: el paquete real de PyPI ejecutándose en el navegador con Pyodide.
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

const PY = `
import json
from pathlib import Path
from paradoxdb import open_table

def leer(ruta, max_filas=200):
    t = open_table(ruta)                     # encuentra el .MB hermano por su nombre
    h = t.header
    filas = []
    for i, rec in enumerate(t.records()):   # todos los registros de todos los bloques
        if i >= max_filas:
            break
        celdas = []
        for f in t.fields:
            c = rec[f.name]
            celdas.append({
                "estado": c.state.name,
                "valor": None if c.value is None else str(c.value),
                "motivo": c.reason,
                "crudo": c.raw_bytes[:16].hex(" "),
            })
        filas.append(celdas)
    return json.dumps({
        "tabla": h.table_name, "version": h.version_label, "codec": h.codec,
        "declarados": t.declared_record_count, "en_bloques": t.block_record_count(),
        "descuadre": t.header_mismatch, "bloques": t.block_count,
        "campos": [{"nombre": f.name, "tipo": f.type.name} for f in t.fields],
        "filas": filas,
    })
`;

const raiz = document.querySelector('[data-demo="paradox"]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const T = en
    ? { cargando: 'Loading Pyodide…', instalando: 'Installing paradoxdb…', leyendo: 'Reading the table…', listo: (s) => `Done in ${s} s.`, error: 'Could not run the demo: ', version: 'Version', codec: 'Code page', declarados: 'Records declared in the header', bloques: 'Records found in the blocks', descuadre: 'Undeclared records recovered', fila: 'Row', masAlla: 'beyond the declared count', ningunaTabla: 'Choose a .DB file.', estados: 'Cell states' }
    : { cargando: 'Cargando Pyodide…', instalando: 'Instalando paradoxdb…', leyendo: 'Leyendo la tabla…', listo: (s) => `Listo en ${s} s.`, error: 'No se pudo ejecutar la demo: ', version: 'Versión', codec: 'Página de códigos', declarados: 'Registros declarados en la cabecera', bloques: 'Registros encontrados en los bloques', descuadre: 'Registros no declarados recuperados', fila: 'Fila', masAlla: 'más allá del recuento declarado', ningunaTabla: 'Elige un fichero .DB.', estados: 'Estados de las celdas' };
  const estado = raiz.querySelector('[data-estado]');
  let pyodide = null;

  async function asegurarPython() {
    if (pyodide) return pyodide;
    estado.textContent = T.cargando;
    const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs');
    pyodide = await loadPyodide({ indexURL: PYODIDE });
    estado.textContent = T.instalando;
    await pyodide.loadPackage('micropip');
    await pyodide.pyimport('micropip').install(new URL(raiz.dataset.whl, location.href).href);
    pyodide.runPython(PY);
    raiz.querySelector('[data-codigo]').textContent = PY.trim() + '\n\nprint(leer("/datos/ACTIVOS.DB"))';
    return pyodide;
  }

  async function abrir(ficheros) {
    const t0 = performance.now();
    const py = await asegurarPython();
    estado.textContent = T.leyendo;
    py.FS.mkdirTree('/datos');
    for (const f of py.FS.readdir('/datos')) if (f !== '.' && f !== '..') py.FS.unlink('/datos/' + f);
    let db = null;
    for (const [nombre, bytes] of ficheros) {
      py.FS.writeFile('/datos/' + nombre, bytes);
      if (/\.db$/i.test(nombre)) db = nombre;
    }
    if (!db) { estado.textContent = T.ningunaTabla; return; }
    const datos = JSON.parse(py.globals.get('leer')('/datos/' + db));
    pintar(datos);
    estado.textContent = T.listo(((performance.now() - t0) / 1000).toFixed(1));
    raiz.querySelector('[data-resultado]').hidden = false;
  }

  function pintar(d) {
    const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const conteo = { OK: 0, NULL: 0, INVALID: 0 };
    d.filas.forEach(f => f.forEach(c => { conteo[c.estado] = (conteo[c.estado] || 0) + 1; }));
    raiz.querySelector('[data-resumen]').innerHTML = `
      <dl class="demo-cat__datos">
        <div><dt>${T.version}</dt><dd>${esc(d.version)}</dd></div>
        <div><dt>${T.codec}</dt><dd>${esc(d.codec)}</dd></div>
        <div><dt>${T.declarados}</dt><dd>${d.declarados}</dd></div>
        <div><dt>${T.bloques}</dt><dd>${d.en_bloques}</dd></div>
        <div class="${d.descuadre ? 'destacado' : ''}"><dt>${T.descuadre}</dt><dd>${d.descuadre}</dd></div>
        <div><dt>${T.estados}</dt><dd><span class="celda-ok">OK ${conteo.OK}</span> · <span class="celda-null">NULL ${conteo.NULL}</span> · <span class="celda-invalid">INVALID ${conteo.INVALID}</span></dd></div>
      </dl>`;
    const cab = `<tr><th>#</th>${d.campos.map(c => `<th>${esc(c.nombre)}<br><span class="tenue">${esc(c.tipo)}</span></th>`).join('')}</tr>`;
    const cuerpo = d.filas.map((f, i) => {
      const extra = i >= d.declarados;
      return `<tr class="${extra ? 'fila-extra' : ''}"><td title="${extra ? T.masAlla : ''}">${i + 1}${extra ? ' ⚑' : ''}</td>${f.map(c => {
        const titulo = c.estado === 'INVALID' ? `${c.motivo} · bytes: ${c.crudo}` : `bytes: ${c.crudo}`;
        const texto = c.estado === 'OK' ? esc(c.valor) : c.estado === 'NULL' ? 'NULL' : `INVALID: ${esc(c.motivo)}`;
        return `<td class="celda-${c.estado.toLowerCase()}" title="${esc(titulo)}">${texto}</td>`;
      }).join('')}</tr>`;
    }).join('');
    raiz.querySelector('[data-tabla]').innerHTML = `<table>${cab}${cuerpo}</table><p class="tenue pequeno">⚑ ${T.masAlla}. ${en ? 'Hover a cell to see its raw bytes.' : 'Pasa el ratón por una celda para ver sus bytes crudos.'}</p>`;
  }

  async function descargar(url) { return new Uint8Array(await (await fetch(url)).arrayBuffer()); }

  raiz.querySelector('[data-cargar]').addEventListener('click', async (ev) => {
    ev.currentTarget.disabled = true;
    try {
      await abrir([['ACTIVOS.DB', await descargar(raiz.dataset.db)], ['ACTIVOS.MB', await descargar(raiz.dataset.mb)]]);
    } catch (e) {
      estado.textContent = T.error + e.message;
      ev.currentTarget.disabled = false;
    }
  });
  raiz.querySelector('[data-ficheros]').addEventListener('change', async (ev) => {
    const lista = [];
    for (const f of ev.target.files) lista.push([f.name, new Uint8Array(await f.arrayBuffer())]);
    try { await abrir(lista); } catch (e) { estado.textContent = T.error + e.message; }
  });
}
