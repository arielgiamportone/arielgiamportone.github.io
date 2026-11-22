---
title: "trawlkit · Trawl Design Lab"
proyecto: trawlkit
translationKey: "proyecto-trawlkit"
url: "/en/projects/trawlkit/"
description: "An open lab to design, size and test trawl nets: a Python calculation engine, an app that works offline, an API and a reproducible book."
subtitulo: "From a classroom Excel spreadsheet to an open lab for designing trawl nets, which works on a phone even without signal."
indicadores:
  - { v: "697", e: "values from the original spreadsheet reproduced (rtol 1e-6)" }
  - { v: "28", e: "spreadsheet errors documented, 24 fixed" }
  - { v: "13", e: "net drag methods" }
  - { v: "35", e: "nets in the catalogue, sourced value by value" }
  - { v: "1,466", e: "components from 18 manufacturers plus generics" }
  - { v: "41", e: "book chapters, 170 references" }
demo:
  url: "https://arielgiamportone.github.io/trawl-design-lab/app/"
  titulo: "Try it here: the real app"
  nota: "This is the full application, not a mock-up. It calculates with the project's API and, when the API is unavailable (it sleeps after a while without use), with the same Python package running in your browser with Pyodide. Language (Spanish or English) and units (metric or imperial) are at the top right."
enlaces:
  - { t: "Open the app in a new tab", url: "https://arielgiamportone.github.io/trawl-design-lab/app/" }
  - { t: "Book (Jupyter Book, Spanish)", url: "https://arielgiamportone.github.io/trawl-design-lab/" }
  - { t: "Repository", url: "https://github.com/arielgiamportone/trawl-design-lab" }
  - { t: "PyPI: trawlkit", url: "https://pypi.org/project/trawlkit/" }
  - { t: "Zenodo (DOI)", url: "https://doi.org/10.5281/zenodo.23959629" }
diagramas:
  - { src: "cadena-calculo-en.svg", pie: "The calculation chain, stage by stage: the same as the original model, each with its chapter in the book." }
  - { src: "arquitectura-en.svg", pie: "One engine and one data source for the CLI, the API, the offline app and the book." }
galeria:
  - { src: "en-guided-diagnosis.png", pie: "Guided mode: four steps and a plain-language diagnosis." }
  - { src: "en-expert-summary-imperial.png", pie: "Expert mode in imperial units: the design case and its indicators." }
  - { src: "escritorio-diseno-interactivo.png", pie: "Interactive design on the net plan, recalculated live." }
  - { src: "escritorio-simulacion-3d.png", pie: "3D simulation of the towed net shape, coloured by tension." }
  - { src: "escritorio-catalogo-fao.png", pie: "FAO catalogue with the source of every value." }
  - { src: "en-economics-imperial.png", pie: "Operating economics: margin and the most profitable speed." }
  - { src: "escritorio-construccion.png", pie: "Construction guide for the net workshop." }
  - { src: "movil-sin-conexion.png", pie: "On a phone and offline: the engine runs on the device." }
---

## The problem

Choosing a trawl net is an engineering problem: it has to be one the vessel **can actually tow**, at a speed that catches fish, with doors, warps and floats that keep it open, and at a cost that pays back. In practice, that calculation lives in spreadsheets that inherit their own errors, or in the experience of whoever rigs the net on the quay.

## Where it comes from

The project started in the Fisheries Engineering classrooms of UTN in Tierra del Fuego: sizing the FAO A-3 net for the 150-180 HP vessels of the Beagle Channel, solved in an Excel workbook of about 5,500 formulas. That workbook is now `trawlkit`: **every formula migrated and validated against the spreadsheet**, its errors documented and fixed, generalised to any net and extended with catalogues, optimisation, simulation and an app for use on the quay.

## What I built

- **Calculation engine** (`trawlkit`): available power, panels and cuts, net mechanics and dimensions, drag by 13 methods, doors and bridles, openings, floatation and ballast, warps and the towing speed window.
- **Two calculation modes**: `excel` reproduces the original workbook's number to validate the migration, and `corrected` applies the right formula. Every fix is demonstrated, not assumed.
- **Installable web app that works offline**: the same engine runs on the phone with Pyodide, with parity against CPython (rtol 1e-9). A guided mode for skippers and technicians and an expert mode for engineers.
- **Simulation** of the 3D equilibrium shape of the net, validated against DynamiT, and **codend selectivity** (diamond, T90, square mesh) by species.
- **From design to workshop**: bill of materials with cost, cutting sheet, joins and rigging, as a PDF and step by step on the phone.
- **Operating economics**: fuel, catch and margin at each speed, and the most profitable speed.
- **UTN classroom**: exercises with changing data and automatic marking, guided labs and a classroom with courses, assignments and grades.
- **Reproducible book** of 41 chapters whose numbers come from running the engine, and an **API** with 79 routes.

## How it is built

Python 3.11+ with Pydantic and pint for units, FastAPI for the API, a React app that loads the engine in a Web Worker with Pyodide, and Jupyter Book for the documentation. Continuous integration with pytest, ruff and mypy; the README indicators are checked by a test. Code under the MIT licence; documentation and data under CC BY 4.0. Published on PyPI with a DOI on Zenodo.

## Who it is for

Fishers and skippers, net technicians, fishing schools, and fisheries students and engineers. It is dedicated to the three UTN regional faculties that teach Fisheries Engineering: Tierra del Fuego, Chubut and Mar del Plata.
