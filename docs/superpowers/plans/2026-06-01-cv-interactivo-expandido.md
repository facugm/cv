# CV Interactivo Expandido — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reformular el sitio de CV de "híbrido CV/portfolio" a un **CV interactivo expandido** con eje profesional Comunicación · Project Management Digital · Producción Audiovisual, y derivar dos salidas reservadas (PDF visual de 1 página y versión ATS) accesibles solo por URL directa.

**Architecture:** Sitio estático en GitHub Pages (project site `facugm.github.io/cv/`). `index.html` es la web pública (single-file: HTML + CSS inline + IIFE JS + tabla i18n ES/EN). El PDF visual vive en `cv_pdf.html` (renombrado desde `pdf.html`). Se agrega `cv_ats.html` nuevo. Las dos páginas reservadas usan `<meta name="robots" content="noindex, nofollow">` como mecanismo primario (en project site `robots.txt` bajo `/cv/` NO es honrado por crawlers; se agrega igual como best-effort) y NO se enlazan desde ninguna parte pública.

**Tech Stack:** HTML5, CSS (inline, custom properties, `@media print`), JavaScript vanilla (IIFE, sin build), i18n por tabla `data-i18n`. Verificación con servidor `python3 -m http.server` + Playwright MCP + `grep`. Sin framework de tests: las "pruebas" son aserciones `grep` y chequeos Playwright con output esperado.

**Decisiones del usuario (cerradas):**
1. Proyectos seleccionados = **Sie7e + 24 Veces Diciembre** (obra/creativo). GGWP y 3Factor quedan **solo en Experiencia**, NO se duplican.
2. `pdf.html` → **renombrar a `cv_pdf.html`**, recortar a una página, quitar botón público "Vista PDF". `cv_ats.html` se crea nuevo.
3. **Todo bilingüe** (ES/EN): `index.html`, `cv_pdf.html`, `cv_ats.html` con toggle de idioma.
4. Cards de proyecto con **microestructura etiquetada**: Rol · Contexto · Responsabilidades · Resultado/Evidencia · Link.

**Estado actual relevante (líneas aproximadas, verificar con grep antes de editar):**
- `index.html:739-755` — `.header` (name, `.tagline` `data-i18n="header.tagline"`, `.contact-row`, `.photo-circle`).
- `index.html:758-762` — sección Perfil (`perfil.text`).
- `index.html:764-836` — Experiencia (3 roles: `exp.educativa`, `exp.3f`, `exp.ggwp`).
- `index.html:837-885` — Proyectos destacados (Sie7e, 24v).
- `index.html:887-911` — Educación.
- `index.html:912-958` — Herramientas (4 grupos: web, design, management, networks).
- `index.html:960-979` — Idiomas.
- `index.html:722-725` — `.print-bar` (`btnToggleAll`, `linkPdf`=Vista PDF, `btnLang`).
- `index.html:1583-1607` — JS del botón Vista PDF (iframe oculto imprime `pdf.html`).
- `index.html:1344-1447` — tabla i18n `es`; `1448-~1545` — i18n `en`.
- `pdf.html` — versión A4 2-columnas (toolbar Volver/Exportar PDF/lang, i18n propio).
- No existe `robots.txt`, `sitemap.xml`, `CNAME`, ni footer.

**Convención de verificación:** levantar servidor una vez:
```bash
cd /var/www/educativa/cv && python3 -m http.server 8765 >/tmp/cvsrv.log 2>&1 &
sleep 1 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/index.html   # espera 200
```
Para Playwright usar siempre cache-bust `?v=N` incremental (el navegador cachea agresivo en este entorno).

---

## Task 1: Reframe de identidad — titular, bajada, perfil y metas (index.html)

**Files:**
- Modify: `index.html` (header markup ~744; perfil ~761; metas 6-26; i18n es ~1357/1366, en ~1459/...)

- [ ] **Step 1: Verificar anchors actuales**

Run:
```bash
cd /var/www/educativa/cv
grep -n "header.tagline\|perfil.text\|'header.tagline'\|'perfil.text'\|'header.subtitle'" index.html
```
Expected: aparece `header.tagline` en markup (~744) y en i18n es/en; `perfil.text` en markup (~761) y en i18n es/en. `header.subtitle` NO existe todavía.

- [ ] **Step 2: Cambiar el titular (triada) en markup — quitar "Desarrollo"**

En `index.html`, reemplazar exactamente:
```html
        <div class="tagline" data-i18n="header.tagline">Project Management · Producción audiovisual · Desarrollo web</div>
```
por:
```html
        <div class="tagline" data-i18n="header.tagline">Project Management Digital · Comunicación · Producción Audiovisual</div>
        <div class="hero-subtitle" data-i18n="header.subtitle">CV interactivo expandido con experiencia profesional, proyectos seleccionados y enlaces de trabajo.</div>
```

- [ ] **Step 3: Agregar CSS para `.hero-subtitle`**

Buscar el bloque CSS de `.tagline` (`grep -n "\.tagline" index.html`) y AÑADIR justo después de su regla de cierre `}` la regla:
```css
.hero-subtitle {
  font-family: 'Newsreader', serif;
  font-size: 15px;
  line-height: 1.5;
  color: var(--ink-mute);
  margin-top: 8px;
  max-width: 52ch;
  font-style: italic;
}
@media (max-width: 640px) { .hero-subtitle { font-size: 13.5px; } }
```
(Si `--ink-mute` no existe, usar `grep -n "\-\-ink" index.html` y elegir la variable de texto secundario existente.)

- [ ] **Step 4: Reescribir el perfil en markup**

Reemplazar exactamente el contenido del `<p class="perfil-text" ...>` (línea ~761):
```html
    <p class="perfil-text" data-i18n="perfil.text">Combino project management, comunicación estratégica, producción audiovisual y desarrollo web para llevar adelante proyectos desde la idea hasta la implementación. Licenciado en Comunicación Social (UNR), casi cuatro años como desarrollador full stack, y experiencia en coordinación, redes y producción audiovisual.</p>
```
por:
```html
    <p class="perfil-text" data-i18n="perfil.text">Licenciado en Comunicación Social con experiencia en project management digital, producción audiovisual, estrategia de contenidos y desarrollo web. Combino mirada comunicacional, criterio narrativo y capacidad técnica para llevar proyectos desde la idea hasta la implementación.</p>
```

- [ ] **Step 5: Actualizar i18n `es` (tagline + nueva subtitle + perfil)**

En la tabla `es:` reemplazar la línea `'header.tagline': ...` por:
```js
      'header.tagline': 'Project Management Digital · Comunicación · Producción Audiovisual',
      'header.subtitle': 'CV interactivo expandido con experiencia profesional, proyectos seleccionados y enlaces de trabajo.',
```
y reemplazar `'perfil.text': ...` (es) por:
```js
      'perfil.text': 'Licenciado en Comunicación Social con experiencia en project management digital, producción audiovisual, estrategia de contenidos y desarrollo web. Combino mirada comunicacional, criterio narrativo y capacidad técnica para llevar proyectos desde la idea hasta la implementación.',
```

- [ ] **Step 6: Actualizar i18n `en` (tagline + subtitle + perfil)**

