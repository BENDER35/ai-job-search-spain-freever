import { htmlFetch, parseJobCards, SEARCH_BASE } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const city = opts.location || "madrid"
    const url = `${SEARCH_BASE}/${city.toLowerCase().replace(/\s+/g, "-")}${opts.page > 1 ? `?page=${opts.page}` : ""}`
    const html = await htmlFetch(url)
    let cards = parseJobCards(html)

    if (opts.query) {
      const q = opts.query.toLowerCase()
      cards = cards.filter((c) => (c.title || "").toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q) || (c.description || "").toLowerCase().includes(q))
    }

    if (opts.remote) {
      cards = cards.filter((c) => c.remote === true)
    }

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
          const title = (c.title || "").slice(0, 36).padEnd(36)
          const company = (c.company || "—").slice(0, 20).padEnd(20)
          const loc = (c.location || "—").slice(0, 18).padEnd(18)
          return `${c.id.padEnd(10)} ${title} ${company} ${loc} ${c.date || "—"}`
        })
        const header = "ID".padEnd(10) + " TITLE".padEnd(37) + "COMPANY".padEnd(21) + "LOC".padEnd(19) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards.map((c) => `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`).join("\n\n") + "\n",
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
