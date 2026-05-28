# Sie7e Memorias Desde La Sombra — Dosier

Caso de trabajo sobre el proyecto Sie7e Memorias Desde La Sombra (XperienciaUNR 2025, UNR).

HTML self-contained, listo para servirse desde GitHub Pages de este repo.

## URL pública

`https://facugm.github.io/cv/sie7e/`

Los meta OG / Twitter ya apuntan a esa URL. Si más adelante configurás un dominio custom (`facugm.com.ar`, lo que sea), reemplazar:

```bash
sed -i 's|facugm.github.io/cv|tu-dominio.com|g' sie7e/index.html
```

## Enlazar desde el CV (recomendado)

Para que el dosier sea descubrible desde tu CV principal, agregar en `/index.html` un link al case study. Posicionarlo donde tenga sentido en tu layout (sección de proyectos, work experience, featured, etc).

Snippet sugerido:

```html
<a href="sie7e/" target="_blank" rel="noopener">
  Sie7e Memorias Desde La Sombra — Caso de trabajo
</a>
```

## Validar el preview social antes de compartir

Antes de difundir el link en LinkedIn / X, forzar re-scrape para que cacheen el preview correcto:

- LinkedIn: https://post.linkedin.com/post-inspector/
- Facebook / WhatsApp / Telegram: https://developers.facebook.com/tools/debug/
- X / Twitter: https://cards-dev.twitter.com/validator

Pegás `https://facugm.github.io/cv/sie7e/`, los inspectores fuerzan re-fetch.

## Estructura

```
sie7e/
├── index.html        73 KB  · dosier bilingüe (ES/EN toggle)
├── README.md         este archivo
└── assets/           2 MB total
    ├── favicon.png         3 KB    Isotipo Z del proyecto
    ├── icon-expand.png     7 KB    Ícono "ampliar"
    ├── logo-full.png       82 KB   Isologotipo completo
    ├── og-facundo.jpg      52 KB   Preview social 1200×630
    ├── panel-1-thumb.jpg   265 KB  Panel 1 thumbnail
    ├── panel-1-info.jpg    790 KB  Panel 1 alta resolución (zoom)
    ├── panel-2-thumb.jpg   165 KB  Panel 2 thumbnail
    └── panel-2-mapa.jpg    665 KB  Panel 2 alta resolución (zoom)
```

## Editar el contenido

CSS y JS están inline en `index.html`. No hay build process, lo editás con cualquier editor de texto.

- **Idioma de carga inicial**: `<html lang="es">` al principio. Cambiar a `"en"` para abrir en inglés por default. El visitante igual puede togglear desde el nav.
- **Mail de contacto** (`figarciamata@gmail.com`): aparece 2 veces en la sección Datos formales.
- **Nombre en hero (h1)**: actualmente `Facundo I. García Mata` (con inicial). Cambiar el `<h1 class="hero-name">` si querés volver al nombre completo o cualquier otra variante.
- **Link a la app AR del proyecto**: 3 ocurrencias de `https://matitab.github.io/siete-memorias-ar/`. Si esa URL cambia, actualizar las 3.

## Stack del dosier

- HTML único, CSS y JS inline.
- Google Fonts: Saira + Saira Stencil One.
- Sin dependencias de build, sin Node, sin frameworks.
- Toggle ES/EN nativo con atributo `lang` + localStorage.
- Modal zoom con pan + pinch para los paneles.
- Responsive: 1400px, 768px, 375px.
- Print-friendly: media print rule para exportar a PDF.
