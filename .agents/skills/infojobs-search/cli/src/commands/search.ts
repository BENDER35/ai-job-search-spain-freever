import {
  apiGet,
  toResult,
  writeCliError,
  SEARCH_PATH,
  type InfoJobsSearchResponse,
  type JobResult,
} from "../helpers.js"

export interface SearchOpts {
  query?: string
  location?: string // raw --location text; normalized to an InfoJobs province key
  remote?: string // "remote" | "hybrid" | "onsite"
  jobage: number // 9999 means "no freshness window"
  page: number
  limit: number // API maxResults (clamped to 1..50 by the CLI)
  format: "json" | "table" | "plain"
}

/** InfoJobs' documented recommendation: at most 50 results per request. */
export const MAX_RESULTS_PER_PAGE = 50
/** The API's own default page size, used when --limit is unset. */
export const DEFAULT_LIMIT = 20

/**
 * Map `--jobage <days>` onto InfoJobs' `sinceDate` filter. The API only offers
 * three buckets, so anything outside them is handled client-side (and exact
 * windows inside a bucket are narrowed by `filterByJobage`).
 */
export function sinceDateFor(days: number): string | null {
  if (!days || days >= 9999) return null
  if (days <= 1) return "_24_HOURS"
  if (days <= 7) return "_7_DAYS"
  if (days <= 15) return "_15_DAYS"
  return null
}

/** Map `--remote <mode>` onto InfoJobs' `teleworking` dictionary key. */
export function teleworkingFor(remote: string | undefined): string | null {
  if (remote === "remote") return "solo-teletrabajo"
  if (remote === "hybrid") return "teletrabajo-posible"
  if (remote === "onsite") return "trabajo-solo-presencial"
  return null
}

// The InfoJobs province dictionary keys are lowercase, accent-stripped and
// hyphenated ("madrid", "a-coruna", "santa-cruz-de-tenerife"), so most inputs
// normalize mechanically. The bilingual and locally-named provinces need an
// explicit mapping; the official /dictionary/province keys are the values here.
const PROVINCE_ALIASES: Record<string, string> = {
  alacant: "alicante-alacant",
  alicante: "alicante-alacant",
  "alicante-alacant": "alicante-alacant",
  castello: "castellon-castello",
  castellon: "castellon-castello",
  "castellon-castello": "castellon-castello",
  valencia: "valencia-valencia",
  "valencia-valencia": "valencia-valencia",
  coruna: "a-coruna",
  "a-coruna": "a-coruna",
  "la-coruna": "a-coruna",
  araba: "alava",
  bizkaia: "vizcaya",
  gipuzkoa: "guipuzcoa",
  gerona: "girona",
  lerida: "lleida",
  orense: "ourense",
  "islas-baleares": "illes-balears",
  baleares: "illes-balears",
  "islas-baleares-illes-balears": "illes-balears",
  rioja: "la-rioja",
  "comunidad-de-madrid": "madrid",
  "principado-de-asturias": "asturias",
  "region-de-murcia": "murcia",
}

/**
 * Normalize a `--location` value to an InfoJobs province key. There is
 * deliberately no local allowlist: an unrecognized value is passed through, so
 * the API validates it and reports its own error (the province dictionary has
 * 52 entries and changes without notice). Returns null only for blank input.
 */
export function normalizeLocation(raw: string): string | null {
  const folded = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s/]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  if (!folded) return null
  return PROVINCE_ALIASES[folded] ?? folded
}

/** Clamp `--limit` into the API's supported window. */
export function clampLimit(n: number): number {
  return Math.min(Math.max(1, Math.floor(n)), MAX_RESULTS_PER_PAGE)
}

/** Build the InfoJobs search query string from the options. */
export function buildQuery(opts: SearchOpts): string {
  const p = new URLSearchParams()
  if (opts.query) p.set("q", opts.query)
  const province = opts.location ? normalizeLocation(opts.location) : null
  if (province) p.set("province", province)
  const teleworking = teleworkingFor(opts.remote)
  if (teleworking) p.set("teleworking", teleworking)
  const sinceDate = sinceDateFor(opts.jobage)
  if (sinceDate) p.set("sinceDate", sinceDate)
  p.set("page", String(opts.page))
  p.set("maxResults", String(clampLimit(opts.limit)))
  return p.toString()
}

/**
 * Keep offers published within the last `days` days (client-side). This narrows
 * the API's coarse `sinceDate` buckets to the exact window the user asked for;
 * an undated offer is kept (absence of a date is not evidence of age).
 */
export function filterByJobage(rows: JobResult[], days: number, now: Date): JobResult[] {
  if (!days || days >= 9999) return rows
  const cutoff = now.getTime() - days * 86400000
  return rows.filter((r) => {
    if (!r.date) return true
    const t = Date.parse(r.date)
    return Number.isNaN(t) ? true : t >= cutoff
  })
}

/** The date portion (YYYY-MM-DD) of an RFC3339 timestamp, or "—" when absent. */
function shortDate(date: string | null): string {
  return date ? date.slice(0, 10) : "—"
}

function renderTable(rows: JobResult[]): string {
  if (rows.length === 0) return "No results."
  const header =
    "ID".padEnd(34) +
    " " +
    "TITLE".padEnd(38) +
    " " +
    "COMPANY".padEnd(22) +
    " " +
    "LOCATION".padEnd(18) +
    " " +
    "DATE"
  const body = rows.map((r) =>
    [
      r.id.padEnd(34),
      r.title.slice(0, 38).padEnd(38),
      (r.company ?? "—").slice(0, 22).padEnd(22),
      (r.location ?? "—").slice(0, 18).padEnd(18),
      shortDate(r.date),
    ].join(" "),
  )
  return [header, "-".repeat(header.length), ...body].join("\n")
}

function renderPlain(rows: JobResult[]): string {
  if (rows.length === 0) return "No results."
  return rows
    .map((r) =>
      [
        r.title,
        `  ${r.company ?? "—"} · ${r.location ?? "—"} · ${shortDate(r.date)}`,
        `  id: ${r.id}`,
        `  ${r.url}`,
      ].join("\n"),
    )
    .join("\n\n")
}

export async function runSearch(opts: SearchOpts): Promise<number> {
  try {
    const env = await apiGet<InfoJobsSearchResponse>(`${SEARCH_PATH}?${buildQuery(opts)}`)
    // A 404 here is an unknown endpoint, not an empty result set: treating it as
    // "no results" would hide a wrong API version behind plausible output.
    if (!env) {
      writeCliError(
        new Error(`${SEARCH_PATH} was not found - check the InfoJobs API version in url-reference.md`),
        "SEARCH_FAILED",
      )
      return 1
    }
    let rows = (env.offers ?? []).map(toResult)
    rows = filterByJobage(rows, opts.jobage, new Date())
    const total = typeof env.totalResults === "number" ? env.totalResults : rows.length

    if (opts.format === "table") {
      process.stdout.write(renderTable(rows) + "\n")
    } else if (opts.format === "plain") {
      process.stdout.write(renderPlain(rows) + "\n")
    } else {
      process.stdout.write(
        JSON.stringify({ meta: { count: rows.length, page: opts.page, total }, results: rows }, null, 2) + "\n",
      )
    }
    return 0
  } catch (e) {
    return writeCliError(e, "SEARCH_FAILED")
  }
}
