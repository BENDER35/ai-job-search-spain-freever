# Guía de configuración

Instrucciones paso a paso para poner en marcha el framework AI Job Search.

> **English:** esta guía también está disponible en inglés en [SETUP.md](SETUP.md).

## 1. Requisitos previos

### Claude Code

Instala Claude Code (la CLI de Anthropic para Claude):

```bash
npm install -g @anthropic-ai/claude-code
```

Necesitarás una clave de API de Anthropic o una suscripción Claude Pro/Team. Consulta la [documentación de Claude Code](https://docs.anthropic.com/en/docs/claude-code) para más detalles.

### Qué agente de IA/CLI usar (todos son opcionales, pero elige uno)

Todo lo que el framework necesita de verdad es Markdown plano: tus archivos de perfil, las especificaciones de los flujos de trabajo en `.claude/commands/` y `.claude/skills/`, y las skills de portales en `.agents/skills/`. Nada de esto está atado a un proveedor, así que puedes manejarlo con **cualquier** agente de IA capaz de leer archivos de una carpeta y ejecutar comandos de shell dentro de ella. Instala uno, abre este repositorio como espacio de trabajo y ya está: no hay ningún plugin que compilar.

Si buscas empleo desde España con poco presupuesto, prioriza un entorno con plan gratuito: **Google Antigravity** (interfaz gráfica, plan gratuito, sin clave de API) o **Gemini CLI** (terminal, plan gratuito generoso). El recorrido completo con Antigravity está en la sección 9.

> **Una precisión sobre los comandos con barra.** `/setup`, `/apply`, `/rank`, `/interview` y el resto son **archivos de comando de Claude Code**: viven en `.claude/commands/<nombre>.md` y solo Claude Code los convierte en comandos `/barra` literales. (El scraping es una *skill*, no un comando: su especificación está en `.claude/skills/job-scraper/SKILL.md`, así que no existe `.claude/commands/scrape.md`.) En cualquier otro entorno obtienes el mismo comportamiento pidiéndole al agente, en lenguaje natural, que **siga la especificación de ese archivo**; por ejemplo, «sigue `.claude/commands/setup.md`». El archivo Markdown *es* la especificación; no hay que reescribir nada.

#### Google Antigravity — plan gratuito

El IDE agéntico de Google: una interfaz gráfica que manejas conversando, gratis con una cuenta personal de Google y sin necesidad de clave de API. Lee los archivos de instrucciones del repositorio cuando abres la carpeta.

- **Aplicación de escritorio (todos los SO):** descárgala desde <https://antigravity.google/download> — macOS 12+ (Apple Silicon o Intel), Windows 10+ (64 bits) y Linux (Ubuntu 20+/Debian 10+/Fedora 36+/RHEL 8+).
- **CLI:**
  - macOS / Linux:
    ```bash
    curl -fsSL https://antigravity.google/cli/install.sh | bash
    ```
  - Windows (CMD):
    ```cmd
    curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
    ```
- **Coste:** plan gratuito.
- **Cómo usar este repositorio:** abre la carpeta del repositorio como espacio de trabajo y pídele al agente que siga el archivo del flujo de trabajo (por ejemplo, *«lee `.claude/commands/setup.md` y ejecútalo»*). Los pasos completos están en la sección 9.

#### Claude Code — de pago (suscripción Pro/Max o créditos de la API)

El entorno de referencia, y el único donde los comandos con barra funcionan tal cual. La instalación está más arriba; necesita Node.js 18+ y una suscripción Claude Pro/Max o créditos de la API de Anthropic. De pago, pero la experiencia más pulida. Lee `CLAUDE.md` y todo lo que hay bajo `.claude/`.

#### OpenAI Codex CLI — plan gratuito con una cuenta de ChatGPT, o créditos de la API

El agente de terminal de código abierto de OpenAI. Lee el `AGENTS.md` de este repositorio.

```bash
npm i -g @openai/codex
```

Funciona en Windows, macOS y Linux (Node.js 18+). El uso gratuito está incluido con un plan de pago de ChatGPT (con una cuota menor en el plan gratuito); también puedes pagar por token con una clave de la API de OpenAI. Ejecuta `codex` en la raíz del repositorio y pídele que siga `.claude/commands/setup.md`.

#### Gemini CLI — plan gratuito generoso

El agente de terminal de código abierto de Google y el equivalente gratuito más cercano a Claude Code. Lee `GEMINI.md` por defecto y también respeta `AGENTS.md`.

```bash
npm i -g @google/gemini-cli
```

Funciona en los tres SO (Node.js 18+). Gratis con una cuenta personal de Google (en el momento de escribir esto, unas 60 solicitudes/minuto y 1.000/día). Como este repositorio incluye `AGENTS.md` y no un `GEMINI.md`, o bien ejecuta `/memory add AGENTS.md` dentro de la sesión, o bien añade un `GEMINI.md` de una sola línea que diga `See AGENTS.md`.

#### Qwen Code CLI — apto para el plan gratuito

Un fork de código abierto de Gemini CLI ajustado para los modelos Qwen de Alibaba, con una cuota gratuita amplia. Lee `QWEN.md` y `AGENTS.md`.

```bash
npm install -g @qwen-code/qwen-code@latest   # or: brew install qwen-code
```

Apúntalo al `AGENTS.md` de este repositorio con `/memory add AGENTS.md`. Plan gratuito (unas 2.000 solicitudes/día); trae tu propia clave de API para más.

#### opencode — gratis (tú pones el modelo)

Un agente nativo de terminal y de código abierto. La herramienta en sí es gratuita; tú aportas el proveedor del modelo (funcionan muchas opciones baratas y gratuitas, incluidos los modelos locales). Lee `AGENTS.md`.

```bash
curl -fsSL https://opencode.ai/install | bash          # macOS / Linux
npm install -g opencode-ai                              # any OS (Node.js)
```

En Windows también puedes usar `choco install opencode` o `scoop install opencode`.

#### Aider — gratis (tú pones el modelo)

Un veterano programador en pareja de terminal, instalado como paquete de Python. Gratis y de código abierto; solo pagas al proveedor del modelo que elijas. También se puede instalar con `pipx install aider-chat` o `brew install aider`. Lee lo que le pases con `--read` (y `CONVENTIONS.md` si existe).

```bash
python -m pip install aider-install
aider-install
```

Aider no descubre los archivos de instrucciones por sí solo, así que carga las especificaciones de forma explícita:

```bash
aider --read AGENTS.md --read .claude/commands/setup.md
```

#### Cline — extensión gratuita (tú pones el modelo)

Una extensión agéntica autónoma, gratuita y de código abierto para VS Code, que se instala desde el Marketplace de VS Code («Cline») en cualquier SO. La extensión es gratuita; tú conectas un modelo (incluidos modelos locales vía Ollama, o una clave gratuita de Gemini). Lee `AGENTS.md` y `.clinerules/`.

#### Continue — extensión gratuita (tú pones el modelo)

Un asistente de chat y edición, gratuito y de código abierto, para VS Code y JetBrains, que se instala desde el marketplace («Continue»). Extensión gratuita; trae tu propio modelo o ejecuta uno local. Añade `AGENTS.md` en su configuración de «Rules» para que cargue las especificaciones del repositorio.

#### Goose — gratis (tú pones el modelo)

El agente local de código abierto de Block, como CLI o como aplicación de escritorio. Gratis; tú aportas el proveedor del modelo. Lee `.goosehints`; copia `AGENTS.md` en `.goosehints` o menciónalo en tu prompt.

```bash
curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash   # macOS / Linux
brew install block-goose-cli                                                                     # macOS / Linux
```

También hay una versión de escritorio para Windows/macOS/Linux en la página de releases de Goose.

#### Crush — gratis (tú pones el modelo)

El agente de terminal de Charm. Gratis y de código abierto; trae tu propio proveedor. Lee `CRUSH.md`, `AGENTS.md` y `.crush/`.

```bash
npm install -g @charmland/crush            # any OS (Node.js)
brew install charmbracelet/tap/crush       # macOS / Linux
winget install charmbracelet.crush         # Windows
```

#### Comparativa rápida

| Herramienta | Coste | SO compatibles | Archivo de instrucciones incluido | Notas |
|-------------|-------|----------------|------------------------------------|-------|
| **Google Antigravity** | Plan gratuito | Windows, macOS, Linux | `AGENTS.md` | Interfaz gráfica + agéntica; sin clave de API. Ver sección 9 |
| **Claude Code** | De pago (Pro/Max o créditos de la API) | Windows, macOS, Linux | `CLAUDE.md` (+ `.claude/`) | Único entorno donde los comandos `/barra` funcionan tal cual |
| **OpenAI Codex CLI** | Plan gratuito (cuenta de ChatGPT) o créditos de la API | Windows, macOS, Linux | `AGENTS.md` | Agente de terminal |
| **Gemini CLI** | Plan gratuito (generoso) | Windows, macOS, Linux | `GEMINI.md` / `AGENTS.md` | Equivalente gratuito más cercano a Claude Code |
| **Qwen Code CLI** | Plan gratuito (generoso) | Windows, macOS, Linux | `QWEN.md` / `AGENTS.md` | Fork de Gemini CLI |
| **opencode** | Gratis (tú pones el modelo) | Windows, macOS, Linux | `AGENTS.md` | TUI de terminal |
| **Aider** | Gratis (tú pones el modelo) | Windows, macOS, Linux | `CONVENTIONS.md` / `AGENTS.md` (vía `--read`) | Python; carga explícita de archivos |
| **Cline** | Extensión gratuita (tú pones el modelo) | VS Code (todos los SO) | `AGENTS.md` / `.clinerules` | Extensión de editor |
| **Continue** | Extensión gratuita (tú pones el modelo) | VS Code, JetBrains | `AGENTS.md` | Extensión de editor |
| **Goose** | Gratis (tú pones el modelo) | Windows, macOS, Linux | `.goosehints` / `AGENTS.md` | CLI + escritorio |
| **Crush** | Gratis (tú pones el modelo) | Windows, macOS, Linux | `CRUSH.md` / `AGENTS.md` | TUI de terminal |

> **Consejo de coste para España:** las CLI de portales bajo `.agents/skills/*/cli/` son programas locales, así que rastrear portales de empleo no consume ningún crédito de IA. Lo único que pagas es el agente con el que las manejas, y los planes gratuitos de arriba (Antigravity, Gemini CLI) son más que suficientes. Los límites de los planes gratuitos cambian a menudo, así que comprueba la página del proveedor antes de confiar en uno.

### Python

Se requiere Python 3.10+ para la herramienta de consulta de salarios. Compruébalo con:

```bash
python3 --version
```

En Windows, `py --version` suele ser la comprobación más fiable. Si tu sistema expone Python como `python` en lugar de `python3`, usa `python` en los comandos siguientes.

### Bun (para las herramientas de búsqueda de empleo)

Las CLI de portales de empleo (cuatro portales daneses más las herramientas `linkedin-search` y `freehire-search`, independientes del país) están escritas en TypeScript y se ejecutan con Bun.

- macOS/Linux:

```bash
curl -fsSL https://bun.sh/install | bash
```

- Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://bun.sh/install.ps1 | iex"
```

Si prefieres un gestor de paquetes, `winget install Oven-sh.Bun` también funciona en Windows.

### LaTeX (para compilar CVs y cartas de presentación)

Instala una distribución de LaTeX para compilar los archivos `.tex` generados a PDF:

- **Windows:** [MiKTeX](https://miktex.org/download)
- **macOS:** [MacTeX](https://tug.org/mactex/)
- **Linux:** `sudo apt install texlive-full` o `sudo dnf install texlive-scheme-full`

El CV se compila con `lualatex` (pdflatex suele fallar en instalaciones modernas de MiKTeX con errores de expansión de fuentes de `fontawesome5`). La carta de presentación se compila con `xelatex` porque `cover.cls` necesita `fontspec` para sus fuentes personalizadas Lato/Raleway.

#### Instalación mínima de TeX: TinyTeX/BasicTeX

Las distribuciones completas de TeX funcionan sin más, pero las distribuciones mínimas necesitan algunos paquetes extra antes de que compilen las plantillas incluidas.

En macOS, una instalación de TinyTeX a nivel de usuario evita un instalador para todo el sistema y no requiere `sudo`:

```bash
curl -fsSL https://yihui.org/tinytex/install-bin-unix.sh -o /tmp/tinytex-install-bin-unix.sh
sh /tmp/tinytex-install-bin-unix.sh /tmp --no-path
export PATH="$HOME/Library/TinyTeX/bin/universal-darwin:$PATH"
```

Después instala las dependencias de la plantilla:

```bash
tlmgr install \
  moderncv fontawesome5 fontawesome6 academicons import luatexbase pgf \
  titlesec textpos xltxtra xunicode cite realscripts needspace
```

Para BasicTeX/MacTeX, asegúrate primero de que el directorio de binarios de TeX está en el `PATH` (por ejemplo, mediante `/Library/TeX/texbin`) y luego ejecuta el mismo comando `tlmgr install ...`.

Pruebas rápidas de humo tras la instalación:

```bash
cd cv && lualatex -interaction=nonstopmode -halt-on-error main_example.tex && cd ..

SMOKE_DIR="$(mktemp -d /tmp/ai-job-cover-smoke.XXXXXX)"
cp -R cover_letters/cover.cls cover_letters/OpenFonts "$SMOKE_DIR/"
cat >"$SMOKE_DIR/cover_smoke.tex" <<'EOF'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
EOF
(cd "$SMOKE_DIR" && xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex)
```

#### Windows: Basic MiKTeX

El instalador completo de MiKTeX incluye todos los paquetes de CTAN y funciona sin más, pero el instalador más pequeño de [Basic MiKTeX](https://miktex.org/download) (`basic-miktex-*.exe`) solo trae un conjunto mínimo de paquetes y necesita un par de ajustes puntuales antes de que compilen las plantillas incluidas.

Por defecto, MiKTeX instala los paquetes que faltan a demanda, pero muestra un aviso gráfico por cada uno, lo que bloquea las terminales no interactivas (incluida la herramienta Bash de Claude Code). Conviértelo en una autoinstalación silenciosa:

```powershell
initexmf --admin --set-config-value=[MPM]AutoInstall=1
initexmf --set-config-value=[MPM]AutoInstall=1
```

(Ejecuta la primera línea desde un PowerShell con privilegios elevados o de administrador si instalaste MiKTeX para todos los usuarios; la segunda cubre una instalación por usuario. Solo se aplicará una según cómo lo hayas instalado; ejecutar ambas es inofensivo).

Si prefieres no depender en absoluto de las instalaciones sobre la marcha (por ejemplo, para una compilación totalmente sin conexión más adelante), preinstala el mismo conjunto de paquetes que enumera la sección de TinyTeX para macOS, usando el gestor de paquetes de MiKTeX:

```powershell
mpm --admin --install=moderncv --install=fontawesome5 --install=fontawesome6 --install=academicons --install=import --install=luatexbase --install=pgf --install=titlesec --install=textpos --install=xltxtra --install=xunicode --install=cite --install=realscripts --install=needspace
```

Omite `--admin` si MiKTeX está instalado solo para el usuario actual. Si un nombre de paquete no se resuelve, `mpm --find=<name>` busca el nombre correcto en el repositorio.

Pruebas rápidas de humo tras la instalación (PowerShell):

```powershell
Set-Location cv; lualatex -interaction=nonstopmode -halt-on-error main_example.tex; Set-Location ..

$SmokeDir = New-Item -ItemType Directory -Path (Join-Path $env:TEMP "ai-job-cover-smoke-$(Get-Random)")
Copy-Item cover_letters\cover.cls, cover_letters\OpenFonts -Destination $SmokeDir -Recurse
@'
\documentclass[]{cover}
\begin{document}
\namesection{Test}{Candidate}{test@example.com}
\companyname{Example Company}
\companyaddress{123 Hiring Street\\Example City}
\currentdate{\today}
\lettercontent{Dear Hiring Manager,}
\lettercontent{This smoke test verifies that xelatex can load cover.cls and the bundled fonts.}
\closing{Sincerely,}
\signature{Test Candidate}
\end{document}
'@ | Set-Content (Join-Path $SmokeDir "cover_smoke.tex")
Push-Location $SmokeDir; xelatex -interaction=nonstopmode -halt-on-error cover_smoke.tex; Pop-Location
```

### Opcional: extracción de texto ATS (pypdf y, después, pdftotext)

`/apply` ejecuta una comprobación de legibilidad ATS sobre el CV compilado: extrae la capa de texto del PDF y verifica los datos de contacto, el orden de lectura y la cobertura de palabras clave tal como los ve un sistema de seguimiento de candidaturas.

El extractor por defecto es **pypdf** (BSD, `pip install pypdf`). `pdftotext` de Poppler sigue siendo un respaldo opcional:

- **macOS:** `brew install poppler`
- **Debian/Ubuntu:** `sudo apt install poppler-utils`
- **Windows:** `choco install poppler`

Si algún comando sigue usando `pdftotext -layout`, también debe pasar `-enc UTF-8`. Si **ninguno** de los dos extractores está disponible, `/apply` omite la comprobación mecánica con un aviso y recurre a una revisión visual de palabras clave; todo lo demás funciona con normalidad.

### Compatibilidad multiplataforma y arquitecturas de CPU

Todo en este repositorio funciona en las tres plataformas de escritorio mayoritarias, pero tanto la vía de instalación como la arquitectura de la CPU importan:

- **Windows** — PowerShell o `cmd`. Las CLI se instalan con `npm i -g …` (Node) o con los scripts de cada proveedor; `winget`, `choco` y `scoop` cubren la mayoría, y MiKTeX y Poppler tienen sus propios instaladores (ver más arriba).
- **macOS** — Intel y Apple Silicon. Bun, Node y todos los agentes de aquí ofrecen compilaciones nativas para ambas arquitecturas, y Homebrew (`/opt/homebrew` en Apple Silicon, `/usr/local` en Intel) los instala.
- **Linux** — x64 y ARM64, incluida una Raspberry Pi 4/5 con un sistema operativo de 64 bits.

Notas sobre arquitecturas:

- **x86_64 (amd64) y ARM64 (aarch64) son totalmente compatibles** en los tres sistemas operativos.
- En **x86 de 32 bits** o **ARMv7 / armhf** (por ejemplo, una Raspberry Pi con un sistema operativo de 32 bits, donde Bun no tiene compilación), ejecuta las CLI de portales en TypeScript con **Node.js 22+** usando `node --experimental-strip-types`, o con `tsx`, en lugar de `bun`. Las herramientas de Python solo necesitan CPython 3.10+, que funciona dondequiera que se ejecute Python.
- Si `bun --version` falla, `/scrape` no se bloquea: el flujo de trabajo recurre automáticamente a `WebSearch` (ver [Solución de problemas](#solución-de-problemas)).

La matriz de compatibilidad completa, con notas por herramienta, está en [COMPATIBILITY.md](COMPATIBILITY.md) (versión en español: [COMPATIBILIDAD.md](COMPATIBILIDAD.md)).

## 2. Haz un fork y clona el repositorio

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
gh repo set-default <your-github-username>/ai-job-search
```

O manualmente: haz el fork en GitHub y luego clona tu fork.

> **La línea `set-default` no es opcional.** `gh repo fork --clone` establece el
> repositorio **upstream** como repositorio predeterminado de gh ("The `upstream` remote will be set as
> the default remote repository" — `gh repo fork --help`), y gh usa el predeterminado para
> **crear issues y PRs**. Sin esa línea, cualquier `gh issue create` posterior ejecutado desde este
> clon —por ti o por un agente al que hayas pedido que haga seguimiento de tus candidaturas— se
> registra en silencio en el rastreador **público** del upstream, publicando lo que contenga el issue
> bajo tu identidad de GitHub, en un repositorio donde no puedes borrarlo (#389).

> **Antes de seguir: los forks son públicos.** GitHub no puede hacer privado un fork de un
> repositorio público, y `/setup` (sección 6) escribe tus datos personales en archivos
> **rastreados**: subir esos commits a un fork los publica. Si esta copia es para tu propia
> búsqueda de empleo y no para contribuir, prefiere un **repositorio privado** con este repositorio
> como `upstream`: consulta la sección 8, paso 1, para ver los comandos exactos y por qué commitear
> tu personalización ahí sigue siendo lo correcto. Todo lo demás de esta guía funciona
> igual en ambos casos.

## 3. Instala las dependencias de las CLI de búsqueda de empleo
Ejecuta estos comandos desde la raíz del repositorio.

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

Ejecuta `bun install` en cada CLI de portal bajo `.agents/skills/*/cli/` —descubiertas, no listadas, de modo que un portal que añadas con `/add-portal` o copies de otro fork se incluye en un clon nuevo. Una CLI cuyo `package.json` declare un script de ciclo de vida en la instalación se omite y se reporta en lugar de ejecutarse. `--dry-run` muestra lo que instalaría.

Para `linkedin-search` y `freehire-search` la instalación es opcional: ambas no tienen dependencias de ejecución y funcionan con `bun` a secas; `bun install` solo descarga los tipos de desarrollo de TypeScript.

Si estás fuera de Dinamarca, puedes generar una skill de búsqueda equivalente para tu portal de empleo local con `/add-portal`: crea la misma estructura de CLI para cualquier portal público y prueba en vivo una consulta antes de registrarla. Consulta la sección «Job search tools» del [README.es.md](README.es.md).

## 4. Ejecuta la entrevista de configuración

Inicia Claude Code en el repositorio:

```bash
claude
```

Después ejecuta el onboarding:

```
/setup
```

Claude te ofrecerá tres rutas:

- **Ruta A (carpeta de documentos):** añade tu CV, tu export de LinkedIn, títulos, referencias o candidaturas anteriores en `documents/`. Claude los lee y los cruza antes de proponer actualizaciones del perfil. Es lo mejor cuando tienes varios archivos de origen.
- **Ruta B (importación de un solo CV):** comparte un CV mencionando el archivo con `@` o pegando el texto. Claude lo extrae y hace preguntas de seguimiento sobre lo que falte.
- **Ruta C (modo entrevista):** responde a preguntas estructuradas de entrevista sección por sección.

Las tres rutas producen el mismo resultado: archivos de perfil totalmente rellenados.

### Qué se rellena

| Archivo | Contenido |
|---------|-----------|
| `CLAUDE.md` | Tu perfil completo de candidato |
| `01-candidate-profile.md` | Formación, experiencia y competencias estructuradas |
| `02-behavioral-profile.md` | Evaluación conductual |
| `04-job-evaluation.md` | Áreas de adecuación de competencias y objetivos profesionales personalizados |
| `05-cv-templates.md` | Plantillas de declaración de perfil para tu trayectoria |
| `07-interview-prep.md` | Ejemplos STAR a partir de tu experiencia |
| `cv/main_example.tex` | Tu CV en LaTeX con datos reales |
| `search-queries.md` | Consultas de búsqueda de empleo para `/scrape` |

### Volver a ejecutar la configuración

Puedes actualizar secciones concretas más adelante:

```
/setup --section skills
/setup --section experience
/setup --section search
```

La opción `--section search` es especialmente útil a medida que evolucionan tus prioridades. Vuelve a ejecutar la entrevista de configuración de la búsqueda y sugiere tipos de puesto que quizá no hayas considerado, a partir de tu perfil completo.

## 5. Opcional: configura el análisis comparativo de salarios

Si tienes datos salariales (de un sindicato, una encuesta salarial, Glassdoor o investigación propia):

1. **Opción A:** crea `salary_data.json` manualmente en la raíz del repositorio (consulta `tools/README_SALARY_TOOL.md` para el formato)
2. **Opción B:** conviértelo desde Excel:
   ```bash
   pip install openpyxl
   python3 tools/convert_salary_excel.py path/to/salary-data.xlsx --source "My Salary Data 2025"
   ```

Esto crea `salary_data.json`, que el flujo de trabajo `/apply` usa para el análisis comparativo de salarios. Si te saltas este paso, la consulta de salarios simplemente se omite.

## 6. Prueba el flujo de trabajo

Encuentra una oferta de empleo que te interese y luego:

```
/apply https://jobindex.dk/job/1234567
```

O pega directamente la descripción del puesto:

```
/apply [paste job posting text here]
```

Claude hará lo siguiente:
1. Evaluar la adecuación con tu perfil
2. Preguntar si quieres continuar
3. Redactar un CV y una carta de presentación a medida
4. Pedir a un agente revisor que critique los borradores
5. Revisar y presentar el resultado final

## 7. Compila tus documentos

Después de que `/apply` cree los archivos de LaTeX:

```bash
# Bash / zsh / Git Bash
cd cv && lualatex main_<company>_<role>.tex && cd ..
cd cover_letters && xelatex cover_<company>_<role>.tex && cd ..
```

```powershell
# PowerShell
Set-Location cv; lualatex main_<company>_<role>.tex; Set-Location ..
Set-Location cover_letters; xelatex cover_<company>_<role>.tex; Set-Location ..
```

Estos comandos se aplican a las plantillas incluidas (CV moderncv, carta de presentación `cover.cls`). Si prefieres usar tu propia plantilla de LaTeX, ejecuta `/add-template`: captura el motor de compilación, las fuentes, las reglas de estilo y el límite de páginas de la plantilla, la compila de prueba y la integra en `/apply`. Consulta la sección «LaTeX templates» del [README.es.md](README.es.md).

## 8. Traer las actualizaciones del upstream a tu fork

El upstream sigue mejorando los archivos de metodología que tu fork ha personalizado, así que planifica las actualizaciones desde el primer día:

**Prefiere los releases antes que `master` en crudo.** Los [releases](../../releases) etiquetados son puntos de control verificados, cada uno descrito en [CHANGELOG.es.md](CHANGELOG.es.md). Actualizar a una etiqueta trae un estado estable y documentado, en lugar de lo que sea que `master` esté a mitad de revisión. Descarga las etiquetas con `git fetch upstream --tags` y fusiona un release (por ejemplo, `git merge v1.0.0`) cuando quieras estabilidad; trae `master` directamente solo cuando quieras específicamente los últimos cambios no publicados. Los pasos de abajo se aplican en ambos casos: sustituye la etiqueta del release por `upstream/master` donde la veas.

1. **Commitea tu personalización, pero ten claro dónde acaban esos commits.** `/setup` edita CLAUDE.md y los archivos de skill del perfil en el sitio; esas ediciones son *tuyas*, y commitearlas es lo que permite que las actualizaciones se fusionen sin problemas. Pero un **fork de este repositorio en GitHub es público** —los forks de repositorios públicos no se pueden hacer privados—, así que cualquier cosa que commitees *y subas a un fork* es visible para cualquiera. Si quieres tu perfil en un remoto, no lo subas a un fork: crea un repositorio **privado**, súbelo ahí y añade este repositorio como remoto `upstream` (`git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git`) para seguir recibiendo actualizaciones. También está bien commitear en local sin subir nada. Los archivos realmente sensibles (el tracker, los datos salariales, `documents/`, los archivos de candidaturas) están en el gitignore y nunca entran en git en ningún caso. Un árbol de trabajo sin commitear es la causa más habitual de que `git pull` se niegue a fusionar del todo (`Your local changes ... would be overwritten`).
2. **Previsualiza qué ha cambiado antes de traer nada:**
   ```bash
   git remote add upstream https://github.com/MadsLorentzen/ai-job-search.git   # first time only, if you cloned your own fork
   git fetch upstream    # or origin, if you cloned the template directly
   python3 tools/check_upstream_updates.py
   ```
   Compara los marcadores `framework_version` de tus archivos del framework con el upstream y enumera exactamente qué archivos de metodología han cambiado, con el comando de diff para cada uno.

   Dos herramientas responden a dos preguntas distintas, y merece la pena ejecutar ambas:
   - **`check_upstream_updates.py`** — *¿cuáles de mis archivos personalizados han cambiado?* Lee el sello `framework_version` de cada archivo de metodología, así que señala exactamente los archivos personalizados que ha tocado un release.
   - **`upstream_triage.py`** — *¿qué commits del upstream merecen mi atención?* Recorre los commits en los que vas por detrás y los clasifica en «merece la pena revisar» y «probablemente omitir», descartando lo que ya hayas aplicado con cherry-pick (emparejado por `git patch-id`, de modo que el trabajo portado desaparece sin llevar ninguna contabilidad), los commits que solo tocan archivos que tu fork ha eliminado, y los SHA que hayas listado en `.github/upstream-wontport.txt`. Es solo de informe: imprime líneas `git cherry-pick` listas para ejecutar, pero nunca fusiona, sube ni abre un PR, porque en un fork «se aplica limpiamente» no significa «es correcto».

     ```bash
     python3 tools/upstream_triage.py --remote upstream
     ```

     Los forks también heredan un `.github/workflows/upstream-watch.yml` que ejecuta esto semanalmente y escribe el resultado en un único issue rotatorio (no hace nada en la propia plantilla del upstream, y permanece desactivado en un fork hasta que actives Actions).
3. **Fusiona con normalidad.** `git merge upstream/master` (o `git pull`) fusiona a tres bandas las ediciones del upstream en torno a tu personalización; como las ediciones de metodología rara vez tocan las líneas que `/setup` rellenó, la mayoría de las actualizaciones entran limpiamente. Un conflicto en un archivo personalizado es una *ventaja*, no un fallo: significa que el upstream ha cambiado la metodología en una sección que personalizaste, y el marcador de versión junto con su commit del changelog te dicen por qué. Resuélvelo manteniendo tus datos y adoptando el cambio de metodología a su alrededor.

## 9. Google Antigravity: configuración paso a paso (Windows, macOS y Linux)

Esta sección reproduce el recorrido con Claude Code de las secciones 2–7, pero usando **Google Antigravity**. Todo lo demás de esta guía se aplica igual, y el plan gratuito de Antigravity hace que esta sea la forma más barata de manejar el framework de principio a fin.

### 9.1 Instala Antigravity

Descarga el instalador para tu sistema operativo desde <https://antigravity.google/download> y ejecútalo:

- **Windows 10+ (64 bits):** descarga el instalador `.exe`, ejecútalo y abre «Antigravity» desde el menú Inicio.
- **macOS 12 (Monterey) o posterior:** descarga el `.dmg` (compilación para Apple Silicon o Intel), arrastra Antigravity a `Applications` y ábrelo. El primer arranque puede avisar de que la aplicación se descargó de internet: permíteselo en *Ajustes del Sistema → Privacidad y seguridad*.
- **Linux (Ubuntu 20+, Debian 10+, Fedora 36+, RHEL 8+):** instala el paquete que use tu distribución, por ejemplo `sudo apt install ./antigravity*.deb` o `sudo dnf install ./antigravity*.rpm`.

También hay una **CLI sin interfaz** si prefieres la terminal:

```bash
# macOS / Linux
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

```cmd
:: Windows (CMD)
curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd
```

### 9.2 Inicia sesión (plan gratuito)

Abre Antigravity e inicia sesión con una **cuenta personal de Google**. El plan gratuito basta para usar este framework; no necesitas añadir un método de pago ni una clave de API. Elige un modelo en el panel del agente (los modelos Gemini están incluidos).

### 9.3 Abre este repositorio como espacio de trabajo

Usa **File → Open Folder** (o «Open Workspace») y selecciona la carpeta en la que clonaste este repositorio, la misma carpeta desde la que ejecutaste los comandos de fork/clonado de la sección 2. Antigravity trata esa carpeta como la raíz del proyecto.

### 9.4 Confirma que ha detectado los archivos de instrucciones del repositorio

Este repositorio incluye sus instrucciones para agentes en la raíz:

- [`AGENTS.md`](AGENTS.es.md) — el puntero ligero que indica a cualquier entorno dónde están las especificaciones canónicas.
- [`CLAUDE.md`](CLAUDE.md) — tu perfil de candidato (creado por `/setup`, sección 4).

Pídele a Antigravity, en el panel de chat:

> Lee `AGENTS.md` y `CLAUDE.md` en la raíz de este espacio de trabajo y resume los archivos de flujo de trabajo a los que apuntan.

Si enumera `.claude/commands/*.md` y `.claude/skills/*`, la detección ha funcionado. Si no los lee por sí solo, siempre puedes adjuntar un archivo a un prompt de forma explícita.

### 9.5 Ejecuta los tres primeros pasos del flujo de trabajo

Recuerda: los comandos `/barra` son archivos de comando de Claude Code (ver la sección 1). En Antigravity, le pides al agente que *siga el archivo*.

1. **Configuración del perfil:** pídele al agente:

   > Sigue la especificación de `.claude/commands/setup.md` y ejecuta la entrevista de onboarding.

   Antigravity te guía por las rutas A/B/C exactamente como se describe en la sección 4 y escribe tus archivos de perfil.

2. **Buscar ofertas de empleo:** el flujo de scraping es una skill, no un comando, y su especificación es [`.claude/skills/job-scraper/SKILL.md`](.claude/skills/job-scraper/SKILL.md). Pídele al agente:

   > Sigue la especificación de `.claude/skills/job-scraper/SKILL.md` y busca ofertas nuevas.

   Este fork también incluye skills de portales españoles —[`.agents/skills/tecnoempleo-search`](.agents/skills/tecnoempleo-search) y [`.agents/skills/infojobs-search`](.agents/skills/infojobs-search)— junto a las independientes del país [`linkedin-search`](.agents/skills/linkedin-search) y [`freehire-search`](.agents/skills/freehire-search). `/scrape` descubre automáticamente todas las skills bajo `.agents/skills/`, así que los portales españoles se buscan sin configuración adicional una vez instaladas sus CLI (siguiente paso).

3. **Solicitar una oferta:** pídele al agente:

   > Sigue la especificación de `.claude/commands/apply.md` con esta oferta de empleo: <pega una URL o el texto de la oferta>.

   Se ejecuta el mismo flujo de redactor/revisor de la sección 6.

### 9.6 Activa y verifica las CLI de los portales

El flujo de trabajo `/scrape` maneja las CLI de portales bajo `.agents/skills/*/cli/`. Instálalas una vez desde la raíz del repositorio (sección 3):

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

Las CLI están en TypeScript y se ejecutan con **Bun**. Comprueba que está disponible:

```bash
bun --version
```

Si falta Bun, instálalo como se muestra en la sección 1: `curl -fsSL https://bun.sh/install | bash` en macOS/Linux, o `winget install Oven-sh.Bun` en Windows. Verifica que funciona una sola CLI de portal antes de confiar en ella:

```bash
bun run .agents/skills/infojobs-search/cli/src/cli.ts --help
```

Si Bun no tiene compilación para tu CPU (algunos sistemas de 32 bits o ARMv7), ejecuta el mismo punto de entrada con Node.js 22+ (`node --experimental-strip-types`) o con `tsx` en su lugar; consulta la nota de compatibilidad multiplataforma al final de la sección 1.

### 9.7 Diferencias frente a Claude Code

| | Claude Code | Google Antigravity |
|--|-------------|--------------------|
| **Invocación** | Comandos `/setup`, `/scrape`, `/apply` literales | Petición en lenguaje natural para seguir el archivo de especificación correspondiente de `.claude/…` |
| **Interfaz** | Terminal | Interfaz gráfica (tipo IDE), con una CLI sin interfaz disponible |
| **Coste** | Suscripción Pro/Max o créditos de la API | Plan gratuito |
| **Archivo de instrucciones** | `CLAUDE.md` | `AGENTS.md` |
| **Subagentes / hooks** | Nativos (herramienta `Agent`, `.claude/settings.json`) | Panel de agente; los hooks y la configuración no se comparten |
| **Comportamiento** | La implementación de referencia | Las mismas especificaciones, leídas mecánicamente: espera pequeñas diferencias de redacción o formato en el resultado |

Las especificaciones son idénticas, así que tu perfil, tu tracker y tus documentos siguen siendo portables entre ambos: nada en este repositorio está atado a un único entorno.

## Solución de problemas

### «salary_data.json not found»
Es lo esperable si no has configurado el análisis comparativo de salarios. El flujo de trabajo `/apply` omite este paso automáticamente.

### Las CLI de búsqueda de empleo no funcionan
Asegúrate de que Bun está instalado y de que has ejecutado `bun install` en cada directorio de CLI. Las herramientas necesitan acceso a la red para obtener las ofertas de empleo.

### Errores de compilación de LaTeX
- CV: usa `lualatex` (pdflatex suele fallar en MiKTeX moderno con errores de expansión de fuentes de `fontawesome5`; lualatex maneja las mismas fuentes sin problemas)
- Carta de presentación: usa `xelatex` (para las fuentes personalizadas en `OpenFonts/fonts/`)
- Asegúrate de que tu distribución de LaTeX incluye el paquete `moderncv`

### No se encuentran las fuentes en la carta de presentación
La plantilla de carta de presentación espera las fuentes en `cover_letters/OpenFonts/fonts/`. Asegúrate de que este directorio existe y contiene los archivos de las fuentes Lato y Raleway.

### `.claude/settings.local.json` obsoleto de un clon antiguo
Los permisos compartidos de Claude Code ahora viven en `.claude/settings.json` (limitados a `bun run`, `python salary_lookup.py` y `python3 salary_lookup.py`). Versiones anteriores de este repositorio incluían un `.claude/settings.local.json` más amplio que preaprobaba `Bash(curl:*)`, `Bash(python:*)` y `Bash(bun:*)`. Si clonaste antes de ese cambio, git deja el archivo antiguo en tu copia de trabajo, y sus permisos siguen aplicándose por encima de `settings.json`. Bórralo (o recórtalo a tus propias excepciones personales):

```bash
rm .claude/settings.local.json
```
