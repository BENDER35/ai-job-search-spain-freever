// Data source: StudentJob (www.studentjob.es), a Spanish job board for students
// and young professionals.
//
// Search: `/ofertas?search[keywords_scope]=<q>` is a server-rendered listing.
// Each card carries data-job-opening-id, title, brand (company), location and
// employment type. Detail pages (`/ofertas/<id>-<slug>`) are server-rendered
// with the full description, company, location, employment type and date.

export interface StudentJobCard {
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
  employmentType?: string | null
}

export interface StudentJobDetail extends StudentJobCard {
  description: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.studentjob.es"
export const UA = "Mozilla/5.0 (compatible; studentjob-cli/1.0)"

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

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

export function parseSearch(html: string): { total: number; cards: StudentJobCard[] } {
  const cards: StudentJobCard[] = []
  const seen = new Set<string>()
  const idRe = /data-job-opening-id="(\d+)"/g
  let m: RegExpExecArray | null
  while ((m = idRe.exec(html)) !== null) {
    const id = m[1]
    if (seen.has(id)) continue
    const tagStart = html.lastIndexOf("<a", m.index)
    const tagEnd = html.indexOf(">", m.index)
    if (tagStart < 0 || tagEnd < 0) continue
    const tag = html.slice(tagStart, tagEnd + 1)
    const hrefM = tag.match(/href="(\/ofertas\/[^"]+)"/)
    if (!hrefM) continue
    const href = hrefM[1]
    const titleM = tag.match(/data-job-opening-title="([^"]*)"/)
    const brandM = tag.match(/data-job-opening-item-brand="([^"]*)"/)
    const empM = tag.match(/data-job-opening-employment="([^"]*)"/)
    const title = titleM ? decodeHtmlEntities(titleM[1]) : null
    const company = brandM ? (decodeHtmlEntities(brandM[1]) || null) : null
    const employment = empM ? (decodeHtmlEntities(empM[1]) || null) : null
    seen.add(id)
    const rest = html.slice(tagEnd, tagEnd + 700)
    const locM = rest.match(/nyc-icon-location[^<]*<\/span>\s*<span>([^<]*)<\/span>/)
    const location = locM ? (clean(locM[1]) || null) : null
    cards.push({
      id,
      title: title || null,
      company,
      location,
      date: null,
      url: `${BASE}${href}`,
      excerpt: null,
      salary: null,
      contract: null,
      remote: isRemote(`${title ?? ""} ${location ?? ""}`),
      employmentType: employment,
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
  const m = t.match(/\/ofertas\/(\d+)-/) || t.match(/^(\d+)$/)
  if (!m) return null
  const id = m[1]
  if (t.includes("/ofertas/")) {
    const um = t.match(/(\/ofertas\/[^"'\s]+)/)
    if (um) return { id, url: `${BASE}${um[1]}` }
  }
  return { id, url: `${BASE}/ofertas/${id}` }
}

export async function fetchDetail(idOrUrl: string): Promise<StudentJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a StudentJob offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")

  const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  const title = titleM ? clean(titleM[1]) || null : null
  if (!title) throw new Error("Job not found")

  const companyM = html.match(/Empresas:\s*<\/b>\s*([^<]+)/i)
  const company = companyM ? clean(companyM[1]) || null : null

  const locM = html.match(/itemprop="jobLocation"[^>]*>([\s\S]*?)<\/dd>/i)
  const location = locM ? clean(locM[1]) || null : null

  const empM = html.match(/itemprop="employmentType"[^>]*>([\s\S]*?)<\/dd>/i)
  const employment = empM ? clean(empM[1]) || null : null

  const dateM = html.match(/itemprop="publishedAt"[^>]*>([\s\S]*?)<\/dd>/i)
  let date: string | null = null
  if (dateM) {
    const raw = clean(dateM[1])
    const dm = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/)
    if (dm) date = `${dm[3]}-${dm[2].padStart(2, "0")}-${dm[1].padStart(2, "0")}`
  }

  let description: string | null = null
  const descMarker = html.indexOf("Descripción del empleo")
  if (descMarker >= 0) {
    const after = html.indexOf("</h2>", descMarker)
    if (after >= 0) {
      const nextH2 = html.indexOf("<h2", after + 5)
      const end = nextH2 >= 0 ? nextH2 : html.length
      description = htmlToText(html.slice(after + 5, end)) || null
    }
  }

  const isActive = /Activa/i.test(html)

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
    employmentType: employment,
    description,
    isActive,
    deadline: null,
    applyUrl: norm.url,
  }
}
