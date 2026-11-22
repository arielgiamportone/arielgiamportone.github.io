# arielgiamportone.github.io

Portfolio de Ariel Luján Giamportone: <https://arielgiamportone.github.io> (español) y <https://arielgiamportone.github.io/en/> (inglés).

- **Hugo** (extended ≥ 0.147) con un tema propio en `layouts/` y `assets/`, sin dependencias externas.
- **Datos generados** desde la base de conocimiento privada: ver [scripts/README.md](scripts/README.md).
- **Cuatro lentes de perfil** (IA, software, sector público, economía azul) que reordenan la portada y tienen página propia en `/perfiles/<lente>/`.
- **Plan y estado:** [docs/PLAN_PORTFOLIO_V2.md](docs/PLAN_PORTFOLIO_V2.md).

```bash
hugo server                       # http://localhost:1313
python3 scripts/sync_base.py --base ../cv-perfil-profesional
python3 scripts/lint_data.py && python3 -m pytest -q tests
```

El despliegue a GitHub Pages lo hace `.github/workflows/gh-pages.yml` al hacer push a `main`.
