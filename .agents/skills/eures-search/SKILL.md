---
name: eures-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain (and across Europe) on EURES
  (europa.eu/eures), the European Employment Services portal, or to look up a
  specific EURES posting. Invoke for EU-wide and Spanish job search across all
  sectors, especially public-sector and cross-border roles. English triggers: find
  a job in Spain, EU job search, Spanish job search, jobs Madrid, jobs Barcelona,
  IT jobs Spain, developer jobs Spain, data jobs Spain, remote jobs Spain, look up
  this EURES posting. Spanish triggers (frases en español): buscar trabajo en
  España, ofertas de empleo, bolsa de empleo, trabajo Madrid, trabajo Barcelona,
  trabajo programador, trabajo desarrollador, trabajo data scientist, trabajo
  remoto, teletrabajo, empleo por provincias, ofertas de trabajo hoy, buscar
  empleo, ofertas de empleo sin experiencia, trabajo indefinido, media jornada,
  empleo en Europa.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/eures-search/cli/src/cli.ts *)
---

# EURES Search Skill

Search live job listings from the **[EURES portal](https://europa.eu/eures)** — the
European Employment Services job search API. Coverage includes Spanish (and EU)
postings, especially public-sector and cross-border roles. The search is a
documented REST API (POST), so results come back structured JSON.

## Data source

- Search: `POST https://europa.eu/eures/api/jv-searchengine/public/jv-search/search`
- Detail: `GET https://europa.eu/eures/api/jv-searchengine/public/jv/id/{id}`

## ⚠️ Personal use only

EURES is a public EU service; the API is open but **keep volume low** and avoid
bulk data collection. Run on your own responsibility.

## When to use this skill

- Search job openings in Spain (default) or any EU country
- Filter by keyword, recency (`--jobage`), and country (`--country`)
- Look up a specific EURES posting for its full description and apply link

## Commands

### Search job listings

```bash
bun run .agents/skills/eures-search/cli/src/cli.ts search [--query "<keywords>"] [--country ES] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords. Optional.
- `--country <code>` — ISO country code (default `ES` for Spain). Use `EU` for all Europe.
- `--jobage <days>` — `LAST_DAY`, `LAST_THREE_DAYS`, `LAST_WEEK`, `LAST_MONTH` mapped from days.
- `--page <n>` — 1-indexed page (max 50 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/eures-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the job ID from a `search` result (e.g. `NzQ1NzE0MCAxMDI`), or a
full EURES URL such as `https://europa.eu/eures/portal/jv-se/jv-details/...`.
Returns the full description, location, and apply link.

## Notes

- Data comes from the EURES public REST API (JSON).
- No credentials required.
- `company`/`employer` is not provided by EURES search results; `company` is `null`.
- `location` is a NUTS region code (e.g. `ES300`); `cityName` may be a region
  code too.
- **No application deadline** is consistently exposed; `deadline` is `null`.
- `date` is the posting date (`creationDate`), ISO `YYYY-MM-DD`.
- Detail page URL: `https://europa.eu/eures/portal/jv-se/jv-details/{id}`.
