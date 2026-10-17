---
name: hosco-search
version: 1.0.0
description: >-
  Use this skill to search live hospitality job listings in Spain on Hosco
  (www.hosco.com), a hospitality-focused job board, or to look up a specific
  Hosco posting. Invoke for Spanish hospitality job search — hotels,
  restaurants, catering, reception, kitchen, housekeeping, F&B, events and
  tourism businesses. English triggers: find a hospitality job in Spain, Spanish
  hotel jobs, restaurant jobs Spain, tourism jobs Spain, jobs Madrid hotels,
  jobs Barcelona hospitality, look up this Hosco posting. Spanish triggers
  (frases en español): buscar trabajo en turismo, ofertas de empleo
  hostelería, trabajo hotel, trabajo camarero, trabajo cocinero, trabajo
  recepcionista, empleo restauración, trabajo pisos, empleo animación
  turística, trabajo agencia de viajes, empleo camping, trabajo en Mallorca,
  trabajo en Madrid, teletrabajo, buscar empleo, bolsa de empleo turismo,
  hosco.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/hosco-search/cli/src/cli.ts *)
---

# Hosco (Spain) Search Skill

Search live hospitality job listings in Spain on [Hosco](https://www.hosco.com),
a hospitality-focused job board (hotels, restaurants, catering, events,
tourism). Each listing carries a title, company, location and (on detail)
full description with employment type and date.

## Data source

- **Search** — `https://www.hosco.com/en/jobs?search=<q>` (server-rendered listing).
- **Detail** — `https://www.hosco.com/en/job/<company>/<slug>` (server-rendered, JSON-LD JobPosting).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.

## USAGE

```bash
bun run .agents/skills/hosco-search/cli/src/cli.ts search [flags]
bun run .agents/skills/hosco-search/cli/src/cli.ts detail <id|url> [--format json|plain]
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

`<id|url>` accepts the slug from a search result or the full `https://www.hosco.com/en/job/<company>/<slug>` URL.

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (null on search), `url`, `excerpt` (null on search), `salary` (null), `contract` (null) and `remote`.

Detail JSON adds `description` (plain text), `employmentType`, `isActive`, `deadline` and `applyUrl`.

## Notes

- `date` is filled on detail from `datePosted` (ISO `YYYY-MM-DD`).
- `isActive` is `false` only when `validThrough` is in the past.
- Search cards do not include a posting date; use `detail` for it.
- Hosco is hospitality-focused; for general Spanish jobs use the broader boards.
