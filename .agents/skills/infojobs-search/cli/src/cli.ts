#!/usr/bin/env bun
// Self-contained CLI for searching jobs on InfoJobs (infojobs.net), Spain's
// largest job board, through its official public REST API. No external CLI
// framework and zero runtime dependencies, so it runs anywhere `bun` is.
//
// Every call is authenticated. The app credentials are read ONLY from the
// environment (INFOJOBS_CLIENT_ID / INFOJOBS_CLIENT_SECRET, free app
// registration at https://developer.infojobs.net); if they are unset the CLI
// exits MISSING_CREDENTIALS before making any request.

import { runSearch, normalizeLocation, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"

interface Flags {
  _: string[]
  [k: string]: string | boolean | string[]
}

function parseFlags(argv: string[]): Flags {
  const flags: Flags = { _: [] }
  const alias: Record<string, string> = { q: "query", l: "location", n: "limit" }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a.startsWith("--") || a.startsWith("-")) {
      const key = alias[a.replace(/^-+/, "")] ?? a.replace(/^-+/, "")
      const next = argv[i + 1]
      if (next === undefined || next.startsWith("-")) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else {
      ;(flags._ as string[]).push(a)
    }
  }
  return flags
}

const HELP = `infojobs-cli — search jobs on InfoJobs (Spain) via its official public API

USAGE
  bun run src/cli.ts search [--query "<keywords>"] [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, role), e.g. "desarrollador python".
  --location, -l <place>  Province name, e.g. "Madrid", "Barcelona", "Málaga",
                          "A Coruña", "Illes Balears". Maps to the API's province key.
  --remote <mode>         remote | hybrid | onsite (maps to the API's teleworking filter).
  --jobage <days>         Keep postings published within N days (maps to the API's
                          sinceDate buckets, narrowed client-side to the exact window).
                          Allowed buckets: 1 day, 7 days, 15 days.
  --page <n>              1-indexed page. Default 1.
  --limit, -n <n>         Results to request from the API (maxResults, max 50). Default 20.
  --format <fmt>          json (default) | table | plain.

DETAIL
  <id|url>                The "id" from a search result (e.g.
                          "258eae420249ffa67cf64681a2ef80") or a full
                          https://www.infojobs.net/.../of-i<id> offer URL.

EXAMPLES
  bun run src/cli.ts search -q "desarrollador python" --limit 5 --format table
  bun run src/cli.ts search -q python -l Madrid --format table
  bun run src/cli.ts search -q "data engineer" --remote remote --jobage 7 --format json
  bun run src/cli.ts detail 258eae420249ffa67cf64681a2ef80 --format plain

Credentials: set INFOJOBS_CLIENT_ID and INFOJOBS_CLIENT_SECRET (free app
registration at https://developer.infojobs.net). Source: the InfoJobs public
REST API (https://api.infojobs.net). Keep request volume low.
`

// Long-form flag names each command accepts (parseFlags resolves the short
// aliases q/l/n to these before validation). "help"/"h" pass so `search --help`
// still prints usage.
const KNOWN_FLAGS: Record<string, Set<string>> = {
  search: new Set(["query", "location", "remote", "jobage", "page", "limit", "format", "help", "h"]),
  detail: new Set(["format", "help", "h"]),
}

const REMOTE_MODES = new Set(["remote", "hybrid", "onsite"])

function fail(error: string, code: string): number {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
  return 1
}

function parseIntFlag(name: string, raw: string | boolean | string[]): number | null {
  const val = typeof raw === "string" ? Number(raw.trim()) : NaN
  if (!Number.isInteger(val) || val < 1) {
    process.stderr.write(
      JSON.stringify({ error: `--${name} must be a whole number of at least 1, got "${raw}"`, code: "BAD_ARG" }) + "\n",
    )
    return null
  }
  return val
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  // Reject unknown flags instead of silently discarding them: a discarded
  // filter changes what the search returns with no error. The portal-skill
  // contract requires a bogus flag to exit 1 with a JSON error on stderr.
  const knownFlags = KNOWN_FLAGS[cmd]
  if (knownFlags) {
    for (const key of Object.keys(flags)) {
      if (key === "_" || knownFlags.has(key)) continue
      return fail(
        `unknown flag --${key} for '${cmd}' - flags are never silently ignored, because a discarded filter changes what the search returns; see --help for the supported flags`,
        "UNKNOWN_FLAG",
      )
    }
  }

  if (cmd === "search") {
    const fmt = flags.format !== undefined ? String(flags.format) : "json"
    if (!["json", "table", "plain"].includes(fmt)) {
      return fail(`--format must be one of json|table|plain, got "${fmt}"`, "BAD_ARG")
    }

    for (const name of ["jobage", "page", "limit"] as const) {
      if (flags[name] !== undefined) {
        const v = parseIntFlag(name, flags[name])
        if (v === null) return 1
        flags[name] = String(v)
      }
    }

    let location: string | undefined
    if (typeof flags.location === "string") {
      if (normalizeLocation(flags.location) === null) {
        return fail(`--location must not be blank`, "BAD_ARG")
      }
      location = flags.location
    }

    const remote = typeof flags.remote === "string" ? flags.remote : undefined
    if (remote !== undefined && !REMOTE_MODES.has(remote)) {
      return fail(`--remote must be one of remote|hybrid|onsite, got "${remote}"`, "BAD_ARG")
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location,
      remote,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : 20,
      format: fmt as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) return fail("detail requires an <id|url>", "NO_ID")
    const fmt = flags.format !== undefined ? String(flags.format) : "json"
    if (!["json", "plain"].includes(fmt)) {
      return fail(`--format must be one of json|plain, got "${fmt}"`, "BAD_ARG")
    }
    const opts: DetailOpts = { id, format: fmt as DetailOpts["format"] }
    return runDetail(opts)
  }

  return fail(`Unknown command "${cmd}"`, "BAD_CMD")
}

main()
  .then((code) => process.exit(code))
  .catch((e) => {
    process.stderr.write(
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "INTERNAL_ERROR",
      }) + "\n",
    )
    process.exit(1)
  })
