---
title: "cfp-audit-intelligence"
proyecto: cfp_audit_intelligence
translationKey: "proyecto-cfp-audit-intelligence"
url: "/proyectos/cfp-audit-intelligence/"
description: "Plataforma de auditoría con IA de las actas públicas del Consejo Federal Pesquero argentino, contrastadas con las recomendaciones científicas del INIDEP."
subtitulo: "¿Se reparten las cuotas de pesca respetando lo que dice la ciencia? Una plataforma que lee las actas públicas, las analiza con IA y las contrasta con el INIDEP y con la captura real."
indicadores:
  - { v: "1.003", e: "tests en CI" }
  - { v: "12", e: "decisiones de arquitectura documentadas (ADR)" }
  - { v: "492", e: "informes técnicos del INIDEP catalogados" }
  - { v: "18", e: "páginas en el panel de Streamlit" }
  - { v: "8", e: "fuentes públicas integradas (CFP, INIDEP, SIPA, FAO, CONICET, CONAE…)" }
  - { v: "TFM", e: "Máster en Desarrollo con IA, BIG school, aprobado en 2026" }
demo:
  titulo: "Presentación y vídeo"
  nota: "La presentación del proyecto final y el vídeo de la demo. La app en vivo está en Streamlit Community Cloud: si lleva un tiempo sin uso se duerme y tarda un minuto en despertar."
  pestanas:
    - { titulo: "Presentación (13 diapositivas)", url: "https://arielgiamportone.github.io/cfp-audit-intelligence/slides.html", nota: "Usa las flechas del teclado para avanzar." }
    - { titulo: "Vídeo de la demo", url: "https://www.youtube-nocookie.com/embed/Vfm4etySz3E" }
enlaces:
  - { t: "App en vivo", url: "https://cfp-audit-intelligence-um5xi4fkkiyq2gtuownvuz.streamlit.app" }
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/cfp-audit-intelligence" }
  - { t: "Vídeo en YouTube", url: "https://youtu.be/Vfm4etySz3E" }
galeria:
  - { src: "app-inicio.png", pie: "Inicio: la pregunta, el triángulo ciencia–política–realidad y el semáforo de sostenibilidad." }
  - { src: "app-informe-ejecutivo.png", pie: "Informe ejecutivo: el hallazgo central en una página, con la fuente de cada dato." }
  - { src: "app-timeline.png", pie: "Timeline por especie: la evolución de la captura recomendada por el INIDEP." }
---

## El problema

Cada año, el Consejo Federal Pesquero (CFP) decide cuánto se puede pescar de cada especie en el Mar Argentino. Los científicos del INIDEP recomiendan un límite seguro, la Captura Biológicamente Aceptable (CBA), y la Ley 24.922 obliga a tenerla en cuenta. La pregunta es sencilla: **¿lo que autoriza la política respeta ese límite?** Responderla a mano exige leer miles de páginas de actas en PDF y cruzarlas con informes técnicos y estadísticas de desembarque.

## Qué hice

- **Adquisición de ocho fuentes públicas**: actas del CFP, informes técnicos del INIDEP (vía la API DSpace de su repositorio), capturas reales del SIPA, FAO FIRMS, publicaciones de CONICET, vedas del geovisor del INIDEP y esfuerzo pesquero satelital de CONAE y Global Fishing Watch.
- **Procesamiento de las actas**: extracción en cascada (pdfplumber, PyMuPDF y OCR con Tesseract), parser de resoluciones, votos y quórum, y reconocimiento de entidades pesqueras con spaCy (especies, empresas, zonas, buques).
- **Knowledge base y RAG**: ChromaDB con embeddings multilingües y un motor de auditoría con LLM de varios proveedores (Anthropic con *prompt caching*, o cualquier API compatible con OpenAI).
- **El triángulo de auditoría**: comparador de la CBA del INIDEP con la cuota aprobada y la captura real, con un semáforo de cuatro niveles, alertas configurables y un grafo de relaciones entre empresas, resoluciones y miembros.
- **Productos**: un panel de Streamlit de 18 páginas, una API REST con FastAPI y un reporte ejecutivo en PDF.

## IA responsable

El proyecto documenta sus límites tanto como sus capacidades: *Model Card* y *Datasheet* siguiendo a Mitchell (2019) y Gebru (2021), métricas de *groundedness* para comprobar que las respuestas del modelo se apoyan en las fuentes, versionado de *prompts*, y un ADR de límites éticos: es una herramienta de análisis descriptivo con datos públicos, no de decisión legal ni de imputación.

## Cómo está hecho

Python con arquitectura por capas y puertos (hexagonal), 12 ADRs, 1.003 tests con pytest y CI en GitHub Actions, Docker y despliegue en Streamlit Community Cloud. Empezó como proyecto personal antes del máster y se consolidó como Trabajo Final del **Máster en Desarrollo con IA** de BIG school: el salto de la ciencia de datos al desarrollo de software mantenible.
