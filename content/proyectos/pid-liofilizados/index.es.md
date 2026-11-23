---
title: "PID PP9884: liofilización de alimentos de Tierra del Fuego"
proyecto: pid_liofilizados
translationKey: "proyecto-pid-liofilizados"
url: "/proyectos/pid-liofilizados/"
description: "Proyecto de investigación de la UTN Tierra del Fuego que dirigí en el grupo QA3DS: protocolos reproducibles de liofilización para productores regionales, con el ruibarbo como primera matriz."
subtitulo: "Conservar lo que se produce en la Patagonia austral sin perder lo que lo hace valioso: protocolos reproducibles que un productor regional pueda aplicar."
indicadores:
  - { v: "261", e: "observaciones válidas: 3 pretratamientos, 10 tiempos, 3 meses" }
  - { v: "48 h", e: "tiempo óptimo con muestras congeladas o ultracongeladas (72 h en fresco)" }
  - { v: "0,92", e: "R² del ANOVA (pretratamiento, tiempo y mes)" }
  - { v: "p = 0,10", e: "efecto del mes no significativo: resultados reproducibles" }
  - { v: "13", e: "personas en el equipo: 6 docentes y 7 alumnos, 4 con beca" }
demo:
  parcial: "liofilizacion"
  titulo: "Pruébalo: la cinética de secado del ruibarbo"
enlaces:
  - { t: "Repositorio", url: "https://github.com/QA3DS/PID-Liofilizados" }
  - { t: "Web del grupo QA3DS", url: "https://qa3ds.github.io/" }
  - { t: "Resultados clave", url: "https://github.com/QA3DS/PID-Liofilizados/blob/main/resultados_clave.md" }
galeria:
  - { src: "modelo-page.png", pie: "Ajuste del modelo de Page por pretratamiento sobre las observaciones." }
  - { src: "cinetica.png", pie: "Curvas de pérdida de peso a lo largo del secado, por pretratamiento y mes." }
---

## El proyecto

El PID PP9884 de la UTN Facultad Regional Tierra del Fuego (2023-2026, con prórroga) estudia la liofilización, el secado por sublimación a baja presión, para conservar y dar valor a alimentos de producción local. Lo dirigí dentro del grupo de I+D+i QA3DS (Química Aplicada al Ambiente, los Alimentos y el Desarrollo Sostenible), con un equipo de docentes de ingeniería química, industrial y ciencias y alumnos becarios.

De las tres matrices previstas, el ruibarbo siguió adelante y la salicornia y el erizo de mar se descartaron.

## Qué se encontró

- **El tiempo óptimo es de 48 horas** con muestras congeladas o ultracongeladas y de 72 con las frescas; en la práctica se recomienda entre 36 y 48. Se pierde alrededor del 92 % del peso.
- **El precongelado hace el secado más predecible**: el modelo de Page ajusta con R² de 0,91 y 0,92 frente a 0,76 en fresco.
- **A partir de las 36 horas los tres pretratamientos son equivalentes** (Kruskal-Wallis, p = 0,51), aunque a las 24 el fresco va por delante.
- **Los resultados se reproducen**: el mes del ensayo no influye (p = 0,10) y las condiciones del equipo dentro de su rango tampoco.

## Cómo se trabajó

Un cuaderno reproducible compila los ensayos, excluye las observaciones inválidas con su motivo y genera las figuras y un documento de resultados clave del que salen todas las cifras que se publican, incluida la web del grupo. Un ETL carga los datos en SQLite para un panel de seguimiento. El protocolo de laboratorio, el marco normativo de calidad y el estudio de escalado están terminados; el manual técnico-económico, el informe final y un preprint siguen en preparación.
