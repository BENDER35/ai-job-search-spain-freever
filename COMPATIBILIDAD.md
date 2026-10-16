# Compatibilidad - Búsqueda de empleo con IA (España)

**English:** [COMPATIBILITY.md](COMPATIBILITY.md)

## Por qué existe este documento

Este repositorio es la **adaptación para España** del framework
[AI Job Search](README.es.md) (proyecto original: `MadsLorentzen/ai-job-search`).
Hay dos cosas que lo diferencian del original, y esta página documenta ambas:

1. **Está orientado al mercado laboral español.** El fork incluye habilidades
   (skills) para portales de empleo españoles junto a las que son independientes
   del país, de modo que `/scrape` busca en portales españoles desde el primer
   momento.
2. **No depende de un único agente de IA.** El proyecto original es nativo de
   Claude Code. Este fork está pensado para *cualquier* agente de IA de línea de
   comandos o de IDE - **priorizando los niveles gratuitos** - en Windows, macOS
   y Linux, en máquinas de 64 bits x86_64 y ARM64 (con advertencias honestas
   para equipos de 32 bits).

Nada de lo que aparece aquí es una promesa de soporte más allá de lo indicado.
Cuando el estado de una herramienta es incierto o no se verificó en una máquina
real, así se dice.

### Documentación de este repositorio en español

| Documento | Enlace |
|-----------|--------|
| Léeme principal | [README.es.md](README.es.md) |
| Puesta en marcha | [SETUP.es.md](SETUP.es.md) |
| Guía para contribuir | [CONTRIBUTING.es.md](CONTRIBUTING.es.md) |
| Seguridad | [SECURITY.es.md](SECURITY.es.md) |
| Historial de cambios | [CHANGELOG.es.md](CHANGELOG.es.md) |
| Guía para agentes | [AGENTS.es.md](AGENTS.es.md) |
| Guía técnica | [GUIA_TECNICA.md](GUIA_TECNICA.md) |
| Búsqueda de empleo con IA y bajos recursos económicos | [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md) |

## Compatibilidad con agentes y runtimes de IA

"Detecta nuestras instrucciones automáticamente" significa que la herramienta
lee `AGENTS.md` o uno de los archivos de puntero fino (thin-pointer) de este
repositorio sin que tengas que pegar nada en el chat. "Freemium" significa que la
herramienta es gratuita o de código abierto, pero el *modelo* puede costar dinero
(usas tu propia clave, "bring your own key"), o bien existe un nivel gratuito
alojado con límites.