En la tabla `en:` reemplazar `'header.tagline': ...` por:
```js
      'header.tagline': 'Digital Project Management · Communication · Audiovisual Production',
      'header.subtitle': 'Expanded interactive CV with professional experience, selected projects, and work links.',
```
y reemplazar `'perfil.text': ...` (en) por:
```js
      'perfil.text': 'Bachelor in Social Communication with experience in digital project management, audiovisual production, content strategy, and web development. I combine a communications mindset, narrative judgment, and technical capability to carry projects from idea to implementation.',
```

- [ ] **Step 7: Actualizar metas SEO/OG/Twitter + title**

Reemplazar las líneas 6, 7, 13, 14, 25 (verificar con `grep -n "<title>\|name=\"description\"\|og:title\|og:description\|twitter:description" index.html`):
```html
<title>CV interactivo expandido | Facundo García Mata</title>
```
```html
<meta name="description" content="CV interactivo expandido de Facundo García Mata. Comunicador, Project Manager Digital y Productor Audiovisual. Experiencia profesional, proyectos seleccionados y enlaces de trabajo.">
```
```html
<meta property="og:title" content="Facundo García Mata — CV interactivo expandido">
```
```html
<meta property="og:description" content="Comunicador · Project Manager Digital · Productor Audiovisual. CV interactivo expandido con experiencia, proyectos seleccionados y enlaces.">
```
```html
<meta name="twitter:title" content="Facundo García Mata — CV interactivo expandido">
```
```html
<meta name="twitter:description" content="Comunicador · Project Manager Digital · Productor Audiovisual. CV interactivo expandido.">
```

- [ ] **Step 8: Verificar en navegador (ES y EN)**

Run:
```bash
cd /var/www/educativa/cv
grep -c "Desarrollo web · \|· Desarrollo web" index.html   # titular ya NO debe tener "Desarrollo" en la triada
grep -n "hero-subtitle\|header.subtitle" index.html         # subtitle presente en markup + i18n es + en (3+ hits)
```
Expected: la triada del titular no contiene "Desarrollo"; `header.subtitle` aparece ≥3 veces.
Con Playwright: navegar `http://localhost:8765/index.html?v=11`, snapshot → el header muestra "Project Management Digital · Comunicación · Producción Audiovisual" + la bajada. Click botón idioma → versión EN equivalente. 0 errores de consola (`browser_console_messages` level error → 0).

- [ ] **Step 9: Commit**

```bash
cd /var/www/educativa/cv
git add index.html
git commit -m "Reframe: titular Comunicacion/PM Digital/Audiovisual + bajada + perfil

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: CTAs del hero (Ver proyectos · LinkedIn · Contacto)

**Files:**
- Modify: `index.html` (insertar bloque CTA tras `.header` ~756; CSS; JS de scroll+open al final del IIFE ~antes de "Restaurar idioma"; i18n es/en)

- [ ] **Step 1: Insertar el bloque CTA en markup**

Inmediatamente DESPUÉS del cierre `</div>` de `.header` (la línea con `</div>` que sigue a `.photo-circle`, ~755) y ANTES de `<!-- PERFIL -->`, insertar:
```html
  <!-- HERO CTAs (público) -->
  <nav class="hero-cta" aria-label="Acciones principales">
    <a class="cta-btn cta-primary" href="#proyectos-destacados" data-cta="proyectos-destacados" data-i18n="cta.projects">Ver proyectos seleccionados</a>
    <a class="cta-btn" href="https://www.linkedin.com/in/facundogm/" target="_blank" rel="noopener" data-i18n="cta.linkedin">LinkedIn</a>
    <a class="cta-btn" href="#contacto" data-cta="contacto" data-i18n="cta.contact">Contacto</a>
  </nav>
```

- [ ] **Step 2: Agregar CSS de los CTAs**

Añadir tras la regla `.hero-subtitle` (de Task 1):
```css
.hero-cta { display: flex; flex-wrap: wrap; gap: 10px; margin: 22px 0 4px; }
.cta-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--plum);
  text-decoration: none;
  border: 1px solid var(--plum);
  border-radius: 0;
  padding: 9px 14px;
  transition: background 0.15s, color 0.15s;
}
.cta-btn:hover { background: var(--plum); color: var(--paper); }
.cta-primary { background: var(--plum); color: var(--paper); }
.cta-primary:hover { background: var(--coral); border-color: var(--coral); }
@media print { .hero-cta { display: none !important; } }
```
(Confirmar nombres de variables: `grep -n "\-\-plum\|\-\-paper\|\-\-coral" index.html`. Si difieren, usar las existentes.)

- [ ] **Step 3: Agregar JS de scroll + apertura de sección destino**

En el IIFE, JUSTO ANTES del comentario `// Restaurar idioma guardado o default` (~1609), insertar:
```js
  // ── CTAs del hero: abrir la seccion destino y hacer scroll suave ──
  Array.prototype.slice.call(document.querySelectorAll('.hero-cta a[data-cta]')).forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('data-cta');
      var target = document.querySelector('.page > .section[data-id="' + id + '"]');
      if (!target) return; // si no existe, dejar el anchor default
      e.preventDefault();
      if (!target.classList.contains('is-open')) {
        target.classList.add('is-open');
        if (typeof refreshToggleAllBtn === 'function') refreshToggleAllBtn();
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
```

- [ ] **Step 4: i18n de los CTAs (es y en)**

En `es:` añadir (junto a otras claves `ui.`/`cta.`):
```js
      'cta.projects': 'Ver proyectos seleccionados',
      'cta.linkedin': 'LinkedIn',
      'cta.contact': 'Contacto',
```
En `en:` añadir:
```js
      'cta.projects': 'View selected projects',
      'cta.linkedin': 'LinkedIn',
      'cta.contact': 'Contact',
```

- [ ] **Step 5: Verificar comportamiento**

Run (servidor levantado):
```bash
grep -n "hero-cta\|data-cta=\|cta.projects" index.html | head
```
Expected: bloque CTA presente con 3 enlaces.
Playwright: navegar `?v=12`, click "Ver proyectos seleccionados" → la sección `proyectos-destacados` queda `is-open` y la vista scrollea hasta ella (evaluar `document.querySelector('[data-id=proyectos-destacados]').classList.contains('is-open')` === true). Verificar que NO hay botón visible de descarga PDF/ATS en el hero.

- [ ] **Step 6: Commit**
```bash
git add index.html && git commit -m "Hero: CTAs Ver proyectos / LinkedIn / Contacto con scroll+open

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: Títulos de Experiencia orientados a mercado (index.html)

**Files:**
- Modify: `index.html` (markup `exp.3f.title` ~792, `exp.ggwp.title` ~813; i18n es/en)

- [ ] **Step 1: Markup — 3Factor y GGWP**

Reemplazar:
```html
        <div class="exp-title" data-i18n="exp.3f.title">Coordinación y comunicación digital</div>
```
por:
```html
        <div class="exp-title" data-i18n="exp.3f.title">Coordinación y Project Management Digital</div>
```
y reemplazar:
```html
        <div class="exp-title" data-i18n="exp.ggwp.title">Productor</div>
```
por:
```html
        <div class="exp-title" data-i18n="exp.ggwp.title">Productor de Streaming</div>
```
(Nota: `exp.educativa.title` = "Desarrollador Full Stack" se mantiene sin cambios — es un título de mercado válido y conserva el diferencial técnico.)

- [ ] **Step 2: i18n es**

Reemplazar en `es:`:
```js
      'exp.3f.title': 'Coordinación y Project Management Digital',
```
```js
      'exp.ggwp.title': 'Productor de Streaming',
