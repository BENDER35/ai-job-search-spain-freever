import {
  BASE_URL,
  htmlFetch,
  parseJobCards,
  parseTotal,
  provinceCode,
  workModeFlag,
  writeError,
  type JobCard,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  province?: number // resolved province code (231..282), or undefined
  locationText?: string
  remote?: string // "remote" | "onsite" | "hybrid" | "unspecified"
  jobage: number // 9999 means "no freshness window"
  page: number
  limit?: number
  format: "json" | "table" | "plain"
}

const PER_PAGE = 30

/** Build the Tecnoempleo search URL from the options. */
export function buildUrl(opts: SearchOpts): string {
  const params = new URLSearchParams()
  if (opts.query) params.set("te", opts.query)
  // The portal encodes a province selection as a comma-wrapped list: ",263,".
  if (opts.province !== undefined) params.set("pr", `,${opts.province},`)
  const rm = workModeFlag(opts.remote)
  if (rm) params.set("en_remoto", `,${rm},`)
  // The only recency filter the portal exposes is "published in the last 24h".
  if (opts.jobage === 1) params.set("ult_24h", "1")
  if (opts.page > 1) params.set("pagina", String(opts.page))
  const qs = params.toString()
  return qs ? `${BASE_URL}/ofertas-trabajo/?${qs}` : `${BASE_URL}/ofertas-trabajo/`
}

/**
 * Keep postings published within the last `days` days (client-side). The portal
 * has no arbitrary day filter, so this is the only way to honour `--jobage`.
 * A result with no parsed date is kept: absence of a date is not evidence of age.
 */
export function filterByJobage(cards: JobCard[], days: number, now: Date): JobCard[] {
  if (!days || days >= 9999) return cards
  const cutoff = new Date(now.getTime() - days * 86400000).toISOString().slice(0, 10)
  return cards.filter((c) => !c.date || c.date >= cutoff)
}

function renderTable(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  const header =
    "ID".padEnd(30) +
    " " +
    "TITLE".padEnd(38) +
    " " +
    "COMPANY".padEnd(22) +
    " " +
    "LOCATION".padEnd(18) +
    " " +
    "DATE"
  const rows = cards.map((c) => {
    return (
      (c.id.length > 30 ? c.id.slice(0, 30) : c.id).padEnd(30) +
      " " +
      (c.title || "").slice(0, 38).padEnd(38) +
      " " +
      (c.company || "—").slice(0, 22).padEnd(22) +
      " " +
      (c.location || "—").slice(0, 18).padEnd(18) +
      " " +
      (c.date || "—")
    )
  })
  return [header, "-".repeat(header.length), ...rows].join("\n")
}

function renderPlain(cards: JobCard[]): string {
  if (cards.length === 0) return "No results."
  return cards
    .map((c) =>
      [
        c.title,
        `  ${c.company || "—"} · ${c.location || "—"} · ${c.date || "—"}`,
        `  id: ${c.id}`,
        `  ${c.url}`,
      ].join("\n"),
    )
    .join("\n\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const html = await htmlFetch(buildUrl(opts))
    const total = parseTotal(html)
    let cards = parseJobCards(html)
    cards = filterByJobage(cards, opts.jobage, new Date())
    if (opts.limit !== undefined && opts.limit >= 0) cards = cards.slice(0, opts.limit)

    if (opts.format === "table") {
      process.stdout.write(renderTable(cards) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(renderPlain(cards) + "\n")
    } else {
      process.stdout.write(
        JSON.stringify(
          { meta: { count: cards.length, page: opts.page, total, perPage: PER_PAGE }, results: cards },
          null,
          2,
        ) + "\n",
      )
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "SEARCH_FAILED")
    return 1
  }
}

/** Resolve a `--location` value to a province code, or null when unknown. */
export function resolveLocation(location: string): number | null {
  return provinceCode(location)
}
