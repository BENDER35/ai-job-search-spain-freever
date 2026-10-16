---
name: disjob-search
version: 1.0.0
description: >
  Use this skill to search live job listings in Spain for people with disabilities on
  Disjob (disjob.com), a specialized Spanish job board connecting inclusive employers
  with candidates who have disabilities. Invoke for Spanish inclusive job search across
  all sectors. English triggers: find an inclusive job in Spain, Spanish disability
  job search, jobs for people with disabilities Spain. Spanish triggers (frases en
  español): buscar trabajo inclusivo en España, empleo para personas con discapacidad,
  ofertas de empleo discapacidad, trabajo inclusivo, empleo diversidad, disJob.
context: fork
enabled: true  # set to false to keep this portal installed but have /scrape skip it
allowed-tools: Bash(bun run .agents/skills/disjob-search/cli/src/cli.ts *)
---

# Disjob Search Skill

Search live job listings from [Disjob](https://www.disjob.com) — a Spanish job
board focused on inclusive employers (people with disabilities).

## ⚠️ Personal use only

Disjob's robots.txt permits ordinary crawlers but disallows AI crawler
user-agents. This CLI sends the honest UA `Mozilla/5.0 (compatible; disjob-cli/1.0)`.

**Keep volume low.** A handful of requests per run; no bulk data collection,
no commercial use. Run on your own responsibility. Retry on 429/5xx.

## When to use this skill

- Search inclusive job openings in Spain across all sectors and provinces
- Filter by recency (`--jobage`, noted may be client-side) and workplace type (`--remote`)
- Look up a specific Disjob posting for its full description and salary

## Commands

### Search job listings

```bash
bun run .agents/skills/disjob-search/cli/src/cli.ts search [--query "<keywords>"] [--location "<province>"] [flags]
```

Key flags:
- `--query <text>` / `-q <text>` — keywords. Optional.
- `--location` — ignored; province filter is via `--remote` and full province name. Optional.
- `--remote <mode>` — `remote` (trabajar desde casa) | `onsite` | `hybrid`.
- `--jobage <days>` — minimum posted date filter (client-side).
- `--page <n>` — Disjob shows all offers in one POST; pagination may be limited. Default 1.
- `--format json|table|plain` — default `json`.

### Fetch full job detail

```bash
bun run .agents/skills/disjob-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

## Notes

- Data comes from disjob.com's server-rendered search results via POST form.
- Results are limited to recent listings (typically ~50 per province).
- No authentication required.
- Province names filter inside the form (`idProvincia`).
- `deadline` is always `null` — never inferred.

The system uses server-rendered HTML after a POST. Detail requests need an
active session cookie (PHPSESSID) obtained from the search page.

Search JSON is `{ "meta": { "count", "page", "total" }, "results": [...] }`;
each result carries at least `id`, `title`, `company`, `location`, `date`, `url`.
