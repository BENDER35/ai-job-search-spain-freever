// Data source: JobToday (jobtoday.com) server-rendered Next.js pages with
// embedded __NEXT_DATA__ JSON. No authentication required.

export interface JobtodayJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  description?: string | null
  salary?: { from?: number; to?: number; currencyCode?: string; period?: string } | null
  remote?: boolean
}

export interface JobtodayJobDetail extends JobtodayJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_BASE = "https://jobtoday.com/es/trabajos"
export const DETAIL_BASE = "https://jobtoday.com/es/trabajo"
export const UA = "Mozilla/5.0 (compatible; jobtoday-cli/1.0)"

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

function extractNextData(html: string): any {
  const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s)
  if (!m) return null
  try {
    return JSON.parse(m[1])
  } catch {
    return null
  }
}

function isoDateFromSecondsAgo(seconds: number | undefined): string | null {
  if (!seconds) return null
  try {
    const d = new Date(Date.now() - seconds * 1000)
    return d.toISOString().slice(0, 10)
  } catch {
    return null
  }
}

export function parseJobCards(html: string): JobtodayJobCard[] {
  const data = extractNextData(html)
  if (!data) return []
  const pp = data?.props?.pageProps || {}
  const feed = pp.feed || {}
  const sections = feed.sections || []
  let items: any[] = []
  for (const s of sections) {
    if (Array.isArray(s.items)) items = items.concat(s.items)
  }
  const results: JobtodayJobCard[] = []
  for (const it of items) {
    if (it?.type !== "job") continue
    const p = it.payload || {}
    const key = p.key
    if (!key) continue
    const addr = p.addressInfo || {}
    const city = addr.city || addr.cityArea || null
    const location = city ? `${city}${addr.state ? ", " + addr.state : ""}` : (p.address || null)
    const title = p.role || "(untitled)"
    const company = p.companyName || p.company?.name || null
    const url = `https://jobtoday.com${p.canonicalUrl || `/es/trabajo/${title.toLowerCase().replace(/\s+/g, "-")}-${key}`}`
    results.push({
      id: key,
      title,
      company: company || null,
      location: location || null,
      date: isoDateFromSecondsAgo(p.postedSecondsAgo),
      url,
      description: p.description || null,
      salary: p.salary || null,
      remote: (p.employmentType || "").toLowerCase().includes("remote"),
    })
  }
  return results
}

export async function fetchDetail(idOrUrl: string): Promise<JobtodayJobDetail> {
  let url = idOrUrl
  if (!idOrUrl.startsWith("http")) {
    url = `https://jobtoday.com/es/trabajo/${idOrUrl}`
  }
  const html = await htmlFetch(url)
  if (!html) throw new Error("Job not found")
  const data = extractNextData(html)
  const job = data?.props?.pageProps?.job
  if (!job) throw new Error("Job not found")
  const addr = job.addressInfo || {}
  const city = addr.city || addr.cityArea || null
  const location = city ? `${city}${addr.state ? ", " + addr.state : ""}` : (job.address || null)
  const salary = job.salary
  const salaryStr = salary && salary.isValid ? `${salary.from || ""}${salary.to ? "-" + salary.to : ""} ${salary.currencyCode || ""}/${salary.period || ""}`.trim() : null
  return {
    id: job.key || idOrUrl,
    title: job.role || "(untitled)",
    company: job.companyName || job.company?.name || null,
    location: location || null,
    date: isoDateFromSecondsAgo(job.postedSecondsAgo),
    url: `https://jobtoday.com${job.canonicalUrl || ""}`,
    description: job.description || "(no description)",
    seniority: null,
    employmentType: job.employmentType || null,
    jobFunction: job.categories?.[0]?.label || null,
    industries: null,
    isActive: true,
    deadline: null,
  }
}
