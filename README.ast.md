<p align="center">
  <img src="assets/mascot/pip_flight_loop.gif" alt="Pip, el páxaru mensaxeru" width="200">
</p>

# Busca d'empleu con IA

*La busca d'empleu que s'executa na to máquina.*

<p align="center">
  <a href="https://trendshift.io/repositories/43622?utm_source=trendshift-badge&amp;utm_medium=badge&amp;utm_campaign=badge-trendshift-43622" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/trendshift/repositories/43622/daily" alt="MadsLorentzen%2Fai-job-search | Trendshift" width="250" height="55"/></a>
</p>

[![CI](https://github.com/MadsLorentzen/ai-job-search/actions/workflows/ci.yml/badge.svg)](https://github.com/MadsLorentzen/ai-job-search/actions/workflows/ci.yml)

**Llingua / Language:** [English](README.md) · [Español](README.es.md) · Asturianu (bable)

> 🇪🇸 **Esta ye l'adaptación pa España** — un fork de
> [MadsLorentzen/ai-job-search](https://github.com/MadsLorentzen/ai-job-search) que amiesta
> skills de busca en portales d'empleu españoles, documentación n'español, una
> matriz de compatibilidad de runtime/SO/arquitectura y una guía d'IA con presupuestu cero. El
> proyeutu orixinal sigue siendo la implementación de referencia; mira [Adaptar esto a España](#adaptar-esto-a-españa) más abajo.
>
> Versiones traducíes: [README.es.md](README.es.md) · [README.ast.md](README.ast.md) · [SETUP.es.md](SETUP.es.md) ·
> [CONTRIBUTING.es.md](CONTRIBUTING.es.md) · [SECURITY.es.md](SECURITY.es.md) ·
> [CHANGELOG.es.md](CHANGELOG.es.md) · [AGENTS.es.md](AGENTS.es.md) ·
> [COMPATIBILIDAD.md](COMPATIBILIDAD.md) · [GUIA_TECNICA.md](GUIA_TECNICA.md) ·
> [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md)

Un framework de solicitudes d'empleu impulsáu por IA construyíu sobre [Claude Code](https://claude.com/claude-code) —
y sobre **cualquier otru axente d'IA de llinia de comandu** que prefieras. Fai un fork, rellena'l
to perfil y dexa que'l to axente evalúe ufiertes d'empleu, afaga'l to CV, escriba cartes de
presentación y te prepare pa les entrevistes. El fluxu de trabayu tamién funciona con
[Google Antigravity](https://antigravity.google/), la CLI de Codex, la CLI de Gemini, Qwen Code,
opencode, Aider, Cline, Continue, Goose y Crush; prioriza les opciones gratuites; mira
[COMPATIBILITY.md](COMPATIBILITY.md) y [SETUP.md](SETUP.md) pa les instrucciones
pasu a pasu en Windows, macOS y Linux.

> Nota: esti ye un proyeutu de códigu abiertu independiente y nun ta afiliáu a Anthropic, nin respaldáu, patrocináu o calteníu por esta. Anthropic y Claude Code nómense namás pa describir la cadena de ferramientes que usa esti fluxu de trabayu.
>
> Esti proyeutu **nun tien nenguna criptomoneda, token nin programa de patrociniu de pagu venceyáu**. Cualquier cosa que diga lo contrario nun ta autorizada y ha tratase como una estafa. Les úniques maneres de sofitar el proyeutu son l'enllaz de Ko-fi de más abajo y contribuyir en GitHub.

## ¿Funciona de verdá?

Forméme como xeofísicu. Cuando suprimieron el mio puestu a finales de 2025, construyí esti
framework pa xestionar la mio propia busca d'empleu: el mesmu fluxu de trabayu `/scrape`,
`/apply` y `/interview` d'esti repositoriu, usáu cada selmana, na mio carrera. Fui tresparente
con toes les empreses coles que falé y, en llugar de xugar na mio contra, normalmente daba pie
a una conversación téunica xenuina.

Sesenta y nueve candidatures personalizaes, venti primeres entrevistes y un contratu robláu
darréu, empecé como inxenieru d'IA en xunu de 2026. La xente nun dexaba de preguntame si esto
funciona de verdá. A mi consiguióme l'empleu. Ahora ye tuyu.

*La versión llarga, con tol embudu de candidatures, ta en [LinkedIn](https://www.linkedin.com/in/mads-lorentzen/).*

<p align="center">
  <i>¿Ahorrote un domingu escribiendo cartes de presentación? Invítame a un café.<br>
  ¿Consiguiote l'empleu? Quizá a dos.</i> ☕
</p>

<p align="center">
  <a href="https://ko-fi.com/madslorentzen">
    <img src="https://storage.ko-fi.com/cdn/kofi3.png?v=6" alt="Buy me a coffee at ko-fi.com" height="40">
  </a>
</p>

## Qué ye esto

Un fluxu de trabayu estructuráu que convierte'l to axente d'IA de llinia de comandu nun
asistente integral de solicitudes d'empleu. El fluxu de trabayu principal (autoperfiláu,
evaluación del encaxe y la canal de candidatures redactor-revisor) ye **independiente de la
llingua y del país**. Esti fork inclúi los portales d'empleu del mercáu español (Tecnoempleo,
InfoJobs) xunto a les ferramientes independientes del país `linkedin-search` y
`freehire-search`, y les demos daneses siguen instalaes pero desactivaes: el patrón ta
pensáu pa sustituyise polos portales d'empleu de la to zona con
[`/add-portal`](#herramientes-de-busca-dempleu).

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

El framework codifica les bones práutiques d'orientación profesional, incluyendo criterios
d'evaluación estructuraos, un enfoque prospectivu nes cartes de presentación y un análisis
comparativu de salarios opcional.

## Adaptar esto a España

Esti fork (`BENDER35/ai-job-search-spain-freever`) ye l'adaptación al mercáu español. Comparáu
col proyeutu orixinal:

| Área | Qué amiesta esti fork |
|------|---------------------|
| **Portales d'empleu** | Portales españoles: `tecnoempleo-search` (Tecnoempleo), `infojobs-search` (InfoJobs, API oficial), `indeed-search` (Indeed), `infoempleo-search` (Infoempleo), `ticjob-search` (Ticjob), `disjob-search` (Disjob), `domestika-search` (Domestika), `eures-search` (EURES), `itjobs-search` (ITJobs), `jobfluent-search` (JobFluent), `jobtoday-search` (JobToday), `trabajos-search` (Trabajos.com), `serveo-search` (Serveo), `trabajarenlopublico-search` (Trabajar en lo público), `talent-search` (Talent.com), `turijobs-search` (Turijobs), `jobrapido-search` (Jobrapido), `jobijoba-search` (Jobijoba), `oficinaempleo-search` (Oficina Empleo), `studentjob-search` (StudentJob), `michaelpage-search` (Michael Page), `hosco-search` (Hosco), `randstad-search` (Randstad), `primerempleo-search` (Primerempleo) — xunto a `linkedin-search` y `freehire-search`, independientes del país. Les cuatro demos daneses siguen instalaes pero desactivaes (`enabled: false`). |
| **Runtimes d'IA** | Gestiona'l fluxu de trabayu dende Google Antigravity, Claude Code, la CLI de Codex, la CLI de Gemini, Qwen Code, opencode, Aider, Cline, Roo Code, Kilo Code, Continue, Goose, Crush, Cursor, Windsurf o'l mode axente de Copilot; prioriza les opciones gratuites. Les especificaciones canóniques siguen en `.claude/`; cualquier otru runtime llee un ficheru de punteru finu. Matriz completa en [COMPATIBILITY.md](COMPATIBILITY.md). |
| **Sistemes operativos** | Windows 10/11, macOS (Intel y Apple Silicon) y Linux (x64 y ARM64, incluyíes Raspberry Pi 4/5). Les arquitectures x86 de 32 bits y ARMv7 nun tienen compilación de Bun: nesi casu les CLI de portales en TypeScript execútense con Node.js 22+ (`node --experimental-strip-types`) o `npx tsx`. Detalles en [COMPATIBILITY.md](COMPATIBILITY.md) y en `python3 tools/check_platform.py`. |
| **Documentación** | Espeyos n'español de tolos documentos de nivel cimeru, una guía téunica en dambes llingües ([TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) / [GUIA_TECNICA.md](GUIA_TECNICA.md)) y [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md), una guía de nivel gratuitu y baxu presupuestu sobre les IAs que puedes usar pa buscar empleu (incluyíu Ollama en hardware antiguu), con ediciones DOCX y PDF. |

Too lo demás —el ciclu de vida `/setup` → `/scrape` → `/rank` → `/apply` → `/interview` →
`/outcome`, les plantilles, les ferramientes de salariu— funciona exactamente como lo
documenta'l proyeutu orixinal.

## Requisitos previos

- [Claude Code](https://claude.com/claude-code) (CLI). Claude Code nun tien nivel gratuitu: necesites una suscripción Claude Pro/Max/Team o creitos de la API d'Anthropic (pago per token, normalmente más baratu pa un usu ocasional). **Esti fork nun rique Claude Code**: cualquier axente de llinia de comandu puede executar les mesmes especificaciones (Google Antigravity, la CLI de Codex, la CLI de Gemini, Qwen Code, opencode, Aider, Cline, Continue, Goose, Crush, ...), y les opciones gratuites tán documentaes en [SETUP.md](SETUP.md#which-aicli-agent-to-use-all-are-optional-but-pick-one) y [COMPATIBILITY.md](COMPATIBILITY.md). Les skills de busca en portales funcionen en toos ellos ensin configuración adicional.
- Python 3.10+
- [Bun](https://bun.sh) (pa les ferramientes CLI de busca d'empleu)
- Una distribución de LaTeX con `lualatex` y `xelatex`: [TeX Live](https://tug.org/texlive/), [MacTeX](https://tug.org/mactex/), [TinyTeX](https://yihui.org/tinytex/) o [MiKTeX](https://miktex.org/). El CV compílase con `lualatex` (pdflatex falla a menudo n'instalaciones modernes de MiKTeX con errores d'espansión de la fonte `fontawesome5`); la carta de presentación compílase con `xelatex` porque `cover.cls` rique `fontspec`. Si usas una instalación mínima de TeX como TinyTeX o BasicTeX, instala los paquetes adicionales que se llisten en [SETUP.md](SETUP.md#minimal-tex-install-tinytexbasictex).
- Opcional: `pip install pypdf` pa la comprobación de llexibilidá ATS de `/apply` (BSD; nun rique Poppler). Poppler `pdftotext` sigue siendo un métodu alternativu (macOS: `brew install poppler`, Debian/Ubuntu: `apt install poppler-utils`, Windows: `choco install poppler`). Si falten dambos, la comprobación degrádase a una revisión visual de pallabres clave.

## Entamu rápidu

> 🎥 **¿Prefieres velo en acción primero?** [The Next New Thing fixo un recorríu práuticu](https://www.youtube.com/watch?v=HoVxjMNFYv4) de cómo s'usa realmente'l fluxu de trabayu, dende la configuración hasta una candidatura terminada (grabáu n'agostu de 2026; los comandos pueden camudar dende entós).

### 1. Fai un fork y clona

```bash
gh repo fork MadsLorentzen/ai-job-search --clone
cd ai-job-search
```

> [!IMPORTANT]
> **Un fork d'esti repositoriu ye siempres públicu** —GitHub nun dexa forks privaos de
> repositorios públicos— y `/setup` (el pasu 3 de más abajo) escribe los tos datos personales (nome,
> datos de contautu, historial llaboral, expectatives salariales) en ficheros **rastreaos por git**.
> Si esta copia ye pa la to propia busca d'empleu y non pa devolver camudamientos al proyeutu,
> usa un **repositoriu priváu** con esti repositoriu como `upstream` nel so llugar: la receta
> de dos minutos ta en [SETUP.md, seición 8](SETUP.md#8-pulling-upstream-updates-into-your-fork),
> y tolos fluxos d'actualización funcionen igual. Fai un fork namás pa contribuyir.

### 2. Instala les ferramientes de busca d'empleu

```bash
python3 tools/install_portal_clis.py   # Windows: python tools\install_portal_clis.py
```

Executa `bun install` en toles CLI de portales de `.agents/skills/*/cli/`: descúbrense, nun se llisten, asina qu'un portal que amiestes con `/add-portal` o copies d'otru fork tamién s'inclúi nun clon nuevu. Una CLI que'l so `package.json` declare un script de ciclu de vida en tiempu d'instalación omítese y anúnciase en llugar d'executase. `--dry-run` amuesa lo que instalaría.

Pa `linkedin-search` y `freehire-search` la instalación ye opcional: nengún tien dependencies en tiempu d'execución y funcionen con `bun` a seques; `bun install` namás baxa los tipos de desarrollu de TypeScript.

### 3. Configura'l to perfil

```bash
claude
# Then inside Claude Code:
/setup
```

¿Prefieres xestionarlo con otru axente (Antigravity, la CLI de Codex, la CLI de Gemini, Qwen Code,
opencode, Aider, Cline, Continue, Goose, Crush)? Abre'l repositoriu como espaciu de trabayu del
axente y píde-y, en llingua natural, qu'execute'l ficheru d'especificación correspondiente. Pa la
incorporación:

```
Read .claude/commands/setup.md and follow it for this repository.
```

Toos los fluxos de trabayu d'este README (`/scrape`, `/rank`, `/apply`, `/interview`, `/outcome`, …) tienen
la mesma forma: `.claude/commands/<name>.md` ye la especificación, y les skills que invoca tán en
`.claude/skills/` y `.agents/skills/`. Les instrucciones pasu a pasu per runtime y per sistema operativu tán en
[SETUP.md](SETUP.md); la matriz completa de runtimes ta en [COMPATIBILITY.md](COMPATIBILITY.md).

`/setup` ufre tres caminos: lleer la to carpeta `documents/` si yá la tienes enllena (CV en PDF, esportación de LinkedIn, títulos, cartes de referencia, candidatures anteriores), importar un únicu CV pegáu na conversación, o faer una entrevista guiada. Detecta automáticamente lo que tienes y pregunta. El mou de carpeta de documentos ye idempotente y seguru de volver executar a midida qu'amiestes material; mira `documents/README.md` pa ver la estructura.

### 4. Busca empleu

```bash
/scrape
```

Busca en dellos portales d'empleu les ufiertes que encaxen col to perfil, elimina los duplicaos
y preséntales ordenaes por encaxe. Escueyi una coincidencia pa executar `/apply` directamente
sobre ella o, cuando un scrape devuelve más ufiertes de les que quieres revisar a güeyu, executa
`/rank` pa puntuales toes por llotes col framework d'encaxe y llograr primero una llista curtia
clasificada.

### 5. Solicita un empleu

```bash
/apply https://jobindex.dk/job/1234567
```

Si nun se puede aportar a la URL (dalgunos portales d'empleu bloquien l'accesu automatizáu),
puedes pegar direutamente la descripción del puestu:

```bash
/apply <paste the full job description here>
```

Esto executa'l fluxu de trabayu completu: evalúa l'encaxe, redacta'l CV y la carta de
presentación, revisa con un segundu axente, revísalu y presenta'l resultáu final.

Les ufiertes trátase como entrada non fiable (el fluxu de trabayu nun sigue nenguna instrucción
encarnada nelles nin aporta a nengún enllaz del so cuerpu), pero les defenses a nivel d'axente
son a nivel d'instrucciones, non un entornu aislláu; nun portal d'empleu desconocíu, echa un
vistazu a lo que se llogró y escribió enantes de pulsar unviar. Detalles en [SECURITY.md](SECURITY.md).

## Otros comandos

`/setup`, `/scrape` y `/apply` formen el fluxu de trabayu principal. Otros diez comandos amplíenlo
una vez tengas el to perfil listu:

- **`/interview`** te prepara pa una entrevista programada d'una candidatura rastrexada. Constrúi un paquete de preparación específicu pa cada fase a partir del ficheru de la candidatura (la ufierta exacta, el CV y la carta de presentación que lleyó la persona entrevistadora, los comentarios rexistraos de rondes anteriores), investiga la empresa y a quienes entrevisten con una regla de «verificar enantes d'usar», asocia les preguntes probables colos tos exemplos STAR y ufre una entrevista simulada siguiendo'l protocolu de simulación de `07-interview-prep.md`. Les lagunes reciben respuestes puente honestes, nunca esperiencia inventada.
- **`/outcome`** rexistra lo que pasó con una candidatura: fases d'entrevista, ufiertes, refugaes, silenciu. Archiva'l CV unviáu, la carta de presentación y el testu de la ufierta en `documents/applications/<company>_<role>/`, caltién `outcome.md` nel formatu que analiza'l Camín A de `/setup` y actualiza'l rastreador. Tamién s'ocupa del tramu enantes de tener un resultáu que rexistrar: `/outcome followup` saca a la lluz candidatures abiertes que se quedaron en silenciu (por defectu 10 díes), redacta un recordatoriu curtiu y fayadizu pal canal nel to estilu d'escritura usando namás afirmaciones de los materiales que yá unviesti (namás borradores, nunca los unvia; como más dos veces por candidatura) y ufre una nota d'agradecimientu nel mesmu turnu en que se rexistra una fase d'entrevista. Cuando se resuelven unes cuantes candidatures, remítete de nuevu a `/setup` pa calibrar el framework d'encaxe con lo que realmente consiguió entrevistes.
- **`/notion-sync`** publica una vista unidireccional y de namás llectura de la canal nuna base de datos de Notion per aciu del servidor MCP oficial de Notion (OAuth, ensin claves de API): una fila por cada ufierta clasificada más cada candidatura rastrexada, con una páxina informativa d'escritura única por fila. Los ficheros del repositoriu siguen siendo'l sistema de rexistru: nada se sincroniza de vuelta, y los documentos sincronícense namás como nomes de ficheru. Complementa a `/html-report`: aquel ye'l panel de control offline y fondu que regeneres na to mesa; esti ye la vista en vivo y de un vistazu dende cualquier llugar onde funcione Notion (escritoriu, web, móvil).
- **`/gmail-sync`** llee'l to Gmail (per aciu del conector de Gmail) en busca de señales d'estáu de les tos candidatures abiertes (invitaciones a entrevistes, enllaces de pruebes, ufiertes, refugaes) y les propón como un llote pa que les apruebes enantes de que s'escriba nada nel rastreador o en `outcome.md`, citando'l corréu electrónicu d'orixe en cada camudamientu propuestu. Les ufiertes queden ensin proponer `hired`/`offer_declined`, yá que esa decisión ye tua; les señales conflictives o ensin correspondencia márquense pa una pasada manual de `/outcome` en llugar d'afortunales.
- **`/rank`** sirve de ponte ente `/scrape` y `/apply`: puntúa por llotes toes les ufiertes recién estrayíes col framework d'encaxe (axentes en paralelu llogren cada ufierta y puntúen les cinco dimensiones d'evaluación) y devuelve una llista curtia clasificada coles fortaleces y lagunes honestes de cada empleu. Los factores eliminatorios vetan, les fecha llende reciben marques d'urxencia y les ufiertes muertes márquense como caducaes. Escueyi un númberu y pasa al fluxu completu de `/apply`.
- **`/expand`** enriquez el to perfil escaneando fuentes públiques que yá amiestes nél (repositorios de GitHub, sitiu de portafoliu, Kaggle, Google Scholar) y buscando programes d'estudios de cursos y certificaciones citaos. Les competencies descubiertes amiéstense al to perfil con una etiqueta d'orixe. Útil xusto dempués de `/setup` pa sacar a la lluz habilidaes que los documentos por sigo solos nun faen esplícites.
- **`/upskill`** analiza la laguna ente'l to perfil, les tos ufiertes d'empleu rastreaes y les ufiertes clasificaes pero non rastreaes (les lagunes rexistraes por `/rank` en `seen_jobs.json`), o una sola ufierta per mediu de `/upskill <URL>`. Produz un mapa de calor priorizáu de les lagunes d'habilidaes y un plan d'aprendizaxe con recursos d'estudiu buscaos na web y estimaciones de tiempu. Útil pa planificar la carrera ente candidatures.
- **`/html-report`** xenera un panel de control HTML autocontenido a partir de `job_search_tracker.csv` y de los ficheros de candidatures: tarxetes d'estadístiques, gráficos d'estáu/sector/canal/embudu (SVG en llinia, ensin dependencies esternes) y una tabla de candidatures filtrable. Abre direutamente nun navegador, dafechu offline. Vuelve executalu cuando quieras darréu de que `/apply` o `/outcome` amiesten entraes nueves.
- **`/add-template`** rexistra la to propia plantilla de CV o carta de presentación (LaTeX, Typst o otra cadena de ferramientes) en llugar de les de serie. Captura les instrucciones de la plantilla (estensión del códigu fonte, comandu de compilación, fonts, regles d'estilu, llímite de páxines), executa una compilación de prueba obligatoria y integra la plantilla en `/apply`. Mira [Plantilles personalizaes](#plantilles-personalizaes) más abajo.
- **`/add-portal`** xenera una skill de busca de portal d'empleu pa un portal del to mercáu. Investiga'l portal (patrón d'URL de busca, estructura de resultaos, regles d'accesu), crea l'andamiu de la skill CLI cola mesma estructura que les incluyíes y prueba una consulta en vivo enantes de registrar nada. Mira [Herramientes de busca d'empleu](#herramientes-de-busca-dempleu) más abajo.

`/reset` tamién ta disponible; mira [Empezar de cero](#empezar-de-cero) más abajo.

## Estructura de ficheros

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
│   ├── indeed-search/                 # Indeed (global job board)
│   ├── infoempleo-search/             # Infoempleo (Spanish job board)
│   ├── ticjob-search/                  # Ticjob (Spain TIC job board)
│   ├── disjob-search/                   # Disjob (Spain inclusive job board)
│   ├── domestika-search/                 # Domestika (Spain creative job board)
│   ├── eures-search/                     # EURES (EU-wide REST API incl. Spain)
│   ├── itjobs-search/                    # ITJobs (Spain IT job board)
│   ├── jobfluent-search/                 # JobFluent (Spain tech job board)
│   ├── jobtoday-search/                  # JobToday (Spain high-volume job board)
│   ├── trabajos-search/                  # Trabajos.com (Spain general job board)
│   ├── serveo-search/                    # Serveo (company careers portal)
│   ├── trabajarenlopublico-search/       # Trabajar en lo público (Spain public-sector convocatorias)
│   ├── talent-search/                    # Talent.com (Spain general aggregator)
│   ├── turijobs-search/                  # Turijobs (Spain tourism & hospitality board)
│   ├── jobrapido-search/                 # Jobrapido (Spain job aggregator)
│   ├── jobijoba-search/                  # Jobijoba (Spain job aggregator)
│   ├── oficinaempleo-search/             # Oficina Empleo (Spanish job board)
│   ├── studentjob-search/                # StudentJob (jobs for students/young professionals)
│   ├── michaelpage-search/               # Michael Page (recruitment firm job board)
│   ├── hosco-search/                     # Hosco (hospitality job board)
│   ├── randstad-search/                  # Randstad (recruitment firm job board)
│   ├── primerempleo-search/              # Primerempleo (jobs for students/young professionals)
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

El comandu `/apply` executa un **fluxu de trabayu redactor-revisor** con compilación obligatoria a PDF:

1. **Analiza** la ufierta d'empleu (URL o testu)
2. **Evalúa l'encaxe** col to perfil (habilidaes, esperiencia, cultura, allugamientu, alliniación profesional)
3. **Redacta** un CV y una carta de presentación afitaos en LaTeX
4. **Llanza un axente revisor** qu'investiga la empresa y critica los borradores
5. **Revisa** según los comentarios del revisor
6. **Compila ya inspecciona** dambos PDF: lualatex pal CV, xelatex pa la carta de presentación. Claude llee les páxines renderizaes ya itera sobre'l LaTeX hasta que'l CV tenga exactamente 2 páxines ensin títulos d'entrada güérfanos, y la carta de presentación tenga exactamente 1 páxina cola firma visible y les fonts coherentes.
7. **Comprueba'l CV con un ATS**: estrai la capa de testu del PDF (`pdftotext`, dependencia opcional) y verifícala tal como la ve un analizador ATS: datos de contautu presentes como testu lliteral, ensin glifos corruptos, un orde de llectura sensatu; darréu puntúa la cobertura de pallabres clave de la ufierta frente a la estraición. Les pallabres clave que'l perfil respalda de verdá amiéstense; les lagunes reales siguen visibles, nunca se rellenen artificialmente.
8. **Presenta**'l resultáu final con una llista de verificación

Toes les afirmaciones del CV y de la carta de presentación verifíquense col to perfil real. El sistema nunca inventa habilidaes nin esperiencia.

### Qué fai diferente esti fluxu de trabayu

- **Bucle de verificación del PDF.** La mayoría de les plantilles de currículum en LaTeX producen un resultáu que «se ve bien nel .tex» pero ruémpese nel PDF: los títulos de los puestos queden güérfanos na páxina siguiente, les cartes de presentación desborden a la páxina 2, les fonts de les viñetes vuelven silenciosamente a la fonte del cuerpu. El comandu `/apply` compila ya inspecciona visualmente cada PDF y aplica correiciones específiques (`\needspace`, `\enlargethispage`, contenedores qu'igualen la fonte de los elementos de llista) hasta que'l diseñu quede llimpiu. Esto execútase automáticamente en cada candidatura.
- **Verificación ATS sobre la capa de testu del PDF.** Un ATS llee'l testu encarnáu del PDF, non la páxina renderizada —y LaTeX puede producir silence PDF que'l so testu s'estrai como basura (glifos d'iconos onde tendría d'haber el corréu electrónicu, llinies entrellazaes de diseños a varies columnes). `/apply` estrai la capa de testu del CV compiláu con `pdftotext` y verifica los datos de contautu, l'orde de llectura y la cobertura de pallabres clave de la ufierta frente a lo que ve realmente un analizador. Aplícase una regla d'honestidá: una pallabra clave que'l perfil nun respalda reconózse como una laguna, nunca se rellena artificialmente.
- **Recorte del CV ponderáu por relevancia.** Cuando un CV desborda de 2 páxines, el fluxu de trabayu nun recorta mecánicamente dende la seición «más antigua». Puntúa cada llinia candidata según (a) la so relevancia pa la ufierta oxetivu, (b) la so unicidá nel documentu y (c) si la carta de presentación depende d'ella, y recorta primero la llinia cola puntuación total más baxa. Una viñeta d'un puestu antiguu que contién pallabres clave de la ufierta sobrevive per delantre d'una viñeta d'un puestu reciente que nun les tien.
- **Separación redactor-revisor.** El redactor escribe; un segundu axente Claude, llanzáu con un contestu nuevu, investiga la empresa y critica los borradores. Darréu el redactor revisa. Esto detecta pallabres clave omitíes, enfoques débiles y llingua xenérica qu'una sola pasada dexa de normal.
- **Unviu eficiente del revisor en tokens.** L'axente revisor recibe los borradores en llinia en llugar de volver llos, y la llista de verificación execútase una vez al final del fluxu de trabayu en llugar de duplicase polos dos axentes. Nota: el nuevu pasu de compilar ya inspeccionar del Pasu 5 gasta parte d'esi aforru en renderizáu del PDF ya iteración del diseñu; el fluxu de trabayu camuda daqué de coste de tokens de principiu a fin por una reducción real de PDF defectuosos que lleguen a la persona usuaria.

## Personalización

### Qué ficheros editar a mano

Si prefieres editar los ficheros directamente en llugar d'usar `/setup`:

| Ficheru | Qué cambiar |
|------|---------------|
| `CLAUDE.md` | El to perfil completu (nome, formación, esperiencia, habilidaes, oxetivos) |
| `01-candidate-profile.md` | Versión estructurada de los datos del to CV |
| `02-behavioral-profile.md` | La to evaluación conductual o autoevaluación |
| `04-job-evaluation.md` | Árees de coincidencia d'habilidaes, oxetivos profesionales, filtros de motivación |
| `05-cv-templates.md` | Plantilles de declaración de perfil pa distintos tipos de puestu |
| `07-interview-prep.md` | Los tos exemplos STAR d'esperiencia real |
| `search-queries.md` | Consultes de busca d'empleu pa les tos habilidaes y allugamientu |

### Actualizar les tos consultes de busca

A midida que evolucionen les tos prioridaes, puedes reconfigurar namás la busca d'empleu ensin volver executar tola configuración del perfil:

```
/setup --section search
```

Esto vuelve a executar la entrevista de configuración de la busca: qué puestos buscar, qué habilidaes buscar, qué allugamientos y qué portales. Tamién suxer tipos de puestu que quizá nun habíes consideráu, según el to perfil.

### Plantilles personalizaes

El CV usa [moderncv](https://ctan.org/pkg/moderncv) (estilu banking). La carta de presentación usa un `cover.cls` personalizáu con fonts Lato/Raleway. Dambes son LaTeX: el motor de referencia que esti repositoriu inclúi y caltién.

Pa usar la to propia plantilla nel so llugar —LaTeX, [Typst](https://typst.app/) o cualquier otra cadena de ferramientes que compile a PDF dende la llinia de comandu— executa:

```
/add-template
```

Apúntalo al to ficheru fonte (un ficheru `.tex` más los ficheros `.cls`/`.sty` o les fonts incluyíes que precise; un ficheru `.typ` más los paquetes locales que precise; o un equivalente pa otra cadena de ferramientes). El comandu pregúntate poles instrucciones de la plantilla (estensión del códigu fonte, comandu de compilación, fonts y ónde tán, regles d'estilu que caltener, llímite de páxines obligatoriu), guarda too so `templates/`, executa una compilación de prueba obligatoria y activa la plantilla por que `/apply` redacte y compile a partir d'ella. Les plantilles guárdense con tokens `[PLACEHOLDER]` en llugar de datos personales, asina que son segures de confirmar y compartir.

- `/add-template --list` amuesa les plantilles rexistraes
- `/add-template --use <name>` cambia ente elles
- `/add-template --use default` vuelve a les plantilles moderncv / cover.cls de serie

Si prefieres facelo a mano, la vía manual sigue funcionando: actualiza les indicaciones de `05-cv-templates.md` y `06-cover-letter-templates.md`.

### Herramientes de busca d'empleu

**Los portales españoles vienen incluyíos nesti fork.** `.agents/skills/` inclúi:

- **`tecnoempleo-search`** — Tecnoempleo (tecnoempleo.com), el portal d'empleu d'IT/telecom d'España, analizáu a partir de les sos páxines de resultaos públiques, **cero dependencies en tiempu d'execución**. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/tecnoempleo-search/SKILL.md`.
- **`infojobs-search`** — InfoJobs (infojobs.net), el mayor portal xeneralista d'España, per aciu de la so **API oficial pa desarrolladores** (rexistru gratuitu en [developer.infojobs.net](https://developer.infojobs.net); la CLI llee `INFOJOBS_CLIENT_ID` y `INFOJOBS_CLIENT_SECRET` del entornu y falla con `MISSING_CREDENTIALS` cuando nun tán definíes). Mira `.agents/skills/infojobs-search/SKILL.md`.

- **`indeed-search`** — Indeed (indeed.com), unu de los mayores portales d'empleu del mundu, que cubre tolos sectores y países, útil pa busques específiques d'España en toes les industries. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/indeed-search/SKILL.md`.

- **`infoempleo-search`** — Infoempleo (infoempleo.com), un portal d'empleu español de llarga trayectoria que cubre tolos sectores y ciudaes d'España. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/infoempleo-search/SKILL.md`.

- **`ticjob-search`** — Ticjob (ticjob.es), un portal d'empleu teunolóxicu y d'IT español que cubre desarrollo de software, datos, DevOps, ciberseguridá y cloud en toa España. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/ticjob-search/SKILL.md`.

- **`disjob-search`** — Disjob (disjob.com), un portal d'empleu español centráu n'empleadores inclusivos (candidatos con discapacidá) en tolos sectores y provincies, buscáu per aciu d'un formulariu POST con resultaos renderizaos nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/disjob-search/SKILL.md`.

- **`domestika-search`** — Domestika (domestika.org), un portal d'empleu creativu español con feed Atom públicu (`/es/jobs.atom`), que cubre diseñu, motion, UX, ilustración y puestos creativos; analízase nel llau del servidor a partir del feed y de les páxines de detalle HTML. Namás usu personal: mantén el volume baxu.

- **`eures-search`** — EURES (europa.eu/eures), el portal de Servicios d'Empleu Europeos con una API REST documentada (POST de busca, GET de detalle), que cubre tola XE, incluyíos puestos públicos españoles y transfronterizos. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/eures-search/SKILL.md`.

- **`itjobs-search`** — ITJobs (itjobs.es), un portal d'empleu teunolóxicu español que cubre puestos de software, datos, DevOps, ciberseguridá, cloud y SAP en toa España; analízase a partir de resultaos de busca HTML renderizaos nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/itjobs-search/SKILL.md`.

- **`jobfluent-search`** — JobFluent (jobfluent.com), un portal d'empleu teunolóxicu español con una API JSON pública (`/es/empleos.json`), que cubre puestos de software, datos, DevOps, productu y teunoloxía en toa España. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/jobfluent-search/SKILL.md`.

- **`jobtoday-search`** — JobToday (jobtoday.com), un portal d'empleu español de gran volume que cubre hostelería, venta al por menor, loxística, alministración y munchos otros sectores; analízase a partir de páxines Next.js renderizaes nel servidor con JSON encarnáu. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/jobtoday-search/SKILL.md`.

- **`trabajos-search`** — Trabajos.com (trabajos.com), unu de los portales xeneralistes españoles con más antigüedá, que cubre tolos sectores en toes les provincies, buscable por pallabra clave y provincia/ciudá; analízase a partir d'HTML renderizáu nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/trabajos-search/SKILL.md`.

- **`serveo-search`** — Serveo (jobs.serveo.com), el portal oficial d'empleu de Serveo, una gran empresa española d'infraestructures, xestión d'instalaciones y servicios, que cubre puestos de caltenimientu, enerxía, tresporte, salú, inxeniería y alministración en toa España; analízase a partir d'una páxina de carreres de SAP SuccessFactors renderizada nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/serveo-search/SKILL.md`.

- **`trabajarenlopublico-search`** — Trabajar en lo público (trabajarenlopublico.com), un portal de la comunidá qu'axunta los procesos selectivos abiertos del sector públicu español (convocatories, oposiciones y bolses de trabayu) pa l'alministración estatal, autonómica y llocal, salú, educación, policía, xusticia, universidaes y empreses públiques; analízase a partir de la llista «Convocatorias en plazo» renderizada nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/trabajarenlopublico-search/SKILL.md`.

- **`talent-search`** — Talent.com (es.talent.com), la edición española d'un agregador global qu'indexa ufiertes de miles d'empleadores y feed d'ATS en tolos sectores y toes les provincies, buscable por pallabra clave, provincia/ciudá o mou remotu; analízase a partir d'HTML renderizáu nel servidor más el `JobPosting` JSON-LD de `schema.org` encarnáu nes páxines de detalle. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/talent-search/SKILL.md`.

- **`turijobs-search`** — Turijobs (www.turijobs.com), el principal portal d'empleu d'España de turismu y hostelería (hoteles, restaurantes, catering, axencies de viaxes, campamentos, cruceros), buscable por títulu de puestu, área, sector, ciudá o rexón; analízase a partir del JSON `__NEXT_DATA__` encarnáu en cada páxina Next.js renderizada nel servidor. Namás usu personal: mantén el volume baxu. Mira `.agents/skills/turijobs-search/SKILL.md`.
- **`jobrapido-search`** — Jobrapido (es.jobrapido.com), un gran agregador d'empleu español; busca por pallabra clave/ciudá, detalle a partir de la páxina de la ufierta renderizada nel servidor. Namás usu personal: mantén el volume baxu; namás se puede aportar a la primer páxina (los parámetros de paginación tán prohibíos por robots.txt). Mira `.agents/skills/jobrapido-search/SKILL.md`.
- **`jobijoba-search`** — Jobijoba (www.jobijoba.es), un gran agregador d'empleu español; busca por pallabra clave/ciudá/provincia, detalle a partir de la páxina de la ufierta de primera parte (permitida por robots) con descripción completa. Namás usu personal: mantén el volume baxu; el puntu de busca ta vetáu pa rastreadores xenéricos. Mira `.agents/skills/jobijoba-search/SKILL.md`.
- **`oficinaempleo-search`** — Oficina Empleo (www.oficinaempleo.com), un portal d'empleu español; busca por pallabra clave (filtro d'allugamientu nel llau del veceru), detalle a partir de la páxina JSON-LD JobPosting. Mira `.agents/skills/oficinaempleo-search/SKILL.md`.
- **`studentjob-search`** — StudentJob (www.studentjob.es), un portal pa estudiantes y mozos profesionales (práutiques, primeros empleos, puestos a tiempu parcial y temporales) pero tamién con vacantes normales; busca por pallabra clave, detalle con descripción completa, empresa, allugamientu y fecha. Mira `.agents/skills/studentjob-search/SKILL.md`.
- **`michaelpage-search`** — Michael Page (www.michaelpage.es), el portal d'empleu d'una empresa de seleición; busca por pallabra clave, detalle a partir de JSON-LD JobPosting con descripción completa, empresa, allugamientu y fecha. Mira `.agents/skills/michaelpage-search/SKILL.md`.
- **`hosco-search`** — Hosco (www.hosco.com), un portal d'empleu centráu en hostelería (hoteles, restaurantes, catering, eventos, turismu); busca por pallabra clave, detalle a partir de JSON-LD JobPosting con descripción completa, empresa, allugamientu y fecha. Mira `.agents/skills/hosco-search/SKILL.md`.
- **`randstad-search`** — Randstad (www.randstad.es), el portal d'empleu d'una empresa de seleición; busca por pallabra clave, detalle con descripción completa (analís flexible de JSON-LD), empresa, allugamientu y fecha. Mira `.agents/skills/randstad-search/SKILL.md`.
- **`primerempleo-search`** — Primerempleo (www.primerempleo.com), un portal pa estudiantes y mozos profesionales (práutiques, primeros empleos, puestos temporales) pero tamién con vacantes normales; busca por pallabra clave (filtro de títulu nel llau del veceru), detalle a partir de JSON-LD JobPosting con descripción completa, empresa, allugamientu y fecha. Nota: el detalle rique la URL completa de los resultaos de la busca. Mira `.agents/skills/primerempleo-search/SKILL.md`.
- **`linkedin-search`** y **`freehire-search`** — les ferramientes independientes del país, yá útiles pa España (`-l "Madrid, Spain"`, `--country ES`).

Les cuatro ferramientes CLI daneses (Jobbank, Jobdanmark, Jobindex, Jobnet) caltiénense como exemplos funcionales del patrón; vienen desactivaes (`enabled: false`) y siguen apagaes nesti fork. Pa amestar otru portal pa España —o pa cualquier otru mercáu— executa:

```
/add-portal
```

Dale la URL del to portal d'empleu local. El comandu investiga'l portal (patrón d'URL de busca, estructura de la páxina de resultaos, regles de robots.txt/accesu), crea l'andamiu d'una skill CLI cola mesma estructura, comandos y contratu de salida que les incluyíes, y prueba una consulta en vivo enantes de registrar nada. Los portales con muru d'autenticación refúguense, y los portales con términos restrictivos reciben un avisu destacáu de namás usu personal na skill xenerada. La skill xenerada ye específica d'un mercáu y vive nel to fork; el xenerador en sí ye la parte universal.

¿Mantienes un fork adaptáu al to mercáu o llingua? Añádelo al fío [Community forks & adaptations](https://github.com/MadsLorentzen/ai-job-search/discussions/78) por que otros puedan atopalo.

Pa puntos de partida **independientes del país** que funcionen n'España y en cualesquier otru llugar, el repositoriu inclúi dos skills de portales xunto a les demos daneses:

- **`linkedin-search`** — construyida sobre los endpoints públicos y ensin autenticación `jobs-guest` de LinkedIn. Independiente del campu, **cero dependencies en tiempu d'execución** (funciona namás con `bun`), y toma l'allugamientu de busca como una bandera explícita, asina que funciona pa cualquier mercáu ensin configuración adicional (`-l "Berlin, Germany"`, `-l "Mumbai, Maharashtra, India"`, `-l "Remote"`, …). Pensada **namás pa usu personal**: l'accesu automatizáu va contra les Condiciones de Serviciu de LinkedIn, asina que mantén el volume baxu. Mira `.agents/skills/linkedin-search/SKILL.md`.
- **`freehire-search`** — consulta la API REST pública del agregador [freehire.me](https://freehire.me) (JSON, ensin clave de API). Centrada en teunoloxía (software, datos, inxeniería, DevOps, remotu), multi-mercáu per mediu de banderes de faceta (`--region`, `--country`, `--remote`) y **cero dependencies en tiempu d'execución**. A diferencia de los portales daneses que faen scraping HTML, los resultaos lleguen estructuraos (habilidaes, nivel d'esperiencia, categoría). El backend tien llicencia MIT y ye [autoalloxable](https://github.com/strelov1/freehire) — apunta `FREEHIRE_API_URL` a la to propia instancia si lo prefieres. Mira `.agents/skills/freehire-search/SKILL.md`.

### Ampliar el framework: portales, plantilles, criterios — y tomar emprestáu d'otros forks

Too lo anterior suma un modelu d'estensión, asina que equí ta dichu ensin rodeos. El framework tien tres puntos d'estensión, y nengún rique tocar el proyeutu orixinal:

1. **Skills de portales** — el sistema de módulos pa portales d'empleu. Cada skill `*-search` ye una carpeta autocontenida so `.agents/skills/` col mesmu contratu (una CLI `search`/`detail`, salida `--format json|table|plain`, una bandera `enabled:` nel so `SKILL.md`, les sos propies pruebes). `/scrape` descubre automáticamente cualquier skill instalada que siga'l contratu —nada que rexistrar, nada que cablear—. `/add-portal` xenera nueves; el [índiz de portales de la comunidá](https://github.com/MadsLorentzen/ai-job-search/discussions/78) cataloga les que construyeron otros forks.
2. **Plantilles de documentos** — `/add-template` rexistra cualquier cadena de ferramientes de CV o carta de presentación que compile a PDF dende la llinia de comandu, LaTeX o non.
3. **Criterios d'evaluación** — los factores eliminatorios y les preferencies del to perfil son de formatu llibre, y la rúbrica d'evaluación puntúa contra lo que pongas equí. «Bones condiciones de permisu de maternidá/paternidá», «salariu mínimu X según la escala del mio sindicatu», «sin guardies»: caúno ye una llinia del perfil, ensin códigu, y tien un pesu real nes evaluaciones d'encaxe de `/rank` y `/apply`. La llingua ye l'únicu tipu de factor eliminatoriu con un tratamientu dedicáu y estructuráu: `/setup` capture toles llingües nes que trabayes y el to nivel (preguntándolo direutamente o infiriéndolo del to CV/esportación de LinkedIn) nuna tabla `Languages`, y la Barrera d'Idioma (`04-job-evaluation.md`) refuga de manera tajante una ufierta que rique una llingua que nun declarasti en absolutu, sinón que marca —sen refugar automáticamente— una que pida un nivel superior al que declarasti nuna llingua na que sí trabayes, de mou qu'un casu llende (un llistón estrictu de «fluyíu» frente al to B1/B2, por exemplu) reciba'l to criteriu en llugar d'una eliminación silenciosa.

**Tomar emprestada una skill de portal d'otru fork** ye la manera prevista de llograr un portal que'l proyeutu orixinal nun inclúi: atópalo nel [índiz de portales](https://github.com/MadsLorentzen/ai-job-search/discussions/78), abre esi fork y copia esa única carpeta al to propiu `.agents/skills/`. Enantes d'executala:

- **Llee'l códigu.** To él: estes CLI execútense con aprobación previa na to máquina (`.claude/settings.json` inclúyiles na llista de permitíos) contra los tos datos profesionales. Comprueba que les úniques llamaes de rede van al portal d'empleu que dicen buscar, que `package.json` nun tien `dependencies` nin scripts de ciclu de vida (`postinstall`, etc.) y que nada llee nin escribe fuera de la so propia carpeta.
- **Executa les sos pruebes offline** (`bun test` nel directoriu `cli/` de la skill): les pruebes d'una skill bien construyida pasen ensin accesu a la rede.
- Comprueba la bandera `enabled:` y les notes sobre condiciones de serviciu de la propia skill.

El pasu de copia ye manual a propósito. La to configuración yá permite que les skills de portales instalaes s'executen ensin preguntar cada vez —asina qu'un instalador que les llograra de repositorios de terceros per ti saltaríase la única comprobación que importa: que tú leas el códigu primero. Nun esiste, y eso ye una decisión de seguridá, non una función que falte.

Les *fuentes de datos* específiques d'un mercáu (una base de datos salarial nacional, tables locales d'índices) siguen el mesmu patrón que los portales: pertenecen a un fork de mercáu, compartíes per [#78](https://github.com/MadsLorentzen/ai-job-search/discussions/78), non al proyeutu orixinal.

### Análisis comparativu de salarios

La ferramienta de salarios funciona colos datos salariales que-y apurtes (estadístiques sindicales, esportaciones de Glassdoor, investigación personal, etc.). Mira `tools/README_SALARY_TOOL.md` pa ver el formatu esperáu y la configuración. Si nun tienes datos salariales, el pasu de salariu namás s'omite.

### Empezar de cero

Pa borrar los datos del to perfil y empezar de nuevu:

```
/reset profile    # clears skill files, preserves framework rules
/reset documents  # deletes files from documents/ folder
/reset all        # both
```

`/reset` amuesa exactamente lo que se va borrar y rique que escribas `RESET` pa confirmar. Nun se borra nada enantes de que lo faigas.

### Mantenerse al día

El proyeutu orixinal avanza rápido. En llugar de traer `master` en brutu y confiar na suerte, actualiza'l to fork a un [llanzamientu etiquetáu](../../releases), un puntu de control verificáu que se describe en [CHANGELOG.md](CHANGELOG.md). `python3 tools/check_upstream_updates.py` amuesa exactamente cuáles de los tos ficheros personalizaos toca una actualización enantes de que faigas el merge, y `python3 tools/upstream_triage.py` clasifica los commits nos que vas por detrás ente «merez la pena revisar» y «probablemente saltar» (un fluxu selmanal puede publicar esto nun issue continuu). Recorríu completu en [SETUP.md, seición 8](SETUP.md#8-pulling-upstream-updates-into-your-fork).

## Conseyos pa llograr meyores resultaos

### La fondura del perfil importa

El factor más importante na calidá del resultáu ye'l nivel de detalle que pongas nel to perfil. Un perfil escasu produz candidatures xenériques; unu detalláu permite resultaos verdaderamente personalizaos.

- **Descripciones de puestos:** nun te llindes a enumerar títulos d'empleu. Describe lo que faíes de verdá en cada puestu: proyeutos concretos, ferramientes usaes, responsabilidaes y llogros midibles. Cuantu más material apurtes, con más precisión va poder el sistema reformular la to esperiencia pa distintos puestos.
- **Habilidaes en contestu:** en llugar d'enumerar «Python» o «xestión de proyeutos», describe cómo y ónde les aplicasti. «Construyí pipelines de ML pa la predicción de baxes de veceros en Python con scikit-learn» da-y al sistema muncho más con qué trabayar que «Python, aprendizaxe automáticu».
- **Toos los caminos d'incorporación funcionen:** ya apuntes `/setup` a la to carpeta `documents/`, pegues un únicu CV o faes la entrevista guiada, el principiu ye'l mesmo: una entrada más rica produz una salida más nítida.

### Descubrimientu de trayectories profesionales

El framework almite dos modes distintos de busca d'empleu:

- **Oxetivu explícitu:** sabes qué puestos o sectores quies. El sistema ayuda a perfilar y priorizar según l'encaxe.
- **Descubrimientu d'oportunidaes latentes:** al analizar tola to hestoria (non namás los títulos de los puestos, sinón el trabayu real que fixisti), el sistema pue sacar a la lluz trayectories profesionales que nun habíes consideráu. Habilidaes tresferibles qu'encaxen en sectores inesperaos, patrones en lo que gustábate o en lo que destacabes, o puestos emerxentes que combinen la to esperiencia de dominiu con teunoloxía nueva.

Pa sacar el máximu partíu a esto, dedica tiempu mientres `/setup` a describir non namás la to esperiencia, sinón qué te daba enerxía, qué te agotaba y qué querríes tener más. Esti contestu inflúi directamente en cómo'l sistema evalúa l'encaxe y qué puestos saca a la lluz mientres `/scrape`.

## Executar esto con poco o nengún dineru

Toos los runtimes d'IA de la matriz de compatibilidad d'esti fork tienen un nivel gratuitu, y el
fluxu de trabayu en sí nun cuesta nada executalo — l'únicu ingrediente de pagu que'l proyeutu
orixinal daba por supuestu yera Claude Code. Empieza por:

- **[busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md)** (español) /
  **[ai_low_budget_job_search.md](ai_low_budget_job_search.md)** (inglés): cómo rexistrate nel
  nivel gratuitu de cada IA relevante, cómo instalar los axentes de llinia de comandu gratuitos en Windows, Linux y
  macOS, cómo executar un modelu local con **Ollama** (inclusive en máquines per debaxo d'Intel de 8.ª xeneración, y per debaxo
  de la 5.ª xeneración, cola tabla de modelu/RAM), les alternatives a Ollama (LM Studio, Jan, GPT4All,
  llamafile, LocalAI, KoboldCpp, …), Google Antigravity y les sos alternatives, y un plan realista de 30 díes
  a 0 €. Tamién disponible en `.docx` y `.pdf` (xeneraos con `python3 tools/md_to_docx.py`).
- **[COMPATIBILITY.md](COMPATIBILITY.md)**: con qué axente xestionarlo, en qué sistema operativu y arquitectura de CPU,
  y cuáles son verdaderamente gratuitos.
- **`python3 tools/check_platform.py`**: amuesa lo que la to máquina puede executar (ferramientes Python, CLI de Bun,
  alternativa con Node, LaTeX) y qué instalar darréu.

## Contribuyir

¿Tas pensando en facer un PR? Llee primero [CONTRIBUTING.md](CONTRIBUTING.md) — la versión n'español ye [CONTRIBUTING.es.md](CONTRIBUTING.es.md): esplica qué se fusiona, qué vive nos forks y por qué. Ten en cuenta que esti repositoriu ye un **fork de mercáu**: les skills de portales españoles, la documentación n'español y les guíes de compatibilidad pertenecen equí, mentes que'l proyeutu orixinal sigue siendo una plantilla independiente del país.

## Agradecimientos

- [Mikkel Krogholm](https://github.com/mikkelkrogsholm) ([repositoriu de skills](https://github.com/mikkelkrogsholm/skills)) poles skills CLI de busca d'empleu
- Construyíu con [Claude Code](https://claude.com/claude-code) por [Anthropic](https://anthropic.com)
- Adaptación pa España caltenida en [BENDER35/ai-job-search-spain-freever](https://github.com/BENDER35/ai-job-search-spain-freever)

## Llicencia

MIT