```

- [ ] **Step 3: i18n en**

Reemplazar en `en:`:
```js
      'exp.3f.title': 'Coordination & Digital Project Management',
```
```js
      'exp.ggwp.title': 'Streaming Producer',
```

- [ ] **Step 4: Verificar**
```bash
grep -n "exp.3f.title\|exp.ggwp.title" index.html
```
Expected: markup + 2 entradas i18n cada uno con los nuevos textos. Playwright `?v=13`: títulos nuevos visibles en ES y EN.

- [ ] **Step 5: Commit**
```bash
git add index.html && git commit -m "Experiencia: titulos orientados a mercado (PM Digital, Productor de Streaming)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: "Proyectos seleccionados" con microestructura etiquetada (index.html)

**Files:**
- Modify: `index.html` (section `proyectos-destacados` ~837-885; CSS nuevo `.proj-field`; i18n es/en: `sections.projects`, nuevas claves `proj.sie7e.*`, `proj.24v.*`)

Decisión: Proyectos = **Sie7e + 24v** únicamente. Cada card pasa de bullets sueltos a microestructura con sub-labels: **Rol / Contexto / Responsabilidades / Resultado / Link**.

- [ ] **Step 1: CSS de la microestructura**

Añadir tras la regla `.exp-bullets` (`grep -n "\.exp-bullets " index.html`):
```css
.proj-fields { display: flex; flex-direction: column; gap: 8px; margin-top: 6px; max-width: 82ch; }
.proj-field { font-family: 'Newsreader', serif; font-size: 16px; line-height: 1.55; color: var(--ink); }
.proj-field .proj-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.14em;
  color: var(--plum); display: block; margin-bottom: 1px;
}
@media (max-width: 640px) { .proj-field { font-size: 14.5px; } }
```

- [ ] **Step 2: Reescribir card de Sie7e (markup)**

Reemplazar el bloque `<ul class="exp-bullets"> ... </ul>` de Sie7e (las 3 `<li>` con `proj.sie7e.b1/b2/b3`) por:
```html
      <div class="proj-fields">
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.role">Rol</span><span data-i18n="proj.sie7e.role">Autor de la obra · Productor de contenidos · Gestión de proyecto</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.context">Contexto</span><span data-i18n="proj.sie7e.context">Proyecto final de grado en convocatoria interdisciplinar XperienciaUNR (UNR).</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.resp">Responsabilidades</span><span data-i18n="proj.sie7e.resp">Dispositivo educativo de memorial local y experiencia interactiva de realidad aumentada que articula narrativa transmedia, archivo y testimonios.</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.result">Resultado</span><span data-i18n="proj.sie7e.result"><span class="highlight-grade">Calificación: 10.</span> Obra finalizada y presentada.</span></div>
      </div>
```
(El `<div class="exp-org">...XperienciaUNR</div>` y el `<div class="project-tags">` se mantienen. El link "Ver dossier" ya está en `.exp-meta`.)

- [ ] **Step 3: Reescribir card de 24 Veces Diciembre (markup)**

Reemplazar el `<ul class="exp-bullets">` de 24v (los 3 `<li>` `proj.24v.b1/b2/b3`) por:
```html
      <div class="proj-fields">
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.role">Rol</span><span data-i18n="proj.24v.role">Dirección · Producción · Guión · Edición</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.context">Contexto</span><span data-i18n="proj.24v.context">Trabajo final de la materia electiva Formación Audiovisual Tecnológica (Lic. en Comunicación Social, UNR).</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.resp">Responsabilidades</span><span data-i18n="proj.24v.resp">Documental sobre memorias, testimonios y huellas vinculadas al diciembre de 2001 en Rosario. Participación en desarrollo narrativo, dirección, producción y edición.</span></div>
        <div class="proj-field"><span class="proj-label" data-i18n="proj.lbl.result">Resultado</span><span data-i18n="proj.24v.result"><span class="highlight-grade">Calificación: 10.</span> Documental finalizado, disponible en Drive.</span></div>
      </div>
```

- [ ] **Step 4: Renombrar la sección (markup + i18n)**

En markup, reemplazar el título de sección:
```html
<div class="section-title" data-i18n="sections.projects">Proyectos destacados</div>
```
por:
```html
<div class="section-title" data-i18n="sections.projects">Proyectos seleccionados</div>
```
En i18n `es:` cambiar `'sections.projects': 'Proyectos destacados',` → `'sections.projects': 'Proyectos seleccionados',`.
En i18n `en:` cambiar `'sections.projects': 'Featured projects',` → `'sections.projects': 'Selected projects',`.

- [ ] **Step 5: Agregar i18n de labels + campos (es)**

En `es:` añadir:
```js
      'proj.lbl.role': 'Rol',
      'proj.lbl.context': 'Contexto',
      'proj.lbl.resp': 'Responsabilidades',
      'proj.lbl.result': 'Resultado',
      'proj.sie7e.role': 'Autor de la obra · Productor de contenidos · Gestión de proyecto',
      'proj.sie7e.context': 'Proyecto final de grado en convocatoria interdisciplinar XperienciaUNR (UNR).',
      'proj.sie7e.resp': 'Dispositivo educativo de memorial local y experiencia interactiva de realidad aumentada que articula narrativa transmedia, archivo y testimonios.',
      'proj.sie7e.result': '<span class="highlight-grade">Calificación: 10.</span> Obra finalizada y presentada.',
      'proj.24v.role': 'Dirección · Producción · Guión · Edición',
      'proj.24v.context': 'Trabajo final de la materia electiva Formación Audiovisual Tecnológica (Lic. en Comunicación Social, UNR).',
      'proj.24v.resp': 'Documental sobre memorias, testimonios y huellas vinculadas al diciembre de 2001 en Rosario. Participación en desarrollo narrativo, dirección, producción y edición.',
      'proj.24v.result': '<span class="highlight-grade">Calificación: 10.</span> Documental finalizado, disponible en Drive.',
```
(Las claves viejas `proj.sie7e.b1/b2/b3` y `proj.24v.b1/b2/b3` quedan sin uso; eliminarlas de la tabla `es` para evitar ruido.)

- [ ] **Step 6: Agregar i18n de labels + campos (en)**

En `en:` añadir:
```js
      'proj.lbl.role': 'Role',
      'proj.lbl.context': 'Context',
      'proj.lbl.resp': 'Responsibilities',
      'proj.lbl.result': 'Result',
      'proj.sie7e.role': 'Author · Content producer · Project management',
      'proj.sie7e.context': 'Final degree project in the interdisciplinary XperienciaUNR open call (UNR).',
      'proj.sie7e.resp': 'Educational local memorial device and interactive augmented reality experience weaving transmedia narrative, archive, and testimonies.',
      'proj.sie7e.result': '<span class="highlight-grade">Final grade: 10.</span> Work completed and presented.',
      'proj.24v.role': 'Direction · Production · Screenplay · Editing',
      'proj.24v.context': 'Final project for the elective course Technological Audiovisual Training (BA in Social Communication, UNR).',
      'proj.24v.resp': 'Documentary on memories, testimonies, and social imprints linked to December 2001 in Rosario. Contributed to narrative development, direction, production, and editing.',
      'proj.24v.result': '<span class="highlight-grade">Final grade: 10.</span> Documentary completed, available on Drive.',
```
(Eliminar de `en` las claves viejas `proj.sie7e.b1/b2/b3`, `proj.24v.b1/b2/b3`.)

