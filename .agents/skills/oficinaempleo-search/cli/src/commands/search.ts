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
  const parts: string[] = []
  if (opts.query && opts.query.trim()) {
    const slug = opts.query.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    parts.push(`${BASE}/buscar/ofertas/${encodeURIComponent(slug)}`)
  }
  if (opts.location && opts.location.trim() && !opts.query) {
    const slug = opts.location.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    parts.push(`${BASE}/ofertas-empleo-en/${encodeURIComponent(slug)}`)
  }
  let url = parts.length ? parts[0] : `${BASE}/buscar/ofertas`
  if (opts.page > 1) url += `?page=${opts.page}`
  return url
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    if (!opts.query && !opts.location) {
      process.stderr.write(JSON.stringify({ error: "oficinaempleo search requires --query and/or --location", code: "BAD_ARG" }) + "\n")
      return 1
    }
    const html = await htmlFetch(buildUrl(opts))
    const parsed = parseSearch(html)
    let cards = parsed.cards
    if (opts.location && opts.query) {
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
        const header = "ID".padEnd(12) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOCATION".padEnd(21) + " DATE"
        const rows = cards.map((c) => {
          const title = (c.title ?? "-").slice(0, 38).padEnd(38)
          const company = (c.company ?? "-").slice(0, 22).padEnd(22)
          const location = (c.location ?? "-").slice(0, 18).padEnd(18)
          return `${c.id.padEnd(12)} ${title} ${company} ${location} ${c.date ?? "-"}`
        })
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      const lines = cards.map((c) => {
        const meta = [c.company || "-", c.location || "-", c.date || "-"]
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
