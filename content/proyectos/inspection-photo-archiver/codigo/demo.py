"""Puente entre la página y los módulos del repositorio (sin cambios)
github.com/arielgiamportone/inspection-photo-archiver. Trabaja sobre una carpeta
temporal: en Pyodide, un sistema de ficheros en memoria; en CPython, un tmpdir."""
from __future__ import annotations

import csv
import json
import shutil
from datetime import date
from pathlib import Path

import destination_resolver as dr
import relative_links as rl
import safe_ledger as sl

FILAS = [
    {"source_url": f"https://files.inspections.example/p/{i}.jpg", "file_name": f"L12_202610{i:02d}_{i}.jpeg",
     "path": f"2026/10/L12/photos/L12_202610{i:02d}_{i}.jpeg", "job_id": str(4100 + i), "field": "fachada"}
    for i in range(1, 6)
]


def _listar(carpeta: Path) -> list[dict]:
    return [{"nombre": p.name, "filas": _filas(p)} for p in sorted(carpeta.iterdir()) if p.is_file()]


def _filas(p: Path) -> int:
    try:
        with open(p, newline="", encoding="utf-8") as f:
            return max(0, sum(1 for _ in csv.reader(f)) - 1)
    except Exception:
        return -1


# ------------------------------------------------------------------ registro

def registro(entrada: str) -> str:
    """Prepara el registro según el escenario, carga con safe_ledger y añade 2 fotos nuevas."""
    d = json.loads(entrada)
    base = Path(d["base"]) / "registro"
    shutil.rmtree(base, ignore_errors=True)
    base.mkdir(parents=True)
    ruta = base / "ledger.csv"
    caso = d["caso"]
    if caso in ("normal", "bloqueado", "nube"):
        sl.save_ledger(ruta, FILAS)
    elif caso == "antiguo":
        with open(ruta, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(list(sl.LEGACY_HEADER_MAP))
            for r in FILAS:
                w.writerow([r["source_url"], r["file_name"], r["path"], r["job_id"], r["field"]])
    elif caso == "desconocido":
        with open(ruta, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["url", "nombre"])
            for r in FILAS:
                w.writerow([r["source_url"], r["file_name"]])
    antes = _listar(base)

    intentos = []

    def lector(p):
        intentos.append(1)
        if caso == "bloqueado":
            raise PermissionError(13, "file is open in another program", str(p))
        if caso == "nube":
            raise OSError(22, "cloud file not downloaded yet", str(p))
        return sl._read_csv(p)

    nuevas = [{"source_url": f"https://files.inspections.example/p/{i}.jpg", "file_name": f"L12_20261120_{i}.jpeg",
               "path": f"2026/11/L12/photos/L12_20261120_{i}.jpeg", "job_id": str(4200 + i), "field": "placa"}
              for i in (1, 2)]
    try:
        res = sl.load_ledger(ruta, reader=lector, sleep=lambda s: None)
        sl.save_ledger(ruta, res.rows + nuevas)
        salida = {"ok": True, "accion": res.action, "filas_cargadas": len(res.rows),
                  "copia": res.backup.name if res.backup else None, "avisos": res.warnings}
    except sl.LedgerUnreadable as e:
        salida = {"ok": False, "error": str(e).replace(str(base) + "/", "")}
    salida.update({"intentos": len(intentos), "antes": antes, "despues": _listar(base)})
    return json.dumps(salida)


# ---------------------------------------------------------------- resolutor

ARCHIVO = {  # (año, mes) -> locales con la carpeta de su parte de inspección
    (2026, 8): ["L07", "L12"],
    (2026, 9): ["L03", "L07"],
    (2026, 10): ["L03", "L09"],
    (2026, 11): ["L07", "L12", "L21"],
}


def destino(entrada: str) -> str:
    d = json.loads(entrada)
    raiz = Path(d["base"]) / "archivo"
    if not raiz.exists():
        for (a, m), locales in ARCHIVO.items():
            for loc in locales:
                (raiz / f"{a:04d}" / f"{m:02d}" / loc / dr.PHOTOS).mkdir(parents=True)
    indice = dr.build_index(raiz)
    f = date.fromisoformat(d["fecha"])
    r = dr.resolve(indice, raiz, d["local"], f)
    ingenuo = raiz / f"{f.year:04d}" / f"{f.month:02d}" / d["local"] / dr.PHOTOS
    if not ingenuo.is_dir():
        ingenuo = raiz / f"{f.year:04d}" / f"{f.month:02d}" / dr.ERRORS
    rel = lambda p: p.relative_to(raiz).as_posix()  # noqa: E731
    return json.dumps({
        "carpeta": rel(r.folder), "motivo": r.reason, "ingenuo": rel(ingenuo),
        "indice": {k: [f"{a:04d}/{m:02d}" for (a, m), _ in v] for k, v in sorted(indice.items())},
    })


# ------------------------------------------------------------------- enlaces

FOTOS = ["L03_20261002_1.jpeg", "L03_20261002_2.jpeg", "L12_20261003_3.jpeg", "L12_20261003_4.jpeg",
         "L12_20261003_5.jpeg", "L07_20261105_6.jpeg", "L07_20261105_7.jpeg", "L07_20261105_8.jpeg",
         "L21_20261112_9.jpeg", "L21_20261112_10.jpeg"]


def enlaces(entrada: str) -> str:
    d = json.loads(entrada)
    base = Path(d["base"]) / "enlaces"
    shutil.rmtree(base, ignore_errors=True)
    raiz = base / "Inspecciones"
    registro_f = raiz / "ledger.csv"
    absolutos, relativos = [], []
    for n in FOTOS:
        p = raiz / "2026" / n[4:10][4:6] / n[:3] / "photos" / n
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_bytes(b"jpeg")
        absolutos.append(str(p))
        relativos.append(rl.relative_link(registro_f, p))
    paso = d["paso"]
    if paso in ("mover", "reorganizar", "duplicado", "desmontado"):
        nueva = base / "Archivo compartido" / "Inspecciones 2026"
        nueva.parent.mkdir(parents=True)
        shutil.move(str(raiz), str(nueva))
        raiz, registro_f = nueva, nueva / "ledger.csv"
    if paso in ("reorganizar", "duplicado"):
        # Alguien reorganiza a mano un local: quita el nivel photos/ de L21.
        carpeta = raiz / "2026" / "11" / "L21" / "photos"
        for f in carpeta.iterdir():
            shutil.move(str(f), str(carpeta.parent / f.name))
        carpeta.rmdir()
        if paso == "duplicado":
            # ...y deja una copia de una de sus fotos en otra carpeta.
            copia = raiz / "2026" / "11" / "L21" / "revisar"
            copia.mkdir()
            (copia / FOTOS[8]).write_bytes(b"jpeg")
    if paso == "desmontado":
        shutil.rmtree(raiz / "2026")
    salida = {
        "absolutos": [{"enlace": a, "ok": Path(a).is_file()} for a in absolutos],
        "relativos": [{"enlace": r, "ok": rl.resolve_link(registro_f, r).is_file()} for r in relativos],
        "carpeta": raiz.relative_to(base).as_posix(),
    }
    if paso != "inicial":
        try:
            rep = rl.repair(registro_f, relativos, raiz)
            salida["reparacion"] = {"enlaces": rep.links, "reparados": rep.repaired,
                                    "no_encontrados": rep.not_found, "ambiguos": rep.ambiguous}
        except rl.SuspiciousRepair as e:
            salida["reparacion"] = {"error": str(e)}
    return json.dumps(salida)
