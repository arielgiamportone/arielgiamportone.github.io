#!/usr/bin/env python3
"""Huella de los datos y plantillas de los que salen los CV en PDF (static/cv/).

Si cambia algo de lo que entra en un CV (data/, plantillas), la huella cambia y el test
tests/test_demos.py::test_cv_al_dia falla hasta que se regeneren los PDF con
scripts/actualizar_cv.sh, que escribe la huella nueva en static/cv/huella.txt.

Uso:
  python3 scripts/huella_cv.py           # imprime la huella actual
  python3 scripts/huella_cv.py --write   # la guarda en static/cv/huella.txt
  python3 scripts/huella_cv.py --check   # falla si no coincide con la guardada
"""
from __future__ import annotations

import hashlib
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
GUARDADA = RAIZ / "static" / "cv" / "huella.txt"
ENTRADAS = [
    "data/es/*.yaml", "data/en/*.yaml", "data/it/*.yaml", "data/cv.yaml",
    "layouts/partials/cv-documento.html", "layouts/partials/fechas.html",
    "layouts/perfiles/single.cv.html", "layouts/perfiles/single.cvit.html",
    "layouts/trayectoria/list.cvcyt.html",
]


def huella() -> str:
    h = hashlib.sha256()
    for patron in ENTRADAS:
        for f in sorted(RAIZ.glob(patron)):
            h.update(f.relative_to(RAIZ).as_posix().encode())
            h.update(f.read_bytes())
    return h.hexdigest()


def main() -> int:
    actual = huella()
    if "--write" in sys.argv:
        GUARDADA.write_text(actual + "\n", encoding="utf-8")
    elif "--check" in sys.argv:
        guardada = GUARDADA.read_text(encoding="utf-8").strip() if GUARDADA.exists() else ""
        if guardada != actual:
            print("Los CV en PDF no están al día con los datos: ejecuta scripts/actualizar_cv.sh", file=sys.stderr)
            return 1
    print(actual)
    return 0


if __name__ == "__main__":
    sys.exit(main())
