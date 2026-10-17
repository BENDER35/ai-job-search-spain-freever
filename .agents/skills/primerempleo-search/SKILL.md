---
name: primerempleo-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on Primerempleo
  (www.primerempleo.com), a job board for students and young professionals, or
  to look up a specific Primerempleo posting. Invoke for Spanish job search
  across any sector — software, data, engineering, marketing, finance, sales,
  healthcare, hospitality, administration, logistics, construction and more —
  by keyword, city or province. English triggers: find a job in Spain, Spanish
  job search, jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain,
  data jobs Spain, remote jobs Spain, student jobs Spain, look up this
  Primerempleo posting. Spanish triggers (frases en español): buscar trabajo
  en España, ofertas de empleo, bolsa de empleo, trabajo Madrid, trabajo
  Barcelona, trabajo programador, trabajo desarrollador, trabajo data scientist,
  trabajo remoto, teletrabajo, empleo por provincias, ofertas de trabajo hoy,
  buscar empleo, ofertas de empleo sin experiencia, trabajo indefinido, media
  jornada, portal de empleo, primerempleo, primer empleo, prácticas.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/primerempleo-search/cli/src/cli.ts *)
---

# Primerempleo (Spain) Search Skill

Search live job listings in Spain on [Primerempleo](https://www.primerempleo.com),
a job board for students and young professionals (internships, first jobs,
temporary roles), but which also carries regular vacancies.

## Data source

- **Search** — `https://www.primerempleo.com/?keywords=<q>` (server-rendered listing; results filtered client-side by title).
- **Detail** — `https://www.primerempleo.com/<type>/<location>/<slug>/<id>` (server-rendered, JSON-LD JobPosting with literal newlines).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.
- The board's search does not filter server-side by keyword, so results are filtered client-side by title match.

## USAGE

```bash
bun run .agents/skills/primerempleo-search/cli/src/cli.ts search [flags]
bun run .agents/skills/primerempleo-search/cli/src/cli.ts detail <id|url> [--format json|plain]
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

`<id|url>` accepts the full URL from a search result (detail requires the URL, not just the id, because the path slug is needed).

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company` (null on search), `location`, `date` (null on search), `url`, `excerpt` (null on search), `salary` (null), `contract` (null), `remote` and `employmentType` (null on search).

Detail JSON adds `description` (plain text), `company`, `employmentType`, `isActive`, `deadline` and `applyUrl`.

## Notes

- `date` is filled on detail from `datePosted` (ISO `YYYY-MM-DD`).
- `isActive` is `false` only when `validThrough` is in the past.
- Detail requires the full URL from search results (the path slug is needed).
- Search cards do not include a posting date; use `detail` for it.
