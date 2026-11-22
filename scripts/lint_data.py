#!/usr/bin/env python3
"""Comprueba que data/ no contiene datos privados ni sin validar. Se ejecuta en CI."""
from __future__ import annotations

import re
import sys
from pathlib import Path

import yaml

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = yaml.safe_load((RAIZ / "scripts" / "publicacion.yaml").read_text(encoding="utf-8"))


def main() -> int:
    errores = []
    for ruta in sorted((RAIZ / "data").rglob("*.yaml")):
        texto = ruta.read_text(encoding="utf-8")
        try:
            yaml.safe_load(texto)
        except yaml.YAMLError as e:
            errores.append(f"{ruta}: YAML inválido: {e}")
        for regla in CONFIG["prohibido"]:
            for n, linea in enumerate(texto.splitlines(), 1):
                if re.search(regla["patron"], linea):
                    errores.append(f"{ruta.relative_to(RAIZ)}:{n}: {regla['motivo']}")
    for e in errores:
        print(e, file=sys.stderr)
    print(f"lint_data: {'FALLA' if errores else 'OK'} ({len(errores)} problemas)")
    return 1 if errores else 0


if __name__ == "__main__":
    sys.exit(main())
