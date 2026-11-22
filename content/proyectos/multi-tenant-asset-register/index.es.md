---
title: "Registro de activos multi-tenant"
proyecto: casos_estudio_intervalor
translationKey: "proyecto-multi-tenant-asset-register"
url: "/proyectos/multi-tenant-asset-register/"
description: "Caso de estudio clean-room: una plataforma multi-tenant que consolida inventarios de activos del sector público, los valora y amortiza con trazabilidad y sustituye a un sistema contable antiguo cuadrando sus cifras al céntimo."
subtitulo: "Sustituir un sistema contable de escritorio de hace décadas solo era aceptable si los cierres salían idénticos: un auditor compara totales, no intenciones."
indicadores:
  - { v: "15+", e: "sedes migradas y conciliadas al céntimo por cuenta" }
  - { v: "~35", e: "sedes en un solo servidor PostgreSQL, un esquema cada una" }
  - { v: "60 → 100 %", e: "bienes que cuadran con la revalorización del sistema anterior (unos 2.300, Δ 0,00)" }
  - { v: "3-8 h → 10 min", e: "para un informe técnico por sede" }
  - { v: "~390 → ~1.900", e: "tests automáticos" }
  - { v: "29", e: "registros de decisiones de arquitectura" }
demo:
  parcial: "registro"
  titulo: "Pruébalo: los módulos del repositorio, en tu navegador"
  nota: "Cuatro piezas del caso reescritas desde cero (clean-room), solo con la biblioteca estándar de Python y 33 tests. Los datos son sintéticos y las sedes, inventadas."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/multi-tenant-asset-register" }
  - { t: "Las siete lecciones", url: "https://github.com/arielgiamportone/multi-tenant-asset-register/tree/main/docs/lessons" }
diagramas:
  - { src: "arquitectura.svg", pie: "Las mismas sentencias SQL sirven a una instalación de un solo fichero en el cliente y a decenas de sedes en un servidor PostgreSQL." }
---

## El contexto

Las administraciones locales tienen que llevar un inventario legal de todo lo que poseen (edificios, suelo, viales, vehículos, mobiliario, patrimonio), valorado, amortizado y cuadrado con su contabilidad. En la práctica vivía repartido entre hojas de cálculo, escrituras escaneadas, una base de datos Access y, en muchos casos, una aplicación de escritorio de hace décadas cuyo formato de ficheros y reglas de cálculo eran la única especificación.

Cada administración es una sede independiente, con su plan de cuentas, sus tablas de vida útil y su historia. Los informes se montaban a mano.

## Mi papel

Arquitecto y desarrollador principal de principio a fin: modelo de datos, ETL, motor de valoración, almacenamiento multi-tenant, backoffice web, seguridad, empaquetado y operación en producción. Traduje a código los criterios de los expertos en valoración y del equipo contable, y trabajé con los datos de cada sede hasta que su migración cuadraba. Unos 1.100 commits en ocho meses.

## Decisiones que importan

- **Un esquema por sede** en vez de tablas compartidas con una columna de sede: encaja uno a uno con el modelo original de un fichero por sede, y una fuga entre sedes exige algo más que olvidar un `WHERE`.
- **Traducir el SQL en tiempo de ejecución** en vez de reescribir unas 1.200 sentencias con un ORM o mantener dos dialectos a mano. El traductor solo convierte lo que la aplicación usa y prefiere fallar a adivinar.
- **`Decimal` redondeado al céntimo como el sistema anterior**, nunca `float` ni el redondeo bancario de Python: un céntimo de desvío por bien es una auditoría suspendida.
- **Una memoria de cálculo en cada cifra**: de dónde sale cada dato y qué regla se aplicó, para responder «¿por qué esta cifra?» sin leer código.
- **Los saldos de un cierre aprobado se cargan, no se recalculan**: el inventario tiene que coincidir con unas cuentas ya firmadas.
- **Acceso de soporte con tokens firmados (RS256)** en vez de un superadministrador sembrado en cada base de datos: en el cliente no queda ninguna credencial que leer o atacar sin conexión.

## Lo que salió mal y se quedó arreglado

El repositorio documenta siete lecciones de producción, cada una con su síntoma, su causa y el test que impide que vuelva. Por ejemplo: una `SELECT` fallida que envenenaba toda la transacción de PostgreSQL; el `%` que hay que escapar solo cuando se pasan parámetros; un `connect()` directo que abría una base de datos fantasma vacía; o la comprobación de rol que permitía ascenderse a uno mismo, encontrada en una revisión propia contra el OWASP Top 10.

## Un caso de estudio *clean-room*

El producto pertenece a Intervalor Data. Este repositorio es un caso de estudio y una reimplementación desde cero de algunos patrones, publicada con su autorización: no contiene código, datos, nombres ni detalles de infraestructura de ningún cliente.
