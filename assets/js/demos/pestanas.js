// Pestañas de la demo: el iframe de cada pestaña solo se carga al abrirla.
document.querySelectorAll('[data-demo="pestanas"]').forEach(raiz => {
  const tabs = [...raiz.querySelectorAll('[role="tab"]')];
  const activar = (i) => tabs.forEach((t, k) => {
    t.setAttribute('aria-selected', String(k === i));
    t.tabIndex = k === i ? 0 : -1;
    const panel = raiz.querySelector('#' + t.getAttribute('aria-controls'));
    panel.hidden = k !== i;
    const f = panel.querySelector('iframe[data-src]');
    if (k === i && f) { f.src = f.dataset.src; f.removeAttribute('data-src'); }
  });
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activar(i));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const j = (i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      activar(j); tabs[j].focus();
    });
  });
  activar(0);
});
