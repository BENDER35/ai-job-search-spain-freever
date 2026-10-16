import { BASE_URL, htmlFetch, parseJobDetail, writeError, type JobDetail } from "../helpers.js"

export interface DetailOpts {
  id: string // a canonical path id ("slug/skills/rf-<hash>") or a full tecnoempleo.com URL
  format: "json" | "plain"
}

const TECNOEMPLEO_HOST = /(^|\.)tecnoempleo\.com$/i
const ID_PATH = /^[A-Za-z0-9._-]+(?:\/[A-Za-z0-9._-]+)*\/rf-[0-9a-f]+$/i

/**
 * Resolve a `detail` argument to a canonical { url, id }, or null.
 *
 * Search results emit `id` as the bare path after the host
 * ("desarrollador-python-arelance/cloud-git/rf-..."), because Tecnoempleo has no
 * scheme-free short URL: the slug segment is required to fetch the page (a bare
 * `rf-<hash>` 404s). A full tecnoempleo.com URL is accepted too. Any other host
 * is rejected so a look-alike or an external ATS link never becomes a fetch.
 */
export function buildUrl(idOrUrl: string): { url: string; id: string } | null {
  const trimmed = idOrUrl.trim()
  if (/^https?:\/\//i.test(trimmed)) {
    let parsed: URL
    try {
      parsed = new URL(trimmed)
    } catch {
      return null
    }
    if (!TECNOEMPLEO_HOST.test(parsed.hostname)) return null
    const path = parsed.pathname.replace(/^\/+/, "").replace(/\/+$/, "")
    const m = path.match(/^(.+\/rf-[0-9a-f]+)$/i)
    if (!m) return null
    return { url: `${BASE_URL}/${m[1]}`, id: m[1] }
  }

  if (ID_PATH.test(trimmed.replace(/^\/+/, ""))) {
    const id = trimmed.replace(/^\/+/, "")
    return { url: `${BASE_URL}/${id}`, id }
  }
  return null
}

function renderPlain(job: JobDetail): string {
  const lines: string[] = [job.title, `${job.company || "—"} · ${job.location || "—"}`]
  const field = (label: string, value: string | null | undefined) => {
    if (value) lines.push(`${label}: ${value}`)
  }
  field("Modality", job.workMode)
  field("Function", job.category)
  field("Posted", job.date)
  field("Employment", job.employmentType)
  field("Salary", job.salary)
  field("Skills", job.skills.length ? job.skills.join(", ") : null)
  field("Deadline", job.deadline)
  field("Apply", job.applyUrl)
  if (job.externalApply) lines.push("Apply mode: external (redirects to the employer's site)")
  lines.push("", job.description || "(no description)", "", `URL: ${job.url}`, `id: ${job.id}`)
  return lines.join("\n")
}

export async function runDetail(opts: DetailOpts): Promise<number> {
  const parsed = buildUrl(opts.id)
  if (!parsed) {
    writeError(
      `Could not parse a Tecnoempleo job from "${opts.id}". Pass the "url" or "id" from search output (a bare rf-<hash> cannot be resolved without its slug).`,
      "BAD_ID",
    )
    return 1
  }
  try {
    const html = await htmlFetch(parsed.url)
    if (!html) {
      writeError("Job not found", "NOT_FOUND")
      return 1
    }
    const job = parseJobDetail(html, parsed.url, parsed.id)

    if (opts.format === "plain") {
      process.stdout.write(renderPlain(job) + "\n")
    } else {
      process.stdout.write(JSON.stringify(job, null, 2) + "\n")
    }
    return 0
  } catch (e) {
    writeError(e instanceof Error ? e.message : String(e), "DETAIL_FAILED")
    return 1
  }
}
