# Plan del portfolio v2 — arielgiamportone.github.io

> Estado: borrador para aprobar · 2026-11-22
> Fuente única de los datos: `arielgiamportone/cv-perfil-profesional` (`base/` y `perfiles/`), validada en la auditoría del 2026-11-08 al 22.

## 1. Diagnóstico del sitio actual

El sitio es Hugo con el tema `hugo-profile` (submódulo) y casi todo el contenido escrito a mano en `hugo.toml`. No se ha tocado desde 11/2025.

**Datos que contradicen la base validada (hay que retirarlos ya):**
- Cifras sin respaldo: «quintupliqué el presupuesto», «20+ proyectos con 95 % de finalización», «15+ proyectos simultáneos», «reducción del 70 % en tiempo de auditoría».
- Proyectos que no existen como tales: «Plataforma de Análisis de Datos Pesqueros (R Shiny)», «Sistema de Gestión de Calidad ISO 9001 … Ver Certificación», «Sistema de visión por computadora … Ver Demo».
- Títulos y fechas: «Maestría» (es un máster título propio), Director Provincial «Feb 2021 – Ene 2022» (base: 03/2021 – 12/2021), puesto de Intervalor sin el título actual, Docente sin el historial completo.
- Falta todo lo de 2025-2026: Intervalor Data (Datos, IA y Producto), los paquetes PyPI, Zenodo, Pesqueros en IA, publicaciones con DOI.

**Defectos técnicos:**
- Enlaces rotos: botones «Ver Demo», «Ver Galería», «Ver Tesis» apuntan a `#`; páginas de detalle (`/proyectos/...`, `/formaciones/...`) que no existen.
- Pie con redes equivocadas (`github.com/giamportone`, `linkedin.com/in/ariel-giamportone`, un Instagram que no es tuyo) y un formulario de newsletter que no hace nada.
- El workflow sube el artefacto dos veces y despliega también en los pull requests.
- Ficheros sueltos en la raíz (`perfil.md`, `ejemplo.html`, borradores `.MD`) que no forman parte del sitio.
- Un solo perfil («Ingeniero Pesquero & Data Scientist»): no refleja los cuatro perfiles con los que te presentas.

## 2. Objetivos

1. **Verdad:** todo lo publicado sale de la base validada. Nada de cifras sin documento.
2. **Cuatro perfiles, una web:** el visitante elige la lente (o llega desde el CV ya con ella) y ve primero lo relevante para ese perfil.
3. **Proyectos que se pueden tocar:** cada proyecto con imagen, contexto, qué hiciste, stack, enlaces, y una demo o simulador cuando sea posible.
4. **Mantenible:** actualizar la base y ejecutar un script debe bastar para refrescar la web.
5. **Bilingüe ES/EN** desde el principio.

## 3. Arquitectura propuesta

- **Hugo con un tema propio, sin submódulo.** Hugo ya está desplegado y es rápido; el tema `hugo-profile` es lo que limita el diseño. Un tema propio pequeño (layouts + CSS con variables) da control total y no depende de terceros.
- **Datos generados, no escritos a mano.** Un script `scripts/sync_base.py` lee `cv-perfil-profesional/base/*.md` (frontmatter YAML) y genera `data/*.yaml` (experiencia, proyectos, publicaciones, formación, skills), respetando `mostrar_en_cv`, los `[VALIDAR]` (no se publican) y las exclusiones.
- **Páginas de proyecto como contenido.** `content/proyectos/<id>/index.md` (page bundle) con sus imágenes y, si la hay, la demo en la misma carpeta.
- **Demos 100 % estáticas** (GitHub Pages no ejecuta servidor):
  - JavaScript puro para simuladores ligeros.
  - Pyodide (Python en el navegador) cuando la gracia es usar el paquete real de PyPI.
  - Resultados precalculados (GeoJSON, JSON, imágenes) cuando el cálculo necesita una API o datos que no pueden ir al navegador.
