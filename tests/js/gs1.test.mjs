// Comprueba el port JS de asset-identity-gs1 contra vectores del paquete de PyPI (assetid 0.1.0).
// node tests/js/gs1.test.mjs
import { readFileSync } from 'node:fs';
import { derivar, decodeGiai96, clasificar, parseAlias, code128Svg } from '../../assets/js/demos/gs1.js';

const v = JSON.parse(readFileSync(new URL('./gs1_vectores.json', import.meta.url)));
let fallos = 0;
const igual = (a, b, msg) => { if (a !== b) { fallos++; console.error(`FALLO ${msg}: ${a} != ${b}`); } };

for (const c of v.identidades) {
  const r = derivar({ prefijo: c.prefix, bloque: c.block, sede: c.tenant, dominio: c.domain, serial: c.serial, numero: c.inv });
  igual(r.giai, c.giai, `giai ${c.prefix}/${c.serial}`);
  igual(r.alias, c.alias, `alias ${c.inv}`);
  igual(r.epc, c.epc, `epc ${c.prefix}/${c.serial}`);
  igual(r.link, c.link, `link ${c.giai}`);
  const d = decodeGiai96(c.epc);
  igual(d.giai, c.dec_giai, `decode ${c.epc}`);
  igual(d.particion, c.partition, `partición ${c.epc}`);
}
for (const p of v.parse) {
  const r = clasificar(p.t);
  igual(r.tipo, p.kind.replace('CodeKind.', ''), `tipo de ${JSON.stringify(p.t)}`);
  igual(r.payload, p.payload, `payload de ${JSON.stringify(p.t)}`);
  if ('check_ok' in p) igual(parseAlias(r.payload).checkOk, p.check_ok, `control de ${p.t}`);
}
if (!code128Svg('AID-NOR-MOB0042-1').includes('<rect')) { fallos++; console.error('FALLO code128'); }
console.log(`gs1: ${v.identidades.length} identidades y ${v.parse.length} lecturas, ${fallos} fallos`);
process.exit(fallos ? 1 : 0);
