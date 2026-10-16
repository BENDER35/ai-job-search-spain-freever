# IA gratuita y de bajo presupuesto para tu búsqueda de empleo en España

> **Lee esto primero.** Los nombres de herramientas, los límites de los planes gratuitos y los nombres de modelos cambian con frecuencia — Google, OpenAI, Anthropic y los demás los revisan cada pocos meses. Todas las cifras de esta guía se comprobaron en torno a octubre de 2026 y cada una está etiquetada para que distingas lo estable de lo que no lo es. Siempre que leas *"consulta los límites actuales — cambian"* o *"verifica la disponibilidad actual"*, hazlo exactamente así antes de fiarte de ello. Todas las URLs eran válidas en octubre de 2026.

Este documento es el espejo en español de la versión en inglés, [`ai_low_budget_job_search.md`](ai_low_budget_job_search.md). Ambos archivos tienen la misma estructura y los mismos datos. (El entregable principal en este repositorio es este archivo en español: [`busqueda_ia_bajosrecursoseconomicos.md`](busqueda_ia_bajosrecursoseconomicos.md)).

## 1. Introducción: qué es esto, para quién es y qué puedes hacer con 0 €

Esta es una guía práctica para usar inteligencia artificial para encontrar y solicitar empleo **desde España, con muy poco dinero**. Asume que puedes tener 0 € disponibles y un ordenador antiguo, y dice con honestidad lo que un plan gratuito y un equipo viejo pueden y no pueden hacer.

**Para quién es**

- Cualquiera que esté buscando trabajo en España cuyo presupuesto para herramientas sea realista de 0 a 10 € al mes.
- Personas con hardware antiguo: portátiles Intel de 4.ª a 7.ª generación, e incluso máquinas de 2.ª a 4.ª generación con 4–8 GB de RAM y sin gráfica dedicada.
- Quienes quieran mantener sus datos locales siempre que sea posible y estén dispuestos a aprender algunos comandos de terminal.
- Quienes puedan querer, *mientras* buscan trabajo, construir una pequeña fuente de ingresos en línea (comercio electrónico, freelance) como puente — la guía cubre ese camino también, con particularidades de España.

**Qué puedes hacer de verdad con 0 €**

- Registrarte en el plan gratuito de los asistentes de IA principales y usarlos como asistente de carrera.
- Ejecutar el flujo de trabajo de este repositorio — `/setup`, `/scrape`, `/rank`, `/apply`, `/upskill`, `/interview` — dirigido por un agente de línea de comandos gratuito e incluso por un chat web.
- Ejecutar un modelo de lenguaje **en tu propia máquina** con Ollama (o una alternativa), totalmente sin conexión.
- Crear un CV compatible con los ATS con constructores gratuitos (Europass, FlowCV, Reactive Resume, JSON Resume).
- Comprobar cómo lee un sistema de seguimiento de candidaturas (ATS) tu CV, usando planes gratuitos.
- Ensayar entrevistas gratis.
- Mejorar tu formación gratis a través de programas públicos y privados españoles.
- Buscar empleo en portales españoles y en la red europea EURES.

**Qué no te dará 0 €**

- No te dará un modelo de vanguardia para programación agéntica ilimitada. Los mejores planes agénticos gratuitos (Antigravity, Copilot Free, Cursor Hobby, el gratuito de Windsurf) están medidos, y los grandes cambian de condiciones a menudo.
- No hará que un portátil de 2013 ejecute un modelo de 7B rápido. Lo ejecutará despacio.
- No automatizará candidaturas sin riesgos. Las herramientas de postulación masiva automática son de pago, incumplen con frecuencia los términos de los portales y producen candidaturas de baja calidad. Esta guía deliberadamente no las promueve.

> **Aviso.** Esto es orientación práctica, no asesoramiento legal, fiscal, migratorio ni financiero. Las referencias fiscales y de negocio de España (autónomo, RETA, IVA, obligaciones del dropshipping) están para que sepas qué preguntas hacer — confirma siempre los detalles con las fuentes oficiales (Agencia Tributaria / AEAT, Seguridad Social, SEPE) o con un profesional antes de actuar.

## 2. Cómo registrarte en el plan GRATUITO de todas las IA relevantes

La tabla siguiente resume los requisitos de registro. Debajo siguen notas detalladas por herramienta. **Ninguno de los planes gratuitos indicados requiere tarjeta de crédito**, pero varios requieren una cuenta de Google/Apple/Microsoft/Meta/X y, en algunos casos, un número de teléfono para verificar.

### Tabla resumen de registro

| Herramienta | URL | ¿Cuenta? | ¿Teléfono? | ¿Tarjeta? | Plan gratuito en una frase |
|---|---|---|---|---|---|
| Google Gemini (web) | gemini.google.com | Cuenta Google | No | No | Chat gratuito con modelos Gemini |
| Google AI Studio | aistudio.google.com | Cuenta Google | No | No | Uso web gratuito + clave API gratuita |
| Google Antigravity | antigravity.google | Cuenta Google | No | No | Plan individual gratuito, cupo semanal |
| ChatGPT (gratis) | chatgpt.com | Sí (email/Google/Apple) | Normalmente no | No | Chat gratuito, modelo limitado |
| OpenAI Codex | chatgpt.com/codex | Sí | Normalmente no | No | Existe plan de 0 $; acceso CLI limitado (verificar) |
| Anthropic Claude | claude.ai | Sí | A veces | No | Chat web/app gratuito; **sin** CLI gratuito |
| Microsoft Copilot | copilot.microsoft.com | Cuenta Microsoft | No | No | Chat gratuito, limitado |
| Perplexity | perplexity.ai | Sí | No | No | Búsquedas rápidas ilimitadas, pocas Pro/día |
| DeepSeek | chat.deepseek.com | Sí | A veces | No | Chat gratuito y generoso, colas en horas punta |
| Qwen Chat | chat.qwen.ai | Sí | No | No | Cuenta gratuita, modelo completo, con límite |
| Qwen Code CLI | qwen.ai/qwencode | Sí para la nube | No | No | CLI gratuita y libre; el plan gratuito de nube terminó (verificar) |
| Mistral (Le Chat / Vibe) | chat.mistral.ai | Sí | No | No | ~20–25 mensajes/día gratuitos |
| Meta AI | meta.ai | Cuenta Meta | No | No | Chat gratuito, también en WhatsApp/Instagram |
| Grok (X) | grok.com / x.com | Cuenta X | No | No | Plan gratuito, límites no publicados |
| Poe | poe.com | Sí | A veces | No | ~300 puntos de cómputo/día |
| Hugging Face | huggingface.co | Sí | No | No | Hub gratuito + pequeño crédito mensual de inferencia |
| GitHub Copilot | github.com/features/copilot | Cuenta GitHub | No | No | Gratis: 2.000 completados + 50 chats/mes |
| Windsurf | windsurf.com | Sí | No | No | Gratis: ~25 Flow Actions/mes (verificar) |
| Cursor | cursor.com | Sí | No | No | Plan Hobby con uso agéntico/pestañas limitado |
| Zed | zed.dev | Opcional | No | No | Editor gratuito; aporta tu propia clave/modelo |
| Cline / Roo / Kilo | cline.bot, roo, kilo.ai | No | No | No | Extensión gratuita; tú aportas la clave/modelo |

### 2.1 Google: Gemini, AI Studio y Antigravity

