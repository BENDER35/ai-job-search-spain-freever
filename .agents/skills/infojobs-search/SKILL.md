---
name: infojobs-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain on InfoJobs
  (infojobs.net), Spain's largest job board, through its official public REST
  API, or to look up a specific InfoJobs posting. Invoke for Spanish job search
  across any sector — software, data, engineering, marketing, finance, sales,
  healthcare, hospitality, administration — by province, recency, or remote
  mode. English triggers: find a job in Spain, Spanish job search, jobs Madrid,
  jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs Spain, remote
  jobs Spain, look up this InfoJobs posting. Spanish triggers (frases en
  español): buscar trabajo en España, ofertas de empleo, bolsa de empleo,
  trabajo Madrid, trabajo Barcelona, trabajo programador, trabajo desarrollador,
  trabajo data scientist, trabajo remoto, teletrabajo, empleo por provincias,
  ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin experiencia,
  trabajo indefinido, media jornada.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/infojobs-search/cli/src/cli.ts *)
---

# InfoJobs Search Skill

Search live job listings from **[InfoJobs](https://www.infojobs.net)** — Spain's
largest job board — through its **official public REST API**. The API returns
structured JSON (no markup to parse) and **zero runtime dependencies** are
needed; it runs with just `bun`. InfoJobs is Spain-only (its province dictionary
covers the 52 Spanish provinces), so this skill is scoped to the Spanish market.

## ⚙️ Setup: API credentials are required

InfoJobs' API requires an application **Client ID** and **Client Secret** on
every request. Registration is free:

1. Log in at [developer.infojobs.net](https://developer.infojobs.net) with your
   InfoJobs account and register an application.
2. Export the credentials (the CLI reads them **only** from the environment):

   ```bash
   export INFOJOBS_CLIENT_ID="your-client-id"
   export INFOJOBS_CLIENT_SECRET="your-client-secret"
   ```

If either variable is unset, the CLI exits `1` with a stderr JSON error and code
`MISSING_CREDENTIALS` naming both variables — it never falls through to an
unauthenticated request. Credentials are never hardcoded and never accepted as a
CLI flag (flags leak into shell history and process listings). The repo
`.gitignore` covers `.env`; do not commit one.

The API is free to use within InfoJobs' documented limits. **Keep request volume
low** — a handful of requests per run, no bulk collection.

## When to use this skill

- Search job openings anywhere in Spain (by province), by recency, or remotely
- Cover non-tech sectors too (the InfoJobs dictionary spans every sector)
- Look up a specific InfoJobs posting for its full description, requirements,
  salary, contract type, and skills

## Commands

### Search job listings

```bash
bun run .agents/skills/infojobs-search/cli/src/cli.ts search [--query "<keywords>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"camarero"`, `"enfermero"`. Optional.
- `--location <place>` / `-l <place>` — a Spanish province name, e.g.
  `"Madrid"`, `"Barcelona"`, `"Málaga"`, `"A Coruña"`, `"Illes Balears"`.
  Accents and bilingual spellings (`"Alicante/Alacant"`, `"Bizkaia"`,
  `"Islas Baleares"`) are normalized to the API's province key. Maps to the
  `province` parameter.
- `--remote <mode>` — `remote` | `hybrid` | `onsite` (maps to `teleworking`).
- `--jobage <days>` — keep postings published within N days. The API exposes
  three recency buckets (1, 7, and 15 days), so the CLI sets the nearest bucket
  and then narrows to the exact window client-side.
- `--page <n>` — 1-indexed page. Default 1.
- `--limit <n>` / `-n <n>` — results to request from the API (`maxResults`),
  clamped to 1–50. Default 20.
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/infojobs-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the `id` from a `search` result (a ~30-character hex offer id) or
a full `https://www.infojobs.net/.../of-i<id>` offer URL. Returns the full
description, minimum/desired requirements, salary, contract type, workday,
studies, experience, vacancies, and skills. Any other host is rejected with
`BAD_ID`, so an external apply link is never fetched.

## Usage examples

```bash
# Python developer roles in Spain — quick table
bun run .agents/skills/infojobs-search/cli/src/cli.ts search -q "desarrollador python" --limit 10 --format table

# Data engineer roles in Madrid
bun run .agents/skills/infojobs-search/cli/src/cli.ts search -q "data engineer" -l Madrid --format table

# Fully-remote developer roles posted in the last 7 days
bun run .agents/skills/infojobs-search/cli/src/cli.ts search -q desarrollador --remote remote --jobage 7 --format json

# Hospitality roles in Barcelona, second page
bun run .agents/skills/infojobs-search/cli/src/cli.ts search -q camarero -l Barcelona --page 2 --format table

# Full details for a specific posting (pass the id or url from search output)
bun run .agents/skills/infojobs-search/cli/src/cli.ts detail 258eae420249ffa67cf64681a2ef80 --format plain
```

## Output formats

| Format | Best for |
|--------|----------|
| `json` | Default — programmatic use, passing `id`/`url` to `detail` |
| `table` | Quick human-readable scanning |
| `plain` | Reading a single job's full detail (`detail` command) |

Search JSON is `{ "meta": { "count", "page", "total" }, "results": [...] }`; each
result carries at least `id`, `title`, `company`, `location`, `date`, `url`
(missing values are `null`, never omitted). All errors are written to **stderr**
as `{ "error": "...", "code": "..." }` and the process exits with code `1`.

## Notes

- Data comes from InfoJobs' official public REST API — credentials required
  (see Setup), no HTML parsing.
- `id` is the InfoJobs offer id; pass it as-is (or the full offer URL) to
  `detail`.
- `date` is the posting date (`published`, RFC 3339). `--jobage` maps to the
  API's `sinceDate` buckets (1 / 7 / 15 days) and is narrowed client-side to the
  exact window; an undated offer is kept (absence of a date is not evidence of
  age).
- **InfoJobs exposes no application deadline**, so `detail`'s `deadline` is
  always `null` — never inferred.
- `--location` has no local allowlist: an unrecognized province is passed to the
  API, which reports its own `301` error rather than the CLI silently dropping
  the filter.
- The CLI retries `429`/`5xx` with exponential backoff and jitter, returns `null`
  on `404` (surfaced as `NOT_FOUND` / `SEARCH_FAILED`), and backs off on a
  rejected credential (`AUTH_FAILED`). If InfoJobs starts refusing you, stop.
- `detail` is one request per posting; do not loop it over every search hit.
  Fetch full detail only for postings worth a closer look.
