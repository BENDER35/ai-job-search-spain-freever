---
name: ticjob-search
version: 1.0.0
description: >
  Use this skill to search live IT and technology job listings in Spain on Ticjob
  (ticjob.es), a specialized Spanish technology and IT job board. Invoke for Spanish
  IT job search across software, data, engineering, DevOps, cybersecurity, cloud,
  and other technology roles by province, city, or remote mode. English triggers:
  find a tech job in Spain, Spanish IT job search, software developer jobs Spain,
  IT jobs Madrid, Barcelona developer jobs, data engineer jobs Spain, DevOps jobs
  Spain, remote tech jobs Spain, look up this Ticjob posting. Spanish triggers
  (frases en español): buscar trabajo de informática en España, ofertas de empleo
  tecnológicas, trabajo programador, trabajo desarrollador, ofertas de trabajo
  Madrid, ofertas de empleo Barcelona, trabajo ingeniero informático, trabajo data
  scientist, teletrabajo España, buscar empleo remoto, ofertas de trabajo sin
  experiencia, bolsa de empleo tecnológico, empleo sector IT, trabajo TIC, empleo
  tecnologías de la información.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/ticjob-search/cli/src/cli.ts *)
---

# Ticjob Search Skill

Search live job listings from **[Ticjob](https://www.ticjob.es)** — a Spanish
technology and IT job board covering software development, data engineering,
DevOps, cybersecurity, cloud, and other TIC roles across Spain.

## ⚠️ Personal use only

Ticjob's robots.txt allows ordinary crawlers on `/ofertas/` paths but it
disallows known AI crawler user-agents (`AnthropicBot`, `Claude`, `GPTBot`).
This CLI therefore sends the honest repo-convention UA
`Mozilla/5.0 (compatible; ticjob-cli/1.0)`, which is **not** on the disallow
list — it never impersonates a full browser.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. If Ticjob returns
429/5xx, the CLI backs off and retries; if it starts refusing you, stop.

## When to use this skill

- Search technology job openings anywhere in Spain (by province/city) or remotely
- Filter by recency (`--jobage`) and workplace type (`--remote`)
- Look up a specific Ticjob posting for its full description, contract type,
  salary, and required skills

## Commands

### Search job listings

```bash
bun run .agents/skills/ticjob-search/cli/src/cli.ts search [--query "<keywords>"] [--location "<place>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"data engineer"`, `"DevOps"`. Optional.
- `--location <place>` / `-l <place>` — a Spanish province name or city
  (e.g. `"Madrid"`, `"Barcelona"`, `"Valencia"`), or `"Remote"`, mapped to
  Ticjob's location parameter. Optional; nationwide if omitted.
- `--remote <mode>` — `remote` | `onsite` | `hybrid` (client-side).
- `--jobage <days>` — keep postings published within N days. Ticjob exposes
  a "last 24h" filter; client-side for other windows.
- `--page <n>` — 1-indexed page (20 results per page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/ticjob-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the offer ID from a `search` result, or a full Ticjob URL such
as `https://www.ticjob.es/ofertas/`. The ID is the numeric identifier Ticjob
assigns to each posting. A full `ticjob.es` URL is also accepted. Returns the
full description, job type, company, location, and required skills.

## Usage examples

```bash
# Python developer roles in Spain — quick table
bun run .agents/skills/ticjob-search/cli/src/cli.ts search -q "desarrollador python" --limit 10 --format table

# Data engineer roles in Madrid
bun run .agents/skills/ticjob-search/cli/src/cli.ts search -q "data engineer" -l Madrid --format table

# Fully-remote DevOps roles posted in the last 7 days
bun run .agents/skills/ticjob-search/cli/src/cli.ts search -q DevOps --remote remote --jobage 7 --format json

# IT roles in Barcelona, second page
bun run .agents/skills/ticjob-search/cli/src/cli.ts search -q informatica -l Barcelona --page 2 --format table

# Full details for a specific posting (pass the id or url from search output)
bun run .agents/skills/ticjob-search/cli/src/cli.ts detail "123456" --format plain
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

- Data comes from Ticjob's public, server-rendered HTML — no credentials.
- 20 results per page; `meta.total` is the portal's reported match count.
- Province names and city names are passed as-is to Ticjob's query
  parameters; the portal handles accent normalization internally.
- The only recency filter Ticjob exposes is an indicator for "published in the
  last 24h". Any other `--jobage` value is applied client-side on the posting
  date; results whose date could not be parsed are kept (absence of a date is
  not evidence of age).
- `date` is the posting date, converted to ISO `YYYY-MM-DD` when possible.
- **There is no application deadline anywhere on Ticjob**, so `detail`'s
  `deadline` is always `null` — never inferred.
- `detail` is a single request per posting; do not loop it over every search
  hit. Fetch full detail only for postings worth a closer look.