- [ ] **Step 7: Verificar**
```bash
grep -n "proj-field\|proj.lbl.role\|sections.projects" index.html | head
grep -c "proj.sie7e.b1\|proj.24v.b1" index.html   # esperado 0 (claves viejas eliminadas de markup e i18n)
```
Expected: microestructura presente; `proj.*.b1` ya no aparece. Playwright `?v=14`: cada proyecto muestra labels Rol/Contexto/Responsabilidades/Resultado, "Calificación: 10" resaltado, link Ver dossier / Ver en Drive intacto. Toggle EN OK.

- [ ] **Step 8: Commit**
```bash
git add index.html && git commit -m "Proyectos seleccionados: microestructura Rol/Contexto/Responsabilidades/Resultado

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Reagrupar Herramientas en 6 grupos (index.html)

**Files:**
- Modify: `index.html` (section `herramientas-y-conocimientos` ~912-958; i18n es/en `tools.*`)

Mapa de los 6 grupos (claves i18n nuevas: `tools.pm`, `tools.comms`, `tools.av`, `tools.design`(reuso, renombrado), `tools.web`(reuso), `tools.social`):

- [ ] **Step 1: Reemplazar todo el `<div class="tools-grid"> ... </div>`**

Reemplazar el contenido completo del `tools-grid` (los 4 `<div>` actuales) por estos 6 grupos:
```html
    <div class="tools-grid">
      <div>
        <div class="tool-group-label" data-i18n="tools.pm">Project Management y coordinación</div>
        <div class="tool-tags">
          <span class="tool-tag">Trello</span>
          <span class="tool-tag">Google Workspace</span>
          <span class="tool-tag" data-i18n="tools.tag.teams">Gestión de equipos</span>
          <span class="tool-tag" data-i18n="tools.tag.planning">Planificación</span>
        </div>
      </div>
      <div>
        <div class="tool-group-label" data-i18n="tools.comms">Comunicación y contenidos</div>
        <div class="tool-tags">
          <span class="tool-tag" data-i18n="tools.tag.contentstrat">Estrategia de contenidos</span>
          <span class="tool-tag" data-i18n="tools.tag.branding">Branding</span>
          <span class="tool-tag" data-i18n="tools.tag.copy">Guión y escaleta</span>
        </div>
      </div>
      <div>
        <div class="tool-group-label" data-i18n="tools.av">Producción audiovisual</div>
        <div class="tool-tags">
          <span class="tool-tag">Adobe Premiere</span>
          <span class="tool-tag">Audition</span>
          <span class="tool-tag" data-i18n="tools.tag.editing">Edición</span>
          <span class="tool-tag" data-i18n="tools.tag.livestream">Streaming en vivo</span>
        </div>
      </div>
      <div>
        <div class="tool-group-label" data-i18n="tools.design">Diseño y herramientas creativas</div>
        <div class="tool-tags">
          <span class="tool-tag">Illustrator</span>
          <span class="tool-tag">Photoshop</span>
          <span class="tool-tag">InDesign</span>
          <span class="tool-tag">Figma</span>
          <span class="tool-tag">Canva</span>
        </div>
      </div>
      <div>
        <div class="tool-group-label" data-i18n="tools.web">Desarrollo web y tecnología</div>
        <div class="tool-tags">
          <span class="tool-tag">HTML/CSS</span>
          <span class="tool-tag">JavaScript</span>
          <span class="tool-tag">SQL</span>
          <span class="tool-tag">Perl</span>
          <span class="tool-tag">Wordpress</span>
          <span class="tool-tag">Git</span>
          <span class="tool-tag">GitHub</span>
        </div>
      </div>
      <div>
        <div class="tool-group-label" data-i18n="tools.social">Social media y plataformas</div>
        <div class="tool-tags">
          <span class="tool-tag">Instagram</span>
          <span class="tool-tag">LinkedIn</span>
          <span class="tool-tag">YouTube</span>
          <span class="tool-tag">Meta Business Suite</span>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: i18n es (labels de grupo + tags traducibles)**

En `es:` reemplazar las 4 claves viejas (`tools.web`, `tools.design`, `tools.management`, `tools.networks`) por:
```js
      'tools.pm': 'Project Management y coordinación',
      'tools.comms': 'Comunicación y contenidos',
      'tools.av': 'Producción audiovisual',
      'tools.design': 'Diseño y herramientas creativas',
      'tools.web': 'Desarrollo web y tecnología',
      'tools.social': 'Social media y plataformas',
      'tools.tag.teams': 'Gestión de equipos',
      'tools.tag.planning': 'Planificación',
      'tools.tag.contentstrat': 'Estrategia de contenidos',
      'tools.tag.branding': 'Branding',
      'tools.tag.copy': 'Guión y escaleta',
      'tools.tag.editing': 'Edición',
      'tools.tag.livestream': 'Streaming en vivo',
```

- [ ] **Step 3: i18n en**

En `en:` reemplazar `tools.web`/`tools.design`/`tools.management`/`tools.networks` por:
```js
      'tools.pm': 'Project management & coordination',
      'tools.comms': 'Communication & content',
      'tools.av': 'Audiovisual production',
      'tools.design': 'Design & creative tools',
      'tools.web': 'Web development & technology',
      'tools.social': 'Social media & platforms',
      'tools.tag.teams': 'Team management',
      'tools.tag.planning': 'Planning',
      'tools.tag.contentstrat': 'Content strategy',
      'tools.tag.branding': 'Branding',
      'tools.tag.copy': 'Scripting & rundown',
      'tools.tag.editing': 'Editing',
      'tools.tag.livestream': 'Live streaming',
```

- [ ] **Step 4: Verificar que no queden claves huérfanas**
```bash
grep -c "'tools.management'\|'tools.networks'" index.html   # esperado 0
grep -c "tool-group-label" index.html                       # esperado 6
```
Expected: 0 claves viejas; 6 grupos. Playwright `?v=15`: 6 grupos renderizan ES/EN; orden = PM, Comunicación, Audiovisual, Diseño, Desarrollo, Social.

- [ ] **Step 5: Commit**
```bash
git add index.html && git commit -m "Herramientas: 6 grupos (PM, Comunicacion, Audiovisual, Diseno, Web, Social)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 6: Sección Contacto (index.html)

**Files:**
- Modify: `index.html` (insertar `.section` Contacto tras Idiomas ~979; CSS `.contact-grid`; i18n es/en)

- [ ] **Step 1: Insertar la sección tras Idiomas**

Después del cierre `</div></div>` de la sección `idiomas` (~979) y antes de `<!-- CONTENT_END -->`, insertar:
```html
  <!-- CONTACTO -->
  <div class="section col-side" data-id="contacto">
    <div class="section-header"><div class="section-title" data-i18n="sections.contact">Contacto</div><span class="section-chevron" contenteditable="false">▸</span></div><div class="section-body">
    <div class="contact-grid">
      <div class="contact-line"><span class="contact-k" data-i18n="contact.email">Email</span><a href="mailto:figarciamata@gmail.com">figarciamata@gmail.com</a></div>
      <div class="contact-line"><span class="contact-k">LinkedIn</span><a href="https://www.linkedin.com/in/facundogm/" target="_blank" rel="noopener">linkedin.com/in/facundogm</a></div>
      <div class="contact-line"><span class="contact-k" data-i18n="contact.location">Ubicación</span><span data-i18n="contact.city">Rosario, Argentina</span></div>
      <div class="contact-line"><span class="contact-k" data-i18n="contact.links">Links</span><a href="sie7e/" target="_blank" rel="noopener">Sie7e</a> · <a href="https://www.instagram.com/ggwp.stream/" target="_blank" rel="noopener">GGWP</a></div>
    </div>
  </div></div>
