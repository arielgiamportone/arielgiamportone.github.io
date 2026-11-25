"""Genera las portadas ilustradas por código de las tarjetas de proyecto.

Cada portada es un SVG de 1600×900 con trazos del estilo de la web. Se escribe como partial
(layouts/partials/portadas/<id>.html) para ir en línea: así usa las variables CSS del tema
(--c es el color del perfil principal) y se ve bien en claro y en oscuro sin dos ficheros.

Clases que usa el dibujo (definidas en assets/css/main.css):
  pt-fondo  fondo teñido     pt-linea  trazo del color del perfil   pt-suave  trazo tenue
  pt-relleno relleno de color  pt-claro  relleno de superficie       pt-tenue  relleno tenue

Uso: python3 scripts/gen_portadas.py   (determinista: semilla fija por portada)
"""
import math
import random
from pathlib import Path

W, H = 1600, 900
DESTINO = Path(__file__).resolve().parent.parent / "layouts" / "partials" / "portadas"


def f(v):
    return f"{v:.0f}"


def svg(cuerpo: str) -> str:
    return (f'<svg class="portada-svg" viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" '
            f'aria-hidden="true" focusable="false"><rect class="pt-fondo" width="{W}" height="{H}"/>'
            f'{cuerpo}</svg>')


def rejilla_suave(paso=80):
    d = " ".join(f"M{x} 0V{H}" for x in range(0, W + 1, paso)) + " " + " ".join(f"M0 {y}H{W}" for y in range(0, H + 1, paso))
    return f'<path class="pt-suave" d="{d}" stroke-width="1"/>'


def lineas_texto(x, y, anchos, alto=12, sep=26, clase="pt-tenue"):
    return "".join(f'<rect class="{clase}" x="{x}" y="{y + i * sep}" width="{w}" height="{alto}" rx="{alto / 2}"/>' for i, w in enumerate(anchos))


# ------------------------------------------------------------------ portadas
def catastro():
    random.seed(3)
    cols, rows = 11, 7
    P = [[(-60 + c * 170 + random.uniform(-35, 35), -40 + r * 150 + random.uniform(-30, 30)) for c in range(cols)] for r in range(rows)]
    o = []
    for (r, c), op in [((2, 6), .55), ((3, 6), .55), ((2, 7), .55), ((4, 3), .25)]:
        a, b, d, e = P[r][c], P[r][c + 1], P[r + 1][c + 1], P[r + 1][c]
        o.append(f'<polygon class="pt-relleno" fill-opacity="{op}" points="{f(a[0])},{f(a[1])} {f(b[0])},{f(b[1])} {f(d[0])},{f(d[1])} {f(e[0])},{f(e[1])}"/>')
    g = ["M" + " L".join(f"{f(x)},{f(y)}" for x, y in P[r]) for r in range(rows)]
    g += ["M" + " L".join(f"{f(P[r][c][0])},{f(P[r][c][1])}" for r in range(rows)) for c in range(cols)]
    o.append(f'<path class="pt-linea" stroke-opacity=".45" stroke-width="3" d="{" ".join(g)}"/>')
    calle = "M-20 560 C300 470 620 640 980 520 S1440 420 1640 470"
    o.append(f'<path class="pt-claro-trazo" stroke-width="34" stroke-linecap="round" d="{calle}"/>')
    o.append(f'<path class="pt-linea" stroke-opacity=".35" stroke-width="2" stroke-dasharray="18 14" d="{calle}"/>')
    cx, cy = (P[2][6][0] + P[3][7][0]) / 2, (P[2][6][1] + P[3][7][1]) / 2
    o.append(f'<g transform="translate({f(cx)} {f(cy - 60)})"><path class="pt-relleno" d="M0 95 C-10 70 -52 40 -52 0 A52 52 0 1 1 52 0 C52 40 10 70 0 95z"/><circle class="pt-claro" r="20"/></g>')
    for i, (x, y) in enumerate([(120, 90), (160, 190), (200, 290)]):
        o.append(f'<g opacity="{.95 - i * .18:.2f}"><rect class="pt-claro pt-linea" stroke-opacity=".35" stroke-width="2" x="{x}" y="{y}" width="330" height="78" rx="14"/>'
                 f'<circle class="pt-relleno" fill-opacity="{.8 - i * .2:.1f}" cx="{x + 40}" cy="{y + 39}" r="16"/>'
                 f'<rect class="pt-relleno" fill-opacity=".45" x="{x + 72}" y="{y + 26}" width="{200 - i * 30}" height="10" rx="5"/>'
                 f'<rect class="pt-relleno" fill-opacity=".25" x="{x + 72}" y="{y + 46}" width="{140 - i * 20}" height="8" rx="4"/></g>')
    o.append(f'<path class="pt-linea" stroke-width="4" stroke-dasharray="2 12" stroke-linecap="round" d="M455 160 C620 160 700 230 {f(cx - 70)} {f(cy - 60)}"/>')
    return svg("".join(o))


