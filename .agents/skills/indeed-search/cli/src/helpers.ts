// Data source: Indeed job search results HTML. No authentication required.
// Search returns an HTML list of job cards; detail returns a single job's HTML.
// We parse both with regex (the markup is shallow and stable; a full DOM parser
// is unnecessary and node-html-parser has known nesting bugs on Indeed cards).

export const SEARCH_URL =
  "https://www.indeed.com/jobs"
export const DETAIL_URL =
  "https://www.indeed.com/viewjob"

/** Indeed job cards are enclosed in class "jobsearch-SerpJobCard". */
export interface IndeedJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface IndeedJobDetail extends IndeedJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
}

export const CARD_CLASS = "jobsearch-SerpJobCard"

/** User-Agent matching the repo convention for Indeed portal CLIs. */
export const UA = "Mozilla/5.0 (compatible; indeed-search-cli/1.0)"

/** Fetch HTML with exponential backoff on 429/5xx. Returns "" on a 404. */
export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "X-Requested-With": "XMLHttpRequest",
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

/** Strip HTML tags and decode basic entities. */
function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/'/g, "'")
    // Numeric character references: decimal (&#233;) and hexadecimal (&#xE9;).
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

/** Remove all HTML tags and normalize whitespace. */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
}

/** Clean: decode entities then strip tags. */
function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html))
}

/** Parse the search response: a flat list of job cards (class jobsearch-SerpJobCard). */
export function parseJobCards(html: string): IndeedJobCard[] {
  const results: IndeedJobCard[] = []
  // Each card starts with data-jk attribute; split on that to isolate chunks.
  const cardRegex = new RegExp(`${CARD_CLASS}[^>]*data-jk="([^"]*)"`, "gi")
  let match: RegExpExecArray | null

  while ((match = cardRegex.exec(html)) !== null) {
    const cardHtml = html.slice(match.index, match.index + 2000) // bounded slice
    const id = match[1]

    // Title: indeed uses <h2><a title="..."> or <a class="jobtitle">
    let title: string | null = null
    const titleMatch = cardHtml.match(
      /<a[^>]*class="jobtitle"[^>]*title="([^"]*)"|<a[^>]*title="([^"]*)"/i,
    )
    if (titleMatch) {
      title = titleMatch[1] || titleMatch[2]
      title = clean(title) || null
    }
    if (!title) continue

    // Company
    let company: string | null = null
    const companyMatch = cardHtml.match(
      /<span[^>]*class="company"[^>]*>([\s\S]*?)<\/span>/i,
    )
    if (companyMatch) company = clean(companyMatch[1]) || null

    // Location + date usually together in a div
    let location: string | null = null
    let date: string | null = null
    const locMatch = cardHtml.match(
      /<div[^>]*class="location"[^>]*>([\s\S]*?)<\/div>/i,
    )
    if (locMatch) {
      const locClean = clean(locMatch[1])
      // Indeed separates location and date; take the first line as location
      const lines = locClean.split(/\s+\|\s*/)
      location = lines[0] || null
      // Date may be in a child span with class "date"
      const dateMatch = cardHtml.match(
        /<span[^>]*class="date"[^>]*>([\s\S]*?)<\/span>/i,
      )
      if (dateMatch) date = clean(dateMatch[1]) || null
    }

    // Indeed job card URL: construct from jobKey
    const jobKey = id || ""
    const url = `https://www.indeed.com/viewjob?jk=${jobKey}`

    results.push({
      id: jobKey,
      title: title || "(untitled)",
      company: company || null,
      location: location || null,
      date: date || null,
      url: url,
    })
  }

  return results
}

/** Parse the single-job detail page. */
export function parseJobDetail(html: string, jobKey: string): IndeedJobDetail {
  const title = html.match(
    /<h1[^>]*class="jobtitle"[^>]*>([\s\S]*?)<\/h1>/i,
  )?.[1]
  const titleClean = title ? clean(title) : "(untitled)"

  // Company: Indeed often has it in a meta tag or in the header
  let company: string | null = null
  const companyMatch = html.match(
    /<meta[^>]*property="og:title"[^>]*content="([^"]*)"|<a[^>]*class="icl-CompanyLogo"[^>]*alt="([^"]*)"/i,
  )
  if (companyMatch) company = companyMatch[1] || companyMatch[2] || null

  // Location
  let location: string | null = null
  const locMatch = html.match(
    /<div[^>]*class="work-at-location"[^>]*>([\s\S]*?)<\/div>/i,
  )
  if (locMatch) location = clean(locMatch[1]) || null

  // Description: the main text block
  let description: string | null = null
  const descMatch = html.match(
    /<div[^>]*id="jobDescriptionText"[^>]*>([\s\S]*?)<\/div>/i,
  )
  if (descMatch) {
    const withBreaks = descMatch[1]
      .replace(/<\s*br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|span|li)>/gi, "\n")
    description = decodeHtmlEntities(stripTags(withBreaks)).replace(/\n{3,}/g, "\n\n").trim() || null
  }

  // Job criteria items (job type, experience, etc.)
  const criteria: Record<string, string> = {}
  const itemRe =
    /<div[^>]*class="job-criteria-group"[^>]*>([\s\S]*?)<\/div>/gi
  let m: RegExpExecArray | null
  while ((m = itemRe.exec(html)) !== null) {
    const group = clean(m[1])
    const labelMatch = group.match(/<span[^>]*class="job-criteria-label"[^>]*>([\s\S]*?)<\/span>/i)
    const textMatch = group.match(/<span[^>]*class="job-criteria-text"[^>]*>([\s\S]*?)<\/span>/i)
    if (labelMatch && textMatch) {
      const label = clean(labelMatch[1]).toLowerCase().replace(/\s+/g, "_")
      criteria[label] = clean(textMatch[1])
    }
  }

  // Closed-state detection: Indeed may show "this job is no longer available"
  const isActive =
    !/no longer available|this job is no longer available/i.test(html)

  return {
    id: jobKey,
    title: titleClean,
    company,
    location,
    date: null, // detail page typically does not repeat the date; use search date
    url: `https://www.indeed.com/viewjob?jk=${jobKey}`,
    description,
    seniority: criteria["years_of_experience"] || null,
    employmentType: criteria["job_type"] || null,
    jobFunction: criteria["job_function"] || null,
    industries: null, // Indeed does not commonly expose industries in the criteria block
    isActive,
  }
