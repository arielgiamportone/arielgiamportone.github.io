---
title: "Simplex vs ML en investigación operativa"
proyecto: investigacion_operativa_ml
translationKey: "proyecto-investigacion-operativa"
url: "/proyectos/investigacion-operativa/"
description: "Material docente sobre la evolución de la investigación operativa, del método Simplex al machine learning, con un caso de flota pesquera. Demo interactiva de programación lineal en el navegador."
subtitulo: "Optimizar y predecir responden preguntas distintas. Un modelo de flota pesquera para ver qué decide el Simplex, qué limita cada plan y dónde entra la predicción."
indicadores:
  - { v: "3 × 3", e: "tipos de barco y recursos del modelo docente" }
  - { v: "45", e: "casos del solver de la demo comprobados contra SciPy (HiGHS)" }
  - { v: "2025", e: "material del curso de alfabetización en datos de CONIPE" }
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

## Una corrección en curso

El análisis comparativo original del repositorio medía al Simplex con métricas de predicción (R² y error de capturas) y lo ponía en la misma tabla que los modelos de ML. Son problemas distintos, así que esa comparación no tiene sentido; el repositorio se está revisando para separar las dos preguntas. Esta ficha se centra en la parte de optimización, que es correcta.
