// Data source: Hosco (www.hosco.com), a hospitality job board.
//
// Search: `/en/jobs?search=<q>` is a server-rendered listing. Each card links to
// `/en/job/<company>/<slug>` with the title in the anchor's `title` attribute.
// Detail pages embed a schema.org `JobPosting` JSON-LD blob.

export interface HoscoJobCard {
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

export interface HoscoJobDetail extends HoscoJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.hosco.com"
export const UA = "Mozilla/5.0 (compatible; hosco-cli/1.0)"

export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
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

export function parseSearch(html: string): { total: number; cards: HoscoJobCard[] } {
  const cards: HoscoJobCard[] = []
  const seen = new Set<string>()
  const anchorRe = /<a[^>]*href="(\/en\/job\/[^"]+)"[^>]*>/g
  let m: RegExpExecArray | null
  while ((m = anchorRe.exec(html)) !== null) {
    const href = m[1]
    const id = href.split("/").pop() || href
    if (seen.has(id)) continue
    seen.add(id)
    const tag = m[0]
    const titleAttr = tag.match(/title="([^"]*)"/)
    const title = titleAttr ? decodeHtmlEntities(titleAttr[1]) : null
    const company = href.split("/")[3] ? href.split("/")[3].replace(/-/g, " ") : null
    const rest = html.slice(m.index, m.index + 2500)
    const locM = rest.match(/Location__Container[^>]*>[\s\S]*?<\/svg>\s*([^<]+)/i)
    const location = locM ? clean(locM[1]) || null : null
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
  if (t.includes("/en/job/")) {
    const m = t.match(/(\/en\/job\/[^"'\s]+)/)
    if (m) {
      const id = m[1].split("/").pop() || m[1]
      return { id, url: `${BASE}${m[1]}` }
    }
  }
  return null
}

function findJobPostingScript(html: string): string | null {
  const scripts = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []
  for (const s of scripts) {
    const inner = s.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "")
    if (inner.includes('"JobPosting"') || inner.includes("'JobPosting'")) return inner
  }
  return null
}

export async function fetchDetail(idOrUrl: string): Promise<HoscoJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Hosco offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")
  const script = findJobPostingScript(html)
  const json = script || ""
  const titleM = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)
  const title = (titleM ? clean(titleM[1]) : "") || jsonField(json, "title") || null
  if (!title) throw new Error("Job not found")
  const description = jsonField(json, "description")
  const datePosted = jsonField(json, "datePosted")
  const validThrough = jsonField(json, "validThrough")
  const employmentType = jsonField(json, "employmentType")
  const hoMatch = json.match(/"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const company = hoMatch ? (safeParse(hoMatch[1])) : null
  const locMatch = json.match(/"addressLocality"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const location = locMatch ? safeParse(locMatch[1]) : null
  const date = datePosted ? datePosted.slice(0, 10) : null
  const deadline = validThrough ? validThrough.slice(0, 10) : null
  const isActive = deadline ? deadline >= todayIso() : true
  return {
    id: norm.id,
    title: clean(title),
    company: company ? clean(company) : null,
    location: location ? clean(location) : null,
    date,
    url: norm.url,
    excerpt: description ? compact(clean(description)) : null,
    salary: null,
    contract: null,
    remote: isRemote(`${title} ${location ?? ""} ${description ?? ""}`),
    description: description ? htmlToText(description) : null,
    employmentType: employmentType || null,
    isActive,
    deadline,
    applyUrl: norm.url,
  }
}

function jsonField(json: string, field: string): string | null {
  const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i")
  const m = json.match(re)
  if (!m) return null
  return safeParse(m[1])
}

function safeParse(s: string): string | null {
  try {
    return JSON.parse(`"${s}"`) as string
  } catch {
    return s.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"')
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
