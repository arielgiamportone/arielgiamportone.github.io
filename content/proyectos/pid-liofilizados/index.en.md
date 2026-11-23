---
title: "Research project PP9884: freeze-drying food from Tierra del Fuego"
proyecto: pid_liofilizados
translationKey: "proyecto-pid-liofilizados"
url: "/en/projects/pid-freeze-drying/"
description: "A research project at UTN Tierra del Fuego that I led in the QA3DS group: reproducible freeze-drying protocols for regional producers, starting with rhubarb."
subtitulo: "Preserving what is produced in southern Patagonia without losing what makes it valuable: reproducible protocols that a regional producer can apply."
indicadores:
  - { v: "261", e: "valid observations: 3 pre-treatments, 10 times, 3 months" }
  - { v: "48 h", e: "optimal time with frozen or deep-frozen samples (72 h fresh)" }
  - { v: "0.92", e: "R² of the ANOVA (pre-treatment, time and month)" }
  - { v: "p = 0.10", e: "no significant month effect: reproducible results" }
  - { v: "13", e: "people on the team: 6 lecturers and 7 students, 4 with grants" }
demo:
  parcial: "liofilizacion"
  titulo: "Try it: the drying kinetics of rhubarb"
enlaces:
  - { t: "Repository", url: "https://github.com/QA3DS/PID-Liofilizados" }
  - { t: "QA3DS group website", url: "https://qa3ds.github.io/" }
  - { t: "Key results", url: "https://github.com/QA3DS/PID-Liofilizados/blob/main/resultados_clave.md" }
galeria:
  - { src: "modelo-page.png", pie: "Page model fit per pre-treatment over the observations." }
  - { src: "cinetica.png", pie: "Weight loss curves over the drying, by pre-treatment and month." }
---

## The project

Research project PP9884 at UTN Tierra del Fuego (2023-2026, extended) studies freeze-drying, drying by sublimation at low pressure, to preserve and add value to locally produced food. I led it within the QA3DS R&D group (Chemistry Applied to the Environment, Food and Sustainable Development), with a team of lecturers in chemical and industrial engineering and science, and student grant holders.

Of the three planned matrices, rhubarb went ahead; samphire and sea urchin were dropped.

## What we found

- **The optimal time is 48 hours** with frozen or deep-frozen samples and 72 with fresh ones; in practice 36 to 48 hours is recommended. About 92 % of the weight is lost.
- **Pre-freezing makes drying more predictable**: the Page model fits with R² of 0.91 and 0.92 against 0.76 for fresh samples.
- **From 36 hours the three pre-treatments are equivalent** (Kruskal-Wallis, p = 0.51), although at 24 hours the fresh samples are ahead.
- **The results reproduce**: the month of the trial has no effect (p = 0.10), and neither do the equipment conditions within their range.

## How we worked

A reproducible notebook compiles the trials, excludes invalid observations with their reason and produces the figures and a key-results document from which every published figure comes, including those on the group's website. An ETL loads the data into SQLite for a monitoring dashboard. The laboratory protocol, the quality framework and the scale-up study are finished; the technical-economic manual, the final report and a preprint are still in preparation. The project material is in Spanish.
