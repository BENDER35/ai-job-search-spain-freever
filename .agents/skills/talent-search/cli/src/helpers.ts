// Data source: Talent.com Spain (es.talent.com) server-rendered HTML.
// Search results and job detail pages are plain HTML — no authentication and
// no JavaScript rendering required. Most detail pages embed a schema.org
// JobPosting in JSON-LD; the rest are parsed from the article markup.

export interface TalentJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  excerpt?: string | null
  remote?: boolean
}

export interface TalentJobDetail extends TalentJobCard {
  description: string | null
  employmentType: string | null
  salary: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_BASE = "https://es.talent.com/jobs"
export const DETAIL_BASE = "https://es.talent.com/view"
export const UA = "Mozilla/5.0 (compatible; talent-cli/1.0)"
// Talent.com geolocates an empty location from the caller's IP and 307-redirects.
// Default to the whole country so results are deterministic.
export const DEFAULT_LOCATION = "España"

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
    return response.text()
  }
  throw new Error(`Request failed after ${maxRetries} retries: ${url}`)
}

function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&aacute;/gi, "á")
    .replace(/&eacute;/gi, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&(#\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = parseInt(hex, 16)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
}

function stripTags(html: string): string {
  const withoutBlocks = html
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
  return decodeEntities(withoutBlocks.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

function match(text: string, re: RegExp): string | null {
  const m = text.match(re)
  return m ? m[1] : null
}

function isRemote(text: string): boolean {
  return /(\bremot[oa]\b|\bteletrabajo\b|\bremote\b|\bhome\s?office\b|\bwork from home\b)/i.test(text)
}

export function parseJobCards(html: string): TalentJobCard[] {
  const cards: TalentJobCard[] = []
  // Each search result is an `<article data-testid="job-card-unified">`.
  const cardRe = /<article\b[^>]*data-testid="job-card-unified"[^>]*>([\s\S]*?)<\/article>/g
  let m: RegExpExecArray | null
  while ((m = cardRe.exec(html))) {
    const chunk = m[1]
    const linkMatch = chunk.match(/href="\/view\?id=(\d+)"/)
    if (!linkMatch) continue
    const id = linkMatch[1]
    const title = match(chunk, /JobCard_title__[^"]*"[^>]*>([\s\S]*?)<\/h2>/)
    const company = match(chunk, /JobCard_company__[^"]*"[^>]*>([\s\S]*?)<\/span>/)
    const location = match(chunk, /JobCard_location__[^"]*"[^>]*>([\s\S]*?)<\/span>/)
    const snippetRaw = match(chunk, /JobCard_snippet__[^"]*"[^>]*>([\s\S]*?)<\/p>/)
    const snippet = snippetRaw ? snippetRaw.replace(/<a\b[\s\S]*?<\/a>/gi, " ") : null
    const timeTag = chunk.match(/<time\b[^>]*JobCard_timeText__[^"]*"[^>]*>/)
    const dateTime = timeTag ? (timeTag[0].match(/dateTime="([^"]+)"/)?.[1] ?? null) : null

    const titleText = title ? stripTags(title) : ""
    const snippetText = snippet ? stripTags(snippet) : ""
    cards.push({
      id,
      title: titleText || null,
      company: company ? stripTags(company) || null : null,
      location: location ? stripTags(location) || null : null,
      date: dateTime ? dateTime.slice(0, 10) : null,
      url: `${DETAIL_BASE}?id=${id}`,
      excerpt: snippetText || null,
      remote: isRemote(`${titleText} ${snippetText}`),
    })
  }
  return cards
}

interface JsonLdJobPosting {
  title?: string
  description?: string
  datePosted?: string
  employmentType?: string
  validThrough?: string
  baseSalary?: unknown
  hiringOrganization?: { name?: string }
  jobLocation?: { address?: { addressLocality?: string; addressRegion?: string; addressCountry?: string } }
}

function findJobPosting(html: string): JsonLdJobPosting | null {
  const re = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html))) {
    let data: unknown
    try {
      data = JSON.parse(m[1])
    } catch {
      continue
    }
    const record = data as Record<string, unknown> | unknown[]
    const nodes = Array.isArray(record)
      ? record
      : ((record?.["@graph"] as unknown[]) ?? [record])
    for (const node of nodes) {
      if (node && typeof node === "object" && String((node as Record<string, unknown>)["@type"] ?? "").includes("JobPosting")) {
        return node as JsonLdJobPosting
      }
    }
  }
  return null
}

const SKIP_SPAN = /^(hace\s|aplicar|guardar|compartir|denunciar|quick apply|más de|\d+\s*(días?|horas?|minutos?|semanas?|meses|años?))/i

function headerSpans(html: string): string[] {
  const start = html.indexOf('data-testid="JobCardContainer"')
  if (start < 0) return []
  const end = html.indexOf("</header>", start)
  const segment = html.slice(start, end > start ? end : start + 4000)
  const spans: string[] = []
  for (const s of segment.matchAll(/<span\b[^>]*>([\s\S]*?)<\/span>/g)) {
    const text = stripTags(s[1])
    if (!text || text === "•" || text === "·" || text === "-" || SKIP_SPAN.test(text)) continue
    spans.push(text)
  }
  return spans
}

function isoDay(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

// Talent.com prints relative dates ("Hace 21 días", "Hoy", "Ayer") on detail
// pages that carry no JSON-LD. Same convention as jobtoday-search: resolve the
// relative age against now rather than dropping the date.
export function relativeToIso(text: string | null): string | null {
  if (!text) return null
  const t = text.toLowerCase().trim()
  const nowMs = Date.now()
  const day = 86400000
  if (t === "hoy") return isoDay(nowMs)
  if (t === "ayer") return isoDay(nowMs - day)
  const m = t.match(/hace\s+(?:más de\s+)?(\d+)\s*(minuto|hora|día|dia|semana|mes|año)/)
  if (!m) return null
  const n = Number(m[1])
  const unit = m[2]
  const ms = unit.startsWith("minuto")
    ? 60000
    : unit.startsWith("hora")
      ? 3600000
      : unit.startsWith("semana")
        ? 7 * day
        : unit.startsWith("mes")
          ? 30 * day
          : unit.startsWith("año") || unit.startsWith("ano")
            ? 365 * day
            : day
  return isoDay(nowMs - n * ms)
}

function descriptionFromArticle(html: string): string | null {
  const h1 = html.indexOf("<h1")
  if (h1 < 0) return null
  const start = html.lastIndexOf("<article", h1)
  if (start < 0) return null
  const end = html.indexOf("</article>", h1)
  if (end < 0) return null
  let body = html.slice(start, end)
  const headerEnd = body.lastIndexOf("</header>")
  if (headerEnd >= 0) body = body.slice(headerEnd + "</header>".length)
  body = body.replace(/<nav\b[\s\S]*?<\/nav>/gi, " ").replace(/<button\b[\s\S]*?<\/button>/gi, " ")
  const text = stripTags(body).replace(/^Descripción del (trabajo|empleo|puesto|perfil)\s*/i, "")
  return text || null
}

function salaryFromJsonLd(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === "string") return value.trim() || null
  if (typeof value === "object") {
    const v = value as Record<string, unknown>
    const amount = v.value as Record<string, unknown> | number | string | undefined
    let num: unknown = amount
    if (amount && typeof amount === "object") num = (amount as Record<string, unknown>).value
    const currency = v.currency ?? (amount && typeof amount === "object" ? (amount as Record<string, unknown>).currency : undefined)
    if (num != null && currency) return `${num} ${currency}`
    if (num != null) return String(num)
  }
  return null
}

export function normalizeId(input: string): string | null {
  const trimmed = input.trim()
  const urlMatch = trimmed.match(/[?&]id=(\d+)/) ?? trimmed.match(/talent\.com\/view\/(\d+)/)
  if (urlMatch) return urlMatch[1]
  if (/^\d{6,}$/.test(trimmed)) return trimmed
  return null
}

export async function fetchDetail(idOrUrl: string): Promise<TalentJobDetail> {
  const id = normalizeId(idOrUrl)
  if (!id) throw new Error("Invalid offer id")
  const url = `${DETAIL_BASE}?id=${id}`
  const raw = await htmlFetch(url)
  if (!raw) throw new Error("Job not found")

  const jp = findJobPosting(raw)
  const h1 = match(raw, /<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  const spans = headerSpans(raw)
  const description = (jp?.description ? stripTags(jp.description) : null) ?? descriptionFromArticle(raw)

  const address = jp?.jobLocation?.address
  const jsonLocation = address
    ? [address.addressLocality, address.addressRegion].filter((part): part is string => !!part).join(", ")
    : ""

  const dateTimeMatch = raw.match(/<time\b[^>]*JobCard_timeText__[^"]*"[^>]*dateTime="([^"]+)"/)
  const relativeMatch = raw.match(/>(Hace[^<]{1,40}|Hoy|Ayer)</)

  const title = (jp?.title ?? (h1 ? stripTags(h1) : null)) || "(untitled)"
  const employmentType = jp?.employmentType ?? null
  // The "ya no está disponible" copy also ships inside an embedded i18n JSON in
  // every page's <script> payload, so only the visible text can signal an
  // expired posting (stripTags drops script/style/svg).
  const isExpired = /(ya no está disponible|ha caducado|no longer available|this job has expired)/i.test(stripTags(raw))

  return {
    id,
    title,
    company: jp?.hiringOrganization?.name ?? spans[0] ?? null,
    location: jsonLocation || spans[1] || null,
    date: (jp?.datePosted ? jp.datePosted.slice(0, 10) : null) ?? (dateTimeMatch ? dateTimeMatch[1].slice(0, 10) : null) ?? relativeToIso(relativeMatch?.[1] ?? null),
    url,
    excerpt: null,
    remote: isRemote(`${title} ${description ?? ""}`),
    description,
    employmentType,
    salary: salaryFromJsonLd(jp?.baseSalary),
    isActive: !!h1 && !isExpired,
    deadline: jp?.validThrough ? jp.validThrough.slice(0, 10) : null,
  }
}
