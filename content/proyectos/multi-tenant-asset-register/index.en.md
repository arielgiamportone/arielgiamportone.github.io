---
title: "Multi-tenant asset register"
proyecto: casos_estudio_intervalor
translationKey: "proyecto-multi-tenant-asset-register"
url: "/en/projects/multi-tenant-asset-register/"
description: "Clean-room case study: a multi-tenant platform that consolidates public-sector asset inventories, values and depreciates them with a full audit trail, and replaces a legacy accounting system matching its figures to the cent."
subtitulo: "Replacing a decades-old desktop accounting system was only acceptable if the year-end figures came out identical: an auditor compares totals, not intentions."
indicadores:
  - { v: "15+", e: "tenants migrated and reconciled to the cent per account" }
  - { v: "~35", e: "tenants on a single PostgreSQL server, one schema each" }
  - { v: "60 → 100 %", e: "assets matching the legacy revaluation (about 2,300, Δ 0.00)" }
  - { v: "3-8 h → 10 min", e: "for a technical report per tenant" }
  - { v: "~390 → ~1,900", e: "automated tests" }
  - { v: "29", e: "architecture decision records" }
demo:
  parcial: "registro"
  titulo: "Try it: the repository modules, in your browser"
  nota: "Four pieces of the case rewritten from scratch (clean-room), using only Python's standard library, with 33 tests. The data is synthetic and the tenants are made up."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/multi-tenant-asset-register" }
  - { t: "The seven lessons", url: "https://github.com/arielgiamportone/multi-tenant-asset-register/tree/main/docs/lessons" }
diagramas:
  - { src: "arquitectura-en.svg", pie: "The same SQL statements serve a single-file on-premise install and dozens of tenants on one PostgreSQL server." }
---

## Context

Local public administrations must keep a legal register of everything they own (buildings, land, roads, vehicles, furniture, heritage), valued, depreciated and reconciled with their accounts. In practice it was spread across spreadsheets, scanned deeds, an Access database and, in many cases, a decades-old desktop application whose file format and calculation rules were the only specification.

Each administration is a separate tenant, with its own chart of accounts, useful-life tables and history. Reports were assembled by hand.

## My role

Architect and lead developer end to end: data model, ETL, valuation engine, multi-tenant storage, web back office, security, packaging and production operations. I turned the valuation experts' and the accounting team's criteria into code, and worked through each tenant's data until its migration reconciled. About 1,100 commits in eight months.

## Decisions that matter

- **One schema per tenant** instead of shared tables with a tenant column: it maps one to one onto the original file-per-tenant model, and a cross-tenant leak takes more than one forgotten `WHERE`.
- **Translate SQL at runtime** instead of rewriting about 1,200 statements with an ORM or maintaining two hand-written dialects. The translator only converts what the application uses and would rather fail than guess.
- **`Decimal` rounded to the cent like the legacy system**, never `float` or Python's banker's rounding: one cent of drift per asset is a failed audit.
- **A calculation memo on every figure**: where each input came from and which rule applied, so «why this number?» is answered without reading code.
- **Balances from an approved closing are loaded, not recomputed**: the register must agree with accounts that were already signed off.
- **Support access with signed tokens (RS256)** instead of a super-admin seeded in each database: no credential is left at the client to read or attack offline.

## What went wrong and stayed fixed

The repository documents seven production lessons, each with its symptom, its cause and the test that stops it from coming back. For example: a failed `SELECT` that poisoned the whole PostgreSQL transaction; the `%` that must be escaped only when parameters are passed; a direct `connect()` that opened an empty ghost database; and the role check that allowed users to promote themselves, found in a self-run review against the OWASP Top 10.

## A clean-room case study

The product belongs to Intervalor Data. This repository is a case study and a from-scratch reimplementation of some patterns, published with the company's permission: it contains no client code, data, names or infrastructure details.
