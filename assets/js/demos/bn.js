// Inferencia exacta por enumeración en una red bayesiana discreta pequeña.
// red = { nodos: [{ id, estados, padres, padres_estados, tabla }] }, con la tabla en el orden de pgmpy:
// una fila por combinación de estados de los padres (el último padre varía más rápido).

export function preparar(red) {
  const porId = Object.fromEntries(red.nodos.map(n => [n.id, n]));
  // Orden topológico para enumerar.
  const orden = [];
  const visto = new Set();
  const visitar = (id) => {
    if (visto.has(id)) return;
    visto.add(id);
    porId[id].padres.forEach(visitar);
    orden.push(id);
  };
  red.nodos.forEach(n => visitar(n.id));
  return { porId, orden };
}

function filaTabla(nodo, asignacion) {
  let fila = 0;
  for (let k = 0; k < nodo.padres.length; k++) {
    const estados = nodo.padres_estados[k];
    fila = fila * estados.length + estados.indexOf(asignacion[nodo.padres[k]]);
  }
  return nodo.tabla[fila];
}

/**
 * P(objetivo | evidencia), opcionalmente con intervenciones do(): el nodo intervenido
 * pierde a sus padres y toma el valor fijado con probabilidad 1.
 */
export function consultar(modelo, objetivo, evidencia = {}, intervencion = {}) {
  const { porId, orden } = modelo;
  const salida = new Array(porId[objetivo].estados.length).fill(0);
  const asignacion = {};
  const recorrer = (i, prob) => {
    if (prob === 0) return;
    if (i === orden.length) {
      salida[porId[objetivo].estados.indexOf(asignacion[objetivo])] += prob;
      return;
    }
    const id = orden[i];
    const nodo = porId[id];
    if (id in intervencion) {
      asignacion[id] = intervencion[id];
      recorrer(i + 1, prob);
      return;
    }
    const probs = filaTabla(nodo, asignacion);
    nodo.estados.forEach((estado, s) => {
      if (id in evidencia && evidencia[id] !== estado) return;
      asignacion[id] = estado;
      recorrer(i + 1, prob * probs[s]);
    });
    delete asignacion[id];
  };
  recorrer(0, 1);
  const total = salida.reduce((a, b) => a + b, 0);
  return salida.map(v => v / total);
}
