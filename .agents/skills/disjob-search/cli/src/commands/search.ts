import { postSearch, parseJobCards } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  sector?: string
  province?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await postSearch(opts.query || "", opts.sector || "0", opts.province || "0", opts.remote || false)
    let cards = parseJobCards(html)

    // Remote filter client-side if needed
    if (opts.remote !== undefined) {
      // already all returned; keep for future extension
    }

    // jobage client-side filter
    if (opts.jobage && opts.jobage > 0) {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - opts.jobage)
      cards = cards.filter((c) => {
        if (!c.date) return true
        const d = new Date(c.date)
        return isNaN(d.getTime()) ? true : d >= cutoff
      })
    }

    // location filter client-side (province/city substring)
    if (opts.location) {
      const loc = opts.location.toLowerCase()
      cards = cards.filter((c) => (c.location || "").toLowerCase().includes(loc) || (c.location || "").toLowerCase().includes(loc.replace(/\s+/g, "")))
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "").slice(0, 40).padEnd(40)
          const company = (c.company || "—").slice(0, 24).padEnd(24)
          const loc = (c.location || "—").slice(0, 18).padEnd(18)
          const date = c.date || "—"
          return `${c.id.padEnd(10)} ${title} ${company} ${loc} ${date}`
        })
        const header = "ID".padEnd(10) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOG".padEnd(19) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) => `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page, total: cards.length, perPage: 20 }, results: cards },
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
