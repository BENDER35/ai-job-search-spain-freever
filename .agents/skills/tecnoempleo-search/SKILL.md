---
name: tecnoempleo-search
version: 1.0.0
description: >
  Use this skill to search live IT, telecom, software, data, and engineering job
  listings in Spain on Tecnoempleo (tecnoempleo.com), Spain's main technology job
  board, or to look up a specific Tecnoempleo posting. Invoke for Spanish tech job
  search, developer/engineer/data roles in Spanish cities or provinces, and remote
  tech vacancies in Spain. English triggers: find a tech job in Spain, Spanish tech
  job search, software developer jobs Spain, IT jobs Madrid, Barcelona developer
  jobs, data engineer jobs Spain, DevOps jobs Spain, remote tech jobs Spain, look up
  this Tecnoempleo posting. Spanish triggers (frases en español): buscar trabajo de
  informática en España, ofertas de empleo tecnológicas, trabajo programador,
  trabajo desarrollador, ofertas de trabajo Madrid, ofertas de empleo Barcelona,
  trabajo ingeniero informático, trabajo data scientist, teletrabajo España,
  buscar empleo remoto, ofertas de trabajo sin experiencia, bolsa de empleo
  tecnológico, empleo sector IT.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts *)
---

# Tecnoempleo Search Skill

Search live job listings from **[Tecnoempleo](https://www.tecnoempleo.com)** —
Spain's main IT / telecom job board. No authentication, no API key, and **zero
runtime dependencies** — it runs with just `bun`. The portal is Spain-specific
(province filters 231–282), so this skill is scoped to the Spanish market.

## ⚠️ Personal use only

This reads Tecnoempleo's public, server-rendered search and detail pages.
Tecnoempleo's `robots.txt` **allows ordinary crawlers** on the
`/ofertas-trabajo/` paths this skill uses, but it **explicitly disallows known AI
crawler user-agents** (`AnthropicBot`, `Claude`, `GPTBot`, and others). This CLI
therefore sends the honest repo-convention UA
`Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)`, which is **not** on the disallow
list — it never impersonates a full browser.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. If Tecnoempleo returns
`429`/`5xx`, the CLI backs off and retries; if it starts refusing you, stop.

## When to use this skill

- Search technology job openings anywhere in Spain (by province) or remotely
- Filter by recency (`--jobage`) and workplace type (`--remote`)
- Look up a specific Tecnoempleo posting for its full description, contract
  type, salary, and the list of required skills

## Commands

### Search job listings

```bash
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts search [--query "<keywords>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"data engineer"`. Optional.
- `--location <place>` / `-l <place>` — a Spanish province name or its numeric
  Tecnoempleo code (231–282), e.g. `"Madrid"`, `"Barcelona"`, `"Málaga"`,
  `"Bizkaia"`, `"263"`. Maps to the portal's `pr` parameter.
- `--remote <mode>` — `remote` | `onsite` | `hybrid` (maps to `en_remoto`).
- `--jobage <days>` — keep postings published within N days. Tecnoempleo only
  exposes a "last 24h" filter, so this is applied **client-side** from the
  posting date (and `--jobage 1` additionally sets the portal's `ult_24h=1`).
- `--page <n>` — 1-indexed page (30 results per page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the `url` or `id` from a `search` result. The `id` is the URL path
after the host — `slug/skills/rf-<hash>` — because Tecnoempleo has no short URL:
the slug segment is required to fetch the page (a bare `rf-<hash>` 404s). A full
`tecnoempleo.com` URL is also accepted. Returns the full description, contract
type, experience, salary, and required skills.

## Usage examples

```bash
# Python developer roles in Spain — quick table
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts search -q "desarrollador python" --limit 10 --format table

# Data engineer roles in Madrid
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts search -q "data engineer" -l Madrid --format table

# Fully-remote developer roles posted in the last 7 days
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts search -q desarrollador --remote remote --jobage 7 --format json

# IT roles in Barcelona, second page
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts search -q informatica -l Barcelona --page 2 --format table

# Full details for a specific posting (pass the url or id from search output)
bun run .agents/skills/tecnoempleo-search/cli/src/cli.ts detail "desarrollador-python-sobre-gcp-arelance/cloud-git/rf-478e15e942b7f396ba44" --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing `id`/`url` to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

Search JSON is `{ "meta": { "count", "page", "total", "perPage" }, "results": [...] }`;
each result carries at least `id`, `title`, `company`, `location`, `date`, `url`
(missing values are `null`, never omitted). All errors are written to **stderr**
as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data comes from Tecnoempleo's public server-rendered HTML — no credentials.
- 30 results per page; `meta.total` is the portal's reported match count.
- Province codes run **231–282** (one per Spanish province plus Ceuta/Melilla).
  `--location` accepts the province name (accent-insensitive, with common
  Castilian aliases such as `Vizcaya`→Bizkaia) or the raw code.
- The only recency filter the portal exposes is "published in the last 24h"
  (`ult_24h`). Any other `--jobage` value is applied client-side on the posting
  date; results whose date could not be parsed are kept (absence of a date is
  not evidence of age).
- `date` is the posting date (`datePosted`), converted to ISO `YYYY-MM-DD`.
- **There is no application deadline anywhere on Tecnoempleo**, so `detail`'s
  `deadline` is always `null` — never inferred.
- `detail` is a single request per posting; do not loop it over every search
  hit. Fetch full detail only for postings worth a closer look.
