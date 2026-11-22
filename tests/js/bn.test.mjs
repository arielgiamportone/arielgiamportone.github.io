// Comprueba la inferencia JS contra pgmpy (VariableElimination y CausalInference) con la red del proyecto.
// node tests/js/bn.test.mjs
import { readFileSync } from 'node:fs';
import { preparar, consultar } from '../../assets/js/demos/bn.js';

const red = JSON.parse(readFileSync(new URL('../../content/proyectos/fisheries-sustainability-mlops/red.json', import.meta.url)));
const v = JSON.parse(readFileSync(new URL('./bn_vectores.json', import.meta.url)));
const modelo = preparar(red);
let fallos = 0, maxErr = 0;
const comparar = (obtenido, esperado, msg) => {
  obtenido.forEach((x, i) => {
    const e = Math.abs(x - esperado[i]);
    maxErr = Math.max(maxErr, e);
    if (e > 1e-5) { fallos++; console.error(`FALLO ${msg}: ${x} vs ${esperado[i]}`); }
  });
};
for (const c of v.consultas) comparar(consultar(modelo, c.objetivo, c.evidencia), c.p, `${c.objetivo} | ${JSON.stringify(c.evidencia)}`);
for (const c of v.intervenciones) comparar(consultar(modelo, 'Sustainable', {}, c.do), c.p, `do ${JSON.stringify(c.do)}`);
console.log(`bn: ${v.consultas.length} consultas y ${v.intervenciones.length} intervenciones, error máx ${maxErr.toExponential(1)}, ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
