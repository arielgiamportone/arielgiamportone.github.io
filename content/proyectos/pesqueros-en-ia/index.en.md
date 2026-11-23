---
title: "PesquerosEnIA: open AI courses for fisheries"
proyecto: pesqueros_en_ia_cursos
translationKey: "proyecto-pesqueros-en-ia"
url: "/en/projects/pesqueros-en-ia/"
description: "A community and open courses on data science and artificial intelligence for the fishing and aquaculture sector: a handbook, courses with Colab notebooks and interactive simulators built on cases from the Argentine Sea."
subtitulo: "Bringing AI to the Argentine fishing sector through cases the sector recognises: a model's threshold turned into diesel, a vessel's AIS track or how the hake quota is shared out."
indicadores:
  - { v: "4", e: "open courses, under GPL-3.0 and MIT licences" }
  - { v: "~70", e: "students in the first cohort of the UTN FRCh extension course (2026-2027)" }
  - { v: "39", e: "interactive simulators in the course, nothing to install" }
  - { v: "45", e: "notebooks: 20 in the UTN course and 25 in the Bayesian deep learning one" }
  - { v: "170", e: "pages in the CONIPE 2025 data literacy handbook" }
demo:
  formato: documento
  titulo: "Try it: six simulators from the course"
  nota: "Loaded from the course website (GitHub Pages) and in Spanish. The concentration of rent uses Federal Fisheries Council resolution 4/2024 and selectivity uses published trials; the AIS track is synthetic, with Global Fishing Watch's speed-based classification rule."
  pestanas:
    - { titulo: "The threshold is an economic decision", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/c6_umbral_decision.html" }
    - { titulo: "Optimal cruising speed", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/c8_velocidad_optima.html" }
    - { titulo: "AIS tracks and blackouts", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/dt11_ais_esfuerzo.html" }
    - { titulo: "Gear selectivity", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/selectividad_arte.html" }
    - { titulo: "Concentration of rent", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/dt09_concentracion_renta.html" }
    - { titulo: "Gulf crimes: the blackout", url: "https://pesquerosenia.github.io/curso-ia-produccion-pesquera/interactivos/crimen_01_apagon.html" }
enlaces:
  - { t: "GitHub organisation", url: "https://github.com/PesquerosEnIA" }
  - { t: "UTN FRCh course", url: "https://github.com/PesquerosEnIA/curso-ia-produccion-pesquera" }
  - { t: "All the simulators", url: "https://github.com/PesquerosEnIA/curso-ia-produccion-pesquera/tree/master/interactivos" }
  - { t: "Community website", url: "https://sites.google.com/view/pesquerosenia" }
galeria:
  - { src: "c6_umbral_decision.png", pie: "A model's threshold as an economic decision: every error has its cost in diesel or in missed opportunity." }
  - { src: "dt09_concentracion_renta.png", pie: "Case DT-009: concentration of the hake quota with the Lorenz curve, Gini and HHI (CFP Res. 4/2024)." }
  - { src: "dt11_ais_esfuerzo.png", pie: "Case DT-011: classifying an AIS track by speed and detecting a transponder blackout." }
  - { src: "selectividad_arte.png", pie: "Gear selectivity with trial data: which hake stays in the net and which escapes." }
---

## The idea

PesquerosEnIA is a community I founded in 2025 to bring data science and artificial intelligence closer to fisheries engineers, technicians, biologists and operators. The material is open and designed for people who do not code: each concept comes with a case from the sector itself and in three levels (beginner, intermediate and advanced) so nobody is left behind.

## The courses

- **Data science and AI literacy (CONIPE 2025).** A pre-congress course in Puerto Madryn with a 170-page LaTeX handbook: Python, data handling and visualisation, an introduction to machine learning, a hands-on case and ethics. GPL-3.0 licence.
- **Artificial intelligence applied to fisheries production (UTN FRCh, 2026-2027).** A ten-unit university extension course in a hybrid format, with a first cohort of about 70 students. I teach the classes on strategy and digital transformation, data and sensors, machine learning, optimisation and the closing session, and I gave the computer vision class with the case «The camera on the line». The repository holds slides, guides, 20 Colab notebooks and 39 simulators.
- **Deep learning and Bayesian networks for fisheries sustainability.** Six modules and 25 notebooks with PyTorch and pgmpy, from exploratory analysis to Bayesian neural networks that quantify uncertainty. MIT licence.
- **Machine learning and deep learning for fisheries engineers.** Introductory notebooks, in progress.

## Cases from the sector

The DT cases in the UTN course start from real problems: the concentration of the hake quota from Federal Fisheries Council resolutions, AIS monitoring and pre-arrival risk under the Port State Measures Agreement, and an expert report on the 12-mile limit with simulated VMS data. When the data cannot be public, it is simulated and labelled as such. Each case has its notebook in the three levels and its simulator.
