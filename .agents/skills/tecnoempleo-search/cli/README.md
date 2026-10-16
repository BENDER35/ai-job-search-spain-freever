# tecnoempleo-cli

CLI for searching jobs on **[Tecnoempleo](https://www.tecnoempleo.com)** — Spain's main
IT / telecom job board.

**Data source**: Tecnoempleo's server-rendered search pages (`/ofertas-trabajo/`) and job
detail pages (`/<slug>/<skills>/rf-<hash>`).
**Authentication**: None required.
**Dependencies**: None (plain `bun` + `fetch` + regex). `bun install` only pulls dev type defs.

> **⚠️ Personal use only.** robots.txt allows ordinary crawlers on `/ofertas-trabajo/...`,
> but **explicitly disallows known AI crawler user-agents** (AnthropicBot, Claude, GPTBot, …).
> This CLI sends the honest repo-convention UA
> `Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)`. Keep volume low — a handful of requests
> per run, no bulk or commercial use. Run it on your own responsibility.

## Installation

```bash
cd .agents/skills/tecnoempleo-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Commands

| Command | Description |
|---------|-------------|
| `search` | Search job listings |
| `detail` | Fetch full detail for one listing |

`search` accepts `--format json|table|plain` (default `json`); `detail` accepts
`--format json|plain`. All errors are written to **stderr** as
`{ "error": "...", "code": "..." }` with exit code `1`.

## Quick examples

```bash
# Python developer roles, last 5 in a table
bun run src/cli.ts search -q "desarrollador python" --limit 5 --format table

# Python roles in Madrid
bun run src/cli.ts search -q python -l Madrid --format table

# Fully-remote data engineer roles published in the last 7 days
bun run src/cli.ts search -q "data engineer" --remote remote --jobage 7 --format json

# Full detail for one posting (pass the url or id from search output)
bun run src/cli.ts detail "desarrollador-python-sobre-gcp-arelance/cloud-git/rf-478e15e942b7f396ba44" --format plain
```

See `../SKILL.md` for the full flag reference and the personal-use note, and
`../url-reference.md` for the parsing anchors.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keywords (title / skill / role). |
| `--location` | `-l` | Province name or numeric code (231–282), e.g. `"Madrid"`, `"Málaga"`, `"263"`. |
| `--remote` | | `remote` \| `onsite` \| `hybrid`. |
| `--jobage` | | Keep postings published within N days (client-side; N=1 also sets the portal's 24h filter). |
| `--page` | | 1-indexed page (30 results/page). |
| `--limit` | `-n` | Cap results emitted (client-side). |
| `--format` | | `json` \| `table` \| `plain`. |

## Detail argument

`detail` accepts the `url` or `id` from a `search` result. The `id` is the URL path after
the host (`slug/skills/rf-<hash>`). A bare `rf-<hash>` cannot be resolved, because the
slug segment is required to fetch the page.
