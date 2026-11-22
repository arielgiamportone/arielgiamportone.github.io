---
title: "trawlkit · Trawl Design Lab"
proyecto: trawlkit
translationKey: "proyecto-trawlkit"
url: "/proyectos/trawlkit/"
description: "Laboratorio abierto para diseñar, dimensionar y probar redes de arrastre: motor de cálculo en Python, app que funciona sin conexión, API y libro reproducible."
subtitulo: "De una planilla de Excel de clase a un laboratorio abierto para diseñar redes de arrastre, que funciona en el teléfono aun sin señal."
indicadores:
  - { v: "697", e: "valores del Excel original reproducidos (rtol 1e-6)" }
  - { v: "28", e: "erratas del Excel documentadas, 24 corregidas" }
  - { v: "13", e: "métodos de resistencia de la red" }
  - { v: "35", e: "redes en el catálogo, con procedencia valor por valor" }
  - { v: "1.466", e: "componentes de 18 fabricantes y genéricos" }
  - { v: "41", e: "capítulos del libro, 170 referencias" }
demo:
  url: "https://arielgiamportone.github.io/trawl-design-lab/app/"
  titulo: "Pruébalo aquí: la app real"
  nota: "Es la aplicación completa, no una maqueta. Calcula con la API del proyecto y, si no está disponible (duerme tras un rato sin uso), con el mismo paquete de Python ejecutándose en tu navegador con Pyodide. Puedes cambiar el idioma y las unidades arriba a la derecha."
enlaces:
  - { t: "Abrir la app en otra pestaña", url: "https://arielgiamportone.github.io/trawl-design-lab/app/" }
  - { t: "Libro (Jupyter Book)", url: "https://arielgiamportone.github.io/trawl-design-lab/" }
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/trawl-design-lab" }
  - { t: "PyPI: trawlkit", url: "https://pypi.org/project/trawlkit/" }
  - { t: "Zenodo (DOI)", url: "https://doi.org/10.5281/zenodo.23959629" }
diagramas:
  - { src: "cadena-calculo.svg", pie: "La cadena de cálculo, etapa por etapa: la misma del modelo original, cada una con su capítulo en el libro." }
  - { src: "arquitectura.svg", pie: "Un solo motor y una sola fuente de datos para la CLI, la API, la app sin conexión y el libro." }
galeria:
  - { src: "guiado-diagnostico.png", pie: "Modo guiado: cuatro pasos y un diagnóstico en lenguaje llano." }
  - { src: "escritorio-claro-caso.png", pie: "Modo experto: el caso de diseño y sus indicadores." }
  - { src: "escritorio-diseno-interactivo.png", pie: "Diseño interactivo sobre el plano, con recálculo en vivo." }
  - { src: "escritorio-simulacion-3d.png", pie: "Simulación 3D de la forma de la red remolcada, coloreada por tensión." }
  - { src: "escritorio-catalogo-fao.png", pie: "Catálogo FAO con la procedencia de cada valor." }
  - { src: "escritorio-economia.png", pie: "Economía de la operación: margen y velocidad más rentable." }
  - { src: "escritorio-construccion.png", pie: "Guía de construcción para el taller." }
  - { src: "movil-sin-conexion.png", pie: "En el teléfono y sin conexión: el motor corre en el dispositivo." }
---

## El problema

Elegir una red de arrastre es un problema de ingeniería: tiene que ser la que el buque **puede remolcar**, a una velocidad que pesque, con portones, cables y boyas que la mantengan abierta, y a un costo que se recupere. En la práctica, ese cálculo vive en planillas que heredan sus errores, o en la experiencia de quien arma la red en el muelle.

## De dónde viene

El proyecto empezó en las aulas de Ingeniería Pesquera de la UTN, en Tierra del Fuego: el dimensionamiento de la red FAO A-3 para los pesqueros de 150-180 HP del Canal Beagle, resuelto en una planilla de Excel de unas 5.500 fórmulas. Esa planilla es hoy `trawlkit`: **cada fórmula migrada y validada contra el Excel**, con sus erratas documentadas y corregidas, generalizada a cualquier red y ampliada con catálogos, optimización, simulación y una app para usar en el muelle.

## Qué hice

- **Motor de cálculo** (`trawlkit`): potencia disponible, paños y cortes, mecánica y dimensiones de la red, resistencia por 13 métodos, portones y bridas, aberturas, flotación y lastre, cables y ventana de velocidad.
- **Dos modos de cálculo**: `excel` reproduce el número del libro original para validar la migración, y `corrected` aplica la fórmula correcta. Así cada corrección queda demostrada, no supuesta.
- **App web instalable que funciona sin conexión**: el mismo motor corre en el teléfono con Pyodide, con paridad frente a CPython (rtol 1e-9). Modo guiado para patrones y técnicos, modo experto para ingenieros.
- **Simulación** de la forma de equilibrio de la red en 3D, validada contra DynamiT, y **selectividad** del copo (rombo, T90, cuadrada) por especie.
- **Del diseño al taller**: lista de materiales con costo, hoja de corte, uniones y montaje, en PDF y paso a paso en el teléfono.
- **Economía de la operación**: gasoil, captura y margen a cada velocidad, y la velocidad más rentable.
- **Aula UTN**: ejercicios con datos que cambian y corrección automática, laboratorios guiados y un aula con cursos, tareas y notas.
- **Libro reproducible** de 41 capítulos, cuyos números salen de ejecutar el motor, y una **API** con 79 rutas.

## Cómo está hecho

Python 3.11+ con Pydantic y pint para unidades, FastAPI para la API, una app React que carga el motor en un *Web Worker* con Pyodide, y Jupyter Book para la documentación. Integración continua con pytest, ruff y mypy; los indicadores de este README se verifican en un test. Código bajo licencia MIT; documentación y datos bajo CC BY 4.0. Publicado en PyPI y con DOI en Zenodo.

## Para quién

Pescadores y patrones, técnicos de redes, escuelas de pesca y estudiantes e ingenieros pesqueros. Está dedicado a las tres Facultades Regionales de la UTN donde se dicta Ingeniería Pesquera: Tierra del Fuego, Chubut y Mar del Plata.
