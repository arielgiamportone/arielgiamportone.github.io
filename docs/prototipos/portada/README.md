# Prototipos de la cabecera de la portada

Tres modelos de cabecera animada que se diseñaron en noviembre de 2026. Se guardan aquí por si algún día
se quieren recuperar. Esta carpeta no se publica: Hugo solo construye `content/`, `layouts/` y `assets/`.

Cada prototipo es una página HTML independiente. Para verlos:

```bash
python3 -m http.server 8000 --directory docs/prototipos/portada
# http://localhost:8000/radial/   ·   /ramas/   ·   /andamio/
```

| Modelo | Qué cuenta | Estado |
|---|---|---|
| `radial/` | Teaser «del dato de campo a la decisión pública»: un dato recorre los cuatro perfiles alrededor de la foto, con el fondo de trazos y las cintas de logos. | Estuvo publicado del 25 al 26 de noviembre de 2026. La versión integrada en Hugo está en el historial de git (commit `0c06c5a`: `layouts/partials/teaser.html`, `assets/js/teaser.js`). |
| `ramas/` | La carrera como un historial de git: `main` es la formación, cada perfil es una rama que nace en su año real, los commits son hitos y los merges, los cruces entre perfiles. Todo converge en HEAD (la foto). | **Elegido.** Es la base de la cabecera actual (`layouts/partials/ramas.html`, `assets/js/ramas.js`). |
| `andamio/` | Un edificio de cuatro plantas que se levanta con su andamio: mar, software, IA y sector público, con proyectos como ladrillos. | Descartado: pierde las fechas y se lee más como arquitectura de sistemas que como trayectoria. |

Los prototipos usan textos y datos de la base de noviembre de 2026; no se actualizan solos.
