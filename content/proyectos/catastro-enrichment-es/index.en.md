---
title: "catastro-enrichment-es"
proyecto: catastro_enrichment_es
translationKey: "proyecto-catastro-enrichment-es"
url: "/en/projects/catastro-enrichment-es/"
description: "Enrichment of real-estate inventories with Spain's five cadastres behind one interface, fallback geocoding and location images stored according to their license."
subtitulo: "Spain does not have one cadastre but five. This library queries them all through the same interface and fills in an inventory with coordinates, areas, year, use and an image."
indicadores:
  - { v: "5", e: "cadastres behind one interface (DGC and four foral ones)" }
  - { v: "139", e: "network-free tests, 97% coverage" }
  - { v: "<1e-6°", e: "UTM ↔ WGS84 round-trip error, zones 28 to 31" }
  - { v: "1", e: "runtime dependency (pyproj)" }
  - { v: "0", e: "writes without a dry run or a backup first" }
  - { v: "MIT", e: "license · PyPI 0.1.0" }
demo:
  parcial: "catastro"
  titulo: "Real results, one cadastre per tab"
  nota: "Queries made with the published package against the public services, from a point next to a well-known building in each territory. The reference shown is the parcel the service returns at that point."
enlaces:
  - { t: "Repository", url: "https://github.com/arielgiamportone/catastro-enrichment-es" }
  - { t: "PyPI: catastro-enrich", url: "https://pypi.org/project/catastro-enrich/" }
---

## The problem

Public-sector asset registers and property portfolios arrive incomplete: cadastral references without coordinates, free-text addresses without a reference, empty areas and years, no image. Completing them by hand is slow and error-prone. And Spain does not have one cadastre but **five**: the Directorate General for Cadastre (DGC) for most of the country and the foral cadastres of Álava, Bizkaia, Gipuzkoa and Navarre, each with its own protocol, reference format, filtering dialect and coordinate system.

## How I solved it

- **One contract, five drivers.** The same interface (`lookup_rc`, `physical_data`, `batch`) for every territory. A router picks the cadastre from the municipality's INE code, which takes precedence over the province name.
- **Coordinate cascade.** With a reference, the territory's cadastre is asked. If it does not resolve and there is an address, geocoding takes over. If nothing resolves, the asset stays pending with its reason. Geocoding never overwrites a cadastral coordinate.
- **Honest precision.** Each Nominatim hit is labeled by its OpenStreetMap class as `exact`, `zone` or `administrative`, and only exact ones are stored by default: a neighborhood centroid is not the property.
- **Images according to their license.** PNOA orthophotos and Mapillary views are stored with their attribution; Google only as a live link, because its terms forbid storing them.
- **Repeatable batches.** Dry run by default, additive writes, a backup before writing and telemetry for each run. Business errors, which these services return with HTTP 200, are treated as data: a batch counts the failure and carries on.

## Decisions

| Decision | Rejected alternative | Reason |
|---|---|---|
| One driver per cadastre and an INE router | A single parameterized client | ArcGIS ignores `cql_filter`, INSPIRE services lack the unified reference, and axis order and formats differ |
| Nominatim | Google Geocoding | Cost, no-storage terms and sending data to a commercial third party |
| Confidence by OSM class | An `importance` threshold | Importance measures global relevance: rural streets would be discarded |
| Standard library with an injectable transport | `requests` or `httpx` | A single runtime dependency and network-free tests |
| Errors as data | Exceptions | A batch must count and carry on |

## How it is built

Python 3.11+ with the standard library and pyproj for UTM ↔ WGS84 conversions. 139 tests that run without network (every service response is synthetic), with 97% coverage. A CLI with six subcommands and a reference SQLite adapter. Published on PyPI.

## A clean-room case study

The patterns come from my work at Intervalor Data and are published with the company's permission. The repository is an independent implementation from a written specification, with synthetic data only, and an anti-leak test in CI keeps out any term from clients or the original system. The examples on this page are well-known public buildings, unrelated to any client.
