// Data source: Randstad Spain (www.randstad.es), a recruitment firm's job board.
//
// Search: `/candidatos/ofertas-empleo/?search=<q>` is a server-rendered listing.
// Each card is an `<a>` with data attributes (offerid, title, province, company).
// Detail pages (`/candidatos/ofertas-empleo/oferta/<slug>-<id>/`) embed a
// schema.org `JobPosting` JSON-LD blob (with literal newlines in the
// description, which are extracted with regex).

export interface RandstadJobCard {
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

export interface RandstadJobDetail extends RandstadJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.randstad.es"
export const UA = "Mozilla/5.0 (compatible; randstad-cli/1.0)"

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

// Extract a JSON string field value handling escaped quotes/newlines (lenient).
function jsonField(json: string, field: string): string | null {
  const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i")
  const m = json.match(re)
  if (!m) return null
  try {
    return JSON.parse(`"${m[1]}"`) as string
  } catch {
    return m[1].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"')
  }
}

export function parseSearch(html: string): { total: number; cards: RandstadJobCard[] } {
  const cards: RandstadJobCard[] = []
  const seen = new Set<string>()
  const anchorRe = /<a[^>]*href="(https:\/\/www\.randstad\.es\/candidatos\/ofertas-empleo\/oferta\/[^"]+)"[^>]*data-offerid="(\d+)"[^>]*data-title="([^"]*)"[^>]*data-province="([^"]*)"[^>]*data-publication-company-business="([^"]*)"/g
  let m: RegExpExecArray | null
  while ((m = anchorRe.exec(html)) !== null) {
    const url = m[1]
    const id = m[2]
    if (seen.has(id)) continue
    seen.add(id)
    const title = decodeHtmlEntities(m[3])
    const province = decodeHtmlEntities(m[4])
    const company = decodeHtmlEntities(m[5])
    cards.push({
      id,
      title: title || null,
      company: company || null,
      location: province || null,
      date: null,
      url,
      excerpt: null,
      salary: null,
      contract: null,
      remote: isRemote(`${title} ${province}`),
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
  if (t.includes("/oferta/")) {
    const m = t.match(/(\/candidatos\/ofertas-empleo\/oferta\/[^"'\s]+)/)
    if (m) {
      const idm = t.match(/-(\d+)\/?$/)
      return { id: idm ? idm[1] : t, url: `${BASE}${m[1]}` }
    }
  }
  const m = t.match(/-(\d+)\/?$/)
  if (m) {
    const id = m[1]
    return { id, url: `${BASE}/candidatos/ofertas-empleo/oferta/oferta-${id}/` }
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

export async function fetchDetail(idOrUrl: string): Promise<RandstadJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Randstad offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")
  const script = findJobPostingScript(html)
  const json = script || ""
  const title = jsonField(json, "title") || null
  if (!title) throw new Error("Job not found")
  const description = jsonField(json, "description")
  const datePosted = jsonField(json, "datePosted")
  const validThrough = jsonField(json, "validThrough")
  const employmentType = jsonField(json, "employmentType")
  const hoMatch = json.match(/"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const company = hoMatch ? jsonField(`"name":"${hoMatch[1]}"`, "name") : null
  const locMatch = json.match(/"addressLocality"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const location = locMatch ? jsonField(`"x":"${locMatch[1]}"`, "x") : null
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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
