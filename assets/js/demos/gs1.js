// Port a JavaScript de la lógica de identidad de asset-identity-gs1 (assetid 0.1.0, MIT).
// Se comprueba contra vectores generados con el paquete de PyPI: tests/gs1_vectores.json.

export const CHECK_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%';
const TENANT_RE = /^[A-Z0-9]{1,8}$/;
const DOMAIN_RE = /^[A-Za-z0-9](?:[A-Za-z0-9.-]*[A-Za-z0-9])?(?::\d{1,5})?$/;
const DIGITS_RE = /^[0-9]+$/;
const PARTITIONS = {
  0: [40, 12, 42, 13], 1: [37, 11, 45, 14], 2: [34, 10, 48, 15], 3: [30, 9, 52, 16],
  4: [27, 8, 55, 17], 5: [24, 7, 58, 18], 6: [20, 6, 62, 19],
};

/** Error con un código estable (la interfaz lo traduce). */
export class ErrorIdentidad extends Error {
  constructor(codigo) { super(codigo); this.codigo = codigo; }
}

export function checkChar(body) {
  let total = 0;
  for (const c of body) {
    const v = CHECK_ALPHABET.indexOf(c);
    if (v < 0) throw new ErrorIdentidad('alfabeto');
    total += v;
  }
  return CHECK_ALPHABET[total % 43];
}

export function normalizarNumero(texto) {
  const n = [...texto.toUpperCase()].filter(c => /[A-Z0-9]/.test(c)).join('');
  if (!n) throw new ErrorIdentidad('numero');
  return n;
}

export function alias(tenant, numero) {
  if (!TENANT_RE.test(tenant)) throw new ErrorIdentidad('sede');
  const body = `${tenant}-${normalizarNumero(numero)}`;
  return `AID-${body}-${checkChar(body)}`;
}

export function referencia(bloque, serial) {
  if (!Number.isInteger(bloque) || bloque < 0 || bloque > 9999) throw new ErrorIdentidad('bloque');
  if (!Number.isInteger(serial) || serial < 0 || serial > 99999999) throw new ErrorIdentidad('serial');
  return String(bloque).padStart(4, '0') + String(serial).padStart(8, '0');
}

function exigirPrefijo(prefijo) {
  if (!DIGITS_RE.test(prefijo) || prefijo.length < 6 || prefijo.length > 12) {
    throw new ErrorIdentidad('prefijo');
  }
}

export function encodeGiai96(prefijo, ref, filtro = 0) {
  exigirPrefijo(prefijo);
  const particion = 12 - prefijo.length;
  const [, , refBits, maxDig] = PARTITIONS[particion];
  if (!DIGITS_RE.test(ref) || ref.length > maxDig) throw new ErrorIdentidad('referencia');
  const r = BigInt(ref);
  if (r >= (1n << BigInt(refBits))) throw new ErrorIdentidad('referencia');
  let v = 0x34n << 88n;
  v |= BigInt(filtro) << 85n;
  v |= BigInt(particion) << 82n;
  v |= BigInt(prefijo) << BigInt(refBits);
  v |= r;
  return v.toString(16).toUpperCase().padStart(24, '0');
}

export function decodeGiai96(hex) {
  const t = hex.trim();
  if (!/^[0-9a-fA-F]{24}$/.test(t)) throw new ErrorIdentidad('epc');
  const v = BigInt('0x' + t);
  const cabecera = Number(v >> 88n);
  if (cabecera !== 0x34) throw new ErrorIdentidad('epc');
  const filtro = Number((v >> 85n) & 7n);
  const particion = Number((v >> 82n) & 7n);
  if (!(particion in PARTITIONS)) throw new ErrorIdentidad('epc');
  const [prefBits, prefDig, refBits, maxDig] = PARTITIONS[particion];
  const prefijo = ((v >> BigInt(refBits)) & ((1n << BigInt(prefBits)) - 1n)).toString().padStart(prefDig, '0');
  const ref = (v & ((1n << BigInt(refBits)) - 1n)).toString().padStart(maxDig, '0');
  const ref12 = ref.slice(-12).padStart(12, '0');
  return { filtro, particion, prefijo, ref, giai: prefijo + ref12, bloque: Number(ref12.slice(0, 4)), serial: Number(ref12.slice(4)) };
}

