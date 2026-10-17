import { fetchListing, fold, PAGE_SIZE, type TlpJobCard } from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string
  sector?: string
  remote?: boolean
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

// The portal publishes no posting date, so results are ordered by application
// deadline (soonest first); entries without a stated deadline go last.
export function sortByDeadline(cards: TlpJobCard[]): TlpJobCard[] {
  return [...cards].sort((a, b) => {
    if (a.deadline && b.deadline) return a.deadline < b.deadline ? -1 : a.deadline > b.deadline ? 1 : 0
    if (a.deadline) return -1
    if (b.deadline) return 1
    return 0
  })
}

function searchableText(card: TlpJobCard): string {
  return fold(
    `${card.title ?? ""} ${card.company ?? ""} ${card.sector ?? ""} ${card.location ?? ""}`,
  )
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    let cards = await fetchListing()

    if (opts.query) {
      const terms = opts.query.split(/\s+/).filter(Boolean).map(fold)
      if (terms.length) {
        cards = cards.filter((c) => {
          const haystack = searchableText(c)
          return terms.every((term) => haystack.includes(term))
        })
      }
    }

    if (opts.location) {
      const loc = fold(opts.location)
      cards = cards.filter((c) => searchableText(c).includes(loc))
    }

    if (opts.sector) {
      const sec = fold(opts.sector)
      cards = cards.filter((c) => fold(c.sector ?? "").includes(sec))
    }

    if (opts.remote) cards = cards.filter((c) => c.remote === true)

    const total = cards.length
    cards = sortByDeadline(cards)

    const start = (opts.page - 1) * PAGE_SIZE
    cards = cards.slice(start, start + PAGE_SIZE)

    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      if (cards.length === 0) {
        process.stdout.write("No results.\n")
      } else {
        const rows = cards.map((c) => {
          const id = (c.id || "").slice(0, 26).padEnd(26)
          const title = (c.title || "").slice(0, 46).padEnd(46)
          const loc = (c.location || "—").slice(0, 22).padEnd(22)
          return `${id} ${title} ${loc} ${c.deadline || "—"}`
        })
        const header =
          "ID".padEnd(26) + " TITLE".padEnd(47) + "LOCATION".padEnd(23) + " DEADLINE"
        process.stdout.write([header, "-".repeat(header.length), ...rows].join("\n") + "\n")
      }
    } else if (opts.format === "plain") {
      process.stdout.write(
        cards
          .map(
            (c) =>
              `${c.title}\n  ${c.company || "—"} · ${c.location || "—"} · plazo: ${c.deadline || "—"}\n  sector: ${c.sector || "—"}\n  id: ${c.id}\n  ${c.url}`,
          )
          .join("\n\n") + "\n",
      )
    } else {
      process.stdout.write(
        JSON.stringify(
          {
            meta: {
              count: cards.length,
              page: opts.page,
              perPage: PAGE_SIZE,
              total,
              query: opts.query ?? null,
              location: opts.location ?? null,
              sector: opts.sector ?? null,
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
      JSON.stringify({
        error: e instanceof Error ? e.message : String(e),
        code: "SEARCH_FAILED",
      }) + "\n",
    )
    return 1
  }
}
