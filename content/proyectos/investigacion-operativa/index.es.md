---
title: "Simplex vs ML en investigación operativa"
proyecto: investigacion_operativa_ml
translationKey: "proyecto-investigacion-operativa"
url: "/proyectos/investigacion-operativa/"
description: "Material docente sobre la evolución de la investigación operativa, del método Simplex al machine learning, con un caso de flota pesquera. Demo interactiva de programación lineal en el navegador."
subtitulo: "Optimizar y predecir responden preguntas distintas. Un modelo de flota pesquera para ver qué decide el Simplex, qué limita cada plan y dónde entra la predicción."
indicadores:
  - { v: "91 → 99,8 %", e: "del óptimo alcanzado al decidir con rendimientos estimados por ML en vez de nominales" }
  - { v: "38 → 93 %", e: "escenarios en los que la decisión es la óptima" }
  - { v: "0,89 / 0,97", e: "R² del mejor modelo frente al techo de la fórmula que generó los datos" }
  - { v: "45", e: "casos del solver de la demo comprobados contra SciPy (HiGHS)" }
demo:
  parcial: "simplex"
  titulo: "Pruébalo: decide la flota y mira qué la limita"
  nota: "Los coeficientes del modelo son los del repositorio y son didácticos, no datos reales de ninguna flota."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/Investigacion_Operativa" }
---

## La idea

El repositorio acompaña una clase sobre cómo ha cambiado la investigación operativa desde que Dantzig publicó el método Simplex en 1947: de resolver problemas lineales bien definidos a trabajar con datos abundantes, incertidumbre y modelos que aprenden. El hilo conductor es un caso pesquero: cuántos barcos de cada tipo deben salir a faenar con el combustible, la tripulación y la flota disponibles.

## Lo que enseña la demo

- **La solución óptima y por qué lo es.** Las barras muestran qué recurso se agota y cuál sobra. El recurso que limita es el que importa.
- **Cuánto vale una unidad más de cada recurso** (el precio sombra). Si un litro más de combustible no aumenta el beneficio, comprar combustible no es la solución.
- **Óptimos alternativos.** En el modelo del repositorio los tipos 1 y 2 rinden exactamente lo mismo por litro, así que varios planes empatan: una señal de que el modelo necesita más información para decidir.
- **Barcos enteros.** El Simplex devuelve fracciones; exigir barcos enteros puede costar beneficio, y la demo lo cuantifica.
- **Dónde entra el machine learning.** El Simplex no acierta ni falla capturas: decide con los coeficientes que recibe. La predicción es útil antes, para estimarlos cuando dependen del clima o del precio. El control del rendimiento previsto del tipo 3 muestra el punto en que esa estimación cambia la decisión.

## Lo que muestra el análisis

El análisis del repositorio separa tres preguntas sobre un mundo sintético en el que el viento afecta distinto a cada tipo de barco:

- **Decidir.** La programación lineal da el plan óptimo (20, 6 y 10 barcos pequeños, medianos y grandes, 3.720 kg), dice qué limita (la tripulación: 24 kg por persona más) y qué sobra (combustible y presupuesto). Se evalúa por eso, no con R².
- **Predecir.** Para la captura total, Gradient Boosting llega a un R² de 0,89 frente a 0,79 de una regresión lineal y −0,003 de la media, con un techo de 0,97: la fórmula verdadera sin ruido. Ningún modelo lo supera; un R² alto en datos sintéticos solo dice que el modelo recupera la fórmula.
- **Predecir y luego optimizar.** Decidir con los rendimientos nominales alcanza de media el 91 % del óptimo y acierta la mejor decisión en el 38 % de los escenarios. Con los rendimientos estimados por ML según el clima sube al 99,7-99,8 % y al 90-93 %. Y una regresión lineal basta casi tanto como Gradient Boosting: para decidir bien no hace falta el modelo más preciso.

Esta versión del material corrige una anterior que comparaba al Simplex y a los modelos de ML en la misma tabla de precisión. Las cifras salen de ejecutar los scripts (semilla 42) y nueve tests las comprueban en CI con las versiones mínimas y recientes de las dependencias.
