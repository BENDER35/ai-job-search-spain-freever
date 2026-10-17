---
name: studentjob-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on StudentJob
  (www.studentjob.es), a job board for students and young professionals, or to
  look up a specific StudentJob posting. Invoke for Spanish job search across
  any sector — software, data, engineering, marketing, finance, sales,
  healthcare, hospitality, administration, logistics, construction and more —
  by keyword, city or province. English triggers: find a job in Spain, Spanish
  job search, jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain,
  data jobs Spain, remote jobs Spain, student jobs Spain, look up this StudentJob
  posting. Spanish triggers (frases en español): buscar trabajo en España,
  ofertas de empleo, bolsa de empleo, trabajo Madrid, trabajo Barcelona,
  trabajo programador, trabajo desarrollador, trabajo data scientist, trabajo
  remoto, teletrabajo, empleo por provincias, ofertas de trabajo hoy, buscar
  empleo, ofertas de empleo sin experiencia, trabajo indefinido, media jornada,
  portal de empleo, studentjob, primer empleo, prácticas.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/studentjob-search/cli/src/cli.ts *)
---

# StudentJob (Spain) Search Skill

Search live job listings in Spain on [StudentJob](https://www.studentjob.es), a
job board focused on students and young professionals (internships, first jobs,
part-time and temporary roles), but which also carries regular vacancies.

## Data source

- **Search** — `https://www.studentjob.es/ofertas?search[keywords_scope]=<q>` (server-rendered listing).
- **Detail** — `https://www.studentjob.es/ofertas/<id>-<slug>` (server-rendered, with full description, company, location, employment type and date).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.

## USAGE

```bash
bun run .agents/skills/studentjob-search/cli/src/cli.ts search [flags]
bun run .agents/skills/studentjob-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — free-text keywords. Optional.
- `-l, --location <place>` — city or province (client-side filter).
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side filter for jobs posted within N days.
- `--page <n>` — page (1-indexed). Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the numeric id from a search result or the full `https://www.studentjob.es/ofertas/<id>-<slug>` URL.

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (usually `null` on search, filled on detail), `url`, `excerpt` (null on search), `salary` (null), `contract` (null), `remote` and `employmentType`.

Detail JSON adds `description` (plain text), `isActive`, `deadline` (null) and `applyUrl`.

## Notes

- `date` is parsed from the detail page's `Publicado el DD-MM-YYYY` label.
- `isActive` reflects the offer's published status on StudentJob.
- Search cards do not include a posting date; use `detail` for it.