| Herramienta | ¿Nivel gratuito? | Windows | macOS | Linux | ¿Detecta nuestras instrucciones automáticamente? | Cómo se maneja |
|-------------|------------------|---------|-------|-------|--------------------------------------------------|----------------|
| **Google Antigravity** | Gratuito (nivel Individual); Pro / Ultra de pago | ✓ | ✓ | ✓ | Sí - `AGENTS.md` y `GEMINI.md`, además de `.agents/skills/` | Abre el repositorio en el IDE orientado a agentes; el agente lee el puntero y después le pides que siga `.claude/commands/<nombre>.md` |
| **Claude Code** | De pago - sin nivel gratuito (suscripción Pro / Max / Team o créditos de la API) | ✓ | ✓ | ✓ | Sí, de forma nativa - `CLAUDE.md`, `.claude/commands/`, `.claude/skills/` | `claude` y después `/setup`, `/scrape`, `/apply`, ... |
| **OpenAI Codex CLI** | Freemium - la CLI es gratuita y de código abierto; el modelo requiere ChatGPT Plus/Pro o créditos de la API | ✓ | ✓ | ✓ | Sí - `AGENTS.md` | `codex`; pídele que siga `.claude/commands/<nombre>.md` |
| **Gemini CLI** | Era gratuito (60 pet./min, 1.000/día) - **retirado el 18 jun 2026** en favor de Antigravity CLI | ✓ | ✓ | ✓ | Sí - `GEMINI.md` | `gemini` (solo instalaciones antiguas); en caso contrario, usa Antigravity |
| **Qwen Code CLI** | Freemium - CLI de código abierto; el nivel gratuito por OAuth terminó el 15 abr 2026 (quedan vías gratuitas: modelos locales, cuota de DashScope) | ✓ | ✓ | ✓ | Sí - `QWEN.md` | `qwen`; pídele que lea `AGENTS.md` y los archivos de comandos |
| **opencode** | Gratuito y de código abierto - usa tu propio modelo (hay modelos gratuitos) | ✓ | ✓ | ✓ | Sí - `AGENTS.md` | `opencode` |
| **Aider** | Gratuito y de código abierto - usa tu propio modelo (API de pago o un modelo local gratuito) | ✓ | ✓ | ✓ | En parte - carga `CONVENTIONS.md` cuando se lo pides | `aider --read CONVENTIONS.md` y después indica el archivo de comando |
| **Cline** (VS Code) | Freemium - la extensión es gratuita y de código abierto; usa tu propia clave | ✓ | ✓ | ✓ | Sí - `.clinerules` | Instala la extensión; las reglas se cargan solas |
| **Roo Code** | Freemium - **descontinuado el 15 may 2026**; migra a Kilo Code o Cline | - | - | - | Leía `.clinerules` / las reglas de Roo mientras existió | Histórico |
| **Continue** | Freemium y de código abierto - **según los informes, descontinuado a mediados de 2026 tras su adquisición por Cursor; verifícalo antes de adoptarlo** | ✓ | ✓ | ✓ | Sí - `.continue/rules/` y `AGENTS.md` | Coloca una regla en `.continue/rules/` |
| **Goose** (Block) | Gratuito y de código abierto - usa tu propio modelo | ✓ | ✓ | ✓ | Sí - `.goosehints` (también respeta `AGENTS.md`) | `goose` |
| **Charm Crush** | Gratuito y de código abierto (FSL) - usa tu propio modelo | ✓ | ✓ | ✓ | Sí - `AGENTS.md` y `.agents/skills/*/SKILL.md` | `crush` |
| **Kilo Code** | Freemium - extensión de VS Code de código abierto; usa tu propia clave (créditos iniciales gratuitos) | ✓ | ✓ | ✓ | Sus propias reglas en `.kilocode/rules/`; **no** lee `.clinerules` | Añade una regla en `.kilocode/rules/` |
| **Zed** (panel de agente) | Editor gratuito - usa tu propio modelo (Zed Pro opcional) | ✓ | ✓ | ✓ | Sí - `AGENTS.md` y `.rules` | Abre el proyecto y usa el panel de agente |
| **GitHub Copilot** (modo agente / agente de programación) | Freemium - nivel gratuito ~2.000 autocompletados + ~50 peticiones de chat/agente al mes; Pro ~10 $/mes | ✓ | ✓ | ✓ | Sí - `.github/copilot-instructions.md` (también carga `AGENTS.md`) | Modo agente de VS Code o `github.com/copilot/agents` |
| **Cursor** | Freemium - nivel Hobby gratuito; Pro ~20 $/mes | ✓ | ✓ | ✓ | Sí - `.cursor/rules/*.mdc` y `AGENTS.md` (`.cursorrules` está obsoleto) | Abre la carpeta |
| **Windsurf** | Freemium - nivel gratuito; Pro ~15 $/mes | ✓ | ✓ | ✓ | Sí - `.windsurfrules` (heredado), `.windsurf/rules/` y `AGENTS.md` | Abre la carpeta |

Si no necesitas Claude Code en concreto, **Google Antigravity es el punto de
partida recomendado sin coste** para un IDE agéntico completo, y **opencode,
Goose o Crush** son las opciones de terminal de bajo coste; consulta más abajo.

## Cómo funciona el diseño de punteros finos

Este repositorio guarda una sola copia de cada especificación y apunta a ella
desde todos los runtimes. No se duplica nada, así una mejora del proyecto
original llega a todos los runtimes a la vez.

| Capa | Dónde está | Qué es |
|------|------------|--------|
| Punto de entrada entre runtimes | [`AGENTS.md`](AGENTS.md) (en español: [AGENTS.es.md](AGENTS.es.md)) | El archivo que todo agente debe leer primero; en él se declara la regla de que `.claude/` es la única fuente de verdad. |
| Perfil del candidato | [`CLAUDE.md`](CLAUDE.md) + `.claude/skills/job-application-assistant/01-*.md` | Tu nombre, formación, experiencia, competencias y preferencias. |
| Especificaciones de flujo de trabajo canónicas | [`.claude/`](.claude/) | `.claude/commands/*.md` (setup, scrape, rank, apply, outcome, interview, upskill, ...) y `.claude/skills/*/SKILL.md`. |
| CLIs de búsqueda en portales | [`.agents/skills/`](.agents/skills/) | "Agent Skills" portables: un `SKILL.md` por portal, detectado automáticamente por `/scrape`. |
| Archivos de puntero fino | raíz del repositorio y archivos ocultos | Indican a un runtime concreto dónde está lo anterior; **no** contienen especificaciones. |

