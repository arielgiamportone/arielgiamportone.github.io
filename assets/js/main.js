// Comportamiento del portfolio: modo claro/oscuro y lentes de perfil.
// Sin dependencias. Si el JS no carga, todo el contenido sigue visible.

import { iniciarTeaser } from './teaser.js';

const raiz = document.documentElement;

// ---------------------------------------------------------------- tema
const botonTema = document.querySelector('.boton-tema');
if (botonTema) {
  botonTema.addEventListener('click', () => {
    const oscuroAhora = raiz.dataset.tema === 'oscuro' ||
      (raiz.dataset.tema === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    raiz.dataset.tema = oscuroAhora ? 'claro' : 'oscuro';
    try { localStorage.setItem('tema', raiz.dataset.tema); } catch (e) { /* sin almacenamiento */ }
  });
}

// --------------------------------------------------------------- lentes
const botonesLente = [...document.querySelectorAll('.lente')];
const botonesTipo = [...document.querySelectorAll('.tipo')];
const filtrables = [...document.querySelectorAll('[data-filtrable]')];
let lente = '';
let tipo = '';

function aplicar() {
  raiz.dataset.lente = lente;
  botonesLente.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lente === lente)));
  botonesTipo.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.tipo === tipo)));

  let visiblesTotal = 0;
  filtrables.forEach(contenedor => {
    const maximo = Number(contenedor.dataset.maximo || 0);
    const items = [...contenedor.children];
    // En la portada, la lente reordena: primero lo de esa lente.
    if (maximo) {
      items.sort((a, b) => {
        const pa = lente && a.dataset.perfiles.split(' ').includes(lente) ? 0 : 1;
        const pb = lente && b.dataset.perfiles.split(' ').includes(lente) ? 0 : 1;
        return pa - pb || (Number(a.dataset.orden) - Number(b.dataset.orden));
      }).forEach(el => contenedor.appendChild(el));
    }
    let visibles = 0;
    items.forEach(el => {
      const deLente = !lente || el.dataset.perfiles.split(' ').includes(lente);
      const deTipo = !tipo || el.dataset.tipo === tipo;
      let mostrar = maximo ? (deTipo && (deLente || !lente)) : (deLente && deTipo);
      if (maximo && lente && !deLente) mostrar = false;
      if (mostrar && maximo && visibles >= maximo) mostrar = false;
      el.hidden = !mostrar;
      if (mostrar) visibles++;
    });
    visiblesTotal += visibles;
  });
  const vacio = document.querySelector('.sin-resultados');
  if (vacio) vacio.hidden = visiblesTotal > 0;

  // Titular y resumen de la portada según la lente.
  const titular = document.querySelector('.heroe__titular');
  const resumen = document.querySelector('[data-resumen-activo]');
  if (titular && resumen) {
    if (!resumen.dataset.general) resumen.dataset.general = resumen.textContent;
    const t = document.querySelector(`template[data-titular="${lente}"]`);
    const r = document.querySelector(`template[data-resumen="${lente}"]`);
    titular.textContent = lente && t ? t.content.textContent : titular.dataset.textoGeneral;
    resumen.textContent = lente && r ? r.content.textContent : resumen.dataset.general;
  }
  const contenedorEnlace = document.querySelector('.ver-perfil');
  if (contenedorEnlace) {
    contenedorEnlace.hidden = !lente;
    contenedorEnlace.querySelectorAll('[data-perfil-enlace]').forEach(a => { a.hidden = a.dataset.perfilEnlace !== lente; });
  }

  const url = new URL(location.href);
  if (lente) url.searchParams.set('perfil', lente); else url.searchParams.delete('perfil');
  history.replaceState(null, '', url);
  document.dispatchEvent(new CustomEvent('lente', { detail: lente }));
}

filtrables.forEach(c => [...c.children].forEach((el, i) => { el.dataset.orden = i; }));
botonesLente.forEach(b => b.addEventListener('click', () => { lente = b.dataset.lente; aplicar(); }));
botonesTipo.forEach(b => b.addEventListener('click', () => { tipo = b.dataset.tipo; aplicar(); }));

const inicial = new URLSearchParams(location.search).get('perfil') || '';
if (botonesLente.some(b => b.dataset.lente === inicial)) lente = inicial;
if (filtrables.length || botonesLente.length) aplicar();
iniciarTeaser();
