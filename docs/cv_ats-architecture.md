# CV ATS — arquitectura de variantes

Un único archivo fuente, `cv_ats.html`, genera **N variantes × 2 idiomas** de CV ATS
desde **un solo conjunto de datos compartido**. No hay contenido duplicado: editás la
experiencia una vez y todas las variantes se actualizan según sus propias reglas de
presentación.

## Modelo

```
DATA  (contenido compartido, bilingüe es/en)
  │      experiencia · proyectos · educación · skills · idiomas · contacto
  ▼
VARIANTS  (sólo reglas de presentación por variante)
  │      título · resumen · orden de secciones · orden de skills · orden de bullets
  ▼
render()  →  ?v=<variante>&lang=<idioma>  →  HTML
  ▼
Playwright page.pdf()  →  ATS <Variante> <IDIOMA>.pdf  (texto real, fuentes embebidas)
```

Todo vive en el bloque `<script>` de `cv_ats.html`:

- **`DATA`** — el ~85% compartido. Cada texto es `{ es: '...', en: '...' }`. La
  experiencia (títulos, fechas, bullets), proyectos, educación, skills, idiomas y
  contacto son **idénticos** entre variantes. Se edita acá y punto.
- **`VARIANTS`** — el ~15% que cambia. Cada entrada define **sólo presentación**:
  - `roleLine` — línea de rol bajo el nombre
  - `summary` — perfil profesional
  - `sections` — orden de las secciones (ej. Project sube "Skills" antes de "Projects")
  - `skillsOrder` — orden de las categorías de skills (las categorías no cambian, sólo el orden)
  - `bulletOrder` — orden de los bullets **por puesto** (mismos bullets, distinto orden)
  - `roles`, `name`, `forRoles`, `pdfBase` — metadatos para el selector y el nombre del PDF

> Regla de oro: la experiencia subyacente es **la misma**. Una variante nunca inventa,
> agrega ni quita responsabilidades — sólo cambia qué se muestra primero.

## Rutas (router por query string)

| URL | Qué muestra |
|-----|-------------|
| `cv_ats.html` | Selector con una card por variante (roles objetivo + botones Ver/Descargar, ES/EN) |
| `cv_ats.html?v=marketing&lang=en` | CV variante Marketing en inglés |
| `cv_ats.html?v=project&lang=es` | CV variante Project en español |

Sin `?v` → selector. `lang` cae a `localStorage.cv_lang` y luego a `es`.

## Variantes actuales

- **`marketing`** — Marketing & Communication. Prioridad: comunicación → marketing →
  contenidos → marca → web → coordinación → tecnología.
- **`project`** — Project Management & Operations. Prioridad: project management →
  coordinación interdisciplinaria → stakeholders → procesos → producto → tecnología →
  comunicación. La tecnología sube como diferencial sin volverse un CV de developer.

## Agregar una variante nueva (ej. Audiovisual, Customer Success)

1. Agregar una entrada a `VARIANTS` con su `pdfBase`, `name`, `roles`, `roleLine`,
   `summary`, `sections`, `skillsOrder` y `bulletOrder`. **No se toca `DATA`.**
2. Agregar la variante al array `VARIANTS` del generador de PDFs (ver abajo).
3. Regenerar PDFs.

El selector y el router la toman automáticamente (iteran `Object.keys(VARIANTS)`).

## Regenerar los PDFs

Los PDFs son artefactos estáticos en el root del repo (los sirve el botón "Descargar").
**No** se generan al vuelo y **no** usan el diálogo de impresión del navegador.

```bash
# 1. servir el repo por HTTP (Playwright bloquea file://)
python3 -m http.server 8731 --bind 0.0.0.0

# 2. correr el generador (carga cada ?v=&lang=, emula print, page.pdf)
node scripts/gen_ats_pdf.js
```

El generador recorre `VARIANTS × LANGS` y escribe `ATS <Variante> <IDIOMA>.pdf` con
`preferCSSPageSize: true`. Resultado: texto seleccionable y buscable, fuentes embebidas
y subseteadas (Identity-H, Unicode preservado), A4, ~48 KB, ATS-friendly. Verificar con
`pdffonts` (emb=yes), `pdftotext` (texto extraíble) y `pdfinfo` (A4).

## Por qué este diseño

- **Una sola fuente de verdad** → editar la experiencia una vez actualiza las 4 salidas.
- **Presentación declarativa** → diferenciar variantes es reordenar arrays, no reescribir.
- **Escalable** → variantes nuevas = una entrada en `VARIANTS`, sin reescribir nada.
- **ATS-safe** → el ATS lee el PDF estático (texto real), no el HTML renderizado por JS.
