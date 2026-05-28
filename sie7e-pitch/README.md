# Sie7e Memorias Desde La Sombra — Pitch institucional

Dosier del proyecto Sie7e Memorias Desde La Sombra, orientado a **instituciones aliadas** (museos, escuelas secundarias, bibliotecas populares, organizaciones de derechos humanos, financiadores).

Distinto del dosier personal en `/sie7e/`: este pone el proyecto en el centro, no a Facundo. Pensado para presentarlo a comitentes interesados en escalar la propuesta.

## URL pública

`https://facugm.github.io/cv/sie7e-pitch/`

## Cuándo usar uno u otro

| Audiencia | Dosier |
|-----------|--------|
| Recruiters / empleadores | `cv/sie7e/` (caso de trabajo personal) |
| Museos / escuelas / sponsors | `cv/sie7e-pitch/` (pitch del proyecto) |

Pueden coexistir en el mismo CV: el personal linkea desde la sección "Featured work"; el pitch desde un email a una institución específica.

## Estructura

```
sie7e-pitch/
├── index.html        54 KB  · pitch institucional
├── README.md         este archivo
└── assets/           2 MB total
    ├── favicon.png         Isotipo Z del proyecto
    ├── ico-1-expand.png    Set propio: agrandar
    ├── ico-2-video.png     Set propio: ver video
    ├── ico-3-menu.png      Set propio: menú hamburguesa
    ├── icon-expand.png     Ícono del botón ampliar panel
    ├── logo-full.png       Isologotipo completo
    ├── logo-short.png      Isologotipo corto "SIE7E"
    ├── og-proyecto.jpg     Preview social 1200×630
    ├── panel-1-thumb.jpg   Panel 1 thumbnail
    ├── panel-1-info.jpg    Panel 1 alta resolución (zoom)
    ├── panel-2-thumb.jpg   Panel 2 thumbnail
    └── panel-2-mapa.jpg    Panel 2 alta resolución (zoom)
```

## Foco editorial (distinto al personal)

- **Buyer persona**: institución cultural / educativa con interés en financiar o albergar la pieza.
- **Centro narrativo**: el proyecto y las víctimas relegadas, no Facundo.
- **CTA principal**: la sección Sumate con 3 cards (Sedes itinerantes · Producción de biografías · Financiamiento).
- **Equipo**: 6 personas con responsabilidades equivalentes, sin Facundo destacado.
- **Marco**: XperienciaUNR 2025 presentado como contexto institucional, no como hito personal.

## Edición rápida

Mismo modelo que el personal: HTML self-contained, CSS y JS inline, sin build.

- **Link a la app AR del proyecto**: 2 ocurrencias de `https://matitab.github.io/siete-memorias-ar/`.
- **Mail / contacto**: el pitch no incluye contacto personal de Facundo; está pensado para que cualquier integrante del equipo lo use. Si necesitás agregar contacto, sumarlo en la sección Sumate.

## Validar preview social

Antes de mandar el link por mail a una institución:

- LinkedIn: https://post.linkedin.com/post-inspector/
- Facebook / WhatsApp: https://developers.facebook.com/tools/debug/

Pegás `https://facugm.github.io/cv/sie7e-pitch/`.
