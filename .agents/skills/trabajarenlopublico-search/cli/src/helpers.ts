// Data source: "Trabajar en lo público" (trabajarenlopublico.com →
// trabajarenlopublico.ning.com), a Ning community portal for Spanish
// public-sector job seekers. The "Convocatorias en plazo" page lists every
// selection process (convocatoria) whose application window is still open, as
// plain server-rendered HTML: one <h3> link plus a "Plazo de solicitud"
// paragraph per entry. No JavaScript rendering is needed for the listing.
//
// The individual convocatoria pages are NOT server-rendered: each
// /sectores/<sector>/convocatorias/<slug> URL 302-redirects to a
// JavaScript-only sector page, so `detail` re-reads the listing and returns the
// full record it already contains (title, sector, location, deadline, url).

export interface TlpJobCard {
  id: string
  title: string | null
  company: string | null
  location: string | null
  date: string | null
  url: string
  sector: string | null
  deadline: string | null
  remote?: boolean
  excerpt?: string | null
}

export interface TlpJobDetail extends TlpJobCard {
  description: string | null
  isActive: boolean
}

export const LIST_URL = "https://trabajarenlopublico.ning.com/convocatorias"
export const BASE = "https://trabajarenlopublico.ning.com"
export const UA = "Mozilla/5.0 (compatible; trabajarenlopublico-cli/1.0)"
export const PAGE_SIZE = 50
export const DEFAULT_COMPANY = "Administración Pública"

// Sectors whose slug is an autonomous community / region rather than a job
// category. Used as a location fallback when the title carries no place.
const REGION_SECTORS: Record<string, string> = {
  andalucia: "Andalucía",
  aragon: "Aragón",
  asturias: "Asturias",
  baleares: "Illes Balears",
  canarias: "Canarias",
  cantabria: "Cantabria",
  castilla_leon: "Castilla y León",
  castilla_mancha: "Castilla-La Mancha",
  castilla_y_leon: "Castilla y León",
  catalunya: "Cataluña",
  ceuta: "Ceuta",
  comunidad_valenciana: "Comunidad Valenciana",
  extremadura: "Extremadura",
  galicia: "Galicia",
  la_rioja: "La Rioja",
  madrid: "Comunidad de Madrid",
  melilla: "Melilla",
  murcia: "Región de Murcia",
  navarra: "Navarra",
  euskadi: "País Vasco",
  valencia: "Comunidad Valenciana",
}

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

// Accent- and case-insensitive fold for client-side filtering.
export function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

const MONTHS: Record<string, string> = {
  enero: "01",
  febrero: "02",
  marzo: "03",
  abril: "04",
  mayo: "05",
  junio: "06",
  julio: "07",
  agosto: "08",
  septiembre: "09",
  setiembre: "09",
  octubre: "10",
  noviembre: "11",
  diciembre: "12",
}

// "30 de octubre de 2026" → "2026-10-30"
export function parseSpanishDate(text: string | null | undefined): string | null {
  if (!text) return null
  const m = text
    .trim()
    .match(/(\d{1,2})\s+de\s+([a-záéíóú]+)\s+de\s+(\d{4})/i)
  if (!m) return null
  const mon = MONTHS[m[2].toLowerCase()]
  if (!mon) return null
  return `${m[3]}-${mon}-${m[1].padStart(2, "0")}`
}

