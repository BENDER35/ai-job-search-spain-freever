---
name: itjobs-search
version: 1.0.0
description: >
  Use this skill to search live IT and technology job listings in Spain on ITJobs
  (itjobs.es), a Spanish technology job board, or to look up a specific ITJobs
  posting. Invoke for Spanish IT job search across software, data, engineering,
  DevOps, cybersecurity, cloud, SAP and other technology roles. English triggers:
  find a tech job in Spain, Spanish IT job search, software developer jobs Spain,
  IT jobs Madrid, Barcelona developer jobs, data engineer jobs Spain, DevOps jobs
  Spain, remote tech jobs Spain, look up this ITJobs posting. Spanish triggers
  (frases en español): buscar trabajo de informática en España, ofertas de empleo
  tecnológicas, trabajo programador, trabajo desarrollador, ofertas de trabajo
  Madrid, ofertas de empleo Barcelona, trabajo ingeniero informático, trabajo data
  scientist, teletrabajo España, buscar empleo remoto, ofertas de trabajo sin
  experiencia, bolsa de empleo tecnológico, empleo sector IT, trabajo IT.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/itjobs-search/cli/src/cli.ts *)
---

# ITJobs Search Skill

Search live job listings from **[ITJobs](https://www.itjobs.es)** — a Spanish
technology job board covering software development, data engineering, DevOps,
cybersecurity, cloud, SAP and other IT roles across Spain.

## ⚠️ Personal use only

ITJobs's robots.txt allows ordinary crawlers on `/empleo/` paths but disallows
known AI crawler user-agents (`AnthropicBot`, `Claude`, `GPTBot`). This CLI
sends the honest repo-convention UA `Mozilla/5.0 (compatible; itjobs-cli/1.0)`.

**Keep volume low.** A handful of requests per run (one search page, plus one
`detail` fetch per posting worth a look), **no bulk data collection**, and **no
commercial use**. Run it on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search technology job openings anywhere in Spain (by keyword) or remotely
- Filter by recency (client-side) and workplace type (Remoto)
- Look up a specific ITJobs posting for its full description, company, and
  required skills

## Commands

### Search job listings

```bash
bun run .agents/skills/itjobs-search/cli/src/cli.ts search [--query "<keywords>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (job title, skill, role), e.g.
  `"desarrollador python"`, `"data engineer"`, `"SAP"`. Optional.
- `--remote` — filter client-side for remote offers.
- `--jobage <days>` — client-side recency filter (no posting date on cards).
- `--page <n>` — 1-indexed page (21 results/page). Default 1.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/itjobs-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the offer ID from a `search` result, or a full ITJobs URL such
as `https://www.itjobs.es/empleo/38868/...`. The ID is the numeric identifier
ITJobs assigns to each posting. A full `itjobs.es` URL is also accepted. Returns
the full description, company, and required skills.

## Notes

- Data comes from ITJobs's public, server-rendered HTML — no credentials.
- ~21 results per page; pagination via `?page=N`.
- Search via `?search=...` query parameter (keyword).
- Company name is parsed from the card's `<a title="..." href="/empresa/...">`.
- **No posting date** on ITJobs cards; `date` is always `null`.
- **No application deadline** on ITJobs; `detail`'s `deadline` is always `null`.
- `detail` is a single request per posting; fetch full detail only for postings
  worth a closer look.
