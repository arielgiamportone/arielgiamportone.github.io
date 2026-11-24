---
title: "asset-identity-gs1"
proyecto: asset_identity_gs1
translationKey: "proyecto-asset-identity-gs1"
url: "/en/projects/asset-identity-gs1/"
description: "GS1 identity for the physical assets of an inventory: one identity, four equivalent forms and uniqueness without a server."
subtitulo: "A label that a laser gun, a phone and an RFID reader can all read, and that never repeats across sites even when each one prints offline."
indicadores:
  - { v: "4", e: "equivalent forms of one identity" }
  - { v: "0", e: "server calls needed to print without collisions" }
  - { v: "148", e: "tests, including an anti-leak sweep" }
  - { v: "23", e: "specification test cases covered" }
  - { v: "~270,000/s", e: "GIAI-96 round trips" }
  - { v: "MIT", e: "license · PyPI 0.1.0" }
demo:
  parcial: "gs1"
  titulo: "Try it: generate and read identities"
  nota: "Change any field and the label is recalculated. It is a JavaScript port of the package's logic, checked against the package published on PyPI. Everything happens in your browser and all the data are examples."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/asset-identity-gs1" }
  - { t: "PyPI: asset-identity-gs1", url: "https://pypi.org/project/asset-identity-gs1/" }
diagramas:
  - { src: "cuatro-formas-en.svg", pie: "The prefix, block and serial give the GIAI, the EPC and the QR link; the inventory number gives the alias. The register links them." }
---

## The problem

An inventory of physical assets (buildings, furniture, equipment, works of art) has to be **labeled** and then **recognized in the field**. That is harder than printing a barcode:

1. **Several sites.** Each one labels at its own pace, often offline. Two sites must never produce the same code.
2. **Three readers, one identity.** The laser gun reads text, the phone reads a URL and the RFID reader returns 96 bits. All of them must lead to the same asset.
3. **The label outlives the data model.** Inventory numbers get renumbered and labels are printed before the asset exists in the system.

## How I solved it

- **Uniqueness by construction, not by lookup.** An authority gives each site **one block, once**; the site then increments its serial locally. Different blocks give different codes, like MAC address prefixes or GS1 company prefixes. Nothing is checked at print time.
- **Two numbers, one register.** The serial feeds the GIAI and the EPC and never changes; the inventory number feeds the alias because it is what people recognize. Renumbering never invalidates a chip already in place.
- **Typos caught on the spot.** The alias carries a visible mod-43 check character: a mistyped number is rejected before it reaches the database.
- **Labels before assets.** A site can reserve a batch of identities before registering the assets, without inflating the indicators; when the assets are registered they inherit the label already stuck on them.
- **Full label life cycle** (issued, printed, placed, retired), resolution of any scanned code and detection of swapped labels.
- **Print-ready output:** A4 label sheets as vector PDFs with Code 128 and QR, single labels, and ZPL for printers that also encode the RFID chip.

## Decisions

| Decision | Rejected alternative | Reason |
|---|---|---|
| GIAI as the key | SGTIN | A public asset is an individual asset, not a product with a GTIN |
| Partitioned identifier space | Central register queried at print time | Sites print offline |
| Numeric reference | Alphanumeric GIAI-202 | Fits low-cost 96-bit RFID chips |
| Code 128 | Code 39 | Denser: fits 63 mm labels |
| QR with GS1 Digital Link | QR with the alias | One payload that is both a verification URL and a GS1 key |

## How it is built

Pure Python with SQLite persistence, reportlab for vector PDFs and the partition table of the EPC Tag Data Standard. 148 tests that follow the 23 specification cases one by one, CI on Python 3.11 and 3.12, and a release on PyPI.

## A clean-room case study

The patterns come from my work at Intervalor Data and are published with the company's permission. To publish them without exposing anything from the client or the original code, I followed a three-phase process: a written specification without code, a fresh implementation from that specification and the public standards only, and an independent review comparing both before publishing. An anti-leak test keeps any term from the original system out of the repository.
