#!/usr/bin/env python3
"""Genera data/es/*.yaml del portfolio a partir de la base de conocimiento.

La base (repo privado cv-perfil-profesional) es la fuente única de verdad.
Este script decide qué se publica según scripts/publicacion.yaml y escribe
solo datos públicos en data/es/. Los ficheros generados se versionan en este
repo, así que la web se puede construir sin acceso a la base.

Uso:
    python scripts/sync_base.py --base ../cv-perfil-profesional
    python scripts/sync_base.py --base ../cv-perfil-profesional --check   # falla si data/ cambiaría
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

RAIZ = Path(__file__).resolve().parent.parent
CONFIG = yaml.safe_load((RAIZ / "scripts" / "publicacion.yaml").read_text(encoding="utf-8"))

AVISOS: list[str] = []


def aviso(msg: str) -> None:
    AVISOS.append(msg)


def leer_frontmatter(ruta: Path) -> dict:
    texto = ruta.read_text(encoding="utf-8")
    if not texto.startswith("---"):
        raise ValueError(f"{ruta} no empieza con frontmatter YAML")
    return yaml.safe_load(texto.split("\n---\n", 1)[0].lstrip("-\n"))


def leer_cuerpo(ruta: Path) -> str:
    return ruta.read_text(encoding="utf-8").split("\n---\n", 1)[1]


# ---------------------------------------------------------------- limpieza

def es_interno(clave: str) -> bool:
    if clave in CONFIG["campos_internos"]:
        return True
    return any(clave.endswith(s) for s in CONFIG["sufijos_internos"])


def sin_validar(texto: str) -> bool:
    return any(m.lower() in texto.lower() for m in CONFIG["marcas_sin_validar"])


def limpiar(valor, contexto: str):
    """Quita campos internos y textos sin validar, de forma recursiva."""
    if isinstance(valor, dict):
        salida = {}
        for k, v in valor.items():
            if es_interno(k):
                continue
            v2 = limpiar(v, f"{contexto}.{k}")
            if v2 is not None:
                salida[k] = v2
        return salida
    if isinstance(valor, list):
        salida = []
        for i, v in enumerate(valor):
            v2 = limpiar(v, f"{contexto}[{i}]")
            if v2 is not None:
                salida.append(v2)
        return salida
    if isinstance(valor, str):
        for r in CONFIG.get("reemplazos", []):
            valor = valor.replace(r["buscar"], r["reemplazar"])
        regla = next((r for r in CONFIG["prohibido"] if re.search(r["patron"], valor)), None)
        if regla:
            aviso(f"Prohibido ({regla['motivo']}), no se publica: {contexto} = {valor[:90]!r}")
            return None
        if sin_validar(valor):
            aviso(f"Sin validar, no se publica: {contexto} = {valor[:90]!r}")
            return None
        return valor.strip()
    return valor


# ------------------------------------------------------------------ fechas

MESES = re.compile(r"(\d{1,2})/(\d{4})")
ANIO = re.compile(r"\b(19|20)\d{2}\b")


def rango(fechas: str) -> dict:
    """'03/2021 – 12/2021' → {inicio: '2021-03', fin: '2021-12', actual: False}."""
    partes = re.split(r"\s*[–-]\s*", str(fechas), maxsplit=1)

    def punto(p: str) -> str | None:
        m = MESES.search(p)
        if m:
            return f"{m.group(2)}-{int(m.group(1)):02d}"
        m = ANIO.search(p)
        return m.group(0) if m else None

    inicio = punto(partes[0])
    fin_txt = partes[1] if len(partes) > 1 else partes[0]
    actual = bool(re.search(r"(?i)presente|actualidad|actual", fin_txt))
    return {"inicio": inicio, "fin": None if actual else punto(fin_txt), "actual": actual}


# --------------------------------------------------------------- entidades

def completo(item: dict, tipo: str, contexto: str) -> bool:
    faltan = [k for k in CONFIG["requeridos"].get(tipo, []) if not item.get(k)]
    if faltan:
        aviso(f"Descartado entero por faltar {', '.join(faltan)}: {contexto}")
        return False
    return True


def repo_publico(url) -> bool:
    return bool(url) and not any(m.lower() in str(url).lower() for m in CONFIG["repos_privados"])


def perfiles_de(ids) -> list[str]:
    slugs = {p["clave"]: p["slug"] for p in CONFIG["perfiles"]}
    return [slugs[i] for i in (ids or []) if i in slugs]


def contacto(base: Path) -> dict:
    c = leer_frontmatter(base / "base" / "contacto.md")
    publico = {
        "nombre": c["nombre"],
        "email": c["email"],
        "ubicacion": c["ubicacion"],
        "modalidad": c.get("modalidad_preferida"),
        "ciudadania": "Ciudadanía UE (italiana)",
        "titular": c.get("titular_linkedin_es"),
        "titular_en": c.get("titular_linkedin_en"),
        "redes": {
            "linkedin": c.get("linkedin"),
            "github": c.get("github"),
            "researchgate": c.get("researchgate"),
            "orcid": f"https://orcid.org/{c['orcid']}" if c.get("orcid") else None,
            "zenodo": c.get("zenodo"),
            "linktree": c.get("linktree"),
        },
        "pypi": [f"https://pypi.org/project/{p}/" for p in c.get("pypi", [])],
    }
    publico["redes"] = {k: v for k, v in publico["redes"].items() if v}
    return limpiar(publico, "contacto")


def experiencia(base: Path) -> list[dict]:
    datos = leer_frontmatter(base / "base" / "experiencia.md")["experiencias"]
    excl = CONFIG["exclusiones_logros"]
    salida = []
    for e in datos:
        if e.get("mostrar_en_cv") is False:
            continue
        logros = []
        for l in e.get("logros", []):
            regla = next((x for x in excl if x["id"] == e["id"] and x["contiene"].lower() in l.lower()), None)
            if regla:
                aviso(f"Excluido por regla: {e['id']}: {l[:70]!r} ({regla['motivo']})")
                continue
            logros.append(l)
        entrada = {
            "id": e["id"],
            "empresa": e["empresa"],
            "rol": e["rol"],
            "fechas": e["fechas"],
            **rango(e["fechas"]),
            "ubicacion": e.get("ubicacion"),
            "modalidad": e.get("modalidad"),
            "descripcion": e.get("descripcion"),
            "logros": logros,
            "proyectos": e.get("proyectos"),
            "keywords": e.get("keywords", []),
            "perfiles": perfiles_de(e.get("perfiles_relevantes")),
            "links": e.get("links"),
        }
        item = limpiar({k: v for k, v in entrada.items() if v not in (None, [], "")}, e["id"])
        if completo(item, "experiencia", e["id"]):
            salida.append(item)
    salida.sort(key=lambda x: (x.get("actual", False), x.get("fin") or "9999", x.get("inicio") or ""), reverse=True)
    return salida


def proyectos(base: Path) -> list[dict]:
    datos = leer_frontmatter(base / "base" / "proyectos.md")["proyectos"]
    web = CONFIG.get("proyectos_web", {})
    ocultar, orden = set(web.get("ocultar", [])), web.get("orden", [])
    salida = []
    for p in datos:
        if p.get("publico") is not True or p["id"] in ocultar:
            continue
        ajuste = dict(CONFIG.get("proyectos_ajustes", {}).get(p["id"], {}))
        omitir = set(ajuste.pop("omitir", []))
        entrada = {k: v for k, v in p.items() if k not in ("publico", "perfiles_relevantes") and k not in omitir}
        entrada.update(ajuste)
        if not repo_publico(entrada.get("repo")):
            entrada.pop("repo", None)
        entrada.update(rango(p.get("fechas", "")))
        entrada["perfiles"] = perfiles_de(p.get("perfiles_relevantes"))
        entrada["orden"] = orden.index(p["id"]) + 1 if p["id"] in orden else 999
        item = limpiar(entrada, p["id"])
        if completo(item, "proyectos", p["id"]):
            salida.append(item)
    salida.sort(key=lambda x: (x.get("fin") or x.get("inicio") or "", x.get("actual", False)), reverse=True)
    salida.sort(key=lambda x: x["orden"])
    return salida


def publicaciones(base: Path) -> dict:
    datos = leer_frontmatter(base / "base" / "publicaciones.md")["publicaciones"]
    secciones = [
        "papers_peer_reviewed", "preprints", "documentos_de_trabajo", "trabajos_congresos",
        "informes_tecnicos", "software", "material_docente", "otras_actividades", "reconocimientos",
    ]
    salida = {}
    for s in secciones:
        items = datos.get(s, [])
        limpios = []
        for i, it in enumerate(items):
            if isinstance(it, dict) and "notas" in it:
                it = {**it, "resumen": it["notas"]}
                del it["notas"]
            item = limpiar(it, f"publicaciones.{s}[{i}]")
            if isinstance(item, dict) and s not in ("otras_actividades", "material_docente"):
                if not completo(item, "publicaciones", f"publicaciones.{s}[{i}]"):
                    continue
            if item:
                limpios.append(item)
        salida[s] = limpios
    return salida


def formacion(base: Path) -> dict:
    datos = leer_frontmatter(base / "base" / "educacion.md")["educacion"]
    salida = {}
    for s in ("titulos", "posgrado_especializacion", "certificaciones", "actividades_docencia_divulgacion"):
        items = [x for x in datos.get(s, []) if not (isinstance(x, dict) and x.get("mostrar_en_cv") is False)]
        salida[s] = limpiar(items, f"formacion.{s}")
    return salida


def skills(base: Path) -> dict:
    return limpiar(leer_frontmatter(base / "base" / "skills.md")["skills"], "skills")


def idiomas(base: Path) -> list[dict]:
    datos = leer_frontmatter(base / "base" / "idiomas.md")["idiomas"]
    salida = []
    for i in datos:
        if i.get("mostrar_en_cv") is False:
            continue
        salida.append(limpiar({
            "idioma": i["idioma"],
            "nivel": i.get("nivel_descripcion"),
            "codigo": i.get("nivel_codigo"),
            "certificado": i.get("certificado_nombre"),
        }, f"idiomas.{i['idioma']}"))
    return salida


def perfiles(base: Path) -> list[dict]:
    salida = []
    for p in CONFIG["perfiles"]:
        ruta = base / "perfiles" / f"{p['clave']}.md"
        fm = leer_frontmatter(ruta)
        cuerpo = leer_cuerpo(ruta)
        m = re.search(r"## Resumen Ejecutivo\s*\n(.+?)\n---", cuerpo, re.S)
        resumen = m.group(1).strip() if m else ""
        resumen = re.sub(r"\*\*(.+?)\*\*", r"\1", resumen)
        resumen = re.sub(r"\*(.+?)\*", r"\1", resumen)
        salida.append(limpiar({
            "slug": p["slug"],
            "clave": p["clave"],
            "color": p["color"],
            "titulo_corto": p["titulo_corto"],
            "titulo": fm.get("perfil"),
            "resumen": resumen,
            "keywords": fm.get("keywords_ats", [])[:12],
        }, f"perfiles.{p['slug']}"))
    return salida


# ------------------------------------------------------------- textos web

def cargar_textos(lang: str) -> dict:
    """Lee contenido/<lang>/*.yaml: textos de la web que sustituyen a los de la base, por id."""
    carpeta = RAIZ / "contenido" / lang
    textos = {}
    if carpeta.exists():
        for f in sorted(carpeta.glob("*.yaml")):
            textos[f.stem] = yaml.safe_load(f.read_text(encoding="utf-8")) or {}
    return textos


def aplicar_textos(ficheros: dict, textos: dict, lang: str, exigir: bool) -> dict:
    """Devuelve una copia de los datos con los textos de la web aplicados."""
    import copy
    salida = copy.deepcopy(ficheros)

    def por_id(nombre: str, clave: str, campos_traducibles: list[str]):
        capa = textos.get(nombre.removesuffix(".yaml"), {})
        for item in salida[nombre]:
            t = capa.get(item[clave])
            if t:
                item.update(t)
            elif exigir and any(item.get(c) for c in campos_traducibles):
                aviso(f"[{lang}] sin traducir: {nombre} {item[clave]}")

    por_id("experiencia.yaml", "id", ["rol", "descripcion"])
    por_id("proyectos.yaml", "id", ["descripcion"])
    roles = textos.get("roles_proyecto", {})
    for item in salida["proyectos.yaml"]:
        if item.get("rol") in roles:
            item["rol"] = roles[item["rol"]]
        elif exigir and item.get("rol"):
            aviso(f"[{lang}] rol sin traducir: proyectos {item.get('id')} {item['rol']!r}")
    por_id("perfiles.yaml", "slug", ["resumen"])
    por_id("idiomas.yaml", "idioma", ["nivel"])

    pub = textos.get("publicaciones", {})
    if "reconocimientos" in pub:
        salida["publicaciones.yaml"]["reconocimientos"] = pub["reconocimientos"]
    for seccion, items in pub.get("resumenes", {}).items():
        for it in salida["publicaciones.yaml"].get(seccion, []):
            if it.get("id") in items:
                it["resumen"] = items[it["id"]]

    form = textos.get("formacion", {})
    for seccion in ("titulos", "posgrado_especializacion"):
        for it in salida["formacion.yaml"].get(seccion, []):
            t = form.get(it.get("titulo"))
            if t:
                it.update(t)
            elif exigir:
                aviso(f"[{lang}] sin traducir: formación {it.get('titulo')}")

    # Certificaciones: por nombre exacto de la base (contenido/<lang>/certificaciones.yaml).
    cert = textos.get("certificaciones", {})
    for it in salida["formacion.yaml"].get("certificaciones", []):
        t = cert.get(it.get("nombre"))
        if t:
            it.update(t)
        elif exigir:
            aviso(f"[{lang}] sin traducir: certificación {it.get('nombre')}")

    # Competencias: por nombre exacto de la base (contenido/<lang>/skills.yaml).
    sk = textos.get("skills", {})
    for grupo, items in salida["skills.yaml"].items():
        for it in items:
            t = sk.get(it.get("nombre"))
            if t:
                it.update(t)
            elif exigir:
                aviso(f"[{lang}] sin traducir: competencia {grupo}/{it.get('nombre')}")

    # Publicaciones en español: el título original se mantiene y se añade la traducción.
    tit = pub.get("titulos", {})
    for seccion, items in salida["publicaciones.yaml"].items():
        if not isinstance(items, list):
            continue
        for it in items:
            if isinstance(it, dict) and it.get("titulo") in tit:
                it["titulo_traducido"] = tit[it["titulo"]]

    con = textos.get("contacto", {})
    salida["contacto.yaml"].update(con)
    # Los textos de la web también pasan por las reglas de publicación.
    return {k: limpiar(v, f"{lang}:{k}") for k, v in salida.items()}


# ------------------------------------------------------------------ salida

def volcar(datos) -> str:
    cabecera = "# GENERADO por scripts/sync_base.py desde la base de conocimiento. No editar a mano.\n"
    return cabecera + yaml.safe_dump(datos, allow_unicode=True, sort_keys=False, width=120)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base", required=True, type=Path, help="Ruta al repo cv-perfil-profesional")
    ap.add_argument("--salida", type=Path, default=RAIZ / "data")
    ap.add_argument("--check", action="store_true", help="No escribe; falla si algún fichero cambiaría")
    args = ap.parse_args()

    ficheros = {
        "contacto.yaml": contacto(args.base),
        "experiencia.yaml": experiencia(args.base),
        "proyectos.yaml": proyectos(args.base),
        "publicaciones.yaml": publicaciones(args.base),
        "formacion.yaml": formacion(args.base),
        "skills.yaml": skills(args.base),
        "idiomas.yaml": idiomas(args.base),
        "perfiles.yaml": perfiles(args.base),
    }

    por_idioma = {
        "es": aplicar_textos(ficheros, cargar_textos("es"), "es", exigir=False),
        "en": aplicar_textos(ficheros, cargar_textos("en"), "en", exigir=True),
    }

    cambios = []
    for lang, datos_lang in por_idioma.items():
        (args.salida / lang).mkdir(parents=True, exist_ok=True)
        for nombre, datos in datos_lang.items():
            ruta = args.salida / lang / nombre
            nuevo = volcar(datos)
            if not ruta.exists() or ruta.read_text(encoding="utf-8") != nuevo:
                cambios.append(f"{lang}/{nombre}")
                if not args.check:
                    ruta.write_text(nuevo, encoding="utf-8")

    for a in AVISOS:
        print(f"aviso: {a}")
    print(f"{len(ficheros) * len(por_idioma)} ficheros, {len(cambios)} con cambios: {', '.join(cambios) or '—'}")
    if args.check and cambios:
        print("data/ no está al día con la base: ejecuta sync_base.py sin --check", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