```

- [ ] **Step 2: CSS de Contacto**

Añadir tras la regla `.lang-row` (`grep -n "\.lang-row" index.html`):
```css
.contact-grid { display: flex; flex-direction: column; gap: 8px; }
.contact-line { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--ink); display: flex; gap: 10px; flex-wrap: wrap; }
.contact-line .contact-k { color: var(--plum); font-weight: 700; min-width: 84px; text-transform: uppercase; letter-spacing: 0.08em; font-size: 11px; }
.contact-line a { color: var(--ink); text-decoration: none; border-bottom: 1px solid var(--mauve, var(--plum)); }
.contact-line a:hover { color: var(--coral); }
```

- [ ] **Step 3: i18n es**
```js
      'sections.contact': 'Contacto',
      'contact.email': 'Email',
      'contact.location': 'Ubicación',
      'contact.city': 'Rosario, Argentina',
      'contact.links': 'Links',
```

- [ ] **Step 4: i18n en**
```js
      'sections.contact': 'Contact',
      'contact.email': 'Email',
      'contact.location': 'Location',
      'contact.city': 'Rosario, Argentina',
      'contact.links': 'Links',
```

- [ ] **Step 5: Verificar**
```bash
grep -n 'data-id="contacto"\|sections.contact' index.html
```
Expected: sección presente + i18n es/en. Playwright `?v=16`: aparece sección Contacto colapsable; el CTA "Contacto" del hero (Task 2) la abre y scrollea. Toggle EN OK.

- [ ] **Step 6: Commit**
```bash
git add index.html && git commit -m "Agregar seccion Contacto (email, LinkedIn, ubicacion, links)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 7: Quitar enlace público al PDF (index.html)

**Files:**
- Modify: `index.html` (`.print-bar` ~722-725; JS iframe ~1583-1607; CSS `.print-bar :not()` ~94; i18n `ui.view-pdf`)

- [ ] **Step 1: Eliminar el botón "Vista PDF" del markup**

Reemplazar el bloque `.print-bar`:
```html
<div class="print-bar">
  <button class="print-btn" id="btnToggleAll" type="button">▾ Expandir todo</button>
  <a class="print-btn" id="linkPdf" href="pdf.html" data-i18n="ui.view-pdf">📄 Vista PDF</a>
  <button class="print-btn" id="btnLang" type="button" title="Switch language">🌐 EN</button>
</div>
```
por:
```html
<div class="print-bar">
  <button class="print-btn" id="btnToggleAll" type="button">▾ Expandir todo</button>
  <button class="print-btn" id="btnLang" type="button" title="Switch language">🌐 EN</button>
</div>
```

- [ ] **Step 2: Eliminar el JS del iframe de impresión**

Borrar el bloque completo `var linkPdf = document.getElementById('linkPdf'); if (linkPdf) { ... }` (~1583-1607), incluido el comentario `// ── Vista/Descarga PDF sin salir de index ──` que lo precede. No debe quedar referencia a `pdfFrame` ni a `pdf.html`/`cv_pdf.html` en `index.html`.

- [ ] **Step 3: Limpiar CSS y i18n residuales**

En la regla `.print-bar > *:not(#btnToggleAll):not(#linkPdf):not(#btnLang) { display: none; }` quitar `:not(#linkPdf)` (queda `:not(#btnToggleAll):not(#btnLang)`).
Eliminar `'ui.view-pdf'` de las tablas i18n `es` y `en`.

- [ ] **Step 4: Verificar que no hay rastros públicos del PDF/ATS**
```bash
grep -rn "pdf.html\|cv_pdf\|cv_ats\|Vista PDF\|linkPdf\|pdfFrame\|view-pdf" index.html
```
Expected: **0 resultados**. (Si aparece algo, eliminarlo.)
Playwright `?v=17`: la barra superior solo muestra "Expandir todo" + idioma. 0 errores consola.

- [ ] **Step 5: Commit**
```bash
git add index.html && git commit -m "Quitar enlace publico a la version PDF (pasa a pagina reservada)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 8: `pdf.html` → `cv_pdf.html` reservado, una página, copy sincronizado

**Files:**
- Rename: `pdf.html` → `cv_pdf.html`
- Modify: `cv_pdf.html` (meta noindex; copy/i18n sincronizado con index; recorte a 1 página; toolbar)

- [ ] **Step 1: Renombrar con git**
```bash
cd /var/www/educativa/cv && git mv pdf.html cv_pdf.html && ls cv_pdf.html
```
Expected: `cv_pdf.html` existe; `pdf.html` ya no.

- [ ] **Step 2: Agregar meta noindex**

Tras la línea `<meta name="viewport" ...>` en `cv_pdf.html`, insertar:
```html
<meta name="robots" content="noindex, nofollow">
```

- [ ] **Step 3: Sincronizar el reframe de copy (igual que index)**

Aplicar en `cv_pdf.html` (markup visible + ambas tablas i18n propias):
- `header.tagline` → ES "Project Management Digital · Comunicación · Producción Audiovisual" / EN "Digital Project Management · Communication · Audiovisual Production".
- `perfil.text` → mismos textos ES/EN de Task 1 Step 5/6.
- `exp.3f.title` → "Coordinación y Project Management Digital" / "Coordination & Digital Project Management".
- `exp.ggwp.title` → "Productor de Streaming" / "Streaming Producer".
- `sections.projects` → "Proyectos seleccionados" / "Selected projects".
- Herramientas: reagrupar a los 6 grupos (mismas claves/textos `tools.*` de Task 5). Si el espacio de 1 página obliga, en `cv_pdf.html` se pueden mostrar los grupos en 2 columnas compactas.
- Metas description/og/twitter equivalentes (si `cv_pdf.html` las tiene).

Verificación parcial:
```bash
grep -n "noindex\|Project Management Digital · Comunicación\|Proyectos seleccionados" cv_pdf.html | head
```

- [ ] **Step 4: Recortar a UNA página A4**

Objetivo: el contenido imprime en 1 sola página A4 (≈1123px de alto útil a 96dpi). Acciones concretas:
- Reducir bullets de cada rol de Experiencia a máximo 2 líneas/ítems clave.
- Proyectos: dejar Sie7e + 24v en forma compacta (Rol + Resultado en una línea; omitir Contexto extenso si no entra).
- Bajar tamaños base y espaciados en `@media print` (font-size del cuerpo ~10.5px, `gap`/`margin` reducidos).
- Mantener: Perfil, Experiencia, Proyectos clave, Educación, Herramientas, Idiomas, Contacto.

Medir altura real:
```bash
# servidor levantado; via Playwright evaluate sobre cv_pdf.html
# document.querySelector('.page').scrollHeight  <=  ~1123  (1 pagina)
```
Run (Playwright, viewport 1280x900, `cv_pdf.html?v=2`):
- `evaluate`: `() => { var p=document.querySelector('.page'); return {h:p.scrollHeight, a4:Math.round(297*96/25.4)}; }`
Expected: `h <= a4 + 40` (margen de tolerancia). Si excede, seguir recortando bullets/espaciado y volver a medir.

- [ ] **Step 5: Confirmar print A4 correcto**

Verificar que `cv_pdf.html` conserva `@page { size: A4; margin: 0; }` + `@media print` que oculta toolbar y evita `page-break-inside` en items. La toolbar interna (Volver→index, Exportar PDF, idioma) se mantiene (es página reservada, sus controles son de uso personal).
```bash
grep -n "@page\|@media print\|page-break-inside\|window.print" cv_pdf.html | head
```
Expected: reglas presentes.

- [ ] **Step 6: Verificar que index NO referencia cv_pdf**
```bash
grep -rn "cv_pdf\|pdf.html" index.html
```
Expected: 0.

- [ ] **Step 7: Commit**
```bash
git add -A && git commit -m "cv_pdf.html: pagina reservada (noindex), 1 pagina, copy sincronizado

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 9: Crear `cv_ats.html` (ATS-friendly, bilingüe, reservado)

