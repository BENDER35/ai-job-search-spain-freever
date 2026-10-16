import { htmlFetch, parseJobCards, UA, SEARCH_URL } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("query", opts.query)
  if (opts.location) params.set("location", opts.location)
  if (opts.jobage >= 1) params.set("fromage", String(opts.jobage))
  params.set("page", String(opts.page))
  return `${SEARCH_URL}?${params.toString()}`
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const url = buildUrl(opts)
    const html = await htmlFetch(url)
    const cards = parseJobCards(html)

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "").slice(0, 38).padEnd(38)
          const company = (c.company || "—").slice(0, 22).padEnd(22)
          const loc = (c.location || "—").slice(0, 20).padEnd(20)
          const date = c.date || "—"
          return `${c.id.padEnd(14)} ${title} ${company} ${loc} ${date}`
        })
        const header =
          "ID".padEnd(14) +
          " " +
          "TITLE".padEnd(38) +
          " " +
          "COMPANY".padEnd(22) +
          " " +
          "LOCATION".padEnd(20) +
          " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page }, results: cards },
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