- **Imágenes reproducibles:** diagramas en SVG hechos con código, gráficos con matplotlib/Plotly, capturas con Playwright de las demos. Fotos reales (KIPPA, trampas, campañas) solo las que tú aportes. Nada de imágenes generadas por IA que parezcan fotos reales de trabajo.
- **CI:** build en los PR sin desplegar; despliegue solo desde `main`. Comprobación de enlaces rotos (`htmltest` o `lychee`) en cada build.

## 4. Diseño (UI) con los cuatro perfiles

| Lente | Clave en la base | Color | Qué pone delante |
|---|---|---|---|
| IA y ciencia de datos | `data_scientist_ai` | violeta | ML, redes bayesianas, MLOps, publicaciones |
| Ingeniería de software con IA | `ai_software_engineer` | azul | AYUNDATA, FastAPI, paquetes PyPI, LLM |
| Datos para el sector público | `govtech_data_engineer` | verde | ETL, inventarios públicos, ENS, informes |
| Economía azul y pesca | `blue_economy_marine` | turquesa | trawlkit, GFW, KIPPA, centolla, PesquerosEnIA |

- **Portada:** presentación corta común + selector de lente (cuatro tarjetas). Al elegir, cambian el titular, el resumen, el orden de proyectos y las skills destacadas. La elección se refleja en la URL (`/?perfil=govtech`) para enlazarla desde cada CV.
- **Páginas por perfil** (`/perfiles/govtech/`, etc.): versión estática y enlazable de cada lente, buena para SEO y para pegar en una candidatura.
- **Proyectos:** rejilla filtrable por lente y por tipo (producto, paquete, investigación, hardware). Cada tarjeta con imagen, una frase y etiquetas.
- **Trayectoria:** línea de tiempo única (no secciones sueltas), con filtro por lente.
- **Publicaciones:** lista con DOI y enlaces, separada por tipo.
- **Detalles:** modo claro/oscuro, accesible (contraste AA, navegación por teclado), ligera (sin jQuery, fuentes del sistema o una sola fuente variable), descarga del CV en PDF por perfil.

## 5. Inventario de proyectos y qué necesita cada uno

Prioridad: **A** = primera tanda, **B** = segunda, **C** = solo ficha.

| # | Proyecto | Lentes | Demo o simulador propuesto | Imágenes | Prio |
|---|---|---|---|---|---|
| 1 | trawlkit / Trawl Design Lab | azul, software | Simulador de red de arrastre en el navegador (geometría, resistencia, apertura) con el paquete real vía Pyodide | Diagrama de la red, gráficos de resistencia | A |
| 2 | asset-identity-gs1 | govtech, software | Generador y validador de GIAI / EPC / dígito de control GS1, con QR | Diagrama de codificación | A |
| 3 | catastro-enrichment-es | govtech, datos | Visor de ejemplos precalculados (referencia catastral → datos y mapa) | Mapa y esquema del pipeline | A |
| 4 | AYUNDATA (caso de estudio) | software, govtech | Sin demo en vivo: recorrido con capturas sobre datos sintéticos + arquitectura | Arquitectura, capturas anonimizadas | A |
| 5 | cfp-audit-intelligence | software, datos, azul | Ejemplo de auditoría sobre datos de muestra (resultado precalculado) | Flujo del agente | A |
| 6 | fisheries-sustainability-mlops | datos, azul | Red bayesiana interactiva (mover evidencias y ver la probabilidad de sostenibilidad) | DAG de la red, métricas | A |
| 7 | APIGFW — esfuerzo pesquero | azul, datos | Mapa de esfuerzo pesquero precalculado (GeoJSON) | Mapas | B |
| 8 | paradox-db-py | software, govtech | Lector de un .DB de ejemplo en el navegador (Pyodide) | Esquema del formato | B |
| 9 | periodic-report-kit | software, govtech | Informe de ejemplo generado (PDF/HTML) descargable | Portada y páginas del informe | B |
| 10 | Casos clean-room de Intervalor | software, govtech | Según cada repo público | Diagramas | B |
| 11 | KIPPA I — ROV | azul, software | Visor 3D o despiece del ROV; telemetría de ejemplo | Fotos reales (tuyas) | B |
| 12 | VITO GNU/Linux | azul, software | — | Capturas, fotos a bordo | B |
| 13 | Investigación operativa: Simplex vs ML | datos | Comparador interactivo con un problema pequeño | Gráficos | B |
| 14 | PesquerosEnIA — cursos | azul, datos | Enlaces a notebooks (Colab / Binder) | Portadas de cursos | B |
| 15 | Centolla: RAS y trampas (CONICET) | azul | — | Fotos de laboratorio y trampas (tuyas) | C |
| 16 | PID Liofilizados (UTN) | azul | — | Fotos del equipo | C |
| 17 | MarArg, Aura Farm AR, transcriptor de placas | varias | — | Capturas | C |
| 18 | Sensores de gas / biorreactor | azul | Caso clean-room (ver TODO de la base) | Diagramas | C |

