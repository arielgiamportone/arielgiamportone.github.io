"""Puente entre la página y src/incremental_merge.py (sin cambios) del repositorio
github.com/arielgiamportone/field-inspections-dashboard. Se ejecuta igual en Pyodide y en CPython."""
from __future__ import annotations

import json

import pandas as pd

from incremental_merge import SuspiciousDeletion, cascade_delete, merge_with_authority_window


def refrescar(entrada: str) -> str:
    d = json.loads(entrada)
    historia = pd.DataFrame(d["historia"], columns=["id", "fecha", "estado"])
    fresca = pd.DataFrame(d["respuesta"], columns=["id", "fecha", "estado"])
    fotos = pd.DataFrame(d["fotos"], columns=["foto", "id"])
    try:
        r = merge_with_authority_window(
            historia, fresca, key="id", date_col="fecha",
            window_start=pd.Timestamp(d["desde"]), window_end=pd.Timestamp(d["hasta"]),
            max_delete_ratio=float(d.get("umbral", 0.10)),
        )
    except SuspiciousDeletion as e:
        return json.dumps({"ok": False, "error": str(e)})
    fotos_despues = cascade_delete(fotos, "id", r.deleted_keys)
    return json.dumps({
        "ok": True,
        "insertadas": r.inserted, "actualizadas": r.updated,
        "borradas": sorted(r.deleted_keys),
        "filas": len(r.table),
        "fotos_antes": len(fotos), "fotos_despues": len(fotos_despues),
        "tabla": r.table.astype(str).to_dict("records"),
    })
