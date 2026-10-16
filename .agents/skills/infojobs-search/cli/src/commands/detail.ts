import {
  apiGet,
  toDetail,
  writeCliError,
  DETAIL_PATH,
  OFFER_WEB_URL,
  type InfoJobsOfferDetail,
  type JobDetailResult,
} from "../helpers.js"

export interface DetailOpts {
  id: string // a bare InfoJobs offer id or a full infojobs.net offer URL
  format: "json" | "plain"
}

// The InfoJobs offer host and its subdomains. A look-alike host
// ("infojobs.net.evil.io") fails the anchored test; a foreign ATS link fails
// the host test entirely.
const INFOJOBS_HOST = /(^|\.)infojobs\.net$/i
// InfoJobs offer ids are ~30-32 lowercase hex characters; the bound is loose so
// a future id shape still resolves while nonsense is still rejected.
const BARE_ID = /^[A-Za-z0-9]{16,64}$/

/**
 * Resolve a `detail` argument to a bare InfoJobs offer id, or null.
 *
 * Search results emit the bare id. A full infojobs.net URL is accepted too:
 * the id is read from the `.../of-i<id>` slug, or from any path segment that
 * looks like an id. Any other host is rejected, so a look-alike or an external
 * apply link never becomes an API fetch.
 */
export function resolveId(idOrUrl: string): string | null {
  const raw = idOrUrl.trim()
  if (!raw) return null

  if (/^https?:\/\//i.test(raw)) {
    let parsed: URL
    try {
      parsed = new URL(raw)
    } catch {
      return null
    }
    if (!INFOJOBS_HOST.test(parsed.hostname)) return null
    const slug = parsed.pathname.match(/of-i([A-Za-z0-9]{16,64})/i)
    if (slug) return slug[1]
    const segment = parsed.pathname.split("/").find((s) => BARE_ID.test(s))
    return segment ?? null
  }

  return BARE_ID.test(raw) ? raw : null
}

function renderPlain(job: JobDetailResult): string {
  const lines: string[] = [job.title, `${job.company ?? "—"} · ${job.location ?? "—"}`]
  const field = (label: string, value: string | number | null | undefined) => {
    if (value !== null && value !== undefined && value !== "") lines.push(`${label}: ${value}`)
  }
  field("Posted", job.date && job.date.slice(0, 10))
  field("Contract", job.contractType)
  field("Workday", job.workDay)
  field("Experience", job.experienceMin)
  field("Studies", job.study)
  field("Salary", job.salary)
  field("Vacancies", job.vacancies)
  field("Reference", job.referenceId)
  field("Skills", job.skills.length ? job.skills.join(", ") : null)
  field("Deadline", job.deadline)
  field("Apply", job.applyUrl)
  if (job.externalApply) lines.push("Apply mode: external (redirects to the employer's site)")
  lines.push("", job.description || "(no description)")
  if (job.minRequirements) lines.push("", "Minimum requirements:", job.minRequirements)
  if (job.desiredRequirements) lines.push("", "Desired requirements:", job.desiredRequirements)
  lines.push("", `URL: ${job.url}`, `id: ${job.id}`)
  return lines.join("\n")
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const id = resolveId(opts.id)
  if (!id) {
    writeCliError(
      new Error(
        `Could not parse an InfoJobs offer from "${opts.id}". Pass the "id" from search output or a full infojobs.net offer URL.`,
      ),
      "BAD_ID",
    )
    return 1
  }
  try {
    const offer = await apiGet<InfoJobsOfferDetail>(`${DETAIL_PATH}/${encodeURIComponent(id)}`)
    if (!offer) {
      writeCliError(new Error("Offer not found"), "NOT_FOUND")
      return 1
    }
    const job = toDetail(offer, id, `${OFFER_WEB_URL}/of-i${id}`)

    if (opts.format === "plain") {
      process.stdout.write(renderPlain(job) + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    return writeCliError(e, "DETAIL_FAILED")
  }
}