def gs1():
    random.seed(5)
    o = [rejilla_suave()]
    # etiqueta
    x, y, w, h = 520, 210, 760, 480
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="4" x="{x}" y="{y}" width="{w}" height="{h}" rx="28"/>')
    o.append(f'<circle class="pt-claro pt-linea" stroke-width="4" cx="{x + 46}" cy="{y + 46}" r="16"/>')
    # código de barras
    bx = x + 70
    for i in range(46):
        ancho = random.choice([3, 5, 8])
        if random.random() < .72:
            o.append(f'<rect class="pt-relleno" x="{bx}" y="{y + 110}" width="{ancho}" height="170"/>')
        bx += ancho + 4
    o.append(lineas_texto(x + 70, y + 310, [300], 14, clase="pt-relleno"))
    # QR
    qx, qy, m = x + 500, y + 100, 18
    for r in range(11):
        for c in range(11):
            esquina = (r < 3 and c < 3) or (r < 3 and c > 7) or (r > 7 and c < 3)
            if esquina or random.random() < .45:
                o.append(f'<rect class="pt-relleno" x="{qx + c * m}" y="{qy + r * m}" width="{m - 2}" height="{m - 2}" rx="2"/>')
    # antena RFID (espiral rectangular)
    d, ax, ay = [], x + 120, y + 360
    for k in range(5):
        d.append(f"M{ax + k * 12} {ay + k * 10} h{520 - k * 24} v{90 - k * 20} h{-(520 - k * 24)} z")
    o.append(f'<path class="pt-linea" stroke-width="3" stroke-opacity=".7" d="{" ".join(d)}"/>')
    o.append(f'<rect class="pt-relleno" x="{ax + 236}" y="{ay + 34}" width="48" height="26" rx="4"/>')
    # cuatro formas, a la izquierda
    for i in range(4):
        cy = 230 + i * 130
        o.append(f'<circle class="pt-relleno" fill-opacity="{.85 - i * .15:.2f}" cx="230" cy="{cy}" r="34"/>')
        o.append(f'<path class="pt-linea" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" d="M270 {cy} C390 {cy} 420 450 {x} 450"/>')
    return svg("".join(o))