- **Gemini (chat de consumo):** [gemini.google.com](https://gemini.google.com/). Gratuito con una cuenta Google. Sin tarjeta.
- **Google AI Studio:** [aistudio.google.com](https://aistudio.google.com/). Gratis para interactuar en el navegador y emite una **clave API gratuita**. El plan gratuito de la API se ha reducido a modelos de tipo Flash; *consulta los límites actuales — cambian*.
- **Google Antigravity:** [antigravity.google](https://antigravity.google/). La plataforma agéntica de Google — un IDE, una CLI y un gestor de agentes. El **plan individual es de verdad 0 $** e, en el momento de redactar esto, incluye autocompletado de pestañas (Tab) y peticiones de comando ilimitadas, con un **tope semanal en las ejecuciones autónomas de agente**. La lista de modelos ha incluido Gemini 3.x Flash/Pro, Claude Sonnet/Opus y gpt-oss-120b. *Verifica la disponibilidad y los límites actuales.*
- **Importante:** El **18 de junio de 2026**, Google retiró **Gemini CLI** y las extensiones Gemini Code Assist de los IDE para cuentas individuales gratuitas, Pro y Ultra, sustituyéndolas por la **Antigravity CLI**. Las licencias empresariales de Code Assist y la autenticación por clave API no se vieron afectadas. Así que si un tutorial te dice que instales Gemini CLI con una cuenta gratuita, esa vía está muerta — usa la Antigravity CLI.
- **Instalación de la Antigravity CLI:** macOS/Linux `curl -fsSL https://antigravity.google/cli/install.sh | bash`; PowerShell en Windows `irm https://antigravity.google/cli/install.ps1 | iex`; CMD en Windows `curl -fsSL https://antigravity.google/cli/install.cmd -o install.cmd && install.cmd && del install.cmd`. Importa automáticamente las skills, los servidores MCP y la memoria `gemini.md` de Gemini CLI.

**Salvedades por sistema:** el IDE de Antigravity apunta a Windows/macOS/Linux modernos de 64 bits. La CLI funciona en Windows, macOS y Linux de 64 bits; en Windows, WSL2 da la experiencia más fluida.

### 2.2 OpenAI: ChatGPT gratis y Codex

- **ChatGPT gratis:** [chatgpt.com](https://chatgpt.com/). Plan gratuito, sin tarjeta, con acceso limitado a los modelos más recientes y un tope diario de mensajes.
- **Codex:** el agente de código de OpenAI. Existe un **plan de 0 $**, pero el acceso gratuito a la CLI es limitado o inexistente según el empaquetado vigente — algunas fuentes dicen que el plan gratuito es solo de escritorio, otras que Codex está incluido en todos los niveles. **Verifica el estado actual antes de organizar tu trabajo alrededor de ello.** La CLI de Codex (`npm install -g @openai/codex`, o `brew install codex`) se autentica con tu cuenta de ChatGPT o una clave API.
- **Salvedades por sistema:** la CLI de Codex funciona en Windows/macOS/Linux de 64 bits; en Windows nativo prefiere Git for Windows o WSL.

### 2.3 Anthropic: Claude (solo gratis en la web)

- **Claude gratis:** [claude.ai](https://claude.ai/). Chat gratuito en web y móvil. Los límites son dinámicos — se han observado unas **15–40 mensajes por ventana de 5 horas**, pero *consulta los límites actuales — cambian*. Sin tarjeta.
- **No existe un plan gratuito de Claude Code CLI.** Claude Code requiere una cuenta **Pro, Max, Team, Enterprise o Console (API)**. El plan gratuito de claude.ai **no** incluye Claude Code. Esta es la razón principal por la que existe este *fork*: no necesitas Claude Code para ejecutar el flujo de trabajo.
- Si alguna vez tienes acceso, Claude Code se instala con `curl -fsSL https://claude.ai/install.sh | bash` (macOS/Linux/WSL), `irm https://claude.ai/install.ps1 | iex` (PowerShell), `curl -fsSL https://claude.ai/install.cmd -o install.cmd && install.cmd && del install.cmd` (CMD), `brew install --cask claude-code`, `winget install Anthropic.ClaudeCode`, o `npm install -g @anthropic-ai/claude-code` (necesita Node 22+).

### 2.4 Microsoft Copilot

- **URL:** [copilot.microsoft.com](https://copilot.microsoft.com/) (y las aplicaciones Copilot). Chat gratuito de consumo con una cuenta Microsoft personal. Sin tarjeta. El plan gratuito es limitado — la generación de imágenes, la subida de archivos y los modelos más nuevos están detrás de planes de pago. *Consulta los límites actuales — cambian*.

### 2.5 Perplexity

- **URL:** [perplexity.ai](https://www.perplexity.ai/). El plan gratuito da **búsquedas rápidas ilimitadas con citas** y solo unas pocas **Pro Searches** al día (~3–5, varía). Sin tarjeta. Útil para investigación de empresas porque cada respuesta viene con fuente.

### 2.6 DeepSeek

- **URL:** [chat.deepseek.com](https://chat.deepseek.com/). Chat web y app gratuitos, se requiere cuenta (email; a veces teléfono). DeepSeek no publica un tope diario fijo; los límites reales son las **colas en horas punta** y la limitación de frecuencia. La API es de pago y necesita recarga. Buen valor para prompts de razonamiento.

### 2.7 Qwen

- **Qwen Chat:** [chat.qwen.ai](https://chat.qwen.ai/) — cuenta gratuita, modelo de vista previa completo, con límite de uso. También app de escritorio y móvil.
- **Qwen Code CLI:** un agente de terminal de código abierto ([github.com/QwenLM/qwen-code](https://github.com/QwenLM/qwen-code)). Se instala con `npm install -g @qwen-code/qwen-code@latest` (necesita Node 22+), `brew install qwen-code`, o el instalador independiente. **El plan gratuito OAuth de nube de Qwen se descontinuó el 15 de abril de 2026** — la CLI sigue siendo gratuita y de código abierto, pero ahora apúntala a tu propio proveedor (una clave API gratuita o un modelo local de Ollama). *Verifica la disponibilidad actual.*

### 2.8 Mistral (Le Chat / Vibe)

- **URL:** [chat.mistral.ai](https://chat.mistral.ai/). El plan gratuito da chat web y móvil con un **tope suave de ~20–25 mensajes al día** en el nivel de modelo gratuito, más búsqueda web y generación básica de imágenes. Sin tarjeta. Buen manejo multilingüe del español.

### 2.9 Meta AI

- **URL:** [meta.ai](https://www.meta.ai/) y dentro de WhatsApp, Instagram y Messenger. Gratuito con una cuenta de Meta/Facebook. Sin tarjeta. Cómodo porque ya está donde chateas.

### 2.10 Grok (X)

- **URL:** [grok.com](https://grok.com/) o dentro de X. Gratuito con una cuenta de X. xAI **no publica una cifra exacta** para el plan gratuito — su propia página describe ese plan como "límites generosos" y la búsqueda web/tiempo real en X como "Limitada". Las cifras antiguas (10 prompts cada 2 horas) provienen de un sistema retirado. *Consulta los límites actuales.*

### 2.11 Poe

- **URL:** [poe.com](https://poe.com/). Un front-end de estilo suscripción sobre muchos modelos. El plan gratuito se basa en **puntos de cómputo**: unas **300 puntos/día** (unos 15–30 mensajes cortos), tras un recorte de ~90 % en marzo de 2026. Los puntos se reinician cada día y no se acumulan. Sin tarjeta.

### 2.12 Hugging Face

- **URL:** [huggingface.co](https://huggingface.co/). Cuenta gratuita. La **Inferencia API** gratuita es ahora un pequeño **crédito mensual** (históricamente ~0,10 $/mes) gastado a los precios de los proveedores asociados, en lugar de un recuento fijo de peticiones. El Hub permite a los usuarios gratuitos unas 1.000 llamadas a la API cada 5 minutos. Útil para publicar tus propios espacios (Spaces) y datasets.

### 2.13 GitHub Copilot (plan Free)

- **URL:** [github.com/features/copilot](https://github.com/features/copilot/plans). El **Copilot Free** solo necesita una cuenta GitHub y no tarjeta: históricamente **2.000 autocompletados y 50 peticiones de chat al mes**, con selección automática de modelo. GitHub pasó todos los planes de Copilot a una **facturación por uso en "AI Credits" el 1 de junio de 2026**, así que la asignación gratuita exacta ha cambiado — *consulta los límites actuales*.

### 2.14 Windsurf y Cursor (planes gratuitos de IDE)

- **Windsurf:** [windsurf.com](https://windsurf.com/). El plan gratuito ha sido históricamente **~25 Flow Actions al mes**, el modelo SWE-1 mini y una ventana de contexto de 16K. *Verifica los límites actuales.*
- **Cursor:** [cursor.com](https://cursor.com/). Plan **Hobby** a 0 $, sin tarjeta: peticiones de agente limitadas y autocompletado de pestañas limitado. Cursor ya no publica una cifra pública fija del Hobby, así que trata cualquier número que encuentres como obsoleto.

### 2.15 Zed

- **URL:** [zed.dev](https://zed.dev/). Un editor rápido y de código abierto. El **plan gratuito es gratis para siempre** y, lo importante, te deja usar **tus propias claves API o agentes externos** (incluidos modelos locales) sin suscribirte. Los planes de pago añaden créditos de modelo alojado y predicciones de edición. Genial si ya tienes una clave API gratuita o un modelo local de Ollama.

### 2.16 Cline, Roo Code y Kilo Code (trae tu propia clave)

Son **extensiones de VS Code / JetBrains** y son **gratuitas cuando aportas tu propio modelo**: una clave API en la nube gratuita (Groq, OpenRouter, Cerebras, Google AI Studio) o un modelo local de Ollama.

- **Cline:** [cline.bot](https://cline.bot/). En 2026 añadió opciones alojadas, pero la vía BYOK sigue siendo gratuita.
- **Roo Code:** un *fork* de Cline; mismo patrón. *Nota: al menos una fuente indica que Roo Code se descontinuó en mayo de 2026 — verifica la disponibilidad actual.*
- **Kilo Code:** [kilo.ai](https://kilo.ai/). Agente de código abierto para VS Code, JetBrains y CLI; sin recargo sobre el uso de modelos si usas tus propias claves, y puede ejecutar modelos locales.

### 2.17 Opciones locales primero

Si no tienes dinero **y** no tienes internet fiable, todo puede ejecutarse en tu máquina: Ollama (sección 5), o una alternativa de la sección 7. No necesitan cuenta, ni teléfono, ni tarjeta.

## 3. IA dedicada a la búsqueda de empleo y a las candidaturas

### 3.1 El propio flujo de trabajo de este repositorio (la mejor opción gratuita)

Este repositorio *es* un sistema de búsqueda de empleo con IA. El flujo vive en [`.claude/`](.claude/): las especificaciones en `.claude/skills/` y los comandos en `.claude/commands/`. Lo diriges con **cualquier** agente de IA de línea de comandos — Google Antigravity (IDE/CLI), Codex CLI, Qwen Code, **opencode**, **Aider**, Cline, Roo, Kilo, Continue o Goose — a través de archivos *thin pointer* (`GEMINI.md`, `QWEN.md`, `CONVENTIONS.md`, `.cursorrules`, etc.). Ver [SETUP.es.md](SETUP.es.md) y [COMPATIBILIDAD.md](COMPATIBILIDAD.md).

Los comandos que usarás de verdad:

- **`/setup`** — te entrevista y rellena tu perfil.
- **`/scrape`** — busca en portales de empleo mediante las CLI `*-search` instaladas (Tecnoempleo, InfoJobs, LinkedIn, freehire y más), deduplica y presenta las coincidencias nuevas.
- **`/rank`** — puntua en lote los trabajos raspados y devuelve una lista corta ordenada, para que solo gastes esfuerzo en `/apply` donde vale la pena.
- **`/apply`** — el flujo borrador–revisor: evalúa el encaje, redacta un CV y una carta de presentación personalizados en LaTeX, hace que un segundo agente los critique y luego compila e inspecciona visualmente los PDF y los revisa con un lector de ATS.
- **`/upskill`** — compara los trabajos registrados con tu perfil y produce un plan de aprendizaje priorizado.
- **`/interview`** — construye un pack de preparación específico para la etapa de la entrevista, con un ensayo opcional.
- **`/expand`**, **`/outcome`**, **/html-report**, **`/notion-sync`**, **`/gmail-sync`**, **`/add-portal`**, **`/add-template`**, **`/reset`** — enriquecimiento del perfil, registro de resultados, un panel, sincronizaciones y personalización.

Casi todo esto funciona cómodamente en un plan agéntico gratuito, porque lo pesado es texto: interpretar una oferta, valorar el encaje, redactar. El único paso realmente exigente es redactar LaTeX e iterar sobre los PDF compilados — ver la sección 5.5 sobre lo que puede y no puede hacer un modelo local aquí.

### 3.2 Herramientas de IA de empleo del mercado español

- **RadarJobs** ([radarjobs.ai](https://radarjobs.ai/)) — un "radar personal" español que explica el encaje de cada oferta, cubre el corpus tecnológico español, y estaba **gratis en beta** en el momento de redactar. *Verifica la disponibilidad y el precio actuales.*
- **InfoJobs IA** ([infojobs.net](https://www.infojobs.net/)) — el mayor portal de España. Su **puntuación de encaje con IA** es gratuita, y tiene un detalle de privacidad interesante: tu expectativa salarial nunca se muestra a la empresa. La búsqueda es gratuita.
- **Tecnoempleo** ([tecnoempleo.com](https://www.tecnoempleo.com/)) — el portal especializado en TI/telecomunicaciones. Gratis para buscar y postular. Este repositorio incluye una *skill* de portal español para él en `.agents/skills/`.
- **LinkedIn** — la búsqueda conversacional de empleo es **gratuita**; el análisis más profundo de "cuánto encajas" está en **Premium** (~40 €/mes). No lo pagues mientras estés sin dinero.
- **Talent.com** ([talent.com](https://es.talent.com/)) — agregador gratuito con datos salariales.
- **Jobcopilot / Jobloo / Sorce / LazyApply** — aplicaciones de búsqueda y postulación automática con IA. Algunas tienen planes gratuitos (Jobloo anuncia hasta 50 candidaturas/día gratis; Sorce ~40 "swipes"/día), pero **las herramientas de postulación masiva automática son de pago, incumplen a menudo los términos de los portales y no se recomiendan aquí**. Trata con escepticismo sus afirmaciones de gratuidad.

> **No verificado:** el encargo de esta guía mencionaba una herramienta española llamada **"Ajos"**. Búsquedas repetidas en la web no encontraron ningún producto de búsqueda de empleo con ese nombre — la palabra solo aparece en contextos no relacionados (cosecha del ajo, etc.). Puede ser una confusión con otro nombre. **"Ajos" no parece existir como herramienta de empleo; verifica antes de fiarte de cualquier mención.**

### 3.3 Constructores de CV con planes gratuitos reales

| Constructor | URL | Plan gratuito | Notas |
|---|---|---|---|
| Europass | europass.europa.eu | Totalmente gratuito | El CV de referencia en Europa; emítelo en español y en inglés |
| FlowCV | flowcv.com | Plan gratuito | Plantillas limpias y compatibles con ATS; comprueba cuántos CV y exportaciones gratuitas incluye |
| Reactive Resume | rxresu.me | Totalmente gratuito y de código abierto (MIT) | Sin anuncios ni plan de pago; autoalojable con Docker |
| JSON Resume | jsonresume.org | Gratuito, estándar abierto | Datos portables; combina con temas gratuitos |
| Canva CV | canva.com/resumes | Gratis con elementos gratuitos | La descarga en PDF es gratuita si usas solo elementos gratuitos; ~20 usos de IA al mes |

### 3.4 Comprobadores de ATS con planes gratuitos útiles

| Comprobador | URL | Plan gratuito | Notas |
|---|---|---|---|
| Jobscan | jobscan.co | ~5 análisis/mes | El mejor para palabras clave frente a la oferta; se queda de pago pronto |
| Teal | tealhq.com | Plan gratuito generoso | ~90 % de funciones gratis, incluido Match Mode y un gestor de candidaturas |
| Huntr | huntr.co | Plan gratuito | Seguimiento de candidaturas y herramientas de CV |
| Resume Worded | resumeworded.com | Gratis limitado | Puntuación general y comentarios por línea gratis; la comparación dirigida es de pago |

Revisar el ATS es de los pocos casos en que una herramienta gratuita le gana a un chat de IA gratuita, porque el comprobador sabe cómo se comportan los analizadores reales. Pero sé honesto con lo que significa la puntuación: el mismo CV sano puede puntuar 15–20 puntos distinto entre herramientas. Úsalo como comprobación de huecos de palabras clave, nunca como razón para rellenar palabras clave (*keyword stuffing*).

### 3.5 Preparación de entrevistas

> **Corrección importante.** **"Interview Warmup" de Google ha sido retirado.** Se eliminó durante 2026; el enlace antiguo (`grow.google/certificates/interview-warmup/`) ya no lo ofrece. No planifiques en torno a ello. Si una herramienta de pago o un tutorial todavía te apunta a él, está desactualizado.

Sustitutos gratuitos:

- **Usa un chat de IA gratuita** como entrevistador simulado. Pega la oferta de empleo y pídele que te entreviste en español, pregunta a pregunta, y luego que critique tus respuestas. Es gratis con Gemini, ChatGPT, DeepSeek, Qwen o un modelo local.
- **Usa el comando `/interview`** de este repositorio, que construye un pack de preparación específico a partir de tus propias candidaturas registradas.
- **Grow with Google** ([grow.google](https://grow.google/)) sigue publicando artículos y técnicas gratuitas de preparación de entrevistas, aunque la herramienta Warmup haya desaparecido.

### 3.6 Ayudas para la carta de presentación

No hay ninguna herramienta gratuita dedicada a cartas de presentación que merezca la pena; el mejor enfoque gratuito es un **chat de IA gratuito más el `/apply`** de este repositorio, que redacta una carta estrictamente basada en tu perfil real y luego la revisa en busca de inventos. Ver sección 11 (nunca inventes).

### 3.7 Cómo usar bien los chats gratuitos

- Dale al modelo **el texto de la oferta y el de tu CV** en el mismo mensaje, y pídele un análisis de huecos antes de que escriba nada.
- Pídele que **cite la línea exacta de tu CV** que respalda cada afirmación, para que puedas cazar una alucinación.
- Ten un **documento de "datos maestros"** con tus cifras y logros reales y pégalo cada vez. Eso es exactamente lo que son los archivos de perfil de este repositorio.

## 4. Instalar las IA de línea de comandos gratis (Windows, Linux, macOS)

No necesitas todas. Elige un agente de línea de comandos gratuito más lo básico.

### 4.1 La configuración mínima viable

**Node.js + npm + una CLI gratuita + git.** Con eso basta para clonar este repositorio, ejecutar las CLI de portales y dirigir el flujo de trabajo con opencode, Qwen Code, Codex o Antigravity. Añade Python 3 solo si quieres usar Aider o las herramientas Python auxiliares del repo (`tools/*.py`).

### 4.2 Requisitos previos

| Herramienta | Windows | macOS | Linux |
|---|---|---|---|
| **Node.js + npm** | `winget install OpenJS.NodeJS.LTS` | `brew install node` | `sudo apt install nodejs npm` (Debian/Ubuntu), `sudo dnf install nodejs npm` (Fedora) |
| **Bun** (opcional, más rápido) | `powershell -c "irm bun.sh/install.ps1 | iex"` | `curl -fsSL https://bun.sh/install | bash` | `curl -fsSL https://bun.sh/install | bash` |
| **Python 3** | `winget install Python.Python.3.12` | `brew install python` | `sudo apt install python3 python3-pip` |
| **Git** | `winget install Git.Git` | `brew install git` (o `xcode-select --install`) | `sudo apt install git` |
| **WSL2** (Windows, recomendado) | `wsl --install` en PowerShell como administrador, y reinicia | — | — |

Gestores de paquetes en Windows: **winget** viene integrado en Windows 10/11 (App Installer); **Chocolatey** ([chocolatey.org](https://chocolatey.org/)) y **Scoop** ([scoop.sh](https://scoop.sh/)) son alternativas. En macOS: **Homebrew** ([brew.sh](https://brew.sh/)). En Linux: **apt** (Debian/Ubuntu), **dnf** (Fedora/RHEL), **pacman** (Arch).

Comprueba tus herramientas:

```bash
node --version
npm --version
python3 --version
git --version
```

### 4.3 Las IA de línea de comandos

| Agente | Instalación | Vía gratuita | Notas |
|---|---|---|---|
| **Antigravity CLI** | `curl -fsSL https://antigravity.google/cli/install.sh | bash` | Plan individual gratuito | El sucesor de Gemini CLI por Google |
| **Qwen Code** | `npm install -g @qwen-code/qwen-code@latest` | CLI gratuita; el plan de nube acabó | Necesita Node 22+; apúntala a tu propio modelo/local |
| **Codex CLI** | `npm install -g @openai/codex` o `brew install codex` | Gratuita limitada (verificar) | Cuenta de ChatGPT o clave API |
| **opencode** | `curl -fsSL https://opencode.ai/install | bash` o `npm install -g opencode-ai` | CLI gratuita; usa modelo gratuito/local | También `brew install anomalyco/tap/opencode`, `choco/scoop install opencode`, `sudo pacman -S opencode` |
| **Aider** | `python -m pip install aider-install && aider-install` | Gratuita; usa modelo gratuito/local | También `pipx install aider-chat`, `brew install aider` |
| **Claude Code** | `curl -fsSL https://claude.ai/install.sh | bash` | **Sin plan gratuito** | Requiere Pro/Max/Team/Enterprise/Console |
| **Cline / Roo / Kilo** | Marketplace de VS Code | Extensión gratuita (BYOK) | Apúntala a una clave gratuita u Ollama |
| **Continue** | Marketplace VS Code / JetBrains | Extensión gratuita (BYOK) | Buena experiencia con modelos locales |
| **Goose** | `curl -fsSL https://github.com/aaif-goose/goose/releases/download/stable/download_cli.sh | bash` | Gratuita, BYOK | Agente construido en Rust |

**Nota sobre Gemini CLI:** `npm install -g @google/gemini-cli` sigue instalando el paquete, pero con cuentas individuales gratuitas ya no atiende peticiones (retirado el 18 de junio de 2026). Úsala solo con una clave API de pago o con Vertex AI.

## 5. Ollama: un modelo de lenguaje en tu propia máquina

### 5.1 Qué es Ollama

[Ollama](https://ollama.com/) es la forma más fácil de descargar y ejecutar modelos de lenguaje de pesos abiertos **localmente**. Lanza un pequeño servidor en tu máquina (por defecto `http://localhost:11434`) con una CLI y una **API compatible con OpenAI**, así que la mayoría de las herramientas de IA pueden hablar con él como si fuera OpenAI. Es gratuita, de código abierto y no requiere cuenta para los modelos locales.

### 5.2 Instalar Ollama

- **macOS:** `brew install ollama`, o descarga la app desde [ollama.com/download](https://ollama.com/download).
- **Linux:** `curl -fsSL https://ollama.com/install.sh | sh`. Después ejecútalo como servicio: `sudo systemctl enable ollama && sudo systemctl start ollama`. Arranque manual: `ollama serve`.
- **Windows:** `irm https://ollama.com/install.ps1 | iex` en PowerShell, o descarga el instalador. Se ejecuta como servicio en segundo plano.
- **Comprobación:** `ollama --version` y luego `ollama list`.

### 5.3 Descargar modelos

```bash
ollama pull llama3.2:3b
ollama pull qwen2.5:3b
ollama pull phi3.5
ollama pull gemma2:2b
ollama pull mistral:7b
ollama pull deepseek-r1:1.5b
ollama pull deepseek-r1:7b
ollama pull llava          # visión
ollama pull nomic-embed-text
```

> **Consulta la biblioteca.** El campo de los modelos abiertos va muy rápido. Ya existen familias más nuevas — **qwen3, gemma3/gemma4, llama3.3, deepseek-v3** — y el inicio rápido de Ollama ahora recomienda un modelo pequeño `gemma4` como inicial. Las etiquetas anteriores siguen siendo útiles, pero ejecuta `ollama list` / consulta [ollama.com/library](https://ollama.com/library) para los nombres actuales.

### 5.4 Guía de RAM/VRAM

Regla general: un modelo a **4 bits** (Q4) necesita aproximadamente **0,6 GB de RAM por cada mil millones de parámetros**, más la sobrecarga de la ventana de contexto y del sistema operativo. Una máquina con gráfica dedicada va mucho más rápido, pero también funciona solo con CPU.

| Etiqueta del modelo | Descarga aprox. | RAM mínima (CPU) | Cómodo |
|---|---|---|---|
| qwen2.5:0.5b | ~0,4 GB | 2 GB | 4 GB |
| llama3.2:1b | ~1,3 GB | 3 GB | 4 GB |
| gemma2:2b | ~1,6 GB | 4 GB | 6 GB |
| qwen2.5:3b | ~1,9 GB | 4 GB | 8 GB |
| llama3.2:3b | ~2,0 GB | 4 GB | 8 GB |
| phi3.5 | ~2,2 GB | 4 GB | 6 GB |
| deepseek-r1:1.5b | ~1,1 GB | 3 GB | 4 GB |
| mistral:7b | ~4,1 GB | 8 GB | 16 GB |
| deepseek-r1:7b | ~4,7 GB | 8 GB | 16 GB |
| deepseek-r1:8b | ~5,2 GB | 10 GB | 16 GB |
| llava (visión) | ~4,7 GB | 8 GB | 12 GB |
| nomic-embed-text | ~0,3 GB | 2 GB | 4 GB |

Las cifras son orientativas; el tamaño exacto depende de la etiqueta de cuantización y de la longitud de contexto que pidas.

### 5.5 Usar Ollama con ESTE repositorio: qué puede y qué no puede hacer un modelo local

**Un modelo local de 3B–7B puede hacer razonablemente, sin conexión:**

- **Resumir una oferta de empleo** — condensar un anuncio largo en requisitos, imprescindibles y señales de alerta.
- **Redactar y traducir texto** — un primer borrador de párrafo de la carta de presentación, o una traducción español↔inglés de una oferta.
- **Extraer palabras clave** — sacar las competencias que buscará un ATS.
- **Entrevistas simuladas** — hacer de entrevistador y hacer preguntas de seguimiento.
- **Postprocesado con `pdftotext`** — limpiar o reformatear el texto de CV extraído.
- **Triaje inicial de encaje** — un "¿merece la pena mirarlo de cerca?" antes de gastar cuota en la nube.

**Un modelo local de 3B–7B no hace bien, y necesita un modelo fuerte en la nube:**

- **El pipeline completo borrador–revisor de `/apply`.** Requiere razonamiento de contexto largo, seguimiento cuidadoso de instrucciones a lo largo de muchos turnos y uso fiable de herramientas. Los modelos locales pequeños se desvían, olvidan el perfil y alucinan.
- **Razonamiento de contexto largo** con todo el CV más una oferta larga más las especificaciones del marco a la vez.
- **Depurar LaTeX.** Corregir un salto de página o un error de fuente en `.tex` exige una precisión que rara vez tienen los modelos pequeños; pasarás más tiempo corrigiéndolos que escribiendo el archivo.
- **Cualquier ejecución agéntica multietapa** donde importe la fiabilidad. Los modelos locales pequeños también son mucho más débiles en el uso estructurado de herramientas del que dependen los agentes.

**Resumen honesto:** usa el modelo local para los trabajos baratos, voluminosos y tolerantes (resumen, traducción, palabras clave, preguntas y respuestas simuladas). Guarda tu cuota gratuita en la **nube** para los pasos exigentes (la redacción y la iteración de PDF de `/apply`, la investigación de la empresa, la revisión final). Ese reparto es todo el truco para ejecutar el flujo de trabajo con 0 €.

### 5.6 Conectar Ollama a un agente de línea de comandos

- **opencode** — crea `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "ollama": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Ollama (local)",
      "options": { "baseURL": "http://localhost:11434/v1" },
      "models": { "qwen2.5:7b": { "name": "Qwen2.5 7B (local)" } }
    }
  }
}
```

- **Aider** — `aider --model ollama/qwen2.5:7b` (Aider habla con Ollama de forma nativa), o define `OPENAI_API_BASE=http://localhost:11434/v1` y `OPENAI_API_KEY=ollama`.
- **Cline / Roo / Kilo / Continue** — en los ajustes de la extensión elige el proveedor **OpenAI Compatible**, la URL base `http://localhost:11434/v1`, cualquier cadena de clave API y el nombre exacto del modelo que aparece en `ollama list`.
- **Goose** — configura un proveedor compatible con OpenAI con la misma URL base.
- **El propio lanzador de Ollama** — las versiones más recientes pueden arrancar un agente por ti: `ollama launch opencode`, `ollama launch claude`, `ollama launch codex`.
- **El servidor** — `ollama serve` lo inicia; define `OLLAMA_HOST` para cambiar la dirección de enlace (p. ej. para exponerlo a otra máquina de tu red local).

### 5.7 Concesiones a esperar

- **Ventana de contexto.** Los modelos locales suelen usar un contexto efectivo menor que los de la nube; se les caerá la parte central de un prompt largo.
- **Sin uso de herramientas fiable / comportamiento agéntico.** Espera hacer más trabajo manual paso a paso.
- **Velocidad.** En CPU, los modelos pequeños pueden ir a pocos tokens por segundo — bien para respuestas cortas, penoso para borradores largos.
- **Calidad.** Un modelo de 3B escribe como un modelo de 3B. No envíes su salida sin leerla.

## 6. Hardware antiguo: ejecutar un modelo útil por debajo de Intel 8.ª generación (y de la 5.ª)

El titular honesto: en máquinas antiguas solo con CPU **puedes** ejecutar un modelo pequeño, pero notarás todas sus limitaciones. Si tu máquina es realmente antigua, los planes gratuitos en **la nube** de la sección 2 te servirán mejor que un modelo local. Usa el modelo local para lo privado/sin conexión y la nube para la calidad.

### 6.1 Nivel A — por debajo de Intel 8.ª gen (i5/i7 de 4.ª a 7.ª), 8 GB de RAM, sin gráfica

- **Cuantización:** prefiere **Q4_K_M** (el buen equilibrio). Si la RAM aprieta, **Q3_K_M**.
- **Modelos:** `llama3.2:3b`, `qwen2.5:3b`, `phi3.5`, `deepseek-r1:1.5b`; un 7B como `mistral:7b` solo si tienes 16 GB.
- **Velocidad esperada (CPU):** aproximadamente **2–8 tokens/segundo** para modelos de 3B, menos para 7B.
- **Veredicto:** usable para resúmenes, traducciones y entrevistas simuladas. Demasiado lento y poco fiable para ejecuciones agénticas completas.

### 6.2 Nivel B — por debajo de Intel 5.ª gen (2.ª a 4.ª), 4–8 GB de RAM

- **Cuantización:** **Q3** y **Q2_K** para caber en la RAM; la calidad cae notablemente con Q2.
- **Por RAM:**
  - **4 GB:** `qwen2.5:0.5b`, `llama3.2:1b`, `gemma:2b`.
  - **8 GB:** `llama3.2:3b`, `qwen2.5:3b`, `phi3.5`, `deepseek-r1:1.5b`.
  - **16 GB (si tienes):** `qwen2.5:7b`, `llama3.1:8b`, `mistral:7b` a 4 bits.
- **Velocidad esperada:** **1–4 tokens/segundo** para modelos de 1B–3B; un 7B puede ir por debajo de 1 tok/s.
- **Veredicto:** un modelo de 1B solo es útil para tareas breves. Trátalo como un ayudante, no como un asistente.

### 6.3 Ajustes y mantenimiento

- **`num_ctx`** — la ventana de contexto en tokens. Bájala (p. ej. 2048 u 4096) para ahorrar RAM y ganar velocidad. Ajústala por ejecución, p. ej. `ollama run llama3.2:3b --parameter num_ctx 4096` o vía un Modelfile.
- **`num_thread`** — ajústalo a tus núcleos **físicos** (no a los hiperventilados). Demasiados hilos ralentiza.
- **Deja los modelos en disco** — `OLLAMA_MODELS` te permite apuntar el almacén a un disco mayor, p. ej. `export OLLAMA_MODELS=/mnt/bigdisk/ollama`. En Windows define la variable como entorno de sistema.
- **Expectativas solo con CPU** — unos pocos tokens por segundo es normal. No asumas que tu máquina está rota.
- **Riesgo de intercambio (swap)** — si un modelo no cabe en la RAM, el SO empieza a intercambiar con el disco y la máquina queda inservible. Si ves el LED de disco encendido sin parar, para y elige un modelo más pequeño o una cuantización menor.
- **Térmicas y baterías viejas** — la inferencia sostenida en CPU calienta la máquina y gasta la batería. Úsala enchufada, sobre una superficie dura y con pausas. En un portátil viejo, el *throttling* térmico puede reducir a la mitad tu ya baja velocidad.
- **La alternativa realista:** con hardware del Nivel B, omite los modelos locales para lo importante y usa los **planes gratuitos en la nube** (Antigravity, ChatGPT gratis, Gemini, DeepSeek, Qwen, Copilot). Son más rápidos, más listos y no cuestan nada.

### 6.4 Máquinas solo de 32 bits

**Ollama no publica ninguna compilación de 32 bits (ia32).** Si tu máquina es solo de 32 bits (algunos portátiles muy antiguos de la era de Windows XP/Vista y algunos netbooks), no podrás ejecutar Ollama en absoluto. **Qué hacer en su lugar:**

- Usa **chats web gratuitos** en un navegador (la inferencia se hace en el servidor, así que tu CPU solo tiene que renderizar una página).
- Usa un **teléfono** con una app pequeña en el dispositivo (ver PocketPal/MLC en la sección 7).
- Si la máquina puede ejecutar un Linux ligero y existe una compilación de 32 bits de `llama.cpp` para ella, esa es la única vía local — pero espera que sea extremadamente lenta. *Verifica tu arquitectura concreta antes de invertir tiempo.*
- Con honestidad: en una máquina solo de 32 bits, trata los **planes gratuitos en la nube como tu única IA práctica** y usa la máquina para navegar y escribir.

## 7. Alternativas y programas complementarios a Ollama

### 7.1 Tabla comparativa

| Herramienta | SO | ¿32 bits? | RAM necesaria | Notas |
|---|---|---|---|---|
| **Ollama** | Win, macOS, Linux | No | 2 GB+ (pequeño) a 16 GB+ | CLI + API compatible con OpenAI; la elección por defecto |
| **LM Studio** | Win, macOS, Linux | No | 6 GB+ | Interfaz pulida, explorador de modelos, servidor en :1234; código cerrado |
| **llamafile** | Win, macOS, Linux (64 bits) | No | 4 GB+ | Un ejecutable = modelo + motor + servidor; sin instalación |
| **Jan** | Win, macOS, Linux | No | 4 GB+ | De código abierto, sin telemetría; primero la privacidad |
| **GPT4All** | Win, macOS, Linux | No | 4 GB+ | La instalación más pequeña; chat de documentos integrado (LocalDocs) |
| **LocalAI** | Win, macOS, Linux, Docker | No | 4 GB+ | API de reemplazo de OpenAI, también TTS/STT/imágenes |
| **llama.cpp / llama-server** | Win, macOS Linux | Pocas compilaciones de 32 bits | 2 GB+ | El motor bajo muchas herramientas; el mayor control |
| **vLLM** | Linux | No | **GPU obligatoria** | Servicio de alto rendimiento; no para hardware antiguo |
| **text-generation-webui (oobabooga)** | Win, macOS, Linux | No | 6 GB+ | Interfaz web para usuarios avanzados, muchos cargadores |
| **KoboldCpp** | Win, macOS, Linux | No | 4 GB+ | Un solo archivo, muy bueno para escritura creativa |
| **Msty** | Win, macOS, Linux | No | 6 GB+ | Espacio de trabajo pulido, multmodelo |
| **AnythingLLM** | Win, macOS, Linux | No | 6 GB+ | Espacios de documentos y agentes sobre Ollama/LM Studio |
| **Open WebUI** | Docker/Linux | No | 4 GB+ | Front-end tipo ChatGPT autoalojado para Ollama |
| **PocketPal / MLC-LLM** | iOS, Android | N/A | RAM del teléfono | Ejecuta modelos pequeños **en tu teléfono** |

### 7.2 Si decides no ejecutar nada localmente

Rutas gratuitas, sin instalar, hacia modelos reales:

- **Chats web gratuitos** — Gemini, ChatGPT gratis, Copilot, DeepSeek, Qwen Chat, Mistral, Grok, Perplexity, Poe.
- **Google Colab** ([colab.research.google.com](https://colab.research.google.com/)) — plan gratuito con horas de GPU semanales limitadas (históricamente tipo T4). Bien para una ejecución puntual de un modelo mayor, no para uso diario.
- **Google AI Studio API** — plan gratuito de clave API (modelos tipo Flash); *consulta los límites actuales*.
- **Vertex AI Express mode** — 90 días gratis dentro de los límites, sin cuenta de facturación, para usuarios nuevos de Google Cloud con cuenta @gmail.com (verificar). Existe un crédito gratuito de 300 $ en Google Cloud, pero desde ~marzo de 2026 no cubre la API de Gemini en AIStudio — solo Vertex.
- **Groq** ([groq.com](https://groq.com/)) — plan gratuito con inferencia muy rápida sobre modelos abiertos.
- **Cerebras** ([cerebras.ai](https://www.cerebras.ai/)) — plan gratuito en sus modelos alojados.
- **OpenRouter** ([openrouter.ai](https://openrouter.ai/)) — una clave API, más de 20 modelos gratuitos; el plan gratuito ronda **20 peticiones/minuto y 50/día**, subiendo a ~1.000/día tras una recarga única de 10 $. La lista de modelos con `:free` cambia a menudo.

## 8. Google Antigravity y sus alternativas para automatizar la búsqueda de empleo con poco presupuesto

Antigravity (sección 2.1) es ahora el plan agéntico gratuito más generoso para dirigir este repositorio, pero no es la única opción. Así se elige.

| Herramienta | Tipo | Plan gratuito | Mejor para | Elígelo si… |
|---|---|---|---|---|
| **Google Antigravity** | IDE + CLI + gestor de agentes | Plan individual gratuito, tope agéntico semanal | Ejecutar el flujo completo `/apply` | Quieres una sola herramienta gratuita capaz de tareas multietapa |
| **opencode** | Agente de terminal | CLI gratuita, BYOK/local | Los tres sistemas operativos, scriptable | Te gusta la terminal y quieres libertad de modelo |
| **Qwen Code** | Agente de terminal | CLI gratuita, BYOK/local | Código con contexto largo | Ya usas Qwen o quieres una herramienta al estilo de Gemini CLI |
| **Aider** | Agente de terminal | Gratuita, BYOK/local | Edición consciente de Git, funciona con Ollama | Tu proyecto es un repositorio Git (éste lo es) |
| **Kilo Code / Cline** | Extensión de VS Code | Extensión gratuita, BYOK/local | Editar el CV y la carta LaTeX visualmente | Prefieres una interfaz gráfica dentro de VS Code |
| **Continue** | VS Code/JetBrains | Extensión gratuita, BYOK/local | Mezclar modelos locales y de la nube | Quieres un único panel para ambos |
| **Goose** | CLI + escritorio | Gratuita, BYOK | Flujos con muchos MCP | Quieres un agente rápido en Rust |
| **Trae** | IDE | Plan gratuito (ByteDance) | Un sabor tipo Cursor gratis | Quieres un IDE pulido y aceptas los trade-offs |
| **Cursor (Hobby)** | IDE | Gratuito limitado | Probar un IDE agéntico | Puede que te suscribas después |
| **Windsurf** | IDE | ~25 acciones/mes gratis | Ediciones agénticas ocasionales | Tu uso es ligero |
| **GitHub Copilot** | Extensión de IDE | 2.000 completados + 50 chats/mes | Autocompletado mientras editas el LaTeX | Eres estudiante o ya contribuyes a OSS |

**Regla simple:** si quieres la menor fricción y la mayor capacidad gratis, **empieza por Antigravity**. Si quieres trabajar casi siempre sin conexión o con una máquina antigua, combina un agente de terminal ligero (**opencode** o **Aider**) con un **modelo local de Ollama**, y conserva un plan gratuito en la nube para los pasos difíciles.

## 9. Encontrar trabajo con IA cuando el dinero aprieta

### 9.1 Formación gratuita (España)

- **Fundación Telefónica — Conecta Empleo** ([fundaciontelefonica.com](https://www.fundaciontelefonica.com/)) — cursos gratuitos de competencias digitales y empleabilidad, incluidos IA y datos.
- **Fundae** ([fundae.es](https://www.fundae.es/)) — la Fundación Estatal para la Formación en el Empleo. Los portales gratuitos **Experiencia Fundae** ([experienciafundae.es](https://experienciafundae.es/)) y **eFundae** ([efundae.es](https://www.efundae.es/)) ofrecen cursos subvencionados y 100 % gratuitos en IA, ciberseguridad, marketing digital y más.
- **Formación del SEPE** ([sepe.es](https://www.sepe.es/)) — cursos gratuitos para personas trabajadoras y desempleadas, a través de tu servicio público de empleo autonómico.
- **Google Career Certificates / Grow with Google** ([grow.google](https://grow.google/)) — cursos gratuitos y, en algunos programas, becas.
- **Microsoft Learn** y **Meta Blueprint** — rutas de aprendizaje gratuitas (los exámenes de certificación pueden ser de pago).
- **freeCodeCamp** ([freecodecamp.org](https://www.freecodecamp.org/)) y **CS50** ([cs50.harvard.edu](https://cs50.harvard.edu/)) — totalmente gratuitos y de alta calidad.
- **Coursera en modo auditoría** — asiste gratis a las lecciones; solo pagas si quieres el certificado.

Usa el **`/upskill`** de este repositorio para convertir los trabajos que has registrado de verdad en un plan de aprendizaje priorizado, y después **`/rank`** para concentrar tu esfuerzo en los puestos donde estás más cerca de estar cualificado.

### 9.2 Servicios públicos de empleo españoles

- **SEPE** ([sepe.es](https://www.sepe.es/)) — el servicio público de empleo estatal: prestaciones por desempleo, búsqueda de empleo, formación.
- **Tu servicio autonómico** — cada comunidad autónoma tiene el suyo: p. ej. el SEPE más el *Servicio Público de Empleo* de tu comunidad (Madrid, Cataluña/SOC, Andalucía/SAE, País Vasco/Lanbide, etc.). Inscríbete en tu servicio autonómico, no solo en el SEPE.
- **Garantía Juvenil** — la Garantía Europea para la Juventud para personas de **18 a 29 años**: formación gratuita, aprendizajes y apoyo al empleo. Los requisitos incluyen estar empadronado/inscrito en España; *verifica las condiciones actuales*.
- **EURES** ([eures.europa.eu](https://eures.europa.eu/)) — la red europea de movilidad laboral. Gratuita y con ofertas de toda la UE, más el apoyo del **Targeted Mobility Scheme** para entrevistas, reubicación y cursos de idiomas. Combínala con un CV **Europass**.

### 9.3 Candidaturas especulativas y trabajo en remoto

- Las **candidaturas especulativas** funcionan bien con IA: investiga la hoja de ruta pública de una empresa y después envía una carta breve y específica a una persona con nombre y cargo. Usa `/apply` con una oferta pegada o un resumen de investigación como "oferta".
- El **trabajo en remoto para empresas extranjeras** suele pagar más que el mercado español por el mismo trabajo. Busca en los portales descontextualizados de este repositorio (LinkedIn, freehire) y en EURES. Revisa las implicaciones fiscales y de *autónomo* si facturas a un cliente extranjero (sección 9.5).

### 9.4 Plataformas freelance con planes gratuitos

| Plataforma | ¿Gratis para unirte? | Notas |
|---|---|---|
| **Malt** | Sí | El mercado más conocido para tech/consultoría freelance en España |
| **Workana** | Sí | Fuerte en España y Latinoamérica |
| **Upwork** | Sí | La mayor cobertura de categorías; cobra comisión sobre lo que ganas |
| **Freelancer.com** | Sí | Muy grande; competitivo |
| **Fiverr** | Sí | Vende "gigs" empaquetados; bien para servicios repetibles |

Todas cobran comisiones sobre lo que ganas (nunca por unirte). Tenlo en cuenta en tu presupuesto y recuerda que facturar como freelancer en España generalmente implica darte de alta como autónomo (sección 9.5).

### 9.5 El camino de la renta en línea / comercio electrónico (particularidades españolas)

Si quieres construir ingresos en línea **mientras** buscas trabajo, aquí está la realidad española. **Esto es orientación, no asesoramiento legal ni fiscal — confirma todo con AEAT, Seguridad Social y un profesional.**

- **El dropshipping es legal en España**, pero no está libre de obligaciones. Hay que cumplir las reglas del comercio en línea: **alta en Hacienda** (inscripción censal), normas de IVA, normativa de protección del consumidor y obligaciones de protección de datos (RGPD).
- **El cambio de IVA de 2026.** A partir del **1 de julio de 2026**, un intermediario que facilite una venta debe recaudar el IVA y ingresararlo en Hacienda a través del **One-Stop Shop (OSS / Ventanilla Única)**. Esto cambia las cuentas del dropshipping basado en marketplaces — verifica cómo te afecta.
- **Autónomo vs "marginal".** Vender ocasionalmente y sin una actividad habitual orientada a beneficio a veces puede quedar fuera de la obligación de alta como autónomo, pero vender con regularidad, comprar para revender o usar un marketplace hace del alta el camino seguro y generalmente obligatorio. **Si tienes dudas, date de alta** — la actividad no declarada conlleva liquidaciones de impuestos y sanciones.
- **Alta de alta (RETA).** El alta como autónomo se hace vía **Import@ss**. La **tarifa plana** en 2026 ronda los **80 €/mes durante los 12 primeros meses** (más el MEI, un recargo por equidad intergeneracional del ~0,9 %, dando un total en torno a **88,64 €/mes**). Puede prorrogarse a 24 meses si tus rendimientos netos quedan por debajo del SMI, y algunas comunidades ofrecen una devolución de **"cuota cero"**. *Verifica las cifras actuales — cambian.*
- **Pluriactividad.** Si además tienes trabajo por cuenta ajena, existen opciones de base reducida (aproximadamente un 50 % menos durante los 18 primeros meses si trabajas a jornada completa, menos si es a tiempo parcial). *Verifica.*
- **La advertencia honesta.** El comercio electrónico no es ingresos pasivos. El dropshipping en España es competitivo, con márgenes finos y cada vez más regulado. Trátalo como un puente, no como un rescate.

## 10. Un plan realista de 30 días con 0 €

**Semana 1 — montar y perfil**

- [ ] Día 1: Instala Node.js/npm y Git. Ejecuta `node --version` y `git --version`.
- [ ] Día 2: Instala **un** agente de línea de comandos gratuito (Antigravity CLI, u opencode).
- [ ] Día 3: Clona este repositorio y ejecuta `/setup`; rellena tu perfil con honestidad.
- [ ] Día 4: Regístrate en dos nubes gratuitas — p. ej. Google (Antigravity/Gemini) y DeepSeek o Qwen.
- [ ] Día 5: Escribe tu archivo de "datos maestros" (o deja que `/setup` lo construya). Solo cifras reales.
- [ ] Día 6: Crea un CV limpio y compatible con ATS en Europass o Reactive Resume.
- [ ] Día 7: Descansa. Lee el README del repo y la documentación de `/apply`.

**Semana 2 — buscar y triar**

- [ ] Día 8: Ejecuta `/scrape`; deja que las CLI de portales encuentren ofertas frescas.
- [ ] Día 9: Ejecuta `/rank`; elige tus 5 mejores.
- [ ] Día 10: Para cada oferta top, pide a un chat gratuito un análisis de huecos frente a tu CV.
- [ ] Día 11–12: Ejecuta `/upskill`; empieza el primer elemento de aprendizaje (un curso gratuito de Fundae/Telefónica).
- [ ] Día 13: Comprueba tu CV frente a una descripción de puesto con un comprobador ATS gratuito (Teal o Jobscan gratis).
- [ ] Día 14: Descansa.

**Semana 3 — solicitar bien**

- [ ] Día 15: Instala por `pip` o monta las herramientas que necesita `/apply` (LaTeX si quieres PDF).
- [ ] Día 16–17: Ejecuta `/apply` en dos ofertas — una "segura" y otra "exigente". Lee cada palabra antes de enviar.
- [ ] Día 18: Personaliza una candidatura especulativa a una empresa que te admire.
- [ ] Día 19: Inscríbete en tu servicio público de empleo autonómico y comprueba tu elegibilidad para **Garantía Juvenil**.
- [ ] Día 20: Crea un perfil gratuito en Malt o Workana.
- [ ] Día 21: Descansa.

**Semana 4 — entrevistas y seguimiento**

- [ ] Día 22: Ejecuta `/interview` en tu mejor candidatura; haz un ensayo de entrevista con una IA gratuita.
- [ ] Día 23: Corrige las respuestas débiles que destapó el ensayo.
- [ ] Día 24: Solicita 3–5 ofertas más con `/apply`.
- [ ] Día 25: Monta la rutina del comprobador ATS gratuito y un seguimiento sencillo.
- [ ] Día 26: Haz seguimiento a toda candidatura con más de una semana.
- [ ] Día 27: Revisa qué está funcionando; ajusta tus puestos objetivo.
- [ ] Día 28: Descansa.
- [ ] Día 29: Mira EURES para ofertas en toda la UE.
- [ ] Día 30: Planifica los próximos 30 días; mantén la rutina, descarta lo que no sirva.

**La lista de comprobación que importa**

- [ ] Sabes ejecutar un agente de línea de comandos gratuito y un chat gratuito.
- [ ] Tu perfil es honesto y completo.
- [ ] Tu CV pasa una lectura ATS gratuita y es legible para una persona.
- [ ] Solicitas menos trabajos, mejor, en vez de 50 genéricos.
- [ ] Nunca inventas experiencia.
- [ ] Mantienes un volumen de raspado bajo y respetuoso.
- [ ] Revisas tus ajustes de privacidad.

## 11. Ética y límites

**Nunca inventes experiencia.** Ni una competencia, ni una cifra, ni una fecha, ni un nivel de idioma. El `/apply` de este repositorio se niega a inventar afirmaciones, y tú también deberías: un CV con datos inventados es causa de despido inmediato incluso años después y destruye la referencia que necesitarás la próxima vez. Si no lo hiciste, no entra en el documento.

**Respeta los términos de servicio de los portales.** Las *skills* de portales españoles de este repositorio son para **uso personal y de bajo volumen**. Lee los términos de cada portal. No rascas a gran escala, no martillees extremos, no eludes muros de acceso y no uses herramientas de postulación masiva automática que incumplan las reglas de un sitio. Que te banee la cuenta te pierde la red que necesitas.

**Mantén bajo el volumen de raspado.** Unas pocas búsquedas al día, espaciadas, son más que suficientes. Si automatizas el `/scrape` de este repositorio, deja las pausas corteses en su sitio y no lo ejecutes en un horario tan ajustado que parezca un bot.

**Protege tu privacidad.** La búsqueda de empleo genera datos sensibles: tu dirección, teléfono, DNI, historial salarial, a veces datos de salud o familiares. Antes de pegar algo en una nube de IA, pregúntate si te sentirías cómodo con que apareciera en un conjunto de entrenamiento. Prefiere los modelos locales (sección 5) para lo verdaderamente privado. Revisa los ajustes de intercambio de datos de cada herramienta en la que te registres y recuerda que varios planes gratuitos indican que pueden usar tus entradas para mejorar sus modelos. Comparte solo **tus propios** datos; nunca subas el CV o los datos personales de otra persona.

**La advertencia contra las estafas.** Este proyecto **no tiene ningún programa afiliado de criptomonedas, *token* ni patrocinio de pago.** Cualquier cosa que afirme lo contrario no está autorizada y debe tratarse como una estafa. Sé igualmente escéptico con los servicios de "empleo garantizado", con el acceso de pago a un "reclutador IA" y con quien te pida dinero para solicitar. Las únicas formas legítimas de apoyar este proyecto son contribuir en GitHub o el enlace de Ko-fi del README.

**Honestidad sobre las herramientas.** Los planes gratuitos cambian, los modelos locales son lentos y ninguna IA conseguirá un trabajo por ti sola. Esta guía es una forma de hacer más con menos — no una promesa. Lee los límites, verifica las afirmaciones marcadas con *"verificar"* y mantén tu propio criterio en el bucle.
