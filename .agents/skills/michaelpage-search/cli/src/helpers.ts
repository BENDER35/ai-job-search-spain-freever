// Data source: Michael Page (www.michaelpage.es), a recruitment firm's job board.
//
// Search: `/jobs?query=<q>` is a server-rendered Drupal listing. Each card
// carries title, location, contract type, summary and a company logo.
// Detail pages (`/job-detail/<slug>/ref/<ref>`) embed a schema.org
// `JobPosting` JSON-LD blob (with literal newlines in the description, which
// are sanitized before parsing).

export interface MichaelPageJobCard {
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

export interface MichaelPageJobDetail extends MichaelPageJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://www.michaelpage.es"
export const UA = "Mozilla/5.0 (compatible; michaelpage-cli/1.0)"

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

// Extract a JSON string field value handling escaped quotes/newlines.
function jsonField(json: string, field: string): string | null {
  const re = new RegExp(`"${field}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"`, "i")
  const m = json.match(re)
  if (!m) return null
  try {
    return JSON.parse(`"${m[1]}"`) as string
  } catch {
    return m[1]
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
  }
}

export function parseSearch(html: string): { total: number; cards: MichaelPageJobCard[] } {
  const cards: MichaelPageJobCard[] = []
  const seen = new Set<string>()
  const rowRe = /<li class="views-row">[\s\S]*?<\/li>/g
  let row: RegExpExecArray | null
  while ((row = rowRe.exec(html)) !== null) {
    const block = row[0]
    const linkM = block.match(/<h3>\s*<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
    if (!linkM) continue
    const href = linkM[1]
    const title = clean(linkM[2])
    const idM = href.match(/\/ref\/([^/?#]+)/)
    const id = idM ? idM[1] : href
    if (seen.has(id)) continue
    seen.add(id)
    const locM = block.match(/class="job-location"[^>]*>([\s\S]*?)<\/div>/)
    const location = locM ? clean(locM[1]) : null
    const contractM = block.match(/class="job-contract-type"[^>]*>([\s\S]*?)<\/div>/)
    const contract = contractM ? clean(contractM[1]) : null
    const summaryM = block.match(/class="job_advert__job-summary-text"[^>]*>([\s\S]*?)<\/div>/)
    const excerpt = summaryM ? compact(clean(summaryM[1])) : null
    const logoM = block.match(/title\s*=\s*"([^"]*?)\s*Logo"/i) || block.match(/alt="([^"]*?)\s*Logo"/i)
    const company = logoM ? clean(logoM[1]) || null : null
    cards.push({
      id,
      title: title || null,
      company,
      location: location || null,
      date: null,
      url: `${BASE}${href}`,
      excerpt,
      salary: null,
      contract: contract || null,
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
  if (t.includes("/job-detail/")) {
    const m = t.match(/(\/job-detail\/[^"'\s]+)/)
    if (m) {
      const idm = t.match(/\/ref\/([^/?#]+)/)
      return { id: idm ? idm[1] : t, url: `${BASE}${m[1]}` }
    }
  }
  const m = t.match(/\/ref\/([^/?#]+)/)
  if (m) return { id: m[1], url: `${BASE}/job-detail/ref/${m[1]}` }
  const bare = t.match(/^(jn-[A-Za-z0-9-]+)$/)
  if (bare) return { id: bare[1], url: `${BASE}/job-detail/ref/${bare[1]}` }
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

export async function fetchDetail(idOrUrl: string): Promise<MichaelPageJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Michael Page offer id or URL from input")
  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")
  const script = findJobPostingScript(html)
  const json = script || ""
  const title = jsonField(json, "title") || (html.match(/<h1[^>]*>\s*<span>([\s\S]*?)<\/span>/)?.[1]?.trim() ?? null)
  if (!title) throw new Error("Job not found")
  const description = jsonField(json, "description")
  const datePosted = jsonField(json, "datePosted")
  const validThrough = jsonField(json, "validThrough")
  const employmentType = jsonField(json, "employmentType")
  const company = jsonField(json, "name") // hiringOrganization name often separate; try hiringOrganization
  // hiringOrganization name
  const hoMatch = json.match(/"hiringOrganization"\s*:\s*\{[^}]*"name"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const companyName = hoMatch ? (JSON.parse(`"${hoMatch[1]}"`) as string) : company
  const locMatch = json.match(/"addressLocality"\s*:\s*"((?:[^"\\]|\\.)*)"/)
  const location = locMatch ? (JSON.parse(`"${locMatch[1]}"`) as string) : null
  const date = datePosted ? datePosted.slice(0, 10) : null
  const deadline = validThrough ? validThrough.slice(0, 10) : null
  const isActive = deadline ? deadline >= todayIso() : true
  return {
    id: norm.id,
    title: clean(title),
    company: companyName ? clean(companyName) : null,
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
