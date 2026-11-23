"""Genera el diagrama de arquitectura de field-inspections-dashboard (ES y EN).

Uso: python3 scripts/diagramas/panel_inspecciones.py
"""
from pathlib import Path
from xml.sax.saxutils import escape

import registro_activos as base  # mismo estilo y misma función caja()

DESTINO = Path(__file__).resolve().parents[2] / "content/proyectos/field-inspections-dashboard"

TEXTOS = {
    "es": {
        "titulo": "Arquitectura del panel de inspecciones",
        "saas": ("App de inspecciones", ["SaaS de terceros · API REST", "checklists y fotos"]),
        "maestro": ("Datos maestros", ["Excel en Microsoft 365", "vía Graph API"]),
        "extr": ("Extractor Python", ["incremental cada 3 h", "pandas · httpx"]),
        "csv": ("Estrella en CSV", ["histórico en caché", "+ ventana viva de 3 meses"]),
        "render": ("Generador estático", ["Plotly + JS sin framework", "build cliente ≠ build interno"]),
        "inf": ("Informes", ["Word mensual", "Excel de certificación"]),
        "swa": ("Static Web App", ["login con Entra ID", "roles por lista permitida"]),
        "fn": ("Funciones serverless", ["proxy de fotos y de ficheros · roles", "el token del SaaS solo vive aquí"]),
        "ci": ("GitHub Actions", ["cron + botón bajo demanda", "~200 comprobaciones antes"]),
        "token": "token en el servidor",
    },
    "en": {
        "titulo": "Architecture of the inspections dashboard",
        "saas": ("Inspection app", ["third-party SaaS · REST API", "checklists and photos"]),
        "maestro": ("Master data", ["Excel in Microsoft 365", "via Graph API"]),
        "extr": ("Python extractor", ["incremental every 3 h", "pandas · httpx"]),
        "csv": ("CSV star schema", ["cached history", "+ 3-month live window"]),
        "render": ("Static renderer", ["Plotly + vanilla JS", "client build ≠ internal build"]),
        "inf": ("Reports", ["monthly Word", "certification Excel"]),
        "swa": ("Static Web App", ["Entra ID sign-in", "roles from an allow-list"]),
        "fn": ("Serverless functions", ["photo and file proxies · roles", "the SaaS token only lives here"]),
        "ci": ("GitHub Actions", ["cron + on-demand button", "~200 checks run first"]),
        "token": "token stays server-side",
    },
}


def svg(lang):
    t = TEXTOS[lang]
    c = base.caja
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 500" width="1200" height="500" role="img" aria-labelledby="t"><title id="t">{escape(t["titulo"])}</title>', base.ESTILO,
         f'<text x="600" y="34" font-size="22" font-weight="800" text-anchor="middle">{escape(t["titulo"])}</text>',
         c(30, 70, 230, 90, *t["saas"]),
         c(30, 200, 230, 90, *t["maestro"]),
         c(30, 360, 230, 90, *t["ci"]),
         c(320, 135, 220, 90, *t["extr"], cls="boxa"),
         c(600, 135, 220, 90, *t["csv"]),
         c(880, 70, 290, 90, *t["render"], cls="boxv"),
         c(880, 200, 290, 90, *t["inf"]),
         c(600, 330, 220, 90, *t["swa"]),
         c(880, 330, 290, 90, *t["fn"], cls="boxv"),
         '<path d="M260 115 L318 165" class="arrow"/>',
         '<path d="M260 245 L318 200" class="arrow"/>',
         '<path d="M260 395 C300 395 330 300 360 227" class="arrow"/>',
         '<path d="M540 180 L598 180" class="arrow"/>',
         '<path d="M820 165 L878 120" class="arrow"/>',
         '<path d="M820 195 L878 240" class="arrow"/>',
         '<path d="M885 158 L765 328" class="arrow"/>',
         '<path d="M820 375 L878 375" class="arrow"/>',
         '</svg>']
    return "\n".join(p)


if __name__ == "__main__":
    (DESTINO / "arquitectura.svg").write_text(svg("es"), encoding="utf-8")
    (DESTINO / "arquitectura-en.svg").write_text(svg("en"), encoding="utf-8")
    print("ok")
