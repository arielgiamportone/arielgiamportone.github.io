"""Genera el fondo de trazos de la portada: mar → red de arrastre → código → red bayesiana → parcelas.

Escribe layouts/partials/banner-fondo.html (SVG en línea, unos 23 KB). Es determinista
(semilla fija), así que regenerarlo no cambia nada si no se toca el dibujo.

Uso: python3 scripts/gen_banner.py
"""
import math, random
from pathlib import Path
random.seed(7)
W, H, SEG = 2500, 700, 500
out = []
f = lambda v: f"{v:.1f}"

def batimetria(x0):
    for k in range(9):
        base = 140 + k * 52
        pts = []
        for i in range(0, SEG + 1, 10):
            x = x0 + i
            y = base + 22 * math.sin(i / 70 + k * .6) + 10 * math.sin(i / 23 + k) + (k * 4 * math.sin(i / 140))
            pts.append(f"{f(x)},{f(y)}")
        out.append(f'<polyline points="{" ".join(pts)}"/>')

def red(x0):
    cx, top, bot = x0 + 60, 250, 470
    # cable (warps) desde arriba a la izquierda
    out.append(f'<path d="M{x0} 90 L{cx} {top} M{x0} 140 L{cx} {bot}"/>')
    out.append(f'<rect x="{cx-14}" y="{top-22}" width="14" height="40" rx="3"/><rect x="{cx-14}" y="{bot-18}" width="14" height="40" rx="3"/>')
    # cuerpo cónico hasta el copo
    ex = x0 + 440; mid = (top + bot) / 2
    out.append(f'<path d="M{cx} {top} C{cx+160} {top+10} {ex-120} {mid-40} {ex} {mid-18} L{ex+40} {mid-14} L{ex+40} {mid+14} L{ex} {mid+18} C{ex-120} {mid+40} {cx+160} {bot-10} {cx} {bot}"/>')
    # malla
    for t in [i / 10 for i in range(1, 10)]:
        x = cx + (ex - cx) * t
        h = (bot - top) / 2 * (1 - t * .88)
        out.append(f'<line x1="{f(x)}" y1="{f(mid-h)}" x2="{f(x)}" y2="{f(mid+h)}"/>')
    for j in range(-3, 4):
        out.append(f'<path d="M{cx} {f(mid + j*(bot-top)/7)} Q{f((cx+ex)/2)} {f(mid + j*(bot-top)/16)} {ex} {f(mid + j*5)}"/>')
    # flotadores
    for i in range(7):
        x = cx + 20 + i * 34
        out.append(f'<circle cx="{x}" cy="{f(top - 8 + i*2.5)}" r="6"/>')

def codigo(x0):
    y = 150
    ind = [0, 1, 1, 2, 2, 1, 0, 0, 1, 2, 3, 2, 1, 0]
    for i, n in enumerate(ind):
        x = x0 + 40 + n * 28
        w = random.randint(80, 230)
        out.append(f'<line x1="{x}" y1="{y}" x2="{x + w}" y2="{y}" stroke-width="6"/>')
        if random.random() < .5:
            out.append(f'<line x1="{x + w + 16}" y1="{y}" x2="{x + w + 16 + random.randint(30, 90)}" y2="{y}" stroke-width="6"/>')
        y += 30
    # pequeño gráfico de barras
    for i, h in enumerate([60, 90, 75, 120, 105, 150]):
        out.append(f'<rect x="{x0 + 330 + i*22}" y="{600-h}" width="14" height="{h}" rx="2"/>')

def bayes(x0):
    nodos = [(80, 180), (200, 140), (330, 190), (120, 330), (260, 300), (400, 330), (180, 470), (320, 460), (440, 520)]
    aristas = [(0, 3), (1, 3), (1, 4), (2, 4), (2, 5), (3, 6), (4, 6), (4, 7), (5, 7), (7, 8), (5, 8)]
    for a, b in aristas:
        (x1, y1), (x2, y2) = nodos[a], nodos[b]
        d = math.hypot(x2 - x1, y2 - y1); ux, uy = (x2 - x1) / d, (y2 - y1) / d
        sx, sy, ex, ey = x1 + ux * 22, y1 + uy * 22, x2 - ux * 24, y2 - uy * 24
        out.append(f'<line x1="{f(x0+sx)}" y1="{f(sy)}" x2="{f(x0+ex)}" y2="{f(ey)}"/>')
        px, py = -uy, ux
        out.append(f'<path d="M{f(x0+ex)} {f(ey)} l{f(-ux*9+px*5)} {f(-uy*9+py*5)} M{f(x0+ex)} {f(ey)} l{f(-ux*9-px*5)} {f(-uy*9-py*5)}"/>')
    for x, y in nodos:
        out.append(f'<circle cx="{x0+x}" cy="{y}" r="20"/>')

def parcelas(x0):
    cols, filas = 6, 6
    P = [[(x0 + 20 + c * 88 + random.uniform(-18, 18), 110 + r * 92 + random.uniform(-16, 16)) for c in range(cols)] for r in range(filas)]
    for r in range(filas):
        out.append('<polyline points="' + " ".join(f"{f(x)},{f(y)}" for x, y in P[r]) + '"/>')
    for c in range(cols):
        out.append('<polyline points="' + " ".join(f"{f(P[r][c][0])},{f(P[r][c][1])}" for r in range(filas)) + '"/>')
    # una calle curva y un par de manzanas marcadas
    out.append(f'<path d="M{x0} 400 C{x0+160} 360 {x0+300} 470 {x0+500} 420" stroke-width="5"/>')
    for r, c in [(1, 2), (3, 4)]:
        (a, b), (cc, d) = P[r][c], P[r + 1][c + 1]
        out.append(f'<circle cx="{f((a+cc)/2)}" cy="{f((b+d)/2)}" r="5"/>')

bloques = []
for i, fn in enumerate([batimetria, red, codigo, bayes, parcelas]):
    out.clear(); fn(i * SEG)
    bloques.append(f'<g mask="url(#banner-difuso)">{"".join(out)}</g>')
cuerpo = "\n".join(bloques)
defs = ('<defs><linearGradient id="banner-g"><stop offset="0" stop-color="#fff" stop-opacity="0"/>'
        '<stop offset=".18" stop-color="#fff"/><stop offset=".82" stop-color="#fff"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>'
        '<mask id="banner-difuso" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#banner-g)" stroke="none"/></mask></defs>')
svg = f'<svg class="banner" viewBox="0 0 {W} {H}" preserveAspectRatio="xMinYMid slice" aria-hidden="true" focusable="false">{defs}<g class="banner__pista"><g>{cuerpo}</g><g transform="translate({W} 0)">{cuerpo}</g></g></svg>'
destino = Path(__file__).resolve().parent.parent / "layouts" / "partials" / "banner-fondo.html"
destino.write_text("{{- /* GENERADO por scripts/gen_banner.py. No editar a mano. */ -}}\n" + svg + "\n", encoding="utf-8")
print(f"{destino} ({len(svg)} bytes)")
