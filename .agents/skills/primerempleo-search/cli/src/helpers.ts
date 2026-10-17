// Data source: Primerempleo (www.primerempleo.com), a Spanish job board for
// students and young professionals (internships, first jobs, temporary roles).
//
// Search: `/?keywords=<q>` is a server-rendered listing. Each job is an
// `<a href="/primer-empleo|trabajo-estudiantes|.../<loc>/<slug>/<id>">TITLE</a>`.
// Detail pages are server-rendered with company, location, employment type,
// publication date and full description.

export interface PrimerEmpleoCard {
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

export interface PrimerEmpleoDetail extends PrimerEmpleoCard {
  description: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.primerempleo.com"
export const UA = "Mozilla/5.0 (compatible; primerempleo-cli/1.0)"

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

export function parseSearch(html: string): { total: number; cards: PrimerEmpleoCard[] } {
  const cards: PrimerEmpleoCard[] = []
  const seen = new Set<string>()
  const linkRe = /href="(\/(?:primer-empleo|trabajo-estudiantes|trabajo-temporal)\/[^"]+?\/(\d+))"[^>]*>\s*([^<]{3,80}?)\s*<\/a>/gi
  let m: RegExpExecArray | null
  while ((m = linkRe.exec(html)) !== null) {
    const urlPath = m[1]
    const id = m[2]
    if (seen.has(id)) continue
    seen.add(id)
    const title = clean(m[3])
    // location from url path segment 2
    const segs = urlPath.split("/")
    const location = segs.length >= 3 ? segs[2].replace(/-/g, " ") : null
    // company: search nearby for "Trabajo en:" or "Empresa:"
    const rest = html.slice(m.index, m.index + 600)
    const compM = rest.match(/Trabajo en:\s*&nbsp;\s*<a[^>]*>([^<]+)</i) || rest.match(/Trabajo en:\s*<a[^>]*>([^<]+)</i)
    const company = compM ? clean(compM[1]) || null : null
    cards.push({
      id,
      title: title || null,
      company,
      location: location ? location.charAt(0).toUpperCase() + location.slice(1) : null,
      date: null,
      url: `${BASE}${urlPath}`,
      excerpt: null,
      salary: null,
      contract: null,
      remote: isRemote(`${title} ${location ?? ""}`),
      employmentType: null,
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
  const m = t.match(/(\/(?:primer-empleo|trabajo-estudiantes|trabajo-temporal)\/[^"'\s]+)/)
  if (m) {
    const idm = t.match(/\/(\d+)(?:\/|$)/)
    return { id: idm ? idm[1] : t, url: `${BASE}${m[1]}` }
  }
  return null
}

export async function fetchDetail(idOrUrl: string): Promise<PrimerEmpleoDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Primerempleo offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")

  function findJobPostingScript(h: string): string | null {
    const scripts = h.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi) || []
    for (const sc of scripts) {
      const inner = sc.replace(/<script[^>]*>/i, "").replace(/<\/script>/i, "")
      if (inner.includes('"JobPosting"') || inner.includes("'JobPosting'")) return inner
    }
    return null
  }
  function jsonField(json: string, field: string): string | null {
    const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i")
    const m = json.match(re)
    if (!m) return null
    try {
      return JSON.parse(`"${m[1]}"`) as string
    } catch {
      return m[1].replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\"/g, '"')
    }
  }

  const script = findJobPostingScript(html)
  const json = script || ""
  const title = jsonField(json, "title") || (html.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim() ?? null)
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
    employmentType: employmentType || null,
    description: description ? htmlToText(description) : null,
    isActive,
    deadline,
    applyUrl: norm.url,
  }
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
