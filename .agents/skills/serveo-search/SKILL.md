---
name: serveo-search
version: 1.0.0
description: >
  Use this skill to search live job listings on the Serveo careers portal
  (jobs.serveo.com), the official job board of Serveo (a large Spanish
  infrastructure, facility management and services company), or to look up a
  specific Serveo posting. Invoke for jobs at Serveo across Spain in facility
  management, maintenance, energy, transport, healthcare services, engineering,
  administration, cleaning and related roles. English triggers: Serveo jobs, jobs
  at Serveo, Serveo careers, Spanish facility management jobs, look up this Serveo
  posting. Spanish triggers (frases en español): trabajo en Serveo, ofertas de
  empleo Serveo, bolsa de empleo Serveo, trabajar en Serveo, empleo facility
  management, trabajo mantenimiento, empleo energía, trabajo ingeniería España,
  ofertas de empleo por provincias, buscar empleo, teletrabajo.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/serveo-search/cli/src/cli.ts *)
---

# Serveo Search Skill

Search live job listings from the **[Serveo careers site](https://jobs.serveo.com)**
— the official job portal of Serveo, a large Spanish infrastructure, facility
management and services company, with openings across Spain in maintenance, energy,
transport, healthcare services, engineering, administration, cleaning and more.

## Data source

jobs.serveo.com is a SAP SuccessFactors career site serving plain server-rendered
HTML (no JavaScript rendering needed):
- Search: `https://jobs.serveo.com/search/?q=KEYWORDS&locationsearch=PLACE&startrow=<offset>`
- Detail: `https://jobs.serveo.com/job/<slug>/<id>/`

`q` is a **full-text** search (matches job content, not just the title).
Pagination uses `startrow` as a 0-based offset in steps of 20 (page 2 = `startrow=20`).

## ⚠️ Personal use only

Serveo's robots.txt allows ordinary crawlers on `/search/` and `/job/` paths (only
`/services/`, `/preapply/`, `/talentcommunity/` and similar are disallowed). This
CLI sends the honest repo-convention UA `Mozilla/5.0 (compatible; serveo-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search Serveo job openings anywhere in Spain (full-text) or filtered by location
- Filter by recency (client-side) and workplace type (remote heuristic)
- Look up a specific Serveo posting for its full description and location

## Commands

### Search job listings

```bash
bun run .agents/skills/serveo-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — full-text keywords (job title, skill, role),
  e.g. `"project manager"`, `"electricista"`, `"enfermero"`. Optional.
- `--location <place>` / `-l <place>` — location filter, e.g. `Madrid`,
  `Barcelona`, `Valencia`. Optional.
- `--remote` — filter client-side for offers whose title/location mention remote
  work ("Teletrabajo"/"Remoto"). Heuristic: the site has no explicit remote flag.
- `--jobage <days>` — client-side recency filter.
- `--page <n>` — 1-indexed page (20 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/serveo-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the numeric offer ID from a `search` result, or a full Serveo URL
such as `https://jobs.serveo.com/job/Madrid-Lean-Project-Manager-Madrid-Madr/1365112255/`.
Returns the full description, company (always "Serveo") and location.

## Notes

- Data comes from Serveo's server-rendered SAP SuccessFactors career site.
- No credentials required.
- `company` is always `"Serveo"`.
- `date` is the posting date, ISO `YYYY-MM-DD` (site shows `DD mon YYYY`).
- `location` is `City, Province, España`.
- `remote` is a client-side heuristic (the site publishes no structured remote
  flag; it is inferred from the title/location, and from the description on the
  detail page).
- **No application deadline** on this portal → `deadline` is `null`.
- `detail` is a single request per posting; fetch full detail only for postings
  worth a closer look.
