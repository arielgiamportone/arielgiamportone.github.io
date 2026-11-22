"""Genera el diagrama de arquitectura de multi-tenant-asset-register (ES y EN).

Uso: python3 scripts/diagramas/registro_activos.py
Escribe content/proyectos/multi-tenant-asset-register/arquitectura{,-en}.svg
"""
from pathlib import Path
from xml.sax.saxutils import escape

DESTINO = Path(__file__).resolve().parents[2] / "content/proyectos/multi-tenant-asset-register"

ESTILO = """<style>
  :root { --ink: #1b2a3a; --muted: #5b6b7b; --box: #ffffff; --boxline: #b9c8d8; --accent: #2563eb; --accent2: #059669; --soft: #eef4fb; }
  @media (prefers-color-scheme: dark) {
    :root { --ink: #e6edf3; --muted: #9fb0c0; --box: #18212b; --boxline: #3a4b5d; --accent: #60a5fa; --accent2: #34d399; --soft: #13202e; }
  }
  text { font-family: "DejaVu Sans", "Segoe UI", Arial, sans-serif; fill: var(--ink); }
  .muted { fill: var(--muted); }
  .box { fill: var(--box); stroke: var(--boxline); stroke-width: 1.5; }
  .boxa { fill: var(--box); stroke: var(--accent); stroke-width: 2.2; }
  .boxv { fill: var(--box); stroke: var(--accent2); stroke-width: 2.2; }
  .zona { fill: var(--soft); stroke: none; }
  .arrow { stroke: var(--muted); stroke-width: 1.8; fill: none; marker-end: url(#arrow); }
  .dash { stroke: var(--muted); stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#arrow); }
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill: var(--muted)"/></marker></defs>"""

TEXTOS = {
    "es": {
        "titulo": "Arquitectura del registro de activos multi-tenant",
        "fuentes": ("Fuentes heredadas", ["hojas de cálculo · Access", "ficheros de la app antigua", "escrituras (OCR + LLM local)", "catastro y callejero (REST)"]),
        "etl": ("ETL", ["~20 extractores", "normalizar · deduplicar · validar"]),
        "dialecto": ("Capa de dialecto SQL", ["las mismas ~1.200 sentencias", "en SQLite o en PostgreSQL"]),
        "sqlite": ("Un fichero SQLite", ["instalación en el cliente", "(ejecutable Windows)"]),
        "pg": ("PostgreSQL", ["un esquema por sede", "~35 sedes en un servidor"]),
        "motor": ("Motor de valoración", ["amortización · revalorización", "memoria de cálculo por cifra"]),
        "web": ("Backoffice FastAPI", ["permisos por sección · CSRF", "módulos activables por sede"]),
        "salidas": ("Salidas", ["informes Word y Excel · etiquetas", "portal de transparencia estático"]),
        "control": ("Conciliación con el cierre anterior", ["por cuenta y al céntimo antes de abrir la sede"]),
    },
    "en": {
        "titulo": "Architecture of the multi-tenant asset register",
        "fuentes": ("Legacy sources", ["spreadsheets · Access", "legacy application files", "scanned deeds (OCR + local LLM)", "cadastre and street maps (REST)"]),
        "etl": ("ETL", ["~20 extractors", "normalise · dedup · validate"]),
        "dialecto": ("SQL dialect layer", ["the same ~1,200 statements", "on SQLite or PostgreSQL"]),
        "sqlite": ("One SQLite file", ["on-premise install", "(Windows executable)"]),
        "pg": ("PostgreSQL", ["one schema per tenant", "~35 tenants on one server"]),
        "motor": ("Valuation engine", ["depreciation · revaluation", "calculation memo per figure"]),
        "web": ("FastAPI back office", ["per-section permissions · CSRF", "per-tenant feature flags"]),
        "salidas": ("Outputs", ["Word and Excel reports · labels", "static transparency portal"]),
        "control": ("Reconciliation with the legacy closing", ["per account, to the cent, before a tenant opens"]),
    },
}


def caja(x, y, w, h, titulo, lineas, cls="box"):
    cx = x + w / 2
    out = [f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" class="{cls}"/>',
           f'<text x="{cx}" y="{y + 26}" font-size="16" font-weight="700" text-anchor="middle">{escape(titulo)}</text>']
    for i, l in enumerate(lineas):
        out.append(f'<text x="{cx}" y="{y + 48 + i * 19}" font-size="13" text-anchor="middle" class="muted">{escape(l)}</text>')
    return "".join(out)


def svg(lang):
    t = TEXTOS[lang]
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" width="1200" height="520" role="img" aria-labelledby="t"><title id="t">{escape(t["titulo"])}</title>', ESTILO,
         f'<text x="600" y="34" font-size="22" font-weight="800" text-anchor="middle">{escape(t["titulo"])}</text>',
         caja(30, 70, 260, 140, *t["fuentes"]),
         caja(30, 250, 260, 90, *t["etl"]),
         '<rect x="330" y="60" width="300" height="410" rx="16" class="zona"/>',
         caja(350, 75, 260, 90, *t["dialecto"], cls="boxa"),
         caja(350, 205, 260, 90, *t["sqlite"]),
         caja(350, 330, 260, 90, *t["pg"]),
         caja(680, 75, 240, 100, *t["motor"], cls="boxv"),
         caja(680, 215, 240, 100, *t["web"]),
         caja(680, 355, 240, 100, *t["salidas"]),
         ]
    # Caja de control con texto partido en varias líneas
    titulo = t["control"][0].split(" ")
    mitad = (len(titulo) + 1) // 2
    p.append('<rect x="950" y="185" width="220" height="140" rx="12" class="boxv"/>')
    p.append(f'<text x="1060" y="214" font-size="15" font-weight="700" text-anchor="middle">{escape(" ".join(titulo[:mitad]))}</text>')
    p.append(f'<text x="1060" y="234" font-size="15" font-weight="700" text-anchor="middle">{escape(" ".join(titulo[mitad:]))}</text>')
    sub = t["control"][1][0].split(" ")
    m2 = (len(sub) + 1) // 2
    p.append(f'<text x="1060" y="264" font-size="13" text-anchor="middle" class="muted">{escape(" ".join(sub[:m2]))}</text>')
    p.append(f'<text x="1060" y="283" font-size="13" text-anchor="middle" class="muted">{escape(" ".join(sub[m2:]))}</text>')
    p += [
        '<path d="M160 210 L160 248" class="arrow"/>',
        '<path d="M290 295 L348 120" class="arrow"/>',
        '<path d="M480 165 L480 203" class="arrow"/>',
        '<path d="M365 165 C338 230 338 330 348 368" class="arrow"/>',
        '<path d="M610 120 L678 125" class="arrow"/>',
        '<path d="M610 120 L678 262" class="arrow"/>',
        '<path d="M610 120 L678 400" class="arrow"/>',
        '<path d="M920 125 L948 220" class="arrow"/>',
        '</svg>',
    ]
    return "\n".join(p)


if __name__ == "__main__":
    (DESTINO / "arquitectura.svg").write_text(svg("es"), encoding="utf-8")
    (DESTINO / "arquitectura-en.svg").write_text(svg("en"), encoding="utf-8")
    print("ok")
