// Data source: Jobijoba Spain (www.jobijoba.es).
//
// Search: `/query/?what=<keywords>[&where=<place>][&page=N]` is a server-rendered
// listing. Each result is a `<div class="offer" data-id="ad_<hash>">` block
// whose fields are read from the header (`offer-header-title`, the
// `offer-features` icons), the `publication_date` span and the `description`
// snippet. Every card links either to the first-party page
// `/oferta-empleo/<source>/<hash>` or to the outbound `/redirect/offer/...`
// link; both resolve to the same offer, so the canonical (robots-allowed)
// first-party URL is used.
//
// Detail: `/oferta-empleo/<source>/<hash>` is a server-rendered page with the
// full description in `.permalink-description` and (usually) a schema.org
// `JobPosting` JSON-LD blob. Page 1 of the listing and the detail page are
// robots-allowed; only `/query/` (search) is disallowed for generic crawlers,
// so this skill is personal use only — see SKILL.md.

export interface JobijobaJobCard {
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
  jobFunction?: string | null
}

export interface JobijobaJobDetail extends JobijobaJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
  note?: string
}

export const BASE = "https://www.jobijoba.es"
export const QUERY_PATH = `${BASE}/query/`
export const REDIRECT_PATH = `${BASE}/redirect/offer`
export const DETAIL_PATH = `${BASE}/oferta-empleo`
export const UA = "Mozilla/5.0 (compatible; jobijoba-cli/1.0)"

export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries)
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return await response.text()
  }
  throw new Error("Request failed after retries")
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/gi, "í")
    .replace(/&oacute;/gi, "ó")
    .replace(/&uacute;/gi, "ú")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&uuml;/gi, "ü")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = parseInt(hex, 16)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
}

function clean(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

// Keeps the paragraph/line structure of the offer description.
function htmlToText(html: string): string {
  const text = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\s*li[^>]*>/gi, "\n• ")
    .replace(/<\/\s*(p|div|li|ul|ol|h[1-6]|tr|td)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
  return decodeHtmlEntities(text)
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function compact(text: string, max = 200): string | null {
  const s = text.replace(/\s+/g, " ").trim()
  if (!s) return null
  return s.length > max ? `${s.slice(0, max).trimEnd()}…` : s
}

function isRemote(text: string): boolean {
  return /(teletrabajo|remot[oa]|en remoto|home\s?office|desde casa)/i.test(text)
}

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
}

function isoMonthsAgo(months: number): string {
  const d = new Date()
  d.setUTCMonth(d.getUTCMonth() - months)
  return d.toISOString().slice(0, 10)
}

const MONTHS_FULL: Record<string, string> = {
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  set: "09",
  oct: "10",
  nov: "11",
  dic: "12",
}

// Jobijoba prints either an absolute `19 agosto` label or a relative
// `Publicado hace 10 hr horas` / `hace 2 días` one, with no year.
export function parseDate(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = raw
    .toLowerCase()
    .replace(/^publicad[oa]\s+(el\s+)?/, "")
    .trim()
  if (!s) return null
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/)
  if (iso) return iso[1]
  if (/^hoy\b/.test(s)) return todayIso()
  if (/^ayer\b/.test(s)) return isoDaysAgo(1)

  const rel = s.match(
    /hace\s+(\d+)\s*(min|minutos?|horas?|hrs?|h|d[ií]as?|d[ií]a|semanas?|mes(?:es)?|a[ñn]os?)\b/,
  )
  if (rel) {
    const n = Number(rel[1])
    const unit = rel[2]
    if (/^min/.test(unit)) return todayIso()
    if (/^(hora|hr|h)$/.test(unit)) return isoDaysAgo(Math.floor(n / 24))
    if (/^d[ií]a/.test(unit)) return isoDaysAgo(n)
    if (/^semana/.test(unit)) return isoDaysAgo(n * 7)
    if (/^mes/.test(unit)) return isoMonthsAgo(n)
    if (/^a[ñn]o/.test(unit)) return isoMonthsAgo(n * 12)
  }

  const m = s.match(/^(\d{1,2})\s+([a-záéíóúñ]{3,})/)
  if (m) {
    const day = Number(m[1])
    const word = m[2]
    const mon = MONTHS_FULL[word.slice(0, 4)] ?? MONTHS_FULL[word.slice(0, 3)]
    if (mon && day >= 1 && day <= 31) {
      let year = new Date().getUTCFullYear()
      const candidate = `${year}-${mon}-${pad2(day)}`
      const cutoff = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      if (candidate > cutoff) year -= 1
      return `${year}-${mon}-${pad2(day)}`
    }
  }
  return null
}

