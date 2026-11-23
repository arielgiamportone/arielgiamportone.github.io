"""Genera el diagrama del flujo de inspection-photo-archiver (ES y EN).

Uso: python3 scripts/diagramas/archivador_fotos.py
"""
from pathlib import Path
from xml.sax.saxutils import escape

import registro_activos as base

DESTINO = Path(__file__).resolve().parents[2] / "content/proyectos/inspection-photo-archiver"

TEXTOS = {
    "es": {
        "titulo": "Flujo del archivador de fotos",
        "cajas": [
            ("Excel en la bandeja", ["el técnico deja la exportación", "en la carpeta de su línea"]),
            ("Vigilante por sondeo", ["espera a que termine", "de sincronizarse"]),
            ("Detección del esquema", ["por la forma de las hojas,", "no por su nombre"]),
            ("Descarga", ["cookie de sesión", "reintentos"]),
            ("Archivo compartido", ["JPEG con nombre y carpeta", "decididos por el perfil"]),
            ("Registro acumulado", ["foto → origen", "enlaces relativos"]),
            ("Correo", ["inicio · éxito", "parcial · error"]),
        ],
        "perfiles": ("Perfiles JSON versionados", ["nombres · niveles de carpeta · registro · avisos", "un proyecto nuevo = un perfil, sin tocar código"]),
    },
    "en": {
        "titulo": "Photo archiver flow",
        "cajas": [
            ("Export in the inbox", ["the technician drops the Excel", "in their line's folder"]),
            ("Polling watcher", ["waits until the file", "has finished syncing"]),
            ("Schema detection", ["by the shape of the sheets,", "not by their names"]),
            ("Download", ["session cookie", "retries"]),
            ("Shared archive", ["JPEG named and filed", "as the profile says"]),
            ("Cumulative ledger", ["photo → source", "relative links"]),
            ("E-mail", ["start · success", "partial · error"]),
        ],
        "perfiles": ("Versioned JSON profiles", ["names · folder levels · ledger · alerts", "a new project = a profile, no code change"]),
    },
}


def svg(lang):
    t = TEXTOS[lang]
    c = base.caja
    p = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 430" width="1200" height="430" role="img" aria-labelledby="t"><title id="t">{escape(t["titulo"])}</title>', base.ESTILO,
         f'<text x="600" y="34" font-size="22" font-weight="800" text-anchor="middle">{escape(t["titulo"])}</text>']
    pos = [(30, 70), (330, 70), (630, 70), (930, 70), (630, 210), (330, 210), (30, 210)]
    clases = ["box", "box", "boxa", "box", "boxv", "boxv", "box"]
    for (x, y), (tit, lin), cls in zip(pos, t["cajas"], clases):
        p.append(c(x, y, 240, 90, tit, lin, cls=cls))
    p += ['<path d="M270 115 L328 115" class="arrow"/>', '<path d="M570 115 L628 115" class="arrow"/>',
          '<path d="M870 115 L928 115" class="arrow"/>', '<path d="M1050 160 C1050 230 900 255 872 255" class="arrow"/>',
          '<path d="M630 255 L572 255" class="arrow"/>', '<path d="M330 255 L272 255" class="arrow"/>']
    p.append(c(330, 335, 540, 80, *t["perfiles"], cls="boxa"))
    p += ['<path d="M450 335 L450 302" class="dash"/>', '<path d="M750 335 L750 302" class="dash"/>', '</svg>']
    return "\n".join(p)


if __name__ == "__main__":
    (DESTINO / "flujo.svg").write_text(svg("es"), encoding="utf-8")
    (DESTINO / "flujo-en.svg").write_text(svg("en"), encoding="utf-8")
    print("ok")
