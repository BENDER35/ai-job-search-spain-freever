import { htmlFetch, parseSearch, BASE } from "../helpers.js"

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
  if (opts.query && opts.query.trim()) params.set("query", opts.query.trim())
  if (opts.page > 1) params.set("page", String(opts.page))
  const qs = params.toString()
  return qs ? `${BASE}/jobs?${qs}` : `${BASE}/jobs`
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    const parsed = parseSearch(html)
    let cards = parsed.cards
    if (opts.location && opts.location.trim()) {
      const loc = opts.location.toLowerCase()
      cards = cards.filter((c) => (c.location || "").toLowerCase().includes(loc))
    }
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
        const header = "ID".padEnd(40) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOCATION".padEnd(21) + " CONTRACT"
        const rows = cards.map((c) => {
          const title = (c.title ?? "-").slice(0, 38).padEnd(38)
          const company = (c.company ?? "-").slice(0, 22).padEnd(22)
          const location = (c.location ?? "-").slice(0, 18).padEnd(18)
          return `${c.id.padEnd(40)} ${title} ${company} ${location} ${c.contract ?? "-"}`
        })
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      const lines = cards.map((c) => {
        const meta = [c.company || "-", c.location || "-", c.contract || "-"]
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
              total: parsed.cards.length,
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
