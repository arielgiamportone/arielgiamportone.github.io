---
title: "paradox-db-py"
proyecto: paradox_db_py
translationKey: "proyecto-paradox-db-py"
url: "/proyectos/paradox-db-py/"
description: "Lector y escritor en Python puro de tablas Paradox (.DB, .MB, .PX), sin dependencias nativas ni copyleft y sin conversiones silenciosas."
subtitulo: "Para modernizar un sistema de los años 90 hay que leer sus datos sin perder ni un registro, y devolvérselos para que el sistema viejo y el nuevo convivan durante meses."
indicadores:
  - { v: "104", e: "tests, con propiedades de ida y vuelta (Hypothesis)" }
  - { v: "0", e: "dependencias en ejecución" }
  - { v: "1,3 s", e: "para abrir y decodificar 50.000 registros" }
  - { v: "3", e: "estados explícitos por celda: OK, NULL, INVALID" }
  - { v: "3.0-7", e: "versiones de Paradox soportadas" }
  - { v: "MIT", e: "licencia · PyPI 0.1.0" }
demo:
  parcial: "paradox"
  titulo: "Pruébalo: el paquete real, en tu navegador"
  nota: "Una tabla Paradox sintética preparada para enseñar lo que importa: dos registros que la cabecera no declara, un importe en BCD ilegible, valores nulos, memos guardados en el fichero .MB y texto en la página de códigos CP437."
enlaces:
  - { t: "Repositorio", url: "https://github.com/arielgiamportone/paradox-db-py" }
  - { t: "PyPI: paradoxdb", url: "https://pypi.org/project/paradoxdb/" }
---

## El problema

Un sistema de gestión de activos fijos escrito en Delphi sobre el Borland Database Engine guardaba décadas de histórico en tablas Paradox. Modernizarlo exigía dos cosas a la vez: **extraer todos los registros sin pérdida**, incluidos los que el motor antiguo dejaba en los bloques sin contarlos en la cabecera y los importes en BCD que ya no se decodificaban; y **devolver tablas** a la aplicación antigua durante una transición larga.

Lo que ofrecía el ecosistema Python era un *binding* sobre una librería en C con licencia GPL, de solo lectura en la práctica, con una codificación de texto global, que se saltaba los registros no declarados y corrompía su memoria tras unas decenas de escrituras. Para un producto que se instala en los servidores del cliente, nada de eso servía.

## Cómo lo resolví

- **Python puro y licencia MIT**, sin dependencias en ejecución.
- **Ninguna conversión silenciosa**: cada celda vuelve como `OK`, `NULL` o `INVALID`, con sus bytes crudos y el motivo. La versión anterior convertía importes ilegibles y fechas centinela en vacíos: una pérdida invisible a gran escala.
- **Todos los registros de todos los bloques**, también los que la cabecera no declara, con el descuadre informado.
- **Página de códigos por tabla**, leída de la cabecera: los conjuntos reales mezclan CP437 y CP1252.
- **`Decimal` para importes y BCD** de hasta 32 dígitos; nunca `float`.
- **Escritura sobre una cabecera plantilla**: el fichero nuevo conserva versión, descriptores, clave y página de códigos, se reconstruye el índice primario `.PX` y un verificador comprueba que es coherente. Siempre ficheros nuevos, nunca modificación en sitio.
- **CLI** para perfilar un directorio de tablas con SHA-256, exportar a CSV o JSON con el estado de cada celda y verificar índices.

## Cómo se validó

La batería de tests cubre todos los casos de la especificación con datos sintéticos generados por el propio repositorio. En el proyecto original, el mismo diseño se contrastó con unas 120 tablas reales (unas 225.000 filas) sin ninguna diferencia de bytes ni de valor frente a la librería en C. Esas tablas no se pueden publicar; la cifra se da como contexto.

## Un caso de estudio *clean-room*

Los patrones nacieron en mi trabajo en Intervalor Data y se publican con su autorización. El repositorio se implementó en una sesión separada solo a partir de una especificación escrita y de documentación pública, y una revisión independiente lo comparó con el original antes de publicarlo: cero fragmentos idénticos. Un test anti-fugas y gitleaks se ejecutan en CI.
