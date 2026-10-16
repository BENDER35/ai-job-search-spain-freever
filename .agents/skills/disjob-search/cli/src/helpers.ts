// Data source: Disjob (disjob.com) job search results HTML via POST form.
// Search is a POST to /ofertas_cerca.php, returning server-rendered HTML listing offers.
// Details are fetched via GET /ofertas_fitxa.php?Up=ID (cookie + referer session).

export interface DisjobJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
}

export interface DisjobJobDetail extends DisjobJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
  salary: string | null
}

export const SEARCH_URL = "https://www.disjob.com/ofertas_cerca.php"
export const DETAIL_URL = "https://www.disjob.com/ofertas_fitxa.php"
export const UA = "Mozilla/5.0 (compatible; disjob-cli/1.0)"

/** Fetch HTML with exponential backoff on 429/5xx. Cookie jar maintained in closure. */
async function fetchWithCookies(url: string, init: RequestInit = {}): Promise<{ status: number; text: string; cookie: string }> {
  const maxRetries = 4
  let delay = 500
  const headers: Record<string, string> = {
    "User-Agent": UA,
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
    ...((init.headers as Record<string, string>) || {}),
  }
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const response = await fetch(url, {
      ...init,
      headers,
      redirect: "follow",
      signal: AbortSignal.timeout(30000),
    })
    const setCookies = response.headers.get("set-cookie")
    let cookie = headers["Cookie"] || ""
    if (setCookies) {
      const parts = setCookies.split(",").map((c) => c.split(";")[0].trim()).filter(Boolean)
      cookie = [...new Set([...parts, ...cookie.split(";").map((c) => c.trim()).filter(Boolean)])].join("; ")
    }
    const text = response.status === 404 ? "" : await response.text()
    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) throw new Error(`Request failed: ${response.status} ${response.statusText}`)
      const jitter = Math.floor(Math.random() * 500)
      await new Promise((r) => setTimeout(r, delay + jitter))
      delay = Math.min(delay * 2, 8000)
      continue
    }
    return { status: response.status, text, cookie }
  }
  throw new Error("Request failed after max retries")
}

export async function htmlFetchWithCookieBootstrap(
  url: string,
  init: RequestInit = {},
  referer?: string,
): Promise<string> {
  // Bootstrap a session cookie.
  const base = await fetchWithCookies("https://www.disjob.com/home.php", { method: "GET" })
  const headers: Record<string, string> = init.headers ? { ...(init.headers as Record<string, string>) } : {}
  headers["Cookie"] = base.cookie
  if (referer) headers["Referer"] = referer
  const r2 = await fetchWithCookies(url, { ...init, headers })
  return r2.text
}

/** Exported helper for POST searches. */
export async function postSearch(query: string, sector = "0", province = "0", remote = false): Promise<string> {
  const params = new URLSearchParams()
  params.set("palabra_clave", query || "")
  params.set("idSector", sector)
  params.set("idProvincia", province)
  if (remote) params.set("TrabajarDesdeCasa_Ofer", "on")
  params.set("accio", "bUSCAR")
  const body = params.toString()
  const base = await fetchWithCookies("https://www.disjob.com/home.php", { method: "GET" })
  const r = await fetchWithCookies(SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Cookie: base.cookie,
      Referer: "https://www.disjob.com/home.php",
    },
    body,
  })
  return r.text
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

function isoDateFromSpanish(ddmmyyyy: string): string | null {
  const m = ddmmyyyy.match(/(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (!m) return null
  const dd = m[1].padStart(2, "0")
  const mm = m[2].padStart(2, "0")
  const yyyy = m[3]
  return `${yyyy}-${mm}-${dd}`
}

export function parseJobCards(html: string): DisjobJobCard[] {
  const results: DisjobJobCard[] = []
  // Each offer row: <tr> ... <td><a href="ofertas_fitxa.php?Up=ID"><strong>Title</strong></a><br>Company</td> ... province ... DD-MM-YYYY ...
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
  let rowMatch: RegExpExecArray | null
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const row = rowMatch[1]
    const idMatch = row.match(/ofertas_fitxa\.php\?Up=([A-Z0-9]+)/i)
    if (!idMatch) continue
    const id = idMatch[1]
    const titleMatch = row.match(/<a[^>]*href="ofertas_fitxa\.php\?Up=[A-Z0-9]+"[^>]*><strong>([\s\S]*?)<\/strong><\/a>/i)
    if (!titleMatch) continue
    const title = clean(titleMatch[1])
    const companyMatch = row.match(/<\/a><br>([\s\S]*?)<\/td>/i)
    const company = companyMatch ? clean(companyMatch[1]) : null
    // province: text between possible <span class="icon-home verd"></span> and </td>
    const locMatch = row.match(/<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*><strong>(\d{1,2}-\d{1,2}-\d{4})<\/strong>/i)
    let location: string | null = null
    if (locMatch) {
      const iconText = clean(locMatch[1]).replace("Trabajar desde casa", "").trim()
      location = iconText || null
    }
    const dateMatch = row.match(/<strong>(\d{1,2}-\d{1,2}-\d{4})<\/strong>/)
    const date = dateMatch ? isoDateFromSpanish(dateMatch[1]) : null
    const url = `https://www.disjob.com/ofertas_fitxa.php?Up=${id}`
    results.push({
      id,
      title: title || "(untitled)",
      company: company || null,
      location: location || null,
      date: date || null,
      url,
    })
  }
  return results
}

export async function fetchDetail(id: string): Promise<DisjobJobDetail> {
  try {
    const url = `${DETAIL_URL}?Up=${id}`
    const html = await htmlFetchWithCookieBootstrap(url, {}, `https://www.disjob.com/ofertas_cerca.php`)
    if (!html || html.length < 100) {
      throw new Error("Detail not found")
    }
    let title: string | null = null
    const titleMatch = html.match(/<h[123][^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h[123]>/i) || html.match(/<strong[^>]*>([\s\S]{5,80})<\/strong>/i)
    if (titleMatch) title = clean(titleMatch[1])
    let company: string | null = null
    const companyMatch = html.match(/Empresa[:\s]*<[^>]*>([\s\S]*?)</i)
    if (companyMatch) company = clean(companyMatch[1])
    let location: string | null = null
    const locMatch = html.match(/Provincia[:\s]*<[^>]*>([\s\S]*?)</i)
    if (locMatch) location = clean(locMatch[1])
    let salary: string | null = null
    const salMatch = html.match(/Salario[:\s]*([^<]{1,80})/i)
    if (salMatch) salary = clean(salMatch[1])
    let description: string | null = null
    const descMatch = html.match(/<div[^>]*class="[^"]*descripcion[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
    if (descMatch) {
      const withBreaks = descMatch[1].replace(/<\s*br\s*\/?>/gi, "\n").replace(/<\/(p|div|span<|message|>li)>/gi, "\n")
      description = clean(withBreaks).replace(/\n{3,}/g, "\n\n").trim() || null
    }
    return {
      id,
      title: title || "(untitled)",
      company: company || null,
      location: location || null,
      date: null,
      url: `https://www.disjob.com/ofertas_fitxa.php?Up=${id}`,
      description: description || "(no description)",
      seniority: null,
      employmentType: null,
      jobFunction: null,
      industries: null,
      isActive: !/no longer available/i.test(html),
      deadline: null,
      salary,
    }
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : String(e))
  }
}
