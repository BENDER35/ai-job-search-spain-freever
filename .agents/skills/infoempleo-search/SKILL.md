---
name: infoempleo-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain on Infoempleo (infoempleo.com),
  a well-known Spanish job board, or to look up a specific Infoempleo posting.
  Invoke for Spanish job search across any sector — software, data, engineering,
  marketing, finance, sales, healthcare, hospitality, administration — by province,
  city, or remote mode. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs Spain,
  remote jobs Spain, look up this Infoempleo posting. Spanish triggers (frases en
  español): buscar trabajo en España, ofertas de empleo, bolsa de empleo, trabajo
  Madrid, trabajo Barcelona, trabajo programador, trabajo desarrollador, trabajo
  data scientist, trabajo remoto, teletrabajo, empleo por provincias, ofertas de
  trabajo hoy, buscar empleo, ofertas de empleo sin experiencia, trabajo indefinido,
  media jornada.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/infoempleo-search/cli/src/cli.ts *)
---

# Infoempleo Search Skill

Search live job listings from **[Infoempleo](https://www.infoempleo.com)** — a
long-established Spanish job board covering every sector and city in Spain.

## ⚠️ Personal use only

Infoempleo's robots.txt allows ordinary crawlers on `/ofertas/` paths but it
disallows known AI crawler user-agents (`AnthropicBot`, `Claude`, `GPTBot`).
This CLI therefore sends the honest repo-convention UA
`Mozilla/5.0 (compatible; infoempleo-cli/1.0)`, which is **not** on the disallow
list — it never impersonates a full browser.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. If Infoempleo returns
429/5xx, the CLI backs off and retries; if it starts refusing you, stop.

## When to use this skill

- Search job openings in Spain (by province or city) or remotely
- Filter by recency (`--jobage`) and workplace type (`--remote`)
- Look up a specific Infoempleo posting for its full description, job type, and
  required skills

## Commands

### Search job listings

```bash
bun run .agents/skills/infoempleo-search/cli/src/cli.ts search [--query "<keywords>"] [--location "<place>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"data engineer"`. Optional.
- `--location <place>` / `-l <place>` — a Spanish province name (e.g.
  `"Madrid"`, `"Barcelona"`, `"Málaga"`), a city name, or `"Remote"`. Maps to
  Infoempleo's `lugar` parameter. Optional; if omitted the search is nationwide.
- `--remote <mode>` — `remote` | `onsite` | `hybrid` (client-side filter).
- `--jobage <days>` — keep postings published within N days. Infoempleo
  exposes a "published in the last 24h" toggle; client-side for other windows.
- `--page <n>` — 1-indexed page (20 results per page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/infoempleo-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the offer ID from a `search` result, or a full Infoempleo URL such
as `https://www.infoempleo.com/ofertas/`. The ID is the numeric identifier
Infoempleo assigns to each posting. A full `infoempleo.com` URL is also accepted.
Returns the full description, job type, company, location, and required skills.

## Usage examples

```bash
# Python developer roles in Spain — quick table
bun run .agents/skills/infoempleo-search/cli/src/cli.ts search -q "desarrollador python" --limit 10 --format table

# Data engineer roles in Madrid
bun run .agents/skills/infoempleo-search/cli/src/cli.ts search -q "data engineer" -l Madrid --format table

# Fully-remote developer roles posted in the last 7 days
bun run .agents/skills/infoempleo-search/cli/src/cli.ts search -q desarrollador --remote remote --jobage 7 --format json

# IT roles in Barcelona, second page
bun run .agents/skills/infoempleo-search/cli/src/cli.ts search -q informatica -l Barcelona --page 2 --format table

# Full details for a specific posting (pass the id or url from search output)
bun run .agents/skills/infoempleo-search/cli/src/cli.ts detail "123456" --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing `id`/`url` to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

Search JSON is `{ "meta": { "count", "page", "total", "perPage" }, "results": [...]} `;
each result carries at least `id`, `title`, `company`, `location`, `date`, `url`
(missing values are `null`, never omitted). All errors are written to **stderr**
as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data comes from Infoempleo's public, server-rendered HTML — no credentials.
- 20 results per page; `meta.total` is the portal's reported match count.
- Province names and city names are passed as-is to Infoempleo's query
  parameters; the portal handles accent normalization internally.
- The only recency filter Infoempleo exposes is an indicator for "published in
  the last 24h". Any other `--jobage` value is applied client-side on the
  posting date; results whose date could not be parsed are kept (absence of a
  date is not evidence of age).
- `date` is the posting date, converted to ISO `YYYY-MM-DD` when possible.
- **There is no application deadline anywhere on Infoempleo**, so `detail`'s
  `deadline` is always `null` — never inferred.
- `detail` is a single request per posting; do not loop it over every search
  hit. Fetch full detail only for postings worth a closer look.
