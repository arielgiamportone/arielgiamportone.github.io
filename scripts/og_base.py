"""Genera assets/images/og-base.png: fondo de las tarjetas Open Graph (1200x630).

El título de cada página lo escribe Hugo encima (layouts/partials/og-imagen.html).
Uso: python3 scripts/og_base.py
"""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

RAIZ = Path(__file__).resolve().parent.parent
W, H = 1200, 630
FONDO, ACENTO, TENUE = (15, 23, 42), (34, 211, 238), (148, 163, 184)
LENTES = [(167, 139, 250), (96, 165, 250), (52, 211, 153), (34, 211, 238)]

img = Image.new("RGB", (W, H), FONDO)
d = ImageDraw.Draw(img)
# Franja de las cuatro lentes arriba
for i, c in enumerate(LENTES):
    d.rectangle([i * W // 4, 0, (i + 1) * W // 4, 10], fill=c)
# Foto circular a la derecha
foto = Image.open(RAIZ / "assets/images/me.png").convert("RGBA").resize((300, 300), Image.LANCZOS)
mascara = Image.new("L", (300, 300), 0)
ImageDraw.Draw(mascara).ellipse([0, 0, 299, 299], fill=255)
fondo_foto = Image.new("RGBA", (300, 300), FONDO + (255,))
fondo_foto.alpha_composite(foto)
img.paste(fondo_foto.convert("RGB"), (850, 165), mascara)
d.ellipse([846, 161, 1153, 468], outline=ACENTO, width=4)
# Pie con nombre y web
fb = ImageFont.truetype(str(RAIZ / "assets/fonts/DejaVuSans-Bold.ttf"), 30)
fr = ImageFont.truetype(str(RAIZ / "assets/fonts/DejaVuSans.ttf"), 24)
d.text((70, 535), "Ariel Luján Giamportone", font=fb, fill=(226, 232, 240))
d.text((70, 575), "arielgiamportone.github.io", font=fr, fill=TENUE)
d.line([70, 515, 780, 515], fill=(51, 65, 85), width=2)
img.save(RAIZ / "assets/images/og-base.png", optimize=True)
print("ok")
