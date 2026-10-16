// Data source: Tecnoempleo (tecnoempleo.com) - Spain's main IT/telecom job board.
// The site is server-rendered HTML, so we fetch the results page and parse each
// job card independently with regex (no runtime dependencies, `bun` + `fetch` only).
//
// Personal use only. robots.txt allows ordinary crawlers on /ofertas-trabajo/...
// but explicitly disallows known AI crawler user-agents (AnthropicBot, Claude,
// GPTBot, ...). This CLI therefore sends the honest repo-convention UA
// "Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)", which is not on the disallow
// list. Keep volume low: a handful of requests per run, no bulk collection.

export const BASE_URL = "https://www.tecnoempleo.com"

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

const UA = "Mozilla/5.0 (compatible; tecnoempleo-cli/1.0)"

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
      signal: AbortSignal.timeout(20000),
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

/** A Unicode code point to a string, dropping out-of-range values. */
function numericEntity(cp: number): string {
  return cp >= 0 && cp <= 0x10ffff ? String.fromCodePoint(cp) : ""
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    // Spanish accents and the euro sign appear as named entities in the markup.
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&ntilde;/g, "ñ")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Ntilde;/g, "Ñ")
    .replace(/&uuml;/g, "ü")
    .replace(/&iquest;/g, "¿")
    .replace(/&iexcl;/g, "¡")
    .replace(/&euro;/g, "€")
    // Numeric character references: decimal (&#233;) and hexadecimal (&#xE9;).
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
    .replace(/&nbsp;/g, " ")
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, " ")
}

export function clean(html: string): string {
  return decodeHtmlEntities(stripTags(html)).replace(/\s+/g, " ").trim()
}

export interface JobCard {
  id: string
  title: string
  company: string | null
  companyUrl: string | null
  location: string | null
  workMode: string | null
  category: string | null
  salary: string | null
  employmentType: string | null
  date: string | null
  url: string
  snippet: string | null
}

export interface JobDetail extends JobCard {
  description: string | null
  deadline: string | null
  applyUrl: string | null
  externalApply: boolean
  skills: string[]
}

