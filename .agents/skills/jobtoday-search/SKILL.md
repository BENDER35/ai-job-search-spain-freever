---
name: jobtoday-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain on JobToday (jobtoday.com),
  a high-volume Spanish job board covering hospitality, retail, logistics, admin,
  and many other sectors, or to look up a specific JobToday posting. Invoke for
  Spanish job search across all sectors by city or category. English triggers:
  find a job in Spain, Spanish job search, jobs Madrid, jobs Barcelona, hospitality
  jobs Spain, retail jobs Spain, remote jobs Spain, look up this JobToday posting.
  Spanish triggers (frases en español): buscar trabajo en España, ofertas de empleo,
  bolsa de empleo, trabajo Madrid, trabajo Barcelona, trabajo camarero, trabajo
  limpieza, trabajo administrativo, trabajo remoto, teletrabajo, empleo por
  provincias, ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin
  experiencia, trabajo indefinido, media jornada.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/jobtoday-search/cli/src/cli.ts *)
---

# JobToday Search Skill

Search live job listings from **[JobToday](https://www.jobtoday.com)** — a
high-volume Spanish job board covering hospitality, retail, logistics, admin,
and many other sectors across Spain.

## Data source

JobToday is a Next.js SSR site with job data embedded in `__NEXT_DATA__` JSON:
- Search: `https://jobtoday.com/es/trabajos/{city}` (server-rendered, JSON in page)
- Detail: `https://jobtoday.com/es/trabajo/{slug}-{key}` (server-rendered)

There is no keyword search URL; `--query` is applied client-side.

## ⚠️ Personal use only

JobToday's robots.txt allows ordinary crawlers on `/es/trabajos/` paths. This CLI
sends the honest repo-convention UA `Mozilla/5.0 (compatible; jobtoday-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one page, plus one `detail`
fetch per posting worth a look), **no bulk data collection**, and **no commercial
use**. Run it on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search job openings in Spain by city (Madrid, Barcelona, etc.) or nationwide
- Filter by recency (client-side) and category (via URL slug, e.g. `/es/trabajos-camarero/madrid`)
- Look up a specific JobToday posting for its full description, company, and
  salary

## Commands

### Search job listings

```bash
bun run .agents/skills/jobtoday-search/cli/src/cli.ts search [--location "<city>"] [flags]
```

Key flags:
- `--location <place>` / `-l <place>` — a Spanish city (e.g. "Madrid",
  "Barcelona") or "Spain" for nationwide. Optional; defaults to Madrid.
- `--query <text>` / `-q <text>` — client-side keyword filter on role/description. Optional.
- `--remote` — filter client-side for remote offers.
- `--jobage <days>` — client-side recency filter.
- `--page <n>` — 1-indexed page (48 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/jobtoday-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the offer key from a `search` result (e.g. `p3G4PO`), or a full
JobToday URL such as `https://jobtoday.com/es/trabajo/...`. Returns the full
description, company, location, and salary.

## Notes

- Data comes from JobToday's server-rendered Next.js pages with embedded JSON.
- No credentials required.
- `date` is derived from `postedSecondsAgo` (approximate).
- `location` is the city from `addressInfo.city`.
- **No application deadline** on JobToday → `deadline` is `null`.
- `detail` is a single request per posting; fetch full detail only for postings
  worth a closer look.
