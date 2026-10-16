// Data source: JobFluent public JSON API (https://www.jobfluent.com/es/empleos.json)
// plus server-rendered HTML detail pages.

export interface JobfluentJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  tags?: string[]
  remote?: boolean
  salary?: { min: number; max: number } | null
}

export interface JobfluentJobDetail extends JobfluentJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_URL = "https://www.jobfluent.com/es/empleos.json"
export const DETAIL_BASE = "https://www.jobfluent.com"
export const UA = "Mozilla/5.0 (compatible; jobfluent-cli/1.0)"

export async function apiFetch(url: string): Promise<any> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "application/json" },
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
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json()
  }
  throw new Error("Request failed after max retries")
}

export async function htmlFetch(url: string): Promise<string> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html,application/xhtml+xml" },
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

function locationFromUrl(url: string): string | null {
  const m = url.match(/\/jobs\/[^/]+-([a-z0-9-]+)-[a-z0-9]{6,}$/i)
  if (m) {
    const seg = m[1].replace(/-/g, " ").trim()
    if (seg) return seg.charAt(0).toUpperCase() + seg.slice(1)
  }
  return null
}

export function parseJobCards(data: any): JobfluentJobCard[] {
  const offers = data?.offers || []
  return offers.map((o: any) => {
    const url = o.url || `https://www.jobfluent.com/jobs/${o.token}`
    return {
      id: String(o.id),
      title: o.position || "(untitled)",
      company: o.company || null,
      location: locationFromUrl(url),
      date: o.published ? o.published.slice(0, 10) : null,
      url,
      tags: o.tags || [],
      remote: !!o.remote,
      salary: o.salary || null,
    }
  })
}

export async function fetchDetail(urlOrId: string): Promise<JobfluentJobDetail> {
  let url = urlOrId
  if (!urlOrId.startsWith("http")) {
    // assume token/id; not enough info, fall back to search URL pattern
    url = `https://www.jobfluent.com/jobs/${urlOrId}`
  }
  const html = await htmlFetch(url)
  if (!html) throw new Error("Job not found")
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([^<]*)<\/title>/i)
  const title = titleMatch ? clean(titleMatch[1]) : "(untitled)"
  // company
  let company: string | null = null
  const compMatch = html.match(/class="[^"]*company[^"]*"[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\//i)
  if (compMatch) company = clean(compMatch[1])
  // description paragraphs
  let description: string | null = null
  const descMatch = html.match(/<p[^>]*>([\s\S]{40,})<\/p>/i)
  if (descMatch) {
    description = clean(descMatch[1]).slice(0, 4000) || null
  }
  return {
    id: url.split("/").pop() || urlOrId,
    title,
    company: company || null,
    location: null,
    date: null,
    url,
    description: description || "(no description)",
    seniority: null,
    employmentType: null,
    jobFunction: null,
    industries: null,
    isActive: !/no longer available/i.test(html),
    deadline: null,
  }
}
