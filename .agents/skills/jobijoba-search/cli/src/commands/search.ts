import { htmlFetch, parseSearch, QUERY_PATH } from "../helpers.js"

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
  const parts: string[] = []
  if (opts.query && opts.query.trim()) parts.push(`what=${encodeURIComponent(opts.query.trim())}`)
  if (opts.location && opts.location.trim())
    parts.push(`where=${encodeURIComponent(opts.location.trim())}`)
  if (opts.page > 1) parts.push(`page=${opts.page}`)
  return parts.length ? `${QUERY_PATH}?${parts.join("&")}` : QUERY_PATH
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    const parsed = parseSearch(html)
    let cards = parsed.cards

    if (opts.remote) cards = cards.filter((c) => c.remote === true)
    if (opts.jobage > 0) {
      const cutoff = new Date(Date.now() - opts.jobage * 86400000).toISOString().slice(0, 10)
      cards = cards.filter((c) => !c.date || c.date >= cutoff)
    }
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (!cards.length) {
        process.stdout.write("No results\n")
      } else {
        const header =
          "ID".padEnd(40) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOCATION".padEnd(21) + " DATE"
        const rows = cards.map((c) => {
          const title = (c.title ?? "-").slice(0, 38).padEnd(38)
          const company = (c.company ?? "-").slice(0, 22).padEnd(22)
          const location = (c.location ?? "-").slice(0, 18).padEnd(18)
          return `${c.id.padEnd(40)} ${title} ${company} ${location} ${c.date ?? "-"}`
        })
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      const lines = cards.map((c) => {
        const meta = [c.company || "-", c.location || "-", c.date || "-"]
        if (c.jobFunction) meta.push(c.jobFunction)
        if (c.remote) meta.push("teletrabajo")
        const out = [`${c.title}`, `  ${meta.join(" · ")}`, `  id: ${c.id}`]
        if (c.excerpt) out.push(`  ${c.excerpt}`)
        out.push(`  ${c.url}`)
        return out.join("\n")
      })
      process.stdout.write(lines.join("\n\n") + "\n")
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: cards.length,
              total: parsed.total,
              heading: parsed.heading,
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
      JSON.stringify({ error: e instanceof Error ? e.message : String(e), code: "SEARCH_FAILED" }) +
        "\n",
    )
    return 1
  }
}