export interface SearchPageResult {
  total: number
  heading: string | null
  cards: JobijobaJobCard[]
}

const FEATURE_FIELDS: Record<string, "location" | "company" | "jobFunction"> = {
  "icon-map-marker": "location",
  "icon-apartment": "company",
  "icon-resume-briefcase": "jobFunction",
}

export function parseSearch(html: string): SearchPageResult {
  const headingM = html.match(/class="results-h1[^"]*"[^>]*>([\s\S]*?)<\/h1>/)
  const heading = headingM ? clean(headingM[1]) || null : null
  const totalM = html.match(/de un total de\s*([\d.]+)/i)
  const total = totalM ? Number(totalM[1].replace(/\./g, "")) : 0

  const cards: JobijobaJobCard[] = []
  const seen = new Set<string>()
  const blocks = html.split(/<div class="offer"/)
  for (const block of blocks.slice(1)) {
    const linkM = block.match(
      /href="https:\/\/www\.jobijoba\.es\/(?:redirect\/offer|oferta-empleo)\/(\d+)\/([0-9a-f]+)"/,
    )
    if (!linkM) continue
    const source = linkM[1]
    const hash = linkM[2]
    const id = `${source}/${hash}`
    if (seen.has(id)) continue
    seen.add(id)

    const titleM = block.match(/class="offer-header-title"[^>]*>([\s\S]*?)<\/h3>/)
    const title = titleM ? clean(titleM[1]) || null : null

    let company: string | null = null
    let location: string | null = null
    let jobFunction: string | null = null
    const featuresM = block.match(/<div class="offer-features">([\s\S]*?)<\/div>/)
    if (featuresM) {
      for (const feature of featuresM[1].split(/<span class="feature">/).slice(1)) {
        const iconM = feature.match(/class="(icon-[a-z-]+)"/)
        const field = iconM ? FEATURE_FIELDS[iconM[1]] : undefined
        if (!field) continue
        const valueM = feature.match(
          /<span class="iconwrap">[\s\S]*?<\/span>\s*<\/span>\s*<span[^>]*>([\s\S]*?)<\/span>/,
        )
        const value = valueM ? clean(valueM[1]) : ""
        if (!value) continue
        if (field === "location") location = value
        else if (field === "company") company = value
        else jobFunction = value
      }
    }

    const dateM = block.match(/class="text-primary publication_date">\s*([\s\S]*?)\s*<\/span>/)
    const date = parseDate(dateM ? clean(dateM[1]) : null)

    let excerpt: string | null = null
    const descM = block.match(/<span class="description">([\s\S]*?)<\/span>\s*(?=<div|<\/div>)/)
    if (descM) {
      const text = clean(descM[1]).replace(/\s*…\s*$/, "").trim()
      excerpt = compact(text) || null
    }

    cards.push({
      id,
      title,
      company,
      location,
      date,
      url: `${DETAIL_PATH}/${id}`,
      excerpt,
      salary: null,
      contract: null,
      remote: isRemote(`${title ?? ""} ${location ?? ""} ${jobFunction ?? ""}`),
      jobFunction,
    })
  }
  return { total, heading, cards }
}

export interface NormalizedDetail {
  id: string
  url: string
}

// An offer id is `<source>/<hash>` (e.g. `511/26b034180b9aa2c46bb26ebde60f6638`).
// The canonical `https://www.jobijoba.es/oferta-empleo/<source>/<hash>` page and
// the outbound `https://www.jobijoba.es/redirect/offer/<source>/<hash>` link are
// both accepted.
export function normalizeDetail(input: string): NormalizedDetail | null {
  const t = input.trim()
  if (!t) return null
  const m = t.match(
    /(?:https?:\/\/www\.jobijoba\.es\/(?:oferta-empleo|redirect\/offer)\/)?(\d+)\/([0-9a-f]{6,})/i,
  )
  if (!m) return null
  return { id: `${m[1]}/${m[2]}`, url: `${DETAIL_PATH}/${m[1]}/${m[2]}` }
}

function extractDivInner(html: string, start: number): string | null {
  const re = /<(\/?)div\b[^>]*>/gi
  re.lastIndex = start
  let depth = 0
  let innerStart = -1
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    if (m[1] === "/") {
      depth--
      if (depth === 0 && innerStart !== -1) return html.slice(innerStart, m.index)
    } else {
      depth++
      if (depth === 1) innerStart = re.lastIndex
    }
  }
  return null
}