export function derivar({ prefijo, bloque, sede, dominio, serial, numero }) {
  exigirPrefijo(prefijo);
  if (!DOMAIN_RE.test(dominio)) throw new ErrorIdentidad('dominio');
  const ref = referencia(bloque, serial);
  const giai = prefijo + ref;
  return {
    referencia: ref,
    giai,
    alias: alias(sede, numero),
    epc: encodeGiai96(prefijo, ref),
    link: `https://${dominio}/8004/${giai}`,
  };
}

export function parseAlias(texto) {
  const v = texto.trim().toUpperCase();
  if (!v.startsWith('AID-')) throw new ErrorIdentidad('alias');
  const resto = v.slice(4);
  const i = resto.lastIndexOf('-');
  if (i <= 0) throw new ErrorIdentidad('alias');
  const body = resto.slice(0, i), check = resto.slice(i + 1);
  const j = body.indexOf('-');
  if (j <= 0 || j === body.length - 1) throw new ErrorIdentidad('alias');
  let ok = false;
  try { ok = check.length === 1 && checkChar(body) === check; } catch (e) { ok = false; }
  return { sede: body.slice(0, j), numero: body.slice(j + 1), check, esperado: safeCheck(body), checkOk: ok };
}

function safeCheck(body) { try { return checkChar(body); } catch (e) { return null; } }

/** Clasifica un código leído, como parse_any de assetid. */
export function clasificar(texto) {
  const v = (texto || '').trim();
  if (!v) return { tipo: 'UNKNOWN', payload: '' };
  if (v.toUpperCase().startsWith('AID-')) return { tipo: 'ALIAS', payload: v.toUpperCase() };
  if (/^https?:\/\//i.test(v)) {
    let path = '';
    try { path = new URL(v).pathname; } catch (e) { return { tipo: 'UNKNOWN', payload: v }; }
    const m = path.match(/\/8004\/([^/?#]+)/);
    if (m && DIGITS_RE.test(m[1])) return { tipo: 'GS1_LINK', payload: m[1] };
    return { tipo: 'UNKNOWN', payload: v };
  }
  if (v.length === 24) {
    try { decodeGiai96(v); return { tipo: 'EPC', payload: v.toUpperCase() }; } catch (e) { /* no es EPC */ }
  }
  if (DIGITS_RE.test(v) && v.length > 6 && v.length <= 30) return { tipo: 'GIAI', payload: v };
  return { tipo: 'UNKNOWN', payload: v };
}

// ------------------------------------------------------------ Code 128 (B)
const C128 = ['212222','222122','222221','121223','121322','131222','122213','122312','132212','221213','221312','231212','112232','122132','122231','113222','123122','123221','223211','221132','221231','213212','223112','312131','311222','321122','321221','312212','322112','322211','212123','212321','232121','111323','131123','131321','112313','132113','132311','211313','231113','231311','112133','112331','132131','113123','113321','133121','313121','211331','231131','213113','213311','213131','311123','311321','331121','312113','312311','332111','314111','221411','431111','111224','111422','121124','121421','141122','141221','112214','112412','122114','122411','142112','142211','241211','221114','413111','241112','134111','111242','121142','121241','114212','124112','124211','411212','421112','421211','212141','214121','412121','111143','111341','131141','114113','114311','411113','411311','113141','114131','311141','411131','211412','211214','211232','2331112'];

/** Devuelve un SVG con el Code 128 (juego B) del texto. */
export function code128Svg(texto, { alto = 60, modulo = 2 } = {}) {
  const valores = [104];
  for (const c of texto) {
    const v = c.charCodeAt(0) - 32;
    if (v < 0 || v > 94) throw new ErrorIdentidad('code128');
    valores.push(v);
  }
  let suma = 104;
  valores.slice(1).forEach((v, i) => { suma += v * (i + 1); });
  valores.push(suma % 103, 106);
  let x = 10 * modulo, barras = '';
  for (const v of valores) {
    const patron = C128[v];
    for (let i = 0; i < patron.length; i++) {
      const w = Number(patron[i]) * modulo;
      if (i % 2 === 0) barras += `<rect x="${x}" y="0" width="${w}" height="${alto}"/>`;
      x += w;
    }
  }
  const ancho = x + 10 * modulo;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${ancho} ${alto}" width="100%" role="img" aria-label="Code 128: ${texto}"><rect width="${ancho}" height="${alto}" fill="#fff"/><g fill="#000">${barras}</g></svg>`;
}
