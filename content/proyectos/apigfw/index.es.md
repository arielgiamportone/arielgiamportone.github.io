---
title: "Análisis pesquero con la API de Global Fishing Watch"
proyecto: apigfw
translationKey: "proyecto-apigfw"
url: "/proyectos/apigfw/"
description: "Material docente de la comunidad Pesqueros en IA: un cliente de la API v3 de Global Fishing Watch y un notebook que recorre un análisis completo de datos pesqueros."
subtitulo: "Un notebook para aprender a analizar la actividad pesquera paso a paso: de la conexión a una API real al análisis exploratorio y geoespacial."
indicadores:
  - { v: "2", e: "clientes de la API v3 de Global Fishing Watch (buques, eventos, esfuerzo pesquero)" }
  - { v: "7", e: "pasos del notebook: de la configuración al reporte" }
  - { v: "ETL", e: "extracción, transformación con control de calidad y carga en CSV y Parquet" }
  - { v: "EDA", e: "análisis temporal, geoespacial y por tipo de embarcación" }
enlaces:
  - { t: "Ver el notebook", url: "https://nbviewer.org/github/arielgiamportone/APIGFW/blob/main/analisis_pesca_argentina.ipynb" }
  - { t: "Abrir en Colab", url: "https://colab.research.google.com/github/arielgiamportone/APIGFW/blob/main/analisis_pesca_argentina.ipynb" }
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/APIGFW" }
galeria:
  - { src: "actividad-mes-zona.png", pie: "Actividad pesquera por mes, zona, tipo de embarcación y día de la semana. Datos sintéticos." }
  - { src: "distribucion-geografica.png", pie: "Distribución geográfica y distancia a la costa. Datos sintéticos." }
  - { src: "patrones-temporales.png", pie: "Serie diaria, actividad por hora, trimestre y velocidad media. Datos sintéticos." }
  - { src: "top-embarcaciones.png", pie: "Ranking de embarcaciones por horas de pesca. Datos sintéticos." }
---

## Qué es

Material docente para la comunidad **Pesqueros en IA** y la docencia en la UTN: un recorrido completo por el análisis de datos pesqueros con Python, pensado para ingenieros pesqueros que empiezan con la ciencia de datos.

## Qué enseña

- **Consumir una API real**: dos clientes de la API v3 de [Global Fishing Watch](https://globalfishingwatch.org) para buscar buques, consultar sus eventos y obtener el esfuerzo pesquero de un área. La clave se lee de una variable de entorno, nunca del código.
- **Un pipeline ETL**: extracción, transformación con control de calidad de los datos y carga en CSV y Parquet.
- **Análisis exploratorio**: actividad por mes, zona, tipo de embarcación y bandera, patrones temporales, distribución geográfica y distancia a la costa.
- **Buenas prácticas**: código comentado en español, reproducible y organizado paso a paso.

## Sobre los datos del notebook

Para que el curso funcione sin que cada estudiante tenga que darse de alta en la API, **el notebook genera datos sintéticos** con la forma de los datos reales (embarcaciones, posiciones y horas de pesca). Los gráficos de esta página salen de esos datos inventados: sirven para aprender la técnica, no describen la actividad pesquera real en el Mar Argentino. Con una clave propia, los clientes incluidos permiten repetir el análisis con datos reales.
