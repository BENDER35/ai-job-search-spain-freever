---
name: turijobs-search
version: 1.0.0
description: >
  Use this skill to search live tourism and hospitality job listings in Spain
  on Turijobs (www.turijobs.com), Spain's leading tourism & hospitality job
  board, or to look up a specific Turijobs posting. Invoke for Spanish jobs in
  hotels, restaurants, catering, travel agencies, campsites, cruises and other
  tourism businesses — reception, kitchen, waiting/bar, housekeeping,
  maintenance, animation, management and more — by job title, area, sector,
  city or region. English triggers: find a hospitality job in Spain, Spanish
  hotel jobs, restaurant jobs Spain, tourism jobs Spain, jobs Madrid hotels,
  jobs Barcelona hospitality, look up this Turijobs posting. Spanish triggers
  (frases en español): buscar trabajo en turismo, ofertas de empleo hostelería,
  trabajo hotel, trabajo camarero, trabajo cocinero, trabajo recepcionista,
  empleo restauración, trabajo pisos, empleo animación turística, trabajo
  agencia de viajes, empleo camping, trabajo en Mallorca, trabajo en Madrid,
  teletrabajo, buscar empleo, bolsa de empleo turismo, turijobs.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/turijobs-search/cli/src/cli.ts *)
---

# Turijobs (Spain) Search Skill

Search live job listings from **[Turijobs](https://www.turijobs.com)** — Spain's
leading **tourism and hospitality** job board (hotels, restaurants, catering,
travel agencies, campsites, cruises and other tourism businesses).

## Data source

Turijobs is a server-rendered Next.js site that embeds the full data set in a
`__NEXT_DATA__` JSON script tag on every page — no HTML scraping and no
JavaScript rendering are required:
- Search: `https://www.turijobs.com/es-es/ofertas-trabajo[/<query>][/<location>][?page=N]`
- Detail: `https://www.turijobs.com/es-es/oferta-trabajo/<city>/<slug>/<id>`

## Data source notes

- **Search is by controlled vocabulary, not free text.** Turijobs filters via
  path segments matched against its own taxonomy — job titles (`camarero`,
  `recepcionista`, `cocinero`…), areas (`sala`, `cocina`, `recepcion`,
  `pisos-limpieza`…), sectors (`cadena-hotelera`, `restaurante`…), companies,
  cities and regions. A segment it does not recognise is **silently ignored**
  and the whole board (~2.500 offers) is returned; this skill detects that
  (via the selected facets in `__NEXT_DATA__`) and returns no results with a
  clear `UNMATCHED_FILTER` error instead of dumping the unfiltered board.
- **`robots.txt` compatibility.** Turijobs disallows `/*.aspx` and the query
  params `?cont=`, `?location=`, `?category=`, `?date=`, `?exp=`, `?Page=`,
  `?sort=`, `?sFiltro=` and others. This skill therefore only uses path
  segments plus the lowercase `?page=` pagination param (allowed), and never
  the disallowed ones.
- The detail page is keyed by the numeric id: `/es-es/oferta-trabajo/<city>/<slug>/<id>`
  works with any placeholder `city`/`slug`, so a bare numeric id is enough.

## Data source etiquette

- No authentication or credentials are required.
- Automated request volume is kept low (one request per page, one per detail).
- `--remote`, `--jobage` and `--limit` are applied client-side.

## USAGE

```bash
bun run .agents/skills/turijobs-search/cli/src/cli.ts search [flags]
bun run .agents/skills/turijobs-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — job title, area, sector or company (e.g. `Camarero`,
  `Recepcionista`, `Cocinero`, `Sala`, `Cadena hotelera`). Optional. Matched
  against Turijobs' controlled vocabulary, not free text.
- `-l, --location <place>` — city or region, e.g. `Madrid`, `Barcelona`,
  `Islas Baleares`, `Las Palmas`. Optional.
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side recency filter on the posting date.
- `--page <n>` — 1-indexed page. Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the numeric posting ID from a search result, the full URL
such as `https://www.turijobs.com/es-es/oferta-trabajo/madrid/camarero/359045`,
or the `city/slug/id` path emitted by `search`.

## Output

Search JSON is `{ "meta": { "count", "total", "pages", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (ISO
`YYYY-MM-DD`), `url`, `excerpt`, `salary`, `contract` and `remote`.

Detail JSON adds `description`, `employmentType`, `salary`, `isActive`,
`deadline`, `requirements`, `tags`, `applyUrl`, `vacancies` and `applies`.

## Notes

- `date` is the posting's `publicationDate`. `deadline` is `finishDate`.
- `salary` is filled only when Turijobs marks the salary as visible **and**
  carries figures; otherwise `null`.
- `employmentType` is derived from the listing tags (contract type + workday),
  e.g. `Indefinido · Jornada completa`.
- `isActive` is `false` only when the detail page reports a non-active status
  or a `finishDate` in the past.