**Qué archivo lee cada runtime:**

- **Claude Code** lee `CLAUDE.md` y el árbol `.claude/` de forma nativa.
- **Google Antigravity** lee `AGENTS.md` y `GEMINI.md`.
- **Codex CLI, opencode, Zed, Windsurf, Crush y Kilo Code** leen `AGENTS.md`.
- **Gemini CLI** lee `GEMINI.md`; **Qwen Code** lee `QWEN.md`.
- **Cline** lee `.clinerules`; **Cursor** lee `.cursor/rules/*.mdc` (y `AGENTS.md`).
- **Aider** lee `CONVENTIONS.md` cuando lo cargas; **Goose** lee `.goosehints`.
- **GitHub Copilot** lee `.github/copilot-instructions.md` (y `AGENTS.md`).

**Los comandos con barra son un artefacto de Claude Code.** `/setup`, `/scrape`,
`/apply` y el resto se activan porque Claude Code lee
`.claude/commands/<nombre>.md`. En **cualquier otro runtime** haces lo mismo a
mano:

- Para ejecutar un flujo de trabajo, pide al agente que **ejecute el archivo de
  especificación correspondiente**, por ejemplo: *"sigue
  `.claude/commands/scrape.md`"* o *"lee `.claude/commands/apply.md` y haz lo
  que dice"*.
- Para cargar una habilidad (skill), pídele que lea
  **`.claude/skills/<nombre>/SKILL.md`** (o la habilidad de portal en
  `.agents/skills/<nombre>/SKILL.md`).

Eso es toda la historia de compatibilidad: los mismos archivos, otro trabajo.

## Google Antigravity y sus alternativas

**Google Antigravity** es el **IDE orientado a agentes** de Google: un entorno de
programación construido en torno a un agente autónomo más que al autocompletado.
Tiene un **nivel Individual gratuito** (con límites de uso semanales), funciona
en **Windows, macOS y Linux** y puede usar los modelos Gemini de Google y otros
(Claude, GPT-OSS). Lo importante para este repositorio: **detecta
automáticamente las reglas de `AGENTS.md` o `GEMINI.md`** y lee las habilidades
en el formato Agent Skills de `.agents/skills/`, así que este espacio de trabajo
funciona sin configuración por runtime.

Google además **retiró Gemini CLI el 18 de junio de 2026** y trasladó a ese
público a **Antigravity CLI** (compatible con las construcciones de Gemini CLI).
El puntero `GEMINI.md` se mantiene porque Antigravity lo lee y porque las
instalaciones y forks de Gemini CLI que siguen vivos también lo hacen.

### Alternativas y cuándo elegir cada una

| Runtime | Elige este si... |
|---------|------------------|
| **Google Antigravity** | Quieres el IDE agéntico **gratuito** más completo, en cualquier sistema operativo y con la mínima configuración. |
| **VS Code + Cline / Kilo Code** | Ya trabajas en VS Code y quieres una **extensión de código abierto** con tu propia clave (Roo Code está descontinuado; Kilo Code es su sucesor). |
| **Cursor** | Quieres un IDE de IA muy pulido y no te importa pagar ~20 $/mes (nivel Hobby para probarlo). |
| **Windsurf** | Quieres un IDE estilo Cursor con **nivel gratuito** y Cascade. |
| **Zed** | Quieres un editor **rápido y de código abierto** con panel de agente integrado y soporte nativo de `AGENTS.md`. |
| **OpenAI Codex CLI** | Prefieres un agente de terminal y ya pagas ChatGPT Plus/Pro o tienes créditos de la API. |
| **Qwen Code CLI** | Quieres un agente de terminal de código abierto y puedes aportar una clave o ejecutar un modelo Qwen local. |
| **opencode** | Quieres un agente de terminal de código abierto que lee `AGENTS.md` y funciona con cualquier modelo, incluso gratuitos. |
| **Aider** | Quieres programación en pareja muy orientada a git desde el terminal. |
| **Goose (Block)** | Quieres un agente local extensible que va más allá de la programación (extensiones MCP). |
| **Charm Crush** | Quieres un agente de terminal pulido, hecho en Go, y no te importa la licencia FSL. |

Cada uno de estos obtiene las instrucciones del repositorio mediante los archivos
de puntero de abajo: apuntas la herramienta al espacio de trabajo una vez y lee
las mismas especificaciones canónicas.

### Archivos de puntero de este repositorio

Cada archivo es un puntero corto que nombra `AGENTS.md`, `CLAUDE.md`, `.claude/`
y `.agents/skills/`, y deja claro que las especificaciones no deben duplicarse.