Proyectos internos de Intervalor sin repo público (INTERDATA, MAD 69/23, Metro de Madrid, LicDATAhunter, ENS): **solo como experiencia**, descritos en genérico, sin nombre de cliente donde no sea ya público, sin capturas y sin datos. Encaja con el ENS y con la confidencialidad de los clientes.

## 6. Fases

| Fase | Qué | Resultado |
|---|---|---|
| 0 ✅ | Rama `v2`; retirar lo falso del sitio actual y arreglar el pie y el workflow | El sitio actual deja de decir cosas sin respaldo (se despliega ya) |
| 1 ✅ | Script de sincronización base → `data/` | Datos de la web generados desde la base |
| 2 ✅ | Tema propio: diseño, portada con lentes, trayectoria, publicaciones | Web nueva navegable, aún sin fichas ricas |
| 3 | Plantilla de ficha de proyecto + proyectos A, uno a uno | 6 fichas completas con demo |
| 4 | Proyectos B, uno a uno | Resto de fichas con demo o imágenes |
| 5 | Revisión del inglés, SEO (Open Graph, sitemap), CV en PDF por perfil, analítica sin cookies | Web lista para compartir |
| 6 | Linktree, LinkedIn y CV apuntando a las páginas de perfil | Todo enlazado |

Cada proyecto se cierra con: ficha revisada por ti, demo funcionando, capturas, enlaces comprobados y despliegue.

## 7. Lo que necesito de ti

- Fotos reales que quieras mostrar: KIPPA, trampas, campañas (CONCACEN, Antártida), laboratorio de crustáceos, docencia. Tú eliges cuáles; las subo en baja resolución y sin metadatos de ubicación.
- Una foto de perfil actual.
- Visto bueno de cada ficha antes de publicarla.
- Para AYUNDATA y los casos de Intervalor: confirmar que la descripción pública es aceptable para la empresa.

## 8. Decisiones (2026-11-22)

1. Idiomas: **español e inglés desde el principio** (Hugo multilingüe; `/` en español y `/en/` en inglés).
2. Dominio: **se mantiene `arielgiamportone.github.io`**.
3. AYUNDATA e Intervalor: **caso de estudio con arquitectura y capturas sobre datos sintéticos**, sin clientes. Ariel lo confirma con la empresa antes de publicar.
   - **2026-11-22: AYUNDATA en espera hasta nuevo aviso de Ariel.** No se prepara ni se publica su ficha.

## 9. Estado de la fase 3 (2026-11-22)

| Proyecto | Demo | Estado |
|---|---|---|
| trawlkit | App real incrustada | Publicada |
| asset-identity-gs1 | Generador y lector GS1 (port JS verificado contra PyPI) | Publicada |
| catastro-enrichment-es | Resultados reales de los cinco catastros + simulador del router | Publicada |
| cfp-audit-intelligence | Presentación y vídeo en pestañas | Publicada |
| AYUNDATA | — | En espera hasta nuevo aviso |
| fisheries-sustainability-mlops | Red bayesiana interactiva | Publicada |
| paradox-db-py | Lector Paradox con el paquete real en Pyodide | Publicada |
| APIGFW | Ficha docente con figuras sintéticas | En `v2`, pendiente de publicar |
| periodic-report-kit | Informes mensual y semestral de ejemplo (PDF en visor + descargas Word/PDF) | En `v2`, pendiente de publicar |