def paradox():
    random.seed(9)
    o = [rejilla_suave()]
    # tabla antigua (izquierda): celdas desiguales y discontinuas
    x0, y0 = 120, 200
    for r in range(9):
        for c in range(5):
            if random.random() < .9:
                o.append(f'<rect class="pt-linea" stroke-opacity=".5" stroke-dasharray="6 5" stroke-width="2" x="{x0 + c * 92}" y="{y0 + r * 52}" width="86" height="46"/>')
            if random.random() < .5:
                o.append(f'<rect class="pt-tenue" x="{x0 + c * 92 + 12}" y="{y0 + r * 52 + 18}" width="{random.randint(20, 60)}" height="10" rx="5"/>')
    # flecha
    o.append('<path class="pt-linea" stroke-width="6" stroke-linecap="round" d="M640 450 H930 M900 420 l34 30 -34 30"/>')
    for i in range(5):
        o.append(f'<circle class="pt-relleno" fill-opacity="{.3 + i * .14:.2f}" cx="{680 + i * 50}" cy="400" r="6"/>')
    # tabla moderna (derecha)
    x1, y1 = 1000, 200
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="3" x="{x1}" y="{y1}" width="480" height="470" rx="18"/>')
    o.append(f'<path class="pt-relleno" d="M{x1} {y1 + 18} a18 18 0 0 1 18 -18 h444 a18 18 0 0 1 18 18 v52 h-480z"/>')
    for r in range(1, 9):
        y = y1 + 70 + (r - 1) * 50
        o.append(f'<path class="pt-linea" stroke-opacity=".25" stroke-width="2" d="M{x1} {y + 50} h480"/>')
        o.append(lineas_texto(x1 + 30, y + 20, [110], 10))
        o.append(lineas_texto(x1 + 180, y + 20, [random.randint(80, 150)], 10))
        o.append(f'<circle class="pt-relleno" fill-opacity=".7" cx="{x1 + 440}" cy="{y + 25}" r="7"/>')
    return svg("".join(o))


def informes():
    random.seed(11)
    o = [rejilla_suave()]
    for i, (dx, rot) in enumerate([(0, -8), (60, -2), (120, 5)]):
        x, y = 520 + dx * 2, 120 + i * 20
        o.append(f'<g transform="rotate({rot} {x + 260} {y + 340})"><rect class="pt-claro pt-linea" stroke-width="3" x="{x}" y="{y}" width="520" height="680" rx="16"/>'
                 f'<rect class="pt-relleno" x="{x}" y="{y}" width="520" height="70" rx="16"/>'
                 f'{lineas_texto(x + 40, y + 110, [300, 380, 260], 12)}'
                 + "".join(f'<rect class="pt-relleno" fill-opacity="{.35 + k * .1:.2f}" x="{x + 50 + k * 70}" y="{y + 520 - hh}" width="44" height="{hh}" rx="4"/>' for k, hh in enumerate([120, 180, 150, 230, 200, 260]))
                 + f'<polyline class="pt-linea" stroke-width="4" points="{x + 60},{y + 330} {x + 160},{y + 290} {x + 260},{y + 310} {x + 360},{y + 250} {x + 460},{y + 230}"/>'
                 + f'{lineas_texto(x + 40, y + 580, [420, 360], 10)}</g>')
    for i in range(4):
        o.append(f'<circle class="pt-relleno" fill-opacity="{.25 + i * .18:.2f}" cx="{200 + i * 70}" cy="450" r="22"/>')
    o.append('<path class="pt-linea" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" d="M450 450 H520"/>')
    return svg("".join(o))


