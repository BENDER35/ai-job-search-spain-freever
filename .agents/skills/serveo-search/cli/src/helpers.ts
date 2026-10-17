// Data source: Serveo careers site (jobs.serveo.com), a SAP SuccessFactors
// career site. Search results and job detail pages are server-rendered HTML.

export interface ServeoJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  excerpt?: string | null
  remote?: boolean
}

export interface ServeoJobDetail extends ServeoJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_URL = "https://jobs.serveo.com/search/"
export const DETAIL_BASE = "https://jobs.serveo.com"
export const UA = "Mozilla/5.0 (compatible; serveo-cli/1.0)"
export const PAGE_SIZE = 20
export const COMPANY = "Serveo"

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
  throw new Error("Request failed after max retries")
}

export function clean(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
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
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = parseInt(hex, 16)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
}

function stripComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "")
}

function isRemote(html: string): boolean {
  return /teletrabajo|remoto|en remoto|remote|home ?office/i.test(stripComments(html))
}

const MONTHS: Record<string, string> = {
  ene: "01",
  feb: "02",
  mar: "03",
  abr: "04",
  may: "05",
  jun: "06",
  jul: "07",
  ago: "08",
  sep: "09",
  sept: "09",
  oct: "10",
  nov: "11",
  dic: "12",
}

function parseSpanishDate(text: string | null | undefined): string | null {
  if (!text) return null
  const m = text.trim().match(/^(\d{1,2})\s+([a-záéíóú]+)\.?\s+(\d{4})$/i)
  if (!m) return null
  const mon = MONTHS[m[2].toLowerCase().slice(0, 4)] ?? MONTHS[m[2].toLowerCase().slice(0, 3)]
  if (!mon) return null
  return `${m[3]}-${mon}-${m[1].padStart(2, "0")}`
}

function parseJsDate(text: string | null | undefined): string | null {
  if (!text) return null
  const d = new Date(text)
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10)
}

function match(text: string, re: RegExp): string | null {
  const m = text.match(re)
  return m ? m[1] : null
}

export function parseTotal(html: string): number | null {
  const m = html.match(/resultados\s+\d+\s+a\s+\d+\s+de\s+(\d+)/i)
  return m ? parseInt(m[1], 10) : null
}

export function parseJobCards(html: string): ServeoJobCard[] {
  const cards: ServeoJobCard[] = []
  const rows = html.split('<tr class="data-row">')
  for (const row of rows.slice(1)) {
    const titleMatch = row.match(
      /<a href="(\/job\/[^"]+)" class="jobTitle-link">([\s\S]*?)<\/a>/,
    )
    if (!titleMatch) continue
    const href = titleMatch[1]
    const title = clean(titleMatch[2])
    const id = match(href, /\/(\d+)\/?$/) || href
    const locationRaw = match(
      row,
      /<td class="colLocation hidden-phone"[^>]*>\s*<span class="jobLocation">([\s\S]*?)<\/span>/,
    )
    const dateRaw = match(
      row,
      /<td class="colDate hidden-phone"[^>]*>\s*<span class="jobDate">([\s\S]*?)<\/span>/,
    )
    cards.push({
      id,
      title: title || null,
      company: COMPANY,
      location: locationRaw ? clean(locationRaw) || null : null,
      date: parseSpanishDate(dateRaw) || parseJsDate(dateRaw),
      url: `${DETAIL_BASE}${href}`,
      excerpt: null,
      remote: isRemote(`${title} ${locationRaw ?? ""}`),
    })
  }
  return cards
}

function extractBalancedSpan(raw: string, start: number): string | null {
  let depth = 0
  const re = /<span\b|<\/span>/g
  re.lastIndex = start
  let m: RegExpExecArray | null
  while ((m = re.exec(raw))) {
    if (m[0] === "</span>") {
      depth--
      if (depth === 0) return raw.slice(start, m.index + m[0].length)
    } else {
      depth++
    }
  }
  return null
}

export async function fetchDetail(idOrUrl: string): Promise<ServeoJobDetail> {
  let url = idOrUrl
  if (!idOrUrl.startsWith("http")) {
    const id = idOrUrl.replace(/[^\d]/g, "")
    if (!id) throw new Error("Invalid offer id")
    url = `${DETAIL_BASE}/job/x/${id}/`
  }
  const raw = await htmlFetch(url)
  if (!raw || raw.includes("errorpage")) throw new Error("Job not found")

  const title = match(raw, /<h1[^>]*>([\s\S]*?)<\/h1>/)
  const location = match(raw, /class="jobLocation job-location-inline"[^>]*>([\s\S]*?)<\/span>/)
  const dateRaw = match(raw, /itemprop="datePosted"[^>]*content="([^"]*)"/)

  let description: string | null = null
  const descIdx = raw.indexOf('class="jobdescription"')
  if (descIdx >= 0) {
    const spanStart = raw.lastIndexOf("<span", descIdx)
    if (spanStart >= 0) {
      const block = extractBalancedSpan(raw, spanStart)
      if (block) description = clean(block) || null
    }
  }

  const id = match(url, /\/(\d+)\/?$/) || idOrUrl

  return {
    id,
    title: title ? clean(title) : "(untitled)",
    company: COMPANY,
    location: location ? clean(location) || null : null,
    date: parseJsDate(dateRaw) || parseSpanishDate(dateRaw),
    url,
    description: description || "(no description)",
    seniority: null,
    employmentType: null,
    jobFunction: null,
    industries: null,
    isActive: true,
    deadline: null,
    remote: isRemote(raw),
  }
}
