---
title: "Fisheries analysis with the Global Fishing Watch API"
proyecto: apigfw
translationKey: "proyecto-apigfw"
url: "/en/projects/apigfw/"
description: "Teaching material for the Pesqueros en IA community: a client for the Global Fishing Watch v3 API and a notebook that walks through a complete fisheries data analysis."
subtitulo: "A notebook to learn fisheries activity analysis step by step: from connecting to a real API to exploratory and geospatial analysis."
indicadores:
  - { v: "2", e: "clients for the Global Fishing Watch v3 API (vessels, events, fishing effort)" }
  - { v: "7", e: "notebook steps: from setup to the report" }
  - { v: "ETL", e: "extraction, transformation with quality checks and loading to CSV and Parquet" }
  - { v: "EDA", e: "temporal, geospatial and vessel-type analysis" }
enlaces:
  - { t: "View the notebook", url: "https://nbviewer.org/github/arielgiamportone/APIGFW/blob/main/analisis_pesca_argentina.ipynb" }
  - { t: "Open in Colab", url: "https://colab.research.google.com/github/arielgiamportone/APIGFW/blob/main/analisis_pesca_argentina.ipynb" }
  - { t: "Repository", url: "https://github.com/arielgiamportone/APIGFW" }
galeria:
  - { src: "actividad-mes-zona.png", pie: "Fishing activity by month, zone, vessel type and weekday. Synthetic data." }
  - { src: "distribucion-geografica.png", pie: "Geographical distribution and distance from the coast. Synthetic data." }
  - { src: "patrones-temporales.png", pie: "Daily series, activity by hour, quarter and mean speed. Synthetic data." }
  - { src: "top-embarcaciones.png", pie: "Vessels ranked by fishing hours. Synthetic data." }
---

## What it is

Teaching material for the **Pesqueros en IA** community and for teaching at UTN: a complete walk-through of fisheries data analysis with Python, aimed at fisheries engineers starting out in data science. The notebook is in Spanish.

## What it teaches

- **Using a real API**: two clients for the [Global Fishing Watch](https://globalfishingwatch.org) v3 API to search vessels, query their events and get the fishing effort of an area. The key is read from an environment variable, never from the code.
- **An ETL pipeline**: extraction, transformation with data quality checks, and loading to CSV and Parquet.
- **Exploratory analysis**: activity by month, zone, vessel type and flag, temporal patterns, geographical distribution and distance from the coast.
- **Good practice**: commented, reproducible code organised step by step.

## About the notebook's data

So that the course works without every student having to register for the API, **the notebook generates synthetic data** shaped like the real data (vessels, positions and fishing hours). The charts on this page come from that made-up data: they are there to learn the technique and do not describe real fishing activity in the Argentine Sea. With their own key, the included clients let you repeat the analysis with real data.