def casos():
    random.seed(13)
    o = [rejilla_suave()]
    paneles = [(110, 170), (590, 130), (1070, 170)]
    for x, y in paneles:
        o.append(f'<rect class="pt-claro pt-linea" stroke-width="3" x="{x}" y="{y}" width="420" height="560" rx="22"/>')
    # 1: registro de activos
    x, y = paneles[0]
    for r in range(7):
        o.append(f'<rect class="pt-relleno" fill-opacity=".55" x="{x + 40}" y="{y + 60 + r * 66}" width="40" height="40" rx="8"/>')
        o.append(lineas_texto(x + 100, y + 66 + r * 66, [random.randint(150, 260), random.randint(90, 160)], 10, 18))
    # 2: mapa con inspecciones
    x, y = paneles[1]
    calles = f"M{x + 20} {y + 200} C{x + 160} {y + 160} {x + 260} {y + 280} {x + 400} {y + 230} M{x + 120} {y + 40} C{x + 140} {y + 220} {x + 240} {y + 360} {x + 220} {y + 540} M{x + 20} {y + 420} H{x + 400}"
    o.append(f'<path class="pt-linea" stroke-opacity=".35" stroke-width="14" stroke-linecap="round" d="{calles}"/>')
    for px, py in [(90, 120), (300, 140), (200, 330), (340, 380), (110, 470)]:
        o.append(f'<g transform="translate({x + px} {y + py})"><path class="pt-relleno" d="M0 40 C-5 30 -24 18 -24 0 A24 24 0 1 1 24 0 C24 18 5 30 0 40z"/><circle class="pt-claro" r="9"/></g>')
    # 3: fotos ordenadas en carpetas
    x, y = paneles[2]
    for r in range(3):
        for c in range(3):
            xx, yy = x + 40 + c * 120, y + 70 + r * 150
            o.append(f'<rect class="pt-tenue" x="{xx}" y="{yy}" width="100" height="100" rx="10"/>')
            o.append(f'<path class="pt-relleno" fill-opacity=".6" d="M{xx + 10} {yy + 86} l26 -34 18 20 16 -14 20 28z"/><circle class="pt-relleno" fill-opacity=".6" cx="{xx + 72}" cy="{yy + 28}" r="9"/>')
    return svg("".join(o))


def placas():
    o = [rejilla_suave()]
    x, y, w, h = 200, 200, 760, 500
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="5" x="{x}" y="{y}" width="{w}" height="{h}" rx="20"/>')
    for cx, cy in [(x + 30, y + 30), (x + w - 30, y + 30), (x + 30, y + h - 30), (x + w - 30, y + h - 30)]:
        o.append(f'<circle class="pt-relleno" fill-opacity=".6" cx="{cx}" cy="{cy}" r="10"/>')
    filas = [(70, [260]), (150, [160, 220]), (220, [140, 180]), (290, [200, 120]), (360, [120, 240]), (430, [300])]
    cajas = []
    for dy, anchos in filas:
        xx = x + 80
        for a in anchos:
            o.append(f'<rect class="pt-relleno" fill-opacity=".45" x="{xx}" y="{y + dy}" width="{a}" height="24" rx="4"/>')
            cajas.append((xx - 10, y + dy - 10, a + 20, 44))
            xx += a + 60
    for bx, by, bw, bh in cajas[1:6]:
        o.append(f'<rect class="pt-linea" stroke-width="3" stroke-dasharray="10 6" x="{bx}" y="{by}" width="{bw}" height="{bh}" rx="6"/>')
    # campos extraídos a la derecha
    for i in range(5):
        yy = 230 + i * 92
        o.append(f'<path class="pt-linea" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round" d="M{x + w + 10} {yy + 30} H1100"/>')
        o.append(f'<rect class="pt-claro pt-linea" stroke-opacity=".5" stroke-width="2" x="1100" y="{yy}" width="330" height="62" rx="12"/>')
        o.append(lineas_texto(1124, yy + 18, [90], 10, clase="pt-relleno"))
        o.append(lineas_texto(1124, yy + 36, [200 - i * 18], 10))
    return svg("".join(o))


