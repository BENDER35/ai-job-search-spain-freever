// Data source: Infoempleo job search results HTML. No authentication required.
// Search returns an HTML list of job cards; detail returns a single job's HTML.
// We parse both with regex (the markup is shallow and stable; a full DOM parser
// is unnecessary and node-html-parser has known nesting bugs on Infoempleo cards).

export interface InfoempleoJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface InfoempleoJobDetail extends InfoempleoJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
}

export const SEARCH_URL = "https://www.infoempleo.com/ofertas-trabajo"
export const DETAIL_URL = "https://www.infoempleo.com/ofertas"
export const CARD_CLASS = "row infoempleo"

export const UA = "Mozilla/5.0 (compatible; infoempleo-cli/1.0)"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      }
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    if (response.status === 404) return ""
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    }
    return response.text()
  }
  throw new Error("Request failed after max retries")
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, dec) => {
      const cp = parseInt(dec, 10)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => {
      const cp = parseInt(hex, 16)
      return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
    })
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

export function parseJobCards(html: string): InfoempleoJobCard[] {
  const results: InfoempleoJobCard[] = []
  const cardRegex = /class="[^"]*oferta[^"]*"[^>]*data-id="([^"]*)"/gi
  let match: RegExpExecArray | null

  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = html.slice(match.index, match.index + 1500)
    const id = match[1]

    let title: string | null = null
    const titleMatch = cardHtml.match(/class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>|<h[23][^>]*>([\s\S]*?)<\/h[23]>/i)
    if (titleMatch) {
      title = titleMatch[1] || titleMatch[2]
      title = clean(title) || null
    }
    if (!title) continue

    let company: string | null = null
    const companyMatch = cardHtml.match(/class="[^"]*company[^"]*"[^>]*>([\s\S]*?)</i)
    if (companyMatch) company = clean(companyMatch[1]) || null

    let location: string | null = null
    const locMatch = cardHtml.match(/class="[^"]*location[^"]*"[^>]*>([\s\S]*?)</i)
    if (locMatch) location = clean(locMatch[1]) || null

    let date: string | null = null
    const dateMatch = cardHtml.match(/class="[^"]*date[^"]*"[^>]*>([\s\S]*?)</i)
    if (dateMatch) date = clean(dateMatch[1]) || null

    const url = `https://www.infoempleo.com/ofertas/${id}`

    results.push({
      id: id,
      title: title || "(untitled)",
      company: company || null,
      location: location || null,
      date: date || null,
      url: url,
    })
  }

  return results
}

export function parseJobDetail(html: string, offerId: string): InfoempleoJobDetail {
  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  const titleClean = title ? clean(title) : "(untitled)"

  let company: string | null = null
  const companyMatch = html.match(/class="[^"]*empresa[^"]*"[^>]*>([\s\S]*?)</i)
  if (companyMatch) company = clean(companyMatch[1]) || null

  let location: string | null = null
  const locMatch = html.match(/class="[^"]*ubicacion[^"]*"[^>]*>([\s\S]*?)</i)
  if (locMatch) location = clean(locMatch[1]) || null

  let description: string | null = null
  const descMatch = html.match(/class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (descMatch) {
    const withBreaks = descMatch[1]
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|span|li)>/gi, "\n")
    description = clean(withBreaks).replace(/\n{3,}/g, "\n\n").trim() || null
  }

  return {
    id: offerId,
    title: titleClean,
    company: company || null,
    location: location || null,
    date: null,
    url: `https://www.infoempleo.com/ofertas/${offerId}`,
    description: description || "(no description)",
    seniority: null,
    employmentType: null,
    jobFunction: null,
    industries: null,
    isActive: !/no longer available/i.test(html),
  }
}
