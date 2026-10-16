// Data source: the InfoJobs public REST API (https://api.infojobs.net).
//
// Unlike the HTML-scraping portals there is no markup to parse: the search and
// detail operations return JSON, which we reshape into the portal-skill
// contract's result fields. InfoJobs is Spain-only (its province filter covers
// the 52 Spanish provinces), so this skill is scoped to the Spanish market.
//
// Authentication: every call is authenticated. Public operations accept app
// HTTP Basic authentication (client id + secret base64-encoded). The docs also
// describe combining Basic with a user Bearer token, so the client tries a
// client-credentials access token first and prefers it when one is issued,
// falling back to app Basic when it is not. Credentials are read ONLY from the
// environment (INFOJOBS_CLIENT_ID / INFOJOBS_CLIENT_SECRET); if they are unset
// the CLI exits with MISSING_CREDENTIALS before any request is made.

export const BASE_URL = "https://api.infojobs.net"
// The public offer pages live on the main portal host. The API's `link` field
// already carries the full URL, but this is the fallback/canonical base - and,
// because tests/test_apply_host_check.py derives the portal's hosts from the
// `https://` literals in cli/src, naming it here is what lets /apply classify a
// pasted www.infojobs.net posting as an installed portal.
export const OFFER_WEB_URL = "https://www.infojobs.net"
// The search resource is version 9 and the detail resource version 7, per the
// developer docs' "Resource URL" fields (operation names offer-list-9 /
// offer-get-7). The docs' examples still show older versions; see
// url-reference.md for the discrepancy.
export const SEARCH_PATH = "/api/9/offer"
export const DETAIL_PATH = "/api/7/offer"
export const TOKEN_PATH = "/api/oauth/access_token"

const UA = "Mozilla/5.0 (compatible; infojobs-cli/1.0)"

/** An error the CLI should report verbatim with its own error `code`. */
export class CliError extends Error {
  readonly code: string
  constructor(message: string, code: string) {
    super(message)
    this.name = "CliError"
    this.code = code
  }
}

export function writeError(error: string, code: string): void {
  process.stderr.write(JSON.stringify({ error, code }) + "\n")
}

/**
 * Report a thrown error the standard way and return the exit code. A CliError
 * keeps its own `code` (MISSING_CREDENTIALS, AUTH_FAILED, ...); anything else
 * gets the caller's command-level fallback code.
 */
export function writeCliError(e: unknown, fallbackCode: string): number {
  if (e instanceof CliError) {
    writeError(e.message, e.code)
    return 1
  }
  writeError(e instanceof Error ? e.message : String(e), fallbackCode)
  return 1
}

interface Credentials {
  clientId: string
  clientSecret: string
}

/**
 * Read the app credentials from the environment. Returns null when either
 * variable is unset or blank - the caller turns that into MISSING_CREDENTIALS
 * without making a request.
 */
export function readCredentials(env: Record<string, string | undefined> = process.env): Credentials | null {
  const clientId = (env.INFOJOBS_CLIENT_ID ?? "").trim()
  const clientSecret = (env.INFOJOBS_CLIENT_SECRET ?? "").trim()
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret }
}

function credentialsError(): CliError {
  return new CliError(
    "InfoJobs API credentials are not set. Export INFOJOBS_CLIENT_ID and INFOJOBS_CLIENT_SECRET " +
      "(free app registration at https://developer.infojobs.net) before running this skill.",
    "MISSING_CREDENTIALS",
  )
}

function base64(value: string): string {
  return Buffer.from(value, "utf8").toString("base64")
}

// The computed Authorization header is cached in memory for the process, so a
// run that makes several calls authenticates once.
let cachedAuth: string | null = null

/** Forget the cached Authorization header (used by tests and on a 401 retry). */
export function resetAuthCache(): void {
  cachedAuth = null
}

/** The app HTTP Basic header for the given credentials. */
export function basicHeader(c: Credentials): string {
  return `Basic ${base64(`${c.clientId}:${c.clientSecret}`)}`
}

interface TokenResponse {
  access_token?: string
  token_type?: string
  expires_in?: number
}

/**
 * Try to obtain an OAuth2 access token via the client-credentials grant. Any
 * failure (unsupported grant, bad credentials, transient outage) yields null so
 * the caller falls back to app Basic authentication rather than failing the run
 * on an optional optimisation.
 */
