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

## Regla de actualización

Cuando cambian los datos de la base de conocimiento, **siempre** se concilian la web y los CV:

```bash
scripts/actualizar_cv.sh ../cv-perfil-profesional   # sync + lint + 13 CV en PDF + huella + tests
```

Genera los CV de los 4 perfiles en español, inglés e italiano y el CV completo de ciencia y tecnología
(`static/cv/`). Si cambian los datos o las plantillas de los CV y no se regeneran los PDF, el test
`test_cv_al_dia` falla en el CI y no se despliega. Commit de `data/` y `static/cv/` juntos.

El despliegue a GitHub Pages lo hace `.github/workflows/gh-pages.yml` al hacer push a `main`.
