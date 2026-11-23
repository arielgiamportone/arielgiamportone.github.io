---
title: "PesquerosEnIA: cursos abiertos de IA para la pesca"
proyecto: pesqueros_en_ia_cursos
translationKey: "proyecto-pesqueros-en-ia"
url: "/proyectos/pesqueros-en-ia/"
description: "Comunidad y cursos abiertos de ciencia de datos e inteligencia artificial para el sector pesquero y acuícola: un manual, cursos con notebooks en Colab y simuladores interactivos con casos del Mar Argentino."
subtitulo: "Llevar la IA al sector pesquero argentino con casos que el sector reconoce: el umbral de un modelo convertido en gasoil, el rastro AIS de un barco o el reparto de la cuota de merluza."
indicadores:
  - { v: "4", e: "cursos abiertos, con licencias GPL-3.0 y MIT" }
  - { v: "~70", e: "alumnos en la primera cohorte del curso de extensión de la UTN FRCh (2026-2027)" }
  - { v: "39", e: "simuladores interactivos del curso, sin instalación" }
  - { v: "45", e: "notebooks: 20 del curso de la UTN y 25 del de deep learning bayesiano" }
  - { v: "170", e: "páginas del manual de alfabetización del CONIPE 2025" }
demo:
  formato: documento
  titulo: "Pruébalo: seis simuladores del curso"
  nota: "Se cargan desde la web del curso (GitHub Pages). La concentración de la renta usa la resolución 4/2024 del Consejo Federal Pesquero y la selectividad, ensayos publicados; el rastro AIS es sintético, con la regla de clasificación por velocidad de Global Fishing Watch."
  pestanas:
    - { titulo: "El umbral es una decisión económica", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/c6_umbral_decision.html" }
    - { titulo: "Velocidad óptima de crucero", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/c8_velocidad_optima.html" }
    - { titulo: "Rastro AIS y apagones", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/dt11_ais_esfuerzo.html" }
    - { titulo: "Selectividad de artes", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/selectividad_arte.html" }
    - { titulo: "Concentración de la renta", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/dt09_concentracion_renta.html" }
    - { titulo: "Crímenes del Golfo: el apagón", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/crimen_01_apagon.html" }
enlaces:
  - { t: "Organización en GitHub", url: "https://github.com/PesquerosEnIA" }
  - { t: "Curso de la UTN FRCh", url: "https://github.com/PesquerosEnIA/curso-ia-produccion-pesquera" }
  - { t: "Todos los simuladores", url: "https://github.com/PesquerosEnIA/curso-ia-produccion-pesquera/tree/master/interactivos" }
  - { t: "Web de la comunidad", url: "https://sites.google.com/view/pesquerosenia" }
galeria:
  - { src: "c6_umbral_decision.png", pie: "El umbral de un modelo como decisión económica: cada error tiene su coste en gasoil o en oportunidad." }
  - { src: "dt09_concentracion_renta.png", pie: "Caso DT-009: concentración de la cuota de merluza con la curva de Lorenz, el Gini y el HHI (Res. CFP 4/2024)." }
  - { src: "dt11_ais_esfuerzo.png", pie: "Caso DT-011: clasificar el rastro AIS por velocidad y detectar el apagón del transpondedor." }
  - { src: "selectividad_arte.png", pie: "Selectividad de artes con datos de ensayos: qué merluza se queda en la red y cuál escapa." }
---

## La idea

PesquerosEnIA es una comunidad que fundé en 2025 para acercar la ciencia de datos y la inteligencia artificial a ingenieros pesqueros, técnicos, biólogos y operadores. El material es abierto y está pensado para quien no programa: cada concepto llega con un caso del propio sector y con tres niveles (novato, intermedio y avanzado) para que nadie se quede fuera.

## Los cursos

- **Alfabetización en ciencia de datos e IA (CONIPE 2025).** Curso precongreso en Puerto Madryn con un manual de 170 páginas en LaTeX: Python, manipulación y visualización de datos, introducción al machine learning, un caso práctico y ética. Licencia GPL-3.0.
- **Inteligencia artificial aplicada a la producción pesquera (UTN FRCh, 2026-2027).** Curso de extensión universitaria de diez unidades en modalidad híbrida, con una primera cohorte de unos 70 alumnos. Soy docente de las clases de estrategia y transformación digital, datos y sensores, machine learning, optimización y cierre, y di la de visión artificial con el caso «La cámara en la línea». El repositorio reúne diapositivas, guías, 20 notebooks en Colab y 39 simuladores.
- **Deep learning y redes bayesianas para la sostenibilidad pesquera.** Seis módulos y 25 notebooks con PyTorch y pgmpy, de la exploración de datos a las redes neuronales bayesianas para cuantificar la incertidumbre. Licencia MIT.
- **Machine learning y deep learning para ingenieros pesqueros.** Notebooks introductorios, en construcción.

## Casos del sector

Los casos DT del curso de la UTN parten de problemas reales: la concentración de la cuota de merluza a partir de las resoluciones del Consejo Federal Pesquero, el monitoreo AIS y el riesgo antes del arribo según el Acuerdo sobre Medidas del Estado Rector del Puerto, o un peritaje sobre las 12 millas con datos VMS simulados. Cuando los datos no pueden ser públicos, se simulan y se dice. Cada caso tiene su notebook en los tres niveles y su simulador.
