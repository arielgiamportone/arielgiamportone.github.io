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
        sys.modules.pop("demo", None)
        return importlib.import_module("demo")
    finally:
        sys.path.remove(str(REGISTRO))
        sys.modules.pop("demo", None)


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


# ------------------------------------------------ field-inspections-dashboard
INSPECCIONES = RAIZ / "content/proyectos/field-inspections-dashboard/codigo"


def test_modulos_inspecciones_sin_cambios():
    # SHA-256 de los ficheros del repositorio público, commit bd33a9e.
    assert hashlib.sha256((INSPECCIONES / "incremental_merge.py").read_bytes()).hexdigest() == \
        "1325db57e88b67b51f0ff23db891a8bc9b685ba408bd8611ee199961395116f1"
    assert hashlib.sha256((RAIZ / "assets/js/demos/inspecciones/photo-proxy.js").read_bytes()).hexdigest() == \
        "c748241d6aea8dc8fc77a68d44bd9166cc001bb55fc0cdd5d182ee4b6026e9e2"


def test_puente_inspecciones():
    import pytest
    pytest.importorskip("pandas")
    sys.path.insert(0, str(INSPECCIONES))
    try:
        sys.modules.pop("demo", None)
        d = importlib.import_module("demo")
    finally:
        sys.path.remove(str(INSPECCIONES))
        sys.modules.pop("demo", None)
    hist = [["T-1", "2026-03-10", "ok"]] + [[f"T-{i}", "2026-11-01", "ok"] for i in range(2, 26)]
    resp = [r for r in hist[1:] if r[0] != "T-2"]
    r = json.loads(d.refrescar(json.dumps({"historia": hist, "respuesta": resp, "fotos": [["F", "T-2"]],
                                           "desde": "2026-10-01", "hasta": "2026-12-31"})))
    assert r["ok"] and r["borradas"] == ["T-2"] and r["filas"] == 24 and r["fotos_despues"] == 0
    r = json.loads(d.refrescar(json.dumps({"historia": hist, "respuesta": resp[:5], "fotos": [],
                                           "desde": "2026-10-01", "hasta": "2026-12-31"})))
    assert not r["ok"]


# -------------------------------------------------- inspection-photo-archiver
ARCHIVADOR = RAIZ / "content/proyectos/inspection-photo-archiver/codigo"
MODULOS_ARCHIVADOR = {  # SHA-256 en el repositorio público, commit 3883db7
    "safe_ledger.py": "c5cdbdd2cb2586acf17cb0db7b583b12536049fab12ca44b4cd98b912cf537c6",
    "destination_resolver.py": "242c0426a1a69285b8b82d2ed0ceec3ad9d938e49292d48fee5e2ae8602869ab",
    "relative_links.py": "da15557a7ffd20021109bbf5b62a560fda8c2b9b52bc73b9e67bb579d28ca813",
}


def test_modulos_archivador_sin_cambios():
    for nombre, sha in MODULOS_ARCHIVADOR.items():
        assert hashlib.sha256((ARCHIVADOR / nombre).read_bytes()).hexdigest() == sha, nombre


def test_puente_archivador(tmp_path):
    sys.path.insert(0, str(ARCHIVADOR))
    try:
        sys.modules.pop("demo", None)
        d = importlib.import_module("demo")
    finally:
        sys.path.remove(str(ARCHIVADOR))
        sys.modules.pop("demo", None)
    q = lambda fn, **kw: json.loads(getattr(d, fn)(json.dumps({"base": str(tmp_path), **kw})))  # noqa: E731
    r = q("registro", caso="bloqueado")
    assert not r["ok"] and r["despues"][0]["filas"] == 5
    assert q("registro", caso="antiguo")["accion"] == "migrated"
    assert q("destino", local="L12", fecha="2026-10-03")["carpeta"] == "2026/11/L12/photos"
    e = q("enlaces", paso="duplicado")
    assert e["reparacion"]["reparados"] == [9] and e["reparacion"]["ambiguos"] == [8]
    assert "error" in q("enlaces", paso="desmontado")["reparacion"]


def test_cv_pdf_por_perfil():
    # Los genera scripts/cv_pdf.cjs desde las páginas cv.html; uno por perfil e idioma.
    for perfil in ("ia", "software", "sector-publico", "economia-azul"):
        for idioma in ("es", "en"):
            pdf = RAIZ / f"static/cv/Ariel_Giamportone_CV_{perfil}_{idioma}.pdf"
            assert pdf.read_bytes()[:5] == b"%PDF-", pdf.name