**Files:**
- Create: `cv_ats.html`

Requisitos: una columna, fondo blanco, sin foto, sin íconos semánticos, sin cajas, HTML semántico (`h1/h2/ul`), texto plano, keywords ATS, toggle ES/EN, `noindex`, `@media print` A4.

- [ ] **Step 1: Crear el archivo completo**

Create `cv_ats.html`:
```html
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>CV ATS — Facundo García Mata</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; color: #111; background: #fff; max-width: 820px; margin: 0 auto; padding: 32px 28px 64px; line-height: 1.5; font-size: 14px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  .role-line { font-size: 14px; color: #222; margin: 0 0 4px; }
  .contact-line { font-size: 13px; color: #333; margin: 0 0 18px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: 0.04em; border-bottom: 1px solid #999; padding-bottom: 3px; margin: 22px 0 10px; }
  h3 { font-size: 14px; margin: 12px 0 2px; }
  .meta { font-size: 13px; color: #444; margin: 0 0 4px; }
  ul { margin: 4px 0 10px; padding-left: 20px; }
  li { margin: 2px 0; }
  p { margin: 0 0 8px; }
  .bar { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #ddd; padding: 8px 0; margin-bottom: 16px; display: flex; gap: 10px; }
  .bar a, .bar button { font: inherit; font-size: 12px; padding: 6px 12px; border: 1px solid #111; background: #fff; color: #111; cursor: pointer; text-decoration: none; }
  @media print {
    .bar { display: none !important; }
    body { max-width: none; padding: 0; font-size: 11px; }
    @page { size: A4; margin: 16mm 16mm; }
    h2 { page-break-after: avoid; }
    h3, li { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="bar">
    <a href="index.html" data-i18n="ats.back">← Volver</a>
    <button type="button" onclick="window.print()" data-i18n="ats.export">Exportar PDF</button>
    <button type="button" id="btnLang">EN</button>
  </div>

  <h1>Facundo García Mata</h1>
  <p class="role-line" data-i18n="ats.role">Comunicador · Project Manager Digital · Productor Audiovisual</p>
  <p class="contact-line">Rosario, Argentina · figarciamata@gmail.com · linkedin.com/in/facundogm</p>

  <h2 data-i18n="ats.h.profile">Perfil profesional</h2>
  <p data-i18n="ats.profile">Licenciado en Comunicación Social con experiencia en project management digital, producción audiovisual, estrategia de contenidos y desarrollo web. Combino mirada comunicacional, criterio narrativo y capacidad técnica para llevar proyectos desde la idea hasta la implementación. Keywords: Project Management Digital, coordinación de proyectos, comunicación digital, producción audiovisual, producción de contenidos, estrategia de contenidos, social media, branding, streaming, escaleta, booking, gestión de equipos, desarrollo web, HTML, CSS, JavaScript, SQL, Figma, Adobe Premiere, Photoshop, Illustrator, Canva, Trello, Google Workspace, Meta Business Suite.</p>

  <h2 data-i18n="ats.h.exp">Experiencia profesional</h2>

  <h3 data-i18n="ats.exp1.title">Desarrollador Full Stack — e-ducativa S.A.</h3>
  <p class="meta" data-i18n="ats.exp1.date">Sep 2022 – actualidad · Rosario, Argentina</p>
  <ul>
    <li data-i18n="ats.exp1.b1">Desarrollo y mantenimiento de features de un LMS multitenant con +2,5M de usuarios activos en 13 países y +600 clientes institucionales.</li>
    <li data-i18n="ats.exp1.b2">Coordinación con áreas de comercial, soporte y producto para shippear features a producción en una plataforma con +7.000 instalaciones activas.</li>
    <li data-i18n="ats.exp1.b3">Diseño de tooling interno para acelerar flujos de gestión y comunicación interárea.</li>
  </ul>

  <h3 data-i18n="ats.exp2.title">Coordinación y Project Management Digital — 3Factor Design</h3>
  <p class="meta" data-i18n="ats.exp2.date">Dic 2025 – actualidad</p>
  <ul>
    <li data-i18n="ats.exp2.b1">Coordinación de contenidos y estrategia digital del emprendimiento, alineando criterio visual con objetivos comerciales.</li>
    <li data-i18n="ats.exp2.b2">Construcción de branding desde cero: identidad, tono de marca y presentación comercial.</li>
    <li data-i18n="ats.exp2.b3">Gestión de social media con tracción comprobable: +2.400 cuentas alcanzadas y +4.300 visualizaciones en 90 días.</li>
  </ul>

  <h3 data-i18n="ats.exp3.title">Productor de Streaming — GGWP (MargaTV)</h3>
  <p class="meta" data-i18n="ats.exp3.date">Abr 2026 – actualidad</p>
  <ul>
    <li data-i18n="ats.exp3.b1">Escritura y revisión de la escaleta semanal del programa junto al conductor y coconductor.</li>
    <li data-i18n="ats.exp3.b2">Coordinación de planificación de contenidos, difusión previa y circulación posterior de clips con los equipos de diseño y redes.</li>
    <li data-i18n="ats.exp3.b3">Gestión de entrevistas (booking) con referentes, desarrolladores e iniciativas de la cultura gamer local.</li>
  </ul>

  <h2 data-i18n="ats.h.proj">Proyectos seleccionados</h2>
  <h3 data-i18n="ats.proj1.title">Sie7e Memorias Desde La Sombra (2025–2026)</h3>
  <p data-i18n="ats.proj1.body">Autor de la obra, productor de contenidos y gestor de proyecto. Proyecto final de grado en la convocatoria XperienciaUNR (UNR). Dispositivo educativo de memorial local y experiencia interactiva de realidad aumentada con narrativa transmedia. Calificación: 10.</p>
  <h3 data-i18n="ats.proj2.title">24 Veces Diciembre (2025)</h3>
  <p data-i18n="ats.proj2.body">Dirección, producción, guión y edición. Documental sobre memorias y huellas vinculadas a diciembre de 2001 en Rosario. Trabajo final de Formación Audiovisual Tecnológica (Lic. en Comunicación Social, UNR). Calificación: 10.</p>

  <h2 data-i18n="ats.h.edu">Educación</h2>
  <h3 data-i18n="ats.edu1.title">Licenciatura en Comunicación Social — Universidad Nacional de Rosario (2020–2026)</h3>
  <p class="meta" data-i18n="ats.edu1.detail">Orientación en Comunicación Estratégica y Producción Audiovisual. Proyecto final: Sie7e Memorias Desde La Sombra. Promedio: 8,97.</p>
  <h3 data-i18n="ats.edu2.title">Tecnicatura en Informática Profesional y Personal — Instituto Politécnico Superior (2013–2018)</h3>
  <p class="meta" data-i18n="ats.edu2.detail">Formación técnica en programación, redes, sistemas, administración de servicios y producción digital.</p>

  <h2 data-i18n="ats.h.skills">Habilidades</h2>
  <ul>
    <li data-i18n="ats.sk.pm"><strong>Project Management y coordinación:</strong> coordinación de proyectos, gestión de equipos, planificación, Trello, Google Workspace.</li>
    <li data-i18n="ats.sk.comms"><strong>Comunicación y contenidos:</strong> comunicación digital, estrategia de contenidos, producción de contenidos, branding, guión y escaleta.</li>
    <li data-i18n="ats.sk.av"><strong>Producción audiovisual:</strong> producción audiovisual, edición, streaming en vivo, Adobe Premiere, Audition.</li>
    <li data-i18n="ats.sk.design"><strong>Diseño:</strong> Illustrator, Photoshop, InDesign, Figma, Canva.</li>
    <li data-i18n="ats.sk.web"><strong>Desarrollo web:</strong> HTML, CSS, JavaScript, SQL, Perl, Wordpress, Git, GitHub.</li>
    <li data-i18n="ats.sk.social"><strong>Social media y plataformas:</strong> Instagram, LinkedIn, YouTube, Meta Business Suite, streaming, booking.</li>
  </ul>

  <h2 data-i18n="ats.h.lang">Idiomas</h2>
  <ul>
    <li data-i18n="ats.lang.es">Español: nativo.</li>
    <li data-i18n="ats.lang.en">Inglés: avanzado (C1).</li>
    <li data-i18n="ats.lang.fr">Francés: básico.</li>
    <li data-i18n="ats.lang.de">Alemán: básico.</li>
  </ul>

  <h2 data-i18n="ats.h.contact">Contacto</h2>
  <p>Email: figarciamata@gmail.com · LinkedIn: linkedin.com/in/facundogm · Rosario, Argentina</p>

<script>
(function () {
  'use strict';
  var I18N = { es: {}, en: {
    'ats.back': '← Back',
    'ats.export': 'Export PDF',
    'ats.role': 'Communicator · Digital Project Manager · Audiovisual Producer',
    'ats.h.profile': 'Professional profile',
    'ats.profile': 'Bachelor in Social Communication with experience in digital project management, audiovisual production, content strategy, and web development. I combine a communications mindset, narrative judgment, and technical capability to carry projects from idea to implementation. Keywords: digital project management, project coordination, digital communication, audiovisual production, content production, content strategy, social media, branding, streaming, rundown, booking, team management, web development, HTML, CSS, JavaScript, SQL, Figma, Adobe Premiere, Photoshop, Illustrator, Canva, Trello, Google Workspace, Meta Business Suite.',
    'ats.h.exp': 'Professional experience',
    'ats.exp1.title': 'Full Stack Developer — e-ducativa S.A.',
    'ats.exp1.date': 'Sep 2022 – present · Rosario, Argentina',
    'ats.exp1.b1': 'Develop and maintain features for a multitenant LMS with +2.5M active users across 13 countries and +600 institutional clients.',
    'ats.exp1.b2': 'Coordinate with sales, support, and product teams to ship features to production on a platform with +7,000 active installations.',
    'ats.exp1.b3': 'Design internal tooling to speed up cross-team management and communication workflows.',
    'ats.exp2.title': 'Coordination & Digital Project Management — 3Factor Design',
    'ats.exp2.date': 'Dec 2025 – present',
    'ats.exp2.b1': 'Coordinate content and digital strategy, aligning visual criteria with commercial goals.',
    'ats.exp2.b2': 'Built the brand from scratch: identity, brand voice, and commercial presentation.',
    'ats.exp2.b3': 'Manage social media with measurable traction: +2,400 accounts reached and +4,300 views in 90 days.',
    'ats.exp3.title': 'Streaming Producer — GGWP (MargaTV)',
    'ats.exp3.date': 'Apr 2026 – present',
    'ats.exp3.b1': "Write and review the show's weekly rundown with the host and co-host.",
    'ats.exp3.b2': 'Coordinate content planning, pre-broadcast outreach, and post-broadcast clip circulation with the design and social media teams.',
    'ats.exp3.b3': 'Manage interview booking with industry figures, developers, and local gaming-culture initiatives.',
    'ats.h.proj': 'Selected projects',
    'ats.proj1.title': 'Sie7e Memorias Desde La Sombra (2025–2026)',
    'ats.proj1.body': 'Author, content producer, and project manager. Final degree project in the XperienciaUNR open call (UNR). Educational local memorial device and interactive augmented reality experience with transmedia narrative. Final grade: 10.',
    'ats.proj2.title': '24 Veces Diciembre (2025)',
    'ats.proj2.body': 'Direction, production, screenplay, and editing. Documentary on memories and imprints linked to December 2001 in Rosario. Final project for Technological Audiovisual Training (BA in Social Communication, UNR). Final grade: 10.',
    'ats.h.edu': 'Education',
    'ats.edu1.title': 'Bachelor in Social Communication — Universidad Nacional de Rosario (2020–2026)',
    'ats.edu1.detail': 'Major in Strategic Communication and Audiovisual Production. Final project: Sie7e Memorias Desde La Sombra. GPA: 8.97.',
    'ats.edu2.title': 'Technical degree in Professional and Personal IT — Instituto Politécnico Superior (2013–2018)',
    'ats.edu2.detail': 'Technical training in programming, networks, systems, service administration, and digital production.',
    'ats.h.skills': 'Skills',
    'ats.sk.pm': '<strong>Project management & coordination:</strong> project coordination, team management, planning, Trello, Google Workspace.',
    'ats.sk.comms': '<strong>Communication & content:</strong> digital communication, content strategy, content production, branding, scripting & rundown.',
    'ats.sk.av': '<strong>Audiovisual production:</strong> audiovisual production, editing, live streaming, Adobe Premiere, Audition.',
    'ats.sk.design': '<strong>Design:</strong> Illustrator, Photoshop, InDesign, Figma, Canva.',
    'ats.sk.web': '<strong>Web development:</strong> HTML, CSS, JavaScript, SQL, Perl, Wordpress, Git, GitHub.',
    'ats.sk.social': '<strong>Social media & platforms:</strong> Instagram, LinkedIn, YouTube, Meta Business Suite, streaming, booking.',
    'ats.h.lang': 'Languages',
    'ats.lang.es': 'Spanish: native.',
    'ats.lang.en': 'English: advanced (C1).',
    'ats.lang.fr': 'French: basic.',
    'ats.lang.de': 'German: basic.',
    'ats.h.contact': 'Contact'
  }};
  var K_LANG = 'cv_lang';
  function setLang(lang) {
    if (lang !== 'en' && lang !== 'es') lang = 'es';
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = I18N[lang] && I18N[lang][el.dataset.i18n];
      if (v === undefined) return;            // es = textos por defecto del HTML
      if (v.indexOf('<') !== -1) el.innerHTML = v; else el.textContent = v;
    });
    var b = document.getElementById('btnLang');
    if (b) b.textContent = lang === 'es' ? 'EN' : 'ES';
    try { localStorage.setItem(K_LANG, lang); } catch (e) {}
  }
  document.getElementById('btnLang').addEventListener('click', function () {
    setLang(document.documentElement.getAttribute('lang') === 'es' ? 'en' : 'es');
  });
  try { setLang(localStorage.getItem(K_LANG) || 'es'); } catch (e) { setLang('es'); }
})();
</script>
</body>
</html>
```
(Patrón i18n: el ES vive como texto por defecto en el HTML; `I18N.es` vacío → al setear ES no se toca el DOM; `I18N.en` trae las traducciones. Mismo `K_LANG='cv_lang'` que index/cv_pdf para sincronizar idioma.)

