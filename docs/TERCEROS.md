# Código de terceros

| Componente | Versión | Licencia | Uso |
|---|---|---|---|
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (Kazuhiko Arase) | 1.4.4 | MIT | Dibujar el QR en la demo de asset-identity-gs1 (`assets/js/vendor/qrcode.js`) |
| [Simple Icons](https://simpleicons.org) | 13.21.0 | CC0-1.0 | Iconos de ResearchGate, Linktree y ORCID del pie (trazos copiados en `layouts/partials/redes.html`) |
| [Simple Icons](https://simpleicons.org) | 16.38.1 | CC0-1.0 | Iconos de la cinta «Con qué trabajo» de la portada (trazos en `data/tecnologias.yaml`, generados con `scripts/gen_tecnologias.py`). Las marcas siguen siendo de sus dueños |
| [DejaVu Sans](https://dejavu-fonts.github.io) | 2.37 | Licencia libre de Bitstream Vera / DejaVu | Tipografía de las tarjetas Open Graph (`assets/fonts/`) |

Las capturas y diagramas de trawlkit proceden de su propio repositorio (código MIT, documentación CC BY 4.0, mismo autor).

## Datos de las demos

| Fuente | Licencia | Uso |
|---|---|---|
| Ortofotos PNOA, © Instituto Geográfico Nacional | CC BY 4.0 (scne.es) | Imágenes de la demo de catastro-enrichment-es, con su atribución |
| Dirección General del Catastro y catastros forales de Álava, Bizkaia, Gipuzkoa y Navarra | Uso público con atribución | Resultados precalculados de la demo de catastro-enrichment-es (22/11/2026) |
| OpenStreetMap vía Nominatim | ODbL | Dos resultados de geocoding de ejemplo |

## Código que se ejecuta en las demos

| Componente | Versión | Licencia | Uso |
|---|---|---|---|
| [Pyodide](https://pyodide.org) | 0.26.4 | MPL-2.0 | Python en el navegador para las demos de paradox-db-py, del registro de activos multi-tenant, del panel de inspecciones (con pandas) y del archivador de fotos; se descarga de cdn.jsdelivr.net solo al pulsar el botón |
| paradoxdb (wheel de PyPI) | 0.1.0 | MIT (mismo autor) | `content/proyectos/paradox-db-py/paradoxdb-0.1.0-py3-none-any.whl`, SHA-256 `39502ad11347d6e1d9e8dd5d6193e0dd214a04180ce4d2b9d7693837ec240130`, idéntico al publicado en PyPI |

La tabla `ACTIVOS.DB`/`.MB` de esa demo es sintética: la genera `paradoxdb.synthetic` con datos inventados.

Los módulos de los casos clean-room (registro de activos, panel de inspecciones y archivador de fotos) se copian sin cambios de sus repositorios públicos (MIT, mismo autor); `tests/test_demos.py` comprueba su SHA-256. Los simuladores de PesquerosEnIA y la animación de QA3DS se cargan desde sus GitHub Pages, no se copian.

## Logos de organizaciones (portada)

La cinta «Donde he trabajado» de la portada muestra los logos de organizaciones en las que trabajé
(`static/logos/`, lista en `data/organizaciones.yaml`). Se tomaron de la web oficial de cada una y
solo identifican la relación laboral o académica; son marcas de sus dueños y no implican respaldo.
Retoques: el texto blanco del logo de Intervalor Data se pasó a gris para que se lea en fondo claro,
y del logo del Consejo Federal de Inversiones se recortó el sello conmemorativo de «65 años».
