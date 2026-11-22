---
title: "asset-identity-gs1"
proyecto: asset_identity_gs1
translationKey: "proyecto-asset-identity-gs1"
url: "/proyectos/asset-identity-gs1/"
description: "Identidad GS1 para los activos físicos de un inventario: una identidad, cuatro formas equivalentes y unicidad sin servidor."
subtitulo: "Una etiqueta que lee la pistola láser, el móvil y el lector RFID, y que nunca se repite entre sedes aunque cada una imprima sin conexión."
indicadores:
  - { v: "4", e: "formas equivalentes de una misma identidad" }
  - { v: "0", e: "consultas a un servidor para imprimir sin colisiones" }
  - { v: "148", e: "tests, incluido un barrido anti-fugas" }
  - { v: "23", e: "casos de prueba de la especificación cubiertos" }
  - { v: "~270.000/s", e: "idas y vueltas GIAI-96" }
  - { v: "MIT", e: "licencia · PyPI 0.1.0" }
demo:
  parcial: "gs1"
  titulo: "Pruébalo: genera y lee identidades"
  nota: "Cambia cualquier campo y la etiqueta se recalcula. Es un port a JavaScript de la lógica del paquete, comprobado contra el paquete publicado en PyPI. Todo ocurre en tu navegador y todos los datos son de ejemplo."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/asset-identity-gs1" }
  - { t: "PyPI: asset-identity-gs1", url: "https://pypi.org/project/asset-identity-gs1/" }
diagramas:
  - { src: "cuatro-formas.svg", pie: "Del prefijo, el bloque y el serial salen el GIAI, el EPC y el enlace del QR; del número de inventario, el alias. El registro los liga." }
---

## El problema

Un inventario de activos físicos (edificios, mobiliario, equipos, obras de arte) hay que **rotularlo** y después **reconocerlo en campo**. Eso es más difícil que imprimir un código de barras:

1. **Varias sedes.** Cada una etiqueta a su ritmo, a menudo sin conexión. Dos sedes no pueden producir nunca el mismo código.
2. **Tres lectores, una identidad.** La pistola lee texto, el móvil lee una URL y el lector RFID devuelve 96 bits. Todos tienen que llegar al mismo activo.
3. **La etiqueta sobrevive al modelo de datos.** Los números de inventario se renumeran y las etiquetas se imprimen antes de que el activo exista en el sistema.

## Cómo lo resolví

- **Unicidad por construcción, no por consulta.** Una autoridad entrega a cada sede **un bloque, una sola vez**; después la sede incrementa su serial en local. Bloques distintos dan códigos distintos, igual que los prefijos de las direcciones MAC o de las empresas GS1. Al imprimir no se consulta a nadie.
- **Dos números, un registro.** El serial alimenta el GIAI y el EPC y nunca cambia; el número de inventario alimenta el alias porque es lo que la gente reconoce. Así una renumeración nunca invalida un chip ya colocado.
- **Errores de tecleo detectados en el momento.** El alias lleva un carácter de control mod-43 visible: un número mal tecleado se rechaza antes de llegar a la base de datos.
- **Etiquetas antes que activos.** Una sede puede reservar un lote de identidades antes de dar de alta los bienes, sin inflar los indicadores; al darlos de alta, heredan la etiqueta ya pegada.
- **Ciclo de vida completo** de la etiqueta (emitida, impresa, colocada, baja), resolución de cualquier código leído y detección de etiquetas cruzadas.
- **Salida lista para imprimir:** hojas A4 de etiquetas en PDF vectorial con Code 128 y QR, etiqueta suelta, y ZPL para impresoras que además graban el chip RFID.

## Decisiones

| Decisión | Alternativa descartada | Motivo |
|---|---|---|
| GIAI como clave | SGTIN | Un bien patrimonial es un activo individual, no un producto con GTIN |
| Partición del espacio de identificadores | Registro central consultado al imprimir | Las sedes imprimen sin conexión |
| Referencia numérica | GIAI-202 alfanumérico | Cabe en chips RFID de 96 bits, los baratos |
| Code 128 | Code 39 | Más denso: cabe en etiquetas de 63 mm |
| QR con GS1 Digital Link | QR con el alias | Una carga que es a la vez URL de verificación y clave GS1 |

## Cómo está hecho

Python puro con persistencia SQLite, reportlab para los PDF vectoriales y la tabla de particiones del EPC Tag Data Standard. 148 tests que siguen uno a uno los 23 casos de la especificación, CI en Python 3.11 y 3.12 y publicado en PyPI.

## Un caso de estudio *clean-room*

Los patrones nacieron en mi trabajo en Intervalor Data y se publican con su autorización. Para hacerlo sin exponer nada del cliente ni del código original, seguí un proceso en tres fases: una especificación escrita sin código, una implementación nueva solo a partir de esa especificación y de las normas públicas, y una revisión independiente que compara ambas antes de publicar. Un test anti-fugas impide que aparezca en el repositorio cualquier término del sistema original.
