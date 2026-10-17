#!/usr/bin/env bun
import { runSearch, type SearchOpts } from "./commands/search.js"
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

const HELP = `jobrapido-search — search jobs on Jobrapido Spain (es.jobrapido.com)

USAGE
  bun run src/cli.ts search [flags]
  bun run src/cli.ts detail <id|url> [--format json|plain]

SEARCH FLAGS
  -q, --query <text>       Keywords - job title, skill or company (e.g. Recepcionista,
                           "camarero de piso", "desarrollador java"). Optional.
  -l, --location <place>   City or province (e.g. Madrid, Barcelona, Valencia). Optional.
                           At least one of --query / --location is required.
  --remote                 Filter remote offers (client-side).
  --jobage <days>          Client-side filter for jobs posted within N days.
  --page <n>               Only page 1 is available; pagination is disallowed by
                           robots.txt, so --page > 1 returns an error.
  -n, --limit <n>          Cap results (client-side).
  --format <fmt>           json (default) | table | plain.

DETAIL FLAGS
  --format <fmt>           json (default) | plain.

NOTE
  Only the first page of results is reachable: Jobrapido's ?p= / ?o= pagination
  params are disallowed by robots.txt. See SKILL.md for the personal-use warning.
`

const KNOWN_FLAGS: Record<string, Set<string>> = {
  search: new Set(["query", "location", "remote", "jobage", "page", "limit", "format", "help", "h"]),
  detail: new Set(["format", "help", "h"]),
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  const flags = parseFlags(argv)
  const cmd = (flags._ as string[])[0]

  if (!cmd || flags.help || flags.h) {
    process.stdout.write(HELP)
    return cmd ? 0 : 1
  }

  const knownFlags = KNOWN_FLAGS[cmd]
  if (knownFlags) {
    for (const key of Object.keys(flags)) {
      if (key === "_" || knownFlags.has(key)) continue
      process.stderr.write(
        JSON.stringify({ error: `unknown flag --${key} for '${cmd}'`, code: "UNKNOWN_FLAG" }) + "\n",
      )
      return 1
    }
  }

  if (cmd === "search") {
    const fmt = flags.format !== undefined ? String(flags.format) : "json"
    if (!["json", "table", "plain"].includes(fmt)) {
      process.stderr.write(
        JSON.stringify(
          { error: `--format must be one of json|table|plain, got "${fmt}"`, code: "BAD_ARG" },
        ) + "\n",
      )
      return 1
    }
    const jobage = flags.jobage !== undefined ? Number(flags.jobage) : 0
    if (flags.jobage !== undefined && (isNaN(jobage) || jobage < 0)) {
      process.stderr.write(
        JSON.stringify({ error: `--jobage must be a number >= 0`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }
    const page = flags.page !== undefined ? Number(flags.page) : 1
    if (flags.page !== undefined && (!Number.isInteger(page) || page < 1)) {
      process.stderr.write(
        JSON.stringify({ error: `--page must be an integer >= 1`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }
    const limit = flags.limit !== undefined ? Number(flags.limit) : undefined
    if (flags.limit !== undefined && (isNaN(limit as number) || (limit as number) < 0)) {
      process.stderr.write(
        JSON.stringify({ error: `--limit must be a number >= 0`, code: "BAD_ARG" }) + "\n",
      )
      return 1
    }
    const opts: SearchOpts = {
      query: typeof flags.query === "string" ? flags.query : undefined,
      location: typeof flags.location === "string" ? flags.location : undefined,
      remote: flags.remote !== undefined,
      jobage,
      page,
      limit,
      format: fmt as SearchOpts["format"],
    }
    return runSearch(opts)
  } else if (cmd === "detail") {
    const id = (flags._ as string[])[1]
    if (!id) {
      process.stderr.write(
        JSON.stringify({ error: "detail requires <id|url>", code: "BAD_ID" }) + "\n",
      )
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
  } else {
    process.stderr.write(
      JSON.stringify({ error: `unknown command '${cmd}'`, code: "UNKNOWN_COMMAND" }) + "\n",
    )
    return 1
  }
}

main().then((code) => process.exit(code))
