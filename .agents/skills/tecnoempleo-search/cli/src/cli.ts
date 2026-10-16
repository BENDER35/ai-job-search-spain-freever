#!/usr/bin/env bun
// Self-contained CLI for searching jobs on Tecnoempleo (tecnoempleo.com),
// Spain's main IT/telecom job board. No external CLI framework, so it runs
// anywhere `bun` is available with zero runtime dependencies.
//
// Personal use only. Tecnoempleo's robots.txt allows ordinary crawlers on
// /ofertas-trabajo/... but disallows known AI crawler user-agents (AnthropicBot,
// Claude, GPTBot, ...). This CLI sends the honest repo-convention UA
// "Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)" and keeps volume low.

import { runSearch, resolveLocation, type SearchOpts } from "./commands/search.js"
import { runDetail, type DetailOpts } from "./commands/detail.js"
import { provinceNames, workModeFlag } from "./helpers.js"

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

const HELP = `tecnoempleo-cli — search jobs on Tecnoempleo (Spain, IT/telecom)

USAGE
  bun run src/cli.ts search [--query "<keywords>"] [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  --query, -q <text>      Keywords (job title, skill, role), e.g. "desarrollador python".
  --location, -l <place>  Province name or numeric code (231-282), e.g. "Madrid",
                          "Barcelona", "Málaga", "263". Filters by the portal's pr param.
  --remote <mode>         remote | onsite | hybrid (maps to the portal's en_remoto filter).
  --jobage <days>         Keep postings published within N days (client-side). N=1 also
                          sets the portal's own "last 24h" filter.
  --page <n>              1-indexed page (30 results/page). Default 1.
  --limit, -n <n>         Cap results emitted (client-side).
  --format <fmt>          json (default) | table | plain.

DETAIL
  <id|url>                The "url" or "id" from a search result (a path such as
                          "slug/skills/rf-<hash>", or a full tecnoempleo.com URL).
                          A bare rf-<hash> cannot be resolved without its slug.

EXAMPLES
  bun run src/cli.ts search -q "desarrollador python" --limit 5 --format table
  bun run src/cli.ts search -q python -l Madrid --format table
  bun run src/cli.ts search -q "data engineer" --remote remote --jobage 7 --format json
  bun run src/cli.ts detail "desarrollador-python-sobre-gcp-arelance/cloud-git/rf-478e15e942b7f396ba44" --format plain

Personal use only. Source: Tecnoempleo public pages. Keep volume low; the portal
blocks known AI crawler user-agents, so do not bulk-collect.
`

// Long-form flag names each command accepts (parseFlags resolves the short
// aliases q/l/n to these before validation). "help"/"h" pass so `search --help`
// still prints usage.
const KNOWN_FLAGS: Record<string, Set<string>> = {
  search: new Set(["query", "location", "remote", "jobage", "page", "limit", "format", "help", "h"]),
  detail: new Set(["format", "help", "h"]),
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
  // filter changes what the search returns with no error. add-portal.md's
  // contract requires a bogus flag to exit 1 with a JSON error on stderr.
  const knownFlags = KNOWN_FLAGS[cmd]
  if (knownFlags) {
    for (const key of Object.keys(flags)) {
      if (key === "_" || knownFlags.has(key)) continue
      process.stderr.write(
        JSON.stringify({
          error: `unknown flag --${key} for '${cmd}' - flags are never silently ignored, because a discarded filter changes what the search returns; see --help for the supported flags`,
          code: "UNKNOWN_FLAG",
        }) + "\n",
      )
      return 1
    }
  }

  if (cmd === "search") {
    const fmt = flags.format !== undefined ? String(flags.format) : "json"
    if (!["json", "table", "plain"].includes(fmt)) {
      process.stderr.write(
        JSON.stringify({ error: `--format must be one of json|table|plain, got "${fmt}"`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }

    for (const name of ["jobage", "page", "limit"] as const) {
      if (flags[name] !== undefined) {
        const v = parseIntFlag(name, flags[name])
        if (v === null) return 1
        flags[name] = String(v)
      }
    }

    let province: number | undefined
    let locationText: string | undefined
    if (typeof flags.location === "string") {
      const code = resolveLocation(flags.location)
      if (code === null) {
        process.stderr.write(
          JSON.stringify({
            error: `unknown province "${flags.location}" for --location; pass a province name (e.g. "Madrid", "Barcelona", "Málaga") or a code 231-282. Known provinces: ${provinceNames().join(", ")}`,
            code: "BAD_ARG",
          }) + "\n",
        )
        return 1
      }
      province = code
      locationText = flags.location
    }

    const remote = typeof flags.remote === "string" ? flags.remote : undefined
    if (remote !== undefined && workModeFlag(remote) === null) {
      process.stderr.write(
        JSON.stringify({ error: `--remote must be one of remote|onsite|hybrid, got "${remote}"`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }

    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      province,
      locationText,
      remote,
      jobage: flags.jobage ? parseInt(flags.jobage as string, 10) : 9999,
      page: flags.page ? Math.max(1, parseInt(flags.page as string, 10)) : 1,
      limit: flags.limit ? parseInt(flags.limit as string, 10) : undefined,
      format: fmt as SearchOpts["format"],
    }
    return runSearch(opts)
  }

  if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(JSON.stringify({ error: "detail requires an <id|url>", code: "NO_ID" }) + "\n")
      return 1
    }
    const fmt = flags.format !== undefined ? String(flags.format) : "json"
    if (!["json", "plain"].includes(fmt)) {
      process.stderr.write(
        JSON.stringify({ error: `--format must be one of json|plain, got "${fmt}"`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }
    const opts: DetailOpts = { id, format: fmt as DetailOpts["format"] }
    return runDetail(opts)
  }

  process.stderr.write(JSON.stringify({ error: `Unknown command "${cmd}"`, code: "BAD_CMD" }) + "\n")
  return 1
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
