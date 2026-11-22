# Código de terceros

| Componente | Versión | Licencia | Uso |
|---|---|---|---|
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (Kazuhiko Arase) | 1.4.4 | MIT | Dibujar el QR en la demo de asset-identity-gs1 (`assets/js/vendor/qrcode.js`) |

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
| [Pyodide](https://pyodide.org) | 0.26.4 | MPL-2.0 | Python en el navegador para la demo de paradox-db-py; se descarga de cdn.jsdelivr.net solo al pulsar el botón |
| paradoxdb (wheel de PyPI) | 0.1.0 | MIT (mismo autor) | `content/proyectos/paradox-db-py/paradoxdb-0.1.0-py3-none-any.whl`, SHA-256 `39502ad11347d6e1d9e8dd5d6193e0dd214a04180ce4d2b9d7693837ec240130`, idéntico al publicado en PyPI |

La tabla `ACTIVOS.DB`/`.MB` de esa demo es sintética: la genera `paradoxdb.synthetic` con datos inventados.
