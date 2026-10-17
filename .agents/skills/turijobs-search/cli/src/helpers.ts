// Data source: Turijobs (www.turijobs.com) server-rendered Next.js pages.
// Turijobs is Spain's tourism & hospitality job board. Both the search listing
// and the job detail page embed the full data set in a `__NEXT_DATA__` JSON
// script tag, so no HTML scraping or JavaScript rendering is required.

export interface TurijobsJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  excerpt?: string | null
  salary?: string | null
  contract?: string | null
  remote?: boolean
}

export interface TurijobsJobDetail extends TurijobsJobCard {
  description: string | null
  employmentType: string | null
  salary: string | null
  isActive: boolean
  deadline: string | null
  requirements: string[]
  tags: string[]
  applyUrl: string
  vacancies: number | null
  applies: number | null
}

export const BASE = "https://www.turijobs.com"
export const LOCALE = "es-es"
export const SEARCH_PATH = `${BASE}/${LOCALE}/ofertas-trabajo`
export const DETAIL_PATH = `${BASE}/${LOCALE}/oferta-trabajo`
export const UA = "Mozilla/5.0 (compatible; turijobs-cli/1.0)"

const CONTRACT_RE = /indefinido|temporal|fijo discontinuo|becari|pr[aá]cticas|aut[oó]nomo|obra y servicio/i
const WORKDAY_RE = /jornada|intensiva|tiempo completo|tiempo parcial/i

const SALARY_UNITS: Record<string, string> = {
  MONTH: "€/mes",
  YEAR: "€/año",
  WEEK: "€/semana",
  DAY: "€/día",
  HOUR: "€/hora",
}

export async function htmlFetch(url: string): Promise<string> {
  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9",
      },
      redirect: "follow",
    })
  } catch (e) {
    throw new Error(`Request failed: ${e instanceof Error ? e.message : String(e)}`)
  }
  if (res.status === 404) return ""
  if (!res.ok) throw new Error(`Request failed with HTTP ${res.status}`)
  return res.text()
}

// Turijobs ships every page's data as an embedded Next.js `__NEXT_DATA__` JSON
// blob. Parse it directly instead of scraping the rendered markup.
export function nextData(html: string): Record<string, unknown> | null {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)
  if (!m) return null
  try {
    return JSON.parse(m[1]) as Record<string, unknown>
  } catch {
    return null
  }
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function formatLocation(loc: Record<string, unknown> | undefined | null): string | null {
  if (!loc) return null
  const city = loc.cityName ? String(loc.cityName) : ""
  const region = loc.regionName ? String(loc.regionName) : ""
  const country = loc.countryName ? String(loc.countryName) : ""
  if (city && region && city !== region) return `${city}, ${region}`
  if (city) return city
  if (region) return region
  return country || null
}

function formatSalary(s: Record<string, unknown> | undefined | null): string | null {
  if (!s || s.salaryVisible !== true) return null
  const min = Number(s.salaryMin) || 0
  const max = Number(s.salaryMax) || 0
  const unit = SALARY_UNITS[String(s.salaryType ?? "").toUpperCase()] ?? String(s.salaryType ?? "").trim()
  if (min > 0 && max > 0 && min !== max) return `${min}-${max} ${unit}`.trim()
  if (max > 0) return `${max} ${unit}`.trim()
  if (min > 0) return `${min} ${unit}`.trim()
  return null
}

function isRemote(text: string): boolean {
  return /(\bteletrabajo\b|\bremot[oa]\b|\bremote\b|\bhome\s?office\b|\bdesde casa\b)/i.test(text)
}

function compact(text: string, max = 200): string | null {
  const s = text.replace(/\s+/g, " ").trim()
  if (!s) return null
  return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s
}

function toCard(o: Record<string, unknown>): TurijobsJobCard {
  const id = String(o.id)
  const rel = String(o.url ?? "").replace(/^\/+/, "")
  const url = rel ? `${DETAIL_PATH}/${rel}` : `${DETAIL_PATH}/${id}`
  const description = typeof o.description === "string" ? o.description : ""
  const tags: string[] = Array.isArray(o.cardTags) ? (o.cardTags as unknown[]).map(String) : []
  const dates = (o.dates as Record<string, unknown> | undefined) ?? {}
  const company = (o.company as Record<string, unknown> | undefined) ?? {}
  const date = String(dates.publicationDate ?? o.publicationDate ?? "").slice(0, 10) || null

  return {
    id,
    title: o.title ? String(o.title).trim() || null : null,
    company: String(company.brandName ?? company.enterpriseName ?? "").trim() || null,
    location: formatLocation(o.location as Record<string, unknown> | undefined),
    date,
    url,
    excerpt: compact(description),
    salary: formatSalary(o.salary as Record<string, unknown> | undefined),
    contract: tags.find((t) => CONTRACT_RE.test(t)) ?? null,
    remote: isRemote(`${String(o.title ?? "")} ${description} ${tags.join(" ")}`),
  }
}

export interface SearchResult {
  total: number
  pages: number
  cards: TurijobsJobCard[]
  selectedKeys: string[]
}

