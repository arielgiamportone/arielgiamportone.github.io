// Demo de field-inspections-dashboard.
// - Proxy de fotos: el photo-proxy.js del repositorio (sin cambios) contra un servidor simulado.
// - Ventana de autoridad: src/incremental_merge.py (sin cambios) con pandas en Pyodide.
import { handlePhoto } from './inspecciones/photo-proxy.js';

const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const HOST = 'files.inspections.example';

const raiz = document.querySelector('[data-demo="inspecciones"]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const $ = (s) => raiz.querySelector(s);
  const campo = (n) => raiz.querySelector(`[name="${n}"]`);
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // En el navegador no existe Buffer (Node); el proxy solo lo usa para devolver los bytes.
  if (typeof globalThis.Buffer === 'undefined') globalThis.Buffer = { from: (ab) => new Uint8Array(ab) };

  const T = en ? {
    origen: { imagen: 'Returns the image', redirigePermitido: 'Redirects to another path of the allowed host', redirigeInterno: 'Redirects to an internal address', redirigeHttp: 'Redirects to plain http', login: 'Session expired: answers 200 with an HTML login page', r401: 'Rejects the token (401)', r404: 'Photo not found (404)', bucle: 'Redirects in a loop', timeout: 'Does not answer (timeout)', caido: 'Unreachable' },
    escenarios: ['Normal photo', 'Another host', 'Host hidden as a subdomain', 'Host in the userinfo', 'Cloud metadata IP', 'Plain http', 'Allowed host, bounce to an internal IP', 'Expired session', 'Redirect loop'],
    peticiones: 'Requests the proxy made', ninguna: 'None: refused before touching the network.', conToken: 'with the token', respuesta: 'Proxy answer', cuerpo: 'Body', imagen: 'Image served to the browser (synthetic)',
    cargando: 'Loading Pyodide…', pandas: 'Loading pandas…', modulos: 'Loading the repository module…', listo: (s) => `Ready in ${s} s.`, error: 'Could not run the demo: ',
    upsert: 'Pure upsert (never deletes)', ciego: 'Delete whatever did not come back', ventana: 'Authority window (repository code)',
    filas: 'rows', fantasmas: (n) => `${n} deleted records still counted`, perdidas: (n) => `${n} real rows lost`, ok: 'correct',
    insertadas: 'inserted', actualizadas: 'updated', borradas: 'deleted', fotos: (a, b) => `photos ${a} → ${b} (cascade)`, aborta: 'Aborted, nothing written',
    meses: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ventanaEtq: 'queried window',
    ley: { kept: 'kept', borrado: 'deleted at source', borradoFuera: 'deleted at source outside the window (not asked for, kept)', nuevo: 'new', mod: 'corrected', perdido: 'missing from a partial answer' },
  } : {
    origen: { imagen: 'Devuelve la imagen', redirigePermitido: 'Redirige a otra ruta del host permitido', redirigeInterno: 'Redirige a una dirección interna', redirigeHttp: 'Redirige a http sin cifrar', login: 'Sesión caducada: responde 200 con una página de login HTML', r401: 'Rechaza el token (401)', r404: 'La foto no existe (404)', bucle: 'Redirige en bucle', timeout: 'No responde (tiempo agotado)', caido: 'No se puede conectar' },
    escenarios: ['Foto normal', 'Otro host', 'Host camuflado como subdominio', 'Host en el userinfo', 'IP de metadatos de la nube', 'http sin cifrar', 'Host permitido que rebota a una IP interna', 'Sesión caducada', 'Bucle de redirecciones'],
    peticiones: 'Peticiones que hizo el proxy', ninguna: 'Ninguna: rechazada antes de tocar la red.', conToken: 'con el token', respuesta: 'Respuesta del proxy', cuerpo: 'Cuerpo', imagen: 'Imagen servida al navegador (sintética)',
    cargando: 'Cargando Pyodide…', pandas: 'Cargando pandas…', modulos: 'Cargando el módulo del repositorio…', listo: (s) => `Listo en ${s} s.`, error: 'No se pudo ejecutar la demo: ',
    upsert: 'Upsert puro (nunca borra)', ciego: 'Borrar lo que no ha venido', ventana: 'Ventana de autoridad (código del repositorio)',
    filas: 'filas', fantasmas: (n) => `${n} trabajos borrados siguen contando`, perdidas: (n) => `${n} filas reales perdidas`, ok: 'correcto',
    insertadas: 'altas', actualizadas: 'actualizadas', borradas: 'borradas', fotos: (a, b) => `fotos ${a} → ${b} (en cascada)`, aborta: 'Abortado, no se escribe nada',
    meses: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], ventanaEtq: 'ventana consultada',
    ley: { kept: 'se conserva', borrado: 'borrado en la fuente', borradoFuera: 'borrado en la fuente fuera de la ventana (no se preguntó: se conserva)', nuevo: 'alta', mod: 'corregido', perdido: 'falta en una respuesta incompleta' },
  };

  // ------------------------------------------------------------ proxy de fotos
  const FOTO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="#dbeafe"/><rect y="130" width="320" height="70" fill="#94a3b8"/><rect x="60" y="60" width="200" height="90" fill="#f8fafc" stroke="#334155" stroke-width="3"/><rect x="80" y="80" width="70" height="40" fill="#0e7490"/><text x="200" y="108" font-family="sans-serif" font-size="16" fill="#334155" text-anchor="middle">LOCAL 12</text><text x="160" y="190" font-family="sans-serif" font-size="12" fill="#f8fafc" text-anchor="middle">${en ? 'synthetic photo' : 'foto sintética'}</text></svg>`;
  const R = {
    imagen: () => new Response(new TextEncoder().encode(FOTO), { status: 200, headers: { 'content-type': 'image/svg+xml' } }),
    redir: (to) => new Response(null, { status: 302, headers: { location: to } }),
    html: () => new Response('<!doctype html><title>Login</title><form>…</form>', { status: 200, headers: { 'content-type': 'text/html' } }),
    estado: (s) => new Response('', { status: s }),
  };
  const ORIGENES = {
    imagen: () => [R.imagen()],
    redirigePermitido: () => [R.redir(`https://${HOST}/cdn/2026/10/123.jpg`), R.imagen()],
    redirigeInterno: () => [R.redir('https://169.254.169.254/latest/meta-data/iam/')],
    redirigeHttp: () => [R.redir(`http://${HOST}/photos/123.jpg`)],
    login: () => [R.html()],
    r401: () => [R.estado(401)],
    r404: () => [R.estado(404)],
    bucle: () => [1, 2, 3, 4, 5].map(i => R.redir(`https://${HOST}/photos/123.jpg?r=${i}`)),
    timeout: () => [Object.assign(new Error('timeout'), { name: 'TimeoutError' })],
    caido: () => [new TypeError('fetch failed')],
  };
  const ESCENARIOS = [
    [`https://${HOST}/photos/123.jpg`, 'imagen'],
    ['https://evil.example/x.jpg', 'imagen'],
    [`https://${HOST}.evil.example/x.jpg`, 'imagen'],
    [`https://${HOST}@evil.example/x.jpg`, 'imagen'],
    ['https://169.254.169.254/latest/meta-data/', 'imagen'],
    [`http://${HOST}/photos/123.jpg`, 'imagen'],
    [`https://${HOST}/photos/123.jpg`, 'redirigeInterno'],
    [`https://${HOST}/photos/123.jpg`, 'login'],
    [`https://${HOST}/photos/123.jpg`, 'bucle'],
  ];

  const sel = campo('origen');
  sel.innerHTML = Object.entries(T.origen).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
  const cajaEsc = $('[data-ejemplos="proxy"]');
  cajaEsc.innerHTML = ESCENARIOS.map((e, i) => `<button type="button" class="boton boton--secundario boton--chico" data-i="${i}">${esc(T.escenarios[i])}</button>`).join('');
  cajaEsc.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-i]'); if (!b) return;
    const [u, o] = ESCENARIOS[Number(b.dataset.i)];
    campo('url').value = u; sel.value = o; proxy();
  });

  let turno = 0;
  async function proxy() {
    const yo = ++turno;
    const cola = ORIGENES[sel.value]();
    const llamadas = [];
    const fetchImpl = async (url, init) => {
      llamadas.push({ url, token: Boolean(init?.headers?.Authorization) });
      const sig = cola.shift();
      if (sig instanceof Error) throw sig;
      return sig ?? R.estado(500);
    };
    const res = await handlePhoto({ query: { u: campo('url').value } }, { fetchImpl, token: 'secreto-de-servicio', allowedHosts: [HOST] });
    if (yo !== turno) return;
    const ok = res.status === 200;
    const lista = llamadas.length
      ? `<ol class="demo-ins__hops">${llamadas.map(l => `<li><code>${esc(l.url)}</code>${l.token ? ` <span class="tenue">· ${T.conToken}</span>` : ''}</li>`).join('')}</ol>`
      : `<p class="tenue pequeno">${T.ninguna}</p>`;
    let cuerpo;
    if (ok) {
      const url = URL.createObjectURL(new Blob([res.body], { type: res.headers['Content-Type'] }));
      cuerpo = `<figure class="demo-ins__foto"><img src="${url}" alt=""><figcaption class="tenue pequeno">${T.imagen}</figcaption></figure>`;
    } else {
      cuerpo = `<pre class="demo-reg__salida mal">${esc(res.body)}</pre>`;
    }
    const cabeceras = Object.entries(res.headers).map(([k, v]) => `${esc(k)}: ${esc(v)}`).join('<br>');
    $('[data-salida="proxy"]').innerHTML = `
      <div class="demo-ins__proxy">
        <div><p class="demo-reg__etq">${T.peticiones}</p>${lista}</div>
        <div><p class="demo-reg__etq">${T.respuesta}</p>
          <p><span class="demo-ins__codigo ${ok ? 'ok' : 'mal'}">${res.status}</span></p>
          <p class="pequeno demo-ins__cab">${cabeceras}</p>${cuerpo}</div>
      </div>`;
  }
  raiz.querySelector('[data-panel="proxy"]').addEventListener('input', proxy);
  campo('url').value = ESCENARIOS[0][0];
  proxy();

  // ------------------------------------------------------- ventana de autoridad
  // Histórico sintético y determinista: 8 inspecciones al mes en 2026, de 1 a 4 fotos cada una.
  const HIST = [];
  const FOTOS = [];
  for (let m = 0; m < 12; m++) {
    for (let k = 0; k < 8; k++) {
      const n = m * 8 + k;
      const id = `T-${1001 + n}`;
      const dia = String(2 + ((k * 7 + m * 3) % 26)).padStart(2, '0');
      HIST.push([id, `2026-${String(m + 1).padStart(2, '0')}-${dia}`, 'ok']);
      for (let f = 0; f <= n % 4; f++) FOTOS.push([`F-${id}-${f}`, id]);
    }
  }
  const DESDE = '2026-10-01', HASTA = '2026-12-31';
  const enVentana = (f) => f >= DESDE && f <= HASTA;
  // Trabajos «de prueba» que se borran en la fuente: repartidos dentro de la ventana.
  const BORRABLES = ['T-1075', 'T-1084', 'T-1092', 'T-1079', 'T-1088', 'T-1095'];

  function escenario() {
    const nb = Math.max(0, Math.min(6, Number(campo('borrados').value) || 0));
    const borrados = new Set(BORRABLES.slice(0, nb));
    if (campo('viejo').checked) borrados.add('T-1019');
    const modificado = campo('modificado').checked ? 'T-1081' : null;
    const altas = [];
    for (let i = 0; i < Math.max(0, Math.min(5, Number(campo('altas').value) || 0)); i++) altas.push([`T-${2001 + i}`, `2026-12-${String(10 + i * 3).padStart(2, '0')}`, 'ok']);
    // La fuente solo responde por la ventana consultada.
    let respuesta = HIST.filter(r => enVentana(r[1]) && !borrados.has(r[0])).map(r => (r[0] === modificado ? [r[0], r[1], 'corregido'] : r)).concat(altas);
    let perdidos = new Set();
    const modo = campo('respuesta').value;
    if (modo !== 'completa') {
      const corte = modo === 'vacia' ? 0 : Math.round(respuesta.length * 0.6);
      perdidos = new Set(respuesta.slice(corte).map(r => r[0]));
      respuesta = respuesta.slice(0, corte);
    }
    return { borrados, modificado, altas, respuesta, perdidos };
  }

  function linea(e, res) {
    const ids = new Set(e.respuesta.map(r => r[0]));
    const todos = HIST.concat(e.altas);
    const porMes = Array.from({ length: 12 }, () => []);
    for (const [id, f] of todos) {
      const m = Number(f.slice(5, 7)) - 1;
      let c = 'kept';
      if (e.altas.some(a => a[0] === id)) c = ids.has(id) ? 'nuevo' : 'perdido';
      else if (e.borrados.has(id)) c = enVentana(f) ? 'borrado' : 'borradoFuera';
      else if (e.perdidos.has(id)) c = 'perdido';
      else if (id === e.modificado && ids.has(id)) c = 'mod';
      const fuera = res?.ok && res.borradas.includes(id);
      porMes[m].push(`<span class="pt pt--${c}${fuera ? ' pt--fuera' : ''}" title="${id} · ${f}"></span>`);
    }
    $('[data-linea]').innerHTML = porMes.map((pts, m) => `<div class="demo-ins__mes${m >= 9 ? ' en-ventana' : ''}"><div class="demo-ins__pts">${pts.join('')}</div><span>${T.meses[m]}</span></div>`).join('') + `<div class="demo-ins__vent">${T.ventanaEtq}</div>`;
    $('[data-leyenda]').innerHTML = Object.entries(T.ley).map(([k, v]) => `<span><span class="pt pt--${k}"></span> ${esc(v)}</span>`).join('');
  }

  let py = null;
  async function cargar() {
    const t0 = performance.now();
    const estado = $('[data-estado]');
    estado.textContent = T.cargando;
    const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE + 'pyodide.mjs');
    py = await loadPyodide({ indexURL: PYODIDE });
    estado.textContent = T.pandas;
    await py.loadPackage('pandas');
    estado.textContent = T.modulos;
    py.FS.mkdirTree('/inspecciones');
    for (const url of raiz.dataset.modulos.split(' ')) {
      py.FS.writeFile('/inspecciones/' + url.split('/').pop(), await (await fetch(url)).text());
    }
    py.runPython("import sys; sys.path.insert(0, '/inspecciones')\nfrom demo import refrescar");
    estado.textContent = T.listo(((performance.now() - t0) / 1000).toFixed(1));
    $('[data-cargar]').hidden = true;
    $('[data-controles]').hidden = false;
    ventana();
  }

  function ventana() {
    const e = escenario();
    let res;
    try {
      res = JSON.parse(py.globals.get('refrescar')(JSON.stringify({ historia: HIST, respuesta: e.respuesta, fotos: FOTOS, desde: DESDE, hasta: HASTA, umbral: campo('umbral').value })));
    } catch (err) {
      res = { ok: false, error: String(err.message || err).trim().split('\n').pop() };
    }
    linea(e, res);
    // Las dos alternativas ingenuas se calculan aquí, en JavaScript, para comparar.
    const ids = new Set(e.respuesta.map(r => r[0]));
    const nuevas = e.respuesta.filter(r => !HIST.some(h => h[0] === r[0])).length;
    const fantasmas = [...e.borrados].filter(id => enVentana(HIST.find(h => h[0] === id)[1])).length;
    const perdidasCiego = HIST.filter(r => !ids.has(r[0]) && !e.borrados.has(r[0])).length;
    const tarjeta = (titulo, cifra, nota, bien) => `<div class="demo-ins__tarjeta ${bien ? 'bien' : 'malo'}"><p class="demo-reg__etq">${titulo}</p><p class="demo-ins__cifra">${cifra}</p><p class="pequeno ${bien ? 'ok' : 'mal'}">${nota}</p></div>`;
    const real = res.ok
      ? tarjeta(T.ventana, `${res.filas} ${T.filas}`, `${T.insertadas}: ${res.insertadas} · ${T.actualizadas}: ${res.actualizadas} · ${T.borradas}: ${res.borradas.length}${res.borradas.length ? ` (${res.borradas.join(', ')})` : ''}<br>${T.fotos(res.fotos_antes, res.fotos_despues)}`, true)
      : tarjeta(T.ventana, T.aborta, esc(res.error), true);
    $('[data-comparar]').innerHTML =
      tarjeta(T.upsert, `${HIST.length + nuevas} ${T.filas}`, fantasmas ? T.fantasmas(fantasmas) : T.ok, !fantasmas) +
      tarjeta(T.ciego, `${e.respuesta.length} ${T.filas}`, perdidasCiego ? T.perdidas(perdidasCiego) : T.ok, !perdidasCiego) +
      real;
  }

  $('[data-cargar]').addEventListener('click', async (ev) => {
    ev.currentTarget.disabled = true;
    try { await cargar(); } catch (e) { $('[data-estado]').textContent = T.error + e.message; ev.currentTarget.disabled = false; }
  });
  raiz.querySelector('[data-panel="ventana"]').addEventListener('input', () => py && ventana());

  // Pestañas y código mostrado
  raiz.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    raiz.querySelectorAll('[data-tab]').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    raiz.querySelectorAll('[data-panel]').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
  }));
  const puente = raiz.dataset.modulos.split(' ').find(u => u.endsWith('/demo.py'));
  fetch(puente).then(r => r.text()).then(t => { $('[data-codigo]').textContent = t.trim(); }).catch(() => {});
}
