---
name: trabajarenlopublico-search
version: 1.0.0
description: >
  Use this skill to search live public-sector job openings in Spain on
  "Trabajar en lo público" (trabajarenlopublico.com), a Ning-based community
  portal that aggregates public administration selection processes
  (convocatorias, oposiciones and bolsas de trabajo) whose application window is
  still open, or to look up a specific convocatoria. Invoke for public-sector /
  oposición job search across Spain — state, regional and local administration,
  health services, education, police, justice, universities and public
  companies — by keyword, region or sector. English triggers: public-sector jobs
  Spain, Spanish government jobs, civil service jobs Spain, oposición jobs,
  public administration vacancies Spain, look up this convocatoria. Spanish
  triggers (frases en español): trabajar en lo público, empleo público,
  convocatorias, oposiciones, bolsa de trabajo, ofertas de empleo público,
  administración pública, oposición, plaza pública, convocatoria en plazo,
  empleo público por provincia, buscar empleo público, procesos selectivos.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/trabajarenlopublico-search/cli/src/cli.ts *)
---

# Trabajar en lo público Search Skill

Search live public-sector job openings from
**[Trabajar en lo público](https://trabajarenlopublico.ning.com)** — a Spanish
community portal that gathers the public administration's open selection
processes (convocatorias, oposiciones and bolsas de trabajo) for state, regional
and local administration, public health services, education, police, justice,
universities and public companies.

## Data source

trabajarenlopublico.com redirects to a Ning network at
`trabajarenlopublico.ning.com`. Its **"Convocatorias en plazo"** page lists every
convocatoria whose application deadline is still open, as plain server-rendered
HTML (no JavaScript rendering needed):

- Listing: `https://trabajarenlopublico.ning.com/convocatorias`
- The whole open list is one page (no pagination): each entry is an `<h3>` link
  to `https://trabajarenlopublico.ning.com/sectores/<sector>/convocatorias/<slug>`
  followed by a `Plazo de solicitud: hasta el <date>` paragraph.

**No per-convocatoria detail page is server-rendered.** Each individual
convocatoria URL 302-redirects to a JavaScript-only sector page, so this CLI's
`detail` command re-reads the listing and returns the full record it contains
(title, sector, location, employer, deadline, URL) rather than a body
description. Open the URL in a browser for the official bases.

## ⚠️ Personal use only

Ning's `robots.txt` disallows only `/xn/...` internals, `/main/search/search/`
and `/main/authorization/`; the `/convocatorias`, `/sectores/...` and
`/novedades` paths this CLI uses are allowed. This CLI sends the honest
repo-convention UA `Mozilla/5.0 (compatible; trabajarenlopublico-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one listing page, plus one
`detail` fetch), **no bulk data collection**, and **no commercial use**. Run it
on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search open public-sector convocatorias anywhere in Spain (by keyword) or in a
  specific region/city
- Filter by sector (e.g. `policia`, `sanidad`, `trabajador-a-social`)
- Look up a specific convocatoria's record and application deadline

## Commands

### Search job listings

```bash
bun run .agents/skills/trabajarenlopublico-search/cli/src/cli.ts search [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — client-side keywords over title, employer,
  sector and place, e.g. `"enfermero"`, `"administrativo"`, `"policía local"`.
  The portal's own search endpoint is robots-disallowed, so filtering is local.
  Optional.
- `--location <place>` / `-l <place>` — client-side filter by place or region,
  e.g. `Madrid`, `Andalucía`, `Barcelona`, `Cantabria`. Optional.
- `--sector <name>` — client-side filter by sector slug/name, e.g. `policia`,
  `sanidad`, `madrid`, `trabajador-a-social`. Optional.
- `--remote` — filter client-side for offers whose title mentions remote work
  ("Teletrabajo"/"Remoto"). Heuristic: the portal publishes no remote flag.
- `--page <n>` — 1-indexed page over the filtered list (50 results/page).
  Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

> There is **no `--jobage` flag**: the portal publishes no per-posting date, and
> every entry on the listing is, by definition, still open. Results are ordered
> by application deadline (soonest first); entries without a stated deadline
> sort last.

### Fetch a convocatoria record

```bash
bun run .agents/skills/trabajarenlopublico-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the `id` (slug) from a `search` result, or a full convocatoria URL
such as
`https://trabajarenlopublico.ning.com/sectores/policia/convocatorias/convocatoria-proceso-selectivo-para-cubrir-una-plaza-de-polic-631`.
Because the portal exposes no server-rendered per-convocatoria page, `detail`
returns the full listing record (title, employer, location, sector, deadline,
URL) instead of a body description.

## Notes

- Data comes from the server-rendered "Convocatorias en plazo" listing.
- No credentials required.
- `company` is a best-effort employer extracted from the title (e.g.
  "Ayuntamiento de Tolosa"); it falls back to `"Administración Pública"` when the
  title names no employer.
- `location` is the place in the title (e.g. `Toledo`, `Cantabria`); it falls
  back to the region named by the sector slug when the title carries none.
- `sector` is the portal's own section label (a region or a job category).
- `date` is always `null`: the portal publishes no per-posting date.
- `deadline` is the `Plazo de solicitud` date, ISO `YYYY-MM-DD`
  (the site shows `DD de <month> de YYYY`). `null` when the entry states none.
- `remote` is a client-side heuristic inferred from the title.
