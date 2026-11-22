# Datos del portfolio

Los datos de la web (`data/es/*.yaml` y `data/en/*.yaml`) **se generan**, no se escriben a mano. La fuente única es la base de conocimiento privada `cv-perfil-profesional` (`base/` y `perfiles/`).

```bash
python3 scripts/sync_base.py --base ../cv-perfil-profesional   # regenera data/es/
python3 scripts/lint_data.py                                   # comprueba que no se cuela nada privado
python3 -m pytest -q tests
```

Qué se publica lo decide `scripts/publicacion.yaml`:

| Regla | Efecto |
|---|---|
| `campos_internos`, `sufijos_internos` | Notas, fuentes, evidencias y riesgos nunca salen de la base |
| `marcas_sin_validar` | Un texto con `[VALIDAR]`, `[SUPUESTO]` o `[PENDIENTE]` no se publica |
| `requeridos` | Si se cae un campo obligatorio (p. ej. el título de una publicación), se cae el elemento entero |
| `prohibido` | Teléfono, fecha de nacimiento, clientes no autorizados, proveedores, expedientes y repos privados. El generador los descarta y `lint_data.py` falla si aparecen (también en CI) |
| `reemplazos` | Conservan un dato quitando el nombre que no se puede publicar |
| `proyectos_ajustes` | Nombre o descripción públicos de proyectos con restricciones (`nota_publicacion` de la base) |
| `exclusiones_logros` | Logros de la base que no se publican por falta de respaldo documental |
| Proyectos con `publico: false` y experiencias con `mostrar_en_cv: false` | No se publican |

Cada ejecución lista en `aviso:` todo lo que se ha descartado y por qué: es la lista de lo que falta validar en la base.

## Textos de la web e inglés

`contenido/<idioma>/*.yaml` sustituye, por id, los textos de la base que la web debe decir de otra forma:

- `contenido/es/`: redacción para la web cuando la de la base es interna o nombra a terceros.
- `contenido/en/`: la traducción al inglés. El generador avisa con `[en] sin traducir` de cada elemento nuevo sin traducción, y mientras tanto la web muestra el texto en español.

Los textos de `contenido/` pasan por las mismas reglas de publicación que la base.
