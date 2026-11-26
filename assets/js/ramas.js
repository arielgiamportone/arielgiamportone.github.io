// Cabecera de la portada: la carrera como un historial de git (datos en data/ramas.yaml).
//
// - Escritorio: el tiempo corre de izquierda a derecha y las ramas convergen en la foto (HEAD).
// - Móvil (< 720 px): en vertical, como `git log --graph`, con el texto de los hitos al lado.
// - Se anima una vez por sesión; después queda el gráfico fijo y «Ver de nuevo».
// - Pulsar una rama activa la lente de ese perfil (botones .lente de main.js); los commits con
//   ficha enlazan a ella.
// - Con «reducir movimiento» se dibuja directamente el estado final.

const NS = 'http://www.w3.org/2000/svg';
const CARRILES = ['main', 'economia-azul', 'sector-publico', 'software', 'ia'];
const AÑO0 = 2005.6, HEAD = 2027.0;
const TRAMOS = [[2005.6, 0], [2018, 0.44], [2023, 0.67], [2027.0, 1]]; // los años recientes se estiran un poco

const el = (tag, attrs, padre) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (padre) padre.appendChild(e);
  return e;
};
const col = (r) => `var(--c-${r === 'main' ? 'main' : r})`;
const tiempo = (a) => {
  for (let i = 1; i < TRAMOS.length; i++) {
    const [a0, f0] = TRAMOS[i - 1], [a1, f1] = TRAMOS[i];
    if (a <= a1 || i === TRAMOS.length - 1) return f0 + (a - a0) / (a1 - a0) * (f1 - f0);
  }
  return 1;
};

