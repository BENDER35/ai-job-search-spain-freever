import { htmlFetch, parseJobCards, SEARCH_BASE, DEFAULT_LOCATION } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("k", opts.query)
  params.set("l", opts.location || DEFAULT_LOCATION)
  if (opts.page > 1) params.set("p", String(opts.page))
  return `${SEARCH_BASE}?${params.toString()}`
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const url = buildUrl(opts)
    const html = await htmlFetch(url)
    const parsed = parseJobCards(html)
    let cards = parsed

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
          const title = (c.title || "").slice(0, 38).padEnd(38)
          const company = (c.company || "—").slice(0, 22).padEnd(22)
          const loc = (c.location || "—").slice(0, 24).padEnd(24)
          return `${c.id.padEnd(21)} ${title} ${company} ${loc} ${c.date || "—"}`
        })
        const header =
          "ID".padEnd(21) + " TITLE".padEnd(39) + "COMPANY".padEnd(23) + "LOCATION".padEnd(25) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}${c.remote ? " · remote" : ""}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: cards.length,
              page: opts.page,
              perPage: parsed.length,
              query: opts.query ?? null,
              location: opts.location ?? DEFAULT_LOCATION,
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
