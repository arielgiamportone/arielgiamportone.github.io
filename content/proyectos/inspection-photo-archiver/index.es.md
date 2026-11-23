---
title: "Archivador de fotos de inspección"
weight: 3
proyecto: casos_estudio_intervalor
translationKey: "proyecto-inspection-photo-archiver"
url: "/proyectos/inspection-photo-archiver/"
description: "Caso de estudio clean-room: un servicio de escritorio 24/7 que vigila carpetas sincronizadas, descarga las fotos de evidencia de una app de inspecciones, las archiva por proyecto y mantiene un registro acumulado que enlaza cada fichero con su origen."
subtitulo: "Encontrar «la foto del local X del día Y» en segundos, en un árbol compartido con el cliente, sin perder nunca la historia aunque el disco, la nube o una hoja de cálculo abierta se pongan en contra."
indicadores:
  - { v: "2 → 14", e: "proyectos atendidos: de dos scripts fijos a 14 vigilantes configurados" }
  - { v: "8", e: "líneas añadidas por una compañera sin tocar código" }
  - { v: "~21.000", e: "registros de historia reconstruidos tras un borrado silencioso" }
  - { v: "~8.000", e: "enlaces que llegó a romper una sola mudanza de carpetas" }
  - { v: "0", e: "exportaciones atascadas y descargadas dos veces (antes, 2 de 4)" }
  - { v: "19", e: "registros de decisiones de arquitectura" }
demo:
  parcial: "archivador"
  titulo: "Pruébalo: los módulos del repositorio, en tu navegador"
  nota: "Tres piezas reescritas desde cero (clean-room), solo con la biblioteca estándar de Python y 21 tests. Los ficheros se crean en un disco virtual en la memoria de tu navegador; locales, fechas y fotos son inventados."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/inspection-photo-archiver" }
  - { t: "Las siete lecciones", url: "https://github.com/arielgiamportone/inspection-photo-archiver/tree/main/docs/lessons" }
diagramas:
  - { src: "flujo.svg", pie: "Una sola aplicación con un vigilante por proyecto; el comportamiento de cada uno vive en un perfil JSON." }
---

## El contexto

Los técnicos de campo hacen inspecciones de cumplimiento en cientos de locales comerciales, agrupados en una docena de líneas de negocio, y toman las fotos en una aplicación de terceros. Los entregables del cliente exigen esa evidencia **archivada en un árbol de carpetas compartido**, con nombres y carpetas que permitan encontrar cualquier foto en segundos.

Empezó como dos scripts fijos, uno por contrato, cada uno con su bucle y su configuración: añadir un proyecto era copiar un script. Y el archivo vive en una carpeta sincronizada con la nube que comparte el equipo del cliente, así que los ficheros llegan a trozos, pueden estar abiertos en una hoja de cálculo o existir solo como marcadores sin descargar.

## Mi papel

Diseñador y desarrollador único: arquitectura, implementación, soporte en producción y análisis de cada incidente. Convertí las reglas de archivo del equipo de operaciones en configuración y escribí la guía con la que una compañera añadió ocho líneas de negocio sin tocar código. Unos 100 commits.

## Decisiones que importan

- **Una aplicación con un vigilante por proyecto** y el comportamiento en perfiles JSON, en lugar de un script por proyecto.
- **Vigilancia por sondeo con tiempo de espera** en vez de eventos del sistema de ficheros: el cliente de sincronización escribe los ficheros por partes y los eventos saltaban con ficheros a medias.
- **El registro nunca se recrea vacío**: puede cargarse, migrarse con copia o reiniciarse con copia, y si no se puede leer, el proceso se aborta.
- **Enlaces relativos al registro** en vez de absolutos, que se rompieron en tres reorganizaciones de carpetas.
- **Avisar, no redirigir**, cuando una exportación cae en la bandeja de otra línea: moverla cambiaría dónde esperan los técnicos sus fotos, y un aviso es reversible.
- **Abortar si una misma foto llega dos veces** durante la migración de un formulario: el duplicado en un registro acumulado cuesta mucho de deshacer.

## Lo que salió mal y se quedó arreglado

El repositorio documenta siete lecciones, cada una con su síntoma, su causa y el test que la mantiene arreglada. Dos de ellas son las que verás en la demo: el registro que se vaciaba solo cuando estaba abierto en una hoja de cálculo, y el proceso que decía «0 errores» mientras faltaban fotos porque buscaba la carpeta solo en el mes de la visita. Otra curiosa: el recolector de basura de Python escondía un bloqueo de fichero, y el test que lo detecta tiene que mover el fichero con el recolector desactivado.

## Un caso de estudio *clean-room*

El trabajo se hizo en Intervalor Data. Este repositorio es un caso de estudio y una reimplementación desde cero de algunos patrones, publicada con autorización de la empresa: no contiene código, datos, nombres ni detalles de infraestructura del cliente.
