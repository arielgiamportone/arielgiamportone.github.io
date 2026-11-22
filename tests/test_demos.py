"""Comprobaciones de los ficheros que sirven las demos."""
import hashlib
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


def test_wheel_paradoxdb_es_el_de_pypi():
    whl = RAIZ / "content/proyectos/paradox-db-py/paradoxdb-0.1.0-py3-none-any.whl"
    sha = hashlib.sha256(whl.read_bytes()).hexdigest()
    # SHA-256 publicado por PyPI para paradoxdb 0.1.0 (py3-none-any).
    assert sha == "39502ad11347d6e1d9e8dd5d6193e0dd214a04180ce4d2b9d7693837ec240130"


def test_tabla_paradox_sintetica_presente():
    carpeta = RAIZ / "content/proyectos/paradox-db-py/tabla"
    assert (carpeta / "ACTIVOS.DB").stat().st_size > 0
    assert (carpeta / "ACTIVOS.MB").stat().st_size > 0