async function tryAccessToken(c: Credentials): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}${TOKEN_PATH}?grant_type=client_credentials`, {
      method: "POST",
      headers: { Authorization: basicHeader(c), Accept: "application/json" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) return null
    const body = (await res.json().catch(() => null)) as TokenResponse | null
    return body?.access_token ? body.access_token : null
  } catch {
    return null
  }
}

/**
 * The Authorization header for InfoJobs API calls: app Basic, plus a Bearer
 * token when client-credentials issues one. Throws MISSING_CREDENTIALS (before
 * any request) when the environment variables are unset.
 */
export async function authHeader(
  env: Record<string, string | undefined> = process.env,
  force = false,
): Promise<string> {
  const creds = readCredentials(env)
  if (!creds) throw credentialsError()
  if (cachedAuth && !force) return cachedAuth
  const basic = basicHeader(creds)
  const token = await tryAccessToken(creds)
  cachedAuth = token ? `${basic},Bearer ${token}` : basic
  return cachedAuth
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

/**
 * GET a JSON resource from the InfoJobs API. Retries 429/5xx (transient server
 * states) with exponential backoff and jitter; returns `null` on a 404. A 401
 * or 403 is an authentication failure and fails fast with AUTH_FAILED.
 */
export async function apiGet<T>(path: string): Promise<T | null> {
  const auth = await authHeader()
  const url = `${BASE_URL}${path}`
  const maxRetries = 6
  let delay = 500

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let response: Response
    try {
      response = await fetch(url, {
        headers: { "User-Agent": UA, Accept: "application/json", Authorization: auth },
        redirect: "follow",
        signal: AbortSignal.timeout(20000),
      })
    } catch (e) {
      throw new Error(
        `could not reach the InfoJobs API at ${BASE_URL} (${e instanceof Error ? e.message : String(e)})`,
      )
    }

    if (response.status === 429 || response.status >= 500) {
      if (attempt === maxRetries) {
        throw new Error(`InfoJobs API request failed: ${response.status} ${response.statusText}`)
      }
      await sleep(delay + Math.floor(Math.random() * 500))
      delay = Math.min(delay * 2, 8000)
      continue
    }

    if (response.status === 404) return null

    const text = await response.text()
    let body: unknown = null
    try {
      body = text ? JSON.parse(text) : null
    } catch {
      body = null
    }

    if (!response.ok) {
      const record = (body ?? {}) as Record<string, unknown>
      const detail =
        (typeof record.error_description === "string" && record.error_description) ||
        (typeof record.message === "string" && record.message) ||
        (typeof record.error === "string" && record.error) ||
        `${response.status} ${response.statusText}`
      if (response.status === 401 || response.status === 403) {
        throw new CliError(
          `InfoJobs rejected the credentials (HTTP ${response.status}: ${detail}). ` +
            "Check INFOJOBS_CLIENT_ID and INFOJOBS_CLIENT_SECRET.",
          "AUTH_FAILED",
        )
      }
      throw new Error(`InfoJobs API request failed: ${detail}`)
    }

    if (body === null) throw new Error("InfoJobs API returned an unparseable response body")
    return body as T
  }
  // Unreachable in practice; the loop returns or throws on the last attempt.
  throw new Error("InfoJobs API request failed after retries")
}

/** A dictionary / "PD" value: InfoJobs returns `{id, value, ...}` objects. */
export interface Pd {
  id?: number | string
  key?: string
  value?: string
  order?: number
  parent?: number
}

/** The `author` of an offer (the publishing company). */
export interface Author {
  id?: string
  name?: string
  uri?: string
  logoUrl?: string
  corporateResponsive?: boolean
  showCorporativeHeader?: boolean
}

/** A salary value in the detail operation. */
export interface Pay {
  amount?: number
  amountId?: number
  amountValue?: string
  periodId?: number
  periodValue?: string
}

/** A job offer as returned by the search operation (the fields this skill reads). */
export interface InfoJobsOffer {
  id?: string
  title?: string
  category?: Pd
  subcategory?: Pd
  link?: string
  city?: string
  province?: Pd
  multiProvince?: boolean
  author?: Author
  updated?: string
  published?: string
  applications?: string
  bold?: boolean
  salaryMin?: Pd
  salaryMax?: Pd
  salaryPeriod?: Pd
  salaryDescription?: string
  contractType?: Pd
  workDay?: Pd
  study?: Pd
  experienceMin?: Pd
  requirementMin?: string
  executive?: boolean
  teleworking?: Pd
  priority?: boolean
}

/** The search operation's response envelope. */
export interface InfoJobsSearchResponse {
  offers?: InfoJobsOffer[]
  totalResults?: number
  currentResults?: number
  totalPages?: number
  currentPage?: number
  pageSize?: number
  facets?: unknown[]
  availableSortingMethods?: string[]
  sortBy?: string
  sinceDate?: string
  queryParameters?: unknown
}

/** A job offer as returned by the detail operation (adds the full description). */
export interface InfoJobsOfferDetail extends InfoJobsOffer {
  subcategories?: Pd[]
  description?: string
  minRequirements?: string
  desiredRequirements?: string
  creationDate?: string
  updateDate?: string
  externalUrlForm?: string
  active?: boolean
  archived?: boolean
  deleted?: boolean
  // The detail response names the working day `journey` and the studies
  // `studiesMin`, where the search response uses `workDay` / `study`.
  journey?: Pd
  studiesMin?: Pd
  state?: number
  availableForVisualization?: boolean
  disponibleForFullVisualization?: boolean
  vacancies?: number
  referenceId?: string
  zipCode?: string
  contractDuration?: string
  schedule?: string
  jobLevel?: Pd
  showPay?: boolean
  minPay?: Pay
  maxPay?: Pay
  skillsList?: Array<{ skill?: string }> | { skill?: string | string[] }
  profile?: {
    id?: string
    name?: string
    description?: string
    province?: Pd
    numberWorkers?: number
    web?: string
    websiteUrl?: string
    logoUrl?: string
    hidden?: boolean
  }
}

/** A search result in the portal-skill contract shape. */
export interface JobResult {
  id: string
  title: string
  company: string | null
  companyId: string | null
  location: string | null
  city: string | null
  province: string | null
  date: string | null
  url: string
  salary: string | null
  salaryPeriod: string | null
  contractType: string | null
  workDay: string | null
  study: string | null
  experienceMin: string | null
  teleworking: string | null
  requirementMin: string | null
  applications: string | null
  updated: string | null
  bold: boolean
  executive: boolean
  multiProvince: boolean
}

/** A job detail: the search result plus the full description and apply info. */
export interface JobDetailResult extends JobResult {
  description: string | null
  minRequirements: string | null
  desiredRequirements: string | null
  deadline: string | null
  applyUrl: string | null
  externalApply: boolean
  active: boolean | null
  skills: string[]
  vacancies: number | null
  referenceId: string | null
  contractDuration: string | null
  schedule: string | null
  companyProfile: string | null
}

function trim(value: string | null | undefined): string {
  return (value ?? "").trim()
}

function pdValue(pd: Pd | undefined): string | null {
  const value = trim(pd?.value)
  return value || null
}

/**
 * Reshape an InfoJobs offer into the contract search-result fields. `location`
 * prefers the specific city and falls back to the province; missing values are
 * `null`, never omitted.
 */
export function toResult(o: InfoJobsOffer): JobResult {
  const city = trim(o.city)
  const province = pdValue(o.province)
  return {
    id: trim(o.id),
    title: trim(o.title) || "(untitled)",
    company: o.author?.name ? trim(o.author.name) : null,
    companyId: o.author?.id ? String(o.author.id) : null,
    location: city || province || null,
    city: city || null,
    province,
    date: trim(o.published) || null,
    url: trim(o.link),
    salary: trim(o.salaryDescription) || null,
    salaryPeriod: pdValue(o.salaryPeriod),
    contractType: pdValue(o.contractType),
    workDay: pdValue(o.workDay),
    study: pdValue(o.study),
    experienceMin: pdValue(o.experienceMin),
    teleworking: pdValue(o.teleworking),
    requirementMin: cleanText(o.requirementMin),
    applications: o.applications != null ? String(o.applications) : null,
    updated: trim(o.updated) || null,
    bold: o.bold === true,
    executive: o.executive === true,
    multiProvince: o.multiProvince === true,
  }
}

/** The offer's skills, tolerating the array and object shapes seen in the docs. */
function extractSkills(list: InfoJobsOfferDetail["skillsList"]): string[] {
  if (!list) return []
  const items = Array.isArray(list) ? list : [list]
  const skills: string[] = []
  for (const item of items) {
    const raw = item?.skill
    const values = Array.isArray(raw) ? raw : [raw]
    for (const s of values) {
      const skill = trim(typeof s === "string" ? s : undefined)
      if (skill && !skills.includes(skill)) skills.push(skill)
    }
  }
  return skills
}

/** Human-readable salary line from the search fields, or null. */
function searchSalary(o: InfoJobsOffer): string | null {
  if (trim(o.salaryDescription)) return trim(o.salaryDescription)
  const min = pdValue(o.salaryMin)
  const max = pdValue(o.salaryMax)
  const period = pdValue(o.salaryPeriod)
  if (!min && !max) return null
  let range = min && max && min !== max ? `${min} - ${max}` : min || max || ""
  if (period) range = `${range} ${period}`.trim()
  return range || null
}

/** Detail salary line from minPay/maxPay, or the search fields as a fallback. */
function detailSalary(o: InfoJobsOfferDetail): string | null {
  const min = trim(o.minPay?.amountValue)
  const max = trim(o.maxPay?.amountValue)
  const period = trim(o.minPay?.periodValue) || trim(o.maxPay?.periodValue)
  if (min || max) {
    let range = min && max && min !== max ? `${min} - ${max}` : min || max
    if (period) range = `${range} ${period}`.trim()
    return range || null
  }
  return searchSalary(o)
}

/**
 * Reshape an InfoJobs offer into the detail result: the search fields plus the
 * full description, requirements, apply target, and status. `deadline` is
 * always `null` - InfoJobs exposes no application-deadline field.
 */
export function toDetail(o: InfoJobsOfferDetail, id: string, fallbackUrl: string): JobDetailResult {
  const base = toResult(o)
  const externalUrl = trim(o.externalUrlForm)
  return {
    ...base,
    id: trim(o.id) || id,
    // The search response names the publisher `author`; the detail response
    // nests it under `profile`, so fall back to it for the company fields.
    company: base.company ?? (trim(o.profile?.name) || null),
    companyId: base.companyId ?? (trim(o.profile?.id) || null),
    // The detail response carries no `published` / `updated` / `workDay` /
    // `study`; fall back to creationDate/updateDate and the detail spellings.
    date: (base.date ?? trim(o.creationDate)) || null,
    updated: (base.updated ?? trim(o.updateDate)) || null,
    workDay: pdValue(o.journey) ?? base.workDay,
    study: pdValue(o.studiesMin) ?? base.study,
    requirementMin: base.requirementMin ?? cleanText(o.minRequirements),
    url: base.url || fallbackUrl,
    salary: detailSalary(o),
    description: cleanText(o.description),
    minRequirements: cleanText(o.minRequirements),
    desiredRequirements: cleanText(o.desiredRequirements),
    deadline: null,
    applyUrl: externalUrl || base.url || fallbackUrl || null,
    externalApply: externalUrl !== "",
    active: typeof o.active === "boolean" ? o.active : null,
    skills: extractSkills(o.skillsList),
    vacancies: typeof o.vacancies === "number" ? o.vacancies : null,
    referenceId: trim(o.referenceId) || null,
    contractDuration: trim(o.contractDuration) || null,
    schedule: trim(o.schedule) || null,
    companyProfile: cleanText(o.profile?.description),
  }
}

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
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, dec) => numericEntity(parseInt(dec, 10)))
    .replace(/&#[xX]([0-9a-fA-F]+);/g, (_, hex) => numericEntity(parseInt(hex, 16)))
}

/**
 * Normalize an offer text field into readable prose: entities decoded, tags
 * stripped, CRLF normalized, runs of blank lines collapsed. InfoJobs returns
 * plain text with `\r\n` separators, but a few fields can carry markup; both
 * are handled. Returns null for empty input.
 */
export function cleanText(value: string | null | undefined): string | null {
  if (value == null) return null
  const text = decodeHtmlEntities(value)
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|li|ul|ol|div|h\d)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\r\n?/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
  return text || null
}
