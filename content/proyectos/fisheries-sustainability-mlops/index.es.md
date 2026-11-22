---
title: "fisheries-sustainability-mlops"
proyecto: fisheries_mlops
translationKey: "proyecto-fisheries-mlops"
url: "/proyectos/fisheries-sustainability-mlops/"
description: "Redes bayesianas, redes neuronales bayesianas y un stack MLOps completo para estimar la sostenibilidad de operaciones pesqueras con incertidumbre."
subtitulo: "¿Qué pasa con la sostenibilidad de una pesquería si cambia el esfuerzo, el precio o el mar? Un sistema que responde con probabilidades, no con un sí o un no."
indicadores:
  - { v: "9", e: "variables en la red causal de dominio" }
  - { v: "3", e: "familias de modelos: red bayesiana, BNN y Causal VAE" }
  - { v: "5", e: "fases completadas, de los fundamentos al MLOps" }
  - { v: "MLflow", e: "seguimiento de experimentos y registro de modelos" }
  - { v: "Optuna", e: "ajuste automático de hiperparámetros" }
  - { v: "FastAPI", e: "API de predicción, entrenamiento y modelos" }
demo:
  parcial: "bn"
  titulo: "Pruébalo: la red bayesiana del proyecto"
  nota: "Fija cualquier variable y mira cómo cambian las demás y la probabilidad de que la operación sea sostenible. Prueba a fijar el esfuerzo pesquero: si lo observas, también cambia lo que sabes de la temperatura del mar, que es su causa; si intervienes, no, porque cortas esa flecha."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/fisheries-sustainability-mlops" }
galeria:
  - { src: "app-dashboard.png", pie: "Panel web: estado del sistema, predicción rápida y experimentos recientes." }
  - { src: "app-model-registry.png", pie: "Registro de modelos en MLflow: la versión en producción que sirve la API." }
  - { src: "app-api-docs.png", pie: "Documentación interactiva de la API de predicción." }
  - { src: "bnn.jpg", pie: "La red neuronal bayesiana: una predicción y su incertidumbre epistémica." }
---

## El problema

Las decisiones sobre una pesquería se toman con datos ruidosos y con mucha incertidumbre: la temperatura del mar, el esfuerzo de la flota, los costes o el precio del pescado cambian a la vez y se influyen entre sí. Un modelo que solo dice «sostenible» o «no sostenible» oculta justo lo que más importa: **cuánta confianza** tiene y **qué pasaría si** se actuara sobre una variable.

## Qué hice

- **Red bayesiana con estructura causal de dominio** (pgmpy): variables ambientales, operativas y económicas que llevan a la sostenibilidad, con aprendizaje de estructura (BIC, K2, BDeu), validación cruzada y comparación de métodos.
- **Análisis causal**: un DAG explícito y el operador *do* para separar «lo que observo» de «lo que pasaría si intervengo», que es la pregunta que se hace un regulador.
- **Deep learning con incertidumbre**: red neuronal bayesiana (BNN), MLP y un Causal VAE en PyTorch, con contrafactuales.
- **MLOps de punta a punta**: seguimiento de experimentos y registro de modelos con MLflow, ajuste con Optuna, API con FastAPI, panel web, Docker y CI/CD con despliegue preparado para AWS ECS.

## Sobre los datos

El proyecto usa **datos sintéticos** generados con rangos calibrados a partir de la literatura sobre pesquerías de crustáceos patagónicos, porque su objetivo es demostrar la metodología. La validación con datos reales es la primera fase de la agenda de I+D propuesta para 2026-2027. La demo de esta página usa la misma red y los mismos datos: sirve para entender el método, no para sacar conclusiones sobre una pesquería concreta.

## Por qué importa

Las redes neuronales bayesianas casi no aparecen en la literatura pesquera. Combinarlas con redes bayesianas causales permite dar a quien decide una probabilidad con su incertidumbre y la respuesta a escenarios del tipo «si reduzco el esfuerzo, ¿qué cambia?».
