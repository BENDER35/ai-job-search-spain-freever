---
name: domestika-search
version: 1.0.0
description: >
  Use this skill to search creative, design and communications job listings in Spain on
  Domestika (domestika.org), a leading creative-community job board, or to look up a
  specific Domestika posting. Invoke for Spanish creative job search across graphic design,
  UX/UI, motion, illustration, audiovisual, marketing and communications. English triggers:
  find a creative job in Spain, Spanish design job search, graphic designer jobs Spain,
  UX jobs Barcelona, remote creative jobs Spain, look up this Domestika posting. Spanish
  triggers (frases en español): buscar trabajo creativo en España, ofertas de empleo
  diseño, trabajo diseñador gráfico, empleo diseño Madrid, trabajo UX, teletrabajo
  creativo, bolsa de empleo diseño, empleo comunicacion, motion graphics, ilustración.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/domestika-search/cli/src/cli.ts *)
---

# Domestika Search Skill

Search live job listings from **[Domestika](https://www.domestika.org)** — a creative
community and job board covering design, illustration, audiovisual, UX/UI, motion
graphics, marketing and more across Spain.

## Data source

Domestika exposes a public **Atom feed** at `https://www.domestika.org/es/jobs.atom`
returning the most recent ~50 offers. Results are also scraped from the HTML detail
pages for company/location/description details. There is **no keyword search on the
server**, so `--query` is applied client-side. Atomic feed allows light, robot-friendly
requests.

## ⚠️ Personal use only

Domestika's robots.txt disallows known AI crawler user-agents (`AnthropicBot`,
`Claude`, `GPTBot`). This CLI uses the honest repo-convention UA
`Mozilla/5.0 (compatible; domestika-cli/1.0)`.

**Keep volume low.** The feed is a single request per run; detail pages fetched only
for postings worth a look. Run on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search creative job openings in Spain (any city) or remotely
- Filter by recency (`--jobage`) client-side
- Look up a specific Domestika posting for full description and company

## Commands

### Search job listings

```bash
bun run .agents/skills/domestika-search/cli/src/cli.ts search [--query "<keywords>"] [--location "<place>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords (title, skill, role, creative focus). Optional.
- `--location <place>` / `-l <place>` — a Spanish province/city filter (client-side). Optional.
- `--remote` — filter client-side.
- `--jobage <days>` — client-side recency filter.
- `--limit <n>` / `-n <n>` — cap results emitted (client-side).
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/domestika-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

`<id|url>` is the ID from a `search` result, or a full Domestika URL such as
`https://www.domestika.org/es/jobs/12345-...`. Returns the full description,
company, location and creative role details.

## Notes

- Data comes from Domestika's public Atom feed (server-rendered detail HTML).
- Feed returns up to ~50 most recent offers; pagination is not supported .
- No credentials required.
- **No application deadline** on Domestika → `deadline` is `null`.
- `date` is the posting date, ISO `YYYY-MM-DD`.
