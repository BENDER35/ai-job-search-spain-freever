---
name: jobijoba-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on Jobijoba
  (www.jobijoba.es), a large job aggregator with a Spanish site, or to look up
  a specific Jobijoba posting. Invoke for Spanish job search across any sector
  — software, data, engineering, marketing, finance, sales, healthcare,
  hospitality, administration, logistics, construction and more — by keyword,
  city or province. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs
  Spain, remote jobs Spain, look up this Jobijoba posting. Spanish triggers
  (frases en español): buscar trabajo en España, ofertas de empleo, bolsa de
  empleo, trabajo Madrid, trabajo Barcelona, trabajo programador, trabajo
  desarrollador, trabajo data scientist, trabajo remoto, teletrabajo, empleo por
  provincias, ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin
  experiencia, trabajo indefinido, media jornada, portal de empleo, jobijoba.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/jobijoba-search/cli/src/cli.ts *)
---

# Jobijoba (Spain) Search Skill

Search live job listings in Spain on [Jobijoba](https://www.jobijoba.es), a
large job aggregator with a dedicated Spanish site. Jobijoba indexes offers
from many sources (Talent, InfoJobs, company sites…) so it is a good broad-net
complement to the niche Spanish boards.

## ⚠️ Personal use only

Jobijoba's `robots.txt` disallows `/query/` (the search endpoint) and
`/redirect/` for generic crawlers, but explicitly **allows** named AI agents
(`ClaudeBot`, `Claude-User`, `GPTBot`, `ChatGPT-User`, `PerplexityBot`) on
`/query/`. This skill:

- searches **only** through `/query/?what=...&where=...&page=...`;
- always reads the robots-allowed first-party page `/oferta-empleo/<source>/<hash>` for `detail` (which contains the full description and a schema.org `JobPosting`).

Use it for **personal job hunting only**, keep request volume low, and accept that the decision — and any consequence — is your own. When in doubt, use Jobijoba's website directly.

## Data source

- **Search** — `https://www.jobijoba.es/query/?what=<keywords>[&where=<place>][&page=N]`.
- **Detail** — `https://www.jobijoba.es/oferta-empleo/<source>/<hash>` (first-party, robots-allowed).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.

## Limitations

- Only the first-party detail page is fetched; offers whose Jobijoba page has expired return a stub pointing at the outbound redirect link.
- `employmentType` is often empty on Jobijoba's pages.
- Search is by free text, but Jobijoba applies its own relevance ranking.

## USAGE

```bash
bun run .agents/skills/jobijoba-search/cli/src/cli.ts search [flags]
bun run .agents/skills/jobijoba-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — free-text keywords. Optional.
- `-l, --location <place>` — city or province, e.g. `Madrid`, `Barcelona`, `Valencia`. Optional.
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side recency filter on the posting date.
- `--page <n>` — page (1-indexed). Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the `<source>/<hash>` id from a search result or the full `https://www.jobijoba.es/oferta-empleo/<source>/<hash>` / `https://www.jobijoba.es/redirect/offer/<source>/<hash>` URL.

## Output

Search JSON is `{ "meta": { "count", "total", "heading", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (ISO `YYYY-MM-DD` when parseable), `url` (the robots-allowed first-party page), `excerpt`, `salary` (usually `null`), `contract` (usually `null`), `remote`, and `jobFunction`.

Detail JSON adds `description` (plain text with paragraph breaks), `employmentType`, `isActive`, `deadline` and `applyUrl` (the outbound source link).

## Notes

- `date` is parsed from the `Publicada el DD mes` label with year inference, so it can be off by a day around year boundaries.
- `isActive` is `false` only when `validThrough` is in the past.