def simplex():
    random.seed(17)
    o = [rejilla_suave()]
    # región factible
    pts = [(160, 760), (160, 420), (330, 230), (620, 210), (800, 430), (740, 760)]
    o.append(f'<polygon class="pt-relleno" fill-opacity=".18" points="{" ".join(f"{x},{y}" for x, y in pts)}"/>')
    o.append(f'<polygon class="pt-linea" stroke-width="4" points="{" ".join(f"{x},{y}" for x, y in pts)}"/>')
    for x, y in pts:
        o.append(f'<circle class="pt-claro pt-linea" stroke-width="4" cx="{x}" cy="{y}" r="11"/>')
    o.append('<circle class="pt-relleno" cx="620" cy="210" r="18"/>')
    for k in range(4):
        o.append(f'<path class="pt-linea" stroke-opacity="{.2 + k * .15:.2f}" stroke-width="3" stroke-dasharray="14 10" d="M{80 + k * 140} 860 L{520 + k * 140} 100"/>')
    o.append('<path class="pt-linea" stroke-width="5" stroke-linecap="round" d="M330 600 L560 300 M528 302 l32 -2 -6 32"/>')
    # nube de puntos y modelo
    for _ in range(70):
        x = random.uniform(960, 1480)
        y = 760 - (x - 960) * .9 + random.gauss(0, 55)
        o.append(f'<circle class="pt-relleno" fill-opacity=".55" cx="{f(x)}" cy="{f(y)}" r="7"/>')
    o.append('<path class="pt-linea" stroke-width="5" d="M940 780 C1100 640 1250 450 1500 290"/>')
    o.append('<path class="pt-linea" stroke-opacity=".3" stroke-width="2" d="M920 820 H1520 M920 820 V180"/>')
    return svg("".join(o))


# Provisionales hasta que lleguen las fotos reales.
def rov():
    o = [rejilla_suave()]
    o.append('<path class="pt-linea" stroke-opacity=".3" stroke-width="3" d="M0 160 C300 130 500 190 800 160 S1300 130 1600 160"/>')
    o.append('<path class="pt-linea" stroke-width="3" stroke-dasharray="4 10" d="M800 160 C760 260 840 300 800 360"/>')
    x, y = 560, 360
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="6" x="{x}" y="{y}" width="480" height="260" rx="30"/>')
    o.append(f'<path class="pt-linea" stroke-width="4" d="M{x} {y + 130} h480 M{x + 160} {y} v260 M{x + 320} {y} v260"/>')
    for cx, cy in [(x - 50, y + 70), (x - 50, y + 190), (x + 530, y + 70), (x + 530, y + 190)]:
        o.append(f'<rect class="pt-relleno" fill-opacity=".7" x="{cx - 40}" y="{cy - 30}" width="80" height="60" rx="16"/>')
    o.append(f'<circle class="pt-relleno" cx="{x + 240}" cy="{y + 300}" r="34"/><circle class="pt-claro" cx="{x + 240}" cy="{y + 300}" r="14"/>')
    o.append(f'<path class="pt-relleno" fill-opacity=".12" d="M{x + 240} {y + 330} L{x + 40} 900 H{x + 440}z"/>')
    return svg("".join(o))


def navegacion():
    random.seed(19)
    o = [rejilla_suave()]
    x, y = 330, 170
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="6" x="{x}" y="{y}" width="940" height="560" rx="26"/>')
    for k in range(7):
        pts = " ".join(f"{f(x + 40 + i * 30)},{f(y + 90 + k * 64 + 18 * math.sin(i / 3 + k))}" for i in range(30))
        o.append(f'<polyline class="pt-linea" stroke-opacity=".3" stroke-width="2" points="{pts}"/>')
    ruta = [(x + 120, y + 460), (x + 300, y + 380), (x + 470, y + 410), (x + 640, y + 250), (x + 820, y + 160)]
    o.append(f'<polyline class="pt-linea" stroke-width="5" stroke-dasharray="16 10" points="{" ".join(f"{a},{b}" for a, b in ruta)}"/>')
    for a, b in ruta[1:-1]:
        o.append(f'<circle class="pt-claro pt-linea" stroke-width="4" cx="{a}" cy="{b}" r="12"/>')
    a, b = ruta[0]
    o.append(f'<path class="pt-relleno" d="M{a - 30} {b + 16} h60 l-12 18 h-36z M{a} {b + 14} v-44 l26 34z"/>')
    o.append(f'<rect class="pt-relleno" x="{x + 420}" y="{y + 730}" width="100" height="40" rx="6"/>')
    return svg("".join(o))


