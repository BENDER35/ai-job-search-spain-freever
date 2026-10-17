---
name: oficinaempleo-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on Oficina Empleo
  (www.oficinaempleo.com), a Spanish job board, or to look up a specific
  Oficina Empleo posting. Invoke for Spanish job search across any sector —
  software, data, engineering, marketing, finance, sales, healthcare,
  hospitality, administration, logistics, construction and more — by keyword,
  city or province. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs
  Spain, remote jobs Spain, look up this Oficina Empleo posting. Spanish
  triggers (frases en español): buscar trabajo en España, ofertas de empleo,
  bolsa de empleo, trabajo Madrid, trabajo Barcelona, trabajo programador,
  trabajo desarrollador, trabajo data scientist, trabajo remoto, teletrabajo,
  empleo por provincias, ofertas de trabajo hoy, buscar empleo, ofertas de
  empleo sin experiencia, trabajo indefinido, media jornada, portal de empleo,
  oficinaempleo.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/oficinaempleo-search/cli/src/cli.ts *)
---

# Oficina Empleo (Spain) Search Skill

Search live job listings in Spain on [Oficina Empleo](https://www.oficinaempleo.com),
a Spanish job board. Each listing carries a title, company, location, posting
date and excerpt; detail pages embed a schema.org `JobPosting` JSON-LD blob
with the full description.

## Data source

- **Search** — `https://www.oficinaempleo.com/buscar/ofertas/<slug>` (slug =
  keywords with spaces → hyphens). Pagination via `?page=N`.
- **Detail** — `https://www.oficinaempleo.com/oferta-empleo/<slug>-<id>`.

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.
- `--location` and `--jobage` are applied client-side (the board has no
  server-side location filter on the keyword search).

## USAGE

```bash
bun run .agents/skills/oficinaempleo-search/cli/src/cli.ts search [flags]
bun run .agents/skills/oficinaempleo-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — free-text keywords. Optional if `--location` is given.
- `-l, --location <place>` — city or province (client-side filter).
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side recency filter on the posting date.
- `--page <n>` — page (1-indexed). Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the numeric id from a search result or the full
`https://www.oficinaempleo.com/oferta-empleo/<slug>-<id>` URL.

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (ISO `YYYY-MM-DD`), `url`, `excerpt`, `salary` (null), `contract` (null) and `remote`.

Detail JSON adds `description` (plain text), `employmentType`, `isActive`, `deadline` and `applyUrl`.

## Notes

- `date` is parsed from the card's `DD-MM-YYYY` label.
- `employmentType` is translated from the schema.org value.
- `isActive` is `false` only when `validThrough` is in the past.