export function parseSearch(html: string): SearchResult {
  const data = nextData(html)
  if (!data) throw new Error("Could not find embedded job data — Turijobs may have changed its page format")
  const props = (data.props as Record<string, unknown> | undefined)?.pageProps as
    | Record<string, unknown>
    | undefined
  const sd = props?.searchData as Record<string, unknown> | undefined
  if (!sd) throw new Error("Could not find search data on the Turijobs listing page")

  const offers = (sd.offers as unknown[] | undefined) ?? []
  const cards: TurijobsJobCard[] = []
  for (const raw of offers) {
    if (raw && typeof raw === "object" && (raw as Record<string, unknown>).id != null) {
      cards.push(toCard(raw as Record<string, unknown>))
    }
  }

  const selectedKeys: string[] = []
  const facets = (sd.facets as unknown[] | undefined) ?? []
  for (const f of facets) {
    const values = ((f as Record<string, unknown>).values as unknown[] | undefined) ?? []
    for (const v of values) {
      const val = v as Record<string, unknown>
      if (val.isSelected === true && val.key) selectedKeys.push(String(val.key))
    }
  }

  return {
    total: Number(sd.total) || 0,
    pages: Number(sd.pages) || 0,
    cards,
    selectedKeys,
  }
}

export interface NormalizedDetail {
  id: string
  url: string
}

// Detail URLs are `/es-es/oferta-trabajo/<city>/<slug>/<id>`; the city and slug
// segments are cosmetic (the page is keyed by the numeric id), so a bare id is
// enough. Accepts a full URL, the `city/slug/id` path emitted by `search`, or a
// numeric id.
export function normalizeDetail(input: string): NormalizedDetail | null {
  const t = input.trim()
  if (!t) return null

  if (/^https?:\/\//i.test(t)) {
    const cleaned = t.replace(/\/aplicar\/?$/i, "").replace(/[?#].*$/, "")
    const idm = cleaned.match(/\/(\d+)\/?$/)
    if (!idm) return null
    return { id: idm[1], url: cleaned.replace(/\/$/, "") }
  }

  const idm = t.replace(/\/+$/, "").match(/(\d+)$/)
  if (!idm) return null
  const id = idm[1]

  if (/^\d+$/.test(t)) return { id, url: `${DETAIL_PATH}/oferta/oferta/${id}` }

  const path = t.replace(/^\/+/, "").replace(/^(es-es|en-es|pt-pt|en-pt|es-mx|en-mx|es|en)\//, "")
  if (path.startsWith("oferta-trabajo/")) {
    return { id, url: `${BASE}/${LOCALE}/${path.replace(/\/aplicar\/?$/, "")}` }
  }
  if (/^[^/]+\/[^/]+\/\d+$/.test(path)) return { id, url: `${DETAIL_PATH}/${path}` }
  return null
}

function flattenRequirements(o: Record<string, unknown>): string[] {
  const out: string[] = []
  const req = o.requirements
  if (req && typeof req === "object") {
    for (const value of Object.values(req as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        for (const item of value) if (item) out.push(String(item))
      } else if (value) {
        out.push(String(value))
      }
    }
  }
  if (typeof o.additionalRequirements === "string") {
    for (const line of o.additionalRequirements.split(/\r?\n/)) {
      const s = line.trim()
      if (s) out.push(s)
    }
  }
  return out
}

export async function fetchDetail(idOrUrl: string): Promise<TurijobsJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Turijobs offer id or URL from input")

  const raw = await htmlFetch(norm.url)
  if (!raw) throw new Error("Job not found")

  const data = nextData(raw)
  const props = (data?.props as Record<string, unknown> | undefined)?.pageProps as
    | Record<string, unknown>
    | undefined
  const offer = ((props?.offerData as Record<string, unknown> | undefined)?.offerDetail ??
    undefined) as Record<string, unknown> | undefined
  if (!offer || !offer.id) throw new Error("Job not found")

  const card = toCard(offer)
  const tags: string[] = Array.isArray(offer.cardTags) ? (offer.cardTags as unknown[]).map(String) : []
  const dates = (offer.dates as Record<string, unknown> | undefined) ?? {}
  const seo = (props?.seo as Record<string, unknown> | undefined) ?? {}
  // seo.canonicalUrl just echoes whatever path was requested, so when the
  // caller passed a bare id it can be a placeholder path. Prefer the offer's
  // own slug when present so the reported URL is always the real posting URL.
  const canonical =
    typeof offer.url === "string" && offer.url
      ? `${DETAIL_PATH}/${offer.url.replace(/^\/+/, "")}`
      : typeof seo.canonicalUrl === "string" && seo.canonicalUrl
        ? seo.canonicalUrl
        : card.url

  const contract = tags.find((t) => CONTRACT_RE.test(t)) ?? null
  const workday = tags.find((t) => WORKDAY_RE.test(t)) ?? null
  const employmentType = [contract, workday].filter((x): x is string => !!x).join(" · ") || null

  const deadline =
    String(dates.finishDate ?? "").slice(0, 10) ||
    (typeof offer.expiringDate === "string" ? offer.expiringDate.slice(0, 10) : "") ||
    null

  const today = new Date().toISOString().slice(0, 10)
  const isActive = Number(offer.statusId) === 1 && (!deadline || deadline >= today)

  return {
    ...card,
    url: canonical,
    description: typeof offer.description === "string" ? offer.description.trim() || null : null,
    employmentType,
    salary: formatSalary(offer.salary as Record<string, unknown> | undefined),
    isActive,
    deadline,
    requirements: flattenRequirements(offer),
    tags,
    applyUrl: `${canonical.replace(/\/$/, "")}/aplicar`,
    vacancies: offer.vacancies != null ? Number(offer.vacancies) : null,
    applies: offer.applies != null ? Number(offer.applies) : null,
  }
}
