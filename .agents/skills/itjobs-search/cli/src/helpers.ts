// Data source: ITJobs (itjobs.es) job search results HTML. No authentication required.
// Search: https://www.itjobs.es/empleo?search=KEYWORDS&page=N
// Detail: https://www.itjobs.es/empleo/{id}/{slug}

export interface ItjobsJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface ItjobsJobDetail extends ItjobsJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_URL = "https://www.itjobs.es/empleo"
export const DETAIL_BASE = "https://www.itjobs.es/empleo"
export const UA = "Mozilla/5.0 (compatible; itjobs-cli/1.0)"

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
      signal: AbortSignal.timeout(30000),
    })
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
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

export function parseJobCards(html: string): ItjobsJobCard[] {
  const results: ItjobsJobCard[] = []
  // Each card: <a class="title" title="{title}" href="/empleo/{id}/{slug}">{title}</a> ...
  // company: <div class="list-name"><a title="{company}" href="/empresa/...">{company}</a></div>
  const cardRegex = /<a[^>]*class="title"[^>]*title="([^"]*)"[^>]*href="(\/empleo\/(\d+)\/[^"]*)"[^>]*>/gi
  let match: RegExpExecArray | null
  while ((match = cardRegex.exec(html)) !== null) {
    const title = decodeHtmlEntities(match[1])
    const id = match[3]
    const urlPath = match[2]
    const cardHtml = html.slice(match.index, match.index + 600)
    let company: string | null = null
    const companyMatch = cardHtml.match(/class="list-name"[^>]*>[\s\S]*?<a[^>]*title="([^"]*)"/i)
    if (companyMatch) company = decodeHtmlEntities(companyMatch[1])
    const url = `https://www.itjobs.es${urlPath}`
    results.push({
      id,
      title: title || "(untitled)",
      company: company || null,
      location: null, // ITJobs cards don't expose province; detail page does
      date: null,
      url,
    })
  }
  return results
}

export function parseJobDetail(html: string, offerId: string): ItjobsJobDetail {
  const title = html.match(/<h1[^>]*class="title"[^>]*>([\s\S]*?)<\/h1>/i)?.[1]
  const titleClean = title ? clean(title) : "(untitled)"
  let company: string | null = null
  const companyMatch = html.match(/class="company-logo[^>]*>[\s\S]*?<a[^>]*title="([^"]*)"/i)
  if (companyMatch) company = decodeHtmlEntities(companyMatch[1])
  let description: string | null = null
  const descMatch = html.match(/<div[^>]*class="[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  if (descMatch) {
    const withBreaks = descMatch[1].replace(/<\s*br\s*\/?>/gi, "\n").replace(/<\/(p|div|span|li)>/gi, "\n")
    description = clean(withBreaks).replace(/\n{3,}/g, "\n\n").trim() || null
  }
  // fallback: use the JSON-LD description embedded in script
  if (!description) {
    const jsonLdMatch = html.match(/"description"\s*:\s*"((?:\\.|[^"\\])*)"/i)
    if (jsonLdMatch) {
      try {
        description = JSON.parse(`"${jsonLdMatch[1]}"`)
      } catch {
        description = null
      }
    }
  }
  return {
    id: offerId,
    title: titleClean,
    company: company || null,
    location: null,
    date: null,
    url: `https://www.itjobs.es/empleo/${offerId}`,
    description: description || "(no description)",
    seniority: null,
    employmentType: null,
    jobFunction: null,
    industries: null,
    isActive: !/no longer available/i.test(html),
    deadline: null,
  }
}
