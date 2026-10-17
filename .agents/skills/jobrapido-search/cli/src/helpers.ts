// Data source: Jobrapido Spain (es.jobrapido.com).
//
// Search: `/Ofertas-de-empleo-para-<query>[-en-<location>]` is a server-rendered
// Angular page. Every result card carries a `data-advert` JSON attribute with
// the advert id, title, company, location, posting date, source site and the
// sponsored flag, so no visible-markup scraping is needed.
//
// Detail: `/jobpreview/<id>` is a Next.js App Router page. Its RSC flight
// payload embeds a schema.org `JobPosting` JSON-LD blob with the full
// description, employment type, salary and dates.
//
// robots.txt note: the SEO search paths are allowed for every agent. The
// pagination (`?p=`), location (`?l=`) and offset (`?o=`) query params are
// disallowed, and `/jobpreview/*` is disallowed for generic crawlers while
// being explicitly allowed for named AI agents (Claude-User, GPTBot, …). See
// SKILL.md ("Personal use only") and url-reference.md.

export interface JobrapidoJobCard {
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
  source?: string | null
  sponsored?: boolean
}

export interface JobrapidoJobDetail extends JobrapidoJobCard {
  description: string | null
  employmentType: string | null
  isActive: boolean
  deadline: string | null
  applyUrl: string
}

export const BASE = "https://es.jobrapido.com"
export const SEARCH_PATH = `${BASE}/Ofertas-de-empleo`
export const DETAIL_PATH = `${BASE}/jobpreview`
export const UA = "Mozilla/5.0 (compatible; jobrapido-cli/1.0)"

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

const SALARY_UNITS: Record<string, string> = {
  YEAR: "/año",
  MONTH: "/mes",
  WEEK: "/semana",
  DAY: "/día",
  HOUR: "/hora",
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  FULL_TIME: "Jornada completa",
  "FULL TIME": "Jornada completa",
  FULLTIME: "Jornada completa",
  PART_TIME: "Jornada parcial",
  "PART TIME": "Jornada parcial",
  PARTTIME: "Jornada parcial",
  CONTRACTOR: "Autónomo",
  TEMPORARY: "Temporal",
  INTERN: "Becario/a",
  VOLUNTEER: "Voluntariado",
  PER_DIEM: "Por días",
  OTHER: "Otro",
}

export async function htmlFetch(url: string): Promise<string> {
  let res: Response
  try {
    res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9",
      },
      redirect: "follow",
    })
  } catch (e) {
    throw new Error(`Request failed: ${e instanceof Error ? e.message : String(e)}`)
  }
  if (res.status === 404) return ""
  if (!res.ok) throw new Error(`Request failed with HTTP ${res.status}`)
  return res.text()
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

function clean(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim()
}

// Preserve paragraph/line breaks (used for the detail description) instead of
// collapsing everything into one line.
function htmlToText(html: string): string {
  const withBreaks = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6]|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "- ")
  return decodeHtmlEntities(withBreaks.replace(/<[^>]+>/g, " "))
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
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

function pad2(n: number): string {
  return String(n).padStart(2, "0")
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}

function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10)
}

// Jobrapido prints posting dates as `03 oct` (day + abbreviated Spanish month)
// with no year. The year is inferred: a month/day up to a day in the future is
// the current year, anything further ahead belongs to the previous year.
export function parseDate(raw: string | null | undefined): string | null {
  if (!raw) return null
  const s = raw.trim().toLowerCase()
  if (!s) return null
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10)
  if (/^hoy\b/.test(s)) return todayIso()
  if (/^ayer\b/.test(s)) return isoDaysAgo(1)

  const rel = s.match(/(\d+)\s*(min|minutos?|horas?|hrs?|h|d[ií]as?)\b/)
  if (rel) {
    const n = Number(rel[1])
    const unit = rel[2]
    if (/^min/.test(unit)) return todayIso()
    if (/^(hora|hrs|h)$/.test(unit)) return isoDaysAgo(Math.floor(n / 24))
    return isoDaysAgo(n)
  }

  const m = s.match(/^(\d{1,2})\s+([a-záéíóúñ]{3,})/)
  if (m) {
    const day = Number(m[1])
    const word = m[2]
    const mon = MONTHS[word.slice(0, 4)] ?? MONTHS[word.slice(0, 3)]
    if (mon && day >= 1 && day <= 31) {
      let year = new Date().getUTCFullYear()
      const candidate = `${year}-${mon}-${pad2(day)}`
      // Allow a 1-day clock skew before rolling back a year.
      const cutoff = new Date(Date.now() + 86400000).toISOString().slice(0, 10)
      if (candidate > cutoff) year -= 1
      return `${year}-${mon}-${pad2(day)}`
    }
  }
  return null
}

