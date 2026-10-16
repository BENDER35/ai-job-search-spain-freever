// Data source: Domestika jobs Atom feed (https://www.domestika.org/es/jobs.atom)
// plus HTML detail pages. No authentication required.
// Each entry has id, title, published, updated, link (alternate), content (HTML body).

export interface DomestikaJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface DomestikaJobDetail extends DomestikaJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
}

export const FEED_URL = "https://www.domestika.org/es/jobs.atom"
export const DETAIL_BASE = "https://www.domestika.org"
export const UA = "Mozilla/5.0 (compatible; domestika-cli/1.0)"

/** Fetch any URL with exponential backoff on 429/5xx, returns body (or "" on 404). */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/atom+xml,text/html,*/*" },
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

function decodeHtmlEntities(text: string): string { return text; }
function stripTags(html: string): string { return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() }
function clean(html: string): string { return stripTags(html) }

/** Parse an Atom feed string into job cards. */
export function parseJobCards(feed: string): DomestikaJobCard[] {
  const results: DomestikaJobCard[] = []
  const entries = feed.split(/<entry>/i).slice(1)
  for (const entry of entries) {
    const end = entry.indexOf("</entry>")
    const chunk = end > 0 ? entry.slice(0, end) : entry

    const idMatch = chunk.match(/<id[^>]*>(.*?)<\/id>/i)
    const titleMatch = chunk.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
    const publishedMatch = chunk.match(/<published>(.*?)<\/published>/i)
    const linkMatch = chunk.match(/<link[^>]*rel="alternate"[^>]*href="([^"]*)"/i)
    const contentMatch = chunk.match(/<content[^>]*>([\s\S]*?)<\/content>/i)

    const rawId = idMatch ? idMatch[1].trim() : ""
    const id = rawId.replace(/^.*Job\//i, "")
    if (!id) continue
    const title = titleMatch ? clean(titleMatch[1]) : null
    const published = publishedMatch ? publishedMatch[1].trim() : null
    const date = published ? published.slice(0, 10) : null
    const url = linkMatch ? linkMatch[1].trim() : `https://www.domestika.org/es/jobs/${id}`

    // Location/company extraction: title is "ROLE - City, Country"; company from img alt inside content
    let location: string | null = null
    let company: string | null = null
    if (title && title.includes(" - ")) {
      const parts = title.split(" - ")
      if (parts.length >= 2) location = parts.slice(1).join(" - ").trim()
      if (parts.length >= 1) title = parts[0].trim()
    }
    if (contentMatch) {
      const contentHtml = contentMatch[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "")
      const altMatch = contentHtml.match(/alt="([^"]+)"/i) || contentHtml.match(/title="([^"]+)"/i)
      if (altMatch) company = altMatch[1]
    }

    results.push({
      id,
      title: title || "(untitled)",
      company: company || null,
      location: location || null,
      date: date || null,
      url: url,
    })
  }
  return results
}

export async function fetchDetail(idOrUrl: string): Promise<DomestikaJobDetail> {
  let url = idOrUrl
  if (!idOrUrl.startsWith("http")) {
    url = `https://www.domestika.org/es/jobs/${idOrUrl}`
  }
  const html = await htmlFetch(url)
  if (!html) throw new Error("Job not found")
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  const companyMatch = html.match(/class="[^"]*job-item__company[^"]*"[^>]*>([\s\S]*?)<\//i)
  const locMatch = html.match(/class="[^"]*t-job-item-location[^"]*"[^>]*>([\s\S]*?)<\//i)
  const descMatch = html.match(/class="[^"]*job-description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  const desc = descMatch
    ? stripTags(descMatch[1].replace(/<\s*br\s*\/?>/gi, "\n").replace(/<\/(p|div|span|li)>/gi, "\n")).replace(/\n{3,}/g, "\n\n").trim()
    : ""
  return {
    id: url.split("/").pop() || idOrUrl,
    title: titleMatch ? clean(titleMatch[1]) : "(untitled)",
    company: companyMatch ? clean(companyMatch[1]) : null,
    location: locMatch ? clean(locMatch[1]) : null,
    date: null,
    url,
    description: desc || "(no description)",
    seniority: null,
    employmentType: null,
    jobFunction: null,
    industries: null,
    isActive: !/no longer available/i.test(html),
  }
}
