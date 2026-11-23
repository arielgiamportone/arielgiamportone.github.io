---
title: "Panel de inspecciones de campo"
proyecto: casos_estudio_intervalor
translationKey: "proyecto-field-inspections-dashboard"
url: "/proyectos/field-inspections-dashboard/"
description: "Caso de estudio clean-room: un pipeline y un panel estático que convierten los registros de una app de inspecciones de terceros en seguimiento casi en tiempo real, informes mensuales y hojas de certificación."
subtitulo: "El equipo descubría los problemas de los datos a final de mes. Ahora el panel se actualiza cada 3 horas, sin base de datos, sin licencias de BI y sin servidores que mantener."
indicadores:
  - { v: "cada 3 h", e: "datos actualizados solos, antes una vez al mes y a mano" }
  - { v: "−78 %", e: "peso del panel que ve el cliente (de 3,6 a 0,8 MB)" }
  - { v: "85×", e: "más fotos de evidencia encontradas en los datos anidados" }
  - { v: "1,7 % → 0", e: "registros mostrados en el día equivocado (UTC leído como hora local)" }
  - { v: "16 de 16", e: "filas del informe oficial de valoración reproducidas por código" }
  - { v: "~200", e: "comprobaciones en 22 suites antes de cada extracción" }
demo:
  parcial: "inspecciones"
  titulo: "Pruébalo: el código del repositorio, en tu navegador"
  nota: "Dos piezas reescritas desde cero (clean-room) con sus tests. El proxy se ejecuta contra un servidor simulado y el histórico es sintético: no sale ninguna petición hacia terceros."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/field-inspections-dashboard" }
  - { t: "Las seis lecciones", url: "https://github.com/arielgiamportone/field-inspections-dashboard/tree/main/docs/lessons" }
diagramas:
  - { src: "arquitectura.svg", pie: "Sin base de datos ni BI: un sitio precalculado, reproducible desde el código versionado y los datos en caché." }
---

## El contexto

Un equipo de técnicos hace inspecciones de cumplimiento en unos 1.800 locales comerciales de un cliente del sector público, repartidos en 15 líneas de negocio, y registra listas de comprobación y fotos en una aplicación móvil de terceros.

El informe mensual se hacía a mano: exportaciones pegadas en macros de Excel, el Word montado a mano y la hoja de certificación rellenada celda a celda. El cliente no tenía visibilidad en tiempo real y el equipo descubría los problemas de los datos a final de mes. Además, la documentación de la API no coincidía con lo que devolvía en producción.

## Mi papel

Diseñador y desarrollador único de principio a fin: arquitectura, extracción, panel, CI/CD, autenticación, automatización de informes y operación. Trabajé con el equipo de operaciones para convertir sus reglas en código y con el equipo de TI del cliente para que aprobara el acceso. Unos 360 commits en cinco meses.

## Decisiones que importan

- **Un panel precalculado** en lugar de la propuesta inicial de base de datos SQL, webhooks y herramienta de BI comercial: el volumen cabe de sobra, no hay servidores que parchear ni licencias, y cada versión se reproduce desde el código.
- **Histórico en caché y una ventana viva de tres meses**, unas 20 veces menos llamadas a la API, y los periodos ya informados quedan congelados.
- **Borrados solo dentro de la ventana consultada y con umbral de aborto**: lo que se borra en la fuente desaparece, pero una respuesta incompleta no puede llevarse datos reales.
- **Proxy de fotos en el servidor** con lista de hosts permitidos: el token nunca llega al navegador.
- **Proxy de ficheros que responde con un 302** a una URL firmada de corta duración: sin límites de tamaño, sin tráfico por la función y con el nombre original del fichero.
- **Lo interno se quita al construir** la versión del cliente, no con CSS: un dato oculto sigue estando en el HTML.

## Lo que salió mal y se quedó arreglado

El repositorio documenta seis lecciones. La más ilustrativa: durante años el equipo veía horas «a veces desplazadas una o dos horas, sin patrón». Sí había patrón, +1 h en invierno y +2 h en verano: la API devolvía UTC y el proceso lo leía como hora local. Lo fija un test de 23 casos con cambios de horario, medianoches y finales de mes.

## Un caso de estudio *clean-room*

El trabajo se hizo en Intervalor Data. Este repositorio es un caso de estudio y una reimplementación desde cero de algunos patrones, publicada con autorización de la empresa: no contiene código, datos, nombres ni detalles de infraestructura del cliente.
