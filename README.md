# 🚀 Sitio Personal - Ariel Giamportone

Portfolio personal desarrollado con Hugo y el tema Hugo Profile, listo para deploy en GitHub Pages.

## 📋 Prerrequisitos

- [Git](https://git-scm.com/)
- [Hugo Extended](https://gohugo.io/installation/) v0.147.3 o superior
- Cuenta de [GitHub](https://github.com/)

## 🛠️ Instalación Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/arielgiamportone/arielgiamportone.github.io.git
   cd arielgiamportone.github.io
   ```

2. **Instalar dependencias (si hay submodules):**
   ```bash
   git submodule update --init --recursive
   ```

3. **Ejecutar servidor local:**
   ```bash
   hugo server -D
   ```

4. **Abrir en navegador:** http://localhost:1313

## 🌐 Deploy en GitHub Pages

### Opción 1: Deploy Automático (Recomendado)

1. **Crear repositorio en GitHub:**
   - Nombre: `arielgiamportone.github.io` (exactamente así)
   - Descripción: "Portfolio personal - Ariel Giamportone"
   - Público
   - Sin README inicial

2. **Configurar remote y hacer push:**
   ```bash
   git remote add origin https://github.com/arielgiamportone/arielgiamportone.github.io.git
   git branch -M main
   git push -u origin main
   ```

3. **Habilitar GitHub Pages:**
   - Ir a Settings → Pages
   - Source: **GitHub Actions**
   - El workflow se ejecutará automáticamente

4. **Tu sitio estará disponible en:**
   https://arielgiamportone.github.io

### Opción 2: Deploy Manual

```bash
# Build del sitio
hugo --gc --minify

# Subir a GitHub
cd public
git init
git add .
git commit -m "Deploy site"
git branch -M main
git remote add origin https://github.com/arielgiamportone/arielgiamportone.github.io.git
git push -u origin main
```

## 📁 Estructura del Proyecto

```
├── .github/workflows/    # GitHub Actions para deploy automático
├── archetypes/          # Plantillas de contenido
├── assets/             # Assets personalizados (CSS, JS)
├── content/            # Contenido del sitio
│   ├── experiencias/   # Experiencia profesional
│   ├── cursos/         # Cursos y certificaciones
│   └── formaciones/    # Formación académica
├── data/              # Datos estructurados
├── layouts/           # Plantillas personalizadas
├── static/           # Archivos estáticos
├── themes/           # Tema Hugo Profile
├── hugo.toml         # Configuración principal
└── README.md         # Este archivo
```

## 🎨 Personalización

### Colores y Estilos
Editar: `assets/css/custom.css`

### Configuración Principal
Editar: `hugo.toml`

### Contenido
- Experiencias: `content/experiencias/`
- Cursos: `content/cursos/`
- Formación: `content/formaciones/`

## 🔧 Comandos Útiles

```bash
# Nuevo contenido
hugo new experiencias/nueva-experiencia.md
hugo new cursos/nuevo-curso.md

# Build de producción
hugo --gc --minify

# Servidor de desarrollo
hugo server -D

# Limpiar cache
hugo --gc
```

## 📊 Analytics y SEO

Para agregar Google Analytics:

1. Editar `hugo.toml` y agregar en `[params]`:
   ```toml
   googleAnalytics = "G-XXXXXXXXXX"
   ```

2. Configurar en Google Analytics con el dominio: `arielgiamportone.github.io`

## 🚀 Troubleshooting

### Error: "Hugo version not compatible"
```bash
# Instalar Hugo Extended
hugo version
# Debe mostrar: hugo v0.147.3+extended
```

### Error: "Theme not found"
```bash
git submodule update --init --recursive
```

### Error: "Build failed"
Verificar que todos los archivos TOML/JSON estén bien formados.

## 📞 Soporte

- 📧 Email: [tu-email@dominio.com](mailto:tu-email@dominio.com)
- 💼 LinkedIn: [Ariel Giamportone](https://www.linkedin.com/in/agiamportone)
- 🐙 GitHub: [@arielgiamportone](https://github.com/arielgiamportone)

---

⭐ **¡No olvides darle una estrella al repositorio si te fue útil!**