export function iniciarRamas() {
  const raiz = document.querySelector('[data-ramas]');
  if (!raiz) return;
  const datos = JSON.parse(raiz.querySelector('[data-ramas-datos]').textContent);
  datos.commits.sort((p, q) => p.a - q.a);
  const grafo = raiz.querySelector('[data-ramas-grafo]');
  const tip = raiz.querySelector('[data-ramas-tip]');
  const consola = document.querySelector('[data-ramas-consola]');
  const repetir = document.querySelector('[data-ramas-repetir]');
  const pista = document.querySelector('[data-ramas-pista]');
  const banda = document.querySelector('[data-banda]');
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nace = { main: AÑO0 + 0.3 };
  datos.ramas.forEach((r) => { nace[r.id] = r.nace; });
  let vertical = null, gen = 0, lente = '', partes = null;

  // ------------------------------------------------------------ geometría
  function geometria(vert) {
    if (!vert) {
      const T0 = 40, T1 = 980, carril = { main: 50, 'economia-azul': 130, 'sector-publico': 205, software: 280, ia: 355 };
      return { vert, vb: '0 0 1180 430', t: (a) => T0 + tiempo(a) * (T1 - T0), c: (r) => carril[r],
        p: (t, c) => [t, c], av: [1092, 205], avR: 34, ticks: [2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2025, 2026, 2027] };
    }
    const T0 = 40, T1 = 760, carril = { main: 22, 'economia-azul': 48, 'sector-publico': 74, software: 100, ia: 126 };
    return { vert, vb: '0 0 390 880', t: (a) => T0 + tiempo(a) * (T1 - T0), c: (r) => carril[r],
      p: (t, c) => [c, t], av: [74, 832], avR: 28, ticks: [2006, 2012, 2018, 2024, 2026] };
  }

  // ------------------------------------------------------------ dibujo
  function dibujar() {
    const G = geometria(vertical);
    grafo.textContent = '';
    const svg = el('svg', { viewBox: G.vb, class: 'ramas__svg', 'aria-hidden': 'true' }, grafo);
    const defs = el('defs', {}, svg);
    const cortina = el('rect', { x: 0, y: 0, width: 0, height: 0 }, el('clipPath', { id: 'ramas-revelar' }, defs));
    el('circle', { cx: 0, cy: 0, r: G.avR }, el('clipPath', { id: 'ramas-avatar' }, defs));
    const grad = el('linearGradient', { id: 'ramas-head', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    ['software', 'ia', 'sector-publico', 'economia-azul'].forEach((r, i) => el('stop', { offset: i / 3, style: `stop-color: ${col(r)}` }, grad));
    const P = (a, r) => G.p(G.t(a), G.c(r));
    const [avx, avy] = G.av;

    // eje de años
    const eje = el('g', { class: 'ramas__eje' }, svg);
    G.ticks.forEach((a) => {
      const t = G.t(a);
      if (!vertical) {
        el('line', { x1: t, x2: t, y1: 20, y2: 390 }, eje);
        el('text', { x: t, y: 412, 'text-anchor': 'middle' }, eje).textContent = a === 2027 ? datos.txt.hoy : a;
      } else {
        el('line', { x1: 8, x2: 140, y1: t, y2: t }, eje);
      }
    });

    // líneas: cada carril termina en un embudo hacia la foto
    const lineas = el('g', { 'clip-path': 'url(#ramas-revelar)' }, svg);
    const embudo = (r) => {
      const [x, y] = P(HEAD, r);
      if (!vertical) {
        const ang = Math.atan2(y - avy, 70), ex = avx - G.avR * Math.cos(ang), ey = avy + G.avR * Math.sin(ang) * 0.9;
        return `L${x} ${y} C${x + 50} ${y} ${ex - 40} ${ey} ${ex} ${ey}`;
      }
      const ang = Math.atan2(x - avx, 70), ex = avx + G.avR * Math.sin(ang) * 0.9, ey = avy - G.avR * Math.cos(ang);
      return `L${x} ${y} C${x} ${y + 30} ${ex} ${ey - 30} ${ex} ${ey}`;
    };
    const curva = (a, r0, r1, largo) => { // de un carril a otro
      const [x0, y0] = P(a, r0), [x1, y1] = P(a, r1);
      if (!vertical) return `M${x0 - largo} ${y0} C${x0 - largo * 0.3} ${y0} ${x1 - largo * 0.6} ${y1} ${x1} ${y1}`;
      return `M${x0} ${y0 - largo} C${x0} ${y0 - largo * 0.3} ${x1} ${y1 - largo * 0.6} ${x1} ${y1}`;
    };
    const ramasSvg = {};
    const [mx, my] = P(AÑO0 + 0.3, 'main');
    ramasSvg.main = el('path', { class: 'ramas__linea', d: `M${mx} ${my} ${embudo('main')}`, style: `stroke: ${col('main')}` }, lineas);
    datos.ramas.forEach((r) => {
      ramasSvg[r.id] = el('path', { class: 'ramas__linea', style: `stroke: ${col(r.id)}`, d: `${curva(r.nace, r.origen, r.id, 30)} ${embudo(r.id)}` }, lineas);
    });
    const cruces = datos.merges.map((m) => el('path', { class: 'ramas__linea ramas__merge', 'data-rama': m.desde, style: `stroke: ${col(m.desde)}`, d: curva(m.anio, m.desde, m.hacia, vertical ? 36 : 56) }, lineas));

    // commits (los que tienen ficha son enlaces)
    const capa = el('g', {}, svg);
    const commits = datos.commits.map((c) => {
      const [x, y] = P(c.a, c.r);
      const padre = c.u ? el('a', { href: c.u, 'aria-label': c.t }, capa) : capa;
      const punto = el('circle', { class: `ramas__commit${c.h ? ' ramas__commit--hito' : ''}${c.u ? ' ramas__commit--enlace' : ''}`, cx: x, cy: y, r: c.h ? 7.5 : 6, style: `stroke: ${col(c.r)}; color: ${col(c.r)}` }, padre);
      punto.addEventListener('mouseenter', () => mostrarTip(punto, c));
      punto.addEventListener('mouseleave', () => { tip.style.opacity = 0; });
      return { c, punto };
    });

    // móvil: texto de los hitos al lado, sin solaparse
    const rotulos = [];
    if (vertical) {
      let ultimo = -Infinity;
      commits.filter(({ c }) => c.h).forEach(({ c, punto }) => {
        const y = Math.max(+punto.getAttribute('cy'), ultimo + 30);
        ultimo = y;
        const g = el('g', { class: 'ramas__rotulo' }, svg);
        el('path', { d: `M${+punto.getAttribute('cx') + 9} ${punto.getAttribute('cy')} C150 ${punto.getAttribute('cy')} 150 ${y} 160 ${y}`, style: `stroke: ${col(c.r)}` }, g);
        const t = el('text', { x: 166, y: y + 4 }, g);
        el('tspan', { class: 'ramas__anio' }, t).textContent = `${Math.floor(c.a)} `;
        el('tspan', {}, t).textContent = c.t.length > 34 ? `${c.t.slice(0, 33)}…` : c.t;
        rotulos.push({ g, a: c.a });
      });
    }

    // nombres de rama en su punto de nacimiento (pulsables)
    const etiquetas = CARRILES.map((r) => {
      const nombre = (r === 'main' ? '' : '⎇ ') + datos.nombres[r];
      let x, y;
      if (!vertical) { [x, y] = P(nace[r] + (r === 'main' ? 0 : 0.3), r); y -= 24; } else { [x, y] = P(AÑO0, r); y = 14; }
      const g = el('g', { class: 'ramas__rama', 'data-rama': r, transform: `translate(${x} ${y})`, role: 'button', tabindex: 0, 'aria-label': datos.nombres[r] }, svg);
      if (!vertical) {
        const w = nombre.length * 8.4 + 22;
        el('rect', { x: 0, y: -13, width: w, height: 26, rx: 13, style: `stroke: ${col(r)}` }, g);
        el('text', { x: 11, y: 4.5, style: `fill: ${col(r)}` }, g).textContent = nombre;
      } else {
        el('circle', { r: 9, style: `fill: ${col(r)}` }, g);
      }
      g.addEventListener('click', () => elegir(r));
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(r); } });
      return g;
    });

    // HEAD con la foto
    const head = el('g', { class: 'ramas__head', transform: `translate(${avx} ${avy})` }, svg);
    el('circle', { r: G.avR + 3, fill: 'url(#ramas-head)' }, head);
    el('image', { href: datos.foto, x: -G.avR, y: -G.avR, width: G.avR * 2, height: G.avR * 2, 'clip-path': 'url(#ramas-avatar)' }, head);
    el('text', { x: vertical ? G.avR + 12 : 0, y: vertical ? 5 : G.avR + 22, 'text-anchor': vertical ? 'start' : 'middle' }, head).textContent = `HEAD · ${datos.txt.hoy}`;

    partes = { G, svg, cortina, commits, etiquetas, head, ramasSvg, cruces, rotulos };
    aplicarLente();
  }

  function mostrarTip(punto, c) {
    const r = grafo.getBoundingClientRect(), vb = partes.G.vb.split(' ').map(Number), k = r.width / vb[2];
    tip.textContent = `${Math.floor(c.a)} · ${c.t}`;
    tip.style.left = `${punto.getAttribute('cx') * k}px`;
    tip.style.top = `${punto.getAttribute('cy') * k}px`;
    tip.style.opacity = 1;
  }

  function escribir(anio, html) {
    if (!consola) return;
    consola.innerHTML = `<span class="ramas__consola-anio">${anio}</span>${html}`;
    consola.classList.remove('anim-in'); void consola.offsetWidth; consola.classList.add('anim-in');
  }

  // ------------------------------------------------------------ estados
  function estadoFinal() {
    const { cortina, commits, etiquetas, head, rotulos, G } = partes;
    const vb = G.vb.split(' ').map(Number);
    cortina.setAttribute('width', vb[2]); cortina.setAttribute('height', vb[3]);
    commits.forEach(({ punto }) => punto.classList.remove('oculto'));
    etiquetas.forEach((e) => e.classList.remove('oculto'));
    rotulos.forEach(({ g }) => g.classList.remove('oculto'));
    head.classList.remove('oculto');
    escribir('HEAD → main', datos.txt.final);
    if (repetir) repetir.hidden = false;
    if (pista) pista.hidden = false;
    banda?.classList.add('banda--mueve');
  }

  async function reproducir() {
    const g = ++gen;
    const { cortina, commits, etiquetas, head, rotulos, G } = partes;
    const vb = G.vb.split(' ').map(Number);
    if (repetir) repetir.hidden = true;
    if (pista) pista.hidden = true;
    banda?.classList.remove('banda--mueve');
    commits.forEach(({ punto }) => punto.classList.add('oculto'));
    etiquetas.forEach((e) => e.classList.add('oculto'));
    rotulos.forEach(({ g: r }) => r.classList.add('oculto'));
    head.classList.add('oculto');
    escribir('$ git log --graph', datos.txt.head);
    const DUR = 9500, t0 = performance.now();
    let ultimoHito = -1;
    await new Promise((fin) => {
      const paso = (t) => {
        if (g !== gen) return fin();
        const k = Math.min(1, (t - t0) / DUR), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const a = AÑO0 + e * (HEAD - AÑO0), frente = G.t(a);
        if (!vertical) { cortina.setAttribute('width', k < 1 ? frente : vb[2]); cortina.setAttribute('height', vb[3]); }
        else { cortina.setAttribute('width', vb[2]); cortina.setAttribute('height', k < 1 ? frente : vb[3]); }
        commits.forEach(({ c, punto }, i) => {
          if (punto.classList.contains('oculto') && c.a <= a) {
            punto.classList.remove('oculto');
            if (c.h && i > ultimoHito) {
              ultimoHito = i;
              escribir(Math.floor(c.a), `<b style="color:${col(c.r)}">⎇ ${datos.nombres[c.r]}</b> · ${c.t}`);
            }
          }
        });
        etiquetas.forEach((et) => { if (et.classList.contains('oculto') && nace[et.dataset.rama] - 0.3 <= a) et.classList.remove('oculto'); });
        rotulos.forEach(({ g: r, a: ar }) => { if (ar <= a) r.classList.remove('oculto'); });
        if (k < 1) requestAnimationFrame(paso); else fin();
      };
      requestAnimationFrame(paso);
    });
    if (g !== gen) return;
    estadoFinal();
    try { sessionStorage.setItem('ramas-visto', '1'); } catch (e) { /* sin almacenamiento */ }
  }

  // ------------------------------------------------------------ lentes
  function elegir(r) {
    const destino = r === 'main' || r === lente ? '' : r;
    document.querySelector(`.lente[data-lente="${destino}"]`)?.click();
  }
  function aplicarLente() {
    if (!partes) return;
    const { etiquetas, commits, ramasSvg, cruces } = partes;
    const atenua = (r) => lente && r !== lente && r !== 'main';
    etiquetas.forEach((e) => { e.classList.toggle('ramas__rama--activa', e.dataset.rama === lente); e.classList.toggle('atenuada', atenua(e.dataset.rama)); });
    Object.entries(ramasSvg).forEach(([r, p]) => p.classList.toggle('atenuada', atenua(r)));
    cruces.forEach((p) => p.classList.toggle('atenuada', atenua(p.dataset.rama)));
    commits.forEach(({ c, punto }) => punto.classList.toggle('atenuada', atenua(c.r)));
  }
  function consolaLente() {
    if (lente) escribir(`⎇ ${datos.nombres[lente]}`, `$ git checkout ${datos.nombres[lente]}`);
    else escribir('HEAD → main', datos.txt.final);
  }
  document.addEventListener('lente', (e) => {
    const antes = lente;
    lente = e.detail || '';
    if (lente && partes && partes.head.classList.contains('oculto')) { gen++; estadoFinal(); }
    aplicarLente();
    if (lente !== antes && partes && !partes.head.classList.contains('oculto')) consolaLente();
  });

  // ------------------------------------------------------------ arranque
  repetir?.addEventListener('click', reproducir);
  const observar = (nodo, clase) => nodo && new IntersectionObserver(([e]) => nodo.classList.toggle(clase, !e.isIntersecting)).observe(nodo);
  observar(banda, 'banda--fuera');
  observar(document.querySelector('[data-cintas]'), 'cintas--fuera');

  const mq = matchMedia('(max-width: 719px)');
  vertical = mq.matches;
  dibujar();
  mq.addEventListener('change', () => { gen++; vertical = mq.matches; dibujar(); estadoFinal(); });

  lente = new URLSearchParams(location.search).get('perfil') || '';
  aplicarLente();
  let visto = false;
  try { visto = sessionStorage.getItem('ramas-visto') === '1'; } catch (e) { /* sin almacenamiento */ }
  if (quieto || visto || lente) { estadoFinal(); if (lente) consolaLente(); } else reproducir();
}
