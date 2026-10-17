---
framework_version: 1.1.0
---

# Agent Guidelines: AI Job Search

This workspace is structured to manage job search activities, scraper tools, CVs, cover letters, and interview preparation.

## This repository is the Spain adaptation

This fork (`BENDER35/ai-job-search-spain-freever`) targets the Spanish job market and any
command-line AI agent, free tiers first:

- **Spanish job portals** ship as portal skills under [.agents/skills/](.agents/skills/):
  `tecnoempleo-search` (Tecnoempleo), `infojobs-search` (InfoJobs, official developer API),
  `indeed-search` (Indeed, global job board), `infoempleo-search` (Infoempleo, Spanish
  job board), `ticjob-search` (Ticjob, Spanish TIC board), `disjob-search` (Disjob, Spanish inclusive employment board), `domestika-search` (Domestika, Spanish creative job board), `eures-search` (EURES, EU-wide REST API including Spain), `itjobs-search` (ITJobs, Spanish IT board), `jobfluent-search` (JobFluent, Spanish tech board), `jobtoday-search` (JobToday, high-volume Spanish board), `trabajos-search` (Trabajos.com, Spanish general board), `serveo-search` (Serveo, company careers portal), `trabajarenlopublico-search` (Trabajar en lo público, Spanish public-sector convocatorias portal), `talent-search` (Talent.com, Spanish general aggregator), `turijobs-search` (Turijobs, Spanish tourism & hospitality board), `jobrapido-search` (Jobrapido, Spanish job aggregator), `jobijoba-search` (Jobijoba, Spanish job aggregator), `oficinaempleo-search` (Oficina Empleo, Spanish job board), `studentjob-search` (StudentJob, jobs for students/young professionals), plus the country-agnostic `linkedin-search` and `freehire-search`.
  `/scrape` discovers them automatically. Spanish-language trigger phrases are baked into
  each `SKILL.md`.
- **Runtime-agnostic**: you do not need Claude Code. Google Antigravity, Codex CLI, Gemini CLI,
  Qwen Code, opencode, Aider, Cline, Roo Code, Kilo Code, Continue, Goose, Crush, Cursor,
  Windsurf and Copilot agent mode all drive the same specs through thin pointer files
  (`GEMINI.md`, `QWEN.md`, `CONVENTIONS.md`, `.cursorrules`, `.windsurfrules`, `.clinerules`,
  `.goosehints`, `.github/copilot-instructions.md`). See [COMPATIBILITY.md](COMPATIBILITY.md) /
  [COMPATIBILIDAD.md](COMPATIBILIDAD.md).
- **Step-by-step setup per runtime and per OS**: [SETUP.md](SETUP.md) / [SETUP.es.md](SETUP.es.md).
- **How the framework works internally**: [TECHNICAL_GUIDE.md](TECHNICAL_GUIDE.md) /
  [GUIA_TECNICA.md](GUIA_TECNICA.md).
- **Free-tier / low-budget AI guide** (including Ollama on old hardware):
  [busqueda_ia_bajosrecursoseconomicos.md](busqueda_ia_bajosrecursoseconomicos.md) /
  [ai_low_budget_job_search.md](ai_low_budget_job_search.md).
- Spanish mirrors of the framework docs: [README.es.md](README.es.md),
  [CONTRIBUTING.es.md](CONTRIBUTING.es.md), [SECURITY.es.md](SECURITY.es.md),
  [CHANGELOG.es.md](CHANGELOG.es.md).

If you are an agent reading this file: prefer the Spanish portal skills for Spanish-market
searches, keep automated request volume low (the portal skills are personal-use only), and never
duplicate the specs below — they are the single source of truth.

## Thin-Pointer Design (Single Source of Truth)

To prevent duplication and configuration drift across different AI agent frameworks (Claude Code, Google Antigravity, Codex, Cursor, Gemini CLI, etc.), this workspace uses a unified thin-pointer design. All agent runtimes should load the canonical specifications and candidate profiles from the files and directories below:

1. **Personal Candidate Profile:**
   - The candidate profile, contact details, education, and target preferences are defined in [CLAUDE.md](CLAUDE.md) and the individual profile methodology files under [.claude/skills/job-application-assistant/](.claude/skills/job-application-assistant/) (specifically `01-*.md` etc.).
2. **Canonical Workflow Specifications:**
   - The step-by-step instructions and triggers for tasks (setup, scrape, rank, apply, upskill, interview) are defined in the [.claude/](.claude/) directory (specifically under `.claude/skills/` and `.claude/commands/`).
   - Do not duplicate these rules or specifications. Treat `.claude/` files as the single source of truth.
3. **Portal Search Skills:**
   - Job-portal search CLIs live under [.agents/skills/](.agents/skills/) in the portable Agent Skills format (with a `SKILL.md` per portal). Codex and Antigravity discover these automatically; the `/scrape` workflow in [.claude/skills/job-scraper/](.claude/skills/job-scraper/) orchestrates them.