| Archivo de puntero | Runtime | Notas |
|--------------------|---------|-------|
| [`GEMINI.md`](GEMINI.md) | Gemini CLI / Antigravity | Gemini CLI está retirado (18 jun 2026); Antigravity lee este archivo, así que el puntero sigue sirviendo para la vía de Antigravity. |
| [`QWEN.md`](QWEN.md) | Qwen Code CLI | Lo lee Qwen Code automáticamente. |
| [`CONVENTIONS.md`](CONVENTIONS.md) | Aider | Cárgalo con `aider --read CONVENTIONS.md`. |
| [`.cursorrules`](.cursorrules) | Cursor (heredado) | Obsoleto - se mantiene como respaldo; se prefieren `.cursor/rules/*.mdc` y `AGENTS.md`. |
| [`.cursor/rules/ai-job-search.mdc`](.cursor/rules/ai-job-search.mdc) | Cursor | Regla de proyecto moderna, `alwaysApply: true`. |
| [`.windsurfrules`](.windsurfrules) | Windsurf (heredado) | Windsurf moderno también lee `.windsurf/rules/*.md` y `AGENTS.md`. |
| [`.clinerules`](.clinerules) | Cline (y herramientas compatibles con Cline) | Markdown plano. |
| [`.goosehints`](.goosehints) | Goose | Indicaciones en lenguaje natural; Goose también respeta `AGENTS.md`. |
| [`.github/copilot-instructions.md`](.github/copilot-instructions.md) | GitHub Copilot | Instrucciones para todo el repositorio en el modo agente de VS Code y el agente de programación; también carga `AGENTS.md`. |

La puesta en marcha paso a paso, por runtime y por sistema operativo, está en
[SETUP.es.md](SETUP.es.md) ([SETUP.md](SETUP.md) en inglés).

## Sistemas operativos y arquitecturas de CPU

