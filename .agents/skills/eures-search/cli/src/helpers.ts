// Data source: EURES public REST API (JSON). No authentication required.
// Search: POST https://europa.eu/eures/api/jv-searchengine/public/jv-search/search
// Detail: GET https://europa.eu/eures/api/jv-searchengine/public/jv/id/{id}

export interface EuresJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  description?: string | null
  numberOfPosts?: number | null
}

export interface EuresJobDetail extends EuresJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
  lastApplicationDate: string | null
}

export const SEARCH_URL = "https://europa.eu/eures/api/jv-searchengine/public/jv-search/search"
export const DETAIL_BASE = "https://europa.eu/eures/api/jv-searchengine/public/jv/id"
export const UA = "Mozilla/5.0 (compatible; eures-cli/1.0)"

export async function apiFetch(url: string, init?: RequestInit): Promise<any> {
  const maxRetries = 6
  let delay = 500
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...((init?.headers as Record<string, string>) || {}),
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
    if (response.status === 404) return null
    if (!response.ok) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
    return response.json()
  }
  throw new Error("Request failed after max retries")
}

function jobageToPublicationPeriod(days: number): string | null {
  if (!days || days <= 0) return null
  if (days <= 1) return "LAST_DAY"
  if (days <= 3) return "LAST_THREE_DAYS"
  if (days <= 7) return "LAST_WEEK"
  if (days <= 30) return "LAST_MONTH"
  return null
}

function isoDateFromEpochMs(ms: number | null | undefined): string | null {
  if (!ms) return null
  try {
    return new Date(ms).toISOString().slice(0, 10)
  } catch {
    return null
  }
}

export async function searchEures(opts: {
  query?: string
  country?: string
  jobage: number
  page: number
  limit?: number
}): Promise<EuresJobCard[]> {
  const country = (opts.country || "ES").toUpperCase()
  const locationCodes = country === "EU" ? [] : [country.toLowerCase()]
  const body: any = {
    resultsPerPage: 50,
    page: opts.page,
    sortSearch: "MOST_RECENT",
    keywords: opts.query ? [{ keyword: opts.query, specificSearchCode: "EVERYWHERE" }] : [],
    publicationPeriod: jobageToPublicationPeriod(opts.jobage),
    occupationUris: [],
    skillUris: [],
    requiredExperienceCodes: [],
    positionScheduleCodes: [],
    sectorCodes: [],
    educationAndQualificationLevelCodes: [],
    positionOfferingCodes: [],
    locationCodes,
    euresFlagCodes: [],
    otherBenefitsCodes: [],
    requiredLanguages: [],
    minNumberPost: null,
    sessionId: `session-${Date.now()}`,
    userPreferredLanguage: null,
    requestLanguage: "es",
  }
  const data = await apiFetch(SEARCH_URL, { method: "POST", body: JSON.stringify(body) })
  const jvs = data?.jvs || []
  const cards: EuresJobCard[] = jvs.map((j: any) => {
    const profile = j.jvProfiles?.es || j.jvProfiles?.en || Object.values(j.jvProfiles || {})[0] || {}
    const locations = profile.locations || []
    const loc = locations[0]
    const locationStr = loc ? `${loc.cityName || loc.region || ""} ${loc.countryCode || ""}`.trim() : (j.locationMap ? Object.keys(j.locationMap).join(",") : null)
    const id = j.id
    const url = `https://europa.eu/eures/portal/jv-se/jv-details/${encodeURIComponent(id)}`
    return {
      id,
      title: profile.title || j.title || "(untitled)",
      company: null,
      location: locationStr || null,
      date: isoDateFromEpochMs(j.creationDate),
      url,
      description: profile.description || j.description || null,
      numberOfPosts: profile.numberOfPosts || j.numberOfPosts || null,
    }
  })
  if (opts.limit !== undefined && opts.limit >= 0) return cards.slice(0, opts.limit)
  return cards
}

export async function fetchDetail(id: string): Promise<EuresJobDetail> {
  const url = `${DETAIL_BASE}/${encodeURIComponent(id)}`
  const data = await apiFetch(url)
  if (!data) throw new Error("Job not found")
  const profile = data.jvProfiles?.es || data.jvProfiles?.en || Object.values(data.jvProfiles || {})[0] || {}
  const locations = profile.locations || []
  const loc = locations[0]
  const locationStr = loc ? `${loc.cityName || loc.region || ""} ${loc.countryCode || ""}`.trim() : (data.locationMap ? Object.keys(data.locationMap).join(",") : null)
  const appInstr = profile.applicationInstructions || []
  const applyLink = appInstr.map((a: string) => a.match(/href="([^"]+)"/)?.[1]).filter(Boolean)[0] || null
  const desc = profile.description || data.description || ""
  return {
    id: data.id,
    title: profile.title || data.title || "(untitled)",
    company: null,
    location: locationStr || null,
    date: isoDateFromEpochMs(data.creationDate),
    url: applyLink || `https://europa.eu/eures/portal/jv-se/jv-details/${encodeURIComponent(data.id)}`,
    description: desc || "(no description)",
    seniority: profile.requiredExperiences?.[0]?.experienceCode || null,
    employmentType: profile.positionScheduleCodes?.[0] || null,
    jobFunction: null,
    industries: profile.jobCategoriesCodes?.join(", ") || null,
    isActive: true,
    deadline: profile.lastApplicationDate ? isoDateFromEpochMs(profile.lastApplicationDate) : null,
    lastApplicationDate: isoDateFromEpochMs(profile.lastApplicationDate),
  }
}