export function humanizeSector(slug: string | null): string | null {
  if (!slug) return null
  if (REGION_SECTORS[slug]) return REGION_SECTORS[slug]
  const words = slug
    .replace(/-as(?=$|[-_ ])/gi, "/as")
    .replace(/-a(?=$|[-_ ])/gi, "/a")
    .replace(/[-_]/g, " ")
    .trim()
  if (!words) return null
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export function slugOf(url: string): string {
  const bare = url.replace(/[?#].*$/, "").replace(/\/+$/, "")
  const parts = bare.split("/")
  return parts[parts.length - 1] || bare
}

// Best-effort split of a convocatoria title into employer + place. Most titles
// read "... en el <Employer> (<Place>)" or "... en <Employer>, <Place>"; the
// rest fall back to a generic employer and to the sector-derived location.
export function splitOrgLocation(title: string): {
  company: string | null
  location: string | null
} {
  const normalized = (name: string): string =>
    name.replace(/^(?:el|la|los|las)\s+/i, "").replace(/^ámbito de\s+/i, "").trim()
  const t = title.trim()
  let m = t.match(/\s+en\s+(?:el|la|los|las)\s+(.+?)\s*\(([^()]*)\)\s*$/i)
  if (m) return { company: normalized(m[1]), location: m[2].trim() }
  m = t.match(/\s+en\s+(?:el|la|los|las)\s+(.+?),\s*([^,()]+?)\s*$/i)
  if (m) return { company: normalized(m[1]), location: m[2].trim() }
  m = t.match(/\s+en\s+([A-ZÁÉÍÓÚÑ][^,()]*?),\s*([^,()]+?)\s*$/)
  if (m) return { company: normalized(m[1]), location: m[2].trim() }
  m = t.match(/\s+(?:en|de)\s+(?:el|la|los|las)\s+(.+?)\s*\(([^()]*)\)\s*$/i)
  if (m) return { company: normalized(m[1]), location: m[2].trim() }
  m = t.match(/\s+en\s+(?:el|la|los|las)\s+(.+?)\s*$/i)
  if (m) return { company: normalized(m[1]), location: null }
  m = t.match(/\s+del\s+(.+?)\s*$/i)
  if (m) return { company: normalized(m[1]), location: null }
  m = t.match(/\s+de\s+(?:la|el)\s+(.+?)\s*$/i)
  if (m) return { company: normalized(m[1]), location: null }
  m = t.match(/\(([^()]*)\)\s*$/)
  if (m) return { company: null, location: m[1].trim() }
  m = t.match(/,\s*([^,()]+?)\s*$/)
  if (m) return { company: null, location: m[1].trim() }
  return { company: null, location: null }
}

function isRemote(text: string): boolean {
  return /teletrabajo|en remoto|\bremoto\b/i.test(text)
}

const ANCHOR_RE =
  /<a\s+href="(https:\/\/trabajarenlopublico\.ning\.com\/sectores\/([^/"]+)\/convocatorias\/([^"?#]+))"[^>]*>([\s\S]*?)<\/a>/g

export function parseJobCards(html: string): TlpJobCard[] {
  const cards: TlpJobCard[] = []
  const seen = new Set<string>()
  ANCHOR_RE.lastIndex = 0
  let m: RegExpExecArray | null
  while ((m = ANCHOR_RE.exec(html))) {
    const url = m[1]
    const sector = m[2]
    const slug = m[3]
    const title = clean(m[4])
    if (!title || seen.has(url)) continue
    seen.add(url)

    // The "Plazo de solicitud" paragraph follows the title link.
    const tail = html.slice(m.index + m[0].length, m.index + m[0].length + 900)
    const deadlineRaw = tail.match(
      /Plazo de solicitud[^<]{0,40}?(\d{1,2}\s+de\s+[a-záéíóú]+\s+de\s+\d{4})/i,
    )

    const { company, location } = splitOrgLocation(title)
    const sectorLabel = humanizeSector(sector)
    const locationFallback =
      location ?? (REGION_SECTORS[sector] ? REGION_SECTORS[sector] : null)

    cards.push({
      id: slug,
      title,
      company: company || DEFAULT_COMPANY,
      location: locationFallback,
      date: null, // the portal publishes no per-posting date
      url,
      sector: sectorLabel,
      deadline: parseSpanishDate(deadlineRaw ? deadlineRaw[1] : null),
      remote: isRemote(title),
      excerpt: sectorLabel,
    })
  }
  return cards
}

export async function fetchListing(): Promise<TlpJobCard[]> {
  const html = await htmlFetch(LIST_URL)
  if (!html) throw new Error("Listing page not found")
  return parseJobCards(html)
}

function normalizeUrl(url: string): string {
  return url.replace(/[?#].*$/, "").replace(/\/+$/, "")
}

export async function fetchDetail(idOrUrl: string): Promise<TlpJobDetail> {
  const input = idOrUrl.trim()
  const cards = await fetchListing()

  const wanted = input.startsWith("http") ? normalizeUrl(input) : null
  const card = cards.find((c) => {
    const normalized = normalizeUrl(c.url)
    return (
      (wanted !== null && normalized === wanted) ||
      c.id === input ||
      slugOf(c.url) === input ||
      normalized.endsWith(`/${input}`)
    )
  })
  if (!card) throw new Error("Convocatoria not found in the current listing")

  const isActive =
    card.deadline === null || card.deadline >= new Date().toISOString().slice(0, 10)

  return {
    ...card,
    description: null,
    isActive,
  }
}
