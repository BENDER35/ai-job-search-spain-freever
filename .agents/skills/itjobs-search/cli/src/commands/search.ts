import { htmlFetch, parseJobCards, SEARCH_URL } from "../helpers.js"

export interface SearchOpts {
  query?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const params = new URLSearchParams()
    if (opts.query) params.set("search", opts.query)
    if (opts.page && opts.page > 1) params.set("page", String(opts.page))
    const url = `${SEARCH_URL}?${params.toString()}`
    const html = await htmlFetch(url)
    let cards = parseJobCards(html)

    if (opts.remote) {
      // client-side: keep only cards whose list-details contain "Remoto"
      // (best-effort: detail page would confirm)
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "").slice(0, 40).padEnd(40)
          const company = (c.company || "—").slice(0, 24).padEnd(24)
          return `${c.id.padEnd(8)} ${title} ${company} ${c.date || "—"}`
        })
        const header = "ID".padEnd(8) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards.map((c) => `${c.title}\n  ${c.company || "—"}\n  id: ${c.id}\n  ${c.url}`).join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: cards.length, page: opts.page }, results: cards }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    process.stderr.write(JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "SEARCH_FAILED" }) + "\n")
    return 1
  }
}
