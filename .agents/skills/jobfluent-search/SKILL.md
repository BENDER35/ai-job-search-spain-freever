---
name: jobfluent-search
version: 1.0.0
description: >
  Use this skill to search live IT and technology job listings in Spain on JobFluent
  (jobfluent.com), a Spanish tech job board, or to look up a specific JobFluent
  posting. Invoke for Spanish tech job search across software, data, engineering,
  DevOps, product, and other technology roles by city or remote mode. English
  triggers: find a tech job in Spain, Spanish IT job search, software developer jobs
  Spain, IT jobs Madrid, Barcelona developer jobs, data engineer jobs Spain, DevOps
  jobs Spain, remote tech jobs Spain, look up this JobFluent posting. Spanish
  triggers (frases en español): buscar trabajo de informática en España, ofertas de
  empleo tecnológicas, trabajo programador, trabajo desarrollador, ofertas de trabajo
  Madrid, ofertas de empleo Barcelona, trabajo ingeniero informático, trabajo data
  scientist, teletrabajo España, buscar empleo remoto, ofertas de trabajo sin
  experiencia, bolsa de empleo tecnológico, empleo sector IT, trabajo tech.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/jobfluent-search/cli/src/cli.ts *)
---

# JobFluent Search Skill

Search live job listings from **[JobFluent](https://www.jobfluent.com)** — a Spanish
technology job board covering software development, data engineering, DevOps, product,
and other tech roles across Spain.

## Data source

JobFluent exposes a public JSON API:
- Search: `GET https://www.jobfluent.com/es/empleos.json?q=KEYWORDS&page=N`
- Detail: server-rendered HTML at `https://www.jobfluent.com/jobs/{slug}-{token}`

## ⚠️ Personal use only

JobFluent's robots.txt allows ordinary crawlers on `/jobs/` paths. This CLI sends
the honest repo-convention UA `Mozilla/5.0 (compatible; jobfluent-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search technology job openings anywhere in Spain (by keyword) or remotely
- Filter by recency (client-side) and workplace type (remote flag)
- Look up a specific JobFluent posting for its full description, company, and
  required skills

## Commands

### Search job listings

```bash
bun run .agents/skills/jobfluent-search/cli/src/cli.ts search [--query "<keywords>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"data engineer"`. Optional.
- `--remote` — filter client-side for remote offers (remote=true).
- `--jobage <days>` — client-side recency filter.
- `--page <n>` — 1-indexed page (25 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/jobfluent-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the offer ID/token from a `search` result, or a full JobFluent URL
such as `https://www.jobfluent.com/jobs/...`. Returns the full description, company,
and required skills.

## Notes

- Data comes from JobFluent's public JSON API (search) + server-rendered HTML (detail).
- No credentials required.
- `location` is extracted from the URL slug (e.g. "barcelona", "madrid", "remote").
- `date` is the posting date (`published`), ISO `YYYY-MM-DD`.
- **No application deadline** on JobFluent → `deadline` is `null`.
- `detail` is a single request per posting; fetch full detail only for postings
  worth a closer look.
