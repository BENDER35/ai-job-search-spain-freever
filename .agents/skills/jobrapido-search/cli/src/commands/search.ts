import { htmlFetch, parseJobCards, SEARCH_PATH } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  remote?: boolean
  jobage: number
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

// The SEO path is a plain text segment, so characters that would break the path
// (`/`, `?`, `#`, `%`, `&`, `+`) are folded into single hyphens. Spaces stay as
// spaces and are percent-encoded below, which is what Jobrapido expects.
function seoTerm(input: string): string {
  return input
    .trim()
    .replace(/[/?#%&+]+/g, "-")
    .replace(/\s+/g, " ")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
}

function buildUrl(opts: SearchOpts): string | null {
  const q = opts.query ? seoTerm(opts.query) : ""
  const loc = opts.location ? seoTerm(opts.location) : ""
  if (q && loc) return `${SEARCH_PATH}-para-${encodeURIComponent(q)}-en-${encodeURIComponent(loc)}`
  if (q) return `${SEARCH_PATH}-para-${encodeURIComponent(q)}`
  if (loc) return `${SEARCH_PATH}-en-${encodeURIComponent(loc)}`
  return null
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    // Jobrapido's homepage lists offers client-side only; a bare search returns
    // nothing parseable. Require at least one filter.
    const url = buildUrl(opts)
    if (!url) {
      process.stderr.write(
        JSON.stringify({
          error: "jobrapido search requires --query and/or --location",
          code: "BAD_ARG",
        }) + "\n",
      )
      return 1
    }

    // robots.txt disallows Jobrapido's `?p=` pagination param (and `?o=`), so
    // only the first page of results is reachable. Fail loudly rather than
    // silently returning page 1.
    if (opts.page > 1) {
      process.stderr.write(
        JSON.stringify({
          error:
            "jobrapido does not support --page > 1: its pagination params are disallowed by robots.txt. " +
            "Use --jobage/--limit to narrow the first page instead.",
          code: "PAGE_UNSUPPORTED",
        }) + "\n",
      )
      return 1
    }

    const html = await htmlFetch(url)
    const parsed = parseJobCards(html)
    let cards = parsed.cards

    if (opts.remote) cards = cards.filter((c) => c.remote === true)

    if (opts.jobage > 0) {
      const cutoff = new Date(Date.now() - opts.jobage * 86400000).toISOString().slice(0, 10)
      cards = cards.filter((c) => !c.date || c.date >= cutoff)
    }

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const title = (c.title || "-").slice(0, 40).padEnd(40)
          const company = (c.company || "-").slice(0, 24).padEnd(24)
          const loc = (c.location || "-").slice(0, 22).padEnd(22)
          return `${c.id.padEnd(20)} ${title} ${company} ${loc} ${c.date || "-"}`
        })
        const header =
          "ID".padEnd(20) + " TITLE".padEnd(41) + "COMPANY".padEnd(25) + "LOCATION".padEnd(23) + " DATE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map((c) => {
            const meta = [c.company || "-", c.location || "-", c.date || "-"]
            if (c.source) meta.push(`via ${c.source}`)
            if (c.sponsored) meta.push("sponsored")
            if (c.remote) meta.push("remote")
            return `${c.title}\n  ${meta.join(" · ")}\n  id: ${c.id}\n  ${c.url}`
          })
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: cards.length,
              total: parsed.total || null,
              page: 1,
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
