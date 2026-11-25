// Teaser de la portada: el recorrido de un dato por los cuatro perfiles
// (mar → sistema → modelo → decisión), que termina en la escena estática.
//
// - El HTML ya trae el estado final, así que sin JS todo se lee igual.
// - Se reproduce una vez por sesión; después queda el botón «Ver de nuevo».
// - Cada nodo activa la lente de su perfil (los botones .lente de main.js).
// - Con «reducir movimiento» no se anima nada.

export function iniciarTeaser() {
  const escena = document.querySelector('[data-teaser]');
  if (!escena) return;
  const $ = (s) => document.querySelector(s);
  const svg = escena.querySelector('svg');
  const pasos = JSON.parse(escena.querySelector('[data-teaser-pasos]').textContent);
  const nodos = pasos.map((p) => escena.querySelector(`[data-nodo="${p.id}"]`));
  const radios = [...escena.querySelectorAll('.escena__radio')];
  const ruta = escena.querySelector('.escena__ruta');
  const paquete = escena.querySelector('.escena__paquete');
  const olas = escena.querySelector('.escena__olas');
  const banda = $('[data-banda]');
  const elPaso = $('[data-relato-paso]');
  const elTitulo = $('.heroe__titular');
  const elLinea = $('[data-resumen-activo]');
  const cifra = $('[data-relato-cifra]');
  const barras = [...document.querySelectorAll('.progreso i')];
  const repetir = $('[data-teaser-repetir]');
  const pista = $('[data-teaser-pista]');
  const textoFinal = { paso: elPaso.textContent, titulo: elTitulo.dataset.textoGeneral, linea: elLinea.textContent };
  const color = (id) => getComputedStyle(document.documentElement).getPropertyValue('--c-' + id).trim();
  const LR = ruta.getTotalLength();
  const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const anima = (el, frames, opts) => el.animate(frames, { fill: 'forwards', easing: 'cubic-bezier(.2,.7,.2,1)', ...opts }).finished.catch(() => {});
  let gen = 0;

  function entrar(...els) {
    els.forEach((el, i) => { el.classList.remove('anim-in'); void el.offsetWidth; el.style.animationDelay = `${i * 0.06}s`; el.classList.add('anim-in'); });
  }

  function contar(el, texto) {
    const n = parseInt(texto.replace(/[.,\s]/g, ''), 10);
    const sep = texto.includes(',') ? ',' : '.';
    if (!(n >= 10)) { el.textContent = texto; return; }
    const t0 = performance.now();
    const f = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      el.textContent = String(Math.round(n * (1 - Math.pow(1 - k, 3)))).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
      if (k < 1) requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }

  function relato({ paso, titulo, linea, v, e }, c) {
    elPaso.textContent = paso; elPaso.style.color = c || '';
    elTitulo.textContent = titulo; elLinea.textContent = linea;
    if (v) { cifra.hidden = false; cifra.querySelector('span').textContent = e; contar(cifra.querySelector('b'), v); } else cifra.hidden = true;
    entrar(elPaso, elTitulo, elLinea, cifra);
  }

  function estadoFinal() {
    svg.classList.remove('escena--inicio');
    nodos.forEach((n) => { n.classList.remove('nodo--activo'); n.classList.add('nodo--hecho'); n.style.opacity = ''; });
    radios.forEach((r) => { r.getAnimations().forEach((a) => a.cancel()); r.style.strokeDashoffset = 0; });
    barras.forEach((b) => { b.getAnimations().forEach((a) => a.cancel()); b.style.transform = 'none'; });
    olas.getAnimations().forEach((a) => a.cancel());
    paquete.setAttribute('opacity', 0);
    svg.classList.add('escena--final');
    repetir.hidden = false; pista.hidden = false;
    banda?.classList.add('banda--mueve');
  }

  function viaje(desde, hasta, ms, c, g) {
    paquete.setAttribute('fill', c); paquete.style.setProperty('--cp', c); paquete.setAttribute('opacity', 1);
    return new Promise((res) => {
      const t0 = performance.now();
      const f = (t) => {
        if (g !== gen) return res();
        const k = Math.min(1, (t - t0) / ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        const pt = ruta.getPointAtLength(LR * (desde + (hasta - desde) * e));
        paquete.setAttribute('cx', pt.x); paquete.setAttribute('cy', pt.y);
        if (k < 1) requestAnimationFrame(f); else { paquete.setAttribute('opacity', 0); res(); }
      };
      requestAnimationFrame(f);
    });
  }

  async function reproducir() {
    const g = ++gen;
    const lenteActiva = document.querySelector('.lente[aria-pressed="true"]');
    if (lenteActiva && lenteActiva.dataset.lente) document.querySelector('.lente[data-lente=""]')?.click();
    svg.classList.remove('escena--final'); svg.classList.add('escena--inicio');
    banda?.classList.remove('banda--mueve');
    repetir.hidden = true; pista.hidden = true;
    radios.forEach((r) => { const L = r.getTotalLength(); r.style.strokeDasharray = L; r.style.strokeDashoffset = L; });
    barras.forEach((b) => { b.style.transform = 'scaleX(0)'; });
    nodos.forEach((n, i) => {
      n.classList.remove('nodo--activo', 'nodo--hecho'); n.style.opacity = 0;
      anima(n, [{ opacity: 0, transform: 'scale(.6)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 150 + i * 110, fill: 'backwards' })
        .then(() => { if (g === gen) n.style.opacity = ''; });
    });
    await espera(900);
    const HOLD = 2300, VIAJE = 950;
    for (let i = 0; i < pasos.length; i++) {
      if (g !== gen) return;
      const c = color(pasos[i].id);
      nodos[i].classList.add('nodo--activo'); relato(pasos[i], c);
      anima(barras[i], [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: HOLD + (i < 3 ? VIAJE : 0), easing: 'linear' });
      if (i === 0) olas.animate([{ opacity: 0, transform: 'translateX(-6px)' }, { opacity: 1, transform: 'translateX(6px)' }], { duration: 2200, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' });
      await espera(HOLD);
      if (g !== gen) return;
      nodos[i].classList.replace('nodo--activo', 'nodo--hecho');
      if (i < pasos.length - 1) await viaje(i / 3, (i + 1) / 3, VIAJE, c, g);
    }
    if (g !== gen) return;
    radios.forEach((r, i) => anima(r, [{ strokeDashoffset: r.style.strokeDashoffset }, { strokeDashoffset: 0 }], { duration: 700, delay: i * 90 }));
    await espera(650);
    if (g !== gen) return;
    relato(textoFinal);
    estadoFinal();
    try { sessionStorage.setItem('teaser-visto', '1'); } catch (e) { /* sin almacenamiento */ }
  }

  // Los nodos activan la lente de su perfil; las lentes resaltan su nodo.
  nodos.forEach((n) => {
    const elegir = () => {
      const actual = document.querySelector('.lente[aria-pressed="true"]')?.dataset.lente;
      const destino = actual === n.dataset.nodo ? '' : n.dataset.nodo;
      document.querySelector(`.lente[data-lente="${destino}"]`)?.click();
    };
    n.addEventListener('click', elegir);
    n.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(); } });
  });
  const alCambiarLente = (lente) => {
    if (svg.classList.contains('escena--inicio')) { gen++; estadoFinal(); }
    nodos.forEach((n) => n.classList.toggle('nodo--activo', n.dataset.nodo === lente));
    const boton = document.querySelector(`.lente[data-lente="${lente}"]`);
    if (!boton) return;
    elPaso.textContent = lente ? boton.textContent.trim() : textoFinal.paso;
    elPaso.style.color = lente ? color(lente) : '';
    cifra.hidden = true;
    entrar(elPaso, elTitulo, elLinea);
  };
  document.addEventListener('lente', (e) => alCambiarLente(e.detail));
  repetir.addEventListener('click', reproducir);

  // El fondo y las cintas se detienen cuando no se ven.
  const observar = (el, clase) => el && new IntersectionObserver(([e]) => el.classList.toggle(clase, !e.isIntersecting)).observe(el);
  observar(banda, 'banda--fuera');
  observar($('[data-cintas]'), 'cintas--fuera');

  let visto = false;
  try { visto = sessionStorage.getItem('teaser-visto') === '1'; } catch (e) { /* sin almacenamiento */ }
  const conLente = new URLSearchParams(location.search).get('perfil');
  if (quieto || visto || conLente) { estadoFinal(); if (conLente) alCambiarLente(conLente); } else reproducir();
}
