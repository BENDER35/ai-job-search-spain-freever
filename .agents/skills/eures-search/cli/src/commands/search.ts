import { searchEures } from "../helpers.js"

export interface SearchOpts {
  query?: string
  country?: string
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const cards = await searchEures({
      query: opts.query,
      country: opts.country,
      jobage: opts.jobage,
      page: opts.page,
      limit: opts.limit,
    })

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "").slice(0, 38).padEnd(38)
          const company = (c.company || "—").slice(0, 22).padEnd(22)
          const loc = (c.location || "—").slice(0, 20).padEnd(20)
          return `${c.id.slice(0, 18).padEnd(18)} ${title} ${company} ${loc} ${c.date || "—"}`
        })
        const header = "ID".padEnd(18) + " TITLE".padEnd(39) + "COMPANY".padEnd(23) + "LOC".padEnd(21) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards.map((c) => `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`).join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(JSON.stringify({ meta: { count: cards.length, page: opts.page, total: cards.length, perPage: 50 }, results: cards }, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    process.stderr.write(JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "SEARCH_FAILED" }) + "\n")
    return 1
  }
}
