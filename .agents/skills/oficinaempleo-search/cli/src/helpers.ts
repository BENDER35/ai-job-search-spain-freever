// Data source: Oficina Empleo (www.oficinaempleo.com), a Spanish job board.
//
// Search: `/buscar/ofertas/<slug>` (slug = keywords with spaces -> hyphens) is a
// server-rendered listing. Each card carries a title link
// `/oferta-empleo/<slug>-<id>`, company, location, excerpt and posting date.
// Detail pages embed a schema.org `JobPosting` JSON-LD blob.

export interface OficinaEmpleoJobCard {
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

export interface OficinaEmpleoJobDetail extends OficinaEmpleoJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.oficinaempleo.com"
export const UA = "Mozilla/5.0 (compatible; oficinaempleo-cli/1.0)"

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
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
}

function clean(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
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

function htmlToText(html: string): string {
  const text = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/\s*(p|div|li|ul|ol|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
  return decodeHtmlEntities(text)
    .replace(/\r/g, "")
    .split("\n")
    .map((l) => l.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  PART_TIME: "Jornada parcial",
  CONTRACTOR: "Autónomo",
  TEMPORARY: "Temporal",
  INTERN: "Becario/a",
  OTHER: "Otro",
}

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export function parseSearch(html: string): { total: number; cards: OficinaEmpleoJobCard[] } {
  const cards: OficinaEmpleoJobCard[] = []
  const seen = new Set<string>()
  // each card: <h2 class="job-title h5"><a href="/oferta-empleo/<slug>-<id>" ...>TITLE</a></h2>
  const titleRe = /<h2 class="job-title[^"]*">\s*<a[^>]*href="(\/oferta-empleo\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g
  let m: RegExpExecArray | null
  while ((m = titleRe.exec(html)) !== null) {
    const href = m[1]
    const title = clean(m[2])
    const idM = href.match(/-(\d+)$/)
    if (!idM) continue
    const id = idM[1]
    if (seen.has(id)) continue
    seen.add(id)
    // find the nearest following job-company / job-description / job-date
    const rest = html.slice(m.index, m.index + 3000)
    const companyM = rest.match(/class="job-company[^"]*"[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/)
    const company = companyM ? clean(companyM[1]) : null
    const locM = rest.match(/class="job-company[^"]*"[^>]*>[\s\S]*?<a[^>]*href="\/ofertas-empleo-en\/[^"]*"[^>]*>([\s\S]*?)<\/a>/)
    const location = locM ? clean(locM[1]) : null
    const descM = rest.match(/class="job-description[^"]*"[^>]*>([\s\S]*?)<\/p>/)
    const excerpt = descM ? compact(clean(descM[1])) : null
    const dateM = rest.match(/class="job-date[^"]*"[^>]*>([\s\S]*?)<\/p>/)
    let date: string | null = null
    if (dateM) {
      const raw = clean(dateM[1])
      const dm = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
      if (dm) date = `${dm[3]}-${dm[2].padStart(2, "0")}-${dm[1].padStart(2, "0")}`
    }
    cards.push({
      id,
      title: title || null,
      company,
      location,
      date,
      url: `${BASE}${href}`,
      excerpt,
      salary: null,
      contract: null,
      remote: isRemote(`${title} ${location ?? ""}`),
    })
  }
  return { total: cards.length, cards }
}

export interface NormalizedDetail {
  id: string
  url: string
}

export function normalizeDetail(input: string): NormalizedDetail | null {
  const t = input.trim()
  if (!t) return null
  // accept /oferta-empleo/<slug>-<id> or just <id>
  const m = t.match(/\/oferta-empleo\/[^/]*?-(\d+)$/) || t.match(/(\d{5,})/)
  if (!m) return null
  const id = m[1]
  // try to reconstruct url from input
  if (t.includes("/oferta-empleo/")) {
    const um = t.match(/(\/oferta-empleo\/[^"'\s]+)/)
    if (um) return { id, url: `${BASE}${um[1]}` }
  }
  return { id, url: `${BASE}/oferta-empleo/oferta-${id}` }
}

export async function fetchDetail(idOrUrl: string): Promise<OficinaEmpleoJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse an OficinaEmpleo offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")
  const jsonLd = parseJsonLd(html)
  const titleM = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  const title = (titleM ? clean(titleM[1]) : "") || str(jsonLd?.title) || null
  if (!title) throw new Error("Job not found")
  const company = str((jsonLd?.hiringOrganization as Record<string, unknown> | undefined)?.name)
  const location = jsonLdLocation(jsonLd)
  const date = isoDate(jsonLd?.datePosted)
  let description: string | null = null
  const desc = str(jsonLd?.description)
  if (desc) description = htmlToText(desc)
  const deadline = isoDate(jsonLd?.validThrough)
  const employmentType = str(jsonLd?.employmentType)
  const isActive = deadline ? deadline >= todayIso() : true
  const applyUrl = str(jsonLd?.url) || norm.url
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
    remote: isRemote(`${title} ${location ?? ""} ${description ?? ""}`),
    description,
    employmentType: employmentType ? (EMPLOYMENT_TYPES[employmentType.toUpperCase()] ?? employmentType) : null,
    isActive,
    deadline,
    applyUrl,
  }
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

function jsonLdLocation(data: Record<string, unknown> | null): string | null {
  const loc = data?.jobLocation
  const place = Array.isArray(loc) ? loc[0] : loc
  if (!place || typeof place !== "object") return null
  const address = (place as Record<string, unknown>).address
  if (!address || typeof address !== "object") return null
  const a = address as Record<string, unknown>
  const locality = str(a.addressLocality)
  const region = str(a.addressRegion)
  const parts: string[] = []
  if (locality) parts.push(locality)
  if (region && !locality?.includes(region)) parts.push(region)
  return parts.length ? parts.join(", ") : null
}

function isoDate(value: unknown): string | null {
  const s = str(value)
  if (!s) return null
  const m = s.match(/^\d{4}-\d{2}-\d{2}/)
  return m ? m[0] : null
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
