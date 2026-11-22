---
title: "periodic-report-kit"
proyecto: periodic_report_kit
translationKey: "proyecto-periodic-report-kit"
url: "/proyectos/periodic-report-kit/"
description: "Informes periódicos declarativos: de las hojas de cálculo que exporta un sistema de campo a un Word, un PDF o una presentación con marca, sin rehacer nada a mano cada mes."
subtitulo: "El informe mensual que alguien montaba a mano en horas, generado en segundos desde los datos, con las cifras siempre coherentes y sin borrar el comentario que ya escribió una persona."
indicadores:
  - { v: "~11 s", e: "para generar seis meses de datos y dos informes con PDF" }
  - { v: "14", e: "reglas de dominio, todas con test" }
  - { v: "72", e: "tests" }
  - { v: "0", e: "discrepancias al contrastar el informe con su propio modelo" }
  - { v: "3", e: "formatos de salida: Word, PDF y PowerPoint" }
  - { v: "MIT", e: "licencia · PyPI 0.1.0" }
demo:
  formato: documento
  titulo: "Informes de ejemplo generados con el paquete"
  nota: "Generados con «reportkit demo» a partir de seis meses de datos sintéticos que incluyen las trampas reales para las que existe cada regla: borradores, ficheros de bloqueo, resultados en blanco, controles duplicados, una hoja que miente sobre su tamaño y una exportación en UTC. La marca «Nordal Analytics» es ficticia. El anexo final lista los avisos de carga: lo que se apartó y por qué."
  pestanas:
    - { titulo: "Informe semestral (22 páginas)", recurso: "informes/informe-semestral-sintetico.pdf" }
    - { titulo: "Informe mensual (15 páginas)", recurso: "informes/informe-mensual-sintetico.pdf" }
descargas:
  - { t: "Semestral en Word", recurso: "informes/informe-semestral-sintetico.docx" }
  - { t: "Semestral en PDF", recurso: "informes/informe-semestral-sintetico.pdf" }
  - { t: "Mensual en Word", recurso: "informes/informe-mensual-sintetico.docx" }
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/periodic-report-kit" }
  - { t: "PyPI: periodic-report-kit", url: "https://pypi.org/project/periodic-report-kit/" }
galeria:
  - { src: "pag-01.png", pie: "Portada a sangre completa, fuera de la numeración del PDF, con el aviso de datos sintéticos." }
  - { src: "pag-02.png", pie: "Resumen del semestre: cada porcentaje declara su base." }
  - { src: "pag-03.png", pie: "Evolución mensual y metodología." }
  - { src: "pag-04.png", pie: "Capítulo por grupo con sus indicadores y el hueco para el comentario humano." }
  - { src: "pag-06.png", pie: "Gráficos condicionales: solo aparecen si los datos los justifican." }
---

## El problema

En muchos servicios de inspección o control recurrente, el informe periódico se monta a mano: alguien exporta hojas de cálculo del sistema de campo, recalcula totales en tablas dinámicas, pega cifras y gráficos en un Word con membrete y rehace la portada cada mes. Cuesta horas, las cifras del resumen acaban contradiciendo a las de los capítulos, y regenerar el documento borra los comentarios que una persona ya había escrito.

## Cómo lo resolví

- **Cargadores que traducen y no interpretan**: aceptan lo que exporta el campo (nombres inconsistentes, hojas-resumen hechas a mano, borradores) y mandan lo desconocido a cuarentena con un aviso tipado.
- **Un modelo canónico como frontera**: una fila por ítem evaluado. Por encima de él nadie sabe de qué fichero vino el dato, así que cambiar la fuente por una API solo toca el cargador.
- **Métricas con nombre y base declarada**: dos tasas que se confunden fácilmente llevan nombres fijos, el volumen se suma y las tasas solo comparan lo comparable. Lo que no se puede calcular es `[[PENDIENTE]]`, nunca cero.
- **Reglas en configuración**: el esquema de datos, los grupos, los ítems y el catálogo de secciones y gráficos son YAML con tests. Un criterio que cambia es una línea, no un despliegue.
- **El comentario humano sobrevive**: se guarda en YAML por periodo; si sus cifras ya no coinciden con las actuales, el informe avisa. Nunca se redacta solo.
- **Salida con marca**: Word con índice real que Word actualiza y portada como texto sobre un fondo anclado; PDF en dos pasadas unidas con pypdf para que la portada quede fuera de la numeración; Markdown a Word o PowerPoint con nueve bloques visuales.
- **Validador**: contrasta el informe con lo entregado y devuelve error si hay discrepancias. Cada ejecución escribe en una carpeta versionada nueva: nunca se sobrescribe un entregable.

## Un caso de estudio *clean-room*

Los patrones nacieron en mi trabajo en Intervalor Data y se publican con su autorización. Se reconstruyó desde una especificación escrita, con datos sintéticos y una marca ficticia generada por script; la revisión independiente frente a los repositorios originales no encontró fragmentos copiados.
