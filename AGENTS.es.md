---
framework_version: 1.1.0
---

**Idioma:** [English](AGENTS.md) · Español

# Guía para agentes: búsqueda de empleo con IA

Este espacio de trabajo está estructurado para gestionar actividades de búsqueda de empleo, herramientas de scraping, CVs, cartas de presentación y preparación de entrevistas.

## Este repositorio es la adaptación para España

Este fork (`BENDER35/ai-job-search-spain-freever`) está orientado al mercado laboral español y a cualquier
agente de IA de línea de comandos, priorizando los niveles gratuitos:

- **Los portales de empleo españoles** vienen como skills de portales en [.agents/skills/](.agents/skills/):
  `tecnoempleo-search` (Tecnoempleo), `infojobs-search` (InfoJobs, API oficial para desarrolladores),
  además de las independientes del país `linkedin-search` y `freehire-search`. `/scrape` las detecta
  automáticamente. Cada `SKILL.md` lleva incorporadas frases desencadenantes en español.
- **Independiente del runtime**: no necesitas Claude Code. Google Antigravity, la CLI de Codex, la CLI de Gemini,
  Qwen Code, opencode, Aider, Cline, Roo Code, Kilo Code, Continue, Goose, Crush, Cursor,
  Windsurf y el modo agente de Copilot ejecutan las mismas especificaciones mediante archivos de puntero fino
  (`GEMINI.md`, `QWEN.md`, `CONVENTIONS.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`,
  `.goosehints`, `.github/copilot-instructions.md`). Consulta [COMPATIBILITY.md](COMPATIBILITY.md) /
  [COMPATIBILIDAD.md](COMPATIBILIDAD.md).
- **Configuración paso a paso por runtime y por SO**: [SETUP.md](SETUP.md) / [SETUP.es.md](SETUP.es.md).
- **Cómo funciona el framework internamente**: [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) /
  [GUIA_TECNICA.md](GUIA_TECNICA.md).
- **Guía de IA de nivel gratuito / bajo presupuesto** (incluido Ollama en hardware antiguo):
  [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md) /
  [ai_low_budget_job_search.md](ai_low_budget_job_search.md).
- Versiones en español de los documentos del framework: [README.es.md](README.es.md),
  [CONTRIBUTING.es.md](CONTRIBUTING.es.md), [SECURITY.es.md](SECURITY.es.md),
  [CHANGELOG.es.md](CHANGELOG.es.md).

Si eres un agente que lee este archivo: prioriza las skills de portales españoles para búsquedas en el mercado
español, mantén bajo el volumen de peticiones automatizadas (las skills de portales son solo para uso personal) y nunca
dupliques las especificaciones de abajo: son la única fuente de verdad.

## Diseño de puntero fino (única fuente de verdad)

Para evitar la duplicación y la deriva de configuración entre los distintos frameworks de agentes de IA (Claude Code, Google Antigravity, Codex, Cursor, la CLI de Gemini, etc.), este espacio de trabajo usa un diseño unificado de puntero fino. Todos los runtimes de agentes deberían cargar las especificaciones canónicas y los perfiles de candidato desde los archivos y directorios siguientes:

1. **Perfil personal del candidato:**
   - El perfil del candidato, los datos de contacto, la formación y las preferencias objetivo se definen en [CLAUDE.md](CLAUDE.md) y en los archivos metodológicos del perfil bajo [.claude/skills/job-application-assistant/](.claude/skills/job-application-assistant/) (concretamente `01-*.md`, etc.).
2. **Especificaciones canónicas de los flujos de trabajo:**
   - Las instrucciones paso a paso y los desencadenantes de las tareas (setup, scrape, rank, apply, upskill, interview) se definen en el directorio [.claude/](.claude/) (concretamente bajo `.claude/skills/` y `.claude/commands/`).
   - No dupliques estas reglas ni especificaciones. Trata los archivos de `.claude/` como la única fuente de verdad.
3. **Skills de búsqueda en portales:**
   - Las CLI de búsqueda en portales de empleo viven en [.agents/skills/](.agents/skills/) en el formato portátil Agent Skills (con un `SKILL.md` por portal). Codex y Antigravity las detectan automáticamente; el flujo de trabajo `/scrape` de [.claude/skills/job-scraper/](.claude/skills/job-scraper/) las orquesta.
