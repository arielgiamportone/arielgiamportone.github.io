---
title: "catastro-enrichment-es"
proyecto: catastro_enrichment_es
translationKey: "proyecto-catastro-enrichment-es"
url: "/proyectos/catastro-enrichment-es/"
description: "Enriquecimiento de inventarios inmobiliarios con los cinco catastros españoles detrás de una sola interfaz, geocoding de respaldo e imágenes de localización con su licencia."
subtitulo: "España no tiene un catastro sino cinco. Esta librería los consulta todos con la misma interfaz y completa un inventario con coordenadas, superficies, año, uso e imagen."
indicadores:
  - { v: "5", e: "catastros tras una sola interfaz (DGC y cuatro forales)" }
  - { v: "139", e: "tests sin red, cobertura del 97 %" }
  - { v: "<1e-6°", e: "error de ida y vuelta UTM ↔ WGS84, husos 28 a 31" }
  - { v: "1", e: "dependencia en ejecución (pyproj)" }
  - { v: "0", e: "escrituras sin ensayo previo ni copia de seguridad" }
  - { v: "MIT", e: "licencia · PyPI 0.1.0" }
demo:
  parcial: "catastro"
  titulo: "Resultados reales, un catastro por pestaña"
  nota: "Consultas hechas con el paquete publicado contra los servicios públicos, desde un punto junto a un edificio conocido de cada territorio. La referencia que se muestra es la de la parcela que devuelve el servicio en ese punto."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/catastro-enrichment-es" }
  - { t: "PyPI: catastro-enrich", url: "https://pypi.org/project/catastro-enrich/" }
---

## El problema

Los inventarios patrimoniales de las administraciones y las carteras inmobiliarias llegan incompletos: referencias catastrales sin coordenadas, direcciones en texto libre sin referencia, superficies y años vacíos, ninguna imagen. Completarlos a mano es lento y propenso a errores. Y España no tiene un catastro sino **cinco**: la Dirección General del Catastro para el régimen común y los catastros forales de Álava, Bizkaia, Gipuzkoa y Navarra, cada uno con su protocolo, su formato de referencia, su forma de filtrar y su sistema de coordenadas.

## Cómo lo resolví

- **Un contrato, cinco drivers.** La misma interfaz (`lookup_rc`, `physical_data`, `batch`) para todos los territorios. Un router elige el catastro por el código INE del municipio, que manda sobre el nombre de la provincia.
- **Cascada de coordenadas.** Con referencia, se pregunta al catastro del territorio. Si no resuelve y hay dirección, se pasa al geocoding. Si nada resuelve, el bien queda pendiente con su motivo. El geocoding nunca sobrescribe una coordenada catastral.
- **Precisión honesta.** Cada resultado de Nominatim se etiqueta por su clase de OpenStreetMap como `exact`, `zone` o `administrative`, y por defecto solo se guardan los exactos: el centroide de un barrio no es el inmueble.
- **Imágenes según su licencia.** Las ortofotos del PNOA y las vistas de Mapillary se guardan con su atribución; Google solo como enlace en vivo, porque sus condiciones no permiten almacenar.
- **Lotes que se pueden repetir.** Ensayo por defecto, escritura aditiva, copia de seguridad antes de escribir y telemetría de cada ejecución. Los errores de negocio, que estos servicios devuelven con HTTP 200, se tratan como datos: un lote cuenta el fallo y sigue.

## Decisiones

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| Driver por catastro y router por INE | Un cliente parametrizado | ArcGIS ignora `cql_filter`, los servicios INSPIRE no tienen la referencia unificada y difieren el orden de ejes y el formato |
| Nominatim | Google Geocoding | Coste, prohibición de almacenar y envío de datos a un tercero comercial |
| Confianza por clase de OSM | Umbral de `importance` | La importancia mide relevancia global: las calles rurales se descartarían |
| Biblioteca estándar con transporte inyectable | `requests` o `httpx` | Una sola dependencia en ejecución y tests sin red |
| Errores como datos | Excepciones | Un lote debe contar y seguir |

## Cómo está hecho

Python 3.11+ con la biblioteca estándar y pyproj para las conversiones UTM ↔ WGS84. 139 tests que se ejecutan sin red (toda respuesta de servicio es sintética), con una cobertura del 97 %. CLI de seis subcomandos y un adaptador SQLite de referencia. Publicado en PyPI.

## Un caso de estudio *clean-room*

Los patrones nacieron en mi trabajo en Intervalor Data y se publican con su autorización. El repositorio es una implementación independiente a partir de una especificación escrita, solo con datos sintéticos, y un test anti-fugas en CI impide que entre cualquier término de clientes o del sistema original. Los ejemplos de esta página son edificios públicos conocidos, ajenos a cualquier cliente.