def puerto():
    o = [rejilla_suave()]
    o.append('<path class="pt-linea" stroke-opacity=".35" stroke-width="3" d="M0 640 C200 620 400 660 600 640 S1000 620 1600 640"/>')
    o.append('<rect class="pt-relleno" fill-opacity=".25" x="0" y="600" width="760" height="40"/>')
    # grúa
    o.append('<path class="pt-linea" stroke-width="8" stroke-linejoin="round" d="M300 600 V220 M260 600 L300 220 L340 600 M300 230 H760 M300 230 L200 300 M720 230 V420"/>')
    o.append('<rect class="pt-relleno" x="690" y="420" width="60" height="44" rx="4"/>')
    # buque
    o.append('<path class="pt-claro pt-linea" stroke-width="6" d="M820 560 H1440 L1380 650 H880z"/>')
    o.append('<rect class="pt-claro pt-linea" stroke-width="5" x="1240" y="450" width="130" height="110" rx="8"/>')
    for i in range(5):
        o.append(f'<rect class="pt-relleno" fill-opacity="{.4 + (i % 2) * .3:.1f}" x="{900 + i * 64}" y="490" width="56" height="70" rx="4"/>')
    # red de vínculos
    nodos = [(160, 140), (520, 110), (980, 170), (1380, 130)]
    for (a, b), (c, d) in zip(nodos, nodos[1:]):
        o.append(f'<path class="pt-linea" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round" d="M{a} {b} L{c} {d}"/>')
    for a, b in nodos:
        o.append(f'<circle class="pt-relleno" cx="{a}" cy="{b}" r="16"/>')
    return svg("".join(o))


def liofilizacion():
    o = [rejilla_suave()]
    x, y = 180, 180
    o.append(f'<rect class="pt-claro pt-linea" stroke-width="6" x="{x}" y="{y}" width="520" height="560" rx="30"/>')
    o.append(f'<circle class="pt-linea" stroke-width="5" cx="{x + 260}" cy="{y + 280}" r="200"/>')
    for k in range(4):
        yy = y + 160 + k * 80
        o.append(f'<path class="pt-linea" stroke-width="5" d="M{x + 110} {yy} h300"/>')
        for i in range(6):
            o.append(f'<rect class="pt-relleno" fill-opacity=".55" x="{x + 125 + i * 46}" y="{yy - 22}" width="34" height="20" rx="6"/>')
    # curva de secado
    gx, gy = 880, 200
    o.append(f'<path class="pt-linea" stroke-opacity=".3" stroke-width="3" d="M{gx} {gy} V{gy + 500} H{gx + 560}"/>')
    pts = " ".join(f"{f(gx + t * 5.4)},{f(gy + 500 - 440 * (1 - math.exp(-t / 22)))}" for t in range(0, 101, 4))
    o.append(f'<polyline class="pt-linea" stroke-width="6" points="{pts}"/>')
    o.append(f'<path class="pt-linea" stroke-opacity=".4" stroke-width="3" stroke-dasharray="12 10" d="M{gx} {gy + 66} H{gx + 560}"/>')
    return svg("".join(o))


PORTADAS = {
    "catastro_enrichment_es": catastro, "asset_identity_gs1": gs1, "paradox_db_py": paradox,
    "periodic_report_kit": informes, "casos_estudio_intervalor": casos, "transcriptor_placas": placas,
    "investigacion_operativa_ml": simplex,
    # provisionales, hasta las fotos
    "kippa_rov": rov, "vito_gnu_linux": navegacion, "utn_antartida_argentina": puerto, "pid_liofilizados": liofilizacion,
}


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    for pid, fn in PORTADAS.items():
        (DESTINO / f"{pid}.html").write_text(
            "{{- /* GENERADO por scripts/gen_portadas.py. No editar a mano. */ -}}\n" + fn() + "\n", encoding="utf-8")
        print(pid)


if __name__ == "__main__":
    main()