/** Convert a DD/MM/YYYY date from the portal to ISO YYYY-MM-DD, or null. */
export function toIsoDate(value: string | null | undefined): string | null {
  if (!value) return null
  const m = value.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (!m) return null
  return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`
}

/** The province code -> name table Tecnoempleo uses in its `pr` filter (1..52). */
const PROVINCE_CODES: Record<string, number> = {
  "a coruna": 231,
  alava: 232,
  albacete: 233,
  alicante: 234,
  almeria: 235,
  asturias: 236,
  avila: 237,
  badajoz: 238,
  baleares: 239,
  barcelona: 240,
  bizkaia: 241,
  burgos: 242,
  caceres: 243,
  cadiz: 244,
  cantabria: 245,
  castellon: 246,
  ceuta: 247,
  "ciudad real": 248,
  cordoba: 249,
  cuenca: 250,
  gipuzkoa: 251,
  girona: 252,
  granada: 253,
  guadalajara: 254,
  huelva: 255,
  huesca: 256,
  jaen: 257,
  "la rioja": 258,
  "las palmas": 259,
  leon: 260,
  lugo: 261,
  lleida: 262,
  madrid: 263,
  malaga: 264,
  melilla: 265,
  murcia: 266,
  navarra: 267,
  ourense: 268,
  palencia: 269,
  pontevedra: 270,
  salamanca: 271,
  "sta. cruz de tenerife": 272,
  segovia: 273,
  sevilla: 274,
  soria: 275,
  tarragona: 276,
  teruel: 277,
  toledo: 278,
  valencia: 279,
  valladolid: 280,
  zamora: 281,
  zaragoza: 282,
}

// Common Castilian spellings / variants users type instead of the official name.
const PROVINCE_ALIASES: Record<string, number> = {
  "la coruna": 231,
  coruna: 231,
  vizcaya: 241,
  bilbao: 241,
  guipuzcoa: 251,
  "san sebastian": 251,
  "donostia": 251,
  gerona: 252,
  lerida: 262,
  "islas baleares": 239,
  mallorca: 239,
  "santa cruz de tenerife": 272,
  "tenerife": 272,
  "gran canaria": 259,
  "comunidad de madrid": 263,
  "comunidad valenciana": 279,
  "castellon de la plana": 246,
  "pais vasco": 241,
  "euskadi": 241,
  "asturies": 236,
  "ourense": 268,
  "orense": 268,
}

/** Lowercase and strip accents so "Málaga" and "malaga" both resolve. */
function normalizeProvince(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
}

/**
 * Resolve a `--location` value to a Tecnoempleo province code (231..282).
 * Accepts a province name (accent-insensitive, with common Castilian aliases)
 * or a raw numeric code. Returns null when the value is not a known province.
 */
export function provinceCode(location: string): number | null {
  const trimmed = location.trim()
  if (/^\d{3}$/.test(trimmed)) {
    const n = parseInt(trimmed, 10)
    return n >= 231 && n <= 282 ? n : null
  }
  const key = normalizeProvince(trimmed)
  return PROVINCE_CODES[key] ?? PROVINCE_ALIASES[key] ?? null
}

/** The documented province names, for error messages. */
export function provinceNames(): string[] {
  return Object.keys(PROVINCE_CODES).map((k) =>
    k.replace(/(^|\s)\S/g, (c) => c.toUpperCase()),
  )
}

/** The `en_remoto` filter value for a workplace mode, or null. */
export function workModeFlag(mode: string | undefined): string | null {
  switch ((mode || "").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) {
    case "remote":
    case "remoto":
    case "teletrabajo":
    case "100% remoto":
      return "1"
    case "onsite":
    case "on-site":
    case "presencial":
      return "2"
    case "hybrid":
    case "hibrido":
      return "3"
    default:
      return null
  }
}

/** Extract the total result count from the page heading ("406 Ofertas ..."). */
export function parseTotal(html: string): number {
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!h1) return 0
  const m = clean(h1[1]).match(/^([\d.]+)/)
  return m ? parseInt(m[1].replace(/\./g, ""), 10) || 0 : 0
}

/**
 * Parse the search results page. Cards are split on the anchor Tecnoempleo
 * emits before each one (`<a name="rf-<hash>" id="rf-<hash>"></a>`), and every
 * field is extracted independently so one malformed card cannot break the run.
 */
export function parseJobCards(html: string): JobCard[] {
  const results: JobCard[] = []
  const chunks = html.split(/<a name="(rf-[0-9a-f]+)"[^>]*><\/a>/i).slice(1)

  for (let i = 0; i + 1 < chunks.length; i += 2) {
    const rf = chunks[i]
    const card = chunks[i + 1]
    if (!rf || !card) continue

    // Detail URL: the title anchor is the canonical link on the card.
    const hrefMatch = card.match(
      /<a\s+href="(https:\/\/www\.tecnoempleo\.com\/[^"]+)"\s+class="font-weight-bold text-cyan-700"\s+title="([^"]*)"/i,
    )
    if (!hrefMatch) continue
    const rawUrl = decodeHtmlEntities(hrefMatch[1])
    const fullUrl = rawUrl.split("?")[0]
    const path = fullUrl.replace(/^https:\/\/www\.tecnoempleo\.com\//, "")
    if (!path) continue
    const title = clean(hrefMatch[2]) || clean(
      card.match(/class="font-weight-bold text-cyan-700"[^>]*>([\s\S]*?)<\/a>/i)?.[1] ?? "",
    )
    if (!title) continue

    // Company (absent on "empresa confidencial" cards -> null).
    let company: string | null = null
    let companyUrl: string | null = null
    const compMatch = card.match(
      /<a\s+title="Ofertas de Empleo ([^"]+)"\s+href="([^"]+)"\s+class="text-primary link-muted">([\s\S]*?)<\/a>/i,
    )
    if (compMatch) {
      company = clean(compMatch[3]) || decodeHtmlEntities(compMatch[1]) || null
      companyUrl = decodeHtmlEntities(compMatch[2]).split("?")[0] || null
    }

    // Location + date. The desktop right column and the mobile span both
    // render DD/MM/YYYY, which is the first date on the card.
    let date: string | null = null
    const dateMatch = card.match(/(\d{2}\/\d{2}\/\d{4})/)
    if (dateMatch) date = toIsoDate(dateMatch[1])

    // Right column (desktop):
    //   "DD/MM/YYYY [badge]<br><br>LOCATION[(Modality)]<br>CATEGORY<br>[SALARY|CONTRACT<br>]"
    // LOCATION is usually wrapped in <b>, but multi-region postings ("España y
    // otras") omit the <b> entirely, so the column is parsed line by line and
    // the first non-date line is treated as the location. That also keeps the
    // other lines correct when <b> is absent.
    let location: string | null = null
    let workMode: string | null = null
    let category: string | null = null
    let salary: string | null = null
    let employmentType: string | null = null
    const rcMatch = card.match(
      /class="col-12 col-lg-3 text-gray-700 pt-2 text-right hidden-md-down"[^>]*>([\s\S]*?)<\/div>/i,
    )
    if (rcMatch) {
      // Drop the badges ("Nueva", "Actualizada") before line-splitting.
      const rc = rcMatch[1].replace(/<span[^>]*>[\s\S]*?<\/span>/gi, "")
      const lines = rc
        .split(/<br\s*\/?>/i)
        .map((p) => clean(p))
        .filter((p) => p && !/^\d{2}\/\d{2}\/\d{4}$/.test(p))
      const first = lines.shift()
      if (first) {
        const modality = first.match(/\((H[íi]brido|Presencial|Teletrabajo)\)/i)
        if (modality) workMode = modality[1]
        location = clean(first.replace(/\((H[íi]brido|Presencial|Teletrabajo)\)\s*$/i, "")) || null
      }
      for (const part of lines) {
        if (/€|euro/i.test(part)) {
          if (!salary) salary = part
        } else if (/(contrato|jornada|freelance|aut[óo]nomo|indefinido|temporal|pr[áa]cticas)/i.test(part)) {
          if (!employmentType) employmentType = part
        } else if (!category) {
          category = part
        }
      }
    }
    // Fallback for a card with no desktop column: the mobile span carries the
    // location (optionally <b>-wrapped) before " - DD/MM/YYYY".
    if (!location) {
      const mobile = card.match(
        /<span class="d-block d-lg-none text-gray-800">\s*(?:<b>)?([\s\S]*?)(?:<\/b>)?\s*-\s*\d{2}\/\d{2}\/\d{4}/,
      )
      if (mobile) location = clean(mobile[1].replace(/<[^>]+>/g, " ")) || null
    }
    if (!workMode && /\bremoto\b/i.test(location ?? "")) workMode = "100% remoto"

    // Short snippet from the desktop description span.
    let snippet: string | null = null
    const snipM = card.match(
      /class="hidden-md-down text-gray-800"[^>]*>([\s\S]*?)<br>\s*<span class="badge/i,
    )
    if (snipM) {
      const text = clean(snipM[1])
      if (text.length > 20) snippet = text.slice(0, 300)
    }

    results.push({
      id: path,
      title,
      company,
      companyUrl,
      location,
      workMode,
      category,
      salary,
      employmentType,
      date,
      url: fullUrl,
      snippet,
    })
  }

  return results
}

interface JsonLdPosting {
  "@type"?: string
  title?: string
  description?: string
  datePosted?: string
  employmentType?: string | string[]
  hiringOrganization?: { name?: string; logo?: string }
  jobLocation?: { address?: { addressLocality?: string; addressRegion?: string; addressCountry?: string } }
  jobLocationType?: string
  baseSalary?: {
    value?: { minValue?: number; maxValue?: number; unitText?: string }
    currency?: string
  }
}

/** Extract and parse the first schema.org JobPosting JSON-LD block, or null. */
function extractJobPostingJsonLd(html: string): JsonLdPosting | null {
  const blocks = html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )
  for (const b of blocks) {
    try {
      const parsed = JSON.parse(b[1].trim())
      const candidates = Array.isArray(parsed) ? parsed : [parsed]
      for (const c of candidates) {
        if (c && typeof c === "object" && c["@type"] === "JobPosting") return c as JsonLdPosting
      }
    } catch {
      // A malformed JSON-LD block must not abort parsing: fall through to the
      // HTML anchors below.
    }
  }
  return null
}

/**
 * The text of a sidebar row whose label is `label` (Ubicación, Salario, ...).
 *
 * Each row is its own `<li class="list-item …">` shaped
 * `<span class="float-end">VALUE</span><div class="badge…">ICON</div><span
 * class="d-inline-block px-2">LABEL</span>`. Parsing a single row at a time (and
 * matching the label exactly) matters: a lazy regex spanning rows would let the
 * "Funciones" query capture the preceding "Ubicación" value, since the design has
 * no attribute distinguishing one row's badge from another's.
 */
function sidebarValue(html: string, label: string): string | null {
  const rowRe = /<li\b[^>]*class="[^"]*list-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi
  for (const row of html.matchAll(rowRe)) {
    const block = row[1]
    const labelMatch = block.match(/<span class="d-inline-block px-2">\s*([\s\S]*?)\s*<\/span>/i)
    if (!labelMatch || clean(labelMatch[1]).toLowerCase() !== label.toLowerCase()) continue
    const valueMatch = block.match(/<span class="float-end">\s*([\s\S]*?)\s*<\/span>/i)
    if (valueMatch) {
      const value = clean(valueMatch[1])
      if (value) return value
    }
  }
  return null
}

function formatSalary(s: JsonLdPosting["baseSalary"]): string | null {
  if (!s || !s.value) return null
  const cur = s.currency ?? "EUR"
  const unit = s.value.unitText === "YEAR" ? "/año" : s.value.unitText ? `/${s.value.unitText.toLowerCase()}` : ""
  const { minValue, maxValue } = s.value
  if (minValue != null && maxValue != null) return `${minValue} - ${maxValue} ${cur}${unit}`
  const one = minValue ?? maxValue
  return one != null ? `${one} ${cur}${unit}` : null
}

/**
 * The inner HTML of the first `<div>` matching `openTag`, tracking nested
 * `<div>` depth so a description that contains its own `<div>` is not truncated
 * (a lazy `([\s\S]*?)</div>` would stop at the first inner close tag — the exact
 * regression the LinkedIn CLI's extractDivContent exists for).
 */
function extractDivByOpenTag(html: string, openTag: RegExp): string | null {
  const open = openTag.exec(html)
  if (!open) return null
  let i = open.index + open[0].length
  let depth = 1
  while (depth > 0 && i < html.length) {
    const nextOpen = html.indexOf("<div", i)
    const nextClose = html.indexOf("</div>", i)
    if (nextClose === -1) return null
    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth++
      i = nextOpen + 4
    } else {
      depth--
      i = nextClose + 6
    }
  }
  return html.slice(open.index + open[0].length, i - 6)
}

/** Convert an HTML fragment to readable text, preserving paragraph breaks. */
function htmlToText(fragment: string): string {
  const withBreaks = fragment
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
  return decodeHtmlEntities(stripTags(withBreaks))
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    // An inline tag (`<b>`, `<span>`) was replaced by a space, which can leave
    // one stranded before punctuation ("negrita .").
    .replace(/ +([.,;:!?])/g, "$1")
    .trim()
}

/**
 * Parse a single job detail page. The page carries a schema.org JobPosting
 * JSON-LD block (title, plain-text description, datePosted, employmentType,
 * hiringOrganization, jobLocation, baseSalary) plus a sidebar list with
 * Ubicación / Jornada / Experiencia / Tipo contrato / Salario. Both are used,
 * each independently, so a missing JSON-LD block degrades to the HTML anchors.
 *
 * `id` and `url` are always the caller's canonical path/URL: the detail page
 * also embeds "similar offers" links, and neither may leak into the result.
 */
export function parseJobDetail(html: string, url: string, id: string): JobDetail {
  const ld = extractJobPostingJsonLd(html)

  const h1 = html.match(/<h1[^>]*itemprop="title"[^>]*>([\s\S]*?)<\/h1>/i)
  const title =
    (ld?.title && clean(ld.title)) ||
    (h1 ? clean(h1[1]) : "") ||
    clean(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").split(" - ")[0] ||
    "(untitled)"

  const company =
    (ld?.hiringOrganization?.name && clean(ld.hiringOrganization.name)) ||
    sidebarValue(html, "Empresa") ||
    null

  const location =
    sidebarValue(html, "Ubicación") ||
    (ld?.jobLocation?.address?.addressLocality ?? null)

  let workMode: string | null = null
  if (ld?.jobLocationType === "TELECOMMUTE" || /\bremoto\b/i.test(location ?? "")) {
    workMode = "100% remoto"
  } else {
    const paren = html.match(/\((H[íi]brido|Presencial|Teletrabajo)\)/i)
    if (paren) workMode = paren[1]
  }

  // The rendered description lives in <div itemprop="description">, which keeps
  // its paragraph breaks as <br/>; the JSON-LD copy is plain text with the
  // breaks flattened, so the HTML is preferred and the JSON-LD is the fallback.
  let description: string | null = null
  const descHtml = extractDivByOpenTag(html, /<div[^>]*itemprop="description"[^>]*>/i)
  if (descHtml) {
    // Drop the "Descripción de la oferta de empleo" heading, if present.
    const withoutHeading = descHtml.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, "")
    description = htmlToText(withoutHeading) || null
  }
  if (!description && ld?.description) {
    description = decodeHtmlEntities(ld.description).replace(/\s*\n\s*/g, "\n").trim() || null
  }

  const employmentType = describeEmployment(ld?.employmentType) ?? sidebarValue(html, "Tipo contrato")

  const salary = formatSalary(ld?.baseSalary) || sidebarValue(html, "Salario")

  // Skills from the sidebar list of tag buttons next to the code badge.
  const skills: string[] = []
  const skillBlock = html.match(/<i class="fi fi-code"><\/i>[\s\S]*?<\/li>/i)
  if (skillBlock) {
    for (const m of skillBlock[0].matchAll(/<button[^>]*>\s*([\s\S]*?)\s*<\/button>/gi)) {
      const s = clean(m[1])
      if (s && !skills.includes(s)) skills.push(s)
    }
  }

  // The external-apply variant adds this notice; directApply is not exposed
  // reliably in the JSON-LD (it is the string "True" there), so the notice is
  // the anchor used here.
  const externalApply = /redirigido a la pagina web de la empresa/i.test(html)

  const applyUrl = `${BASE_URL}/validacion_enviar.php?refer=${id.split("/").pop()?.replace(/^rf-/, "") ?? id}`

  const date =
    (ld?.datePosted && toIsoDate2(ld.datePosted)) ||
    toIsoDate2(html.match(/<span class="badge bg-primary-soft p-2">\s*(\d{2}\/\d{2}\/\d{4})/)?.[1]) ||
    null

  return {
    id,
    title,
    company,
    companyUrl: null,
    location,
    workMode,
    category: sidebarValue(html, "Funciones"),
    salary,
    date,
    url,
    snippet: null,
    description,
    employmentType,
    deadline: null,
    applyUrl,
    externalApply,
    skills,
  }
}

/** ISO date already in YYYY-MM-DD form (JSON-LD datePosted), or null. */
function toIsoDate2(value: string | null | undefined): string | null {
  if (!value) return null
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  return toIsoDate(value)
}

function describeEmployment(value: string | string[] | undefined): string | null {
  if (!value) return null
  const v = Array.isArray(value) ? value[0] : value
  if (!v) return null
  const map: Record<string, string> = {
    FULL_TIME: "Jornada completa",
    PART_TIME: "Jornada parcial",
    CONTRACTOR: "Contrato",
    TEMPORARY: "Temporal",
    INTERN: "Prácticas",
  }
  return map[v] ?? v
}
