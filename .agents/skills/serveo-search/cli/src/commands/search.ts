import { htmlFetch, parseJobCards, parseTotal, SEARCH_URL, PAGE_SIZE } from "../helpers.js"

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
  params.set("q", opts.query ?? "")
  if (opts.location) params.set("locationsearch", opts.location)
  if (opts.page > 1) params.set("startrow", String((opts.page - 1) * PAGE_SIZE))
  return `${SEARCH_URL}?${params.toString()}`
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const url = buildUrl(opts)
    const html = await htmlFetch(url)
    const total = parseTotal(html)
    let cards = parseJobCards(html)

    if (opts.remote) cards = cards.filter((c) => c.remote === true)

    if (opts.jobage && opts.jobage > 0) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - opts.jobage)
      cards = cards.filter((c) => {
        if (!c.date) return true
        const d = new Date(c.date)
        return isNaN(d.getTime()) ? true : d >= cutoff
      })
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "").slice(0, 40).padEnd(40)
          const loc = (c.location || "—").slice(0, 26).padEnd(26)
          return `${c.id.padEnd(12)} ${title} ${loc} ${c.date || "—"}`
        })
        const header = "ID".padEnd(12) + " TITLE".padEnd(41) + "LOCATION".padEnd(27) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`,
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
              perPage: PAGE_SIZE,
              total,
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
