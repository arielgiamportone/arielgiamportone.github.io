// Programación lineal pequeña (n variables, m restricciones ≤, x ≥ 0) resuelta exactamente por
// enumeración de vértices. Basta para el modelo docente de 3 tipos de barco y es fácil de verificar:
// tests/js/lp.test.mjs lo compara con scipy (HiGHS).

const EPS = 1e-9;

// Resuelve A·x = b por eliminación gaussiana con pivoteo parcial; null si es singular.
function resolverSistema(A, b) {
  const n = A.length;
  const M = A.map((fila, i) => [...fila, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let f = c + 1; f < n; f++) if (Math.abs(M[f][c]) > Math.abs(M[p][c])) p = f;
    if (Math.abs(M[p][c]) < EPS) return null;
    [M[c], M[p]] = [M[p], M[c]];
    for (let f = 0; f < n; f++) {
      if (f === c) continue;
      const k = M[f][c] / M[c][c];
      for (let j = c; j <= n; j++) M[f][j] -= k * M[c][j];
    }
  }
  return M.map((fila, i) => fila[n] / fila[i]);
}

function combinaciones(total, k) {
  const out = [];
  const rec = (inicio, actual) => {
    if (actual.length === k) { out.push(actual.slice()); return; }
    for (let i = inicio; i < total; i++) { actual.push(i); rec(i + 1, actual); actual.pop(); }
  };
  rec(0, []);
  return out;
}

/**
 * max c·x  s.a.  A·x ≤ b, x ≥ 0
 * Devuelve { valor, x, alternativos } (alternativos: otros vértices con el mismo óptimo) o null si no hay
 * solución acotada.
 */
export function maximizar(c, A, b) {
  const n = c.length;
  // Todas las restricciones como filas «a·x ≤ r»: las del problema y -x_j ≤ 0.
  const filas = A.map((a, i) => ({ a, r: b[i] }));
  for (let j = 0; j < n; j++) filas.push({ a: c.map((_, k) => (k === j ? -1 : 0)), r: 0 });
  const factible = (x) => filas.every(({ a, r }) => a.reduce((s, v, k) => s + v * x[k], 0) <= r + 1e-7);
  // Acotación: el problema es no acotado si algún c_j > 0 no está limitado por ninguna restricción.
  for (let j = 0; j < n; j++) if (c[j] > EPS && !A.some(a => a[j] > EPS)) return null;
  let mejor = null;
  const vertices = [];
  for (const idx of combinaciones(filas.length, n)) {
    const x = resolverSistema(idx.map(i => filas[i].a), idx.map(i => filas[i].r));
    if (!x || !factible(x)) continue;
    const xs = x.map(v => (Math.abs(v) < 1e-9 ? 0 : v));
    const valor = c.reduce((s, v, k) => s + v * xs[k], 0);
    vertices.push({ x: xs, valor });
    if (!mejor || valor > mejor.valor + 1e-7) mejor = { x: xs, valor };
  }
  if (!mejor) return null;
  const clave = (x) => x.map(v => v.toFixed(6)).join(',');
  const vistos = new Set([clave(mejor.x)]);
  const alternativos = [];
  for (const v of vertices) {
    if (Math.abs(v.valor - mejor.valor) <= 1e-6 * Math.max(1, Math.abs(mejor.valor)) && !vistos.has(clave(v.x))) {
      vistos.add(clave(v.x)); alternativos.push(v.x);
    }
  }
  return { valor: mejor.valor, x: mejor.x, alternativos };
}

/** Óptimo con variables enteras por búsqueda exhaustiva (cotas pequeñas). */
export function maximizarEntero(c, A, b, cota) {
  const n = c.length;
  let mejor = null;
  const x = new Array(n).fill(0);
  const rec = (j) => {
    if (j === n) {
      if (!A.every((a, i) => a.reduce((s, v, k) => s + v * x[k], 0) <= b[i] + 1e-9)) return;
      const valor = c.reduce((s, v, k) => s + v * x[k], 0);
      if (!mejor || valor > mejor.valor) mejor = { valor, x: x.slice() };
      return;
    }
    for (let v = 0; v <= cota; v++) { x[j] = v; rec(j + 1); }
  };
  rec(0);
  return mejor;
}

/** Cuánto sube el óptimo si se dispone de una unidad más de cada recurso. */
export function valorUnidadExtra(c, A, b) {
  const base = maximizar(c, A, b);
  if (!base) return null;
  return b.map((_, i) => {
    const r = maximizar(c, A, b.map((v, k) => (k === i ? v + 1 : v)));
    return r ? r.valor - base.valor : null;
  });
}
