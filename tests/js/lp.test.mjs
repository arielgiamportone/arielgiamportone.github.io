// Compara el solver del navegador con scipy.optimize.linprog (HiGHS): tests/js/lp_vectores.json.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { maximizar, maximizarEntero, valorUnidadExtra } from '../../assets/js/demos/lp.js';

const casos = JSON.parse(readFileSync(new URL('./lp_vectores.json', import.meta.url)));
let n = 0;
for (const k of casos) {
  const r = maximizar(k.c, k.A, k.b);
  assert.ok(Math.abs(r.valor - k.valor) < 1e-6 * Math.max(1, Math.abs(k.valor)), `óptimo ${JSON.stringify(k.b)}`);
  const extra = valorUnidadExtra(k.c, k.A, k.b);
  extra.forEach((v, i) => assert.ok(Math.abs(v - k.extra[i]) < 1e-5 * Math.max(1, Math.abs(k.valor)), `unidad extra ${i}`));
  n++;
}
// Entero: comprobación independiente por fuerza bruta con un modelo conocido.
const e = maximizarEntero([800, 1200, 1800], [[200, 300, 500], [8, 12, 18], [1, 1, 1]], [5000, 150, 15], 15);
assert.equal(e.valor, 15000);
// Óptimos alternativos: los tipos 1 y 2 rinden lo mismo por litro en el modelo base.
assert.ok(maximizar([800, 1200, 1800], [[200, 300, 500], [8, 12, 18], [1, 1, 1]], [3000, 150, 15]).alternativos.length > 0);
console.log(`lp: ${n} casos contra scipy, entero y alternativos OK`);
