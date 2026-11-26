# CLAUDE.md — portfolio arielgiamportone.github.io

Guía general: [README.md](README.md) y [scripts/README.md](scripts/README.md).

## Regla de actualización (obligatoria)

Los datos salen de la base privada `cv-perfil-profesional`. Siempre que cambie algo en la base:

1. `scripts/actualizar_cv.sh ../cv-perfil-profesional` (concilia `data/`, pasa el control de publicación, regenera
   los 13 CV en PDF y guarda la huella en `static/cv/huella.txt`).
2. Si avisa de textos sin traducir, completar `contenido/en/` (web) o `contenido/it/` (solo CV en italiano).
3. Una experiencia nueva se asigna a una sección del CV de CyT en `data/cv.yaml`.
4. Commit de `data/` y `static/cv/` juntos; el CI falla si los PDF no están al día (`test_cv_al_dia`).

Nunca se editan a mano `data/es|en|it/*.yaml` (los genera `sync_base.py`).
