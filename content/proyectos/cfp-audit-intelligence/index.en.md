---
title: "cfp-audit-intelligence"
proyecto: cfp_audit_intelligence
translationKey: "proyecto-cfp-audit-intelligence"
url: "/en/projects/cfp-audit-intelligence/"
description: "An AI audit platform for the public minutes of Argentina's Federal Fisheries Council, checked against the scientific recommendations of INIDEP."
subtitulo: "Are fishing quotas set in line with the science? A platform that reads the public minutes, analyzes them with AI and checks them against INIDEP advice and actual catches."
indicadores:
  - { v: "1,003", e: "tests in CI" }
  - { v: "12", e: "documented architecture decisions (ADRs)" }
  - { v: "492", e: "INIDEP technical reports cataloged" }
  - { v: "18", e: "pages in the Streamlit dashboard" }
  - { v: "8", e: "public sources integrated (CFP, INIDEP, SIPA, FAO, CONICET, CONAE…)" }
  - { v: "Thesis", e: "Master's in AI Development, BIG school, passed in 2026" }
demo:
  titulo: "Presentation and video"
  nota: "The final project presentation and the demo video, both in Spanish. The live app runs on Streamlit Community Cloud: after a period of inactivity it goes to sleep and takes about a minute to wake up."
  pestanas:
    - { titulo: "Presentation (13 slides)", url: "https://arielgiamportone.github.io/cfp-audit-intelligence/slides.html", nota: "Use the arrow keys to move between slides." }
    - { titulo: "Demo video", url: "https://www.youtube-nocookie.com/embed/Vfm4etySz3E" }
enlaces:
  - { t: "Live app", url: "https://cfp-audit-intelligence-um5xi4fkkiyq2gtuownvuz.streamlit.app" }
  - { t: "Repository", url: "https://github.com/arielgiamportone/cfp-audit-intelligence" }
  - { t: "Video on YouTube", url: "https://youtu.be/Vfm4etySz3E" }
galeria:
  - { src: "app-inicio.png", pie: "Home: the question, the science–policy–reality triangle and the sustainability traffic light." }
  - { src: "app-informe-ejecutivo.png", pie: "Executive report: the main finding on one page, with the source of every figure." }
  - { src: "app-timeline.png", pie: "Timeline by species: how INIDEP's recommended catch has evolved." }
---

## The problem

Every year Argentina's Federal Fisheries Council (CFP) decides how much of each species can be caught in the Argentine Sea. Scientists at INIDEP recommend a safe limit, the Biologically Acceptable Catch (CBA), and Law 24,922 requires it to be taken into account. The question is simple: **does what policy authorizes respect that limit?** Answering it by hand means reading thousands of pages of PDF minutes and cross-checking them against technical reports and landing statistics.

## What I built

- **Data acquisition from eight public sources**: CFP minutes, INIDEP technical reports (through the DSpace API of its repository), actual catches from SIPA, FAO FIRMS, CONICET publications, fishing closures from INIDEP's geoviewer, and satellite fishing effort from CONAE and Global Fishing Watch.
- **Processing of the minutes**: cascading extraction (pdfplumber, PyMuPDF and Tesseract OCR), a parser for resolutions, votes and quorum, and fisheries named-entity recognition with spaCy (species, companies, zones, vessels).
- **Knowledge base and RAG**: ChromaDB with multilingual embeddings and an audit engine that supports multiple LLM providers (Anthropic with prompt caching, or any OpenAI-compatible API).
- **The audit triangle**: a comparator of INIDEP's CBA against the approved quota and actual catch, with a four-level traffic light, configurable alerts and a relationship graph between companies, resolutions and council members.
- **Products**: an 18-page Streamlit dashboard, a FastAPI REST API and an executive PDF report.

## Responsible AI

The project documents its limits as much as its capabilities: a Model Card and a Datasheet following Mitchell (2019) and Gebru (2021), groundedness metrics to check that model answers rest on the sources, prompt versioning, and an ethical-limits ADR: it is a descriptive analysis tool on public data, not a tool for legal decisions or accusations.

## How it is built

Python with a layered, ports-and-adapters (hexagonal) architecture, 12 ADRs, 1,003 pytest tests and CI on GitHub Actions, Docker, and deployment on Streamlit Community Cloud. It started as a personal project before the master's and grew into the final project of the **Master's in AI Development** at BIG school: the step from data science to maintainable software development.