- [ ] **Step 2: Verificar estructura ATS**

Run (servidor levantado):
```bash
grep -c "<img\|photo\|svg" cv_ats.html         # esperado 0 (sin foto/iconos)
grep -c "tools-grid\|two-col\|column-count" cv_ats.html   # esperado 0 (una sola columna)
grep -n "noindex" cv_ats.html                   # presente
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/cv_ats.html   # 200
```
Expected: sin imágenes/foto, sin multicolumna, noindex presente, 200.
Playwright `cv_ats.html?v=1`: una columna, texto plano; botón idioma alterna ES/EN; `window.print()` no rompe (stub o emulación). Verificar keywords ATS presentes (`grep -c "Project Management Digital\|HTML\|JavaScript\|Figma\|Adobe Premiere" cv_ats.html` ≥ 1).

- [ ] **Step 3: Commit**
```bash
git add cv_ats.html && git commit -m "Crear cv_ats.html (ATS-friendly, una columna, bilingue, noindex)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 10: robots.txt + verificación de no-exposición

**Files:**
- Create: `robots.txt`

Nota: en GitHub Pages **project site**, `robots.txt` solo es honrado en `facugm.github.io/robots.txt` (no en `/cv/robots.txt`). El mecanismo primario de no-indexado es el `<meta robots noindex>` por página (Tasks 8 y 9). Este `robots.txt` se agrega como best-effort/documentación.

- [ ] **Step 1: Crear robots.txt**

Create `robots.txt`:
```
User-agent: *
Disallow: /cv_pdf.html
Disallow: /cv_ats.html
Allow: /

