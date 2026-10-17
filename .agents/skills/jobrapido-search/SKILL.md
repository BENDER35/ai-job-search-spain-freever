---
name: jobrapido-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on Jobrapido
  (es.jobrapido.com), a large job aggregator with a Spanish site, or to look up
  a specific Jobrapido posting. Invoke for Spanish job search across any sector
  — software, data, engineering, marketing, finance, sales, healthcare,
  hospitality, administration, logistics, construction and more — by keyword,
  city or province. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs
  Spain, remote jobs Spain, look up this Jobrapido posting. Spanish triggers
  (frases en español): buscar trabajo en España, ofertas de empleo, bolsa de
  empleo, trabajo Madrid, trabajo Barcelona, trabajo programador, trabajo
  desarrollador, trabajo data scientist, trabajo remoto, teletrabajo, empleo por
  provincias, ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin
  experiencia, trabajo indefinido, media jornada, portal de empleo, jobrapido.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/jobrapido-search/cli/src/cli.ts *)
---

# Jobrapido (Spain) Search Skill

Search live job listings in Spain on [Jobrapido](https://es.jobrapido.com), a
large job aggregator with a dedicated Spanish site. Jobrapido indexes offers
from many sources (`jobleads.es`, `talent.com`, company sites…) so it is a good
broad-net complement to the niche Spanish boards.

## ⚠️ Personal use only

Jobrapido's `robots.txt` disallows its query-string search parameters (`?q=`, `?l=`, `?p=`, `?o=`…) and its `/jobpreview/*` job pages for generic crawlers. It does, however, explicitly **allow** named AI agents (`Claude-User`, `Claude-SearchBot`, `GPTBot`, `PerplexityBot`…) on those very paths, which is a deliberate signal that the site welcomes AI-assisted search. This skill:

- searches **only** through the SEO path `/Ofertas-de-empleo-para-<query>[-en-<location>]`, which `robots.txt` allows for **every** agent (the disallowed `?l=`/`?p=`/`?o=` params are never used);
- uses `/jobpreview/<id>` for `detail`, which the site allows for named AI agents but disallows for a generic crawler.

Use it for **personal job hunting only**, keep request volume low (one request per search, one per detail, no bulk crawling, no commercial reuse), and accept that the decision — and any consequence — is your own. When in doubt, use Jobrapido's website directly.

## Data source

- **Search** — `https://es.jobrapido.com/Ofertas-de-empleo-para-<query>[-en-<location>]` (or `/Ofertas-de-empleo-en-<location>` for a location-only search). The page is a server-rendered Angular app; each result card carries a `data-advert` JSON attribute with the advert id, title, company, location, posting date, source site and sponsored flag.
- **Detail** — `https://es.jobrapido.com/jobpreview/<advertId>`. The page is a Next.js App Router page whose RSC flight payload embeds a schema.org `JobPosting` JSON-LD blob (title, HTML description, employment type, salary, `datePosted`, `validThrough`, organization, location).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.
- `--remote`, `--jobage` and `--limit` are applied client-side.

## Limitations

- **Only the first page of results is reachable.** Jobrapido's pagination (`?p=`/`?o=`) and location (`?l=`) query params are disallowed by `robots.txt`, so this skill never uses them. To narrow a large result set use `--location`, `--jobage` and `--limit`. `--page` values above `1` return a `PAGE_UNSUPPORTED` error instead of silently repeating page 1.
- A keyword search with neither `--query` nor `--location` is rejected with `BAD_ARG` (Jobrapido's homepage renders its list client-side and yields nothing to parse).
- Unknown keywords may either return zero results or a loosely related set — Jobrapido's SEO path applies fuzzy matching.
- Titles come from the aggregator and sponsored cards sometimes read like `Trabajo de Recepcionista en Fuenlabrada`; treat `title` as the advertiser's headline.

## USAGE

```bash
bun run .agents/skills/jobrapido-search/cli/src/cli.ts search [flags]
bun run .agents/skills/jobrapido-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — free-text keywords. Optional (but see limitations).
- `-l, --location <place>` — city or province, e.g. `Madrid`, `Barcelona`, `Valencia`. Optional.
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side recency filter on the posting date.
- `--page <n>` — only `1` is available (see limitations).
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the numeric advert id from a search result or the full `https://es.jobrapido.com/jobpreview/<id>` URL.

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (ISO `YYYY-MM-DD` when parseable), `url`, `excerpt` (usually `null` for search), `salary`, `contract`, `remote`, `source` (the aggregated site, e.g. `www.jobleads.es`) and `sponsored`.

Detail JSON adds `description` (plain text with paragraph breaks), `employmentType`, `salary`, `isActive`, `deadline` and `applyUrl`.

## Notes

- `date` is parsed from the card's `03 oct` style label with year inference, so it can be off by a day around year boundaries.
- `employmentType` is translated from the schema.org value (`FULL_TIME` → `Jornada completa`, …).
- `salary` is filled only when the JSON-LD carries a positive value.
- `isActive` is `false` only when `validThrough` is in the past.