// `.permalink-info` rows carry one icon each: location / company / function.
function permalinkInfo(html: string, icon: string): string | null {
  const re = new RegExp(`class="icon-${icon}"[^>]*>\\s*</span>([\\s\\S]*?)</div>`, "i")
  const m = html.match(re)
  if (!m) return null
  return clean(m[1]) || null
}

function parseJsonLd(html: string): Record<string, unknown> | null {
  const m = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i)
  if (!m) return null
  try {
    const data = JSON.parse(m[1]) as Record<string, unknown> | Record<string, unknown>[]
    const obj = Array.isArray(data)
      ? (data.find((d) => d["@type"] === "JobPosting") as Record<string, unknown> | undefined)
      : data
    return obj ?? null
  } catch {
    return null
  }
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function jsonLdLocationText(data: Record<string, unknown> | null): string | null {
  const loc = data?.jobLocation
  const place = Array.isArray(loc) ? loc[0] : loc
  if (!place || typeof place !== "object") return null
  const address = (place as Record<string, unknown>).address
  if (!address || typeof address !== "object") return null
  const a = address as Record<string, unknown>
  const parts = [str(a.addressLocality), str(a.addressRegion)].filter(Boolean)
  return parts.length ? parts.join(", ") : null
}

function isoDate(value: unknown): string | null {
  const s = str(value)
  if (!s) return null
  const m = s.match(/^\d{4}-\d{2}-\d{2}/)
  return m ? m[0] : null
}

function employmentType(value: unknown): string | null {
  const values = (Array.isArray(value) ? value : [value])
    .map((v) => str(v))
    .filter((v): v is string => Boolean(v))
  return values.length ? values.join(", ") : null
}

// Jobijoba has a first-party detail page (`/oferta-empleo/...`) for every offer
// in its index, which is robots-allowed and always server-rendered.
export async function fetchDetail(idOrUrl: string): Promise<JobijobaJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Jobijoba offer id or URL from input")

  const html = await htmlFetch(norm.url)
  if (!html) {
    return {
      id: norm.id,
      title: null,
      company: null,
      location: null,
      date: null,
      url: norm.url,
      excerpt: null,
      salary: null,
      contract: null,
      remote: false,
      jobFunction: null,
      description: null,
      employmentType: null,
      isActive: false,
      deadline: null,
      applyUrl: `${REDIRECT_PATH}/${norm.id}`,
      note: "Jobijoba did not serve a detail page for this offer (it may have expired). The outbound link is returned instead.",
    }
  }

  const jsonLd = parseJsonLd(html)

  const titleM = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  const title = (titleM ? clean(titleM[1]) : "") || str(jsonLd?.title) || null

  const location =
    permalinkInfo(html, "map-marker") ?? jsonLdLocationText(jsonLd) ?? null
  const company = permalinkInfo(html, "apartment") ?? str(
    (jsonLd?.hiringOrganization as Record<string, unknown> | undefined)?.name,
  )
  const jobFunction = permalinkInfo(html, "resume-briefcase")

  const dateM = html.match(/class="permalink-date"[^>]*>([\s\S]*?)<\/div>/)
  const date =
    parseDate(dateM ? clean(dateM[1]) : null) ?? isoDate(jsonLd?.datePosted) ?? null

  let description: string | null = null
  const descMarker = html.indexOf('class="permalink-description"')
  if (descMarker >= 0) {
    const open = html.lastIndexOf("<", descMarker)
    const inner = open >= 0 ? extractDivInner(html, open) : null
    if (inner) description = htmlToText(inner) || null
  }
  if (!description) description = htmlToText(str(jsonLd?.description) ?? "") || null

  const redirectM = html.match(
    /data-redirect="(https:\/\/www\.jobijoba\.es\/redirect\/offer\/[^"]+)"/,
  )
  const applyUrl = redirectM ? redirectM[1] : norm.url

  const deadline = isoDate(jsonLd?.validThrough)
  const isActive = deadline ? deadline >= todayIso() : true

  return {
    id: norm.id,
    title,
    company,
    location,
    date,
    url: norm.url,
    excerpt: description ? compact(description) : null,
    salary: null,
    contract: null,
    remote: isRemote(`${title ?? ""} ${location ?? ""} ${description ?? ""}`),
    jobFunction,
    description,
    employmentType: employmentType(jsonLd?.employmentType),
    isActive,
    deadline,
    applyUrl,
  }
}
