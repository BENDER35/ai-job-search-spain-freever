---
name: talent-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain on Talent.com
  (es.talent.com), the Spanish edition of one of the world's largest job
  aggregators, or to look up a specific Talent.com posting. Invoke for Spanish
  job search across any sector — software, data, engineering, marketing,
  finance, sales, healthcare, hospitality, administration, logistics,
  construction and more — by keyword, province, city, or remote mode. English
  triggers: find a job in Spain, Spanish job search, jobs Madrid, jobs
  Barcelona, IT jobs Spain, developer jobs Spain, data jobs Spain, remote jobs
  Spain, look up this Talent.com posting. Spanish triggers (frases en español):
  buscar trabajo en España, ofertas de empleo, bolsa de empleo, trabajo Madrid,
  trabajo Barcelona, trabajo programador, trabajo desarrollador, trabajo data
  scientist, trabajo remoto, teletrabajo, empleo por provincias, ofertas de
  trabajo hoy, buscar empleo, ofertas de empleo sin experiencia, trabajo
  indefinido, media jornada, portal de empleo, talent.com.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/talent-search/cli/src/cli.ts *)
---

# Talent.com (Spain) Search Skill

Search live job listings from **[Talent.com](https://es.talent.com)** — the Spanish
edition of a global job aggregator that indexes postings from thousands of
employers and ATS feeds across every sector: technology, data, marketing,
finance, sales, healthcare, hospitality, administration, logistics, construction
and more, across all Spanish provinces.

## Data source

Talent.com serves plain server-rendered HTML (no JavaScript rendering needed):
- Search: `https://es.talent.com/jobs?k=KEYWORDS&l=LOCATION&p=PAGE`
- Detail: `https://es.talent.com/view?id=<id>`

Detail pages mostly embed a `schema.org` `JobPosting` in JSON-LD; the rest are
parsed from the article markup (title, company, location, relative date and the
"Descripción del trabajo" body).

## Data source notes

- `l` is required in practice: with no location Talent.com geolocates from the
  caller's IP and 307-redirects. The CLI therefore defaults `l=España`
  (nationwide) instead of sending an empty location.
- `p` is 1-indexed. Pages hold a variable number of results (no fixed page
  size), so `meta.perPage` reports how many cards the fetched page actually
  contained.
- Nothing in `robots.txt` blocks `/jobs` or `/view`; the disallowed paths are
  `/services/api-new/search`, `/search-jobs/*`, `/api/*`, `/ajax/*`,
  `/redirect*` and `/convert*`, none of which this skill calls.

## Data source etiquette

- No authentication or credentials are required.
- Automated request volume is kept low (one request per page, one per detail).
- `--page`, `--limit`, `--jobage` and `--remote` are applied client-side.

## USAGE

```bash
bun run .agents/skills/talent-search/cli/src/cli.ts search [flags]
bun run .agents/skills/talent-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — keywords (job title, skill, or role). Optional.
- `-l, --location <place>` — province or city, e.g. `Madrid`, `Barcelona`,
  `Valencia`, or `España` for the whole country (default `España`).
- `--remote` — client-side filter for remote offers (matches "remoto",
  "teletrabajo", "remote", "home office" in the card title/summary).
- `--jobage <days>` — client-side recency filter on the card posting date.
- `--page <n>` — 1-indexed page. Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the numeric posting ID from a search result or a full URL
such as `https://es.talent.com/view?id=634357466234094081`.

## Output

Search JSON is `{ "meta": { "count", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (ISO
`YYYY-MM-DD`), `url`, `excerpt` and `remote`.

Detail JSON adds `description`, `employmentType`, `salary`, `isActive` and
`deadline`.

## Notes

- `date` comes from the card's `<time dateTime>` value; on detail pages without
  JSON-LD it is resolved from the relative label ("Hace 21 días", "Hoy",
  "Ayer") against the current date, so it is approximate for very old postings
  ("Hace más de 30 días" is treated as 30 days).
- `salary` is filled only when the JSON-LD carries `baseSalary`; otherwise `null`.
- `employmentType` is the raw `schema.org` value (e.g. `FULL_TIME`) and is
  present only on JSON-LD-backed detail pages.
- `deadline` is `null` unless the JSON-LD carries `validThrough`.
