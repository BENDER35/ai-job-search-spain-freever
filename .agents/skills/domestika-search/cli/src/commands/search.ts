import { htmlFetch, parseJobCards, FEED_URL } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  jobage: number
  limit?: number
  format: "json" | "table" | "plain"
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const feed = await htmlFetch(FEED_URL)
    let cards = parseJobCards(feed)

    // client-side query filter
    if (opts.query) {
      const q = opts.query.toLowerCase()
      cards = cards.filter((c) => (c.title || "").toLowerCase().includes(q) || (c.company || "").toLowerCase().includes(q) || (c.location || "").toLowerCase().includes(q) || (c.url || "").toLowerCase().includes(q))
    }

    // client-side location filter
    if (opts.location) {
      const loc = opts.location.toLowerCase()
      cards = cards.filter((c) => (c.location || "").toLowerCase().includes(loc))
    }

    // jobage
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
          const title = (c.title || "").slice(0, 38).padEnd(38)
          const company = (c.company || "—").slice(0, 22).padEnd(22)
          const loc = (c.location || "—").slice(0, 20).padEnd(20)
          return `${c.id.padEnd(10)} ${title} ${company} ${loc} ${c.date || "—"}`
        })
        const header = "ID".padEnd(10) + " TITLE".padEnd(39) + "COMPANY".padEnd(23) + "LOC".padEnd(21) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map((c) => `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`)
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: 1, total: cards.length, perPage: 50 }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    process.stderr.write(JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "SEARCH_FAILED" }) + "\n")
    return 1
  }
}
