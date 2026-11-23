// Demo docente de programación lineal (modelo de flota del repositorio Investigacion_Operativa).
import { maximizar, maximizarEntero, valorUnidadExtra } from './lp.js';

const raiz = document.querySelector('[data-demo="simplex"]');
if (raiz) iniciar(raiz);

function iniciar(raiz) {
  const en = raiz.dataset.lang === 'en';
  const campo = (n) => raiz.querySelector(`[name="${n}"]`);
  const num = (n) => Number(String(campo(n).value).replace(',', '.'));
  const fmt = (x, d = 0) => Number(x).toLocaleString(en ? 'en-GB' : 'es-ES', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: 'always' });
  const fmtX = (x) => (Math.abs(x - Math.round(x)) < 1e-6 ? fmt(Math.round(x)) : fmt(x, 2));
  const INICIAL = Object.fromEntries([...raiz.querySelectorAll('input')].map(i => [i.name, i.type === 'checkbox' ? i.checked : i.value]));

  const T = en ? {
    recursos: ['Fuel', 'Crew', 'Boats'], unidades: ['L', 'people', 'boats'], tipo: (i) => `Type ${i + 1}`,
    plan: 'Optimal plan', beneficio: 'Total profit', uso: 'Resource use', limita: 'binding', holgura: (h, u) => `${h} ${u} spare`,
    extra: 'Value of one more unit', extraNota: 'How much the continuous optimum rises with one more unit of each resource. Zero means one more unit does not improve the plan: even if the resource is used up, another one holds it back.',
    alternativos: 'There are alternative optima: other plans give exactly the same profit, for example', sinSol: 'No feasible plan with these data.',
    continuo: 'continuous', entero: 'integer', perdida: (p) => `Requiring whole boats costs ${p} of profit compared with the continuous optimum.`, igual: 'The integer optimum matches the continuous one.',
    leccion: 'Optimising is not predicting', leccionTxt: 'The simplex does not «get» capture right or wrong: it decides the best plan for the coefficients it is given. Prediction (ML) is useful upstream, estimating those coefficients when they are uncertain. Move the yield of type 3 and watch where the decision flips.',
  } : {
    recursos: ['Combustible', 'Tripulación', 'Barcos'], unidades: ['L', 'personas', 'barcos'], tipo: (i) => `Tipo ${i + 1}`,
    plan: 'Plan óptimo', beneficio: 'Beneficio total', uso: 'Uso de recursos', limita: 'limita', holgura: (h, u) => `sobran ${h} ${u}`,
    extra: 'Valor de una unidad más', extraNota: 'Cuánto sube el óptimo continuo con una unidad más de cada recurso. Cero significa que una unidad más no mejora el plan: aunque el recurso esté agotado, otro lo frena.',
    alternativos: 'Hay óptimos alternativos: otros planes dan exactamente el mismo beneficio, por ejemplo', sinSol: 'No hay ningún plan factible con estos datos.',
    continuo: 'continuo', entero: 'entero', perdida: (p) => `Exigir barcos enteros cuesta ${p} de beneficio frente al óptimo continuo.`, igual: 'El óptimo entero coincide con el continuo.',
    leccion: 'Optimizar no es predecir', leccionTxt: 'El Simplex no «acierta» ni «falla» capturas: decide el mejor plan para los coeficientes que recibe. La predicción (ML) es útil antes, para estimar esos coeficientes cuando son inciertos. Mueve el rendimiento del tipo 3 y mira dónde cambia la decisión.',
  };

  function leer() {
    const r = num('r');
    const c = [num('c0'), num('c1'), num('c2') * r];
    const A = [[num('a00'), num('a01'), num('a02')], [num('a10'), num('a11'), num('a12')], [1, 1, 1]];
    const b = [num('b0'), num('b1'), num('b2')];
    return { c, A, b };
  }

  function pintar() {
    for (const n of ['b0', 'b1', 'b2']) raiz.querySelector(`[data-v="${n}"]`).textContent = fmt(num(n));
    raiz.querySelector('[data-v="r"]').textContent = `×${fmt(num('r'), 2)}`;
    const { c, A, b } = leer();
    const salida = raiz.querySelector('[data-salida]');
    if ([...c, ...A.flat(), ...b].some(v => !Number.isFinite(v) || v < 0)) { salida.innerHTML = `<p class="mal">${T.sinSol}</p>`; return; }
    const cont = maximizar(c, A, b);
    if (!cont) { salida.innerHTML = `<p class="mal">${T.sinSol}</p>`; return; }
    const entero = campo('entero').checked;
    const ent = entero ? maximizarEntero(c, A, b, Math.floor(b[2])) : null;
    const sol = entero ? ent : cont;
    const extra = valorUnidadExtra(c, A, b);

    const plan = sol.x.map((x, i) => `<div><dt>${T.tipo(i)}</dt><dd>${fmtX(x)}</dd></div>`).join('')
      + `<div class="destacado"><dt>${T.beneficio}</dt><dd>${fmt(sol.valor, entero ? 0 : 2)}</dd></div>`;
    const uso = A.map((a, i) => {
      const usado = a.reduce((s, v, k) => s + v * sol.x[k], 0);
      const pct = b[i] > 0 ? Math.min(100, (usado / b[i]) * 100) : 0;
      const lim = b[i] - usado < 1e-6;
      return `<div class="demo-lp__barra${lim ? ' limita' : ''}"><span>${T.recursos[i]}</span><div><i style="width:${pct.toFixed(1)}%"></i></div>
        <span class="pequeno">${fmtX(usado)} / ${fmt(b[i])} ${T.unidades[i]} · ${lim ? `<b>${T.limita}</b>` : T.holgura(fmtX(b[i] - usado), T.unidades[i])}</span></div>`;
    }).join('');
    const ex = extra.map((v, i) => `<div${v > 1e-6 ? ' class="destacado"' : ''}><dt>${T.recursos[i]}</dt><dd>${v === null ? '—' : fmt(v, 2)}</dd></div>`).join('');
    let notas = '';
    if (!entero && cont.alternativos.length) notas += `<p class="pequeno">${T.alternativos} (${cont.alternativos[0].map(fmtX).join(' · ')}).</p>`;
    if (entero) notas += `<p class="pequeno">${cont.valor - ent.valor > 1e-6 ? T.perdida(fmt(cont.valor - ent.valor, 2)) : T.igual}</p>`;

    salida.innerHTML = `<p class="demo-reg__etq">${T.plan} (${entero ? T.entero : T.continuo})</p><dl class="demo-cat__datos">${plan}</dl>${notas}
      <p class="demo-reg__etq">${T.uso}</p>${uso}
      <p class="demo-reg__etq">${T.extra}</p><dl class="demo-cat__datos">${ex}</dl><p class="tenue pequeno">${T.extraNota}</p>
      <div class="demo-lp__leccion"><strong>${T.leccion}.</strong> ${T.leccionTxt}</div>`;
  }

  raiz.addEventListener('input', pintar);
  raiz.querySelector('[data-reset]').addEventListener('click', () => {
    for (const [n, v] of Object.entries(INICIAL)) { const i = campo(n); if (i.type === 'checkbox') i.checked = v; else i.value = v; }
    pintar();
  });
  pintar();
}
