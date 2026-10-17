---
name: trabajos-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain on Trabajos.com
  (trabajos.com), one of Spain's longest-running general job boards, or to look up
  a specific Trabajos.com posting. Invoke for Spanish job search across any sector
  — software, data, engineering, marketing, finance, sales, healthcare,
  hospitality, administration, logistics, construction and more — by keyword,
  province or city. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs
  Spain, remote jobs Spain, look up this Trabajos.com posting. Spanish triggers
  (frases en español): buscar trabajo en España, ofertas de empleo, bolsa de
  empleo, trabajo Madrid, trabajo Barcelona, trabajo programador, trabajo
  desarrollador, trabajo data scientist, trabajo remoto, teletrabajo, empleo por
  provincias, ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin
  experiencia, trabajo indefinido, media jornada, portal de empleo, trabajos.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/trabajos-search/cli/src/cli.ts *)
---

# Trabajos.com Search Skill

Search live job listings from **[Trabajos.com](https://www.trabajos.com)** — one of
Spain's longest-running general job boards, covering every sector: technology,
marketing, finance, sales, healthcare, hospitality, administration, logistics,
construction and more, across all Spanish provinces.

## Data source

Trabajos.com serves plain server-rendered HTML (no JavaScript rendering needed):
- Search: `https://www.trabajos.com/ofertas-empleo/[<location>/]?CADENA=KEYWORDS&DESDE=<offset>`
- Detail: `https://www.trabajos.com/ofertas/<id>/<slug>/`

Pagination uses `DESDE` as a 0-based offset in steps of 40 (page 2 = `DESDE=40`).

## ⚠️ Personal use only

Trabajos.com's robots.txt allows ordinary crawlers (only a few admin/banner paths
are disallowed). This CLI sends the honest repo-convention UA
`Mozilla/5.0 (compatible; trabajos-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search job openings anywhere in Spain (by keyword) or in a specific province/city
- Filter by recency (client-side) and workplace type (remote flag)
- Look up a specific Trabajos.com posting for its full description, company,
  salary, contract type and experience level

## Commands

### Search job listings

```bash
bun run .agents/skills/trabajos-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"camarero"`, `"administrativo"`. Optional.
- `--location <place>` / `-l <place>` — province or city slug, e.g. `Madrid`,
  `Barcelona`, `Valencia`. Optional; defaults to all of Spain.
- `--remote` — filter client-side for remote offers ("Teletrabajo").
- `--jobage <days>` — client-side recency filter.
- `--page <n>` — 1-indexed page (40 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/trabajos-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the numeric offer ID from a `search` result, or a full Trabajos.com
URL such as `https://www.trabajos.com/ofertas/1196545831/analista-.../`. Returns the
full description, company, location, salary, contract type and experience level.

## Notes

- Data comes from Trabajos.com's server-rendered HTML.
- No credentials required.
- `date` is the posting date, ISO `YYYY-MM-DD` (site shows `DD/MM/YYYY`).
- `location` is `City, Province`.
- `salary` and `contract` are extracted from the listing card when present
  (on the detail page they come from the "Salario" / "Tipo de contrato" fields).
- **No application deadline** on Trabajos.com → `deadline` is `null`.
- `detail` is a single request per posting; fetch full detail only for postings
  worth a closer look.
