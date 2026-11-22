import importlib.util
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("sync_base", RAIZ / "scripts" / "sync_base.py")
sb = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sb)


def test_rango_meses():
    assert sb.rango("03/2021 – 12/2021") == {"inicio": "2021-03", "fin": "2021-12", "actual": False}


def test_rango_actual():
    r = sb.rango("06/2025 – Presente")
    assert r["inicio"] == "2025-06" and r["actual"] and r["fin"] is None


def test_rango_anios():
    assert sb.rango("2007 – 2011") == {"inicio": "2007", "fin": "2011", "actual": False}


def test_limpiar_quita_campos_internos():
    salida = sb.limpiar({"rol": "x", "fuente": "y", "fechas_nota": "z", "riesgo": "w"}, "t")
    assert salida == {"rol": "x"}


def test_limpiar_descarta_sin_validar():
    assert sb.limpiar(["ok", "dato [VALIDAR fechas]"], "t") == ["ok"]


def test_limpiar_descarta_prohibido():
    assert sb.limpiar(["llamar al +34 600 000 000", "ok"], "t") == ["ok"]
    assert sb.limpiar(["cliente Brugarolas"], "t") == []


def test_reemplazos():
    assert sb.limpiar("Zamudio 2025 reproducido al céntimo", "t").startswith("Cierre contable")


def test_repo_privado():
    assert not sb.repo_publico("https://github.com/Intervalor-Data/x")
    assert sb.repo_publico("https://github.com/arielgiamportone/trawl-design-lab")


def test_completo():
    assert not sb.completo({"titulo": "x"}, "publicaciones", "t")
    assert sb.completo({"titulo": "x", "autores": "y"}, "publicaciones", "t")
