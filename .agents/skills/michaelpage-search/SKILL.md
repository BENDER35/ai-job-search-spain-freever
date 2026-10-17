---
name: michaelpage-search
version: 1.0.0
description: >-
  Use this skill to search live job listings in Spain on Michael Page
  (www.michaelpage.es), a recruitment firm's job board, or to look up a
  specific Michael Page posting. Invoke for Spanish job search across any
  sector — software, data, engineering, marketing, finance, sales, healthcare,
  hospitality, administration, logistics, construction and more — by keyword,
  city or province. English triggers: find a job in Spain, Spanish job search,
  jobs Madrid, jobs Barcelona, IT jobs Spain, developer jobs Spain, data jobs
  Spain, remote jobs Spain, look up this Michael Page posting. Spanish triggers
  (frases en español): buscar trabajo en España, ofertas de empleo, bolsa de
  empleo, trabajo Madrid, trabajo Barcelona, trabajo programador, trabajo
  desarrollador, trabajo data scientist, trabajo remoto, teletrabajo, empleo por
  provincias, ofertas de trabajo hoy, buscar empleo, ofertas de empleo sin
  experiencia, trabajo indefinido, media jornada, portal de empleo, michaelpage,
  michael page.
context: fork
enabled: true
allowed-tools: Bash(bun run .agents/skills/michaelpage-search/cli/src/cli.ts *)
---

# Michael Page (Spain) Search Skill

Search live job listings in Spain on [Michael Page](https://www.michaelpage.es),
a recruitment firm's job board. Each listing carries a title, location,
contract type and summary; detail pages embed a schema.org `JobPosting`
JSON-LD blob with the full description.

## Data source

- **Search** — `https://www.michaelpage.es/jobs?query=<q>` (server-rendered Drupal listing, paginated via `?page=N`).
- **Detail** — `https://www.michaelpage.es/job-detail/<slug>/ref/<ref>` (server-rendered, JSON-LD JobPosting).

## Data source notes

- No authentication or credentials are required.
- Request volume is kept low and retried with exponential backoff on `429`/`5xx`.

## USAGE

```bash
bun run .agents/skills/michaelpage-search/cli/src/cli.ts search [flags]
bun run .agents/skills/michaelpage-search/cli/src/cli.ts detail <id|url> [--format json|plain]
```

### Search flags

- `-q, --query <text>` — free-text keywords. Optional.
- `-l, --location <place>` — city or province (client-side filter).
- `--remote` — client-side filter for remote offers.
- `--jobage <days>` — client-side filter for jobs posted within N days.
- `--page <n>` — page (1-indexed). Default 1.
- `-n, --limit <n>` — cap results emitted (client-side).
- `--format <fmt>` — `json` (default), `table`, or `plain`.

### Detail flags

- `--format <fmt>` — `json` (default) or `plain`.

`<id|url>` accepts the `jn-...` ref from a search result or the full
`https://www.michaelpage.es/job-detail/<slug>/ref/<ref>` URL (or the
shortcut `https://www.michaelpage.es/job-detail/ref/<ref>`).

## Output

Search JSON is `{ "meta": { "count", "total", "page", "perPage", "query", "location" }, "results": [...] }`.
Each result carries `id`, `title`, `company`, `location`, `date` (null on search), `url`, `excerpt`, `salary` (null), `contract` and `remote`.

Detail JSON adds `description` (plain text), `employmentType`, `isActive`, `deadline` and `applyUrl`.

## Notes

- `date` is filled on detail from `datePosted` (ISO `YYYY-MM-DD`).
- `isActive` is `false` only when `validThrough` is in the past.
- Search cards do not include a posting date; use `detail` for it.
