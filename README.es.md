**Idioma / Language:** Español · [English](README.md)

<p align="center">
  <img src="assets/mascot/pip_flight_loop.gif" alt="Pip, el pájaro mensajero" width="200">
</p>

# Búsqueda de empleo con IA

*La búsqueda de empleo que se ejecuta en tu propia máquina.*

<p align="center">
  <a href="https://trendshift.io/repositories/43622?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-43622" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/43622/daily" alt="MadsLorentzen%2Fai-job-search | Trendshift" width="250" height="55"/></a>
</p>

[![CI](https://github.com/MadsLorentzen/ai-job-search/actions/workflows/ci.yml/badge.svg)](https://github.com/MadsLorentzen/ai-job-search/actions/workflows/ci.yml)

> 🇪🇸 **Esta es la adaptación para España**: un fork de
> [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) que añade
> skills de búsqueda en portales de empleo españoles, documentación en español, una
> matriz de compatibilidad de runtime/SO/arquitectura y una guía de IA con presupuesto cero. El
> proyecto original sigue siendo la implementación de referencia; consulta [Adaptar esto a España](#adaptar-esto-a-espana) más abajo.
>
> Versiones en español: [README.es.md](README.es.md) · [SETUP.es.md](SETUP.es.md) ·
> [CONTRIBUTING.es.md](CONTRIBUTING.es.md) · [SECURITY.es.md](SECURITY.es.md) ·
> [CHANGELOG.es.md](CHANGELOG.es.md) · [AGENTS.es.md](AGENTS.es.md) ·
> [COMPATIBILIDAD.md](COMPATIBILIDAD.md) · [GUIA_TECNICA.md](GUIA_TECNICA.md) ·
> [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md)

Un framework de solicitudes de empleo impulsado por IA construido sobre [Claude Code](https://claude.com/claude-code)
—y sobre **cualquier otro agente de IA de línea de comandos** que prefieras. Haz un fork, rellena tu
perfil y deja que tu agente evalúe ofertas de empleo, adapte tu CV, escriba cartas de presentación y te prepare
para las entrevistas. El flujo de trabajo también funciona con [Google Antigravity](https://antigravity.google/), la CLI de Codex,
la CLI de Gemini, Qwen Code, opencode, Aider, Cline, Continue, Goose y Crush; prioriza las opciones gratuitas; consulta
[COMPATIBILIDAD.md](COMPATIBILIDAD.md) y [SETUP.es.md](SETUP.es.md) para ver las
instrucciones paso a paso en Windows, macOS y Linux.

> Nota: este es un proyecto de código abierto independiente y no está afiliado a Anthropic, ni respaldado, patrocinado o mantenido por esta. Anthropic y Claude Code se mencionan únicamente para describir la cadena de herramientas que utiliza este flujo de trabajo.
>
> Este proyecto **no tiene ninguna criptomoneda, token ni programa de patrocinio de pago asociados**. Cualquier cosa que afirme lo contrario no está autorizada y debe tratarse como una estafa. Las únicas formas de apoyar el proyecto son el enlace de Ko-fi de abajo y contribuir en GitHub.

## ¿Funciona de verdad?

Me formé como geofísico. Cuando suprimieron mi puesto a finales de 2025, construí este framework para gestionar mi propia búsqueda de empleo: el mismo flujo de trabajo `/scrape`, `/apply` e `/interview` de este repositorio, usado cada semana, en mi propia carrera. Fui transparente al respecto con todas las empresas con las que hablé y, en lugar de jugar en mi contra, normalmente daba pie a una conversación técnica genuina.

Sesenta y nueve candidaturas personalizadas, veinte primeras entrevistas y un contrato firmado después, empecé como ingeniero de IA en junio de 2026. La gente no dejaba de preguntarme si esto funciona de verdad. A mí me consiguió el empleo. Ahora es tuyo.

*La versión larga, con el embudo completo de candidaturas, está en [LinkedIn](https://www.linkedin.com/in/mads-lorentzen/).*

<p align="center">
  <i>¿Te ha ahorrado un domingo escribiendo cartas de presentación? Invítame a un café.<br>
  ¿Te ha conseguido el empleo? Quizá a dos.</i> ☕
</p>

<p align="center">
  <a href="https://ko-fi.com/madslorentzen">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=6" alt="Buy me a coffee at ko-fi.com" height="40">
  </a>
</p>

## Qué es esto

Un flujo de trabajo estructurado que convierte tu agente de IA de línea de comandos en un asistente
de solicitudes de empleo integral. El flujo de trabajo principal (autoperfilado, evaluación del encaje y la
pipeline de candidatura redactor-revisor) es **independiente del idioma y del país**. Este fork incluye los
portales de empleo del mercado español (Tecnoempleo, InfoJobs) junto a las herramientas independientes del país
`linkedin-search` y `freehire-search`, y las demos danesas siguen instaladas pero
desactivadas: el patrón está diseñado para sustituirse por los portales de empleo de tu zona con
[`/add-portal`](#herramientas-de-busqueda-de-empleo).

```
/setup          /scrape              /apply <url>
  |                |                     |
  v                v                     v
Fill in        Search job           Evaluate fit
your profile   portals              Score & recommend
  |                |                     |
  v                v                     v
Profile        Present matches      Draft CV + Cover Letter
files ready    with fit ratings     (LaTeX, tailored)
                   |                     |
                   v                     v
               Pick a match         Reviewer agent critiques
               -> /apply            -> Revise -> Final output
```

El framework codifica las buenas prácticas de orientación profesional, incluyendo criterios de evaluación estructurados, un enfoque prospectivo en las cartas de presentación y un análisis comparativo de salarios opcional.

## Adaptar esto a España

Este fork (`BENDER35/ai-job-search-spain-freever`) es la adaptación para el mercado español. Comparado con el proyecto original:

| Área | Qué añade este fork |
|------|---------------------|
| **Portales de empleo** | `tecnoempleo-search` (Tecnoempleo, el portal de IT/telecom de España) e `infojobs-search` (InfoJobs, el mayor portal de España, a través de su API oficial y gratuita para desarrolladores), junto a `linkedin-search` y `freehire-search`, que son independientes del país y ya cubren España. Las cuatro demos danesas siguen instaladas pero desactivadas (`enabled: false`). |
| **Runtimes de IA** | Gestiona el flujo de trabajo desde Google Antigravity, Claude Code, la CLI de Codex, la CLI de Gemini, Qwen Code, opencode, Aider, Cline, Roo Code, Kilo Code, Continue, Goose, Crush, Cursor, Windsurf o el modo agente de Copilot; prioriza las opciones gratuitas. Las especificaciones canónicas siguen en `.claude/`; cualquier otro runtime lee un archivo de puntero fino. Matriz completa en [COMPATIBILIDAD.md](COMPATIBILIDAD.md). |
| **Sistemas operativos** | Windows 10/11, macOS (Intel y Apple Silicon) y Linux (x64 y ARM64, incluidas Raspberry Pi 4/5). Las arquitecturas x86 de 32 bits y ARMv7 no tienen build de Bun: en ese caso las CLI de portales en TypeScript se ejecutan con Node.js 22+ (`node --experimental-strip-types`) o `npx tsx`. Detalles en [COMPATIBILIDAD.md](COMPATIBILIDAD.md) y en `python3 tools/check_platform.py`. |
| **Documentación** | Versiones en español de todos los documentos de nivel superior, una guía técnica en ambos idiomas ([TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) / [GUIA_TECNICA.md](GUIA_TECNICA.md)) y [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md), una guía de nivel gratuito y bajo presupuesto sobre las IA que puedes usar para buscar empleo (incluido Ollama en hardware antiguo), con ediciones en DOCX y PDF. |

Todo lo demás —el ciclo de vida `/setup` → `/scrape` → `/rank` → `/apply` → `/interview` → `/outcome`, las plantillas, las herramientas de salario— funciona exactamente como lo documenta el proyecto original.

## Requisitos previos

- [Claude Code](https://claude.com/claude-code) (CLI). Claude Code no tiene nivel gratuito: necesitas una suscripción Claude Pro/Max/Team o créditos de la API de Anthropic (pago por token, normalmente más barato para un uso ocasional). **Este fork no requiere Claude Code**: cualquier agente de línea de comandos puede ejecutar las mismas especificaciones (Google Antigravity, la CLI de Codex, la CLI de Gemini, Qwen Code, opencode, Aider, Cline, Continue, Goose, Crush, ...), y las opciones gratuitas están documentadas en [SETUP.es.md](SETUP.es.md#qué-agente-de-iacli-usar-todos-son-opcionales-pero-elige-uno) y [COMPATIBILIDAD.md](COMPATIBILIDAD.md). Las skills de búsqueda en portales funcionan en todos ellos sin configuración adicional.
- Python 3.10+
- [Bun](https://bun.sh) (para las herramientas CLI de búsqueda de empleo)
- Una distribución de LaTeX con `lualatex` y `xelatex`: [TeX Live](https://tug.org/texlive/), [MacTeX](https://tug.org/mactex/), [TinyTeX](https://yihui.org/tinytex/) o [MiKTeX](https://miktex.org/). El CV se compila con `lualatex` (pdflatex a menudo falla en instalaciones modernas de MiKTeX con errores de expansión de la fuente `fontawesome5`); la carta de presentación se compila con `xelatex` porque `cover.cls` requiere `fontspec`. Si usas una instalación mínima de TeX como TinyTeX o BasicTeX, instala los paquetes adicionales que se enumeran en [SETUP.es.md](SETUP.es.md#instalación-mínima-de-tex-tinytexbasictex).
- Opcional: `pip install pypdf` para la comprobación de legibilidad ATS de `/apply` (BSD; no requiere Poppler). Poppler `pdftotext` sigue siendo un método alternativo (macOS: `brew install poppler`, Debian/Ubuntu: `apt install poppler-utils`, Windows: `choco install poppler`). Si faltan ambos, la comprobación se degrada a una revisión visual de palabras clave.

## Inicio rápido

> 🎥 **¿Prefieres verlo en acción primero?** [The Next New Thing hizo un recorrido práctico](https://www.youtube.com/watch?v=HoVxjMNFYv4) de cómo se usa realmente el flujo de trabajo, desde la configuración hasta una candidatura terminada (grabado en agosto de 2026; los comandos pueden haber cambiado desde entonces).

### 1. Haz un fork y clona

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
```

> [!IMPORTANT]
> **Un fork de este repositorio es siempre público** —GitHub no permite forks privados de
> repositorios públicos— y `/setup` (el paso 3 de abajo) escribe tus datos personales (nombre,
> datos de contacto, historial laboral, expectativas salariales) en archivos **rastreados por git**.
> Si esta copia es para tu propia búsqueda de empleo y no para devolver cambios al proyecto,
> usa un **repositorio privado** con este repositorio como `upstream` en su lugar: la receta
> de dos minutos está en [SETUP.es.md, sección 8](SETUP.es.md#8-traer-las-actualizaciones-del-upstream-a-tu-fork),
> y todos los flujos de actualización funcionan igual. Haz un fork solo para contribuir.

### 2. Instala las herramientas de búsqueda de empleo

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

Ejecuta `bun install` en todas las CLI de portales de `.agents/skills/*/cli/`: se descubren, no se enumeran, así que un portal que añadas con `/add-portal` o copies de otro fork también se incluye en un clon nuevo. Una CLI cuyo `package.json` declare un script de ciclo de vida en tiempo de instalación se omite y se notifica en lugar de ejecutarse. `--dry-run` muestra lo que instalaría.

Para `linkedin-search` y `freehire-search` la instalación es opcional: ninguno tiene dependencias en tiempo de ejecución y funcionan con `bun` a secas; `bun install` solo descarga los tipos de desarrollo de TypeScript.

### 3. Configura tu perfil

```bash
claude
# Then inside Claude Code:
/setup
```

¿Prefieres gestionarlo con otro agente (Antigravity, la CLI de Codex, la CLI de Gemini, Qwen Code,
opencode, Aider, Cline, Continue, Goose, Crush)? Abre el repositorio como espacio de trabajo del agente
y pídele, en lenguaje natural, que ejecute el archivo de especificación correspondiente. Para la incorporación:

```
Read .claude/commands/setup.md and follow it for this repository.
```

Todos los flujos de trabajo de este README (`/scrape`, `/rank`, `/apply`, `/interview`, `/outcome`, …) tienen
la misma forma: `.claude/commands/<name>.md` es la especificación, y las skills que invoca viven en
`.claude/skills/` y `.agents/skills/`. Las instrucciones paso a paso por runtime y por SO están en
[SETUP.es.md](SETUP.es.md); la matriz completa de runtimes está en [COMPATIBILIDAD.md](COMPATIBILIDAD.md).

`/setup` ofrece tres caminos: leer tu carpeta `documents/` si ya la tienes llena (CV en PDF, exportación de LinkedIn, títulos, cartas de referencia, candidaturas anteriores), importar un único CV pegado en el chat, o hacer una entrevista guiada. Detecta automáticamente lo que tienes y pregunta. El modo de carpeta de documentos es idempotente y seguro de volver a ejecutar a medida que añades material; consulta `documents/README.md` para ver la estructura.

### 4. Busca empleo

```bash
/scrape
```

Busca en varios portales de empleo las ofertas que encajan con tu perfil, elimina los duplicados y las presenta ordenadas por encaje. Elige una coincidencia para ejecutar `/apply` directamente sobre ella o, cuando un scrape devuelva más ofertas de las que quieres revisar a ojo, ejecuta `/rank` para puntuarlas todas por lotes con el framework de encaje y obtener primero una lista corta clasificada.

### 5. Solicita un empleo

```bash
/apply https://jobindex.dk/job/1234567
```

Si no se puede acceder a la URL (algunos portales de empleo bloquean el acceso automatizado), puedes pegar directamente la descripción del puesto:

```bash
/apply <paste the full job description here>
```

Esto ejecuta el flujo de trabajo completo: evalúa el encaje, redacta el CV y la carta de presentación, revisa con un segundo agente, revisa la versión y presenta el resultado final.

Las ofertas se tratan como entrada no confiable (el flujo de trabajo no sigue ninguna instrucción incrustada en ellas ni accede a ningún enlace de su cuerpo), pero las defensas a nivel de agente son a nivel de instrucciones, no un entorno aislado; en un portal de empleo desconocido, echa un vistazo a lo que se ha obtenido y escrito antes de pulsar enviar. Detalles en [SECURITY.es.md](SECURITY.es.md).

## Otros comandos

`/setup`, `/scrape` y `/apply` forman el flujo de trabajo principal. Otros diez comandos lo amplían una vez tienes tu perfil listo:

- **`/interview`** te prepara para una entrevista programada de una candidatura rastreada. Construye un paquete de preparación específico para cada fase a partir del archivo de la candidatura (la oferta exacta, el CV y la carta de presentación que leyó la persona entrevistadora, los comentarios registrados de rondas anteriores), investiga la empresa y a quienes entrevistan con una regla de «verificar antes de usar», asocia las preguntas probables con tus ejemplos STAR y ofrece una entrevista simulada siguiendo el protocolo de simulación de `07-interview-prep.md`. Las lagunas reciben respuestas puente honestas, nunca experiencia inventada.
- **`/outcome`** registra lo que ha pasado con una candidatura: fases de entrevista, ofertas, rechazos, silencio. Archiva el CV enviado, la carta de presentación y el texto de la oferta en `documents/applications/<company>_<role>/`, mantiene `outcome.md` en el formato que analiza el Camino A de `/setup` y actualiza el rastreador. También se ocupa del tramo previo a tener un resultado que registrar: `/outcome followup` saca a la luz candidaturas abiertas que se han quedado en silencio (por defecto 10 días), redacta un recordatorio breve y adecuado al canal en tu estilo de escritura usando solo afirmaciones de los materiales que ya enviaste (solo borradores, nunca los envía; como máximo dos veces por candidatura) y ofrece una nota de agradecimiento en el mismo turno en que se registra una fase de entrevista. Cuando se resuelven unas cuantas candidaturas, te remite de nuevo a `/setup` para calibrar el framework de encaje con lo que realmente consiguió entrevistas.
- **`/notion-sync`** publica una vista unidireccional y de solo lectura de la pipeline en una base de datos de Notion a través del servidor MCP oficial de Notion (OAuth, sin claves de API): una fila por cada oferta clasificada más cada candidatura rastreada, con una página informativa de escritura única por fila. Los archivos del repositorio siguen siendo el sistema de registro: nada se sincroniza de vuelta, y los documentos se sincronizan solo como nombres de archivo. Complementa a `/html-report`: aquel es el panel de control offline y profundo que regeneras en tu escritorio; este es la vista en vivo y de un vistazo desde donde funcione Notion (escritorio, web, móvil).
- **`/gmail-sync`** lee tu Gmail (a través del conector de Gmail) en busca de señales de estado de tus candidaturas abiertas (invitaciones a entrevistas, enlaces de pruebas, ofertas, rechazos) y las propone como un lote para que las apruebes antes de que se escriba nada en el rastreador o en `outcome.md`, citando el correo electrónico de origen en cada cambio propuesto. Las ofertas se quedan sin proponer `hired`/`offer_declined`, ya que esa decisión es tuya; las señales conflictivas o sin correspondencia se marcan para una pasada manual de `/outcome` en lugar de adivinarlas.
- **`/rank`** sirve de puente entre `/scrape` y `/apply`: puntúa por lotes todas las ofertas recién extraídas con el framework de encaje (agentes en paralelo obtienen cada oferta y puntúan las cinco dimensiones de evaluación) y devuelve una lista corta clasificada con las fortalezas y lagunas honestas de cada empleo. Los factores eliminatorios vetado, las fechas límite reciben marcas de urgencia y las ofertas muertas se marcan como caducadas. Elige un número y pasa al flujo completo de `/apply`.
- **`/expand`** enriquece tu perfil escaneando fuentes públicas que ya hayas enlazado en él (repositorios de GitHub, sitio de portafolio, Kaggle, Google Scholar) y buscando programas de estudios de cursos y certificaciones citados. Las competencias descubiertas se añaden a tu perfil con una etiqueta de origen. Útil justo después de `/setup` para sacar a la luz habilidades que los documentos por sí solos no hacen explícitas.
- **`/upskill`** analiza la brecha entre tu perfil, tus ofertas de empleo rastreadas y tus ofertas clasificadas pero no rastreadas (las lagunas registradas por `/rank` en `seen_jobs.json`), o una sola oferta mediante `/upskill <URL>`. Produce un mapa de calor priorizado de las brechas de habilidades y un plan de aprendizaje con recursos de estudio buscados en la web y estimaciones de tiempo. Útil para planificar la carrera entre candidaturas.
- **`/html-report`** genera un panel de control HTML autocontenido a partir de `job_search_tracker.csv` y de los archivos de candidaturas: tarjetas de estadísticas, gráficos de estado/sector/canal/embudo (SVG en línea, sin dependencias externas) y una tabla de candidaturas filtrable. Se abre directamente en un navegador, totalmente offline. Vuelve a ejecutarlo cuando quieras después de que `/apply` o `/outcome` añadan entradas nuevas.
- **`/add-template`** registra tu propia plantilla de CV o carta de presentación (LaTeX, Typst u otra cadena de herramientas) en lugar de las de serie. Captura las instrucciones de la plantilla (extensión del código fuente, comando de compilación, fuentes, reglas de estilo, límite de páginas), ejecuta una compilación de prueba obligatoria e integra la plantilla en `/apply`. Consulta [Plantillas personalizadas](#plantillas-personalizadas) más abajo.
- **`/add-portal`** genera una skill de búsqueda de portal de empleo para un portal de tu mercado. Investiga el portal (patrón de URL de búsqueda, estructura de resultados, reglas de acceso), crea el andamiaje de la skill CLI con la misma estructura que las que se incluyen y prueba una consulta en vivo antes de registrarla. Consulta [Herramientas de búsqueda de empleo](#herramientas-de-busqueda-de-empleo) más abajo.

`/reset` también está disponible; consulta [Empezar de cero](#empezar-de-cero) más abajo.

## Estructura de archivos

```
ai-job-search/
├── CLAUDE.md                          # Main candidate profile + workflow rules
├── .claude/
│   ├── commands/
│   │   ├── apply.md                   # /apply workflow (drafter-reviewer)
│   │   ├── setup.md                   # /setup onboarding (documents folder, CV import, or interview)
│   │   ├── expand.md                  # /expand competency enrichment from documents and online presence
│   │   ├── add-template.md            # /add-template register custom templates (LaTeX, Typst, ...)
│   │   ├── add-portal.md              # /add-portal generate a job-portal search skill for your market
│   │   ├── rank.md                    # /rank triage scraped jobs into a ranked shortlist
│   │   ├── outcome.md                 # /outcome record application results, archive materials
│   │   ├── gmail-sync.md              # /gmail-sync auto-detect application status from Gmail
│   │   ├── interview.md               # /interview stage-specific prep pack + mock interview
│   │   ├── html-report.md             # /html-report generate application tracker dashboard
│   │   ├── notion-sync.md             # /notion-sync one-way pipeline view in a Notion database
│   │   └── reset.md                   # /reset wipe profile data or documents folder
│   ├── skills/
│   │   ├── job-application-assistant/  # Core application skill
│   │   │   ├── SKILL.md               # Skill definition
│   │   │   ├── 01-candidate-profile.md # Your education, experience, skills
│   │   │   ├── 02-behavioral-profile.md# PI/DISC/personality assessment
│   │   │   ├── 03-writing-style.md    # Tone, structure, do's and don'ts
│   │   │   ├── 04-job-evaluation.md   # Scoring framework for job fit
│   │   │   ├── 05-cv-templates.md     # LaTeX CV structure + tailoring rules
│   │   │   ├── 06-cover-letter-templates.md # LaTeX cover letter templates
│   │   │   └── 07-interview-prep.md   # STAR examples + interview framework
│   │   ├── job-scraper/               # Job search orchestration
│   │   └── upskill/                   # /upskill skill gap analysis and learning plan
│   └── settings.json                  # Claude Code permissions (shared, scoped)
├── .agents/skills/                    # Job portal CLI tools
│   ├── infojobs-search/               # InfoJobs (Spain, official developer API)
│   ├── tecnoempleo-search/            # Tecnoempleo (Spain, IT/telecom board)
│   ├── jobbank-search/                # Akademikernes Jobbank (Denmark)
│   ├── jobdanmark-search/             # Jobdanmark.dk (Denmark)
│   ├── jobindex-search/               # Jobindex.dk (Denmark)
│   ├── jobnet-search/                 # Jobnet.dk (Denmark, government portal)
│   ├── linkedin-search/               # LinkedIn public job listings (country-agnostic)
│   └── freehire-search/               # freehire.me tech job aggregator (multi-market, REST API)
├── cv/
│   └── main_example.tex               # moderncv LaTeX template
├── cover_letters/
│   ├── cover.cls                      # Custom cover letter LaTeX class
│   ├── cover_example.tex              # Example cover letter (structural reference + CI smoke test)
│   └── OpenFonts/                     # Lato + Raleway fonts
├── templates/                         # Custom templates registered via /add-template
│   └── README.md                      # Folder layout instructions
├── documents/                         # Career source materials for /setup Path A and /expand
│   ├── README.md                      # Folder layout instructions
│   ├── cv/                            # Master CV (PDF or .tex)
│   ├── linkedin/                      # LinkedIn profile export (PDF)
│   ├── diplomas/                      # Degree certificates and transcripts
│   ├── references/                    # Reference letters
│   └── applications/                  # Past application records (<company>_<role>/)
├── .github/workflows/ci.yml           # CI: LaTeX smoke compiles, skill lint, CLI typechecks
├── salary_lookup.py                   # Salary benchmarking tool (BYO data)
├── tools/
│   ├── check_framework_version.py     # CI check: framework_version bumped when skill files change
│   ├── check_upstream_updates.py      # Preview which personalized files an upstream update touches
│   ├── convert_salary_excel.py        # Convert salary Excel to JSON
│   ├── install_portal_clis.py         # Install every discovered portal CLI (bun install)
│   ├── lint_skills.py                 # CI lint for skills, commands, settings.json
│   ├── robots_check.py                # Gate the browser-header retry against robots.txt
│   ├── security_guards.py             # CI guards: permission allowlist, gitignore rules, manifests
│   ├── upstream_triage.py             # Sort upstream commits into worth-reviewing vs probably-skip
│   ├── verify_layout.py               # Measure a compiled PDF's page layout (holes, orphans, footer collisions)
│   ├── verify_pdf.py                  # Verify a compiled PDF's page count and extractable text
│   └── README_SALARY_TOOL.md          # Salary tool setup instructions
├── job_scraper/                       # Scraper state (seen jobs, results)
├── gmail_sync/                        # /gmail-sync state (processed message IDs, last sync date)
├── upskill/                           # /upskill report output (markdown reports per run)
├── job_search_tracker.csv             # Application tracking spreadsheet
├── SETUP.md                           # Detailed setup guide
├── SETUP.es.md                        # Spanish setup guide
├── COMPATIBILITY.md                   # Runtime / OS / architecture compatibility matrix
├── COMPATIBILIDAD.md                  # Spanish compatibility matrix
├── TECHNICAL_GUIDE.md                 # How the framework works, end to end
├── GUIA_TECNICA.md                    # Spanish technical guide
├── busqueda_ia_bajosrecursoseconomicos.md  # Free/low-budget AI job-search guide (ES, + .pdf/.docx)
├── ai_low_budget_job_search.md        # Same guide in English (+ .pdf/.docx)
└── README.es.md                       # Spanish README (plus .es mirrors of SECURITY/CONTRIBUTING/CHANGELOG/AGENTS)
```

## Cómo funciona `/apply`

El comando `/apply` ejecuta un **flujo de trabajo redactor-revisor** con compilación obligatoria a PDF:

1. **Analiza** la oferta de empleo (URL o texto)
2. **Evalúa el encaje** con tu perfil (habilidades, experiencia, cultura, ubicación, alineación profesional)
3. **Redacta** un CV y una carta de presentación adaptados en LaTeX
4. **Lanza un agente revisor** que investiga la empresa y critica los borradores
5. **Revisa** según los comentarios del revisor
6. **Compila e inspecciona** ambos PDF: lualatex para el CV, xelatex para la carta de presentación. Claude lee las páginas renderizadas e itera sobre el LaTeX hasta que el CV tiene exactamente 2 páginas sin títulos de entrada huérfanos, y la carta de presentación tiene exactamente 1 página con la firma visible y las fuentes coherentes.
7. **Comprueba el CV con un ATS**: extrae la capa de texto del PDF (`pdftotext`, dependencia opcional) y la verifica tal como la ve un analizador ATS: los datos de contacto presentes como texto literal, sin glifos corruptos, un orden de lectura sensato; después puntúa la cobertura de palabras clave de la oferta frente a la extracción. Las palabras clave que el perfil respalda de verdad se añaden; las lagunas reales siguen visibles, nunca rellenadas artificialmente.
8. **Presenta** el resultado final con una lista de verificación

Todas las afirmaciones del CV y de la carta de presentación se verifican con tu perfil real. El sistema nunca inventa habilidades ni experiencia.

### Qué hace diferente a este flujo de trabajo

- **Bucle de verificación del PDF.** La mayoría de las plantillas de currículum en LaTeX producen un resultado que «se ve bien en el .tex» pero se rompe en el PDF: los títulos de los puestos quedan huérfanos en la página siguiente, las cartas de presentación se desbordan a la página 2, las fuentes de las viñetas vuelven silenciosamente a la fuente del cuerpo. El comando `/apply` compila e inspecciona visualmente cada PDF y aplica correcciones específicas (`\needspace`, `\enlargethispage`, contenedores que igualan la fuente de los elementos de lista) hasta que el diseño queda limpio. Esto se ejecuta automáticamente en cada candidatura.
- **Verificación ATS sobre la capa de texto del PDF.** Un ATS lee el texto incrustado del PDF, no la página renderizada, y LaTeX puede producir silenciosamente PDF cuyo texto se extrae como basura (glifos de iconos donde debería estar el correo electrónico, líneas entrelazadas de diseños a varias columnas). `/apply` extrae la capa de texto del CV compilado con `pdftotext` y verifica los datos de contacto, el orden de lectura y la cobertura de palabras clave de la oferta frente a lo que ve realmente un analizador. Se aplica una regla de honestidad: una palabra clave que el perfil no respalda se reconoce como una laguna, nunca se rellena artificialmente.
- **Recorte del CV ponderado por relevancia.** Cuando un CV se desborda de 2 páginas, el flujo de trabajo no recorta mecánicamente desde la sección «más antigua». Puntúa cada línea candidata según (a) su relevancia para la oferta objetivo, (b) su unicidad en el documento y (c) si la carta de presentación depende de ella, y recorta primero la línea con la puntuación total más baja. Una viñeta de un puesto antiguo que contiene palabras clave de la oferta sobrevive por delante de una viñeta de un puesto reciente que no las tiene.
- **Separación redactor-revisor.** El redactor escribe; un segundo agente Claude, lanzado con un contexto nuevo, investiga la empresa y critica los borradores. Después el redactor revisa. Esto detecta palabras clave omitidas, enfoques débiles y lenguaje genérico que una sola pasada suele dejar.
- **Envío eficiente del revisor en tokens.** El agente revisor recibe los borradores en línea en lugar de volver a leerlos, y la lista de verificación se ejecuta una vez al final del flujo de trabajo en lugar de duplicarse por ambos agentes. Nota: el nuevo paso de compilar e inspeccionar del Paso 5 gasta parte de ese ahorro en el renderizado del PDF y la iteración del diseño; el flujo de trabajo cambia algo de coste de tokens de extremo a extremo por una reducción real de los PDF defectuosos que llegan a la persona usuaria.

## Personalización

### Qué archivos editar manualmente

Si prefieres editar los archivos directamente en lugar de usar `/setup`:

| Archivo | Qué cambiar |
|------|---------------|
| `CLAUDE.md` | Tu perfil completo (nombre, formación, experiencia, habilidades, objetivos) |
| `01-candidate-profile.md` | Versión estructurada de los datos de tu CV |
| `02-behavioral-profile.md` | Tu evaluación conductual o autoevaluación |
| `04-job-evaluation.md` | Áreas de coincidencia de habilidades, objetivos profesionales, filtros de motivación |
| `05-cv-templates.md` | Plantillas de declaración de perfil para distintos tipos de puesto |
| `07-interview-prep.md` | Tus ejemplos STAR de experiencia real |
| `search-queries.md` | Consultas de búsqueda de empleo para tus habilidades y ubicación |

### Actualizar tus consultas de búsqueda

A medida que evolucionan tus prioridades, puedes reconfigurar solo la búsqueda de empleo sin volver a ejecutar toda la configuración del perfil:

```
/setup --section search
```

Esto vuelve a ejecutar la entrevista de configuración de búsqueda: qué puestos buscar, qué habilidades buscar, qué ubicaciones y qué portales. También sugiere tipos de puesto que quizá no hayas considerado, según tu perfil.

### Plantillas personalizadas

El CV usa [moderncv](https://ctan.org/pkg/moderncv) (estilo banking). La carta de presentación usa un `cover.cls` personalizado con fuentes Lato/Raleway. Ambas son LaTeX: el motor de referencia que este repositorio incluye y mantiene.

Para usar tu propia plantilla en su lugar —LaTeX, [Typst](https://typst.app/) o cualquier otra cadena de herramientas que compile a PDF desde la línea de comandos— ejecuta:

```
/add-template
```

Apúntalo a tu archivo fuente (un archivo `.tex` más los archivos `.cls`/`.sty` o las fuentes incluidas que necesite; un archivo `.typ` más los paquetes locales que necesite; o un equivalente para otra cadena de herramientas). El comando te entrevista para obtener las instrucciones de la plantilla (extensión del código fuente, comando de compilación, fuentes y dónde están, reglas de estilo que preservar, límite de páginas obligatorio), guarda todo bajo `templates/`, ejecuta una compilación de prueba obligatoria y activa la plantilla para que `/apply` redacte y compile a partir de ella. Las plantillas se guardan con tokens `[PLACEHOLDER]` en lugar de datos personales, así que son seguras de confirmar y compartir.

- `/add-template --list` muestra las plantillas registradas
- `/add-template --use <name>` cambia entre ellas
- `/add-template --use default` vuelve a las plantillas moderncv / cover.cls de serie

Si prefieres hacerlo a mano, la vía manual sigue funcionando: actualiza las indicaciones de `05-cv-templates.md` y `06-cover-letter-templates.md`.

### Herramientas de búsqueda de empleo

**Los portales españoles vienen incluidos en este fork.** `.agents/skills/` incluye:

- **`tecnoempleo-search`** — Tecnoempleo (tecnoempleo.com), el portal de empleo de IT/telecom de España, analizado a partir de sus páginas de resultados públicas, con **cero dependencias en tiempo de ejecución**. Solo para uso personal: mantén el volumen bajo. Consulta `.agents/skills/tecnoempleo-search/SKILL.md`.
- **`infojobs-search`** — InfoJobs (infojobs.net), el mayor portal generalista de España, a través de su **API oficial para desarrolladores** (registro gratuito en [developer.infojobs.net](https://developer.infojobs.net); la CLI lee `INFOJOBS_CLIENT_ID` e `INFOJOBS_CLIENT_SECRET` del entorno y falla con `MISSING_CREDENTIALS` cuando no están definidas). Consulta `.agents/skills/infojobs-search/SKILL.md`.
- **`linkedin-search`** y **`freehire-search`** — las herramientas independientes del país, ya útiles para España (`-l "Madrid, Spain"`, `--country ES`).

Las cuatro herramientas CLI danesas (Jobbank, Jobdanmark, Jobindex, Jobnet) se mantienen como ejemplos funcionales del patrón; vienen desactivadas (`enabled: false`) y permanecen apagadas en este fork. Para añadir otro portal para España —o para cualquier otro mercado— ejecuta:

```
/add-portal
```

Dale la URL de tu portal de empleo local. El comando investiga el portal (patrón de URL de búsqueda, estructura de la página de resultados, reglas de acceso/robots.txt), crea el andamiaje de una skill CLI con la misma estructura, comandos y contrato de salida que las que se incluyen, y prueba una consulta en vivo antes de registrar nada. Los portales con muro de autenticación se rechazan, y los portales con términos restrictivos reciben un aviso destacado de solo uso personal en la skill generada. La skill generada es específica de un mercado y vive en tu fork; el generador en sí es la parte universal.

¿Mantienes un fork adaptado a tu mercado o idioma? Añádelo al hilo [Community forks & adaptations](https://github.com/MadsLorentzen/ai-job-search/discussions/78) para que otros puedan encontrarlo.

Para puntos de partida **independientes del país** que funcionan en España y en otros lugares, el repositorio incluye dos skills de portales junto a las demos danesas:

- **`linkedin-search`** — construida sobre los endpoints públicos y sin autenticación `jobs-guest` de LinkedIn. Independiente del campo, con **cero dependencias en tiempo de ejecución** (funciona solo con `bun`), y toma la ubicación de búsqueda como una flag explícita, así que funciona para cualquier mercado sin configuración adicional (`-l "Berlin, Germany"`, `-l "Mumbai, Maharashtra, India"`, `-l "Remote"`, …). Pensada **solo para uso personal**: el acceso automatizado va contra las Condiciones de Servicio de LinkedIn, así que mantén el volumen bajo. Consulta `.agents/skills/linkedin-search/SKILL.md`.
- **`freehire-search`** — consulta la API REST pública del agregador [freehire.me](https://freehire.me) (JSON, sin clave de API). Centrada en tecnología (software, datos, ingeniería, DevOps, remoto), multi-mercado mediante flags de faceta (`--region`, `--country`, `--remote`) y con **cero dependencias en tiempo de ejecución**. A diferencia de los portales daneses que hacen scraping HTML, los resultados llegan estructurados (habilidades, nivel de experiencia, categoría). El backend tiene licencia MIT y es [autoalojable](https://github.com/strelov1/freehire): apunta `FREEHIRE_API_URL` a tu propia instancia si lo prefieres. Consulta `.agents/skills/freehire-search/SKILL.md`.

### Ampliar el framework: portales, plantillas, criterios — y tomar prestado de otros forks

Todo lo anterior suma un modelo de extensión, así que aquí está dicho sin rodeos. El framework tiene tres puntos de extensión, y ninguno requiere tocar el proyecto original:

1. **Skills de portales** — el sistema de módulos para portales de empleo. Cada skill `*-search` es una carpeta autocontenida bajo `.agents/skills/` con el mismo contrato (una CLI `search`/`detail`, salida `--format json|table|plain`, una flag `enabled:` en su `SKILL.md`, sus propias pruebas). `/scrape` descubre automáticamente cualquier skill instalada que siga el contrato: nada que registrar, nada que cablear. `/add-portal` genera otras nuevas; el [índice de portales de la comunidad](https://github.com/MadsLorentzen/ai-job-search/discussions/78) cataloga las que han construido otros forks.
2. **Plantillas de documentos** — `/add-template` registra cualquier cadena de herramientas de CV o carta de presentación que compile a PDF desde la línea de comandos, LaTeX o no.
3. **Criterios de evaluación** — los factores eliminatorios y las preferencias de tu perfil son de formato libre, y la rúbrica de evaluación puntúa contra lo que pongas allí. «Buenas condiciones de permiso parental», «salario mínimo X según el convenio de mi sindicato», «sin guardias»: cada uno es una línea del perfil, sin código, y tiene un peso real en las evaluaciones de encaje de `/rank` y `/apply`. El idioma es el único tipo de factor eliminatorio con un tratamiento dedicado y estructurado: `/setup` captura todos los idiomas en los que trabajas y tu nivel (preguntándolo directamente o infiriéndolo de tu CV/exportación de LinkedIn) en una tabla `Languages`, y la Barrera de Idiomas (`04-job-evaluation.md`) rechaza de forma tajante una oferta que requiera un idioma que no has declarado en absoluto, mientras que marca —sin rechazar automáticamente— una que pida un nivel superior al que declaraste en un idioma en el que sí trabajas, de modo que un caso límite (un listón estricto de «fluido» frente a tu propio B1/B2, por ejemplo) recibe tu criterio en lugar de una eliminación silenciosa.

**Tomar prestada una skill de portal de otro fork** es la forma prevista de obtener un portal que el proyecto original no incluye: encuéntralo en el [índice de portales](https://github.com/MadsLorentzen/ai-job-search/discussions/78), abre ese fork y copia esa única carpeta a tu propio `.agents/skills/`. Antes de ejecutarla:

- **Lee el código.** Todo él: estas CLI se ejecutan con aprobación previa en tu máquina (`.claude/settings.json` las incluye en la lista de permitidos) contra tus datos profesionales. Comprueba que las únicas llamadas de red van al portal de empleo que dice buscar, que `package.json` no tiene `dependencies` ni scripts de ciclo de vida (`postinstall`, etc.) y que nada lee ni escribe fuera de su propia carpeta.
- **Ejecuta sus pruebas offline** (`bun test` en el directorio `cli/` de la skill): las pruebas de una skill bien construida pasan sin acceso a la red.
- Comprueba la flag `enabled:` y las notas sobre condiciones de servicio de la propia skill.

El paso de copia es manual a propósito. Tus ajustes ya permiten que las skills de portales instaladas se ejecuten sin preguntar cada vez, así que un instalador que las obtuviera de repositorios de terceros por ti se saltaría la única comprobación que importa: que tú leas el código primero. No hay ninguno, y eso es una decisión de seguridad, no una función que falte.

Las *fuentes de datos* específicas de un mercado (una base de datos salarial nacional, tablas locales de índices) siguen el mismo patrón que los portales: pertenecen a un fork de mercado, compartidas mediante [#78](https://github.com/MadsLorentzen/ai-job-search/discussions/78), no al proyecto original.

### Análisis comparativo de salarios

La herramienta de salarios funciona con los datos salariales que le proporciones (estadísticas sindicales, exportaciones de Glassdoor, investigación personal, etc.). Consulta `tools/README_SALARY_TOOL.md` para ver el formato esperado y la configuración. Si no tienes datos salariales, el paso de salario simplemente se omite.

### Empezar de cero

Para borrar los datos de tu perfil y empezar de nuevo:

```
/reset profile    # clears skill files, preserves framework rules
/reset documents  # deletes files from documents/ folder
/reset all        # both
```

`/reset` muestra exactamente lo que se va a borrar y requiere que escribas `RESET` para confirmar. No se borra nada hasta que lo hagas.

### Mantenerse al día

El proyecto original avanza rápido. En lugar de traer `master` en bruto y confiar en la suerte, actualiza tu fork a una [release etiquetada](../../releases), un punto de control verificado que se describe en [CHANGELOG.es.md](CHANGELOG.es.md). `python3 tools/check_upstream_updates.py` muestra exactamente cuáles de tus archivos personalizados toca una actualización antes de que hagas el merge, y `python3 tools/upstream_triage.py` clasifica los commits en los que vas por detrás entre «merece la pena revisar» y «probablemente saltar» (un flujo de trabajo semanal puede publicarlo en un issue continuo). Recorrido completo en [SETUP.es.md, sección 8](SETUP.es.md#8-traer-las-actualizaciones-del-upstream-a-tu-fork).

## Consejos para obtener mejores resultados

### La profundidad del perfil importa

El factor más importante en la calidad del resultado es el nivel de detalle que pongas en tu perfil. Un perfil escaso produce candidaturas genéricas; uno detallado permite resultados genuinamente personalizados.

- **Descripciones de puestos:** no te limites a enumerar títulos de empleo. Describe lo que hacías de verdad en cada puesto: proyectos concretos, herramientas usadas, responsabilidades y logros medibles. Cuanto más material proporciones, con más precisión podrá el sistema reformular tu experiencia para distintos puestos.
- **Habilidades en contexto:** en lugar de enumerar «Python» o «gestión de proyectos», describe cómo y dónde los has aplicado. «Creé pipelines de ML para la predicción de bajas de clientes en Python con scikit-learn» le da al sistema mucho más con lo que trabajar que «Python, aprendizaje automático».
- **Todos los caminos de incorporación funcionan:** ya apuntes `/setup` a tu carpeta `documents/`, pegues un solo CV o hagas la entrevista guiada, el principio es el mismo: una entrada más rica produce una salida más nítida.

### Descubrimiento de trayectorias profesionales

El framework admite dos modos distintos de búsqueda de empleo:

- **Objetivo explícito:** sabes qué puestos o sectores quieres. El sistema ayuda a perfilar y priorizar según el encaje.
- **Descubrimiento de oportunidades latentes:** al analizar tu historial completo (no solo los títulos de los puestos, sino el trabajo real que hiciste), el sistema puede sacar a la luz trayectorias profesionales que no habías considerado. Habilidades transferibles que encajan en sectores inesperados, patrones en lo que disfrutabas o en lo que destacabas, o puestos emergentes que combinan tu experiencia de dominio con tecnología nueva.

Para sacar el máximo partido a esto, dedica tiempo durante `/setup` a describir no solo tu experiencia, sino qué te daba energía, qué te agotaba y qué querrías tener más. Este contexto influye directamente en cómo el sistema evalúa el encaje y en qué puestos saca a la luz durante `/scrape`.

## Ejecutar esto con poco o ningún dinero

Todos los runtimes de IA de la matriz de compatibilidad de este fork tienen un nivel gratuito, y el propio flujo de trabajo no cuesta
nada ejecutarlo: el único ingrediente de pago que el proyecto original daba por supuesto era Claude Code. Empieza por:

- **[busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md)** (español) /
  **[ai_low_budget_job_search.md](ai_low_budget_job_search.md)** (inglés): cómo registrarte en el
  nivel gratuito de cada IA relevante, cómo instalar los agentes de línea de comandos gratuitos en Windows, Linux y
  macOS, cómo ejecutar un modelo local con **Ollama** (incluso en máquinas por debajo de Intel de 8.ª generación, y por debajo
  de la 5.ª generación, con la tabla de modelo/RAM), las alternativas a Ollama (LM Studio, Jan, GPT4All,
  llamafile, LocalAI, KoboldCpp, …), Google Antigravity y sus alternativas, y un plan realista de 30 días
  a 0 €. También disponible en `.docx` y `.pdf` (generados con `python3 tools/md_to_docx.py`).
- **[COMPATIBILIDAD.md](COMPATIBILIDAD.md)**: con qué agente gestionarlo, en qué SO y arquitectura de CPU,
  y cuáles son genuinamente gratuitos.
- **`python3 tools/check_platform.py`**: muestra lo que tu máquina puede ejecutar (herramientas Python, CLI de Bun,
  alternativa con Node, LaTeX) y qué instalar a continuación.

## Contribuir

¿Estás pensando en hacer un PR? Lee primero [CONTRIBUTING.es.md](CONTRIBUTING.es.md): explica qué se fusiona, qué vive en los forks y por qué. Ten en cuenta que este repositorio es un **fork de mercado**: las skills de portales españoles, la documentación en español y las guías de compatibilidad pertenecen aquí, mientras que el proyecto original sigue siendo una plantilla independiente del país.

## Agradecimientos

- [Mikkel Krogholm](https://github.com/mikkelkrogsholm) ([repositorio de skills](https://github.com/mikkelkrogsholm/skills)) por las skills CLI de búsqueda de empleo
- Construido con [Claude Code](https://claude.com/claude-code) por [Anthropic](https://anthropic.com)
- Adaptación para España mantenida en [BENDER35/ai-job-search-spain-freever](https://github.com/BENDER35/ai-job-search-spain-freever)

## Licencia

MIT