export interface SearchPageResult {
  total: number
  cards: JobrapidoJobCard[]
}

// Every card starts with `data-advert='<json>'`. Parse each attribute on its
// own so one malformed card cannot break the rest of the page.
export function parseJobCards(html: string): SearchPageResult {
  const cards: JobrapidoJobCard[] = []
  const totalM = html.match(/\btotalResults:\s*(\d+)/)
  const total = totalM ? Number(totalM[1]) : 0

  const re = /data-advert='([^']+)'/g
  let m: RegExpExecArray | null
  const seen = new Set<string>()
  while ((m = re.exec(html)) !== null) {
    let adv: Record<string, unknown>
    try {
      adv = JSON.parse(decodeHtmlEntities(m[1])) as Record<string, unknown>
    } catch {
      continue
    }
    const id = adv.advertId != null ? String(adv.advertId) : ""
    if (!id || seen.has(id)) continue
    seen.add(id)

    const title = clean(String(adv.title ?? "")) || null
    const company = clean(String(adv.company ?? adv.companyForTitle ?? "")) || null
    const locations = Array.isArray(adv.locations) ? (adv.locations as unknown[]).map((l) => clean(String(l))) : []
    const location =
      (adv.locationsLabel != null ? clean(String(adv.locationsLabel)) : "") ||
      (adv.location != null ? clean(String(adv.location)) : "") ||
      locations.filter(Boolean).join(", ") ||
      null

    cards.push({
      id,
      title,
      company,
      location,
      date: parseDate(typeof adv.date === "string" ? adv.date : null),
      url: `${DETAIL_PATH}/${id}`,
      excerpt: null,
      salary: null,
      contract: null,
      remote: isRemote(`${title ?? ""} ${location ?? ""}`),
      source: adv.website != null ? clean(String(adv.website)) || null : null,
      sponsored: adv.isSponsored === true,
    })
  }
  return { total, cards }
}

export interface NormalizedDetail {
  id: string
  url: string
}

// Detail URLs are `/jobpreview/<advertId>`; the advert id alone is enough.
export function normalizeDetail(input: string): NormalizedDetail | null {
  const t = input.trim()
  if (!t) return null
  if (/^https?:\/\//i.test(t)) {
    const idm = t.replace(/[?#].*$/, "").match(/\/(\d{6,})\/?$/)
    if (!idm) return null
    return { id: idm[1], url: `${DETAIL_PATH}/${idm[1]}` }
  }
  if (/^\d{6,}$/.test(t)) return { id: t, url: `${DETAIL_PATH}/${t}` }
  return null
}

// The Next.js page streams its data as `self.__next_f.push([1,"<escaped>"])`
// chunks. Join the decoded chunks and pull the embedded JobPosting JSON out.
function rscBlob(html: string): string {
  const re = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g
  let blob = ""
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    try {
      blob += JSON.parse(`"${m[1]}"`) as string
    } catch {
      /* skip malformed chunk */
    }
  }
  return blob
}

function extractJobPosting(blob: string): Record<string, unknown> | null {
  const anchor = blob.indexOf('"@type":"JobPosting"')
  if (anchor < 0) return null
  const start = blob.lastIndexOf("{", anchor)
  if (start < 0) return null
  let depth = 0
  let inStr = false
  let esc = false
  for (let i = start; i < blob.length; i++) {
    const c = blob[i]
    if (inStr) {
      if (esc) esc = false
      else if (c === "\\") esc = true
      else if (c === '"') inStr = false
    } else if (c === '"') {
      inStr = true
    } else if (c === "{") {
      depth++
    } else if (c === "}") {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(blob.slice(start, i + 1)) as Record<string, unknown>
        } catch {
          return null
        }
      }
    }
  }
  return null
}


