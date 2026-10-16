# infojobs-cli

CLI for searching jobs on **[InfoJobs](https://www.infojobs.net)** — Spain's largest
job board — through its **official public REST API**.

**Data source**: the InfoJobs public API (`https://api.infojobs.net`) — search
(`GET /api/9/offer`) and detail (`GET /api/7/offer/{offerId}`).
**Authentication**: every call is authenticated with an app client id + secret
(HTTP Basic). Free app registration at
[developer.infojobs.net](https://developer.infojobs.net).
**Dependencies**: none (plain `bun` + `fetch`). `bun install` only pulls dev type defs.

> **Credentials live in the environment, never in the repo.** Set
> `INFOJOBS_CLIENT_ID` and `INFOJOBS_CLIENT_SECRET` before running the CLI. If either
> is unset the CLI exits `1` with `MISSING_CREDENTIALS` **before** making any request.

## Installation

```bash
cd .agents/skills/infojobs-search/cli
bun install   # optional — only installs TypeScript dev types
```

The CLI runs without any install because it has zero runtime dependencies.

## Setup

1. Log in at [developer.infojobs.net](https://developer.infojobs.net) with your
   InfoJobs account and register an application to get a **Client ID** and
   **Client Secret**.
2. Export them for your shell session (or put them in a git-ignored `.env` you
   `source` yourself):

   ```bash
   export INFOJOBS_CLIENT_ID="your-client-id"
   export INFOJOBS_CLIENT_SECRET="your-client-secret"
   ```

3. Run a search (see below). The API is free to use within InfoJobs' documented
   rate limits; keep request volume low.

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
# Python developer roles, first 5 in a table
bun run src/cli.ts search -q "desarrollador python" --limit 5 --format table

# Python roles in Madrid
bun run src/cli.ts search -q python -l Madrid --format table

# Fully-remote data engineer roles published in the last 7 days
bun run src/cli.ts search -q "data engineer" --remote remote --jobage 7 --format json

# Full detail for one posting (pass the id or url from search output)
bun run src/cli.ts detail 258eae420249ffa67cf64681a2ef80 --format plain
```

See `../SKILL.md` for the full flag reference and `../url-reference.md` for the
endpoint documentation.

## Search flags

| Flag | Alias | Description |
|------|-------|-------------|
| `--query` | `-q` | Keywords (title / skill / role). |
| `--location` | `-l` | Province name (`"Madrid"`, `"Barcelona"`, `"Málaga"`, `"A Coruña"`, `"Illes Balears"`); maps to the API's province key. |
| `--remote` | | `remote` \| `hybrid` \| `onsite` (maps to `teleworking`). |
| `--jobage` | | Published within N days (`sinceDate`: 1, 7, 15-day buckets, narrowed client-side). |
| `--page` | | 1-indexed page. |
| `--limit` | `-n` | Results to request from the API (`maxResults`, max 50). Default 20. |
| `--format` | | `json` \| `table` \| `plain`. |

## Detail argument

`detail` accepts the `id` from a `search` result (a ~30-char hex offer id) or a
full `https://www.infojobs.net/.../of-i<id>` offer URL. Any other host is
rejected with `BAD_ID`, so an external apply link is never fetched.
