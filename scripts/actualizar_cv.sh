#!/usr/bin/env bash
# Regla de actualización: cada vez que cambia la base de conocimiento, se concilian los datos de la web
# y se regeneran TODOS los CV en PDF (4 perfiles × es/en/it + CV de CyT).
#
# Uso: scripts/actualizar_cv.sh [ruta a cv-perfil-profesional]   (por defecto ../cv-perfil-profesional)
# Requiere Hugo, Python con pyyaml y Node con Playwright (Chromium).
set -euo pipefail
cd "$(dirname "$0")/.."
BASE="${1:-../cv-perfil-profesional}"
PUERTO=8766
TMP="$(mktemp -d)"
trap 'kill "${SRV:-0}" 2>/dev/null || true; rm -rf "$TMP"' EXIT

echo "1/5 Conciliar data/ con la base ($BASE)"
python3 scripts/sync_base.py --base "$BASE"
echo "2/5 Comprobar lo que se publica"
python3 scripts/lint_data.py
echo "3/5 Construir el sitio"
hugo --quiet --destination "$TMP/web"
python3 -m http.server "$PUERTO" --directory "$TMP/web" >/dev/null 2>&1 &
SRV=$!
sleep 1
echo "4/5 Generar los CV en PDF"
NODE_PATH="${NODE_PATH:-$(npm root -g)}" node scripts/cv_pdf.cjs "http://localhost:$PUERTO"
echo "5/5 Guardar la huella de los datos"
python3 scripts/huella_cv.py --write
python3 -m pytest -q tests
echo "Listo: revisa los PDF en static/cv/ y haz commit de data/ y static/cv/ juntos."
