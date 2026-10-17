import { htmlFetch, parseSearch, SEARCH_PATH, slugify } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

// Turijobs filters through path segments, not query-string keywords (the query
// params it understands are mostly disallowed by robots.txt). Each segment is
// matched against the board's controlled vocabulary: `--query` against job
// titles / areas / sectors / companies, `--location` against cities / regions.
function buildUrl(opts: SearchOpts): string {
  const segments: string[] = []
  if (opts.query) {
    const slug = slugify(opts.query)
    if (slug) segments.push(slug)
  }
  if (opts.location) {
    const slug = slugify(opts.location)
    if (slug) segments.push(slug)
  }
  let url = segments.length ? `${SEARCH_PATH}/${segments.join("/")}` : SEARCH_PATH
  if (opts.page > 1) url += `?page=${opts.page}`
  return url
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const url = buildUrl(opts)
    const html = await htmlFetch(url)
    const parsed = parseSearch(html)

    // Unrecognised segments are ignored and the full board (>0 total) is
    // returned. An empty result set (e.g. a page past the end) also has no
    // selected facets, so only test the filters when the server returned hits.
    const unmatched: string[] = []
    if (parsed.total > 0) {
      const selected = new Set(parsed.selectedKeys)
      if (opts.query && !selected.has(slugify(opts.query))) unmatched.push(opts.query)
      if (opts.location && !selected.has(slugify(opts.location))) unmatched.push(opts.location)
    }

    // Turijobs silently ignores path segments it does not recognise and returns
    // the whole board instead, so an unmatched term must not dump ~2.500
    // unfiltered offers into the pool. Report it and return nothing.
    if (unmatched.length > 0) {
      const warning =
        `Turijobs did not recognise ${unmatched.map((u) => `"${u}"`).join(", ")} as a job title, area, ` +
        `sector, company, city or region, so the search was not applied.`
      process.stderr.write(
        JSON.stringify({ error: warning, code: "UNMATCHED_FILTER", unmatched }) + "\n",
      )
      if (opts.format === "table" || opts.format === "plain") {
        process.stdout.write("No results.\n")
      } else {
        process.stdout.write(
          JSON.stringify(
            {
              meta: {
                count: 0,
                total: 0,
                pages: 0,
                page: opts.page,
                perPage: parsed.cards.length,
                query: opts.query ?? null,
                location: opts.location ?? null,
                unmatched,
              },
              results: [],
            },
            null,
            2,
          ) + "\n",
        )
      }
      return 0
    }

    let cards = parsed.cards

    if (opts.remote) cards = cards.filter((c) => c.remote === true)

    if (opts.jobage > 0) {
      const cutoff = new Date(Date.now() - opts.jobage * 86400000).toISOString().slice(0, 10)
      cards = cards.filter((c) => !c.date || c.date >= cutoff)
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "-").slice(0, 40).padEnd(40)
          const company = (c.company || "-").slice(0, 24).padEnd(24)
          const loc = (c.location || "-").slice(0, 22).padEnd(22)
          return `${c.id.padEnd(9)} ${title} ${company} ${loc} ${c.date || "-"}`
        })
        const header =
          "ID".padEnd(9) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOCATION".padEnd(23) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map((c) => {
            const meta = [c.company || "-", c.location || "-", c.date || "-"]
            if (c.salary) meta.push(c.salary)
            if (c.remote) meta.push("remote")
            return `${c.title}\n  ${meta.join(" · ")}\n  id: ${c.id}\n  ${c.url}`
          })
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: cards.length,
              total: parsed.total,
              pages: parsed.pages,
              page: opts.page,
              perPage: parsed.cards.length,
              query: opts.query ?? null,
              location: opts.location ?? null,
            },
            results: cards,
          },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    process.stderr.write(
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "SEARCH_FAILED" }) + "\n",
    )
    return 1
  }
}
