// Interfaz de la demo de asset-identity-gs1. Todo corre en el navegador; no se envía nada.
import qrcode from '../vendor/qrcode.js';
import { derivar, clasificar, parseAlias, decodeGiai96, code128Svg, ErrorIdentidad } from './gs1.js';

const raiz = document.querySelector('[data-demo="gs1"]');
if (raiz) {
  const en = document.documentElement.lang.startsWith('en');
  const T = en ? {
    prefijo: 'The GS1 company prefix must have 6 to 12 digits.',
    bloque: 'The block must be between 0 and 9999.',
    serial: 'The serial must be between 0 and 99,999,999.',
    sede: 'The site code must have 1 to 8 characters (A-Z or 0-9).',
    numero: 'The inventory number needs at least one letter or digit.',
    dominio: 'The resolver domain must be a host name, e.g. verify.example.org.',
    referencia: 'The asset reference does not fit in the EPC.',
    alfabeto: 'Character outside the mod-43 alphabet.',
    code128: 'Code 128 only allows printable ASCII.',
    epc: 'Not a valid GIAI-96 EPC.',
    alias: 'Not a valid alias.',
    ALIAS: 'Alias (Code 128, people)', GIAI: 'GIAI (GS1 key)', EPC: 'EPC GIAI-96 (RFID)', GS1_LINK: 'GS1 Digital Link (QR)', UNKNOWN: 'Not recognized',
    ok: 'Check character is correct', mal: (e) => `Wrong check character: should be “${e}”. Probably a typo.`,
    sedeNum: (s, n) => `Site ${s} · inventory number ${n}`,
    bloqueSerial: (p, b, s, part) => `Prefix ${p} · block ${b} · serial ${s} · partition ${part}`,
    giaiNota: 'Prefix + block + serial. Resolve it against the register to find the asset.',
    copiado: 'Copied', copiar: 'Copy',
  } : {
    prefijo: 'El prefijo de empresa GS1 debe tener de 6 a 12 dígitos.',
    bloque: 'El bloque va de 0 a 9999.',
    serial: 'El serial va de 0 a 99.999.999.',
    sede: 'El código de sede debe tener de 1 a 8 caracteres A-Z o 0-9.',
    numero: 'El número de inventario necesita al menos una letra o un dígito.',
    dominio: 'El dominio resolvedor debe ser un nombre de host, p. ej. verify.example.org.',
    referencia: 'La referencia de activo no cabe en el EPC.',
    alfabeto: 'Carácter fuera del alfabeto mod-43.',
    code128: 'Code 128 solo admite ASCII imprimible.',
    epc: 'No es un EPC GIAI-96 válido.',
    alias: 'No es un alias válido.',
    ALIAS: 'Alias (Code 128, personas)', GIAI: 'GIAI (clave GS1)', EPC: 'EPC GIAI-96 (RFID)', GS1_LINK: 'GS1 Digital Link (QR)', UNKNOWN: 'No reconocido',
    ok: 'Carácter de control correcto', mal: (e) => `Carácter de control incorrecto: debería ser «${e}». Probablemente un error al teclear.`,
    sedeNum: (s, n) => `Sede ${s} · número de inventario ${n}`,
    bloqueSerial: (p, b, s, part) => `Prefijo ${p} · bloque ${b} · serial ${s} · partición ${part}`,
    giaiNota: 'Prefijo + bloque + serial. Se resuelve contra el registro para encontrar el activo.',
    copiado: 'Copiado', copiar: 'Copiar',
  };

  const $ = (s) => raiz.querySelector(s);
  const campos = ['prefijo', 'bloque', 'sede', 'dominio', 'serial', 'numero'];
  const error = $('[data-error]');

  function qrSvg(texto) {
    const qr = qrcode(0, 'M');
    qr.addData(texto);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }

  function generar() {
    const v = Object.fromEntries(campos.map(c => [c, $(`[name="${c}"]`).value.trim()]));
    try {
      if (!/^\d+$/.test(v.bloque)) throw new ErrorIdentidad('bloque');
      if (!/^\d+$/.test(v.serial)) throw new ErrorIdentidad('serial');
      const r = derivar({
        prefijo: v.prefijo, bloque: Number(v.bloque), sede: v.sede.toUpperCase(),
        dominio: v.dominio, serial: Number(v.serial), numero: v.numero,
      });
      error.hidden = true;
      raiz.querySelector('[data-salidas]').classList.remove('atenuado');
      for (const k of ['giai', 'alias', 'epc', 'link']) $(`[data-salida="${k}"]`).textContent = r[k];
      $('[data-codigo="code128"]').innerHTML = code128Svg(r.alias, { modulo: 2, alto: 56 });
      $('[data-codigo="qr"]').innerHTML = qrSvg(r.link);
      $('[data-texto="alias"]').textContent = r.alias;
    } catch (e) {
      if (!(e instanceof ErrorIdentidad)) throw e;
      error.textContent = T[e.codigo] || e.message;
      error.hidden = false;
      raiz.querySelector('[data-salidas]').classList.add('atenuado');
    }
  }

  function leer() {
    const entrada = $('[name="lectura"]').value;
    const salida = $('[data-lectura]');
    const r = clasificar(entrada);
    if (!entrada.trim()) { salida.innerHTML = ''; return; }
    const lineas = [`<strong>${T[r.tipo]}</strong>`];
    try {
      if (r.tipo === 'ALIAS') {
        const a = parseAlias(r.payload);
        lineas.push(T.sedeNum(a.sede, a.numero));
        lineas.push(a.checkOk ? `<span class="ok">✔ ${T.ok}</span>` : `<span class="mal">✘ ${T.mal(a.esperado)}</span>`);
      } else if (r.tipo === 'EPC') {
        const d = decodeGiai96(r.payload);
        lineas.push(`GIAI ${d.giai}`);
        lineas.push(T.bloqueSerial(d.prefijo, d.bloque, d.serial, d.particion));
      } else if (r.tipo === 'GS1_LINK' || r.tipo === 'GIAI') {
        lineas.push(`GIAI ${r.payload}`);
        lineas.push(T.giaiNota);
      }
    } catch (e) {
      lineas.push(`<span class="mal">${T[e.codigo] || e.message}</span>`);
    }
    salida.innerHTML = lineas.map(l => `<p>${l}</p>`).join('');
  }

  raiz.addEventListener('input', (ev) => {
    if (ev.target.name === 'lectura') leer(); else generar();
  });
  raiz.querySelectorAll('[data-ejemplo]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.ejemplo;
    $('[name="lectura"]').value = k === 'error'
      ? $('[data-salida="alias"]').textContent.replace(/-(.)$/, (m, c) => '-' + (c === 'X' ? 'Y' : 'X'))
      : $(`[data-salida="${k}"]`).textContent;
    leer();
  }));
  raiz.querySelectorAll('[data-copiar]').forEach(b => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($(`[data-salida="${b.dataset.copiar}"]`).textContent);
      b.textContent = T.copiado; setTimeout(() => { b.textContent = T.copiar; }, 1200);
    } catch (e) { /* sin portapapeles */ }
  }));
  generar();
}