Sitemap:
```
(Dejar `Sitemap:` vacío o quitar la línea; no se mantiene sitemap.xml.)

- [ ] **Step 2: Aserción global de no-exposición**

Run:
```bash
cd /var/www/educativa/cv
echo "=== refs publicas a paginas reservadas (esperado 0) ==="
grep -rn "cv_pdf\|cv_ats\|pdf.html" index.html | grep -v "noindex" || echo "OK: index limpio"
echo "=== noindex en reservadas (esperado 1 c/u) ==="
grep -c noindex cv_pdf.html cv_ats.html
```
Expected: `index.html` sin referencias a `cv_pdf`/`cv_ats`/`pdf.html`; `noindex` presente en ambas reservadas.

- [ ] **Step 3: Commit**
```bash
git add robots.txt && git commit -m "robots.txt: disallow paginas reservadas (best-effort en project site)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 11: Verificación integral, responsive/print y push

**Files:** ninguno (solo verificación) — luego push.

- [ ] **Step 1: Levantar servidor y barrido público (desktop)**

Run:
```bash
cd /var/www/educativa/cv && python3 -m http.server 8765 >/tmp/cvsrv.log 2>&1 &
sleep 1 && curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8765/index.html
```
Playwright (1280x900, `index.html?v=20`): verificar orden de secciones = Perfil → Experiencia → Proyectos seleccionados → Educación → Herramientas (6 grupos) → Idiomas → Contacto. Hero con triada nueva + bajada + 3 CTAs. Sin botón de descarga PDF/ATS. 0 errores consola.

- [ ] **Step 2: Barrido mobile**

Playwright (390x780, `index.html?v=21`): hero CTAs envuelven bien; scroll-reveal abre secciones; CTA "Ver proyectos" abre+scrollea; CTA "Contacto" abre+scrollea. Toggle ES/EN sin romper layout.

- [ ] **Step 3: Páginas reservadas accesibles solo por URL + print**

Playwright:
- `cv_pdf.html?v=20` (1280x900): contenido sincronizado; medir `.page` scrollHeight ≤ ~1163px (1 página); toolbar interna presente.
- `cv_ats.html?v=20`: una columna, sin foto; toggle idioma OK.
Run aserción final:
```bash
cd /var/www/educativa/cv
grep -rn "cv_pdf\|cv_ats" index.html | wc -l    # esperado 0
grep -c noindex cv_pdf.html cv_ats.html         # esperado 1 y 1
git status --porcelain                            # esperado vacío tras commits
```
Expected: 0 referencias públicas; noindex en ambas; árbol limpio.

- [ ] **Step 4: Limpiar artefactos de test**

Run:
```bash
cd /var/www/educativa/cv
git status --porcelain --untracked-files=all | grep '^??' || echo "sin untracked"
# borrar cualquier PNG/captura de test generada por Playwright antes de push
rm -f *.png 2>/dev/null; git checkout -- og-image.png 2>/dev/null || true
```
(Cuidado: NO borrar `og-image.png` ni `favicon.svg` versionados. Solo capturas nuevas no trackeadas.)

- [ ] **Step 5: Push (remote ya en SSH)**
```bash
cd /var/www/educativa/cv && git push && git log --oneline -8
```
Expected: push OK vía SSH (`git@github.com:facugm/cv.git`); historial muestra los commits de las Tasks 1–10.

---

## Self-Review (cobertura del spec)

- Reframe "CV interactivo expandido" + triada sin "Desarrollo": Task 1. ✔
- Bajada/subtitle: Task 1. ✔
- Hero CTAs (Proyectos/LinkedIn/Contacto), sin botones de descarga públicos: Task 2 + Task 7. ✔
- Perfil puente comunicación/gestión/audiovisual/tech: Task 1. ✔
- Experiencia con títulos de mercado: Task 3. ✔
- Proyectos seleccionados con microestructura Rol/Contexto/Responsabilidades/Resultado/Link (Sie7e + 24v; GGWP/3Factor solo en Experiencia): Task 4. ✔
- Educación: se mantiene (ya sintetizada; sin tarea de cambio). ✔
- Herramientas en 6 grupos: Task 5. ✔
- Idiomas: se mantiene. ✔
- Contacto (sección): Task 6. ✔
- cv_pdf.html reservado, 1 página, copy sincronizado, print A4: Task 8. ✔
- cv_ats.html (1 columna, sin foto, semántico, keywords, bilingüe): Task 9. ✔
- noindex en ambas reservadas + robots.txt (con nota de limitación project-site): Tasks 8/9/10. ✔
- Sin enlaces públicos a reservadas (header/hero/menú/footer/JSON-LD/sitemap): Task 7 + aserciones Tasks 10/11. ✔
- Sitemap.xml: no existe; no se crea (spec: "si existe, excluir"). Documentado. ✔
- Bilingüe ES/EN en todo: Tasks 1–9. ✔
- Sin login/backend/token: respetado. ✔

**Pendientes/limitaciones conocidas (comunicar al usuario):**
- `robots.txt` bajo `/cv/` no es honrado por crawlers en project site; el `noindex` por página es el mecanismo real.
- "1 página" en `cv_pdf.html` puede requerir iteración de recorte (Task 8 Step 4) según fuentes/altura; el criterio es medir `scrollHeight` y ajustar.
- No hay JSON-LD/structured data ni footer en el sitio actual → nada que limpiar ahí (verificado).