Todo en el framework es Markdown puro, Python (solo la biblioteca estándar para
las herramientas) y TypeScript ejecutado por [Bun](https://bun.sh). No hay ningún
binario que compilar por arquitectura.

| Plataforma | Arquitectura | CLIs de portal (Bun) | CLIs de portal (alternativa con Node) | Herramientas Python | LaTeX (`lualatex`/`xelatex`) |
|------------|--------------|----------------------|----------------------------------------|---------------------|-------------------------------|
| Linux | x86_64 | ✓ | ✓ | ✓ | ✓ |
| Linux | ARM64 (incl. Raspberry Pi 4/5) | ✓ | ✓ | ✓ | ✓ |
| macOS | Apple Silicon (ARM64) | ✓ | ✓ | ✓ | ✓ |
| macOS | Intel (x86_64) | ✓ | ✓ | ✓ | ✓ |
| Windows | x86_64 | ✓ | ✓ | ✓ | ✓ |
| Windows | ARM64 | ✓ (Bun nativo para ARM64) | ✓ | ✓ | ✓ - comprueba el soporte ARM64 de tu distribución de TeX |
| Cualquiera | 32 bits (i686/ia32, armv7) | ✗ - Bun **no** publica compilaciones para ia32/armv7 | ✓ con Node.js 22+ o `npx tsx`, donde exista un runtime de 32 bits | ✓ - CPython 3.10+ | ✓ - pero las distribuciones de TeX de 32 bits (TeX Live/MiKTeX/MacTeX) están cada vez más descontinuadas |

**Particularidades de Windows.** Todo funciona desde **PowerShell**, el clásico
**cmd**, **Git Bash** o **WSL2**. Usa `python` en lugar de `python3` y rutas con
barra invertida si no estás en Git Bash/WSL2:
`python tools\check_platform.py`. WSL2 es lo más parecido a una instalación de
Linux y es la opción que da menos sorpresas.

**Equipos de 32 bits.** La única limitación real: **Bun no tiene compilaciones de
32 bits**, así que los CLIs de portal en TypeScript no pueden ejecutarse con Bun.
Sí funcionan con **Node.js 22+**:

```bash
node --experimental-strip-types .agents/skills/linkedin-search/cli/src/cli.ts --help
# o, sin una versión de Node compatible:
npx tsx .agents/skills/linkedin-search/cli/src/cli.ts --help
```

Las **herramientas de Python** (`tools/*.py`) solo necesitan **CPython 3.10+** y
la biblioteca estándar, así que funcionan en 32 bits. Los binarios de **LaTeX**
existen para 32 bits, pero TeX Live, MiKTeX y MacTeX están dejando de publicar
compilaciones de 32 bits poco a poco: considéralo descontinuado y prefiere una
máquina de 64 bits para `/apply`.

## Comprobar tu propia máquina

La respuesta más rápida:

```bash
python3 tools/check_platform.py     # Windows (PowerShell/cmd): python tools\check_platform.py
```

Imprime tu sistema operativo y su versión, la arquitectura de la máquina, si es
de 32 o 64 bits y un veredicto de compatible / no compatible para las
herramientas de Python, los CLIs de portal con Bun, la vía alternativa con Node
y LaTeX, además de las versiones detectadas de Bun/Node/Python y sugerencias de
siguientes pasos. Siempre termina con código 0: es un informe, no un filtro.

Comprobaciones manuales, si lo prefieres:

| Sistema | Comando |
|---------|---------|
| Linux / WSL2 / Git Bash | `uname -a; uname -m; python3 --version; node --version; bun --version; lualatex --version; xelatex --version` |
| macOS | `sw_vers; uname -m; python3 --version; node --version; bun --version; lualatex --version; xelatex --version` |
| Windows (PowerShell) | `Get-ComputerInfo \| Select-Object OsName, OsVersion, OsArchitecture; python --version; node --version; bun --version` |
| Windows (cmd) | `ver & systeminfo \| findstr /C:"System Type"` |
| 32/64 bits (cualquiera) | `python -c "import struct; print(struct.calcsize('P') * 8, 'bit')"` |

## Notas sobre el mercado español

Este fork añade **habilidades para portales de empleo españoles** en
[`.agents/skills/`](.agents/skills/) - ejecuta `ls .agents/skills/` para ver
exactamente cuáles están instaladas en tu copia del repositorio. Siguen el mismo
contrato portable que el resto del repositorio (`search`/`detail`,
`--format json|table|plain`, un `SKILL.md` por portal) y `/scrape` las detecta
automáticamente; ninguna necesita un paso de registro aparte.

- **Portales españoles** (p. ej. `tecnoempleo-search`, `infojobs-search`) -
  Tecnoempleo e InfoJobs. InfoJobs usa su API oficial para desarrolladores. Ambos
  incluyen frases de activación en español en su `SKILL.md`.
- **Independientes del país, y ambos cubren España:** `linkedin-search` (indica
  una ciudad española o `Remote` en la opción de ubicación) y `freehire-search`
  (centrado en tecnología; multi-mercado con `--region`/`--country`/`--remote`).
- **Portales de demostración daneses** (`jobbank-search`, `jobdanmark-search`,
  `jobindex-search`, `jobnet-search`) vienen con `enabled: false`; déjalos
  desactivados salvo que tu mercado sea Dinamarca.

Las habilidades de portal son **solo para uso personal**: mantén bajo el volumen
de peticiones automatizadas y respeta las condiciones de cada portal. Para añadir
otro portal español (alternativas a InfoJobs, portales autonómicos de empleo
público, portales tecnológicos de nicho), ejecuta `/add-portal` desde Claude Code,
o pide a cualquier otro agente que siga `.claude/commands/add-portal.md`;
investiga el portal, genera la habilidad y prueba una consulta real antes de
registrarla.

## Advertencias honestas

- **Verificado en esta máquina:** **Linux x86_64** de 64 bits con Python 3.15,
  Bun 1.4.3, Node 25.9 y TeX Live 2026 (`lualatex` + `xelatex`). El informe de
  arriba lo generó `tools/check_platform.py` en esa máquina.
- **No probado aquí:** Apple Silicon, Windows, Windows sobre ARM64, Linux ARM64
  (Raspberry Pi) y cualquier equipo de 32 bits. Su compatibilidad se deduce de
  las compilaciones publicadas por los fabricantes y de que este repositorio no
  incluye binarios compilados, pero no se ejecutó en esas máquinas como parte de
  este fork.
- **Las herramientas de agentes cambian muy rápido.** Los niveles gratuitos, los
  nombres de los archivos de instrucciones y la propia existencia de algunos
  productos cambiaron durante 2026 (Gemini CLI retirado; Roo Code descontinuado;
  el estado de Continue descrito como descontinuado). Los nombres de arriba son
  las convenciones a fecha de **octubre de 2026**; si una herramienta ignora un
  archivo de puntero, consulta su propia documentación para conocer la
  convención vigente.
- **Ningún runtime está garantizado.** Claude Code es el runtime de referencia
  sobre el que se prueba el framework original. Los demás runtimes leen las
  mismas especificaciones, pero su comportamiento no está cubierto por la CI de
  este repositorio.
