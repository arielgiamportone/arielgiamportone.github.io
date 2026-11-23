---
title: "Inspection photo archiver"
weight: 3
proyecto: casos_estudio_intervalor
translationKey: "proyecto-inspection-photo-archiver"
url: "/en/projects/inspection-photo-archiver/"
description: "Clean-room case study: a 24/7 desktop service that watches synced folders, downloads the evidence photos from an inspection app, files them per project and keeps a cumulative ledger linking every file to its source."
subtitulo: "Finding «the photo of site X on day Y» in seconds, in a tree shared with the client, without ever losing the history even when the disk, the cloud or an open spreadsheet work against you."
indicadores:
  - { v: "2 → 14", e: "projects served: from two hard-coded scripts to 14 configured watchers" }
  - { v: "8", e: "business lines added by a colleague without touching code" }
  - { v: "~21,000", e: "history records rebuilt after a silent wipe" }
  - { v: "~8,000", e: "links broken by a single folder reorganisation" }
  - { v: "0", e: "exports stuck and downloaded twice (previously 2 of 4)" }
  - { v: "19", e: "architecture decision records" }
demo:
  parcial: "archivador"
  titulo: "Try it: the repository modules, in your browser"
  nota: "Three pieces rewritten from scratch (clean-room), using only Python's standard library, with 21 tests. Files are created on a virtual disk in your browser's memory; sites, dates and photos are made up."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/inspection-photo-archiver" }
  - { t: "The seven lessons", url: "https://github.com/arielgiamportone/inspection-photo-archiver/tree/main/docs/lessons" }
diagramas:
  - { src: "flujo-en.svg", pie: "One application with one watcher per project; each watcher's behaviour lives in a JSON profile." }
---

## Context

Field technicians run compliance inspections across hundreds of commercial sites, grouped into a dozen business lines, and take the photos in a third-party app. The client's deliverables need that evidence **archived in a shared folder tree**, with names and folders that let anyone find any photo in seconds.

It started as two hard-coded scripts, one per contract, each with its own loop and settings: adding a project meant copying a script. And the archive lives in a cloud-synced folder shared with the client team, so files arrive in stages, can be open in a spreadsheet app, or exist only as placeholders not yet downloaded.

## My role

Sole designer and developer: architecture, implementation, production support and the write-up of every incident. I turned the operations team's filing rules into configuration and wrote the guide that let a colleague add eight business lines without touching code. About 100 commits.

## Decisions that matter

- **One application with one watcher per project** and the behaviour in JSON profiles, instead of one script per project.
- **Polling with a settle delay** instead of file-system events: the sync client writes files in stages and the events fired on half-written files.
- **The ledger is never recreated empty**: it can be loaded, migrated with a backup or reset with a backup, and if it cannot be read, the run aborts.
- **Links relative to the ledger** instead of absolute ones, which broke in three folder reorganisations.
- **Warn, don't re-route**, when an export lands in another line's inbox: moving it would change where technicians expect their photos, and a warning is reversible.
- **Abort if the same photo arrives twice** while a form is being migrated: a duplicate in a cumulative ledger is expensive to undo.

## What went wrong and stayed fixed

The repository documents seven lessons, each with its symptom, its cause and the test that keeps it fixed. Two of them are in the demo: the ledger that emptied itself when it was open in a spreadsheet app, and the run that reported «0 errors» while photos were missing because it only looked for the folder in the month of the visit. Another curious one: Python's garbage collector was hiding a file lock, and the test that catches it has to move the file with the collector disabled.

## A clean-room case study

The work was done at Intervalor Data. This repository is a case study and a from-scratch reimplementation of some patterns, published with the company's permission: it contains no client code, data, names or infrastructure details.
