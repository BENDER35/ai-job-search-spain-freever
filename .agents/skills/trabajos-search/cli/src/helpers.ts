// Data source: Trabajos.com (trabajos.com) server-rendered HTML.
// Search results and job detail pages are plain HTML — no authentication,
// no JavaScript rendering required.

export interface TrabajosJobCard {
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
}

export interface TrabajosJobDetail extends TrabajosJobCard {
  description: string | null
  seniority: string | null
  employmentType: string | null
  jobFunction: string | null
  industries: string | null
  isActive: boolean
  deadline: string | null
}

export const SEARCH_BASE = "https://www.trabajos.com/ofertas-empleo"
export const DETAIL_BASE = "https://www.trabajos.com/ofertas"
export const UA = "Mozilla/5.0 (compatible; trabajos-cli/1.0)"
export const PAGE_SIZE = 40

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

function stripComments(html: string): string {
  return html.replace(/<!--[\s\S]*?-->/g, "")
}

function isRemote(html: string): boolean {
  return /teletrabajo|remoto|en remoto/i.test(stripComments(html))
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

function toIso(ddmmyyyy: string | undefined): string | null {
  if (!ddmmyyyy) return null
  const m = ddmmyyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!m) return null
  return `${m[3]}-${m[2]}-${m[1]}`
}

function match(text: string, re: RegExp): string | null {
  const m = text.match(re)
  return m ? m[1] : null
}

export function parseJobCards(html: string): TrabajosJobCard[] {
  const cards: TrabajosJobCard[] = []
  // Each search-result card starts with `<div class="listado2014 card oferta">`.
  const chunks = html.split("listado2014 card oferta")
  for (const chunk of chunks.slice(1)) {
    const titleMatch = chunk.match(
      /<a href="(https:\/\/www\.trabajos\.com\/ofertas\/(\d+)\/[^"]+)"[^>]*class="oferta j4m_link"[^>]*>([\s\S]*?)<\/a>/,
    )
    if (!titleMatch) continue
    const url = titleMatch[1]
    const id = titleMatch[2]
    const title = clean(titleMatch[3])

    const companyRaw = match(chunk, /class="empresa"[^>]*>\s*<span>([\s\S]*?)<\/span>/)
    const locationRaw = match(
      chunk,
      /<span class="location"><span><strong>([^<]*)<\/strong>,?\s*([^<]*)<\/span>/,
    )
    let location: string | null = null
    if (locationRaw) {
      const locMatch = chunk.match(
        /<span class="location"><span><strong>([^<]*)<\/strong>,?\s*([^<]*)<\/span>/,
      )
      if (locMatch) {
        const city = clean(locMatch[1])
        const province = clean(locMatch[2])
        location = province && province !== city ? `${city}, ${province}` : city
      }
    }
    const dateRaw = match(chunk, /<span class="fecha">(\d{2}\/\d{2}\/\d{4})<\/span>/)
    const excerptRaw = match(chunk, /<div class="doextended">([\s\S]*?)<\/div>/)

    const oiRaw = match(chunk, /<p class="oi">([\s\S]*?)<\/p>/)
    let salary: string | null = null
    let contract: string | null = null
    if (oiRaw) {
      const salMatch = oiRaw.match(/<span class="salario">([\s\S]*?)<\/span>/)
      if (salMatch) salary = clean(salMatch[1])
      const spans = [...oiRaw.matchAll(/<span(?![^>]*class="salario")[^>]*>([\s\S]*?)<\/span>/g)]
      if (spans[0]) contract = clean(spans[0][1])
    }

    cards.push({
      id,
      title: title || null,
      company: companyRaw ? clean(companyRaw) : null,
      location,
      date: toIso(dateRaw ?? undefined),
      url,
      excerpt: excerptRaw ? clean(excerptRaw) || null : null,
      salary,
      contract,
      remote: isRemote(chunk),
    })
  }
  return cards
}

export async function fetchDetail(idOrUrl: string): Promise<TrabajosJobDetail> {
  let url = idOrUrl
  if (!idOrUrl.startsWith("http")) {
    const id = idOrUrl.replace(/[^\d]/g, "")
    if (!id) throw new Error("Invalid offer id")
    url = `${DETAIL_BASE}/${id}/`
  }
  const raw = await htmlFetch(url)
  if (!raw) throw new Error("Job not found")
  const title = match(raw, /<h1>([\s\S]*?)<\/h1>/)
  const company =
    match(raw, /class="empresa"[^>]*>([\s\S]*?)(?:<img|<\/a>)/) || null
  let locFull: string | null = null
  const locIdx = raw.indexOf('class="localizacion"')
  if (locIdx >= 0) {
    const open = raw.indexOf(">", locIdx)
    const close = raw.indexOf("</div>", open)
    if (open >= 0 && close > open) {
      const locText = clean(raw.slice(open + 1, close))
      if (locText) locFull = locText
    }
  }
  const dateRaw = match(raw, /class="fecha">(\d{2}\/\d{2}\/\d{4})/)

  const requisitos: Record<string, string> = {}
  const bloqueIdx = raw.indexOf("bloqueoferta")
  if (bloqueIdx >= 0) {
    const block = raw.slice(bloqueIdx, bloqueIdx + 4000)
    for (const m of block.matchAll(
      /<div class="detalle"><div>([\s\S]*?)<\/div>\s*(?:<span>)?\s*(?:<strong>)?([\s\S]*?)(?:<\/strong>)?\s*(?:<\/span>)?<\/div>/g,
    )) {
      requisitos[clean(m[1]).replace(/:$/, "")] = clean(m[2])
    }
  }

  let description: string | null = null
  const subIdx = raw.indexOf('class="subtitulo"')
  if (subIdx >= 0) {
    const divStart = raw.lastIndexOf("<div", subIdx)
    if (divStart >= 0) {
      let depth = 0
      const re = /<div\b|<\/div>/g
      re.lastIndex = divStart
      let m: RegExpExecArray | null
      let end = -1
      while ((m = re.exec(raw))) {
        if (m[0].startsWith("</div")) {
          depth--
          if (depth === 0) {
            end = m.index
            break
          }
        } else {
          depth++
        }
      }
      const block = end >= 0 ? raw.slice(divStart, end) : raw.slice(divStart, divStart + 6000)
      description = clean(block) || null
    }
  }

  const employmentType =
    requisitos["Tipo de contrato"] || requisitos["Jornada"] || null
  const seniority = requisitos["Años de experiencia"] || null
  const salary = requisitos["Salario"] || null
  const remote = isRemote(raw)

  return {
    id: match(url, /\/ofertas\/(\d+)/) || idOrUrl,
    title: title ? clean(title) : "(untitled)",
    company: company ? clean(company) : null,
    location: locFull,
    date: toIso(dateRaw ?? undefined),
    url,
    description: description || "(no description)",
    seniority,
    employmentType,
    jobFunction: null,
    industries: null,
    isActive: !/no (?:longer )?disponible|oferta (?:cerrada|caducada)/i.test(raw),
    deadline: null,
    salary,
    contract: requisitos["Tipo de contrato"] || null,
    remote,
  }
}
