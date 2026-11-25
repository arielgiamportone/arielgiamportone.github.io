"""Genera data/tecnologias.yaml (cinta «Con qué trabajo» de la portada) desde Simple Icons.

Simple Icons publica los iconos con licencia CC0; las marcas siguen siendo de sus dueños.
Se guarda solo el trazo, el título y el color de marca de cada icono de la lista.

Uso:
  npm pack simple-icons && tar xzf simple-icons-*.tgz        # o la carpeta node_modules/simple-icons
  python3 scripts/gen_tecnologias.py --simple-icons package
"""
import argparse
import json
import re
from pathlib import Path

import yaml

TECNOLOGIAS = [
    "python", "postgresql", "sqlite", "fastapi", "pydantic", "sqlalchemy", "docker", "githubactions", "git",
    "pandas", "numpy", "scikitlearn", "pytorch", "tensorflow", "jupyter", "streamlit", "plotly", "mlflow",
    "ollama", "claude", "htmx", "hugo", "r", "qgis", "arduino", "espressif", "pypi", "zenodo",
]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--simple-icons", type=Path, required=True, help="carpeta del paquete simple-icons")
    args = ap.parse_args()
    datos = json.loads((args.simple_icons / "data" / "simple-icons.json").read_text(encoding="utf-8"))
    datos = datos["icons"] if isinstance(datos, dict) else datos
    por_slug = {d["slug"]: d for d in datos if "slug" in d}
    version = json.loads((args.simple_icons / "package.json").read_text(encoding="utf-8"))["version"]
    salida = []
    for slug in TECNOLOGIAS:
        svg = (args.simple_icons / "icons" / f"{slug}.svg").read_text(encoding="utf-8")
        d = por_slug[slug]
        salida.append({"slug": slug, "titulo": d["title"], "color": f"#{d['hex']}",
                       "trazo": re.search(r'<path d="([^"]+)"', svg).group(1)})
    destino = Path(__file__).resolve().parent.parent / "data" / "tecnologias.yaml"
    cabecera = f"# GENERADO por scripts/gen_tecnologias.py desde Simple Icons {version} (CC0). No editar a mano.\n"
    destino.write_text(cabecera + yaml.safe_dump(salida, allow_unicode=True, sort_keys=False, width=10**6), encoding="utf-8")
    print(f"{destino}: {len(salida)} tecnologías")


if __name__ == "__main__":
    main()