function extractDivInner(html: string, start: number): string | null {
  const re = /<(\/?)div\b[^>]*>/gi
  re.lastIndex = start
  let depth = 0
  let innerStart = -1
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    if (m[1] === "/") {
      depth--
      if (depth === 0 && innerStart !== -1) return html.slice(innerStart, m.index)
    } else {
      depth++
      if (depth === 1) innerStart = re.lastIndex
    }
  }
  return null
}

// Pull the <dd> that follows the <dt> whose label contains `marker` inside the
// detail page's <dl> definition list (location / company / employment type).
function dlValue(dl: string, marker: string): string | null {
  const parts = dl.split(/<div\b/i)
  for (const part of parts) {
    if (!part.includes(marker)) continue
    const m = part.match(/<dd\b[^>]*>([\s\S]*?)<\/dd>/i)
    if (m) {
      const value = clean(m[1])
      if (value) return value
    }
  }
  return null
}

function epochToIso(raw: string): string | null {
  if (/^\d{10,}$/.test(raw)) {
    const ms = Number(raw)
    if (Number.isFinite(ms)) {
      const d = new Date(ms)
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
    }
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.slice(0, 10)
  return null
}

// The detail page is server-rendered: title, location/company/employment type,
// posting date and the full HTML description are all present in the markup, so
// no JavaScript rendering is needed.
export async function fetchDetail(idOrUrl: string): Promise<JobrapidoJobDetail> {
  const norm = normalizeDetail(idOrUrl)
  if (!norm) throw new Error("Could not parse a Jobrapido offer id or URL from input")

  const html = await htmlFetch(norm.url)
  if (!html) throw new Error("Job not found")

  const titleM = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  const title = titleM ? clean(titleM[1]) || null : null
  if (!title) throw new Error("Job not found")

  const dlM = html.match(/<dl\b[^>]*>([\s\S]*?)<\/dl>/)
  const dl = dlM ? dlM[1] : ""
  const location = dlValue(dl, "Ubicación del trabajo")
  const company = dlValue(dl, "Empresa")
  const rawType = dlValue(dl, "Tipo de empleo")
  const employmentType = rawType ? EMPLOYMENT_TYPES[rawType.toUpperCase()] ?? rawType : null

  let description: string | null = null
  const descMarker = html.indexOf('class="typo--basic-light')
  if (descMarker >= 0) {
    const open = html.lastIndexOf("<", descMarker)
    const inner = open >= 0 ? extractDivInner(html, open) : null
    if (inner) description = htmlToText(inner) || null
  }

  const sourceM = html.match(/Publicado en\s+([a-z0-9.-]+\.[a-z]{2,})/i)
  const source = sourceM ? sourceM[1] : null

  const timeM = html.match(/<time\b[^>]*dateTime="([^"]+)"/i)
  const date = timeM ? epochToIso(timeM[1]) : null

  const applyM = html.match(/href="(?:https?:)?(\/\/open\.app\.jobrapido\.com\/[^"]+)"/i)
  const applyUrl = applyM ? `https:${applyM[1]}` : norm.url

  const inactive = /(ya no est[aá] disponible|oferta\s+caducada|no longer available)/i.test(html)

  return {
    id: norm.id,
    title,
    company,
    location,
    date,
    url: norm.url,
    excerpt: description ? compact(description) : null,
    salary: null,
    contract: null,
    remote: isRemote(`${title} ${description ?? ""}`),
    source,
    sponsored: false,
    description,
    employmentType,
    isActive: !inactive,
    deadline: null,
    applyUrl,
  }
}
