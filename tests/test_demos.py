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


# ------------------------------------------------ multi-tenant-asset-register
import importlib
import json
import sys

REGISTRO = RAIZ / "content/proyectos/multi-tenant-asset-register/codigo"
# SHA-256 de los módulos tal como están en el repositorio público, commit 635c963.
MODULOS_REGISTRO = {
    "sql_dialect.py": "aea2a525c6e088d95d12f7e951c823328eff9dc7e005d82b7fbe88187936588b",
    "depreciation.py": "52c0af171a7c3d1a55eb3547eed2ad970e3f6a97c8d40f67cd95da543c86422c",
    "reconcile.py": "a49061fbe1ce3d2a6af8bd309a1e9f727e269dd4a7145971a3a8d72b43d8ebf7",
}


def test_modulos_registro_sin_cambios():
    for nombre, sha in MODULOS_REGISTRO.items():
        assert hashlib.sha256((REGISTRO / nombre).read_bytes()).hexdigest() == sha, nombre


def _puente():
    sys.path.insert(0, str(REGISTRO))
    try:
        return importlib.import_module("demo")
    finally:
        sys.path.remove(str(REGISTRO))


def test_puente_registro():
    d = _puente()
    r = json.loads(d.traducir(json.dumps({"sql": "SELECT * FROM t WHERE n LIKE '%x%' AND id = ?", "parametros": True})))
    assert r == {"ok": True, "sql": "SELECT * FROM t WHERE n LIKE '%%x%%' AND id = %s"}
    assert not json.loads(d.traducir(json.dumps({"sql": "INSERT OR REPLACE INTO c (a, b) VALUES (?, ?)", "parametros": True})))["ok"]
    assert not json.loads(d.sede(json.dumps({"sede": "vn'; DROP SCHEMA public;--"})))["ok"]
    a = json.loads(d.amortizar(json.dumps({"categoria": "building", "coste": "250000", "alta": "2015-03-31", "suelo": "50000", "a_fecha": "2025-12-31"})))
    assert (a["acumulada"], a["dotacion"], a["neto"]) == ("43333.33", "4000.00", "206666.67")
    v = json.loads(d.revalorizar(json.dumps({"coste": "100000", "acumulada": "20000", "vida": 50, "hasta": 2023, "coeficientes": {"2024": "1.02", "2025": "1.03"}, "objetivo": 2025})))
    assert v["una"] == v["dos"] and v["sin_estado"]["coste"] != v["una"]["coste"]
    fila = {"id": "A", "cuenta": "211", "coste": "100", "acumulada": "33.33"}
    assert json.loads(d.conciliar(json.dumps({"nuestras": [fila], "legado": [fila]}))) == []
