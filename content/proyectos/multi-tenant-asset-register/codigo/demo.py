"""Puente entre la página y los módulos del repositorio (se ejecuta igual en Pyodide y en CPython).

No reimplementa nada: llama a sql_dialect, depreciation y reconcile tal cual están en
github.com/arielgiamportone/multi-tenant-asset-register y devuelve JSON para la interfaz.
"""
from __future__ import annotations

import json
from datetime import date
from decimal import Decimal, InvalidOperation

import depreciation as dep
import reconcile as rec
import sql_dialect as sd


def _dec(x, defecto="0"):
    x = (str(x).strip().replace(",", ".") if x not in (None, "") else defecto)
    try:
        return Decimal(x)
    except InvalidOperation:
        raise ValueError(f"importe no válido: {x!r}")


def _fecha(x):
    return date.fromisoformat(x) if x else None


def traducir(entrada: str) -> str:
    d = json.loads(entrada)
    claves = {}
    for linea in (d.get("claves") or "").splitlines():
        if ":" in linea:
            tabla, cols = linea.split(":", 1)
            claves[tabla.strip()] = [c.strip() for c in cols.split(",") if c.strip()]
    try:
        sql = sd.to_postgres(d["sql"], bool(d.get("parametros")), claves)
        return json.dumps({"ok": True, "sql": sql})
    except ValueError as e:
        return json.dumps({"ok": False, "error": str(e)})


def sede(entrada: str) -> str:
    d = json.loads(entrada)
    conocidas = {"villanueva", "puerto_norte", "san_roque"}
    alias = {"vn": "villanueva", "pn": "puerto_norte"}
    try:
        t = sd.resolve_tenant(d["sede"], alias, conocidas)
        return json.dumps({"ok": True, "sede": t, "sql": sd.search_path_sql(t)})
    except PermissionError as e:
        return json.dumps({"ok": False, "error": str(e)})


def amortizar(entrada: str) -> str:
    d = json.loads(entrada)
    a = dep.Asset(
        id=d.get("id") or "A-1",
        category=d["categoria"],
        cost=_dec(d.get("coste")),
        start=_fecha(d.get("alta")),
        land_value=_dec(d.get("suelo")),
        residual=_dec(d.get("residual")),
        useful_life=int(d["vida"]) if d.get("vida") else None,
        owned=bool(d.get("propio", True)),
        loaded_accumulated=_dec(d["saldo"]) if d.get("saldo") not in (None, "") else None,
    )
    vidas = {k: int(v) for k, v in (d.get("vidas_sede") or {}).items() if v}
    r = dep.depreciate(a, _fecha(d["a_fecha"]), vidas)
    return json.dumps({
        "amortizable": r.depreciable,
        "acumulada": str(r.accumulated),
        "dotacion": str(r.charge_for_year),
        "neto": str(r.net_book_value),
        "memoria": r.memo,
    })


def revalorizar(entrada: str) -> str:
    d = json.loads(entrada)
    coef = {int(k): _dec(v) for k, v in d["coeficientes"].items()}
    v = dep.Valuation(_dec(d["coste"]), _dec(d["acumulada"]), int(d["vida"]), int(d["hasta"]))
    objetivo = int(d["objetivo"])

    def fila(x):
        return {"coste": str(x.replacement_cost), "acumulada": str(x.accumulated),
                "neto": str(x.net), "hasta": x.revalued_through}

    una = dep.revalue(v, coef, objetivo)
    dos = dep.revalue(una, coef, objetivo)  # segunda ejecución: no debe cambiar nada
    # Lo que haría un proceso que no guarda el último año aplicado: vuelve a multiplicar.
    sin_estado = dep.revalue(dep.Valuation(una.replacement_cost, una.accumulated, v.life_years,
                                           v.revalued_through), coef, objetivo)
    return json.dumps({"inicial": fila(v), "una": fila(una), "dos": fila(dos),
                       "sin_estado": fila(sin_estado)})


def conciliar(entrada: str) -> str:
    d = json.loads(entrada)
    filas = [rec.Row(f["id"], f["cuenta"], _dec(f["coste"]), _dec(f["acumulada"]))
             for f in d["nuestras"]]
    legado = {f["id"]: rec.Row(f["id"], f["cuenta"], _dec(f["coste"]), _dec(f["acumulada"]))
              for f in d["legado"]}
    totales = rec.totals(legado.values())
    problemas = rec.reconcile(filas, totales, legado)
    return json.dumps([{"cuenta": p.account, "metrica": p.metric, "nuestro": str(p.ours),
                        "legado": str(p.legacy), "delta": str(p.delta), "sospechosos": p.suspects}
                       for p in problemas])
