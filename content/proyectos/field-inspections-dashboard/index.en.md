---
title: "Field inspections dashboard"
weight: 2
proyecto: casos_estudio_intervalor
translationKey: "proyecto-field-inspections-dashboard"
url: "/en/projects/field-inspections-dashboard/"
description: "Clean-room case study: a pipeline and a static dashboard that turn records from a third-party inspection app into near-real-time monitoring, monthly reports and certification spreadsheets."
subtitulo: "The team used to discover data problems at month end. Now the dashboard refreshes every 3 hours, with no database, no BI licenses and no servers to maintain."
indicadores:
  - { v: "every 3 h", e: "data refreshed automatically, previously monthly and by hand" }
  - { v: "−78%", e: "size of the client-facing dashboard (3.6 to 0.8 MB)" }
  - { v: "85×", e: "more evidence photos found in the nested payloads" }
  - { v: "1.7% → 0", e: "records shown on the wrong day (UTC read as local time)" }
  - { v: "16 of 16", e: "rows of the official valuation report reproduced by code" }
  - { v: "~200", e: "checks in 22 suites before every extraction" }
demo:
  parcial: "inspecciones"
  titulo: "Try it: the repository code, in your browser"
  nota: "Two pieces rewritten from scratch (clean-room) with their tests. The proxy runs against a simulated upstream and the history is synthetic: no request goes out to any third party."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/field-inspections-dashboard" }
  - { t: "The six lessons", url: "https://github.com/arielgiamportone/field-inspections-dashboard/tree/main/docs/lessons" }
diagramas:
  - { src: "arquitectura-en.svg", pie: "No database and no BI: a precomputed site, reproducible from versioned code and cached data." }
---

## Context

A team of technicians runs compliance inspections at about 1,800 commercial sites of a public-sector client, spread across 15 business lines, capturing checklists and photos in a third-party mobile app.

Monthly reporting was manual: exports pasted into Excel macros, the Word report put together by hand and the certification sheet filled in cell by cell. The client had no real-time visibility and the team found out about data problems at month end. On top of that, the API documentation did not match what production returned.

## My role

Sole designer and developer end to end: architecture, extraction, dashboard, CI/CD, authentication, report automation and operations. I worked with the operations team to turn their rules into code and with the client's IT to get access approved. About 360 commits in five months.

## Decisions that matter

- **A precomputed dashboard** instead of the initial proposal of a SQL database, webhooks and a commercial BI tool: the volume fits easily, there are no servers to patch and no license fees, and every build is reproducible from code.
- **Cached history plus a three-month live window**: about 20 times fewer API calls, and periods already reported stay frozen.
- **Deletions only inside the queried window, with an abort threshold**: what is deleted at source disappears, but a partial response cannot take real data with it.
- **A server-side photo proxy** with a host allow-list: the token never reaches the browser.
- **A file proxy that answers 302** to a short-lived pre-signed URL: no size limits, no traffic through the function, and the original file name preserved.
- **Internal views are removed at build time** from the client version, not hidden with CSS: hidden data is still in the HTML.

## What went wrong and stayed fixed

The repository documents six lessons. The most telling one: for years the team saw timestamps “sometimes one or two hours off, with no pattern”. There was a pattern, +1 h in winter and +2 h in summer: the API returned UTC and the pipeline read it as local time. A 23-case test covering DST changes, midnights and month ends keeps it fixed.

## A clean-room case study

The work was done at Intervalor Data. This repository is a case study and a from-scratch reimplementation of some patterns, published with the company's permission: it contains no client code, data, names or infrastructure details.
